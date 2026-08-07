# 📜 SCRIPTS MATRIX — EAR OS V2
> **SSOT audit:** 2026-08-06  
> **Mapeo de Motores:** Scripts Existentes vs. Nuevos Scripts Mínimos Exigidos.

---

## 1. SCRIPTS EXISTENTES Y SU ROL EN EL CENTRO GRAVITACIONAL

| Script Actual | Ruta | Rol Gravitacional | Estado |
|---|---|---|---|
| `Dominancia_EAR_v3_DOMINANCIA_OK.ps1` | `c:\EAR_OS_V2\` | Orquestador principal e ignición del centro gravitacional. | `core` |
| `00_bootstrap_archivist_package.ps1` | `EAR_OS_CONTROL/scripts/` | Inicialización de directorios del plano de control y políticas base. | `core` |
| `01_master_inventory.ps1` | `EAR_OS_CONTROL/scripts/` | Escáner masivo de unidades del PC (`C:`, `D:`, `E:`, `H:`, `L:`). | `core` |
| `02_links_map.ps1` | `EAR_OS_CONTROL/scripts/` | Mapeo de accesos directos, links simbólicos y reparse points. | `core` |
| `03_hash_stage1.ps1` | `EAR_OS_CONTROL/scripts/` | Hashing SHA256 preliminar por bloques rápidos. | `core` |
| `05_duplicates_canonical.ps1` | `EAR_OS_CONTROL/scripts/` | Agrupación e identificación de duplicados binarios/texto. | `core` |
| `fixity_baseline.ps1` / `fixity_audit.ps1` | `EAR_OS_CONTROL/scripts/` | Generación y auditoría de firmas de integridad contra deriva. | `core` |
| `purge_digital_junk.ps1` | `EAR_OS_CONTROL/scripts/` | Aisle seguro de residuos digitales hacia `ALMACEN_DE_CUARENTENA_6M`. | `core` |
| `extract_gold_from_texts.ps1` | `EAR_OS_CONTROL/scripts/` | Minería semántica de conversaciones y documentos de texto. | `core` |
| `live_status_dashboard_v3.ps1` | `EAR_OS_CONTROL/scripts/` | Renderizado del Dashboard de observabilidad en vivo. | `core` |

---

## 2. SCRIPTS NUEVOS MÍNIMOS ESTRICTAMENTE NECESARIOS

| Script Nuevo | Ubicación | Propósito Mínimo Exigido | Estado |
|---|---|---|---|
| `08_gravitational_score_engine.ps1` | `EAR_OS_CONTROL/scripts/` | Evalúa los nodos censados por `01_master_inventory.ps1` ejecutando el algoritmo `EAR_OS_SCORE`. Genera `gravitational_scores.csv`. | `core` |
| `09_gravitational_absorber.ps1` | `EAR_OS_CONTROL/scripts/` | Lee nodos con `Score >= 80` y los copia a `C:\EAR_OS_V2\staging\absorbed\`, registrando el manifiesto de absorción. | `core` |
| `10_generate_gravitational_graph.ps1` | `EAR_OS_CONTROL/scripts/` | Regenera los artefactos de Grafo (`EAR_OS_KNOWLEDGE_GRAPH.md`) y Mapa Mental (`EAR_OS_EXECUTIVE_MINDMAP.md`) automáticamente. | `core` |
