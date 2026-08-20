import os

target_path = r"src\app\servicios\[categoria]\[provincia]\page.tsx"

content = """import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';
import { generateSemanticPageData, resolveGeoLocation } from '@/lib/seo/semantic-engine';
import { notFound } from 'next/navigation';

interface Props {
params: Promise<{
categoria: string;
provincia: string;
}>;
}

export async function generateMetadata({ params }: Props) {
const { categoria, provincia } = await params;
const geo = resolveGeoLocation(provincia);
const locationName = geo ? geo.name : provincia;
const catFormatted = categoria.replace(/-/g, ' ');

return {
title: `${catFormatted.toUpperCase()} en ${locationName} | Producción S-Class & Reserva Homologada`,
description: `Reserva ${catFormatted} en ${locationName} con infraestructura técnica directa, músicos verificados y garantía de Productora EAR.`,
};
}

export default async function ServicioProvinciaPage({ params }: Props) {
const { categoria, provincia } = await params;
const geo = resolveGeoLocation(provincia);

if (!geo) {
notFound();
}

const categoryName = categoria.replace(/-/g, ' ');

return (

  

);
}
"""

with open(target_path, "w", encoding="utf-8") as f:
f.write(content)

print("✅ Código corregido con await params.")
