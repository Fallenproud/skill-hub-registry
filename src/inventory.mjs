import { promises as fs } from 'node:fs';
import path from 'node:path';

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

export async function validateInventory(root) {
  const history = await readJson(path.join(root, 'inventory', 'historical-candidates.json'));
  const delta = await readJson(path.join(root, 'inventory', 'post-july-delta.json'));
  const clusters = await readJson(path.join(root, 'inventory', 'duplicate-decisions.json'));
  const errors = [];

  if (history.count !== history.candidates.length) errors.push('historical candidate count mismatch');
  if (delta.count !== delta.candidates.length) errors.push('post-July candidate count mismatch');

  const ids = new Set();
  for (const item of [...history.candidates, ...delta.candidates]) {
    if (!item.id || !item.name || !item.family || !item.summary) errors.push(`candidate missing required fields: ${JSON.stringify(item)}`);
    if (ids.has(item.id)) errors.push(`duplicate archaeology id ${item.id}`);
    ids.add(item.id);
  }

  for (const cluster of clusters.clusters ?? []) {
    if (!cluster.cluster || !Array.isArray(cluster.members) || !cluster.decision) errors.push(`invalid duplicate cluster ${JSON.stringify(cluster)}`);
  }

  return { history, delta, clusters, errors };
}
