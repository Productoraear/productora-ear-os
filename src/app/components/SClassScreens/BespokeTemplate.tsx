'use client';

import React from 'react';
import catalogData from '@/data/mariachis_catalog_clean.json';
import { useSharedContext } from '@/app/context/SharedContext';

interface BespokeTemplateProps {
  keywords?: any;
  isApex?: boolean;
  category?: string;
  location?: string;
  province?: string;
  serviceId?: string;
  title?: string;
  description?: string;
}

export const BespokeTemplate: React.FC<BespokeTemplateProps> = ({
  category = 'mariachis',
  location: locationProp = 'Madrid',
  province: provinceProp = 'Madrid',
}) => {
  // Conexión corregida al Hook exportado formalmente por SharedContext
  let setIsPricerOpen: ((open: boolean) => void) | undefined;
  try {
    const shared = useSharedContext();
    setIsPricerOpen = shared?.setIsPricerOpen;
  } catch (e) {
    // Salvaguarda si se renderiza fuera de Provider
  }

  const safeLocation = locationProp || provinceProp || 'Madrid';
  const safeProvince = (provinceProp || locationProp || 'madrid').toLowerCase().trim();
  const safeCategory = category || 'mariachis';

  const capitalizedLocation = safeLocation
    ? safeLocation.charAt(0).toUpperCase() + safeLocation.slice(1)
    : 'Madrid';

  const filteredCatalog = catalogData.filter((item) => {
    const matchesCategory = item.category.toLowerCase() === safeCategory.toLowerCase();
    const matchesProvince = item.provinces.some(
      (p) => p.toLowerCase() === safeProvince || safeProvince.includes(p.toLowerCase())
    );
    return matchesCategory && matchesProvince;
  });

  const displayList = filteredCatalog.length > 0 ? filteredCatalog : catalogData;

  const handleCotizarExpress = (artistName: string, basePrice: number) => {
    if (typeof setIsPricerOpen === 'function') {
      setIsPricerOpen(true);
    } else {
      const text = encodeURIComponent(
        `Hola Productora EAR, deseo cotización express para ${artistName} (${safeCategory.toUpperCase()}) en ${capitalizedLocation}. Precio estimado: desde ${basePrice}€.`
      );
      window.open(`https://wa.me/34693693048?text=${text}`, '_blank');
    }
  };

  const fallbackDesc =
    'Infraestructura técnica directa, músicos verificados y reserva con garantía en ' +
    capitalizedLocation +
    '.';

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-6 md:p-12 pb-24">
      <header className="max-w-6xl mx-auto border-b border-neutral-800 pb-8 mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-2 w-2 rounded-full bg-[#ecb613] animate-pulse"></span>
          <span className="text-xs font-bold tracking-widest text-[#ecb613] uppercase">
            Productora EAR • S-Class Logistics OS
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black mt-2 text-white tracking-tight uppercase">
          {safeCategory} en{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-amber-100">
            {capitalizedLocation}
          </span>
        </h1>
        <p className="text-neutral-400 mt-4 text-lg max-w-3xl leading-relaxed">
          {fallbackDesc}
        </p>
      </header>

      <main className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Catálogo Homologado</span>
            <span className="text-xs bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 px-2 py-0.5 rounded-full font-mono">
              {displayList.length} Disponibles
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayList.map((item) => (
            <article
              key={item.id}
              className="bg-neutral-900/60 border border-neutral-800 hover:border-[#ecb613]/50 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col group shadow-xl"
            >
              <div className="relative h-48 overflow-hidden bg-neutral-950">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-[#ecb613] border border-[#ecb613]/30 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {item.badge}
                </span>
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <span>
                      ⭐ {item.rating} ({item.reviews} reseñas)
                    </span>
                    <span className="text-white font-semibold">{item.priceTag}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#ecb613] transition-colors">
                    {item.name}
                  </h3>
                  <ul className="mt-3 space-y-1 text-xs text-neutral-400">
                    {item.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-[#ecb613]">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleCotizarExpress(item.name, item.basePrice)}
                  className="w-full py-2.5 bg-neutral-800 hover:bg-[#ecb613] text-white hover:text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 active:scale-95 shadow-lg"
                >
                  Cotización Express Directa
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BespokeTemplate;