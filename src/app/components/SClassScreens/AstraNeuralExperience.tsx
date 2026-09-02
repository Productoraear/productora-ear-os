'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fingerprint, 
  Sparkles, 
  Crown, 
  Layers, 
  Map, 
  Compass, 
  ShieldCheck, 
  Award, 
  Sliders, 
  ChevronRight, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  Bot, 
  ArrowRight, 
  HelpCircle, 
  FileText, 
  BarChart3, 
  Database, 
  Activity, 
  Flame, 
  Lightbulb, 
  ChevronDown, 
  X,
  Lock,
  Headphones,
  BookOpen,
  DollarSign,
  Play,
  Check,
  Briefcase,
  Wrench,
  Heart,
  Scale,
  Volume2,
  FileCheck
} from 'lucide-react';

export type UserRole = 
  | 'ARTISTA_VISIONARIO'
  | 'EMANAGER_ESTRATEGICO'
  | 'DIRECTOR_PROYECTOS'
  | 'EMPRENDEDOR_IMPACTO'
  | 'ARQUITECTO_NARRATIVA'
  | 'AUTOR_LEGADO';

const ROLES: { id: UserRole; label: string; desc: string; badge: string; color: string }[] = [
  { id: 'ARTISTA_VISIONARIO', label: 'Artista Visionario', desc: 'Atleta cultural enfocado en arte, excelencia y caché de 7 cifras (Paciente Cero).', badge: 'Atleta Cultural', color: 'from-purple-600 to-blue-600' },
  { id: 'EMANAGER_ESTRATEGICO', label: 'Emanager Estratégico', desc: 'Gobernanza de Dani Aragón, contratos B2B, negociación y split 80/10/10.', badge: 'Dani Aragón Suite', color: 'from-emerald-600 to-teal-600' },
  { id: 'DIRECTOR_PROYECTOS', label: 'Director de Proyectos', desc: 'SLA operativo 99.9%, montaje militar T-120min y riders Bose/Shure.', badge: 'SLA 99.9%', color: 'from-blue-600 to-cyan-600' },
  { id: 'EMPRENDEDOR_IMPACTO', label: 'Emprendedor de Impacto', desc: 'Economía plateada, estimulación Gamma 40Hz e impacto social VIMUME.', badge: 'VIMUME Social', color: 'from-pink-600 to-rose-600' },
  { id: 'ARQUITECTO_NARRATIVA', label: 'Arquitecto de Narrativa', desc: 'Neurobranding, psicología de sala y autoridad de marca.', badge: 'Neurobranding', color: 'from-fuchsia-600 to-purple-600' },
  { id: 'AUTOR_LEGADO', label: 'Autor de Legado', desc: 'Estructuración de activos imperecederos y formación The Signal.', badge: 'The Signal', color: 'from-amber-600 to-yellow-600' }
];

const LIFE_DIMENSIONS = [
  'Arte y Creatividad',
  'Carrera y Negocio',
  'Finanzas',
  'Salud y Bienestar',
  'Relaciones',
  'Desarrollo Personal',
  'Entorno Físico',
  'Diversión y Ocio'
];

