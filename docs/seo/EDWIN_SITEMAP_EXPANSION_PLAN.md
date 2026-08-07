# 🗺️ EAR OS — SITEMAP EXPANSION PLAN (SEO)

> **Plan de Expansión del Sitemap:** Estrategia segura para inyectar miles de combinaciones de alta intención sin incurrir en penalizaciones por contenido duplicado (Doorway Pages).

---

## 1. Arquitectura de Sitemaps Secundarios
Para mantener el crawling eficiente, el `sitemap.xml` maestro se divide en:
- `sitemap-core.xml` (Rutas estáticas, home, presupuesto)
- `sitemap-artists.xml` (Perfiles y showreels)
- `sitemap-landings-bodas.xml` (Vertical nupcial geo-localizada)
- `sitemap-landings-cumpleanos.xml` (Vertical de cumpleaños y serenatas)
- `sitemap-landings-b2b.xml` (Vertical de empresas, hoteles y ayuntamientos)
- `sitemap-directorio-[region].xml` (Sistema municipal masivo)

## 2. Inyección Anti-Doorway (Contenido Único Mínimo 40%)
Ninguna URL entrará al sitemap a menos que contenga:
1. **Hero Title & Subtitle Únicos:** Generados dinámicamente según Ocasión + Formato + Ciudad.
2. **Review Geolocalizada:** Si la landing es de Madrid, debe inyectar reviews de "Finca La Estación" o lugares reales de Madrid. Si no hay review local, inyecta review genérica S-Class de Productora EAR.
3. **Bloque FAQ Contextual:** Preguntas específicas (ej. Si es boda: *"¿Tocan durante el cóctel o el banquete?"*; Si es serenata: *"¿Cómo mantenemos la sorpresa?"*).

## 3. Gobernanza & Actualización
- **Regla:** El script generador de URLs dinámicas actualiza los sitemaps automáticamente en build time (`next build`) y hace ping a GSC (Google Search Console API) cuando una nueva vertical (ej. B2B) se libera a producción.
