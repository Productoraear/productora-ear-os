'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ShieldCheck, Zap, PhoneCall, Truck, Award, 
  Eye, Layers, Search, Filter, CheckCircle2, ChevronRight, Download
} from 'lucide-react';
import type { ChristmasLightingProduct } from '@/data/luces-navidad';

interface Props {
  products: ChristmasLightingProduct[];
  categories: string[];
}

export default function ChristmasLightingCatalogView({ products, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO S-CLASS: ALUMBRADO NAVIDEÑO OFICIAL DEMETRIO 2025
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#ecb613]/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Catálogo Oficial Demetrio 2025 · Distribuidor Homologado Productora EAR
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Alumbrado Navideño & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-[#ffd471] to-[#ecb613]">
              Motivos Monumentales 3D
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-400 font-light leading-relaxed mb-8">
            Catálogo técnico oficial con capturas directas de las 145 páginas del fabricante. Motivos 3D transitables, conos y árboles gigantes, arcos de calle y tecnología Twinkly Pro Smart LED para Ayuntamientos (LCSP) y grandes superficies.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-neutral-300 mb-10">
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

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/34682141077?text=Hola%2C%20solicito%20presupuesto%20del%20cat%C3%A1logo%20de%20luces%20de%20Navidad%20Demetrio%202025"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4af37] text-black font-bold text-sm hover:brightness-110 transition-all shadow-xl shadow-[#ecb613]/20"
            >
              <PhoneCall className="w-4 h-4" /> Solicitar Presupuesto y Memoria Técnica
            </a>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. FILTROS POR CATEGORÍA REAL DEL CATÁLOGO
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Buscador */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por referencia (CR BEAR...), nombre o dimensiones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ecb613]"
            />
          </div>

          {/* Contador */}
          <div className="text-xs text-neutral-400 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Mostrando {filteredProducts.length} de {products.length} Referencias Oficiales
          </div>
        </div>

        {/* Botones de Categorías */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-bold'
                : 'bg-white/5 text-neutral-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            Todas las Líneas ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-bold'
                    : 'bg-white/5 text-neutral-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            3. GRID DE PRODUCTOS CON CAPTURAS REALES DEL CATÁLOGO
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div 
              key={prod.id}
              className="group bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden hover:border-[#ecb613]/60 transition-all flex flex-col justify-between"
            >
              <div>
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

              <div className="p-4 pt-0 flex items-center justify-between border-t border-white/5 mt-2">
                <div className="text-xs font-bold text-[#ecb613]">
                  {prod.priceDisplay || 'Cotización a Medida'}
                </div>
                <Link
                  href={`/arsenal/luces-navidad/${prod.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-[#ecb613] transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
                >
                  <Eye className="w-3 h-3 text-[#ecb613]" /> Ficha Técnica
                </Link>
              </div>
            </div>
          ))}
        </div>

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
            Expediente Técnico Completo & Licitaciones Municipales
          </h3>
          <p className="text-sm text-neutral-400 mb-8 max-w-2xl mx-auto">
            Facilitamos memorias técnicas visadas, certificados de homologación UNE-EN 60598, ensayos de resistencia a vientos y suministro con o sin montaje bajo contrato menor LCSP (&lt;15.000€).
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/34682141077?text=Hola%2C%20solicito%20el%20expediente%20t%C3%A9cnico%20y%20precios%20del%20cat%C3%A1logo%20de%20luces%20de%20Navidad%20Demetrio%202025"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#ecb613] text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg"
            >
              <PhoneCall className="w-4 h-4" /> Hablar con Asesor Técnico de Licitaciones
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
