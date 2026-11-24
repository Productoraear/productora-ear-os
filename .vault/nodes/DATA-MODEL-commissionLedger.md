---
id: "DATA-MODEL-commissionLedger"
name: "Modelo commissionLedger"
type: "data"
criticality: "CRITICAL"
path: "prisma/schema.prisma"
integrityHash: "284ef1085a69cd05"
---

# Modelo commissionLedger

- **ID**: `DATA-MODEL-commissionLedger`
- **Tipo**: `data`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `prisma/schema.prisma`
- **Hash de Integridad**: `284ef1085a69cd05`

## Metadatos
```json
{
  "modelName": "commissionLedger",
  "fieldsCount": 17,
  "isFinancial": true
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[API-/api/admin/treasury]] -> **reads->writes**
- [[API-/api/affiliates/payout]] -> **reads->writes**
- [[API-/api/booking/settlement]] -> **reads->writes**
- [[API-/api/quotes/lock]] -> **reads->writes**
- [[API-/api/stripe/webhook]] -> **reads->writes**
