# 📐 EAR OS — ESPECIFICACIÓN QUIRÚRGICA DE PANTALLAS DE STITCH (15 NUCLEARES)

> **Manual de Especificación Anatómica de Pantallas:** Análisis quirúrgico bloque por bloque, botón por botón, lenguaje por lenguaje y comportamiento por comportamiento de las 15 pantallas de Stitch (`projects/574504229353510337`).

---

## 1. Mapeo Quirúrgico de Pantallas Nucleares

---

### PANTALLA 01: Home Showcase Principal
- **ID Stitch:** `aa21cfd6817643`
- **Nombre de Página:** `Home Showcase — Productora EAR OS`
- **Ruta Next.js:** `src/app/page.tsx`
- **Posición en el Journey:** **Paso 1.1 (Descubrimiento Orgánico & Primera Impresión)**
- **Lenguajes & Tech:** `TypeScript, React Server Component, Tailwind CSS, Framer Motion, Lucide Icons`
- **Cualidades Visuales:** Dark Mode Glassmorphism (`bg-zinc-950/80 backdrop-blur-xl`), Tipografía Inter/Outfit, Accent Gold (`#ECB613`).

#### Bloques Internos (6 Bloques):
1. **Bloque 1: Navigation Bar & Smart Header:**
   - *Elementos:* Logo EAR OS, selector de idioma, botón de búsqueda `OmniSearchModal`, enlace a marketplace.
   - *CTAs:* `[ Ver Roster Elite ]` -> `/artistas`, `[ Centro Mando ]` -> `/centro-mando`.
2. **Bloque 2: Hero Section Video/Showreel:**
   - *Elementos:* Título H1 "Experiencias Artísticas de Alto Valor Emocional", vídeo en bucle de serenata de gala.
   - *CTAs:* `[ Cotizar Evento Ahora ]` -> `/presupuesto`, `[ Probar Smart Matcher ]` (Abre Tinder Matcher Modal).
3. **Bloque 3: Smart Visitor Profiler & Tinder-Style Matcher:**
   - *Elementos:* Selector B2C/B2B/B2G, tarjetas animadas con Framer Motion, especificaciones técnicas.
   - *CTAs:* `[ Hacer Match ]`, `[ Siguiente ]`, `[ Express Checkout 30% ]`.
4. **Bloque 4: Matriz de Posicionamiento por Stakeholder:**
   - *Elementos:* Pestañas interactivas (Bodas Nupciales, Eventos Empresa, Ayuntamientos Festejos).
5. **Bloque 5: Prueba Social & Testimonios Verificados:**
   - *Elementos:* Slider de opiniones reales extraídas de `EDWIN_TESTIMONIALS_PROOF_INDEX.csv` con valoración 5.0★.
6. **Bloque 6: Footer Institucional & Governance:**
   - *Elementos:* Links legales, aviso de datos, sello NIF/CIF y certificado SSL.

---

### PANTALLA 02: Catálogo & Marketplace de Artistas
- **ID Stitch:** `8cbfb20c8de544`
- **Nombre de Página:** `Marketplace de Artistas Roster Elite`
- **Ruta Next.js:** `src/app/artistas/page.tsx`
- **Posición en el Journey:** **Paso 1.2 (Exploración & shortlisting)**
- **Lenguajes & Tech:** `TypeScript, React Client Component, Tailwind CSS, Fuse.js (Search), Server Actions`

#### Bloques Internos (4 Bloques):
1. **Bloque 1: Header de Filtrado Dinámico:**
   - *Elementos:* Input de búsqueda por nombre/provincia, chips de género (Mariachi, Flamenco, Cuerda, Orquesta).
2. **Bloque 2: Grid de Tarjetas de Artista:**
   - *Elementos:* Foto de portada, badge "Roster Oficial", rating 5.0★, tarifa base desde 950€.
   - *CTAs:* `[ Ver Perfil S-Class ]` -> `/artistas/[slug]`, `[ Reserva Rápida ]`.
3. **Bloque 3: Widget de Disponibilidad en Tiempo Real:**
   - *Elementos:* Datepicker interactivo que consulta la agenda en tiempo real.
4. **Bloque 4: Banner B2G / Licitaciones:**
   - *Elementos:* Formulario de descarga de Dossier para ayuntamientos.

---

