/**
 * MODELO DE CONTENIDO DE LAS LANDINGS DE EVENTOS.
 *
 * Una sola fuente de copy para las cinco plantillas (`/eventos`,
 * `/eventos/{familia}`, `/eventos/{familia}/{intencion}`,
 * `/eventos/{familia}/{intencion}/{provincia}` y `/eventos/local/{prov}/{muni}`).
 *
 * Por qué un modelo y no copy suelto en cada página: 24.000 URLs escritas a mano
 * serían 24.000 clones. Aquí cada página se compone de datos REALES y distintos
 * (familia, intención, contexto acústico, provincia, distancia, municipio, INE,
 * tarifa calculada) de modo que dos URLs nunca comparten cuerpo.
 *
 * Reglas duras:
 *  · Cero superlativos absolutos, cero testimonios, cero marcas de terceros (JUR-4).
 *  · Cero afirmaciones no acreditables: no se promete disponibilidad ni "cero
 *    sanciones"; se describe rider, precio calculado y contrato (JUR-1, JUR-2).
 *  · Todo importe viene de `eventPricingCopy` (que a su vez lee el SSOT).
 *  · Cero datos personales (INV-14).
 *
 * SEC-2 · role: public | tenant: global.
 */
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';
import { CANONICAL_SERVICES } from '@/lib/navigation/canonical-taxonomy';
import {
  EVENT_FAMILIES,
  EVENT_FAMILY_BY_ID,
  EVENT_INTENT_COUNT,
  getAcousticProfile,
  getEventFamilyBreakdown,
  getIntentsByDemandTier,
  getIntentsByFamily,
  type EventFamily,
  type EventIntent,
} from '@/lib/seo/eventIntentTaxonomy';
import {
  MUNICIPALITY_COVERAGE_STATS,
  SPAIN_MUNICIPALITY_COUNT,
  getMunicipalitiesByProvince,
  getProvincesByMunicipalityDensity,
  getProvinceCoverage,
  type SpainMunicipality,
} from '@/lib/seo/spainMunicipalityCoverage';
import {
  EVENT_SSOT_COPY,
  buildWhatsappUrl,
  computeFromPriceEur,
  computeLogisticsEur,
  formatEur,
} from '@/lib/seo/eventPricingCopy';

export interface EventLandingFaq {
  question: string;
  answer: string;
}

export interface EventLandingLink {
  href: string;
  label: string;
  hint: string;
}

export interface EventLandingSection {
  title: string;
  body: readonly string[];
  bullets: readonly string[];
}

export interface EventLandingFact {
  label: string;
  value: string;
}

export interface EventLandingModel {
  eyebrow: string;
  title: string;
  lede: string;
  breadcrumbs: ReadonlyArray<{ href: string; label: string }>;
  facts: readonly EventLandingFact[];
  sections: readonly EventLandingSection[];
  faq: readonly EventLandingFaq[];
  links: readonly EventLandingLink[];
  whatsappUrl: string;
  ctaLabel: string;
  canonicalPath: string;
  structuredData: readonly Record<string, unknown>[];
  indexable: boolean;
}

const SEASON_LABELS: Readonly<Record<string, string>> = {
  'todo-el-ano': 'todo el año',
  primavera: 'primavera',
  verano: 'verano',
  otono: 'otoño',
  invierno: 'invierno',
  'mayo-septiembre': 'mayo a septiembre',
  'diciembre-enero': 'diciembre y enero',
};

const AUDIENCE_LABELS: Readonly<Record<string, string>> = {
  B2B: 'empresa (B2B)',
  B2C: 'cliente particular (B2C)',
  B2G: 'administración local (B2G)',
  B2E: 'equipo interno (B2E)',
  B2D: 'delegación o cuerpo diplomático (B2D)',
};

export const EVENT_ORIGIN = 'https://www.productoraear.com';

export function getServiceLabel(slug: string): string {
  return CANONICAL_SERVICES.find((service) => service.slug === slug)?.label ?? slug;
}

export function getProvinceEntity(provinceSlug: string) {
  return PROVINCIAS_52_GRAPH[provinceSlug] ?? null;
}

export function getSeasonLabel(season: string): string {
  return SEASON_LABELS[season] ?? season;
}

