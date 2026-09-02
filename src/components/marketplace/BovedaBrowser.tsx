"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Rocket, Zap, Database, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface BovedaResult {
  url: string;
  slug: string;
  title: string;
  category: string;
}

export default function BovedaBrowser() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BovedaResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ nodes: 1829, uptime: "99.99%", status: "S-CLASS ACTIVE" });

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/boveda/search?q=${query}&limit=12`);
        const data = await res.json();
        setResults(data.results);
        setTotal(data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="w-full bg-[#050505] border border-white/5 rounded-3xl p-8 overflow-hidden relative group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-[#d4af37]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#d4af37]/60">
                PROXIMA GENERACION // BÓVEDA DE ACTIVOS
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Buscador <span className="text-[#d4af37] italic font-serif">Tactico.</span>
            </h2>
          </div>

          <div className="flex gap-4">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Total Nodos</p>
              <p className="font-mono text-sm text-white">{stats.nodes}</p>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl border-emerald-500/20">
              <p className="text-[8px] text-emerald-500/60 uppercase tracking-widest mb-1">Status</p>
              <p className="font-mono text-sm text-emerald-400">{stats.status}</p>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative max-w-4xl mb-12">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Introduce servicio o ciudad (ej. 'pantalla led madrid', 'dj barcelona')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 hover:border-[#d4af37]/30 focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/20 rounded-2xl py-6 pl-16 pr-6 text-xl text-white outline-none transition-all placeholder:text-zinc-600 font-light"
          />
          {loading && (
            <div className="absolute inset-y-0 right-6 flex items-center">
              <div className="w-5 h-5 border-2 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {results.map((item, idx) => (
              <motion.div
                key={item.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="group/card relative bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-[#d4af37]/30 p-6 rounded-2xl transition-all h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-white/5 px-2 py-1 rounded text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
                      {item.category}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-[#d4af37]/40 group-hover/card:text-[#d4af37] transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover/card:text-[#d4af37] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono italic truncate">
                    /{item.slug}
                  </p>
                </div>

                <div className="mt-8 flex gap-3">
                    <Link
                        href={item.slug.includes("catering-adriana") ? "/weddings/catering-adriana" : `/${item.slug}`}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-lg text-center transition-all border border-white/5"
                    >
                        {item.slug.includes("catering-adriana") ? "VER GIGANTE S-CLASS" : "Preview EAR OS"}
                    </Link>
                    <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-white/5 hover:bg-[#d4af37]/10 hover:text-[#d4af37] border border-white/5 rounded-lg transition-all"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State / Initial State */}
          {query.length > 0 && results.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl">
              <Zap className="w-12 h-12 text-[#d4af37]/20 mx-auto mb-4" />
              <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
                No se han detectado activos bajo esa firma táctica.
              </p>
            </div>
          )}

          {query.length === 0 && (
             <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl bg-gradient-to-b from-white/5 to-transparent">
                <Rocket className="w-12 h-12 text-[#d4af37] mx-auto mb-4 opacity-40 animate-bounce" />
                <h3 className="text-xl font-bold uppercase mb-2">Sistema a la Espera</h3>
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em]">
                  Introduce un comando para escanear la base de datos de 1,829 nodos integrados.
                </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
