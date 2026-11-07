import {
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';
import {
  FincaHomologada,
  SCLASS_12_FINCAS_HOMOLOGADAS,
} from '@/lib/constants/fincas-catalog';

export type SchemaOrgContext = 'https://schema.org';

export interface PostalAddressSchemaJsonLd {
  readonly '@type': 'PostalAddress';
  readonly streetAddress?: string;
  readonly addressLocality: string;
  readonly addressRegion: string;
  readonly postalCode?: string;
  readonly addressCountry: 'ES';
}

export interface LocationFeatureSpecificationJsonLd {
  readonly '@type': 'LocationFeatureSpecification';
  readonly name: string;
  readonly value: boolean | string;
}

export interface OfferSchemaJsonLd {
  readonly '@type': 'Offer';
  readonly price: string; // '100.00'
  readonly priceCurrency: 'EUR';
  readonly description: string;
  readonly availability?: 'https://schema.org/InStock' | 'https://schema.org/PreOrder';
  readonly category?: string;
  readonly url?: string;
}

export interface AdministrativeAreaSchemaJsonLd {
  readonly '@type': 'AdministrativeArea';
  readonly name: string;
  readonly addressCountry?: 'ES';
}

export interface EventVenueSchemaJsonLd {
  readonly '@context': SchemaOrgContext;
  readonly '@type': 'EventVenue';
  readonly '@id'?: string;
  readonly name: string;
  readonly description: string;
  readonly url?: string;
  readonly telephone: string;
  readonly address: PostalAddressSchemaJsonLd;
  readonly maximumAttendeeCapacity: number;
  readonly amenityFeature: readonly LocationFeatureSpecificationJsonLd[];
  readonly offers: OfferSchemaJsonLd;
  readonly areaServed: string | AdministrativeAreaSchemaJsonLd;
}

export interface ItemListSchemaJsonLd {
  readonly '@context': SchemaOrgContext;
  readonly '@type': 'ItemList';
  readonly name: string;
  readonly description: string;
  readonly numberOfItems: number;
  readonly itemListElement: readonly {
    readonly '@type': 'ListItem';
    readonly position: number;
    readonly item: EventVenueSchemaJsonLd;
  }[];
}

export type TerritorialHubScope = 'HUB_MENTRIDA' | 'RED_NACIONAL';

export interface TerritorialLogisticsProfile {
  readonly scope: TerritorialHubScope;
  readonly hubOriginName: string;
  readonly distanceHubKm: number;
  readonly isWithinExemptRadius: boolean;
  readonly exemptKm: number; // 50
  readonly billableKm: number;
  readonly kmRateEur: number; // 1.50
  readonly kmCostCents: number;
  readonly kmCostEur: number;
  readonly requiresHotel: boolean;
  readonly hotelCostCents: number;
  readonly hotelCostEur: number;
  readonly totalLogisticsCents: number;
  readonly totalLogisticsEur: number;
  readonly territorialDeclaration: string;
}

export interface ContactVerificationResult {
  readonly isVerified: boolean;
  readonly rawPhone: string;
  readonly cleanDigits: string;
  readonly isSpanishFormat: boolean;
  readonly formattedE164: string;
  readonly maskedPhone: string;
  readonly error?: string;
}

export interface FincaSchemaOptions {
  siteUrl?: string;
  customOfferDescription?: string;
  overrideTelephone?: string;
  customAreaServed?: string | AdministrativeAreaSchemaJsonLd;
}

export interface FincasLandingSchemaResult {
  productSchema: {
    '@context': 'https://schema.org';
    '@type': 'Product';
    name: string;
    description: string;
    offers: OfferSchemaJsonLd;
  };
  itemListSchema: ItemListSchemaJsonLd;
}

/** Regex canónica para verificación de números telefónicos españoles (fijo o móvil con o sin prefijo +34). */
export const SPANISH_PHONE_VERIFICATION_REGEX =
  /^(\+34\s?)?[6789]\d{2}(\s?\d{3}){2}$|^(\+34\s?)?[6789]\d{8}$/;

/**
 * Valida si un string corresponde a un formato telefónico español auténtico y verificable.
 */
export function isVerifiableSpanishPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  return SPANISH_PHONE_VERIFICATION_REGEX.test(phone.trim());
}

/**
 * Enmascara números telefónicos para cumplimiento estricto de Contact-Gate anti-picaresca (AGENTS.md §4).
 * Preserva intacta la Centralita Oficial de EAR OS (+34 693 693 048).
 */
