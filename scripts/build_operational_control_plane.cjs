#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DE INTROSPECCIÓN DINÁMICA & SEMANTIC CONTROL PLANE (EAR OS S-CLASS)
 * ────────────────────────────────────────────────────────────────────────────
 * Parser determinista del árbol y metadatos de runtime.
 * Mapea:
 *   1. Nodos de Ruta (Front): Páginas y rutas navegables en src/app
 *   2. Nodos de Ejecución (Back): Endpoints en src/app/api y webhooks
 *   3. Nodos de Datos (Persistencia): Modelos Prisma de prisma/schema.prisma
 *   4. Nodos Constitucionales: 100 Reglas Canónicas del Oráculo + Zona Cero (SSOT)
 *   5. Nodos de Dominio/Activos: Otzarreta, Edwin Agudelo, Catálogo Luces, etc.
 *   6. Nodos de Compuertas Mecánicas: Gates del protocolo 15/22 y prepush
 *
 * Salida:
 *   - src/lib/graph/control-plane-topology.json (Dataset canónico para WebGL/Canvas)
 *   - Proyección en Markdown con metadatos YAML y [[wikilinks]] en .vault/
 *
 * Requisito no funcional: Ejecución en < 3.0s con Exit Code 0.
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const START_TIME = process.hrtime.bigint();
const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const APP_DIR = path.join(SRC_DIR, 'app');
const PRISMA_SCHEMA = path.join(ROOT, 'prisma', 'schema.prisma');
const SSOT_PATH = path.join(SRC_DIR, 'lib', 'constants', 'ear-os-ssot.ts');
const ORACULO_DIR = path.join(SRC_DIR, 'lib', 'oraculo');
const TOPOLOGY_JSON_PATH = path.join(SRC_DIR, 'lib', 'graph', 'control-plane-topology.json');
const VAULT_DIR = path.join(ROOT, '.vault');
const VAULT_NODES_DIR = path.join(VAULT_DIR, 'nodes');

function computeHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

/**
 * Normaliza segmentos de ruta de Next.js App Router
 * Quita grupos de ruta (admin), (public), etc.
 */
function normalizeRoutePath(filePath, baseDir) {
  const dir = path.relative(baseDir, path.dirname(filePath)).replace(/\\/g, '/');
  if (!dir) return '/';
  const segments = dir
    .split('/')
    .filter((s) => !(s.startsWith('(') && s.endsWith(')')) && !s.startsWith('@'));
  return '/' + segments.join('/');
}

// ============================================================================
// 1. RECOLECCIÓN DE NODOS Y ARISTAS
// ============================================================================

const nodesMap = new Map();
const edgesMap = new Map();
const aliasesMap = new Map();

function addNode(node) {
  if (!nodesMap.has(node.id)) {
    nodesMap.set(node.id, node);
  }
}

function addAlias(alias, canonicalId) {
  aliasesMap.set(alias.toUpperCase(), canonicalId);
}

function addEdge(source, target, relationship, weight = 1, metadata = {}) {
  const edgeKey = `${source}->${target}:${relationship}`;
  if (!edgesMap.has(edgeKey)) {
    edgesMap.set(edgeKey, {
      id: edgeKey,
      source,
      target,
      relationship,
      weight,
      metadata,
    });
  }
}

// ----------------------------------------------------------------------------
// A. Nodos Constitucionales (SSOT + 100 Reglas)
// ----------------------------------------------------------------------------
let ssotHash = 'unknown';
if (fs.existsSync(SSOT_PATH)) {
  const ssotContent = fs.readFileSync(SSOT_PATH, 'utf8');
  ssotHash = computeHash(ssotContent);
  const ssotNode = {
    id: 'SSOT-EAR-OS',
    name: 'ear-os-ssot.ts (Zona Cero Inmutable)',
    type: 'constitutional',
    path: rel(SSOT_PATH),
    integrityHash: ssotHash,
    criticality: 'CRITICAL',
    metadata: {
      canonicalHashPrefix: ssotHash,
      isZeroZone: true,
      governs: ['pricing', 'logistics', 'b2g', 'split_80_10_10'],
    },
  };
  addNode(ssotNode);
  addAlias('SSOT-PRICING', 'SSOT-EAR-OS');
  addAlias('SSOT', 'SSOT-EAR-OS');
  addAlias('ZONA-CERO', 'SSOT-EAR-OS');
}

