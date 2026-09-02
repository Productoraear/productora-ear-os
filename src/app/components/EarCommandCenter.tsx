"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Building2, 
  Zap, 
  Brain, 
  Shield, 
  Activity, 
  Target, 
  BarChart3,
  ChevronRight,
  Globe,
  Lock,
  Cpu,
  Boxes,
  Truck,
  HeartPulse,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./ui/glassCard";

// ============================================================================
// 🕹️ EAR COMMAND CENTER (S-CLASS HUB)
// ============================================================================

export default function EarCommandCenter() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const trackEvent = api.trackEvent;

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      trackEvent("COMMAND_CENTER_ACCESS", {
        timestamp: new Date().toISOString(),
        clearance: "S-CLASS"
      });
    }
  }, []);

  const verticals = [
    {
      id: "hunter",
      name: "Cazador Fantasma",
      desc: "Motor de scraping y lead gen autónomo.",
      icon: Target,
      path: "/admin/hunter",
      color: "#d4a855",
      status: "OPERATIVO"
    },
    {
      id: "omnibus",
      name: "Control de Flota",
      desc: "Logística imperial y gestión de flota VIP.",
      icon: Truck,
      path: "/admin/flota",
      color: "#d4a855",
      status: "STABLE"
    },
    {
      id: "vimume",
      name: "Reactor VIMUME",
      desc: "Monitor de impacto social y Aura Wallet.",
      icon: Activity,
      path: "/admin/vimume",
      color: "#3b82f6",
      status: "ACTIVE"
    },
    {
      id: "astra",
      name: "Oráculo Astra",
      desc: "Inteligencia predictiva y RAG avanzado.",
      icon: Sparkles,
      path: "/admin/oraculo",
      color: "#d4a855",
      status: "STABLE"
    }
  ];

  const handleNavigation = (path: string) => {
    // Rutas implementadas en Next.js
    const implementedRoutes = ["/ayuntamientospremium", "/admin/oraculo", "/arsenal", "/admin/flota", "/admin/vimume", "/admin/hunter"];
    if (implementedRoutes.includes(path)) {
      router.push(path);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#d4a855]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      {/* HEADER TÁCTICO */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-[#d4a855] to-[#ffd471] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(212,168,85,0.3)] group hover:rotate-3 transition-transform">
            <Shield className="text-black w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">
              EAR <span className="text-[#d4a855]">CENTRO DE MANDO</span>
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-[10px] font-black text-[#d4a855] uppercase tracking-widest bg-[#d4a855]/10 px-2 py-0.5 rounded border border-[#d4a855]/20">
                <Activity size={10} /> Sistema Operativo v5.0 GOLD
              </span>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
                Sovereign Control
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="glass-pane px-6 py-3 border-white/5 bg-white/[0.02] flex flex-col items-end">
            <span className="text-[8px] text-white/40 uppercase font-black tracking-widest">Global Reach</span>
            <span className="text-xl font-black text-[#d4a855] flex items-center gap-2">
              <Globe size={16} /> 12 Nodos
            </span>
          </div>
          <div className="glass-pane px-6 py-3 border-white/5 bg-white/[0.02] flex flex-col items-end">
            <span className="text-[8px] text-white/40 uppercase font-black tracking-widest">Active Threads</span>
            <span className="text-xl font-black text-white flex items-center gap-2">
              <Boxes size={16} /> 142
            </span>
          </div>
        </div>
      </header>

      {/* GRID DE VERTICALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
        {verticals.map((v) => (
          <motion.div
            key={v.id}
            whileHover={{ y: -5 }}
            onClick={() => handleNavigation(v.path)}
            className="cursor-pointer"
          >
            <GlassCard className="p-6 h-full border-white/5 hover:border-[#d4a855]/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-[#d4a855]/10 group-hover:border-[#d4a855]/30 transition-colors">
                  <v.icon className="text-white group-hover:text-[#d4a855] transition-colors" size={24} />
                </div>
                <span className="text-[8px] font-black text-[#d4a855] border border-[#d4a855]/30 px-2 py-0.5 rounded uppercase">
                  {v.status}
                </span>
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">{v.name}</h3>
              <p className="text-white/40 text-xs leading-relaxed mb-6">{v.desc}</p>
              <div className="flex items-center text-[10px] font-black text-[#d4a855] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Ejecutar Protocolo <ChevronRight size={12} />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* PANEL DE CONTROL CENTRAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        <GlassCard className="lg:col-span-2 p-8 border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Target className="text-[#d4a855]" /> Radar de Operaciones
            </h2>
            <div className="flex gap-2">
              {['Live', 'History', 'Config'].map(t => (
                <button key={t} className="text-[10px] font-black uppercase px-3 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-[#d4a855] rounded-full animate-pulse" />
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-tight">Sync_Nexus_v{i}.0</p>
                    <p className="text-[10px] text-white/30 uppercase font-bold">Inyectando datos de Bodas.net...</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-[#d4a855]">98.2%</p>
                  <p className="text-[8px] text-white/20 uppercase font-black">Success Rate</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 border-white/5 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 mb-8">
              <BarChart3 className="text-[#d4a855]" /> Métricas de Impacto
            </h2>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                  <span className="text-white/40">Presupuestos Capturados</span>
                  <span className="text-[#d4a855]">€1.2M</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#d4a855]" style={{ width: '65%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                  <span className="text-white/40">Conversión S-Class</span>
                  <span className="text-[#d4a855]">24.8%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#d4a855]" style={{ width: '82%' }} />
                </div>
              </div>
            </div>
          </div>

          <button className="w-full bg-white/5 border border-white/10 rounded-xl py-4 text-xs font-black uppercase tracking-widest hover:bg-[#d4a855] hover:text-black hover:border-[#d4a855] transition-all mt-8">
            Descargar Reporte Omega
          </button>
        </GlassCard>
      </div>

      {/* MODAL PRÓXIMAMENTE */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm"
            >
              <GlassCard className="p-8 border-[#d4a855]/30 text-center space-y-6">
                <div className="w-16 h-16 bg-[#d4a855]/10 rounded-full flex items-center justify-center mx-auto border border-[#d4a855]/30">
                  <Lock className="text-[#d4a855]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-white">Módulo Bloqueado</h3>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Estado: Próximamente</p>
                </div>
                <p className="text-white/60 text-sm">
                  Esta vertical se encuentra actualmente en fase de calibración táctica. Estará disponible en el próximo despliegue.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-[#d4a855] text-black font-black py-4 rounded-xl shadow-[0_10px_30px_rgba(212,168,85,0.2)]"
                >
                  ENTENDIDO, COMANDANTE
                </button>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
