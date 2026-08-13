# Architecture

## Planes

### 1. Definition plane

Git-backed native skill packages, provenance, schemas, tests, examples, profiles, and runtime contracts.

### 2. Inventory / qualification plane

Internal archaeology candidates and external ecosystem catalogs are preserved outside native compiler scope. This plane records evidence, provenance, duplicate decisions, maturity, compatibility hypotheses, and qualification state.

### 3. Compilation plane

Deterministic validation, dependency resolution, content hashing, and the generated native registry index.

### 4. Operational plane

Skill Hub runtime, Supabase operational projection, permission state, invocations, telemetry, analytics, memory, callbacks, and runtime health.

### 5. Consumer plane

Sophie-X, agent runtimes, MCP/HTTP adapters, future CLIs, and external registries.

## Source-of-truth rule

Git defines canonical native skill content. Operational databases describe current execution state.

External inventories are sources/qualification inputs, not canonical skill definitions.

## Runtime truth rule

`definition exists` does not imply `runtime executes`.

`external inventory record exists` also does not imply `installed`, `trusted`, `compatible`, or `executable`.

Execution requires an explicit binding and runtime evidence.

## Candidate isolation

`inventory/` and `candidates/` remain outside the native compiler by design. Archaeology can preserve incomplete, tentative, project-specific, or unsafe source material without exposing it to consumers.

## External ecosystem isolation

External ecosystems are imported under `inventory/external/<ecosystem>/`. Their source material stays under `sources/` and their runtime interoperability rules stay under `runtime-contracts/`.

For OpenClaw specifically:

- 65 projects are preserved as external reference records;
- no `OC-*` record is a native Skill Hub skill;
- no import creates an executable adapter;
- qualification must precede adoption, adapter binding, or Foundry promotion.

## Profile isolation

Project-specific product identity, visual doctrine, naming, and domain configuration remain outside generic native skills.

## Determinism

The generated native registry is sorted and content-addressed. Volatile timestamps are excluded from canonical output.

External normalized inventories are also deterministically regenerated from preserved source files so CI can detect drift without changing the native registry hash.
