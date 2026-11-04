# ════════════════════════════════════════════════════════════════════════════════
# EAR OS · INVENTARIO MAESTRO DE HITOS, FACHADAS Y DEUDAS
# Sesión: AUDIT-EXPORT-2026-11-04 · Emisor: Cline (obrero) · Receptor: obrero + CEO
# Doctrina aplicable: OMEGA://DOCTRINE/V10_SIGMA (§1 EP, §2 INV, §3 AF, §5 G, §10 INC)
# Fuente de verdad: disco (no historial de chat). Append-only: este informe NO
# modifica tareas, ledger ni código. Solo mide y expone.
# ════════════════════════════════════════════════════════════════════════════════

## 0 · LOS 5 PUNTOS PARA EL CEO (CEO-1)

1. **Qué cambió:** no cambia nada del producto; esta sesión **audita** — convierte el
   historial disperso (cola, ledger, log, código) en un inventario único que el obrero
   puede contrastar línea a línea.
2. **Qué riesgo desaparece:** el de trabajar sobre memoria falsa. Hoy queda probado que
   **W47_T03 sigue marcada `QUEUED`** en la cola: la próxima sesión del obrero recibiría
   *otra vez* el panel de Eduardo y podría reintroducir el duplicado que ya se corrigió.
3. **URL que lo prueba:** `⚠️ SIN_URL_PUBLICA` — esta sesión **no ha hecho ni un solo
   sondeo HTTP** (ver §1). La evidencia es `ruta:línea` en disco.
4. **Qué NO está probado:** `tsc`, `eslint`, `audit:ssot`, `sim:event`, `deploy:freshness`
   y las 10.000 aserciones del auditor de presupuesto. El terminal de Cline **sigue sin
   devolver Exit Code** (incidente `TOOLING-CLINE-TERMINAL`, abierto desde 2026-10-31).
5. **Decisión que necesito:** **ninguna nueva**: ejecutar el bloque §7 (**12 comandos**, ~5 min)
   en una terminal limpia y dictar los Exit Codes. Con `Exit 0` el obrero puede cerrar
   W47_T03 con `node .antigravity/omega.js complete W47_T03_EDUARDO_PARTNER_METRICS_AND_CEO_RADAR`,
   que **ya ejecuta tsc + eslint + test de misión** por diseño (`omega.js:113-154`).

---

## 1 · MÉTODO Y LÍMITES DE ESTA SESIÓN (EP-1 · L3 · SIG-2)

**Canal de evidencia disponible:** lectura de ficheros en disco (`read_files`), `exit=0`
observado en cada lectura. Es evidencia de *estado en reposo*, no de *ejecución*.

**Canales muertos (medidos, no supuestos):**

| Canal | Prueba | Resultado |
|---|---|---|
| `run_commands` | `Write-Output 'PROBE_OK'` (sonda mínima) | **exit no observable** → `SIN_EVIDENCIA` |
| `search_codebase` | 3 patrones (`W47_T`, `KNOWN_GOOD_SSOT_HASH`, `PartnerShowcaseMetricsPanel`) | **timeout 30 s** ×3 → `SIN_EVIDENCIA` |
| HTTP a producción | no ejecutado (sin terminal) | `SIN_EVIDENCIA` ⇒ etiqueta `⚠️ SIN_URL_PUBLICA` |

**Consecuencia contractual:** todo lo que sigue se clasifica con el vocabulario cerrado de
EP-2 — `VERIFICADO` / `SOSPECHOSO` / `FACHADA` / `SIN_EVIDENCIA` — y **ningún** bloque se
firma `VERIFICADO`: un bloque exige Exit Code de comando (G-1…G-8), y hoy no hay canal
para obtenerlo. Los ítems de código se declaran `VERIFICADO EN DISCO (lectura)`, que **no**
es lo mismo que `VERIFICADO` de EP-2 y así se marca en cada fila.

**Evidencias de esta sesión (E1…E19):**

