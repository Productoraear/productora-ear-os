/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS · RESOLUTOR DE ALIAS LEGACY (REMEDIACION DE COBERTURA GSC)
 * ════════════════════════════════════════════════════════════════════════════
 * Google mantiene indexadas URLs historicas que hoy caian en 404 o quedaban
 * replegadas al escaparate por el dark-launch gate, perdiendo trafico organico
 * activo. Este modulo resuelve esas rutas a un destino canonico que se sirve
 * con 301 permanente, preservando los parametros del visitante (utm_*, ref...).
 *
 * DOCTRINA PONYTAIL: logica pura en TypeScript nativo, cero dependencias npm y
 * cero acceso a disco (el Edge Runtime de Next.js no puede leer `fs`). Es, por
 * tanto, importable tanto desde `src/middleware.ts` como desde un Server
 * Component.
 *
 * FUENTE DE VERDAD (medida en esta sesion, no inventada):
 *   · `.antigravity/reports/gsc_high_opportunity.json` → 39 URLs con impresiones
 *     reales en Search Console.
 *   · `public/data/providers/*.json` → 13.094 fichas reales; se verifico que
 *     NINGUN `prov-XXXX` de GSC tiene ficha, y que los 3 slugs con sufijo
 *     bodas.net SI la tienen (`finca-el-toro-madrid`, `jardins-ribes-madrid`,
 *     `sa-llapasseta-madrid`).
 *
 * INVARIANTE AF-5 / EP-3: cada destino de este mapa DEBE existir como ruta
 * certificada en disco. Ningun destino se fabrica ni se adivina.
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Alias exactos: pathname normalizado (minusculas, sin barra final) → destino
 * canonico. El destino puede incluir query (`/proveedores?q=...`), que se
 * fusiona con lo que traiga el visitante sin pisarse.
 */
export const LEGACY_ROUTE_ALIASES: Readonly<Record<string, string>> = Object.freeze({
  // — Checkout legado → embudo de reserva canonico (la query se preserva) —
  '/checkout/presupuesto': '/reservar',

  // — Fichas con sufijo legacy de bodas.net → slug semantico YA verificado —
  '/proveedores/finca-el-toro-consulta-disponibilidad-y-precios': '/proveedores/finca-el-toro-madrid',
  '/proveedores/jardins-ribes-consulta-disponibilidad-y-precios': '/proveedores/jardins-ribes-madrid',
  '/proveedores/sa-llapasseta-consulta-disponibilidad-y-precios': '/proveedores/sa-llapasseta-madrid',

  // — Slugs indexados SIN ficha en catalogo → busqueda asistida del directorio.
  //   Cero 404, cero invencion: el cliente aterriza en la superficie transaccional
  //   mas afin (fichas con BuyBox 100 EUR + WhatsApp +34 693 693 048).
  '/proveedores/regalos-ana-mari': '/proveedores?q=ana+mari+regalos',
  '/proveedores/sa-torre-de-vernissa': '/proveedores?q=torre+de+vernissa',
  '/proveedores/las-10-mejores-empresas-para-la-lista-de-boda-en-murcia': '/proveedores?q=lista+de+boda+murcia',
  // Guias de castillos para boda en Murcia → catalogo provincial de espacios.
  '/proveedores/los-10-mejores-castillos-para-boda-en-murcia': '/fincas/p/murcia',
});

/**
 * Mapa de ids opacos historicos (`prov-<id>`) → slug semantico canonico REAL.
 * GENERADO Y VERIFICADO contra `src/data/all_providers_database.json` (dataset
 * curado: 30/30 ids localizados) y CRUZADO con las consultas de Search Console
 * del informe GSC: `prov-636`→"alqueria balada" (90 imp), `prov-1013`→"bamboo
 * rent" (102 imp), `prov-2509`→"el vivar de la granja" (91 imp), `prov-4009`→
 * "jota fierro" (69 imp), `prov-4765`→`setroimagen-madrid` (citado ya en el
 * comentario de la propia ficha). Es estatico (cero `fs`) para poder servirse
 * desde el Edge Runtime con un 301 real.
 */
export const LEGACY_PROVIDER_ID_ALIASES: Readonly<Record<string, string>> = Object.freeze({
  // Alias reservado del paciente cero hostelero (v-32714) → ficha Otzarreta.
  '32714': '/otzarreta',
  '253': '/proveedores/vestidos-de-novia-de-a-bela-noiva-madrid',
  '636': '/proveedores/alqueria-balada-madrid',
  '849': '/proveedores/listas-de-boda-asturias-madrid',
  '896': '/proveedores/autocares-granero-madrid',
  '971': '/proveedores/listas-de-boda-badajoz-madrid',
  '1013': '/proveedores/bamboo-rent-madrid',
  '2059': '/proveedores/cortijo-molino-de-pavia-madrid',
  '2504': '/proveedores/el-sueno-del-camborio-madrid',
  '2509': '/proveedores/el-vivar-de-la-granja-madrid',
  '2673': '/proveedores/finca-almazara-madrid',
  '2704': '/proveedores/finca-del-canonigo-madrid',
  '2730': '/proveedores/finca-el-toro-madrid',
  '2738': '/proveedores/finca-fontaina-madrid',
  '2812': '/proveedores/finca-navafria-catering-las-barandas-madrid',
  '2824': '/proveedores/finca-salvago-madrid',
  '2825': '/proveedores/finca-san-damaso-la-hortelana-madrid',
  '3446': '/proveedores/vestidos-de-novia-de-houghton-madrid',
  '3530': '/proveedores/2-alianzas-madrid',
  '3713': '/proveedores/dehesa-bolanos-madrid',
  '3765': '/proveedores/el-taxi-ingles-en-madrid-3765',
  '3808': '/proveedores/finca-alubian-madrid',
  '3816': '/proveedores/finca-dona-carmen-madrid',
  '3977': '/proveedores/jardin-las-adelfas-madrid',
  '3980': '/proveedores/jardines-de-gaeleo-madrid',
  '4009': '/proveedores/jota-fierro-madrid',
  '4128': '/proveedores/la-quinta-de-carrascal-madrid',
  '4604': '/proveedores/puerto-niza-madrid',
  '4765': '/proveedores/setroimagen-madrid',
  '4875': '/proveedores/torre-villa-tea-madrid',
  '4915': '/proveedores/vegabodas-finca-villa-vera-madrid',
});

