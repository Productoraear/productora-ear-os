import React from 'react';
import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';
import { SERVICIOS } from '@/lib/constants/seo-data';
export async function generateMetadata({ params }) {
    const { nicho } = await params;
    const formattedNicho = nicho.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
        title: `${formattedNicho} | S-Class Infrastructure EAR GOLD`,
        description: `Descubre la ingeniería y arquitectura de ${formattedNicho}. Protocolos de dominancia operativa para eventos y talento de alto impacto.`,
        keywords: [nicho, 'productora ear', 'ingeniería de eventos', 'infraestructura B2G'],
    };
}
export default async function GenericServicePage({ params }) {
    const { nicho } = await params;
    const service = SERVICIOS.find(s => s.slug === nicho.toLowerCase());
    const title = service ? service.nombre : nicho.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const description = service
        ? service.descripcion
        : `Infraestructura técnica de élite para ${nicho.replace(/-/g, ' ')}. Desplegamos sistemas de impacto diseñados para la dominancia operativa.`;
    return (<BespokeTemplate title={title} description={description} location="España" serviceId={nicho} keywords={[nicho, 'S-Class', 'Aura Onyx']}/>);
}
export async function generateStaticParams() {
    return SERVICIOS.map(s => ({ nicho: s.slug }));
}
