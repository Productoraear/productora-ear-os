---
id: "API-/api/payments/connect/onboard"
name: "/api/payments/connect/onboard"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/payments/connect/onboard/route.ts"
integrityHash: "67b3cdde75ff0140"
---

# /api/payments/connect/onboard

- **ID**: `API-/api/payments/connect/onboard`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/payments/connect/onboard/route.ts`
- **Hash de Integridad**: `67b3cdde75ff0140`

## Metadatos
```json
{
  "endpoint": "/api/payments/connect/onboard",
  "verbs": [
    "POST"
  ],
  "isProtected": false,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
- **reads->writes** -> [[DATA-MODEL-providerProfile]]

## Dependencias Entrantes (Incoming / Governed by)
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
