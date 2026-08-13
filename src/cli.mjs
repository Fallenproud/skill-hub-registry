import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileIndex, validateRegistry } from './registry.mjs';
import { validateInventory } from './inventory.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const command = process.argv[2] ?? 'validate';

async function registryOrExit() {
  const { skills, errors } = await validateRegistry(root);
  if (errors.length) {
    console.error(`Registry invalid (${errors.length} error${errors.length === 1 ? '' : 's'}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  return skills;
}

if (command === 'validate') {
  const skills = await registryOrExit();
  const inventory = await validateInventory(root);
  if (inventory.errors.length) {
    console.error(`Inventory invalid (${inventory.errors.length} error${inventory.errors.length === 1 ? '' : 's'}):`);
    for (const error of inventory.errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(
    `Registry valid: ${skills.length} native package(s); ${inventory.history.count} historical candidates; ` +
    `${inventory.delta.count} post-July candidates; ${inventory.external.openclaw.catalog.count} external OpenClaw projects; ` +
    `v7 ${inventory.v7.counts.migration_confirmed_definitions} source-confirmed / ${inventory.v7_live.census.counts.current_live_registry} authoritative live; ` +
    `historical static claim ${inventory.v7.counts.claimed_live_registry}; live/source parity exact.`
  );
} else if (command === 'build') {
  const skills = await registryOrExit();
  const index = compileIndex(skills);
  const out = path.join(root, 'generated', 'registry.index.json');
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, JSON.stringify(index));
  console.log(`Compiled ${skills.length} native package(s) -> generated/registry.index.json (${index.registry_hash.slice(0, 12)})`);
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(2);
}
