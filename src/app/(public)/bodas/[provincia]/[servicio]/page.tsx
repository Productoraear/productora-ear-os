import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Sparkles,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Award,
  Star,
  Phone,
  CheckCircle2,
  Flame,
  Music,
  Sliders,
  Clock,
  HelpCircle,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';
import { MUNICIPALITIES_DATASET } from '@/lib/constants/spanish-municipalities';
import { CENTRALITA } from '@/lib/phone-constants';
import { getProvidersByLocation } from '@/lib/data/vampire-service';
import { resolveSearchIntent } from '@/lib/seo/searchIntentEngine';
import {
  resolveCanonicalBodasService,
  getCanonicalService,
  getCanonicalServiceLabel,
  CANONICAL_SERVICES
} from '@/lib/navigation/canonical-taxonomy';

interface Props {
  params: Promise<{ provincia: string; servicio: string }>;
}

export function generateStaticParams() {
  const provinces = Object.keys(PROVINCIAS_52_GRAPH);
  const params: Array<{ provincia: string; servicio: string }> = [];

  for (const prov of provinces) {
    for (const serv of CANONICAL_SERVICES) {
      params.push({ provincia: prov, servicio: serv.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { provincia, servicio } = await params;
  const provKey = provincia.toLowerCase();
  const servKey = servicio.toLowerCase();

  // Resolución canónica SSOT (normaliza provincias/ciudades y servicios legacy).
  const canonical = resolveCanonicalBodasService(provincia, servicio);
  const provName = canonical
    ? PROVINCIAS_52_GRAPH[canonical.province]?.name ?? canonical.province
    : provincia.charAt(0).toUpperCase() + provincia.slice(1);
  const serviceSlug = canonical?.service ?? servKey;
  const service = getCanonicalService(serviceSlug);
  const servTitle = service?.label ?? getCanonicalServiceLabel(serviceSlug) ?? 'Música y Servicios para Bodas';
  const basePrice = service?.basePrice ?? 350;
  const canonicalUrl = canonical
    ? `https://productoraear.com${canonical.path}`
    : `https://productoraear.com/bodas/${provKey}/${servKey}`;

  return {
    title: `${servTitle} en ${provName} · Precios 2026 (Desde ${basePrice}€) | Productora EAR`,
    description: `Oferta Grand Slam de ${servTitle.toLowerCase()} en ${provName}. Proveedores homologados, sonido Bose 12 W/pax, seguro RC 1M€ y reserva blindada con depósito Price-Lock de 100€.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${servTitle} en ${provName} · Calibración 12 W/pax & Price-Lock 100€`,
      description: `Contratación oficial sin intermediarios abusivos en ${provName}. Garantía 0% cancelaciones con protocolo de relevo inmediato.`,
      url: canonicalUrl,
      type: 'website',
      images: [
        {
          url: 'https://productoraear.com/images/brand/ear_logo_official_diamond.png',
          alt: `${servTitle} en ${provName} · Productora EAR`
        }
      ]
    },
    keywords: [
      `${servTitle} ${provName}`,
      `precios ${servTitle} ${provName}`,
      `bodas ${provName}`,
      `fincas ${provName}`,
      `sonido bodas ${provName}`,
      `edwin agudelo ${provName}`
    ]
  };
}

export default async function BodasServicioProvinciaPage({ params }: Props) {
  const { provincia, servicio } = await params;
  const provKey = provincia.toLowerCase();
  const servKey = servicio.toLowerCase();

  // SSOT canónico: redirigir slugs legacy o geo incoherente con 301 permanente.
  const canonical = resolveCanonicalBodasService(provincia, servicio);
  if (!canonical) {
    redirect(`/bodas/${provKey}`);
  }
  if (canonical.needsRedirect) {
    redirect(canonical.path);
  }

  // 🏰 El servicio "fincas" se sirve con el catálogo certificado real
  // (aforo, potencia, acústica y distancia), nunca con una plantilla SEO vacía.
  if (canonical.service === 'fincas') {
    redirect(`/fincas/${canonical.province}`);
  }

  const provData = PROVINCIAS_52_GRAPH[canonical.province] || { name: canonical.province, slug: canonical.province };
  const service = getCanonicalService(canonical.service);
  const servData = {
    title: service?.label ?? getCanonicalServiceLabel(canonical.service) ?? 'Música y Producción de Bodas',
    id: canonical.service,
    path: canonical.service,
    basePrice: service?.basePrice ?? 350
  };

  const intent = resolveSearchIntent(service?.intentGremio ?? canonical.service, canonical.province);
  const providers = await getProvidersByLocation(canonical.province, canonical.service, 12);
  const topTowns = (MUNICIPALITIES_DATASET[canonical.province] || []).slice(0, 8);
  const basePrice = servData.basePrice || intent.basePrice || 350;

  // Schema.org JSON-LD
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${servData.title} en ${provData.name}`,
    description: `Contratación oficial de ${servData.title.toLowerCase()} en ${provData.name} con calibración Bose 12 W/pax, seguro de RC 1M€ y depósito Price-Lock de 100€.`,
    provider: {
      '@type': 'EntertainmentBusiness',
      name: 'Productora EAR',
      url: 'https://productoraear.com',
      telephone: '+34693693048',
      email: 'productoraear@gmail.com'
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: provData.name
    },
    offers: {
      '@type': 'Offer',
      price: basePrice.toFixed(2),
      priceCurrency: 'EUR',
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
      url: `https://productoraear.com${canonical.path}`
    }
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: intent.faqs.map(faq => ({
      '@type': 'Question',
      name: faq,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `En Productora EAR ofrecemos ${servData.title.toLowerCase()} en ${provData.name} con tarifa base desde ${basePrice} €, sonido Bose profesional de 12 W/pax, seguro de RC de 1.000.000 € y bloqueo seguro de fecha mediante depósito de 100 € en Stripe.`
      }
    }))
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black font-sans pt-28 pb-36 px-4 sm:px-6 lg:px-8">
      {/* Microdatos estructurados */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-7xl mx-auto space-y-16">

        {/* Breadcrumb S-Class */}
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Link href="/" className="hover:text-[#ecb613] transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/bodas" className="hover:text-[#ecb613] transition-colors">Bodas</Link>
          <span>/</span>
          <Link href={`/bodas/${canonical.province}`} className="hover:text-[#ecb613] transition-colors">{provData.name}</Link>
          <span>/</span>
          <span className="text-[#ecb613] font-bold">{servData.title}</span>
        </nav>

        {/* 🏆 HERO HORMOZI $100M GRAND SLAM OFFER */}
        <header className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] rounded-full text-xs font-mono uppercase font-bold tracking-wider">
            <Sparkles size={14} className="animate-pulse" />
            <span>Garantía 0% Cancelaciones // Relevo Garantizado en {provData.name}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-syne tracking-tight text-white uppercase leading-none">
            {servData.title} en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-amber-400">
              {provData.name}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-300 font-light leading-relaxed">
            {intent.dreamOutcome}. Hardware Bose calibrado a 12 W/pax, artistas y técnicos homologados sin sobrecostes parasitarios y bloqueo de fecha con depósito protegido de 100 €.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href={`/cotizador?provincia=${encodeURIComponent(provData.name)}&ocasion=${encodeURIComponent(servData.title)}`}
              className="px-8 py-4 bg-[#ecb613] hover:bg-[#ecb613]/90 text-black font-mono text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95"
            >
              Bloquear Fecha (Depósito 100€ Price-Lock)
            </Link>
            <a
              href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola Productora EAR, solicito disponibilidad oficial de ${servData.title} en ${provData.name}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all flex items-center gap-2 hover:border-[#ecb613]/40"
            >
              <Phone size={14} className="text-[#ecb613]" />
              <span>WhatsApp Directo (+34 693 693 048)</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <span className="text-xs font-mono text-zinc-500 uppercase block">Tarifa Base</span>
              <span className="text-2xl font-black font-syne text-[#ecb613]">Desde {basePrice} €</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <span className="text-xs font-mono text-zinc-500 uppercase block">Calibración</span>
              <span className="text-2xl font-black font-syne text-white">12 W/pax</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <span className="text-xs font-mono text-zinc-500 uppercase block">Seguro de RC</span>
              <span className="text-2xl font-black font-syne text-white">1.000.000 €</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
              <span className="text-xs font-mono text-zinc-500 uppercase block">Split Soberano</span>
              <span className="text-2xl font-black font-syne text-emerald-400">80 / 10 / 10</span>
            </div>
          </div>
        </header>

        {/* 📦 BENTO GRID: LOS 3 DOLORES RESUELTOS (IMPECCABLE UI) */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest block font-bold">
              // Ingeniería Anti-Fracaso
            </span>
            <h2 className="text-3xl font-black font-syne text-white uppercase mt-1">
              Los 3 Grandes Riesgos que EAR OS Elimina de tu Boda
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dolor 1 */}
            <div className="rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-lg font-bold font-syne text-white uppercase">
                  1. Cancelaciones de Última Hora
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light">
                  {intent.leadPainPoints[0] || 'Proveedores informales que cancelan a días del evento dejando la boda en silencio.'}
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 size={14} />
                <span>Relevo Homologado &lt; 90 min</span>
              </div>
            </div>

            {/* Dolor 2 */}
            <div className="rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sliders size={20} />
                </div>
                <h3 className="text-lg font-bold font-syne text-white uppercase">
                  2. Multas y Sonido Deficiente
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light">
                  {intent.leadPainPoints[1] || 'Sanciones policiales por exceder los decibelios permitidos o sonido inaudible que arruina el banquete.'}
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-[#ecb613]">
                <CheckCircle2 size={14} />
                <span>Bose 12 W/pax Ley 37/2003</span>
              </div>
            </div>

            {/* Dolor 3 */}
            <div className="rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Flame size={20} />
                </div>
                <h3 className="text-lg font-bold font-syne text-white uppercase">
                  3. Pistas de Baile Vacías
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light">
                  {intent.leadPainPoints[2] || 'Repertorios rígidos de artistas sin conexión con el público que apagan la emoción de los invitados.'}
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-purple-400">
                <CheckCircle2 size={14} />
                <span>Psicología de Pista Personalizada</span>
              </div>
            </div>
          </div>
        </section>

        {/* 💎 GRAND SLAM VALUE STACK ($100M OFFERS) */}
        <section className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-black to-[#09090d] border border-[#ecb613]/30 p-8 sm:p-12 space-y-8 shadow-2xl shadow-amber-500/10">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest font-bold">
              // Todo lo Incluido en tu Contrato Oficial
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-syne text-white uppercase">
              Grand Slam Offer · {servData.title}
            </h2>
            <p className="text-zinc-400 text-sm font-light">
              Desglose transparente del valor acumulado que recibes por una fracción de su coste en el mercado:
            </p>
          </div>

          <div className="space-y-3">
            {intent.hormoziValueStack.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#ecb613] shrink-0" />
                  <span className="text-sm sm:text-base font-medium text-white">{item.label}</span>
                </div>
                <span className="text-xs font-mono text-zinc-500 line-through">
                  Valor: {item.value} €
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-white/10">
            <div>
              <span className="text-xs font-mono text-zinc-500 uppercase block">Valor Total Acumulado</span>
              <span className="text-sm font-mono line-through text-zinc-400">{intent.hormoziValueTotal} €</span>
              <div className="text-3xl sm:text-4xl font-black font-syne text-[#ecb613]">
                Desde {basePrice} €{' '}
                <span className="text-xs font-mono text-zinc-400 font-normal">
                  (Bloqueo con 100 €)
                </span>
              </div>
            </div>

            <Link
              href={`/cotizador?provincia=${encodeURIComponent(provData.name)}&ocasion=${encodeURIComponent(servData.title)}`}
              className="w-full sm:w-auto px-8 py-4 bg-[#ecb613] hover:bg-[#ecb613]/90 text-black font-mono text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-amber-500/20 text-center"
            >
              Reclamar Oferta con Price-Lock 100€
            </Link>
          </div>
        </section>

        {/* 👥 ROSTER DE PROVEEDORES HOMOLOGADOS EN LA PROVINCIA */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest block font-bold">
                // Verificados por Productora EAR
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-syne text-white uppercase mt-1">
                Profesionales y Espacios en {provData.name} ({providers.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500 hidden sm:inline">Cero cuotas mensuales para proveedores</span>
          </div>

          {providers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((p, idx) => {
                const coverImg = (p.imageUrls && p.imageUrls[0]) ? p.imageUrls[0] : 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop';
                const catLabel = (p.category || 'Servicio Homologado').toUpperCase();

                return (
                  <div
                    key={idx}
                    className="rounded-3xl bg-[#09090d] border border-white/10 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between group overflow-hidden shadow-lg shadow-black/40 hover:-translate-y-1 duration-300"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050505]">
                      <img
                        src={coverImg}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-transparent to-black/40 pointer-events-none" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-[#ecb613]/40 text-[#ecb613] rounded-full text-[10px] font-mono uppercase font-bold tracking-wider">
                          {catLabel}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-md rounded-full text-white text-[10px] font-mono font-bold">
                        <Star size={10} className="fill-[#ecb613] text-[#ecb613]" />
                        <span>{p.rating || 4.9}</span>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold font-syne text-white group-hover:text-[#ecb613] transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed font-light">
                          {p.description || `Servicio profesional homologado en la provincia de ${provData.name} con calibración acústica S-Class.`}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs font-mono text-zinc-400">
                          <MapPin size={12} className="text-[#ecb613]" />
                          <span>{p.province || provData.name}</span>
                        </div>
                        <Link
                          href={`/proveedores/${p.id}`}
                          className="px-3 py-1.5 bg-white/5 hover:bg-[#ecb613] text-white hover:text-black font-mono text-[11px] font-bold uppercase rounded-lg transition-all flex items-center gap-1"
                        >
                          <span>Ver Ficha</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4">
              <Sparkles size={32} className="mx-auto text-[#ecb613]" />
              <h3 className="text-lg font-bold font-syne uppercase">Cobertura Oficial Activa en {provData.name}</h3>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto">
                Despachamos unidades móviles y agrupaciones artísticas directas desde nuestro Hub Central con el SLA de 12 W/pax y Price-Lock 100€.
              </p>
              <Link
                href={`/cotizador?provincia=${encodeURIComponent(provData.name)}&ocasion=${encodeURIComponent(servData.title)}`}
                className="inline-block px-6 py-3 bg-[#ecb613] text-black font-mono text-xs font-bold uppercase rounded-xl"
              >
                Solicitar Reserva Directa
              </Link>
            </div>
          )}
        </section>

        {/* ❓ PREGUNTAS FRECUENTES PARA MOTORES DE IA & CLIENTES */}
        <section className="space-y-6 pt-8 border-t border-white/10">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest font-bold">
              // Transparencia Total
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-syne text-white uppercase">
              Preguntas Frecuentes sobre {servData.title} en {provData.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intent.faqs.map((q, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2"
              >
                <div className="flex items-start gap-2">
                  <HelpCircle size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                  <h3 className="text-sm font-bold text-white">{q}</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-light pl-6">
                  Contratación respaldada por Productora EAR. Cobertura completa en {provData.name}, tarifa base oficial y formalización con depósito inmutable de 100 € en Stripe.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 🗺️ POBLACIONES DESTACADAS DE LA PROVINCIA */}
        {topTowns.length > 0 && (
          <section className="space-y-4 pt-8 border-t border-white/10">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block font-bold">
              Localidades Destacadas en {provData.name}
            </span>
            <div className="flex flex-wrap gap-2">
              {topTowns.map((town, idx) => (
                <Link
                  key={idx}
                  href={`/bodas/${canonical.province}/${canonical.service}/${town.slug}`}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-[#ecb613]/10 border border-white/10 hover:border-[#ecb613]/30 text-xs font-mono text-zinc-400 hover:text-[#ecb613] transition-all"
                >
                  {town.name}
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}