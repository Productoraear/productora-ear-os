---
id: "RULE-71"
name: "Regla 71: Rider Eléctrico & Suministro Trifásico Homologado"
type: "constitutional"
criticality: "HIGH"
path: "src/lib/oraculo/oraculo-canonical-rules-71-80.ts"
integrityHash: "83d7ea32bcbd2a66"
---

# Regla 71: Rider Eléctrico & Suministro Trifásico Homologado

- **ID**: `RULE-71`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-71-80.ts`
- **Hash de Integridad**: `83d7ea32bcbd2a66`

## Metadatos
```json
{
  "ruleId": 71,
  "block": 8,
  "blockTitle": "Seguridad Operativa, Cumplimiento Normativo & Arbitraje Soberano",
  "title": "Rider Eléctrico & Suministro Trifásico Homologado",
  "directive": "El suministro eléctrico adecuado (acometida CETAC 32A/63A trifásica con toma de tierra verificada) es responsabilidad exclusiva del contratante o del recinto; en su defecto, Productora EAR provee de forma opcional grupo electrógeno insonorizado homologado con cuadro de distribución regulado."
}
```

## Dependencias Salientes (Outgoing)
- **governs->executes** -> [[DOMAIN-OTZARRETA]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