const DANI_ARAGON_MASTERCLASSES = [
  {
    id: 'da-01',
    title: 'Negociación de Caché & Eliminación de Intermediarios Abusivos',
    duration: '28 min',
    type: 'AUDIO MASTERCLASS',
    mentor: 'Dani Aragón',
    summary: 'Cómo pasar de cobrar 300€ por bolo a fijar un suelo de 1.250€ mediante el posicionamiento de autoridad y rider homologado.',
    audioFile: 'ART_AUDIOS_DE_DANI_ARAGON_FORMACION_PARA_MANAGERS_Y_AR.ogg'
  },
  {
    id: 'da-02',
    title: 'El Contrato Mercantil Blindado: Cláusulas Escrow y Anticipos',
    duration: '34 min',
    type: 'LEGAL & GOBERNANZA',
    mentor: 'Dani Aragón & EAR Legal',
    summary: 'Estructuración de contratos con retención de fecha, póliza de 1M€ y liquidación transparente bajo el Split Soberano 80/10/10.',
    audioFile: 'ART_AUDIOS_DE_DANI_ARAGON_FORMACION_PARA_MANAGERS_Y_AR_1.ogg'
  },
  {
    id: 'da-03',
    title: 'Venta Consultiva B2B para Ayuntamientos (Art. 118 LCSP)',
    duration: '42 min',
    type: 'B2G & FESTEJOS',
    mentor: 'Dani Aragón & Productora EAR',
    summary: 'Cómo redactar memorias técnicas y justificar la contratación artística institucional sin subasta a la baja.',
    audioFile: 'ART_AUDIOS_DE_DANI_ARAGON_FORMACION_PARA_MANAGERS_Y_AR_10.ogg'
  },
  {
    id: 'da-04',
    title: 'Lectura Psicológica de la Sala & Resolución de Fricciones',
    duration: '25 min',
    type: 'PSICOLOGÍA ESCÉNICA',
    mentor: 'Dani Aragón & The Signal',
    summary: 'El protocolo militar del artista en escenario: cero quejas, solución de imprevistos y conexión emocional con anfitriones VIP.',
    audioFile: 'ART_AUDIOS_DE_DANI_ARAGON_FORMACION_PARA_MANAGERS_Y_AR_11.ogg'
  }
];

