<p align="center">
  <img src="assets/readme/skill-hub-registry-hero.webp" alt="Skill Hub Registry — canonical skill packages compiled into a reliable registry" width="100%" />
</p>

# Skill Hub Registry

**Canonical skills. Portable cognition. Reliable execution.**

Skill Hub Registry is the Git-backed definition layer for reusable agent skills. It separates human/agent-readable methodology from deterministic runtime contracts, preserves provenance across migrations, and compiles a lightweight registry index that Skill Hub, Sophie-X, and compatible runtimes can discover progressively.

> **Core rule:** Git/files define **what a skill is**. Runtime/control-plane services define **what happens when it runs**.

## Current repository state

| Surface | Current state |
|---|---:|
| Native file-backed skill packages | **17** |
| Preserved historical archaeology candidates | **35** |
| Post-July reusable capability candidates | **28** |
| Preserved candidate capsules | **63** |
| Root taxonomy families | **12** |
| Registry tests | **5 / 5 passing** |
| Compiler | **Deterministic + content-addressed** |
| v7 migration strategy | **db → hybrid → files** |
| Existing Skill Hub/Sophie API contract | **Preserved during migration** |

The repository intentionally contains **more preserved candidates than native skills**. Discovery is not promotion. A recovered workflow can remain L0/L1 in `candidates/` until its contracts, evidence, and boundaries are strong enough to enter `skills/`.

---

## Why this exists

A database row is useful operational state, but it is a poor long-term source of truth for reusable cognition.

A canonical skill needs to survive UI rewrites, model changes, database migrations, and agent/runtime replacements while remaining readable and versionable.

Each native skill therefore has two primary layers:

```text
SKILL.md
  human + agent-readable methodology

skill.json
  deterministic routing, contracts, policy,
  compatibility, provenance and runtime binding
```

The compiler validates these packages and produces:

```text
generated/registry.index.json
```

Consumers can discover the lightweight index first and hydrate full `SKILL.md` content only when a skill is selected.

---

## Architecture

```text
                     ┌──────────────────────────────┐
                     │   Git-backed skill packages │
                     │                              │
                     │  SKILL.md                    │
                     │  skill.json                  │
                     │  schemas / examples / tests │
                     └──────────────┬───────────────┘
                                    │
                            validate + compile
                                    │
                     ┌──────────────▼───────────────┐
                     │     Registry compiler       │
                     │                              │
                     │ deterministic index         │
                     │ content hashes              │
                     │ dependency checks           │
                     └──────────────┬───────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 ▼                  ▼                  ▼
         Skill Hub runtime     Sophie-X / agents   Registry APIs
                 │
                 ▼
        operational projection
             / Supabase
```

### Definition plane

Git owns:

- skill identity and semantic version
- methodology and boundaries
- routing metadata
- input/output contracts
- provenance
- compatibility
- execution binding declaration
- schemas/examples/tests

### Operational plane

Skill Hub/Supabase remain appropriate for:

- enable/disable state
- tenant/user permissions
- invocation history
- analytics and success rate
- runtime health
- cost/latency telemetry
- logs and traces
- installed skill state
- callbacks and execution sessions

This keeps **definition history** and **runtime state** from becoming the same thing.

---

## Repository map

