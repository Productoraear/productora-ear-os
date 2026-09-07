---
description: "EAR OS V2 Zero-Token Memory & RAG Protocol"
---

# RAG & Data Handling (rag-data.md)

1. **Zero-Token Memory (ZTM)**: Adhere strictly to the ZTM protocol to conserve API context.
2. **Reuse & RAG First**: Before writing scripts, consult `scripts/registry.json` and `src/data/ear-rag-database.json`.
3. **Headless Artifact Buffer**: Massive files from drives (C:, D:, E:, etc.) MUST NEVER be read directly into the context window. They must be processed via local scripts in `/scripts/` outputting condensed JSON (< 300 tokens).
4. **Omni-Drive Vaulting**: Any raw file processed must be moved to `H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\{Category}\` while registering its SHA-256 hash in `scripts/.archived_manifest.json`.
