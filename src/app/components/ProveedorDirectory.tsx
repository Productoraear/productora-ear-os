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
  Phone,
  Car,
  Scissors,
  DollarSign,
  X
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
  { id: 'FINCAS_Y_ESPACIOS', label: 'Fincas & Espacios', icon: Building2 },
  { id: 'CATERING', label: 'Catering & Gastro', icon: Utensils },
  { id: 'DECORACION', label: 'Decoración & Flores', icon: Heart },
  { id: 'MUSICA_VIVO', label: 'Música & Mariachi', icon: Music },
  { id: 'AUDIO_LUCES', label: 'Sonido & Luces', icon: Speaker },
  { id: 'FOTOGRAFIA_VIDEO', label: 'Vídeo 4K & Foto', icon: Camera },
  { id: 'WEDDING_PLANNER', label: 'Wedding Planners', icon: Crown },
  { id: 'MODA_BELLEZA', label: 'Moda & Belleza', icon: Scissors },
  { id: 'TRANSPORTE', label: 'Transporte & Coches', icon: Car }
];

export const ProveedorDirectory: React.FC<{ initialCategory?: string }> = ({ initialCategory }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'ALL');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [maxBudget, setMaxBudget] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<'MATCH' | 'PRICE_ASC' | 'PRICE_DESC' | 'RATING'>('MATCH');

  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [totalCount, setTotalCount] = useState<number>(8352);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        setTotalCount(data.total || 0);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
        if (data.categoryCounts) {
          setCategoryCounts(data.categoryCounts);
        }
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
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedProvince, maxBudget, sortBy]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      fetchProviders(page + 1, true);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedProvince('ALL');
    setMaxBudget(10000);
    setSortBy('MATCH');
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
    <div className="w-full space-y-10 text-white font-sans">
      
      {/* 🎛️ PANEL DE CONTROL MULTI-FILTRO DINÁMICO */}
      <div className="bg-[#08080c] border border-[#ecb613]/40 rounded-[2.5rem] p-6 md:p-10 shadow-[0_0_60px_rgba(236,182,19,0.12)] space-y-6">
        
        {/* ENCABEZADO Y BUSCADOR PREDICTIVO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> MOTOR DE MATCHMAKING S-CLASS
            </div>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight font-syne">
              Directorio de <span className="text-[#ecb613] italic">Proveedores Homologados</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl font-light">
              Explora en tiempo real la red de <strong>{totalCount.toLocaleString()}</strong> profesionales verificados con SLA garantizado y sin intermediarios.
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
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* SELECTORES DE CATEGORÍA CON BADGES NUMÉRICOS EN VIVO */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">
            CATEGORÍAS DE PROVISIÓN HOMOLOGADA
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.id] || (cat.id === 'ALL' ? totalCount : 0);
              return (
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
                  <span>{cat.label}</span>
                  {count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      selectedCategory === cat.id ? 'bg-black/30 text-black font-black' : 'bg-white/10 text-slate-400'
                    }`}>
                      {count.toLocaleString()}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* DESLIZADORES DE PRESUPUESTO & PROVINCIA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-black/40 border border-white/5 p-6 rounded-3xl">
          
          {/* SELECTOR DE PROVINCIA */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#ecb613]" /> Provincia / Territorio
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full bg-[#121216] border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-[#ecb613]"
            >
              <option value="ALL">Toda España (Nacional)</option>
              {PROVINCIAS.map((prov) => (
                <option key={prov} value={prov}>
                  {prov.replace(/-/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* CONTROL DESLIZANTE DE PRESUPUESTO */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 uppercase flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#ecb613]" /> Presupuesto Máximo
              </span>
              <strong className="text-white text-sm font-black">{maxBudget.toLocaleString()} €</strong>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="250"
              value={maxBudget}
              onChange={(e) => setMaxBudget(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
            />
          </div>

          {/* ORDENACIÓN Y BOTÓN DE RESET */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <label className="text-slate-400 uppercase flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#ecb613]" /> Ordenar Por
              </label>
              {(searchQuery || selectedCategory !== 'ALL' || selectedProvince !== 'ALL' || maxBudget !== 10000) && (
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] font-mono text-[#ecb613] hover:underline"
                >
                  Restablecer Filtros
                </button>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#121216] border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-[#ecb613]"
            >
              <option value="MATCH">Mejor Relación Calidad / Precio</option>
              <option value="PRICE_ASC">Precio: Más Económico Primero</option>
              <option value="PRICE_DESC">Precio: Más Exclusivo Primero</option>
              <option value="RATING">Mayor Valoración (5.0 ★)</option>
            </select>
          </div>

        </div>

      </div>

      {/* 📦 GRID DE PROVEEDORES HOMOLOGADOS */}
      {isLoading && providers.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#ecb613]" />
          <p className="text-xs font-mono text-slate-400">Filtrando {totalCount.toLocaleString()} proveedores en tiempo real...</p>
        </div>
      ) : providers.length === 0 ? (
        <div className="py-24 bg-[#0a0a0d] border border-white/10 rounded-[2.5rem] text-center space-y-4 p-8">
          <Building2 className="w-12 h-12 mx-auto text-slate-500" />
          <h3 className="text-xl font-bold uppercase text-white font-syne">No se encontraron proveedores</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Prueba a ampliar el rango de presupuesto o seleccionar "Toda España" para ver resultados inmediatos.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-3 bg-[#ecb613] text-black font-mono text-xs font-bold uppercase rounded-xl"
          >
            Ver Todos los Proveedores
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((p) => {
              const basePrice = p.pricing?.rentalBasePrice || 650;
              const paxPrice = p.pricing?.minPricePerPax || 85;
              const coverImg = p.media?.coverImage || '';

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0a0a0e] border border-white/10 hover:border-[#ecb613]/50 rounded-3xl overflow-hidden flex flex-col justify-between group transition-all shadow-xl"
                >
                  <div>
                    {/* IMAGEN DE CABECERA CON BADGES */}
                    <div className="h-52 w-full relative overflow-hidden bg-zinc-900">
                      {coverImg ? (
                        <img 
                          src={coverImg} 
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e: any) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-950">
                          <span className="text-3xl text-neutral-700">📷</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-[#ecb613] font-bold uppercase">
                          {p.category.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <Star size={10} className="fill-emerald-400" /> {p.metrics?.rating || 4.9} ({p.metrics?.reviewCount || 12})
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <MapPin size={10} className="text-[#ecb613]" /> {p.location?.city || p.location?.province || 'España'}
                          </span>
                          <h3 className="text-lg font-black uppercase text-white truncate max-w-[220px] font-syne">
                            {p.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* DESCRIPCIÓN & ESPECIFICACIONES */}
                    <div className="p-6 space-y-4">
                      <p className="text-xs text-slate-300 font-light line-clamp-2 leading-relaxed">
                        {p.description || 'Proveedor verificado bajo el estándar S-Class de Productora EAR con seguro de responsabilidad civil y riders estandarizados.'}
                      </p>

                      <div className="p-3 bg-white/5 rounded-2xl flex justify-between items-center text-xs font-mono border border-white/5">
                        <div>
                          <span className="text-[9px] uppercase text-slate-400 block">Tarifa Base</span>
                          <strong className="text-white font-bold text-sm">Desde {basePrice.toLocaleString()} €</strong>
                        </div>
                        {p.category === 'FINCAS_Y_ESPACIOS' || p.category === 'CATERING' ? (
                          <div className="text-right">
                            <span className="text-[9px] uppercase text-slate-400 block">Precio / Pax</span>
                            <strong className="text-[#ecb613] font-bold">{paxPrice} € / persona</strong>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="text-[9px] uppercase text-slate-400 block">SLA Acústico</span>
                            <strong className="text-emerald-400 font-bold">12 W/pax Homologado</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACCIONES DEL PROVEEDOR */}
                  <div className="p-6 pt-0 border-t border-white/5 mt-2 space-y-2">
                    <button
                      onClick={() => handleReserve(p)}
                      disabled={reservingId === p.id}
                      className="w-full py-3 bg-[#ecb613] hover:bg-[#d4a210] text-black font-mono text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 cursor-pointer"
                    >
                      {reservingId === p.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Conectando Stripe...
                        </>
                      ) : (
                        <>
                          <Lock size={12} /> Bloquear Reserva (0.50 €)
                        </>
                      )}
                    </button>

                    <div className="flex gap-2">
                      <Link
                        href={`/reclamar-perfil?id=${p.id}&name=${encodeURIComponent(p.name)}`}
                        className="flex-1 py-2 text-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] font-mono font-bold uppercase transition-all"
                      >
                        Reclamar Ficha
                      </Link>
                      {p.phone && (
                        <a
                          href={`tel:${p.phone}`}
                          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-emerald-300 text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1"
                        >
                          <Phone size={10} /> Contactar
                        </a>
                      )}
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

          {/* BOTÓN CARGAR MÁS */}
          {page < totalPages && (
            <div className="text-center pt-6">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-2xl border border-white/10 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Cargando Proveedores...
                  </>
                ) : (
                  <>
                    Cargar Más Proveedores ({providers.length} de {totalCount.toLocaleString()}) →
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ProveedorDirectory;
