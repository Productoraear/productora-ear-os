"use client";
import React from "react";
import { motion } from "framer-motion";
import { Brain, Star, ChevronRight, Zap, Target, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

const AstraPortalSClass = () => {
  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-[#d4af37]/30">
      {/* Header Fijo */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 p-4 flex items-center justify-between">
        <Link href="/command-center">
          <button className="text-gray-400 p-2 hover:bg-white/5 rounded-full transition-all flex items-center gap-2">
            <ArrowLeft size={20} /> <span className="text-xs uppercase tracking-widest font-bold">Volver al Command Center</span>
          </button>
        </Link>
        <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-white/70">ASTRA · NEURAL STRATEGIC ENGINE</h2>
        <div className="w-10"></div>
      </motion.div>

      <main className="max-w-5xl mx-auto p-8 py-20">
        <header className="text-center mb-20">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block p-4 bg-[#d4af37]/10 rounded-full mb-6">
            <Brain className="text-[#d4af37]" size={64} />
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-6xl font-bold tracking-tighter mb-4">ASTRA <span className="text-[#d4af37]">OS</span></motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-gray-500 text-xl max-w-2xl mx-auto">El motor neural de formaciÃ³n para artistas de elite. De 0 a 1.500â‚¬ en 66/99 dÃ­as.</motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-[#0a0c10] border border-[#d4af37]/20 p-8 rounded-3xl relative overflow-hidden group cursor-pointer">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#d4af37]/5 rounded-full blur-3xl transition-all group-hover:bg-[#d4af37]/10" />
            <div className="flex justify-between items-start mb-12">
              <Zap className="text-[#d4af37]" size={32} />
              <ChevronRight className="text-white/20" />
            </div>
            <h3 className="text-2xl font-bold mb-2">99 CLICS</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">La ruta de autoridada para artistas emergentes. Gana el juego del mercado sin vender tu alma.</p>
            <div className="flex gap-2">
              <span className="text-[10px] bg-[#d4af37]/10 border border-[#d4af37]/20 px-2 py-1 rounded text-[#d4af37] font-bold">MASTERCLASS</span>
              <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-500 font-bold uppercase">LEVEL 1</span>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="bg-[#0a0c10] border border-white/5 p-8 rounded-3xl relative overflow-hidden group cursor-pointer">
            <div className="flex justify-between items-start mb-12">
              <Target className="text-blue-500" size={32} />
              <ChevronRight className="text-white/20" />
            </div>
            <h3 className="text-2xl font-bold mb-2">66 DÃAS</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">El rÃ©gimen de entrenamiento para el lanzamiento de tu Propiedad Intelectual (IP).</p>
            <div className="flex gap-2">
              <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded text-blue-500 font-bold uppercase">ACCELERATOR</span>
              <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-500 font-bold uppercase">LEVEL 2</span>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 bg-gradient-to-br from-[#161b22] to-[#0a0c10] border border-white/5 p-10 rounded-3xl text-center">
          <ShieldCheck className="mx-auto text-green-500 mb-6" size={48} />
          <h3 className="text-2xl font-bold mb-2 uppercase">Consejo EstratÃ©gico Neural</h3>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto italic">"Invocando al OrÃ¡culo Creativo y al Arquitecto de Marca... tu sesiÃ³n de hoy estÃ¡ lista."</p>
          <button className="bg-white text-black font-black py-4 px-10 rounded-xl text-sm tracking-widest uppercase hover:bg-[#d4af37] transition-all">
             INICIAR SESIÃ“N DE FORMACIÃ“N
          </button>
        </div>
      </main>

      <footer className="py-20 text-center border-t border-white/5 text-[10px] text-gray-700 font-mono tracking-widest uppercase">
        Powered by ASTRA OS Engine · Integrado en EAR OS 2026
      </footer>
    </div>
  );
};

export default AstraPortalSClass;