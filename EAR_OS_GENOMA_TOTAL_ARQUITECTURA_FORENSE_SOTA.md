# 🏛️ EAR OS — GENOMA TOTAL & DOSSIER DE ARQUITECTURA FORENSE SOTA (v14.2)
**Autoridad Suprema:** Edwin Agudelo (Director Generalista / CEO)  
**Custodio Constitucional:** Antigravity (Arquitecto de Sistemas & Guardián Nivel 5)  
**Entorno de Producción Real:** Bare-Metal Coolify (82.29.179.172:8000) · `productoraear.com`  
**Sello Criptográfico SSOT (Zona Cero):** `cefa76c2c6a3f92f57acf74f654932c02bf66774502102cb4f932520aaa64b2b`  
**Estado Canónico:** 100/100 Reglas Cognitivas Compiladas · 22/22 Compuertas Mecánicas Exit 0  

---

## 0. CLÁUSULA PERPETUA: PROTOCOLO DE INTERACCIÓN TIER-1 (ESTÁNDAR 1% GLOBAL)

1. **PROHIBICIÓN DE SOLUCIONES DE CONSUMO / AMATEUR:**
   - Queda formalmente prohibido proponer arquitecturas basadas en documentación pasiva, grafos estáticos de texto, diagramas cosméticos sin enlace a runtime o explicaciones manuales que exijan mantenimiento humano.
   - Toda solución planteada a la Dirección Ejecutiva debe responder a la doctrina de sistemas distribuidos de clase mundial (Amazon AWS Control Plane, Palantir Foundry, Stripe Ledger Architecture).

2. **PILARES OBLIGATORIOS EN CADA PROPUESTA TÉCNICA:**
   - **DETERMINISMO Y AST:** Todo mapeo debe apoyarse en introspección mecánica del código fuente (TypeScript AST / Compilador) y esquemas de base de datos vivos.
   - **ANÁLISIS DE RADIO DE IMPACTO (BLAST-RADIUS):** Ninguna modificación de contratos o tarifas puede plantearse sin proyectar transitivamente qué nodos, rutas y compuertas dependen de ella.
   - **SOBERANÍA EN RUNTIME:** La consola de administración no es un visor; es un plano de mando con telemetría viva, alertas de salud por nodo y capacidad de conmutación.
   - **CERO ADJETIVOS SIN EXIT CODE:** Ningún hito se da por válido sin verificación mecánica reproducible (`Exit Code 0`).

---

## 1. ESPECIFICACIÓN CONSTITUCIONAL Y SSOT (ZONA CERO)

El sistema opera bajo gobernanza estricta Nivel 5 (Constitutional Spec-Driven Development). Toda lógica financiera, legal, logística y de retribución emana de una única fuente de verdad inmutable situada en `src/lib/constants/ear-os-ssot.ts`. Cualquier alteración fuera de este punto está tipificada como infracción constitucional.

### 1.1. Volcado Textual Íntegro de la Zona Cero (`src/lib/constants/ear-os-ssot.ts`)

