# AUDITORÍA DE ESTRÉS EN NAVEGADOR VIVO — ESCENARIO GIRA ESTADIO

> **Rol del emisor:** Auditor Hostil de Resistencia Extrema (rol de constructor revocado).
> **Objetivo auditado:** `http://127.0.0.1:3007` (build local del commit `249208b4` + working tree W55).
> **Arnés ejecutable:** `scripts/audit_estres_estadio.mjs` (cuatro vectores, medición propia).
> **Evidencia cruda:** `.antigravity/evidence/estres_estadio_report.json` · `.antigravity/evidence/w55_t02_estres.txt`.
> **Fecha de medición:** 2026-11-11 · Chrome 157.0.8103.40 · Node v26.12.1 · Windows.

**VEREDICTO GLOBAL: `SOSPECHOSO`** — la plataforma **NO está lista para tráfico masivo**. No por rendimiento (que resistió), sino por **un 25 % de fallos 500 en el camino del dinero** y por **un vallado que recorta en silencio** en la frontera del presupuesto.

| Vector | Estado | Resumen en una línea |
|---|---|---|
| V1 · Avalancha | `SOSPECHOSO` | 100 cotizaciones intactas al céntimo, pero **25 de 100 bloqueos de fecha devuelven HTTP 500** |
| V2 · INP / CLS | `SOSPECHOSO` | **CLS = 0** (excelente) · **INP = 1.184 ms** (23,7× el presupuesto de 50 ms) |
| V3 · Payloads hostiles | `SOSPECHOSO` | 6/12 rechazados limpiamente; **4 payloads que debían ser rechazados fueron aceptados** |
| V4 · Conversión WhatsApp | `SOSPECHOSO` | Enlace íntegro (419 chars, centralita correcta, 80/10/10, depósito 100 €) **sin el SHA-256 exigido** |

---

## 1 · Puntos de quiebre exactos

### Q1 — `HTTP 500` en 1 de cada 4 bloqueos de fecha (CRÍTICO · ruta del dinero)

```
POST /api/reservar/solista/deposit
{ "fecha":"2026-12-19", "totalEstimado": …, "idempotencyKey":"gira-estadio-…" }
100 peticiones simultáneas  →  {"200": 75, "500": 25}   · 15.959 ms de pared
Cuerpo del 500: {"error":"Error al crear el depósito de reserva"}
```

- **Causa raíz (medida, `route.ts:332-338`):** el `catch` global de la ruta convierte cualquier excepción en `500` genérico. No es un problema de Stripe: los 75 que llegaron a Stripe devolvieron `url` de checkout válida.
- **Consecuencia comercial:** 25 compradores de cada 100 pierden la reserva en el momento de pagar.
- **Lo que NO se puede afirmar:** el `console.error('[SOLISTA DEPOSIT ERROR]', …)` viaja a la consola del servidor, no al cuerpo. **`SIN_EVIDENCIA` sobre el tipo exacto de excepción.** Siguiente paso atómico: instrumentar ese `catch` con `errorCode` público y replay monohilo.

### Q2 — `INP = 1.184 ms` con 4× CPU + Slow 4G (CRÍTICO · experiencia de fan)

```
Chrome headless · viewport 390×844 · CPU throttle 4× · Slow 4G (1,6 Mbps / 750 kbps / 150 ms RTT)
/presupuesto → TTFB 969 ms · DCL 4.551 ms · load 19.191 ms
Ráfaga de 56/59 clics sobre acordeones y árbol de servicios → 978 interacciones
INP medido: 1.184 ms (evento `pointerup`)   · Presupuesto: 50 ms   · Exceso: 23,7×
CLS medido: 0,000                           · Presupuesto: 0,05     · Holgado
```

- **Lectura dura:** el hilo principal **sí se congela**. Con 978 eventos encolados, la respuesta perceptible llega más de un segundo después del clic. El fan pulsa «Asignar pack», no ve nada durante 1,18 s y vuelve a pulsar.
- **Lectura justa:** es un **servidor de desarrollo (Turbopack, sin minificar, con HMR)**. Este dato es un techo pesimista; el número que vale es el del build de Coolify y **debe re-medirse**.
- **Lo estructural y no dependiente del entorno:** `load = 19.191 ms` con `/presupuesto` sirviendo **239.529 bytes de HTML** en una sola respuesta: matcher + terminal de costes + radar de 14 partidas + directorio de proveedores en un único documento.
- **CLS = 0** con 978 interacciones y 56 aperturas de acordeón: la Ley del Skeleton se cumple. **Cero saltos visuales.**

### Q3 — `413` en lugar de `401` en el webhook de ingesta (MEDIO · orden de cerrojos)

```
POST /api/webhooks/whatsapp-concierge   (rider de 30.000 palabras, SIN firma)
→ HTTP 413 · {"status":"error","code":"PAYLOAD_TOO_LARGE"}
```

