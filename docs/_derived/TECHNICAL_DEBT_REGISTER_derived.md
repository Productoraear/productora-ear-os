<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\release\TECHNICAL_DEBT_REGISTER.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: 576E5EA672A97C5AB0A339ECAD5D5391394737A89571EBA984F79E2FAD702CCA
  Freshness Score: 100/100
  Mode: HUMAN_CANONICAL | Status: FRESH
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# TECHNICAL DEBT REGISTER

| ID | Severidad | Dominio | Ruta/Símbolo | Hecho verificable | Estado | Gate |
|---|---|---|---|---|---|---|
| TD-001 | P0 | Seguridad/Edge | `src/middleware.ts` | Middleware creado: protege `/dashboard`, `/nexus`, `/admin`, `/vault`, `/artist` via cookie `ear_auth_signal` | ✅ PASS | Auth |
| TD-002 | P0 | Seguridad/API | `src/app/api/nexus/user/sync/route.ts` | JWT validado via `adminAuth.verifyIdToken()`. 401 sin token. `UserService` asigna `EXPLORADOR`. | ✅ PASS | Auth/Data |
| TD-003 | P0 | Pagos | `src/app/api/webhooks/stripe/route.ts` | Código asume `STRIPE_WEBHOOK_SECRET`. Presencia en Vercel no verificada. | 🔲 REQUIERE_VALIDACIÓN | Pagos |
| TD-004 | P2 | Analítica | `src/app/layout.tsx` | Sin Clarity/GA. No bloqueante MVP. | DEFERRED | SEO |
| TD-005 | — | Build | Build local | `npx next build` exit 0, 3386 rutas, TypeScript verde. | ✅ PASS | Build |
