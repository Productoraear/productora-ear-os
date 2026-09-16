export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsagePct = Math.round((usedMem / totalMem) * 100);

  const cpus = os.cpus();
  const cpuModel = cpus.length > 0 ? cpus[0].model : 'AMD / Intel CPU';
  const cpuCores = cpus.length;

  let ollamaOnline = false;
  let installedModels: any[] = [];
  let runningModels: any[] = [];
  let gpuInfo = {
    model: 'AMD Radeon RX 7900 XTX',
    totalVramMB: 24576,
    estimatedUsedVramMB: 0,
    headroomVramMB: 24576
  };

  // 1. Consultar Ollama en localhost:11434
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const [tagsRes, psRes] = await Promise.allSettled([
      fetch('http://127.0.0.1:11434/api/tags', { signal: controller.signal }),
      fetch('http://127.0.0.1:11434/api/ps', { signal: controller.signal })
    ]);

    clearTimeout(timeoutId);

    if (tagsRes.status === 'fulfilled' && tagsRes.value.ok) {
      const tagsData = await tagsRes.value.json();
      installedModels = (tagsData.models || []).map((m: any) => ({
        name: m.name,
        sizeGB: (m.size / (1024 * 1024 * 1024)).toFixed(2),
        parameterSize: m.details?.parameter_size || 'N/D',
        quantization: m.details?.quantization_level || 'N/D',
        modifiedAt: m.modified_at
      }));
      ollamaOnline = true;
    }

    if (psRes.status === 'fulfilled' && psRes.value.ok) {
      const psData = await psRes.value.json();
      runningModels = (psData.models || []).map((m: any) => {
        const vramBytes = m.size_vram || m.size || 0;
        const vramMB = Math.round(vramBytes / (1024 * 1024));
        gpuInfo.estimatedUsedVramMB += vramMB;
        return {
          name: m.name,
          vramMB,
          expiresAt: m.expires_at,
          contextSize: m.context_size || 215000
        };
      });
      gpuInfo.headroomVramMB = Math.max(0, gpuInfo.totalVramMB - gpuInfo.estimatedUsedVramMB);
    }
  } catch (err: any) {
    console.warn('[SYSINFO API] Ollama offline o inaccesible:', err.message);
  }

  // Fallback si no hay modelos corriendo reportados por /api/ps
  if (gpuInfo.estimatedUsedVramMB === 0 && installedModels.some(m => m.name.includes('27b'))) {
    gpuInfo.estimatedUsedVramMB = 17200; // ~17.2 GB asignados para modelo 27B
    gpuInfo.headroomVramMB = 24576 - 17200;
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    system: {
      platform: os.platform(),
      uptimeSeconds: Math.floor(os.uptime()),
      cpuModel,
      cpuCores,
      ramTotalGB: (totalMem / (1024 * 1024 * 1024)).toFixed(2),
      ramUsedGB: (usedMem / (1024 * 1024 * 1024)).toFixed(2),
      ramFreeGB: (freeMem / (1024 * 1024 * 1024)).toFixed(2),
      ramUsagePct: memUsagePct
    },
    hardware: {
      gpu: gpuInfo.model,
      vramTotalMB: gpuInfo.totalVramMB,
      vramUsedMB: gpuInfo.estimatedUsedVramMB,
      vramFreeMB: gpuInfo.headroomVramMB,
      vramUsagePct: Math.round((gpuInfo.estimatedUsedVramMB / gpuInfo.totalVramMB) * 100)
    },
    ollama: {
      online: ollamaOnline,
      installedModelsCount: installedModels.length,
      installedModels,
      runningModels
    }
  });
}