| ID | Comando literal | exit | Qué prueba |
|---|---|---|---|
| E1 | `read_files package.json` (`:7-102` scripts) | 0 | scripts reales; cadena `gate:prepush` con **21** pasos encadenados (incluye `lint`, `tsc --noEmit`, `audit:ssot`, `verify:cron-secret`, `verify:confianza`); **no existe** `verify:sonometro` |
| E2 | `read_files .antigravity/tasks_queue.json:1-120` | 0 | `W47_T03` = `QUEUED`; `_meta.total_pending: 2`; 5 bloques en `completed[]` |
| E3 | `read_files .antigravity/tasks_queue.json:23-48` | 0 | `W47_T04` = `QUEUED` (4 ficheros, P1) |
| E4 | `read_files .antigravity/MISSION_ACTIVE.json` | 0 | la misión activa sigue siendo W47_T03, con **4** ficheros autorizados |
| E5 | `read_files .antigravity/evidence/ledger.jsonl` | 0 | 30 CLAIMs con estado; ninguno promovido a VERIFICADO tras el 2026-10-30 |
| E6 | `read_files src/lib/analytics/venue-showcase-telemetry.ts` (266 líneas) | 0 | fuente única de cifras del panel (W47_T03) |
| E7 | `read_files PartnerShowcaseMetricsPanel.tsx` (5 ventanas) | 0 | semilla SSR, sensor, menús desde constante, cuota fija |
| E8 | `read_files EzkertzaVenueLanding.tsx` (4 ventanas, 120→640) | 0 | **un solo** montaje del panel (`:445`) |
| E9 | `read_files VenueExperienceHub.tsx:262-300` | 0 | `data-ear-track="menu-simulator"` en `:278` |
| E10 | `read_files AdminDashboardClient.tsx:236-262` | 0 | `detailHref` corregido en `:250` |
| E11 | `read_files src/app/api/webhooks/health/route.ts:30-120` | 0 | AF-1 parcheado en código (`:73-76`, `:83`, `:86`) |
| E12 | `read_files src/app/(public)/confianza/page.tsx:1-80` | 0 | U13 existe y se genera del ledger (`:22`, `:43`) |
| E13 | `read_files .antigravity/omega.js:1-60` y `:60-160` | 0 | `complete` ejecuta tsc/eslint/test antes de cerrar |
| E14 | `read_files CLINE_EXECUTION_LOG.md` (6 ventanas; total ≈1265 líneas) | 0 | el log **termina** en `W45_T01`; no hay W46 ni W47 |
| E15 | `read_files src/lib/constants/ear-os-ssot.ts:1-95` | 0 | los 13 invariantes, con su valor literal |
| E16 | `read_files` de 4 ficheros de ZONA CERO + `budget-allocator-engine.ts` + `evidence-ledger.ts` | 0 | todos existen |
| E17 | `run_commands` sonda `Write-Output` | **no observable** | `TOOLING-CLINE-TERMINAL` persiste |
| E18 | `search_codebase` ×3 | **timeout** | búsqueda semántica inservible en este repo |
| E19 | `read_files src/app/confianza/page.tsx` | **ENOENT** | la ruta vive en el grupo `(public)` |

---

## 2 · INVENTARIO DE HITOS (lo construido, con su estado real)

Leyenda de la columna **Estado hoy**: `VERIFICADO` (EP-2, con Exit Code — **ninguno**),
`VERIFICADO EN DISCO` (fichero existe y se leyó en esta sesión, sin ejecución),
`SOSPECHOSO` (código presente, prueba de ejecución parcial o contradictoria),
`FACHADA` (interfaz sin motor), `SIN_EVIDENCIA` (no hay lectura ni comando que lo pruebe hoy).

| # | Bloque / ID | Fecha | Qué quedó construido | Evidencia hoy | Estado hoy |
|---|---|---|---|---|---|
| 1 | `GOB-V10-SIGMA` | 2026-10-30 | Contrato operativo v10 SIGMA (`.clinerules`), ledger de evidencias, backups de v2.0 | Log `:1141-1160`; `E5` ledger con 30 CLAIMs | `VERIFICADO EN DISCO` (los `.bak` de `backups/`: `SIN_EVIDENCIA`) |
| 2 | `U13 · /confianza` | 2026-10-30 | Página pública de pruebas generada del ledger, estática, 0 JS de cliente | `E12` (`force-static` en `:22`, `readEvidenceLedger()` en `:43`), `E19` | `SOSPECHOSO`: existe en disco; en producción devolvió **404** el 2026-10-30 (ledger + log `:1185`) |
| 3 | `AF-1 · health honesto` | 2026-10-30 | `/api/webhooks/health` ejecuta `pingN8nInstance()` **siempre** y declara `probed/source/mode/checkedAt` | `E11` (`:56`, `:73-76`), `webhookSource:'canonical-config'` `:86`, `dlqScope:'process-local'` `:83` | `SOSPECHOSO`: parche en código, **no servido** en producción (ledger, fila `AF-1` superseded) |
| 4 | `CI-GATE` | 2026-10-30 | CI real: `contract-gate` + `typecheck-gate` en runner limpio antes de `build-and-push` | Log `:1001-1003` (run `40970254060`, commit `5c93eb164`) | `VERIFICADO` (según log; **no re-medible** sin terminal ni red) |
| 5 | `HARVEY-Ω-001/002` | 2026-10-27 | Cerebro `deepseek` + puente solo-lectura `harvey.db` → `POST /api/outreach/intake`; canal email **OFF** por diseño | Log `:44-60`; `.antigravity/reports/WAVE_44_EMAIL_CHANNEL_P2_P6.md` citado | `VERIFICADO EN DISCO` (log) · activación de email: **bloqueada por P2/P6** |
| 6 | `W41_T11…T15` | 2026-10-29 | Pestañas reales del panel admin (`/admin/control`): artistas, proveedores (alta homologada), afiliados; `isVerified` lo decide el servidor | Log `:600-607`, `:751-757` | `SIN_EVIDENCIA` hoy (no se releyeron esos componentes esta sesión) |
| 7 | `W42_T03 · pSEO 255 nodos` | 2026-10-30 | Dataset provincial con `distanceFromMentrideKm` real (255/255) + auditor `verify_pseo_dataset_integrity` 13/13 | Log `:1223-1239` | `VERIFICADO` en local (según log) · **deploy `STALE`** |
| 8 | `W44_T03 · Call Center + WhatsApp → n8n` | 2026-11-02 | Intake multi-canal cableado al webhook `call-center-intake` | `E2` (`completed[]`, exit 0) | `VERIFICADO EN DISCO` · **P0 abierto**: intake devuelve **503** en producción por `CRON_SECRET` ausente (log `:1005`, `:1131`) |
| 9 | `W45_T01 · Motor Magia Negra` | 2026-11-02 | `budget-allocator-engine.ts` (50/15/15/10/10 en céntimos) + `verify_budget_allocator.ts` (10.000 casos) + panel en `/experiencia` | `E16` (motor existe), `E1` (`verify:budget`), ledger fila `W45_T01-BUDGET-ENGINE` | `SOSPECHOSO`: render 200 medido (100.941 B) · 0/4 puertas de comando |
| 10 | `W46_T01/T02 · Navbar + EzkertzaCinematicJourney` | 2026-11-02 | Navbar sin solapes (divulgación progresiva lg→2xl) + recorrido cinemático y galería `object-contain` sin iframes | `E2` (`completed[]`), ledger fila `W46_T01_T02` = `SIN_EVIDENCIA` | `SIN_EVIDENCIA` (ni log ni command; el ledger ya lo declaró así) |
| 11 | `W46_T01_P0_MOBILE_VOICE_UNLOCK` | 2026-10-30 | Desbloqueo de audio en gesto + watchdog real + `verify_voice_watchdog.ts` (5 casos hostiles) | Log `:1015-1030`; `E1` (`verify:voice` en `:71` **y dentro de** `gate:prepush`) | `VERIFICADO` según log (5/5) · no re-medido hoy |
| 12 | `W47_T01 · Purga del shell global` | 2026-11-02 | Un solo shell en `layout.tsx`, fuera modales zombis de ratón | `E2` (`completed[]`, exit 0) | `SIN_EVIDENCIA` + **sin entrada en el log** (§4, D-08) |
| 13 | `W47_T02 · Purga duplicados /otzarreta` | 2026-11-03 | 1 hero, 1 vídeo sin iframe, 0 fotos verticales cortadas | `E2` (`completed[]`, exit 0) | `SIN_EVIDENCIA` + **sin entrada en el log** (D-08) |
| 14 | `W47_T03 · Panel de Eduardo + radar CEO` | 2026-11-04 | Telemetría de escaparate con fuente única, sensor real y cero cifras no acreditables | `E6`…`E10` (§3) | **`SOSPECHOSO`**: código conforme, **cola sin cerrar**, gates sin ejecutar |
| 15 | `W47_T04 · Simulador universal por ficha` | — | **No iniciado** (P1 conversión) | `E3` (`QUEUED`) | `SIN_EVIDENCIA` |

