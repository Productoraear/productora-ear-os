'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Calendar, Sparkles, X, ChevronDown, Check } from 'lucide-react';
import {
  ALL_SPANISH_PROVINCES,
  POPULAR_PROVINCES_NAMES,
  BODAS_NET_CATEGORIES
} from '@/lib/constants/spain-regions-and-categories';
import { buildProviderHref } from '@/lib/search';

interface AirbnbFloatingPillSearchBarProps {
  onSearchChange?: (filters: { category: string; province: string; date: string }) => void;
  className?: string;
}

export const AirbnbFloatingPillSearchBar: React.FC<AirbnbFloatingPillSearchBarProps> = ({
  onSearchChange,
  className = ''
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'category' | 'province' | 'date' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('categoria') || searchParams.get('cat') || searchParams.get('category') || 'ALL'
  );
  const [selectedProvince, setSelectedProvince] = useState<string>(
    searchParams.get('provincia') || searchParams.get('prov') || searchParams.get('province') || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>(searchParams.get('date') || '');
  const [provinceSearchFilter, setProvinceSearchFilter] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar desplegable al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveTab(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExecuteSearch = () => {
    setActiveTab(null);

    onSearchChange?.({
      category: selectedCategory,
      province: selectedProvince,
      date: selectedDate,
    });

    // Contrato único de URL vertical (idéntico a DiscoverySearch y al hero).
    router.push(
      buildProviderHref({
        category: selectedCategory,
        province: selectedProvince,
        date: selectedDate,
        theme: searchParams.get('theme'),
      })
    );
  };

  const currentCategoryLabel =
    BODAS_NET_CATEGORIES.find(c => c.id === selectedCategory)?.shortLabel ||
    (selectedCategory === 'ALL' ? 'Todos los Gremios' : selectedCategory);

  // Filtrado de las 52 provincias por texto
  const filteredProvinces = useMemo(() => {
    if (!provinceSearchFilter.trim()) return ALL_SPANISH_PROVINCES;
    const q = provinceSearchFilter.toLowerCase().trim();
    return ALL_SPANISH_PROVINCES.filter(p => p.toLowerCase().includes(q));
  }, [provinceSearchFilter]);

  return (
    <div ref={containerRef} className={`w-full max-w-4xl mx-auto relative z-30 ${className}`}>
      {/* 🚀 BARRA PRINCIPAL TIPO PÍLDORA AIRBNB */}
      <div className="bg-white border border-[#EBEBEB] hover:border-[#DDDDDD] shadow-[0_3px_14px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_22px_rgba(0,0,0,0.12)] rounded-full transition-all duration-300 p-1.5 sm:p-2 flex items-center justify-between gap-1">
        
        {/* 1. ¿QUÉ BUSCAS? (10 CATEGORÍAS BODAS.NET) */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === 'category' ? null : 'category')}
          className={`flex-1 text-left px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all flex items-center justify-between group ${
            activeTab === 'category' ? 'bg-[#F7F7F7] shadow-inner' : 'hover:bg-[#F7F7F7]'
          }`}
        >
          <div className="truncate pr-2">
            <span className="block text-[11px] font-bold text-[#222222] tracking-tight uppercase">
              ¿Qué buscas?
            </span>
            <span className="block text-xs sm:text-sm text-[#717171] truncate font-medium">
              {currentCategoryLabel}
            </span>
          </div>
          <ChevronDown size={14} className={`text-[#B0B0B0] transition-transform ${activeTab === 'category' ? 'rotate-180 text-[#FF385C]' : ''}`} />
        </button>

        <div className="h-8 w-px bg-[#EBEBEB] my-auto" />

        {/* 2. ¿DÓNDE? (52 PROVINCIAS DE ESPAÑA) */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === 'province' ? null : 'province')}
          className={`flex-1 text-left px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all flex items-center justify-between group ${
            activeTab === 'province' ? 'bg-[#F7F7F7] shadow-inner' : 'hover:bg-[#F7F7F7]'
          }`}
        >
          <div className="truncate pr-2">
            <span className="block text-[11px] font-bold text-[#222222] tracking-tight uppercase">
              ¿Dónde?
            </span>
            <span className="block text-xs sm:text-sm text-[#717171] truncate font-medium">
              {selectedProvince || 'Toda España (52 Provincias)'}
            </span>
          </div>
          <MapPin size={14} className={`text-[#B0B0B0] transition-colors ${activeTab === 'province' ? 'text-[#FF385C]' : ''}`} />
        </button>

        <div className="h-8 w-px bg-[#EBEBEB] my-auto hidden sm:block" />

        {/* 3. ¿CUÁNDO? (FECHA) */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === 'date' ? null : 'date')}
          className={`flex-1 text-left px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all hidden sm:flex items-center justify-between group ${
            activeTab === 'date' ? 'bg-[#F7F7F7] shadow-inner' : 'hover:bg-[#F7F7F7]'
          }`}
        >
          <div className="truncate pr-2">
            <span className="block text-[11px] font-bold text-[#222222] tracking-tight uppercase">
              ¿Cuándo?
            </span>
            <span className="block text-xs sm:text-sm text-[#717171] truncate font-medium">
              {selectedDate ? new Date(selectedDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Cualquier fecha'}
            </span>
          </div>
          <Calendar size={14} className={`text-[#B0B0B0] transition-colors ${activeTab === 'date' ? 'text-[#FF385C]' : ''}`} />
        </button>

        {/* 4. BOTÓN BUSCAR CIRCULAR RAUSCH AIRBNB */}
        <button
          type="button"
          onClick={handleExecuteSearch}
          aria-label="Buscar en el catálogo"
          className="bg-gradient-to-r from-[#E61E4D] via-[#E31C5F] to-[#D70466] text-white p-3 sm:px-5 sm:py-3 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-xs shrink-0"
        >
          <Search size={16} strokeWidth={2.5} />
          <span className="hidden md:inline font-bold">Buscar</span>
        </button>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          DESPLEGABLES INTERACTIVOS FLOTANTES
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeTab && (
        <div className="absolute top-full left-0 right-0 mt-3 p-4 sm:p-5 bg-white border border-[#EBEBEB] rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.15)] z-50 max-h-[80vh] overflow-y-auto">
          
          {/* TAB 1: LAS 10 CATEGORÍAS COMPLETAS DE BODAS.NET */}
          {activeTab === 'category' && (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0] mb-3">
                <div>
                  <span className="text-xs font-bold text-[#222222] uppercase tracking-wider block">
                    Las 10 Categorías Oficiales de Bodas.net & EAR OS
                  </span>
                  <span className="text-[11px] text-[#717171]">
                    Selecciona el gremio para tu celebración o evento
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('ALL'); setActiveTab('province'); }}
                  className="text-xs text-[#717171] hover:text-[#FF385C] underline font-medium"
                >
                  Ver todos
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {/* Opción 0: Todos los Gremios */}
                <button
                  type="button"
                  onClick={() => { setSelectedCategory('ALL'); setActiveTab('province'); }}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                    selectedCategory === 'ALL'
                      ? 'border-[#FF385C] bg-[#FFF5F7] text-[#FF385C] font-bold shadow-sm'
                      : 'border-[#EBEBEB] hover:border-[#CCCCCC] text-[#222222]'
                  }`}
                >
                  <span className="text-xl">🌟</span>
                  <div>
                    <span className="text-xs font-bold block">Todos los Gremios</span>
                    <span className="text-[10px] text-[#717171] font-normal">13.094 proveedores</span>
                  </div>
                </button>

                {/* 10 Categorías canónicas de Bodas.net */}
                {BODAS_NET_CATEGORIES.map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveTab('province');
                      }}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                        isSelected
                          ? 'border-[#FF385C] bg-[#FFF5F7] text-[#FF385C] font-bold shadow-sm'
                          : 'border-[#EBEBEB] hover:border-[#CCCCCC] text-[#222222]'
                      }`}
                    >
                      <span className="text-xl shrink-0">{cat.iconEmoji}</span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate">{cat.shortLabel}</span>
                        <span className="text-[10px] text-[#717171] font-normal block truncate">
                          {cat.label.split('(')[1]?.replace(')', '') || 'Directorio homologado'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: LAS 52 PROVINCIAS COMPLETAS DE ESPAÑA */}
          {activeTab === 'province' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0F0F0] mb-3 gap-2">
                <div>
                  <span className="text-xs font-bold text-[#222222] uppercase tracking-wider block">
                    ¿En qué provincia se celebra? (52 Provincias de España)
                  </span>
                  <span className="text-[11px] text-[#717171]">
                    Cobertura nacional total: península, Baleares, Canarias, Ceuta y Melilla
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedProvince && (
                    <button
                      type="button"
                      onClick={() => setSelectedProvince('')}
                      className="text-xs text-[#717171] hover:text-[#FF385C] underline"
                    >
                      Limpiar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setSelectedProvince(''); setActiveTab('date'); }}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-[#F7F7F7] border border-[#EBEBEB] text-[#222222] hover:border-[#FF385C]"
                  >
                    Toda España
                  </button>
                </div>
              </div>

              {/* Buscador de provincia en tiempo real */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Escribe para buscar tu provincia (ej. Valladolid, Córdoba, Asturias, Las Palmas...)"
                  value={provinceSearchFilter}
                  onChange={(e) => setProvinceSearchFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBEBEB] text-xs text-[#222222] placeholder:text-[#999999] focus:outline-none focus:border-[#FF385C]"
                  autoFocus
                />
              </div>

              {/* Provincias más populares */}
              {!provinceSearchFilter && (
                <div className="mb-3">
                  <span className="text-[10px] uppercase font-bold text-[#717171] tracking-wider block mb-1.5">
                    Provincias más solicitadas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_PROVINCES_NAMES.slice(0, 12).map(prov => (
                      <button
                        key={prov}
                        type="button"
                        onClick={() => {
                          setSelectedProvince(prov);
                          setActiveTab('date');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          selectedProvince.toLowerCase() === prov.toLowerCase()
                            ? 'bg-[#FF385C] text-white shadow-sm'
                            : 'bg-[#F7F7F7] border border-[#EBEBEB] hover:border-[#FF385C] text-[#222222]'
                        }`}
                      >
                        {prov}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Las 52 provincias completas */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#717171] tracking-wider block mb-1.5">
                  Todas las 52 Provincias ({filteredProvinces.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1.5 max-h-56 overflow-y-auto pr-1">
                  {filteredProvinces.map(prov => {
                    const isSelected = selectedProvince.toLowerCase() === prov.toLowerCase();
                    return (
                      <button
                        key={prov}
                        type="button"
                        onClick={() => {
                          setSelectedProvince(prov);
                          setActiveTab('date');
                        }}
                        className={`p-2 rounded-lg text-left text-xs transition-all truncate ${
                          isSelected
                            ? 'bg-[#FFF0F2] text-[#FF385C] font-bold border border-[#FF385C]'
                            : 'hover:bg-[#F7F7F7] text-[#222222]'
                        }`}
                      >
                        {prov}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FECHA */}
          {activeTab === 'date' && (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0] mb-3">
                <div>
                  <span className="text-xs font-bold text-[#222222] uppercase tracking-wider block">
                    Fecha del Evento
                  </span>
                  <span className="text-[11px] text-[#717171]">
                    Verifica disponibilidad y asegura el precio con fianza deducible
                  </span>
                </div>
                {selectedDate && (
                  <button
                    type="button"
                    onClick={() => setSelectedDate('')}
                    className="text-xs text-[#717171] hover:text-[#FF385C] underline"
                  >
                    Borrar fecha
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#EBEBEB] text-[#222222] focus:border-[#FF385C] focus:outline-none font-mono text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleExecuteSearch}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#E61E4D] via-[#E31C5F] to-[#D70466] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] transition-all"
                >
                  Ver Resultados
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
