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
  slug?: string;
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

const CURATED_FALLBACK_POOLS: Record<string, string[]> = {
  finca: [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop"
  ],
  catering: [
    "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop"
  ],
  decoracion: [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop"
  ],
  musica: [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop"
  ],
  sonido: [
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop"
  ],
  foto: [
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop"
  ],
  wedding: [
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop"
  ],
  moda: [
    "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop"
  ],
  transporte: [
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop"
  ],
  servicios: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop"
  ]
};

function getDiverseFallback(category?: string, seed?: string | number): string {
  const cat = (category || 'servicios').toLowerCase();
  const pool = CURATED_FALLBACK_POOLS[cat] || CURATED_FALLBACK_POOLS.servicios;
  if (!seed) return pool[0];
  const str = String(seed);
  const hash = str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

function isValidImage(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.includes('.svg') ||
    lower.includes('gen_logoheader') ||
    lower.includes('default_avatar') ||
    lower.includes('741e9617168a2484.jpg')
  ) {
    return false;
  }
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:image/')
  );
}

export const BentoProviderCard: React.FC<BentoProviderCardProps> = ({
  provider,
  onSelect,
  onClaim
}) => {
  const fallbackImg = getDiverseFallback(provider.category, provider.id || provider.name);
  const rawCover = provider.img || (provider.gallery && provider.gallery[0]);
  const initialImg = isValidImage(rawCover) ? rawCover!.trim() : fallbackImg;
  const [currentImg, setCurrentImg] = React.useState<string>(initialImg);

  React.useEffect(() => {
    const raw = provider.img || (provider.gallery && provider.gallery[0]);
    setCurrentImg(isValidImage(raw) ? raw!.trim() : fallbackImg);
  }, [provider.img, provider.gallery, fallbackImg]);

  const formattedPrice = provider.basePrice || (typeof provider.price === 'number' ? provider.price : 450);
  const provinceDisplay = provider.province && provider.province !== 'None' ? provider.province.toUpperCase() : 'ESPAÑA';
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
        <img
          src={currentImg}
          alt={provider.name}
          loading="lazy"
          onError={() => {
            if (provider.gallery && provider.gallery.length > 1) {
              const currentIdx = provider.gallery.findIndex(g => g === currentImg);
              const nextImg = provider.gallery.find((g, i) => i > currentIdx && isValidImage(g) && g !== currentImg);
              if (nextImg) {
                setCurrentImg(nextImg);
                return;
              }
            }
            if (currentImg !== fallbackImg) {
              setCurrentImg(fallbackImg);
            }
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

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
