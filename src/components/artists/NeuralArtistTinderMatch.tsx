"use client";

import React, { useMemo, useState } from 'react';
import {
    Sparkles,
    Heart,
    X,
    SlidersHorizontal,
    CheckCircle2,
    AlertCircle,
    Lock,
    MapPin,
    Guitar
} from 'lucide-react';
import {
    calculateArtistMatch,
    type ArtistMatchInput
} from '@/lib/matching/artistMatcher';
import type {
    ArtistCalibration,
    ArtistMatchResult
} from '@/lib/matching/artistCalibratorTypes';
import type { CoupleCalibration } from '@/lib/matching/calibratorTypes';

/**
 * 🎸 B1.03 — NEURAL ARTIST TINDER MATCH
 * Replica del estilo Airbnb/Tinder OLED de NeuralFincaTinderMatch, aplicado
 * al dataset curado de artistas (public/data/artists/artists_canonical.json).
 * Selectores rápidos: Formato, Presupuesto (Price-Lock 100€), Logística (Provincias).
 */

export interface CanonicalArtist {
    id: string;
    slug: string;
    name: string;
    province: string;
    municipality?: string;
    region?: string;
    category?: string;
    formats: string[];
    genres: string[];
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
    sourceUrl?: string | null;
    status?: string;
    vampirizedAt?: string | null;
    calibratedBy?: 'self' | 'admin';
    completionPercent?: number;
    dimensions: Record<number, unknown>;
}

interface NeuralArtistTinderMatchProps {
    artists: CanonicalArtist[];
    coupleCalibration: CoupleCalibration;
    onSelectArtist?: (artist: CanonicalArtist) => void;
}

