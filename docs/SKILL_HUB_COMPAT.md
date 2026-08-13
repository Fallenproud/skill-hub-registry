# Skill Hub / Sophie-X Compatibility Contract

The initial storage migration is intentionally hidden behind the existing Skill Hub API boundary.

## Preserve during migration

- existing skill IDs
- existing authentication/HMAC behavior
- existing callbacks
- existing list/invoke response compatibility
- existing adapter bindings
- existing invocation/state semantics

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