**Lo que este inventario NO afirma:** que ninguno de los bloques 1-14 esté desplegado hoy en
`82.29.179.172:8000`. La última medición de frescura registrada da `VERDICT=STALE`
(`buildSha=3ebf5e04…` frente a un HEAD posterior) y **no se ha repetido** en esta sesión
(`deploy:freshness` no ejecutado, `E17`).

---

## 3 · AUDITORÍA DEL ÚLTIMO BLOQUE (W47_T03) — afirmación por afirmación

Contraste entre lo que el obrero **declaró** y lo que hay **en disco** hoy (E6…E10).
`CONFIRMADO` = la afirmación se sostiene al leer el fichero; `DESVÍO` = el contenido es
correcto pero la referencia `ruta:línea` no; `REFUTADO` = el hecho afirmado es falso.

| # | Afirmación del obrero | Referencia que dio | Lo que hay en disco | Veredicto |
|---|---|---|---|---|
| A1 | Nueva `getEzkertzaVenueSnapshotSeed()` (SSR sin `localStorage`) | `telemetry:261-266` | `:261-266` exacto, con `live: normalizeLiveMetrics(null)` | `CONFIRMADO` |
| A2 | `68% / 12 fincas` y `14.400–22.000 €/año` sustituidos por hechos | `telemetry:238-240` | `:238` fuga = texto cualitativo; `:240` = "0 € de cuota fija anual: split 80/10/10…" | `CONFIRMADO` |
| A3 | `"6 semanas"` → `${BASE_HISTORICO_6_SEMANAS.length}` porque **la serie tiene 5 puntos** | `telemetry:242` | `:242` usa `.length` (correcto), pero el array tiene **6** puntos: `Sem 38,39,40,41,42,43` (`:86-91`) | `CONFIRMADO` el código · **`REFUTADO`** el motivo (hipótesis H1 falsa) |
| A4 | Panel importa `OFFICIAL_OTZARRETA_MENUS` y `EZKERTZA_DERIO_VENUE` | `panel:29` / `:28` | `:29` y `:28` exactos | `CONFIRMADO` |
| A5 | Estado inicializado con la semilla | `panel:39-42` | la inicialización real está en `:43` (`useState(() => getEzkertzaVenueSnapshotSeed())`) | `DESVÍO` (línea) |
| A6 | Eliminado el `if (!snapshot) return null` | `panel:97-100` | `:99-106` ya calcula `serie`/`deltaSemanal` sin corte previo | `CONFIRMADO` |
| A7 | Nueva regla de sensor `a[href*="wa.me"]` | `panel:78-79` | está en `:80`, dentro de `TRACK_RULES` (`:73-81`) | `DESVÍO` (línea) |
| A8 | Delta semanal etiquetado `Serie auditada:` | `panel:230` | `:230` literal | `CONFIRMADO` |
| A9 | `"7 menús"` → `{OFFICIAL_OTZARRETA_MENUS.length}` en dos sitios | `panel:244` y `:516` | `:244` y `:516` exactos | `CONFIRMADO` |
| A10 | "Ahorro Estimado" → "Cuota Fija Anual para el Caserío" con valor SSOT | `panel:463-464` | rótulo en `:464`, valor `snapshot.ahorroComisionesCompetenciaAnual` en `:467` | `CONFIRMADO` |
| A11 | `126` a mano → `{snapshot.landingsPropietariasCount}` | `panel:488`, `:553`, `:569` | usado en `:489` y `:570`; en `:553-554` lo que hay es el texto de los 11 km | `CONFIRMADO` en 2 de 3 · `DESVÍO` en la 3.ª |
| A12 | Tarjeta de menús con suelo real + sello "VERIFICADOS EN SSOT" | `panel:512`, `:515-521` | `:511-519`: sello + `menusFromEur` + `guestRange` | `CONFIRMADO` |
| A13 | Montaje duplicado eliminado de la landing; queda uno solo | `landing:222` y `:448` | `:222` es ya "PRUEBA SOCIAL"; el único montaje es `:445` | `CONFIRMADO` · `DESVÍO` (línea) |
| A14 | `id="ficha-ezkertza-derio"` presente (gate del sensor) | `landing:140` | `:140` exacto | `CONFIRMADO` |
| A15 | Simulador envuelto en `data-ear-track="menu-simulator"` | `hub:275-280` | atributo en `:278` + comentario `:275-277` | `CONFIRMADO` |
| A16 | `detailHref` a `/otzarreta#panel-eduardo` | `admin:250` | `:250` exacto | `CONFIRMADO` |

