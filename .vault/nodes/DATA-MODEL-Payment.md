---
id: "DATA-MODEL-Payment"
name: "Modelo Payment"
type: "data"
criticality: "CRITICAL"
path: "prisma/schema.prisma"
integrityHash: "284ef1085a69cd05"
---

# Modelo Payment

- **ID**: `DATA-MODEL-Payment`
- **Tipo**: `data`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `prisma/schema.prisma`
- **Hash de Integridad**: `284ef1085a69cd05`

## Metadatos
```json
{
  "modelName": "Payment",
  "fieldsCount": 14,
  "isFinancial": true
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[API-/api/budget/payments]] -> **reads->writes**
