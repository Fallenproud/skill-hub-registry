import { promises as fs } from 'node:fs';
import path from 'node:path';

const slugify = (value) => String(value ?? '')
  .trim().toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unnamed-skill';

function arr(value) {
  if (Array.isArray(value)) return value.map(String);
  if (value == null) return [];
  if (typeof value === 'string') {
    try { const parsed = JSON.parse(value); if (Array.isArray(parsed)) return parsed.map(String); } catch {}
  }
  return [];
}

export function rowToManifest(row, executableIds = new Set()) {
  const binding = executableIds.has(row.id) ? row.id : null;
  return {
    schema_version: '1.0',
    id: String(row.id),
    slug: slugify(row.name),
    name: String(row.name),
    version: '1.0.0',
    category: String(row.category_id),
    description: String(row.description ?? ''),
    status: binding ? 'executable' : 'defined',
    priority: Number(row.priority ?? 2),
    routing: {
      trigger: String(row.trigger_condition ?? ''),
      boundary: String(row.boundary ?? ''),
      invoke_conditions: arr(row.invoke_conditions),
      block_conditions: arr(row.block_conditions),
      fallback_chain: arr(row.fallback_chain),
      tags: []
    },
    execution: { kind: binding ? 'adapter' : 'none', binding },
    contracts: { inputs: arr(row.inputs), outputs: arr(row.outputs) },
    policy: {
      cost_class: row.cost_class ?? 'medium',
      latency_class: row.latency_class ?? 'normal',
      requires_auth: Boolean(row.requires_auth),
      requires_freshness: Boolean(row.requires_freshness),
      safe_for_parallel: Boolean(row.safe_for_parallel),
      stateful: Boolean(row.stateful),
      logs_required: Boolean(row.logs_required)
    },
    compatibility: {
      skill_hub: 'migrated-from-v7',
      sophie_x: 'existing-api-compatible',
      openclaw: 'export-adapter-planned'
    }
  };
}

export function rowToMarkdown(row) {
  const inputs = arr(row.inputs);
  const outputs = arr(row.outputs);
  return `# ${row.name}\n\n## Purpose\n\n${row.description || 'Migrated from Skill Hub v7. Purpose requires review.'}\n\n## Invoke when\n\n${row.trigger_condition || 'Review and define explicit invocation conditions.'}\n\n## Do not invoke when\n\n${row.boundary || 'Review and define explicit boundaries.'}\n\n## Inputs\n\n${inputs.length ? inputs.map((x) => `- ${x}`).join('\n') : '- No explicit inputs recorded in v7.'}\n\n## Outputs\n\n${outputs.length ? outputs.map((x) => `- ${x}`).join('\n') : '- No explicit outputs recorded in v7.'}\n\n## Migration status\n\nThis package was generated from the Skill Hub v7 database definition. The original registry fields are preserved in \`skill.json\`, but the instructional methodology should be reviewed before this skill is promoted beyond \`defined\` unless an existing executable adapter is bound.\n`;
}

export async function importRows({ root, rows, executableIds = new Set(), overwrite = false }) {
  const written = [];
  for (const row of rows) {
    if (!row?.id || !row?.name || !row?.category_id) throw new Error('Each v7 row requires id, name, category_id');
    const manifest = rowToManifest(row, executableIds);
    const dir = path.join(root, 'skills', manifest.category, manifest.slug);
    await fs.mkdir(dir, { recursive: true });
    for (const [name, content] of [
      ['skill.json', JSON.stringify(manifest, null, 2) + '\n'],
      ['SKILL.md', rowToMarkdown(row)]
    ]) {
      const dest = path.join(dir, name);
      if (!overwrite) {
        try { await fs.access(dest); throw new Error(`Refusing to overwrite ${dest}`); } catch (e) { if (!String(e.message).startsWith('Refusing')) {} else throw e; }
      }
      await fs.writeFile(dest, content);
    }
    written.push({ id: manifest.id, path: path.relative(root, dir).replaceAll(path.sep, '/') });
  }
  return written;
}
