import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Globe } from 'lucide-react';

/**
 * BENTO CARD S-CLASS: Contenedor con Glassmorphism y protección de CLS.
 */
export const BentoCard = ({ title, subtitle, children, danger = false }: any) => (
    <div className={`bg-white/5 border ${danger ? 'border-red-500/30 hover:border-red-500/60' : 'border-white/10 hover:border-ear-gold/30'} rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden flex flex-col group transition-all duration-500 hover:shadow-2xl hover:shadow-ear-gold/5 hover:-translate-y-1`}>
        {danger && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-pulse" />}
        <div className="flex justify-between items-start mb-6 font-montserrat">
            <div>
                <h3 className={`text-xl font-black uppercase italic tracking-tighter ${danger ? 'text-red-500' : 'text-white'} group-hover:tracking-normal transition-all duration-500`}>{title}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic leading-none">{subtitle}</p>
            </div>
            {danger && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
        </div>
        <div className="flex-1 relative z-10">
            {children}
        </div>
    </div>
);

/**
 * STAT BOX: Visualización de métricas financieras y operativas.
 */
export const StatBox = ({ label, value, color = "text-white", className = "" }: any) => (
    <div className={`text-right group cursor-default ${className} font-montserrat`}>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 group-hover:text-ear-gold transition-colors">{label}</p>
        <p className={`${color} text-2xl font-black italic tracking-tighter`}>{value}</p>
    </div>
);

/**
 * LOG ENTRY: Registro forense de telemetría y despliegues.
 */
export const LogEntry = ({ time, type, msg, color = "text-gray-400" }: any) => (
    <div className="flex gap-4 items-center group py-1 border-b border-white/[0.02] last:border-0 font-mono text-[10px] uppercase tracking-wider">
        <span className="text-gray-600 w-12 shrink-0">{time}</span>
        <span className={`w-10 font-black shrink-0 ${color}`}>[{type}]</span>
        <span className="text-gray-300 group-hover:text-white transition-colors truncate">{msg}</span>
    </div>
);

/**
 * SMALL KPI: Indicador de rendimiento con soporte para carga dinámica.
 * FIX: Se usa tipo 'any' para el prop 'icon' para evitar errores de asignación de LucideIcon.
 */
export const SmallKPI = ({ icon: Icon, label, value, trend, color = "text-white" }: { icon?: any, label: string, value: string, trend?: string, color?: string }) => (
    <div className="flex items-center gap-4 p-4 bg-black/20 border border-white/5 rounded-2xl font-montserrat group hover:border-ear-gold/20 transition-all">
        {Icon && <Icon size={16} className="text-ear-gold shrink-0" />}
        <div>
            <p className="text-[10px] font-black uppercase text-gray-600 leading-none mb-1 group-hover:text-gray-400 transition-colors">{label}</p>
            <div className="flex items-center gap-2">
                <p className={`text-xs font-black italic leading-none ${color}`}>{value}</p>
                {trend && <span className={`text-[8px] font-bold ${trend === 'UP' ? 'text-emerald-500' : 'text-rose-500'}`}>{trend === 'UP' ? '↑' : '↓'}</span>}
            </div>
        </div>
    </div>
);

/**
 * BLUEPRINT VIZ: Visualización de telemetría de activos globales.
 */
export const BlueprintViz = () => (
    <div className="h-32 bg-blue-500/10 rounded-xl relative overflow-hidden border border-blue-500/20">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.3)_50%,transparent_75%)] bg-[length:50px_50px]" />
        <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="text-blue-500 animate-spin-slow opacity-40" size={64} />
        </div>
    </div>
);
