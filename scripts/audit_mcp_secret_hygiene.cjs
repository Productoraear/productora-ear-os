#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * GUARDIÁN SEC-3 · CERO SECRETOS EN CONFIGURACIONES MCP (BARRERA PREVENTIVA)
 * ════════════════════════════════════════════════════════════════════════════
 * Directiva Suprema: OPCIÓN B sancionada (fail-closed).
 * La capa MCP NO dispara webhooks de producción y NO persiste credenciales en
 * texto plano. Este guardián recorre las configuraciones MCP conocidas del
 * workspace y del cliente (Cline) y ABORTA (Exit 1) si encuentra:
 *
 *   1. Un valor literal con forma de secreto (`*_sk_*`, `sk-*`, `ghp_*`,
 *      `xox[bap]-*`, JWT de 3 segmentos, bearer largo alfanumérico).
 *   2. Una entrada `env` cuyo valor no sea una referencia `${env:VAR}`.
 *   3. Un campo `url` que apunte a un endpoint de disparo de webhook n8n
 *      (`/webhook/`), que reintroduciría el vector de disparo desde MCP.
 *
 * Exit 0 sólo si TODAS las comprobaciones pasan. Sin "verde por defecto" (AF-5).
 *
 * Uso:  node scripts/audit_mcp_secret_hygiene.cjs
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const ROOT = path.resolve(__dirname, '..');

/** Configuraciones MCP conocidas: workspace + cliente local. */
const CONFIG_CANDIDATES = [
  path.join(ROOT, '.agents', 'mcp_config.json'),
  path.join(ROOT, '.abacusai', 'mcp.json'),
  path.join(ROOT, '.mcp.json'),
  path.join(os.homedir(), '.cline', 'data', 'settings', 'cline_mcp_settings.json'),
  path.join(
    process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
    'Code',
    'User',
    'globalStorage',
    'saoudrizwan.claude-dev',
    'settings',
    'cline_mcp_settings.json',
  ),
];

/** Formas de secreto literal que jamás deben vivir en una config versionable. */
const SECRET_PATTERNS = [
  { label: '21st/OpenAI-style key', re: /[A-Za-z0-9_]{0,12}sk[_-][A-Za-z0-9]{20,}/ },
  { label: 'GitHub PAT', re: /gh[pousr]_[A-Za-z0-9]{20,}/ },
  { label: 'Slack token', re: /xox[baprs]-[A-Za-z0-9-]{10,}/ },
  { label: 'JWT', re: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/ },
  { label: 'Bearer literal', re: /Bearer\s+[A-Za-z0-9._-]{20,}/ },
  { label: 'AWS access key', re: /AKIA[0-9A-Z]{16}/ },
];

const ENV_REFERENCE = /^\$\{env:[A-Z0-9_]+\}$/;
const WEBHOOK_URL = /\/webhook\//i;

let failures = 0;
let checks = 0;

function fail(message) {
  failures += 1;
  console.log(`  [FAIL] ${message}`);
}

function pass(message) {
  checks += 1;
  console.log(`  [PASS] ${message}`);
}

function scanValue(where, value) {
  if (typeof value !== 'string') return;
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.re.test(value)) {
      fail(`SECRETO EN TEXTO PLANO (${pattern.label}) en ${where}`);
      return;
    }
  }
}

function scanServer(configPath, name, server) {
  if (server === null || typeof server !== 'object') return;

  const env = server.env;
  if (env !== null && typeof env === 'object') {
    for (const [key, raw] of Object.entries(env)) {
      const where = `${path.basename(configPath)} → ${name}.env.${key}`;
      if (typeof raw !== 'string') {
        fail(`${where}: valor no textual`);
        continue;
      }
      scanValue(where, raw);
      if (!ENV_REFERENCE.test(raw.trim())) {
        fail(`${where}: valor literal, debe ser \${env:VAR}`);
      }
    }
  }

  for (const key of ['url', 'command', 'args']) {
    const value = server[key];
    if (typeof value === 'string') {
      scanValue(`${path.basename(configPath)} → ${name}.${key}`, value);
      if (key === 'url' && WEBHOOK_URL.test(value)) {
        fail(`${name}.url apunta a /webhook/ (disparo n8n desde MCP prohibido · OPCIÓN B)`);
      }
    }
    if (Array.isArray(value)) {
      for (const item of value) scanValue(`${path.basename(configPath)} → ${name}.${key}[]`, item);
    }
  }
}

console.log('── GUARDIÁN SEC-3 · HIGIENE DE CONFIGURACIONES MCP ─────────────');

let scanned = 0;
for (const configPath of CONFIG_CANDIDATES) {
  if (!fs.existsSync(configPath)) {
    console.log(`  [INFO] ausente (no aplica): ${configPath}`);
    continue;
  }
  scanned += 1;
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    fail(`${configPath}: JSON ilegible (${error instanceof Error ? error.message : String(error)})`);
    continue;
  }
  pass(`${path.basename(configPath)}: JSON válido`);

  const servers = parsed && typeof parsed === 'object' ? parsed.mcpServers : undefined;
  if (servers !== null && typeof servers === 'object') {
    const names = Object.keys(servers);
    console.log(`         servidores declarados: ${names.length === 0 ? 'ninguno' : names.join(', ')}`);
    for (const [name, server] of Object.entries(servers)) {
      scanServer(configPath, name, server);
    }
  }
}

if (scanned === 0) {
  fail('ninguna configuración MCP encontrada: el guardián no pudo probar nada (SIN_EVIDENCIA)');
}

console.log('');
console.log(`RESULTADO: ${failures === 0 ? 'LIMPIO' : 'CON VIOLACIONES'} · checks=${checks} · failures=${failures}`);
console.log('════════════════════════════════════════════════════════════════');
process.exit(failures === 0 ? 0 : 1);
