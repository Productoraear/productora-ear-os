/**
 * 🏛️ PROMPT MAESTRO FORGE (S-CLASS v3.0 — BLACK-MAGIC EDITION)
 * ----------------------------------------------------------------------------
 * Transforma una intención humana cruda (voz o texto del CEO) en un PROMPT
 * MAESTRO de nivel "Frontier Senior Full-Stack Enterprise" (superior a cualquier
 * modelo de frontera): razonamiento en 7 capas, contratos de datos con firmas
 * reales, arquitectura dirigida por dominio, casos límite específicos, matriz de
 * trazabilidad con endpoints, estrategia de recuperación y DOD SCORECARD 8/8.
 *
 * FILOSOFÍA:
 *  - El CEO habla en lenguaje humano; el Forge lo traduce al dialecto que una
 *    IA necesita para ejecutar con precisión quirúrgica, cero preguntas y cero
 *    retrabajo.
 *  - Si la GPU responde, el 27B/32B eleva el prompt. Si no, un compilador
 *    determinístico de conocimiento profundo garantiza SIEMPRE un prompt maestro
 *    de máxima exigencia (nunca devuelve un esqueleto vacío).
 * ----------------------------------------------------------------------------
 */

import {
    runGpuChat,
    extractJsonObject,
    resolveGpuModel,
    ARCHITECT_GPU_MODEL,
    type GpuModelId
} from './qwen-gpu-inference';
import { runDeepSeekChat, isDeepSeekConfigured } from './deepseek-inference';
import { SSOT_BUSINESS_RULES } from './omega-intent-compiler';
import {
    TARIFA_BASE_SOLISTA_EUR,
    DEPOSITO_STRIPE_EUR,
    LOGISTICA_EUR_PER_KM,
    LOGISTICA_KM_EXENTOS,
    SUPLEMENTO_HOTEL_EUR,
    HORA_FIN_HOTEL,
    LOGISTICA_KM_HOTEL,
    SAFE_LCSP_CEILING_EUR,
    LIMITE_SPL_DB,
    WATTS_PER_PAX,
    SPLIT_SOBERANO
} from '@/lib/constants/ear-os-ssot';

export type ForgeMode = 'ARQUITECTO' | 'QUIRURGICO';
export type ForgeEngine = 'OLLAMA_GPU' | 'DEEPSEEK_CLOUD' | 'DETERMINISTIC_FALLBACK';

export interface ForgeOptions {
    /** Intención cruda del CEO (texto o transcripción de voz). */
    intent: string;
    mode?: ForgeMode;
    /** Modelo GPU a usar para forjar. Por defecto el arquitecto (32B). */
    model?: GpuModelId | string;
    /** Si es true, solo usa el compilador determinístico (sin GPU). */
    forceDeterministic?: boolean;
    signal?: AbortSignal;
}

export interface ForgedMasterPrompt {
    masterPrompt: string;
    objective: string;
    role: string;
    context: string[];
    hardConstraints: string[];
    implementationSteps: string[];
    filesToTouch: string[];
    validation: string;
    negativeConstraints: string[];
    targetModel: string;
    forgeEngine: ForgeEngine;
    latencyMs: number;
    tokensPerSecond: number;
    reasoningEngineUsed: string;
}

/**
 * 🧬 SYSTEM PROMPT DE FORJA — Razonamiento de 7 capas aplicado a la doctrina
 * inmutable de EAR OS (nivel staff principal big-tech, vanguardista).
 */
export const FORGE_SYSTEM_PROMPT = `Eres el ARQUITECTO CUÁNTICO S-CLASS de Productora EAR OS, un staff principal de
big-tech con dominio absoluto de Next.js 15, TypeScript estricto, seguridad defensiva
y diseño OLED de lujo. Tu única misión es convertir una intención humana incompleta,
informal o dictada por voz en un PROMPT MAESTRO DE ESTUDIO DE CASO: exhaustivo,
estratégico, táctico, vanguardista y SIN ninguna ambigüedad, para que un modelo
ejecutor local (Qwen 27B/32B) lo ejecute con precisión quirúrgica, cero preguntas
y cero retrabajo.

RAZONA EN SILENCIO aplicando este marco de 7 CAPAS (NO lo muestres, solo sintetízalo
en el masterPrompt de salida):

CAPA 1 — NORTH STAR & KPI CUANTIFICABLE:
  ¿Qué métrica de negocio se mueve (lead captado, reserva cerrada, depósito Stripe,
  tarea despachada a n8n, tiempo de respuesta < 5 min)? ¿Qué dolor se mata? Define
  el criterio de éxito medible ANTES de tocar código.

CAPA 2 — ALCANCE & FRONTERAS:
  ¿Edición atómica (1 archivo, diff mínimo) o feature full-stack multi-archivo?
  Delimita qué SÍ y qué NO se toca. Prohíbe el gold-plating y la sobreingeniería.

CAPA 3 — CONTRATOS DE DATOS (FIRMAS EXACTAS):
  Interfaces/tipos con campos concretos, funciones con firma completa
  (parámetros + retorno explícito), server actions / API routes que devuelven
  { ok: boolean; error?: string; data?: T } y nunca lanzan excepciones crudas.

CAPA 4 — ARQUITECTURA DIRIGIDA POR DOMINIO:
  Server Components por defecto; "use client" solo en la hoja reactiva del DOM;
  Next.js 15 params async; dónde vive la lógica (server action / API route / lib).
  Nunca coloques secretos en cliente.

CAPA 5 — CASOS LÍMITE & FALLO ELEGANTE:
  Input vacío/malicioso, errores de red/timeout, estados loading/empty/error/éxito,
  retries idempotentes (N reintentos = 1 escritura), a11y completa y contraste AA.

CAPA 6 — SEGURIDAD & DEFENSA EN PROFUNDIDAD:
  Sanitización de entrada en toda frontera, try/catch hermético, validación en cada
  server action / route, secretos solo en servidor, cero datos ficticios ni
  re-hardcodeo de verified:true.

CAPA 7 — CRITERIO DE CIERRE ATÓMICO (DOD SCORECARD 8/8):
  npx tsc --noEmit -> Exit Code 0 · cero 'any' implícito · 0 fachadas (todo botón
  escribe de verdad) · 0 TODO/placeholder en ruta de venta · 0 array hardcodeado en
  motores de dinero · split 80/10/10 intacto · depósito 100€ intacto · rider acústico
  intacto.

REGLAS DE NEGOCIO INMUTABLES (SSOT — NUNCA VIOLAR):
${SSOT_BUSINESS_RULES.map((r) => `- ${r}`).join('\n')}

ESTÁNDARES TÉCNICOS OBLIGATORIOS:
- Next.js 15 App Router: Server Components por defecto; "use client" solo si hay DOM reactivo.
- Rutas dinámicas: const resolvedParams = await params; (Next.js 15).
- TypeScript estricto: cero 'any' implícito. Todo tipado con precisión de cirujano.
- Estética OLED: fondo #030305, oro #ecb613, rubí #FF2B44, cyan #00E5FF. Prohibido w-screen y gradientes AI-slop.
- Defensa en profundidad: try/catch hermético y validación de entrada en cada server action / route.
- Accesibilidad perfecta y micro-interacciones (transition-all duration-300 ease-out).

SALIDA: Devuelve EXCLUSIVAMENTE un objeto JSON válido (sin markdown, sin texto extra) con esta forma:
{
  "objective": "El resultado de negocio concreto y medible (1 frase de valor).",
  "role": "El rol que debe asumir el modelo ejecutor (ej. 'Arquitecto Next.js 15 experto en DAGs S-Class').",
  "context": ["Dato/contexto real relevante #1", "Dato #2"],
  "hardConstraints": ["Restricción dura e inmutable #1", "#2"],
  "implementationSteps": ["Paso 1 concreto y accionable", "Paso 2", "Paso 3"],
  "filesToTouch": ["ruta/exacta/archivo1.tsx", "ruta/exacta/archivo2.ts"],
  "validation": "npx tsc --noEmit -> Exit Code 0",
  "negativeConstraints": ["Lo que NUNCA debe hacerse #1", "#2"],
  "masterPrompt": "El PROMPT MAESTRO final completo, en formato markdown denso y de estudio de caso, listo para copiar y entregar al obrero. Debe incluir secciones explícitas: OBJETIVO, NORTH STAR (KPI), ROL, CONTEXTO REAL, RESTRICCIONES DURAS (SSOT), CONTRATOS DE DATOS esperados (con firmas), ARQUITECTURA, PASOS DE IMPLEMENTACIÓN numerados, ARCHIVOS a tocar con su propósito, CASOS LÍMITE, MATRIZ DE TRAZABILIDAD (botón->endpoint->motor->persistencia), ESTRATEGIA DE RECUPERACIÓN y CRITERIO DE CIERRE ATÓMICO (SCORECARD 8/8)."
}`;

