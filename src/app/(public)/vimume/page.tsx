"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Heart, 
  ArrowRight, 
  Star, 
  TrendingUp, 
  Map, 
  Quote, 
  Music, 
  Zap,
  Microscope,
  Building2,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
};

/**
 * 🕊️ VIMUME LANDING PAGE - LUMINOUS STORYTELLING REFACTOR
 * Concept: "El recorrido del colibrí" (The Hummingbird's Journey)
 */
export default function VimumeLandingPage() {
  const { scrollYProgress } = useScroll();
  
  // Hummingbird flight path animation
  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const hummingbirdX = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8], ["10%", "85%", "15%", "90%", "50%"]);
  const hummingbirdY = useTransform(scrollYProgress, [0, 1], ["100px", "100%"]);

  const nodes = [
    { title: "Manifiesto", label: "Identidad", icon: Heart, desc: "Edwin Agudelo y la Fábula del Colibrí: El compromiso de hacer nuestra parte.", href: "/vimume/nosotros" },
    { title: "Ciencia", label: "Rigor", icon: Microscope, desc: "La 'puerta trasera' neurológica: Evidencia clínica de la memoria musical.", href: "/vimume/investigacion" },
    { title: "Inversión", label: "Capital Social", icon: TrendingUp, desc: "Modelo tarifario 2026 y packs de impacto para banca, tech y sanidad.", href: "/vimume/inversion" },
    { title: "Roadmap", label: "Ejecución", icon: Map, desc: "Hoja de ruta estratégica de 90 días para el despliegue del programa.", href: "/vimume/roadmap" }
  ];

  return (
    <main className="bg-[#fdfcf8] min-h-screen text-[#1a1a1a] selection:bg-[#3b82f6]/10 relative overflow-hidden">
      
      {/* 🕊️ THE HUMMINGBIRD PATH (Visual Anchor) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 1000 4000" preserveAspectRatio="none">
        <motion.path
          d="M 100 200 Q 800 600 200 1200 T 700 2200 T 300 3200 T 500 4000"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>

      {/* 🕊️ FLOATING COLIBRÍ ICON */}
      <motion.div 
        className="fixed z-50 w-8 h-8 pointer-events-none"
        style={{ left: hummingbirdX, top: hummingbirdY, opacity: useTransform(scrollYProgress, [0, 0.05], [0, 1]) }}
      >
        <img 
          src="/brand/vimume-logo-horizontal-light-blue.svg" 
          alt="" 
          className="w-full h-auto brightness-0 contrast-200"
        />
      </motion.div>

      {/* 🚀 HERO: The Call to Light */}
      <section className="px-6 pt-56 pb-40 relative">
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-12">
          <motion.div 
            {...fadeIn}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#3b82f6]/5 border border-[#3b82f6]/10 text-[#3b82f6] text-[11px] font-black uppercase tracking-[0.4em]"
          >
            <Star size={14} /> VIAJE MUSICAL POR LA MEMORIA
          </motion.div>
          
          <motion.h1 
            {...fadeIn}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-[11rem] font-black uppercase italic tracking-tighter leading-[0.75] text-[#1a1a1a]"
          >
            RECONECTAR <br />
            <span className="text-[#3b82f6]/20">CON LA VIDA</span>
          </motion.h1>
          
          <motion.p 
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-4xl text-[#1a1a1a]/40 font-medium italic leading-tight max-w-4xl mx-auto"
          >
            "No usamos música para entretener; la usamos para rescatar identidades. VIMUME es la unidad de intervención que abre la puerta trasera del recuerdo."
          </motion.p>
          
          <motion.div 
            {...fadeIn}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row gap-8 justify-center pt-12"
          >
            <Link href="/vimume/contacto" className="px-14 py-7 bg-[#1a1a1a] text-white font-black uppercase italic tracking-tighter rounded-full flex items-center justify-center gap-3 hover:bg-[#3b82f6] transition-all shadow-[0_20px_60px_rgba(59,130,246,0.15)]">
              Solicitar Información <ArrowRight size={22} />
            </Link>
            <Link href="/vimume/nosotros" className="px-14 py-7 border border-[#1a1a1a]/10 text-[#1a1a1a] font-black uppercase italic tracking-tighter rounded-full hover:bg-[#1a1a1a] hover:text-white transition-all">
              Explorar el Manifiesto
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 🧬 NODOS DE AUTORIDAD: Stations of the Journey */}
      <section className="px-6 py-40 bg-white border-y border-black/5 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {nodes.map((node, i) => (
            <Link key={i} href={node.href} className="group p-12 bg-[#fdfcf8] border border-black/[0.03] rounded-[3.5rem] hover:border-[#3b82f6]/30 hover:shadow-2xl hover:shadow-[#3b82f6]/5 transition-all space-y-12 flex flex-col justify-between h-full relative overflow-hidden">
              <div className="space-y-8">
                <div className="p-5 bg-black/5 rounded-3xl w-fit group-hover:bg-[#3b82f6] group-hover:text-white transition-all">
                  <node.icon size={26} />
                </div>
                <div className="space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-widest text-[#3b82f6]">{node.label}</p>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter">{node.title}</h3>
                </div>
                <p className="text-[#1a1a1a]/50 text-[15px] leading-relaxed italic">"{node.desc}"</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-[#1a1a1a]/20 group-hover:text-[#3b82f6] transition-all">
                Explorar Nodo <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🏺 IMPACTO: Human & Institutional Stations */}
      <section className="px-6 py-40">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
           <motion.div 
             {...fadeIn}
             className="p-20 bg-white border border-black/5 rounded-[5rem] space-y-12 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#3b82f6]/5 transition-all"
           >
              <Building2 size={200} className="absolute -bottom-10 -right-10 text-black/[0.02] group-hover:scale-110 transition-transform duration-1000" />
              <div className="space-y-8 relative z-10">
                <h2 className="text-6xl font-black uppercase italic tracking-tighter">Servicio <br /><span className="text-[#3b82f6]">Institucional</span></h2>
                <p className="text-2xl text-[#1a1a1a]/40 italic leading-relaxed">Para Centros de Día y Residencias que buscan excelencia en el cuidado cognitivo y emocional.</p>
              </div>
              <Link href="/vimume/centros" className="inline-flex px-12 py-6 bg-[#1a1a1a] text-white font-black uppercase italic tracking-tighter rounded-full relative z-10 hover:bg-[#3b82f6] transition-all">
                Ver para Centros
              </Link>
           </motion.div>
           
           <motion.div 
             {...fadeIn}
             transition={{ delay: 0.1 }}
             className="p-20 bg-white border border-black/5 rounded-[5rem] space-y-12 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#3b82f6]/5 transition-all"
           >
              <Music size={200} className="absolute -bottom-10 -right-10 text-black/[0.02] group-hover:scale-110 transition-transform duration-1000" />
              <div className="space-y-8 relative z-10">
                <h2 className="text-6xl font-black uppercase italic tracking-tighter">Servicio <br /><span className="text-[#2dd4bf]">Familiar</span></h2>
                <p className="text-2xl text-[#1a1a1a]/40 italic leading-relaxed">Homenajes biográficos y sesiones personalizadas a domicilio para familias que valoran el legado.</p>
              </div>
              <Link href="/vimume/eventos" className="inline-flex px-12 py-6 bg-[#1a1a1a] text-white font-black uppercase italic tracking-tighter rounded-full relative z-10 hover:bg-[#2dd4bf] transition-all">
                Ver para Familias
              </Link>
           </motion.div>
        </div>
      </section>

      {/* 🕊️ EL PACTO DE CUIDADO: The Emotional Core */}
      <section className="px-6 py-56 bg-[#3b82f6]/5 border-y border-[#3b82f6]/10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#3b82f605_0%,_transparent_70%)]" />
        <div className="max-w-5xl mx-auto space-y-16 relative z-10">
          <Quote size={100} className="mx-auto text-[#3b82f6] opacity-10" />
          <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-[#1a1a1a]">Haciendo nuestra parte.</h2>
          <p className="text-3xl md:text-5xl text-[#1a1a1a]/60 italic leading-tight font-medium">
            "Como el colibrí en el incendio, VIMUME pone su gota de agua para rescatar la identidad de nuestros mayores. No es solo música, es gratitud."
          </p>
          <div className="pt-12">
            <Link href="/vimume/nosotros" className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] text-[#3b82f6] hover:tracking-[0.7em] transition-all group">
              NUESTRA HISTORIA COMPLETA <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 🚀 CALL TO ACTION: Closing with Hope */}
      <section className="px-6 py-48 text-center bg-white">
        <div className="max-w-4xl mx-auto space-y-16">
           <div className="w-24 h-24 bg-[#3b82f6]/5 rounded-full flex items-center justify-center mx-auto">
              <Zap size={40} className="text-[#3b82f6]" />
           </div>
           <div className="space-y-6">
             <h2 className="text-6xl font-black uppercase italic tracking-tighter">Inicie la conversación estratégica.</h2>
             <p className="text-2xl text-[#1a1a1a]/40 italic">¿Listo para transformar el cuidado a través de la memoria musical?</p>
           </div>
           <div className="flex flex-col sm:flex-row gap-8 justify-center pt-8">
              <Link href="/vimume/contacto" className="px-16 py-8 bg-[#1a1a1a] text-white font-black uppercase italic tracking-tighter rounded-full hover:bg-[#3b82f6] transition-all shadow-2xl shadow-[#3b82f6]/20">
                Contactar con el Equipo
              </Link>
              <Link href="/vimume/faq" className="px-16 py-8 border border-black/10 text-[#1a1a1a] font-black uppercase italic tracking-tighter rounded-full hover:bg-black hover:text-white transition-all">
                Ver Metodología & FAQ
              </Link>
           </div>
        </div>
      </section>
    </main>
  );
}
