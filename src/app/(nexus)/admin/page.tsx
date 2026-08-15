'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, DollarSign, Radar, ShieldCheck, Truck, 
  Settings, LogOut, Sliders, Layers, Sparkles, RefreshCw
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import NexusRealCockpit from '@/components/admin/NexusRealCockpit';

// Paneles de Administración S-Class con carga diferida
const OmegaCockpitPanel = dynamic(() => import('@/modules/SClassScreens/panels/OmegaCockpitPanel'), { ssr: false });
const FinancialPanel = dynamic(() => import('@/modules/SClassScreens/panels/FinancialPanel'), { ssr: false });
const HunterPanel = dynamic(() => import('@/modules/SClassScreens/panels/HunterPanel'), { ssr: false });
const ConfiguradorBespoke = dynamic(() => import('@/modules/SClassScreens/ConfiguradorBespoke'), { ssr: false });
const TacticalTracker = dynamic(() => import('@/app/components/SClass/TacticalTracker').then(mod => mod.TacticalTracker), { ssr: false });
const RouteGovernancePanel = dynamic(() => import('@/app/(nexus)/admin/rutas/page'), { ssr: false });

type AdminTab = 'nexus' | 'financial' | 'hunter' | 'configurador' | 'estado' | 'rutas';

export default function UnifiedAdminCommandCenter() {
  const [activeTab, setActiveTab] = useState<AdminTab>('nexus');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      if (typeof document !== 'undefined') {
        document.cookie = 'ear_auth_signal=; path=/; max-age=0';
        document.cookie = 'ear_os_auth_token=; path=/; max-age=0';
        document.cookie = 'ear_os_role=; path=/; max-age=0';
      }
      router.push('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      router.push('/login');
    }
  };

  const tabs = [
    { id: 'nexus', label: 'Centro de Mando', icon: Activity },
    { id: 'financial', label: 'Ledger Financiero', icon: DollarSign },
    { id: 'hunter', label: 'Hunter Licitaciones', icon: Radar },
    { id: 'configurador', label: 'Configurador Bespoke', icon: Sliders },
    { id: 'estado', label: 'Estado & Dominancia', icon: Layers },
    { id: 'rutas', label: 'Gobernanza URLs', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 lg:p-8 font-sans space-y-8 selection:bg-[#ecb613] selection:text-black">
      
      {/* 👑 HEADER INTEGRAL UNIFICADO */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ecb613] animate-ping" />
            <span className="text-[#ecb613] text-[10px] font-mono tracking-widest uppercase border border-[#ecb613]/30 px-3 py-0.5 rounded-full bg-[#ecb613]/10">
              EAR OS // CENTRO DE MANDO SUPREMO UNIFICADO
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-syne">
            ADMINISTRACIÓN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-[#ffd700]">INTEGRAL</span>
          </h1>
          <p className="text-white/50 text-xs sm:text-sm mt-1 font-light">
            Soberanía operativa total: telemetría, ledger financiero, licitaciones B2G y visibilidad de rutas en una única interfaz.
          </p>
        </div>

        {/* BOTÓN DE LOGOUT Y SESIÓN */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-5 py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            {isLoggingOut ? <RefreshCw size={14} className="animate-spin" /> : <LogOut size={14} />}
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* 🧭 NAVEGACIÓN POR PESTAÑAS S-CLASS */}
      <nav className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-5 py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                isActive
                  ? 'bg-[#ecb613] text-black shadow-[0_0_25px_rgba(236,182,19,0.35)] scale-105'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 📱 CONTENEDOR UNIFICADO DINÁMICO */}
      <main className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {activeTab === 'nexus' && (
            <motion.div
              key="nexus"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <NexusRealCockpit />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                  <OmegaCockpitPanel />
                  <HunterPanel />
                </div>
                <div className="lg:col-span-4">
                  <FinancialPanel />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'financial' && (
            <motion.div
              key="financial"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <FinancialPanel />
            </motion.div>
          )}

          {activeTab === 'hunter' && (
            <motion.div
              key="hunter"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <HunterPanel />
            </motion.div>
          )}

          {activeTab === 'configurador' && (
            <motion.div
              key="configurador"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <ConfiguradorBespoke />
            </motion.div>
          )}

          {activeTab === 'estado' && (
            <motion.div
              key="estado"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto"
            >
              <TacticalTracker />
            </motion.div>
          )}

          {activeTab === 'rutas' && (
            <motion.div
              key="rutas"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <RouteGovernancePanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
