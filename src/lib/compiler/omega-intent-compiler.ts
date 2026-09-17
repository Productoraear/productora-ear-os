export type CompileMode = 'QUIRURGICO' | 'OMEGA_FULLSTACK';
export type CompileEngine = 'OLLAMA' | 'CLOUD';

export const SSOT_BUSINESS_RULES: readonly string[] = [
  'TarifaBaseSolista(EdwinAgudelo):350,00EUR',
  'Logistica:1,50EUR/km desde Mentrida a partir del km50',
  'Hotel:+120EUR si horaFin>=3:00AM o distancia>200km',
  'SplitSoberano:80%Artista/10%EAROS/10%VIMUME',
  'Cierre:Deposito100,00EUR Stripe Price-Lock SHA-256 (24h-72h)',
  'RiderAcustico:12W/pax Bose F1 812/S1 Pro Shure Beta 87A',
  'LimiteB2G Art.118 LCSP: <15.000EUR (Ajuste95%=14.250EUR) y <75dB SPL'
];

export interface CompileOptions {
  mode: CompileMode | 'SURGICAL' | 'FULL_STACK' | 'ARCHIVAL_SWEEP';
  engine?: CompileEngine;
  targetEngine?: 'LOCAL_OLLAMA' | 'CLOUD_EDGE';
  autoInjectQueue?: boolean;
}

export interface CompiledDAGResult {
  yaml: string;
  engine: CompileEngine;
  protocol: string;
  jsonTask: {
    id: string;
    title: string;
    block: number;
    status: 'PENDING';
    description: string;
    scaffold: {
      files_to_touch: string[];
      macro_script: string;
    };
    validation: string;
  };
  estimatedTokens: number;
  extractedEntities: {
    suggestedFiles: string[];
    priceMatches: string[];
    governanceChecks: string[];
    reasoningEngineUsed?: string;
  };
}

/**
 * 🏛️ KNOWLEDGE GRAPH ESTÁTICO DE EAR OS (Zero-Cold-Start)
 * Mapeo semántico de dominios a archivos reales y scripts verificadores.
 */
