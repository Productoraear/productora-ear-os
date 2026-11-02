'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Quote, Star } from 'lucide-react';
import type { EzkertzaDerioReview } from '@/lib/constants/ezkertza-derio-venue';

/**
 * CARRUSEL VANGUARDISTA DE OPINIONES (CEO 2026-10-31):
 * avance automático + control total del usuario (flechas, puntos, pausa,
 * teclado, swipe táctil). Cada reseña muestra su valoración real publicada
 * en la ficha ingerida — sin inventar ni suavizar ninguna cifra (JUR-1).
 */

interface VenueReviewsCarouselProps {
    readonly reviews: readonly EzkertzaDerioReview[];
    readonly autoPlayMs?: number;
}

function formatRating(rating: number): string {
    return rating.toFixed(1).replace('.', ',');
}

export default function VenueReviewsCarousel({
    reviews,
    autoPlayMs = 5200,
}: VenueReviewsCarouselProps): React.JSX.Element | null {
    const total = reviews.length;
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [touchX, setTouchX] = useState<number | null>(null);

    const next = useCallback(() => setIndex((p) => (p + 1) % total), [total]);
    const prev = useCallback(() => setIndex((p) => (p - 1 + total) % total), [total]);

    // Autoplay: se detiene con pausa, hover o interacción táctil.
    useEffect(() => {
        if (paused || total <= 1) return;
        const id = setInterval(next, autoPlayMs);
        return () => clearInterval(id);
    }, [next, paused, autoPlayMs, total]);

    // Teclado: ← → navegan, Espacio pausa.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === ' ') {
                e.preventDefault();
                setPaused((p) => !p);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [next, prev]);

    if (total === 0) return null;
    const review = reviews[index];

    return (
        <div
            className="relative rounded-3xl border border-white/10 bg-[#09090d]/80 backdrop-blur-md overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => setTouchX(e.touches[0]?.clientX ?? null)}
            onTouchEnd={(e) => {
                if (touchX === null) return;
                const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX;
                if (dx > 48) prev();
                if (dx < -48) next();
                setTouchX(null);
            }}
            aria-roledescription="carrusel"
            aria-label="Opiniones de parejas reales"
        >
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#ecb613]/10 rounded-full blur-[110px] pointer-events-none" />

            <div className="relative p-8 sm:p-12 min-h-[320px] flex flex-col justify-between gap-6">
                <Quote className="w-8 h-8 text-[#ecb613]/40" />

                {/* Contenido de la reseña activa */}
                <div key={index} className="space-y-5">
                    <div className="flex items-center gap-1">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${
                                    i < Math.round(review.rating) ? 'text-[#ecb613] fill-[#ecb613]' : 'text-zinc-700'
                                }`}
                            />
                        ))}
                        <span className="ml-2 text-sm font-bold text-white">
                            {formatRating(review.rating)}
                        </span>
                        <span className="text-xs font-mono text-gray-500">/ 5</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white">“{review.title}”</h3>
                    <p className="text-sm text-gray-300 leading-relaxed max-w-4xl">
                        {review.comment}
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                        <span className="w-9 h-9 rounded-full bg-[#ecb613]/15 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613] text-xs font-extrabold">
                            {review.author.trim().charAt(0).toUpperCase()}
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-white">{review.author}</p>
                            <p className="text-[11px] font-mono text-gray-500">{review.date}</p>
                        </div>
                    </div>
                </div>

                {/* Controles: flechas + pausa + puntos */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={prev}
                            aria-label="Reseña anterior"
                            className="w-10 h-10 rounded-xl border border-white/15 text-white hover:border-[#ecb613]/60 hover:bg-white/5 transition-all duration-300 ease-out flex items-center justify-center active:scale-95"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            aria-label="Reseña siguiente"
                            className="w-10 h-10 rounded-xl border border-white/15 text-white hover:border-[#ecb613]/60 hover:bg-white/5 transition-all duration-300 ease-out flex items-center justify-center active:scale-95"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaused((p) => !p)}
                            aria-label={paused ? 'Reanudar avance automático' : 'Pausar avance automático'}
                            aria-pressed={paused}
                            className="w-10 h-10 rounded-xl border border-white/15 text-gray-300 hover:text-[#ecb613] hover:border-[#ecb613]/60 transition-all duration-300 ease-out flex items-center justify-center active:scale-95"
                        >
                            {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="flex items-center gap-2" role="tablist" aria-label="Seleccionar reseña">
                        {reviews.map((r, i) => (
                            <button
                                key={`${r.author}-${i}`}
                                type="button"
                                role="tab"
                                aria-selected={i === index}
                                aria-label={`Reseña ${i + 1} de ${total}: ${r.author}`}
                                onClick={() => setIndex(i)}
                                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                                    i === index
                                        ? 'w-7 bg-[#ecb613]'
                                        : 'w-2 bg-white/20 hover:bg-white/40'
                                }`}
                            />
                        ))}
                    </div>

                    <span className="hidden sm:block text-[11px] font-mono text-gray-500">
                        {index + 1} / {total}
                    </span>
                </div>
            </div>
        </div>
    );
}