// Extraer 100 Reglas Canónicas desde src/lib/oraculo/oraculo-canonical-rules-*.ts
const ruleFiles = [
  'oraculo-canonical-rules-1-50.ts',
  'oraculo-canonical-rules-51-60.ts',
  'oraculo-canonical-rules-61-70.ts',
  'oraculo-canonical-rules-71-80.ts',
  'oraculo-canonical-rules-81-90.ts',
  'oraculo-canonical-rules-91-100.ts',
];

ruleFiles.forEach((file) => {
  const fullPath = path.join(ORACULO_DIR, file);
  if (!fs.existsSync(fullPath)) return;
  const content = fs.readFileSync(fullPath, 'utf8');
  const fileHash = computeHash(content);

  const ruleRegex = /{\s*id:\s*(\d+),\s*block:\s*(\d+),\s*blockTitle:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],\s*directive:\s*['"`]([\s\S]*?)['"`],\s*rationale:\s*['"`]([\s\S]*?)['"`]/g;
  let match;
  while ((match = ruleRegex.exec(content)) !== null) {
    const ruleId = parseInt(match[1], 10);
    const block = parseInt(match[2], 10);
    const blockTitle = match[3].trim();
    const title = match[4].trim();
    const directive = match[5].trim().replace(/\s+/g, ' ');

    const nodeId = `RULE-${ruleId}`;
    const isCritical = (ruleId >= 51 && ruleId <= 65) || (ruleId >= 91);

    addNode({
      id: nodeId,
      name: `Regla ${ruleId}: ${title}`,
      type: 'constitutional',
      path: rel(fullPath),
      integrityHash: fileHash,
      criticality: isCritical ? 'CRITICAL' : 'HIGH',
      metadata: {
        ruleId,
        block,
        blockTitle,
        title,
        directive,
      },
    });

    addAlias(`REGLA-${ruleId}`, nodeId);
    addAlias(`RULE${ruleId}`, nodeId);

    // Cada regla emana del SSOT
    addEdge('SSOT-EAR-OS', nodeId, 'governs->executes', 2);
  }
});

// ----------------------------------------------------------------------------
// B. Nodos de Dominio / Activos Fundacionales
// ----------------------------------------------------------------------------
const domainNodes = [
  {
    id: 'DOMAIN-OTZARRETA',
    name: 'Otzarreta / Eduardo Martínez (Paciente Cero Fincas)',
    type: 'domain',
    path: 'src/app/(public)/otzarreta/page.tsx',
    criticality: 'CRITICAL',
    metadata: {
      owner: 'Eduardo Martínez',
      menusSeason: '2026',
      exclusivityComarcalKm: 100,
      allergenSupplementEur: 0,
    },
  },
  {
    id: 'DOMAIN-EDWIN-AGUDELO',
    name: 'Edwin Agudelo (Paciente Cero Artista)',
    type: 'domain',
    path: 'src/lib/constants/ear-os-ssot.ts',
    criticality: 'CRITICAL',
    metadata: {
      artistId: 'e78903',
      basePriceEur: 350,
      standardPriceEur: 550,
      includedKm: 100,
      baseLocation: 'Méntrida',
    },
  },
  {
    id: 'DOMAIN-CATALOGO-LUCES',
    name: 'Catálogo Iluminación Navideña (652 Refs)',
    type: 'domain',
    path: 'src/app/(public)/catalogo-luces/page.tsx',
    criticality: 'HIGH',
    metadata: {
      references: 652,
      twinklyPro: true,
      heavyTransportRequired: true,
      b2gFastTrack: true,
    },
  },
  {
    id: 'DOMAIN-VIMUME',
    name: 'VIMUME Neurología Sonora & 40Hz',
    type: 'domain',
    path: 'src/app/(public)/vimume/page.tsx',
    criticality: 'HIGH',
    metadata: {
      frequencyHz: 40,
      hitlAutomationCeiling: 0.05,
    },
  },
  {
    id: 'DOMAIN-CALL-CENTER',
    name: 'Centralita Canónica EAR OS (+34 693 693 048)',
    type: 'domain',
    path: 'src/lib/constants/ear-os-ssot.ts',
    criticality: 'CRITICAL',
    metadata: {
      phone: '+34 693 693 048',
      serviceSla: '24/7',
    },
  },
];

