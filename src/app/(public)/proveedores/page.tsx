'use client';

import React, { useState, useEffect, useMemo } from 'react';
import providersData from '@/data/all_providers_database.json';

function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

function MainProveedoresComponent() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModalProvider, setActiveModalProvider] = useState<any>(null);
  const [activeGalleryImg, setActiveGalleryImg] = useState<string>('');

  const pageSize = 24;

  const getCount = (catKey: string) => {
    if (catKey === 'ALL') return providersData.length;
    return providersData.filter((p: any) => 
      p.category && p.category.toLowerCase().includes(catKey.toLowerCase())
    ).length;
  };

  const categories = [
    { id: 'ALL', label: 'Todos los Servicios', count: getCount('ALL') },
    { id: 'finca', label: 'Fincas & Espacios', count: getCount('finca') },
    { id: 'catering', label: 'Catering & Gastro', count: getCount('catering') },
    { id: 'decoracion', label: 'Decoración & Flores', count: getCount('decoracion') },
    { id: 'musica', label: 'Música & Mariachi', count: getCount('musica') },
    { id: 'sonido', label: 'Sonido & Luces', count: getCount('sonido') },
    { id: 'foto', label: 'Vídeo 4K & Foto', count: getCount('foto') },
    { id: 'wedding', label: 'Wedding Planners', count: getCount('wedding') },
    { id: 'moda', label: 'Moda & Belleza', count: getCount('moda') },
    { id: 'transporte', label: 'Transporte & Coches', count: getCount('transporte') },
  ];

  const sortedData = useMemo(() => {
    return [...providersData].sort((a: any, b: any) => {
      if (a.isPreferred) return -1;
      if (b.isPreferred) return 1;
      return 0;
    });
  }, []);

  const filteredProviders = useMemo(() => {
    return sortedData.filter((p: any) => {
      const matchCat =
        selectedCategory === 'ALL' ||
        (p.category && p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      const matchProv =
        !selectedProvince ||
        (p.province && p.province.toLowerCase().includes(selectedProvince.toLowerCase()));
      const matchQuery =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchProv && matchQuery;
    });
  }, [selectedCategory, selectedProvince, searchQuery, sortedData]);

  const totalPages = Math.ceil(filteredProviders.length / pageSize);
  const paginatedProviders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProviders.slice(start, start + pageSize);
  }, [filteredProviders, currentPage]);

  const openModal = (provider: any) => {
    setActiveModalProvider(provider);
    setActiveGalleryImg(provider.img || provider.gallery?.[0]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans selection:bg-[#ecb613]/30">
      <header className="max-w-7xl mx-auto border-b border-neutral-800 pb-8 mb-8 space-y-4">
        <div className="bg-neutral-900/90 border border-[#ecb613]/50 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
          <span className="text-xs font-bold tracking-widest text-[#ecb613] uppercase block mb-1">
            Productora EAR • Red de Excelencia Nacional
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
            Proveedores Homologados & Matchmaking
          </h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-4xl mt-2">
            El estándar de provisión técnica y artística más estricto de España. Todos los profesionales cuentan con seguro de RC de 1M€, riders acústicos estandarizados y SLA garantizado por contrato.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-xs font-bold text-[#ecb613] uppercase tracking-wider block">
                Motor de Matchmaking S-Class
              </span>
              <h2 className="text-2xl font-black uppercase text-white">
                Directorio de Proveedores Homologados
              </h2>
            </div>
            <input
              type="text"
              placeholder="Buscar proveedor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ecb613]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#ecb613] text-black font-extrabold'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px] font-mono">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* REJILLA CON CURSOR DE MANO INTERACTIVO EN TODA LA TARJETA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paginatedProviders.map((item: any) => (
            <article
              key={item.id}
              onClick={() => openModal(item)}
              className={`bg-neutral-900/90 border transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl group cursor-pointer hover:scale-[1.02] ${
                item.isPreferred
                  ? 'border-[#ecb613] shadow-[#ecb613]/20 ring-1 ring-[#ecb613]'
                  : 'border-neutral-800 hover:border-[#ecb613]'
              }`}
            >
              <div className="relative h-52 w-full overflow-hidden bg-neutral-950">
                {item.img ? (
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-950">
                    <span className="text-3xl text-neutral-700">📷</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-bold text-[#ecb613] uppercase tracking-wider">
                  {item.badge || (item.category ? item.category.toUpperCase() : 'SERVICIOS')}
                </div>
                <div className="absolute top-3 right-3 bg-[#10b981]/90 text-black px-2.5 py-1 rounded-md text-[10px] font-black flex items-center gap-1">
                  ★ {item.rating || '4.9'} <span className="text-black/70 font-bold">({item.reviews || 18})</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-neutral-300">
                  📍 {item.province ? item.province.toUpperCase() : 'MADRID'}
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-[#ecb613] transition-colors leading-snug flex items-center gap-2">
                    {item.name} {item.isPreferred && <span className="text-[#ecb613]">✦</span>}
                  </h3>
                  <p className="text-neutral-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {item.description || `${item.name} (Servicios profesionales homologados). Contratación directa Productora EAR.`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-800/80 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Tarifa Base</span>
                    <span className="font-bold text-white">Desde {item.basePrice || 650} €</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">SLA Acústico</span>
                    <span className="font-bold text-[#10b981]">{item.sla || '12 W/pax Homologado'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-950 border-t border-neutral-800 space-y-2">
                <button
                  onClick={(e) => { e.stopPropagation(); openModal(item); }}
                  className={`w-full font-extrabold text-xs py-2.5 rounded-xl uppercase transition-all shadow-md cursor-pointer ${
                    item.isPreferred
                      ? 'bg-[#ecb613] text-black hover:bg-[#d4a20f]'
                      : 'bg-neutral-800 text-white hover:bg-[#ecb613] hover:text-black'
                  }`}
                >
                  Ver Ficha Completa & Fotos
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* MODAL INTERNO S-CLASS (FICHA COMPLETA) */}
        {activeModalProvider && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-center p-4 md:p-10">
            <div className="bg-neutral-900 border border-[#ecb613] w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-y-auto p-6 md:p-8 relative space-y-6 shadow-2xl">
              <button
                onClick={() => setActiveModalProvider(null)}
                className="absolute top-4 right-4 bg-neutral-800 hover:bg-[#ecb613] text-white hover:text-black h-10 w-10 rounded-full font-bold text-lg transition-all flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#ecb613] uppercase tracking-widest block">
                  {activeModalProvider.badge || 'PROVEEDOR HOMOLOGADO'} • {activeModalProvider.province?.toUpperCase() || 'MADRID'}
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white">{activeModalProvider.name}</h2>
              </div>

              <div className="space-y-3">
                <div className="h-80 w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800">
                  <img
                    src={activeGalleryImg || activeModalProvider.img}
                    alt={activeModalProvider.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {(activeModalProvider.gallery || [activeModalProvider.img]).map((imgUrl: string, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => setActiveGalleryImg(imgUrl)}
                      className={`h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        activeGalleryImg === imgUrl ? 'border-[#ecb613] scale-95' : 'border-neutral-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="Galería" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Descripción del Servicio</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {activeModalProvider.description_full || activeModalProvider.description}
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Garantía & Homologación</h4>
                  <ul className="space-y-1.5 text-xs text-neutral-300">
                    <li>✔️ Cobertura Póliza RC: 1.000.000 €</li>
                    <li>✔️ Contratación Directa vía EAR Split Soberano</li>
                    <li>✔️ Rider Técnico y Acústico Normalizado</li>
                    <li>✔️ Teléfono Directo: +34 {activeModalProvider.phone || '693693048'}</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <span className="text-xs text-neutral-500 uppercase block">Tarifa Garantizada</span>
                  <span className="text-2xl font-black text-white">Desde {activeModalProvider.basePrice || 650} €</span>
                </div>
                <a
                  href={`https://wa.me/34693693048?text=Hola%20Productora%20EAR,%20deseo%20bloquear%20reserva%20para%20${encodeURIComponent(activeModalProvider.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto bg-[#ecb613] hover:bg-[#d4a20f] text-black font-black text-xs px-8 py-4 rounded-xl uppercase transition-all text-center shadow-lg cursor-pointer"
                >
                  Bloquear Reserva e Iniciar Contratación
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


export default function WrappedProveedoresPage(props: any) {
  const mounted = useHasMounted();
  if (!mounted) return <div suppressHydrationWarning className="min-h-screen bg-black" />;
  return <MainProveedoresComponent {...props} />;
}
