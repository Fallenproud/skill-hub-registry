# Skill Hub v7 → Git-backed Registry Migration

## Goal

Move canonical skill definitions from database-only records to versioned packages without interrupting the existing Skill Hub/Sophie-X execution path.

## Phase 0 — Census

Export the live current registry and adapter binding inventory. Do not trust historical UI counts as migration truth.

## Phase 1 — Import

Generate packages conservatively:

- preserve stable IDs
- preserve routing/contracts
- mark executable only when a verified adapter binding exists
- record migration provenance

## Phase 2 — Parity

Compare:

- IDs/slugs/categories
- status/enabled semantics
- trigger/boundary
- invoke/block conditions
- input/output contracts
- policy flags
- fallback chains
- runtime bindings

## Phase 3 — Shadow

Resolve production requests through the existing DB path while computing file-backed routing decisions for comparison.

## Phase 4 — Hybrid

Enable file-first resolution with DB fallback. Log mismatches and fallback causes.

## Phase 5 — File authority

Switch canonical definition source to files only after parity/routing gates pass. Supabase remains operational projection/state store.

## Rollback

Return source selection to `db`. No destructive database migration is required for rollback.
