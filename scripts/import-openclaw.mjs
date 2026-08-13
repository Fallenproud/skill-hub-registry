#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { importOpenClawSource, shardOpenClawIndex, validateOpenClawInventory } from '../src/openclaw.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'sources', 'openclaw');
const outputDir = path.join(root, 'inventory', 'external', 'openclaw');
const indexDir = path.join(outputDir, 'index');

const catalogCsv = gunzipSync(await fs.readFile(path.join(sourceDir, 'openclaw_ecosystem_catalog.csv.gz'))).toString('utf8');
const schemaCsv = await fs.readFile(path.join(sourceDir, 'openclaw_ecosystem_schema.csv'), 'utf8');
const imported = importOpenClawSource(catalogCsv, schemaCsv);
const errors = validateOpenClawInventory(imported);

if (errors.length) {
  console.error(`OpenClaw import invalid (${errors.length} error${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

await fs.mkdir(outputDir, { recursive: true });
await fs.rm(indexDir, { recursive: true, force: true });
await fs.mkdir(indexDir, { recursive: true });
const shards = shardOpenClawIndex(imported.index);
for (const [file, shard] of Object.entries(shards)) {
  await fs.writeFile(path.join(indexDir, file), JSON.stringify(shard, null, 2) + '\n');
}
await fs.writeFile(path.join(outputDir, 'schema.json'), JSON.stringify(imported.schema, null, 2) + '\n');
await fs.writeFile(path.join(outputDir, 'summary.json'), JSON.stringify(imported.summary, null, 2) + '\n');

console.log(`Imported ${imported.catalog.count} OpenClaw ecosystem project(s) into ${Object.keys(shards).length} external discovery index part(s).`);
