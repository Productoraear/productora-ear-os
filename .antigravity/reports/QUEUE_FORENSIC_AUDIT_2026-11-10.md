# Auditoría forense de cola · 2026-11-10

**Comando de la cifra**: `node scripts/audit_queue_forensic.cjs --debt-only`
**Fuente única**: `.antigravity/tasks_queue.json` (array vivo `tasks[]`), no `_meta`.
**Regla de porcentaje**: escrito + tipos + arnés Exit 0 = 100 %. Escrito con archivos
declarados ausentes o sin arnés = 50 %. Sin escribir = 0 %.
**El % mide mi parte (obrero). La firma vive en `ARCHITECT_APPROVAL.json`.**

> **Corrección de la primera versión de este informe.** El script emitía `100%` en
> tareas que tenían archivos declarados **ausentes** (W53_T14, W53_T18, W53_T32,
> W53_T34). Era un falso verde fabricado por el propio auditor. Corregido: si falta
> un archivo declarado, el techo es 50 % y se lista el ausente.

## Estado medido de la cola

| Métrica | Valor medido |
|---|---|
| Tareas vivas en `tasks[]` | **40** |
| Abiertas (PENDING + QUEUED + BLOCKED_CEO) | **39** |
| Cerradas en `tasks[]` | 1 |
| Histórico en `completed[]` | 28 |
| Completitud media de lo abierto | **12,8 %** |
| Buckets | `SIN_EMPEZAR` 33 · `PARCIAL` 4 · `CANDIDATO_A_FIRMA` 3 |
| `_meta.total_tasks` declarado | 34 (desactualizado: el real es 40) |
| `_meta.total_pending` declarado | 39 (consistente con la medición) |

## Desglose de tareas no completadas

| ID | ESTADO | ARCHIVOS EN DISCO | % REAL | DEUDA / BLOQUEANTES |
|---|---|---|---|---|
| W53_T02 | PENDING | 0/2 | 0% | ausentes: `token-vault.ts`, `verify_token_vault.ts` |
| W53_T03 | PENDING | 0/2 | 0% | ausentes: `connectors/types.ts`, `sync-orchestrator.ts` |
| W53_T04 | PENDING | 0/2 | 0% | ausentes: `connect/[platform]`, `callback/[platform]` |
| W53_T05 | PENDING | 0/2 | 0% | ausentes: `cron/career-sync`, `career/schedule.ts` |
| W53_T06 | PENDING | 1/1 | 100% (CANDIDATO_A_FIRMA) | el SSE emite `source:"demo"` sobre totales fijos |
| W53_T07–T11 | PENDING | 0/1 c/u | 0% | conectores Spotify/YouTube/Meta/TikTok/otros ausentes |
| W53_T12 | PENDING | 0/2 | 0% | `csv-importer.ts` + ruta de import ausentes |
| W53_T13 | PENDING | 0/2 | 0% | webhook por plataforma + `manual.ts` ausentes |
| W53_T14 | PENDING | 1/3 | 50% | ausentes: `CareerNav.tsx`, `departments.ts` |
| W53_T15 | PENDING | 1/1 | 100% (CANDIDATO_A_FIRMA) | presencia ≠ sustancia: sin arnés propio |
| W53_T16 | PENDING | 0/2 | 0% | conexiones: `page.tsx` + `ConnectionCard.tsx` ausentes |
| W53_T17 | PENDING | 0/2 | 0% | catálogo + `api/career/releases` ausentes |
| W53_T18 | PENDING | 1/2 | 50% | ausente: `src/lib/career/storage.ts` |
| W53_T19 | PENDING | 0/2 | 0% | distribución + `release-pipeline.ts` ausentes |
| W53_T20 | PENDING | 0/1 | 0% | analítica ausente |
| W53_T21 | PENDING | 0/2 | 0% | social + `api/career/posts` ausentes |
| W53_T22–T27 | PENDING | 0/1–0/2 | 0% | giras, finanzas, legal, marketing, fans, merch ausentes |
| W53_T28 | PENDING | 0/2 | 0% | equipo + `rbac.ts` ausentes |
| W53_T29 | PENDING | 0/2 | 0% | asistente + `api/career/assistant` ausentes |
| W53_T30 | PENDING | 0/1 | 0% | `alerts.ts` ausente |
| W53_T31 | PENDING | 0/1 | 0% | `seed_career_demo.ts` ausente |
| W53_T32 | PENDING | 1/2 | 50% | ausente: `studio/artist/onboarding/page.tsx` |
| W53_T33 | PENDING | 0/2 | 0% | `audit-log.ts` + `docs/CAREER_SECURITY.md` ausentes |
| W53_T34 | PENDING | 1/2 | 50% | ausente: `scripts/audit_career_os.cjs` |
| W52_T06_RECOVER_99_DIAS | BLOCKED_CEO | — | — | bloqueada por decisión del CEO |
| W54_T01_ASVS_L3 | QUEUED | 0/1 | 0% | `audit_asvs_l3_payloads.cjs` ausente |
| W54_T02_LIGHTHOUSE_X4 | QUEUED | 0/1 | 0% | `audit_lighthouse_x4.cjs` ausente |
| W54_T03_CWV_P75 | QUEUED | 1/1 | 100% (CANDIDATO_A_FIRMA) | — |
| W54_T04_CISQ_ISO5055 | QUEUED | 0/2 | 0% | `audit_cisq_structural.cjs` + ISO 25010 ausentes |
| W54_T05_RICH_RESULTS | QUEUED | 0/1 | 0% | `audit_rich_results.cjs` ausente |
| W54_T06_SIMILARITY_472 | QUEUED | 0/1 | 0% | `audit_similarity_corpus.cjs` ausente |

