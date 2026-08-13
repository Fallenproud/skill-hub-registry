import { promises as fs } from 'node:fs';
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
