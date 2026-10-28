/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARCHIVO HISTÓRICO — «EL MUNDO DEL MARIACHI» (RESCATE EDITORIAL SOBERANO)
 * ════════════════════════════════════════════════════════════════════════════
 * Módulo PURO (client-safe): no importa `crypto`, `fs` ni `prisma`. Puede
 * consumirse desde Server Components y desde componentes `"use client"`.
 *
 * Qué contiene:
 *  - Los 24 temas canónicos de boda y serenata del repertorio EAR OS.
 *  - Los capítulos de conocimiento: historia de la música ranchera, traje de
 *    charro de gala, botonaduras de plata e instrumentos acústicos.
 *  - La política de rescate del dominio histórico: qué se conserva, qué se
 *    descarta (buzones irrecuperables) y dónde viven las imágenes pesadas.
 *
 * DOCTRINA DEL DATO VERIFICADO (AGENTS.md §4bis y §8):
 *  - Aquí NO se reproduce letra de ninguna canción: solo metadatos de
 *    atribución (título + autoría), que son hechos, no obra protegida.
 *  - Los importes NO viven aquí: el dinero nace del SSOT (`ear-os-ssot.ts`).
 *  - Los teléfonos y el correo oficial nacen de `CENTRALITA_MARIACHIS_ENTITY`;
 *    prohibido duplicarlos a mano.
 *  - Nada de marcas de terceros: el copy es 100 % original.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { CENTRALITA_MARIACHIS_ENTITY } from './centralita-mariachis-entity';

/** Momento del evento en el que el tema funciona mejor. */
export type MariachiOccasion =
  | 'boda'
  | 'serenata'
  | 'cumpleanos'
  | 'misa'
  | 'homenaje'
  | 'cortejo'
  | 'fiesta';

/** Familia estilística del repertorio. */
export type MariachiSongCategory =
  | 'ranchera'
  | 'bolero'
  | 'huapango'
  | 'clasico'
  | 'popular';

/** Ficha de un tema del repertorio (sin letra: solo atribución y uso). */
export interface MundoDelMariachiSong {
  readonly id: string;
  readonly title: string;
  readonly composer: string;
  readonly category: MariachiSongCategory;
  readonly occasions: readonly MariachiOccasion[];
  /** `true` si pertenece al núcleo canónico de 24 temas. */
  readonly canonical: boolean;
}

/** Capítulo de conocimiento histórico. */
export interface MundoDelMariachiChapter {
  readonly id: string;
  readonly title: string;
  readonly tagline: string;
  readonly body: readonly string[];
  readonly facts: readonly { readonly label: string; readonly value: string }[];
}

/** Instrumento acústico de la formación mariachi. */
export interface MariachiInstrument {
  readonly id: string;
  readonly name: string;
  readonly family: 'cuerdas' | 'aliento' | 'arpa';
  readonly strings?: number;
  readonly role: string;
  readonly detail: string;
}

/** Evidencia de origen del rescate (trazabilidad, no vanidad). */
export interface MundoDelMariachiProvenance {
  readonly source: string;
  readonly dataset: string;
  readonly provenanceSha256: string | null;
  readonly retrievedAt: string | null;
  readonly note: string;
}

/**
 * Metadatos del rescate. `retrievalStatus` es deliberadamente honesto:
 * el contenido histórico es una reconstrucción editorial verificable y la
 * descarga de imágenes queda pendiente, fuera del repositorio Git.
 */
export const MUNDO_DEL_MARIACHI_ARCHIVE_META = Object.freeze({
  id: 'mundo-del-mariachi',
  canonicalPath: '/mariachis#mundo-del-mariachi',
  canonicalThemes: 24,
  legacyDomain: 'edwinagudelo.es',
  officialLine: CENTRALITA_MARIACHIS_ENTITY.officialLine,
  officialLineRaw: CENTRALITA_MARIACHIS_ENTITY.officialLineRaw,
  officialEmail: CENTRALITA_MARIACHIS_ENTITY.email,
  baseLabel: CENTRALITA_MARIACHIS_ENTITY.baseFullLabel,
  /** Los buzones del dominio histórico se declaran irrecuperables. */
  discardedEmails: Object.freeze([
    'cualquier buzón @edwinagudelo.es',
  ]),
  imagePolicy: Object.freeze({
    /** Originales pesados: FUERA del repositorio Git (regla repo < 50 MB). */
    heavyArchivePath: 'D:/EAR_OS_V2/assets/edwin-agudelo-legacy',
    publishedPath: '/images/edwin-agudelo/',
    format: 'webp',
    maxKilobytes: 80,
    rule:
      'En Git solo entran derivados WebP < 80 KB. Los originales rescatados viven en D:/EAR_OS_V2/assets/edwin-agudelo-legacy.',
  }),
  legalNote:
    'Contenido redactado de forma original. No se copian textos, fotos ni maquetación de terceros; solo se conservan hechos y la matriz de intención de búsqueda.',
  retrievalStatus: 'reconstruccion-editorial' as const,
} as const);


