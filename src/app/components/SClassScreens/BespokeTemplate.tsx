'use client';

import React from 'react';
import catalogData from '@/data/mariachis_catalog_clean.json';
import { useSharedContext } from '@/app/context/SharedContext';
import { AdjacentMunicipalitiesCrossLinker } from '@/components/geo/AdjacentMunicipalitiesCrossLinker';

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

const ARSENAL_HARDWARE_ITEMS = [
  {
    id: 'pantallas-led-p29',
    name: 'Pantallas LED P2.9 High-Refresh 4K',
    badge: 'Hardware S-Class',
    rating: '5.0',
    reviews: 38,
    priceTag: 'Desde 450 €',
    basePrice: 450,
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    features: ['Pixel Pitch 2.9mm HDR', 'Procesador Novastar 4K', 'Técnico in-situ y montaje homologado']
  },
  {
    id: 'bose-f1-line-array',
    name: 'Line Array Bose F1 Model 812 + Sub 118SA',
    badge: 'Presión Acústica 12W/pax',
    rating: '4.9',
    reviews: 52,
    priceTag: 'Desde 490 €',
    basePrice: 490,
    img: 'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=800&auto=format&fit=crop',
    features: ['4.000 W Peak SPL', 'Patrón de cobertura vertical ajustable', 'Sin fatiga auditiva']
  },
  {
    id: 'shure-axient-beta',
    name: 'Microfonía Shure Axient Digital & Beta 87A',
    badge: 'Cero Latencia RF',
    rating: '5.0',
    reviews: 29,
    priceTag: 'Desde 220 €',
    basePrice: 220,
    img: 'https://images.unsplash.com/photo-1520523839898-5071282543e2?q=80&w=800&auto=format&fit=crop',
    features: ['Cápsula de condensador súpercardioide', 'Cero interferencias garantizado', 'Transmisores recargables']
  }
];

const SERVICES_SCLASS_ITEMS = [
  {
    id: 'edwin-agudelo-solista',
    name: 'Edwin Agudelo — Tenor Lírico & Solista Imperial',
    badge: 'Artista Exclusivo',
    rating: '5.0',
    reviews: 64,
    priceTag: 'Desde 350 €',
    basePrice: 350,
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    features: ['Repertorio Lírico, Ópera & Bolero', 'Equipo técnico Bose F1 incluido', 'Split Soberano']
  },
  {
    id: 'dj-eventos-sound',
    name: 'DJ de Bodas & Eventos Corporativos S-Class',
    badge: 'Producción Integral',
    rating: '4.9',
    reviews: 47,
    priceTag: 'Desde 390 €',
    basePrice: 390,
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    features: ['Cabezas móviles Beam & Wash', 'Sonido adaptativo sin límites horarios', 'Música 100% personalizada']
  },
  {
    id: 'ensamble-cuerdas-gala',
    name: 'Cuarteto de Cuerdas de Gala & Clásica',
    badge: 'Ceremonia & Cóctel',
    rating: '5.0',
    reviews: 31,
    priceTag: 'Desde 450 €',
    basePrice: 450,
    img: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop',
    features: ['Arreglos para música moderna y clásica', 'Microfonía inalámbrica de arco', 'Uniforme de etiqueta']
  }
];

export const BespokeTemplate: React.FC<BespokeTemplateProps> = ({
  category = 'mariachis',
  location: locationProp = 'Madrid',
  province: provinceProp = 'Madrid',
  title,
  description,
  serviceId,
}) => {
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

  const isArsenal = /arsenal|tecnico|hardware|pantalla|sonido|audio|luces|iluminacion/.test(safeCategory.toLowerCase()) || 
                    /arsenal|tecnico|hardware|pantalla|sonido|audio/.test((serviceId || '').toLowerCase());
  const isServices = /servicio|artista|solista|dj|musica/.test(safeCategory.toLowerCase()) || 
                     /servicio|artista|solista|dj|musica/.test((serviceId || '').toLowerCase());

  let displayList: any[] = [];

  if (isArsenal) {
    displayList = ARSENAL_HARDWARE_ITEMS;
  } else if (isServices && !/mariachi/.test(safeCategory.toLowerCase())) {
    displayList = SERVICES_SCLASS_ITEMS;
  } else {
    const filteredCatalog = catalogData.filter((item) => {
      const matchesCategory = item.category.toLowerCase() === safeCategory.toLowerCase();
      const matchesProvince = item.provinces.some(
        (p) => p.toLowerCase() === safeProvince || safeProvince.includes(p.toLowerCase())
      );
      return matchesCategory && matchesProvince;
    });
    displayList = filteredCatalog.length > 0 ? filteredCatalog : catalogData;
  }

  const handleCotizarExpress = (itemName: string, basePrice: number) => {
    if (typeof setIsPricerOpen === 'function') {
      setIsPricerOpen(true);
    } else {
      const text = encodeURIComponent(
        `Hola Productora EAR, deseo cotización express para ${itemName} (${safeCategory.toUpperCase()}) en ${capitalizedLocation}. Precio estimado: desde ${basePrice}€.`
      );
      window.open(`https://wa.me/34693693048?text=${text}`, '_blank');
    }
  };

  const fallbackDesc =
    'Infraestructura técnica directa, operadores homologados y reserva con garantía en ' +
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
          {title ? (
            title
          ) : (
            <>
              {safeCategory} en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-amber-100">
                {capitalizedLocation}
              </span>
            </>
          )}
        </h1>
        <p className="text-neutral-400 mt-4 text-lg max-w-3xl leading-relaxed">
          {description || fallbackDesc}
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
                    {item.features.map((f: string, i: number) => (
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

        {/* 🗺️ MALLA DE ENLAZADO INTERNO DINÁMICO (CROSS-LINKING REGIONAL) */}
        <AdjacentMunicipalitiesCrossLinker
          currentProvince={provinceProp || locationProp || 'madrid'}
          currentLocation={locationProp || 'Madrid'}
          currentServiceSlug={serviceId || 'mariachi-gala'}
        />
      </main>
    </div>
  );
};

export default BespokeTemplate;