/**
 * Alias por prefijo para verticales en taller (dark launch). El vertical de
 * iluminacion DMX no esta certificado todavia: el clic organico se desvia al
 * cotizador canonico (superficie certificada y transaccional) en lugar de
 * caer en el escaparate.
 */
export const LEGACY_PREFIX_ALIASES: readonly Readonly<{
  readonly prefix: string;
  readonly target: string;
}>[] = Object.freeze([
  Object.freeze({ prefix: '/arsenal/iluminacion-dmx', target: '/presupuesto' }),
]);

/**
 * Sufijos con los que bodas.net genero slugs de ficha. Un slug desconocido que
 * los arrastre se colapsa a busqueda asistida en vez de devolver 404.
 */
export const LEGACY_PROVIDER_SLUG_SUFFIXES: readonly string[] = Object.freeze([
  '-consulta-disponibilidad-y-precios',
]);

/**
 * Patron de ficha con id opaco historico: `prov-3446`, `vendor-4765`, `v-1013`
 * o numerico puro (`1013`). Se resuelve en el Edge con el mapa de ids de arriba.
 */
export const LEGACY_OPAQUE_PROVIDER_PATTERN: RegExp = /^(?:(?:prov|vendor|v)-?)?([0-9]{3,})$/;

/**
 * Destino limpio cuando un id opaco NO tiene ficha canonica conocida: el
 * directorio con busqueda asistida. Erradica el 404 y la pagina fantasma.
 */
export const LEGACY_UNKNOWN_PROVIDER_TARGET = '/proveedores';

/** Normaliza un pathname para comparacion: minusculas y sin barras finales. */
export function normalizeAliasPath(pathname: string): string {
  const trimmed: string = String(pathname ?? '').trim().toLowerCase();
  if (trimmed.length <= 1) return '/';
  return trimmed.replace(/\/+$/, '') || '/';
}

/** Elimina los sufijos legacy de un segmento de ficha (`-consulta-...`). */
export function stripLegacyProviderSuffixes(slug: string): string {
  let out: string = String(slug ?? '').trim().toLowerCase();
  let changed = true;
  while (changed) {
    changed = false;
    for (const suffix of LEGACY_PROVIDER_SLUG_SUFFIXES) {
      if (suffix.length > 0 && out.endsWith(suffix)) {
        out = out.slice(0, -suffix.length);
        changed = true;
      }
    }
  }
  return out.replace(/-+$/g, '');
}

/** ¿El segmento arrastra un sufijo legacy de bodas.net? */
export function hasLegacyProviderSuffix(slug: string): boolean {
  const normalized: string = String(slug ?? '').trim().toLowerCase();
  return LEGACY_PROVIDER_SLUG_SUFFIXES.some((suffix) => normalized.endsWith(suffix));
}

/**
 * Extrae el identificador de proveedor de un slug opaco (`prov-3446`,
 * `vendor-4765`, `v-1013`, `1013`). Devuelve `null` si no es opaco.
 * Espeja el patron del generador historico de slugs.
 */
export function extractOpaqueProviderId(slug: string | null | undefined): string | null {
  const normalized: string = String(slug ?? '').trim().toLowerCase();
  if (!normalized) return null;
  const match: RegExpExecArray | null = LEGACY_OPAQUE_PROVIDER_PATTERN.exec(normalized);
  return match === null ? null : match[1];
}

/**
 * Resuelve un pathname legacy a su destino canonico. Devuelve `null` si la
 * ruta no es un alias conocido (dejando pasar el flujo normal).
 */
export function resolveLegacyRouteAlias(pathname: string): string | null {
  const normalized: string = normalizeAliasPath(pathname);

  const exact: string | undefined = LEGACY_ROUTE_ALIASES[normalized];
  if (exact !== undefined) return exact;

  for (const entry of LEGACY_PREFIX_ALIASES) {
    if (normalized === entry.prefix || normalized.startsWith(`${entry.prefix}/`)) {
      return entry.target;
    }
  }

  const segments: string[] = normalized.split('/').filter(Boolean);
  if (segments.length !== 2 || segments[0] !== 'proveedores') return null;
  const providerSegment: string = segments[1];

  // 1. Id opaco historico (`prov-3446`) → ficha canonica real o directorio.
  const opaqueId: string | null = extractOpaqueProviderId(providerSegment);
  if (opaqueId !== null) {
    const destination: string | undefined = LEGACY_PROVIDER_ID_ALIASES[opaqueId];
    return destination !== undefined ? destination : LEGACY_UNKNOWN_PROVIDER_TARGET;
  }

  // 2. Red de seguridad: `<slug>-consulta-disponibilidad-y-precios` no mapeado
  //    se colapsa a busqueda asistida (cero 404).
  if (hasLegacyProviderSuffix(providerSegment)) {
    const stripped: string = stripLegacyProviderSuffixes(providerSegment);
    if (stripped.length >= 3) {
      return `/proveedores?q=${encodeURIComponent(stripped.replace(/-/g, ' '))}`;
    }
  }

  return null;
}
