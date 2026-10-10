import type { Metadata } from 'next';
import Link from 'next/link';
import { ProviderNeuralMatcherView } from '@/components/providers/ProviderNeuralMatcherView';
import { ShieldCheck, SlidersHorizontal, Sparkles, Building2, ArrowRight, MessageCircle } from 'lucide-react';
import {
    TARIFA_BASE_SOLISTA_EUR,
    DEPOSITO_STRIPE_EUR,
    CENTRALITA_EAR_OS
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
    title: 'Calibrador Neural 200D Proveedores B2B/B2G · Productora EAR',
    description:
        'Motor de matching bilateral 200 dimensiones entre parejas/instituciones y los mejores proveedores de catering, fotografía, vídeo, sonido B2G y carpas. Price-Lock 100€ Stripe y Split Soberano 80/10/10.',
    alternates: {
        canonical: 'https://productoraear.com/proveedores-servicios'
    },
    openGraph: {
        title: 'Calibrador Neural 200D Proveedores B2B/B2G · Productora EAR',
        description:
            'Match perfecto sin pérdidas de tiempo: Catering, Foto/Vídeo, Sonido y Carpas homologadas con fianza protegida.',
        url: 'https://productoraear.com/proveedores-servicios',
        siteName: 'Productora EAR',
        locale: 'es_ES',
        type: 'website'
    }
};

const whatsappHref = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Hola EAR OS, quiero activar el Calibrador Neural 200D para proveedores B2B/B2G.'
)}`;

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Calibrador Neural 200D Proveedores B2B/B2G · Productora EAR',
    description:
        'Motor de matching bilateral 200 dimensiones entre parejas/instituciones y proveedores homologados de catering, fotografía, vídeo, sonido B2G y carpas. Price-Lock Stripe y Split Soberano 80/10/10.',
    brand: {
        '@type': 'Brand',
        name: 'Productora EAR'
    },
    offers: {
        '@type': 'Offer',
        url: 'https://productoraear.com/reservar/solista',
        priceCurrency: 'EUR',
        price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2026-12-31',
        eligibleQuantity: {
            '@type': 'QuantitativeValue',
            value: 1,
            unitCode: 'C62'
        }
    }
};

export default function ProveedoresServiciosPage() {
    return (
        <main className="min-h-screen w-full overflow-x-hidden bg-[#030305] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative selection:bg-[#ecb613] selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Fondo de Malla S-Class */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#ecb613]/10 to-transparent blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-10 relative z-10">
                {/* Cabecera Hero */}
                <header className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#ecb613] text-xs font-mono tracking-wider uppercase">
                        <Sparkles size={13} />
                        <span>Arquitectura Bilateral 200D · EAR OS</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black font-syne tracking-tight text-white leading-tight">
                        Calibrador Neural de{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-[#ecb613]">
                            Proveedores B2B & B2G
                        </span>
                    </h1>

                    <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
                        Elimina reuniones vacías y discrepancias de presupuesto. Cruza tus 50 requisitos técnicos y contractuales
                        con las 50 especificaciones del proveedor homologado en catering, audiovisuales, carpas y transporte.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-400 pt-2">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                            <ShieldCheck size={14} /> Price-Lock {DEPOSITO_STRIPE_EUR} € Stripe
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-[#ecb613]">Split Soberano 80/10/10</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-cyan-400">Art. 118 LCSP B2G Ready</span>
                    </div>
                </header>

                {/* Bloque Precio Transparente SSOT */}
                <section
                    aria-label="Tarifa oficial"
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto"
                >
                    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 transition-all duration-300 hover:border-[#ecb613]/40 hover:bg-[#09090d] hover:-translate-y-0.5">
                        <div className="flex items-center gap-2 text-[#ecb613] text-xs font-mono uppercase tracking-wider">
                            <SlidersHorizontal size={14} />
                            <span>Tarifa Solista</span>
                        </div>
                        <p className="mt-3 text-3xl font-black font-syne text-white">
                            {TARIFA_BASE_SOLISTA_EUR} €
                        </p>
                        <p className="mt-1 text-xs text-zinc-400 font-sans">
                            Activación completa del Calibrador Neural 200D para un proyecto.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 transition-all duration-300 hover:border-emerald-400/40 hover:bg-[#09090d] hover:-translate-y-0.5">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider">
                            <ShieldCheck size={14} />
                            <span>Price-Lock Stripe</span>
                        </div>
                        <p className="mt-3 text-3xl font-black font-syne text-white">
                            {DEPOSITO_STRIPE_EUR} €
                        </p>
                        <p className="mt-1 text-xs text-zinc-400 font-sans">
                            Fianza protegida que se descuenta del total al confirmar match.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 transition-all duration-300 hover:border-cyan-400/40 hover:bg-[#09090d] hover:-translate-y-0.5">
                        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider">
                            <Building2 size={14} />
                            <span>B2G / Institucional</span>
                        </div>
                        <p className="mt-3 text-3xl font-black font-syne text-white">
                            {TARIFA_BASE_SOLISTA_EUR} €
                        </p>
                        <p className="mt-1 text-xs text-zinc-400 font-sans">
                            Base Art. 118 LCSP. Packs de inventario escalables bajo solicitud contractual.
                        </p>
                    </div>
                </section>

                {/* Matcher Interactivo */}
                <section aria-label="Calibrador interactivo">
                    <ProviderNeuralMatcherView />
                </section>

                {/* CTA de Cierre Real */}
                <section
                    aria-label="Cierre de conversión"
                    className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 sm:p-10 text-center space-y-6 transition-all duration-300 hover:border-[#ecb613]/30"
                >
                    <h2 className="text-2xl sm:text-3xl font-black font-syne text-white">
                        Activa tu match con{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-[#ecb613]">
                            fianza protegida
                        </span>
                    </h2>
                    <p className="text-sm text-zinc-400 font-sans max-w-2xl mx-auto">
                        Reserva la Tarifa Solista por {TARIFA_BASE_SOLISTA_EUR} € con Price-Lock de {DEPOSITO_STRIPE_EUR} €
                        vía Stripe, o contacta directo con la centralita EAR OS para packs de inventario B2B/B2G.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <Link
                            href="/reservar/solista"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#ecb613] text-black font-bold text-sm tracking-wide transition-all duration-300 hover:bg-amber-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Reservar Solista · {TARIFA_BASE_SOLISTA_EUR} €
                            <ArrowRight size={16} />
                        </Link>

                        <Link
                            href="/alquiler"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm tracking-wide transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Ver packs de inventario
                            <ArrowRight size={16} />
                        </Link>

                        <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 font-bold text-sm tracking-wide transition-all duration-300 hover:bg-emerald-500/20 hover:border-emerald-400/50 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <MessageCircle size={16} />
                            WhatsApp {CENTRALITA_EAR_OS}
                        </a>
                    </div>
                </section>
            </div>
        </main>
    );
}