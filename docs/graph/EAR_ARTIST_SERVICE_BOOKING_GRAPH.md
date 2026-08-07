# 🕸️ EAR OS ARTIST SERVICE BOOKING GRAPH (MMD)

> **SSOT de Grafo del Servicio de Reserva & Operaciones:** Flujo Mermaid de alta fidelidad conectando la captación por landing, filtros, formulario del homenajeado, cobro Stripe/Bizum, resguardo y tracking Fleet OS con alertas por WhatsApp/Telegram.

---

## 1. Flowchart del Grafo de Reserva & Operaciones

```mermaid
flowchart TD
    subgraph Capture ["1. Captación & Selección"]
        L1["Landing Geo / Intención (/landings/...)"] --> F1["Ficha Artista (/artistas/edwin-agudelo)"]
        F1 --> Form1["Formulario Configuración (/reservar/edwin-agudelo)"]
    end

    subgraph Config ["2. Filtros & Datos del Homenajeado"]
        Form1 --> StepA["Paso 1: Festejo + Población + Formato + Fecha/Hora"]
        StepA --> StepB["Paso 2: Datos Homenajeado (Nombre + Sorpresa + Canciones + Dedicatoria)"]
        StepB --> StepC["Paso 3: Contactos + Selección de Método de Pago"]
    end

    subgraph Payment ["3. Cobro Idempotente & Resguardo"]
        StepC --> PayEngine{"¿Método Elegido?"}
        PayEngine -->|Stripe Elements| PI["PaymentIntent 30% Depósito"]
        PayEngine -->|Bizum Comercial| BZ["Bizum Directo 30% / 100%"]
        PI & BZ --> PDF["Generación Recibo Digital + QR Contrato Inmutable (/gracias/[resId])"]
    end

    subgraph Dispatch ["4. Logística & Telemetría Fleet OS"]
        PDF --> Telemetry["Fleet OS Auto-Dispatch & Booking Created"]
        Telemetry -. Alerta Inmediata .-> Telegram["Telegram Bot (@EarOsOperationsBot)"]
        Telemetry -. Confirmación .-> WhatsApp1["WhatsApp Cliente: Recibo + Tracking Link"]
    end

    subgraph Tracking ["5. Live Tracking Sin Login (/track/[token])"]
        WhatsApp1 --> TrackUI["Página /track/[token] (Live GPS + ETA + Status)"]
        TrackUI --> S1["🟢 Asignado"] --> S2["🚚 En Camino (Live GPS)"] --> S3["📍 En Ubicación"] --> S4["🎤 Actuación en Curso"] --> S5["🏁 Finalizado & AuraWallet Split (80%)"]
    end
```
