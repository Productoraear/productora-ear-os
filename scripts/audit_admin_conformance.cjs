/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITORÍA AST DE CONFORMIDAD Y BRECHA ADMIN (/admin/*) · S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 * Inspecciona deterministamente cada ruta y subpágina de administración:
 *  - Mapeo contra los 8 Ejes Canónicos del Negocio.
 *  - Detección de acoplamiento SSOT vs Hardcoding.
 *  - Evaluación de conectividad Multi-Rail (Stripe, eIDAS, Facturae, etc.).
 *  - Tipado estricto Zod y contratos de datos.
 *  - Asignación de Nivel de Madurez (Nivel 1 Pasivo -> Nivel 5 Tier-1).
 *
 * Salida: src/lib/graph/admin-conformance-gap.json & Tabla en Consola.
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const ADMIN_DIR = path.join(ROOT_DIR, 'src', 'app', '(admin)', 'admin');
const OUTPUT_GAP_JSON = path.join(ROOT_DIR, 'src', 'lib', 'graph', 'admin-conformance-gap.json');

// Rutas excluidas de la auditoría de brecha (ya elevadas o reservadas)
const EXCLUDED_ROUTES = new Set(['oracle-compiler', 'war-room', 'cockpit']);

// Las 8 Dimensiones Operativas Canónicas
const DIMENSIONS = [
  { id: 'CLIENTES_NOVIOS', name: 'Clientes & Novios', keywords: ['novios', 'boda', 'seating', 'rsvp', 'comensal', 'pareja', 'pulpetti', 'mesa'] },
  { id: 'HOSTELERIA_FINCAS', name: 'Hostelería & Fincas', keywords: ['finca', 'catering', 'salon', 'aforo', 'recinto', 'restaurante', 'otzarreta', 'ezkertza', 'acustico', 'sonometria'] },
  { id: 'ARTISTAS_ESCENARIO', name: 'Artistas & Escenario', keywords: ['artista', 'solista', 'cache', 'bolo', 'actuacion', 'rider', 'agudelo', 'escenario'] },
  { id: 'PROVEEDORES_CATALOGO', name: 'Proveedores & Catálogo', keywords: ['proveedor', 'catalogo', 'luces', 'decoracion', 'material', 'producto', 'stock', 'homologacion'] },
  { id: 'B2G_AYUNTAMIENTOS', name: 'B2G & Ayuntamientos', keywords: ['b2g', 'ayuntamiento', 'licitacion', 'lcsp', 'dir3', 'facturae', 'pliego', 'festejos'] },
  { id: 'TESORERIA_SPLIT', name: 'Tesorería & Split 80/10/10', keywords: ['tesoreria', 'split', 'stripe', 'pago', 'cobro', 'liquidacion', 'factura', 'centimo', 'deposito'] },
  { id: 'LOGISTICA_FLEET', name: 'Logística & Flota', keywords: ['flota', 'furgon', 'transporte', 'ruta', 'waybill', 'montaje', 'kilometraje', 'sprinter', 'trifasica'] },
  { id: 'GOBERNANZA_SRE', name: 'Gobernanza & SRE', keywords: ['gobernanza', 'sentinel', 'ssot', 'compuerta', 'gate', 'telemetria', 'ast', 'auditoria', 'log', 'sre', 'ci'] },
];

// Identificadores de rieles de ejecución Multi-Rail
const MULTI_RAIL_IDENTIFIERS = [
  { rail: 'CONTRATO_EIDAS', keywords: ['buildPdf', 'executeEidasContract', 'contrato', 'eidas', 'firma-biometrica'] },
  { rail: 'STRIPE_CHECKOUT', keywords: ['stripe', 'checkout', 'executeStripeCheckout', 'price-lock', 'session_id'] },
  { rail: 'FACTURAE_B2G', keywords: ['Facturae', 'DIR3', 'executeExportFacturae', '3.2.2', 'LCSP'] },
  { rail: 'ORDEN_SALA_COCINA', keywords: ['Seating', 'alérgenos', 'executeOrdenSalaCocina', 'pulpetti', 'mesa-asiento'] },
  { rail: 'WAYBILL_LOGISTICA', keywords: ['waybill', 'executeWaybillLogistica', 'furgon', 'fleet', 'line-array'] },
  { rail: 'WEBHOOK_N8N', keywords: ['dispatch-n8n', 'executeWebhookN8n', 'n8n', 'webhook'] },
  { rail: 'MEGAPROMPT_OBRERO', keywords: ['megaprompt', 'executeMegapromptObrero', 'cline', 'blast-radius'] },
];

/** Recorre recursivamente un directorio para encontrar ficheros page.tsx */
function findPages(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findPages(fullPath));
    } else if (entry.isFile() && entry.name === 'page.tsx') {
      results.push(fullPath);
    }
  }
  return results;
}

