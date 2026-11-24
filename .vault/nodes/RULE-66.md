---
id: "RULE-66"
name: "Regla 66: Logística Pesada: Transporte Especial por Cubicaje"
type: "constitutional"
criticality: "HIGH"
path: "src/lib/oraculo/oraculo-canonical-rules-61-70.ts"
integrityHash: "0dc9b1a56cfb45d5"
---

# Regla 66: Logística Pesada: Transporte Especial por Cubicaje

- **ID**: `RULE-66`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-61-70.ts`
- **Hash de Integridad**: `0dc9b1a56cfb45d5`

## Metadatos
```json
{
  "ruleId": 66,
  "block": 7,
  "blockTitle": "Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato",
  "title": "Logística Pesada: Transporte Especial por Cubicaje",
  "directive": "Todo elemento clasificado como gran formato o motivo 3D transitable se etiqueta bajo el concepto canónico «Transporte Especial / A Consultar», requiriendo cálculo logístico personalizado según radio kilométrico y necesidad de grúa pluma visada."
}
```

## Dependencias Salientes (Outgoing)
- **governs->executes** -> [[DOMAIN-CATALOGO-LUCES]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
