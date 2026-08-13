# Skill Hub v7 Census Inventory

`inventory/v7/` contains **legacy/deployed Skill Hub census evidence**, not native Skill Hub Registry packages.

## Artifacts

- `source-census.json` — immutable source-level evidence pinned to the pre-correction Skill Hub source revision. It records the historical static **88-skill** product claim, 65 migration-confirmed definitions, and the formerly inferred 23-record delta.
- `live-export.json` — authoritative read-only identity export from the deployed Supabase `public.skills` table.
- `live-census.json` — authoritative live counts, category totals, RLS verification, contract correction, and remaining parity blockers.

## Current truth

- 10 categories
- 64 initial seeded definitions
- 65 migration-confirmed definitions after `sys-006`
- **65 authoritative live database rows**
- 65 distinct live IDs
- 65 distinct live names
- 0 live-only definitions versus source
- 0 source-confirmed definitions missing live
- 10 explicit runtime-bound adapters
- historical static product claim: 88
- corrected current product/live contract: **65**
- zero native promotions

The previously inferred `88 - 65 = 23` delta was resolved as **stale static product metadata**, not missing database rows.

## Authority

```text
source-census.json  = historical source evidence
live-export.json    = authoritative live identity evidence
live-census.json    = authoritative live census/control evidence
skills/             = canonical native package authority
```

The native compiler continues to scan `skills/` only.

## Commands

Current source/live/native census gate:

```bash
npm run census:v7
```

Reconcile another read-only live export against the current 65-skill contract:

```bash
npm run reconcile:v7 -- path/to/live-v7-export.json
```

The reconciliation command performs no writes and no promotions. A non-zero exit status means shadow-mode gates remain blocked.

## Remaining R1 blocker

Live/source identity parity is exact. Shadow mode remains blocked only by two native stable-ID collisions:

- `ux-001`: v7 `UI-Design` vs native `Screenshot to Blueprint`
- `ux-002`: v7 `UX-Research` vs native `Frontend Fidelity Reconstruction`

See `docs/R1_V7_CENSUS.md` for the full gate model.
