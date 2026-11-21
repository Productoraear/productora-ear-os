# FASE M4 · ACTA `SIGMA://CLOSE/v1`

**Task:** `M4-SEAL-M1-M3` · **Fecha:** 2026-11-21 · **Perímetro:** `D:\EAR_OS_V2\EAR_OS_V2`
**HEAD al abrir:** `2a6c123c` · **HEAD al verificar:** `de080d6c`

**Estado declarado: `SOSPECHOSO`.** Compuertas 22/22 Exit 0 y metacompilador VERDE 25/25
contra el candidato, pero la suite E2E de 102 pruebas arroja **72 PASS / 30 FAIL**. SIG-1: un
fallo obliga a `SOSPECHOSO`.

---

## SIGMA://CLOSE/v1

```
task_id        : M4-SEAL-M1-M3
estado_bloque  : SOSPECHOSO
hecho          : 102 pruebas E2E ejecutadas en modo live contra el preview :3007 con HEAD de
                 disco -> 72 PASS / 30 FAIL. Metacompilador en modo sonda -> candidato VERDE
                 25/25, produccion ROJO (MC-F2..F5 = 307 -> /celebraciones). Arnes 22/22 Exit 0.
cambios[]      : PENDIENTES EN ARBOL (4):
                   .antigravity/evidence/ledger.jsonl        (+7 filas append-only, EP-4)
                   package.json                              (+1 script :probe)
                   scripts/run_sv_protocol_15_gates.cjs      (compuerta en modo sonda)
                   CLINE_EXECUTION_LOG.md                    (+1 entrada M4)
                 YA EN de080d6c (blob a9c2ee03...):
                   scripts/audit_metacompiler_enterprise.cjs (MC-C1/C2/D1/F0 + --base-url)
gates          : G0 PASS · G1 PASS · G2 PASS · G3 PASS · G4 PASS · G5 PASS · G6 PASS(22/22)
                 G7 SIN_EVIDENCIA (CLS/LCP/INP no medidos) · G8 PASS (premortem abajo)
omega_diamante : { score: "SIN_EVIDENCIA", verdict: "NO EJECUTADO",
                   pendientes: ["npm run audit:omega-rojo no ejecutado en esta sesion"] }
decision       : NO se firma el commit propuesto. Motivos: (a) su mensaje afirma "verify 102
                 e2e contract suite" y el hecho medido es 72/30; (b) ya existe de080d6c que
                 contiene M1-M3; (c) no hay firma GPG (%G? = N).
riesgos        : produccion sirve 2a6c123c: las 4 URLs de conversion siguen en 307.
siguiente_paso : desplegar de080d6c (autorizacion del CEO) y re-ejecutar el arnes con
                 NODE_ENV=production.
```

---

## 1. Suite E2E (STEP 1)

Registro: **102** (T1=42 · T2=44 · T3=10 · T4=6). Ejecutados live: **102**.
**PASS 72 · FAIL 30.** T1 33/42 · T2 33/44 · T3 5/10 · T4 1/6. Chunks cacheados: 78.
Auditoría del registro en offline: 18/18 PASS.

### Desglose de los 30 fallos con causa raíz medida

| Categoría | Nº | Tests |
|---|---|---|
| SPEC-AUTHORING (la aserción contradice el código canónico) | 7 | F1-T1-05, F1-T1-06, F3-T1-02, F3-T1-03, R6-T1-05, T3-09, T4-03 |
| SECURITY P0 (mutación anónima + webhook 500) | 5 | F2-T2-02, F2-T2-03, F3-T2-06, T3-02, T4-06 |
| F6 BUNDLE LEAK (chunks admin en grafo público) | 9 | F6-T1-03, F6-T1-04, F6-T2-01..04, T3-03, T3-05, T4-02 |
| CATALOG / PHONE MASKING | 5 | F4-T1-04, F5-T2-02, T3-04, T4-01, T4-05 |
| CONCIERGE 500 (JSON malformado) | 1 | F7-T2-04 |
| DEPOSIT 409 (fecha quemada por prueba previa) | 1 | F3-T1-01 |
| DEROGATED COPY / CALENDAR DEPTH | 2 | F1-T2-05, F7-T2-01 |

**Las 7 de SPEC-AUTHORING no son defectos de producto** — probado abajo:

- `F1-T1-05`: exige `307` en `/restaurante-otzarreta`. En disco
  `src/app/(public)/restaurante-otzarreta/page.tsx` es un alias con `redirect('/otzarreta')` y
  `src/middleware.ts:56-62` certifica la ruta **a propósito** para que la ficha insignia no sea
  absorbida por el gate. La aserción pide el comportamiento que M1 eliminó.
- `F1-T1-06` / `T4-03`: exigen `200` en `artistaseuropa.com/celebraciones`, pero
  `src/lib/domains/sovereign-domain-registry.ts:140-152` no incluye `/celebraciones` en
  `allowedPublicPrefixes` de esa vertical: el aislamiento **debe** devolver 307.
- `F3-T1-02`: envía `timeSlot: '13:30'`. Las franjas canónicas
  (`src/lib/calendar/entity-calendar-types.ts:153-161`) usan `startTime`; `13:30` es un
  `endTime`. El 400 `INVALID_TIME_SLOT` es correcto.
- `F3-T1-03` / `R6-T1-05` / `T3-09`: piden `200` en `/reservar/contrato`, ruta ausente de
  `CERTIFIED_PRODUCTION_ROUTES` (`src/middleware.ts:51-76`) pese a estar en
  `src/app/sitemap.ts:60` con prioridad 0.95. **Aquí el defecto es real**: una URL del sitemap
  no es alcanzable; la suite lo archiva como "esperaba 200" sin nombrar la causa.

---

## 2. Auditor del metacompilador (STEP 2)

| Modo | Comando | Veredicto | Exit |
|---|---|---|---|
| Candidato | `npm run audit:metacompiler-enterprise:probe` | **VERDE 25/25** · P0 0 · P1 0 | 0 |
| Producción | `audit_metacompiler_enterprise.cjs --live` | **ROJO 21/25** · P0 4 | 1 |

Sonda de producción (`ts=2026-11-21T20:04:25Z`): `status:307`, `location:/celebraciones` en
`/proveedores?cat=finca`, `/proveedores`, `/calendario/catering/restaurante-otzarreta?intent=ver`
e `?intent=bloquear`. `/api/health` de producción devuelve `buildSha=2a6c123c`: **M1-M3 no está
desplegado**.

### Cuatro aserciones obsoletas corregidas

| Check | Exigía | Implementado en disco | Criterio nuevo |
|---|---|---|---|
| MC-C1 | flag cliente `showScraper` | ranura `scraperSlot` sólo inyectada por servidor | exige declare + render + gate de acción + ausencia del flag muerto |
| MC-C2 | `canMutateCalendarEntity` | RBAC fail-closed `const authorized` / `if (!authorized)` | exige las tres piezas (predicado, guarda, pantalla de denegación) |
| MC-D1 | `searchParams.get('cat')` | `await searchParams` + `normalizeBodasNetCategory` | acepta ambas lecturas, exige normalización |
| MC-F0 | nota P1 "sonda no ejecutada" | `SIN_EVIDENCIA` daba veredicto VERDE | **P0 obligatoria**: sin sonda → ROJO |

Añadido `--base-url=<origen>` (transporte http/https automático) y el script
`audit:metacompiler-enterprise:probe`. La compuerta del arnés pasó de estática a sonda.

---

## 3. Arnés constitucional (STEP 3) — 22/22 Exit 0

| Compuerta | Resultado |
|---|---|
| `tsc --noEmit` (G-1) | Exit 0 |
| `npm run audit:ssot` | Exit 0 · hash `cefa76c2…4b2b` == referencia |
| `npm run verify:pricing` | Exit 0 · **31/31** |
| `npm run audit:integrity` | Exit 0 · **15/15** |
| `npm run verify:confianza` | Exit 0 · QUINTUPLA OK · 0 degradadas |
| `npm run audit:residues` (INV-15) | Exit 0 |
| `node scripts/run_sv_protocol_15_gates.cjs` | Exit 0 · **22/22** |

El runner declara **22** compuertas (la orden decía 19/19). Se reporta lo medido.

---

## 4. Bloqueantes (no maquillados)

1. **`de080d6c` no desplegado** → producción en 307 en las 4 URLs de venta.
2. **Mutación anónima de calendario en entorno no productivo**: `canMutateEntity()`
   (`src/app/api/calendar/[kind]/[slug]/route.ts:68-69`) cierra con
   `NODE_ENV !== 'production' && EAR_CALENDAR_ALLOW_ANON_WRITE !== '0'`. Probado:
   `POST {action:"block",date:"2030-01-15"}` sin credencial → **200 `ok:true`**. SEC-1 relajado
   en local, y el arnés corre justo en ese entorno.