### PANTALLA 03: Perfil Maestro de Artista (Edwin Agudelo)
- **ID Stitch:** `e65342aa99f340`
- **Nombre de Página:** `Perfil Maestro — Mariachi Edwin Agudelo`
- **Ruta Next.js:** `src/app/artistas/[slug]/page.tsx`
- **Posición en el Journey:** **Paso 1.3 (Evaluación Profunda & Decisión de Reserva)**
- **Lenguajes & Tech:** `TypeScript, React Client Component, Next/Image, Audio Player HTML5, Stripe API`

#### Bloques Internos (5 Bloques):
1. **Bloque 1: Profile Hero Header:**
   - *Elementos:* Avatar gigante de gala, insignias de verificación, años de trayectoria, 4.300+ bolos ejecutados.
2. **Bloque 2: Reproductor de Audio/Canciones Clave:**
   - *Elementos:* Player con temas icónicos ("Si Nos Dejan", "El Rey", "Cielito Lindo").
3. **Bloque 3: Módulos de Formato & Tarifas:**
   - *Elementos:* Cuarteto de Gala (950€), Quinteto Imperial (1.250€), Octeto de Oro (2.400€).
4. **Bloque 4: Widget Cotizador por Kilometraje:**
   - *Elementos:* Input de dirección destino con cálculo Haversine de distancia.
   - *CTAs:* `[ Reservar con Depósito 30% ]` -> `/checkout`.
5. **Bloque 5: Asistente RAG Educativo:**
   - *Elementos:* Chat flotante conectado a `POST /api/rag/query` sobre la trayectoria de Edwin Agudelo.

---

### PANTALLA 04: Calculadora de Presupuesto Eventos
- **ID Stitch:** `e6cc81548fc243`
- **Nombre de Página:** `Cotizador Inteligente de Presupuesto`
- **Ruta Next.js:** `src/app/presupuesto/page.tsx`
- **Posición en el Journey:** **Paso 1.4 (Transparencia Financiera)**
- **Lenguajes & Tech:** `TypeScript, Google Maps Geocoding API, Haversine Math, Server Actions`

#### Bloques Internos (3 Bloques):
1. **Bloque 1: Selector de Formato & Kilometraje:**
   - *Inputs:* Músicos requeridos (4, 5, 8, 12), origen ("Madrid"), destino ("Toledo").
2. **Bloque 2: Desglose de Costes Inmutable:**
   - *Elementos:* Honorarios base + Dietas + Kilometraje (0,35€/km) = Total Transparente.
3. **Bloque 3: Fast-Track Checkout Trigger:**
   - *CTAs:* `[ Continuar a Reserva con Depósito del 30% ]`.

---

### PANTALLA 05: Portal Login & Autenticación SSO
- **ID Stitch:** `1039ea5ca38f43`
- **Nombre de Página:** `Acceso Seguro — Portal EAR OS`
- **Ruta Next.js:** `src/app/login/page.tsx`
- **Posición en el Journey:** **Paso 2.1 (Autenticación & Identificación)**
- **Lenguajes & Tech:** `TypeScript, Firebase Auth / Supabase JWT, OAuth Google`

#### Bloques Internos (2 Bloques):
1. **Bloque 1: Formulario SSO & Credenciales:**
   - *Inputs:* Email, Password. Botones de OAuth Google / Magic Link.
2. **Bloque 2: Guardrail & Claims Status:**
   - *Elementos:* Verificación de rol JWT (`SUPER_ADMIN`, `ARTIST`, `CLIENT_B2C`, `CLIENT_B2G`).

---

### PANTALLA 06: Selección de Rol (Onboarding)
- **ID Stitch:** `02094ba418e54e`
- **Nombre de Página:** `Onboarding — Selección de Perfil`
- **Ruta Next.js:** `src/app/onboarding/role/page.tsx`
- **Posición en el Journey:** **Paso 2.2 (Segmentación de Usuario)**
- **Lenguajes & Tech:** `TypeScript, React Client Component, Tailwind Grid`

#### Bloques Internos (2 Bloques):
1. **Bloque 1: Grid de Roles:**
   - *Opciones:* "Soy Pareja / Novios", "Soy Empresa / Event Planner", "Soy Representante de Ayuntamiento".
2. **Bloque 2: Confirmación & Redirección Custom:**
   - *Action:* Asignación de claims en JWT.

---

