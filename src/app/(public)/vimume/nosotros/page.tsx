"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ArrowRight, 
  Star, 
  Users, 
  Zap,
  Quote,
  Brain,
  Microscope,
  Building2,
  ShieldCheck,
  Eye,
  FileText,
  Target,
  Fingerprint,
  Cpu,
  HeartPulse,
  Bird
} from 'lucide-react';
import Link from 'next/link';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
};

/**
 * 🏛️ VIMUME ABOUT PAGE - LUMINOUS STORYTELLING REFACTOR
 * Concept: "El legado del colibrí" (The Hummingbird's Legacy)
 */
export default function SobreNosotrosPage() {
  return (
    <main className="bg-[#fdfcf8] min-h-screen text-[#1a1a1a] selection:bg-[#3b82f6]/10 relative overflow-hidden">
      
      {/* 🚀 HERO: MANIFIESTO DE VERDAD */}
      <section className="px-6 pt-56 pb-40 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#3b82f6]/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-12">
          <motion.div 
            {...fadeIn}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#3b82f6]/5 border border-[#3b82f6]/10 text-[#3b82f6] text-[11px] font-black uppercase tracking-[0.4em]"
          >
            <Star size={14} /> DOSSIER INSTITUCIONAL V.2026
          </motion.div>
          
          <motion.h1 
            {...fadeIn}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-[10rem] font-black uppercase italic tracking-tighter leading-[0.75] text-[#1a1a1a]"
          >
            EL PACTO <br />
            <span className="text-[#3b82f6]/20 text-6xl md:text-[8rem]">DE CUIDADO</span>
          </motion.h1>
          
          <motion.p 
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-4xl text-[#1a1a1a]/40 font-medium italic leading-tight max-w-4xl mx-auto text-center py-12"
          >
            "No gestionamos 'pacientes'; honramos historias de vida. Operamos bajo un protocolo de Humanidad Radical."
          </motion.p>
        </div>
      </section>

      {/* 🐦 LA FÁBULA DEL COLIBRÍ (HACIENDO NUESTRA PARTE) */}
      <section className="px-6 py-40 bg-white border-y border-black/5 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <motion.div {...fadeIn} className="space-y-12">
            <div className="p-5 bg-[#3b82f6]/5 border border-[#3b82f6]/10 rounded-3xl w-fit">
              <Bird size={36} className="text-[#3b82f6]" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none italic">Haciendo <br /><span className="text-[#3b82f6]/20">nuestra parte</span></h2>
            <div className="space-y-8 text-[#1a1a1a]/60 italic text-xl leading-relaxed text-balance">
              <p>
                Cuentan que en un gran incendio en la selva, todos los animales huían aterrorizados. Un pequeño colibrí, sin embargo, volaba una y otra vez hacia las llamas con una gota de agua en su pico.
              </p>
              <p>
                El león le preguntó: "¿Qué crees que haces? No podrás apagar el incendio solo". El colibrí respondió: <strong>"Lo sé, pero yo estoy haciendo mi parte"</strong>.
              </p>
              <p className="text-[#1a1a1a] font-black not-italic border-l-4 border-[#3b82f6] pl-8 py-4">
                Edwin Agudelo fundó VIMUME bajo esta premisa. Como su manera de devolver a España la gratitud por media vida en este país, decidió poner su talento artístico al servicio de quienes más lo necesitan: nuestros mayores.
              </p>
            </div>
          </motion.div>
          <div className="bg-[#fdfcf8] p-20 rounded-[5rem] border border-black/[0.03] relative overflow-hidden group shadow-2xl shadow-[#3b82f6]/5">
            <Bird size={250} className="absolute -bottom-10 -right-10 text-[#3b82f6] opacity-5 group-hover:scale-110 transition-transform duration-1000" />
            <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-10 italic text-[#3b82f6]">El Compromiso de Edwin</h3>
            <p className="text-[#1a1a1a]/40 italic text-2xl leading-relaxed">
              "VIMUME no es un negocio; es un legado. Celebro mi historia en este país devolviendo la identidad a quienes la están perdiendo. Es mi gota de agua en el incendio del olvido."
            </p>
          </div>
        </div>
      </section>

      {/* 🛡️ 1. EL ECOSISTEMA DE RESPETO */}
      <section className="px-6 py-40">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="flex flex-col md:flex-row items-center gap-10">
             <div className="p-6 bg-[#1a1a1a] rounded-3xl shadow-xl shadow-black/10">
               <Users size={40} className="text-white" />
             </div>
             <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-[#1a1a1a] italic leading-none">1. El Ecosistema <br />de Respeto</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                tag: "LOS PARTICIPANTES", 
                title: "Dignidad Absoluta", 
                desc: "Rechazamos el lenguaje infantilizador. Nos dirigimos a ellos con el respeto jerárquico que merecen sus años.",
                quote: "No son sujetos de terapia; son guías.",
                icon: Heart,
                color: "#3b82f6"
              },
              { 
                tag: "FAMILIAS", 
                title: "Transparencia Total", 
                desc: "Ofrecemos canales directos para actualizaciones reales, no automatizadas. No endulzamos, acompañamos.",
                quote: "Certeza, no solo esperanza.",
                icon: Eye,
                color: "#2dd4bf"
              },
              { 
                tag: "CLÍNICOS", 
                title: "Rigor Científico", 
                desc: "No competimos con la medicina; nos integramos. Entregamos informes basados en evidencia clínica.",
                quote: "Es clínica, no entretenimiento.",
                icon: Microscope,
                color: "#ecb613"
              },
              { 
                tag: "SOCIOS", 
                title: "Filosofía de Legado", 
                desc: "De la caridad a la inversión. Buscamos socios que quieran innovar en la Silver Economy.",
                quote: "Resultados medibles. Cero humo.",
                icon: Building2,
                color: "#1a1a1a"
              }
            ].map((card, i) => (
              <motion.div 
                key={i}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="p-16 bg-white border border-black/5 rounded-[4rem] space-y-12 group hover:border-[#3b82f6]/30 transition-all flex flex-col justify-between hover:shadow-2xl hover:shadow-[#3b82f6]/5"
              >
                <div className="space-y-10">
                  <div className="flex justify-between items-start">
                     <div className="p-5 bg-black/5 rounded-3xl group-hover:bg-[#1a1a1a] group-hover:text-white transition-all">
                       <card.icon size={30} />
                     </div>
                     <span className="text-[11px] font-black uppercase tracking-widest text-[#1a1a1a]/20">{card.tag}</span>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{card.title}</h3>
                    <p className="text-[#1a1a1a]/50 leading-relaxed text-xl italic">"{card.desc}"</p>
                  </div>
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest italic pt-8 border-t border-black/5" style={{ color: card.color }}>
                  {card.quote}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📡 2. LOS 3 VERTICALES DE IMPACTO */}
      <section className="px-6 py-40 bg-[#1a1a1a] text-white border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#3b82f6]/10 blur-[200px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto space-y-24 relative z-10">
          <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none italic">Los 3 <br /><span className="text-white/20 text-5xl md:text-[7rem]">Verticales</span></h2>
          <div className="grid lg:grid-cols-3 gap-10">
            {[
              { title: "Banca & Seguros", sub: "Longevidad Digna", icon: Building2, desc: "Eficiencia sociosanitaria. Reducción de ansiedad sin fármacos." },
              { title: "Tech & Telco", sub: "Conexión Humana", icon: Cpu, desc: "Usamos tecnología de audio para reconectar neuronas y familias." },
              { title: "Sanitaria", sub: "Terapia Complementaria", icon: HeartPulse, desc: "Humanización de marca. Cuidamos la identidad del paciente." }
            ].map((v, i) => (
              <div key={i} className="p-16 bg-white/5 border border-white/10 rounded-[5rem] space-y-10 group hover:bg-white hover:text-black transition-all text-left h-full flex flex-col justify-between">
                <div className="space-y-10">
                  <div className="p-8 bg-white/10 rounded-[2.5rem] w-fit group-hover:bg-[#1a1a1a] group-hover:text-white transition-all">
                    <v.icon size={40} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-none">{v.title}</h4>
                    <p className="text-[#3b82f6] text-[11px] font-black uppercase tracking-widest">{v.sub}</p>
                  </div>
                  <p className="text-white/40 group-hover:text-black/60 italic text-lg leading-relaxed">"{v.desc}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏺 CTA FINAL */}
      <section className="px-6 py-60 text-center">
        <div className="max-w-5xl mx-auto space-y-16">
          <motion.div {...fadeIn}>
            <h2 className="text-6xl md:text-[10rem] font-black uppercase italic tracking-tighter leading-[0.75] mb-16 italic text-[#1a1a1a]">
              SÉ PARTE <br />
              <span className="text-[#3b82f6]/20">DEL LEGADO.</span>
            </h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              <Link href="/vimume/contacto" className="w-full md:w-auto px-16 py-8 bg-[#1a1a1a] text-white font-black uppercase italic tracking-tighter rounded-full text-2xl shadow-2xl shadow-[#3b82f6]/10 hover:bg-[#3b82f6] transition-all">
                Activar Protocolo
              </Link>
              <Link href="/vimume/inversion" className="w-full md:w-auto px-16 py-8 border border-black/10 text-[#1a1a1a] font-black uppercase italic tracking-tighter rounded-full text-2xl hover:bg-[#1a1a1a] hover:text-white transition-all">
                Plan de Inversión
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
