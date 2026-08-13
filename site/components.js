import { iconPaths } from './content.js';

export function icon(name, className = '') {
  return `<svg class="ui-icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] ?? iconPaths.cube}</svg>`;
}

export function schemaCard(item, variant = 'architecture') {
  const element = document.createElement('button');
  element.type = 'button';
  element.className = `${variant === 'hero' ? 'mini-schema-card' : 'schema-card'} tone-${item.tone}`;
  element.dataset.schema = item.id;
  element.dataset.core = item.core;
  element.innerHTML = `
    <span class="schema-icon">${icon(item.icon)}</span>
    <span class="schema-copy"><strong>${item.title}</strong><small>${item.detail}</small></span>
    <span class="schema-node" aria-hidden="true"></span>`;
  element.setAttribute('aria-label', `${item.title}: ${item.detail}`);
  return element;
}

export function pipelineCard(item, index) {
  const element = document.createElement('article');
  element.className = `pipeline-card tone-${item.tone}`;
  element.dataset.stepIndex = index;
  element.tabIndex = 0;
  element.innerHTML = `
    <span class="pipeline-card__step">${item.step}</span>
    <span class="pipeline-card__icon">${icon(item.icon)}</span>
    <strong>${item.title}</strong>
    <p>${item.detail}</p>
    <span class="pipeline-node" aria-hidden="true"></span>`;
  return element;
}

export function fileCard(item, index) {
  const element = document.createElement('article');
  element.className = `file-card file-card--${item.type}`;
  element.style.setProperty('--file-index', index);
  const iconName = item.type === 'folder' ? 'package' : item.type === 'md' ? 'document' : 'code';
  element.innerHTML = `<span>${icon(iconName)}</span><div><strong>${item.name}</strong><small>${item.detail}</small></div>`;
  return element;
}

export function skillCard(skill) {
  const element = document.createElement('article');
  element.className = 'skill-card';
  const tags = Array.isArray(skill.tags) ? skill.tags.slice(0, 3) : [];
  element.innerHTML = `
    <div class="skill-card__meta"><span>${skill.category}</span><span>${skill.status}</span><span>v${skill.version}</span></div>
    <h3>${skill.name}</h3>
    <p>${skill.description}</p>
    ${tags.length ? `<div class="skill-card__tags">${tags.map((tag) => `<span>${tag}</span>`).join('')}</div>` : ''}`;
  return element;
}
