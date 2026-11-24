---
id: "RULE-61"
name: "Regla 61: Doble Vertiente: Contrato Menor B2G & Alto Ticket Privado"
type: "constitutional"
criticality: "CRITICAL"
path: "src/lib/oraculo/oraculo-canonical-rules-61-70.ts"
integrityHash: "0dc9b1a56cfb45d5"
---

# Regla 61: Doble Vertiente: Contrato Menor B2G & Alto Ticket Privado

- **ID**: `RULE-61`
- **Tipo**: `constitutional`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-61-70.ts`
- **Hash de Integridad**: `0dc9b1a56cfb45d5`

## Metadatos
```json
{
  "ruleId": 61,
  "block": 7,
  "blockTitle": "Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato",
  "title": "Doble Vertiente: Contrato Menor B2G & Alto Ticket Privado",
  "directive": "El catálogo de iluminación monumental opera bajo bifurcación estricta: canalización de contratos menores para Ayuntamientos e instituciones (< 14.250 / 14.500 € bajo LCSP) y paquetes de alquiler o venta para bodas de lujo, fincas y hoteles."
}
```

## Dependencias Salientes (Outgoing)
- **governs->executes** -> [[DOMAIN-CATALOGO-LUCES]]
- **governs->executes** -> [[DATASET-LUCES-NAVIDAD]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
