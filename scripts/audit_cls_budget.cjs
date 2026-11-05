#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * SCRIPTS/AUDIT_CLS_BUDGET.CJS — AUDITOR ESTÁTICO DE PRESUPUESTO DE LAYOUT SHIFT
 * ════════════════════════════════════════════════════════════════════════════
 * Misión: W51_T02_EXPERIENCIA_ZERO_CLS (Ítem Ω-13 del Scorecard Ω-Diamante)
 *
 * Mide de forma estática 8 reglas de prevención de CLS (Cumulative Layout Shift)
 * sobre las rutas públicas de EAR OS (INV-11 / DESIGN.md §3 y §10).
 *
 * Anti-fachada (AF-1 / AF-2):
 * - Declarado probed:false, source:"static", mode:"SIMULADO".
 * - estimatedCls:null (el CLS real p75 requiere RUM/CrUX con datos de campo).
 * - Cero cifras inventadas.
 *
 * USO:
 *   node scripts/audit_cls_budget.cjs --route=/experiencia
 *   node scripts/audit_cls_budget.cjs --route=/experiencia --strict --write
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, '.antigravity', 'reports');

// Parse CLI arguments
const args = process.argv.slice(2);
let routes = [];
let strict = false;
let jsonOnly = false;
let writeReport = false;

for (const arg of args) {
  if (arg.startsWith('--route=')) {
    routes.push(arg.split('=')[1]);
  } else if (arg === '--strict') {
    strict = true;
  } else if (arg === '--json') {
    jsonOnly = true;
  } else if (arg === '--write') {
    writeReport = true;
  }
}

if (routes.length === 0) {
  routes = ['/experiencia'];
}

/** Mapa canónico de rutas a ficheros fuente de la ruta */
const ROUTE_FILE_MAP = {
  '/experiencia': [
    'src/app/experiencia/page.tsx',
    'src/components/portal/OmniChannelHub360.tsx'
  ],
  '/reservar/solista': [
    'src/app/reservar/solista/page.tsx'
  ],
  '/': [
    'src/app/page.tsx'
  ]
};

/**
 * 8 Reglas canónicas estables
 */
const RULES = [
  {
    id: 'R1_FONT_LINK',
    description: 'Enlace externo a fuentes (Google Fonts/Typekit) o @import en CSS en lugar de next/font',
    check: (content) => {
      const violations = [];
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/fonts\.(googleapis|gstatic)\.com|typekit\.net/i.test(line) && !line.includes('// exempt')) {
          violations.push({ line: idx + 1, snippet: line.trim() });
        }
        if (/@import\s+url\(.+fonts\./i.test(line)) {
          violations.push({ line: idx + 1, snippet: line.trim() });
        }
      });
      return violations;
    }
  },
  {
    id: 'R2_IMG_NO_DIMS',
    description: '<img> o <Image> sin dimensiones explícitas (width/height o fill)',
    check: (content) => {
      const violations = [];
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/<img\b[^>]*>/i.test(line)) {
          if (!/width=/i.test(line) || !/height=/i.test(line)) {
            violations.push({ line: idx + 1, snippet: line.trim() });
          }
        }
        if (/<Image\b[^>]*>/i.test(line)) {
          if (!/fill\b/i.test(line) && (!/width=/i.test(line) || !/height=/i.test(line))) {
            violations.push({ line: idx + 1, snippet: line.trim() });
          }
        }
      });
      return violations;
    }
  },
  {
    id: 'R3_MEDIA_NO_RATIO',
    description: 'Contenedor de video/iframe sin aspect-ratio ni altura fija reservada',
    check: (content) => {
      const violations = [];
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/<(iframe|video)\b[^>]*>/i.test(line)) {
          if (!/aspect-|h-\[|h-\d+/i.test(line)) {
            violations.push({ line: idx + 1, snippet: line.trim() });
          }
        }
      });
      return violations;
    }
  },
  {
    id: 'R4_SSR_FALSE_INVIEW',
    description: 'next/dynamic con ssr:false montando componente sin placeholder/skeleton reservado',
    check: (content) => {
      const violations = [];
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/dynamic\([^)]*ssr:\s*false/i.test(line)) {
          if (!/loading:/i.test(content)) {
            violations.push({ line: idx + 1, snippet: line.trim() });
          }
        }
      });
      return violations;
    }
  },
  {
    id: 'R5_HYDRATION_SWAP',
    description: 'useEffect que intercambia bloques de DOM post-hidratación sin contenedor con min-h fija',
    check: (content) => {
      const violations = [];
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/useEffect\s*\(\s*\(\)\s*=>/i.test(line)) {
          // Si el archivo contiene useEffect y muta layouts sin min-h reservada
          if (content.includes('setIsMounted') || content.includes('setHydrated')) {
            if (!content.includes('min-h-') && !content.includes('h-[')) {
              violations.push({ line: idx + 1, snippet: line.trim() });
            }
          }
        }
      });
      return violations;
    }
  },
  {
    id: 'R6_BANNER_NO_RESERVE',
    description: 'Aviso o banner condicional sin reserva geométrica fija (min-h-[xxx])',
    check: (content) => {
      const violations = [];
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        // Detecta banners de alerta montados condicionalmente {status === 'error' && <div...} sin min-h
        if (/\{[^}]*(?:error|alert|warning|banner)[^}]*&&/i.test(line)) {
          if (!/min-h-|h-\[/i.test(line)) {
            violations.push({ line: idx + 1, snippet: line.trim() });
          }
        }
      });
      return violations;
    }
  },
  {
    id: 'R7_ANIMATE_LAYOUT',
    description: 'Animación o transición de propiedades de layout (height/width/margin/padding/top/left)',
    check: (content) => {
      const violations = [];
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/transition-(?:height|width|top|left|margin|padding)|animate-\[height/i.test(line)) {
          violations.push({ line: idx + 1, snippet: line.trim() });
        }
      });
      return violations;
    }
  },
  {
    id: 'R8_WSCREEN_O_VH',
    description: 'Uso de w-screen o 100vh en cabecera/hero (genera scrollbar parásito y layout shift)',
    check: (content) => {
      const violations = [];
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/\bw-screen\b/i.test(line)) {
          violations.push({ line: idx + 1, snippet: line.trim() });
        }
        if (/\bh-screen\b/i.test(line) && !line.includes('min-h-screen')) {
          violations.push({ line: idx + 1, snippet: line.trim() });
        }
      });
      return violations;
    }
  }
];

