"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Brain, FolderLock, FileText, ChevronRight, Sparkles, Database, ShieldCheck } from "lucide-react";

const STRATEGY_ASSETS = [
  {
    id: "mark-d1",
    title: "Mark - Estrategia IA (Día 1)",
    type: "Transcripción",
    category: "Incubadora",
    insight: "El primer día se definió la arquitectura neuronal del ecosistema EAR.",
    details: "H:/RESCATE_FINAL/PROYECTOS_CODE/1er dia de mark...",
    relevance: 98
  },
  {
    id: "mark-d2",
    title: "Mark - Estrategia IA (Día 2)",
    type: "Transcripción",
    category: "Incubadora",
    insight: "Integración de herramientas de conversión masiva (High Ticket).",
    details: "H:/RESCATE_FINAL/PROYECTOS_CODE/2do dia de mark...",
    relevance: 95
  },
  {
    id: "nexus-c1",
    title: "Aprendizaje Nexus - Clase 1",
    type: "Masterclass",
    category: "Estratégico",
    insight: "El mapa que nadie te dio para dominar el mercado de eventos.",
    details: "H:/RESCATE_FINAL/PROYECTOS_CODE/Clase 1 El mapa...",
    relevance: 92
  }
];

export default function BovedaInteligente() {
  const [search, setSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState("Esperando consulta...");

  const filteredAssets = STRATEGY_ASSETS.filter(asset => 
    asset.title.toLowerCase().includes(search.toLowerCase()) || 
    asset.insight.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssetSelect = (asset: any) => {
    setSelectedAsset(asset);
    setAiAnalysis(`Analizando [${asset.title}]... Recuperando insights críticos de Mark sobre ${asset.category}.`);
  };

  return (
    <div className="min-h-screen bg-[#221d10] text-white p-6 font-sans">
      {/* Header Forensic */}
      <div className="max-w-7xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold gold-text tracking-tighter uppercase mb-2">
            Bóveda de Inteligencia EAR
          </h1>
          <p className="text-gray-400 flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary" />
            Acceso Forense a la Estrategia de IA | Nivel S-Class
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs text-primary/50 font-mono tracking-widest uppercase">Estatus del Ecosistema</p>
          <p className="text-xl font-bold text-white">INTEGRADO [OK]</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: AI Insights */}
        <div className="lg:col-span-1 space-y-6">
          <div className="hud-card p-6 bg-black/40 border-primary/20">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Brain size={24} />
              <h2 className="font-bold text-lg">Asistente 'Mark'</h2>
            </div>
            <div className="bg-primary/5 border border-primary/10 rounded p-4 text-sm text-gray-300 leading-relaxed italic">
              "{aiAnalysis}"
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-2 bg-primary text-black font-bold py-2 rounded transition-transform active:scale-95">
              <Sparkles size={16} /> Aplicar Estrategia
            </button>
          </div>

          <div className="hud-card p-6 border-white/5 bg-white/5">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">Métricas de Relevancia</h3>
            <div className="space-y-4">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{asset.title}</span>
                    <span className="text-primary">{asset.relevance}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${asset.relevance}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Central: Assets & Search */}
        <div className="lg:col-span-3 space-y-8">
          {/* Main Search (Bodas.net Style refined) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/10 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative hud-card p-2 flex items-center gap-4 bg-black/60 border-white/10">
              <div className="pl-4 text-gray-500">
                <Search size={22} />
              </div>
              <input 
                type="text"
                placeholder="Encuentra tu estrategia (ej: 'IA', 'Mark', 'Conversión')..."
                className="w-full bg-transparent border-none outline-none py-4 text-lg text-white placeholder:text-gray-600 font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="pr-4 hidden md:flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">⌘</kbd>
                <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">K</kbd>
              </div>
            </div>
          </div>

          {/* Result Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredAssets.map((asset) => (
                <motion.div
                  key={asset.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => handleAssetSelect(asset)}
                  className={`hud-card group cursor-pointer border-white/10 hover:border-primary/50 ${selectedAsset?.id === asset.id ? 'ring-2 ring-primary/30' : ''}`}
                >
                  <div className="aspect-video relative overflow-hidden rounded-t bg-gray-900 flex items-center justify-center">
                    <Database className="absolute top-4 right-4 text-white/10" size={48} />
                    <FolderLock className="text-primary/20 group-hover:text-primary/40 transition-colors" size={64} />
                    <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
                      <span className="text-[10px] uppercase tracking-widest bg-primary text-black px-2 py-0.5 font-bold rounded">
                        {asset.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{asset.title}</h3>
                      <ChevronRight size={18} className="text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2 italic mb-4">
                      "{asset.insight}"
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-gray-500 uppercase font-mono">
                      <span className="flex items-center gap-1"><FileText size={10} /> Local: {asset.category}</span>
                      <span className="text-primary/40">ID: {asset.id}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Forensic Footer Overlay */}
      <div className="fixed bottom-0 left-0 w-full p-2 bg-black/80 backdrop-blur-md border-t border-white/5 z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-mono tracking-widest text-gray-500 uppercase">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span> SYSTEM: ONLINE</span>
            <span>MEMORY: H://I://BAK</span>
          </div>
          <div className="pointer-events-auto">
            EAR OS © 2026 | ANTIGRAVITY FORENSIC ARCHITECTURE
          </div>
        </div>
      </div>
    </div>
  );
}
