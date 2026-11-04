# EAR OS · PROTOCOLO SILICON VALLEY — CÓMO SE CIERRA EL PRODUCTO
**task_id**: `SV-PROTOCOL-2026-11-04` · **emisor**: Cline (obrero, sesión de auditoría) · **fecha**: 2026-11-04
**ámbito**: producto en producción real (`productoraear.com` · Coolify `82.29.179.172:8000`) · **norma**: `.clinerules` V10_SIGMA

---

## 0 · LAS 5 LÍNEAS (CEO-1)

1. **Qué cambió:** nada del producto. Se audita el *sistema de verificación* y se descubre que el CI ya existe y es bueno (4 jobs), pero **17 de las 21 puertas de calidad nunca se ejecutan en máquina limpia**: solo en la terminal de un humano que hoy está muerta.
2. **Riesgo que desaparece:** el de creer que `gate:prepush` protege el dinero. No protege: `verify:pricing` (INV-01/10) y `audit:ssot` (INV-02/04/05) no están cableadas en CI, así que un push puede publicar una imagen con el SSOT alterado y el run quedar verde.
3. **URL que lo prueba:** `⚠️ SIN_URL_PUBLICA` — 0 sondeos en esta sesión (canal de ejecución muerto, ver E-00). La prueba es de disco: `.github/workflows/deploy-ghcr.yml:33-89,220-234`.
4. **Qué NO está probado:** `tsc`, `eslint`, `audit:ssot`, `sim:event`, `deploy:freshness`, el estado real del último run de CI y las 12 URLs U1–U13.
5. **Decisión que necesito:** ~~una sola — cómo me devuelves el canal de ejecución (§7)~~ → **RESUELTA (2026-11-04, opción A+B)**: el arnés `VALIDAR_SV_PROTOCOL.bat` está en disco y convierte el terminal muerto en un `.log` legible (§4, Fase 0-BIS). Queda pendiente **un pegado de 4 líneas**: el estado de los 4 jobs del último run de `main` en *Actions* (§4, Fase 1).


---

## 1 · EVIDENCIA MEDIDA EN ESTA SESIÓN (solo canal `read_files`)

