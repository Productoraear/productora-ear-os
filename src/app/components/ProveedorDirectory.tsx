'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  Star, 
  Filter, 
  Search, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  Lock, 
  Unlock, 
  Crown, 
  Music, 
  Speaker, 
  Camera, 
  Utensils, 
  Building2, 
  Award,
  Layers,
  Heart,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { PROVINCIAS } from '@/lib/constants/seo-data';
import { GEO_DATABASE } from '@/lib/seo/semantic-engine';
import Link from 'next/link';

export interface ProviderItem {
  id: string;
  name: string;
  category: 'AUDIO_LUCES' | 'MUSICA_VIVO' | 'FINCAS' | 'WEDDING_PLANNER' | 'FOTOGRAFIA_VIDEO' | 'CATERING';
  categoryLabel: string;
  location: string;
  basePrice: number;
  maxPax: number;
  rating: number;
  reviewsCount: number;
  slaScore: number;
  qualityPriceRatio: number; // 1 to 10
  tagline: string;
  specs: string[];
  riderHomologated: boolean;
  image: string;
  isVerified: boolean;
  claimToken: string;
}

const PROVIDERS_MASTER_DATA: ProviderItem[] = [
  {
    id: 'ear-bose-audio-pro',
    name: 'Productora EAR — Ingeniería Acústica & Bose F1',
    category: 'AUDIO_LUCES',
    categoryLabel: 'Sonido & Iluminación',
    location: 'madrid',
    basePrice: 650,
    maxPax: 500,
    rating: 5.0,
    reviewsCount: 142,
    slaScore: 99.9,
    qualityPriceRatio: 9.9,
    tagline: 'Sistemas Line Array Bose F1 Model 812 + Subwoofers. Cumplimiento estricto de normativas de ruido.',
    specs: ['2.000W RMS Reales', 'Microfonía Shure Axient', 'Mesa Digital Behringer XR18', 'Técnico FOH en directo'],
    riderHomologated: true,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800',
    isVerified: true,
    claimToken: 'ear-bose-master'
  },
  {
    id: 'mariachi-edwin-agudelo-imperial',
    name: 'Mariachi Imperial Edwin Agudelo (Gran Gala)',
    category: 'MUSICA_VIVO',
    categoryLabel: 'Música en Vivo & Artistas',
    location: 'madrid',
    basePrice: 1250,
    maxPax: 1000,
    rating: 5.0,
    reviewsCount: 238,
    slaScore: 100.0,
    qualityPriceRatio: 9.8,
    tagline: 'Master Artist Institucional con 6 a 8 músicos de conservatorio. Trajes charros de alta gala bordados a mano.',
    specs: ['2 Trompetas', '1 Violín Solista', 'Vihuela & Guitarrón', '+350 Obras Líricas y Rancheras'],
    riderHomologated: true,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800',
    isVerified: true,
    claimToken: 'edwin-agudelo-master'
  },
  {
    id: 'finca-la-gaivota-madrid',
    name: 'Finca La Gaivota (Aravaca Exclusive)',
    category: 'FINCAS',
    categoryLabel: 'Fincas & Espacios',
    location: 'madrid',
    basePrice: 3500,
    maxPax: 350,
    rating: 4.9,
    reviewsCount: 89,
    slaScore: 98.5,
    qualityPriceRatio: 9.2,
    tagline: 'Palacete singular con jardines centenarios y acústica natural optimizada para bodas boutique.',
    specs: ['Jardín Privado 4.000m²', 'Sin límite de hora en discoteca', 'Aparcamiento 120 plazas'],
    riderHomologated: true,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800',
    isVerified: true,
    claimToken: 'finca-gaivota-claim'
  },
  {
    id: 'lacoustics-syva-valencia',
    name: 'Syva Sound Valencia — L-Acoustics Certified',
    category: 'AUDIO_LUCES',
    categoryLabel: 'Sonido & Iluminación',
    location: 'valencia',
    basePrice: 850,
    maxPax: 600,
    rating: 4.9,
    reviewsCount: 67,
    slaScore: 99.4,
    qualityPriceRatio: 9.6,
    tagline: 'Colinear Source de alta gama para masías y fincas con alta reverberación en Levante.',
    specs: ['4.800W RMS', '140° Cobertura Horizontal', 'Latencia < 1.2ms', 'Ecualización de sala'],
    riderHomologated: true,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800',
    isVerified: true,
    claimToken: 'syva-valencia-claim'
  },
  {
    id: 'elite-wedding-planners-castilla',
    name: 'Castilla Eventos & Wedding Planners',
    category: 'WEDDING_PLANNER',
    categoryLabel: 'Wedding Planners',
    location: 'valladolid',
    basePrice: 1500,
    maxPax: 400,
    rating: 5.0,
    reviewsCount: 54,
    slaScore: 99.8,
    qualityPriceRatio: 9.7,
    tagline: 'Dirección protocolar y diseño integral de bodas en castillos y bodegas históricas de Castilla y León.',
    specs: ['Timing al segundo', 'Coordinación 4 coordinadores in situ', 'Convenio 10% Comisión EAR'],
    riderHomologated: true,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
    isVerified: true,
    claimToken: 'castilla-planners-claim'
  },
  {
    id: 'cinema-4k-memory-creators',
    name: 'VIMUME Cinema 4K & Realización Multicámara',
    category: 'FOTOGRAFIA_VIDEO',
    categoryLabel: 'Fotografía & Vídeo 4K',
    location: 'barcelona',
    basePrice: 950,
    maxPax: 800,
    rating: 5.0,
    reviewsCount: 112,
    slaScore: 99.7,
    qualityPriceRatio: 9.8,
    tagline: 'Registro cinematográfico Full Frame, audio 32-bit Float y entrega masterizada en 7 días.',
    specs: ['Cámaras Sony FX6 / FX3', 'Ópticas Cine G-Master', 'Dron 4K Autorizado AESA', 'Color grading DaVinci'],
    riderHomologated: true,
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800',
    isVerified: true,
    claimToken: 'vimume-cinema-claim'
  },
  {
    id: 'alta-cocina-autor-mediterranea',
    name: 'Gourmet Atelier — Catering de Vanguardia',
    category: 'CATERING',
    categoryLabel: 'Catering & Gastronomía',
    location: 'sevilla',
    basePrice: 2800,
    maxPax: 450,
    rating: 4.9,
    reviewsCount: 78,
    slaScore: 98.9,
    qualityPriceRatio: 9.3,
    tagline: 'Showcooking en directo, bodegas de autor y cortadores de jamón 100% ibérico de bellota.',
    specs: ['Menús adaptados 100%', 'Vajilla artesanal de diseño', 'Sumillería certificada'],
    riderHomologated: true,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800',
    isVerified: true,
    claimToken: 'gourmet-atelier-claim'
  },
  {
    id: 'cameo-chauvet-beam-lights',
    name: 'Illumination Pro — Robótica DMX & Láser 3W',
    category: 'AUDIO_LUCES',
    categoryLabel: 'Sonido & Iluminación',
    location: 'madrid',
    basePrice: 450,
    maxPax: 600,
    rating: 4.8,
    reviewsCount: 93,
    slaScore: 99.2,
    qualityPriceRatio: 9.5,
    tagline: 'Shows de iluminación sincronizada DMX, cabezas móviles Beam 7R y guirnaldas micro-led cálidas.',
    specs: ['8 Cabezas Robóticas Beam', 'Focos a batería sin cables', 'Efecto Geyser Humo Vertical'],
    riderHomologated: true,
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800',
    isVerified: true,
    claimToken: 'illumination-pro-claim'
  }
];

