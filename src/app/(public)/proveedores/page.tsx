'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  PhoneCall, 
  Camera, 
  X, 
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
  Loader2,
  Lock,
  Zap,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import rawProvidersData from '@/data/curated_providers.json';
import activeWhitelist from '@/data/active_providers_whitelist.json';
import { CENTRALITA } from '@/lib/phone-constants';
import { ClaimProviderModal } from '@/components/providers/ClaimProviderModal';
import { BentoProviderCard, ProviderItem } from '@/components/providers/BentoProviderCard';
import { BentoFilterBar, CategoryItem } from '@/components/providers/BentoFilterBar';
import { PremiumMediaCarousel } from '@/components/providers/PremiumMediaCarousel';
import { PremiumPacksCarousel } from '@/components/providers/PremiumPacksCarousel';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ARTISTA SOBERANO S-CLASS: EDWIN AGUDELO (PRIORIDAD PERMANENTE #1)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SOVEREIGN_EDWIN_AGUDELO: ProviderItem = {
  id: 'prov-ear-sovereign-01',
  name: 'Productora EAR • Edwin Agudelo',
  slug: 'edwin-agudelo',
  category: 'musica',
  province: 'Madrid',
  description: 'Show musical en vivo de 1 hora (2 pases de 30 min), sonido profesional Bose F1 812 / S1 Pro, microfonía Shure Beta 87A, ramo de flores en vivo, canción personalizada y sesión de fotos con sombreros temáticos. Artista Solista S-Class.',
  price: '350,00 €',
  rating: 5.0,
  reviews: 128,
  img: 'https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg',
  isPreferred: true,
  badge: 'SOLISTA S-CLASS',
  customUrl: '/artistas/edwin-agudelo'
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NORMALIZADOR SEMÁNTICO S-CLASS: COBERTURA 100% SOBRE 26.763 NODOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function normalizeCategory(inputCat: string | null | undefined, description?: string, name?: string): string {
  const l = (inputCat || '').toLowerCase().trim();
  const d = (description || '').toLowerCase();
  const n = (name || '').toLowerCase();
  const full = `${l} ${d} ${n}`;

  // 1. Fotografía y Vídeo
  if (full.includes('fotograf') || full.includes('videograf') || full.includes('videomatón') || full.includes('fotomatón') || l.includes('foto') || l.includes('video')) {
    return 'foto';
  }
  // 2. Moda y Belleza
  if (full.includes('traje') || full.includes('vestid') || full.includes('madrina') || full.includes('joyer') || full.includes('joyas') || full.includes('tocado') || full.includes('atelier') || full.includes('peluquer') || full.includes('maquillaj') || l.includes('moda') || l.includes('belleza')) {
    return 'moda';
  }
  // 3. Transporte y Vehículos
  if (full.includes('coche') || full.includes('limusina') || full.includes('autobus') || full.includes('autobús') || full.includes('chofer') || l.includes('transporte')) {
    return 'transporte';
  }
  // 4. Música en Vivo (Artistas, Bandas, Mariachis, Solistas)
  if (full.includes('musica') || full.includes('música') || full.includes('mariachi') || full.includes('banda') || full.includes('orquesta') || full.includes('solista') || full.includes('cantante') || full.includes('violin') || full.includes('gospel') || full.includes('grupo musical')) {
    return 'musica';
  }
  // 5. Audiovisual, Sonido, Luces & DJ
  if (full.includes('audio') || full.includes('sonido') || full.includes('luces') || full.includes('iluminac') || full.includes('dj') || full.includes('discomovil') || full.includes('discomóvil') || full.includes('arsenal')) {
    return 'sonido';
  }
  // 6. Fincas & Espacios (Cortijos, Haciendas, Masías, Salones, Palacios, Castillos)
  if (full.includes('finca') || full.includes('cortijo') || full.includes('hacienda') || full.includes('masía') || full.includes('masia') || full.includes('casa rural') || full.includes('salon') || full.includes('salón') || full.includes('palacio') || full.includes('castillo') || l.includes('espacio')) {
    return 'finca';
  }
  // 7. Wedding Planners & Organización
  if (full.includes('wedding') || full.includes('planner') || full.includes('organizac') || full.includes('coordinac')) {
    return 'wedding';
  }
  // 8. Decoración & Floristería
  if (full.includes('decor') || full.includes('flor') || full.includes('ambientac')) {
    return 'decoracion';
  }
  // 9. Catering & Gastronomía
  if (l.includes('cater') || full.includes('banquete') || full.includes('gastro') || full.includes('comida') || full.includes('paella') || full.includes('restaurante')) {
    return 'catering';
  }

  return 'servicios';
}

function makeWaLink(phone: string, name: string): string {
  const cleanPhone = (phone || '').replace(/[^\d+]/g, '');
  const waNum = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : (cleanPhone.startsWith('34') ? cleanPhone : `34${cleanPhone || '693693048'}`);
  const msg = `Hola ${name}, os contacto a través de la plataforma Productora EAR para consultar disponibilidad y condiciones de contratación bajo el protocolo Split 80/10/10 y reserva con depósito de 100 €.`;
  return `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`;
}

function ProveedoresDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCat = searchParams.get('cat') || searchParams.get('categoria') || searchParams.get('category');
  const urlProv = searchParams.get('provincia') || searchParams.get('prov') || searchParams.get('location') || '';
  const urlQ = searchParams.get('q') || searchParams.get('search') || '';

  const initialCat = urlCat ? normalizeCategory(urlCat) : 'ALL';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedProvince, setSelectedProvince] = useState<string>(urlProv);
  const [searchQuery, setSearchQuery] = useState<string>(urlQ);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeModalProvider, setActiveModalProvider] = useState<ProviderItem | null>(null);
  const [activeGalleryImg, setActiveGalleryImg] = useState<string>('');
  const [claimModalProvider, setClaimModalProvider] = useState<any>(null);
  const [modalTab, setModalTab] = useState<'info' | 'faqs' | 'services' | 'garantia'>('info');

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
  
  // Blindaje de Deduplicación, Whitelist CEO y Anti-Slop en Runtime S-Class
  const providersData = useMemo(() => {
    const activeIds = new Set((activeWhitelist.active_ids || []).map(x => x.toLowerCase().trim()));
    const activeSlugs = new Set((activeWhitelist.active_slugs || []).map(x => x.toLowerCase().trim()));

    const raw = rawProvidersData as unknown as ProviderItem[];
    const seen = new Set<string>();

    // Edwin Agudelo encabeza siempre con prioridad soberana #1
    const sanitized: ProviderItem[] = [SOVEREIGN_EDWIN_AGUDELO];
    seen.add('prov-ear-sovereign-01');
    seen.add('edwin-agudelo');
    seen.add('productoraearedwinagudelo');

    for (const p of raw) {
      if (!p || !p.name) continue;
      const lowerName = p.name.toLowerCase().trim();
      const pId = String(p.id || '').toLowerCase().trim();
      const pSlug = String(p.slug || (p as any).atomic_specs?.slug || '').toLowerCase().trim();

      // Veto estricto anti-slop y proveedores corruptos/no deseados
      if (
        lowerName.includes('peke teso') ||
        pId.includes('peke-teso') ||
        pSlug.includes('peke-teso') ||
        pId === 'prov-6' ||
        lowerName.includes('100 apodos') ||
        pSlug.includes('100-apodos') ||
        lowerName.startsWith('partner ') ||
        lowerName.startsWith('antes de la boda') ||
        lowerName.startsWith('crónicas de boda') ||
        lowerName.startsWith('crnicas de boda') ||
        lowerName.startsWith('después de la boda') ||
        lowerName.startsWith('promociones de ') ||
        lowerName.startsWith('invitaciones de ') ||
        lowerName.startsWith('organiza tu boda') ||
        lowerName.startsWith('descárgate la app')
      ) {
        continue;
      }

      // Mandato CEO S-Class: Política de Visibilidad Ética y Blindada
      const isOpenDirectory = (activeWhitelist as any).policy === 'OPEN_DIRECTORY_WITH_OPTOUT';
      const isEdwin = pId === 'prov-53' || lowerName.includes('edwin agudelo') || lowerName.includes('productora ear');
      const isWhitelisted = activeIds.has(pId) || Boolean(pSlug && activeSlugs.has(pSlug));

      if (!isOpenDirectory && !isEdwin && !isWhitelisted) {
        // PERMANECE OCULTO SOLO SI LA POLÍTICA ES DENY_ALL_EXCEPT_WHITELIST
        continue;
      }

      const normKey = lowerName.replace(/[^a-z0-9]/g, '');
      if (seen.has(normKey) || seen.has(pId) || (pSlug && seen.has(pSlug))) continue;
      seen.add(normKey);
      if (pId) seen.add(pId);
      if (pSlug) seen.add(pSlug);

      // Rescate y normalización profunda de campos (SOTA Omega)
      const pSpecs = (p as any).atomic_specs || {};
      const rawCover = p.img || pSpecs.media?.coverImage || (p as any).image || (p.gallery && p.gallery[0]) || '';
      const rawGallery = (p.gallery && p.gallery.length > 0) ? p.gallery : (pSpecs.media?.gallery || (rawCover ? [rawCover] : []));
      const rawDesc = p.description || p.description_full || pSpecs.description || pSpecs.description_full || '';
      const rawPhone = (p as any).phone || (p as any).telephone || (pSpecs as any).phone || '';
      const rawProv = pSpecs.province || (p.province && p.province !== 'None' ? p.province : '') || pSpecs.city || (p as any).locality || (p as any).location || '';
      const rawPrice = p.basePrice || pSpecs.pricing?.rentalBasePrice || (typeof p.price === 'number' ? p.price : null);
      const rawRating = Number(pSpecs.metrics?.rating || p.rating || 0);
      const rawReviews = Number(pSpecs.metrics?.reviewCount || p.reviews || 0);
      const normCat = normalizeCategory(p.category || pSpecs.category, rawDesc, p.name);
      const rawFaqs = (p as any).faqs || pSpecs.faqs || {};
      const rawServices = (p as any).services_list || pSpecs.services_list || pSpecs.services || [];
      const rawAddress = (p as any).address || pSpecs.address || '';

      const enhancedProvider: ProviderItem = {
        ...p,
        category: normCat,
        province: rawProv ? String(rawProv).trim().charAt(0).toUpperCase() + String(rawProv).trim().slice(1) : '',
        description: rawDesc,
        description_full: p.description_full || pSpecs.description_full || rawDesc, ['phone' as string]: rawPhone ? String(rawPhone).trim() : '',
        ['phone' as string]: rawPhone ? String(rawPhone).trim() : '',
        img: rawCover,
        gallery: Array.isArray(rawGallery) ? rawGallery : [rawCover],
        basePrice: rawPrice,
        price: rawPrice ? `${rawPrice} €` : 'Consultar',
        rating: isNaN(rawRating) || rawRating === 0 ? undefined : rawRating,
        reviews: isNaN(rawReviews) || rawReviews === 0 ? undefined : rawReviews,
        ['faqs' as string]: rawFaqs,
        ['services_list' as string]: Array.isArray(rawServices) ? rawServices : [],
        ['address' as string]: rawAddress,
        ['atomic_specs' as string]: pSpecs,
        isPreferred: Boolean(isEdwin || isWhitelisted),
        badge: isEdwin 
          ? 'SOLISTA S-CLASS' 
          : isWhitelisted 
            ? 'VERIFICADO S-CLASS' 
            : 'DIRECTORIO HOMOLOGADO'
      };

      sanitized.push(enhancedProvider);
    }
    return sanitized;
  }, []);

  // Conteos semánticos precalculados para evitar cualquier '0'
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: providersData.length,
      finca: 0,
      catering: 0,
      decoracion: 0,
      musica: 0,
      sonido: 0,
      foto: 0,
      wedding: 0,
      moda: 0,
      transporte: 0,
      servicios: 0,
    };

    for (const p of providersData) {
      const catKey = normalizeCategory(p.category, p.description, p.name);
      if (counts[catKey] !== undefined) {
        counts[catKey]++;
      } else {
        counts.servicios++;
      }
    }
    return counts;
  }, [providersData]);

  const categories: CategoryItem[] = [
    { id: 'ALL', label: 'Todos los Servicios', count: categoryCounts.ALL, icon: Layers },
    { id: 'finca', label: 'Fincas & Espacios', count: categoryCounts.finca, icon: Building2 },
    { id: 'catering', label: 'Catering & Gastro', count: categoryCounts.catering, icon: UtensilsCrossed },
    { id: 'decoracion', label: 'Decoración & Flores', count: categoryCounts.decoracion, icon: Flower2 },
    { id: 'musica', label: 'Música & Mariachi', count: categoryCounts.musica, icon: Music2 },
    { id: 'sonido', label: 'Sonido & Luces', count: categoryCounts.sonido, icon: Volume2 },
    { id: 'foto', label: 'Vídeo 4K & Foto', count: categoryCounts.foto, icon: Video },
    { id: 'wedding', label: 'Wedding Planners', count: categoryCounts.wedding, icon: HeartHandshake },
    { id: 'moda', label: 'Moda & Belleza', count: categoryCounts.moda, icon: Shirt },
    { id: 'transporte', label: 'Transporte & Coches', count: categoryCounts.transporte, icon: Car },
    { id: 'servicios', label: 'Servicios Integrales', count: categoryCounts.servicios, icon: Sparkles },
  ];

  // Lista de provincias únicas ordenadas
  const provincesList = useMemo(() => {
    const pSet = new Set<string>();
    for (const p of providersData) {
      if (p.province && p.province.trim()) {
        pSet.add(p.province.trim());
      }
    }
    return Array.from(pSet).sort((a, b) => a.localeCompare(b));
  }, [providersData]);

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
    const sclassSpecialServices: ProviderItem[] = [
      {
        id: 'sclass-arroces-showcooking',
        name: 'Maestros Arroceros S-Class: Showcooking de Paellas Gigantes',
        category: 'catering',
        province: 'Madrid',
        description: 'Puesto gastronómico monumental en directo con leña de sarmiento. 10 recetas maestras: Arroz del Senyoret, Carabinero XL, Gamba Roja, Fideuà Gandiense y Arroz Negro. Desde 30 a 2.000 pax. Incluye sonido Bose S1 Pro de cortesía.',
        price: '16,50 €/pax',
        rating: 5.0,
        reviews: 64,
        img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
        isPreferred: true,
        badge: 'SHOWCOOKING S-CLASS',
        customUrl: '/arroces'
      },
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
        badge: 'HOMOLOGADO S-CLASS',
        customUrl: '/catering-brasas'
      }
    ];

    const activeSpecial = sclassSpecialServices.filter(s => {
      const activeIds = new Set((activeWhitelist.active_ids || []).map(x => x.toLowerCase().trim()));
      return activeIds.has(String(s.id).toLowerCase());
    });

    const baseList = selectedCategory === 'catering' || selectedCategory === 'ALL'
      ? [...activeSpecial, ...providersData]
      : providersData;

    return baseList.filter((p) => {
      // 1. Filtrado Semántico de Categoría (Cero resultados perdidos)
      if (selectedCategory !== 'ALL') {
        const catNormalized = normalizeCategory(p.category, p.description, p.name);
        if (catNormalized !== selectedCategory) {
          return false;
        }
      }

      // 2. Filtrado de Provincia
      if (selectedProvince) {
        const prov = (p.province || '').toLowerCase();
        if (!prov.includes(selectedProvince.toLowerCase())) {
          return false;
        }
      }

      // 3. Filtrado de Búsqueda Inteligente
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (p.name || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const prov = (p.province || '').toLowerCase();

        if (!name.includes(q) && !desc.includes(q) && !cat.includes(q) && !prov.includes(q)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (a.isPreferred && !b.isPreferred) return -1;
      if (!a.isPreferred && b.isPreferred) return 1;
      return 0;
    });
  }, [providersData, selectedCategory, selectedProvince, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProviders.length / pageSize));
  const paginatedProviders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProviders.slice(start, start + pageSize);
  }, [filteredProviders, currentPage]);

  const openModal = (provider: ProviderItem) => {
    setActiveModalProvider(provider);
    setActiveGalleryImg(provider.img || provider.gallery?.[0] || '');
    setModalTab('info');
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans selection:bg-[#258DCD] selection:text-black w-full overflow-x-hidden">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HEADER S-CLASS COMPACTO CON MIGAS DE PAN (DE UN VISTAZO)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="max-w-7xl mx-auto px-4 pt-24 md:pt-28 pb-4 mb-4 space-y-3">
        {/* Breadcrumb de navegación */}
        <nav aria-label="Migas de pan" className="flex items-center gap-2 font-mono text-[11px] text-white/50">
          <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/proveedores" className="text-white hover:underline font-bold">Proveedores</Link>
          {selectedCategory !== 'ALL' && (
            <>
              <span>/</span>
              <span className="text-[#AAD6CD] uppercase font-bold">{selectedCategory}</span>
            </>
          )}
          {selectedProvince && (
            <>
              <span>/</span>
              <span className="text-[#FF2B44] uppercase font-bold">{selectedProvince}</span>
            </>
          )}
        </nav>

        <div className="bg-[#08080c] border border-neutral-800 hover:border-[#258DCD]/40 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-xl transition-colors">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-b from-[#258DCD]/10 to-transparent blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-[#258DCD]/30 bg-[#258DCD]/5 text-[#AAD6CD] text-[10px] font-mono font-bold uppercase tracking-widest">
                <Sparkles size={12} className="text-[#258DCD]" /> Productora EAR · Directorio Nacional
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight font-syne">
                Directorio Homologado de Proveedores
              </h1>
              <p className="text-neutral-400 text-xs sm:text-sm max-w-3xl font-light leading-relaxed">
                Selección de profesionales de España con seguro de RC de 1.000.000 €, rider acústico estandarizado y reserva protegida de 100,00 €.
              </p>
            </div>

            <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 font-mono text-[10px] text-neutral-300 shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-400" /> Cobertura RC: 1.000.000 €
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 flex items-center gap-1.5">
                <Lock size={12} className="text-[#AAD6CD]" /> Reserva: 100 € Stripe
              </span>
              <a href="tel:+34693693048" className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-[#FF2B44] text-[#FF2B44] flex items-center gap-1.5 transition-colors">
                <PhoneCall size={12} /> {CENTRALITA.display}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. FILTROS BENTO Y BARRA DE NAVEGACIÓN COMPACTA
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main className="max-w-7xl mx-auto px-4 space-y-8 overflow-x-hidden">
        <BentoFilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          searchQuery={searchQuery}
          onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
          selectedProvince={selectedProvince}
          onProvinceChange={(prov) => { setSelectedProvince(prov); setCurrentPage(1); }}
          provincesList={provincesList}
          totalResults={filteredProviders.length}
        />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            3. ARQUITECTURA BENTO GRID: REJILLA ESTRICTA DE ALTA DENSIDAD
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {filteredProviders.length === 0 ? (
          <div className="bg-[#08080c] border border-neutral-800 rounded-3xl p-8 sm:p-14 text-center max-w-3xl mx-auto my-6 relative overflow-hidden shadow-2xl space-y-6">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-b from-[#258DCD]/10 to-transparent blur-3xl pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-[#258DCD]/10 border border-[#258DCD]/30 flex items-center justify-center mx-auto text-[#258DCD]">
              <Lock size={26} />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#258DCD]/30 bg-[#258DCD]/5 text-[#AAD6CD] text-xs font-mono font-bold uppercase tracking-wider mb-3">
                Selección Privada & Homologación S-Class
              </span>
              <h3 className="text-xl sm:text-2xl font-bold uppercase text-white font-syne tracking-tight">
                Espacios & Servicios Disponibles bajo Petición
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto mt-3 font-light leading-relaxed">
                Por riguroso protocolo de calidad S-Class, rider acústico garantizado (12 W/pax) y seguro de RC de 1.000.000 €, los proveedores externos permanecen bajo auditoría privada y no se exponen masivamente en abierto. Nuestro equipo de concierge gestiona la auditoría técnica, disponibilidad y reserva con bloqueo de fecha criptográfico SHA-256.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center pt-2 font-mono">
              <a
                href={`tel:${CENTRALITA.display.replace(/\s+/g, '')}`}
                className="px-6 py-3.5 rounded-xl bg-[#258DCD] hover:bg-[#258DCD]/80 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-[1.02] shadow-lg shadow-[#258DCD]/20"
              >
                <PhoneCall size={14} /> Contactar Centralita {CENTRALITA.display}
              </a>
              <button
                onClick={() => { setSelectedCategory('ALL'); setSelectedProvince(''); setSearchQuery(''); }}
                className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                Ver Artistas Activos ({providersData.length}) <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full min-w-0">
            {paginatedProviders.map((provider) => (
              <div key={provider.id} className="min-w-0 w-full">
                <BentoProviderCard
                  provider={provider}
                  onSelect={openModal}
                  onClaim={(p) => setClaimModalProvider(p)}
                />
              </div>
            ))}
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            4. PAGINACIÓN S-CLASS ULTRA FLUIDA
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 pb-12 border-t border-neutral-900 font-mono text-xs">
            <span className="text-neutral-400">
              Mostrando <strong className="text-white">{((currentPage - 1) * pageSize) + 1}</strong> - <strong className="text-white">{Math.min(currentPage * pageSize, filteredProviders.length).toLocaleString()}</strong> de <strong className="text-[#258DCD]">{filteredProviders.length.toLocaleString()}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-[#0a0a0f] border border-neutral-800 text-neutral-300 hover:text-white hover:border-[#258DCD] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              <span className="px-3.5 py-2 rounded-xl bg-[#08080c] border border-[#258DCD]/30 text-white font-bold">
                Pág. <strong className="text-[#258DCD]">{currentPage}</strong> / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-[#0a0a0f] border border-neutral-800 text-neutral-300 hover:text-white hover:border-[#258DCD] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            5. MODAL DE FICHA COMPLETA S-CLASS (FRAMER MOTION EDITION)
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <AnimatePresence>
        {activeModalProvider && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[100px] flex justify-center items-center p-3 sm:p-6 overflow-y-auto perspective-[2000px]"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20, rotateX: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20, rotateX: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-[#08080c]/90 border border-white/10 w-full max-w-5xl max-h-[92vh] rounded-[2.5rem] overflow-y-auto p-6 sm:p-10 relative space-y-8 shadow-[0_0_80px_rgba(37,141,205,0.15)] font-sans scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              <button
                onClick={() => setActiveModalProvider(null)}
                className="absolute top-6 right-6 bg-white/5 hover:bg-white/20 text-white h-10 w-10 rounded-full transition-all flex items-center justify-center cursor-pointer border border-white/10 z-50 backdrop-blur-md"
              >
                ✕
              </button>

              {/* Header de la Ficha */}
              <div className="space-y-4 pr-12">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-bold text-[#AAD6CD] uppercase tracking-widest font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(170,214,205,0.1)]">
                    {activeModalProvider.badge || (activeModalProvider.category ? activeModalProvider.category.toUpperCase() : 'HOMOLOGADO')}
                  </span>
                  <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#258DCD]" /> {activeModalProvider.province?.toUpperCase() || 'ESPAÑA'}
                  </span>
                  {activeModalProvider.rating ? (
                    <span className="text-xs font-mono text-amber-400 font-bold ml-auto flex items-center gap-1.5">
                      <Star size={14} fill="currentColor" /> {activeModalProvider.rating} <sub>({activeModalProvider.reviews || 0})</sub>
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-neutral-500 ml-auto flex items-center gap-1.5">
                      <ShieldCheck size={14} /> Homologado
                    </span>
                  )}
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400 font-syne leading-tight tracking-tight">
                  {activeModalProvider.name}
                </h2>
                {(activeModalProvider as any).address && (
                  <p className="text-sm text-neutral-500 font-mono flex items-center gap-1.5">
                    📍 {(activeModalProvider as any).address}
                  </p>
                )}
              </div>

              {/* Carrusel Figma High-End S-Class */}
              <div className="shadow-2xl rounded-[2rem] overflow-hidden ring-1 ring-white/10">
                <PremiumMediaCarousel 
                  images={activeModalProvider.gallery || (activeModalProvider.img ? [activeModalProvider.img] : [])} 
                  providerName={activeModalProvider.name} 
                />
              </div>

              {/* Magic Tabs Estilo Linear/Vercel */}
              <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-mono font-bold relative border-b border-white/5 scrollbar-none">
                {[
                  { id: 'info', label: '📋 Descripción & Contacto' },
                  { id: 'faqs', label: '❓ Preguntas Frecuentes' },
                  { id: 'services', label: `🛠️ Packs & Tarifas (${(activeModalProvider as any).services_list?.length || 0})` },
                  { id: 'garantia', label: '🛡️ Garantía S-Class' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id as any)}
                    className={`relative px-5 py-3 rounded-2xl transition-all cursor-pointer whitespace-nowrap z-10 ${
                      modalTab === tab.id ? 'text-white' : 'text-neutral-500 hover:text-white'
                    }`}
                  >
                    {modalTab === tab.id && (
                      <motion.div
                        layoutId="activeModalTab"
                        className="absolute inset-0 bg-white/10 border border-white/20 rounded-2xl -z-10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Contenido de la Pestaña Activa con Fade-Up */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={modalTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-[200px]"
                >
                  {/* PESTAÑA 1: DESCRIPCIÓN */}
                  {modalTab === 'info' && (
                    <div className="space-y-6 text-sm font-sans leading-relaxed text-neutral-300">
                      <div className="bg-[#050508] p-6 rounded-3xl border border-white/5 space-y-3">
                        <h4 className="text-white font-mono font-bold uppercase tracking-widest text-[10px] opacity-70">
                          Overview
                        </h4>
                        <p className="whitespace-pre-line text-lg font-light tracking-wide text-neutral-300">
                          {activeModalProvider.description_full || activeModalProvider.description || `${activeModalProvider.name} es un proveedor profesional homologado bajo los rigurosos estándares técnicos y de calidad de Productora EAR.`}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                        <div className="bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-5 rounded-2xl border border-white/5">
                          <span className="text-neutral-500 uppercase block mb-1">Cierre Directo</span>
                          <a href={`tel:${(activeModalProvider as any).phone?.replace(/[^\d+]/g, '') || ''}`} className="text-white font-bold text-lg hover:text-[#258DCD] transition-colors">
                            {(activeModalProvider as any).phone || (activeModalProvider as any).telephone || 'Consultar con Concierge'}
                          </a>
                        </div>
                        <div className="bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-5 rounded-2xl border border-white/5">
                          <span className="text-neutral-500 uppercase block mb-1">Desplazamiento</span>
                          <span className="text-white font-bold text-lg">
                            {activeModalProvider.province || 'Madrid'} <span className="text-neutral-500 text-sm font-normal">(Nacional)</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PESTAÑA 2: FAQS */}
                  {modalTab === 'faqs' && (
                    <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {(activeModalProvider as any).faqs && typeof (activeModalProvider as any).faqs === 'object' && !Array.isArray((activeModalProvider as any).faqs) && Object.keys((activeModalProvider as any).faqs).length > 0 ? (
                        Object.entries((activeModalProvider as any).faqs).map(([pregunta, respuesta], qIdx) => (
                          <div key={qIdx} className="bg-[#050508] p-5 rounded-2xl border border-white/5 space-y-2 group hover:border-white/20 transition-colors">
                            <h5 className="text-white font-mono font-bold text-sm flex items-start gap-3">
                              <span className="text-[#258DCD] shrink-0">Q:</span> <span className="pt-0.5">{pregunta}</span>
                            </h5>
                            <p className="text-neutral-400 text-sm font-light leading-relaxed pl-6 whitespace-pre-line">
                              {String(respuesta)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-[#050508] p-5 rounded-2xl border border-white/5 space-y-2">
                            <h5 className="text-white font-mono font-bold text-sm flex items-start gap-3"><span className="text-[#258DCD]">Q:</span>¿Qué incluye la contratación?</h5>
                            <p className="text-neutral-400 text-sm font-light pl-6">Servicio homologado, rider técnico y seguro RC 1.000.000 €.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PESTAÑA 3: PACKS */}
                  {modalTab === 'services' && (
                    <PremiumPacksCarousel
                      providerSlug={String(activeModalProvider.slug || activeModalProvider.id)}
                      providerName={activeModalProvider.name}
                      basePrice={activeModalProvider.basePrice || 900}
                      servicesList={(activeModalProvider as any).services_list || []}
                    />
                  )}

                  {/* PESTAÑA 4: GARANTÍA */}
                  {modalTab === 'garantia' && (
                    <div className="space-y-4">
                      <div className="bg-[#050508] p-6 rounded-3xl border border-[#ecb613]/20 shadow-[0_0_30px_rgba(236,182,19,0.05)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                          <ShieldCheck size={120} className="text-[#ecb613]" />
                        </div>
                        <h4 className="text-sm font-bold text-[#ecb613] uppercase tracking-widest font-mono mb-4 relative z-10">
                          Protocolo Inmutable S-Class
                        </h4>
                        <ul className="space-y-4 text-sm font-light text-neutral-300 relative z-10">
                          <li className="flex items-start gap-3"><Zap className="text-[#ecb613] shrink-0 mt-0.5" size={18} /> <span><strong>Split Soberano 80/10/10:</strong> Transparencia total en el flujo de capital. Sin cuotas de directorio.</span></li>
                          <li className="flex items-start gap-3"><ShieldCheck className="text-[#ecb613] shrink-0 mt-0.5" size={18} /> <span><strong>Seguro RC 1.000.000 €:</strong> Protección total ante cualquier contingencia en el evento.</span></li>
                          <li className="flex items-start gap-3"><Lock className="text-[#ecb613] shrink-0 mt-0.5" size={18} /> <span><strong>Price-Lock SHA-256:</strong> Depósito de 100€ intocable para blindar la fecha.</span></li>
                        </ul>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Acciones y Cierre */}
              <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-mono tracking-widest block mb-1">Cierre Automático S-Class</span>
                  <span className="text-3xl font-black text-white font-mono tracking-tighter">
                    {activeModalProvider.basePrice ? `${activeModalProvider.basePrice} €` : 'A consultar'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 w-full sm:w-auto font-mono text-sm">
                  <a
                    href={makeWaLink((activeModalProvider as any).phone || (activeModalProvider as any).telephone || '693693048', activeModalProvider.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-white/10"
                  >
                    <span>Consultar</span>
                  </a>

                  <Link
                    href={activeModalProvider.customUrl || `/checkout/presupuesto?proveedor=${encodeURIComponent(activeModalProvider.name)}&base=${activeModalProvider.basePrice || 650}`}
                    className="px-8 py-4 rounded-2xl bg-white hover:bg-neutral-200 text-black font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105"
                  >
                    <Lock size={16} />
                    <span>Bloquear 100 €</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            6. CLÁUSULA ÉTICA DE DIRECTORIO & SALVAGUARDA LEGAL (RGPD & LSSI-CE)
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="mt-12 p-6 rounded-2xl bg-[#08080c] border border-neutral-800/80 text-xs font-mono space-y-3">
          <div className="flex items-center gap-2 text-[#AAD6CD]">
            <ShieldCheck size={16} className="text-[#258DCD]" />
            <span className="font-bold uppercase tracking-wider">Directorio Profesional Homologado • Marco Legal y Transparencia</span>
          </div>
          <p className="text-neutral-400 leading-relaxed font-sans text-[11px]">
            Productora EAR opera como directorio público profesional y plataforma de intermediación tecnológica al amparo del 
            <strong> Art. 6.1.f del RGPD</strong> y el régimen de Safe Harbor del <strong>Art. 16 de la Ley 34/2002 (LSSI-CE)</strong>. 
            Los datos comerciales mostrados proceden de fuentes públicas profesionales y tienen como único fin la dinamización de eventos y la derivación de clientes bajo el protocolo soberano <strong>Split 80/10/10</strong> y depósito de 100 € en Stripe Price-Lock.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[10px] text-neutral-500 pt-2 border-t border-neutral-800">
            <span>¿Eres titular de una ficha?</span>
            <Link href="/reclamar-perfil" className="text-[#258DCD] hover:underline font-bold">
              Reclamar Ficha Gratuita (0 €/mes)
            </Link>
            <span>•</span>
            <span className="text-neutral-500">
              Baja automática e instantánea garantizada sin trámites
            </span>
          </div>
        </section>

        {/* Modal de Reclamar Ficha 2FA */}
        <ClaimProviderModal
          isOpen={!!claimModalProvider}
          provider={claimModalProvider}
          onClose={() => setClaimModalProvider(null)}
          onClaimSuccess={(id, token) => {
            console.log(`[CLAIM VERIFIED] Provider ${id} claimed with token ${token}`);
          }}
        />
      </main>
    </div>
  );
}

export default function WrappedProveedoresPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030305] flex items-center justify-center text-white font-mono text-xs">
        <div className="space-y-3 text-center">
          <Loader2 className="animate-spin text-[#258DCD] mx-auto" size={32} />
          <p className="text-neutral-400">Cargando Directorio Homologado S-Class...</p>
        </div>
      </div>
    }>
      <ProveedoresDirectoryContent />
    </Suspense>
  );
}

