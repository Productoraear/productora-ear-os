import type { Metadata } from 'next';
import FincasB2BPortal from '@/components/fincas/FincasB2BPortal';
import { PRICING_CATALOG } from '@/lib/constants/pricing-catalog';

export const metadata: Metadata = {
    title: 'Fincas y Venues B2B · Red Homologada S-Class | EAR OS',
    description:
        'Directorio de fincas homologadas para eventos con garantía acústica Ley 37/2003, depósito Price-Lock 100 € y artistas verificados con precio SSOT.',
};

const MARIACHI_6 = PRICING_CATALOG['grupo-6-mariachi'];

const OFFER_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: MARIACHI_6.name,
    description: MARIACHI_6.description,
    offers: {
        '@type': 'Offer',
        price: MARIACHI_6.basePrice,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        category: 'Event',
    },
};

export default function FincasB2BPage() {
    return (
        <div className="w-full min-h-screen bg-[#030305] overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(OFFER_SCHEMA) }}
            />
            <FincasB2BPortal />
        </div>
    );
}