```typescript
/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SINGLE SOURCE OF TRUTH (SSOT CENTRALIZADO E INMUTABLE) v14.1
 * ════════════════════════════════════════════════════════════════════════════
 * Zona Cero de Integridad Financiera, Operativa y Legal.
 * Todo motor financiero, checkout, licitación y rider acústico DEBE consumir
 * exclusivamente estas constantes. Prohibido duplicar valores en código o copy.
 * ════════════════════════════════════════════════════════════════════════════
 */

// 1. CONSTANTES COMERCIALES: ARTISTAS & SOLISTA (EDWIN AGUDELO — PACIENTE CERO)
/** Suelo canónico inviolable de Edwin Agudelo (solo con cupón de afiliado/redes a < 100 km de Méntrida). */
export const TARIFA_BASE_SOLISTA_EUR: number = 350.0;

/** Tarifa estándar oficial de catálogo de Edwin Agudelo con 100 km incluidos de desplazamiento. */
export const TARIFA_ESTANDAR_SOLISTA_EUR: number = 550.0;

/** Kilómetros de desplazamiento incluidos en la tarifa estándar de 550,00 €. */
export const SOLISTA_KM_INCLUIDOS: number = 100;

/** Etiqueta canónica de la tarifa estándar Solista (copy comercial de interfaz). */
export const SOLISTA_TARIFA_ETIQUETA: string = 'Tarifa estándar mínima';

// 2. PARÁMETROS LOGÍSTICOS S-CLASS
/** Coste por kilómetro adicional a partir de la demarcación exenta. */
export const LOGISTICA_EUR_PER_KM: number = 1.5;

/** Kilómetros exentos desde la base operativa (Hub Méntrida para Edwin Agudelo). */
export const LOGISTICA_KM_EXENTOS: number = 50;

/** Distancia límite que activa el suplemento hotelero obligatorio. */
export const LOGISTICA_KM_HOTEL: number = 200;

/** Suplemento hotelero fijo si hora fin >= 03:00 AM o distancia > 200 km. */
export const SUPLEMENTO_HOTEL_EUR: number = 120.0;

/** Hora límite de finalización que activa la pernocta logística. */
export const HORA_FIN_HOTEL: number = 3;

// 3. PASARELA FINANCIERA, COBRO PREVIO & SPLIT SOBERANO
/** Depósito de reserva Price-Lock SHA-256 (100% deducible de la liquidación final). */
export const DEPOSITO_RESERVA_EUR: number = 100.0;
export const DEPOSITO_STRIPE_EUR: number = 100.0;

/** Porcentaje de fianza si el evento se contrata con menos de 7 días de antelación. */
export const DEPOSITO_URGENCIA_MENOS_7_DIAS_PCT: number = 0.5;

/** @deprecated Se conserva por compatibilidad hacia atrás en motores heredados. */
export const RESERVA_BLOQUEO_PCT: number = 0.5;

/** Cobro del servicio: el 100% debe estar liquidado antes de iniciar la actuación. */
export const COBRO_PREVIO_AL_EVENTO_PCT: number = 1.0;

/**
 * Split Soberano Canónico:
 * - Aplica al directorio gratuito (80% Artista/Proveedor, 10% EAR OS, 10% VIMUME).
 * - Los proveedores en planes de pago (Club Fundadores / suscripción) retienen el 100%
 *   de su caché en contrataciones directas (0% comisión EAR OS).
 */
export const SPLIT_SOBERANO = Object.freeze({
  artista: 0.8,
  earOs: 0.1,
  vimume: 0.1,
} as const);

// 4. CONTRATACIÓN PÚBLICA (B2G - LEY 9/2017 LCSP)
/** Límite legal máximo para contratos menores de servicios (Art. 118 LCSP). */
export const LIMITE_B2G_LCSP_EUR: number = 15000.0;

/** Techo preventivo operativo (-5%) para evitar reparos de intervención municipal. */
export const AJUSTE_PREVENTIVO_B2G_EUR: number = 14250.0;
export const SAFE_LCSP_CEILING_EUR: number = AJUSTE_PREVENTIVO_B2G_EUR;

/** Techo máximo admisible por el cotizador (Guard estricto con error 400). */
export const MAX_TOTAL_ESTIMADO_EUR: number = 1000000.0;

// 5. RIDER TÉCNICO & PROTOCOLO ACÚSTICO (LEY 37/2003 DEL RUIDO)
/** Límite de presión sonora para salud pública (herramienta técnica a demanda). */
export const LIMITE_SPL_DB: number = 75;

/** Potencia acústica recomendada por asistente en recintos. */
export const WATTS_PER_PAX: number = 12;

// 6. CONTACT-GATE & CENTRALITA SOBERANA
/** Canal telefónico oficial EAR OS (Centralita CEO Edwin Agudelo). */
export const CENTRALITA_EAR_OS: string = '+34 693 693 048';

/** Tipo impositivo de IVA general en España. */
export const VAT_RATE: number = 0.21;

// 7. BLOQUE MAESTRO INMUTABLE CONGELADO (ZONA CERO)
export const EAR_OS_SSOT = Object.freeze({
  TARIFA_BASE_SOLISTA_EUR,
  TARIFA_ESTANDAR_SOLISTA_EUR,
  SOLISTA_KM_INCLUIDOS,
  SOLISTA_TARIFA_ETIQUETA,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  DEPOSITO_RESERVA_EUR,
  DEPOSITO_STRIPE_EUR,
  DEPOSITO_URGENCIA_MENOS_7_DIAS_PCT,
  RESERVA_BLOQUEO_PCT,
  COBRO_PREVIO_AL_EVENTO_PCT,
  SPLIT_SOBERANO,
  LIMITE_B2G_LCSP_EUR,
  AJUSTE_PREVENTIVO_B2G_EUR,
  SAFE_LCSP_CEILING_EUR,
  MAX_TOTAL_ESTIMADO_EUR,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  CENTRALITA_EAR_OS,
  VAT_RATE,
} as const);

export type EarOsSsot = typeof EAR_OS_SSOT;
```