/** Detecta la dimensión predominante a partir del contenido de texto y ruta */
function detectDimension(content, relPath) {
  const lower = (content + ' ' + relPath).toLowerCase();
  let bestDim = 'GOBERNANZA_SRE';
  let maxScore = 0;

  for (const dim of DIMENSIONS) {
    let score = 0;
    for (const kw of dim.keywords) {
      const occurrences = (lower.match(new RegExp(`\\b${kw}`, 'gi')) || []).length;
      score += occurrences;
    }
    if (score > maxScore) {
      maxScore = score;
      bestDim = dim.id;
    }
  }
  return bestDim;
}

/** Evalúa el grado de uso de SSOT frente a hardcoding */
function evaluateSsot(content) {
  const importsSsot =
    content.includes('@/lib/constants/ear-os-ssot') ||
    content.includes('ear-os-ssot') ||
    content.includes('entity-resolver') ||
    content.includes('constitution-tier1');

  // Búsqueda de cifras típicas de EAR OS quemadas como literales
  const hardcodedPatterns = [
    /\b350\b(?!\s*ms|\s*px)/,
    /\b550\b(?!\s*ms|\s*px)/,
    /\b14250\b/,
    /\b14\.250\b/,
    /\b80\/10\/10\b/,
    /\b75\s*dB\b/i,
  ];

  let hardcodedCount = 0;
  for (const pat of hardcodedPatterns) {
    if (pat.test(content) && !importsSsot) {
      hardcodedCount++;
    }
  }

  return {
    importsSsot,
    hasHardcoding: hardcodedCount > 0,
    score: importsSsot ? (hardcodedCount === 0 ? 'CONECTADO_SSOT' : 'HÍBRIDO') : 'HARDCODED',
  };
}

/** Evalúa la conexión con los rieles de ejecución */
function evaluateMultiRail(content) {
  const connectedRails = [];
  const lower = content.toLowerCase();

  for (const r of MULTI_RAIL_IDENTIFIERS) {
    const match = r.keywords.some((kw) => lower.includes(kw.toLowerCase()));
    if (match) {
      connectedRails.push(r.rail);
    }
  }

  return {
    isPassive: connectedRails.length === 0,
    connectedRails,
    count: connectedRails.length,
  };
}

/** Evalúa tipado Zod y esquemas estrictos */
function evaluateValidation(content) {
  const usesZod = content.includes('zod') || content.includes('transductive-schemas');
  const hasStrict = content.includes('.strict(');
  const usesTypesOnly = content.includes('interface ') || content.includes('type ');

  return {
    usesZod,
    hasStrict,
    isStrictContract: usesZod,
    typeStatus: usesZod ? (hasStrict ? 'ZOD_STRICT' : 'ZOD_SCHEMA') : usesTypesOnly ? 'TS_INTERFACE' : 'LAX',
  };
}

/** Calcula el Nivel de Madurez (1 a 5) */
function computeMaturityLevel(ssot, multiRail, validation) {
  let level = 1; // Nivel 1: Pasivo

  if (ssot.importsSsot) level += 1;
  if (validation.usesZod) level += 1;
  if (multiRail.count >= 1) level += 1;
  if (ssot.importsSsot && !ssot.hasHardcoding && validation.usesZod && multiRail.count >= 2) {
    level = 5; // Nivel 5: S-Class Tier-1 Conectado
  }

  return Math.min(5, Math.max(1, level));
}

