# Stitch MCP — Customer Journey Design System & Screen Extraction Map

**Project SSOT:** `projects/574504229353510337` (Artistas - Productora EAR)  
**Design Theme:** Manrope / Dark Mode / Custom Color `#ecb613` (Amber/Gold)  
**Extraction Policy:** Sequential by Customer Journey, 1 Screen at a Time, Zero Unconnected Pieces.

---

## 1. Design System & Style Tokens (SSOT Visual)
- **Primary Color:** `#ecb613` (Gold/Amber Dominance)
- **Color Mode:** Dark Mode (`#0d0d0d` base, `#1a1a1a` surface cards)
- **Typography:** `Manrope` (Sans-serif, clean UI precision)
- **Border Radius:** `ROUND_FULL` (Pill badges, rounded cards)
- **Device Type Target:** Responsive (Mobile First + Desktop Adaptation)

---

## 2. Customer Journey Architecture & Screen Inventory

### Journey 1: Adquisición & Descubrimiento (Public Showcase)
*Objetivo: Impacto visual, propuesta de valor de Productora EAR, catálogo de artistas y servicios.*

| Step | Screen ID | Description | Journey Status | Implementation Backlog |
|---|---|---|---|---|
| 1.1 | `aa21cfd6817643daa6d9a817e2b168bc` | Home / Landing Page Principal | `MAPPED` | `src/app/page.tsx` |
| 1.2 | `8cbfb20c8de54465a3a4e5fb207d8320` | Catálogo Público de Artistas | `MAPPED` | `src/app/artistas/page.tsx` |
| 1.3 | `e65342aa99f340da86edf4c7fac498c4` | Perfil Detalle de Artista / Showreel | `MAPPED` | `src/app/artistas/[slug]/page.tsx` |
| 1.4 | `e6cc81548fc24378a55529b314169cd2` | Calculadora de Presupuesto Eventos | `MAPPED` | `src/app/presupuesto/page.tsx` |

### Journey 2: Onboarding & Autenticación
*Objetivo: Registro fluido, selección de rol (Cliente / Artista / Staff) y sincronización Firebase JWT.*

| Step | Screen ID | Description | Journey Status | Implementation Backlog |
|---|---|---|---|---|
| 2.1 | `1039ea5ca38f433c807d101b40401ccd` | Portal Login / Registro SSO | `MAPPED` | `src/app/login/page.tsx` |
| 2.2 | `02094ba418e54e9bb9c9b3971a961434` | Selección de Perfil / Rol Soberano | `MAPPED` | `src/app/onboarding/role/page.tsx` |
| 2.3 | `10ac1505540c40689244b4fb0f528d2f` | Verificación de Datos & Consentimiento | `MAPPED` | `src/app/onboarding/verify/page.tsx` |

### Journey 3: Activación & Reserva de Servicio
*Objetivo: Configuración de fecha, tipo de evento (Boda, Corporativo, Festival) y propuesta económica.*

| Step | Screen ID | Description | Journey Status | Implementation Backlog |
|---|---|---|---|---|
| 3.1 | `1884b94d6fac4b0d9fc89b18c72f80e6` | Formulario de Reserva / Fechas | `MAPPED` | `src/app/booking/step1/page.tsx` |
| 3.2 | `0c2baf3536b247c9b9667c69dfe32ec2` | Configuración de Rider Técnico | `MAPPED` | `src/app/booking/step2/page.tsx` |
| 3.3 | `23dc91db2a1940d7946fe1ac0248a53a` | Resumen de Propuesta & Términos | `MAPPED` | `src/app/booking/summary/page.tsx` |

### Journey 4: Conversión & Pasarela de Pago
*Objetivo: Cobro seguro mediante Stripe Checkout, depósito/reserva y confirmación de booking.*

| Step | Screen ID | Description | Journey Status | Implementation Backlog |
|---|---|---|---|---|
| 4.1 | `6b19571687314eabb5eded1cd9c3cb90` | Checkout / Desglose Depósito | `MAPPED` | `src/app/checkout/page.tsx` |
| 4.2 | `1b0bf17a29df4e06ae2e36c7f2fba934` | Confirmación / Recibo de Pago | `MAPPED` | `src/app/checkout/success/page.tsx` |

### Journey 5: Retención & Control Planes (Dashboards)
*Objetivo: Gestión continuada para Artistas, CRM de Clientes y Administración Dominante.*

| Step | Screen ID | Description | Journey Status | Implementation Backlog |
|---|---|---|---|---|
| 5.1 | `3693d7146db549c686491a105d95c690` | Panel Soberano Artista (Fechas/Ganancias) | `MAPPED` | `src/app/dashboard/artista/page.tsx` |
| 5.2 | `bc336e0a79a24db2b7a3c30aba16448f` | Panel CRM Cliente / Estado de Contrato | `MAPPED` | `src/app/dashboard/cliente/page.tsx` |
| 5.3 | `7f3393eda77340cd9916393d3f97cf76` | Control Plane Admin / Liquidaciones | `MAPPED` | `src/app/dashboard/admin/page.tsx` |

---

## 3. Reglas de Extracción & Vampirización
1. **Extracción Secuencial:** No se implementan pantallas fuera del orden numérico del Journey.
2. **Coherencia de Tokens:** Todos los componentes se renderizan con las variables HSL derivadas de `#ecb613` y Manrope.
3. **Validación de Discrepancias:** Si una pantalla extraída de Stitch carece de componente en `src/components/`, se genera en `src/components/sclass/` previo a la pantalla.