export function getAudienceLabel(audience: string): string {
  return AUDIENCE_LABELS[audience] ?? audience;
}

function breadcrumbSchema(items: ReadonlyArray<{ href: string; label: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${EVENT_ORIGIN}${item.href}`,
    })),
  };
}

function faqSchema(items: readonly EventLandingFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** Modelo del hub: qué tipos de evento existen y cuántos municipios hay cubiertos. */
export function buildHubModel(): EventLandingModel {
  const breakdown = getEventFamilyBreakdown();
  const breadcrumbs = [{ href: '/eventos', label: 'Eventos' }];

  const faq: EventLandingFaq[] = [
    {
      question: '¿Cuántos tipos de evento cubre el catálogo?',
      answer: `El catálogo declara ${EVENT_INTENT_COUNT} tipologías de evento en ${EVENT_FAMILIES.length} familias. Además se publica una página por provincia (52) y por municipio (${SPAIN_MUNICIPALITY_COUNT} municipios con provincia resuelta).`,
    },
    {
      question: '¿Cómo se calcula el precio de un evento?',
      answer: `La tarifa base del solista es ${EVENT_SSOT_COPY.basePrice}. La logística se suma a ${EVENT_SSOT_COPY.eurPerKm}/km a partir del km ${EVENT_SSOT_COPY.exemptKm}. El depósito de ${EVENT_SSOT_COPY.deposit} se descuenta íntegro del total del evento.`,
    },
    {
      question: '¿Qué significa que el depósito sea deducible?',
      answer: `Que no es un pago a fondo perdido: los ${EVENT_SSOT_COPY.deposit} se restan íntegros de la liquidación final del evento contratado. Las condiciones de cancelación se entregan por escrito antes de firmar.`,
    },
  ];

  return {
    eyebrow: 'Catálogo de eventos',
    title: 'Eventos y música en directo por tipo de evento',
    lede: `${EVENT_INTENT_COUNT} tipologías de evento, 52 provincias y ${SPAIN_MUNICIPALITY_COUNT} municipios con página propia. Cada ficha declara contexto acústico, rider y precio calculado desde el SSOT.`,
    breadcrumbs,
    facts: [
      { label: 'Tipologías de evento', value: String(EVENT_INTENT_COUNT) },
      { label: 'Familias', value: String(EVENT_FAMILIES.length) },
      { label: 'Municipios cubiertos', value: String(SPAIN_MUNICIPALITY_COUNT) },
      { label: 'Tarifa base solista', value: EVENT_SSOT_COPY.basePrice },
      { label: 'Depósito deducible', value: EVENT_SSOT_COPY.deposit },
    ],
    sections: [
      {
        title: 'Qué cubre el catálogo',
        body: [
          'Cada familia agrupa tipologías con el mismo comprador, el mismo tipo de recinto y el mismo rider. No es una lista de palabras clave: es la taxonomía que decide qué página existe y con qué datos.',
        ],
        bullets: breakdown.map(
          (entry) => `${entry.label}: ${entry.intents} tipologías (${entry.tier1} de demanda alta)`
        ),
      },
    ],
    faq,
    links: [
      ...EVENT_FAMILIES.map((family) => ({
        href: `/eventos/${family.id}`,
        label: family.label,
        hint: family.buyerRole,
      })),
      {
        href: '/reservar/solista',
        label: 'Agenda y disponibilidad real',
        hint: 'Calendario con bloqueo de fecha y depósito deducible',
      },
    ],
    whatsappUrl: buildWhatsappUrl('Hola, necesito presupuesto para un evento.'),
    ctaLabel: 'Comprobar disponibilidad',
    canonicalPath: '/eventos',
    structuredData: [breadcrumbSchema(breadcrumbs), faqSchema(faq)],
    indexable: true,
  };
}

/** Modelo de familia: tipologías, comprador y rider de los contextos que agrupa. */
export function buildFamilyModel(family: EventFamily): EventLandingModel {
  const intents = getIntentsByFamily(family.id);
  const tierOne = intents.filter((intent) => intent.demandTier === 1);
  const contexts = Array.from(new Set(intents.map((intent) => intent.context)));
  const breadcrumbs = [
    { href: '/eventos', label: 'Eventos' },
    { href: `/eventos/${family.id}`, label: family.label },
  ];

  const faq: EventLandingFaq[] = [
    {
      question: `¿Cuántas tipologías de ${family.label.toLowerCase()} hay publicadas?`,
      answer: `${intents.length} tipologías, de las cuales ${tierOne.length} son de demanda alta. Cada una tiene ficha propia y se replica por las 52 provincias.`,
    },
    {
      question: '¿El precio cambia según el tipo de evento?',
      answer: `La tarifa base del solista es ${EVENT_SSOT_COPY.basePrice} y no cambia por el nombre del evento. Lo que cambia es el rider técnico (equipo, potencia y horas) y la logística: ${EVENT_SSOT_COPY.eurPerKm}/km a partir del km ${EVENT_SSOT_COPY.exemptKm}.`,
    },
    {
      question: '¿Qué documentación se entrega antes de firmar?',
      answer: 'Memoria técnica con rider acústico y de equipo, presupuesto con impuestos desglosados y condiciones de cancelación por escrito. En B2G se añade pliego y seguro de responsabilidad civil.',
    },
  ];

  return {
    eyebrow: `Familia de evento · ${family.label}`,
    title: `${family.label}: tipologías, rider y precio por provincia`,
    lede: family.narrative,
    breadcrumbs,
    facts: [
      { label: 'Tipologías', value: String(intents.length) },
      { label: 'Demanda alta', value: String(tierOne.length) },
      { label: 'Contextos acústicos', value: String(contexts.length) },
      { label: 'Comprador', value: family.buyerRole },
      { label: 'Tarifa base', value: EVENT_SSOT_COPY.basePrice },
    ],
    sections: [
      {
        title: 'Quién contrata y para qué',
        body: [family.narrative, `Comprador habitual: ${family.buyerRole}.`],
        bullets: tierOne.slice(0, 12).map((intent) => intent.label),
      },
      {
        title: 'Rider por contexto acústico',
        body: [
          'La presión sonora no se elige por gusto: la fija el recinto y la ordenanza. Cada contexto tiene un rango de referencia y un medio técnico de control.',
        ],
        bullets: contexts.map((context) => {
          const profile = getAcousticProfile(context);
          return `${profile.label}: ${profile.minDb}-${profile.maxDb} dBA · ${profile.control}`;
        }),
      },
    ],
    faq,
    links: [
      ...tierOne.slice(0, 10).map((intent) => ({
        href: `/eventos/${family.id}/${intent.slug}`,
        label: intent.label,
        hint: getAudienceLabel(intent.audience),
      })),
      { href: '/eventos', label: 'Todas las familias', hint: 'Catálogo completo' },
    ],
    whatsappUrl: buildWhatsappUrl(`Hola, necesito presupuesto para ${family.label.toLowerCase()}.`),
    ctaLabel: 'Comprobar disponibilidad',
    canonicalPath: `/eventos/${family.id}`,
    structuredData: [
      breadcrumbSchema(breadcrumbs),
      faqSchema(faq),
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: family.label,
        description: family.narrative,
        url: `${EVENT_ORIGIN}/eventos/${family.id}`,
        isPartOf: { '@type': 'WebSite', url: EVENT_ORIGIN, name: 'Productora EAR' },
      },
    ],
    indexable: true,
  };
}

/** Modelo de intención: qué se contrata, con qué rider y en qué provincias. */
export function buildIntentModel(intent: EventIntent): EventLandingModel {
  const family = EVENT_FAMILY_BY_ID[intent.family];
  const profile = getAcousticProfile(intent.context);
  const serviceLabels = intent.services.map(getServiceLabel);
  const provinceSlugs = getProvincesByMunicipalityDensity().slice(0, 12);
  const breadcrumbs = [
    { href: '/eventos', label: 'Eventos' },
    { href: `/eventos/${family.id}`, label: family.label },
    { href: `/eventos/${family.id}/${intent.slug}`, label: intent.label },
  ];

  const faq: EventLandingFaq[] = [
    {
      question: `¿Cuánto cuesta ${intent.label.toLowerCase()}?`,
      answer: `La tarifa base del solista es ${EVENT_SSOT_COPY.basePrice} y la logística se calcula a ${EVENT_SSOT_COPY.eurPerKm}/km a partir del km ${EVENT_SSOT_COPY.exemptKm}. El importe final depende de la distancia real al recinto, del rider técnico y de las horas de servicio.`,
    },
    {
      question: `¿Qué rider técnico aplica a ${intent.label.toLowerCase()}?`,
      answer: `Contexto acústico: ${profile.label}. Rango de referencia ${profile.minDb}-${profile.maxDb} dBA. Control exigido: ${profile.control}. Base de cálculo del sistema: ${EVENT_SSOT_COPY.wattsPerPax} W por asistente.`,
    },
    {
      question: '¿Se puede contratar en cualquier provincia?',
      answer: 'Sí: la ficha existe por las 52 provincias y el precio de cada una se calcula con su distancia real. Los municipios con página propia se enlazan desde la ficha provincial.',
    },
  ];

  return {
    eyebrow: `Tipología de evento · ${family.label}`,
    title: `${intent.label}: rider, precio y contratación`,
    lede: `${intent.label} para ${getAudienceLabel(intent.audience)}. Contexto ${profile.label.toLowerCase()}, ${profile.minDb}-${profile.maxDb} dBA y temporada de ${getSeasonLabel(intent.season)}.`,
    breadcrumbs,
    facts: [
      { label: 'Familia', value: family.label },
      { label: 'Comprador', value: family.buyerRole },
      { label: 'Contexto acústico', value: profile.label },
      { label: 'Rango de referencia', value: `${profile.minDb}-${profile.maxDb} dBA` },
      { label: 'Tarifa base', value: EVENT_SSOT_COPY.basePrice },
      { label: 'Depósito deducible', value: EVENT_SSOT_COPY.deposit },
    ],
    sections: [
      {
        title: 'Qué se contrata',
        body: [
          `Servicios que se combinan en esta tipología, según necesidad del recinto y del horario. Temporada de referencia: ${getSeasonLabel(intent.season)}.`,
        ],
        bullets: serviceLabels,
      },
      {
        title: `Rider acústico · ${profile.label}`,
        body: [profile.note],
        bullets: [
          `Rango de referencia: ${profile.minDb}-${profile.maxDb} dBA`,
          `Control: ${profile.control}`,
          `Base de cálculo: ${EVENT_SSOT_COPY.wattsPerPax} W/pax`,
          `Límite de salud pública general: < ${EVENT_SSOT_COPY.splLimit} dB SPL`,
        ],
      },
      {
        title: 'Precio y compromiso',
        body: [
          `Tarifa base ${EVENT_SSOT_COPY.basePrice}. Logística ${EVENT_SSOT_COPY.eurPerKm}/km a partir del km ${EVENT_SSOT_COPY.exemptKm}, más ${EVENT_SSOT_COPY.hotelSupplement} de suplemento hotelero cuando la distancia supera los 200 km o el cierre pasa de las 3:00.`,
          `El depósito de ${EVENT_SSOT_COPY.deposit} bloquea la fecha y se descuenta íntegro del total.`,
        ],
        bullets: [
          'Presupuesto con impuestos desglosados antes de pagar',
          'Memoria técnica y rider por escrito',
          'Condiciones de cancelación entregadas antes de la firma',
        ],
      },
    ],
    faq,
    links: [
      ...provinceSlugs.map((provinceSlug) => ({
        href: `/eventos/${family.id}/${intent.slug}/${provinceSlug}`,
        label: getProvinceEntity(provinceSlug)?.name ?? provinceSlug,
        hint: 'Precio y rider por provincia',
      })),
      { href: `/eventos/${family.id}`, label: family.label, hint: 'Todas las tipologías' },
    ],
    whatsappUrl: buildWhatsappUrl(`Hola, necesito presupuesto para ${intent.label.toLowerCase()}.`),
    ctaLabel: 'Comprobar disponibilidad',
    canonicalPath: `/eventos/${family.id}/${intent.slug}`,
    structuredData: [
      breadcrumbSchema(breadcrumbs),
      faqSchema(faq),
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: intent.label,
        serviceType: intent.label,
        provider: { '@type': 'Organization', name: 'Productora EAR', url: EVENT_ORIGIN },
        areaServed: { '@type': 'Country', name: 'España' },
        offers: {
          '@type': 'Offer',
          price: EVENT_SSOT_COPY.basePrice.replace(/[^0-9,]/g, '').replace(',', '.'),
          priceCurrency: 'EUR',
          url: `${EVENT_ORIGIN}/eventos/${family.id}/${intent.slug}`,
        },
      },
    ],
    indexable: true,
  };
}

/** Modelo de intención × provincia: precio con distancia real y rider por contexto. */
export function buildIntentProvinceModel(
  intent: EventIntent,
  provinceSlug: string
): EventLandingModel | null {
  const province = getProvinceEntity(provinceSlug);
  if (!province) return null;

  const family = EVENT_FAMILY_BY_ID[intent.family];
  const profile = getAcousticProfile(intent.context);
  const logistics = computeLogisticsEur(province.distanceFromHubKm);
  const fromPrice = computeFromPriceEur(province.distanceFromHubKm);
  const municipalities = getMunicipalitiesByProvince(province.slug).slice(0, 12);
  const breadcrumbs = [
    { href: '/eventos', label: 'Eventos' },
    { href: `/eventos/${family.id}`, label: family.label },
    { href: `/eventos/${family.id}/${intent.slug}`, label: intent.label },
    {
      href: `/eventos/${family.id}/${intent.slug}/${province.slug}`,
      label: province.name,
    },
  ];

  const faq: EventLandingFaq[] = [
    {
      question: `¿Cuánto cuesta ${intent.label.toLowerCase()} en ${province.name}?`,
      answer: `Tarifa base ${EVENT_SSOT_COPY.basePrice} más ${formatEur(logistics)} de logística (${province.distanceFromHubKm} km desde el hub, con los primeros ${EVENT_SSOT_COPY.exemptKm} km exentos): desde ${formatEur(fromPrice)}.`,
    },
    {
      question: `¿Hay desplazamiento a ${province.name} y a sus municipios?`,
      answer: `Sí. El precio se calcula desde la distancia real al recinto, no desde una tarifa plana. Si el cierre pasa de las 3:00 o el trayecto supera los 200 km se añaden ${EVENT_SSOT_COPY.hotelSupplement} de suplemento hotelero.`,
    },
    {
      question: `¿Qué rider se aplica en ${province.name}?`,
      answer: `${profile.label}: ${profile.minDb}-${profile.maxDb} dBA con ${profile.control.toLowerCase()}. En B2G el importe se mantiene por debajo del techo de contrato menor (${EVENT_SSOT_COPY.lcspSafeCeiling} con ajuste preventivo sobre ${EVENT_SSOT_COPY.lcspCeiling}).`,
    },
  ];

  return {
    eyebrow: `${intent.label} · ${province.name}`,
    title: `${intent.label} en ${province.name}: precio, rider y municipios`,
    lede: `${intent.label} en ${province.name} desde ${formatEur(fromPrice)}, con ${formatEur(logistics)} de logística calculada sobre ${province.distanceFromHubKm} km reales y rider de ${profile.minDb}-${profile.maxDb} dBA.`,
    breadcrumbs,
    facts: [
      { label: 'Provincia', value: province.name },
      { label: 'Capital', value: province.capital },
      { label: 'Comunidad', value: province.community },
      { label: 'Distancia al hub', value: `${province.distanceFromHubKm} km` },
      { label: 'Logística', value: formatEur(logistics) },
      { label: 'Desde', value: formatEur(fromPrice) },
      { label: 'Depósito deducible', value: EVENT_SSOT_COPY.deposit },
    ],
    sections: [
      {
        title: `Logística hasta ${province.name}`,
        body: [
          `El trayecto de referencia son ${province.distanceFromHubKm} km. Se facturan ${EVENT_SSOT_COPY.eurPerKm}/km a partir del km ${EVENT_SSOT_COPY.exemptKm}, lo que da ${formatEur(logistics)}.`,
          `Si el evento cierra después de las 3:00 o la distancia supera los 200 km, se suma ${EVENT_SSOT_COPY.hotelSupplement} de alojamiento del equipo técnico.`,
        ],
        bullets: [
          'Precio cerrado antes de pagar, con impuestos desglosados',
          'Montaje y prueba de sonido incluidos en el plan de trabajo',
          'Un solo interlocutor para sonido, música e iluminación',
        ],
      },
      {
        title: `Rider acústico en ${province.name}`,
        body: [profile.note],
        bullets: [
          `Contexto: ${profile.label}`,
          `Rango de referencia: ${profile.minDb}-${profile.maxDb} dBA`,
          `Control: ${profile.control}`,
          `Sistema calculado a ${EVENT_SSOT_COPY.wattsPerPax} W/pax`,
        ],
      },
    ],
    faq,
    links: [
      ...municipalities.map((municipality) => ({
        href: `/eventos/local/${municipality.provinceSlug}/${municipality.slug}`,
        label: municipality.name,
        hint: 'Ficha municipal',
      })),
      { href: `/eventos/${family.id}/${intent.slug}`, label: intent.label, hint: 'Todas las provincias' },
    ],
    whatsappUrl: buildWhatsappUrl(
      `Hola, necesito presupuesto de ${intent.label.toLowerCase()} en ${province.name}.`
    ),
    ctaLabel: 'Comprobar disponibilidad',
    canonicalPath: `/eventos/${family.id}/${intent.slug}/${province.slug}`,
    structuredData: [
      breadcrumbSchema(breadcrumbs),
      faqSchema(faq),
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `${intent.label} en ${province.name}`,
        provider: { '@type': 'Organization', name: 'Productora EAR', url: EVENT_ORIGIN },
        areaServed: { '@type': 'AdministrativeArea', name: province.name },
        offers: {
          '@type': 'Offer',
          price: (Math.round(fromPrice * 100) / 100).toFixed(2),
          priceCurrency: 'EUR',
          url: `${EVENT_ORIGIN}/eventos/${family.id}/${intent.slug}/${province.slug}`,
        },
      },
    ],
    indexable: true,
  };
}

/**
 * Modelo del índice municipal (`/eventos/cobertura-municipal`).
 *
 * Por qué esta ruta y no `/eventos/municipales`: esa URL ya es una landing B2G
 * viva (fiestas patronales, Art. 118 LCSP) y sustituirla habría destruido una
 * página comercial con tráfico. El índice municipal es otra intención: enseñar
 * el universo de 8.131 fichas y servir de ruta de rastreo hacia ellas.
 */
export function buildMunicipalIndexModel(): EventLandingModel {
  const provinces = getProvinceCoverage();
  const breadcrumbs = [
    { href: '/eventos', label: 'Eventos' },
    { href: '/eventos/cobertura-municipal', label: 'Cobertura municipal' },
  ];

  const faq: EventLandingFaq[] = [
    {
      question: '¿Cuántos municipios tienen página propia?',
      answer: `El dataset INE trae ${MUNICIPALITY_COVERAGE_STATS.rawRows} filas. Tras validar slug, provincia canónica y duplicados quedan ${SPAIN_MUNICIPALITY_COUNT} fichas publicadas en ${provinces.length} provincias. Las filas descartadas se auditan y se reportan, no se maquillan.`,
    },
    {
      question: '¿Por qué se descarta alguna fila del dataset?',
      answer: `Se descartan ${MUNICIPALITY_COVERAGE_STATS.excludedInvalidSlug} slugs no RFC 3986, ${MUNICIPALITY_COVERAGE_STATS.excludedUnresolvedProvince} filas con provincia no canónica y ${MUNICIPALITY_COVERAGE_STATS.excludedDuplicatePath} duplicados de (provincia, municipio). Un municipio sin URL válida no se publica: mejor ausente que roto.`,
    },
    {
      question: '¿Cada municipio tiene precio propio?',
      answer: `El precio se calcula con la distancia real de su provincia al hub: tarifa base ${EVENT_SSOT_COPY.basePrice} más ${EVENT_SSOT_COPY.eurPerKm}/km a partir del km ${EVENT_SSOT_COPY.exemptKm}. No hay tarifas inventadas por municipio.`,
    },
  ];

  return {
    eyebrow: 'Cobertura municipal',
    title: 'Música y sonido para eventos en los municipios de España',
    lede: `${SPAIN_MUNICIPALITY_COUNT} municipios con página propia sobre ${MUNICIPALITY_COVERAGE_STATS.rawRows} filas del dataset INE, repartidos en 52 provincias. Cada ficha declara código INE, provincia, comunidad y precio calculado.`,
    breadcrumbs,
    facts: [
      { label: 'Municipios publicados', value: String(SPAIN_MUNICIPALITY_COUNT) },
      { label: 'Filas del dataset', value: String(MUNICIPALITY_COVERAGE_STATS.rawRows) },
      { label: 'Provincias', value: String(provinces.length) },
      { label: 'Colisiones INE', value: String(MUNICIPALITY_COVERAGE_STATS.ineCodeCollisions) },
      { label: 'Tarifa base', value: EVENT_SSOT_COPY.basePrice },
    ],
    sections: [
      {
        title: 'Distribución por provincia',
        body: [
          'El reparto no es uniforme: hay provincias con más de 200 municipios y otras con menos de 30. Se publica la cifra real de cada una.',
        ],
        bullets: provinces.map((province) => `${province.provinceName}: ${province.municipalities} municipios`),
      },
    ],
    faq,
    links: [
      ...provinces.flatMap((province) =>
        getMunicipalitiesByProvince(province.provinceSlug)
          .slice(0, 3)
          .map((municipality) => ({
            href: `/eventos/local/${municipality.provinceSlug}/${municipality.slug}`,
            label: municipality.name,
            hint: province.provinceName,
          }))
      ),
      { href: '/eventos', label: 'Catálogo por tipo de evento', hint: '300 tipologías' },
    ],
    whatsappUrl: buildWhatsappUrl('Hola, necesito presupuesto para un evento en mi municipio.'),
    ctaLabel: 'Comprobar disponibilidad',
    canonicalPath: '/eventos/cobertura-municipal',
    structuredData: [
      breadcrumbSchema(breadcrumbs),
      faqSchema(faq),
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Cobertura municipal de eventos',
        url: `${EVENT_ORIGIN}/eventos/cobertura-municipal`,
        isPartOf: { '@type': 'WebSite', url: EVENT_ORIGIN, name: 'Productora EAR' },
      },
    ],
    indexable: true,
  };
}

export function buildMunicipalityModel(
  municipality: SpainMunicipality
): EventLandingModel | null {
  const province = getProvinceEntity(municipality.provinceSlug);
  if (!province) return null;

  const logistics = computeLogisticsEur(province.distanceFromHubKm);
  const fromPrice = computeFromPriceEur(province.distanceFromHubKm);
  const profile = getAcousticProfile('finca');
  const topIntents = getIntentsByDemandTier(1).slice(0, 10);
  const siblings = getMunicipalitiesByProvince(municipality.provinceSlug)
    .filter((sibling) => sibling.slug !== municipality.slug)
    .slice(0, 10);

  const breadcrumbs = [
    { href: '/eventos', label: 'Eventos' },
    {
      href: `/eventos/local/${municipality.provinceSlug}/${municipality.slug}`,
      label: municipality.name,
    },
  ];

  const faq: EventLandingFaq[] = [
    {
      question: `¿Cuánto cuesta contratar música en ${municipality.name}?`,
      answer: `Desde ${formatEur(fromPrice)}: tarifa base ${EVENT_SSOT_COPY.basePrice} más ${formatEur(logistics)} de logística sobre ${province.distanceFromHubKm} km (primeros ${EVENT_SSOT_COPY.exemptKm} km exentos) hasta ${province.name}.`,
    },
    {
      question: `¿Qué tipo de eventos se cubren en ${municipality.name}?`,
      answer: `Las ${EVENT_INTENT_COUNT} tipologías del catálogo, agrupadas en 8 familias: bodas y celebraciones, empresas, administración local, ferias, protocolo, hostelería, actos sociales y eventos de comunidad.`,
    },
    {
      question: '¿Cómo se bloquea la fecha?',
      answer: `Con el depósito de ${EVENT_SSOT_COPY.deposit}, que bloquea la fecha y se descuenta íntegro del total del evento. Antes de pagar se entrega presupuesto desglosado y rider por escrito.`,
    },
  ];

  return {
    eyebrow: `Cobertura municipal · ${province.name}`,
    title: `Eventos y música en directo en ${municipality.name} (${province.name})`,
    lede: `${municipality.name}, ${province.name} (${municipality.community}). Código INE ${municipality.ineCode}. Música, sonido e iluminación desde ${formatEur(fromPrice)}, con rider de ${profile.minDb}-${profile.maxDb} dBA en finca o jardín.`,
    breadcrumbs,
    facts: [
      { label: 'Municipio', value: municipality.name },
      { label: 'Código INE', value: municipality.ineCode },
      { label: 'Provincia', value: province.name },
      { label: 'Comunidad', value: municipality.community },
      { label: 'Distancia al hub', value: `${province.distanceFromHubKm} km` },
      { label: 'Desde', value: formatEur(fromPrice) },
      { label: 'Depósito deducible', value: EVENT_SSOT_COPY.deposit },
    ],
    sections: [
      {
        title: `Qué se puede contratar en ${municipality.name}`,
        body: [
          `El catálogo completo se organiza en 8 familias y ${EVENT_INTENT_COUNT} tipologías. En ${municipality.name} se aplica el mismo rider y el mismo precio calculado que en el resto de ${province.name}.`,
        ],
        bullets: topIntents.map(
          (intent) => `${intent.label} · ${getAudienceLabel(intent.audience)}`
        ),
      },
      {
        title: 'Precio y logística',
        body: [
          `La referencia es de ${province.distanceFromHubKm} km hasta ${municipality.name}. Se facturan ${EVENT_SSOT_COPY.eurPerKm}/km a partir del km ${EVENT_SSOT_COPY.exemptKm}: ${formatEur(logistics)}.`,
          `Suplemento hotelero de ${EVENT_SSOT_COPY.hotelSupplement} cuando el cierre pasa de las 3:00 o el trayecto supera los 200 km.`,
        ],
        bullets: [
          'Importe cerrado antes de pagar, con impuestos desglosados',
          'Depósito deducible en su totalidad',
          'Condiciones de cancelación por escrito',
        ],
      },
      {
        title: 'Rider y normativa acústica',
        body: [profile.note],
        bullets: [
          `Exteriores en finca: ${profile.minDb}-${profile.maxDb} dBA`,
          'Interiores de salón: 80-85 dBA',
          `Límite de salud pública general: < ${EVENT_SSOT_COPY.splLimit} dB SPL`,
          `Sistema calculado a ${EVENT_SSOT_COPY.wattsPerPax} W/pax`,
        ],
      },
    ],
    faq,
    links: [
      ...topIntents.map((intent) => ({
        href: `/eventos/${intent.family}/${intent.slug}/${municipality.provinceSlug}`,
        label: intent.label,
        hint: `en ${province.name}`,
      })),
      ...siblings.map((sibling) => ({
        href: `/eventos/local/${sibling.provinceSlug}/${sibling.slug}`,
        label: sibling.name,
        hint: 'Municipio cercano',
      })),
    ],
    whatsappUrl: buildWhatsappUrl(
      `Hola, necesito presupuesto para un evento en ${municipality.name} (${province.name}).`
    ),
    ctaLabel: 'Comprobar disponibilidad',
    canonicalPath: `/eventos/local/${municipality.provinceSlug}/${municipality.slug}`,
    structuredData: [
      breadcrumbSchema(breadcrumbs),
      faqSchema(faq),
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `Música y sonido para eventos en ${municipality.name}`,
        provider: { '@type': 'Organization', name: 'Productora EAR', url: EVENT_ORIGIN },
        areaServed: {
          '@type': 'City',
          name: municipality.name,
          containedInPlace: { '@type': 'AdministrativeArea', name: province.name },
        },
        offers: {
          '@type': 'Offer',
          price: (Math.round(fromPrice * 100) / 100).toFixed(2),
          priceCurrency: 'EUR',
          url: `${EVENT_ORIGIN}/eventos/local/${municipality.provinceSlug}/${municipality.slug}`,
        },
      },
    ],
    indexable: true,
  };
}





