'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
    Zap, 
    TrendingUp, 
    Users, 
    Globe, 
    Shield, 
    Activity,
    ArrowUpRight
} from 'lucide-react';

/**
 * 📈 MODULE: GROWTH PULSE (S-Class v3.0)
 * High-Impact Animated Statistics Panel.
 * Perspective: Real-time Growth, User Engagement, Global Infrastructure.
 */

interface StatProps {
    label: string;
    value: number;
    suffix: string;
    description: string;
    icon: any;
    color: string;
    delay: number;
}

const StatNode = ({ label, value, suffix, description, icon: Icon, color, delay }: StatProps) => {
    const [count, setCount] = useState(0);
    const [isInView, setIsInView] = useState(false);
    const nodeRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
            { threshold: 0.1 }
        );
        if (nodeRef.current) observer.observe(nodeRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const end = value;
        const duration = 2000;
        let timer = setInterval(() => {
            start += Math.ceil(end / (duration / 16));
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 16);
        return () => clearInterval(timer);
    }, [isInView, value]);

    return (
        <motion.div 
            ref={nodeRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay }}
            className="relative group p-10 bg-zinc-900/40 border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-xl hover:border-[#d4af37]/30 transition-all shadow-2xl"
        >
            <div className={`absolute -top-10 -right-10 w-32 h-32 ${color} opacity-[0.03] blur-3xl group-hover:opacity-10 transition-opacity`} />
            
            <div className="flex items-start justify-between mb-8">
                <div className={`p-4 bg-black border border-white/10 rounded-2xl ${color.replace('bg-', 'text-')} shadow-xl`}>
                    <Icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-[#d4af37]">
                    <ArrowUpRight size={14} />
                    <span className="text-[10px] font-black tracking-widest italic">ACTIVE</span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white italic tracking-tighter tabular-nums">
                        {count.toLocaleString()}
                    </span>
                    <span className="text-xl font-black text-[#d4af37] italic uppercase tracking-tighter">{suffix}</span>
                </div>
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">{label}</h3>
            </div>

            <p className="mt-8 text-[11px] text-zinc-500 font-bold leading-relaxed italic border-t border-white/5 pt-6">
                {description}
            </p>
        </motion.div>
    );
};

export default GrowthPulsePanel;
export function GrowthPulsePanel() {
    return (
        <div className="space-y-12">
            
            {/* Header Area */}
            <div className="flex items-center justify-between px-4">
                <div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                        EL PULSO <span className="text-[#d4af37]">DEL CRECIMIENTO</span>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-[#d4af37] rounded-full animate-ping" />
                            <div className="w-1 h-1 bg-[#d4af37] rounded-full animate-ping delay-100" />
                            <div className="w-1 h-1 bg-[#d4af37] rounded-full animate-ping delay-200" />
                        </div>
                    </h3>
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] mt-1">S-Class Global Telemetry Engine</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-zinc-900 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest italic">Snapshot: Q2 2026</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <StatNode 
                    label="Artistas Registrados"
                    value={1240}
                    suffix="K"
                    description="Crecimiento exponencial de talento bajo el ecosistema de producción EAR."
                    icon={Users}
                    color="bg-blue-500"
                    delay={0.1}
                />
                <StatNode 
                    label="Uptime Infraestructura"
                    value={99.9}
                    suffix="%"
                    description="Estabilidad absoluta garantizada por el motor de Nexus OS y Global Engineering."
                    icon={Shield}
                    color="bg-emerald-500"
                    delay={0.2}
                />
                <StatNode 
                    label="Suscripciones Aktivas"
                    value={842}
                    suffix="UNITS"
                    description="Flujo recurrente de suscripciones S-Class en 42 regiones globales."
                    icon={Zap}
                    color="bg-[#d4af37]"
                    delay={0.3}
                />
                <StatNode 
                    label="Nodos Desplegados"
                    value={52}
                    suffix="REGIONS"
                    description="Distribución global de servidores de datos y puntos de acceso VIMUME."
                    icon={Globe}
                    color="bg-purple-500"
                    delay={0.4}
                />
                <StatNode 
                    label="Transacciones (24h)"
                    value={15200}
                    suffix="OPS"
                    description="Volumen total de operaciones financieras procesadas por el Vault."
                    icon={TrendingUp}
                    color="bg-emerald-400"
                    delay={0.5}
                />
                <StatNode 
                    label="Carga del Sistema"
                    value={14}
                    suffix="%"
                    description="Optimización de recursos bajo el protocolo Alpha God Mode."
                    icon={Activity}
                    color="bg-zinc-500"
                    delay={0.6}
                />
            </div>

            {/* Tactical Graph Overlay (Mock) */}
            <div className="p-12 bg-black border border-white/5 rounded-[4rem] relative overflow-hidden h-64 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                 <div className="absolute inset-0 flex items-end justify-between px-20 pb-10 opacity-20">
                     {[40, 70, 45, 90, 65, 80, 50, 95, 75, 100].map((h, i) => (
                         <div key={i} className="w-8 bg-[#d4af37] rounded-t-lg transition-all duration-1000" style={{ height: `${h}%` }} />
                     ))}
                 </div>
                 <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                     <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-4">Análisis de Frecuencia Proyectada</p>
                     <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Protocolo S-Class Dominance Activo</p>
                 </div>
            </div>
        </div>
    );
}
