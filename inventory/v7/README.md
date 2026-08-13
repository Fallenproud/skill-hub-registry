# Skill Hub v7 Census Inventory

`inventory/v7/` contains **legacy/deployed Skill Hub census evidence**, not native Skill Hub Registry packages.

## Current artifact

`source-census.json` pins the v7 source repository revision and records:

- 10 categories
- 64 initial seeded definitions
- 65 migration-confirmed definitions after `sys-006`
- 10 explicit runtime-bound adapters
- public/deployed contract claim of 88 skills
- 23 unresolved live-database records pending authoritative Supabase export
- zero native promotions

## Authority

```text
source-census.json
  authority = source-census
  compiler eligible = false
  promotion = never automatic
```

The native compiler continues to scan `skills/` only.

## Commands

Source/native census gate:

```bash
npm run census:v7
```

Authoritative live reconciliation after a read-only DB export is available:

```bash
npm run reconcile:v7 -- path/to/live-v7-export.json
```

The reconciliation command performs no writes and no promotions. A non-zero exit status means shadow-mode gates remain blocked.

See `docs/R1_V7_CENSUS.md` for the full gate model.