/**
 * LOS 24 TEMAS CANÓNICOS DE BODA Y SERENATA.
 * Orden editorial: apertura solemne → romanticismo → despecho → fiesta.
 */
export const MUNDO_DEL_MARIACHI_REPERTOIRE: readonly MundoDelMariachiSong[] =
  Object.freeze([
    {
      id: 'si-nos-dejan',
      title: 'Si Nos Dejan',
      composer: 'José Alfredo Jiménez',
      category: 'bolero',
      occasions: Object.freeze(['boda', 'serenata', 'cortejo'] as const),
      canonical: true,
    },
    {
      id: 'el-rey',
      title: 'El Rey',
      composer: 'José Alfredo Jiménez',
      category: 'ranchera',
      occasions: Object.freeze(['fiesta', 'serenata', 'homenaje'] as const),
      canonical: true,
    },
    {
      id: 'las-mananitas',
      title: 'Las Mañanitas',
      composer: 'Dominio tradicional mexicano',
      category: 'clasico',
      occasions: Object.freeze(['cumpleanos', 'serenata', 'misa'] as const),
      canonical: true,
    },
    {
      id: 'volver-volver',
      title: 'Volver, Volver',
      composer: 'Fernando Z. Maldonado',
      category: 'ranchera',
      occasions: Object.freeze(['fiesta', 'serenata'] as const),
      canonical: true,
    },
    {
      id: 'cielito-lindo',
      title: 'Cielito Lindo',
      composer: 'Quirino Mendoza y Cortés',
      category: 'popular',
      occasions: Object.freeze(['boda', 'fiesta', 'serenata'] as const),
      canonical: true,
    },
    {
      id: 'besame-mucho',
      title: 'Bésame Mucho',
      composer: 'Consuelo Velázquez',
      category: 'bolero',
      occasions: Object.freeze(['boda', 'serenata'] as const),
      canonical: true,
    },
    {
      id: 'la-media-vuelta',
      title: 'La Media Vuelta',
      composer: 'José Alfredo Jiménez',
      category: 'bolero',
      occasions: Object.freeze(['serenata', 'cortejo'] as const),
      canonical: true,
    },
    {
      id: 'sabor-a-mi',
      title: 'Sabor a Mí',
      composer: 'Álvaro Carrillo',
      category: 'bolero',
      occasions: Object.freeze(['boda', 'serenata'] as const),
      canonical: true,
    },
    {
      id: 'mexico-lindo-y-querido',
      title: 'México Lindo y Querido',
      composer: 'Chucho Monge',
      category: 'ranchera',
      occasions: Object.freeze(['fiesta', 'homenaje'] as const),
      canonical: true,
    },
    {
      id: 'cucurrucucu-paloma',
      title: 'Cucurrucucú Paloma',
      composer: 'Tomás Méndez',
      category: 'huapango',
      occasions: Object.freeze(['serenata', 'homenaje'] as const),
      canonical: true,
    },
    {
      id: 'la-malaguena',
      title: 'La Malagueña',
      composer: 'Elpidio Ramírez',
      category: 'huapango',
      occasions: Object.freeze(['fiesta', 'homenaje'] as const),
      canonical: true,
    },
    {
      id: 'la-bikina',
      title: 'La Bikina',
      composer: 'Rubén Fuentes',
      category: 'popular',
      occasions: Object.freeze(['fiesta', 'boda'] as const),
      canonical: true,
    },
    {
      id: 'serenata-huasteca',
      title: 'Serenata Huasteca',
      composer: 'José Alfredo Jiménez',
      category: 'huapango',
      occasions: Object.freeze(['serenata', 'cortejo'] as const),
      canonical: true,
    },
    {
      id: 'sombras-nada-mas',
      title: 'Sombras Nada Más',
      composer: 'Francisco Lomuto y José María Contursi',
      category: 'bolero',
      occasions: Object.freeze(['serenata', 'homenaje'] as const),
      canonical: true,
    },
    {
      id: 'fallaste-corazon',
      title: 'Fallaste Corazón',
      composer: 'Cuco Sánchez',
      category: 'ranchera',
      occasions: Object.freeze(['serenata', 'homenaje'] as const),
      canonical: true,
    },
    {
      id: 'el-jinete',
      title: 'El Jinete',
      composer: 'José Alfredo Jiménez',
      category: 'ranchera',
      occasions: Object.freeze(['serenata', 'cortejo'] as const),
      canonical: true,
    },
    {
      id: 'la-enorme-distancia',
      title: 'La Enorme Distancia',
      composer: 'José Alfredo Jiménez',
      category: 'ranchera',
      occasions: Object.freeze(['serenata', 'homenaje'] as const),
      canonical: true,
    },
    {
      id: 'gema',
      title: 'Gema',
      composer: 'Güicho Cisneros',
      category: 'bolero',
      occasions: Object.freeze(['boda', 'serenata'] as const),
      canonical: true,
    },
    {
      id: 'motivos',
      title: 'Motivos',
      composer: 'Italo Pizzolante',
      category: 'bolero',
      occasions: Object.freeze(['serenata', 'cortejo'] as const),
      canonical: true,
    },
    {
      id: 'hermoso-carino',
      title: 'Hermoso Cariño',
      composer: 'Vicente Fernández',
      category: 'ranchera',
      occasions: Object.freeze(['boda', 'serenata', 'cumpleanos'] as const),
      canonical: true,
    },
    {
      id: 'mala-suerte',
      title: 'Mala Suerte',
      composer: 'Dominio tradicional ranchero',
      category: 'ranchera',
      occasions: Object.freeze(['fiesta', 'serenata'] as const),
      canonical: true,
    },
    {
      id: 'no-me-amenaces',
      title: 'No Me Amenaces',
      composer: 'José Alfredo Jiménez',
      category: 'ranchera',
      occasions: Object.freeze(['fiesta', 'serenata'] as const),
      canonical: true,
    },
    {
      id: 'paloma-negra',
      title: 'Paloma Negra',
      composer: 'Tomás Méndez',
      category: 'ranchera',
      occasions: Object.freeze(['homenaje', 'serenata'] as const),
      canonical: true,
    },
    {
      id: 'guadalajara',
      title: 'Guadalajara',
      composer: 'Pepe Guízar',
      category: 'popular',
      occasions: Object.freeze(['fiesta', 'boda'] as const),
      canonical: true,
    },
  ]);
