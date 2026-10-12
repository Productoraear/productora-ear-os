import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    ShieldCheck, Check, ArrowRight, MessageCircle,
    Target, ShieldAlert, Sparkles, ChevronRight,
} from 'lucide-react';
import {
    MARIACHI_LANDINGS,
    MARIACHI_LANDING_BY_SLUG,
    MARIACHI_ACCENT_HEX,
} from '@/lib/mariachi/mariachiLandingCatalog';
import { MARIACHI_FAQS } from '@/lib/constants/mariachi-faqs';
import { MARIACHI_FORMATS } from '@/lib/mariachi/mariachiDispatchCore';
import MariachiLandingCta from '@/components/mariachi/MariachiLandingCta';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com';

interface LandingPageProps {
    params: Promise<{ landing: string }>;
}

export function generateStaticParams(): { landing: string }[] {
    return MARIACHI_LANDINGS.map((l) => ({ landing: l.slug }));
}

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
    const { landing } = await params;
    const def = MARIACHI_LANDING_BY_SLUG.get(landing);
    if (!def) {
        return { title: 'Mariachis en España | Productora EAR' };
    }

    const canonical = `${BASE_URL}/mariachis/${def.slug}`;

    return {
        title: def.metaTitle,
        description: def.metaDescription,
        alternates: { canonical },
        openGraph: {
            type: 'website',
            locale: 'es_ES',
            url: canonical,
            siteName: 'Productora EAR',
            title: def.metaTitle,
            description: def.metaDescription,
        },
        twitter: {
            card: 'summary_large_image',
            title: def.metaTitle,
            description: def.metaDescription,
        },
    };
}

