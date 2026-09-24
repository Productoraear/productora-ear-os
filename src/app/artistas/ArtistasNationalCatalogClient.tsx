'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  SlidersHorizontal
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import CinematicVanguardCarousel from '@/components/sclass/CinematicVanguardCarousel';

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
  { id: 'all', label: 'Todos los Artistas', icon: Music },
  { id: 'solista', label: 'Solistas & Vocalistas', icon: Users },
  { id: 'mariachi', label: 'Mariachis & Mexicano', icon: Sparkles },
  { id: 'dj', label: 'DJs & Disco Móvil', icon: Radio },
  { id: 'banda', label: 'Bandas & Versiones', icon: SlidersHorizontal },
  { id: 'cuerdas', label: 'Lírico, Violín & Cuerda', icon: Heart },
];

const ITEMS_PER_PAGE = 24;

export default function ArtistasNationalCatalogClient() {
  const [artists, setArtists] = useState<RealArtist[]>([]);
  const [total, setTotal] = useState(5359);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState('Todas');
  const [selectedSubcat, setSelectedSubcat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArtistModal, setSelectedArtistModal] = useState<RealArtist | null>(null);

  // Debounce buscador
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Petición al backend
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

      const res = await fetch(`/api/profiles/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const providers = Array.isArray(data.providers) ? data.providers : [];
        setArtists(providers);
        if (typeof data.total === 'number' && data.total > 0) {
          setTotal(data.total);
        } else {
          setTotal(providers.length);
        }
      }
    } catch (err) {
      console.error('Error cargando catálogo de artistas:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedProvince, selectedSubcat, debouncedSearch]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 450, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#030305] text-slate-100 font-sans">
      {/* HERO HEROICO ULTRA-COMPACTO S-CLASS */}
      <section className="bg-[#06060a] border-b border-slate-800/80 pt-20 pb-4 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FF2B44]/10 border border-[#FF2B44]/30 text-[#FF2B44] text-[10px] font-mono font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Róster Canónico de Artistas & Shows · Productora EAR</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white uppercase italic tracking-tight font-syne">
                Directorio Nacional de <span className="text-[#ecb613]">Artistas & Shows</span> ({total.toLocaleString()} Auditados)
              </h1>
            </div>

            {/* BANNER COMPACTO SOLISTA DE REFERENCIA EDWIN AGUDELO */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#0d0d14] via-[#09090f] to-[#12080a] border border-[#ecb613]/40 p-2.5 rounded-2xl shadow-lg shrink-0">
              <img 
                src="https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg" 
                alt="Edwin Agudelo Solista Premium"
                className="w-12 h-12 rounded-xl object-cover border border-[#ecb613] shrink-0"
              />
              <div className="text-left font-mono">
                <span className="text-[9px] font-black uppercase text-[#ecb613] block">SOLISTA REFERENCIA (350€)</span>
                <span className="text-xs font-bold text-white block">Edwin Agudelo · Premium</span>
              </div>
              <a 
                href="/reservar/solista" 
                className="px-3 py-1.5 bg-[#ecb613] text-black font-black uppercase text-[10px] rounded-lg hover:bg-white transition-all font-mono shrink-0 ml-1"
              >
                100€ Lock
              </a>
            </div>
          </div>

          {/* CATEGORÍAS & FILTROS DE BÚSQUEDA COMPACTOS */}
          <div className="space-y-3">
            {/* Pestañas de Gremios Musicales */}
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
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                      isActive
                        ? 'bg-[#ecb613] text-black shadow-[0_0_15px_rgba(236,182,19,0.3)]'
                        : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <Icon size={13} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* BARRA DE BÚSQUEDA Y PROVINCIA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/90 p-3 rounded-2xl border border-slate-800 shadow-xl">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#ecb613]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar Mariachi, DJ, Solista..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#ecb613] placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-[#ecb613]" />
                  <select
                    value={selectedProvince}
                    onChange={(e) => {
                      setSelectedProvince(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-xs text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#ecb613] cursor-pointer appearance-none"
                  >
                    {PROVINCIAS_ESPANA.map((prov) => (
                      <option key={prov} value={prov}>{prov === 'Todas' ? 'Toda España' : prov}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    setSelectedProvince('Todas');
                    setSelectedSubcat('all');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold py-2 px-3 rounded-xl transition text-xs flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#ecb613]" />
                  <span>Reset Filtros</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MÉTRICAS DE RESULTADOS Y CONTROLES SUPERIORES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center border-b border-slate-800/50">
        <div className="text-sm text-slate-400 font-mono">
          Mostrando <span className="font-bold text-white">{total > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0}</span> - <span className="font-bold text-white">{Math.min(currentPage * ITEMS_PER_PAGE, total)}</span> de <span className="font-bold text-[#ecb613]">{total.toLocaleString()}</span> artistas
        </div>

        <div className="flex gap-2 font-mono">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-center">
            {currentPage} / {totalPages}
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
      <section className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-slate-800 border-t-[#ecb613] rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-mono text-sm">Cargando artistas y shows en {selectedProvince === 'Todas' ? 'España' : selectedProvince}...</p>
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 rounded-2xl border border-slate-800 border-dashed">
            <AlertTriangle className="w-12 h-12 text-[#ecb613]/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2 font-syne uppercase">No se encontraron artistas</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Prueba a modificar los términos de búsqueda o cambiar de provincia/subcategoría.
            </p>
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

  const displayImg = (!imgError && (artist.img || (artist.imageUrls && artist.imageUrls[0]) || (artist.gallery && artist.gallery[0]))) || fallbackImg;
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-[#08080d] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800 transition"
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
            images={
              artist.imageUrls && artist.imageUrls.length > 0
                ? artist.imageUrls
                : artist.gallery && artist.gallery.length > 0
                  ? artist.gallery
                  : artist.img
                    ? [artist.img]
                    : []
            }
            title={artist.name}
            aspectRatio="video"
          />
        </div>

        <div className="space-y-4 mb-6 text-sm text-slate-300">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 font-mono">Propuesta Escénica y Ficha</h4>
            <p className="leading-relaxed font-light text-slate-300">
              {artist.description_full || artist.description || 'Espectáculo musical en vivo homologado con equipamiento de sonido Bose de alta presión sonora.'}
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
              <span className="block text-[11px] text-slate-400 uppercase">Acuática S-Class</span>
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
