
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
    Heart, ShieldCheck, TrendingUp, Users, Music,
    ArrowRight, Mail, Anchor, Sun, Globe,
    Layers, Zap, Target, Award, Database, Microscope,
    Archive, Sparkles, Eye, Star, Infinity as InfinityIcon, Landmark,
    Newspaper, Building2, Stethoscope, Handshake,
    X, CheckCircle2, PlayCircle, Fingerprint, Map as MapIcon, Compass,
    Waves, Bird
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- DATA: VIMUME FRACTAL DATABASE ---
const TABS = [
    { id: 'vision', label: 'El Viaje', icon: Heart, color: '#FF6F61' },
    { id: 'metodo', label: 'Vanguardia', icon: Zap, color: '#E2FD6C' },
    { id: 'mecenas', label: 'Mecenas', icon: Users, color: '#0061FE' },
    { id: 'inversion', label: 'Donar', icon: Handshake, color: '#D4AF37' },
];

const DEPTH_LEVELS = [
    { level: 1, title: "La Chispa", subtitle: "Elevator Pitch Directo", description: "Una iniciativa pionera que ofrece a los mayores un espacio para revivir recuerdos y emociones mediante la música." },
    { level: 5, title: "Impacto Relacional", subtitle: "Familias e Instituciones", description: "Transformamos la 'visita de compromiso' en un 'reencuentro de alma' mediante la ciencia de la memoria." },
    { level: 10, title: "Protocolo de Autor", subtitle: "Patrimonio Sonoro Indestructible", description: "El estándar mundial de intervención musical sensorio-motora diseñado por Edwin Agudelo." },
];