export default async function MariachiLandingPage({ params }: LandingPageProps) {
    const { landing } = await params;
    const def = MARIACHI_LANDING_BY_SLUG.get(landing);

    if (!def) {
        notFound();
    }

    const accent = MARIACHI_ACCENT_HEX[def.accent];
    const format = MARIACHI_FORMATS.find((f) => f.id === def.recommendedFormatId) ?? MARIACHI_FORMATS[0];
    const faqs = def.faqIndexes.map((i) => MARIACHI_FAQS[i]).filter(Boolean);
    const isB2g = def.slug === 'fiestas-patronales';

    // JSON-LD sin datos falsos: sin aggregateRating, sin reseñas inventadas.
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Service',
                '@id': `${BASE_URL}/mariachis/${def.slug}/#service`,
                name: def.metaTitle,
                description: def.metaDescription,
                url: `${BASE_URL}/mariachis/${def.slug}`,
                serviceType: 'Mariachi en directo',
                areaServed: { '@type': 'Country', name: 'ES' },
                provider: {
                    '@type': 'Organization',
                    '@id': `${BASE_URL}/#organization`,
                    name: 'Productora EAR OS',
                    url: BASE_URL,
                    telephone: '+34693693048',
                },
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'EUR',
                    price: String(format.basePrice),
                    description: `${format.name} — tarifa base sin logística variable (SSOT). Depósito 100 € deducible.`,
                    availability: 'https://schema.org/InStock',
                },
            },
            {
                '@type': 'MusicGroup',
                '@id': `${BASE_URL}/mariachis/${def.slug}/#mariachi-imperial`,
                name: 'Mariachi Imperial de Gala — Edwin Agudelo',
                genre: ['Mariachi', 'Ranchera', 'Bolero Ranchero', 'Música Tradicional Mexicana'],
                founder: { '@type': 'Person', name: 'Edwin Agudelo' },
            },
        ],
    };

    return (
        <main className="w-full overflow-x-hidden bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Barra de navegación contextual */}
            <div className="w-full bg-[#07070b]/90 border-b border-white/10 backdrop-blur-md sticky top-0 z-40 py-2.5 px-6">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <Link
                        href="/mariachis"
                        className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                    >
                        <ChevronRight size={12} className="rotate-180" />
                        Volver a Mariachis
                    </Link>
                    <span className="inline-flex items-center gap-1.5 text-white/60">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Centralita verificada 24/7
                    </span>
                    <a
                        href="https://wa.me/34693693048"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all"
                    >
                        <MessageCircle size={12} />
                        +34 693 693 048
                    </a>
                </div>
            </div>

            {/* HERO */}
            <section className="relative px-6 pt-16 pb-16 md:pt-24 md:pb-20 border-b border-white/5 overflow-hidden">
                <div
                    className="absolute top-0 right-0 h-[560px] w-[560px] translate-x-1/3 -translate-y-1/3 rounded-full blur-[160px] pointer-events-none"
                    style={{ backgroundColor: `${accent}1a` }}
                />
                <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-mono uppercase tracking-[0.25em]"
                        style={{ backgroundColor: `${accent}1a`, borderColor: `${accent}4d`, color: accent }}
                    >
                        <Sparkles size={13} />
                        {def.navLabel}
                    </div>

                    <h1 className="font-syne text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.95]">
                        {def.h1}
                    </h1>

                    <p className="max-w-2xl text-sm sm:text-base md:text-lg text-white/75 font-sans leading-relaxed">
                        {def.heroSubheadline}
                    </p>

                    <div className="pt-4">
                        <MariachiLandingCta
                            formatId={def.recommendedFormatId}
                            finalCta={def.finalCta}
                            isB2g={isB2g}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-mono text-white/55">
                        <span className="flex items-center gap-2">
                            <ShieldCheck size={15} style={{ color: accent }} />
                            Depósito 100 € deducible (Stripe)
                        </span>
                        <span className="flex items-center gap-2">
                            <Check size={15} className="text-emerald-400" />
                            Precio cerrado y transparente
                        </span>
                    </div>
                </div>
            </section>

            {/* RESULTADO SOÑADO + MIEDOS DESACTIVADOS */}
            <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                    className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-8 space-y-4"
                >
                    <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest" style={{ color: accent }}>
                        <Target size={14} />
                        El resultado que buscas
                    </div>
                    <h2 className="text-2xl font-bold font-syne text-white">{def.dreamOutcome}</h2>
                    <ul className="space-y-3 pt-2">
                        {def.outcomes.map((outcome, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-sm text-white/75 font-sans">
                                <Check size={16} style={{ color: accent }} className="shrink-0 mt-0.5" />
                                <span>{outcome}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-8 space-y-4">
                    <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF2B44]">
                        <ShieldAlert size={14} />
                        Lo que desactivamos
                    </div>
                    <h3 className="text-lg font-bold font-syne text-white">Sin fricciones, sin sorpresas desagradables</h3>
                    <ul className="space-y-3 pt-2">
                        {def.fears.map((fear, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-sm text-white/70 font-sans">
                                <span className="text-[#FF2B44] shrink-0 font-mono">✕</span>
                                <span>{fear}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* PROCESO EN 3 PASOS */}
            <section className="max-w-5xl mx-auto px-6 py-12 border-t border-white/5">
                <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono uppercase tracking-[0.25em]" style={{ backgroundColor: `${accent}1a`, borderColor: `${accent}4d`, color: accent }}>
                        <Sparkles size={13} />
                        CONTRATACIÓN EN 3 PASOS
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black font-syne uppercase text-white">Cómo funciona</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                    {def.processSteps.map((step, idx) => (
                        <div key={idx} className="p-7 rounded-3xl bg-[#060609] border border-white/10 space-y-3 relative">
                            <span className="text-5xl font-black font-mono" style={{ color: `${accent}4d` }}>
                                {String(idx + 1).padStart(2, '0')}
                            </span>
                            <h3 className="text-xl font-bold font-syne text-white">{step.title}</h3>
                            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{step.detail}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FORMACIÓN RECOMENDADA (SSOT) */}
            <section className="max-w-5xl mx-auto px-6 py-12 border-t border-white/5">
                <div className="rounded-3xl bg-gradient-to-r from-[#0d0d15] via-[#09090e] to-[#0d0d15] border border-white/10 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest" style={{ color: accent }}>
                            <ShieldCheck size={14} />
                            Formación recomendada
                        </div>
                        <h3 className="text-2xl font-bold font-syne text-white">{format.name}</h3>
                        <p className="text-sm text-white/60 font-sans max-w-xl">{format.description}</p>
                    </div>
                    <div className="text-right space-y-1 shrink-0">
                        <div className="text-4xl font-black font-mono text-white">{format.basePrice} €</div>
                        <div className="text-xs font-mono text-white/40">tarifa base SSOT · {format.members} músicos</div>
                        <div className="text-xs font-mono" style={{ color: accent }}>Depósito 100 € · 100% deducible</div>
                    </div>
                </div>
            </section>

            {/* FAQ ESPECÍFICO */}
            {faqs.length > 0 && (
                <section className="max-w-5xl mx-auto px-6 py-12 border-t border-white/5">
                    <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
                        <h2 className="text-3xl sm:text-4xl font-black font-syne uppercase text-white">Preguntas frecuentes</h2>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="rounded-2xl bg-[#060609] border border-white/10 p-6 space-y-2">
                                <h3 className="text-base font-bold font-syne text-white">{faq.question}</h3>
                                <p className="text-sm text-white/65 font-sans leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* CIERRE DE CONVERSIÓN */}
            <section className="border-t border-white/10 py-20 bg-gradient-to-b from-[#050508] to-[#020204] text-center px-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h2 className="text-3xl sm:text-5xl font-black font-syne uppercase text-white tracking-tight">
                        {def.dreamOutcome}
                    </h2>
                    <div className="pt-4 flex justify-center">
                        <MariachiLandingCta
                            formatId={def.recommendedFormatId}
                            finalCta={def.finalCta}
                            isB2g={isB2g}
                        />
                    </div>
                    <Link
                        href="/mariachis"
                        className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white transition-colors"
                    >
                        Explorar todos los formatos de mariachi
                        <ArrowRight size={13} />
                    </Link>
                </div>
            </section>
        </main>
    );
}