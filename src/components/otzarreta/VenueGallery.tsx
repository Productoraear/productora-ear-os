'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';

/**
 * GALERÍA COMPLETA + VÍDEO — muestra TODAS las fotos disponibles, sin recortes.
 *  · Una foto cuya URL ya no responde se oculta sola (no deja huecos rotos).
 *  · Visor a pantalla completa: flechas, teclado (← → Esc) y contador.
 *  · El vídeo NO carga hasta que el visitante pulsa: ningún tercero recibe datos
 *    de navegación antes de tiempo (RGPD) y la página pesa menos.
 */

interface VenueGalleryProps {
    readonly photos: readonly string[];
    readonly altBase: string;
    readonly vimeoId: string | null;
    readonly videoTitle: string;
}

export function VenueGallery({ photos, altBase, vimeoId, videoTitle }: VenueGalleryProps): React.JSX.Element {
    const [broken, setBroken] = useState<ReadonlySet<string>>(new Set());
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [videoOn, setVideoOn] = useState<boolean>(false);
    const closeRef = useRef<HTMLButtonElement | null>(null);

    const visible = photos.filter((photo) => !broken.has(photo));

    const markBroken = useCallback((photo: string): void => {
        setBroken((previous) => new Set(previous).add(photo));
    }, []);

    const move = useCallback(
        (delta: number): void => {
            setLightboxIndex((current) => {
                if (current === null || visible.length === 0) return current;
                return (current + delta + visible.length) % visible.length;
            });
        },
        [visible.length],
    );

    useEffect(() => {
        if (lightboxIndex === null) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        const onKey = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') setLightboxIndex(null);
            else if (event.key === 'ArrowRight') move(1);
            else if (event.key === 'ArrowLeft') move(-1);
        };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKey);
        };
    }, [lightboxIndex, move]);

    const activePhoto = lightboxIndex !== null ? visible[lightboxIndex] : undefined;

    return (
        <div className="space-y-4">
            {vimeoId !== null && (
                <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-black">
                    {videoOn ? (
                        <iframe
                            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`}
                            title={videoTitle}
                            className="absolute inset-0 h-full w-full"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => setVideoOn(true)}
                            aria-label={`Reproducir: ${videoTitle}`}
                            className="group absolute inset-0 flex items-center justify-center bg-[#030305]"
                        >
                            {visible[0] !== undefined && (
                                <img
                                    src={visible[0]}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-300 ease-out group-hover:opacity-70"
                                    onError={() => markBroken(visible[0])}
                                />
                            )}
                            <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#ecb613] text-[#030305] transition-all duration-300 ease-out group-hover:scale-105">
                                <Play className="ml-1 h-8 w-8 fill-current" aria-hidden="true" />
                            </span>
                            <span className="absolute bottom-4 left-4 right-4 text-left text-xs text-zinc-300">
                                Vídeo oficial del caserío · se carga al pulsar
                            </span>
                        </button>
                    )}
                </div>
            )}

            <ul className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>li]:mb-3">
                {visible.map((photo, index) => (
                    <li key={photo} className="break-inside-avoid">
                        <button
                            type="button"
                            onClick={() => setLightboxIndex(index)}
                            aria-label={`Ampliar fotografía ${index + 1} de ${visible.length}`}
                            className="block w-full overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 ease-out hover:border-[#ecb613]/50"
                        >
                            <img
                                src={photo}
                                alt={`${altBase} · fotografía ${index + 1}`}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-auto transition-all duration-300 ease-out hover:scale-[1.03]"
                                onError={() => markBroken(photo)}
                            />
                        </button>
                    </li>
                ))}
            </ul>

            <p className="font-mono text-[11px] text-zinc-400">
                {visible.length} fotografías reales publicadas por el propio caserío
            </p>

            {activePhoto !== undefined && lightboxIndex !== null && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${altBase}: visor de fotografías`}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030305]/95 p-4"
                    onClick={() => setLightboxIndex(null)}
                >
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={() => setLightboxIndex(null)}
                        aria-label="Cerrar visor"
                        className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 ease-out hover:border-[#ecb613]/60"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            move(-1);
                        }}
                        aria-label="Fotografía anterior"
                        className="absolute left-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 ease-out hover:border-[#ecb613]/60"
                    >
                        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <img
                        src={activePhoto}
                        alt={`${altBase} · fotografía ${lightboxIndex + 1}`}
                        className="max-h-[85vh] max-w-full rounded-2xl object-contain"
                        onClick={(event) => event.stopPropagation()}
                    />
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            move(1);
                        }}
                        aria-label="Fotografía siguiente"
                        className="absolute right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 ease-out hover:border-[#ecb613]/60"
                    >
                        <ChevronRight className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <p className="absolute bottom-4 font-mono text-xs text-zinc-300">
                        {lightboxIndex + 1} / {visible.length}
                    </p>
                </div>
            )}
        </div>
    );
}

