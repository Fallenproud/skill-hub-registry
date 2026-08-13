#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reconcileV7, validateV7SourceCensus } from '../src/v7.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const census = JSON.parse(await fs.readFile(path.join(root, 'inventory', 'v7', 'source-census.json'), 'utf8'));
const liveCensus = JSON.parse(await fs.readFile(path.join(root, 'inventory', 'v7', 'live-census.json'), 'utf8'));
const liveExport = JSON.parse(await fs.readFile(path.join(root, 'inventory', 'v7', 'live-export.json'), 'utf8'));
const nativeIndex = JSON.parse(await fs.readFile(path.join(root, 'generated', 'registry.index.json'), 'utf8'));
const errors = validateV7SourceCensus(census);

if (errors.length) {
  console.error(`v7 source census invalid (${errors.length} error${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const result = reconcileV7({
  census,
  nativeIndex,
  liveRows: liveExport,
  liveContractCount: liveCensus.counts.current_live_registry
});

console.log(`R1 v7 census valid: ${result.counts.source_confirmed} source-confirmed; ${result.counts.live} authoritative live; ${result.counts.runtime_bound} runtime-bound; historical static claim ${result.counts.historical_claimed_live_registry}; current contract ${result.counts.claimed_live_registry}.`);
console.log(`Live/source parity: ${result.live.identity_matches_source ? 'exact' : 'drift'}; live-only ${result.counts.live_only}; source-missing ${result.counts.source_missing_from_live}; duplicate live IDs ${result.live.duplicate_ids.length}.`);
console.log(`Native parity: ${result.counts.exact_native_matches} exact ID/name match(es), ${result.counts.native_id_collisions} ID collision(s), ${result.counts.source_only} source-only, ${result.counts.native_only} native-only.`);
if (result.blocking_findings.length) {
  console.log('R1 remains gated:');
  for (const finding of result.blocking_findings) console.log(`- ${finding.code}: ${finding.detail}`);
}
