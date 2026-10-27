# MATRIZ DE TRAZABILIDAD — /admin/control

> Emitido por `scripts/audit_admin_control_forensics.cjs` (solo lectura).

## UI → Endpoint

| UI | Endpoint | Verbo | Guard | Bearer cliente | Veredicto |
| --- | --- | --- | --- | --- | --- |
| src/app/(admin)/admin/AdminDashboardClient.tsx | (sin endpoint) | — | — | NO | ❌ FORM SIN PERSISTENCIA |
| src/app/(admin)/admin/afiliados/page.tsx | /api/affiliates/v2/list | GET | SIN GUARD | NO | ⚠️ revisar |
| src/app/(admin)/admin/arena/page.tsx | /api/arena/vote | POST+GET | SIN GUARD | NO | ⚠️ revisar |
| src/app/(admin)/admin/call-center/page.tsx | /api/agents/chat | POST | SIN GUARD | NO | ⚠️ revisar |
| src/app/(admin)/admin/call-center/page.tsx | /api/profiles/search | GET | SIN GUARD | NO | ⚠️ revisar |
| src/app/(admin)/admin/command-center/page.tsx | (sin endpoint) | — | — | NO | ❌ FORM SIN PERSISTENCIA |
| src/app/(admin)/admin/compiler/page.tsx | /api/admin/compile-intent | POST+GET | requireAdmin | NO | ❌ 401 SEGURO |
| src/app/(admin)/admin/compiler/page.tsx | /api/admin/gpu-status | GET+POST | requireAdmin | NO | ❌ 401 SEGURO |
| src/app/(admin)/admin/compiler/page.tsx | /api/admin/tasks/inject | GET+POST | requireAdmin | NO | ❌ 401 SEGURO |
| src/app/(admin)/admin/control/ControlDashboard.tsx | /api/admin/artists | GET+PATCH | requireAdmin | NO | ❌ 401 SEGURO |
| src/app/(admin)/admin/control/ControlDashboard.tsx | /api/admin/fleet | GET+PATCH | requireAdmin | NO | ❌ 401 SEGURO |
| src/app/(admin)/admin/control/ControlDashboard.tsx | /api/admin/providers | GET+PATCH | requireAdmin | NO | ❌ 401 SEGURO |
| src/app/(admin)/admin/control/ControlDashboard.tsx | /api/admin/therapists | GET+PATCH | requireAdmin | NO | ❌ 401 SEGURO |
| src/app/(admin)/admin/flota/page.tsx | (sin endpoint) | — | — | NO | ❌ FORM SIN PERSISTENCIA |
| src/app/(admin)/admin/journey-heatmap/page.tsx | (sin endpoint) | — | — | NO | ❌ FORM SIN PERSISTENCIA |
| src/app/(admin)/admin/layout.tsx | (sin endpoint) | — | — | NO | ❌ FORM SIN PERSISTENCIA |
| src/app/(admin)/admin/licitaciones/page.tsx | (sin endpoint) | — | — | NO | ❌ FORM SIN PERSISTENCIA |
| src/app/(admin)/admin/mailerfind/page.tsx | /api/mailerfind/prospect | POST | SIN GUARD | NO | ⚠️ revisar |
| src/app/(admin)/admin/proveedores/page.tsx | /api/profiles/search | GET | SIN GUARD | NO | ⚠️ revisar |
| src/app/(admin)/admin/scheduler/page.tsx | /api/admin/tasks/inject | GET+POST | requireAdmin | NO | ❌ 401 SEGURO |
| src/app/(admin)/admin/simulador/page.tsx | (sin endpoint) | — | — | NO | ❌ FORM SIN PERSISTENCIA |
| src/app/(admin)/admin/sourcing/components/BudgetMatrix.tsx | (sin endpoint) | — | — | NO | ❌ FORM SIN PERSISTENCIA |
| src/app/(admin)/admin/sourcing/page.tsx | (sin endpoint) | — | — | NO | ❌ FORM SIN PERSISTENCIA |
| src/app/(admin)/admin/telemetria/page.tsx | /api/admin/telemetry | GET | requireAdmin | NO | ❌ 401 SEGURO |
| src/app/(admin)/admin/tesoreria/page.tsx | /api/admin/treasury | GET | requireAdmin | NO | ❌ 401 SEGURO |
| src/app/(admin)/admin/training/page.tsx | (sin endpoint) | — | — | NO | ❌ FORM SIN PERSISTENCIA |
| src/app/(admin)/admin/video-factory/page.tsx | /api/admin/video-factory/fasth3/generate | POST+GET | SIN GUARD | NO | ⚠️ revisar |
| src/app/(admin)/admin/video-factory/page.tsx | /api/admin/video-factory/fasth3/outputs | GET | SIN GUARD | NO | ⚠️ revisar |
| src/app/(admin)/admin/video-factory/page.tsx | /api/admin/video-factory/generate | POST | SIN GUARD | NO | ⚠️ revisar |
| src/app/(admin)/admin/video-factory/page.tsx | /api/admin/video-factory/local-audio | GET | SIN GUARD | NO | ⚠️ revisar |
| src/app/(admin)/admin/voice-studio/page.tsx | /api/voice/lyrics | POST | SIN GUARD | NO | ⚠️ revisar |
| src/app/(admin)/admin/whatsapp/page.tsx | (sin endpoint) | — | — | NO | ❌ FORM SIN PERSISTENCIA |
| src/app/(admin)/sourcing/page.tsx | (sin endpoint) | — | — | NO | ❌ FORM SIN PERSISTENCIA |
| src/app/(admin)/voice-studio/page.tsx | /api/voice/lyrics | POST | SIN GUARD | NO | ⚠️ revisar |

