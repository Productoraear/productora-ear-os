import type { Metadata } from 'next';
import { Satellite } from 'lucide-react';
import SentinelAbsorptionRadar from '@/components/admin/SentinelAbsorptionRadar';

export const metadata: Metadata = {
  title: 'Sentinel — Consola de Absorción Bare-Metal | EAR OS',
  description:
    'Monitorización autónoma de archivos pendientes en H:\\, absorción en vivo y despliegue a ARCHIVO_HISTORICO_EAR sin gastar tokens de API.',
};

export default function SentinelPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1a1a24] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF] uppercase tracking-widest">
            <Satellite className="w-4 h-4 text-[#00E5FF]" />
            B0.20 — Víscera Forense Local
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1 font-mono">
            Consola Sentinel
          </h1>
          <p className="text-xs text-zinc-400 mt-2 font-sans max-w-2xl">
            Motor de ingesta bare-metal ejecutado sobre{' '}
            <span className="text-[#00E5FF] font-mono">scripts/sentinel_absorber.ps1</span>.
            Rastrea la bóveda{' '}
            <span className="text-[#00E5FF] font-mono">H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT</span>,
            devuelve resúmenes JSON compactos y desplaza documentos ligeros al Archivo
            Histórico sin gastar tokens de API.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
            ZERO-TOKEN
          </div>
        </div>
      </div>

      {/* Radar interactivo */}
      <SentinelAbsorptionRadar />
    </div>
  );
}