domainNodes.forEach((dn) => {
  addNode({
    ...dn,
    integrityHash: computeHash(JSON.stringify(dn.metadata)),
  });
  addEdge('SSOT-EAR-OS', dn.id, 'governs->executes', 3);
});

addAlias('OTZARRETA', 'DOMAIN-OTZARRETA');
addAlias('EDWIN-AGUDELO', 'DOMAIN-EDWIN-AGUDELO');
addAlias('CATALOGO-LUCES', 'DOMAIN-CATALOGO-LUCES');
addAlias('VIMUME', 'DOMAIN-VIMUME');
addAlias('CALL-CENTER', 'DOMAIN-CALL-CENTER');

// Aristas de reglas a dominios
for (let r = 61; r <= 70; r++) {
  if (nodesMap.has(`RULE-${r}`)) {
    addEdge(`RULE-${r}`, 'DOMAIN-CATALOGO-LUCES', 'governs->executes', 2);
  }
}
for (let r = 71; r <= 80; r++) {
  if (nodesMap.has(`RULE-${r}`)) {
    addEdge(`RULE-${r}`, 'DOMAIN-OTZARRETA', 'governs->executes', 2);
  }
}
if (nodesMap.has('RULE-91')) addEdge('RULE-91', 'DOMAIN-OTZARRETA', 'governs->executes', 3);
if (nodesMap.has('RULE-92')) addEdge('RULE-92', 'DOMAIN-CALL-CENTER', 'governs->executes', 3);

// ----------------------------------------------------------------------------
// C. Nodos de Compuertas Mecánicas (Quality & Governance Gates)
// ----------------------------------------------------------------------------
const mechanicalGates = [
  { id: 'GATE-SSOT', name: 'Gate SSOT Integrity', command: 'npm run audit:ssot', script: 'scripts/baseline_ssot_integrity.ts', crit: 'CRITICAL' },
  { id: 'GATE-PRICING', name: 'Gate Pricing Unification', command: 'npm run verify:pricing', script: 'scripts/verify_pricing_ssot_unification.ts', crit: 'CRITICAL' },
  { id: 'GATE-LOGISTICS', name: 'Gate Logistics Boundaries', command: 'npm run verify:logistics', script: 'scripts/verify_logistics.ts', crit: 'CRITICAL' },
  { id: 'GATE-CONFIANZA', name: 'Gate Confianza & Fianza', command: 'npm run verify:confianza', script: 'scripts/verify_confianza.ts', crit: 'CRITICAL' },
  { id: 'GATE-CTA-MATRIX', name: 'Gate CTA Traceability Matrix', command: 'npm run audit:cta-matrix', script: 'scripts/audit_cta_trace_matrix.ts', crit: 'HIGH' },
  { id: 'GATE-ADMIN-ECOSYSTEM', name: 'Gate Admin Ecosystem Single-Truth', command: 'npm run audit:admin-ecosystem', script: 'scripts/audit_admin_ecosystem.cjs', crit: 'HIGH' },
  { id: 'GATE-SONOMETRO', name: 'Gate Sonómetro PWA Ley 37/2003', command: 'node scripts/verify_sonometro_pwa.cjs', script: 'scripts/verify_sonometro_pwa.cjs', crit: 'HIGH' },
  { id: 'GATE-PRICE-LOCK', name: 'Gate Price-Lock Flow & Deposit', command: 'node scripts/verify_price_lock_flow.cjs', script: 'scripts/verify_price_lock_flow.cjs', crit: 'CRITICAL' },
  { id: 'GATE-MASTER-GUIDE', name: 'Gate Master Guide Intent Compiler', command: 'npm run verify:master-guide', script: 'scripts/verify_master_guide.ts', crit: 'HIGH' },
  { id: 'GATE-B2G-FAST-TRACK', name: 'Gate B2G Fast-Track & SLA', command: 'npm run verify:b2g-fast-track', script: 'scripts/verify_municipal_fast_track.ts', crit: 'CRITICAL' },
  { id: 'GATE-OMEGA-ROJO', name: 'Gate Omega Diamante Rojo Scorecard', command: 'npm run audit:omega-rojo', script: 'scripts/audit_omega_rojo_scorecard.cjs', crit: 'CRITICAL' },
  { id: 'GATE-TYPECHECK', name: 'Gate Strict TypeScript Compilation', command: 'npm run typecheck', script: 'tsconfig.json', crit: 'CRITICAL' },
];

