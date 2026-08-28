'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Brain,
    Zap,
    Users,
    Shield,
    TrendingUp,
    Music,
    Settings,
    Smartphone,
    Eye,
    Layout,
    Search,
    ChevronRight,
    ArrowUpRight,
    Target,
    Heart,
    Globe,
    AlertTriangle,
    Database,
    Cpu
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadialLinearScale,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Radar, Pie } from 'react-chartjs-2';
import { db } from '@/lib/firebase';
import {
    collection,
    query,
    orderBy,
    limit,
    onSnapshot
} from 'firebase/firestore';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadialLinearScale,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface EarOrder {
    id: string;
    client?: string;
    userId?: string;
    total?: number;
    totalAmount?: number;
    status: string;
    items?: any[];
    paymentMethod?: string;
    createdAt?: any;
}
// --- TYPES ---
type Role = 'CEO' | 'TERAPEUTA' | 'DATA_SCIENTIST' | 'DEVOPS' | 'UX_DESIGNER' | 'PM' | 'CFO';


interface RoleConfig {
    id: Role;
    label: string;
    icon: any;
    color: string;
}

const ROLES: RoleConfig[] = [
    { id: 'CEO', label: 'Executive CEO', icon: Shield, color: '#DAA520' },
    { id: 'TERAPEUTA', label: 'Musicoterapeuta', icon: Heart, color: '#FF69B4' },
    { id: 'CFO', label: 'Financial Intelligence', icon: Zap, color: '#FFD700' },
    { id: 'DATA_SCIENTIST', label: 'Data Scientist', icon: Brain, color: '#2ECC71' },
    { id: 'PM', label: 'Project Manager', icon: Target, color: '#40E0D0' },
    { id: 'DEVOPS', label: 'DevOps / Latency', icon: Cpu, color: '#FFA07A' },
    { id: 'UX_DESIGNER', label: 'UX / Heatmaps', icon: Eye, color: '#888' },
];


// --- MOCK DATA ---
const biometricLabels = ['0m', '5m', '15m', '20m', '30m'];
const lineData = {
    labels: biometricLabels,
    datasets: [
        {
            fill: true,
            label: 'Enfoque Cognitivo',
            data: [45, 65, 85, 88, 75],
            borderColor: '#DAA520',
            backgroundColor: 'rgba(218, 165, 32, 0.2)',
            tension: 0.4,
        },
        {
            fill: true,
            label: 'Ritmo Cardiaco',
            data: [72, 85, 68, 65, 70],
            borderColor: '#FF69B4',
            backgroundColor: 'rgba(255, 105, 180, 0.1)',
            tension: 0.4,
        },
    ],
};

const radarData = {
    labels: ['Neuroplasticidad', 'Memoria', 'Social', 'Motor', 'Lenguaje'],
    datasets: [
        {
            label: 'Pre-VIMUME',
            data: [65, 59, 90, 81, 56],
            backgroundColor: 'rgba(64, 224, 208, 0.2)',
            borderColor: '#40E0D0',
            pointBackgroundColor: '#40E0D0',
        },
        {
            label: 'Post-VIMUME',
            data: [98, 90, 95, 85, 92],
            backgroundColor: 'rgba(218, 165, 32, 0.2)',
            borderColor: '#DAA520',
            pointBackgroundColor: '#DAA520',
        },
    ],
};

// --- COMPONENTS ---

