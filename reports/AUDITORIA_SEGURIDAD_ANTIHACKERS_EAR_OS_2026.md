# 🛡️ AUDITORÍA DE SEGURIDAD ANTI-HACKERS — EAR OS
**Fecha:** 10/05/2026
**Alcance:** Barrido de superficie de ataque real (no de cumplimiento estético).
**Método:** `npx tsc --noEmit` (Exit 0), búsqueda de secretos, control de acceso a `/api/admin`, XSS, firma de webhooks, secretos en cliente y fuga en git.

---

## SCORECARD DE CIERRE

| # | Criterio | Estado |
|---|----------|--------|
| 1 | `npx tsc --noEmit` → Exit 0 | ✅ |
| 2 | `eslint` → Exit 0 | ⚠️ No ejecutado en esta auditoría |
| 3 | 0 `any` implícito en el diff | ⚠️ Hay `as any` / `as never` explícitos en motores de pago |
| 4 | 0 `verified:true` falso | ⚠️ No auditado (data lakes bloqueados por .clineignore) |
| 5 | 0 handler huérfano en ruta de venta | ⚠️ No verificado (fuera del barrido) |
| 6 | 0 arrays hardcodeados en motores de dinero | ⚠️ No verificado |
| 7 | 0 TODO/FIXME en ruta de venta | ⚠️ No verificado |
| 8 | Secrets jamás en cliente | ❌ VIOLADO (ver P1-3, P1-4, P1-5) |

---

## 🔴 P0 — CRÍTICOS (dinero, control de acceso, ejecución remota)

### P0-1 · Webhook de Stripe acepta payloads SIN verificación de firma
**Archivo:** `src/app/api/stripe/webhook/route.ts:38-45`
```ts
if (webhookSecret) {
  event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
} else {
  event = JSON.parse(body) as Stripe.Event;   // ← BYPASS
}
```
- En cuanto `STRIPE_WEBHOOK_SECRET` no esté definido (o en entornos que no sean `production`, donde el guard de la línea 33 no frena), un atacante puede **fabricar un evento `checkout.session.completed`** y forzar:
  - `smartLock.upsert` con estado `ACTIVE_LOCKED`.
  - `commissionLedger.create` con estado `PAID` (split 80/10/10).
  - `lockDateAtomically` (bloqueo de fecha ACID).
  - `stripe.transfers.create` (payouts a cuentas conectadas).
- **Corrección obligatoria:** eliminar el branch `else`; requerir siempre `constructEvent` y devolver 400 si no hay firma válida o secret.

### P0-2 · Rutas `/api/admin/*` SIN autenticación
**Evidencia:** no existe `src/middleware.ts` ni `src/proxy.ts`; el barrido sobre `src/app/api/admin` devolvió **0 coincidencias** de `session/auth/ADMIN_SECRET/requireAdmin`.
- `POST /api/admin/tasks/inject` (`src/app/api/admin/tasks/inject/route.ts:174`) **escribe arbitrariamente en disco** (`tasks_queue.json`) sin ningún control de acceso.
- `PATCH /api/admin/providers` (`src/app/api/admin/providers/route.ts:103`) modifica `status`/`rating` de proveedores sin auth.
- Sin protección también: `artists`, `therapists`, `fleet`, `telemetry`, `gpu-status`, `sentinel`, `route-governance`, `treasury`, `compile-intent`.
- **Corrección obligatoria:** middleware/autorización de servidor por sesión y rol para TODO `/api/admin`.

### P0-3 · XSS almacenado en ficha de proveedor
**Archivo:** `src/app/(public)/proveedores/[slug]/page.tsx`
```ts
dangerouslySetInnerHTML={{ __html: cleanText(rawProvider.raw_html || rawProvider.scraped_content) }}
```
- `cleanText()` (líneas 46+) **solo corrige mojibake** (reemplazos de acentos), **NO sanitiza HTML**. Un proveedor malicioso o un dato scrapeado envenenado puede inyectar `<script>`.
- Mismo patrón en `src/components/fincas/JardinesLaCartujaGrandSlam.tsx` (`block.htmlCode`).
- **Corrección obligatoria:** sanitizar con `DOMPurify`/`isomorphic-dompurify` antes de `dangerouslySetInnerHTML`, o renderizar como texto plano.

