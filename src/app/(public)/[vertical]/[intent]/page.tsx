import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SemanticBlockRenderer from '@/components/programmatic/SemanticBlockRenderer';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SITEMAP SEMÁNTICO: Verticales y Combinaciones de Intención
// Cada nodo genera una URL única e indexable por Google.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const VALID_VERTICALS = ['bodas', 'corporativo', 'quinceaneras', 'vimume', 'ayuntamientos', 'cumpleanos', 'serenatas', 'fincas'] as const;

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
  { vertical: 'bodas', intent: 'mariachi-para-bodas-en-barcelona', title: 'Mariachi para Bodas en Barcelona | Edwin Agudelo Tenor', description: 'Contratación directa de Mariachi y Tenor S-Class para bodas en Barcelona y Cataluña. Tarifa solista desde 350€, repertorio a la carta y sonido Bose F1.' },
  { vertical: 'bodas', intent: 'alquiler-equipo-sonido-mallorca', title: 'Alquiler de Equipos de Sonido en Mallorca para Bodas y Eventos', description: 'Sonorización S-Class en Mallorca e Islas Baleares. Line Array Bose F1, microfonía inalámbrica Shure y logística con técnico dedicado.' },
  { vertical: 'bodas', intent: 'equipos-de-sonido-para-eventos-galicia', title: 'Equipos de Sonido para Eventos y Bodas en Galicia | Pontevedra', description: 'Alquiler y sonorización profesional en Galicia, Pontevedra y A Coruña. Cobertura climática exterior, presión acústica 12 W/pax y música en directo.' },
  { vertical: 'bodas', intent: 'alquiler-coche-boda-chofer-madrid', title: 'Alquiler de Coche de Boda con Conductor en Madrid | Clase S & Maybach', description: 'Vehículos nupciales de lujo con chófer de gala para novios y padrinos. Champán a bordo, traslado a fincas y reportaje fotográfico desde 450€.' },
  // Corporativo
  { vertical: 'corporativo', intent: 'eventos-empresa-madrid-sonido-dj', title: 'Sonido Profesional para Eventos Corporativos Madrid', description: 'Sonorización corporativa S-Class con SLA de cero fallos. Factura NIF inmediata, streaming redundante y técnico FOH dedicado.' },
  { vertical: 'corporativo', intent: 'presentacion-producto-audiovisual', title: 'Producción Audiovisual para Lanzamientos de Producto', description: 'Sincronización Timecode SMPTE de sonido, iluminación y visuales. Array lineal + robótica Beam/Wash desde 1.800€.' },
  { vertical: 'corporativo', intent: 'cena-gala-empresarial-madrid', title: 'Música para Cenas de Gala Empresarial | Madrid', description: 'Ambientación musical y sonorización de alta fidelidad para cenas de gala. Microfonía DPA y PA L-Acoustics. Presupuesto cerrado.' },
  { vertical: 'corporativo', intent: 'alquiler-pantallas-led-madrid', title: 'Alquiler de Pantallas LED en Madrid | Gran Formato P2.6 / P3.9', description: 'Alquiler de pantallas LED gigantes de interior y exterior en Madrid. Tótems 4K, muros interactivos y procesadores Novastar con técnico in-situ.' },
  { vertical: 'corporativo', intent: 'sonorizacion-eventos-barcelona-valles', title: 'Sonorización de Eventos en Barcelona y El Vallès | 12 W/pax', description: 'Sonido profesional para eventos corporativos y bandas en Barcelona y Vallès. Garantía de presión acústica 12 W/pax, consolas digitales y cero fallos.' },
  { vertical: 'corporativo', intent: 'decoracion-navidena-centros-comerciales', title: 'Decoración Navideña e Iluminación 3D para Centros Comerciales', description: 'Proyectos llave en mano de iluminación navideña monumental. Conos gigantes hasta 10.6m, esferas 3D, tecnología Twinkly Pro y photocalls transitables.' },
  { vertical: 'corporativo', intent: 'alquiler-mercedes-clase-v-chofer-madrid', title: 'Alquiler de Mercedes Clase V con Chófer en Madrid | Quality VIP', description: 'Minivan VIP de 7 plazas para eventos corporativos, traslados de directivos e IFEMA. Wi-Fi 5G, mesas de reuniones y conductor bilingüe con protocolo.' },
  { vertical: 'corporativo', intent: 'transporte-vip-artistas-giras', title: 'Transporte VIP de Artistas, Músicos y Giras | Productora EAR', description: 'Logística integral de traslados para tenores, solistas y bandas. Furgonetas adaptadas para equipamiento técnico e instrumentos con lunas tintadas.' },
  // Quinceañeras y Cumpleaños
  { vertical: 'quinceaneras', intent: 'fiestas-15-anos-dj-iluminacion', title: 'DJ e Iluminación para Fiestas de 15 Años', description: 'Set híbrido: vals mariachi + DJ urbano con cabina LED DMX. PA 2.000W con subwoofers activos desde 450€.' },
  { vertical: 'cumpleanos', intent: 'mariachi-sorpresa-domicilio-madrid', title: 'Mariachi Sorpresa a Domicilio en Madrid', description: 'Serenata sorpresa con Edwin Agudelo. Llegada coordinada, repertorio personalizado y equipo portátil HiFi. Desde 350€.' },
  // VIMUME / Silver Economy
  { vertical: 'vimume', intent: 'musicoterapia-centros-mayores-madrid', title: 'Musicoterapia para Centros de Mayores | VIMUME Madrid', description: 'Programa clínico de memoria evocativa con frecuencias armónicas <75 dB. Validado en 5 centros. Desde 290€/sesión.' },
  { vertical: 'vimume', intent: 'envejecimiento-activo-musicoterapia', title: 'Envejecimiento Activo con Musicoterapia | VIMUME', description: 'Conciertos interactivos intergeneracionales y estimulación neurocognitiva para pacientes de Alzheimer y tercera edad.' },
  // Ayuntamientos B2G
  { vertical: 'ayuntamientos', intent: 'conciertos-fiestas-patronales-lcsp', title: 'Conciertos para Fiestas Patronales | LCSP', description: 'Presupuesto cerrado bajo contrato menor LCSP (<15.000€). Memoria técnica, seguro RC 600.000€ y PA 12.000W.' },
  { vertical: 'ayuntamientos', intent: 'sonorizacion-actos-institucionales', title: 'Sonorización para Actos Institucionales | Ayuntamientos', description: 'PA profesional para plazas y auditorios municipales. Certificado de solidez, pliego técnico y logística integral.' },
  { vertical: 'ayuntamientos', intent: 'alumbrado-navideno-luces-licitacion-lcsp', title: 'Alumbrado Navideño para Ayuntamientos | Licitaciones LCSP', description: 'Instalación integral de alumbrado navideño, arcos de calle y figuras 3D gigantes para municipios. Contrato menor LCSP (<15.000€) y pliegos técnicos con seguro RC 600.000€.' },
  // Fincas Singulares
  { vertical: 'fincas', intent: 'opiniones-quinta-malpica-sonorizacion', title: 'Sonorización y Música en Quinta Malpica | Opiniones y Rider', description: 'Estudio de acústica y música en directo para eventos en Quinta Malpica. Cobertura uniforme 12 W/pax, microfonía sin acoples y solista desde 350€.' },
  { vertical: 'fincas', intent: 'finca-los-afligidos-musica-directo', title: 'Música en Directo y Sonorización en Finca Los Afligidos', description: 'Producción musical y técnica para bodas en Finca Los Afligidos. Ensamble de mariachi, tenor Edwin Agudelo y PA Bose F1 con cero distorsión.' },
  { vertical: 'fincas', intent: 'iluminacion-navidena-fincas-eventos', title: 'Iluminación Navideña y Micro-LED para Fincas y Hoteles', description: 'Ambientación lumínica de alta gama para fincas, bodegas y espacios de eventos. Cortinas de micro-LED IP65, arbolado luminoso y figuras 3D exclusivas.' },
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
