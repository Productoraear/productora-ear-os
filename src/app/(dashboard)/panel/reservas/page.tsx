import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { LiveBookingsRadar } from '@/components/dashboard/LiveBookingsRadar';
import { Activity } from 'lucide-react';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
    title: 'Radar de Reservas en Vivo | Panel Operativo EAR OS',
    description: 'Telemetría y seguimiento en tiempo real de solicitudes de reserva, aceptación de proveedores y fianzas Stripe Price-Lock.'
};

export default function PanelReservasPage() {
    return (
        <main className="min-h-screen bg-[#030305] text-white pt-28 pb-20 px-4 md:px-8 selection:bg-[#ecb613] selection:text-black">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* CABECERA PRINCIPAL DEL RADAR */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono tracking-widest uppercase font-bold">
                            <Activity size={13} className="text-[#ecb613] animate-pulse" />
                            <span>TELEMETRÍA EN TIEMPO REAL // RADAR DE CIERRE S-CLASS</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black font-syne uppercase tracking-tight text-white">
                            Radar de Reservas en Vivo
                        </h1>
                        <p className="text-xs sm:text-sm text-zinc-400 font-mono">
                            Seguimiento de ventana SLA de 2 horas, aceptación formal de artistas y cobro de fianza Stripe (100 €).
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/panel/agentes"
                            className="px-4 py-2 rounded-xl bg-[#ecb613]/10 hover:bg-[#ecb613]/20 border border-[#ecb613]/30 text-xs font-mono text-[#ecb613] flex items-center gap-2 transition-all hover:scale-105"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-pulse" />
                            <span>Consola de Agentes AI ➔</span>
                        </Link>
                        <a
                            href={`tel:${CENTRALITA_EAR_OS.replace(/\s+/g, '')}`}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-zinc-300 flex items-center gap-2 transition-colors"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>Centralita {CENTRALITA_EAR_OS}</span>
                        </a>
                    </div>
                </div>

                {/* COMPONENTE INTERACTIVO RADAR */}
                <section>
                    <LiveBookingsRadar />
                </section>

            </div>
        </main>
    );
}
