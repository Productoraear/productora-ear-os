---
id: "API-/api/affiliates/payout"
name: "/api/affiliates/payout"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/affiliates/payout/route.ts"
integrityHash: "bbed470092f2b990"
---

# /api/affiliates/payout

- **ID**: `API-/api/affiliates/payout`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/affiliates/payout/route.ts`
- **Hash de Integridad**: `bbed470092f2b990`

## Metadatos
```json
{
  "endpoint": "/api/affiliates/payout",
  "verbs": [
    "POST"
  ],
  "isProtected": false,
  "isStripe": false
}
```

## Dependencias Salientes (Outgoing)
- **reads->writes** -> [[DATA-MODEL-commissionLedger]]

## Dependencias Entrantes (Incoming / Governed by)
_Ninguna dependencia entrante directa._
