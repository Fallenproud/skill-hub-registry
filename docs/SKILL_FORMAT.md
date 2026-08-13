# Native Skill Package Format

A native package is the smallest portable unit that can be discovered, inspected, versioned, and optionally bound to execution.

## Required files

```text
skills/<category>/<slug>/
├─ SKILL.md
└─ skill.json
```

`SKILL.md` is the cognition layer. `skill.json` is the deterministic contract layer.

## Required manifest concepts

- stable `id`
- human-readable `slug`
- semantic `version`
- `category`
- concise `description`
- lifecycle `status`
- routing trigger/boundary
- explicit input/output contracts
- execution kind + binding
- policy flags
- consumer compatibility

## Recommended manifest concepts

- maturity `L0..L5`
- capability type
- provenance class/source references
- domain/project scope
- skill/tool/external dependencies

## Status is not maturity

`status` answers whether the package is draft/defined/validated/registered/executable/etc.

`maturity` answers how much evidence exists behind the capability.

A skill can be `validated` structurally while remaining only L2 until real specimen tests exist.

## Execution kinds

### `instructional`

The runtime loads the skill methodology into an agent/model but the package does not point to a dedicated executable adapter.

### `adapter`

The package has an explicit, verified runtime binding. `binding` is mandatory.

### `none`

Definition/specification exists but the runtime should not treat it as invokable cognition.

## Progressive disclosure

The compiled index intentionally contains lightweight routing metadata and content hashes—not full SKILL.md bodies. Consumers discover candidates first, then hydrate a selected package.

## Project-specific knowledge

Project-specific data belongs under `profiles/` or `specimens/`, not in domain-neutral native skill behavior. A domain-specific skill is allowed when the scope is intentional and declared.
