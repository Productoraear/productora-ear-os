# EAR OS — PREVIEW REMOTE DEPLOYMENT MISMATCH MATRIX
## ID: EAR-SSOT-MISMATCH-MATRIX-01
## ESTADO: HECHO_VERIFICADO

### MATRIZ OBLIGATORIA DE ENRUTAMIENTO LOCAL VS REMOTO

| Parámetro | `/presupuesto` | `/cotizador` | `/the-signal` |
| :--- | :--- | :--- | :--- |
| **RUTA** | `/presupuesto` | `/cotizador` | `/the-signal` |
| **LOCAL STATUS** | `200 OK` | `200 OK` | `200 OK` |
| **PREVIEW STATUS (`ear-psi.vercel.app`)** | `404 Not Found` (Static Age: 875258) | `308 Permanent Redirect` a `/contacto` | `200 OK` |
| **PREVIEW STATUS (Branch URL `ear-git-consolidacion-aditiva...`)** | `302 Found` (Vercel SSO Protection) | `302 Found` (Vercel SSO Protection) | `302 Found` (Vercel SSO Protection) |
| **ARCHIVO LOCAL** | `src/app/(public)/presupuesto/page.tsx` | `src/app/(public)/cotizador/page.tsx` | `src/app/(public)/the-signal/page.tsx` |
| **COMMIT ESPERADO** | `293db085daf9a1f94471811d4fa6f4dfe184f672` | `293db085daf9a1f94471811d4fa6f4dfe184f672` | `293db085daf9a1f94471811d4fa6f4dfe184f672` |
| **COMMIT REMOTO REAL (`ear-psi`)** | Commit antiguo previo a `293db085` | Commit antiguo previo a `293db085` | Commit previo donde `the-signal` ya existía |
| **PROYECTO REMOTO REAL** | `ear` (`prj_izZzCXLcymjBr4giYF5SHsoJWYqv`) | `ear` (`prj_izZzCXLcymjBr4giYF5SHsoJWYqv`) | `ear` (`prj_izZzCXLcymjBr4giYF5SHsoJWYqv`) |
| **CAPA QUE DECIDE EL COMPORTAMIENTO** | App Router (`page.tsx`) en local / Deployment desfasado en `ear-psi` | `next.config.js` eliminado en local / `next.config.js` viejo en `ear-psi` | App Router (`page.tsx`) |
| **CAUSA RAÍZ** | La URL `ear-psi.vercel.app` no ha sido redeployada con el commit `293db085`. | La URL `ear-psi.vercel.app` ejecuta el bundle viejo con la regla `redirects()`. | N/A (Ruta sana en local y remoto). |
| **FIX MÍNIMO** | Forzar Redeploy del deployment en Vercel Dashboard desde `origin/consolidacion-aditiva`. | Forzar Redeploy en Vercel Dashboard para absorber el nuevo `next.config.js`. | Ninguno (Conservar). |

---

### SÍNTESIS EJECUTIVA
- **¿Qué proyecto sirve la URL?**: El proyecto `ear` de Vercel.
- **¿Qué commit sirve la URL `ear-psi.vercel.app`?**: Un commit antiguo anterior al hash `293db085`.
- **¿Qué capa estaba rompiendo `/presupuesto`?**: La falta de empaquetado del archivo recién creado en el deployment activo de Vercel.
- **¿Qué capa estaba desviando `/cotizador`?**: El array `redirects()` de `next.config.js` en el deployment remoto desfasado.