const VIMUME_DATABASE = {
    dna: {
        mision: "Hacer 'nuestra parte' para devolver la dignidad a los mayores mediante el patrimonio sonoro.",
        vision: "VIMUME como estándar mundial de terapia no farmacológica musical.",
        colibri: "Fábula del colibrí: Cada pequeño gesto cuenta en el incendio de la soledad."
    },
    neuro: [
        { title: "Resiliencia 40Hz", summary: "Estimulación gamma (MIT) para la limpieza de placas amiloides.", icon: Zap, color: "text-blue-400" },
        { title: "DMN Activation", summary: "Anclaje autobiográfico en la 'Última Fortaleza' cerebral.", icon: Microscope, color: "text-ear-gold" },
        { title: "Sinergia Sensorial", summary: "Efecto Snoezelen: Olfato, Tacto y Oído en coherencia cultural.", icon: Layers, color: "text-green-400" }
    ],
    mecenas: [
        {
            id: "familia",
            cat: "Familia",
            title: "Familiares",
            vision: "Reconexión emocional y blindaje del legado de vida.",
            manifesto: "No somos una asociación de ayuda al cuidador, somos el puente técnico para que recuperes el alma de tu padre o madre antes de que sea tarde. Haz tu parte: el tiempo no espera.",
            deepContent: {
                problem: "La visitas se vuelven silenciosas, la desconexión genera culpa y el cuidador se agota.",
                solution: "Protocolo 'Huaraches de Memoria': No es solo escuchar música, es caminar juntos por el mapa emocional del mayor.",
                kpi: "92% de incremento en la comunicación verbal post-sesión.",
                action: "Activar mi Caja de Recuerdos",
                bullets: [
                    "Diseño de la 'Playlist de la Memoria' personalizada.",
                    "Entrenamiento en acompañamiento empático.",
                    "Acceso al Dashboard Neural de seguimiento."
                ]
            },
            icon: Heart,
            tags: ["ST-01", "Huaraches de Memoria"]
        },
        {
            id: "clinico",
            cat: "Clínico",
            title: "Terapeutas / Sanidad",
            vision: "Reducción de carga laboral mediante herramientas innovadoras.",
            manifesto: "No somos una academia de formación teórica, somos la infraestructura táctica que multiplica el impacto de tu terapia. Haz tu parte: eleva el estándar clínico de tu servicio.",
            deepContent: {
                problem: "Saturación asistencial y dificultad para conectar con pacientes apáticos.",
                solution: "Integración del pulso VIMUME 40Hz en las dinámicas de grupo.",
                kpi: "Reducción del 40% en episodios de agitación.",
                action: "Solicitar Protocolos Clínicos",
                bullets: [
                    "Protocolos de 30 min validados por neuropsicólogos.",
                    "Monitorización de bio-marcadores no invasiva.",
                    "Certificación en Estimulación Gamma EAR."
                ]
            },
            icon: Stethoscope,
            tags: ["ST-02", "Neuroplasticidad"]
        },
        {
            id: "gestion",
            cat: "Gestión",
            title: "Directores de Centros",
            vision: "Diferenciación competitiva y excelencia humana.",
            manifesto: "No somos una consultora de marketing, somos el estándar de dignidad que convierte tu residencia en un centro de vanguardia mundial. Haz tu parte: lidera la transformación del sector.",
            deepContent: {
                problem: "Mercado saturado y necesidad de valor diferencial real frente a la competencia.",
                solution: "Sello de Calidad 'Centro Amigo VIMUME': Un imán para familias que buscan lo mejor.",
                kpi: "Mejora del 15% en el índice de satisfacción familiar.",
                action: "Auditar mi Centro",
                bullets: [
                    "Formación in-house para auxiliares.",
                    "Marketing ético de alto impacto social.",
                    "Soberanía operativa: El sistema corre solo."
                ]
            },
            icon: Building2,
            tags: ["ST-03", "Certificación VIMUME"]
        },
        {
            id: "negocio",
            cat: "Económico",
            title: "Empresarios / RSC",
            vision: "Acceso al mercado senior mediante patrocinios de RSC.",
            manifesto: "No somos una ONG que pide caridad, somos el motor de impacto social que valida tu responsabilidad corporativa con métricas reales. Haz tu parte: invierte en legado, no en donativos vacíos.",
            deepContent: {
                problem: "Dificultad para conectar con el público senior de forma auténtica.",
                solution: "Patrocinio de Nodos VIMUME: Su marca asociada al rescate de la memoria.",
                kpi: "Impacto social directo y medible para reportes ESG.",
                action: "Convertirme en Mecenas B2B",
                bullets: [
                    "Presencia en el War Room de impacto.",
                    "Naming de salas de estimulación.",
                    "Relaciones públicas de alto valor humano."
                ]
            },
            icon: TrendingUp,
            tags: ["ST-04", "Market Access"]
        },
        {
            id: "prensa",
            cat: "Comunicación",
            title: "Medios de Prensa",
            vision: "Narrativas de esperanza y contenido humano incalculable.",
            manifesto: "No somos una agencia de noticias, somos la fábrica de historias de superación que el mundo necesita leer para creer en el futuro del envejecimiento. Haz tu parte: comparte la luz.",
            deepContent: {
                problem: "Saturación de noticias negativas sobre la soledad y el envejecimiento.",
                solution: "VIMUME Originals: Una fuente inagotable de historias de éxito y superación.",
                kpi: "Potencial viral de 0 a 100 en impacto emocional.",
                action: "Kit de Prensa Exclusivo",
                bullets: [
                    "Acceso a testimonios reales protegidos.",
                    "Metodología Edwin Agudelo en exclusiva.",
                    "Documentación visual de alta calidad."
                ]
            },
            icon: Newspaper,
            tags: ["Storytelling", "Virilidad Positiva"]
        },
        {
            id: "comunidad",
            cat: "Social",
            title: "Hogares del Jubilado",
            vision: "Justicia generacional en el corazón del barrio.",
            manifesto: "No somos un centro de ocio pasivo, somos el nodo de salud mental que devuelve la vida a la plaza del pueblo. Haz tu parte: reactiva a tus vecinos.",
            deepContent: {
                problem: "Centros que se limitan al ocio pasivo, perdiendo potencial terapéutico.",
                solution: "Nodos de Vitalidad VIMUME: El barrio como motor de salud mental.",
                kpi: "Reactivación del 65% de usuarios inactivos.",
                action: "Activar mi Barrio",
                bullets: [
                    "Coro de Memoria Activa.",
                    "Talleres de 'Huaraches de Memoria'.",
                    "Eventos intergeneracionales de impacto."
                ]
            },
            icon: Users,
            tags: ["Cercanía", "Justicia Social"]
        }
    ]
};

// --- COMPONENTS ---

interface GlowOrbProps {
    color: string;
    top: string;
    left: string;
    delay: number;
}

