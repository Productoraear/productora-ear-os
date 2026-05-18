# EAR OS OMEGA PROMPTS — KIT V207+ (100 DIRECTIVAS)

## DOMINIO 1 — DISEÑO VISUAL (P001–P010)

P001 — DESIGN SYSTEM UPDATE
Tarea: Actualizar `src/app/globals.css` con el sistema de tokens EAR OS 2026.
Aplica: paleta Aura Void/Onyx/Slate, tipografía Syne+Inter+JetBrains, 8pt grid, glass layers y shadows.
No elimines variables existentes sin mapear cada una a su sucesor.
Valida: npx tsc --noEmit + npm run build + smoke visual en mobile.

P002 — HERO BENTO
Tarea: Refactorizar el componente HeroSection como Bento 3-col.
Usa Server Component. Extrae interactividad a un Client Component aislado.
Headline con gradient gold, 3 signal badges animados, CTA primario gold y CTA secundario ghost.
No rompas ISR ni SEO de la página raíz.

P003 — PROVIDER CARD S-CLASS
Tarea: Rediseñar ProviderCard con glass surface, badge dorado para isVerified,
diferenciación visual clara entre Roster Elite (gold) y huérfanos (ghost).
CTA Elite = "Reservar" (gold). CTA huérfano = "Reclamar" (outline).
Compatible con AtmosphereMatcherClient sin cambiar contratos de props.

P004 — COMMAND CENTER LAYOUT
Tarea: Actualizar CommandCenterDashboard con sidebar oscuro (aura-onyx),
iconografía monocromática, status dots en tiempo real (verde/ámbar/rojo),
y grid 12-col para las métricas internas.
No modificar lógica de RBAC ni polling de 30s.

P005 — CHECKOUT VISUAL FLOW
Tarea: Actualizar la página de checkout con fondo aura-void,
progress bar gold, resumen logístico lateral y tipografía mono para importes.
Accesibilidad: contraste mínimo 4.5:1 en todos los textos sobre fondos oscuros.

P006 — ATMOSPHERE MATCHER UI
Tarea: Rediseñar los chips de atmósfera con estado activo en gold,
grid de resultados con lazy reveal via IntersectionObserver,
y skeleton gold-pulse mientras carga.
No cambiar la Server Action getMatchingProviders.

P007 — STRIPE CONNECT GATE
Tarea: Actualizar StripeConnectGate con overlay aura-void + blur(16px),
ilustración soberana centrada, CTA "Verificar identidad fiscal" en gold prominente.
El overlay debe ser infranqueable: no puede cerrarse sin stripeConnected=true.

P008 — TYPOGRAPHY SCALE
Tarea: Definir escala tipográfica en `src/styles/typography.css`:
display-2xl (72px Syne 700), display-xl (56px), h1-h6, body-lg/md/sm, mono-lg/sm.
Aplicar en HeroSection, CommandCenter y ProviderCard como prueba de fuego.

P009 — DARK MODE SYSTEM AWARE
Tarea: Implementar prefers-color-scheme en globals.css con @media.
EAR OS es dark-first pero debe tener un skin light mínimo para accesibilidad.
No destruir la paleta Aura. El skin light usa ivory como fondo y onyx como texto.

P010 — MOTION SYSTEM
Tarea: Crear `src/styles/motion.css` con variables de duración y easing:
--ease-snappy (cubic-bezier(0.4,0,0.2,1)), --ease-gold (cubic-bezier(0.22,1,0.36,1)).
Aplicar en hover de cards, transición de overlay y progress bar de checkout.
No usar animaciones no compuestas (transform y opacity únicamente).

## DOMINIO 2 — STRIPE Y PAGOS (P011–P020)

P011 — GATE 1: STRIPE WEBHOOK ACCOUNT.UPDATED
Tarea: Confirmar configuración de account.updated en Stripe Dashboard.
Verificar que el endpoint apunta a https://productoraear.com/api/payments/webhook.
Registrar evidencia en SSOT como ✅ HECHO VERIFICADO con timestamp.

P012 — GATE 2: SMOKE TEST EXPRESS COMPLETO
Tarea: Ejecutar flujo completo de Stripe Connect Express en test mode.
Crear proveedor test, invocar createConnectOnboardingLink, completar KYC ficticio.
Verificar isVerified=true en PostgreSQL y notificación Telegram.
Bloquear apertura de V207 hasta evidencia verificada.

