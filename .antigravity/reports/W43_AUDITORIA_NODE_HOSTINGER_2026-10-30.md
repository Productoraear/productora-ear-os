# W43 · AUDITORÍA FORENSE — AVISO DE SEGURIDAD NODE.JS (HOSTINGER) + ESTADO DEL BLOQUE

- Fecha: 2026-10-30T21:52Z
- Autor: agente ejecutor (Cline) bajo OMEGA://DOCTRINE/V10_SIGMA
- Estado del descriptor de terminal: **ZOMBIE** (0 Exit Codes obtenibles, ver CLAIM `TOOLING-CLINE-TERMINAL`)
- Este informe NO es un cierre de tarea. Es una auditoría de corrección sobre el reporte del Arquitecto.

## 0. CAPA CEO (CEO-1 · cinco líneas)

1. **Qué cambió:** nada en producción; esta sesión solo midió y corrigió dos afirmaciones del reporte anterior, además de anclar 6 filas nuevas en el ledger de evidencias.
2. **Qué riesgo desaparece:** ninguno todavía. Se ha **localizado** el riesgo: no existe ninguna sonda que demuestre qué versión de Node corre dentro del contenedor de producción.
3. **URL que lo prueba:** `https://www.productoraear.com/api/health` → 200, `buildSha=f54e2a494c871a9058bd30fb599fd052ce310eee` (no es `cefac7cd`).
4. **Qué NO está probado:** la versión de Node en el VPS, el `Exit 0` de `tsc`, el estado de git, y que el rebuild de Coolify se haya llevado por delante la caché de la imagen base.
5. **Qué decisión necesito:** rotar `CRON_SECRET` (el propio health lo declara débil) y autorizar el bloque de endurecimiento del Dockerfile de la sección 6.

## 1. DICTAMEN SOBRE LA ALERTA DE HOSTINGER (Node.js)

| Afirmación del reporte | Veredicto | Prueba |
|---|---|---|
| `node -v` local = v26.12.1 → inmune | **SIN_EVIDENCIA** | 5 intentos de `run_commands`, todos `exit=1` con "Command completion could not be observed". El dato no se ha podido medir en esta sesión. |
| `Dockerfile:1` y `:29` usan `node:22-alpine` (etiqueta flotante) | **VERIFICADO** | Lectura literal del fichero: línea 1 `FROM node:22-alpine AS base`, línea 29 `FROM node:22-alpine AS runner`. Sin minor, sin digest. |
| "Docker descargará automáticamente la versión corregida" | **FALSO COMO GARANTÍA** | Una etiqueta flotante solo resuelve a la última 22.x **si el build hace pull**. Coolify reutiliza caché de capas y el Dockerfile no contiene ninguna instrucción que fuerce `--pull`. Es una expectativa operativa, no un hecho verificado. |
| "No es necesario tocar código ni el Dockerfile" | **DISCREPO (reto_espejo §7)** | Sin una aserción de versión en build y sin un campo de runtime en la sonda, el parche **no es demostrable**. Un parche que no se puede probar es una promesa, y las promesas sin URL se eliminan (EP-3). |
| La versión real de Node en producción | **SIN_EVIDENCIA** | `src/app/api/health/route.ts` (53 líneas leídas) publica `status`, `buildSha`, `buildTime`, `buildSource`, `cron`. **No publica `process.version`**. No hay endpoint que la exponga. |

**Dictamen:** la exposición al CVE **no está descartada ni confirmada**. Hay dos fuentes de riesgo adicionales que el reporte no contempla:

- **Drift dev/prod:** desarrollo en 26.x, producción en 22.x. `package.json` no declara `engines`. Nada impide desplegar código probado en una major y ejecutado en otra.
- **Build no determinista:** etiqueta flotante ⇒ dos builds del mismo commit pueden producir binarios distintos (choca con SEC-6 y con el sello de procedencia que el propio Dockerfile pretende).

## 2. INV-10 · CORRECCIÓN DEL VEREDICTO "PARCHE SELLADO"

`sovereign-pricing.ts:70-71` ya usa la constante y **no** contiene el literal 150. Eso es cierto y está medido en disco.

Pero la frase del reporte "constante sellada en `logistics.ts`" es inexacta, y la diferencia importa:

