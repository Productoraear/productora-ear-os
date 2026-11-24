---
id: "GATE-ADMIN-ECOSYSTEM"
name: "Gate Admin Ecosystem Single-Truth"
type: "constitutional"
criticality: "HIGH"
path: "scripts/audit_admin_ecosystem.cjs"
integrityHash: "41baf8a7e4e7cda9"
---

# Gate Admin Ecosystem Single-Truth

- **ID**: `GATE-ADMIN-ECOSYSTEM`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `scripts/audit_admin_ecosystem.cjs`
- **Hash de Integridad**: `41baf8a7e4e7cda9`

## Metadatos
```json
{
  "command": "npm run audit:admin-ecosystem",
  "isMechanicalGate": true
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
