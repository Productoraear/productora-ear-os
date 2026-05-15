"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  TrendingUp, 
  Users, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Target,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function VimumeFondosEuropeosPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white selection:bg-[#ecb613]/30">
      {/* 🇪🇺 EUROPEAN FUNDS HERO */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="space-y-8 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]"
            >
              <Globe size={14} /> ELEGIBILIDAD EUROPEA & CONSORCIOS
            </motion.div>
            <h1 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.8] italic">
              FONDOS <br />
              <span className="text-white/20">EUROPEOS</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/50 italic leading-relaxed">
              "Alineación estratégica con Horizon Europe, Erasmus+ y el Mecanismo de Recuperación (NextGen) para la innovación social en longevidad."
            </p>
          </div>
        </div>
      </section>

      {/* 🧬 ALINEACIÓN ESTRATÉGICA */}
      <section className="px-6 py-24 max-w-7xl mx-auto space-y-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              title: "Salud & Bienestar", 
              icon: Target, 
              desc: "Proyectos alineados con el ODS 3, enfocados en envejecimiento activo y prevención del deterioro cognitivo." 
            },
            { 
              title: "Inclusión Social", 
              icon: Users, 
              desc: "Combate a la soledad no deseada mediante redes de participación comunitaria y digitalización senior." 
            },
            { 
              title: "Escalabilidad", 
              icon: TrendingUp, 
              desc: "Capacidad de replicación territorial en municipios europeos mediante protocolos estandarizados." 
            }
          ].map((pillar, i) => (
            <div key={i} className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-6 hover:border-blue-500/30 transition-all">
              <div className="p-4 bg-white/5 rounded-2xl w-fit">
                <pillar.icon size={24} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">{pillar.title}</h3>
              <p className="text-white/40 text-sm italic leading-relaxed">"{pillar.desc}"</p>
            </div>
          ))}
        </div>

        {/* 📑 CAPACIDAD DE CONSORCIO */}
        <div className="p-20 bg-white/[0.01] border border-white/5 rounded-[5rem] space-y-12">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">VIMUME como Socio Tecnológico y de Campo</h2>
          <div className="grid md:grid-cols-2 gap-20">
            <div className="space-y-8">
              <p className="text-white/50 text-xl leading-relaxed italic">
                Ofrecemos a universidades, hospitales y consultoras de innovación una plataforma lista para el pilotaje real de intervenciones no farmacológicas.
              </p>
              <div className="space-y-4">
                {[
                  "Infraestructura de recolección de datos (Hermes Tracker)",
                  "Red de centros colaboradores para pilotos",
                  "Experiencia en comunicación y diseminación institucional",
                  "Metodología alineada con indicadores de impacto social"
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <ShieldCheck size={20} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70 italic">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-600/10 p-12 rounded-[4rem] border border-blue-600/20 space-y-6">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">NextGen EU</h3>
              <p className="text-white/40 text-sm italic">"VIMUME contribuye a la transformación digital de la asistencia senior y a la resiliencia de los sistemas de cuidados locales."</p>
              <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-400 transition-colors">
                Descargar Portfolio de Proyectos UE
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
