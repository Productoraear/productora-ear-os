# ⚙️ BLOQUE 0 — MAPA INTEGRAL DE FUNCIONES Y MÓDULOS

> **Catálogo Canónico de Entidades y Código:** Registro detallado de páginas, layouts, componentes, hooks, API routes, webhooks y servicios.

---

## 1. Catalogación Atómica

### Páginas & Layouts
- **`PAG-01`**: `src/app/page.tsx` -> Showcase Principal. Estado: `✅ HECHO`.
- **`PAG-02`**: `src/app/artistas/page.tsx` -> Marketplace de Artistas. Estado: `✅ HECHO`.
- **`PAG-03`**: `src/app/artistas/[slug]/page.tsx` -> Perfil Maestro Edwin Agudelo. Estado: `✅ HECHO`.
- **`PAG-04`**: `src/app/(nexus)/centro-mando/page.tsx` -> Centro de Mando Logístico. Estado: `✅ HECHO`.

### API Routes & Webhooks
- **`API-01`**: `src/app/api/rag/query/route.ts` -> Engine RAG con Local DB Fallback. Estado: `✅ HECHO`.
- **`API-02`**: `src/app/api/webhooks/stripe/route.ts` -> Pasarela de Pagos Stripe HMAC. Estado: `⚠️ EN_PROCESO`.
- **`API-03`**: `src/app/api/fleet/map/route.ts` -> Telemetría de Flota y GPS Live. Estado: `✅ HECHO`.

### Services & Ingestors
- **`SVC-01`**: `scripts/knowledge-ingestion.ts` -> Ingestor de 375 Markdown specs. Estado: `✅ HECHO`.
- **`SVC-02`**: `src/lib/services/auth_nexus.ts` -> Autenticación Client Nexus. Estado: `✅ HECHO`.
