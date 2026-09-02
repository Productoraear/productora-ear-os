'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Music, 
  Settings, X, Menu, Server, Activity, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

export default function NexusAdminPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row pt-16">
      
      <div className="md:hidden p-4 bg-[#0a0a0f] border-b border-white/10 flex justify-between items-center">
        <span className="font-mono text-xs text-[#ecb613] font-bold uppercase">Astra OS // Nexus</span>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="p-2 bg-white/5 border border-white/10 rounded-xl text-white"
        >
          <Menu size={20} />
        </button>
      </div>

      {isDrawerOpen && (
        <div 
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] md:hidden"
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-[120]
        w-72 bg-[#0a0a0f] border-r border-white/10 p-6
        flex flex-col justify-between transition-transform duration-300
        ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-8">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h2 className="font-fraunces font-black text-lg text-white">NEXUS ADMIN</h2>
              <span className="text-[10px] font-mono text-[#ecb613]">Panel de Control Unificado</span>
            </div>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="md:hidden p-1 bg-white/5 rounded-lg text-white/60 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-2">
            {[
              { label: 'Visión General', icon: LayoutDashboard, active: true },
              { label: 'Roster & Artistas', icon: Users, active: false },
              { label: 'Reservas & Cotizaciones', icon: Music, active: false },
              { label: 'Telemetría Servidores', icon: Server, active: false },
              { label: 'Ajustes del Sistema', icon: Settings, active: false },
            ].map((item, idx) => (
              <button
                key={idx}
                className={`w-full p-3 rounded-xl flex items-center gap-3 text-xs font-mono font-bold transition-all ${
                  item.active 
                    ? 'bg-[#ecb613]/10 border border-[#ecb613]/40 text-[#ecb613]' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
            <Activity size={14} />
            <span>Estado: Óptimo (Latency 12ms)</span>
          </div>
          <Link 
            href="/" 
            className="w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-mono text-white/70 flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Volver a la Web</span>
          </Link>
        </div>
      </aside>

      <main className="flex-grow p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-fraunces font-black text-white">Métricas de Rendimiento</h1>
            <p className="text-xs font-mono text-white/50">Soberanía Operativa &amp; Monitor de Nodos</p>
          </div>
          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono px-3 py-1 rounded-full uppercase">
            Sistema Activo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono text-white/40 uppercase">Solicitudes Activas</span>
            <div className="text-3xl font-fraunces font-black text-white">128</div>
            <span className="text-[10px] font-mono text-emerald-400 block">+14% respecto al mes anterior</span>
          </div>
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono text-white/40 uppercase">Nodos Indexados</span>
            <div className="text-3xl font-fraunces font-black text-[#ecb613]">22.932</div>
            <span className="text-[10px] font-mono text-[#ecb613] block">Sitemap Chunked Activo</span>
          </div>
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono text-white/40 uppercase">Garantía Escrow</span>
            <div className="text-3xl font-fraunces font-black text-white">100%</div>
            <span className="text-[10px] font-mono text-emerald-400 block">Cobro homologado B2G / FACe</span>
          </div>
        </div>
      </main>

    </div>
  );
}
