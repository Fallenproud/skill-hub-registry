import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { compileIndex, validateManifest, validateRegistry } from '../src/registry.mjs';
import { validateInventory } from '../src/inventory.mjs';
import { OPENCLAW_SOURCE_FIELDS, buildOpenClawSummary, shardOpenClawIndex } from '../src/openclaw.mjs';
import { reconcileV7, validateV7SourceCensus } from '../src/v7.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), 'utf8'));
}

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
  const x = {
    schema_version: '1.0', id: 'x-001', slug: 'x', name: 'X', version: '1.0.0', category: 'x', description: 'x', status: 'defined', priority: 1,
    routing: { trigger: 'x', boundary: 'x', invoke_conditions: [], block_conditions: [], fallback_chain: [], tags: [] },
    execution: { kind: 'adapter', binding: null }, contracts: { inputs: [], outputs: [] },
    policy: { cost_class: 'low', latency_class: 'fast', requires_auth: false, requires_freshness: false, safe_for_parallel: true, stateful: false, logs_required: false },
    compatibility: { skill_hub: 'x', sophie_x: 'x', openclaw: 'x' }
  };
  assert.ok(validateManifest(x).some((error) => error.includes('requires binding')));
});

test('archaeology inventory preserves internal candidates and external OpenClaw index', async () => {
  const result = await validateInventory(root);
  assert.equal(result.errors.length, 0, result.errors.join('\n'));
  assert.equal(result.history.count, 35);
  assert.equal(result.delta.count, 28);
  assert.equal(result.external.openclaw.index.count, 65);
  assert.equal(result.external.openclaw.summary.native_promotion_count, 0);
});

test('OpenClaw discovery index normalizes deterministically', async () => {
  const result = await validateInventory(root);
  assert.deepEqual(shardOpenClawIndex(result.external.openclaw.index), result.external.openclaw.index_shards);
  assert.deepEqual(buildOpenClawSummary(result.external.openclaw.index), result.external.openclaw.summary);
  assert.equal(result.external.openclaw.schema.fields.length, OPENCLAW_SOURCE_FIELDS.length);
});

test('OpenClaw inventory remains external to native skill registry', async () => {
  const { skills } = await validateRegistry(root);
  assert.equal(skills.some((skill) => skill.manifest.id.startsWith('OC-')), false);
  assert.equal(skills.some((skill) => skill.rel.includes('/openclaw/')), false);
  const result = await validateInventory(root);
  assert.equal(result.external.openclaw.index.authority, 'reference-only');
  assert.equal(result.external.openclaw.summary.architecture_policy, 'external-reference-only');
});

test('OpenClaw inventory retains governance and review status', async () => {
  const result = await validateInventory(root);
  const projects = result.external.openclaw.index.projects;
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

test('R1 v7 source census preserves historical source evidence', async () => {
  const census = await readJson('inventory/v7/source-census.json');
  assert.deepEqual(validateV7SourceCensus(census), []);
  assert.equal(census.counts.initial_seed_definitions, 64);
  assert.equal(census.counts.migration_confirmed_definitions, 65);
  assert.equal(census.counts.claimed_live_registry, 88);
  assert.equal(census.counts.runtime_bound_adapters, 10);
  assert.equal(census.counts.unresolved_live_db_delta, 23);
  assert.equal(census.source_confirmed_skills.length, 65);
  assert.deepEqual(census.runtime_bound_ids, Array.from({ length: 10 }, (_, index) => `core-${String(index + 1).padStart(3, '0')}`));
});

test('R1 source reconciliation detects existing native ID collisions without promotion', async () => {
  const census = await readJson('inventory/v7/source-census.json');
  const nativeIndex = await readJson('generated/registry.index.json');
  const result = reconcileV7({ census, nativeIndex });

  assert.equal(result.counts.source_confirmed, 65);
  assert.equal(result.counts.runtime_bound, 10);
  assert.equal(result.counts.native, 17);
  assert.equal(result.native_promotion_count, 0);
  assert.equal(result.exact_native_matches.some((item) => item.id === 'core-001' && item.name === 'LLM'), true);
  assert.deepEqual(result.native_id_collisions.map((item) => item.id), ['ux-001', 'ux-002']);
  assert.equal(result.live.status, 'required');
  assert.equal(result.live.unresolved_delta, 23);
  assert.equal(result.safe_to_shadow, false);
});

test('R1 authoritative live export is exact with source and current 65-skill contract', async () => {
  const census = await readJson('inventory/v7/source-census.json');
  const liveCensus = await readJson('inventory/v7/live-census.json');
  const liveExport = await readJson('inventory/v7/live-export.json');
  const nativeIndex = await readJson('generated/registry.index.json');
  const result = reconcileV7({
    census,
    nativeIndex,
    liveRows: liveExport,
    liveContractCount: liveCensus.counts.current_live_registry
  });

  assert.equal(result.counts.historical_claimed_live_registry, 88);
  assert.equal(result.counts.claimed_live_registry, 65);
  assert.equal(result.counts.live, 65);
  assert.equal(result.counts.live_only, 0);
  assert.equal(result.counts.source_missing_from_live, 0);
  assert.equal(result.live.count_matches_claim, true);
  assert.equal(result.live.identity_matches_source, true);
  assert.equal(result.live.duplicate_ids.length, 0);
  assert.deepEqual(result.blocking_findings.map((finding) => finding.code), ['native_id_collisions']);
  assert.equal(result.safe_to_shadow, false, 'native ID collisions must still block shadow readiness');
});
