#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { importRows } from '../src/import-v7.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = process.argv[2];
if (!input) {
  console.error('Usage: node scripts/import-v7.mjs <skills-export.json> [executable-ids.json]');
  process.exit(2);
}
const rows = JSON.parse(await fs.readFile(path.resolve(input), 'utf8'));
const executableFile = process.argv[3];
const executableIds = executableFile ? new Set(JSON.parse(await fs.readFile(path.resolve(executableFile), 'utf8'))) : new Set();
const result = await importRows({ root, rows, executableIds });
console.log(JSON.stringify({ imported: result.length, skills: result }, null, 2));
