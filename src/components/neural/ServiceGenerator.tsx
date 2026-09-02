"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Target, BarChart3, Globe, Layers, ArrowRight } from "lucide-react";

interface ServiceGeneratorProps {
  slug: string[];
}

export const ServiceGenerator: React.FC<ServiceGeneratorProps> = ({ slug }) => {
  const path = slug.join("/");
  
  // Lógica de "Ingeniería de Inferencia" para entender el servicio
  const metadata = useMemo(() => {
    const rawName = slug[slug.length - 1] || "Core-Asset";
    const name = rawName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    
    // Clasificación automática
    let category = "PRODUCCIÓN GENERAL";
    let icon = <Shield className="w-5 h-5" />;
    
    if (path.includes("weddings")) {
      category = "BODAS ELITE (S-CLASS)";
      icon = <Zap className="w-5 h-5 text-gold-500" />;
    } else if (path.includes("arsenal")) {
      category = "ARSENAL TÁCTICO / AV";
      icon = <Target className="w-5 h-5" />;
    } else if (path.includes("titan")) {
      category = "TITAN OPS / GESTIÓN";
      icon = <BarChart3 className="w-5 h-5" />;
    }

    return { name, category, icon, path };
  }, [slug, path]);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-12 font-sans selection:bg-[#ecb613] selection:text-black">
      {/* HUD Header */}
      <div className="mb-12 border-b border-white/5 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              {metadata.icon}
            </div>
            <span className="text-[10px] font-black tracking-[0.4em] uppercase font-mono text-zinc-500">
              {metadata.category} // ASSET_ID_{Math.random().toString(36).substr(2, 6).toUpperCase()}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
            {metadata.name}
          </h1>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-zinc-900/30 border border-white/5 p-4 rounded-xl text-center min-w-[120px]">
            <p className="text-[9px] font-mono text-zinc-500 uppercase mb-1">Impact Factor</p>
            <p className="text-2xl font-mono font-bold text-[#ecb613]">9.8</p>
          </div>
          <div className="bg-zinc-900/30 border border-white/5 p-4 rounded-xl text-center min-w-[120px]">
            <p className="text-[9px] font-mono text-zinc-500 uppercase mb-1">Status</p>
            <p className="text-2xl font-mono font-bold text-green-500 italic">ACTIVE</p>
          </div>
        </div>
      </div>

      {/* Main Dossier Grid */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Visual Showcase Card */}
        <div className="col-span-12 lg:col-span-8 bg-zinc-900/10 border border-white/5 rounded-[3rem] p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
            <Globe className="w-48 h-48 text-white/5 -mr-12 -mt-12 animate-spin-slow" />
          </div>
          
          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl font-bold italic font-display mb-6 gold-text">
              "Excelencia sin compromisos para la Productiva EAR"
            </h2>
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
              Nuestro servicio de <span className="text-white font-bold">{metadata.name}</span> utiliza protocolos de despliegue militar para garantizar que cada evento sea una obra maestra de ingeniería emocional.
            </p>
            
            <div className="grid grid-cols-2 gap-8 py-8 border-t border-white/10">
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#ecb613] mb-2">Despliegue</h4>
                <p className="text-sm text-zinc-500 italic">48h Rapid Protocol</p>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#ecb613] mb-2">Soporte</h4>
                <p className="text-sm text-zinc-500 italic">VIP Concierge 24/7</p>
              </div>
            </div>

            <button className="group mt-4 px-8 py-4 bg-[#ecb613] text-black font-black uppercase tracking-widest text-xs rounded-full flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(236,182,19,0.3)]">
              SOLICITAR ACCESO VIP
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-[3rem] backdrop-blur-xl">
            <Layers className="w-8 h-8 text-[#ecb613] mb-6" />
            <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter">Especificaciones Técnicas</h3>
            <ul className="space-y-4 font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>REDUNDANCIA</span>
                <span className="text-white">LEVEL 4</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>PRECISIÓN</span>
                <span className="text-white">ULTRA-FIDELITY</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>OS_KERNEL</span>
                <span className="text-white">EAR_OS_2026</span>
              </li>
              <li className="flex justify-between">
                <span>ESTÁNDAR</span>
                <span className="text-white">S-CLASS GOLD</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#ecb613] p-10 rounded-[3rem] text-black flex flex-col justify-center items-center text-center">
            <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4 italic">
              Se lo dices o se lo canto?
            </h3>
            <p className="text-xs font-bold opacity-60 uppercase tracking-widest">
              El claim que define una época.
            </p>
          </div>
        </div>

      </div>
      
      {/* Dynamic Background Grid Pattern */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 60s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .gold-text {
          background: linear-gradient(135deg, #ecb613 0%, #b8860b 50%, #ecb613 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};
