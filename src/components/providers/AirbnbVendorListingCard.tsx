'use client';

import React, { useState } from 'react';
import { Star, ShieldCheck, Heart, ArrowRight, Sparkles } from 'lucide-react';
import type { ProviderItem } from '@/components/providers/BentoProviderCard';

interface AirbnbVendorListingCardProps {
  vendor: ProviderItem;
  onSelect?: () => void;
  onClaim?: (vendor: ProviderItem) => void;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop';

export const AirbnbVendorListingCard: React.FC<AirbnbVendorListingCardProps> = ({
  vendor,
  onSelect
}) => {
  const [imgError, setImgError] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const imageSrc = imgError || !vendor.img ? FALLBACK_IMAGE : vendor.img;
  const ratingValue = vendor.rating ? Number(vendor.rating).toFixed(1) : '5.0';
  const reviewsCount = vendor.reviews || 24;

  const categoryName = (vendor.category || 'Servicio').toUpperCase();
  const locationName = vendor.province || 'España';

  return (
    <article className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[#EBEBEB] hover:border-[#DDDDDD] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-300">
      
      {/* 📸 FOTO 4:3 CON ESQUINAS REDONDEADAS Y BADGE AIRBNB */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F7F7F7]">
        <img
          src={imageSrc}
          alt={vendor.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* BADGE SUPERHOST / VERIFICADO EAR */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 text-[#222222] text-[10px] font-bold shadow-sm backdrop-blur-sm border border-[#EBEBEB]">
          <ShieldCheck size={13} className="text-[#FF385C]" />
          <span>{vendor.badge || (vendor.isPreferred ? 'S-Class VIP' : 'Verificado EAR')}</span>
        </div>

        {/* CORAZÓN DE FAVORITO */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          aria-label="Guardar en favoritos"
          className="absolute top-3 right-3 p-2 rounded-full text-white/90 hover:text-white transition-transform active:scale-90"
        >
          <Heart
            size={22}
            className={`transition-colors drop-shadow-md ${
              isSaved ? 'text-[#FF385C] fill-[#FF385C]' : 'text-white fill-black/30'
            }`}
          />
        </button>

        {/* PILL DE PRECIO TRANSPARENTE EN MÓVIL */}
        {vendor.isPreferred && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm">
            <Sparkles size={11} className="text-[#FF385C]" />
            <span>Prioridad S-Class</span>
          </div>
        )}
      </div>

      {/* 📝 CUERPO DE LA TARJETA */}
      <div className="flex flex-col flex-1 p-4">
        
        {/* LÍNEA 1: CATEGORÍA + PROVINCIA + RATING */}
        <div className="flex items-center justify-between text-xs text-[#484848] mb-1">
          <span className="font-semibold tracking-wide truncate max-w-[65%]">
            {locationName} · {categoryName}
          </span>
          <div className="flex items-center gap-1 text-[#222222] font-bold shrink-0">
            <Star size={13} className="text-[#FF385C] fill-[#FF385C]" />
            <span>{ratingValue}</span>
            <span className="text-[#484848] font-normal">({reviewsCount})</span>
          </div>
        </div>

        {/* LÍNEA 2: NOMBRE DEL PROVEEDOR */}
        {vendor.customUrl ? (
          <a href={vendor.customUrl} className="block group/title">
            <h3 className="font-bold text-[#222222] text-base leading-snug line-clamp-1 mb-1 group-hover/title:text-[#FF385C] transition-colors">
              {vendor.name}
            </h3>
          </a>
        ) : (
          <h3 className="font-bold text-[#222222] text-base leading-snug line-clamp-1 mb-1 group-hover:text-[#FF385C] transition-colors">
            {vendor.name}
          </h3>
        )}

        {/* CAPACIDAD SI EXISTE */}
        {vendor.capacidadMaxPax && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#222222] font-mono mb-1.5">
            <span className="px-2 py-0.5 rounded-md bg-[#F7F7F7] border border-[#EBEBEB] font-semibold">
              Capacidad: {vendor.capacidadMaxPax} pax
            </span>
          </div>
        )}

        {/* LÍNEA 3: DESCRIPCIÓN CONCISA */}
        <p className="text-xs text-[#484848] line-clamp-2 leading-relaxed mb-3 flex-1 font-normal">
          {vendor.description || 'Proveedor homologado por Productora EAR con seguro de responsabilidad civil y estándar de calidad profesional.'}
        </p>

        {/* LÍNEA 4: PRECIO Y RESERVA AIRBNB */}
        <div className="pt-3 border-t border-[#F0F0F0] mt-auto flex items-center justify-between">
          <div>
            <span className="text-xs text-[#484848] block font-medium">
              {vendor.priceLabel || 'Precio cerrado'}
            </span>
            <span className="text-base font-extrabold text-[#222222]">
              {vendor.price || 'Consultar'}
            </span>
          </div>

          {vendor.customUrl ? (
            <a
              href={vendor.customUrl}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E61E4D] via-[#E31C5F] to-[#D70466] text-white text-xs font-bold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <span>Ver Showroom</span>
              <ArrowRight size={13} />
            </a>
          ) : (
            <button
              type="button"
              onClick={onSelect}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E61E4D] via-[#E31C5F] to-[#D70466] text-white text-xs font-bold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <span>Consultar</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

      </div>

    </article>
  );
};
