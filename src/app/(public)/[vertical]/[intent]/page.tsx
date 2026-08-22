import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SemanticBlockRenderer from '@/components/programmatic/SemanticBlockRenderer';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SITEMAP SEMÁNTICO: Verticales y Combinaciones de Intención
// Cada nodo genera una URL única e indexable por Google.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const VALID_VERTICALS = ['bodas', 'corporativo', 'quinceaneras', 'vimume', 'ayuntamientos', 'cumpleanos', 'serenatas'] as const;

interface SEONode {
  vertical: string;
  intent: string;
  title: string;
  description: string;
}

const SEO_NODES: SEONode[] = [
  // Bodas
  { vertical: 'bodas', intent: 'madrid-precios-musica-directo', title: 'Música en Directo para Bodas en Madrid | Precios 2026', description: 'Sonorización S-Class para bodas en Madrid desde 350€. Line Array Bose F1, microfonía Shure Axient y ensamble mariachi con Edwin Agudelo.' },
  { vertical: 'bodas', intent: 'fincas-toledo-sonorizacion-gala', title: 'Sonorización para Fincas en Toledo | Bodas de Gala', description: 'Cobertura acústica 12 W/pax para fincas rurales en Toledo. Desplazamiento incluido en 50km. Rider Bose F1 + Behringer XR18.' },
  { vertical: 'bodas', intent: 'serenata-sorpresa-pedida-mano', title: 'Serenata Sorpresa para Pedida de Mano | Edwin Agudelo', description: 'Serenata de gala con llegada sincronizada por GPS y repertorio a la carta. Desde 350€ con equipo autónomo inalámbrico.' },
  { vertical: 'bodas', intent: 'mariachi-bodas-precios-espana', title: 'Mariachi para Bodas en España | Precios y Repertorio', description: 'Grupo mariachi profesional para bodas. Solista desde 350€, dúo 550€, ensamble completo desde 1.800€. Cobertura nacional.' },
  // Corporativo
  { vertical: 'corporativo', intent: 'eventos-empresa-madrid-sonido-dj', title: 'Sonido Profesional para Eventos Corporativos Madrid', description: 'Sonorización corporativa S-Class con SLA de cero fallos. Factura NIF inmediata, streaming redundante y técnico FOH dedicado.' },
  { vertical: 'corporativo', intent: 'presentacion-producto-audiovisual', title: 'Producción Audiovisual para Lanzamientos de Producto', description: 'Sincronización Timecode SMPTE de sonido, iluminación y visuales. Array lineal + robótica Beam/Wash desde 1.800€.' },
  { vertical: 'corporativo', intent: 'cena-gala-empresarial-madrid', title: 'Música para Cenas de Gala Empresarial | Madrid', description: 'Ambientación musical y sonorización de alta fidelidad para cenas de gala. Microfonía DPA y PA L-Acoustics. Presupuesto cerrado.' },
  // Quinceañeras y Cumpleaños
  { vertical: 'quinceaneras', intent: 'fiestas-15-anos-dj-iluminacion', title: 'DJ e Iluminación para Fiestas de 15 Años', description: 'Set híbrido: vals mariachi + DJ urbano con cabina LED DMX. PA 2.000W con subwoofers activos desde 450€.' },
  { vertical: 'cumpleanos', intent: 'mariachi-sorpresa-domicilio-madrid', title: 'Mariachi Sorpresa a Domicilio en Madrid', description: 'Serenata sorpresa con Edwin Agudelo. Llegada coordinada, repertorio personalizado y equipo portátil HiFi. Desde 350€.' },
  // VIMUME / Silver Economy
  { vertical: 'vimume', intent: 'musicoterapia-centros-mayores-madrid', title: 'Musicoterapia para Centros de Mayores | VIMUME Madrid', description: 'Programa clínico de memoria evocativa con frecuencias armónicas <75 dB. Validado en 5 centros. Desde 290€/sesión.' },
  { vertical: 'vimume', intent: 'envejecimiento-activo-musicoterapia', title: 'Envejecimiento Activo con Musicoterapia | VIMUME', description: 'Conciertos interactivos intergeneracionales y estimulación neurocognitiva para pacientes de Alzheimer y tercera edad.' },
  // Ayuntamientos B2G
  { vertical: 'ayuntamientos', intent: 'conciertos-fiestas-patronales-lcsp', title: 'Conciertos para Fiestas Patronales | LCSP', description: 'Presupuesto cerrado bajo contrato menor LCSP (<15.000€). Memoria técnica, seguro RC 600.000€ y PA 12.000W.' },
  { vertical: 'ayuntamientos', intent: 'sonorizacion-actos-institucionales', title: 'Sonorización para Actos Institucionales | Ayuntamientos', description: 'PA profesional para plazas y auditorios municipales. Certificado de solidez, pliego técnico y logística integral.' },
];

export function generateStaticParams() {
  return SEO_NODES.map((node) => ({
    vertical: node.vertical,
    intent: node.intent,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string; intent: string }>;
}): Promise<Metadata> {
  const { vertical, intent } = await params;
  const node = SEO_NODES.find((n) => n.vertical === vertical && n.intent === intent);

  if (!node) {
    return {
      title: 'Servicio Musical S-Class | Productora EAR',
      description: 'Sonorización profesional y artistas de élite para tu evento.',
    };
  }

  return {
    title: node.title,
    description: node.description,
    openGraph: {
      title: node.title,
      description: node.description,
      type: 'website',
      url: `https://www.productoraear.com/${node.vertical}/${node.intent}`,
    },
  };
}

export default async function ProgrammaticLandingPage({
  params,
}: {
  params: Promise<{ vertical: string; intent: string }>;
}) {
  const { vertical, intent } = await params;

  // Gate: Solo permitir verticales válidas
  if (!VALID_VERTICALS.includes(vertical as any)) {
    notFound();
  }

  return <SemanticBlockRenderer vertical={vertical} intent={intent} />;
}
