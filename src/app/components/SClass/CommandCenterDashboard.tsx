"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  AlertTriangle,
  RefreshCw,
  Wallet,
  ShieldAlert,
  Fingerprint,
  BrainCircuit
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { 
  getWaybills, 
  getAuraWalletAndLedgers, 
  getSystemFinancials,
  WaybillData,
  WalletLedgerData
} from "@/app/actions/commandCenterActions";

import { lazy, Suspense } from "react";

// Import S-Class Subcomponents
const WaybillTimeline = lazy(() => import("./WaybillTimeline"));
const AuraWalletLedger = lazy(() => import("./AuraWalletLedger"));
const AstraOraclePanel = lazy(() => import("./AstraOraclePanel"));

export default function CommandCenterDashboard() {
  const router = useRouter();
  const { user, isAdmin, isPaid, loading: authLoading, signInWithGoogle } = useAuth();
  
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'Logistica' | 'Finanzas' | 'Astra'>('Logistica');
  
  // Real-time states
  const [waybills, setWaybills] = useState<WaybillData[]>([]);
  const [walletData, setWalletData] = useState<WalletLedgerData | null>(null);
  const [systemFinancials, setSystemFinancials] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const trackEvent = api.trackEvent;

  // Fetch all system and performer dashboard datasets
  const fetchData = useCallback(async () => {
    if (!user || !user.email) return;
    
    setLoading(true);
    setErrorMsg(null);
    try {
      // 1. Fetch fleet logs
      const waybillRecords = await getWaybills(user.email);
      setWaybills(waybillRecords);

      // 2. Fetch wallet splits ledger
      const walletRecords = await getAuraWalletAndLedgers(user.email);
      setWalletData(walletRecords);

      // 3. Fetch global financials if admin role is validated
      if (isAdmin) {
        const globalFinancials = await getSystemFinancials(user.email);
        setSystemFinancials(globalFinancials);
      }

      setLastSync(new Date());
    } catch (err: any) {
      console.error("🛑 [COMMAND_CENTER] Error syncing data:", err);
      setErrorMsg(err.message || "Fallo en sincronización de datos.");
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  // Initial fetch and 30-second secure polling
  useEffect(() => {
    if (user) {
      fetchData();
      
      // Auto-polling interval: 60 seconds (Fase 209: TBT Resiliency)
      const interval = setInterval(() => {
        console.log("🔄 [COMMAND_CENTER] Auto-polling live updates...");
        fetchData();
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [user, fetchData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      trackEvent("COMMAND_CENTER_ACCESS", {
        timestamp: new Date().toISOString(),
        clearance: isAdmin ? "COMMANDER_S_CLASS" : "ARTIST_VERIFIED"
      });
    }
  }, [isAdmin, trackEvent]);

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

  // 🛡️ ROLE GATING SCREEN
  const isAuthorized = isAdmin || isPaid;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-2 border-[#d4a855] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">
            Autenticando Firma S-Class...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 bg-white/[0.01] border border-red-500/20 rounded-[3rem] text-center space-y-6 shadow-2xl relative"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <ShieldAlert className="text-red-500" size={28} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">
              Acceso Restringido
            </h2>
            <p className="text-red-400/80 text-[9px] font-black uppercase tracking-widest">
              FIRMA CRÍPTICA NO RECONOCIDA
            </p>
          </div>

          <p className="text-white/60 text-xs leading-relaxed font-bold">
            Este Centro de Mando requiere credenciales de <span className="text-[#d4a855]">Administrador</span> o <span className="text-[#d4a855]">Artista Elite</span> verificado en la base de datos centralizada de Productora EAR.
          </p>

          {!user ? (
            <button
              onClick={signInWithGoogle}
              className="w-full bg-[#d4a855] text-black font-black py-4 rounded-xl shadow-[0_10px_30px_rgba(212,168,85,0.2)] text-[10px] uppercase tracking-widest hover:bg-white transition-colors"
            >
              Autenticarse con Google
            </button>
          ) : (
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
              <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mb-1">Usuario Activo</p>
              <p className="text-xs font-black text-white">{user.email}</p>
              <p className="text-[8px] text-red-400 uppercase font-black tracking-widest mt-2 border border-red-500/20 py-1 px-2.5 rounded bg-red-500/5">
                Rol: Explorador (Liquidación Inactiva)
              </p>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#d4a855]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      {/* HEADER TÁCTICO */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-[#d4a855] to-[#ffd471] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(212,168,85,0.3)] hover:rotate-3 transition-all duration-300">
            <Fingerprint className="text-black w-8 h-8" />
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

      {/* SECURE SUB-MONITOR / REAL-TIME WORKSPACE CONTROLS */}
      {errorMsg && (
        <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-wider rounded-2xl flex items-center gap-3 relative z-10">
          <AlertTriangle size={16} />
          {errorMsg}
        </div>
      )}

      {/* PANEL DE CONTROL CENTRAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        <div className="lg:col-span-2 p-8 bg-white/[0.01] border border-white/5 rounded-[3rem] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4a855]/3 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4 relative z-10">
            <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3 italic">
              {activeTab === 'Logistica' ? (
                <Truck className="text-[#d4a855]" size={20} />
              ) : activeTab === 'Finanzas' ? (
                <Wallet className="text-[#d4a855]" size={20} />
              ) : (
                <BrainCircuit className="text-[#d4a855]" size={20} />
              )} 
              Consola Operativa S-Class
            </h2>
            
            <div className="flex items-center gap-3">
              {lastSync && (
                <span className="text-[8px] text-white/30 font-black uppercase tracking-widest">
                  Sync: {lastSync.toLocaleTimeString("es-ES")}
                </span>
              )}
              
              <div className="flex bg-black/40 border border-white/5 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveTab('Logistica')}
                  className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'Logistica' ? 'bg-[#d4a855] text-black' : 'text-white/60 hover:text-white'}`}
                >
                  Logística
                </button>
                <button 
                  onClick={() => setActiveTab('Finanzas')}
                  className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'Finanzas' ? 'bg-[#d4a855] text-black' : 'text-white/60 hover:text-white'}`}
                >
                  Finanzas
                </button>
                {isAdmin && (
                  <button 
                    onClick={() => setActiveTab('Astra')}
                    className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg transition-all ${activeTab === 'Astra' ? 'bg-[#d4a855] text-black border border-[#d4a855]/30' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                  >
                    ASTRA Oráculo
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="relative z-10">
            <Suspense fallback={<div className="h-64 flex items-center justify-center text-[#d4a855] text-xs font-black uppercase tracking-widest animate-pulse border border-[#d4a855]/20 bg-white/5 rounded-2xl">Cargando Motor S-Class...</div>}>
              {activeTab === 'Logistica' ? (
                <WaybillTimeline 
                  waybills={waybills} 
                  loading={loading} 
                  onRefresh={fetchData} 
                />
              ) : activeTab === 'Finanzas' ? (
                <AuraWalletLedger 
                  walletData={walletData} 
                  systemFinancials={systemFinancials}
                  isAdmin={isAdmin}
                  loading={loading} 
                  onRefresh={fetchData} 
                />
              ) : (
                <AstraOraclePanel 
                  userEmail={user.email || ""} 
                  isAdmin={isAdmin} 
                />
              )}
            </Suspense>
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