### PANTALLA 07: Verificación de Datos (NIF/CIF)
- **ID Stitch:** `10ac1505540c40`
- **Nombre de Página:** `Verificación KYC & Legal`
- **Ruta Next.js:** `src/app/onboarding/verify/page.tsx`
- **Posición en el Journey:** **Paso 2.3 (Seguridad Contractual)**
- **Lenguajes & Tech:** `TypeScript, NIF/CIF Validator Regex`

#### Bloques Internos (2 Bloques):
1. **Bloque 1: Input NIF/CIF & Razón Social:**
   - *Inputs:* NIF, Nombre de Empresa/Ayuntamiento, Dirección Fiscal.
2. **Bloque 2: Certificado Digital Validation:**
   - *Elementos:* Validación de formato fiscal para facturación de IVA.

---

### PANTALLA 08: Formulario de Reserva Paso 1 (Fechas)
- **ID Stitch:** `1884b94d6fac4b`
- **Nombre de Página:** `Paso 1: Fecha y Hora del Evento`
- **Ruta Next.js:** `src/app/booking/step1/page.tsx`
- **Posición en el Journey:** **Paso 3.1 (Iniciación de Reserva)**
- **Lenguajes & Tech:** `TypeScript, Datepicker UI, Availability Locks`

#### Bloques Internos (2 Bloques):
1. **Bloque 1: Calendario Interactivo:**
   - *Inputs:* Fecha del evento, hora de inicio, duración esperada (1h, 2h, 3h).
2. **Bloque 2: Lock Temp Key:**
   - *Elementos:* Bloqueo temporal de 15 minutos en agenda mientras completa el checkout.

---

### PANTALLA 09: Configuración de Rider Técnico (Paso 2)
- **ID Stitch:** `0c2baf3536b247`
- **Nombre de Página:** `Paso 2: Rider Técnico & Infraestructura`
- **Ruta Next.js:** `src/app/booking/step2/page.tsx`
- **Posición en el Journey:** **Paso 3.2 (Especificación Logística)**
- **Lenguajes & Tech:** `TypeScript, Form State Management`

#### Bloques Internos (2 Bloques):
1. **Bloque 1: Requerimientos de Escenario:**
   - *Inputs:* Interior/Exterior, Toma de Corriente (220V), Tarima necesaria, Iluminación.
2. **Bloque 2: Configuración Sonorización:**
   - *Opciones:* Sonido Autónomo Productora EAR vs Sonido Técnico de la Finca.

---

### PANTALLA 10: Resumen de Propuesta & Términos (Paso 3)
- **ID Stitch:** `23dc91db2a1940`
- **Nombre de Página:** `Paso 3: Contrato & Resumen Financiero`
- **Ruta Next.js:** `src/app/booking/summary/page.tsx`
- **Posición en el Journey:** **Paso 3.3 (Pre-Checkout)**
- **Lenguajes & Tech:** `TypeScript, Contract PDF Generator`

#### Bloques Internos (2 Bloques):
1. **Bloque 1: Desglose Final:**
   - *Elementos:* Total Honorarios, Depósito 30% a pagar hoy, Restante 70% día del evento.
2. **Bloque 2: Aceptación de Cláusulas:**
   - *Checkboxes:* Cancelación flexible, Seguro RC, Protocolo de vestuario de gala.

---

### PANTALLA 11: Pasarela Checkout (Stripe & Bizum)
- **ID Stitch:** `6b19571687314e`
- **Nombre de Página:** `Pasarela de Pago Segura`
- **Ruta Next.js:** `src/app/checkout/page.tsx`
- **Posición en el Journey:** **Paso 4.1 (Transacción Financiera)**
- **Lenguajes & Tech:** `TypeScript, Stripe Elements SDK, Bizum API, Server Actions`

#### Bloques Internos (2 Bloques):
1. **Bloque 1: Stripe Card / Apple Pay / Bizum Widget:**
   - *Elementos:* Formulario de tarjeta encriptado con certificación PCI-DSS.
2. **Bloque 2: Resumen de Transacción ACID:**
   - *Elementos:* Indicador de pago seguro 256-bit SSL y garantía de devolución.

---

### PANTALLA 12: Confirmación & Recibo de Pago
- **ID Stitch:** `1b0bf17a29df4e`
- **Nombre de Página:** `Reserva Confirmada & Recibo`
- **Ruta Next.js:** `src/app/checkout/success/page.tsx`
- **Posición en el Journey:** **Paso 4.2 (Éxito Transaccional)**
- **Lenguajes & Tech:** `TypeScript, PDF Invoice Generator, Waybill Trigger`

