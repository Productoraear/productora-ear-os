import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SOS Rescue · Flota Táctica de Refuerzo para Eventos en Vivo | Productora EAR',
    description:
        'Refuerzo inmediato de sonido, iluminación y escenario ante caídas de etapa o crecimiento inesperado de PAX. Cubicaje calibrado, ETA por distancia haversine y coste logístico desde Méntrida (a partir del km 50).',
    keywords: [
        'refuerzo sonido eventos',
        'sos técnico eventos en vivo',
        'flota táctica backline',
        'alquiler urgente equipos sonido',
        'ETA logística eventos',
        'cubicaje flota producción',
    ],
    openGraph: {
        title: 'SOS Rescue · Flota Táctica de Refuerzo para Eventos en Vivo | Productora EAR',
        description:
            'Calcula el despacho de la flota táctica en minutos: refuerzo de sonido, iluminación y escenario con ETA, cubicaje y coste logístico calibrado por incidente.',
        type: 'website',
        locale: 'es_ES',
        siteName: 'Productora EAR',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SOS Rescue · Flota Táctica de Refuerzo para Eventos en Vivo | Productora EAR',
        description:
            'Tu evento no se para: refuerzo inmediato de sonido y escenario con ETA en minutos desde Méntrida.',
    },
};

export default function SosRescueLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}