- `src/lib/constants/ear-os-ssot.ts:22-91` declara **14 claves**. **Ninguna** es el rider.
- `logistics.ts:49` define `SUPLEMENTO_RIDER_ELITE = 150` como constante local, igual que `SUPLEMENTO_TRIO = 250` (l.47), `SUPLEMENTO_QUINTETO = 400` (l.48) y `SUPLEMENTO_MUSICO_ADICIONAL_EUR = 100` (l.63).
- `ssotIntegrityGuard.ts:61-84` (`canonicalizeSsot()`) hashea esas 14 claves. `KNOWN_GOOD_SSOT_HASH` **no cubre** 150 / 250 / 400 / 100. Los invariantes (l.116-155) tampoco.

**Dictamen:** el parche elimina la duplicación *intra-motor* (bien, y elimina un riesgo real de divergencia entre total y firma SHA-256). **No** cierra INV-10: siguen existiendo cuatro precios vivos fuera del SSOT sellado y fuera del alcance del centinela. Cierre correcto: canonizar en ZONA CERO con sanción del CEO + re-baselining del hash (AMD-2), o acotar `verify:pricing` / `audit:tariff-copy` para que los cubran y lo demuestren con Exit 0.

## 3. HALLAZGOS MEDIDOS EN PRODUCCIÓN (G-6, host final `www.productoraear.com`)

| ID | Hallazgo | Estado | Severidad |
|---|---|---|---|
| `G-7-DEPLOY-FRESHNESS` | Producción sirve `buildSha=f54e2a4…`, no el `cefac7cd` que el reporte declara sellado en `main`. | SOSPECHOSO | P0 (procedencia) |
| `HEALTH-CRON-WEAK` | `/api/health` publica `cron.weak=true`, `fingerprints=["WITHHELD_WEAK_SECRET"]`: el propio sistema declara que `CRON_SECRET` mide **< 32 caracteres**. Toda ruta fail-closed (U5) se apoya en ese secreto. | SOSPECHOSO | **SEV-2** (SEC-3) |
| `U4` | `/api/omega/heartbeat`: `observedLatencyMs=225.63` vs `latencyBudgetMs=50` ⇒ `passed=false`, y aun así los 10 motores se publican `OPERATIVO`. Además: `gpu: AMD RX 7900 XTX / NOMINAL` en un VPS sin GPU, `ISRC ES-EAR-26-39000 emitido`, `seed 987885403`, `Flota 3 vehículos`. Sin `mode`, `probed` ni `checkedAt`. | **FACHADA** | P0 (AF-2/AF-3) |
| `U13` | `/confianza` responde 200 (104 633 B) y publica **0 filas** con "Ledger no leído (missing)". Honesta pero inútil: 24 filas en el repo (18 previas + 6 de esta sesión), 0 publicadas. | SOSPECHOSO | P1 |

Causa raíz de U13 **confirmada por lectura**: `.dockerignore:4` excluye `.antigravity` en la raíz. Docker **no** permite re-incluir un hijo de un directorio excluido, así que `!.antigravity/evidence/ledger.jsonl` **no funcionaría** (el análisis del Arquitecto es correcto). La reubicación a `src/data/evidence/ledger.jsonl` es la vía válida: esa ruta no está ignorada (`.dockerignore` líneas 1-36 verificadas).

## 3bis. CONSECUENCIA DECLARADA: EL LEDGER AHORA BLOQUEA EL GATE

Esto no es un efecto colateral accidental; es el diseño, y hay que saberlo antes de correr nada:

- `scripts/verify_trust_ledger.ts:104-107` falla si hay **una** `FACHADA` activa (`NO_FACADE`).
- `src/lib/evidence/evidence-ledger.ts:269-272` añade `blockReasons`: "FACHADA activa en el ledger: U4 (§4 · el deploy queda bloqueado)".
- `package.json:71` — `gate:prepush` incluye `npm run verify:confianza` como **última** puerta.

⇒ **`gate:prepush` y `verify:confianza` pasarán a Exit 1** en cuanto esta evidencia esté en disco. Un deploy quedará bloqueado hasta que la causa desaparezca.

**Por qué se ha anclado igualmente:** ocultar la fachada para "cerrar bonito" está prohibido (INC-2) y el bloqueo *es* el mensaje (§4). El heartbeat publica `gpu.adapter:"AMD RX 7900 XTX"` y `status:"NOMINAL"` **hardcodeados** en `omegaOmniOrchestrator.ts:349-354`, y `network.status:"SIN_CONFIRMAR"` hardcodeado en `:357`; la interfaz `OmegaHealthMatrix` (`:97-105`) no admite `mode`, `probed` ni `checkedAt`. Es simulación presentada como producción (AF-2), y además `certification.passed=false` en vivo (225,63 ms vs presupuesto de 50 ms) mientras los 10 motores se publican `OPERATIVO`.