P013 — IDEMPOTENCY AUDIT
Tarea: Auditar todas las escrituras en CommissionLedger y AuraWallet.
Verificar que cada operación financiera tiene una referencia idempotente única.
Reportar cualquier codepath sin idempotencia como REQUIERE VALIDACIÓN.

P014 — CHECKOUT METADATA AUDIT
Tarea: Verificar que createEliteCheckout inyecta correctamente:
artistId, clientId, calculatedDistance, totalAmount, origin, destination.
Simular un checkout en test mode y verificar el objeto Session en Stripe Dashboard.

P015 — REFUND SCAFFOLD
Tarea: Crear scaffold de `src/app/actions/refundActions.ts` con:
`initiateRefund(ledgerId: string)` — solo rol ADMIN puede invocarla.
Stripe refund API + actualización de estado en CommissionLedger.
Schema aditivo: añadir campo `refundedAt DateTime?` a CommissionLedger.
No implementar UI todavía.

P016 — DISPUTE SCHEMA
Tarea: Añadir modelo `Dispute` a schema.prisma (aditivo):
id, stripeDisputeId, commissionLedgerId, amount, status, reason, createdAt.
Generar migración con prisma migrate dev --name add_dispute_model.
No implementar lógica de webhook todavía.

P017 — PAYOUT SCHEDULE SCHEMA
Tarea: Añadir modelo `PayoutSchedule` a schema.prisma (aditivo):
id, artistProfileId, interval (DAILY/WEEKLY/MONTHLY), nextPayoutAt, status.
Relación con AuraWallet. Migración aditiva.
No implementar lógica todavía.

P018 — SMART SPLIT AUDIT
Tarea: Verificar que el Smart Split V152 (80/10/10) se registra correctamente
en el campo `notes` de CommissionLedger para cada transacción.
Crear script de auditoría `scripts/audit-splits.ts` que lea los últimos 100 registros
y reporte si alguno tiene split incorrecto.

P019 — CRON SECRET GATE 3
Tarea: Añadir CRON_SECRET a Vercel Production.
Generar con: openssl rand -hex 32.
Disparar manualmente /api/cron/obsidian-sync con Bearer token.
Verificar log estructurado y notificación Telegram.
Registrar como ✅ HECHO VERIFICADO en SSOT.

P020 — WEBHOOK ROUTER TEST
Tarea: Crear test unitario `src/app/api/payments/webhook/route.test.ts`.
Simular eventos: checkout.session.completed y account.updated.
Verificar que el switch dispatcher invoca el handler correcto.
Verificar que eventos desconocidos retornan 200 con ignored:true.

## DOMINIO 3 — BASE DE DATOS Y PRISMA (P021–P030)

P021 — SCHEMA AUDIT ADITIVO
Tarea: Auditar schema.prisma completo.
Clasificar cada modelo como: CORE, LEGACY, SCAFFOLD, CUARENTENA.
Reportar columnas nullable sin uso activo como candidatas a deprecación futura.
No eliminar nada. Solo documentar.

P022 — INDICES DE RENDIMIENTO
Tarea: Añadir índices a: ProviderProfile(isVerified, stripeConnected),
CommissionLedger(reference), AuraWallet(userId), Waybill(status, workspaceId).
Migración aditiva. Verificar EXPLAIN ANALYZE antes y después.

P023 — SOFT DELETE PATTERN
Tarea: Añadir campo `deletedAt DateTime?` a User, ProviderProfile y ArtistProfile.
Actualizar queries de búsqueda para filtrar registros con deletedAt != null.
Migración aditiva. No eliminar registros físicamente en ningún nuevo codepath.

P024 — CONEXIÓN POOL AUDIT
Tarea: Verificar configuración de connection pooling en DATABASE_URL para Vercel.
Añadir `?pgbouncer=true&connection_limit=1` si no está presente.
Documentar en SSOT bajo "Infraestructura → PostgreSQL".

P025 — SEED DE TEST
Tarea: Crear `prisma/seed-test.ts` con:
1 User ADMIN, 1 ArtistProfile verificado (Edwin Agudelo), 1 ProviderProfile no verificado,
1 AuraWallet con balance 100, 1 CommissionLedger PAID.
Usar datos ficticios pero estructuralmente válidos para smoke tests.

