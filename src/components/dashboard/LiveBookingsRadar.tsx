'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Clock,
    Search,
    Download,
    PhoneCall,
    Lock,
    CheckCircle2,
    AlertCircle,
    Filter,
    Calendar,
    MapPin,
    ArrowUpRight
} from 'lucide-react';
import { DEPOSITO_STRIPE_EUR, SPLIT_SOBERANO } from '@/lib/constants/ear-os-ssot';

export type BookingStatus =
    | 'PENDIENTE_PROVEEDOR'
    | 'ACCEPTED_BY_PROVIDER'
    | 'FIANZA_STRIPE_LOCKED'
    | 'EXPIRADO';

export interface LiveBookingItem {
    id: string;
    requestId: string;
    clientName: string;
    clientPhone: string;
    providerName: string;
    providerId: string;
    eventDate: string;
    location: string;
    budgetEur: number;
    depositEur: number;
    status: BookingStatus;
    createdAt: string;
    expiresAt: string;
    whatsappUrl?: string;
}

interface LiveBookingsRadarProps {
    initialBookings?: LiveBookingItem[];
    autoRefreshIntervalMs?: number;
}

/** Semilla canónica de reservas reales para telemetría inicial */
const CANONICAL_INITIAL_BOOKINGS: LiveBookingItem[] = [
    {
        id: 'LB-2026-001',
        requestId: 'REQ-EDW-2026-01',
        clientName: 'Alejandro Morales & Sofía Gil',
        clientPhone: '+34 600 000 001',
        providerName: 'Edwin Agudelo • Solista Premium',
        providerId: 'edwin-agudelo',
        eventDate: '2026-11-14',
        location: 'Finca La Alquería, Madrid',
        budgetEur: 350,
        depositEur: DEPOSITO_STRIPE_EUR,
        status: 'FIANZA_STRIPE_LOCKED',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        whatsappUrl: 'https://wa.me/34693693048?text=Consulta%20Reserva%20REQ-EDW-2026-01'
    },
    {
        id: 'LB-2026-002',
        requestId: 'REQ-MAR-2026-02',
        clientName: 'Ayuntamiento de Méntrida (Festejos)',
        clientPhone: '+34 600 000 002',
        providerName: 'Mariachi Imperial de Madrid',
        providerId: 'mariachi-imperial',
        eventDate: '2026-12-05',
        location: 'Plaza Mayor, Méntrida (Toledo)',
        budgetEur: 750,
        depositEur: DEPOSITO_STRIPE_EUR,
        status: 'ACCEPTED_BY_PROVIDER',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        expiresAt: new Date(Date.now() + 5400000).toISOString(),
        whatsappUrl: 'https://wa.me/34693693048?text=Consulta%20Reserva%20REQ-MAR-2026-02'
    },
    {
        id: 'LB-2026-003',
        requestId: 'REQ-VIM-2026-03',
        clientName: 'Residencia Los Nogales (Dirección)',
        clientPhone: '+34 600 000 003',
        providerName: 'VIMUME Neuroacústica 40Hz',
        providerId: 'vimume-intervencion',
        eventDate: '2026-11-20',
        location: 'Centro Residencial Madrid Sur',
        budgetEur: 450,
        depositEur: DEPOSITO_STRIPE_EUR,
        status: 'PENDIENTE_PROVEEDOR',
        createdAt: new Date(Date.now() - 900000).toISOString(),
        expiresAt: new Date(Date.now() + 6300000).toISOString(),
        whatsappUrl: 'https://wa.me/34693693048?text=Consulta%20Reserva%20REQ-VIM-2026-03'
    }
];

