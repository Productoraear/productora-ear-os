'use client';

import React, { useState } from 'react';
import { MapPin, Star, ShieldCheck, ArrowRight, Sparkles, BadgeCheck } from 'lucide-react';
import type { ProviderItem } from '@/components/providers/BentoProviderCard';

interface SClassVendorBodasCardProps {
  vendor: ProviderItem;
  onSelect?: () => void;
  onClaim?: (vendor: ProviderItem) => void;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop';

/** Cinco estrellas doradas con soporte de media estrella según el rating real. */
function StarRating({ rating }: { rating: number }): React.ReactElement {
  const safeRating = Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : 0;
  return (
    <span
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Valoración ${safeRating.toFixed(1)} de 5 estrellas`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(Math.max(safeRating - index, 0), 1);
        const pct = Math.round(fill * 100);
        return (
          <span key={index} className="relative inline-flex h-[14px] w-[14px]">
            <Star size={14} className="absolute inset-0 text-white/15" fill="currentColor" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
              <Star size={14} className="text-[#ecb613]" fill="currentColor" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function SClassVendorBodasCard({
  vendor,
  onSelect,
  onClaim,
}: SClassVendorBodasCardProps): React.ReactElement {
  const [imgError, setImgError] = useState<boolean>(false);

  const imageSrc = imgError || !vendor.img ? FALLBACK_IMAGE : vendor.img;
  const badgeLabel =
    vendor.badge || (vendor.isPreferred ? 'HOMOLOGADO S-CLASS' : 'DIRECTORIO HOMOLOGADO');

  const location = vendor.province || 'España';

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#09090d]/80 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#ecb613]/40 hover:shadow-[0_24px_60px_-20px_rgba(236,182,19,0.18)]">
      {/* Imagen cinematográfica con zoom suave en hover */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0a0a0f]">
        <img
          src={imageSrc}
          alt={vendor.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Velo cinematográfico */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/25 to-transparent" />

        {/* Badge Wedding Awards / Homologación EAR */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-[#ecb613]/30 bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#ecb613] backdrop-blur-md">
          <BadgeCheck size={12} />
          {badgeLabel}
        </div>

        {/* Sello premium */}
        {vendor.isPreferred && (
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#ecb613]/40 bg-black/60 text-[#ecb613] backdrop-blur-md">
            <Sparkles size={14} />
          </div>
        )}

        {/* Rating dorado sobre la imagen */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-2.5 py-1.5 backdrop-blur-md">
          <StarRating rating={vendor.rating ?? 0} />
          <span className="font-mono text-[11px] font-bold text-white">
            {(vendor.rating ?? 5).toFixed(1)}
          </span>
          <span className="font-mono text-[10px] text-neutral-200 font-medium">({vendor.reviews ?? 0})</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-syne text-lg font-bold leading-snug text-white">{vendor.name}</h3>

        {/* Ubicación con pin geográfico */}
        <div className="flex items-center justify-between text-xs text-neutral-300 font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="shrink-0 text-[#258DCD]" />
            <span className="truncate font-mono">{location}</span>
          </div>
          {vendor.capacidadMaxPax && (
            <span className="font-mono text-[10px] text-[#ecb613] bg-[#ecb613]/10 px-2 py-0.5 rounded-full border border-[#ecb613]/20 font-semibold">
              {vendor.capacidadMaxPax} pax
            </span>
          )}
        </div>

        {/* Descripción */}
        <p className="line-clamp-2 text-sm font-normal leading-relaxed text-neutral-200">
          {vendor.description}
        </p>

        {/* Precio SSOT + Split 80/10/10 */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-300 font-semibold">Desde</p>
            <p className="truncate font-syne text-xl font-black text-[#ecb613]">
              {vendor.price ?? 'Consultar'}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-[#ecb613]/20 bg-[#ecb613]/5 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#ecb613]">
            Split 80/10/10
          </span>
        </div>

        {/* CTA Solicitar Presupuesto o Ver Ficha VIP */}
        {vendor.customUrl ? (
          <a
            href={vendor.customUrl}
            aria-label={`Ver Ficha VIP y Menús de ${vendor.name}`}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ecb613] px-4 py-3 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 ease-out hover:bg-[#ecb613]/85 hover:shadow-lg hover:shadow-[#ecb613]/20 active:scale-[0.98]"
          >
            <span>Ver Ficha VIP & Menús</span>
            <ArrowRight size={15} />
          </a>
        ) : (
          <button
            type="button"
            onClick={onSelect}
            aria-label={`Solicitar presupuesto de ${vendor.name}`}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#258DCD] px-4 py-3 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 ease-out hover:bg-[#258DCD]/85 hover:shadow-lg hover:shadow-[#258DCD]/20 active:scale-[0.98]"
          >
            <span>Solicitar Presupuesto</span>
            <ArrowRight size={15} />
          </button>
        )}

        {/* Reclamar perfil (opcional) */}
        {onClaim && (
          <button
            type="button"
            onClick={() => onClaim(vendor)}
            className="mx-auto -mt-1 flex items-center gap-1.5 text-[11px] font-medium text-neutral-300 transition-colors hover:text-white"
          >
            <ShieldCheck size={12} />
            ¿Eres el propietario? Reclama tu perfil
          </button>
        )}
      </div>
    </article>
  );
}
