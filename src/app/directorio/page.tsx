"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Building2,
  Music2,
  Volume2,
  UtensilsCrossed,
  Camera,
  HeartHandshake,
  ShieldCheck,
  Zap,
  ArrowRight,
  Phone,
  Bookmark,
  RefreshCw,
  Layers,
  Heart
} from 'lucide-react';
import {
  CultResourceCard,
  CultDirectoryItem,
} from '@/app/components/cult-directory/CultResourceCard';
import { CultDirectoryHero } from '@/app/components/cult-directory/CultDirectoryHero';
import {
  CultDirectoryFilterBar,
  CategoryOption,
} from '@/app/components/cult-directory/CultDirectoryFilterBar';
import { CultFeaturedCarousel } from '@/app/components/cult-directory/CultFeaturedCarousel';
import { CultResourceDetailModal } from '@/app/components/cult-directory/CultResourceDetailModal';
import { CultSubmitListingModal } from '@/app/components/cult-directory/CultSubmitListingModal';
import { CultBookmarksDrawer } from '@/app/components/cult-directory/CultBookmarksDrawer';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';
import {
  PROVIDERS_MANIFEST_TOTALS,
  PROVIDERS_GRAND_TOTAL,
} from '@/lib/constants/providers-manifest';

// Categorías oficiales con iconos y contadores SSOT
const DIRECTORY_CATEGORIES: CategoryOption[] = [
  { id: 'ALL', label: 'Todos los Nodos', icon: Layers, count: PROVIDERS_GRAND_TOTAL },
  { id: 'finca', label: 'Fincas & Espacios', icon: Building2, count: PROVIDERS_MANIFEST_TOTALS.finca },
  { id: 'musica', label: 'Música & Solistas', icon: Music2, count: PROVIDERS_MANIFEST_TOTALS.musica },
  { id: 'sonido', label: 'Sonido & Iluminación', icon: Volume2, count: PROVIDERS_MANIFEST_TOTALS.sonido },
  { id: 'catering', label: 'Catering de Gala', icon: UtensilsCrossed, count: PROVIDERS_MANIFEST_TOTALS.catering },
  { id: 'foto', label: 'Fotografía & Vídeo', icon: Camera, count: PROVIDERS_MANIFEST_TOTALS.foto },
  { id: 'senior_care', label: 'Centros Senior VIMUME', icon: HeartHandshake, count: PROVIDERS_MANIFEST_TOTALS.senior_care },
  { id: 'wedding', label: 'Wedding Planners', icon: Sparkles, count: PROVIDERS_MANIFEST_TOTALS.wedding },
];

// Nodos destacados predefinidos con máxima prioridad comercial (SSOT)
const SCLASS_PRIORITY_NODES: CultDirectoryItem[] = [
  {
    id: 'edwin-agudelo-sovereign',
    name: 'Edwin Agudelo • Solista S-Class',
    category: 'musica',
    province: 'Madrid / Toledo',
    municipality: 'Hub Méntrida (Km 0)',
    description:
      'Show musical en vivo de 1 hora (2 pases de 30 min), microfonía Shure Beta 87A, sonido Bose F1 812 / S1 Pro, ramo de flores en vivo, canción personalizada y sesión de fotos con sombreros temáticos. Artista Solista S-Class prioritario.',
    price: '350,00 €',
    rating: 5.0,
    reviewsCount: 128,
    imageUrls: [
      '/assets/shadow_vendors/c6831218af2e78b8.jpg',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    ],
    isPreferred: true,
    badge: 'SOLISTA S-CLASS (PRIORIDAD #1)',
    verified: true,
    likesCount: 142,
    acousticRider: 'Bose F1 812 / S1 Pro (12W/pax)',
    cetacPower: '230V Schuko Reforzado (16A)',
    soundLimitDb: 75,
    splitSovereign: '80% Artista / 10% EAR OS / 10% VIMUME',
  },
  ...SCLASS_12_FINCAS_HOMOLOGADAS.map((f, i) => ({
    id: `finca-${f.id}`,
    name: f.name,
    category: 'finca',
    province: f.provincia,
    municipality: f.location,
    description: `${f.description} Capacidad hasta ${f.capacidadMaxPax} invitados. Póliza RC de ${f.polizaRC.coberturaEuros.toLocaleString('es-ES')} € (${f.polizaRC.aseguradora}). Acometida ${f.tomaElectrica}.`,
    price: 'Desde 1.200,00 €',
    rating: 4.9,
    reviewsCount: 34 + i * 5,
    imageUrls: [
      [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
      ][i % 3],
    ],
    isPreferred: true,
    badge: f.estadoHomologacion === 'CERTIFICADA_GOLD_MASTER' ? 'GOLD MASTER S-CLASS' : 'HOMOLOGADA S-CLASS',
    verified: true,
    likesCount: 50 + i * 7,
    acousticRider: 'Calibración Acústica Certificada dBA',
    cetacPower: f.tomaElectrica,
    soundLimitDb: f.limiteAcustico.exteriorDBA,
    splitSovereign: '80% Artista / 10% EAR OS / 10% VIMUME',
  })),
];

