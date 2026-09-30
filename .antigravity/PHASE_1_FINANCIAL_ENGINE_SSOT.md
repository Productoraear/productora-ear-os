# 🏛️ FASE 1: MOTOR FINANCIERO Y ALGORITMO DE RESERVAS (SSOT)
> **Aprobado por CEO — Octubre 2026**

Este documento rige la arquitectura financiera del Booking Engine en EAR OS V2. 

## 1. PRECIOS Y DEPÓSITOS
- **Yield Management:** Multiplicadores automáticos controlados por EAR OS (ej. +30% en alta demanda).
- **Price-Lock (Depósito):** Será un porcentaje del presupuesto total (ej. 20%) en lugar de un fijo de 100€.
- **Límite Mínimo:** 0€. Se permiten micro-servicios.
- **Descuentos/Promociones:** Solo aplicables a los gastos de logística y transporte. No al caché.
- **Topes Logísticos:** Cero límite. Si el cliente quiere pagar 5.000€ de viaje, el sistema lo permite.
- **Divisas:** Soporte nativo multidivisa (USD, GBP), prioridad Euros.

## 2. EXTRACCIÓN DE COMISIÓN (20% INMUTABLE)
- **Cobro de EAR OS:** EAR OS descuenta su 20% directamente sobre el depósito (Price-Lock) y transfiere el resto al proveedor.
- **Escrow / Gestión Final:** Preferiblemente modelo Escrow (Cliente paga 100% a Stripe, EAR OS custodia y paga tras el bolo), adaptable según el Tier.
- **Afiliados (Fincas B2B):** Se llevan un 5% extraído del 20% de EAR OS (EAR OS = 15%, Finca = 5%).
- **Propinas:** Incentivadas post-evento. EAR OS cobra 20% de comisión sobre las propinas.
- **Upsells y Horas Extra in situ:** Pago instantáneo vía Stripe Link (WhatsApp/SMS). EAR OS extrae el 20%.
- **Overrides Manuales (Rebajas a Mega-Proveedores):** Permitido el 1er año. A partir del 2º año, el sistema bloquea cualquier bajada por debajo del 20%.

## 3. ALGORITMO Y ASIGNACIÓN (MATCHING)
- **Open Leads (Ej: Mariachi Madrid genérico):** Modelo Uber (Bidding). Los proveedores de la zona reciben la alerta, el primero en aceptar se lo queda.
- **Insta-Book:** Instantáneo solo si el calendario del proveedor está libre y el radio validado. Si no, pasa a Booking Request.
- **Bounces (Rechazos):** Hasta 3 intentos de salto a otros proveedores. Si el 3º falla, se cancela y se devuelve el dinero para evitar mala experiencia.
- **Timeouts:** Si un proveedor no responde un request, el sistema cancela, le pone un Strike, y asigna al siguiente.
- **Multi-Reserva:** Un solo carrito. El cliente paga un Price-Lock consolidado y el sistema divide el flujo a cada proveedor.
- **Fallos de Algoritmo:** Derivados a Call Center EAR OS para cotización manual.

## 4. CANCELACIONES Y FACTURACIÓN
- **Grace Period (Cliente):** 1 Hora desde el pago para cancelar gratuitamente y sin fricción.
- **Cancelación Cliente:** Proveedores Premium fijan sus propias reglas, pero el 20% de EAR OS es intocable (si hay devolución parcial, EAR OS siempre gana).
- **Cancelación Proveedor:** Bajan en el algoritmo. Se buscará suplente. El proveedor asume penalizaciones, que podrá pagar a plazos.
- **Facturación Final:** El proveedor emite su factura del 80% al cliente. EAR OS emite la factura del 20% (comisión) al proveedor.
