"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { HunterCockpit } from "@/modules/HunterEngine/HunterCockpit";
import { BudgetPredictor } from "@/modules/AstraEngine/components/tools/BudgetPredictor";

/**
 * 🛰️ MODULE: VALHALLA WORKSTATION (EAR OS OMEGA)
 * Fuses the CEO Vault, B2B Wedding Cockpit, Fleet HUD, and Bespoke Configurator.
 * High-fidelity fake data for UI representation before API integration.
 */

export default function SystemCockpitSClass() {
  const [activeTab, setActiveTab] = useState<"ceo" | "eventos" | "vimume" | "artistas">("ceo");
  const [systemUptime, setSystemUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSystemUptime((p) => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const TabButton = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-4 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-widest transition-all ${
        activeTab === id
          ? "bg-[#d4af37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] font-bold scale-105"
          : "bg-zinc-900/50 text-zinc-500 hover:text-[#d4af37] hover:bg-zinc-800"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="text-white font-sans selection:bg-[#d4af37] selection:text-black">

      {/* 🟢 TOP NAV BAR / HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 text-[#d4af37] mb-2">
            <Icons.Layers className="w-5 h-5 shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase font-mono text-zinc-400">UNIFICACIÓN S-CLASS v3.0</span>
          </div>
          <h1 className="text-4xl font-bold font-display tracking-tighter">
            VALHALLA <span className="text-zinc-600">UNIFIED DASHBOARD</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-900/40 p-2 rounded-lg border border-white/5">
          <TabButton id="ceo" icon={Icons.Shield} label="Modo Dios" />
          <TabButton id="eventos" icon={Icons.Calendar} label="Eventos & Fleet" />
          <TabButton id="vimume" icon={Icons.Activity} label="Impacto VIMUME" />
          <TabButton id="artistas" icon={Icons.Mic2} label="Artistas & IP" />
        </div>

        <div className="text-right hidden lg:block">
          <div className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37]">Incubadora Despegue Active</div>
          <div className="text-xl font-mono text-zinc-300">
            {Math.floor(systemUptime / 3600)}H : {Math.floor((systemUptime % 3600) / 60)}M : {systemUptime % 60}S
          </div>
        </div>
      </header>

      {/* 🔵 CONTENT AREA */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {activeTab === "ceo" && <CeoVaultTab />}
          {activeTab === "eventos" && (
            <div className="space-y-12">
               <B2BWeddingTab />
               <div className="h-px bg-white/5" />
               <FleetHudTab />
               <div className="h-px bg-white/5" />
               <HunterCockpit />
            </div>
          )}
          {activeTab === "vimume" && <VIMUMEImpactTab />}
          {activeTab === "artistas" && <MariachiConfigTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* =====================================
   1. CEO VAULT (BÓVEDA DE SOBERANÍA)
======================================== */
function CeoVaultTab() {
  const kpis = [
    { title: "Volumen Desplegado (YTD - Acumulado Anual)", val: "1.245.800 €", trend: "+14.5%", icon: Icons.DollarSign },
    { title: "Valoración S-Class (S-Class Valuation)", val: "2.850.000 €", trend: "Objetivo", icon: Icons.TrendingUp },
    { title: "Gemelos Digitales (Fincas)", val: "145", trend: "+12", icon: Icons.MapPin },
    { title: "Índice Fricción Cero", val: "99.2%", trend: "S-Class", icon: Icons.ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((k, i) => (
          <div key={i} className="bg-zinc-900/30 p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#d4af37]/30 transition-all">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <k.icon className="w-5 h-5 text-zinc-500 group-hover:text-[#d4af37] transition-colors" />
              <span className="text-[9px] font-mono tracking-wider font-bold uppercase text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                {k.trend}
              </span>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest relative z-10">{k.title}</div>
            <div className="text-2xl lg:text-3xl font-bold font-mono text-white mt-1 relative z-10">{k.val}</div>
            {/* Glow effect */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#d4af37]/10 blur-2xl group-hover:bg-[#d4af37]/20 transition-all" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-zinc-900/20 border border-white/5 rounded-3xl p-8 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-xl flex items-center gap-2"><Icons.BarChart2 className="text-[#d4af37]" /> Proyección de Dominancia</h3>
             <span className="text-xs bg-[#d4af37]/10 text-[#d4af37] px-3 py-1 rounded-full uppercase tracking-wider font-mono border border-[#d4af37]/20">Análisis Q1-Q4</span>
          </div>
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 font-mono text-sm border border-dashed border-zinc-800 rounded-xl bg-black/50 p-6">
             <Icons.Activity className="w-12 h-12 text-zinc-700 mb-4" />
             [ Renderizado de Gráficas Financieras PostHog / Clarity Pendiente ]
             <span className="text-[10px] text-zinc-600 mt-2 block">Motor de Ingestión Analítica en Standby</span>
          </div>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4"><Icons.Cpu className="text-zinc-700 opacity-20 w-32 h-32 blur-md" /></div>
           <h3 className="font-bold text-xl flex items-center gap-2 mb-6 relative z-10"><Icons.ShieldAlert className="text-red-500" /> Alertas Tácticas</h3>
           <div className="space-y-4 relative z-10">
              {[
                { time: "10:45 AM", msg: "Anomalía masiva Bodas.net detectada. Modo Vampiro autorizando extracción S-Class.", level: "high" },
                { time: "09:12 AM", msg: "Nuevo Lead de Alto Valor capturado en Marbella. Fricción cero aplicada.", level: "low" },
                { time: "Ayer", msg: "Bloque VeriFactu generado: Encriptación fiscal y cierre contable sellados.", level: "info" }
              ].map((a, i) => (
                 <div key={i} className="flex gap-4 items-start p-4 bg-black/60 rounded-xl border border-white/5 backdrop-blur-md hover:bg-black/80 transition-colors cursor-default">
                    <div className={`w-2 h-2 mt-1.5 rounded-full shadow-[0_0_10px] ${a.level === 'high' ? 'bg-red-500 shadow-red-500' : a.level === 'info' ? 'bg-blue-500 shadow-blue-500' : 'bg-green-500 shadow-green-500'}`} />
                    <div>
                       <div className="text-[9px] text-[#d4af37] font-mono mb-1">{a.time}</div>
                       <div className="text-sm text-zinc-300 leading-relaxed">{a.msg}</div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================
   2. B2B WEDDING COCKPIT (BLINDAJE DE EVENTOS)
======================================== */
function B2BWeddingTab() {
  const upcomingWeddings = [
    { id: "OP-893", couple: "Sofía & Alejandro", venue: "Finca Cortesín", status: "Briefing Táctico", tier: "Ultra-Premium" },
    { id: "OP-894", couple: "Elena & David", venue: "Hotel Alfonso XIII", status: "Producción", tier: "Gold-Class (Gama Oro)" },
    { id: "OP-895", couple: "Carmen & Luis", venue: "Hacienda San José", status: "Ejecución Inminente", tier: "S-Class (Clase S)" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-zinc-900/30 border border-[#d4af37]/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(212,175,55,0.05)] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 blur-[100px] pointer-events-none" />
           <div className="flex justify-between items-center mb-8 relative z-10">
             <div>
                <h3 className="font-bold text-2xl flex items-center gap-2"><Icons.Crosshair className="text-[#d4af37]" /> Radar de Blindaje B2B</h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">Pipeline en tiempo real de cuentas VIP. Fricción cero.</p>
             </div>
             <button className="bg-[#d4af37] text-black px-6 py-3 font-bold font-mono text-[10px] rounded hover:scale-105 transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] uppercase">
               + Desplegar Cobertura
             </button>
           </div>
           
           <div className="space-y-4 relative z-10">
              {upcomingWeddings.map(w => (
                <div key={w.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-[#d4af37]/50 transition-colors cursor-pointer group gap-4">
                   <div className="flex items-center gap-4">
                     <div className="bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center text-[#d4af37] font-bold font-mono text-xs group-hover:bg-[#d4af37] group-hover:text-black transition-colors shadow-inner">
                        {w.id}
                     </div>
                     <div>
                        <div className="font-bold text-lg text-white group-hover:text-[#d4af37] transition-colors">{w.couple}</div>
                        <div className="text-xs text-zinc-500 flex items-center gap-1 font-mono uppercase mt-1"><Icons.MapPin className="w-3 h-3 text-zinc-600" /> {w.venue}</div>
                     </div>
                   </div>
                   <div className="flex items-center gap-6 justify-between sm:justify-end border-t border-white/5 sm:border-t-0 pt-4 sm:pt-0">
                     <div className="text-left sm:text-right">
                        <div className="text-[10px] uppercase tracking-widest text-[#d4af37] font-black mb-1">Nivel {w.tier}</div>
                        <div className="text-sm font-medium text-zinc-300 bg-white/5 px-3 py-1 rounded inline-block">{w.status}</div>
                     </div>
                     <Icons.ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-[#d4af37] transform group-hover:translate-x-1 transition-all" />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="space-y-6">
         <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
            <h4 className="font-bold uppercase tracking-widest text-xs font-mono text-zinc-400 mb-6 flex items-center gap-2"><Icons.Radar className="w-4 h-4 text-red-500" /> Radar Vampiro</h4>
            <div className="flex justify-between items-center bg-black/50 p-4 rounded-xl mb-3 border border-white/5">
               <span className="text-sm text-zinc-300">Posicionamiento Bodas.net</span>
               <span className="text-[#d4af37] font-bold font-mono">#1 (Top 1%)</span>
            </div>
            <div className="flex justify-between items-center bg-black/50 p-4 rounded-xl mb-3 border border-white/5">
               <span className="text-sm text-zinc-300">Entidades Hakeadas</span>
               <span className="text-red-400 font-bold font-mono">8.420 Nodos</span>
            </div>
            <div className="flex justify-between items-center bg-black/50 p-4 rounded-xl border border-white/5">
               <span className="text-sm text-zinc-300">Reputación Táctica</span>
               <span className="text-green-500 font-bold font-mono text-shadow-sm shadow-green-500">5.0 / 5.0</span>
            </div>
         </div>
         <div className="bg-gradient-to-br from-[#d4af37] to-[#8a7222] p-8 rounded-3xl text-black shadow-[0_0_40px_rgba(212,175,55,0.3)] relative overflow-hidden group">
            <Icons.Layers className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-10">
               <h4 className="font-black text-2xl uppercase tracking-tighter leading-none mb-3">Póliza de Garantía</h4>
               <p className="text-sm font-semibold opacity-80 mb-8 font-mono">Traspasa el 100% de la responsabilidad operativa. Cero estrés.</p>
               <button className="w-full py-4 bg-black text-[#d4af37] font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-zinc-900 transition-colors shadow-2xl flex items-center justify-center gap-2">
                  <Icons.FileText className="w-4 h-4" />
                  Emitir Póliza PDF
               </button>
            </div>
         </div>
      </div>

      {/* 🔮 HERRAMIENTA DE PREDICCIÓN TÁCTICA */}
      <div className="bg-zinc-900/40 border border-[#d4af37]/10 rounded-3xl overflow-hidden mt-8 shadow-2xl">
         <div className="p-10">
            <div className="flex items-center gap-3 mb-8">
               <Icons.BrainCircuit className="text-[#d4af37] w-8 h-8" />
               <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">Predictor Presupuestario AI</h3>
                  <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Algoritmo S-Class v2.5 // Auditoría de Escenarios</p>
               </div>
            </div>
            <div className="bg-black/40 rounded-3xl border border-white/5 p-4">
               <BudgetPredictor onComplete={() => console.log('Simulación completada')} />
            </div>
         </div>
      </div>
    </div>
  );
}

/* =====================================
   3. FLEET & OPS TRACKER (LÓGICA UBER)
======================================== */
function FleetHudTab() {
  const units = [
    { id: "ALPHA-01", type: "Transporte Pesado", driver: "Carlos V.", status: "En Despliegue", loc: "Sevilla Center" },
    { id: "SONIC-04", type: "Artillería Acústica", driver: "Miguel T.", status: "Intervenido", loc: "Hacienda Monasterio" },
    { id: "LUMEN-02", type: "Estructuras LED", driver: "Ana R.", status: "Standby", loc: "HQ Warehouse" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      <div className="lg:col-span-1 space-y-4 bg-zinc-900/20 p-6 rounded-3xl border border-white/5">
         <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#d4af37] mb-6 flex items-center gap-2"><Icons.Activity className="w-4 h-4" /> Arsenal en Campo</h4>
         {units.map(u => (
            <div key={u.id} className="bg-black/40 p-4 rounded-xl border border-white/5 border-l-2 border-l-[#d4af37] hover:bg-zinc-800/50 cursor-pointer transition-colors">
               <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-white font-mono text-xs tracking-wider">{u.id}</span>
                  <span className={`text-[8px] uppercase font-black px-2 py-1 rounded tracking-widest ${u.status === 'Intervenido' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : u.status === 'En Despliegue' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'}`}>
                     En Espera (Standby)
                  </span>
               </div>
               <div className="text-xs font-bold text-zinc-300 uppercase mb-1">{u.type}</div>
               <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1"><Icons.MapPin className="w-3 h-3" /> {u.loc}</div>
            </div>
         ))}
      </div>
      <div className="lg:col-span-3 bg-zinc-900/10 border border-white/5 rounded-3xl relative overflow-hidden flex items-center justify-center min-h-[500px]">
         {/* Fake Mapbox aesthetic */}
         <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Madrid,Spain&zoom=6&size=800x600&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x746855&style=feature:administrative.locality|element:labels.text.fill|color:0xd59563&style=feature:water|element:geometry|color:0x17263c')] opacity-20 bg-cover bg-center mix-blend-luminosity grayscale" />
         <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#050505] opacity-90" />
         
         <div className="relative z-10 text-center flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#d4af37] blur-3xl opacity-20 animate-pulse" />
              <Icons.Satellite className="w-20 h-20 text-[#d4af37] mb-6 relative z-10" />
            </div>
            <h3 className="font-mono text-2xl uppercase tracking-[0.2em] text-white">Telemetría Satelital</h3>
            <p className="text-xs text-[#d4af37] font-mono mt-3 uppercase tracking-widest bg-[#d4af37]/10 px-4 py-2 rounded-full border border-[#d4af37]/20">Procesando GPS Locks...</p>
         </div>
         
         <div className="absolute bottom-6 left-6 text-xs font-mono text-zinc-500 bg-black/80 px-4 py-2 rounded-lg border border-white/5">
            Protocolo Fantasma: Activo
         </div>
      </div>
    </div>
  );
}

/* =====================================
   4. BESPOKE CONFIGURATOR (LA PROPIEDAD INTELECTUAL)
======================================== */
function MariachiConfigTab() {
  const [size, setSize] = useState(5);
  const [hours, setHours] = useState(1);
  const [addon, setAddon] = useState<string | null>(null);

  // Precios con anclaje S-Class
  const basePrice = 1500; // Ticket mínimo de acceso a la marca
  const sizeMultiplier = size * 150;
  const timeMultiplier = hours * 1.8;
  const addonPrice = addon === 'ballet' ? 600 : addon === 'horses' ? 1200 : 0;
  // Algoritmo de cálculo S-Class
  const total = (basePrice + sizeMultiplier) * timeMultiplier + addonPrice;

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full">
      <div className="flex-1 space-y-8 bg-zinc-900/20 border border-white/5 p-8 sm:p-10 rounded-3xl">
         
         {/* Cabecera del configurador */}
         <div className="mb-10 text-center sm:text-left">
           <h3 className="font-display font-bold text-3xl sm:text-4xl text-[#d4af37] mb-2 tracking-tighter">Configurador Personalizado (Bespoke Configurator)</h3>
           <p className="text-sm font-mono text-zinc-400">Modela el impacto emocional. Sin negociaciones a la baja.</p>
         </div>

         <div>
            <h3 className="font-bold text-xl flex items-center gap-3 mb-2 text-white uppercase tracking-widest"><Icons.Users2 className="text-[#d4af37] w-5 h-5" /> Ensamble Artístico</h3>
            <p className="text-xs text-zinc-500 font-mono mb-6">Mensajeros de Sentimientos (Mínimo protocolo de cuarteto)</p>
            <div className="flex flex-wrap items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
               <button onClick={() => setSize(Math.max(4, size - 1))} className="p-4 bg-zinc-800 rounded-xl hover:bg-zinc-700 hover:text-[#d4af37] transition-colors"><Icons.Minus className="w-5 h-5" /></button>
               <div className="text-5xl font-mono font-black w-20 text-center text-[#d4af37] drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">{size}</div>
               <button onClick={() => setSize(Math.min(13, size + 1))} className="p-4 bg-zinc-800 rounded-xl hover:bg-zinc-700 hover:text-[#d4af37] transition-colors"><Icons.Plus className="w-5 h-5" /></button>
               <span className="text-xs font-mono text-zinc-500 ml-2 uppercase tracking-widest bg-white/5 px-3 py-1 rounded">Élite Hispana</span>
            </div>
         </div>

         <div className="border-t border-white/5 pt-8">
            <h3 className="font-bold text-xl flex items-center gap-3 mb-6 text-white uppercase tracking-widest"><Icons.Clock className="text-[#d4af37] w-5 h-5" /> Duración de la Experiencia</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {[1, 2, 3, 4].map(h => (
                  <button 
                    key={h} 
                    onClick={() => setHours(h)}
                    className={`flex-1 py-5 font-mono font-bold text-lg rounded-xl border transition-all ${hours === h ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-105' : 'bg-black/50 border-zinc-800 text-zinc-400 hover:border-[#d4af37]/50 hover:text-white'}`}
                  >
                     {h} HORAS (HR)
                  </button>
               ))}
            </div>
         </div>

         <div className="border-t border-white/5 pt-8">
            <h3 className="font-bold text-xl flex items-center gap-3 mb-6 text-white uppercase tracking-widest"><Icons.Sparkles className="text-[#d4af37] w-5 h-5" /> Propiedad Intelectual</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <button 
                  onClick={() => setAddon(addon === 'ballet' ? null : 'ballet')}
                  className={`p-6 rounded-2xl border text-left flex justify-between items-center transition-all ${addon === 'ballet' ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]' : 'border-zinc-800 bg-black/50 hover:border-zinc-600'}`}
               >
                  <div>
                     <div className={`font-bold text-lg mb-1 ${addon === 'ballet' ? 'text-[#d4af37]' : 'text-white'}`}>Ballet Folclórico</div>
                     <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Coreografía de Autor</div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${addon === 'ballet' ? 'border-[#d4af37] bg-[#d4af37]' : 'border-zinc-600'}`}>
                     {addon === 'ballet' && <Icons.Check className="w-4 h-4 text-black" />}
                  </div>
               </button>
               <button 
                  onClick={() => setAddon(addon === 'horses' ? null : 'horses')}
                  className={`p-6 rounded-2xl border text-left flex justify-between items-center transition-all ${addon === 'horses' ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]' : 'border-zinc-800 bg-black/50 hover:border-zinc-600'}`}
               >
                  <div>
                     <div className={`font-bold text-lg mb-1 ${addon === 'horses' ? 'text-[#d4af37]' : 'text-white'}`}>Entrada Ecuestre</div>
                     <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Caballos Españoles P.R.E.</div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${addon === 'horses' ? 'border-[#d4af37] bg-[#d4af37]' : 'border-zinc-600'}`}>
                     {addon === 'horses' && <Icons.Check className="w-4 h-4 text-black" />}
                  </div>
               </button>
            </div>
         </div>
      </div>

      <div className="xl:w-[420px] bg-gradient-to-br from-[#111] to-[#000] border border-[#d4af37]/30 text-white p-8 sm:p-10 rounded-3xl flex flex-col justify-between shadow-[0_0_50px_rgba(212,175,55,0.1)] relative overflow-hidden group">
         <div className="absolute inset-0 bg-[#d4af37]/5 blur-[80px] pointer-events-none" />
         
         <div className="relative z-10">
            <h3 className="font-display font-black text-2xl uppercase tracking-widest mb-2 text-[#d4af37]">El Legado</h3>
            <p className="text-xs font-mono text-zinc-500 mb-8 border-b border-white/10 pb-6 uppercase tracking-widest">Protocolo Diamante Rojo</p>
            
            <div className="space-y-5 font-mono text-xs text-zinc-300">
               <div className="flex justify-between items-end">
                 <span className="uppercase tracking-widest">Acceso Marca EAR</span>
                 <span className="text-white font-bold">{basePrice.toLocaleString()} €</span>
               </div>
               <div className="flex justify-between items-end border-b border-white/5 pb-4">
                 <span className="uppercase tracking-widest">Talento Élite ({size})</span>
                 <span className="text-white font-bold">+ {sizeMultiplier.toLocaleString()} €</span>
               </div>
               <div className="flex justify-between items-end pt-2 text-[#d4af37]">
                 <span className="uppercase tracking-widest">Multiplicador Tiempo ({hours}H)</span>
                 <span className="font-bold">x {timeMultiplier.toLocaleString()}</span>
               </div>
               {addon && (
                 <div className="flex justify-between items-end text-green-400 bg-green-400/10 p-3 rounded-lg mt-4 border border-green-400/20">
                   <span className="uppercase tracking-widest flex items-center gap-2"><Icons.PlusCircle className="w-3 h-3" /> Impacto Especial</span>
                   <span className="font-bold">+ {addonPrice.toLocaleString()} €</span>
                 </div>
               )}
            </div>
         </div>
         
         <div className="relative z-10 mt-12 bg-black/60 p-6 rounded-2xl border border-white/5">
            <div className="text-center mb-6">
               <div className="text-[10px] flex items-center justify-center gap-2 uppercase font-black tracking-[0.3em] text-zinc-500 mb-2">
                 <Icons.Lock className="w-3 h-3 text-[#d4af37]" /> Inversión Blindada
               </div>
               <div className="text-5xl font-black font-display tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
                 {Math.floor(total).toLocaleString()} <span className="text-[#d4af37]">€</span>
               </div>
            </div>
            <button className="w-full relative overflow-hidden group/btn bg-[#d4af37] text-black py-5 uppercase tracking-widest font-black text-xs transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] rounded-xl">
               <span className="relative z-10 flex items-center justify-center gap-2">
                 Emitir Contrato Inteligente <Icons.ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
               </span>
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            </button>
            <p className="text-center text-[9px] font-mono text-zinc-600 uppercase mt-4 tracking-widest">VeriFactu Compatible • Impuestos No Incluidos</p>
         </div>

         <Icons.Diamond className="absolute -bottom-10 -left-10 w-64 h-64 text-[#d4af37] opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-1000 pointer-events-none" />
      </div>
    </div>
  );
}

/* =====================================
   5. VIMUME IMPACT (VIAJE MUSICAL POR LA MEMORIA)
======================================== */
function VIMUMEImpactTab() {
  const therapySessions = [
    { id: "V-201", patient: "Residencia Santa Clara", therapy: "Reminiscencia Activa", improvement: "+24%", date: "Hoy" },
    { id: "V-202", patient: "Centro Alzheimer Málaga", therapy: "Estimulación Rítmica", improvement: "+18%", date: "Ayer" },
    { id: "V-203", patient: "Fundación Memoria", therapy: "Danza-Terapia", improvement: "+30%", date: "Hace 2 días" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-zinc-900/30 border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
          <h3 className="font-bold text-2xl flex items-center gap-2 mb-6">
            <Icons.Activity className="text-emerald-400" /> Monitor de Impacto Cognitivo
          </h3>
          <div className="space-y-4">
            {therapySessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 font-bold font-mono text-xs">
                    {s.id}
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">{s.patient}</div>
                    <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest">{s.therapy}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold font-mono">{s.improvement} Mejora</div>
                  <div className="text-[10px] text-zinc-600 font-mono uppercase">{s.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-950/20 border border-emerald-500/10 rounded-3xl p-8">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-emerald-400">
            <Icons.HeartPulse className="w-5 h-5" /> Neuro-Métricas Globales
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[ 
              { label: "Pacientes Activos", val: "1.240" },
              { label: "Sesiones Realizadas", val: "15.890" },
              { label: "Índice de Felicidad", val: "94.8%" }
            ].map((m, i) => (
              <div key={i} className="bg-black/40 p-6 rounded-2xl text-center border border-white/5">
                <div className="text-2xl font-black font-mono text-white mb-1">{m.val}</div>
                <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <Icons.Music className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
          <h4 className="font-black text-2xl uppercase tracking-tighter mb-2">Protocolo VIMUME</h4>
          <p className="text-sm opacity-80 mb-6 font-mono uppercase tracking-widest">Tecnología S-Class al servicio del alma.</p>
          <button className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-zinc-900 transition-all flex items-center justify-center gap-2">
            Ver Reporte de Impacto
          </button>
        </div>

        <div className="bg-zinc-800/20 border border-white/5 p-6 rounded-3xl">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 flex items-center gap-2">
            <Icons.Database className="w-4 h-4" /> Bóveda de Evidencia
          </h4>
          <div className="space-y-2">
            <button className="w-full p-4 bg-black/40 hover:bg-black/60 rounded-xl border border-white/5 text-left text-xs font-mono text-zinc-400 hover:text-white transition-all flex justify-between items-center group">
              <span>ESTUDIO_CLINICO_2025.PDF</span>
              <Icons.Download className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
            </button>
            <button className="w-full p-4 bg-black/40 hover:bg-black/60 rounded-xl border border-white/5 text-left text-xs font-mono text-zinc-400 hover:text-white transition-all flex justify-between items-center group">
              <span>DATABASE_PACIENTES_V0.1.JSON</span>
              <Icons.Lock className="w-4 h-4 opacity-40" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
