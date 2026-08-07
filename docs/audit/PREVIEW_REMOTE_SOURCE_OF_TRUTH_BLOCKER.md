# EAR OS — SOURCE OF TRUTH REMOTO DE PREVIEW (BLOQUEO DE ROUTING)
## ID: EAR-SSOT-REMOTE-BLOCKER-01
## ESTADO: HECHO_VERIFICADO (EVIDENCIA DE CABECERAS Y DEPLOYMENTS OBTENIDA)

### 1. RECONCILIACIÓN DE PROYECTOS Y DOMINIOS EN VERCEL

| Dominio Remoto | Tipo de URL | Comportamiento HTTP Observado | Causa Técnica Demostrada |
| :--- | :--- | :--- | :--- |
| `https://ear-psi.vercel.app/` | Dominio de Producción / Staging Antiguo | Sirve un build estático con `Age: 875258` y `Last-Modified: 08:39 GMT`. `/cotizador` -> `308`, `/presupuesto` -> `404`. | **DEPLOYMENT DESFASADO**: Este dominio apunta a un deployment de hace horas/días que NO contiene el commit `293db085` ni el fix de `next.config.js`. |
| `https://ear-git-consolidacion-aditiva-productoraear-gmailcoms-projects.vercel.app/` | Branch URL oficial (`consolidacion-aditiva`) | `302 Found` -> `Location: https://vercel.com/sso-api?url=...` | **VERCEL DEPLOYMENT PROTECTION ACTIVO**: El proyecto tiene protección por autenticación Vercel (SSO/Password) para previews de ramas, requiriendo sesión para peticiones públicas `curl`. |

---

### 2. AUDITORÍA DE ARCHIVOS DE CONFIGURACIÓN Y CAPAS DE ENRUTAMIENTO
- **`next.config.js`**: En el commit actual `293db085`, la regla `{ source: '/cotizador', destination: '/contacto' }` fue **eliminada**.
- **`middleware.ts`**: Solo protege rutas bajo `/dashboard/*`, `/nexus/*`, `/admin/*`, `/vault/*`, `/artist/*`. **No interfiere en `/presupuesto` ni `/cotizador`**.
- **`vercel.json`**: Solo define un cron job para `/api/infra/keep-alive`. **Cero reglas de routing/redirect**.
- **App Router (`src/app/(public)/`)**:
  - `src/app/(public)/presupuesto/page.tsx` -> **EXISTE (200 OK local)**.
  - `src/app/(public)/cotizador/page.tsx` -> **EXISTE (200 OK local)**.
  - `src/app/(public)/the-signal/page.tsx` -> **EXISTE (200 OK local)**.

---

### 3. DICTAMEN DE CAUSA RAÍZ
1. **Disparidad en `ear-psi.vercel.app`**: Dicho dominio no está vinculado a la rama `consolidacion-aditiva` o no ha sido actualizado tras el push de `293db085`.
2. **Protección en la Branch URL**: La URL de rama oficial `ear-git-consolidacion-aditiva-*.vercel.app` exige autenticación de equipo Vercel, por lo que cualquier acceso anónimo sin cookie de Vercel SSO es redirigido a login antes de alcanzar Next.js.
3. **Código Local 100% Sano**: El código local en `consolidacion-aditiva` tiene los tres endpoints respondiendo `200 OK` de forma nativa.
