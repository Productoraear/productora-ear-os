# EAR OS — PREVIEW DEPLOYMENT SOURCE OF TRUTH (SSOT)
## ID: EAR-SSOT-DEPLOYMENT-01
## ESTADO: HECHO_VERIFICADO

Reconciliación del origen de verdad entre la infraestructura de Vercel y el repositorio local.

---

### 1. MAPA DE PROYECTOS Y REPOSITORIO
- **Repositorio Git Remoto:** `https://github.com/Productoraear/ear.git`
- **Rama de Trabajo Activa:** `consolidacion-aditiva`
- **Último Commit en origin/consolidacion-aditiva:** `b46c213a`
- **Vercel Project Name:** `ear`
- **Vercel Project ID:** `prj_izZzCXLcymjBr4giYF5SHsoJWYqv`
- **Vercel Org ID:** `team_1FyvRFPClkZh7uJmrPoFKijE`
- **Dominio de Preview / Staging Activo:** `https://ear-psi.vercel.app/`

---

### 2. TRAZABILIDAD DEL DESPLIEGUE EN `ear-psi.vercel.app`
- El dominio `ear-psi.vercel.app` corresponde al proyecto `ear` en Vercel, desplegado a partir de los commits precedentes de `consolidacion-aditiva`.
- Las adiciones locales del working tree (`src/app/(public)/presupuesto/page.tsx`) no forman parte del build desplegado en `ear-psi.vercel.app`, por lo que Next.js en Vercel devuelve `404 Not Found`.

---

### 3. ACCIÓN MÍNIMA DE REMEDIACIÓN
1. **Modificación en `next.config.js`**:
   - Remover `{ source: '/cotizador', destination: '/contacto', permanent: true }` para devolver la gobernanza a `src/app/(public)/cotizador/page.tsx`.
2. **Empaquetado y Deploy**:
   - Comprometer e integrar `presupuesto/page.tsx`, `the-signal/page.tsx` y el fix de `next.config.js` en la rama `consolidacion-aditiva` para generar el nuevo deployment en Vercel.
3. **Smoke Tests de Verificación**:
   - `curl -I https://ear-psi.vercel.app/presupuesto` -> `200 OK`
   - `curl -I https://ear-psi.vercel.app/cotizador` -> `200 OK`
   - `curl -I https://ear-psi.vercel.app/the-signal` -> `200 OK`
