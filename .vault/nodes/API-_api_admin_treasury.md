---
id: "API-/api/admin/treasury"
name: "/api/admin/treasury"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/admin/treasury/route.ts"
integrityHash: "796796d2ada5412b"
---

# /api/admin/treasury

- **ID**: `API-/api/admin/treasury`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/admin/treasury/route.ts`
- **Hash de Integridad**: `796796d2ada5412b`

## Metadatos
```json
{
  "endpoint": "/api/admin/treasury",
  "verbs": [
    "GET",
    "POST"
  ],
  "isProtected": true,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
- **reads->writes** -> [[DATA-MODEL-commissionLedger]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
