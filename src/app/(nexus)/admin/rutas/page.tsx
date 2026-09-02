'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Lock, Unlock, Eye, EyeOff, Globe, 
  Settings, CheckCircle2, AlertCircle, RefreshCw, Sparkles, ExternalLink
} from 'lucide-react';
import initialGovernance from '@/data/governance/route_visibility.json';

interface RouteItem {
  path: string;
  name: string;
  category: string;
  isPublic: boolean;
  description: string;
}

export default function RouteGovernancePage() {
  const [routes, setRoutes] = useState<RouteItem[]>(initialGovernance.routes);
  const [filterCategory, setFilterCategory] = useState<string>('TODAS');
  const [savingPath, setSavingPath] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const categories = ['TODAS', 'PÚBLICO', 'VIMUME', 'ADMINISTRACIÓN'];

  const handleToggle = async (path: string, currentStatus: boolean) => {
    setSavingPath(path);
    const newStatus = !currentStatus;

    try {
      const res = await fetch('/api/admin/route-governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, isPublic: newStatus })
      });

      const data = await res.json();
      if (data.success) {
        setRoutes(prev => prev.map(r => r.path === path ? { ...r, isPublic: newStatus } : r));
        setFeedback(`✓ ${path} ahora es ${newStatus ? 'PÚBLICA' : 'EXCLUSIVA DE ADMINISTRADOR'}`);
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch (err) {
      console.error("Error cambiando visibilidad:", err);
    } finally {
      setSavingPath(null);
    }
  };

  const filteredRoutes = routes.filter(r => 
    filterCategory === 'TODAS' ? true : r.category === filterCategory
  );

  const publicCount = routes.filter(r => r.isPublic).length;
  const privateCount = routes.filter(r => !r.isPublic).length;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* HEADER S-CLASS */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-8 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono tracking-widest uppercase">
              <ShieldCheck size={13} />
              <span>SISTEMA DE GOBERNANZA & VISIBILIDAD DE RUTAS (RBAC EDGE)</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
              CONTROL DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-[#ffd700]">VISIBILIDAD URL</span>
            </h1>
            <p className="text-white/60 text-xs md:text-sm max-w-2xl font-light">
              Como Administrador Soberano, decide con 1 clic qué páginas son accesibles para el público general y cuáles quedan blindadas en exclusiva bajo tus credenciales de administración.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/10 rounded-2xl p-4">
            <div className="text-center px-3 border-r border-white/10">
              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider block">Públicas</span>
              <span className="text-2xl font-black text-white font-mono">{publicCount}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider block">Admin Only</span>
              <span className="text-2xl font-black text-[#ecb613] font-mono">{privateCount}</span>
            </div>
          </div>
        </header>

        {/* FEEDBACK TOAST */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono font-bold flex items-center gap-3 shadow-xl"
          >
            <Sparkles size={16} />
            <span>{feedback}</span>
          </motion.div>
        )}

        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all uppercase tracking-wider ${
                filterCategory === cat
                  ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.3)]'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* RUTAS TABLE / CARD GRID */}
        <div className="grid grid-cols-1 gap-4">
          {filteredRoutes.map((route) => {
            const isSaving = savingPath === route.path;

            return (
              <motion.div
                key={route.path}
                layout
                className={`p-6 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  route.isPublic 
                    ? 'bg-[#0a0a0a] border-white/10 hover:border-emerald-500/30' 
                    : 'bg-gradient-to-r from-[#0d0d0f] to-[#080808] border-[#ecb613]/30 hover:border-[#ecb613]/60'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-bold text-white select-all">
                      {route.path}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                      route.isPublic
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}>
                      {route.isPublic ? 'PÚBLICA (VISITANTES)' : 'PRIVADA (SOLO ADMIN)'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white font-syne">{route.name}</h3>
                  <p className="text-xs text-white/50 font-light">{route.description}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <button
                    onClick={() => handleToggle(route.path, route.isPublic)}
                    disabled={isSaving}
                    className={`px-5 py-3 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-lg min-w-[190px] justify-center ${
                      route.isPublic
                        ? 'bg-white/10 hover:bg-amber-500/20 text-white border border-white/10 hover:border-amber-500/40 hover:text-amber-400'
                        : 'bg-[#ecb613] hover:bg-[#ffd700] text-black shadow-[0_0_25px_rgba(236,182,19,0.3)]'
                    }`}
                  >
                    {isSaving ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : route.isPublic ? (
                      <>
                        <EyeOff size={14} className="text-amber-400" />
                        <span>Hacer Privada (Admin)</span>
                      </>
                    ) : (
                      <>
                        <Eye size={14} />
                        <span>Abrir al Público</span>
                      </>
                    )}
                  </button>

                  <a
                    href={route.path}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all"
                    title="Previsualizar Ruta"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
