# SKILL · `marketing-growth-funnels` — Embudo de conversión para landings pSEO y fichas de proveedor
**Versión**: 1.0 · **Fecha**: 2026-11-11 · **Norma rectora**: `.clinerules` (EP-3, AF-4, JUR-1, INV-09, FLUENCY-1)
**Origen destilado**: `marketingskills-main` @ `3ba649e6` → `COPY_HOMEPAGE_EAR.md`, `CRO_OPTIMIZATION_PLAN.md`, `POPUP_STRATEGY_EAR.md`, `STRATEGY_CALCULATOR_EAR.md`.
**Invocación**: antes de escribir el copy de una landing pSEO (`/bodas`, `/fincas`, `/mariachis/*`, `/b2g`) o la cabecera de una ficha de proveedor.

> **Ley de filtrado (lo primero, antes del copy)**: la fuente de origen es un borrador de marketing, **no** un SSOT.
> Sus cifras (`2.486 proveedores`, `+1.200 eventos`, `45 artistas`, `120 TB`, `95% de eventos fallan`) y su
> `DEPÓSITO 30%` **no se heredan**: violan AF-4 (cifra sin rastro a SSOT en ≤ 3 clics), JUR-1 (Ley 3/1991) y
> INV-03 (el depósito canónico es **100,00 €** Stripe Price-Lock, no un 30% del total).
> Un dato que no se puede rastrear se **elimina del copy**, no se suaviza.

---

## FASE 1 · Anatomía obligatoria del embudo (5 eslabones, ninguno opcional)

| # | Eslabón | Qué escribe en pantalla | Verificación |
|---|---|---|---|
| 1 | **Gancho de utilidad** | El H1 promete un cálculo concreto que el visitante puede hacer en <60 s | el CTA del H1 responde (`EP-3`) |
| 2 | **Prueba trazable** | Precio, plazo, protocolo y teléfono oficial **+34 693 693 048** | `npm run audit:phone` |
| 3 | **Micro-compromiso** | Selector de 3 opciones (pax / provincia / tipo de evento) que filtra de verdad | `npm run audit:cta-matrix` |
| 4 | **Cierre de baja fricción** | WhatsApp oficial (2 clics) **antes** que el depósito | `grep -c "693 693 048" <fichero>` |
| 5 | **Cierre vinculante** | Depósito **100,00 €** Stripe Price-Lock, 100 % deducible | `node scripts/verify_price_lock_flow.cjs` |

**Regla de orden**: nunca se pide dinero antes de ofrecer la ruta libre (WhatsApp). Invertir el orden sube el
abandono y roza la venta coactiva. La fuente original lo hace al revés (`[RESERVAR FECHA - DEPÓSITO 30%]` primero): **no se copia**.

---

## FASE 2 · Gatillos de conversión legítimos (los únicos admitidos)

| Gatillo | Forma admitida en EAR OS | Forma prohibida (slop / ilegal) |
|---|---|---|
| Reciprocidad | Dar la cifra **antes** del email (resultado instantáneo, email después para el informe) | Bloquear el resultado a cambio del correo |
| Autoridad | Lo que se mide: `SHA-256` del presupuesto, sello `Price-Lock`, teléfono único oficial | «IA forense», «afinidad neuronal», nº de eventos inventados |
| Escasez | Slots **reales** de calendario leídos de `atomicDateLockEngine` | «Solo quedan 12 slots» sin origen verificable |
| Pérdida | Mostrar el coste del caos de gestión **con la fórmula explícita** | «El 70% de los artistas pierde su margen» sin fuente |
| Impacto social | El 10 % VIMUME con cifra exacta del split en céntimos | «Tu contratación ya ha donado 50 €» (cifra no ligada al SSOT) |

---

## FASE 3 · Estructura de landing pSEO (patrón cerrado)

1. **H1** con la keyword de la página y una promesa medible (`Presupuesto de <gremio> en <provincia>: 350,00 € base solista`).
2. **Bloque de verdad**: 3 datos del SSOT (`350,00 €` base · `100,00 €` depósito deducible · split `80/10/10`).
3. **Comparativa** «lo que ves vs lo que firmas» — misma tabla para las 12 super-pantallas.
4. **FAQ** con las 5 objeciones reales de la vertical (ver `marketing-whatsapp-scripts.md`).
5. **Cierre doble**: WhatsApp oficial + Stripe 100 €, con el teléfono escrito en texto (no solo icono).
6. **JSON-LD** `Service` + `FAQPage` con la misma cifra que el HTML (AF-4: una sola verdad).

---

## FASE 4 · Anti-slop de copy (protocolo UNSLOP, pases 3-4)

- Cero emojis en UI de producción (`🚀`, `🔥`, `💎`): solo `lucide-react` con `strokeWidth={1.5|1.75}`.
- Cero «vanguardia», «ultra», «modo WOW», «infraestructura de impacto»: sustituir por cifra + plazo.
- Cero gradientes púrpura/azul ni `blur-3xl` decorativos.
- Cada CTA empieza por verbo y dice qué pasa al pulsarlo (`Bloquear fecha con 100,00 €`, no `¡Reservar ya!`).

---

## FASE 5 · Criterio de Done

| # | Comando | Umbral |
|---|---|---|
| 1 | `npm run audit:cta-matrix` | 0 clics muertos |
| 2 | `npm run verify:provider-ctas` | 0 CTA sin destino |
| 3 | `npm run audit:phone` | 0 `verified:true` sin teléfono real |
| 4 | `npm run audit:tariff-copy` | 0 precio hardcodeado fuera del SSOT |
| 5 | `node scripts/verify_price_lock_flow.cjs` | depósito exacto 100,00 € |
| 6 | `npm run verify:pricing` | 350,00 € base · split 80/10/10 |

Sin los 6 en Exit 0, la landing es `FACHADA` aunque el copy sea impecable.
