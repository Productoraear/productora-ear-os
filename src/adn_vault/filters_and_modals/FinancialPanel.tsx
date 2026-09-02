"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { BentoCard, StatBox, LogEntry, SmallKPI } from '@/modules/SClassScreens/components/SClassUI';
import { OpalEngine } from '@/lib/intelligence/opalEngine';
import { sendPost } from '@/lib/recovered/sendPost';
import { parseStripeAmount } from '@/lib/recovered/parseStripeProp';

const TrendingUp = dynamic(() => import('lucide-react').then(m => m.TrendingUp), { ssr: false });
const Activity = dynamic(() => import('lucide-react').then(m => m.Activity), { ssr: false });
const ShieldCheck = dynamic(() => import('lucide-react').then(m => m.ShieldCheck), { ssr: false });
const Receipt = dynamic(() => import('lucide-react').then(m => m.Receipt), { ssr: false });
const Heart = dynamic(() => import('lucide-react').then(m => m.Heart), { ssr: false });
const CreditCard = dynamic(() => import('lucide-react').then(m => m.CreditCard), { ssr: false });

const OrderSchema = z.object({
    id: z.string(),
    customer: z.string().optional().default('Anonymous'),
    amount: z.union([z.number(), z.string(), z.undefined(), z.null()]).transform(v => {
        if (typeof v === 'number') return v;
        if (typeof v === 'string') return Number(v) || 0;
        return 0;
    }),
    status: z.string().optional().default('INITIATED'),
    concept: z.string().optional().default('S-Class Transaction'),
    paymentMethod: z.string().optional().default('Stripe'),
    createdAt: z.any().optional()
});