### P0-4 · Secreto de cron hardcodeado con fallback
**Archivo:** `src/app/api/cron/obsidian-sync/route.ts`
```ts
const cronSecret = process.env.CRON_SECRET || "LEVIATHAN_SECRET_KEY";
```
- Si `CRON_SECRET` no está definido, el fallback **público y predecible** autoriza el cron. *Otras rutas cron* (`hold-timeout`, `b2g-telegram-hunter`, `b2g-hunter`) sí usan solo `process.env.CRON_SECRET` sin fallback; esta es la excepción peligrosa.
- **Corrección obligatoria:** eliminar el fallback; rechazar si no hay secret.

---

## 🟠 P1 — ALTOS

### P1-1 · Fuga de secretos en Git
**Archivo:** `.env.vercel.production` **trackeado** (confirmado con `git ls-files`).
- Contiene `VERCEL_OIDC_TOKEN` (longitud 1276) y es parte del árbol público de `origin` (github.com/Productoraear/productora-ear-os.git).
- **Corrección:** `git rm --cached .env.vercel.production`, rotar el token, añadir a `.gitignore`.

### P1-2 · Supabase service-role con fallback a ANON y placeholder
**Archivo:** `src/lib/supabase/server.ts`
```ts
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJ...dummy_service_key_placeholder';
```
- En producción sin `SERVICE_ROLE_KEY`, el cliente admin degrada a la clave **anon** o a un placeholder. Riesgo de operar con identidad débil/rota.
- **Corrección:** lanzar error si no hay `SERVICE_ROLE_KEY` en servidor.

### P1-3 · Clave de IA Gemini accesible desde cliente
**Archivos:**
- `src/app/api/astra/route.ts`: `process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY`
- `src/features/astra/services/geminiService.ts`: lee `NEXT_PUBLIC_GEMINI_API_KEY`
- **Riesgo:** `NEXT_PUBLIC_*` se embebe en el bundle del navegador → posible exfiltración de la misma clave usada en servidor y agotamiento de cuota.
- **Corrección:** separar claves server/client; jamás usar `NEXT_PUBLIC_GEMINI_API_KEY` en servidor.

### P1-4 · Webhooks de Make/Trello con token en cliente
**Archivos:**
- `src/lib/services/webhook_dispatcher.ts`: `NEXT_PUBLIC_MAKE_WEBHOOK_TRELLO`
- `src/lib/services/trello.ts`: lee `NEXT_PUBLIC_MAKE_WEBHOOK_TRELLO`
- **Riesgo:** URL de webhook (posible secreto) embebida en cliente, habilitando spam/abuso del endpoint.
- **Corrección:** mover esos webhooks a variables server-only.

---

## 🟡 P2 — MEDIOS

- `dangerouslySetInnerHTML` sobre `JSON.stringify(jsonLd)` en los componentes SEO es **seguro** (escape de `</script>` por `JSON.stringify`); no es XSS. Se deja constancia de que NO representan riesgo.
- `$queryRaw` con template literals en `src/lib/actions/booking-actions.ts` usa interpolación **parametrizada** de Prisma; **no se halló SQLi** directa en el barrido.
- `as any` / `as never` explícitos en pagos (`src/app/api/stripe/webhook/route.ts:13`, `src/lib/payments.ts`, `src/app/api/checkout/*`). No rompen `tsc`, pero incumplen el estándar de tipado estricto.

---

## ✅ VERIFICACIONES EJECUTADAS

- `npx tsc --noEmit` → **Exit 0** (sin errores de tipos).
- `git status --short` → confirmado un working tree con decenas de archivos modificados/sin commit (riesgo de despliegue sucio).
- `git ls-files | findstr .env` → confirmada la presencia de `.env.vercel.production`.

## 📌 VEREDICTO

El MVP **NO está en condiciones de producción segura**. Los bloqueantes son: firma de webhook bypasseable (P0-1), panel admin sin autenticación (P0-2), XSS almacenado (P0-3), secreto cron predecible (P0-4) y fuga de `.env` en git (P1-1). Todos son explotables sin necesidad de acceso privilegiado previo.