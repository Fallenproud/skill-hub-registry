# Skill Hub Registry — Dynamic Site Implementation Blueprint

## Goal

Translate the approved visual assets into responsive, semantic, animated web components. Raster artwork remains useful for README/OG/pitch surfaces, but the GitHub Pages site must communicate the same system using live text, SVG/CSS geometry, generated registry data and script-driven interaction.

## Component map

### Hero
- `hero-copy` — title, value proposition, CTA group and capability chips.
- `hero-system` — two live schema stacks around the `registry-core`.
- `mini-schema-card` — Metadata, Capabilities, Policies, Dependencies, Implementation, Tests.
- `hero-connectors` — animated SVG relationship paths.
- ambient grid/orbs — lightweight parallax depth, never required for meaning.

### Architecture
- `architecture-stage` — full six-card schema topology.
- `architecture-core` — compiler guarantees and active-card explanation.
- focus/hover on a schema card updates the center explanation and highlights its sibling representation.

### Pipeline
- `pipeline-grid` — six semantic stages: Skill Packages → Define → Validate → Compile → Distribute → Runtime Execution.
- desktop/tablet uses a horizontal/wrapped rail; mobile becomes a vertical readable timeline.
- scroll position drives `--pipeline-progress`; cards activate progressively.

### Package anatomy
- live file cards for `SKILL.md`, `skill.json`, `schemas/`, `registry.index.json`.
- compiler bridge and layered compiled-registry treatment reproduce the approved visual language without raster text.

### Live registry
- reads `generated/registry.index.json` from the Pages artifact.
- client-side search filters shipped native packages.
- no product truth is sourced from decorative copy when generated evidence exists.

### Migration confidence
- reads `inventory/v7/live-census.json` and `inventory/v7/shadow-evidence.json` copied during `site:build`.
- displays DB/file counts, definition fields compared and mismatch state.
- observational only; does not affect runtime authority.

## Motion contract

1. **Reveal:** IntersectionObserver adds `.is-visible` once per element.
2. **Parallax:** requestAnimationFrame updates `--parallax-y` on marked ambient/hero elements.
3. **Pointer depth:** fine-pointer devices update hero `--pointer-x/y` only.
4. **Schema interaction:** keyboard focus and pointer hover reveal relationships.
5. **Pipeline:** section-relative scroll progress activates stages and fills the rail.
6. **Ambient loops:** low-frequency rings/connector dashes only; no essential information depends on them.
7. **Reduced motion:** `prefers-reduced-motion` disables parallax, loops, scroll choreography and transforms.

## Responsive contract

- **>1180px:** two-column hero, three-column architecture, six-step pipeline.
- **841–1180px:** stacked hero, three-column architecture retained where space permits, pipeline wraps 3×2.
- **561–840px:** hero visual becomes a two-column card matrix; architecture core moves above two stacks; registry becomes 2-column.
- **≤560px:** all explanatory systems become single-column; schema polygons become rounded cards; pipeline becomes vertical; search and status controls stack.

## Accessibility

- all explanatory text is live HTML.
- component cards are keyboard focusable where interaction changes explanatory state.
- SVG connector layers are decorative and `aria-hidden`.
- color is never the only source of meaning.
- focus-visible treatment is preserved.
- reduced-motion preference is respected.
- GitHub/CTA navigation remains normal links without JS dependency.

## Performance

- no animation framework dependency.
- one passive scroll handler guarded by requestAnimationFrame.
- IntersectionObserver handles reveal work.
- generated JSON remains small and static.
- original raster assets remain available for README/OG/fallback use but are not required to render the live system.

## Build order / acceptance checklist

1. [x] Replace flattened site hero with semantic component hero.
2. [x] Convert left/right capability clusters into live schema cards.
3. [x] Convert six-stage infographic into responsive scripted pipeline.
4. [x] Add file-package/compiled-registry anatomy section.
5. [x] Wire real generated registry data and search.
6. [x] Surface live R1 census + shadow evidence.
7. [x] Add reveal, parallax, connector, pointer-depth and pipeline-progress effects.
8. [x] Add reduced-motion and keyboard/focus behavior.
9. [ ] Run Pages build/validation workflow after commit.
10. [ ] Visual QA deployed URL at desktop/tablet/mobile widths.
11. [ ] Lighthouse/accessibility follow-up after deployed visual inspection.

## Non-goals

- No R1 DB→hybrid cutover.
- No change to Sophie-X routing or execution.
- No new native skill promotion.
- No external animation/runtime dependency.