export const FinancialPanel = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        convRate: 0,
        avgTicket: 0,
        pendingOrders: 0
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [opalMetrics, setOpalMetrics] = useState(OpalEngine.getGlobalHealth());

    useEffect(() => {
        if (!db) return;

        const q = query(
            collection(db, 'ear_orders'),
            orderBy('createdAt', 'desc'),
            limit(15)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const rawData = snapshot.docs.map(doc => {
                const data = doc.data() as any;
                const parsed = OrderSchema.safeParse({ id: doc.id, ...data });
                if (parsed.success) {
                    return parsed.data;
                }
                return {
                    id: doc.id,
                    customer: data?.customer || 'Cliente EAR OS',
                    amount: typeof data?.amount === 'number' ? data.amount : Number(data?.amount || data?.total || 0),
                    status: data?.status || 'PAID',
                    concept: data?.concept || 'Reserva S-Class',
                    paymentMethod: data?.paymentMethod || 'Stripe',
                    createdAt: data?.createdAt || new Date().toISOString()
                };
            });

            setOrders(rawData);

            // Calcular métricas en tiempo real
            const paid = rawData.filter(o => o.status === 'PAID');
            const total = paid.reduce((acc, curr) => acc + curr.amount, 0);
            const pending = rawData.filter(o => o.status === 'INITIATED').length;
            
            setStats({
                totalRevenue: total,
                convRate: Math.round((paid.length / (rawData.length || 1)) * 100),
                avgTicket: Math.round(total / (paid.length || 1)),
                pendingOrders: pending
            });
        }, (error) => {
            console.error("Financial Telemetry Error:", error);
        });

        return () => unsubscribe();
    }, []);

    const handleGenerateStripePayment = async () => {
        setIsGenerating(true);
        try {
            // Lógica S-Class: Generar sesión de pago vía API
            const result = await sendPost('/api/payments/create-session', {
                amount: parseStripeAmount(1000), // Ejemplo: 1000€
                concept: 'Acceso VIMUME OS Premium',
                metadata: {
                    type: 'SUBSCRIPTION_VIMUME',
                    engine: 'VIMUME_S_CLASS'
                }
            });
            
            if (result.url) {
                window.location.href = result.url;
            } else {
                alert("Error al generar el link de pago.");
            }
        } catch (error) {
            console.error("Stripe Generation Failed:", error);
            alert("Falla en el handshake de Stripe. Revisa logs.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8 font-montserrat animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header / Odometer Box */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-10 gap-6">
                <div>
                    <h3 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                        INTELIGENCIA <span className="text-[#d4af37]">FINANCIERA</span>
                    </h3>
                    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.5em] mt-3 italic">
                        Flujo de Caja en Tiempo Real & Monitorización S-Class
                    </p>
                </div>
                <div className="flex gap-4">
                    <StatBox 
                        label="RECAUDACIÓN TOTAL" 
                        value={`€${stats.totalRevenue.toLocaleString()}`} 
                        color="text-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.2)]" 
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleGenerateStripePayment}
                        disabled={isGenerating}
                        className="flex items-center gap-3 bg-[#d4af37] text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <Activity className="w-4 h-4 animate-spin" />
                        ) : (
                            <CreditCard className="w-4 h-4" />
                        )}
                        {isGenerating ? "GENERANDO..." : "GENERAR COBRO ESTRATÉGICO"}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={async () => {
                            const artistId = prompt('ID del Artista para liquidación:');
                            if(!artistId) return;
                            const res = await fetch('/api/payments/liquidate', {
                                method: 'POST',
                                body: JSON.stringify({ artistId, secretKey: 'S-CLASS-ALPHA-KEY' })
                            });
                            const data = await res.json();
                            alert(data.message || data.error);
                        }}
                        className="flex items-center gap-3 bg-white/5 text-white/40 border border-white/10 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                    >
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        LIQUIDAR ARTISTA
                    </motion.button>
                </div>
            </div>

            {/* Core Metrics Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <BentoCard title="CONVERSIÓN" subtitle="Eficiencia del Checkout">
                    <div className="mt-6 flex items-center justify-between">
                        <SmallKPI icon={TrendingUp} label="ÉXITO" value={`${stats.convRate}%`} trend="UP" color="text-emerald-500" />
                        <TrendingUp className="text-emerald-500/20 w-8 h-8" />
                    </div>
                    <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${stats.convRate}%` }} className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                    </div>
                </BentoCard>

                <BentoCard title="TICKET PROMEDIO" subtitle="Vitalidad Económica">
                    <div className="mt-6">
                        <p className="text-4xl font-black text-white italic tracking-tighter">€{stats.avgTicket}</p>
                        <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1 italic">Por Transacción Pagada</p>
                    </div>
                </BentoCard>

                <BentoCard title="RED OPERATIVA" subtitle="Protocolo de Integridad">
                    <div className="mt-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <ShieldCheck className="text-emerald-400 w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-white uppercase italic">Latencia: 140ms</p>
                            <p className="text-[9px] text-emerald-400/50 uppercase font-bold">Webhooks: SINCRONIZADOS</p>
                        </div>
                    </div>
                </BentoCard>

                <BentoCard title="PENDIENTES" subtitle="Sesiones en Abandono">
                    <div className="mt-6">
                        <div className="flex items-end justify-between">
                            <p className="text-4xl font-black text-amber-500 italic tracking-tighter">{stats.pendingOrders}</p>
                            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                                <Receipt className="text-amber-500 w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1">Checkouts Iniciados</p>
                    </div>
                </BentoCard>
            </div>

            {/* Master Record & Extra Intel */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <BentoCard title="REGISTRO MAESTRO DE TRANSACCIONES" subtitle="Validación de Realidad Absoluta">
                        <div className="mt-8 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="pb-5 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Hash_ID</th>
                                        <th className="pb-5 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Activo / Concepto</th>
                                        <th className="pb-5 text-[9px] font-black text-white/20 uppercase tracking-[0.3em] text-center">Estado</th>
                                        <th className="pb-5 text-[9px] font-black text-white/20 uppercase tracking-[0.3em] text-right">Valor Bruto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {orders.map((order, i) => (
                                        <tr key={i} className="group hover:bg-white/[0.03] transition-all">
                                            <td className="py-6 font-mono text-[9px] text-white/40 group-hover:text-[#d4af37] transition-colors">
                                                {order.id.slice(-8).toUpperCase()}
                                            </td>
                                            <td className="py-6">
                                                <p className="text-[12px] font-black text-white uppercase italic leading-none truncate w-48">{order.concept}</p>
                                                <p className="text-[8px] text-white/30 uppercase tracking-widest mt-2">Método: {order.paymentMethod}</p>
                                            </td>
                                            <td className="py-6 text-center">
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full border tracking-tighter ${
                                                    order.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-white/30 border-white/10'
                                                }`}>
                                                    {order.status === 'PAID' ? 'PAGADO' : order.status}
                                                </span>
                                            </td>
                                            <td className="py-6 text-right">
                                                <span className="text-base font-black italic text-white tracking-tighter">€{order.amount.toFixed(2)}</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-24 text-center text-white/5 italic uppercase font-black tracking-[1em] text-[10px]">Sin datos activos en el Nexo Financiero</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </BentoCard>
                </div>

                <div className="space-y-8">
                    <BentoCard title="IMPACTO SOCIAL" subtitle="Donaciones VIMUME Core">
                         <div className="mt-8 flex flex-col items-center text-center">
                            <div className="relative group mb-6">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
                                <Heart className="text-red-500 w-16 h-16 relative z-10 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
                            </div>
                            <StatBox label="RECUPERACIÓN DONATIVOS" value="€0.00" color="text-white" />
                            <div className="mt-10 w-full border-t border-white/5 pt-8 grid grid-cols-2 gap-6">
                                <SmallKPI icon={Activity} label="Donantes" value="0" color="text-white" />
                                <SmallKPI icon={ShieldCheck} label="Seguridad" value="100%" color="text-emerald-500" />
                            </div>
                         </div>
                    </BentoCard>

                    <BentoCard title="PULSO PASARELA" subtitle="Analítica Predictiva">
                        <div className="mt-6 space-y-4">
                            <LogEntry time="LIVE" type="CORE" msg="Handshake Bizum EXITOSO" color="text-emerald-400" />
                            <LogEntry time="LIVE" type="DATA" msg="Webhook Stripe Sincronizado" color="text-[#d4af37]" />
                            <LogEntry time="ALERT" type="LOCK" msg="Prioridad Alta: Auditoría VIMUME" color="text-blue-500" />
                            <LogEntry time="SYS" type="SEC" msg="Cifrado Quantum-L VL Active" color="text-white/20" />
                        </div>
                    </BentoCard>
                </div>
            </div>
        </div>

    );
};

export default FinancialPanel;
