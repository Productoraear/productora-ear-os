---
id: "API-/api/telegram/webhook"
name: "/api/telegram/webhook"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/telegram/webhook/route.ts"
integrityHash: "3a3b05c3ff010f76"
---

# /api/telegram/webhook

- **ID**: `API-/api/telegram/webhook`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/telegram/webhook/route.ts`
- **Hash de Integridad**: `3a3b05c3ff010f76`

## Metadatos
```json
{
  "endpoint": "/api/telegram/webhook",
  "verbs": [
    "POST"
  ],
  "isProtected": false,
  "isStripe": false
}
```

## Dependencias Salientes (Outgoing)
- **reads->writes** -> [[DATA-MODEL-smartContract]]

## Dependencias Entrantes (Incoming / Governed by)
_Ninguna dependencia entrante directa._
