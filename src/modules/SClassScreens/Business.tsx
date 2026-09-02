'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  TrendingUp, 
  Verified, 
  BarChart3, 
  Lightbulb, 
  Workflow, 
  ArrowRight,
  ArrowLeft,
  Quote,
  Users,
  Zap,
  Globe,
  PieChart
} from 'lucide-react';
import { THEME, GLASS_STYLE, GOLD_HUD_STYLE } from '@/lib/dna/theme';

/**
 * 🛰️ MODULE: BUSINESS (S-Class V3.0)
 * B2B Corporate Architecture.
 * Full Responsive Senior High-End Interface.
 */

interface BusinessProps {
  onNavigate?: (id: string) => void;
  hideHeader?: boolean;
}

export default function Business({ onNavigate, hideHeader }: BusinessProps) {
  const stats = [
    { label: 'Eventos Corp.', val: '500+', icon: Users, sub: 'Líderes en el Sector' },
    { label: 'Retorno Prom.', val: '180%', icon: TrendingUp, sub: 'ROI Optimizado' },
    { label: 'Certificación', val: 'Gold', icon: Verified, sub: 'Estándar S-Class' },
  ];

  const features = [
    {
      title: 'Análisis de Impacto',
      desc: 'Evaluación algorítmica de alcance y audiencia para garantizar precisión en cada KPI.',
      icon: BarChart3
    },
    {
      title: 'Diseño de Experiencia',
      desc: 'Narrativas corporativas inmersivas diseñadas para elevar el prestigio de su marca.',
      icon: Lightbulb
    },
    {
      title: 'Logística Elite',
      desc: 'Gestión integral de stakeholders y despliegue técnico de alta fidelidad.',
      icon: Workflow
    }
  ];

  return (
    <div className="bg-[#221d10] text-white font-montserrat selection:bg-[#ecb613] selection:text-[#221d10] w-full min-h-screen overflow-x-hidden relative">
      

      <main className={`max-w-7xl mx-auto space-y-24 md:space-y-48 pb-32 ${hideHeader ? 'pt-12 md:pt-24' : ''}`}>
        
        {/* 1. HERO SECTION */}
        <section className="relative px-4 pt-16 md:pt-32 flex flex-col items-center text-center overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[150px] pointer-events-none opacity-30" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 md:space-y-12 relative z-10 max-w-5xl"
          >
            <span className="px-5 py-2 md:px-8 md:py-3 bg-primary/10 border border-primary/20 text-primary text-[8px] md:text-[11px] font-black tracking-[0.4em] uppercase rounded-full backdrop-blur-2xl inline-block shadow-2xl">
              Arquitectura de Confianza // B2B Strategic Core
            </span>
            <h1 className="text-[clamp(2.5rem,11vw,9rem)] font-cinzel font-black tracking-tighter uppercase leading-[0.9] md:leading-[0.85] text-balance">
              Soluciones <br /> <span className="gold-text italic font-serif normal-case">de Negocio.</span>
            </h1>
            <p className="text-base md:text-2xl lg:text-3xl text-white/40 font-medium italic max-w-4xl mx-auto leading-relaxed px-6 text-balance border-l border-primary/20 border-r md:border-none">
              Para marcas y corporaciones que exigen una ejecución técnica impecable respaldada por una visión estratégica de alto nivel.
            </p>
          </motion.div>
        </section>

        {/* 2. STATS GRID (High-End HUD) */}
        <section className="px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 transition-all">
             {stats.map((stat, i) => (
               <div key={i} className={`p-10 md:p-20 rounded-[3rem] md:rounded-[5rem] ${GLASS_STYLE} ${GOLD_HUD_STYLE} border border-white/5 flex flex-col items-center text-center gap-8 md:gap-14 transition-all hover:bg-white/[0.03] duration-700 group shadow-3xl`}>
                  <div className="w-20 h-20 md:w-32 md:h-32 rounded-[2rem] md:rounded-[3rem] bg-primary/5 flex items-center justify-center text-primary/40 border border-primary/10 group-hover:bg-primary group-hover:text-black group-hover:scale-110 transition-all duration-500 shadow-inner">
                     <stat.icon size={48} className="md:w-16 md:h-16" />
                  </div>
                  <div className="space-y-2 md:space-y-4">
                     <p className="text-primary text-[10px] md:text-sm font-black uppercase tracking-[0.4em]">{stat.label}</p>
                     <p className="text-6xl md:text-[9rem] font-black tracking-tighter leading-none text-white group-hover:gold-text transition-all">{stat.val}</p>
                     <p className="text-[8px] md:text-[10px] font-bold text-white/10 uppercase tracking-[0.3em] italic">{stat.sub}</p>
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* 3. ESTRATEGIA & FILOSOFÍA (Cinematic Content) */}
        <section className="px-4 md:px-12 py-20 md:py-40 bg-white/[0.01] border-y border-white/5 relative">
          <div className="absolute inset-0 bg-primary/5 opacity-20 blur-[100px]" />
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 md:gap-32 relative z-10">
             <div className="w-full lg:w-1/2 space-y-12 md:space-y-20">
                <div className="space-y-4 md:space-y-8">
                   <span className="text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.6em]">Process Workflow</span>
                   <h2 className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-balance">Auditoría <br /><span className="gold-text italic serif normal-case">Maestra.</span></h2>
                   <p className="text-lg md:text-3xl text-white/40 italic font-medium text-balance leading-relaxed max-w-xl">Evaluamos el ecosistema de su marca para diseñar experiencias que maximicen el impacto emocional y el ROI corporativo.</p>
                </div>
                
                <button className="px-12 py-6 rounded-full bg-primary text-black font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-105 transition-all flex items-center gap-4">
                   INICIAR EVALUACIÓN <ArrowRight size={20} />
                </button>
             </div>

             <div className="w-full lg:w-1/2 grid gap-8 md:gap-12">
                {features.map((feat, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 20 }}
                    className="flex gap-8 p-8 md:p-12 rounded-[2.5rem] bg-black/40 border border-white/5 group hover:border-primary/20 transition-all shadow-2xl"
                  >
                     <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-black transition-all">
                        <feat.icon size={28} className="md:w-10 md:h-10" />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-xl md:text-3xl font-black uppercase tracking-tight group-hover:gold-text transition-all">0{i+1} // {feat.title}</h3>
                        <p className="text-sm md:text-xl text-white/30 font-medium italic leading-relaxed text-balance">{feat.desc}</p>
                     </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* 4. CASE STUDY HIGHLIGHT (The Cinematic Moment) */}
        <section className="px-4 md:px-12">
          <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-[3.5rem] md:rounded-[6rem] overflow-hidden border border-white/5 shadow-4xl group">
             <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=2070" 
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-[2s] scale-105 group-hover:scale-100" 
                  alt="Business Summit" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#221d10] via-transparent to-transparent opacity-90" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#221d10] to-transparent" />
             </div>
             
             <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-32 space-y-8 md:space-y-16 pointer-events-none">
                <Quote size={80} className="text-primary opacity-20 hidden md:block" />
                <p className="text-2xl md:text-5xl lg:text-7xl font-serif italic text-white leading-[1.1] max-w-6xl text-balance">
                  "EAR no solo produce eventos, construye reputación de marca. Su nivel de detalle técnico y estratégico es el estándar de oro en la industria."
                </p>
                <div className="flex items-center gap-6 md:gap-10 pointer-events-auto">
                   <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-primary/50 p-1 flex-shrink-0">
                      <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-black font-black text-lg md:text-2xl shadow-2xl">RM</div>
                   </div>
                   <div className="min-w-0">
                     <p className="text-lg md:text-3xl font-black uppercase tracking-tighter truncate leading-none">Roberto Méndez</p>
                     <p className="text-xs md:text-xl font-black text-primary uppercase tracking-[0.4em] italic opacity-80">CMO, TechGlobal International</p>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* 5. ELITE ACCESS CTA */}
        <section className="px-6 py-20 md:py-40 text-center max-w-5xl mx-auto space-y-12 md:space-y-20 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] -z-10" />
           
           <div className="space-y-6 md:space-y-10">
              <h3 className="text-4xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none">Visionarios <br /> <span className="gold-text italic serif normal-case">Bienvenidos.</span></h3>
              <p className="text-lg md:text-3xl text-white/30 font-medium italic text-balance max-w-3xl mx-auto leading-relaxed">Únase a la red exclusiva de líderes que confían en EAR para transformar sus objetivos corporativos en realidades tangibles de alto impacto.</p>
           </div>

           <div className="flex flex-col items-center gap-8">
              <button 
                onClick={() => onNavigate?.('contact')}
                className="group relative w-full md:w-auto px-16 md:px-24 py-8 md:py-12 rounded-[2.5rem] md:rounded-[4rem] bg-primary text-black font-black uppercase text-xs md:text-xl tracking-[0.5em] md:tracking-[0.6em] hover:scale-105 active:scale-95 transition-all shadow-4xl shadow-primary/20 flex items-center justify-center gap-10 overflow-hidden"
              >
                 <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                 ACCESO CORPORATIVO <ArrowRight className="group-hover:translate-x-4 transition-transform h-6 w-6 md:h-12 md:w-12" />
              </button>
              <div className="flex items-center gap-6 opacity-20 text-[8px] md:text-xs font-black uppercase tracking-[0.6em] md:tracking-[0.8em]">
                 <span>Bespoke Request</span>
                 <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                 <span>EAR Systems Architecture</span>
              </div>
           </div>
        </section>

      </main>


    </div>
  );
}
