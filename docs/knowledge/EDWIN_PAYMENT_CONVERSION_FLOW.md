# 💳 EDWIN AGUDELO — PAYMENT & CONVERSION FLOW

> **Flujo Comercial de Cobro Inmediato:** Arquitectura de pasarela de pago (Stripe, Bizum, Transferencia) con gatillos de urgencia e idempotencia contractual.

---

## 1. Diagrama de Flujo de Conversión & Cobro

```mermaid
graph TD
    A["Lead en Landing / Ficha Artista"] -->|Click: Reservar Fecha| B["Formulario Contexto de Evento"]
    B -->|Cálculo Estimado ASTRA| C{"¿Requiere Verificación Manual?"}
    
    C -->|No: Servicio Estándar B2C| D["Cobro de Señal (30%) via Stripe / Bizum"]
    C -->|Sí: Evento B2B / Licitación| E["Presupuesto Custom & Envio Factura"]
    
    D -->|Pago OK| F["Emisión Recibo + Contrato Digital Inmediato"]
    D -->|Pago Fallido / Cancelado| G["Fallback a Enlace Bizum / Asistencia por WhatsApp"]
    
    F --> H["Reserva Bloqueada en Calendario EAR OS & Notificación a Edwin"]
```

---

## 2. Configuración de Pasarelas de Pago
1. **Stripe Checkout / Elements:** Tarjeta de crédito/débito, Apple Pay, Google Pay para depósitos del 30% en tiempo real.
2. **Bizum Comercial:** Número corporativo homologado para reservas ultrarrápidas de serenatas y urgencias de 24h.
3. **Transferencia Bancaria (IBAN ES...):** Disponible para eventos corporativos y ayuntamientos que requieren factura formal con IVA.
