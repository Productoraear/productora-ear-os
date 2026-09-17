import React from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Users, Activity, ShieldCheck } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CentroDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const centroNombre = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <Link 
          href="/vimume/centros" 
          className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] hover:underline"
        >
          <ArrowLeft size={14} /> VOLVER A CENTROS HOMOLOGADOS
        </Link>

        <header className="space-y-4 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] font-mono uppercase tracking-widest border border-[#00E5FF]/20">
            <Building2 size={12} /> CONSOLA CLÍNICA DE CENTRO
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
            {centroNombre}
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
            Monitorización y seguimiento de intervenciones neuroacústicas 40 Hz Gamma, mapeo de la Banda Sonora Vital™ y control de escala CMAI para residentes senior (edad &ge; 50 años).
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Residentes Activos</p>
            <p className="text-2xl font-black text-[#ecb613]">18</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Reducción CMAI</p>
            <p className="text-2xl font-black text-[#10b981]">-38.2%</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Estimulación 40 Hz</p>
            <p className="text-2xl font-black text-[#00E5FF]">&lt; 75 dB</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Retorno SROI</p>
            <p className="text-2xl font-black text-white">4.85x</p>
          </div>
        </div>
      </div>
    </main>
  );
}
