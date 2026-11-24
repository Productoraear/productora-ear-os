---
id: "API-/api/checkout/orchestrate"
name: "/api/checkout/orchestrate"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/checkout/orchestrate/route.ts"
integrityHash: "6e18afbde1a4beb0"
---

# /api/checkout/orchestrate

- **ID**: `API-/api/checkout/orchestrate`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/checkout/orchestrate/route.ts`
- **Hash de Integridad**: `6e18afbde1a4beb0`

## Metadatos
```json
{
  "endpoint": "/api/checkout/orchestrate",
  "verbs": [
    "POST"
  ],
  "isProtected": false,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
- **reads->writes** -> [[DATA-MODEL-ProductionEvent]]

## Dependencias Entrantes (Incoming / Governed by)
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
