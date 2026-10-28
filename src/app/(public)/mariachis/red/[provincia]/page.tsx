import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    ShieldCheck,
    Check,
    ArrowRight,
    MessageCircle,
    PhoneCall,
    Lock,
    Wallet,
    TrendingUp,
    Music,
    AlertCircle,
    ChevronRight,
} from 'lucide-react';
import { MARIACHI_MARKETS } from '@/lib/seo/centralita-mariachis-dominance-engine';
import { MARIACHI_FORMATS } from '@/lib/mariachi/mariachi-formats';
import {
    buildOwnerOffer,
    isInvitationCode,
    provinceSlug,
} from '@/lib/mariachi/network-outreach';
import { CENTRALITA_MARIACHIS_ENTITY } from '@/lib/constants/centralita-mariachis-entity';
import { SPLIT_SOBERANO } from '@/lib/constants/ear-os-ssot';
import { UNCOVERED_PROVINCES_COUNT } from '@/lib/constants/mariachi-market-intelligence';

const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL ||
    CENTRALITA_MARIACHIS_ENTITY.canonicalBase;

/** Mercados españoles de la malla (24). Son los que generan plaza de red. */
const SPANISH_MARKETS = MARIACHI_MARKETS.filter((market) => market.inSpain);

type SpanishMarket = (typeof SPANISH_MARKETS)[number];

/**
 * Resuelve la plaza aceptando slug canónico, slug derivado del nombre o el
 * nombre tal cual. Así ningún enlace de captación cae en un 404 por acentos o
 * mayúsculas.
 */
function findMarket(raw: string): SpanishMarket | undefined {
    const key = provinceSlug(raw);
    return (
        SPANISH_MARKETS.find((market) => provinceSlug(market.slug) === key) ??
        SPANISH_MARKETS.find((market) => provinceSlug(market.name) === key)
    );
}

interface RedPageProps {
    params: Promise<{ provincia: string }>;
    searchParams: Promise<{ inv?: string }>;
}

/** Formato monetario español. */
function euro(amount: number): string {
    return `${amount.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} €`;
}

/**
 * Render bajo demanda (ƒ Dynamic) a propósito: la plaza se personaliza con el
 * código de invitación de `searchParams`, y leerlo en servidor impide el
 * prerender. Por eso NO hay `generateStaticParams` (sería una promesa de SSG
 * que Next nunca cumple) y por eso la ruta queda fuera del sitemap. El coste es
 * una SSR sin base de datos (~decenas de ms) en una URL noindex que solo se
 * abre desde WhatsApp 1:1.
 */
export async function generateMetadata({
    params,
}: RedPageProps): Promise<Metadata> {
    const { provincia } = await params;
    const market = findMarket(provincia);
    if (!market) {
        return { title: 'Plaza de red no disponible | Centralita de Mariachis' };
    }
    const title = `Plaza para agrupaciones de mariachi en ${market.name} · 0 € de cuota fija`;
    const description = `Tu agrupación de mariachi en ${market.name}, sin cuota mensual ni coste por lead: solo ${Math.round(
        SPLIT_SOBERANO.earOs * 100,
    )} % de infraestructura sobre bolo cobrado, depósito deducible y bloqueo atómico de fecha.`;
    const canonical = `${BASE_URL}/mariachis/red/${market.slug}`;
    return {
        title,
        description,
        // Landings de captación B2B distribuidas 1:1 por WhatsApp: 24 URLs
        // casi idénticas serían doorway y diluirían el clúster comercial de
        // clientes (Jaccard ≤ 0,10). Se sirven sin indexar a propósito.
        robots: { index: false, follow: false },
        alternates: { canonical },
        openGraph: {
            type: 'website',
            locale: 'es_ES',
            url: canonical,
            siteName: 'Productora EAR',
            title,
            description,
        },
        twitter: { card: 'summary_large_image', title, description },
    };
}

