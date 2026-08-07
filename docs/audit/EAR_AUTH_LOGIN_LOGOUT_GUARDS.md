# EAR OS — AUTH, LOGIN, LOGOUT & GUARDS (MACRO FORENSIC EDITION)
## ID: EAR-FORENSIC-AUTH-02
## ESTADO: PASS (AUDITORÍA DE PERÍMETROS DE SEGURIDAD RECONCILIADA)

### 1. BARRERA EDGE MIDDLEWARE (`src/middleware.ts`)
- **Rutas Protegidas (Matcher):**
  - `/dashboard/:path*`
  - `/nexus/:path*`
  - `/admin/:path*`
  - `/vault/:path*`
  - `/artist/:path*`
- **Mecanismo Edge Signal:** Inspecciona la cookie `ear_auth_signal`.
- **Redirección de Expulsión:** Si la cookie no está presente, redirige inmediatamente a `/login?from=[pathname]`.

---

### 2. ARQUITECTURA DE SINCRONIZACIÓN Y CLAIMS (`/api/nexus/user/sync`)
- **Protocolo de Login / Registro (`SovereignLogin.tsx`, `SovereignRegister.tsx`)**:
  1. El cliente autentica con Firebase / Supabase.
  2. Obtiene el idToken y realiza `POST` a `/api/nexus/user/sync`.
  3. El servidor valida la firma y emite las cookies autoritativas HTTP-Only (`ear_session`, `ear_auth_signal`).
  4. Asigna claims de rol: `ADMIN`, `ARTIST`, `CLIENT`, `AGENCY`, `SOVEREIGN`.

---

### 3. HOOKS Y GUARDS EN COMPONENTES DE CLIENTE
- `useSovereignRole.ts`: Verificación de roles en el árbol de componentes (Cliente).
- `AuthContext.tsx`: Proveedor de estado global de sesión. Sincroniza en background el refresco de tokens.

---

### 4. MATRIZ DE DEUDAS EN SEGURIDAD Y AUTH
1. **Falta de RLS Validado en Postgres**: El middleware previene el acceso visual, pero la base de datos Supabase/Prisma requiere verificación de políticas RLS para evitar bypass mediante peticiones cURL directas a la base de datos (Gate P0).
2. **Rate Limiting en `/api/nexus/user/sync`**: Requiere limitación perimetral (Upstash/Cloudflare) para mitigar ataques de fuerza bruta sobre el login.

---

### 5. DICTAMEN DE AUTH
La arquitectura de autenticación dual (Edge Signal + Server Sync) está correctamente articulada. Cumple las normativas de no parpadeo UX y segregación de roles.
