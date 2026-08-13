import { createHash } from 'node:crypto';
import { csvToObjects } from './csv.mjs';

export const OPENCLAW_REQUIRED_FIELDS = [
  'ecosystem_id', 'category', 'project', 'repo_slug', 'repo_url',
  'provided_description', 'capability_layer', 'execution_mode', 'primary_language',
  'local_first', 'platform_fit', 'primary_fit', 'strategic_value_score',
  'priority_tier', 'recommended_action', 'why_valuable_to_us', 'integration_pattern',
  'main_risk_or_overlap', 'security_review_required', 'source_basis', 'review_status'
];

const SECURITY_REVIEW = new Set(['Yes', 'No', 'Mandatory']);
const LOCAL_FIRST = new Set(['Yes', 'No', 'Partial']);

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

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

export function normalizeOpenClawCatalog(catalogCsv) {
  const projects = csvToObjects(catalogCsv).map((row) => ({
    ...row,
    strategic_value_score: Number(row.strategic_value_score)
  }));

  return {
    schema_version: '1.0',
    inventory_id: 'external-openclaw-ecosystem',
    ecosystem: 'OpenClaw',
    source_type: 'external-ecosystem-inventory',
    authority: 'reference-only',
    native_promotion: 'explicit-foundry-review-required',
    count: projects.length,
    projects
  };
}

export function normalizeOpenClawSchema(schemaCsv) {
  return {
    schema_version: '1.0',
    inventory_id: 'external-openclaw-ecosystem',
    source_type: 'external-ecosystem-schema',
    fields: csvToObjects(schemaCsv)
  };
}

function indexProject(project) {
  return {
    ecosystem_id: project.ecosystem_id,
    category: project.category,
    project: project.project,
    repo_slug: project.repo_slug,
    repo_url: project.repo_url,
    capability_layer: project.capability_layer,
    execution_mode: project.execution_mode,
    local_first: project.local_first,
    platform_fit: project.platform_fit,
    strategic_value_score: project.strategic_value_score,
    priority_tier: project.priority_tier,
    recommended_action: project.recommended_action,
    security_review_required: project.security_review_required,
    review_status: project.review_status
  };
}

export function buildOpenClawIndex(catalog) {
  return {
    schema_version: '1.0',
    inventory_id: catalog.inventory_id,
    ecosystem: catalog.ecosystem,
    authority: catalog.authority,
    native_promotion: catalog.native_promotion,
    count: catalog.count,
    projects: catalog.projects.map(indexProject)
  };
}

export function shardOpenClawIndex(index, size = 5) {
  const shards = {};
  for (let offset = 0; offset < index.projects.length; offset += size) {
    const number = String(offset / size + 1).padStart(2, '0');
    const projects = index.projects.slice(offset, offset + size);
    shards[`part-${number}.json`] = {
      schema_version: index.schema_version,
      inventory_id: index.inventory_id,
      ecosystem: index.ecosystem,
      authority: index.authority,
      native_promotion: index.native_promotion,
      part: offset / size + 1,
      count: projects.length,
      projects
    };
  }
  return shards;
}

export function combineOpenClawIndexShards(shards) {
  const ordered = Object.entries(shards).sort(([a], [b]) => a.localeCompare(b)).map(([, shard]) => shard);
  const projects = ordered.flatMap((shard) => shard.projects ?? []);
  return {
    schema_version: '1.0',
    inventory_id: 'external-openclaw-ecosystem',
    ecosystem: 'OpenClaw',
    authority: 'reference-only',
    native_promotion: 'explicit-foundry-review-required',
    count: projects.length,
    projects
  };
}

