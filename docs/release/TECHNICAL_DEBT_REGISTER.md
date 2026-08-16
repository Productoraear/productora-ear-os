# TECHNICAL DEBT REGISTER (RECONCILIACIÓN CONTINUA)

| ID | Severidad | Dominio | Ruta/Símbolo | Hecho verificable | Estado | Gate |
|---|---|---|---|---|---|---|
| TD-001 | P0 | Seguridad/Edge | `src/middleware.ts` | Middleware creado: protege `/admin`, `/nexus`, `/dashboard`, `/vault`, `/artist`, `/studio` via cookies `ear_auth_signal` y `ear_os_auth_token` | ✅ PASS | Auth |
| TD-002 | P0 | Seguridad/API | `src/app/api/nexus/user/sync/route.ts` | JWT validado via `adminAuth.verifyIdToken()`. 401 sin token. `UserService` asigna `EXPLORADOR`. | ✅ PASS | Auth/Data |
| TD-003 | P0 | Pagos | `src/app/api/webhooks/stripe/route.ts` | Código preserva firma `Stripe-Signature`, cuerpo crudo y fallback de desarrollo limpio. | ✅ PASS | Pagos |
| TD-004 | P1 | Automatización | `vercel.json` & `/api/cron/obsidian-sync` | Cron alineado con endpoint existente de vectorización Obsidian RAG. | ✅ PASS | Infra |
| TD-005 | P1 | SEO/Indexación | `src/app/sitemap.ts` & `src/app/robots.ts` | `/afiliados`, `/presupuesto` y catálogo indexados; rutas admin disallow. | ✅ PASS | SEO |
| TD-006 | P0 | UX/Contraste | `src/app/globals.css` & `NeuralJourneyApex.tsx` | Modo Aura Onyx (#050505) bloqueado, inputs y selects con contraste puro blanco/oro. | ✅ PASS | UX |
| TD-007 | — | Build | Build local & Remote Git | `npx tsc --noEmit` exit 0, cero errores de compilación en main. | ✅ PASS | Build |

