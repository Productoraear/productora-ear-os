/**
 * ════════════════════════════════════════════════════════════════════════════
 * CATÁLOGO DEL CONFIGURADOR S-CLASS (`/reservar/solista`) · CAPA PURA
 * ════════════════════════════════════════════════════════════════════════════
 * Antes vivía hardcodeado dentro de la página cliente. Se extrae aquí por dos
 * razones de blindaje:
 *
 *  1. La línea MARIACHI deja de tener precios hardcodeados: se deriva del
 *     catálogo canónico `MARIACHI_FORMATS` (capa pura del SSOT). Así el
 *     configurador vende exactamente lo que publican las 220 landings de la
 *     Centralita (350 / 600 / 900 / 1.300 €) y el depósito de 100 €.
 *  2. Puede importarse desde TSX, guardianes y tests sin arrastrar JSX ni
 *     dependencias de Node.
 *
 * Los perfiles NO mariachi (cuerdas, lírico, DJ, dúo flamenco) son productos
 * distintos que no existen en el SSOT; sus tarifas siguen siendo comerciales y
 * su incorporación al SSOT exige sanción del CEO (ZONA CERO).
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  MARIACHI_FORMAT_BY_ID,
  type MariachiFormatId,
} from '../mariachi/mariachi-formats';

export type ArtistCategory = 'solista' | 'mariachi' | 'cuerdas' | 'fiesta';

export interface SClassArtistFormat {
  /** Identificador estable del perfil (contrato de la API de depósito). */
  id: string;
  /** Vínculo canónico con el formato SSOT mariachi. `null` = producto fuera del SSOT. */
  ssotFormatId: MariachiFormatId | null;
  name: string;
  role: string;
  category: ArtistCategory;
  baseRate: number;
  members: number | null;
  rating: number;
  reviews: number;
  badge: string;
  img: string;
  description: string;
  repertoire: string[];
  rider: string;
}

/** Perfil por defecto del configurador (Artista Insignia). */
export const DEFAULT_ARTIST_PROFILE_ID = 'edwin-solista';

