# Security

Skill packages can influence agents and may eventually bind executable runtime adapters. Treat package changes as code/configuration changes, not harmless documentation edits.

## Security principles

- fail closed on invalid manifests or unresolved required dependencies
- explicit execution bindings only
- least-privilege runtime permissions
- human approval for policy-marked sensitive actions
- attributable audit events for sensitive execution
- preserve provenance for imported skills
- review executable scripts and third-party dependencies before promotion
- keep candidate/source material outside runtime compiler scope

Do not commit secrets, live access tokens, private keys, or production credentials to this repository.
