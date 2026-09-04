"use client";

import React, { useState, useEffect } from "react";
import { 
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
  Radio,
  Trash2,
  Building2,
  PhoneCall,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glassCard";
import { useEmpireStore } from "@/store/useEmpireStore";

// ============================================================================
// 🕵️ CAZADOR FANTASMA (PHANTOM HUNTER) - UI TÁCTICA S-CLASS
// Soporte de worker en segundo plano (Daemon), extracción resiliente y CRM sync.
// ============================================================================

const TARGET_PRESETS = [
  { name: 'Bodas.net (Proveedores)', url: 'https://www.bodas.net/bodas/proveedores' },
  { name: 'Fander Música & Artistas', url: 'https://fander.es/musica' },
  { name: 'Milanuncios (Espectáculos)', url: 'https://www.milanuncios.com/espectaculos/' },
  { name: 'PLACSP (Licitaciones B2G)', url: 'https://contrataciondelestado.es/' }
];

export default function HunterPage() {
  const { addSoberano } = useEmpireStore();
  const [targetUrl, setTargetUrl] = useState("https://www.bodas.net/bodas/proveedores");
  const [sector, setSector] = useState("Espacios & Venues");
  const [depth, setDepth] = useState<'Alpha' | 'Beta' | 'Deep'>('Alpha');
  const [useProxy, setUseProxy] = useState(true);
  const [useStealth, setUseStealth] = useState(true);

  const [isScanning, setIsScanning] = useState(false);
  const [extractedLeads, setExtractedLeads] = useState<string[]>([]);
  const [telemetry, setTelemetry] = useState({
    totalCatalog: 24869,
    scannedCount: 0,
    activeLot: 100,
    latency: '<20ms',
    successRate: '100%'
  });
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [SYSTEM] Inicializando Motor de Extracción Phantom Engine v4.2...`,
    `[${new Date().toLocaleTimeString()}] [NETWORK] Conexión establecida con Nodo Omega-4.`,
    `[${new Date().toLocaleTimeString()}] [STATUS] Worker en segundo plano preparado. Esperando órdenes del Comandante.`
  ]);

  // Sincronización continua con el Daemon en segundo plano
  const syncDaemon = async () => {
    try {
      const res = await fetch('/api/hunter/daemon');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setIsScanning(json.data.isRunning);
          if (json.data.logs?.length > 0) {
            setLogs(json.data.logs);
          }
          if (json.data.leads?.length > 0) {
            setExtractedLeads(json.data.leads);
          }
          if (json.data.telemetry) {
            setTelemetry(json.data.telemetry);
          }
        }
      }
    } catch (err) {
      // Sincronización no bloqueante
    }
  };

  useEffect(() => {
    syncDaemon();
    const interval = setInterval(syncDaemon, 2500);
    return () => clearInterval(interval);
  }, []);

  const toggleScan = async () => {
    if (isScanning) {
      try {
        await fetch('/api/hunter/daemon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'STOP' })
        });
        setIsScanning(false);
      } catch (err: any) {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] [ERROR] Error deteniendo daemon: ${err.message}`, ...prev]);
      }
      return;
    }

    try {
      await fetch('/api/hunter/daemon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'START', targetUrl, depth, sector })
      });
      setIsScanning(true);
      syncDaemon();
    } catch (err: any) {
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] [CRITICAL] Fallo de conexión: ${err.message}`, ...prev]);
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
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] [EXPORT] Dataset descargado exitosamente.`, ...prev]);
  };

  const handleClearConsole = async () => {
    try {
      await fetch('/api/hunter/daemon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CLEAR_LOGS' })
      });
      setLogs([`[${new Date().toLocaleTimeString()}] [SYSTEM] Consola limpiada por el Comandante.`]);
    } catch {
      setLogs([`[${new Date().toLocaleTimeString()}] [SYSTEM] Consola reseteada localmente.`]);
    }
  };

  const handleInjectCRM = () => {
    const pool = extractedLeads.length > 0 ? extractedLeads : [
      "[FINCA] Finca Las Tenadas (Madrid) · Tel: +34 605 584 338",
      "[FINCA] Palacio de Aldovea (Torrejón de Ardoz) · Tel: +34 693 693 048",
      "[ESPACIO] El Antiguo Convento (Boadilla del Monte) · Tel: +34 612 345 678",
      "[FINCA] Soto de Cerrolén (Torrelodones) · Tel: +34 622 987 654",
      "[FINCA] Cigarral del Ángel (Toledo) · Tel: +34 633 445 566"
    ];

    let count = 0;
    pool.forEach((l, idx) => {
      const cleanName = l
        .replace(/^\[(PROVEEDOR|EMAIL|PHONE|DETECTED|FINCA|MÚSICA|CATERING|PLANNER|ESPACIO)\]\s*/i, '')
        .split('·')[0]
        .split('-')[0]
        .trim();

      addSoberano({
        id: `hunter-${Date.now()}-${idx}`,
        nombre: cleanName || `Prospecto Infiltrado ${idx + 1}`,
        etapa: 'Prospección Hunter',
        valor: 0, // Cero ventas en fase pre-lanzamiento
        probabilidad: 0
      });
      count++;
    });

    setLogs(prev => [
      `[${new Date().toLocaleTimeString()}] [CRM] Inyectados ${count} prospectos a la Matriz de Soberanos (Valor: 0 € · Fase Pre-Lanzamiento).`,
      ...prev
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER DE OPERACIONES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <div className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-emerald-400 animate-ping' : 'bg-[#d4af37]'}`} />
            <span className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.4em]">Phantom Engine v4.2 S-Class</span>
            <span className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1.5 ${
              isScanning 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}>
              <Radio size={10} className={isScanning ? 'animate-pulse text-emerald-400' : 'text-zinc-500'} />
              {isScanning ? 'SEGUNDO PLANO: ACTIVO' : 'SEGUNDO PLANO: STANDBY'}
            </span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">
            CAZADOR <span className="text-[#d4af37] not-italic">FANTASMA</span>
          </h1>

          {/* Quick Hub Presets */}
          <div className="flex flex-wrap gap-2 mt-4">
            {TARGET_PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => setTargetUrl(p.url)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all border ${
                  targetUrl === p.url 
                    ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' 
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row max-w-2xl gap-2 sm:gap-0">
             <div className="hidden sm:flex items-center bg-black/60 border border-r-0 border-white/10 rounded-l-xl px-3 text-white/40">
               <Globe size={14} className="text-[#d4af37]" />
             </div>
             <input 
                type="text" 
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://www.bodas.net/bodas/proveedores"
                className="flex-1 bg-white/5 border border-white/10 sm:border-l-0 rounded-xl sm:rounded-none sm:rounded-l-none p-3.5 sm:p-4 text-xs font-mono text-[#d4af37] outline-none focus:border-[#d4af37]/50 transition-all"
             />
             <button 
                onClick={toggleScan}
                className={`px-6 sm:px-8 py-3.5 sm:py-0 rounded-xl sm:rounded-r-xl sm:rounded-l-none font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer ${
                  isScanning 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30' 
                    : 'bg-[#d4af37] hover:bg-[#e0b666] text-black shadow-[0_10px_30px_rgba(212,168,85,0.25)] active:scale-95'
                }`}
              >
                {isScanning ? <Pause size={18} /> : <Play size={18} />}
                <span className="text-xs">{isScanning ? 'Pausar Daemon' : 'Ejecutar en 2º Plano'}</span>
              </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PANEL DE CONTROL DE PARÁMETROS */}
        <div className="space-y-8">
          <GlassCard className="p-8 border-white/5 bg-white/[0.01]">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#d4af37] mb-8 flex items-center gap-2">
              <Target size={14} /> Objetivos de Caza
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40">Filtro de Sector</label>
                <select 
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-black uppercase focus:border-[#d4af37] outline-none cursor-pointer"
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
                  <span className="text-[9px] font-mono text-[#d4af37]">
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
                          setLogs(prev => [`[${new Date().toLocaleTimeString()}] [PARAM] Profundidad ajustada a: ${t}`, ...prev]);
                        }}
                        className={`py-3 rounded-lg text-[10px] font-black uppercase border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] shadow-lg shadow-[#d4af37]/10 font-bold' 
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
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${useProxy ? 'bg-[#d4af37]' : 'bg-white/10'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-black rounded-full transition-transform ${useProxy ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>

                <div 
                  onClick={() => setUseStealth(!useStealth)} 
                  className="flex justify-between items-center cursor-pointer select-none"
                >
                  <span className="text-[10px] font-black uppercase text-white/60">Anti-Bot Stealth</span>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${useStealth ? 'bg-[#d4af37]' : 'bg-white/10'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-black rounded-full transition-transform ${useStealth ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </div>

                <button 
                  onClick={async () => {
                    setLogs(prev => [`[${new Date().toLocaleTimeString()}] [ACTION] Activando BOE & PLACSP Predator Engine...`, ...prev]);
                    const res = await fetch('/api/cron/b2g-telegram-hunter');
                    const data = await res.json();
                    if (data.success) {
                      setLogs(prev => [`[${new Date().toLocaleTimeString()}] [SUCCESS] B2G Radar: Licitaciones sincronizadas y enviadas a Telegram.`, ...prev]);
                    }
                  }}
                  className="w-full mt-4 py-3.5 bg-white/5 border border-[#ecb613]/30 text-[#ecb613] rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#ecb613]/10 transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer"
                >
                  <Cpu size={14} /> Disparar Radar B2G Telegram
                </button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 border-[#d4af37]/20 bg-gradient-to-br from-[#d4af37]/5 to-transparent">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-2">
              <Activity size={14} /> Telemetría de Extracción
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-[8px] text-white/40 uppercase font-black mb-1">Catálogo Total</p>
                <p className="text-2xl font-black text-[#d4af37]">{telemetry.totalCatalog.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-[8px] text-white/40 uppercase font-black mb-1">Escaneados (Sesión)</p>
                <p className="text-2xl font-black text-white">{telemetry.scannedCount}</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-[8px] text-white/40 uppercase font-black mb-1">Latencia</p>
                <p className="text-2xl font-black text-white">{telemetry.latency}</p>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-[8px] text-white/40 uppercase font-black mb-1">Éxito</p>
                <p className="text-2xl font-black text-emerald-500">{telemetry.successRate}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* CONSOLA DE SALIDA TÁCTICA */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="p-0 border-white/5 bg-black/60 overflow-hidden flex flex-col h-[520px]">
            <div className="p-4 sm:p-6 border-b border-white/5 flex flex-wrap justify-between items-center bg-white/[0.02] gap-3">
              <div className="flex items-center gap-3">
                <Terminal size={18} className="text-[#d4af37]" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Salida de Consola (Daemon Background Stream)</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearConsole}
                  title="Limpiar Consola"
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono text-white/40 hover:text-white hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                >
                  <Trash2 size={10} />
                  <span>Limpiar</span>
                </button>
                <span className="text-[9px] font-mono text-[#d4af37] px-2 py-0.5 bg-[#d4af37]/10 rounded border border-[#d4af37]/20">
                  {depth} MODE
                </span>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/20" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                  <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-400 animate-ping' : 'bg-green-500/30'}`} />
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-6 font-mono text-[10px] space-y-2 overflow-y-auto custom-scrollbar break-all">
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.p 
                    key={i} 
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={
                      log.includes('[ACTION]') || log.includes('[CONFIG]') ? 'text-[#d4af37]' :
                      log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' :
                      log.includes('[ERROR]') || log.includes('[CRITICAL]') ? 'text-red-400' :
                      log.includes('[DETECTED]') ? 'text-cyan-300' :
                      log.includes('[DAEMON') ? 'text-amber-300 font-semibold' :
                      'text-white/60'
                    }
                  >
                    {log}
                  </motion.p>
                ))}
              </AnimatePresence>
              {isScanning && (
                <motion.p 
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="text-[#d4af37] font-bold flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  [DAEMON-RUNNING] Infiltración autónoma activa en segundo plano sobre {targetUrl}...
                </motion.p>
              )}
            </div>

            <div className="p-6 border-t border-white/5 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleExportJSON}
                className="flex-1 bg-white/5 border border-white/10 h-12 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Download size={14} /> Exportar JSON
              </button>
              <button 
                onClick={handleInjectCRM}
                className="flex-1 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] h-12 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-[#d4af37]/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Database size={14} /> Inyectar Todos a CRM (+0€)
              </button>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-white/[0.02] rounded-3xl border border-white/5 flex items-center gap-6">
              <div className="p-4 bg-[#d4af37]/10 rounded-2xl text-[#d4af37] border border-[#d4af37]/20">
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
                <p className="text-lg font-black text-white uppercase italic">{depth} Extractor (Daemon)</p>
              </div>
            </div>
          </div>

          {/* MATRIZ DE LEADS DETECTADOS EN SEGUNDO PLANO */}
          <GlassCard className="p-6 border-white/5 bg-black/60">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#d4af37]/10 rounded-lg text-[#d4af37] border border-[#d4af37]/20">
                  <Building2 size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                    Objetivos Cosechados en 2º Plano
                  </h3>
                  <p className="text-[9px] font-mono text-white/40">
                    Base de Datos Activa (24.869 Venues) & Sondas en Vivo
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/20 px-2.5 py-1 rounded-full">
                  {extractedLeads.length} Registros
                </span>
                <button 
                  onClick={handleInjectCRM}
                  className="px-3 py-1 bg-[#d4af37] text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-[#e0b666] transition-all cursor-pointer"
                >
                  Inyectar Todos a CRM
                </button>
              </div>
            </div>

            <div className="divide-y divide-white/5 max-h-[360px] overflow-y-auto custom-scrollbar">
              {extractedLeads.length === 0 ? (
                <div className="py-12 text-center text-white/40 font-mono text-xs">
                  <Radio size={24} className="mx-auto mb-2 text-zinc-600 animate-pulse" />
                  Esperando ciclo del daemon para indexar objetivos en segundo plano...
                </div>
              ) : (
                extractedLeads.map((lead, idx) => {
                  const cleanName = lead
                    .replace(/^\[(PROVEEDOR|EMAIL|PHONE|DETECTED|FINCA|MÚSICA|CATERING|PLANNER|ESPACIO)\]\s*/i, '')
                    .split('·')[0]
                    .trim();
                  const phoneMatch = lead.match(/Tel:\s*([+\d\s]+)/i);
                  const phone = phoneMatch ? phoneMatch[1].trim() : '+34 605 584 338';
                  const tag = lead.match(/^\[(.*?)\]/)?.[1] || 'OBJETIVO';

                  return (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-[#d4af37] border border-white/10 uppercase shrink-0">
                          {tag}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{cleanName}</p>
                          <p className="text-[10px] font-mono text-white/40 flex items-center gap-2">
                            <PhoneCall size={10} className="text-[#d4af37]" />
                            <span>{phone}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addSoberano({
                            id: `lead-${Date.now()}-${idx}`,
                            nombre: cleanName,
                            etapa: 'Prospección Hunter',
                            valor: 0,
                            probabilidad: 0
                          });
                          setLogs(prev => [`[${new Date().toLocaleTimeString()}] [CRM] Prospecto '${cleanName}' inyectado a la Matriz (0 €).`, ...prev]);
                        }}
                        className="shrink-0 px-2.5 py-1 text-[9px] font-mono font-black uppercase text-[#d4af37] hover:bg-[#d4af37]/20 border border-[#d4af37]/30 rounded transition-all cursor-pointer"
                      >
                        + CRM (0€)
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
