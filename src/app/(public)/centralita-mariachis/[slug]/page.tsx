import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    ArrowRight,
    BadgeCheck,
    CheckCircle2,
    CreditCard,
    HelpCircle,
    MessageCircle,
    Phone,
    ShieldCheck,
} from 'lucide-react';
import {
    MARIACHI_CANONICAL_BASE,
    getMariachiLanding,
    getMariachiSlugs,
    type MariachiLanding,
} from '@/lib/seo/centralita-mariachis-dominance-engine';
import { CENTRALITA_MARIACHIS_ENTITY } from '@/lib/constants/centralita-mariachis-entity';
import { SOVEREIGN_DEMAND_CHANNEL } from '@/lib/providers/sovereign-lead-gate';
import { buildReserveQuery } from '@/lib/reservar/landing-attribution';

interface Props {
    params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

/**
 * SSG completo del clúster: las 220 URLs se pre-renderizan en build y
 * cualquier slug fuera del catálogo responde 404 real (sin soft-404).
 */
export function generateStaticParams(): { slug: string }[] {
    return getMariachiSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const landing = getMariachiLanding(slug);
    if (!landing) {
        // Falla antes de abrir el stream: garantiza HTTP 404 real (no soft-404).
        notFound();
    }
    const canonicalUrl = `${MARIACHI_CANONICAL_BASE}${landing.path}`;
    return {
        title: landing.title,
        description: landing.description,
        keywords: [...landing.keywords],
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: landing.title,
            description: landing.description,
            url: canonicalUrl,
            siteName: 'Productora EAR',
            locale: 'es_ES',
            type: 'website',
            images: [
                {
                    url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format&fit=crop',
                    width: 1200,
                    height: 630,
                    alt: `${landing.h1} · Centralita de Mariachis`,
                },
            ],
        },
    };
}

const ACCENTS: Readonly<
    Record<MariachiLanding['verticalSlug'], { text: string; border: string; bg: string; dot: string }>
> = {
    'serenata-sorpresa': {
        text: 'text-[#ecb613]',
        border: 'border-[#ecb613]/40',
        bg: 'bg-[#ecb613]/10',
        dot: 'bg-[#ecb613]',
    },
    'boda-mariachi': {
        text: 'text-[#FF2B44]',
        border: 'border-[#FF2B44]/40',
        bg: 'bg-[#FF2B44]/10',
        dot: 'bg-[#FF2B44]',
    },
    'xv-quinceanera': {
        text: 'text-[#00E5FF]',
        border: 'border-[#00E5FF]/40',
        bg: 'bg-[#00E5FF]/10',
        dot: 'bg-[#00E5FF]',
    },
    'fiesta-patronal-empresa': {
        text: 'text-[#ecb613]',
        border: 'border-[#ecb613]/40',
        bg: 'bg-[#ecb613]/10',
        dot: 'bg-[#ecb613]',
    },
};