**Conclusión**: 33 de 39 tareas abiertas están **sin empezar** (0 %). No es un problema
de porcentaje: la Wave 53 nunca se ejecutó. Sólo 3 tareas tienen derecho a la firma.

## Deuda oculta detectada

1. `W53_T01` — migración SQL física **existe** (`prisma/migrations/20261110195500_add_career_os_models/migration.sql`,
   excepción en `.gitignore:104` para que viaje a Coolify). → ya no es deuda.
2. Ledger — 27 filas `VERIFICADO` sin `url` degradadas automáticamente (EP-1). Bloquean
   `npm run verify:confianza` y por tanto `gate:prepush`. → saneadas por `scripts/ledger_reconcile_legacy.cjs`.
3. `W53_T06` — la única ruta de métricas de carrera emite `source:"demo"` sobre totales fijos.
   Cliente Prisma recién generado — verificación de motor en `CLINE_EXECUTION_LOG.md` (sección W53_T01):
   `node ./node_modules/prisma/build/index.js generate` → Exit 0 sin `--no-engine`.
4. Prisma `--no-engine`: **no aparece** en `package.json` (verificado con `Select-String -Pattern 'no-engine'` → 0 hits).

## Gates ejecutados en esta sesión (literal)

```
$ node scripts/audit_queue_counter_integrity.cjs                      -> QUEUE_COUNTERS=CONSISTENT (Exit 0)
$ node scripts/audit_queue_forensic.cjs --debt-only                   -> 40 vivas / 39 abiertas (Exit 0)
$ node scripts/ledger_reconcile_legacy.cjs --apply                    -> LEDGER_RECONCILE=APPLIED · 27 AMEND · 0 degradadas
$ node ./node_modules/tsx/dist/cli.mjs scripts/verify_trust_ledger.ts -> degraded=0 · failed=[] (Exit 0)
$ node ./node_modules/tsx/dist/cli.mjs scripts/verify_concierge_saga_contract.ts -> PASS 7/7 (Exit 0)
$ npm run typecheck                                                   -> Exit 0
$ npm run audit:contrast:core                                         -> TOTAL_FALLOS=0 · VERDICT=PASS
$ npm run gate:prepush                                                -> GATE_EXIT=0
```

**Contraste**: 2 fallos AA reales **preexistentes** detectados por el gate y corregidos
en origen (no se aflojó el gate, no se tocó el SSOT):
- `/fincas` · 1,09:1 — el badge `42/100` heredaba el oro del botón activo → pasa a
  `bg-black/25 text-black` **sólo** en estado activo.
- `/` · 4,50:1 (límite exacto) — el badge del carril VIMUME `#8b5cf6` sobre OLED → el
  texto se aclara un 32 % con `color-mix`; punto y borde conservan el color de marca.

## Despliegue a producción (Coolify) — ESTADO REAL

| Paso | Comando | Resultado medido |
|---|---|---|
| 1. Commit + push a `origin/main` | `git push origin main` | ver sección de entrega |
| 2. Disparo del webhook de Coolify | `node scripts/trigger_coolify_deploy.cjs` | requiere `COOLIFY_DEPLOY_WEBHOOK` (+ `COOLIFY_API_TOKEN`) |
| 3. Verificación en vivo | `npm run verify:confianza:prod` | requiere el dominio sirviendo la build nueva |

**Ningún despliegue se declara «hecho» sin el código HTTP del webhook y el sondeo HTTP
de la URL pública.** Si el webhook no está en el entorno, el script sale `Exit 2` a
propósito: prefiere fallar a imprimir un verde falso.

### Diagnóstico del bloqueo (medido contra la API de GitHub, 2026-11-10 22:52Z)

```
$ node scripts/trigger_coolify_deploy.cjs
  [PASS] Conectividad HTTP confirmada (166ms) · HTTP 302 -> panel Coolify v4 operativo
  [FAIL] COOLIFY_DEPLOY_WEBHOOK no definido en el entorno.
  Despliegue NO disparado (Exit 2)

$ GET /repos/.../actions/runs  (público)
  RUN 42864097494  834e8fb7  failure
    contract-gate    -> success
    typecheck-gate   -> success
    build-and-push   -> success
    production-smoke -> failure
      STEP_FAIL: Smoke de produccion (ruta viva + landing real)
      STEP_FAIL: Frescura del despliegue (sha vivo == sha construido)
  RUN 42789462370  77b8cee1  failure   (idéntico patrón)
```

**Causa raíz**: la imagen **sí** se construye y se publica en GHCR, pero el paso
`Trigger Coolify Webhook Deployment` es `continue-on-error` y depende de
`secrets.COOLIFY_WEBHOOK_URL` + `secrets.COOLIFY_API_TOKEN` (el propio workflow
documenta en su línea 139 que el token **no existe** en el repo). Resultado: producción
sigue sirviendo la build anterior y el `production-smoke` la caza correctamente
(`/confianza` responde `source=missing`, la home no contiene el `color-mix` nuevo).

**Estado de `main`**: `91e670ad`. Producción verificada: `HTTP 200` pero **build
antigua** (`verify:confianza --prod` → `OK=false`, `ROWS=0`). Lo que falta **no es
código**: es un secreto de despliegue que sólo el CEO puede inyectar.