| ID | Prueba (`disco`) | Qué demuestra |
|---|---|---|
| E-00 | **5** sondas de terminal (`Write-Output PROBE_OK`, `echo PROBE2`, `node -e JSON.parse`, `node -e process.stdout.write`, `node scripts/audit_gate_coverage.cjs --json`) → `exit 1`, 0 stdout, `Command completion could not be observed` | Canal `run_commands` **MUERTO**; `search_codebase` timeout 30 s. Incidente `TOOLING-CLINE-TERMINAL` reconfirmado |
| E-01 | `package.json:75` | `gate:prepush` = **21 puertas** encadenadas (contadas una a una) |
| E-02 | `package.json:11,12` | `lint` y `typecheck` usan el binario real de `node_modules`, no `npx` |
| E-03 | `package.json:66` vs `:75` | `audit:gates` (el meta-gate que detecta puertas huérfanas) **existe y NO está en la cadena** → huérfano de sí mismo |
| E-04 | `package.json:100` vs `:75` | `verify:budget` (asignación 50/15/15/10/10 al céntimo) **fuera de la cadena** |
| E-05 | `scripts/verify_sonometro_pwa.cjs:1-30` + `package.json:6-102` | El verificador de INV-13 **existe en disco** y **no tiene alias npm** → INV-13 sin puerta |
| E-06 | `src/app/(public)/confianza/page.tsx:1-60` | **U13 SÍ EXISTE**: `force-static` (`:22`), `readEvidenceLedger()` (`:43`). El `.clinerules §4` que la declara `❌ NO_EXISTE` está **desfasado** (AMD-2) |
| E-07 | `src/lib/evidence/evidence-ledger.ts:13-45` | El ledger **degrada a SOSPECHOSO** toda fila `VERIFICADO` sin quíntupla; vocabulario cerrado (`:29`). Ya implementa EP-1/EP-2/AF-5 |
| E-08 | `.antigravity/evidence/ledger.jsonl:1-4` | 3 filas `VERIFICADO` (U1/U2/U4 del 2026-10-30) + 1 `FACHADA` (AF-1) |
| E-09 | `.github/workflows/deploy-ghcr.yml:14-92` | CI real: `contract-gate` → `typecheck-gate` → `build-and-push`. Bloquea `audit:admin`, `audit:ci-gate`, `tsc --noEmit`, `verify:voice` |
| E-10 | `.github/workflows/deploy-ghcr.yml:194-234` | `production-smoke` con `always()` + `prod_deploy_freshness.cjs --wait=120` = **G-7 ya es máquina** |
| E-11 | `.github/workflows/deploy-ghcr.yml:228-229` | El propio workflow declara que el smoke **sale hoy con `exit 3` por 503 de `CRON_SECRET`** → juez de G-7 **rojo declarado** (SOSPECHOSO: comentario, no run observado) |
| E-12 | `.github/workflows/deploy-ghcr.yml:44-47` | `next.config.ts:37` tiene `typescript.ignoreBuildErrors: true`; el CI es lo único que impide publicar una imagen con TS roto |
| E-13 | `package.json:108,124` | `@netlify/plugin-nextjs` y `@vercel/functions` siguen en `dependencies` → contradicen CHG-4 ("Vercel y Netlify erradicados") |
| E-14 | `package.json:141` | `next: ^16.3.5`; `.clinerules` y `AGENTS.md` hablan de "Next.js 15" → doctrina desfasada respecto a disco |
| E-15 | `src/lib/analytics/venue-showcase-telemetry.ts:219-223` | `126`, `29.165`, `3.832`, `64.618` como literales **sin `provenance`** → AF-4 (número sin fuente en copy comercial) |
| E-16 | `.antigravity/tasks_queue.json:7,15,64-99` | `W47_T03` sigue `QUEUED`; `total_pending: 2`; 5 bloques en `completed[]` |
| E-17 | `.antigravity/MISSION_ACTIVE.json:4-9` vs `:23` | 4 ficheros autorizados; `VenueExperienceHub.tsx` queda fuera y `omega.js:134` solo lintea `task.files` → **ese fichero nunca pasa eslint en el cierre** |
| E-18 | `.antigravity/omega.js:122-154` | `complete` ejecuta `tsc` → `eslint` (solo `task.files` existentes) → `task.test`; `exit 1` corta. Cerrar sin verlo es fachada |

---

## 2 · EL DIAGNÓSTICO EN UNA FRASE

> El producto no está bloqueado por falta de código: está bloqueado porque **el tribunal que juzga el código no tiene jurisdicción sobre el dinero**. Las 5 puertas que protegen precio, split, SSOT, teléfono y CTA viven en la terminal de un humano; el CI, que sí es una máquina limpia, solo juzga 4 de las 21.

En Silicon Valley esto tiene nombre y se resuelve de una forma: **el gate deja de ser una opinión local y pasa a ser un hecho del pipeline**. Todo lo demás (features, landings, copy) espera detrás.

---

## 3 · LOS 8 DEFECTOS, ORDENADOS POR DINERO