- **Causa raíz (`route.ts`, `MAX_BODY_BYTES = 64 * 1024`):** el techo de cuerpo se evalúa **antes** que la firma HMAC. Un atacante anónimo distingue «cuerpo grande» de «no autenticado» sin presentar credencial. SEC-1 exige que el cerrojo de origen sea el primero.
- **No es una brecha de datos** (no hay parseo ni persistencia del cuerpo rechazado) pero **sí viola el orden default-deny** que la cabecera del propio fichero documenta (`401/403` antes que `413`).


### Q4 — Presupuesto de 100.000.000 € aceptado y **recortado en silencio** (CRÍTICO · integridad comercial)

```
POST /api/mcp/concierge  { calculate_quote, totalCents: 10_000_000_000 }   →  HTTP 200 (aceptado)
POST /api/reservar/solista/deposit  { totalEstimado: 100_000_000 }         →  HTTP 200 (aceptado)
```

- **Causa raíz (`deposit/route.ts:147`):** `totalEstimado: Math.min(Math.max(totalEstimado, 0), MAX_TOTAL_ESTIMADO_EUR)` — el valor fuera de rango **se recorta** en vez de rechazarse. La constante `MAX_TOTAL_ESTIMADO_EUR = 1.000.000` existe (`route.ts:22`) pero se aplica como *clamp*, no como *guard*.
- **Consecuencia:** un cliente que declara 100 M € recibe `200` y una sesión Stripe de 100 € construida sobre un presupuesto de 1.000.000 €. **El error nunca llega al usuario**: se cobra el depósito sobre una cifra que él no escribió. Es una discrepancia contractual (JUR-1), no un detalle de validación.
- **Patrón gemelo:** `formSnapshotSchema` acepta `totalCents` hasta `100_000_000_000` (1.000 M €). Dos techos distintos para la misma magnitud en dos rutas del mismo flujo.

### Q5 — XSS / SQLi / path-traversal **aceptados** (MEDIO · la defensa es otra, no esta)

```
label/id/providerId = "<script>alert(1)</script><img onerror=…>"   → HTTP 200
label/id/providerId = "' OR 1=1; DROP TABLE \"Provider\"; -- "    → HTTP 200
providerId          = "../../../../etc/passwd"                     → HTTP 200
```

- **NO es una inyección ejecutada.** El motor es puro (sin Prisma, sin SQL) y React escapa por defecto: el payload viaja como **texto inerte**.
- **Pero el esquema Zod no lo corta**: `z.string().max(120)` acepta `<script>`. La defensa real es «no hay sink», no «la entrada está validada». Si mañana ese `label` se pinta con `dangerouslySetInnerHTML` o se escribe vía ORM mal parametrizado, la defensa desaparece sin que ningún test se ponga rojo.
- **Lo correcto (validado en el mismo lote):** comensales negativos (`quantity:-50`), precio negativo (`unitPriceCents:-35000`) y rider de 30.000 palabras **sí** fueron rechazados con `-32602 INVALID_PARAMS` estructurado. El vallado funciona cuando se declara el rango; falla cuando solo se declara la longitud.

### Q6 — El enlace de WhatsApp **no lleva el hash SHA-256** (ALTO · INV-03 / promesa comercial)

```
https://wa.me/34693693048?text=<419 caracteres>
OK  centralita +34 693 693 048    OK  desglose 80/10/10    OK  depósito 100,00 €    OK  sin truncar
NO  SHA-256 del Price-Lock        NO  enlace de pago Stripe en el mensaje
```

- **Causa raíz (`SovereignBudgetPlanner.tsx:739-757`):** `whatsappBudgetShare` compone demarcación, invitados, totales, desglose por partidas y split 80/10/10. **No incluye** el hash ni la URL de checkout. El SHA-256 solo nace después en `/api/reservar/solista/deposit` (`priceLockHash`), que el mensaje nunca ve.
- **Consecuencia:** el copy promete «Price-Lock SHA-256» y el canal de cierre por WhatsApp entrega un presupuesto **sin huella de integridad**. El comercial recibe una cifra sin prueba de que sea la que el cliente vio.


---

## 2 · Lo que resistió (medido, no opinado)

| Prueba | Resultado medido |
|---|---|
| **Céntimos bajo 100 cotizaciones concurrentes** | `descuadreCentimos = 0` · `splitNoSuma = 0` · 100/100 respuestas `200` |
| **Aislamiento de cálculo** | 100 totales distintos, cada contexto con su total exacto. Cero contaminación cruzada. |
| **Latencia de cotización bajo avalancha** | p50 = 7.710 ms · p95 = 9.072 ms · p99 = 9.166 ms · máx = 9.204 ms (100 concurrentes, servidor dev) |
| **CLS con 978 interacciones** | `0,000` — cero saltos de layout |
| **Vallado de esquema** | `quantity:-50` → `-32602` · `unitPriceCents:-35000` → `-32602` · rider 30.000 palabras → `-32602` |
| **Vallado de protocolo** | JSON basura → `400 -32600` · cuerpo 2 MB → `400 -32600` · herramienta inexistente → `-32601` |
| **Cero 500 en el motor MCP** | 12/12 payloads hostiles sin un solo `500` |
| **Enlace de WhatsApp** | 419 caracteres íntegros · teléfono canónico correcto · split y depósito presentes |

