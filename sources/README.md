# Provenance Sources

This directory stores the evidence ledger used by the Skill Foundry. A source is not automatically a canonical skill. Sources may be project-specific, incomplete, superseded, or unsafe; they are retained so later canonicalization remains attributable.

## Rules

1. Record provenance before rewriting or generalizing source material.
2. Keep project-specific identity in `profiles/` or `specimens/` unless the reusable transformation can be isolated cleanly.
3. Never promote a candidate only because a prompt or UI exists.
4. Preserve safety/legal caveats from the source.
5. Canonical skills require their own contracts, tests, and maturity evidence.

`MASTER_SKILL_LEDGER.md` is the diffable repository projection of the preserved July 14, 2026 archaeology ledger. The original spreadsheet is retained as provenance outside the Git working tree. `source-register.json` is the machine-readable source index used by this repository.