export const ARTIST_FORMATS: readonly SClassArtistFormat[] = Object.freeze([
  {
    id: 'edwin-solista',
    ssotFormatId: 'solista',
    name: 'Edwin Agudelo (Tenor Lírico)',
    role: 'Solista Insignia S-Class',
    category: 'solista',
    baseRate: MARIACHI_FORMAT_BY_ID.solista.basePrice,
    members: MARIACHI_FORMAT_BY_ID.solista.members,
    rating: 5.0,
    reviews: 48,
    badge: 'Artista Insignia',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    description:
      'Voz lírica de alta tesitura para ceremonias nupciales, boleros de gala y grandes celebraciones. Microfonía Shure Axient de estudio.',
    repertoire: ['Ave María (Schubert)', 'O Sole Mio', 'Nessun Dorma', 'Bésame Mucho', 'Por Ti Volaré'],
    rider: 'Bose S1 Pro / F1 + Shure Beta 87A',
  },
  {
    id: 'mariachi-gala-oro',
    ssotFormatId: 'cuarteto',
    name: MARIACHI_FORMAT_BY_ID.cuarteto.name,
    role: '4 músicos · Trompeta, vihuela, guitarrón y violín',
    category: 'mariachi',
    baseRate: MARIACHI_FORMAT_BY_ID.cuarteto.basePrice,
    members: MARIACHI_FORMAT_BY_ID.cuarteto.members,
    rating: 4.9,
    reviews: 34,
    badge: 'Favorito Bodas',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    description:
      'Cuarteto ranchero con auténtico traje charro de gala: trompeta solista, vihuela, guitarrón y violín. Serenatas, cócteles de bienvenida y sorpresas nupciales.',
    repertoire: ['El Rey', 'Si Nos Dejan', 'Volver Volver', 'Cielito Lindo', 'La Bikina'],
    rider: 'Rider acústico puro + refuerzo Bose',
  },
  {
    id: 'mariachi-imperial',
    ssotFormatId: 'gala',
    name: MARIACHI_FORMAT_BY_ID.gala.name,
    role: '6 músicos · Edwin Agudelo + 5 maestros',
    category: 'mariachi',
    baseRate: MARIACHI_FORMAT_BY_ID.gala.basePrice,
    members: MARIACHI_FORMAT_BY_ID.gala.members,
    rating: 5.0,
    reviews: 29,
    badge: 'Top Selección',
    img: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=600&auto=format&fit=crop',
    description:
      'Formación de gala: 2 trompetas, 2 violines, vihuela y guitarrón, con dirección y voz de Edwin Agudelo. Sonoridad y presencia inigualables.',
    repertoire: ['Serenata Huasteca', 'Amor Eterno', 'Échame a Mí la Culpa', 'Sombras'],
    rider: 'Bose F1 Model 812 (12 W/pax) + Microfonía inalámbrica',
  },
  {
    id: 'mariachi-gran-ensamble',
    ssotFormatId: 'monumental',
    name: MARIACHI_FORMAT_BY_ID.monumental.name,
    role: '8 músicos · Formación sinfónica completa',
    category: 'mariachi',
    baseRate: MARIACHI_FORMAT_BY_ID.monumental.basePrice,
    members: MARIACHI_FORMAT_BY_ID.monumental.members,
    rating: 4.9,
    reviews: 18,
    badge: 'Gran Apoteosis',
    img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop',
    description:
      'Agrupación monumental: 3 violines, 2 trompetas, vihuela, guitarrón y guitarra española. Para plazas, recintos mayores y fincas de gala.',
    repertoire: ['El Son de la Negra', 'Huapango de Moncayo', 'Guadalajara', 'El Cascabel'],
    rider: 'Sistema Bose F1 dual + subs 1.000W + mesa digital Midas',
  },
  {
    id: 'cuarteto-cuerdas',
    ssotFormatId: null,
    name: "Cuarteto de Cuerdas 'Sinfonía Nupcial'",
    role: '2 Violines, Viola & Violonchelo',
    category: 'cuerdas',
    baseRate: 650.0,
    members: 4,
    rating: 4.9,
    reviews: 41,
    badge: 'Ceremonias de Gala',
    img: 'https://images.unsplash.com/photo-1525994886773-080587e161c2?q=80&w=600&auto=format&fit=crop',
    description:
      'Elegancia clásica para ceremonias religiosas y civiles. Piezas sacras, bandas sonoras de cine y adaptaciones pop elegantes.',
    repertoire: ['Canon de Pachelbel', 'Viva la Vida', 'Cello Suite Bach', 'Cinema Paradiso'],
    rider: 'Microfonía DPA 4099 para cuerdas',
  },
  {
    id: 'duo-lirico-piano',
    ssotFormatId: null,
    name: 'Dúo Lírico Clásico (Tenor + Piano Nord)',
    role: 'Edwin Agudelo & Pianista',
    category: 'solista',
    baseRate: 480.0,
    members: 2,
    rating: 5.0,
    reviews: 26,
    badge: 'Alta Costura',
    img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=600&auto=format&fit=crop',
    description:
      'Voz lírica acompañada de piano de escenario Nord Stage 3. Atmósfera íntima y refinada para firmas de acta y cócteles.',
    repertoire: ['Hasta Mi Final', 'Hallelujah (Cohen)', 'Intermezzo Cavalleria Rusticana'],
    rider: 'Piano Nord Stage 3 + Bose S1 Pro',
  },
  {
    id: 'dj-saxo-performance',
    ssotFormatId: null,
    name: 'DJ & Live Saxo Performance (Pack Fiesta)',
    role: 'DJ Productor + Saxofonista Live',
    category: 'fiesta',
    baseRate: 750.0,
    members: 2,
    rating: 4.8,
    reviews: 37,
    badge: 'Barra Libre',
    img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    description:
      'Sonorización completa de fiesta y barra libre. Saxofón inalámbrico en pista de baile, puente de luces DMX y sonido Bose F1 < 75 dB.',
    repertoire: ['Deep House', 'Pop Español 80/90', 'Top 50 Hits', 'Ibiza Classics'],
    rider: 'Cabina Pioneer DJ + 2x Bose F1 + Iluminación DMX',
  },
  {
    id: 'guitarra-violin-duo',
    ssotFormatId: null,
    name: 'Dúo Guitarra Española & Violín Eléctrico',
    role: 'Fusión Flamenco-Chillout',
    category: 'cuerdas',
    baseRate: 520.0,
    members: 2,
    rating: 4.9,
    reviews: 22,
    badge: 'Cóctel Chillout',
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop',
    description:
      'Melodías de guitarra española virtuosa combinadas con la calidez del violín eléctrico para cócteles al atardecer en jardines y fincas.',
    repertoire: ['Entre Dos Aguas', 'Asturias (Albéniz)', 'Shape of You (Fusión)'],
    rider: '2x Columnas Bose S1 Pro compactas a batería',
  },
]);

/** Índice por id de perfil (O(1), sin `find` en el render de la página). */
export const ARTIST_FORMAT_BY_ID: Readonly<Record<string, SClassArtistFormat>> = Object.freeze(
  Object.fromEntries(ARTIST_FORMATS.map((format) => [format.id, format] as const)),
);

/** Índice inverso SSOT → perfil: puente único entre landing y configurador. */
export const ARTIST_FORMAT_BY_SSOT_ID: Readonly<Record<MariachiFormatId, SClassArtistFormat>> =
  Object.freeze({
    solista: ARTIST_FORMAT_BY_ID['edwin-solista'],
    cuarteto: ARTIST_FORMAT_BY_ID['mariachi-gala-oro'],
    gala: ARTIST_FORMAT_BY_ID['mariachi-imperial'],
    monumental: ARTIST_FORMAT_BY_ID['mariachi-gran-ensamble'],
  });

/** Resolución defensiva: id desconocido → `null`, nunca excepción. */
export function getArtistFormat(id: string | null | undefined): SClassArtistFormat | null {
  if (typeof id !== 'string') return null;
  const key = id.trim();
  return Object.prototype.hasOwnProperty.call(ARTIST_FORMAT_BY_ID, key)
    ? ARTIST_FORMAT_BY_ID[key]
    : null;
}