**Aritmética interna del motor (verificada a mano sobre el fichero, `E6`):**
la semilla no es inventada, es la suma de la serie auditada —
`412+530+620+745+890+1042 = 4.239` = `views` (`:106`) ·
`88+114+139+172+205+248 = 966` = `simulator_interactions` (`:107`) ·
`34+49+61+78+92+116 = 430` = `map_route_clicks` (`:108`) ·
`solicitudes 2+3+5+6+8+11 = 35` = `deposit_lock_clicks` (`:110`) ·
`ORIGENES_TOP`: `1610+805+613+460+344 = 3.832` = `EAR_OS_SESIONES_AUDITADAS_TOTAL` (`:222`) y
`42+21+16+12+9 = 100 %` (`:95-99`). **Cuadra.** Eso es lo que convierte el panel en
telemetría declarada y no en escaparate de cifras.

**Veredicto del bloque:** `SOSPECHOSO`. 16 de 16 afirmaciones se sostienen **en contenido**
en disco; lo que falta no es código, es **cierre**: la cola sin actualizar (§4 D-01) y los
dos comandos de compilación sin Exit Code (§7).

---

## 4 · DISCREPANCIAS DETECTADAS HOY (lo que el obrero debe corregir)

| ID | Sev | Qué está mal | Prueba | Cierre |
|---|---|---|---|---|
| **D-01** | **P0** | `W47_T03` sigue en `QUEUED` y `MISSION_ACTIVE.json` la mantiene como misión viva: **`omega.js complete` nunca se ejecutó**. La próxima sesión recibirá otra vez el mismo encargo y puede reintroducir el duplicado ya corregido | `E2` (`status:"QUEUED"`, `total_pending:2`), `E4`, `E13`, `OMEGA_STATE_JOURNAL.md` (2026-11-03T22:26:51Z → `QUEUED: 2 / COMPLETED: 0`) | `node .antigravity/omega.js complete W47_T03_EDUARDO_PARTNER_METRICS_AND_CEO_RADAR` (ejecuta tsc + eslint + test) |
| **D-02** | **P0** | El obrero editó **5** ficheros; la misión autoriza **4**. `src/components/otzarreta/VenueExperienceHub.tsx` quedó fuera de la lista y `omega.js:134` solo lintea `task.files` ⇒ ese fichero **nunca pasa eslint en el gate de cierre** | `E4` (4 rutas) vs informe del obrero (5.ª ruta), `E13` (`:134`) | Añadir la ruta a `files` **antes** de cerrar, o lintearla a mano (§7) |
| **D-03** | P1 | El informe afirma "la serie tiene 5 semanas": **son 6**. La corrección de código es inocua, pero el premortem se apoyaba en una premisa falsa | `E6` (`:86-91`) | Corregir la cita en el ledger; el código no se toca |
| **D-04** | P2 | `src/app/confianza/page.tsx` **no existe**; U13 vive en `src/app/(public)/confianza/page.tsx`. Un `Test-Path` sobre la ruta sin grupo da MISS y hace creer que U13 no existe | `E19` (ENOENT) vs `E12` | Usar la ruta con grupo `(public)` en todos los informes |
| **D-05** | P1 | `EZKERTZA_LANDINGS_TOTAL = 126`, `29.165`, `3.832`, `64.618` son **literales** en el motor, sin enlace a la medición que los sostiene (AF-4 exige rastrear la cifra en ≤ 3 clics) | `E6` (`:219-223`) | Añadir `provenance` (fuente + fecha) a cada constante, o retirar la cifra del copy |
| **D-06** | P3 | 4 referencias `ruta:línea` del informe no coinciden (A5, A7, A11, A13): contenido correcto, cita desplazada | §3 | Citar por ancla (`id="panel-eduardo"`), no por número de línea |
| **D-07** | — | El suelo `menusFromEur` **no se ha leído** esta sesión: la ficha del venue declara que el "desde 100 €" se lee de `otzarreta-entity.ts` (`weddingPriceFromEur`), no de ese fichero | `src/lib/constants/ezkertza-derio-venue.ts:19-20` | `SIN_EVIDENCIA` puntual hasta leer `otzarreta-entity.ts` |
| **D-08** | P1 | **5 bloques sin entrada en `CLINE_EXECUTION_LOG.md`** (W46_T01/T02, W47_T01, W47_T02, W47_T03). El log termina en `W45_T01`: el pacto WF-3 ("sin entrada aquí, la misión no existe") está roto | `E14` (log ≈1265 líneas; última entrada `:1241-1265`) | Anexar las 5 entradas (append) antes de la siguiente wave |

