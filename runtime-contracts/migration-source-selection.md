# Registry Source Selection

Supported migration modes:

- `db` — existing Skill Hub database remains authoritative.
- `hybrid` — file registry is read/compared first while database remains rollback/fallback authority.
- `files` — Git-backed packages are authoritative; database receives operational projection.

Cutover requires parity evidence. No consumer should infer storage source from the public API response shape.
