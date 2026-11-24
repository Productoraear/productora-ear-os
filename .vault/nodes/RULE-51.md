---
id: "RULE-51"
name: "Regla 51: Depósito Price-Lock con Cerrojo Atómico de Agenda"
type: "constitutional"
criticality: "CRITICAL"
path: "src/lib/oraculo/oraculo-canonical-rules-51-60.ts"
integrityHash: "475d5373c0e641de"
---

# Regla 51: Depósito Price-Lock con Cerrojo Atómico de Agenda

- **ID**: `RULE-51`
- **Tipo**: `constitutional`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-51-60.ts`
- **Hash de Integridad**: `475d5373c0e641de`

## Metadatos
```json
{
  "ruleId": 51,
  "block": 6,
  "blockTitle": "Gobernanza Operativa, Neutralidad & Cierre Atómico",
  "title": "Depósito Price-Lock con Cerrojo Atómico de Agenda",
  "directive": "El depósito de 100,00 € actúa como fianza deducible al 100% en Stripe activando un cerrojo atómico serializable en base de datos: la fecha queda congelada sin riesgo de colisión ni doble reserva."
}
```

## Dependencias Salientes (Outgoing)
- **governs->executes** -> [[GATE-PRICE-LOCK]]
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