P026 — MIGRATION HISTORY AUDIT
Tarea: Verificar que todas las migraciones en `prisma/migrations/` tienen
timestamps únicos y nombres descriptivos.
Reportar migraciones con nombre genérico o timestamp duplicado.

P027 — QUERY PERFORMANCE BASELINE
Tarea: Ejecutar y documentar tiempos de query para:
getMatchingProviders (top 10), CommissionLedger.findMany (últimos 100),
AuraWallet.findUnique por userId.
Registrar en SSOT como baseline de referencia para V207.

P028 — POSTGIS AUDIT
Tarea: Verificar que la extensión PostGIS está activa en la DB de producción.
Ejecutar: SELECT PostGIS_Version();
Si no está activa, añadir al script de setup: CREATE EXTENSION IF NOT EXISTS postgis;

P029 — FOREIGN KEY INTEGRITY
Tarea: Verificar integridad referencial de:
CommissionLedger.userId → User.id,
AuraWallet.userId → User.id,
Waybill.artistProfileId → ArtistProfile.id.
Reportar registros huérfanos si existen.

P030 — BACKUP POLICY
Tarea: Documentar política de backup de PostgreSQL en SSOT:
frecuencia, retención, procedimiento de restauración y prueba de restore.
Si el proveedor es Supabase o Neon, activar PITR (Point-in-Time Recovery).

## DOMINIO 4 — SEGURIDAD Y AUTH (P031–P040)

P031 — MIDDLEWARE AUDIT
Tarea: Auditar `middleware.ts` completo.
Verificar que todas las rutas admin/dashboard/portal tienen matchers correctos.
Reportar cualquier ruta que debería estar protegida y no lo está.

P032 — RBAC MATRIX AUDIT
Tarea: Auditar `src/lib/auth/permissions.ts`.
Verificar que userCan cubre: VIEW_FINANCIALS, TRIGGER_PAYOUT, MANAGE_PROVIDERS,
ACCESS_COMMAND_CENTER, INITIATE_REFUND, VIEW_DISPUTES.
Añadir permisos faltantes sin romper los existentes.

P033 — FIREBASE CLAIMS AUDIT
Tarea: Verificar que los Custom Claims JWT de Firebase incluyen: role, rank, workspaceId.
Crear script de verificación `scripts/verify-claims.ts` que lea claims de un usuario test.
Documentar el flujo de asignación de claims en el vault de Obsidian.

P034 — RATE LIMIT AUDIT
Tarea: Verificar que isRateLimited está activo en:
checkout (5/min), matcher (10/min), onboarding (3/min), claim (5/min).
Añadir rate limit a /api/health (20/min) para prevenir abuso de monitoreo.

P035 — SHIELD AUDIT
Tarea: Auditar `src/lib/security/shield.ts`.
Verificar que los patrones de User-Agent bloqueados están actualizados.
Añadir patrones 2026: AI scrapers conocidos, bots de agregación.
No bloquear Googlebot ni Bingbot.

P036 — CSRF PROTECTION
Tarea: Verificar que todas las Server Actions tienen validación de origen.
Next.js 16 incluye protección CSRF nativa para Server Actions.
Confirmar que no se ha desactivado en ningún middleware o configuración.

P037 — SECRETS AUDIT
Tarea: Ejecutar: git log --all --full-history -- "*.env*"
Verificar que no hay secrets comprometidos en el historial de Git.
Si existen, ejecutar rotación de keys en Stripe, Firebase y Vercel.

P038 — HEADERS DE SEGURIDAD
Tarea: Verificar headers en next.config.ts:
Content-Security-Policy, X-Frame-Options, X-Content-Type-Options,
Referrer-Policy, Permissions-Policy.
Añadir los que falten sin romper el funcionamiento de Stripe.js.

P039 — AUTH EDGE AUDIT
Tarea: Verificar que la verificación de sesión en el middleware de Edge
no hace queries a PostgreSQL (prohibido en Edge Runtime).
Solo Firebase token verification en Edge. Prisma solo en Node.js runtime.

P040 — PENETRATION CHECKLIST
Tarea: Ejecutar checklist de seguridad básico:
1. SQL injection via Prisma (ORM protege, verificar queries raw).
2. XSS en inputs de búsqueda y formularios.
3. IDOR en rutas /api/profiles/[id].
4. Exposición de stripeAccountId en respuestas públicas.
Documentar resultado en vault de Obsidian → 04-Security.

