"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Cpu, Zap, BarChart3, Database } from 'lucide-react';

/**
 * ⚡ IMPACT SYSTEMS - MOTOR DE VISUALIZACIÓN DE INFRAESTRUCTURA (V144.2)
 * Arquitectura S-Class para la demostración de activos de Edwin Agudelo.
 */
export default function ImpactSystems() {
  const systems = [
    { id: '01', title: 'Aura Analytics', icon: BarChart3, desc: 'Motor de predicción de impacto emocional en eventos masivos.' },
    { id: '02', title: 'Neural Logistics', icon: Database, desc: 'Optimización soberana de flujos técnicos y personal elite.' },
    { id: '03', title: 'Kinetic Sound', icon: Zap, desc: 'Sistemas de audio inmersivo bajo el estándar Axis Audio.' },
    { id: '04', title: 'DDoS Shield', icon: Shield, desc: 'Protección contra interrupciones en infraestructuras digitales.' },
    { id: '05', title: 'Precision Targeting', icon: Target, desc: 'Estrategias de conversión de público en leads cualificados.' },
    { id: '06', title: 'Core Process', icon: Cpu, desc: 'Integración total de sistemas de control en tiempo real.' },
  ];

  return (
    <section className="relative py-32 bg-black overflow-hidden" id="impact-systems">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4a855]/40 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#d4a85508,transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[#d4a855] text-[10px] font-black uppercase tracking-[0.6em] mb-6 block"
            >
              Infraestructura Invisible
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none"
            >
              Sistemas de <br /> <span className="text-white/20 italic">Impacto Soberano</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            className="text-lg font-medium max-w-sm"
          >
            Nuestros activos no son meras herramientas; son extensiones de la visión artística de Edwin Agudelo.
          </motion.p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {systems.map((sys, idx) => (
            <motion.div 
              key={sys.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ backgroundColor: 'rgba(212, 168, 85, 0.05)' }}
              className="group relative p-12 border border-white/5 bg-white/2 transition-all duration-500 hover:border-[#d4a855]/30 overflow-hidden"
            >
              {/* Line 59: Closing the div properly as requested */}
              <div className="absolute top-0 left-0 w-1 h-0 bg-[#d4a855] group-hover:h-full transition-all duration-700" />
              
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:text-[#d4a855] transition-colors">
                  <sys.icon size={24} />
                </div>
                <span className="text-white/10 font-black text-4xl group-hover:text-[#d4a855]/20 transition-colors">
                  {sys.id}
                </span>
              </div>

              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">
                {sys.title}
              </h3>
              <p className="text-white/40 text-sm font-medium leading-relaxed group-hover:text-white/60 transition-colors">
                {sys.desc}
              </p>

              <div className="mt-8 flex items-center gap-4 text-[#d4a855] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <span className="text-[10px] font-black uppercase tracking-widest">Activar Protocolo</span>
                <div className="w-8 h-[1px] bg-[#d4a855]" />
              </div>

              {/* Decorative light leak */}
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#d4a855]/5 blur-[60px] rounded-full group-hover:bg-[#d4a855]/10 transition-colors" />
            </motion.div>
          ))}
        </div>

        {/* Technical Specs Footer */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-wrap gap-12 justify-between items-center text-[8px] font-black uppercase tracking-[0.4em] text-white/20">
          <div className="flex gap-8">
            <div className="flex flex-col gap-1">
              <span>Soberanía Operativa</span>
              <span className="text-white/60">Certificado EAR GOLD</span>
            </div>
            <div className="flex flex-col gap-1">
              <span>Hardware Shield</span>
              <span className="text-white/60">Military Grade 4211</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Sistema en Tiempo Real: Latencia &lt; 2ms</span>
          </div>
        </div>
      </div>

      {/* Line 141: Closing the section properly as requested */}
    </section>
  );
}