**Secuencia exacta de desbloqueo (sin borrar evidencia, todo append-only):**

1. `omegaOmniOrchestrator.ts`: añadir a `OmegaHealthMatrix` los campos `mode: "REAL" | "SIMULADO"`, `probed: boolean`, `checkedAt: string`; declarar `mode: "SIMULADO"` y `probed: false` mientras GPU y red sigan siendo valores de referencia, y retirar `status:"NOMINAL"` del bloque GPU (o sustituirlo por `"SIN_SONDA"`).
2. Añadir fila **nueva** `U4` con `supersedes:"U4"` y estado `SOSPECHOSO`, describiendo el código ya corregido (mismo patrón que la fila `AF-1` del 2026-10-30T14:54Z). La `FACHADA` pasa a historial: el append-only se respeta, la evidencia no se destruye.
3. `npm run verify:confianza` → Exit 0. Entonces sí: `gate:prepush`, deploy, y sonda G-6 para promover a `VERIFICADO`.

**Compatibilidad de las 6 filas nuevas con el parser** (verificada contra `parseLine`, l.134-208): `id` se lee de `claim` ✔; `ts` ISO-8601 UTC ✔ (`/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/`); `state` dentro del vocabulario cerrado ✔; `exit` no numérico se degrada a `null` sin generar anomalía ✔ (mismo caso que la fila `TOOLING-CLINE-TERMINAL` previa); ninguna fila es `VERIFICADO`, luego no aplica la degradación por quíntupla ✔. **0 anomalías de formato esperadas y 1 `blockReason` (U4).**



## 4. DEFECTOS ADICIONALES DETECTADOS EN EL DOCKERFILE (no reportados)

| Línea | Defecto | Norma |
|---|---|---|
| 24 | `RUN ./node_modules/.bin/prisma generate \|\| npx prisma generate \|\| true` — el `\|\| true` **absorbe cualquier fallo**: una imagen que no puede generar el cliente Prisma se construye igual y se marca verde. | AF-5 (verde por defecto) |
| 19 | `npm install --include=dev --legacy-peer-deps --no-audit` en el builder: resuelve dependencias desde cero en cada build e ignora conflictos de peers. | SEC-6 (exige `npm ci` con lockfile) |
| 1, 29 | Etiqueta flotante sin digest ni minor. | SEC-6 / build no determinista |
| — | No hay `HEALTHCHECK` en la imagen runner. | SEC-5 |
| — | No hay aserción de versión de Node en build. | EP-3 (promesa sin prueba) |

Punto positivo medido: `USER nextjs` (l.63), contenedor no-root, y el sello `ARG EAR_BUILD_SHA` existe (aunque Coolify no lo pasa: `buildSource=coolify-source-commit`).

## 5. GATES (SIG-1: un solo FAIL ⇒ máximo SOSPECHOSO)

| Gate | Resultado | Motivo |
|---|---|---|
| G-0 | **FAIL** | `Test-Path` inejecutable (terminal zombie). Lectura directa OK en 7 ficheros. |
| G-1 typecheck | **SIN_EVIDENCIA** | `tsc --noEmit` no ejecutable. El `Exit 0` del reporte del Arquitecto no es reproducible en esta sesión. |
| G-2 lint | **SIN_EVIDENCIA** | ídem. |
| G-3 gate:prepush | **SIN_EVIDENCIA** | ídem. |
| G-4 audit:ssot | **SIN_EVIDENCIA** | ídem. |
| G-5 sim:event | **SIN_EVIDENCIA** | ídem. |
| G-6 sonda HTTP | **PASS parcial** | 3 URLs sondeadas (`/api/health`, `/api/omega/heartbeat`, `/confianza`). `sha256` del cuerpo **no calculable** sin shell. |
| G-7 deploy:freshness | **FAIL** | `f54e2a4 ≠ cefac7cd`. |
| G-8 premortem | **PASS** | §8. |

**Estado del bloque: `SOSPECHOSO`.** No se firma `VERIFICADO` ni se cierra la tarea.

## 6. SCAFFOLD PARA LA SESIÓN NUEVA (una sola acción atómica)

