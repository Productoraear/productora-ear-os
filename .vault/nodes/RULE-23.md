---
id: "RULE-23"
name: "Regla 23: Depósito Stripe Price-Lock de 100,00 €"
type: "constitutional"
criticality: "HIGH"
path: "src/lib/oraculo/oraculo-canonical-rules-1-50.ts"
integrityHash: "a01e6f33055d2a87"
---

# Regla 23: Depósito Stripe Price-Lock de 100,00 €

- **ID**: `RULE-23`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-1-50.ts`
- **Hash de Integridad**: `a01e6f33055d2a87`

## Metadatos
```json
{
  "ruleId": 23,
  "block": 3,
  "blockTitle": "Riesgo Invertido, Fianza & Filtro de Reputación",
  "title": "Depósito Stripe Price-Lock de 100,00 €",
  "directive": "Congelar la fecha en el calendario mediante un depósito universal de 100,00 € deducible al 100% de la liquidación final."
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