/** Perfil de rol por dominio (magia negra: el obrero asume la identidad óptima). */
interface DomainProfile {
    rol: string;
    contratos: string[];
    casosLimite: string[];
    matrizTrazabilidad: string[];
    estrategiaRecuperacion: string[];
}

/**
 * 🧠 MOTOR DE CONOCIMIENTO DETERMINÍSTICO POR DOMINIO.
 * Cada dominio aporta: rol ejecutor, contratos con firma, casos límite,
 * matriz de trazabilidad y estrategia de recuperación. Cero fachadas.
 */
function resolveDomainProfile(lower: string): DomainProfile {
    if (lower.includes('reserva') || lower.includes('solista') || lower.includes('checkout') || lower.includes('stripe') || lower.includes('deposito')) {
        return {
            rol: 'Ingeniero de tesorería y checkout S-Class. Cero tolerancia a fallos de dinero.',
            contratos: [
                `ReservaSolistaInput { fecha: string; horaInicio: string; horaFin: string; distanciaKm: number; evento: string }`,
                `TarifaBaseSolista: ${TARIFA_BASE_SOLISTA_EUR.toFixed(2)} € (Edwin Agudelo, equipo Bose F1)`,
                `CreateSessionResult { ok: boolean; sessionUrl?: string; error?: string }`,
                `calcularLogistica(distanciaKm: number, horaFin: string): { portes: number; hotel: number } — tarifa ${LOGISTICA_EUR_PER_KM.toFixed(2)} €/km desde el km ${LOGISTICA_KM_EXENTOS}`,
                `Depósito inmutable: ${DEPOSITO_STRIPE_EUR.toFixed(2)} € Price-Lock SHA-256; Split ${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(SPLIT_SOBERANO.earOs * 100)}/${Math.round(SPLIT_SOBERANO.vimume * 100)}`
            ],
            casosLimite: [
                `Distancia <= km ${LOGISTICA_KM_EXENTOS}: portes 0 € (sin cobrar el tramo exento).`,
                `horaFin >= ${HORA_FIN_HOTEL}:00 o distancia > ${LOGISTICA_KM_HOTEL} km: suma ${SUPLEMENTO_HOTEL_EUR} € hotel.`,
                'Pago duplicado: el mismo stripeSessionId produce EXACTAMENTE 1 fila (retry idempotente).',
                'Webhook con firma inválida: 400 directo, sin persistir ni mutar estado.'
            ],
            matrizTrazabilidad: [
                'Botón "Reservar" -> /api/payments/create-session -> SSOT tarifa + logística -> Stripe Checkout -> webhook -> PostgreSQL ProductionEvent',
                'Botón "Depósito" -> /api/reservar/solista/deposit -> Price-Lock 100€ -> atomicDateLockEngine'
            ],
            estrategiaRecuperacion: [
                'Si Stripe devuelve error de red: estado de error con reintento explícito (mismo idempotency key).',
                'Si webhook llega tras timeout: procesado asíncrono no bloqueante + DLQ de reintento.'
            ]
        };
    }

    if (lower.includes('finca') || lower.includes('espacio') || lower.includes('b2b') || lower.includes('homologac') || lower.includes('bodas')) {
        return {
            rol: 'Arquitecto de portales B2B y catálogos nacionales. UX premium con datos reales verificados.',
            contratos: [
                'FincaRecord { id: string; nombre: string; provincia: string; telefono: string; verified: boolean }',
                'searchResponse { results: FincaRecord[]; total: number }',
                'Ruta de venta solo expone proveedores con telefono real verificable (verified:true solo con teléfono real).'
            ],
            casosLimite: [
                'Búsqueda sin resultados: estado empty con CTA de contacto directo (no fachada).',
                'Teléfono placeholder/centralita/vacío: verified:false y NO se vende.',
                'Provincia sin fincas: mensaje elegante + sugerencia de provincias vecinas.'
            ],
            matrizTrazabilidad: [
                'Filtro provincia -> /api/profiles/search?category=finca -> particiones edge verificadas -> tarjeta con teléfono real',
                'Tarjeta finca -> FincasB2BPortal -> /webhook/finca-partnership (n8n no bloqueante)'
            ],
            estrategiaRecuperacion: [
                'Si /api/profiles/search falla: fallback a partición estática edge y log estructurado.',
                'Si n8n está caído: el lead se encola (modo no-cors) sin bloquear la UX.'
            ]
        };
    }

    if (lower.includes('vimume') || lower.includes('senior') || lower.includes('residencia') || lower.includes('geriat') || lower.includes('licitac') || lower.includes('b2g') || lower.includes('pliego')) {
        return {
            rol: 'Ingeniero de licitaciones públicas y dossiers clínicos. Precisión jurídica y acústica.',
            contratos: [
                `LicitacionB2G { importe: number; limite: ${SAFE_LCSP_CEILING_EUR.toFixed(2)}; pliego: string }`,
                `RiderAcustico { splDb: ${LIMITE_SPL_DB}; wattsPorPax: ${WATTS_PER_PAX} }`,
                'Techo LCSP Art. 118 < 14.250 € (ajuste preventivo 95%).'
            ],
            casosLimite: [
                'Importe >= techo LCSP: bloqueo preventivo con aviso legal (no adjudicación).',
                'Presión sonora > 75 dB SPL: rechazo de homologación con explicación técnica.',
                'Certificado RSC desglose: deducción fiscal Ley 49/2002 Modelo 182 AEAT.'
            ],
            matrizTrazabilidad: [
                'Formulario licitación -> b2g-tender-engine -> SSOT techo LCSP -> PDF dossier -> /webhook/b2b-quote',
                'Reporte clínico -> /webhook/vimume-clinical-report -> métricas neuroacústicas 40 Hz'
            ],
            estrategiaRecuperacion: [
                'Si motor de licitación no tiene datos de pliego: exige adjunta de pliego (no inventa).',
                'Si webhook clínico falla: persistencia local + reintento asíncrono no bloqueante.'
            ]
        };
    }

    if (lower.includes('call center') || lower.includes('llamada') || lower.includes('lead') || lower.includes('whatsapp') || lower.includes('centralita') || lower.includes('telef')) {
        return {
            rol: 'Ingeniero omnicanal de Call Center. Despacho de leads sin dejarlos huérfanos.',
            contratos: [
                'LeadIntake { nombre: string; telefono: string; interes: string; origen: string }',
                'DispatchResult { ok: boolean; canal: "whatsapp" | "llamada"; error?: string }',
                'Centralita canónica solo CEO: +34 693 693 048 (ningún otro teléfono valida leads huérfanos).'
            ],
            casosLimite: [
                'Lead sin teléfono real: no se despacha, se marca como incompleto.',
                'Canal caído: reintento con backoff exponencial y DLQ.',
                'Respuesta < 5 min: métrica de SLA visible en dashboard.'
            ],
            matrizTrazabilidad: [
                'Formulario intake -> /webhook/call-center-intake -> n8n -> WhatsApp/llamada -> lead registrado en CRM',
                'Lead huérfano -> /webhook/autonomous-escalation -> scoring y escalado automático'
            ],
            estrategiaRecuperacion: [
                'Si n8n no responde en 5s: cola local + reintento asíncrono (lead nunca se pierde).',
                'Si teléfono es centralita: marca verified:false y no expone en rutas de venta.'
            ]
        };
    }

    // Dominio genérico / arquitectura transversal.
    return {
        rol: 'Arquitecto full-stack Next.js 15 S-Class (staff principal, tipado estricto, DAG de tareas).',
        contratos: [
            'export interface TResultado { ok: boolean; error?: string; data?: unknown }',
            'function accion(input: TInput): Promise<TResultado>',
            'Server Components por defecto; "use client" solo en hoja reactiva; params async en Next.js 15.'
        ],
        casosLimite: [
            'Input vacío / inválido -> mensaje claro, sin crash.',
            'Error de red / timeout -> estado de error con reintento idempotente.',
            'Estados loading/empty/error/éxito cubiertos y accesibles.'
        ],
        matrizTrazabilidad: [
            'Cada botón -> handler -> endpoint -> motor SSOT -> persistencia/webhook (escribe de verdad).',
            'Prohibidos arrays hardcodeados, botones sin backend o motores simulados.'
        ],
        estrategiaRecuperacion: [
            'Fallo de dependencia externa: fallback elegante + log estructurado.',
            'Retries idempotentes: N reintentos = 1 escritura.'
        ]
    };
}

