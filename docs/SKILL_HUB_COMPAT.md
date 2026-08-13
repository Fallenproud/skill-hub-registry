# Skill Hub / Sophie-X Compatibility Contract

The initial storage migration is intentionally hidden behind the existing Skill Hub API boundary.

## Preserve during migration

- existing skill IDs
- existing authentication/HMAC behavior
- existing callbacks
- existing list/invoke response compatibility
- existing adapter bindings
- existing invocation/state semantics

## External inventories

External ecosystem catalogs do not change this API contract.

The imported OpenClaw inventory is discovery/qualification data only. Sophie-X and Skill Hub do not automatically receive 65 new skills, tools, or adapters from the import.

If a qualified OpenClaw capability is later adopted, it must enter through one of the existing architecture boundaries:

- a native `skills/` package promoted through the Foundry;
- a versioned runtime/tool adapter;
- a reference-only source with no runtime dependency.

See `runtime-contracts/openclaw-compatibility.md`.

## Later additive capabilities

A richer consumer may eventually support:

```text
skill.discover
skill.inspect
skill.load
skill.invoke
skill.version
skill.capabilities
```

A versioned invocation should record a reference similar to:

```text
skill id
semantic version
registry hash / content hash
```

This makes executions reproducible without forcing Sophie-X to know whether the canonical definition was stored in SQL or Git.
