import {
  runGpuChat,
  extractJsonObject,
  resolveGpuModel,
  DEFAULT_GPU_MODEL,
  type GpuModelId
} from './qwen-gpu-inference';
import {
  renderGuideDirectives,
  resolveMasterGuide,
  type GuideSource,
  type MasterObjectiveId,
  type MasterTacticId,
  type MasterTargetAgentId,
} from './master-guide';
import {
  TARIFA_BASE_SOLISTA_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  DEPOSITO_STRIPE_EUR,
  SAFE_LCSP_CEILING_EUR,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  SPLIT_SOBERANO
} from '@/lib/constants/ear-os-ssot';

export type CompileMode = 'QUIRURGICO' | 'OMEGA_FULLSTACK';
export type CompileEngine = 'OLLAMA' | 'CLOUD';

/** Marcador explícito de recorte: un texto acotado nunca debe parecer completo. */
const CLAMP_MARKER = ' …[recortado]';

/** Recorta conservando el marcador: el resultado nunca excede `max`. */
function truncateWithMarker(value: string, max: number): string {
  if (value.length <= max) return value;
  const room = Math.max(0, max - CLAMP_MARKER.length);
  return value.slice(0, room) + CLAMP_MARKER;
}

/** Texto de una sola línea (título, acción, criterio de cierre). */
function clampSingleLine(value: string, max: number): string {
  return truncateWithMarker(value.replace(/\s+/g, ' ').trim(), max);
}

/** Texto multilínea (macro-script): no aplasta la estructura del andamio. */
function clampMultiline(value: string, max: number): string {
  return truncateWithMarker(value.trim(), max);
}

/**
 * Reglas de negocio derivadas ÚNICAMENTE del SSOT canónico (Zona Cero).
 * Prohibido duplicar valores: todo número nace de ear-os-ssot.ts.
 */
export const SSOT_BUSINESS_RULES: readonly string[] = [
  `TarifaBaseSolista(EdwinAgudelo):${TARIFA_BASE_SOLISTA_EUR.toFixed(2)}EUR`,
  `Logistica:${LOGISTICA_EUR_PER_KM.toFixed(2)}EUR/km desde Hub Mentrida a partir del km${LOGISTICA_KM_EXENTOS}`,
  `Hotel:+${SUPLEMENTO_HOTEL_EUR.toFixed(0)}EUR si horaFin>=${HORA_FIN_HOTEL}:00AM o distancia>${LOGISTICA_KM_HOTEL}km`,
  `SplitSoberano:${Math.round(SPLIT_SOBERANO.artista * 100)}%Artista/${Math.round(SPLIT_SOBERANO.earOs * 100)}%EAROS/${Math.round(SPLIT_SOBERANO.vimume * 100)}%VIMUME`,
  `Cierre:Deposito${DEPOSITO_STRIPE_EUR.toFixed(2)}EUR Stripe Price-Lock SHA-256`,
  `RiderAcustico:${WATTS_PER_PAX}W/pax limiteSaludPublica<${LIMITE_SPL_DB}dB SPL`,
  `LimiteB2G Art.118 LCSP:<${SAFE_LCSP_CEILING_EUR.toFixed(2)}EUR (Ajuste preventivo 95%)`
];

