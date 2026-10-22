import type { Metadata } from 'next';
import Link from 'next/link';
import { Flame, Shield, Phone, Calendar, Star } from 'lucide-react';
import { CENTRALITA_EAR_OS, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
    title: 'Catering de Brasas S-Class | Ritual Ibérico en Vivo · Productora EAR',
    description:
        'Showcooking de brasas en vivo para bodas y fincas de gala en Madrid y Toledo. Carnes maduradas, carbón de encina y fianza protegida con Split 80/10/10.',
    alternates: {
        canonical: 'https://productoraear.com/catering-de-brasas',
    },
    openGraph: {
        title: 'Catering de Brasas S-Class | Ritual Ibérico en Vivo',
        description: 'Showcooking gastronómico de brasas en vivo con cortes madurados a la brasa de encina.',
        url: 'https://productoraear.com/catering-de-brasas',
        siteName: 'Productora EAR',
        locale: 'es_ES',
        type: 'website',
    },
};

export default function CateringBrasasPage(): React.JSX.Element {
    const whatsappUrl = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
        'Hola Productora EAR, deseo cotizar el Catering de Brasas S-Class para mi evento.'
    )}`;

    return (
        <main className="min-h-screen bg-[#030305] text-white pt-28 pb-20 px-4 md:px-8 selection:bg-[#ecb613] selection:text-black">
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="space-y-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
                        <Flame className="w-4 h-4" />
                        <span>RITUAL GASTRONÓMICO EN VIVO · MADERA DE ENCINA</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-sans">
                        Catering de Brasas S-Class
                    </h1>
                    <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                        Showcooking de fuego real para fincas y bodas exclusivas. Cortes madurados, ahumados artesanales y mise en place impecable con fianza protegida.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090d]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Flame className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Fuego de Encina en Vivo</h2>
                        <p className="text-xs text-gray-400">
                            Estructuras de asado a la cruz, parrillas argentinas y hornos de leña móviles integrados en la arquitectura de tu finca.
                        </p>
                    </div>

                    <div className="bg-[#09090d]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Garantía EAR OS</h2>
                        <p className="text-xs text-gray-400">
                            Contrato inteligente vinculante (Art. 1255 CC), fianza deducible de {DEPOSITO_STRIPE_EUR} € y póliza de seguro de responsabilidad civil incluida.
                        </p>
                    </div>

                    <div className="bg-[#09090d]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                            <Star className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Corte y Maridaje de Gala</h2>
                        <p className="text-xs text-gray-400">
                            Chuleteros seleccionados con maduración de 45 a 60 días, pescados salvajes a la brasa y guarniciones km 0.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-amber-950/30 to-[#09090d] border border-amber-500/30 rounded-3xl p-8 md:p-12 text-center space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                        ¿Quieres el show de fuego en tu boda o evento corporativo?
                    </h2>
                    <p className="text-gray-300 text-sm max-w-xl mx-auto">
                        Consulta disponibilidad para tu fecha en Madrid, Toledo o fincas de la red nacional.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 rounded-xl bg-[#25D366] text-black font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
                        >
                            <Phone className="w-4 h-4" />
                            Consultar Vía WhatsApp
                        </a>
                        <Link
                            href="/calculadora"
                            className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/15 transition-all border border-white/10 flex items-center gap-2"
                        >
                            <Calendar className="w-4 h-4" />
                            Calcular Presupuesto Online
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
