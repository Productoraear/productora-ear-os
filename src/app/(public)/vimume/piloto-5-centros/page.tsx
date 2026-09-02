"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Users, 
  Building2, 
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function VimumePilotoPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white selection:bg-[#ecb613]/30">
      {/* 🎯 PILOTO HERO */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ecb613]/5 blur-[150px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="space-y-8 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em]"
            >
              <Target size={14} /> CONVOCATORIA 2026 • CENTROS PIONEROS
            </motion.div>
            <h1 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.8] italic">
              PILOTO <br />
              <span className="text-white/20">5 CENTROS</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/50 italic leading-relaxed">
              "Buscamos 5 centros residenciales o de día para liderar la validación metodológica de VIMUME en España."
            </p>
          </div>
        </div>
      </section>

      {/* 📋 QUÉ OFRECEMOS */}
      <section className="px-6 py-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter border-l-4 border-[#ecb613] pl-6 text-[#ecb613]">El Compromiso VIMUME</h2>
          <div className="space-y-8">
            {[
              { title: "Infraestructura Operativa", desc: "Acceso completo a Hermes Tracker OT para documentación de sesiones." },
              { title: "Acompañamiento Técnico", icon: Zap, desc: "Formación in-situ para el equipo de Terapia Ocupacional." },
              { title: "Reporte de Impacto", desc: "Generación de informes de bienestar para familias y dirección." },
              { title: "Visibilidad Institucional", desc: "Inclusión como caso de éxito en la memoria anual de impacto social." },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <CheckCircle2 size={24} className="text-[#ecb613] shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-xl font-black uppercase italic tracking-tighter">{item.title}</h4>
                  <p className="text-white/40 text-sm italic italic">"{item.desc}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 space-y-10">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Requisitos de Participación</p>
            <h3 className="text-3xl font-black uppercase italic tracking-tighter">¿Su centro es elegible?</h3>
          </div>
          <div className="space-y-6">
            <div className="p-6 bg-black border border-white/5 rounded-3xl flex gap-6 items-center">
              <Building2 className="text-[#ecb613]" />
              <span className="text-xs font-bold uppercase tracking-widest">Mínimo 20 usuarios activos</span>
            </div>
            <div className="p-6 bg-black border border-white/5 rounded-3xl flex gap-6 items-center">
              <Users className="text-[#ecb613]" />
              <span className="text-xs font-bold uppercase tracking-widest">Equipo de TO o Psicología</span>
            </div>
            <div className="p-6 bg-black border border-white/5 rounded-3xl flex gap-6 items-center">
              <Calendar className="text-[#ecb613]" />
              <span className="text-xs font-bold uppercase tracking-widest">Compromiso de 6 meses de pilotaje</span>
            </div>
          </div>
          <button className="w-full py-6 bg-[#ecb613] text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_50px_rgba(236,182,19,0.3)]">
            Solicitar Candidatura de Centro
          </button>
        </div>
      </section>

      {/* 📑 TRANSPARENCIA METODOLÓGICA */}
      <section className="px-6 py-24 bg-white/[0.01] border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
          <div className="w-full md:w-1/2 space-y-8">
            <div className="flex items-center gap-4 text-[#ecb613]">
              <Info size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Metodología de Campo</span>
            </div>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">Qué documentaremos</h2>
            <p className="text-white/50 text-xl leading-relaxed italic">
              Durante el pilotaje, VIMUME recogerá datos de participación, respuesta emocional y cambios en la apatía del usuario. **No realizamos diagnósticos médicos**; documentamos respuestas a la estimulación sonora para optimizar el bienestar.
            </p>
          </div>
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
             {['Respuesta Motriz', 'Evocación Verbal', 'Interacción Social', 'Calidad del Sueño'].map((item, i) => (
               <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#ecb613] mb-2">Indicador</p>
                  <p className="text-sm font-bold">{item}</p>
               </div>
             ))}
          </div>
        </div>
      </section>
    </main>
  );
}
