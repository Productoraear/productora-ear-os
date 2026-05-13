'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Waves, 
  Activity, 
  Zap, 
  Mic2, 
  Layers, 
  Brain, 
  Bot,
  Database,
  Link2,
  FileText,
  Clock
} from 'lucide-react';

export function VimumeCorePanel() {
  const [isAspirating, setIsAspirating] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [atomsCount, setAtomsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessRes, atomsRes] = await Promise.all([
          fetch('/api/vimume/sessions'),
          fetch('/api/vimume/atoms')
        ]);
        const sessData = await sessRes.json();
        const atomsData = await atomsRes.json();
        
        setSessions(sessData || []);
        setAtomsCount(atomsData?.length || 0);
        setLoading(false);
      } catch (error) {
        console.error('Error sincronizando VIMUME Core:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Ingesta Total', val: `${sessions.length} Sesiones`, color: '#d4af37' },
    { label: 'Átomos RAG', val: atomsCount.toLocaleString(), color: '#4d94ff' },
    { label: 'Densidad Conocimiento', val: `${(atomsCount / (sessions.length || 1)).toFixed(1)} / ses`, color: '#4dff88' },
    { label: 'Estado Bóveda', val: sessions.length > 0 ? 'SINCRO' : 'OFFLINE', color: '#ff4d94' },
  ];

  const toggleAspiration = () => {
    setIsAspirating(!isAspirating);
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans p-4 md:p-16 rounded-[4rem] border border-white/5 overflow-hidden relative group">
      
      {/* VIMUME FLUID BACKGROUND EFFECT */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30 pointer-events-none">
        <motion.div 
           animate={{ 
             scale: [1, 1.1, 1],
             opacity: [0.2, 0.4, 0.2]
           }}
           transition={{ duration: 10, repeat: Infinity }}
           className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#d4af37]/10 blur-[150px] rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-[1700px] mx-auto space-y-16">
        
        {/* HEADER VIMUME */}
        <header className="flex flex-col md:flex-row justify-between items-start gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-gradient-to-tr from-zinc-900 to-black rounded-[2.5rem] flex items-center justify-center text-[#d4af37] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,1)]">
                    <Waves size={40} className={isAspirating ? 'animate-pulse' : ''} />
                 </div>
                 <div>
                    <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Vimume <span className="text-[#d4af37]">Core</span></h1>
                    <div className="mt-2 flex items-center gap-4">
                       <span className="text-[10px] tracking-[0.4em] font-black uppercase text-zinc-500">Bóveda H: Forensic Explorer</span>
                       <div className="h-1px w-12 bg-white/10" />
                       <span className="text-[10px] font-mono text-[#d4af37]">S-CLASS OMEGA PHASE</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex gap-4">
              <div className="bg-zinc-900/50 backdrop-blur-xl px-8 h-20 rounded-[2rem] border border-white/5 flex items-center gap-8">
                 <div className="text-center">
                    <div className="text-xs font-black text-zinc-500 uppercase tracking-widest">Protocolo</div>
                    <div className="text-2xl font-black text-white italic">{sessions.length}/52</div>
                 </div>
                 <div className="w-[1px] h-8 bg-white/10" />
                 <div className="text-center">
                    <div className="text-xs font-black text-zinc-500 uppercase tracking-widest">Sincronía</div>
                    <div className="text-2xl font-black text-[#d4af37] italic">{sessions.length > 52 ? 'OVERFLOW' : 'ESTABLE'}</div>
                 </div>
              </div>
           </div>
        </header>

        {/* CENTRAL ASPIRATION ZONE */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
           
           <div className="xl:col-span-12">
              <div 
                className="bg-zinc-900/20 rounded-[5rem] border border-white/5 h-[450px] relative overflow-hidden flex items-center justify-center cursor-pointer group"
                onClick={toggleAspiration}
              >
                  <AnimatePresence mode="wait">
                    {isAspirating ? (
                      <motion.div 
                        key="active"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center space-y-12 w-full px-24"
                      >
                         <h2 className="text-3xl font-black uppercase tracking-tighter italic text-[#d4af37] animate-pulse">Aspirando Bóveda H: ...</h2>
                         <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden relative">
                            <motion.div 
                              initial={{ x: '-100%' }}
                              animate={{ x: '100%' }}
                              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
                            />
                         </div>
                         <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Procesando {atomsCount} átomos de conocimiento...</div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center space-y-8"
                      >
                         <div className="w-32 h-32 bg-[#d4af37]/10 rounded-full flex items-center justify-center border border-[#d4af37]/30 group-hover:scale-110 transition-transform shadow-[0_0_80px_rgba(212,175,55,0.1)]">
                            <Bot size={56} className="text-[#d4af37]" />
                         </div>
                         <div className="text-center">
                            <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Bóveda H: <br />Activa</h2>
                            <p className="text-xs text-zinc-600 mt-4 font-mono tracking-widest uppercase">{sessions.length} sesiones recuperadas con éxito</p>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
           </div>

           {/* ANALYTICS & INSIGHTS */}
           <div className="xl:col-span-8 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {stats.map((s, i) => (
                    <div key={i} className="bg-zinc-900 p-10 rounded-[3rem] border border-white/5 hover:border-white/10 transition-all flex justify-between items-center group cursor-pointer shadow-xl">
                       <div className="space-y-1">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{s.label}</div>
                          <div className="text-4xl font-black italic tracking-tighter group-hover:text-[#d4af37] transition-colors uppercase">{s.val}</div>
                       </div>
                       <Activity size={32} style={{ color: s.color }} className="opacity-40" />
                    </div>
                 ))}
              </div>

              <section className="bg-zinc-900 border border-white/5 rounded-[4rem] p-12 space-y-12">
                 <h3 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                    <Brain className="text-[#d4af37]" size={28} /> Auditoría Real del RAG
                 </h3>
                 <div className="space-y-8">
                    {[
                      { area: 'Densidad de Ingesta', val: Math.min(100, (sessions.length / 52) * 100), icon: Database },
                      { area: 'Integridad Atmos', val: Math.min(100, (atomsCount / 5000) * 100), icon: Zap },
                      { area: 'Sincronía S-Class', val: sessions.length > 0 ? 100 : 0, icon: Link2 },
                    ].map((item, i) => (
                       <div key={i} className="space-y-4">
                          <div className="flex justify-between items-end">
                             <div className="flex items-center gap-4">
                                <item.icon size={20} className="text-zinc-500" />
                                <span className="text-xs font-black uppercase tracking-widest">{item.area}</span>
                             </div>
                             <span className="text-sm font-mono font-bold text-[#d4af37]">{item.val.toFixed(1)}%</span>
                          </div>
                          <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/5">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${item.val}%` }}
                               transition={{ duration: 1.5, delay: i * 0.2 }}
                               className="h-full bg-[#d4af37]"
                             />
                          </div>
                       </div>
                    ))}
                 </div>
              </section>
           </div>

           {/* TOOLKIT & SESSION LOGS */}
           <div className="xl:col-span-4 space-y-12">
              <div className="bg-[#d4af37] p-12 rounded-[4rem] text-black space-y-12 shadow-2xl relative overflow-hidden group">
                 <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none relative z-10">Bóveda <br />Digital</h2>
                 <p className="text-[10px] font-bold uppercase leading-relaxed opacity-80 relative z-10">
                    Sincronización en tiempo real con el archivo histórico recuperado. 
                    Protocolo VIMUME activo y verificado.
                 </p>
                 <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase">
                       <Clock size={16} /> Última Ingesta: Hoy
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase">
                       <FileText size={16} /> Formatos: .docx, .md, .json
                    </div>
                 </div>
              </div>

              <div className="bg-zinc-900/80 border border-white/5 rounded-[4rem] p-12 space-y-10 max-h-[600px] overflow-hidden flex flex-col">
                 <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-4">
                    <Layers size={20} className="text-zinc-500" /> Últimas Sesiones
                 </h3>
                 <div className="space-y-6 overflow-y-auto pr-4 custom-scrollbar flex-1">
                    {sessions.slice(0, 10).map((session, idx) => (
                       <div key={idx} className="flex flex-col gap-2 border-l-2 border-white/10 pl-6 py-2 group cursor-pointer hover:border-[#d4af37] transition-all">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">#{session.id} - {session.type}</span>
                          <span className="text-sm font-bold uppercase group-hover:text-[#d4af37] transition-colors truncate">{session.title}</span>
                       </div>
                    ))}
                 </div>
                 <button className="text-xs font-black uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors flex items-center gap-4 pt-4 border-t border-white/5">
                    Ver {sessions.length} sesiones <Bot size={16} />
                 </button>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}

export default VimumeCorePanel;
