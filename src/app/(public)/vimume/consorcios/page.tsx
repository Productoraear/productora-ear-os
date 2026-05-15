"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Building2, 
  Users, 
  GraduationCap, 
  ArrowRight, 
  Globe, 
  ShieldCheck,
  Zap,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

export default function VimumeConsorciosPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white selection:bg-[#ecb613]/30">
      {/* 🤝 CONSORTIA HERO */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ecb613]/5 blur-[150px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="space-y-8 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em]"
            >
              <Network size={14} /> ESTRATEGIA DE ALIANZAS & CONSORCIOS
            </motion.div>
            <h1 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.8] italic">
              CONSORCIOS <br />
              <span className="text-white/20">MIXTOS</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/50 italic leading-relaxed">
              "VIMUME como pieza de infraestructura para la colaboración entre Sector Público, Academia y Empresa Privada."
            </p>
          </div>
        </div>
      </section>

      {/* 🧬 ARQUITECTURA DE COLABORACIÓN */}
      <section className="px-6 py-24 max-w-7xl mx-auto space-y-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Academia", icon: GraduationCap, desc: "Universidades e Institutos de Investigación aportando rigor científico y validación." },
            { title: "Sector Público", icon: Building2, desc: "Ayuntamientos y Consejerías desplegando el impacto en el territorio y cumplimiento ODS." },
            { title: "Empresa Privada", icon: Briefcase, desc: "Centros residenciales, aseguradoras y consultoras escalando el modelo de bienestar." },
          ].map((partner, i) => (
            <div key={i} className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-6 hover:border-[#ecb613]/30 transition-all">
              <div className="p-4 bg-white/5 rounded-2xl w-fit">
                <partner.icon size={24} className="text-[#ecb613]" />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">{partner.title}</h3>
              <p className="text-white/40 text-sm italic leading-relaxed">"{partner.desc}"</p>
            </div>
          ))}
        </div>

        {/* 📑 MODELO DE INTEGRACIÓN */}
        <div className="p-20 bg-white/[0.01] border border-white/5 rounded-[5rem] space-y-12">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">Capacidad de Interoperabilidad Institucional</h2>
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <p className="text-white/50 text-xl leading-relaxed italic">
                VIMUME no es un software aislado. Es una capa de intervención documentable diseñada para integrarse en memorias de sostenibilidad y planes asistenciales complejos.
              </p>
              <div className="space-y-6">
                {[
                  "Compatible con marcos de financiación NextGen y Horizon",
                  "Integración de KPIs social-sanitarios para Ayuntamientos",
                  "Gobernanza de datos compartida bajo protocolos éticos",
                  "Cocreación metodológica con equipos multidisciplinares"
                ].map((point, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <ShieldCheck size={20} className="text-[#ecb613]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70 italic">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-8">
               <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 space-y-4">
                  <Zap size={32} className="text-[#ecb613]" />
                  <h4 className="text-xl font-black uppercase italic tracking-tighter">¿Busca un socio para su consorcio?</h4>
                  <p className="text-white/40 text-xs italic italic">"Aportamos infraestructura de campo, red de centros y gestión de datos soberana."</p>
                  <button className="w-full py-4 bg-[#ecb613] text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                    Descargar Fact-Sheet para Socios
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
