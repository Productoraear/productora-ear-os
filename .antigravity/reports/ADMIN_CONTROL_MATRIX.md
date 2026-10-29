# MATRIZ DE TRAZABILIDAD — /admin/control

> Emitido por `scripts/audit_admin_control_forensics.cjs` (modo estricto).

## UI /admin/control → Endpoint

| UI | Endpoint | Verbo | Guard | Bearer cliente | Veredicto |
| --- | --- | --- | --- | --- | --- |
| src/app/(admin)/admin/control/ControlDashboard.tsx | /api/admin/affiliates | GET+PATCH+POST+DELETE | requireAdmin | SÍ | ✅ VERIFICADO |
| src/app/(admin)/admin/control/ControlDashboard.tsx | /api/admin/artists | GET+PATCH+POST | requireAdmin | SÍ | ✅ VERIFICADO |
| src/app/(admin)/admin/control/ControlDashboard.tsx | /api/admin/fleet | GET+PATCH+POST | requireAdmin | SÍ | ✅ VERIFICADO |
| src/app/(admin)/admin/control/ControlDashboard.tsx | /api/admin/providers | GET+PATCH+POST | requireAdmin | SÍ | ✅ VERIFICADO |
| src/app/(admin)/admin/control/ControlDashboard.tsx | /api/admin/therapists | GET+PATCH+POST | requireAdmin | SÍ | ✅ VERIFICADO |
| src/app/(admin)/admin/control/ControlDashboard.tsx | /api/admin/treasury | GET+POST | requireAdmin | SÍ | ✅ VERIFICADO |
| src/app/(admin)/admin/control/tabs/AfiliadosTab.tsx | /api/admin/affiliates | GET+PATCH+POST+DELETE | requireAdmin | SÍ | ✅ VERIFICADO |
| src/app/(admin)/admin/control/tabs/ArtistasTab.tsx | /api/admin/artists | GET+PATCH+POST | requireAdmin | SÍ | ✅ VERIFICADO |
| src/app/(admin)/admin/control/tabs/FlotaTab.tsx | /api/admin/fleet | GET+PATCH+POST | requireAdmin | SÍ | ✅ VERIFICADO |
| src/app/(admin)/admin/control/tabs/ProveedoresTab.tsx | /api/admin/providers | GET+PATCH+POST | requireAdmin | SÍ | ✅ VERIFICADO |
| src/app/(admin)/admin/control/tabs/TerapeutasTab.tsx | /api/admin/therapists | GET+PATCH+POST | requireAdmin | SÍ | ✅ VERIFICADO |
| src/app/(admin)/admin/control/tabs/TesoreriaTab.tsx | /api/admin/treasury | GET+POST | requireAdmin | SÍ | ✅ VERIFICADO |

## API /api/admin/*

| Ruta | Verbos | Guard | Zod | Escribe |
| --- | --- | --- | --- | --- |
| affiliates/route.ts | GET+PATCH+POST+DELETE | requireAdmin | sí | sí |
| artists/route.ts | GET+PATCH+POST | requireAdmin | sí | sí |
| compile-intent/route.ts | POST+GET | requireAdmin | sí | no |
| demand-map/route.ts | GET | requireAdmin | sí | no |
| dispatch/lock/route.ts | POST | SIN GUARD | no | no |
| dispatch/route.ts | GET | SIN GUARD | no | no |
| fleet/route.ts | GET+PATCH+POST | requireAdmin | sí | sí |
| gpu-status/route.ts | GET+POST | requireAdmin | sí | no |
| infrastructure/dual-engine/route.ts | GET | requireAdmin | sí | no |
| managed-vendors/route.ts | GET+POST | SIN GUARD | no | sí |
| mobile-studio/config/route.ts | GET+POST | requireAdmin | sí | no |
| ollama-shield/route.ts | GET+POST | requireAdmin | sí | no |
| oraculo/approve/route.ts | POST | requireAdmin | sí | no |
| providers/route.ts | GET+PATCH+POST | requireAdmin | sí | sí |
| providers/toggle-visibility/route.ts | GET+POST | requireAdmin | sí | no |
| route-governance/route.ts | GET+POST | requireAdmin | sí | no |
| sentinel/route.ts | GET+POST | requireAdmin | sí | no |
| session/route.ts | POST+DELETE+GET | SIN GUARD | no | no |
| sysinfo/route.ts | GET | requireAdmin | sí | no |
| tasks/inject/route.ts | GET+POST | requireAdmin | sí | no |
| telemetry/route.ts | GET | requireAdmin | sí | no |
| therapists/route.ts | GET+PATCH+POST | requireAdmin | sí | sí |
| treasury/route.ts | GET+POST | requireAdmin | sí | sí |
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
| admin-provider-profile.ts | requireAdmin | no |
| admin-providers.ts | requireAdmin | sí |
| affiliateActions.ts | SIN GUARD | sí |
| affiliateV2Actions.ts | requireAdmin | sí |
| artistStudioActions.ts | SIN GUARD | sí |
| contractSignActions.ts | SIN GUARD | sí |
| mariachiNetworkActions.ts | SIN GUARD | sí |
| smartLockActions.ts | SIN GUARD | sí |
| spaceActions.ts | SIN GUARD | sí |
| stripeConnectActions.ts | SIN GUARD | sí |
| vendorAuthActions.ts | SIN GUARD | sí |

**RESUMEN**: 12 enlaces UI→API en /admin/control · 0 fachadas/401 · 30 endpoints mapeados.
