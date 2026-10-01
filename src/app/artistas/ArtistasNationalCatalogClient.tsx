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
  ChevronDown,
  ChevronUp,
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
  Layers,
  Smile,
  Baby,
  Wand2,
  Theater,
  X
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import CinematicVanguardCarousel from '@/components/sclass/CinematicVanguardCarousel';
import { NeuralArtistTinderMatch, type CanonicalArtist } from '@/components/artists/NeuralArtistTinderMatch';
import type { CoupleCalibration } from '@/lib/matching/calibratorTypes';
import { ARTIST_CALIBRATION_DIMENSIONS } from '@/lib/matching/artistCalibratorTypes';
import ArtistBookingSpecSheet from '@/components/artists/ArtistBookingSpecSheet';

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

/**
 * Atlas Completo de Familias y Categorías del Mundo Artístico
 * Sin exclusiones: 12 Grandes Familias y 48 Especialidades Escénicas
 */
const ARTISTIC_FAMILIES = [
  {
    id: 'all',
    label: 'Todos los Artistas & Shows',
    shortLabel: 'Todos',
    icon: Music,
    badge: '6.710',
    desc: 'Directorio nacional completo homologado con split 80/10/10 y sonido Bose F1.',
    genres: ['Solistas', 'Mariachis', 'DJs', 'Bandas', 'Cuerdas', 'Flamenco', 'Jazz', 'Magia', 'Circo']
  },
  {
    id: 'solista',
    label: 'Solistas, Cantantes & Vocalistas',
    shortLabel: 'Solistas',
    icon: Mic,
    badge: '350€ Base',
    desc: 'Cantantes solistas, tenores líricos, crooners, baladas románticas, boleros y acústicos.',
    genres: ['Tenor Lírico', 'Cantautor Acústico', 'Crooner Jazz', 'Boleros de Gala', 'Balada & Pop']
  },
  {
    id: 'mariachi',
    label: 'Mariachis & Folclore Tradicional',
    shortLabel: 'Mariachis & Folclore',
    icon: Sparkles,
    badge: '3 - 13 Pax',
    desc: 'Agrupaciones de mariachi en vivo, coros rocieros, tunas universitarias y folclore regional.',
    genres: ['Mariachi 6 Pax', 'Gran Ensamble 13 Pax', 'Coro Rociero', 'Tuna Universitaria', 'Gaiteros']
  },
  {
    id: 'dj',
    label: 'DJs, Disco Móvil & Sonorización',
    shortLabel: 'DJs & Disco Móvil',
    icon: Disc,
    badge: 'Sonido + Luz',
    desc: 'Deejays para bodas y galas, DJ Live con saxo o percusión, discomóviles y animación.',
    genres: ['DJ Bodas & Eventos', 'DJ + Saxo Live', 'Disco Móvil Iluminada', 'Música Electrónica']
  },
  {
    id: 'banda',
    label: 'Bandas en Directo & Versiones',
    shortLabel: 'Bandas & Pop/Rock',
    icon: Users,
    badge: 'Pop/Rock',
    desc: 'Bandas de versiones 80s/90s, grupos indie/pop, orquestas de fiesta y charangas.',
    genres: ['Versiones 80s & 90s', 'Bandas Tributo', 'Orquestas de Baile', 'Charangas', 'Rock Clásico']
  },
  {
    id: 'cuerdas',
    label: 'Música Clásica, Cuerda & Liturgia',
    shortLabel: 'Clásica & Cuerdas',
    icon: Heart,
    badge: 'Gala & Boda',
    desc: 'Cuartetos de cuerda, violín eléctrico, violonchelo, arpa, piano clásico, ópera y coro gospel.',
    genres: ['Cuarteto de Cuerda', 'Violín Eléctrico Show', 'Arpa & Piano', 'Ópera & Tenor', 'Coro Gospel']
  },
  {
    id: 'flamenco',
    label: 'Flamenco, Rumba & Raíz',
    shortLabel: 'Flamenco & Rumba',
    icon: Flame,
    badge: 'Cuadro Vivo',
    desc: 'Cuadros flamencos con cante y baile, guitarristas españoles, rumbas y fusión festiva.',
    genres: ['Cuadro Flamenco', 'Guitarra Española', 'Rumba Catalana', 'Cantaor Solista', 'Sevillanas']
  },
  {
    id: 'jazz',
    label: 'Jazz, Blues, Soul & Swing',
    shortLabel: 'Jazz & Swing',
    icon: Radio,
    badge: 'Club & Cóctel',
    desc: 'Tríos y cuartetos de jazz, crooners estilo Sinatra, bossa nova, soul elegante y big bands.',
    genres: ['Cuarteto de Jazz', 'Swing & Dixieland', 'Bossa Nova', 'Soul & Funk', 'Big Band']
  },
  {
    id: 'magia',
    label: 'Magia, Ilusionismo & Mentalismo',
    shortLabel: 'Magia & Mentalismo',
    icon: Wand2,
    badge: 'Asombro VIP',
    desc: 'Magia de cerca en cóctel (close-up), mentalistas, hipnosis y grandes ilusiones de escenario.',
    genres: ['Magia de Cerca (Close-up)', 'Mentalismo & Lectura', 'Magia de Escena', 'Magia Cómica']
  },
  {
    id: 'artes_escenicas',
    label: 'Artes Escénicas, Circo & Variedades',
    shortLabel: 'Circo & Escénicas',
    icon: Theater,
    badge: 'Show Visual',
    desc: 'Acróbatas, zancudos, espectáculos de fuego, cabaret, drag queens, danza aérea y batucadas.',
    genres: ['Acróbatas & Telas', 'Zancudos & Fuego', 'Cabaret & Burlesque', 'Batucadas', 'Danza Étnica']
  },
  {
    id: 'humor',
    label: 'Humor, Comedia & Monólogos',
    shortLabel: 'Humor & Stand-Up',
    icon: Smile,
    badge: 'Risas Live',
    desc: 'Monologuistas profesionales, cómicos de televisión, stand-up comedy y maestros de ceremonias.',
    genres: ['Monólogos de Humor', 'Comedia a la Carta', 'Maestros de Ceremonias', 'Improvisación']
  },
  {
    id: 'infantil',
    label: 'Música & Shows Infantiles',
    shortLabel: 'Infantil & Familiar',
    icon: Baby,
    badge: 'Familiar',
    desc: 'Cantajuegos en vivo, cuentacuentos con música, títeres musicales y magia infantil.',
    genres: ['Cantajuegos en Directo', 'Cuentacuentos Musical', 'Títeres & Marionetas', 'Animación Musical']
  }
];

