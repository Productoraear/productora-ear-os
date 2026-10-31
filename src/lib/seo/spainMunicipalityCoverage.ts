/**
 * SPAIN MUNICIPALITY COVERAGE — puente entre el dataset INE de 8.131 municipios
 * y el vocabulario canónico de 52 provincias del sitio.
 *
 * Por qué existe: el dataset `src/data/geo/spain-8131-municipalities.json` estaba
 * en disco pero NINGÚN generador lo consumía. `MUNICIPALITIES_DATASET`
 * (src/lib/constants/spanish-municipalities.ts) sólo cubre 255 municipios con
 * comarca y venues. Resultado: 7.876 municipios de España sin una sola URL.
 *
 * Política fail-closed (SEC-1): un municipio entra en la cobertura SÓLO si
 *  1) tiene slug RFC 3986 válido,
 *  2) su provincia se resuelve a una clave real de PROVINCIAS_52_GRAPH,
 *  3) su par (provincia, slug) es único.
 * Todo lo que no cumple se EXCLUYE y se contabiliza en MUNICIPALITY_COVERAGE_STATS.
 * Nunca se emite una URL hacia una provincia inexistente (sería un 404 en sitemap).
 *
 * Anomalía conocida y registrada en el dataset original: `Añana` comparte
 * `ineCode 01003` con `Agurain/Salvatierra`. El municipio NO se elimina (tiene
 * slug propio y página propia); la colisión de código INE se cuenta y se expone
 * para que el origen de datos se corrija, no se maquille.
 *
 * SEC-2 · role: public | tenant: global. Cero datos personales.
 */
import rawMunicipalities from '@/data/geo/spain-8131-municipalities.json';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';

export interface RawMunicipality {
  ineCode: string;
  name: string;
  slug: string;
  provinceCode: string;
  province: string;
  provinceSlug: string;
  autonomousCommunity: string;
}

export interface SpainMunicipality {
  ineCode: string;
  name: string;
  slug: string;
  provinceCode: string;
  provinceName: string;
  /** Clave canónica de PROVINCIAS_52_GRAPH. Nunca el slug crudo del dataset. */
  provinceSlug: string;
  community: string;
}

const RAW_MUNICIPALITIES = rawMunicipalities as unknown as readonly RawMunicipality[];

const GRAPH_KEYS: readonly string[] = Object.keys(PROVINCIAS_52_GRAPH);
const GRAPH_KEY_SET: ReadonlySet<string> = new Set(GRAPH_KEYS);

