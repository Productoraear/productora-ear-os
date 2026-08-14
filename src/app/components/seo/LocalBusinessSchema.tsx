"use client";

import React from 'react';

/**
 * 🏛️ SCHEMA ORG - MOTOR DE SOBERANÍA SEO (V175)
 * Inyecta metadatos estructurados para Google Business Profile y Local SEO.
 */
interface SchemaProps {
  city?: string;
  serviceName?: string;
  serviceDesc?: string;
}

export const LocalBusinessSchema = ({ city, serviceName, serviceDesc }: SchemaProps) => {
  const currentCity = city || "Méntrida";
  const currentService = serviceName || "Producción de Eventos";
   const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Productora EAR",
    "alternateName": ["EAR OS", "Productora EAR S-Class", "VIMUME OS"],
    "description": serviceDesc || "Agencia de producción de eventos, alquiler de sistemas de sonido e iluminación, y management artístico exclusivo de Edwin Agudelo. Creadores del ecosistema de musicoterapia VIMUME.",
    "url": "https://productoraear.com",
    "logo": "https://productoraear.com/favicon.svg",
    "image": "https://productoraear.com/images/mariachi.png",
    "telephone": "+34 693 693 048",
    "email": "hola@productoraear.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sede Central, Méntrida",
      "addressLocality": "Méntrida",
      "addressRegion": "Toledo",
      "postalCode": "45510",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 40.2393,
      "longitude": -4.1953
    },
    "areaServed": [
      { "@type": "Country", "name": "Spain" },
      { "@type": "City", "name": "Madrid" },
      { "@type": "City", "name": "Toledo" },
      { "@type": "City", "name": "Barcelona" },
      { "@type": "City", "name": "Valencia" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios Especializados Productora EAR",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sonorización de Eventos",
            "url": "https://productoraear.com/servicios"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Management de Edwin Agudelo",
            "url": "https://productoraear.com/artistas/edwin-agudelo"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Innovación Social VIMUME",
            "url": "https://productoraear.com/vimume"
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
