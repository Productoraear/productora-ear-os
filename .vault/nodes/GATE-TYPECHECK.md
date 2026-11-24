---
id: "GATE-TYPECHECK"
name: "Gate Strict TypeScript Compilation"
type: "constitutional"
criticality: "CRITICAL"
path: "tsconfig.json"
integrityHash: "982c1455e5e73c8c"
---

# Gate Strict TypeScript Compilation

- **ID**: `GATE-TYPECHECK`
- **Tipo**: `constitutional`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `tsconfig.json`
- **Hash de Integridad**: `982c1455e5e73c8c`

## Metadatos
```json
{
  "command": "npm run typecheck",
  "isMechanicalGate": true
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
