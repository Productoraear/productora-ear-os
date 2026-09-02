# EAR OS — FORM ACTION MATRIX (MACRO FORENSIC EDITION)
## ID: EAR-FORENSIC-FORMS-02
## ESTADO: PASS (CATÁLOGO MACRO DE ACCIONES REST / SERVER ACTIONS)

### 1. MAPA COMPLETO DE ACCIONES Y FETCHES EN EL SISTEMA

| Componente / Formulario | Ruta / Contexto | Endpoint Invocado | Método | Propósito |
| :--- | :--- | :--- | :--- | :--- |
| `PaymentModal.tsx` | Ventana de Checkout | `/api/payments/checkout` | POST | Generación de Session de Stripe |
| `BookingCalculator.tsx` | Widget de Cotización | `/api/payments/checkout` | POST | Pasarela de Pago Directa |
| `BespokePricer.tsx` | Cotizador VIP | `/api/payments/checkout` | POST | Reserva Bespoke |
| `FinancialPanel.tsx` | Panel Financiero S-Class | `/api/payments/liquidate` | POST | Liquidación interna |
| `NeuralFilters.tsx` | Filtros IA de Búsqueda | `/api/astra/query` | POST | Búsqueda semántica Astra |
| `ghost_hunter.ts` | Motor RAG Autónomo | `/api/rag/query` | POST | Consulta de base de conocimientos |
| `AstraNeuralBrain.tsx` | Panel Neural S-Class | `/api/astra` | POST | Control de red neuronal |
| `useTripwire.ts` / `hunter.ts` | Telemetría / Escudo | `/api/tripwire` | POST | Detección de anomalías |
| `MarketplaceFeedbackService` | Telemetría Marketplace | `/api/telemetry/marketplace` | POST | Registro de comportamiento |
| `LogisticsDashboard.tsx` | Centro de Mando Logístico | `/api/nexus/logistics/events` | GET/POST | Trazabilidad de giras |
| `reclamar-perfil/page.tsx` | Reclamación de Perfil | `/api/profiles/claim` | POST | Solicitud de verificación |
| `ArtistProfileForm.tsx` | Onboarding Artista | `/api/profiles` | POST/PUT | Creación de perfil |
| `AuthContext.tsx` / `SovereignLogin` | Autenticación | `/api/nexus/user/sync` | POST | Sincronización JWT / Claims |
| `HunterPanel.tsx` | Módulo Hunter | `/api/hunter/phantom` | POST | Scraping / Ingesta BOE |
| `VampirePanel.tsx` | Módulo Vampire | `/api/vampire/transmute` | POST | Transmutación de datos |
| `VimumeCorePanel.tsx` | Núcleo Vimume | `/api/vimume/sessions`, `/api/vimume/atoms` | GET/POST | Sesiones biométricas |

---

### 2. EVALUACIÓN FORENSE DE MANEJO DE FORMULARIOS
- **Formularios HTML Puros (`<form action="...">`)**: Se constata que **el 100% de los formularios utiliza controladores `onSubmit` de React** delegados a endpoints `/api/...`.
- **Integridad de Endpoints**: Todos los endpoints invocados por componentes existen en la estructura de `src/app/api/`, garantizando que no hay llamadas a endpoints fantasma en el frontend.

---

### 3. DICTAMEN DE COMPONENTES FORMULARIO
Los componentes interactivos están vinculados correctamente a sus respectivos microservicios `/api/`. Ningún formulario de captura de datos queda desamparado sin handler.
