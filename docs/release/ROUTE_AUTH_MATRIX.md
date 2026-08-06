# ROUTE AUTH MATRIX

| Ruta/Patrón | Pública/Privada/Admin | Datos sensibles | Protección actual | Capa | Evidencia ruta/líneas | Riesgo | Acción mínima | Estado |
|---|---|---|---|---|---|---|---|---|
| `/login`, `/register` | Pública | Credenciales | Ninguna (UI pública) | Frontend | `src/app/(public)/(auth)` | Bajo (esperado) | N/A | CONFIRMADO |
| Home (`/`), `/contacto` | Pública | Ninguno | Ninguna | Frontend | `src/app/(public)/page.tsx`, `src/app/(public)/contacto` | Bajo (esperado) | N/A | CONFIRMADO |
| `/dashboard` / `/nexus` | Privada | Perfil, ingresos | Redirección CSR (`useRouter`) | Cliente (`useEffect`) | `src/app/(nexus)/dashboard/page.tsx:16` | P1 (Bypass visual) | Middleware / Server Auth | CONFIRMADO |
| `/admin` / `/centro-mando` | Admin | Datos globales | Redirección CSR (asumido) | Cliente | `src/app/(nexus)/(admin)/` | P0 (Bypass crítico) | Middleware Admin | REQUIERE_VALIDACION |
| Wallet/Ledger | Privada | Financieros | Redirección CSR (asumido) | Cliente | `src/app/(nexus)/dashboard/vault` | P0 (Fuga datos) | Middleware / Server Auth | REQUIERE_VALIDACION |
| Perfiles privados | Privada | Personales | Redirección CSR (asumido) | Cliente | `src/app/(artist)/` | P1 | Middleware / Server Auth | REQUIERE_VALIDACION |
| Checkout | Pública/Privada | Intención compra| Ninguna / Desconocida | API | `src/app/api/payments/checkout/` | P1 (Manipulación) | Server-side validation | REQUIERE_VALIDACION |
| `/api/nexus/user/sync` | Privada | Rol, UID, Email | NINGUNA | Backend | `src/app/api/nexus/user/sync/route.ts:6` | P0 (Spoofing UID) | Validar JWT Firebase | CONFIRMADO |
| `/api/webhooks/stripe` | Pública (S2S) | Financieros | `Stripe-Signature` | Backend | `src/app/api/webhooks/stripe/route.ts:22` | P0 si falla validación | Inyectar y testear SECRET | REQUIERE_VALIDACION |
