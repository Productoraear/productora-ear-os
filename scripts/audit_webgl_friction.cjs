#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR DE FRICCIÓN WEBGL · EAR OS Ω-SPATIAL
 * ════════════════════════════════════════════════════════════════════════════
 * Ley del Auditor Real (§9 .clinerules): un ítem del scorecard sin comando
 * ejecutable vale 0 puntos. Este script es el comando.
 *
 * Detecta las seis formas en que un canvas mata la conversión:
 *   R01 DPR_UNCLAMPED      → devicePixelRatio sin Math.min (mata móviles)
 *   R02 RAF_UNGUARDED      → rAF sin IntersectionObserver/visibilidad
 *   R03 MOTION_UNGOVERNED  → WebGL sin prefers-reduced-motion ni presupuesto
 *   R04 RENDERER_NO_DISPOSE→ THREE.WebGLRenderer sin dispose (fuga de GPU)
 *   R05 WSCREEN_IN_SPATIAL → w-screen (scroll horizontal, Veto §5)
 *   R06 CANVAS_NO_RESERVE  → <canvas> sin reserva de espacio declarada
 *
 * USO
 *   node scripts/audit_webgl_friction.cjs                  # compara baseline
 *   node scripts/audit_webgl_friction.cjs --strict         # toda la deuda
 *   node scripts/audit_webgl_friction.cjs --seal-baseline  # sella la deuda
 *   node scripts/audit_webgl_friction.cjs --include=src/lib/spatial,src/components/spatial
 *   node scripts/audit_webgl_friction.cjs --json
 * ────────────────────────────────────────────────────────────────────────────
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const SCAN_ROOTS = ['src/components', 'src/features', 'src/lib', 'src/app'];
const BASELINE_PATH = path.join(ROOT, '.antigravity', 'webgl_friction_baseline.json');
const EXTENSIONS = new Set(['.ts', '.tsx']);

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

const SPATIAL_MARKERS = [
  /from\s+['"]three['"]/,
  /@react-three\//,
  /getContext\(\s*['"]webgl/,
  /<canvas/,
  /new\s+THREE\.WebGLRenderer/,
  /shadergradient/i,
];

/**
 * Comprueba una condición IGNORANDO líneas de comentario. Evita que la propia
 * documentación del auditor se convierta en deuda (falso positivo real
 * detectado al sellar la baseline).
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

const RULES = [
  {
    id: 'R01_DPR_UNCLAMPED',
    spatialOnly: false,
    applies: (src) => /devicePixelRatio/.test(src) && !/Math\.min\(/.test(src),
    message: 'devicePixelRatio sin Math.min → GPU recalentada en móviles de 3x',
  },
  {
    id: 'R02_RAF_UNGUARDED',
    spatialOnly: false,
    applies: (src) =>
      /requestAnimationFrame/.test(src) &&
      !/visibilitychange|document\.hidden|IntersectionObserver|useStageActivation/.test(src),
    message: 'rAF sin puerta de visibilidad → batería robada fuera de viewport',
  },
  {
    id: 'R03_MOTION_UNGOVERNED',
    spatialOnly: true,
    applies: (src) =>
      !/prefers-reduced-motion|REDUCED_MOTION_QUERY|useSpatialBudget|allowRender/.test(src),
    message: 'escena WebGL sin prefers-reduced-motion ni presupuesto de render',
  },
  {
    id: 'R04_RENDERER_NO_DISPOSE',
    spatialOnly: true,
    applies: (src) => /new\s+THREE\.WebGLRenderer/.test(src) && !/\.dispose\(\)/.test(src),
    message: 'WebGLRenderer sin dispose() → contextos colgados hasta pantalla negra',
  },
  {
    id: 'R05_WSCREEN_IN_SPATIAL',
    spatialOnly: true,
    applies: (src) => hasCodeLineMatching(src, /\bw-screen\b/),
    message: 'w-screen en superficie espacial → scroll horizontal (Veto §5)',
  },
  {
    id: 'R06_CANVAS_NO_RESERVE',
    spatialOnly: true,
    applies: (src) =>
      /<canvas/.test(src) &&
      !/aspect-ratio|aspectRatio|min-h-|\bh-\[|\bw-\[|\bheight=/.test(src),
    message: '<canvas> sin reserva de espacio → CLS al montar',
  },
];

function walk(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
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
  INCLUDE.length === 0
    ? files
    : files.filter((f) => INCLUDE.some((inc) => rel(f).startsWith(inc)));

const findings = [];
let spatialCount = 0;

for (const file of scoped) {
  let source;
  try {
    source = fs.readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  const isSpatial = SPATIAL_MARKERS.some((marker) => marker.test(source));
  if (isSpatial) spatialCount += 1;

  for (const rule of RULES) {
    if (rule.spatialOnly && !isSpatial) continue;
    if (!rule.applies(source)) continue;
    findings.push({
      key: `${rel(file)}::${rule.id}`,
      file: rel(file),
      rule: rule.id,
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

if (SEAL) {
  fs.mkdirSync(path.dirname(BASELINE_PATH), { recursive: true });
  fs.writeFileSync(
    BASELINE_PATH,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        note: 'Deuda WebGL declarada. Cada entrada debe pagarse o justificarse; el baseline NUNCA crece sin sancion del CEO.',
        totals: { files: scoped.length, spatial: spatialCount, findings: findings.length },
        findings: findings.map((f) => f.key),
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
  console.log(
    `[OMEGA-SPATIAL] baseline sellado: ${findings.length} hallazgos en ${spatialCount} ficheros espaciales`,
  );
  process.exit(0);
}

const baseline = readBaseline();
const scopedStrict = STRICT || INCLUDE.length > 0;
const newDebt = scopedStrict ? findings : findings.filter((f) => !baseline.has(f.key));

const summary = {
  scannedFiles: scoped.length,
  spatialFiles: spatialCount,
  totalFindings: findings.length,
  baselineEntries: baseline.size,
  newDebt: newDebt.length,
  byRule: findings.reduce((acc, f) => {
    acc[f.rule] = (acc[f.rule] ?? 0) + 1;
    return acc;
  }, {}),
};

if (JSON_OUT) {
  console.log(JSON.stringify({ summary, newDebt }, null, 2));
} else {
  console.log('==== OMEGA-SPATIAL · AUDITOR DE FRICCION WEBGL ====');
  console.log(`Ficheros analizados  : ${summary.scannedFiles}`);
  console.log(`Ficheros espaciales  : ${summary.spatialFiles}`);
  console.log(`Hallazgos totales    : ${summary.totalFindings}`);
  console.log(`Baseline declarada   : ${summary.baselineEntries}`);
  console.log(`DEUDA NUEVA          : ${summary.newDebt}`);
  if (Object.keys(summary.byRule).length > 0) {
    console.log('Desglose por regla:');
    for (const [rule, count] of Object.entries(summary.byRule).sort()) {
      console.log(`  - ${rule.padEnd(24)} ${count}`);
    }
  }
  if (newDebt.length > 0) {
    console.log('\n[X] Deuda no declarada:');
    for (const finding of newDebt) {
      console.log(`  [X] ${finding.file}  [${finding.rule}]`);
      console.log(`      ${finding.message}`);
    }
  } else {
    console.log('\n[OK] Cero deuda WebGL nueva. Estado medible, no prometido.');
  }
}

process.exit(newDebt.length > 0 ? 1 : 0);
