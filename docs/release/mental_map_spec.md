# 🧠 MENTAL MAP SPECIFICATION — EAR OS V2
> **Root Canónico:** `C:\EAR_OS_V2`  
> **Rol:** Especificación del Mapa Mental Ejecutivo Derivado de 5 Anillos

---

## 1. REGLA INMUTABLE DE GENERACIÓN
El Mapa Mental Ejecutivo **no inventa relaciones**. Se genera dinámicamente mediante proyección desde el Grafo de Conocimiento Estructural (`EAR_OS_KNOWLEDGE_GRAPH.md`). Si existe discrepancia entre el mapa mental y el grafo, **el Grafo prevalece siempre**.

---

## 2. ESTRUCTURA CONCÉNTRICA EN 5 ANILLOS

```
                 ┌────────────────────────────────────────────────┐
                 │        ANILLO 5: QUARANTINE / LEGACY           │
                 │ ┌────────────────────────────────────────────┐ │
                 │ │     ANILLO 4: DISCOVERY & INGESTION        │ │
                 │ │ ┌────────────────────────────────────────┐ │ │
                 │ │ │      ANILLO 3: RELEASE GOVERNANCE      │ │ │
                 │ │ │ ┌────────────────────────────────────┐ │ │ │
                 │ │ │ │   ANILLO 2: ARCHIVIST CONTROL      │ │ │ │
                 │ │ │ │ ┌────────────────────────────────┐ │ │ │ │
                 │ │ │ │ │     ANILLO 1: CORE RUNTIME     │ │ │ │ │
                 │ │ │ │ │ ┌────────────────────────────┐ │ │ │ │ │
                 │ │ │ │ │ │      CENTRO GRAVITACIONAL │ │ │ │ │ │ │
                 │ │ │ │ │ │        C:\EAR_OS_V2       │ │ │ │ │ │ │
                 │ │ │ │ │ └────────────────────────────┘ │ │ │ │ │
                 │ │ │ │ └────────────────────────────────┘ │ │ │ │
                 │ │ │ └────────────────────────────────────┘ │ │ │
                 │ │ └────────────────────────────────────────┘ │ │
                 │ └────────────────────────────────────────────┘ │
                 └────────────────────────────────────────────────┘
```

### Detalle de los 5 Anillos

1. **Centro Gravitacional:** `C:\EAR_OS_V2` (Absoluto).
2. **Anillo 1 (Core Runtime):** Next.js 16 App, Middleware Edge (`src/middleware.ts`), Auth Sync Server (`/api/nexus/user/sync`), Firebase Admin SDK.
3. **Anillo 2 (Archivist Control Plane):** Pipeline Archivist (`00_bootstrap_archivist_package.ps1`, `_archivist_common.ps1`), Observabilidad (`live_status_dashboard_v3.ps1`).
4. **Anillo 3 (Release Governance):** Queue de ejecución MVP (`MVP_EXECUTION_QUEUE.md`), Dossier de estado (`MVP_RELEASE_DOSSIER.md`), Gates de build y despliegue.
5. **Anillo 4 (Discovery & Ingestion):** Escáner full-PC (`01_master_inventory.ps1`), Node Scoring Engine (`08_gravitational_score_engine.ps1`), Minería de oro (`extract_gold_from_texts.ps1`).
6. **Anillo 5 (Quarantine / Legacy / Orphan):** Depósitos de preservación (`ALMACEN_DE_CUARENTENA_6M`, `99_CUARENTENA_COGNITIVA`), scripts sustituidos (`Dominancia_v2_LEGACY.ps1`).
