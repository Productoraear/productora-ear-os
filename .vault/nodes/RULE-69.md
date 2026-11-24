---
id: "RULE-69"
name: "Regla 69: Ventana de Tarifa Protegida & Recargo Estacional (+15%)"
type: "constitutional"
criticality: "HIGH"
path: "src/lib/oraculo/oraculo-canonical-rules-61-70.ts"
integrityHash: "0dc9b1a56cfb45d5"
---

# Regla 69: Ventana de Tarifa Protegida & Recargo Estacional (+15%)

- **ID**: `RULE-69`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-61-70.ts`
- **Hash de Integridad**: `0dc9b1a56cfb45d5`

## Metadatos
```json
{
  "ruleId": 69,
  "block": 7,
  "blockTitle": "Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato",
  "title": "Ventana de Tarifa Protegida & Recargo Estacional (+15%)",
  "directive": "La tarifa estándar del catálogo de iluminación tiene validez protegida y bloqueo de fecha garantizado hasta el 31 de octubre. A partir del 1 de noviembre, se aplica un recargo logístico de urgencia (+15%) por saturación de flota y montaje acelerado."
}
```

## Dependencias Salientes (Outgoing)
- **governs->executes** -> [[DOMAIN-CATALOGO-LUCES]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
