import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reservar Solista — Edwin Agudelo | Productora EAR',
    description:
        'Solista de gala para bodas y cócteles. Caché 350 € con depósito de 100 € en Stripe (Price-Lock). Acústica 70-80 dBA y relevo inmediato < 90 min.',
    openGraph: {
        title: 'Reservar Solista — Edwin Agudelo | Productora EAR',
        description:
            'Solista de gala para bodas y cócteles. Caché 350 € con depósito de 100 € en Stripe (Price-Lock).',
        type: 'website',
        locale: 'es_ES',
        siteName: 'Productora EAR',
        images: [
            {
                url: '/images/brand/ear_logo_official_diamond.png',
                alt: 'Productora EAR — Edwin Agudelo Solista',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Reservar Solista — Edwin Agudelo | Productora EAR',
        description:
            'Solista de gala para bodas y cócteles. Caché 350 € con depósito de 100 € en Stripe (Price-Lock).',
        images: ['/images/brand/ear_logo_official_diamond.png'],
    },
};

export default function SolistaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}