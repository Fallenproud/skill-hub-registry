# Registry Contract

## Invariants

- Skill ID is stable across storage migrations.
- Human-readable slug may evolve only through explicit migration metadata.
- Every package declares version, status, routing boundary, execution kind, contracts, policy, compatibility, and provenance.
- `defined` does not imply `executable`.
- Runtime binding is explicit.
- Project-specific profiles cannot masquerade as domain-neutral skills.
- Generated indexes are deterministic and content-addressed.
- Invocation records should capture skill ID, semantic version, and registry revision/content hash.
