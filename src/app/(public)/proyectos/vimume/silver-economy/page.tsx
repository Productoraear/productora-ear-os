"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  PieChart, 
  ArrowLeft, 
  Download,
  Building2,
  Target,
  FileText
} from 'lucide-react';
import Link from 'next/link';

/**
 * 🌻 VIMUME: SILVER ECONOMY NODE
 * Content extracted from VIMUME_MARKET_ANALYSIS_ES.md
 */
export default function SilverEconomyPage() {
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
            SILVER <br />
            <span className="text-[#ecb613]">ECONOMY</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto italic">
            "La longevidad como activo. Análisis del mercado senior español y el impacto económico de la intervención musical."
          </p>
        </div>
      </section>

      {/* 📊 DATA GRID */}
      <section className="px-6 py-32 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { label: "Población 65+", value: "20.7%", desc: "1 de cada 5 españoles ya pertenece a la generación Silver.", icon: Users },
            { label: "Índice Envejecimiento", value: "148%", desc: "148 mayores de 64 por cada 100 menores de 16.", icon: TrendingUp },
            { label: "TAM Estimado", value: "€45M", desc: "Mercado total anual en residencias y centros de día en España.", icon: PieChart },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-6"
            >
              <stat.icon size={32} className="text-[#ecb613]" />
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{stat.label}</p>
                <h3 className="text-5xl font-black tracking-tighter">{stat.value}</h3>
              </div>
              <p className="text-white/40 text-sm leading-relaxed italic">"{stat.desc}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 📖 DEEP CONTENT */}
      <section className="px-6 py-20 max-w-4xl mx-auto space-y-24">
        <article className="prose prose-invert prose-zinc max-w-none prose-h2:text-4xl prose-h2:font-black prose-h2:uppercase prose-h2:tracking-tighter prose-h2:italic prose-p:text-lg prose-p:text-white/60 prose-strong:text-[#ecb613]">
          <h2>1. Demografía y Proyecciones</h2>
          <p>
            España se enfrenta a un cambio demográfico sin precedentes. En 2026, la población total ha alcanzado su máximo histórico con más de <strong>49.5 millones de habitantes</strong>, de los cuales <strong>10.1 millones superan los 65 años</strong>.
          </p>
          <p>
            Las proyecciones del CSIC indican que para 2045, casi el 30% de la población pertenecerá a este segmento. Este escenario no es solo un reto asistencial, sino una oportunidad para la <strong>innovación social y económica</strong>.
          </p>

          <h2>2. El Problema: Soledad y Deterioro</h2>
          <p>
            El 25.4% de los mayores viven solos. El aislamiento social acelera la progresión del deterioro cognitivo en 2-3 años. VIMUME interviene en este punto crítico, transformando el gasto asistencial en <strong>inversión en bienestar medible</strong>.
          </p>
        </article>

        {/* 📋 SEGMENTATION TABLE */}
        <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 space-y-12">
          <div className="space-y-4">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-[#ecb613]">Segmentación de Mercado</h3>
            <p className="text-white/40 text-sm">Mapa de clientes institucionales y accesibilidad operativa.</p>
          </div>
          <div className="space-y-6">
            {[
              { type: "Residencias Privadas", accessibility: "Muy Alta", note: "Buscan diferenciación y valor añadido para las familias." },
              { type: "Centros de Día", accessibility: "Alta", note: "Flexibilidad para intervenciones recurrentes." },
              { type: "Programas Municipales", accessibility: "Media", note: "Vía licitación y convenios de envejecimiento activo." }
            ].map((row, i) => (
              <div key={i} className="flex flex-col md:flex-row justify-between gap-4 py-6 border-b border-white/5">
                <div className="space-y-1">
                  <p className="font-black text-sm uppercase tracking-tighter">{row.type}</p>
                  <p className="text-white/30 text-xs italic">{row.note}</p>
                </div>
                <span className="px-4 py-1 h-fit bg-[#ecb613]/10 text-[#ecb613] text-[8px] font-black uppercase tracking-widest border border-[#ecb613]/20 rounded-full">
                  {row.accessibility}
                </span>
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
              Inversión Institucional <br />
              <span className="text-[#ecb613]">y ROI Social</span>
            </h2>
            <p className="text-white/50 text-xl leading-relaxed italic">
              "VIMUME no es un coste; es una arquitectura de reducción de riesgos sociosanitarios. Descargue nuestro análisis completo sobre la economía del cuidado."
            </p>
            <button className="px-12 py-5 bg-[#ecb613] text-black rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_50px_rgba(236,182,19,0.3)]">
              <Download size={18} /> Descargar Informe Silver Economy
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">Continuar Navegación Cascada:</p>
            {[
              { title: "Alzheimer y Memoria", href: "/proyectos/vimume/alzheimer", icon: Target },
              { title: "Protocolo de Intervención", href: "/proyectos/vimume/protocolo", icon: Building2 },
              { title: "Casos de Estudio", href: "/blog/casos-clinicos", icon: FileText },
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
