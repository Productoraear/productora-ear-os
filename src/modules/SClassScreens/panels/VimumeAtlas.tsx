"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Database, Layers, Filter, FileText, Zap, Brain, History, ExternalLink, Loader2 } from 'lucide-react';

export default function VimumeAtlas() {
  const [atoms, setAtoms] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAtoms = async () => {
      try {
        const response = await fetch('/api/vimume/atoms');
        if (!response.ok) throw new Error('Failed to fetch atoms');
        const data = await response.json();
        setAtoms(data);
      } catch (error) {
        console.error("Error loading VIMUME atoms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAtoms();
  }, []);

  const filteredAtoms = useMemo(() => {
    return atoms.filter((atom: any) => {
      const matchesSearch = atom.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            atom.path.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === 'ALL' || atom.level === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [atoms, searchTerm, selectedLevel]);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 lg:p-24 font-mono overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="border-l-4 border-[#ecb613] pl-8">
          <div className="flex items-center gap-4 text-[#ecb613] mb-4">
            <Database size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Repositorio Atómico v3.0</span>
          </div>
          <h1 className="text-5xl font-serif italic tracking-tighter">Atlas de la <span className="text-[#ecb613]">Memoria</span></h1>
          <p className="text-gray-500 text-sm mt-4 uppercase tracking-widest max-w-2xl">
            Navegando el conocimiento asimilado. Nodos de inteligencia interconectados bit a bit.
          </p>
        </header>

        {/* Barra de Control S-Class */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sticky top-0 z-50 py-4 bg-[#050505]/80 backdrop-blur-md">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input 
              type="text"
              placeholder="Buscar átomo de sabiduría..."
              className="w-full bg-white/[0.03] border border-white/10 h-14 rounded-2xl pl-12 pr-6 focus:border-[#ecb613]/50 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-white/[0.03] border border-white/10 h-14 rounded-2xl px-6 text-[10px] uppercase font-bold tracking-widest outline-none focus:border-[#ecb613]/50 appearance-none cursor-pointer"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
          >
            <option value="ALL">Todos los Niveles</option>
            {[1,2,3,4,5,6,7,8,9,10].map(l => (
              <option key={l} value={l}>Nivel {l}</option>
            ))}
          </select>
          <div className="bg-white/[0.03] border border-white/10 h-14 rounded-2xl flex items-center justify-center px-6">
            <span className="text-[10px] font-black text-[#ecb613] tracking-[0.2em]">{filteredAtoms.length} NODOS ACTIVOS</span>
          </div>
        </div>

        {/* Grid Virtualizado de Átomos */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 space-y-6">
            <Loader2 className="animate-spin text-[#ecb613]" size={48} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse text-[#ecb613]">Sincronizando Red Neural...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAtoms.map((atom: any, i) => (
              <motion.div
                key={atom.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 20) * 0.01 }}
                className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.04] hover:border-[#ecb613]/20 transition-all group flex flex-col justify-between h-[380px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-black rounded-xl border border-white/5">
                      {atom.level >= 4 ? <Zap size={16} className="text-[#ecb613]" /> : <FileText size={16} className="text-blue-400" />}
                    </div>
                    <span className="text-[8px] font-black px-3 py-1 bg-white/5 rounded-full uppercase tracking-tighter text-gray-400">
                      LVL {atom.level || '?'} · {atom.path.split('.').pop()}
                    </span>
                  </div>
                  <h3 className="text-[10px] font-black text-[#ecb613] uppercase tracking-widest mb-4 truncate">{atom.path}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed italic line-clamp-6">
                    "{atom.content}"
                  </p>
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <button className="text-[9px] font-black text-[#ecb613] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                    Analizar Bit <ExternalLink size={10} />
                  </button>
                  <span className="text-[8px] text-gray-700 uppercase">UID: {atom.id || i}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
