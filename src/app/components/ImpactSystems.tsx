/**
 * ⚡ IMPACT SYSTEMS - SPATIAL BENTO GRID (S-CLASS)
 * Purpose: High-impact visualization of Edwin Agudelo's proprietary infrastructure.
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Cpu, Zap, BarChart3, Database, Globe, Hexagon } from 'lucide-react';

export default function ImpactSystems() {
  const systems = [
    { 
      id: '01', 
      title: 'Aura Analytics', 
      icon: BarChart3, 
      desc: 'Motor de predicción de impacto emocional en eventos masivos.',
      colSpan: 'md:col-span-2',
      bg: 'bg-[#ecb613]/5'
    },
    { 
      id: '02', 
      title: 'Neural Logistics', 
      icon: Database, 
      desc: 'Optimización soberana de flujos técnicos.',
      colSpan: 'md:col-span-1',
      bg: 'bg-white/5'
    },
    { 
      id: '03', 
      title: 'Kinetic Sound', 
      icon: Zap, 
      desc: 'Sistemas de audio inmersivo Axis Audio.',
      colSpan: 'md:col-span-1',
      bg: 'bg-white/5'
    },
    { 
      id: '04', 
      title: 'DDoS Shield', 
      icon: Shield, 
      desc: 'Protección contra interrupciones digitales.',
      colSpan: 'md:col-span-1',
      bg: 'bg-[#10b981]/5'
    },
    { 
      id: '05', 
      title: 'Global Delivery', 
      icon: Globe, 
      desc: 'Despliegue atómico en cualquier territorio nacional.',
      colSpan: 'md:col-span-1',
      bg: 'bg-white/5'
    },
  ];

  return (
    <section className="relative py-64 bg-black overflow-hidden" id="impact-systems">
      {/* 🔮 SPATIAL DECOR */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#ecb61305,transparent_50%)]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-12 h-[1px] bg-[#ecb613]" />
              <span className="text-[#ecb613] text-[11px] font-black uppercase tracking-[0.6em]">Infraestructura Invisible</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] uppercase italic"
            >
              Sistemas de <br /> 
              <span className="text-white/10 not-italic">Impacto Soberano</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.3 }}
            viewport={{ once: true }}
            className="text-xl font-bold uppercase tracking-[0.2em] max-w-sm text-right leading-loose"
          >
            Nuestros activos no son herramientas; son la garantía de inevitabilidad en cada ejecución.
          </motion.p>
        </div>

        {/* 🍱 BENTO SPATIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {systems.map((sys, idx) => (
            <motion.div 
              key={sys.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative p-12 rounded-[2.5rem] border border-white/5 ${sys.bg} hover:border-[#ecb613]/40 transition-all duration-700 overflow-hidden ${sys.colSpan}`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white group-hover:text-[#ecb613] group-hover:bg-[#ecb613]/10 transition-all duration-500">
                    <sys.icon size={32} strokeWidth={1.5} />
                  </div>
                  <span className="text-white/5 font-black text-6xl group-hover:text-[#ecb613]/10 transition-colors duration-700">
                    {sys.id}
                  </span>
                </div>

                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">
                  {sys.title}
                </h3>
                <p className="text-white/30 text-base font-bold uppercase tracking-widest leading-relaxed group-hover:text-white/60 transition-colors duration-500">
                  {sys.desc}
                </p>

                <div className="mt-12 flex items-center gap-4 text-[#ecb613] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocolo Activo</span>
                  <Hexagon size={12} className="animate-spin-slow" />
                </div>
              </div>

              {/* Interactive Hover Decor */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ecb613]/0 via-transparent to-[#ecb613]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
          ))}
        </div>

        {/* 📉 TECHNICAL TELEMETRY FOOTER */}
        <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex gap-16">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Soberanía Operativa</span>
              <span className="text-white font-black text-xs uppercase tracking-widest">Certificado EAR GOLD • V164.1</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Resiliencia</span>
              <span className="text-white font-black text-xs uppercase tracking-widest">Military Grade Infrastructure</span>
            </div>
          </div>
          <div className="flex items-center gap-6 px-8 py-4 bg-white/5 rounded-full border border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_15px_#10b981]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Sistemas en Tiempo Real: Latencia &lt; 2ms</span>
          </div>
        </div>
      </div>
    </section>
  );
}