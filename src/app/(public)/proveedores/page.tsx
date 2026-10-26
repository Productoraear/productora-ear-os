'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  PhoneCall, 
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
  MessageCircle
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { ClaimProviderModal } from '@/components/providers/ClaimProviderModal';
import type { ProviderItem } from '@/components/providers/BentoProviderCard';
import SClassVendorBodasCard from '@/components/providers/SClassVendorBodasCard';
import { AirbnbVendorListingCard } from '@/components/providers/AirbnbVendorListingCard';
import { AirbnbFloatingPillSearchBar } from '@/components/search/AirbnbFloatingPillSearchBar';
import { useTheme } from '@/app/context/ThemeContext';
import { BentoFilterBar, CategoryItem, SubcategoryItem } from '@/components/providers/BentoFilterBar';
import { PremiumMediaCarousel } from '@/components/providers/PremiumMediaCarousel';
import { PremiumPacksCarousel } from '@/components/providers/PremiumPacksCarousel';
import { AirbnbNeuralBookingBar } from '@/features/search/AirbnbNeuralBookingBar';
import { PROVIDERS_MANIFEST_TOTALS, PROVIDERS_B2C_TOTAL, B2C_DIRECTORY_GREMIO_TOTALS, PROVIDERS_GRAND_TOTAL } from '@/lib/constants/providers-manifest';
import { DEPOSITO_STRIPE_EUR, TARIFA_BASE_SOLISTA_EUR } from '@/lib/constants/ear-os-ssot';
import { ALL_SPANISH_PROVINCES, isProvinceMatch, findCanonicalProvinceName, normalizeBodasNetCategory, ALL_VENUE_TYPOLOGIES } from '@/lib/constants/spain-regions-and-categories';
import { OTZARRETA_ENTITY } from '@/lib/constants/otzarreta-entity';

/** Formato monetario canónico es-ES (2 decimales, coma decimal). */
const formatEuro = (value: number): string =>
  `${new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)} €`;


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUBCATEGORÍAS S-CLASS: FINCAS & ESPACIOS SINGULARES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Contadores por tipología sin SSOT oficial: se omiten deliberadamente para no
// exponer cifras inventadas. Solo el total de gremio (manifest) es trazable.
const FINCA_SUBCATEGORIES: SubcategoryItem[] = ALL_VENUE_TYPOLOGIES.map((t) => ({
  id: t.id,
  label: t.label,
  count: t.id === 'all' ? PROVIDERS_MANIFEST_TOTALS.finca : undefined
}));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUBCATEGORÍAS S-CLASS: MÚSICA & ARTISTAS EN DIRECTO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const MUSICA_SUBCATEGORIES: SubcategoryItem[] = [
  { id: 'all', label: 'Todos los Artistas', count: PROVIDERS_MANIFEST_TOTALS.musica },
  { id: 'solista', label: '🎤 Solistas, Boleros & Baladas' },
  { id: 'mariachi', label: '🎺 Mariachis & Rancheras' },
  { id: 'dj', label: '🎧 DJs & Animación Musical' },
  { id: 'banda', label: '🎸 Bandas & Grupos en Vivo' },
  { id: 'cuerdas', label: '🎻 Cuartetos de Cuerdas & Clásica' },
];

// Contadores derivados del manifest público del Data Lake (SSOT real).
// Nada de cifras hardcodeadas: cualquier cambio se refleja editando el manifest.
const STATIC_CATEGORY_TOTALS: Record<string, number> = {
  ALL: PROVIDERS_B2C_TOTAL,
  ...B2C_DIRECTORY_GREMIO_TOTALS,
};

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
  price: formatEuro(TARIFA_BASE_SOLISTA_EUR),
  basePrice: TARIFA_BASE_SOLISTA_EUR,
  rating: 5.0,
  reviews: 128,
  img: '/assets/shadow_vendors/c6831218af2e78b8.jpg',
  gallery: [
    '/assets/shadow_vendors/c6831218af2e78b8.jpg',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop'
  ],
  isPreferred: true,
  badge: 'SOLISTA S-CLASS',
  customUrl: '/artistas/edwin-agudelo'
};