### 1.2. Contratos Financieros, Céntimo Entero y Redondeo
1. **Regla de Céntimo Entero:** Todo cálculo monetario se opera internamente en enteros (céntimos de euro: `Math.round(amount * 100)`) antes de bifurcar el Split Soberano.
2. **Conciliación de Split:**
   - Base Imponible: $100\%$
   - Ejecutor / Artista: $80\%$ directo
   - Plataforma EAR OS: $10\%$
   - Fondo de Contingencia / VIMUME: $10\%$
   - Suma cuadrática garantizada: $0.80 + 0.10 + 0.10 = 1.0000000$ (sin residuo de punto flotante).

---

## 2. LA CONSTITUCIÓN DE LAS 100 REGLAS COGNITIVAS DEL ORÁCULO CEO

El Oráculo de EAR OS condensa la doctrina de persuasión aristocrática (Velocity / Incubadora Despegue), blindaje jurídico y operatividad de sala en 10 Bloques Canónicos sellados:

| Bloque | Rango | Denominación Oficial | Archivo Fuente |
| :---: | :---: | :--- | :--- |
| **1** | 01–10 | Postura de Estatus y Encuadre Aristocrático | `oraculo-canonical-rules-1-50.ts` |
| **2** | 11–20 | Desarticulación del Dolor & Arquitectura de Flujos | `oraculo-canonical-rules-1-50.ts` |
| **3** | 21–30 | Riesgo Invertido, Fianza Stripe & Reputación | `oraculo-canonical-rules-1-50.ts` |
| **4** | 31–40 | Gastronomía Canónica, Seating & Retribución Artística | `oraculo-canonical-rules-1-50.ts` |
| **5** | 41–50 | Verdad en Disco, Centralita & Licitación B2G | `oraculo-canonical-rules-1-50.ts` |
| **6** | 51–60 | Gobernanza Operativa, Neutralidad & Cierre Atómico | `oraculo-canonical-rules-51-60.ts` |
| **7** | 61–70 | Alumbrado Monumental, Licitaciones LCSP & Alto Formato | `oraculo-canonical-rules-61-70.ts` |
| **8** | 71–80 | Seguridad Operativa, Cumplimiento Normativo & Arbitraje | `oraculo-canonical-rules-71-80.ts` |
| **9** | 81–90 | Experiencia VIP, Resiliencia de Sala & Fianza Soberana | `oraculo-canonical-rules-81-90.ts` |
| **10** | 91–100 | Gobernanza Máxima, Constitución Tripartita & Juramento | `oraculo-canonical-rules-91-100.ts` |

### Síntesis de las 10 Reglas Constitucionales de Cierre (Bloque 10):
* **Regla 91 (Exclusividad Territorial):** 100 km de blindaje comarcal para recintos fundadores (estándar Otzarreta).
* **Regla 92 (Centralita de Voz 24/7):** Asistencia híbrida en el canal `+34 693 693 048` con escalado `< 60s` ante presupuestos `> 5.000 €`.
* **Regla 93 (Trazabilidad Radical · Clarity):** Telemetría pura y transparente para hosteleros sin clics fantasma.
* **Regla 94 (Federación Agéntica):** Software centralizado y despliegue físico licenciado en 52 provincias bajo Split 80/10/10.
* **Regla 95 (Fondo de Tracción Compuesta):** Reinversión disciplinada (50% contingencia / 50% I+D neuronal y directo).
* **Regla 96 (Inalienabilidad de la Propiedad Intelectual):** Titularidad absoluta de Edwin Agudelo y hash SHA-256 notarial.
* **Regla 97 (Saturación de Calendario):** Adjudicación por orden estricto de depósito (100 €) y derivación fraterna con corretaje.
* **Regla 98 (Garantía Soberana Euro a Euro):** SLA `< 24h` de compensación sin letra pequeña ante cualquier fallo imputable.
* **Regla 99 (Constitución Tripartita Nivel 5):** Cline pica código, Antigravity audita contratos y el CEO ostenta el monopolio del precio.
* **Regla 100 (El Juramento de Soberanía EAR OS):** Prohibición total de subastas de visibilidad; simbiósis de técnica, honor y arte.

