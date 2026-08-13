function normalizeName(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '');
}

function duplicateValues(items, key) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of items) {
    const value = item?.[key];
    if (!value) continue;
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates].sort();
}

function categoryCounts(skills) {
  const counts = new Map();
  for (const skill of skills) counts.set(skill.category_id, (counts.get(skill.category_id) ?? 0) + 1);
  return counts;
}

export function validateV7SourceCensus(census) {
  const errors = [];
  const skills = census?.source_confirmed_skills ?? [];
  const runtimeIds = census?.runtime_bound_ids ?? [];
  const categories = census?.categories ?? [];
  const counts = census?.counts ?? {};

  if (census?.schema_version !== '1.0') errors.push('v7 census schema_version must be 1.0');
  if (census?.authority !== 'source-census') errors.push('v7 census authority must remain source-census');
  if (census?.status?.native_promotion !== 0) errors.push('v7 source census must never perform native promotion');
  if (skills.length !== counts.migration_confirmed_definitions) errors.push('v7 migration-confirmed definition count mismatch');
  if (counts.initial_seed_definitions !== 64) errors.push('v7 initial seed definition count must remain 64');
  if (counts.migration_confirmed_definitions !== 65) errors.push('v7 migration-confirmed definition count must remain 65');
  if (counts.claimed_live_registry !== 88) errors.push('v7 historical public claim changed; source re-census required');
  if (counts.unresolved_live_db_delta !== counts.claimed_live_registry - counts.migration_confirmed_definitions) errors.push('v7 historical inferred delta mismatch');
  if (runtimeIds.length !== counts.runtime_bound_adapters) errors.push('v7 runtime-bound adapter count mismatch');

  const duplicateIds = duplicateValues(skills, 'id');
  if (duplicateIds.length) errors.push(`v7 duplicate source skill id(s): ${duplicateIds.join(', ')}`);

  const ids = new Set(skills.map((skill) => skill.id));
  for (const id of runtimeIds) if (!ids.has(id)) errors.push(`v7 runtime adapter references unknown source skill ${id}`);

  const actualCategoryCounts = categoryCounts(skills);
  const categoryIds = new Set(categories.map((category) => category.id));
  for (const skill of skills) {
    if (!skill.id || !skill.name || !skill.category_id) errors.push(`v7 source skill missing required fields: ${JSON.stringify(skill)}`);
    if (!categoryIds.has(skill.category_id)) errors.push(`v7 source skill ${skill.id} references unknown category ${skill.category_id}`);
  }
  for (const category of categories) {
    const actual = actualCategoryCounts.get(category.id) ?? 0;
    if (actual !== category.migration_confirmed_count) errors.push(`v7 category ${category.id} count mismatch: ${actual} != ${category.migration_confirmed_count}`);
  }

  const migrationTotal = categories.reduce((sum, category) => sum + category.migration_confirmed_count, 0);
  const seedTotal = categories.reduce((sum, category) => sum + category.seed_count, 0);
  if (migrationTotal !== counts.migration_confirmed_definitions) errors.push('v7 category migration total mismatch');
  if (seedTotal !== counts.initial_seed_definitions) errors.push('v7 category seed total mismatch');

  return errors;
}

export function normalizeV7LiveExport(value) {
  const rows = Array.isArray(value) ? value : value?.skills;
  if (!Array.isArray(rows)) throw new Error('Live v7 export must be an array or an object containing a skills array');
  return rows.map((row, index) => {
    if (!row?.id || !row?.name) throw new Error(`Live v7 row ${index + 1} must contain id and name`);
    return {
      ...row,
      id: String(row.id),
      name: String(row.name),
      category_id: row.category_id == null ? null : String(row.category_id)
    };
  });
}