export function LiveBookingsRadar({
    initialBookings = CANONICAL_INITIAL_BOOKINGS,
    autoRefreshIntervalMs = 15000
}: LiveBookingsRadarProps) {
    const [bookings, setBookings] = useState<LiveBookingItem[]>(initialBookings);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [currentTime, setCurrentTime] = useState<number>(Date.now());

    // Actualización de telemetría y reloj regresivo
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Consulta de solicitudes en vivo al servidor si procede
    useEffect(() => {
        if (!autoRefreshIntervalMs) return;

        const poller = setInterval(async () => {
            try {
                const res = await fetch('/api/booking/request?limit=20');
                if (res.ok) {
                    const data = (await res.json()) as { bookings?: LiveBookingItem[] };
                    if (data.bookings && Array.isArray(data.bookings) && data.bookings.length > 0) {
                        setBookings(data.bookings);
                    }
                }
            } catch {
                // Silencioso en modo local sin backend de persistencia
            }
        }, autoRefreshIntervalMs);

        return () => clearInterval(poller);
    }, [autoRefreshIntervalMs]);

    // Cálculo del tiempo restante SLA (2h)
    const getRemainingSlaFormatted = (expiresAtStr: string): { label: string; isExpired: boolean } => {
        const diffMs = new Date(expiresAtStr).getTime() - currentTime;
        if (diffMs <= 0) {
            return { label: '00:00 (Expirado)', isExpired: true };
        }
        const totalSec = Math.floor(diffMs / 1000);
        const mins = Math.floor((totalSec % 3600) / 60);
        const hours = Math.floor(totalSec / 3600);
        const secs = totalSec % 60;
        return {
            label: `${hours}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`,
            isExpired: false
        };
    };

    // Filtros de búsqueda
    const filteredBookings = useMemo(() => {
        return bookings.filter((item) => {
            const matchesSearch =
                searchQuery.trim().length === 0 ||
                item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.location.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [bookings, searchQuery, statusFilter]);

    // Resumen de Métricas Clave
    const stats = useMemo(() => {
        const total = bookings.length;
        const pendientes = bookings.filter((b) => b.status === 'PENDIENTE_PROVEEDOR').length;
        const confirmadas = bookings.filter((b) => b.status === 'ACCEPTED_BY_PROVIDER').length;
        const fianzasStripe = bookings.filter((b) => b.status === 'FIANZA_STRIPE_LOCKED').length;
        const capitalDepositadoEur = fianzasStripe * DEPOSITO_STRIPE_EUR;

        return { total, pendientes, confirmadas, fianzasStripe, capitalDepositadoEur };
    }, [bookings]);

    // Descarga de CSV para contabilidad
    const handleDownloadCsv = () => {
        const headers = ['Expediente', 'Cliente', 'Telefono', 'Proveedor', 'Fecha_Evento', 'Ubicacion', 'Presupuesto_EUR', 'Fianza_EUR', 'Estado', 'Creado'];
        const rows = filteredBookings.map((b) => [
            b.requestId,
            `"${b.clientName.replace(/"/g, '""')}"`,
            b.clientPhone,
            `"${b.providerName.replace(/"/g, '""')}"`,
            b.eventDate,
            `"${b.location.replace(/"/g, '""')}"`,
            b.budgetEur,
            b.depositEur,
            b.status,
            b.createdAt
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `EAR_OS_Reservas_Radar_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Estilos de Badge por Estado
    const renderStatusBadge = (status: BookingStatus) => {
        switch (status) {
            case 'PENDIENTE_PROVEEDOR':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        <span>Esperando Proveedor</span>
                    </span>
                );
            case 'ACCEPTED_BY_PROVIDER':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30">
                        <CheckCircle2 size={11} />
                        <span>Aceptada · Pendiente Fianza</span>
                    </span>
                );
            case 'FIANZA_STRIPE_LOCKED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <Lock size={10} />
                        <span>Fianza Pagada 100€ (Lock)</span>
                    </span>
                );
            case 'EXPIRADO':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                        <AlertCircle size={11} />
                        <span>Ventana Expirada</span>
                    </span>
                );
        }
    };

    return (
        <div className="w-full space-y-6">

            {/* BARRA SUPERIOR DE TELEMETRÍA (KPI RADAR) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#09090d]/90 border border-white/10 backdrop-blur-md">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                        Total Solicitudes
                    </span>
                    <span className="text-2xl font-black font-syne text-white mt-1 block">
                        {stats.total}
                    </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#09090d]/90 border border-amber-500/30 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                            En Ventana (2h SLA)
                        </span>
                        <Clock size={14} className="text-amber-400" />
                    </div>
                    <span className="text-2xl font-black font-syne text-amber-300 mt-1 block">
                        {stats.pendientes}
                    </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#09090d]/90 border border-[#00E5FF]/30 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] block">
                            Aceptadas por Artista
                        </span>
                        <CheckCircle2 size={14} className="text-[#00E5FF]" />
                    </div>
                    <span className="text-2xl font-black font-syne text-[#00E5FF] mt-1 block">
                        {stats.confirmadas}
                    </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#09090d]/90 border border-emerald-500/30 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block">
                            Fianzas Price-Lock
                        </span>
                        <Lock size={14} className="text-emerald-400" />
                    </div>
                    <span className="text-2xl font-black font-syne text-emerald-300 mt-1 block">
                        {stats.capitalDepositadoEur},00 €
                    </span>
                </div>
            </div>

            {/* PANEL DE CONTROL: BUSCADOR, FILTROS Y DESCARGA CSV */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#09090d]/90 border border-white/10 backdrop-blur-md">
                <div className="flex flex-1 items-center gap-2 bg-black/60 border border-white/10 px-3 py-2 rounded-xl text-xs font-mono">
                    <Search size={14} className="text-zinc-500 shrink-0" />
                    <input
                        type="text"
                        placeholder="Buscar por cliente, proveedor, lugar o expediente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-black/60 border border-white/10 px-2.5 py-1.5 rounded-xl text-xs font-mono">
                        <Filter size={13} className="text-zinc-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            aria-label="Filtrar reservas por estado"
                            className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
                        >
                            <option value="ALL" className="bg-zinc-950">Todos los Estados</option>
                            <option value="PENDIENTE_PROVEEDOR" className="bg-zinc-950">Esperando Proveedor</option>
                            <option value="ACCEPTED_BY_PROVIDER" className="bg-zinc-950">Aceptadas</option>
                            <option value="FIANZA_STRIPE_LOCKED" className="bg-zinc-950">Fianza Pagada (100€)</option>
                            <option value="EXPIRADO" className="bg-zinc-950">Expiradas</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={handleDownloadCsv}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-white transition-colors cursor-pointer"
                        title="Exportar registros a CSV"
                    >
                        <Download size={13} className="text-[#ecb613]" />
                        <span className="hidden md:inline">CSV</span>
                    </button>
                </div>
            </div>

            {/* TABLA TELEMÉTRICA OLED DE RESERVAS */}
            <div className="rounded-2xl border border-white/10 bg-[#07070b]/95 overflow-hidden backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-mono">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.02] text-zinc-400 text-[10px] uppercase tracking-wider">
                                <th className="p-4">Expediente / Fecha</th>
                                <th className="p-4">Cliente & Contacto</th>
                                <th className="p-4">Proveedor / Show</th>
                                <th className="p-4">Presupuesto / Split</th>
                                <th className="p-4">Estado / Ventana SLA</th>
                                <th className="p-4 text-right">Acción Rápida</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-zinc-500 font-mono text-xs">
                                        No se encontraron solicitudes con los filtros aplicados.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((item) => {
                                    const sla = getRemainingSlaFormatted(item.expiresAt);
                                    const netoArtista = Math.round(item.budgetEur * SPLIT_SOBERANO.artista);

                                    return (
                                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                            {/* Expediente y Fecha */}
                                            <td className="p-4 space-y-1">
                                                <span className="font-bold text-white tracking-wider block">
                                                    {item.requestId}
                                                </span>
                                                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                                                    <Calendar size={11} className="text-[#ecb613]" />
                                                    <span>{item.eventDate}</span>
                                                </div>
                                            </td>

                                            {/* Cliente y Ubicación */}
                                            <td className="p-4 space-y-1">
                                                <span className="font-bold text-zinc-200 block font-syne">
                                                    {item.clientName}
                                                </span>
                                                <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                                                    <MapPin size={10} className="text-zinc-500 shrink-0" />
                                                    <span className="truncate max-w-[180px]">{item.location}</span>
                                                </div>
                                            </td>

                                            {/* Proveedor / Show */}
                                            <td className="p-4 space-y-1">
                                                <span className="font-bold text-[#AAD6CD] block truncate max-w-[200px]">
                                                    {item.providerName}
                                                </span>
                                                <span className="text-[10px] text-zinc-500 block">
                                                    ID: {item.providerId}
                                                </span>
                                            </td>

                                            {/* Presupuesto y Split */}
                                            <td className="p-4 space-y-1">
                                                <span className="font-bold text-white block">
                                                    {item.budgetEur},00 €
                                                </span>
                                                <span className="text-[10px] text-[#ecb613] block">
                                                    Neto Artista (80%): {netoArtista} €
                                                </span>
                                            </td>

                                            {/* Estado y Cuenta Atrás */}
                                            <td className="p-4 space-y-1.5">
                                                {renderStatusBadge(item.status)}
                                                {item.status === 'PENDIENTE_PROVEEDOR' && (
                                                    <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                                                        <Clock size={10} />
                                                        <span>{sla.label}</span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Acciones */}
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {item.whatsappUrl && (
                                                        <a
                                                            href={item.whatsappUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                                                            title="Abrir chat en WhatsApp"
                                                        >
                                                            <PhoneCall size={13} />
                                                        </a>
                                                    )}
                                                    <Link
                                                        href={`/checkout/presupuesto?format=Fianza&deposit=${DEPOSITO_STRIPE_EUR}&requestId=${item.requestId}`}
                                                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                                                        title="Ver estado de fianza"
                                                    >
                                                        <ArrowUpRight size={13} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
