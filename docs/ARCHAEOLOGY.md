# Archaeology & Canonicalization

The repository intentionally stores more discovered capabilities than it exposes as native skills.

The July 14 master ledger identified 35 candidates. The August 13 reconciliation added a post-ledger delta containing additional audit, recovery, deployment, browser, memory, registry, and runtime capabilities. The machine-readable inventories are under `inventory/`.

## Separation rule

Project-specific implementations remain evidence/specimens/profiles. A canonical skill is domain-neutral unless its domain scope is intentional and declared.

## Promotion rule

Presence in `inventory/` means **preserved**. Presence in `skills/` means **structured enough to load through the registry**, but the manifest `status` and `maturity` still determine whether it is merely defined, validated, registered, or executable.