const BUDGET_PRESETS = [
  { label: '350 € Solista', value: 350 },
  { label: '600 € Mariachi 6p', value: 600 },
  { label: '900 € 9 Músicos', value: 900 },
  { label: '1.300 € Gran Ensamble', value: 1300 },
  { label: '2.500 € Gala B2B', value: 2500 },
  { label: 'Todo Presupuesto', value: 5000 }
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArtistModal, setSelectedArtistModal] = useState<RealArtist | null>(null);

  // Acordeón / Desplegable de Familias Artísticas
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [categorySearchFilter, setCategorySearchFilter] = useState('');

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
    }, 250);
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
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedSubcat('all');
    setCurrentPage(1);
  };

  // CATEGORÍAS AISLADAS AL BUSCAR (Requerimiento estricto del CEO):
  // Al escribir (ej: "DJ" o "Mariachi"), las otras categorías desaparecen
  // momentáneamente hasta volver a borrarlo o pulsar la X!
  const visibleCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return ARTISTIC_FAMILIES;
    }
    const q = searchQuery.toLowerCase().trim();
    const matched = ARTISTIC_FAMILIES.filter(
      (f) =>
        f.id !== 'all' && (
          f.id.toLowerCase().includes(q) ||
          f.label.toLowerCase().includes(q) ||
          f.shortLabel.toLowerCase().includes(q) ||
          f.genres.some((g) => g.toLowerCase().includes(q))
        )
    );
    if (matched.length > 0) {
      return [ARTISTIC_FAMILIES[0], ...matched];
    }
    return ARTISTIC_FAMILIES;
  }, [searchQuery]);

  const activeCategoryObj = useMemo(() => {
    return ARTISTIC_FAMILIES.find((f) => f.id === selectedSubcat) || ARTISTIC_FAMILIES[0];
  }, [selectedSubcat]);

  return (
    <div className="w-full bg-[#030305] text-slate-100 font-sans">
      {/* ══════════════════════════════════════════════════════════════════════════
          1. COCKPIT SUPERIOR ULTRA-COMPACTO (MOBILE-FIRST)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-[#07070d] via-[#050508] to-[#030305] border-b border-slate-800/80 pt-16 sm:pt-20 pb-4 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Luces sutiles */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#ecb613]/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-3 sm:space-y-4">
          {/* HEADER PRINCIPAL COMPACTO */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-800/60 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono font-bold mb-1">
                <Sparkles className="w-3 h-3" />
                <span>COCKPIT S-CLASS · {total.toLocaleString()} AUDITADOS</span>
              </div>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white uppercase italic tracking-tight font-syne">
                Directorio Nacional de <span className="text-[#ecb613]">Artistas & Shows</span>
              </h1>
            </div>

            {/* TELEMETRÍA EN VIVO COMPACTA */}
            <div className="flex items-center gap-2 bg-[#0a0a10] border border-slate-800 px-3 py-1.5 rounded-xl shadow-lg shrink-0 font-mono text-[11px]">
              <span className="text-slate-400">52 Provs</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-bold">Split 80/10/10</span>
              <span className="text-slate-600">·</span>
              <button
                onClick={() => setIsSwipeMode(!isSwipeMode)}
                className={`px-2 py-1 rounded-lg font-bold text-[10px] uppercase transition flex items-center gap-1 ${
                  isSwipeMode
                    ? 'bg-[#ecb613] text-black'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>{isSwipeMode ? 'Cuadrícula' : 'Swipe'}</span>
              </button>
            </div>
          </div>

          {/* 🎛️ CONTROLES ULTRA-COMPACTOS: BÚSQUEDA NEURAL CON AISLAMIENTO Y BOTÓN "X" */}
          <div className="bg-[#08080e]/95 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl space-y-3">
            {/* BARRA DE BÚSQUEDA, PROVINCIA Y PRESUPUESTO */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3">
              {/* BUSCADOR NEURAL CON "X" INTERACTIVA */}
              <div className="md:col-span-6 relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#ecb613]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar DJ, Mariachi, Mago, Jazz, Cuerdas..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder:text-slate-500 font-medium focus:outline-none focus:ring-1 focus:ring-[#ecb613]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2.5 top-2 p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                    title="Borrar búsqueda y restaurar todas las categorías"
                  >
                    <X className="w-3.5 h-3.5 text-[#ecb613]" />
                  </button>
                )}
              </div>

              {/* SELECTOR DE PROVINCIA */}
              <div className="md:col-span-3 relative">
                <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#ecb613]" />
                <select
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#ecb613] cursor-pointer"
                >
                  {PROVINCIAS_ESPANA.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov === 'Todas' ? '🇪🇸 Toda España' : prov}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRECIO SLIDER COMPACTO */}
              <div className="md:col-span-3 flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-700/80">
                <span className="text-[10px] font-mono text-slate-400 shrink-0">Presupuesto:</span>
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
                  className="w-full accent-[#ecb613] h-1.5 bg-slate-800 rounded cursor-pointer"
                />
                <span className="text-[10px] font-mono text-[#ecb613] font-bold shrink-0">
                  {maxBudget >= 5000 ? 'Todo' : `${maxBudget}€`}
                </span>
              </div>
            </div>

            {/* 📂 NAVEGACIÓN COMPACTA MOBILE-FIRST POR CATEGORÍAS */}
            <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  <span className="text-slate-400 font-bold">Familia:</span>
                  <span className="text-[#ecb613] font-bold">{activeCategoryObj.shortLabel}</span>
                  {searchQuery && (
                    <span className="text-[10px] text-amber-400/90 font-mono">
                      (Aislado por "{searchQuery}")
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {(selectedSubcat !== 'all' || searchQuery) && (
                    <button
                      onClick={handleResetFilters}
                      className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <RefreshCw className="w-2.5 h-2.5 text-[#ecb613]" />
                      <span>Limpiar</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-slate-200 hover:text-white flex items-center gap-1 transition"
                  >
                    <span>{isAccordionOpen ? 'Plegar' : '+ 12 Familias'}</span>
                    {isAccordionOpen ? <ChevronUp className="w-3 h-3 text-[#ecb613]" /> : <ChevronDown className="w-3 h-3 text-[#ecb613]" />}
                  </button>
                </div>
              </div>

              {/* RAIL HORIZONTAL TÁCTIL (NO-SCROLLBAR) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                {visibleCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedSubcat === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedSubcat(cat.id);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold whitespace-nowrap transition-all shrink-0 ${
                        isActive
                          ? 'bg-[#ecb613] text-black shadow-md'
                          : 'bg-slate-950/80 hover:bg-slate-900 text-slate-300 border border-slate-800'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{cat.shortLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* PANEL DESPLEGABLE COMPACTO (12 FAMILIAS) */}
              {isAccordionOpen && (
                <div className="p-3 rounded-xl bg-black/90 border border-[#ecb613]/40 shadow-xl space-y-2 mt-2 max-h-[50vh] overflow-y-auto no-scrollbar animate-fadeIn">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {ARTISTIC_FAMILIES.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = selectedSubcat === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedSubcat(cat.id);
                            setCurrentPage(1);
                            setIsAccordionOpen(false);
                          }}
                          className={`p-2 rounded-xl border text-left transition text-xs flex flex-col justify-between ${
                            isActive
                              ? 'bg-[#ecb613]/20 border-[#ecb613]'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <Icon className="w-3.5 h-3.5 text-[#ecb613] shrink-0" />
                            <span className="font-bold text-white text-[11px] font-syne line-clamp-1">{cat.label}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono">{cat.badge}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. ESPACIO PRIVILEGIADO CENTRAL: SANTUARIO ÉLITE S-CLASS EDWIN AGUDELO
         ══════════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0c0a06] via-[#07070b] to-[#12080a] border-2 border-[#ecb613]/70 p-4 sm:p-6 lg:p-8 shadow-[0_0_40px_rgba(236,182,19,0.15)] overflow-hidden">
          {/* BADGE VIP DE ÉLITE */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ecb613] text-black text-[10px] sm:text-xs font-mono font-black tracking-wider uppercase shadow-md">
              <Award className="w-3.5 h-3.5 fill-black" />
              <span>RÓSTER DE ÉLITE S-CLASS · ARTISTA EMBAJADOR & DIRECCIÓN TÉCNICA</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#ecb613] bg-black/60 px-2.5 py-0.5 rounded-lg border border-[#ecb613]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Solo 1 Actuación por Fecha · Compromiso Contractual</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
            {/* FOTO HD DE EDWIN AGUDELO */}
            <div className="lg:col-span-4 relative group">
              <div className="relative aspect-[4/3] sm:aspect-[3/4] rounded-xl overflow-hidden border-2 border-[#ecb613]/80 shadow-xl bg-black">
                <img
                  src="https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg"
                  alt="Edwin Agudelo Cantante Solista Premium Productora EAR"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-[#ecb613] border border-[#ecb613]/40 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase font-mono">
                  Hub Méntrida / Madrid
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white font-mono">
                  <div className="text-[10px] text-[#ecb613] font-bold uppercase">Solista Premium Homologado</div>
                  <div className="text-lg sm:text-xl font-black font-syne uppercase">Edwin Agudelo</div>
                  <div className="text-[9px] text-slate-300">25+ Años de Oficio · Sonido Bose F1 2.000W</div>
                </div>
              </div>
            </div>

            {/* PROPUESTA ESCÉNICA Y LOS 4 FORMATOS */}
            <div className="lg:col-span-8 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block mb-0.5">
                  Solista de Referencia Nacional · Split Soberano 80/10/10
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-white font-syne uppercase tracking-tight">
                  Edwin Agudelo · <span className="text-[#ecb613]">Voz Lírica, Tradición y Emoción Pura</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-light leading-relaxed">
                  Cantante, tenor lírico y compositor con más de 25 años de oficio escénico. Show Solista Premium (350€) con acústica Bose de alta fidelidad, repertorio charro, boleros de gala y reserva directa con 100€ de depósito en Stripe.
                </p>
              </div>

              {/* LAS 4 FÓRMULAS HOMOLOGADAS EN CHIPS COMPACTOS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                <div className="p-2.5 rounded-xl bg-black/60 border border-[#ecb613]/50">
                  <span className="text-[10px] text-slate-400 uppercase block">1. Solista Premium</span>
                  <span className="text-xs font-black text-[#ecb613]">350 €</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">2. Mariachi 6p</span>
                  <span className="text-xs font-black text-[#ecb613]">600 €</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">3. Mariachi 9p</span>
                  <span className="text-xs font-black text-[#ecb613]">900 €</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">4. Ensamble 13p</span>
                  <span className="text-xs font-black text-[#ecb613]">1.300 €</span>
                </div>
              </div>

              {/* BOTONES DE CIERRE DIRECTO */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1 font-mono text-xs">
                <a
                  href="/reservar/solista"
                  className="flex-1 bg-[#ecb613] hover:bg-white text-black font-black uppercase py-3 px-4 rounded-xl text-center transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Lock className="w-3.5 h-3.5 fill-black" />
                  <span>Bloquear Fecha (100 € Stripe)</span>
                </a>

                <a
                  href="/artistas/edwin-agudelo"
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold uppercase py-3 px-4 rounded-xl text-center transition flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#ecb613]" />
                  <span>Dossier Completo</span>
                </a>

                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent('Hola Edwin, quiero consultar disponibilidad y presupuesto para tu show solista o mariachi.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-emerald-400 text-black font-extrabold uppercase py-3 px-4 rounded-xl text-center transition flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-black" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. CUADRÍCULA NACIONAL DE ARTISTAS
         ══════════════════════════════════════════════════════════════════════════ */}
      {isSwipeMode ? (
        <section className="max-w-7xl mx-auto py-6 px-3 sm:px-6 lg:px-8">
          <div className="mb-4 flex justify-between items-center border-b border-slate-800 pb-2">
            <div>
              <h3 className="text-lg font-bold font-syne text-white uppercase">Modo Match Rápido</h3>
              <p className="text-xs text-slate-400 font-mono">Desliza por afinidad acústica y logística.</p>
            </div>
            <button
              onClick={() => setIsSwipeMode(false)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-slate-300"
            >
              Volver a Cuadrícula
            </button>
          </div>

          {canonicalLoading ? (
            <div className="py-20 text-center font-mono text-xs text-slate-400">
              <div className="w-8 h-8 border-4 border-slate-800 border-t-[#ecb613] rounded-full animate-spin mx-auto mb-2" />
              Cargando dataset canónico...
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
        <section id="catalogo-artistas-grid" className="max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
          {/* CONTROLES SUPERIORES DE PAGINACIÓN Y MÉTRICAS */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800/60 pb-3 mb-4 font-mono text-xs">
            <div className="text-slate-400">
              Mostrando <span className="font-bold text-white">{total > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0}</span> - <span className="font-bold text-white">{Math.min(currentPage * ITEMS_PER_PAGE, total)}</span> de <span className="font-bold text-[#ecb613]">{total.toLocaleString()}</span> artistas
              {selectedSubcat !== 'all' && <span className="text-slate-300"> en <strong className="text-[#ecb613]">{activeCategoryObj.shortLabel}</strong></span>}
              {selectedProvince !== 'Todas' && <span className="text-slate-300"> en <strong className="text-white">{selectedProvince}</strong></span>}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 transition"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 transition"
                aria-label="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* GRID DE ARTISTAS REALES */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-slate-800 border-t-[#ecb613] rounded-full animate-spin mb-3" />
              <p className="text-slate-400 font-mono text-xs">
                Filtrando artistas en tiempo real...
              </p>
            </div>
          ) : artists.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 border-dashed p-6">
              <AlertTriangle className="w-10 h-10 text-[#ecb613]/50 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1 font-syne uppercase">No se encontraron artistas</h3>
              <p className="text-slate-400 max-w-md mx-auto text-xs mb-4 font-light">
                Prueba a modificar la búsqueda o restablecer filtros.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#ecb613] text-black font-bold uppercase text-xs rounded-xl hover:bg-white transition font-mono"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
            <div className="mt-8 flex items-center justify-center gap-2 font-mono text-xs">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>

              <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
                Pág <span className="text-[#ecb613] font-bold">{currentPage}</span> de {totalPages}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 transition flex items-center gap-1.5"
              >
                Siguiente <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          4. MODAL DETALLE DE ARTISTA CON FICHA COMPLETA DE CONTRATACIÓN Y CALENDARIO
         ══════════════════════════════════════════════════════════════════════════ */}
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
    <div className="bg-[#07070b] border border-slate-800/80 rounded-2xl overflow-hidden hover:border-[#ecb613]/60 transition-all duration-300 hover:-translate-y-0.5 group flex flex-col h-full shadow-lg">
      {/* FOTO HD DEL ARTISTA */}
      <div className="h-44 sm:h-48 bg-slate-900 relative overflow-hidden cursor-pointer" onClick={onSelect}>
        <img
          src={displayImg}
          alt={artist.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-transparent to-transparent opacity-85 pointer-events-none" />

        {/* BADGE PROVINCIA */}
        <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-[#ecb613] border border-[#ecb613]/30 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
          <MapPin className="w-3 h-3 text-[#ecb613]" />
          <span>{artist.province}</span>
        </div>

        {artist.rating && (
          <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md text-[#ecb613] border border-[#ecb613]/30 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-[#ecb613] text-[#ecb613]" />
            <span>{Number(artist.rating).toFixed(1)}</span>
            {artist.reviews && (
              <span className="text-slate-400 text-[9px] font-normal">({artist.reviews})</span>
            )}
          </div>
        )}
      </div>

      {/* CUERPO DE LA TARJETA */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <span className="text-[10px] font-mono text-[#ecb613] block mb-1 uppercase tracking-widest">
          {artist.municipality || artist.province} · Split 80/10/10
        </span>

        <h3
          onClick={onSelect}
          className="text-sm sm:text-base font-black text-white leading-tight mb-1.5 line-clamp-1 group-hover:text-[#ecb613] transition-colors cursor-pointer font-syne uppercase"
          title={artist.name}
        >
          {artist.name}
        </h3>

        <p className="text-xs text-slate-400 mb-3 line-clamp-2 min-h-[32px] font-light leading-relaxed">
          {artist.description || 'Artista homologado con sonorización de alta fidelidad Bose y garantía de actuación S-Class.'}
        </p>

        {/* INFO TÉCNICA */}
        <div className="mt-auto pt-2.5 border-t border-slate-800/60 space-y-1.5 text-xs font-mono">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Sonorización</span>
            <span className="text-[#ecb613] font-medium">Bose F1 / S1 Pro</span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Tarifa Estimada</span>
            <span className="text-white font-bold">Desde {baseTariff} €</span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Reserva Protegida</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Depósito 100€
            </span>
          </div>
        </div>

        {/* ACCIONES */}
        <div className="mt-3 grid grid-cols-2 gap-2 font-mono">
          <button
            onClick={onSelect}
            className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold py-2 px-2 rounded-xl transition border border-slate-700/60"
          >
            Ficha & Fechas
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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-[#07070b] border border-slate-800 rounded-2xl sm:rounded-3xl max-w-4xl w-full p-4 sm:p-8 shadow-2xl relative my-4 sm:my-8 max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 transition z-20"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CARRUSEL DE FOTOS HD */}
        <div className="mb-4 sm:mb-6 rounded-2xl overflow-hidden border border-slate-800">
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

        {/* FICHA TÉCNICA EXHAUSTIVA DE CONTRATACIÓN (CON CALENDARIO Y RUTA POR HORAS) */}
        <ArtistBookingSpecSheet
          artistId={artist.id}
          artistName={artist.name}
          artistProvince={artist.province}
          basePrice={basePrice}
          slug={artistSlug}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
