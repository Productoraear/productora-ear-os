'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  Camera,
  Layers
} from 'lucide-react';

interface SovereignCarouselProps {
  images: string[];
  title?: string;
  className?: string;
  aspectRatio?: 'video' | 'wide' | 'auto';
  autoPlayInterval?: number; // en ms, 0 para desactivar
}

export default function SovereignCarouselSClass({
  images = [],
  title = 'Galería S-Class',
  className = '',
  aspectRatio = 'video',
  autoPlayInterval = 6000
}: SovereignCarouselProps) {
  // Limpiar y filtrar imágenes duplicadas o vacías
  const cleanImages = React.useMemo(() => {
    const defaultPlaceholder = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop";
    const filtered = (images || [])
      .filter(img => typeof img === 'string' && img.trim().length > 5 && !img.includes('.svg'))
      .map(img => {
        // Corregir URLs relativas de Celebrents o Bodas
        if (img.startsWith('//')) return `https:${img}`;
        if (img.startsWith('/uploads/')) return `https://www.celebrents.es${img}`;
        return img;
      });

    return filtered.length > 0 ? Array.from(new Set(filtered)) : [defaultPlaceholder];
  }, [images]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightbox, setIsLightbox] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  const total = cleanImages.length;

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  // Teclas de dirección y Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape' && isLightbox) setIsLightbox(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isLightbox]);

  // Autoplay
  useEffect(() => {
    if (autoPlayInterval <= 0 || total <= 1 || isLightbox) return;
    const timer = setInterval(handleNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlayInterval, handleNext, isLightbox, total]);

  // Centrar miniatura activa en el scroll
  useEffect(() => {
    if (!thumbnailStripRef.current) return;
    const activeThumb = thumbnailStripRef.current.children[currentIndex] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex]);

  // Gestos táctiles (Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNext();
    if (distance < -50) handlePrev();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const ratioClass = aspectRatio === 'video' ? 'aspect-video' : aspectRatio === 'wide' ? 'aspect-[21/9]' : 'h-72 sm:h-96';

  return (
    <>
      <div className={`relative w-full rounded-2xl overflow-hidden bg-[#030305] border border-white/10 shadow-2xl flex flex-col group ${className}`}>
        {/* BARRAS DE PROGRESO CINEMATOGRÁFICAS (ESTILO INSTAGRAM/TESLA) */}
        {total > 1 && (
          <div className="absolute top-2 left-3 right-3 z-20 flex gap-1 pointer-events-none">
            {cleanImages.map((_, idx) => (
              <div
                key={idx}
                className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden backdrop-blur-sm"
              >
                <div
                  className={`h-full bg-amber-400 transition-all duration-300 ${
                    idx === currentIndex ? 'w-full shadow-[0_0_8px_#ecb613]' : idx < currentIndex ? 'w-full opacity-60' : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        {/* VISOR PRINCIPAL */}
        <div
          className={`relative w-full ${ratioClass} bg-[#050508] overflow-hidden cursor-pointer flex items-center justify-center`}
          onClick={() => setIsLightbox(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={cleanImages[currentIndex]}
            alt={`${title} - Foto ${currentIndex + 1}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop";
            }}
            className="w-full h-full object-cover transition-all duration-700 ease-out select-none group-hover:scale-[1.02]"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* CONTADOR DISCRETO & FULLSCREEN */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono font-bold text-amber-400 shadow-md">
              {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightbox(true);
            }}
            className="absolute bottom-3 right-3 z-10 p-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-white/80 hover:text-amber-400 hover:border-amber-500/40 transition shadow-md"
            title="Ver pantalla completa"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* FLECHAS DE NAVEGACIÓN */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 hover:border-amber-500/40 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 shadow-lg"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-5 h-5 text-amber-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 hover:border-amber-500/40 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 shadow-lg"
                aria-label="Siguiente foto"
              >
                <ChevronRight className="w-5 h-5 text-amber-400" />
              </button>
            </>
          )}
        </div>

        {/* TIRA INFERIOR DE MINIATURAS HD (Si hay más de 1 imagen) */}
        {total > 1 && (
          <div
            ref={thumbnailStripRef}
            className="flex gap-2 p-2.5 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent bg-[#050508] border-t border-white/5"
          >
            {cleanImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border transition-all duration-200 ${
                  idx === currentIndex
                    ? 'border-amber-400 ring-2 ring-amber-500/30 scale-105 opacity-100'
                    : 'border-white/10 opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={img}
                  alt={`Miniatura ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MODAL LIGHTBOX PANTALLA COMPLETA */}
      {isLightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 select-none animate-fade-in"
          onClick={() => setIsLightbox(false)}
        >
          {/* Barra Superior Lightbox */}
          <div className="flex justify-between items-center z-20 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="font-bold uppercase tracking-wider">{title}</span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-300">
                {currentIndex + 1} de {total}
              </span>
            </div>

            <button
              onClick={() => setIsLightbox(false)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              title="Cerrar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Imagen Central en Pantalla Completa */}
          <div
            className="flex-1 flex items-center justify-center relative p-2"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={cleanImages[currentIndex]}
              alt={`${title} - Ampliada`}
              className="max-h-[82vh] max-w-[95vw] object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.9)]"
            />

            {total > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 border border-zinc-700 hover:border-amber-400 text-amber-400 transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 border border-zinc-700 hover:border-amber-400 text-amber-400 transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Tira inferior en Lightbox */}
          {total > 1 && (
            <div
              className="flex justify-center gap-2 overflow-x-auto py-3 border-t border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {cleanImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-14 h-10 rounded-lg overflow-hidden shrink-0 border transition ${
                    idx === currentIndex
                      ? 'border-amber-400 ring-2 ring-amber-500/50 scale-105'
                      : 'border-zinc-800 opacity-40 hover:opacity-80'
                  }`}
                >
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
