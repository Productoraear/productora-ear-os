import React from 'react';
import Link from 'next/link';
import { 
  Building2, ShieldCheck, ArrowRight, FileText, CheckCircle2, 
  Crown, Sparkles, Activity, Phone, Mail, Award, Zap, ChevronRight,
  Target, Calendar, Check, Compass, HeartHandshake, TrendingUp
} from 'lucide-react';
import { Metadata } from 'next';
import { CENTRALITA } from '@/lib/phone-constants';

export const metadata: Metadata = {
  title: 'Acompañamiento Estratégico & Canal Empresarios | Productora EAR',
  description: 'Acompañamiento estratégico y táctico para empresarios y marcas de alto valor. Planes desde 1000€/mes con garantía de ROI por escrito.',
  alternates: {
    canonical: 'https://www.productoraear.com/empresarios',
  }
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
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-4 sm:px-6 md:px-8 selection:bg-[#ecb613] selection:text-black font-sans">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* 🚀 HERO SECTION */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em]">
            <Sparkles size={13} className="animate-spin" />
            Acompañamiento Estratégico & Táctico
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne leading-[0.95]">
            Acompañamiento <br className="hidden sm:inline"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">Estratégico & Táctico</span>
          </h1>
          
          <p className="text-sm sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-3xl mx-auto">
            No solo diseñamos la estrategia; bajamos al barro contigo para implementarla. Resultados que superan expectativas con ROI garantizado por escrito.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={CENTRALITA.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#ecb613]/20 hover:bg-white transition-all cursor-pointer"
            >
              <Calendar size={16} />
              <span>Agenda cita de 30 min (Gratis)</span>
            </a>
            
            <a
              href={CENTRALITA.tel}
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer"
            >
              <Phone size={16} className="text-[#ecb613]" />
              <span>Atención Directa: {CENTRALITA.display}</span>
            </a>
          </div>
        </div>

        {/* 💼 PLANES DE ACOMPAÑAMIENTO ESTRATÉGICO B2B */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-black uppercase tracking-[0.4em] text-[#ecb613]">
              Modelos de Consultoría & Ejecución
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-syne">
              Planes de Transformación Empresarial
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* PLAN 1: EMPRESARIOS (1000€/mes) */}
            <div className="p-8 sm:p-12 rounded-[2.5rem] bg-[#0a0a0f] border border-white/10 hover:border-[#ecb613]/40 transition-all flex flex-col justify-between space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#ecb613] text-[10px] font-black uppercase tracking-wider font-mono">
                    Plan Ejecución
                  </span>
                  <span className="text-xs font-mono text-white/40 uppercase">Garantía Escrita</span>
                </div>

                <div>
                  <h3 className="text-3xl font-black uppercase text-white font-syne tracking-tight">
                    EMPRESARIOS
                  </h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-5xl font-black text-[#ecb613] font-syne">€1000</span>
                    <span className="text-xs text-white/50 uppercase font-mono tracking-widest">/ Mensual</span>
                  </div>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-white/5">
                  <div className="flex items-start gap-3 text-xs text-white/80">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span>Implementación de tácticas de marketing.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-white/80">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span>Acompañamiento estratégico semanal.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-white/80">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span>Auditoría continua de procesos.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-white/80">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span>Garantía de resultados por escrito.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={CENTRALITA.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4.5 px-6 rounded-2xl bg-[#ecb613] hover:bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <Calendar size={15} />
                  <span>Agenda cita de 30 min (Gratis)</span>
                </a>
              </div>
            </div>

            {/* PLAN 2: PREMIUM BUSINESS (3000€/mes) */}
            <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-b from-[#100d04] via-[#0a0a0f] to-[#0a0a0f] border border-[#ecb613]/50 transition-all flex flex-col justify-between space-y-8 shadow-[0_20px_50px_rgba(236,182,19,0.15)] relative overflow-hidden group">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full bg-[#ecb613] text-black text-[10px] font-black uppercase tracking-wider font-mono">
                    Escalado Máximo
                  </span>
                  <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Full-Service VIP</span>
                </div>

                <div>
                  <h3 className="text-3xl font-black uppercase text-white font-syne tracking-tight">
                    PREMIUM BUSINESS
                  </h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xs text-white/50 uppercase font-mono">Desde</span>
                    <span className="text-5xl font-black text-white font-syne">€3000</span>
                    <span className="text-xs text-white/50 uppercase font-mono tracking-widest">/ Mensual</span>
                  </div>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-white/5">
                  <div className="flex items-start gap-3 text-xs text-white/90">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span><strong>Todo lo del plan Empresarios</strong> incluido.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-white/90">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span>Gestión de activos digitales full-service.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-white/90">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span>Estructura de ingeniería emocional para ventas.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-white/90">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span>Reportes forenses mensuales de ROI.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={CENTRALITA.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4.5 px-6 rounded-2xl bg-white hover:bg-[#ecb613] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
                >
                  <TrendingUp size={15} />
                  <span>Auditoría Estratégica 30 min</span>
                </a>
              </div>
            </div>

          </div>

          {/* NUESTRA PROMESA RECTORA */}
          <div className="p-8 sm:p-12 rounded-[2.5rem] bg-[#0c0c12] border border-[#ecb613]/30 max-w-5xl mx-auto text-center space-y-4 shadow-2xl">
            <span className="text-[#ecb613] font-mono font-black text-xs uppercase tracking-[0.4em] block">
              Nuestra Promesa Soberana
            </span>
            <p className="text-base sm:text-xl text-white/90 font-medium italic leading-relaxed max-w-4xl mx-auto">
              "A través de nuestra metodología te acercamos a un nivel de conciencia superior desde la neutralidad profesional. No queremos solo tu presupuesto, queremos tu transformación empresarial."
            </p>
          </div>
        </section>

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
            <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <Crown size={24} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tight text-white font-syne">Rigor Técnico Militar</h3>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-light">
              Puntualidad garantizada T-120min antes de la apertura de puertas, prueba de sonido profesional y soporte in situ continuo.
            </p>
          </div>
        </section>

        {/* 🎭 FORMATOS B2B DE ESCENARIO */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-[#ecb613] text-xs font-mono font-bold uppercase tracking-widest">Escenarios Corporativos</span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-white font-syne mt-1">Formatos de Alto Impacto</h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono">37 CONCIERTOS INTERNACIONALES COORDINADOS // HOMOLOGACIÓN OFICIAL</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {b2bFormats.map((format) => (
              <div key={format.id} className="bg-[#0e0e0e] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#ecb613]/40 transition-all shadow-xl group">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
                      {format.subtitle}
                    </span>
                    <span className="text-xs font-bold font-mono text-zinc-400">{format.price}</span>
                  </div>

                  <h3 className="text-2xl font-black uppercase italic tracking-tight text-white group-hover:text-[#ecb613] transition-colors font-syne">
                    {format.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                    {format.desc}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    {format.includes.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
                        <CheckCircle2 size={13} className="text-[#ecb613] shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/cotizador?category=B2B&format=${format.id}`}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-[#ecb613] hover:text-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 group-hover:border-transparent transition-all min-h-[44px]"
                >
                  <span>Solicitar Disponibilidad</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
