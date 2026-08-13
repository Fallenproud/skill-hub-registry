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
- pin `Fallenproud/skill-hub-builder` source revision
- enumerate 10 categories
- enumerate 64 initial seed definitions
- capture later `sys-006` addition → 65 migration-confirmed definitions
- enumerate 10 explicit runtime adapters
- preserve public/deployed 88-skill contract claim
- record unresolved live DB delta: 23
- preliminary reconciliation against current 17 native packages
- detect stable-ID collisions before import/promotion

### R1-B — authoritative live DB census ⛔ required
- export current `public.skills` rows read-only
- export current categories and category counts
- identify the 23 unresolved records or correct the 88-skill public contract
- verify duplicate IDs/names
- verify current RLS/policy state
- retain full routing/policy/contracts/tool-definition fields for parity

### R1-C — parity reconciliation ⏳ partial
- compare live v7 vs migration-confirmed source census
- compare live v7 vs native Git packages
- preserve stable IDs where semantically identical
- resolve ID collisions explicitly
- classify exact matches, variants, source-only, live-only, native-only, and collisions
- no automatic native promotion

### R1-D — shadow mode ⛔ not started
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