---

## 5 · DEUDAS ABIERTAS, ORDENADAS POR LO QUE CUESTAN

Cada fila lleva **quién cierra** y **qué comando lo prueba**. Sin comando, no es deuda: es
opinión (Ley del Auditor Real, v9.1).

### P0 — dinero, datos o disponibilidad

| ID | Deuda | Qué se pierde si sigue abierta | Evidencia | Cierre (comando) |
|---|---|---|---|---|
| **P0-01** | `W47_T03` sin cerrar en la cola (D-01) | Trabajo duplicado y riesgo de regresión en la landing que vende | `E2`, `E4` | `node .antigravity/omega.js complete W47_T03_EDUARDO_PARTNER_METRICS_AND_CEO_RADAR` |
| **P0-02** | `CRON_SECRET` ausente en producción ⇒ las rutas fail-closed responden **503** | **Leads del Call Center y de WhatsApp no entran**: el motor comercial que más factura está ciego | Log `:1005`, `:1131`; `E11` (patrón fail-closed) | Definir `CRON_SECRET` en Coolify + `POST /api/call-center/intake` con token + sonda a `support/health-check` |
| **P0-03** | `TOOLING-CLINE-TERMINAL`: el terminal de Cline no devuelve Exit Code | 5 bloques entregados **sin** `tsc`/`eslint` medidos: W45_T01, W46_T01/T02, W47_T01, W47_T02, W47_T03 | `E17`; ledger fila `TOOLING-CLINE-TERMINAL` | Ejecutar §7 en terminal limpia y anotar Exit Codes en el ledger |
| **P0-04** | Producción sirve un build **anterior** al HEAD (`VERDICT=STALE`) | Lo auditado en local no es lo que ve el cliente; G-6 no se puede firmar | Log `:1180-1191` (`buildSha=3ebf5e04…`); **no re-medido hoy** | `npm run deploy:freshness` → exigir `FRESH` |
| **P0-05** | `/api/omega/heartbeat` declara `network.status:"SIN_CONFIRMAR"` para Ollama `127.0.0.1:11434` | AF-3 lo tipifica como defecto P0: un motor de IA sin confirmar presentado en el cuadro de mando | Ledger fila `OMEGA-HEARTBEAT`; `.clinerules` AF-3 | Sonda real a Ollama + estado `OPERATIVO`/`CAIDO` con `checkedAt`, nunca `SIN_CONFIRMAR` |

### P1 — función comercial degradada

