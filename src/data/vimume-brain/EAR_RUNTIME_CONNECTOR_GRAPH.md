# EAR OS — RUNTIME CONNECTOR GRAPH (MACRO FORENSIC EDITION)
## ID: EAR-FORENSIC-GRAPH-02
## ESTADO: PASS (GRAFO UNIFICADO DE TODO EL SISTEMA)

Grafo integral de conectores arquitectónicos de EAR OS reconciliado tras inspección forense de 57.037 archivos.

```mermaid
flowchart TD
    subgraph CAPTACION_Y_NUTRITION ["1. Capa de Captación y Educación Publica"]
        Landing["/ (Page Principal)"] --> Matcher["TinderMatcherClient.tsx"]
        Landing --> VimumeHub["/vimume"]
        Landing --> EdwinLanding["/artistas/edwin-agudelo"]
        VimumeHub --> Hermes["/vimume/hermes"]
        EdwinLanding --> BookingCalc["BookingCalculator.tsx"]
    end

    subgraph RUTAS_ROTA_HUERFANAS ["2. Nodos Rotos / Huérfanos Identificados"]
        ApexCTA["ApexButton / Navbar"] -.->|Ruta Huérfana| TheSignal["/the-signal (FALTA)"]
        ArtistasPage["/artistas"] -.->|Push Huérfano| Presupuesto["/presupuesto (FALTA)"]
        B2BGuides["/infraestructura/mundial-2026"] -.->|Link Huérfano| Cotizador["/cotizador (FALTA)"]
    end

    subgraph SEGURIDAD_Y_MIDDLEWARE ["3. Perímetro de Seguridad Edge & Auth"]
        SClassRoute["/centro-mando"] --> EdgeMiddleware{"middleware.ts (ear_auth_signal)"}
        EdgeMiddleware -.->|Sin Cookie| LoginRoute["/login"]
        LoginRoute --> UserSyncAPI["/api/nexus/user/sync"]
        UserSyncAPI --> FirebaseSupabase["Auth Provider & JWT Claims"]
        EdgeMiddleware -->|Con Cookie| SClassConsole["FenixCommandCenter / SClassUI"]
    end

    subgraph SCLASS_PANELS ["4. Ecosistema de Mando (25 Smart Panels)"]
        SClassConsole --> FinPanel["FinancialPanel.tsx"]
        SClassConsole --> NeuralBrain["AstraNeuralBrain.tsx"]
        SClassConsole --> HunterPanel["HunterPanel.tsx"]
        SClassConsole --> VampirePanel["VampirePanel.tsx"]
        SClassConsole --> Logistics["LogisticsDashboard.tsx"]
    end

    subgraph CHECKOUT_AND_POSTVentas ["5. Embudo Económico & Contratos"]
        BookingCalc --> PaymentModal["PaymentModal.tsx"]
        PaymentModal --> CheckoutAPI["/api/payments/checkout"]
        CheckoutAPI --> StripeGateway["Stripe Checkout Live/Test"]
        StripeGateway -->|Success Redirect| SuccessPage["/success"]
        SuccessPage --> ContractAPI["/api/contracts/generate"]
        StripeGateway -.->|Webhook Event| StripeWebhook["/api/webhooks/stripe"]
    end
```

### DICTAMEN DE CONEXIÓN
El grafo muestra una arquitectura bien articulada en el núcleo (Core), con una bifurcación clara entre la captación pública y la consola privada. Las únicas ruinas o desconexiones se encuentran en los accesos directos de cotización genérica (`/presupuesto`, `/cotizador`, `/the-signal`), cuya remediación es inmediata conectándolos al motor del Matcher.
