# SKILL · `marketing-whatsapp-scripts` — Matriz de cierre y objeciones del Concierge
**Versión**: 1.0 · **Fecha**: 2026-11-11 · **Canal único**: **+34 693 693 048** (INV-12)
**Norma rectora**: `.clinerules` (INV-03, INV-12, JUR-1, INV-14, SEC-3)
**Origen destilado**: `marketingskills-main` @ `3ba649e6` → `CRO_OPTIMIZATION_PLAN.md`, `POPUP_STRATEGY_EAR.md` (psicología de inversión), `EMAIL_SEQUENCE_EAR.md`.
**Invocación**: al redactar plantillas de respuesta del agente `/api/mcp/concierge`, del webhook `call-center-intake` o del `prefilledText` de cualquier enlace `wa.me`.

> **Filtro aplicado**: la fuente original vende «depósito del 30 %» y «sin salir de la página». Eso **no** entra:
> el depósito canónico es **100,00 €** Stripe Price-Lock, **100 % deducible** (INV-03). Ninguna plantilla puede
> pedir una cantidad distinta ni presentar la fianza como un gasto a fondo perdido.

---

## FASE 1 · Reglas duras del canal (antes de la primera línea de copy)

| ID | Regla | Motivo |
|---|---|---|
| WA-1 | Un solo número público: **+34 693 693 048**. Nunca un móvil personal en el copy | INV-12 |
| WA-2 | 0 datos personales del cliente en el cuerpo del mensaje prellenado (nombre, email, dirección, IBAN) | INV-14 / RGPD |
| WA-3 | El enlace `wa.me` lleva **huella SHA-256** del presupuesto: sin huella, el mensaje no es prueba | `SovereignBudgetPlanner.tsx` (sellado en primer render) |
| WA-4 | Cifras siempre con céntimos: `350,00 €` y `100,00 €`, nunca `350` a secas | INV-01 / INV-03 |
| WA-5 | Prohibido prometer disponibilidad antes de consultar el calendario real | `atomicDateLockEngine.ts` |
| WA-6 | Prohibida la reseña fabricada, la marca de terceros y el testimonio inventado | JUR-4 |

---

## FASE 2 · Matriz de cierre (5 escalones; se usa el primero que el cliente permita)

| # | Momento | Objetivo del mensaje | Acción pedida |
|---|---|---|---|
| 1 | Primer contacto | Dar el precio base sin rodeos | «Decir el importe» |
| 2 | Pide detalle | Enviar el presupuesto firmado (hash) | «Abrir el enlace sellado» |
| 3 | Compara precios | Separar precio de riesgo | «Ver qué cubre el rider» |
| 4 | Duda de la fecha | Consultar calendario real | «Bloquear con 100,00 € deducibles» |
| 5 | Silencio > 48 h | Reabrir con un dato nuevo, no con presión | «Responder sí/no a la fecha» |

**Regla de oro**: cada mensaje cierra con **una sola** pregunta. Dos preguntas = ninguna respuesta.

---

## FASE 3 · Matriz de objeciones (respuesta + prueba que la sostiene)

| Objeción | Respuesta (tono plano, sin épica) | Prueba adjunta |
|---|---|---|
| «Es caro» | «La base solista son 350,00 €. El desglose 80/10/10 está en el presupuesto sellado: 280,00 € al artista, 35,00 € a infraestructura, 35,00 € a VIMUME.» | hash del presupuesto |
| «¿Por qué 100 € antes de hablar?» | «No es un pago: es una reserva que se **resta íntegra** del total. Bloquea la fecha en calendario y se libera si no hay acuerdo.» | `verify_price_lock_flow` |
| «¿Y si cancelo?» | «La fianza es deducible del importe; las condiciones de liberación están escritas en el checkout de Stripe antes de pagar.» | condiciones visibles en Stripe |
| «Mándame fotos / vídeos» | «Te envío el enlace de la ficha con la ficha técnica y el rider acústico del espacio.» | ficha real, no stock |
| «Otra productora me lo deja más barato» | «Puede ser. Lo que cambia es qué pasa si falla el sonido: aquí hay rider < 75 dB SPL y limitador homologado.» | Ley 37/2003 |
| «¿Está disponible el 12 de septiembre?» | «Lo consulto en el calendario real ahora mismo; no confirmo por WhatsApp sin bloqueo.» | `atomicDateLockEngine` |
| «¿Puedo pagar todo al final?» | «Sí: la fianza se descuenta del total. Lo que no se puede es reservar sin bloqueo atómico de la fecha.» | INV-08 |

**Prohibido en la respuesta**: «somos los mejores», «experiencia inolvidable», «calidad garantizada» sin métrica.
Si no hay prueba en la columna derecha, la frase se borra.

---

## FASE 4 · Plantilla de cierre (forma canónica)

```
Hola. Presupuesto sellado (SHA-256: <hash8>):
- Base: <total> € con split 80/10/10 ya desglosado.
- Fecha: <fecha> — se bloquea con 100,00 € deducibles del total.
- Rider acústico y protocolo: incluidos en el documento.

¿Confirmo disponibilidad en calendario para el <fecha>?
```

Reglas: máx. 6 líneas · 1 pregunta final · sin emojis · sin nombre propio del cliente · cifras con céntimos.

---

## FASE 5 · Criterio de Done

| # | Comando | Umbral |
|---|---|---|
| 1 | `npm run verify:concierge-saga` | saga completa en Exit 0 |
| 2 | `npm run audit:phone` | 0 teléfonos no oficiales |
| 3 | `npm run audit:residues` | 0 datos personales en logs/URLs/payloads |
| 4 | `node scripts/verify_price_lock_flow.cjs` | 100,00 € exactos y deducibles |
| 5 | `npm run sim:event` | 1 fila por `stripeSessionId` (idempotencia) |