export default async function MariachiNetworkPlazaPage({
    params,
    searchParams,
}: RedPageProps) {
    const { provincia } = await params;
    const { inv } = await searchParams;

    const market = findMarket(provincia);
    if (!market) {
        notFound();
    }

    const offer = buildOwnerOffer(MARIACHI_FORMATS);
    const invitationCode =
        inv && isInvitationCode(inv) ? inv.toUpperCase() : null;
    const artistPct = Math.round(offer.artistPayoutRate * 100);
    const infraPct = Math.round(offer.successFeeRate * 100);
    const centralitaDigits =
        CENTRALITA_MARIACHIS_ENTITY.officialLineRaw.replace(/\D/g, '');
    const whatsappHref = `https://wa.me/${centralitaDigits}?text=${encodeURIComponent(
        `Hola ${CENTRALITA_MARIACHIS_ENTITY.operator}, tengo un grupo de mariachi en ${market.name} y quiero la plaza${
            invitationCode ? ` (invitación ${invitationCode})` : ''
        }.`,
    )}`;
    // El alta hereda la plaza y la invitación: sin esto el código sería decorativo.
    const joinHref = `/mariachis/unirse?prov=${encodeURIComponent(market.name)}${
        invitationCode ? `&inv=${invitationCode}` : ''
    }`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Service',
                '@id': `${BASE_URL}/mariachis/red/${market.slug}/#oferta-red`,
                name: `Plaza de agrupación de mariachi en ${market.name}`,
                description: `Alta de agrupaciones de mariachi en ${market.name} sin cuota fija: ${infraPct} % de infraestructura solo sobre bolo cobrado.`,
                areaServed: {
                    '@type': 'AdministrativeArea',
                    name: market.name,
                },
                provider: {
                    '@type': 'Organization',
                    '@id': `${BASE_URL}/#organization`,
                    name: CENTRALITA_MARIACHIS_ENTITY.legalName,
                    url: BASE_URL,
                    telephone: CENTRALITA_MARIACHIS_ENTITY.officialLineRaw,
                },
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'EUR',
                    price: '0',
                    description:
                        'Sin cuota de alta, sin mensualidad y sin permanencia. Comisión solo sobre bolo cobrado.',
                    availability: 'https://schema.org/InStock',
                },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Centralita de Mariachis',
                        item: `${BASE_URL}/mariachis`,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: `Red de agrupaciones · ${market.name}`,
                        item: `${BASE_URL}/mariachis/red/${market.slug}`,
                    },
                ],
            },
        ],
    };

    return (
        <main className="w-full overflow-x-hidden bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Barra contextual */}
            <div className="w-full border-b border-white/10 bg-[#07070b]/90 px-6 py-2.5 sticky top-0 z-40 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 font-mono text-xs">
                    <Link
                        href="/mariachis"
                        className="inline-flex items-center gap-1.5 text-white/70 transition-colors duration-300 ease-out hover:text-white"
                    >
                        <ChevronRight
                            size={12}
                            className="rotate-180"
                            aria-hidden="true"
                        />
                        Centralita de Mariachis
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-white/40">Red de agrupaciones</span>
                        <span className="font-bold text-[#ecb613]">
                            {market.name}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
                {/* HERO */}
                <header className="mb-16">
                    <p className="inline-flex items-center gap-2 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#ecb613]">
                        <Music size={13} aria-hidden="true" />
                        Plaza de red · {market.name}
                    </p>
                    <h1 className="mt-6 font-syne text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
                        Tu grupo en {market.name},
                        <span className="block text-[#ecb613]">
                            sin pagar por adelantado.
                        </span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                        Ni alta, ni cuota mensual, ni coste por contacto. Entras en
                        la Centralita, recibes el evento con los datos completos y
                        solo compartes infraestructura cuando el bolo se cobra.
                        Mercado local: {market.demand} — acceso por{' '}
                        {market.corridor} hacia {market.landmark}.
                    </p>
                    {invitationCode ? (
                        <p className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#09090d]/80 px-4 py-2 font-mono text-xs text-white/60 backdrop-blur-md">
                            <Lock
                                size={13}
                                className="text-[#ecb613]"
                                aria-hidden="true"
                            />
                            Invitación verificada ·{' '}
                            <strong className="tracking-[0.2em] text-white">
                                {invitationCode}
                            </strong>
                        </p>
                    ) : null}
                </header>

                {/* LA CUENTA QUE NADIE TE HACE */}
                <section aria-labelledby="cuenta" className="mb-16">
                    <h2
                        id="cuenta"
                        className="mb-6 font-syne text-2xl font-bold tracking-tight sm:text-3xl"
                    >
                        La cuenta que nadie te hace
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:border-white/20">
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                                Modelo de cuota fija
                            </p>
                            <p className="mt-3 font-syne text-3xl font-black text-[#FF2B44]">
                                {euro(offer.observedAnnualCostEur)}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-white/60">
                                Al año, cierres o no cierres. Y encima pagas{' '}
                                <strong className="text-white/80">
                                    4 € por cada lead aceptado
                                </strong>
                                , a ciegas: sin precio publicado, todo es
                                «consultar».
                            </p>
                        </div>
                        <div className="rounded-3xl border border-[#ecb613]/30 bg-[#09090d]/80 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:border-[#ecb613]/60">
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#ecb613]">
                                Centralita de Mariachis
                            </p>
                            <p className="mt-3 font-syne text-3xl font-black text-[#ecb613]">
                                {euro(offer.fixedAnnualCostEur)} fijos
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-white/60">
                                Pagas {infraPct} % de infraestructura solo cuando
                                el bolo está cobrado. Tú te quedas el{' '}
                                <strong className="text-white/80">
                                    {artistPct} %
                                </strong>
                                . Sin permanencia: sales cuando quieras.
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-white/50">
                        <AlertCircle
                            size={15}
                            className="mt-0.5 shrink-0 text-[#ecb613]"
                            aria-hidden="true"
                        />
                        <p>
                            Transparencia total: con un bolo medio de{' '}
                            {euro(offer.averageBookingValueEur)}, nuestro modelo
                            solo cuesta más que su cuota fija a partir de{' '}
                            <strong className="text-white/80">
                                {offer.breakEvenBookings} bolos al año
                            </strong>{' '}
                            ({euro(offer.breakEvenGrossRevenueEur)} facturados).
                            Por debajo de esa cifra, el riesgo es nuestro.
                        </p>
                    </div>
                </section>

                {/* QUÉ RECIBES */}
                <section aria-labelledby="recibes" className="mb-16">
                    <h2
                        id="recibes"
                        className="mb-6 font-syne text-2xl font-bold tracking-tight sm:text-3xl"
                    >
                        Qué recibes desde el minuto uno
                    </h2>
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {offer.valueLines.map((line) => (
                            <li
                                key={line.label}
                                className="flex items-start gap-3 rounded-3xl border border-white/10 bg-[#09090d]/80 p-5 backdrop-blur-md transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:bg-[#0d0d13]"
                            >
                                <Check
                                    size={16}
                                    className="mt-0.5 shrink-0 text-[#ecb613]"
                                    aria-hidden="true"
                                />
                                <div>
                                    <p className="font-syne text-sm font-bold text-white">
                                        {line.label}
                                        {line.valueEur !== null ? (
                                            <span className="ml-2 font-mono text-[11px] font-normal text-white/40">
                                                {euro(line.valueEur)}
                                            </span>
                                        ) : null}
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-white/55">
                                        {line.detail}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* FORMATOS */}
                <section aria-labelledby="formatos" className="mb-16">
                    <h2
                        id="formatos"
                        className="mb-2 font-syne text-2xl font-bold tracking-tight sm:text-3xl"
                    >
                        Lo que cobra el cliente en {market.name}
                    </h2>
                    <p className="mb-6 text-sm text-white/50">
                        Precio cerrado, publicado y sin «consultar». Tu neto es el{' '}
                        {artistPct} % de cada línea.
                    </p>
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#09090d]/80 backdrop-blur-md">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/10 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                                    <th scope="col" className="px-5 py-3">
                                        Formación
                                    </th>
                                    <th scope="col" className="px-5 py-3">
                                        Músicos
                                    </th>
                                    <th scope="col" className="px-5 py-3 text-right">
                                        Tarifa
                                    </th>
                                    <th scope="col" className="px-5 py-3 text-right">
                                        Tu neto
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {MARIACHI_FORMATS.map((format) => (
                                    <tr
                                        key={format.id}
                                        className="border-b border-white/5 transition-colors duration-300 ease-out last:border-0 hover:bg-white/[0.03]"
                                    >
                                        <td className="px-5 py-3 font-medium text-white">
                                            {format.name}
                                        </td>
                                        <td className="px-5 py-3 font-mono text-white/60">
                                            {format.members}
                                        </td>
                                        <td className="px-5 py-3 text-right font-mono text-white">
                                            {euro(format.basePrice)}
                                        </td>
                                        <td className="px-5 py-3 text-right font-mono text-[#ecb613]">
                                            {euro(
                                                Math.round(
                                                    format.basePrice *
                                                        offer.artistPayoutRate,
                                                ),
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3 text-[11px] leading-relaxed text-white/40">
                        Tarifas base sin logística variable (1,50 €/km desde el km
                        50 y 120 € de hotel cuando procede).{' '}
                        {UNCOVERED_PROVINCES_COUNT} provincias del país siguen sin
                        plaza real: llegar antes es ocupar el mapa.
                    </p>
                </section>

                {/* CTA */}
                <section className="rounded-3xl border border-[#ecb613]/25 bg-gradient-to-b from-[#ecb613]/10 to-transparent p-8 backdrop-blur-md sm:p-10">
                    <h2 className="font-syne text-2xl font-black tracking-tight sm:text-3xl">
                        Dos formas de entrar. Elige la tuya.
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
                        Sin formularios eternos ni llamadas de insistencia. Si te
                        interesa, hablas con {CENTRALITA_MARIACHIS_ENTITY.operator}{' '}
                        directamente.
                    </p>
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href={joinHref}
                            className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#ecb613] px-6 py-4 text-sm font-black uppercase tracking-wider text-black shadow-xl shadow-[#ecb613]/20 transition-all duration-300 ease-out hover:bg-amber-300"
                        >
                            <ShieldCheck size={16} aria-hidden="true" />
                            Activar mi perfil
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                        <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 ease-out hover:border-[#ecb613]/50 hover:bg-white/10"
                        >
                            <MessageCircle size={16} aria-hidden="true" />
                            Hablar por WhatsApp
                        </a>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5 font-mono text-[11px] text-white/40">
                        <a
                            href={`tel:${CENTRALITA_MARIACHIS_ENTITY.officialLineRaw}`}
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                        >
                            <PhoneCall size={12} className="text-[#ecb613]" />
                            {CENTRALITA_MARIACHIS_ENTITY.officialLine}
                        </a>
                        <span className="inline-flex items-center gap-1.5">
                            <Wallet size={12} className="text-[#ecb613]" />
                            {euro(offer.depositEur)} deducible al cliente
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <TrendingUp size={12} className="text-[#ecb613]" />
                            {artistPct} % neto al grupo
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Lock size={12} className="text-[#ecb613]" />
                            Fecha bloqueada de forma atómica
                        </span>
                    </div>
                </section>

                <p className="mt-10 text-[11px] leading-relaxed text-white/30">
                    Datos de mercado observados el 2026-10-28 sobre páginas públicas
                    de intermediación en España. No reproducimos catálogos, textos
                    ni marcas de terceros: este documento describe únicamente
                    condiciones de nuestra propia oferta. Comunicación comercial
                    con baja inmediata a un solo mensaje (RGPD, art. 21).
                </p>
            </div>
        </main>
    );
}
