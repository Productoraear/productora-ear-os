# 📊 EAR OS — EXISTING HIGH-PERFORMING URLS AUDIT

> **Audit de Rendimiento & Tráfico:** Identificación de URLs canónicas con mejor rendimiento en GSC, Clarity, indexación y conversión dentro del repositorio.

---

## 1. URLs Canónicas Principales & Preservación Obligatoria

| Path URL Expuesto | Estado Indexación | Rendimiento / CTR | Rol en el Sistema | Criterio de Preservación |
|---|---|---|---|---|
| `/` | Canónica Indexada | Alto (Punto de entrada principal) | Home / Landing Comercial | **PRESERVAR & POTENCIAR (100%)** |
| `/artistas` | Canónica Indexable | Alto (Catálogo S-Class) | Discovery / Filtros | **PRESERVAR (`● Ready` Preview)** |
| `/artistas/edwin-agudelo` | Canónica Target | Alta intención transaccional | Perfil Maestro Artista-Empresario | **RECONSTRUIR (Step 1.3 Target)** |
| `/presupuesto` | Canónica Target | Alta conversión B2B/B2C | Cotizador ASTRA RAG | **RECONSTRUIR (Step 1.4 Target)** |

---

## 2. Mapa de Canónicas & Prevención de Canibalización (Canonical Policy)
- **Regla Meta Tag Canonical:** Toda landing programática `/landings/[slug]` debe incluir la etiqueta `<link rel="canonical" href="https://productoraear.com/landings/[slug]" />`.
- **Sitemap Index Protocol:** Integración en `src/app/sitemap.ts` dividido por sitemaps secundarios: `sitemap-pages.xml`, `sitemap-artists.xml`, `sitemap-landings-es.xml`, `sitemap-landings-eu.xml`.
