'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  PhoneCall, 
  Camera, 
  SlidersHorizontal,
  X,
  Check,
  Building2,
  UtensilsCrossed,
  Flower2,
  Music2,
  Volume2,
  Video,
  HeartHandshake,
  Shirt,
  Car,
  Layers,
  Loader2
} from 'lucide-react';
import providersData from '@/data/all_providers_database.json';
import { CENTRALITA } from '@/lib/phone-constants';

function normalizeCategory(inputCat: string | null): string {
  if (!inputCat) return 'ALL';
  const c = inputCat.toLowerCase().trim();
  if (['foto', 'fotos', 'fotografo', 'fotografos', 'fotografia', 'video', 'videos', 'video-4k', 'videografo'].includes(c)) return 'foto';
  if (['finca', 'fincas', 'espacios', 'espacio', 'cortijos', 'haciendas'].includes(c)) return 'finca';
  if (['catering', 'banquetes', 'gastro', 'restaurantes', 'comida'].includes(c)) return 'catering';
  if (['decoracion', 'flores', 'floristerias', 'decoracion-flores'].includes(c)) return 'decoracion';
  if (['musica', 'mariachi', 'mariachis', 'artistas', 'solista', 'bandas', 'orquestas'].includes(c)) return 'musica';
  if (['sonido', 'luces', 'iluminacion', 'dj', 'arsenal', 'sonido-luces', 'dj-sonido'].includes(c)) return 'sonido';
  if (['wedding', 'wedding-planner', 'wedding-planners', 'organizacion'].includes(c)) return 'wedding';
  if (['moda', 'belleza', 'vestidos', 'trajes', 'joyeria', 'maquillaje', 'peluqueria'].includes(c)) return 'moda';
  if (['transporte', 'coches', 'coches-boda', 'chofer', 'limusinas'].includes(c)) return 'transporte';
  if (['servicios', 'otros', 'animacion', 'fotomaton'].includes(c)) return 'servicios';
  return c;
}

function ProveedoresDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCat = searchParams.get('cat') || searchParams.get('categoria') || searchParams.get('category');
  const urlProv = searchParams.get('provincia') || searchParams.get('prov') || searchParams.get('location') || '';
  const urlQ = searchParams.get('q') || searchParams.get('search') || '';

  const initialCat = normalizeCategory(urlCat);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedProvince, setSelectedProvince] = useState(urlProv);
  const [searchQuery, setSearchQuery] = useState(urlQ);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModalProvider, setActiveModalProvider] = useState<any>(null);
  const [activeGalleryImg, setActiveGalleryImg] = useState<string>('');

  useEffect(() => {
    if (urlCat) {
      setSelectedCategory(normalizeCategory(urlCat));
      setCurrentPage(1);
    }
  }, [urlCat]);

  useEffect(() => {
    if (urlProv) {
      setSelectedProvince(urlProv);
      setCurrentPage(1);
    }
  }, [urlProv]);

  const pageSize = 24;

  const getCount = (catKey: string) => {
    if (catKey === 'ALL') return providersData.length;
    return providersData.filter((p: any) => 
      p.category && p.category.toLowerCase() === catKey.toLowerCase()
    ).length;
  };

  const categories = [
    { id: 'ALL', label: 'Todos los Servicios', count: getCount('ALL'), icon: Layers },
    { id: 'finca', label: 'Fincas & Espacios', count: getCount('finca'), icon: Building2 },
    { id: 'catering', label: 'Catering & Gastro', count: getCount('catering'), icon: UtensilsCrossed },
    { id: 'decoracion', label: 'Decoración & Flores', count: getCount('decoracion'), icon: Flower2 },
    { id: 'musica', label: 'Música & Mariachi', count: getCount('musica'), icon: Music2 },
    { id: 'sonido', label: 'Sonido & Luces', count: getCount('sonido'), icon: Volume2 },
    { id: 'foto', label: 'Vídeo 4K & Foto', count: getCount('foto'), icon: Video },
    { id: 'wedding', label: 'Wedding Planners', count: getCount('wedding'), icon: HeartHandshake },
    { id: 'moda', label: 'Moda & Belleza', count: getCount('moda'), icon: Shirt },
    { id: 'transporte', label: 'Transporte & Coches', count: getCount('transporte'), icon: Car },
  ];

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    const params = new URLSearchParams(window.location.search);
    if (catId === 'ALL') {
      params.delete('cat');
      params.delete('categoria');
    } else {
      params.set('cat', catId);
    }
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    router.replace(newUrl, { scroll: false });
  };

  const filteredProviders = useMemo(() => {
    const sclassBbq = [
      {
        id: 'sclass-bbq-iberico',
        name: 'Catering de Brasas S-Class: Ritual Ibérico de Gala',
        category: 'catering',
        province: 'Madrid',
        description: 'Estación de showcooking de fuego vivo con cortes ibéricos seleccionados (secreto, pluma, presa y panceta curada) a la brasa de encina. Incluye sonorización Bose F1 de cortesía y registro sanitario homologado RGEAA.',
        price: '45 €/pax',
        rating: 5.0,
        reviews: 48,
        img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
        isPreferred: true,
        badge: 'HOMOLOGADO S-CLASS'
      },
      {
        id: 'sclass-bbq-argentino',
        name: 'Catering de Brasas: Asado Argentino Tradicional',
        category: 'catering',
        province: 'Madrid',
        description: 'Asado de tira, entraña, vacío, mollejas crocantes y chimichurri macerado 48h. Espadas criollas y asadores de campeonato mundial.',
        price: '55 €/pax',
        rating: 4.98,
        reviews: 36,
        img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
        isPreferred: true,
        badge: 'ALTA DISTINCIÓN'
      },
      {
        id: 'sclass-bbq-ancestral',
        name: 'Catering Ancestral al Fuego & a la Cruz',
        category: 'catering',
        province: 'Madrid',
        description: 'Cordero lechal y costillares enteros en domo de leña viva con cocción lenta de 8 horas. El monumento gastronómico definitivo para bodas y galas.',
        price: '65 €/pax',
        rating: 5.0,
        reviews: 29,
        img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop&q=80',
        isPreferred: true,
        badge: 'EXPERIENCIA MONUMENTAL'
      }
    ];

    const baseList = selectedCategory === 'catering' || selectedCategory === 'ALL'
      ? [...sclassBbq, ...providersData]
      : providersData;

    return baseList.filter((p: any) => {
      // 1. Filtrado Estricto de Categoría
      const matchCat =
        selectedCategory === 'ALL' ||
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      // 2. Filtrado de Provincia
      const matchProv =
        !selectedProvince ||
        (p.province && p.province.toLowerCase().includes(selectedProvince.toLowerCase()));

      // 3. Filtrado de Búsqueda de Texto
      const matchQuery =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchProv && matchQuery;
    }).sort((a: any, b: any) => {
      // Proveedores preferidos de esa categoría específica arriba
      if (a.isPreferred && !b.isPreferred) return -1;
      if (!a.isPreferred && b.isPreferred) return 1;
      return 0;
    });
  }, [selectedCategory, selectedProvince, searchQuery]);

  const totalPages = Math.ceil(filteredProviders.length / pageSize);
  const paginatedProviders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProviders.slice(start, start + pageSize);
  }, [filteredProviders, currentPage]);

  const openModal = (provider: any) => {
    setActiveModalProvider(provider);
    setActiveGalleryImg(provider.img || provider.gallery?.[0]);
  };

  const currentCategoryLabel = categories.find(c => c.id === selectedCategory)?.label || 'Todos los Servicios';

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans selection:bg-[#ecb613] selection:text-black">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HEADER CORPORATIVO S-CLASS
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="max-w-7xl mx-auto border-b border-neutral-900 pb-8 mb-8 space-y-4">
        <div className="bg-neutral-950 border border-[#ecb613]/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-[#ecb613]/10 to-transparent blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/5 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-widest mb-3">
            <Sparkles size={14} /> Productora EAR • Red de Excelencia Nacional
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-syne">
            Proveedores Homologados & Matchmaking
          </h1>

          <p className="text-neutral-400 text-sm sm:text-base max-w-4xl mt-2 font-light leading-relaxed">
            El estándar de provisión técnica y artística más estricto de España. Todos los profesionales cuentan con seguro de RC de 1.000.000 €, riders acústicos estandarizados de 12 W/pax y SLA garantizado por contrato.
          </p>
        </div>
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. FILTROS Y SELECTOR DE VERTICALES SANEADO
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main className="max-w-7xl mx-auto space-y-8">
        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest block">
                Filtro Activo: <strong className="text-white">{currentCategoryLabel}</strong>
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-syne mt-0.5">
                {filteredProviders.length.toLocaleString()} Profesionales Homologados
              </h2>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre o servicio..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-black border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ecb613] transition-all font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* CATEGORY TABS */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer font-mono ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-300 via-[#ecb613] to-amber-500 text-black shadow-lg shadow-[#ecb613]/20 font-black'
                      : 'bg-black/60 text-neutral-400 hover:text-white border border-white/10 hover:border-[#ecb613]/40'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-black' : 'text-[#ecb613]'} />
                  <span>{cat.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isSelected ? 'bg-black/20 text-black font-extrabold' : 'bg-white/5 text-neutral-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            3. REJILLA DE PROVEEDORES AISLADA
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {filteredProviders.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-12 text-center space-y-4">
            <Camera className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-xl font-bold uppercase text-white font-syne">
              No se encontraron proveedores en esta selección
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto">
              Intenta cambiar los términos de búsqueda o selecciona otra categoría del catálogo homologado.
            </p>
            <button
              onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
              className="px-6 py-3 rounded-xl bg-[#ecb613] text-black font-bold text-xs uppercase tracking-wider font-mono"
            >
              Ver Todos los Servicios
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProviders.map((item: any) => (
              <article
                key={item.id}
                onClick={() => openModal(item)}
                className={`bg-[#0a0a0a] border transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl group cursor-pointer hover:scale-[1.015] hover:shadow-2xl ${
                  item.isPreferred
                    ? 'border-[#ecb613] shadow-[#ecb613]/10 ring-1 ring-[#ecb613]'
                    : 'border-white/10 hover:border-[#ecb613]/50'
                }`}
              >
                <div className="relative h-56 w-full overflow-hidden bg-black">
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-900 to-black">
                      <Camera className="w-12 h-12 text-neutral-700" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-bold text-[#ecb613] uppercase tracking-wider font-mono border border-[#ecb613]/30">
                    {item.badge || (item.category ? item.category.toUpperCase() : 'HOMOLOGADO')}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-500 text-black px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center gap-1">
                    ★ {item.rating || '4.9'} <span className="text-black/70 font-bold">({item.reviews || 18})</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-neutral-300 border border-white/10">
                    📍 {item.province ? item.province.toUpperCase() : 'MADRID'}
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-white group-hover:text-[#ecb613] transition-colors leading-snug flex items-center gap-2 font-syne">
                      {item.name} {item.isPreferred && <span className="text-[#ecb613]">✦</span>}
                    </h3>
                    <p className="text-neutral-400 text-xs mt-2 line-clamp-2 leading-relaxed font-light">
                      {item.description || `${item.name} (Servicios profesionales homologados). Contratación directa Productora EAR.`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/5 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block">Tarifa Base</span>
                      <span className="font-bold text-white">Desde {item.basePrice || 650} €</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block">SLA Acústico / Calidad</span>
                      <span className="font-bold text-emerald-400">{item.sla || 'Garantía Contractual EAR'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-black/60 border-t border-white/5 flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); openModal(item); }}
                    className={`flex-1 font-extrabold text-xs py-3 rounded-2xl uppercase transition-all shadow-md cursor-pointer font-mono ${
                      item.isPreferred
                        ? 'bg-[#ecb613] text-black hover:bg-amber-400'
                        : 'bg-neutral-900 text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    Ver Ficha
                  </button>

                  <a
                    href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola, quiero verificar disponibilidad para ${item.name} en ${item.province ? item.province.charAt(0).toUpperCase() + item.province.slice(1).toLowerCase() : 'Madrid'}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/30 transition-all flex items-center justify-center cursor-pointer"
                    title="Consultar por WhatsApp"
                  >
                    <PhoneCall size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#ecb613]"
            >
              Anterior
            </button>
            <span className="text-xs font-mono text-neutral-400 px-4">
              Página <strong className="text-white">{currentPage}</strong> de <strong className="text-white">{totalPages}</strong>
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#ecb613]"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            4. MODAL S-CLASS DETALLADO
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeModalProvider && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-center items-center p-4 md:p-10">
            <div className="bg-[#0c0c0c] border border-[#ecb613] w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-y-auto p-6 md:p-8 relative space-y-6 shadow-2xl font-sans">
              <button
                onClick={() => setActiveModalProvider(null)}
                className="absolute top-4 right-4 bg-neutral-900 hover:bg-[#ecb613] text-white hover:text-black h-10 w-10 rounded-full font-bold text-lg transition-all flex items-center justify-center cursor-pointer border border-white/10"
              >
                ✕
              </button>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#ecb613] uppercase tracking-widest font-mono block">
                  {activeModalProvider.badge || 'PROVEEDOR HOMOLOGADO'} • {activeModalProvider.province?.toUpperCase() || 'MADRID'}
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white font-syne">{activeModalProvider.name}</h2>
              </div>

              <div className="space-y-3">
                <div className="h-80 w-full rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
                  <img
                    src={activeGalleryImg || activeModalProvider.img}
                    alt={activeModalProvider.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {activeModalProvider.gallery && activeModalProvider.gallery.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {activeModalProvider.gallery.map((imgUrl: string, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => setActiveGalleryImg(imgUrl)}
                        className={`h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          activeGalleryImg === imgUrl ? 'border-[#ecb613] scale-95' : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt="Galería" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Descripción del Servicio</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    {activeModalProvider.description_full || activeModalProvider.description || `${activeModalProvider.name} es un proveedor verificado por Productora EAR con solvencia técnica acreditada.`}
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Garantía & Homologación S-Class</h4>
                  <ul className="space-y-2 text-xs text-neutral-300 font-mono">
                    <li className="flex items-center gap-2"><span className="text-[#ecb613]">✓</span> Cobertura Póliza RC: 1.000.000 €</li>
                    <li className="flex items-center gap-2"><span className="text-[#ecb613]">✓</span> Contratación Directa vía EAR Split Soberano</li>
                    <li className="flex items-center gap-2"><span className="text-[#ecb613]">✓</span> Rider Técnico Homologado (Garantía Cero Fallos)</li>
                    <li className="flex items-center gap-2"><span className="text-[#ecb613]">✓</span> Despacho Central: {CENTRALITA.display}</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <span className="text-xs text-neutral-500 uppercase font-mono block">Tarifa Oficial Garantizada</span>
                  <span className="text-2xl font-black text-[#ecb613] font-mono">Desde {activeModalProvider.basePrice || 650} €</span>
                </div>
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola, quiero verificar disponibilidad para ${activeModalProvider.name} en ${activeModalProvider.province ? activeModalProvider.province.charAt(0).toUpperCase() + activeModalProvider.province.slice(1).toLowerCase() : 'Madrid'}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto bg-gradient-to-r from-amber-300 via-[#ecb613] to-amber-500 hover:brightness-110 text-black font-black text-xs px-8 py-4 rounded-2xl uppercase transition-all text-center shadow-lg shadow-[#ecb613]/20 font-mono cursor-pointer flex items-center justify-center gap-2"
                >
                  <PhoneCall size={16} />
                  <span>Verificar Disponibilidad en WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function WrappedProveedoresPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="space-y-3 text-center">
          <Loader2 className="animate-spin text-[#ecb613] mx-auto" size={32} />
          <p className="text-xs font-mono text-zinc-400">Cargando Directorio Homologado...</p>
        </div>
      </div>
    }>
      <ProveedoresDirectoryContent />
    </Suspense>
  );
}
