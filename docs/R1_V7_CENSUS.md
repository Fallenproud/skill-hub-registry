# R1 — Skill Hub v7 Census & Parity

Status: **source census complete; live DB census complete; identity parity blocked only by two native ID collisions**.

R1 inventories the legacy/deployed Skill Hub v7 before any storage-authority cutover. Census records are evidence only. They are not native promotions.

## Source pinned

| Field | Value |
|---|---|
| Repository | `Fallenproud/skill-hub-builder` |
| Branch | `main` |
| Historical source census commit | `aba0a27320a1b8e124f85c2b018d186600f3b203` |
| Static-count correction commit | `f944372350d228e1d230ca1b2ebdfc79f3dd1c40` |
| Deployed surface | `https://my-agenthub.lovable.app` |
| Operational store | Supabase |

Machine-readable evidence:

- `inventory/v7/source-census.json`
- `inventory/v7/live-export.json`
- `inventory/v7/live-census.json`

## Reconciled count truth

The historical source snapshot and the authoritative live database expose distinct truths that must remain separate:

| Truth | Count | Evidence meaning |
|---|---:|---|
| Historical static product claim | **88** | Pre-census UI/SEO/metadata claimed 88 skills |
| Authoritative current live registry | **65** | Current `public.skills` row count |
| Initial migration seed | **64** | Original migration inserts 64 definitions |
| Migration-confirmed definitions | **65** | Later migration adds `sys-006` |
| Explicit runtime adapters | **10** | `core-001` through `core-010` have explicit adapter bindings |

The earlier inferred `88 - 65 = 23` unresolved delta is now closed: **those 23 records do not exist in the live database**. The 88 value was stale static product metadata. Current Skill Hub static product copy has been corrected to 65 while database-derived counters remain dynamic.

## Authoritative live DB census

`public.skills` currently contains:

- 65 rows
- 65 distinct IDs
- 65 distinct names
- 0 duplicate IDs
- 0 duplicate names
- 0 live-only rows versus migration-confirmed source
- 0 migration-confirmed source rows missing live

### Category parity

| Category | Source confirmed | Live |
|---|---:|---:|
| Core Intelligence | 10 | 10 |
| Vision & Media | 8 | 8 |
| Audio & Speech | 4 | 4 |
| Web & Data | 7 | 7 |
| Code & Engineering | 8 | 8 |
| UX & Design | 5 | 5 |
| Strategy & Governance | 5 | 5 |
| Autonomous Control | 4 | 4 |
| System Runtime | 6 | 6 |
| Optional High-Value | 8 | 8 |
| **Total** | **65** | **65** |

Therefore **live/source identity parity is exact at 65/65**.

## Runtime-binding truth

The explicit adapter map still binds exactly `core-001` → `core-010`.

```text
DATABASE DEFINITION EXISTS
        ≠
RUNTIME ADAPTER EXISTS
        ≠
RUNTIME EXECUTION IS HEALTHY
```

R1 preserves this distinction. The remaining 55 database definitions are not automatically reclassified as executable merely because they exist in the registry.

## Native reconciliation

The current Git-backed native registry contains 17 canonical packages.

Known relationships:

- `core-001` / `LLM` — exact stable-ID/name match.
- `ux-001` — **ID collision**: v7 `UI-Design` vs native `Screenshot to Blueprint`.
- `ux-002` — **ID collision**: v7 `UX-Research` vs native `Frontend Fidelity Reconstruction`.

The two UX collisions are now the only R1 reconciliation blockers. Neither side may silently overwrite the other.

Run:

```bash
npm run census:v7
```

The census now evaluates the committed authoritative live export against the current 65-skill live contract while retaining the historical 88 claim as source evidence.

For another read-only export:

```bash
npm run reconcile:v7 -- path/to/live-v7-export.json
```

Reconciliation reports exact native matches, native ID collisions, source-only/native-only definitions, live-only/source-missing rows, duplicate IDs, current live-contract mismatch, and shadow-mode blockers. It performs zero native promotions.

## Live RLS/security verification

Current deployed database policy state was verified directly during R1-B:

- RLS is enabled on `public.skills`.
- RLS is enabled on `public.categories`.
- Public `SELECT` is allowed for both tables.
- `INSERT`, `UPDATE`, and `DELETE` require an authenticated user satisfying `has_role(auth.uid(), 'admin'::app_role)`.

This confirms that the later source-level security remediation is active in the deployed database; the original broad public-write policies are not the current live policy state.

## R1 gates

### Gate R1-A — Source census ✅

- source repository pinned
- 10 categories enumerated
- 65 migration-confirmed definitions enumerated
- 10 explicit runtime bindings enumerated
- historical 88-skill static contract preserved as evidence
- zero promotions

### Gate R1-B — Live DB census ✅

- authoritative `public.skills` export captured
- authoritative category counts captured
- 65 rows / 65 IDs / 65 names
- duplicate ID/name check clear
- live RLS/policy verification complete
- former 23-record delta resolved as stale metadata, not database rows
- current product contract corrected to 65

### Gate R1-C — Identity/parity reconciliation ⏳ blocked only by native ID collisions

- live ↔ source: exact 65/65 identity parity
- `core-001`: exact native stable-ID/name match
- `ux-001`: unresolved native ID collision
- `ux-002`: unresolved native ID collision

### Gate R1-D — Shadow mode ⛔ not started

Blocked only until `ux-001` and `ux-002` collision policy is resolved and the resulting registry validates.

### Gate R1-E — `db → hybrid` ⛔ not started

No storage-authority change until shadow evidence passes.

## Invariants

1. Census is not promotion.
2. Historical evidence is preserved rather than rewritten to look retrospectively correct.
3. v7 IDs remain evidence even when they collide with native IDs.
4. A database row is not assumed executable.
5. The current native `skills/` tree remains canonical for existing native packages.
6. Skill Hub runtime behavior is unchanged by census work.
7. OpenClaw external inventory remains outside v7 parity authority.
8. No `db → hybrid` cutover occurs while native ID collisions remain unresolved.
