"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Database, 
  Lock, 
  Eye, 
  UserCheck, 
  FileText, 
  ArrowRight,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function VimumeGobernanzaPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white selection:bg-[#ecb613]/30">
      {/* 🛡️ GOVERNANCE HERO */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ecb613]/5 blur-[150px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="space-y-8 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em]"
            >
              <ShieldCheck size={14} /> PRIVACIDAD & ÉTICA S-CLASS
            </motion.div>
            <h1 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.8] italic">
              GOBERNANZA <br />
              <span className="text-white/20">DEL DATO</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/50 italic leading-relaxed">
              "Marcos de protección, ética y seguridad para la gestión de datos sensibles en la intervención senior."
            </p>
          </div>
        </div>
      </section>

      {/* 🔐 PILARES DE SEGURIDAD */}
      <section className="px-6 py-24 max-w-7xl mx-auto space-y-24">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "Minimización", 
              icon: Database, 
              desc: "Solo recolectamos los datos estrictamente necesarios para la personalización de la intervención musical y el bienestar emocional." 
            },
            { 
              title: "Pseudonimización", 
              icon: Lock, 
              desc: "Los identificadores personales se disocian de los datos de respuesta clínica para garantizar el anonimato en fases de análisis." 
            },
            { 
              title: "Finalidad Legítima", 
              icon: UserCheck, 
              desc: "El uso de los datos está restringido exclusivamente a la mejora asistencial, la investigación científica y el reporte institucional autorizado." 
            }
          ].map((pillar, i) => (
            <div key={i} className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-6 hover:border-[#ecb613]/30 transition-all">
              <div className="p-4 bg-white/5 rounded-2xl w-fit">
                <pillar.icon size={24} className="text-[#ecb613]" />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">{pillar.title}</h3>
              <p className="text-white/40 text-sm italic leading-relaxed">"{pillar.desc}"</p>
            </div>
          ))}
        </div>

        {/* 📑 MARCO ÉTICO */}
        <div className="p-20 bg-white/[0.01] border border-white/5 rounded-[5rem] space-y-12">
          <div className="flex items-center gap-4 text-[#ecb613]">
            <Info size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Compromiso VIMUME</span>
          </div>
          <h2 className="text-5xl font-black uppercase italic tracking-tighter max-w-3xl">Gobernanza centrada en la Dignidad de la Persona</h2>
          <p className="text-white/50 text-xl leading-relaxed italic max-w-4xl">
            VIMUME no comercializa datos. Nuestra infraestructura está diseñada para ser compatible con el **Espacio Europeo de Datos de Salud (EHDS)**, asegurando que el control de la información permanezca siempre bajo la tutela del profesional autorizado y el consentimiento del representante legal.
          </p>
          <div className="grid md:grid-cols-2 gap-8 pt-12">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#ecb613]">Acceso Restringido</h4>
              <p className="text-white/30 text-xs italic">Solo terapeutas con ID profesional validado pueden acceder a las fichas de sesión.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#ecb613]">Auditoría Continua</h4>
              <p className="text-white/30 text-xs italic">Cada acceso e impresión de informe genera un log de auditoría inmutable (Audit Log).</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
