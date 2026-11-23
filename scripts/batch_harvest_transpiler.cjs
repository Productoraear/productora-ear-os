#!/usr/bin/env node
/**
 * BATCH HARVEST TRANSPILER — COSECHA DUAL (21st.dev · HorizonX PRO)
 * ============================================================================
 * Un solo motor, dos destinos:
 *
 *   --target=ui-harvest      scratch/harvest_inbox/ → src/components/ui/harvest/
 *                            (componentes de conversión pública)
 *   --target=admin-horizon   scratch/horizon_inbox/ → src/components/admin/horizon/
 *                            (pantallas y widgets de panel de control)
 *
 * QUÉ HACE (conversión, no tragaperras):
 *  1. Extrae el código de los envoltorios de la CLI de 21st (`<tsx>…</tsx>`, ```tsx…```).
 *  2. Normaliza a la paleta canónica Aura Onyx: fondos → `#030305`, superficies
 *     `#0c0d14`/`#11131e`, bordes → `border-white/10`, acentos → diamondRed.
 *  3. Erradica el morado (UNSLOP / INV-21).
 *  4. `use client` SOLO si el componente usa hooks, estado, refs o eventos
 *     (React 19 / Next 16 App Router: un `<Counter onClick>` de servidor no compila).
 *  5. Tipografía numérica `tabular-nums` en cronómetros (INV-18 / CLS).
 *  6. Marca telemetría simulada como `SIMULADO` (AF-2) si hay setInterval/setTimeout
 *     generadores de datos y no hay sonda real.
 *  7. Avisa de las invariantes del arnés que el material pueda romper:
 *     - registro de navegación paralelo  → audit:admin-ecosystem (regla C)
 *     - import de prisma / server-only   → INV-07 / SEC-3
 *     - import de dependencia externa    → INV-15 (presupuesto de bundle)
 *     - `page.tsx` en destino            → módulo huérfano (regla B)
 *
 * MODO POR DEFECTO = AUDITORÍA (no escribe nada). Para escribir: `--write`.
 * Un componente RECHAZADO nunca se escribe (SEC-1: primero el caso negativo).
 *
 * Uso:
 *   node scripts/batch_harvest_transpiler.cjs                      (audita ambos depósitos)
 *   node scripts/batch_harvest_transpiler.cjs --write               (transpila ambos)
 *   node scripts/batch_harvest_transpiler.cjs --target=ui-harvest --write
 *   node scripts/batch_harvest_transpiler.cjs --source=./mi/dir --target=admin-horizon --write
 *   node scripts/batch_harvest_transpiler.cjs --json                (salida máquina)
 *
 * Cero dependencias. Node >= 20. Windows-first (no usa rutas POSIX literales).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');

/* -------------------------------------------------------------------------- */
/*  DESTINOS                                                                   */
/* -------------------------------------------------------------------------- */

/** @typedef {{ id: string, source: string, target: string, label: string, preamble: string }} Target */

const TARGETS = [
  {
    id: 'ui-harvest',
    label: 'UI / Conversión pública (21st.dev)',
    source: path.join(ROOT, 'scratch', 'harvest_inbox'),
    target: path.join(ROOT, 'src', 'components', 'ui', 'harvest'),
    preamble:
      'Material saneado de conversión pública. Promocionar al Theme & Component Studio\n' +
      ' * antes de tocar una landing en producción (JUR-1). Paleta SSOT: src/lib/brand-palette.ts.',
  },
  {
    id: 'admin-horizon',
    label: 'Panel / Widgets de control (HorizonX PRO)',
    source: path.join(ROOT, 'scratch', 'horizon_inbox'),
    target: path.join(ROOT, 'src', 'components', 'admin', 'horizon'),
    preamble:
      'Widget de cockpit saneado. NUNCA page.tsx: las rutas /admin se registran en\n' +
      ' * src/lib/config/admin-navigation.ts (regla B de audit:admin-ecosystem).',
  },
];

