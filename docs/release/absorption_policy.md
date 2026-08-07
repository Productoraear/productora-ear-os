# 📥 ABSORPTION POLICY — EAR OS V2
> **SSOT audit:** 2026-08-06  
> **Directiva:** Cuándo algo se absorbe, cuándo se enlaza y cómo se garantiza la no-destrucción.

---

## 1. CRITERIO DE ABSORCIÓN VS. ENLACE (LINKING)

| Condición | Acción | Destino / Tratamiento |
|---|---|---|
| **Score >= 80** & Sin conflicto de hash | `ABSORB` | Copia atómica a `C:\EAR_OS_V2\staging\absorbed\<timestamp>\`. |
| **Score >= 80** & Hash idéntico ya en `C:\EAR_OS_V2` | `LINK` / `TAG` | Se marca como `DUPLICATE_EXTERNAL` sin duplicar almacenamiento. |
| **Score 40 - 79** | `LINK` / `STAGE` | Se registra en el Grafo de Conocimiento y en `data_vault/audits/`. |
| **Archivo en desuso / Corrupto / Riesgoso** | `QUARANTINE` | Movimiento aditivo a `ALMACEN_DE_CUARENTENA_6M`. |

---

## 2. POLÍTICA RIGUROSA DE NO DESTRUCCIÓN Y REVERSIBILIDAD

1. **Operaciones Estrictamente Aditivas:**
   - Prohibido el uso de `Remove-Item` o `delete` sobre archivos del PC durante la fase de absorción.
   - El proceso de absorción realiza una **copia segura con preservación de metadatos (timestamps y permisos)** hacia `C:\EAR_OS_V2\staging`.

2. **Registro de Manifiesto de Absorción:**
   - Cada absorción registra una línea en `EAR_OS_CONTROL/manifiestos/absorption_manifest.csv` conteniendo:
     - `Timestamp`: Fecha ISO 8601 UTC.
     - `OriginalPath`: Ruta fuente en el PC.
     - `AbsorbedPath`: Ruta destino dentro del root canónico.
     - `SHA256`: Hash de verificación pre y post copia.
     - `Score`: Puntuación asignada por el Node Scoring Engine.
     - `Status`: `ABSORBED_OK` o `ROLLBACK_COMPLETED`.

3. **Mecanismo de Rollback 1-Click:**
   - Ante cualquier colisión o instrucción explícita del operador, el script de reversión `EAR_OS_CONTROL/scripts/undo_last_absorption.ps1` lee el último manifiesto y deshace las copias/movimientos de forma limpia.