export function maskPhoneForContactGate(
  telephone: string,
  preserveCentralita: boolean = true
): string {
  if (!telephone || typeof telephone !== 'string') return '••• ••• •••';
  const clean = telephone.trim();
  const cleanDigits = clean.replace(/\D/g, '');
  const centralitaDigits = CENTRALITA_EAR_OS.replace(/\D/g, '');

  if (preserveCentralita && (clean === CENTRALITA_EAR_OS || cleanDigits === centralitaDigits)) {
    return CENTRALITA_EAR_OS;
  }

  if (clean.startsWith('+34')) {
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1]} ••• •••`;
    }
    const withoutPrefix = clean.slice(3).trim();
    if (withoutPrefix.length >= 3) {
      return `+34 ${withoutPrefix.slice(0, 3)} ••• •••`;
    }
  }

  const rawDigits =
    cleanDigits.startsWith('34') && cleanDigits.length === 11 ? cleanDigits.slice(2) : cleanDigits;
  if (rawDigits.length >= 3) {
    return `+34 ${rawDigits.slice(0, 3)} ••• •••`;
  }

  return clean.slice(0, 4) + ' ••• •••';
}

/**
 * Verifica la autenticidad técnica y formal de un teléfono de contacto de finca o proveedor.
 */
export function verifyVenueTelephone(telephone: string): ContactVerificationResult {
  const raw = telephone ?? '';
  const trimmed = typeof raw === 'string' ? raw.trim() : '';
  const cleanDigits = trimmed.replace(/\D/g, '');
  const isSpanishFormat = isVerifiableSpanishPhone(trimmed);
  const isVerified = isSpanishFormat && cleanDigits.length >= 9;

  let formattedE164 = '';
  if (isVerified) {
    if (cleanDigits.length === 9) {
      formattedE164 = `+34${cleanDigits}`;
    } else if (cleanDigits.length === 11 && cleanDigits.startsWith('34')) {
      formattedE164 = `+${cleanDigits}`;
    } else {
      formattedE164 = trimmed;
    }
  }

  const maskedPhone = maskPhoneForContactGate(trimmed, true);

  return {
    isVerified,
    rawPhone: raw,
    cleanDigits,
    isSpanishFormat,
    formattedE164,
    maskedPhone,
    error: isVerified
      ? undefined
      : 'Teléfono no cumple el patrón canónico español (+34 6xx/7xx/8xx/9xx)',
  };
}

/**
 * Determina si la finca u operador pertenece al radio operativo directo de Hub Méntrida
 * (Toledo / Madrid hasta 100 km radiales, o radio exento <= 50 km).
 */
export function isHubMentridaTerritory(provincia: string, distanceKm?: number): boolean {
  if (!provincia) return false;
  const p = provincia.trim().toLowerCase();
  const isMadridOrToledo = p === 'madrid' || p === 'toledo';
  if (distanceKm !== undefined) {
    return (isMadridOrToledo && distanceKm <= 100) || distanceKm <= 50;
  }
  return isMadridOrToledo;
}

/**
 * Genera la declaración territorial y de cercanía logística al Hub Central de Méntrida.
 */
export function formatTerritorialDeclaration(
  finca: Pick<FincaHomologada, 'location' | 'provincia' | 'distanciaHubMentridaKm'>
): string {
  const hubText =
    finca.distanciaHubMentridaKm === 0
      ? '0 km a Méntrida Hub · Base Central Operativa EAR'
      : `${finca.distanciaHubMentridaKm} km a Méntrida Hub`;
  return `${finca.location} · ${hubText} (${finca.provincia})`;
}

/**
 * Resuelve el perfil financiero y territorial de logística para una finca en céntimos enteros.
 */
export function resolveTerritorialLogistics(
  finca: Pick<FincaHomologada, 'provincia' | 'distanciaHubMentridaKm' | 'location'>,
  options?: { eventEndTime?: string }
): TerritorialLogisticsProfile {
  const distance = Math.max(0, finca.distanciaHubMentridaKm);
  const isWithinExemptRadius = distance <= LOGISTICA_KM_EXENTOS;
  const exemptKm = LOGISTICA_KM_EXENTOS;
  const billableKm = isWithinExemptRadius ? 0 : distance - exemptKm;
  const kmRateEur = LOGISTICA_EUR_PER_KM;
  const kmCostCents = Math.round(billableKm * LOGISTICA_EUR_PER_KM * 100);
  const kmCostEur = Number((kmCostCents / 100).toFixed(2));

  let isLateClosing = false;
  if (options?.eventEndTime) {
    const parts = options.eventEndTime.split(':');
    const hour = parseInt(parts[0], 10);
    if (!isNaN(hour) && (hour >= HORA_FIN_HOTEL && hour <= 8)) {
      isLateClosing = true;
    }
  }

  const requiresHotel = distance > LOGISTICA_KM_HOTEL || isLateClosing;
  const hotelCostCents = requiresHotel ? Math.round(SUPLEMENTO_HOTEL_EUR * 100) : 0;
  const hotelCostEur = requiresHotel ? SUPLEMENTO_HOTEL_EUR : 0;
  const totalLogisticsCents = kmCostCents + hotelCostCents;
  const totalLogisticsEur = Number((totalLogisticsCents / 100).toFixed(2));
  const scope: TerritorialHubScope = isHubMentridaTerritory(finca.provincia, distance)
    ? 'HUB_MENTRIDA'
    : 'RED_NACIONAL';
  const hubOriginName =
    scope === 'HUB_MENTRIDA'
      ? 'Hub Central Méntrida (Toledo)'
      : 'Red Nacional de Proveedores Homologados';
  const territorialDeclaration = formatTerritorialDeclaration(finca);

  return {
    scope,
    hubOriginName,
    distanceHubKm: distance,
    isWithinExemptRadius,
    exemptKm,
    billableKm,
    kmRateEur,
    kmCostCents,
    kmCostEur,
    requiresHotel,
    hotelCostCents,
    hotelCostEur,
    totalLogisticsCents,
    totalLogisticsEur,
    territorialDeclaration,
  };
}

/**
 * Genera el esquema JSON-LD para EventVenue según schema.org,
 * integrando la oferta con fianza deducible Price-Lock (DEPOSITO_STRIPE_EUR).
 */
export function generateFincaEventVenueSchema(
  finca: FincaHomologada,
  options?: FincaSchemaOptions
): EventVenueSchemaJsonLd {
  const baseUrl = options?.siteUrl ?? '';
  const venueUrl = baseUrl ? `${baseUrl}/fincas/${finca.slug}` : `/fincas/${finca.slug}`;
  const offersUrl = baseUrl ? `${baseUrl}/fincas` : '/fincas';

  return {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    '@id': venueUrl,
    name: finca.name,
    description: finca.description,
    url: venueUrl,
    telephone: options?.overrideTelephone || finca.directorioContacto.telefono,
    address: {
      '@type': 'PostalAddress',
      addressLocality: finca.location.replace(/\s*\([^)]*\)/, '').trim(),
      addressRegion: finca.provincia,
      addressCountry: 'ES',
    },
    maximumAttendeeCapacity: finca.capacidadMaxPax,
    amenityFeature: finca.serviciosCoordinados.map((s) => ({
      '@type': 'LocationFeatureSpecification',
      name: s,
      value: true,
    })),
    offers: {
      '@type': 'Offer',
      price: DEPOSITO_STRIPE_EUR.toFixed(2),
      priceCurrency: 'EUR',
      description:
        options?.customOfferDescription ||
        'Depósito Price-Lock 100% deducible para reserva y visita técnica',
      availability: 'https://schema.org/InStock',
      category: 'B2B Partnership',
      url: offersUrl,
    },
    areaServed: options?.customAreaServed || finca.provincia,
  };
}

/**
 * Genera el esquema JSON-LD para ItemList del catálogo completo de fincas homologadas.
 */
export function generateFincasCatalogItemListSchema(
  fincas: readonly FincaHomologada[] = SCLASS_12_FINCAS_HOMOLOGADAS,
  options?: FincaSchemaOptions & { listName?: string; listDescription?: string }
): ItemListSchemaJsonLd {
  const list = fincas ?? SCLASS_12_FINCAS_HOMOLOGADAS;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: options?.listName || 'Catálogo Oficial de Fincas y Espacios Homologados S-Class · EAR OS',
    description:
      options?.listDescription ||
      'Selección exclusiva de espacios y fincas con garantía acústica Ley 37/2003, acometida CETAC 32A y blindaje anti-fuga publicitaria.',
    numberOfItems: list.length,
    itemListElement: list.map((finca, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateFincaEventVenueSchema(finca, options),
    })),
  };
}

/**
 * Genera el conjunto de esquemas JSON-LD para la landing pública B2B de fincas.
 */
export function generateFincasLandingSchema(
  options?: FincaSchemaOptions & { siteUrl?: string }
): FincasLandingSchemaResult {
  const productOffersUrl = options?.siteUrl ? `${options.siteUrl}/fincas` : '/fincas';
  const productSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'Product' as const,
    name: 'Pacto de los 100 Fundadores · Red Homologada de Fincas EAR OS',
    description:
      'Escaparate B2B exclusivo para propietarios de fincas y bodas de alta fidelidad acústica en España. ' +
      `Price-Match de cuota vitalicia, 0% fuga publicitaria, menú simulator 2026 y depósito Price-Lock de ${DEPOSITO_STRIPE_EUR} €.`,
    offers: {
      '@type': 'Offer' as const,
      price: DEPOSITO_STRIPE_EUR.toFixed(2),
      priceCurrency: 'EUR' as const,
      availability: 'https://schema.org/InStock' as const,
      category: 'B2B Partnership',
      url: productOffersUrl,
      description: 'Depósito Price-Lock 100% deducible para reserva y visita técnica',
    },
  };

  const itemListSchema = generateFincasCatalogItemListSchema(SCLASS_12_FINCAS_HOMOLOGADAS, options);

  return {
    productSchema,
    itemListSchema,
  };
}

/**
 * Serializador seguro para inyección en etiquetas <script type="application/ld+json">.
 */
export function serializeSchemaToJsonLd(schema: object): string {
  return JSON.stringify(schema, null, 2);
}
