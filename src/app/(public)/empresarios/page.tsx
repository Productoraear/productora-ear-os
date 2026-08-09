import React from 'react';
import Link from 'next/link';
import { 
  Building2, ShieldCheck, ArrowRight, FileText, CheckCircle2, 
  Crown, Sparkles, Activity, Phone, Mail, Award, Zap, ChevronRight 
} from 'lucide-react';
import { Metadata } from 'next';
import { CENTRALITA } from '@/lib/phone-constants';

export const metadata: Metadata = {
  title: 'Canal Corporativo & Empresas | Productora EAR',
  description: 'Infraestructura musical y acústica S-Class para eventos corporativos, galas de empresa, recepciones diplomáticas y grandes aforos.',
};

export default function EmpresariosPage() {
  const b2bFormats = [
    {
      id: 'gala-corporativa',
      title: 'Gala Corporativa & Entrega de Premios',
      subtitle: 'Ensamble de Gran Gala (6 a 8 Músicos)',
      price: 'Desde 2.400€ + IVA',
      desc: 'Repertorio adaptado al protocolo del evento, trajes de máxima distinción y microfonía Shure Axient Digital.',
      includes: ['Coordinación técnica con agencia de eventos', 'Póliza RC 1.000.000€', 'Facturación formal y contrato mercantil']
    },
    {
      id: 'convenciones-masivas',
      title: 'Banda Monumental EAR (12+ Músicos)',
      subtitle: 'Sonorización L-Acoustics & Show Inmersivo',
      price: 'Desde 5.500€ + IVA',
      desc: 'Impacto audiovisual masivo para congresos, convenciones anuales y ferias empresariales en recintos de gran aforo.',
      includes: ['Ingeniería acústica dedicada', 'Diseño de iluminación robotizada Beam/Wash', 'Coordinador de producción en pista']
    },
    {
      id: 'espectaculo-ecuestre',
      title: 'Espectáculo Ecuestre & Mariachi',
      subtitle: 'Edwin Agudelo "Cantando a Caballo"',
      price: 'Desde 5.500€ + IVA',
      desc: 'Espectáculo único de doma clásica y mariachi en vivo sobre caballos de pura raza. Exclusividad total para clientes VIP.',
      includes: ['Logística especializada de transporte', 'Seguro ecuestre homologado', 'Validación técnica previa de terreno']
    }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-4 sm:px-6 md:px-8 selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* 🚀 HERO SECTION */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em]">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-ping" />
            CANAL CORPORATIVO // B2B ÉLITE
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne leading-[0.95]">
            INFRAESTRUCTURA DE GALA PARA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">EMPRESAS</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Solvencia operativa para agencias de eventos, multinacionales y marcas de lujo. Contratación mercantil directa con desglose de IVA, seguro de 1.000.000€ y cobertura técnica integral.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/cotizador?category=B2B"
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#ecb613]/20 active:scale-95 transition-all min-h-[48px]"
            >
              <span>Configurar Presupuesto Corporativo</span>
              <ArrowRight size={16} />
            </Link>
            <a
              href={CENTRALITA.tel}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-all min-h-[48px]"
            >
              <Phone size={16} className="text-[#ecb613]" />
              <span>Atención Empresas: {CENTRALITA.display}</span>
            </a>
          </div>
        </div>

        {/* 🏢 GARANTÍAS CORPORATIVAS B2B */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0e0e0e] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tight text-white font-syne">Compliance & Facturación</h3>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-light">
              Facturas proforma inmediatas, contratos mercantiles homologados, certificados de estar al corriente con TGSS/Hacienda y desglose de IVA.
            </p>
          </div>

          <div className="bg-[#0e0e0e] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tight text-white font-syne">Póliza RC de 1.000.000€</h3>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-light">
              Máxima cobertura aseguradora para recintos históricos, hoteles de 5 estrellas, centros de convenciones y fincas de prestigio en toda España.
            </p>
          </div>

          <div className="bg-[#0e0e0e] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tight text-white font-syne">Cero Fallos Técnicos</h3>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-light">
              Sistemas acústicos L-Acoustics y microfonía inalámbrica Shure Axient con escáner de frecuencias para eventos en directo sin acoples ni cortes.
            </p>
          </div>
        </section>

        {/* 🎭 FORMATOS DESTACADOS B2B */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613]">SOLUCIONES ESCÉNICAS</span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight text-white font-syne">
                Formatos para Convenciones & Galas
              </h2>
            </div>
            <Link
              href="/artistas/edwin-agudelo"
              className="text-xs font-black uppercase tracking-widest text-[#ecb613] hover:underline flex items-center gap-1 min-h-[44px]"
            >
              <span>Ver Dossier Maestro de Edwin Agudelo →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {b2bFormats.map((fmt) => (
              <div 
                key={fmt.id}
                className="bg-[#0e0e0e] border border-white/10 hover:border-[#ecb613]/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 group transition-all shadow-xl"
              >
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-2xl font-black text-[#ecb613] font-mono block">{fmt.price}</span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block">{fmt.subtitle}</span>
                  </div>

                  <h3 className="text-2xl font-black uppercase italic tracking-tight text-white group-hover:text-[#ecb613] transition-colors font-syne">
                    {fmt.title}
                  </h3>

                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-light">
                    {fmt.desc}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    {fmt.includes.map((inc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/70">
                        <CheckCircle2 size={14} className="text-[#ecb613] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <Link
                    href={`/cotizador?format=${fmt.id}&category=B2B`}
                    className="w-full py-3.5 rounded-xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider text-center shadow-lg shadow-[#ecb613]/10 active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <span>Cotizar Formato B2B</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
