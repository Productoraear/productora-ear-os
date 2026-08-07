# EAR OS — REPORTE FORENSE DE DESALINEACIÓN PREVIEW ROUTING
## ID: EAR-FORENSIC-MISMATCH-01
## ESTADO: CAUSA_RAÍZ_DEMOSTRADA

Este informe audita la divergencia entre el código local, la rama `consolidacion-aditiva` y el enrutamiento efectivo observado en `https://ear-psi.vercel.app/`.

---

### 1. CLASIFICACIÓN DE RUTAS EN DISPUTA

#### `/presupuesto`
- **EXISTE_EN_CODIGO_LOCAL:** Sí (`src/app/(public)/presupuesto/page.tsx`, 200 OK en local).
- **EXISTE_EN_RAMA_PREVIEW:** No (Creado recientemente en working tree local, pendiente de commit/push/deploy en Vercel).
- **EXISTE_EN_PROYECTO_DESPLEGADO:** No.
- **DESPLEGADO_EN_URL_REAL:** No (`https://ear-psi.vercel.app/presupuesto` -> 404 Page Not Found).
- **DESTINO_CORRECTO:** Sí (Debe renderizar `TinderMatcherClient`).
- **CAUSA_RAIZ:** Desincronización de deployment. La ruta fue creada localmente en el working tree y aún no ha sido empaquetada ni desplegada en el commit activo de Vercel.
- **FIX_MINIMO_PROPUESTO:** Integrar el archivo en la rama `consolidacion-aditiva` y desplegar el Preview en Vercel.

---

#### `/cotizador`
- **EXISTE_EN_CODIGO_LOCAL:** Sí (`src/app/(public)/cotizador/page.tsx`, aloja `MultiPricer`).
- **EXISTE_EN_RAMA_PREVIEW:** Sí.
- **EXISTE_EN_PROYECTO_DESPLEGADO:** Sí.
- **DESPLEGADO_EN_URL_REAL:** Sí (`https://ear-psi.vercel.app/cotizador` -> 308 Permanent Redirect a `/contacto`).
- **DESTINO_CORRECTO:** No (Debe cargar la calculadora `MultiPricer` / Cotizador, no saltar a `/contacto`).
- **CAUSA_RAIZ:** **Línea 40 de `next.config.js`**:
  ```javascript
  { source: '/cotizador', destination: '/contacto', permanent: true },
  ```
  La regla de redirección estática en `next.config.js` tiene prioridad sobre el App Router de Next.js, forzando la redirección 308 antes de evaluar `src/app/(public)/cotizador/page.tsx`.
- **FIX_MINIMO_PROPUESTO:** Eliminar o comentar la regla de redirección forzada de `/cotizador` en `next.config.js` para permitir que Next.js renderice `src/app/(public)/cotizador/page.tsx`.

---

#### `/the-signal`
- **EXISTE_EN_CODIGO_LOCAL:** Sí (`src/app/(public)/the-signal/page.tsx`).
- **DESPLEGADO_EN_URL_REAL:** Sí (`https://ear-psi.vercel.app/the-signal` -> 200 OK).
- **ESTADO:** PASS.

---

### 2. MATRIZ DE COLISIONES DE ENRUTAMIENTO
- **`next.config.js` vs `app/(public)/`**: Colisión directa en `/cotizador`. La regla `redirects()` secuestraba la petición.
- **`middleware.ts`**: No interfiere en `/presupuesto`, `/cotizador` ni `/the-signal` (el matcher solo cubre `/dashboard`, `/nexus`, `/admin`, `/vault`, `/artist`).
- **Rewrites**: No interfieren (solo `/api/bridge/:path*`).

---

### 3. DICTAMEN TÉCNICO
La causa raíz de que `/presupuesto` devuelva 404 es **falta de deploy de la nueva página**. La causa raíz de que `/cotizador` redirija a `/contacto` es **la regla estática en `next.config.js`**. Ambas causas están aisladas y demostradas con evidencia matemática.