/** Genera la deuda técnica y la acción recomendada */
function deriveDebtAndRecommendation(route, dimension, ssot, multiRail, validation, maturity) {
  const debts = [];
  const recs = [];

  if (!ssot.importsSsot) {
    debts.push('Cifras o textos no importan de ear-os-ssot.ts');
    recs.push('Enlazar constantes con ear-os-ssot.ts');
  } else if (ssot.hasHardcoding) {
    debts.push('Literales numéricos residuales');
    recs.push('Sustituir literales por constantes SSOT');
  }

  if (!validation.usesZod) {
    debts.push('Tipado laxo (sin validación Zod en runtime)');
    recs.push('Elevar a contrato Zod estricto');
  }

  if (multiRail.isPassive) {
    debts.push('Formulario/tabla pasiva sin Multi-Rail');
    recs.push(`Conectar disparador ejecutivo (${getDefaultRailForDimension(dimension)})`);
  }

  return {
    primaryDebt: debts.join('; ') || 'Ninguna crítica (Conforme)',
    recommendedAction: recs.join('; ') || 'Mantener certificación y telemetría AST',
  };
}

function getDefaultRailForDimension(dim) {
  switch (dim) {
    case 'CLIENTES_NOVIOS':
      return 'CONTRATO_EIDAS / STRIPE_CHECKOUT';
    case 'HOSTELERIA_FINCAS':
      return 'ORDEN_SALA_COCINA / CONTRATO_EIDAS';
    case 'ARTISTAS_ESCENARIO':
      return 'WAYBILL_LOGISTICA / STRIPE_CHECKOUT';
    case 'PROVEEDORES_CATALOGO':
      return 'WEBHOOK_N8N / STRIPE_CHECKOUT';
    case 'B2G_AYUNTAMIENTOS':
      return 'FACTURAE_B2G / CONTRATO_EIDAS';
    case 'TESORERIA_SPLIT':
      return 'STRIPE_CHECKOUT / WEBHOOK_N8N';
    case 'LOGISTICA_FLEET':
      return 'WAYBILL_LOGISTICA';
    case 'GOBERNANZA_SRE':
    default:
      return 'MEGAPROMPT_OBRERO / WEBHOOK_N8N';
  }
}