| ID | Sev | Defecto | Coste si se ignora | Prueba |
|---|---|---|---|---|
| **F-01** | P0 | 17 de 21 puertas no corren en CI; `verify:pricing` y `audit:ssot` (INV-01/02/04/05/10) quedan fuera | Una imagen con precio o split alterado se publica con el run **verde** | E-01, E-09 |
| **F-02** | P0 | El juez de G-7 (`production-smoke`) está declarado en rojo por 503 de `CRON_SECRET` | Un pipeline siempre rojo no se mira: alarma quemada = despliegue a ciegas | E-11 |
| **F-03** | P0 | `next.config.ts:37` con `ignoreBuildErrors:true` | Si el CI se salta (push directo, `workflow_dispatch`), la imagen publica TypeScript roto | E-12 |
| **F-04** | P1 | INV-13 sin puerta: `verify_sonometro_pwa.cjs` existe y nadie lo ejecuta | Rider acústico sin vigilancia = riesgo Ley 37/2003 en la promesa a la finca | E-05 |
| **F-05** | P1 | `audit:gates` (meta-gate) fuera de la cadena | Nadie dibuja el mapa de **cuántas otras** puertas están huérfanas | E-03 |
| **F-06** | P1 | 4 cifras comerciales sin `provenance` en el panel de Eduardo | AF-4 + JUR-1: vender "3.832 sesiones" sin fuente enlazada es una reclamación esperando abogado | E-15 |
| **F-07** | P1 | `VenueExperienceHub.tsx` editado fuera de `task.files` | El cierre de `W47_T03` no puede cantar verde limpio: lint incompleto por diseño | E-17 |
| **F-08** | P2 | SDK de Netlify + Vercel en `dependencies`; doctrina "Next 15" vs `^16.3.5` real | Superficie CVE y dependencias muertas; doctrina que miente erosiona la confianza en todo lo demás | E-13, E-14 |



---

## 4 · EL PROTOCOLO — 7 FASES + FASE 0-BIS, ORDEN ESTRICTO

> Regla de oro: **cada fase produce un número**. Una fase sin Exit Code o sin HTTP status no se cierra, se convierte en deuda con dueño.

### FASE 0 · Devolver el oído al auditor  *(bloqueante de todo)*
- **Comando**: `Write-Output PROBE_OK` en terminal nueva / reiniciar VS Code → *Reload Window*.
- **Paso**: `run_commands` devuelve stdout + `exit 0`.
- **Por qué primero**: hoy `run_commands` y `search_codebase` están muertos (E-00). Sin ese canal, cada afirmación de estado es `SIN_EVIDENCIA` por definición (EP-2). No es un problema de código: es el instrumento de medida.
- **Alternativa si el terminal no vuelve**: Fase 1 y 2 **no necesitan terminal** — se hacen en GitHub (web) y el resultado se lee en el navegador. El pipeline es el que ejecuta.

### FASE 0-BIS · `VALIDAR_SV_PROTOCOL.bat` — el arnés que ya está en disco  *(entregado 2026-11-04)*
- **Qué es**: un `.bat` de doble clic que corre **15 puertas reales** en un solo clic y **escribe su salida completa, con el `EXIT_CODE=` de cada una, a `.antigravity/reports/gate_output.log`**.
- **Por qué existe**: el terminal del agente está muerto (E-00). La salida no se pide por pantalla — se deja en un fichero que el agente lee con `read_files`. El humano pulsa; el agente audita. **El Canal de Evidencia cambia de transporte, no de rigor.**
- **Las 15 puertas, en orden**: `verify:pricing` · `audit:ssot` · `verify:logistics` · `verify:budget` · `verify:confianza` · `audit:cta-matrix` · `verify:provider-ctas` · `audit:phone` · `audit:admin` · `audit:http` · `audit:tariff-copy` · `audit:gates` · `verify_sonometro_pwa.cjs` · `lint` · `typecheck`.
- **Diseño deliberado**: **no aborta en el primer fallo** — acumula los 15 Exit Codes para tener el mapa completo en una pasada (el precedente `VALIDAR_W45_T01.bat` abortaba, y eso convertía un fallo en un expediente ciego sobre los otros 12). **No** incluye `omega.js complete`: cerrar la tarea es un acto aparte y consciente.
- **Criterio de paso**: existe `.antigravity/reports/gate_output.log` con 15 líneas `EXIT_CODE=` y un bloque `RESUMEN`. **Sin ese fichero, el arnés es SOSPECHOSO**, aunque su código parezca correcto — es un mensajero sin recibo.
- **El DoD portátil**: `.antigravity/skills/verify-ssot-integrity.md` empaqueta el scorecard 8/8 + las 5 preguntas del Premortem como skill reutilizable, con los comandos reales de este repo (`node ./node_modules/...`, nunca `npx` — `omega.js:115-120`).

