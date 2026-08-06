# MVP RELEASE DOSSIER - EAR OS (OMEGA v2.2)

**Fecha última reconciliación:** 2026-08-06T20:12 CEST
**Commit base:** `3d274961` (rama `consolidacion-aditiva`)
**Cambios pendientes de commit:** 27 archivos (1078+, 274−)
**Dictamen:** `LISTO_PARA_PREVIEW | BLOQUEADORES OPERATIVOS PENDIENTES`

## Alcance verificado
- Build de producción local (Next.js 16.2.12 Turbopack, 3386 rutas, exit 0).
- TypeScript integrado en build, sin errores de tipo.
- Middleware edge (`src/middleware.ts`) protegiendo rutas privadas.
- Validación JWT Firebase Admin en `/api/nexus/user/sync`.
- `UserService` sin escalada de privilegios por email.
- Eliminación de colisiones legacy (`proxy.ts/js`, stubs duplicados, casing).
- Corrección de imports, tipos y alias de tsconfig.

## Áreas no verificadas
- Entorno Vercel Preview/Production (sin deploy reciente).
- Presencia de variables `FIREBASE_ADMIN_*` y `STRIPE_WEBHOOK_SECRET` en Vercel.
- Smoke tests remotos (ST-01..ST-06).
- Pruebas E2E de pasarela de pagos con Stripe.

## Tabla de Gates

| Gate | Estado | Evidencia | Bloqueador |
|---|---|---|---|
| Build | ✅ PASS | `npx next build` exit 0, 3386 rutas | NO |
| TypeScript | ✅ PASS | Integrado en build, exit 0 | NO |
| Login/Auth (Edge) | ✅ PASS | `middleware.ts` existe, matcher configura 5 rutas protegidas | NO |
| Login/Auth (Server) | ✅ PASS | `/api/nexus/user/sync` valida JWT via `adminAuth.verifyIdToken()` | NO |
| RBAC | ✅ PASS | Nuevos usuarios → `EXPLORADOR`, sin escalada por email | NO |
| Datos/Seguridad | ✅ PASS | Identidad derivada exclusivamente de token Firebase verificado | NO |
| Pagos/Webhooks | 🔲 REQUIERE_VALIDACIÓN | Código implementado; `STRIPE_WEBHOOK_SECRET` en Vercel sin confirmar | Condicional |
| Rutas/UX | 🔲 REQUIERE_VALIDACIÓN | Pendiente de smoke tests remotos | NO |
| SEO/Analítica | DEFERRED (P2) | Sin Clarity/GA; no bloqueante MVP | NO |
| Preview/Deploy | 🔲 BLOCKED | Vercel CLI sin token válido | SÍ (operativo) |
| Rollback | ✅ PASS | Git revert disponible | NO |

## Bloqueadores operativos (no de código)
1. 27 archivos modificados sin commit — REQUIERE_APROBACIÓN_HUMANA.
2. Vercel CLI token inválido — Operador debe ejecutar `npx vercel login`.
3. Variables de entorno en Vercel Preview scope no verificadas.

## Backlog P2/P3
- Implementar Clarity en `layout.tsx` con manejo de consentimiento.
- Refinar tests unitarios de `pricing-engine.ts`.
