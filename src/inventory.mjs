import { promises as fs } from 'node:fs';
import path from 'node:path';
import { combineOpenClawIndexShards, validateOpenClawInventory } from './openclaw.mjs';
import { normalizeV7LiveExport, validateV7SourceCensus } from './v7.mjs';

async function readJson(file) { return JSON.parse(await fs.readFile(file, 'utf8')); }
async function readJsonDirectory(dir) {
  const entries = (await fs.readdir(dir, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith('.json')).sort((a, b) => a.name.localeCompare(b.name));
  return Object.fromEntries(await Promise.all(entries.map(async (entry) => [entry.name, await readJson(path.join(dir, entry.name))])));
}

function distinctCount(items, key) {
  return new Set(items.map((item) => item?.[key]).filter(Boolean)).size;
}

export async function validateInventory(root) {
  const history = await readJson(path.join(root, 'inventory', 'historical-candidates.json'));
  const delta = await readJson(path.join(root, 'inventory', 'post-july-delta.json'));
  const clusters = await readJson(path.join(root, 'inventory', 'duplicate-decisions.json'));
  const v7 = await readJson(path.join(root, 'inventory', 'v7', 'source-census.json'));
  const v7LiveCensus = await readJson(path.join(root, 'inventory', 'v7', 'live-census.json'));
  const v7LiveExportValue = await readJson(path.join(root, 'inventory', 'v7', 'live-export.json'));
  const v7LiveExport = normalizeV7LiveExport(v7LiveExportValue);

  const indexShards = await readJsonDirectory(path.join(root, 'inventory', 'external', 'openclaw', 'index'));
  const index = combineOpenClawIndexShards(indexShards);
  const openclaw = {
    index_shards: indexShards,
    index,
    catalog: index,
    schema: await readJson(path.join(root, 'inventory', 'external', 'openclaw', 'schema.json')),
    summary: await readJson(path.join(root, 'inventory', 'external', 'openclaw', 'summary.json'))
  };

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

  for (const [file, shard] of Object.entries(indexShards)) {
    if (shard.count !== shard.projects?.length) errors.push(`OpenClaw index shard ${file}: count mismatch`);
  }

  errors.push(...validateOpenClawInventory(openclaw));
  errors.push(...validateV7SourceCensus(v7));

  if (v7LiveCensus?.authority !== 'live-database-census') errors.push('v7 live census authority must be live-database-census');
  if (v7LiveCensus?.status?.native_promotion !== 0) errors.push('v7 live census must never perform native promotion');
  if (v7LiveExport.length !== v7LiveCensus?.counts?.current_live_registry) errors.push('v7 live export count does not match live census');
  if (distinctCount(v7LiveExport, 'id') !== v7LiveCensus?.counts?.distinct_ids) errors.push('v7 live distinct ID count mismatch');
  if (distinctCount(v7LiveExport, 'name') !== v7LiveCensus?.counts?.distinct_names) errors.push('v7 live distinct name count mismatch');

  const sourceById = new Map(v7.source_confirmed_skills.map((skill) => [skill.id, skill]));
  const liveById = new Map(v7LiveExport.map((skill) => [skill.id, skill]));
  const liveOnly = v7LiveExport.filter((skill) => !sourceById.has(skill.id));
  const sourceMissing = v7.source_confirmed_skills.filter((skill) => !liveById.has(skill.id));
  if (liveOnly.length !== v7LiveCensus?.counts?.live_only_vs_source) errors.push('v7 live-only source parity count mismatch');
  if (sourceMissing.length !== v7LiveCensus?.counts?.source_missing_from_live) errors.push('v7 source-missing live parity count mismatch');
  if (liveOnly.length === 0 && sourceMissing.length === 0) {
    for (const liveSkill of v7LiveExport) {
      const sourceSkill = sourceById.get(liveSkill.id);
      if (sourceSkill && (sourceSkill.name !== liveSkill.name || sourceSkill.category_id !== liveSkill.category_id)) {
        errors.push(`v7 live/source identity mismatch for ${liveSkill.id}`);
      }
    }
  }

  return {
    history,
    delta,
    clusters,
    v7,
    v7_live: { census: v7LiveCensus, export: v7LiveExport },
    external: { openclaw },
    errors
  };
}
