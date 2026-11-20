#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — LANZADOR MCP DEL METACOMPILADOR (TRANSPORTE STDIO · SIN PUERTO)
 * ════════════════════════════════════════════════════════════════════════════
 * Arranca el servidor JSON-RPC 2.0 del MetaCompilador sobre stdin/stdout con
 * delimitación NDJSON. Cero sockets abiertos ⇒ cero superficie expuesta.
 *
 * Registro en un cliente MCP (Claude Desktop, Cline, Continue…):
 *
 *   "ear-os-metacompiler": {
 *     "command": "npm",
 *     "args": ["run", "mcp:metacompiler"],
 *     "cwd": "D:\\EAR_OS_V2\\EAR_OS_V2"
 *   }
 *
 * El proceso se auto-relanza bajo `tsx` (resuelve `@/` y TypeScript nativo del
 * repositorio) y sólo entonces habla el protocolo. Sin `tsx` no hay motor: el
 * script falla en voz alta en lugar de fingir herramientas que no puede servir.
 *
 * Reglas de seguridad de este proceso:
 *   1. El runtime es LIMPIO por defecto (memoria, sin PostgreSQL). La DB real
 *      sólo se activa con `--runtime=server`, decisión explícita del operador.
 *   2. stdout está RESERVADO al protocolo: los diagnósticos van a stderr.
 *   3. Nunca ejecuta comandos de shell. `run_sv_gates` responde
 *      EXECUTION_DISABLED (ver `metacompiler-mcp.ts`).
 *   4. Una línea de entrada = una respuesta. Sin estado compartido entre
 *      llamadas salvo el propio runtime inyectado.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const TSX_CLI = path.join(ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs');

// ── FASE 1 · RE-LANZAMIENTO BAJO TSX ───────────────────────────────────────
// El protocolo exige stdout limpio: `tsx` se ejecuta en un proceso hijo que
// hereda stdin/stdout y aísla cualquier salida de diagnóstico.
if (process.env.EAR_MCP_TSX !== '1') {
  if (!fs.existsSync(TSX_CLI)) {
    process.stderr.write('[ear-os-metacompiler] FATAL: tsx no esta instalado (npm install).\n');
    process.exit(1);
  }
  const child = spawnSync(
    process.execPath,
    [TSX_CLI, __filename, ...process.argv.slice(2)],
    { stdio: 'inherit', env: { ...process.env, EAR_MCP_TSX: '1' }, cwd: ROOT },
  );
  process.exit(child.status ?? 1);
}


const RUNTIME_MODE = process.argv.includes('--runtime=server') ? 'server' : 'local';
const GATES_FILE = path.join(ROOT, 'scripts', 'run_sv_protocol_15_gates.cjs');

function parseGates(source) {
  const block = /const\s+gates\s*=\s*\[([\s\S]*?)\];/.exec(source);
  if (block === null) return [];
  const list = [];
  const re = /'([^']+)'/g;
  let match;
  while ((match = re.exec(block[1])) !== null) list.push(match[1]);
  return list;
}

async function main() {
  const mcp = await import('file:///' + path.join(ROOT, 'src/lib/compiler/metacompiler-mcp.ts').replace(/\\/g, '/'));
  const runtimeModule = RUNTIME_MODE === 'server'
    ? await import('file:///' + path.join(ROOT, 'src/lib/compiler/metacompiler-server-runtime.ts').replace(/\\/g, '/'))
    : await import('file:///' + path.join(ROOT, 'src/lib/compiler/metacompiler-runtime.ts').replace(/\\/g, '/'));

  const runtime = RUNTIME_MODE === 'server' ? runtimeModule.createServerRuntime() : runtimeModule.createLocalRuntime();
  const gates = parseGates(fs.readFileSync(GATES_FILE, 'utf8'));

  const host = { runtime, gates, now: () => new Date().toISOString() };

  process.stderr.write(
    `[ear-os-metacompiler] runtime=${RUNTIME_MODE} gates=${gates.length} protocol=${mcp.MCP_PROTOCOL_VERSION}\n`,
  );

  const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
  for await (const line of rl) {
    if (line.trim().length === 0) continue;
    let out = null;
    try {
      out = await mcp.handleJsonRpcLine(line, host);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(`[ear-os-metacompiler] error: ${message}\n`);
      out = JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32603, message: 'Internal error' } });
    }
    if (out !== null) process.stdout.write(`${out}\n`);
  }
}

main().catch((error) => {
  process.stderr.write(`[ear-os-metacompiler] fatal: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
