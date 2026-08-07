<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\release\node_scoring_policy.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: FFA13D80F4787447D608E6B7B2E4DFE3027ECDAFDC9E08B8E5EAD466D687824D
  Freshness Score: 100/100
  Mode: HYBRID | Status: FRESH
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# 🎯 NODE SCORING POLICY & ALGORITHM — EAR OS V2
> **SSOT audit:** 2026-08-06  
> **Propósito:** Definición exacta del algoritmo cuantitativo para evaluar la pertenencia de cualquier archivo o carpeta del PC al ecosistema EAR OS.

---

## 1. FÓRMULA DEL ALGORITMO DE SCORING (`EAR_OS_SCORE`)

Para cada nodo $f$ descubierto en el sistema de archivos, el score se calcula como:

$$\text{Score}(f) = S_{\text{ruta}} + S_{\text{nombre}} + S_{\text{hash}} + S_{\text{contenido}} + S_{\text{vecindad}} - P_{\text{ruido}}$$

---

## 2. REGLAS Y TABLA DE PESOS

### A. Match por Ruta ($S_{\text{ruta}}$) - Máx. 35 pts
- Ruta contiene `\EAR_OS_V2\` o `\EAR_OS_CONTROL\`: `+35 pts`
- Ruta contiene `EAR_OS`, `EAROS`, `PRODUCTORA_EAR`, `VIMUME`: `+25 pts`
- Ruta en carpetas calientes (`Desktop`, `Downloads`, `Documents`): `+10 pts`

### B. Match por Nombre y Extensión ($S_{\text{nombre}}$) - Máx. 35 pts
- Nombre contiene términos clave (`dominancia`, `archivist`, `vampirization`, `nexus`, `edwin`, `mariachi`, `ignicion`): `+25 pts`
- Extensión de código o datos estructurados (`.ps1`, `.py`, `.ts`, `.tsx`, `.jsonl`, `.md`): `+10 pts`

### C. Match por Hash SHA256 ($S_{\text{hash}}$) - Máx. 30 pts
- Hash SHA256 idéntico a cualquier archivo del baseline canónico de `C:\EAR_OS_V2`: `+30 pts`

### D. Match por Contenido Semántico ($S_{\text{contenido}}$) - Máx. 20 pts
- Texto incluye palabras del vocabulario soberano (`Antigravity`, `Cline`, `Stripe`, `Firebase Admin`, `Vampirización`, `Edwin Agudelo`, `Musicoterapia`): `+20 pts`

### E. Match por Vecindad ($S_{\text{vecindad}}$) - Máx. 10 pts
- La carpeta contenedora aloja 2 o más archivos con score > 50: `+10 pts`

### F. Penalización por Ruido ($P_{\text{ruido}}$) - Sin Límite
- Ruta o nombre contiene `\Temp\`, `\node_modules\`, `.tmp`, `.bak`, `.log` no auditado, cachés: `-50 pts`

---

## 3. TABLA DE MATRIZ DE CLASIFICACIÓN DE NODOS

| Rango de Score | Estado asignado al Nodo | Acción autorizada en la Absorción |
|---|---|---|
| **`>= 80`** | `EAR_OS_CORE` / `HIGH_CONFIDENCE_RELATED` | `ABSORB` (Absorción hacia staging de `C:\EAR_OS_V2`) |
| **`60 - 79`** | `RELATED` | `STAGE` (Registrar enlace/catálogo en `data_vault`) |
| **`40 - 59`** | `POSSIBLY_RELATED` | `LINK` (Vincular en el Grafo de Conocimiento) |
| **`20 - 39`** | `ORPHAN` / `LEGACY` | `OBSERVE` (Anotar en reporte diario sin mover) |
| **`< 20`** | `NON_RELATED` / `QUARANTINED` | `QUARANTINE` (Aislar en caso de conflicto o descartar) |
