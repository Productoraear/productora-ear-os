---
name: verification-and-testing
description: Validación estricta de compilación y pruebas de contratos de negocio.
lifecycle_phase: VERIFY (Test | Debug)
command: /test
framework: addyosmani/agent-skills
governance: ANTIGRAVITY OMEGA v7.0 (S-CLASS)
---

# VERIFY (Test | Debug) :: Verification & Testing

## 🎯 Principle
> **Tests are proof. Zero tolerance for unverified assumptions.**

## ⚡ When to Use
Invoca `/test` tras cualquier modificación de código para verificar la estabilidad global del sistema.

## 📋 Step-by-Step Workflow
1. **Comprobación de Compilación Estricta**:
   - Ejecutar `npx tsc --noEmit`.
   - Exigir **Exit Code 0** (cero errores o advertencias de tipo).
2. **Validación de Reglas de Negocio (SSOT)**:
   - Tarifa Base Solista: 350,00 €.
   - Split Soberano: 80% Artista / 10% EAR OS / 10% VIMUME.
   - Depósito de Reserva: 100,00 € en Stripe (Price-Lock SHA-256).
   - Límite B2G Contrato Menor (Art. 118 LCSP): < 14.250,00 € y < 75 dB SPL.
3. **Zonas Cero Inmutables**:
   - Asegurar que `src/lib/vimume/b2g-tender-engine.ts` y `src/lib/astra/astra-conversation-engine.ts` no han sufrido alteraciones.

## 🛡️ Anti-Rationalization Table
| Excusa Común del Agente | Réplica de Ingeniería Senior |
| :--- | :--- |
| *"No toqué nada crítico, seguro que el build pasa."* | Validar con tsc toma 3 segundos. Asumir cuesta un despliegue roto en Netlify. |
| *"Solo cambié un texto o un estilo CSS."* | Un carácter fuera de lugar en JSX rompe la compilación de todo el App Router. |

## ✅ Exit Criteria
- `npx tsc --noEmit` -> Exit Code 0.