function runAudit() {
  console.log('════════════════════════════════════════════════════════════════════════════════');
  console.log('🏛️ AUDITORÍA AST DE CONFORMIDAD Y BRECHA ADMIN (/admin/*) · EAR OS TIER-1');
  console.log('════════════════════════════════════════════════════════════════════════════════');

  const allPagePaths = findPages(ADMIN_DIR);
  const auditEntries = [];

  for (const pagePath of allPagePaths) {
    const relFromAdmin = path.relative(ADMIN_DIR, pagePath).replace(/\\/g, '/');
    const routeSegment = path.dirname(relFromAdmin);
    const topLevelFolder = routeSegment.split('/')[0] || 'root';

    // Omitir rutas excluidas
    if (EXCLUDED_ROUTES.has(topLevelFolder)) {
      continue;
    }

    const routeUrl = `/admin/${routeSegment === '.' ? '' : routeSegment}`.replace(/\/$/, '');
    const content = fs.readFileSync(pagePath, 'utf8');

    // Analizar la página
    const dimension = detectDimension(content, relFromAdmin);
    const ssot = evaluateSsot(content);
    const multiRail = evaluateMultiRail(content);
    const validation = evaluateValidation(content);
    const maturity = computeMaturityLevel(ssot, multiRail, validation);
    const { primaryDebt, recommendedAction } = deriveDebtAndRecommendation(
      routeUrl,
      dimension,
      ssot,
      multiRail,
      validation,
      maturity
    );

    auditEntries.push({
      routeUrl: routeUrl || '/admin',
      fileRelPath: `src/app/(admin)/admin/${relFromAdmin}`,
      dimension,
      maturityLevel: maturity,
      maturityLabel: `Nivel ${maturity}: ${getMaturityTitle(maturity)}`,
      ssotStatus: ssot.score,
      multiRailConnected: !multiRail.isPassive,
      connectedRails: multiRail.connectedRails,
      validationStatus: validation.typeStatus,
      primaryDebt,
      recommendedAction,
    });
  }

  // Ordenar por Nivel de Madurez ascendente (más críticos primero) y luego por ruta
  auditEntries.sort((a, b) => a.maturityLevel - b.maturityLevel || a.routeUrl.localeCompare(b.routeUrl));

  // Generar Reporte JSON
  const report = {
    generatedAt: new Date().toISOString(),
    totalAuditedPages: auditEntries.length,
    maturityDistribution: {
      nivel1_pasivo: auditEntries.filter((e) => e.maturityLevel === 1).length,
      nivel2_asistido: auditEntries.filter((e) => e.maturityLevel === 2).length,
      nivel3_validado: auditEntries.filter((e) => e.maturityLevel === 3).length,
      nivel4_integrado: auditEntries.filter((e) => e.maturityLevel === 4).length,
      nivel5_tier1_sclass: auditEntries.filter((e) => e.maturityLevel === 5).length,
    },
    multiRailConnectivity: {
      connected: auditEntries.filter((e) => e.multiRailConnected).length,
      isolated: auditEntries.filter((e) => !e.multiRailConnected).length,
    },
    entries: auditEntries,
  };

  fs.mkdirSync(path.dirname(OUTPUT_GAP_JSON), { recursive: true });
  fs.writeFileSync(OUTPUT_GAP_JSON, JSON.stringify(report, null, 2), 'utf8');

  // Imprimir Tabla de Diagnóstico
  printConsoleTable(auditEntries);

  console.log('\n────────────────────────────────────────────────────────────────────────────────');
  console.log(`[PASS] Total Páginas Auditadas : ${auditEntries.length} (excluyendo cockpit, oracle-compiler, war-room)`);
  console.log(`[PASS] Nivel 1 (Pasivo)        : ${report.maturityDistribution.nivel1_pasivo}`);
  console.log(`[PASS] Nivel 2 (Asistido)      : ${report.maturityDistribution.nivel2_asistido}`);
  console.log(`[PASS] Nivel 3 (Validado)      : ${report.maturityDistribution.nivel3_validado}`);
  console.log(`[PASS] Nivel 4 (Integrado)     : ${report.maturityDistribution.nivel4_integrado}`);
  console.log(`[PASS] Nivel 5 (Tier-1 SOTA)   : ${report.maturityDistribution.nivel5_tier1_sclass}`);
  console.log(`[PASS] Conectadas a Multi-Rail : ${report.multiRailConnectivity.connected} / ${auditEntries.length}`);
  console.log(`[PASS] Informe Guardado        : ${path.relative(ROOT_DIR, OUTPUT_GAP_JSON)}`);
  console.log('════════════════════════════════════════════════════════════════════════════════');
}

function getMaturityTitle(level) {
  switch (level) {
    case 1:
      return 'Pasivo (Vista estática)';
    case 2:
      return 'Asistido (Fetch básico)';
    case 3:
      return 'Validado (Tipado/Zod)';
    case 4:
      return 'Integrado (Multi-Rail parcial)';
    case 5:
      return 'Tier-1 S-Class Conectado';
    default:
      return 'Indefinido';
  }
}

function printConsoleTable(entries) {
  console.log(
    pad('RUTA', 26) +
    pad('DIMENSIÓN', 22) +
    pad('MADUREZ', 10) +
    pad('SSOT', 16) +
    pad('MULTI-RAIL', 14) +
    'DEUDA / ACCIÓN RECOMENDADA'
  );
  console.log('─'.repeat(110));

  for (const e of entries) {
    const dimShort = e.dimension.replace('_', ' ');
    const railStr = e.multiRailConnected ? `SI (${e.connectedRails.length})` : 'NO (Aislado)';
    const debtRec = `${e.primaryDebt} -> [${e.recommendedAction}]`;

    console.log(
      pad(e.routeUrl, 26) +
      pad(dimShort, 22) +
      pad(`Nivel ${e.maturityLevel}`, 10) +
      pad(e.ssotStatus, 16) +
      pad(railStr, 14) +
      debtRec.slice(0, 50) + (debtRec.length > 50 ? '...' : '')
    );
  }
}

function pad(str, len) {
  const s = String(str || '');
  if (s.length >= len) return s.slice(0, len - 1) + ' ';
  return s + ' '.repeat(len - s.length);
}

runAudit();
process.exit(0);