export interface CompileOptions {
  mode: CompileMode | 'SURGICAL' | 'FULL_STACK' | 'ARCHIVAL_SWEEP';
  engine?: CompileEngine;
  targetEngine?: 'LOCAL_OLLAMA' | 'CLOUD_EDGE';
  autoInjectQueue?: boolean;
  /** Eje 1 de la Guía Maestra (`master-guide.ts`). Si falta, se deduce del texto. */
  objective?: string | null;
  /** Eje 2: táctica comercial. Gobierna las directivas inyectadas en el grafo. */
  tactic?: string | null;
  /** Eje 3: destinatario del grafo (agente local, automatización o conserjería). */
  targetAgent?: string | null;
  /** Eje 4: dominio / vertical aislada del ecosistema. */
  domain?: string | null;
  /** Eje 5: perfil de stakeholder objetivo. */
  stakeholder?: string | null;
  /**
   * Orden humana original. Viaja a `action`/`description` de la tarea en lugar
   * del prompt forjado, que puede tener miles de caracteres y desbordar el
   * contrato de la cola (`MAX_ACTION_LEN`).
   */
  sourceIntent?: string;
  /** Modelo GPU a usar para el razonamiento profundo. */
  model?: GpuModelId | string;
  /** Si es true, salta la consulta GPU del arquitecto (el DAG se deriva del discriminador). */
  skipOllamaArchitect?: boolean;
  /** Prompt maestro ya forjado; si se aporta, se convierte en el macro-script del DAG. */
  masterPromptOverride?: string;
}

export interface CompiledDAGResult {
  yaml: string;
  engine: CompileEngine;
  protocol: string;
  /** Contrato canónico Omega (consumido por /api/admin/tasks/inject -> omega.js). */
  jsonTask: {
    id: string;
    title: string;
    status: 'QUEUED';
    description: string;
    files: string[];
    action: string;
    scaffold: string;
    done_when: string;
    validation: string;
  };
  estimatedTokens: number;
  extractedEntities: {
    suggestedFiles: string[];
    priceMatches: string[];
    governanceChecks: string[];
    reasoningEngineUsed?: string;
  };
  /**
   * Guía Maestra realmente aplicada al grafo. Antes de este contrato la táctica
   * elegida en `/admin/compiler` no dejaba rastro en el resultado: era decoración.
   */
  guide: {
    objective: MasterObjectiveId;
    tactic: MasterTacticId;
    targetAgent: MasterTargetAgentId;
    directiveCount: number;
    source: {
      objective: GuideSource;
      tactic: GuideSource;
      targetAgent: GuideSource;
    };
  };
}

interface SemanticResolution {
  files: string[];
  macro: string;
  validation: string;
}

interface OllamaArchitectResult {
  files: string[];
  macro: string;
  validation: string;
  model: string;
}

/**
 * 🏛️ KNOWLEDGE GRAPH ESTÁTICO DE EAR OS (Zero-Cold-Start)
 * Mapeo semántico de dominios a archivos reales y scripts verificadores.
 */