const GlowOrb: React.FC<GlowOrbProps> = ({ color, top, left, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.3, 1] }}
        transition={{ duration: 15, repeat: Infinity, delay, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-40"
        style={{ backgroundColor: color, top, left } as any}
    />
);

const VimumeDossier: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('vision');
    const [depth, setDepth] = useState(1);
    const [selectedMecenas, setSelectedMecenas] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    return (
        <div ref={containerRef} className="relative min-h-screen bg-[#080808] text-white font-sans selection:bg-ear-gold selection:text-black overflow-x-hidden">

            {/* --- NEURAL GRID BACKGROUND (SOLVE CONTRAST) --- */}
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div className="absolute inset-0 bg-gradient-to-tr from-ear-gold/5 via-transparent to-blue-500/5" />
            </div>

            {/* --- GLOW ORBS --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <GlowOrb color="#D4AF37" top="-10%" left="-10%" delay={0} />
                <GlowOrb color="#0061FE" top="40%" left="60%" delay={5} />
            </div>

            {/* --- HEADER --- */}
            <header className="relative h-[80vh] flex items-center justify-center border-b border-white/10 overflow-hidden z-10">
                <motion.div style={{ y: useTransform(smoothY, [0, 1], [0, 250]) }} className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/40" />
                </motion.div>

                <div className="relative z-10 text-center px-6 max-w-6xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/20 mb-8 backdrop-blur-3xl">
                        <Star size={14} className="text-ear-gold fill-ear-gold" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ear-gold">VIMUME Fractal • v2026.02</span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-6xl md:text-[10rem] font-display font-black italic uppercase leading-[0.8] mb-12">
                        EL VIAJE <br /> <span className="text-ear-gold text-outline">MAESTRO</span>
                    </motion.h1>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap justify-center gap-6 mt-12">
                        <button
                            onClick={() => setActiveTab('inversion')}
                            className="px-10 py-5 bg-ear-gold text-black font-black uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                        >
                            Hacer mi parte
                        </button>
                        <button
                            onClick={() => navigate('/contacto')}
                            className="px-10 py-5 bg-white/10 border border-white/20 text-white font-black uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-black transition-all"
                        >
                            Contacto Operativo
                        </button>
                    </motion.div>
                </div>
            </header>

            {/* --- CONTROLES (HIGH CONTRAST) --- */}
            <nav className="sticky top-0 z-[100] bg-[#0a0a0a]/95 backdrop-blur-3xl border-b border-white/20 py-8 shadow-2xl">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Depth */}
                    <div className="lg:col-span-5 flex items-center gap-8">
                        <div className="flex flex-col shrink-0">
                            <span className="text-[9px] font-black uppercase text-gray-500 mb-1">Profundidad Técnica</span>
                            <span className="text-3xl font-display font-black italic text-ear-gold">{depth}</span>
                        </div>
                        <input
                            type="range" min="1" max="10" step="1" value={depth}
                            onChange={(e) => setDepth(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-ear-gold [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-ear-gold [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>
                    {/* Tabs */}
                    <div className="lg:col-span-7 flex justify-end gap-10 items-center">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex flex-col items-center gap-2 transition-all ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                <tab.icon size={22} className={activeTab === tab.id ? 'text-ear-gold' : ''} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                                {activeTab === tab.id && <motion.div layoutId="tab-h" className="absolute -bottom-8 w-8 h-1 bg-ear-gold rounded-full shadow-[0_0_15px_#D4AF37]" />}
                            </button>
                        ))}
                        <button
                            onClick={() => setActiveTab('inversion')}
                            className="ml-6 px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-ear-gold transition-all animate-pulse hover:animate-none"
                        >
                            DONAR AHORA
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- CONTENIDO --- */}
            <main className="max-w-7xl mx-auto px-8 py-32 z-10 relative">
                <AnimatePresence mode="wait">
                    {activeTab === 'vision' && (
                        <motion.section key="v" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="space-y-48">
                            {/* Historia Hero */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                                <div className="space-y-12">
                                    <div className="w-16 h-1 bg-ear-gold" />
                                    <h2 className="text-5xl md:text-8xl font-display font-black uppercase italic leading-[0.9]">HACIENDO <br /> <span className="text-outline text-white">NUESTRA</span> PARTE</h2>
                                    <p className="text-2xl text-gray-300 font-light italic leading-loose">
                                        "{VIMUME_DATABASE.dna.mision}"
                                    </p>
                                    <div className="p-8 bg-white/5 border-l-4 border-ear-gold rounded-r-3xl">
                                        <p className="text-sm font-bold italic text-white/80 leading-relaxed">
                                            {VIMUME_DATABASE.dna.colibri}
                                        </p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-ear-gold/20 blur-[100px] rounded-full opacity-30" />
                                    <div className="relative aspect-square bg-[#111] border border-white/20 rounded-[5rem] overflow-hidden flex items-center justify-center p-12 text-center group">
                                        <div className="z-10 absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                                        <div className="relative z-20 space-y-8">
                                            <Heart size={120} className="text-ear-gold mx-auto group-hover:scale-110 transition-transform" />
                                            <p className="text-sm font-black uppercase tracking-[0.3em] text-white">Impacto Emocional v2026</p>
                                            <p className="text-xs text-gray-400 italic">"Despertando al colibrí en cada rincón de España."</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {activeTab === 'metodo' && (
                        <motion.section key="m" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-32">
                            <div className="text-center max-w-4xl mx-auto space-y-8">
                                <h3 className="text-5xl md:text-7xl font-display font-black uppercase italic text-ear-gold text-outline">VANGUARDIA NEURO</h3>
                                <p className="text-gray-400 uppercase tracking-widest text-xs font-black italic">Fundamentación Científica y Protocolo Piloto</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {VIMUME_DATABASE.neuro.map((item, i) => (
                                    <div key={i} className="p-12 rounded-[4rem] bg-white/[0.05] border border-white/20 hover:border-ear-gold/50 transition-all flex flex-col gap-10 shadow-xl">
                                        <div className={`p-6 rounded-3xl bg-white/5 border border-white/10 w-fit ${item.color}`}>
                                            <item.icon size={32} />
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-3xl font-display font-black uppercase italic leading-none">{item.title}</h4>
                                            <p className="text-sm text-gray-400 font-light leading-relaxed italic">{item.summary}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* PROTOCOLO MASTER (VISIBLE EN PROFUNDIDAD ALTA) */}
                            {depth >= 7 && (
                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="p-16 rounded-[5rem] bg-ear-gold text-black space-y-12 relative overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.3)]">
                                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-4">
                                                <ShieldCheck size={32} />
                                                <h4 className="text-4xl font-display font-black uppercase italic leading-none">Protocolo de Autor • Edwin Agudelo</h4>
                                            </div>
                                            <p className="text-xl font-bold italic leading-snug">
                                                "VIMUME integra la estimulación gamma 40Hz en música en directo, activando el Default Mode Network mediante la 'Última Fortaleza' musical. Es neurociencia aplicada al alma."
                                            </p>
                                            <div className="flex flex-wrap gap-4">
                                                <span className="px-6 py-3 border-2 border-black rounded-full text-[10px] font-black uppercase italic">Propiedad Intelectual Protegida</span>
                                                <span className="px-6 py-3 border-2 border-black rounded-full text-[10px] font-black uppercase italic">Mecanismo Único 2026</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-center">
                                            <InfinityIcon size={200} strokeWidth={1} className="opacity-20 translate-x-12 rotate-12 scale-125" />
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 p-12 opacity-10 font-display font-black text-9xl italic">GOLD</div>
                                </motion.div>
                            )}
                        </motion.section>
                    )}

                    {activeTab === 'mecenas' && (
                        <motion.section key="mec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-48">
                            <div className="text-center space-y-10">
                                <h3 className="text-6xl md:text-8xl font-display font-black uppercase italic tracking-tighter">MECENAS DEL <br /> <span className="text-ear-gold">REENCUENTRO</span></h3>
                                <p className="text-gray-500 uppercase tracking-[0.4em] text-[12px] font-black">Auditando el Impacto en cada nodo humano</p>
                            </div>

                            <AnimatePresence mode="wait">
                                {!selectedMecenas ? (
                                    <motion.div
                                        key="grid"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-5xl mx-auto"
                                    >
                                        {VIMUME_DATABASE.mecenas.map((m, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ y: -10, scale: 1.02 }}
                                                onClick={() => setSelectedMecenas(m)}
                                                className="cursor-pointer p-12 rounded-[3.5rem] bg-white/[0.05] border border-white/20 hover:border-ear-gold/50 hover:bg-white/[0.1] transition-all flex flex-col gap-10 group relative overflow-hidden"
                                            >
                                                <div className="flex justify-between items-start z-10">
                                                    <div className="w-16 h-16 rounded-2xl bg-ear-gold/10 flex items-center justify-center text-ear-gold border border-ear-gold/20 group-hover:bg-ear-gold group-hover:text-black transition-all">
                                                        <m.icon size={32} />
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[9px] font-black text-ear-gold uppercase tracking-widest">{m.cat}</span>
                                                        <span className="text-[8px] font-mono text-zinc-500 uppercase">DEPTH: LEVEL {depth >= 5 ? 'ACTIVE' : 'LOCKED'}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-6 z-10">
                                                    <h4 className="text-4xl font-display font-black uppercase italic leading-none text-white">{m.title}</h4>
                                                    <p className="text-lg text-gray-400 font-light italic leading-snug">{m.vision}</p>
                                                </div>
                                                <div className="mt-4 flex flex-wrap gap-2 z-10">
                                                    {m.tags.map((t, j) => (
                                                        <span key={j} className="text-[10px] font-black uppercase tracking-tighter text-ear-gold/40 border border-ear-gold/20 px-3 py-1 rounded-full">#{t}</span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-2 text-ear-gold text-[10px] font-black uppercase mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Profundizar en Fractal <ArrowRight size={14} />
                                                </div>

                                                {/* Background decoration */}
                                                <div className="absolute top-0 right-0 p-12 opacity-5 font-display font-black text-9xl italic pointer-events-none">{m.id.substring(0, 3).toUpperCase()}</div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="detail"
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        className="max-w-6xl mx-auto"
                                    >
                                        <button
                                            onClick={() => setSelectedMecenas(null)}
                                            className="flex items-center gap-4 text-ear-gold text-[10px] font-black uppercase tracking-[0.3em] mb-12 hover:translate-x-[-10px] transition-transform"
                                        >
                                            <X size={16} /> Volver a la Red Fractal
                                        </button>

                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                                            {/* Left: Summary */}
                                            <div className="lg:col-span-5 space-y-12">
                                                <div className="w-24 h-24 rounded-[2rem] bg-ear-gold text-black flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.4)]">
                                                    {(() => {
                                                        const IconMec = selectedMecenas.icon;
                                                        return <IconMec size={48} />;
                                                    })()}
                                                </div>
                                                <div className="space-y-8">
                                                    <h4 className="text-6xl font-display font-black uppercase italic text-ear-gold leading-none">{selectedMecenas.title}</h4>
                                                    <p className="text-xl text-white font-bold italic leading-tight uppercase border-l-4 border-white pl-6">
                                                        {selectedMecenas.manifesto}
                                                    </p>
                                                </div>
                                                <div className="p-8 bg-zinc-900/50 border border-white/10 rounded-[3rem] space-y-6">
                                                    <div className="flex items-center gap-3 text-green-400">
                                                        <CheckCircle2 size={20} />
                                                        <span className="text-xs font-black uppercase tracking-[0.2em]">KPI de Impacto</span>
                                                    </div>
                                                    <p className="text-3xl font-display font-black italic">{selectedMecenas.deepContent.kpi}</p>
                                                </div>
                                            </div>

                                            {/* Right: Deep Content */}
                                            <div className="lg:col-span-7 space-y-12">
                                                <div className="space-y-4">
                                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">El Problema</span>
                                                    <p className="text-xl text-zinc-300 font-light italic leading-relaxed">{selectedMecenas.deepContent.problem}</p>
                                                </div>

                                                <div className="space-y-4">
                                                    <span className="text-[10px] font-black text-ear-gold uppercase tracking-widest">La Solución Fractal</span>
                                                    <p className="text-2xl text-white font-bold italic leading-relaxed border-l-4 border-ear-gold pl-8 uppercase">{selectedMecenas.deepContent.solution}</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {selectedMecenas.deepContent.bullets.map((bullet: string, idx: number) => (
                                                        <div key={idx} className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-ear-gold/30 transition-colors group">
                                                            <div className="mt-1">
                                                                <Fingerprint size={16} className="text-ear-gold opacity-50 group-hover:opacity-100" />
                                                            </div>
                                                            <span className="text-sm text-zinc-400 italic font-medium">{bullet}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="pt-12 flex gap-6">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => navigate('/contacto')}
                                                        className="flex-1 py-6 bg-ear-gold text-black font-black uppercase tracking-[0.3em] rounded-full text-xs shadow-xl flex items-center justify-center gap-4"
                                                    >
                                                        {selectedMecenas.deepContent.action} <PlayCircle size={18} />
                                                    </motion.button>
                                                    <button
                                                        onClick={() => setSelectedMecenas(null)}
                                                        className="px-8 py-6 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.3em] rounded-full text-[10px] hover:bg-white/10 transition-all text-center"
                                                    >
                                                        Cerrar Nodo
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.section>
                    )}

                    {activeTab === 'inversion' && (
                        <motion.section key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
                            {/* STORYTELLING HEADER */}
                            <div className="text-center space-y-8 mb-32">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="inline-block"
                                >
                                    <Bird size={60} className="text-ear-gold mx-auto" />
                                </motion.div>
                                <h2 className="text-6xl md:text-8xl font-display font-black uppercase italic leading-none tracking-tighter">
                                    EL MAPA DEL <br /> <span className="text-ear-gold">TESORO ALMA</span>
                                </h2>
                                <p className="max-w-2xl mx-auto text-gray-400 font-light italic text-lg leading-relaxed">
                                    "No somos una caja de ahorros, somos el mapa que protege el oro de tu linaje: los recuerdos. Deposita tus migas de pan y ayúdanos a despejar la niebla."
                                </p>
                            </div>

                            {/* SCROLLYTELLING JOURNEY */}
                            <div className="space-y-64 pb-64">
                                {[
                                    {
                                        title: "La Estación de la Niebla",
                                        desc: "Donde los nombres empiezan a desvanecerse. Tu primera 'miga' enciende un faro en el hipocampo.",
                                        icon: Waves,
                                        treasure: "El aroma de la cocina de la abuela."
                                    },
                                    {
                                        title: "El Valle del Primer Baile",
                                        desc: "Sincronizamos la frecuencia 40Hz para rescatar el ritmo de aquel verano del 65.",
                                        icon: Music,
                                        treasure: "Aquella canción que les hizo inseparables."
                                    },
                                    {
                                        title: "La Cumbre del Legado",
                                        desc: "El tesoro final: una biografía sonora blindada para las próximas generaciones.",
                                        icon: Award,
                                        treasure: "La voz de tu padre diciendo 'estoy aquí'."
                                    }
                                ].map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: false, margin: "-100px" }}
                                        className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center`}
                                    >
                                        <div className="flex-1 space-y-6">
                                            <div className="flex items-center gap-4 text-ear-gold">
                                                <div className="w-12 h-12 rounded-full border border-ear-gold flex items-center justify-center font-black">{idx + 1}</div>
                                                <h3 className="text-4xl font-display font-black uppercase italic">{step.title}</h3>
                                            </div>
                                            <p className="text-xl text-gray-400 font-light italic leading-relaxed">{step.desc}</p>
                                            <div className="p-6 bg-white/5 border-l-2 border-ear-gold rounded-r-2xl inline-block">
                                                <span className="text-[10px] font-black uppercase text-ear-gold tracking-widest block mb-1">Tesoro a Rescatar:</span>
                                                <span className="text-white font-bold italic">{step.treasure}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex justify-center">
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-ear-gold/20 blur-[60px] rounded-full group-hover:bg-ear-gold/40 transition-all" />
                                                <div className="relative w-64 h-64 bg-zinc-900 border border-white/10 rounded-[3rem] flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-700">
                                                    <step.icon size={80} className="text-ear-gold -rotate-45 group-hover:rotate-0 transition-transform duration-700" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* DONATION TIERS: MIGAS DE PAN */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-32">
                                {[
                                    { title: "Miga de Supervivencia", price: "Suscripción Libre", desc: "Mantén encendida la luz de un nodo local.", icon: Compass },
                                    { title: "Vuelo de Reconexión", price: "Donación Táctica", desc: "Financia una intervención de 'Huaraches de Memoria'.", icon: Zap },
                                    { title: "Tesoro de Linaje", price: "Inversión en Legado", desc: "Blindaje completo de la biografía sonora familiar.", icon: ShieldCheck },
                                ].map((tier, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -20 }}
                                        className={`p-10 rounded-[4rem] flex flex-col items-center text-center gap-8 transition-all ${idx === 1 ? 'bg-ear-gold text-black shadow-[0_0_80px_rgba(212,175,55,0.3)]' : 'bg-white/5 border border-white/20'}`}
                                    >
                                        <tier.icon size={50} />
                                        <div className="space-y-2">
                                            <h4 className="text-2xl font-display font-black uppercase italic">{tier.title}</h4>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${idx === 1 ? 'text-black/60' : 'text-ear-gold'}`}>{tier.price}</p>
                                        </div>
                                        <p className={`text-sm italic leading-relaxed ${idx === 1 ? 'text-black' : 'text-gray-400'}`}>{tier.desc}</p>
                                        <button className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-[10px] transition-all ${idx === 1 ? 'bg-black text-white hover:bg-zinc-800' : 'bg-white/10 border border-white/20 hover:bg-white hover:text-black'}`}>
                                            Depositar Miga
                                        </button>
                                    </motion.div>
                                ))}
                