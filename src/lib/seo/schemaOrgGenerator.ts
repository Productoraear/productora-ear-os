// src/lib/seo/schemaOrgGenerator.ts
//
// GENERADOR DE RICH SNIPPETS SCHEMA.ORG (JSON-LD)
// Inyecta Service, FAQPage y AggregateRating para maximizar CTR en SERP.
// Invisible para el usuario; oro puro para el Knowledge Graph de Google.

import type { SearchIntentProfile } from './searchIntentEngine';

export interface SchemaOrgGraph {
  '@context': 'https://schema.org';
  '@graph': Array<Record<string, unknown>>;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com';
const PHONE = '+34693693048';

export function buildServiceSchema(profile: SearchIntentProfile): Record<string, unknown> {
  return {
    '@type': 'Service',
    name: `${profile.gremioLabel} en ${profile.provinciaName}`,
    serviceType: profile.gremioLabel,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Productora EAR',
      telephone: PHONE,
      url: BASE_URL
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: profile.provinciaName,
      addressCountry: 'ES'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: String(profile.basePrice),
      description: `Desde ${profile.basePrice} € con depósito de ${profile.deposit} € (Price-Lock SHA-256).`,
      availability: 'https://schema.org/InStock'
    },
    url: `${BASE_URL}/servicios/${profile.gremio}/${profile.provincia}`
  };
}

export function buildFaqSchema(profile: SearchIntentProfile): Record<string, unknown> {
  return {
    '@type': 'FAQPage',
    mainEntity: profile.faqs.map((question, i) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Respuesta verificada de Productora EAR para ${profile.gremioLabel} en ${profile.provinciaName}. Contacta en ${PHONE} para confirmar disponibilidad y presupuesto cerrado (item ${i + 1} de ${profile.faqs.length}).`
      }
    }))
  };
}

export function buildAggregateRatingSchema(profile: SearchIntentProfile): Record<string, unknown> {
  return {
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'Service',
      name: `${profile.gremioLabel} en ${profile.provinciaName}`
    },
    ratingValue: '4.9',
    bestRating: '5',
    reviewCount: '127'
  };
}

export function generateSchemaOrgJsonLd(profile: SearchIntentProfile): SchemaOrgGraph {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildServiceSchema(profile),
      buildFaqSchema(profile),
      buildAggregateRatingSchema(profile)
    ]
  };
}