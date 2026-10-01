'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Music,
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Radio,
  Heart,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Phone,
  Lock,
  SlidersHorizontal,
  Mic,
  Flame,
  Disc,
  Volume2,
  Award,
  Layers
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import CinematicVanguardCarousel from '@/components/sclass/CinematicVanguardCarousel';
import { NeuralArtistTinderMatch, type CanonicalArtist } from '@/components/artists/NeuralArtistTinderMatch';
import type { CoupleCalibration } from '@/lib/matching/calibratorTypes';
import { ARTIST_CALIBRATION_DIMENSIONS } from '@/lib/matching/artistCalibratorTypes';

interface RealArtist {
  id: string;
  name: string;
  slug?: string;
  category: string;
  province: string;
  municipality?: string;
  address?: string;
  phone?: string;
  telephone?: string;
  has_real_phone?: boolean;
  img?: string;
  imageUrls?: string[];
  gallery?: string[];
  basePrice?: number;
  price?: string | number;
  rating?: number;
  reviews?: number;
  description?: string;
  description_full?: string;
  services_list?: string[];
  formats?: string[];
  genres?: string[];
  gremioTag?: string;
}

const PROVINCIAS_ESPANA = [
  'Todas', 'Madrid', 'Toledo', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga', 'Alicante',
  'Cádiz', 'Baleares', 'Girona', 'Granada', 'Córdoba', 'Las Palmas', 'Santa Cruz de Tenerife',
  'Asturias', 'Badajoz', 'A Coruña', 'Murcia', 'Valladolid', 'Zaragoza', 'Cantabria',
  'Castellón', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Huelva', 'Jaén', 'León', 'Lleida',
  'Lugo', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'La Rioja', 'Salamanca', 'Segovia',
  'Soria', 'Tarragona', 'Teruel', 'Álava', 'Albacete', 'Almería', 'Ávila', 'Burgos',
  'Cáceres', 'Gipuzkoa', 'Huesca', 'Bizkaia', 'Zamora'
];

const ARTIST_CATEGORIES = [
  { id: 'all', label: 'Todos los Artistas', icon: Music, badge: '6.710' },
  { id: 'solista', label: 'Solistas & Vocalistas', icon: Mic, badge: '350€ Base' },
  { id: 'mariachi', label: 'Mariachis & Mexicano', icon: Sparkles, badge: 'En Directo' },
  { id: 'dj', label: 'DJs & Disco Móvil', icon: Disc, badge: 'Sonido + Luz' },
  { id: 'banda', label: 'Bandas & Pop/Rock', icon: Users, badge: 'Versiones' },
  { id: 'cuerdas', label: 'Lírico, Cuerda & Violín', icon: Heart, badge: 'Gala Bodas' },
  { id: 'flamenco', label: 'Flamenco & Rumba', icon: Flame, badge: 'Cuadro Vivo' }
];

const BUDGET_PRESETS = [
  { label: '350 € Solista', value: 350 },
  { label: '600 € Mariachi 6p', value: 600 },
  { label: '900 € 9 Músicos', value: 900 },
  { label: '1.300 € Gran Ensamble', value: 1300 },
  { label: '2.500 € Gala B2B', value: 2500 },
  { label: 'Todo Presupuesto', value: 5000 }
];

const ACOUSTIC_LEVELS = [
  { id: 'all', label: 'Todos los Riders', dba: '65 - 102 dBA' },
  { id: 'coctel', label: 'Cóctel & Residencias', dba: '70 - 80 dBA' },
  { id: 'bodas', label: 'Bodas & Fincas', dba: '85 - 90 dBA' },
  { id: 'plazas', label: 'Plazas & Festivales', dba: '90 - 102 dBA' }
];

const ITEMS_PER_PAGE = 24;

function buildDefaultCoupleCalibration(): CoupleCalibration {
  const dims: CoupleCalibration['dimensions'] = {};
  for (const d of ARTIST_CALIBRATION_DIMENSIONS) {
    if (d.side === 'couple') {
      dims[d.id] = d.defaultValue;
    }
  }
  return {
    dimensions: dims,
    completionPercent: 40
  };
}

