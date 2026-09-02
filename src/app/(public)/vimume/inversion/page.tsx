"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ArrowRight, 
  Star, 
  Building2, 
  HeartPulse, 
  Cpu, 
  CheckCircle2, 
  ShieldCheck, 
  Target, 
  Fingerprint
} from 'lucide-react';
import Link from 'next/link';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
};

/**
 * 🏛️ VIMUME INVESTMENT PAGE - LUMINOUS CAPITAL REFACTOR
 * Concept: "Inversión en Luz" (Investment in Light)
 */
export default function InversionVimumePage() {
  return (
    <main className="bg-[#fdfcf8] min-h-screen text-[#1a1a1a] selection:bg-[#3b82f6]/10 relative overflow-hidden">
      
      {/* 🚀 HERO: DE LA CARIDAD A LA INVERSIÓN */}
      <section className="px-6 pt-56 pb-40 relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#3b82f6]/5 blur-[200px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-5xl space-y-12">
            <motion.div 
              {...fadeIn}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#3b82f6]/5 border border-[#3b82f6]/10 text-[#3b82f6] text-[11px] font-black uppercase tracking-[0.4em]"
            >
              <TrendingUp size={14} /> OPORTUNIDAD B2B / B2G / SILVER ECONOMY
            </motion.div>
            
            <h1 className="text-7xl md:text-[10rem] font-black uppercase italic tracking-tighter leading-[0.75]">
              DE LA CARIDAD <br />
              <span className="text-[#3b82f6]/20 text-6xl md:text-[8rem]">A LA INVERSIÓN</span> <br />
              EN LEGADO
            </h1>

            <p className="text-2xl md:text-4xl text-[#1a1a1a]/40 font-medium italic leading-tight max-w-4xl border-l-4 border-[#3b82f6] pl-10 py-6">
              "No buscamos donaciones para sobrevivir. Buscamos Socios que quieran asociar su marca a la excelencia en la Restauración Cognitiva."
            </p>

            <div className="flex flex-wrap gap-8 pt-10">
              <Link href="/vimume/contacto" className="px-14 py-7 bg-[#1a1a1a] text-white font-black uppercase italic tracking-tighter rounded-full hover:bg-[#3b82f6] transition-all shadow-2xl shadow-[#3b82f6]/10">
                Solicitar Dossier B2B
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 MODELO DE TARIFAS & INVERSIÓN 2026 */}
      <section className="px-6 py-40 bg-white border-y border-black/5 relative">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none italic">Modelo <br /><span className="text-[#3b82f6]/20">de Tarifas</span></h2>
              <p className="text-[#1a1a1a]/40 italic text-xl">"Referencia de mercado basada en musicoterapia clínica y excelencia artística institucional."</p>
            </div>
            <div className="p-10 bg-[#3b82f6]/5 border border-[#3b82f6]/10 rounded-[2.5rem] text-right shadow-xl shadow-[#3b82f6]/5">
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#3b82f6] mb-2 text-center">Referencia Base 2026</p>
              <p className="text-4xl font-black italic tracking-tighter">350€ <span className="text-base not-italic text-[#1a1a1a]/20">/ SESIÓN SOLISTA</span></p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-4">
              {[
                { type: "Piloto Institucional (Solista)", price: "350€ - 450€", desc: "Incluye diseño experiencial, ejecución y ajuste inicial de protocolo." },
                { type: "Continuidad (Recurrencia Semanal)", price: "280€ - 380€", desc: "Tarifa preferente para programas mensuales o trimestrales certificados." },
                { type: "Ensemble Institucional (Grupo)", price: "600€ - 900€", desc: "Formato mariachi/agrupación para cierres de ciclo o eventos de gran escala." },
                { type: "Privado Domicilio (Solista Premium)", price: "250€ - 400€", desc: "Personalización máxima y enfoque emocional biográfico para familias." },
                { type: "Evaluación & Reporting", price: "95€ - 150€", desc: "Informe trimestral de impacto coordinado con equipos clínicos." }
              ].map((line, i) => (
                <motion.div 
                  key={i} 
                  {...fadeIn}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col md:flex-row justify-between items-center p-10 bg-[#fdfcf8] border border-black/[0.03] rounded-[2.5rem] hover:border-[#3b82f6]/30 transition-all group shadow-sm hover:shadow-2xl hover:shadow-[#3b82f6]/5"
                >
                  <div className="space-y-2 text-center md:text-left">
                    <h4 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-[#3b82f6] transition-colors">{line.type}</h4>
                    <p className="text-[15px] text-[#1a1a1a]/40 italic">"{line.desc}"</p>
                  </div>
                  <div className="mt-6 md:mt-0 text-3xl font-black italic tracking-tighter text-[#1a1a1a]">
                    {line.price}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-4">
              <motion.div 
                {...fadeIn}
                transition={{ delay: 0.3 }}
                className="p-16 bg-[#1a1a1a] rounded-[5rem] text-white space-y-12 relative overflow-hidden group h-full flex flex-col justify-between shadow-2xl shadow-[#3b82f6]/10"
              >
                 <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
                   <Target size={120} />
                 </div>
                 <div className="space-y-10 relative z-10">
                   <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-tight">Pack Impacto <br /><span className="text-[#3b82f6]">Masivo</span></h3>
                   <div className="pb-10 border-b border-white/10">
                      <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#3b82f6] mb-3">Piloto 5 Centros</p>
                      <p className="text-5xl font-black italic tracking-tighter">2.500€ - 4.500€</p>
                   </div>
                   <ul className="space-y-5 text-sm font-bold italic text-white/60">
                      <li className="flex gap-4"><CheckCircle2 size={18} className="text-[#3b82f6]" /> 5 Intervenciones Showcase de Alta Fidelidad</li>
                      <li className="flex gap-4"><CheckCircle2 size={18} className="text-[#3b82f6]" /> Dossier de Impacto Agregado para Stakeholders</li>
                      <li className="flex gap-4"><CheckCircle2 size={18} className="text-[#3b82f6]" /> Documentación Audiovisual del Piloto</li>
                    </ul>
                 </div>
                 <Link href="/vimume/contacto" className="inline-block w-full text-center py-6 bg-white text-black rounded-full font-black uppercase italic tracking-tighter text-lg hover:bg-[#3b82f6] hover:text-white transition-all shadow-xl">
                    Solicitar Propuesta
                 </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏺 FOSO MORAL & SEGURIDAD */}
      <section className="px-6 py-40 max-w-7xl mx-auto grid lg:grid-cols-3 gap-16">
        {[
          { title: "Foso Moral", tag: "Legitimidad Social", desc: "Nuestra ventaja competitiva nace de la autenticidad. Edwin Agudelo como fundador garantiza la integridad artística.", icon: ShieldCheck, color: "#3b82f6" },
          { title: "Maestría Artística", tag: "Excelencia Técnica", desc: "He emocionado a auditorios de miles; ahora uso esa capacidad para emocionar a quien más lo necesita.", icon: Fingerprint, color: "#2dd4bf" },
          { title: "Sostenibilidad", tag: "Escalabilidad", desc: "Modelo diseñado para replicarse en red de centros con control de calidad centralizado.", icon: Target, color: "#ecb613" }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            {...fadeIn}
            transition={{ delay: i * 0.1 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-6">
              <div className="p-4 bg-black/5 rounded-2xl" style={{ color: item.color }}>
                <item.icon size={36} />
              </div>
              <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-none">{item.title}</h4>
            </div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#1a1a1a]/20">{item.tag}</p>
            <p className="text-[#1a1a1a]/50 italic leading-relaxed text-xl">"{item.desc}"</p>
          </motion.div>
        ))}
      </section>

      {/* 🏺 CTA FINAL */}
      <section className="px-6 py-60 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#3b82f605_0%,_transparent_70%)]" />
        <div className="max-w-5xl mx-auto space-y-16 relative z-10">
          <motion.div {...fadeIn}>
            <Star size={100} className="text-[#3b82f6] mx-auto opacity-10 mb-12" />
            <h2 className="text-6xl md:text-[10rem] font-black uppercase italic tracking-tighter leading-[0.75] mb-20 italic text-[#1a1a1a]">
              INVERTIR EN <br />
              <span className="text-[#3b82f6]/20">MEMORIA.</span>
            </h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              <Link href="/vimume/contacto" className="w-full md:w-auto px-16 py-8 bg-[#1a1a1a] text-white font-black uppercase italic tracking-tighter rounded-full text-2xl shadow-2xl shadow-[#3b82f6]/20 hover:bg-[#3b82f6] transition-all">
                Agendar Reunión B2B
              </Link>
              <Link href="/vimume/roadmap" className="w-full md:w-auto px-16 py-8 border border-black/10 text-[#1a1a1a] font-black uppercase italic tracking-tighter rounded-full text-2xl hover:bg-[#1a1a1a] hover:text-white transition-all">
                Hoja de Ruta 2026
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
