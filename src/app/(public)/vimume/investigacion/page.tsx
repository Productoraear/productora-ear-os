"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Microscope, 
  ArrowRight, 
  Star, 
  Brain, 
  Music, 
  Activity, 
  Database, 
  ShieldCheck, 
  Users2, 
  Library, 
  FileText, 
  ExternalLink,
  Beaker,
  Globe,
  Award,
  FlaskConical,
  Dna,
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
 * 🏛️ VIMUME SCIENCE HUB - LUMINOUS RIGOR REFACTOR
 * Concept: "Evidencia de Luz" (Evidence of Light)
 */
export default function ScienceHubPage() {
  return (
    <main className="bg-[#fdfcf8] min-h-screen text-[#1a1a1a] selection:bg-[#3b82f6]/10 relative overflow-hidden">
      
      {/* 🚀 HERO: SCIENCE HUB */}
      <section className="px-6 pt-56 pb-40 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#3b82f6]/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-12">
          <motion.div 
            {...fadeIn}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#3b82f6]/5 border border-[#3b82f6]/10 text-[#3b82f6] text-[11px] font-black uppercase tracking-[0.4em]"
          >
            <Microscope size={14} /> SCIENCE HUB & EVIDENCE LIBRARY
          </motion.div>
          
          <motion.h1 
            {...fadeIn}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-[10rem] font-black uppercase italic tracking-tighter leading-[0.75] text-[#1a1a1a]"
          >
            RIGOR <br />
            <span className="text-[#3b82f6]/20 text-6xl md:text-[8rem]">CIENTÍFICO</span>
          </motion.h1>
          
          <motion.p 
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-4xl text-[#1a1a1a]/40 font-medium italic leading-tight max-w-4xl mx-auto text-center py-12"
          >
            "La música no es solo arte; es una llave maestra neurológica. Basamos cada intervención en la evidencia clínica de la reminiscencia."
          </motion.p>
        </div>
      </section>

      {/* 🧬 THE "BACK DOOR" ARGUMENT */}
      <section className="px-6 py-40 bg-white border-y border-black/5 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <motion.div {...fadeIn} className="space-y-12">
            <div className="space-y-6">
               <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none italic">La Puerta Trasera <br /><span className="text-[#3b82f6]/20">Neurológica</span></h2>
               <p className="text-[#3b82f6] font-black uppercase tracking-widest text-[11px] bg-[#3b82f6]/5 w-fit px-4 py-1 rounded-full">Fundamento: Córtex Prefrontal Medial</p>
            </div>
            <p className="text-2xl text-[#1a1a1a]/60 leading-relaxed italic border-l-4 border-[#3b82f6] pl-8">
              Investigaciones globales han demostrado que las áreas del cerebro vinculadas a la memoria musical (como el **córtex prefrontal medial**) son las últimas en atrofiarse. 
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-10 bg-[#fdfcf8] rounded-[2.5rem] border border-black/[0.03] space-y-6 shadow-xl shadow-black/[0.02]">
                 <div className="p-4 bg-[#3b82f6]/5 rounded-2xl w-fit text-[#3b82f6]">
                    <Brain size={32} />
                 </div>
                 <h4 className="text-2xl font-black uppercase italic tracking-tighter">Resistencia al Atrofia</h4>
                 <p className="text-sm text-[#1a1a1a]/40 italic">Zonas de memoria musical preservadas incluso en fases avanzadas del Alzheimer.</p>
              </div>
              <div className="p-10 bg-[#fdfcf8] rounded-[2.5rem] border border-black/[0.03] space-y-6 shadow-xl shadow-black/[0.02]">
                 <div className="p-4 bg-[#2dd4bf]/5 rounded-2xl w-fit text-[#2dd4bf]">
                    <Zap size={32} />
                 </div>
                 <h4 className="text-2xl font-black uppercase italic tracking-tighter">Activación Inmediata</h4>
                 <p className="text-sm text-[#1a1a1a]/40 italic">Respuesta emocional y motora tras estímulos sonoros familiares intensos.</p>
              </div>
            </div>
          </motion.div>
          <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="relative group">
            <div className="absolute inset-0 bg-[#3b82f6]/5 blur-[120px] rounded-full group-hover:bg-[#3b82f6]/10 transition-all" />
            <div className="aspect-square bg-white border border-black/5 rounded-[5rem] flex items-center justify-center relative overflow-hidden shadow-inner">
               <Dna size={400} className="text-[#3b82f6]/5 absolute animate-pulse" />
               <div className="relative z-10 text-center space-y-6">
                 <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#3b82f6]">Visualización Terapéutica</p>
                 <Activity size={100} className="text-[#3b82f6] mx-auto opacity-20" />
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 📚 EVIDENCE LIBRARY */}
      <section className="px-6 py-40">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="flex flex-col md:flex-row items-center gap-10">
             <div className="p-6 bg-[#1a1a1a] rounded-3xl shadow-xl shadow-black/10">
               <Library size={40} className="text-white" />
             </div>
             <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-[#1a1a1a] italic leading-none">Biblioteca <br />de Evidencia</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {[
              { title: "Música y Demencia: Revisión Cochrane", source: "Cochrane Library, 2023", desc: "Meta-análisis sobre el impacto de la musicoterapia en la reducción de la ansiedad y mejora del bienestar." },
              { title: "Reminiscencia y Memoria Autobiográfica", source: "Journal of Alzheimer's Disease", desc: "Estudio sobre cómo la música de la juventud actúa como ancla de identidad en procesos degenerativos." },
              { title: "Neurobiología de la Emoción Musical", source: "Nature Neuroscience", desc: "Mecanismos de dopamina y recompensa activados por la música en el envejecimiento." },
              { title: "Protocolos OT e Intervención Sonora", source: "AJOT (American Journal of OT)", desc: "Integración de estímulos rítmicos en la rehabilitación funcional de miembros superiores." }
            ].map((study, i) => (
              <motion.div 
                key={i} 
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="p-16 bg-white border border-black/5 rounded-[4rem] hover:border-[#3b82f6]/30 hover:shadow-2xl hover:shadow-[#3b82f6]/5 transition-all group flex flex-col justify-between h-full"
              >
                <div className="space-y-8">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#3b82f6] px-5 py-2 bg-[#3b82f6]/5 rounded-full inline-block">{study.source}</span>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">{study.title}</h3>
                  <p className="text-[#1a1a1a]/50 italic text-xl">"{study.desc}"</p>
                </div>
                <div className="mt-12 pt-8 border-t border-black/5 flex justify-between items-center">
                  <span className="text-[11px] font-black text-[#1a1a1a]/20 uppercase tracking-widest italic">Documento PDF / Abstract</span>
                  <ExternalLink size={20} className="text-[#3b82f6] opacity-30 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📋 LÍNEAS DE INVESTIGACIÓN */}
      <section className="px-6 py-40 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Neurociencia Cognitiva", icon: Brain, desc: "Impacto de la frecuencia 40Hz en la reducción de beta-amiloides y estimulación rítmica." },
            { title: "Psicología Social", icon: Users2, desc: "Mitigación de la soledad no deseada mediante la vinculación emocional musical." },
            { title: "Gobernanza Ética", icon: Database, desc: "Modelos de gestión de datos sensibles en población mayor bajo marcos europeos." },
            { title: "Impacto Asistencial", icon: Microscope, desc: "Validación de protocolos de reminiscencia en entornos residenciales y de día." },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              {...fadeIn}
              transition={{ delay: i * 0.1 }}
              className="p-12 bg-white border border-black/5 rounded-[3rem] space-y-8 hover:border-[#3b82f6]/30 transition-all group hover:shadow-2xl hover:shadow-[#3b82f6]/5"
            >
              <div className="p-5 bg-black/5 rounded-3xl w-fit group-hover:bg-[#1a1a1a] group-hover:text-white transition-colors">
                <item.icon size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{item.title}</h3>
              <p className="text-[#1a1a1a]/40 text-sm italic leading-relaxed">"{item.desc}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🤝 MODELO DE COLABORACIÓN ACADÉMICA */}
      <section className="px-6 py-40 bg-[#1a1a1a] text-white border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#3b82f6]/10 blur-[200px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
          <motion.div {...fadeIn} className="space-y-12">
            <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none">Propuesta para <br /><span className="text-[#3b82f6]">Universidades</span></h2>
            <p className="text-white/50 text-2xl italic leading-relaxed">
              VIMUME ofrece un entorno real de campo para tesis doctorales, prácticas académicas coordinadas y proyectos de investigación financiados por la UE.
            </p>
            <div className="space-y-6">
              {[
                "Acceso a datos anonimizados de intervención",
                "Pilotaje de nuevas hipótesis metodológicas",
                "Participación en consorcios mixtos (Empresa-Universidad)",
                "Documentación de casos clínicos bajo protocolo S-Class"
              ].map((point, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <ShieldCheck size={24} className="text-[#3b82f6] shrink-0" />
                  <span className="text-[13px] font-black uppercase tracking-widest text-white/70 italic">{point}</span>
                </div>
              ))}
            </div>
            <Link href="/vimume/contacto" className="inline-flex items-center gap-5 text-[11px] font-black uppercase tracking-[0.4em] bg-[#3b82f6] text-white px-14 py-7 rounded-full hover:bg-white hover:text-black transition-all shadow-2xl shadow-[#3b82f6]/20">
              Solicitar Convenio <ArrowRight size={18} />
            </Link>
          </motion.div>
          
          <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 p-20 rounded-[5rem] space-y-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
               <Globe size={200} />
            </div>
            <h3 className="text-4xl font-black uppercase italic tracking-tighter text-[#3b82f6]">Research Fact Sheet</h3>
            <div className="space-y-10 relative z-10">
               {[
                 { label: "Marco GDPR", value: "Minimización y Pseudonimización" },
                 { label: "Consentimiento", value: "Protocolo Informado a Familiares" },
                 { label: "Validación", value: "VIMUME Ethics Board" },
                 { label: "Fase Actual", value: "Validación Centros Piloto (2026)" }
               ].map((fact, i) => (
                 <div key={i} className="border-b border-white/10 pb-6">
                   <p className="text-[11px] font-black uppercase text-white/30 tracking-widest mb-2">{fact.label}</p>
                   <p className="font-black text-2xl uppercase italic tracking-tighter">{fact.value}</p>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