/**
 * 🧭 AUDITORÍA DEL VIAJE DEL CLIENTE (STAKEHOLDER-DRIVEN).
 * ----------------------------------------------------------------------------
 * Conecta a TODOS los stakeholders reales del marketplace EAR OS con los 4
 * pilares de conversión inmutables. Prohibido devolver el manifiesto genérico:
 * cada intención de viaje/auditoría produce un mapa dinámico por stakeholder.
 */
type JourneyStakeholderId =
    | 'CLIENTE_FINAL'
    | 'ARTISTA'
    | 'PROVEEDOR'
    | 'FINCAS_B2B'
    | 'TERAPEUTA_VIMUME'
    | 'CEO_EAR_OS'
    | 'CALL_CENTER';

interface JourneyStakeholder {
    id: JourneyStakeholderId;
    rol: string;
    dolor: string;
    kpi: string;
    puntosDeContacto: string[];
    trazabilidad: string[];
}

interface JourneyPillar {
    titulo: string;
    detalle: string;
    responsables: JourneyStakeholderId[];
}

const JOURNEY_STAKEHOLDERS: JourneyStakeholder[] = [
    {
        id: 'CLIENTE_FINAL',
        rol: 'Pareja / empresa contratante (decision-maker)',
        dolor: 'Miedo a cancelaciones, ruido en la finca, opacidad de caché y fechas indisponibles.',
        kpi: 'Conversión a reserva cerrada con depósito blindado de ' + DEPOSITO_STRIPE_EUR.toFixed(2) + ' € en < 24h.',
        puntosDeContacto: ['Landing SEO orgánico', 'WhatsApp consultivo +34 693 693 048', 'Calendario de disponibilidad ACID', 'Stripe Price-Lock SHA-256'],
        trazabilidad: ['Botón "Reservar" -> /api/payments/create-session -> Stripe Checkout -> webhook -> PostgreSQL ProductionEvent']
    },
    {
        id: 'ARTISTA',
        rol: 'Edwin Agudelo (solista soberano) y artistas ejecutores',
        dolor: 'Cancelaciones de última hora y devaluación del caché base de ' + TARIFA_BASE_SOLISTA_EUR.toFixed(2) + ' €.',
        kpi: 'Fechas blindadas con Price-Lock; caché íntegro y split ' + Math.round(SPLIT_SOBERANO.artista * 100) + '/' + Math.round(SPLIT_SOBERANO.earOs * 100) + '/' + Math.round(SPLIT_SOBERANO.vimume * 100) + ' intacto.',
        puntosDeContacto: ['atomicDateLockEngine (lock atómico idempotente)', 'Rider acústico por contexto', 'Telemetría n8n de reservas'],
        trazabilidad: ['Botón "Depósito" -> /api/reservar/solista/deposit -> Price-Lock ' + DEPOSITO_STRIPE_EUR.toFixed(2) + ' € -> atomicDateLockEngine']
    },
    {
        id: 'PROVEEDOR',
        rol: 'Proveedor de servicios premium (fotografía, catering, floristería, DJ)',
        dolor: 'Invisibilidad en rutas de venta, leads huérfanos y teléfonos no verificables.',
        kpi: 'Lead despachado en < 5 min con teléfono real (verified:true solo con teléfono verificable).',
        puntosDeContacto: ['Marketplace por gremio', 'Particiones edge verificadas', 'Webhook n8n call-center-intake'],
        trazabilidad: ['Tarjeta proveedor -> FincasB2BPortal -> /webhook/finca-partnership -> n8n no bloqueante']
    },
    {
        id: 'FINCAS_B2B',
        rol: 'Finca / venue / espacio para bodas (socio B2B simbiótico)',
        dolor: 'Quejas vecinales por ruido y no poder recomendar un artista de confianza.',
        kpi: 'Acuerdo simbiótico firmado: el artista resuelve el dolor de ruido (rider acústico) a cambio de recomendación preferente.',
        puntosDeContacto: ['FincasB2BPortal', 'Rider acústico Ley 37/2003', 'Webhook finca-partnership'],
        trazabilidad: ['Formulario finca -> /webhook/finca-partnership -> cualificación n8n -> recomendación preferente del artista']
    },
    {
        id: 'TERAPEUTA_VIMUME',
        rol: 'Terapeuta / centro senior (VIMUME, obra social y sanitaria)',
        dolor: 'Aforo senior sin activación neurológica y financiación de sesiones.',
        kpi: 'Certificado RSC/ESG (Ley 49/2002) + protocolo 40 Hz Gamma con ' + WATTS_PER_PAX + ' W/pax y < ' + LIMITE_SPL_DB + ' dB SPL.',
        puntosDeContacto: ['Reporte neuroacústico', 'Webhook vimume-clinical-report', 'Dossier B2G'],
        trazabilidad: ['Reporte clínico -> /webhook/vimume-clinical-report -> métricas 40 Hz -> certificado RSC']
    },
    {
        id: 'CEO_EAR_OS',
        rol: 'CEO / operador de la infraestructura EAR OS',
        dolor: 'Fachadas vacías, retrabajo y pérdida de trazabilidad comercial.',
        kpi: 'Split ' + Math.round(SPLIT_SOBERANO.artista * 100) + '/' + Math.round(SPLIT_SOBERANO.earOs * 100) + '/' + Math.round(SPLIT_SOBERANO.vimume * 100) + ' intacto y telemetría n8n sin leads huérfanos.',
        puntosDeContacto: ['Dashboard /admin/control', 'tasks_queue.json', 'Webhooks n8n ejecutivos'],
        trazabilidad: ['Dashboard -> /api/admin/* -> PostgreSQL 16 -> webhooks n8n -> KPI radar']
    },
    {
        id: 'CALL_CENTER',
        rol: 'Operador omnicanal (call center / WhatsApp)',
        dolor: 'Leads huérfanos y llamadas sin scoring.',
        kpi: 'Despacho omnicanal < 5 min con backoff exponencial y DLQ.',
        puntosDeContacto: ['Centralita +34 693 693 048', 'Webhook call-center-intake', 'autonomous-escalation'],
        trazabilidad: ['Intake -> /webhook/call-center-intake -> n8n -> WhatsApp/llamada -> CRM']
    }
];

