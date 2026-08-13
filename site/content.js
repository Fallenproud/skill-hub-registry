export const schemaLeft = [
  { id: 'metadata', tone: 'pink', icon: 'document', title: 'Metadata', detail: 'schema & descriptors', core: 'Identity, version and discoverability' },
  { id: 'capabilities', tone: 'pink', icon: 'puzzle', title: 'Capabilities', detail: 'inputs, outputs & config', core: 'What the skill can accept and produce' },
  { id: 'policies', tone: 'pink', icon: 'shield', title: 'Policies', detail: 'auth, limits & guardrails', core: 'What execution is allowed to do' }
];

export const schemaRight = [
  { id: 'dependencies', tone: 'cyan', icon: 'cubes', title: 'Dependencies', detail: 'requirements & resources', core: 'What must exist before execution' },
  { id: 'implementation', tone: 'cyan', icon: 'code', title: 'Implementation', detail: 'code, templates & references', core: 'Where executable behavior is bound' },
  { id: 'tests', tone: 'cyan', icon: 'clipboard', title: 'Tests', detail: 'examples & assertions', core: 'What proves the contract still holds' }
];

export const pipelineSteps = [
  { step: '01', tone: 'pink', icon: 'package', title: 'Skill Packages', detail: 'SKILL.md + skill.json in the repository' },
  { step: '02', tone: 'pink', icon: 'badge', title: 'Define', detail: 'Structure cognition, routing and contracts' },
  { step: '03', tone: 'cyan', icon: 'shield', title: 'Validate', detail: 'Schema checks, rules and compatibility' },
  { step: '04', tone: 'cyan', icon: 'cube', title: 'Compile', detail: 'Resolve, normalize and content-address' },
  { step: '05', tone: 'green', icon: 'upload', title: 'Distribute', detail: 'Publish versioned registry artifacts' },
  { step: '06', tone: 'green', icon: 'play', title: 'Runtime Execution', detail: 'Discover, load, invoke and observe' }
];

export const packageFiles = [
  { type: 'md', name: 'SKILL.md', detail: 'Human-readable cognition + methodology' },
  { type: 'json', name: 'skill.json', detail: 'Routing, contracts, policy + binding metadata' },
  { type: 'folder', name: 'schemas/', detail: 'Input/output and compatibility contracts' },
  { type: 'index', name: 'registry.index.json', detail: 'Compiled discovery surface + content hashes' }
];

export const iconPaths = {
  document: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/><path d="M10 13h5M10 17h5"/>',
  puzzle: '<path d="M9 4h4a2 2 0 1 1 4 0h3v5a2 2 0 1 0 0 4v5h-5a2 2 0 1 1-4 0H7v-4a2 2 0 1 1 0-4V6h2z"/>',
  shield: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="m9 12 2 2 4-5"/>',
  cubes: '<path d="m12 3 4 2.3v4.6L12 12l-4-2.1V5.3z"/><path d="m6 11 4 2.3v4.6L6 20l-4-2.1v-4.6zM18 11l4 2.3v4.6L18 20l-4-2.1v-4.6z"/>',
  code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
  clipboard: '<path d="M9 5h6l1 2h3v14H5V7h3z"/><path d="m9 14 2 2 4-5"/>',
  package: '<path d="m12 3 8 4-8 4-8-4zM4 7v10l8 4 8-4V7M12 11v10"/>',
  badge: '<path d="M12 3l2 2 3-.3.3 3 2 2-2 2 .3 3-3 .3-2 2-2-2-3 .3-.3-3-2-2 2-2-.3-3 3-.3z"/><path d="m9 12 2 2 4-5"/>',
  cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12 4 7.5M12 12v9"/>',
  upload: '<path d="M12 16V5M8 9l4-4 4 4"/><path d="M5 15v5h14v-5"/>',
  play: '<path d="m8 5 11 7-11 7z"/>'
};