### FASE 1 · Leer el veredicto real del pipeline (1 URL, 0 terminal)
- **Acción**: abrir en el navegador la pestaña *Actions* del repo y mirar el último run de `main` → estado de `contract-gate`, `typecheck-gate`, `build-and-push`, `production-smoke`.
- **Qué buscamos**: si `production-smoke` sale rojo con `exit 3` por 503 de `CRON_SECRET` (E-11), entonces **F-02 está confirmado** y el despliegue va a ciegas.
- **Comando que lo cierra en local** (cuando haya terminal + secret): `node scripts/prod_smoke_intake.cjs --wait=1500 --post`
- **Criterio de paso**: `exit 0`. Si es `exit 3` → el secreto `CRON_SECRET` de GitHub ≠ el del servidor: se corrige el del servidor o el del secret, y **se vuelve a lanzar** hasta verde. Un juez permanentemente rojo no es un juez.

### FASE 2 · Meter el dinero en el tribunal (el arreglo de F-01)
- **Qué**: añadir un job `money-gate` en `.github/workflows/deploy-ghcr.yml` que ejecute, como `needs: typecheck-gate`, exactamente las puertas que hoy solo existen en la terminal de un humano:
  `npm run lint` · `npm run verify:pricing` · `npm run audit:ssot` · `npm run verify:logistics` · `npm run verify:budget` · `npm run verify:confianza` · `npm run audit:cta-matrix` · `npm run verify:provider-ctas` · `npm run audit:phone` · `npm run audit:gates`
- **Antes de editar el YAML**: leer `scripts/audit_ci_gate_wiring.cjs` completo — es el guardián del cableado y puede exigir que el job nuevo entre en `needs:` de `build-and-push`. Romperlo deja el run rojo por el guardián, no por el código.
- **Riesgo declarado**: alguna de esas puertas puede necesitar servidor vivo (la cadena contiene `audit:contrast:core`, que es *live*). Por eso **no se mete `gate:prepush` entero**: se mete la lista de arriba, y la que falle por entorno se aísla en un job con `next start` + `wait-on`.
- **Criterio de paso**: primer run en `main` verde con los 10 comandos ejecutados (visible en el log del job). Si uno falla por entorno, se reubica — nunca se borra.
- **Qué desbloquea**: INV-01, INV-02, INV-04, INV-05, INV-09, INV-10 pasan de *promesa* a *hecho mecánico*. Es la diferencia entre "creo que el precio está bien" y "la máquina no me deja publicar si no lo está".

### FASE 3 · Cerrar los 3 huérfanos (F-04, F-05, E-04)
- **Qué**: tres puertas existen y nadie las ejecuta. Se cablean, no se reescriben.
  1. `verify_sonometro_pwa.cjs` (INV-13) → alias `"verify:sonometro": "node scripts/verify_sonometro_pwa.cjs"` en `package.json` y entrada en `money-gate`.
  2. `npm run audit:gates` → añadir a `gate:prepush` **y** a `money-gate`. Es el meta-gate que dibuja el mapa de huérfanas: sin él, este §3 se queda ciego en la próxima ola.
  3. `npm run verify:budget` → añadir a `gate:prepush` (asignación 50/15/15/10/10 al céntimo: es dinero).
- **Criterio de paso**: `npm run audit:gates` con `exit 0` y su salida `--json` adjunta al ledger (0 `ORPHAN`, 0 `MISSING`).
- **Qué desbloquea**: INV-13 deja de ser prosa; el sistema puede *demostrar* que ninguna de sus puertas es fachada de papel.