const JOURNEY_PILLARS: JourneyPillar[] = [
    {
        titulo: 'Neurobranding y posicionamiento de alto standing',
        detalle: 'Identidad premium OLED, verbos de valor y datos reales (nunca copy vacío). Cada punto de contacto debe irradiar lujo y confianza soberana.',
        responsables: ['ARTISTA', 'PROVEEDOR', 'CEO_EAR_OS']
    },
    {
        titulo: 'Venta Elegante: llamada consultiva orientada a resolver, no a empujar',
        detalle: 'El operador diagnostica el dolor (ruido, fecha, caché) y prescribe la solución SSOT; cero presión comercial.',
        responsables: ['CEO_EAR_OS', 'CALL_CENTER', 'CLIENTE_FINAL']
    },
    {
        titulo: 'Filtro de exclusividad: depósito ' + DEPOSITO_STRIPE_EUR.toFixed(2) + ' € Stripe Price-Lock en 24h',
        detalle: 'Bloqueo atómico de fecha/hora 100% deducible del total. Erradica mirones y cancelaciones; filtra compromiso mutuo.',
        responsables: ['CLIENTE_FINAL', 'ARTISTA', 'CEO_EAR_OS']
    },
    {
        titulo: 'Acuerdo B2B simbiótico: resolución del dolor de ruido de la finca a cambio de recomendación preferente',
        detalle: 'El artista garantiza el rider acústico (' + LIMITE_SPL_DB + ' dB SPL, ' + WATTS_PER_PAX + ' W/pax) y la finca recomienda al artista de forma preferente.',
        responsables: ['FINCAS_B2B', 'ARTISTA']
    }
];

const JOURNEY_STAKEHOLDER_KEYWORDS: Array<{ id: JourneyStakeholderId; keywords: string[] }> = [
    { id: 'CLIENTE_FINAL', keywords: ['cliente', 'pareja', 'novio', 'novia', 'contratante', 'publico', 'asistente', 'invitado'] },
    { id: 'ARTISTA', keywords: ['artista', 'edwin', 'solista', 'musico', 'dj', 'cantante'] },
    { id: 'PROVEEDOR', keywords: ['proveedor', 'fotog', 'catering', 'florist', 'maquillad'] },
    { id: 'FINCAS_B2B', keywords: ['finca', 'venue', 'banquete', 'b2b', 'espacio'] },
    { id: 'TERAPEUTA_VIMUME', keywords: ['terapeuta', 'vimume', 'senior', 'residencia', 'clinic', 'musicoterap'] },
    { id: 'CEO_EAR_OS', keywords: ['ceo', 'ear os', 'empresario', 'operacion', 'director'] },
    { id: 'CALL_CENTER', keywords: ['call center', 'llamada', 'whatsapp', 'centralita', 'lead', 'operador'] }
];

function isCustomerJourneyIntent(lower: string): boolean {
    return ['viaje del cliente', 'customer journey', 'journey', 'stakeholder', 'auditor', 'auditar', 'mapa de experiencia', 'empat', 'embudo', 'funnel', 'conversión', 'conversion', 'neurobranding', 'venta elegante', 'acuerdo b2b'].some((k) => lower.includes(k));
}

function detectJourneyStakeholders(lower: string): JourneyStakeholderId[] {
    const detected = JOURNEY_STAKEHOLDER_KEYWORDS
        .filter((entry) => entry.keywords.some((k) => lower.includes(k)))
        .map((entry) => entry.id);
    if (detected.length === 0) {
        return JOURNEY_STAKEHOLDERS.map((s) => s.id);
    }
    return detected;
}

