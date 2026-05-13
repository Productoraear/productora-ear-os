"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  TrendingUp, 
  Brain, 
  Target, 
  Shield, 
  Cpu, 
  Globe, 
  Search, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Lock,
  Layers,
  Sparkles,
  ChevronRight,
  ArrowRight,
  CreditCard
} from "lucide-react";
import { GlassCard } from "@/components/ui/glassCard";
import { useRouter } from 'next/navigation';

const skills = [
  { id: 1, name: "Viralidad Predictiva", icon: TrendingUp, desc: "Algoritmos de propagación masiva y detección de tendencias antes del pico." },
  { id: 2, name: "Embudos de Conversión", icon: Layers, desc: "Arquitectura de ventas automatizada para infoproductos y servicios VIP." },
  { id: 3, name: "Psicología del Comprador", icon: Brain, desc: "Neuro-marketing aplicado al cierre de contratos de alto valor (High-Ticket)." },
  { id: 4, name: "Automatización de Leads", icon: Cpu, desc: "Motores de captura y nutrición de prospectos 24/7 sin intervención humana." },
  { id: 5, name: "Branding de Autoridad", icon: Shield, desc: "Posicionamiento de marca como líder indiscutible en el nicho S-Class." },
  { id: 6, name: "Copywriting Hipnótico", icon: MessageSquare, desc: "Escritura persuasiva diseñada para convertir extraños en clientes leales." },
  { id: 7, name: "SEO Técnico S-Class", icon: Globe, desc: "Dominio absoluto de buscadores para tráfico orgánico de alta intención." },
  { id: 8, name: "Growth Hacking", icon: Zap, desc: "Tácticas de crecimiento exponencial acelerado con mínima inversión." },
  { id: 9, name: "Data Analytics", icon: BarChart3, desc: "Telemetría avanzada para decisiones basadas en datos puros, no intuición." },
  { id: 10, name: "CRM Omnicanal", icon: Users, desc: "Gestión centralizada de relaciones y ciclo de vida del cliente corporativo." },
  { id: 11, name: "Paid Media Apex", icon: Target, desc: "Inversión publicitaria de alta precisión en Meta, Google y LinkedIn Ads." },
  { id: 12, name: "Content Strategy", icon: Sparkles, desc: "Fábrica de contenido de alto impacto para autoridad y retención." },
  { id: 13, name: "Influencer Outreach", icon: Search, desc: "Conexión estratégica con nodos de influencia para amplificación de marca." },
  { id: 14, name: "Optimización ROI", icon: Lock, desc: "Maximización de beneficios por cada token invertido en el ecosistema." }
];

export default function ArsenalPage() {
  const router = useRouter();
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  const handleActivate = (skill: any) => {
    setSelectedSkill(skill);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 relative overflow-hidden font-inter">
      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#d4a855]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#d4a855]/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-[2px] bg-[#d4a855]" />
                <span className="text-[#d4a855] text-[10px] font-black uppercase tracking-[0.5em]">Habilidades de Elite</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
                ARSENAL <span className="text-[#d4a855] not-italic">GOLD</span>
            </h1>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mt-4 max-w-xl">
                14 Módulos de Ejecución Táctica para la Dominación del Mercado. Inyectando estructura soberana en cada proceso de venta.
            </p>
          </div>
          
          <button 
            onClick={() => router.push('/precios')}
            className="px-8 py-4 bg-[#d4a855] text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(212,168,85,0.3)] flex items-center gap-3"
          >
            Adquirir Licencia Full <Zap size={14} />
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleActivate(skill)}
            >
              <GlassCard className="p-8 h-full border-white/5 hover:border-[#d4a855]/30 transition-all group cursor-pointer bg-white/[0.01] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-[#d4a855]/10 group-hover:border-[#d4a855]/30 transition-all">
                      <skill.icon size={28} className="text-white group-hover:text-[#d4a855] transition-colors" />
                    </div>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">MOD_{skill.id.toString().padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-3 group-hover:text-[#d4a855] transition-colors leading-tight">{skill.name}</h3>
                  <p className="text-white/40 text-[11px] font-medium uppercase tracking-widest leading-relaxed">{skill.desc}</p>
                </div>

                <div className="mt-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-[1px] bg-[#d4a855]" />
                    <span className="text-[9px] font-black text-[#d4a855] uppercase tracking-widest">Activar Protocolo</span>
                  </div>
                  <ChevronRight size={14} className="text-[#d4a855] group-hover:translate-x-1 transition-transform" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL DE ACTIVACIÓN (FUNCIONAL) */}
      <AnimatePresence>
        {selectedSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSkill(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <GlassCard className="p-10 border-[#d4a855]/30 bg-zinc-950 shadow-2xl">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-5 bg-[#d4a855]/10 rounded-3xl border border-[#d4a855]/30">
                    <selectedSkill.icon size={40} className="text-[#d4a855]" />
                  </div>
                  <button onClick={() => setSelectedSkill(null)} className="text-white/40 hover:text-white transition-colors">
                    <Lock size={20} />
                  </button>
                </div>
                
                <div className="space-y-4 mb-10">
                  <span className="text-[#d4a855] text-[10px] font-black uppercase tracking-[0.5em]">Activación de Módulo</span>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic">{selectedSkill.name}</h2>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Para activar la ejecución táctica de este módulo y recibir el blueprint de implementación, se requiere una <span className="text-white font-bold italic">Licencia S-Class activa</span>.
                  </p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => router.push('/precios')}
                    className="w-full bg-[#d4a855] text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-[0_10px_40px_rgba(212,168,85,0.2)]"
                  >
                    <CreditCard size={18} /> DESBLOQUEAR AHORA
                  </button>
                  <button 
                    onClick={() => setSelectedSkill(null)}
                    className="w-full bg-white/5 text-white/40 font-black py-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest"
                  >
                    CANCELAR OPERACIÓN
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
