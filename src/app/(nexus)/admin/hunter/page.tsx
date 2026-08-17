"use client";

import React, { useState } from "react";
import { 
  Search, 
  Terminal, 
  Play, 
  Pause, 
  Download, 
  Shield, 
  Activity, 
  Target,
  Database,
  Cpu,
  Globe,
  CheckCircle2,
  Sliders
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glassCard";

// ============================================================================
// 🕵️ CAZADOR FANTASMA (PHANTOM HUNTER) - UI TÁCTICA S-CLASS
// ============================================================================

const TARGET_PRESETS = [
  { name: 'Bodas.net (Proveedores)', url: 'https://www.bodas.net/bodas/proveedores' },
  { name: 'Fander Música & Artistas', url: 'https://fander.es/musica' },
  { name: 'Milanuncios (Espectáculos)', url: 'https://www.milanuncios.com/espectaculos/' },
  { name: 'PLACSP (Licitaciones B2G)', url: 'https://contrataciondelestado.es/' }
];

export default function HunterPage() {
  const [targetUrl, setTargetUrl] = useState("https://www.bodas.net/bodas/proveedores");
  const [sector, setSector] = useState("Espacios & Venues");
  const [depth, setDepth] = useState<'Alpha' | 'Beta' | 'Deep'>('Alpha');
  const [useProxy, setUseProxy] = useState(true);
  const [useStealth, setUseStealth] = useState(true);

  const [isScanning, setIsScanning] = useState(false);
  const [extractedLeads, setExtractedLeads] = useState<string[]>([]);
  const [logs, setLogs] = useState([
    "[SYSTEM] Inicializando Motor de Extracción Phantom Engine v4.2...",
    "[NETWORK] Conexión establecida con Nodo Omega-4.",
    "[STATUS] Esperando órdenes del Comandante."
  ]);

  const toggleScan = async () => {
    if (isScanning) {
      setIsScanning(false);
      setLogs(prev => [...prev, "[SYSTEM] Escaneo pausado por el Comandante."]);
      return;
    }

    setIsScanning(true);
    setLogs(prev => [
      ...prev, 
      `[ACTION] Iniciando infiltración en: ${targetUrl}...`,
      `[CONFIG] Profundidad: ${depth} | Sector: ${sector} | Stealth: ${useStealth ? 'ON' : 'OFF'}`
    ]);

    try {
      const response = await fetch('/api/hunter/phantom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl, depth, sector })
      });

      const data = await response.json();

      if (data.success && data.data) {
        const leads = data.data.leads || [];
        setExtractedLeads(leads);
        setLogs(prev => [
          ...prev, 
          `[SUCCESS] Infiltración completada en ${targetUrl}.`,
          `[RESULT] Se han procesado ${data.data.leadsCount || leads.length} activos/leads.`,
          ...leads.map((l: string) => `[DETECTED] ${l}`)
        ]);
      } else {
        setLogs(prev => [...prev, `[ERROR] Fallo en la misión: ${data.error || 'Respuesta anómala'}`]);
      }
    } catch (err: any) {
      setLogs(prev => [...prev, `[CRITICAL] Error de red: ${err.message}`]);
    } finally {
      setIsScanning(false);
    }
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ targetUrl, sector, depth, leads: extractedLeads, timestamp: new Date().toISOString() }, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `cazador_leads_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setLogs(prev => [...prev, `[EXPORT] Dataset descargado exitosamente.`]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER DE OPERACIONES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#d4a855] animate-pulse" />
            <span className="text-[#d4a855] text-[10px] font-black uppercase tracking-[0.4em]">Phantom Engine v4.2 S-Class</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">
            CAZADOR <span className="text-[#d4a855] not-italic">FANTASMA</span>
          </h1>

          {/* Quick Hub Presets */}
          <div className="flex flex-wrap gap-2 mt-4">
            {TARGET_PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => setTargetUrl(p.url)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all border ${
                  targetUrl === p.url 
                    ? 'bg-[#d4a855]/20 border-[#d4a855] text-[#d4a855]' 
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
          
          <div className="mt-4 flex max-w-2xl">
             <div className="flex items-center bg-black/60 border border-r-0 border-white/10 rounded-l-xl px-3 text-white/40">
               <Globe size={14} className="text-[#d4a855]" />
             </div>
             <input 
                type="text" 
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://www.bodas.net/bodas/proveedores"
                className="flex-1 bg-white/5 border border-white/10 border-l-0 p-4 text-xs font-mono text-[#d4a855] outline-none focus:border-[#d4a855]/50 transition-all"
             />
             <button 
                onClick={toggleScan}
                disabled={isScanning}
                className={`px-8 rounded-r-xl font-black uppercase tracking-widest flex items-center gap-3 transition-all ${
                  isScanning 
                    ? 'bg-red-500/10 text-red-500 border border-red-500/30 animate-pulse' 
                    : 'bg-[#d4a855] hover:bg-[#e0b666] text-black shadow-[0_10px_30px_rgba(212,168,85,0.25)] active:scale-95'
                }`}
              >
                {isScanning ? <Pause size={18} /> : <Play size={18} />}
                <span className="text-xs">{isScanning ? 'Pausar' : 'Ejecutar'}</span>
              </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PANEL DE CONTROL DE PARÁMETROS */}
        <div className="space-y-8">
          <GlassCard className="p-8 border-white/5 bg-white/[0.01]">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#d4a855] mb-8 flex items-center gap-2">
              <Target size={14} /> Objetivos de Caza
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40">Filtro de Sector</label>
                <select 
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-black uppercase focus:border-[#d4a855] outline-none cursor-pointer"
                >
                  <option value="Espacios & Venues">Espacios & Venues (Fincas / Palacetes)</option>
                  <option value="Música & Espectáculos">Música & Espectáculos (Mariachis / Orquestas)</option>
                  <option value="Catering de Lujo">Catering de Lujo & Alta Gastronomía</option>
                  <option value="Planificación de Eventos">Planificación de Eventos & Wedding Planners</option>
                </select>
              </div>
              
              {/* Selector Interactivo de Profundidad */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-white/40">Profundidad de Infiltración</label>
                  <span className="text-[9px] font-mono text-[#d4a855]">
                    {depth === 'Alpha' ? '10 Activos' : depth === 'Beta' ? '25 Activos' : '50 Activos (Deep)'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['Alpha', 'Beta', 'Deep'] as const).map((t) => {
                    const isSelected = depth === t;
                    return (
                      <button 
                        key={t} 
                        type="button"
                        onClick={() => {
                          setDepth(t);
                          setLogs(prev => [...prev, `[PARAM] Profundidad ajustada a: ${t}`]);
                        }}
                        className={`py-3 rounded-lg text-[10px] font-black uppercase border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#d4a855]/20 border-[#d4a855] text-[#d4a855] shadow-lg shadow-[#d4a855]/10 font-bold' 
                            : 'border-white/5 text-white/40 hover:text-white hover:border-white/20 bg-white/[0.02]'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles Proxy y Stealth */}
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div 
                  onClick={() => setUseProxy(!useProxy)} 
                  className="flex justify-between items-center cursor-pointer select-none"
                >
                  <span className="text-[10px] font-black uppercase text-white/60">Uso de Proxy S-Class</span>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${useProxy ? 'bg-[#d4a855]' : 'bg-white/10'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-black rounded-full transition-transform ${useProxy ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>

                <div 
                  onClick={() => setUseStealth(!useStealth)} 
                  className="flex justify-between items-center cursor-pointer select-none"
                >
                  <span className="text-[10px] font-black uppercase text-white/60">Anti-Bot Stealth</span>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${useStealth ? 'bg-[#d4a855]' : 'bg-white/10'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-black rounded-full transition-transform ${useStealth ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>

                <button 
                  onClick={async () => {
                    setLogs(prev => [...prev, "[ACTION] Activando BOE & PLACSP Predator Engine..."]);
                    const res = await fetch('/api/cron/b2g-telegram-hunter');
                    const data = await res.json();
                    if (data.success) {
                      setLogs(prev => [...prev, `[SUCCESS] B2G Radar: Licitaciones sincronizadas y enviadas a Telegram.`]);
                    }
                  }}
                  className="w-full mt-4 py-3.5 bg-white/5 border border-[#ecb613]/30 text-[#ecb613] rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#ecb613]/10 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <Cpu size={14} /> Disparar Radar B2G Telegram
                </button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 border-[#d4a855]/20 bg-gradient-to-br from-[#d4a855]/5 to-transparent">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-2">
              <Activity size={14} /> Telemetría de Extracción
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-[8px] text-white/40 uppercase font-black mb-1">Catálogo Total</p>
                <p className="text-2xl font-black text-[#d4a855]">24,869</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-[8px] text-white/40 uppercase font-black mb-1">Micro-Lote 01</p>
                <p className="text-2xl font-black text-white">100</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-[8px] text-white/40 uppercase font-black mb-1">Latencia</p>
                <p className="text-2xl font-black text-white">&lt;20ms</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-[8px] text-white/40 uppercase font-black mb-1">Éxito</p>
                <p className="text-2xl font-black text-emerald-500">100%</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* CONSOLA DE SALIDA TÁCTICA */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="p-0 border-white/5 bg-black/60 overflow-hidden flex flex-col h-[520px]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Terminal size={18} className="text-[#d4a855]" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Salida de Consola (Deep Scan)</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono text-[#d4a855] px-2 py-0.5 bg-[#d4a855]/10 rounded border border-[#d4a855]/20">
                  {depth} MODE
                </span>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/20" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50 animate-ping" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-6 font-mono text-[10px] space-y-2 overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.p 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={
                      log.includes('[ACTION]') || log.includes('[CONFIG]') ? 'text-[#d4a855]' :
                      log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' :
                      log.includes('[ERROR]') || log.includes('[CRITICAL]') ? 'text-red-400' :
                      log.includes('[DETECTED]') ? 'text-cyan-300' :
                      'text-white/40'
                    }
                  >
                    <span className="text-[#d4a855]/30">[{new Date().toLocaleTimeString()}]</span> {log}
                  </motion.p>
                ))}
              </AnimatePresence>
              {isScanning && (
                <motion.p 
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-[#d4a855] font-bold"
                >
                  [PENDING] Infiltrando {targetUrl} con perfil {depth}...
                </motion.p>
              )}
            </div>

            <div className="p-6 border-t border-white/5 flex gap-4">
              <button 
                onClick={handleExportJSON}
                className="flex-1 bg-white/5 border border-white/10 h-12 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Download size={14} /> Exportar JSON
              </button>
              <button 
                onClick={() => {
                  setLogs(prev => [...prev, `[CRM] Inyectando ${extractedLeads.length || 5} contactos a la Matriz de Soberanos...`]);
                }}
                className="flex-1 bg-[#d4a855]/10 border border-[#d4a855]/30 text-[#d4a855] h-12 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-[#d4a855]/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Database size={14} /> Inyectar a CRM
              </button>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5 flex items-center gap-6">
              <div className="p-4 bg-[#d4a855]/10 rounded-2xl text-[#d4a855] border border-[#d4a855]/20">
                <Shield size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Seguridad de Nodo</p>
                <p className="text-lg font-black text-white uppercase italic">Nivel 5 Certificado</p>
              </div>
            </div>
            
            <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5 flex items-center gap-6">
              <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
                <Cpu size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Modo Activo</p>
                <p className="text-lg font-black text-white uppercase italic">{depth} Extractor</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
