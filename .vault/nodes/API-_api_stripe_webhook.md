---
id: "API-/api/stripe/webhook"
name: "/api/stripe/webhook"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/stripe/webhook/route.ts"
integrityHash: "a7c46dd543856292"
---

# /api/stripe/webhook

- **ID**: `API-/api/stripe/webhook`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/stripe/webhook/route.ts`
- **Hash de Integridad**: `a7c46dd543856292`

## Metadatos
```json
{
  "endpoint": "/api/stripe/webhook",
  "verbs": [
    "POST"
  ],
  "isProtected": true,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
- **reads->writes** -> [[DATA-MODEL-commissionLedger]]
- **reads->writes** -> [[DATA-MODEL-providerProfile]]
- **reads->writes** -> [[DATA-MODEL-ProductionEvent]]
- **reads->writes** -> [[DATA-MODEL-SmartLock]]
- **reads->writes** -> [[DATA-MODEL-AdminNotification]]

## Dependencias Entrantes (Incoming / Governed by)
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
