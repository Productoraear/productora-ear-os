# 🚀 EXECUTION SEQUENCE — CENTRO GRAVITACIONAL EAR OS V2
> **SSOT audit:** 2026-08-06  
> **Secuencia de Ignición y Ejecución Automatizada**

---

## 1. PASOS DE LA SECUENCIA DE IMPLEMENTACIÓN

```
[1. Bootstrap Control Plane] ──> [2. Master Inventory Full-PC] ──> [3. Node Scoring Engine]
                                                                            │
[6. Dashboard V3 Render] <── [5. Auto-Update Graph & Mindmap] <── [4. Gravitational Absorber]
```

### Paso 1: Inicialización del Plano de Control
- **Comando:** `powershell -ExecutionPolicy Bypass -File C:\EAR_OS_V2\EAR_OS_CONTROL\scripts\00_bootstrap_archivist_package.ps1`
- **Efecto:** Verifica directorios en `EAR_OS_CONTROL` (`state`, `exports`, `logs`, `reports`, `staging`, `quarantine`, `manifiestos`).

### Paso 2: Escaneo de Inventario Full-PC
- **Comando:** `powershell -ExecutionPolicy Bypass -File C:\EAR_OS_V2\EAR_OS_CONTROL\scripts\01_master_inventory.ps1`
- **Efecto:** Genera censo completo en `EAR_OS_CONTROL\exports\master_inventory_<timestamp>.csv`.

### Paso 3: Evaluación por Node Scoring Engine
- **Comando:** `powershell -ExecutionPolicy Bypass -File C:\EAR_OS_V2\EAR_OS_CONTROL\scripts\08_gravitational_score_engine.ps1`
- **Efecto:** Calcula `EAR_OS_SCORE` para cada nodo y asigna clasificación (`EAR_OS_CORE`, `HIGH_CONFIDENCE_RELATED`, `RELATED`, `POSSIBLY_RELATED`, `NON_RELATED`, `QUARANTINED`).

### Paso 4: Absorción Controlada y Estadío
- **Comando:** `powershell -ExecutionPolicy Bypass -File C:\EAR_OS_V2\EAR_OS_CONTROL\scripts\09_gravitational_absorber.ps1`
- **Efecto:** Transfiere de forma aditiva los nodos con score >= 80 a `staging\absorbed\` y genera el manifiesto de absorción.

### Paso 5: Regeneración de Grafo y Mapa Mental
- **Comando:** `powershell -ExecutionPolicy Bypass -File C:\EAR_OS_V2\EAR_OS_CONTROL\scripts\10_generate_gravitational_graph.ps1`
- **Efecto:** Actualiza los artefactos `docs/release/EAR_OS_KNOWLEDGE_GRAPH.md` y `docs/release/EAR_OS_EXECUTIVE_MINDMAP.md`.

### Paso 6: Observabilidad en Vivo
- **Comando:** `powershell -ExecutionPolicy Bypass -File C:\EAR_OS_V2\EAR_OS_CONTROL\scripts\live_status_dashboard_v3.ps1`
- **Efecto:** Renderiza el dashboard interactivo de observabilidad en tiempo real.