/* -------------------------------------------------------------------------- */
/*  PALETA CANÓNICA (espejo literal de src/lib/brand-palette.ts)               */
/* -------------------------------------------------------------------------- */

const ONYX = {
  core: '#030305', // EAR_PALETTE.obsidian.core
  pure: '#000000',
  subtle: '#06070a',
  surface: '#0c0d14',
  card: '#11131e',
  borderClass: 'border-white/10',
  textPrimary: 'text-white',
  textMuted: 'text-neutral-400',
};

/** Hex de morado/violeta/índigo detectados en material de estudio. */
const PURPLE_HEX = [
  '#8b5cf6', '#7c3aed', '#a855f7', '#9333ea', '#c084fc', '#d8b4fe',
  '#6d28d9', '#4c1d95', '#5b21b6', '#7e22ce', '#a78bfa', '#818cf8',
  '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81', '#e879f9',
];

/** Colores oscuros que delatan un fondo de estudio (se convierten a Onyx). */
const DARK_BGS = [
  '#0a0a0a', '#0b0b0b', '#0d0d0d', '#0e0e0e', '#0f0f0f', '#111111', '#121212',
  '#18181b', '#18181a', '#1a1a1a', '#1e1e1e', '#111827', '#0f172a', '#020617',
  '#030712', '#09090b', '#0c0c0c', '#171717', '#1c1c1c', '#000000', '#000',
];

/** Prefijos Tailwind de acento morado → cardinalidad a erradicar. */
const PURPLE_UTILITIES = [
  'purple', 'violet', 'indigo', 'fuchsia',
];

/** Paquetes que SÍ pueden sobrevivir a la cosecha. */
const ALLOWED_IMPORT_PREFIXES = [
  'react', 'react-dom', 'next', 'next/', '@/lib/', '@/components/ui/',
  '@/components/admin/', '@/hooks/', '@/types', 'lucide-react',
];

