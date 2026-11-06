# COSECHA VAMPIRO NOCTURNO — PEPITAS DE ORO Y VENTAJAS INJUSTAS
> ts: 2026-11-04 · autor: agente ejecutor · estado: auditoría (SIN ejecución por shell inerte)

## 1 · El vampiro nocturno real (qué hay que activar)

`scripts/vampire_swarm_orchestrator.py` — orquestador de enjambre que lanza
**8 unidades en paralelo** (subprocess.Popen, logs a `scripts/reports/swarm/`,
telemetría a `vampire_swarm_master_telemetry.json`):

| # | Unidad | Script | Salida |
|---|---|---|---|
| 1 | HTML masivo proveedores (H: & I:) | vampirize_massive_html_vaults.py | src/data/bodas-vendors-harvested.json |
| 2 | Alumbrado navideño B2G | vampirize_christmas_lighting_b2g.py | src/data/admin/christmas_lighting_b2g.json |
| 3 | Catálogo Demetrio luces | vampirize_demetrio_full.py | src/data/demetrio_luces_navidad_2025.json |
| 4 | Bio Edwin + objeciones Dani Aragón | vampire_bio_and_objections_miner.py | src/data/edwin-true-bio-ssot_draft.json |
| 5 | Oráculo estratégico RAG | vampire_oracle_miner.py | (oráculo) |
| 6 | Cazador licitaciones B2G | b2g_tender_hunter.py --mock | (licitaciones PLACE/TED) |
| 7 | Barrido forense ZTM | full_pc_forensic_ear_sweeper.py | src/data/ear-rag-database.json |
| 8 | Celebrents proveedores | vampirize_celebrents.py --mock | src/data/celebrents_providers.json |

## 2 · Pepitas de oro (datos ya presentes, sin cosechar)

Fuente: `public/data/providers/manifest.json` + `reports/PROVIDER_ENRICHMENT_AUDIT.json`.

- **26.843 proveedores sin candidato Overture** (`no_candidate`) — el mayor filón:
  existen en el SSOT `src/data/all_providers_database.json` pero sin contacto real.
- **4.299 teléfonos retenidos por ambigüedad** (`withPhoneWithheld` en manifest `_meta`)
  — números reales no publicados por ser compartidos/multisede. Resolubles vía
  `crawl:providers` + `merge:webcrawl`.
- **787 contactos ambiguos retenidos** (`ambiguous_contact_withheld`).
- **Overture 2.57M POIs / 2.39M contactables** — solo se analizaron **23.307 filas**
  candidatas; el fuzzy (Jaro-Winkler) admite expansión por gremio.
- Cobertura actual: **6.179 / 12.987 publicables con teléfono (47,6%)**.

## 3 · Ventajas injustas

1. **Overture Maps** (CDLA-Permissive-2.0, gratis y legal) = escala de contacto real
   que la competencia no tiene.
2. **Motor anti-fraude** (`verify_provider_edge_truth.cjs`): 0 teléfonos compartidos,
   0 centralita, 0 tarificación premium, GPS dentro de España, rating solo con JSON-LD.
   Blindaje legal INV-06 / INV-12 / AF.
3. **Enjambre paralelo** con aislamiento de logs y telemetría unificada (sin colisión E/S).
4. **Provenance hash por registro** (JUR-6) = póliza anti-copia.

## 4 · Runbook de cosecha (lo que hay que ejecutar)

```powershell
# A. Enjambre vampírico (8 unidades en paralelo, hasta terminar):
python scripts/vampire_swarm_orchestrator.py

# B. Cosecha de contacto real de proveedores:
npm run crawl:providers     # crawlear webs descubiertas
npm run merge:webcrawl      # fusionar intel del crawl
npm run enrich:providers    # Overture (requiere DuckDB en ear_os_tools)
npm run publish:webcrawl    # merge + chunks + edge + verify

# C. Blindaje (criterio de éxito):
npm run verify:providers    # Exit 0 = 0 fachadas
```

## 5 · Bloqueadores detectados

1. **Shell del agente INERTE** (exit=1, 0 stdout incluso para `echo`) — confirmado de
   nuevo en esta sesión. Sin runner no se puede lanzar ni `python` ni `npm run`.
2. **Hipótesis de desajuste de unidad** (SIN_EVIDENCIA, requiere `Test-Path`):
   `vampire_swarm_orchestrator.py:47` hardcodea `PROJECT_ROOT = H:\EAR_OS_V2\EAR_OS_V2`,
   pero el repo vive hoy en `D:\EAR_OS_V2\EAR_OS_V2`. Si H: ya no existe, el enjambre
   hace `SKIP` de las 8 unidades (línea 137) y **cosecha 0 sin romper** — fachada silenciosa.

## 6 · Nota doctrinal sobre "100%"

"100% de los datos" = 100% de lo **atribuible con verdad** (AF, INV-06, INV-12).
Forzar teléfono en cada proveedor sería inventar datos ⇒ violación P0. El techo real de
la cosecha es `publishable` (12.987) menos lo legítimamente retenido por ambigüedad.
