"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Search, Cpu, BarChart3, ShieldCheck, Shield, Truck, Users, LayoutGrid, Rocket, Zap, Target, Lock, Filter
} from "lucide-react";
import Link from "next/link";

const ToolkitHubSClass = () => {
  const [filter, setFilter] = useState("ALL");

  const categories = [
    { id: "ALL", label: "Todos los Activos", icon: <LayoutGrid size={14} /> },
    { id: "FINANCE", label: "Financial Intel", icon: <BarChart3 size={14} /> },
    { id: "ENGINEERING", label: "Artistic Engineering", icon: <Cpu size={14} /> },
    { id: "AUTHORITY", label: "Mentoring & Authority", icon: <ShieldCheck size={14} /> },
    { id: "STRATEGY", label: "Strategic Deployment", icon: <Target size={14} /> },
    { id: "OPS", label: "Logistics & Ops", icon: <Truck size={14} /> },
      { id: 'stitch-blueprints', label: 'Stitch Blueprints', icon: <Zap className="w-4 h-4" /> }
  ];

  const tools = [
    {
      id: "hunter-protocol",
      name: "Hunter Protocol (Email)",
      category: "Growth Hacking",
      status: "Active",
      icon: <Target className="w-5 h-5" />,
      description: "Extracción masiva de emails corporativos verificados.",
      skills: ["Outbound", "Lead Gen", "Vampirism"]
    },
    {
      id: "dataforseo-serp",
      name: "DataForSEO (Google Radar)",
      category: "Growth Hacking",
      status: "Active",
      icon: <Search className="w-5 h-5" />,
      description: "Espionaje de rankings y volumen de búsqueda en tiempo real.",
      skills: ["SEO", "Competitor Analysis", "Keywords"]
    },
    {
      id: "objection-killer",
      name: "Objection Killer (Script)",
      category: "Growth Hacking",
      status: "Ready",
      icon: <Shield className="w-5 h-5" />,
      description: "IA entrenada para rebatir objeciones de alto ticket.",
      skills: ["Sales", "Closing", "Psychology"]
    },
    {
      id: "stitch-artist",
      name: "Artist Landing Blueprint",
      category: "Stitch Blueprints",
      status: "Ready",
      icon: <Users className="w-5 h-5" />,
      description: "Plantilla maestra para landing de artistas.",
      skills: ["Conversion", "Aesthetics", "Stitch UI"]
    },
    {
      id: "stitch-b2b",
      name: "Corporate B2B Blueprint",
      category: "Stitch Blueprints",
      status: "Ready",
      icon: <Shield className="w-5 h-5" />,
      description: "Interfaz para clientes corporativos de alto nivel.",
      skills: ["B2B Sales", "Trust", "Stitch UI"]
    },
    {
      id: "stitch-events",
      name: "Eventos 360 Blueprint",
      category: "Stitch Blueprints",
      status: "Ready",
      icon: <Zap className="w-5 h-5" />,
      description: "Gestión visual de experiencias 360.",
      skills: ["Logistics", "Experience", "Stitch UI"]
    },
    { id: "opal-12", cat: "FINANCE", name: "Simulador OPAL 12 Meses", status: "READY", desc: "Proyeccion financiera neural de ingresos artisticos." },
    { id: "rider-audit", cat: "ENGINEERING", name: "Forensic Rider Audit", status: "ACTIVE", desc: "Auditoria tecnica de requerimientos S-Class." },
    { id: "senior-ment", cat: "AUTHORITY", name: "Senior Mentoring Protocol", status: "READY", desc: "Protocolo de 10 pasos para transferencia de autoridad." },
    { id: "market-intel", cat: "STRATEGY", name: "Market Intelligence Core", status: "ACTIVE", desc: "Rastreo de competencia y GAPs de mercado." },
    { id: "tour-eng", cat: "OPS", name: "Tour Engineering Hub", status: "READY", desc: "Gestion logistica y de rutas de alta eficiencia." },
    { id: "roi-calc", cat: "FINANCE", name: "Cache ROI Calculator", status: "READY", desc: "Calculo de rentabilidad por sesion/evento." },
    { id: "setlist-arch", cat: "ENGINEERING", name: "Setlist Narrative Architect", status: "READY", desc: "Ingenieria de la narrativa emocional del show." },
    { id: "shark-mind", cat: "AUTHORITY", name: "Shark Mindset Audit", status: "READY", desc: "Evaluacion de mentalidad empresarial para artistas." },
    { id: "map-builder", cat: "STRATEGY", name: "Map Builder de Industria", status: "READY", desc: "Mapeo de stakeholders y aliados estrategicos." },
    { id: "waybill", cat: "OPS", name: "Detailed Waybill Team", status: "READY", desc: "Hoja de ruta tecnica para equipos de produccion." },
  ];

  const filteredTools = filter === "ALL" ? tools : tools.filter(t => t.cat === filter);

  return (
    <div className="bg-[#050505] text-white min-h-screen font-mono selection:bg-[#d4af37]/30">
      <header className="border-b border-white/5 bg-[#0a0c10]/80 backdrop-blur-md sticky top-0 z-50 p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/command-center">
            <button className="text-gray-500 hover:text-white transition-colors p-2"><ArrowLeft size={20} /></button>
          </Link>
          <h1 className="text-xs font-bold tracking-[0.3em] uppercase text-white/50">EAR OS · TOOLKIT HUB · V1.0</h1>
        </div>
        <div className="flex items-center gap-2 bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/20">
          <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-[#d4af37] tracking-widest uppercase">70 Modules Loaded</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <h2 className="text-4xl font-bold tracking-tighter mb-2 uppercase">Arsenal de <span className="text-[#d4af37]">Alta Ingenieria</span></h2>
            <p className="text-gray-500 text-sm">Selecciona una herramienta para iniciar el despliegue tactico.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${filter === cat.id ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, index) => (
              <motion.div 
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-[#0a0c10] border border-white/5 rounded-2xl p-6 hover:border-[#d4af37]/30 transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 rounded-xl bg-white/5 group-hover:bg-[#d4af37]/10 transition-colors">
                    <Zap className="text-gray-500 group-hover:text-[#d4af37]" size={20} />
                  </div>
                  <span className="text-[9px] font-black bg-white/5 px-2 py-1 rounded text-gray-500 uppercase tracking-tighter">{tool.cat}</span>
                </div>
                
                <h3 className="text-lg font-bold mb-2 group-hover:text-[#d4af37] transition-colors uppercase tracking-tight">{tool.name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-8">{tool.desc}</p>
                
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{tool.status}</span>
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover:text-white transition-colors flex items-center gap-2">
                    Desplegar <Rocket size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Tarjeta de Relleno para los 60 restantes */}
          <div className="bg-[#0a0c10]/40 border border-white/5 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-40">
            <Filter className="text-gray-700 mb-4" size={32} />
            <p className="text-[10px] text-gray-700 uppercase tracking-[0.3em] font-bold">+60 Modulos Adicionales en Indexacion</p>
          </div>
        </div>
      </main>

      <footer className="py-20 text-center border-t border-white/5 text-[10px] text-gray-700 font-mono tracking-widest uppercase">
        EAR OS · TOOLKIT INFRASTRUCTURE · 2026.03.17.STITCH_FUSION
      </footer>
    </div>
  );
};

export default ToolkitHubSClass;