function resolveSemanticFiles(cleanInput: string): { files: string[]; macro: string; validation: string } {
  const lower = cleanInput.toLowerCase();

  // 0. Coherencia de Navegación, Navbars, Sidebars y Menús
  if (lower.includes('navegac') || lower.includes('navbar') || lower.includes('sidebar') || lower.includes('menu') || lower.includes('coherencia') || lower.includes('ruta')) {
    return {
      files: [
        'src/app/components/layout/SovereignNavbar.tsx',
        'src/app/(admin)/admin/layout.tsx',
        'src/components/fincas/FincasB2BPortal.tsx'
      ],
      macro: 'ARMONIZACIÓN CANÓNICA DE NAVEGACIÓN: 1) Alinear rutas públicas en SovereignNavbar.tsx con los destinos canónicos (/fincas, /reservar/solista, /simulacion-mariachis, /vimume, /alianzas, /admin). 2) Sincronizar el sidebar de AdminLayout con los módulos oficiales. 3) Añadir conmutador bidireccional entre la web pública y el panel Admin.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 1. Auditorías forenses, caza de errores, bit a bit, revisión de código
  if (lower.includes('forense') || lower.includes('auditor') || lower.includes('error') || lower.includes('revision') || lower.includes('bit a bit') || lower.includes('yolo')) {
    return {
      files: [
        'scripts/forensic_audit_mvp.cjs',
        'src/app/(admin)/admin/call-center/page.tsx',
        'src/app/fincas/FincasNationalCatalogClient.tsx',
        'src/app/api/profiles/search/route.ts'
      ],
      macro: 'AUDITORÍA FORENSE BIT-A-BIT: 1) Ejecutar node scripts/forensic_audit_mvp.cjs && npx tsc --noEmit. 2) Si el script reporta incidencias, abrir ÚNICAMENTE las líneas reportadas y corregir con replace_in_file con diff mínimo. 3) Verificar que no existan teléfonos inventados ni enlaces muertos. // ignore-audit',
      validation: 'node scripts/forensic_audit_mvp.cjs && npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 2. Call Center Outbound & Leads
  if (lower.includes('call center') || lower.includes('llamada') || lower.includes('centralita') || lower.includes('telef') || lower.includes('outbound')) {
    return {
      files: [
        'src/app/(admin)/admin/call-center/page.tsx',
        'src/app/api/profiles/search/route.ts'
      ],
      macro: 'SANEAMIENTO CALL CENTER: Garantizar que la búsqueda provincial devuelva teléfonos directos verificados o enlaces de 1 clic a Google Search y ficha Bodas.net. Cero bucles con la centralita corporativa.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 3. Fincas B2B & Catálogo Nacional
  if (lower.includes('finca') || lower.includes('espacio') || lower.includes('b2b') || lower.includes('homologac')) {
    return {
      files: [
        'src/app/fincas/page.tsx',
        'src/app/fincas/FincasNationalCatalogClient.tsx',
        'src/components/fincas/FincasB2BPortal.tsx',
        'src/lib/constants/fincas-catalog.ts'
      ],
      macro: 'PORTAL FINCAS S-CLASS: Conectar directorio nacional de 9.559 fincas reales vía /api/profiles/search?category=finca. Mantener tarjetas Bento, modal de detalle y filtrado por provincias.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 4. Solista Insignia (Edwin Agudelo) & Cotizador
  if (lower.includes('solista') || lower.includes('edwin') || lower.includes('cotiz') || lower.includes('reservar')) {
    return {
      files: [
        'src/app/reservar/solista/page.tsx',
        'src/components/widgets/BookingCalculator.tsx'
      ],
      macro: 'COTIZADOR S-CLASS: Fijar Tarifa Base Solista (350€), logística Méntrida 1.50€/km >50km (+120€ hotel si fin >= 3am o distancia > 200km) y pasarela Stripe con Price-Lock de 100€.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 5. Mariachis Tradicionales
  if (lower.includes('mariachi') || lower.includes('trio') || lower.includes('charro') || lower.includes('serenata')) {
    return {
      files: [
        'src/app/(public)/simulacion-mariachis/page.tsx',
        'src/lib/pricing/mariachi-packs.ts'
      ],
      macro: 'PACKS MARIACHI: Trío 450€ / Quinteto 750€ / Monumental 1300€ con depósito de señal de 100€ en Stripe y rider Bose S1 Pro / F1.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 6. VIMUME & Senior Care & Licitaciones B2G
  if (lower.includes('vimume') || lower.includes('senior') || lower.includes('residencia') || lower.includes('geriat') || lower.includes('licitac') || lower.includes('b2g') || lower.includes('pliego')) {
    return {
      files: [
        'src/app/vimume/page.tsx',
        'src/app/(admin)/admin/licitaciones/page.tsx',
        'src/lib/vimume/b2g-tender-engine.ts'
      ],
      macro: 'NEURO-MUSICOTERAPIA VIMUME: Protocolo 40 Hz Gamma para mayores con deterioro cognitivo. Dossiers B2G ajustados al Art. 118 LCSP (< 14.250€) con garantía acústica < 75 dB SPL.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 7. Flota & Logística Méntrida
  if (lower.includes('flota') || lower.includes('mentrida') || lower.includes('furgoneta') || lower.includes('distancia') || lower.includes('porte')) {
    return {
      files: [
        'src/app/(admin)/admin/flota/page.tsx',
        'src/lib/geo/mentrida-distance.ts'
      ],
      macro: 'LOGÍSTICA MÉNTRIDA KM 0: Cálculo geodésico de portes (1.50€/km tras km 50). Telemetría de vehículos Mercedes Vito y equipos acústicos Bose.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 8. Afiliados & Split Soberano
  if (lower.includes('afiliad') || lower.includes('alianza') || lower.includes('comision') || lower.includes('split') || lower.includes('partner')) {
    return {
      files: [
        'src/app/(admin)/admin/afiliados/page.tsx',
        'src/data/affiliates/partners_ledger.json'
      ],
      macro: 'SPLIT SOBERANO 80/10/10: Retribución directa (80% Artista, 10% Finca/Partner, 10% EAR OS). Liquidaciones con certificado criptográfico SHA-256.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 9. Stripe & Tesorería
  if (lower.includes('stripe') || lower.includes('pago') || lower.includes('tarjeta') || lower.includes('webhook') || lower.includes('tesoreria')) {
    return {
      files: [
        'src/app/api/stripe/webhook/route.ts',
        'src/app/(admin)/admin/sourcing/components/BudgetMatrix.tsx'
      ],
      macro: 'SEGURIDAD DE TESORERÍA: Verificación de firma criptográfica en Stripe Webhook. Registro de depósitos inmutables de 100€ con Price-Lock de 72h.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 10. Voice Studio & Música IA
  if (lower.includes('voice') || lower.includes('voto') || lower.includes('cancion') || lower.includes('audio') || lower.includes('clon')) {
    return {
      files: [
        'src/app/(admin)/voice-studio/page.tsx',
        'src/lib/audio/voiceStudioEngine.ts'
      ],
      macro: 'VOICE STUDIO S-CLASS: Composición musical personalizada para votos de boda y canciones de homenaje con síntesis de audio WAV y perfil lírico de Edwin Agudelo.',
      validation: 'npx tsc --noEmit -> Exit Code 0'
    };
  }

  // 11. Oráculo S-Class Ambient
  if (lower.includes('oraculo') || lower.includes('ambient') || lower.includes('chat') || lower.includes('gpu')) {
    return {
      files: [
        'src/app/api/oracle/chat/route.ts',
        'src/components/admin/OracleAmbientInterface.tsx'
      ],
      macro: 'ORÁCULO BARE-METAL: Conexión por streaming SSE a Ollama local (127.0.0.1:11434). Inyección estricta del system prompt SSOT y telemetría de hardware.',
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
 * 🧠 INTENTO DE RAZONAMIENTO PROFUNDO VÍA OLLAMA GPU BARE-METAL
 */
async function queryOllamaArchitect(cleanInput: string): Promise<{ files: string[]; macro: string; validation: string } | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout max

  try {
    const prompt = `Eres el Arquitecto de Software de EAR OS (Next.js 15, TypeScript).
Dado el requerimiento del usuario, selecciona los ARCHIVOS REALES del proyecto a tocar y el macro-script de ejecución.
Responde ÚNICAMENTE un JSON con esta estructura exacta:
{
  "files": ["ruta/del/archivo1.tsx", "ruta/del/archivo2.ts"],
  "macro": "Instrucción técnica y quirúrgica para Cline...",
  "validation": "npx tsc --noEmit -> Exit Code 0"
}
Requerimiento: "${cleanInput}"`;

    const res = await fetch('http://127.0.0.1:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'ear-27b-flow:latest',
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        options: { temperature: 0.1, num_predict: 250 }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    if (!res.ok) return null;

    const data = await res.json();
    const rawText = data.message?.content || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed.files) && parsed.files.length > 0 && typeof parsed.macro === 'string') {
        return {
          files: parsed.files,
          macro: parsed.macro,
          validation: parsed.validation || 'npx tsc --noEmit -> Exit Code 0'
        };
      }
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
  const targetMode = options.mode === 'QUIRURGICO' ? 'SURGICAL' : options.mode === 'OMEGA_FULLSTACK' ? 'FULL_STACK' : options.mode;
  const engine: CompileEngine = options.engine ?? 'OLLAMA';
  const slug = cleanInput
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 32) || 'omega-task';

  const taskId = 'omega-' + slug + '-' + Date.now().toString().slice(-4);

  // 1. Intentar razonamiento profundo con Ollama si está activo
  let reasoningEngineUsed = 'SCLASS_AST_CLASSIFIER_INSTANT';
  let resolved = resolveSemanticFiles(cleanInput);

  if (engine === 'OLLAMA') {
    const ollamaResult = await queryOllamaArchitect(cleanInput);
    if (ollamaResult) {
      resolved = ollamaResult;
      reasoningEngineUsed = 'OLLAMA_GPU_RX7900XTX (ear-27b-flow)';
    }
  }

  const suggestedFiles = resolved.files;
  const macroScript = targetMode === 'SURGICAL'
    ? `Edición atómica en ${suggestedFiles[0]}: ${resolved.macro} Validar con ${resolved.validation}.`
    : resolved.macro;

  const governanceChecks: string[] = [
    'Split 80/10/10 Inmutable',
    'Deposito 100 EUR Stripe Price-Lock',
    'Mentrida Km 0 (1.50 EUR/km tras 50km)',
    'Next.js Server Components por defecto',
    'Build Netlify ultra-ligero menor a 80 MB'
  ];

  const priceMatches: string[] = [];
  const prices = cleanInput.match(/\d+([.,]\d+)?\s*€/g);
  if (prices) {
    prices.forEach(p => priceMatches.push(p));
  } else {
    priceMatches.push('350,00 EUR (Base Solista)');
  }

  const title = 'B0.Omega: ' + cleanInput.slice(0, 55) + (cleanInput.length > 55 ? '...' : '');

  const jsonTask = {
    id: taskId,
    title,
    block: 0,
    status: 'PENDING' as const,
    description: cleanInput,
    scaffold: {
      files_to_touch: suggestedFiles,
      macro_script: macroScript
    },
    validation: resolved.validation
  };

  const filesYaml = suggestedFiles.map(f => '    - "' + f + '"').join('\n');
  const govYaml = governanceChecks.map(g => '    - "' + g + '"').join('\n');
  const ssotYaml = SSOT_BUSINESS_RULES.map(r => '    - "' + r + '"').join('\n');

  const yaml = [
    '# ==============================================================================#',
    '# PROTOCOL: SCLASS_SOVEREIGN_INGEST_v7.0 [META-COMPILADOR DAG VIBE-CODING]',
    '# ORIGEN: ANTIGRAVITY OMEGA v7.0',
    '# INTENT_ORIGIN: "' + cleanInput.replace(/"/g, '\\"') + '"',
    '# TIMESTAMP_UTC: "' + new Date().toISOString() + '"',
    '# EXECUTION_ENGINE: ' + engine + ' (' + reasoningEngineUsed + ')',
    '# ==============================================================================#',
    '',
    'TASK_ID: "' + taskId + '"',
    'TARGET_MODE: ' + options.mode,
    'PASS_CRITERIA: "' + resolved.validation + '"',
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
    protocol: 'SCLASS_SOVEREIGN_INGEST_v7.0',
    jsonTask,
    estimatedTokens,
    extractedEntities: {
      suggestedFiles,
      priceMatches,
      governanceChecks,
      reasoningEngineUsed
    }
  };
}