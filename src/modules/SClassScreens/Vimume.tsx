
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Users, 
  Activity, 
  Plus, 
  Save, 
  FileText, 
  TrendingUp, 
  History,
  ShieldCheck,
  CheckCircle,
  Stethoscope,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  Layout,
  Microscope,
  Atom,
  Smile,
  Dumbbell,
  Sliders,
  Music,
  Mic,
  Wind,
  Smartphone,
  BarChart3,
  Globe,
  Leaf,
  Palette,
  HandHeart,
  ArrowRight,
  BrainCircuit,
  Fingerprint,
  Landmark
} from 'lucide-react';
import { GLASS_STYLE, GOLD_HUD_STYLE } from '@/lib/dna/theme';
import { useVimume, VimumeSession } from '@/hooks/useVimume';

/**
 * 🛰️ MODULE: VIMUME CORE (S-Class V2.4)
 * The Soul of EAR OS. 
 * Emotional Intelligence + Clinical Precision.
 */

interface VimumeProps {
  onNavigate?: (id: string) => void;
  hideHeader?: boolean;
}

export default function Vimume({ onNavigate, hideHeader }: VimumeProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'foundations' | 'tracker' | 'strategy' | 'budget'>('dashboard');
  const [activeRole, setActiveRole] = useState<'institutional' | 'professional' | 'family'>('professional');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [showDashboard, setShowDashboard] = useState(true);
  const { sessions, loading, addSession } = useVimume();
  
  // Dynamic Budget State
  const [budgetOptions, setBudgetOptions] = useState({
    baseTier: 'standard',
    services: {
      sound: false,
      technician: false,
      lighting: false,
      led: false,
      mc: false
    }
  });

  const basePrices: Record<string, number> = {
    basic: 3000,
    standard: 7500,
    elite: 15000
  };

  const servicePrices: Record<string, number> = {
    sound: 1500,
    technician: 350,
    lighting: 1200,
    led: 2500,
    mc: 500
  };

  const startAspiration = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncLogs([]);
    
    const logs = [
      "⚡ Iniciando Aspiración Profunda (Cortex EAR V2.5)...",
      "📂 Escaneando UNIDAD H: [METODOLOGÍA_VIMUME]...",
      "🔍 Localizados 2,450 archivos .docx (Sesiones Clínicas)...",
      "🎵 Extrayendo Patrones 40Hz de UNIDAD F: [BIBLIOTECA_RESONANCIA]...",
      "🧬 Vinculando Stakeholders: Ayuntamientos, Residencias, Familias...",
      "🏛️ Sincronizando Protocolo Institucional con Navalcarnero v02...",
      "✨ Reconstruyendo Momento WOW: La Fábula del Colibrí...",
      "✅ Sincronización Completa. Sistema EAR OS Listo."
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSyncing(false);
          }, 800);
          return 100;
        }
        if (prev % 12 === 0 && currentLog < logs.length) {
          setSyncLogs(old => [...old, logs[currentLog]]);
          currentLog++;
        }
        return prev + 2;
      });
    }, 50);
  };

  const calculateTotal = () => {
    let total = basePrices[budgetOptions.baseTier];
    if (budgetOptions.services.sound) total += servicePrices.sound;
    if (budgetOptions.services.technician) total += servicePrices.technician;
    if (budgetOptions.services.lighting) total += servicePrices.lighting;
    if (budgetOptions.services.led) total += servicePrices.led;
    if (budgetOptions.services.mc) total += servicePrices.mc;
    return total;
  };

  // Tracker Form State
  const [formData, setFormData] = useState({
    centerName: '',
    residentName: '',
    moodPre: 5,
    moodPost: 8,
    observations: '',
    songsPlayed: '',
    requirementType: 'Estimulación Cognitiva'
  });

  const handleSubmitSession = async (e: React.FormEvent) => {
    e.preventDefault();
    await addSession({
      ...formData,
      songsPlayed: formData.songsPlayed.split(',').map(s => s.trim())
    });
    setFormData({
      centerName: '',
      residentName: '',
      moodPre: 5,
      moodPost: 8,
      observations: '',
      songsPlayed: '',
      requirementType: 'Estimulación Cognitiva'
    });
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!showDashboard && !hideHeader ? (
          isSyncing ? (
            <motion.div 
              key="aspiration"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-2xl bg-zinc-900/50 backdrop-blur-3xl border border-gold-500/30 p-12 rounded-[3rem] shadow-[0_0_100px_rgba(196,163,0,0.15)] relative z-20"
            >
              <div className="flex flex-col items-center space-y-8">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 rounded-full border-t-2 border-r-2 border-gold-500 flex items-center justify-center p-4"
                >
                  <BrainCircuit className="text-gold-500" size={40} />
                </motion.div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-gold-500">Aspirando Datos...</h3>
                  <p className="text-zinc-500 text-xs tracking-widest uppercase">Unidades H: | F: en sincronía</p>
                </div>

                <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${syncProgress}%` }}
                    className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
                  />
                </div>

                <div className="w-full h-40 bg-black/40 rounded-2xl p-6 font-mono text-[10px] text-gold-500/70 overflow-hidden space-y-2 border border-gold-500/10">
                  {syncLogs.slice(-5).map((log, i) => (
                    <motion.p 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-gold-500/30">[{new Date().toLocaleTimeString()}]</span>
                      {log}
                    </motion.p>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="sync-gate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-12 relative z-20"
            >
              <div className="inline-flex items-center space-x-3 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-500 mb-4 animate-pulse">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Protocolo de Activación VIMUME</span>
              </div>
              
                <div className="absolute top-6 right-6 md:top-12 md:right-12 z-50">
                  <button 
                    onClick={() => setIsSyncing(true)}
                    className="p-4 bg-gold-500/10 border border-gold-500/20 rounded-2xl text-gold-500 hover:bg-gold-500 hover:text-black transition-all group"
                    title="Infraestructura de Datos"
                  >
                    <Fingerprint size={20} className="group-hover:rotate-45 transition-transform" />
                  </button>
                </div>

              <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-center">
                VIAJE <br /> MUSICAL <br /> <span className="text-transparent bg-clip-text bg-gradient-to-b from-gold-500 to-amber-700">MEMORIA</span>
              </h1>
              
              <p className="text-zinc-400 max-w-xl mx-auto text-lg font-light leading-relaxed">
                Para acceder al dashboard operativo de VIMUME, el sistema requiere una sincronización de activos desde los servidores locales (H:|F:).
              </p>

              <motion.button 
                onClick={startAspiration}
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(196,163,0,0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-8 bg-gold-500 text-black font-black uppercase tracking-[0.3em] text-xs rounded-[2rem] flex items-center gap-4 mx-auto group shadow-2xl"
              >
                <Fingerprint size={24} className="group-hover:rotate-180 transition-transform duration-700" />
                <span>Sincronizar Fuentes H: | F:</span>
              </motion.button>
            </motion.div>
          )
        ) : (
          <motion.div 
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full bg-[#1a1510] text-white font-montserrat min-h-screen overflow-x-hidden relative"
          >
      <main className="max-w-7xl mx-auto space-y-12 md:space-y-24 pb-32">
        
        {/* 1. HERO SECTION */}
        <section className="relative aspect-[3/4] md:aspect-[21/9] flex flex-col justify-center items-center p-6 md:p-12 overflow-hidden md:rounded-b-[80px] border-b border-white/5 shadow-2xl">
          <div className="absolute inset-0 z-0">
             <div 
               className="absolute inset-0 bg-cover bg-center opacity-30 grayscale scale-105"
               style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=2000")' }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510] via-[#1a1510]/60 to-transparent" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative z-10 text-center items-center flex flex-col space-y-8 ${hideHeader ? 'pt-20' : ''}`}
          >
            <div className="flex gap-4 mb-4">
              {[
                { id: 'institutional', label: 'Institucional', icon: Globe },
                { id: 'professional', label: 'Residencias', icon: Stethoscope },
                { id: 'family', label: 'Familias', icon: Heart }
              ].map(role => (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id as any)}
                  className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border transition-all ${activeRole === role.id ? 'bg-red-500 border-red-500 text-black' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                >
                  <role.icon size={12} />
                  {role.label}
                </button>
              ))}
            </div>

            <span className="px-5 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] md:text-[10px] font-black tracking-[0.4em] uppercase rounded-full backdrop-blur-2xl">
               VIMUME Protocol // {activeRole === 'institutional' ? 'Impacto Social & Relaciones Culturales' : activeRole === 'professional' ? 'Musicoterapia Clínica de Élite' : 'Conexión Emocional & Legado Personal'}
            </span>
            <h1 className="text-[clamp(2.5rem,10vw,8rem)] font-cinzel font-black tracking-tighter uppercase leading-[1] md:leading-[0.9] text-balance">
               Reconectando <br />
               <span className="text-red-500 italic font-serif normal-case">Historias.</span>
            </h1>
            <p className="text-sm md:text-xl lg:text-2xl text-white/40 font-medium italic max-w-2xl leading-relaxed text-balance px-4 md:px-0">
               {activeRole === 'institutional' ? 'Una herramienta estratégica para ayuntamientos y diputaciones que desean humanizar el envejecimiento activo.' : activeRole === 'professional' ? 'La música es la última puerta que se cierra. Nosotros tenemos la llave técnica y emocional para abrirla en su centro.' : 'Recupere la voz y los recuerdos de sus seres queridos a través de una banda sonora diseñada quirúrgicamente para su bienestar.'}
            </p>
          </motion.div>
        </section>

        {/* 2. NAVIGATION TABS */}
        <div className="flex justify-center px-4">
          <div className="inline-flex bg-white/5 p-2 rounded-full border border-white/5 backdrop-blur-3xl">
             {[
               { id: 'dashboard', label: 'Impacto', icon: Activity },
               { id: 'foundations', label: 'Metodología', icon: Microscope },
               { id: 'tracker', label: 'VIMUME Tracker', icon: Plus },
               { id: 'budget', label: 'Presupuestos', icon: BarChart3 },
               { id: 'strategy', label: 'Estrategia', icon: Target }
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex items-center gap-3 px-6 md:px-10 py-3 md:py-4 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#ecb613] text-black shadow-2xl' : 'text-white/40 hover:bg-white/5'}`}
               >
                 <tab.icon size={16} />
                 <span className="hidden sm:inline">{tab.label}</span>
               </button>
             ))}
          </div>
        </div>

        {/* 3. CONTENT AREA */}
        <div className="px-4 md:px-12">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-12"
              >
                {/* 4 Pillars of Impact */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Empoderamiento', val: '8.4', unit: '/10', icon: Zap, col: 'text-amber-500', desc: 'Envejecimiento Activo' },
                    { label: 'Autonomía', val: '+22%', unit: 'Propia', icon: Activity, col: 'text-green-500', desc: 'Funcionalidad' },
                    { label: 'Salud Física', val: '1.2h', unit: 'Movilidad', icon: Dumbbell, col: 'text-red-500', desc: 'Promoción Activa' },
                    { label: 'Cohesión', val: '95', unit: 'Puntos', icon: Users, col: 'text-blue-500', desc: 'Reducción Aislamiento' }
                  ].map((stat, i) => (
                    <div key={i} className={`p-8 ${GLASS_STYLE} ${GOLD_HUD_STYLE} border border-white/5 rounded-[2.5rem] flex flex-col items-center text-center space-y-4`}>
                       <stat.icon size={32} className={stat.col} />
                       <span className="text-4xl font-black">{stat.val}<span className="text-sm opacity-30">{stat.unit}</span></span>
                       <div className="space-y-1">
                         <span className="block text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                         <span className="block text-[8px] italic text-white/40 uppercase">{stat.desc}</span>
                       </div>
                    </div>
                  ))}
                </div>

                {/* Colibrí Fable Section - WOW moment */}
                <div className={`p-12 md:p-24 ${GLASS_STYLE} border border-red-500/10 rounded-[4rem] relative overflow-hidden group shadow-2xl shadow-red-500/5`}>
                   <div className="absolute -top-20 -right-20 p-20 opacity-5 text-red-500 animate-pulse">
                      <Wind size={400} />
                   </div>
                   <div className="relative z-10 max-w-4xl space-y-10">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center">
                            <Leaf size={32} className="text-red-500" />
                         </div>
                         <h2 className="text-3xl font-cinzel font-black uppercase tracking-widest text-red-500">"Hacemos nuestra parte"</h2>
                      </div>
                      <p className="text-xl md:text-3xl font-serif italic text-white/60 leading-relaxed font-light">
                        "En el medio de un gran incendio en la selva, todos los animales huían. Un pequeño colibrí iba al río, cogía una gota con su pico y la soltaba sobre el fuego. El león le preguntó: ¿Crees que vas a apagar el fuego con eso? El colibrí respondió: <span className="text-white font-bold">Yo solo hago mi parte</span>."
                      </p>
                      <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-red-500/60">
                         <div className="h-[1px] w-12 bg-red-500/20" />
                         La Filosofía VIMUME // Productora EAR
                      </div>
                   </div>
                </div>

                {/* Recent Sessions */}
                <div className="space-y-8 pt-12">
                  <div className="flex justify-between items-end">
                    <h3 className="text-2xl font-black uppercase tracking-widest text-[#ecb613]">Registros de Impacto Clínico</h3>
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-all flex items-center gap-2">
                       VER HISTORIAL COMPLETO <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sessions.map((session, i) => (
                      <div key={i} className={`p-8 ${GLASS_STYLE} border border-white/5 rounded-[3rem] space-y-6 hover:border-red-500/30 transition-all`}>
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                             <span className="text-[9px] font-black uppercase text-red-500 tracking-widest">{session.centerName}</span>
                             <h4 className="text-xl font-black uppercase">{session.residentName}</h4>
                          </div>
                          <div className="p-3 bg-white/5 rounded-2xl">
                             <Stethoscope size={20} className="text-red-500" />
                          </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex-1 bg-white/5 p-4 rounded-2xl text-center">
                              <span className="block text-xs text-white/20 font-black uppercase mb-1">PRE</span>
                              <span className="text-xl font-black">{session.moodPre}</span>
                           </div>
                           <div className="flex-1 bg-red-500/10 p-4 rounded-2xl text-center border border-red-500/20">
                              <span className="block text-xs text-red-400 font-black uppercase mb-1">POST</span>
                              <span className="text-xl font-black text-red-500">{session.moodPost}</span>
                           </div>
                        </div>
                        <p className="text-sm italic text-white/40 line-clamp-2">"{session.observations}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'foundations' && (
              <motion.div 
                key="foundations"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-24 pb-20"
              >
                {/* 1. FUNDAMENTOS CIENTÍFICOS */}
                <section className="space-y-8">
                  <div className="text-center space-y-2">
                    <span className="text-[#ecb613] text-xs font-black uppercase tracking-[0.4em]">@fundamentos-científicos</span>
                    <h3 className="text-4xl font-cinzel font-black uppercase tracking-tighter">Bases de la Musicoterapia</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={`p-10 ${GLASS_STYLE} border border-blue-500/20 rounded-[3rem] space-y-6 relative overflow-hidden group`}>
                      <Microscope className="text-blue-500 mb-4" size={40} />
                      <h4 className="text-2xl font-black uppercase">Bases Neurológicas</h4>
                      <p className="text-white/50 text-sm leading-relaxed italic">
                        Estimula múltiples áreas cerebrales de manera simultánea. Activa circuitos de memoria y emoción. Favorece la plasticidad neuronal y fortalecimiento de conexiones sinápticas.
                      </p>
                      <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-500 group-hover:scale-110 transition-transform">
                        <Atom size={120} />
                      </div>
                    </div>
                    <div className={`p-10 ${GLASS_STYLE} border border-green-500/20 rounded-[3rem] space-y-6 relative overflow-hidden group`}>
                      <Activity className="text-green-500 mb-4" size={40} />
                      <h4 className="text-2xl font-black uppercase">Efectos Fisiológicos</h4>
                      <p className="text-white/50 text-sm leading-relaxed italic">
                        Regula neurotransmisores clave. Reduce cortisol (estrés). Mejora circulación sanguínea cerebral y optimiza respuesta inmune.
                      </p>
                      <div className="absolute top-0 right-0 p-8 opacity-5 text-green-500 group-hover:scale-110 transition-transform">
                        <Heart size={120} />
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. BENEFICIOS DOCUMENTADOS */}
                <section className="space-y-12">
                  <div className="text-center space-y-2">
                    <span className="text-[#ecb613] text-xs font-black uppercase tracking-[0.4em]">@beneficios-validados</span>
                    <h3 className="text-4xl font-cinzel font-black uppercase tracking-tighter">Resultados de Impacto</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { title: 'Cognitivos', icon: Brain, items: ['Mejora de memoria a corto/largo plazo', 'Incremento en capacidad de atención', 'Optimización de funciones ejecutivas', 'Mantenimiento de lenguaje'] },
                      { title: 'Emocionales', icon: Smile, items: ['Reducción de ansiedad/depresión', 'Mejora del estado de ánimo', 'Fortalecimiento de vínculos sociales'] },
                      { title: 'Físicos', icon: Dumbbell, items: ['Coordinación motora y movilidad', 'Reducción del dolor crónico', 'Mejora del equilibrio y estabilidad'] }
                    ].map((ben, i) => (
                      <div key={i} className={`p-8 ${GLASS_STYLE} border border-white/5 rounded-[2.5rem] space-y-6 hover:border-[#ecb613]/30 transition-all`}>
                        <ben.icon className="text-[#ecb613]" size={32} />
                        <h4 className="text-xl font-black uppercase tracking-tight">{ben.title}</h4>
                        <ul className="space-y-3">
                          {ben.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-xs text-white/40 italic font-medium">
                              <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. METODOLOGÍAS INNOVADORAS */}
                <section className="space-y-12">
                  <div className="text-center space-y-2">
                    <span className="text-[#ecb613] text-xs font-black uppercase tracking-[0.4em]">@metodologías-elite</span>
                    <h3 className="text-4xl font-cinzel font-black uppercase tracking-tighter">Nuestra Ventaja Técnica</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={`p-12 ${GLASS_STYLE} border border-blue-500/20 rounded-[4rem] relative overflow-hidden group`}>
                      <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                          <Sliders size={32} className="text-blue-500" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <h4 className="text-xl md:text-2xl font-black uppercase">Estimulación 40Hz</h4>
                          <p className="text-white/50 text-sm leading-relaxed italic">
                            Sincroniza ondas cerebrales gamma para mejorar la conectividad neuronal. Contribuye a la reducción de proteínas beta-amiloides, implicadas en el Alzheimer.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className={`p-12 ${GLASS_STYLE} border border-[#cf7317]/20 rounded-[4rem] relative overflow-hidden group`}>
                      <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-[#cf7317]/10 flex items-center justify-center border border-[#cf7317]/20">
                          <Music size={32} className="text-[#cf7317]" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <h4 className="text-2xl font-black uppercase">Tradición Mariachi</h4>
                          <p className="text-white/50 text-sm leading-relaxed italic">
                            Conecta profundamente con la memoria emocional a través de la música tradicional. Fortalece identidad cultural y promueve participación social.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4. TÉCNICAS Y TECNOLOGÍA */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <h4 className="text-xl font-black uppercase tracking-widest text-green-500">Técnicas Específicas</h4>
                    <div className="space-y-4">
                      <div className={`p-6 ${GLASS_STYLE} border border-white/5 rounded-3xl flex items-center gap-6`}>
                        <Mic size={24} className="text-green-500" />
                        <div>
                          <p className="font-black text-sm uppercase">Musicoterapia Activa</p>
                          <p className="text-[10px] text-white/30 italic">Improvisación guiada y creación de canciones.</p>
                        </div>
                      </div>
                      <div className={`p-6 ${GLASS_STYLE} border border-white/5 rounded-3xl flex items-center gap-6`}>
                        <Wind size={24} className="text-teal-500" />
                        <div>
                          <p className="font-black text-sm uppercase">Musicoterapia Sensorial</p>
                          <p className="text-[10px] text-white/30 italic">Estimulación auditiva y baños sonoros inmersivos.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <h4 className="text-xl font-black uppercase tracking-widest text-[#ecb613]">Innovación Digital</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-6 ${GLASS_STYLE} border border-white/5 rounded-3xl text-center space-y-4`}>
                        <Smartphone size={24} className="mx-auto text-blue-400" />
                        <p className="text-[9px] font-black uppercase">Herramientas Pro</p>
                      </div>
                      <div className={`p-6 ${GLASS_STYLE} border border-white/5 rounded-3xl text-center space-y-4`}>
                        <BarChart3 size={24} className="mx-auto text-amber-400" />
                        <p className="text-[9px] font-black uppercase">Monitoreo KPI</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 5. IMPACTO SOCIAL */}
                <div className={`p-12 md:p-24 ${GLASS_STYLE} ${GOLD_HUD_STYLE} border border-blue-500/10 rounded-[4rem] relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 p-12 opacity-5 text-blue-500">
                    <Globe size={400} />
                  </div>
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-500">Sostenibilidad // Impacto Social</span>
                       <h2 className="text-5xl font-cinzel font-black uppercase tracking-tighter italic">Nuestro <br /> Legado.</h2>
                       <p className="text-sm text-white/50 italic leading-relaxed">
                         La musicoterapia no es solo bienestar individual; es un motor de eficiencia sanitaria y cohesión comunitaria alineado con los ODS 3, 10, 11 y 17.
                       </p>
                    </div>
                    <div className="space-y-6">
                       <div className={`p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4`}>
                         <Leaf size={24} className="text-green-500" />
                         <p className="text-xs font-bold italic">Modelo escalable y replicable a nivel nacional.</p>
                       </div>
                       <div className={`p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4`}>
                         <Users size={24} className="text-blue-500" />
                         <p className="text-xs font-bold italic">Integración intergeneracional y formación de artistas.</p>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tracker' && (
              <motion.div 
                key="tracker"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto"
              >
                <form onSubmit={handleSubmitSession} className={`p-10 md:p-16 ${GLASS_STYLE} ${GOLD_HUD_STYLE} border border-white/5 rounded-[4rem] space-y-10 shadow-3xl relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none text-red-500">
                     <History size={300} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black uppercase tracking-tighter">Registrar Sesión</h3>
                    <p className="text-white/30 text-sm italic">Protocolo V2.4 - Registro de impacto inmediato.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]">Centro / Institución</label>
                      <input 
                        required
                        className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl outline-none focus:border-red-500/50 transition-all font-bold" 
                        placeholder="Ej: Residencia El Bosque"
                        value={formData.centerName}
                        onChange={e => setFormData({...formData, centerName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]">Nombre del Residente</label>
                      <input 
                        required
                        className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl outline-none focus:border-red-500/50 transition-all font-bold" 
                        placeholder="Ej: Manuel García"
                        value={formData.residentName}
                        onChange={e => setFormData({...formData, residentName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]">Ánimo PRE (1-10)</label>
                      <input 
                        type="range" min="1" max="10" 
                        className="w-full accent-red-500"
                        value={formData.moodPre}
                        onChange={e => setFormData({...formData, moodPre: parseInt(e.target.value)})}
                      />
                      <div className="flex justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest">
                        <span>Aislado</span>
                        <span className="text-red-500">{formData.moodPre}</span>
                        <span>Presente</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]">Ánimo POST (1-10)</label>
                      <input 
                        type="range" min="1" max="10" 
                        className="w-full accent-red-500"
                        value={formData.moodPost}
                        onChange={e => setFormData({...formData, moodPost: parseInt(e.target.value)})}
                      />
                      <div className="flex justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest">
                        <span>Aislado</span>
                        <span className="text-red-500">{formData.moodPost}</span>
                        <span>Presente</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]">Repertorio Activado (Comas)</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl outline-none focus:border-red-500/50 transition-all font-bold" 
                      placeholder="Ej: Tómbola, Paquito el Chocolatero, Dos Gardenias"
                      value={formData.songsPlayed}
                      onChange={e => setFormData({...formData, songsPlayed: e.target.value})}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]">Observaciones Clínicas / Emocionales</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl outline-none focus:border-red-500/50 transition-all font-medium italic" 
                      placeholder="Describe la reacción, lagrimas, movimiento motor, contacto visual..."
                      value={formData.observations}
                      onChange={e => setFormData({...formData, observations: e.target.value})}
                    />
                  </div>

                  <button className="w-full py-8 bg-red-500 text-black font-black uppercase tracking-[0.4em] text-xs rounded-[2rem] shadow-2xl shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4">
                     FINALIZAR REGISTRO <Save size={18} />
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'budget' && (
              <motion.div 
                key="budget"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   {/* Configuration */}
                   <div className={`p-10 md:p-16 ${GLASS_STYLE} border border-white/5 rounded-[4rem] space-y-12`}>
                      <div className="space-y-2 text-center lg:text-left">
                        <h3 className="text-3xl font-black uppercase tracking-tighter italic">Ingeniería de Costes</h3>
                        <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">Adapte el viaje a su presupuesto real</p>
                      </div>

                      {/* Tier Selector */}
                      <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]">Rango de Inversión (Base)</label>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { id: 'basic', label: '< 5.000€/mes', title: 'Básico' },
                            { id: 'standard', label: '5k - 10k/mes', title: 'Estándar' },
                            { id: 'elite', label: '> 10.000€/mes', title: 'Élite' }
                          ].map(tier => (
                            <button
                              key={tier.id}
                              onClick={() => setBudgetOptions({...budgetOptions, baseTier: tier.id})}
                              className={`p-6 rounded-3xl flex flex-col items-center justify-center gap-2 border transition-all ${budgetOptions.baseTier === tier.id ? 'bg-[#ecb613] border-[#ecb613] text-black' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                            >
                               <span className="text-[8px] font-black uppercase tracking-widest">{tier.title}</span>
                               <span className="text-sm font-bold">{tier.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Service Checklist */}
                      <div className="space-y-6">
                         <label className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]">Servicios Adicionales (Checklist)</label>
                         <div className="grid grid-cols-1 gap-4">
                            {[
                              { id: 'sound', label: 'Equipo de Sonido Profesional', price: 1500, icon: Music },
                              { id: 'technician', label: 'Técnico de Sonido In-Situ', price: 350, icon: Zap },
                              { id: 'lighting', label: 'Diseño de Iluminación Emocional', price: 1200, icon: Sparkles },
                              { id: 'led', label: 'Pantalla LED Alta Definición', price: 2500, icon: Layout },
                              { id: 'mc', label: 'Maestro de Ceremonia / Coordinador', price: 500, icon: Mic }
                            ].map(service => (
                              <button
                                key={service.id}
                                onClick={() => setBudgetOptions({
                                  ...budgetOptions,
                                  services: { ...budgetOptions.services, [service.id]: !budgetOptions.services[service.id as keyof typeof budgetOptions.services] }
                                })}
                                className={`p-6 rounded-2xl flex items-center justify-between border transition-all ${budgetOptions.services[service.id as keyof typeof budgetOptions.services] ? 'bg-red-500/20 border-red-500 text-white' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                              >
                                 <div className="flex items-center gap-4">
                                    <service.icon size={18} className={budgetOptions.services[service.id as keyof typeof budgetOptions.services] ? 'text-red-500' : 'text-white/20'} />
                                    <span className="text-xs font-bold uppercase">{service.label}</span>
                                 </div>
                                 <span className="text-[10px] font-black">+{service.price}€/mes</span>
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Total & Summary */}
                   <div className="flex flex-col justify-between space-y-8">
                      <div className={`p-12 md:p-20 ${GLASS_STYLE} ${GOLD_HUD_STYLE} border border-green-500/20 rounded-[4rem] text-center flex flex-col items-center space-y-8 shadow-3xl`}>
                         <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500">Estimación de Impacto</span>
                            <h4 className="text-5xl md:text-8xl font-black tracking-tighter">
                               {calculateTotal().toLocaleString()}
                               <span className="text-3xl opacity-30">€/mes</span>
                             </h4>
                         </div>
                         <p className="text-xs text-white/40 italic leading-relaxed max-w-xs">
                            Este presupuesto se adapta dinámicamente según la biografía y necesidades de la residencia.
                         </p>
                         <div className="w-full h-[1px] bg-white/5" />
                         <div className="grid grid-cols-2 gap-8 w-full">
                            <div className="text-center">
                               <span className="block text-[8px] font-black uppercase text-white/20 mb-1">Impacto Previsto</span>
                               <span className="text-xl font-black text-green-500">MÁXIMO</span>
                            </div>
                            <div className="text-center">
                               <span className="block text-[8px] font-black uppercase text-white/20 mb-1">ROI Social</span>
                               <span className="text-xl font-black text-[#ecb613]">ALTO</span>
                            </div>
                         </div>
                      </div>

                      <button className="w-full py-10 bg-white text-black font-black uppercase tracking-[0.6em] text-xs rounded-[3rem] shadow-2xl hover:scale-[1.05] transition-all flex items-center justify-center gap-6">
                         SOLICITAR PROPUESTA FORMAL <ChevronRight size={20} />
                      </button>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'strategy' && (
              <motion.div 
                key="strategy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-16"
              >
                 {/* Roadmap Fases */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { fase: 'FASE 1', title: 'FUNDAMENTOS', desc: 'Protocolo neurocientífico blindado. Kit de instrumentos sensoriales élite.', state: 'COMPLETADO', color: 'text-green-500' },
                      { fase: 'FASE 2', title: 'VALIDACIÓN', desc: 'Contratos con 3 residencias premium. Tracker MVP en operación.', state: 'EN CURSO', color: 'text-amber-500' },
                      { fase: 'FASE 3', title: 'ESCALAMIENTO', desc: 'Protocolo VIMUME™ nacional. Fundación EAR activa.', state: 'PRÓXIMAMENTE', color: 'text-white/20' }
                    ].map((phase, i) => (
                      <div key={i} className={`p-10 ${GLASS_STYLE} border border-white/5 rounded-[4rem] flex flex-col space-y-6 relative overflow-hidden group`}>
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{phase.fase}</span>
                            <div className={`px-3 py-1 bg-white/5 rounded-md text-[8px] font-black uppercase tracking-widest ${phase.color}`}>
                               {phase.state}
                            </div>
                         </div>
                         <h4 className="text-3xl font-black uppercase tracking-tighter">{phase.title}</h4>
                         <p className="text-sm italic text-white/40 leading-relaxed font-medium">{phase.desc}</p>
                      </div>
                    ))}
                 </div>

                 {/* Marketing Principles (Leire Manual) */}
                 <div className={`p-12 md:p-24 ${GLASS_STYLE} ${GOLD_HUD_STYLE} border border-green-500/10 rounded-[4rem] md:rounded-[6rem] relative overflow-hidden shadow-2xl shadow-green-500/5`}>
                    <div className="absolute top-0 right-0 p-12 opacity-5 text-green-500">
                       <ShieldCheck size={400} />
                    </div>
                    <div className="max-w-4xl space-y-12 relative z-10">
                       <span className="text-xs font-black uppercase tracking-[0.4em] text-green-500">Manual Maestro // Incubadora EAR</span>
                       <h2 className="text-4xl md:text-7xl font-cinzel font-black uppercase tracking-tighter italic font-serif">Marketing de Legado.</h2>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-white/50 italic font-medium leading-relaxed">
                          <p>
                            En VIMUME no "vendemos". Aliviamos el dolor de un terapeuta y devolvemos la chispa a un anciano. El lenguaje debe ser institucional pero vibrante.
                          </p>
                          <p>
                            Buscamos al Director de Residencia Premium. No hablamos de "canciones", hablamos de Protocolo de Intervención Musical Sensorial.
                          </p>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

          </main>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