export function buildOpenClawSummary(catalog, catalogCsv, schemaCsv) {
  const p0 = catalog.projects.filter((project) => String(project.priority_tier).startsWith('P0'));
  const p1 = catalog.projects.filter((project) => String(project.priority_tier).startsWith('P1'));

  return {
    schema_version: '1.0',
    inventory_id: catalog.inventory_id,
    ecosystem: catalog.ecosystem,
    count: catalog.count,
    architecture_policy: 'external-reference-only',
    native_promotion_count: 0,
    source_hashes: {
      catalog_sha256: sha256(catalogCsv),
      schema_sha256: sha256(schemaCsv)
    },
    counts: {
      category: countBy(catalog.projects, 'category'),
      priority_tier: countBy(catalog.projects, 'priority_tier'),
      local_first: countBy(catalog.projects, 'local_first'),
      security_review_required: countBy(catalog.projects, 'security_review_required'),
      review_status: countBy(catalog.projects, 'review_status')
    },
    immediate_evaluation: p0.map(({ ecosystem_id, project, repo_url, strategic_value_score }) => ({
      ecosystem_id, project, repo_url, strategic_value_score
    })),
    high_value_prototype: p1.map(({ ecosystem_id, project, repo_url, strategic_value_score }) => ({
      ecosystem_id, project, repo_url, strategic_value_score
    }))
  };
}

export function importOpenClawSource(catalogCsv, schemaCsv) {
  const catalog = normalizeOpenClawCatalog(catalogCsv);
  const index = buildOpenClawIndex(catalog);
  const schema = normalizeOpenClawSchema(schemaCsv);
  const summary = buildOpenClawSummary(catalog, catalogCsv, schemaCsv);
  return { catalog, index, schema, summary };
}

export function validateOpenClawInventory({ catalog, index, schema, summary }) {
  const errors = [];

  if (catalog?.schema_version !== '1.0') errors.push('OpenClaw catalog schema_version must be 1.0');
  if (catalog?.inventory_id !== 'external-openclaw-ecosystem') errors.push('OpenClaw catalog inventory_id mismatch');
  if (catalog?.authority !== 'reference-only') errors.push('OpenClaw catalog authority must remain reference-only');
  if (!Array.isArray(catalog?.projects)) errors.push('OpenClaw catalog projects must be an array');
  if (catalog?.count !== catalog?.projects?.length) errors.push('OpenClaw catalog count mismatch');

  const ids = new Set();
  for (const [position, project] of (catalog?.projects ?? []).entries()) {
    const where = `OpenClaw project ${position + 1}`;
    for (const field of OPENCLAW_REQUIRED_FIELDS) {
      if (project[field] === undefined || project[field] === null || project[field] === '') errors.push(`${where}: missing ${field}`);
    }
    if (!/^OC-\d{3}$/.test(project.ecosystem_id ?? '')) errors.push(`${where}: invalid ecosystem_id`);
    if (ids.has(project.ecosystem_id)) errors.push(`${where}: duplicate ecosystem_id ${project.ecosystem_id}`);
    ids.add(project.ecosystem_id);
    if (!/^https:\/\/github\.com\/openclaw\/[A-Za-z0-9._-]+\/?$/.test(project.repo_url ?? '')) errors.push(`${where}: repo_url must remain within github.com/openclaw/*`);
    if (!Number.isInteger(project.strategic_value_score) || project.strategic_value_score < 0 || project.strategic_value_score > 100) errors.push(`${where}: strategic_value_score must be integer 0..100`);
    const expected = priorityFor(project.strategic_value_score);
    if (!String(project.priority_tier ?? '').startsWith(expected)) errors.push(`${where}: priority_tier does not match strategic_value_score`);
    if (!SECURITY_REVIEW.has(project.security_review_required)) errors.push(`${where}: invalid security_review_required`);
    if (!LOCAL_FIRST.has(project.local_first)) errors.push(`${where}: invalid local_first`);
  }

  if (index?.count !== catalog?.count || index?.projects?.length !== catalog?.count) errors.push('OpenClaw discovery index count mismatch');
  if (index?.authority !== 'reference-only') errors.push('OpenClaw discovery index authority must remain reference-only');

  if (schema?.schema_version !== '1.0' || !Array.isArray(schema?.fields)) errors.push('OpenClaw schema is invalid');
  const schemaNames = new Set((schema?.fields ?? []).map((field) => field.column_name));
  for (const field of OPENCLAW_REQUIRED_FIELDS) if (!schemaNames.has(field)) errors.push(`OpenClaw schema missing field ${field}`);

  if (summary?.count !== catalog?.count) errors.push('OpenClaw summary count mismatch');
  if (summary?.architecture_policy !== 'external-reference-only') errors.push('OpenClaw architecture policy must remain external-reference-only');
  if (summary?.native_promotion_count !== 0) errors.push('OpenClaw import must not promote projects into native skills');

  return errors;
}
