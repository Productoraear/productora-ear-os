"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Target, 
  ArrowLeft, 
  Download,
  Calendar,
  CheckCircle2,
  Users,
  Brain,
  Music
} from 'lucide-react';
import Link from 'next/link';

/**
 * 🎶 VIMUME: PROTOCOLO DE SESIÓN NODE
 * Content extracted from PRO_VIMUME_SESSION_PROTOCOL_V2.md
 */
export default function ProtocoloPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white selection:bg-[#ecb613]/30">
      {/* 🖼️ HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ecb613]/5 blur-[150px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
          <Link 
            href="/vimume" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-[#ecb613] transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Volver al Hub VIMUME
          </Link>
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none italic">
            PROTOCOLO <br />
            <span className="text-[#ecb613]">V2.0</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto italic">
            "De espectáculos musicales a intervenciones terapéuticas medibles. Metodología VIMUME para centros de vanguardia."
          </p>
        </div>
      </section>

      {/* ⚙️ OPERATIONAL GRID */}
      <section className="px-6 py-32 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { label: "Fase 1", title: "Activación", desc: "Captar atención y elevar el estado de ánimo (15 min).", icon: Zap },
            { label: "Fase 2", title: "Evocación", desc: "Core terapéutico con 40Hz y reminiscencia (20 min).", icon: Brain },
            { label: "Fase 3", title: "Conexión", desc: "Refuerzo de identidad social y emocional (15 min).", icon: Users },
            { label: "Fase 4", title: "Anclaje", desc: "Cierre positivo y medición de resultados (10 min).", icon: CheckCircle2 },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4"
            >
              <item.icon size={24} className="text-[#ecb613]" />
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#ecb613]">{item.label}</p>
                <h3 className="text-xl font-black italic uppercase tracking-tighter">{item.title}</h3>
              </div>
              <p className="text-white/40 text-xs leading-relaxed italic">"{item.desc}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 📋 DETAILED PHASES */}
      <section className="px-6 py-20 max-w-4xl mx-auto space-y-32">
        <div className="space-y-12">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter text-[#ecb613]">Filosofía del Protocolo</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Antes (v1.0)</p>
              <p className="text-white/50 text-sm italic italic">"Artistas llegan → Tocan canciones bonitas → Residentes se emocionan → Fin"</p>
            </div>
            <div className="p-8 bg-[#ecb613]/10 rounded-3xl border border-[#ecb613]/20 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]">Ahora (v2.0)</p>
              <p className="text-[#ecb613] text-sm italic font-bold">"Evaluación → Activación → Evocación 40Hz → Conexión → Anclaje → Medición"</p>
            </div>
          </div>
        </div>

        <article className="prose prose-invert prose-zinc max-w-none prose-h3:text-2xl prose-h3:font-black prose-h3:uppercase prose-h3:tracking-tighter prose-h3:italic prose-p:text-lg prose-p:text-white/60 prose-li:text-white/60">
          <h3>Equipamiento Sensorial</h3>
          <ul>
            <li><strong>Maracas de grip suave</strong>: Para participación rítmica y estimulación táctil.</li>
            <li><strong>Claves de madera</strong>: Coordinación motora fina y timing.</li>
            <li><strong>Panderetas y Campanas</strong>: Estímulo visual y auditivo de alta frecuencia.</li>
            <li><strong>VIMUME Tracker</strong>: Registro digital de variables antes, durante y después.</li>
          </ul>

          <h3>Variables de Medición</h3>
          <p>
            No nos basamos en impresiones subjetivas. El VIMUME Tracker audita: atención sostenida, participación vocal, reconocimiento de canciones, verbalización espontánea y mejora del baseline anímico 24h después de la sesión.
          </p>
        </article>

        {/* 📑 SESSION REPORT EXAMPLE */}
        <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Calendar size={120} />
          </div>
          <div className="space-y-4 relative z-10">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-[#ecb613]">Informe de Sesión</h3>
            <p className="text-white/40 text-sm italic">Ejemplo de entregable institucional generado por el sistema.</p>
          </div>
          <div className="space-y-6 bg-black/40 p-8 rounded-3xl border border-white/5 relative z-10">
            <div className="flex justify-between border-b border-white/5 pb-4">
              <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Ánimo PRE-sesión</span>
              <span className="text-white/60 font-bold">4.2 / 10</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-4">
              <span className="text-[10px] font-black uppercase text-[#ecb613] tracking-widest font-bold">Ánimo POST-sesión</span>
              <span className="text-[#ecb613] font-black">+3.6 pts</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-4">
              <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Participación Instrumental</span>
              <span className="text-white/60 font-bold">91% de residentes</span>
            </div>
            <div className="pt-4">
              <p className="text-[8px] font-black uppercase text-white/20 tracking-widest mb-2">Momentos Destacados:</p>
              <p className="text-white/50 text-xs italic">"Residente con Alzheimer moderado recordó letra completa de 'Bésame Mucho' tras 3 meses de mutismo selectivo."</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🧲 LEAD MAGNET & RECURSIVE LINKING */}
      <section className="px-6 py-32 bg-[#ecb613]/5 border-y border-[#ecb613]/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
              Checklist de <br />
              <span className="text-[#ecb613]">Humanización</span>
            </h2>
            <p className="text-white/50 text-xl leading-relaxed italic">
              "Descargue la guía de auditoría sensorial para centros de día y residencias. ¿Qué evaluar antes de implantar un programa musical?"
            </p>
            <button className="px-12 py-5 bg-[#ecb613] text-black rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_50px_rgba(236,182,19,0.3)]">
              <Download size={18} /> Descargar Checklist VIMUME
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">Malla Documental Cascada:</p>
            {[
              { title: "Base Neurocientífica", href: "/proyectos/vimume/alzheimer", icon: Brain },
              { title: "Mercado Silver Economy", href: "/proyectos/vimume/silver-economy", icon: Target },
              { title: "Diario de Sesiones (Casos)", href: "/blog/casos-clinicos", icon: Music },
            ].map((link, i) => (
              <Link 
                key={i} 
                href={link.href}
                className="p-8 bg-black border border-white/5 rounded-3xl flex items-center justify-between group hover:border-[#ecb613]/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <link.icon size={20} className="text-[#ecb613]/40 group-hover:text-[#ecb613]" />
                  <span className="font-black text-sm uppercase tracking-tighter group-hover:translate-x-2 transition-transform">{link.title}</span>
                </div>
                <ArrowLeft size={16} className="rotate-180 text-white/20 group-hover:text-[#ecb613]" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
