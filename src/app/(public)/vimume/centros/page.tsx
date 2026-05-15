"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Stethoscope, 
  Brain, 
  Music, 
  Activity, 
  Building2,
  FileText,
  Star
} from 'lucide-react';
import Link from 'next/link';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

/**
 * 🏛️ VIMUME CENTERS PAGE - LUMINOUS INSTITUTIONAL REFACTOR
 * Concept: "El Sonido de la Función" (The Sound of Function)
 */
export default function CentrosDeDiaPage() {
  const steps = [
    { title: "Diagnóstico Situacional", desc: "Evaluación del perfil funcional y cognitivo de los residentes para personalizar la intervención.", icon: Brain },
    { title: "Diseño de Itinerario", desc: "Creación de un mapa musical y sensorial basado en la memoria autobiográfica del grupo.", icon: Music },
    { title: "Implementación Clínica", desc: "Sesiones presenciales con terapeutas especializados y tecnología de estimulación sonora.", icon: Stethoscope },
    { title: "Seguimiento Hermes", desc: "Registro de impacto y evolución a través de nuestra plataforma de monitorización OT.", icon: Activity },
    { title: "Certificación de Impacto", desc: "Entrega de informes detallados para familias, centros e instituciones públicas.", icon: ShieldCheck }
  ];

  const benefits = [
    { label: "Reducción de Agitación", value: "-40%", desc: "Disminución notable de síntomas conductuales disruptivos en el centro." },
    { label: "Conexión Social", value: "+65%", desc: "Aumento de la interacción significativa entre residentes y cuidadores." },
    { label: "Bienestar Emocional", value: "92%", desc: "Nivel de satisfacción reportado por equipos de Terapia Ocupacional." }
  ];

  return (
    <main className="bg-[#fdfcf8] min-h-screen text-[#1a1a1a] selection:bg-[#3b82f6]/10 relative overflow-hidden">
      
      {/* 🚀 HERO: INSTITUTIONAL AUTHORITY */}
      <section className="px-6 pt-56 pb-40 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#3b82f6]/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <motion.div 
                {...fadeIn}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#3b82f6]/5 border border-[#3b82f6]/10 text-[#3b82f6] text-[11px] font-black uppercase tracking-[0.4em]"
              >
                <Building2 size={14} /> SERVICIO INSTITUCIONAL VIMUME
              </motion.div>
              
              <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.85] text-[#1a1a1a]">
                EL SONIDO <br />
                <span className="text-[#3b82f6]/20 text-6xl md:text-[8rem]">DE LA</span> <br />
                FUNCIÓN
              </h1>
              
              <p className="text-2xl md:text-3xl text-[#1a1a1a]/40 font-medium leading-tight max-w-xl italic">
                Transformamos centros de día y residencias a través de una metodología terapéutica de vanguardia. Intervención significativa.
              </p>
              
              <div className="flex flex-wrap gap-8 pt-8">
                <Link href="/vimume/contacto" className="px-14 py-7 bg-[#1a1a1a] text-white font-black uppercase italic tracking-tighter rounded-full flex items-center gap-4 hover:bg-[#3b82f6] transition-all shadow-2xl shadow-[#3b82f6]/15">
                  Solicitar Dossier <FileText size={22} />
                </Link>
                <Link href="/vimume/nosotros" className="px-14 py-7 border border-black/10 text-[#1a1a1a] font-black uppercase italic tracking-tighter rounded-full hover:bg-black hover:text-white transition-all">
                  Ver Metodología
                </Link>
              </div>
            </div>
            
            <motion.div 
              {...fadeIn}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {benefits.map((b, i) => (
                <div key={i} className={`p-12 rounded-[4rem] border border-black/[0.03] transition-all hover:shadow-2xl hover:shadow-[#3b82f6]/5 ${i === 0 ? 'md:col-span-2 bg-[#1a1a1a] text-white' : 'bg-white'}`}>
                  <p className={`text-6xl font-black mb-4 tracking-tighter italic ${i === 0 ? 'text-[#3b82f6]' : 'text-[#3b82f6]'}`}>{b.value}</p>
                  <p className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${i === 0 ? 'text-white/40' : 'text-black/20'}`}>{b.label}</p>
                  <p className={`text-lg italic leading-snug ${i === 0 ? 'text-white/60' : 'text-black/40'}`}>"{b.desc}"</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🧬 METHODOLOGY: The Integration Journey */}
      <section className="px-6 py-40 bg-white border-y border-black/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2dd4bf]/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto space-y-24 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="max-w-3xl space-y-8 text-left">
              <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none italic text-[#1a1a1a]">Proceso de <br /><span className="text-[#3b82f6]/20">Integración</span></h2>
              <p className="text-2xl text-[#1a1a1a]/40 leading-relaxed italic max-w-2xl">
                Nuestra implementación sigue un rigor clínico estricto para asegurar que cada sesión sea un avance medible en la vida de los residentes.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <motion.div 
                key={i} 
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="group p-10 bg-[#fdfcf8] border border-black/[0.03] rounded-[3.5rem] hover:border-[#3b82f6]/30 hover:shadow-2xl hover:shadow-[#3b82f6]/5 transition-all h-full flex flex-col justify-between"
              >
                <div>
                  <p className="text-[11px] font-black text-[#3b82f6] mb-12 opacity-30">ESTACIÓN 0{i + 1}</p>
                  <div className="p-5 bg-black/5 rounded-3xl w-fit group-hover:bg-[#1a1a1a] group-hover:text-white transition-all mb-10">
                    <step.icon size={28} />
                  </div>
                  <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-6 leading-tight">{step.title}</h4>
                  <p className="text-[15px] text-[#1a1a1a]/50 leading-relaxed italic">"{step.desc}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏺 EL IMPACTO INSTITUCIONAL */}
      <section className="px-6 py-40">
        <div className="max-w-7xl mx-auto text-center space-y-20">
          <Star size={80} className="mx-auto text-[#3b82f6] opacity-10" />
          <h2 className="text-6xl md:text-[9rem] font-black uppercase italic tracking-tighter leading-[0.75]">¿ACTIVAR <br /><span className="text-[#3b82f6]/20">UN PILOTO?</span></h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center pt-10">
            <Link href="/vimume/contacto" className="px-16 py-8 bg-[#1a1a1a] text-white font-black uppercase italic tracking-tighter rounded-full hover:bg-[#3b82f6] transition-all shadow-2xl shadow-[#3b82f6]/20 text-xl">
              Solicitar Auditoría de Centro
            </Link>
            <Link href="/vimume/roadmap" className="px-16 py-8 border border-black/10 text-[#1a1a1a] font-black uppercase italic tracking-tighter rounded-full hover:bg-black hover:text-white transition-all text-xl">
              Ver Hoja de Ruta 2026
            </Link>
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#1a1a1a]/20 pt-12">
            * Disponible para Centros de Día y Residencias Sanitarias.
          </p>
        </div>
      </section>
    </main>
  );
}
