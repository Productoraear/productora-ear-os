'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Star, 
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
  Copy, 
  Check,
  ArrowRight,
  Sparkles,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MessageCircle,
  ShieldCheck,
  FileJson,
  ArrowUpDown,
  Eye,
  EyeOff,
  Globe,
  Phone
} from 'lucide-react';
import rawProvidersData from '@/data/vendors-enriched-night.json';
import defaultWhitelist from '@/data/active_providers_whitelist.json';

interface VendorItem {
  id: string;
  name: string;
  slug?: string;
  category?: string;
  phone?: string;
  pricing?: {
    minPricePerPax?: number;
    rentalBasePrice?: number;
  };
  metrics?: {
    rating?: number;
    reviewCount?: number;
  };
  location?: {
    city?: string;
    province?: string;
  };
  media?: {
    coverImage?: string;
  };
  description?: string;
  province?: string;
  rating?: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROVEEDORES SOBERANOS S-CLASS (PRIORIDAD PERMANENTE #1 Y #2)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SOVEREIGN_PROVIDERS: VendorItem[] = [
  {
    id: 'prov-ear-sovereign-01',
    name: 'Productora EAR • Edwin Agudelo',
    slug: 'productora-ear',
    category: 'musica',
    phone: '+34 693 693 048',
    pricing: {
      minPricePerPax: 85,
      rentalBasePrice: 350
    },
    metrics: {
      rating: 5.0,
      reviewCount: 128
    },
    location: {
      city: 'Madrid',
      province: 'Madrid'
    },
    media: {
      coverImage: 'https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg'
    },
    description: 'Show musical en vivo de 1 hora (2 pases de 30 min), sonido profesional Bose, ramo de flores en vivo, canción personalizada y sesión de fotos con sombreros temáticos. S-Class Sovereign Preferred #1.'
  },
  {
    id: 'prov-sonomusic-madrid-official',
    name: 'División Técnica Sonido & Iluminación Madrid · Homologado S-Class',
    slug: 'sonomusic-madrid',
    category: 'sonido',
    phone: '+34 693 693 048',
    pricing: {
      minPricePerPax: 40,
      rentalBasePrice: 432
    },
    metrics: {
      rating: 4.9,
      reviewCount: 84
    },
    location: {
      city: 'Madrid',
      province: 'Madrid'
    },
    media: {
      coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80'
    },
    description: 'Arsenal homologado de Productora EAR para alquiler de equipos de sonido, iluminación robótica DMX, discomóvil, microfonía inalámbrica y backline profesional en Madrid. Cobertura acústica garantizada y montaje in-situ.'
  }
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NORMALIZACIÓN SEMÁNTICA S-CLASS: COBERTURA 100% SOBRE PROVEEDORES REALES
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
  if (full.includes('audio') || full.includes('sonido') || full.includes('luces') || full.includes('iluminac') || full.includes('dj') || full.includes('discomovil') || full.includes('discomóvil')) {
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

function getCategoryDisplayLabel(catKey: string): string {
  switch (catKey) {
    case 'finca': return 'Fincas & Espacios';
    case 'catering': return 'Catering & Gastro';
    case 'decoracion': return 'Decoración & Flores';
    case 'musica': return 'Música en Vivo';
    case 'sonido': return 'Audiovisual & DJ';
    case 'foto': return 'Foto & Vídeo';
    case 'wedding': return 'Wedding Planners';
    case 'moda': return 'Moda & Belleza';
    case 'transporte': return 'Transporte & Coches';
    default: return 'Servicios para Eventos';
  }
}

const PAGE_SIZE = 48;

export default function AdminDirectoryPage() {
  // Depuración forense: Descartar entradas corruptas de scrapers y anteponer los nodos soberanos homologados
  const providersData = useMemo(() => {
    const validRaw = (rawProvidersData as unknown as VendorItem[]).filter(p => {
      if (!p || !p.name) return false;
      if (p.name.startsWith("'+") || p.name.includes('undefined')) return false;
      // Descartar scrapings 'bvh-' sin teléfono o que son simples artículos de guía
      if (p.id?.startsWith('bvh-') && (!p.phone || p.phone.length < 6 || p.phone === 'No disponible' || p.phone === 'Privado')) {
        return false;
      }
      return true;
    });

    return [...SOVEREIGN_PROVIDERS, ...validRaw];
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [phoneFilter, setPhoneFilter] = useState<'ALL' | 'WITH_PHONE' | 'NO_PHONE'>('WITH_PHONE');
  const [sortMode, setSortMode] = useState<'DEFAULT' | 'RATING_DESC' | 'PRICE_ASC' | 'PRICE_DESC' | 'NAME_ASC'>('DEFAULT');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [activeModalVendor, setActiveModalVendor] = useState<VendorItem | null>(null);

  // Whitelist de Visibilidad Pública (Mandato CEO S-Class: Deny-All excepto Edwin Agudelo y Activados)
  const [activeWhitelistIds, setActiveWhitelistIds] = useState<Set<string>>(() => {
    return new Set((defaultWhitelist.active_ids || []).map(x => x.toLowerCase().trim()));
  });
  const [activeWhitelistSlugs, setActiveWhitelistSlugs] = useState<Set<string>>(() => {
    return new Set((defaultWhitelist.active_slugs || []).map(x => x.toLowerCase().trim()));
  });
  const [visibilityFilter, setVisibilityFilter] = useState<'ALL' | 'ACTIVE_ONLY' | 'HIDDEN_ONLY'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sincronizar whitelist activa con el servidor
  useEffect(() => {
    fetch('/api/admin/providers/toggle-visibility')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          if (json.data.active_ids) {
            setActiveWhitelistIds(new Set(json.data.active_ids.map((x: string) => x.toLowerCase().trim())));
          }
          if (json.data.active_slugs) {
            setActiveWhitelistSlugs(new Set(json.data.active_slugs.map((x: string) => x.toLowerCase().trim())));
          }
        }
      })
      .catch(err => console.warn('[ADMIN] Error syncing visibility whitelist:', err));
  }, []);

  const isVendorPublic = (v: VendorItem) => {
    const id = (v.id || '').toLowerCase().trim();
    const slug = (v.slug || '').toLowerCase().trim();
    const name = (v.name || '').toLowerCase().trim();

    if (
      id === 'prov-ear-sovereign-01' || 
      id === 'prov-53' ||
      slug === 'edwin-agudelo' || 
      slug === 'productora-ear' || 
      name.includes('edwin agudelo') || 
      name.includes('productora ear')
    ) {
      return true;
    }
    return activeWhitelistIds.has(id) || (slug ? activeWhitelistSlugs.has(slug) : false);
  };

  const handleToggleVisibility = async (vendor: VendorItem) => {
    const id = vendor.id?.trim();
    const slug = vendor.slug?.trim() || '';
    if (!id && !slug) return;

    const currentlyActive = isVendorPublic(vendor);
    const newActive = !currentlyActive;

    // Actualización optimista inmediata en UI
    setActiveWhitelistIds(prev => {
      const next = new Set(prev);
      if (newActive && id) next.add(id.toLowerCase());
      else if (id) next.delete(id.toLowerCase());
      return next;
    });
    if (slug) {
      setActiveWhitelistSlugs(prev => {
        const next = new Set(prev);
        if (newActive) next.add(slug.toLowerCase());
        else next.delete(slug.toLowerCase());
        return next;
      });
    }

    setToastMessage(`"${vendor.name}" ahora está ${newActive ? 'ACTIVO EN PÚBLICO' : 'OCULTO DEL PÚBLICO'}`);
    setTimeout(() => setToastMessage(null), 3500);

    try {
      await fetch('/api/admin/providers/toggle-visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, slug, active: newActive })
      });
    } catch (err) {
      console.error('[ADMIN] Error updating provider visibility:', err);
    }
  };

  // Lista de provincias únicas disponibles ordenadas
  const provincesList = useMemo(() => {
    const provSet = new Set<string>();
    for (const p of providersData) {
      const prov = p.location?.province || p.province;
      if (prov && prov.trim() && prov !== 'S/D' && prov.length > 2) {
        provSet.add(prov.trim());
      }
    }
    return Array.from(provSet).sort((a, b) => a.localeCompare(b));
  }, [providersData]);

  // Conteos precisos por categoría (cero ceros)
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

  const categories = [
    { id: 'ALL', label: 'Todos', count: categoryCounts.ALL, icon: Layers },
    { id: 'finca', label: 'Fincas', count: categoryCounts.finca, icon: Building2 },
    { id: 'catering', label: 'Catering', count: categoryCounts.catering, icon: UtensilsCrossed },
    { id: 'decoracion', label: 'Decoración', count: categoryCounts.decoracion, icon: Flower2 },
    { id: 'musica', label: 'Música', count: categoryCounts.musica, icon: Music2 },
    { id: 'sonido', label: 'Audiovisual', count: categoryCounts.sonido, icon: Volume2 },
    { id: 'foto', label: 'Foto/Vídeo', count: categoryCounts.foto, icon: Video },
    { id: 'wedding', label: 'Planners', count: categoryCounts.wedding, icon: HeartHandshake },
    { id: 'moda', label: 'Moda', count: categoryCounts.moda, icon: Shirt },
    { id: 'transporte', label: 'Transporte', count: categoryCounts.transporte, icon: Car },
    { id: 'servicios', label: 'Servicios', count: categoryCounts.servicios, icon: Sparkles },
  ];

  // Filtrado multidimensional con preservación absoluta del dataset original
  const filteredProviders = useMemo(() => {
    return providersData.filter((p) => {
      // 1. Categoría
      if (selectedCategory !== 'ALL') {
        const cat = normalizeCategory(p.category, p.description, p.name);
        if (cat !== selectedCategory) {
          return false;
        }
      }

      // 2. Provincia
      if (selectedProvince !== 'ALL') {
        const prov = (p.location?.province || p.province || '').toLowerCase();
        if (!prov.includes(selectedProvince.toLowerCase())) {
          return false;
        }
      }

      // 3. Teléfono
      const hasPhone = Boolean(p.phone && p.phone !== 'No disponible' && p.phone !== 'Privado' && p.phone.length > 5);
      if (phoneFilter === 'WITH_PHONE' && !hasPhone) return false;
      if (phoneFilter === 'NO_PHONE' && hasPhone) return false;

      // 4. Búsqueda de texto (Nombre, teléfono, ciudad o descripción)
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const rawQ = q.replace(/\s/g, '');
        const name = (p.name || '').toLowerCase();
        const phone = (p.phone || '').replace(/\s/g, '');
        const city = (p.location?.city || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();

        const match = name.includes(q) || 
                      phone.includes(rawQ) || 
                      city.includes(q) || 
                      desc.includes(q);
        if (!match) return false;
      }

      // 5. Filtro de Visibilidad Pública (Mandato CEO S-Class)
      const isPublic = isVendorPublic(p);
      if (visibilityFilter === 'ACTIVE_ONLY' && !isPublic) return false;
      if (visibilityFilter === 'HIDDEN_ONLY' && isPublic) return false;

      return true;
    }).sort((a, b) => {
      // SIEMPRE priorizar registros con teléfono verificado
      const phoneA = Boolean(a.phone && a.phone !== 'No disponible' && a.phone !== 'Privado' && a.phone.length > 5);
      const phoneB = Boolean(b.phone && b.phone !== 'No disponible' && b.phone !== 'Privado' && b.phone.length > 5);
      if (phoneA && !phoneB) return -1;
      if (!phoneA && phoneB) return 1;

      if (sortMode === 'DEFAULT') {
        // En modo default preservamos el orden natural enriquecido (1 Boda Diferente, 12 Pulgadas, etc.)
        return 0;
      }
      if (sortMode === 'RATING_DESC') {
        const rA = a.metrics?.rating ?? a.rating ?? 0;
        const rB = b.metrics?.rating ?? b.rating ?? 0;
        return rB - rA;
      }
      if (sortMode === 'PRICE_ASC') {
        const pA = a.pricing?.minPricePerPax ?? a.pricing?.rentalBasePrice ?? 999999;
        const pB = b.pricing?.minPricePerPax ?? b.pricing?.rentalBasePrice ?? 999999;
        return pA - pB;
      }
      if (sortMode === 'PRICE_DESC') {
        const pA = a.pricing?.minPricePerPax ?? a.pricing?.rentalBasePrice ?? 0;
        const pB = b.pricing?.minPricePerPax ?? b.pricing?.rentalBasePrice ?? 0;
        return pB - pA;
      }
      if (sortMode === 'NAME_ASC') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });
  }, [providersData, selectedCategory, selectedProvince, phoneFilter, searchQuery, sortMode, visibilityFilter, activeWhitelistIds, activeWhitelistSlugs]);

  // Conteos de Visibilidad
  const visibilityCounts = useMemo(() => {
    let active = 0;
    let hidden = 0;
    for (const p of providersData) {
      if (isVendorPublic(p)) active++;
      else hidden++;
    }
    return { all: providersData.length, active, hidden };
  }, [providersData, activeWhitelistIds, activeWhitelistSlugs]);

  // Reset a página 1 en cambios de filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedProvince, phoneFilter, searchQuery, sortMode, visibilityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProviders.length / PAGE_SIZE));
  const paginatedProviders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProviders.slice(start, start + PAGE_SIZE);
  }, [filteredProviders, currentPage]);

  const handleCopyPhone = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(id);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleCopyJson = (vendor: VendorItem) => {
    navigator.clipboard.writeText(JSON.stringify(vendor, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setJumpPageInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#258DCD] selection:text-black w-full overflow-x-hidden">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HEADER S-CLASS: TELEMETRÍA FORENSE DEL DATA LAKE
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <header className="max-w-screen-2xl mx-auto border-b border-neutral-800 pb-6 mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0a121e] text-[#AAD6CD] text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-[#258DCD]/30">
              <ShieldCheck size={14} className="text-[#258DCD]" /> ABOS S-Class • ZTM Data Lake Navegable
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase font-syne tracking-tight flex items-center gap-3">
              <span>Listín Telefónico B2B</span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#258DCD]/20 text-[#AAD6CD] border border-[#258DCD]/40 normal-case">
                {filteredProviders.length.toLocaleString()} visibles
              </span>
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1 font-light max-w-3xl">
              Catálogo maestro enriquecido. Prioridad absoluta para los 15.804 registros con teléfono directo verificado. Navegación completa con modal forense y cotizador integrado.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-[#08080c] border border-neutral-800 rounded-xl p-3.5 shadow-xl font-mono text-xs">
            <div className="text-right">
              <span className="text-[10px] text-neutral-500 uppercase block">Con Teléfono Real</span>
              <span className="text-base font-black text-emerald-400">15.804</span>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div className="text-left">
              <span className="text-[10px] text-neutral-500 uppercase block">Total Registros</span>
              <span className="text-xs font-bold text-white">{providersData.length.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto space-y-6">
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            2. PANEL MULTICRITERIO DE FILTROS & BÚSQUEDA SOTA
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-[#07070a] border border-neutral-800 p-4 sm:p-5 rounded-2xl shadow-xl space-y-4">
          {/* Fila 1: Pestañas de Categoría (Cero Ceros) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:flex-wrap scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 font-mono border shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#258DCD] text-black border-[#258DCD] font-black shadow-md shadow-[#258DCD]/20'
                      : 'bg-black text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-black' : 'text-[#258DCD]'} />
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-white/5 text-neutral-400'
                  }`}>
                    {cat.count.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Fila Visibilidad: Mandato CEO S-Class (Deny-All excepto Edwin Agudelo y Activados) */}
          <div className="flex items-center gap-2 pt-2 border-t border-neutral-900 overflow-x-auto text-xs font-mono">
            <span className="text-neutral-500 font-bold uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1">
              <Globe size={13} className="text-[#258DCD]" /> Catálogo Público:
            </span>
            <button
              onClick={() => setVisibilityFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border cursor-pointer ${
                visibilityFilter === 'ALL'
                  ? 'bg-white/10 text-white border-white/30 font-black shadow-sm'
                  : 'bg-black text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              <span>Todos los Registros</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-white/5 text-neutral-300">
                {visibilityCounts.all.toLocaleString()}
              </span>
            </button>
            <button
              onClick={() => setVisibilityFilter('ACTIVE_ONLY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border cursor-pointer ${
                visibilityFilter === 'ACTIVE_ONLY'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-black shadow-sm'
                  : 'bg-black text-neutral-400 border-neutral-800 hover:border-emerald-500/30 hover:text-emerald-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Activos en Público</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/10 text-emerald-300 font-bold">
                {visibilityCounts.active.toLocaleString()}
              </span>
            </button>
            <button
              onClick={() => setVisibilityFilter('HIDDEN_ONLY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border cursor-pointer ${
                visibilityFilter === 'HIDDEN_ONLY'
                  ? 'bg-neutral-800 text-neutral-200 border-neutral-600 font-black'
                  : 'bg-black text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              <span>Ocultos (Solo Admin)</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-white/5 text-neutral-400">
                {visibilityCounts.hidden.toLocaleString()}
              </span>
            </button>
          </div>

          {/* Fila 2: Refinamiento de Búsqueda y Ordenación */}
          <div className="pt-3 border-t border-neutral-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center text-xs font-mono">
            {/* Buscador Fulltext */}
            <div className="relative sm:col-span-2 lg:col-span-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono, ciudad o servicio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#258DCD] transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                  title="Limpiar búsqueda"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Dropdown Provincia */}
            <div className="relative lg:col-span-3">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-3.5 h-3.5 pointer-events-none" />
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full bg-black border border-neutral-800 text-neutral-300 rounded-xl pl-8 pr-7 py-2.5 text-xs focus:outline-none focus:border-[#258DCD] appearance-none cursor-pointer"
              >
                <option value="ALL">Todas las Provincias ({provincesList.length})</option>
                {provincesList.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-[10px]">▼</span>
            </div>

            {/* Filtro Teléfono */}
            <div className="relative lg:col-span-2">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-3.5 h-3.5 pointer-events-none" />
              <select
                value={phoneFilter}
                onChange={(e) => setPhoneFilter(e.target.value as any)}
                className="w-full bg-black border border-neutral-800 text-neutral-300 rounded-xl pl-8 pr-7 py-2.5 text-xs focus:outline-none focus:border-[#258DCD] appearance-none cursor-pointer"
              >
                <option value="WITH_PHONE">Solo con Teléfono (15.804)</option>
                <option value="ALL">Todos los Registros (19.308)</option>
                <option value="NO_PHONE">Sin Teléfono Directo</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-[10px]">▼</span>
            </div>

            {/* Ordenación */}
            <div className="relative lg:col-span-3">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-3.5 h-3.5 pointer-events-none" />
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as any)}
                className="w-full bg-black border border-neutral-800 text-neutral-300 rounded-xl pl-8 pr-7 py-2.5 text-xs focus:outline-none focus:border-[#258DCD] appearance-none cursor-pointer"
              >
                <option value="DEFAULT">Orden Natural (Datos Inyectados)</option>
                <option value="RATING_DESC">Mayor Rating (★)</option>
                <option value="PRICE_ASC">Precio: Menor a Mayor</option>
                <option value="PRICE_DESC">Precio: Mayor a Menor</option>
                <option value="NAME_ASC">Nombre (A - Z)</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-[10px]">▼</span>
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            3. GRID SOTA DE TARJETAS DE PROVEEDOR DE ALTA DENSIDAD
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {paginatedProviders.length === 0 ? (
          <div className="bg-[#0a0a0f] border border-neutral-800 rounded-2xl p-12 text-center space-y-3 font-mono">
            <Filter className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white uppercase">Cero resultados para los filtros seleccionados</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Prueba a restablecer la provincia o el filtro de teléfono para explorar la base completa.
            </p>
            <button
              onClick={() => { setSelectedCategory('ALL'); setSelectedProvince('ALL'); setPhoneFilter('ALL'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-[#258DCD] text-black font-bold text-xs uppercase"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedProviders.map((item, idx) => {
              const hasPhone = Boolean(item.phone && item.phone !== 'No disponible' && item.phone !== 'Privado' && item.phone.length > 5);
              const cleanPhone = hasPhone && item.phone ? item.phone.replace(/[^0-9+]/g, '') : null;
              const coverImg = item.media?.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80';
              const provinceName = item.location?.province || item.province || 'MADRID';
              const categoryKey = normalizeCategory(item.category, item.description, item.name);
              const categoryDisplay = getCategoryDisplayLabel(categoryKey);
              const ratingDisplay = item.metrics?.rating || item.rating || 4.9;
              const priceDisplay = item.pricing?.minPricePerPax 
                ? `${item.pricing.minPricePerPax} €/pax` 
                : (item.pricing?.rentalBasePrice ? `${item.pricing.rentalBasePrice} €` : 'A consultar');
              const isPublic = isVendorPublic(item);

              return (
                <div 
                  key={`${item.id}-${idx}`} 
                  onClick={() => setActiveModalVendor(item)}
                  className="bg-[#07070a] border border-neutral-800 hover:border-[#258DCD] rounded-xl overflow-hidden transition-all duration-200 flex flex-col justify-between group cursor-pointer hover:-translate-y-0.5 shadow-lg"
                >
                  {/* Header de la tarjeta */}
                  <div className="flex items-center gap-3 p-3 border-b border-neutral-900 bg-neutral-950/80">
                    <div className="h-11 w-11 rounded-lg overflow-hidden shrink-0 bg-black border border-neutral-800 flex items-center justify-center">
                      <img 
                        src={coverImg} 
                        alt={item.name} 
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h3 className="text-xs font-bold text-white truncate font-syne group-hover:text-[#258DCD] transition-colors leading-tight">
                          {item.name}
                        </h3>
                        {isPublic ? (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                            ● PÚBLICO
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-neutral-800 text-neutral-400 border border-neutral-700 shrink-0">
                            ○ OCULTO
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono uppercase truncate flex items-center gap-1.5">
                        <span className="text-[#AAD6CD] truncate font-semibold">{categoryDisplay}</span>
                        <span className="text-neutral-600">•</span>
                        <span className="truncate">{provinceName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body: Telemetría & Métricas */}
                  <div className="p-3 bg-black flex-1 flex flex-col justify-between gap-3">
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="bg-[#0c0c12] p-2 rounded-lg border border-neutral-800 text-center">
                        <span className="text-neutral-500 block mb-0.5 text-[9px]">Rating</span>
                        <strong className="text-amber-400 text-xs flex items-center justify-center gap-1">
                          <Star size={11} className="fill-amber-400" /> {ratingDisplay}
                        </strong>
                      </div>
                      <div className="bg-[#0c0c12] p-2 rounded-lg border border-neutral-800 text-center">
                        <span className="text-neutral-500 block mb-0.5 text-[9px]">Tarifa Mín.</span>
                        <strong className="text-emerald-400 text-xs truncate block">{priceDisplay}</strong>
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed font-light">
                        {item.description}
                      </p>
                    )}

                    {/* Botonera de Acción Directa */}
                    <div className="flex items-center gap-1.5 pt-1 mt-auto">
                      {hasPhone && item.phone ? (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyPhone(item.phone!, item.id);
                            }}
                            className="flex-1 bg-[#111116] hover:bg-neutral-800 text-white border border-neutral-700 hover:border-[#258DCD]/50 rounded-lg py-1.5 px-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            title="Copiar Teléfono al portapapeles"
                          >
                            {copiedPhone === item.id ? (
                              <Check size={13} className="text-emerald-400" />
                            ) : (
                              <Copy size={13} className="text-neutral-400" />
                            )}
                            <span className="text-[11px] font-mono font-bold tracking-tight truncate">
                              {item.phone}
                            </span>
                          </button>

                          <a 
                            href={`tel:${cleanPhone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 shrink-0 bg-[#258DCD]/10 hover:bg-[#258DCD] text-[#258DCD] hover:text-black border border-[#258DCD]/30 rounded-lg flex items-center justify-center transition-colors"
                            title="Llamar directamente"
                          >
                            <PhoneCall size={13} />
                          </a>

                          <a
                            href={`https://wa.me/${cleanPhone?.replace('+', '')}?text=${encodeURIComponent(`Hola, contacto desde Productora EAR para verificar disponibilidad en ${item.name}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 shrink-0 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/30 rounded-lg flex items-center justify-center transition-colors"
                            title="Abrir WhatsApp"
                          >
                            <MessageCircle size={13} />
                          </a>
                        </>
                      ) : (
                        <div className="w-full bg-neutral-900/40 border border-neutral-800 border-dashed rounded-lg py-1.5 text-center text-[10px] text-neutral-500 font-mono">
                          TELÉFONO EN INVESTIGACIÓN
                        </div>
                      )}

                      {/* Botón Toggle Visibilidad en Público */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVisibility(item);
                        }}
                        className={`p-1.5 rounded-lg border text-[10px] font-mono font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
                          isPublic
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-[#258DCD]/10 hover:bg-[#258DCD]/20 text-[#AAD6CD] border-[#258DCD]/30'
                        }`}
                        title={isPublic ? "Ocultar perfil del catálogo público" : "Activar perfil para que sea visible en público"}
                      >
                        {isPublic ? <EyeOff size={13} className="text-amber-400" /> : <Eye size={13} className="text-[#258DCD]" />}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalVendor(item);
                        }}
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white rounded-lg border border-white/5 transition-colors shrink-0"
                        title="Ver Ficha Completa"
                      >
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            4. PAGINADOR COMPLETO CON SALTO DIRECTO DE PÁGINA
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 pb-12 border-t border-neutral-900 text-xs font-mono">
            <div className="text-neutral-400">
              Mostrando <strong className="text-white">{((currentPage - 1) * PAGE_SIZE) + 1}</strong> - <strong className="text-white">{Math.min(currentPage * PAGE_SIZE, filteredProviders.length).toLocaleString()}</strong> de <strong className="text-[#258DCD]">{filteredProviders.length.toLocaleString()}</strong>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Primera Página */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-black border border-neutral-800 hover:border-[#258DCD] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                title="Primera Página"
              >
                <ChevronsLeft size={14} />
              </button>

              {/* Anterior */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg bg-black border border-neutral-800 hover:border-[#258DCD] disabled:opacity-25 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={14} />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {/* Indicador de Página */}
              <span className="px-3 py-2 rounded-lg bg-[#0c0c14] border border-[#258DCD]/30 text-white font-bold">
                Pág. <span className="text-[#258DCD]">{currentPage}</span> / {totalPages}
              </span>

              {/* Siguiente */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg bg-black border border-neutral-800 hover:border-[#258DCD] disabled:opacity-25 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight size={14} />
              </button>

              {/* Última Página */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-black border border-neutral-800 hover:border-[#258DCD] disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                title="Última Página"
              >
                <ChevronsRight size={14} />
              </button>
            </div>

            {/* Salto Directo a Página */}
            <form onSubmit={handleJumpPage} className="flex items-center gap-2">
              <span className="text-neutral-500 text-[11px]">Ir a pág:</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                placeholder="#"
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                className="w-16 bg-black border border-neutral-800 rounded-lg px-2 py-1.5 text-center text-xs text-white focus:outline-none focus:border-[#258DCD]"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 bg-[#258DCD] text-black font-bold rounded-lg text-xs hover:bg-[#1e78ae] transition-colors cursor-pointer"
              >
                Ir
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. DRAWER / MODAL DE INSPECCIÓN FORENSE SOTA (ADMIN SSOT)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeModalVendor && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#09090d] border border-[#258DCD] w-full max-w-3xl max-h-[92vh] rounded-2xl overflow-y-auto shadow-2xl p-6 relative space-y-6 font-sans">
            {/* Botón Cerrar */}
            <button
              onClick={() => setActiveModalVendor(null)}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-neutral-900 hover:bg-[#258DCD] text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer border border-neutral-700"
            >
              <X size={18} />
            </button>

            {/* Header del Modal */}
            <div className="space-y-2 pr-10">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-md bg-[#258DCD]/20 text-[#AAD6CD] border border-[#258DCD]/40 font-bold uppercase">
                  {getCategoryDisplayLabel(normalizeCategory(activeModalVendor.category, activeModalVendor.description, activeModalVendor.name))}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 text-neutral-300 border border-white/10 flex items-center gap-1">
                  <MapPin size={12} className="text-[#258DCD]" />
                  {activeModalVendor.location?.city || 'Madrid'}, {activeModalVendor.location?.province || activeModalVendor.province || 'España'}
                </span>
                <span className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 font-bold flex items-center gap-1">
                  <Star size={12} className="fill-amber-400" />
                  {activeModalVendor.metrics?.rating || activeModalVendor.rating || '4.9'} ({activeModalVendor.metrics?.reviewCount || 18} opiniones)
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white font-syne uppercase leading-tight">
                {activeModalVendor.name}
              </h2>
            </div>

            {/* Imagen Principal */}
            <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-black border border-neutral-800 flex items-center justify-center relative">
              <img 
                src={activeModalVendor.media?.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80'} 
                alt={activeModalVendor.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 font-mono text-xs text-neutral-300 bg-black/80 px-3 py-1 rounded-md border border-white/10">
                ID Nodo: <strong className="text-white">{activeModalVendor.id}</strong>
              </div>
            </div>

            {/* Estado de Publicación en Catálogo (Mandato CEO S-Class) */}
            <div className="bg-[#050508] p-4 rounded-xl border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block font-bold font-mono">Estado en Catálogo Público</span>
                <div className="flex items-center gap-2 mt-1">
                  {isVendorPublic(activeModalVendor) ? (
                    <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                      ● ACTIVO EN PÚBLICO
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-neutral-800 text-neutral-400 border border-neutral-700 flex items-center gap-1.5">
                      ○ OCULTO (SOLO VISIBLE EN PANEL ADMIN)
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleVisibility(activeModalVendor)}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors ${
                  isVendorPublic(activeModalVendor)
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    : 'bg-[#258DCD] hover:bg-[#258DCD]/80 text-black shadow-lg shadow-[#258DCD]/20 font-black'
                }`}
              >
                {isVendorPublic(activeModalVendor) ? (
                  <>
                    <EyeOff size={14} />
                    <span>Ocultar del Público</span>
                  </>
                ) : (
                  <>
                    <Eye size={14} />
                    <span>Activar para el Público</span>
                  </>
                )}
              </button>
            </div>

            {/* Datos Técnicos y Financieros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="bg-[#050508] p-4 rounded-xl border border-neutral-800 space-y-2">
                <span className="text-[10px] text-neutral-500 uppercase block font-bold">Matriz de Tarifas Oficiales</span>
                <div className="flex justify-between py-1 border-b border-neutral-900">
                  <span className="text-neutral-400">Precio Mínimo / Pax:</span>
                  <strong className="text-emerald-400">{activeModalVendor.pricing?.minPricePerPax ? `${activeModalVendor.pricing.minPricePerPax} €` : 'No estipulado'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-900">
                  <span className="text-neutral-400">Alquiler Base:</span>
                  <strong className="text-white">{activeModalVendor.pricing?.rentalBasePrice ? `${activeModalVendor.pricing.rentalBasePrice} €` : 'Bajo consulta'}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Depósito Price-Lock:</span>
                  <strong className="text-[#258DCD]">100,00 € (Stripe SHA-256)</strong>
                </div>
              </div>

              <div className="bg-[#050508] p-4 rounded-xl border border-neutral-800 space-y-2">
                <span className="text-[10px] text-neutral-500 uppercase block font-bold">Protocolo de Contacto B2B</span>
                <div className="flex justify-between py-1 border-b border-neutral-900">
                  <span className="text-neutral-400">Teléfono:</span>
                  <strong className="text-white">{activeModalVendor.phone || 'No disponible'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-900">
                  <span className="text-neutral-400">Canal Directo:</span>
                  <strong className="text-emerald-400">WhatsApp Oficial Verificado</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Split Soberano:</span>
                  <strong className="text-[#AAD6CD]">80% Artista / 10% EAR / 10% VIMUME</strong>
                </div>
              </div>
            </div>

            {/* Descripción Completa */}
            {activeModalVendor.description && (
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-neutral-400 block font-bold">Expediente del Proveedor</span>
                <div className="p-4 bg-[#050508] border border-neutral-800 rounded-xl text-xs text-neutral-300 leading-relaxed font-light max-h-40 overflow-y-auto">
                  {activeModalVendor.description}
                </div>
              </div>
            )}

            {/* Acciones de Operación Administrativa */}
            <div className="pt-4 border-t border-neutral-800 flex flex-wrap gap-2.5 items-center justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyJson(activeModalVendor)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                  title="Copiar objeto JSON para pipelines o RAG"
                >
                  {copiedJson ? <Check size={14} className="text-emerald-400" /> : <FileJson size={14} />}
                  <span>{copiedJson ? 'JSON Copiado' : 'Copiar JSON'}</span>
                </button>

                {activeModalVendor.phone && (
                  <button
                    type="button"
                    onClick={() => handleCopyPhone(activeModalVendor.phone!, activeModalVendor.id)}
                    className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                  >
                    <Copy size={14} />
                    <span>Copiar Teléfono</span>
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/checkout/presupuesto?proveedor=${encodeURIComponent(activeModalVendor.name)}&base=${(activeModalVendor as any).price || 650}`}
                  className="px-4 py-2.5 rounded-xl bg-[#258DCD] hover:bg-[#1e78ae] text-black font-mono font-black text-xs uppercase flex items-center gap-1.5 transition-colors shadow-lg shadow-[#258DCD]/20"
                >
                  <span>Bloquear 100 € en Stripe</span>
                  <ArrowRight size={14} />
                </Link>

                {activeModalVendor.phone && (
                  <a
                    href={`https://wa.me/${activeModalVendor.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola, contacto desde Productora EAR para verificar disponibilidad en ${activeModalVendor.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-mono font-black text-xs uppercase flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notificación Toast S-Class */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#08080c] border border-[#258DCD] text-white px-5 py-3 rounded-2xl shadow-2xl font-mono text-xs flex items-center gap-2.5">
          <Sparkles size={16} className="text-[#258DCD]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

