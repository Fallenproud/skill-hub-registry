import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { compileIndex, validateManifest, validateRegistry } from '../src/registry.mjs';
import { validateInventory } from '../src/inventory.mjs';
import { importOpenClawSource, OPENCLAW_REQUIRED_FIELDS, shardOpenClawIndex } from '../src/openclaw.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('native registry validates', async () => {
  const { skills, errors } = await validateRegistry(root);
  assert.equal(errors.length, 0, errors.join('\n'));
  assert.ok(skills.length >= 10);
});

test('compiled index is deterministic and content addressed', async () => {
  const { skills } = await validateRegistry(root);
  const a = compileIndex(skills);
  const b = compileIndex(skills);
  assert.deepEqual(a, b);
  assert.match(a.registry_hash, /^[a-f0-9]{64}$/);
  assert.equal(a.count, skills.length);
});

test('adapter skills require explicit binding', () => {
  const example = JSON.parse(JSON.stringify({
    schema_version:'1.0', id:'x-001', slug:'x', name:'X', version:'1.0.0', category:'x', description:'x', status:'defined', priority:1,
    routing:{trigger:'x',boundary:'x',invoke_conditions:[],block_conditions:[],fallback_chain:[],tags:[]},
    execution:{kind:'adapter',binding:null}, contracts:{inputs:[],outputs:[]},
    policy:{cost_class:'low',latency_class:'fast',requires_auth:false,requires_freshness:false,safe_for_parallel:true,stateful:false,logs_required:false},
    compatibility:{skill_hub:'x',sophie_x:'x',openclaw:'x'}
  }));
  assert.ok(validateManifest(example).some((x) => x.includes('requires binding')));
});

test('archaeology inventory preserves internal candidates and external OpenClaw catalog', async () => {
  const result = await validateInventory(root);
  assert.equal(result.errors.length, 0, result.errors.join('\n'));
  assert.equal(result.history.count, 35);
  assert.equal(result.delta.count, 28);
  assert.equal(result.external.openclaw.catalog.count, 65);
  assert.equal(result.external.openclaw.index.count, 65);
  assert.equal(result.external.openclaw.summary.native_promotion_count, 0);
});

test('OpenClaw import is deterministic against preserved CSV sources', async () => {
  const catalogCsv = gunzipSync(await fs.readFile(path.join(root, 'sources', 'openclaw', 'openclaw_ecosystem_catalog.csv.gz'))).toString('utf8');
  const schemaCsv = await fs.readFile(path.join(root, 'sources', 'openclaw', 'openclaw_ecosystem_schema.csv'), 'utf8');
  const regenerated = importOpenClawSource(catalogCsv, schemaCsv);
  const expectedShards = shardOpenClawIndex(regenerated.index);
  const indexDir = path.join(root, 'inventory', 'external', 'openclaw', 'index');
  const committedShards = Object.fromEntries(await Promise.all(
    (await fs.readdir(indexDir)).sort().map(async (file) => [file, JSON.parse(await fs.readFile(path.join(indexDir, file), 'utf8'))])
  ));
  assert.deepEqual(expectedShards, committedShards);
  assert.deepEqual(regenerated.schema, JSON.parse(await fs.readFile(path.join(root, 'inventory', 'external', 'openclaw', 'schema.json'), 'utf8')));
  assert.deepEqual(regenerated.summary, JSON.parse(await fs.readFile(path.join(root, 'inventory', 'external', 'openclaw', 'summary.json'), 'utf8')));
  assert.equal(regenerated.schema.fields.length, OPENCLAW_REQUIRED_FIELDS.length);
});

test('OpenClaw inventory remains external to the native skill registry', async () => {
  const { skills } = await validateRegistry(root);
  assert.equal(skills.some((skill) => skill.manifest.id.startsWith('OC-')), false);
  assert.equal(skills.some((skill) => skill.rel.includes('/openclaw/')), false);
  const inventory = await validateInventory(root);
  assert.equal(inventory.external.openclaw.catalog.authority, 'reference-only');
  assert.equal(inventory.external.openclaw.summary.architecture_policy, 'external-reference-only');
});

test('OpenClaw catalog retains governance and review status', async () => {
  const inventory = await validateInventory(root);
  const { projects } = inventory.external.openclaw.catalog;
  assert.equal(projects.every((project) => project.review_status === 'Tentative — user review required'), true);
  assert.equal(projects.filter((project) => project.security_review_required === 'Mandatory').length, 4);
  assert.equal(projects.find((project) => project.ecosystem_id === 'OC-026')?.project, 'agent-skills');
});

test('project-specific profiles stay outside native skill packages', async () => {
  const { skills } = await validateRegistry(root);
  for (const skill of skills) assert.notEqual(skill.manifest.provenance?.project_scope, 'project-specific');
  const profiles = await fs.readdir(path.join(root, 'profiles', 'project-specific'));
  assert.ok(profiles.length >= 4);
});
