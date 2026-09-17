'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  MapPin, 
  Users, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  MessageSquare, 
  ExternalLink, 
  Star, 
  Building2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Lock
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { PROVIDERS_MANIFEST_TOTALS } from '@/lib/constants/providers-manifest';

interface RealFinca {
  id: string;
  name: string;
  slug?: string;
  category: string;
  province: string;
  address?: string;
  phone?: string;
  telephone?: string;
  hasDirectPhone?: boolean;
  phoneType?: string;
  img?: string;
  imageUrls?: string[];
  gallery?: string[];
  basePrice?: number;
  price?: string | number;
  rating?: number;
  reviews?: number;
  description?: string;
  services_list?: string[];
}

const PROVINCIAS_ESPANA = [
  'Todas',
  'Madrid',
  'Toledo',
  'Barcelona',
  'Valencia',
  'Sevilla',
  'Málaga',
  'Alicante',
  'Cádiz',
  'Baleares',
  'Girona',
  'Granada',
  'Córdoba',
  'Las Palmas',
  'Santa Cruz de Tenerife',
  'Asturias',
  'Badajoz',
  'A Coruña',
  'Murcia',
  'Valladolid',
  'Zaragoza',
  'Cantabria',
  'Castellón',
  'Ciudad Real',
  'Cuenca',
  'Guadalajara',
  'Huelva',
  'Jaén',
  'León',
  'Lleida',
  'Lugo',
  'Navarra',
  'Ourense',
  'Palencia',
  'Pontevedra',
  'La Rioja',
  'Salamanca',
  'Segovia',
  'Soria',
  'Tarragona',
  'Teruel',
  'Álava',
  'Albacete',
  'Almería',
  'Ávila',
  'Burgos',
  'Cáceres',
  'Gipuzkoa',
  'Huesca',
  'Bizkaia',
  'Zamora'
];

const ITEMS_PER_PAGE = 24;

