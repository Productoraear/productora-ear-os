'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Activity, Radio, Cpu, HardDrive, AlertTriangle } from 'lucide-react';
import PublicNavbar from '@/app/components/public/PublicNavbar';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function InfraestructuraSilo() {
  const [demandLevel, setDemandLevel] = useState(85);
  const [dynamicMargin, setDynamicMargin] = useState(25);

  // Simulación de Disponibilidad Zonal
  useEffect(() => {
    const interval = setInterval(() => {
      const newDemand = Math.floor(Math.random() * (99 - 80 + 1) + 80);
      setDemandLevel(newDemand);
      setDynamicMargin(newDemand > 90 ? 35 : 25);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <PublicNavbar />
      
      {/* HERO SECTION */}
      <section className="relative pt-48 pb-32 px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-900/20 to-transparent blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <Shield className="text-blue-500" size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">
                División Técnica • PRODUCTORAEAR
              </span>
            </div>
            
            <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter leading-none uppercase mb-8">
              Infraestructura <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white">
                Institucional
              </span>
            </h1>
            
            <p className="text-xl md:text-3xl font-light text-white/50 max-w-4xl mx-auto italic mb-12">
              "Proveedor de referencia en potencia sónica, iluminación profesional y logística de alta disponibilidad para Eventos Masivos y Sector Público."
            </p>

            {/* STATUS HUD */}
            <div className="inline-flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-blue-900/10 border border-blue-500/20 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full animate-pulse ${demandLevel > 90 ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Disponibilidad Zonal</span>
              </div>
              <div className="h-4 w-px bg-white/10 hidden md:block" />
              <div className="text-2xl font-black text-white">{demandLevel}%</div>
              <div className="h-4 w-px bg-white/10 hidden md:block" />
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Monitoreo de Red Activo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EQUIPAMIENTO TÉCNICO */}
      <section className="py-24 px-8 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Radio size={24} />,
                title: "FBT 118 SA",
                subtitle: "Subwoofers de Alta Gama",
                desc: "Presión sonora de estándar institucional. Cobertura acústica optimizada para grandes aforos y espacios abiertos."
              },
              {
                icon: <Cpu size={24} />,
                title: "Shure QLXD",
                subtitle: "Microfonía Digital",
                desc: "Transmisión encriptada de alta fidelidad. Estabilidad absoluta en entornos de alta saturación de señal."
              },
              {
                icon: <HardDrive size={24} />,
                title: "Redundancia Crítica",
                subtitle: "Arquitectura Fail-Safe",
                desc: "Sistemas de respaldo redundantes en cada fase. Garantizamos la continuidad del evento ante cualquier incidencia técnica."
              },
              {
                icon: <Zap size={24} />,
                title: "Iluminación Avanzada",
                subtitle: "Beam & Wash",
                desc: "Atmósferas volumétricas controladas digitalmente. Escenografía dinámica adaptada a protocolos institucionales."
              }
            ].map((tech, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 rounded-3xl border-white/5 hover:border-blue-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                  {tech.icon}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-1">{tech.title}</h3>
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4">{tech.subtitle}</p>
                <p className="text-xs text-white/40 font-bold uppercase leading-relaxed">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING ENGINE */}
      <section className="py-40 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel p-12 rounded-[3rem] border border-blue-500/20 bg-blue-900/5 relative overflow-hidden">
            {demandLevel > 90 && (
              <div className="absolute top-0 left-0 w-full p-2 bg-red-500 text-center flex items-center justify-center gap-2">
                <AlertTriangle size={14} className="text-black" />
                <span className="text-[9px] font-black uppercase tracking-widest text-black">AVISO: ALTA DEMANDA EN EL SECTOR ZONAL</span>
              </div>
            )}
            
            <div className={`mt-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${demandLevel > 90 ? 'pt-4' : ''}`}>
              <div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
                  Despliegue <br />
                  <span className="text-blue-500">Especializado</span>
                </h2>
                <p className="text-white/40 font-bold uppercase text-xs leading-relaxed mb-8">
                  Nuestra infraestructura técnica de alta disponibilidad está preparada para integrarse en su próximo proyecto institucional o evento corporativo de gran escala.
                </p>
                <Link href={ROUTES.contacto} className="inline-flex items-center justify-center px-10 py-5 bg-blue-500 text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-full hover:bg-white transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                  SOLICITAR PRESUPUESTO TÉCNICO
                </Link>
              </div>

              <div className="p-8 rounded-3xl bg-black/50 border border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Tarifa Base Orientativa</span>
                  <span className="text-lg font-black">2.500€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Ajuste de Disponibilidad (+{dynamicMargin}%)</span>
                  <span className="text-lg font-black text-blue-500">+{2500 * (dynamicMargin / 100)}€</span>
                </div>
                <div className="h-px bg-white/10 w-full" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest">Inversión Estimada</span>
                  <span className="text-3xl font-black text-white">{2500 + (2500 * (dynamicMargin / 100))}€</span>
                </div>
                <p className="text-[8px] text-white/30 uppercase tracking-widest text-center">Inversión ajustada según requerimientos técnicos y localización.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SHIELD */}
      <footer className="py-24 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col items-center justify-center p-8 bg-blue-500/5 border border-blue-500/20 rounded-2xl mb-16 text-center">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-blue-500" size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Garantía de Excelencia Técnica</span>
            </div>
            <p className="text-[10px] text-white/60 uppercase font-black tracking-widest max-w-2xl">
              Equipamiento técnico de alta especialización para proyectos institucionales y eventos de gran impacto.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
