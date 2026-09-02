"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Target, 
  Building2, 
  ArrowLeft, 
  Download,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-react';
import Link from 'next/link';

/**
 * 🏛️ VIMUME: AGENDA 2030 & ODS NODE
 * Content extracted from VIMUME_DOSSIER_NAVALCARNERO_ODS.md
 */
export default function ODS2030Page() {
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
            AGENDA <br />
            <span className="text-[#ecb613]">2030 / ODS</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto italic">
            "Navalcarnero y el Envejecimiento Activo de Élite. Cumplimiento de objetivos internacionales mediante innovación social."
          </p>
        </div>
      </section>

      {/* 🌍 ODS GRID */}
      <section className="px-6 py-32 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { label: "ODS 3", title: "Salud y Bienestar", desc: "Mejora medible de la calidad de vida y reducción del estrés en cuidadores.", icon: Heart },
            { label: "ODS 10", title: "Reducción Desigualdad", desc: "Inclusión activa de la población senior en la vida cultural del municipio.", icon: Users },
            { label: "ODS 11", title: "Ciudades Sostenibles", desc: "Navalcarnero como referente nacional en gestión senior inteligente.", icon: Building2 },
          ].map((ods, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-6 group hover:bg-[#ecb613]/5 transition-all"
            >
              <ods.icon size={32} className="text-[#ecb613]" />
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]">{ods.label}</p>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter group-hover:text-[#ecb613] transition-colors">{ods.title}</h3>
              </div>
              <p className="text-white/40 text-sm leading-relaxed italic">"{ods.desc}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 📖 B2G CONTENT */}
      <section className="px-6 py-20 max-w-4xl mx-auto space-y-24">
        <article className="prose prose-invert prose-zinc max-w-none prose-h2:text-4xl prose-h2:font-black prose-h2:uppercase prose-h2:tracking-tighter prose-h2:italic prose-p:text-lg prose-p:text-white/60 prose-strong:text-[#ecb613]">
          <h2>1. El Reto de la Soledad No Deseada</h2>
          <p>
            Las administraciones municipales se enfrentan al reto demográfico del siglo XXI. VIMUME ofrece un <strong>Protocolo de Intervención Sensorial</strong> que convierte el presupuesto municipal en un activo de salud pública real y medible.
          </p>
          
          <h2>2. Navalcarnero: Un Blueprint para España</h2>
          <p>
            El despliegue en Navalcarnero demuestra cómo una inversión quirúrgica en programas de reminiscencia musical puede elevar el orgullo local, mejorar el bienestar de los abuelos y ofrecer un ROI social transparente a través del <strong>VIMUME Tracker</strong>.
          </p>

          <h2>3. Cumplimiento de Metas Internacionales</h2>
          <p>
            VIMUME alinea la estrategia local con los objetivos internacionales de desarrollo sostenible, posicionando al municipio como un territorio comprometido con la <strong>dignidad en la longevidad</strong>.
          </p>
        </article>

        {/* 📋 PROPOSAL BLUEPRINT */}
        <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 space-y-12">
          <div className="space-y-4">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-[#ecb613]">Pack VIMUME Social</h3>
            <p className="text-white/40 text-sm italic">Blueprint de implementación para Ayuntamientos.</p>
          </div>
          <div className="grid gap-6">
            {[
              { title: "Ciclo de 10 Intervenciones", desc: "Despliegue en centros de día y residencias municipales." },
              { title: "VIMUME Tracker para Gestión", desc: "Panel de métricas en tiempo real para justificación presupuestaria." },
              { title: "Jornada Intergeneracional", desc: "Evento de cierre para reconectar nietos y abuelos en el municipio." }
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-6 p-8 bg-black/40 rounded-3xl border border-white/5 group hover:border-[#ecb613]/30 transition-all">
                <Target size={24} className="text-[#ecb613]/40 group-hover:text-[#ecb613] transition-colors" />
                <div className="space-y-1">
                  <p className="font-black text-sm uppercase tracking-tighter">{row.title}</p>
                  <p className="text-white/40 text-xs italic">"{row.desc}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🧲 LEAD MAGNET & RECURSIVE LINKING */}
      <section className="px-6 py-32 bg-[#ecb613]/5 border-y border-[#ecb613]/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
              Dossier para <br />
              <span className="text-[#ecb613]">Administraciones</span>
            </h2>
            <p className="text-white/50 text-xl leading-relaxed italic">
              "Descargue el informe detallado sobre cómo VIMUME ayuda al cumplimiento de los ODS en el ámbito municipal."
            </p>
            <button className="px-12 py-5 bg-[#ecb613] text-black rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_50px_rgba(236,182,19,0.3)]">
              <Download size={18} /> Descargar Dossier ODS
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">Continuar Explorando:</p>
            {[
              { title: "Análisis Silver Economy", href: "/proyectos/vimume/silver-economy", icon: TrendingUp },
              { title: "Protocolo Metodológico", href: "/proyectos/vimume/protocolo", icon: Zap },
              { title: "Centro de Conocimiento", href: "/vimume", icon: Globe },
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
function Heart(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg> }
function Users(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> }
function Zap(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> }
