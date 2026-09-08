'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  PhoneCall, 
  Video, 
  Camera, 
  ArrowUpRight,
  Lock,
  Sparkles
} from 'lucide-react';

export interface ProviderItem {
  id: string | number;
  name: string;
  category?: string;
  province?: string;
  description?: string;
  description_full?: string;
  price?: string | number;
  basePrice?: number;
  rating?: number;
  reviews?: number;
  img?: string;
  gallery?: string[];
  videos?: string[];
  isPreferred?: boolean;
  badge?: string;
  sla?: string;
  customUrl?: string;
  telephone?: string;
}

interface BentoProviderCardProps {
  provider: ProviderItem;
  onSelect: (provider: ProviderItem) => void;
  onClaim: (provider: ProviderItem) => void;
}

export const BentoProviderCard: React.FC<BentoProviderCardProps> = ({
  provider,
  onSelect,
  onClaim
}) => {
  const coverImg = provider.img || (provider.gallery && provider.gallery[0]);
  const formattedPrice = provider.basePrice || (typeof provider.price === 'number' ? provider.price : 650);
  const provinceDisplay = provider.province ? provider.province.toUpperCase() : 'MADRID';
  const categoryDisplay = provider.category ? provider.category.toUpperCase() : 'EVENTOS';

  const reservationUrl = provider.customUrl 
    ? provider.customUrl 
    : `/checkout/presupuesto?format=Solista&base=350&venue=${encodeURIComponent(provider.name)}`;

  const whatsappMessage = encodeURIComponent(
    `Hola, solicito disponibilidad y tarifa para ${provider.name} (${provinceDisplay}) a través de Productora EAR.`
  );

  return (
    <article 
      onClick={() => onSelect(provider)}
      className="group relative bg-[#050505] border border-[#1a1a1a] hover:border-[#258DCD] rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5"
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. MEDIA HEADER CON ASPECT-RATIO CONTROLADO (ZERO CLS)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0a0a0f]">
        {coverImg ? (
          <img
            src={coverImg}
            alt={provider.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a10] to-[#050505] text-neutral-600">
            <Camera className="w-8 h-8 mb-1" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Sin Imagen</span>
          </div>
        )}

        {/* Gradiente de sombra sutil inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Badge de Categoría / Homologación Superior Izquierda */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${
            provider.isPreferred 
              ? 'bg-[#258DCD]/20 text-[#AAD6CD] border-[#258DCD]/50' 
              : 'bg-black/80 text-neutral-300 border-white/10'
          }`}>
            {provider.badge || categoryDisplay}
          </span>
        </div>

        {/* Rating Superior Derecha */}
        <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md border border-white/10 text-white px-2 py-0.5 rounded-md text-[10px] font-mono flex items-center gap-1">
          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          <span className="font-bold">{provider.rating || '4.9'}</span>
          <span className="text-neutral-500 text-[9px]">({provider.reviews || 18})</span>
        </div>

        {/* Ubicación Inferior Izquierda */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[10px] font-mono text-neutral-300 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/5">
          <MapPin className="w-2.5 h-2.5 text-[#258DCD]" />
          <span>{provinceDisplay}</span>
        </div>

        {/* Indicador de Vídeo si dispone */}
        {provider.videos && provider.videos.length > 0 && (
          <div className="absolute bottom-2.5 right-2.5 bg-[#258DCD] text-black px-1.5 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-1">
            <Video className="w-2.5 h-2.5" />
            <span>4K</span>
          </div>
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. BODY: TIPOGRAFÍA S-CLASS & TELEMETRÍA DE ALTA DENSIDAD
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-[#258DCD] transition-colors leading-snug line-clamp-1 font-syne flex items-center gap-1.5">
            <span>{provider.name}</span>
            {provider.isPreferred && (
              <Sparkles className="w-3 h-3 text-[#258DCD] shrink-0" />
            )}
          </h3>

          <p className="text-[11px] text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed font-light font-sans">
            {provider.description || `${provider.name} homologado bajo el SLA de acústica y producción técnica Productora EAR.`}
          </p>
        </div>

        {/* Métricas Técnicas Compactas */}
        <div className="pt-2.5 border-t border-[#1a1a1a] grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div>
            <span className="text-neutral-500 uppercase block text-[9px]">Tarifa Estimada</span>
            <span className="font-bold text-white">Desde {formattedPrice} €</span>
          </div>
          <div>
            <span className="text-neutral-500 uppercase block text-[9px]">Garantía EAR</span>
            <span className="font-bold text-[#AAD6CD] truncate block">
              {provider.sla || 'RC 1M€ • 12W/pax'}
            </span>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. FOOTER ACTIONS: CONVERSIÓN RÁPIDA & RECLAMACIÓN SOBERANA
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="p-3 bg-[#08080a] border-t border-[#1a1a1a] flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(provider);
          }}
          className="flex-1 py-2 px-3 rounded-lg bg-[#111115] hover:bg-[#1a1a24] text-white border border-[#22222a] hover:border-[#258DCD]/40 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>Ver Ficha</span>
          <ArrowUpRight className="w-3 h-3 text-[#258DCD]" />
        </button>

        <Link
          href={reservationUrl}
          onClick={(e) => e.stopPropagation()}
          className="py-2 px-3 rounded-lg bg-[#258DCD] hover:bg-[#1f74a8] text-black text-[11px] font-mono font-black uppercase tracking-wider flex items-center gap-1 transition-colors"
          title="Bloquear Reserva Inmediata con 100 €"
        >
          <Lock className="w-2.5 h-2.5" />
          <span>100 €</span>
        </Link>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClaim(provider);
          }}
          className="p-2 rounded-lg bg-[#111115] hover:bg-[#258DCD]/10 text-neutral-400 hover:text-[#258DCD] border border-[#22222a] transition-colors"
          title="Reclamar Ficha de Proveedor (2FA)"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
        </button>

        <a
          href={`https://wa.me/34693693048?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="p-2 rounded-lg bg-[#111115] hover:bg-emerald-500/10 text-neutral-400 hover:text-emerald-400 border border-[#22222a] transition-colors"
          title="Consulta Inmediata vía WhatsApp"
        >
          <PhoneCall className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
};
