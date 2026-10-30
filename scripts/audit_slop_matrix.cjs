#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR DE SLOP VISUAL & COPY · TASTE ENGINE Ω
 * ════════════════════════════════════════════════════════════════════════════
 * Convierte el "PROTOCOLO IMPECABLE & TASTE ENGINE" (.agents/rules/
 * 02-impecable-taste-engine.md) en un comando medible.
 *
 * Ley del Auditor Real (AGENTS §15): un ítem del scorecard sin comando en disco
 * vale 0 puntos, no "pendiente". Este script es el comando para los patrones de
 * slop que se detectan de forma estática y fiable.
 *
 * HONESTIDAD DE COBERTURA (AF-2 · AF-5): de los 46 patrones declarados, se
 * verifican 18 por análisis estático. Los otros 28 exigen render real, medición
 * de contraste/clima de navegador o criterio editorial humano: se declaran en
 * NOT_MACHINE_CHECKABLE con su motivo. No se finge cobertura.
 *
 * USO
 *   node scripts/audit_slop_matrix.cjs                   # compara baseline
 *   node scripts/audit_slop_matrix.cjs --strict          # toda la deuda actual
 *   node scripts/audit_slop_matrix.cjs --seal-baseline   # sella la deuda medida
 *   node scripts/audit_slop_matrix.cjs --include=src/components/home
 *   node scripts/audit_slop_matrix.cjs --json
 * ────────────────────────────────────────────────────────────────────────────
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const SCAN_ROOTS = ['src', 'content', 'public'];
const BASELINE_PATH = path.join(ROOT, '.antigravity', 'slop_matrix_baseline.json');
const EXTENSIONS = new Set(['.ts', '.tsx', '.jsx', '.mjs']);
const EXCLUDE_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'scratch',
  'adn_vault',
  'adn_vault_staging',
  'staging',
  'generated',
  '__generated__',
]);
const MAX_LISTED = 40;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const valueOf = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : fallback;
};

const STRICT = flag('--strict');
const SEAL = flag('--seal-baseline');
const JSON_OUT = flag('--json');
const INCLUDE = valueOf('--include', '')
  .split(',')
  .map((s) => s.trim().replace(/\\/g, '/'))
  .filter(Boolean);

/**
 * Comprueba una condición IGNORANDO líneas de comentario. Evita que la propia
 * documentación del auditor (o de un componente) se convierta en deuda falsa.
 * Mismo criterio que scripts/audit_webgl_friction.cjs:63 (no se inventa API).
 */
function hasCodeLineMatching(source, pattern) {
  return source.split(/\r?\n/).some((line) => {
    const trimmed = line.trimStart();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
      return false;
    }
    return pattern.test(line);
  });
}

