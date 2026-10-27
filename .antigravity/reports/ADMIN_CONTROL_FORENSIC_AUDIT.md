# AUDITORÍA FORENSE — `/admin/control` (EAR OS)

> **Fecha:** 2026-10-27 · **Autor:** Antigravity (Arquitecto Forense) · **Ola:** W41 ADMIN CONTROL DOMINANCE
> **Evidencia re-ejecutable:** `node scripts/audit_admin_control_forensics.cjs --strict --write`
> **Resultado actual:** `Exit Code 1` → **22 fachadas/401** sobre 34 enlaces UI→API.
> **Matriz completa:** `.antigravity/reports/ADMIN_CONTROL_MATRIX.md`

---

## 1. VEREDICTO EJECUTIVO

El diagnóstico del CEO («el admin solo funciona al 3 % de las altas») es **correcto y está medido**, no es una impresión:

- Las **6 pestañas** del Panel de Control son **solo lectura**. No existe **ni un solo `POST`** en las 5 rutas que alimentan el panel.
- **Afiliados** y **Tesorería** no son pestañas: son tarjetas-enlace (`LinkCard`) sin datos ni contadores.
- De los 4 endpoints que usa el panel (`artists`, `providers`, `therapists`, `fleet`), los 4 devuelven **HTTP 401** en navegador porque **ningún componente envía el `Authorization: Bearer`** que `requireAdmin` exige.
- La única server action de altas (`createProviderAction`) **falla siempre**: construye `new Request("http://localhost")`, un `Request` sin cabeceras → 401 fijo. Y además escribe en `vendorShadowProfile` mientras la API lee `providerProfile`: **doble fuente de verdad**.

**El 3 % no es un bug de rendimiento: es una cadena de identidad rota + ausencia de capa de escritura.**

---

## 2. CAUSAS RAÍZ (todas P0)

| ID | Causa | Evidencia (ruta:línea) | Efecto |
| --- | --- | --- | --- |
| **R1** | El cliente jamás envía `Authorization: Bearer` | `src/app/(admin)/admin/control/ControlDashboard.tsx:97` → `fetch(url, { cache: 'no-store' })`; `src/lib/security/adminGuard.ts:23-38` exige Bearer | **401 en las 4 pestañas** («HTTP 401» en Terapeutas) |
| **R2** | `hasRole` busca por `User.id`, pero el JWT trae el **UID de Firebase** | `src/lib/services/UserService.ts:39-42` (`findUnique({ where: { id } })`) vs `User.firebaseUid` (`prisma/schema.prisma:105`) | Incluso con token válido: **403** para admins reales |
| **R3** | Server actions con `Request` vacío | `src/app/actions/admin-providers.ts:14,57,76` → `requireAdmin(new Request("http://localhost"))` | **Alta de proveedores muerta al 100 %** |
| **R4** | No existe capa de escritura en el panel | `src/app/api/admin/{artists,therapists,providers,fleet,treasury}/route.ts` → solo `GET`/`PATCH` | **0 altas posibles** en Artistas, Terapeutas, Proveedores, Flota, Tesorería |
| **R5** | Afiliados y Tesorería son fachadas | `ControlDashboard.tsx:382-395` → `<LinkCard href="/admin/afiliados">` y `/admin/tesoreria` | Sin datos, sin KPIs, sin altas en el panel segmentado |
| **R6** | `/admin` exige cookie, pero `/login` **no existe** | `src/middleware.ts:45-50` redirige a `/login`; no existe `src/app/login` | Punto muerto de acceso: 404 al caducar la sesión |
| **R7** | Doble fuente de verdad de proveedores | `admin-providers.ts:24` escribe `vendorShadowProfile`; `api/admin/providers/route.ts:179,240` lee/escribe `providerProfile` | Aunque se arregle R3, **el alta no aparecería en la tabla** |
| **R8** | El validador de cierre no validaba TypeScript | `node_modules/.bin/tsc.cmd` **no existe**; `npx tsc` descarga el paquete impostor `tsc` («This is not the tsc command you are looking for»). `omega.js:117` ejecutaba `npx tsc --noEmit` | `complete` podía dar por buena una tarea con errores de tipos |

### Superficie de seguridad colateral detectada

| Ruta | Problema |
| --- | --- |
| `/api/admin/dispatch` | `GET` sin guard |
| `/api/admin/dispatch/lock` | `POST` sin guard (bloqueo de fechas) |
| `/api/admin/managed-vendors` | `GET`/`POST` sin guard **y escribe en base de datos** |
| `/api/admin/video-factory/*` | 5 rutas sin guard |
| `src/app/actions/{affiliateActions,artistStudioActions,spaceActions,smartLockActions,stripeConnectActions,contractSignActions}` | Server actions con escritura **sin guard** |

> Estas rutas no son el objeto de la Wave 41, pero el gate de cierre (T18) ya las deja listadas y priorizadas para la Wave 42.