/**
 * 🧭 Construye un PROMPT MAESTRO dinámico de auditoría del viaje del cliente:
 * filtra los stakeholders detectados en la intención y cruza con los 4 pilares
 * de conversión. Nunca devuelve el mismo texto para intenciones distintas.
 */
function buildCustomerJourneyForge(intent: string, mode: ForgeMode): ForgedMasterPrompt {
    const clean = intent.trim();
    const lower = clean.toLowerCase();
    const stakeholderIds = detectJourneyStakeholders(lower);
    const stakeholders = JOURNEY_STAKEHOLDERS.filter((s) => stakeholderIds.includes(s.id));
    const pillars = JOURNEY_PILLARS.filter((p) => p.responsables.some((r) => stakeholderIds.includes(r)));
    const isSurgical = mode === 'QUIRURGICO';
    const role = isSurgical
        ? 'Cirujano de código TypeScript (edición atómica, diff mínimo) enfocado en el viaje del cliente.'
        : 'Arquitecto de experiencia y conversión full-stack (Customer Journey S-Class multi-stakeholder).';

    const lines: string[] = [
        '# ═══════════════════════════════════════════════════════════════════════',
        '# PROMPT MAESTRO S-CLASS · AUDITORÍA DEL VIAJE DEL CLIENTE',
        '# STAKEHOLDER-DRIVEN · 4 PILARES DE CONVERSIÓN · NEXT.JS 15',
        '# BLACK-MAGIC EDITION v3.0 · DOD SCORECARD 8/8',
        '# ═══════════════════════════════════════════════════════════════════════',
        '',
        '## 🎯 OBJETIVO DE NEGOCIO',
        clean,
        '',
        '## 🧭 NORTH STAR (KPI CUANTIFICABLE)',
        '1. Cada stakeholder auditado debe tener un KPI medible (conversión, lead < 5 min, caché íntegro, split intacto).',
        '2. Cada punto de contacto debe responder: "¿qué dolor mata y qué escribe realmente?".',
        '3. Prohibido mapear una fachada: todo botón -> handler -> endpoint -> motor SSOT -> persistencia/webhook.',
        '',
        '## 🧑‍💼 ROL A ASUMIR',
        role,
        '',
        '## 👥 STAKEHOLDERS BAJO AUDITORÍA (detectados dinámicamente)'
    ];

    for (const s of stakeholders) {
        lines.push(
            '',
            `### ${s.id.replace(/_/g, ' ')} — ${s.rol}`,
            `- Dolor a matar: ${s.dolor}`,
            `- KPI de éxito: ${s.kpi}`,
            `- Puntos de contacto: ${s.puntosDeContacto.join(' · ')}`,
            `- Trazabilidad: ${s.trazabilidad.join(' · ')}`
        );
    }

    lines.push(
        '',
        '## 🏛️ CUATRO PILARES DE CONVERSIÓN (CRUZADOS CON LOS STAKEHOLDERS DETECTADOS)'
    );

    for (const p of pillars) {
        const responsables = p.responsables
            .filter((r) => stakeholderIds.includes(r))
            .map((r) => r.replace(/_/g, ' ').toLowerCase());
        lines.push(
            '',
            `### ${p.titulo}`,
            `- ${p.detalle}`,
            `- Responsables bajo auditoría: ${responsables.length ? responsables.join(', ') : 'N/D'}.`
        );
    }

    lines.push(
        '',
        '## 📐 CONTRATOS DE DATOS (FIRMAS EXACTAS — CERO any)',
        `- Tarifa base solista: ${TARIFA_BASE_SOLISTA_EUR.toFixed(2)} € (Edwin Agudelo).`,
        `- Depósito inmutable: ${DEPOSITO_STRIPE_EUR.toFixed(2)} € Stripe Price-Lock SHA-256, 100% deducible, cierre en 24h.`,
        `- Split Soberano: ${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(SPLIT_SOBERANO.earOs * 100)}/${Math.round(SPLIT_SOBERANO.vimume * 100)}.`,
        `- Logística: ${LOGISTICA_EUR_PER_KM.toFixed(2)} €/km desde el km ${LOGISTICA_KM_EXENTOS} (+${SUPLEMENTO_HOTEL_EUR} € hotel si fin >= ${HORA_FIN_HOTEL}:00 o > ${LOGISTICA_KM_HOTEL} km).`,
        `- Rider acústico: ${LIMITE_SPL_DB} dB SPL máx y ${WATTS_PER_PAX} W/pax (Ley 37/2003).`,
        "- Server actions / API routes devuelven `{ ok: boolean; error?: string; data?: T }` y nunca lanzan excepciones crudas.",
        '',
        '## 🏗️ ARQUITECTURA (NEXT.JS 15 APP ROUTER)',
        '- Server Components por defecto; `"use client"` SOLO en la hoja reactiva del DOM.',
        '- Rutas dinámicas: `const resolvedParams = await params;`.',
        '- Lógica en server action (mutación) / API route (integración) / lib (SSOT puro).',
        '- Defensa en profundidad: try/catch hermético en cada server action y route.',
        '',
        '## 🔒 RESTRICCIONES DURAS (SSOT — INMUTABLES)',
        ...SSOT_BUSINESS_RULES.map((r) => `- ${r}`),
        '- Estética OLED: #030305, oro #ecb613, rubí #FF2B44, cyan #00E5FF. Prohibido w-screen.',
        '- Next.js 15: params async, Server Components por defecto.',
        '',
        '## 🧨 CASOS LÍMITE & FALLO ELEGANTE',
        '- Cliente sin fecha cerrada: no se bloquea el calendario; se envía Ruta Libre WhatsApp +34 693 693 048.',
        '- Depósito duplicado: el mismo stripeSessionId produce EXACTAMENTE 1 fila (retry idempotente).',
        '- Teléfono placeholder/centralita/vacío: verified:false y NO se expone en rutas de venta.',
        '- Finca sin homologación de ruido: se pide adjuntar rider acústico antes de recomendar.',
        '- n8n caído: el lead se encola (modo no-cors) sin bloquear la UX; nunca queda huérfano.',
        '',
        '## 🧬 MATRIZ DE TRAZABILIDAD (ANTI-FACHADA)',
        ...stakeholders.map((s) => `- ${s.trazabilidad.join(' · ')}`),
        '- Prohibidos arrays hardcodeados, botones sin backend o motores simulados.',
        '- Secrets (STRIPE_SECRET_KEY, etc.) SOLO en servidor; jamás en cliente.',
        '',
        '## 🛟 ESTRATEGIA DE RECUPERACIÓN',
        '- Si Stripe devuelve error de red: estado de error con reintento explícito (misma idempotency key).',
        '- Si webhook llega tras timeout: procesado asíncrono no bloqueante + DLQ de reintento.',
        '- Si la GPU falla: el motor determinístico garantiza SIEMPRE este prompt (nunca vacío).',
        '',
        '## ⛔ PROHIBICIONES',
        '- Prohibido hardcodear datos o teléfonos ficticios (`verified:true` solo con teléfono real).',
        '- Prohibido usar w-screen, grises lavados o gradientes violeta/azul (AI-slop).',
        `- Prohibido alterar el Split ${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(SPLIT_SOBERANO.earOs * 100)}/${Math.round(SPLIT_SOBERANO.vimume * 100)} o el depósito de ${DEPOSITO_STRIPE_EUR.toFixed(2)} €.`,
        '- Prohibido dejar TODO/FIXME/placeholder en la ruta de venta.',
        '',
        '## ✅ CRITERIO DE CIERRE ATÓMICO (DOD SCORECARD 8/8)',
        '1. `npx tsc --noEmit` -> Exit Code 0.',
        '2. Cero `any` implícito en el diff.',
        '3. Todo botón escribe de verdad (0 fachadas).',
        '4. 0 TODO/placeholder en la ruta de venta.',
        '5. 0 array/dato hardcodeado en motores de dinero.',
        `6. Split ${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(SPLIT_SOBERANO.earOs * 100)}/${Math.round(SPLIT_SOBERANO.vimume * 100)} intacto.`,
        `7. Depósito ${DEPOSITO_STRIPE_EUR.toFixed(2)} € intacto.`,
        `8. Rider acústico ${WATTS_PER_PAX} W/pax y < ${LIMITE_SPL_DB} dB SPL intacto.`
    );

    const masterPrompt = lines.join('\n');

    return {
        masterPrompt,
        objective: clean,
        role,
        context: [
            'Intención de auditoría del viaje del cliente sin estructura técnica previa.',
            `Stakeholders detectados: ${stakeholders.map((s) => s.id).join(', ')}.`,
            `Pilares de conversión activos: ${pillars.map((p) => p.titulo).join(' | ')}.`
        ],
        hardConstraints: [...SSOT_BUSINESS_RULES],
        implementationSteps: [
            'Mapear cada stakeholder detectado a sus puntos de contacto reales.',
            'Cruzar cada punto de contacto con los 4 pilares de conversión.',
            'Verificar botón -> handler -> endpoint -> motor SSOT -> persistencia/webhook.',
            'Blindar con try/catch, validación de entrada y casos límite.',
            'Validar con npx tsc --noEmit hasta Exit Code 0.'
        ],
        filesToTouch: inferFiles(lower),
        validation: 'npx tsc --noEmit -> Exit Code 0',
        negativeConstraints: [
            'No hardcodear datos falsos ni teléfonos ficticios.',
            'No usar w-screen ni gradientes AI-slop.',
            `No alterar el Split ${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(SPLIT_SOBERANO.earOs * 100)}/${Math.round(SPLIT_SOBERANO.vimume * 100)} ni el depósito de ${DEPOSITO_STRIPE_EUR.toFixed(2)} €.`,
            'No exponer claves secretas en el cliente.'
        ],
        targetModel: 'DETERMINISTIC',
        forgeEngine: 'DETERMINISTIC_FALLBACK',
        latencyMs: 0,
        tokensPerSecond: 0,
        reasoningEngineUsed: 'SCLASS_JOURNEY_AUDIT_FORGE_V3'
    };
}

