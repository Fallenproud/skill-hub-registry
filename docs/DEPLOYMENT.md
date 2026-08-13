# Repository & Documentation Deployment

## GitHub repository

`main` is the canonical published branch. Pull requests should pass registry validation before merge.

## GitHub Pages onboarding site

A static onboarding/registry demonstration lives under `site/`. The Pages workflow builds `_site/`, copies generated registry data and approved visual assets, then deploys the artifact.

Repository settings must use GitHub Actions as the Pages publishing source before the first Pages deployment can complete.

Expected public URL shape after Pages is enabled:

`https://<owner>.github.io/skill-hub-registry/`

A custom domain can be added later without changing the registry/runtime contract.
