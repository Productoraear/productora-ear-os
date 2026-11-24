---
id: "API-/api/quote/generate-lock"
name: "/api/quote/generate-lock"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/quote/generate-lock/route.ts"
integrityHash: "c245377be5bfdcca"
---

# /api/quote/generate-lock

- **ID**: `API-/api/quote/generate-lock`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/quote/generate-lock/route.ts`
- **Hash de Integridad**: `c245377be5bfdcca`

## Metadatos
```json
{
  "endpoint": "/api/quote/generate-lock",
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
