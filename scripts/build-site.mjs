import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '_site');
await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(out, { recursive: true });

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  for (const entry of await fs.readdir(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) await copyDir(src, dst);
    else await fs.copyFile(src, dst);
  }
}

await copyDir(path.join(root, 'site'), out);
await copyDir(path.join(root, 'assets'), path.join(out, 'assets'));
await fs.mkdir(path.join(out, 'data'), { recursive: true });
await fs.copyFile(path.join(root, 'generated', 'registry.index.json'), path.join(out, 'data', 'registry.index.json'));
await fs.copyFile(path.join(root, 'inventory', 'post-july-delta.json'), path.join(out, 'data', 'post-july-delta.json'));
console.log(`Built static onboarding site -> ${path.relative(root, out)}/`);
