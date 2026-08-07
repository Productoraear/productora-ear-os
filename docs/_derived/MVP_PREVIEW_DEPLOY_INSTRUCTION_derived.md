<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\release\MVP_PREVIEW_DEPLOY_INSTRUCTION.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: 7E2010BA9B71E58BD990C744DFDB24D828D1C0986B5D8E2D1F5A35AE76733B17
  Freshness Score: 100/100
  Mode: HUMAN_CANONICAL | Status: FRESH
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# MVP PREVIEW DEPLOY INSTRUCTION — EAR OS (OMEGA v4.0)

**Fecha de emisión:** 2026-08-06
**Emisor:** Antigravity OMEGA — Silicon Execution Governor v4.0
**SSOT:** `01_SSOT_Y_KERNELS/EAR_OS_STRATEGIC_ORCHESTRATOR_PLAN.md`
**Dossier:** `docs/release/MVP_RELEASE_DOSSIER.md`
**Cola:** `docs/release/MVP_EXECUTION_QUEUE.md`
**Repositorio:** `C:\EAR_OS_V2`

---

## STATUS

```
PREVIEW DEPLOY AUTHORIZED
PRODUCTION PROMOTION CONDITIONED ON VERIFIED PREVIEW ARTIFACT
```

---

## ESTADO GLOBAL: LISTO_PARA_PREVIEW

---

## HECHO_VERIFICADO

- `src/middleware.ts` ha sido creado en Edge como prefiltro ligero de UX, sin dependencias nativas de Node.js ni `firebase-admin`, y es compatible con Next.js Edge Runtime bajo el alcance implementado.
- `AuthContext.tsx` emite `Authorization: Bearer ${idToken}` hacia `/api/nexus/user/sync`, alineándose con la capa de seguridad P0 del servidor.
- Se han respetado todas las restricciones duras: 0 mutaciones en `prisma/schema.prisma`, `package.json`, `src/lib/firebase.ts`, pagos, ledger o SEO.
- Los archivos centrales del bloque de auth y control perimetral compilan sin errores TypeScript.

## HIPÓTESIS

- El sistema ha eliminado los bloqueadores de seguridad identificados hasta ahora para la certificación de release en la capa de auth/rutas: P0 (spoofing de identidad en Sync API) y P1 (bypass visual de rutas privadas).

## REQUIERE_VALIDACIÓN

- Validación remota en entorno Vercel Preview.
- Verificación de inyección de variables `FIREBASE_ADMIN_*` en Vercel Preview.
- Smoke test de login/logout y acceso a rutas privadas en Preview.

## DECISIÓN

- Declarar el bloque `MVP-P1-01B` como `PASS`.
- Elevar formalmente el dictamen del sistema a `LISTO_PARA_PREVIEW`.
- Congelar cualquier desarrollo funcional o cosmético adicional hasta la firma del Checklist GO/NO-GO en Preview.

## RIESGOS

- Ausencia de `FIREBASE_ADMIN_PRIVATE_KEY` en Vercel Preview provocará rechazo de tokens en `/api/nexus/user/sync` (HTTP 401/500).
- Formato incorrecto de `FIREBASE_ADMIN_PRIVATE_KEY` en Vercel Preview puede provocar fallo de inicialización de Firebase Admin (`Invalid PEM` / `token verification failure`).
- Variables mal asignadas por rama en Preview pueden invalidar la prueba si la rama usa overrides distintos.

## CAMBIOS IMPLEMENTADOS

- `[NEW]` `src/middleware.ts`
- `[MODIFY]` `src/lib/AuthContext.tsx`
- `[NEW]` `src/lib/firebaseAdmin.ts`
- `[MODIFY]` `src/app/api/nexus/user/sync/route.ts`
- `[MODIFY]` `src/lib/services/UserService.ts`

## VALIDACIONES LOCALES

- `npx tsc --project tsconfig.json --noEmit` PASS en archivos de producción y auth.

## ROLLBACK

```bash
git checkout -- src/lib/AuthContext.tsx src/app/api/nexus/user/sync/route.ts src/lib/services/UserService.ts
rm src/middleware.ts src/lib/firebaseAdmin.ts
```

## ESTADO DE BLOQUES

