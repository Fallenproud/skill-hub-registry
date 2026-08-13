#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reconcileV7, validateV7SourceCensus } from '../src/v7.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const census = JSON.parse(await fs.readFile(path.join(root, 'inventory', 'v7', 'source-census.json'), 'utf8'));
const nativeIndex = JSON.parse(await fs.readFile(path.join(root, 'generated', 'registry.index.json'), 'utf8'));
const errors = validateV7SourceCensus(census);

if (errors.length) {
  console.error(`v7 source census invalid (${errors.length} error${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const result = reconcileV7({ census, nativeIndex });
console.log(`R1 v7 source census valid: ${result.counts.source_confirmed} migration-confirmed definitions; ${result.counts.runtime_bound} runtime-bound; public contract claims ${result.counts.claimed_live_registry}; unresolved live DB delta ${census.counts.unresolved_live_db_delta}.`);
console.log(`Native parity preview: ${result.counts.exact_native_matches} exact ID/name match(es), ${result.counts.native_id_collisions} ID collision(s), ${result.counts.source_only} source-only, ${result.counts.native_only} native-only.`);
if (result.blocking_findings.length) {
  console.log('R1 remains gated:');
  for (const finding of result.blocking_findings) console.log(`- ${finding.code}: ${finding.detail}`);
}
