---
id: "DOMAIN-CALL-CENTER"
name: "Centralita Canónica EAR OS (+34 693 693 048)"
type: "domain"
criticality: "CRITICAL"
path: "src/lib/constants/ear-os-ssot.ts"
integrityHash: "7f153d381ae3c080"
---

# Centralita Canónica EAR OS (+34 693 693 048)

- **ID**: `DOMAIN-CALL-CENTER`
- **Tipo**: `domain`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/lib/constants/ear-os-ssot.ts`
- **Hash de Integridad**: `7f153d381ae3c080`

## Metadatos
```json
{
  "phone": "+34 693 693 048",
  "serviceSla": "24/7"
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
- [[RULE-92]] -> **governs->executes**