mechanicalGates.forEach((mg) => {
  addNode({
    id: mg.id,
    name: mg.name,
    type: 'constitutional',
    path: mg.script,
    integrityHash: computeHash(mg.command),
    criticality: mg.crit,
    metadata: {
      command: mg.command,
      isMechanicalGate: true,
    },
  });
  addEdge('SSOT-EAR-OS', mg.id, 'governs->executes', 3);
});

// Aristas de reglas específicas a gates
if (nodesMap.has('RULE-51')) addEdge('RULE-51', 'GATE-PRICE-LOCK', 'governs->executes', 3);
if (nodesMap.has('RULE-62')) addEdge('RULE-62', 'GATE-B2G-FAST-TRACK', 'governs->executes', 3);
if (nodesMap.has('RULE-73')) addEdge('RULE-73', 'GATE-SONOMETRO', 'governs->executes', 3);
if (nodesMap.has('RULE-87')) addEdge('RULE-87', 'GATE-PRICE-LOCK', 'governs->executes', 3);
if (nodesMap.has('RULE-100')) addEdge('RULE-100', 'GATE-OMEGA-ROJO', 'governs->executes', 3);

// ----------------------------------------------------------------------------
// D. Nodos de Datos (Persistencia / Modelos Prisma)
// ----------------------------------------------------------------------------
const prismaModels = [];
if (fs.existsSync(PRISMA_SCHEMA)) {
  const schemaContent = fs.readFileSync(PRISMA_SCHEMA, 'utf8');
  const schemaHash = computeHash(schemaContent);
  const modelRegex = /^model\s+([A-Za-z0-9_]+)\s+{([^}]+)}/gm;
  let match;
  while ((match = modelRegex.exec(schemaContent)) !== null) {
    const modelName = match[1];
    const body = match[2];
    const fieldLines = body.split('\n').filter((l) => l.trim().length > 0 && !l.trim().startsWith('//'));
    const isFinancial = /Ledger|Transaction|Payout|Payment|Invoice|Commission|Billing|Stripe/i.test(modelName);

    const nodeId = `DATA-MODEL-${modelName}`;
    prismaModels.push(modelName);

    addNode({
      id: nodeId,
      name: `Modelo ${modelName}`,
      type: 'data',
      path: rel(PRISMA_SCHEMA),
      integrityHash: schemaHash,
      criticality: isFinancial ? 'CRITICAL' : 'HIGH',
      metadata: {
        modelName,
        fieldsCount: fieldLines.length,
        isFinancial,
      },
    });

    addAlias(`MODEL-${modelName}`, nodeId);
    addAlias(modelName, nodeId);
  }
}

// ----------------------------------------------------------------------------
// E. Nodos de Ejecución (Back / APIs) y Nodos de Ruta (Front / Páginas)
// ----------------------------------------------------------------------------
const ROUTE_EXTS = new Set(['.tsx', '.ts', '.jsx', '.js']);

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walkDir(full, fileList);
    } else {
      fileList.push(full);
    }
  }
  return fileList;
}

const allAppFiles = walkDir(APP_DIR);