### Reparación aplicada al pipeline (R8)

`omega.js` ya no depende de `npx`: valida con `node ./node_modules/typescript/bin/tsc --noEmit` (TypeScript 6.0.3 instalado) y lintea con `node ./node_modules/eslint/bin/eslint.js`. Los `test` de las 18 tareas de la Wave 41 se normalizaron al binario local, de modo que un Exit Code 0 significa **compilación real verificada**.


---

## 3. PESTAÑA POR PESTAÑA (matriz de dominio)

| Pestaña | Fuente actual | ¿Lee? | ¿Da de alta? | Veredicto | Tareas W41 |
| --- | --- | --- | --- | --- | --- |
| **Artistas** | `/api/admin/artists` (GET+PATCH) | ❌ 401 | ❌ sin `POST` | ❌ FACHADA | T04 + T11 |
| **Proveedores** | `/api/admin/providers` (GET+PATCH) | ❌ 401 | ❌ action muerta + tabla equivocada | ❌ FACHADA | T06 + T12 |
| **Terapeutas** | `/api/admin/therapists` (GET+PATCH) | ❌ 401 (literal en pantalla) | ❌ sin `POST` | ❌ FACHADA | T05 + T13 |
| **Flota** | `/api/admin/fleet` (GET+PATCH) | ❌ 401 | ❌ sin `POST` | ❌ FACHADA | T07 + T14 |
| **Afiliados** | `LinkCard` → `/admin/afiliados` | ❌ sin datos | ❌ sin datos | ❌ FACHADA | T08 + T15 |
| **Tesorería** | `LinkCard` → `/admin/tesoreria` | ❌ sin datos | ❌ sin datos | ❌ FACHADA | T09 + T16 |

**Regla de oro aplicada:** una pestaña no se declara terminada por pintar una tabla. Se declara terminada cuando **el alta escribe en PostgreSQL**, **el listado la refleja tras el reload** y **el error se muestra honesto** (401/403/409) en lugar de un «0» silencioso.

---

## 4. PLAN DE RECONSTRUCCIÓN — WAVE 41 (18 tareas atómicas, 1 por sesión)

### Fase 1 · Identidad y red (desbloquea todo lo demás)
| ID | Entrega | Archivos |
| --- | --- | --- |
| `W41_T01_ADMIN_FETCH_CORE` | `adminFetch` con Bearer Firebase + errores tipados | `src/lib/admin/adminFetch.ts`, `adminTypes.ts` |
| `W41_T02_ADMIN_GUARD_RBAC_FIX` | `hasRole` por `firebaseUid` + `requireAdminFromHeaders()` | `adminGuard.ts`, `UserService.ts`, `admin-providers.ts` |
| `W41_T03_ADMIN_SESSION_BRIDGE` | Cookies de middleware + `/login` real + bridge de sesión | `api/admin/session/route.ts`, `AdminSessionBridge.tsx`, `app/login/page.tsx`, `layout.tsx` |

### Fase 2 · Altas reales (capa de escritura)
| ID | Entrega | Archivos |
| --- | --- | --- |
| `W41_T04_API_ARTISTS_POST` | `POST` User+artistProfile en transacción | `api/admin/artists/route.ts` |
| `W41_T05_API_THERAPISTS_POST` | `POST` User+TherapistProfile | `api/admin/therapists/route.ts` |
| `W41_T06_API_PROVIDERS_POST` | `POST` providerProfile con doctrina `verified` | `api/admin/providers/route.ts` |
| `W41_T07_API_FLEET_POST` | `POST` fleetUnit con unidad única | `api/admin/fleet/route.ts` |
| `W41_T08_API_AFFILIATES_CRUD` | Nueva API de afiliados (GET/POST/PATCH) | `api/admin/affiliates/route.ts` |
| `W41_T09_API_TREASURY_PRICE_LOCK` | Depósito 100 € idempotente + split SSOT | `api/admin/treasury/route.ts` |

### Fase 3 · Interfaz S-Class (una pestaña por tarea)
| ID | Entrega |
| --- | --- |
| `W41_T10_CONTROL_SHELL` | Hook `useAdminResource`, KPIs reales, buscador global, fuera `LinkCard` |
| `W41_T11_TAB_ARTISTAS` | Alta + publicar/pausar + búsqueda |
| `W41_T12_TAB_PROVEEDORES` | Alta homologada + rating/estado + badge verificado |
| `W41_T13_TAB_TERAPEUTAS` | Alta VIMUME + activar/suspender |
| `W41_T14_TAB_FLOTA` | Alta de unidades + estado operativo + GPS honesto |
| `W41_T15_TAB_AFILIADOS` | Alta con código de referido copiable + comisión del motor |
| `W41_T16_TAB_TESORERIA` | Split 80/10/10 en vivo + registro de depósito 100 € |

