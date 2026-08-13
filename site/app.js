import { schemaLeft, schemaRight, pipelineSteps, packageFiles } from './content.js';
import { schemaCard, pipelineCard, fileCard, skillCard } from './components.js';

const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let registrySkills = [];

async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  return response.json();
}

function renderStaticComponents() {
  for (const item of schemaLeft) {
    $('heroLeftStack').append(schemaCard(item, 'hero'));
    $('architectureLeft').append(schemaCard(item));
  }
  for (const item of schemaRight) {
    $('heroRightStack').append(schemaCard(item, 'hero'));
    $('architectureRight').append(schemaCard(item));
  }
  pipelineSteps.forEach((item, index) => $('pipelineGrid').append(pipelineCard(item, index)));
  packageFiles.forEach((item, index) => $('fileStack').append(fileCard(item, index)));
}

function wireSchemaInteractions() {
  const cards = [...document.querySelectorAll('[data-schema]')];
  const activate = (id, detail) => {
    document.documentElement.dataset.activeSchema = id;
    document.querySelectorAll(`[data-schema="${id}"]`).forEach((card) => card.classList.add('is-active'));
    cards.filter((card) => card.dataset.schema !== id).forEach((card) => card.classList.remove('is-active'));
    $('architectureCoreTitle').textContent = cards.find((card) => card.dataset.schema === id)?.querySelector('strong')?.textContent ?? 'Skill package';
    $('architectureCoreDetail').textContent = detail || 'Validated before promotion';
  };
  const clear = () => {
    cards.forEach((card) => card.classList.remove('is-active'));
    delete document.documentElement.dataset.activeSchema;
    $('architectureCoreTitle').textContent = 'Skill package';
    $('architectureCoreDetail').textContent = 'Validated before promotion';
  };
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => activate(card.dataset.schema, card.dataset.core));
    card.addEventListener('focus', () => activate(card.dataset.schema, card.dataset.core));
    card.addEventListener('mouseleave', clear);
    card.addEventListener('blur', clear);
  });
}

function setupRevealObserver() {
  const nodes = [...document.querySelectorAll('[data-reveal], .schema-card, .pipeline-card, .file-card, .skill-card')];
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    nodes.forEach((node) => node.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  nodes.forEach((node) => observer.observe(node));
}

function setupPointerDepth() {
  const hero = $('heroSystem');
  if (!hero || reduceMotion.matches || !window.matchMedia('(pointer:fine)').matches) return;
  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    hero.style.setProperty('--pointer-x', x.toFixed(3));
    hero.style.setProperty('--pointer-y', y.toFixed(3));
  });
  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--pointer-x', '0');
    hero.style.setProperty('--pointer-y', '0');
  });
}

function setupScrollMotion() {
  if (reduceMotion.matches) return;
  const parallaxNodes = [...document.querySelectorAll('[data-parallax]')];
  const pipeline = $('pipelineShell');
  let ticking = false;
  const update = () => {
    const viewport = window.innerHeight || 1;
    parallaxNodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const normalized = (center - viewport / 2) / viewport;
      const strength = Number(node.dataset.parallax || 0);
      node.style.setProperty('--parallax-y', `${(-normalized * strength * 180).toFixed(2)}px`);
    });

    if (pipeline) {
      const rect = pipeline.getBoundingClientRect();
      const start = viewport * 0.82;
      const end = viewport * 0.18 - rect.height;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / Math.max(1, start - end)));
      pipeline.style.setProperty('--pipeline-progress', progress.toFixed(3));
      const cards = [...pipeline.querySelectorAll('.pipeline-card')];
      cards.forEach((card, index) => card.classList.toggle('is-active', progress >= (index + 0.35) / cards.length));
    }
    ticking = false;
  };
  const request = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });
  request();
}

function renderSkills(query = '') {
  const grid = $('skillGrid');
  const needle = query.trim().toLowerCase();
  const filtered = registrySkills.filter((skill) => {
    if (!needle) return true;
    return [skill.name, skill.description, skill.category, skill.status, skill.version, ...(skill.tags ?? [])]
      .filter(Boolean).join(' ').toLowerCase().includes(needle);
  });
  grid.replaceChildren(...filtered.map(skillCard));
  $('skillResultCount').textContent = `${filtered.length} of ${registrySkills.length} native skills`;
  requestAnimationFrame(setupRevealObserver);
}

function number(value, fallback = '—') {
  return Number.isFinite(Number(value)) ? String(Number(value)) : fallback;
}

async function hydrateData() {
  try {
    const [registry, delta, census, shadow, openclaw] = await Promise.all([
      loadJson('data/registry.index.json'),
      loadJson('data/post-july-delta.json'),
      loadJson('data/live-census.json'),
      loadJson('data/shadow-evidence.json'),
      loadJson('data/openclaw-summary.json')
    ]);

    registrySkills = registry.skills ?? [];
    $('nativeCount').textContent = number(registry.count);
    $('liveCount').textContent = number(census.counts?.current_live_registry);
    $('externalCount').textContent = number(openclaw.count);
    $('driftCount').textContent = number(shadow.counts?.field_mismatches);
    $('fieldsCompared').textContent = number(shadow.counts?.definition_fields_compared);
    $('dbSkillCount').textContent = number(shadow.counts?.db_skills);
    $('fileSkillCount').textContent = number(shadow.counts?.file_skills);
    $('mismatchCount').textContent = number(shadow.counts?.field_mismatches);
    $('shadowStatus').textContent = shadow.status === 'pass' ? `Shadow parity · ${shadow.counts.field_mismatches} drift` : `Shadow ${shadow.status}`;
    $('shadowStatus').closest('.status-pill')?.classList.toggle('status-pill--pass', shadow.status === 'pass');
    document.documentElement.style.setProperty('--post-july-count', number(delta.count, '0'));
    renderSkills();
  } catch (error) {
    console.error(error);
    $('skillGrid').innerHTML = '<p class="load-error">Registry data is generated during the Pages build. Refresh after the current deployment completes.</p>';
    $('skillResultCount').textContent = 'Registry data unavailable';
  }
}

renderStaticComponents();
wireSchemaInteractions();
setupRevealObserver();
setupPointerDepth();
setupScrollMotion();
$('skillSearch').addEventListener('input', (event) => renderSkills(event.currentTarget.value));
hydrateData();
