# REPORTE EJECUTIVO (INV-23) · REPARACIÓN QUIRÚRGICA DE LOS 4 P0

**Fecha:** 2026-11-11 · **Ejecutor:** Cline ("El Obrero") · **Base medida:** `http://127.0.0.1:3007` · **Ficheros tocados:** 5 (CHG-4)

## 1 · Resumen de 5 líneas

1. **Qué cambió:** la ruta del dinero ya no responde `500`; el presupuesto que excede el techo se rechaza en vez de recortarse en silencio; la fecha se **bloquea de verdad** antes de abrir Stripe; el WhatsApp lleva el **SHA-256 del presupuesto** y el enlace de pago.
2. **Qué riesgo desaparece:** la sobreventa (82 de 100 compradores podían pagar por el mismo sábado) y la pérdida de reserva por saturación de la pasarela (25 de 100 compradores recibían 500).
3. **Comando que lo prueba:** `node scripts/audit_estres_estadio.mjs --concurrency=100 --fecha=2027-10-16 --artist=edwin-agudelo --only-avalanche=true --skip-quotes=true` → `{200:1, 409:99, 5xx:0}` · `contratoP03=CUMPLE`.
4. **Qué NO está probado:** la rama de candado con PostgreSQL real (`G-5` marcado `SIN_EVIDENCIA`: la DB no es alcanzable en local, el motor operó en fallback offline) y el `INP` de producción (`576 ms` medido sobre servidor de desarrollo con CPU 4×, techo pesimista).
5. **Qué decisión necesito:** ninguna. Para cerrar `G-3` hay que sancionar el baseline de `audit:http` (`src/lib/career/oauth-flow.ts:50`, deuda preexistente del bloque W53_T04, **no** de esta reparación).

## 2 · Los 4 P0, en dinero y en clientes

| # | Antes (medido) | Ahora (medido) | Qué significa para el negocio |
|---|---|---|---|
| P0-1 | 100 bloqueos → `200:75 / 500:25` | `200:1 / 409:99 / 500:0` | Cero compradores se caen con un error mudo en el último paso del cobro |
| P0-2 | `100.000.000 €` se recortaba a `1.000.000 €` sin avisar | `400 PRESUPUESTO_EXCEDE_MAXIMO_LEGAL` (depósito) y `-32602` con el mismo código (MCP) | Nadie recibe una pasarela con un importe que no pidió; techo único en el SSOT |
| P0-3 | 82 checkouts para la **misma** fecha y artista | `{200:1, 409:99}`, `sobreventa=false` | No se puede vender dos veces el mismo sábado: primero el candado, después Stripe |
| P0-4 | WhatsApp sin huella (`sha256Presente=false`) | `sha256:0fbccd54…283c2` + `https://buy.stripe.com/…` (630 chars, íntegro) | El presupuesto enviado es exigible: la huella y el cobro viajan en el mismo mensaje |

## 3 · Causa raíz de los 500 (no era "Stripe")

El `catch` global convertía en `500` el error real: **`StripeRateLimitError`** (`type=rate_limit_error`, `code=rate_limit`) con el mensaje *«Request rate limit exceeded»*. Con 100 compradores a la vez, la pasarela limita y el comprador veía un 500 indistinguible de una caída del sistema. Ahora ese caso devuelve **`429 DATE_LOCK_CONTENTION`** con `Retry-After: 30` y un texto que dice exactamente qué hacer.

## 4 · Hallazgo que la orden no contemplaba (reto_espejo)

La ruta **verificaba** disponibilidad (`SELECT`) pero **nunca escribía el candado**. Con 100 peticiones simultáneas, las 100 veían la fecha libre: se midieron **82 checkouts** sobre la misma fecha y el mismo artista. Se corrigió dentro del mismo fichero autorizado, materializando el candado con `lockDateAtomically` y liberándolo si Stripe no llega a emitir el enlace (una caída de la pasarela no puede congelar la agenda).

## 5 · Puertas de verificación

| Puerta | Resultado |
|---|---|
| G-0 ficheros en disco | PASS |
| G-1 `tsc --noEmit` | PASS (Exit 0) |
| G-2 `eslint` | PASS (Exit 0 · 0 errores · 11 warnings preexistentes) |
| G-3 `run_sv_protocol_15_gates` | **16/17 · FAIL en `audit:http`** (`AUDIT_ORPHAN_HTTP=1`, `src/lib/career/oauth-flow.ts:50`) — **ratificado preexistente**: mismo fallo con mis 4 ficheros en stash |
| G-4 `audit:ssot` | PASS (hash `ebc011a0…bb29dd` == referencia · ZONA CERO intacta) |
| G-5 `sim:event` | `SIN_EVIDENCIA` (requiere PostgreSQL alcanzable) |
| G-6 `audit:omega-rojo` | PASS · **8/8 P0 VERIFICADO** · `VERDE` · 14/20 |
| G-7 CLS / INP | CLS `0` (presupuesto `0,05`) · INP `576 ms` sobre dev con CPU 4× (techo pesimista, no certifica p75 de producción) |
| G-8 Premortem | Firmado en `CLINE_EXECUTION_LOG.md` |

## 6 · Deuda declarada (no maquillada)

- **P1-2** sigue abierto: `xss`, `sqli` y `traversal` se aceptan en el MCP concierge (fuera del alcance de esta orden de 4 P0).
- **P1-1** sigue abierto: el webhook de WhatsApp responde `413` antes de `401` en un cuerpo sin firma.
- El candado se certificó sobre el **writer offline serializado**; la transacción interactiva Prisma está tipada pero **sin medición** en esta sesión.
- Si el proceso muere entre el candado y Stripe, la fecha queda en `PENDING_DEPOSIT` hasta `releaseStalePendingLocks` (TTL 30 min): ventana máxima de falso bloqueo.