export default async function CentralitaMariachiLandingPage({
    params,
}: Props): Promise<React.JSX.Element> {
    const { slug } = await params;
    const landing = getMariachiLanding(slug);
    if (!landing) {
        notFound();
    }

    const accent = ACCENTS[landing.verticalSlug];
    const whatsappUrl = `https://wa.me/${CENTRALITA_MARIACHIS_ENTITY.officialLine.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hola Edwin, me interesa "${landing.h1}" (${landing.marketName}). ¿Hay disponibilidad y cuál es el presupuesto?`,
    )}`;
    const reserveUrl = `/reservar/solista${buildReserveQuery({
        cluster: 'centralita-mariachis',
        landingSlug: landing.slug,
        formatId: landing.format.id,
    })}`;

    return (
        <main className="min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black pt-28 pb-24 overflow-x-hidden">
            {landing.schemaOrg.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
                    }}
                />
            ))}

            <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
                <nav
                    aria-label="Migas de pan"
                    className="flex flex-wrap items-center gap-2 font-mono text-xs text-gray-400"
                >
                    <Link href="/" className="transition-colors hover:text-white">
                        Inicio
                    </Link>
                    <span>/</span>
                    <Link
                        href="/centralita-mariachis"
                        className="transition-colors hover:text-white"
                    >
                        Centralita de Mariachis
                    </Link>
                    <span>/</span>
                    <span className="text-gray-500">{landing.marketName}</span>
                </nav>

                <section className="relative">
                    <div className="pointer-events-none absolute -top-16 left-1/3 h-72 w-72 rounded-full bg-amber-600/10 blur-[120px]" />
                    <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
                        <div className="space-y-6">
                            <div
                                className={`inline-flex items-center gap-2 rounded-full border ${accent.border} ${accent.bg} px-4 py-1.5 text-xs font-mono uppercase tracking-wider ${accent.text}`}
                            >
                                <BadgeCheck className="h-4 w-4" />
                                {landing.kicker}
                            </div>

                            <h1 className="text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                                {landing.h1}
                            </h1>

                            <p className="max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
                                {landing.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-3">
                                <a
                                    href={reserveUrl}
                                    className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#ecb613] via-[#f7cb45] to-[#ecb613] px-7 py-4 text-sm font-extrabold text-black shadow-xl shadow-[#ecb613]/20 transition-all duration-300 ease-out hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                                >
                                    <CreditCard className="h-5 w-5" />
                                    Bloquear fecha con {landing.depositEur.toFixed(0)} €
                                </a>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-[#09090d]/80 px-6 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 ease-out hover:bg-white/10"
                                >
                                    <MessageCircle className="h-5 w-5 text-[#ecb613]" />
                                    WhatsApp
                                </a>
                                <a
                                    href={`tel:${CENTRALITA_MARIACHIS_ENTITY.officialLineRaw}`}
                                    className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 px-5 py-4 text-sm font-semibold text-gray-300 transition-all duration-300 ease-out hover:border-white/30 hover:text-white"
                                >
                                    <Phone className="h-5 w-5" />
                                    Llamar
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md sm:p-8">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400">
                        <span className={`h-2 w-2 rounded-full ${accent.dot}`} />
                        Contexto verificado · {landing.marketName}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">
                        {landing.uniqueCopy}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-mono text-gray-500">
                        <span className="rounded-full border border-white/10 px-3 py-1">
                            {landing.band === 'europa' ? 'Cobertura europea' : 'Cobertura nacional'}
                        </span>
                        <span className="rounded-full border border-white/10 px-3 py-1">
                            Acceso: {landing.travelMode}
                        </span>
                        <span className="rounded-full border border-white/10 px-3 py-1">
                            {landing.corridor}
                        </span>
                        <span className="rounded-full border border-white/10 px-3 py-1">
                            {landing.landmark}
                        </span>
                    </div>
                </section>

                <section className="space-y-6">
                    <div>
                        <p className={`text-xs font-mono uppercase tracking-wider ${accent.text}`}>
                            Ficha operativa
                        </p>
                        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                            Lo que se contrata, sin letra pequeña
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {landing.sections.map((section) => (
                            <article
                                key={section.heading}
                                className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:border-white/25"
                            >
                                <h3 className="text-sm font-bold text-white">{section.heading}</h3>
                                <p className="mt-3 text-xs leading-relaxed text-gray-400">
                                    {section.body}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="space-y-5">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className={`text-xs font-mono uppercase tracking-wider ${accent.text}`}>
                                Catálogo SSOT
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                                Formatos disponibles en {landing.marketName}
                            </h2>
                        </div>
                        <p className="text-xs font-mono text-gray-500">
                            Depósito {landing.depositEur.toFixed(2).replace('.', ',')} € deducible ·{' '}
                            {landing.wattsPerPax} W/pax
                        </p>
                    </div>
                    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#09090d]/80 backdrop-blur-md">
                        <table className="w-full min-w-[560px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-gray-500">
                                    <th className="px-5 py-4">Formato</th>
                                    <th className="px-5 py-4">Músicos</th>
                                    <th className="px-5 py-4">Base sin IVA</th>
                                    <th className="px-5 py-4">Recomendado para</th>
                                    <th className="px-5 py-4" />
                                </tr>
                            </thead>
                            <tbody>
                                {landing.formats.map((format) => {
                                    const isRecommended = format.id === landing.format.id;
                                    return (
                                        <tr
                                            key={format.id}
                                            className={`border-b border-white/5 transition-colors duration-300 last:border-0 ${
                                                isRecommended ? accent.bg : 'hover:bg-white/[0.02]'
                                            }`}
                                        >
                                            <td className="px-5 py-4 font-semibold text-white">
                                                {format.name}
                                            </td>
                                            <td className="px-5 py-4 font-mono text-xs text-gray-400">
                                                {format.members}
                                            </td>
                                            <td className="px-5 py-4 font-mono text-xs text-gray-300">
                                                {format.basePrice.toFixed(2).replace('.', ',')} €
                                            </td>
                                            <td className="px-5 py-4 text-xs text-gray-400">
                                                {format.recommendedFor}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                {isRecommended ? (
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-wider ${accent.text} ${accent.bg}`}
                                                    >
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Elegido
                                                    </span>
                                                ) : (
                                                    <a
                                                        href={`/reservar/solista${buildReserveQuery({
                                                            cluster: 'centralita-mariachis',
                                                            landingSlug: landing.slug,
                                                            formatId: format.id,
                                                        })}`}
                                                        className="text-[11px] font-mono text-gray-500 transition-colors hover:text-white"
                                                    >
                                                        Reservar
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400">
                        <HelpCircle className={`h-4 w-4 ${accent.text}`} />
                        Resolución de dudas operativas
                    </div>
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                        Preguntas frecuentes sobre {landing.h1}
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {landing.faqs.map((faq) => (
                            <article
                                key={faq.question}
                                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors duration-300 hover:border-white/20"
                            >
                                <h3 className="flex items-start gap-2 text-sm font-bold text-white">
                                    <CheckCircle2
                                        className={`mt-0.5 h-4 w-4 shrink-0 ${accent.text}`}
                                    />
                                    <span>{faq.question}</span>
                                </h3>
                                <p className="mt-2 pl-6 text-xs leading-relaxed text-gray-400">
                                    {faq.answer}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md sm:p-8">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400">
                        <ShieldCheck className="h-4 w-4 text-[#ecb613]" />
                        Sello de procedencia · SHA-256
                    </div>
                    <p className="mt-3 max-w-3xl text-xs leading-relaxed text-gray-400">
                        La ficha del operador, el copy de esta URL y el price-lock se firman en build.
                        N reintentos de Stripe con la misma sesión producen un único bloqueo de fecha
                        (idempotencia ACID).
                    </p>
                    <dl className="mt-5 grid grid-cols-1 gap-3 font-mono text-[10px] text-gray-500 md:grid-cols-3">
                        {[
                            { k: 'provenance', v: landing.provenanceHash },
                            { k: 'stripeSessionId', v: landing.stripeSessionId },
                            { k: 'priceLock', v: landing.priceLockSha256 },
                        ].map((item) => (
                            <div
                                key={item.k}
                                className="break-all rounded-2xl border border-white/5 bg-black/30 p-3"
                            >
                                <dt className="text-gray-400">{item.k}</dt>
                                <dd>{item.v}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-4 break-all font-mono text-[10px] text-gray-500">
                        Entidad verificada · {landing.operator} · {SOVEREIGN_DEMAND_CHANNEL.telDisplay} ·{' '}
                        {landing.email} · regla {CENTRALITA_MARIACHIS_ENTITY.verificationRule}
                    </p>
                </section>

                {landing.related.length > 0 && (
                    <section className="space-y-4 border-t border-white/10 pt-8">
                        <p className="text-xs font-mono uppercase tracking-wider text-gray-400">
                            Otras fichas del clúster
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {landing.related.map((link) => (
                                <Link
                                    key={link.slug}
                                    href={`/centralita-mariachis/${link.slug}`}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs text-gray-300 transition-all duration-300 ease-out hover:border-[#ecb613]/50 hover:bg-[#ecb613]/5 hover:text-white"
                                >
                                    {link.label}
                                    <ArrowRight className="h-3 w-3 text-[#ecb613]" />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <section className="rounded-3xl border border-[#ecb613]/30 bg-gradient-to-br from-[#ecb613]/10 via-[#09090d]/80 to-[#09090d]/80 p-8 backdrop-blur-md">
                    <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="max-w-2xl space-y-2">
                            <h2 className="text-2xl font-bold text-white">
                                {landing.h1}: fecha bloqueada, precio por escrito
                            </h2>
                            <p className="text-sm leading-relaxed text-gray-300">
                                El depósito de {landing.depositEur.toFixed(2).replace('.', ',')} € se
                                descuenta íntegro del total. La centralita confirma disponibilidad antes
                                de mover al equipo.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href={reserveUrl}
                                className="inline-flex items-center gap-2 rounded-2xl bg-[#ecb613] px-6 py-3.5 text-sm font-extrabold text-black transition-all duration-300 ease-out hover:brightness-110"
                            >
                                <CreditCard className="h-4 w-4" />
                                Reservar ahora
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
                            <a
                                href={`tel:${CENTRALITA_MARIACHIS_ENTITY.officialLineRaw}`}
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-3.5 text-sm font-semibold text-gray-300 transition-all duration-300 ease-out hover:border-white/30 hover:text-white"
                            >
                                <Phone className="h-4 w-4" />
                                {CENTRALITA_MARIACHIS_ENTITY.officialLine}
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}