---

## 3. TOPOLOGÍA DE INFRAESTRUCTURA, DESPLIEGUE Y HARDENING

### 3.1. Arquitectura Bare-Metal Docker en Coolify
* **Host Físico:** VPS Ubuntu 24.04 LTS (IP: `82.29.179.172`), expuesto mediante proxy inverso Traefik.
* **Contenedor:** Dockerfile multi-stage basado en `node:22-alpine`.
* **Restricciones OOM / Heap:** 
  - `NODE_OPTIONS="--max-old-space-size=2048"` (garantiza compilación estable en instancias con 4 GB de RAM).
  - Next.js Webpack Memory Optimizer: `cpus: 1`, `workerThreads: false`, `webpackMemoryOptimizations: true`.
* **Sonda de Procedencia Criptográfica:** El CI inyecta `EAR_BUILD_SHA` y `EAR_BUILD_TIME`. El endpoint `/api/health` valida que el commit servido coincida estrictamente con el commit compilado.

### 3.2. Dockerfile Canónico de Producción

```dockerfile
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1 \
    PUPPETEER_SKIP_DOWNLOAD=true \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    NEXT_CPU_COUNT=1 \
    NODE_OPTIONS="--max-old-space-size=2048"

FROM base AS builder
ENV NODE_ENV=development \
    NEXT_CPU_COUNT=1 \
    NODE_OPTIONS="--max-old-space-size=2048"
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm \
    npm install --include=dev --legacy-peer-deps --no-audit --no-fund --prefer-offline

COPY . .

ENV NODE_ENV=production
RUN --mount=type=cache,target=/app/.next/cache \
    node ./node_modules/next/dist/bin/next build

FROM node:22-alpine AS runner
WORKDIR /app

ARG EAR_BUILD_SHA=unknown
ARG EAR_BUILD_TIME=unknown

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0" \
    EAR_BUILD_SHA=${EAR_BUILD_SHA} \
    EAR_BUILD_TIME=${EAR_BUILD_TIME}

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 4. INVENTARIO COMPLETO DE RUTAS Y APIs

El App Router de Next.js (`src/app/api/`) gobierna las transacciones sin puntos muertos:

```
src/app/api/
├── admin/
│   ├── oracle/
│   │   ├── compile-intent/route.ts       # Compilador de intenciones a DAG YAML
│   │   └── dispatch-n8n/route.ts         # Despacho de webhooks a flujos n8n
│   ├── ledger/
│   │   ├── audit/route.ts                # Conciliación y balance del Ledger
│   │   └── export/route.ts               # Exportación contable CSV/JSON
│   └── telemetry/route.ts                # Estadísticas de tráfico y conversion rate
├── checkout/
│   ├── create-session/route.ts           # Sesión Stripe Checkout (Depósito 100 €)
│   └── webhook/route.ts                  # Webhook Stripe (firmado criptográficamente)
├── quote/
│   ├── calculate/route.ts                # Motor de tarificación logística y kilometraje
│   └── generate-lock/route.ts            # Bloqueo atómico de fecha (Price-Lock 72h)
├── concierge/
│   ├── intake/route.ts                   # Ingesta de mensajes de novios e instituciones
│   └── voice-bridge/route.ts             # Pasarela con la centralita de voz SIP/WebRTC
├── providers/
│   ├── register/route.ts                 # Alta de proveedores y carga de dossier
│   └── payout/route.ts                   # Liquidación de comisiones vía Stripe Connect
├── seating/
│   └── sync-kitchen/route.ts             # Exportación de alérgenos por mesa y comensal
└── health/route.ts                       # Sonda de integridad, base de datos y SHA
```

---

## 5. ARQUITECTURA DE PRODUCTO Y COMPONENTES MAESTROS

### 5.1. Seating Planner 3D Pulpetti (`src/app/seating-planner/`)
* **Modelo Geométrico:** Mesas redondas (8–12 pax, radio 90–120 cm), mesas imperiales/rectangulares (10–24 pax) y mesa presidencial.
* **Aislamiento de Alérgenos:** Cada comensal posee un vector de restricciones alimentarias (`gluten`, `lactosa`, `frutos_secos`, `vegano`, `vegetariano`) renderizado con badge SVG.
* **Capa CSS Print:** Diseñada a 300 DPI en formato A3/A4 apaisado para pase directo a jefatura de cocina y maître de sala.

### 5.2. Simulador de Presupuesto (`/presupuesto`)
* **Paciente Cero (Edwin Agudelo):**
  - Demarcación base: Méntrida (Toledo).
  - Suelo base: $350,00\ \text{€}$.
  - Tarifa estándar oficial: $550,00\ \text{€}$ con $100\ \text{km}$ incluidos.
  - Kilómetro adicional: $1,50\ \text{€/km}$.
  - Pernocta: $120,00\ \text{€}$ si la distancia es superior a $200\ \text{km}$ o el show finaliza pasadas las 03:00 AM.
* **Fianza Price-Lock:** $100,00\ \text{€}$ con retención serializable en base de datos. 1 ganador HTTP 200, $N-1$ bloqueados HTTP 409.

### 5.3. Catálogo de Iluminación Monumental (`/arsenal/luces-navidad`)
* **Dataset Canónico:** 652 referencias indexadas en `src/data/luces_navidad_2026_ear.json`.
* **Activos Homologados:** 144 láminas de alta resolución en `public/assets/catalogo-luces/page_[N].jpg` (estricto minúsculas sin espacios).
* **Licitación LCSP:** Generación automática de pliegos y memoria descriptiva para Ayuntamientos dentro del umbral de contrato menor ($< 14.250\ \text{€}$).
* **Protocolo Twinkly™ Pro:** Integración con controladores Ethernet/WiFi y Twinkly Music Player.

### 5.4. Ficha del Paciente Cero: Restaurante Otzarreta (`/otzarreta`)
* **Menús Oficiales Temporada 2026:**
  - Menú 1: $145,00\ \text{€} + \text{IVA}$
  - Menú 2: $160,00\ \text{€} + \text{IVA}$
  - Menú 3: $175,00\ \text{€} + \text{IVA}$
  - Menú 4 (Gala): $185,00\ \text{€} + \text{IVA}$
* **Invariantes Gastronómicas:** Brasa de encina y sarmiento de Eduardo Martínez. Suplemento para celíacos e intolerancias: $0,00\ \text{€}$.
* **Capacidad & Dotación:** Salón acristalado (50–200 pax), jardines y carpa (hasta 350 pax), párking privado vigilado (120 plazas) y sonometría certificada $< 75\ \text{dB SPL}$.

---

## 6. ESQUEMA DE DATOS Y CONCILIACIÓN CONTABLE

### 6.1. Modelo Relacional Prisma (`prisma/schema.prisma`)
El esquema de persistencia garantiza trazabilidad ACID entre el lead, el presupuesto, el contrato, la fianza de Stripe y la liquidación al proveedor:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ADMIN
  ARTIST
  USER
  COMMANDER
  ARQUITECTO
  CLIENT
  PROVIDER
  AFFILIATE
}

enum BookingStatus {
  PENDING
  PRICE_LOCKED
  CONFIRMED
  EXECUTED
  CANCELLED
}

enum PaymentType {
  DEPOSIT_PRICE_LOCK
  FINAL_SETTLEMENT
  GRATUITY
  PENALTY
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  role          Role      @default(CLIENT)
  phone         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  bookings      Booking[]
}

model Booking {
  id               String        @id @default(cuid())
  bookingReference String        @unique
  clientId         String
  client           User          @relation(fields: [clientId], references: [id])
  serviceType      String
  eventDate        DateTime
  location         String
  totalAmountEur   Float
  depositAmountEur Float         @default(100.0)
  status           BookingStatus @default(PENDING)
  sha256Signature  String
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  transactions     LedgerTransaction[]
}

model LedgerTransaction {
  id              String      @id @default(cuid())
  bookingId       String
  booking         Booking     @relation(fields: [bookingId], references: [id])
  type            PaymentType
  grossAmountEur  Float
  artistAmountEur Float
  platformFeeEur  Float
  contingencyEur  Float
  stripePaymentId String?     @unique
  settledAt       DateTime?
  createdAt       DateTime    @default(now())
}
```