### FASE 4 · Cerrar `W47_T03` sin trampa (F-06, F-07)
- **Orden obligatorio**:
  1. Añadir `src/components/otzarreta/VenueExperienceHub.tsx` a `files` de `MISSION_ACTIVE.json` **y** de la tarea en `tasks_queue.json`... **NO**: WF-1 prohíbe editar la cola a mano. Se cierra con la tarea tal cual y se abre un bloque nuevo `W47_T05` por el fichero huérfano, o se re-encola `W47_T03` con los 5 ficheros vía `node .antigravity/omega.js next` tras corregir la tarea con sanción del CEO. **Decisión de CEO, no del obrero.**
  2. `provenance` para `126 / 29.165 / 3.832 / 64.618` (`venue-showcase-telemetry.ts:219-223`): un objeto `PROVENANCE` con `{value, source, date, url}` y el panel mostrando la fuente. Sin fuente → se retira el número (AF-4), no se ablanda la frase.
  3. `node .antigravity/omega.js complete W47_T03_EDUARDO_PARTNER_METRICS_AND_CEO_RADAR`
- **Criterio de paso**: ese comando imprime `tsc --noEmit = Exit Code 0.` y `eslint = Exit Code 0.` (omega.js:124,139) y el proceso termina con el bloque en `completed[]`.
- **Prohibido**: editar `tasks_queue.json` a mano o copiar el `completedEntry` a mano. Falsificar el registro es peor que no cerrar (WF-1, INC-2).

### FASE 5 · Replay del camino del dinero (INV-08)
- **Comando**: `npm run sim:event` con `npm run dev` vivo en `:3007`.
- **Criterio de paso**: N reintentos con el mismo `stripeSessionId` → **exactamente 1** fila `ProductionEvent`. Se anota el conteo.
- **Por qué aquí y no antes**: es la única prueba que exige servidor local; sin Fase 0 no existe, y sin F-01 arreglado nadie lo ejecuta en cada push.

### FASE 6 · Publicar la verdad (G-6 + U13)
- **Qué**: sondear U1–U13 en el host final (`www.productoraear.com`, nunca el 308 del apex), calcular `sha256` del cuerpo y **añadir una línea por CLAIM** a `.antigravity/evidence/ledger.jsonl` (append-only, EP-4). `/confianza` ya sabe leerlo (E-06, E-07): la página se llena sola.
- **Comandos**: `node scripts/prod_smoke_intake.cjs --wait=1500 --post` + `node scripts/prod_deploy_freshness.cjs --wait=120` + sondeo HTTP por URL.
- **Criterio de paso**: cada fila del ledger con `cmd`, `exit`, `url` https, `sha256` de 64 hex y `ts` ISO-8601 → el lector la marca `VERIFICADO`; si falta un campo, el propio lector la degrada a `SOSPECHOSO` (E-07). **Cero filas escritas a mano.**
- **Por qué es la fase que cierra el producto**: hoy el CEO solo puede decir "creo que funciona". Con esto dice "esto funciona, aquí está la URL y aquí el hash de lo que se midió, y si no me crees, la página lo dice sola".

### FASE 7 · Deuda y doctrina (F-08, E-06, E-14)
- **Qué**:
  1. Quitar `@netlify/plugin-nextjs` y `@vercel/functions` de `dependencies` (CHG-4) → exige `npm ci` limpio + `npm run build` antes de fusionar.
  2. Enmendar la doctrina en vez de ignorarla: U13 ya existe (E-06) y `next` es `^16.3.5` (E-14) → **AMD-2**: fecha, hash del fichero y motivo. Una doctrina que miente sobre el disco enseña al equipo a no leerla.
  3. `next.config.ts:37 ignoreBuildErrors: true` (E-12): solo se voltea **midiendo memoria en el VPS**; hasta entonces, el job `typecheck-gate` es la única muralla y debe seguir bloqueando `build-and-push`.
- **Criterio de paso**: `npm run build` con `exit 0` + `npm run audit:residues` con `exit 0` (repo < 50 MB) + doctrina con su bloque `AMD-2` fechado.

---

## 5 · LOS 4 PILARES × 3 STAKEHOLDERS: QUÉ ESTÁ PROBADO HOY

