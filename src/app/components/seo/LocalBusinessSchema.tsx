"use client";

import React from 'react';

/**
 * 🏛️ SCHEMA ORG - MOTOR DE SOBERANÍA SEO (V175)
 * Inyecta metadatos estructurados para Google Business Profile y Local SEO.
 */
export const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EntertainmentBusiness",
    "name": "Productora EAR",
    "alternateName": "EAR OS GOLD",
    "description": "Arquitectura e Ingeniería de Eventos y Talento. Especialistas en Sonorización, Iluminación y Management Artístico S-Class.",
    "url": "https://productoraear.com",
    "logo": "https://productoraear.com/favicon.svg",
    "image": "https://productoraear.com/og-image.png",
    "telephone": "+34 693 693 048",
    "email": "hola@productoraear.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sede Operativa Central",
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
      { "@type": "City", "name": "Sevilla" }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://instagram.com/productoraear",
      "https://facebook.com/productoraear",
      "https://twitter.com/productoraear",
      "https://linkedin.com/company/productoraear"
    ],
    "priceRange": "€€€",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Catálogo S-Class",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Sonorización de Eventos" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Management de Artistas - Edwin Agudelo" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Innovación Social VIMUME" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Iluminación Espectacular" } }
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
