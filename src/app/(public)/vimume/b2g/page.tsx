import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Landmark, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  ArrowRight, 
  Building2,
  Sparkles,
  HeartHandshake,
  Activity,
  Award,
  ArrowLeft
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { VimumeB2GCompiler } from '@/features/b2g/ui/VimumeB2GCompiler';
import { VimumeOntologyExplorer } from '@/features/vimume/ui/VimumeOntologyExplorer';

export const metadata: Metadata = {
  title: 'VIMUME B2G | Generador de Memorias Art. 118 LCSP (<15.000 €)',
  description: 'Auto-compilador de pliegos técnicos y memorias justificativas para contratos menores de servicios municipales. Estimulación neuroacústica en centros de mayores y residencias.',
  keywords: [
    'Contrato Menor Art 118 LCSP',
    'VIMUME B2G',
    'Envejecimiento Activo Ayuntamientos',
    'Soledad No Deseada',
    'Pliego Tecnico Mayores',
    'Edwin Agudelo Tenor',
    'Musicoterapia Geriatria Menor 15000'
  ]
};

export default function VimumeB2GPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-32 px-4 md:px-8 selection:bg-[#ecb613] selection:text-black font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <Link 
            href="/vimume" 
            className="inline-flex items-center gap-2 text-xs font-mono text-[#ecb613] hover:text-amber-300 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Volver al Hub VIMUME</span>
          </Link>

          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Marco Legal Homologado: Ley 9/2017 LCSP</span>
          </div>
        </div>

        {/* HERO INSTITUCIONAL */}
        <section className="relative space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono tracking-widest uppercase">
            <Landmark size={14} />
            <span>VIMUME INSTITUCIONAL // DESPACHO B2G EXPRESS</span>
          </div>

          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white font-syne leading-[0.95]">
              Generador de Memorias B2G <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-rose-300 to-pink-500">
                Contratos Menores Art. 118 LCSP
              </span>
            </h1>
            <p className="text-white/70 text-sm md:text-base lg:text-lg leading-relaxed">
              Auto-compilador de pliegos de prescripciones técnicas y memorias justificativas para Concejalías de Bienestar Social, Mayores y Festejos. Expedientes técnicos listos para firma y adjudicación directa en menos de 24 horas por debajo del umbral de <strong className="text-white">15.000 € + IVA</strong>.
            </p>
          </div>

          {/* BADGES CLAVE DE CONTRATACIÓN */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { label: 'Límite Menor', value: '<15.000 € s/IVA', note: 'Art. 118.1 LCSP' },
              { label: 'Tramitación', value: '< 24 Horas', note: 'Firma y Sello Directo' },
              { label: 'Exclusividad', value: 'Edwin Agudelo', note: 'Singularidad Artística' },
              { label: 'Seguridad Acústica', value: '< 75 dB SPL', note: 'Homologación Clínica' }
            ].map((badge, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#ecb613]">{badge.label}</span>
                <p className="text-base md:text-lg font-mono font-black text-white">{badge.value}</p>
                <p className="text-[10px] text-white/40">{badge.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COMPILADOR INTERACTIVO B2G */}
        <section className="space-y-4">
          <VimumeB2GCompiler />
        </section>

        {/* BASE DE CONOCIMIENTO // ONTOLOGÍA DE 100 NIVELES SEMÁNTICOS */}
        <section className="space-y-4">
          <VimumeOntologyExplorer />
        </section>

        {/* PILARES TÉCNICOS Y JURÍDICOS PARA FISCALIZACIÓN */}
        <section className="space-y-6 pt-8 border-t border-white/10">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
              Garantías para Secretarios e Interventores Municipales
            </span>
            <h2 className="text-2xl md:text-4xl font-black uppercase text-white font-syne">
              Seguridad Jurídica y Técnica Innegociable
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-[#ecb613]/30 transition-all">
              <div className="p-3 bg-[#ecb613]/10 text-[#ecb613] rounded-2xl w-fit">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold text-white font-syne">Justificación de Exclusividad</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Acreditación de singularidad técnica y artística basada en el protocolo neuroacústico patentado de VIMUME y la dirección lírica de Edwin Agudelo. Cumple estrictamente con la doctrina del Tribunal Administrativo Central de Recursos Contractuales (TACRC).
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-emerald-500/30 transition-all">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl w-fit">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-white font-syne">Solvencia y Seguro RC 1M€</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Póliza de Responsabilidad Civil integral de 1.000.000 €, inscripción activa en el Registro Oficial de Licitadores y Empresas Clasificadas del Sector Público (ROLECE) y certificados de hallarse al corriente con AEAT y TGSS.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-rose-500/30 transition-all">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl w-fit">
                <Activity size={28} />
              </div>
              <h3 className="text-xl font-bold text-white font-syne">Rider Homologado &lt;75 dB</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Equipos Line Array calibrados a 12 W/pax con limitador electroacústico de presión sonora estricta (&lt;75 dB SPL), evitando crisis de estrés o hiperacusia en usuarios de residencias con deterioro cognitivo o Alzheimer.
              </p>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION INSTITUCIONAL */}
        <section className="bg-gradient-to-r from-[#181206] via-neutral-900 to-black p-8 md:p-12 rounded-[2.5rem] border border-[#ecb613]/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
              Línea de Asistencia Directa B2G
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white font-syne">
              ¿Dudas con la fiscalización o el pliego de tu Ayuntamiento?
            </h3>
            <p className="text-white/60 text-xs leading-relaxed">
              Nuestro equipo jurídico-administrativo asiste a técnicos de cultura, bienestar social y secretarías municipales en la confección inmediata del expediente.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href={`https://wa.me/34693693048?text=${encodeURIComponent('Hola, necesito asistencia técnica para formalizar un contrato menor Art. 118 LCSP para VIMUME en mi Ayuntamiento.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#ecb613] text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2 rounded-2xl shadow-[0_0_25px_rgba(236,182,19,0.3)]"
            >
              <Phone size={16} />
              <span>Centralita WhatsApp B2G</span>
            </a>
            <a
              href="mailto:b2g@productoraear.com"
              className="px-8 py-4 bg-white/10 text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-white/20 transition-colors flex items-center gap-2 rounded-2xl border border-white/10"
            >
              <span>Email Licitaciones</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}