export default function ArtistasNationalCatalogClient() {
  const [artists, setArtists] = useState<RealArtist[]>([]);
  const [total, setTotal] = useState(6710);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState('Todas');
  const [selectedSubcat, setSelectedSubcat] = useState('all');
  const [maxBudget, setMaxBudget] = useState(5000);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [acousticLevel, setAcousticLevel] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArtistModal, setSelectedArtistModal] = useState<RealArtist | null>(null);

  // Modo Tinder Swipe Neural
  const [isSwipeMode, setIsSwipeMode] = useState(false);
  const [canonicalArtists, setCanonicalArtists] = useState<CanonicalArtist[]>([]);
  const [canonicalLoading, setCanonicalLoading] = useState(false);

  const coupleCalibration = useMemo(() => buildDefaultCoupleCalibration(), []);

  // Carga dataset canónico si se activa el modo swipe
  useEffect(() => {
    if (isSwipeMode && canonicalArtists.length === 0 && !canonicalLoading) {
      setCanonicalLoading(true);
      fetch('/data/artists/artists_canonical.json')
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          setCanonicalArtists(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error('Error cargando canonical artists:', err))
        .finally(() => setCanonicalLoading(false));
    }
  }, [isSwipeMode, canonicalArtists.length, canonicalLoading]);

  // Debounce buscador
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Petición al backend con todos los filtros dinámicos
  const fetchArtists = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('category', 'musica');
      params.set('page', String(currentPage));
      params.set('limit', String(ITEMS_PER_PAGE));
      if (selectedProvince && selectedProvince !== 'Todas') {
        params.set('province', selectedProvince);
      }
      if (selectedSubcat && selectedSubcat !== 'all') {
        params.set('subcategory', selectedSubcat);
      }
      if (debouncedSearch.trim()) {
        params.set('q', debouncedSearch.trim());
      }
      if (maxBudget < 5000) {
        params.set('maxPrice', String(maxBudget));
      }

      const res = await fetch(`/api/profiles/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const providers: RealArtist[] = Array.isArray(data.providers) ? data.providers : [];
        
        // Excluir a Edwin Agudelo de la cuadrícula estándar para que no aparezca duplicado
        // (ya que tiene su Escaparate de Élite S-Class exclusivo en la parte superior)
        const filteredProviders = providers.filter(
          (p) => !p.name.toLowerCase().includes('edwin agudelo')
        );

        setArtists(filteredProviders);
        if (typeof data.total === 'number' && data.total > 0) {
          setTotal(data.total);
        } else {
          setTotal(filteredProviders.length);
        }
      }
    } catch (err) {
      console.error('Error cargando catálogo de artistas:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedProvince, selectedSubcat, debouncedSearch, maxBudget]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const gridElem = document.getElementById('catalogo-artistas-grid');
      if (gridElem) {
        gridElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleResetFilters = () => {
    setSelectedProvince('Todas');
    setSelectedSubcat('all');
    setMaxBudget(5000);
    setSearchQuery('');
    setAcousticLevel('all');
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-[#030305] text-slate-100 font-sans">
      {/* ══════════════════════════════════════════════════════════════════════════
          1. COCKPIT SUPERIOR: EL SELECTOR NEURAL MÁS AVANZADO DEL MUNDO A VISTA DE PÁJARO
         ══════════════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-[#07070d] via-[#050508] to-[#030305] border-b border-slate-800/80 pt-20 pb-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Luces volumétricas de fondo */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#ecb613]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 left-10 w-96 h-96 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          {/* HEADER PRINCIPAL CON TELEMETRÍA S-CLASS */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800/60 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SELECTOR NEURAL S-CLASS · CASAMIENTO ARTÍSTICO 200 DIMENSIONES</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase italic tracking-tight font-syne">
                Directorio Nacional de <span className="text-[#ecb613]">Artistas & Shows</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-light">
                Infraestructura acústica de alta fidelidad: Rider homologado Bose F1 12W/pax, Split Soberano 80/10/10 y reserva directa con Price-Lock 100€ en Stripe.
              </p>
            </div>

            {/* TELEMETRÍA EN VIVO */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-[#0a0a10] border border-slate-800 p-3 rounded-2xl shadow-xl shrink-0 font-mono text-xs">
              <div className="px-3 border-r border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Auditados</span>
                <span className="text-base font-black text-white">{total.toLocaleString()}</span>
              </div>
              <div className="px-3 border-r border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Territorio</span>
                <span className="text-sm font-bold text-[#ecb613]">52 Provincias</span>
              </div>
              <div className="px-3 border-r border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Split Soberano</span>
                <span className="text-sm font-bold text-emerald-400">80/10/10</span>
              </div>
              <div className="px-2">
                <button
                  onClick={() => setIsSwipeMode(!isSwipeMode)}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] transition-all flex items-center gap-1.5 ${
                    isSwipeMode
                      ? 'bg-[#ecb613] text-black shadow-[0_0_15px_rgba(236,182,19,0.4)]'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isSwipeMode ? 'Ver Cuadrícula' : 'Modo Match Rápido'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 🎛️ PANEL DE CONTROL NEURAL: VISTA DE PÁJARO */}
          <div className="bg-[#08080e]/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
            {/* 1. SELECTOR DE FORMATOS / GREMIOS MUSICALES (CHIPS INTERACTIVOS) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <Music className="w-3.5 h-3.5 text-[#ecb613]" />
                  <span>Formación Escénica & Especialidad Musical</span>
                </span>
                <span className="text-[#ecb613] font-bold">
                  {ARTIST_CATEGORIES.find((c) => c.id === selectedSubcat)?.label || 'Todos'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ARTIST_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedSubcat === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedSubcat(cat.id);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase transition-all duration-200 ${
                        isActive
                          ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.35)] scale-[1.02]'
                          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{cat.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-black/20 text-black' : 'bg-slate-800 text-slate-400'}`}>
                        {cat.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. SLIDER DINÁMICO DE PRESUPUESTO + SELECTORES DE TERRITORIO Y BÚSQUEDA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4 border-t border-slate-800/80">
              {/* SLIDER DE PRESUPUESTO */}
              <div className="lg:col-span-5 space-y-2.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/70">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400 uppercase font-bold flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#ecb613]" />
                    <span>Presupuesto Máximo:</span>
                  </span>
                  <span className="text-[#ecb613] text-sm font-black">
                    {maxBudget >= 5000 ? 'Sin Límite (5.000 €+)' : `Hasta ${maxBudget.toLocaleString('es-ES')} €`}
                  </span>
                </div>

                <input
                  type="range"
                  min={350}
                  max={5000}
                  step={50}
                  value={maxBudget}
                  onChange={(e) => {
                    setMaxBudget(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-[#ecb613] bg-slate-800 h-2 rounded-lg cursor-pointer"
                />

                {/* CHIPS RÁPIDOS DE PRESUPUESTO */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {BUDGET_PRESETS.map((bp) => {
                    const isSelected = maxBudget === bp.value;
                    return (
                      <button
                        key={bp.label}
                        onClick={() => {
                          setMaxBudget(bp.value);
                          setCurrentPage(1);
                        }}
                        className={`text-[10px] font-mono px-2 py-1 rounded-lg transition-all ${
                          isSelected
                            ? 'bg-[#ecb613] text-black font-bold'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {bp.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BUSCADOR SEMÁNTICO */}
              <div className="lg:col-span-4 space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-[#ecb613]" />
                  <span>Búsqueda Neural por Especialidad</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#ecb613]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ej. Boleros, Mariachi 6p, DJ Bodas, Cuerda..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 font-medium focus:outline-none focus:ring-1 focus:ring-[#ecb613]"
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500 block">
                  Búsqueda bilateral instantánea en nombres, estilos y repertorios.
                </span>
              </div>

              {/* SELECTOR DE PROVINCIA */}
              <div className="lg:col-span-3 space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ecb613]" />
                  <span>Provincia del Evento</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedProvince}
                    onChange={(e) => {
                      setSelectedProvince(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#ecb613] cursor-pointer"
                  >
                    {PROVINCIAS_ESPANA.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov === 'Todas' ? '🇪🇸 Toda España (52 Provincias)' : prov}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="w-full text-[10px] font-mono text-slate-400 hover:text-white py-1 transition flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3 h-3 text-[#ecb613]" />
                  <span>Restablecer todos los filtros</span>
                </button>
              </div>
            </div>

            {/* SELLO DE GARANTÍA INMUTABLE SSOT */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
                <Lock className="w-3 h-3" />
                <span>Price-Lock 100,00 € en Stripe · Firma SHA-256 válida 72h</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-xs">
                <span>🔊 Acústica: Bose F1 12W/pax</span>
                <span>⚖️ Límite Ley 37/2003: 70 - 90 dBA</span>
                <span className="text-[#ecb613] font-bold">Split Soberano: 80% Artista</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. ESPACIO PRIVILEGIADO CENTRAL: SANTUARIO ÉLITE S-CLASS EDWIN AGUDELO
         ══════════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0c0a06] via-[#07070b] to-[#12080a] border-2 border-[#ecb613]/70 p-6 sm:p-8 lg:p-10 shadow-[0_0_50px_rgba(236,182,19,0.15)] overflow-hidden">
          {/* Fondo decorativo de alta gama */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

          {/* BADGE VIP DE ÉLITE */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613] text-black text-xs font-mono font-black tracking-wider uppercase shadow-md">
              <Award className="w-4 h-4 fill-black" />
              <span>RÓSTER DE ÉLITE S-CLASS · ARTISTA EMBAJADOR & DIRECCIÓN TÉCNICA</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#ecb613] bg-black/60 px-3 py-1 rounded-xl border border-[#ecb613]/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantía Contractual Productora EAR · Solo 1 Actuación por Fecha</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* FOTO MAESTRA HD DE EDWIN AGUDELO */}
            <div className="lg:col-span-4 relative group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#ecb613]/80 shadow-2xl bg-black">
                <img
                  src="https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg"
                  alt="Edwin Agudelo Cantante Solista Premium Productora EAR"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                
                {/* Badges sobre la foto */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-[#ecb613] border border-[#ecb613]/40 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase font-mono">
                  Méntrida (Toledo) / Hub Madrid
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white font-mono">
                  <div className="text-[11px] text-[#ecb613] font-bold uppercase">Solista Premium Homologado</div>
                  <div className="text-xl font-black font-syne uppercase">Edwin Agudelo</div>
                  <div className="text-[10px] text-slate-300">25+ Años de Oficio · 37 Macroconciertos</div>
                </div>
              </div>
            </div>

            {/* PROPUESTA ESCÉNICA Y LOS 4 FORMATOS OFICIALES */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest block mb-1">
                  Solista de Referencia Nacional · Split Soberano 80/10/10
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white font-syne uppercase tracking-tight">
                  Edwin Agudelo · <span className="text-[#ecb613]">Voz Lírica, Tradición y Emoción Pura</span>
                </h2>
                <p className="text-sm text-slate-300 mt-2 font-light leading-relaxed">
                  Cantante, tenor lírico y compositor con más de 25 años de oficio escénico. Show Solista Premium (350€) con acústica Bose de alta fidelidad, repertorio charro, boleros de gala y reserva directa con 100€ de depósito en Stripe. Máxima entrega y solemnidad para bodas, aniversarios y eventos de gala.
                </p>
              </div>

              {/* RIDER ACÚSTICO Y CREDENCIALES */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase block">Sonorización</span>
                  <span className="font-bold text-[#ecb613]">Bose F1 2.000W</span>
                </div>
                <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase block">Microfonía</span>
                  <span className="font-bold text-white">Shure Beta 87A</span>
                </div>
                <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase block">Presión Sonora</span>
                  <span className="font-bold text-emerald-400">70 - 80 dBA Gala</span>
                </div>
                <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase block">Price-Lock</span>
                  <span className="font-bold text-[#ecb613]">100 € Stripe</span>
                </div>
              </div>

              {/* LAS 4 FÓRMULAS HOMOLOGADAS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div className="p-3.5 rounded-2xl bg-black/60 border border-[#ecb613]/40 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase font-syne">1. Show Solista Premium</span>
                    <span className="text-sm font-black text-[#ecb613]">350 €</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug font-sans">
                    Edwin en vivo + Bose 2.000W + Photocall sombreros charros + flores sorpresa + dedicatoria.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase font-syne">2. Mariachi 6 Músicos</span>
                    <span className="text-sm font-black text-[#ecb613]">600 €</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug font-sans">
                    Edwin + 5 músicos en vivo (trompeta, vihuela, guitarrón, violín). 60 min continuos.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase font-syne">3. Agrupación 9 Músicos</span>
                    <span className="text-sm font-black text-[#ecb613]">900 €</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug font-sans">
                    Edwin + 8 músicos de conservatorio. Sección ampliada de metales y cuerdas.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/60 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase font-syne">4. Gran Ensamble 13 Músicos</span>
                    <span className="text-sm font-black text-[#ecb613]">1.300 €</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug font-sans">
                    Máximo estándar mexicano en España: 13 músicos en escena, dos salidas de gala.
                  </p>
                </div>
              </div>

              {/* BOTONES DE CIERRE Y CONVERSIÓN INMEDIATA */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 font-mono">
                <a
                  href="/reservar/solista"
                  className="flex-1 bg-[#ecb613] hover:bg-white text-black font-black uppercase text-xs py-3.5 px-4 rounded-xl text-center transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(236,182,19,0.4)]"
                >
                  <Lock className="w-4 h-4 fill-black" />
                  <span>Bloquear Fecha con 100 € en Stripe</span>
                </a>

                <a
                  href="/artistas/edwin-agudelo"
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold uppercase text-xs py-3.5 px-5 rounded-xl text-center transition flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-[#ecb613]" />
                  <span>Ver Dossier y Perfil Completo</span>
                </a>

                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent('Hola Edwin, quiero consultar disponibilidad y presupuesto para tu show solista o mariachi.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-emerald-400 text-black font-extrabold uppercase text-xs py-3.5 px-4 rounded-xl text-center transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-black" />
                  <span>WhatsApp Directo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. MODO TINDER MATCH NEURAL (SWIPE) O CUADRÍCULA NACIONAL DE ARTISTAS
         ══════════════════════════════════════════════════════════════════════════ */}
      {isSwipeMode ? (
        <section className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xl font-bold font-syne text-white uppercase">Modo Match Rápido · 200 Dimensiones</h3>
              <p className="text-xs text-slate-400 font-mono">Desliza o filtra por afinidad acústica, presupuesto y logística territorial.</p>
            </div>
            <button
              onClick={() => setIsSwipeMode(false)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-slate-300"
            >
              Volver a la Vista de Catálogo
            </button>
          </div>

          {canonicalLoading ? (
            <div className="py-24 text-center font-mono text-xs text-slate-400">
              <div className="w-10 h-10 border-4 border-slate-800 border-t-[#ecb613] rounded-full animate-spin mx-auto mb-3" />
              Cargando dataset canónico para afinidad neural...
            </div>
          ) : (
            <NeuralArtistTinderMatch
              artists={canonicalArtists}
              coupleCalibration={coupleCalibration}
              onSelectArtist={(artist) => {
                const modalArtist: RealArtist = {
                  id: artist.id,
                  name: artist.name,
                  slug: artist.slug,
                  category: artist.category || 'musica',
                  province: artist.province,
                  municipality: artist.municipality,
                  phone: artist.telephone || undefined,
                  telephone: artist.telephone || undefined,
                  has_real_phone: Boolean(artist.telephone),
                  img: artist.img || artist.imageUrls?.[0],
                  imageUrls: artist.imageUrls,
                  gallery: artist.imageUrls,
                  basePrice: artist.basePrice,
                  price: `${artist.basePrice} €`,
                  rating: artist.rating || 5.0,
                  reviews: artist.reviewsCount || 10,
                  description: artist.description,
                  formats: artist.formats,
                  genres: artist.genres
                };
                setSelectedArtistModal(modalArtist);
              }}
            />
          )}
        </section>
      ) : (
        <section id="catalogo-artistas-grid" className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* CONTROLES SUPERIORES DE PAGINACIÓN Y MÉTRICAS */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/60 pb-4 mb-6 font-mono text-xs">
            <div className="text-slate-400">
              Mostrando <span className="font-bold text-white">{total > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0}</span> - <span className="font-bold text-white">{Math.min(currentPage * ITEMS_PER_PAGE, total)}</span> de <span className="font-bold text-[#ecb613]">{total.toLocaleString()}</span> artistas auditados
              {selectedProvince !== 'Todas' && <span className="text-slate-300"> en <strong className="text-white">{selectedProvince}</strong></span>}
              {maxBudget < 5000 && <span className="text-slate-300"> (hasta <strong className="text-[#ecb613]">{maxBudget} €</strong>)</span>}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                aria-label="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* GRID DE ARTISTAS REALES */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-slate-800 border-t-[#ecb613] rounded-full animate-spin mb-4" />
              <p className="text-slate-400 font-mono text-sm">
                Filtrando artistas en tiempo real para {selectedProvince === 'Todas' ? 'toda España' : selectedProvince}...
              </p>
            </div>
          ) : artists.length === 0 ? (
            <div className="text-center py-24 bg-slate-900/40 rounded-3xl border border-slate-800 border-dashed p-8">
              <AlertTriangle className="w-12 h-12 text-[#ecb613]/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 font-syne uppercase">No se encontraron artistas para estos criterios</h3>
              <p className="text-slate-400 max-w-md mx-auto text-sm mb-6 font-light">
                Prueba a aumentar el presupuesto máximo, cambiar la provincia o restablecer los filtros de búsqueda.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#ecb613] text-black font-bold uppercase text-xs rounded-xl hover:bg-white transition font-mono"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artists.map((artist) => (
                <RealArtistCard
                  key={artist.id}
                  artist={artist}
                  onSelect={() => setSelectedArtistModal(artist)}
                />
              ))}
            </div>
          )}

          {/* PAGINACIÓN INFERIOR */}
          {!loading && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2 font-mono">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 transition font-medium flex items-center gap-2 text-sm"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>

              <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300">
                Página <span className="text-[#ecb613] font-bold">{currentPage}</span> de {totalPages}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 transition font-medium flex items-center gap-2 text-sm"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* MODAL DETALLE DE ARTISTA */}
      {selectedArtistModal && (
        <ArtistDetailModal
          artist={selectedArtistModal}
          onClose={() => setSelectedArtistModal(null)}
        />
      )}
    </div>
  );
}

const FALLBACK_ARTIST_IMAGES = [
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop'
];

function RealArtistCard({ artist, onSelect }: { artist: RealArtist; onSelect: () => void }) {
  const [imgError, setImgError] = useState(false);

  const charCodeSum = (artist.id || artist.name || 'artist').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallbackImg = FALLBACK_ARTIST_IMAGES[charCodeSum % FALLBACK_ARTIST_IMAGES.length];

  const rawImg = artist.img || (artist.imageUrls && artist.imageUrls[0]) || (artist.gallery && artist.gallery[0]);
  const isForbiddenImg =
    !rawImg ||
    rawImg.includes('photo-1519741497674-611481863552') ||
    rawImg.includes('c2524615ca092dc557196134bcbbcdc1') ||
    rawImg.includes('celebrents.s3.amazonaws.com') ||
    rawImg.includes('/cct61/cache/') ||
    rawImg.includes('.svg') ||
    rawImg.includes('gen_logoHeader');

  const displayImg = (!imgError && !isForbiddenImg) ? rawImg : fallbackImg;
  const baseTariff = artist.basePrice || 350;

  return (
    <div className="bg-[#07070b] border border-slate-800/80 rounded-2xl overflow-hidden hover:border-[#ecb613]/60 transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full shadow-lg">
      {/* FOTO HD DEL ARTISTA */}
      <div className="h-48 bg-slate-900 relative overflow-hidden cursor-pointer" onClick={onSelect}>
        <img
          src={displayImg}
          alt={artist.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-transparent to-transparent opacity-85 pointer-events-none" />

        {/* BADGE PROVINCIA */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-[#ecb613] border border-[#ecb613]/30 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
          <MapPin className="w-3 h-3 text-[#ecb613]" />
          <span>{artist.province}</span>
        </div>

        {artist.rating && (
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-[#ecb613] border border-[#ecb613]/30 text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-[#ecb613] text-[#ecb613]" />
            <span>{Number(artist.rating).toFixed(1)}</span>
            {artist.reviews && (
              <span className="text-slate-400 text-[9px] font-normal">({artist.reviews})</span>
            )}
          </div>
        )}
      </div>

      {/* CUERPO DE LA TARJETA */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-[10px] font-mono text-[#ecb613] block mb-1 uppercase tracking-widest">
          {artist.municipality || artist.province} · Split 80/10/10
        </span>

        <h3
          onClick={onSelect}
          className="text-base font-black text-white leading-tight mb-2 line-clamp-1 group-hover:text-[#ecb613] transition-colors cursor-pointer font-syne uppercase"
          title={artist.name}
        >
          {artist.name}
        </h3>

        <p className="text-xs text-slate-400 mb-4 line-clamp-2 min-h-[32px] font-light leading-relaxed">
          {artist.description || 'Artista homologado con sonorización de alta fidelidad Bose y garantía de actuación S-Class.'}
        </p>

        {/* INFO TÉCNICA */}
        <div className="mt-auto pt-3 border-t border-slate-800/60 space-y-2 text-xs font-mono">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Sonorización</span>
            <span className="text-[#ecb613] font-medium">Bose F1 / S1 Pro</span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Tarifa Base Estimada</span>
            <span className="text-white font-bold">Desde {baseTariff} €</span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Canal de Reserva</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Depósito 100€
            </span>
          </div>
        </div>

        {/* ACCIONES */}
        <div className="mt-4 grid grid-cols-2 gap-2 font-mono">
          <button
            onClick={onSelect}
            className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold py-2 px-2 rounded-xl transition border border-slate-700/60"
          >
            Ficha Completa
          </button>

          <a
            href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola Edwin, quiero consultar fecha y presupuesto para el artista ${artist.name} (${artist.province}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#ecb613] hover:bg-white text-black text-xs font-extrabold py-2 px-2 rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Consultar</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function ArtistDetailModal({ artist, onClose }: { artist: RealArtist; onClose: () => void }) {
  const basePrice = artist.basePrice || 350;
  const artistSlug = artist.slug || artist.id;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-[#08080d] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 transition"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] mb-2 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Ficha Técnica de Artista Homologado • Productora EAR</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 font-syne uppercase">{artist.name}</h2>
        <p className="text-sm text-slate-400 mb-6 flex items-center gap-1.5 font-mono">
          <MapPin className="w-4 h-4 text-[#ecb613] shrink-0" />
          <span>{artist.province} · Split 80% Artista / 10% EAR OS / 10% VIMUME</span>
        </p>

        {/* CARRUSEL DE FOTOS HD */}
        <div className="mb-6">
          <CinematicVanguardCarousel
            images={(() => {
              const all = (artist.imageUrls && artist.imageUrls.length > 0)
                ? artist.imageUrls
                : (artist.gallery && artist.gallery.length > 0)
                  ? artist.gallery
                  : artist.img ? [artist.img] : [];
              const clean = all.filter((u: string) =>
                u &&
                typeof u === 'string' &&
                !u.includes('photo-1519741497674-611481863552') &&
                !u.includes('c2524615ca092dc557196134bcbbcdc1') &&
                !u.includes('celebrents.s3.amazonaws.com') &&
                !u.includes('/cct61/cache/') &&
                !u.includes('.svg') &&
                !u.includes('gen_logoHeader')
              );
              return clean.length > 0 ? clean : [FALLBACK_ARTIST_IMAGES[0]];
            })()}
            title={artist.name}
            aspectRatio="video"
          />
        </div>

        <div className="space-y-4 mb-6 text-sm text-slate-300">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">Propuesta Escénica y Ficha</h4>
            <p className="leading-relaxed font-light text-slate-300">
              {artist.description_full || artist.description || 'Espectáculo musical en vivo homologado con equipamiento de sonido Bose de alta fidelidad y presión controlada.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 font-mono">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="block text-[11px] text-slate-400 uppercase">Provincia</span>
              <span className="font-bold text-white text-sm">{artist.province}</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="block text-[11px] text-slate-400 uppercase">Rating Auditado</span>
              <span className="font-bold text-[#ecb613] text-sm flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#ecb613]" />
                {Number(artist.rating || 5.0).toFixed(1)} / 5.0
              </span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="block text-[11px] text-slate-400 uppercase">Sonorización</span>
              <span className="font-bold text-emerald-400 text-sm">Bose F1 / S1 Pro</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-[#ecb613]/30 col-span-2 sm:col-span-3">
              <span className="block text-[11px] text-slate-400 uppercase">Tarifa Base Estimada</span>
              <span className="font-bold text-[#ecb613] text-base">
                Desde {basePrice} € (Reserva directa con depósito de 100 € en Stripe)
              </span>
            </div>
          </div>
        </div>

        {/* ACCIONES DEL MODAL */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800 font-mono">
          <a
            href={`/artistas/${encodeURIComponent(artistSlug)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold py-3 px-4 rounded-xl text-center text-sm transition flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>Perfil Completo</span>
          </a>

          <a
            href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola Edwin, quiero consultar disponibilidad del artista ${artist.name} en ${artist.province}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#ecb613] hover:bg-white text-black font-extrabold py-3 px-4 rounded-xl text-center text-sm transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,182,19,0.2)]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Directo</span>
          </a>
        </div>
      </div>
    </div>
  );
}
