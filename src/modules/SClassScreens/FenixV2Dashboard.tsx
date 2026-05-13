'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { SovereignSkeleton } from './components/SovereignSkeleton';

/**
 * EAR OS GOLD - FENIX v2.0 | THE OBSIDIAN STAGE
 * Master Dashboard - S-Class Engineering
 */

const OmnibusVertical = dynamic(() => import('./panels/OmnibusVertical'), {
  loading: () => <SovereignSkeleton />,
  ssr: false
});

const VimumeVertical = dynamic(() => import('./panels/VimumeVertical'), {
  loading: () => <SovereignSkeleton />,
  ssr: false
});

const SidebarItem = ({ icon, label, active, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
  <motion.button
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center gap-4 w-full px-6 py-4 transition-all relative ${active ? 'text-[#d4a855]' : 'text-white/40 hover:text-white'}`}
  >
    <span className="material-symbols-outlined text-xl">{icon}</span>
    <span className="font-bold uppercase text-[0.65rem] tracking-[0.2em]">{label}</span>
    {active && (
      <motion.div 
        layoutId="active-pill" 
        className="absolute left-0 w-1 h-8 bg-[#d4a855] rounded-r-full shadow-[0_0_15px_rgba(212,168,85,0.5)]" 
      />
    )}
  </motion.button>
);

export default function FenixV2Dashboard() {
  const [activeTab, setActiveTab] = useState('Command');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden selection:bg-[#d4a855]/30">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 flex flex-col py-8 bg-[#050505] backdrop-blur-xl z-20 shrink-0">
        <div className="px-8 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#d4a855] to-[#aa8644] rounded-lg rotate-45 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#050505] text-sm -rotate-45 font-black">bolt</span>
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tighter">EAR <span className="text-[#d4a855]">OS</span></h2>
              <p className="text-[7px] uppercase tracking-[0.4em] text-white/20 font-bold">Gold Edition v2.0</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem icon="terminal" label="Command" active={activeTab === 'Command'} onClick={() => setActiveTab('Command')} />
          <SidebarItem icon="hub" label="Omnibus" active={activeTab === 'Omnibus'} onClick={() => setActiveTab('Omnibus')} />
          <SidebarItem icon="psychology" label="Vimume" active={activeTab === 'Vimume'} onClick={() => setActiveTab('Vimume')} />
          <SidebarItem icon="analytics" label="Intelligence" />
          <SidebarItem icon="military_tech" label="Elite Tier" />
          <div className="my-8 border-t border-white/5 mx-6" />
          <SidebarItem icon="settings" label="Settings" />
          <SidebarItem icon="database" label="Logs" />
        </nav>
        
        <div className="px-8 mt-auto">
          <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[8px] font-black uppercase text-[#d4a855]/40">System Status</span>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
            </div>
            <p className="text-[10px] font-mono text-white/40 truncate">productoraear.com</p>
            <p className="text-[10px] font-mono text-[#d4a855] mt-1">Uptime: 99.9%</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-12 relative z-10 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              {activeTab} <span className="text-[#d4a855]">Center</span>
            </h1>
            <div className="h-4 w-[1px] bg-white/10" />
            <span className="text-[10px] font-mono text-white/20">
              {currentTime.toLocaleTimeString()} | ALPHA_NODE_01
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#d4a855]/50 transition-all">
              <span className="material-symbols-outlined text-sm text-[#d4a855]">notifications</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-[#d4a855] flex items-center justify-center font-black text-[#050505] text-xs shadow-[0_0_15px_rgba(212,168,85,0.3)]">
              CM
            </div>
          </div>
        </header>

        {/* Dynamic Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'Command' && (
              <motion.div 
                key="command"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 h-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5">
                      <p className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Revenue Velocity</p>
                      <h3 className="text-4xl font-black text-[#d4a855]">€84,200</h3>
                      <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#d4a855] w-[75%]" />
                      </div>
                   </div>
                   <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5">
                      <p className="text-[9px] uppercase tracking-widest text-white/40 mb-2">System Load</p>
                      <h3 className="text-4xl font-black text-white">12.4%</h3>
                      <p className="text-[9px] text-green-500 font-mono mt-2">OPTIMAL PERFORMANCE</p>
                   </div>
                   <div className="p-8 bg-gradient-to-br from-[#d4a855]/20 to-transparent rounded-[2rem] border border-[#d4a855]/20">
                      <p className="text-[9px] uppercase tracking-widest text-[#d4a855] mb-2">Astra Intelligence</p>
                      <h3 className="text-4xl font-black text-white">ACTIVE</h3>
                      <p className="text-[9px] text-white/40 mt-2">1,036 NEURAL NODES</p>
                   </div>
                </div>

                <div className="h-[600px]">
                   <Suspense fallback={<SovereignSkeleton />}>
                     <OmnibusVertical />
                   </Suspense>
                </div>
              </motion.div>
            )}

            {activeTab === 'Omnibus' && (
              <motion.div 
                key="omnibus"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-full"
              >
                <Suspense fallback={<SovereignSkeleton />}>
                   <OmnibusVertical />
                </Suspense>
              </motion.div>
            )}

            {activeTab === 'Vimume' && (
              <motion.div 
                key="vimume"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-full"
              >
                <Suspense fallback={<SovereignSkeleton />}>
                   <VimumeVertical />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* RIGHT PANEL: TELEMETRY QUICK VIEW */}
      <aside className="w-[380px] border-l border-white/5 bg-[#050505]/50 backdrop-blur-2xl p-10 hidden xl:flex flex-col gap-10 overflow-y-auto no-scrollbar shrink-0">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#d4a855] mb-6">Live Operations</h3>
          <div className="space-y-4">
            {[
              { label: 'RAG_INGEST', status: 'COMPLETE', color: 'text-green-500' },
              { label: 'PAYMENT_ENGINE', status: 'STABLE', color: 'text-green-500' },
              { label: 'VIMUME_SYNC', status: 'ACTIVE', color: 'text-[#d4a855]' },
            ].map(op => (
              <div key={op.label} className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-mono text-white/60">{op.label}</span>
                <span className={`text-[9px] font-black uppercase ${op.color}`}>{op.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto p-8 bg-[#d4a855] rounded-[2.5rem] text-[#050505] relative overflow-hidden group cursor-pointer" onClick={() => setActiveTab('Vimume')}>
          <div className="relative z-10">
            <h4 className="text-2xl font-black italic tracking-tighter leading-none mb-4">Misión Especial<br/>VIMUME Launch</h4>
            <button className="px-6 py-2 bg-[#050505] text-[#d4a855] rounded-full text-[10px] font-black uppercase tracking-widest group-hover:scale-105 transition-transform">
              DETALLES
            </button>
          </div>
          <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-9xl text-[#050505]/10 group-hover:rotate-12 transition-transform">rocket_launch</span>
        </div>
      </aside>
    </div>
  );
}
