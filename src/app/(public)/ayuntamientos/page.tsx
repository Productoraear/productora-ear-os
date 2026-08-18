import React from 'react';
import { Metadata } from 'next';
import { B2GMemoryGenerator } from '@/features/b2g/ui/B2GMemoryGenerator';
import { Building2, ShieldCheck, FileText, CheckCircle2, Award, Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contratación Pública para Ayuntamientos & B2G | Productora EAR',
  description: 'Despacho de contratos menores y licitaciones artísticas Art. 118 LCSP para Administraciones Públicas y Concejalias de Festejos.',
};

export default function AyuntamientosB2GPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-40 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HERO SECTION */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-mono uppercase tracking-[0.3em]">
            <Building2 size={12} />
            PORTAL DE CONTRATACIÓN PÚBLICA // LEY 9/2017 LCSP
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tighter text-white font-syne leading-[0.95]">
            LICITACIONES & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-200 to-white">CONTRATOS MENORES</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Pliegos técnicos homologados, cobertura acústica visada a 12 W/pax, seguros de RC por 1.000.000 € y facturación electrónica FacturaE (DIR3) para Ayuntamientos y Comisiones de Festejos.
          </p>
        </div>

        {/* 3 PILARES INSTITUCIONALES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#09090d] border border-white/10 p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-white uppercase font-syne">Art. 118 LCSP Homologado</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Expedientes tramitados como Contrato Menor (&lt;15.000 € + IVA) con justificación de necesidad, informe de insuficiencia de medios y oferta al 95% del techo.
            </p>
          </div>

          <div className="bg-[#09090d] border border-white/10 p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <Zap size={20} />
            </div>
            <h3 className="text-base font-bold text-white uppercase font-syne">Presión Acústica 12 W/pax</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Equipamiento Bose F1 Model 812 y microfonía digital Shure Axient UHF con cumplimiento estricto de las ordenanzas acústicas municipales.
            </p>
          </div>

          <div className="bg-[#09090d] border border-white/10 p-6 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award size={20} />
            </div>
            <h3 className="text-base font-bold text-white uppercase font-syne">Alineación ODS 2030</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Metodología VIMUME para el envejecimiento activo y la dinamización del tejido social y cultural en municipios de menos de 20.000 habitantes.
            </p>
          </div>
        </div>

        {/* GENERADOR DE MEMORIAS B2G EN 1-CLIC */}
        <B2GMemoryGenerator />
      </div>
    </main>
  );
}
