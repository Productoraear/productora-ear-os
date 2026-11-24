---
id: "API-/api/ai/editor-copy"
name: "/api/ai/editor-copy"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/ai/editor-copy/route.ts"
integrityHash: "3e8f4a3c918f1657"
---

# /api/ai/editor-copy

- **ID**: `API-/api/ai/editor-copy`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/ai/editor-copy/route.ts`
- **Hash de Integridad**: `3e8f4a3c918f1657`

## Metadatos
```json
{
  "endpoint": "/api/ai/editor-copy",
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
