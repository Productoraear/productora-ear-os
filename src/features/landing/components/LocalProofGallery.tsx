'use client';

// src/features/landing/components/LocalProofGallery.tsx
//
// SHOWCASE DINÁMICO DE FOTOS HD LOCALES
// Extrae de forma reactiva 3-6 fotos auténticas de /assets/shadow_vendors/
// asociadas a la provincia del usuario, eliminando placeholders y hotlinks.

import { useState } from 'react';

const ACCENT = '#ecb613';

interface LocalProofGalleryProps {
  provinceName: string;
  photos: string[];
}

export default function LocalProofGallery({ provinceName, photos }: LocalProofGalleryProps) {
  const [failed, setFailed] = useState<Set<number>>(new Set());

  const visible = photos.filter((_, i) => !failed.has(i));

  const markFailed = (index: number) => {
    setFailed(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  return (
    <section className="w-full overflow-x-hidden border border-white/10 rounded-2xl bg-[#050507] p-6 md:p-8">
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
          Local Proof Gallery
        </p>
        <h3 className="font-display text-xl md:text-2xl font-bold text-white mt-1" style={{ fontFamily: 'Syne, sans-serif' }}>
          Montajes reales en {provinceName}
        </h3>
        <p className="text-sm text-white/50 mt-1">Fotos HD servidas desde disco local. Cero hotlinks, cero placeholders.</p>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl bg-[#030305] border border-white/10 p-8 text-center font-mono text-sm text-white/40">
          Galería local en sincronización. Solicita el dossier con fotos verificadas de esta provincia.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {visible.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10 bg-[#030305]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Montaje real de ${provinceName}`}
                loading="lazy"
                onError={() => markFailed(i)}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}