'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Search, Database, Cpu, Shield, Activity, 
  Zap, FileSearch, Layers, Dna, HardDrive
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import SovereignMemoryTest from '@/app/components/SovereignMemoryTest';

/**
 * 🕵️ MODULE: FORENSIC SCANNER (NEURAL_OS v4.02 // BIT_STREAM)
 * Recovery of fragmented logic from secondary storage nodes.
 * Ahora integrado con Firestore (ear_forensic_logs) para persistencia real-time.
 */
export default function ForensicScanner() {
  const [memoryActive, setMemoryActive] = useState(false);
  const [isTestActive, setIsTestActive] = useState(false);
  const [logs, setLogs] = useState<{ id: string, text: string, timestamp: any }[]>([]);
  const [progress, setProgress] = useState(77);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Firestore Live Listener para logs forenses
  useEffect(() => {
    const q = query(collection(db, 'ear_forensic_logs'), orderBy('timestamp', 'asc'), limit(50));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activeLogs: any[] = [];
      snapshot.forEach(doc => {
        activeLogs.push({ id: doc.id, ...doc.data() });
      });

      // Fallback S-Class si la colección está vacía
      if (activeLogs.length === 0) {
        const initialLogs = [
          { id: '1', text: "Iniciando Filehook de Neural OS... [LISTO]", timestamp: new Date() },
          { id: '2', text: "Montando unidad forense /dev/sdX1... [LISTO]", timestamp: new Date() },
          { id: '3', text: "INGIRIENDO: C:\\EAR_OS\\01_CORE_STRATEGY\\KNOWLEDGE_BASE\\MASTER_KNOWLEDGE_GRAFO.json ... [OK]", timestamp: new Date() },
          { id: '4', text: "ANALIZANDO: Átomos de Mariachi Aflamencado... [ESCRIBIENDO]", timestamp: new Date() },
          { id: '5', text: "ESTABILIZANDO: KV-CACHE para Arquitectura S-Class... [98%]", timestamp: new Date() }
        ];
        setLogs(initialLogs);
      } else {
        setLogs(activeLogs);
      }
    }, (error) => {
      console.error("Forensic Logs Listener Error:", error);
    });

    return () => unsubscribe();
  }, []);

  // Generador de simulación (opcional para mantener efecto vivo)
  useEffect(() => {
    const interval = setInterval(async () => {
      const newText = `SCANNING: ${Math.random().toString(36).substring(7).toUpperCase()}_FRAGMENT.tsx ... [RECOVERED]`;
      try {
        await addDoc(collection(db, 'ear_forensic_logs'), {
          text: newText,
          timestamp: serverTimestamp()
        });
      } catch (e) {
        // Ignorar en caso de falta de permisos o emulador
        console.warn("No se pudo inyectar log en Firestore");
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const discoveries = [
    { title: "1,500+ SEO URLs in Graph", detail: "TIMESTAMP: 04:22:11 // OFFSET: 0x99F", score: 0.99 },
    { title: "IMSERSO Funding Logic", detail: "MATCH_SCORE: 0.988 // CLUSTER: B3", score: 0.98 },
    { title: "Stealth rotation logic", detail: "SOURCE_NODE: 192.168.1.1 // ALERT: LOW", score: 0.94 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 lg:p-20 relative overflow-hidden font-inter selection:bg-emerald-400 selection:text-black">
      {/* SCANNING LINES EFFECT */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
        <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto space-y-12">
        
        {/* HEADER: BIT_STREAM_TELEMETRY */}
        <header className="flex flex-col lg:flex-row justify-between items-start gap-8 border-b border-white/5 pb-12">
           <div className="space-y-4">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                    <Activity size={40} className="animate-pulse" />
                 </div>
                 <div>
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">ESCÁNER FORENSE - Neural <span className="text-emerald-400">OS</span> v4.02</h1>
                    <div className="mt-2 flex items-center gap-4">
                       <span className="text-[10px] tracking-[0.4em] font-black uppercase text-white/20">Protocolo Forense ALPHA YOLO</span>
                       <div className="h-px w-12 bg-white/10" />
                       <span className="text-[10px] text-emerald-400 font-mono tracking-widest">BIT_STREAM_ACTIVE {"//"} FIRESTORE_SYNC</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex gap-4">
              <div className="bg-zinc-900/40 backdrop-blur-xl px-8 py-6 rounded-3xl border border-white/5 flex items-center gap-12">
                 <div className="text-center">
                    <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Carga Neural</div>
                    <div className="text-2xl font-black text-emerald-400 italic leading-none">{progress}%</div>
                 </div>
                 <div className="w-px h-8 bg-white/10" />
                 <div className="text-center">
                    <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Bits Procesados</div>
                    <div className="text-2xl font-black text-white italic leading-none">1.2 TB</div>
                 </div>
              </div>
           </div>
        </header>

        {/* SCANNER CORE */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
           
           {/* TERMINAL: BIT_STREAM */}
           <div className="xl:col-span-8 space-y-8">
              <div className="bg-zinc-900/20 border border-white/10 rounded-[2.5rem] p-4 lg:p-10 relative group overflow-hidden">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                       <Search className="text-emerald-400 w-5 h-5" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Enlace_Forense {"//"} FIRESTORE_EAR_FORENSIC_LOGS</span>
                    </div>
                    <div className="flex gap-2">
                       <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                       <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse delay-75" />
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150" />
                    </div>
                 </div>

                 <div 
                   ref={scrollRef}
                   className="h-[500px] overflow-y-auto space-y-2 font-mono text-[11px] lg:text-[13px] custom-scrollbar pr-4 text-emerald-400/80"
                 >
                    <AnimatePresence initial={false}>
                      {logs.map((log) => (
                        <motion.div 
                          key={log.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-4 border-l border-emerald-500/20 pl-4 py-1 hover:bg-emerald-500/5 transition-colors group cursor-crosshair"
                        >
                           <span className="text-white/20 select-none">[{log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString() : new Date().toLocaleTimeString()}]</span>
                           <span className="group-hover:text-white transition-colors">{log.text}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div className="animate-pulse">_</div>
                 </div>

                 {/* Terminal Overlay */}
                 <div className="absolute bottom-8 right-8 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Sincronización Firestore en Curso</span>
                 </div>
              </div>
           </div>

           {/* SIDEBAR: DISCOVERY_NUGGETS */}
           <div className="xl:col-span-4 space-y-12">
              <section className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                 <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-4">
                       <Search size={20} className="text-emerald-400" /> Hallazgos Clave
                    </h3>
                    <span className="text-[9px] font-black bg-emerald-400/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-400/20 tracking-widest">ENCONTRADO</span>
                 </div>

                 <div className="space-y-6">
                    {discoveries.map((disc, i) => (
                       <div key={i} className="p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                             <Dna size={40} className="text-emerald-400" />
                          </div>
                          <h4 className="text-sm font-black uppercase italic tracking-tight group-hover:text-emerald-400 transition-colors">{disc.title}</h4>
                          <p className="text-[9px] text-white/30 mt-2 font-mono">{disc.detail}</p>
                          <div className="mt-4 flex items-center gap-3">
                             <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${disc.score * 100}%` }}
                                  className="h-full bg-emerald-400"
                                />
                             </div>
                             <span className="text-[9px] font-mono font-bold text-emerald-400/60">{Math.round(disc.score * 100)}%</span>
                          </div>
                       </div>
                    ))}
                 </div>

                 <button className="w-full py-4 border border-emerald-400/20 text-emerald-400 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-emerald-400 hover:text-black transition-all">
                    Descargar Manifiesto de Extracción
                 </button>
              </section>

              <div className="bg-emerald-400 p-10 rounded-[2.5rem] text-black space-y-6 shadow-[0_30px_70px_rgba(16,185,129,0.3)]">
                 <Shield size={40} className="opacity-80" />
                 <div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Bit por Bit. <br /> Átomo por Átomo.</h3>
                    <p className="text-[10px] font-bold mt-4 leading-relaxed opacity-60 uppercase tracking-widest">Sincronización total con Firebase Firestore garantizada.</p>
                 </div>
                 <div className="flex gap-2">
                    <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center">
                       <Database size={20} />
                    </div>
                 </div>
              </div>

              <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-10 flex items-center gap-6 group hover:border-white/20 transition-all cursor-pointer">
                 <div>
                    <div className="text-[8px] font-black text-white/30 uppercase tracking-widest">Unidad Origen</div>
                    <div className="text-sm font-black italic uppercase tracking-tighter">BODEGA_H_DRIVE</div>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}