> **Sobre el «overbooking»:** los 75 bloqueos que respondieron `200` lo hicieron con `artistProfileId` nulo, de modo que el guardián `checkDateAvailability` evalúa una agenda distinta por contexto. **No se puede afirmar ni negar sobreventa real sobre un mismo artista: `SIN_EVIDENCIA`.** Lo medido es que **25 peticiones murieron antes de llegar al guardián**. Ese es el quiebre; el aislamiento serializable queda pendiente de una prueba con `artistProfileId` fijo (P0-3).

---

## 3 · Parches de blindaje requeridos antes de tráfico masivo

### P0 — Bloqueantes de lanzamiento

| # | Parche | Fichero | Criterio de cierre medible |
|---|---|---|---|
| P0-1 | **Erradicar el 500 del Price-Lock.** Instrumentar el `catch` con `errorCode` público y clasificador (BD caída / Stripe / validación). Prohibido un 500 sin código. | `src/app/api/reservar/solista/deposit/route.ts:332` | 100 bloqueos concurrentes → `0` respuestas 500 |
| P0-2 | **Guard en vez de clamp.** `totalEstimado > MAX_TOTAL_ESTIMADO_EUR` ⇒ `400` explícito, nunca recorte silencioso. Unificar el techo entre ambas rutas. | `deposit/route.ts:147` · `api/mcp/concierge/route.ts:71-78` | `totalEstimado: 100_000_000` ⇒ `400` |
| P0-3 | **Certificar aislamiento serializable** con `artistProfileId` fijo: N bloqueos al MISMO artista y MISMA fecha ⇒ exactamente 1 aceptado. | `atomicDateLockEngine` (Zona Cero, INV-05) | 100/100 → `{200:1, 409:99}` |
| P0-4 | **SHA-256 y enlace Stripe en el mensaje de WhatsApp**, sin truncar. | `SovereignBudgetPlanner.tsx:739-757` | El texto decodificado contiene `sha256:` + URL de checkout |

### P1 — Antes del primer pico de tráfico

| # | Parche | Criterio de cierre medible |
|---|---|---|
| P1-1 | **Reordenar cerrojos del webhook**: firma → tamaño → Content-Type → parseo. | Cuerpo de 200 KB sin firma ⇒ `401`, no `413` |
| P1-2 | **Vallado anti-XSS en Zod** (`label`/`id`/`providerId`): allow-list de caracteres o `sanitize-html`. Defensa en profundidad. | `<script>` en `label` ⇒ `-32602` |
| P1-3 | **Trocear `/presupuesto`**: separar terminal de costes, matcher y radar con `dynamic import` + skeletons de geometría fija. | INP ≤ 50 ms p75 sobre **build de producción** con 4× CPU |
| P1-4 | **Re-medir INP/CLS contra el build de Coolify**, no contra Turbopack dev. El 1.184 ms es techo pesimista. | Reporte con `buildSha` + INP p75 |
| P1-5 | **Presupuesto de latencia declarado** en el motor de cotización (p99 = 9,2 s en dev). | p99 ≤ 800 ms con 100 concurrentes en build real |


---

## 4 · Cómo se reprodujo (comandos literales)

```powershell
# Arnés completo (4 vectores, 100 concurrentes, Chrome real)
node scripts/audit_estres_estadio.mjs --base=http://127.0.0.1:3007 --json=.antigravity/evidence/estres_estadio_report.json

# Vectores aislados
node scripts/audit_estres_estadio.mjs --concurrency=100 --fecha=2026-12-19 --base=http://127.0.0.1:3007
node scripts/audit_estres_estadio.mjs --skip-browser --base=http://127.0.0.1:3007   # sólo V1 + V3
```

> **Nota de honestidad sobre el destino:** se audita contra `127.0.0.1`, no contra `localhost`. Medido en esta sesión: la misma ruta `/otzarreta` tarda **205 s por `localhost`** y **40 s por `127.0.0.1`** en el mismo Chrome, misma máquina, mismo commit (el servidor escucha solo en `::`, dual-stack). Usar `localhost` habría producido **falsos positivos**: 8 rutas «sin evidencia» que en realidad responden 200 en menos de 1 s. Ese mismo defecto era el que bloqueaba `gate:prepush` en `audit:contrast:core`.

---

## 5 · Consecuencia aceptada al firmar este informe

La plataforma **resiste la aritmética** (cero descuadre de céntimos en 100 cotizaciones concurrentes, cero CLS con 978 interacciones) y **cede en el cobro** (25 % de 500 en el bloqueo de fecha). El riesgo de lanzar hoy no es que las cuentas estén mal: es que **una de cada cuatro reservas muera en el último paso** y que el presupuesto enviado por WhatsApp no lleve huella que lo haga exigible.

Ningún dato de este informe es extrapolado: lo no medido está marcado `SIN_EVIDENCIA`; lo medido sobre servidor de desarrollo está declarado como techo pesimista y **debe re-medirse sobre el build de Coolify** antes de declarar la plataforma apta para tráfico masivo.

