# OpenClaw External Ecosystem Inventory

This directory is a normalized, validated import of the previously curated OpenClaw ecosystem catalog.

**Important:** these 65 records are **external ecosystem references**, not native Skill Hub skills and not runtime registrations.

## Files

- `index/*.json` — normalized 65-project discovery index split into 13 deterministic five-record parts; full 21-field records remain in the preserved source catalog.
- `schema.json` — normalized 21-field source schema.
- `summary.json` — deterministic counts, source hashes, and evaluation queues.

The exact CSV sources are preserved under `sources/openclaw/`.

## Architecture boundary

OpenClaw remains an external ecosystem. Importing a project record does not:

- create a package under `skills/`;
- create an executable binding;
- change the native registry hash;
- authorize cloning/installing/running the project;
- merge OpenClaw product identity into Skill Hub, Sophie-X, AIKO/AIKOV, Daycostra, or another product.

A project may advance only through an explicit qualification path:

`discovery → static qualification → sandbox qualification → compatibility testing → evidence capture → governed activation`

Promotion into a native skill requires the normal Skill Foundry gates plus source/license/security/runtime review.

## Imported state

- Projects: **65**
- P0 — immediate evaluation: **14**
- P1 — high-value prototype: **15**
- P2 — selective/reference: **19**
- P3 — low priority/current mismatch: **17**
- Local-first `Yes`: **47**
- Mandatory security review: **4**
- Human review state: **65 / 65 tentative**
- Native promotions performed by this import: **0**

The original strategic scores and integration notes are preserved as historical evaluation context, not as current proof of project quality, safety, availability, licensing, or compatibility.
