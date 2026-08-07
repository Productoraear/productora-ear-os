# EAR OS — MARKETPLACE & BOOKING CHECKOUT GRAPH (MACRO FORENSIC EDITION)
## ID: EAR-FORENSIC-CHECKOUT-02
## ESTADO: REQUIERE_VALIDACION (VETO HUMANO ACTIVO PARA STRIPE LIVE)

### 1. GRAFO FLUJO MARKETPLACE -> BOOKING -> CHECKOUT -> LEDGER

```mermaid
flowchart LR
    A[Marketplace / Profile] -->|Selección de Artista| B[BookingCalculator / BespokePricer]
    B -->|Cálculo de Cotización| C[PaymentModal]
    C -->|POST /api/payments/checkout| D[Stripe Checkout Session]
    D -->|Pago Exitoso| E[Redirección a /success]
    E -->|POST /api/contracts/generate| F[Generación de Contrato Legal PDF]
    D -.->|Webhook Stripe| G[/api/webhooks/stripe]
    G -->|Verificación Signature HMAC| H[Update Ledger DB & Confirm Booking]
```

---

### 2. DETALLE DE COMPONENTES DEL EMBUDO

#### Entrada y Cotización
- **Calculadora Estándar**: `BookingCalculator.tsx`
- **Calculadora Bespoke / VIP**: `BespokePricer.tsx`
- **Modal de Pago Dinámico**: `PaymentModal.tsx`

#### Pasarela y Backend
- **Endpoint Checkout**: `/api/payments/checkout`
- **Endpoint Liquidación S-Class**: `/api/payments/liquidate`
- **Receptor Webhook**: `/api/webhooks/stripe`

#### Salida Post-Venta
- **Pantalla de Confirmación**: `src/app/success/page.tsx`
- **Servicio de Contratos**: `/api/contracts/generate` (Genera documento de garantía de actuación).

---

### 3. MATRIZ DE DEUDAS Y VETOS EN EL FLUJO DE PAGO
- **ESTADO: REQUIERE_VALIDACIÓN**
- **Veto de Gobernanza 90/10**: No se autoriza el despliegue final a producción sin la ejecución de un pago real de prueba en Stripe Live con verificación de firma HMAC en `/api/webhooks/stripe`.
- **Idempotencia**: Se requiere comprobar deduplicación en la base de datos para evitar dobles cobros ante reintentos de red.