export const ProveedorDirectory: React.FC<{ initialCategory?: string }> = ({ initialCategory }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'ALL');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [maxBudget, setMaxBudget] = useState<number>(5000);
  const [minPax, setMinPax] = useState<number>(50);
  const [sortBy, setSortBy] = useState<'MATCH' | 'PRICE_ASC' | 'RATING' | 'QUALITY_PRICE'>('MATCH');

  const [isReserving, setIsReserving] = useState<string | null>(null);

  // Filtrado reactivo y ordenamiento por calidad-precio y afinidad
  const filteredProviders = useMemo(() => {
    return PROVIDERS_MASTER_DATA.filter((p) => {
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (selectedProvince !== 'ALL' && p.location !== selectedProvince) return false;
      if (p.basePrice > maxBudget) return false;
      if (p.maxPax < minPax) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchTagline = p.tagline.toLowerCase().includes(q);
        const matchSpecs = p.specs.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchTagline && !matchSpecs) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'MATCH') return (b.slaScore + b.qualityPriceRatio * 10) - (a.slaScore + a.qualityPriceRatio * 10);
      if (sortBy === 'QUALITY_PRICE') return b.qualityPriceRatio - a.qualityPriceRatio;
      if (sortBy === 'PRICE_ASC') return a.basePrice - b.basePrice;
      if (sortBy === 'RATING') return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, selectedProvince, maxBudget, minPax, searchQuery, sortBy]);

  const handleReserve = async (provider: ProviderItem) => {
    setIsReserving(provider.id);
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 0.50,
          concept: `Bloqueo Proveedor S-Class: ${provider.name}`,
          metadata: {
            provider_id: provider.id,
            provider_name: provider.name,
            category: provider.category,
            base_price: provider.basePrice,
            location: provider.location,
            deposit: 0.50
          }
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e: any) {
      alert('Error iniciando reserva: ' + e.message);
    } finally {
      setIsReserving(null);
    }
  };

  return (
    <div className="w-full space-y-12 text-white font-sans">
      
      {/* PANEL DE CONTROL MULTI-FILTRO */}
      <div className="bg-[#070709] border border-[#ecb613]/30 rounded-[3rem] p-6 md:p-10 shadow-[0_0_50px_rgba(236,182,19,0.1)] space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> MOTOR DE MATCHMAKING S-CLASS
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
              Directorio de <span className="text-[#ecb613] italic">Proveedores Homologados</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl font-light">
              Filtra por provincia, presupuesto y calidad-precio. Todos los proveedores cuentan con riders técnicos estandarizados y SLA 99.9%.
            </p>
          </div>

          {/* BUSCADOR EN TIEMPO REAL */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Buscar Bose, Mariachi, Finca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-3 rounded-2xl text-xs font-mono focus:outline-none focus:border-[#ecb613]"
            />
          </div>
        </div>

        {/* SELECTORES DE CATEGORÍA */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'ALL', label: 'Todos los Servicios', icon: Layers },
            { id: 'AUDIO_LUCES', label: 'Sonido & Luces', icon: Speaker },
            { id: 'MUSICA_VIVO', label: 'Música & Mariachi', icon: Music },
            { id: 'FINCAS', label: 'Fincas & Recintos', icon: Building2 },
            { id: 'WEDDING_PLANNER', label: 'Wedding Planners', icon: Crown },
            { id: 'FOTOGRAFIA_VIDEO', label: 'Vídeo 4K & Cine', icon: Camera },
            { id: 'CATERING', label: 'Catering & Gastro', icon: Utensils }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                selectedCategory === cat.id 
                  ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-black' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* DESLIZADORES DE PRESUPUESTO & PROVINCIA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-black/40 border border-white/5 p-6 rounded-3xl">
          
          {/* Selector de Provincia */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#ecb613]" /> Provincia
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-2xl text-xs font-mono focus:outline-none focus:border-[#ecb613]"
            >
              <option value="ALL" className="bg-black text-white">Toda España (52 Provincias)</option>
              {PROVINCIAS.slice(0, 30).map(p => (
                <option key={p} value={p} className="bg-black text-white">{p.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Deslizador Presupuesto */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase text-slate-400">
              <span>Presupuesto Máximo</span>
              <span className="text-[#ecb613] font-bold text-xs">{maxBudget} €</span>
            </div>
            <input 
              type="range" min="300" max="8000" step="100" value={maxBudget}
              onChange={(e) => setMaxBudget(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
            />
          </div>

          {/* Criterio de Ordenación */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#ecb613]" /> Ordenar Por
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSortBy('MATCH')}
                className={`py-2 px-3 rounded-xl text-[10px] font-mono font-bold uppercase transition-all ${
                  sortBy === 'MATCH' ? 'bg-[#ecb613] text-black font-black' : 'bg-white/5 text-slate-300'
                }`}
              >
                ★ Máx. Afinidad
              </button>
              <button
                onClick={() => setSortBy('QUALITY_PRICE')}
                className={`py-2 px-3 rounded-xl text-[10px] font-mono font-bold uppercase transition-all ${
                  sortBy === 'QUALITY_PRICE' ? 'bg-[#ecb613] text-black font-black' : 'bg-white/5 text-slate-300'
                }`}
              >
                💎 Calidad / Precio
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* RESULTADOS: MATRIZ DE PROVEEDORES MATCH */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-slate-400">
            Mostrando <strong>{filteredProviders.length}</strong> proveedores altamente cualificados
          </span>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> 100% Riders Homologados EAR OS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0a0a0d] border border-white/10 hover:border-[#ecb613]/50 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              {/* IMAGEN DE CABECERA CON BADGES */}
              <div className="h-48 w-full relative overflow-hidden bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-transparent to-black/60" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold uppercase text-[#ecb613] px-2.5 py-1 rounded-full">
                    {p.categoryLabel}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    ★ {p.qualityPriceRatio * 10}% Afinidad
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 flex items-center gap-1 text-[11px] font-mono text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-[#ecb613]" /> {p.location.toUpperCase()} • Hasta {p.maxPax} pax
                </div>
              </div>

              {/* CONTENIDO DE LA FICHA */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-black uppercase text-white group-hover:text-[#ecb613] transition-colors leading-tight">
                      {p.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-2">
                    {p.tagline}
                  </p>

                  {/* SPECS TÉCNICAS */}
                  <div className="pt-3 space-y-1.5">
                    {p.specs.slice(0, 3).map((sp, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
                        <CheckCircle2 className="w-3 h-3 text-[#ecb613] shrink-0" />
                        <span className="truncate">{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOOTER & BOTÓN RESERVA */}
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[9px] uppercase font-mono text-slate-500 block">Tarifa desde</span>
                      <span className="text-2xl font-black text-white font-mono">{p.basePrice} €</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Depósito: 0.50 €
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/proveedores/${p.id}`}
                      className="py-3 px-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-[10px] font-bold uppercase text-center transition-all flex items-center justify-center gap-1"
                    >
                      Ver Ficha <ExternalLink size={11} />
                    </Link>

                    <button
                      onClick={() => handleReserve(p)}
                      disabled={isReserving === p.id}
                      className="py-3 px-3 rounded-2xl bg-[#ecb613] hover:bg-[#d4a210] text-black font-mono text-[10px] font-black uppercase tracking-wider text-center transition-all shadow-lg shadow-[#ecb613]/10 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Lock size={11} /> {isReserving === p.id ? 'Conectando...' : 'Bloquear Fecha'}
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProveedorDirectory;
