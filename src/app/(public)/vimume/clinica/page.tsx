'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText, Brain, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const VIMUMEClinicalBlock = dynamic(
  () => import('@/modules/SClassScreens/PRO_VIMUMECLINICALBLOCK').then(m => m.VIMUMEClinicalBlock),
  { ssr: false }
);

function VimumeClinicaContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f1e8] selection:bg-[#ecb613] selection:text-black font-sans pt-28 pb-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Breadcrumb & Context */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <Link 
              href="/vimume" 
              className="inline-flex items-center gap-2 text-xs font-mono text-pink-400 hover:text-pink-300 transition-colors mb-2"
            >
              <ArrowLeft size={14} />
              <span>Volver al Hub VIMUME</span>
            </Link>
            <h1 className="text-3xl md:text-5xl font-black uppercase text-white font-syne">
              AUTORIDAD CLÍNICA & <span className="text-[#ecb613]">PLIEGOS B2G</span>
            </h1>
            <p className="text-xs md:text-sm text-white/60">
              Protocolo de estimulación Gamma 40Hz (MIT), generación de memorias técnicas bajo Art. 118 LCSP y fondos NextGenerationEU.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono">
              <ShieldCheck size={14} />
              <span>Art. 118 LCSP (&lt;15.000€) Habilitado</span>
            </div>
            <a
              href="/dossier"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <FileText size={14} className="text-pink-400" />
              <span>Descargar Pliego B2G</span>
            </a>
          </div>
        </div>

        {/* Dynamic Clinical Block */}
        <VIMUMEClinicalBlock />

      </div>
    </div>
  );
}

export default function VimumeClinicaPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <VimumeClinicaContent />
    </React.Suspense>
  );
}