/**
 * 🧠 Compilador determinístico de conocimiento profundo: construye un prompt
 * maestro de estudio de caso SIN depender de la GPU. Garantiza que el Forge
 * NUNCA devuelve vacío y siempre exige el máximo al obrero local.
 */
function buildDeterministicForge(intent: string, mode: ForgeMode): ForgedMasterPrompt {
    const clean = intent.trim();
    const lower = clean.toLowerCase();

    // 🧭 Auditoría del viaje del cliente: forja dinámica por stakeholder (nunca genérico).
    if (isCustomerJourneyIntent(lower)) {
        return buildCustomerJourneyForge(intent, mode);
    }

    const filesToTouch = inferFiles(lower);
    const isSurgical = mode === 'QUIRURGICO';
    const domain = resolveDomainProfile(lower);

    const role = isSurgical
        ? 'Cirujano de código TypeScript (edición atómica, diff mínimo, cero exploración). ' + domain.rol
        : domain.rol;

    const ssotTauri = Math.round(SSOT_BUSINESS_RULES.length);

    const masterPrompt = [
        '# ═══════════════════════════════════════════════════════════════════════',
        '# PROMPT MAESTRO S-CLASS · ESTUDIO DE CASO · FRONTIER FULL-STACK',
        '# BLACK-MAGIC EDITION v3.0 · 7 CAPAS · DOD SCORECARD 8/8',
        '# ═══════════════════════════════════════════════════════════════════════',
        '',
        '## 🎯 OBJETIVO DE NEGOCIO',
        clean,
        '',
        '## 🧭 NORTH STAR (KPI CUANTIFICABLE)',
        'Define ANTES de tocar código la métrica observable que debe mejorar y el umbral de éxito.',
        '- Lead captado, reserva cerrada, depósito Stripe, tarea despachada a n8n o tiempo de respuesta < 5 min.',
        'Todo cambio debe poder responder: "¿qué KPI desbloquea y por qué?".',
        '',
        '## 🧑‍💼 ROL A ASUMIR',
        role,
        '',
        `## 📐 CONTRATOS DE DATOS (FIRMAS EXACTAS — CERO any) · ${ssotTauri} reglas SSOT activas`,
        ...domain.contratos.map((c) => `- \`${c}\``),
        '- Server actions / API routes devuelven `{ ok: boolean; error?: string; data?: T }` y nunca lanzan excepciones crudas.',
        '',
        '## 🏗️ ARQUITECTURA (NEXT.JS 15 APP ROUTER)',
        '- Server Components por defecto; `"use client"` SOLO en la hoja reactiva del DOM.',
        '- Rutas dinámicas: `const resolvedParams = await params;`.',
        '- Lógica en server action (mutación) / API route (integración) / lib (SSOT puro).',
        '- Defensa en profundidad: try/catch hermético en cada server action y route.',
        '',
        '## 🔒 RESTRICCIONES DURAS (SSOT — INMUTABLES)',
        ...SSOT_BUSINESS_RULES.map((r) => `- ${r}`),
        '- Estética OLED: #030305, oro #ecb613, rubí #FF2B44, cyan #00E5FF. Prohibido w-screen.',
        '- Next.js 15: params async, Server Components por defecto.',
        '',
        '## 🗂️ ARCHIVOS A TOCAR (con su propósito)',
        ...(filesToTouch.length ? filesToTouch.map((f) => `- \`${f}\``) : ['(El compilador no detectó archivos; localiza el componente más cercano por grep).']),
        '',
        '## 🪜 PASOS DE IMPLEMENTACIÓN',
        '1. INSPECCIONAR: lee solo los archivos citados y sus exports/interfaces.',
        '2. CONTRATAR: define tipos y firmas exactas antes de escribir lógica.',
        '3. IMPLEMENTAR: aplica el cambio respetando arquitectura, SSOT y estilo OLED.',
        '4. BLINDAR: try/catch hermético, validación de entrada, fallback elegante.',
        '5. TRAZAR: verifica botón -> handler -> endpoint -> motor SSOT -> persistencia.',
        '6. VALIDAR: ejecuta npx tsc --noEmit y corrige hasta Exit Code 0.',
        '',
        '## 🧨 CASOS LÍMITE & FALLO ELEGANTE',
        ...domain.casosLimite.map((c) => `- ${c}`),
        '- Accesibilidad: foco visible, aria-labels, contraste AA, micro-interacciones 300ms ease-out.',
        '',
        '## 🧬 MATRIZ DE TRAZABILIDAD (ANTI-FACHADA)',
        ...domain.matrizTrazabilidad.map((m) => `- ${m}`),
        '- Prohibidos arrays hardcodeados, botones sin backend o motores simulados.',
        '- Secrets (STRIPE_SECRET_KEY, etc.) SOLO en servidor; jamás en cliente.',
        '',
        '## 🛟 ESTRATEGIA DE RECUPERACIÓN',
        ...domain.estrategiaRecuperacion.map((r) => `- ${r}`),
        '',
        '## ⛔ PROHIBICIONES',
        '- Prohibido hardcodear datos o teléfonos ficticios (`verified:true` solo con teléfono real).',
        '- Prohibido usar w-screen, grises lavados o gradientes violeta/azul (AI-slop).',
        `- Prohibido alterar el Split ${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(SPLIT_SOBERANO.earOs * 100)}/${Math.round(SPLIT_SOBERANO.vimume * 100)} o el depósito de ${DEPOSITO_STRIPE_EUR.toFixed(2)} €.`,
        '- Prohibido exponer claves secretas en cliente.',
        '- Prohibido dejar TODO/FIXME/placeholder en la ruta de venta.',
        '',
        '## ✅ CRITERIO DE CIERRE ATÓMICO (DOD SCORECARD 8/8)',
        '1. `npx tsc --noEmit` -> Exit Code 0.',
        '2. Cero `any` implícito en el diff.',
        '3. Todo botón escribe de verdad (0 fachadas).',
        '4. 0 TODO/placeholder en la ruta de venta.',
        '5. 0 array/dato hardcodeado en motores de dinero.',
        `6. Split ${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(SPLIT_SOBERANO.earOs * 100)}/${Math.round(SPLIT_SOBERANO.vimume * 100)} intacto.`,
        `7. Depósito ${DEPOSITO_STRIPE_EUR.toFixed(2)} € intacto.`,
        `8. Rider acústico ${WATTS_PER_PAX} W/pax y < ${LIMITE_SPL_DB} dB SPL intacto.`
    ].join('\n');

    return {
        masterPrompt,
        objective: clean,
        role,
        context: [
            'Intención cruda del CEO sin estructura técnica previa.',
            `Motor determinístico: dominio detectado ("${detectDomainLabel(lower)}"), ${filesToTouch.length} archivo(s) relevantes.`
        ],
        hardConstraints: [...SSOT_BUSINESS_RULES],
        implementationSteps: [
            'Inspeccionar los archivos citados y sus contratos.',
            'Definir tipos e interfaces explícitas con firmas exactas.',
            'Implementar respetando arquitectura Next.js 15, SSOT y estilo OLED.',
            'Trazar botón -> handler -> endpoint -> motor SSOT -> persistencia.',
            'Blindar con try/catch, validación de entrada y casos límite.',
            'Validar con npx tsc --noEmit hasta Exit Code 0.'
        ],
        filesToTouch,
        validation: 'npx tsc --noEmit -> Exit Code 0',
        negativeConstraints: [
            'No hardcodear datos falsos ni teléfonos ficticios.',
            'No usar w-screen ni gradientes AI-slop.',
            `No alterar el Split ${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(SPLIT_SOBERANO.earOs * 100)}/${Math.round(SPLIT_SOBERANO.vimume * 100)} ni el depósito de ${DEPOSITO_STRIPE_EUR.toFixed(2)} €.`,
            'No exponer claves secretas en el cliente.'
        ],
        targetModel: 'DETERMINISTIC',
        forgeEngine: 'DETERMINISTIC_FALLBACK',
        latencyMs: 0,
        tokensPerSecond: 0,
        reasoningEngineUsed: 'SCLASS_DETERMINISTIC_FORGE_V3'
    };
}

