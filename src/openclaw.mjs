export const OPENCLAW_SOURCE_HASHES = Object.freeze({
  catalog_sha256: '9dd8245275351bbc33a0095f33b03904e2fb0a64e876a286842c821254760b7e',
  schema_sha256: '128c53e684471bdec8ba2946be82133a1d0b724a49884752d91d567123ccd221'
});

export const OPENCLAW_SOURCE_FIELDS = [
  'ecosystem_id', 'category', 'project', 'repo_slug', 'repo_url',
  'provided_description', 'capability_layer', 'execution_mode', 'primary_language',
  'local_first', 'platform_fit', 'primary_fit', 'strategic_value_score',
  'priority_tier', 'recommended_action', 'why_valuable_to_us', 'integration_pattern',
  'main_risk_or_overlap', 'security_review_required', 'source_basis', 'review_status'
];

export const OPENCLAW_INDEX_FIELDS = [
  'ecosystem_id', 'category', 'project', 'repo_slug', 'repo_url',
  'capability_layer', 'execution_mode', 'local_first', 'platform_fit',
  'strategic_value_score', 'priority_tier', 'recommended_action',
  'security_review_required', 'review_status'
];

const SECURITY_REVIEW = new Set(['Yes', 'No', 'Mandatory']);
const LOCAL_FIRST = new Set(['Yes', 'No', 'Partial']);

function priorityFor(score) {
  if (score >= 90) return 'P0';
  if (score >= 80) return 'P1';
  if (score >= 65) return 'P2';
  return 'P3';
}

function countBy(items, key) {
  return Object.fromEntries(
    [...items.reduce((map, item) => map.set(item[key], (map.get(item[key]) ?? 0) + 1), new Map())]
      .sort(([a], [b]) => String(a).localeCompare(String(b)))
  );
}

export function normalizeOpenClawSchema(rows) {
  return {
    schema_version: '1.0',
    inventory_id: 'external-openclaw-ecosystem',
    source_type: 'external-ecosystem-schema',
    fields: rows
  };
}

export function shardOpenClawIndex(index, size = 5) {
  const projects = [...index.projects].sort((a, b) => a.ecosystem_id.localeCompare(b.ecosystem_id));
  const shards = {};
  for (let offset = 0; offset < projects.length; offset += size) {
    const number = String(offset / size + 1).padStart(2, '0');
    const part = projects.slice(offset, offset + size);
    shards[`part-${number}.json`] = {
      schema_version: '1.0', inventory_id: 'external-openclaw-ecosystem', ecosystem: 'OpenClaw',
      authority: 'reference-only', native_promotion: 'explicit-foundry-review-required',
      part: offset / size + 1, count: part.length, projects: part
    };
  }
  return shards;
}

export function combineOpenClawIndexShards(shards) {
  const projects = Object.entries(shards)
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([, shard]) => shard.projects ?? [])
    .sort((a, b) => a.ecosystem_id.localeCompare(b.ecosystem_id));
  return {
    schema_version: '1.0', inventory_id: 'external-openclaw-ecosystem', ecosystem: 'OpenClaw',
    authority: 'reference-only', native_promotion: 'explicit-foundry-review-required',
    count: projects.length, projects
  };
}

export function buildOpenClawSummary(index) {
  const p0 = index.projects.filter((p) => String(p.priority_tier).startsWith('P0'));
  const p1 = index.projects.filter((p) => String(p.priority_tier).startsWith('P1'));
  return {
    schema_version: '1.0', inventory_id: index.inventory_id, ecosystem: index.ecosystem,
    count: index.count, architecture_policy: 'external-reference-only', native_promotion_count: 0,
    source_hashes: OPENCLAW_SOURCE_HASHES,
    counts: {
      category: countBy(index.projects, 'category'),
      priority_tier: countBy(index.projects, 'priority_tier'),
      local_first: countBy(index.projects, 'local_first'),
      security_review_required: countBy(index.projects, 'security_review_required'),
      review_status: countBy(index.projects, 'review_status')
    },
    immediate_evaluation: p0.map(({ ecosystem_id, project, repo_url, strategic_value_score }) => ({ ecosystem_id, project, repo_url, strategic_value_score })),
    high_value_prototype: p1.map(({ ecosystem_id, project, repo_url, strategic_value_score }) => ({ ecosystem_id, project, repo_url, strategic_value_score }))
  };
}

export function validateOpenClawInventory({ index, schema, summary }) {
  const errors = [];
  if (index?.schema_version !== '1.0') errors.push('OpenClaw index schema_version must be 1.0');
  if (index?.inventory_id !== 'external-openclaw-ecosystem') errors.push('OpenClaw index inventory_id mismatch');
  if (index?.authority !== 'reference-only') errors.push('OpenClaw index authority must remain reference-only');
  if (index?.native_promotion !== 'explicit-foundry-review-required') errors.push('OpenClaw native promotion policy changed');
  if (!Array.isArray(index?.projects)) errors.push('OpenClaw index projects must be an array');
  if (index?.count !== index?.projects?.length) errors.push('OpenClaw index count mismatch');

  const ids = new Set();
  for (const [position, project] of (index?.projects ?? []).entries()) {
    const where = `OpenClaw project ${position + 1}`;
    for (const field of OPENCLAW_INDEX_FIELDS) {
      if (project[field] === undefined || project[field] === null || project[field] === '') errors.push(`${where}: missing ${field}`);
    }
    if (!/^OC-\d{3}$/.test(project.ecosystem_id ?? '')) errors.push(`${where}: invalid ecosystem_id`);
    if (ids.has(project.ecosystem_id)) errors.push(`${where}: duplicate ecosystem_id ${project.ecosystem_id}`);
    ids.add(project.ecosystem_id);
    if (!/^https:\/\/github\.com\/openclaw\/[A-Za-z0-9._-]+\/?$/.test(project.repo_url ?? '')) errors.push(`${where}: repo_url must remain within github.com/openclaw/*`);
    if (!Number.isInteger(project.strategic_value_score) || project.strategic_value_score < 0 || project.strategic_value_score > 100) errors.push(`${where}: strategic_value_score must be integer 0..100`);
    if (!String(project.priority_tier ?? '').startsWith(priorityFor(project.strategic_value_score))) errors.push(`${where}: priority_tier does not match strategic_value_score`);
    if (!SECURITY_REVIEW.has(project.security_review_required)) errors.push(`${where}: invalid security_review_required`);
    if (!LOCAL_FIRST.has(project.local_first)) errors.push(`${where}: invalid local_first`);
  }

  if (schema?.schema_version !== '1.0' || !Array.isArray(schema?.fields)) errors.push('OpenClaw schema is invalid');
  const schemaNames = new Set((schema?.fields ?? []).map((field) => field.column_name));
  for (const field of OPENCLAW_SOURCE_FIELDS) if (!schemaNames.has(field)) errors.push(`OpenClaw schema missing field ${field}`);
  if (JSON.stringify(summary) !== JSON.stringify(buildOpenClawSummary(index))) errors.push('OpenClaw summary drifted from external index/provenance metadata');
  return errors;
}
