import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Simulación de Mariachis en Vivo | Productora EAR',
    description:
        'Simulador de alta demanda de mariachis con flota en tiempo real. Caché desde 350 € con depósito de 100 € en Stripe (Price-Lock).',
    openGraph: {
        title: 'Simulación de Mariachis en Vivo | Productora EAR',
        description:
            'Simulador de alta demanda de mariachis con flota en tiempo real. Caché desde 350 € con depósito de 100 € en Stripe (Price-Lock).',
        type: 'website',
        locale: 'es_ES',
        siteName: 'Productora EAR',
        images: [
            {
                url: '/images/brand/ear_logo_official_diamond.png',
                alt: 'Productora EAR — Mariachis en Vivo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Simulación de Mariachis en Vivo | Productora EAR',
        description:
            'Simulador de alta demanda de mariachis con flota en tiempo real. Caché desde 350 € con depósito de 100 € en Stripe (Price-Lock).',
        images: ['/images/brand/ear_logo_official_diamond.png'],
    },
};

export default function SimulacionMariachisLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}