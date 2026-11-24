---
id: "RULE-70"
name: "Regla 70: Ficha Visual Interactiva con Cotas Métricas & Vídeo Demostrativo"
type: "constitutional"
criticality: "HIGH"
path: "src/lib/oraculo/oraculo-canonical-rules-61-70.ts"
integrityHash: "0dc9b1a56cfb45d5"
---

# Regla 70: Ficha Visual Interactiva con Cotas Métricas & Vídeo Demostrativo

- **ID**: `RULE-70`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-61-70.ts`
- **Hash de Integridad**: `0dc9b1a56cfb45d5`

## Metadatos
```json
{
  "ruleId": 70,
  "block": 7,
  "blockTitle": "Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato",
  "title": "Ficha Visual Interactiva con Cotas Métricas & Vídeo Demostrativo",
  "directive": "La visualización en catálogo y modal técnico debe exhibir selector de variantes, cotas métricas del fabricante (alto x ancho x fondo), consumo eléctrico en vatios, peso estructural en kg y enlace a vídeo demostrativo cuando esté indexado."
}
```

## Dependencias Salientes (Outgoing)
- **governs->executes** -> [[DOMAIN-CATALOGO-LUCES]]
- **governs->executes** -> [[DATASET-LUCES-NAVIDAD]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