/** Temas solicitables fuera del núcleo canónico (a la carta). */
export const MUNDO_DEL_MARIACHI_REQUESTABLE_EXTRAS: readonly MundoDelMariachiSong[] =
  Object.freeze([
    {
      id: 'alma-corazon-y-vida',
      title: 'Alma, Corazón y Vida',
      composer: 'Adrián Flores Albán',
      category: 'bolero',
      occasions: Object.freeze(['boda', 'serenata'] as const),
      canonical: false,
    },
    {
      id: 'amor-eterno',
      title: 'Amor Eterno',
      composer: 'Juan Gabriel',
      category: 'ranchera',
      occasions: Object.freeze(['homenaje', 'misa', 'serenata'] as const),
      canonical: false,
    },
    {
      id: 'amanecí-en-tus-brazos',
      title: 'Amanecí en Tus Brazos',
      composer: 'José Alfredo Jiménez',
      category: 'ranchera',
      occasions: Object.freeze(['boda', 'serenata'] as const),
      canonical: false,
    },
    {
      id: 'que-te-vaya-bonito',
      title: 'Que Te Vaya Bonito',
      composer: 'José Alfredo Jiménez',
      category: 'ranchera',
      occasions: Object.freeze(['serenata', 'homenaje'] as const),
      canonical: false,
    },
  ]);

/** Etiquetas de familia estilística para la UI. */
export const MUNDO_DEL_MARIACHI_CATEGORY_LABELS: Readonly<
  Record<MariachiSongCategory, string>
> = Object.freeze({
  ranchera: 'Ranchera',
  bolero: 'Bolero ranchero',
  huapango: 'Huapango',
  clasico: 'Clásico de celebración',
  popular: 'Popular mexicano',
});

/** Etiquetas de ocasión para la UI. */
export const MUNDO_DEL_MARIACHI_OCCASION_LABELS: Readonly<
  Record<MariachiOccasion, string>
> = Object.freeze({
  boda: 'Boda',
  serenata: 'Serenata',
  cumpleanos: 'Cumpleaños',
  misa: 'Misa panamericana',
  homenaje: 'Homenaje',
  cortejo: 'Pedida de mano',
  fiesta: 'Fiesta',
});


