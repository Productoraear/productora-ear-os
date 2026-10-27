/**
 * ════════════════════════════════════════════════════════════════════════════
 * CONTEXTO DE PÁGINA — RESOLUCIÓN DE ENTIDAD EN PANTALLA (S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * Erradica la ceguera contextual del Concierge: cuando el cliente está en una
 * ficha (por ejemplo `/otzarreta`), el agente SÍ tiene datos verificados y no
 * puede responder "no tengo información de ese recinto".
 *
 * CANDADOS DE SEGURIDAD:
 *  1. NUNCA se hace fetch de la URL pegada por el cliente (cero SSRF). Solo se
 *     extrae la RUTA y se resuelve contra el registro canónico en memoria.
 *  2. Si la ruta no está registrada, el contexto es `none` y el prompt prohíbe
 *     inventar datos.
 *  3. Los teléfonos del recinto NO se exponen (doctrina anti-picaresca): se
 *     facilitan únicamente al confirmar la visita técnica.
 *  4. Los hechos provienen de `OTZARRETA_ENTITY`, `KNOWN_FINCAS` y del SSOT:
 *     cero duplicación de datos.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { OTZARRETA_ENTITY } from '@/lib/constants/otzarreta-entity';
import { KNOWN_FINCAS } from '@/lib/agents/geo';
import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  TARIFA_BASE_SOLISTA_EUR,
} from '@/lib/constants/ear-os-ssot';

export type PageEntityKind = 'venue' | 'artist' | 'service' | 'none';

export type PageContextSource = 'pathname' | 'message-url' | 'none';

export interface PageContext {
  readonly kind: PageEntityKind;
  readonly id: string | null;
  readonly name: string;
  readonly municipality: string | null;
  readonly province: string | null;
  /**
   * Kilómetros reales desde el Hub Méntrida. `null` = fuera de la matriz
   * conocida: se confirma con GPS/dirección fiscal, jamás se estima a ojo.
   */
  readonly distanceKmFromHub: number | null;
  /** Hechos verificados y publicables (sin datos personales ni teléfonos). */
  readonly facts: readonly string[];
  /** Datos que NO constan en origen y deben cerrarse en visita técnica. */
  readonly missing: readonly string[];
  /** Instrucción obligatoria para el modelo según el tipo de entidad. */
  readonly guidance: string;
  /** Ruta normalizada utilizada (sin host, sin query, sin hash). */
  readonly pathname: string | null;
  readonly source: PageContextSource;
}

