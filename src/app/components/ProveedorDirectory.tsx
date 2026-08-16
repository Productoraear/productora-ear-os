'use client';

import React, { useState, useEffect, useTransition } from 'react';
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
  Crown, 
  Music, 
  Speaker, 
  Camera, 
  Utensils, 
  Building2, 
  Layers,
  Heart,
  Loader2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { PROVINCIAS } from '@/lib/constants/seo-data';
import Link from 'next/link';

export interface ProviderItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  phone?: string;
  pricing: {
    minPricePerPax?: number;
    rentalBasePrice: number;
    currency: string;
  };
  metrics: {
    rating: number;
    reviewCount: number;
    verificationLevel: string;
  };
  location: {
    address: string;
    city: string;
    province: string;
    googleMapsUrl?: string;
  };
  media: {
    coverImage: string;
    gallery: string[];
  };
  technicalSpecs: {
    maxPax: number;
    acousticPowerRequiredWatts: number;
  };
  description: string;
  claimToken: string;
}

const CATEGORIES = [
  { id: 'ALL', label: 'Todos los Servicios', icon: Layers },
  { id: 'FINCAS_Y_ESPACIOS', label: 'Fincas & Palacetes', icon: Building2 },
  { id: 'AUDIO_LUCES', label: 'Sonido & Luces', icon: Speaker },
  { id: 'MUSICA_VIVO', label: 'Música & Mariachi', icon: Music },
  { id: 'WEDDING_PLANNER', label: 'Wedding Planners', icon: Crown },
  { id: 'FOTOGRAFIA_VIDEO', label: 'Vídeo 4K & Cine', icon: Camera },
  { id: 'CATERING', label: 'Catering & Gastro', icon: Utensils },
  { id: 'DECORACION', label: 'Decoración & Flores', icon: Heart }
];

