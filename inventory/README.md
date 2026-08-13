# Skill Archaeology & External Inventory

The inventory layer separates **discovery/evidence** from **native promotion/execution**.

## Internal archaeology

- `historical-candidates.json` preserves the 35-entry July 14 archaeology ledger.
- `post-july-delta.json` records 28 reusable capabilities discovered after that ledger through August 13, 2026.
- `duplicate-decisions.json` records explicit merge/deduplication decisions.

Internal candidates can remain L0/L1 without appearing in the compiled runtime registry. Promotion into `skills/` happens only after provenance, boundaries, contracts, policy, dependencies, and maturity evidence are sufficient.

## External ecosystems

External inventories live under `inventory/external/<ecosystem>/` and remain outside compiler scope.

Current external inventory:

- `external/openclaw/` — 65 OpenClaw ecosystem projects imported from the preserved prior catalog.

External records are discovery/qualification inputs, **not skill packages**. They cannot create an executable binding or alter the native registry without an explicit Foundry promotion or compatibility-adapter decision.
