import React from 'react';
import { Metadata } from 'next';
import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';
import { SERVICIOS, PROVINCIAS } from '@/lib/constants/seo-data';

interface PageProps {
  params: Promise<{
    nicho: string;
    ciudad: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { nicho, ciudad } = await params;
  const formattedNicho = nicho.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const formattedCiudad = ciudad.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    title: `${formattedNicho} en ${formattedCiudad} | Productora EAR GOLD`,
    description: `Servicios S-Class de ${formattedNicho} en ${formattedCiudad}. Ingeniería de impacto, sonorización con Bose F1 y Price-Lock 72h.`,
  };
}

export default async function CityServicePage({ params }: PageProps) {
  const { nicho, ciudad } = await params;
  const service = SERVICIOS.find(s => s.slug === nicho.toLowerCase());
  const formattedCiudad = ciudad.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const formattedNicho = nicho.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const title = service ? `${service.nombre} en ${formattedCiudad}` : `${formattedNicho} en ${formattedCiudad}`;
  const description = service 
    ? `${service.descripcion} Despliegue operativo en la provincia de ${formattedCiudad}.`
    : `Infraestructura técnica de élite para ${nicho.replace(/-/g, ' ')} en ${formattedCiudad}.`;

  const canonicalUrl = `https://www.productoraear.com/servicios/${nicho}/${ciudad}`;

  // 1. Inyección Masiva de Datos Estructurados Rich Snippets JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${canonicalUrl}#localbusiness`,
        "name": `Productora EAR - ${formattedNicho} ${formattedCiudad}`,
        "url": canonicalUrl,
        "telephone": "+34900000000",
        "priceRange": "€€€",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": formattedCiudad,
          "addressCountry": "ES"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 40.416775,
          "longitude": -3.703790
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "128"
        }
      },
      {
        "@type": "Product",
        "@id": `${canonicalUrl}#product`,
        "name": title,
        "description": description,
        "brand": {
          "@type": "Brand",
          "name": "Productora EAR S-Class"
        },
        "offers": {
          "@type": "Offer",
          "url": canonicalUrl,
          "priceCurrency": "EUR",
          "price": "1450.00",
          "priceValidUntil": new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().split('T')[0],
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": `¿Cómo congelar la tarifa de ${formattedNicho} en ${formattedCiudad}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Puedes congelar tu presupuesto durante 72 horas mediante firma criptográfica SHA-256 abonando un depósito de 100€ directamente desde el BespokePricer."
            }
          },
          {
            "@type": "Question",
            "name": `¿Qué equipamiento técnico se incluye para ${formattedCiudad}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Incluye sonorización profesional Bose F1 Model 812, subwoofers FBT X-SUB, mesa digital Behringer XR18 y microfonía Shure."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BespokeTemplate 
        title={title}
        description={description}
        location={formattedCiudad}
        serviceId={nicho}
        keywords={[nicho, ciudad, 'S-Class', 'Aura Onyx', 'Price-Lock']}
      />
    </>
  );
}

export async function generateStaticParams() {
  const params = [];
  const targetNichos = ['edwin-agudelo-solista', 'edwin-agudelo-mariachi-6', 'edwin-caballo', 'banda-monumental'];
  
  for (const n of targetNichos) {
    for (const p of PROVINCIAS) {
      params.push({ nicho: n, ciudad: p });
    }
  }
  
  return params;
}