/** Normaliza a ASCII kebab-case: "Araba/Álava" -> "araba-alava", "Álava" -> "alava". */
function normalizeToken(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const GRAPH_BY_NAME: ReadonlyMap<string, string> = new Map(
  GRAPH_KEYS.map((key) => [normalizeToken(PROVINCIAS_52_GRAPH[key].name), key] as const)
);

/** Código INE de provincia (01-52) -> candidato de slug canónico. */
const INE_PROVINCE_CANDIDATES: Readonly<Record<string, string>> = {
  '01': 'alava',
  '02': 'albacete',
  '03': 'alicante',
  '04': 'almeria',
  '05': 'avila',
  '06': 'badajoz',
  '07': 'baleares',
  '08': 'barcelona',
  '09': 'burgos',
  '10': 'caceres',
  '11': 'cadiz',
  '12': 'castellon',
  '13': 'ciudad-real',
  '14': 'cordoba',
  '15': 'a-coruna',
  '16': 'cuenca',
  '17': 'girona',
  '18': 'granada',
  '19': 'guadalajara',
  '20': 'guipuzcoa',
  '21': 'huelva',
  '22': 'huesca',
  '23': 'jaen',
  '24': 'leon',
  '25': 'lleida',
  '26': 'la-rioja',
  '27': 'lugo',
  '28': 'madrid',
  '29': 'malaga',
  '30': 'murcia',
  '31': 'navarra',
  '32': 'ourense',
  '33': 'asturias',
  '34': 'palencia',
  '35': 'las-palmas',
  '36': 'pontevedra',
  '37': 'salamanca',
  '38': 'santa-cruz-de-tenerife',
  '39': 'cantabria',
  '40': 'segovia',
  '41': 'sevilla',
  '42': 'soria',
  '43': 'tarragona',
  '44': 'teruel',
  '45': 'toledo',
  '46': 'valencia',
  '47': 'valladolid',
  '48': 'vizcaya',
  '49': 'zamora',
  '50': 'zaragoza',
  '51': 'ceuta',
  '52': 'melilla',
};

/**
 * Resuelve la provincia de una fila del dataset a la clave canónica.
 * Orden: código INE → nombre del dataset → slug del dataset. Devuelve null si no hay match.
 */
export function resolveProvinceSlug(row: RawMunicipality): string | null {
  const byIne = INE_PROVINCE_CANDIDATES[row.provinceCode];
  if (byIne && GRAPH_KEY_SET.has(byIne)) return byIne;

  const nameParts = row.province.split('/').map((part) => normalizeToken(part));
  for (const part of nameParts) {
    if (!part) continue;
    if (GRAPH_KEY_SET.has(part)) return part;
    const byName = GRAPH_BY_NAME.get(part);
    if (byName) return byName;
  }

  const slugCandidate = normalizeToken(row.provinceSlug);
  if (slugCandidate && GRAPH_KEY_SET.has(slugCandidate)) return slugCandidate;

  return null;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface MunicipalityCoverageStats {
  rawRows: number;
  accepted: number;
  /** Slugs no RFC 3986 (espacios, mayúsculas, acentos, vacíos). */
  excludedInvalidSlug: number;
  /** Provincia sin correspondencia en PROVINCIAS_52_GRAPH. */
  excludedUnresolvedProvince: number;
  /** Mismo (provincia, slug) repetido: doorway por construcción. */
  excludedDuplicatePath: number;
  /** Código INE repetido entre municipios distintos (defecto del origen). */
  ineCodeCollisions: number;
  ineCodeCollisionExamples: readonly string[];
  provincesCovered: number;
  provincesWithoutMunicipalities: readonly string[];
  unresolvedProvinceSamples: readonly string[];
}

interface CoverageBuild {
  municipalities: SpainMunicipality[];
  byProvince: Map<string, SpainMunicipality[]>;
  stats: MunicipalityCoverageStats;
}

function buildCoverage(): CoverageBuild {
  const accepted: SpainMunicipality[] = [];
  const byProvince = new Map<string, SpainMunicipality[]>();
  const seenPaths = new Set<string>();
  const seenIne = new Map<string, string>();
  const ineCollisionExamples: string[] = [];
  const unresolvedSamples: string[] = [];

  let excludedInvalidSlug = 0;
  let excludedUnresolvedProvince = 0;
  let excludedDuplicatePath = 0;
  let ineCodeCollisions = 0;

  for (const row of RAW_MUNICIPALITIES) {
    const slug = typeof row.slug === 'string' ? row.slug.trim().toLowerCase() : '';
    const ineCode = typeof row.ineCode === 'string' ? row.ineCode.trim() : '';

    if (!slug || !SLUG_PATTERN.test(slug)) {
      excludedInvalidSlug += 1;
      continue;
    }

    const provinceSlug = resolveProvinceSlug(row);
    if (!provinceSlug) {
      excludedUnresolvedProvince += 1;
      if (unresolvedSamples.length < 5) {
        unresolvedSamples.push(`${row.provinceCode}:${row.province}:${slug}`);
      }
      continue;
    }

    const pathKey = `${provinceSlug}/${slug}`;
    if (seenPaths.has(pathKey)) {
      excludedDuplicatePath += 1;
      continue;
    }
    seenPaths.add(pathKey);

    if (ineCode) {
      const previous = seenIne.get(ineCode);
      if (previous && previous !== pathKey) {
        ineCodeCollisions += 1;
        if (ineCollisionExamples.length < 5) {
          ineCollisionExamples.push(`${ineCode}:${previous}|${pathKey}`);
        }
      } else {
        seenIne.set(ineCode, pathKey);
      }
    }

    const municipality: SpainMunicipality = {
      ineCode,
      name: row.name,
      slug,
      provinceCode: row.provinceCode,
      provinceName: row.province,
      provinceSlug,
      community: row.autonomousCommunity,
    };

    accepted.push(municipality);
    const bucket = byProvince.get(provinceSlug);
    if (bucket) {
      bucket.push(municipality);
    } else {
      byProvince.set(provinceSlug, [municipality]);
    }
  }

  accepted.sort((a, b) => {
    if (a.provinceSlug !== b.provinceSlug) return a.provinceSlug < b.provinceSlug ? -1 : 1;
    return a.name.localeCompare(b.name, 'es');
  });

  const provincesWithoutMunicipalities = GRAPH_KEYS.filter((key) => !byProvince.has(key));

  return {
    municipalities: accepted,
    byProvince,
    stats: {
      rawRows: RAW_MUNICIPALITIES.length,
      accepted: accepted.length,
      excludedInvalidSlug,
      excludedUnresolvedProvince,
      excludedDuplicatePath,
      ineCodeCollisions,
      ineCodeCollisionExamples: ineCollisionExamples,
      provincesCovered: byProvince.size,
      provincesWithoutMunicipalities,
      unresolvedProvinceSamples: unresolvedSamples,
    },
  };
}

const COVERAGE = buildCoverage();

/** Municipios con provincia canónica resuelta, ordenados de forma determinista. */
export const SPAIN_MUNICIPALITIES: readonly SpainMunicipality[] = COVERAGE.municipalities;

export const SPAIN_MUNICIPALITY_COUNT: number = COVERAGE.municipalities.length;

export const MUNICIPALITY_COVERAGE_STATS: MunicipalityCoverageStats = COVERAGE.stats;

export const MUNICIPALITIES_BY_PROVINCE: ReadonlyMap<string, readonly SpainMunicipality[]> =
  COVERAGE.byProvince;

const MUNICIPALITY_BY_PATH: ReadonlyMap<string, SpainMunicipality> = new Map(
  COVERAGE.municipalities.map((municipality) => [
    `${municipality.provinceSlug}/${municipality.slug}`,
    municipality,
  ] as const)
);

export function getMunicipalitiesByProvince(provinceSlug: string): readonly SpainMunicipality[] {
  return MUNICIPALITIES_BY_PROVINCE.get(provinceSlug) ?? [];
}

export function getMunicipality(
  provinceSlug: string,
  municipalitySlug: string
): SpainMunicipality | null {
  return MUNICIPALITY_BY_PATH.get(`${provinceSlug}/${municipalitySlug.toLowerCase()}`) ?? null;
}

export function isCoveredMunicipality(provinceSlug: string, municipalitySlug: string): boolean {
  return getMunicipality(provinceSlug, municipalitySlug) !== null;
}

export function getProvinceCoverage(): ReadonlyArray<{
  provinceSlug: string;
  provinceName: string;
  municipalities: number;
}> {
  return GRAPH_KEYS.map((key) => ({
    provinceSlug: key,
    provinceName: PROVINCIAS_52_GRAPH[key].name,
    municipalities: getMunicipalitiesByProvince(key).length,
  }));
}

/** Provincias con más municipios: sirven para ordenar la cola de publicación. */
export function getProvincesByMunicipalityDensity(): readonly string[] {
  return getProvinceCoverage()
    .slice()
    .sort((a, b) => b.municipalities - a.municipalities)
    .map((entry) => entry.provinceSlug);
}

