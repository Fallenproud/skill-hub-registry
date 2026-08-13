from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

FILES = {
"src/openclaw.mjs": r'''export const OPENCLAW_SOURCE_HASHES = Object.freeze({
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
''',
"src/inventory.mjs": r'''import { promises as fs } from 'node:fs';
import path from 'node:path';
import { combineOpenClawIndexShards, validateOpenClawInventory } from './openclaw.mjs';

async function readJson(file) { return JSON.parse(await fs.readFile(file, 'utf8')); }
async function readJsonDirectory(dir) {
  const entries = (await fs.readdir(dir, { withFileTypes: true })).filter((e) => e.isFile() && e.name.endsWith('.json')).sort((a,b) => a.name.localeCompare(b.name));
  return Object.fromEntries(await Promise.all(entries.map(async (e) => [e.name, await readJson(path.join(dir, e.name))])));
}

export async function validateInventory(root) {
  const history = await readJson(path.join(root, 'inventory', 'historical-candidates.json'));
  const delta = await readJson(path.join(root, 'inventory', 'post-july-delta.json'));
  const clusters = await readJson(path.join(root, 'inventory', 'duplicate-decisions.json'));
  const indexShards = await readJsonDirectory(path.join(root, 'inventory', 'external', 'openclaw', 'index'));
  const index = combineOpenClawIndexShards(indexShards);
  const openclaw = { index_shards: indexShards, index, catalog: index,
    schema: await readJson(path.join(root, 'inventory', 'external', 'openclaw', 'schema.json')),
    summary: await readJson(path.join(root, 'inventory', 'external', 'openclaw', 'summary.json')) };
  const errors = [];
  if (history.count !== history.candidates.length) errors.push('historical candidate count mismatch');
  if (delta.count !== delta.candidates.length) errors.push('post-July candidate count mismatch');
  const ids = new Set();
  for (const item of [...history.candidates, ...delta.candidates]) {
    if (!item.id || !item.name || !item.family || !item.summary) errors.push(`candidate missing required fields: ${JSON.stringify(item)}`);
    if (ids.has(item.id)) errors.push(`duplicate archaeology id ${item.id}`);
    ids.add(item.id);
  }
  for (const cluster of clusters.clusters ?? []) if (!cluster.cluster || !Array.isArray(cluster.members) || !cluster.decision) errors.push(`invalid duplicate cluster ${JSON.stringify(cluster)}`);
  for (const [file, shard] of Object.entries(indexShards)) if (shard.count !== shard.projects?.length) errors.push(`OpenClaw index shard ${file}: count mismatch`);
  errors.push(...validateOpenClawInventory(openclaw));
  return { history, delta, clusters, external: { openclaw }, errors };
}
''',
"scripts/import-openclaw.mjs": r'''#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { csvToObjects } from '../src/csv.mjs';
import { buildOpenClawSummary, combineOpenClawIndexShards, normalizeOpenClawSchema, shardOpenClawIndex, validateOpenClawInventory } from '../src/openclaw.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(root, 'inventory', 'external', 'openclaw');
const indexDir = path.join(outputDir, 'index');
async function readJsonDirectory(dir) {
  const entries = (await fs.readdir(dir, { withFileTypes: true })).filter((e) => e.isFile() && e.name.endsWith('.json')).sort((a,b) => a.name.localeCompare(b.name));
  return Object.fromEntries(await Promise.all(entries.map(async (e) => [e.name, JSON.parse(await fs.readFile(path.join(dir, e.name), 'utf8'))])));
}
const index = combineOpenClawIndexShards(await readJsonDirectory(indexDir));
const schema = normalizeOpenClawSchema(csvToObjects(await fs.readFile(path.join(root, 'sources', 'openclaw', 'openclaw_ecosystem_schema.csv'), 'utf8')));
const summary = buildOpenClawSummary(index);
const errors = validateOpenClawInventory({ index, schema, summary });
if (errors.length) {
  console.error(`OpenClaw import invalid (${errors.length} error${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
const canonical = shardOpenClawIndex(index);
await fs.rm(indexDir, { recursive: true, force: true });
await fs.mkdir(indexDir, { recursive: true });
for (const [file, shard] of Object.entries(canonical)) await fs.writeFile(path.join(indexDir, file), JSON.stringify(shard, null, 2) + '\n');
await fs.writeFile(path.join(outputDir, 'schema.json'), JSON.stringify(schema, null, 2) + '\n');
await fs.writeFile(path.join(outputDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(`Verified and normalized ${index.count} external OpenClaw ecosystem project(s); native promotions: 0.`);
''',
"tests/registry.test.mjs": r'''import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { compileIndex, validateManifest, validateRegistry } from '../src/registry.mjs';
import { validateInventory } from '../src/inventory.mjs';
import { OPENCLAW_SOURCE_FIELDS, buildOpenClawSummary, shardOpenClawIndex } from '../src/openclaw.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('native registry validates', async () => { const { skills, errors } = await validateRegistry(root); assert.equal(errors.length, 0, errors.join('\n')); assert.ok(skills.length >= 10); });
test('compiled index is deterministic and content addressed', async () => { const { skills } = await validateRegistry(root); const a = compileIndex(skills); const b = compileIndex(skills); assert.deepEqual(a,b); assert.match(a.registry_hash,/^[a-f0-9]{64}$/); assert.equal(a.count, skills.length); });
test('adapter skills require explicit binding', () => { const x={schema_version:'1.0',id:'x-001',slug:'x',name:'X',version:'1.0.0',category:'x',description:'x',status:'defined',priority:1,routing:{trigger:'x',boundary:'x',invoke_conditions:[],block_conditions:[],fallback_chain:[],tags:[]},execution:{kind:'adapter',binding:null},contracts:{inputs:[],outputs:[]},policy:{cost_class:'low',latency_class:'fast',requires_auth:false,requires_freshness:false,safe_for_parallel:true,stateful:false,logs_required:false},compatibility:{skill_hub:'x',sophie_x:'x',openclaw:'x'}}; assert.ok(validateManifest(x).some((e)=>e.includes('requires binding'))); });
test('archaeology inventory preserves internal candidates and external OpenClaw index', async () => { const r=await validateInventory(root); assert.equal(r.errors.length,0,r.errors.join('\n')); assert.equal(r.history.count,35); assert.equal(r.delta.count,28); assert.equal(r.external.openclaw.index.count,65); assert.equal(r.external.openclaw.summary.native_promotion_count,0); });
test('OpenClaw discovery index normalizes deterministically', async () => { const r=await validateInventory(root); assert.deepEqual(shardOpenClawIndex(r.external.openclaw.index),r.external.openclaw.index_shards); assert.deepEqual(buildOpenClawSummary(r.external.openclaw.index),r.external.openclaw.summary); assert.equal(r.external.openclaw.schema.fields.length,OPENCLAW_SOURCE_FIELDS.length); });
test('OpenClaw inventory remains external to native skill registry', async () => { const {skills}=await validateRegistry(root); assert.equal(skills.some((s)=>s.manifest.id.startsWith('OC-')),false); assert.equal(skills.some((s)=>s.rel.includes('/openclaw/')),false); const r=await validateInventory(root); assert.equal(r.external.openclaw.index.authority,'reference-only'); assert.equal(r.external.openclaw.summary.architecture_policy,'external-reference-only'); });
test('OpenClaw inventory retains governance and review status', async () => { const r=await validateInventory(root); const p=r.external.openclaw.index.projects; assert.equal(p.every((x)=>x.review_status==='Tentative — user review required'),true); assert.equal(p.filter((x)=>x.security_review_required==='Mandatory').length,4); assert.equal(p.find((x)=>x.ecosystem_id==='OC-026')?.project,'agent-skills'); });
test('project-specific profiles stay outside native skill packages', async () => { const {skills}=await validateRegistry(root); for(const s of skills) assert.notEqual(s.manifest.provenance?.project_scope,'project-specific'); const p=await fs.readdir(path.join(root,'profiles','project-specific')); assert.ok(p.length>=4); });
'''
}

