# EAR OS — ELEVACIÓN S-CLASS DE ENRUTAMIENTO E INTELIGENCIA
## ID: EAR-SSOT-ROUTE-UPGRADE-01
## ESTADO: HECHO_VERIFICADO (3 SUPERFICIES ELEVADAS A GRADO S-CLASS)

Este documento certifica la elevación arquitectónica de las tres superficies neurálgicas de captación y cotización de Productora EAR.

---

### 1. `/presupuesto` — Smart Recommender & Multi-dimensional Matcher Engine
- **Ubicación:** `src/app/(public)/presupuesto/page.tsx` + `src/app/components/public/TinderMatcherClient.tsx`.
- **Evolución:** Pasó de un carrusel básico a un motor de recomendación probabilística en tiempo real.
- **Filtros Multidimensionales Integrados:**
  - Segmento de Cliente: `B2C (Particular/Bodas)`, `B2B (Corporativo/Empresas)`, `B2G (Institucional/Ayuntamientos)`.
  - Capacidad / Aforo: Slider dinámico de 20 a 1.500+ asistentes.
  - Entorno Acústico: `Interior` vs `Exterior (Rider ampliado)`.
  - Nivel de Urgencia: `Estándar (>30d)`, `Prioritaria (<15d)`, `Express (<72h)`.
  - Ubicación Geográfica: Sede Central Madrid, Toledo, Valencia, Barcelona, Sevilla, Nacional.
- **Scoring & Salidas:**
  - Calcula el `Afinidad Score` en tiempo real (45% a 99%).
  - Muestra la **Recomendación Primaria Nº 1** con especificaciones técnicas completas + **2 Alternativas Tácticas**.
  - **Bifurcación Dual:** *Reserva Express 1-Click (30% Depósito con Stripe)* vs *Acompañamiento Guiado y Dossier RAG*.

---

### 2. `/cotizador` — MultiPricer S-Class & Arquitectura de Costes
- **Ubicación:** `src/app/(public)/cotizador/page.tsx` + `src/features/finance/ui/MultiPricer.tsx`.
- **Purga de Elementos Incompatibles:** Se eliminó por completo "Diseño Web Completo" y se sustituyó por los servicios nativos de Productora EAR.
- **Catálogo de Alta Fidelidad:**
  1. *Booking Artístico de Gala*: Solista & Piano (650€), Cuarteto Imperial (950€), Quinteto de Honor (1250€), Octeto Magistral (2400€), Banda Monumental (4500€).
  2. *Producción & Sonorización S-Class*: L-Acoustics K2/Kara (1800€), Iluminación Robótica DMX (1200€), Tarimas & Trussing (1500€), Shure Axient Digital (650€).
  3. *Logística & Dirección Institucional*: Dirección Musical de Autor (850€), Flota Táctica & Transporte (350€), Póliza RC 1.000.000€ (250€), Licitación B2G Homologada (950€).
- **Fórmula de Precios:** Base + Desplazamiento Provincial + Factor Urgencia + 21% IVA + Cálculo de Depósito de Bloqueo (30%).

---

### 3. `/the-signal` — Portal Inmersivo de Pre-Calificación & Solvencia
- **Ubicación:** `src/app/(public)/the-signal/page.tsx`.
- **Evolución:** De landing estática a experiencia inmersiva cinematográfica interactiva.
- **Capacidades:**
  - Selector interactivo de rol (Particular VIP, Empresa B2B, Ayuntamiento B2G, Artista Curador).
  - Cálculo de Índice de Solvencia Técnica en directo (88% a 99% Apto S-Class).
  - Certificación de Garantías (Blindaje Legal ACID, Acústica Zero-Fail, Solvencia Escénica).
  - Canalización inteligente y sin fricción hacia `/presupuesto` o `/cotizador`.
