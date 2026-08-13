import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { compileIndex, validateManifest, validateRegistry } from '../src/registry.mjs';
import { validateInventory } from '../src/inventory.mjs';

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

test('archaeology inventory preserves the July ledger and post-July delta', async () => {
  const result = await validateInventory(root);
  assert.equal(result.errors.length, 0, result.errors.join('\n'));
  assert.equal(result.history.count, 35);
  assert.ok(result.delta.count >= 20);
});

test('project-specific profiles stay outside native skill packages', async () => {
  const { skills } = await validateRegistry(root);
  for (const skill of skills) assert.notEqual(skill.manifest.provenance?.project_scope, 'project-specific');
  const profiles = await fs.readdir(path.join(root, 'profiles', 'project-specific'));
  assert.ok(profiles.length >= 4);
});
