'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { GraduationCap, Trophy, BookOpen, Sparkles, ShieldCheck, Download, Play, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// 1. Carga diferida de componentes de alta intensidad para aislamiento del Blast Radius
const AcademyPanel = dynamic(
  () => import('@/modules/SClassScreens/panels/AcademyPanel').then(mod => mod.AcademyPanel || mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-[#0a0a0c] border border-[#ecb613]/20 rounded-3xl p-8 flex flex-col items-center justify-center animate-pulse">
        <GraduationCap className="w-12 h-12 text-[#ecb613] mb-4 opacity-50" />
        <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">Cargando Campus LMS S-Class...</span>
      </div>
    )
  }
);

const AstraNeuralTwinPanel = dynamic(
  () => import('@/modules/SClassScreens/panels/AstraNeuralTwinPanel'),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 bg-[#0a0a0c] border border-[#ecb613]/20 rounded-3xl p-8 flex flex-col items-center justify-center animate-pulse">
        <Sparkles className="w-10 h-10 text-[#ecb613] mb-4 opacity-50" />
        <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">Sincronizando Astra OS: Neural Strategic Engine...</span>
      </div>
    )
  }
);

export default function PublicAcademyPage() {
  const tools = [
    { name: "Rider Técnico Standard v2.md", cat: "Producción", size: "2.4 KB", docId: "rider" },
    { name: "Contrato de Actuación B2G / B2B.txt", cat: "Legal", size: "1.8 KB", docId: "contrato" },
    { name: "Split Sheet & Royalties Protocol.csv", cat: "Finanzas", size: "850 B", docId: "split" },
    { name: "Checklist Pre-Show & Sonorización Bose F1.md", cat: "Técnica", size: "3.2 KB", docId: "checklist" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ecb613] selection:text-black">
      
      {/* HERO SECTION AURA ONYX */}
      <section className="relative pt-24 pb-16 px-4 md:px-12 border-b border-white/10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#ecb613]/10 blur-[140px] pointer-events-none rounded-full" />
        
        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 border border-[#ecb613]/30 px-4 py-1.5 rounded-full bg-[#ecb613]/5 text-[#ecb613] text-xs font-mono tracking-widest uppercase">
            <Trophy className="w-3.5 h-3.5" /> EAR ACADEMY :: TALENT CAMPUS S-CLASS
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Estandarización y Formación <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#ecb613]">
              Para la Élite Artística
            </span>
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Formación técnica en riders homologados, protocolos de contratación estatal (B2G), microfonía Shure y mesas digitales Behringer XR18. Obtén la insignia verificada en el catálogo oficial de Productora EAR.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a 
              href="#campus-lms"
              className="bg-[#ecb613] text-black font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-[#d4a210] transition-all shadow-lg flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Entrar al Campus
            </a>
            <Link 
              href="/contacto"
              className="border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center gap-2"
            >
              Reclamar Perfil Artístico <ArrowRight className="w-4 h-4 text-[#ecb613]" />
            </Link>
          </div>
        </div>
      </section>

      {/* LMS INTERFACE CONTAINER */}
      <main id="campus-lms" className="max-w-7xl mx-auto px-4 md:px-12 py-16 space-y-16">
        
        {/* LMS Module */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Módulo 01</span>
              <h2 className="text-2xl font-black mt-1">Simulador de Aprendizaje y Misiones Tácticas</h2>
            </div>
          </div>

          <Suspense fallback={
            <div className="h-96 bg-[#0a0a0c] border border-[#ecb613]/20 rounded-3xl p-8 flex items-center justify-center animate-pulse">
              <span className="text-slate-400 font-mono text-xs">Cargando Academia S-Class...</span>
            </div>
          }>
            <AcademyPanel />
          </Suspense>
        </div>

        {/* RECURSOS Y DESCARGABLES */}
        <div className="border border-white/10 bg-[#0a0a0c] rounded-3xl p-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-extrabold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#ecb613]" /> Arsenal de Recursos y Plantillas Homologadas
              </h3>
              <p className="text-slate-400 text-xs mt-1">Herramientas indispensables para giras, directos y contratos municipales.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-4 hover:border-[#ecb613]/30 transition-colors">
                <div>
                  <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-wider">{tool.cat}</span>
                  <p className="font-bold text-sm mt-1 line-clamp-2 text-white">{tool.name}</p>
                  <span className="text-slate-500 text-[11px] mt-1 block">{tool.size}</span>
                </div>
                <a 
                  href={`/api/academy/download?doc=${tool.docId}`}
                  download
                  className="flex items-center justify-center gap-2 w-full py-2 bg-white/10 hover:bg-[#ecb613] hover:text-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer no-underline"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* DIGITAL TWIN / ASTRA NEURAL STRATEGIC ENGINE */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Tutoría Digital IA</span>
            <h2 className="text-2xl font-black mt-1">Astra OS: Neural Strategic Engine</h2>
            <p className="text-slate-400 text-xs mt-1">Asesoría conversacional basada en la Bóveda RAG de Productora EAR para resolución de dudas operativas.</p>
          </div>

          <Suspense fallback={
            <div className="h-80 bg-[#0a0a0c] border border-[#ecb613]/20 rounded-3xl p-8 flex items-center justify-center animate-pulse">
              <span className="text-slate-400 font-mono text-xs">Cargando Astra AI...</span>
            </div>
          }>
            <AstraNeuralTwinPanel />
          </Suspense>
        </div>

      </main>

    </div>
  );
}