/** Orden de presentación de las familias en el archivo. */
const CATEGORY_ORDER: readonly MariachiSongCategory[] = Object.freeze([
  'bolero',
  'ranchera',
  'huapango',
  'popular',
  'clasico',
]);

/** Agrupa el repertorio canónico por familia, conservando el orden editorial. */
export function groupMundoDelMariachiRepertoire(): readonly {
  readonly category: MariachiSongCategory;
  readonly label: string;
  readonly songs: readonly MundoDelMariachiSong[];
}[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    label: MUNDO_DEL_MARIACHI_CATEGORY_LABELS[category],
    songs: MUNDO_DEL_MARIACHI_REPERTOIRE.filter((song) => song.category === category),
  })).filter((group) => group.songs.length > 0);
}

/** Resuelve un tema por id (canónico o solicitable). Devuelve `null` si no existe. */
export function getMundoDelMariachiSong(
  id: string | null | undefined,
): MundoDelMariachiSong | null {
  if (typeof id !== 'string') return null;
  const key = id.trim().toLowerCase();
  const pool = [...MUNDO_DEL_MARIACHI_REPERTOIRE, ...MUNDO_DEL_MARIACHI_REQUESTABLE_EXTRAS];
  return pool.find((song) => song.id === key) ?? null;
}

/**
 * CAPÍTULOS DE CONOCIMIENTO — «EL MUNDO DEL MARIACHI».
 * Copy original, sin citas literales de terceros. Hechos culturales públicos.
 */
