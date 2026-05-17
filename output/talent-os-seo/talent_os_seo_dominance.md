# talent_os_seo_dominance.md

## 1. Matriz Cerrada de 200 Landings
- Se publica una matriz priorizada de 200 URLs con tres silos: B2G, B2C Premium y Geo.
- Prioridad máxima para ayuntamientos de Teruel, Soria, Segovia, Guadalajara y Cuenca.
- Prioridad alta para centros de día y residencias de la España vaciada.
- B2C premium para bodas, aniversarios y cumpleaños en capitales.
- GEO para provincias y municipios con tracción territorial.

## 2. Reglas de Escalado
- No se generan páginas vacías.
- Cada landing debe tener contenido único.
- El tab SEO Matrix en /artists/dashboard supervisa indexación, leads y depósitos.
- El sitemap distribuye prioridades entre 0.90 y 0.80 para el swarm general.

## 3. Blueprint de Integración
- Raíz: /artistas.
- CEO / artista principal: /artistas/edwin-agudelo.
- Silo B2G: /artistas/ayuntamientos/*, /artistas/centros-de-dia/*, /artistas/residencias/*.
- Silo B2C: /artistas/bodas/*, /artistas/aniversarios/*, /artistas/cumpleanos/*.
- Silo GEO: /artistas/provincias/*, /artistas/municipios/*, /artistas/pueblos/*.


## 4. Sitemap Skeleton
- /artistas/edwin-agudelo (1.0, always)
- Core B2G 1-20 (0.90, weekly)
- Geo 21-100 (0.80, weekly)
- Long-tail 101-200 (0.70, noindex until lead)

## 5. Publishing Gates
- Gate A: 20 URLs núcleo.
- Gate B: 100 URLs validas.
- Gate C: 200 URLs con leads y CTR reales.
- Gate D: Escala a 2000 solo si conversiones superan el umbral definido por dashboard.


## 6. Sitemaps & Runtime Rules
- `/artistas/edwin-agudelo` is the SSOT and must remain priority 1.0.
- Core B2G landings stay at 0.90 weekly.
- GEO landings 21-100 stay at 0.80 weekly.
- Long-tail 101-200 stay at 0.70 and may use noindex until lead.
- Matrix URLs are sourced from `HIGH_VALUE_VARIANTS` and the 200-row CSV.

## 7. Publishing Gates
- Gate A: 20 URLs núcleo.
- Gate B: 100 URLs validadas.
- Gate C: 200 URLs cerradas.
- Gate D: 2000 URLs only if dashboard conversion warrants expansion.