```text
skill-hub-registry/
├─ assets/
│  ├─ readme/                  # selected GitHub README hero
│  └─ onboarding/              # reusable HTML/PPTX visual modules
│
├─ skills/                     # native loadable packages
│  ├─ core/
│  ├─ brand/
│  ├─ governance/
│  ├─ meta/
│  ├─ ux/
│  ├─ audit/
│  ├─ agent/
│  ├─ orchestration/
│  ├─ runtime/
│  ├─ deployment/
│  └─ research/
│
├─ candidates/                 # preserved, NOT runtime-loaded
├─ profiles/
│  ├─ project-specific/        # valuable project doctrine kept isolated
│  └─ domain/                  # intentional domain specializations
│
├─ foundry/                    # archaeology → promotion methodology
├─ runtime-contracts/          # authorization / invocation / migration contracts
├─ inventory/                  # machine-readable archaeology ledgers
├─ sources/                    # provenance register + preserved master ledger
├─ migration/                  # v7 export/import/parity/census work
├─ schemas/                    # manifest/contract schemas
├─ generated/                  # compiled registry output
├─ src/                        # compiler + validation logic
├─ scripts/                    # migration and site build utilities
├─ tests/                      # registry/foundry invariant tests
├─ site/                       # static onboarding / demonstration surface
└─ .github/workflows/          # CI + GitHub Pages deployment
```

---

## Native foundation included now

The first scaffold promotes only capabilities with enough reusable structure to justify a native package. Current examples include:

- **LLM Core** — backwards-compatible execution reference
- **Brand Identity Packaging**
- **Production Reality Gate**
- **Capability Conditioning Protocol**
- **Skill Archaeologist**
- **Skill Creator**
- **Screenshot to Blueprint**
- **Frontend Fidelity Reconstruction**
- **Toptier Topology**
- **Systems Auditor**
- **Legacy Donor Extraction**
- **Agent Creation & Packaging**
- **Multi-Agent Orchestration**
- **Human Approval Gate**
- **Registry Migration & Parity Auditor**
- **Deployment-Ready Package Builder**
- **Evidence-Grounded Research**

Everything else discovered so far remains preserved in `inventory/` with a merge target and next action instead of being falsely promoted.

---

## Skill package format

Minimum package:

```text
skills/<category>/<slug>/
├─ SKILL.md
└─ skill.json
```

Optional additions:

```text
schemas/
examples/
references/
scripts/
runtime/
tests/
```

### `SKILL.md`

Contains operational cognition:

- purpose
- invocation boundary
- inputs
- outputs
- workflow/method
- constraints
- quality gates
- failure behavior

### `skill.json`

Contains deterministic machine metadata:

- stable ID + slug
- semantic version
- category
- status + maturity
- routing trigger/boundary
- input/output contracts
- execution kind/binding
- policy flags
- compatibility
- provenance
- dependencies

See [`docs/SKILL_FORMAT.md`](docs/SKILL_FORMAT.md).

---

## Maturity model

| Level | Meaning | Promotion gate |
|---|---|---|
| **L0 — Captured** | Source material found | Source + provenance recorded |
| **L1 — Documented** | Reusable workflow described | Skill draft + isolation notes |
| **L2 — Structured** | Contracts/runtime rules defined | Schema/runtime validation |
| **L3 — Tested** | Executed against real specimen | Tests + evidence pass |
| **L4 — Production-ready** | Versioned, secure, failure-aware | Verifier + integrity checks |
| **L5 — Composable** | Proven inside larger workflows | Composition tests pass |

A polished README, screenshot, prompt, or registry row does **not** raise maturity by itself.

---

## Leave No Reusable Skill Behind

The Skill Foundry preserves archaeology separately from canonical execution.

```text
Search historical work
        ↓
Capture provenance
        ↓
Extract transformation
        ↓
Isolate project/domain specifics
        ↓
Classify maturity/evidence
        ↓
Deduplicate by contract
        ↓
Draft skill/runtime/profile
        ↓
Validate + test
        ↓
Promote
```

The July 14 archaeology ledger is preserved at:

```text
sources/MASTER_SKILL_LEDGER.md
```

Machine-readable mirrors live under `inventory/` and `sources/source-register.json`.

Read [`foundry/ARCHAEOLOGY_PROTOCOL.md`](foundry/ARCHAEOLOGY_PROTOCOL.md) for the canonical process.

---

## Project separation rule

Project-specific material is valuable evidence but does not automatically become universal skill behavior.

Examples currently preserved as profiles include:

- AIKO onboarding source profile
- AIKO brand asset-pack source profile
- Sophie-X diagram-language source profile
- Sophie-X runtime-workspace source profile
- Norway market intelligence domain profile

The reusable transformation is extracted into a domain-neutral skill where possible; project identity stays in `profiles/` or future `specimens/`.

---

## v7 → file-backed migration

The existing Skill Hub stays online throughout migration.

```text
1. Export live registry
2. Preserve stable IDs
3. Generate SKILL.md + skill.json packages
4. Compile deterministic file registry
5. Compare parity
6. Run shadow routing
7. Switch db → hybrid
8. Switch hybrid → files only after gates pass
9. Retain DB rollback until confidence window closes
```

Supported source modes are defined in [`runtime-contracts/migration-source-selection.md`](runtime-contracts/migration-source-selection.md).

**No Sophie-X storage-specific rewrite is required for the initial migration** as long as the existing Skill Hub API, HMAC/callback behavior, IDs, and invocation contract are preserved.

The remaining blocking migration prerequisite is a fresh **live registry census**. See [`migration/live-registry-census/README.md`](migration/live-registry-census/README.md).

---

## Commands

Requires **Node.js 22+**.

```bash
npm run validate
npm run build
npm test
npm run site:build
```

Full local release gate:

```bash
npm run check
```

Legacy v7 import after obtaining a registry export:

```bash
npm run import:v7 -- path/to/v7-skills.json
```

The initial compiler intentionally has **no third-party runtime dependency**.

---

## Deterministic registry output

`generated/registry.index.json` is content-addressed.

The compiler hashes the canonical sorted registry entries and emits:

```json
{
  "schema_version": "1.0",
  "registry_hash": "…",
  "count": 17,
  "skills": []
}
```

No volatile generation timestamp is included, so rebuilding identical skill content produces identical output.

---

## Onboarding / demonstration site

The reusable neon onboarding components are stored under `assets/onboarding/` and composed into a static demonstration surface under `site/`.

The Pages workflow:

```text
validate registry
→ compile registry index
→ build static onboarding site
→ upload Pages artifact
→ deploy
```

After GitHub Pages is enabled with **GitHub Actions** as the publishing source, the repository can publish the onboarding surface without changing the Skill Hub runtime itself.

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## CI invariants

Pull requests and pushes to `main` verify:

- native manifest structure
- unique IDs/slugs
- `SKILL.md` presence
- fallback/dependency references
- archaeology inventory counts/IDs
- project-specific profile separation
- deterministic registry output
- test suite
- static site build

Executable adapter bindings are explicit. A skill cannot become executable merely because a definition exists.

---

## Roadmap

**R0 — Registry foundation** ← current

**R1 — Live v7 census + parity migration**

**R2 — Automated Skill Foundry**

**R3 — Signed/capability-gated execution**

**R4 — Progressive discovery/load/invoke for Sophie-X and other agents**

See [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## Visual asset kit

The repository includes the approved modular visual system for README, onboarding, HTML scaffolds, pitches, and architecture demonstrations:

| Asset | Purpose |
|---|---|
| `assets/readme/skill-hub-registry-hero.webp` | canonical GitHub README hero |
| `assets/onboarding/01-hero-lockup.webp` | page / deck title lockup |
| `assets/onboarding/02-trust-badges.webp` | file-backed / versioned / validated / executable strip |
| `assets/onboarding/03-registry-core.webp` | registry-core visual |
| `assets/onboarding/04-capability-cluster.webp` | metadata / capabilities / policies |
| `assets/onboarding/05-execution-cluster.webp` | dependencies / implementation / tests |
| `assets/onboarding/06-pipeline.webp` | package → runtime execution pipeline |

---

## Contribution principle

Do not add a skill because it sounds useful.

Add a candidate when evidence exists. Promote a native skill only when its reusable transformation, routing boundary, contracts, policy, provenance, and maturity are explicit.

That is how this registry can grow without becoming another folder full of prompts.