export const AstraNeuralExperience: React.FC = () => {
  // Estado de Autenticación Biométrica
  const [showBiometricModal, setShowBiometricModal] = useState<boolean>(false);

  // Navegación Principal
  const [currentView, setCurrentView] = useState<'ROADMAP' | 'WHEEL' | 'COMMAND_CENTER' | 'TOOLKIT' | 'VAULT' | 'PROFILE_LAB' | 'DANI_SUITE'>('ROADMAP');
  const [selectedRole, setSelectedRole] = useState<UserRole>('ARTISTA_VISIONARIO');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState<boolean>(false);

  // Estado de la Rueda de la Vida Artística (Sliders de 1 a 10)
  const [wheelScores, setWheelScores] = useState<Record<string, number>>({
    'Arte y Creatividad': 8,
    'Carrera y Negocio': 5,
    'Finanzas': 4,
    'Salud y Bienestar': 6,
    'Relaciones': 7,
    'Desarrollo Personal': 8,
    'Entorno Físico': 6,
    'Diversión y Ocio': 5
  });

  // Estado del Abogado del Diablo (Activo por defecto)
  const [isDevilsAdvocateActive, setIsDevilsAdvocateActive] = useState<boolean>(true);
  const [isGeneratingSynthesis, setIsGeneratingSynthesis] = useState<boolean>(false);
  const [synthesisResult, setSynthesisResult] = useState<string | null>(null);

  // E-Manager State
  const [emanagerContractType, setEmanagerContractType] = useState<string>('MERCANTIL_80_10_10');
  const [emanagerBaseCache, setEmanagerBaseCache] = useState<number>(2500);
  const [activeAudioPlaying, setActiveAudioPlaying] = useState<string | null>(null);

  // Orb flotante
  const [isOrbOpen, setIsOrbOpen] = useState<boolean>(false);

  const activeRoleData = useMemo(() => {
    return ROLES.find(r => r.id === selectedRole) || ROLES[0];
  }, [selectedRole]);

  // Generación de coordenadas SVG puras para el Radar
  const svgRadarPoints = useMemo(() => {
    const total = LIFE_DIMENSIONS.length;
    const center = 150;
    const maxRadius = 100;

    return LIFE_DIMENSIONS.map((dim, i) => {
      const score = wheelScores[dim] || 5;
      const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
      const r = (score / 10) * maxRadius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  }, [wheelScores]);

  const handleSliderChange = (dim: string, val: number) => {
    setWheelScores(prev => ({ ...prev, [dim]: val }));
  };

  const handleGenerateSynthesis = () => {
    setIsGeneratingSynthesis(true);
    setTimeout(() => {
      setIsGeneratingSynthesis(false);
      const avg = Object.values(wheelScores).reduce((a, b) => a + b, 0) / 8;
      
      if (selectedRole === 'EMANAGER_ESTRATEGICO') {
        setSynthesisResult(
          `[DICTAMEN E-MANAGER DANI ARAGÓN]:\nComo Manager Estratégico, tu objetivo es proteger el caché del Paciente Cero (${emanagerBaseCache}€) y erradicar la fuga de comisiones.\n\n🎯 REGLAS DE GOBERNANZA DANI ARAGÓN:\n1. Cláusula de Exclusividad Territorial: No admitir bolos por debajo de 1.250€ en temporada alta.\n2. Aplicar el Split 80/10/10: 80% (${(emanagerBaseCache * 0.8).toFixed(0)}€) para el artista, 10% para soporte/rider Bose y 10% para el fondo social VIMUME.\n3. Protocolo de Anticipo: 50% al bloquear fecha en Stripe y 50% 48h antes del montaje T-120min.`
        );
      } else if (isDevilsAdvocateActive) {
        setSynthesisResult(
          `[ORÁCULO ASTRA // ABOGADO DEL DIABLO]:\nTu promedio actual es ${avg.toFixed(1)}/10. Tu talón de Aquiles está en la asimetría entre tu Arte (${wheelScores['Arte y Creatividad']}/10) y tus Finanzas (${wheelScores['Finanzas']}/10).\n\n⚠️ PUNTOS CIEGOS CRÍTICOS:\n1. Estás vendiendo actuaciones sueltas en lugar de empaquetar una Experiencia Inmersiva S-Class.\n2. Sin un Rider Bose F1 / Shure Axient homologado, los promotores te regatean la tarifa.\n3. Tu margen real se diluye si no exiges el Split 80/10/10 con anticipo protegido.\n\n🎯 ACCIÓN INMEDIATA:\nCambia al rol "Emanager Estratégico" para activar las 56 masterclasses de Dani Aragón y blindar tu caché.`
        );
      } else {
        setSynthesisResult(
          `[SÍNTESIS ESTRATÉGICA S-CLASS]:\nNivel de equilibrio: ${avg.toFixed(1)}/10. Tu potencial de escalabilidad en EAR OS es del 95%. Se recomienda activar el Split 80/10/10 y homologar el Rider Bose F1.`
        );
      }
    }, 1000);
  };

  return (
    <div className="w-full bg-[#050508] text-white font-sans rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(147,51,234,0.2)] relative min-h-[920px] flex flex-col selection:bg-purple-600 selection:text-white">
      
      {/* 🔮 MODAL DE ACCESO BIOMÉTRICO */}
      <AnimatePresence>
        {showBiometricModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0e0e12] border border-white/10 p-8 md:p-12 rounded-[2.5rem] max-w-md w-full text-center space-y-6 shadow-2xl relative"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Fingerprint className="w-10 h-10 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight font-syne">Acceso Biométrico</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Escanea tu huella o usa el reconocimiento facial para sincronizar con Astra OS.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setShowBiometricModal(false)}
                  className="w-full py-4 bg-[#1e1e24] hover:bg-[#2a2a32] text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all border border-white/10 cursor-pointer"
                >
                  Registrar Dispositivo
                </button>

                <button
                  onClick={() => setShowBiometricModal(false)}
                  className="text-[11px] text-slate-500 hover:text-slate-300 underline block mx-auto cursor-pointer"
                >
                  Omitir para esta sesión (Solo lectura)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 TOP HEADER S-CLASS CON DINÁMICA DE ROL */}
      <header className="h-20 bg-[#08080c] border-b border-white/10 px-6 md:px-10 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${activeRoleData.color} flex items-center justify-center shadow-lg`}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-sm uppercase tracking-widest text-white font-syne">ASTRA OS</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-purple-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{activeRoleData.badge}</span>
          </div>

          <button
            onClick={() => setShowBiometricModal(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/30 text-[10px] font-mono text-blue-300 hover:bg-blue-900/40 transition-colors cursor-pointer"
          >
            <Fingerprint className="w-3 h-3" /> Biometría
          </button>
        </div>

        {/* ROLE SELECTOR DROPDOWN DINÁMICO */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#121218] border border-white/10 hover:border-purple-500/40 text-xs font-mono font-bold uppercase transition-all cursor-pointer shadow-xl"
          >
            <Crown className="w-3.5 h-3.5 text-[#ecb613]" />
            <span className="text-white">{activeRoleData.label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <AnimatePresence>
            {isRoleDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 bg-[#0e0e14] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 space-y-1"
              >
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelectedRole(r.id);
                      setIsRoleDropdownOpen(false);
                      if (r.id === 'EMANAGER_ESTRATEGICO') {
                        setCurrentView('DANI_SUITE');
                      } else {
                        setCurrentView('ROADMAP');
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-0.5 cursor-pointer ${
                      selectedRole === r.id ? 'bg-purple-950/60 border border-purple-500/40 text-white' : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase font-mono">{r.label}</span>
                      <span className="text-[9px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded">{r.badge}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-light">{r.desc}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* 🌌 CUERPO PRINCIPAL CON SIDEBAR Y WORKSPACE */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* SIDEBAR NAVEGACIÓN */}
        <aside className="w-full md:w-64 bg-[#07070a] border-r border-white/5 p-6 flex flex-col justify-between space-y-8 shrink-0">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">NAVEGACIÓN</span>
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentView('COMMAND_CENTER')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2.5 cursor-pointer ${
                    currentView === 'COMMAND_CENTER' ? 'bg-purple-900/40 border border-purple-500/40 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Activity className="w-4 h-4 text-purple-400" /> Centro de Mando
                </button>

                <button
                  onClick={() => setCurrentView('ROADMAP')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2.5 cursor-pointer ${
                    currentView === 'ROADMAP' ? 'bg-purple-900/40 border border-purple-500/40 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Map className="w-4 h-4 text-[#ecb613]" /> Hoja de Ruta
                </button>

                <button
                  onClick={() => setCurrentView('WHEEL')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2.5 cursor-pointer ${
                    currentView === 'WHEEL' ? 'bg-purple-900/40 border border-purple-500/40 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Compass className="w-4 h-4 text-blue-400" /> Rueda de la Vida
                </button>

                <button
                  onClick={() => setCurrentView('TOOLKIT')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2.5 cursor-pointer ${
                    currentView === 'TOOLKIT' ? 'bg-purple-900/40 border border-purple-500/40 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Layers className="w-4 h-4 text-emerald-400" /> Hub de Herramientas
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 block">DANI ARAGÓN & MANAGEMENT</span>
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentView('DANI_SUITE')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2 cursor-pointer ${
                    currentView === 'DANI_SUITE' ? 'text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" /> Suite E-Manager
                </button>

                <button
                  onClick={() => setCurrentView('VAULT')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2 cursor-pointer ${
                    currentView === 'VAULT' ? 'text-[#ecb613] bg-white/5 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5 text-[#ecb613]" /> 56 Audios Masterclass
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase text-slate-400">SINCRONIZADO</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">ONLINE</span>
          </div>
        </aside>

        {/* WORKSPACE DINÁMICO */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          
          {/* VISTA A: SUITE E-MANAGER DANI ARAGÓN (SI SE SELECCIONA EMANAGER) */}
          {currentView === 'DANI_SUITE' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 max-w-5xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                    GOBERNANZA ARTÍSTICA & MANAGEMENT S-CLASS
                  </span>
                  <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-syne">
                    Suite E-Manager // Dani Aragón
                  </h1>
                  <p className="text-xs md:text-sm text-slate-400 font-light mt-1">
                    Vampirización de 56 lecciones magistrales y framework de negociación para blindar el caché del Paciente Cero.
                  </p>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-right">
                  <span className="text-[9px] font-mono uppercase text-slate-400 block">Caché Negociado</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">{emanagerBaseCache} €</span>
                </div>
              </div>

              {/* SIMULADOR DE NEGOCIACIÓN & CONTRATOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#09090d] border border-white/10 p-8 rounded-3xl space-y-6">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Scale className="w-5 h-5" />
                    <h3 className="font-bold text-sm uppercase font-mono text-white">1. Matriz de Contratación Mercantil</h3>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-mono text-slate-300">Tipo de Contrato / Régimen</label>
                    <select
                      value={emanagerContractType}
                      onChange={(e) => setEmanagerContractType(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-2xl text-xs font-mono focus:outline-none focus:border-emerald-400"
                    >
                      <option value="MERCANTIL_80_10_10" className="bg-black">Contrato Mercantil Escrow 80/10/10 (Recomendado)</option>
                      <option value="LCSP_ART118" className="bg-black">Contrato Menor B2G (Art. 118 LCSP)</option>
                      <option value="AGENCIA_B2B" className="bg-black">Convenio Agencia B2B (10% Comisión)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Caché Mínimo Garantizado</span>
                      <span className="text-emerald-400 font-bold">{emanagerBaseCache} €</span>
                    </div>
                    <input 
                      type="range" min="950" max="8000" step="50" value={emanagerBaseCache}
                      onChange={(e) => setEmanagerBaseCache(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Liquidación Neta Artista (80%):</span>
                      <span>{(emanagerBaseCache * 0.8).toFixed(0)} €</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Plataforma & Rider Bose (10%):</span>
                      <span>{(emanagerBaseCache * 0.1).toFixed(0)} €</span>
                    </div>
                    <div className="flex justify-between text-blue-400">
                      <span>Fondo Social VIMUME (10%):</span>
                      <span>{(emanagerBaseCache * 0.1).toFixed(0)} €</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#09090d] border border-emerald-500/30 p-8 rounded-3xl space-y-6 flex flex-col justify-between shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Bot className="w-5 h-5" />
                      <h3 className="font-bold text-sm uppercase font-mono text-white">Consultor IA E-Manager</h3>
                    </div>

                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      Genera el dictamen de negociación de Dani Aragón basado en el caché fijado y las 56 masterclasses.
                    </p>

                    <button
                      onClick={handleGenerateSynthesis}
                      disabled={isGeneratingSynthesis}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isGeneratingSynthesis ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Procesando Estrategia...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" /> Ejecutar Dictamen E-Manager
                        </>
                      )}
                    </button>

                    {synthesisResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-black/60 border border-emerald-500/20 rounded-2xl text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-line"
                      >
                        {synthesisResult}
                      </motion.div>
                    )}
                  </div>

                  <Link
                    href="/cotizador"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-black uppercase rounded-2xl transition-all text-center flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                  >
                    <Lock size={14} /> Aplicar Caché a Cotizador Oficial
                  </Link>
                </div>
              </div>

              {/* LISTA DE 4 MASTERCLASSES DESTACADAS DE DANI ARAGÓN */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold uppercase text-white font-mono flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-emerald-400" /> Masterclasses Extraídas de Dani Aragón (56 Audios en H:\)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DANI_ARAGON_MASTERCLASSES.map((mc) => (
                    <div key={mc.id} className="bg-[#09090d] border border-white/5 p-5 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                          {mc.type} • {mc.duration}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{mc.mentor}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{mc.title}</h4>
                      <p className="text-[11px] text-slate-400 font-light leading-relaxed">{mc.summary}</p>
                      
                      <button
                        onClick={() => setActiveAudioPlaying(activeAudioPlaying === mc.id ? null : mc.id)}
                        className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] font-bold uppercase rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        {activeAudioPlaying === mc.id ? 'Pausar Masterclass' : 'Reproducir Audio'}
                      </button>

                      {activeAudioPlaying === mc.id && (
                        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center space-y-1">
                          <span className="text-[10px] font-mono text-emerald-400 block animate-pulse">▶ Reproduciendo: {mc.audioFile}</span>
                          <span className="text-[9px] text-slate-400 font-mono">Consolidado en H:\incubadora despegue\DANI_ARAGON_FORMACION</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* VISTA 1: HOJA DE RUTA ESTRATÉGICA */}
          {currentView === 'ROADMAP' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 max-w-5xl mx-auto"
            >
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-syne">
                  Hoja de Ruta Estratégica
                </h1>
                <p className="text-xs md:text-sm text-slate-400 font-light">
                  Sigue el protocolo EAR para deconstruir y reconstruir tu carrera artística ({activeRoleData.label}).
                </p>
              </div>

              {/* FASE 1: DIAGNÓSTICO FORENSE */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase text-white font-syne">Fase 1: Diagnóstico Forense</h3>
                    <p className="text-xs text-slate-400 italic">"Sin diagnóstico no hay cura."</p>
                  </div>
                </div>

                {/* GUÍA DE SINCRONIZACIÓN */}
                <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-black border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#ecb613] font-bold block">GUÍA DE SINCRONIZACIÓN</span>
                      <p className="text-xs text-slate-300 font-light">Analiza tu situación actual sin filtros.</p>
                    </div>
                  </div>
                  <div className="border-l-2 border-purple-500/50 pl-4 text-xs text-slate-300 font-light">
                    Identifica fugas de recursos y cuellos de botella operativos.
                  </div>
                </div>

                {/* TOOL CARDS: LABORATORIO DE PERFIL & RUEDA DE LA VIDA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div 
                    onClick={() => setCurrentView('WHEEL')}
                    className="bg-[#0b0b10] border border-white/10 hover:border-purple-500/50 p-8 rounded-3xl space-y-4 cursor-pointer group transition-all shadow-xl"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-black uppercase text-white group-hover:text-[#ecb613] transition-colors font-syne">
                        Rueda de la Vida Artística
                      </h4>
                      <p className="text-xs text-slate-400 font-light">
                        Equilibra tu carrera con tu bienestar personal y evalúa tus 8 dimensiones.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-[#ecb613] flex items-center gap-1 font-bold pt-2">
                      Abrir Herramienta Interactiva →
                    </span>
                  </div>

                  <div 
                    onClick={() => setCurrentView('DANI_SUITE')}
                    className="bg-[#0b0b10] border border-white/10 hover:border-emerald-500/50 p-8 rounded-3xl space-y-4 cursor-pointer group transition-all shadow-xl"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-black uppercase text-white group-hover:text-emerald-400 transition-colors font-syne">
                        Suite E-Manager // Dani Aragón
                      </h4>
                      <p className="text-xs text-slate-400 font-light">
                        Gobernanza contractual, negociación de caché y split 80/10/10.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold pt-2">
                      Abrir Suite de Management →
                    </span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* VISTA 2: RUEDA DE LA VIDA ARTÍSTICA */}
          {currentView === 'WHEEL' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 max-w-6xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                  <button 
                    onClick={() => setCurrentView('ROADMAP')}
                    className="text-[10px] font-mono uppercase text-[#ecb613] hover:underline flex items-center gap-1 mb-2 cursor-pointer"
                  >
                    ← Volver al Centro de Mando
                  </button>
                  <h2 className="text-3xl font-black uppercase text-white font-syne">
                    Rueda de la Vida Artística
                  </h2>
                  <p className="text-xs text-slate-400 font-light">
                    Evalúa tu satisfacción actual en cada área clave. Arrastra los puntos en el gráfico o usa los controles deslizantes para ajustar los valores.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-purple-300 bg-purple-950/60 border border-purple-500/30 px-3 py-1.5 rounded-full">
                    {activeRoleData.label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* RADAR CHART SVG */}
                <div className="lg:col-span-1 bg-[#09090d] border border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center space-y-4 shadow-xl">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Proyección Radial de Equilibrio</span>
                  
                  <div className="w-full aspect-square max-w-[280px] relative flex items-center justify-center">
                    <svg viewBox="0 0 300 300" className="w-full h-full">
                      {[20, 40, 60, 80, 100].map((r) => (
                        <circle key={r} cx="150" cy="150" r={r} fill="none" stroke="#222" strokeWidth="1" />
                      ))}
                      {LIFE_DIMENSIONS.map((_, i) => {
                        const angle = (Math.PI * 2 / 8) * i - Math.PI / 2;
                        const x = 150 + 100 * Math.cos(angle);
                        const y = 150 + 100 * Math.sin(angle);
                        return <line key={i} x1="150" y1="150" x2={x} y2={y} stroke="#333" strokeWidth="1" />;
                      })}
                      <polygon
                        points={svgRadarPoints}
                        fill="rgba(168, 85, 247, 0.4)"
                        stroke="#a855f7"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  <span className="text-xs font-mono text-slate-500">8 Dimensiones Calibradas</span>
                </div>

                {/* CONTROLES DESLIZANTES */}
                <div className="lg:col-span-1 space-y-4 bg-[#09090d] border border-white/10 p-6 rounded-3xl shadow-xl">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block pb-2 border-b border-white/5">
                    Ajuste Fino de Dimensiones (1 a 10)
                  </span>
                  
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {LIFE_DIMENSIONS.map((dim) => (
                      <div key={dim} className="space-y-1.5 bg-white/5 p-3 rounded-2xl">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-white font-bold">{dim}</span>
                          <span className="text-[#ecb613] font-black">{wheelScores[dim]}/10</span>
                        </div>
                        <input
                          type="range" min="1" max="10" step="1"
                          value={wheelScores[dim]}
                          onChange={(e) => handleSliderChange(dim, parseInt(e.target.value, 10))}
                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* SÍNTESIS ESTRATÉGICA & ABOGADO DEL DIABLO */}
                <div className="lg:col-span-1 bg-[#09090d] border border-purple-500/30 p-6 rounded-3xl space-y-6 flex flex-col justify-between shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-purple-400">
                      <Bot className="w-5 h-5" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider">Sincronización Estratégica</span>
                    </div>

                    <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">¿Quieres que juegue al Abogado del Diablo con esta idea?</span>
                        <button
                          onClick={() => setIsDevilsAdvocateActive(!isDevilsAdvocateActive)}
                          className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                            isDevilsAdvocateActive ? 'bg-purple-600' : 'bg-white/20'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                            isDevilsAdvocateActive ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 font-light leading-relaxed">
                        Desafía tus supuestos de forma implacable para encontrar puntos ciegos antes de que el mercado te castigue.
                      </p>
                    </div>

                    <button
                      onClick={handleGenerateSynthesis}
                      disabled={isGeneratingSynthesis}
                      className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-mono text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isGeneratingSynthesis ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Analizando con Oráculo Astra...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" /> Generar Síntesis Estratégica
                        </>
                      )}
                    </button>

                    {synthesisResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-black/60 border border-white/10 rounded-2xl text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-line"
                      >
                        {synthesisResult}
                      </motion.div>
                    )}
                  </div>

                  <button
                    onClick={() => setCurrentView('DANI_SUITE')}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold uppercase rounded-2xl border border-white/10 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Completar y Seguir <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* VISTA 3: BÓVEDA DANI ARAGÓN */}
          {currentView === 'VAULT' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 max-w-5xl mx-auto"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-3xl font-black uppercase text-white font-syne">
                    Bóveda Formativa Dani Aragón (56 Audios en H:\)
                  </h2>
                  <p className="text-xs text-slate-400 font-light">
                    133 activos consolidados en H:\incubadora despegue\DANI_ARAGON_FORMACION para acelerar tu carrera.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('ROADMAP')}
                  className="text-xs font-mono text-[#ecb613] hover:underline"
                >
                  ← Volver a Hoja de Ruta
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DANI_ARAGON_MASTERCLASSES.map((mc) => (
                  <div key={mc.id} className="bg-[#09090d] border border-white/10 p-6 rounded-3xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded">
                        {mc.type} • {mc.duration}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{mc.mentor}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{mc.title}</h3>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">{mc.summary}</p>
                    
                    <button
                      onClick={() => setActiveAudioPlaying(activeAudioPlaying === mc.id ? null : mc.id)}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold uppercase rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      {activeAudioPlaying === mc.id ? 'Pausar Masterclass' : 'Reproducir Audio'}
                    </button>

                    {activeAudioPlaying === mc.id && (
                      <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center space-y-1">
                        <span className="text-[10px] font-mono text-emerald-400 block animate-pulse">▶ Reproduciendo: {mc.audioFile}</span>
                        <span className="text-[9px] text-slate-400 font-mono">Consolidado en H:\incubadora despegue\DANI_ARAGON_FORMACION</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* VISTAS GENÉRICAS (CENTRO DE MANDO / TOOLKIT) */}
          {(currentView === 'COMMAND_CENTER' || currentView === 'TOOLKIT') && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-5xl mx-auto"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black uppercase text-white font-syne">
                  Centro de Mando Neuronal
                </h2>
                <button
                  onClick={() => setCurrentView('ROADMAP')}
                  className="text-xs font-mono text-[#ecb613] hover:underline cursor-pointer"
                >
                  Volver a Hoja de Ruta
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  onClick={() => setCurrentView('WHEEL')}
                  className="bg-[#09090d] border border-white/10 hover:border-purple-500/50 p-6 rounded-3xl space-y-2 cursor-pointer transition-all"
                >
                  <Compass className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg font-bold text-white font-syne">Rueda de la Vida Artística</h3>
                  <p className="text-xs text-slate-400 font-light">Diagnóstico radial en 8 áreas clave.</p>
                </div>

                <div 
                  onClick={() => setCurrentView('DANI_SUITE')}
                  className="bg-[#09090d] border border-white/10 hover:border-emerald-500/50 p-6 rounded-3xl space-y-2 cursor-pointer transition-all"
                >
                  <Briefcase className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white font-syne">Suite E-Manager</h3>
                  <p className="text-xs text-slate-400 font-light">Gobernanza contractual y split 80/10/10.</p>
                </div>

                <div 
                  onClick={() => setCurrentView('VAULT')}
                  className="bg-[#09090d] border border-white/10 hover:border-[#ecb613]/50 p-6 rounded-3xl space-y-2 cursor-pointer transition-all"
                >
                  <Database className="w-6 h-6 text-[#ecb613]" />
                  <h3 className="text-lg font-bold text-white font-syne">Bóveda Dani Aragón</h3>
                  <p className="text-xs text-slate-400 font-light">56 audios de management y ventas.</p>
                </div>
              </div>
            </motion.div>
          )}

        </main>

      </div>

      {/* 🔮 ORB FLOTANTE DE ASISTENTE IA EN ESQUINA INFERIOR DERECHA */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setIsOrbOpen(!isOrbOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 hover:scale-110 transition-transform flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)] cursor-pointer text-white"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
        </button>

        <AnimatePresence>
          {isOrbOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-16 right-0 w-80 bg-[#0d0d12] border border-purple-500/40 p-6 rounded-3xl shadow-2xl space-y-4 text-xs font-mono"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-purple-400 font-bold uppercase flex items-center gap-1.5">
                  <Bot size={14} /> Oráculo Astra Activo
                </span>
                <button onClick={() => setIsOrbOpen(false)} className="text-slate-500 hover:text-white cursor-pointer">
                  <X size={14} />
                </button>
              </div>
              <p className="text-slate-300 font-light leading-relaxed">
                ¿Deseas analizar tu caché de mercado o resolver una duda técnica sobre tu próximo bolo con el Oráculo Astra?
              </p>
              <Link
                href="/cotizador"
                className="block w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-center rounded-xl font-bold uppercase tracking-wider"
              >
                Abrir Cotizador S-Class
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default AstraNeuralExperience;
