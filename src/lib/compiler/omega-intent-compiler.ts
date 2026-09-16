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
  };
}

export function compileIntentToDAG(input: string, options: CompileOptions = { mode: 'OMEGA_FULLSTACK', engine: 'OLLAMA' }): CompiledDAGResult {
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

  const suggestedFiles: string[] = [];
  const lower = cleanInput.toLowerCase();

  if (lower.includes('solista') || lower.includes('reservar') || lower.includes('edwin')) {
    suggestedFiles.push('src/app/reservar/solista/page.tsx');
  }
  if (lower.includes('mariachi') || lower.includes('trio')) {
    suggestedFiles.push('src/app/(public)/simulacion-mariachis/page.tsx');
    suggestedFiles.push('src/lib/pricing/mariachi-packs.ts');
  }
  if (lower.includes('admin') || lower.includes('panel') || lower.includes('control')) {
    suggestedFiles.push('src/app/(admin)/admin/page.tsx');
  }
  if (lower.includes('whatsapp') || lower.includes('mensaje') || lower.includes('chat')) {
    suggestedFiles.push('src/app/(admin)/admin/whatsapp/page.tsx');
    suggestedFiles.push('src/lib/whatsapp/whatsapp-dispatch.ts');
  }
  if (lower.includes('presupuesto') || lower.includes('budget') || lower.includes('matrix')) {
    suggestedFiles.push('src/app/(admin)/admin/sourcing/components/BudgetMatrix.tsx');
  }
  if (lower.includes('vimume') || lower.includes('reservar') || lower.includes('senior')) {
    suggestedFiles.push('src/app/(public)/vimume/page.tsx');
  }
  if (suggestedFiles.length === 0) {
    suggestedFiles.push('src/features/omega/components/OmegaComponent.tsx');
  }

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

  const macroScript = targetMode === 'SURGICAL'
    ? 'Edicion atomica en ' + suggestedFiles[0] + ': Implementar logica tipada estricta para: ' + cleanInput + '. Validar con npx tsc --noEmit.'
    : 'Construir flujo Full-Stack en ' + suggestedFiles.join(', ') + '. Integrar con arquitectura S-Class OLED (#030305, oro #ecb613). Asegurar params async en Next.js App Router y cero errores de TypeScript.';

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
    validation: 'npx tsc --noEmit -> Exit Code 0'
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
    '# EXECUTION_ENGINE: ' + engine,
    '# ==============================================================================#',
    '',
    'TASK_ID: "' + taskId + '"',
    'TARGET_MODE: ' + options.mode,
    'PASS_CRITERIA: "npx tsc --noEmit == 0"',
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
      governanceChecks
    }
  };
}