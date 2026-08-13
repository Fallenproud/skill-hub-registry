# OpenClaw Inventory Import

## Scope

The repository imports the previously curated OpenClaw ecosystem inventory as an **external reference dataset** while preserving the existing Skill Hub Registry architecture.

Source material:

- Original catalog SHA-256: `9dd8245275351bbc33a0095f33b03904e2fb0a64e876a286842c821254760b7e`
- `sources/openclaw/openclaw_ecosystem_schema.csv` (exact 21-field schema)

Normalized output:

- `inventory/external/openclaw/index/*.json` (13 lightweight normalized discovery-index parts)
- `inventory/external/openclaw/schema.json`
- `inventory/external/openclaw/summary.json`

Repeatable import:

```bash
npm run import:openclaw
```

The importer validates the committed external projection, repository boundaries, scores/tiers, schema coverage, review state, source hashes, and zero-native-promotion invariant, then deterministically normalizes the JSON index/summary.

## Imported inventory

The catalog contains **65 OpenClaw projects** across six source categories:

| Category | Count |
|---|---:|
| Agent Infrastructure & SDKs | 10 |
| Agents & Services | 7 |
| Local-First Crawlers | 11 |
| Native Tools | 9 |
| TypeScript Libraries | 7 |
| Everything else | 21 |

Original evaluation tiers are preserved:

| Tier | Count |
|---|---:|
| P0 — immediate evaluation | 14 |
| P1 — high-value prototype | 15 |
| P2 — selective/reference | 19 |
| P3 — low priority/current mismatch | 17 |

The 14 source-scored P0 records are: Crabbox, Crabfleet, Lobster, gitcrawl, crawlkit, acpx, mcporter, clawbench, ClawScan, agent-skills, fs-safe, Kova, openclaw-windows-node, and releases.

Those rankings remain **tentative historical evaluation data**. They are not current security, licensing, compatibility, or adoption verdicts.

## Non-promotion guarantee

Importing this catalog performs **zero native promotions**.

The native compiler continues to scan only `skills/`. OpenClaw IDs remain `OC-*` inventory IDs and cannot become executable simply because the external record exists.

`agent-skills` (`OC-026`) is especially important: its presence does not authorize wholesale copying of an external skill registry. Individual skills must be reviewed through the compatibility and Foundry path with provenance, version, permissions, dependencies, licensing, and execution behavior preserved.

## Qualification sequence

The canonical path for any OpenClaw project is:

1. **Discovery** — preserve source identity and repository reference.
2. **Static qualification** — inspect manifest/source/license/dependencies/security surface.
3. **Sandbox qualification** — build/run only in an isolated, bounded environment when appropriate.
4. **Compatibility testing** — verify interfaces against a versioned compatibility contract.
5. **Evidence capture** — retain test/build/security/runtime evidence.
6. **Governed activation** — explicitly approve adapter/reference/native treatment.

Possible outcomes are `ADOPT`, `ADAPTER`, `REFERENCE`, `DEFER`, or `REJECT`. None is inferred from the imported score alone.

## Runtime impact

This import does not change Sophie-X or Skill Hub invocation behavior. It adds an external discovery/evaluation dataset only.

See `runtime-contracts/openclaw-compatibility.md` for the execution boundary.