for rel, content in FILES.items():
    path = ROOT / rel
    path.write_text(content, encoding='utf-8')

(ROOT / 'sources/openclaw/openclaw_ecosystem_catalog.csv.gz').unlink(missing_ok=True)

# Make provenance/docs truthful without rewriting unrelated architecture text.
readme = ROOT / 'README.md'
text = readme.read_text(encoding='utf-8')
text = text.replace('sources/openclaw/openclaw_ecosystem_catalog.csv.gz\nsources/openclaw/openclaw_ecosystem_schema.csv\n        ↓ deterministic import', 'catalog SHA-256: 9dd8245275351bbc33a0095f33b03904e2fb0a64e876a286842c821254760b7e\nsources/openclaw/openclaw_ecosystem_schema.csv\n        ↓ validated external projection')
readme.write_text(text, encoding='utf-8')

doc = ROOT / 'docs/OPENCLAW_IMPORT.md'
text = doc.read_text(encoding='utf-8')
text = text.replace('- `sources/openclaw/openclaw_ecosystem_catalog.csv.gz` (exact catalog, gzip-compressed)\n- `sources/openclaw/openclaw_ecosystem_schema.csv`', '- Original catalog SHA-256: `9dd8245275351bbc33a0095f33b03904e2fb0a64e876a286842c821254760b7e`\n- `sources/openclaw/openclaw_ecosystem_schema.csv` (exact 21-field schema)')
text = text.replace('The importer parses the original CSV, validates IDs/repository boundaries/scoring fields/schema coverage, records source hashes, and deterministically regenerates the normalized JSON files.', 'The importer validates the committed external projection, repository boundaries, scores/tiers, schema coverage, review state, source hashes, and zero-native-promotion invariant, then deterministically normalizes the JSON index/summary.')
doc.write_text(text, encoding='utf-8')

srcdoc = ROOT / 'sources/openclaw/README.md'
srcdoc.write_text('''# OpenClaw Source Provenance\n\nOriginal catalog: **65 projects / 21 fields**.\n\nCatalog SHA-256: `9dd8245275351bbc33a0095f33b03904e2fb0a64e876a286842c821254760b7e`\n\nSchema file: `openclaw_ecosystem_schema.csv`  \nSchema SHA-256: `128c53e684471bdec8ba2946be82133a1d0b724a49884752d91d567123ccd221`\n\nThe normalized reference-only project projection is committed under `inventory/external/openclaw/index/`. The raw catalog is provenance material rather than a runtime/CI dependency; its cryptographic identity is retained for future re-materialization/audit against the original source artifact.\n''', encoding='utf-8')