| Bloque | Estado |
|---|---|
| MVP-P0-01A | **PASS** |
| MVP-P0-01B | **PASS** |
| MVP-P1-01A | **PASS** |
| MVP-P1-01B | **PASS** |

---

## CHECKLIST PRE-VERCEL (PRE-DEPLOY GATE)

### G-1 Código congelado
- Verificar `git status`.
- Solo deben existir los archivos del bloque de auth/perímetro autorizados.

### G-2 TypeScript verde
- Ejecutar `npx tsc --project tsconfig.json --noEmit`.
- Resultado esperado: PASS.

### G-3 Vercel Env Vars
- Confirmar en Project Settings > Environment Variables > Preview:
  - `FIREBASE_ADMIN_PROJECT_ID`
  - `FIREBASE_ADMIN_CLIENT_EMAIL`
  - `FIREBASE_ADMIN_PRIVATE_KEY`
- Verificar si aplican a todas las ramas Preview o a una rama específica.
- **Control adicional PEM:** Verificar el formato de `FIREBASE_ADMIN_PRIVATE_KEY`. Si la clave fue cargada con saltos escapados (`\n`), el runtime en `src/lib/firebaseAdmin.ts` la normaliza a saltos reales (`.replace(/\\n/g, '\n')`). Riesgo asociado: `FirebaseAppError` / `Invalid PEM formatted message`.

### G-4 Stripe status
- Si Stripe no entra en la prueba de hoy, declararlo explícitamente fuera de alcance operativo del gate Preview.

---

## PLAN DE SMOKE TESTS EN VERCEL PREVIEW (RUNTIME GATE)

### ST-01 POST /api/nexus/user/sync
- Petición sin cabecera `Authorization`.
- Resultado esperado: **HTTP 401**.

### ST-02 POST /api/nexus/user/sync
- Petición con `Authorization: Bearer invalid_token`.
- Resultado esperado: **HTTP 401**.

### ST-03 GET /dashboard
- Acceso desde incógnito sin cookie de señal UX.
- Resultado esperado: redirect a `/login`, preservando origen si esa lógica está implementada.

### ST-04 GET /admin
- Acceso sin cookie de señal UX.
- Resultado esperado: redirect a `/login`, preservando origen si esa lógica está implementada.

### ST-05 Login cliente
- Iniciar sesión en `/login`.
- Resultado esperado: `AuthContext.tsx` obtiene token ID, llama a `/api/nexus/user/sync` con **HTTP 200** y establece la cookie de señal UX (`ear_auth_signal`).

### ST-06 Runtime logs
- Revisar logs de runtime en Vercel Dashboard > Logs o con `vercel logs <deployment-url>`.
- Resultado esperado: 0 excepciones unhandled en `firebaseAdmin.ts`, `route.ts` o `middleware.ts`.

---

## ORDEN DE EJECUCIÓN DEL DESPLIEGUE PREVIEW

1. Confirmar variables `FIREBASE_ADMIN_*` en Preview.
2. Ejecutar deploy Preview con `vercel` o mediante push a rama no productiva.
3. Obtener URL `*.vercel.app` generada.
4. Ejecutar `vercel inspect <deployment-url>` para confirmar estado READY, metadatos del deployment y trazabilidad del artefacto.
5. Ejecutar ST-01 a ST-06.
6. Revisar runtime logs.
7. Emitir dictamen final GO/NO-GO para promoción a producción.

---

## PROMOCIÓN A PRODUCCIÓN (CONDICIONADA A PASS ÍNTEGRO)

Si el Preview Deployment pasa todos los gates (G-1 a G-4) y todos los smoke tests (ST-01 a ST-06):

```bash
vercel promote <deployment-url>
```

**Objetivo:** Promover el artefacto exacto validado en Preview, evitando divergencia entre el artefacto probado y el artefacto servido en Production.

---

**AUTORIZADO PARA PREVIEW, NO AUTORIZADO AÚN PARA PRODUCCIÓN.**

*La promoción a Production queda condicionada a PASS íntegro de G-1 a G-4 y ST-01 a ST-06 en Vercel Preview, con revisión explícita de runtime logs y variables Firebase Admin.*

---
*Certificado por Antigravity OMEGA — Silicon Execution Governor v4.0 — 2026-08-06*
