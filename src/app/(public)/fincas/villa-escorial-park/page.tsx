import type { Metadata } from 'next';
import VillaEscorialParkSClassExperience from '@/components/fincas/VillaEscorialParkSClassExperience';
import {
    TARIFA_BASE_SOLISTA_EUR,
    DEPOSITO_STRIPE_EUR,
    CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
    title: 'Villa Escorial Park · Mansión & Finca de Lujo S-Class | EAR OS',
    description:
        'Experiencia de reserva S-Class para Villa Escorial Park (San Lorenzo de El Escorial, Madrid). Tarifa Solista 350 €, depósito Price-Lock 100 €, rider acústico Ley 37/2003 y liquidación de alianzas en 3 días.',
};

const villaEscorialParkJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Villa Escorial Park · Mansión & Finca de Lujo S-Class',
    description:
        'Experiencia de reserva S-Class para Villa Escorial Park (San Lorenzo de El Escorial, Madrid). Rider acústico Ley 37/2003 y liquidación de alianzas en 3 días.',
    brand: {
        '@type': 'Brand',
        name: 'EAR OS',
    },
    offers: {
        '@type': 'Offer',
        url: 'https://ear-os.com/reservar/solista',
        priceCurrency: 'EUR',
        price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2026-12-31',
        seller: {
            '@type': 'Organization',
            name: 'EAR OS',
            telephone: CENTRALITA_EAR_OS,
        },
    },
};

export default function VillaEscorialParkPage() {
    return (
        <div className="w-full min-h-screen bg-[#030305] overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(villaEscorialParkJsonLd) }}
            />
            <VillaEscorialParkSClassExperience initialTelemetry={null} />
        </div>
    );
}