### Fase 4 · Adquisición de pago y sello
| ID | Entrega |
| --- | --- |
| `W41_T17_GOOGLE_ADS_COCKPIT` | Conector Google Ads REST server-only + panel `/admin/ads` (sin SDK nuevo, 503 honesto si falta configuración) |
| `W41_T18_CONTRACT_GATE` | `audit:admin --strict` en `gate:prepush`: 0 fachadas o build rojo |

**Dependencias duras:** T02←T01 · T03←T02 · T04..T09←T01/T02 · T10←T01 · T11..T16←T10 (+ su endpoint) · T17←T02 · T18 al final.

---

## 5. CRITERIOS DE CIERRE (Ω-DIAMANTE aplicado al panel)

Una tarea W41 solo cierra con **Exit Code 0** en `tsc` + `eslint` y estos invariantes:

1. `npx tsc --noEmit` → 0 errores.
2. `npx eslint` sobre los archivos tocados → 0 errores, 0 warnings.
3. **0 `any`** implícitos o explícitos en el diff.
4. **0 `verified:true` falso**: `isVerified` solo puede nacer en servidor con teléfono real ≠ centralita `+34 693 693 048`.
5. **0 handler huérfano**: cada botón ejecuta escritura real verificable en PostgreSQL.
6. **0 precio hardcodeado**: depósito, split y comisión nacen de `EAR_OS_SSOT` o del motor de comisiones.
7. **0 `TODO`/placeholder** en la ruta de administración.
8. **0 secretos** en cliente (`STRIPE_SECRET_KEY`, `GOOGLE_ADS_CLIENT_SECRET` y `GOOGLE_ADS_REFRESH_TOKEN` solo en servidor).
9. **Idempotencia ACID**: N reintentos con la misma `stripeSessionId` → **exactamente 1** fila en `commissionLedger`.
10. **Cero fachadas**: `node scripts/audit_admin_control_forensics.cjs --strict` → **Exit Code 0** (partimos de 22).

---

## 6. OPERATIVA ZTM (Pacto Sagrado Anti-Sobrecostes)

```powershell
# 1) Arranque de UNA tarea (nunca dos en la misma sesión)
node .antigravity/omega.js next

# 2) Implementar exactamente los ficheros de MISSION_ACTIVE.json

# 3) Cierre con validación automática (tsc + eslint)
node .antigravity/omega.js complete W41_T01_ADMIN_FETCH_CORE

# 4) DETENERSE. Abrir 'Start New Task' (+) y volver al paso 1.
```

Utilidades de esta ola:

```powershell
# Re-sembrar la cola (idempotente, no duplica IDs)
node scripts/seed_wave41_admin_control.cjs

# Auditoría forense del panel (0 fachadas = Exit 0)
node scripts/audit_admin_control_forensics.cjs --strict --write
```

---

## 7. RIESGOS Y DECISIONES ARQUITECTÓNICAS

| Tema | Decisión |
| --- | --- |
| **Google Ads (T17)** | Se integra por REST (`googleads.googleapis.com/v19`), **sin añadir dependencias**. Requiere *developer token* aprobado + refresh token. Sin credenciales el panel muestra checklist y la API responde `503 ADS_NOT_CONFIGURED`: **cero datos simulados**. |
| **Doble fuente de proveedores** | Se unifica en `providerProfile` (la tabla que ya lee y escribe la API). `vendorShadowProfile` queda solo como ingesta en cuarentena; **prohibido re-hardcodear `verified:true`** en sincronizadores. |
| **`/login`** | Se crea real (Google popup + cookie de sesión). Sin él, el middleware deja el panel inaccesible al caducar la sesión. |
| **Firebase** | Si falta `FIREBASE_ADMIN_PROJECT_ID`, `requireAdmin` responde **503**; el panel debe mostrar «servicio no configurado», nunca ceros silenciosos. |
| **Migraciones** | La Wave 41 **no requiere cambios de esquema**: todos los modelos existen (`artistProfile`, `providerProfile`, `TherapistProfile`, `fleetUnit`, `AffiliateProfile`, `commissionLedger`). |
| **Deuda de seguridad (Wave 42)** | 5 rutas `/api/admin/*` sin guard (`dispatch`, `dispatch/lock`, `managed-vendors`, `video-factory/*`) y 6 server actions con escritura sin guard. Prioridad P0 de la siguiente ola. |

---

## 8. FIRMA FORENSE

> Estado actual: **panel al 3 %** — lecturas en 401, altas inexistentes, dos pestañas vacías, una action muerta y una tabla equivocada.
> Estado tras la Wave 41: **cada pestaña da de alta de verdad, cada cifra nace del SSOT SHA-256, cada 401 se explica en pantalla y un gate de CI impide la regresión.**
> No se declara dominado hasta que `audit:admin --strict` devuelva Exit Code 0 con cero fachadas.