#### Bloques Internos (3 Bloques):
1. **Bloque 1: Confirmation Banner & QR Code:**
   - *Elementos:* Código de reserva `BK-99821`, QR de acceso para el día del evento.
2. **Bloque 2: Descarga de Contrato PDF:**
   - *CTAs:* `[ Descargar Factura / Contrato PDF ]`.
3. **Bloque 3: Enlace al Envio Live Fleet OS:**
   - *CTAs:* `[ Ver Trazabilidad en Centro de Mando ]` -> `/track/[token]`.

---

### PANTALLA 13: Dashboard Soberano del Artista
- **ID Stitch:** `3693d7146db549`
- **Nombre de Página:** `Portal Artista — Gestión de Giras`
- **Ruta Next.js:** `src/app/artistas/dashboard/page.tsx`
- **Posición en el Journey:** **Paso 5.1 (Operación Artística Interna)**
- **Lenguajes & Tech:** `TypeScript, FullCalendar React, Supabase Realtime`

#### Bloques Internos (4 Bloques):
1. **Bloque 1: KPI Summary Bar:**
   - *Elementos:* Bolos este mes, Ingresos brutos, Reparto de honorarios 85%.
2. **Bloque 2: Calendario de Actuaciones:**
   - *Elementos:* Vista mensual con bolos confirmados y pendientes.
3. **Bloque 3: Hoja de Ruta Waybill:**
   - *Elementos:* Ubicación del evento, hora de citación y contacto del cliente.
4. **Bloque 4: Wallet & Liquidación:**
   - *CTAs:* `[ Solicitar Transferencia SEPA ]`.

---

### PANTALLA 14: CRM & Panel del Cliente
- **ID Stitch:** `bc336e0a79a24d`
- **Nombre de Página:** `Mi Cuenta — Mis Eventos`
- **Ruta Next.js:** `src/app/dashboard/cliente/page.tsx`
- **Posición en el Journey:** **Paso 5.2 (Gestión Cliente Post-Venta)**
- **Lenguajes & Tech:** `TypeScript, React Client Component`

#### Bloques Internos (3 Bloques):
1. **Bloque 1: Resumen de Eventos Contratados:**
   - *Elementos:* Estado del evento ("Confirmado", "En Camino", "Finalizado").
2. **Bloque 2: Tracking en Vivo del Artista:**
   - *Elementos:* Enlace con token privado para ver al mariachi en carretera el día del evento.
3. **Bloque 3: Asistente WhatsApp Directo:**
   - *CTAs:* `[ Contactar con Stage Manager ]`.

---

### PANTALLA 15: Centro de Mando Logístico & Fleet OS
- **ID Stitch:** `7f3393eda77340`
- **Nombre de Página:** `Centro de Mando Logístico S-Class`
- **Ruta Next.js:** `src/app/(nexus)/centro-mando/page.tsx`
- **Posición en el Journey:** **Paso 5.3 (Torre de Control Operativa & Auditoría)**
- **Lenguajes & Tech:** `TypeScript, Mapbox GL 3D, Dead Reckoning Math, WebSocket Realtime, Server Actions`

#### Bloques Internos (5 Bloques):
1. **Bloque 1: Telemetry Top Metrics Bar:**
   - *Elementos:* Latencia GPS (12ms), Estado de Red (`LIVE`), Vehículos en Ruta (10), Alertas P0 (0).
2. **Bloque 2: Mapa 3D Interactive Fleet Map:**
   - *Elementos:* Marcadores en tiempo real con línea continua (LIVE) o punteada (ESTIMATED/DEGRADED).
3. **Bloque 3: Panel de Despacho & Geofencing:**
   - *Elementos:* Distancia al evento, radar de 500m y triggers de notificación.
4. **Bloque 4: Audit Log Inmutable:**
   - *Elementos:* Historial de pings GPS y eventos de reconexión offline.
5. **Bloque 5: Command Controls:**
   - *CTAs:* `[ Activar Panic Alert ]`, `[ Forzar Reconciliación ]`.

---
**ESTÁNDAR v2.1 CANÓNICO — PRODUCTORA EAR OS S-CLASS ENTERPRISE.**
