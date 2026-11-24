---
id: "API-/api/astra"
name: "/api/astra"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/astra/route.ts"
integrityHash: "177c5ee324e03ef2"
---

# /api/astra

- **ID**: `API-/api/astra`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/astra/route.ts`
- **Hash de Integridad**: `177c5ee324e03ef2`

## Metadatos
```json
{
  "endpoint": "/api/astra",
  "verbs": [
    "POST"
  ],
  "isProtected": false,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
