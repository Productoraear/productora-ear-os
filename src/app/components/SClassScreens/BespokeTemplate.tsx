'use client';

import React, { useState, useEffect } from 'react';
import catalogData from '@/data/mariachis_catalog_clean.json';
import { useSharedContext } from '@/app/context/SharedContext';
import { AdjacentMunicipalitiesCrossLinker } from '@/components/geo/AdjacentMunicipalitiesCrossLinker';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';
import { 
  ShieldCheck, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  Edit3,
  Save,
  RotateCcw,
  Check,
  Eye,
  Sliders
} from 'lucide-react';

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
    name: 'Pantallas LED P2.9 High-Refresh 4K (Indoor / Outdoor)',
    badge: 'Hardware S-Class',
    rating: '5.0',
    reviews: 42,
    priceTag: 'Desde 450 €',
    basePrice: 450,
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    features: [
      'Pixel Pitch 2.9mm HDR con brillo 4.500 nits',
      'Procesador de vídeo Novastar 4K sin parpadeo',
      'Montaje homologado en truss con técnico operador in-situ',
      'Garantía de cero fallo eléctrico con cuadro trifásico dedicado'
    ]
  },
  {
    id: 'bose-f1-line-array',
    name: 'Line Array Bose F1 Model 812 + Subwoofer 118SA',
    badge: 'Presión Acústica 12W/pax',
    rating: '4.9',
    reviews: 58,
    priceTag: 'Desde 490 €',
    basePrice: 490,
    img: 'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=800&auto=format&fit=crop',
    features: [
      '4.000 W Peak SPL calibrados para < 75 dB SPL en normativas',
      'Patrón de cobertura vertical en J/C/Straight sin rebotes',
      'Claridad vocal prístina para discursos y música en directo',
      'Cableado libre de oxígeno y conexiones Neutrik speakON'
    ]
  },
  {
    id: 'shure-axient-beta',
    name: 'Microfonía Shure Axient Digital & Cápsula Beta 87A',
    badge: 'Cero Latencia RF',
    rating: '5.0',
    reviews: 35,
    priceTag: 'Desde 220 €',
    basePrice: 220,
    img: 'https://images.unsplash.com/photo-1520523839898-5071282543e2?q=80&w=800&auto=format&fit=crop',
    features: [
      'Cápsula de condensador súpercardioide de alta definición',
      'Gestión automática de frecuencias anti-interferencias 2.4/5GHz',
      'Transmisores inalámbricos con autonomía garantizada de 12 horas',
      'Pértigas y soportes K&M de perfil bajo para ceremonias'
    ]
  }
];

const SERVICES_SCLASS_ITEMS = [
  {
    id: 'edwin-agudelo-solista',
    name: 'Edwin Agudelo — Tenor Lírico & Solista de Gala',
    badge: 'Artista Exclusivo SSOT',
    rating: '5.0',
    reviews: 74,
    priceTag: 'Desde 350 €',
    basePrice: 350,
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    features: [
      'Repertorio Lírico, Boleros de Gala, Rancheras y Pop Lírico',
      'Equipo técnico autónomo Bose S1 Pro / F1 incluido sin coste extra',
      'Split Soberano: 80% Artista / 10% EAR OS / 10% VIMUME',
      'Bloqueo inmutable de fecha con Depósito Stripe 100,00 €'
    ]
  },
  {
    id: 'dj-eventos-sound',
    name: 'DJ de Bodas & Eventos Corporativos S-Class',
    badge: 'Producción Integral',
    rating: '4.9',
    reviews: 53,
    priceTag: 'Desde 390 €',
    basePrice: 390,
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    features: [
      'Cabezas móviles robotizadas Beam & Wash con mesa DMX',
      'Sonido adaptativo sin límites horarios en barra libre',
      'Repertorio 100% acordado con los novios previa reunión técnica',
      'Cabina iluminada de diseño minimalista negro mate'
    ]
  },
  {
    id: 'ensamble-cuerdas-gala',
    name: 'Cuarteto de Cuerdas de Gala & Clásica Contemporánea',
    badge: 'Ceremonia & Cóctel',
    rating: '5.0',
    reviews: 38,
    priceTag: 'Desde 450 €',
    basePrice: 450,
    img: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop',
    features: [
      'Arreglos exclusivos para bandas sonoras, rock épico y clásico',
      'Microfonía inalámbrica DPA para instrumentos acústicos',
      'Uniforme de gala riguroso e integración con el protocolo',
      'Coordinación directa con la finca o el sacerdote/oficiante'
    ]
  }
];

