'use client';

import React, { useState, useMemo, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ShieldCheck, Zap, PhoneCall, Truck, Award, 
  Eye, Layers, Search, Filter, CheckCircle2, ChevronRight, 
  Lock, Loader2, CreditCard, X, ExternalLink, ChevronLeft, ArrowRight
} from 'lucide-react';
import type { ChristmasLightingProduct } from '@/data/luces-navidad';
import { createB2GLightingCheckout } from '@/app/actions/vipCheckoutActions';

interface Props {
  products: ChristmasLightingProduct[];
  categories: string[];
  initialCategory?: string;
}

// Portadas oficiales por categoría extraídas de las páginas del catálogo
const CATEGORY_COVERS: Record<string, { page: number; image: string; desc: string }> = {
  "Motivos 3D Gigantes": {
    page: 2,
    image: "/images/demetrio/page_2.jpg",
    desc: "Carrozas, portales de osos, pingüinos y muñecos de nieve transitables"
  },
  "Conos y Árboles Gigantes 3D": {
    page: 15,
    image: "/images/demetrio/page_15.jpg",
    desc: "Estructuras cónicas y árboles monumentales para plazas consistoriales"
  },
  "Motivos 2D y Arcos de Calle": {
    page: 35,
    image: "/images/demetrio/page_35.jpg",
    desc: "Arcos de calle transversales, motivos para báculos de farola y avenidas"
  },
  "Esferas 3D Plegables": {
    page: 20,
    image: "/images/demetrio/page_20.jpg",
    desc: "Esferas transitables y bolas luminosas 3D de gran volumen"
  },
  "Árboles y Almendros LED": {
    page: 50,
    image: "/images/demetrio/page_50.jpg",
    desc: "Árboles escultóricos con ramas micro-LED blanco cálido y puro"
  },
  "Twinkly Pro Smart LED": {
    page: 70,
    image: "/images/demetrio/page_70.jpg",
    desc: "Tecnología mapeable direccionable RGB+AWW con control cloud"
  },
  "Cortinas y Mallas LED": {
    page: 85,
    image: "/images/demetrio/page_85.jpg",
    desc: "Cascadas de luz y mallas de alta densidad para fachadas y arbolado"
  },
  "Guirnaldas Profesionales": {
    page: 95,
    image: "/images/demetrio/page_95.jpg",
    desc: "Cordones LED estancos IP67 de alta resistencia mecánica y climática"
  },
  "Elementos Decorativos y Bolas": {
    page: 110,
    image: "/images/demetrio/page_110.jpg",
    desc: "Motivos decorativos autónomos para suelo y galerías comerciales"
  },
  "Motivos Plásticos / Biodegradables": {
    page: 125,
    image: "/images/demetrio/page_125.jpg",
    desc: "Diseños sostenibles en biopolímeros reciclables para licitaciones verdes"
  },
  "Accesorios y Montaje": {
    page: 140,
    image: "/images/demetrio/page_140.jpg",
    desc: "Fuentes de alimentación 24V/230V, conectores estancos y controladores"
  },
  "Iluminación de Farolas y Columnas": {
    page: 25,
    image: "/images/demetrio/page_35.jpg",
    desc: "Banderolas verticales LED para báculos de farola y avenidas urbanas"
  },
  "Guirnaldas, Cortinas y Cielo LED": {
    page: 85,
    image: "/images/demetrio/page_85.jpg",
    desc: "Cascadas de luz, mallas de alta densidad y cielos luminosos para plazas"
  },
  "Árboles Gigantes y Estructuras Cónicas": {
    page: 15,
    image: "/images/demetrio/page_15.jpg",
    desc: "Estructuras cónicas y árboles monumentales transitables"
  },
  "Portales y Esculturas Transitables": {
    page: 4,
    image: "/images/demetrio/page_4.jpg",
    desc: "Portales de osos, túneles walk-through y carrozas monumentales transitables"
  }
};

const ITEMS_PER_PAGE = 12;

