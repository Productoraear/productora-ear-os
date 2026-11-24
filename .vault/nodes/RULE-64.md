---
id: "RULE-64"
name: "Regla 64: Fianza de Custodia Atómica con Retención en Stripe"
type: "constitutional"
criticality: "CRITICAL"
path: "src/lib/oraculo/oraculo-canonical-rules-61-70.ts"
integrityHash: "0dc9b1a56cfb45d5"
---

# Regla 64: Fianza de Custodia Atómica con Retención en Stripe

- **ID**: `RULE-64`
- **Tipo**: `constitutional`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-61-70.ts`
- **Hash de Integridad**: `0dc9b1a56cfb45d5`

## Metadatos
```json
{
  "ruleId": 64,
  "block": 7,
  "blockTitle": "Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato",
  "title": "Fianza de Custodia Atómica con Retención en Stripe",
  "directive": "En contratos de alquiler privado de motivos 3D transitables o equipos Twinkly Pro, se ejecuta una autorización previa o retención atómica de fianza en tarjeta mediante Stripe, la cual solo es liberada tras el desmontaje, revisión técnica y certificación de estado."
}
```

## Dependencias Salientes (Outgoing)
- **governs->executes** -> [[DOMAIN-CATALOGO-LUCES]]
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
