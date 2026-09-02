import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Users,
    Briefcase,
    Music,
    Globe,
    Shield,
    Terminal,
    Zap,
    BarChart3,
    ArrowUpRight,
    Search,
    Calendar,
    AlertTriangle,
    BrainCircuit,
    LayoutDashboard,
    type LucideIcon,
    Flame,
    TrendingUp,
    MapPin,
    Command,
    ExternalLink,
    Rocket,
    Moon,
    Sun,
    ChevronRight,
    Target,
    Download,
    MessageCircle,
    CheckCircle2,
    Lock,
    Unlock,
    ActivitySquare,
    Cpu,
    Smartphone,
    MonitorIcon,
    Radio,
    Crosshair,
    GitBranch,
    RefreshCw,
    BookOpen,
    ArrowRight,
    X,
    PieChart,
    AlertCircle,
    Heart,
    Building2,
    Filter,
    Monitor,
    Radio as TowerControl // Usamos Radio como icono provisional para Torre de Control
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import SEO from '../../components/SEO';
import { SmartMatchMaker } from '../../modules/Matching/SmartMatchMaker';
import { VampirePanel } from './panels/VampirePanel';
import { MarketingEngine } from '../tools/MarketingEngine';
import { KnowledgeArchitect } from '../tools/KnowledgeArchitect';
import { PricingIntelligence } from '../tools/PricingIntelligence';
import { BudgetPredictor } from '../tools/BudgetPredictor';
import { AstraWarRoom } from '../../components/dashboard/widgets/AstraWarRoom';
import { earOpsService } from '../../services/earOpsService';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { MatchAsistido } from '../../components/MatchAsistido';
import { MagneticElement } from '../../components/effects/MagneticElement';
import { TextReveal } from '../../components/effects/TextReveal';
import { DispatchControlTower } from '../../components/dashboard/dispatch/DispatchControlTower';
import { useSuit } from '../../contexts/SuitContext';
import { db } from '../../lib/firebase';
import {
    collection,
    query,
    orderBy,
    limit,
    onSnapshot,
    addDoc,
    serverTimestamp,
    where,
    doc,
    updateDoc
} from 'firebase/firestore';

import { UrlIndexPanel } from '../../components/dashboard/panels/UrlIndexPanel';
import { RoadmapPanel } from '../../components/dashboard/panels/RoadmapPanel';
import { InstitucionalPanel } from '../../components/dashboard/panels/InstitucionalPanel';
import { MarketIntelCharts } from '../../components/dashboard/MarketIntelCharts';
import marketData from '../../data/market_intel_2026.json';

// --- TYPES ---
type DashboardTab = 'COMMAND' | 'STITCH' | 'DISPATCH' | 'CFO' | 'AFFILIATES' | 'CRO' | 'CRM' | 'ARTIST_HUB' | 'MARKET' | 'B2B_ESTATES' | 'BRAIN' | 'ACADEMY' | 'URL_INDEX' | 'ROADMAP' | 'INSTITUCIONAL';