/** Etiqueta humana del dominio detectado (telemetría de forja). */
function detectDomainLabel(lower: string): string {
    if (isCustomerJourneyIntent(lower)) return 'viaje del cliente (stakeholder-driven)';
    if (lower.includes('reserva') || lower.includes('solista') || lower.includes('checkout') || lower.includes('stripe')) return 'tesorería/reserva';
    if (lower.includes('finca') || lower.includes('b2b') || lower.includes('bodas')) return 'fincas/b2b';
    if (lower.includes('vimume') || lower.includes('senior') || lower.includes('b2g') || lower.includes('licitac')) return 'vimume/b2g';
    if (lower.includes('call center') || lower.includes('whatsapp') || lower.includes('lead')) return 'call center';
    return 'transversal';
}

/**
 * Mapea descripciones humanas a rutas reales del proyecto.
 */
function inferFiles(lower: string): string[] {
    if (isCustomerJourneyIntent(lower)) {
        return [
            'src/app/(admin)/admin/compiler/page.tsx',
            'src/lib/compiler/prompt-maestro-forge.ts',
            'src/lib/constants/ear-os-ssot.ts',
            'src/lib/services/n8n-dispatcher.ts',
            'src/lib/availability/atomicDateLockEngine.ts'
        ];
    }
    if (lower.includes('compil') || lower.includes('prompt') || lower.includes('oraculo') || lower.includes('gpu')) {
        return [
            'src/app/(admin)/admin/compiler/page.tsx',
            'src/app/api/admin/compile-intent/route.ts',
            'src/lib/compiler/prompt-maestro-forge.ts'
        ];
    }
    if (lower.includes('finca') || lower.includes('espacio') || lower.includes('bodas')) {
        return [
            'src/app/(public)/fincas/page.tsx',
            'src/features/bodas/ui/FincasCatalogExplorer.tsx',
            'src/components/fincas/FincasB2BPortal.tsx'
        ];
    }
    if (lower.includes('reserva') || lower.includes('solista') || lower.includes('stripe') || lower.includes('deposito')) {
        return [
            'src/app/reservar/solista/page.tsx',
            'src/app/api/payments/create-session/route.ts',
            'src/app/api/stripe/webhook/route.ts',
            'src/components/programmatic/StripeSmartLockCta.tsx'
        ];
    }
    if (lower.includes('call center') || lower.includes('lead') || lower.includes('whatsapp')) {
        return [
            'src/app/(admin)/admin/call-center/page.tsx',
            'src/lib/services/n8n-dispatcher.ts'
        ];
    }
    if (lower.includes('vimume') || lower.includes('senior') || lower.includes('b2g')) {
        return [
            'src/app/(public)/vimume/page.tsx',
            'src/lib/vimume/b2g-tender-engine.ts'
        ];
    }
    if (lower.includes('navegac') || lower.includes('navbar') || lower.includes('sidebar')) {
        return [
            'src/app/components/layout/SovereignNavbar.tsx',
            'src/app/(admin)/admin/layout.tsx'
        ];
    }
    if (lower.includes('color') || lower.includes('paleta') || lower.includes('oled') || lower.includes('diseño')) {
        return [
            'src/app/globals.css',
            'tailwind.config.cjs'
        ];
    }
    return [
        'src/app/(admin)/admin/page.tsx',
        'src/app/(admin)/admin/command-center/page.tsx'
    ];
}

