---
id: "GATE-PRICE-LOCK"
name: "Gate Price-Lock Flow & Deposit"
type: "constitutional"
criticality: "CRITICAL"
path: "scripts/verify_price_lock_flow.cjs"
integrityHash: "d5eeaf456969c482"
---

# Gate Price-Lock Flow & Deposit

- **ID**: `GATE-PRICE-LOCK`
- **Tipo**: `constitutional`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `scripts/verify_price_lock_flow.cjs`
- **Hash de Integridad**: `d5eeaf456969c482`

## Metadatos
```json
{
  "command": "node scripts/verify_price_lock_flow.cjs",
  "isMechanicalGate": true
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
- [[RULE-51]] -> **governs->executes**
- [[RULE-87]] -> **governs->executes**
