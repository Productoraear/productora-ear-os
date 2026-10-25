'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, BadgeCheck, TrendingDown, CalendarClock } from 'lucide-react';
import {
  VENDOR_PRICE_POLICY,
  HISTORIC_PRICE_WINDOW_YEARS,
  HISTORIC_PRICE_ANNUAL_INCREASE_PCT,
  type WeddingVendorCategory,
} from '@/lib/constants/macro-ecosystem-manifest';

interface SClassVendorHistoricPriceShieldProps {
  category: WeddingVendorCategory;
  vendorName?: string;
  frozenSinceIso?: string;
}

function formatCategory(category: WeddingVendorCategory): string {
  return category
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function SClassVendorHistoricPriceShield({
  category,
  vendorName,
  frozenSinceIso,
}: SClassVendorHistoricPriceShieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.015 }}
      className="rounded-3xl bg-[#030305] border border-[#ecb613]/25 p-6 space-y-5 shadow-[0_0_40px_rgba(236,182,19,0.08)] transition-all duration-300 ease-out"
    >
      {/* Cabecera del sello */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613] shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-[0.3em] font-bold">
              Sello S-CLASS · Blindaje de Precio
            </span>
            <h3 className="text-lg sm:text-xl font-black uppercase text-white font-syne">
              Precio Congelado {HISTORIC_PRICE_WINDOW_YEARS} Años
            </h3>
          </div>
        </div>
        <div className="text-right">
          <div className="px-3 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono font-bold uppercase tracking-wider">
            {VENDOR_PRICE_POLICY}
          </div>
        </div>
      </div>

      {/* Identidad del proveedor y categoría */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">
            Proveedor blindado
          </span>
          <span className="text-sm font-bold text-white block">
            {vendorName ?? 'Productora EAR · Red Homologada'}
          </span>
        </div>
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">
            Categoría homologada
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-white">
            <BadgeCheck size={16} className="text-[#ecb613]" />
            {formatCategory(category)}
          </span>
        </div>
      </div>

      {/* Métricas del blindaje */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#ecb613]/5 border border-[#ecb613]/15 text-center space-y-1">
          <Lock size={16} className="text-[#ecb613] mx-auto" />
          <div className="text-xl font-black text-white font-syne">
            {HISTORIC_PRICE_WINDOW_YEARS} años
          </div>
          <div className="text-[10px] font-mono text-white/40 uppercase">Ventana histórica</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#ecb613]/5 border border-[#ecb613]/15 text-center space-y-1">
          <TrendingDown size={16} className="text-[#ecb613] mx-auto" />
          <div className="text-xl font-black text-white font-syne">
            {HISTORIC_PRICE_ANNUAL_INCREASE_PCT}%
          </div>
          <div className="text-[10px] font-mono text-white/40 uppercase">Subida anual</div>
        </div>
        <div className="p-4 rounded-2xl bg-[#ecb613]/5 border border-[#ecb613]/15 text-center space-y-1">
          <CalendarClock size={16} className="text-[#ecb613] mx-auto" />
          <div className="text-sm font-black text-white font-syne pt-0.5">
            {frozenSinceIso
              ? new Date(frozenSinceIso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
              : 'Activo'}
          </div>
          <div className="text-[10px] font-mono text-white/40 uppercase">Congelado desde</div>
        </div>
      </div>

      {/* Nota legal */}
      <p className="text-[10px] font-mono text-white/40 leading-relaxed">
        El precio medio histórico se calcula sobre los últimos {HISTORIC_PRICE_WINDOW_YEARS} años y permanece
        congelado sin subidas anuales. Cualquier variación exige baselining sancionado por el CEO.
      </p>
    </motion.div>
  );
}