/** Acento único por vista + paleta S-Class calibrada (Slop 8/9/10/13). */
const RULES = [
  {
    id: 'S02_GENERIC_FONT',
    dimension: 'A·Tipografía',
    applies: (src) =>
      /font-family\s*:[^;\n]*\b(Arial|Helvetica|Roboto|Verdana|Tahoma|sans-serif)\b/i.test(src) ||
      /fontFamily\s*:\s*['"`](Arial|Helvetica|Roboto|Verdana|sans-serif)/i.test(src) ||
      /\bfont-\[(Arial|Helvetica|Roboto)/i.test(src),
    message: 'tipografía de sistema/stock: usar Syne (display), Inter (cuerpo), JetBrains Mono (telemetría)',
  },
  {
    id: 'S03_TIMID_HERO',
    dimension: 'A·Tipografía',
    applies: (src) =>
      /<h1\b[^>]*\btext-(?:xs|sm|base|lg|xl|2xl|3xl)\b/.test(src) &&
      !/<h1\b[^>]*\btext-(?:4xl|5xl|6xl|7xl|8xl|9xl)\b/.test(src) &&
      !/clamp\(/.test(src),
    message: 'h1 por debajo de text-4xl: el héroe debe ser monumental (Slop 3)',
  },
  {
    id: 'S07_LOW_CONTRAST_UTILITY',
    dimension: 'A·Tipografía',
    applies: (src) => /\btext-(?:zinc|gray|slate|neutral)-[567]00\b/.test(src),
    message: 'texto secundario por debajo de 4.5:1 sobre OLED: usar text-zinc-300/400 (Slop 7)',
  },
  {
    id: 'S08_AI_PURPLE_GRADIENT',
    dimension: 'B·Cromática',
    applies: (src) => /\b(?:from|via|to)-(?:purple|violet|indigo|fuchsia|blue)-\d{2,3}\b/.test(src),
    message: 'degradado violeta/azul cliché de IA: prohibido (Slop 8)',
  },
  {
    id: 'S09_WASHED_GRAY_BG',
    dimension: 'B·Cromática',
    applies: (src) => /\bbg-(?:gray|slate|zinc|neutral)-(?:700|800|900|950)\b/.test(src),
    message: 'fondo gris lavado: usar negro OLED (#030305 / #050507 / #08090d) (Slop 9)',
  },
  {
    id: 'S11_GREY_DEFAULT_SHADOW',
    dimension: 'B·Cromática',
    applies: (src) =>
      hasCodeLineMatching(src, /\bshadow-(?:sm|md|lg|xl|2xl|inner)\b/) && !/shadow-\[/.test(src),
    message: 'sombra difusa gris sin dirección: usar sombra coloreada shadow-[0_0_25px_rgba(...)] (Slop 11)',
  },
  {
    id: 'S12_OPAQUE_WHITE_BORDER',
    dimension: 'B·Cromática',
    applies: (src) => /\bborder-white(?![\/\w-])/.test(src),
    message: 'borde blanco opaco: usar translúcido border-white/10 o /15 (Slop 12)',
  },
  {
    id: 'S22_WSCREEN_OVERFLOW',
    dimension: 'D·Responsive',
    applies: (src) => hasCodeLineMatching(src, /\bw-screen\b|\b100vw\b/),
    message: 'w-screen/100vw desborda en Windows: usar w-full max-w-full overflow-x-hidden (Slop 22)',
  },
  {
    id: 'S24_SMALL_TAP_TARGET',
    dimension: 'D·Responsive',
    applies: (src) =>
      /<(?:button|a)\b[^>]*\b(?:h|min-h)-(?:5|6|7|8|9|10)\b/.test(src) &&
      !/min-h-\[44px\]|min-h-11\b/.test(src),
    message: 'target táctil menor de 44px: añadir min-h-[44px] (Slop 24)',
  },
  {
    id: 'S28_NO_INTERACTIVE_STATE',
    dimension: 'E·Interacción',
    applies: (src) => /<button\b/.test(src) && !/hover:|focus-visible:/.test(src),
    message: 'botones sin hover/focus-visible en todo el fichero: estados obligatorios (Slop 28)',
  },
  {
    id: 'S30_DIV_CLICK_NO_CURSOR',
    dimension: 'E·Interacción',
    applies: (src) => /<div\b[^>]*onClick/.test(src) && !/cursor-pointer/.test(src),
    message: 'div clicable sin cursor-pointer: el usuario no sabe que se puede pulsar (Slop 30)',
  },
  {
    id: 'S34_BOUNCE_BOB',
    dimension: 'F·Movimiento',
    applies: (src) => hasCodeLineMatching(src, /\banimate-(?:bounce|float|wobble)\b/),
    message: 'animación flotante continua que marea: movimiento con propósito, no bobbing slop (Slop 34)',
  },
  {
    id: 'S36_MOTION_UNGUARDED',
    dimension: 'F·Movimiento',
    applies: (src) =>
      /from\s+['"]framer-motion['"]|\banimate-\[/.test(src) &&
      !/prefers-reduced-motion|useReducedMotion/.test(src),
    message: 'animación sin puerta prefers-reduced-motion (accesibilidad) (Slop 36)',
  },
  {
    id: 'S40_AI_CLICHE_COPY',
    dimension: 'G·Copywriting',
    applies: (src) =>
      /revoluciona(?:r|ndo)?\b[^.\n]{0,40}\bexperiencia|el poder de la innovaci[oó]n|soluci[oó]n(?:es)? integral(?:es)?|\bsinergias?\b|experiencia [uú]nica e inolvidable/i.test(
        src,
      ),
    message: 'frase cliché de IA en el copy: sustituir por dato verificable (Slop 40)',
  },
  {
    id: 'S41_EMPTY_CTA',
    dimension: 'G·Copywriting',
    applies: (src) =>
      />\s*(?:haz clic aqu[ií]|clic aqu[ií]|pincha aqu[ií]|empezar|leer m[aá]s|ver m[aá]s|saber m[aá]s|m[aá]s informaci[oó]n)\s*</i.test(
        src,
      ),
    message: 'botón con texto vacío: usar verbo de valor ("Reservar Fecha con Price-Lock") (Slop 41)',
  },
  {
    id: 'S42_GENERIC_CLAIM',
    dimension: 'G·Copywriting',
    applies: (src) =>
      /\bm[uú]sica de calidad\b|\bcalidad excepcional\b|\bprofesionalidad garantizada\b|\blos mejores\b|\bl[ií]der del sector\b/i.test(
        src,
      ),
    message: 'claim sin telemetría: sustituir por dato real ("Rider 12 W/pax") (Slop 42 · JUR-1)',
  },
  {
    id: 'S45_HEDGE_COPY',
    dimension: 'G·Copywriting',
    applies: (src) =>
      /\bpodr[ií]amos ayudarte\b|\bquiz[aá]s podamos\b|\btal vez podamos\b|\bintentamos ayudarte\b/i.test(src),
    message: 'lenguaje dubitativo: afirmar lo que el SSOT sostiene (Slop 45)',
  },
  {
    id: 'S46_BRAND_OR_DESIGNER_LEAK',
    dimension: 'G·Copywriting',
    applies: (src) =>
      /bang\s*(?:&|y)\s*olufsen|\blinear interface\b|\bdribbble\b|\bbehance\b/i.test(src),
    message: 'marca de terceros o nombre de diseñador en copy público (Slop 46 · JUR-4)',
  },
];

/**
 * Patrones del protocolo que NO se pueden probar con análisis estático.
 * Se publican a la vista para que nadie los cuente como verdes (AF-5).
 */
const NOT_MACHINE_CHECKABLE = {
  RENDER: [
    'S01',
    'S04',
    'S05',
    'S06',
    'S10',
    'S13',
    'S14',
    'S15',
    'S16',
    'S17',
    'S18',
    'S19',
    'S20',
    'S21',
    'S23',
    'S25',
    'S26',
    'S32',
    'S33',
    'S35',
    'S38',
    'S39',
  ],
  BROWSER_MEASURED: ['S29', 'S31', 'S43', 'S44'],
  COVERED_BY: {
    'S27': 'scripts/audit_webgl_friction.cjs (canvas con ResizeObserver / presupuesto espacial)',
    'S37': 'scripts/audit_webgl_friction.cjs :: R02_RAF_UNGUARDED',
  },
};

function walk(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
      walk(full, out);
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
}

function rel(full) {
  return path.relative(ROOT, full).replace(/\\/g, '/');
}

const files = [];
for (const root of SCAN_ROOTS) walk(path.join(ROOT, root), files);

const scoped =
  INCLUDE.length === 0 ? files : files.filter((f) => INCLUDE.some((inc) => rel(f).startsWith(inc)));

const findings = [];
let unreadable = 0;

for (const file of scoped) {
  let source;
  try {
    source = fs.readFileSync(file, 'utf8');
  } catch {
    unreadable += 1;
    continue;
  }

  for (const rule of RULES) {
    if (!rule.applies(source)) continue;
    findings.push({
      key: `${rel(file)}::${rule.id}`,
      file: rel(file),
      rule: rule.id,
      dimension: rule.dimension,
      message: rule.message,
    });
  }
}

findings.sort((a, b) => a.key.localeCompare(b.key));

function readBaseline() {
  if (!fs.existsSync(BASELINE_PATH)) return new Set();
  try {
    const parsed = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
    return new Set(Array.isArray(parsed.findings) ? parsed.findings : []);
  } catch {
    return new Set();
  }
}

const TOTAL_DECLARED = 46;
const CHECKED = RULES.length;

if (SEAL) {
  fs.mkdirSync(path.dirname(BASELINE_PATH), { recursive: true });
  fs.writeFileSync(
    BASELINE_PATH,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        note: 'Deuda de slop declarada. Cada entrada debe pagarse o justificarse; el baseline NUNCA crece sin sancion del CEO.',
        totals: { files: scoped.length, findings: findings.length, rules: CHECKED },
        findings: findings.map((f) => f.key),
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
  console.log(
    `[TASTE-ENGINE] baseline sellado: ${findings.length} hallazgos en ${scoped.length} ficheros (${CHECKED}/${TOTAL_DECLARED} patrones medibles)`,
  );
  process.exit(0);
}

const baseline = readBaseline();
const scopedStrict = STRICT || INCLUDE.length > 0;
const newDebt = scopedStrict ? findings : findings.filter((f) => !baseline.has(f.key));

const summary = {
  scannedFiles: scoped.length,
  unreadableFiles: unreadable,
  totalFindings: findings.length,
  baselineEntries: baseline.size,
  newDebt: newDebt.length,
  coverage: { declaredPatterns: TOTAL_DECLARED, machineChecked: CHECKED },
  byRule: findings.reduce((acc, f) => {
    acc[f.rule] = (acc[f.rule] ?? 0) + 1;
    return acc;
  }, {}),
  byDimension: findings.reduce((acc, f) => {
    acc[f.dimension] = (acc[f.dimension] ?? 0) + 1;
    return acc;
  }, {}),
};

if (JSON_OUT) {
  console.log(
    JSON.stringify(
      { summary, newDebt, notMachineCheckable: NOT_MACHINE_CHECKABLE },
      null,
      2,
    ),
  );
} else {
  console.log('==== TASTE-ENGINE Ω · AUDITOR DE SLOP VISUAL & COPY ====');
  console.log(`Ficheros analizados   : ${summary.scannedFiles}${unreadable ? ` (${unreadable} ilegibles)` : ''}`);
  console.log(
    `Cobertura máquina     : ${CHECKED}/${TOTAL_DECLARED} patrones (el resto exige render real o criterio editorial)`,
  );
  console.log(`Hallazgos totales     : ${summary.totalFindings}`);
  console.log(`Baseline declarada    : ${summary.baselineEntries}`);
  console.log(`DEUDA NUEVA           : ${summary.newDebt}`);
  if (Object.keys(summary.byDimension).length > 0) {
    console.log('Desglose por dimensión:');
    for (const [dim, count] of Object.entries(summary.byDimension).sort()) {
      console.log(`  - ${dim.padEnd(16)} ${count}`);
    }
  }
  if (Object.keys(summary.byRule).length > 0) {
    console.log('Desglose por regla:');
    for (const [rule, count] of Object.entries(summary.byRule).sort()) {
      console.log(`  - ${rule.padEnd(30)} ${count}`);
    }
  }
  if (newDebt.length > 0) {
    console.log('\n[X] Deuda no declarada:');
    for (const finding of newDebt.slice(0, MAX_LISTED)) {
      console.log(`  [X] ${finding.file}  [${finding.rule}]`);
      console.log(`      ${finding.message}`);
    }
    if (newDebt.length > MAX_LISTED) {
      console.log(`  … y ${newDebt.length - MAX_LISTED} más (usar --json para el listado completo)`);
    }
  } else {
    console.log('\n[OK] Cero deuda de slop nueva. Estado medido, no prometido.');
  }
  console.log(
    `\nNO_MACHINE_CHECKABLE (declarado, no fingido): ${Object.keys(NOT_MACHINE_CHECKABLE.COVERED_BY).length} con comando externo, ` +
      `${NOT_MACHINE_CHECKABLE.RENDER.length + NOT_MACHINE_CHECKABLE.BROWSER_MEASURED.length} pendientes de navegador real.`,
  );
}

process.exit(newDebt.length > 0 ? 1 : 0);
