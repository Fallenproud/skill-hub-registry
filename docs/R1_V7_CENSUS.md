# R1 — Skill Hub v7 Census & Parity

Status: **source census complete; authoritative live DB export required**.

This phase inventories the legacy/deployed Skill Hub v7 before any storage-authority cutover. Census records are evidence only. They are not native promotions.

## Source pinned

| Field | Value |
|---|---|
| Repository | `Fallenproud/skill-hub-builder` |
| Branch | `main` |
| Census commit | `aba0a27320a1b8e124f85c2b018d186600f3b203` |
| Deployed surface | `https://my-agenthub.lovable.app` |
| Operational store | Supabase |

Machine-readable source census: `inventory/v7/source-census.json`.

## Four-count truth

The v7 source currently exposes four different truths that must not be collapsed into one number:

| Truth | Count | Evidence meaning |
|---|---:|---|
| Public/deployed product claim | **88** | UI/public metadata says the registry contains 88 skills |
| Initial migration seed | **64** | Original migration inserts 64 definitions across 10 categories |
| Migration-confirmed definitions | **65** | Later migration adds `sys-006` / `Skill-Registry-Manifest` |
| Explicit runtime adapters | **10** | Source has executable adapters for `core-001` through `core-010` |

Therefore:

`88 claimed - 65 migration-confirmed = 23 unresolved live-database records`

Those 23 records are **not considered identified** until an authoritative export of the current `public.skills` table is obtained.

## Category census

| Category | Seed | Migration-confirmed |
|---|---:|---:|
| Core Intelligence | 10 | 10 |
| Vision & Media | 8 | 8 |
| Audio & Speech | 4 | 4 |
| Web & Data | 7 | 7 |
| Code & Engineering | 8 | 8 |
| UX & Design | 5 | 5 |
| Strategy & Governance | 5 | 5 |
| Autonomous Control | 4 | 4 |
| System Runtime | 5 | 6 |
| Optional High-Value | 8 | 8 |
| **Total** | **64** | **65** |

## Runtime-binding truth

The explicit adapter map binds exactly:

`core-001` → `core-010`

This is intentionally tracked separately from registry definitions.

```text
DATABASE DEFINITION EXISTS
        ≠
RUNTIME ADAPTER EXISTS
        ≠
RUNTIME EXECUTION IS HEALTHY
```

R1 preserves that distinction rather than promoting all database rows as executable skills.

## Preliminary native reconciliation

The current Git-backed native registry contains 17 canonical packages. Source-level reconciliation already finds:

- `core-001` / `LLM` — same stable ID and same capability name; preliminary exact match.
- `ux-001` — **ID collision**: v7 `UI-Design` vs native `Screenshot to Blueprint`.
- `ux-002` — **ID collision**: v7 `UX-Research` vs native `Frontend Fidelity Reconstruction`.

The UX collisions must be resolved explicitly before parity/cutover. Neither side may silently overwrite the other.

Run:

```bash
npm run census:v7
```

for the source/native preview.

## Authoritative live export contract

R1 next requires a read-only current export of `public.skills`. Accepted input to the reconciliation command is either:

```json
[
  { "id": "core-001", "name": "LLM", "category_id": "core" }
]
```

or:

```json
{
  "skills": [
    { "id": "core-001", "name": "LLM", "category_id": "core" }
  ]
}
```

Full DB rows are preferred because later parity stages must compare routing, policy, contracts, tool definitions, and timestamps as well as identity.

Then run:

```bash
npm run reconcile:v7 -- path/to/live-v7-export.json
```

The reconciliation reports:

- exact native matches
- native ID collisions
- name matches under different IDs
- source-only definitions
- native-only definitions
- live-only rows
- migration-confirmed rows missing from live
- duplicate live IDs
- public 88-count contract mismatch
- shadow-mode blockers

It performs **zero native promotions**.

## RLS/security source history

The original April schema migration created public write/update/delete policies for `categories` and `skills`. A later May migration explicitly drops those write policies and replaces them with **authenticated admin-only** insert/update/delete policies while retaining public read access.

So the committed migration history shows a source-level remediation. R1 still requires current live-policy verification during the authoritative DB pass because source migrations alone do not prove the deployed database's present RLS state.

## R1 gates

### Gate R1-A — Source census ✅

- source repository pinned
- 10 categories enumerated
- 65 migration-confirmed definitions enumerated
- 10 explicit runtime bindings enumerated
- public 88-skill contract recorded
- unresolved delta explicitly recorded as 23
- zero promotions

### Gate R1-B — Live DB census ⛔ pending

Required:

- authoritative `public.skills` export
- authoritative category counts
- duplicate ID/name check
- live RLS/policy verification
- identify the 23 unresolved records or revise the public 88 claim

### Gate R1-C — Identity/parity reconciliation ⏳ partial

Already known:

- one preliminary exact stable-ID/name match (`core-001`)
- two native ID collisions (`ux-001`, `ux-002`)

Complete only after live export.

### Gate R1-D — Shadow mode ⛔ not started

Blocked until R1-B and R1-C close.

### Gate R1-E — `db → hybrid` ⛔ not started

No storage-authority change until shadow evidence passes.

## Invariants

1. Census is not promotion.
2. v7 IDs are preserved as evidence even when they collide.
3. A database row is not assumed executable.
4. The current native `skills/` tree remains canonical for existing native packages.
5. Sophie-X/Skill Hub runtime behavior is unchanged during census.
6. OpenClaw external inventory is not included in v7 parity authority; it remains a separate qualification source.
7. No `db → hybrid` cutover occurs while the 23-record live delta or ID collisions remain unresolved.
