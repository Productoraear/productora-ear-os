"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, Mail, Globe, Target, Zap, Rocket, CheckCircle, AlertCircle, Loader2
} from "lucide-react";
import Link from "next/link";

const ArsenalTacticoSClass = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [domain, setDomain] = useState("bodas.net");

  const runHunter = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/hunter/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Connection failed" });
    } finally {
      setLoading(false);
    }
  };

  const tools = [
    {
      id: "hunter",
      name: "The Hunter Protocol",
      icon: <Search className="text-[#d4af37]" />,
      desc: "Extracción sigilosa de emails y contactos de directivos. Humanizado e indetectable.",
      skills: ["Email Finder", "Domain Search", "Verify"],
      status: loading ? "BUSY" : "OPERATIONAL",
      color: "#d4af37",
      action: runHunter
    },
    {
      id: "dataforseo",
      name: "SERP Intelligence (Google)",
      icon: <Globe className="text-blue-500" />,
      desc: "Radar de búsqueda en tiempo real. Seguimiento de competencia y volumen de palabras clave.",
      skills: ["Google Organic", "Ads Volume", "Geo-Targeting"],
      status: "READY",
      color: "#3b82f6"
    }
  ];

  return (
    <div className="bg-[#050505] text-white min-h-screen font-mono selection:bg-[#d4af37]/30">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 p-4 flex items-center justify-between">
        <Link href="/command-center">
          <button className="text-gray-400 p-2 hover:bg-white/5 rounded-full transition-all flex items-center gap-2">
            <ArrowLeft size={20} /> <span className="text-xs uppercase tracking-widest font-bold text-gray-400">Volver</span>
          </button>
        </Link>
        <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-white/70">EAR OS · ARSENAL TÁCTICO</h2>
        <div className="w-10"></div>
      </motion.div>

      <main className="max-w-6xl mx-auto p-8">
        <header className="mb-12">
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl font-bold tracking-tighter mb-4 uppercase">
            SISTEMAS DE <span className="text-[#a78bfa]">ALTA INGENIERÍA</span>
          </motion.h1>
          <div className="flex gap-4 items-center mb-4">
             <input 
               type="text" 
               value={domain}
               onChange={(e) => setDomain(e.target.value)}
               className="bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-sm text-[#d4af37] w-64 focus:outline-none focus:border-[#d4af37]"
               placeholder="Ingrese dominio (ej: bodas.net)"
             />
             <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Target Selection</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <motion.div key={tool.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-[#0a0c10] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-white/5">{tool.icon}</div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-tight">{tool.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${loading && tool.id === 'hunter' ? 'bg-yellow-500 animate-spin' : 'bg-green-500 animate-pulse'}`} />
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{tool.status}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 text-sm mb-6 leading-relaxed">{tool.desc}</p>

              <button 
                onClick={tool.action}
                disabled={loading}
                className={`w-full ${loading ? 'opacity-50 cursor-not-allowed' : 'bg-white/5 hover:bg-white hover:text-black'} py-3 rounded-lg text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 border border-white/10`}
              >
                {loading && tool.id === 'hunter' ? <Loader2 className="animate-spin" size={14} /> : <Rocket size={14} />} 
                {loading && tool.id === 'hunter' ? "Cazando Objetivo..." : "Ejecutar Protocolo"}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Ventana de Resultados S-Class */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="mt-12 bg-[#0a0c10] border border-[#d4af37]/30 rounded-2xl p-8 relative overflow-hidden">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-bold tracking-widest uppercase text-[#d4af37] flex items-center gap-2">
                   <CheckCircle size={16} /> Intelligence Report
                 </h3>
                 <button onClick={() => setResult(null)} className="text-gray-500 hover:text-white">Cerrar</button>
               </div>
               <pre className="text-[10px] text-green-400 bg-black/50 p-6 rounded-xl overflow-x-auto max-h-64 border border-white/5 font-mono">
                 {JSON.stringify(result, null, 2)}
               </pre>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default ArsenalTacticoSClass;