const results = [];
let totalViolations = 0;

for (const route of routes) {
  const targetFiles = ROUTE_FILE_MAP[route] || [
    path.join('src/app', route.replace(/^\//, ''), 'page.tsx')
  ];

  const routeViolations = [];

  for (const relFile of targetFiles) {
    const absPath = path.join(ROOT, relFile);
    if (!fs.existsSync(absPath)) continue;

    const content = fs.readFileSync(absPath, 'utf8');

    for (const rule of RULES) {
      const matched = rule.check(content);
      for (const v of matched) {
        routeViolations.push({
          rule: rule.id,
          file: relFile,
          line: v.line,
          severity: 'ERROR',
          snippet: v.snippet
        });
      }
    }
  }

  totalViolations += routeViolations.length;

  results.push({
    route,
    filesChecked: targetFiles,
    violationsCount: routeViolations.length,
    violations: routeViolations,
    budget: 0.05,
    verdict: routeViolations.length === 0 ? 'PASS' : 'FAIL'
  });
}

const checkedAt = new Date().toISOString();
const allPassed = totalViolations === 0;

const outputPayload = {
  probed: false,
  source: 'static',
  mode: 'SIMULADO',
  estimatedCls: null,
  disclaimer: 'Presupuesto estático de layout-shift; el CLS p75 real exige RUM/CrUX con datos de campo.',
  rulesCount: RULES.length,
  totalViolations,
  checkedAt,
  routes: results
};

if (writeReport) {
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }
  fs.writeFileSync(
    path.join(REPORT_DIR, 'cls_budget.json'),
    JSON.stringify(outputPayload, null, 2),
    'utf8'
  );
}

if (jsonOnly) {
  console.log(JSON.stringify(outputPayload, null, 2));
} else {
  for (const r of results) {
    console.log(
      `CLS_BUDGET_ROUTE=${r.route} RULES=${RULES.length} VIOLATIONS=${r.violationsCount} BUDGET=0.05 MODE=SIMULADO SOURCE=static PROBED=false CHECKED_AT=${checkedAt}`
    );
    console.log(`CLS_BUDGET_VERDICT=${r.verdict}`);
    if (r.violations.length > 0) {
      for (const v of r.violations) {
        console.log(`  ❌ [${v.rule}] ${v.file}:${v.line} -> ${v.snippet}`);
      }
    }
  }
}

if (strict && !allPassed) {
  process.exit(1);
} else {
  process.exit(0);
}

