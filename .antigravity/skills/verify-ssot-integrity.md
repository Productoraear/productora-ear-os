# SKILL · `verify-ssot-integrity` — Cierre atómico S-Class (DoD 8/8 + Premortem 5)
**Versión**: 1.0 · **Fecha**: 2026-11-04 · **Norma rectora**: `.clinerules` V10_SIGMA (§4bis, §10, §12, §15)
**Invocación obligatoria**: al final de CADA bloque, antes de `node .antigravity/omega.js complete <ID>`.

> **Ley del auditor real (§15)**: un ítem del scorecard sin comando ejecutable en disco vale **0 puntos**, no "pendiente".
> **Regla de oro**: sin Exit Code capturado en un fichero, el bloque se sella `SOSPECHOSO` con los huecos a la vista (SIG-2). Nunca `VERIFICADO` por lectura.

---

## FASE 1 · Núcleo duro (4 puertas, binarios reales)

Usa **siempre** el binario real de `node_modules`, **jamás `npx`**: `omega.js:115-120` documenta que `npx tsc` descarga el paquete impostor `tsc`.

| # | Criterio | Comando literal | Umbral |
|---|---|---|---|
| 1 | Tipos | `node ./node_modules/typescript/bin/tsc --noEmit` | `exit 0` |
| 2 | Lint de los ficheros tocados (sin exclusiones silenciosas) | `node ./node_modules/eslint/bin/eslint.js "RUTA1" "RUTA2"` | `exit 0`, 0 warnings |
| 3 | Cero `any` implícito en el diff | revisión de `git diff -U0` sobre los ficheros de `task.files` | 0 ocurrencias (juicio humano: **no existe alias npm**, por tanto 0 puntos si no se adjunta el diff) |
| 4 | Cero TODO/FIXME/placeholder en ruta de venta | `findstr /N /R "TODO FIXME" "RUTA"` | 0 líneas |

**Puerta 2 ampliada (invariante `omega.js:134`)**: si el bloque tocó un fichero que **no** está en `task.files`, ese fichero **no pasa por el lint de cierre**. Antes de firmar, ejecuta `eslint` también sobre él y **anótalo como hallazgo** (`D-02`).

---

## FASE 2 · Anti-fachada y trazabilidad (Next.js App Router)

| # | Qué se verifica | Cómo |
|---|---|---|
| 5 | `params` async | en toda `page.tsx`/`route.ts` dinámica: `const resolvedParams = await params;` |
| 6 | Contrato de retorno | toda Server Action / Route Handler devuelve `{ ok: boolean; error?: string; data?: T }` y envuelve en `try/catch` hermético |
| 7 | 0 botones huérfanos | cada CTA tiene `href`, Server Action, Stripe o WhatsApp `+34 693 693 048` → `npm run audit:cta-matrix` · `npm run verify:provider-ctas` |
| 8 | 0 rutas de salud mentirosas (AF-1) | el JSON de salud declara `probed`, `source`, `mode`, `checkedAt` |

---

## FASE 3 · Seguridad (SEC-3, SEC-7, INV-06)

| # | Qué se verifica | Cómo |
|---|---|---|
| 9 | 0 secretos en cliente | `STRIPE_SECRET_KEY`, `POSTGRES_URL`, tokens n8n **solo** en servidor; `NEXT_PUBLIC_` solo URLs |
| 10 | `verified:true` solo con teléfono real | `npm run audit:phone` → 0 falsos positivos |
| 11 | Rutas nuevas nacen cerradas | existe el caso negativo (401/403/503) antes del camino feliz |

---

## FASE 4 · Las 5 preguntas del Premortem (G-8, §10 INC-3)

Responde **por escrito**, con nombre de fichero y línea. Genérico = no válido.

1. **Propósito original** — ¿Cumple el `done_when` o he entregado un primo hermano de lo pedido?
2. **Datos y asunciones** — ¿Qué premisas frágiles sostienen esto? (marca los literales sin `provenance`: AF-4)
3. **Alternativas descartadas** — ¿Qué otra arquitectura evalué y por qué la descarté por motivo **técnico**, no por comodidad?
4. **Resiliencia** — ¿Qué se rompe en el navegador del cliente o en PostgreSQL, y cómo lo detectamos **antes** que el cliente?
5. **Consecuencia aceptada** — ¿Qué firmo como propio al cerrar esto (dinero, RGPD, fecha bloqueada, reputación)?

---

## FASE 5 · Scorecard DoD 8/8 (gate keeper final)

| # | Criterio de cierre atómico | Comando / evidencia | Estado |
|---|---|---|---|
| 1 | `tsc --noEmit` | `node ./node_modules/typescript/bin/tsc --noEmit` | [ ] |
| 2 | 0 `any` implícito en el diff | `git diff -U0` + revisión | [ ] |
| 3 | Botonería conectada (0 fachadas) | `npm run audit:cta-matrix` · `npm run verify:provider-ctas` | [ ] |
| 4 | 0 TODO/FIXME/placeholder | `findstr` sobre `task.files` | [ ] |
| 5 | Motores de dinero sin hardcodeo | `npm run verify:budget` · `npm run verify:pricing` | [ ] |
| 6 | Split 80/10/10 inmutable | `npm run audit:ssot` | [ ] |
| 7 | Depósito 100,00 € íntegro y deducible | `npm run sim:event` (idempotencia: 1 fila por `stripeSessionId`) | [ ] |
| 8 | Rider acústico < 75 dB SPL · 12 W/pax | `node scripts/verify_sonometro_pwa.cjs` | [ ] |

**REGLA DE SALIDA**: solo si los 8 ítems están `[OK]` **y** el Premortem de la Fase 4 está adjunto, el bloque pasa a `COMPLETED`.
Si un ítem no tiene comando ejecutado, queda `SIN_EVIDENCIA` y el sello es `n/8` — se firma igual, con la lista de huecos a la vista. Declarar 8/8 sin log es el fraude máximo del sistema.

---

## Registro obligatorio (WF-3) — NO crear un fichero nuevo

El registro canónico es **`CLINE_EXECUTION_LOG.md`** (append-only, jamás se sobrescribe). No existe ni debe existir un `EXECUTION_LOG.md` paralelo: dos registros = dos verdades = memoria rota.

Entrada a añadir al final, con este formato exacto:

```
### <ISO-8601> · <TASK_ID> — <título en una línea>
- ARCHIVOS:        rutas exactas tocadas
- HECHO:           qué escribe de verdad, con ruta:línea
- COMANDOS:        cada comando con su Exit Code y el nombre del .log que lo prueba
- HALLAZGO (❌ cerrado): defecto medido y cómo se cerró
- HALLAZGO (⚠️ abierto): defecto declarado con dueño y siguiente comando
- Ω-DIAMANTE:      { score: n/8 o n/20, pendientes[] }
- PREMORTEM:       la respuesta más incómoda de las 5, en una línea
- SIGUIENTE PASO:  una sola acción atómica
```
