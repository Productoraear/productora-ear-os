import { NextResponse } from 'next/server';
import os from 'node:os';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

/**
 * B5.44 — Panel de Telemetría Global (Bare-Metal)
 * Devuelve métricas reales del host: CPU, RAM, red, Ollama (GPU local) y pasarela de pagos.
 * GET /api/admin/telemetry
 */
export async function GET() {
  const startedAt = Date.now();
  const platform = process.platform;

  // --- CPU / RAM (node:os) ---
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPct = Math.round((usedMem / totalMem) * 100);

  // Carga media (1, 5, 15 min)
  const loadAvg = os.loadavg();

  // --- Red ---
  const ifaces = os.networkInterfaces();
  const activeIps: string[] = [];
  for (const list of Object.values(ifaces)) {
    for (const i of list ?? []) {
      if (i && i.family === 'IPv4' && !i.internal) {
        activeIps.push(i.address);
      }
    }
  }

  // --- Ollama (GPU local 127.0.0.1:11434) ---
  let ollama: { online: boolean; models: string[]; latencyMs: number } = {
    online: false,
    models: [],
    latencyMs: 0,
  };
  try {
    const t0 = Date.now();
    const res = await fetch('http://127.0.0.1:11434/api/tags', {
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      const data = (await res.json()) as { models?: { name: string }[] };
      ollama = {
        online: true,
        models: (data.models ?? []).map((m) => m.name),
        latencyMs: Date.now() - t0,
      };
    }
  } catch {
    /* Ollama offline */
  }

  // --- Pasarela de pagos (Stripe) ---
  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);
  const webhookConfigured = Boolean(process.env.STRIPE_WEBHOOK_SECRET);

  // --- VRAM (solo Windows, best-effort) ---
  let vram: { totalMB: number; usedMB: number } | null = null;
  if (platform === 'win32') {
    try {
      const { stdout } = await execAsync(
        'powershell -NoProfile -Command "(Get-CimInstance Win32_VideoController | Measure-Object -Property AdapterRAM -Sum).Sum"',
        { timeout: 3000 }
      );
      const totalMB = Math.round(parseInt(stdout.trim(), 10) / (1024 * 1024));
      if (Number.isFinite(totalMB) && totalMB > 0) {
        vram = { totalMB, usedMB: 0 };
      }
    } catch {
      /* sin acceso a VRAM */
    }
  }

  const body = {
    timestamp: new Date().toISOString(),
    host: {
      platform,
      arch: os.arch(),
      hostname: os.hostname(),
      node: process.version,
      uptimeSec: Math.round(os.uptime()),
    },
    cpu: {
      model: cpus[0]?.model ?? 'unknown',
      cores: cpus.length,
      loadAvg: loadAvg.map((n) => Math.round(n * 100) / 100),
    },
    memory: {
      totalMB: Math.round(totalMem / (1024 * 1024)),
      usedMB: Math.round(usedMem / (1024 * 1024)),
      freeMB: Math.round(freeMem / (1024 * 1024)),
      usedPct: memPct,
    },
    vram,
    network: { activeIps },
    ollama,
    payments: {
      stripeConfigured,
      webhookConfigured,
    },
    responseMs: Date.now() - startedAt,
  };

  return NextResponse.json(body, {
    headers: { 'Cache-Control': 'no-store' },
  });
}