# Visual Asset Kit

This directory contains the canonical visual onboarding system for Skill Hub Registry.

## Canonical source assets

The `.svg` files are the **8K UHD vector masters**. Every master declares a `7680 × 4320` canvas and remains resolution-independent for README, GitHub Pages, presentations, mockups, and future raster export.

- `readme/skill-hub-registry-hero.svg` — project hero / first-impression explainer
- `onboarding/01-hero-lockup.svg` — beginner walkthrough: finding and inspecting a skill
- `onboarding/02-trust-badges.svg` — plain-language definition / validation / execution guide
- `onboarding/03-registry-core.svg` — source → compiler → consumer architecture
- `onboarding/04-capability-cluster.svg` — `SKILL.md` + `skill.json` package anatomy
- `onboarding/05-execution-cluster.svg` — definition → validate → qualify → bind → execute
- `onboarding/06-pipeline.svg` — end-to-end discovery and Foundry promotion flow

## Legacy WebP previews

The existing `.webp` files remain in place as lightweight historical/browser previews. They are no longer the canonical editable source for the visual system.

When a visual changes:

1. update the corresponding SVG master;
2. keep its meaning aligned with the repository source of truth;
3. avoid embedding runtime claims that are not supported by the repository;
4. regenerate lightweight raster previews only when a consuming surface requires them.

## Visual rules

The assets are instructional, not decorative. A first-time user should be able to understand the major idea without reading migration internals first.

- prefer plain language before specialist terminology;
- use status words consistently with `docs/SKILL_FORMAT.md` and `docs/ARCHITECTURE.md`;
- never imply that discovery means trust, installation, compatibility, or execution;
- keep external inventories visibly separate from native skills;
- keep runtime execution visibly separate from Git-backed definitions;
- preserve readable contrast and meaningful text outside color alone.

The GitHub Pages implementation should continue to use semantic HTML/SVG/CSS for interactive explanations. These 8K masters are the repository-owned reference/mockup layer, not a replacement for accessible live text.
