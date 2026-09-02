'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X, Play, Image as ImageIcon } from 'lucide-react';

interface MediaGalleryProps {
  providerName: string;
  featuredImage: string;
  galleryImages?: string[];
  videoUrls?: string[];
}

export function ProviderMediaGallery({
  providerName,
  featuredImage,
  galleryImages = [],
  videoUrls = [],
}: MediaGalleryProps) {
  // Deduplicar y normalizar lista de imágenes
  const allImages = Array.from(new Set([featuredImage, ...galleryImages].filter(Boolean)));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');

  const hasMultipleImages = allImages.length > 1;
  const hasVideos = videoUrls.length > 0;
  const currentImage = allImages[selectedIndex] || featuredImage;

  const nextImage = () => setSelectedIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setSelectedIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="w-full space-y-4">
      {/* Selector de Pestañas Fotos / Vídeos si existen vídeos */}
      {hasVideos && (
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              activeTab === 'photos'
                ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <ImageIcon size={14} /> Fotos ({allImages.length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              activeTab === 'videos'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <Play size={14} /> Vídeos ({videoUrls.length})
          </button>
        </div>
      )}

      {/* VISTA DE FOTOS */}
      {activeTab === 'photos' && (
        <div className="space-y-3">
          {/* Visor Principal */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-zinc-950 border border-white/10 group shadow-2xl">
            {currentImage ? (
              <Image
                key={selectedIndex + 1}
                alt={`${providerName} - Imagen ${selectedIndex + 1}`}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 800px"
                src={currentImage}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-600">
                Sin imágenes disponibles
              </div>
            )}

            {/* Controles del Slider */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white backdrop-blur-md transition-all hover:bg-black/90 hover:scale-110"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2.5 text-white backdrop-blur-md transition-all hover:bg-black/90 hover:scale-110"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1 text-[11px] font-mono text-white backdrop-blur-md">
                  {selectedIndex + 1} / {allImages.length}
                </div>
              </>
            )}

            {/* Botón Pantalla Completa / Lightbox */}
            {currentImage && (
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute right-4 top-4 rounded-xl bg-black/60 p-2 text-white/80 backdrop-blur-md hover:text-white hover:bg-black/90 transition-all"
                title="Ver en pantalla completa"
              >
                <Maximize2 size={18} />
              </button>
            )}
          </div>

          {/* Carrusel Inferior de Miniaturas (Solo si hay más de 1 foto real) */}
          {hasMultipleImages && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border transition-all ${
                    idx === selectedIndex
                      ? 'border-[#ecb613] scale-105 shadow-md shadow-[#ecb613]/20 ring-2 ring-[#ecb613]/30'
                      : 'border-white/10 opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Miniatura ${idx + 1}`} className="object-cover" fill sizes="120px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VISTA DE VÍDEOS */}
      {activeTab === 'videos' && hasVideos && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videoUrls.map((video, idx) => (
            <div key={idx} className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
              <iframe
                src={video}
                title={`${providerName} - Video ${idx + 1}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      )}

      {/* MODAL LIGHTBOX PANTALLA COMPLETA */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-all"
          >
            <X size={24} />
          </button>

          <div className="relative h-[80vh] w-[90vw] max-w-6xl">
            <Image src={currentImage} alt={`${providerName} - Pantalla completa`} className="object-contain" fill sizes="90vw" />
          </div>

          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white hover:bg-white/20 transition-all"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white hover:bg-white/20 transition-all"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}