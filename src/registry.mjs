import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const VALID_STATUS = new Set(['draft','defined','validated','registered','executable','deprecated','quarantined']);
const VALID_MATURITY = new Set(['L0','L1','L2','L3','L4','L5']);
const VALID_COST = new Set(['low','medium','high']);
const VALID_LATENCY = new Set(['fast','normal','slow']);
const VALID_EXECUTION = new Set(['adapter','instructional','none']);
const REQUIRED_MANIFEST = ['schema_version','id','slug','name','version','category','description','status','priority','routing','execution','contracts','policy','compatibility'];

export async function findSkillDirectories(root) {
  const skillsRoot = path.join(root, 'skills');
  const result = [];
  async function walk(dir) {
    let entries = [];
    try { entries = await fs.readdir(dir, { withFileTypes: true }); }
    catch (error) {
      if (error?.code === 'ENOENT') return;
      throw error;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (!entry.isDirectory()) continue;
      const manifest = path.join(full, 'skill.json');
      try {
        await fs.access(manifest);
        result.push(full);
      } catch {
        await walk(full);
      }
    }
  }
  await walk(skillsRoot);
  return result.sort();
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function validateManifest(m, where = 'skill.json') {
  const errors = [];
  for (const key of REQUIRED_MANIFEST) if (!(key in m)) errors.push(`${where}: missing ${key}`);
  if (m.schema_version !== '1.0') errors.push(`${where}: schema_version must be 1.0`);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(m.id ?? '')) errors.push(`${where}: invalid id`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m.slug ?? '')) errors.push(`${where}: invalid slug`);
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(m.version ?? '')) errors.push(`${where}: version must be semver`);
  if (!VALID_STATUS.has(m.status)) errors.push(`${where}: invalid status`);
  if (m.maturity != null && !VALID_MATURITY.has(m.maturity)) errors.push(`${where}: invalid maturity`);
  if (![1,2,3].includes(m.priority)) errors.push(`${where}: priority must be 1..3`);
  if (!VALID_EXECUTION.has(m.execution?.kind)) errors.push(`${where}: invalid execution.kind`);
  if (m.execution?.kind === 'adapter' && !m.execution?.binding) errors.push(`${where}: adapter execution requires binding`);
  if (m.execution?.kind !== 'adapter' && m.execution?.binding !== null) errors.push(`${where}: non-adapter binding must be null`);
  if (!VALID_COST.has(m.policy?.cost_class)) errors.push(`${where}: invalid cost_class`);
  if (!VALID_LATENCY.has(m.policy?.latency_class)) errors.push(`${where}: invalid latency_class`);
  for (const key of ['invoke_conditions','block_conditions','fallback_chain','tags']) {
    if (!isStringArray(m.routing?.[key])) errors.push(`${where}: routing.${key} must be string array`);
  }
  for (const key of ['inputs','outputs']) if (!isStringArray(m.contracts?.[key])) errors.push(`${where}: contracts.${key} must be string array`);
  if (m.dependencies) {
    for (const key of ['skills','tools','external']) if (!isStringArray(m.dependencies?.[key])) errors.push(`${where}: dependencies.${key} must be string array`);
  }
  if (m.provenance?.source_refs && !isStringArray(m.provenance.source_refs)) errors.push(`${where}: provenance.source_refs must be string array`);
  return errors;
}

export async function loadSkill(root, dir) {
  const rel = path.relative(root, dir).replaceAll(path.sep, '/');
  const manifestPath = path.join(dir, 'skill.json');
  const skillMdPath = path.join(dir, 'SKILL.md');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const markdown = await fs.readFile(skillMdPath, 'utf8').catch(() => null);
  const errors = validateManifest(manifest, `${rel}/skill.json`);
  if (!markdown || markdown.trim().length < 160) errors.push(`${rel}/SKILL.md: missing or too short`);
  if (manifest.category && !rel.startsWith(`skills/${manifest.category}/`)) {
    errors.push(`${rel}: directory category does not match manifest category ${manifest.category}`);
  }
  const hash = markdown ? createHash('sha256').update(JSON.stringify(manifest)).update('\n').update(markdown).digest('hex') : null;
  return { dir, rel, manifest, markdown, hash, errors };
}

export async function validateRegistry(root) {
  const dirs = await findSkillDirectories(root);
  const skills = await Promise.all(dirs.map((dir) => loadSkill(root, dir)));
  const errors = skills.flatMap((s) => s.errors);
  const ids = new Map();
  const slugs = new Map();
  for (const skill of skills) {
    const { id, slug } = skill.manifest;
    if (ids.has(id)) errors.push(`duplicate skill id ${id}: ${ids.get(id)} and ${skill.rel}`);
    else ids.set(id, skill.rel);
    if (slugs.has(slug)) errors.push(`duplicate skill slug ${slug}: ${slugs.get(slug)} and ${skill.rel}`);
    else slugs.set(slug, skill.rel);
  }
  for (const skill of skills) {
    for (const fallback of skill.manifest.routing?.fallback_chain ?? []) {
      if (!ids.has(fallback) && !slugs.has(fallback)) errors.push(`${skill.rel}: unresolved fallback ${fallback}`);
    }
    for (const dependency of skill.manifest.dependencies?.skills ?? []) {
      if (!ids.has(dependency) && !slugs.has(dependency)) errors.push(`${skill.rel}: unresolved skill dependency ${dependency}`);
    }
  }
  return { skills, errors };
}

function canonicalEntries(skills) {
  return skills.map(({ manifest: m, hash, rel }) => ({
    id: m.id,
    slug: m.slug,
    name: m.name,
    version: m.version,
    category: m.category,
    description: m.description,
    status: m.status,
    maturity: m.maturity ?? null,
    capability_type: m.capability_type ?? null,
    priority: m.priority,
    trigger: m.routing.trigger,
    boundary: m.routing.boundary,
    tags: m.routing.tags,
    cost_class: m.policy.cost_class,
    latency_class: m.policy.latency_class,
    requires_auth: m.policy.requires_auth,
    requires_freshness: m.policy.requires_freshness,
    safe_for_parallel: m.policy.safe_for_parallel,
    stateful: m.policy.stateful,
    logs_required: m.policy.logs_required,
    execution_kind: m.execution.kind,
    execution_binding: m.execution.binding,
    package_path: rel,
    project_scope: m.provenance?.project_scope ?? null,
    content_hash: hash
  })).sort((a,b) => a.id.localeCompare(b.id));
}

export function compileIndex(skills) {
  const entries = canonicalEntries(skills);
  const registryHash = createHash('sha256').update(JSON.stringify(entries)).digest('hex');
  return {
    schema_version: '1.0',
    registry_hash: registryHash,
    count: entries.length,
    skills: entries
  };
}
