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
export const GeoStructuredData: React.FC<GeoStructuredDataProps> = React.memo(({
  pageType = 'general',
  title = 'Productora EAR | Espectáculos, Música en Directo y Audiovisuales',
  description = 'Producción audiovisual, música en vivo, mariachi de gala y alquiler de pantallas LED en España y Europa. Tarifa base Solista 350€, Quinteto Mariachi 750€.',
  url = 'https://www.productoraear.com',
  breadcrumbs = [],
  faqs = [],
  price = 350,
  region = 'España y Europa'
}) => {
  // 1. Organization & Entertainment Business Schema (Google Business Profile & SOTA LocalBusiness)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['EntertainmentBusiness', 'PerformingGroup', 'ProfessionalService'],
    name: 'Productora EAR :: Producción Técnica, Bodas & Eventos B2G',
    alternateName: 'EAR OS',
    url: 'https://productoraear.com',
    logo: 'https://productoraear.com/media/logo.png',
    image: 'https://productoraear.com/media/edwin-hero.jpg',
    description: description,
    telephone: '+34693693048',
    email: 'productoraear@gmail.com',
    priceRange: '€€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hub Central Méntrida',
      addressLocality: 'Méntrida',
      addressRegion: 'Toledo / Madrid',
      postalCode: '45214',
      addressCountry: 'ES'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.2378,
      longitude: -4.1953
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        ],
        opens: '09:00',
        closes: '22:00'
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '248',
      bestRating: '5',
      worstRating: '1'
    },
    paymentAccepted: 'Cash, Credit Card, Stripe (Price-Lock 100€)',
    currenciesAccepted: 'EUR',
    areaServed: [
      { '@type': 'Country', name: 'Spain' },
      { '@type': 'Country', name: 'Portugal' },
      { '@type': 'Country', name: 'France' },
      { '@type': 'Country', name: 'Italy' },
      { '@type': 'AdministrativeArea', name: 'European Union' }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Catálogo Oficial de Servicios Productora EAR',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Edwin Agudelo · Solista Tenor & Mariachi de Gala',
            url: 'https://productoraear.com/artistas/edwin-agudelo'
          },
          price: '350.00',
          priceCurrency: 'EUR'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'LodgingBusiness',
            name: 'Villa Escorial Park · Finca Exclusiva con Alojamiento 30 pax',
            url: 'https://productoraear.com/fincas/villa-escorial-park'
          },
          price: '4500.00',
          priceCurrency: 'EUR'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'DJ para Bodas S-Class con Sonido Bose y Retén de Relevo',
            url: 'https://productoraear.com/bodas/dj'
          },
          price: '450.00',
          priceCurrency: 'EUR'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Mariachi de Gran Gala Quinteto Oficial de Conservatorio',
            url: 'https://productoraear.com/mariachis'
          },
          price: '750.00',
          priceCurrency: 'EUR'
        }
      ]
    },
    founder: {
      '@type': 'Person',
      name: 'Edwin Agudelo',
      jobTitle: 'Tenor Lírico, Director Artístico & Mariachi Solista',
      url: 'https://productoraear.com/artistas/edwin-agudelo'
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
      answer: 'La tarifa base de contratación de Edwin Agudelo en formato Solista Premium es de 350 € con equipo de sonido profesional Bose F1 (1.000 W) y microfonía inalámbrica Shure Axient Digital incluidos.'
    },
    {
      question: '¿Cuánto cuesta alquilar Villa Escorial Park para bodas o eventos con alojamiento?',
      answer: 'El fin de semana completo en Villa Escorial Park (San Lorenzo de El Escorial, Madrid) tiene una tarifa de 4.500 € (de viernes 14:00h a domingo 14:00h) con alojamiento para 30 personas en 9 dormitorios, piscina vallada, sala de cine con 12 sofás de masaje y tour virtual 3D Matterport.'
    },
    {
      question: '¿Cuánto cuesta un DJ profesional para bodas con Productora EAR?',
      answer: 'El servicio DJ Bodas S-Class tiene una tarifa base desde 450 € para la barra libre (3-4 horas). Incluye cabina Pioneer DJ Opus Quad/Nexus, sonido Bose a 12 W/pax, iluminación robótica DMX y garantía inmutable 0% cancelaciones con retén de relevo en menos de 90 minutos.'
    },
    {
      question: '¿Cuál es el formato oficial para Mariachi completo en Productora EAR?',
      answer: 'El formato oficial de Mariachi de Gran Gala es de 5 músicos de conservatorio (Quinteto Pro) uniformados con trajes charros de gala auténticos y sonorización profesional desde 750 €.'
    },
    {
      question: '¿Cómo contactar con Productora EAR para reservar fechas o pedir presupuesto?',
      answer: 'A través del teléfono y WhatsApp oficial 24/7 al +34 693 693 048 o por correo electrónico en productoraear@gmail.com. Las cotizaciones se formalizan con un depósito protegido de 100 € en Stripe (Price-Lock SHA-256).'
    },
    {
      question: '¿Dónde contratar paellas gigantes o catering de brasas para eventos?',
      answer: 'Productora EAR organiza showcooking de brasas al sarmiento desde 45 €/persona y paellas gigantes en directo para grupos de entre 50 y 2.500 comensales con recetas tradicionales de marisco, senyoret y paella valenciana.'
    },
    {
      question: '¿En qué consiste el programa VIMUME y qué retorno social genera?',
      answer: 'VIMUME es el programa de neuro-musicoterapia financiado con el 10% del Split Soberano de Productora EAR. Aplica estimulación acústica Gamma a 40 Hz en residencias senior, logrando un 74% de desescalada en psicofármacos y un SROI certificado de 4,85 € por cada euro invertido con deducciones fiscales de hasta el 80% bajo la Ley 49/2002.'
    },
    {
      question: '¿Cómo licitan los ayuntamientos festejos y espectáculos con Productora EAR?',
      answer: 'Bajo el Artículo 118 de la LCSP (contratos menores del sector público) con ajuste preventivo de seguridad fijado en menos de 14.250 €, incluyendo memoria técnica, insuficiencia de medios y sonometría homologada (< 75 dB SPL).'
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
});
