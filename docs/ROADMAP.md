# Roadmap

## R0 — Registry foundation ✅
- canonical package schema
- deterministic compiler/index
- provenance and candidate inventories
- CI validation
- onboarding/Pages surface
- external OpenClaw inventory import with deterministic normalization
- external/native isolation tests

## R1 — v7 census and parity 🚧

### R1-A — source census ✅
- pinned `Fallenproud/skill-hub-builder` source revision
- enumerated 10 categories
- preserved 64 initial seed definitions + later `sys-006` → 65 migration-confirmed definitions
- enumerated 10 explicit runtime adapters
- preserved historical static 88-skill product claim as evidence

### R1-B — authoritative live DB census ✅
- captured current `public.skills` read-only
- verified 65 rows / 65 distinct IDs / 65 distinct names
- verified 10 category counts
- verified zero DB-only/source-missing rows
- resolved former 23-record inference as stale static metadata
- corrected current Skill Hub product contract to 65
- verified public-read / authenticated-admin-write RLS state
- captured full 20-field live definition export

### R1-C — identity reconciliation ✅
- live v7 ↔ migration-confirmed source identity parity exact 65/65
- `core-001 / LLM` exact native stable-ID/name match retained
- deployed `ux-001 / UI-Design` preserved
- deployed `ux-002 / UX-Research` preserved
- native `Screenshot to Blueprint` rekeyed to `ux-007`
- native `Frontend Fidelity Reconstruction` rekeyed to `ux-008`
- native ID collisions reduced to zero
- no automatic native promotion

### R1-D — shadow mode 🟢 active
- Supabase DB remains PRIMARY and sole serving authority
- Git v7 export runs as observation-only SHADOW
- first 65 × 20 definition parity pass: exact
- 0 missing DB/file identities
- 0 field mismatches
- shadow errors fail open to DB
- comparison evidence recorded through `registry.shadow.compare`
- additive HMAC-protected `registry-status` action added
- admin migration/shadow status surface added
- production build and changed-surface lint pass
- continue repeated shadow evidence through confidence window

### R1-E — `db → hybrid` ⛔ gated
- require repeated clean shadow evidence, not one successful pass
- explicitly approve cutover before enabling file definitions for serving
- retain database rollback authority through confidence window

### R1-F — `hybrid → files` ⛔ future
- file registry becomes definition serving authority only after hybrid evidence closes
- operational runtime state remains outside canonical definition files

See `docs/R1_V7_CENSUS.md` and `inventory/v7/shadow-evidence.json`.

## R1.1 — External ecosystem qualification
- verify current upstream repository/version/license metadata for selected OpenClaw P0/P1 records
- static security/dependency qualification
- sandbox compatibility matrix
- evidence capture
- explicit `ADOPT | ADAPTER | REFERENCE | DEFER | REJECT` decisions
- promote individual reusable skills only through normal Foundry gates

## R2 — Foundry
- archaeology automation
- normalizer/deduplicator
- conditioning/promotion workflow
- skill creation scaffolder
- evaluation evidence

## R3 — Signed execution
- package signing
- capability policy
- approval/safe mode
- audit events
- retry/idempotency

## R4 — Sophie/agent progressive disclosure
- discover
- inspect
- load
- invoke
- versioned skill references
- provenance-aware results