Honestidad estructural (EP-2): en esta sesión **no leí** las fichas de proveedor, ni `FincasB2BPortal`, ni `/admin/control`. Por tanto **toda la columna de contacto es `SIN_EVIDENCIA`** y así se declara, con el comando exacto que la convertiría en `VERIFICADO`.

| Stakeholder / Pilar | Dolor que mata | Contacto que debe escribir de verdad | Comando que lo prueba (hoy: SIN_EVIDENCIA) |
|---|---|---|---|
| **PROVEEDOR** | invisibilidad y leads huérfanos | ficha por gremio → `verified:true` solo con teléfono real | `npm run audit:phone` · `npm run verify:provider-ctas` |
| **FINCAS B2B** | quejas de ruido; no poder recomendar | `/webhook/finca-partnership` + rider acústico hash | `node scripts/verify_sonometro_pwa.cjs` · `npm run verify:provider-ctas` |
| **CEO EAR OS** | fachadas y pérdida de trazabilidad | `/api/admin/*` → PostgreSQL 16 → KPI radar | `npm run audit:admin` · `npm run audit:ssot` |
| **Pilar 1 · Neurobranding** | copy vacío / cifra sin fuente | panel de Eduardo con `provenance` por número | `npm run audit:slop:strict` · `npm run audit:tariff-copy` |
| **Pilar 2 · Venta elegante** | CTA muerto | 0 clics muertos en rutas que venden | `npm run audit:cta-matrix` · `npm run audit:http` |
| **Pilar 3 · Depósito 100 €** | doble cobro, mirón | 1 fila por `stripeSessionId` | `npm run sim:event` · `npm run verify:pricing` |
| **Pilar 4 · Acuerdo simbiótico** | ruido no homologado | rider por contexto + hash | `npm run verify:logistics` · `node scripts/verify_sonometro_pwa.cjs` |

**Consecuencia operativa**: los 4 pilares no se "auditan" con una tabla; se auditan ejecutando los 12 comandos de la columna derecha en este orden: `verify:pricing` → `audit:ssot` → `verify:logistics` → `verify:budget` → `audit:phone` → `audit:cta-matrix` → `verify:provider-ctas` → `audit:admin` → `audit:http` → `audit:tariff-copy` → `audit:slop:strict` → `verify_sonometro_pwa.cjs`. Cada uno con su Exit Code pegado.

---

## 6 · LO QUE NO ESTÁ PROBADO (GAP declarado, §13)

| Ítem | Estado hoy | Qué falta |
|---|---|---|
| `tsc` / `eslint` / `audit:ssot` / `sim:event` / `deploy:freshness` | **SIN_EVIDENCIA** (0 ejecuciones: E-00) | Fase 0 |
| Último run de CI en `main` | **SIN_EVIDENCIA** (no se observó) | Fase 1 (1 pestaña) |
| U1–U13 en producción | **SIN_EVIDENCIA** en esta sesión (el ledger tiene 3 filas del 2026-10-30) | Fase 6 |
| `/confianza` servida en HTTP | **SOSPECHOSO**: código en disco (E-06), 0 sondeos | Fase 6 |
| Lighthouse 100×4 · CWV p75 · Rich Results · Jaccard ≤ 0,10 | **SIN_EVIDENCIA_MÁQUINA** | instrumentación (fase posterior a F-01) |
| DLQ n8n con alerta automática | **SOSPECHOSO**: `dlqCount` existe (U2 verificado 2026-10-30), sin alerta | fase posterior |

---

## 7 · LO QUE NO HARÍA (aunque sea tentador)

