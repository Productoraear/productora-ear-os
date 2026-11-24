---
id: "GATE-SSOT"
name: "Gate SSOT Integrity"
type: "constitutional"
criticality: "CRITICAL"
path: "scripts/baseline_ssot_integrity.ts"
integrityHash: "dec63a49bfdf460d"
---

# Gate SSOT Integrity

- **ID**: `GATE-SSOT`
- **Tipo**: `constitutional`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `scripts/baseline_ssot_integrity.ts`
- **Hash de Integridad**: `dec63a49bfdf460d`

## Metadatos
```json
{
  "command": "npm run audit:ssot",
  "isMechanicalGate": true
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
