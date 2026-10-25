"use client";

import React from 'react';

/**
 * 🏛️ SCHEMA ORG - MOTOR DE SOBERANÍA SEO S-CLASS & RICH SNIPPETS (V216)
 * Inyecta metadatos estructurados multi-grafo para Google Search, Google Business Profile y Local SEO.
 * Genera Rich Snippets de estrellas 5.0★, rangos de precio, depósitos Stripe y FAQs enriquecidas.
 */
interface SchemaProps {
  city?: string;
  serviceName?: string;
  serviceDesc?: string;
  priceRange?: string;
  canonicalPath?: string;
  faqs?: { q: string; a: string }[];
}

export const LocalBusinessSchema: React.FC<SchemaProps> = ({
  city = "Madrid",
  serviceName = "Producción de Eventos & Mariachis de Gala",
  serviceDesc = "Agencia de producción técnica, sonido homologado (12 W/pax) y management exclusivo de Edwin Agudelo. Innovación social VIMUME.",
  priceRange = "0.50€ - 3.500€",
  canonicalPath = "servicios/mariachis/madrid",
  faqs = []
}) => {
  const currentCity = city || "Madrid";
  const canonicalUrl = `https://productoraear.com/${canonicalPath.replace(/^\//, '')}`;

  const graph: any[] = [
    // 1. ENTIDAD DE NEGOCIO LOCAL & SERVICIO PROFESIONAL
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": `https://productoraear.com/#organization`,
      "name": "Productora EAR",
      "alternateName": ["EAR OS", "Productora EAR S-Class", "VIMUME OS", "Edwin Agudelo Producciones"],
      "description": serviceDesc,
      "url": "https://productoraear.com",
      "logo": "https://productoraear.com/favicon.svg",
      "image": "https://productoraear.com/og-image-vimume.jpg",
      "telephone": "+34 693 693 048",
      "email": "hola@productoraear.com",
      "priceRange": priceRange,
      "paymentAccepted": ["Credit Card", "Stripe", "Bank Transfer", "Bizum"],
      "currenciesAccepted": "EUR",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Hub Central de Operaciones",
        "addressLocality": currentCity,
        "addressRegion": currentCity,
        "addressCountry": "ES"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 40.4168,
        "longitude": -3.7038
      },
      "areaServed": [
        {
          "@type": "AdministrativeArea",
          "name": currentCity
        },
        {
          "@type": "Country",
          "name": "Spain"
        }
      ],
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "23:00"
      }
    },

    // 2. ENTIDAD ARTÍSTICA / AGRUPACIÓN MUSICAL DE EDWIN AGUDELO
    {
      "@type": ["MusicGroup", "PerformingGroup"],
      "@id": `https://productoraear.com/artistas/edwin-agudelo#musicgroup`,
      "name": "Edwin Agudelo & Mariachi Imperial de Gala",
      "alternateName": ["Mariachi Edwin Agudelo", "Tenor Edwin Agudelo"],
      "description": "Gladiador en el Extranjero 2021. Formación de gala de 6 a 12 músicos para bodas y grandes eventos en toda España.",
      "foundingLocation": {
        "@type": "Place",
        "name": "Madrid, España"
      },
      "award": "Premio Gladiador en el Extranjero 2021 (Certificado Consular)",
      "genre": ["Mariachi", "Música Clásica Lírica", "Bolero", "Ranchera"],
      "member": {
        "@type": "Person",
        "name": "Edwin Agudelo",
        "jobTitle": "Tenor Lírico & Director Artístico",
        "award": "Gladiador en el Extranjero 2021"
      }
    },

    // 3. PRODUCTO CON AGGREGATE RATING (5.0★) & OFERTA STRIPE CON DEPÓSITO 0.50€ - 350€
    {
      "@type": "Product",
      "@id": `${canonicalUrl}#product`,
      "name": `${serviceName} en ${currentCity}`,
      "description": serviceDesc,
      "image": "https://productoraear.com/og-image-vimume.jpg",
      "brand": {
        "@type": "Brand",
        "name": "Productora EAR"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "48",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Marta & Javier (Boda Finca El Campillo)"
          },
          "datePublished": "2026-05-20",
          "reviewBody": "Contratamos el servicio musical de Productora EAR para nuestra ceremonia y cóctel. Puntualidad impecable, sonido nítido y trato profesional inmejorable."
        },
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Comité Fiestas Patronales Méntrida"
          },
          "datePublished": "2026-08-14",
          "reviewBody": "Espectáculo musical de primer nivel con sonorización homologada Bose y cumplimiento absoluto de la normativa de ruido."
        }
      ],
      "offers": {
        "@type": "Offer",
        "url": canonicalUrl,
        "priceCurrency": "EUR",
        "price": "350.00",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@type": "Organization",
          "name": "Productora EAR"
        },
        "description": "Tarifa base oficial solista 350 € con fianza de bloqueo de 100 € deducible vía Stripe Price-Lock."
      }
    }
  ];

  // 4. PREGUNTAS FRECUENTES (FAQPage SCHEMA) SI EXISTEN
  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    });
  }

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": graph
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
    />
  );
};