export default function FincasNationalCatalogClient() {
  const [fincas, setFincas] = useState<RealFinca[]>([]);
  const [total, setTotal] = useState(PROVIDERS_MANIFEST_TOTALS.finca);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFincaModal, setSelectedFincaModal] = useState<RealFinca | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch real fincas from our high-speed API
  const fetchFincas = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('category', 'finca');
      params.set('page', String(currentPage));
      params.set('limit', String(ITEMS_PER_PAGE));
      if (selectedProvince && selectedProvince !== 'Todas') {
        params.set('province', selectedProvince);
      }
      if (debouncedSearch.trim()) {
        params.set('q', debouncedSearch.trim());
      }

      const res = await fetch(`/api/profiles/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setFincas(data.providers || []);
        if (data.total) setTotal(data.total);
      }
    } catch (err) {
      console.error('Error fetching real fincas:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedProvince, debouncedSearch]);

  useEffect(() => {
    fetchFincas();
  }, [fetchFincas]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#030305] text-slate-100 font-sans">
      {/* HEADER DE BÚSQUEDA NACIONAL REAL */}
      <section className="bg-[#06060a] border-b border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Base de Datos Verificada • Productora EAR</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Directorio Nacional de <span className="text-amber-500">Fincas & Espacios</span>
              </h1>
              <p className="text-slate-400 max-w-2xl text-base sm:text-lg mt-2 font-light">
                {total.toLocaleString()} fincas y complejos auditados en España para bodas de alto nivel, con homologación acústica y rider Bose F1.
              </p>
            </div>
            
            <div className="bg-slate-900/90 border border-amber-500/30 backdrop-blur-md rounded-2xl p-5 text-center min-w-[220px] shadow-[0_0_30px_rgba(245,158,11,0.08)]">
              <span className="block text-4xl font-black text-white font-mono tracking-tight">{total.toLocaleString()}</span>
              <span className="block text-xs font-semibold text-amber-500 uppercase tracking-widest mt-1">Fincas Reales en Red</span>
            </div>
          </div>

          {/* BARRA DE FILTROS REALES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/90 p-5 rounded-2xl border border-slate-800 shadow-2xl relative z-20">
            {/* Buscador */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Buscar Finca o Municipio</label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-amber-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej. Miravalle, Aranjuez, Illescas..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Selector de Provincia */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Provincia</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-amber-500" />
                <select 
                  value={selectedProvince} 
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all cursor-pointer appearance-none"
                >
                  {PROVINCIAS_ESPANA.map((prov) => (
                    <option key={prov} value={prov}>{prov === 'Todas' ? 'Toda España' : prov}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reset / Acción Rápida */}
            <div className="flex items-end">
              <button 
                onClick={() => {
                  setSelectedProvince('Todas');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-amber-500" />
                <span>Restablecer Filtros</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* METRICA DE RESULTADOS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center border-b border-slate-800/50">
        <div className="text-sm text-slate-400">
          Mostrando <span className="font-bold text-white">{total > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0}</span> - <span className="font-bold text-white">{Math.min(currentPage * ITEMS_PER_PAGE, total)}</span> de <span className="font-bold text-amber-500">{total.toLocaleString()}</span> fincas
        </div>
        
        {/* Controles Paginación Superiores */}
        <div className="flex gap-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 flex items-center">
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

      {/* GRID DE RESULTADOS REALES */}
      <section className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-slate-800 border-t-amber-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-medium">Cargando espacios verificados en {selectedProvince === 'Todas' ? 'España' : selectedProvince}...</p>
          </div>
        ) : fincas.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 rounded-2xl border border-slate-800 border-dashed">
            <AlertTriangle className="w-12 h-12 text-amber-500/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No se encontraron fincas</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Prueba a cambiar los términos de búsqueda o selecciona otra provincia para ver más resultados disponibles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {fincas.map((finca) => (
              <RealFincaCard 
                key={finca.id} 
                finca={finca} 
                onSelect={() => setSelectedFincaModal(finca)}
              />
            ))}
          </div>
        )}

        {/* PAGINACIÓN INFERIOR */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 transition font-medium flex items-center gap-2 text-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            
            <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-mono text-slate-300">
              Página <span className="text-amber-400 font-bold">{currentPage}</span> de {totalPages}
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

      {/* MODAL DETALLE DE FINCA REAL */}
      {selectedFincaModal && (
        <FincaDetailModal 
          finca={selectedFincaModal} 
          onClose={() => setSelectedFincaModal(null)} 
        />
      )}
    </div>
  );
}

function RealFincaCard({ finca, onSelect }: { finca: RealFinca; onSelect: () => void }) {
  const [imgError, setImgError] = useState(false);
  const defaultFincaImg = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop";

  const displayImg = (!imgError && (finca.img || (finca.imageUrls && finca.imageUrls[0]))) || defaultFincaImg;
  const directPhone = finca.hasDirectPhone ? (finca.phone || finca.telephone) : null;
  const isDirect = Boolean(directPhone);

  const cleanLocation = finca.address || finca.province || 'España';

  return (
    <div className="bg-[#07070b] border border-slate-800/80 rounded-2xl overflow-hidden hover:border-amber-500/60 transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full shadow-lg">
      {/* FOTO REAL DEL ESPACIO */}
      <div className="h-44 bg-slate-900 relative overflow-hidden cursor-pointer" onClick={onSelect}>
        <img 
          src={displayImg} 
          alt={finca.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* BADGE DE AUDITORÍA / PROVINCIA */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
          <MapPin className="w-3 h-3 text-amber-500" />
          <span>{finca.province}</span>
        </div>

        {finca.rating && (
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{Number(finca.rating).toFixed(1)}</span>
            {finca.reviews && (
              <span className="text-slate-400 text-[9px] font-normal">({finca.reviews})</span>
            )}
          </div>
        )}
      </div>
      
      {/* CUERPO DE LA TARJETA */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-[11px] font-mono text-slate-400 block mb-1 line-clamp-1">
          {cleanLocation}
        </span>
        <h3 
          onClick={onSelect}
          className="text-base font-bold text-white leading-tight mb-2 line-clamp-1 group-hover:text-amber-400 transition-colors cursor-pointer" 
          title={finca.name}
        >
          {finca.name}
        </h3>
        
        <p className="text-xs text-slate-400 mb-4 line-clamp-2 min-h-[32px] font-light leading-relaxed">
          {finca.description || 'Espacio singular homologado para celebración de bodas y banquetes de gala con producción integral de Productora EAR.'}
        </p>
        
        {/* INFO TÉCNICA */}
        <div className="mt-auto pt-3 border-t border-slate-800/60 space-y-2 text-xs">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Rider Productora EAR</span>
            <span className="text-amber-400 font-mono font-medium">Bose F1 Homologado</span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Canal de Contacto</span>
            {isDirect ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Línea Directa
              </span>
            ) : (
              <span className="text-amber-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Centralita EAR
              </span>
            )}
          </div>
        </div>

        {/* ACCIONES */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button 
            onClick={onSelect}
            className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold py-2 px-2 rounded-xl transition border border-slate-700/60"
          >
            Ficha Completa
          </button>
          
          <a
            href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola, quiero consultar disponibilidad y condiciones para la finca ${finca.name} en ${finca.province}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2 px-2 rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Consultar</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function FincaDetailModal({ finca, onClose }: { finca: RealFinca; onClose: () => void }) {
  const isDirect = Boolean(finca.hasDirectPhone);
  const cleanPhone = finca.hasDirectPhone ? (finca.phone || finca.telephone) : CENTRALITA;
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${finca.name} ${finca.address || finca.province || ''} bodas`)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#08080d] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800 transition"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-amber-500 mb-2 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Ficha Técnica Verificada • Productora EAR</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{finca.name}</h2>
        <p className="text-sm text-slate-400 mb-6 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{finca.address || finca.province || 'España'}</span>
        </p>

        {finca.img && (
          <div className="rounded-xl overflow-hidden h-64 mb-6 bg-slate-900 border border-slate-800">
            <img 
              src={finca.img} 
              alt={finca.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-4 mb-6 text-sm text-slate-300">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Descripción del Espacio</h4>
            <p className="leading-relaxed font-light text-slate-300">
              {finca.description || 'Espacio singular homologado para la celebración de eventos de gala y bodas.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="block text-[11px] text-slate-400 uppercase">Provincia</span>
              <span className="font-bold text-white text-sm">{finca.province}</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="block text-[11px] text-slate-400 uppercase">Calificación</span>
              <span className="font-bold text-amber-400 text-sm flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {Number(finca.rating || 5.0).toFixed(1)} / 5.0
              </span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="block text-[11px] text-slate-400 uppercase">Acústica S-Class</span>
              <span className="font-bold text-emerald-400 text-sm">Bose F1 812</span>
            </div>
          </div>
        </div>

        {/* ACCIONES DEL MODAL */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
          <a
            href={googleSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold py-3 px-4 rounded-xl text-center text-sm transition flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" />
            <span>Ver Ficha en Google</span>
          </a>

          <a
            href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola Edwin, quiero consultar disponibilidad técnica y fecha para la finca ${finca.name} (${finca.province}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl text-center text-sm transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Consultar con Concierge EAR</span>
          </a>
        </div>
      </div>
    </div>
  );
}
