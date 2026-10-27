#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITORÍA ANTI-PICARESCA · EXPOSICIÓN DE TELÉFONOS DE ENTIDADES
 * ════════════════════════════════════════════════════════════════════════════
 * Doctrina del CEO: ningún teléfono/WhatsApp de una entidad de las categorías
 * de proveedores o artistas puede mostrarse si no ha pasado por caja o no es
 * cliente de pago.
 *
 * Este guardián recorre las superficies PÚBLICAS y falla (exit 1) si detecta:
 *   1. `tel:`/`wa.me` construidos directamente con `phone`/`telephone` de una
 *      entidad sin pasar por el gate (`gatedPhoneNumber` / `revealedPhone`).
 *   2. `hasDirectPhone` usado como semáforo de número visible.
 *   3. Atajos de fuga por buscador (`google.com/search?q=…telefono`).
 *
 * USO:  node scripts/audit_phone_exposure.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const SCAN_DIRS = ['src/app/(public)', 'src/components', 'src/features', 'src/app/artistas', 'src/app/fincas'];

/** Superficies internas excluidas (el operador sí ve el número). */
const EXCLUDED_SEGMENTS = [
  `${path.sep}(admin)${path.sep}`,
  `${path.sep}admin${path.sep}`,
  `${path.sep}(vendor)${path.sep}`,
  `${path.sep}vendor${path.sep}`,
  `${path.sep}api${path.sep}`,
  `${path.sep}(artist)${path.sep}`,
  `${path.sep}(dashboard)${path.sep}`,
];

/** Variables permitidas: ya han pasado por el contact gate. */
const GATED_IDENTIFIERS = [
  'revealedPhone',
  'gatedPhone',
  'gatedWhatsapp',
  'whatsappTarget',
  'maskedPhone',
  'CENTRALITA',
  // PEAJE SOBERANO (WAVE 40): el desvío a la Conserjería EAR OS es el único
  // camino autorizado para publicar contacto de un proveedor.
  'SOVEREIGN_DEMAND_CHANNEL',
  'buildDemandWhatsappUrl',
  'supplierLineMask',
  'maskPhoneForDisplay',
  'sanitizeSchemaContact',
  'sovereignContactPoint',
  'supplierContactWithheldNotice',
];

/**
 * Líneas de titularidad EAR OS autorizadas en superficie pública.
 * Cualquier otro número es una fuga de peaje.
 */
const SOVEREIGN_ALLOWED_DIGITS = new Set([
  '34693693048', // Centralita única · CEO Edwin Agudelo
  '34679286157', // Línea de prensa VIMUME (titularidad EAR OS)
]);

/** Formatos admitidos de un teléfono español (móvil/fijo). */
const PHONE_LITERAL_RE = /(?:\+34[\s.-]?)?\b[679]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}\b/g;

/** Link directo (`wa.me`/`tel:`) con cualquier número. */
const PHONE_LINK_RE = /(?:wa\.me\/|tel:)\+?(\d{9,15})/gi;

/** Interpolación JSX que pinta un campo de teléfono en el DOM (no `${}` de plantilla). */
const PHONE_RENDER_RE = /(?<!\$)\{[^{}\n]*(?:\bphone\b|\bphones\b|\btelephone\b)[^{}\n]*\}/;

/** Números de ejemplo (placeholders de formulario): no son líneas reales. */
const DUMMY_PHONE_DIGITS = new Set(['34600000000', '600000000', '34000000000']);

