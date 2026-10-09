'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    ShieldCheck,
    Zap,
    Users,
    ArrowRight,
    Volume2,
    VolumeX,
    SlidersHorizontal,
    Phone,
    Compass,
    Sparkles,
    CheckCircle2,
    Building2,
    Gauge,
} from 'lucide-react';
import type { FincaHomologada } from '@/lib/constants/fincas-catalog';
import { CENTRALITA } from '@/lib/phone-constants';
import { getFincaImage } from '@/lib/constants/fincas-images';
import NeuralNavigation from './NeuralNavigation';
interface FincasCatalogExplorerProps {
    fincas: FincaHomologada[];
    provinceName: string;
}

type SortKey = 'cercania' | 'aforo-desc' | 'aforo-asc';

/**
 * 🏰 EXPLORADOR DE FINCAS HOMOLOGADAS S-CLASS
 * Viaje del cliente perfecto: filtra por aforo, cercanía a Méntrida y
 * ausencia de limitador acústico, y desemboca en la reserva con Price-Lock.
 */
export default function FincasCatalogExplorer({ fincas, provinceName }: FincasCatalogExplorerProps) {
    const [minPax, setMinPax] = useState(0);
    const [maxKm, setMaxKm] = useState(200);
    const [onlyNoLimiter, setOnlyNoLimiter] = useState(false);
    const [sortKey, setSortKey] = useState<SortKey>('cercania');

    const maxKmBound = useMemo(
        () => Math.max(150, ...fincas.map((f) => f.distanciaHubMentridaKm)),
        [fincas],
    );

    const results = useMemo(() => {
        const filtered = fincas.filter((f) => {
            if (f.capacidadMaxPax < minPax) return false;
            if (f.distanciaHubMentridaKm > maxKm) return false;
            if (onlyNoLimiter && f.limiteAcustico.limitadorInstalado) return false;
            return true;
        });

        return [...filtered].sort((a, b) => {
            if (sortKey === 'aforo-desc') return b.capacidadMaxPax - a.capacidadMaxPax;
            if (sortKey === 'aforo-asc') return a.capacidadMaxPax - b.capacidadMaxPax;
            return a.distanciaHubMentridaKm - b.distanciaHubMentridaKm;
        });
    }, [fincas, minPax, maxKm, onlyNoLimiter, sortKey]);

    const noLimiterCount = useMemo(
        () => fincas.filter((f) => !f.limiteAcustico.limitadorInstalado).length,
        [fincas],
    );

    return (
        <div className="space-y-8">
            {/* 🎛️ PANEL DE FILTROS INTELIGENTES */}
            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/20">
                        <SlidersHorizontal size={18} className="text-[#ecb613]" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-wider text-white font-syne">
                            Ajusta tu espacio ideal
                        </h2>
                        <p className="text-[11px] font-mono text-zinc-400">
                            Filtros sobre datos reales de la red certificada
                        </p>
                    </div>
                    <span className="ml-auto px-3.5 py-1.5 rounded-full bg-[#ecb613] text-black text-[11px] font-mono font-black uppercase tracking-wider">
                        {results.length} / {fincas.length}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Aforo mínimo */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                <Users size={13} className="text-[#ecb613]" /> Aforo mínimo
                            </span>
                            <span className="text-xs font-black text-white font-syne">
                                {minPax === 0 ? 'Cualquiera' : `${minPax} pax`}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={800}
                            step={50}
                            value={minPax}
                            onChange={(e) => setMinPax(Number(e.target.value))}
                            className="w-full accent-[#ecb613] cursor-pointer"
                        />
                    </div>

                    {/* Distancia máxima */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                <Compass size={13} className="text-[#00E5FF]" /> Distancia máx. a Méntrida
                            </span>
                            <span className="text-xs font-black text-white font-syne">{maxKm} km</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={maxKmBound}
                            step={5}
                            value={maxKm}
                            onChange={(e) => setMaxKm(Number(e.target.value))}
                            className="w-full accent-[#00E5FF] cursor-pointer"
                        />
                    </div>

                    {/* Sin limitador */}
                    <div className="space-y-3">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                            <Volume2 size={13} className="text-emerald-400" /> Libertad acústica
                        </span>
                        <button
                            type="button"
                            onClick={() => setOnlyNoLimiter((v) => !v)}
                            className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all ${onlyNoLimiter
                                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                                }`}
                        >
                            <span className="text-xs font-bold font-syne flex items-center gap-2">
                                {onlyNoLimiter ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                Sin limitador instalado
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40">
                                {noLimiterCount} fincas
                            </span>
                        </button>
                    </div>
                </div>

                {/* Ordenación */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mr-1">
                        Ordenar por:
                    </span>
                    {([
                        { key: 'cercania', label: 'Más cercana a Méntrida' },
                        { key: 'aforo-desc', label: 'Mayor aforo' },
                        { key: 'aforo-asc', label: 'Menor aforo' },
                    ] as Array<{ key: SortKey; label: string }>).map((opt) => (
                        <button
                            key={opt.key}
                            type="button"
                            onClick={() => setSortKey(opt.key)}
                            className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold font-mono uppercase tracking-wide border transition-all ${sortKey === opt.key
                                ? 'bg-[#ecb613] text-black border-[#ecb613]'
                                : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 🏰 GRID DE RESULTADOS */}
            {results.length > 0 ? (
                <>
                    <NeuralNavigation fincas={results} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {results.map((finca) => (
                                <FincaCard key={finca.id} finca={finca} />
                            ))}
                        </AnimatePresence>
                    </div>
                </>
            ) : (
                <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-12 text-center space-y-4">
                    <Sparkles size={32} className="mx-auto text-[#ecb613]" />
                    <h3 className="text-lg font-black uppercase font-syne text-white">
                        Ningún espacio con esos criterios
                    </h3>
                    <p className="text-zinc-400 text-sm max-w-md mx-auto">
                        Amplía el aforo, la distancia o desactiva el filtro acústico. Nuestro equipo también
                        localiza espacios a medida para tu evento en {provinceName}.
                    </p>
                    <a
                        href={`${CENTRALITA.whatsapp}?text=${encodeURIComponent(
                            `Hola Productora EAR, busco un espacio a medida para mi evento en ${provinceName}.`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#ecb613] text-black font-mono text-xs font-black uppercase rounded-xl hover:bg-amber-300 transition-all"
                    >
                        <Phone size={14} /> Búsqueda personalizada
                    </a>
                </div>
            )}
        </div>
    );
}

function FincaCard({ finca }: { finca: FincaHomologada }) {
    const img = getFincaImage(finca.id);
    const facturables = Math.max(0, finca.distanciaHubMentridaKm - 50);
    const hasLimiter = finca.limiteAcustico.limitadorInstalado;
    const freeFieldDba = finca.limiteAcustico.exteriorDBA;

    const reserveHref = `/cotizador?finca=${encodeURIComponent(finca.id)}&provincia=${encodeURIComponent(
        finca.provincia,
    )}&ocasion=${encodeURIComponent('Fincas para Bodas')}`;

    const waHref = `${CENTRALITA.whatsapp}?text=${encodeURIComponent(
        `Hola Productora EAR, me interesa reservar "${finca.name}" (${finca.location}). ¿Está libre mi fecha?`,
    )}`;

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="rounded-3xl overflow-hidden bg-[#09090d]/80 border border-white/10 backdrop-blur-md hover:border-[#ecb613]/50 transition-all flex flex-col group shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
        >
            <div className="relative h-52 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={img}
                    alt={finca.name}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-[#09090d]/30 to-transparent" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur border border-[#ecb613]/30 text-[#ecb613] font-mono text-[10px] uppercase tracking-widest">
                    <ShieldCheck size={12} /> Certificada S-Class
                </span>
                <span
                    className={`absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur font-mono text-[10px] uppercase tracking-widest ${hasLimiter
                        ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                        : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                        }`}
                >
                    {hasLimiter ? <Volume2 size={11} /> : <VolumeX size={11} />}
                    {hasLimiter ? `Limitador ${freeFieldDba} dB` : `Libre ${freeFieldDba} dB`}
                </span>
            </div>

            <div className="p-6 space-y-4 flex flex-col flex-grow">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                        <MapPin size={11} className="text-[#ecb613]" /> {finca.location}
                    </p>
                    <h3 className="font-syne text-xl font-black text-white mt-1 group-hover:text-[#ecb613] transition-colors">
                        {finca.name}
                    </h3>
                </div>

                <p className="font-sans text-xs text-white/60 leading-relaxed line-clamp-3 flex-grow">
                    {finca.description}
                </p>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="flex items-center gap-1.5 text-white/40 mb-1">
                            <Users size={12} className="text-[#ecb613]" /> Aforo
                        </span>
                        <span className="text-white font-bold">{finca.capacidadMaxPax} pax</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="flex items-center gap-1.5 text-white/40 mb-1">
                            <Zap size={12} className="text-[#ecb613]" /> Potencia
                        </span>
                        <span className="text-white font-bold">{finca.potenciaKw} kW</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="flex items-center gap-1.5 text-white/40 mb-1">
                            <Gauge size={12} className="text-[#00E5FF]" /> Logística
                        </span>
                        <span className="text-white font-bold">
                            {finca.distanciaHubMentridaKm} km
                            {facturables > 0 ? ` · ${facturables} fact.` : ' · 0 fact.'}
                        </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="flex items-center gap-1.5 text-white/40 mb-1">
                            <Building2 size={12} className="text-[#ecb613]" /> RC
                        </span>
                        <span className="text-white font-bold">
                            {finca.polizaRC.coberturaEuros.toLocaleString('es-ES')} €
                        </span>
                    </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                    <Link
                        href={reserveHref}
                        className="w-full py-3.5 bg-gradient-to-r from-[#ecb613] to-[#f5d77f] hover:from-white hover:to-white text-black font-syne font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ecb613]/20"
                    >
                        <CheckCircle2 size={15} />
                        Reservar · Bloqueo 100 €
                    </Link>
                    <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ecb613]/40 text-white font-mono text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                        <Phone size={13} className="text-[#ecb613]" />
                        Consultar disponibilidad
                        <ArrowRight size={12} />
                    </a>
                </div>
            </div>
        </motion.article>
    );
}