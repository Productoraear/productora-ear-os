"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  ClipboardCheck, 
  Brain, 
  Music, 
  ArrowRight, 
  Download, 
  Users, 
  ShieldCheck, 
  FileText,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function VimumeTerapiaOcupacionalPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white selection:bg-[#ecb613]/30">
      {/* 🏥 PROFESSIONAL HERO */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ecb613]/5 blur-[150px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="space-y-8 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em]"
            >
              <Stethoscope size={14} /> RECURSOS PARA TERAPIA OCUPACIONAL
            </motion.div>
            <h1 className="text-6xl md:text-[7rem] font-black uppercase tracking-tighter leading-[0.8] italic">
              INTERVENCIÓN <br />
              <span className="text-white/20">CON SENTIDO</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/50 italic leading-relaxed">
              "Más allá del entretenimiento genérico: Un marco de actividad significativa basado en música, reminiscencia y participación real."
            </p>
          </div>
        </div>
      </section>

      {/* 🧩 PROBLEMA VS PROPUESTA */}
      <section className="px-6 py-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter border-l-4 border-[#ecb613] pl-6">¿Por qué VIMUME?</h2>
          <div className="space-y-8">
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
              <h3 className="text-xl font-black uppercase tracking-tighter text-white/40 italic">El Desafío</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                "Muchos centros operan bajo agendas recreativas repetitivas que, aunque ocupan el tiempo, no siempre movilizan la identidad, la participación social ni el vínculo emocional del residente."
              </p>
            </div>
            <div className="p-10 bg-[#ecb613]/10 border border-[#ecb613]/20 rounded-[3rem] space-y-4">
              <h3 className="text-xl font-black uppercase tracking-tighter text-[#ecb613] italic">La Propuesta VIMUME</h3>
              <p className="text-[#ecb613] text-sm font-bold leading-relaxed">
                "Ofrecemos una herramienta complementaria para el TO: Actividades estructuradas y documentables que transforman la música en un vehículo de reminiscencia, reforzando la autonomía emocional y el sentido de pertenencia."
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "Reducción de Apatía", icon: Activity },
            { title: "Identidad & Memoria", icon: Brain },
            { title: "Vínculo Social", icon: Users },
            { title: "Participación Activa", icon: Music },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/10 flex flex-col gap-6 items-center text-center group hover:border-[#ecb613]/50 transition-all">
              <item.icon size={32} className="text-[#ecb613]" />
              <span className="text-xs font-black uppercase tracking-widest">{item.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 📋 RECURSOS DESCARGABLES (LEAD MAGNETS PARA OT) */}
      <section className="px-6 py-24 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-center">Toolkit para Profesionales</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Protocolo de Sesión V2.0", desc: "Fases operativas: Activación, Evocación, Conexión y Anclaje.", type: "PDF" },
              { title: "Hoja de Observación OT", desc: "Indicadores de respuesta rítmica, verbalización y estado de ánimo.", type: "XLS" },
              { title: "Guía de Adaptación", desc: "Cómo ajustar la intervención por GDS (Estadios de Demencia).", type: "PDF" },
            ].map((res, i) => (
              <div key={i} className="p-8 bg-black border border-white/5 rounded-[3rem] space-y-6 group hover:border-[#ecb613]/50 transition-all">
                <div className="flex justify-between items-start">
                  <FileText className="text-[#ecb613]" size={32} />
                  <span className="text-[10px] font-black px-3 py-1 bg-white/10 rounded-full">{res.type}</span>
                </div>
                <div className="space-y-2">
                   <h4 className="text-lg font-black uppercase italic tracking-tighter group-hover:text-[#ecb613] transition-colors">{res.title}</h4>
                   <p className="text-white/30 text-xs italic leading-relaxed">"{res.desc}"</p>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ecb613] pt-4">
                  <Download size={14} /> Descargar Recurso
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
