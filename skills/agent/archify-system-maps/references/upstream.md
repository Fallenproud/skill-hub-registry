# Upstream Reference — Archify

Canonical upstream: https://github.com/tt-a1i/archify

Reviewed: 2026-09-03

## Upstream role

Archify is the preferred implementation behind this Skill when available. It turns typed JSON IR into deterministic, validated, self-contained technical artifacts for architecture, workflow, sequence, data-flow, and lifecycle/state diagrams.

Key upstream capabilities observed during review:

- typed JSON intermediary representation;
- deterministic HTML/SVG rendering;
- schema and composition validation;
- structured repair diagnostics;
- last-known-good preview behavior;
- atomic verified delivery;
- architecture Before / Delta / After comparison;
- repository evidence mode with revision-aware source references;
- interactive focus, authored reach, route probing, semantic lenses, and guided stories;
- PNG/SVG/WebM/share-card export paths;
- explicit separation between deterministic artifact checks, automated browser evidence, and perceptual review.

## Integration rule

Do not vendor or silently fork upstream implementation into this Skill Hub package.

When Archify is installed, inspect its current `SKILL.md`, schemas, examples, and CLI and treat those files as authoritative for current commands and schema fields.

This wrapper owns:

- routing;
- reusable execution doctrine;
- truth boundaries;
- integration semantics;
- fallback behavior;
- Skill Hub compatibility.

Upstream owns:

- concrete renderer implementation;
- schemas;
- validator implementation;
- exact CLI behavior;
- export implementation;
- release-specific features.

## Provenance

At review time, Archify declared MIT licensing and its Skill metadata stated that it is based on `Cocoon-AI/architecture-diagram-generator` (MIT, v1.0).

Preserve all upstream license, attribution, and third-party notices when distributing upstream code, generated packages containing upstream assets, or derivative implementation material.

## Reusable pattern extracted

The architecture pattern intentionally retained for broader agent/runtime use is:

1. Evidence acquisition
2. Typed intermediary representation
3. Deterministic validation
4. Structured diagnostic receipt
5. Surgical repair
6. Candidate rendering
7. Artifact verification
8. Optional browser evidence
9. Optional perceptual review
10. Receipt generation
11. Atomic promotion
12. Last-known-good preservation

This pattern may be reused outside visualization systems without claiming those systems are Archify-compatible.
