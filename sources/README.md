# Provenance Sources

This directory stores evidence used by the Skill Foundry and migration/compatibility workflows. A source is not automatically a canonical skill.

Sources may be project-specific, external, incomplete, superseded, tentative, or unsafe; they are retained so later decisions remain attributable.

## Rules

1. Record provenance before rewriting, generalizing, or promoting source material.
2. Keep project-specific identity in `profiles/` or `specimens/` unless a reusable transformation can be isolated cleanly.
3. Keep external ecosystem material in external inventories/adapters unless explicitly promoted through the Foundry.
4. Never promote a candidate only because a prompt, README, repository, UI, or marketplace listing exists.
5. Preserve safety, licensing, platform, and review caveats from the source.
6. Canonical skills require their own contracts, tests, provenance, and maturity evidence.

## Preserved sources

- `MASTER_SKILL_LEDGER.md` — diffable projection of the July 14, 2026 archaeology ledger.
- `openclaw/openclaw_ecosystem_catalog.csv.gz` — byte-preserving gzip of the exact 65-project OpenClaw catalog imported from the prior inventory work.
- `openclaw/openclaw_ecosystem_schema.csv` — exact 21-field schema accompanying the OpenClaw catalog.
- `source-register.json` — machine-readable source index.

The OpenClaw CSVs are preserved as source evidence. Their normalized runtime-independent projection lives under `inventory/external/openclaw/`.