| ID | Deuda | Qué se pierde | Evidencia | Cierre |
|---|---|---|---|---|
| **P1-01** | El parche AF-1 está en código pero **no** en producción | La telemetría de n8n sigue mintiendo al CEO hasta el próximo deploy | `E11` (`:73-76`); ledger `AF-1` superseded | Deploy + `GET /api/webhooks/health` sin `?ping=true` y comprobar `source:"live"` |
| **P1-02** | U13 `/confianza` existe en disco y devolvió **404** en producción; el ledger registra **41 fallos de contraste AA** (token `#71717a`) | Sin la página de pruebas, todo informe al CEO lleva `⚠️ SIN_URL_PUBLICA` (EP-3) | `E12`; ledger `U13` (404, 41 fallos) | Deploy + sonda 200 + re-medir contraste con el token corregido |
| **P1-03** | 5 bloques sin entrada en `CLINE_EXECUTION_LOG.md` (D-08) | La memoria en disco — el único activo real del sistema — tiene un agujero de 3 días | `E14` (log termina en `W45_T01`) | Append de las 5 entradas |
| **P1-04** | `VenueExperienceHub.tsx` editado fuera de `task.files` (D-02) | Ese fichero nunca pasa eslint en el gate de cierre | `E4` vs `E13` (`:134`) | Añadir la ruta a `files` o lintear a mano |
| **P1-05** | Cifras canónicas como literales sin provenance (D-05) | AF-4/JUR-1: una cifra que no se puede rastrear se retira del copy, no se defiende | `E6` (`:219-223`) | Añadir fuente+fecha a cada constante |
| **P1-06** | `W47_T04` (simulador universal por ficha) **sin empezar** | La conversión del resto de fincas no existe: el panel solo sirve para Ezkertza | `E3` | Despachar tras cerrar W47_T03 |
| **P1-07** | El auditor de contraste da verde mientras el ledger registra 41 fallos reales (`CI-CONTRAST`) | AF-5 "verde por defecto": un gate que aprueba sin ejecutar es peor que no tenerlo | Ledger fila `CI-CONTRAST` = `SOSPECHOSO` | Alinear umbral del script con WCAG y volver a medir |
| **P1-08** | `/bodas/toledo` usa **44 km** donde la distancia real es **58 km** (afecta a `deliveryCostBase`) | Se subestima el desplazamiento: **es dinero**, no copy | Log `:1233-1235` | **Requiere sanción del CEO** (toca precio); después `npm run verify:pseo` |
| **P1-09** | El panel ahora arrastra `EZKERTZA_DERIO_VENUE` + `OFFICIAL_OTZARRETA_MENUS` a un chunk de cliente: **tamaño de edge no medido** tras W47_T03 | INV-15 (edge < 1 MB). Un import pesado en cliente mata el LCP en móvil (CLS 0,87 histórico) | `E7` (`:28-29`) | `npm run build` y leer el first-load JS de `/otzarreta` + `npm run audit:residues` (**`audit:edge` no sirve aquí**: mide particiones de proveedores, `package.json:24`) |

### P2 / P3 — se arrastran sin bloquear

| ID | Deuda | Evidencia | Cierre |
|---|---|---|---|
| P2-01 | `sitemap.xml`: apex vs `www` (canonical inconsistente con el 308) | Ledger `U6` | Fijar host canónico en una constante |
| P2-02 | Fallbacks inventados en landings (`'Comarca Histórica'`, `?? 35`) | Log `:1236-1238` | Degradar a `null` y no pintar la fila (AF-5) |
| P2-03 | Auditor de similitud acotado a 10 landings (objetivo: 1.000 URLs) | `.clinerules` §13 | Ampliar el muestreo |
| P2-04 | `dlqScope:"process-local"` en health | `E11` (`:83`) | Declarar DLQ global o exponer el scope en el panel |
| P2-05 | `verify_budget_allocator` (10.000 casos) nunca ejecutado: 0/4 puertas | Ledger `W45_T01-BUDGET-ENGINE` | `npm run verify:budget` |
| P3-01 | Citas por número de línea en los informes (D-06) | §3 | Citar por ancla |

---

## 6 · INVARIANTES SSOT — LEÍDOS HOY, NO EJECUTADOS

Valores literales leídos en `src/lib/constants/ear-os-ssot.ts` (`E15`, `:1-95`). La columna
"Gate" dice **con qué comando se firma**; hoy ese comando **no** se ha ejecutado ⇒ el
invariante está **intacto por lectura**, no `VERIFICADO` por EP-2.

| ID | Invariante | Valor leído en disco | Gate que lo firma | Estado hoy |
|---|---|---|---|---|
| INV-01 | Tarifa base solista | `350` € | `npm run verify:pricing` | Intacto por lectura · gate `SIN_EVIDENCIA` |
| INV-02 | Split soberano | `0.8 / 0.1 / 0.1` | `npm run verify:pricing` + `audit:ssot` | Intacto por lectura · gate `SIN_EVIDENCIA` |
| INV-03 | Depósito deducible | `100` € | `npm run sim:event` + `verify_price_lock_flow.cjs` | Intacto por lectura · gate `SIN_EVIDENCIA` |
| INV-04 | Techo B2G | `14.250` € (límite `15.000`, Art. 118 LCSP) | `npm run audit:ssot` | Intacto por lectura · gate `SIN_EVIDENCIA` |
| INV-05 | ZONA CERO | Los 4 ficheros existen (`E16`): `ear-os-ssot.ts`, `ssotIntegrityGuard.ts`, `atomicDateLockEngine.ts`, `evidence-ledger.ts` (+ `budget-allocator-engine.ts`) | `npm run audit:ssot` (hash == `KNOWN_GOOD`) | Ficheros presentes · hash `SIN_EVIDENCIA` |
| INV-10 | Logística | `1,50 €/km` desde km `50`, hotel `120` € si fin ≥ `03:00` o > `200` km | `npm run verify:logistics` | Intacto por lectura · gate `SIN_EVIDENCIA` |
| INV-12 | Teléfono único | `+34 693 693 048` | `npm run audit:phone` | Intacto por lectura · gate `SIN_EVIDENCIA` |
| INV-13 | Rider acústico | `65-75 / 70-80 / 85-90 / 90-102` dBA + límite `< 75 dB SPL`, `12 W/pax` | `node scripts/verify_sonometro_pwa.cjs` (**no hay script npm**; ruta citada en INV-13, existencia no sondeada) | Intacto por lectura · gate `SIN_EVIDENCIA` |

