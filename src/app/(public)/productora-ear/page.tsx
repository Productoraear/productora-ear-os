import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
    ArrowRight,
    BadgeCheck,
    CreditCard,
    Gauge,
    Landmark,
    MapPin,
    MessageCircle,
    Music4,
    Phone,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import {
    DEPOSITO_STRIPE_EUR,
    LIMITE_SPL_DB,
    LOGISTICA_EUR_PER_KM,
    LOGISTICA_KM_EXENTOS,
    SUPLEMENTO_HOTEL_EUR,
    WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';
import { EAR_EVENTOS_ENTITY } from '@/lib/constants/ear-eventos-entity';
import {
    EAR_EVENTOS_CANONICAL_BASE,
    EVENT_HUB,
    EVENT_LANDINGS,
    EVENT_PROVINCES,
} from '@/lib/seo/ear-eventos-dominance-engine';
import {
    ClusterMatrixExplorer,
    type ClusterMatrixGroup,
} from '@/components/dominance/ClusterMatrixExplorer';

const HUB_URL = `${EAR_EVENTOS_CANONICAL_BASE}/productora-ear`;
const ACCENTS = ['oro', 'rubi', 'cyan', 'oro'] as const;

export const metadata: Metadata = {
    title: 'Productora EAR · Bodas y Eventos en las 52 Provincias de España',
    description:
        'Producción de bodas y eventos en toda España: 268 landings provinciales, música en directo, sonido homologado Ley 37/2003, depósito de 100 € deducible y presupuesto por escrito.',
    keywords: [
        'productora de bodas espana',
        'bodas y eventos espana',
        'produccion de bodas',
        'mariachi para bodas',
        'boda en finca',
        'eventos de empresa',
    ],
    alternates: { canonical: HUB_URL },
    openGraph: {
        title: 'Productora EAR · Bodas y Eventos en España',
        description:
            '52 provincias, 268 landings verificadas y una sola productora: música, sonido y coordinación con depósito deducible.',
        url: HUB_URL,
        siteName: 'Productora EAR',
        locale: 'es_ES',
        type: 'website',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
                width: 1200,
                height: 630,
                alt: 'Productora EAR · boda y eventos en España',
            },
        ],
    },
};

/** Construye la matriz de 268 URLs (4 verticales + intenciones). */
function buildExplorerGroups(): readonly ClusterMatrixGroup[] {
    const geoGroups: ClusterMatrixGroup[] = EVENT_HUB.groups.map((group, index) => ({
        id: group.vertical.slug,
        label: group.vertical.label,
        accent: ACCENTS[index % ACCENTS.length] ?? 'oro',
        items: group.landings.map((landing) => ({
            id: landing.slug,
            label: `${landing.verticalLabel} · ${landing.provinceName}`,
            href: landing.path,
            meta: `${landing.community} · ${landing.distanceKm} km de referencia`,
        })),
    }));

    const intentGroup: ClusterMatrixGroup = {
        id: 'intenciones',
        label: 'Consultas transaccionales',
        accent: 'cyan',
        items: EVENT_LANDINGS.filter((landing) => landing.kind === 'intent').map(
            (landing) => ({
                id: landing.slug,
                label: landing.h1,
                href: landing.path,
                meta: `${landing.provinceName} · ${landing.eventNoun}`,
            }),
        ),
    };

    return [...geoGroups, intentGroup];
}

