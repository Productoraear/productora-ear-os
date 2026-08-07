# 📏 EAR OS — LOCAL PAGE UNIQUENESS RULES

> **Reglas de Unicidad de Páginas Locales (Anti-Doorway Governance):** Criterios técnicos estritos para asegurar que cada landing geo-programática sea interpretada por Google Search Console como una página original con valor único.

---

## 1. Criterio de Diferenciación Mínima (Min 45% Content Variance)

Ninguna landing local se indexará en el sitemap si no cumple con las siguientes variaciones únicas:

1. **Unicidad de H1 y Hero Copy (100% Único):** No se permite la fórmula `[Mariachi] en [Ciudad]`. Se requiere combinación narrativa (ej. *"La Elegancia del Mariachi de Gala para Bodas en Madrid"* vs *"Solvencia Cultural y Grandes Shows para las Festejos de Toledo"*).
2. **Contexto Geográfico Real (Mínimo 2 Menciones Locales):** Cada página debe mencionar lugares emblemáticos reales de la zona (fincas, hoteles, plazas mayores).
3. **Módulo de Prueba Social Filtrado (100% Relevante):** Si la página es de Málaga, debe priorizar reviews de clientes de Andalucía o Costa del Sol.
4. **FAQ Logística Personalizada (Mínimo 2 Preguntas Específicas):** Preguntas sobre tiempos de desplazamiento reales desde la base logística de Productora EAR en Madrid.
5. **Schema.org LocalBusiness / Event:** Inyección dinámica de `areaServed`, `geo` coordinates y `priceRange` específico.

## 2. Automatización y Build Gates
- Durante el comando `npm run build`, un script de validación compara los vectores Jaccard/Cosine entre el HTML generado de dos landings locales de la misma vertical.
- **Gate Failure:** Si dos landings comparten más del 55% del texto exacto, el build falla y exige enriquecer la base de datos de contexto local.
