'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Star } from 'lucide-react';

/**
 * CARRUSEL DE OPINIONES — automático, pausable y 100% controlable.
 *  · Avanza solo cada 6,5 s; se detiene al pasar el ratón, al enfocar con teclado
 *    y cuando el usuario pulsa Pausa.
 *  · Respeta `prefers-reduced-motion`: arranca en pausa y sin scroll suave.
 *  · Desliza con el dedo (scroll-snap nativo), flechas, puntos y teclado (← →).
 *  · Muestra TODAS las opiniones recibidas, incluidas las bajas: no se filtra nada.
 */

export interface CarouselReview {
    readonly author: string;
    readonly date: string;
    readonly rating: number;
    readonly title: string;
    readonly comment: string;
}

interface VenueReviewCarouselProps {
    readonly reviews: readonly CarouselReview[];
}

const AUTOPLAY_MS = 6500;
const CARD_GAP_PX = 16;

function formatRating(rating: number): string {
    return rating.toFixed(1).replace('.', ',');
}

export function VenueReviewCarousel({ reviews }: VenueReviewCarouselProps): React.JSX.Element {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(true);
    const [interacting, setInteracting] = useState<boolean>(false);
    const [reducedMotion, setReducedMotion] = useState<boolean>(false);

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(query.matches);
        if (query.matches) setPlaying(false);
    }, []);

    const stepWidth = useCallback((): number => {
        const track = trackRef.current;
        const first = track?.firstElementChild as HTMLElement | null | undefined;
        return first ? first.offsetWidth + CARD_GAP_PX : 0;
    }, []);

    const goTo = useCallback(
        (index: number): void => {
            const track = trackRef.current;
            const step = stepWidth();
            if (!track || step === 0) return;
            const bounded = (index + reviews.length) % reviews.length;
            track.scrollTo({ left: bounded * step, behavior: reducedMotion ? 'auto' : 'smooth' });
            setActiveIndex(bounded);
        },
        [reducedMotion, reviews.length, stepWidth],
    );

    useEffect(() => {
        if (!playing || interacting || reviews.length < 2) return undefined;
        const timer = window.setInterval(() => {
            const track = trackRef.current;
            const step = stepWidth();
            if (!track || step === 0) return;
            const current = Math.round(track.scrollLeft / step);
            goTo(current + 1);
        }, AUTOPLAY_MS);
        return () => window.clearInterval(timer);
    }, [goTo, interacting, playing, reviews.length, stepWidth]);

    const handleScroll = (): void => {
        const track = trackRef.current;
        const step = stepWidth();
        if (!track || step === 0) return;
        setActiveIndex(Math.min(reviews.length - 1, Math.round(track.scrollLeft / step)));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            goTo(activeIndex + 1);
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goTo(activeIndex - 1);
        }
    };

    return (
        <div
            role="region"
            aria-roledescription="carrusel"
            aria-label="Opiniones de parejas"
            className="space-y-4"
            onMouseEnter={() => setInteracting(true)}
            onMouseLeave={() => setInteracting(false)}
            onFocusCapture={() => setInteracting(true)}
            onBlurCapture={() => setInteracting(false)}
        >
            <div
                ref={trackRef}
                tabIndex={0}
                onScroll={handleScroll}
                onKeyDown={handleKeyDown}
                aria-live={playing && !interacting ? 'off' : 'polite'}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60 rounded-3xl"
            >
                {reviews.map((review, index) => (
                    <article
                        key={`${review.author}-${review.date}-${index}`}
                        className="snap-start shrink-0 w-[88%] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] rounded-3xl border border-white/10 bg-[#09090d]/80 backdrop-blur-md p-6 flex flex-col gap-3"
                        aria-label={`Opinión ${index + 1} de ${reviews.length}`}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <span
                                className="inline-flex items-center gap-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 px-2.5 py-1 font-mono text-xs text-[#ecb613]"
                                role="img"
                                aria-label={`Valoración ${formatRating(review.rating)} de 5`}
                            >
                                <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                                {formatRating(review.rating)}
                            </span>
                            <time className="font-mono text-[11px] text-zinc-400">{review.date}</time>
                        </div>
                        <h4 className="text-base font-bold text-white leading-snug">{review.title}</h4>
                        <p className="text-sm text-zinc-300 leading-relaxed">«{review.comment}»</p>
                        <p className="mt-auto pt-2 text-xs font-semibold text-zinc-400">{review.author}</p>
                    </article>
                ))}
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => goTo(activeIndex - 1)}
                        aria-label="Opinión anterior"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-300 ease-out hover:border-[#ecb613]/60 hover:text-[#ecb613]"
                    >
                        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setPlaying((value) => !value)}
                        aria-label={playing ? 'Pausar carrusel' : 'Reproducir carrusel'}
                        aria-pressed={playing}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-300 ease-out hover:border-[#ecb613]/60 hover:text-[#ecb613]"
                    >
                        {playing ? (
                            <Pause className="w-4 h-4" aria-hidden="true" />
                        ) : (
                            <Play className="w-4 h-4" aria-hidden="true" />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => goTo(activeIndex + 1)}
                        aria-label="Opinión siguiente"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-300 ease-out hover:border-[#ecb613]/60 hover:text-[#ecb613]"
                    >
                        <ChevronRight className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>

                <p className="font-mono text-xs text-zinc-400" aria-hidden="true">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}
                </p>
            </div>

            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Elegir opinión">
                {reviews.map((review, index) => (
                    <button
                        key={`dot-${review.author}-${index}`}
                        type="button"
                        role="tab"
                        aria-selected={index === activeIndex}
                        aria-label={`Ir a la opinión ${index + 1}`}
                        onClick={() => goTo(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                            index === activeIndex ? 'w-8 bg-[#ecb613]' : 'w-3 bg-white/20 hover:bg-white/40'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