Orden de ejecución, sin desviación:

1. **Rotación inmediata** (CEO, 5 min): regenerar `CRON_SECRET` con ≥ 32 caracteres en Coolify y GitHub Secrets. Re-sondear `https://www.productoraear.com/api/health` hasta ver `cron.weak=false` y una huella `sha256:` con valor.
2. **Sonda de runtime** — `src/app/api/support/health-check/route.ts` (role: `cron`, **no** público, SEC-2): añadir al JSON `runtime: { node: process.version, platform: process.platform, arch: process.arch }`. Así la versión de Node se prueba con un token, sin publicar el fingerprint del stack en un endpoint abierto.
3. **Aserción de versión en build** — `Dockerfile`, tras las dos líneas `FROM`:

   ```dockerfile
   RUN node -e "const [a,b]=process.versions.node.split('.').map(Number); if(a===22 && b<23){console.error('NODE_BASE_IMAGE_VULNERABLE: '+process.versions.node);process.exit(1)}"
   ```

   Falla cerrado: si la imagen base no trae el parche, el build **no** se construye (AF-5).
4. **Determinismo** — sustituir `node:22-alpine` por `node:22.23.4-alpine` (o el digest) y activar en Coolify *Pull latest image* / `--pull`.
5. **Drift** — `package.json`: `"engines": { "node": ">=22.23.4" }`.
6. **U13** — mover el ledger a `src/data/evidence/ledger.jsonl` (`git mv` + copia en build), actualizar el lector de `/confianza` y re-sondear hasta `source=live` con más de 0 filas.
7. Solo entonces: `npm run typecheck` → `npm run lint` → `npm run gate:prepush` → `npm run verify:pricing` → `npm run verify:confianza` → `node .antigravity/omega.js complete <ID>`.

Nada de esto se ha ejecutado aquí: **no se escribe código que no se pueda compilar** (G-1 es la única salida autorizada).

## 7. RETO_ESPEJO (criterio más duro que el del reporte)

El reporte dice "no hace falta tocar nada". Criterio que sí se puede verificar:

> **Ningún deploy es verde si el health no declara la versión de runtime y el build no falla cuando la imagen base está por debajo del mínimo parcheado.**

Comandos que lo prueban: `npm run probe:runtime` (a construir: GET autenticado a `/api/support/health-check`, assert `runtime.node >= 22.23.4`) y `docker build --pull` con la aserción del paso 3 devolviendo Exit 0. Hoy ambos son `❌ NO_EXISTE`.

## 8. PREMORTEM (G-8 · cinco respuestas concretas)

1. **¿Cumple el `done_when`?** No. El encargo era auditar la alerta; la auditoría concluye `SIN_EVIDENCIA` sobre la exposición real. Entregar "estás parcheado" habría sido un primo hermano del `done_when`, no el `done_when`.
2. **¿Qué asunciones frágiles lo sostienen?** Que Coolify haga pull de la imagen base; que el `Exit 0` de `tsc` del reporte sea reproducible; que `cefac7cd` exista y sea descendiente de `f54e2a4`; que el ledger del repo sea el que se despliega.
3. **¿Qué alternativa descarté y por qué técnico?** Editar el `Dockerfile` y `package.json` aquí mismo. Descartada porque sin terminal no hay `tsc`, ni `docker build`, ni `git status`: sería un cambio de deploy a ciegas, y CHG-3 exige rollback ensayado, no teórico.
4. **¿Qué se rompe y cómo lo detectamos antes que el cliente?** Si el rebuild toma una 22.x con regresión de ABI, el runner puede fallar al arrancar (`docker-entrypoint.cjs` + Prisma). Detección: `HEALTHCHECK` + sonda G-6 sobre `/api/health` en los 2 minutos siguientes al deploy, con `buildSha` distinto del anterior como confirmación de artefacto nuevo.
5. **¿Qué acepto al firmar esto?** Que la ventana de exposición al CVE sigue **abierta y no medida**, y que `CRON_SECRET` débil permite intentos de fuerza bruta contra la ruta de cron mientras no se rote.

## 9. PRÓXIMA ACCIÓN ATÓMICA

**Abrir New Task (+) en Cline** (el descriptor de terminal de esta sesión está muerto: 5/5 comandos sin salida, incluida `node -v`) y ejecutar el paso 1 de §6: rotación de `CRON_SECRET` + `npm run typecheck`.

