import { NextResponse } from 'next/server';
import os from 'node:os';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 🛰️ HARDWARE TELEMETRY — Telemetría REAL del nodo de cómputo (cero fachada).
 * ----------------------------------------------------------------------------
 * Expone las métricas físicas del servidor (CPU, memoria, carga, uptime) para
 * alimentar el Centro de Mando de Agentes. No expone secretos ni rutas.
 */
export async function GET(): Promise<NextResponse> {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  const model = cpus[0]?.model ?? 'CPU desconocida';
  const logicalCores = cpus.length;
  const physicalCores = logicalCores > 0 ? Math.max(1, Math.ceil(logicalCores / 2)) : 0;

  const payload = {
    platform: `${os.platform()} ${os.release()}`,
    hostname: os.hostname(),
    architecture: os.arch(),
    cpu: {
      model,
      physicalCores,
      logicalCores,
      speedMhz: cpus[0]?.speed ?? null,
    },
    memory: {
      totalBytes: totalMem,
      freeBytes: freeMem,
      usedPercent: totalMem > 0 ? Math.round(((totalMem - freeMem) / totalMem) * 100) : 0,
    },
    loadAverage: os.loadavg(),
    uptimeSeconds: Math.round(os.uptime()),
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(payload);
}
