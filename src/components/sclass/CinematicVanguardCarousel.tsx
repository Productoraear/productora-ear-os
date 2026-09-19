"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Maximize2,
    X,
    Play,
    Pause,
    Clapperboard,
    Orbit,
    Waves,
    Layers3,
    Film
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════
   CINEMATIC VANGUARD CAROUSEL — ÚLTIMA GENERACIÓN
   Modos de comportamiento seleccionables por pestañas:
   cinema · vórtice 3D · crossfade · stack · desfile
   ═══════════════════════════════════════════════════════════════════ */

export type CarouselMode = 'cinema' | 'vortex' | 'crossfade' | 'stack' | 'parade';

interface CinematicVanguardCarouselProps {
    images: string[];
    title?: string;
    className?: string;
    aspectRatio?: 'video' | 'wide' | 'auto';
    autoPlayInterval?: number; // ms, 0 desactiva
    defaultMode?: CarouselMode;
}

const MODE_META: Array<{ id: CarouselMode; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'cinema', label: 'Cine', icon: Clapperboard },
    { id: 'vortex', label: 'Vórtice 3D', icon: Orbit },
    { id: 'crossfade', label: 'Crossfade', icon: Waves },
    { id: 'stack', label: 'Stack', icon: Layers3 },
    { id: 'parade', label: 'Desfile', icon: Film }
];

const PLACEHOLDER =
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop';

function normalizeImages(images: string[]): string[] {
    const cleaned = (images || [])
        .filter((img) => typeof img === 'string' && img.trim().length > 5 && !img.includes('.svg'))
        .map((img) => {
            if (img.startsWith('//')) return `https:${img}`;
            if (img.startsWith('/uploads/')) return `https://www.celebrents.es${img}`;
            return img;
        });
    const unique = Array.from(new Set(cleaned));
    return unique.length > 0 ? unique : [PLACEHOLDER];
}

