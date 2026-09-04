'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Navigation, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { MUNICIPALITIES_DATABASE, SERVICES_DATABASE, Municipality } from '@/lib/geo/spanish-municipalities';

interface AdjacentCrossLinkerProps {
  currentProvince?: string;
  currentLocation?: string;
  currentServiceSlug?: string;
}

export function AdjacentMunicipalitiesCrossLinker({
  currentProvince = 'madrid',
  currentLocation = 'Madrid',
  currentServiceSlug = 'mariachi-gala'
}: AdjacentCrossLinkerProps) {
  const normProvince = currentProvince.toLowerCase().replace(/\s+/g, '-');
  const normLocation = currentLocation.toLowerCase().replace(/\s+/g, '-');

  // Buscar municipios de la misma provincia o hubs estratégicos
  const sameProvinceMunis = MUNICIPALITIES_DATABASE.filter(
    m => m.provinceSlug === normProvince || m.province.toLowerCase() === normProvince
  );

  // Fallback si no hay suficientes: agregar hubs Tier 1 y Tier 2 de Madrid/Toledo
  const displayedMunis: Municipality[] = (
    sameProvinceMunis.length >= 4
      ? sameProvinceMunis
      : [
          ...sameProvinceMunis,
          ...MUNICIPALITIES_DATABASE.filter(m => m.isCoreHub && m.provinceSlug !== normProvince)
        ]
  )
    .filter(m => m.slug !== normLocation)
    .slice(0, 8);

  const rawSlug = (currentServiceSlug || '').toLowerCase();
  let normalizedSlug = rawSlug;

  if (/mariachi/.test(rawSlug)) {
    normalizedSlug = 'mariachi-gala';
  } else if (/sonido|audio|iluminacion|luces/.test(rawSlug)) {
    normalizedSlug = 'sonido-iluminacion';
  } else if (/pantalla/.test(rawSlug)) {
    normalizedSlug = 'alquiler-pantallas-led';
  } else if (/catering|brasa|showcooking/.test(rawSlug)) {
    normalizedSlug = 'catering-brasas';
  } else if (/boda|nupcial/.test(rawSlug)) {
    normalizedSlug = 'bodas-lujo';
  } else if (/fiesta|patronal|ayuntamiento|b2g/.test(rawSlug)) {
    normalizedSlug = 'fiestas-patronales-ayuntamientos';
  } else if (/serenata|aniversario/.test(rawSlug)) {
    normalizedSlug = 'serenatas-aniversarios';
  }

  const matchedService = SERVICES_DATABASE.find(s => s.slug === normalizedSlug) || 
    SERVICES_DATABASE.find(s => s.slug === currentServiceSlug) || 
    SERVICES_DATABASE.find(s => s.slug === 'mariachi-gala') || 
    SERVICES_DATABASE[0];

  return (
    <section className="mt-16 pt-12 border-t border-white/10 relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <span className="text-[10px] font-mono text-[#ecb613] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5" /> Red Territorial y Cobertura Comarcal
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-white font-serif mt-1">
            {matchedService.title} en Municipios Cercanos
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Despacho logístico directo desde el Hub Central de Méntrida (Toledo). Disponibilidad de cuadrillas, sistemas Bose F1 homologados y póliza de responsabilidad civil de 1.000.000 €.
          </p>
        </div>

        <Link
          href={`/checkout/presupuesto?format=${matchedService.slug}&base=${matchedService.averageTicket}`}
          className="py-2.5 px-4 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" /> Cotizar para tu Municipio
        </Link>
      </div>

      {/* Malla de Enlaces Internos Contextuales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {displayedMunis.map((muni) => (
          <Link
            key={muni.id}
            href={`/bodas/${muni.provinceSlug}/${matchedService.slug}/${muni.slug}`}
            className="p-4 rounded-2xl bg-[#09090d] border border-white/10 hover:border-[#ecb613]/50 hover:bg-[#12121c] transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-gray-400 uppercase">
                  {muni.province} · Tier {muni.tier}
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-mono bg-white/5 text-gray-300 border border-white/10">
                  {muni.hasFincas ? 'Fincas' : 'Eventos'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#ecb613] transition-colors flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#258DCD] shrink-0" />
                {muni.name}
              </h4>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[11px] font-mono text-gray-400">
              <span>Desde {matchedService.averageTicket} €</span>
              <span className="text-[#ecb613] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Ver Servicio <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-gray-400 font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Garantía de precio congelado con depósito Stripe de 100,00 € (Price-Lock SHA-256).</span>
        </div>
        <span>Teléfono Directo: <strong className="text-white">+34 693 693 048</strong></span>
      </div>
    </section>
  );
}

export default AdjacentMunicipalitiesCrossLinker;
