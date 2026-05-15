"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  BookOpen, 
  ArrowRight, 
  Users, 
  Building2, 
  Zap,
  Globe,
  Database
} from 'lucide-react';
import Link from 'next/link';

export default function VimumeRecursosPage() {
  const categories = [
    {
      title: "Para Centros & Equipos",
      resources: [
        { label: "Protocolo VIMUME V2.0", type: "PDF", size: "2.4 MB", desc: "Manual completo de intervención musical." },
        { label: "Checklist de Sesión OT", type: "PDF", size: "0.8 MB", desc: "Guía rápida para terapeutas ocupacionales." },
        { label: "Hoja de Registro de Campo", type: "XLS", size: "1.1 MB", desc: "Plantilla para documentación de respuestas." }
      ]
    },
    {
      title: "Para Instituciones & B2G",
      resources: [
        { label: "Dossier de Impacto ODS", type: "PDF", size: "4.5 MB", desc: "Indicadores sociales y alineación Agenda 2030." },
        { label: "Fact-Sheet Fondos Europeos", type: "PDF", size: "1.2 MB", desc: "Elegibilidad y capacidad de consorcio." },
        { label: "Guía de Gobernanza del Dato", type: "PDF", size: "0.9 MB", desc: "Marco ético y cumplimiento GDPR." }
      ]
    }
  ];

  return (
    <main className="bg-[#050505] min-h-screen text-white selection:bg-[#ecb613]/30">
      {/* 📑 RESOURCES HERO */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ecb613]/5 blur-[150px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="space-y-8 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em]"
            >
              <FileText size={14} /> BIBLIOTECA DE RECURSOS VIMUME
            </motion.div>
            <h1 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.8] italic">
              RECURSOS <br />
              <span className="text-white/20">DESCARGABLES</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/50 italic leading-relaxed">
              "Materiales técnicos, protocolos y dossiers para profesionales, instituciones y centros de investigación."
            </p>
          </div>
        </div>
      </section>

      {/* 🧬 RESOURCE DIRECTORY */}
      <section className="px-6 py-24 max-w-7xl mx-auto space-y-32">
        <div className="grid md:grid-cols-2 gap-20">
          {categories.map((cat, i) => (
            <div key={i} className="space-y-12">
              <h3 className="text-4xl font-black uppercase italic tracking-tighter border-l-4 border-[#ecb613] pl-6">{cat.title}</h3>
              <div className="space-y-6">
                {cat.resources.map((res, j) => (
                  <div key={j} className="group p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-[#ecb613]/5 hover:border-[#ecb613]/20 transition-all flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                       <span className="text-[10px] font-black px-3 py-1 bg-white/10 rounded-full">{res.type} • {res.size}</span>
                       <Download size={18} className="text-[#ecb613] group-hover:scale-125 transition-transform" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-black uppercase italic tracking-tighter group-hover:text-[#ecb613] transition-colors">{res.label}</h4>
                      <p className="text-white/40 text-xs italic italic">"{res.desc}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 🔐 ACCESO RESTRINGIDO A HERMES */}
        <div className="p-20 bg-white/[0.01] border border-white/5 rounded-[5rem] flex flex-col md:flex-row gap-12 items-center justify-between">
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Infraestructura Hermes Tracker</h2>
            <p className="text-white/40 italic">
              "El acceso a la plataforma operativa Hermes Tracker OT está reservado a centros en fase piloto y profesionales certificados."
            </p>
          </div>
          <Link href="/vimume/hermes/dashboard" className="px-12 py-6 bg-[#ecb613] text-black rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_50px_rgba(236,182,19,0.3)] flex items-center gap-4">
             Entrar al Panel Operativo <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
