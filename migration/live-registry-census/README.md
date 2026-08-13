# Live Registry Census

The deployed Skill Hub must be exported before claiming migration parity.

The historical ledger reports 117 registered skills/macro workflows in an older runtime context, while the current deployed UI has separately advertised a different count. Neither number is treated as canonical here.

Required census fields:

- stable skill ID
- name/slug
- category
- status/enabled state
- routing trigger/boundary
- invoke/block conditions
- input/output contracts
- priority/cost/latency
- freshness/auth/state/logging flags
- fallback chain
- runtime adapter binding
- last update/version evidence

The export is compared against compiled file packages before any `files` cutover.
