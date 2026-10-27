import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
    ArrowRight,
    BadgeCheck,
    CreditCard,
    Gauge,
    Globe2,
    MapPin,
    MessageCircle,
    Music4,
    Phone,
    ShieldCheck,
    Sparkles,
    Users,
} from 'lucide-react';
import {
    DEPOSITO_STRIPE_EUR,
    LIMITE_SPL_DB,
    LOGISTICA_EUR_PER_KM,
    LOGISTICA_KM_EXENTOS,
    SUPLEMENTO_HOTEL_EUR,
    WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';
import { CENTRALITA_MARIACHIS_ENTITY } from '@/lib/constants/centralita-mariachis-entity';
import { MARIACHI_FORMATS } from '@/lib/mariachi/mariachiDispatchCore';
import {
    MARIACHI_CANONICAL_BASE,
    MARIACHI_HUB,
    MARIACHI_LANDINGS,
} from '@/lib/seo/centralita-mariachis-dominance-engine';
import {
    ClusterMatrixExplorer,
    type ClusterMatrixGroup,
} from '@/components/dominance/ClusterMatrixExplorer';

const HUB_URL = `${MARIACHI_CANONICAL_BASE}/centralita-mariachis`;

export const metadata: Metadata = {
    title: 'Centralita de Mariachis · Contratación directa en España y Europa',
    description:
        'Centralita de Mariachis: contratación directa de mariachi con Edwin Agudelo. 220 landings, 40 mercados en España y Europa, depósito de 100 € deducible, rider acústico Ley 37/2003 y presupuesto por escrito.',
    keywords: [
        'centralita de mariachis',
        'contratar mariachi europa',
        'mariachi para bodas',
        'serenata sorpresa',
        'mariachi XV años',
        'mariachi fiestas patronales',
    ],
    alternates: { canonical: HUB_URL },
    openGraph: {
        title: 'Centralita de Mariachis · Edwin Agudelo',
        description:
            'Mariachi en directo con contratación directa: 40 mercados, depósito de 100 € deducible y rider acústico homologado.',
        url: HUB_URL,
        siteName: 'Productora EAR',
        locale: 'es_ES',
        type: 'website',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format&fit=crop',
                width: 1200,
                height: 630,
                alt: 'Centralita de Mariachis · mariachi en directo para bodas y eventos',
            },
        ],
    },
};

const ACCENTS = ['oro', 'rubi', 'cyan', 'oro'] as const;

/** Construye la matriz de 220 URLs agrupada por vertical e intención. */
function buildExplorerGroups(): readonly ClusterMatrixGroup[] {
    const geoGroups: ClusterMatrixGroup[] = MARIACHI_HUB.groups.map((group, index) => ({
        id: group.vertical.slug,
        label: group.vertical.label,
        accent: ACCENTS[index % ACCENTS.length] ?? 'oro',
        items: group.landings.map((landing) => ({
            id: landing.slug,
            label: `${landing.verticalLabel} · ${landing.marketName}`,
            href: landing.path,
            meta:
                landing.band === 'europa'
                    ? `${landing.marketCountry} · ${landing.travelMode}`
                    : `${landing.marketCountry} · ${landing.corridor}`,
        })),
    }));

    const intentGroup: ClusterMatrixGroup = {
        id: 'intenciones',
        label: 'Consultas transaccionales',
        accent: 'cyan',
        items: MARIACHI_LANDINGS.filter((landing) => landing.kind === 'intent').map(
            (landing) => ({
                id: landing.slug,
                label: landing.h1,
                href: landing.path,
                meta: `${landing.marketName} · ${landing.eventNoun}`,
            }),
        ),
    };

    return [...geoGroups, intentGroup];
}