export const BespokeTemplate: React.FC<BespokeTemplateProps> = ({
  category = 'mariachis',
  location: locationProp = 'Madrid',
  province: provinceProp = 'Madrid',
  title: initialTitle,
  description: initialDescription,
  serviceId,
}) => {
  let setIsPricerOpen: ((open: boolean) => void) | undefined;
  try {
    const shared = useSharedContext();
    setIsPricerOpen = shared?.setIsPricerOpen;
  } catch (e) {
    // Salvaguarda
  }

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedPax, setSelectedPax] = useState<number>(120);

  // 🎛️ MODO CONSTRUCTOR VISUAL S-CLASS (DIVI / ELEMENTOR STYLE)
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editableTitle, setEditableTitle] = useState<string>(initialTitle || '');
  const [editableDesc, setEditableDesc] = useState<string>(initialDescription || '');
  const [customPrice, setCustomPrice] = useState<number>(350);
  const [savedAlert, setSavedAlert] = useState<boolean>(false);

  const storageKey = `ear_builder_${serviceId || 'default'}_${locationProp || 'madrid'}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title) setEditableTitle(parsed.title);
        if (parsed.desc) setEditableDesc(parsed.desc);
        if (parsed.price) setCustomPrice(parsed.price);
      }
    } catch (e) {
      // ignore
    }
  }, [storageKey]);

  const handleSaveBlocks = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        title: editableTitle,
        desc: editableDesc,
        price: customPrice,
        pax: selectedPax,
        updatedAt: new Date().toISOString()
      }));
      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 2500);
    } catch (e) {
      console.warn('Error guardando bloques:', e);
    }
  };

  const handleResetBlocks = () => {
    localStorage.removeItem(storageKey);
    setEditableTitle(initialTitle || '');
    setEditableDesc(initialDescription || '');
    setCustomPrice(350);
  };

  const safeLocation = locationProp || provinceProp || 'Madrid';
  const safeProvince = (provinceProp || locationProp || 'madrid').toLowerCase().trim();
  const safeCategory = category || 'mariachis';

  const capitalizedLocation = safeLocation
    ? safeLocation.charAt(0).toUpperCase() + safeLocation.slice(1)
    : 'Madrid';

  const provinceData = PROVINCIAS_52_GRAPH[safeProvince] || PROVINCIAS_52_GRAPH['madrid'];
  const distanceKm = provinceData?.distanceFromHubKm || 60;
  
  // Cálculo logístico S-Class (SSOT: 1,50 €/km desde km 50 + Hotel si > 200km)
  const billableKm = Math.max(0, distanceKm - 50);
  const kmFee = Math.round(billableKm * 1.5);
  const requiresHotel = distanceKm > 200;
  const hotelFee = requiresHotel ? 120 : 0;
  const totalLogistics = kmFee + hotelFee;

  // Cálculo acústico 12W/pax
  const requiredWatts = selectedPax * 12;

  const lowerCat = safeCategory.toLowerCase();
  const lowerServ = (serviceId || '').toLowerCase();

  const isMariachi = /mariachi/.test(lowerCat) || /mariachi/.test(lowerServ);
  const isArsenal = !isMariachi && (/arsenal|tecnico|hardware|pantalla|sonido|audio|luces|iluminacion/.test(lowerCat) || 
                    /arsenal|tecnico|hardware|pantalla|sonido|audio|luces|iluminacion/.test(lowerServ));
  const isDJ = !isMariachi && !isArsenal && (/dj|discoteca/.test(lowerCat) || /dj|discoteca/.test(lowerServ));
  const isCuerdas = !isMariachi && !isArsenal && (/cuerda|violin|clasic|orquesta|filarmon/.test(lowerCat) || /cuerda|violin|clasic|orquesta|filarmon/.test(lowerServ));
  const isSolista = !isMariachi && !isArsenal && (/solista|tenor|bolero|edwin/.test(lowerCat) || /solista|tenor|bolero|edwin/.test(lowerServ));

  let displayList: any[] = [];

  if (isMariachi) {
    const provinceMatches = catalogData.filter((item) => {
      const isItemMariachi = item.category.toLowerCase() === 'mariachis';
      const matchesProvince = item.provinces.some(
        (p) => p.toLowerCase() === safeProvince || safeProvince.includes(p.toLowerCase()) || p.toLowerCase() === 'todas'
      );
      return isItemMariachi && matchesProvince;
    });
    displayList = provinceMatches.length > 0 ? provinceMatches : catalogData.filter(i => i.category.toLowerCase() === 'mariachis');
  } else if (isArsenal) {
    displayList = ARSENAL_HARDWARE_ITEMS;
  } else if (isDJ) {
    displayList = SERVICES_SCLASS_ITEMS.filter(item => item.id.includes('dj'));
  } else if (isCuerdas) {
    displayList = SERVICES_SCLASS_ITEMS.filter(item => item.id.includes('cuerdas'));
  } else if (isSolista) {
    displayList = SERVICES_SCLASS_ITEMS.filter(item => item.id.includes('edwin'));
  } else {
    const matchedCategory = catalogData.filter(item => item.category.toLowerCase() === lowerCat);
    if (matchedCategory.length > 0) {
      const provFiltered = matchedCategory.filter(item => 
        item.provinces.some(p => p.toLowerCase() === safeProvince || safeProvince.includes(p.toLowerCase()) || p.toLowerCase() === 'todas')
      );
      displayList = provFiltered.length > 0 ? provFiltered : matchedCategory;
    } else {
      displayList = SERVICES_SCLASS_ITEMS;
    }
  }

  const basePriceCandidate = customPrice || displayList[0]?.basePrice || 350;

  const handleCotizarExpress = (itemName: string, basePrice: number) => {
    if (typeof setIsPricerOpen === 'function') {
      setIsPricerOpen(true);
    } else {
      const text = encodeURIComponent(
        `Hola Edwin, deseo formalizar la reserva S-Class para ${itemName} en ${capitalizedLocation}.\n\n` +
        `• Invitados: ${selectedPax} pax (Potencia: ${requiredWatts} W RMS)\n` +
        `• Tarifa Base: ${basePrice} €\n` +
        `• Logística desde Méntrida (${distanceKm} km): +${totalLogistics} €\n` +
        `• Depósito de Bloqueo Inmediato: 100,00 € (Price-Lock SHA-256)\n` +
        `• Split Soberano: 80% Artista / 10% EAR OS / 10% VIMUME\n\n` +
        `Por favor confírmame disponibilidad para formalizar el enlace de pago.`
      );
      window.open(`https://wa.me/34693693048?text=${text}`, '_blank');
    }
  };

  // Hormozi $100M Grand Slam Value Stack
  const valueStackItems = [
    { label: `${editableTitle || initialTitle || safeCategory} — Ejecución Artística / Técnica Homologada`, value: basePriceCandidate },
    { label: 'Rider Acústico 12 W/pax Bose F1 / Shure Beta 87A (Sin alquiler externo)', value: 490 },
    { label: 'Certificado de Calibración Acústica < 75 dB SPL (Anti-Sanciones Fincas)', value: 180 },
    { label: 'Póliza de Responsabilidad Civil de 1.000.000 € (Cobertura Directa)', value: 150 },
    { label: 'Gestión Logística Integral desde Hub Méntrida (Puntualidad 100% Cero Fallo)', value: 120 },
    { label: 'Certificado VIMUME 10% Impacto Social (Deducible 80% IRPF / 50% IS)', value: 200 },
  ];
  const totalValueStack = valueStackItems.reduce((acc, curr) => acc + curr.value, 0);

  // Preguntas Frecuentes Reales (FAQ Schema)
  const faqs = [
    {
      q: `¿Cómo funciona la reserva con el Depósito de 100 € (Price-Lock)?`,
      a: `El depósito de 100,00 € mediante Stripe congela la fecha y la tarifa acordada de forma inmutable durante 72 horas mediante firma digital. El resto del importe se liquida según el contrato y se distribuye con el Split Soberano (80% Artista / 10% EAR OS / 10% VIMUME).`
    },
    {
      q: `¿Qué ocurre si la finca tiene limitaciones de sonido o vecinos cercanos?`,
      a: `Cumplimos estrictamente la normativa municipal y el estándar < 75 dB SPL. Nuestro sistema acústico Bose F1 / S1 Pro entrega 12 W/pax con direccionamiento ultra-preciso en sala, garantizando máxima inteligibilidad y emoción sin superar los límites legales.`
    },
    {
      q: `¿Cómo se calcula la logística desde el Hub Central en Méntrida (Toledo)?`,
      a: `La logística está completamente estandarizada: 1,50 €/km a partir del km 50. Para distancias superiores a 200 km o actuaciones que finalizan después de las 3:00 AM, se aplica un suplemento fijo de hotel de 120 € para garantizar la seguridad del equipo.`
    },
    {
      q: `¿Qué ventaja fiscal tiene el 10% aportado a VIMUME?`,
      a: `El 10% de cada contratación financia sesiones de neuro-musicoterapia para personas mayores con demencia en residencias (Ley 49/2002). Puedes solicitar el Certificado Modelo 182 de la AEAT para deducir hasta el 80% de esta aportación en tu IRPF o 40%-50% en Impuesto de Sociedades.`
    }
  ];

  // Microdata JSON-LD Estructurado
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': editableTitle || initialTitle || `${safeCategory} en ${capitalizedLocation}`,
    'description': editableDesc || initialDescription || `Servicios de ${safeCategory} en ${capitalizedLocation} con infraestructura técnica directa, sonido Bose 12W/pax y póliza de 1M€.`,
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Productora EAR',
      'telephone': '+34693693048',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': capitalizedLocation,
        'addressRegion': provinceData?.name || 'Madrid',
        'addressCountry': 'ES'
      },
      'priceRange': '€€€',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.98',
        'reviewCount': '142'
      }
    },
    'offers': {
      '@type': 'Offer',
      'price': basePriceCandidate.toString(),
      'priceCurrency': 'EUR',
      'availability': 'https://schema.org/InStock',
      'validFrom': '2026-01-01'
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans selection:bg-[#ecb613] selection:text-black relative">
      {/* 📡 INYECCIÓN DE SCHEMA JSON-LD PARA GOOGLE & AI SGE */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 🎛️ DOCK DE EDICIÓN VISUAL TIPO ELEMENTOR / DIVI S-CLASS */}
      <aside className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-neutral-900/95 border border-[#ecb613]/50 p-2 rounded-2xl shadow-2xl backdrop-blur-xl">
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
            isEditMode ? 'bg-[#ecb613] text-black shadow-lg' : 'bg-neutral-800 text-white hover:bg-neutral-700'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          {isEditMode ? 'Modo Constructor ON' : 'Editar Bloques'}
        </button>

        {isEditMode && (
          <>
            <button
              onClick={handleSaveBlocks}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md active:scale-95"
              title="Guardar Bloques"
            >
              <Save className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetBlocks}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs"
              title="Restablecer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {savedAlert && (
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 pl-1 pr-2 animate-bounce">
            <Check className="w-3 h-3" /> Guardado
          </span>
        )}
      </aside>

      {/* 🏆 HEADER S-CLASS HERO */}
      <header className="relative border-b border-neutral-900 bg-gradient-to-b from-[#08080c] to-[#030305] pt-12 pb-16 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 bg-[#ecb613]/10 border border-[#ecb613]/30 px-3.5 py-1.5 rounded-full">
              <span className="h-2 w-2 rounded-full bg-[#ecb613] animate-pulse"></span>
              <span className="text-xs font-mono font-bold tracking-widest text-[#ecb613] uppercase">
                COBERTURA OFICIAL {capitalizedLocation.toUpperCase()} · HUB MÉPOS
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" /> Póliza RC 1.000.000 €
              </span>
              <span className="flex items-center gap-1 text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-md">
                <Volume2 className="w-3.5 h-3.5" /> 12 W/pax Bose F1
              </span>
            </div>
          </div>

          {/* TÍTULO EDITABLE EN VIVO */}
          {isEditMode ? (
            <div className="space-y-1 mb-4">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> Bloque de Título Principal (Editable)
              </span>
              <input
                type="text"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                placeholder="Título de la Landing..."
                className="w-full text-3xl md:text-5xl font-black bg-neutral-900 border-2 border-[#ecb613] p-3 rounded-xl text-white font-serif uppercase tracking-tight focus:outline-none"
              />
            </div>
          ) : (
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-tight font-serif">
              {editableTitle || initialTitle ? (
                editableTitle || initialTitle
              ) : (
                <>
                  {safeCategory} en{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-amber-400">
                    {capitalizedLocation}
                  </span>
                </>
              )}
            </h1>
          )}

          {/* DESCRIPCIÓN EDITABLE EN VIVO */}
          {isEditMode ? (
            <div className="space-y-1 mt-3">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> Bloque de Descripción y Copywriting (Editable)
              </span>
              <textarea
                rows={3}
                value={editableDesc}
                onChange={(e) => setEditableDesc(e.target.value)}
                placeholder="Descripción del servicio..."
                className="w-full text-sm md:text-base bg-neutral-900 border-2 border-[#ecb613]/80 p-3 rounded-xl text-neutral-200 focus:outline-none"
              />
            </div>
          ) : (
            <p className="text-neutral-300 mt-5 text-base md:text-xl max-w-3xl leading-relaxed font-light">
              {editableDesc || initialDescription || (
                `Infraestructura técnica directa, artistas de conservatorio y ejecución logística homologada en ${capitalizedLocation}. Presupuestos cerrados sin sobrecostes ocultos con Split Soberano 80/10/10 y reserva blindada de 100 €.`
              )}
            </p>
          )}

          {/* ⚡ SIMULADOR LOGÍSTICO & ACÚSTICO INTERACTIVO */}
          <div className="mt-8 bg-neutral-900/80 border border-neutral-800 p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 backdrop-blur-md">
            <div>
              <div className="text-xs font-mono text-neutral-400 uppercase">Hub Logístico</div>
              <div className="text-sm font-bold text-white mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#ecb613]" /> Méntrida ➔ {capitalizedLocation}
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">{distanceKm} km (+{totalLogistics} € transporte)</div>
            </div>

            <div>
              <div className="text-xs font-mono text-neutral-400 uppercase">Aforo / Invitados</div>
              <div className="flex items-center gap-2 mt-1">
                <input 
                  type="range" 
                  min="50" 
                  max="500" 
                  step="10" 
                  value={selectedPax} 
                  onChange={(e) => setSelectedPax(Number(e.target.value))}
                  className="w-24 accent-[#ecb613] cursor-pointer"
                />
                <span className="text-sm font-mono font-bold text-[#ecb613]">{selectedPax} pax</span>
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">{requiredWatts} W RMS Calibrados</div>
            </div>

            <div>
              <div className="text-xs font-mono text-neutral-400 uppercase">Garantía Acústica</div>
              <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> &lt; 75 dB SPL Homologado
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">Cero multas en finca</div>
            </div>

            <div className="flex flex-col justify-center">
              <button
                onClick={() => handleCotizarExpress(displayList[0]?.name || 'Servicio S-Class', basePriceCandidate)}
                className="w-full py-2.5 bg-gradient-to-r from-[#ecb613] to-amber-500 hover:from-amber-400 hover:to-[#ecb613] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" /> Bloquear (100 €)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 📦 CONTENIDO PRINCIPAL Y CATÁLOGO */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12 space-y-16">
        {/* CATÁLOGO DE OPCIONES HOMOLOGADAS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-serif">
                <span>Catálogo Oficial Homologado</span>
                <span className="text-xs bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {displayList.length} Formatos S-Class
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Garantía técnica directa sin agencias intermediarias parásitas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayList.map((item) => (
              <article
                key={item.id}
                className="bg-neutral-900/50 border border-neutral-800/80 hover:border-[#ecb613]/60 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col group shadow-2xl hover:-translate-y-1"
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
                      <span>⭐ {item.rating} ({item.reviews} reseñas)</span>
                      <span className="text-white font-bold font-mono text-sm">{item.priceTag}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#ecb613] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <ul className="mt-3 space-y-1.5 text-xs text-neutral-300">
                      {item.features.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#ecb613] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => handleCotizarExpress(item.name, item.basePrice)}
                    className="w-full py-3 bg-neutral-800 hover:bg-[#ecb613] text-white hover:text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all duration-300 active:scale-95 shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Reservar con Price-Lock</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 💎 HORMOZI $100M GRAND SLAM VALUE STACK */}
        <section className="bg-gradient-to-br from-neutral-900/90 to-neutral-950 border border-neutral-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#ecb613]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#ecb613] uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" /> Oferta de Valor Total (Sin Trampa ni Cartón)
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase font-serif">
              Lo que recibes al contratar en Productora EAR
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              Compara este desglose con cualquier agencia tradicional que te cobraría cada concepto por separado:
            </p>

            <div className="mt-6 space-y-3">
              {valueStackItems.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-neutral-900/60 border border-neutral-800/80 rounded-xl text-xs md:text-sm">
                  <div className="flex items-center gap-2.5 text-neutral-200">
                    <CheckCircle2 className="w-4 h-4 text-[#ecb613] shrink-0" />
                    <span>{v.label}</span>
                  </div>
                  <div className="font-mono text-neutral-400 line-through shrink-0 ml-4">
                    {v.value} €
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs text-neutral-400 uppercase font-mono">Valor Total de Mercado:</div>
                <div className="text-2xl font-black text-neutral-400 line-through font-mono">{totalValueStack} €</div>
                <div className="text-xs text-emerald-400 font-bold mt-0.5">Tu Tarifa Oficial Directa: desde {basePriceCandidate} €</div>
              </div>

              <button
                onClick={() => handleCotizarExpress(displayList[0]?.name || 'Pack Completo', basePriceCandidate)}
                className="px-6 py-3.5 bg-[#ecb613] hover:bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl active:scale-95 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" /> Bloquear Fecha con 100 €
              </button>
            </div>
          </div>
        </section>

        {/* ⚖️ EL ESCUDO DE VALOR: SPLIT SOBERANO 80/10/10 */}
        <section className="border border-neutral-800 bg-neutral-950/60 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-2xl font-black text-[#ecb613] font-mono">80%</div>
            <div className="text-sm font-bold text-white uppercase">Artista Ejecutor</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Retribución soberana directa sin intermediarios. El 80% neto va íntegro a los músicos y técnicos in-situ.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-black text-white font-mono">10%</div>
            <div className="text-sm font-bold text-white uppercase">Infraestructura EAR OS</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Cero cuotas fijas. Cubre pasarela segura Stripe SHA-256, telemetría acústica y soporte técnico de guardia 24/7.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-black text-emerald-400 font-mono">10%</div>
            <div className="text-sm font-bold text-emerald-400 uppercase">Impacto Social VIMUME</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Financia neuro-musicoterapia para personas mayores con demencia. Deducible hasta 80% en IRPF / 50% IS (Modelo 182 AEAT).
            </p>
          </div>
        </section>

        {/* ❓ PREGUNTAS FRECUENTES (FAQ INTERACTIVAS) */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white font-serif uppercase">
            Preguntas Frecuentes · Seguridad y Transparencia
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-neutral-800 bg-neutral-900/40 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-white hover:text-[#ecb613] transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-[#ecb613]" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

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