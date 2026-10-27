'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeContext';
import { AirbnbFloatingPillSearchBar } from '@/components/search/AirbnbFloatingPillSearchBar';
import { Sparkles } from 'lucide-react';
import { BODAS_NET_CATEGORIES, SPAIN_PROVINCES } from '@/lib/constants/spain-regions-and-categories';
import { PROVIDERS_GRAND_TOTAL, PROVIDERS_MANIFEST_TOTALS } from '@/lib/constants/providers-manifest';

export const HomeAirbnbSearchSection: React.FC = () => {
  const { isAirbnb } = useTheme();

  if (!isAirbnb) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-12 transition-all duration-300">
      
      {/* 🔴 HERO AIRBNB BANNER */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF0F2] text-[#FF385C] text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles size={13} className="text-[#FF385C]" />
          <span>Experiencia Frontend Airbnb · {PROVIDERS_GRAND_TOTAL.toLocaleString('es-ES')} Proveedores en {SPAIN_PROVINCES.length} Provincias</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#222222] tracking-tight max-w-3xl mx-auto leading-tight">
          Encuentra el mejor artista o espacio para tu boda o evento
        </h1>

        <p className="text-[#717171] text-base sm:text-lg max-w-2xl mx-auto font-normal">
          Reserva verificada en España con seguro de RC de 1.000.000 €, rider acústico y depósito de 100 € deducible.
        </p>
      </div>

      {/* 🚀 BARRA DE BÚSQUEDA PILL FLOTANTE (10 CATEGORÍAS + 52 PROVINCIAS) */}
      <div className="mb-10">
        <AirbnbFloatingPillSearchBar />
      </div>

      {/* 🏷️ GRILLA CON LAS 10 CATEGORÍAS COMPLETAS DE BODAS.NET */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#222222]">
            Explorar las 10 Categorías Oficiales de Bodas.net
          </span>
          <Link href="/proveedores" className="text-xs font-bold text-[#FF385C] hover:underline">
            Ver Catálogo Completo (13.094) →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {BODAS_NET_CATEGORIES.map(cat => {
            const count = (PROVIDERS_MANIFEST_TOTALS as Record<string, number>)[cat.id] || 0;
            return (
              <Link
                key={cat.id}
                href={`/proveedores?categoria=${cat.id}`}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-[#EBEBEB] hover:border-[#FF385C] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group text-center"
              >
                <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">
                  {cat.iconEmoji}
                </span>
                <span className="text-xs font-bold text-[#222222] group-hover:text-[#FF385C] transition-colors line-clamp-1">
                  {cat.shortLabel}
                </span>
                <span className="text-[10px] text-[#717171] font-mono mt-0.5">
                  {count > 0 ? `${count.toLocaleString()} servicios` : 'Directorio'}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

    </section>
  );
};