const GlassCard: React.FC<{ title: string, icon: any, children: React.ReactNode, className?: string }> = ({ title, icon: Icon, children, className }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-[#081226]/80 border border-[#AAD6CD]/20 rounded-[2rem] p-6 backdrop-blur-xl hover:border-[#AAD6CD]/50 transition-all shadow-[0_10px_35px_rgba(8,18,38,0.8)] ${className}`}
    >
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-300 flex items-center gap-3">
                <Icon size={18} className="text-[#AAD6CD]" />
                {title}
            </h3>
            <ArrowUpRight size={16} className="text-[#AAD6CD]/50" />
        </div>
        <div className="h-full">
            {children}
        </div>
    </motion.div>
);

const RoleSelector: React.FC<{ active: Role, onSelect: (r: Role) => void }> = ({ active, onSelect }) => (
    <div className="flex flex-wrap gap-2 mb-12 p-2 bg-[#081226]/90 border border-[#AAD6CD]/20 rounded-3xl backdrop-blur-3xl overflow-x-auto shadow-[0_4px_25px_rgba(8,18,38,0.8)]">
        {ROLES.map((role) => (
            <button
                key={role.id}
                onClick={() => onSelect(role.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] whitespace-nowrap cursor-pointer ${active === role.id
                    ? 'bg-[#258DCD] text-white scale-105 shadow-[0_0_20px_rgba(37,141,205,0.45)] border border-[#258DCD]'
                    : 'text-zinc-400 hover:text-[#AAD6CD] hover:bg-[#0c1a36]'
                    }`}
            >
                <role.icon size={14} className={active === role.id ? 'text-white' : 'text-[#AAD6CD]/70'} />
                {role.label}
            </button>
        ))}
    </div>
);

// --- MAIN PAGE ---

export const VimumeDashboard: React.FC = () => {
    const [activeRole, setActiveRole] = useState<Role>('CEO');
    const [orders, setOrders] = useState<EarOrder[]>([]);

    const [stats, setStats] = useState({
        pagosHoy: 85,
        webhooksOk: 99,
        cumplimiento: 92,
        cobertura: 100
    });

    React.useEffect(() => {
        if (!db) return;

        // Listener para Órdenes Reales
        const q = query(collection(db, 'ear_orders'), orderBy('createdAt', 'desc'), limit(10));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EarOrder));
            setOrders(newOrders);

            // Recalcular Stats (Simulado por ahora basado en los datos reales del snap)
            const paid = newOrders.filter(o => o.status === 'PAID').length;
            const total = newOrders.length || 1;
            setStats(prev => ({
                ...prev,
                pagosHoy: Math.min(100, Math.round((paid / total) * 100))
            }));
        });

        return () => unsubscribe();
    }, []);


    return (
        <div className="w-full space-y-6">
            <div className="min-h-screen bg-[#050505] pt-6 pb-20 px-2 md:px-6">
                <div className="max-w-[1600px] mx-auto">
                    {/* HEADER STATUS CON LAS 3 ESFERAS DE LUZ CORPORATIVAS */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 p-6 rounded-3xl bg-gradient-to-r from-[#081226] via-[#040914] to-[#081226] border border-[#AAD6CD]/25 shadow-[0_10px_40px_rgba(8,18,38,0.9)]">
                        <div>
                            <div className="flex flex-wrap items-center gap-4 mb-2">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#AAD6CD]/10 border border-[#AAD6CD]/30 text-[#AAD6CD] text-[9px] font-mono font-bold uppercase">
                                    <span className="w-2 h-2 rounded-full bg-[#AAD6CD] animate-pulse shadow-[0_0_8px_#AAD6CD]" />
                                    <span>Sistema OK</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#258DCD]/10 border border-[#258DCD]/30 text-[#258DCD] text-[9px] font-mono font-bold uppercase">
                                    <span className="w-2 h-2 rounded-full bg-[#258DCD] animate-ping shadow-[0_0_8px_#258DCD]" />
                                    <span>Proceso Activo</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF455B]/10 border border-[#FF455B]/30 text-[#FF455B] text-[9px] font-mono font-bold uppercase">
                                    <span className="w-2 h-2 rounded-full bg-[#FF455B] shadow-[0_0_8px_#FF455B]" />
                                    <span>Telemetría Crítica</span>
                                </div>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-display font-black uppercase italic tracking-tighter text-white">
                                DASHBOARD <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#AAD6CD] to-[#258DCD]">NEXUS ASTRA</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[10px] text-[#AAD6CD]/70 uppercase font-black tracking-widest">Escalado 2026 Ready</p>
                                <p className="text-xs font-bold font-mono text-white">NODE_ASTRA_DIAMOND_V3</p>
                            </div>
                            <div className="w-12 h-12 bg-[#040914] border border-[#AAD6CD]/30 rounded-2xl flex items-center justify-center text-[#AAD6CD] shadow-[0_0_15px_rgba(170,214,205,0.2)]">
                                <Settings size={20} />
                            </div>
                        </div>
                    </div>

                    <RoleSelector active={activeRole} onSelect={setActiveRole} />

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <AnimatePresence mode="wait">
                            {activeRole === 'CEO' && (
                                <React.Fragment key="ceo">
                                    <GlassCard title="Impacto Social VIMUME" icon={Heart} className="lg:col-span-2 bg-gradient-to-br from-red-500/10 to-transparent">
                                        <div className="flex flex-col items-center justify-center h-full py-6 text-center">
                                            <Heart className="text-red-500 mb-4 animate-pulse" size={48} />
                                            <h4 className="text-4xl font-black text-white italic tracking-tighter mb-1">
                                                {orders.filter(o => o.items?.some(i => i.sku === 'DONATION_VIMUME')).reduce((acc, curr) => acc + (curr.totalAmount ?? 0), 0)}€
                                            </h4>
                                            <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">Recaudación Total</p>

                                            <div className="grid grid-cols-2 gap-8 mt-10 w-full">
                                                <div>
                                                    <p className="text-2xl font-black text-ear-gold">
                                                        {new Set(orders.filter(o => o.items?.some(i => i.sku === 'DONATION_VIMUME')).map(o => o.userId)).size}
                                                    </p>
                                                    <p className="text-[8px] font-black uppercase text-gray-600">Donantes Únicos</p>
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-black text-blue-400">
                                                        {Math.floor(orders.filter(o => o.items?.some(i => i.sku === 'DONATION_VIMUME')).reduce((acc, curr) => acc + (curr.totalAmount ?? 0), 0) / 45)}
                                                    </p>
                                                    <p className="text-[8px] font-black uppercase text-gray-600">Sesiones Generadas</p>
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>

                                    <GlassCard title="KPIs de Lanzamiento" icon={Shield}>
                                        <div className="flex flex-col items-center justify-center h-full py-10">
                                            <div className="relative">
                                                <div className="text-5xl font-black italic">98%</div>
                                                <div className="absolute -top-4 -right-8 bg-green-500 text-black text-[10px] px-2 py-1 rounded-full font-black">SUCCESS</div>
                                            </div>
                                            <p className="text-gray-500 text-[10px] mt-4 uppercase tracking-widest font-black">Adoption Rate</p>
                                        </div>
                                    </GlassCard>

                                    <GlassCard title="Salud Social & Impacto" icon={Globe} className="lg:col-span-2">
                                        <div className="h-[300px] w-full mt-4">
                                            <Line
                                                data={lineData}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    scales: { y: { display: false }, x: { display: false } },
                                                    plugins: { legend: { display: false } }
                                                }}
                                            />
                                        </div>
                                    </GlassCard>

                                    <GlassCard title="Eficiencia del Legado" icon={Zap}>
                                        <div className="flex flex-col items-center justify-center h-full py-10">
                                            <div className="relative">
                                                <div className="text-5xl font-black italic">62%</div>
                                                <div className="absolute -top-4 -right-8 bg-green-500 text-black text-[10px] px-2 py-1 rounded-full font-black">OPTIMAL</div>
                                            </div>
                                            <p className="text-gray-500 text-[10px] mt-4 uppercase tracking-widest font-black">Sentiment ROI</p>
                                        </div>
                                    </GlassCard>

                                    <GlassCard title="Alertas de Sistema" icon={AlertTriangle}>
                                        <div className="space-y-4">
                                            <AlertItem color="red" text="Latencia Crítica Marbella" />
                                            <AlertItem color="yellow" text="IA Drift en Predictor" />
                                            <AlertItem color="green" text="Vimume Pilot Active" />
                                        </div>
                                    </GlassCard>

                                    <GlassCard title="Estadísticas de Stakeholders" icon={Users} className="lg:col-span-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6">
                                            <MetricItem label="Familiares" value="450+" sub="Reconectados" />
                                            <MetricItem label="Centros" value="28" sub="Suscritos" />
                                            <MetricItem label="Inversores" value="12" sub="Silver Economy" />
                                            <MetricItem label="Premios" value="3" sub="Innovación '25" />
                                        </div>
                                    </GlassCard>
                                </React.Fragment>
                            )}

                            {activeRole === 'TERAPEUTA' && (
                                <React.Fragment key="terapeuta">
                                    <GlassCard title="Live Biometric Flow" icon={Activity} className="lg:col-span-3">
                                        <div className="h-[400px]">
                                            <Line
                                                data={lineData}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: { legend: { labels: { color: '#888', font: { family: 'Inter', weight: 'bold' } } } },
                                                    scales: { x: { grid: { color: '#ffffff05' } }, y: { grid: { color: '#ffffff05' } } }
                                                }}
                                            />
                                        </div>
                                    </GlassCard>

                                    <GlassCard title="Protocolo Activo" icon={Music}>
                                        <div className="space-y-6">
                                            <ActionButton label="Intro (3m)" />
                                            <ActionButton label="Opening (4m)" />
                                            <ActionButton label="Show Central" active />
                                            <div className="pt-6 border-t border-white/10">
                                                <p className="text-[10px] font-black uppercase text-gray-500 mb-4">AIA Agent Sugiere:</p>
                                                <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-500 text-xs italic">
                                                    "Bajar volumen 10db. El paciente muestra picos de estrés."
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </React.Fragment>
                            )}

                            {activeRole === 'DATA_SCIENTIST' && (
                                <React.Fragment key="data">
                                    <GlassCard title="Análisis de Neuroplasticidad" icon={Brain} className="lg:col-span-2">
                                        <div className="h-[350px]">
                                            <Radar
                                                data={radarData}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    scales: { r: { grid: { color: '#ffffff10' }, angleLines: { color: '#ffffff10' }, pointLabels: { color: '#888' } } }
                                                }}
                                            />
                                        </div>
                                    </GlassCard>

                                    <GlassCard title="Storage Estructural" icon={Database}>
                                        <p className="text-xs text-gray-400 italic mb-6">Megaproyecto indexado en Vector DB (Pinecone).</p>
                                        <div className="space-y-3">
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-ear-gold w-[85%]" />
                                            </div>
                                            <p className="text-[10px] font-mono text-gray-600 uppercase">85K Vectors Sync</p>
                                        </div>
                                    </GlassCard>

                                    <GlassCard title="Latencia Nodos" icon={Cpu}>
                                        <div className="text-center py-6">
                                            <div className="text-4xl font-black text-ear-gold">14ms</div>
                                            <p className="text-gray-500 text-[10px] uppercase font-black mt-2">Global Avg</p>
                                        </div>
                                    </GlassCard>
                                </React.Fragment>
                            )}

                            {activeRole === 'CFO' && (
                                <React.Fragment key="cfo">
                                    <GlassCard title="Telemetría de Pagos (LIVE)" icon={Zap} className="lg:col-span-2">
                                        <div className="space-y-6 py-4">
                                            <ProgressBar label="Pagos Hoy (Conversión)" value={stats.pagosHoy} color="#DAA520" />
                                            <ProgressBar label="Webhooks OK (Estabilidad)" value={stats.webhooksOk} color="#2ECC71" />
                                            <ProgressBar label="Cumplimiento (Fulfillment)" value={stats.cumplimiento} color="#40E0D0" />
                                            <ProgressBar label="Cobertura Métodos (Stripe/PayPal/Transfer)" value={stats.cobertura} color="#FF69B4" />
                                        </div>
                                    </GlassCard>

                                    <GlassCard title="Health Status: Webhooks" icon={Globe}>
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <div className="w-20 h-20 rounded-full border-4 border-ear-gold border-t-transparent animate-spin mb-4" />
                                            <p className="text-[10px] font-black uppercase text-ear-gold">Polling Eventos Stripe...</p>
                                            <p className="text-xs text-gray-500 mt-2">v3.0 Secure Webhook Layer</p>
                                        </div>
                                    </GlassCard>

                                    <GlassCard title="Alerta Riesgo Financiero" icon={AlertTriangle}>
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                            <p className="text-[10px] font-black text-red-500 uppercase mb-2">IA Predictora:</p>
                                            <p className="text-xs text-gray-400 italic leading-tight">
                                                "Sin anomalías detectadas. El flujo Bizum está operando al 100% de efectividad en España."
                                            </p>
                                        </div>
                                    </GlassCard>

                                    <GlassCard title="Log Financiero Tiempo Real (ASTRA Core)" icon={Activity} className="lg:col-span-4">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-[10px] uppercase font-black tracking-tighter">
                                                <thead>
                                                    <tr className="text-gray-500 border-b border-white/5">
                                                        <th className="py-4 px-2">ID_ORDEN</th>
                                                        <th className="py-4 px-2">FECHA</th>
                                                        <th className="py-4 px-2">METODO</th>
                                                        <th className="py-4 px-2">IMPORTE</th>
                                                        <th className="py-4 px-2">STATUS</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {orders.length > 0 ? orders.map(order => (
                                                        <tr key={order.id} className="text-gray-300 hover:bg-white/5 transition-colors">
                                                            <td className="py-4 px-2 font-mono text-ear-gold">{order.id.slice(-8)}</td>
                                                            <td className="py-4 px-2">{new Date(order.createdAt).toLocaleTimeString()}</td>
                                                            <td className="py-4 px-2">{order.paymentMethod}</td>
                                                            <td className="py-4 px-2">{order.totalAmount}€</td>
                                                            <td className="py-4 px-2">
                                                                <span className={`px-2 py-1 rounded-md ${order.status === 'PAID' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan={5} className="py-10 text-center text-gray-600">No hay transacciones registradas hoy</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </GlassCard>
                                </React.Fragment>
                            )}

                        </AnimatePresence>
                    </div>

                    {/* AI FOOTER */}
                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="p-10 bg-ear-gold rounded-[4rem] text-black">
                            <h4 className="font-black uppercase italic mb-4">ASTRA INSIGHTS</h4>
                            <p className="font-bold leading-tight mb-8">
                                "La reestructuración del megaproyecto ha sido exitosa. 14 fragmentos marcados como 'No Relacionados' han sido desplazados al storage frío."
                            </p>
                            <button className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px]">
                                Abrir Auditoría <ChevronRight size={14} />
                            </button>
                        </div>
                        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-[4rem] p-12 flex items-center justify-between">
                            <div className="flex gap-16">
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Uptime 2026</p>
                                    <p className="text-4xl font-black italic">99.99%</p>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Tokens Contexto</p>
                                    <p className="text-4xl font-black italic">1.2M</p>
                                </div>
                            </div>
                            <Smartphone className="text-ear-gold" size={40} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AlertItem = ({ color, text }: { color: string, text: string }) => (
    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-[1.5rem] border border-white/5">
        <div className={`w-2 h-2 rounded-full ${color === 'red' ? 'bg-red-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`} />
        <span className="text-[10px] font-black uppercase tracking-tight text-gray-300">{text}</span>
    </div>
);

const MetricItem = ({ label, value, sub }: { label: string, value: string, sub: string }) => (
    <div className="text-center group">
        <p className="text-[10px] font-black uppercase text-gray-500 mb-1">{label}</p>
        <p className="text-4xl font-black italic text-white group-hover:text-ear-gold transition-colors">{value}</p>
        <p className="text-[8px] font-black uppercase text-ear-gold/50">{sub}</p>
    </div>
);

const ActionButton = ({ label, active = false }: { label: string, active?: boolean }) => (
    <button className={`w-full py-4 rounded-2xl border flex items-center justify-between px-6 transition-all ${active ? 'bg-ear-gold border-ear-gold text-black' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
        }`}>
        <span className="font-black uppercase text-xs">{label}</span>
        {active ? <Zap size={16} /> : <div className="w-1 h-1 bg-white rounded-full" />}
    </button>
);

const ProgressBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-500">
            <span>{label}</span>
            <span style={{ color }}>{value}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}44` }}
            />
        </div>
    </div>
);


export default VimumeDashboard;
