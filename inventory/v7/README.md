# Skill Hub v7 Census Inventory

`inventory/v7/` contains **legacy/deployed Skill Hub migration evidence**, not native Skill Hub Registry packages.

## Artifacts

- `source-census.json` — immutable historical source evidence. It preserves the old static **88-skill** product claim, 65 migration-confirmed definitions, and the formerly inferred 23-record delta.
- `live-export.json` — authoritative read-only snapshot of the deployed Supabase `public.skills` definition layer: **65 rows × 20 definition fields**.
- `live-census.json` — authoritative counts, category totals, security state, identity resolution, and current R1 gate state.
- `shadow-evidence.json` — first full R1-D DB↔file parity evidence pass.

## Current truth

- 10 categories
- 64 initial seeded definitions
- 65 migration-confirmed definitions after `sys-006`
- **65 authoritative live database rows**
- 65 distinct live IDs and names
- 0 live-only definitions versus source
- 0 source-confirmed definitions missing live
- 10 explicit runtime-bound adapters
- historical static product claim: 88
- current product/live contract: **65**
- native ID collisions: **0**
- first shadow definition parity: **65/65 × 20/20 fields, 0 mismatches**
- native promotions: **0**

The earlier `88 - 65 = 23` inference was stale static metadata, not missing live rows.

## Identity resolution

Stable deployed IDs were preserved:

- `ux-001` → `UI-Design`
- `ux-002` → `UX-Research`

The provisional native packages were rekeyed:

- `Screenshot to Blueprint` → `ux-007`
- `Frontend Fidelity Reconstruction` → `ux-008`

## Authority

```text
source-census.json   = historical source evidence
live-export.json     = authoritative deployed-definition snapshot
live-census.json     = authoritative live census/control evidence
shadow-evidence.json = R1-D comparison evidence
skills/              = canonical native package authority
```

The native compiler scans `skills/` only. During R1-D, Skill Hub still serves definitions from Supabase DB; the v7 file export is observation-only.

## Commands

```bash
npm run census:v7
npm run reconcile:v7 -- path/to/live-v7-export.json
```

Reconciliation performs no writes and no promotions.

## Current gate

R1-A, R1-B, and R1-C are complete. R1-D is active with one exact full-definition pass. R1-E remains gated until repeated clean shadow evidence closes the confidence window.

See `docs/R1_V7_CENSUS.md` for the full gate model.