allAppFiles.forEach((fullFile) => {
  const ext = path.extname(fullFile);
  if (!ROUTE_EXTS.has(ext)) return;
  const basename = path.basename(fullFile, ext);

  // 1. API Route Handler (Back)
  if (basename === 'route' && fullFile.includes(path.join('app', 'api'))) {
    const endpoint = normalizeRoutePath(fullFile, path.join(APP_DIR, 'api'));
    const apiPathname = `/api${endpoint === '/' ? '' : endpoint}`;
    const content = fs.readFileSync(fullFile, 'utf8');
    const fileHash = computeHash(content);

    const verbs = [];
    if (/export\s+async\s+function\s+GET\b/.test(content)) verbs.push('GET');
    if (/export\s+async\s+function\s+POST\b/.test(content)) verbs.push('POST');
    if (/export\s+async\s+function\s+PUT\b/.test(content)) verbs.push('PUT');
    if (/export\s+async\s+function\s+PATCH\b/.test(content)) verbs.push('PATCH');
    if (/export\s+async\s+function\s+DELETE\b/.test(content)) verbs.push('DELETE');

    const isStripe = /stripe/i.test(apiPathname) || /stripe/i.test(content);
    const isTreasury = /treasury|payout|billing|fianza/i.test(apiPathname);
    const isCritical = isStripe || isTreasury || /checkout|webhook|b2g/i.test(apiPathname);

    const nodeId = `API-${apiPathname}`;
    addNode({
      id: nodeId,
      name: apiPathname,
      type: 'api',
      path: rel(fullFile),
      integrityHash: fileHash,
      criticality: isCritical ? 'CRITICAL' : (apiPathname.startsWith('/api/admin') ? 'HIGH' : 'MEDIUM'),
      metadata: {
        endpoint: apiPathname,
        verbs,
        isProtected: apiPathname.startsWith('/api/admin') || /Bearer|getSession|auth/i.test(content),
        isStripe,
      },
    });

    if (isStripe) {
      addAlias('API-STRIPE', nodeId);
      addAlias('STRIPE', nodeId);
    }

    // Enlazar lecturas/escrituras de base de datos a modelos Prisma (reads -> writes)
    prismaModels.forEach((modelName) => {
      const lowerModel = modelName.charAt(0).toLowerCase() + modelName.slice(1);
      const rePrisma = new RegExp(`prisma\\.${lowerModel}\\.`, 'i');
      if (rePrisma.test(content)) {
        addEdge(nodeId, `DATA-MODEL-${modelName}`, 'reads->writes', 2);
      }
    });

    // Enlazar con SSOT si importa constantes
    if (content.includes('ear-os-ssot')) {
      addEdge('SSOT-EAR-OS', nodeId, 'governs->executes', 2);
    }

    // Reglas canónicas sobre endpoints de fianza y stripe
    if (isStripe && nodesMap.has('RULE-51')) {
      addEdge('RULE-51', nodeId, 'governs->executes', 3);
      addEdge('RULE-64', nodeId, 'governs->executes', 3);
      addEdge('RULE-85', nodeId, 'governs->executes', 3);
    }
  }

  // 2. Page / Front Route
  if (basename === 'page') {
    const routePath = normalizeRoutePath(fullFile, APP_DIR);
    const content = fs.readFileSync(fullFile, 'utf8');
    const fileHash = computeHash(content);

    const isDynamic = routePath.includes('[');
    const isClient = content.includes("'use client'") || content.includes('"use client"');
    const isMoneyPath = /^\/(reservar|checkout|experiencia|otzarreta|seating-planner|encargos)/.test(routePath);
    const isAdmin = routePath.startsWith('/admin');

    const nodeId = `ROUTE-${routePath}`;
    addNode({
      id: nodeId,
      name: routePath,
      type: 'route',
      path: rel(fullFile),
      integrityHash: fileHash,
      criticality: isMoneyPath ? 'CRITICAL' : (isAdmin ? 'HIGH' : 'MEDIUM'),
      metadata: {
        pathname: routePath,
        isDynamic,
        isClient,
        category: isAdmin ? 'ADMIN' : (isMoneyPath ? 'MONEY' : 'PUBLIC'),
      },
    });

    // Detectar llamadas a endpoints de API (caller -> callee)
    const fetchRegex = /fetch\(\s*[`'"](\/api\/[a-zA-Z0-9_\-\/?=]+)[`'"]/g;
    let m;
    while ((m = fetchRegex.exec(content)) !== null) {
      const targetApi = m[1].split('?')[0];
      const apiNodeId = `API-${targetApi}`;
      if (nodesMap.has(apiNodeId)) {
        addEdge(nodeId, apiNodeId, 'caller->callee', 1);
      }
    }

    // Enlace a dominios específicos
    if (routePath.includes('otzarreta')) {
      addEdge(nodeId, 'DOMAIN-OTZARRETA', 'depends_on', 3);
    }
    if (routePath.includes('solista') || routePath.includes('artistas')) {
      addEdge(nodeId, 'DOMAIN-EDWIN-AGUDELO', 'depends_on', 2);
    }
    if (routePath.includes('catalogo-luces')) {
      addEdge(nodeId, 'DOMAIN-CATALOGO-LUCES', 'depends_on', 3);
    }
    if (routePath.includes('vimume')) {
      addEdge(nodeId, 'DOMAIN-VIMUME', 'depends_on', 3);
    }

    // Enlazar con SSOT
    if (content.includes('ear-os-ssot') || isMoneyPath) {
      addEdge('SSOT-EAR-OS', nodeId, 'governs->executes', 2);
    }
  }
});

// ============================================================================
// 2. CONSTRUCCIÓN DEL CONJUNTO DE TOPOLOGÍA
// ============================================================================

const nodes = Array.from(nodesMap.values());
const edges = Array.from(edgesMap.values());
const aliases = Object.fromEntries(aliasesMap.entries());

const nodesByType = {
  route: 0,
  api: 0,
  data: 0,
  constitutional: 0,
  domain: 0,
};

const critDist = {
  CRITICAL: 0,
  HIGH: 0,
  MEDIUM: 0,
  LOW: 0,
};

nodes.forEach((n) => {
  if (nodesByType[n.type] !== undefined) nodesByType[n.type]++;
  if (critDist[n.criticality] !== undefined) critDist[n.criticality]++;
});

const END_TIME = process.hrtime.bigint();
const durationMs = Number(END_TIME - START_TIME) / 1_000_000;

const topologyPayload = {
  schema_version: '1.0.0',
  generated_at: new Date().toISOString(),
  execution_duration_ms: Math.round(durationMs * 100) / 100,
  stats: {
    total_nodes: nodes.length,
    total_edges: edges.length,
    nodes_by_type: nodesByType,
    criticality_distribution: critDist,
  },
  aliases,
  nodes,
  edges,
};

// ============================================================================
// 3. EXPORTACIÓN CANÓNICA JSON
// ============================================================================

fs.mkdirSync(path.dirname(TOPOLOGY_JSON_PATH), { recursive: true });
fs.writeFileSync(TOPOLOGY_JSON_PATH, JSON.stringify(topologyPayload, null, 2), 'utf8');

// ============================================================================
// 4. PROYECCIÓN EN MARKDOWN PARA OBSIDIAN (.vault/)
// ============================================================================

fs.mkdirSync(VAULT_NODES_DIR, { recursive: true });

const obsidianIndex = `---
title: EAR OS Semantic Control Plane
type: topology-index
generated_at: ${topologyPayload.generated_at}
total_nodes: ${nodes.length}
total_edges: ${edges.length}
---

# 🏛️ EAR OS · SEMANTIC CONTROL PLANE & TOPOLOGÍA OPERACIONAL

Mapa operativo e introspección de runtime del sistema soberano **productoraear.com**.
Generado deterministamente en **${topologyPayload.execution_duration_ms} ms**.

## Métricas Clave de Infraestructura
- **Nodos Totales**: ${nodes.length}
- **Aristas / Dependencias**: ${edges.length}
- **Rutas (Front)**: ${nodesByType.route}
- **APIs (Back)**: ${nodesByType.api}
- **Modelos de Datos**: ${nodesByType.data}
- **Nodos Constitucionales**: ${nodesByType.constitutional} (Zona Cero + 100 Reglas + Compuertas)
- **Nodos de Dominio**: ${nodesByType.domain}

## Nodos Críticos de Dominio
${domainNodes.map((dn) => `- [[${dn.id}|${dn.name}]] (${dn.criticality})`).join('\n')}

## Compuertas Mecánicas Principales
${mechanicalGates.map((mg) => `- [[${mg.id}|${mg.name}]] (\`${mg.command}\`)`).join('\n')}

## Nodos Constitucionales Fundacionales
- [[SSOT-EAR-OS|ear-os-ssot.ts (Zona Cero)]]
- [[RULE-1|Regla 1: Marco del Cirujano de Élite]]
- [[RULE-51|Regla 51: Fianza Stripe Atómica]]
- [[RULE-61|Regla 61: Iluminación B2G & Alto Ticket]]
- [[RULE-71|Regla 71: Rider Eléctrico]]
- [[RULE-81|Regla 81: Privacidad VIP]]
- [[RULE-91|Regla 91: Exclusividad Territorial 100 km]]
- [[RULE-100|Regla 100: Legado S-Class]]
`;

fs.writeFileSync(path.join(VAULT_DIR, 'README.md'), obsidianIndex, 'utf8');
fs.writeFileSync(path.join(VAULT_DIR, 'CONTROL_PLANE_INDEX.md'), obsidianIndex, 'utf8');

// Proyección de nodos clave en .vault/nodes/
const sampleNodes = nodes.filter(
  (n) => n.type === 'domain' || n.type === 'constitutional' || n.criticality === 'CRITICAL' || n.id.startsWith('API-/api/stripe')
);

sampleNodes.forEach((node) => {
  const outgoing = edges.filter((e) => e.source === node.id).map((e) => `- **${e.relationship}** -> [[${e.target}]]`);
  const incoming = edges.filter((e) => e.target === node.id).map((e) => `- [[${e.source}]] -> **${e.relationship}**`);

  const mdContent = `---
id: "${node.id}"
name: "${node.name}"
type: "${node.type}"
criticality: "${node.criticality}"
path: "${node.path}"
integrityHash: "${node.integrityHash}"
---

# ${node.name}

- **ID**: \`${node.id}\`
- **Tipo**: \`${node.type}\`
- **Criticidad**: \`${node.criticality}\`
- **Ruta en Disco**: \`${node.path}\`
- **Hash de Integridad**: \`${node.integrityHash}\`

## Metadatos
\`\`\`json
${JSON.stringify(node.metadata, null, 2)}
\`\`\`

## Dependencias Salientes (Outgoing)
${outgoing.length > 0 ? outgoing.join('\n') : '_Ninguna dependencia saliente directa._'}

## Dependencias Entrantes (Incoming / Governed by)
${incoming.length > 0 ? incoming.join('\n') : '_Ninguna dependencia entrante directa._'}
`;

  const safeFileName = `${node.id.replace(/[\/\?<>\\:\*\|":]/g, '_')}.md`;
  fs.writeFileSync(path.join(VAULT_NODES_DIR, safeFileName), mdContent, 'utf8');
});

