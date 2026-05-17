"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Target, 
  Truck, 
  Activity, 
  Sparkles, 
  Shield, 
  Globe, 
  Boxes, 
  ChevronRight,
  Lock,
  BarChart3,
  Search,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export default function CommandCenterDashboard() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'Live' | 'History' | 'Config'>('Live');
  const trackEvent = api.trackEvent;

  useEffect(() => {
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
      desc: "Logística de transportes y gestión de flota VIP.",
      icon: Truck,
      path: "/admin/flota",
      color: "#d4a855",
      status: "ESTABLE"
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
    const implementedRoutes = [
      "/ayuntamientospremium", 
      "/admin/oraculo", 
      "/arsenal", 
      "/admin/flota", 
      "/admin/vimume", 
      "/admin/hunter"
    ];
    if (implementedRoutes.includes(path)) {
      router.push(path);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#d4a855]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      {/* HEADER TÁCTICO */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-[#d4a855] to-[#ffd471] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(212,168,85,0.3)] hover:rotate-3 transition-all duration-300">
            <Shield className="text-black w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none italic text-white">
              EAR <span className="text-[#d4a855]">CENTRO DE MANDO</span>
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-[9px] font-black text-[#d4a855] uppercase tracking-widest bg-[#d4a855]/10 px-2.5 py-1 rounded border border-[#d4a855]/20">
                <Activity size={10} className="animate-pulse" /> Sistema Operativo v5.0 GOLD
              </span>
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">
                Sovereign Control
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl px-6 py-3 flex flex-col items-end">
            <span className="text-[8px] text-white/40 uppercase font-black tracking-widest">Global Reach</span>
            <span className="text-xl font-black text-[#d4a855] flex items-center gap-2">
              <Globe size={16} /> 12 Nodos
            </span>
          </div>
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl px-6 py-3 flex flex-col items-end">
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
            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.03] hover:border-[#d4a855]/30 transition-all duration-300 group flex flex-col justify-between h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4a855]/5 blur-2xl rounded-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-[#d4a855]/10 group-hover:border-[#d4a855]/30 transition-colors">
                  <v.icon className="text-white group-hover:text-[#d4a855] transition-colors" size={22} />
                </div>
                <span className="text-[8px] font-black text-[#d4a855] border border-[#d4a855]/30 px-2 py-0.5 rounded uppercase">
                  {v.status}
                </span>
              </div>
              <div className="relative z-10 space-y-2">
                <h3 className="text-base font-black uppercase tracking-tight text-white mb-2 group-hover:text-[#d4a855] transition-colors">{v.name}</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-6 font-bold">{v.desc}</p>
                <div className="flex items-center text-[9px] font-black text-[#d4a855] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Ejecutar Protocolo <ChevronRight size={12} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PANEL DE CONTROL CENTRAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        <div className="lg:col-span-2 p-8 bg-white/[0.01] border border-white/5 rounded-[3rem] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4a855]/3 blur-[100px] rounded-full pointer-events-none" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3 italic">
              <Target className="text-[#d4a855]" size={20} /> Radar de Operaciones
            </h2>
            <div className="flex gap-2">
              {(['Live', 'History', 'Config'] as const).map(t => (
                <button 
                  key={t} 
                  onClick={() => setActiveTab(t)}
                  className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border transition-colors ${activeTab === t ? 'bg-[#d4a855] text-black border-[#d4a855]' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4 relative z-10">
            {activeTab === 'Live' && [1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-[#d4a855]/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-[#d4a855] rounded-full animate-pulse" />
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-tight">Sync_Nexus_v{i}.0</p>
                    <p className="text-[9px] text-white/30 uppercase font-black">Procesamiento de datos del catálogo local...</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-[#d4a855]">98.{i}%</p>
                  <p className="text-[8px] text-white/20 uppercase font-black">Success Rate</p>
                </div>
              </div>
            ))}
            
            {activeTab === 'History' && (
              <div className="p-8 text-center text-white/30 uppercase text-[9px] font-black tracking-widest border border-white/5 rounded-2xl bg-black/40">
                <CheckCircle2 className="mx-auto mb-3 text-white/10" size={24} />
                Historial cargado. Cero incidencias críticas reportadas.
              </div>
            )}

            {activeTab === 'Config' && (
              <div className="p-8 text-center text-[#d4a855] uppercase text-[9px] font-black tracking-widest border border-[#d4a855]/10 rounded-2xl bg-black/40">
                <AlertTriangle className="mx-auto mb-3 text-[#d4a855]/40" size={24} />
                Acceso de administrador restringido. Configuración S-Class bloqueada.
              </div>
            )}
          </div>
        </div>

        <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[3rem] flex flex-col justify-between h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none" />
          <div className="space-y-8 relative z-10">
            <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3 italic">
              <BarChart3 className="text-[#d4a855]" size={20} /> Métricas de Impacto
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[9px] font-black uppercase mb-2">
                  <span className="text-white/40">Conversión Territorial</span>
                  <span className="text-[#d4a855]">€1.2M</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#d4a855] to-[#ffd471]" style={{ width: '65%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[9px] font-black uppercase mb-2">
                  <span className="text-white/40">Eficiencia de Flota LERP</span>
                  <span className="text-[#d4a855]">94.2%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#d4a855] to-[#ffd471]" style={{ width: '94%' }} />
                </div>
              </div>
            </div>
          </div>

          <button className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-[9px] font-black uppercase tracking-widest hover:bg-[#d4a855] hover:text-black hover:border-[#d4a855] transition-all relative z-10 mt-8 shadow-lg">
            Descargar Reporte Omega
          </button>
        </div>
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
              <div className="p-8 bg-[#0a0a0a] border border-[#d4a855]/30 rounded-[3rem] text-center space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4a855]/5 blur-3xl rounded-full" />
                <div className="w-16 h-16 bg-[#d4a855]/10 rounded-full flex items-center justify-center mx-auto border border-[#d4a855]/30">
                  <Lock className="text-[#d4a855]" size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-white italic">Módulo Bloqueado</h3>
                  <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Estado: Próximamente</p>
                </div>
                <p className="text-white/60 text-xs leading-relaxed font-bold">
                  Esta vertical se encuentra actualmente en fase de calibración táctica. Estará disponible en el próximo despliegue.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-[#d4a855] text-black font-black py-4 rounded-xl shadow-[0_10px_30px_rgba(212,168,85,0.2)] text-[10px] uppercase tracking-widest hover:bg-white transition-colors"
                >
                  ENTENDIDO, COMANDANTE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
