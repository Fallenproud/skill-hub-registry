# OpenClaw Source Preservation

This directory preserves the prior OpenClaw inventory source material used for the external ecosystem import.

- `openclaw_ecosystem_catalog.csv.gz` — gzip-compressed **exact bytes** of the original 65-project CSV catalog.
- `openclaw_ecosystem_schema.csv` — original 21-field schema CSV.

Original uncompressed catalog SHA-256:

`9dd8245275351bbc33a0095f33b03904e2fb0a64e876a286842c821254760b7e`

Schema SHA-256:

`128c53e684471bdec8ba2946be82133a1d0b724a49884752d91d567123ccd221`

The gzip wrapper is repository transport only. `npm run import:openclaw` decompresses the catalog and deterministically rebuilds the normalized external inventory shards.
