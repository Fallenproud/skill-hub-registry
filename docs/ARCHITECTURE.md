# Architecture

## Planes

### 1. Definition plane

Git-backed packages, provenance, schemas, tests, examples, profiles, runtime contracts.

### 2. Compilation plane

Deterministic validation, dependency resolution, content hashing, generated registry index.

### 3. Operational plane

Skill Hub runtime, Supabase operational projection, permission state, invocations, telemetry, analytics, memory, callbacks.

### 4. Consumer plane

Sophie-X, agent runtimes, MCP/HTTP adapters, future CLIs and external registries.

## Source-of-truth rule

Git defines canonical skill content. Operational databases describe current execution state.

## Runtime truth rule

`definition exists` does not imply `runtime executes`.

Execution requires an explicit binding and runtime evidence.

## Candidate isolation

`inventory/` is outside compiler scope by design. Archaeology can preserve incomplete or unsafe source material without exposing it to consumers.

## Profile isolation

Project-specific product identity, visual doctrine, and domain configuration remain outside generic native skills.

## Determinism

The generated registry is sorted and content-addressed. Volatile timestamps are excluded from canonical output.
