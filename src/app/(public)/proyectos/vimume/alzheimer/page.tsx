"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Zap, 
  ArrowLeft, 
  Download,
  Microscope,
  ShieldCheck,
  FileText
} from 'lucide-react';
import Link from 'next/link';

/**
 * 🧠 VIMUME: ALZHEIMER & DEMENTIA NODE
 * Content extracted from VIMUME_SCIENTIFIC_FOUNDATION.md
 */
export default function AlzheimerPage() {
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
            ALZHEIMER <br />
            <span className="text-white/20">& DEMENCIA</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#ecb613] max-w-3xl mx-auto italic font-black uppercase tracking-widest">
            Neurociencia Aplicada a la Reminiscencia Musical
          </p>
        </div>
      </section>

      {/* 🧬 SCIENTIFIC PILLARS */}
      <section className="px-6 py-32 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { label: "Mecanismo", title: "Gamma 40Hz", desc: "Estimulación sensorial que activa la microglía para reducir placas amiloides.", icon: Zap },
            { label: "Evidencia", title: "Cochrane Meta-analysis", desc: "Mejora significativa en depresión y síntomas conductuales en demencia.", icon: Microscope },
            { label: "Memoria", title: "DMN Network", desc: "Activación del Default Mode Network mediante música autobiográfica familiar.", icon: Brain },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-6 group hover:bg-[#ecb613]/5 transition-all"
            >
              <item.icon size={32} className="text-[#ecb613]" />
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{item.label}</p>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter group-hover:text-[#ecb613] transition-colors">{item.title}</h3>
              </div>
              <p className="text-white/40 text-sm leading-relaxed italic">"{item.desc}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 📖 DEEP CONTENT */}
      <section className="px-6 py-20 max-w-4xl mx-auto space-y-24">
        <article className="prose prose-invert prose-zinc max-w-none prose-h2:text-4xl prose-h2:font-black prose-h2:uppercase prose-h2:tracking-tighter prose-h2:italic prose-p:text-lg prose-p:text-white/60 prose-strong:text-[#ecb613] prose-blockquote:border-[#ecb613] prose-blockquote:bg-white/5 prose-blockquote:p-8 prose-blockquote:rounded-2xl">
          <h2>1. La Música como Última Fortaleza Cerebral</h2>
          <p>
            Incluso en fases avanzadas de Alzheimer, las redes neuronales que procesan la música permanecen parcialmente independientes de las áreas dañadas por la neurodegeneración. Esto permite que los pacientes reconozcan melodías, canten letras y sientan emociones profundas cuando el lenguaje y la orientación ya se han perdido.
          </p>
          <blockquote>
            "Las redes neuronales musicales son las últimas en caer. VIMUME utiliza este puente biológico para reconectar con la identidad del individuo."
          </blockquote>

          <h2>2. Estimulación Gamma 40Hz: El MIT en VIMUME</h2>
          <p>
            VIMUME es el primer protocolo que integra la estimulación gamma a 40Hz a través de música en directo. Basándonos en las investigaciones del MIT Tsai Lab, utilizamos pulsos rítmicos controlados (guitarrón a 40 BPM) y estímulos visuales suaves para entrenar las oscilaciones cerebrales y favorecer la limpieza de residuos neurotóxicos.
          </p>
          
          <h2>3. Musicoterapia Activa vs Pasiva</h2>
          <p>
            No somos un concierto pasivo. En VIMUME, los residentes participan con instrumentos sensoriales adaptados (maracas, claves, panderetas). La participación activa mejora la coordinación motora, la atención sostenida y la socialización grupal, multiplicando el impacto clínico de la sesión.
          </p>
        </article>

        {/* 📑 BIBLIOGRAPHY SECTION */}
        <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 space-y-12">
          <div className="space-y-4">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-[#ecb613]">Rigor Científico</h3>
            <p className="text-white/40 text-sm">Referencias clave que avalan nuestra metodología.</p>
          </div>
          <div className="grid gap-6">
            {[
              { author: "Iaccarino et al. (Nature, 2016)", title: "Gamma frequency entrainment attenuates amyloid load." },
              { author: "Van der Steen (Cochrane, 2018)", title: "Music-based interventions for people with dementia." },
              { author: "Oliver Sacks (2007)", title: "Musicophilia: Tales of Music and the Brain." }
            ].map((ref, i) => (
              <div key={i} className="flex gap-4 p-6 bg-black/40 rounded-2xl border border-white/5">
                <ShieldCheck size={20} className="text-[#ecb613] shrink-0" />
                <div className="space-y-1">
                  <p className="font-black text-[10px] uppercase tracking-widest text-[#ecb613]">{ref.author}</p>
                  <p className="text-white/50 text-sm italic">"{ref.title}"</p>
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
              Manual de <br />
              <span className="text-[#ecb613]">Estimulación Gamma</span>
            </h2>
            <p className="text-white/50 text-xl leading-relaxed italic">
              "Reciba el protocolo base para la integración de estímulos 40Hz en entornos residenciales y centros de día."
            </p>
            <button className="px-12 py-5 bg-[#ecb613] text-black rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_50px_rgba(236,182,19,0.3)]">
              <Download size={18} /> Descargar Guía Científica
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">Navegación en Cascada:</p>
            {[
              { title: "Protocolo Operativo V2.0", href: "/proyectos/vimume/protocolo", icon: Zap },
              { title: "Impacto en Silver Economy", href: "/proyectos/vimume/silver-economy", icon: TrendingUp },
              { title: "Solicitar Consultoría", href: "/contacto", icon: FileText },
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
function TrendingUp(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg> }