export default function ChristmasLightingCatalogView({ products, categories, initialCategory = 'all' }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeModalProduct, setActiveModalProduct] = useState<ChristmasLightingProduct | null>(null);
  const [pendingSku, setPendingSku] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reset pagination when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (activeModalProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeModalProduct]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleSmartLock = (prod: ChristmasLightingProduct) => {
    setPendingSku(prod.sku);
    startTransition(async () => {
      try {
        const res = await createB2GLightingCheckout({
          sku: prod.sku,
          productName: prod.name,
          category: prod.category,
          cataloguePage: prod.cataloguePage,
          priceNumeric: prod.priceNumeric,
          municipality: 'Sede Municipal / Corporativa',
          priceLockMode: 'SMART_LOCK_10EUR'
        });

        if (res?.url) {
          window.location.href = res.url;
        }
      } catch (err: any) {
        alert(err.message || 'Error al conectar con la pasarela Stripe.');
      } finally {
        setPendingSku(null);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO S-CLASS: ALUMBRADO NAVIDEÑO & MOTIVOS MONUMENTALES
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative pt-28 pb-14 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#ecb613]/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            División Alumbrado Monumental & Arquitectura Lumínica S-Class · Productora EAR
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Alumbrado Navideño & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-[#ffd471] to-[#ecb613]">
              Motivos Monumentales 3D
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-400 font-light leading-relaxed mb-8">
            Catálogo técnico oficial clasificado en 11 categorías de producto. Accede a las fichas técnicas instantáneas, memorias visadas para pliegos públicos LCSP y reserva de stock mediante Stripe Smart-Lock.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-neutral-300 mb-8">
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#ecb613]" /> Pliegos LCSP / Contrato Menor (&lt;15.000€)
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Zap className="w-4 h-4 text-[#ecb613]" /> Seguridad Eléctrica 24V / 230V · IP65/IP67
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Truck className="w-4 h-4 text-[#ecb613]" /> Logística, Grúa Pluma y Montaje Certificado
            </span>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. CATEGORY SHOWCASE HUB (BENTO DE LÍNEAS DE PRODUCTO)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#ecb613]" />
            Líneas de Producto ({categories.length} Categorías)
          </h2>
          <span className="text-xs text-neutral-400 font-mono">
            Haz clic en una categoría para filtrar instantáneamente
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const cover = CATEGORY_COVERS[cat] || { image: '/images/demetrio/page_2.jpg', desc: cat };
            const count = products.filter(p => p.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(isSelected ? 'all' : cat);
                  const el = document.getElementById('catalogo-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative rounded-2xl overflow-hidden text-left p-4 h-36 flex flex-col justify-between border transition-all ${
                  isSelected 
                    ? 'border-[#ecb613] shadow-[0_0_25px_rgba(236,182,19,0.3)] ring-2 ring-[#ecb613]' 
                    : 'border-white/10 hover:border-[#ecb613]/50 bg-neutral-900'
                }`}
              >
                {/* Background Image */}
                <img 
                  src={cover.image} 
                  alt={cat} 
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                <div className="relative z-10 flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#ecb613]/40 text-[10px] font-mono text-[#ecb613] font-bold">
                    {count} Refs
                  </span>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded bg-[#ecb613] text-black text-[9px] font-black uppercase tracking-wider">
                      Activa
                    </span>
                  )}
                </div>

                <div className="relative z-10">
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#ecb613] transition-colors leading-tight line-clamp-2">
                    {cat}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. EXPLORADOR & FILTROS ACTIVOS
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="catalogo-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          {/* Buscador */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por referencia (CR BEAR...), nombre o medidas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ecb613]"
            />
          </div>

          {/* Filtro activo */}
          <div className="flex items-center gap-3">
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-1.5 hover:bg-red-900/60 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Quitar Filtro ({selectedCategory})
              </button>
            )}

            <div className="text-xs text-neutral-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Mostrando {paginatedProducts.length} de {filteredProducts.length} Referencias
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            4. GRID DE PRODUCTOS OPTIMIZADO (12 ITEMS POR PÁGINA)
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((prod) => {
            const isLockingThis = isPending && pendingSku === prod.sku;
            return (
              <div 
                key={prod.id}
                className="group bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden hover:border-[#ecb613]/60 transition-all flex flex-col justify-between"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => setActiveModalProduct(prod)}
                >
                  {/* Visual Card con Imagen Real del Catálogo */}
                  <div className="relative h-56 w-full overflow-hidden bg-black flex items-center justify-center">
                    <img 
                      src={prod.image} 
                      alt={prod.name}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md bg-black/90 backdrop-blur-md border border-[#ecb613]/40 font-mono text-[10px] text-[#ecb613] font-bold">
                        Ref: {prod.sku}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[10px] text-white">
                        Pág. {prod.cataloguePage || '1'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] text-[#ecb613] font-mono uppercase tracking-wider block mb-1">
                      {prod.category}
                    </span>

                    <h3 className="text-sm font-bold text-white mb-2 group-hover:text-[#ecb613] transition-colors line-clamp-2">
                      {prod.name}
                    </h3>

                    <p className="text-xs text-neutral-400 mb-3 line-clamp-2">
                      {prod.description}
                    </p>

                    <div className="space-y-1 text-xs text-neutral-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/5 mb-2 font-mono">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Medidas:</span>
                        <span className="font-medium text-right text-white">{prod.dimensions || 'Ver ficha'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Voltaje:</span>
                        <span className="font-medium text-white">{prod.voltage || '24V'}</span>
                      </div>
                      {prod.powerWatts && (
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Potencia:</span>
                          <span className="font-medium text-white">{prod.powerWatts} W</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-2 border-t border-white/5 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-[#ecb613] font-mono">
                      {prod.priceDisplay || 'Cotización a Medida'}
                    </div>
                    
                    {/* Botón que abre el modal técnico instantáneo */}
                    <button
                      onClick={() => setActiveModalProduct(prod)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-[#ecb613] transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#ecb613]" /> Ficha Técnica
                    </button>
                  </div>

                  {/* Botón Smart-Lock Stripe 10€ */}
                  <button
                    onClick={() => handleSmartLock(prod)}
                    disabled={isPending}
                    className="w-full py-2 rounded-xl bg-[#ecb613]/10 hover:bg-[#ecb613] text-[#ecb613] hover:text-black border border-[#ecb613]/30 font-mono text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {isLockingThis ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                    Smart-Lock 72h (10 €)
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Paginación Rápida */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(prev => Math.max(1, prev - 1));
                const el = document.getElementById('catalogo-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-neutral-300 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              Página {currentPage} de {totalPages} ({filteredProducts.length} productos)
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
                const el = document.getElementById('catalogo-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white/[0.02] border border-white/10 rounded-3xl">
            <Layers className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No se encontraron productos</h3>
            <p className="text-sm text-neutral-400">Prueba con otro término de búsqueda o selecciona otra categoría.</p>
          </div>
        )}

        {/* Banner de Licitaciones */}
        <div className="mt-16 text-center p-10 bg-gradient-to-br from-[#111] to-[#080808] border border-[#ecb613]/30 rounded-3xl">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Expediente Técnico Completo & Licitaciones Municipales LCSP · Productora EAR
          </h3>
          <p className="text-sm text-neutral-400 mb-8 max-w-2xl mx-auto">
            Facilitamos memorias técnicas visadas, certificados de homologación UNE-EN 60598, ensayos de resistencia a vientos y suministro con o sin montaje bajo contrato menor LCSP (&lt;15.000€).
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/34682141077?text=Hola%2C%20solicito%20el%20expediente%20t%C3%A9cnico%20y%20precios%20del%20cat%C3%A1logo%20de%20alumbrado%20monumental%20de%20Navidad%20Productora%20EAR"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#ecb613] text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg"
            >
              <PhoneCall className="w-4 h-4" /> Hablar con Asesor Técnico de Licitaciones
            </a>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. MODAL INSTANTÁNEO DE FICHA TÉCNICA S-CLASS (QUICK SPEC DRAWER)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#0c0c0c] border border-[#ecb613]/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-black/40">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono text-xs font-bold">
                  Ref: {activeModalProduct.sku}
                </span>
                <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                  {activeModalProduct.category} · Pág. {activeModalProduct.cataloguePage || '1'}
                </span>
              </div>

              <button
                onClick={() => setActiveModalProduct(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Imagen Grande Oficial */}
              <div className="md:col-span-7 rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center p-2 min-h-[300px]">
                <img 
                  src={activeModalProduct.image} 
                  alt={activeModalProduct.name} 
                  className="w-full h-full object-contain max-h-[420px] rounded-xl"
                />
              </div>

              {/* Especificaciones */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-extrabold text-white mb-2 leading-snug">
                    {activeModalProduct.name}
                  </h3>
                  <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
                    {activeModalProduct.description}
                  </p>

                  <div className="space-y-2 font-mono text-xs mb-4">
                    <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                      <span className="text-neutral-400">Medidas:</span>
                      <span className="font-semibold text-white text-right">{activeModalProduct.dimensions || 'Ver ficha'}</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                      <span className="text-neutral-400">Tensión:</span>
                      <span className="font-semibold text-white">{activeModalProduct.voltage}</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                      <span className="text-neutral-400">Protección:</span>
                      <span className="font-semibold text-white">{activeModalProduct.ipRating || 'IP65 / IP67'}</span>
                    </div>
                    {activeModalProduct.powerWatts && (
                      <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="text-neutral-400">Potencia:</span>
                        <span className="font-semibold text-white">{activeModalProduct.powerWatts} W</span>
                      </div>
                    )}
                    {activeModalProduct.weightKg && (
                      <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="text-neutral-400">Peso:</span>
                        <span className="font-semibold text-white">{activeModalProduct.weightKg} kg</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono">Tarifa Oficial</span>
                    <span className="text-xl font-black text-[#ecb613] font-mono">
                      {activeModalProduct.priceDisplay || 'Bajo Presupuesto'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSmartLock(activeModalProduct)}
                    disabled={isPending}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4af37] text-black font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 disabled:opacity-50 font-mono uppercase tracking-wider cursor-pointer"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    Smart-Lock 72h (10 € Depósito)
                  </button>

                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/34682141077?text=Hola%2C%20solicito%20la%20memoria%20t%C3%A9cnica%20oficial%20y%20pliego%20para%20la%20referencia%20${encodeURIComponent(activeModalProduct.sku)}%20(${encodeURIComponent(activeModalProduct.name)})%20de%20Productora%20EAR`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-white/15"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#ecb613]" /> Solicitar Pliego
                    </a>

                    <Link
                      href={`/arsenal/luces-navidad/${activeModalProduct.id}`}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-mono transition-all flex items-center justify-center border border-white/10"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
