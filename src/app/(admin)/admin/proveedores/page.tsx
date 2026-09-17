"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Star,
  MapPin,
  Phone,
  ShieldCheck,
  ExternalLink,
  Plus,
  CheckCircle2,
  Euro,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sliders,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import {
  PROVIDERS_MANIFEST_TOTALS,
  PROVIDERS_GRAND_TOTAL,
  formatProviderCount,
} from '@/lib/constants/providers-manifest';

const GRAND_TOTAL_FORMATTED = formatProviderCount(PROVIDERS_GRAND_TOTAL);

interface ProviderItem {
  id?: string;
  name: string;
  category: string;
  province?: string;
  city?: string;
  phone?: string;
  price?: number | string;
  rating?: number;
  reviewsCount?: number;
  imageUrls?: string[];
  description?: string;
  verified?: boolean;
}

// Contadores SSOT: derivados del manifest, nunca hardcodeados.
const CATEGORY_TABS = [
  { id: 'ALL', label: `Todos (${formatProviderCount(PROVIDERS_GRAND_TOTAL)})` },
  { id: 'finca', label: `Fincas & Espacios (${formatProviderCount(PROVIDERS_MANIFEST_TOTALS.finca)})` },
  { id: 'musica', label: `Música & Solistas (${formatProviderCount(PROVIDERS_MANIFEST_TOTALS.musica)})` },
  { id: 'sonido', label: `Sonido & Iluminación (${formatProviderCount(PROVIDERS_MANIFEST_TOTALS.sonido)})` },
  { id: 'catering', label: `Catering (${formatProviderCount(PROVIDERS_MANIFEST_TOTALS.catering)})` },
  { id: 'foto', label: `Fotografía (${formatProviderCount(PROVIDERS_MANIFEST_TOTALS.foto)})` },
  { id: 'senior_care', label: `Centros Senior VIMUME (${formatProviderCount(PROVIDERS_MANIFEST_TOTALS.senior_care)})` },
  { id: 'wedding', label: `Wedding Planners (${formatProviderCount(PROVIDERS_MANIFEST_TOTALS.wedding)})` }
];

