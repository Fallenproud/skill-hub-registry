# R1 — Skill Hub v7 Census & Parity

Status: **R1-A/B/C complete; R1-D shadow mode active with a first full-definition parity pass. DB remains primary.**

R1 migrates the deployed Skill Hub definition layer without downtime or accidental authority changes. Census and shadow artifacts are evidence; they do not promote skills or change runtime serving authority.

## Source and live authority

| Surface | Value |
|---|---|
| Skill Hub repository | `Fallenproud/skill-hub-builder` |
| Deployed surface | `https://my-agenthub.lovable.app` |
| Operational store | Supabase `public.skills` |
| Historical source census | `inventory/v7/source-census.json` |
| Authoritative live definition export | `inventory/v7/live-export.json` |
| Live census/control evidence | `inventory/v7/live-census.json` |
| First R1-D shadow evidence | `inventory/v7/shadow-evidence.json` |

## Reconciled count truth

| Truth | Count |
|---|---:|
| Historical static product claim | **88** |
| Authoritative live registry | **65** |
| Migration-confirmed definitions | **65** |
| Explicit runtime adapters | **10** |
| Native file-backed packages | **17** |

The former inferred `88 - 65 = 23` delta is closed. The live database contains exactly 65 skills; the 88 value was stale static product metadata and has been corrected in current Skill Hub copy.

## Live database census

Current `public.skills` truth:

- 65 rows
- 65 distinct IDs
- 65 distinct names
- 10 categories
- 0 duplicate IDs or names
- 0 live-only rows versus source
- 0 source-confirmed rows missing live

Live/source identity parity is therefore **65/65 exact**.

Current deployed security state remains:

- RLS enabled for `skills` and `categories`
- public reads allowed
- writes restricted to authenticated admins

## R1-C native identity resolution

The two former stable-ID collisions were resolved without changing deployed v7 identities:

| Deployed identity preserved | Native package rekeyed |
|---|---|
| `ux-001` → `UI-Design` | `Screenshot to Blueprint`: `ux-001` → **`ux-007`** |
| `ux-002` → `UX-Research` | `Frontend Fidelity Reconstruction`: `ux-002` → **`ux-008`** |

`core-001 / LLM` remains the exact native stable-ID/name match.

Result: **0 native ID collisions**. No native promotion occurred.

## R1-D shadow mode

Shadow mode is implemented in Skill Hub with these invariants:

```text
Supabase DB = PRIMARY / serving authority
Git v7 export = SHADOW / observation only
```

The shadow comparator checks all 20 deployed definition fields:

`id`, `name`, `category_id`, `description`, `trigger_condition`, `boundary`, `priority`, `cost_class`, `latency_class`, `requires_auth`, `requires_freshness`, `safe_for_parallel`, `stateful`, `logs_required`, `inputs`, `outputs`, `fallback_chain`, `invoke_conditions`, `block_conditions`, `tool_definition`.

Array order is significant; object key ordering is canonicalized. Shadow fetch/audit failures fail open to DB serving.

The first full-definition verification pass produced:

```text
DB skills             65
File skills           65
Fields compared       20 / 20
Missing in file        0
Missing in DB          0
Field mismatches       0
Native ID collisions   0
```

The same verification workflow also passed the production build and lint on the R1-D changed surface. See `inventory/v7/shadow-evidence.json`.

## Compatibility boundary

R1-D does **not** change:

- existing HMAC signing/timestamp freshness
- `ping`, `list-skills`, or `invoke` contracts
- current deployed skill IDs
- adapter selection/execution
- Sophie callback behavior
- DB-backed returned skill data

An additive HMAC-protected `registry-status` action exposes migration evidence without changing serving behavior.

## Gates

### R1-A — Source census ✅
Historical source, categories, 65 migration-confirmed definitions, 10 runtime bindings, and stale 88 claim preserved as evidence.

### R1-B — Live DB census ✅
Authoritative 65-row live census, category parity, duplicate checks, RLS verification, and corrected current product contract complete.

### R1-C — Identity/parity reconciliation ✅
Live/source identity parity exact; native `ux-001`/`ux-002` collisions resolved through `ux-007`/`ux-008` rekeys.

### R1-D — Shadow mode 🟢 active
First 65 × 20 full-definition pass is exact with DB still primary. Continue accumulating repeated clean evidence.

### R1-E — `db → hybrid` ⛔ not started
No cutover until the confidence window contains repeated clean shadow evidence and explicit approval.

### R1-F — `hybrid → files` ⛔ future
File definitions become serving authority only after hybrid evidence closes. Operational runtime state remains database-backed.

## Invariants

1. Census is not promotion.
2. Historical evidence is preserved rather than rewritten.
3. Stable deployed IDs are not silently repurposed.
4. A database definition is not automatically an executable runtime skill.
5. Native packages remain isolated under `skills/`.
6. OpenClaw inventory remains external to v7 migration authority.
7. R1-D is observational; DB remains the serving authority.
8. Sophie-X experiences no storage migration downtime.