const SOVEREIGN_OTZARRETA: ProviderItem = {
  // Identificador del registro canónico en el data lake (dedup activo).
  id: 'v-32714',
  name: `${OTZARRETA_ENTITY.commercialName} & Ezkertza Berria • Eduardo Martínez`,
  slug: OTZARRETA_ENTITY.slug,
  category: 'finca',
  // Alias castellano con el que el censo y los filtros buscan la provincia.
  province: OTZARRETA_ENTITY.provinceAlias,
  municipality: OTZARRETA_ENTITY.municipality,
  address: OTZARRETA_ENTITY.fullAddress,
  description: `Casa fundada en 1902 como sidrería y reabierta en 1962: cuarta generación de cocina de cazuela vasca, comedor histórico, terraza de verano, jardines de Santa Clara y bodega seleccionada en Zarautz. Aforo de ${OTZARRETA_ENTITY.capacityPax} comensales en la sede de Gipuzkoa. El grupo incluye Ezkertza Berria (Derio · Bizkaia) con ${OTZARRETA_ENTITY.groupCapacityPax} pax, jardines para ceremonias civiles y ${OTZARRETA_ENTITY.groupParkingSpaces} plazas de aparcamiento.`,
  price: formatEuro(OTZARRETA_ENTITY.weddingPriceFromEur),
  priceLabel: 'Desde',
  basePrice: OTZARRETA_ENTITY.weddingPriceFromEur,
  rating: 5.0,
  reviews: OTZARRETA_ENTITY.reviews.length,
  img: OTZARRETA_ENTITY.scrapedAssets.facade,
  gallery: [
    OTZARRETA_ENTITY.scrapedAssets.facade,
    OTZARRETA_ENTITY.scrapedAssets.diningHall
  ],
  isPreferred: true,
  badge: 'ALIANZA VIP S-CLASS · GRUPO OTZARRETA',
  customUrl: '/otzarreta',
  // Teléfono real publicado en dominio propio (NO centralita EAR OS).
  phone: OTZARRETA_ENTITY.primaryPhoneRaw,
  telephone: OTZARRETA_ENTITY.primaryPhone,
  has_real_phone: true,
  verified: true,
  capacidadMaxPax: OTZARRETA_ENTITY.capacityPax
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

function makeCentralitaWaLink(providerName: string, category?: string, province?: string): string {
  const msg = `Hola Edwin, solicito asistencia VIP desde Productora EAR para coordinar con el proveedor "${providerName}" (${category || 'Servicio'} en ${province || 'España'}) y gestionar la reserva con el depósito deducible de 100 €.`;
  return `https://wa.me/34693693048?text=${encodeURIComponent(msg)}`;
}

function ProveedoresDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAirbnb } = useTheme();

  const urlCat = searchParams.get('cat') || searchParams.get('categoria') || searchParams.get('category');
  const urlSubcat = searchParams.get('subcat') || searchParams.get('subcategory') || 'all';
  const urlProv = searchParams.get('provincia') || searchParams.get('province') || searchParams.get('prov') || searchParams.get('location') || '';
  const urlQ = searchParams.get('q') || searchParams.get('search') || '';

  const initialCat = urlCat ? normalizeBodasNetCategory(urlCat) : 'ALL';
  const initialProv = urlProv ? (findCanonicalProvinceName(urlProv) || urlProv) : '';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(urlSubcat);
  const [selectedProvince, setSelectedProvince] = useState<string>(initialProv);
  const [searchQuery, setSearchQuery] = useState<string>(urlQ);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeModalProvider, setActiveModalProvider] = useState<ProviderItem | null>(null);
  const [claimModalProvider, setClaimModalProvider] = useState<{
    id: string;
    name: string;
    slug?: string;
    category?: string;
    province?: string;
    phone?: string;
  } | null>(null);
  const [modalTab, setModalTab] = useState<'info' | 'faqs' | 'services' | 'garantia'>('info');

  useEffect(() => {
    if (urlCat) {
      setSelectedCategory(normalizeBodasNetCategory(urlCat));
      setCurrentPage(1);
    }
  }, [urlCat]);

  useEffect(() => {
    if (urlSubcat) {
      setSelectedSubcategory(urlSubcat);
      setCurrentPage(1);
    }
  }, [urlSubcat]);

  useEffect(() => {
    if (urlProv) {
      setSelectedProvince(findCanonicalProvinceName(urlProv) || urlProv);
      setCurrentPage(1);
    }
  }, [urlProv]);

  const pageSize = 24;
  
  const [apiProviders, setApiProviders] = useState<ProviderItem[]>([]);
  const [totalApiProviders, setTotalApiProviders] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'ALL') params.set('category', selectedCategory);
    if (selectedProvince && selectedProvince !== 'ALL') params.set('province', selectedProvince);
    if ((selectedCategory === 'finca' || selectedCategory === 'musica') && selectedSubcategory && selectedSubcategory !== 'all') {
      params.set('subcategory', selectedSubcategory);
    }
    if (searchQuery) params.set('q', searchQuery);
    params.set('page', currentPage.toString());
    params.set('limit', pageSize.toString());

    const fetchDirectStaticFallback = async () => {
      let files: string[] = [];
      if (selectedCategory && selectedCategory !== 'ALL') {
        const catKey = selectedCategory;
        files = [`${catKey}.json`];
        try {
          const manRes = await fetch('/data/providers/manifest.json');
          if (manRes.ok) {
            const man = await manRes.json() as Record<string, { chunks?: string[] } | undefined>;
            const entry = man[catKey];
            if (entry && Array.isArray(entry.chunks) && entry.chunks.length > 0) {
              files = entry.chunks;
            }
          }
        } catch { /* usar partición única */ }
      } else {
        try {
          const manRes = await fetch('/data/providers/manifest.json');
          if (manRes.ok) {
            const man = await manRes.json() as Record<string, { chunks?: string[] } | undefined>;
            const allCats = ['finca', 'catering', 'foto', 'musica', 'decoracion', 'wedding', 'moda', 'transporte', 'sonido', 'servicios'];
            for (const c of allCats) {
              const entry = man[c];
              if (entry && Array.isArray(entry.chunks) && entry.chunks.length > 0) {
                files.push(...entry.chunks);
              } else {
                files.push(`${c}.json`);
              }
            }
          }
        } catch {
          files = [
            'finca.json',
            'catering.json',
            'foto.json',
            'musica.json',
            'decoracion.json',
            'wedding.json',
            'moda.json',
            'transporte.json',
            'sonido.json',
            'servicios.json',
          ];
        }
      }

      const parts = await Promise.all(files.map(async (file): Promise<ProviderItem[]> => {
        try {
          const res = await fetch(`/data/providers/${file}`);
          if (!res.ok) return [];
          const json: unknown = await res.json();
          return Array.isArray(json) ? (json as ProviderItem[]) : [];
        } catch {
          return [];
        }
      }));

      try {
        const staticList: ProviderItem[] = parts.flat();
        {
          if (isCancelled || staticList.length === 0) return;
          let filtered = staticList;

          if (selectedProvince && selectedProvince !== 'ALL') {
            filtered = filtered.filter(p => isProvinceMatch(selectedProvince, p.province || ''));
          }

          if (searchQuery && searchQuery.trim()) {
            const qLow = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(p => 
              (p.name || '').toLowerCase().includes(qLow) ||
              (p.description || '').toLowerCase().includes(qLow) ||
              (p.municipality || '').toLowerCase().includes(qLow)
            );
          }

          if (selectedSubcategory && selectedSubcategory !== 'all') {
            const subcatMap: Record<string, string[]> = {
              finca: ['finca', 'dehesa', 'huerta', 'campo', 'rústica', 'rustica', 'fincas'],
              cortijo: ['cortijo', 'cortijos', 'hacienda', 'haciendas', 'cigarral', 'cigarrales', 'rancho'],
              masia: ['masia', 'masía', 'masias', 'masías', 'caserio', 'caserío', 'caserios', 'pazo', 'pazos', 'casona', 'casa rural'],
              palacio: ['palacio', 'palacios', 'castillo', 'castillos', 'torre', 'fortaleza', 'alcazar', 'alcázar'],
              hotel: ['hotel', 'hoteles', 'parador', 'paradores', 'resort', 'suites'],
              restaurante: ['restaurante', 'restaurantes', 'asador', 'asadores', 'mesón', 'meson', 'posada'],
              salon: ['salon', 'salón', 'salones', 'complejo', 'banquetes'],
              bodega: ['bodega', 'bodegas', 'viñedo', 'viñedos', 'vinedo', 'enoturismo'],
              singular: ['singular', 'singulares', 'monumento', 'teatro', 'museo', 'invernadero', 'carpa', 'fábrica', 'fabrica'],
              playa: ['playa', 'playas', 'mar', 'costa', 'terraza', 'acantilado', 'puerto', 'bahía', 'bahia'],
              rustica: ['rústica', 'rustica', 'dehesa', 'finca rústica'],
              solista: ['solista', 'edwin agudelo', 'cantante', 'bolero', 'balada', 'tributo', 'acústico'],
              mariachi: ['mariachi', 'ranchera', 'mexicano', 'charro'],
              dj: ['dj', 'deejay', 'discomovil', 'discomóvil'],
              banda: ['banda', 'grupo', 'orquesta', 'rock', 'pop'],
              cuerdas: ['cuerdas', 'violín', 'violin', 'chelo', 'cuarteto'],
            };
            const kws = subcatMap[selectedSubcategory.toLowerCase()] || [selectedSubcategory.toLowerCase()];
            filtered = filtered.filter(p => {
              const text = `${p.name || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase();
              return kws.some(k => text.includes(k));
            });
          }

          const total = filtered.length;
          const PROV_FALLBACK_POOLS: Record<string, string[]> = {
            finca: [
              "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop"
            ],
            catering: [
              "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop"
            ],
            decoracion: [
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1522413452208-996ff3f3e740?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
            ],
            musica: [
              "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop"
            ],
            sonido: [
              "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=1200&auto=format&fit=crop"
            ],
            foto: [
              "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop"
            ],
            wedding: [
              "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop"
            ],
            moda: [
              "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop"
            ],
            transporte: [
              "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop"
            ],
            servicios: [
              "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop"
            ]
          };

          const getFallback = (catKey: string, seed?: string) => {
            const pool = PROV_FALLBACK_POOLS[catKey] || PROV_FALLBACK_POOLS.servicios;
            if (!seed) return pool[0];
            const hash = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
            return pool[hash % pool.length];
          };

          const isDirty = (u: unknown) =>
            !u ||
            typeof u !== 'string' ||
            u.includes('.svg') ||
            u.includes('gen_logoHeader') ||
            u.includes('default_avatar') ||
            u.includes('741e9617168a2484.jpg');

          const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

          const mapped: ProviderItem[] = paged.map((p: ProviderItem) => {
            const rawCat = (selectedCategory && selectedCategory !== 'ALL') ? selectedCategory : normalizeCategory(p.category, p.description, p.name);
            const rawImages = (Array.isArray(p.gallery) && p.gallery.length > 0)
              ? p.gallery
              : (Array.isArray(p.imageUrls) && p.imageUrls.length > 0)
                ? p.imageUrls
                : (Array.isArray(p.sourceImageUrls) && p.sourceImageUrls.length > 0
                  ? p.sourceImageUrls
                  : (Array.isArray(p.images) && p.images.length > 0 ? p.images.map((im) => typeof im === 'string' ? im : (im.url ?? '')) : (p.img ? [p.img] : [])));
            const validImages: string[] = rawImages.filter((u) => typeof u === 'string' && u.length > 0 && !isDirty(u));
            const pool = PROV_FALLBACK_POOLS[rawCat] || PROV_FALLBACK_POOLS.servicios;
            let poolIdx = 0;
            while (validImages.length < 2 && poolIdx < pool.length) {
              if (!validImages.includes(pool[poolIdx])) {
                validImages.push(pool[poolIdx]);
              }
              poolIdx++;
            }
            const defaultFallback = getFallback(rawCat, String(p.id || p.shaHash || p.name));
            const featured = validImages[0] || defaultFallback;
            const finalGallery = validImages.length > 0 ? validImages.slice(0, 2) : [featured];

            return {
              id: p.id || p.shaHash || p.name,
              name: (p.name || '').replace(/\s*-\s*Consulta disponibilidad y precios.*/i, '').trim(),
              slug: p.shaHash ? p.shaHash.substring(0, 8) : (p.id !== undefined ? String(p.id) : undefined),
              category: rawCat,
              province: p.province || '',
              municipality: p.municipality || '',
              description: p.description || '',
              price: typeof p.basePrice === 'number' && p.basePrice > 0 ? `${p.basePrice} €` : (p.price || ''),
              rating: typeof p.rating === 'number' ? p.rating : undefined,
              reviews: typeof p.reviews === 'number' ? p.reviews : (typeof p.reviewsCount === 'number' ? p.reviewsCount : undefined),
              img: featured,
              gallery: finalGallery,
              isPreferred: Boolean(p.isPreferred) || p.status === 'VERIFIED_ACTIVE' || p.status === 'APPROVED_SCLASS',
              badge: p.badge || (p.verified === true || p.status === 'VERIFIED_ACTIVE' ? 'VERIFICADO S-CLASS' : undefined),
              customUrl: p.customUrl || undefined,
              capacidadMaxPax: p.capacidadMaxPax,
              // Trazabilidad y monetización canónicas (directivas 5, 6, 7, 8):
              phone: p.has_real_phone === true ? (p.phone || p.telephone || null) : null,
              telephone: p.has_real_phone === true ? (p.telephone || p.phone || undefined) : undefined,
              has_real_phone: p.has_real_phone === true,
              profile_url: p.profile_url || null,
              sourceUrl: p.sourceUrl || p.profile_url || null,
              originHtml: p.originHtml || p.original_html || null,
              google_search_url: p.google_search_url,
              google_maps_url: p.google_maps_url,
              isClaimed: Boolean(p.isClaimed),
              estadoHomologacion: p.estadoHomologacion,
              // Campos canónicos que la API ya sella (no se descartan en el mapper).
              address: p.address,
              priceLabel: p.priceLabel,
              verified: p.verified === true,
              services_list: p.services_list,
              faqs: p.faqs,
              imageUrls: p.imageUrls
            };
          });

          setApiProviders(mapped);
          setTotalApiProviders(total);
        }
      } catch (err) {
        console.error('[PROVEEDORES-STATIC] Error en fallback estático:', err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetch(`/api/profiles/search?${params.toString()}`)
      .then(res => res.json())
      .then((data: { success?: boolean; providers?: ProviderItem[]; total?: number }) => {
        if (!isCancelled && data.success && Array.isArray(data.providers) && data.providers.length > 0) {
          const PROV_FALLBACK_POOLS: Record<string, string[]> = {
            finca: [
              "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop"
            ],
            catering: [
              "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop"
            ],
            decoracion: [
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop"
            ],
            musica: [
              "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1200&auto=format&fit=crop"
            ],
            sonido: [
              "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop"
            ],
            foto: [
              "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop"
            ],
            wedding: [
              "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop"
            ],
            moda: [
              "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop"
            ],
            transporte: [
              "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop"
            ],
            servicios: [
              "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop"
            ]
          };

          const getFallback = (catKey: string, seed?: string) => {
            const pool = PROV_FALLBACK_POOLS[catKey] || PROV_FALLBACK_POOLS.servicios;
            if (!seed) return pool[0];
            const hash = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
            return pool[hash % pool.length];
          };

          const isDirty = (u: unknown) =>
            !u ||
            typeof u !== 'string' ||
            u.includes('.svg') ||
            u.includes('gen_logoHeader') ||
            u.includes('default_avatar') ||
            u.includes('741e9617168a2484.jpg');

          const mapped: ProviderItem[] = (data.providers ?? []).map((p: ProviderItem) => {
            const rawCat = (selectedCategory && selectedCategory !== 'ALL') ? selectedCategory : normalizeCategory(p.category, p.description, p.name);
            const rawImages = (Array.isArray(p.gallery) && p.gallery.length > 0)
              ? p.gallery
              : (Array.isArray(p.imageUrls) && p.imageUrls.length > 0)
                ? p.imageUrls
                : (Array.isArray(p.sourceImageUrls) && p.sourceImageUrls.length > 0
                  ? p.sourceImageUrls
                  : (Array.isArray(p.images) && p.images.length > 0 ? p.images.map((im) => typeof im === 'string' ? im : (im.url ?? '')) : (p.img ? [p.img] : [])));
            const validImages: string[] = rawImages.filter((u) => typeof u === 'string' && u.length > 0 && !isDirty(u));
            const pool = PROV_FALLBACK_POOLS[rawCat] || PROV_FALLBACK_POOLS.servicios;
            let poolIdx = 0;
            while (validImages.length < 2 && poolIdx < pool.length) {
              if (!validImages.includes(pool[poolIdx])) {
                validImages.push(pool[poolIdx]);
              }
              poolIdx++;
            }
            const defaultFallback = getFallback(rawCat, String(p.id || p.shaHash || p.name));
            const featured = validImages[0] || defaultFallback;
            const finalGallery = validImages.length > 0 ? validImages.slice(0, 2) : [featured];

            return {
              id: p.id || p.shaHash || p.name,
              name: (p.name || '').replace(/\s*-\s*Consulta disponibilidad y precios.*/i, '').trim(),
              slug: p.shaHash ? p.shaHash.substring(0, 8) : (p.id !== undefined ? String(p.id) : undefined),
              category: rawCat,
              province: p.province || '',
              municipality: p.municipality || '',
              description: p.description || '',
              price: typeof p.basePrice === 'number' && p.basePrice > 0 ? `${p.basePrice} €` : (p.price || ''),
              rating: typeof p.rating === 'number' ? p.rating : undefined,
              reviews: typeof p.reviews === 'number' ? p.reviews : (typeof p.reviewsCount === 'number' ? p.reviewsCount : undefined),
              img: featured,
              gallery: finalGallery,
              isPreferred: Boolean(p.isPreferred) || p.status === 'VERIFIED_ACTIVE' || p.status === 'APPROVED_SCLASS',
              badge: p.badge || (p.verified === true || p.status === 'VERIFIED_ACTIVE' ? 'VERIFICADO S-CLASS' : undefined),
              customUrl: p.customUrl || undefined,
              capacidadMaxPax: p.capacidadMaxPax,
              // Trazabilidad y monetización canónicas (directivas 5, 6, 7, 8):
              phone: p.has_real_phone === true ? (p.phone || p.telephone || null) : null,
              telephone: p.has_real_phone === true ? (p.telephone || p.phone || undefined) : undefined,
              has_real_phone: p.has_real_phone === true,
              profile_url: p.profile_url || null,
              sourceUrl: p.sourceUrl || p.profile_url || null,
              originHtml: p.originHtml || p.original_html || null,
              google_search_url: p.google_search_url,
              google_maps_url: p.google_maps_url,
              isClaimed: Boolean(p.isClaimed),
              estadoHomologacion: p.estadoHomologacion,
              // Campos canónicos que la API ya sella (no se descartan en el mapper).
              address: p.address,
              priceLabel: p.priceLabel,
              verified: p.verified === true,
              services_list: p.services_list,
              faqs: p.faqs,
              imageUrls: p.imageUrls
            };
          });

          setApiProviders(mapped);
          setTotalApiProviders(data.total || mapped.length);
          setIsLoading(false);
        } else {
          // Si la API no retorna resultados o falla, activar fallback estático directo
          fetchDirectStaticFallback();
        }
      })
      .catch((err) => {
        console.warn('[PROVEEDORES] API search falló, activando fallback estático directo:', err);
        fetchDirectStaticFallback();
      });

    return () => { isCancelled = true; };
  }, [selectedCategory, selectedSubcategory, selectedProvince, searchQuery, currentPage]);

  const providersData = useMemo(() => {
    const isBasqueProvince = !selectedProvince || selectedProvince === 'ALL' || 
      isProvinceMatch(selectedProvince, 'Guipúzcoa') || 
      isProvinceMatch(selectedProvince, 'Gipuzkoa') || 
      isProvinceMatch(selectedProvince, 'Vizcaya') || 
      isProvinceMatch(selectedProvince, 'Bizkaia') || 
      isProvinceMatch(selectedProvince, 'Álava') || 
      isProvinceMatch(selectedProvince, 'Araba');

    // Descartar posibles duplicados de Otzarreta para que prevalezca el canónico S-Class
    const cleanApi = apiProviders.filter(p => p.id !== 'v-32714' && !p.name?.toLowerCase().includes('otzarreta'));

    const list: ProviderItem[] = [];
    if (isBasqueProvince && (selectedCategory === 'ALL' || selectedCategory === 'finca' || selectedCategory === 'catering')) {
      list.push(SOVEREIGN_OTZARRETA);
    }
    if (selectedCategory !== 'finca') {
      list.push(SOVEREIGN_EDWIN_AGUDELO);
    }
    list.push(...cleanApi);
    return list;
  }, [apiProviders, selectedCategory, selectedProvince]);

  const categories: CategoryItem[] = [
    { id: 'ALL', label: 'Todos los Servicios', count: STATIC_CATEGORY_TOTALS.ALL, icon: Layers },
    { id: 'finca', label: 'Fincas & Espacios', count: STATIC_CATEGORY_TOTALS.finca, icon: Building2 },
    { id: 'catering', label: 'Catering & Gastro', count: STATIC_CATEGORY_TOTALS.catering, icon: UtensilsCrossed },
    { id: 'decoracion', label: 'Decoración & Flores', count: STATIC_CATEGORY_TOTALS.decoracion, icon: Flower2 },
    { id: 'musica', label: 'Música & Artistas', count: STATIC_CATEGORY_TOTALS.musica, icon: Music2 },
    { id: 'sonido', label: 'Sonido & Iluminación', count: STATIC_CATEGORY_TOTALS.sonido, icon: Volume2 },
    { id: 'foto', label: 'Fotografía & Vídeo', count: STATIC_CATEGORY_TOTALS.foto, icon: Video },
    { id: 'wedding', label: 'Wedding Planners', count: STATIC_CATEGORY_TOTALS.wedding, icon: HeartHandshake },
    { id: 'moda', label: 'Moda & Belleza', count: STATIC_CATEGORY_TOTALS.moda, icon: Shirt },
    { id: 'transporte', label: 'Coches & Transporte', count: STATIC_CATEGORY_TOTALS.transporte, icon: Car },
    { id: 'servicios', label: 'Detalles & Recuerdos', count: STATIC_CATEGORY_TOTALS.servicios, icon: Sparkles },
  ];

  // Lista canónica completa de las 52 provincias de España (SSOT)
  const provincesList = useMemo(() => {
    return ALL_SPANISH_PROVINCES;
  }, []);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory('all');
    setCurrentPage(1);
    const params = new URLSearchParams(window.location.search);
    params.delete('subcat');
    params.delete('subcategory');
    if (catId === 'ALL') {
      params.delete('cat');
      params.delete('categoria');
    } else {
      params.set('cat', catId);
    }
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    router.replace(newUrl, { scroll: false });
  };

  const handleSubcategorySelect = (subId: string) => {
    setSelectedSubcategory(subId);
    setCurrentPage(1);
    const params = new URLSearchParams(window.location.search);
    if (subId === 'all') {
      params.delete('subcat');
      params.delete('subcategory');
    } else {
      params.set('subcat', subId);
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

    const activeSpecial = sclassSpecialServices;

    // Solo mostrar servicios destacados de Madrid si el usuario no ha filtrado por otra provincia distinta
    const showMadridSpecials = !selectedProvince || selectedProvince === 'ALL' || isProvinceMatch(selectedProvince, 'Madrid');
    const baseList = (showMadridSpecials && (selectedCategory === 'catering' || selectedCategory === 'ALL'))
      ? [...activeSpecial, ...providersData]
      : providersData;

    return baseList.filter((p) => {
      // 1. Filtrado Semántico de Categoría (Cero resultados perdidos)
      if (selectedCategory !== 'ALL') {
        const pCat = (p.category || '').toLowerCase().trim();
        if (pCat !== selectedCategory.toLowerCase()) {
          const catNormalized = normalizeBodasNetCategory(p.category, p.description, p.name);
          if (catNormalized !== selectedCategory) {
            return false;
          }
        }
      }

      // 2. Filtrado de Provincia
      if (selectedProvince && selectedProvince !== 'ALL') {
        if (!isProvinceMatch(selectedProvince, p.province || '')) {
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

  const effectiveTotal = totalApiProviders > 0
    ? totalApiProviders
    : (STATIC_CATEGORY_TOTALS[selectedCategory] || filteredProviders.length);

  const totalPages = Math.max(1, Math.ceil(effectiveTotal / pageSize));
  // apiProviders ya viene paginado a nivel servidor / fallback estático por currentPage y pageSize
  const paginatedProviders = filteredProviders;

  const openModal = (provider: ProviderItem) => {
    setActiveModalProvider(provider);
    setModalTab('info');
  };

  /** FAQs canónicas del proveedor activo (solo objetos clave→respuesta). */
  const modalFaqs: Record<string, string> | null =
    activeModalProvider && activeModalProvider.faqs && !Array.isArray(activeModalProvider.faqs)
      ? activeModalProvider.faqs
      : null;

  return (
    <div className={`min-h-screen w-full overflow-x-hidden ${
      isAirbnb
        ? 'bg-[#FFFFFF] text-[#222222]'
        : 'bg-[#030305] text-white font-sans selection:bg-[#258DCD] selection:text-black'
    }`}>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HEADER S-CLASS COMPACTO CON MIGAS DE PAN (DE UN VISTAZO)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="max-w-7xl mx-auto px-4 pt-24 md:pt-28 pb-4 mb-4 space-y-3">
        {/* Breadcrumb de navegación */}
        <nav aria-label="Migas de pan" className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
          <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/proveedores" className="hover:underline font-bold text-black dark:text-white">Proveedores</Link>
          {selectedCategory !== 'ALL' && (
            <>
              <span>/</span>
              <span className="text-[#FF385C] uppercase font-bold">{selectedCategory}</span>
            </>
          )}
          {selectedProvince && (
            <>
              <span>/</span>
              <span className="text-[#FF2B44] uppercase font-bold">{selectedProvince}</span>
            </>
          )}
        </nav>

        {isAirbnb ? (
          /* 🔴 HEADER ESTILO AIRBNB */
          <div className="py-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F2] text-[#FF385C] text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles size={13} className="text-[#FF385C]" /> Catálogo Homologado · 13.094 Profesionales
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">
                  Encuentra el mejor proveedor o espacio para tu evento
                </h1>
                <p className="text-[#717171] text-sm max-w-2xl mt-1">
                  Reserva verificada con seguro de RC de 1.000.000 €, rider acústico homologado y depósito de 100 € deducible.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#717171]">
                <span className="px-3 py-1.5 rounded-full bg-[#F7F7F7] border border-[#EBEBEB] flex items-center gap-1.5 font-bold">
                  <ShieldCheck size={14} className="text-[#FF385C]" /> 100% Verificado
                </span>
                <a
                  href={`tel:${CENTRALITA.tel}`}
                  className="px-3 py-1.5 rounded-full bg-[#FFF0F2] border border-[#FFD9E0] text-[#FF385C] flex items-center gap-1.5 font-bold hover:bg-[#FFE3E8] transition-colors"
                >
                  <PhoneCall size={13} /> {CENTRALITA.display}
                </a>
              </div>
            </div>

            {/* BARRA DE BÚSQUEDA FLOTANTE TIPO PÍLL AIRBNB */}
            <div className="pt-2">
              <AirbnbFloatingPillSearchBar
                onSearchChange={({ category, province }) => {
                  if (category) handleCategorySelect(category);
                  if (province !== undefined) setSelectedProvince(province);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        ) : (
          /* 🌙 HEADER CANÓNICO S-CLASS OLED */
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
        )}
      </header>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. FILTROS BENTO Y BARRA DE NAVEGACIÓN COMPACTA
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <main className="max-w-7xl mx-auto px-4 space-y-8 overflow-x-hidden">
        {/* 🌟 AIRBNB NEURAL BOOKING BAR EN MODO OLED */}
        {!isAirbnb && <AirbnbNeuralBookingBar />}

        <BentoFilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          subcategories={selectedCategory === 'finca' ? FINCA_SUBCATEGORIES : (selectedCategory === 'musica' ? MUSICA_SUBCATEGORIES : undefined)}
          selectedSubcategory={selectedSubcategory}
          onSelectSubcategory={handleSubcategorySelect}
          searchQuery={searchQuery}
          onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
          selectedProvince={selectedProvince}
          onProvinceChange={(prov) => { setSelectedProvince(prov); setCurrentPage(1); }}
          provincesList={provincesList}
          totalResults={effectiveTotal}
        />

        {/* BANNER B2B PROPIETARIOS DE FINCAS */}
        {selectedCategory === 'finca' && (
          <div className="bg-gradient-to-r from-[#08080c] via-[#0c1017] to-[#08080c] border border-[#258DCD]/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#258DCD]/10 border border-[#258DCD]/30 flex items-center justify-center text-[#258DCD] shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#258DCD] uppercase tracking-wider font-semibold block">
                  Acceso Exclusivo B2B · Propietarios & Wedding Planners
                </span>
                <p className="text-sm font-bold text-white font-syne">
                  ¿Gestiona una finca, cortijo o recinto para bodas?
                </p>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Homologación técnica S-Class, auditoría acústica 12 W/pax y liquidación garantizada de comisiones (380 € - 570 €) en 7 días hábiles.
                </p>
              </div>
            </div>
            <Link
              href="/fincas"
              className="px-4 py-2.5 rounded-xl bg-[#258DCD] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#258DCD]/90 transition-all shrink-0 flex items-center gap-2 shadow-md shadow-[#258DCD]/20 cursor-pointer"
            >
              <span>Homologar mi Espacio</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            3. ARQUITECTURA BENTO GRID: REJILLA ESTRICTA DE ALTA DENSIDAD
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-[#258DCD] animate-spin" />
            <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
              Sincronizando directorio homologado S-Class...
            </p>
          </div>
        ) : filteredProviders.length === 0 ? (
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
              <div key={provider.id} className="min-w-0 w-full h-full">
                {isAirbnb ? (
                  <AirbnbVendorListingCard
                    vendor={provider}
                    onSelect={() => openModal(provider)}
                    onClaim={(p) => setClaimModalProvider({ ...p, id: String(p.id), phone: p.phone ?? undefined })}
                  />
                ) : (
                  <SClassVendorBodasCard
                    vendor={provider}
                    onSelect={() => openModal(provider)}
                    onClaim={(p) => setClaimModalProvider({ ...p, id: String(p.id), phone: p.phone ?? undefined })}
                  />
                )}
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
              Mostrando <strong className="text-white">{((currentPage - 1) * pageSize) + 1}</strong> - <strong className="text-white">{Math.min(currentPage * pageSize, effectiveTotal).toLocaleString()}</strong> de <strong className="text-[#258DCD]">{effectiveTotal.toLocaleString()}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-[#0a0a0f] border border-neutral-800 text-neutral-200 hover:text-white hover:border-[#258DCD] disabled:text-neutral-400 disabled:bg-[#06060a] disabled:border-neutral-900 disabled:hover:text-neutral-400 disabled:hover:border-neutral-900 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              <span className="px-3.5 py-2 rounded-xl bg-[#08080c] border border-[#258DCD]/30 text-white font-bold">
                Pág. <strong className="text-[#5FBEF0]">{currentPage}</strong> / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-[#0a0a0f] border border-neutral-800 text-neutral-200 hover:text-white hover:border-[#258DCD] disabled:text-neutral-400 disabled:bg-[#06060a] disabled:border-neutral-900 disabled:hover:text-neutral-400 disabled:hover:border-neutral-900 disabled:cursor-not-allowed transition-colors"
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
                {activeModalProvider.address && (
                  <p className="text-sm text-neutral-500 font-mono flex items-center gap-1.5">
                    📍 {activeModalProvider.address}
                  </p>
                )}

                {activeModalProvider.customUrl && (
                  <div className="bg-gradient-to-r from-[#ecb613]/20 via-[#ecb613]/10 to-transparent border border-[#ecb613]/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                    <div>
                      <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-wider font-bold block">
                        ALIANZA ESTRATÉGICA S-CLASS · ACCESO EXCLUSIVO
                      </span>
                      <p className="text-sm font-bold text-white font-syne">
                        {activeModalProvider.customUrl === '/otzarreta'
                          ? 'Ficha Oficial, 126 Landings de Dominancia y Menús 2026'
                          : 'Ficha Oficial, Menús y Reserva Directa'}
                      </p>
                      <p className="text-xs text-neutral-400 font-light mt-0.5 line-clamp-2">
                        {activeModalProvider.description || `${activeModalProvider.province || 'España'} · Proveedor homologado EAR OS con seguro de responsabilidad civil.`}
                      </p>
                    </div>
                    <a
                      href={activeModalProvider.customUrl}
                      className="px-5 py-2.5 rounded-xl bg-[#ecb613] text-black font-mono text-xs font-black uppercase tracking-wider hover:bg-[#ecb613]/90 transition-all shrink-0 flex items-center gap-2 shadow-lg shadow-[#ecb613]/20"
                    >
                      <span>{activeModalProvider.customUrl === '/otzarreta' ? 'Ver Showroom VIP & Menús' : 'Ver Ficha Oficial'}</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                )}
              </div>

              {/* Carrusel Figma High-End S-Class */}
              <div className="shadow-2xl rounded-[2rem] overflow-hidden ring-1 ring-white/10">
                <PremiumMediaCarousel 
                  images={((activeModalProvider.gallery && activeModalProvider.gallery.length > 0)
                    ? activeModalProvider.gallery
                    : (activeModalProvider.imageUrls && activeModalProvider.imageUrls.length > 0)
                      ? activeModalProvider.imageUrls
                      : (activeModalProvider.img ? [activeModalProvider.img] : [])).slice(0, 2)} 
                  providerName={activeModalProvider.name} 
                />
              </div>

              {/* Magic Tabs Estilo Linear/Vercel */}
              <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-mono font-bold relative border-b border-white/5 scrollbar-none">
                {([
                  { id: 'info', label: '📋 Descripción & Contacto' },
                  { id: 'faqs', label: '❓ Preguntas Frecuentes' },
                  { id: 'services', label: `🛠️ Packs & Tarifas (${activeModalProvider.services_list?.length || 0})` },
                  { id: 'garantia', label: '🛡️ Garantía S-Class' }
                ] as const).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id)}
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
                          {activeModalProvider.description_full || activeModalProvider.description || 'Este proveedor aún no ha publicado descripción en su ficha de origen. Solicita información verificada desde el directorio.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                        <div className="bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-5 rounded-2xl border border-white/5">
                          <span className="text-neutral-500 uppercase block mb-1">Contacto Directo</span>
                          {((activeModalProvider.phone || activeModalProvider.telephone) && activeModalProvider.has_real_phone === true) ? (
                            <a href={makeCentralitaWaLink(activeModalProvider.name, activeModalProvider.category, activeModalProvider.province)} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold text-lg hover:text-emerald-300 transition-colors">
                              🔒 Contacto Protegido · Centralita EAR VIP
                            </a>
                          ) : (
                            <a
                              href={activeModalProvider.google_search_url || `https://www.google.com/search?q=${encodeURIComponent(`${activeModalProvider.name} ${activeModalProvider.province || ''} telefono`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 font-bold text-sm hover:text-amber-300 transition-colors inline-flex items-center gap-1.5"
                            >
                              🔍 Buscar Teléfono en Google (1 Clic)
                            </a>
                          )}
                        </div>
                        <div className="bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-5 rounded-2xl border border-white/5">
                          <span className="text-neutral-500 uppercase block mb-1">Desplazamiento</span>
                          <span className="text-white font-bold text-lg">
                            {activeModalProvider.province || 'Madrid'} <span className="text-neutral-500 text-sm font-normal">(Nacional)</span>
                          </span>
                        </div>
                        {activeModalProvider.capacidadMaxPax && (
                          <div className="bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-5 rounded-2xl border border-white/5 sm:col-span-2">
                            <span className="text-neutral-500 uppercase block mb-1">Capacidad Máxima Homologada</span>
                            <span className="text-[#ecb613] font-bold text-lg font-mono">
                              Hasta {activeModalProvider.capacidadMaxPax} comensales en banquete privado
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* PESTAÑA 2: FAQS */}
                  {modalTab === 'faqs' && (
                    <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {modalFaqs && Object.keys(modalFaqs).length > 0 ? (
                        Object.entries(modalFaqs).map(([pregunta, respuesta], qIdx) => (
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
                      basePrice={activeModalProvider.basePrice || (activeModalProvider.price ? parseFloat(String(activeModalProvider.price).replace(/[^\d.-]/g, '')) : undefined) || TARIFA_BASE_SOLISTA_EUR}
                      servicesList={activeModalProvider.services_list || []}
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
                    {typeof activeModalProvider.basePrice === 'number' && activeModalProvider.basePrice > 0
                      ? `${activeModalProvider.basePrice} €`
                      : (activeModalProvider.price ? String(activeModalProvider.price) : 'Consultar')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5 w-full sm:w-auto font-mono text-xs sm:text-sm">
                  {(() => {
                    const directPhone = activeModalProvider.phone || activeModalProvider.telephone;
                    const hasDirect = Boolean(directPhone) && activeModalProvider.has_real_phone === true;
                    const originUrl = activeModalProvider.profile_url || activeModalProvider.sourceUrl;
                    
                    if (hasDirect) {
                      return (
                        <>
                          <a
                            href={makeCentralitaWaLink(activeModalProvider.name, activeModalProvider.category, activeModalProvider.province)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                          >
                            <MessageCircle size={15} />
                            <span>Coordinar vía Centralita VIP</span>
                          </a>
                          <a
                            href={makeCentralitaWaLink(activeModalProvider.name, activeModalProvider.category, activeModalProvider.province)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#ecb613] hover:text-white font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-[#ecb613]/40"
                          >
                            <PhoneCall size={14} />
                            <span>Centralita EAR VIP</span>
                          </a>
                        </>
                      );
                    }
                    return (
                      <>
                        <a
                          href={makeCentralitaWaLink(activeModalProvider.name, activeModalProvider.category, activeModalProvider.province)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#E61E4D] to-[#D70466] text-white font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                        >
                          <PhoneCall size={14} />
                          <span>Localizar vía Centralita</span>
                        </a>
                        <a
                          href={activeModalProvider.google_search_url || `https://www.google.com/search?q=${encodeURIComponent(`${activeModalProvider.name} ${activeModalProvider.province || ''} telefono`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                        >
                          <span>🔍 Google</span>
                        </a>
                        <a
                          href={originUrl || `/reclamar-perfil?name=${encodeURIComponent(activeModalProvider.name)}`}
                          target={originUrl ? '_blank' : undefined}
                          rel={originUrl ? 'noopener noreferrer' : undefined}
                          className="px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-white/10"
                        >
                          <span>🌐 Ficha</span>
                        </a>
                      </>
                    );
                  })()}

                  <Link
                    href={activeModalProvider.customUrl || `/checkout/presupuesto?proveedor=${encodeURIComponent(activeModalProvider.name)}${typeof activeModalProvider.basePrice === 'number' && activeModalProvider.basePrice > 0 ? `&base=${activeModalProvider.basePrice}` : ''}`}
                    className="px-8 py-4 rounded-2xl bg-white hover:bg-neutral-200 text-black font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105"
                  >
                    <Lock size={16} />
                    <span>Bloquear {DEPOSITO_STRIPE_EUR} €</span>
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
          <p className="text-neutral-200 leading-relaxed font-sans text-[11px]">
            Productora EAR opera como directorio público profesional y plataforma de intermediación tecnológica al amparo del 
            <strong> Art. 6.1.f del RGPD</strong> y el régimen de Safe Harbor del <strong>Art. 16 de la Ley 34/2002 (LSSI-CE)</strong>. 
            Los datos comerciales mostrados proceden de fuentes públicas profesionales y tienen como único fin la dinamización de eventos y la derivación de clientes bajo el protocolo soberano <strong>Split 80/10/10</strong> y depósito de 100 € en Stripe Price-Lock.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[10px] text-neutral-300 font-medium pt-2 border-t border-neutral-800">
            <span>¿Eres titular de una ficha?</span>
            <Link href="/reclamar-perfil" className="text-[#258DCD] hover:underline font-bold">
              Reclamar Ficha Gratuita (0 €/mes)
            </Link>
            <span>•</span>
            <span className="text-neutral-300">
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Directorio Homologado de Proveedores EAR OS",
            "description": "Selección de profesionales de España con seguro de RC de 1.000.000 €, rider acústico estandarizado y reserva protegida.",
            "mainEntity": {
              "@type": "CollectionPage",
              "numberOfItems": PROVIDERS_GRAND_TOTAL,
              "isPartOf": {
                "@type": "WebSite",
                "name": "EAR OS"
              }
            }
          })
        }}
      />
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
    </>
  );
}