const EarCommandCenter: React.FC = () => {

    const { user } = useAuth();
    const navigate = useNavigate();
    const { activeSuit } = useSuit();
    const [currentTab, setCurrentTab] = useState<DashboardTab>('COMMAND');

    // Auto-switch to STITCH if in Vanguard mode
    useEffect(() => {
        if (activeSuit === 'vanguard') {
            setCurrentTab('STITCH');
        }
    }, [activeSuit]);

    const [isDarkMode, setIsDarkMode] = useState(true);
    const [academyXp, setAcademyXp] = useState(150);
    const [academyProgress, setAcademyProgress] = useState(12);
    const [logs, setLogs] = useState<any[]>([]);

    // --- ADMIN MODULE COVERAGE ---
    const MODULE_STATUS = { active: 6, total: 18, construction: 12 };

    useEffect(() => {
        // Inicializar logs desde eventos
        const handleNewLog = (e: any) => {
            setLogs(prev => [e.detail, ...prev].slice(0, 10));
        };
        window.addEventListener('ear-new-log', handleNewLog);

        // Log de entrada inicial
        earOpsService.logAction({
            userId: user?.id || 'anonymous',
            userName: user?.name || 'Comandante',
            action: 'command_center_access',
            detail: 'Sincronía Sovereign Edition OK',
            type: 'SYSTEM'
        });

        return () => window.removeEventListener('ear-new-log', handleNewLog);
    }, [user]);

    const handleAction = async (action: string, detail: string, route?: string) => {
        await earOpsService.logAction({
            userId: user?.id || 'root',
            userName: user?.name || 'Edwin Agudelo',
            action,
            detail,
            type: 'COMMAND'
        });
        toast.success(`Protocolo ${action} activado: ${detail}`);
        if (route) navigate(route);
    };

    const handleCompleteMission = async () => {
        if (!user) return;
        const reward = 50;
        await earOpsService.completeMission(user.id, 'mentalidad-guerra-01', reward);
        setAcademyXp(prev => prev + reward);
        setAcademyProgress(prev => Math.min(100, prev + 5));
        toast.success(`¡Misión Completada! +${reward} XP acumulada.`, {
            icon: '🎯'
        });
    };

    return (
        <div className={`min-h-screen font-montserrat transition-colors duration-500 ${isDarkMode ? 'bg-[#050505] text-[#F5F5F7]' : 'bg-[#FAFAFA] text-[#0A0A0A]'}`}>
            <SEO title="COMMAND CENTER | Sovereign Edition" description="Centro de Control de Productora EAR. Bajo la dirección de Edwin Agudelo." />

            {/* SCANLINE OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

            <div className="w-full px-4 md:px-8 lg:px-12 py-6 space-y-10 relative z-10">

                <header className="flex flex-wrap items-center justify-between gap-6 border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <TextReveal delay={0.1} className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none" as="h1">
                            TABLERO DE <span className="text-ear-gold text-outline-sm">MANDO</span> (Dashboard)
                        </TextReveal>
                        <div className="flex items-center gap-4">
                            <span className="text-zinc-600 text-xs uppercase tracking-[0.5em] font-black">SOVEREIGN EDITION • RELANZAMIENTO 2026</span>
                            <div className="h-px w-24 bg-white/10" />
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-zinc-400 flex items-center gap-2">
                                <Activity size={10} className="text-green-500 animate-pulse" /> IA ENGINE: ONLINE
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                    <button 
                        onClick={() => setCurrentTab('VAMPIRE')}
                        className="px-4 py-2 bg-red-900/20 border border-red-500/30 rounded-full text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                    >
                        <Flame size={12} /> INTEL
                    </button>
        
                        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/10 shadow-2xl">
                            <div className="flex items-center gap-4 mb-2">
                                <Shield className="text-ear-gold" size={20} />
                                <div>
                                    <p className="text-xs text-zinc-500 font-black uppercase tracking-widest">Protocolo Activo</p>
                                    <p className="text-sm font-black text-white italic uppercase">DIAMANTE ROJO</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- NASA / COMMAND HUD --- */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <MagneticElement strength={0.2}>
                        <button className="h-full w-full p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl group hover:bg-blue-600 hover:text-white transition-all text-left">
                            <div className="flex justify-between items-start mb-4">
                                <Cpu size={24} className="text-blue-500 group-hover:text-white" />
                                <span className="text-xs font-black uppercase text-blue-500 group-hover:text-white">AZUL</span>
                            </div>
                            <h3 className="text-lg font-black italic uppercase tracking-tighter mb-1">1_CONSEJO_Astra.bat</h3>
                            <p className="text-xs text-zinc-500 group-hover:text-blue-200 font-bold uppercase transition-colors">Puente con IA & Legado</p>
                        </button>
                    </MagneticElement>

                    <MagneticElement strength={0.2}>
                        <button className="h-full w-full p-6 bg-green-600/10 border border-green-500/20 rounded-3xl group hover:bg-green-600 hover:text-white transition-all text-left">
                            <div className="flex justify-between items-start mb-4">
                                <Zap size={24} className="text-green-500 group-hover:text-white" />
                                <span className="text-xs font-black uppercase text-green-500 group-hover:text-white">VERDE</span>
                            </div>
                            <h3 className="text-lg font-black italic uppercase tracking-tighter mb-1">2_LANZAR_WEB.bat</h3>
                            <p className="text-xs text-zinc-500 group-hover:text-green-200 font-bold uppercase transition-colors">Publicar Cambios Live</p>
                        </button>
                    </MagneticElement>

                    <MagneticElement strength={0.2}>
                        <button className="h-full w-full p-6 bg-red-600/10 border border-red-500/20 rounded-3xl group hover:bg-red-600 hover:text-white transition-all text-left relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                            <div className="flex justify-between items-start mb-4">
                                <Flame size={24} className="text-red-500 group-hover:text-white" />
                                <span className="text-xs font-black uppercase text-red-500 group-hover:text-white">ZONA ROJA (Red Zone)</span>
                            </div>
                            <h3 className="text-lg font-black italic uppercase tracking-tighter mb-1">3_WAR_ROOM.bat</h3>
                            <p className="text-xs text-zinc-500 group-hover:text-red-200 font-bold uppercase transition-colors">Monitorización Global & Defensa</p>
                        </button>
                    </MagneticElement>

                    <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-3xl flex flex-col justify-center">
                        <h4 className="text-xs text-zinc-500 font-black uppercase tracking-widest mb-4">Documentación Crítica</h4>
                        <Link to="/docs/CLAVES.md" className="flex items-center justify-between p-3 bg-black/40 rounded-xl hover:border-ear-gold transition-all border border-transparent">
                            <span className="text-xs font-black text-white italic">DOCUMENTO_CLAVES.md</span>
                            <ExternalLink size={12} className="text-zinc-600" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 pt-6">

                    {/* --- SIDEBAR MENU (REFINED) --- */}
                    <aside className="lg:col-span-2 space-y-8 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 scrollbar-none sticky top-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] px-4">Ecosistema Operativo</p>
                            <MenuButton active={currentTab === 'COMMAND'} onClick={() => setCurrentTab('COMMAND')} icon={LayoutDashboard} label="Centro de Mando (Command Center)" />
                            <Link to="/admin/war-room">
                                <MenuButton active={false} onClick={() => { }} icon={Shield} label="Sala de Guerra (War Room)" />
                            </Link>
                            <MenuButton active={currentTab === 'DISPATCH'} onClick={() => setCurrentTab('DISPATCH')} icon={TowerControl} label="Mapa de Flota (Fleet Map)" />
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] px-4">Unidades de Negocio</p>
                            <Link to="/mi-boda">
                                <MenuButton active={false} onClick={() => { }} icon={Heart} label="Match de Bodas (Wedding Match)" />
                            </Link>
                            <MenuButton active={currentTab === 'B2B_ESTATES'} onClick={() => setCurrentTab('B2B_ESTATES')} icon={Briefcase} label="Cabina de Espacios (Venues Cockpit)" />
                            <MenuButton active={currentTab === 'INSTITUCIONAL'} onClick={() => setCurrentTab('INSTITUCIONAL')} icon={Building2} label="Legado VIMUME (Institutional Legacy)" />
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] px-4">Inteligencia & Auditoría</p>
                            <Link to="/ops/fander">
                                <MenuButton active={false} onClick={() => { }} icon={Search} label="Escáner Fander (Fander Scanner)" />
                            </Link>
                            <MenuButton active={currentTab === 'ARTIST_HUB'} onClick={() => setCurrentTab('ARTIST_HUB')} icon={Music} label="Hub de Señales (The Signal Hub)" />
                            <MenuButton active={currentTab === 'CFO'} onClick={() => setCurrentTab('CFO')} icon={Zap} label="Simulador de ROI (ROI Simulator)" />
                        </div>

                        <div className="space-y-2 pt-4 border-t border-white/5">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] px-4">Módulos CORE</p>
                            <MenuButton active={currentTab === 'STITCH'} onClick={() => setCurrentTab('STITCH')} icon={Command} label="Consola Stitch (Stitch Engine)" />
                            <Link to="/admin/nexus">
                                <MenuButton active={false} onClick={() => { }} icon={Rocket} label="Nexus (Manual Soberano)" />
                            </Link>
                            <MenuButton active={currentTab === 'URL_INDEX'} onClick={() => setCurrentTab('URL_INDEX')} icon={Globe} label="Catálogo URLs (URL Index)" />
                            <MenuButton active={currentTab === 'ROADMAP'} onClick={() => setCurrentTab('ROADMAP')} icon={ActivitySquare} label="Hoja de Ruta (Roadmap)" />
                        </div>

                        <div className="pt-8 space-y-4 border-t border-white/5">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                                <input
                                    type="text"
                                    placeholder="Buscar Protocolo... (Search)"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 text-xs font-bold text-white focus:outline-none focus:border-ear-gold/40"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-gray-700 bg-black px-1.5 py-0.5 rounded">K</span>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.08] transition-all cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-ear-gold/20 flex items-center justify-center border border-ear-gold/30">
                                    <span className="text-ear-gold font-bold text-sm uppercase">EA</span>
                                </div>
                                <div>
                                    <p className="text-sm font-black uppercase text-white leading-none mb-1">EDWIN AGUDELO</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sovereign Admin</p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* --- MAIN TACTICAL VIEW --- */}
                    <main className="lg:col-span-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTab}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="min-h-[600px] space-y-8"
                            >
                                {currentTab === 'COMMAND' && <OverviewPanel onAction={handleAction} />}
                                {currentTab === 'STITCH' && <StitchConsole onAction={handleAction} />}
                                {currentTab === 'DISPATCH' && <DispatchControlTower />}
                                {currentTab === 'CFO' && <FinancialPanel />}
                                {currentTab === 'ARTIST_HUB' && <ArtistHubPanel />}
                                {currentTab === 'AFFILIATES' && <AffiliatesPanel />}
                                {currentTab === 'CRO' && <CROPanel />}
                                {currentTab === 'CRM' && <CRMPanel />}
                                {currentTab === 'B2B_ESTATES' && <VenuesB2BPanel />}
                                {currentTab === 'INSTITUCIONAL' && <InstitucionalPanel />}
                                {currentTab === 'URL_INDEX' && <UrlIndexPanel />}
                                {currentTab === 'ROADMAP' && <RoadmapPanel />}




                                {currentTab === 'MARKET' && <MarketPanel />}
                                {currentTab === 'ACADEMY' && (
                                    <AcademyPanel
                                        xp={academyXp}
                                        progress={academyProgress}
                                        onComplete={handleCompleteMission}
                                        onAction={handleAction}
                                    />
                                )}
                                {currentTab === 'B2B_ESTATES' && (
                                    <div className="flex flex-col items-center justify-center h-[500px] border border-dashed border-white/10 rounded-[3rem] opacity-40">
                                        <Briefcase className="text-ear-gold mb-4" size={48} />
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Nodo B2B en construcción</h3>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mt-2">Sincronizando recursos remotos...</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>

                {/* --- SOVEREIGN FOOTER --- */}
                <footer className="pt-20 border-t border-white/5 space-y-12 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="space-y-6">
                            <div className="text-2xl font-display font-black tracking-widest italic uppercase">
                                PRODUCTORA <span className="text-ear-gold">EAR</span>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold leading-relaxed uppercase tracking-wider">
                                Bajo la dirección de Edwin Agudelo (CEO & eManager), construimos la infraestructura invisible de los eventos más memorables.
                            </p>
                            <div className="flex gap-4 items-center">
                                <ActivitySquare size={16} className="text-ear-gold" />
                                <span className="text-xs font-black uppercase tracking-[0.4em] text-white">Canales de Autoridad</span>
                            </div>
                        </div>

                        <FooterNav title="Explorar" links={[
                            { label: 'Arquitectura EAR', to: '/about' },
                            { label: 'Bodas', to: '/bodas' },
                            { label: 'Partners (Planners)', to: '/wedding-planners' }
                        ]} />

                        <FooterNav title="Módulos" links={[
                            { label: 'Dossier (Índice)', to: '/dossier' },
                            { label: 'Academia EAR', to: '/academy' },
                            { label: 'Arsenal Técnico', to: '/arsenal' },
                            { label: 'Mando Nupcial', to: '/mi-boda' }
                        ]} />

                        <div className="space-y-6">
                            <StatBox label="APOYAR PROYECTO" value="DONAR" onClick={() => navigate('/vimume')} className="cursor-pointer" />
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase text-white">Hub de Contacto</p>
                                <div className="space-y-2 text-[10px] text-gray-400 font-bold">
                                    <p className="flex items-center gap-3"><ChevronRight size={14} className="text-ear-gold" /> +34 693 693 048</p>
                                    <p className="flex items-center gap-3"><ChevronRight size={14} className="text-ear-gold" /> productoraear@gmail.com</p>
                                    <p className="flex items-center gap-3"><MapPin size={14} className="text-ear-gold" /> Calle Tórtola 5, 45930 Toledo.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
                        <p className="text-xs font-black uppercase text-gray-600 tracking-widest">© 2026 PRODUCTORA EAR. BLINDADO POR DISEÑO.</p>
                        <div className="flex gap-8 text-xs font-black uppercase text-gray-600">
                            <Link to="/privacy" className="hover:text-white">Privacidad</Link>
                            <Link to="/terms" className="hover:text-white">Términos</Link>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-black uppercase tracking-widest text-gray-400">
                            Cobertura Módulos: <span className="text-ear-gold ml-1">{MODULE_STATUS.active}/{MODULE_STATUS.total}</span> <span className="text-gray-600 mx-1">·</span> <span className="text-blue-400">{MODULE_STATUS.construction} EN CONS.</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

// --- PANELS ---

const OverviewPanel = ({ onAction }: { onAction: (a: string, d: string, r?: string) => void }) => (
    <div className="space-y-10">
        <div className="flex items-center justify-between">
            <h3 className="text-4xl font-display font-black uppercase italic tracking-tighter text-white">
                PROTOCOLO <span className="text-ear-gold">DIAMANTE ROJO (Red Diamond)</span>
            </h3>
            <div className="flex gap-4">
                <QuickBtn icon={Shield} label="WAR ROOM" onClick={() => onAction('INVOKE', 'WAR ROOM', '/ops/war-room')} />
                <QuickBtn icon={BrainCircuit} label="AI STUDIO" onClick={() => onAction('INVOKE', 'AI STUDIO', '/dashboard/tools/ai-studio')} />
                <QuickBtn icon={Terminal} label="EMANAGER" onClick={() => onAction('INVOKE', 'EMANAGER', '/ops/emanager')} />
                <QuickBtn icon={Globe} label="RASTREO (TRACKER)" onClick={() => onAction('INVOKE', 'LIVE TRACKER', '/live-tracker')} />
            </div>
        </div>

        <FilterBar />

        <StrategicCoreModule onAction={onAction} />

        {/* BAÑO DE REALIDAD & ESTRATEGIA SUPREMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BentoCard title="Diagnóstico Objetivo" subtitle="Estado de la Metamorfosis">
                <div className="space-y-4 py-2 relative group/reality">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-black text-gray-400 uppercase italic">Fase: Artista ➔ BOSS</span>
                        <span className="text-xs font-black text-ear-gold uppercase italic">65% Trans</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '65%' }}
                            className="h-full bg-ear-gold"
                        />
                    </div>
                    <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl group-hover:border-red-500/30 transition-all">
                        <p className="text-xs font-black text-red-400 uppercase leading-relaxed">
                            "El caos se refugió en lo digital. Hoy, el código es tu paz mental."
                        </p>
                    </div>
                    {/* GUIDE TOOLTIP */}
                    <div className="absolute -top-12 left-0 w-full bg-zinc-900 border border-white/10 p-3 rounded-xl opacity-0 translate-y-2 group-hover/reality:opacity-100 group-hover/reality:translate-y-0 transition-all pointer-events-none z-50">
                        <p className="text-xs font-black text-white uppercase italic mb-1">Guía del Comandante:</p>
                        <p className="text-xs text-zinc-500 font-bold uppercase leading-tight">Mide cuánto del negocio depende de tu presencia física vs. procesos automatizados.</p>
                    </div>
                </div>
            </BentoCard>

            <BentoCard title="Océano VIMUME" subtitle="Silver Economy Mastery">
                <div className="space-y-4 py-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                            <Heart size={18} className="text-pink-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-white uppercase italic">Impacto Social</p>
                            <p className="text-xs text-gray-500 font-bold uppercase">Legacy System ACTIVE</p>
                        </div>
                    </div>
                    <button className="w-full py-2 bg-pink-500/10 hover:bg-pink-500 text-pink-500 hover:text-white text-xs font-black uppercase tracking-widest rounded-lg transition-all border border-pink-500/20">
                        Ver Dossier Ayuntamientos
                    </button>
                </div>
            </BentoCard>

            <BentoCard title="Mando Ferias" subtitle="IFEMA / Grandes Cuentas" danger={true}>
                <div className="space-y-4 py-2 relative group/feria">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover/feria:border-red-500/30 transition-colors">
                            <Building2 size={18} className="text-blue-500 group-hover/feria:text-red-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-white uppercase italic">Tracking Activo</p>
                            <p className="text-xs text-gray-500 font-bold uppercase">IFEMA 365 Pipeline</p>
                        </div>
                    </div>
                    <button className="w-full py-2 bg-blue-500/10 hover:bg-red-500 text-blue-400 hover:text-white text-xs font-black uppercase tracking-widest rounded-lg transition-all border border-blue-500/20">
                        Consultar Licitaciones
                    </button>
                    {/* RED LINE OF REALITY */}
                    <div className="absolute -bottom-2 -right-4 w-24 h-0.5 bg-red-600/50 skew-x-[45deg] opacity-0 group-hover/feria:opacity-100 transition-opacity" />
                </div>
            </BentoCard>

            <BentoCard title="Número Rojo 2026" subtitle="Solvencia & Retiro Dorado" danger={true}>
                <div className="space-y-2 py-2 text-center relative group/inner">
                    <p className="text-3xl font-black text-white italic group-hover/inner:text-red-500 transition-colors">€20k<span className="text-ear-gold">/mo</span></p>
                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Objetivo Innegociable</p>
                    <div className="mt-4 p-2 bg-red-500/5 rounded-lg border border-red-500/10">
                        <p className="text-xs text-red-500 font-black uppercase italic animate-pulse">"No rompas la cadena de flujo."</p>
                    </div>
                    {/* TOOLTIP CONCEPT */}
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover/inner:opacity-100 transition-opacity rounded-xl p-4 text-center">
                        <p className="text-xs font-black text-red-500 uppercase mb-2">Protocolo de Supervivencia</p>
                        <p className="text-xs text-gray-400 font-bold uppercase">Representa el retiro total de operaciones físicas.</p>
                    </div>
                </div>
            </BentoCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <AstraWarRoom />
            <div className="space-y-8">
                <BentoCard title="Telemetría Forense" subtitle="Sincronía de Activos 420/420">
                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <SmallKPI icon={Smartphone} label="Tráfico Móvil" value="68%" />
                        <SmallKPI icon={MonitorIcon} label="Alcance PC" value="32%" />
                        <SmallKPI icon={Users} label="Roles Activos" value="12" />
                        <SmallKPI icon={Target} label="Opt. Conversión" value="Activa" />
                    </div>
                </BentoCard>

                <BentoCard title="Log de Operaciones" subtitle="Últimos Eventos de Sistema">
                    <div className="space-y-3 font-mono text-xs uppercase tracking-wider overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                        <LogEntry time="12:45" type="AUTH" msg="Sovereign Admin Edwin A. logueado." color="text-green-500" />
                        <LogEntry time="12:44" type="IA" msg="ASTRA OS v10.0 Link Stable." color="text-ear-gold" />
                        <LogEntry time="12:30" type="CMD" msg="Despliegue Command Center v3.0 completado." />
                        <LogEntry time="11:15" type="LEAD" msg="Nuevo lead B2B detectado: Hotel Palace." color="text-blue-400" />
                    </div>
                </BentoCard>
            </div>
        </div>
    </div>
);

const AcademyPanel = ({ xp, progress, onComplete, onAction }: any) => (
    <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
            <div>
                <h3 className="text-4xl font-display font-black uppercase italic tracking-tighter text-white">
                    CENTRO DE FORMACIÓN <span className="text-ear-gold">TÁCTICA</span> (Academy)
                </h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 px-1">
                    FORJANDO COMANDANTES DE ESCENA
                </p>
            </div>
            <div className="flex gap-8">
                <StatBox label="PROGRESO GLOBAL" value={`${progress}% `} />
                <StatBox label="XP ACUMULADA" value={xp} color="text-ear-gold" />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* CURRENT LESSON */}
            <div className="lg:col-span-8 space-y-8">
                <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <Flame size={120} />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-ear-gold text-black text-xs font-black uppercase italic rounded">Lección en curso</span>
                            <span className="text-white text-lg font-black uppercase italic tracking-tight">MENTALIDAD DE GUERRA ARTÍSTICA</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <Zap size={24} className="text-ear-gold animate-pulse" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs font-black uppercase">Duración</p>
                                <p className="text-white font-mono text-xl">12:45 / 45 min</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-black uppercase italic text-ear-gold">Misión del Módulo</h4>
                            <p className="text-gray-400 text-xs leading-relaxed max-w-2xl font-bold uppercase tracking-wider">
                                En este módulo desmantelaremos las creencias limitantes que te mantienen pobre. Aprenderás por qué el "amor al arte"
                                es la excusa perfecta para la explotación y cómo reprogramar tu mente para exigir el valor que mereces.
                            </p>
                        </div>

                        <div className="pt-6 flex flex-wrap gap-4">
                            <button onClick={onComplete} className="px-10 py-4 bg-ear-gold text-black font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all transform active:scale-95 shadow-xl shadow-ear-gold/10">
                                Completar Misión
                            </button>
                            <button onClick={() => onAction('ACADEMY', 'Descarga Workbook')} className="px-6 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
                                <Download size={14} /> Workbook .PDF
                            </button>
                            <button onClick={() => onAction('ACADEMY', 'Acceso Chat')} className="px-6 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
                                <MessageCircle size={14} /> Chat
                            </button>
                        </div>
                    </div>
                </div>

                <BentoCard title="Desafío Rápido" subtitle="Ejecución inmediata necesaria">
                    <p className="text-gray-300 text-xs italic font-medium leading-relaxed mb-6">"Define tus 3 valores innegociables antes de pasar al siguiente módulo."</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" placeholder="Valor 1..." className="bg-black/40 border border-white/5 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-ear-gold/40" />
                        <input type="text" placeholder="Valor 2..." className="bg-black/40 border border-white/5 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-ear-gold/40" />
                        <input type="text" placeholder="Valor 3..." className="bg-black/40 border border-white/5 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-ear-gold/40" />
                    </div>
                </BentoCard>
            </div>

            {/* MAPA DE OPERACIONES */}
            <div className="lg:col-span-4">
                <BentoCard title="Mapa de Operaciones" subtitle="Ruta hacia el Dominio del Mercado">
                    <div className="space-y-4 pt-4">
                        <LessonItem num="01" label="Mentalidad de Guerra" time="45 min" xp="150 XP" active />
                        <LessonItem num="02" label="Identidad de Marca" time="60 min" xp="200 XP" />
                        <LessonItem num="03" label="Ingeniería de Precios" time="50 min" xp="250 XP" />
                        <LessonItem num="04" label="El Contrato Blindado" time="40 min" xp="180 XP" />
                        <LessonItem num="05" label="Marketing Guerrilla" time="75 min" xp="300 XP" />
                    </div>
                </BentoCard>
            </div>
        </div>
    </div>
);

// --- ARTIST HUB PANEL (SPOTIFY FOR ARTISTS STYLE) ---
const ArtistHubPanel = () => {
    const [isEditing, setIsEditing] = useState(false);

    // PERFIL REAL: EDWIN AGUDELO (Sovereign Data)
    const artistProfile = {
        name: "Edwin Agudelo",
        genre: "Mariachi & Cantante en Positivo",
        // Usamos un placeholder de alta calidad si no tenemos la URL directa, pero idealmente sería su foto real
        avatar: "https://yt3.googleusercontent.com/ytc/AIdro_kEwYf1yWCt7M_WvWd4X_QzX8_Zg0_Zg0_Zg0_Zg0=s176-c-k-c0x00ffffff-no-rj",
        bio: "Voz que conecta generaciones. Especialista en Rancheras, Popular y Baladas de alto impacto emocional.",
        social: {
            yt: "@EdwinAgudelocantante",
            fb: "/edwinagudelomariachi",
            ig: "@mariachiedwinagudelo",
            web: "productoraear.com"
        },
        aura: ["Tradición Elegante", "Fiesta Salvaje"],
        level: "LEYENDA"
    };

    const recommendations = [
        { id: 1, title: "Capitaliza tu 'Storytelling' en YouTube", desc: "Tus entrevistas a inmigrantes tienen alta retención. Lanza una serie 'Historias de Boda' para captar parejas.", impact: "ALTO", type: "CONTENT" },
        { id: 2, title: "Sinergia FB Mariachi -> IG Reels", desc: "Tu audiencia en Facebook es sólida. Mueve ese tráfico a Instagram con clips de 'Charro vs Mariachi'.", impact: "ALTO", type: "GROWTH" },
        { id: 3, title: "Actualiza Trinity: Popurrí Regional", desc: "El género 'Popular' (Yeison J., Jessi U.) está en tendencia +40%. Añade un medley al cierre del show.", impact: "MEDIO", type: "PERFORMANCE" },
    ];

    return (
        <div className="space-y-10 font-montserrat">
            <FilterBar />
            {/* 1. IDENTITY HEADER */}
            <div className="flex flex-col md:flex-row gap-8 items-start bg-white/5 border border-white/10 p-8 rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ear-gold/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black shadow-2xl overflow-hidden shrink-0">
                    <img src={artistProfile.avatar} alt={artistProfile.name} className="w-full h-full object-cover" />
                    <button className="absolute bottom-0 right-0 p-2 bg-ear-gold text-black rounded-full hover:bg-white transition-colors" title="Editar Foto">
                        <Search size={12} />
                    </button>
                </div>

                <div className="flex-1 space-y-4 z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">PERFIL ARTISTA: {artistProfile.name} (Artist Profile)</h2>
                                <span className="px-3 py-1 bg-ear-gold text-black text-xs font-black uppercase rounded dark:shadow-ear-gold/20 shadow-lg">{artistProfile.level}</span>
                            </div>
                            <p className="text-gray-400 text-sm font-medium">{artistProfile.genre} • {artistProfile.bio}</p>
                        </div>
                        <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2">
                            {isEditing ? 'Guardar Perfil' : 'Editar Identidad'}
                        </button>
                    </div>

                    {/* Social Links Config */}
                    <div className="flex flex-wrap gap-4 pt-2">
                        {Object.entries(artistProfile.social).map(([net, handle]) => (
                            <div key={net} className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/5 rounded-full hover:border-ear-gold/30 transition-all cursor-pointer group">
                                <Globe size={12} className="text-gray-400 group-hover:text-ear-gold" />
                                <span className="text-xs text-gray-300 font-bold uppercase">{net}: <span className="text-white">{handle}</span></span>
                                {isEditing && <Search size={10} className="text-gray-600" />}
                            </div>
                        ))}
                        <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/5 rounded-full hover:border-ear-gold/30 transition-all cursor-pointer group">
                            <Zap size={12} className="text-ear-gold" />
                            <span className="text-xs text-gray-300 font-bold uppercase">Aura: <span className="text-white">{artistProfile.aura.join(', ')}</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. SOCIAL & AUDIENCE METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="COMUNIDAD TOTAL" value="25.8k" sub="+12% YOUTUBE/FB" color="text-white" />
                <StatCard label="IMPACTO MENSUAL" value="142k" sub="VISTAS VIDEO" color="text-red-500" />
                <StatCard label="CONVERSIÓN SHOW" value="62%" sub="ALTA (BOCA A BOCA)" color="text-ear-gold" />
                <StatCard label="VALORACIÓN MEDIA" value="5.0" sub="EXCELENCIA" color="text-green-500" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* 3. ASTRA TACTICAL SUGGESTIONS */}
                <div className="xl:col-span-1 space-y-6">
                    <BentoCard title="Recomendaciones ASTRA" subtitle="Mejora tu impacto táctico">
                        <div className="space-y-4 pt-2">
                            {recommendations.map(rec => (
                                <div key={rec.id} className="p-4 bg-white/5 border border-white/10 hover:border-ear-gold/30 rounded-2xl group transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${rec.impact === 'ALTO' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>Impacto {rec.impact}</span>
                                        <X size={12} className="text-gray-600 hover:text-white cursor-pointer" />
                                    </div>
                                    <h4 className="text-sm font-bold text-white mb-1 group-hover:text-ear-gold transition-colors">{rec.title}</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed mb-4">{rec.desc}</p>
                                    <button className="w-full py-2 bg-ear-gold/10 hover:bg-ear-gold text-ear-gold hover:text-black text-xs font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all">
                                        Aplicar Táctica <ArrowRight size={12} />
                                    </button>
                                </div>
                            ))}
                            <div className="p-4 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                                <BrainCircuit size={24} className="text-gray-600" />
                                <span className="text-xs font-bold text-gray-400 uppercase">Analizando nuevos patrones...</span>
                            </div>
                        </div>
                    </BentoCard>
                </div>

                {/* 4. CATALOG & EVENTS */}
                <div className="xl:col-span-2 space-y-6">
                    <BentoCard title="Rendimiento del Catálogo (Trinity)" subtitle="Tus mejores armas sonoras">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-mono text-xs uppercase tracking-widest">
                                <thead className="text-gray-400 border-b border-white/5">
                                    <tr>
                                        <th className="py-3 font-black text-white">Track / Acto</th>
                                        <th className="py-3 text-center">Tipo</th>
                                        <th className="py-3 text-center">Usos</th>
                                        <th className="py-3 text-center">Reacción</th>
                                        <th className="py-3 text-right">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        { title: "El Rey (Gala Version)", type: "SONG", uses: 45, react: 99, status: "HOT" },
                                        { title: "Si Nos Dejan (Entrada)", type: "MOMENT", uses: 32, react: 96, status: "STABLE" },
                                        { title: "Popurrí Regional (Fiesta)", type: "ACT", uses: 28, react: 94, status: "RISING" },
                                        { title: "Historia Inmigrante (Story)", type: "VIDEO", uses: 15, react: 88, status: "STABLE" },
                                    ].map((item, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            <td className="py-3 font-bold text-white">{item.title}</td>
                                            <td className="py-3 text-center text-gray-400">{item.type}</td>
                                            <td className="py-3 text-center text-white">{item.uses}</td>
                                            <td className="py-3 text-center text-ear-gold">{item.react}%</td>
                                            <td className="py-3 text-right">
                                                <span className={`px-2 py-0.5 rounded text-xs font-black ${item.status === 'HOT' ? 'bg-red-500 text-black' : item.status === 'RISING' ? 'bg-green-500 text-black animate-pulse' : 'bg-blue-500 text-black'}`}>{item.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </BentoCard>

                    <BentoCard title="Próximos Eventos" subtitle="Tu agenda táctica confirmada">
                        <div className="space-y-3">
                            {[
                                { date: "15 FEB", event: "Boda Finca Prados", city: "Toledo", fee: "€800", status: "CONFIRMED" },
                                { date: "22 FEB", event: "Fiesta Privada", city: "Madrid", fee: "€1.2k", status: "PENDING" },
                                { date: "01 MAR", event: "Evento Corp. IBM", city: "Online", fee: "€1.5k", status: "CONFIRMED" },
                            ].map((evt, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl hover:border-ear-gold/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center w-12 pt-1 leading-tight">
                                            <span className="block text-[14px] font-black text-white">{evt.date.split(' ')[0]}</span>
                                            <span className="block text-xs font-bold text-gray-400 uppercase">{evt.date.split(' ')[1]}</span>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-black text-white uppercase">{evt.event}</h5>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">{evt.city} • <span className="text-ear-gold">{evt.fee}</span></p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-black uppercase px-2 py-1 rounded border ${evt.status === 'CONFIRMED' ? 'border-green-500/50 text-green-500' : 'border-yellow-500/50 text-yellow-500'}`}>
                                        {evt.status === 'CONFIRMED' ? 'CONFIRMADO' : 'PENDIENTE'}
                                    </span>
                                </div>
                            ))}
                            <button className="w-full py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
                                Ver Calendario Completo
                            </button>
                        </div>
                    </BentoCard>
                </div>
            </div>
        </div>
    );
};

const MarketPanel = () => (
    <div className="space-y-8 font-montserrat">
        <div className="flex justify-between items-end border-b border-white/5 pb-10">
            <div>
                <h3 className="text-4xl font-display font-black uppercase italic tracking-tighter text-white">
                    INTELIGENCIA DE <span className="text-ear-gold">MERCADO (Market Intel)</span>
                </h3>
                <p className="text-gray-400 text-xs font-black uppercase tracking-[0.4em] mt-2">
                    Análisis Comparativo & Benchmarking en Tiempo Real
                </p>
            </div>
        </div>

        <FilterBar />

        {/* --- NUEVA SECCIÓN DE GRÁFICOS --- */}
        <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <BrainCircuit className="text-ear-gold animate-pulse" size={18} />
                <h4 className="text-xs font-black text-white uppercase tracking-widest italic">Análisis Predictivo ASTRA OS</h4>
            </div>
            <MarketIntelCharts data={marketData} />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="PROVEEDORES ANALIZADOS" value={marketData.total_scanned_vendors || "3k+"} sub="BASE DE DATOS REAL" color="text-green-500" />
            <StatCard label="SECTOR DOMINANTE" value="BANQUETES" sub={`${marketData.category_distribution?.["Banquetes"] || 1622} ITEMS`} color="text-blue-400" />
            <StatCard label="AVG TICKETING (DJ)" value={marketData.market_analysis?.djs_madrid?.avg_price || "673€"} sub="MADRID / NACIONAL" color="text-ear-gold" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <BentoCard title="Despacho de Operaciones" subtitle="Asignación de Recursos en Tiempo Real">
                <div className="space-y-3">
                    {[
                        { id: "#2049", time: "18:00 - 02:00", event: "Boda Finca Prados", resource: "Dj Hybrid Team", status: "ON_SITE" },
                        { id: "#2050", time: "20:00 - 00:00", event: "Cena Empresa IBM", resource: "Jazz Trio", status: "EN_ROUTE" },
                        { id: "#2051", time: "22:00 - 04:00", event: "Fiesta Privada", resource: "The Red Beats", status: "PENDING_DISPATCH" },
                    ].map((op, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-ear-gold/30 transition-all group">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`w-2 h-2 rounded-full ${op.status === 'ON_SITE' ? 'bg-green-500 animate-pulse' : op.status === 'EN_ROUTE' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                                    <h5 className="text-sm font-black text-white uppercase">{op.event}</h5>
                                </div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-4">{op.resource} • {op.time}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-mono text-gray-400 block">{op.id}</span>
                                <span className={`text-xs font-black uppercase ${op.status === 'ON_SITE' ? 'text-green-500' : op.status === 'EN_ROUTE' ? 'text-blue-500' : 'text-yellow-500'}`}>
                                    {op.status === 'ON_SITE' ? 'EN SITIO' : op.status === 'EN_ROUTE' ? 'EN RUTA' : 'PENDIENTE'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </BentoCard>
            <BentoCard title="Mapa de Calor de Demanda" subtitle="Zonas con mayor actividad de solicitudes">
                <div className="h-64 bg-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-20 mix-blend-overlay" />
                    <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur px-3 py-2 rounded-lg border border-white/10 text-xs font-mono text-gray-400">
                        <p>MADRID CENTRAL: ALTA</p>
                        <p>TOLEDO NORTE: MEDIA</p>
                    </div>
                </div>
            </BentoCard>
        </div>
    </div>
);

// --- ATOMS ---

const OperationalKPI = ({ label, value, sub, color }: any) => (
    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl group hover:border-ear-gold/20 transition-all">
        <p className="text-sm text-gray-400 font-black uppercase tracking-widest mb-2">{label}</p>
        <div className="flex items-end justify-between">
            <h3 className={`text-4xl font-display font-black italic uppercase tracking-tighter ${color}`}>{value}</h3>
            <span className="text-sm font-black text-gray-400 bg-white/5 px-2 py-1 rounded mb-1">{sub}</span>
        </div>
    </div>
);

const MenuButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 border group/btn ${active ? 'bg-ear-gold border-ear-gold text-black shadow-2xl shadow-ear-gold/20 scale-105 z-20' : 'bg-transparent border-transparent text-gray-500 hover:text-white hover:bg-white/5 hover:translate-x-1'}`}
    >
        <Icon size={16} className={`${active ? 'text-black' : 'text-gray-700 group-hover/btn:text-ear-gold'} transition-colors`} />
        <span className="text-xs font-black uppercase tracking-widest">{label}</span>
        {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 bg-black rounded-full" />}
    </button>
);

const QuickBtn = ({ icon: Icon, label, onClick }: any) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-2 group"
    >
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-ear-gold group-hover:text-black group-hover:border-ear-gold transition-all shadow-xl">
            <Icon size={20} />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-gray-600 group-hover:text-white transition-colors">{label}</span>
    </button>
);

const BentoCard = ({ title, subtitle, children, danger = false }: any) => (
    <div className={`bg-white/5 border ${danger ? 'border-red-500/30 hover:border-red-500/60' : 'border-white/10 hover:border-ear-gold/30'} rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden flex flex-col group transition-all duration-500 hover:shadow-2xl hover:shadow-ear-gold/5 hover:-translate-y-1`}>
        {danger && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-pulse" />}
        <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className={`text-xl font-black uppercase italic tracking-tighter ${danger ? 'text-red-500' : 'text-white'} group-hover:tracking-normal transition-all duration-500`}>{title}</h3>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1 italic">{subtitle}</p>
            </div>
            {danger && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
        </div>
        <div className="flex-1 relative z-10">
            {children}
        </div>
    </div>
);

// --- ADVANCED FILTERS COMPONENT ---
const FilterBar = ({ onFilterChange }: { onFilterChange?: (filters: any) => void }) => (
    <div className="flex flex-wrap gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/5">
            <Calendar size={14} className="text-ear-gold" />
            <select className="bg-transparent text-xs font-black text-white outline-none cursor-pointer">
                <option value="today">HOY (Today)</option>
                <option value="week">SEMANA (Week)</option>
                <option value="month">MES (Month)</option>
                <option value="all">TODO EL TIEMPO (All Time)</option>
            </select>
        </div>
        <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/5">
            <Filter size={14} className="text-blue-400" />
            <select className="bg-transparent text-xs font-black text-white outline-none cursor-pointer">
                <option value="all">SITUACIÓN: TODAS (All Status)</option>
                <option value="critical">CRÍTICO (Critical)</option>
                <option value="operational">OPERATIVO (Operational)</option>
                <option value="warning">ADVERTENCIA (Warning)</option>
            </select>
        </div>
        <div className="flex-1 flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
            <Search size={14} className="text-zinc-600" />
            <input
                type="text"
                placeholder="Filtro maestro de inteligencia... (Master Search)"
                className="bg-transparent w-full text-xs font-black text-white outline-none placeholder:text-zinc-700"
            />
        </div>
        <button className="px-4 py-2 bg-ear-gold/10 hover:bg-ear-gold text-ear-gold hover:text-black border border-ear-gold/20 rounded-xl text-xs font-black uppercase transition-all">
            Aplicar Filtros (Apply)
        </button>
    </div>
);

const StatBox = ({ label, value, color = "text-white", className = "", onClick }: any) => (
    <div className={`text-right group cursor-default ${className}`} onClick={onClick}>
        <p className="text-sm text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-ear-gold transition-colors">{label}</p>
        <p className={`${color} text-2xl font-black italic`}>{value}</p>
    </div>
);

const SmallKPI = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-center gap-4 p-4 bg-black/20 border border-white/5 rounded-2xl">
        <Icon size={16} className="text-ear-gold" />
        <div>
            <p className="text-sm font-black uppercase text-gray-600">{label}</p>
            <p className="text-sm font-black text-white italic">{value}</p>
        </div>
    </div>
);

const LogEntry = ({ time, type, msg, color = "text-gray-400" }: any) => (
    <div className="flex gap-4 items-center group py-1 border-b border-white/[0.02] last:border-0">
        <span className="text-gray-600 w-12 shrink-0">{time}</span>
        <span className={`w-10 font-black shrink-0 ${color}`}>[{type}]</span>
        <span className="text-gray-300 group-hover:text-white transition-colors truncate">{msg}</span>
    </div>
);

const SimpleProgress = ({ label, value }: any) => (
    <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-400">
            <span>{label}</span>
            <span className="text-white">{value}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className="h-full bg-ear-gold" />
        </div>
    </div>
);

const AlertBox = ({ type, msg }: any) => (
    <div className={`p-4 rounded-2xl border ${type === 'INFO' ? 'bg-blue-500/5 border-blue-500/20 text-blue-200' : 'bg-yellow-500/5 border-yellow-500/20 text-yellow-200'} text-xs font-bold uppercase tracking-tight leading-tight flex gap-3`}>
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${type === 'INFO' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
        {msg}
    </div>
);

const StatCard = ({ label, value, sub, color = "text-white" }: any) => (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] transition-all">
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
        <div className={`text-3xl font-black italic ${color}`}>{value}</div>
        {sub && <p className="text-xs text-gray-400 font-bold mt-1 uppercase">{sub}</p>}
    </div>
);

const LessonItem = ({ num, label, time, xp, active = false }: any) => (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${active ? 'bg-ear-gold border-ear-gold text-black italic font-black shadow-lg shadow-ear-gold/10 scale-[1.02]' : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'}`}>
        <span className="text-xs font-mono">{num}</span>
        <div className="flex-1">
            <p className="text-sm uppercase font-black truncate">{label}</p>
            <div className={`flex gap-3 text-xs font-bold uppercase mt-0.5 ${active ? 'text-black/60' : 'text-gray-600'}`}>
                <span>{time}</span>
                <span>•</span>
                <span>{xp}</span>
            </div>
        </div>
        {active ? <Flame size={14} className="animate-pulse" /> : <Lock size={14} className="opacity-20" />}
    </div>
);

const FooterNav = ({ title, links }: { title: string, links: { label: string, to: string }[] }) => (
    <div className="space-y-6">
        <h4 className="text-xs font-black uppercase text-white tracking-[0.2em] italic border-b border-ear-gold/20 pb-2">{title}</h4>
        <ul className="space-y-3">
            {links.map(link => (
                <li key={link.label}>
                    <Link to={link.to} className="text-xs text-gray-400 font-bold uppercase tracking-widest hover:text-ear-gold transition-colors flex items-center gap-2">
                        <ChevronRight size={10} className="text-ear-gold opacity-0 group-hover:opacity-100" />
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);


// --- NEW CFO FINANCIAL PANEL ---
const FinancialPanel = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState({
        todayPaid: 0,
        webhookSuccess: 100,
        fulfillment: 0,
        coverage: 75 // Tarjeta, PayPal, Bizum OK. Transferencia Manual.
    });

    useEffect(() => {
        if (!db) return;

        // 1. Snapshot de Órdenes Reales
        const q = query(
            collection(db, 'ear_orders'),
            orderBy('createdAt', 'desc'),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const rawOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(rawOrders);

            // Recalcular KPIs Básicos
            const paid = rawOrders.filter((o: any) => o.status === 'PAID').length;
            const initiated = rawOrders.filter((o: any) => o.status === 'INITIATED').length;
            const fulfilled = rawOrders.filter((o: any) => o.status === 'FULFILLED').length;

            setStats(prev => ({
                ...prev,
                todayPaid: Math.round((paid / (paid + initiated || 1)) * 100),
                fulfillment: Math.round((fulfilled / (paid || 1)) * 100)
            }));
        });

        // 2. Alert Logic: Si webhooks detectan errores excesivos
        if (stats.webhookSuccess < 95) {
            const triggerAlert = async () => {
                await addDoc(collection(db!, 'ear_leads'), {

                    name: 'SISTEMA ASTRA',
                    email: 'alerts@productoraear.com',
                    leadType: 'contact_form',
                    division: 'OPERATIONS',
                    message: `ALERTA CRÍTICA: Estabilidad de Webhooks al ${stats.webhookSuccess}% `,
                    priority: 'CRITICAL',
                    status: 'new',
                    createdAt: serverTimestamp()
                });
            };
            triggerAlert();
        }

        return () => unsubscribe();
    }, [stats.webhookSuccess]);


    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end border-b border-white/5 pb-10">
                <div>
                    <h3 className="text-4xl font-display font-black uppercase italic tracking-tighter text-white">
                        INTELIGENCIA <span className="text-ear-gold">FINANCIERA (Financial Intel)</span>
                    </h3>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-[0.4em] mt-2">
                        Monitoreo de Flujo de Caja & Estabilidad de Pasarelas
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                        Reporte Diario (Daily Report)
                    </button>
                </div>
            </div>

            <FilterBar />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <BentoCard title="Pagos Hoy (Conversión)" subtitle="Efectividad de Pasarela">
                    <div className="py-4">
                        <ProgressBar val={stats.todayPaid} color="#DAA520" />
                        <p className="text-xs text-gray-400 mt-4 uppercase">Stripe / PayPal / Bizum Live</p>
                    </div>
                </BentoCard>
                <BentoCard title="Webhooks OK" subtitle="Integridad de Datos">
                    <div className="py-4">
                        <ProgressBar val={stats.webhookSuccess} color="#2ECC71" />
                        <p className="text-xs text-gray-400 mt-4 uppercase">Latencia: 140ms Avg</p>
                    </div>
                </BentoCard>
                <BentoCard title="Cumplimiento" subtitle="Velocidad de Despacho">
                    <div className="py-4">
                        <ProgressBar val={stats.fulfillment} color="#40E0D0" />
                        <p className="text-xs text-gray-400 mt-4 uppercase">Post-Pago Automático</p>
                    </div>
                </BentoCard>
                <BentoCard title="Cobertura Métodos" subtitle="Stripe + PP + Bizum + Trf">
                    <div className="py-4">
                        <ProgressBar val={stats.coverage} color="#FF69B4" />
                        <p className="text-xs text-gray-400 mt-4 uppercase">Bizum: ONLINE</p>
                    </div>
                </BentoCard>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2">
                    <BentoCard title="Registro Maestro de Transacciones" subtitle="Sincronía en Tiempo Real">
                        <div className="overflow-x-auto mt-6">
                            <table className="w-full text-left font-mono text-xs uppercase">
                                <thead className="text-gray-600 border-b border-white/5">
                                    <tr>
                                        <th className="py-4">Id_Orden</th>
                                        <th className="py-4">Método</th>
                                        <th className="py-4">Importe</th>
                                        <th className="py-4">Estado</th>
                                        <th className="py-4 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {orders.map((order, i) => (
                                        <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="py-4 font-black text-white">{order.id.slice(-8)}</td>
                                            <td className="py-4 text-gray-400">{order.paymentMethod}</td>
                                            <td className="py-4 text-ear-gold">€{order.totalAmount}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-black ${order.status === 'PAID' ? 'bg-green-500/20 text-green-500' :
                                                    order.status === 'INITIATED' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <button className="opacity-0 group-hover:opacity-100 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                                                    <ExternalLink size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center text-gray-600 italic">No hay órdenes registradas bajo este radar.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </BentoCard>
                </div>

                <div className="space-y-8">
                    <BentoCard title="Alertas Financieras" subtitle="IA Predictiva Astra">
                        <div className="space-y-4 py-4">
                            <AlertBox type="INFO" msg="Sincronía con Bizum establecida. Monitorizando test de 1€." />
                            <AlertBox type="SYSTEM" msg="Webhook Secret Validado para Sandbox & Live." />
                            <div className="p-4 bg-ear-gold text-black rounded-2xl">
                                <p className="text-xs font-black uppercase mb-1">Nota del Comandante:</p>
                                <p className="text-sm font-bold italic leading-tight uppercase">"Asegurad que el escalado de donaciones VIMUME tenga prioridad en el log de auditoría."</p>
                            </div>
                        </div>
                    </BentoCard>

                    <BentoCard title="Métricas Sociales (VIMUME)" subtitle="Impacto Real en Campo">
                        <div className="py-6 flex flex-col items-center text-center">
                            <Heart className="text-red-500 mb-4 animate-pulse" size={48} />
                            <p className="text-3xl font-black text-white italic tracking-tighter">€0.00</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Recaudación Impacto</p>
                            <div className="w-full h-px bg-white/5 my-6" />
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div>
                                    <p className="text-lg font-black text-ear-gold">0</p>
                                    <p className="text-xs text-gray-600 font-black uppercase">Donantes</p>
                                </div>
                                <div>
                                    <p className="text-lg font-black text-blue-400">0</p>
                                    <p className="text-xs text-gray-600 font-black uppercase">Sesiones</p>
                                </div>
                            </div>
                        </div>
                    </BentoCard>
                </div>
            </div>
        </div>
    );
};

const ProgressBar = ({ val, color }: { val: number, color: string }) => (
    <div className="space-y-3">
        <div className="flex justify-between items-center pr-2">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Sincronía</span>
            <span className="text-xs font-black" style={{ color }}>{val}%</span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${val}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full"
                style={{ backgroundColor: color } as any}
            />
        </div>
    </div>
);



const StrategicCoreModule = ({ onAction }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md hover:border-ear-gold/20 transition-all duration-700">
        {/* 1. TACTICAL ENGINE */}
        <div className="space-y-4 md:border-r border-white/5 md:pr-8 relative group/tactic">
            <div className="flex items-center gap-3 mb-2">
                <Crosshair className="text-ear-gold" size={18} />
                <h4 className="text-xs font-black uppercase text-white tracking-widest">Motor Táctico</h4>
            </div>
            <p className="text-xs text-gray-500 font-bold uppercase leading-relaxed">
                ASTRA sugiere 3 movimientos de alto impacto basados en datos de hoy.
            </p>
            <div className="space-y-2">
                <button onClick={() => onAction('TACTIC', 'Lanzar Oferta Flash Toledo')} className="w-full text-left bg-black/40 hover:bg-ear-gold text-black border border-white/5 p-3 rounded-xl flex items-center justify-between group/item transition-all duration-300">
                    <span className="text-xs font-black uppercase">Oferta Flash Toledo</span>
                    <ArrowRight size={10} className="group-hover/item:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => onAction('TACTIC', 'Auditar Perfil DJ Neo')} className="w-full text-left bg-black/40 hover:bg-ear-gold text-black border border-white/5 p-3 rounded-xl flex items-center justify-between group/item transition-all duration-300">
                    <span className="text-xs font-black uppercase">Auditar DJ Neo</span>
                    <ArrowRight size={10} className="group-hover/item:translate-x-1 transition-transform" />
                </button>
            </div>
            {/* GUIDE BOX */}
            <div className="absolute top-0 right-10 w-48 bg-black/90 border border-ear-gold/30 p-4 rounded-2xl opacity-0 translate-x-4 group-hover/tactic:opacity-100 group-hover/tactic:translate-x-0 transition-all pointer-events-none z-50 shadow-2xl">
                <p className="text-xs font-black text-ear-gold uppercase italic mb-2 tracking-tighter">Sugerencia Neural</p>
                <p className="text-xs text-gray-300 font-bold uppercase leading-tight">Optimización de márgenes mediante saturación de última hora en zonas de alto tráfico.</p>
            </div>
        </div>

        {/* 2. WHAT-IF SIMULATOR */}
        <div className="space-y-4 md:border-r border-white/10 md:pr-6">
            <div className="flex items-center gap-3 mb-2">
                <GitBranch className="text-blue-400" size={18} />
                <h4 className="text-xs font-black uppercase text-white tracking-widest">Simulador de Escenarios (What-If)</h4>
            </div>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Proyecta el impacto de decisiones críticas antes de ejecutarlas.
            </p>
            <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl flex items-center justify-between">
                <div>
                    <span className="block text-xs font-black uppercase text-blue-300">Escenario Activo</span>
                    <span className="text-xs font-bold text-white uppercase">Subida Precios +15%</span>
                </div>
                <button onClick={() => onAction('SIMULATE', 'Pricing +15%')} className="px-3 py-1 bg-blue-500 text-black text-xs font-black uppercase rounded hover:bg-white transition-colors">
                    Simular
                </button>
            </div>
        </div>

        {/* 3. CLOSED LOOP */}
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <RefreshCw className="text-green-500" size={18} />
                <h4 className="text-xs font-black uppercase text-white tracking-widest">Bucle de Aprendizaje (Loop)</h4>
            </div>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Patrones exitosos detectados y listos para replicar.
            </p>
            <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/10 p-3 rounded-xl cursor-pointer hover:bg-green-500/10 transition-all" onClick={() => onAction('PLAYBOOK', 'Bodas Premium v2')}>
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <BookOpen size={14} />
                </div>
                <div>
                    <span className="block text-xs font-black uppercase text-white">Playbook: Bodas Premium</span>
                    <span className="text-xs font-bold text-gray-400 uppercase">+18% Conversión (Validado)</span>
                </div>
            </div>
        </div>
    </div>
);

export default EarCommandCenter;
// --- NEW AFFILIATES PANEL ---
const AffiliatesPanel = () => {
    const [affiliates, setAffiliates] = useState<any[]>([]);
    const [referrals, setReferrals] = useState<any[]>([]);

    useEffect(() => {
        if (!db) return;

        // 1. Snapshot de Afiliados
        const qAff = query(collection(db, 'affiliates'), limit(20));
        const unsubscribeAff = onSnapshot(qAff, (snap) => {
            setAffiliates(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 2. Snapshot de Referidos Pendientes
        const qRef = query(
            collection(db, 'referrals'),
            where('commissionStatus', '==', 'PENDING'),
            limit(20)
        );
        const unsubscribeRef = onSnapshot(qRef, (snap) => {
            setReferrals(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeAff();
            unsubscribeRef();
        };
    }, []);

    const handleApproveCommission = async (id: string) => {
        try {
            const refDoc = doc(db!, 'referrals', id);
            await updateDoc(refDoc, { commissionStatus: 'APPROVED', updatedAt: serverTimestamp() });
            toast.success("Comisión aprobada con éxito");
        } catch (e) {
            toast.error("Error al aprobar comisión");
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end border-b border-white/5 pb-10">
                <div>
                    <h3 className="text-4xl font-display font-black uppercase italic tracking-tighter text-white">
                        RED DE <span className="text-ear-gold">AFILIADOS (Affiliate Network)</span>
                    </h3>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-[0.4em] mt-2">
                        Liquidaciones, Payouts & Trazabilidad de Referidos
                    </p>
                </div>
                <button className="px-6 py-3 bg-ear-gold text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all">
                    Registrar Afiliado (Register)
                </button>
            </div>

            <FilterBar />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2 space-y-8">
                    <BentoCard title="Comisiones Pendientes de Revisión" subtitle="Auditoría de Conversión">
                        <div className="overflow-x-auto mt-6">
                            <table className="w-full text-left font-mono text-xs uppercase">
                                <thead className="text-gray-600 border-b border-white/5">
                                    <tr>
                                        <th className="py-4">Fecha</th>
                                        <th className="py-4">Código</th>
                                        <th className="py-4">Venta</th>
                                        <th className="py-4 text-ear-gold">Comisión</th>
                                        <th className="py-4 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {referrals.map((ref) => (
                                        <tr key={ref.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="py-4 text-gray-400">{new Date(ref.createdAt).toLocaleDateString()}</td>
                                            <td className="py-4 font-black text-white">{ref.code}</td>
                                            <td className="py-4">€{ref.orderAmount}</td>
                                            <td className="py-4 text-ear-gold font-black">€{ref.commissionAmount}</td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApproveCommission(ref.id)}
                                                        className="px-3 py-1.5 bg-green-500/20 text-green-500 border border-green-500/30 rounded-lg text-xs font-black hover:bg-green-500/30 transition-all font-mono"
                                                    >
                                                        APROBAR
                                                    </button>
                                                    <button className="p-2 bg-white/5 hover:bg-red-500/20 text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {referrals.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center text-gray-600 italic">No hay comisiones pendientes de auditoría.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </BentoCard>

                    <BentoCard title="Base de Afiliados Activos" subtitle="Planners, Venues & Partners">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {affiliates.map(aff => (
                                <div key={aff.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group hover:border-ear-gold/30 transition-all">
                                    <div>
                                        <p className="text-xs font-black text-white italic">{aff.code}</p>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{aff.role} • {aff.commissionRate}%</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-ear-gold">€{aff.totalEarned.toFixed(2)}</p>
                                        <p className="text-xs text-gray-600 font-black uppercase">Acumulado</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BentoCard>
                </div>

                <div className="space-y-8">
                    <BentoCard title="Estatuto de Afiliación" subtitle="Protocolo de Seguridad">
                        <div className="space-y-4 py-4">
                            <AlertBox type="INFO" msg="Los pagos se procesan los días 1 y 15 de cada mes." />
                            <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] space-y-4 font-mono">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400 uppercase">Total x Pagar</span>
                                    <span className="text-white font-black italic uppercase">€1,450.00</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400 uppercase">Referrals Hoy</span>
                                    <span className="text-ear-gold font-black italic uppercase">12</span>
                                </div>
                                <div className="h-px bg-white/5 w-full" />
                                <button className="w-full py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-ear-gold transition-all">
                                    Lanzar Payouts Batch
                                </button>
                            </div>
                        </div>
                    </BentoCard>

                    <BentoCard title="Tracking de Terceros" subtitle="EAR como Afiliado">
                        <div className="space-y-4 py-4">
                            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                                <p className="text-xs font-black text-blue-400 uppercase mb-2">Comisiones por Cobrar:</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Floristería "El Ramo"</span>
                                        <span className="text-white">€45.00</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">DJ Externo (Partner)</span>
                                        <span className="text-white">€120.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BentoCard>
                </div>
            </div>
        </div>
    );
};
// --- NEW CRO & GROWTH PANEL ---
const CROPanel = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [feedback, setFeedback] = useState<any[]>([]);

    useEffect(() => {
        if (!db) return;

        // 1. Snapshot de Eventos Recientes
        const qEv = query(collection(db, 'user_events'), orderBy('timestamp', 'desc'), limit(50));
        const unsubscribeEv = onSnapshot(qEv, (snap) => {
            setEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 2. Snapshot de Feedback
        const qFb = query(collection(db, 'user_feedback'), orderBy('timestamp', 'desc'), limit(10));
        const unsubscribeFb = onSnapshot(qFb, (snap) => {
            setFeedback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeEv();
            unsubscribeFb();
        };
    }, []);

    // Cálculo simplificado de Funnel VIMUME
    const vimumeFunnel = {
        views: events.filter(e => e.path === '/vimume').length || 1,
        checkout: events.filter(e => e.type === 'checkout_start' && e.metadata?.itemCount > 0).length,
        paid: events.filter(e => e.type === 'order_complete').length
    };

    return (
        <div className="space-y-10 font-montserrat">
            <div className="flex justify-between items-end border-b border-white/5 pb-10">
                <div>
                    <h3 className="text-4xl font-display font-black uppercase italic tracking-tighter text-white">
                        CRECIMIENTO <span className="text-ear-gold">& CRO (Growth / CRO)</span>
                    </h3>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-[0.4em] mt-2">
                        Optimización de Embudos, A/B Testing & Feedback Neural
                    </p>
                </div>
            </div>

            <FilterBar />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2 space-y-8">
                    {/* VISUALIZACIÓN DE EMBUDOS */}
                    <BentoCard title="Embudo de Conversión Crítico" subtitle="VIMUME Social Impact">
                        <div className="grid grid-cols-3 gap-4 mt-8 relative">
                            {[
                                { label: 'Visitas VIMUME', value: vimumeFunnel.views, color: 'bg-white/10' },
                                { label: 'Inicia Checkout', value: vimumeFunnel.checkout, color: 'bg-ear-gold/20' },
                                { label: 'Orden Pagada', value: vimumeFunnel.paid, color: 'bg-green-500/20' }
                            ].map((step, i) => (
                                <div key={i} className={`p-6 rounded-3xl ${step.color} border border-white/5 flex flex-col items-center justify-center text-center group`}>
                                    <p className="text-2xl font-black text-white italic">{step.value}</p>
                                    <p className="text-xs font-black uppercase text-gray-400 tracking-widest mt-2">{step.label}</p>
                                    {i < 2 && (
                                        <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20 hidden md:block">
                                            <ArrowRight size={16} className="text-gray-700" />
                                        </div>
                                    )}
                                    <div className="mt-4 w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                        <div className="h-full bg-ear-gold" style={{ width: `${(step.value / vimumeFunnel.views) * 100}%` }} />
                                    </div>
                                    <p className="text-xs font-bold text-gray-600 mt-2">
                                        {((step.value / (i === 0 ? step.value : [vimumeFunnel.views, vimumeFunnel.checkout][i - 1])) * 100).toFixed(1)}% Retención
                                    </p>
                                </div>
                            ))}
                        </div>
                    </BentoCard>

                    {/* A/B TESTS EN CURSO */}
                    <BentoCard title="Performance A/B Testing" subtitle="Variables Activas en Producción">
                        <div className="space-y-4 mt-6">
                            {[
                                { name: 'Color botón CTA Landing', status: 'LIVE', leader: 'VARIANTE B (+12%)', stats: 'Confidence 94%' },
                                { name: 'Texto Hero VIMUME', status: 'LIVE', leader: 'VARIANTE A (Empate)', stats: 'Collecting Data...' }
                            ].map((test, i) => (
                                <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group hover:border-ear-gold/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <div>
                                            <p className="text-xs font-black text-white italic">{test.name}</p>
                                            <p className="text-xs text-gray-600 font-bold uppercase">{test.stats}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-ear-gold uppercase">{test.leader}</p>
                                        <p className="text-xs text-gray-400 font-black uppercase">Líder Actual</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BentoCard>

                    {/* EVENTOS EN TIEMPO REAL */}
                    <BentoCard title="Behavioral Live Feed" subtitle="Sincronía con Usuarios en Vivo">
                        <div className="space-y-2 mt-4 font-mono">
                            {events.slice(0, 10).map((ev) => (
                                <div key={ev.id} className="flex items-center gap-3 text-xs py-1 border-b border-white/5 group">
                                    <span className="text-gray-600">[{new Date(ev.timestamp).toLocaleTimeString()}]</span>
                                    <span className={`font-black uppercase ${ev.type.includes('click') ? 'text-blue-400' :
                                        ev.type.includes('order') ? 'text-green-500' : 'text-gray-400'
                                        }`}>{ev.type}</span>
                                    <span className="text-gray-400 truncate max-w-[150px]">{ev.path}</span>
                                    <span className="text-ear-gold ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        {ev.userId !== 'guest' ? 'MASTER' : 'GUEST'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </BentoCard>
                </div>

                <div className="space-y-8">
                    {/* NPS & FEEDBACK */}
                    <BentoCard title="Voz del Usuario" subtitle="NPS & Feedback Contextual">
                        <div className="space-y-6 mt-6">
                            <div className="p-6 bg-gradient-to-br from-ear-gold/20 to-transparent border border-ear-gold/30 rounded-3xl text-center">
                                <p className="text-4xl font-black text-white italic">8.8</p>
                                <p className="text-xs font-black uppercase text-ear-gold tracking-widest mt-2">Global NPS Score</p>
                            </div>

                            <div className="space-y-4">
                                {feedback.map(fb => (
                                    <div key={fb.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className={`w-2 h-2 rounded-full ${i < (fb.score / 2) ? 'bg-ear-gold' : 'bg-white/10'}`} />
                                                ))}
                                            </div>
                                            <span className="text-xs font-black text-gray-600 uppercase italic">Hace {Math.floor((Date.now() - new Date(fb.timestamp).getTime()) / 60000)}m</span>
                                        </div>
                                        <p className="text-xs text-gray-300 italic">"{fb.comment || 'Sin comentario.'}"</p>
                                        <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">{fb.context}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </BentoCard>

                    {/* AI RECOMMENDATIONS */}
                    <BentoCard title="EAR Predictor" subtitle="AI Insights para Optimización">
                        <div className="space-y-4 mt-6">
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl border-l-4 border-l-red-500">
                                <p className="text-xs font-black text-red-500 uppercase flex items-center gap-2">
                                    <AlertCircle size={10} /> Drop-off Crítico
                                </p>
                                <p className="text-sm text-white font-bold mt-1">El 65% de usuarios abandona en la selección de método de pago Bizum.</p>
                                <button className="text-xs font-black text-red-400 uppercase mt-2 hover:underline">Ver Trazabilidad</button>
                            </div>

                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl border-l-4 border-l-blue-500">
                                <p className="text-xs font-black text-blue-500 uppercase flex items-center gap-2">
                                    <Zap size={10} /> Oportunidad
                                </p>
                                <p className="text-sm text-white font-bold mt-1">Los Wedding Planners convierten un 25% mejor si ven el video de Metodología Forense.</p>
                                <button className="text-xs font-black text-blue-400 uppercase mt-2 hover:underline">Personalizar Flujo</button>
                            </div>
                        </div>
                    </BentoCard>
                </div>
            </div>
        </div>
    );
};

// --- NEW CRM & AUTOMATIONS PANEL ---
const CRMPanel = () => {
    const [pendingEmails, setPendingEmails] = useState<any[]>([]);
    const [abandonedCheckouts, setAbandonedCheckouts] = useState<any[]>([]);
    const [loyaltyLogs, setLoyaltyLogs] = useState<any[]>([]);

    useEffect(() => {
        if (!db) return;

        // 1. Snapshot de Cola de Email
        const qEmails = query(collection(db, 'ear_email_queue'), orderBy('createdAt', 'desc'), limit(10));
        const unsubscribeEmails = onSnapshot(qEmails, (snap) => {
            setPendingEmails(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 2. Snapshot de Abandonados
        const qAb = query(collection(db, 'ear_abandoned_checkouts'), where('converted', '==', false), orderBy('createdAt', 'desc'), limit(5));
        const unsubscribeAb = onSnapshot(qAb, (snap) => {
            setAbandonedCheckouts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 3. Snapshot de Puntos/Loyalty
        const qLoyalty = query(collection(db, 'ear_loyalty_logs'), orderBy('timestamp', 'desc'), limit(10));
        const unsubscribeLoyalty = onSnapshot(qLoyalty, (snap) => {
            setLoyaltyLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeEmails();
            unsubscribeAb();
            unsubscribeLoyalty();
        };
    }, []);

    return (
        <div className="space-y-10 font-montserrat">
            <div className="flex justify-between items-end border-b border-white/5 pb-10">
                <div>
                    <h3 className="text-4xl font-display font-black uppercase italic tracking-tighter text-white">
                        AUTOMATIZACIONES <span className="text-ear-gold">& CRM (CRM / Automations)</span>
                    </h3>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-[0.4em] mt-2">
                        Mensajería, Recuperación & Lealtad
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black text-green-500 uppercase">Motor Activo</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2 space-y-8">
                    {/* EMAIL QUEUE STATUS */}
                    <BentoCard title="Cola de Email Transaccional" subtitle="Envíos Pendientes y Recientes">
                        <div className="space-y-4 mt-6">
                            {pendingEmails.length === 0 ? (
                                <p className="text-center py-10 text-gray-700 text-xs font-black uppercase italic">Sin mensajes pendientes.</p>
                            ) : (
                                pendingEmails.map(email => (
                                    <div key={email.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group hover:border-ear-gold/30">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${email.status === 'SENT' ? 'bg-green-500/10 text-green-500' :
                                                email.status === 'FAILED' ? 'bg-red-500/10 text-red-500' : 'bg-ear-gold/10 text-ear-gold'
                                                }`}>
                                                <Globe size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-white italic truncate max-w-[200px]">{email.to}</p>
                                                <p className="text-xs text-gray-400 font-bold uppercase">{email.templateId}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs font-black px-2 py-1 rounded-full ${email.status === 'SENT' ? 'bg-green-500/10 text-green-500' : 'bg-ear-gold/10 text-ear-gold'
                                                } `}>{email.status}</span>
                                            <p className="text-xs text-gray-600 font-black uppercase mt-1">
                                                {new Date(email.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </BentoCard>

                    {/* RECOVERY DASHBOARD */}
                    <BentoCard title="Recuperación de Carritos" subtitle="Abandono en Últimas 24h">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                                <p className="text-3xl font-black text-white italic">24.5%</p>
                                <p className="text-xs font-black uppercase text-gray-400 tracking-widest mt-1">Tasa de Recuperación</p>
                                <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-ear-gold" style={{ width: '24.5%' }} />
                                </div>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                                <p className="text-3xl font-black text-ear-gold italic">1.240€</p>
                                <p className="text-xs font-black uppercase text-gray-400 tracking-widest mt-1">Valor Recuperado (Mes)</p>
                                <div className="mt-4 flex gap-1">
                                    {[...Array(5)].map((_, i) => <div key={i} className="h-1 flex-1 bg-green-500/20 rounded-full" />)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-2">
                            {abandonedCheckouts.map(ab => (
                                <div key={ab.id} className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex justify-between items-center group">
                                    <div className="flex gap-3 items-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        <p className="text-xs font-bold text-gray-300 italic">{ab.email}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-xs font-black text-white">{ab.totalAmount}€</p>
                                        <span className="text-xs font-black bg-white/5 px-2 py-0.5 rounded text-gray-400 uppercase">
                                            PASO {ab.recoveryStep}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BentoCard>
                </div>

                <div className="space-y-8">
                    {/* LOYALTY FEED */}
                    <BentoCard title="Sistema de Lealtad (XP)" subtitle="Actividad de Puntos EAR">
                        <div className="space-y-4 mt-6">
                            {loyaltyLogs.map(log => (
                                <div key={log.id} className="flex gap-4 items-start border-l-2 border-ear-gold/20 pl-4 py-1">
                                    <div className="w-8 h-8 rounded-full bg-ear-gold/10 flex items-center justify-center shrink-0">
                                        <Zap size={12} className="text-ear-gold" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white italic">+{log.points} XP</p>
                                        <p className="text-xs text-gray-400 font-bold uppercase">{log.reason.replace(/_/g, ' ')}</p>
                                        <p className="text-xs text-gray-700 font-black mt-1">USR: {log.userId.substring(0, 8)}...</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BentoCard>

                    {/* AUTOMATION HEALTH */}
                    <BentoCard title="Salud de Automatización" subtitle="Métricas de Entrega">
                        <div className="space-y-6 mt-6">
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="text-blue-400" size={16} />
                                    <span className="text-xs font-black text-white uppercase italic">Push/SMS</span>
                                </div>
                                <span className="text-xs font-black text-green-500 font-mono">100% OK</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <MessageCircle className="text-purple-400" size={16} />
                                    <span className="text-xs font-black text-white uppercase italic">Email Deliverability</span>
                                </div>
                                <span className="text-xs font-black text-blue-500 font-mono">98.2%</span>
                            </div>
                            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                                <p className="text-xs font-black text-orange-500 uppercase flex items-center gap-2">
                                    <AlertTriangle size={10} /> Alerta de Configuración
                                </p>
                                <p className="text-xs text-white font-bold mt-1">3 emails fallaron por error de validación de SPF en el dominio.</p>
                                <button className="text-xs font-black text-orange-400 uppercase mt-2 hover:underline">Resolver Tanda</button>
                            </div>
                        </div>
                    </BentoCard>
                </div>
            </div>
        </div>
    );
};

// --- STITCH NASA CONSOLE ---
const StitchConsole = ({ onAction }: { onAction: (a: string, d: string) => void }) => {
    const [emails, setEmails] = useState([
        { id: 1, from: "j.garcia@ayto-madrid.es", subject: "Propuesta Fiestas 2026", status: "NEW", time: "2m ago" },
        { id: 2, from: "info@hotelpalace.com", subject: "Reserva Artista Vault", status: "URGENT", time: "15m ago" },
        { id: 3, from: "artist@talent.ear", subject: "Actualización Kit de Marca", status: "DONE", time: "1h ago" },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-700 font-montserrat">
            <div className="flex justify-between items-center border-b border-white/5 pb-8">
                <div>
                    <h3 className="text-5xl font-display font-black uppercase italic tracking-tighter text-white">
                        CONSOLA <span className="text-ear-gold text-3xl">STITCH (NASA Control)</span>
                    </h3>
                    <p className="text-xs text-zinc-500 font-black uppercase tracking-[0.5em] mt-2">
                        Unified Communications & Strategic Assets Orchestrator
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-black text-emerald-500 uppercase">Neural Link Stable</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-h-[85vh]">
                {/* 1. COMMUNICATIONS HUB (EMAILS) */}
                <div className="lg:col-span-4 space-y-6">
                    <BentoCard title="Mensajería Entrante" subtitle="Intercepción de Leads & Consultas">
                        <div className="space-y-4 pt-4">
                            {emails.map(email => (
                                <div key={email.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-ear-gold/30 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-mono text-zinc-500">{email.time}</span>
                                        <span className={`text-xs font-black px-2 py-0.5 rounded ${email.status === 'URGENT' ? 'bg-red-500 text-black' : 'bg-ear-gold text-black'} `}>{email.status}</span>
                                    </div>
                                    <h4 className="text-sm font-black text-white truncate group-hover:text-ear-gold transition-colors">{email.from}</h4>
                                    <p className="text-xs text-zinc-400 mt-1 italic">{email.subject}</p>
                                </div>
                            ))}
                            <button className="w-full py-3 bg-black/40 border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
                                Ver todos los hilos
                            </button>
                        </div>
                    </BentoCard>

                    <BentoCard title="Filtrado por IA" subtitle="Astra Mail Parser">
                        <div className="flex items-center gap-6 py-4">
                            <div className="relative">
                                <ActivitySquare size={48} className="text-ear-gold animate-pulse" />
                                <div className="absolute inset-0 bg-ear-gold/20 blur-xl rounded-full" />
                            </div>
                            <div>
                                <p className="text-xl font-black text-white italic">84%</p>
                                <p className="text-xs text-zinc-500 font-bold uppercase">Precisión de Clasificación</p>
                            </div>
                        </div>
                    </BentoCard>
                </div>

                {/* 2. CORE ASSET TELEMETRY (ARTISTS & AFFILIATES) */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BentoCard title="Telemetría de Afiliados" subtitle="Rendimiento del Nodo de Ventas">
                        <div className="space-y-6 pt-4">
                            {[
                                { name: "Influencer A", leads: 45, conversion: "12%", status: "TOP" },
                                { name: "Wedding Planner B", leads: 22, conversion: "8%", status: "STABLE" },
                                { name: "Hotel Group C", leads: 89, conversion: "15%", status: "PRIME" },
                            ].map((af, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-white uppercase italic">{af.name}</span>
                                        <span className="text-xs font-black text-ear-gold">{af.leads} Leads ({af.status})</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: af.conversion }}
                                            className="h-full bg-ear-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BentoCard>

                    <BentoCard title="Estatus de Talento (Vanguard)" subtitle="Disponibilidad & Carga de Red">
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <SmallKPI icon={Users} label="Artistas Online" value="128" />
                            <SmallKPI icon={MonitorIcon} label="Streaming OK" value="98%" />
                            <SmallKPI icon={Terminal} label="ASTRA v10.2" value="ACTIVE" />
                            <SmallKPI icon={Cpu} label="Neural Load" value="42%" />
                        </div>
                        <div className="mt-8 p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl">
                            <p className="text-xs text-blue-400 font-black uppercase tracking-widest mb-3">Blueprint Status</p>
                            <div className="h-32 bg-blue-500/10 rounded-xl relative overflow-hidden border border-blue-500/20">
                                {/* Visualización NASA Blueprint */}
                                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.3)_50%,transparent_75%)] bg-[length:50px_50px]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Globe className="text-blue-500 animate-spin-slow opacity-40" size={64} />
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    <div className="md:col-span-2">
                        <BentoCard title="Matriz de Despliegue de Recursos" subtitle="Vista Táctica del 'Todo'">
                            <div className="h-80 bg-black/40 border border-white/5 rounded-[2rem] p-8 relative overflow-hidden flex items-center justify-center font-mono">
                                <div className="absolute inset-0 opacity-5">
                                    <div className="grid grid-cols-12 h-full">
                                        {Array.from({ length: 144 }).map((_, i) => (
                                            <div key={i} className="border border-white/20" />
                                        ))}
                                    </div>
                                </div>
                                <div className="relative z-10 text-center space-y-4">
                                    <p className="text-ear-gold text-xs font-black uppercase tracking-[0.8em]">Sincronizando Nodos Stitch...</p>
                                    <div className="flex gap-4 justify-center">
                                        <div className="w-3 h-3 bg-ear-gold rounded-full animate-ping" />
                                        <div className="w-3 h-3 bg-ear-gold rounded-full animate-ping [animation-delay:0.2s]" />
                                        <div className="w-3 h-3 bg-ear-gold rounded-full animate-ping [animation-delay:0.4s]" />
                                    </div>
                                    <p className="text-white text-sm font-black mt-4 italic uppercase">Edwin Agudelo • Sovereign Root Access</p>
                                </div>
                            </div>
                        </BentoCard>
                    </div>
                </div>
            </div>
        </div>
    );
};
// --- VENUES & B2B PANEL ---
const VenuesB2BPanel = () => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex justify-between items-end border-b border-white/5 pb-10">
                <div>
                    <h3 className="text-4xl font-display font-black uppercase italic tracking-tighter text-white">
                        SEDES & <span className="text-purple-500">ESTATALES B2B (Venues / B2B)</span>
                    </h3>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-[0.4em] mt-2">
                        Control de Suscripciones para Discotecas & Hoteles
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link
                        to="/discotecas-premium"
                        className="px-6 py-3 bg-purple-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg shadow-purple-500/20"
                    >
                        Abrir Cockpit Discotecas
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <BentoCard title="Suscripciones Activas" subtitle="Venues bajo contrato EAR">
                    <div className="py-6 flex flex-col items-center">
                        <p className="text-5xl font-black text-white italic">12</p>
                        <p className="text-xs text-gray-500 font-bold uppercase mt-2">Nodos Operativos</p>
                        <div className="w-full h-px bg-white/5 my-6" />
                        <div className="flex gap-4">
                            <SmallKPI icon={Lock} label="Blindaje Legal" value="100%" />
                            <SmallKPI icon={CheckCircle2} label="SGAE Cloud" value="OK" />
                        </div>
                    </div>
                </BentoCard>

                <BentoCard title="Retorno por Royalties" subtitle="Payout proyectado artistas">
                    <div className="py-6 flex flex-col items-center">
                        <p className="text-5xl font-black text-ear-gold italic">€4,250</p>
                        <p className="text-xs text-gray-500 font-bold uppercase mt-2">Generado este mes</p>
                        <div className="w-full h-px bg-white/5 my-6" />
                        <SimpleProgress label="Meta de Recaudación" value={65} />
                    </div>
                </BentoCard>

                <BentoCard title="Mando Institucional" subtitle="Ayuntamientos & Grandes Cuentas">
                    <div className="space-y-4 pt-4">
                        <Link
                            to="/ayuntamientos-premium"
                            className="w-full p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between group hover:bg-blue-500/20 transition-all"
                        >
                            <span className="text-xs font-black text-blue-400 uppercase italic">Control Municipal</span>
                            <ChevronRight size={14} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/ops/dossier-vimume?town=mentrida"
                            className="w-full p-4 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-between group hover:bg-pink-500/20 transition-all"
                        >
                            <span className="text-xs font-black text-pink-400 uppercase italic">Dossier VIMUME Live</span>
                            <ChevronRight size={14} className="text-pink-500 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </BentoCard>
            </div>

            <BentoCard title="Directorio de Venues Premium" subtitle="Master Registry 2026">
                <div className="overflow-x-auto mt-6">
                    <table className="w-full text-left font-mono text-xs uppercase">
                        <thead className="text-gray-600 border-b border-white/5">
                            <tr>
                                <th className="py-4">Venue_ID</th>
                                <th className="py-4">Localización</th>
                                <th className="py-4">Plan_Tier</th>
                                <th className="py-4">Estado_Neural</th>
                                <th className="py-4 text-right">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { id: "FAB-MAD", name: "Fabrik Madrid", loc: "Madrid", tier: "Macro", status: "Active" },
                                { id: "PA-IBZ", name: "Pacha Ibiza", loc: "Ibiza", tier: "Macro", status: "Active" },
                                { id: "BC-BCN", name: "Barceló", loc: "Madrid", tier: "Club", status: "Active" }
                            ].map((venue, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors group">
                                    <td className="py-4 font-black text-white">{venue.id}</td>
                                    <td className="py-4 text-gray-400">{venue.loc}</td>
                                    <td className="py-4 text-purple-400 font-black">{venue.tier}</td>
                                    <td className="py-4">
                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-500 rounded font-black">{venue.status}</span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-blue-400">
                                            <ExternalLink size={12} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </BentoCard>
        </div>
    );
};
