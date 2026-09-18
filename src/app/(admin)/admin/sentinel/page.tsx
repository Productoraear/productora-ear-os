import type { Metadata } from 'next';
import Link from 'next/link';
import { Satellite } from 'lucide-react';
import SentinelAbsorptionRadar from '@/components/admin/SentinelAbsorptionRadar';

export const metadata: Metadata = {
  title: 'Sentinel — Consola de Absorción Bare-Metal | EAR OS',
  description:
    'Monitorización autónoma de archivos pendientes en H:\\, absorción en vivo y despliegue a ARCHIVO_HISTORICO_EAR sin gastar tokens de API.',
};

export default function SentinelPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/admin" className="hover:text-zinc-300 transition-colors">Admin</Link>
        <span>/</span>
        <span>IA &amp; GPU</span>
        <span>/</span>
        <span className="text-[#ecb613]">Consola Sentinel ZTM</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white uppercase">
            CONSOLA SENTINEL // ZERO-TOKEN ABSORBER
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Motor de ingesta bare-metal • Ingesta de bóveda a Archivo Histórico • <span className="text-[#ecb613]">0 Tokens API consumidos</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF] animate-pulse" />
            ZERO-TOKEN MEMORY
          </div>
        </div>
      </div>

      {/* Radar interactivo */}
      <SentinelAbsorptionRadar />
    </div>
  );
}