3. **9 fugas de chunk admin** en el bundle público: `src/app/layout.tsx:58-59,180,185` importa
   estáticamente `AdminConciergeBridge` y `AdminOnlyOmniConsole`, cuyos gates `'use client'` usan
   `next/dynamic`: el servidor devuelve `null`, pero el nombre del módulo viaja en el chunk.
4. **`Edwin Agudelo` aparece 8 veces en `/proveedores?cat=finca`** (aislamiento de catálogo roto;
   Ley del Paciente Cero, §3 AGENTS.md).
5. **`/api/concierge/chat` responde 500 con JSON malformado** (debe ser 400).
6. **Copy derogado vivo** en `/otzarreta`: "7 menús", 123,40 €, 142,50 €, 173 €.

---

## 5. Premortem (G-8)

1. **¿Objetivo exacto o primo hermano cosmético?** En lo ejecutable, exacto: 22 compuertas con
   Exit Code medido, 102 pruebas corridas (no una muestra), auditor en modo sonda. En alcance,
   no: se certifica el **candidato local**, no producción, que sigue en `2a6c123c`.
2. **¿Qué asunciones frágiles lo sostienen?** (a) `:3007` corre con `NODE_ENV=development`, y
   eso es justo lo que abre la mutación anónima → un arnés estricto debe correr con
   `NODE_ENV=production`; (b) la reparación del ledger depende de que `supersedes` case
   exactamente con el `claim` previo (IDs con espacios y barras); (c) la compuerta de sonda exige
   un servidor vivo en `:3007`.
3. **¿Qué alternativa descarté y por qué?** Reescribir en sitio las 7 filas del ledger (más
   limpio de leer), descartada por EP-4: destruye la procedencia. También descarté relajar
   MC-C1/C2/D1 para que pasaran: habría convertido la auditoría en fachada.
4. **¿Qué se rompe bajo carga y cómo lo detectamos antes que el cliente?** Con M1 desplegado el
   gate deja de absorber `/proveedores` y `/calendario/*`; si la lista blanca se queda corta
   aparecen 307 en masa. La detección ya no depende de leer código: sonda real en cada arnés.
5. **¿Qué consecuencia acepto al firmar?** Se firma un bloque `SOSPECHOSO`, no un "M4 en verde".
   Coste: los cuatro puntos de conversión de producción siguen en 307.

**Reto espejo.** El mandato pedía un reporte "en verde". La cláusula más exigente (AMD-2) es que
el reporte **no pueda** decir verde sin sondeo: en la primera ejecución el auditor se declaraba
"17/21 VERIFICADO" con la sonda sin ejecutar. MC-F0 pasó de P1 a P0.

---

## 6. Commit (STEP 4) — NO EJECUTADO, con motivo

- El mensaje pedido afirma `verify 102 e2e contract suite`; el hecho medido es **72/30**.
- Ya existe `de080d6c` (267 ficheros, +28305/−3115, autor `Productora EAR`, 2026-11-21 21:10:05
  +0100) con M1-M3. La orden llegó **después** de crearlo.
- **Las correcciones del auditor también están ya dentro de `de080d6c`**: comparación por blob
  (`git rev-parse HEAD:<ruta>` vs `git hash-object <ruta>`) da el mismo objeto
  `a9c2ee03b4601a1c957c3a172464de34058c02b4`. No hay nada de auditoría pendiente de firmar.
- Los 4 ficheros que difieren de HEAD son exclusivamente de esta sesión:
  `package.json`, `scripts/run_sv_protocol_15_gates.cjs`, `.antigravity/evidence/ledger.jsonl`
  (append-only) y `CLINE_EXECUTION_LOG.md`. Nada de M1-M3.
- Sin firma GPG disponible (`%G?` = `N`). **Sin push**: `origin/main` = `2a6c123c`, `de080d6c`
  está 1 commit por delante en local.

---

## 7. Aprendizaje CEO (60 segundos)

22 compuertas en verde miden invariantes de datos; no ven la mutación anónima ni las 9 fugas de
bundle. La suite de 102 pruebas sí las ve, y por eso su valor aparece cuando **falla**. Hoy falló
30 veces: ese es el activo a arreglar, no el verde del arnés. El punto de venta sigue roto en
producción hasta que `de080d6c` se despliegue.