## DOMINIO 5 — SEO E ISR (P041–P050)

P041 — SITEMAP AUDIT
Tarea: Auditar `src/app/sitemap.ts`.
Verificar que todas las rutas de artistas, provincias, atmósferas y servicios
están incluidas con lastModified y changeFrequency correctos.
Verificar que rutas admin/dashboard/portal están excluidas del sitemap.

P042 — ROBOTS AUDIT
Tarea: Auditar `src/app/robots.ts`.
Bloquear: /api/*, /admin/*, /dashboard/*, /(artist)/*, /_next/*.
Permitir: /artistas/*, /artists/*, /events/*, /bodas/*, /provincias/*.
Verificar con Google Search Console.

P043 — CANONICAL AUDIT
Tarea: Verificar que todas las páginas tienen canonical URL declarada en metadata.
Priorizar: homepage, páginas de artistas, páginas de provincias, páginas de atmósferas.
Reportar páginas sin canonical como REQUIERE VALIDACIÓN.

P044 — JSON-LD AUDIT
Tarea: Verificar JSON-LD en páginas de artistas: Organization, Person, Event, Service.
Validar con schema.org Validator.
Añadir BreadcrumbList en páginas de categorías y provincias.

P045 — ISR COST AUDIT
Tarea: Verificar revalidate en todas las rutas con generación estática.
Páginas de artistas: revalidate 3600. Provincias: revalidate 86400.
HomePage: revalidate 300. Reportar páginas con revalidate 0 innecesario.

P046 — CORE WEB VITALS BASELINE
Tarea: Ejecutar Lighthouse en producción sobre:
homepage, /artistas/[slug], /reclamar-perfil, /checkout.
Documentar LCP, TBT, CLS como baseline en SSOT.
Objetivo: LCP < 2.5s, TBT < 200ms, CLS < 0.1.

P047 — IMAGE OPTIMIZATION
Tarea: Verificar que todas las imágenes usan next/image con:
width, height, alt, priority (solo above-the-fold), sizes correcto.
Reportar imágenes sin optimizar como REQUIERE VALIDACIÓN.

P048 — OPEN GRAPH AUDIT
Tarea: Verificar OG tags en homepage, artistas y páginas de categorías:
og:title, og:description, og:image (1200x630), og:type, og:url.
Validar con OpenGraph.xyz.

P049 — HREFLANG AUDIT
Tarea: Verificar implementación de hreflang para rutas en español e inglés:
/artistas vs /artists, /bodas vs /weddings.
Si no existe, implementarlo en generateMetadata de cada ruta bilingüe.

P050 — SEARCH CONSOLE SETUP
Tarea: Verificar que Google Search Console tiene verificación activa para productoraear.com.
Enviar sitemap manualmente si no se ha hecho.
Documentar en SSOT: fecha de envío y estado de indexación.

## DOMINIO 6 — RENDIMIENTO (P051–P060)

P051 — BUNDLE ANALYSIS
Tarea: Ejecutar ANALYZE=true npm run build.
Identificar los 3 paquetes más pesados del bundle cliente.
Proponer lazy import o dynamic() para cada uno sin romper funcionalidad.

P052 — TERCEROS AUDIT
Tarea: Identificar todos los scripts de terceros cargados en el cliente:
Stripe.js, Firebase SDK, Analytics, Fonts.
Verificar que Stripe.js se carga con strategy="lazyOnload" donde no es crítico.

P053 — HYDRATION AUDIT
Tarea: Verificar que no hay errores de hidratación en consola del browser.
Ejecutar en Chrome DevTools: buscar "Hydration failed" o "did not match".
Aislar componentes con mismatch SSR/CSR y clasificarlos.

P054 — FONT OPTIMIZATION
Tarea: Verificar que Syne e Inter se cargan con next/font/google.
display: 'swap', preload: true, subset: ['latin'].
No cargar fuentes via @import en CSS (bloquea render).

P055 — CODE SPLITTING AUDIT
Tarea: Verificar que AtmosphereMatcherClient, CommandCenterDashboard
y StripeConnectGate se cargan con dynamic() + ssr:false donde aplica.
No aplicar ssr:false a componentes que necesitan datos en servidor.

P056 — PREFETCH STRATEGY
Tarea: Verificar que los Link de navegación principal usan prefetch={true}.
Verificar que links de páginas profundas (provincias, artistas) usan prefetch={false}
para no saturar el network en la homepage.

P057 — CSS UNUSED AUDIT
Tarea: Ejecutar PurgeCSS o inspección manual de clases no utilizadas en globals.css.
Reportar clases Tailwind o custom que no aparecen en ningún componente.
No eliminar variables CSS (se usan en runtime).

P058 — LCP OPTIMIZATION
Tarea: Identificar el elemento LCP en homepage y página de artista.
Si es una imagen, añadir priority={true} y fetchpriority="high".
Si es texto, verificar que la fuente no está bloqueando el render.

P059 — ANIMATION PERFORMANCE
Tarea: Verificar que todas las animaciones en motion.css usan
solo transform y opacity (compositor layers).
Reportar cualquier animación que use top, left, width o height como REQUIERE VALIDACIÓN.

P060 — VERCEL ANALYTICS
Tarea: Activar Vercel Speed Insights en el proyecto.
Añadir <SpeedInsights /> en el layout raíz.
Verificar que los datos aparecen en el dashboard de Vercel tras el primer deploy.

## DOMINIO 7 — OBSIDIAN Y RAG (P061–P070)

P061 — VAULT AUDIT
Tarea: Verificar estructura del vault en docs/memoria EAR OS/.
Confirmar existencia de las 7 carpetas y 12 notas canónicas.
Reportar notas desactualizadas (> 48h sin actualizar) como HIPÓTESIS.

P062 — INGESTOR SMOKE TEST
Tarea: Ejecutar obsidianIngestor.ts manualmente sobre el vault.
Verificar que extrae correctamente: title, tags, headings, backlinks, body limpio.
Verificar que los fragmentos tienen longitud > 50 chars y < 2000 chars.

P063 — CRON SYNC VERIFICATION
Tarea: Completar Gate 3 de V207.
Disparar /api/cron/obsidian-sync con Bearer CRON_SECRET.
Verificar log estructurado: fragmentos procesados, errores, duración.

P064 — ADR TEMPLATE
Tarea: Crear plantilla en docs/memoria EAR OS/07-decisions/ADR-TEMPLATE.md.
Campos: título, fecha, estado (propuesta/aceptada/rechazada/obsoleta),
contexto, decisión, consecuencias, alternativas consideradas.

P065 — INCIDENT POSTMORTEM
Tarea: Documentar el incidente del archivo bloqueante >164MB en Git
como postmortem en docs/memoria EAR OS/06-incidents/INC-001.md.
Formato: resumen, impacto, causa raíz, acciones, lecciones.

P066 — RUNBOOK DEPLOY
Tarea: Crear/actualizar docs/memoria EAR OS/03-runbooks/DEPLOY.md con:
1. Pre-checks. 2. Git push a main. 3. Verificación de Vercel.
4. Smoke test de producción. 5. Rollback procedure.

P067 — RUNBOOK ROLLBACK
Tarea: Crear docs/memoria EAR OS/03-runbooks/ROLLBACK.md con:
git revert vs git reset. Comandos exactos. Cuándo usar cada uno.
Impacto en DB si el código revertido incluye migraciones.

P068 — ARCHITECTURE NOTE
Tarea: Actualizar docs/memoria EAR OS/01-arquitectura/SCHEMA.md
con el estado actual: modelos Dispute y PayoutSchedule añadidos,
flags isVerified/stripeConnected, índices de rendimiento.

P069 — SECURITY RUNBOOK
Tarea: Crear docs/memoria EAR OS/04-security/HARDENING.md con:
headers de seguridad activos, rate limits por endpoint,
shield patterns, procedimiento de rotación de secrets.

P070 — VAULT SYNC POLICY
Tarea: Definir en SSOT la política de actualización del vault:
toda decisión arquitectónica → ADR. Todo incidente → postmortem.
Todo deploy → entrada en DEPLOY.md. Revisión semanal de notas desactualizadas.

## DOMINIO 8 — TESTING Y CALIDAD (P071–P080)

P071 — E2E CHECKOUT TEST
Tarea: Completar e2e/checkout-flow.spec.ts con Playwright.
Flujo completo: homepage → seleccionar atmósfera → elegir artista →
checkout → verificar redirect a Stripe test. iPhone 13 emulation.

P072 — E2E CLAIM PROFILE TEST
Tarea: Crear e2e/claim-profile.spec.ts.
Flujo: buscar proveedor → clic "Reclamar" → login Google (mock) →
verificar redirect a /reclamar-perfil con params correctos.

P073 — UNIT TEST WEBHOOK
Tarea: Completar webhook route.test.ts con casos:
checkout.session.completed con clientId en metadata,
checkout.session.completed sin clientId (guest flow),
account.updated con details_submitted=true y charges_enabled=true,
account.updated sin cumplir condiciones (no debe activar isVerified).

P074 — UNIT TEST HAVERSINE
Tarea: Crear src/lib/services/pricing/geo-pricer.test.ts.
Verificar: Madrid-Barcelona (~620km), Madrid-Sevilla (~530km),
Madrid-Madrid (0km, mismo punto).
Tolerancia: ±5km de la distancia real.

P075 — UNIT TEST PERMISSIONS
Tarea: Crear src/lib/auth/permissions.test.ts.
Verificar que userCan retorna true/false correcto para cada acción por rol.
Roles a testear: ADMIN, ARTIST, PROVIDER, CLIENT, GUEST.

P076 — INTEGRATION TEST MATCHER
Tarea: Crear test de integración para getMatchingProviders.
Verificar que Edwin Agudelo aparece en posición 0 (Sticky Elite).
Verificar que huérfanos no verificados aparecen después.
Usar la DB de test con el seed de P025.

P077 — SMOKE TEST HEALTH ENDPOINT
Tarea: Verificar que /api/health retorna 200 con:
{ postgres: "ok", firebase: "ok", stripe: "ok" } en producción.
Añadir al CI/CD como check post-deploy.

P078 — LINT STRICT MODE
Tarea: Verificar que .eslintrc incluye:
@typescript-eslint/no-explicit-any: error,
@typescript-eslint/no-unused-vars: error,
no-console: warn (excepto en logger.ts).
Ejecutar npm run lint y reportar warnings activos.

P079 — TYPE COVERAGE
Tarea: Ejecutar type-coverage --at-least 90.
Si no está instalado: npm install -D type-coverage.
Reportar archivos con cobertura < 90% como candidatos a refactorización.

P080 — CI PIPELINE
Tarea: Crear .github/workflows/ci.yml con:
1. npm ci. 2. npx tsc --noEmit. 3. npm run lint. 4. npm run build.
5. Health check post-deploy (curl /api/health).
Activar en push a main y pull requests.

## DOMINIO 9 — INFRAESTRUCTURA Y DESPLIEGUE (P081–P090)

P081 — VERCEL ENV AUDIT
Tarea: Auditar todas las variables de entorno en Vercel Production.
Verificar presencia de: DATABASE_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
FIREBASE_*, GEMINI_API_KEY, CRON_SECRET, TELEGRAM_BOT_TOKEN.
Reportar variables faltantes como REQUIERE VALIDACIÓN.

P082 — VERCEL CRON CONFIG
Tarea: Verificar vercel.json incluye:
{ "crons": [{ "path": "/api/cron/obsidian-sync", "schedule": "0 3 * * *" }] }
Verificar que el cron se ejecuta en la región correcta (IAD).

P083 — DOMAIN CONFIG
Tarea: Verificar que productoraear.com apunta correctamente a Vercel.
DNS: A record o CNAME a cname.vercel-dns.com.
SSL activo y redireccionamiento www → apex o apex → www (consistente).

P084 — PREVIEW DEPLOYMENTS
Tarea: Verificar que los deploys de preview en Vercel no tienen acceso
a las variables de producción críticas (Stripe live keys, DB producción).
Configurar variables separadas para Preview environment.

P085 — ERROR MONITORING
Tarea: Evaluar e integrar Sentry o Vercel Error Monitoring.
Configurar alertas para: errores en webhook de Stripe, fallos de checkout,
errores 500 en rutas públicas.
Prioridad: webhook y checkout antes que páginas estáticas.

P086 — LOGGING CENTRALIZADO
Tarea: Verificar que el logger estructurado de `src/lib/logger.ts`
emite en formato JSON parseable por Vercel Log Drains.
Si se usa un log drain externo (Datadog, Logtail), configurar en Vercel dashboard.

P087 — CDN CACHE HEADERS
Tarea: Verificar headers Cache-Control en rutas estáticas y API:
Páginas ISR: s-maxage=3600, stale-while-revalidate=86400.
APIs públicas: no-store.
Webhooks: no-cache, no-store.

P088 — REGION OPTIMIZATION
Tarea: Verificar que las Server Functions de alto uso (matcher, checkout)
están configuradas en la región más cercana a España (CDG - Paris o IAD).
Actualizar vercel.json si es necesario.

P089 — TURBOPACK STABILITY
Tarea: Verificar que el build de producción usa Turbopack estable.
Ejecutar npm run build y reportar cualquier warning de Turbopack.
Si hay inestabilidades, documentar en SSOT y evaluar rollback a webpack.

P090 — DEPLOY CHECKLIST
Tarea: Formalizar checklist de deploy en docs/memoria EAR OS/03-runbooks/DEPLOY.md:
1. tsc clean. 2. lint clean. 3. build clean. 4. smoke test local.
5. git push main. 6. Vercel deploy. 7. /api/health check. 8. Smoke test prod.

## DOMINIO 10 — V207 DISEÑO Y APERTURA (P091–P100)

P091 — V207 PREREQUISITE VERIFICATION
Tarea: Verificar los 3 gates de V207 como ✅ HECHO VERIFICADO con evidencia:
Gate 1: screenshot de Stripe Dashboard con account.updated activo.
Gate 2: log de smoke test con isVerified=true en DB.
Gate 3: log de cron con CRON_SECRET validado.
No abrir V207 sin los 3 gates cerrados.

P092 — DISPUTE WEBHOOK HANDLER
Tarea: Añadir handler `handleDisputeCreated` en webhook route.ts.
Evento: charge.dispute.created.
Lógica: crear registro en modelo Dispute, actualizar estado en CommissionLedger,
notificar por Telegram con urgencia alta.

P093 — PAYOUT MONITORING DASHBOARD
Tarea: Crear componente `PayoutMonitor.tsx` en CommandCenter.
Mostrar: próximo payout programado, balance disponible en AuraWallet,
estado de cuentas Connect por artista.
Solo visible para rol ADMIN y ARTIST propietario.

P094 — CONNECT BALANCE API
Tarea: Crear Server Action `getConnectBalance(stripeAccountId: string)`.
Llama a stripe.balance.retrieve({ stripeAccount: id }).
Retorna available y pending. Solo accesible por ADMIN y propietario.

P095 — PROVIDER ONBOARDING STATUS
Tarea: Añadir campo `onboardingCompletedAt DateTime?` a ProviderProfile.
Actualizar handleAccountUpdated para escribir la timestamp cuando isVerified pasa a true.
Migración aditiva.

P096 — MULTI-WORKSPACE AUDIT
Tarea: Verificar que Waybill.workspaceId siempre se resuelve correctamente.
El handler actual usa workspace.findFirst() — verificar que hay exactamente 1 workspace
o implementar lógica de resolución multi-workspace si aplica.

P097 — ARTIST PAYOUT TRIGGER
Tarea: Crear scaffold de `initiateArtistPayout(artistProfileId: string)`.
Solo rol ADMIN. Verifica balance en AuraWallet, llama a Stripe Transfers API.
Schema: añadir modelo `PayoutRecord` (id, artistProfileId, amount, stripeTransferId, status).
No activar en producción hasta V207 completamente validada.

P098 — KPI DASHBOARD
Tarea: Añadir vista de KPIs en CommandCenter:
proveedores verificados (count), total de pagos procesados (sum),
artistas con AuraWallet activo (count), waybills en QUEUED (count).
Query directa a Prisma, refresco cada 60s.

P099 — SSOT V207 ENTRY
Tarea: Crear entrada de V207 en EAR_OS_STRATEGIC_ORCHESTRATOR_PLAN.md con:
objetivo, scope, prerequisitos cumplidos, archivos a tocar, gates de compilación,
riesgos identificados y criterio de cierre.

P100 — FULL SYSTEM SMOKE TEST
Tarea: Ejecutar smoke test completo del sistema en producción:
1. Homepage carga < 2.5s LCP. 2. Matcher retorna resultados. 3. Edwin en posición 0.
4. Checkout crea sesión en Stripe test. 5. Webhook procesa checkout.session.completed.
6. /api/health retorna 200. 7. Telegram recibe notificación.
Documentar resultado como evidencia de apertura de V207.
