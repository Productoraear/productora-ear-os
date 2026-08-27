import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Landmark, FileText, CheckCircle2, ShieldCheck, Phone, ArrowRight, Building2 } from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

export const metadata: Metadata = {
  title: 'VIMUME B2G | Contratación Pública & Envejecimiento Activo Art. 118 LCSP',
  description: 'Programa municipal de estimulación cognitiva neuroacústica para residencias y centros de mayores. Adjudicación directa en <24h bajo el Art. 118 LCSP (<15.000 €).',
};

export default function VimumeB2GPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-20 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-mono tracking-widest uppercase">
          <Landmark size={14} />
          <span>VIMUME // CANAL INSTITUCIONAL B2G</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white font-syne leading-[0.95]">
          Envejecimiento Activo &amp; <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-300 to-[#ecb613]">
            Contratación Menor Art. 118 LCSP
          </span>
        </h1>
        <p className="text-white/70 text-sm md:text-base max-w-3xl leading-relaxed">
          Solución integral contra la Soledad No Deseada y reactivación de memoria en centros municipales. Expediente técnico listo para firma y adjudicación directa en menos de 24 horas por debajo del umbral de 15.000 €.
        </p>
      </div>

      {/* Grid de Servicios B2G */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="p-3 bg-pink-500/20 text-pink-400 rounded-xl w-fit mb-4">
            <Building2 size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Ciclo en Centros Municipales</h3>
          <p className="text-white/60 text-xs leading-relaxed">
            Intervención neurofuncional de 3 meses para usuarios de centros de mayores con seguimiento clínico.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="p-3 bg-[#ecb613]/20 text-[#ecb613] rounded-xl w-fit mb-4">
            <FileText size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Memoria Justificativa Lista</h3>
          <p className="text-white/60 text-xs leading-relaxed">
            Pliego de prescripciones técnicas y certificado de exclusividad artística para fiscalización ágil.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="p-3 bg-green-500/20 text-green-400 rounded-xl w-fit mb-4">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Garantía y RC 600.000€</h3>
          <p className="text-white/60 text-xs leading-relaxed">
            Equipo homologado, seguro de responsabilidad civil y cumplimiento estricto del RGPD en salud.
          </p>
        </div>
      </div>

      {/* CTAs de Descarga y Contacto */}
      <div className="bg-gradient-to-r from-pink-950/40 via-neutral-900 to-black p-8 rounded-3xl border border-pink-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">¿Necesitas la memoria técnica para tu Concejalía?</h2>
          <p className="text-white/60 text-xs">Atención prioritaria para secretarios, interventores y técnicos de cultura/bienestar social.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/ocasiones/ayuntamientos"
            className="px-6 py-3 bg-[#ecb613] text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
          >
            <span>Generar Pliego Art. 118</span>
            <ArrowRight size={14} />
          </Link>
          <a
            href={CENTRALITA.whatsapp}
            className="px-6 py-3 border border-white/20 text-white text-xs font-mono uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Phone size={14} />
            <span>Centralita B2G</span>
          </a>
        </div>
      </div>
    </main>
  );
}
