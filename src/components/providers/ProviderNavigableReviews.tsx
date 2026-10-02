'use client';

import React, { useState, useMemo } from 'react';
import { Star, ChevronLeft, ChevronRight, Filter, ShieldCheck, Quote, CheckCircle2 } from 'lucide-react';

export interface ReviewItem {
  author: string;
  date: string;
  rating: number;
  comment: string;
  source?: string;
  verified?: boolean;
}

interface ProviderNavigableReviewsProps {
  providerName: string;
  reviews: ReviewItem[];
  rating: number;
  reviewCount: number;
}

export const ProviderNavigableReviews: React.FC<ProviderNavigableReviewsProps> = ({
  providerName,
  reviews = [],
  rating = 4.9,
  reviewCount = 28
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'google' | 'bodas' | 'verified'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    if (activeFilter === 'all') return reviews;
    if (activeFilter === 'google') return reviews.filter(r => (r.source || '').toLowerCase().includes('google'));
    if (activeFilter === 'bodas') return reviews.filter(r => (r.source || '').toLowerCase().includes('bodas'));
    if (activeFilter === 'verified') return reviews.filter(r => r.verified || (r.source || '').toLowerCase().includes('verificad'));
    return reviews;
  }, [reviews, activeFilter]);

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const currentReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage, itemsPerPage]);

  const handleFilterChange = (filter: 'all' | 'google' | 'bodas' | 'verified') => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Summary Ratings & Badges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#09090e] border border-white/10 items-center">
        <div className="text-center md:text-left space-y-1 md:border-r border-white/10 md:pr-6">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#ecb613]">
            <span className="text-4xl font-black font-syne">{rating.toFixed(1)}</span>
            <div className="flex text-[#ecb613]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-[#ecb613] text-[#ecb613]" />
              ))}
            </div>
          </div>
          <span className="text-xs font-mono text-zinc-400 block">
            Basado en <strong className="text-white">{reviewCount} opiniones reales</strong>
          </span>
        </div>

        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-black/40 rounded-2xl border border-white/5 space-y-0.5">
            <span className="text-lg font-black font-syne text-[#ecb613]">5.0 / 5</span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Gastronomía & Parrilla</span>
          </div>
          <div className="p-3 bg-black/40 rounded-2xl border border-white/5 space-y-0.5">
            <span className="text-lg font-black font-syne text-emerald-400">5.0 / 5</span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Atención de Dirección</span>
          </div>
          <div className="p-3 bg-black/40 rounded-2xl border border-white/5 space-y-0.5">
            <span className="text-lg font-black font-syne text-blue-400">4.9 / 5</span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Instalaciones & Jardines</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              activeFilter === 'all'
                ? 'bg-[#ecb613] text-black shadow-md shadow-[#ecb613]/20'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Todas ({reviews.length})
          </button>
          <button
            onClick={() => handleFilterChange('google')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              activeFilter === 'google'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Google Reviews (4.9★)
          </button>
          <button
            onClick={() => handleFilterChange('bodas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              activeFilter === 'bodas'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Bodas.net (4.8★)
          </button>
          <button
            onClick={() => handleFilterChange('verified')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              activeFilter === 'verified'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Verificadas EAR
          </button>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Página {currentPage} de {totalPages}</span>
          </div>
        )}
      </div>

      {/* Reviews Grid */}
      {currentReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentReviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0a0a0f] border border-white/10 hover:border-[#ecb613]/40 transition-all space-y-3 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ecb613]/30 to-amber-900/40 border border-[#ecb613]/50 flex items-center justify-center text-[#ecb613] font-bold text-sm font-syne shrink-0">
                      {rev.author?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-syne flex items-center gap-1.5">
                        <span>{rev.author}</span>
                        {rev.verified && (
                          <span title="Pareja Verificada EAR">
                            <ShieldCheck size={14} className="text-emerald-400" />
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] font-mono text-zinc-500">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                      {rev.source || 'Reseña Verificada'}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <Quote size={16} className="text-[#ecb613]/20 absolute -top-1 -left-1" />
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light italic pl-4">
                    "{rev.comment}"
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 size={12} /> Boda Celebrada con Éxito
                </span>
                <span>{providerName}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 text-zinc-400 text-xs font-mono">
          No hay opiniones bajo el filtro seleccionado.
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Anterior
          </button>

          <div className="flex items-center gap-1.5">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all ${
                  currentPage === i + 1
                    ? 'bg-[#ecb613] text-black'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            Siguiente <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