interface ForgeLlmOutput {
    objective?: string;
    role?: string;
    context?: string[];
    hardConstraints?: string[];
    implementationSteps?: string[];
    filesToTouch?: string[];
    validation?: string;
    negativeConstraints?: string[];
    masterPrompt?: string;
}

/**
 * Ensambla el resultado final del Forge rellenando los campos ausentes con
 * el compilador determinístico (nunca devuelve un prompt incompleto).
 */
function assembleForgedResult(
    parsed: ForgeLlmOutput,
    intent: string,
    mode: ForgeMode,
    targetModel: string,
    forgeEngine: ForgeEngine,
    latencyMs: number,
    tokensPerSecond: number,
    reasoningEngineUsed: string
): ForgedMasterPrompt {
    const deterministic = buildDeterministicForge(intent, mode);
    return {
        masterPrompt: parsed.masterPrompt ?? deterministic.masterPrompt,
        objective: parsed.objective ?? deterministic.objective,
        role: parsed.role ?? deterministic.role,
        context: Array.isArray(parsed.context) && parsed.context.length > 0 ? parsed.context : deterministic.context,
        hardConstraints: Array.isArray(parsed.hardConstraints) && parsed.hardConstraints.length > 0
            ? parsed.hardConstraints
            : deterministic.hardConstraints,
        implementationSteps: Array.isArray(parsed.implementationSteps) && parsed.implementationSteps.length > 0
            ? parsed.implementationSteps
            : deterministic.implementationSteps,
        filesToTouch: Array.isArray(parsed.filesToTouch) && parsed.filesToTouch.length > 0
            ? parsed.filesToTouch
            : deterministic.filesToTouch,
        validation: parsed.validation ?? deterministic.validation,
        negativeConstraints: Array.isArray(parsed.negativeConstraints) && parsed.negativeConstraints.length > 0
            ? parsed.negativeConstraints
            : deterministic.negativeConstraints,
        targetModel,
        forgeEngine,
        latencyMs,
        tokensPerSecond,
        reasoningEngineUsed
    };
}

/**
 * Forja un prompt maestro usando la GPU local (27B/32B). Si algo falla,
 * cae con elegancia al compilador determinístico (nunca devuelve vacío).
 */
export async function forgeMasterPrompt(options: ForgeOptions): Promise<ForgedMasterPrompt> {
    const intent = options.intent.trim();
    const mode: ForgeMode = options.mode ?? 'ARQUITECTO';

    if (!intent) {
        return buildDeterministicForge('(intención vacía)', mode);
    }
    if (options.forceDeterministic) {
        return buildDeterministicForge(intent, mode);
    }

    const model = options.model ?? (mode === 'ARQUITECTO' ? ARCHITECT_GPU_MODEL : 'qwen3.8-27b-fast:latest');
    const profile = resolveGpuModel(model);

    const userPrompt = [
        `MODO DE FORJA: ${mode}`,
        mode === 'QUIRURGICO'
            ? 'Genera un prompt para edición atómica de 1 archivo con diff mínimo.'
            : 'Genera un prompt de arquitectura full-stack multi-archivo.',
        '',
        'INTENCIÓN CRUDA DEL CEO (puede ser informal o dictada por voz):',
        `"${intent}"`,
        '',
        'Devuelve EXCLUSIVAMENTE el objeto JSON definido en tus instrucciones.'
    ].join('\n');

    // 1) DeepSeek cloud (si hay clave) — primario, máxima resiliencia en demos.
    if (isDeepSeekConfigured()) {
        try {
            const ds = await runDeepSeekChat({
                system: FORGE_SYSTEM_PROMPT,
                prompt: userPrompt,
                json: true,
                temperature: 0.15,
                maxTokens: 2048,
                signal: options.signal
            });
            if (ds.available && ds.content) {
                const parsed = extractJsonObject<ForgeLlmOutput>(ds.content);
                if (parsed?.masterPrompt) {
                    return assembleForgedResult(
                        parsed,
                        intent,
                        mode,
                        `DeepSeek (${ds.model})`,
                        'DEEPSEEK_CLOUD',
                        ds.latencyMs,
                        0,
                        `DEEPSEEK_CLOUD (${ds.model})`
                    );
                }
            }
        } catch {
            // Cae con elegancia a la GPU local.
        }
    }

    // 2) GPU local Qwen — secundario.
    try {
        const result = await runGpuChat({
            model: profile.id,
            system: FORGE_SYSTEM_PROMPT,
            prompt: userPrompt,
            json: true,
            temperature: 0.15,
            keepAlive: '30m',
            numPredict: 2048,
            signal: options.signal
        });

        const parsed = extractJsonObject<ForgeLlmOutput>(result.content);
        if (!parsed?.masterPrompt) {
            return buildDeterministicForge(intent, mode);
        }

        return assembleForgedResult(
            parsed,
            intent,
            mode,
            profile.label,
            'OLLAMA_GPU',
            result.latencyMs,
            result.tokensPerSecond,
            `OLLAMA_GPU (${profile.id})`
        );
    } catch {
        // Fallback blindado: ni DeepSeek ni la GPU respondieron -> calidad determinística.
        const fallback = buildDeterministicForge(intent, mode);
        return { ...fallback, targetModel: profile.label };
    }
}