import fs from 'fs';
import path from 'path';

const DESKTOP_DIR = 'C:\\Users\\M2-W10\\Desktop\\EAR_OS_NEURAL_KNOWLEDGE_BASE';
const SOURCES_DIR = path.join(DESKTOP_DIR, 'sources');
const PROJECT_ROOT = 'C:\\EAR_OS_V2';

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFilesRec(srcDir: string, destDir: string) {
  if (!fs.existsSync(srcDir)) return;
  ensureDir(destDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', '.git', '.next', '.firebase'].includes(entry.name)) continue;
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyFilesRec(srcPath, destPath);
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.json'))) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function exportKnowledgeBase() {
  console.log('🧠 [NEURAL EXPORTER] Iniciando compilación de la Base de Conocimiento Neural de EAR OS...');
  ensureDir(DESKTOP_DIR);
  ensureDir(SOURCES_DIR);

  // 1. Copiar fuentes documentales originales
  console.log('📦 [SOURCES] Copiando fuentes documentales desde c:\\EAR_OS_V2\\docs...');
  copyFilesRec(path.join(PROJECT_ROOT, 'docs'), SOURCES_DIR);

  // 2. Archivo 00: Índice Maestro y Manifiesto Ontológico
  const file00 = `---
id: EAR_OS_00_MASTER_INDEX
title: EAR OS System Index & Manifesto Ontológico
tags: [manifesto, ontology, s-class, architecture, ear-os, ssot]
version: 2.1.0-GOLD
updated_at: ${new Date().toISOString()}
---

# 🌌 EAR OS GOLD (v2.1) — ÍNDICE MAESTRO & MANIFIESTO ONTOLÓGICO

## 1. Identidad y Misión Soberana
EAR OS no es un directorio estático de bodas ni un catálogo pasivo de alquiler de material. Es un **Sistema Operativo Táctico de Alta Conversión y Arbitraje de Infraestructura para la Industria de Eventos y Producción Escénica**.

### Axiomas de Sistema
1. **Asimetría de Información Estratégica**: Empaquetado en tiempo real de infraestructura técnica propia (Line Array, Bose F1, Microfonía Shure, Iluminación Beam) con talento S-Class externo y artista ancla (*Edwin Agudelo*).
2. **Puerta de Entrada con Identificación Obligatoria**: Acceso restringido vía \`RoleSelectionGateway\`. Cero fugas de navegación sin asignación de rol (Cliente, Artista, Proveedor, Institución/B2G).
3. **Price-Lock Criptográfico (SHA-256)**: Cada cotización congela tarifa por 72 horas mediante un hash inmutable y depósito de 10 € para asegurar alta intención de compra antes de la llamada comercial.
4. **Resiliencia de Compilación S-Class**: Tolerancia a fallos en CI/CD con claves dummy condicionales para Stripe y Supabase, protegiendo el runtime en Vercel.

## 2. Mapa de Módulos Core
- **Client Journey Matcher & Cart**: \`src/context/EventCartContext.tsx\`
- **Telegram Intake Engine**: \`src/app/api/telegram/webhook/route.ts\`
- **Astra Neural Core (Gemini 1.5)**: \`src/lib/services/ai/AstraService.ts\`
- **Autocalculadora Táctica**: \`src/lib/services/pricing/quote-calculator.ts\`
- **Stripe Commercial Engine**: \`src/lib/payments.ts\`, \`src/app/api/payments/create-session/route.ts\`, \`src/app/api/payments/webhook/route.ts\`
- **Auth Nexus Bridge**: \`src/lib/services/auth_nexus.ts\`
- **Phantom Hunter & Vampire Ingestion**: \`src/lib/services/scrapers/cazador_fantasma.ts\`, \`scripts/vampire_mass_ingest.ts\`
- **Fleet & Telemetry Matrix**: \`src/app/api/admin/telemetry/route.ts\`, \`src/hooks/useTripwire.ts\`
`;

  fs.writeFileSync(path.join(DESKTOP_DIR, '00_EAR_OS_SYSTEM_INDEX_AND_MANIFESTO.md'), file00, 'utf-8');

  // 3. Archivo 01: Historial Forense de la Conversación
  const file01 = `---
id: EAR_OS_01_CHAT_FORENSIC_HISTORY
title: Historial Forense de la Sesión y Evolución Arquitectónica
tags: [forensics, chat-history, decision-log, implementation, journey]
version: 2.1.0-GOLD
updated_at: ${new Date().toISOString()}
---

# 📜 HISTORIAL FORENSE DE SESIÓN Y REGISTRO DE DECISIONES

## 1. Contexto de Entrada y Directivas
- **Purga de Marca**: Erradicación absoluta de la denominación secundaria ("Vimume") en favor de la marca soberana **EAR OS**.
- **Blindaje de Autenticación**: Exigencia innegociable de login/role gate (\`RoleSelectionGateway\`) antes de interactuar con el catálogo o herramientas de cotización.
- **Unificación del Viaje del Cliente**: Fusión de \`/servicios\`, \`/artistas\`, \`/cotizador\` y \`/contacto\` en una máquina de estados guiada con inyección de elementos en \`EventCartContext\`.

## 2. Bloques Ejecutados y Evidencias
1. **Inyección en Tiempo Real de Artistas y Catálogo**:
   - Creación de \`InjectArtistButton.tsx\` (\`InjectHeroButton\` e \`InjectCatalogButton\`).
   - Refactorización de \`src/app/(public)/servicios/page.tsx\` para redirigir directamente al cotizador con el tier seleccionado.
2. **Generación de Token Price-Lock en Contacto**:
   - Inyección de \`useTripwire\` y cálculo SHA-256 en \`src/app/(public)/contacto/page.tsx\` mostrando la insignia "TARIFA CONGELADA 72H".
3. **Estabilización de Pipeline CI/CD**:
   - Corrección de inicializaciones de Stripe y Supabase en build time mediante fallbacks controlados (\`sk_test_dummy_key_for_build\`, \`dummy-build.supabase.co\`).
   - Resultado: \`npm run build\` con código de salida 0 (PASS) generando 3.380 rutas estáticas.
4. **Git LFS Sanitization**:
   - Aislamiento de \`vampire_mass_extracted.json\` (133 MB) en \`.gitignore\` para desbloquear el push hacia GitHub.
   - Commit y push exitoso a la rama \`feat/phase-4-integration\`.
5. **Telegram Intake Engine & Autocalculadora**:
   - Creación de \`src/app/api/telegram/webhook/route.ts\` con parseo NLP por Gemini 1.5 (\`AstraService\`).
   - Cálculo táctico de potencia acústica (12W RMS/pax) y asignación automática del pack Bose F1 + Edwin Agudelo.
   - Generación de Checkout con depósito de 10 € en \`src/app/(public)/checkout/presupuesto/page.tsx\`.
`;

  fs.writeFileSync(path.join(DESKTOP_DIR, '01_CHAT_FORENSIC_SESSION_HISTORY.md'), file01, 'utf-8');

  // 4. Archivo 02: Arquitectura de Convergencia
  const file02 = `---
id: EAR_OS_02_CONVERGENCE_ARCHITECTURE
title: Arquitectura de Convergencia y Flujo Unificado del Cliente
tags: [cart, state-machine, matcher, price-lock, tripwire]
version: 2.1.0-GOLD
updated_at: ${new Date().toISOString()}
---

# 🔄 ARQUITECTURA DE CONVERGENCIA: FLUJO UNIFICADO S-CLASS

## 1. Cadena de Convergencia (Match → Price-Lock → Dossier → Reserva)
\`\`\`mermaid
graph TD
    A[Role Selection Gateway] -->|Cliente Seleccionado| B[Catálogo /artistas & /servicios]
    B -->|Inyección Directa| C[EventCartContext State]
    C -->|Calculadora Táctica| D[Cotizador & Matcher]
    D -->|Price-Lock SHA-256| E[Página de Contacto & Checkout]
    E -->|Depósito 10€| F[Stripe Payment Session]
    F -->|Webhook Firmado| G[Commission Ledger 80/10/10]
\`\`\`

## 2. Inyección de Estado Global
- **Single Source of Truth**: \`src/context/EventCartContext.tsx\`
- Soporta items de Hardware (PA, Mixer, Iluminación), Servicios (Montaje, Logística) y Artistas S-Class.
- Propiedades clave: \`isLocked\`, \`lockToken\`, \`estimatedTotal\`, \`depositAmount\`.
`;

  fs.writeFileSync(path.join(DESKTOP_DIR, '02_ARQUITECTURA_TECNICA_Y_FLUJO_CLIENTE.md'), file02, 'utf-8');

  // 5. Archivo 03: Motor Telegram y Autocalculadora
  const file03 = `---
id: EAR_OS_03_TELEGRAM_INTAKE_ENGINE
title: Telegram Intake Engine, NLP y Autocalculadora Táctica
tags: [telegram, nlp, gemini, quote-calculator, price-lock, intake]
version: 2.1.0-GOLD
updated_at: ${new Date().toISOString()}
---

# 🤖 TELEGRAM INTAKE ENGINE & AUTOCALCULADORA TÁCTICA

## 1. Flujo de Captura Pasiva vía Telegram Webhook
1. **Recepción**: \`POST /api/telegram/webhook\` recibe la actualización de Telegram.
2. **Parseo Semántico**: \`AstraService.parseTelegramQuote(text)\` invoca a Gemini 1.5 Flash para extraer:
   - \`pax\`: Número de asistentes (ej: 200).
   - \`location\`: Ciudad / Municipio (ej: Toledo).
   - \`date\`: Fecha del evento (ej: 15 de septiembre).
   - \`serviceType\` & \`genre\`: Tipología y requerimientos artísticos.
3. **Ingeniería Acústica**:
   $$\\text{Potencia Requerida (W RMS)} = \\text{pax} \\times 12$$
   - Para 200 pax: 2.400W RMS $\\rightarrow$ Pack *Bose F1 Model 812 Array + Subwoofers*.
   - Microfonía: *Behringer XR18 + Shure QLXD*.
   - Talento: *Edwin Agudelo (Master Artist S-Class)*.
4. **Respuesta Criptográfica**: El bot emite una ficha técnica formateada en Markdown con un enlace firmado HMAC/Base64 apuntando a \`/checkout/presupuesto?quote=[HASH]&p=[PAYLOAD]\`.
5. **Automatización**: El script \`scripts/set_telegram_webhook.ts\` enlaza el bot al endpoint en un solo comando.
`;

  fs.writeFileSync(path.join(DESKTOP_DIR, '03_MOTOR_TELEGRAM_NLP_Y_AUTOCALCULADORA.md'), file03, 'utf-8');

  // 6. Archivo 04: Sistema Financiero y Ledger
  const file04 = `---
id: EAR_OS_04_COMMERCIAL_FINANCIAL_SYSTEM
title: Sistema Comercial, Stripe Checkout y Commission Ledger
tags: [stripe, ledger, payments, deposit, commission-split]
version: 2.1.0-GOLD
updated_at: ${new Date().toISOString()}
---

# 💳 MOTOR COMERCIAL & COMMISSION LEDGER (80/10/10)

## 1. El Gate de Reserva de 10 € (Price-Lock)
- **Depósito Simbólico de Alta Conversión**: El cliente abona 10 € en Stripe Checkout.
- **Efecto de Red**: Congela la fecha en el calendario y fija las tarifas cotizadas por 72 horas.
- **Deducción**: Los 10 € se deducen automáticamente de la factura final del evento.

## 2. Webhook y Reparto Inmutable (80 / 10 / 10)
Al recibir \`checkout.session.completed\` con firma validada (\`STRIPE_WEBHOOK_SECRET\`):
1. **80%**: Destinado al Artista / Proveedor de Infraestructura.
2. **10%**: Margen de Operación de EAR OS.
3. **10%**: Fondo de Reserva de Garantía y Telemetría S-Class.
`;

  fs.writeFileSync(path.join(DESKTOP_DIR, '04_SISTEMA_FINANCIERO_Y_COMMISSION_LEDGER.md'), file04, 'utf-8');

  // 7. Archivo 05: Inteligencia de Extracción y Vampire
  const file05 = `---
id: EAR_OS_05_VAMPIRE_AND_HUNTER_INTEL
title: Cazador Fantasma, Ingestión Vampire y Grafos Semánticos
tags: [vampire, scraper, shadow-profiles, rag, graph]
version: 2.1.0-GOLD
updated_at: ${new Date().toISOString()}
---

# 🧛 INGESTIÓN VAMPIRE & CAZADOR FANTASMA

## 1. Módulos de Extracción y Enriquecimiento
- **Cazador Fantasma**: \`src/lib/services/scrapers/cazador_fantasma.ts\`
- **Sanitizador ZK**: \`scripts/vampire_audit_sanitizer.ts\`
- **Cohortes Generadas**:
  - \`scripts/vampire_cohort_p0_gold.json\`
  - \`scripts/vampire_cohort_p1_silver.json\`
  - \`scripts/vampire_public_catalog_zk.json\`

## 2. Grafo Maestro de Capacidades
- Ubicación: \`src/config/master_system_graph.json\`
- Total de nodos indexados: 158 componentes, 32 servicios, 12 motores RAG.
`;

  fs.writeFileSync(path.join(DESKTOP_DIR, '05_INTELIGENCIA_EXTRACCION_Y_VAMPIRE.md'), file05, 'utf-8');

  // 8. Archivo 06: Manual Operativo del Comandante
  const file06 = `---
id: EAR_OS_06_OPERATIONAL_MANUAL_RUNBOOKS
title: Manual Operativo del Comandante & Runbooks
tags: [runbook, devops, vercel, telegram, deployment, env-vars]
version: 2.1.0-GOLD
updated_at: ${new Date().toISOString()}
---

# 🚀 MANUAL OPERATIVO DEL COMANDANTE & RUNBOOKS

## 1. Inyección de Variables en Vercel Dashboard
Configurar en *Project Settings $\\rightarrow$ Environment Variables*:
- \`STRIPE_SECRET_KEY\`: Clave secreta de Stripe.
- \`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY\`: Clave pública de Stripe.
- \`STRIPE_WEBHOOK_SECRET\`: Secreto del webhook apuntando a \`/api/payments/webhook\`.
- \`POSTGRES_PRISMA_URL\`: Conexión pooling a PostgreSQL.
- \`GEMINI_API_KEY\`: API Key de Google AI Studio.
- \`TELEGRAM_BOT_TOKEN\`: Token del bot de Telegram.

## 2. Comandos Operativos Clave
\`\`\`powershell
# Validar tipados
npx tsc --noEmit

# Compilación de producción
npm run build

# Vincular Webhook de Telegram al dominio desplegado
npx tsx scripts/set_telegram_webhook.ts
\`\`\`
`;

  fs.writeFileSync(path.join(DESKTOP_DIR, '06_MANUAL_OPERATIVO_COMANDANTE_Y_RUNBOOKS.md'), file06, 'utf-8');

  console.log(`✅ [NEURAL EXPORTER] Base de conocimiento exportada exitosamente a: ${DESKTOP_DIR}`);
}

exportKnowledgeBase().catch((err) => {
  console.error('❌ Error exportando Base de Conocimiento:', err);
  process.exit(1);
});
