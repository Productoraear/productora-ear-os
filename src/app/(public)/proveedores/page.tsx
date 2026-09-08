'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import rawProvidersData from '@/data/all_providers_database.json';
import { CENTRALITA } from '@/lib/phone-constants';
import { ClaimProviderModal } from '@/components/providers/ClaimProviderModal';
import { BentoProviderCard, ProviderItem } from '@/components/providers/BentoProviderCard';
import { BentoFilterBar, CategoryItem } from '@/components/providers/BentoFilterBar';

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
  
  // Blindaje de Deduplicación y Anti-Slop en Runtime S-Class
  const providersData = useMemo(() => {
    const raw = rawProvidersData as unknown as ProviderItem[];
    const seen = new Set<string>();
    const sanitized: ProviderItem[] = [];

    for (const p of raw) {
      if (!p || !p.name) continue;
      const lowerName = p.name.toLowerCase().trim();
      if (
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
      const normKey = lowerName.replace(/[^a-z0-9]/g, '');
      if (seen.has(normKey)) continue;
      seen.add(normKey);
      sanitized.push(p);
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

    const baseList = selectedCategory === 'catering' || selectedCategory === 'ALL'
      ? [...sclassSpecialServices, ...providersData]
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
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#258DCD] selection:text-black w-full overflow-x-hidden">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HEADER S-CLASS MONUMENTAL (ZERO HORIZONTAL OVERFLOW)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="max-w-7xl mx-auto border-b border-neutral-900 pb-8 mb-8 space-y-4">
        <div className="bg-[#08080c] border border-neutral-800 hover:border-[#258DCD]/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl transition-colors">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-[#258DCD]/10 to-transparent blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#258DCD]/30 bg-[#258DCD]/5 text-[#AAD6CD] text-xs font-mono font-bold uppercase tracking-widest mb-3">
            <Sparkles size={14} className="text-[#258DCD]" /> Productora EAR • Directorio Homologado S-Class
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight font-syne">
            Directorio Nacional de Proveedores
          </h1>

          <p className="text-neutral-400 text-xs sm:text-sm lg:text-base max-w-4xl mt-2 font-light leading-relaxed">
            El estándar más riguroso de provisión técnica, artística y logística de España. Seguro de RC de 1.000.000 €, rider acústico estandarizado (12 W/pax) y cierre de fecha con depósito de 100,00 € bajo firma criptográfica SHA-256.
          </p>

          <div className="flex flex-wrap gap-2 pt-4 font-mono text-[11px] text-neutral-300">
            <span className="px-3 py-1 rounded-lg bg-black/60 border border-white/10 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" /> Cobertura RC: 1.000.000 €
            </span>
            <span className="px-3 py-1 rounded-lg bg-black/60 border border-white/10 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#258DCD]" /> Split Soberano: 80% Artista / 10% EAR / 10% VIMUME
            </span>
            <span className="px-3 py-1 rounded-lg bg-black/60 border border-white/10 flex items-center gap-1.5">
              <Lock size={13} className="text-[#AAD6CD]" /> Price-Lock: 100,00 € Stripe
            </span>
            <span className="px-3 py-1 rounded-lg bg-black/60 border border-white/10 flex items-center gap-1.5">
              <PhoneCall size={13} className="text-amber-400" /> Centralita: {CENTRALITA.display}
            </span>
          </div>
        </div>
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. FILTROS BENTO Y BARRA DE NAVEGACIÓN COMPACTA
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main className="max-w-7xl mx-auto space-y-8 overflow-x-hidden">
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
          <div className="bg-[#08080c] border border-neutral-800 rounded-2xl p-12 text-center space-y-4 font-mono">
            <Camera className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-lg font-bold uppercase text-white font-syne">
              No se encontraron proveedores en esta selección
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto">
              Intenta restablecer la provincia o el término de búsqueda para ver todos los profesionales homologados.
            </p>
            <button
              onClick={() => { setSelectedCategory('ALL'); setSelectedProvince(''); setSearchQuery(''); }}
              className="px-5 py-2.5 rounded-xl bg-[#258DCD] text-black font-bold text-xs uppercase tracking-wider font-mono hover:bg-[#1f74a8] transition-colors cursor-pointer"
            >
              Ver Todos los Servicios ({providersData.length.toLocaleString()})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {paginatedProviders.map((provider) => (
              <BentoProviderCard
                key={provider.id}
                provider={provider}
                onSelect={openModal}
                onClaim={(p) => setClaimModalProvider(p)}
              />
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
            5. MODAL DE FICHA COMPLETA S-CLASS
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeModalProvider && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-center items-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-[#08080c] border border-[#258DCD] w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-y-auto p-6 sm:p-8 relative space-y-6 shadow-2xl font-sans">
              <button
                onClick={() => setActiveModalProvider(null)}
                className="absolute top-4 right-4 bg-neutral-900 hover:bg-[#258DCD] text-white hover:text-black h-9 w-9 rounded-full font-bold transition-all flex items-center justify-center cursor-pointer border border-neutral-700"
              >
                ✕
              </button>

              <div className="space-y-1.5 pr-10">
                <span className="text-xs font-bold text-[#AAD6CD] uppercase tracking-widest font-mono block">
                  {activeModalProvider.badge || (activeModalProvider.category ? activeModalProvider.category.toUpperCase() : 'HOMOLOGADO')} • {activeModalProvider.province?.toUpperCase() || 'MADRID'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-syne leading-tight">
                  {activeModalProvider.name}
                </h2>
              </div>

              {/* Imagen y Galería */}
              <div className="space-y-3">
                <div className="h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-black border border-neutral-800 flex items-center justify-center">
                  <img
                    src={activeGalleryImg || activeModalProvider.img}
                    alt={activeModalProvider.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {activeModalProvider.gallery && activeModalProvider.gallery.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {activeModalProvider.gallery.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveGalleryImg(imgUrl)}
                        className={`h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          activeGalleryImg === imgUrl ? 'border-[#258DCD] scale-95' : 'border-neutral-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt="Galería" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Especificaciones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Descripción del Servicio</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    {activeModalProvider.description_full || activeModalProvider.description || `${activeModalProvider.name} es un proveedor homologado bajo los estándares técnicos y de acústica de Productora EAR.`}
                  </p>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Garantía & Homologación EAR</h4>
                  <ul className="space-y-1.5 text-neutral-300">
                    <li className="flex items-center gap-2"><span className="text-[#258DCD]">✓</span> Seguro de Responsabilidad Civil: 1.000.000 €</li>
                    <li className="flex items-center gap-2"><span className="text-[#258DCD]">✓</span> Contratación Directa vía EAR Split Soberano (80/10/10)</li>
                    <li className="flex items-center gap-2"><span className="text-[#258DCD]">✓</span> Presión Acústica S-Class: 12 W/pax</li>
                    <li className="flex items-center gap-2"><span className="text-[#258DCD]">✓</span> Centralita de Retención: {CENTRALITA.display}</li>
                  </ul>
                </div>
              </div>

              {/* Acciones */}
              <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-mono block">Tarifa Oficial Garantizada</span>
                  <span className="text-2xl font-black text-[#258DCD] font-mono">
                    Desde {activeModalProvider.basePrice || 650} €
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setClaimModalProvider(activeModalProvider);
                      setActiveModalProvider(null);
                    }}
                    className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-neutral-700 hover:border-[#258DCD] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck size={15} className="text-[#258DCD]" />
                    <span>Reclamar (2FA)</span>
                  </button>

                  <Link
                    href={activeModalProvider.customUrl || `/checkout/presupuesto?format=Solista&base=350&venue=${encodeURIComponent(activeModalProvider.name)}`}
                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-[#258DCD] hover:bg-[#1f74a8] text-black font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-[#258DCD]/20"
                  >
                    <Lock size={13} />
                    <span>Bloquear 100 €</span>
                  </Link>

                  <a
                    href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola, solicito verificar disponibilidad para ${activeModalProvider.name} en ${activeModalProvider.province || 'Madrid'}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black transition-colors flex items-center justify-center cursor-pointer"
                    title="Consultar vía WhatsApp"
                  >
                    <PhoneCall size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

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
