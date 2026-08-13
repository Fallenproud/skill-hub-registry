<p align="center">
  <img src="assets/readme/skill-hub-registry-hero.webp" alt="Skill Hub Registry — canonical skill packages compiled into a reliable registry" width="100%" />
</p>

# Skill Hub Registry

**Canonical skills. Portable cognition. Reliable execution.**

Skill Hub Registry is the Git-backed definition layer for reusable agent skills. It separates native skill cognition from runtime state and preserves archaeology/external ecosystems as evidence until they pass explicit Foundry and compatibility gates.

> **Core rule:** Git/files define **what a native skill is**. Runtime/control-plane services define **what happens when it runs**. Census or external inventory presence never implies installation, trust, compatibility, or execution.

## Current repository state

| Surface | Current state |
|---|---:|
| Native file-backed skill packages | **17** |
| Historical archaeology candidates | **35** |
| Post-July reusable capability candidates | **28** |
| Internal preserved candidate records | **63** |
| OpenClaw external ecosystem references | **65** |
| OpenClaw native promotions from import | **0** |
| v7 migration-confirmed legacy definitions | **65** |
| v7 explicit runtime adapters | **10** |
| v7 public/deployed registry claim | **88** |
| v7 unresolved live DB delta | **23** |
| Registry/inventory/R1 tests | **11 / 11 passing** |
| Native compiler | **Deterministic + content-addressed** |
| v7 migration strategy | **db → hybrid → files** |
| Existing Skill Hub/Sophie API contract | **Preserved** |

The 65 v7 definitions are a **separate census population pending deduplication/reconciliation**. They are not added blindly to the canonical or tracked-universe count.

## Architecture

```text
skills/                         canonical native packages only
  <category>/<slug>/
    SKILL.md
    skill.json

inventory/
  historical-candidates.json
  post-july-delta.json
  duplicate-decisions.json
  v7/                           deployed/legacy census evidence
  external/
    openclaw/                   reference / qualification inventory

sources/                        provenance records
foundry/                        archaeology → qualification → promotion
runtime-contracts/              invocation / migration / compatibility boundaries
profiles/                       project/domain-specific doctrine
src/ + scripts/ + tests/        deterministic compiler/census/import/validation
```

The native compiler scans `skills/` only. `inventory/`, `sources/`, profiles, v7 census records, and external ecosystem records remain outside executable registry scope.

## Native skill format

```text
skills/<category>/<slug>/
├─ SKILL.md       # agent/human-readable methodology
└─ skill.json     # deterministic routing, contracts, policy and binding metadata
```

The compiler validates native packages and emits:

```text
generated/registry.index.json
```

The index is content-addressed; identical native skill content produces identical registry output.

## R1 — Skill Hub v7 census

The source census is now pinned to `Fallenproud/skill-hub-builder` at commit `aba0a27320a1b8e124f85c2b018d186600f3b203`.

```text
public/deployed contract claim       88
migration-confirmed definitions      65
explicit runtime adapters            10
unresolved live database delta       23
```

The source/native parity preview also detects two stable-ID collisions that must be resolved before cutover:

- `ux-001`: v7 `UI-Design` vs native `Screenshot to Blueprint`
- `ux-002`: v7 `UX-Research` vs native `Frontend Fidelity Reconstruction`

`core-001` / `LLM` is the first preliminary exact stable-ID/name match.

The next authority gate is a **read-only export of the current Supabase `public.skills` table**. Shadow mode and `db → hybrid` remain blocked until the 23-record delta and ID collisions are resolved.

See [`docs/R1_V7_CENSUS.md`](docs/R1_V7_CENSUS.md).

## OpenClaw inventory import

The prior OpenClaw ecosystem catalog is preserved and normalized without changing the canonical architecture.

```text
catalog SHA-256: 9dd8245275351bbc33a0095f33b03904e2fb0a64e876a286842c821254760b7e
sources/openclaw/openclaw_ecosystem_schema.csv
        ↓ validated external projection
inventory/external/openclaw/index/part-01.json … part-13.json
inventory/external/openclaw/schema.json
inventory/external/openclaw/summary.json
```

Imported state:

- **65** external projects
- **14** P0 immediate-evaluation records
- **15** P1 high-value prototype records
- **19** P2 selective/reference records
- **17** P3 low-priority/current-mismatch records
- **65 / 65** retain `Tentative — user review required`
- **0** automatic native promotions

The original strategic scores and integration notes are historical evaluation context, not current proof of repository quality, security, licensing, compatibility, or availability.

### Qualification boundary