export const MUNDO_DEL_MARIACHI_CHAPTERS: readonly MundoDelMariachiChapter[] =
  Object.freeze([
    {
      id: 'historia-ranchera',
      title: 'Historia de la música ranchera',
      tagline: 'Del son jalisciense al cine de oro y al Patrimonio de la Humanidad',
      body: Object.freeze([
        'La música ranchera no nació en un solo lugar ni en una sola fecha. Su raíz está en el son jalisciense del occidente de México, un tejido de cuerdas europeas —vihuela, guitarra de golpe, arpa y violín— que se mezcló con la lírica popular del campo. En Cocula y Tecalitlán (Jalisco) se documenta desde el siglo XVIII la formación que hoy reconocemos como mariachi.',
        'Durante el siglo XIX la canción campesina y el teatro rural consolidaron la ranchera: una forma de contar el desamor, la distancia y la patria con una honestidad que no necesita adornos. En el siglo XX la trompeta entró en la agrupación y le dio esa proyección monumental que hoy asociamos al género.',
        'El cine de oro mexicano, entre los años treinta y cincuenta, convirtió al charro cantor en símbolo nacional. La ranchera dejó de ser música de plaza para entrar en las salas de fiesta, en la radio y en la memoria colectiva de toda Latinoamérica.',
        'En 2011 la UNESCO inscribió «La música de mariachi, vibrante expresión de la música tradicional mexicana» en la Lista Representativa del Patrimonio Cultural Inmaterial de la Humanidad. No es folclore de museo: es una práctica viva que se reinterpreta en cada boda, en cada serenata y en cada misa panamericana.',
      ]),
      facts: Object.freeze([
        { label: 'Cuna documentada', value: 'Occidente de México · Jalisco (siglo XVIII)' },
        { label: 'Reconocimiento', value: 'UNESCO · Patrimonio Inmaterial (2011)' },
        { label: 'Eje expresivo', value: 'Voz tenor, cuerdas y trompeta en diálogo' },
      ]),
    },
    {
      id: 'traje-charro-gala',
      title: 'El traje de charro de gala',
      tagline: 'La diferencia entre vestir de charro y vestir de gala',
      body: Object.freeze([
        'El traje de charro nació del atuendo del jinete de las haciendas y evolucionó hasta convertirse en el uniforme ceremonial de la música mexicana. No todos los trajes son iguales: existe el traje de campo, sobrio y funcional, y el traje de gala, concebido para el escenario y la solemnidad.',
        'El traje de gala se compone de chaqueta corta y entallada, pantalón con doble botonadura lateral, camisa de cuello alto con moño, cinturón piteado y sombrero de fieltro fino con galón bordado. La silueta debe caer limpia: una chaqueta arrugada o un pantalón corto rompen la percepción de categoría antes de que suene la primera nota.',
        'En una boda o en una misa panamericana el traje no es disfraz: es protocolo. Marca el respeto por el momento, por la familia y por el oficio. Por eso la formación de gala se presenta uniformada, con calzado cuidado y sombrero retirado cuando la ceremonia lo exige.',
      ]),
      facts: Object.freeze([
        { label: 'Piezas clave', value: 'Chaqueta corta, botonadura lateral y cinturón piteado' },
        { label: 'Sombrero', value: 'Fieltro fino con galón, sujeto a protocolo del recinto' },
        { label: 'Uso', value: 'Ceremonia, banquete y escenario de gala' },
      ]),
    },

    {
      id: 'botonaduras-plata',
      title: 'Botonaduras de plata',
      tagline: 'El detalle que separa una actuación de una presencia',
      body: Object.freeze([
        'La botonadura es el conjunto de botones y broches de plata que recorre la chaqueta y el pantalón del traje de gala. Se trabaja en plata cincelada a mano: cada pieza se golpea, se lima y se pule para que la luz la recorra sin deslumbrar de forma agresiva.',
        'El peso de una botonadura bien hecha se nota al caminar. Una pieza de aleación ligera brilla igual en una foto, pero delata su origen al primer movimiento: salta, tintinea y arruga el faldón. La plata noble, en cambio, cae y acompaña el cuerpo.',
        'Su mantenimiento es parte del oficio: paño suave, limpieza sin abrasivos y almacenamiento individual para evitar roces. Una botonadura cuidada envejece con dignidad y se convierte en patrimonio del músico, no en un accesorio desechable.',
      ]),
      facts: Object.freeze([
        { label: 'Material', value: 'Plata cincelada a mano' },
        { label: 'Colocación', value: 'Doble botonadura en chaqueta y pantalón' },
        { label: 'Cuidado', value: 'Paño suave, sin abrasivos, almacenamiento individual' },
      ]),
    },
    {
      id: 'instrumentos-acusticos',
      title: 'Los instrumentos acústicos',
      tagline: 'Vihuela, guitarrón, trompeta, violines y arpa jalisciense',
      body: Object.freeze([
        'Una formación mariachi es un pequeño organismo acústico. Cada instrumento cumple una función y ninguno sobra: la vihuela sostiene el pulso, el guitarrón ancla la armonía en el registro grave, los violines dibujan la melodía y las trompetas abren el aire con la fanfarria.',
        'La acústica es la razón por la que el formato importa. Un solista con pistas pregrabadas puede sonar impecable en una terraza pequeña, pero no llena una plaza. Un cuarteto equilibra intimidad y cuerpo. Una formación de gala con dos trompetas y sección de cuerdas proyecta sin necesidad de elevar el volumen más allá de lo que permite la normativa del recinto.',
        'Los instrumentos acústicos permiten además adaptar el rider al límite de decibelios de cada finca: cuerdas y sordinas cuando el entorno es restrictivo, metales al aire cuando el escenario lo admite. Esa flexibilidad técnica es la que evita conflictos con vecinos, ayuntamientos y titulares del recinto.',
      ]),
      facts: Object.freeze([
        { label: 'Base rítmica', value: 'Vihuela y guitarrón' },
        { label: 'Melodía', value: 'Violines y trompetas' },
        { label: 'Formaciones grandes', value: 'Arpa jalisciense y refuerzo de cuerdas' },
      ]),
    },
  ]);

/** Detalle técnico de los instrumentos acústicos del género. */
export const MUNDO_DEL_MARIACHI_INSTRUMENTS: readonly MariachiInstrument[] =
  Object.freeze([
    {
      id: 'vihuela',
      name: 'Vihuela mexicana',
      family: 'cuerdas',
      strings: 5,
      role: 'Pulso rítmico y armonía media',
      detail:
        'Caja pequeña de fondo convexo y cinco cuerdas. Su rasgueo seco marca el compás y sostiene el resto de la formación.',
    },
    {
      id: 'guitarron',
      name: 'Guitarrón',
      family: 'cuerdas',
      strings: 6,
      role: 'Base armónica en el registro grave',
      detail:
        'Caja de gran volumen y seis cuerdas. Sustituye al bajo con una proyección acústica que no necesita amplificación.',
    },
    {
      id: 'trompeta',
      name: 'Trompeta',
      family: 'aliento',
      role: 'Fanfarria, contrapunto y clímax',
      detail:
        'En formación de gala suele haber dos. Se incorporó a la agrupación en el siglo XX y definió el sonido monumental del género.',
    },
    {
      id: 'violines',
      name: 'Sección de violines',
      family: 'cuerdas',
      strings: 4,
      role: 'Melodía y ornamentación',
      detail:
        'Entre dos y cuatro violines según el formato. Aportan el lirismo que permite pasar de la serenata al vals ranchero.',
    },
    {
      id: 'arpa-jalisciense',
      name: 'Arpa jalisciense',
      family: 'arpa',
      strings: 37,
      role: 'Bajo alterno y arpegio de color',
      detail:
        'Alrededor de treinta y siete cuerdas. Presente en formaciones grandes, añade profundidad y un brillo característico.',
    },
  ]);