export default function CultDirectoryPage() {
  const [items, setItems] = useState<CultDirectoryItem[]>(SCLASS_PRIORITY_NODES);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<CultDirectoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<CultDirectoryItem | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isBookmarksDrawerOpen, setIsBookmarksDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Cargar bookmarks desde localStorage en cliente
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ear_directory_bookmarks_v1');
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('[CULT-DIRECTORY] Error leyendo bookmarks locales:', e);
    }
  }, []);

  // Guardar bookmarks en localStorage al cambiar
  const saveBookmarks = (newBookmarks: CultDirectoryItem[]) => {
    setBookmarks(newBookmarks);
    try {
      localStorage.setItem('ear_directory_bookmarks_v1', JSON.stringify(newBookmarks));
    } catch (e) {
      console.warn('[CULT-DIRECTORY] Error guardando bookmarks:', e);
    }
  };

  const handleToggleBookmark = useCallback(
    (item: CultDirectoryItem) => {
      const exists = bookmarks.some((b) => b.id === item.id);
      if (exists) {
        saveBookmarks(bookmarks.filter((b) => b.id !== item.id));
      } else {
        saveBookmarks([...bookmarks, item]);
      }
    },
    [bookmarks]
  );

  const handleRemoveBookmark = (id: string) => {
    saveBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  const handleClearBookmarks = () => {
    saveBookmarks([]);
  };

  // Cargar perfiles adicionales desde la API
  const fetchEdgeProviders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', '36');
      if (selectedCategory !== 'ALL') params.set('category', selectedCategory);
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (selectedProvince !== 'ALL') params.set('province', selectedProvince);

      const res = await fetch(`/api/profiles/search?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.providers) && data.providers.length > 0) {
        const mapped: CultDirectoryItem[] = data.providers.map((p: any) => ({
          id: p.id || p.shaHash,
          name: (p.name || '').replace(/\s*-\s*Consulta disponibilidad y precios.*/i, '').trim(),
          category: p.category || 'finca',
          province: p.province || 'Madrid',
          municipality: p.municipality || '',
          description: p.description || 'Proveedor auditado bajo estándares de calidad y cobertura de RC de 1.000.000 €.',
          price: p.basePrice ? `${p.basePrice} €` : (p.priceRange || 'Consultar'),
          rating: p.rating || 4.9,
          reviewsCount: p.reviewsCount || 14,
          imageUrls: Array.isArray(p.imageUrls) && p.imageUrls.length > 0
            ? p.imageUrls
            : ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop'],
          isPreferred: p.status === 'VERIFIED_ACTIVE',
          badge: p.status === 'VERIFIED_ACTIVE' ? 'VERIFICADO S-CLASS' : 'DIRECTORIO HOMOLOGADO',
          verified: true,
          cetacPower: 'CETAC 32A',
          soundLimitDb: 75,
          splitSovereign: '80% Artista / 10% EAR OS / 10% VIMUME',
        }));

        // Mantener a Edwin Agudelo siempre arriba si coincide la búsqueda
        const combined = [...SCLASS_PRIORITY_NODES, ...mapped];
        // Quitar duplicados por ID
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        setItems(unique);
      }
    } catch (err) {
      console.warn('[CULT-DIRECTORY] Usando fallback estático prioritario S-Class:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery, selectedProvince]);

  useEffect(() => {
    fetchEdgeProviders();
  }, [fetchEdgeProviders]);

  // Lista de provincias disponibles
  const provincesList = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => {
      if (it.province) set.add(it.province);
    });
    return Array.from(set).sort();
  }, [items]);

  // Filtrado reactivo en cliente
  const filteredItems = useMemo(() => {
    let result = items;

    if (onlyBookmarked) {
      const bookmarkedIds = new Set(bookmarks.map((b) => b.id));
      result = result.filter((it) => bookmarkedIds.has(it.id));
    }

    if (selectedCategory !== 'ALL') {
      result = result.filter((it) => it.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedProvince !== 'ALL') {
      result = result.filter((it) => it.province.toLowerCase() === selectedProvince.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.description.toLowerCase().includes(q) ||
          (it.municipality && it.municipality.toLowerCase().includes(q)) ||
          it.province.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, selectedCategory, selectedProvince, searchQuery, onlyBookmarked, bookmarks]);

  const handleListingCreated = (newItem: CultDirectoryItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  return (
    <main className="min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black">
      {/* 1. Hero Principal con Buscador Glow (Cult UI Pill) */}
      <CultDirectoryHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedProvince={selectedProvince}
        onProvinceChange={setSelectedProvince}
        provincesList={provincesList}
        totalNodesCount={PROVIDERS_GRAND_TOTAL}
        activeSpotsCount={48}
        bookmarkedCount={bookmarks.length}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenBookmarksDrawer={() => setIsBookmarksDrawerOpen(true)}
      />

      {/* 2. Featured Showcase Carousel (Auto-scrolling top tier nodes) */}
      <CultFeaturedCarousel
        items={SCLASS_PRIORITY_NODES.slice(0, 6)}
        onOpenDetail={setSelectedItem}
      />

      {/* 3. Category Filter Bar (Horizontal Pill Selector) */}
      <CultDirectoryFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={DIRECTORY_CATEGORIES}
        onlyBookmarked={onlyBookmarked}
        onToggleOnlyBookmarked={() => setOnlyBookmarked(!onlyBookmarked)}
        bookmarkedCount={bookmarks.length}
      />

      {/* 4. Main Resource Cards Grid (Cult UI High Density Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-5 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              {onlyBookmarked
                ? `Mostrando Mi Bóveda Guardada (${filteredItems.length})`
                : `Mostrando ${filteredItems.length} Nodos Homologados`}
            </span>
            {isLoading && <RefreshCw className="w-3.5 h-3.5 text-[#ecb613] animate-spin" />}
          </div>

          <Link
            href="/fincas"
            className="text-xs font-mono text-[#ecb613] hover:underline flex items-center gap-1"
          >
            <span>Ver Portal Fincas B2B</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4 max-w-lg mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-syne font-bold text-lg text-white">
              No se encontraron nodos coincidentes
            </h3>
            <p className="text-xs text-zinc-400">
              Prueba a ajustar tu búsqueda o restablecer los filtros de categoría y provincia.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedProvince('ALL');
                setOnlyBookmarked(false);
              }}
              className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 hover:text-white"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <CultResourceCard
                key={item.id}
                item={item}
                onOpenDetail={setSelectedItem}
                onToggleBookmark={handleToggleBookmark}
                isBookmarked={bookmarks.some((b) => b.id === item.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. Footer B2B S-Class Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-[#ecb613]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]">
              Infraestructura &amp; Alianzas 80/10/10
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-syne text-white uppercase tracking-tight">
              ¿Gestionas un espacio singular o representas a un artista?
            </h3>
            <p className="text-xs text-zinc-400 font-sans max-w-xl">
              Homologa tu activo en la Red S-Class de Productora EAR. Cobertura de RC de 1.000.000 €, auditoría acústica 12 W/pax y liquidación en 7 días hábiles sin comisiones parasitarias.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-6 py-3.5 rounded-full bg-[#ecb613] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(236,182,19,0.3)]"
            >
              Proponer mi Espacio
            </button>
            <a
              href="https://wa.me/34693693048?text=Hola%20Centralita%20EAR,%20deseo%20homologar%20mi%20espacio/servicio%20en%20el%20directorio%20S-Class."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs font-bold uppercase tracking-wider hover:text-white hover:border-zinc-700 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#ecb613]" />
              <span>Contactar Centralita</span>
            </a>
          </div>
        </div>
      </section>

      {/* Modales Interactivos */}
      <CultResourceDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onToggleBookmark={handleToggleBookmark}
        isBookmarked={selectedItem ? bookmarks.some((b) => b.id === selectedItem.id) : false}
      />

      <CultSubmitListingModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onListingCreated={handleListingCreated}
      />

      <CultBookmarksDrawer
        isOpen={isBookmarksDrawerOpen}
        onClose={() => setIsBookmarksDrawerOpen(false)}
        bookmarks={bookmarks}
        onRemoveBookmark={handleRemoveBookmark}
        onClearBookmarks={handleClearBookmarks}
        onOpenDetail={setSelectedItem}
      />
    </main>
  );
}