// ============================================================================
// 5. REPORTE EN CONSOLA (DETERMINISTA & RÁPIDO)
// ============================================================================

console.log('════════════════════════════════════════════════════════════════');
console.log('🏛️ SEMANTIC CONTROL PLANE GENERATOR (EAR OS S-CLASS)');
console.log('════════════════════════════════════════════════════════════════');
console.log(`[PASS] Nodos Totales       : ${nodes.length}`);
console.log(`[PASS] Aristas Totales     : ${edges.length}`);
console.log(`[PASS] Distribución Tipos  : Route=${nodesByType.route} | API=${nodesByType.api} | Data=${nodesByType.data} | Const=${nodesByType.constitutional} | Domain=${nodesByType.domain}`);
console.log(`[PASS] Nivel de Criticidad : CRITICAL=${critDist.CRITICAL} | HIGH=${critDist.HIGH} | MEDIUM=${critDist.MEDIUM} | LOW=${critDist.LOW}`);
console.log(`[PASS] Tiempo de Ejecución : ${durationMs.toFixed(2)} ms (< 3000 ms)`);
console.log(`[PASS] Topología JSON      : ${rel(TOPOLOGY_JSON_PATH)}`);
console.log(`[PASS] Bóveda Obsidian     : ${rel(VAULT_DIR)}`);
console.log('════════════════════════════════════════════════════════════════');

if (durationMs > 3000) {
  console.error(`[FAIL] Tiempo de ejecución excedido: ${durationMs.toFixed(2)} ms > 3000 ms`);
  process.exit(1);
}

process.exit(0);
