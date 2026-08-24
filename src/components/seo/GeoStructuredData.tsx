import React from 'react';

interface GeoStructuredDataProps {
  pageType?: 'artist' | 'service' | 'wedding' | 'corporate' | 'general';
  title?: string;
  description?: string;
  url?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  price?: number;
  region?: string;
}

/**
 * 🏛️ GEO STRUCTURED DATA (GENERATIVE ENGINE OPTIMIZATION & SCHEMA.ORG S-CLASS)
 * Genera microdatos JSON-LD de alta densidad para Google Rich Results, ChatGPT Search,
 * Perplexity y Gemini con alcance en España y Europa.
 */
export const GeoStructuredData: React.FC<GeoStructuredDataProps> = ({
  pageType = 'general',
  title = 'Productora EAR | Espectáculos, Música en Directo y Audiovisuales',
  description = 'Producción audiovisual, música en vivo, mariachi de gala y alquiler de pantallas LED en España y Europa. Tarifa base Solista 350€, Quinteto Mariachi 750€.',
  url = 'https://www.productoraear.com',
  breadcrumbs = [],
  faqs = [],
  price = 350,
  region = 'España y Europa'
}) => {
  // 1. Organization & Entertainment Business Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['EntertainmentBusiness', 'PerformingGroup'],
    name: 'Productora EAR',
    alternateName: 'EAR OS',
    url: 'https://www.productoraear.com',
    logo: 'https://www.productoraear.com/media/logo.png',
    image: 'https://www.productoraear.com/media/edwin-hero.jpg',
    description: description,
    telephone: '+34693693048',
    email: 'contacto@productoraear.com',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Madrid',
      addressRegion: 'Comunidad de Madrid',
      addressCountry: 'ES'
    },
    areaServed: [
      { '@type': 'Country', name: 'Spain' },
      { '@type': 'Country', name: 'Portugal' },
      { '@type': 'Country', name: 'France' },
      { '@type': 'Country', name: 'Italy' },
      { '@type': 'Country', name: 'Germany' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'AdministrativeArea', name: 'European Union' }
    ],
    founder: {
      '@type': 'Person',
      name: 'Edwin Agudelo',
      jobTitle: 'Tenor Lírico, Director Artístico & Mariachi Solista',
      url: 'https://www.productoraear.com/artistas/edwin-agudelo'
    },
    sameAs: [
      'https://www.youtube.com/@EdwinAgudeloTenor',
      'https://www.instagram.com/edwinagudelotenor',
      'https://wa.me/34693693048'
    ]
  };

  // 2. Person & Music Artist Schema (Edwin Agudelo)
  const artistSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Edwin Agudelo',
    jobTitle: 'Tenor Solista y Director de Mariachi de Gran Gala',
    url: 'https://www.productoraear.com/artistas/edwin-agudelo',
    telephone: '+34693693048',
    performerIn: {
      '@type': 'MusicEvent',
      name: 'Show Edwin Agudelo · Solista Premium & Mariachi de Gala',
      startDate: '2026-01-01',
      location: {
        '@type': 'Place',
        name: 'Eventos Privados, Bodas y Galas Corporativas en España y Europa',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'ES'
        }
      },
      offers: {
        '@type': 'Offer',
        url: 'https://www.productoraear.com/artistas/edwin-agudelo',
        price: '350.00',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01'
      }
    }
  };

  // 3. Service & Offer Schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: title,
    provider: {
      '@type': 'EntertainmentBusiness',
      name: 'Productora EAR'
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: region
    },
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: url
    }
  };

  // 4. FAQ Schema for AI Direct Citation
  const defaultFaqs = [
    {
      question: '¿Cuánto cuesta contratar a Edwin Agudelo como cantante o mariachi solista?',
      answer: 'La tarifa base de contratación de Edwin Agudelo en formato Solista Premium es de 350 € con equipo de sonido profesional Bose y microfonía inalámbrica incluidos.'
    },
    {
      question: '¿Cuál es el formato mínimo oficial para Mariachi completo en Productora EAR?',
      answer: 'El formato mínimo oficial de Mariachi de Gran Gala es de 5 músicos de conservatorio (Quinteto Pro) con trajes charros y sonorización desde 750 €.'
    },
    {
      question: '¿En qué países y ciudades presta servicio Productora EAR?',
      answer: 'Productora EAR opera en las 52 provincias de España y realiza giras y eventos de destino en toda Europa: París, Niza, Roma, Florencia, Londres, Lisboa, Oporto, Zúrich, Berlín y Mónaco.'
    }
  ];

  const activeFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: activeFaqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer
      }
    }))
  };

  // 5. BreadcrumbList Schema
  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: b.name,
      item: b.url
    }))
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {pageType === 'artist' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(artistSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
    </>
  );
};
