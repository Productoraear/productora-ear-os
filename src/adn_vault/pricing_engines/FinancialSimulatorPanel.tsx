'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    DollarSign, 
    TrendingUp, 
    PieChart, 
    Sliders,
    Lock,
    Save,
    RotateCcw,
    Calculator,
    Target
} from 'lucide-react';

/**
 * 📊 MODULE: FINANCIAL SIMULATOR (S-Class v3.0)
 * High Precision Budget Allocation and Forecasting.
 * Logic: Asset Forecasting & Resource Management.
 */

export default FinancialSimulatorPanel;
export function FinancialSimulatorPanel() {
    const [budget, setBudget] = useState(500000);
    const [marketing, setMarketing] = useState(30);
    const [production, setProduction] = useState(40);
    const [talent, setTalent] = useState(30);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val);
    };

    const getVal = (pct: number) => (budget * pct) / 100;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-full p-2">
            
            {/* Control Wing */}
            <div className="lg:col-span-7 flex flex-col gap-8">
                <div className="p-12 bg-black/40 border border-white/5 rounded-[3.5rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden flex-1">
                    <div className="absolute -top-24 -left-20 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="flex items-center justify-between mb-16 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-[#d4af37]/10 rounded-2xl border border-[#d4af37]/20">
                                <Calculator size={28} className="text-[#d4af37]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">
                                    SIMULADOR <span className="text-[#d4af37]">FINANCIERO</span>
                                </h3>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">
                                    Dynamic Resource Allocation
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-colors">
                                <RotateCcw size={18} />
                            </button>
                            <button className="px-6 py-3 bg-[#d4af37] text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                                <Save size={14} className="inline mr-2" /> Guardar Escenario
                            </button>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {/* Master Budget */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] italic flex items-center gap-2">
                                    <Target size={14} className="text-[#d4af37]" /> Presupuesto Maestro Operativo
                                </label>
                                <span className="text-3xl font-black text-white tracking-tighter italic tabular-nums">
                                    {formatCurrency(budget)}
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="50000" 
                                max="2000000" 
                                step="50000"
                                value={budget}
                                onChange={(e) => setBudget(Number(e.target.value))}
                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                            />
                        </div>

                        {/* Distribution Sliders */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { label: 'Marketing & PR', val: marketing, set: setMarketing, color: 'text-blue-500' },
                                { label: 'Producción EAR', val: production, set: setProduction, color: 'text-[#d4af37]' },
                                { label: 'Talent Acquisition', val: talent, set: setTalent, color: 'text-emerald-500' }
                            ].map((item, i) => (
                                <div key={i} className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] space-y-6">
                                    <div className="flex flex-col gap-1">
                                        <div className={`text-[9px] font-black uppercase tracking-widest ${item.color}`}>{item.label}</div>
                                        <div className="text-xl font-black text-white italic tabular-nums">{item.val}%</div>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={item.val}
                                        onChange={(e) => item.set(Number(e.target.value))}
                                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                                    />
                                    <div className="text-[10px] font-bold text-zinc-500 tabular-nums">
                                        {formatCurrency(getVal(item.val))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-[#d4af37]/5 border border-[#d4af37]/10 rounded-[2.5rem] flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center border border-[#d4af37]/20 shadow-xl">
                            <TrendingUp className="text-[#d4af37]" size={24} />
                        </div>
                        <div>
                            <div className="text-xs font-black text-white uppercase italic">ROI Proyectado (Q4)</div>
                            <div className="text-[10px] text-[#d4af37] font-black uppercase tracking-widest">+24.8% Alpha Yield</div>
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white tracking-widest opacity-20">2.4M</div>
                </div>
            </div>

            {/* Analysis Wing */}
            <div className="lg:col-span-5 flex flex-col gap-8">
                <div className="flex-1 p-12 bg-zinc-900/40 border border-white/5 rounded-[3.5rem] flex flex-col">
                    <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-12 italic flex items-center gap-3">
                        <PieChart size={18} className="text-[#d4af37]" />
                        Análisis de Viabilidad
                    </h4>

                    <div className="space-y-10 flex-1">
                        {[
                            { label: 'Ratio de Liquidez', val: 85, color: 'bg-emerald-500' },
                            { label: 'Riesgo de Inversión', val: 12, color: 'bg-[#d4af37]' },
                            { label: 'Valoración Proyectada', val: 74, color: 'bg-blue-500' }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    <span>{stat.label}</span>
                                    <span className="text-white">{stat.val}%</span>
                                </div>
                                <div className="h-1.5 bg-black rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stat.val}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className={`h-full ${stat.color} shadow-[0_0_15px_rgba(212,175,55,0.2)]`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-8 bg-black rounded-3xl border border-white/5">
                        <div className="flex items-start gap-4">
                            <Sliders className="text-zinc-600 mt-1" size={16} />
                            <p className="text-[11px] text-zinc-400 font-bold leading-relaxed italic">
                                "El modelo predictivo sugiere aumentar el presupuesto de <span className="text-white">Marketing</span> en un <span className="text-[#d4af37]">5.2%</span> para maximizar la penetración en el mercado de streaming de lujo."
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-zinc-900 border border-white/5 rounded-[2.5rem] relative overflow-hidden group hover:border-[#d4af37]/30 transition-all cursor-pointer">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                        <Lock size={12} className="text-[#d4af37]" />
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                            <DollarSign className="text-zinc-500" size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-white uppercase tracking-widest">Escenarios de Estrés</div>
                            <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-1 italic">Ejecutar Simulación Monte Carlo</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
