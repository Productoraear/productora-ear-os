# EAR OS — SIGNAL FUNNEL ARCHITECTURE & PRE-QUALIFICATION
## ID: EAR-SSOT-SIGNAL-FUNNEL-01
## ESTADO: HECHO_VERIFICADO

Arquitectura del embudo de alta conversión The Signal y su integración con los túneles transaccionales de EAR OS.

---

### 1. MAPA DEL EMBUDO S-CLASS

```mermaid
flowchart TD
    ApexButton[ApexButton / Header Nav] --> TheSignal["/the-signal (Portal de Inmersión)"]
    
    TheSignal --> PreQual["Fase 1: Pre-Calificación de Solvencia (B2C / B2B / B2G / Artista)"]
    PreQual --> ScoreCalc["Cálculo de Índice de Solvencia (88% - 99%)"]
    
    ScoreCalc --> BranchDecision{¿Cómo desea cotizar?}
    
    BranchDecision -->|Afinidad Guiada Tinder| Recommender["/presupuesto (Smart Recommender & Matcher)"]
    BranchDecision -->|Configuración Técnica| Cotizador["/cotizador (MultiPricer S-Class)"]
    
    Recommender --> FastTrack["Reserva Express (30% Depósito Stripe)"]
    Recommender --> DossierLead["Generación Dossier RAG PDF"]
    
    Cotizador --> InstantDeposit["Bloqueo Fecha 30% Stripe Checkout"]
    Cotizador --> FormalProposal["Emisión Propuesta Oficial"]
    
    FastTrack --> CheckoutAPI["/api/payments/checkout"]
    InstantDeposit --> CheckoutAPI
    
    CheckoutAPI --> Success["/success + Contrato Legal ACID"]
```

---

### 2. PROTOCOLOS DE SEGREGACIÓN POR ROL EN THE SIGNAL
- **Particular VIP / Bodas (B2C)**: Canalizado prioritariamente a `/presupuesto` para selección de repertorio, violines y mariachi de gala.
- **Empresas & Convenciones (B2B)**: Acceso al cotizador desglosado con IVA, factura deducible y seguro RC.
- **Ayuntamientos & Sector Público (B2G)**: Acceso a fichas de licitación, homologación de escenarios y riders L-Acoustics.
- **Artistas & Curadores**: Puerta de onboarding para audición de entrada al roster S-Class.