export default function CentralitaMariachisHubPage(): React.JSX.Element {
    const whatsappUrl = `https://wa.me/${CENTRALITA_MARIACHIS_ENTITY.officialLine.replace(/\D/g, '')}?text=${encodeURIComponent(
        'Hola Edwin, quiero contratar mariachi a través de la Centralita de Mariachis. Necesito disponibilidad y presupuesto.',
    )}`;
    const groups = buildExplorerGroups();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'MusicGroup',
                '@id': `${HUB_URL}#musicgroup`,
                name: CENTRALITA_MARIACHIS_ENTITY.brand,
                alternateName: CENTRALITA_MARIACHIS_ENTITY.commercialName,
                description: CENTRALITA_MARIACHIS_ENTITY.tagline,
                url: HUB_URL,
                telephone: CENTRALITA_MARIACHIS_ENTITY.officialLine,
                email: CENTRALITA_MARIACHIS_ENTITY.email,
                genre: 'Mariachi',
                founder: {
                    '@type': 'Person',
                    name: CENTRALITA_MARIACHIS_ENTITY.operator,
                    jobTitle: CENTRALITA_MARIACHIS_ENTITY.operatorRole,
                },
                member: {
                    '@type': 'Person',
                    name: CENTRALITA_MARIACHIS_ENTITY.residentArtist.name,
                    jobTitle: CENTRALITA_MARIACHIS_ENTITY.residentArtist.role,
                },
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: CENTRALITA_MARIACHIS_ENTITY.baseMunicipality,
                    addressRegion: CENTRALITA_MARIACHIS_ENTITY.baseProvince,
                    addressCountry: 'ES',
                },
                areaServed: [
                    { '@type': 'Country', name: 'España' },
                    { '@type': 'Place', name: 'Europa' },
                ],
            },
            {
                '@type': 'CollectionPage',
                '@id': `${HUB_URL}#collection`,
                name: 'Centralita de Mariachis · malla de dominancia',
                description: `${MARIACHI_HUB.total} landings verificadas: ${MARIACHI_HUB.geoCount} geográficas y ${MARIACHI_HUB.intentCount} de intención.`,
                url: HUB_URL,
                isPartOf: {
                    '@type': 'WebSite',
                    name: 'Productora EAR',
                    url: MARIACHI_CANONICAL_BASE,
                },
                about: { '@type': 'MusicGroup', name: CENTRALITA_MARIACHIS_ENTITY.brand },
                hasPart: MARIACHI_LANDINGS.slice(0, 24).map((landing) => ({
                    '@type': 'WebPage',
                    name: landing.title,
                    url: `${MARIACHI_CANONICAL_BASE}${landing.path}`,
                })),
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Inicio',
                        item: MARIACHI_CANONICAL_BASE,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Centralita de Mariachis',
                        item: HUB_URL,
                    },
                ],
            },
        ],
    };

    return (
        <main className="min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black pt-28 pb-24 overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
                }}
            />

            <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/15 blur-[140px]" />

                <div className="relative mx-auto max-w-4xl space-y-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-[#ecb613]">
                        <BadgeCheck className="h-4 w-4" />
                        Operador verificado · línea con titular
                    </div>

                    <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                        Centralita de Mariachis
                        <span className="mt-3 block bg-gradient-to-r from-[#ecb613] via-amber-200 to-[#ecb613] bg-clip-text font-serif text-xl font-normal italic text-transparent sm:text-3xl">
                            Contratación directa de mariachi en España y Europa
                        </span>
                    </h1>

                    <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg">
                        Un solo número para cerrar serenatas, bodas, XV años y fiestas patronales.
                        Edwin Agudelo responde con formato, fecha y precio por escrito; el depósito de{' '}
                        {DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',')} € se descuenta íntegro del
                        total.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        <a
                            href="/reservar/solista?formato=gala"
                            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#ecb613] via-[#f7cb45] to-[#ecb613] px-8 py-4 text-sm font-extrabold text-black shadow-xl shadow-[#ecb613]/25 transition-all duration-300 ease-out hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] sm:text-base"
                        >
                            <CreditCard className="h-5 w-5" />
                            Bloquear fecha con {DEPOSITO_STRIPE_EUR.toFixed(0)} € deducibles
                        </a>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-[#09090d]/80 px-6 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 ease-out hover:bg-white/10 sm:text-base"
                        >
                            <MessageCircle className="h-5 w-5 text-[#ecb613]" />
                            WhatsApp directo
                        </a>
                        <a
                            href={`tel:${CENTRALITA_MARIACHIS_ENTITY.officialLineRaw}`}
                            className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 px-6 py-4 text-sm font-semibold text-gray-300 transition-all duration-300 ease-out hover:border-white/30 hover:text-white"
                        >
                            <Phone className="h-5 w-5" />
                            {CENTRALITA_MARIACHIS_ENTITY.officialLine}
                        </a>
                    </div>

                    <p className="text-[11px] font-mono text-gray-500">
                        Base logística: {CENTRALITA_MARIACHIS_ENTITY.baseFullLabel} · Cobertura:{' '}
                        {MARIACHI_HUB.coverageLabel}
                    </p>
                </div>

                <dl className="relative mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        { label: 'Landings verificadas', value: String(MARIACHI_HUB.total), icon: Music4 },
                        { label: 'Mercados', value: String(MARIACHI_HUB.marketCount), icon: Globe2 },
                        { label: 'Países', value: String(MARIACHI_HUB.countryCount), icon: MapPin },
                        {
                            label: 'Depósito deducible',
                            value: `${DEPOSITO_STRIPE_EUR.toFixed(0)} €`,
                            icon: CreditCard,
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-5 backdrop-blur-md transition-all duration-300 ease-out hover:border-[#ecb613]/40"
                        >
                            <stat.icon className="h-4 w-4 text-[#ecb613]" />
                            <dd className="mt-3 text-2xl font-extrabold text-white">{stat.value}</dd>
                            <dt className="mt-1 text-[11px] font-mono uppercase tracking-wider text-gray-500">
                                {stat.label}
                            </dt>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-mono uppercase tracking-wider text-[#ecb613]">
                            Catálogo con precio SSOT
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                            Formatos desde {MARIACHI_FORMATS[0]?.basePrice.toFixed(0) ?? '350'} €
                        </h2>
                    </div>
                    <p className="max-w-md text-sm text-gray-400">
                        El precio de cada formato nace de <code className="text-gray-300">MARIACHI_FORMATS</code> y
                        el depósito de {DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',')} € se descuenta
                        íntegro del importe final.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {MARIACHI_FORMATS.map((format) => (
                        <article
                            key={format.id}
                            className="group flex h-full flex-col rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#ecb613]/50"
                        >
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-extrabold text-white">
                                    {format.basePrice.toFixed(0)} €
                                </span>
                                <span className="text-[11px] font-mono text-gray-500">sin IVA</span>
                            </div>
                            <h3 className="mt-3 text-sm font-bold text-white">{format.name}</h3>
                            <p className="mt-2 flex-1 text-xs leading-relaxed text-gray-400">
                                {format.description}
                            </p>
                            <ul className="mt-4 space-y-1.5 text-[11px] font-mono text-gray-500">
                                <li className="flex items-center gap-2">
                                    <Users className="h-3.5 w-3.5 text-[#ecb613]" />
                                    {format.members} músicos · {format.repertoireCount} temas
                                </li>
                                <li className="flex items-center gap-2">
                                    <Gauge className="h-3.5 w-3.5 text-[#ecb613]" />
                                    {format.recommendedFor}
                                </li>
                                <li className="flex items-center gap-2">
                                    <ShieldCheck className="h-3.5 w-3.5 text-[#ecb613]" />
                                    Rider ≤ {LIMITE_SPL_DB} dB SPL · depósito {format.depositAmount.toFixed(0)} €
                                </li>
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <p className="text-xs font-mono uppercase tracking-wider text-[#ecb613]">
                        Cuatro verticales, una sola centralita
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                        Qué se contrata y con qué formato
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {MARIACHI_HUB.groups.map((group, index) => {
                        const representative = group.landings[0];
                        const accent =
                            index % 3 === 0
                                ? 'text-[#ecb613] border-[#ecb613]/40'
                                : index % 3 === 1
                                  ? 'text-[#FF2B44] border-[#FF2B44]/40'
                                  : 'text-[#00E5FF] border-[#00E5FF]/40';
                        return (
                            <article
                                key={group.vertical.slug}
                                className={`rounded-3xl border bg-[#09090d]/80 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 ${accent}`}
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
                                        className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-white transition-colors duration-300 hover:text-[#ecb613]"
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
                    <p className="text-xs font-mono uppercase tracking-wider text-[#ecb613]">
                        Malla completa · {MARIACHI_HUB.total} URLs
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                        Busca tu ciudad o tu tipo de evento
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
                        {MARIACHI_HUB.geoCount} landings geográficas (40 mercados × 4 verticales) y{' '}
                        {MARIACHI_HUB.intentCount} consultas transaccionales. Cada URL tiene copy
                        propio, FAQ verificable, sello SHA-256 y salida real al checkout.
                    </p>
                </div>

                <ClusterMatrixExplorer
                    groups={groups}
                    allLabel="Todos"
                    searchPlaceholder="Busca Madrid, París, serenata, XV años, fiesta patronal…"
                    emptyLabel="No hay URLs que coincidan con esa búsqueda. Prueba con otra ciudad o vertical."
                />
            </section>

            <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <article className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#ecb613]">
                            <ShieldCheck className="h-4 w-4" />
                            Verificación del operador
                        </div>
                        <dl className="mt-5 space-y-3 text-sm">
                            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 pb-3">
                                <dt className="text-gray-500">Titular de la línea</dt>
                                <dd className="text-gray-200">{CENTRALITA_MARIACHIS_ENTITY.lineOwner}</dd>
                            </div>
                            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 pb-3">
                                <dt className="text-gray-500">Regla</dt>
                                <dd className="font-mono text-[11px] text-gray-300">
                                    {CENTRALITA_MARIACHIS_ENTITY.verificationRule}
                                </dd>
                            </div>
                            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 pb-3">
                                <dt className="text-gray-500">Base logística</dt>
                                <dd className="text-gray-200">{CENTRALITA_MARIACHIS_ENTITY.baseFullLabel}</dd>
                            </div>
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <dt className="text-gray-500">Cobertura</dt>
                                <dd className="text-gray-200">{MARIACHI_HUB.coverageLabel}</dd>
                            </div>
                        </dl>
                        <p className="mt-5 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs leading-relaxed text-gray-400">
                            {CENTRALITA_MARIACHIS_ENTITY.networkPolicy}
                        </p>
                    </article>

                    <article className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#ecb613]">
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
                                <div key={item.k} className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
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
                <div className="rounded-3xl border border-[#ecb613]/30 bg-gradient-to-br from-[#ecb613]/10 via-[#09090d]/80 to-[#09090d]/80 p-8 backdrop-blur-md sm:p-10">
                    <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="max-w-2xl space-y-3">
                            <h2 className="text-2xl font-bold text-white sm:text-3xl">
                                Cierra la fecha hoy, decide el repertorio después
                            </h2>
                            <p className="text-sm leading-relaxed text-gray-300">
                                El depósito de {DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',')} € bloquea
                                la fecha y se descuenta íntegro. Si el formato no encaja, se cambia antes de
                                firmar el presupuesto.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="/reservar/solista?formato=gala"
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#ecb613] px-6 py-3.5 text-sm font-extrabold text-black transition-all duration-300 ease-out hover:brightness-110"
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
                                Preguntar por WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                <nav className="mt-10 flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
                    <span className="uppercase tracking-wider text-gray-600">Sigue explorando</span>
                    <Link
                        href="/mariachis"
                        className="rounded-xl border border-white/10 px-3 py-2 transition-colors hover:border-[#ecb613]/50 hover:text-white"
                    >
                        Catálogo mariachis
                    </Link>
                    <Link
                        href="/artistas/edwin-agudelo"
                        className="rounded-xl border border-white/10 px-3 py-2 transition-colors hover:border-[#ecb613]/50 hover:text-white"
                    >
                        Edwin Agudelo
                    </Link>
                    <Link
                        href="/productora-ear"
                        className="rounded-xl border border-white/10 px-3 py-2 transition-colors hover:border-[#ecb613]/50 hover:text-white"
                    >
                        Bodas y eventos en España
                    </Link>
                    <Link
                        href="/reservar/solista"
                        className="rounded-xl border border-white/10 px-3 py-2 transition-colors hover:border-[#ecb613]/50 hover:text-white"
                    >
                        Reservar
                    </Link>
                </nav>
            </section>
        </main>
    );
}