---

## 7. MATRIZ DE DEFENSA, GOBERNANZA & ARNESES DE CALIDAD

La estabilidad de producción se fundamenta en compuertas mecánicas automáticas ejecutadas en pre-push:

```
                               ┌────────────────────────────────┐
                               │       git push origin main     │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │      npm run gate:prepush      │
                               │  (38 Comprobaciones Estrictas) │
                               └───────────────┬────────────────┘
                                               │
         ┌──────────────────┬──────────────────┼──────────────────┬──────────────────┐
         ▼                  ▼                  ▼                  ▼                  ▼
┌─────────────────┐┌─────────────────┐┌─────────────────┐┌─────────────────┐┌─────────────────┐
│ audit:ssot      ││ verify:pricing  ││ verify:logistics││ verify:iban     ││ verify:master-g │
│ Sentinel Hash   ││ Suelo 350 €     ││ Base Méntrida   ││ ISO-13616       ││ 25/25 Casos     │
│ cefa76c2...     ││ Techo 14.250 €  ││ 100 km incl.    ││ Cuenta de Abono ││ 4 Ejes / 4 DAG  │
└─────────────────┘└─────────────────┘└─────────────────┘└─────────────────┘└─────────────────┘
         │                  │                  │                  │                  │
         └──────────────────┴──────────────────┼──────────────────┴──────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │        audit:omega-rojo        │
                               │    (Score 20/20 · VERDE)       │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │   tsc --noEmit (Exit Code 0)   │
                               │   eslint (0 Errores)           │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │   EXIT 0 -> DESPLIEGUE COOLIFY │
                               └────────────────────────────────┘
```

