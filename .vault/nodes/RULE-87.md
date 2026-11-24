---
id: "RULE-87"
name: "Regla 87: Caducidad de Oferta a 15 Días & Price-Lock Condicionado a Depósito"
type: "constitutional"
criticality: "HIGH"
path: "src/lib/oraculo/oraculo-canonical-rules-81-90.ts"
integrityHash: "b1fbba2ebef9af23"
---

# Regla 87: Caducidad de Oferta a 15 Días & Price-Lock Condicionado a Depósito

- **ID**: `RULE-87`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-81-90.ts`
- **Hash de Integridad**: `b1fbba2ebef9af23`

## Metadatos
```json
{
  "ruleId": 87,
  "block": 9,
  "blockTitle": "Experiencia VIP, Resiliencia de Sala, Split & Fianza Soberana",
  "title": "Caducidad de Oferta a 15 Días & Price-Lock Condicionado a Depósito",
  "directive": "Las propuestas económicas tienen una validez legal estricta de 15 días naturales; el bloqueo de la fecha y la congelación de la tarifa frente a revisiones estacionales (Price-Lock) exigen la formalización del depósito canónico de 100,00 € deducible al 100%."
}
```

## Dependencias Salientes (Outgoing)
- **governs->executes** -> [[GATE-PRICE-LOCK]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
