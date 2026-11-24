---
id: "API-/api/admin/affiliates"
name: "/api/admin/affiliates"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/admin/affiliates/route.ts"
integrityHash: "06f5b4091e8d67ac"
---

# /api/admin/affiliates

- **ID**: `API-/api/admin/affiliates`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/admin/affiliates/route.ts`
- **Hash de Integridad**: `06f5b4091e8d67ac`

## Metadatos
```json
{
  "endpoint": "/api/admin/affiliates",
  "verbs": [
    "GET",
    "POST",
    "PATCH",
    "DELETE"
  ],
  "isProtected": true,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
- **reads->writes** -> [[DATA-MODEL-AffiliateProfile]]

## Dependencias Entrantes (Incoming / Governed by)
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
