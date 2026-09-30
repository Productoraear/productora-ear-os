import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Catering de Brasas para Fincas y Bodas | Productora EAR',
    description:
        'Showcooking de fuego vivo, asados a la cruz y ahumados low & slow para bodas y fincas. Presupuesto en vivo con depósito Stripe de 100 €.',
    openGraph: {
        title: 'Catering de Brasas para Fincas y Bodas | Productora EAR',
        description:
            'Showcooking de fuego vivo, asados a la cruz y ahumados low & slow para bodas y fincas. Presupuesto en vivo con depósito Stripe de 100 €.',
        type: 'website',
        locale: 'es_ES',
        siteName: 'Productora EAR',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Catering de Brasas para Fincas y Bodas | Productora EAR',
        description:
            'Showcooking de fuego vivo, asados a la cruz y ahumados low & slow para bodas y fincas.',
    },
};

export default function CateringBrasasLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}