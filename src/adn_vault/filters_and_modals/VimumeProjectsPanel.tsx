'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Search, 
  Filter, 
  ExternalLink, 
  FileText, 
  Target, 
  Heart,
  User,
  Users,
  Compass,
  Zap,
  Activity
} from 'lucide-react';

const STRATEGIC_KEYWORDS = [
  "abuelos", "abuelas", "mayores", "centros de dia", "residencias", 
  "familiares", "viaje musical por la memoria", "terapeutas", 
  "musicoterapia", "ods", "alzheimer"
];

interface ProjectAtom {
  id: number;
  source: string;
  keywords: string[];
  content: string;
  level: number;
  line?: number;
}

export function VimumeProjectsPanel() {
  const [atoms, setAtoms] = useState<ProjectAtom[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const query = search ? `?q=${encodeURIComponent(search)}` : '';
        const res = await fetch(`/api/vimume/projects${query}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await res.json();
          setAtoms(data || []);
        } else {
          setAtoms([]);
        }
      } catch (error) {
        console.error('Error fetching VIMUME projects:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProjects, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Filtrado local adicional por chips con blindaje
  const filteredAtoms = activeKeyword 
    ? atoms.filter(a => (a.keywords || []).some(k => k.toLowerCase().includes(activeKeyword.toLowerCase())) || (a.content || '').toLowerCase().includes(activeKeyword.toLowerCase()))
    : atoms;

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16 rounded-[4rem] border border-white/5 relative overflow-hidden">
      
      {/* GLOW EFFECTS */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto space-y-12">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <Layers size={40} />
              </div>
              <div>
                <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Proyectos <span className="text-emerald-400">Vimume</span></h1>
                <p className="text-[10px] tracking-[0.4em] font-black uppercase text-zinc-500 mt-2">Búsqueda Forense en Cascada • Átomos S-Class</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-96">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="BUSCAR EN LA BÓVEDA..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-[11px] font-black tracking-widest focus:outline-none focus:border-emerald-500/50 transition-all uppercase"
              />
            </div>
          </div>
        </header>

        {/* KEYWORD CLOUD / CHIPS */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setActiveKeyword(null)}
            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${!activeKeyword ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-white/5 text-zinc-500 border-white/10 hover:border-white/20'}`}
          >
            TODOS LOS NODOS
          </button>
          {STRATEGIC_KEYWORDS.map((kw, i) => (
            <button 
              key={i}
              onClick={() => setActiveKeyword(kw)}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${activeKeyword === kw ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-white/5 text-zinc-500 border-white/10 hover:border-white/20'}`}
            >
              {kw}
            </button>
          ))}
        </div>

        {/* PROJECTS CASCADE (MASONRY-LIKE FEED) */}
        {loading ? (
          <div className="h-[600px] flex flex-col items-center justify-center space-y-6">
            <Activity className="w-12 h-12 text-emerald-500 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Escaneando Átomos...</span>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 xl:columns-3 gap-8 space-y-8">
            <AnimatePresence>
              {filteredAtoms.map((atom, idx) => (
                <motion.div
                  key={atom.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="break-inside-avoid bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-all" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-emerald-500 border border-white/10">
                        {(atom.keywords || []).includes('ods') ? <Heart size={16} /> : <FileText size={16} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Fuente: {atom.source}</span>
                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Nivel {atom.level} • Línea {atom.line || atom.id}</span>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-zinc-700 group-hover:text-emerald-400 transition-colors" />
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed font-medium mb-8">
                    {atom.content.length > 300 ? atom.content.substring(0, 300) + '...' : atom.content}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {(atom.keywords || []).map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-black rounded-lg border border-white/5 text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredAtoms.length === 0 && (
          <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
            <Compass className="w-12 h-12 text-zinc-800" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">No se encontraron nodos con estos criterios</span>
          </div>
        )}

      </div>
    </div>
  );
}

export default VimumeProjectsPanel;
