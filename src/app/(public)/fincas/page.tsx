import type { Metadata } from 'next';
import FincasB2BPortal from '@/components/fincas/FincasB2BPortal';
import {
    TARIFA_BASE_SOLISTA_EUR,
    DEPOSITO_STRIPE_EUR,
    CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
    title: 'Fincas y Venues B2B · Red Homologada S-Class | EAR OS',
    description:
        'Directorio de fincas homologadas para eventos con garantía acústica Ley 37/2003, depósito Price-Lock ' +
        `${DEPOSITO_STRIPE_EUR} € y artistas verificados desde ${TARIFA_BASE_SOLISTA_EUR} € (Tarifa Solista SSOT).`,
};

const OFFER_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Reserva de Artista Verificado en Finca Homologada · EAR OS',
    description:
        'Artista verificado con garantía acústica Ley 37/2003 para fincas y venues homologados. ' +
        `Tarifa Solista oficial ${TARIFA_BASE_SOLISTA_EUR} € con depósito Price-Lock de ${DEPOSITO_STRIPE_EUR} €.`,
    offers: {
        '@type': 'Offer',
        price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        category: 'Event',
        url: '/reservar/solista',
    },
};

export default function FincasB2BPage() {
    return (
        <div className="w-full min-h-screen bg-[#030305] overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(OFFER_SCHEMA) }}
            />
            <section className="w-full px-4 sm:px-6 lg:px-8 py-10">
                <div className="mx-auto max-w-6xl rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 sm:p-10 transition-all duration-300 hover:border-white/20 hover:bg-[#09090d]">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                        Red Homologada S-Class
                    </p>
                    <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
                        Fincas y Venues B2B
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/70">
                        Directorio de fincas homologadas con garantía acústica Ley 37/2003.
                        Artistas verificados con precio SSOT transparente.
                    </p>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 transition-all duration-300 hover:border-white/20 hover:bg-[#09090d]">
                            <p className="text-xs uppercase tracking-widest text-white/50">
                                Tarifa Solista
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-white">
                                {TARIFA_BASE_SOLISTA_EUR} €
                            </p>
                            <p className="mt-1 text-xs text-white/60">
                                Precio oficial SSOT · sin sorpresas
                            </p>
                        </div>
                        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 transition-all duration-300 hover:border-white/20 hover:bg-[#09090d]">
                            <p className="text-xs uppercase tracking-widest text-white/50">
                                Depósito Price-Lock
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-white">
                                {DEPOSITO_STRIPE_EUR} €
                            </p>
                            <p className="mt-1 text-xs text-white/60">
                                Bloqueo de fecha y precio garantizado
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <a
                            href="/reservar/solista"
                            className="inline-flex items-center justify-center rounded-3xl bg-white text-black px-6 py-3 text-sm font-semibold transition-all duration-300 hover:bg-white/90 hover:scale-[1.02]"
                        >
                            Reservar Solista · {TARIFA_BASE_SOLISTA_EUR} €
                        </a>
                        <a
                            href="/alquiler"
                            className="inline-flex items-center justify-center rounded-3xl bg-[#09090d]/80 border border-white/10 text-white px-6 py-3 text-sm font-semibold transition-all duration-300 hover:border-white/30 hover:bg-[#09090d]"
                        >
                            Ver Alquiler de Equipo
                        </a>
                        <a
                            href={`https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-3xl bg-[#09090d]/80 border border-white/10 text-white px-6 py-3 text-sm font-semibold transition-all duration-300 hover:border-white/30 hover:bg-[#09090d]"
                        >
                            WhatsApp · {CENTRALITA_EAR_OS}
                        </a>
                    </div>
                </div>
            </section>
            <FincasB2BPortal />
        </div>
    );
}