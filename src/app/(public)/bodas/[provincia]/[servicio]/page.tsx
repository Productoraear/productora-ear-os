import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, MapPin, ShieldCheck, ArrowRight, Award, Star, Phone, CheckCircle2 } from 'lucide-react';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';
import { SERVICES_PSEO_EXPANDED, MUNICIPALITIES_DATASET } from '@/lib/constants/spanish-municipalities';
import { CENTRALITA } from '@/lib/phone-constants';
import { getProvidersByLocation } from '@/lib/data/vampire-service';

interface Props {
  params: Promise<{ provincia: string; servicio: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { provincia, servicio } = await params;
  const provKey = provincia.toLowerCase();
  const servKey = servicio.toLowerCase();

  const provData = PROVINCIAS_52_GRAPH[provKey];
  const provName = provData ? provData.name : provincia.charAt(0).toUpperCase() + provincia.slice(1);

  const servData = SERVICES_PSEO_EXPANDED.find(s => s.path === servKey || s.id === servKey);
  const servTitle = servData ? servData.title : 'Música y Servicios para Bodas';

  return {
    title: `${servTitle} en ${provName} | Tarifas Oficiales y Garantía EAR OS`,
    description: `Catálogo homologado de ${servTitle.toLowerCase()} en ${provName}. Proveedores verificados, sonorización 12 W/pax, Price-Lock 72h y reserva con depósito de 100 €.`,
    alternates: {
      canonical: `/bodas/${provKey}/${servKey}`,
    },
    keywords: [
      `${servTitle} ${provName}`,
      `bodas ${provName}`,
      `fincas ${provName}`,
      `catering ${provName}`,
      `musica bodas ${provName}`
    ]
  };
}

export default async function BodasServicioProvinciaPage({ params }: Props) {
  const { provincia, servicio } = await params;
  const provKey = provincia.toLowerCase();
  const servKey = servicio.toLowerCase();

  const provData = PROVINCIAS_52_GRAPH[provKey] || { name: provincia, slug: provKey };
  const servData = SERVICES_PSEO_EXPANDED.find(s => s.path === servKey || s.id === servKey) || {
    title: 'Música y Producción de Bodas',
    id: servKey,
    path: servKey
  };

  const providers = await getProvidersByLocation(provKey, servKey, 12);
  const topTowns = (MUNICIPALITIES_DATASET[provKey] || []).slice(0, 8);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black font-sans pt-28 pb-36 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Link href="/" className="hover:text-[#ecb613]">Inicio</Link>
          <span>/</span>
          <Link href="/bodas" className="hover:text-[#ecb613]">Bodas</Link>
          <span>/</span>
          <Link href={`/bodas/${provKey}`} className="hover:text-[#ecb613]">{provData.name}</Link>
          <span>/</span>
          <span className="text-[#ecb613] font-bold">{servData.title}</span>
        </nav>

        {/* Hero Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full text-xs font-mono uppercase font-bold">
            <Award size={14} />
            <span>Homologación Oficial Productora EAR // {provData.name}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-syne tracking-tight text-white uppercase">
            {servData.title} en <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-amber-200">{provData.name}</span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-3xl leading-relaxed font-light">
            Directorio oficial de espacios, grupos musicales y servicios técnicos para bodas en la provincia de {provData.name}. 
            Todos los proveedores cuentan con seguro de RC, cálculo acústico de 12 W/pax y reserva garantizada mediante el protocolo Hold & Ping.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href={`/cotizador?provincia=${encodeURIComponent(provData.name)}&ocasion=${encodeURIComponent(servData.title)}`}
              className="px-6 py-3 bg-[#ecb613] hover:bg-[#ecb613]/90 text-black font-mono text-xs font-black uppercase rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              Cotizar con Roster Soberano
            </Link>
            <a
              href={CENTRALITA.tel}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-2"
            >
              <Phone size={14} className="text-[#ecb613]" />
              <span>Centralita ({CENTRALITA.display})</span>
            </a>
          </div>
        </header>

        {/* Grid de Proveedores Homologados */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold font-syne text-white uppercase">
              Proveedores y Fincas Destacadas ({providers.length})
            </h2>
            <span className="text-xs font-mono text-zinc-500">Filtrado en {provData.name}</span>
          </div>

          {providers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((p, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#09090d] border border-white/10 hover:border-[#ecb613]/50 transition-all space-y-4 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] rounded-full text-[10px] font-mono uppercase font-bold">
                        {p.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-mono font-bold">
                        <Star size={12} fill="currentColor" />
                        <span>{p.rating?.toFixed(1) || '4.9'}</span>
                        <span className="text-zinc-500 text-[10px]">({p.reviewsCount || 18})</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold font-syne text-white group-hover:text-[#ecb613] transition-colors">
                      {p.name}
                    </h3>

                    {p.description && (
                      <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-light">
                        {p.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">
                      {p.priceRange || 'Desde 900 €'}
                    </span>
                    <Link
                      href={`/checkout/presupuesto?proveedor=${encodeURIComponent(p.name)}&provincia=${provKey}`}
                      className="px-4 py-2 bg-white/5 hover:bg-[#ecb613] hover:text-black border border-white/10 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-1"
                    >
                      <span>Reservar</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-[#09090d] border border-white/10 space-y-4">
              <Sparkles size={32} className="mx-auto text-[#ecb613]" />
              <h3 className="text-lg font-bold text-white font-syne">Roster Central Disponible para {provData.name}</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Desplazamiento directo desde nuestro Hub Central en Méntrida (Toledo) con equipo Bose F1, microfonía Shure y voz solista de Edwin Agudelo.
              </p>
              <Link
                href="/artistas/edwin-agudelo"
                className="inline-block px-6 py-2.5 bg-[#ecb613] text-black font-mono text-xs font-bold uppercase rounded-xl"
              >
                Ver Ficha de Edwin Agudelo (Solista 350 €)
              </Link>
            </div>
          )}
        </section>

        {/* Cobertura Municipal en la Provincia */}
        {topTowns.length > 0 && (
          <section className="space-y-4 pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold font-syne text-white uppercase">
              Municipios con Cobertura Directa en {provData.name}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {topTowns.map((town, tIdx) => (
                <Link
                  key={tIdx}
                  href={`/bodas/${provKey}/${servKey}/${town.slug}`}
                  className="p-3.5 rounded-2xl bg-[#09090d] border border-white/10 hover:border-[#ecb613]/50 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{town.name}</span>
                  <ArrowRight size={12} className="text-zinc-600 group-hover:text-[#ecb613] shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}