export const ProveedorDirectory: React.FC<{ initialCategory?: string }> = ({ initialCategory }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'ALL');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [maxBudget, setMaxBudget] = useState<number>(8000);
  const [sortBy, setSortBy] = useState<'MATCH' | 'PRICE_ASC' | 'PRICE_DESC' | 'RATING'>('MATCH');

  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(8352);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  const [reservingId, setReservingId] = useState<string | null>(null);

  const fetchProviders = async (pageToFetch = 1, append = false) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        category: selectedCategory,
        province: selectedProvince,
        maxBudget: String(maxBudget),
        sortBy,
        page: String(pageToFetch),
        limit: '24'
      });

      const res = await fetch(`/api/profiles/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (append) {
          setProviders(prev => [...prev, ...(data.providers || [])]);
        } else {
          setProviders(data.providers || []);
        }
        setTotalCount(data.total || 8352);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.warn('Error fetching providers:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProviders(1, false);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedProvince, maxBudget, sortBy]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      fetchProviders(page + 1, true);
    }
  };

  const handleReserve = async (p: ProviderItem) => {
    setReservingId(p.id);
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 0.50,
          concept: `Bloqueo Fecha & Rider: ${p.name}`,
          metadata: {
            provider_id: p.id,
            provider_name: p.name,
            category: p.category,
            base_price: p.pricing?.rentalBasePrice || 450,
            location: p.location?.province || 'Madrid',
            deposit: 0.50
          }
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e: any) {
      alert('Error conectando a pasarela de reserva: ' + e.message);
    } finally {
      setReservingId(null);
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
              Explora en tiempo real la red de <strong>{totalCount.toLocaleString()}</strong> profesionales verificados en las 52 provincias con SLA garantizado y cero fuga de tráfico.
            </p>
          </div>

          {/* BUSCADOR EN TIEMPO REAL */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Buscar por nombre, finca, servicio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white pl-11 pr-4 py-3 rounded-2xl text-xs font-mono focus:outline-none focus:border-[#ecb613]"
            />
          </div>
        </div>

        {/* SELECTORES DE CATEGORÍA */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
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
              <MapPin className="w-3.5 h-3.5 text-[#ecb613]" /> Provincia ({PROVINCIAS.length} Provincias)
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-2xl text-xs font-mono focus:outline-none focus:border-[#ecb613]"
            >
              <option value="ALL" className="bg-black text-white">Toda España (Nacional)</option>
              {PROVINCIAS.map(p => (
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
              type="range" min="300" max="10000" step="100" value={maxBudget}
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
                onClick={() => setSortBy('PRICE_ASC')}
                className={`py-2 px-3 rounded-xl text-[10px] font-mono font-bold uppercase transition-all ${
                  sortBy === 'PRICE_ASC' ? 'bg-[#ecb613] text-black font-black' : 'bg-white/5 text-slate-300'
                }`}
              >
                💎 Precio Asc.
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* RESULTADOS: MATRIZ DE PROVEEDORES */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-slate-400">
            Mostrando <strong>{providers.length}</strong> de <strong>{totalCount.toLocaleString()}</strong> proveedores homologados
          </span>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> 100% Riders Homologados EAR OS
          </span>
        </div>

        {isLoading && providers.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#ecb613] animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              Consultando Grafo Soberano de Proveedores...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0a0d] border border-white/10 hover:border-[#ecb613]/50 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                {/* IMAGEN DE CABECERA */}
                <div className="h-48 w-full relative overflow-hidden bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={p.media?.coverImage || (p.media?.gallery && p.media.gallery[0]) || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800"} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-transparent to-black/60" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold uppercase text-[#ecb613] px-2.5 py-1 rounded-full">
                      {p.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      ★ {p.metrics?.rating || 4.9} ({p.metrics?.reviewCount || 18})
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 flex items-center gap-1 text-[11px] font-mono text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-[#ecb613]" /> {(p.location?.province || p.location?.city || 'España').toUpperCase()} • Hasta {p.technicalSpecs?.maxPax || 350} pax
                  </div>
                </div>

                {/* CONTENIDO DE LA TARJETA */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-black uppercase text-white group-hover:text-[#ecb613] transition-colors leading-tight">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-2">
                      {p.description || 'Proveedor homologado bajo los estándares de producción de Productora EAR.'}
                    </p>

                    <div className="pt-2 text-[11px] font-mono text-slate-400 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ecb613]" />
                      <span className="truncate">{p.location?.address || 'Ubicación verificada'}</span>
                    </div>
                  </div>

                  {/* FOOTER & BOTONES */}
                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[9px] uppercase font-mono text-slate-500 block">Tarifa desde</span>
                        <span className="text-2xl font-black text-white font-mono">
                          {p.pricing?.rentalBasePrice || 450} €
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Garantía: 0.50 €
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/proveedores/${p.slug || p.id}`}
                        className="py-3 px-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-[10px] font-bold uppercase text-center transition-all flex items-center justify-center gap-1"
                      >
                        Ver Ficha <ExternalLink size={11} />
                      </Link>

                      <button
                        onClick={() => handleReserve(p)}
                        disabled={reservingId === p.id}
                        className="py-3 px-3 rounded-2xl bg-[#ecb613] hover:bg-[#d4a210] text-black font-mono text-[10px] font-black uppercase tracking-wider text-center transition-all shadow-lg shadow-[#ecb613]/10 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Lock size={11} /> {reservingId === p.id ? 'Conectando...' : 'Bloquear Fecha'}
                      </button>
                    </div>
                  </div>

                </div>

              </motion.div>
            ))}
          </div>
        )}

        {/* PAGINACIÓN Y CARGAR MÁS */}
        {page < totalPages && (
          <div className="pt-8 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-mono text-xs font-bold uppercase tracking-widest transition-all cursor-pointer inline-flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#ecb613]" /> Cargando proveedores...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 text-[#ecb613]" /> Cargar más proveedores (+24 de {totalCount.toLocaleString()})
                </>
              )}
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default ProveedorDirectory;
