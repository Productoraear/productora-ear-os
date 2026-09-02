import React from 'react';
import Link from 'next/link';
import { 
  HardDrive, 
  Activity, 
  Eye, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Award,
  Crown,
  Speaker,
  Image as ImageIcon
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspace de Proveedor | EAR OS',
  description: 'Panel de control y métricas para proveedores homologados de Productora EAR.'
};

export default function VendorDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Header con Badge de Estado */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-mono text-amber-300 font-bold uppercase mb-2">
            <Crown size={12} />
            <span>Proveedor Homologado · Nivel Free</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-syne text-white tracking-tight">
            Panel de Control de Proveedor
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Supervisa tu cuota multimedia, tu compatibilidad con el Algoritmo Húngaro y tus liquidaciones.
          </p>
        </div>

        <Link
          href="/proveedores/alberto-navarro"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold rounded-2xl transition-all self-start sm:self-auto"
        >
          <span>Ver Ficha Pública</span>
          <ArrowRight size={14} className="text-[#ecb613]" />
        </Link>
      </header>

      {/* Grid de 4 KPIs S-Class */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Cuota de Disco */}
        <div className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4 hover:border-[#ecb613]/50 transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-zinc-400 text-xs font-mono uppercase font-bold tracking-wider">Cuota de Almacenamiento</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#ecb613]">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-syne text-white tracking-tight">
              4.2 <span className="text-sm font-mono text-zinc-500">/ 15 MB</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 mt-3 overflow-hidden border border-white/5">
              <div className="bg-gradient-to-r from-amber-500 to-[#ecb613] h-full rounded-full" style={{ width: '28%' }} />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 mt-2 block">28% consumido · Tier Free</span>
          </div>
        </div>

        {/* KPI 2: Calidad de Perfil */}
        <div className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4 hover:border-emerald-500/50 transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-zinc-400 text-xs font-mono uppercase font-bold tracking-wider">Calidad de Perfil</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-syne text-white tracking-tight">
              65%
            </div>
            <p className="text-[11px] font-mono text-emerald-400 mt-3 font-bold flex items-center gap-1">
              <Sparkles size={12} />
              <span>+ Sube 3 fotos para el 100%</span>
            </p>
          </div>
        </div>

        {/* KPI 3: Impactos en Novios */}
        <div className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4 hover:border-blue-500/50 transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-zinc-400 text-xs font-mono uppercase font-bold tracking-wider">Impactos (30d)</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-syne text-white tracking-tight">
              1,429
            </div>
            <p className="text-[11px] font-mono text-blue-400 mt-3 font-light">
              Parejas explorando en Madrid
            </p>
          </div>
        </div>

        {/* KPI 4: Presupuestos & Conversiones */}
        <div className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4 hover:border-purple-500/50 transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-zinc-400 text-xs font-mono uppercase font-bold tracking-wider">Presupuestos</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-syne text-white tracking-tight">
              12
            </div>
            <p className="text-[11px] font-mono text-zinc-400 mt-3">
              3 pendientes con Price-Lock 72h
            </p>
          </div>
        </div>

      </div>

      {/* 🚀 Zona de Acción Táctica: Algoritmo Húngaro */}
      <div className="bg-gradient-to-br from-[#121218] via-[#09090d] to-black border border-[#ecb613]/30 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-[0_0_50px_rgba(236,182,19,0.08)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ecb613]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-zinc-300">
            <ShieldCheck size={12} className="text-[#ecb613]" />
            <span>Optimizador de Asignación Kuhn-Munkres</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-syne text-white uppercase italic tracking-tight">
            Eleva tu Compatibilidad de Rider al 100%
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
            El motor de emparejamiento de EAR OS prioriza en primer lugar a los proveedores con Rider Acústico calibrado (12 W/pax, Behringer XR18, microfonía Shure Axient Digital) y catálogo fotográfico optimizado.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              href="/vendor/media"
              className="px-6 py-3 bg-[#ecb613] hover:bg-amber-400 text-black font-mono text-xs font-black uppercase rounded-2xl transition-all shadow-lg shadow-amber-950/40 flex items-center gap-2"
            >
              <ImageIcon size={14} />
              <span>Gestionar Galería</span>
            </Link>

            <Link
              href="/vendor/rider"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase rounded-2xl transition-all flex items-center gap-2"
            >
              <Speaker size={14} className="text-[#ecb613]" />
              <span>Configurar Rider S-Class</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
