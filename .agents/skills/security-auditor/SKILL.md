---
name: security-auditor
description: Escaneo de secretos, sanitización de entradas y control OWASP antes de compilar. Previene fugas de tokens y credenciales en el bundle público, verifica el modo fail-closed en APIs y webhooks y audita firmas HMAC con comparación en tiempo constante.
lifecycle_phase: REVIEW (QA | Gate)
command: /review
framework: OWASP ASVS L3 · SEC-1..SEC-5 (.clinerules §6)
governance: ANTIGRAVITY OMEGA v11.0 (S-CLASS)
---

# Security Auditor · Default-Deny y Blindaje de Fronteras (EAR OS)

## Misión
Convertir la doctrina SEC-1..SEC-5 en compuertas ejecutables: ninguna ruta nueva entra al repositorio sin el caso negativo probado (401/403/503) antes del camino feliz.

## Superficies auditadas (comandos verificados en el repositorio)

| Riesgo | Comando | Fichero real |
| :--- | :--- | :--- |
| Secreto inlinado en el bundle del cliente (`NEXT_PUBLIC_*` / `VITE_*`) | `npm run audit:public-secrets` | `scripts/audit_public_secret_leaks.cjs` |
| Secreto en la configuración MCP versionada | `npm run audit:mcp-hygiene` | `scripts/audit_mcp_secret_hygiene.cjs` |
| Residuos pesados y datos personales en el repo | `npm run audit:residues` | `scripts/audit_heavy_residues.cjs` |
| Payloads ASVS L3 | `npm run audit:asvs-l3` | `scripts/audit_asvs_l3_payloads.cjs` |
| Guard de cron / bearer de tareas programadas | `npm run verify:cron-secret` · `npm run probe:cron` | `scripts/verify_cron_secret_guard.ts` · `scripts/cron_secret_probe.cjs` |
| 0 `verified:true` sin teléfono real (INV-06 · INV-12) | `npm run audit:phone` | `scripts/audit_phone_exposure.cjs` |
| P0 #8 del scorecard: 0 secretos en fichero `"use client"` de la ruta de dinero | `npm run audit:omega-rojo` | `scripts/audit_omega_rojo_scorecard.cjs` |

## Protocolo de ejecución
1. **Fuga de secretos**: `npm run audit:public-secrets` → Exit 0 exigido. Cualquier hallazgo se trata como credencial comprometida: se declara y se **rota** (INV-07).
2. **Modo fail-closed**: todo endpoint de cobro, cron o webhook debe abortar cerrado ante secreto ausente o firma inválida. Medido en esta doctrina: `fail-closed` aparece en 45 ficheros de `src/` (`git grep -l "fail-closed" -- src`), entre ellos `src/app/api/stripe/webhook/route.ts` y `src/app/actions/checkoutActions.ts`.
3. **Firmas HMAC**: `createHmac` en 14 ficheros y `timingSafeEqual` en 9 (`git grep -l`). Toda comparación de firma se hace con `timingSafeEqual`, nunca con `===` (fuga por tiempo).
4. **Validación de frontera**: esquemas estrictos (Zod/Valibot) en todo input externo (SEC-4) y rate-limit + circuit breaker en webhooks y cobro (SEC-5).
5. **Autorización server-side**: matriz `role: public | user | vendor | admin | cron` verificada en servidor, no en el cliente (SEC-2).

## Tabla Anti-Racionalización
| Excusa común del agente | Réplica de ingeniería senior |
| :--- | :--- |
| *"Es solo una API key de frontend, es pública."* | Si contiene `SECRET`, `TOKEN`, `PRIVATE`, `SERVICE_ROLE` o `WEBHOOK`, está comprometida: se rota, no se justifica. |
| *"La firma la valida el SDK de Stripe, no hace falta comparar."* | El SDK valida su cabecera; los bridges internos (briefs, tokens de aceptación, locks) llevan HMAC propio y exigen `timingSafeEqual`. |
| *"Añado la ruta y luego le pongo el guard."* | SEC-1 es explícito: primero el 401/403/503, después el camino feliz. |

## Criterios de salida (Done)
1. `npm run audit:public-secrets` → Exit 0 · 0 fugas.
2. `npm run audit:mcp-hygiene` → Exit 0.
3. `npm run audit:omega-rojo` → P0 #8 en `VERIFICADO`.
4. Todo secreto ausente en runtime produce `fail-closed`, no un valor por defecto silencioso.
