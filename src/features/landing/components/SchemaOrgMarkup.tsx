// src/features/landing/components/SchemaOrgMarkup.tsx
//
// INYECTOR DE DATOS ESTRUCTURADOS JSON-LD (Schema.org)
// Inyecta Service, FAQPage y AggregateRating para rich snippets en SERP.

import { generateSchemaOrgJsonLd } from '@/lib/seo/schemaOrgGenerator';
import type { SearchIntentProfile } from '@/lib/seo/searchIntentEngine';

interface SchemaOrgMarkupProps {
  profile: SearchIntentProfile;
}

export default function SchemaOrgMarkup({ profile }: SchemaOrgMarkupProps) {
  const jsonLd = generateSchemaOrgJsonLd(profile);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}