export default function CinematicVanguardCarousel({
    images = [],
    title = 'Galería Cinemática',
    className = '',
    aspectRatio = 'video',
    autoPlayInterval = 6000,
    defaultMode = 'cinema'
}: CinematicVanguardCarouselProps) {
    const cleanImages = useMemo(() => normalizeImages(images), [images]);
    const total = cleanImages.length;

    const [mode, setMode] = useState<CarouselMode>(defaultMode);
    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [lightbox, setLightbox] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const next = useCallback(() => setIndex((p) => (p + 1) % total), [total]);
    const prev = useCallback(() => setIndex((p) => (p - 1 + total) % total), [total]);
    const goTo = useCallback((i: number) => setIndex(((i % total) + total) % total), [total]);

    // Autoplay cinematográfico
    useEffect(() => {
        if (autoPlayInterval <= 0 || total <= 1 || !playing || lightbox) return;
        const timer = setInterval(next, autoPlayInterval);
        return () => clearInterval(timer);
    }, [autoPlayInterval, next, playing, lightbox, total]);

    // Teclado
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'Escape' && lightbox) setLightbox(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [next, prev, lightbox]);

    const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
    const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const d = touchStart - touchEnd;
        if (d > 50) next();
        if (d < -50) prev();
        setTouchStart(null);
        setTouchEnd(null);
    };

    const ratioClass =
        aspectRatio === 'video' ? 'aspect-video' : aspectRatio === 'wide' ? 'aspect-[21/9]' : 'h-72 sm:h-96';

    const offset = (i: number) => (i - index + total) % total;

    return (
        <>
            <div
                className={`relative w-full rounded-3xl overflow-hidden bg-[#030305] border border-white/10 shadow-2xl flex flex-col group ${className}`}
            >
                {/* ── BARRA DE PESTAÑAS DE COMPORTAMIENTO (PREVISUALIZACIÓN) ── */}
                <div className="relative z-30 flex items-center gap-1 p-2.5 bg-black/60 backdrop-blur-xl border-b border-white/10">
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                        {MODE_META.map((m) => {
                            const Icon = m.icon;
                            const active = mode === m.id;
                            return (
                                <button
                                    key={m.id}
                                    onClick={() => setMode(m.id)}
                                    className={`shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${active
                                        ? 'bg-[#ecb613] text-black font-black shadow-[0_0_18px_rgba(236,182,19,0.35)]'
                                        : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent'
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {m.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="ml-auto flex items-center gap-1.5">
                        {total > 1 && (
                            <button
                                onClick={() => setPlaying((p) => !p)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 transition"
                                title={playing ? 'Pausar' : 'Reproducir'}
                            >
                                {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            </button>
                        )}
                        <span className="text-[10px] font-mono text-zinc-500 px-2">
                            {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
                        </span>
                    </div>
                </div>

                {/* ── VISOR PRINCIPAL SEGÚN MODO ── */}
                <div
                    className={`relative w-full ${ratioClass} bg-[#050508] overflow-hidden cursor-pointer flex items-center justify-center`}
                    onClick={() => setLightbox(true)}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {mode === 'cinema' && <KenBurnsStage images={cleanImages} index={index} title={title} />}
                    {mode === 'vortex' && <VortexStage images={cleanImages} index={index} offset={offset} title={title} />}
                    {mode === 'crossfade' && <CrossfadeStage images={cleanImages} index={index} title={title} />}
                    {mode === 'stack' && <StackStage images={cleanImages} index={index} offset={offset} title={title} />}
                    {mode === 'parade' && <ParadeStage images={cleanImages} index={index} title={title} />}

                    {/* Gradiente cinematográfico */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Controles */}
                    {total > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prev(); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/85 border border-white/10 hover:border-[#ecb613]/50 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 shadow-lg backdrop-blur-sm"
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="w-5 h-5 text-[#ecb613]" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); next(); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/85 border border-white/10 hover:border-[#ecb613]/50 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 shadow-lg backdrop-blur-sm"
                                aria-label="Siguiente"
                            >
                                <ChevronRight className="w-5 h-5 text-[#ecb613]" />
                            </button>
                        </>
                    )}

                    {/* Fullscreen */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
                        className="absolute bottom-3 right-3 z-20 p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-[#ecb613] hover:border-[#ecb613]/50 transition"
                        title="Ver pantalla completa"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>

                    {/* Título superpuesto */}
                    <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
                        <span className="text-[11px] font-mono font-bold text-[#ecb613] tracking-wider uppercase drop-shadow">
                            {title}
                        </span>
                    </div>
                </div>

                {/* ── PROGRESO CINEMATOGRÁFICO ── */}
                {total > 1 && (
                    <div className="flex gap-1.5 px-3 py-2.5 bg-black/70 border-t border-white/5">
                        {cleanImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className="h-1 flex-1 rounded-full bg-white/15 overflow-hidden cursor-pointer group/bar"
                            >
                                <span
                                    className={`block h-full bg-gradient-to-r from-[#ecb613] to-amber-300 transition-all duration-500 ${i === index ? 'w-full' : i < index ? 'w-full opacity-40' : 'w-0 group-hover/bar:w-1/2'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── LIGHTBOX ── */}
            {lightbox && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 select-none animate-fade-in" onClick={() => setLightbox(false)}>
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 z-20">
                        <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613]">
                            <Clapperboard className="w-4 h-4" />
                            <span className="font-bold uppercase tracking-wider">{title}</span>
                            <span className="text-zinc-500">·</span>
                            <span className="text-zinc-300">{index + 1} / {total}</span>
                        </div>
                        <button onClick={() => setLightbox(false)} className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div
                        className="flex-1 flex items-center justify-center relative p-2"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <img
                            src={cleanImages[index]}
                            alt={`${title} ampliada`}
                            referrerPolicy="no-referrer"
                            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                            className="max-h-[80vh] max-w-[95vw] object-contain rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.9)]"
                        />
                        {total > 1 && (
                            <>
                                <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 border border-zinc-700 hover:border-[#ecb613] text-[#ecb613] transition"><ChevronLeft className="w-6 h-6" /></button>
                                <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 border border-zinc-700 hover:border-[#ecb613] text-[#ecb613] transition"><ChevronRight className="w-6 h-6" /></button>
                            </>
                        )}
                    </div>

                    {total > 1 && (
                        <div className="flex justify-center gap-2 overflow-x-auto py-3 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                            {cleanImages.map((img, i) => (
                                <button key={i} onClick={() => goTo(i)} className={`w-14 h-10 rounded-lg overflow-hidden shrink-0 border transition ${i === index ? 'border-[#ecb613] ring-2 ring-[#ecb613]/50 scale-105' : 'border-zinc-800 opacity-40 hover:opacity-80'}`}>
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

/* ───────────────────────── STAGES ───────────────────────── */

function KenBurnsStage({ images, index, title }: { images: string[]; index: number; title: string }) {
    return (
        <div className="absolute inset-0">
            {images.map((src, i) => (
                <img
                    key={i}
                    src={src}
                    alt={`${title} ${i + 1}`}
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out ${i === index ? 'opacity-100 kenburns' : 'opacity-0'}`}
                />
            ))}
        </div>
    );
}

function VortexStage({ images, index, offset, title }: { images: string[]; index: number; offset: (i: number) => number; title: string }) {
    return (
        <div className="absolute inset-0 [perspective:1200px] flex items-center justify-center">
            {images.map((src, i) => {
                const o = offset(i);
                const isActive = o === 0;
                const depth = Math.min(o, totalWrap(images.length, o));
                return (
                    <img
                        key={i}
                        src={src}
                        alt={`${title} ${i + 1}`}
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                        className="absolute w-[85%] h-[85%] object-cover rounded-2xl border border-white/10 transition-all duration-700 ease-out"
                        style={{
                            transform: `translateX(${depth * 38}%) rotateY(${depth * -28}deg) scale(${isActive ? 1 : 0.8})`,
                            opacity: isActive ? 1 : Math.max(0.2, 0.85 - Math.abs(depth) * 0.2),
                            zIndex: 10 - Math.abs(depth),
                            filter: isActive ? 'none' : 'brightness(0.55) saturate(0.7)'
                        }}
                    />
                );
            })}
        </div>
    );
}

function CrossfadeStage({ images, index, title }: { images: string[]; index: number; title: string }) {
    return (
        <div className="absolute inset-0">
            {images.map((src, i) => (
                <img
                    key={i}
                    src={src}
                    alt={`${title} ${i + 1}`}
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1000ms] ease-out ${i === index ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-md'}`}
                />
            ))}
        </div>
    );
}

function StackStage({ images, index, offset, title }: { images: string[]; index: number; offset: (i: number) => number; title: string }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            {images.map((src, i) => {
                const o = offset(i);
                return (
                    <img
                        key={i}
                        src={src}
                        alt={`${title} ${i + 1}`}
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                        className="absolute w-[80%] h-[80%] object-cover rounded-2xl border border-white/10 transition-all duration-700 ease-out"
                        style={{
                            transform: `translateX(${o * 10}%) translateY(${o * 3}%) rotate(${o * 2}deg) scale(${1 - Math.abs(o) * 0.05})`,
                            opacity: Math.max(0.1, 1 - Math.abs(o) * 0.18),
                            zIndex: 10 - Math.abs(o)
                        }}
                    />
                );
            })}
        </div>
    );
}

function ParadeStage({ images, index, title }: { images: string[]; index: number; title: string }) {
    return (
        <div className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ transform: `translateX(-${index * 100}%)` }}>
            {images.map((src, i) => (
                <div key={i} className="w-full h-full shrink-0">
                    <img
                        src={src}
                        alt={`${title} ${i + 1}`}
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
        </div>
    );
}

function totalWrap(total: number, v: number): number {
    return v > total / 2 ? v - total : v;
}