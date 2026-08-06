# MVP GO / NO-GO CHECKLIST

**Última actualización:** 2026-08-06T20:14 CEST

| Gate / Evidencia Requerida | Entorno | Estado | Evidencia |
|---|---|---|---|
| **Build y Compilación** | | | |
| Typecheck verde | Local | ✅ PASS | Integrado en `npx next build`, exit 0 |
| Lint sin errores bloqueantes | Local | ✅ PASS | Build exit 0 sin lint blockers |
| Build de producción verde | Local | ✅ PASS | 3386 rutas, 11.6s compile |
| **Auth y Seguridad** | | | |
| `middleware.ts` protege rutas privadas | Local | ✅ PASS | 5 matchers, cookie signal |
| Validación JWT en `/api/nexus/user/sync` | Local | ✅ PASS | `adminAuth.verifyIdToken()` |
| Login / Logout / Redirects operativos | Preview | 🔲 PENDING | Requiere deploy |
| Variables de entorno comprobadas (presencia) | Vercel | 🔲 PENDING | Requiere acceso Vercel |
| **UX y Funcionalidad** | | | |
| Rutas críticas (Home, Checkout) no fallan | Preview | 🔲 PENDING | Requiere deploy |
| Manejo de errores (404, 500) | Preview | 🔲 PENDING | Requiere deploy |
| **Pagos (Stripe)** | | | |
| Stripe Webhook Signature Check configurado | Vercel | 🔲 PENDING | Código OK, env var sin verificar |
| Vercel tiene `STRIPE_WEBHOOK_SECRET` | Vercel | 🔲 PENDING | Requiere acceso Vercel |
| **Monitorización** | | | |
| Logs disponibles en Vercel | Vercel | 🔲 PENDING | Requiere deploy |
| Rollback planificado en Git | — | ✅ PASS | Git revert disponible |
