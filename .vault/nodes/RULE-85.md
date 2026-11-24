---
id: "RULE-85"
name: "Regla 85: Devolución Ágil de Fianza en 48 Horas con Liberación Stripe"
type: "constitutional"
criticality: "HIGH"
path: "src/lib/oraculo/oraculo-canonical-rules-81-90.ts"
integrityHash: "b1fbba2ebef9af23"
---

# Regla 85: Devolución Ágil de Fianza en 48 Horas con Liberación Stripe

- **ID**: `RULE-85`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-81-90.ts`
- **Hash de Integridad**: `b1fbba2ebef9af23`

## Metadatos
```json
{
  "ruleId": 85,
  "block": 9,
  "blockTitle": "Experiencia VIP, Resiliencia de Sala, Split & Fianza Soberana",
  "title": "Devolución Ágil de Fianza en 48 Horas con Liberación Stripe",
  "directive": "La retención de garantía o fianza de custodia en Stripe se desbloquea de forma automatizada en un plazo máximo de 48 horas tras el desmontaje del evento; cualquier retención parcial exige emitir un parte técnico visado con prueba fotográfica y justificación económica en menos de 24 horas."
}
```

## Dependencias Salientes (Outgoing)
- **governs->executes** -> [[API-/api/admin/affiliates]]
- **governs->executes** -> [[API-/api/admin/dispatch/lock]]
- **governs->executes** -> [[API-/api/admin/dispatch]]
- **governs->executes** -> [[API-/api/admin/telemetry]]
- **governs->executes** -> [[API-/api/admin/treasury]]
- **governs->executes** -> [[API-/api/agents/chat]]
- **governs->executes** -> [[API-/api/ai/editor-copy]]
- **governs->executes** -> [[API-/api/astra/payment-intent]]
- **governs->executes** -> [[API-/api/astra]]
- **governs->executes** -> [[API-/api/booking/accept]]
- **governs->executes** -> [[API-/api/booking/provider-brief]]
- **governs->executes** -> [[API-/api/booking/settlement]]
- **governs->executes** -> [[API-/api/calendar/[kind]/[slug]/deposit]]
- **governs->executes** -> [[API-/api/chat/concierge]]
- **governs->executes** -> [[API-/api/checkout/digital]]
- **governs->executes** -> [[API-/api/checkout/orchestrate]]
- **governs->executes** -> [[API-/api/concierge/chat]]
- **governs->executes** -> [[API-/api/contracts/generate]]
- **governs->executes** -> [[API-/api/cron/hold-timeout]]
- **governs->executes** -> [[API-/api/digital-checkout]]
- **governs->executes** -> [[API-/api/events/deposit]]
- **governs->executes** -> [[API-/api/fincas/visit-lock]]
- **governs->executes** -> [[API-/api/fleet/client-tracking]]
- **governs->executes** -> [[API-/api/mcp/concierge]]
- **governs->executes** -> [[API-/api/oracle/chat]]
- **governs->executes** -> [[API-/api/payments/connect/onboard]]
- **governs->executes** -> [[API-/api/payments/create-session]]
- **governs->executes** -> [[API-/api/providers/opt-out]]
- **governs->executes** -> [[API-/api/quote/generate-lock]]
- **governs->executes** -> [[API-/api/quote/smoke-test-lock]]
- **governs->executes** -> [[API-/api/reservar/artist-deposit]]
- **governs->executes** -> [[API-/api/reservar/solista/confirm]]
- **governs->executes** -> [[API-/api/reservar/solista/deposit]]
- **governs->executes** -> [[API-/api/reservar/test-1eur]]
- **governs->executes** -> [[API-/api/stripe/webhook]]
- **governs->executes** -> [[API-/api/telemetry/funnel]]
- **governs->executes** -> [[API-/api/telemetry/mission/[id]]]
- **governs->executes** -> [[API-/api/villas/villa-escorial/availability]]
- **governs->executes** -> [[API-/api/webhooks/health]]
- **governs->executes** -> [[API-/api/webhooks/n8n-dispatch]]
- **governs->executes** -> [[API-/api/webhooks/whatsapp-concierge]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
