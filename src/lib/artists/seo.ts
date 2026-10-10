export interface SEOClusterConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
}

export interface EventSchemaLocationAddress {
  '@type': 'PostalAddress';
  addressLocality: string;
  addressCountry: string;
}

export interface EventSchemaLocation {
  '@type': 'Place';
  name: string;
  address: EventSchemaLocationAddress;
}

export interface EventSchemaPerformer {
  '@type': 'PerformingGroup';
  name: string;
  url: string;
}

export interface EventSchemaOffers {
  '@type': 'AggregateOffer';
  priceCurrency: string;
  lowPrice: string;
  highPrice: string;
  offerCount: string;
}

export interface EventSchema {
  '@context': 'https://schema.org';
  '@type': 'Event';
  name: string;
  startDate: string;
  location: EventSchemaLocation;
  performer: EventSchemaPerformer;
  offers: EventSchemaOffers;
}

const DEFAULT_ARTIST_NAME: string = 'Edwin Agudelo';
const ARTIST_CANONICAL_URL: string = 'https://productoraear.com/artistas/edwin-agudelo';
const SITE_BASE_URL: string = 'https://productoraear.com';

function capitalize(value: string): string {
  if (value.length === 0) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function resolveStartDate(): string {
  const iso: string = new Date().toISOString();
  const parts: string[] = iso.split('T');
  const datePart: string | undefined = parts[0];
  return typeof datePart === 'string' && datePart.length > 0 ? datePart : iso;
}

export function generateArtistSEOMeta(
  eventType: string,
  location: string,
  artistName: string = DEFAULT_ARTIST_NAME
): SEOClusterConfig {
  const eventClean: string = capitalize(eventType);
  const locClean: string = capitalize(location);

  const title: string = `Mariachis para ${eventClean} en ${locClean} | Contratar ${artistName} Oficial`;
  const description: string = `Contrata la excelencia sónica de ${artistName} para tu ${eventType} en ${location}. Espectáculo premium Aura Onyx, repertorio tradicional mexicano personalizado y sonido impecable.`;

  const keywords: string[] = [
    `mariachi para ${eventType} en ${location}`,
    `contratar mariachi ${location}`,
    `mariachis profesionales ${location}`,
    `${artistName} ${location}`,
    `mariachi ${eventType} de lujo`,
    `precio mariachis ${location}`
  ];

  const canonical: string = `${SITE_BASE_URL}/artistas/${eventType.toLowerCase()}/${location.toLowerCase()}`;

  return { title, description, keywords, canonical };
}

export function generateEventSchema(
  eventType: string,
  location: string,
  artistName: string = DEFAULT_ARTIST_NAME
): EventSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `Espectáculo de Mariachi para ${eventType} en ${location}`,
    startDate: resolveStartDate(),
    location: {
      '@type': 'Place',
      name: `Zonas de actuación en ${location}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: location,
        addressCountry: 'ES'
      }
    },
    performer: {
      '@type': 'PerformingGroup',
      name: artistName,
      url: ARTIST_CANONICAL_URL
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '350',
      highPrice: '2500',
      offerCount: '3'
    }
  };
}