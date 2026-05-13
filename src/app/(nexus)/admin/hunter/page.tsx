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
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glassCard";

// ============================================================================
// 🕵️ CAZADOR FANTASMA (PHANTOM HUNTER) - UI TÁCTICA
// ============================================================================

export default function HunterPage() {
  const [targetUrl, setTargetUrl] = useState("https://www.bodas.net/vuestras-bodas");
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState([
    "[SYSTEM] Inicializando Motor de Extracción...",
    "[NETWORK] Conexión establecida con Nodo Omega-4.",
    "[STATUS] Esperando órdenes del Comandante."
  ]);

  const toggleScan = async () => {
    if (isScanning) {
      setIsScanning(false);
      setLogs(prev => [...prev, "[SYSTEM] Escaneo pausado por el usuario."]);
      return;
    }

    setIsScanning(true);
    setLogs(prev => [...prev, `[ACTION] Iniciando infiltración en: ${targetUrl}...`]);

    try {
      const response = await fetch('/api/hunter/phantom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl })
      });

      const data = await response.json();

      if (data.success) {
        setLogs(prev => [
          ...prev, 
          `[SUCCESS] Infiltración completada.`,
          `[RESULT] Se han extraído ${data.data.leadsCount} leads únicos.`,
          ...data.data.leads.map((email: string) => `[LEAD] ${email}`)
        ]);
      } else {
        setLogs(prev => [...prev, `[ERROR] Fallo en la misión: ${data.error}`]);
      }
    } catch (err: any) {
      setLogs(prev => [...prev, `[CRITICAL] Error de red: ${err.message}`]);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER DE OPERACIONES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#d4a855] animate-pulse" />
            <span className="text-[#d4a855] text-[10px] font-black uppercase tracking-[0.4em]">Phantom Engine v4.1</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">
            CAZADOR <span className="text-[#d4a855] not-italic">FANTASMA</span>
          </h1>
          <div className="mt-6 flex max-w-xl">
             <input 
                type="text" 
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="URL Objetivo (ej. bodas.net)"
                className="flex-1 bg-white/5 border border-white/10 rounded-l-xl p-4 text-xs font-mono text-[#d4a855] outline-none focus:border-[#d4a855]/50"
             />
             <button 
                onClick={toggleScan}
                disabled={isScanning}
                className={`px-8 rounded-r-xl font-black uppercase tracking-widest flex items-center gap-3 transition-all ${
                  isScanning 
                    ? 'bg-red-500/10 text-red-500 border border-red-500/30' 
                    : 'bg-[#d4a855] text-black shadow-[0_10px_30px_rgba(212,168,85,0.25)]'
                }`}
              >
                {isScanning ? <Pause size={18} /> : <Play size={18} />}
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
                <select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-black uppercase focus:border-[#d4a855] outline-none appearance-none">
                  <option>Espacios & Venues</option>
                  <option>Catering de Lujo</option>
                  <option>Planificación de Eventos</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40">Profundidad de Infiltración</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Alpha', 'Beta', 'Deep'].map(t => (
                    <button key={t} className={`py-3 rounded-lg text-[10px] font-black uppercase border transition-all ${t === 'Deep' ? 'bg-[#d4a855]/10 border-[#d4a855] text-[#d4a855]' : 'border-white/5 text-white/20'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase text-white/40">Uso de Proxy S-Class</span>
                  <div className="w-8 h-4 bg-[#d4a855] rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-black rounded-full" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-white/40">Anti-Bot Stealth</span>
                  <div className="w-8 h-4 bg-[#d4a855] rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-black rounded-full" />
                  </div>
                </div>

                <button 
                  onClick={async () => {
                    setLogs(prev => [...prev, "[ACTION] Activando BOE Predator Engine..."]);
                    const res = await fetch('/api/admin/boe/scan', { method: 'POST' });
                    const data = await res.json();
                    if (data.status === 'success') {
                      setLogs(prev => [...prev, `[SUCCESS] BOE Scan: ${data.matches} licitaciones inyectadas en NUCLEO_DATA.`]);
                    }
                  }}
                  className="w-full mt-6 py-4 bg-white/5 border border-[#ecb613]/30 text-[#ecb613] rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#ecb613]/10 transition-all flex items-center justify-center gap-3"
                >
                  <Cpu size={14} /> Ejecutar BOE Predator
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
                <p className="text-[8px] text-white/40 uppercase font-black mb-1">Prospectos</p>
                <p className="text-2xl font-black text-[#d4a855]">1,402</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-[8px] text-white/40 uppercase font-black mb-1">Emails</p>
                <p className="text-2xl font-black text-white">892</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-[8px] text-white/40 uppercase font-black mb-1">Latencia</p>
                <p className="text-2xl font-black text-white">12ms</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-[8px] text-white/40 uppercase font-black mb-1">Éxito</p>
                <p className="text-2xl font-black text-emerald-500">98%</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* CONSOLA DE SALIDA TÁCTICA */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="p-0 border-white/5 bg-black/60 overflow-hidden flex flex-col h-[500px]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Terminal size={18} className="text-[#d4a855]" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Salida de Consola (Deep Scan)</h3>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/20" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
            </div>
            
            <div className="flex-1 p-6 font-mono text-[10px] space-y-2 overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.p 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={log.includes('[ACTION]') ? 'text-[#d4a855]' : 'text-white/40'}
                  >
                    <span className="text-[#d4a855]/30">[{new Date().toLocaleTimeString()}]</span> {log}
                  </motion.p>
                ))}
              </AnimatePresence>
              {isScanning && (
                <motion.p 
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="text-[#d4a855]"
                >
                  [PENDING] Escaneando sub-dominios y metadatos de contacto...
                </motion.p>
              )}
            </div>

            <div className="p-6 border-t border-white/5 flex gap-4">
              <button className="flex-1 bg-white/5 border border-white/10 h-12 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Download size={14} /> Exportar JSON
              </button>
              <button className="flex-1 bg-white/5 border border-white/10 h-12 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Database size={14} /> Inyectar a CRM
              </button>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5 flex items-center gap-6">
              <div className="p-4 bg-gold/10 rounded-2xl text-[#d4a855] border border-[#d4a855]/20">
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
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Carga de CPU</p>
                <p className="text-lg font-black text-white uppercase italic">12% Operativo</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
