export function getEdwinAgudeloSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Person', 'PerformingGroup'],
        '@id': 'https://productoraear.com/artistas/edwin-agudelo#entity',
        name: 'Edwin Agudelo',
        legalName: 'Edwin Agudelo',
        jobTitle: 'Tenor Lírico, Compositor y Productor Audiovisual',
        vocalType: 'Tenor Lírico de Gala',
        description:
          'Tenor solista de música mexicana, rancheras y boleros universales. Condecorado por el Consulado General de Colombia en Madrid. Trayectoria de primer nivel en La Cubierta de Leganés y Plaza de Toros de Valencia con la gira de Ana Gabriel. Creador de la metodología VIMUME.',
        url: 'https://productoraear.com/artistas/edwin-agudelo',
        image: 'https://productoraear.com/artistas/edwin-agudelo/hero.jpg',
        award: [
          'Condecoración y Diploma de Honor del Consulado General de Colombia en Madrid (Teatro La Latina)',
          'Máximo Galardón Gladiadores en el Extranjero (2021)',
          'Premio Más Latinos',
          'Máximo Orgullo Hispano',
        ],
        knowsAbout: [
          'Música Tradicional Mexicana',
          'Técnica Vocal Lírica de Tenor',
          'Producción Audiovisual y Sonorización de Recintos',
          'Metodología VIMUME - Estimulación de la Memoria Emocional',
          'Protocolo Institucional B2G y Actos Diplomáticos',
        ],
        hasOccupation: {
          '@type': 'Occupation',
          name: 'Cantante Solista y Productor de Eventos',
          skills: 'Voz Lírica, Canto a Caballo, Dirección de Concierto, Ingeniería Acústica Bose',
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Méntrida',
          addressRegion: 'Toledo',
          addressCountry: 'ES',
        },
        areaServed: [
          { '@type': 'AdministrativeArea', name: 'Comunidad de Madrid' },
          { '@type': 'AdministrativeArea', name: 'Castilla-La Mancha' },
          { '@type': 'Country', name: 'España' },
          { '@type': 'Place', name: 'Unión Europea' },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Contratación Oficial Edwin Agudelo',
          itemListElement: [
            {
              '@type': 'Offer',
              name: 'Solista Premium con Sonido Autónomo Bose F1',
              priceCurrency: 'EUR',
              price: '1200',
              priceValidUntil: '2027-12-31',
              description:
                'Actuación estelar de tenor mariachi con rider completo Bose F1 812, microfonía Shure Beta 87A y grabación en directo multipista con consola XR18.',
            },
            {
              '@type': 'Offer',
              name: 'Programa Municipal de Doble Impacto (Fiestas Patronales + Sesión Mayores)',
              priceCurrency: 'EUR',
              price: '2000',
              priceValidUntil: '2027-12-31',
              description:
                'Gala nocturna en Plaza Mayor y sesión de estimulación cognitiva en Centro de Mayores local con sistema VIMUME.',
            },
          ],
        },
      },
    ],
  };
}
