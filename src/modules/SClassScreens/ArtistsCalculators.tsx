'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  MessageSquare, 
  ShieldAlert, 
  Zap, 
  DollarSign, 
  Users, 
  BarChart3, 
  Activity, 
  Layers,
  Sparkles,
  Star,
  ArrowRight,
  ChevronRight,
  Play,
  Share2,
  Lock,
  PieChart,
  LineChart,
  Eye,
  Type,
  Mic,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { GLASS_STYLE, GOLD_HUD_STYLE } from '@/lib/dna/theme';

/**
 * 🛰️ MODULE: ARTISTS CALCULATORS (S-Class v3.0)
 * Financial Engineering & Narrative Validation for Artists.
 * Part of Bloque E: Tools & Calculators System.
 */

// --- TYPES ---
type ToolId = 'cache' | 'opal' | 'pitch' | 'narrative' | 'objection';

interface CacheData {
  spotifyMonthly: number;
  instagramFollowers: number;
  ticketHistory: number;
  venueCapacity: number;
  location: string;
}

interface OpalResult {
  month: number;
  revenue: number;
  fans: number;
  investment: number;
}

// --- SUB-COMPONENTS ---

/**
 * 1. CACHE CALCULATOR & ROI PREDICTOR
 */
const CacheCalculator = () => {
  const [data, setData] = useState<CacheData>({
    spotifyMonthly: 500000,
    instagramFollowers: 250000,
    ticketHistory: 1500,
    venueCapacity: 2000,
    location: 'Europa / Latam'
  });

  const calculateCache = () => {
    const base = (data.spotifyMonthly * 0.05) + (data.instagramFollowers * 0.1);
    const multiplier = data.location === 'Europa / Latam' ? 1.5 : 1.2;
    const capacityFactor = data.venueCapacity * 0.8;
    return Math.round((base + capacityFactor) * multiplier);
  };

  const calculateROI = () => {
    const cost = calculateCache();
    const tickets = data.venueCapacity * 0.85 * 35; // 85% occupancy @ 35 avg price
    const bars = tickets * 0.4; // Drink spend
    return {
      revenue: Math.round(tickets + bars),
      margin: Math.round(((tickets + bars) - cost) / (tickets + bars) * 100),
      multiplier: ((tickets + bars) / cost).toFixed(2)
    };
  };

  const results = calculateROI();

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* INPUTS */}
        <div className={`p-8 md:p-12 rounded-[3rem] ${GLASS_STYLE} ${GOLD_HUD_STYLE} border border-white/5 space-y-8`}>
          <div className="space-y-2">
            <span className="text-gold-500 text-[10px] font-black uppercase tracking-[0.4em]">Inferencia de Datos</span>
            <h3 className="text-3xl font-black uppercase tracking-tighter">Parámetros Técnicos</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Spotify (Oyentes Mensuales)</label>
                <span className="text-xl font-black gold-text">{data.spotifyMonthly.toLocaleString()}</span>
              </div>
              <input 
                type="range" min="1000" max="5000000" step="10000"
                value={data.spotifyMonthly}
                onChange={(e) => setData({...data, spotifyMonthly: Number(e.target.value)})}
                className="w-full accent-gold-500 bg-white/5 h-1.5 rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">IG Followers</label>
                <span className="text-xl font-black gold-text">{data.instagramFollowers.toLocaleString()}</span>
              </div>
              <input 
                type="range" min="1000" max="1000000" step="5000"
                value={data.instagramFollowers}
                onChange={(e) => setData({...data, instagramFollowers: Number(e.target.value)})}
                className="w-full accent-gold-500 bg-white/5 h-1.5 rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Aforo Recinto</label>
                <input 
                  type="number"
                  value={data.venueCapacity}
                  onChange={(e) => setData({...data, venueCapacity: Number(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xl font-black focus:border-[#ecb613]/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Región Geográfica</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-black uppercase outline-none"
                  value={data.location}
                  onChange={(e) => setData({...data, location: e.target.value})}
                >
                  <option>Europa / Latam</option>
                  <option>USA / Asia</option>
                  <option>Resto del Mundo</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS HUD */}
        <div className="flex flex-col gap-6">
          <div className={`p-8 md:p-12 rounded-[3rem] bg-gold-500/10 border border-gold-500/20 flex flex-col justify-center items-center text-center space-y-4`}>
             <span className="text-gold-500 text-[10px] font-black uppercase tracking-[0.6em]">Caché Técnico Estimado</span>
             <h2 className="text-6xl md:text-8xl font-black tracking-tighter gold-text">
               €{calculateCache().toLocaleString()}
             </h2>
             <p className="text-xs text-white/40 font-medium italic">Margen de Error: +/- 12% basado en análisis Pollstar/Chartmetric</p>
          </div>

          <div className="grid grid-cols-2 gap-6 h-full">
             <div className={`p-8 rounded-[2.5rem] ${GLASS_STYLE} border border-white/5 flex flex-col justify-between`}>
                <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">ROI Multiplier</span>
                <div>
                   <p className="text-4xl font-black gold-text">x{results.multiplier}</p>
                   <p className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Revenue Efficiency</p>
                </div>
             </div>
             <div className={`p-8 rounded-[2.5rem] ${GLASS_STYLE} border border-green-500/20 flex flex-col justify-between`}>
                <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">Gross Profitability</span>
                <div>
                   <p className="text-4xl font-black text-green-500">{results.margin}%</p>
                   <p className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Projected Net Margin</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. OPAL SIMULATOR (12-MONTH REVENUE)
 */
const OpalSimulator = () => {
  const [monthlySpend, setMonthlySpend] = useState(2500);
  const [growthMode, setGrowthMode] = useState<'conservative' | 'aggressive' | 'viral'>('aggressive');

  const generateData = (): OpalResult[] => {
    let currentFans = 50000;
    let baseRevenue = 1200;
    
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const multiplier = growthMode === 'conservative' ? 1.05 : growthMode === 'aggressive' ? 1.15 : 1.4;
      currentFans = Math.round(currentFans * multiplier);
      baseRevenue = Math.round(baseRevenue * (multiplier * 1.1));
      
      return {
        month,
        revenue: baseRevenue + (monthlySpend * (multiplier - 1)),
        fans: currentFans,
        investment: monthlySpend
      };
    });
  };

  const timeline = generateData();
  const maxRev = Math.max(...timeline.map(d => d.revenue));

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="space-y-4">
          <h3 className="text-4xl font-black uppercase tracking-tighter">Proyección OPAL 12M</h3>
          <p className="text-white/30 italic font-medium">Modelando el crecimiento de activos musicales recurrentes.</p>
        </div>
        
        <div className="flex gap-4 p-2 bg-white/5 rounded-2xl border border-white/10">
          {(['conservative', 'aggressive', 'viral'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setGrowthMode(mode)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${growthMode === mode ? 'bg-gold-500 text-black' : 'text-white/40 hover:text-white'}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className={`p-8 md:p-16 rounded-[4rem] ${GLASS_STYLE} border border-white/5`}>
        <div className="h-80 w-full flex items-end gap-2 md:gap-4 overflow-hidden pt-12">
          {timeline.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
              <div className="relative w-full flex flex-col items-center justify-end h-full">
                {/* REVENUE BAR */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.revenue / maxRev) * 100}%` }}
                  className="w-full bg-gradient-to-t from-gold-500/20 to-gold-500 rounded-t-lg relative group-hover:brightness-125 transition-all"
                >
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/10 px-3 py-1 rounded text-[10px] font-black pointer-events-none whitespace-nowrap">
                      €{d.revenue.toLocaleString()}
                   </div>
                </motion.div>
                {/* INVESTMENT SUB-BAR */}
                <div 
                  className="w-full bg-white/10 absolute bottom-0 z-0" 
                  style={{ height: `${(d.investment / maxRev) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-white/20 uppercase">M{d.month}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-12">
           <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Anual Gross</p>
              <p className="text-4xl font-black gold-text font-cinzel">€{timeline.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}</p>
           </div>
           <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Total Reach</p>
              <p className="text-4xl font-black text-white font-cinzel">{timeline[11].fans.toLocaleString()}</p>
           </div>
           <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Efficiency Index</p>
              <p className="text-4xl font-black text-green-500 font-cinzel">S-CLASS 9.2</p>
           </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. PITCH EDITOR (NARRATIVE VALIDATION)
 */
const PitchEditor = () => {
  const [text, setText] = useState('Mi propuesta musical se basa en la fusión de ritmos ancestrales con diseño sonoro de vanguardia...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getMetrics = () => {
    const words = text.split(/\s+/).filter(x => x).length;
    const wpm = 140; // Avg speaking speed
    const duration = (words / wpm) * 60;
    const powerWords = (text.match(/exclusivo|único|revolucionario|impacto|premium|legado/gi) || []).length;
    
    return {
      words,
      duration: Math.round(duration),
      powerWords,
      clarity: text.length > 50 ? 88 : 45
    };
  };

  const metrics = getMetrics();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-500">Script de Narrativa de Venta</label>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/20">
             <Mic size={12} className="text-red-500 animate-pulse" /> Live Analysis Active
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`w-full h-[500px] p-12 text-xl md:text-2xl font-medium leading-relaxed bg-black/40 border border-white/5 rounded-[3rem] outline-none focus:border-[#ecb613]/30 transition-all resize-none placeholder:text-white/5`}
          placeholder="Escribe aquí tu pitch de artista..."
        />
      </div>

      <div className="space-y-6">
         <div className={`p-10 rounded-[2.5rem] ${GLASS_STYLE} border border-white/5 space-y-8`}>
            <h4 className="text-xl font-black uppercase tracking-tighter">Narrative Health</h4>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                     <span className="text-white/40">Duración (Seg)</span>
                     <span className={metrics.duration > 120 ? 'text-red-500' : 'text-green-500'}>{metrics.duration}s</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div className="h-full bg-gold-500" animate={{ width: `${Math.min(100, (metrics.duration / 120) * 100)}%` }} />
                  </div>
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                     <span className="text-white/40">Power Words</span>
                     <span className="gold-text">{metrics.powerWords}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div className="h-full bg-gold-500" animate={{ width: `${(metrics.powerWords / 10) * 100}%` }} />
                  </div>
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                     <span className="text-white/40">Technical Clarity</span>
                     <span className="text-gold-500">{metrics.clarity}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div className="h-full bg-gold-500" animate={{ width: `${metrics.clarity}%` }} />
                  </div>
               </div>
            </div>

            <button className="w-full py-6 bg-gold-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 group">
               <Zap size={14} className="group-hover:animate-bounce" /> Validar con IA Forense
            </button>
         </div>

         <div className={`p-8 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 space-y-4`}>
            <div className="flex items-center gap-3 text-indigo-400">
               <ShieldAlert size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">IA Insight</span>
            </div>
            <p className="text-sm text-white/50 italic leading-relaxed">
               "Tu introducción es demasiado larga. El gancho (Hook) debería aparecer en los primeros 12 segundos para maximizar la retención."
            </p>
         </div>
      </div>
    </div>
  );
};

/**
 * 4. NARRATIVE ARCHITECT (ENGAGEMENT HEATMAP)
 */
const NarrativeArchitect = () => {
  return (
     <div className="space-y-12">
        <div className="flex items-center justify-between">
           <div className="space-y-2">
              <span className="text-gold-500 text-[10px] font-black uppercase tracking-[0.4em]">Visual Show Architect</span>
              <h3 className="text-4xl font-black uppercase tracking-tighter">Mapa Térmico de Engagement</h3>
           </div>
           <button className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full text-[10px] font-black uppercase border border-white/10 hover:bg-white/10 transition-all">
              <Layers size={14} /> Editar Bloques
           </button>
        </div>

        <div className={`p-12 md:p-20 rounded-[4rem] ${GLASS_STYLE} border border-white/5 min-h-[400px] flex flex-col justify-between overflow-hidden relative`}>
           <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-red-500/20 via-transparent to-transparent opacity-50" />
           
           <div className="flex items-end justify-between h-64 gap-2">
              {[80, 45, 95, 60, 40, 85, 90, 100, 30, 75, 55, 95].map((val, i) => (
                <div key={i} className="flex-1 group relative">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    className={`w-full rounded-t-2xl transition-all ${val > 80 ? 'bg-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : val > 50 ? 'bg-gold-500/40' : 'bg-white/10'}`}
                  />
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/10 p-2 rounded text-[8px] font-black whitespace-nowrap z-50">
                     PICO DE EUFORIA
                  </div>
                </div>
              ))}
           </div>

           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20 pt-12 border-t border-white/5">
              <span>Intro (Glow)</span>
              <span className="text-gold-500">Climax (Fuego)</span>
              <span>Outro (Legado)</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Energía Media', val: '82%', icon: Zap },
             { label: 'Momento Wow', val: 'Min 04:20', icon: Sparkles },
             { label: 'Fuga Potencial', val: 'Min 08:45', icon: ShieldAlert },
             { label: 'Aprobación Fans', val: '9.4', icon: Star },
           ].map((metric, i) => (
             <div key={i} className={`p-8 rounded-[2rem] ${GLASS_STYLE} border border-white/5 flex flex-col gap-4`}>
                <metric.icon size={20} className="text-gold-500" />
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{metric.label}</p>
                   <p className="text-2xl font-black gold-text">{metric.val}</p>
                </div>
             </div>
           ))}
        </div>
     </div>
  );
};

/**
 * 5. OBJECTION HANDLER
 */
const ObjectionHandler = () => {
  const objections = [
    { id: 1, text: "Es demasiado caro para nuestro presupuesto actual.", category: "Ventas" },
    { id: 2, text: "¿Cómo sabemos que esto realmente funcionará con nuestro público?", category: "Confianza" },
    { id: 3, text: "Ya trabajamos con otra agencia de management.", category: "Competencia" }
  ];

  const [selected, setSelected] = useState(objections[0]);
  const [tone, setTone] = useState<'analytical' | 'empathic' | 'assertive'>('analytical');

  const responses = {
    analytical: "Basándonos en el ROI medio de x3.2 que hemos generado, este no es un gasto, es una inversión en infraestructura digital...",
    empathic: "Entiendo perfectamente que el presupuesto sea una preocupación. Muchos de nuestros artistas TOP estaban en la misma posición...",
    assertive: "Precisamente porque el presupuesto es limitado, no puedes permitirte el lujo de no tener un sistema de monetización profesional."
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div className="space-y-4">
           <h3 className="text-3xl font-black uppercase tracking-tighter">Manejador de Objeciones</h3>
           <p className="text-white/30 italic">Entrenamiento de alta intensidad para negociaciones críticas.</p>
        </div>

        <div className="space-y-4">
           {objections.map(obj => (
             <button 
                key={obj.id}
                onClick={() => setSelected(obj)}
                className={`w-full p-6 text-left rounded-3xl border transition-all flex justify-between items-center group ${selected.id === obj.id ? 'bg-[#ecb613] text-black border-transparent' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}
             >
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{obj.category}</p>
                   <p className="text-sm font-bold">"{obj.text}"</p>
                </div>
                <ChevronRight size={18} className={selected.id === obj.id ? '' : 'opacity-0 group-hover:opacity-100'} />
             </button>
           ))}
        </div>
      </div>

      <div className={`p-10 md:p-14 rounded-[3rem] ${GLASS_STYLE} border border-gold-500/20 bg-gold-500/5 space-y-10 flex flex-col justify-between`}>
         <div className="space-y-8 text-center pt-8">
            <div className="flex justify-center gap-6">
               {[
                 { id: 'analytical', icon: Activity, label: 'Analítico' },
                 { id: 'empathic', icon: Smile, label: 'Empático' },
                 { id: 'assertive', icon: Zap, label: 'Asertivo' }
               ].map(t => (
                 <button 
                  key={t.id}
                  onClick={() => setTone(t.id as any)}
                  className={`flex flex-col items-center gap-2 group transition-all ${tone === t.id ? 'scale-110 opacity-100' : 'opacity-30 hover:opacity-100'}`}
                 >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${tone === t.id ? 'bg-gold-500 text-black border-transparent' : 'border-white/10 text-white'}`}>
                       <t.icon size={24} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest">{t.label}</span>
                 </button>
               ))}
            </div>

            <div className="relative">
               <motion.p 
                key={tone}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl md:text-2xl font-medium italic text-white/80 leading-relaxed"
               >
                 "{responses[tone]}"
               </motion.p>
            </div>
         </div>

         <button className="w-full py-6 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#ecb613] transition-all flex items-center justify-center gap-3">
            <Play size={14} fill="currentColor" /> Practicar con IA Forense
         </button>
      </div>
    </div>
  );
};

// --- MAIN WRAPPER ---

export default function ArtistsCalculators() {
  const [activeTool, setActiveTool] = useState<ToolId>('cache');

  const tools = [
    { id: 'cache', label: 'Caché & ROI', icon: DollarSign, component: CacheCalculator },
    { id: 'opal', label: 'Proyección OPAL', icon: TrendingUp, component: OpalSimulator },
    { id: 'pitch', label: 'Pitch Editor', icon: MessageSquare, component: PitchEditor },
    { id: 'narrative', label: 'Engagement Heatmap', icon: BarChart3, component: NarrativeArchitect },
    { id: 'objection', label: 'Objection Handler', icon: ShieldAlert, component: ObjectionHandler },
  ];

  const ActiveComponent = tools.find(t => t.id === activeTool)?.component || CacheCalculator;

  return (
    <div className="w-full min-h-screen bg-[#1a1510] text-white p-6 md:p-12 font-montserrat flex flex-col gap-12">
      
      {/* 1. NAVIGATION HUD */}
      <header className="flex flex-col md:flex-row gap-8 items-center justify-between border-b border-white/5 pb-12">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-gold-500 rounded-3xl flex items-center justify-center text-black">
              <Calculator size={32} />
           </div>
           <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">Artists Engineering</h1>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Bloque E // Calculators & Simulation</p>
           </div>
        </div>

        <nav className="flex flex-wrap gap-4 justify-center">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as ToolId)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTool === tool.id ? 'bg-gold-500 text-black' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white'}`}
            >
              <tool.icon size={16} />
              {tool.label}
            </button>
          ))}
        </nav>
      </header>

      {/* 2. MAIN TOOL CANVAS */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. FOOTER LOGS */}
      <footer className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
         <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/20">
            <Activity size={12} className="text-green-500" /> System Operational // API Sync Active // Pollstar v4.2
         </div>
         <div className="flex gap-8">
            <button className="text-[9px] font-black uppercase tracking-widest text-[#ecb613] hover:text-white flex items-center gap-2">
               <Share2 size={12} /> Exportar Reporte Forense
            </button>
            <button className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white flex items-center gap-2">
               <Lock size={12} /> Privacy Protocol Enforced
            </button>
         </div>
      </footer>
    </div>
  );
}