export function reconcileV7({ census, nativeIndex, liveRows = null, liveContractCount = null }) {
  const errors = validateV7SourceCensus(census);
  if (errors.length) throw new Error(`Invalid v7 source census:\n- ${errors.join('\n- ')}`);
  if (!nativeIndex || !Array.isArray(nativeIndex.skills)) throw new Error('nativeIndex.skills is required');

  const source = census.source_confirmed_skills;
  const native = nativeIndex.skills;
  const sourceById = new Map(source.map((skill) => [skill.id, skill]));
  const nativeById = new Map(native.map((skill) => [skill.id, skill]));
  const nativeByName = new Map();
  for (const skill of native) {
    const key = normalizeName(skill.name);
    if (!nativeByName.has(key)) nativeByName.set(key, []);
    nativeByName.get(key).push(skill);
  }

  const exactNativeMatches = [];
  const nativeIdCollisions = [];
  const nativeNameMatches = [];
  const sourceOnly = [];

  for (const sourceSkill of source) {
    const byId = nativeById.get(sourceSkill.id);
    if (byId) {
      if (normalizeName(byId.name) === normalizeName(sourceSkill.name)) {
        exactNativeMatches.push({ id: sourceSkill.id, name: sourceSkill.name, native_slug: byId.slug });
      } else {
        nativeIdCollisions.push({ id: sourceSkill.id, v7_name: sourceSkill.name, native_name: byId.name, native_slug: byId.slug });
      }
      continue;
    }

    const byName = nativeByName.get(normalizeName(sourceSkill.name)) ?? [];
    if (byName.length) {
      nativeNameMatches.push({
        v7_id: sourceSkill.id,
        v7_name: sourceSkill.name,
        native: byName.map((skill) => ({ id: skill.id, name: skill.name, slug: skill.slug }))
      });
    } else {
      sourceOnly.push(sourceSkill);
    }
  }

  const nativeOnly = native
    .filter((skill) => !sourceById.has(skill.id))
    .map((skill) => ({ id: skill.id, name: skill.name, slug: skill.slug, category: skill.category }));

  const currentContractCount = liveContractCount ?? census.counts.claimed_live_registry;
  const live = liveRows ? normalizeV7LiveExport(liveRows) : null;
  const liveAnalysis = live ? analyzeLive(census, source, live, currentContractCount) : {
    status: 'required',
    count: null,
    historical_claimed_count: census.counts.claimed_live_registry,
    claimed_count: currentContractCount,
    unresolved_delta: census.counts.unresolved_live_db_delta,
    live_only: [],
    source_missing_from_live: [],
    duplicate_ids: [],
    count_matches_claim: null,
    identity_matches_source: null
  };

  const blockingFindings = [];
  if (!live) blockingFindings.push({ code: 'live_db_export_required', detail: `${census.counts.unresolved_live_db_delta} records were historically unresolved against the stale ${census.counts.claimed_live_registry}-skill product claim.` });
  if (nativeIdCollisions.length) blockingFindings.push({ code: 'native_id_collisions', detail: `${nativeIdCollisions.length} v7 IDs collide with different native definitions.`, ids: nativeIdCollisions.map((item) => item.id) });
  if (live && liveAnalysis.duplicate_ids.length) blockingFindings.push({ code: 'live_duplicate_ids', detail: 'Authoritative live export contains duplicate IDs.', ids: liveAnalysis.duplicate_ids });
  if (live && !liveAnalysis.count_matches_claim) blockingFindings.push({ code: 'live_count_contract_mismatch', detail: `Live export count ${liveAnalysis.count} does not match current authoritative claim ${currentContractCount}.` });
  if (live && liveAnalysis.source_missing_from_live.length) blockingFindings.push({ code: 'migration_rows_missing_live', detail: `${liveAnalysis.source_missing_from_live.length} migration-confirmed definitions are absent from the live export.` });
  if (live && liveAnalysis.live_only.length) blockingFindings.push({ code: 'live_rows_missing_source', detail: `${liveAnalysis.live_only.length} live definitions are absent from the migration-confirmed source census.` });

  return {
    schema_version: '1.0',
    census_id: census.census_id,
    source_commit_sha: census.source.commit_sha,
    counts: {
      historical_claimed_live_registry: census.counts.claimed_live_registry,
      claimed_live_registry: currentContractCount,
      source_confirmed: source.length,
      runtime_bound: census.runtime_bound_ids.length,
      native: native.length,
      exact_native_matches: exactNativeMatches.length,
      native_id_collisions: nativeIdCollisions.length,
      native_name_matches: nativeNameMatches.length,
      source_only: sourceOnly.length,
      native_only: nativeOnly.length,
      live: liveAnalysis.count,
      live_only: liveAnalysis.live_only.length,
      source_missing_from_live: liveAnalysis.source_missing_from_live.length
    },
    exact_native_matches: exactNativeMatches,
    native_id_collisions: nativeIdCollisions,
    native_name_matches: nativeNameMatches,
    source_only: sourceOnly,
    native_only: nativeOnly,
    runtime_bound_ids: census.runtime_bound_ids,
    live: liveAnalysis,
    native_promotion_count: 0,
    safe_to_shadow: Boolean(live) && blockingFindings.length === 0,
    blocking_findings: blockingFindings
  };
}

function analyzeLive(census, source, live, currentContractCount) {
  const sourceIds = new Set(source.map((skill) => skill.id));
  const liveIds = new Set(live.map((skill) => skill.id));
  const liveOnly = live.filter((skill) => !sourceIds.has(skill.id)).map((skill) => ({ id: skill.id, name: skill.name, category_id: skill.category_id }));
  const sourceMissingFromLive = source.filter((skill) => !liveIds.has(skill.id));
  return {
    status: 'provided',
    count: live.length,
    historical_claimed_count: census.counts.claimed_live_registry,
    claimed_count: currentContractCount,
    unresolved_delta: Math.max(0, live.length - source.length),
    live_only: liveOnly,
    source_missing_from_live: sourceMissingFromLive,
    duplicate_ids: duplicateValues(live, 'id'),
    count_matches_claim: live.length === currentContractCount,
    identity_matches_source: liveOnly.length === 0 && sourceMissingFromLive.length === 0 && live.length === source.length
  };
}