/**
 * EVIDENCIA DEL RESCATE. `provenanceSha256` queda en `null` porque el archivo
 * histórico no publica documento firmado: se declara la ausencia en lugar de
 * inventar un hash (Doctrina del Dato Verificado).
 */
export const MUNDO_DEL_MARIACHI_PROVENANCE: readonly MundoDelMariachiProvenance[] =
  Object.freeze([
    {
      source: 'https://web.archive.org/web/*/edwinagudelo.es',
      dataset: 'legacy-site-wayback',
      provenanceSha256: null,
      retrievedAt: null,
      note:
        'Reconstrucción editorial del repertorio y de las secciones culturales. Pendiente la descarga verificada de imágenes originales.',
    },
    {
      source: 'src/lib/constants/centralita-mariachis-entity.ts',
      dataset: 'ssot-operator-identity',
      provenanceSha256: null,
      retrievedAt: '2026-10-27T00:00:00.000Z',
      note:
        'Línea oficial y correo soberano heredados de la ficha canónica del operador; no se duplican a mano.',
    },
  ]);

/**
 * PLAN DE COSECHA DE LA RED NACIONAL (B2B).
 * Deliberadamente NO contiene teléfonos: la Doctrina del Dato Verificado exige
 * un número real y atribuible antes de marcar `verified:true`. La cosecha se
 * hace sobre fuentes públicas (ficha de negocio, web oficial, redes públicas).
 */
export const MUNDO_DEL_MARIACHI_HARVEST_PLAN = Object.freeze({
  dataset: 'public/data/providers/mariachis_national_harvest.json',
  doctrine:
    'Ningún grupo se publica como verificado sin teléfono real, propio y atribuible. Prohibido rellenar con la centralita o con números inventados.',
  requiredFields: Object.freeze([
    'name',
    'province',
    'municipality',
    'tags',
    'phone',
    'phoneSourceUrl',
    'retrievedAt',
    'verified',
  ]),
  sources: Object.freeze([
    'Ficha de negocio pública (Google Business Profile)',
    'Web oficial del grupo',
    'Perfil público en redes sociales',
    'Cartel o dossier público del evento',
  ]),
  blockedUntil: 'Teléfono real verificado y contraste en al menos una fuente pública.',
  expansion: 'España primero; después una landing de captación por país o región.',
} as const);

/**
 * Diagnóstico de integridad del archivo (0 incidencias = sano).
 * Pensado para tests y para el guardián de contenido: no lanza, informa.
 */
export function auditMundoDelMariachiArchive(): readonly string[] {
  const issues: string[] = [];

  if (MUNDO_DEL_MARIACHI_REPERTOIRE.length !== MUNDO_DEL_MARIACHI_ARCHIVE_META.canonicalThemes) {
    issues.push(
      `Repertorio canónico incompleto: ${MUNDO_DEL_MARIACHI_REPERTOIRE.length}/${MUNDO_DEL_MARIACHI_ARCHIVE_META.canonicalThemes}.`,
    );
  }

  const ids = [...MUNDO_DEL_MARIACHI_REPERTOIRE, ...MUNDO_DEL_MARIACHI_REQUESTABLE_EXTRAS].map(
    (song) => song.id,
  );
  if (new Set(ids).size !== ids.length) {
    issues.push('Hay identificadores de tema duplicados en el archivo.');
  }

  if (MUNDO_DEL_MARIACHI_CHAPTERS.length < 4) {
    issues.push('Faltan capítulos de conocimiento en «El Mundo del Mariachi».');
  }

  if (MUNDO_DEL_MARIACHI_INSTRUMENTS.length < 5) {
    issues.push('Faltan instrumentos acústicos en la ficha técnica.');
  }

  if (!MUNDO_DEL_MARIACHI_CHAPTERS.every((chapter) => chapter.body.length > 0)) {
    issues.push('Algún capítulo de conocimiento está vacío.');
  }

  return Object.freeze(issues);
}


