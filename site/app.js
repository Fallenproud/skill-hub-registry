const $ = (id) => document.getElementById(id);

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  return response.json();
}

try {
  const [registry, delta] = await Promise.all([loadJson('data/registry.index.json'), loadJson('data/post-july-delta.json')]);
  $('nativeCount').textContent = registry.count;
  $('deltaCount').textContent = delta.count;
  const grid = $('skillGrid');
  for (const skill of registry.skills.slice(0, 12)) {
    const card = document.createElement('article');
    card.className = 'skill-card';
    card.innerHTML = `<div class="meta">${skill.category} · ${skill.status} · ${skill.version}</div><h3>${skill.name}</h3><p>${skill.description}</p>`;
    grid.append(card);
  }
} catch (error) {
  console.error(error);
  $('skillGrid').innerHTML = '<p>Registry data is generated during the Pages build.</p>';
}