export default function ProductoraEarHubPage(): React.JSX.Element {
    const whatsappUrl = `https://wa.me/${EAR_EVENTOS_ENTITY.officialLine.replace(/\D/g, '')}?text=${encodeURIComponent(
        'Hola Edwin, quiero organizar una boda o evento con Productora EAR. Necesito disponibilidad y presupuesto.',
    )}`;
    const groups = buildExplorerGroups();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${HUB_URL}#organization`,
                name: EAR_EVENTOS_ENTITY.brand,
                legalName: EAR_EVENTOS_ENTITY.legalName,
                alternateName: EAR_EVENTOS_ENTITY.commercialName,
                description: EAR_EVENTOS_ENTITY.tagline,
                url: HUB_URL,
                telephone: EAR_EVENTOS_ENTITY.officialLine,
                email: EAR_EVENTOS_ENTITY.email,
                founder: {
                    '@type': 'Person',
                    name: EAR_EVENTOS_ENTITY.operator,
                    jobTitle: EAR_EVENTOS_ENTITY.operatorRole,
                },
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: EAR_EVENTOS_ENTITY.baseMunicipality,
                    addressRegion: EAR_EVENTOS_ENTITY.baseProvince,
                    addressCountry: 'ES',
                },
                areaServed: { '@type': 'Country', name: 'España' },
            },
            {
                '@type': 'CollectionPage',
                '@id': `${HUB_URL}#collection`,
                name: 'Productora EAR · malla de dominancia nacional',
                description: `${EVENT_HUB.total} landings verificadas: ${EVENT_HUB.geoCount} provinciales y ${EVENT_HUB.intentCount} de intención en 52 provincias.`,
                url: HUB_URL,
                isPartOf: {
                    '@type': 'WebSite',
                    name: 'Productora EAR',
                    url: EAR_EVENTOS_CANONICAL_BASE,
                },
                about: { '@type': 'Organization', name: EAR_EVENTOS_ENTITY.brand },
                hasPart: EVENT_LANDINGS.slice(0, 24).map((landing) => ({
                    '@type': 'WebPage',
                    name: landing.title,
                    url: `${EAR_EVENTOS_CANONICAL_BASE}${landing.path}`,
                })),
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Inicio',
                        item: EAR_EVENTOS_CANONICAL_BASE,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Productora EAR · Bodas y Eventos',
                        item: HUB_URL,
                    },
                ],
            },
        ],
    };

    return (
        <main className="min-h-screen bg-[#030305] text-white selection:bg-[#FF2B44] selection:text-white pt-28 pb-24 overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
                }}
            />


            <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-600/10 blur-[140px]" />

                <div className="relative mx-auto max-w-4xl space-y-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#FF2B44]/30 bg-[#FF2B44]/10 px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-[#FF2B44]">
                        <BadgeCheck className="h-4 w-4" />
                        Operador verificado · 52 provincias
                    </div>

                    <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                        Productora EAR
                        <span className="mt-3 block bg-gradient-to-r from-[#FF2B44] via-rose-200 to-[#FF2B44] bg-clip-text font-serif text-xl font-normal italic text-transparent sm:text-3xl">
                            Bodas y eventos en toda España
                        </span>
                    </h1>

                    <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg">
                        Una sola productora para ceremonia, banquete y música en directo. 52 provincias,
                        268 landings verificadas y un depósito de{' '}
                        {DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',')} € que se descuenta íntegro del
                        importe final.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        <a
                            href="/reservar/solista?formato=gala"
                            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF2B44] via-[#ff5f70] to-[#FF2B44] px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-[#FF2B44]/25 transition-all duration-300 ease-out hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] sm:text-base"
                        >
                            <CreditCard className="h-5 w-5" />
                            Bloquear fecha con {DEPOSITO_STRIPE_EUR.toFixed(0)} €
                        </a>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-[#09090d]/80 px-6 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 ease-out hover:bg-white/10 sm:text-base"
                        >
                            <MessageCircle className="h-5 w-5 text-[#FF2B44]" />
                            WhatsApp directo
                        </a>
                        <a
                            href={`tel:${EAR_EVENTOS_ENTITY.officialLineRaw}`}
                            className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 px-6 py-4 text-sm font-semibold text-gray-300 transition-all duration-300 ease-out hover:border-white/30 hover:text-white"
                        >
                            <Phone className="h-5 w-5" />
                            {EAR_EVENTOS_ENTITY.officialLine}
                        </a>
                    </div>

                    <p className="text-[11px] font-mono text-gray-500">
                        Base logística: {EAR_EVENTOS_ENTITY.baseFullLabel} · Cobertura:{' '}
                        {EVENT_HUB.coverageLabel}
                    </p>
                </div>

                <dl className="relative mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        { label: 'Landings', value: String(EVENT_HUB.total), icon: Music4 },
                        { label: 'Provincias', value: String(EVENT_HUB.provinceCount), icon: MapPin },
                        { label: 'Verticales', value: String(EVENT_HUB.groups.length), icon: Landmark },
                        {
                            label: 'Depósito deducible',
                            value: `${DEPOSITO_STRIPE_EUR.toFixed(0)} €`,
                            icon: CreditCard,
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-5 backdrop-blur-md transition-all duration-300 ease-out hover:border-[#FF2B44]/40"
                        >
                            <stat.icon className="h-4 w-4 text-[#FF2B44]" />
                            <dd className="mt-3 text-2xl font-extrabold text-white">{stat.value}</dd>
                            <dt className="mt-1 text-[11px] font-mono uppercase tracking-wider text-gray-500">
                                {stat.label}
                            </dt>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <p className="text-xs font-mono uppercase tracking-wider text-[#FF2B44]">
                        Cuatro verticales de producción
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                        Qué se produce y con qué formato
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {EVENT_HUB.groups.map((group, index) => {
                        const representative = group.landings[0];
                        const accentClass =
                            index % 3 === 0
                                ? 'border-[#ecb613]/40 text-[#ecb613]'
                                : index % 3 === 1
                                  ? 'border-[#FF2B44]/40 text-[#FF2B44]'
                                  : 'border-[#00E5FF]/40 text-[#00E5FF]';
                        return (
                            <article
                                key={group.vertical.slug}
                                className={`rounded-3xl border bg-[#09090d]/80 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 ${accentClass}`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <Sparkles className="h-4 w-4" />
                                    <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500">
                                        {group.landings.length} URLs
                                    </span>
                                </div>
                                <h3 className="mt-3 text-lg font-bold text-white">
                                    {group.vertical.label}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                                    {group.vertical.promise}.
                                </p>
                                <p className="mt-3 text-[11px] font-mono text-gray-500">
                                    Rider: {group.vertical.noiseRange}
                                </p>
                                {representative && (
                                    <Link
                                        href={representative.path}
                                        className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-white transition-colors duration-300 hover:text-[#FF2B44]"
                                    >
                                        Ver ficha de referencia
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                )}
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <p className="text-xs font-mono uppercase tracking-wider text-[#FF2B44]">
                        Malla nacional · {EVENT_HUB.total} URLs
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                        Busca tu provincia o tu tipo de evento
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
                        {EVENT_HUB.geoCount} landings provinciales (52 provincias × 4 verticales) y{' '}
                        {EVENT_HUB.intentCount} consultas transaccionales. Cada URL tiene copy propio,
                        FAQ verificable, sello SHA-256 y salida real al checkout.
                    </p>
                </div>

                <ClusterMatrixExplorer
                    groups={groups}
                    allLabel="Todas"
                    searchPlaceholder="Busca Madrid, Toledo, finca, empresa, comunión…"
                    emptyLabel="No hay URLs que coincidan con esa búsqueda. Prueba con otra provincia o vertical."
                />
            </section>

            <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <article className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FF2B44]">
                            <ShieldCheck className="h-4 w-4" />
                            Verificación del operador
                        </div>
                        <dl className="mt-5 space-y-3 text-sm">
                            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 pb-3">
                                <dt className="text-gray-500">Titular de la línea</dt>
                                <dd className="text-gray-200">{EAR_EVENTOS_ENTITY.lineOwner}</dd>
                            </div>
                            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 pb-3">
                                <dt className="text-gray-500">Regla</dt>
                                <dd className="font-mono text-[11px] text-gray-300">
                                    {EAR_EVENTOS_ENTITY.verificationRule}
                                </dd>
                            </div>
                            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 pb-3">
                                <dt className="text-gray-500">Base logística</dt>
                                <dd className="text-gray-200">{EAR_EVENTOS_ENTITY.baseFullLabel}</dd>
                            </div>
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <dt className="text-gray-500">Provincias</dt>
                                <dd className="text-gray-200">{EVENT_PROVINCES.length}</dd>
                            </div>
                        </dl>
                        <p className="mt-5 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs leading-relaxed text-gray-400">
                            {EAR_EVENTOS_ENTITY.networkPolicy}
                        </p>
                    </article>

                    <article className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FF2B44]">
                            <Gauge className="h-4 w-4" />
                            Reglas del dinero y del sonido
                        </div>
                        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                            {[
                                { k: 'Depósito', v: `${DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',')} €` },
                                { k: 'Km exentos', v: `${LOGISTICA_KM_EXENTOS} km` },
                                {
                                    k: '€ / km extra',
                                    v: `${LOGISTICA_EUR_PER_KM.toFixed(2).replace('.', ',')} €`,
                                },
                                {
                                    k: 'Suplemento hotel',
                                    v: `${SUPLEMENTO_HOTEL_EUR.toFixed(2).replace('.', ',')} €`,
                                },
                                { k: 'Potencia', v: `${WATTS_PER_PAX} W/pax` },
                                { k: 'Salud pública', v: `< ${LIMITE_SPL_DB} dB SPL` },
                            ].map((item) => (
                                <div
                                    key={item.k}
                                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-3"
                                >
                                    <dt className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
                                        {item.k}
                                    </dt>
                                    <dd className="mt-1 font-semibold text-white">{item.v}</dd>
                                </div>
                            ))}
                        </dl>
                        <p className="mt-4 text-xs leading-relaxed text-gray-400">
                            Los kilómetros se miden por GPS desde la dirección fiscal del proveedor y se
                            detallan en el presupuesto. El rider acústico aplica la Ley 37/2003 del Ruido
                            y se entrega por escrito antes del evento.
                        </p>
                    </article>
                </div>
            </section>


            <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl border border-[#FF2B44]/30 bg-gradient-to-br from-[#FF2B44]/10 via-[#09090d]/80 to-[#09090d]/80 p-8 backdrop-blur-md sm:p-10">
                    <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="max-w-2xl space-y-3">
                            <h2 className="text-2xl font-bold text-white sm:text-3xl">
                                Cierra la fecha hoy, decide el menú después
                            </h2>
                            <p className="text-sm leading-relaxed text-gray-300">
                                El depósito de {DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',')} € bloquea
                                la fecha y se descuenta íntegro. Si el espacio cambia, la producción se
                                reordena antes de firmar el presupuesto.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="/reservar/solista?formato=gala"
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#FF2B44] px-6 py-3.5 text-sm font-extrabold text-white transition-all duration-300 ease-out hover:brightness-110"
                            >
                                <CreditCard className="h-4 w-4" />
                                Bloquear fecha
                            </a>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-white/10"
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                <nav className="mt-10 flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
                    <span className="uppercase tracking-wider text-gray-600">Sigue explorando</span>
                    <Link
                        href="/bodas"
                        className="rounded-xl border border-white/10 px-3 py-2 transition-colors hover:border-[#FF2B44]/50 hover:text-white"
                    >
                        Bodas
                    </Link>
                    <Link
                        href="/centralita-mariachis"
                        className="rounded-xl border border-white/10 px-3 py-2 transition-colors hover:border-[#FF2B44]/50 hover:text-white"
                    >
                        Centralita de Mariachis
                    </Link>
                    <Link
                        href="/fincas"
                        className="rounded-xl border border-white/10 px-3 py-2 transition-colors hover:border-[#FF2B44]/50 hover:text-white"
                    >
                        Fincas
                    </Link>
                    <Link
                        href="/reservar/solista"
                        className="rounded-xl border border-white/10 px-3 py-2 transition-colors hover:border-[#FF2B44]/50 hover:text-white"
                    >
                        Reservar
                    </Link>
                </nav>
            </section>
        </main>
    );
}