function resolveSemanticFiles(cleanInput: string): SemanticResolution {
  const lower = cleanInput.toLowerCase();

  // 0. Coherencia de Navegación, Navbars, Sidebars y Menús
  if (
    lower.includes('navegac') ||
    lower.includes('navbar') ||
    lower.includes('sidebar') ||
    lower.includes('menu') ||
    lower.includes('coherencia') ||
    lower.includes('ruta')
  ) {
    return {
      files: [
        'src/app/components/layout/SovereignNavbar.tsx',
        'src/app/(admin)/admin/layout.tsx',
        'src/components/fincas/FincasB2BPortal.tsx'
      ],
      macro:
        'ARMONIZACIÓN CANÓNICA DE NAVEGACIÓN: 1) Alinear rutas públicas en SovereignNavbar.tsx con los destinos canónicos (/fincas, /reservar/solista, /simulacion-mariachis, /vimume, /alianzas, /admin). 2) Sincronizar el sidebar de AdminLayout con los módulos oficiales. 3) Añadir conmutador bidireccional entre la web pública y el panel Admin.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 0.1. Unificación Cromática & Paleta OLED S-Class
  if (
    lower.includes('color') ||
    lower.includes('paleta') ||
    lower.includes('oled') ||
    lower.includes('estilo') ||
    lower.includes('diseño') ||
    lower.includes('dorado') ||
    lower.includes('oro')
  ) {
    return {
      files: [
        'src/app/globals.css',
        'tailwind.config.cjs',
        'src/app/components/layout/SovereignNavbar.tsx',
        'src/app/(admin)/admin/layout.tsx'
      ],
      macro:
        'UNIFICACIÓN CROMÁTICA S-CLASS: 1) Estandarizar fondos OLED profundos (#030305, #050507). 2) Fijar acentos canónicos: Oro (#ecb613) para Admin y Comercial, Rubí (#FF2B44) para Bodas y Acción, y Cyan (#00E5FF) para Ciencia/VIMUME. 3) Eliminar grises lavados y gradientes violeta/azul AI-slop.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 1. Auditorías forenses, caza de errores, bit a bit, revisión de código
  if (
    lower.includes('forense') ||
    lower.includes('auditor') ||
    lower.includes('error') ||
    lower.includes('revision') ||
    lower.includes('bit a bit') ||
    lower.includes('yolo')
  ) {
    return {
      files: [
        'scripts/forensic_audit_mvp.cjs',
        'src/app/(admin)/admin/call-center/page.tsx',
        'src/app/fincas/FincasNationalCatalogClient.tsx',
        'src/app/api/profiles/search/route.ts'
      ],
      macro:
        'AUDITORÍA FORENSE BIT-A-BIT: 1) Ejecutar node scripts/forensic_audit_mvp.cjs && npx tsc --noEmit. 2) Si el script reporta incidencias, abrir ÚNICAMENTE las líneas reportadas y corregir con replace_in_file con diff mínimo. 3) Verificar que no existan teléfonos inventados ni enlaces muertos. // ignore-audit',
      validation: 'node scripts/forensic_audit_mvp.cjs && npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 2. Call Center Outbound & Leads
  if (
    lower.includes('call center') ||
    lower.includes('llamada') ||
    lower.includes('centralita') ||
    lower.includes('telef') ||
    lower.includes('outbound')
  ) {
    return {
      files: [
        'src/app/(admin)/admin/call-center/page.tsx',
        'src/app/api/profiles/search/route.ts'
      ],
      macro:
        'SANEAMIENTO CALL CENTER: Garantizar que la búsqueda provincial devuelva teléfonos directos verificados o enlaces de 1 clic a Google Search y ficha Bodas.net. Cero bucles con la centralita corporativa.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 3. Fincas B2B & Catálogo Nacional
  if (
    lower.includes('finca') ||
    lower.includes('espacio') ||
    lower.includes('b2b') ||
    lower.includes('homologac')
  ) {
    return {
      files: [
        'src/app/fincas/page.tsx',
        'src/app/fincas/FincasNationalCatalogClient.tsx',
        'src/components/fincas/FincasB2BPortal.tsx',
        'src/lib/constants/fincas-catalog.ts'
      ],
      macro:
        'PORTAL FINCAS S-CLASS: Conectar directorio nacional de 9.559 fincas reales vía /api/profiles/search?category=finca. Mantener tarjetas Bento, modal de detalle y filtrado por provincias.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 4. Solista Insignia (Edwin Agudelo) & Cotizador
  if (
    lower.includes('solista') ||
    lower.includes('edwin') ||
    lower.includes('cotiz') ||
    lower.includes('reservar')
  ) {
    return {
      files: [
        'src/app/reservar/solista/page.tsx',
        'src/components/widgets/BookingCalculator.tsx'
      ],
      macro:
        'COTIZADOR S-CLASS: Fijar Tarifa Base Solista (350€), logística Méntrida 1.50€/km >50km (+120€ hotel si fin >= 3am o distancia > 200km) y pasarela Stripe con Price-Lock de 100€.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 5. Mariachis Tradicionales
  if (
    lower.includes('mariachi') ||
    lower.includes('trio') ||
    lower.includes('charro') ||
    lower.includes('serenata')
  ) {
    return {
      files: [
        'src/app/(public)/simulacion-mariachis/page.tsx',
        'src/lib/pricing/mariachi-packs.ts'
      ],
      macro:
        'PACKS MARIACHI: Trío 450€ / Quinteto 750€ / Monumental 1300€ con depósito de señal de 100€ en Stripe y rider Bose S1 Pro / F1.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 6. VIMUME & Senior Care & Licitaciones B2G
  if (
    lower.includes('vimume') ||
    lower.includes('senior') ||
    lower.includes('residencia') ||
    lower.includes('geriat') ||
    lower.includes('licitac') ||
    lower.includes('b2g') ||
    lower.includes('pliego')
  ) {
    return {
      files: [
        'src/app/vimume/page.tsx',
        'src/app/(admin)/admin/licitaciones/page.tsx',
        'src/lib/vimume/b2g-tender-engine.ts'
      ],
      macro:
        'NEURO-MUSICOTERAPIA VIMUME: Protocolo 40 Hz Gamma para mayores con deterioro cognitivo. Dossiers B2G ajustados al Art. 118 LCSP (< 14.250€) con garantía acústica < 75 dB SPL.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 7. Flota & Logística Méntrida
  if (
    lower.includes('flota') ||
    lower.includes('mentrida') ||
    lower.includes('furgoneta') ||
    lower.includes('distancia') ||
    lower.includes('porte')
  ) {
    return {
      files: [
        'src/app/(admin)/admin/flota/page.tsx',
        'src/lib/geo/mentrida-distance.ts'
      ],
      macro:
        'LOGÍSTICA MÉNTRIDA KM 0: Cálculo geodésico de portes (1.50€/km tras km 50). Telemetría de vehículos Mercedes Vito y equipos acústicos Bose.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 8. Afiliados & Split Soberano
  if (
    lower.includes('afiliad') ||
    lower.includes('alianza') ||
    lower.includes('comision') ||
    lower.includes('split') ||
    lower.includes('partner')
  ) {
    return {
      files: [
        'src/app/(admin)/admin/afiliados/page.tsx',
        'src/data/affiliates/partners_ledger.json'
      ],
      macro:
        'SPLIT SOBERANO 80/10/10: Retribución directa (80% Artista, 10% Finca/Partner, 10% EAR OS). Liquidaciones con certificado criptográfico SHA-256.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 9. Stripe & Tesorería
  if (
    lower.includes('stripe') ||
    lower.includes('pago') ||
    lower.includes('tarjeta') ||
    lower.includes('webhook') ||
    lower.includes('tesoreria')
  ) {
    return {
      files: [
        'src/app/api/stripe/webhook/route.ts',
        'src/app/(admin)/admin/sourcing/components/BudgetMatrix.tsx'
      ],
      macro:
        'SEGURIDAD DE TESORERÍA: Verificación de firma criptográfica en Stripe Webhook. Registro de depósitos inmutables de 100€ con Price-Lock de 72h.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 10. Voice Studio & Música IA
  if (
    lower.includes('voice') ||
    lower.includes('voto') ||
    lower.includes('cancion') ||
    lower.includes('audio') ||
    lower.includes('clon')
  ) {
    return {
      files: [
        'src/app/(admin)/voice-studio/page.tsx',
        'src/lib/audio/voiceStudioEngine.ts'
      ],
      macro:
        'VOICE STUDIO S-CLASS: Composición musical personalizada para votos de boda y canciones de homenaje con síntesis de audio WAV y perfil lírico de Edwin Agudelo.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 11. Oráculo S-Class Ambient
  if (
    lower.includes('oraculo') ||
    lower.includes('ambient') ||
    lower.includes('chat') ||
    lower.includes('gpu')
  ) {
    return {
      files: [
        'src/app/api/oracle/chat/route.ts',
        'src/components/admin/OracleAmbientInterface.tsx'
      ],
      macro:
        'ORÁCULO BARE-METAL: Conexión por streaming SSE a Ollama local (127.0.0.1:11434). Inyección estricta del system prompt SSOT y telemetría de hardware.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // Fallback Inteligente Basado en Componentes Existentes (Cero Fakes)
  return {
    files: [
      'src/app/(admin)/admin/page.tsx',
      'src/app/(admin)/admin/command-center/page.tsx'
    ],
    macro: `Construir integración Full-Stack para: ${cleanInput}. Respetar arquitectura S-Class OLED (#030305, oro #ecb613), Next.js App Router (params async) y validación de tipos estricta.`,
    validation: 'npx tsc --noEmit -> Exit Code 0'
  };
}

/**
 * 🧠 RAZONAMIENTO PROFUNDO VÍA OLLAMA GPU BARE-METAL (RX 7900 XTX)
 * Usa el motor GPU compartido con num_gpu=999 (todas las capas a VRAM).
 * El timeout es amplio porque la carga en frío del 27B/32B tarda 15-40s.
 */
async function queryOllamaArchitect(
  cleanInput: string,
  model: GpuModelId | string
): Promise<OllamaArchitectResult | null> {
  const controller = new AbortController();
  const profile = resolveGpuModel(model);
  // Presupuesto de tiempo: carga VRAM (hasta ~40s) + inferencia. Tope de seguridad 75s.
  const timeoutId = setTimeout(() => controller.abort(), 75000);

  const prompt = `Eres el Arquitecto de Software de EAR OS (Next.js 15 App Router, TypeScript estricto).
Dado el requerimiento del usuario, selecciona los ARCHIVOS REALES del proyecto a tocar y el macro-script de ejecución quirúrgico.
Responde ÚNICAMENTE un JSON con esta estructura exacta:
{
  "files": ["ruta/del/archivo1.tsx", "ruta/del/archivo2.ts"],
  "macro": "Instrucción técnica y quirúrgica paso a paso para el ejecutor local...",
  "validation": "npx tsc --noEmit -> Exit Code 0"
}
Requerimiento: "${cleanInput}"`;

  try {
    const result = await runGpuChat({
      model: profile.id,
      prompt,
      json: true,
      temperature: 0.1,
      keepAlive: '30m',
      numPredict: 900,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const parsed = extractJsonObject<{
      files?: unknown;
      macro?: unknown;
      validation?: unknown;
    }>(result.content);

    if (
      parsed &&
      Array.isArray(parsed.files) &&
      parsed.files.length > 0 &&
      parsed.files.every((f): f is string => typeof f === 'string') &&
      typeof parsed.macro === 'string'
    ) {
      return {
        files: parsed.files,
        macro: parsed.macro,
        validation:
          typeof parsed.validation === 'string'
            ? parsed.validation
            : 'npx tsc --noEmit -> Exit Code 0',
        model: profile.id
      };
    }
    return null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

export async function compileIntentToDAG(
  input: string,
  options: CompileOptions = { mode: 'OMEGA_FULLSTACK', engine: 'OLLAMA' }
): Promise<CompiledDAGResult> {
  const cleanInput = input.trim();
  const targetMode: CompileOptions['mode'] =
    options.mode === 'QUIRURGICO'
      ? 'SURGICAL'
      : options.mode === 'OMEGA_FULLSTACK'
        ? 'FULL_STACK'
        : options.mode;
  const engine: CompileEngine = options.engine ?? 'OLLAMA';
  const slug =
    cleanInput
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 32) || 'omega-task';

  const taskId = 'omega-' + slug + '-' + Date.now().toString().slice(-4);

  // 1. Intentar razonamiento profundo con la GPU local (27B/32B) si está activa
  let reasoningEngineUsed = 'SCLASS_AST_CLASSIFIER_INSTANT';
  let resolved: SemanticResolution = resolveSemanticFiles(cleanInput);
  const selectedModel: GpuModelId | string = options.model ?? DEFAULT_GPU_MODEL;

  if (engine === 'OLLAMA' && options.skipOllamaArchitect !== true) {
    const ollamaResult = await queryOllamaArchitect(cleanInput, selectedModel);
    if (ollamaResult) {
      resolved = {
        files: ollamaResult.files,
        macro: ollamaResult.macro,
        validation: ollamaResult.validation
      };
      reasoningEngineUsed = 'OLLAMA_GPU_RX7900XTX (' + ollamaResult.model + ')';
    }
  }

  // ── GUÍA MAESTRA (obligatoria y trazable, no decorativa) ───────────────────
  // Prioridad: eje declarado por el cliente → deducido del texto → defecto.
  // Se resuelve AQUÍ para que el grafo dependa de la táctica incluso cuando el
  // cliente solo envíe `intent` con las etiquetas `[OBJETIVO]` / `[TÁCTICA
  // VELOCITY]` / `[DESTINATARIO]` (payload antiguo de la pantalla).
  const guide = resolveMasterGuide(
    {
      objective: options.objective ?? null,
      tactic: options.tactic ?? null,
      targetAgent: options.targetAgent ?? null,
      domain: options.domain ?? null,
      stakeholder: options.stakeholder ?? null,
    },
    options.sourceIntent ?? cleanInput,
  );
  /** Orden humana original, en una línea: es la que se publica en la cola. */
  const sourceIntent = (options.sourceIntent ?? cleanInput).replace(/\s+/g, ' ').trim();

  const suggestedFiles = resolved.files;
  const baseMacro =
    options.masterPromptOverride && options.masterPromptOverride.trim()
      ? options.masterPromptOverride.trim()
      : targetMode === 'SURGICAL'
        ? `Edición atómica en ${suggestedFiles[0]}: ${resolved.macro} Validar con ${resolved.validation}.`
        : resolved.macro;

  // La táctica deja de ser decorativa: sus directivas entran en el macro-script.
  // Se acota al tamaño que acepta el contrato de la cola (`MAX_SCAFFOLD_LEN`).
  const macroScript = clampMultiline(
    `${baseMacro}

GUÍA MAESTRA S-CLASS — DIRECTIVAS NO NEGOCIABLES (${guide.objective.id} · ${guide.tactic.id} · ${guide.targetAgent.id})
${renderGuideDirectives(guide)}`,
    7800,
  );

  const governanceChecks: string[] = [
    `Split Soberano ${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(SPLIT_SOBERANO.earOs * 100)}/${Math.round(SPLIT_SOBERANO.vimume * 100)} inmutable (SSOT + SHA-256)`,
    `Depósito ${DEPOSITO_STRIPE_EUR.toFixed(2)} EUR Stripe Price-Lock, 100% deducible del total`,
    `Logística ${LOGISTICA_EUR_PER_KM.toFixed(2)} EUR/km desde el km ${LOGISTICA_KM_EXENTOS} + hotel ${SUPLEMENTO_HOTEL_EUR.toFixed(0)} EUR si hora fin >= ${HORA_FIN_HOTEL}:00 o distancia > ${LOGISTICA_KM_HOTEL} km`,
    `Techo B2G ${SAFE_LCSP_CEILING_EUR.toFixed(2)} EUR (art. 118 LCSP, ajuste preventivo)`,
    `Rider acústico ${WATTS_PER_PAX} W/pax y límite ${LIMITE_SPL_DB} dB SPL (Ley 37/2003)`,
    'Next.js App Router: Server Components por defecto',
    'Build < 60 s · repo < 50 MB · partición edge < 1 MB',
    'Despliegue exclusivo Coolify en servidor propio: Vercel y Netlify erradicados (CHG-4)',
    'typecheck y lint con Exit Code 0 · 0 any implícito · 0 clics muertos'
  ];

  const priceMatches: string[] = [];
  const prices = cleanInput.match(/\d+([.,]\d+)?\s*€/g);
  if (prices) {
    prices.forEach((p) => priceMatches.push(p));
  } else {
    priceMatches.push('350,00 EUR (Base Solista)');
  }

  const intentHead = clampSingleLine(sourceIntent, 55);
  const title = `B0.Omega: ${intentHead}${sourceIntent.length > 55 ? '...' : ''}`;

  // `description`, `action`, `scaffold` y `done_when` viajan a
  // `/api/admin/tasks/inject`, que valida con Zod contra `MAX_ACTION_LEN = 2000`,
  // `MAX_SCAFFOLD_LEN = 8000`, `MAX_VALIDATION_LEN = 500` y `MAX_DONE_WHEN_LEN = 500`
  // (`src/app/api/admin/tasks/inject/route.ts:83-91`). Con el forjador activo la
  // entrada es el prompt maestro completo (miles de caracteres): sin acotar, el
  // inyector rechaza la tarea y la cola del orquestador nunca la ve.
  const jsonTask: CompiledDAGResult['jsonTask'] = {
    id: taskId,
    title,
    status: 'QUEUED',
    description: clampSingleLine(sourceIntent, 1900),
    files: suggestedFiles,
    action: clampSingleLine(sourceIntent, 1800),
    scaffold: macroScript,
    done_when: clampSingleLine(resolved.validation, 480),
    validation: clampSingleLine(resolved.validation, 480)
  };

  const filesYaml = suggestedFiles.map((f) => '    - "' + f + '"').join('\n');
  const govYaml = governanceChecks.map((g) => '    - "' + g + '"').join('\n');
  const ssotYaml = SSOT_BUSINESS_RULES.map((r) => '    - "' + r + '"').join('\n');

  const guideYaml = guide.directives
    .map((directive) => '    - "' + directive.replace(/"/g, '\\"') + '"')
    .join('\n');

  const yaml = [
    '# ==============================================================================#',
    '# PROTOCOLO: SCLASS_SOVEREIGN_INGEST_v10.0 [COMPILADOR MAESTRO DE INTENCIÓN]',
    '# ORIGEN: ANTIGRAVITY OMEGA v10.0',
    '# INTENT_ORIGIN: "' + clampSingleLine(sourceIntent, 400).replace(/"/g, '\\"') + '"',
    '# TIMESTAMP_UTC: "' + new Date().toISOString() + '"',
    '# EXECUTION_ENGINE: ' + engine + ' (' + reasoningEngineUsed + ')',
    '# ==============================================================================#',
    '',
    'TASK_ID: "' + taskId + '"',
    'TARGET_MODE: ' + options.mode,
    'GUIA_OBJETIVO: "' + guide.objective.id + '"',
    'GUIA_TACTICA: "' + guide.tactic.id + '"',
    'GUIA_DESTINATARIO: "' + guide.targetAgent.id + '"',
    'GUIA_ORIGEN: "' + guide.sources.objective + '/' + guide.sources.tactic + '/' + guide.sources.targetAgent + '"',
    'GUIA_DIRECTIVAS:',
    guideYaml,
    '',
    'PASS_CRITERIA: "' + clampSingleLine(resolved.validation, 480).replace(/"/g, '\\"') + '"',
    '',
    'DIRECTIVES:',
    '  FILES_TO_TOUCH:',
    filesYaml,
    '',
    '  SSOT_BUSINESS_RULES:',
    ssotYaml,
    '',
    '  GOVERNANCE_CONSTRAINTS:',
    govYaml,
    '',
    '  MACRO_SCRIPT: |',
    '    ' + macroScript.replace(/\n/g, '\n    '),
    '',
    'EXECUTION_CHAIN:',
    '  - STEP_1: "INSPECT_AST_AND_CONTRACTS"',
    '  - STEP_2: "APPLY_SCAFFOLD_EDITS"',
    '  - STEP_3: "RUN_TSC_VALIDATION"',
    '  - STEP_4: "ASSERT_EXIT_CODE_ZERO"'
  ].join('\n');

  const estimatedTokens = Math.round(yaml.length / 4);

  return {
    yaml,
    engine,
    protocol: 'SCLASS_SOVEREIGN_INGEST_v10.0',
    jsonTask,
    estimatedTokens,
    extractedEntities: {
      suggestedFiles,
      priceMatches,
      governanceChecks,
      reasoningEngineUsed
    },
    guide: {
      objective: guide.objective.id,
      tactic: guide.tactic.id,
      targetAgent: guide.targetAgent.id,
      directiveCount: guide.directives.length,
      source: guide.sources
    }
  };
}