# Contributing

## Before adding a native skill

1. Search `inventory/` and `candidates/` for duplicates.
2. Record provenance/source evidence.
3. Isolate project-specific content into a profile/specimen.
4. Define invocation and non-invocation boundaries.
5. Define inputs, process, outputs, constraints, quality gates, failure behavior, dependencies, and execution context.
6. Add runtime binding only when verified.
7. Run `npm run check`.

## Candidate vs native skill

Use `candidates/` when the capability is worth preserving but not yet structured enough for runtime discovery.

Use `skills/` only when the package validates and its behavior is sufficiently bounded.

## Pull request expectation

A PR should state:

- source/provenance
- duplicate/merge decision
- maturity before/after
- runtime impact
- compatibility impact
- evidence/tests