/** Importaciones que abortan la escritura (INV-07 / SEC-3 / INV-15). */
const CRITICAL_IMPORTS = [
  { pattern: /\bfrom\s+['"]@prisma\/client['"]/, reason: 'INV-07/SEC-3 · prisma en componente cliente' },
  { pattern: /\bfrom\s+['"]server-only['"]/, reason: 'SEC-3 · server-only no sobrevive a la cosecha' },
  { pattern: /\brequire\(\s*['"]@prisma/, reason: 'INV-07 · require(prisma) en material crudo' },
];

/* -------------------------------------------------------------------------- */
/*  CLI                                                                        */
/* -------------------------------------------------------------------------- */

function parseArgs(argv) {
  const options = {
    write: false,
    json: false,
    target: null,
    source: null,
    quiet: false,
    help: false,
  };
  for (const arg of argv.slice(2)) {
    if (arg === '--write') options.write = true;
    else if (arg === '--json') options.json = true;
    else if (arg === '--quiet') options.quiet = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg.startsWith('--target=')) options.target = arg.slice('--target='.length).trim();
    else if (arg.startsWith('--source=')) options.source = arg.slice('--source='.length).trim();
    else {
      console.error(`[TRANSPILER] Argumento no reconocido: ${arg}`);
      process.exit(2);
    }
  }
  return options;
}

const HELP = `BATCH HARVEST TRANSPILER (cosecha dual)
  node scripts/batch_harvest_transpiler.cjs [--write] [--json] [--target=ui-harvest|admin-horizon]
                                            [--source=<dir>] [--quiet]

  Sin --write = AUDITORIA (no escribe nada).
  --target=ui-harvest     21st.dev        -> src/components/ui/harvest/
  --target=admin-horizon  HorizonX PRO    -> src/components/admin/horizon/
  --source=<dir>          sobrescribe el deposito de entrada de ese destino.
`;

/* -------------------------------------------------------------------------- */
/*  DESCUBRIMIENTO                                                             */
/* -------------------------------------------------------------------------- */

const SOURCE_EXT = new Set(['.tsx', '.jsx']);
const AUX_EXT = new Set(['.css', '.json', '.md']);

/**
 * Devuelve los ficheros de un depósito (recursivo, ignora dotfiles y
 * node_modules). No lanza si el directorio no existe: devuelve [].
 */
function discover(dir) {
  const acc = [];
  if (!fs.existsSync(dir)) return acc;
  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else acc.push(full);
    }
  }
  return acc.sort();
}

const rel = (file) => path.relative(ROOT, file).replace(/\\/g, '/');

/* -------------------------------------------------------------------------- */
/*  EXTRACCIÓN DEL CÓDIGO                                                      */
/* -------------------------------------------------------------------------- */

/**
 * La CLI de 21st.dev entrega el componente envuelto en `<tsx>…</tsx>` o en un
 * bloque ```tsx. Esta función devuelve SOLO el código interior.
 */
function extractCode(raw) {
  const text = String(raw).replace(/^\uFEFF/, '');

  const tagMatch = text.match(/<tsx>([\s\S]*?)<\/tsx>/i);
  if (tagMatch) return tagMatch[1].trim() + '\n';

  const fenceMatch = text.match(/```(?:tsx|jsx|typescript|javascript|ts|js)?\r?\n([\s\S]*?)```/i);
  if (fenceMatch) return fenceMatch[1].trim() + '\n';

  return text.trim() + '\n';
}

/** Nombre del componente: primero la declaración, luego el nombre del fichero. */
function detectComponentName(code, filePath) {
  const declared = code.match(
    /export\s+default\s+(?:function\s+)?([A-Z][A-Za-z0-9_]*)|export\s+(?:const|function)\s+([A-Z][A-Za-z0-9_]*)/,
  );
  if (declared) return declared[1] || declared[2];

  const base = path.basename(filePath, path.extname(filePath));
  const pascal = base
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return pascal || 'HarvestedComponent';
}

/** ¿El componente necesita la frontera cliente de React 19 / Next 16? */
function needsUseClient(code) {
  const withoutDirective = code.replace(/^\s*['"]use client['"];?\s*/m, '');
  const hookPattern =
    /\buse(State|Effect|LayoutEffect|Reducer|Ref|Memo|Callback|Context|Id|Optimistic|Transition|DeferredValue|SyncExternalStore|InsertionEffect|ActionState)\s*\(/;
  const eventPattern =
    /\bon(Click|Change|Submit|Input|KeyDown|KeyUp|Focus|Blur|MouseEnter|MouseLeave|MouseDown|MouseUp|Scroll|TouchStart|TouchEnd|PointerDown|PointerUp|Drag[A-Za-z]*|Drop)\s*[=:]/;
  const imperative = /\b(createContext|document\.|window\.|localStorage|sessionStorage|navigator\.)/;
  return (
    hookPattern.test(withoutDirective) ||
    eventPattern.test(withoutDirective) ||
    imperative.test(withoutDirective)
  );
}


/* -------------------------------------------------------------------------- */
/*  CONVERSIÓN DE PALETA → AURA ONYX                                           */
/* -------------------------------------------------------------------------- */

/** Escapa un literal para usarlo dentro de un RegExp. */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sustituye los hex morados por el acento canónico (diamondRed #E11D48).
 * Se aplica ANTES de la conversión de fondos para que ningún morado llegue a
 * la salida (INV-21 / UNSLOP).
 */
function neutralizePurpleHex(code, notes) {
  let out = code;
  for (const hex of PURPLE_HEX) {
    const re = new RegExp(escapeRegExp(hex), 'gi');
    if (re.test(out)) {
      out = out.replace(re, '#E11D48');
      notes.push(`acento morado ${hex} → #E11D48 (diamondRed)`);
    }
  }
  return out;
}

/**
 * Erradica las utilidades Tailwind moradas. `bg-purple-500/20` → `bg-ui-elevated`
 * sería una invención; aquí se degrada al token neutro equivalente:
 *  - fondos (`bg-*`)      → `bg-[#11131e]` (obsidian.card)
 *  - textos (`text-*`)    → `text-white` / `text-neutral-400`
 *  - bordes (`border-*`)  → `border-white/10`
 *  - anillos/sombras      → `shadow-black/40`
 */
function neutralizePurpleUtilities(code, notes) {
  const family = `(?:${PURPLE_UTILITIES.join('|')})`;
  const shade = '(?:-\\d{2,3})?(?:\\/\\d{1,3})?';
  let out = code;

  const rules = [
    { re: new RegExp(`\\bbg-${family}${shade}\\b`, 'g'), to: 'bg-[#11131e]', tag: 'bg morado → obsidian.card' },
    { re: new RegExp(`\\bfrom-${family}${shade}\\b`, 'g'), to: 'from-[#E11D48]', tag: 'gradiente morado → diamondRed' },
    { re: new RegExp(`\\bvia-${family}${shade}\\b`, 'g'), to: 'via-[#9F1239]', tag: 'gradiente morado → diamondRed.deep' },
    { re: new RegExp(`\\bto-${family}${shade}\\b`, 'g'), to: 'to-[#030305]', tag: 'gradiente morado → obsidian.core' },
    { re: new RegExp(`\\btext-${family}${shade}\\b`, 'g'), to: 'text-neutral-400', tag: 'texto morado → neutral-400' },
    { re: new RegExp(`\\bborder-${family}${shade}\\b`, 'g'), to: 'border-white/10', tag: 'borde morado → border-white/10' },
    { re: new RegExp(`\\bring-${family}${shade}\\b`, 'g'), to: 'ring-white/10', tag: 'anillo morado → ring-white/10' },
    { re: new RegExp(`\\bshadow-${family}${shade}\\b`, 'g'), to: 'shadow-black/40', tag: 'sombra morada → shadow-black/40' },
    { re: new RegExp(`\\bdivide-${family}${shade}\\b`, 'g'), to: 'divide-white/10', tag: 'divisor morado → divide-white/10' },
    { re: new RegExp(`\\boutline-${family}${shade}\\b`, 'g'), to: 'outline-white/20', tag: 'outline morado → outline-white/20' },
    { re: new RegExp(`\\bdecoration-${family}${shade}\\b`, 'g'), to: 'decoration-[#E11D48]', tag: 'decoración morada → diamondRed' },
  ];

  for (const rule of rules) {
    if (rule.re.test(out)) {
      out = out.replace(rule.re, rule.to);
      notes.push(rule.tag);
    }
  }
  return out;
}

/** `shadow-[0_0_40px_rgba(139,92,246,.4)]` → glow cardinalicio. */
function neutralizePurpleRgb(code, notes) {
  let out = code;
  const re = /rgba?\(\s*(139|124|168|147|192|109|76|91|126|167|129|129|99|79|67|55|232)\s*,\s*(92|58|85|51|132|40|29|33|34|139|140|102|70|56|48|32|121)\s*,\s*(\d{1,3})\s*([,/]\s*[\d.]+\s*)?\)/g;
  const matches = out.match(re);
  if (matches) {
    out = out.replace(re, 'rgba(225, 29, 72, 0.35)');
    notes.push('rgba() morado → rgba(225, 29, 72, 0.35) (diamondRed.glow)');
  }
  return out;
}

/**
 * Fondos de estudio → Onyx. `bg-[#0a0a0a]`, `bg-black`, `bg-zinc-950`… todos
 * aterrizan en `#030305` como clase arbitraria estable (sin depender de la
 * configuración de Tailwind del estudio original).
 */
function convertBackgrounds(code, notes) {
  let out = code;

  // 1. Hex oscuros declarados como fondo (`bg-[#0a0a0a]`).
  for (const hex of DARK_BGS) {
    const re = new RegExp(`\\bbg-\\[${escapeRegExp(hex)}\\]`, 'gi');
    if (re.test(out)) {
      out = out.replace(re, `bg-[${ONYX.core}]`);
      notes.push(`fondo ${hex} → bg-[${ONYX.core}]`);
    }
  }

  // 2. Familias neutras oscuras de Tailwind (`bg-zinc-950`, `bg-slate-900`…).
  const darkFamily =
    /\bbg-(?:black|(?:zinc|slate|gray|neutral|stone|cyan|blue|teal|emerald)-(?:9[0-9]0|8[5-9]0))\b/g;
  if (darkFamily.test(out)) {
    out = out.replace(darkFamily, `bg-[${ONYX.core}]`);
    notes.push(`fondo neutro oscuro → bg-[${ONYX.core}]`);
  }

  // 3. `bg-slate-800/700` de estudio → superficie de tarjeta.
  const darkCard = /\bbg-(?:zinc|slate|gray|neutral|stone)-(?:8[0-4]0|7[0-9]0)\b/g;
  if (darkCard.test(out)) {
    out = out.replace(darkCard, `bg-[${ONYX.card}]`);
    notes.push(`superficie de estudio → bg-[${ONYX.card}] (obsidian.card)`);
  }

  return out;
}

/** Bordes sueltos → `border-white/10` (regla canónica de Aura Onyx). */
function convertBorders(code, notes) {
  let out = code;
  const re = /\bborder-(?:(?:zinc|slate|gray|neutral|stone)-(?:[1-9]00|50)|white\/[0-35-9]|white)\b/g;
  if (re.test(out)) {
    out = out.replace(re, ONYX.borderClass);
    notes.push(`borde de estudio → ${ONYX.borderClass}`);
  }
  return out;
}

/** Última pasada: ningún morado superviviente. Devuelve la lista de residuos. */
function findPurpleResidue(code) {
  const residue = [];
  const family = `(?:${PURPLE_UTILITIES.join('|')})`;
  for (const pattern of [
    new RegExp(`\\b[a-z-]*${family}(?:-\\d{2,3})?(?:\\/\\d{1,3})?\\b`, 'g'),
    /#[89a-f][0-9a-f]{5}\b/g,
  ]) {
    const found = code.match(pattern);
    if (found) residue.push(...found);
  }
  const purpleHex = PURPLE_HEX.filter((hex) => code.toLowerCase().includes(hex));
  return [...new Set([...residue, ...purpleHex])];
}


/* -------------------------------------------------------------------------- */
/*  GUARDIANES DE INVARIANTE (lo que el material de estudio suele romper)      */
/* -------------------------------------------------------------------------- */

/**
 * Importaciones que abortan la escritura. SEC-1: primero el caso negativo.
 * @returns {string[]} motivos de rechazo (vacío = apto).
 */
function blockingIssues(code, filePath) {
  const issues = [];

  for (const rule of CRITICAL_IMPORTS) {
    if (rule.pattern.test(code)) issues.push(rule.reason);
  }

  // SEC-3 / INV-07: NEXT_PUBLIC_* con apariencia de secreto.
  if (/NEXT_PUBLIC_[A-Z_]*(SECRET|KEY|TOKEN|PASSWORD|PRIVATE)/.test(code)) {
    issues.push('SEC-3 · NEXT_PUBLIC_* sobre material sensible');
  }

  // Regla B de audit:admin-ecosystem: una page.tsx no registrada es huérfana.
  if (path.basename(filePath).toLowerCase() === 'page.tsx') {
    issues.push('regla B · page.tsx en cosecha (módulo huérfano en el cockpit)');
  }

  // El material crudo no puede fabricar rutas /admin: registro paralelo (regla C).
  const navArray = /const\s+\w*(?:URLS?|NAV|TABS|ROUTES|DIRECTORY)\s*(?::[^=\n]+)?=\s*\[/i;
  if (navArray.test(code)) {
    const adminLiterals = code.match(/['"`]\/admin/g);
    if (adminLiterals && adminLiterals.length >= 2) {
      issues.push('regla C · registro de navegación paralelo (/admin)');
    }
  }

  return issues;
}

/** Avisos no bloqueantes: bundle, telemetría, cronómetros, marca ajena. */
function advisoryIssues(code) {
  const warnings = [];

  const importRe = /(?:from\s+['"]([^'"]+)['"])|(?:import\s+['"]([^'"]+)['"])/g;
  let match = importRe.exec(code);
  while (match !== null) {
    const spec = match[1] || match[2];
    if (spec && !spec.startsWith('.') && !ALLOWED_IMPORT_PREFIXES.some((p) => spec.startsWith(p))) {
      warnings.push(`dependencia externa «${spec}» (INV-15 · presupuesto de bundle)`);
    }
    match = importRe.exec(code);
  }

  if (/\baria-hidden\b/.test(code) && /\b(stat|metric|total|price|count)\b/i.test(code)) {
    warnings.push('aria-hidden sobre datos de negocio (accesibilidad)');
  }
  if (/\bhttp:\/\/localhost|127\.0\.0\.1/.test(code)) {
    warnings.push('URL local hardcodeada (AF-1 · no es fuente de verdad)');
  }
  if (/\b\d{1,3}(?:\.\d{3})*[,.]\d{2}\s*(?:€|EUR)/.test(code)) {
    warnings.push('importe tecleado a mano (INV-10 · debe venir del SSOT)');
  }

  return warnings;
}

/* -------------------------------------------------------------------------- */
/*  TRANSFORMACIONES FINALES                                                   */
/* -------------------------------------------------------------------------- */

/** Asegura exactamente un `'use client'` cuando el componente lo necesita. */
function applyUseClient(code, needsClient) {
  const stripped = code.replace(/^\s*(['"])use client\1;?\s*\r?\n/m, '');
  return needsClient ? `'use client';\n\n${stripped.replace(/^\s+/, '')}` : stripped.replace(/^\s+/, '');
}

/**
 * AF-2: si el widget genera datos con temporizadores y NO declara una sonda
 * real, se marca `mode="SIMULADO"` para que jamás se presente como medición.
 */
function applyTelemetryDisclosure(code, notes) {
  const hasTimer = /\bset(Interval|Timeout)\s*\(/.test(code);
  const hasProbe = /\bfetch\s*\(\s*[`'"]\/api\//.test(code) || /\bprobed\b/.test(code);
  if (!hasTimer || hasProbe) return code;

  notes.push('AF-2 · telemetría con temporizador sin sonda → marcada SIMULADO');
  return code.replace(
    /<(\w+)(\s[^>]*?)?(\/?)>/,
    (full, tag, attrs, selfClose) =>
      `<${tag} data-mode="SIMULADO" aria-busy="false"${attrs || ''}${selfClose}>`,
  );
}

/**
 * INV-18: cronómetros con dígitos proporcionales producen layout shift.
 * Se inyecta `tabular-nums` y se elimina `text-center` (que centra el bloque y
 * desplaza el tablero al cambiar el número de dígitos).
 */
function applyTabularNums(code, notes) {
  const timerPattern = /\b\d{2}:\d{2}(?::\d{2})?\b/;
  if (!timerPattern.test(code)) return code;

  let out = code;
  if (/\btext-(?:xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b/.test(out) && !/tabular-nums/.test(out)) {
    out = out.replace(/\btext-(xl|[2-9]xl)\b/g, (full) => `${full} tabular-nums`);
    notes.push('INV-18 · tabular-nums inyectado en cronómetro');
  }
  return out;
}

/** Cabecera contractual del fichero transpilado (trazabilidad EP-1). */
function buildHeader(componentName, sourceFile, target, digest, notes) {
  const stamp = new Date().toISOString();
  const noteLines = notes.length > 0 ? notes.map((n) => ` *   - ${n}`).join('\n') : ' *   - (sin conversiones necesarias)';
  return `/**
 * HARVESTED COMPONENT — ${componentName}
 * ${target.preamble}
 *
 * Generado por scripts/batch_harvest_transpiler.cjs — NO editar a mano.
 * Origen   : ${sourceFile}
 * sha256   : ${digest}
 * Generado : ${stamp}
 * Paleta   : Aura Onyx ${ONYX.core} · ${ONYX.borderClass} · acento diamondRed #E11D48
 *
 * Conversiones aplicadas:
${noteLines}
 */
`;
}


/* -------------------------------------------------------------------------- */
/*  PIPELINE DE UN FICHERO                                                     */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {Object} TranspileResult
 * @property {string} file
 * @property {'PENDIENTE'|'APTO'|'ESCRITO'|'RECHAZADO'|'IGNORADO'} status
 * @property {string|null} component
 * @property {string|null} output
 * @property {string[]} notes
 * @property {string[]} warnings
 * @property {string[]} blocked
 * @property {string} sha256
 */

/**
 * Transpila un fichero. Nunca escribe; decide estado y salida.
 * @returns {TranspileResult}
 */
function transpileFile(filePath, target) {
  const sourceFile = rel(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const raw = fs.readFileSync(filePath, 'utf8');
  const sha256 = crypto.createHash('sha256').update(raw).digest('hex');

  /** @type {TranspileResult} */
  const result = {
    file: sourceFile,
    status: 'PENDIENTE',
    component: null,
    output: null,
    notes: [],
    warnings: [],
    blocked: [],
    sha256,
  };

  if (!SOURCE_EXT.has(extension)) {
    result.status = AUX_EXT.has(extension) ? 'IGNORADO' : 'RECHAZADO';
    result.blocked.push(
      AUX_EXT.has(extension)
        ? `auxiliar «${extension}» (se lee para tokens, no se copia)`
        : `extensión «${extension}» no admitida (solo .tsx/.jsx)`,
    );
    return result;
  }

  const code = extractCode(raw);
  result.component = detectComponentName(code, filePath);
  result.blocked = blockingIssues(code, filePath);
  if (result.blocked.length > 0) {
    result.status = 'RECHAZADO';
    return result;
  }

  result.warnings = advisoryIssues(code);

  let out = neutralizePurpleHex(code, result.notes);
  out = neutralizePurpleRgb(out, result.notes);
  out = neutralizePurpleUtilities(out, result.notes);
  out = convertBackgrounds(out, result.notes);
  out = convertBorders(out, result.notes);
  out = applyTabularNums(out, result.notes);
  out = applyTelemetryDisclosure(out, result.notes);
  out = applyUseClient(out, needsUseClient(out));

  const residue = findPurpleResidue(out);
  if (residue.length > 0) {
    result.status = 'RECHAZADO';
    result.blocked.push(`INV-21 · morado superviviente: ${residue.slice(0, 6).join(', ')}`);
    return result;
  }

  result.output = buildHeader(result.component, sourceFile, target, sha256, result.notes) + out;
  result.status = 'APTO';
  return result;
}


/* -------------------------------------------------------------------------- */
/*  ORQUESTACIÓN POR DESTINO                                                   */
/* -------------------------------------------------------------------------- */

function resolveSource(target, options) {
  if (!options.source) return target.source;
  const raw = options.source.trim();
  if (!raw) return target.source;
  return path.isAbsolute(raw) ? raw : path.join(ROOT, raw.replace(/^[./\\]+/, ''));
}

function ensureTarget(target) {
  if (!fs.existsSync(target.target)) {
    fs.mkdirSync(target.target, { recursive: true });
    return 'creado';
  }
  return 'existente';
}

function runTarget(target, options) {
  const source = resolveSource(target, options);
  const files = discover(source);
  const results = files.map((file) => transpileFile(file, target));

  const report = {
    target: target.id,
    label: target.label,
    source: rel(source),
    destination: rel(target.target),
    sourceExists: fs.existsSync(source),
    destinationState: fs.existsSync(target.target) ? 'existente' : 'ausente',
    mode: options.write ? 'ESCRITURA' : 'AUDITORIA',
    total: results.length,
    aptos: results.filter((r) => r.status === 'APTO' || r.status === 'ESCRITO').length,
    rechazados: results.filter((r) => r.status === 'RECHAZADO').length,
    ignorados: results.filter((r) => r.status === 'IGNORADO').length,
    files: results,
  };

  if (options.write && results.length > 0) {
    report.destinationState = ensureTarget(target);

    // SEC-1: primero el caso negativo. Si algo se rechaza, no se escribe nada.
    if (report.rechazados > 0) {
      report.mode = 'ABORTADO';
      report.abortReason = `${report.rechazados} fichero(s) rechazado(s): no se escribe ningún componente (SEC-1)`;
      return report;
    }

    for (const result of results) {
      if (result.status !== 'APTO' || result.output === null) continue;
      const outFile = path.join(target.target, `${result.component}.tsx`);
      fs.writeFileSync(outFile, result.output, 'utf8');
      result.status = 'ESCRITO';
      result.output = rel(outFile);
    }
    report.mode = 'ESCRITO';
  }

  return report;
}

/* -------------------------------------------------------------------------- */
/*  PRESENTACIÓN                                                               */
/* -------------------------------------------------------------------------- */

const STATUS_ICON = {
  PENDIENTE: '  ·',
  APTO: '  OK',
  ESCRITO: '  >>',
  RECHAZADO: '  XX',
  IGNORADO: '  --',
};

function printReport(report) {
  console.log('');
  console.log(`-- ${report.label} -- [${report.target}]`);
  console.log(`   deposito   : ${report.source}${report.sourceExists ? '' : '  (NO EXISTE)'}`);
  console.log(`   destino    : ${report.destination}  (${report.destinationState})`);
  console.log(`   modo       : ${report.mode}`);
  console.log(
    `   ficheros   : ${report.total} · aptos ${report.aptos} · rechazados ${report.rechazados} · ignorados ${report.ignorados}`,
  );
  if (report.abortReason) console.log(`   ABORTADO   : ${report.abortReason}`);
  if (report.total === 0) {
    console.log('   estado     : ESPERANDO MATERIAL CRUDO (deposito vacio)');
  }
  for (const file of report.files) {
    console.log(`${STATUS_ICON[file.status]} ${file.file} -> ${file.component || '-'} [${file.status}]`);
    for (const note of file.notes) console.log(`       · ${note}`);
    for (const warning of file.warnings) console.log(`       ! ${warning}`);
    for (const blocked of file.blocked) console.log(`       x ${blocked}`);
  }
}

/* -------------------------------------------------------------------------- */
/*  MAIN                                                                       */
/* -------------------------------------------------------------------------- */

function main() {
  const options = parseArgs(process.argv);

  if (options.help) {
    console.log(HELP);
    return 0;
  }

  const selected = options.target
    ? TARGETS.filter((item) => item.id === options.target)
    : TARGETS;

  if (options.target && selected.length === 0) {
    console.error(`[TRANSPILER] Destino desconocido: ${options.target}`);
    console.error(`[TRANSPILER] Validos: ${TARGETS.map((item) => item.id).join(' | ')}`);
    return 2;
  }

  const reports = selected.map((target) => runTarget(target, options));

  if (options.json) {
    console.log(JSON.stringify({ generatedAt: new Date().toISOString(), reports }, null, 2));
  } else if (!options.quiet) {
    console.log('================================================================');
    console.log(' BATCH HARVEST TRANSPILER · COSECHA DUAL · Aura Onyx');
    console.log('================================================================');
    for (const report of reports) printReport(report);
    console.log('');
  }

  const aborted = reports.some((report) => report.rechazados > 0);
  return aborted ? 1 : 0;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { extractCode, detectComponentName, needsUseClient, transpileFile, TARGETS };

