---
id: "DOMAIN-EDWIN-AGUDELO"
name: "Edwin Agudelo (Paciente Cero Artista)"
type: "domain"
criticality: "CRITICAL"
path: "src/lib/constants/ear-os-ssot.ts"
integrityHash: "35732863db863910"
---

# Edwin Agudelo (Paciente Cero Artista)

- **ID**: `DOMAIN-EDWIN-AGUDELO`
- **Tipo**: `domain`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/lib/constants/ear-os-ssot.ts`
- **Hash de Integridad**: `35732863db863910`

## Metadatos
```json
{
  "artistId": "e78903",
  "basePriceEur": 350,
  "standardPriceEur": 550,
  "includedKm": 100,
  "baseLocation": "Méntrida"
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
- [[ROUTE-/artistas/analytics]] -> **depends_on**
- [[ROUTE-/artistas/bio]] -> **depends_on**
- [[ROUTE-/artistas/bookings]] -> **depends_on**
- [[ROUTE-/artistas/contracts]] -> **depends_on**
- [[ROUTE-/artistas/media]] -> **depends_on**
- [[ROUTE-/artistas/pricing]] -> **depends_on**
- [[ROUTE-/artistas/profile]] -> **depends_on**
- [[ROUTE-/artistas/repertoire]] -> **depends_on**
- [[ROUTE-/artistas/settings]] -> **depends_on**
- [[ROUTE-/artistas/aniversarios]] -> **depends_on**
- [[ROUTE-/artistas/bodas]] -> **depends_on**
- [[ROUTE-/artistas/ciudades]] -> **depends_on**
- [[ROUTE-/artistas/cumpleanos]] -> **depends_on**
- [[ROUTE-/artistas/cumpleaños]] -> **depends_on**
- [[ROUTE-/artistas/dashboard]] -> **depends_on**
- [[ROUTE-/artistas/djs]] -> **depends_on**
- [[ROUTE-/artistas/edwin-agudelo]] -> **depends_on**
- [[ROUTE-/artistas/eventos]] -> **depends_on**
- [[ROUTE-/artistas/ferias]] -> **depends_on**
- [[ROUTE-/artistas/festivales]] -> **depends_on**
- [[ROUTE-/artistas/mariachis]] -> **depends_on**
- [[ROUTE-/artistas/municipios]] -> **depends_on**
- [[ROUTE-/artistas/orquestas]] -> **depends_on**
- [[ROUTE-/artistas]] -> **depends_on**
- [[ROUTE-/artistas/provincias]] -> **depends_on**
- [[ROUTE-/artistas/reclamar-regalias]] -> **depends_on**
- [[ROUTE-/artistas/representacion]] -> **depends_on**
- [[ROUTE-/artistas/shows]] -> **depends_on**
- [[ROUTE-/artistas/solistas]] -> **depends_on**
- [[ROUTE-/artistas/[slug]/booking]] -> **depends_on**
- [[ROUTE-/artistas/[slug]]] -> **depends_on**
- [[ROUTE-/artistas/estudio]] -> **depends_on**
- [[ROUTE-/reservar/solista]] -> **depends_on**
