---
id: "GATE-MASTER-GUIDE"
name: "Gate Master Guide Intent Compiler"
type: "constitutional"
criticality: "HIGH"
path: "scripts/verify_master_guide.ts"
integrityHash: "e801c7800d9a51d8"
---

# Gate Master Guide Intent Compiler

- **ID**: `GATE-MASTER-GUIDE`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `scripts/verify_master_guide.ts`
- **Hash de Integridad**: `e801c7800d9a51d8`

## Metadatos
```json
{
  "command": "npm run verify:master-guide",
  "isMechanicalGate": true
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
