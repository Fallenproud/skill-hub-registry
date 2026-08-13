<p align="center">
  <img src="assets/readme/skill-hub-registry-hero.webp" alt="Skill Hub Registry — canonical skill packages compiled into a reliable registry" width="100%" />
</p>

# Skill Hub Registry

**Canonical skills. Portable cognition. Reliable execution.**

Skill Hub Registry is the Git-backed definition layer for reusable agent skills. It separates native skill cognition from runtime state and preserves archaeology/external ecosystems as evidence until they pass explicit Foundry and compatibility gates.

> **Core rule:** Git/files define **what a native skill is**. Runtime/control-plane services define **what happens when it runs**. External inventories do not become executable merely because they exist.

## Current repository state

| Surface | Current state |
|---|---:|
| Native file-backed skill packages | **17** |
| Historical archaeology candidates | **35** |
| Post-July reusable capability candidates | **28** |
| Internal preserved candidate records | **63** |
| OpenClaw external ecosystem references | **65** |
| OpenClaw native promotions from import | **0** |
| Registry/inventory tests | **8 / 8 passing** |
| Native compiler | **Deterministic + content-addressed** |
| v7 migration strategy | **db → hybrid → files** |
| Existing Skill Hub/Sophie API contract | **Preserved** |

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
  external/
    openclaw/                   reference / qualification inventory

sources/
  openclaw/                     exact preserved source catalog + schema

foundry/                        archaeology → qualification → promotion
runtime-contracts/              invocation / migration / compatibility boundaries
profiles/                       project/domain-specific doctrine
src/ + scripts/ + tests/        deterministic compiler/import/validation
```

The native compiler scans `skills/` only. `inventory/`, `sources/`, profiles, and external ecosystem records remain outside executable registry scope.

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

## OpenClaw inventory import

The prior OpenClaw ecosystem catalog is now preserved and normalized without changing the canonical architecture.

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

The original strategic scores and integration notes are preserved as historical evaluation context, not current proof of repository quality, security, licensing, compatibility, or availability.

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
Search historical/external work
        ↓
Capture provenance
        ↓
Extract transformation/capability
        ↓
Isolate project/domain/external specifics
        ↓
Classify evidence + maturity
        ↓
Deduplicate by contract
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

The storage migration remains independent of the OpenClaw import:

```text
1. Export live Skill Hub registry
2. Preserve stable IDs
3. Generate SKILL.md + skill.json packages
4. Compile deterministic file registry
5. Compare parity
6. Run shadow routing
7. db → hybrid
8. hybrid → files only after gates pass
9. retain DB rollback until confidence window closes
```

The existing Skill Hub/Sophie-X API, authentication/callback behavior, IDs, and invocation contract remain the compatibility boundary during migration.

## Commands

Requires **Node.js 22+**.

```bash
npm run import:openclaw
npm run validate
npm run build
npm test
npm run site:build
npm run check
```

`npm run check` deterministically regenerates the OpenClaw normalized inventory, validates native + internal + external invariants, recompiles the native registry, runs the test suite, and fails on committed-output drift.

Legacy v7 import remains available with:

```bash
npm run import:v7 -- path/to/v7-skills.json
```

## CI invariants

CI verifies that:

- native manifests and `SKILL.md` packages validate;
- native IDs/slugs and dependencies are coherent;
- historical/delta inventories retain their expected counts;
- OpenClaw source → normalized output is deterministic;
- all **65** `OC-*` records stay external;
- `native_promotion_count === 0` for the OpenClaw import;
- external records cannot create native executable bindings;
- project-specific profiles remain outside native packages;
- the native registry remains deterministic/content-addressed;
- tests and the static onboarding build pass.

## Roadmap

**R0 — Registry foundation** ✅  
Native registry, Foundry boundaries, deterministic compiler, archaeology, CI, and external OpenClaw inventory import.

**R1 — Live v7 census + parity migration**  
Authoritative deployed Skill Hub export, parity comparison, shadow mode, hybrid cutover.

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

Do not add a native skill because it sounds useful or because an external repository exists.

Preserve evidence first. Promote only when the reusable transformation, routing boundary, contracts, provenance, dependencies, security posture, compatibility, maturity, and execution treatment are explicit.
