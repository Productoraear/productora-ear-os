/**
 * DIAGNOSTICO (no es gate, no escribe ledger):
 * mide CUANTO tarda en abrir TCP/HTTP el servidor standalone del build actual.
 * Uso: node .antigravity/diag_standalone_boot.cjs [puerto] [presupuestoMs]
 */
'use strict';

const { spawn } = require('node:child_process');
const net = require('node:net');
const path = require('node:path');
const fs = require('node:fs');

const ROOT = path.resolve(__dirname, '..');
const SERVER = path.join(ROOT, '.next', 'standalone', 'server.js');
const PORT = Number(process.argv[2] || 3099);
const BUDGET_MS = Number(process.argv[3] || 60000);

function tcpProbe(port, host = '127.0.0.1', timeoutMs = 1200) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host });
    const done = (ok) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  if (!fs.existsSync(SERVER)) {
    console.log(`SIN_EVIDENCIA: no existe ${SERVER}`);
    process.exit(2);
  }
  const busy = await tcpProbe(PORT);
  console.log(`puerto ${PORT} ocupado antes de arrancar: ${busy}`);
  if (busy) {
    console.log('ABORTA: el puerto ya estaba en uso, la medicion no seria limpia');
    process.exit(2);
  }

  let stderr = '';
  let stdout = '';
  const t0 = Date.now();
  const child = spawn(process.execPath, [SERVER], {
    cwd: path.dirname(SERVER),
    env: {
      ...process.env,
      PORT: String(PORT),
      HOSTNAME: '127.0.0.1',
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });
  child.stdout.on('data', (c) => {
    stdout = (stdout + c.toString()).slice(-2000);
  });
  child.stderr.on('data', (c) => {
    stderr = (stderr + c.toString()).slice(-4000);
  });
  child.on('error', (e) => {
    stderr += `\nSPAWN_ERROR: ${e.message}`;
  });

  let bootMs = -1;
  let httpStatus = 0;
  while (Date.now() - t0 < BUDGET_MS) {
    await sleep(500);
    if (await tcpProbe(PORT)) {
      bootMs = Date.now() - t0;
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/`, { redirect: 'manual' });
        httpStatus = res.status;
      } catch (e) {
        httpStatus = -1;
      }
      break;
    }
    if (child.exitCode !== null) break;
  }

  console.log(`BOOT_MS=${bootMs}`);
  console.log(`HTTP_STATUS=${httpStatus}`);
  console.log(`EXIT_CODE=${child.exitCode === null ? 'alive' : child.exitCode}`);
  if (stdout.trim()) console.log(`STDOUT_TAIL=${stdout.trim().slice(-500)}`);
  if (stderr.trim()) console.log(`STDERR_TAIL=${stderr.trim().slice(-1500)}`);

  if (child.exitCode === null) {
    child.kill('SIGKILL');
  }
  process.exit(0);
})();
