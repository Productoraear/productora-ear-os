"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Rocket, 
  Layout, 
  Database, 
  Video, 
  Palette, 
  TestTube2, 
  MessageSquare, 
  Wrench, 
  Megaphone, 
  Globe, 
  Users, 
  Trophy,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Link from 'next/link';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

/**
 * 🏛️ VIMUME ROADMAP PAGE - LUMINOUS EXECUTION REFACTOR
 * Concept: "La Trayectoria de Vuelo" (The Flight Trajectory)
 */
export default function RoadmapPage() {
  return (
    <main className="bg-[#fdfcf8] min-h-screen text-[#1a1a1a] selection:bg-[#3b82f6]/10 relative overflow-hidden">
      
      {/* 🚀 HERO */}
      <section className="px-6 pt-56 pb-40 relative text-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#3b82f6]/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          <motion.div 
            {...fadeIn}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#3b82f6]/5 border border-[#3b82f6]/10 text-[#3b82f6] text-[11px] font-black uppercase tracking-[0.4em]"
          >
            <Calendar size={14} /> CRONOGRAMA DE EJECUCIÓN V.2026
          </motion.div>
          
          <motion.h1 
            {...fadeIn}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-[10rem] font-black uppercase italic tracking-tighter leading-[0.75]"
          >
            HOJA DE <br />
            <span className="text-[#3b82f6]/20 text-6xl md:text-[8rem]">RUTA</span>
          </motion.h1>
          
          <motion.p 
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-4xl text-[#1a1a1a]/40 font-medium italic leading-tight max-w-4xl mx-auto"
          >
            "Planificación estratégica de 90 días para el despliegue de **VIMUME**. Rigor operativo para un impacto real."
          </motion.p>
        </div>
      </section>

      {/* 📅 TIMELINE */}
      <section className="px-6 py-24 pb-48 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/5 hidden lg:block" />
        
        <div className="max-w-7xl mx-auto space-y-32 relative z-10">
          
          {/* MES 1 */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeIn} className="lg:text-right space-y-6 order-2 lg:order-1">
              <span className="text-6xl md:text-9xl font-black italic text-black/[0.03] uppercase">Mes 01</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">Desarrollo & <br /><span className="text-[#3b82f6]">Contenido</span></h2>
              <p className="text-[#1a1a1a]/40 italic text-xl">Cimentando la infraestructura digital y narrativa del proyecto.</p>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="p-16 bg-white border border-black/5 rounded-[4rem] space-y-10 order-1 lg:order-2 shadow-2xl shadow-black/[0.02]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { title: "Plataforma Web", icon: Layout, desc: "Arquitectura, diseño UX/UI y desarrollo funcional." },
                  { title: "Base de Datos", icon: Database, desc: "Perfiles para centros, familias y terapeutas." },
                  { title: "Contenido Semilla", icon: Video, desc: "Primeros testimonios y guías de intervención." },
                  { title: "Identidad Visual", icon: Palette, desc: "Branding unificado para toda la vertical." }
                ].map((task, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-black/5 rounded-2xl">
                        <task.icon size={22} className="text-[#3b82f6]" />
                      </div>
                      <h4 className="font-black uppercase tracking-tighter text-base">{task.title}</h4>
                    </div>
                    <p className="text-sm text-[#1a1a1a]/50 italic">"{task.desc}"</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* MES 2 */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeIn} className="p-16 bg-white border border-black/5 rounded-[4rem] space-y-10 order-1 shadow-2xl shadow-black/[0.02]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { title: "Beta Testing", icon: TestTube2, desc: "Prueba piloto con 3 centros seleccionados." },
                  { title: "Feedback Loop", icon: MessageSquare, desc: "Recopilación de datos y métricas de satisfacción." },
                  { title: "Ajustes Técnicos", icon: Wrench, desc: "Refinamiento basado en interacciones reales." },
                  { title: "Pre-Campaña", icon: Megaphone, desc: "Activación institucional y teasers de impacto." }
                ].map((task, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-black/5 rounded-2xl">
                        <task.icon size={22} className="text-[#2dd4bf]" />
                      </div>
                      <h4 className="font-black uppercase tracking-tighter text-base">{task.title}</h4>
                    </div>
                    <p className="text-sm text-[#1a1a1a]/50 italic">"{task.desc}"</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="space-y-6 order-2">
              <span className="text-6xl md:text-9xl font-black italic text-black/[0.03] uppercase">Mes 02</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">Testeo & <br /><span className="text-[#2dd4bf]">Feedback</span></h2>
              <p className="text-[#1a1a1a]/40 italic text-xl">Validación de la metodología en entornos asistenciales reales.</p>
            </motion.div>
          </div>

          {/* MES 3 */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeIn} className="lg:text-right space-y-6 order-2 lg:order-1">
              <span className="text-6xl md:text-9xl font-black italic text-black/[0.03] uppercase">Mes 03</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">Lanzamiento <br /><span className="text-[#ecb613]">Oficial</span></h2>
              <p className="text-[#1a1a1a]/40 italic text-xl">Escalado comercial y activación masiva del protocolo.</p>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="p-16 bg-white border border-black/5 rounded-[4rem] space-y-10 order-1 lg:order-2 shadow-2xl shadow-black/[0.02]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { title: "Go Live", icon: Globe, desc: "Apertura pública de la plataforma y servicios." },
                  { title: "Comunicación", icon: Zap, desc: "Difusión institucional y presencia en media." },
                  { title: "Captación", icon: Users, desc: "Activación total de embudos de conversión." },
                  { title: "Evento de Gala", icon: Trophy, desc: "Presentación oficial a partners y prensa." }
                ].map((task, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-black/5 rounded-2xl">
                        <task.icon size={22} className="text-[#ecb613]" />
                      </div>
                      <h4 className="font-black uppercase tracking-tighter text-base">{task.title}</h4>
                    </div>
                    <p className="text-sm text-[#1a1a1a]/50 italic">"{task.desc}"</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🛡️ VALIDACIÓN */}
      <section className="px-6 py-40 bg-white border-y border-black/5">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="space-y-8">
             <div className="p-6 bg-[#3b82f6]/5 border border-[#3b82f6]/10 rounded-3xl w-fit mx-auto text-[#3b82f6]">
               <ShieldCheck size={48} />
             </div>
             <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight text-[#1a1a1a]">Validación de <br />Cronograma</h2>
             <p className="text-2xl text-[#1a1a1a]/40 italic leading-relaxed max-w-2xl mx-auto">
               "¿Aprobamos esta hoja de ruta para iniciar la fase de producción intensiva?"
             </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <button className="w-full md:w-auto px-16 py-8 border border-black/10 text-[#1a1a1a] font-black uppercase italic tracking-tighter rounded-full text-2xl hover:bg-black hover:text-white transition-all">
              Ajustar Tiempos
            </button>
            <button className="w-full md:w-auto px-16 py-8 bg-[#1a1a1a] text-white font-black uppercase italic tracking-tighter rounded-full text-2xl shadow-2xl shadow-[#3b82f6]/10 hover:bg-[#3b82f6] transition-all flex items-center justify-center gap-5">
               Aprobar & Activar <ArrowRight size={28} />
            </button>
          </div>
          
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#1a1a1a]/20 pt-8">
            * Cronograma sujeto a validación de partners tecnológicos.
          </p>
        </div>
      </section>

      {/* 🏺 NAVIGATION GATE */}
      <section className="px-6 py-32 text-center">
         <Link href="/vimume/inversion" className="text-[#1a1a1a]/30 hover:text-[#3b82f6] transition-all font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 group">
           <Zap size={16} /> VOLVER A ESTRATEGIA DE INVERSIÓN <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
         </Link>
      </section>
    </main>
  );
}