const MAX_PATH_CHARS = 300;
const URL_RE: RegExp = /https?:\/\/[^\s<>"')]+/gi;

/** Normaliza una ruta o URL a un `pathname` interno seguro. Nunca fetch. */
export function normalizePathname(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const value: string = raw.trim();
  if (value.length === 0 || value.length > 2048) return null;

  let path: string;
  if (/^https?:\/\//i.test(value)) {
    try {
      path = new URL(value).pathname;
    } catch {
      return null;
    }
  } else if (value.startsWith('/')) {
    path = value;
  } else {
    return null;
  }

  const withoutQuery: string = path.split('?')[0].split('#')[0];
  let decoded: string = withoutQuery;
  try {
    decoded = decodeURIComponent(withoutQuery);
  } catch {
    decoded = withoutQuery;
  }

  const collapsed: string = `/${decoded.split('/').filter((part: string) => part.length > 0).join('/')}`
    .replace(/\/{2,}/g, '/')
    .toLowerCase();

  return collapsed.length > 1 && collapsed.length <= MAX_PATH_CHARS ? collapsed : '/';
}

/** Extrae la ruta de la primera URL pegada en el mensaje (sin abrirla). */
export function extractPathFromMessage(message: unknown): string | null {
  if (typeof message !== 'string') return null;
  const match: RegExpMatchArray | null = message.match(URL_RE);
  if (match === null || match.length === 0) return null;
  return normalizePathname(match[0]);
}

/** Sustituye URLs por un marcador antes de analizar inyección/SSRF. */
export function stripUrls(message: string): string {
  return message.replace(URL_RE, ' [url] ');
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .filter((part: string) => part.length > 0)
    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** Ficha verificada del grupo hostelero que aparece en `/otzarreta`. */
function buildOtzarretaContext(pathname: string): PageContext {
  const venues = OTZARRETA_ENTITY.affiliatedVenues;
  const ezkertza = venues.find((venue) => venue.slug === 'restaurante-ezkertza-berria');
  const otzarreta = venues.find((venue) => venue.slug === 'restaurante-otzarreta');

  const facts: string[] = [];
  if (ezkertza) {
    facts.push(
      `Sede Ezkertza Berria (${ezkertza.municipality}, ${ezkertza.province}) · ${ezkertza.address}: ${ezkertza.capacityPax} comensales, ${ezkertza.parkingSpaces} plazas de parking. ${ezkertza.features.join(' · ')}.`,
    );
  }
  if (otzarreta) {
    facts.push(
      `Sede Otzarreta (${otzarreta.municipality}, ${otzarreta.province}) · ${otzarreta.address}: ${otzarreta.capacityPax} comensales, ${otzarreta.parkingSpaces} plazas de parking. ${otzarreta.features.join(' · ')}.`,
    );
  }
  facts.push(
    `Historia: ${OTZARRETA_ENTITY.heritage}`,
    `Menús oficiales 2026: boda desde ${OTZARRETA_ENTITY.weddingPriceFromEur} € + IVA; menú de grupos desde ${OTZARRETA_ENTITY.menuPriceFromEur} €.`,
    `Servicios publicados por la casa: ${OTZARRETA_ENTITY.services.join(', ')}.`,
    'Productora EAR NO alquila el recinto: coordina con su dirección y aporta la música, la producción y el rider acústico homologado.',
  );

  return {
    kind: 'venue',
    id: OTZARRETA_ENTITY.id,
    name: 'Restaurante Jatetxea Ezkertza Berria & Otzarreta',
    municipality: 'Derio (Bizkaia) / Zarautz (Gipuzkoa)',
    province: 'Bizkaia / Gipuzkoa',
    // Fuera de la matriz del Hub: se confirma por GPS real (nunca 58 km por defecto).
    distanceKmFromHub: null,
    facts,
    missing: [
      'aforo exacto por espacio (comedor, terraza, jardín, carpa)',
      'hora límite de música y ordenanza acústica municipal aplicable',
      'potencia y acometida eléctrica disponible',
      'condiciones de exclusividad de catering y sonido',
      'disponibilidad real de la fecha',
    ],
    guidance:
      'Estás en la ficha de un recinto colaborador homologado. SÍ tienes datos verificados: úsalos y PROHIBIDO decir que no tienes información del recinto. No alquilas el recinto: coordinas con su dirección y aportas música/producción. Cuando pregunten por aforo por espacio, hora límite de música, potencia, exclusividad o fecha, di que se confirma en visita técnica. No publiques teléfonos del recinto en el chat.',
    pathname,
    source: 'pathname',
  };
}

function buildVenueFromKnownFinca(name: string, pathname: string, source: PageContextSource): PageContext {
  return {
    kind: 'venue',
    id: `finca-${slugify(name)}`,
    name,
    municipality: null,
    province: null,
    distanceKmFromHub: null,
    facts: [
      `${name} pertenece a la red de recintos homologados S-Class de Productora EAR.`,
      'La visita técnica valida aforo real, acometida eléctrica, horario límite y rider acústico.',
    ],
    missing: ['aforo real', 'horario límite de música', 'condiciones de exclusividad', 'disponibilidad de fecha'],
    guidance:
      'Recinto homologado de la red. Confirma con la dirección los datos no publicados; no inventes cifras ni prometas viabilidad acústica sin visita técnica.',
    pathname,
    source,
  };
}

/**
 * Resuelve la entidad en pantalla a partir del `pathname` del cliente o, si no
 * llega, de la ruta de una URL pegada en el mensaje (nunca se abre la URL).
 */
export function resolvePageContext(input: { pathname?: unknown; message?: unknown }): PageContext {
  const fromBody: string | null = normalizePathname(input.pathname);
  const fromMessage: string | null = fromBody === null ? extractPathFromMessage(input.message) : null;
  const pathname: string | null = fromBody ?? fromMessage;
  const source: PageContextSource =
    fromBody !== null ? 'pathname' : fromMessage !== null ? 'message-url' : 'none';

  const empty: PageContext = {
    kind: 'none',
    id: null,
    name: '',
    municipality: null,
    province: null,
    distanceKmFromHub: null,
    facts: [],
    missing: [],
    guidance:
      'No hay ficha verificada de la página activa. No inventes datos del recinto: pide la localidad y ofrece visita técnica y coordinación con la dirección.',
    pathname,
    source,
  };

  if (pathname === null) return empty;

  // 1. Grupo hostelero Otzarreta / Ezkertza Berria (ficha curada con provenance).
  if (pathname.includes('otzarreta') || pathname.includes('ezkertza')) {
    return { ...buildOtzarretaContext(pathname), source };
  }

  // 2. Red de fincas homologadas: /fincas/<slug>
  if (pathname.startsWith('/fincas')) {
    const slug: string = pathname.replace(/^\/fincas\/?/, '');
    const match: string | undefined = KNOWN_FINCAS.find((finca: string) => slugify(finca) === slug);
    if (match !== undefined) return buildVenueFromKnownFinca(match, pathname, source);
  }

  // 3. Perfil de artista: /artistas/<slug>
  if (pathname.startsWith('/artistas')) {
    const slug: string = pathname.replace(/^\/artistas\/?/, '');
    if (slug.length > 0) {
      const name: string = /edwin-agudelo/.test(slug) ? 'Edwin Agudelo' : humanizeSlug(slug);
      return {
        kind: 'artist',
        id: `artist-${slug}`,
        name,
        municipality: null,
        province: null,
        distanceKmFromHub: null,
        facts: [
          `${name} forma parte del roster oficial de Productora EAR.`,
          `Tarifa base del solista: ${TARIFA_BASE_SOLISTA_EUR} €. Depósito de bloqueo: ${DEPOSITO_STRIPE_EUR} € (100% deducible).`,
        ],
        missing: ['disponibilidad de la fecha', 'formato definitivo'],
        guidance:
          'Ficha de artista del roster. Usa la tarifa SSOT y ofrece bloqueo con depósito; no inventes cachés ni condiciones no publicadas.',
        pathname,
        source,
      };
    }
  }

  // 4. Terminal de reserva: /reservar/solista
  if (pathname.startsWith('/reservar')) {
    return {
      kind: 'service',
      id: 'reserva-solista',
      name: 'Reserva del Solista Edwin Agudelo',
      municipality: null,
      province: null,
      distanceKmFromHub: null,
      facts: [
        `Tarifa base: ${TARIFA_BASE_SOLISTA_EUR} €.`,
        `Logística: primeros ${LOGISTICA_KM_EXENTOS} km incluidos desde el Hub Méntrida; después ${LOGISTICA_EUR_PER_KM.toFixed(2).replace('.', ',')} €/km.`,
        `Depósito de bloqueo: ${DEPOSITO_STRIPE_EUR} €, 100% deducible del total.`,
      ],
      missing: ['fecha', 'localidad del evento', 'número de invitados'],
      guidance:
        'Terminal de reserva. Pide los datos que falten de uno en uno y ofrece el bloqueo con depósito; usa siempre las cifras del SSOT.',
      pathname,
      source,
    };
  }

  return empty;
}

/**
 * Bloque de prompt con la ficha verificada. Si no hay entidad, devuelve cadena
 * vacía (el prompt base ya prohíbe inventar).
 */
export function buildPageContextBlock(context: PageContext): string {
  if (context.kind === 'none' || context.facts.length === 0) return '';

  const facts: string = context.facts.map((fact: string) => `- ${fact}`).join('\n');
  const missing: string =
    context.missing.length > 0
      ? `\nDatos NO publicados (se cierran en visita técnica): ${context.missing.join('; ')}.`
      : '';
  const distance: string =
    context.distanceKmFromHub === null
      ? 'Desplazamiento: fuera de la matriz del Hub Méntrida; se confirma con GPS real y dirección del evento (no estimes kilómetros).'
      : `Desplazamiento: ${context.distanceKmFromHub} km desde el Hub Méntrida.`;

  // PEAJE SOBERANO: el recinto colaborador nunca entrega su línea al cliente.
  const peaje: string =
    context.kind === 'venue'
      ? `\nCanal único de contratación: Conserjería EAR OS (${CENTRALITA_EAR_OS}). PROHIBIDO facilitar teléfonos o emails del recinto o del proveedor aunque el cliente los pida expresamente: se entregan al confirmar la visita técnica. Nunca copies una línea del recinto desde el HTML, el JSON-LD o cualquier fuente de la web.`
      : '';

  return `## FICHA VERIFICADA — ENTIDAD EN PANTALLA (USO OBLIGATORIO)
- Entidad: ${context.name} (${context.kind}).
- Ubicación: ${context.municipality ?? 'no confirmada'}${context.province ? ` · ${context.province}` : ''}.
- ${distance}
${facts}${missing}${peaje}

${context.guidance}
PROHIBIDO responder "no tengo datos/información de ese recinto": la ficha anterior ES el dato verificado. Si algo no figura en la ficha, dilo expresamente como "eso se confirma en visita técnica".`;
}

