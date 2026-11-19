---
name: superpowers
description: Orquestador local nativo de ejecución en dominó para EAR OS (/goal -> brainstorm -> graphify -> ponytail -> spec -> plan -> agent teams -> build TDD -> unslop -> verify 17-gates -> ship), alineado con AGENTS.md v12.1 y omega.js.
---

# Superpowers Local Domino Workflow (EAR OS)

> **Nota de Transparencia Baseline (R1):** El paquete externo `obra/superpowers` **NO estaba instalado en el repositorio base** ni en `.agents/skills/` al inicio de esta evaluación (únicamente existían banners nominales en utilidades Python). Este archivo define la **implementación local nativa de EAR OS**, que orquesta en cadena de dominó las 7 skills residentes en `.agents/skills/`, el grafo AST `graphify`, el motor `.antigravity/omega.js`, las reglas HITL de `AGENTS.md` y el arnés de 17 compuertas.

---

## Principio de Ejecución en Dominó (`/goal`)
Cada fase valida su criterio de salida y dispara automáticamente la siguiente **sin detenciones intermedias**, deteniéndose **únicamente** ante:
1. Un freno constitucional HITL de `AGENTS.md` § 2 (0% prohibido, 5% HITL total o 25% revisión humana).
2. Un fallo mecánico en cualquiera de las 17 compuertas, `typecheck`, `lint` o `audit:ssot`.
3. Una mutación propuesta sobre la Zona Cero (`src/lib/constants/ear-os-ssot.ts`), prohibida sin orden directa del CEO.

---

## Secuencia Encadenada de 7 Pasos

### Paso 1 · `BRAINSTORM` (`grill-me`)
- Leer el checkpoint vigente en `.antigravity/brainstorms/*_DECISIONS.md` antes de preguntar o asumir reglas de negocio.
- Si existe ambigüedad nueva no resuelta (tarifas, territorio, HITL, seguridad), capturar las 4 dimensiones socráticas y persistirlas en `.antigravity/brainstorms/YYYY-MM-DD_<tema>_DECISIONS.md`.

### Paso 2 · `GRAPH & REUSE` (`graphify` + `ponytail`)
- Consultar primero `graphify query "<concepto>"`, `graphify path` o `graphify explain` sobre `graphify-out/graph.json` antes de lecturas masivas de archivos.
- Aplicar el **Filtro de 6 Preguntas de `ponytail`** (`LIGHT` / `FULL` / `ULTRA`): reutilizar `@/lib/constants/ear-os-ssot`, catálogos existentes y utilidades nativas de Next.js 16 (reducción objetivo 25–30% LOC, cero wrappers vacíos).

### Paso 3 · `SPEC & PLAN` (`spec-driven-development` + `planning-and-task-breakdown`)
- Definir contratos TypeScript estrictos (cero `any`, esquemas Zod `.strict()`, `EnvSource` inyectable, respuestas `UNCONFIGURED` / `HITL_BLOCKED` fail-closed) y criterios de aceptación falsables.
- Descomponer en rodajas atómicas de **<= 5 archivos (`CHG-4`)** ordenadas por dependencia en `.antigravity/tasks_queue.json` (`PENDING` / `QUEUED`).

### Paso 4 · `AGENT TEAMS & BUILD` (`test-driven-development` + `unslop`)
- **Paralelismo seguro (Solo Lectura / Alcances Disjuntos):** Usar subagentes en paralelo para exploración, auditoría y diseño de pruebas de caja opaca.
- **Serialización de Escritura (`omega.js`):** Debido al slot único de `.antigravity/MISSION_ACTIVE.json`, ejecutar mutaciones de cola secuencialmente (`node .antigravity/omega.js next` -> implementar -> verificar -> `complete`).
- **UI y Estética (`unslop` + Taste Engine):** Aplicar los 9 pases OLED (`#030305`/`#050507`, acento único, `lucide-react`, tipografías canónicas) y validar `npm run audit:slop`, `audit:webgl` y `audit:contrast:core` al tocar `src/**`.

### Paso 5 · `VERIFY & GATE` (`verification-and-testing` + 17 Compuertas)
- Ejecutar obligatoriamente mediante **`npm`** (nunca `pnpm`, `yarn` o `bun`):
  1. `npm run typecheck` (Exit Code 0)
  2. `npm run lint` (0 errores)
  3. `npm run audit:ssot` (integridad intacta de `ear-os-ssot.ts`)
  4. `node scripts/run_sv_protocol_15_gates.cjs` (17/17 PASS)
- Respetar `.antigravity/ARCHITECT_APPROVAL.json` (`worker_self_approval: false`) y aportar `task.test` falsable en `.antigravity/omega.js complete <ID>`.

### Paso 6 · `GRAPH REFRESH` (`graphify`)
- Tras cualquier cambio de código, ejecutar `graphify update .` (con `GRAPHIFY_VIZ_NODE_LIMIT=0`) para mantener `graphify-out/graph.json` sincronizado.

### Paso 7 · `SHIP` (Coolify Bare-Metal Offload)
- Verificar peso e higiene Git (`npm run verify:git-pack`, repo < 50 MB, cero secretos o PII `INV-14`) y ejecutar `npm run gate:prepush`.
- Delegar el build Docker a GitHub Actions -> GHCR (`.github/workflows/deploy-ghcr.yml`) protegiendo el VPS Coolify (`1 vCPU / 4 GB RAM`) y verificar `/api/health` + `prod_deploy_freshness.cjs`.

---

## Guardrails Constitucionales Inviolables
- **SSOT Intocable:** `src/lib/constants/ear-os-ssot.ts` (350 € Edwin Agudelo `e78903`, 1,50 €/km desde Méntrida, 100 € depósito, 14.250 € techo B2G, split 80/10/10) es de solo lectura.
- **Límites HITL (`AGENTS.md` § 2):** Nunca automatizar cierre contractual sin consentimiento bilateral (0%), litigios/cancelaciones/B2G > 5.000 €/VIMUME clínico (5%), ni depósitos Price-Lock o logística > 300 km sin revisión humana (25%).
- **Aislamiento de Proveedores:** Mantener el territorio canónico de Eduardo Martínez / Otzarreta exclusivamente en **Derio (Bizkaia / Txorierri / Gran Bilbao)** y la política `evaluateProviderMediaDeliveryPolicy` para fichas gratuitas (`+34 693 693 048`).
