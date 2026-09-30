import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contratación de Fiestas Patronales para Ayuntamientos (Art. 118 LCSP) | Productora EAR',
    description:
        'Pliegos técnicos homologados, presupuesto menor preventivo < 14.250 € (Art. 118 LCSP), sonorización calibrada 12 W/pax, RC de 1.000.000 € y facturación electrónica FacturaE (DIR3) para ayuntamientos, diputaciones y fundaciones.',
    keywords: [
        'contratación menor ayuntamientos',
        'fiestas patronales Art. 118 LCSP',
        'concejalía de festejos',
        'pliegos técnicos orquestas',
        'FacturaE DIR3',
        'sonorización 12 W por persona',
        'contratos menores municipales',
        'espectáculos Día del Mayor',
    ],
    openGraph: {
        title: 'Contratación de Fiestas Patronales para Ayuntamientos (Art. 118 LCSP) | Productora EAR',
        description:
            'Motor de despacho inmediato de memorias Art. 118 LCSP, presupuesto preventivo al 95% (14.250 €), FacturaE y pliegos técnicos homologados para Administraciones Públicas.',
        type: 'website',
        locale: 'es_ES',
        siteName: 'Productora EAR',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contratación de Fiestas Patronales para Ayuntamientos (Art. 118 LCSP) | Productora EAR',
        description:
            'Memorias Art. 118 LCSP en 1 clic, presupuesto preventivo < 14.250 € y facturación FacturaE (DIR3) para ayuntamientos y fundaciones.',
    },
    alternates: {
        canonical: 'https://productoraear.com/ayuntamientos',
    },
};

export default function AyuntamientosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}