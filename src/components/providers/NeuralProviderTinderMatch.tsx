"use client";

import React, { useMemo, useState } from 'react';
import {
    Sparkles,
    CheckCircle2,
    SlidersHorizontal,
    Lock,
    MapPin,
    ShieldCheck,
    ChevronRight,
    Info,
    PhoneCall,
    Briefcase,
    Zap,
    Heart,
    X
} from 'lucide-react';
import {
    calculateProviderServiceMatch,
    type ProviderServiceMatchInput
} from '@/lib/matching/providerServiceMatcher';
import type {
    ProviderServiceCalibration,
    ProviderServiceMatchResult
} from '@/lib/matching/providerServiceCalibratorTypes';
import type { CoupleCalibration } from '@/lib/matching/calibratorTypes';

/**
 * 📦 B1.04B — NEURAL PROVIDER TINDER MATCH (200 DIMENSIONES BILATERALES)
 * Filtros de Categoría (Catering, Fotografía, Vídeo, Sonido B2G, Carpas, etc.),
 * Slider de Ticket Mínimo / Presupuesto y Selector de Provincias.
 * Estética S-Class OLED True Black (#030305, oro #ecb613, esmeralda #10B981).
 */

export interface CanonicalProviderService {
    id: string;
    slug: string;
    name: string;
    category: string;
    province: string;
    basePrice: number;
    priceRange?: string;
    rating?: number | null;
    reviewsCount?: number | null;
    description?: string;
    imageUrls: string[];
    img?: string | null;
    telephone?: string | null;
    contactHref?: string | null;
    source?: string;
    verified?: boolean;
    calibratedBy?: 'self' | 'admin';
    completionPercent?: number;
    dimensions: Record<number, unknown>;
}

interface NeuralProviderTinderMatchProps {
    providers: CanonicalProviderService[];
    coupleCalibration: CoupleCalibration;
    onSelectProvider?: (provider: CanonicalProviderService) => void;
}

const CANONICAL_CATEGORIES = [
    'Todas las categorías',
    'Catering',
    'Fotografía',
    'Vídeo',
    'Sonido/Luces B2G',
    'Carpas',
    'Flores',
    'Autobuses',
    'Planners',
    'Animación',
    'Mobiliario'
];

const PROVINCIAS = [
    'Todas las provincias',
    'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz',
    'Baleares', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón',
    'Ceuta', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara',
    'Gipuzkoa', 'Huelva', 'Huesca', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas',
    'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Melilla', 'Murcia', 'Navarra',
    'Ourense', 'Palencia', 'Pontevedra', 'Salamanca', 'Segovia', 'Sevilla', 'Soria',
    'Tarragona', 'Tenerife', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya',
    'Zamora', 'Zaragoza'
];

function toProviderCalibration(p: CanonicalProviderService): ProviderServiceCalibration {
    return {
        providerServiceId: p.id,
        providerServiceName: p.name,
        presetSlug: p.slug,
        dimensions: (p.dimensions || {}) as ProviderServiceCalibration['dimensions'],
        completionPercent: p.completionPercent ?? 100,
        calibratedBy: p.calibratedBy ?? 'admin'
    };
}

const formatEuro = (n: number): string => `${n.toLocaleString('es-ES')} €`;

