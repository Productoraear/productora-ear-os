---
id: "RULE-27"
name: "Regla 27: Cero Pagos en Mano"
type: "constitutional"
criticality: "HIGH"
path: "src/lib/oraculo/oraculo-canonical-rules-1-50.ts"
integrityHash: "a01e6f33055d2a87"
---

# Regla 27: Cero Pagos en Mano

- **ID**: `RULE-27`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-1-50.ts`
- **Hash de Integridad**: `a01e6f33055d2a87`

## Metadatos
```json
{
  "ruleId": 27,
  "block": 3,
  "blockTitle": "Riesgo Invertido, Fianza & Filtro de Reputación",
  "title": "Cero Pagos en Mano",
  "directive": "Todas las transacciones económicas deben registrarse a través de pasarela regulada (Stripe) o transferencia IBAN bancaria al ledger."
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
