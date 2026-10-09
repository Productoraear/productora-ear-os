# 🛡️ MANUAL DE ADMINISTRADOR — BLINDAJE ANTI-HACKERS EAR OS
**Fecha:** 10/05/2026
**Alcance:** Correcciones P0/P1 de la auditoría `AUDITORIA_SEGURIDAD_ANTIHACKERS_EAR_OS_2026.md`.
**Estado:** Aplicado y verificado con `tsc --noEmit` (Exit 0) y `eslint` (0 errores).

---

## 1. QUÉ SE HA BLINDADO (RESUMEN EJECUTIVO)

| ID | Vulnerabilidad | Archivo(s) | Corrección |
|----|----------------|-----------|------------|
| P0-1 | Webhook Stripe aceptaba payload sin firma | `src/app/api/stripe/webhook/route.ts` | La firma `constructEvent` es **obligatoria** en todos los entornos. Sin `STRIPE_WEBHOOK_SECRET` se devuelve 500 y el evento NO se procesa. |
| P0-2 | Panel admin sin autenticación | Todo `/api/admin/*` | Nuevo guardián `src/lib/security/adminGuard.ts` exige **Bearer token Firebase válido + rol ADMIN/COMMANDER** en cada handler. |
| P0-3 | XSS almacenado | `proveedores/[slug]/page.tsx`, `JardinesLaCartujaGrandSlam.tsx` | Nuevo sanitizador `src/lib/security/sanitizeHtml.ts`. Se renderiza **texto plano**, nunca `dangerouslySetInnerHTML` con HTML no fiable. |
| P0-4 | CRON_SECRET con fallback predecible | `cron/obsidian-sync/route.ts` | Eliminado el fallback. Sin `CRON_SECRET` el cron queda deshabilitado. |
| P1-1 | `.env.vercel.production` en git | `.gitignore` + índice | Añadido `.env*` a `.gitignore` y ejecutado `git rm --cached`. |
| P1-2 | Supabase service-role degradaba a anon | `src/lib/supabase/server.ts` | Si no hay `SUPABASE_SERVICE_ROLE_KEY` lanza error (sin degradación silenciosa). |
| P1-3 | Clave Gemini en cliente | `src/app/api/astra/route.ts`, `geminiService.ts` | Servidor solo usa `GEMINI_API_KEY`. El cliente **nunca** porta la clave; usa fallback local y la IA real corre solo en servidor. |
| P1-4 | Webhook Make/Trello en cliente | `webhook_dispatcher.ts`, `trello.ts` | Se usa `MAKE_WEBHOOK_TRELLO` (server-only), nunca `NEXT_PUBLIC_*`. |

---

## 2. VARIABLES DE ENTORNO OBLIGATORIAS EN PRODUCCIÓN

Configura **todas** en tu plataforma (Vercel / Coolify / Hostinger). Sin ellas, la ruta correspondiente se **desactiva de forma segura** (no hay fallback inseguro).

```bash
# ─── Stripe (P0-1) ───
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...            # ← obligatorio, sin él el webhook rechaza todo

# ─── Cron (P0-4) ───
CRON_SECRET=<random-64-hex>                # sin fallback; generar con: openssl rand -hex 32

# ─── Supabase (P1-2) ───
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...           # solo servidor, jamás NEXT_PUBLIC

# ─── IA (P1-3) ───
GEMINI_API_KEY=AIza...                     # solo servidor, jamás NEXT_PUBLIC

# ─── Make/Trello (P1-4) ───
MAKE_WEBHOOK_TRELLO=https://hook.eu1.make.com/...
TRELLO_API_KEY=...                        # solo servidor
TRELLO_TOKEN=...
TRELLO_LIST_ID_INBOUND=...

# ─── Firebase Admin (P0-2) ───
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> ⚠️ **Regla de oro:** todo secreto vive en variables **server-only**. Ninguna clave real debe llamarse `NEXT_PUBLIC_*`. Las únicas `NEXT_PUBLIC_*` permitidas son identificadores públicos no sensibles (URL del proyecto, ID de app, etc.).

---

## 3. CÓMO FUNCIONA EL ACCESO ADMIN (P0-2)

Cada endpoint `/api/admin/*` invoca `requireAdmin(request)` al inicio:

1. Lee `Authorization: Bearer <idToken>`.
2. Verifica el token con Firebase Admin (`verifyIdToken`).
3. Consulta el rol del usuario en PostgreSQL (`UserService.hasRole`) y exige **ADMIN o superior** (jerarquía donada por el rol `COMMANDER`).

### Cómo obtiene el panel su token
- El login de Firebase (`src/lib/auth/firebase-auth.ts`) devuelve el `idToken` del usuario autenticado.
- Las vistas del panel deben enviar ese token en el header `Authorization` de cada fetch.

### Rol del usuario
- El rol vive en la tabla `User` (columna `role`, enum de Prisma).
- Para habilitar a un administrador, asigna `role = ADMIN` (o `COMMANDER`).
- Los usuarios nuevos se crean con rol `EXPLORADOR` (sin privilegios).

---

## 4. ACCIONES POST-IMPLEMENTACIÓN (OBLIGATORIAS PARA EL CEO)

1. **Rotar el token filtrado** `VERCEL_OIDC_TOKEN` en Vercel (nunca reutilices el valor que estuvo expuesto en git).
2. **Purga del historial de git** si el remote es público o compartido:
   ```bash
   git rm --cached .env.vercel.production     # ya ejecutado
   git commit -m "security: remove leaked env file from index"
   ```
   Para borrar del historial completo, usa `git filter-repo` (solo si el repo fue público) con la ruta exacta.
3. **Confirmar los secretos de arriba en producción** (Vercel → Settings → Environment Variables; y Coolify/Hostinger).
4. **Verificar cada ruta admin** lanzando un request sin token: debe devolver `401 Unauthorized`, nunca datos.
5. **Verificar el webhook de Stripe** con un evento de prueba firmado desde el dashboard de Stripe.

---

## 5. VERIFICACIÓN DE BLINDAJE (SCORECARD)

```bash
# Tipado estricto
npx tsc --noEmit          # → Exit 0

# Lint
npx eslint src/app/api/admin/ src/lib/security/   # → 0 errores

# Confirmar que no hay secretos en cliente
grep -rn "NEXT_PUBLIC_GEMINI_API_KEY\|NEXT_PUBLIC_MAKE_WEBHOOK_TRELLO" src/  # → sin resultados (solo comentario)

# Confirmar fuga de .env resuelta
git ls-files | findstr /I ".env.vercel"  # → vacío
```

---

## 6. ARCHIVOS NUEVOS CLAVE

- `src/lib/security/adminGuard.ts` — guardián de autorización server-side (P0-2).
- `src/lib/security/sanitizeHtml.ts` — sanitizador anti-XSS sin dependencias (P0-3).

**Zona Cero intacta:** `src/lib/constants/ear-os-ssot.ts` y `src/lib/security/ssotIntegrityGuard.ts` no fueron modificados.