export const NeuralProviderTinderMatch: React.FC<NeuralProviderTinderMatchProps> = ({
    providers,
    coupleCalibration,
    onSelectProvider
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas las categorías');
    const [maxBudget, setMaxBudget] = useState<number>(8000);
    const [province, setProvince] = useState<string>('Todas las provincias');
    const [isSwipeMode, setIsSwipeMode] = useState(false);
    const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [dismissed, setDismissed] = useState<string[]>([]);
    const [inspectedProvider, setInspectedProvider] = useState<{
        provider: CanonicalProviderService;
        matchResult: ProviderServiceMatchResult;
    } | null>(null);

    const matchedProviders = useMemo(() => {
        return providers
            .map((p) => {
                const providerServiceCalibration = toProviderCalibration(p);
                const input: ProviderServiceMatchInput = {
                    coupleCalibration,
                    providerServiceCalibration
                };
                const matchResult: ProviderServiceMatchResult = calculateProviderServiceMatch(input);

                const pasaCategoria =
                    selectedCategory === 'Todas las categorías' || p.category === selectedCategory;
                const pasaProvincia =
                    province === 'Todas las provincias' || (p.province || '') === province;
                const pasaPresupuesto = p.basePrice <= maxBudget;

                return {
                    ...p,
                    matchResult,
                    pasaCategoria,
                    pasaProvincia,
                    pasaPresupuesto
                };
            })
            .filter((p) => p.pasaCategoria && p.pasaProvincia && p.pasaPresupuesto)
            .sort((a, b) => b.matchResult.bilateralScore - a.matchResult.bilateralScore);
    }, [providers, coupleCalibration, selectedCategory, province, maxBudget]);

    const activeSwipeProvider = matchedProviders[currentSwipeIndex] || null;

    const handleSwipe = (direction: 'left' | 'right') => {
        if (!activeSwipeProvider) return;
        if (direction === 'right') {
            setFavorites((prev) => [...prev, activeSwipeProvider.id]);
        } else {
            setDismissed((prev) => [...prev, activeSwipeProvider.id]);
        }
        setCurrentSwipeIndex((prev) => prev + 1);
    };

    return (
        <div className="w-full space-y-8">
            {/* 🎛️ PANEL DE CONTROL NEURAL 200D */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#0c0c14] to-[#07070b] border border-white/10 shadow-2xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                        <h3 className="text-base sm:text-lg font-bold font-syne text-white flex items-center gap-2">
                            <SlidersHorizontal size={16} className="text-[#ecb613]" />
                            <span>Calibrador Neural de Proveedores B2B/B2G (200 Dimensiones)</span>
                        </h3>
                        <p className="text-xs text-zinc-400">
                            Catering, Fotografía, Vídeo, Carpas y Sonido con Price-Lock 100 €, Split 80/10/10 y Garantía EAR OS.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsSwipeMode(!isSwipeMode)}
                        className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-1.5 transition-all"
                    >
                        <Sparkles size={12} className="text-[#ecb613]" />
                        <span>{isSwipeMode ? 'Vista Cuadrícula' : 'Modo Swipe / Tinder'}</span>
                    </button>
                </div>

                {/* Chips de Categorías */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                            Gremio de Servicio ({CANONICAL_CATEGORIES.length - 1})
                        </span>
                        <span className="text-[10px] font-mono text-[#ecb613]">
                            {selectedCategory === 'Todas las categorías' ? 'Todos los Gremios' : selectedCategory}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                        {CANONICAL_CATEGORIES.map((cat) => {
                            const isSelected = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                        isSelected
                                            ? 'bg-[#ecb613] text-black font-semibold shadow-lg shadow-[#ecb613]/20 scale-105'
                                            : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Controles de Presupuesto y Provincia */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                    {/* Slider de Presupuesto */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-400 font-mono text-[11px]">Ticket Máximo de Servicio</span>
                            <span className="text-[#ecb613] font-bold font-mono text-sm">
                                {formatEuro(maxBudget)}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={300}
                            max={15000}
                            step={100}
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(Number(e.target.value))}
                            className="w-full accent-[#ecb613] bg-zinc-800 h-2 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-zinc-600">
                            <span>300 €</span>
                            <span>Depósito: 100 € Stripe</span>
                            <span>15.000 € (Licitación B2G)</span>
                        </div>
                    </div>

                    {/* Selector de Provincia */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-zinc-400 font-mono text-[11px]">Ubicación del Evento</span>
                            <span className="text-zinc-300 font-mono text-[11px]">{province}</span>
                        </div>
                        <select
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            aria-label="Ubicación del Evento"
                            className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-[#ecb613] focus:outline-none font-mono"
                        >
                            {PROVINCIAS.map((p) => (
                                <option key={p} value={p} className="bg-zinc-900 text-white">
                                    {p}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Telemetría rápida */}
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/5">
                    <span>
                        Proveedores calibrados:{' '}
                        <strong className="text-white font-bold">{matchedProviders.length}</strong> / {providers.length}
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1">
                        <ShieldCheck size={13} />
                        Fianza 100 € Price-Lock Activa
                    </span>
                </div>
            </div>

            {/* 📱 MODO SWIPE / TINDER */}
            {isSwipeMode ? (
                <div className="max-w-md mx-auto space-y-4">
                    {activeSwipeProvider ? (
                        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#101018] to-[#07070b] border border-white/10 shadow-2xl p-4 space-y-4">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900">
                                <img
                                    src={activeSwipeProvider.img || activeSwipeProvider.imageUrls[0]}
                                    alt={activeSwipeProvider.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono text-white flex items-center gap-1">
                                    <Sparkles size={11} className="text-[#ecb613]" />
                                    <span>{activeSwipeProvider.matchResult.bilateralScore}% Match</span>
                                </div>
                                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#ecb613] uppercase tracking-wider">
                                    {activeSwipeProvider.category}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-bold font-syne text-white">{activeSwipeProvider.name}</h4>
                                <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1 font-mono">
                                    <MapPin size={12} className="text-zinc-500" />
                                    <span>{activeSwipeProvider.province}</span>
                                    <span className="text-zinc-600">·</span>
                                    <span className="text-[#ecb613] font-bold">
                                        Ticket desde {formatEuro(activeSwipeProvider.basePrice)}
                                    </span>
                                </p>
                            </div>

                            <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
                                {activeSwipeProvider.description}
                            </p>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => handleSwipe('left')}
                                    className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 font-mono text-xs flex items-center justify-center gap-2"
                                >
                                    <X size={16} /> Descartar
                                </button>
                                <button
                                    onClick={() => handleSwipe('right')}
                                    className="flex-1 py-3 rounded-2xl bg-[#ecb613] hover:bg-[#d8a40f] text-black font-semibold font-mono text-xs flex items-center justify-center gap-2"
                                >
                                    <Heart size={16} className="fill-black" /> Guardar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 p-6 rounded-3xl bg-zinc-950 border border-white/10 space-y-3">
                            <p className="text-sm font-mono text-zinc-400">Has revisado todos los proveedores de este filtro.</p>
                            <button
                                onClick={() => setCurrentSwipeIndex(0)}
                                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono text-white"
                            >
                                Reiniciar Swipe
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* 🔲 VISTA CUADRÍCULA / GRID */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matchedProviders.map((p) => {
                        const score = p.matchResult.bilateralScore;
                        const scoreColor =
                            score >= 85 ? 'text-emerald-400 border-emerald-500/30' : score >= 70 ? 'text-[#ecb613] border-[#ecb613]/30' : 'text-zinc-400 border-zinc-700';

                        return (
                            <div
                                key={p.id}
                                className="group relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0c0c14] to-[#050507] border border-white/10 hover:border-[#ecb613]/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
                            >
                                <div>
                                    {/* Imagen de Cabecera */}
                                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                                        <img
                                            src={p.img || p.imageUrls[0]}
                                            alt={p.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] via-transparent to-transparent opacity-80" />

                                        {/* Badge Score */}
                                        <div
                                            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border ${scoreColor} text-[11px] font-mono font-bold flex items-center gap-1`}
                                        >
                                            <Zap size={11} />
                                            <span>{score}% Match</span>
                                        </div>

                                        {/* Gremio Badge */}
                                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#ecb613] uppercase tracking-wider">
                                            {p.category}
                                        </div>
                                    </div>

                                    {/* Contenido Ficha */}
                                    <div className="p-5 space-y-3">
                                        <div className="space-y-1">
                                            <h4 className="text-base font-bold font-syne text-white group-hover:text-[#ecb613] transition-colors">
                                                {p.name}
                                            </h4>
                                            <p className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono">
                                                <MapPin size={12} className="text-zinc-500" />
                                                <span>{p.province}</span>
                                                <span className="text-zinc-600">·</span>
                                                <span className="text-zinc-300">Ticket min: </span>
                                                <strong className="text-[#ecb613]">{formatEuro(p.basePrice)}</strong>
                                            </p>
                                        </div>

                                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                                            {p.description}
                                        </p>

                                        {/* Fortalezas de Match Bilateral */}
                                        {p.matchResult.providerStrengths.length > 0 && (
                                            <div className="pt-2 border-t border-white/5 space-y-1">
                                                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                                    <CheckCircle2 size={10} /> Puntos Fuertes ({p.matchResult.providerStrengths.length})
                                                </span>
                                                <p className="text-[11px] text-zinc-300 font-mono truncate">
                                                    {p.matchResult.providerStrengths.slice(0, 2).join(' · ')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Transaccional */}
                                <div className="p-5 pt-0 space-y-3">
                                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-3 border-t border-white/5">
                                        <span>Split Soberano 80/10/10</span>
                                        <span className="text-[#ecb613]">Price-Lock 100 €</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setInspectedProvider({ provider: p, matchResult: p.matchResult })}
                                            className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 flex items-center justify-center gap-1 transition-all"
                                        >
                                            <Info size={13} />
                                            <span>200D Score</span>
                                        </button>

                                        <a
                                            href={p.contactHref || 'tel:+34693693048'}
                                            onClick={() => onSelectProvider?.(p)}
                                            className="py-2.5 px-3 rounded-xl bg-[#ecb613] hover:bg-[#d8a40f] text-black font-semibold font-mono text-xs flex items-center justify-center gap-1 transition-all shadow-lg shadow-[#ecb613]/10"
                                        >
                                            <PhoneCall size={13} />
                                            <span>Contactar</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 🔍 MODAL DETALLE 200D BREAKDOWN */}
            {inspectedProvider && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-[#0b0b10] border border-white/15 p-6 shadow-2xl space-y-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613]">
                                    Auditoría Bilateral 200D
                                </span>
                                <h3 className="text-lg font-bold font-syne text-white">
                                    {inspectedProvider.provider.name}
                                </h3>
                                <p className="text-xs text-zinc-400 font-mono">
                                    {inspectedProvider.provider.category} · {inspectedProvider.provider.province}
                                </p>
                            </div>
                            <button
                                onClick={() => setInspectedProvider(null)}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Puntuaciones */}
                        <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-black/40 border border-white/5 text-center font-mono">
                            <div>
                                <div className="text-[10px] text-zinc-500 uppercase">Afinidad Pareja</div>
                                <div className="text-base font-bold text-white">
                                    {inspectedProvider.matchResult.coupleScore}%
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-zinc-500 uppercase">Proveedor SSOT</div>
                                <div className="text-base font-bold text-white">
                                    {inspectedProvider.matchResult.providerServiceScore}%
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-zinc-500 uppercase">Score Bilateral</div>
                                <div className="text-base font-bold text-[#ecb613]">
                                    {inspectedProvider.matchResult.bilateralScore}%
                                </div>
                            </div>
                        </div>

                        {/* Desglose de Knockouts o Advertencias */}
                        {inspectedProvider.matchResult.knockouts.length > 0 && (
                            <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-400 space-y-1">
                                <div className="font-bold flex items-center gap-1">
                                    <Lock size={12} /> Requisitos Incompatibles (Knockouts)
                                </div>
                                <ul className="list-disc list-inside space-y-0.5 text-[11px] font-mono">
                                    {inspectedProvider.matchResult.knockouts.map((k, i) => (
                                        <li key={i}>{k}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Desglose de Dimensiones */}
                        <div className="space-y-2">
                            <h5 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                                Muestra de Dimensiones Calibradas
                            </h5>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                {inspectedProvider.matchResult.dimensionBreakdown.slice(0, 15).map((d) => (
                                    <div
                                        key={d.dimensionId}
                                        className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs font-mono"
                                    >
                                        <span className="text-zinc-300 truncate max-w-[240px]">{d.label}</span>
                                        <span
                                            className={`font-bold ${
                                                d.matchPercent >= 80
                                                    ? 'text-emerald-400'
                                                    : d.matchPercent >= 50
                                                    ? 'text-[#ecb613]'
                                                    : 'text-zinc-500'
                                            }`}
                                        >
                                            {d.matchPercent}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Final */}
                        <div className="pt-2">
                            <a
                                href={inspectedProvider.provider.contactHref || 'tel:+34693693048'}
                                className="w-full py-3 rounded-2xl bg-[#ecb613] hover:bg-[#d8a40f] text-black font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ecb613]/20"
                            >
                                <PhoneCall size={14} />
                                Bloquear Fecha con Depósito de 100 €
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
