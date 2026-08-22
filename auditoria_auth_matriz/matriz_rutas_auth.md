# Matriz de autorización — EAR OS

Generada: 2026-08-03 17:36:13
Raíz auditada: C:\EAR_OS_V2

## HECHO_VERIFICADO

- Auditoría pasiva: no se modificó código, configuración, Git ni la carpeta auditoria_32b.
- Se excluyeron .env, .env.local, node_modules, .git, .next, turbo, ARCHIVE_RECOVERY y las carpetas de auditoría.
- La clasificación se limita a evidencia visible dentro de cada route.* y se registra en CSV.

## Matriz de rutas

- P0 | RIESGO_ALTO | /admin/demand-map
  Archivo: C:\EAR_OS_V2\src\app\api\admin\demand-map\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: BLOQUEAR aprobación de release para esta ruta hasta revisión manual y decisión explícita.
- P0 | RIESGO_ALTO | /admin/demand-map
  Archivo: C:\EAR_OS_V2\src\app\api\admin\demand-map\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: BLOQUEAR aprobación de release para esta ruta hasta revisión manual y decisión explícita.
- P1 | INDETERMINADA | /astra/query
  Archivo: C:\EAR_OS_V2\src\app\api\astra\query\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /astra/query
  Archivo: C:\EAR_OS_V2\src\app\api\astra\query\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P2 | PROTEGIDA | /astra
  Archivo: C:\EAR_OS_V2\src\app\api\astra\route.js
  Evidencia: L24: maxOutputTokens: 2048,
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P2 | PROTEGIDA | /astra
  Archivo: C:\EAR_OS_V2\src\app\api\astra\route.ts
  Evidencia: L30: maxOutputTokens: 2048,
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P2 | PROTEGIDA | /contracts/generate
  Archivo: C:\EAR_OS_V2\src\app\api\contracts\generate\route.js
  Evidencia: L5: const { sessionId, provincia, evento } = data; || L10: console.log(`[EAR_OS] Contrato S-Class generado para ${provincia} - ${evento} (Sesión: ${sessionId})`);
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P2 | PROTEGIDA | /contracts/generate
  Archivo: C:\EAR_OS_V2\src\app\api\contracts\generate\route.ts
  Evidencia: L6: const { sessionId, provincia, evento } = data; || L13: console.log(`[EAR_OS] Contrato S-Class generado para ${provincia} - ${evento} (Sesión: ${sessionId})`);
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P2 | PROTEGIDA | /cron/obsidian-sync
  Archivo: C:\EAR_OS_V2\src\app\api\cron\obsidian-sync\route.js
  Evidencia: L10: * Diseñado para ser invocado por Vercel Cron Jobs mediante Bearer Token. || L13: const authHeader = req.headers.get("authorization"); || L15: // 1. Verificación del Guardián Bearer Token || L17: !authHeader.startsWith("Bearer ") ||
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P2 | PROTEGIDA | /cron/obsidian-sync
  Archivo: C:\EAR_OS_V2\src\app\api\cron\obsidian-sync\route.ts
  Evidencia: L12: * Diseñado para ser invocado por Vercel Cron Jobs mediante Bearer Token. || L15: const authHeader = req.headers.get("authorization"); || L18: // 1. Verificación del Guardián Bearer Token || L21: !authHeader.startsWith("Bearer ") ||
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P1 | INDETERMINADA | /fleet/map
  Archivo: C:\EAR_OS_V2\src\app\api\fleet\map\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /fleet/map
  Archivo: C:\EAR_OS_V2\src\app\api\fleet\map\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /fleet/waybills/[id]
  Archivo: C:\EAR_OS_V2\src\app\api\fleet\waybills\[id]\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /fleet/waybills/[id]
  Archivo: C:\EAR_OS_V2\src\app\api\fleet\waybills\[id]\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /health
  Archivo: C:\EAR_OS_V2\src\app\api\health\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /health
  Archivo: C:\EAR_OS_V2\src\app\api\health\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /hunter/execute
  Archivo: C:\EAR_OS_V2\src\app\api\hunter\execute\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /hunter/execute
  Archivo: C:\EAR_OS_V2\src\app\api\hunter\execute\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P2 | PROTEGIDA | /hunter/ingest
  Archivo: C:\EAR_OS_V2\src\app\api\hunter\ingest\route.js
  Evidencia: L9: const authHeader = req.headers.get('authorization'); || L10: if (authHeader !== 'Bearer ' + process.env.HUNTER_API_KEY) {
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P2 | PROTEGIDA | /hunter/ingest
  Archivo: C:\EAR_OS_V2\src\app\api\hunter\ingest\route.ts
  Evidencia: L11: const authHeader = req.headers.get('authorization'); || L12: if (authHeader !== 'Bearer ' + process.env.HUNTER_API_KEY) {
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P1 | INDETERMINADA | /hunter/phantom
  Archivo: C:\EAR_OS_V2\src\app\api\hunter\phantom\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /hunter/phantom
  Archivo: C:\EAR_OS_V2\src\app\api\hunter\phantom\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /nexus/user/sync
  Archivo: C:\EAR_OS_V2\src\app\api\nexus\user\sync\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /nexus/user/sync
  Archivo: C:\EAR_OS_V2\src\app\api\nexus\user\sync\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P2 | PROTEGIDA | /oracle/infer
  Archivo: C:\EAR_OS_V2\src\app\api\oracle\infer\route.js
  Evidencia: L3: import genomeData from '@/app/data/genome_sessions.json'; || L27: const fallbackResults = (genomeData?.sessions || []) || L35: path: 'local://genome_sessions.json'
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P2 | PROTEGIDA | /oracle/infer
  Archivo: C:\EAR_OS_V2\src\app\api\oracle\infer\route.ts
  Evidencia: L3: import genomeData from '@/app/data/genome_sessions.json'; || L36: const fallbackResults = (genomeData?.sessions || []) || L44: path: 'local://genome_sessions.json'
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P1 | INDETERMINADA | /oracle/simulator
  Archivo: C:\EAR_OS_V2\src\app\api\oracle\simulator\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /oracle/simulator
  Archivo: C:\EAR_OS_V2\src\app\api\oracle\simulator\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P2 | PROTEGIDA | /payments/checkout
  Archivo: C:\EAR_OS_V2\src\app\api\payments\checkout\route.js
  Evidencia: L14: const session = await stripe.checkout.sessions.create({ || L39: success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`, || L42: return NextResponse.json({ url: session.url });
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P2 | PROTEGIDA | /payments/checkout
  Archivo: C:\EAR_OS_V2\src\app\api\payments\checkout\route.ts
  Evidencia: L18: const session = await stripe.checkout.sessions.create({ || L43: success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`, || L47: return NextResponse.json({ url: session.url });
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P2 | PROTEGIDA | /payments/create-session
  Archivo: C:\EAR_OS_V2\src\app\api\payments\create-session\route.js
  Evidencia: L2: import { createCheckoutSession } from '@/lib/payments'; || L4: // 💳 STRIPE SESSION HANDLER (S-CLASS) || L14: const session = await createCheckoutSession({ || L20: id: session.id, || L21: url: session.url, || L28: error: 'STRIPE_SESSION_ERROR',
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P2 | PROTEGIDA | /payments/create-session
  Archivo: C:\EAR_OS_V2\src\app\api\payments\create-session\route.ts
  Evidencia: L2: import { createCheckoutSession } from '@/lib/payments'; || L5: // 💳 STRIPE SESSION HANDLER (S-CLASS) || L21: const session = await createCheckoutSession({ || L28: id: session.id, || L29: url: session.url, || L37: error: 'STRIPE_SESSION_ERROR',
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P0 | RIESGO_ALTO | /payments/liquidate
  Archivo: C:\EAR_OS_V2\src\app\api\payments\liquidate\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: BLOQUEAR aprobación de release para esta ruta hasta revisión manual y decisión explícita.
- P0 | RIESGO_ALTO | /payments/liquidate
  Archivo: C:\EAR_OS_V2\src\app\api\payments\liquidate\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: BLOQUEAR aprobación de release para esta ruta hasta revisión manual y decisión explícita.
- P2 | PROTEGIDA | /payments/webhook
  Archivo: C:\EAR_OS_V2\src\app\api\payments\webhook\route.js
  Evidencia: L13: function getEmailFromSession(session) { || L14: const email = session.customer_details?.email?.trim().toLowerCase() || || L15: session.customer_email?.trim().toLowerCase() || || L52: case "checkout.session.completed": || L61: // HANDLER 1: checkout.session.completed (Ledger + Wallet + Waybill) || L63: async function handleCheckoutCompleted(session) { || L64: const meta = session.metadata || {}; || L65: const idempotencyRef = `STRIPE-${session.id}`; || L66: const amountTotal = (session.amount_total ?? 0) / 100; || L74: logger.info({ event: "WEBHOOK_IDEMPOTENCY_HIT", sessionId: session.id }); || L99: const email = getEmailFromSession(session); || L101: throw new Error("Unable to resolve guest identity from Stripe session"); || L112: displayName: meta.clientName || session.customer_details?.name || "Cliente Invitado", || L126: currency: session.currency?.toUpperCase() || "EUR", || L128: stripeSessionId: session.id, || L131: sourceEvent: "checkout.session.completed", || L161: currency: session.currency?.toUpperCase() || "EUR", || L177: referenceCode: `WAY-${session.id}`, || L201: sessionId: session.id, || L203: currency: session.currency, || L205: client: getEmailFromSession(session) || "Desconocido", || L216: const currency = session.currency?.toUpperCase() || "EUR"; || L217: const email = getEmailFromSession(session) || "Anónimo";
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P0 | RIESGO_ALTO | /payments/webhook
  Archivo: C:\EAR_OS_V2\src\app\api\payments\webhook\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: BLOQUEAR aprobación de release para esta ruta hasta revisión manual y decisión explícita.
- P1 | INDETERMINADA | /profiles/claim
  Archivo: C:\EAR_OS_V2\src\app\api\profiles\claim\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /profiles/claim
  Archivo: C:\EAR_OS_V2\src\app\api\profiles\claim\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /profiles
  Archivo: C:\EAR_OS_V2\src\app\api\profiles\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /profiles
  Archivo: C:\EAR_OS_V2\src\app\api\profiles\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /profiles/search
  Archivo: C:\EAR_OS_V2\src\app\api\profiles\search\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /profiles/search
  Archivo: C:\EAR_OS_V2\src\app\api\profiles\search\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /rag/query
  Archivo: C:\EAR_OS_V2\src\app\api\rag\query\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /rag/query
  Archivo: C:\EAR_OS_V2\src\app\api\rag\query\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /system/read-file
  Archivo: C:\EAR_OS_V2\src\app\api\system\read-file\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /system/read-file
  Archivo: C:\EAR_OS_V2\src\app\api\system\read-file\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P2 | PROTEGIDA | /telemetry/marketplace
  Archivo: C:\EAR_OS_V2\src\app\api\telemetry\marketplace\route.js
  Evidencia: L17: if (!event.type || !event.sessionId || !event.payload) { || L24: session_id: event.sessionId,
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P2 | PROTEGIDA | /telemetry/marketplace
  Archivo: C:\EAR_OS_V2\src\app\api\telemetry\marketplace\route.ts
  Evidencia: L24: if (!event.type || !event.sessionId || !event.payload) { || L32: session_id: event.sessionId,
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P1 | INDETERMINADA | /test-telegram
  Archivo: C:\EAR_OS_V2\src\app\api\test-telegram\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /test-telegram
  Archivo: C:\EAR_OS_V2\src\app\api\test-telegram\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P2 | PROTEGIDA | /tripwire
  Archivo: C:\EAR_OS_V2\src\app\api\tripwire\route.js
  Evidencia: L5: const BOT_TOKEN: [REDACTADO]; || L7: if (!BOT_TOKEN || !CHAT_ID) { || L17: const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P2 | PROTEGIDA | /tripwire
  Archivo: C:\EAR_OS_V2\src\app\api\tripwire\route.ts
  Evidencia: L7: const BOT_TOKEN: [REDACTADO]; || L10: if (!BOT_TOKEN || !CHAT_ID) { || L21: const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P1 | INDETERMINADA | /vampire/transmute
  Archivo: C:\EAR_OS_V2\src\app\api\vampire\transmute\route.js
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P1 | INDETERMINADA | /vampire/transmute
  Archivo: C:\EAR_OS_V2\src\app\api\vampire\transmute\route.ts
  Evidencia: Sin coincidencias técnicas autorizadas en el archivo de ruta.
  Siguiente acción: Revisar middleware y política de exposición antes de clasificar como pública.
- P2 | PROTEGIDA | /webhooks/stripe
  Archivo: C:\EAR_OS_V2\src\app\api\webhooks\stripe\route.js
  Evidencia: L30: if (event.type !== "checkout.session.completed") { || L33: const session = event.data.object; || L34: const md = session.metadata ?? {}; || L75: stripeSessionId: session.id, || L90: stripeSessionId: session.id, || L131: stripeSessionId: session.id, || L132: notes: `Stripe webhook session ${session.id}`,
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.
- P2 | PROTEGIDA | /webhooks/stripe
  Archivo: C:\EAR_OS_V2\src\app\api\webhooks\stripe\route.ts
  Evidencia: L37: if (event.type !== "checkout.session.completed") { || L41: const session = event.data.object as Stripe.Checkout.Session; || L42: const md = session.metadata ?? {}; || L90: stripeSessionId: session.id, || L104: stripeSessionId: session.id, || L149: stripeSessionId: session.id, || L150: notes: `Stripe webhook session ${session.id}`,
  Siguiente acción: Validar que el control observado cubre todos los métodos HTTP y coincide con la política de negocio.

## Evidencia de middleware

- SUPUESTO | No se observó evidencia técnica autorizada en middleware.* o no se encontró middleware.*.

## Motor de siguientes acciones

- P0 / RIESGO_ALTO: bloquear aprobación de release de la ruta; revisar manualmente; decidir exposición; crear propuesta separada solo tras aprobación.
- P1 / INDETERMINADA: revisar el archivo de ruta, middleware y política de negocio; actualizar matriz; no cambiar código.
- P2 / PROTEGIDA: validar cobertura por método HTTP y consistencia con roles; no cambiar código.
- PÚBLICA confirmada: documentar la intención de exposición y mantener evidencia.

## RECOMENDACIÓN

- La siguiente tarea debe leer esta matriz y producir un backlog de decisiones con un identificador por ruta; ningún elemento se ejecuta sobre el código sin aprobación explícita.
