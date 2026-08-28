import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, MapPin, ShieldCheck, ArrowRight, Phone, Clock, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import { MUNICIPALITIES_DATASET, SERVICES_PSEO_EXPANDED } from '@/lib/constants/spanish-municipalities';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';
import { MeshGradientBackground } from '@/components/sclass/MeshGradientBackground';
import { CENTRALITA } from '@/lib/phone-constants';

interface PageProps {
  params: Promise<{
    provincia: string;
    servicio: string;
    municipio: string;
  }> | {
    provincia: string;
    servicio: string;
    municipio: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const provincia = resolvedParams?.provincia || 'madrid';
  const servicio = resolvedParams?.servicio || 'mariachi-gala';
  const municipio = resolvedParams?.municipio || 'navalcarnero';

  const provKey = provincia.toLowerCase();
  const provData = PROVINCIAS_52_GRAPH[provKey];
  const provName = provData ? provData.name : provincia.charAt(0).toUpperCase() + provincia.slice(1);
  
  const townList = MUNICIPALITIES_DATASET[provKey] || [];
  const townData = townList.find(t => t.slug === municipio.toLowerCase());
  const townName = townData ? townData.name : municipio.charAt(0).toUpperCase() + municipio.slice(1).replace(/-/g, ' ');

  const servData = SERVICES_PSEO_EXPANDED.find(s => s.path === servicio || s.id === servicio);
  const servTitle = servData ? servData.title : 'Mariachis & Música de Gala';

  return {
    title: `${servTitle} en ${townName} (${provName}) | Calibración 12 W/pax & Price-Lock 72h`,
    description: `Contratación oficial de ${servTitle.toLowerCase()} en ${townName} (${provName}). Sonorización Bose F1, voz de tenor de Edwin Agudelo, Price-Lock 72h y garantía 0 fallos acústicos.`,
    keywords: [
      `${servTitle} ${townName}`,
      `mariachis en ${townName}`,
      `bodas ${townName} ${provName}`,
      `sonorizacion bose ${townName}`,
      `edwin agudelo ${townName}`
    ]
  };
}

export default async function LocalMunicipalityPage({ params }: PageProps) {
  const resolvedParams = await params;
  const provincia = resolvedParams?.provincia || 'madrid';
  const servicio = resolvedParams?.servicio || 'mariachi-gala';
  const municipio = resolvedParams?.municipio || 'navalcarnero';

  const provKey = provincia.toLowerCase();
  const provData = PROVINCIAS_52_GRAPH[provKey];
  const provName = provData ? provData.name : provincia.charAt(0).toUpperCase() + provincia.slice(1);

  const townList = MUNICIPALITIES_DATASET[provKey] || [];
  const townData = townList.find(t => t.slug === municipio.toLowerCase());
  const townName = townData ? townData.name : municipio.charAt(0).toUpperCase() + municipio.slice(1).replace(/-/g, ' ');
  const comarca = townData?.comarca || 'Comarca Histórica';
  const distanceKm = townData?.distanceFromMentrideKm ?? 35;
  const venues = townData?.featuredVenues || ['Fincas y Salones Exclusivos'];

  const servData = SERVICES_PSEO_EXPANDED.find(s => s.path === servicio || s.id === servicio);
  const servTitle = servData ? servData.title : 'Mariachis de Gala & Serenatas';
  const basePrice = servData?.basePrice ?? 350;

  const whatsappText = encodeURIComponent(
    `¡Hola Productora EAR! Solicito disponibilidad y presupuesto oficial para ${servTitle} en ${townName} (${provName}). Distancia aprox: ${distanceKm} km.`
  );

  return (
    <MeshGradientBackground intensity="subtle">
      <main className="min-h-screen pt-28 pb-32 px-4 md:px-8 font-sans text-white">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-white">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/bodas" className="hover:text-white">Bodas</Link>
            <ChevronRight size={12} />
            <span className="text-[#ecb613] uppercase">{provName}</span>
            <ChevronRight size={12} />
            <span className="text-white font-bold">{townName}</span>
          </nav>

          {/* Hero Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-widest uppercase">
              <MapPin size={14} />
              <span>COBERTURA S-CLASS // {townName.toUpperCase()} ({provName.toUpperCase()})</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white font-syne leading-[1.05]">
              {servTitle} en <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">{townName}</span>
            </h1>

            <p className="text-zinc-300 text-base md:text-lg max-w-3xl leading-relaxed font-light">
              Despliegue artístico y técnico directo en <strong className="text-white">{townName}</strong> ({comarca}). Voz de tenor lírico con Edwin Agudelo, trajes bordados de gala y calibración acústica <strong className="text-[#ecb613]">12 W/pax Bose F1</strong> con garantía de cero acoples.
            </p>
          </div>

          {/* Cards de Métricas Locales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-wider block">Tarifa Oficial Desde</span>
              <p className="text-2xl font-black font-syne text-white">{basePrice} €</p>
              <p className="text-[11px] text-zinc-400">Sin intermediarios · Split 80% Artista</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-wider block">Distancia desde Hub Central</span>
              <p className="text-2xl font-black font-syne text-white">{distanceKm} km</p>
              <p className="text-[11px] text-zinc-400">Llegada T-120 min antes del show</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-wider block">Física Acústica Homologada</span>
              <p className="text-2xl font-black font-syne text-white">12 W / PAX</p>
              <p className="text-[11px] text-zinc-400">Line Array Bose F1 + Shure Axient</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-wider block">Protección Contractual</span>
              <p className="text-2xl font-black font-syne text-white">RC 1.000.000 €</p>
              <p className="text-[11px] text-zinc-400">Normativa de ruidos municipal (OPCAT)</p>
            </div>
          </div>

          {/* Venues Destacados en el Municipio */}
          <div className="p-8 rounded-[2.5rem] bg-[#0c0c12] border border-white/10 space-y-4">
            <h3 className="text-lg font-bold font-syne uppercase text-white flex items-center gap-2">
              <Award size={18} className="text-[#ecb613]" />
              <span>Espacios y Fincas de Referencia en {townName}</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Hemos sonorizado y actuado en los recintos más emblemáticos de la zona con máxima integración paisajística y acústica:
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {venues.map((venue, idx) => (
                <span key={idx} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
                  📍 {venue}
                </span>
              ))}
            </div>
          </div>

          {/* CTAs de Conversión Rápida */}
          <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-br from-[#12121c] to-[#0a0a0f] border border-[#ecb613]/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block">
                PRICE-LOCK 72H SHA-256 // BLOQUEO INMEDIATO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
                ¿Celebras tu Evento en {townName}?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-light">
                Calcula el presupuesto exacto con desplazamiento incluido, bloquea tu fecha con un depósito seguro de 100 € en Stripe o contacta por WhatsApp en menos de 3 minutos.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              <Link
                href={`/cotizador?ocasion=${encodeURIComponent(servTitle)}&provincia=${encodeURIComponent(provName)}`}
                className="px-6 py-4 rounded-2xl bg-[#ecb613] hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider text-center transition-all shadow-lg shadow-[#ecb613]/20 flex items-center justify-center gap-2"
              >
                <span>Cotizar en Vivo</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href={`https://wa.me/34693693048?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 font-bold uppercase text-xs tracking-wider text-center transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                <span>WhatsApp Express</span>
              </a>
            </div>
          </div>

        </div>
      </main>
    </MeshGradientBackground>
  );
}
