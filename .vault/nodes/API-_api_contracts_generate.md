---
id: "API-/api/contracts/generate"
name: "/api/contracts/generate"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/contracts/generate/route.ts"
integrityHash: "d5164024ad412728"
---

# /api/contracts/generate

- **ID**: `API-/api/contracts/generate`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/contracts/generate/route.ts`
- **Hash de Integridad**: `d5164024ad412728`

## Metadatos
```json
{
  "endpoint": "/api/contracts/generate",
  "verbs": [
    "POST"
  ],
  "isProtected": false,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
- **reads->writes** -> [[DATA-MODEL-smartContract]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
