# 🗺️ EAR OS — SITEMAP & CANONICAL GOVERNANCE AUDIT

> **Audit de Sitemap & Canónicas:** Gobernanza de indexación y estructura XML seguras para Next.js 15 App Router (`src/app/sitemap.ts`).

---

## 1. Arquitectura de Sitemap Segmentado (Google Search Console Best Practices)
- **Sitemap Principal:** `https://productoraear.com/sitemap.xml` (Sitemap Index)
- **Sitemaps Secundarios:**
  - `sitemap-core.xml`: `/`, `/artistas`, `/presupuesto`, `/login`.
  - `sitemap-artists.xml`: `/artistas/[slug]`.
  - `sitemap-landings-spain.xml`: Landings programáticas por provincia (50 Provincias).
  - `sitemap-landings-europe.xml`: Landings programáticas por capital europea (28 Capitales).

---

## 2. Reglas de Indexación & Robots (`src/app/robots.ts`)
- **Rutas Permitidas:** `/`, `/artistas`, `/artistas/*`, `/landings/*`, `/directorio/*`.
- **Rutas Bloqueadas (`Disallow`):** `/admin/*`, `/studio/*`, `/api/*`, `/track/[token]` (Token privado).
