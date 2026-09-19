import type { Metadata } from 'next';
import { ProviderNeuralMatcherView } from '@/components/providers/ProviderNeuralMatcherView';
import { ShieldCheck, SlidersHorizontal, Sparkles, Building2 } from 'lucide-react';

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

export default function ProveedoresServiciosPage() {
    return (
        <main className="min-h-screen bg-[#030305] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden selection:bg-[#ecb613] selection:text-black">
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
                            <ShieldCheck size={14} /> Price-Lock 100 € Stripe
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-[#ecb613]">Split Soberano 80/10/10</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-cyan-400">Art. 118 LCSP B2G Ready</span>
                    </div>
                </header>

                {/* Matcher Interactivo */}
                <section aria-label="Calibrador interactivo">
                    <ProviderNeuralMatcherView />
                </section>
            </div>
        </main>
    );
}
