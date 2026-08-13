# OpenClaw Compatibility Boundary

OpenClaw is treated as an **external ecosystem**, not as a second canonical Skill Hub registry.

## Invariants

1. `inventory/external/openclaw/*` is reference/evaluation data only.
2. OpenClaw inventory IDs (`OC-*`) are not Skill Hub skill IDs.
3. A catalog record never creates an executable binding.
4. The native compiler continues to load only packages under `skills/`.
5. External projects require explicit provenance, version, license, security, dependency, and compatibility evidence before adoption.
6. External runtimes/tools are integrated through versioned adapters/contracts rather than product-identity merging.
7. Human approval is required where the target runtime/policy classifies install, credential, host, network, or irreversible actions as sensitive.
8. Rejection/defer decisions remain preserved as evidence instead of deleting the source record.

## Qualification contract

`discover → static qualify → sandbox qualify → compatibility test → evidence capture → approve treatment`

Allowed treatment results:

- `ADOPT` — approved reusable dependency/component under explicit ownership and version controls.
- `ADAPTER` — external capability remains external and is consumed through a bounded interface.
- `REFERENCE` — patterns/specification only; no runtime dependency.
- `DEFER` — promising but blocked by evidence, priority, platform, licensing, or compatibility.
- `REJECT` — unsuitable, unsafe, redundant, or incompatible for the target context.

## External skills

Repositories such as `openclaw/agent-skills` are discovery sources. An individual external skill may become a native package only after normal Skill Foundry promotion. The import must preserve original provenance and must not silently upgrade maturity or execution status.

## Compatibility metadata

The native `skill.json` field `compatibility.openclaw` describes export/consumer compatibility for **our native package**. It does not make OpenClaw authoritative over that package and does not imply that an OpenClaw project has been imported into the runtime.