**Ningún invariante se ha movido esta sesión.** No se ha editado ni un fichero de `src/`:
este informe solo escribe en `.antigravity/reports/`.

---

## 7 · CHECKLIST EJECUTABLE — 12 comandos, en este orden (para el operador)

Todos los comandos son **literales** y existen en `package.json:7-102` (E1). Si alguno
devuelve Exit ≠ 0, **se para** y se reporta: no se cierra tarea (G-1…G-8).

| # | Comando | Criterio de paso | Qué cierra |
|---|---|---|---|
| C-1 | `npm run typecheck` | Exit **0**, 0 `any` en el diff | G-1 |
| C-2 | `npm run lint` | Exit **0** (lintea todo `src/`) | G-2 |
| C-3 | `node ./node_modules/eslint/bin/eslint.js src/components/otzarreta/VenueExperienceHub.tsx src/components/otzarreta/PartnerShowcaseMetricsPanel.tsx src/components/otzarreta/EzkertzaVenueLanding.tsx "src/app/(admin)/admin/AdminDashboardClient.tsx" src/lib/analytics/venue-showcase-telemetry.ts` | Exit **0** en los 5 ficheros | **D-02** (el 5.º fichero fuera del gate) |
| C-4 | `npm run audit:ssot` | Exit **0** y hash == `KNOWN_GOOD` | G-4 · INV-05 |
| C-5 | `npm run verify:pricing` | Exit **0** | INV-01 / INV-02 / INV-10 |
| C-6 | `npm run verify:confianza` | Exit **0** (filas del ledger ↔ página) | U13 · EP-3 |
| C-7 | `npm run verify:cron-secret` | Exit **0** | **P0-02** (medición, no arreglo) |
| C-8 | `npm run sim:event` | Exit **0** · **1** fila por `stripeSessionId` | G-5 · INV-08 |
| C-9 | `npm run gate:prepush` | Exit **0** · 21 pasos encadenados | **G-3** |
| C-10 | `npm run build` | Exit **0** · build < 60 s · apuntar el first-load JS de `/otzarreta` | **P1-09** · INV-15 |
| C-11 | `node .antigravity/omega.js complete W47_T03_EDUARDO_PARTNER_METRICS_AND_CEO_RADAR` | Exit **0** (re-ejecuta tsc + eslint + test de misión) y la tarea **sale** de `pending` | **D-01 / P0-01** |
| C-12 | Append de las 5 entradas en `CLINE_EXECUTION_LOG.md` (W46_T01/T02, W47_T01, W47_T02, W47_T03) | Fichero crece; **nunca** se sobrescribe | **D-08 / P1-03** |

**Orden no negociable:** C-12 **después** de C-11 (el log anota el hito ya verificado, no la
intención). C-10 **antes** de C-11 para no cerrar con un bundle roto.

### 7bis · Lo que solo puede hacer el CEO (no el obrero)

| Decisión | Por qué es suya |
|---|---|
| Distancia de `/bodas/toledo`: 44 km → 58 km (P1-08) | Cambia el `deliveryCostBase`: **es precio** |
| Rotar/definir `CRON_SECRET` en Coolify (P0-02) | Secreto de producción (SEC-3) |
| Autorizar deploy (P0-04) | CHG-5: ventana y acceso a su teléfono |

---

## 8 · PROHIBICIONES EXPLÍCITAS PARA LA PRÓXIMA SESIÓN

1. **No re-implementar W47_T03.** Ya está hecho (§3). Solo falta cerrarlo. Si el obrero
   recibe la tarea otra vez y "mejora" el panel, **reintroduce el duplicado** que W47_T02
   eliminó: la landing volvería a montar dos veces el mismo bloque.
2. **No editar `tasks_queue.json` a mano** (WF-1). El cierre es `omega.js complete`.
3. **No tocar ZONA CERO** (`ear-os-ssot.ts`, `ssotIntegrityGuard.ts`, `atomicDateLockEngine.ts`,
   `budget-allocator-engine.ts`, `evidence-ledger.ts`) ni regenerar `KNOWN_GOOD_SSOT_HASH`
   sin sanción del CEO.
4. **No `git add -A`** (CHG-6). Un `.env` o un PDF de 3 MB en el repo cuesta más que el bug.
5. **No subir a producción el mismo día** que se toca dinero sin C-9 y C-10 en verde.

---

## 9 · CLASE DE 60 SEGUNDOS PARA EL CEO (CEO-3)

**⟨Deuda técnica⟩** → es trabajo ya empezado que no está cerrado en el registro.
**Por qué le importa:** su sistema decide con dos papeles — la cola de tareas y el log. Si
la cola dice "pendiente" cuando el trabajo está hecho, la próxima sesión **paga otra vez**
por hacerlo, y peor: puede deshacer lo bueno. Eso es exactamente lo que pasa hoy con el
panel de Eduardo.
**Qué le costaría ignorarlo:** una sesión duplicada (~coste de tokens) y el riesgo de volver
a montar dos veces el mismo bloque en la página que vende la finca.

**⟨Fachada⟩** → una pantalla que parece funcionar pero no mide ni escribe nada.
**Por qué le importa:** el caso real es el health de n8n: respondía "vivo, 12 ms" sin haber
preguntado nunca. Usted lo leía verde; el motor estaba mudo. Una caída se detecta, una
mentira se confía.
**Qué le costaría ignorarlo:** vender con la automatización caída y enterarse por un cliente.