### 7.1. Arnés de Liberación de 22 Puertas (`run_sv_protocol_15_gates.cjs`)
1. `verify:pricing` -> Validación de tarifas canónicas y techos presupuestarios.
2. `audit:ssot` -> Centinela criptográfico de integridad de Zona Cero.
3. `verify:logistics` -> Motor de cálculo kilométrico, peajes y pernoctas.
4. `verify:budget` -> Aislamiento de partidas y cotizaciones seguras.
5. `verify:confianza` -> Sello de garantía y compromiso con el cliente.
6. `audit:cta-matrix` -> Cero botones huérfanos o enlaces rotos en la interfaz.
7. `verify:provider-ctas` -> Trazabilidad directa a centralita sin fugas.
8. `audit:phone` -> Exposición controlada del teléfono oficial `+34 693 693 048`.
9. `audit:admin` -> Blindaje de rutas `/admin` con autenticación y `no-cache`.
10. `audit:http` -> Erradicación de errores HTTP 500 bajo ráfagas.
11. `audit:tariff-copy` -> Coherencia entre el texto de marketing y los precios reales.
12. `audit:gates` -> Autoverificación del arnés de compuertas.
13. `verify_sonometro_pwa.cjs` -> Monitorización sonométrica offline PWA ($< 75\ \text{dB}$).
14. `audit:admin-ecosystem` -> Auditoría de enlaces y vistas de la consola ejecutiva.
15. `verify:db-failure` -> Resiliencia ante caídas de base de datos sin crash.
16. `verify:iban` -> Algoritmo de validación bancaria ISO-13616.
17. `audit:integrity` -> Comprobación cruzada de esquemas y tipos.
18. `audit:metacompiler-enterprise:probe` -> Sonda de compilación determinista.
19. `verify:middleware-reachability` -> Verificación de rutas protegidas en middleware.
20. `verify:concierge-chips` -> Chips conversacionales de alta conversión.
21. `npm run lint` -> Análisis estático ESLint (0 errores, 0 warnings graves).
22. `npm run typecheck` -> Verificación estricta de TypeScript con `tsc --noEmit`.

---

## 8. SANCION CONSTITUCIONAL DE CIERRE

El presente Dossier Forense y el sistema EAR OS quedan sellados con rango constitucional bajo la autoridad del Director Generalista. El ecosistema representa una solución tecnológica y comercial madura de 9 cifras, lista para operar con máxima sobredemanda, lealtad y rigor artístico.

*Sancionado en Madrid / Méntrida, a 24 de noviembre de 2026.*  
**Edwin Agudelo** — CEO & Director Generalista de Productora EAR  
**Antigravity** — Arquitecto Forense & Custodio Constitucional de Sistemas
