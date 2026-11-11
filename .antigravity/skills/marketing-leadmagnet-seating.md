# SKILL · `marketing-leadmagnet-seating` — Entrega con valor anclado (Seating Planner Pro)
**Versión**: 1.0 · **Fecha**: 2026-11-11 · **Estado del activo**: `SIN_EVIDENCIA` (ver FASE 0)
**Norma rectora**: `.clinerules` (EP-3, AF-4, JUR-1, INV-03, INV-09)
**Origen destilado**: `marketingskills-main` @ `3ba649e6` → `STRATEGY_CALCULATOR_EAR.md` (lead magnet por valor, no por bloqueo de resultado), `POPUP_STRATEGY_EAR.md` (micro-compromiso), `CRO_OPTIMIZATION_PLAN.md` (pricing arquitectónico).

---

## FASE 0 · Verdad del activo antes de escribir una sola línea (ley del auditor real)

Se auditó el repo el 2026-11-11 buscando el producto:

| Búsqueda | Comando | Resultado |
|---|---|---|
| Componente del planificador | `Select-String -Recurse src -Pattern 'Seating Planner'` | **0 coincidencias** |
| Slug / ruta | `seating-planner` · `seatingPlanner` | **0 coincidencias** |
| Mención en la orden de marketing | `marketingskills-main/**` | **0 coincidencias** |

**Conclusión**: el «Seating Planner Pro» **no existe hoy como software en el árbol**. Existe la orden de
negocio (valor de catálogo **190,00 €**, entrega en cortesía con depósito) y **no** existe la URL pública que
la respalde. Por EP-3 (`promesa = URL`) el copy **no puede** anunciarlo como entregable hasta que exista ruta.

**Regla de activación**: esta skill se ejecuta en dos tiempos.
- **T0 (hoy)**: el copy solo puede hablar de lo que existe → presupuesto sellado + WhatsApp + depósito 100,00 €.
- **T1 (cuando exista `/herramientas/seating-planner`)**: se habilita el lead magnet con valor anclado de la FASE 3.

Nunca se anuncia el 190,00 € de catálogo en pantalla antes de T1: sería precio sin producto (JUR-1).

---

## FASE 1 · Por qué el anclaje de valor funciona (y sus límites legales)

| Concepto | Forma admitida | Forma prohibida |
|---|---|---|
| Ancla de precio | «Herramienta de catálogo: **190,00 €**. Con tu depósito de **100,00 €**: **0,00 €**» — solo si la herramienta existe | Anclar contra un precio inventado o tachado que nunca se cobró (Ley 3/1991, art. 5-7) |
| Reciprocidad | Entregar la herramienta **después** del depósito confirmado por Stripe, con sello de fecha | «Gratis para siempre» con condición oculta |
| Escasez | Slots reales de calendario | «Solo 5 parejas este mes» sin fuente |

**Invariante monetaria (INV-03)**: la cortesía **no** cambia la naturaleza del depósito —sigue siendo
100,00 € y 100 % deducible del total—. No se convierte en «pago por la herramienta»: eso crearía un segundo
producto y un segundo flujo de cobro que hoy no existe en `atomicDateLockEngine`.

---

## FASE 2 · Segmentación del organizador (a quién se le ofrece)

| Segmento | Señal en el producto | Qué le duele | Qué se le ofrece en T1 |
|---|---|---|---|
| Pareja que ya tiene presupuesto | usa el planificador y descarga el hash | reubicar invitados sin romper el reparto | seating importado del presupuesto sellado |
| Wedding planner externo | repite provincia y >2 eventos | rehacer el croquis por cliente | enlace de seating por evento |
| Finca colaboradora | llega desde la ficha de la finca | pax máximo del espacio | validación de aforo contra la ficha |
| B2G (ayuntamiento) | CPV 92312100-2 | aforo legal del recinto | exportación a PDF para el expediente |

Regla: se segmenta por **señal observable en el producto**, nunca por dato personal (INV-14).

---

## FASE 3 · Mecánica de entrega (T1)

1. El cliente cierra el depósito `100,00 €` (Stripe Price-Lock, idempotente por `stripeSessionId`).
2. El webhook `stripe-price-lock` valida el evento y emite el enlace de la herramienta con **hash del presupuesto**.
3. El seating nace **pre-rellenado** con el número de pax y la provincia del presupuesto sellado (cero re-tecleo).
4. La herramienta **no** cotiza: solo organiza. Cualquier cifra que muestre viene del SSOT, no del cliente.
5. Cierre del bucle: al exportar, se ofrece la revisión humana por el canal único **+34 693 693 048**.

**Anti-fachada**: si el paso 1 o el 2 fallan, la herramienta **no** se entrega. Un seating «de demostración»
sin depósito confirmado marcaría el activo como `FACHADA` (AF-2), y eso es peor que no entregarlo.

---

## FASE 4 · Copy del lead magnet (pases UNSLOP 3-4)

**Titular admitido (T1)**: `Planifica los asientos sobre tu presupuesto sellado. Sin volver a teclear un dato.`
**Sub**: `Herramienta de catálogo: 190,00 €. Incluida cuando bloqueas la fecha con los 100,00 € deducibles.`
**Prohibido**: «La IA elige tus mesas por afinidad neuronal», «experiencia inolvidable», cualquier emoji.

Prueba que debe acompañar el bloque: hash del presupuesto + teléfono oficial en texto.

---

## FASE 5 · Criterio de Done

| # | Comprobación | Umbral |
|---|---|---|
| 1 | `Test-Path` del componente y de la ruta pública | ambos `True` (hoy: `False` → T1 bloqueado) |
| 2 | `node scripts/verify_price_lock_flow.cjs` | depósito 100,00 € intacto |
| 3 | `npm run sim:event` | 1 fila por `stripeSessionId` |
| 4 | `npm run audit:cta-matrix` | 0 CTA del lead magnet sin destino |
| 5 | `npm run verify:pricing` | 350,00 € y split 80/10/10 sin cambios |
| 6 | `npm run audit:tariff-copy` | 0 precio (incluido 190,00 €) fuera de su SSOT |
