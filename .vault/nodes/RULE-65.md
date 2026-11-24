---
id: "RULE-65"
name: "Regla 65: Custodia Estacional & Rotación Intermunicipal 3D"
type: "constitutional"
criticality: "CRITICAL"
path: "src/lib/oraculo/oraculo-canonical-rules-61-70.ts"
integrityHash: "0dc9b1a56cfb45d5"
---

# Regla 65: Custodia Estacional & Rotación Intermunicipal 3D

- **ID**: `RULE-65`
- **Tipo**: `constitutional`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-61-70.ts`
- **Hash de Integridad**: `0dc9b1a56cfb45d5`

## Metadatos
```json
{
  "ruleId": 65,
  "block": 7,
  "blockTitle": "Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato",
  "title": "Custodia Estacional & Rotación Intermunicipal 3D",
  "directive": "El servicio incluye la gestión integral del ciclo de vida del motivo: transporte, anclaje homologado, desmontaje, almacenamiento con atmósfera controlada en nave y programa de rotación intermunicipal para que ningún municipio repita el mismo elemento dos años seguidos."
}
```

## Dependencias Salientes (Outgoing)
- **governs->executes** -> [[DOMAIN-CATALOGO-LUCES]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
