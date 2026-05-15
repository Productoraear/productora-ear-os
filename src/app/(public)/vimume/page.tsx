"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ShieldCheck, Activity, TrendingUp, Map, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * 🏛️ VIMUME OS — FINAL S-CLASS REFINEMENT (ULTRA-CLEAN / CONTEMPLATIVE)
 * Unified with the Global Design System tokens.
 */

export default function VimumeLandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const scale = useTransform(smoothProgress, [0, 0.2], [1, 0.98]);
  const opacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);

  const nodes = [
    { title: "Soberanía", label: "Manifiesto", desc: "El compromiso de Edwin Agudelo: Defender la identidad contra el olvido.", href: "/vimume/nosotros" },
    { title: "Métrica", label: "Ciencia", desc: "Protocolo de activación neuronal con precisión de grado operativo.", href: "/vimume/investigacion" },
    { title: "Capital", label: "Inversión", desc: "Desarrollo estratégico de activos emocionales para la Silver Economy.", href: "/vimume/inversion" },
    { title: "Misión", label: "Roadmap", desc: "Hoja de ruta 2026: Despliegue nacional de la infraestructura VIMUME.", href: "/vimume/roadmap" }
  ];

  return (
    <main ref={containerRef} className="bg-[#050505] min-h-screen text-[#f5f1e8] selection:bg-[#ecb613]/40 relative overflow-hidden font-sans">
      
      {/* 🌌 EAR OS AURA (SILENT LUMINOSITY) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#ecb613]/5 blur-[250px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#ecb613]/3 blur-[250px] rounded-full" />
      </div>

      {/* 🚀 ULTRA-CLEAN HERO */}
      <section className="h-screen flex flex-col items-center justify-center relative px-6 text-center">
        <motion.div style={{ scale, opacity }} className="space-y-24 relative z-10 max-w-6xl">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[#ecb613] text-[12px] font-black uppercase tracking-[1em] opacity-80"
          >
            EAR OS / VIMUME S-CLASS
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-8xl md:text-[12rem] font-black uppercase tracking-tighter leading-[0.75] text-white">
              <span className="text-white/20 block mb-[-0.05em]">RESCATAR</span>
              <span className="text-[#ecb613]">EL ALMA</span>
            </h1>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-3xl text-white/40 font-medium max-w-3xl mx-auto leading-tight italic"
          >
            Infraestructura táctica para la preservación de la identidad humana.
          </motion.p>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.8 }}
             className="pt-12"
          >
            <Link href="#explorer" className="btn-primary">
              Iniciar Protocolo
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 📋 NODOS DE AUTORIDAD (BENTO SILENT) */}
      <section id="explorer" className="max-w-7xl mx-auto px-6 py-48">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {nodes.map((node, i) => (
            <motion.div
              key={node.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <Link href={node.href}>
                <div className="surface-card p-12 h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
                      {node.label}
                    </div>
                    <h3 className="text-5xl font-black uppercase tracking-tighter group-hover:text-[#ecb613] transition-colors">
                      {node.title}
                    </h3>
                    <p className="text-xl text-white/30 font-medium leading-snug">
                      {node.desc}
                    </p>
                  </div>
                  <div className="pt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-[#ecb613] transition-all">
                    Explorar Nodo <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🏛️ FOOTER S-CLASS */}
      <footer className="border-t border-white/5 py-24 text-center px-6">
         <div className="space-y-8 opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[1em]">Productora EAR | S-Class Institutional OS</p>
            <p className="text-[10px] font-mono">© 2026 | ALL RIGHTS RESERVED | C001-AURA-ONYX</p>
         </div>
      </footer>
    </main>
  );
}
