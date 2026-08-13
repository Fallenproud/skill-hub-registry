#!/usr/bin/env node
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