## API /api/admin/*

| Ruta | Verbos | Guard | Zod | Escribe |
| --- | --- | --- | --- | --- |
| artists/route.ts | GET+PATCH | requireAdmin | sí | sí |
| compile-intent/route.ts | POST+GET | requireAdmin | sí | no |
| demand-map/route.ts | GET | requireAdmin | sí | no |
| dispatch/lock/route.ts | POST | SIN GUARD | no | no |
| dispatch/route.ts | GET | SIN GUARD | no | no |
| fleet/route.ts | GET+PATCH | requireAdmin | sí | sí |
| gpu-status/route.ts | GET+POST | requireAdmin | sí | no |
| infrastructure/dual-engine/route.ts | GET | requireAdmin | sí | no |
| managed-vendors/route.ts | GET+POST | SIN GUARD | no | sí |
| mobile-studio/config/route.ts | GET+POST | requireAdmin | sí | no |
| ollama-shield/route.ts | GET+POST | requireAdmin | sí | no |
| oraculo/approve/route.ts | POST | requireAdmin | sí | no |
| providers/route.ts | GET+PATCH | requireAdmin | sí | sí |
| providers/toggle-visibility/route.ts | GET+POST | requireAdmin | sí | no |
| route-governance/route.ts | GET+POST | requireAdmin | sí | no |
| sentinel/route.ts | GET+POST | requireAdmin | sí | no |
| sysinfo/route.ts | GET | requireAdmin | sí | no |
| tasks/inject/route.ts | GET+POST | requireAdmin | sí | no |
| telemetry/route.ts | GET | requireAdmin | sí | no |
| therapists/route.ts | GET+PATCH | requireAdmin | sí | sí |
| treasury/route.ts | GET | requireAdmin | sí | no |
| vampire-telemetry/route.ts | GET | requireAdmin | sí | no |
| video-factory/fasth3/generate/route.ts | POST+GET | SIN GUARD | sí | no |
| video-factory/fasth3/outputs/route.ts | GET | SIN GUARD | no | no |
| video-factory/generate/route.ts | POST | SIN GUARD | sí | no |
| video-factory/local-audio/route.ts | GET | SIN GUARD | sí | no |
| video-factory/media/presets/route.ts | GET | SIN GUARD | sí | no |
| video-factory/media/stream/route.ts | GET | SIN GUARD | no | no |

## Server Actions

| Acción | Guard | Escribe |
| --- | --- | --- |
| admin-providers.ts | ⚠️ REQUEST VACÍO (401 fijo) | sí |
| affiliateActions.ts | SIN GUARD | sí |
| affiliateV2Actions.ts | requireAdmin | sí |
| artistStudioActions.ts | SIN GUARD | sí |
| contractSignActions.ts | SIN GUARD | sí |
| smartLockActions.ts | SIN GUARD | sí |
| spaceActions.ts | SIN GUARD | sí |
| stripeConnectActions.ts | SIN GUARD | sí |
| vendorAuthActions.ts | SIN GUARD | sí |

**RESUMEN**: 34 enlaces UI→API · 22 fachadas/401 · 28 endpoints · 13 con POST.
