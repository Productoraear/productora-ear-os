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
    "@type": "EntertainmentBusiness",
    "name": `VIMUME OS ${city ? `- ${city}` : ""}`,
    "alternateName": "VIMUME OS Institutional",
    "description": serviceDesc || "Arquitectura e Ingeniería de Impacto y Talento. Especialistas en Protocolos de Impacto, Autoridad Institucional y Management Artístico.",
    "url": "https://productoraear.com",
    "logo": "https://productoraear.com/favicon.svg",
    "image": "https://productoraear.com/og-image.png",
    "telephone": "+34 693 693 048",
    "email": "hola@productoraear.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": city ? `Servicio Premium en ${city}` : "Sede Operativa Central",
      "addressLocality": currentCity,
      "addressRegion": city || "Toledo",
      "postalCode": city ? "" : "45510",
      "addressCountry": "ES"
    },
    "geo": city ? undefined : {
      "@type": "GeoCoordinates",
      "latitude": 40.2393,
      "longitude": -4.1953
    },
    "areaServed": city ? [{ "@type": "City", "name": city }] : [
      { "@type": "Country", "name": "Spain" },
      { "@type": "City", "name": "Madrid" },
      { "@type": "City", "name": "Toledo" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `Catálogo ${currentService}`,
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": currentService } }
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