**⟨Idempotencia⟩** → que el mismo pago, reintentado, siga contando **una** vez.
**Por qué le importa:** es la diferencia entre un doble clic del cliente y un cobro doble en
su cuenta de Stripe. Se prueba con C-8 (`npm run sim:event`).
**Qué le costaría ignorarlo:** una devolución, una reseña de 1 estrella y una reclamación.

---

## 10 · PREMORTEM OBLIGATORIO DE ESTA ENTREGA (G-8)

1. **¿Cumple el `done_when`?** Sí en forma (2 artefactos, estados con evidencia `ruta:línea`),
   **no** en la firma final: los estados `VERIFICADO` exigen Exit Code y hoy no hay canal para
   obtenerlo (`E17`). Se entrega `SOSPECHOSO` con la lista de huecos a la vista, no un 20/20.
2. **¿Qué asunciones frágiles lo sostienen?** (a) que `read_files` refleja el disco real en el
   instante de la lectura; (b) que la cola `tasks_queue.json` es la única fuente de verdad de
   lo pendiente (si alguien editó a mano, este informe hereda el error); (c) que el log
   `CLINE_EXECUTION_LOG.md` está completo hasta la línea 1265 y no truncado.
3. **¿Qué alternativa descarté y por qué?** Editar `tasks_queue.json` para marcar W47_T03 como
   cerrada: **habría sido falsificar el registro** y, además, dejaría el bloque sin `tsc` ni
   `eslint` (los ejecuta `omega.js complete`). Descartado por integridad, no por comodidad.
4. **¿Qué se rompe y cómo lo detectamos antes que el cliente?** El riesgo nuevo es de peso:
   el panel importa la ficha del venue y los menús en un chunk de cliente. Si eso engorda el
   bundle, el móvil lo paga en LCP y CLS. Detección: C-10 (`npm run build`, leer first-load JS
   de `/otzarreta`) y `npm run audit:residues`. **No medido hoy** ⇒ P1-09.
5. **¿Qué acepto al firmar esto?** Que he auditado **sin ejecutar**: afirmo lo que está escrito
   en disco y **no** afirmo que compile, que pase lint ni que esté desplegado. Todo lo que este
   informe declara `VERIFICADO` viene de un log o de un ledger anteriores, y así está etiquetado.

---

## 11 · CIERRE (SIG §12)

```
SIGMA://CLOSE/v1
task_id        : AUDIT-EXPORT-2026-11-04
estado_bloque  : SOSPECHOSO
hecho          : 2 artefactos escritos y re-leídos:
                 .antigravity/reports/EAR_OS_INVENTARIO_MAESTRO_2026-11-04.md
                 .antigravity/reports/EAR_OS_INVENTARIO_MAESTRO_2026-11-04.json
                 + auditoría A1..A16 de W47_T03 contra disco (§3)
evidence[]     : E1..E19 (§1) — todas lecturas de fichero, exit=0; 0 comandos ejecutados
cambios[]      : solo los 2 ficheros de este informe. Cero cambios en src/, en la cola,
                 en el ledger y en el log.
gates          : G-0 PASS (todas las rutas citadas existen; 1 MISS documentado: D-04)
                 G-1..G-7 SIN_EVIDENCIA (terminal sin Exit Code)  G-8 PASS (§10)
omega_diamante : { score: 1/20, pendientes: [tsc, eslint, 0-any, verified:true,
                   handlers, TODOs, secrets, ISO 25010, CISQ, OWASP, Lighthouse, CWV,
                   WCAG, Rich Results, Jaccard/TF-IDF, provenance, presupuesto,
                   idempotencia, n8n/DLQ] }
hipotesis[]    : disco estable durante la lectura · cola = fuente única · log no truncado
decision       : NO tocar tasks_queue.json a mano (habría sido falsificar el registro y
                 cerrar sin tsc/eslint); el cierre correcto es C-11.
riesgos        : el panel puede haber engordado el chunk de cliente (P1-09, no medido).
reto_espejo    : si alguien sostiene que W47_T03 "está cerrada", el comando que lo refuta
                 es `Get-Content .antigravity/tasks_queue.json | Select-String W47_T03`
                 → devuelve `"status": "QUEUED"`.
aprendizaje_ceo: Una tarea no está hecha cuando el código está escrito, sino cuando un
                 comando devuelve 0 y lo deja anotado. URL: ⚠️ SIN_URL_PUBLICA esta sesión;
                 cuando U13 esté desplegada, esto se lee en https://productoraear.com/confianza
siguiente_paso : ejecutar C-1 del §7 (`npm run typecheck`) y pegar el Exit Code.
```

**Nota de honestidad final (EP-5):** este informe **no** afirma que el producto esté caído,
ni que W47_T03 esté mal hecho. Afirma dos cosas medidas: (1) el trabajo **está** en el código,
(2) el **cierre** no está en el registro. La distancia entre esas dos frases es, exactamente,
la deuda que el sistema arrastra desde el 2026-10-31 por un terminal que no devuelve Exit Code.