```text
discovery
→ static qualification
→ sandbox qualification
→ compatibility testing
→ evidence capture
→ governed treatment decision
```

Allowed treatment results:

`ADOPT | ADAPTER | REFERENCE | DEFER | REJECT`

`openclaw/agent-skills` is a discovery source, **not** authorization to mirror an external skill registry. Individual capabilities must pass the normal Foundry/provenance/security/runtime gates before native promotion.

See:

- [`docs/OPENCLAW_IMPORT.md`](docs/OPENCLAW_IMPORT.md)
- [`runtime-contracts/openclaw-compatibility.md`](runtime-contracts/openclaw-compatibility.md)
- [`inventory/external/openclaw/README.md`](inventory/external/openclaw/README.md)

## Leave No Reusable Skill Behind

Discovery is not promotion.

```text
Search historical/external/deployed work
        ↓
Capture provenance
        ↓
Extract transformation/capability
        ↓
Isolate project/domain/external specifics
        ↓
Classify evidence + maturity
        ↓
Deduplicate by identity + contract
        ↓
Qualify security/dependencies/runtime
        ↓
Draft skill/profile/adapter decision
        ↓
Validate + test
        ↓
Promote only when justified
```

This lets the registry preserve useful work without becoming a folder of prompts or an unreviewed marketplace mirror.

## Project separation

Project-specific identity and doctrine remain under `profiles/` or future `specimens/`. External ecosystem suggestions may mention target products, but those suggestions never authorize cross-project coupling.

## Skill Hub v7 migration

```text
1. Pin and census v7 source                     ✅
2. Export current live Skill Hub database       ⛔ required
3. Reconcile source ↔ live ↔ native identities
4. Resolve ID collisions and semantic variants
5. Preserve stable IDs where semantically equal
6. Run shadow DB/file routing comparisons
7. db → hybrid only after parity gates pass
8. retain DB rollback through confidence window
9. hybrid → files only after evidence closes
```

The existing Skill Hub/Sophie-X API, authentication/callback behavior, IDs, and invocation contract remain the compatibility boundary during census and migration.

## Commands

Requires **Node.js 22+**.

```bash
npm run import:openclaw
npm run validate
npm run build
npm run census:v7
npm run reconcile:v7 -- path/to/live-v7-export.json
npm test
npm run site:build
npm run check
```

`npm run census:v7` validates the source census and prints the preliminary source/native parity state. `npm run reconcile:v7` is read-only and requires an authoritative live export; a non-zero exit means shadow mode remains blocked.

Legacy package generation remains available for a later governed promotion/cutover step:

```bash
npm run import:v7 -- path/to/approved-v7-skills.json
```

It is **not** the census mechanism.

## CI invariants

CI verifies that:

- native manifests and `SKILL.md` packages validate;
- native IDs/slugs and dependencies are coherent;
- historical/delta inventories retain their expected counts;
- the v7 source census remains 65 migration-confirmed / 88 claimed / 23 unresolved until a new authoritative census updates it;
- the 10 v7 runtime bindings remain explicitly separate from definition count;
- known v7/native ID collisions are detected rather than overwritten;
- v7 census performs zero automatic native promotions;
- OpenClaw normalized output is deterministic;
- all **65** `OC-*` records stay external;
- `native_promotion_count === 0` for the OpenClaw import;
- project-specific profiles remain outside native packages;
- the native registry remains deterministic/content-addressed;
- tests and the static onboarding build pass.

## Roadmap

**R0 — Registry foundation** ✅  
Native registry, Foundry boundaries, deterministic compiler, archaeology, CI, and external OpenClaw inventory import.

**R1 — v7 census + parity** 🚧  
Source census complete. Live database census, full identity reconciliation, shadow mode, and hybrid cutover remain gated.

**R1.1 — External ecosystem qualification**  
Current upstream/version/license/security verification for selected OpenClaw P0/P1 candidates; explicit treatment decisions only after evidence.

**R2 — Automated Skill Foundry**  
Archaeology automation, normalization, deduplication, qualification, creation, evidence and promotion workflows.

**R3 — Signed/capability-gated execution**  
Signing, permission policy, approvals, audit events, retry/idempotency.

**R4 — Progressive agent discovery/load/invoke**  
Versioned, provenance-aware skill discovery for Sophie-X and compatible runtimes.

See [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Contribution principle

Do not add a native skill because it sounds useful, because it exists in v7, or because an external repository exists.

Preserve evidence first. Promote only when the reusable transformation, routing boundary, contracts, provenance, dependencies, security posture, compatibility, maturity, identity treatment, and execution state are explicit.