1. **No añadir ni una feature** hasta que F-01 esté cerrado. Cada landing nueva multiplica la superficie sin tribunal.
2. **No reescribir** nada: el código del camino de dinero ya existe y el CI ya es S-class (E-09, E-10). Lo que falta es jurisdicción, no código.
3. **No tocar ZONA CERO** (`ear-os-ssot.ts`, `ssotIntegrityGuard.ts`, `atomicDateLockEngine.ts`) ni regenerar `KNOWN_GOOD_SSOT_HASH` sin sanción (INV-05).
4. **No cerrar `W47_T03`** sin ver `tsc` y `eslint` con Exit Code 0. Un bloque cerrado a mano es exactamente la fachada que este sistema persigue.
5. **No desplegar** nada que toque dinero en viernes o sin el CEO con teléfono (CHG-5). Ni con un `if: always()` que pueda tapar un 401 (E-11).
6. **No fiarme de este informe**: cada fila lleva su `file:línea`. Si un número no cuadra, el informe se corrige, no se defiende.

**La decisión que necesito del CEO (una sola):** *cómo me devuelves el canal de ejecución*. Opciones honestas:

| Opción | Qué haces tú | Qué hago yo después |
|---|---|---|
| **A** | Reinicias VS Code (*Reload Window*) y me confirmas que `run_commands` responde | Ejecuto Fases 2–6 y te devuelvo Exit Codes reales |
| **B** | Abres *Actions* del repo y me pegas el estado de los 4 jobs del último run de `main` | Cierro F-02 con evidencia y preparo el job `money-gate` |
| **C** | Autorizas que escriba el patch del YAML + `package.json` **sin validar** y que el CI sea el que valide en el primer push | El primer run rojo es el informe |
| **D** | Nada: esto es solo un plan para leerlo | El producto sigue como está: 3 filas verificadas y 17 puertas en la terminal de nadie |

Mi recomendación: **B ahora, A después**. B no necesita terminal ni permiso sobre producción: es leer 4 estados de un pipeline que ya existe. Con eso, la Fase 2 se puede escribir con el YAML coherente con su propio guardián (`audit_ci_gate_wiring.cjs`) en lugar de a ciegas.

---

## 8 · SIGMA://CLOSE/v1

```
task_id        : SV-PROTOCOL-2026-11-04
estado_bloque  : SOSPECHOSO
hecho          : protocolo de cierre en 7 fases + 8 defectos con file:línea; 0 cambios en src/,
                 tasks_queue.json, ledger.jsonl, CLINE_EXECUTION_LOG.md
evidence[]     : E-00 (3 sondas exit 1) · E-01..E-18 (read_files, exit 0)
cambios[]      : .antigravity/reports/EAR_OS_SV_PROTOCOL_2026-11-04.md
                 .antigravity/reports/EAR_OS_SV_PROTOCOL_2026-11-04.json
gates          : G-0 PASS (todo lo citado existe salvo lo marcado) · G-1..G-7 SIN_EVIDENCIA
                 (run_commands muerto) · G-8 PASS (premortem §9)
omega_diamante : { score: 1/20, pendientes: los 19 restantes — sin Exit Code no hay sello }
hipotesis[]    : (1) el comentario E-11 sobre el 503 de CRON_SECRET sigue vigente;
                 (2) el repo está en GitHub (GHCR productoraear/productora-ear-os, yml:11);
                 (3) audit_ci_gate_wiring no rompe al añadir un job nuevo
decision       : NO tocar el YAML ni package.json sin validación. Alternativa descartada:
                 escribir el patch a ciegas y dejar el primer push rojo. Motivo técnico: un
                 gate roto bloquea todo el pipeline y no hay forma de distinguirlo de un
                 fallo de código sin terminal.
riesgos        : si F-02 es real, el equipo ya aprendió a ignorar un CI rojo; la próxima
                 regresión de dinero no la verá nadie
reto_espejo    : criterio más duro que este informe: `npm run audit:gates --json` con
                 exit 0 y 0 ORPHAN. Comando: node scripts/audit_gate_coverage.cjs --json
aprendizaje_ceo: una puerta que solo existe en tu portátil no es una puerta, es una
                 costumbre; la que vive en el pipeline es la que de verdad te protege.
                 URL cuando esté desplegado: https://www.productoraear.com/confianza
siguiente_paso : pegar el estado de los 4 jobs del último run de CI en main (opción B)
```