const ARTIST_FORMATS = [
    'Solista Acústico',
    'Mariachi (3-9 pax)',
    'Dúo/Trío',
    'Cuarteto Cuerda',
    'Banda Pop/Rock (4-6 pax)',
    'DJ + Instrumento Live',
    'Orquesta Gran Formato (8+ pax)',
    'Charanga',
    'Coro Gospel',
    'Soprano/Tenor Lírico',
    'Flamenco Cuadro',
    'Tuna'
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

function toArtistCalibration(a: CanonicalArtist): ArtistCalibration {
    return {
        artistId: a.id,
        artistName: a.name,
        presetSlug: a.slug,
        dimensions: (a.dimensions || {}) as ArtistCalibration['dimensions'],
        completedAt: a.vampirizedAt ?? undefined,
        completionPercent: a.completionPercent ?? 72,
        calibratedBy: a.calibratedBy ?? 'self'
    };
}

const formatEuro = (n: number): string => `${n.toLocaleString('es-ES')} €`;

export const NeuralArtistTinderMatch: React.FC<NeuralArtistTinderMatchProps> = ({
    artists,
    coupleCalibration,
    onSelectArtist
}) => {
    const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
    const [budget, setBudget] = useState<number>(1000);
    const [province, setProvince] = useState<string>('Todas las provincias');
    const [isSwipeMode, setIsSwipeMode] = useState(false);
    const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [dismissed, setDismissed] = useState<string[]>([]);

    const matchedArtists = useMemo(() => {
        const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        return artists
            .map((a) => {
                const artistCalibration = toArtistCalibration(a);
                const input: ArtistMatchInput = {
                    coupleCalibration,
                    artistCalibration
                };
                const matchResult: ArtistMatchResult = calculateArtistMatch(input);

                const tags: string[] = [
                    ...(Array.isArray(a.formats) ? a.formats : []),
                    ...(Array.isArray(a.genres) ? a.genres : [])
                ].map(String);

                const pasaFormato = selectedFormat
                    ? tags.some((t) => norm(t) === norm(selectedFormat))
                    : true;
                const pasaProvincia =
                    province === 'Todas las provincias' || (a.province || '') === province;
                const pasaPresupuesto = a.basePrice <= budget;

                return {
                    ...a,
                    matchResult,
                    pasaFormato,
                    pasaProvincia,
                    pasaPresupuesto
                };
            })
            .filter((a) => a.pasaFormato && a.pasaProvincia && a.pasaPresupuesto)
            .sort((a, b) => b.matchResult.bilateralScore - a.matchResult.bilateralScore);
    }, [artists, coupleCalibration, selectedFormat, province, budget]);

    const activeSwipeArtist = matchedArtists[currentSwipeIndex] || null;

    const handleSwipe = (direction: 'left' | 'right') => {
        if (!activeSwipeArtist) return;
        if (direction === 'right') {
            setFavorites((prev) => [...prev, activeSwipeArtist.id]);
        } else {
            setDismissed((prev) => [...prev, activeSwipeArtist.id]);
        }
        setCurrentSwipeIndex((prev) => prev + 1);
    };

    const bestScore = matchedArtists[0]?.matchResult.bilateralScore ?? 0;

    return (
        <div className="w-full space-y-8">
            {/* 🎛️ CALIBRADOR NEURAL ARTISTA (FORMATO · PRESUPUESTO · LOGÍSTICA) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#0c0c14] to-[#07070b] border border-white/10 shadow-2xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                        <h3 className="text-base sm:text-lg font-bold font-syne text-white flex items-center gap-2">
                            <SlidersHorizontal size={16} className="text-[#ecb613]" />
                            <span>Selector Neural de Artista (200 Dimensiones)</span>
                        </h3>
                        <p className="text-xs text-zinc-400">
                            Formato musical, presupuesto con Price-Lock 100 € y logística por provincia.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsSwipeMode(!isSwipeMode)}
                        className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-1.5 transition-all"
                    >
                        <Sparkles size={12} className="text-[#ecb613]" />
                        <span>{isSwipeMode ? 'Vista Cuadrícula' : 'Activar Modo Match Rápido'}</span>
                    </button>
                </div>

                {/* Chips de Formato */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                            Formato de Formación (12)
                        </span>
                        <span className="text-[10px] font-mono text-[#ecb613]">
                            {selectedFormat ?? 'Todos'}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {ARTIST_FORMATS.map((f) => {
                            const active = selectedFormat === f;
                            return (
                                <button
                                    key={f}
                                    onClick={() => setSelectedFormat(active ? null : f)}
                                    className={`px-3 py-1.5 rounded-full border text-[11px] font-mono transition-all ${active
                                        ? 'bg-[#ecb613]/15 border-[#ecb613] text-[#ecb613]'
                                        : 'bg-black/40 border-white/10 text-zinc-400 hover:border-white/30'
                                        }`}
                                >
                                    {f}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Slider de Presupuesto + Select de Provincia */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono">
                            <span className="text-zinc-400 uppercase">Presupuesto Música en Vivo:</span>
                            <strong className="text-[#ecb613] text-sm">{formatEuro(budget)}</strong>
                        </div>
                        <input
                            type="range"
                            min={350}
                            max={5000}
                            step={50}
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                            className="w-full accent-[#ecb613] bg-zinc-800 h-2 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                            <span>350 € solista</span>
                            <span>1.200 € banda</span>
                            <span>5.000 €+ gala</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono">
                            <span className="text-zinc-400 uppercase">Provincia del Evento:</span>
                            <strong className="text-white text-sm">{province}</strong>
                        </div>
                        <select
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-[#ecb613]"
                        >
                            {PROVINCIAS.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Indicador Price-Lock SSOT */}
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-4 py-2 rounded-full w-fit">
                    <Lock size={12} />
                    <span>Price-Lock 100 € · Split 80/10/10 · Límite acústico 75 dBA</span>
                </div>
            </div>

            {/* 📱 MODO SWIPE RÁPIDO (TINDER MODE) */}
            {isSwipeMode && activeSwipeArtist && (
                <div className="max-w-md mx-auto p-4 bg-[#090912] rounded-3xl border border-[#ecb613]/40 shadow-2xl space-y-4 text-center">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black">
                        <img
                            src={activeSwipeArtist.img || activeSwipeArtist.imageUrls?.[0] || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop'}
                            alt={activeSwipeArtist.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#ecb613] text-[#ecb613] font-mono text-xs font-black">
                            {activeSwipeArtist.matchResult.bilateralScore}% Afinidad
                        </div>
                    </div>

                    <div className="space-y-1 text-left">
                        <h3 className="text-xl font-bold font-syne text-white">{activeSwipeArtist.name}</h3>
                        <p className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                            <MapPin size={12} className="text-[#ecb613]" />
                            <span>{activeSwipeArtist.province || 'Madrid'}, España</span>
                        </p>
                        <p className="text-xs font-mono text-[#ecb613]">
                            {activeSwipeArtist.formats.join(' · ')} · desde {formatEuro(activeSwipeArtist.basePrice)}
                        </p>
                    </div>

                    <div className="p-3 bg-black/50 rounded-2xl border border-white/5 text-left text-xs font-mono space-y-1.5">
                        {activeSwipeArtist.matchResult.coupleStrengths.slice(0, 2).map((st, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                                <CheckCircle2 size={13} className="shrink-0" />
                                <span>{st}</span>
                            </div>
                        ))}
                        {activeSwipeArtist.matchResult.warnings.slice(0, 1).map((wn, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-amber-400 text-[11px]">
                                <AlertCircle size={13} className="shrink-0" />
                                <span>{wn}</span>
                            </div>
                        ))}
                    </div>

                    <a
                        href={activeSwipeArtist.contactHref || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3.5 bg-[#ecb613] hover:bg-amber-400 text-black font-black font-mono text-xs uppercase rounded-xl transition-all shadow-lg text-center"
                    >
                        Contactar Artista
                    </a>

                    <div className="flex items-center justify-center gap-6 pt-2">
                        <button
                            onClick={() => handleSwipe('left')}
                            className="w-14 h-14 rounded-full bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all active:scale-90"
                            aria-label="Descartar"
                        >
                            <X size={24} />
                        </button>
                        <button
                            onClick={() => handleSwipe('right')}
                            className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-xl"
                            aria-label="Guardar en favoritos"
                        >
                            <Heart size={28} className="fill-current" />
                        </button>
                    </div>
                    <p className="text-[10px] font-mono text-zinc-500">
                        Artista {currentSwipeIndex + 1} de {matchedArtists.length} · Swipe o botones
                    </p>
                </div>
            )}

            {/* 🏆 RESULTADOS RANKING NEURAL BIDIRECCIONAL */}
            {!isSwipeMode && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/5 pb-2">
                        <span>Ranking por Afinidad Neural Bilateral</span>
                        <span>
                            Mostrando {matchedArtists.length} Artistas · Máx {bestScore}%
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matchedArtists.slice(0, 9).map((artist) => {
                            const { matchResult } = artist;
                            const isTop = matchResult.bilateralScore >= 85;

                            return (
                                <div
                                    key={artist.id}
                                    className="rounded-3xl bg-[#090910] border border-white/10 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between overflow-hidden group shadow-xl hover:-translate-y-1 duration-300"
                                >
                                    <div className="relative aspect-[16/10] bg-black overflow-hidden">
                                        <img
                                            src={artist.img || artist.imageUrls?.[0] || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop'}
                                            alt={artist.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                        />

                                        <div className="absolute top-3 left-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-mono font-black backdrop-blur-md border ${isTop ? 'bg-[#ecb613] text-black border-amber-300' : 'bg-black/80 text-[#ecb613] border-[#ecb613]/40'
                                                }`}>
                                                {matchResult.bilateralScore}% Match
                                            </span>
                                        </div>

                                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-[10px] border border-white/10">
                                            desde {formatEuro(artist.basePrice)}
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <h4 className="text-lg font-bold font-syne text-white group-hover:text-[#ecb613] transition-colors">
                                                {artist.name}
                                            </h4>
                                            <p className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                                                <MapPin size={12} className="text-[#ecb613]" />
                                                <span>{artist.province || 'Madrid'}, España</span>
                                            </p>
                                            <p className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                                                <Guitar size={12} className="text-[#ecb613]" />
                                                <span>{artist.formats.join(' · ')}</span>
                                            </p>

                                            <div className="p-3 bg-black/50 rounded-2xl border border-white/5 text-[11px] font-mono space-y-1">
                                                {matchResult.coupleStrengths.slice(0, 2).map((st, idx) => (
                                                    <div key={idx} className="flex items-center gap-1.5 text-emerald-400 line-clamp-1">
                                                        <CheckCircle2 size={12} className="shrink-0" />
                                                        <span>{st}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-3 border-t border-white/10">
                                            <a
                                                href={artist.contactHref || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full py-3 bg-[#ecb613] hover:bg-amber-400 text-black font-black font-mono text-xs uppercase rounded-xl transition-all text-center"
                                            >
                                                Contactar Artista
                                            </a>
                                            <p className="text-[9px] font-mono text-zinc-500 text-center">
                                                {artist.telephone ? 'Contacto directo verificado' : 'Ficha de origen · Búsqueda directa'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NeuralArtistTinderMatch;