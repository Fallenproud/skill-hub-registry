#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reconcileV7 } from '../src/v7.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = process.argv[2];

if (!input) {
  console.error('Usage: npm run reconcile:v7 -- path/to/live-v7-export.json');
  process.exit(2);
}

const census = JSON.parse(await fs.readFile(path.join(root, 'inventory', 'v7', 'source-census.json'), 'utf8'));
const liveCensus = JSON.parse(await fs.readFile(path.join(root, 'inventory', 'v7', 'live-census.json'), 'utf8'));
const nativeIndex = JSON.parse(await fs.readFile(path.join(root, 'generated', 'registry.index.json'), 'utf8'));
const liveValue = JSON.parse(await fs.readFile(path.resolve(process.cwd(), input), 'utf8'));
const result = reconcileV7({
  census,
  nativeIndex,
  liveRows: liveValue,
  liveContractCount: liveCensus.counts.current_live_registry
});

process.stdout.write(JSON.stringify(result, null, 2) + '\n');
if (!result.safe_to_shadow) process.exitCode = 1;
