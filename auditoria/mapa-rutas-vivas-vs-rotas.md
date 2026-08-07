# 🚦 BLOQUE 0 — MAPA DE RUTAS VIVAS VS. ROTAS

> **Mapa de Rutas y Endpoints:** Clasificación de salud de todas las URLs.

---

## 1. Rutas Públicas (100% Funcionales)
- `GET /` -> ✅ Carga Correcta.
- `GET /artistas` -> ✅ Carga Correcta.
- `GET /artistas/[slug]` -> ✅ Carga Correcta.
- `POST /api/rag/query` -> ✅ Carga Correcta (Fallback DB Local OK).

## 2. API Routes Auditees (0 Rotas)
- Todas las 27 rutas duplicate `.js` fueron sustituidas por `.ts` puros.
