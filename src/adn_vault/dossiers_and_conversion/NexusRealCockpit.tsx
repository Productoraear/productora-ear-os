'use client';

import React, { useEffect, useState } from 'react';
import { 
  Database, 
  Users, 
  Truck, 
  Euro, 
  Heart, 
  Activity, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

interface TelemetryData {
  totalVendors: number;
  claimedVendors: number;
  unclaimedVendors: number;
  fleetCount: number;
  totalRevenue: number;
  transactionsCount: number;
  distribution: {
    artistPayouts: number;
    earShare: number;
    vimumeFund: number;
  };
  systemStatus: string;
  timestamp: string;
}

export function NexusRealCockpit() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTelemetry = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/telemetry');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('❌ [COCKPIT ERROR] Fallo cargando telemetría:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 30000); // Polling cada 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0a0a0c] border border-white/10 rounded-3xl p-8 animate-pulse text-center">
        <Activity className="w-8 h-8 text-[#ecb613] mx-auto mb-4 animate-spin" />
        <span className="text-xs text-slate-400 font-mono uppercase tracking-widest">
          Sincronizando Telemetría Real con PostgreSQL & Bóveda...
        </span>
      </div>
    );
  }

  const vendors = data?.totalVendors || 0;
  const claimed = data?.claimedVendors || 0;
  const revenue = data?.totalRevenue || 0;
  const vimume = data?.distribution?.vimumeFund || 0;
  const fleet = data?.fleetCount || 0;

  return (
    <div className="bg-[#0a0a0c] border border-[#ecb613]/30 rounded-3xl p-6 md:p-8 text-white space-y-8 shadow-[0_0_50px_rgba(236,182,19,0.08)] relative overflow-hidden">
      
      {/* GLOW DECORATIVO */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#ecb613]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER COCKPIT */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest">
              Telemetría Operativa 100% Funcional · Cero Cifras Vanidosas
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
            ESTADO REAL DEL ECOSISTEMA
          </h2>
        </div>

        <button
          onClick={fetchTelemetry}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-xs font-mono text-slate-300 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Actualizar Telemetría</span>
        </button>
      </div>

      {/* MÉTRICAS CLAVE REALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        
        {/* 1. Proveedores en Directorio */}
        <div className="bg-black/60 border border-white/5 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase">Materia Oscura Ingestada</span>
            <Database className="w-4 h-4 text-[#ecb613]" />
          </div>
          <p className="text-3xl font-black text-white">{vendors}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-bold">{claimed} Reclamados</span> · {Math.max(0, vendors - claimed)} Sombra
          </div>
        </div>

        {/* 2. Facturación Real (Stripe / Ledger) */}
        <div className="bg-black/60 border border-white/5 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase">Volumen Procesado (Ledger)</span>
            <Euro className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white">{revenue.toLocaleString('es-ES')} €</p>
          <div className="text-[11px] text-slate-400">
            {data?.transactionsCount || 0} Transacciones Conciliadas
          </div>
        </div>

        {/* 3. Bóveda VIMUME Social (10%) */}
        <div className="bg-black/60 border border-white/5 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase">Fondo VIMUME (10%)</span>
            <Heart className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-3xl font-black text-white">{vimume.toLocaleString('es-ES')} €</p>
          <div className="text-[11px] text-pink-400/80 font-mono">
            Destinado a Musicoterapia Senior
          </div>
        </div>

        {/* 4. Flota Física Homologada */}
        <div className="bg-black/60 border border-white/5 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-mono uppercase">Flota PA & Digital</span>
            <Truck className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white">{fleet} Unidades</p>
          <div className="text-[11px] text-blue-400/80 font-mono">
            Bose F1 · XR18 · Shure 87A
          </div>
        </div>

      </div>

      {/* ACCIONES TÁCTICAS OPERATIVAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/10 relative z-10">
        <Link 
          href="/blog/b2g"
          className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-between group transition-all"
        >
          <div>
            <span className="text-xs font-bold text-white block">Generador B2G Art. 118</span>
            <span className="text-[10px] text-slate-400">Dossier ODS 2030 con regla del 95%</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#ecb613] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>

        <Link 
          href="/academia"
          className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-between group transition-all"
        >
          <div>
            <span className="text-xs font-bold text-white block">Campus LMS para Artistas</span>
            <span className="text-[10px] text-slate-400">Certificación y Rider Audit IA</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#ecb613] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>

        <Link 
          href="/login?from=/admin/nexus"
          className="p-4 bg-[#ecb613]/10 hover:bg-[#ecb613]/20 border border-[#ecb613]/30 rounded-2xl flex items-center justify-between group transition-all"
        >
          <div>
            <span className="text-xs font-bold text-[#ecb613] block">Gateway de Identidad Soberana</span>
            <span className="text-[10px] text-slate-400">Gestión de Perfiles y Reclamaciones</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#ecb613] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
}

export default NexusRealCockpit;
