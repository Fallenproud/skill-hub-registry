# Roadmap

## R0 — Registry foundation ✅
- canonical package schema
- deterministic compiler/index
- provenance and candidate inventories
- CI validation
- onboarding/Pages surface build
- external OpenClaw inventory import with deterministic normalization
- external/native isolation tests

## R1 — v7 census and parity 🚧

### R1-A — source census ✅
- pin `Fallenproud/skill-hub-builder` source revision
- enumerate 10 categories
- enumerate 64 initial seed definitions
- capture later `sys-006` addition → 65 migration-confirmed definitions
- enumerate 10 explicit runtime adapters
- preserve historical static 88-skill product claim as evidence
- preliminary reconciliation against current 17 native packages
- detect stable-ID collisions before import/promotion

### R1-B — authoritative live DB census ✅
- queried current `public.skills` read-only
- captured authoritative 65-row identity export
- captured 10 categories and category counts
- verified 65 distinct IDs and 65 distinct names
- verified zero DB-only rows and zero source-confirmed rows missing live
- resolved the former 23-record inference as stale static metadata, not database rows
- corrected current Skill Hub static product contract from 88 to 65
- verified current RLS: public read, authenticated admin-only writes

### R1-C — parity reconciliation ⏳ collision resolution next
- live v7 ↔ migration-confirmed source identity parity is exact 65/65
- `core-001 / LLM` is an exact native ID/name match
- `ux-001` collision: v7 `UI-Design` vs native `Screenshot to Blueprint`
- `ux-002` collision: v7 `UX-Research` vs native `Frontend Fidelity Reconstruction`
- preserve deployed v7 stable IDs where they are externally established
- resolve native provisional ID collisions explicitly before shadow mode
- no automatic native promotion

### R1-D — shadow mode ⛔ not started
- start only after `ux-001` and `ux-002` collision policy is applied and validated
- run DB and file resolvers side-by-side
- compare routing, contracts, policy, execution binding, and result references
- record mismatches without changing serving authority

### R1-E — `db → hybrid` ⛔ not started
- cut over only after live census and shadow gates pass
- retain database rollback authority through confidence window

### R1-F — `hybrid → files` ⛔ future
- file registry becomes definition authority only after parity evidence closes
- operational runtime state remains outside canonical definition files

See `docs/R1_V7_CENSUS.md`.

## R1.1 — External ecosystem qualification
- verify current upstream repository/version/license metadata for selected OpenClaw P0/P1 records
- static security/dependency qualification
- sandbox compatibility matrix
- evidence capture
- explicit `ADOPT | ADAPTER | REFERENCE | DEFER | REJECT` decisions
- promote individual reusable skills only through the normal Foundry gates

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