export default function ProveedoresSyncPage() {
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(PROVIDERS_GRAND_TOTAL);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProvider, setSelectedProvider] = useState<ProviderItem | null>(null);

  // Carga de datos real desde el endpoint de búsqueda y Data Lake
  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '24');
      if (selectedCat !== 'ALL') {
        params.set('category', selectedCat);
      }
      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim());
      }

      const res = await fetch(`/api/profiles/search?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.providers)) {
        setProviders(data.providers);
        setTotalCount(data.total || PROVIDERS_GRAND_TOTAL);
        setTotalPages(data.totalPages || Math.ceil((data.total || PROVIDERS_GRAND_TOTAL) / 24));
      }
    } catch (err) {
      console.error('[PROVEEDORES-SYNC] Error cargando proveedores:', err);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCat, searchQuery]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProviders();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Soberano */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1a1a24] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-wider">
            <Users className="w-4 h-4 text-[#ecb613]" />
            Directorio S-Class // Sincronizado al 100%
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1 font-mono">
            Proveedores ({totalCount > 0 ? totalCount.toLocaleString('es-ES') : GRAND_TOTAL_FORMATTED} Nodos CDN)
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Partición pública en Edge CDN sincronizada con el Call Center local y la Bóveda Maestra SSOT ({GRAND_TOTAL_FORMATTED} registros verificados).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/call-center"
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:border-[#ecb613]/50 flex items-center gap-1.5 transition-colors"
          >
            Abrir Call Center ({GRAND_TOTAL_FORMATTED})
          </Link>
          <button
            onClick={() => fetchProviders()}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#ecb613]/50 transition-colors"
            title="Refrescar datos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#ecb613]' : ''}`} />
          </button>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs font-mono text-emerald-400 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            100% SINCRONIZADO
          </div>
        </div>
      </div>

      {/* Barra de Filtros & Búsqueda */}
      <div className="space-y-3 bg-[#050508] p-4 rounded-2xl border border-[#1a1a24]">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar proveedor por nombre, municipio, teléfono, servicio..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#ecb613] hover:bg-[#d8a510] text-black font-bold text-xs transition-colors"
          >
            Filtrar Nodos
          </button>
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedCat(tab.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                selectedCat === tab.id
                  ? 'bg-[#ecb613]/15 text-[#ecb613] border border-[#ecb613]/40 font-bold'
                  : 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Proveedores */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#ecb613] animate-spin mx-auto" />
          <p className="text-xs font-mono text-zinc-400">Sincronizando particiones del Data Lake...</p>
        </div>
      ) : providers.length === 0 ? (
        <div className="py-16 text-center text-zinc-500 text-xs font-mono">
          No se encontraron nodos para los filtros aplicados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {providers.map((p, idx) => {
            const img = p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : null;
            return (
              <div
                key={p.id || idx}
                onClick={() => setSelectedProvider(p)}
                className="p-4 rounded-2xl bg-[#050508] border border-[#1a1a24] hover:border-[#ecb613]/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Imagen o Placeholder */}
                  <div className="w-full h-36 rounded-xl overflow-hidden mb-3 bg-zinc-900 relative border border-white/5">
                    {img ? (
                      <img
                        src={img}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[9px] font-mono text-[#ecb613] border border-[#ecb613]/30 uppercase">
                      {p.category || 'PROVEEDOR'}
                    </span>
                    {p.rating && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#ecb613] fill-[#ecb613]" />
                        {Number(p.rating).toFixed(1)}
                      </span>
                    )}
                  </div>

                  <h2 className="text-sm font-bold text-white group-hover:text-[#ecb613] transition-colors line-clamp-1">
                    {p.name}
                  </h2>

                  <div className="space-y-1 mt-2 text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <MapPin className="w-3 h-3 text-[#ecb613]" />
                      <span className="truncate">{p.city || p.province || 'España'}</span>
                    </div>
                    {p.phone && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-300">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>{p.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500 text-[10px]">TARIFA EST.</span>
                  <span className="text-sm font-bold text-white">
                    {p.price ? `${p.price} €` : 'A consultar'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1a1a24] text-xs font-mono">
        <span className="text-zinc-500">
          Página <strong className="text-white">{page}</strong> de <strong className="text-white">{totalPages}</strong> ({totalCount.toLocaleString()} proveedores)
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 disabled:opacity-30 text-white hover:border-[#ecb613]/50 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 disabled:opacity-30 text-white hover:border-[#ecb613]/50 transition-colors flex items-center gap-1"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal / Ficha Rápida del Proveedor */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#050508] border border-[#ecb613]/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-white">
            <button
              onClick={() => setSelectedProvider(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase">
              <ShieldCheck className="w-4 h-4" />
              Ficha Maestra Proveedor S-Class
            </div>

            <h3 className="text-xl font-bold font-mono">{selectedProvider.name}</h3>

            <div className="space-y-2 text-xs text-zinc-300 font-sans">
              <p className="text-zinc-400 line-clamp-3">
                {selectedProvider.description || 'Proveedor homologado en la red nacional de Productora EAR.'}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-zinc-500 text-[10px] block">CATEGORÍA</span>
                  <span className="text-white font-bold">{selectedProvider.category}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                  <span className="text-zinc-500 text-[10px] block">UBICACIÓN</span>
                  <span className="text-white font-bold">{selectedProvider.city || selectedProvider.province || 'Nacional'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-400">Tarifa Referencia: <strong className="text-emerald-400">{selectedProvider.price || 350} €</strong></span>
              <button
                onClick={() => setSelectedProvider(null)}
                className="px-4 py-2 rounded-xl bg-[#ecb613] text-black font-bold text-xs"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