/** Contextos donde el número es un input del propio usuario o ya va enmascarado. */
const PHONE_RENDER_EXEMPT = [
  /formData\./,
  /defaultValue=/,
  /value=\{/,
  /placeholder=/,
  /onChange/,
  /maskPhoneForDisplay/,
  /maskedPhone/,
  /supplierLineMask/,
  /notifyPhone/,
  /setPhone/,
  /tel:\$\{/,
  /wa\.me\/\$\{/,
  // Literales de objeto (`{ ...p, phone: p.phone }`) no son render.
  /phone:\s/,
  // Comprobación de presencia que devuelve solo una etiqueta de texto.
  /\{\s*[\w.]*(?:phone|telephone)\s*\?/,
];

const RULES = [
  {
    id: 'DIRECT_TEL_LINK',
    description: 'Enlace tel: con teléfono de entidad sin gate',
    pattern: /tel:\$\{[^}]*\b(?:provider|vendor|artist|finca|lead|item|p)\.(?:phone|telephone)\b/gi,
  },
  {
    id: 'DIRECT_WHATSAPP_LINK',
    description: 'Enlace wa.me con teléfono de entidad sin gate',
    pattern: /wa\.me\/\$\{[^}]*\b(?:provider|vendor|artist|finca|item|p)\.(?:phone|telephone)\b/gi,
  },
  {
    id: 'HAS_DIRECT_PHONE_SELECTOR',
    description: 'hasDirectPhone decide el número visible sin consultar el tier',
    pattern: /hasDirectPhone\s*(?:&&|\?)[^;\n]{0,80}(?:phone|telephone)/gi,
  },
  {
    id: 'GOOGLE_PHONE_SEARCH',
    description: 'Atajo "buscar teléfono en Google" que burla el candado de 1 €',
    pattern: /google\.com\/search\?q=\$\{[^}]*telefono/gi,
  },
];

/**
 * Reglas sobre el fichero completo (multilínea).
 * El payload RSC de Next viaja al navegador: si un server component pasa el
 * teléfono real como prop a un client component, el número se filtra aunque
 * nunca se pinte. La prop debe ir enmascarada (`maskPhoneForDisplay`).
 */
const FILE_RULES = [
  {
    id: 'RSC_PROP_PHONE_LEAK',
    description: 'Prop de cliente con teléfono real de entidad (se serializa en el RSC)',
    pattern: /=\{\{[\s\S]{0,500}?phone:\s*(?:rawProvider|found|provider|item)\.(?:phone|telephone)\b/g,
  },
];

/**
 * Escáner del PEAJE SOBERANO (WAVE 40).
 * Detecta cualquier vía por la que el cliente pueda saltarse la Conserjería:
 *   1. Link `wa.me`/`tel:` con número que no es de titularidad EAR OS.
 *   2. Teléfono español literal en copy, JSON-LD o atributos.
 *   3. Interpolación JSX que pinta `phone`/`phones`/`telephone` sin enmascarar.
 */
function scanPeajeLeaks(line) {
  const findings = [];
  const digitsOf = (value) => String(value).replace(/\D/g, '');

  /** E.164 español: un fijo/móvil de 9 dígitos se prefija con 34. */
  const normalize = (digits) => (digits.length === 9 ? `34${digits}` : digits);

  /** Placeholders y números de ejemplo: no son líneas reales. */
  const isDummy = (digits) =>
    DUMMY_PHONE_DIGITS.has(digits) ||
    DUMMY_PHONE_DIGITS.has(normalize(digits)) ||
    /^\d{1,4}0{8,}\d?$/.test(digits) ||
    /^(?:34)?60{7}\d$/.test(digits);

  PHONE_LINK_RE.lastIndex = 0;
  let linkMatch = PHONE_LINK_RE.exec(line);
  while (linkMatch !== null) {
    const raw = digitsOf(linkMatch[1]);
    if (!SOVEREIGN_ALLOWED_DIGITS.has(normalize(raw)) && !isDummy(raw)) {
      findings.push({
        id: 'SUPPLIER_CONTACT_LINK',
        description: 'Enlace wa.me/tel: con línea ajena a EAR OS (fuga de peaje)',
      });
      break;
    }
    linkMatch = PHONE_LINK_RE.exec(line);
  }

  PHONE_LITERAL_RE.lastIndex = 0;
  let literalMatch = PHONE_LITERAL_RE.exec(line);
  while (literalMatch !== null) {
    const digits = digitsOf(literalMatch[0]);
    const isPlaceholder = /placeholder\s*=/.test(line);
    if (!SOVEREIGN_ALLOWED_DIGITS.has(normalize(digits)) && !isDummy(digits) && !isPlaceholder) {
      findings.push({
        id: 'SUPPLIER_PHONE_LITERAL',
        description: 'Teléfono de proveedor escrito en claro (copy, JSON-LD o atributo)',
      });
      break;
    }
    literalMatch = PHONE_LITERAL_RE.exec(line);
  }

  // Se analiza la estructura JSX sin literales de texto: `aria-describedby={
  // fieldErrors.clientPhone ? 'booking-client-phone-error' : undefined}` no es
  // una fuga, pero `{landing.phone}` sí.
  const structural = line.replace(/'[^']*'|"[^"]*"/g, '""');

  if (
    PHONE_RENDER_RE.test(structural) &&
    !PHONE_RENDER_EXEMPT.some((exempt) => exempt.test(structural)) &&
    !isGatedLine(structural)
  ) {
    findings.push({
      id: 'SUPPLIER_PHONE_RENDER',
      description: 'Campo de teléfono pintado en el DOM sin enmascarar ni pasar por el gate',
    });
  }

  return findings;
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(full, files);
    } else if (/\.(tsx|ts)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function isExcluded(file) {
  return EXCLUDED_SEGMENTS.some((segment) => file.includes(segment));
}

function isGatedLine(line) {
  return GATED_IDENTIFIERS.some((identifier) => line.includes(identifier));
}

const violations = [];
let scanned = 0;

for (const dir of SCAN_DIRS) {
  for (const file of walk(path.join(ROOT, dir))) {
    if (isExcluded(file)) continue;
    scanned += 1;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (isGatedLine(line)) return;
      for (const rule of RULES) {
        rule.pattern.lastIndex = 0;
        const match = rule.pattern.exec(line);
        if (!match) continue;
        violations.push({
          rule: rule.id,
          description: rule.description,
          file: path.relative(ROOT, file),
          line: index + 1,
          snippet: line.trim().slice(0, 160),
        });
        break;
      }

      // PEAJE SOBERANO: cualquier vía de contacto ajena a EAR OS es una fuga.
      for (const finding of scanPeajeLeaks(line)) {
        violations.push({
          rule: finding.id,
          description: finding.description,
          file: path.relative(ROOT, file),
          line: index + 1,
          snippet: line.trim().slice(0, 160),
        });
      }
    });

    // Reglas multilínea sobre el contenido completo.
    for (const rule of FILE_RULES) {
      rule.pattern.lastIndex = 0;
      const match = rule.pattern.exec(content);
      if (!match) continue;
      const line = content.slice(0, match.index).split(/\r?\n/).length;
      violations.push({
        rule: rule.id,
        description: rule.description,
        file: path.relative(ROOT, file),
        line,
        snippet: match[0].replace(/\s+/g, ' ').slice(0, 160),
      });
    }
  }
}

/* ── Contrato del gate: el módulo debe existir y ser fail-closed ─────────── */
const gatePath = path.join(ROOT, 'src', 'lib', 'providers', 'contact-gate.ts');
const gateExists = fs.existsSync(gatePath);
if (!gateExists) {
  violations.push({
    rule: 'GATE_MISSING',
    description: 'No existe src/lib/providers/contact-gate.ts (doctrina anti-picaresca)',
    file: 'src/lib/providers/contact-gate.ts',
    line: 0,
    snippet: '',
  });
} else {
  const gateSource = fs.readFileSync(gatePath, 'utf8');
  if (!/canRevealPhone:\s*false/.test(gateSource)) {
    violations.push({
      rule: 'GATE_NOT_FAIL_CLOSED',
      description: 'contact-gate.ts no contiene un camino con canRevealPhone:false',
      file: 'src/lib/providers/contact-gate.ts',
      line: 0,
      snippet: '',
    });
  }
}

const report = {
  doctrine: 'ANTI_PICARESCA_PHONE_WITHHELD_UNTIL_PAYMENT',
  scannedFiles: scanned,
  violations: violations.length,
  details: violations,
};

console.log(JSON.stringify(report, null, 2));

if (violations.length > 0) {
  console.error(
    `\n[ANTI-PICARESCA] ${violations.length} fuga(s) de contacto detectada(s). Corrige antes de desplegar.`,
  );
  process.exit(1);
}

console.log('\n[ANTI-PICARESCA] OK: ningún teléfono de entidad se publica fuera del gate.');
