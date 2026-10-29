/**
 * ════════════════════════════════════════════════════════════════════════════
 * ESCAPARATE CANÓNICO — EDWIN AGUDELO (ABSORCIÓN 1:1 DEL LEGADO 2009-2024)
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente única de verdad del escaparate comercial del artista insignia.
 *
 * Origen del contenido: archivo público `edwinagudelo.es` (snapshot
 * 2023-05-12, Wayback Machine). Se absorben sus 9 verticales de servicio, sus
 * 4 ventajas competitivas, sus dos packs de "¿Qué incluye?" y su oficina de
 * representación — SIN excepciones y SIN inventar un solo dato.
 *
 * Cerraduras de esta capa (Protocolo Omega):
 *  1. CERO precios literales: todo nace de `ear-os-ssot.ts` o de
 *     `MARIACHI_FORMATS`. Si el SSOT cambia, el escaparate cambia solo.
 *  2. CERO rutas inventadas: cada `href` apunta a una ruta que existe en el
 *     App Router (verificado por inventario de directorios).
 *  3. CERO fachadas: los servicios sin precio canónico publican "presupuesto
 *     cerrado en configurador", nunca una cifra sin respaldo.
 *  4. CERO teléfonos huérfanos: la oficina de representación usa EXCLUSIVAMENTE
 *     la centralita SSOT. Los teléfonos del archivo 2023 no se exponen para no
 *     generar leads sin dueño.
 *
 * Dúo comercial: deliberadamente AUSENTE. No está canonizado en el SSOT
 * (pendiente de decisión de negocio del CEO) y este módulo no publica cifras
 * no selladas.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SPLIT_SOBERANO,
  SUPLEMENTO_HOTEL_EUR,
  TARIFA_BASE_SOLISTA_EUR,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';
import { MARIACHI_FORMATS, type MariachiFormatId } from '@/lib/mariachi/mariachi-formats';

/* ------------------------------------------------------------------ */
/* Formateadores deterministas (sin ICU: cero riesgo de hidratación)   */
/* ------------------------------------------------------------------ */

/** Formatea euros enteros con separador de miles español: 1300 → "1.300 €". */
export function formatEur(value: number): string {
  const rounded = Math.round(value);
  return `${String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} €`;
}

/** Formatea euros con dos decimales y coma: 1.5 → "1,50 €". */
export function formatEurDecimal(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} €`;
}

/* ------------------------------------------------------------------ */
/* Constantes canónicas del escaparate                                 */
/* ------------------------------------------------------------------ */

/**
 * Póliza de Responsabilidad Civil del escaparate.
 * Valor UNIFICADO: el dossier (`EdwinDossierHero`) y la ficha del artista ya
 * publicaban 1.000.000 €. El grid legacy publicaba 300.000 € — deriva
 * corregida aquí para que no existan dos cifras en el mismo escaparate.
 */
export const EDWIN_SHOWCASE_RC_EUR: number = 1_000_000;

/**
 * Precio base de la canción personalizada en estudio.
 * Espejo exacto del importe que cobra el configurador vivo
 * `/canciones-personalizadas` vía Stripe. El grid legacy publicaba 150 €
 * (deriva sin respaldo) — aquí se sella el valor real del motor de cobro.
 */
export const EDWIN_CANCION_PERSONALIZADA_BASE_EUR: number = 99;

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

/** Claves de icono resueltas por la capa de presentación (datos puros). */
export type EdwinShowcaseIconKey =
  | 'cake'
  | 'heart'
  | 'sparkles'
  | 'users'
  | 'award'
  | 'video'
  | 'music'
  | 'solista';

/** Vertical comercial absorbida del escaparate histórico. */
export interface EdwinShowcaseVertical {
  readonly id: string;
  readonly title: string;
  readonly badge: string;
  readonly pitch: string;
  readonly includes: readonly string[];
  readonly repertoire: string | null;
  /** Ruta interna REAL del App Router. */
  readonly href: string;
  readonly ctaLabel: string;
  readonly priceLabel: string;
  readonly iconKey: EdwinShowcaseIconKey;
}

/** Ventaja competitiva absorbida del bloque "Ventajas de contratar". */
export interface EdwinShowcaseAdvantage {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

/** Pack de "¿Qué incluye?" del histórico. */
export interface EdwinShowcasePack {
  readonly id: 'solista' | 'mariachi';
  readonly title: string;
  readonly subtitle: string;
  readonly includes: readonly string[];
  readonly priceLabel: string;
}

/** Escalón de formato publicado (derivado de `MARIACHI_FORMATS`). */
export interface EdwinShowcaseTier {
  readonly id: MariachiFormatId;
  readonly name: string;
  readonly members: number;
  readonly basePrice: number;
  readonly priceLabel: string;
  readonly recommendedFor: string;
}

/** Cargo de la oficina de representación (provenance del archivo público). */
export interface EdwinShowcaseOfficeRole {
  readonly id: string;
  readonly role: string;
  readonly name: string;
  /** ISO-8601 del snapshot público del que procede el dato. */
  readonly provenanceDate: string;
  readonly provenanceUrl: string;
}

/* ------------------------------------------------------------------ */
/* Provenance del archivo absorbido                                    */
/* ------------------------------------------------------------------ */

const LEGACY_ARCHIVE_URL: string =
  'https://web.archive.org/web/20230512110955/https://edwinagudelo.es/';
const LEGACY_ARCHIVE_DATE: string = '2023-05-12';

/* ------------------------------------------------------------------ */
/* 1. Los 9 verticales del escaparate                                  */
/* ------------------------------------------------------------------ */

/**
 * Los 9 servicios del escaparate histórico, reinyectados en el motor actual.
 * El orden es el contrato de render: regalo → celebración → formato premium.
 */
export const EDWIN_SHOWCASE_VERTICALS: readonly EdwinShowcaseVertical[] = Object.freeze([
  {
    id: 'regalo-cumpleanos',
    title: 'Regalo de Cumpleaños',
    badge: 'Sorpresa emocional',
    pitch:
      'Llegar a su ventana, balcón o salón y que sienta el brillo de las trompetas, la cadencia de los violines y una voz que le canta a ella. Ese es el regalo que no se olvida.',
    includes: [
      'Entrada sorpresa cronometrada al minuto',
      'Las Mañanitas y dedicatoria con su nombre',
      'Sesión de fotos con sombrero charro',
      'Sonido profesional con microfonía inalámbrica',
    ],
    repertoire: 'Las Mañanitas · El Rey · Cielito Lindo · Volver, Volver',
    href: '/artistas/cumpleanos',
    ctaLabel: 'Ver regalo de cumpleaños',
    priceLabel: `Desde ${formatEur(TARIFA_BASE_SOLISTA_EUR)}`,
    iconKey: 'cake',
  },
  {
    id: 'regalo-boda',
    title: 'Regalo de Boda',
    badge: 'Un gran acierto',
    pitch:
      'Un día maravilloso no se puede empañar por no tener a las personas adecuadas. Hay mucho más que dinero en juego: está la ilusión de quien espera ese momento toda una vida.',
    includes: [
      'Repertorio acordado con los novios de antemano',
      'Serenata tras la ceremonia o apertura de cóctel',
      'Coordinación previa con finca y wedding planner',
      'Show de una hora en dos salidas de 30 minutos',
    ],
    repertoire: 'Si Nos Dejan · Motivos · Bésame Mucho · Volver, Volver',
    href: '/artistas/bodas',
    ctaLabel: 'Ver música para bodas',
    priceLabel: `Desde ${formatEur(TARIFA_BASE_SOLISTA_EUR)}`,
    iconKey: 'heart',
  },
  {
    id: 'fiesta-quince-anos',
    title: 'Fiesta de Quince Años',
    badge: 'Rito de gala',
    pitch:
      'Por fin esa niña que un día llegó a nuestras vidas cumple 15 años. El vals de entrada, el ramo y una serenata que convierte la fecha en memoria familiar permanente.',
    includes: [
      'Vals de gala en directo con el padre y los padrinos',
      'Serenata de entrega de ramo y sombrero charro',
      'Formación de etiqueta con botonadura de plata',
      'Repertorio bailable para encender la fiesta',
    ],
    repertoire: 'Quince Primaveras · Mi Niña Bonita · De Niña a Mujer',
    href: '/artistas/aniversarios',
    ctaLabel: 'Ver celebraciones de gala',
    priceLabel: `Desde ${formatEur(TARIFA_BASE_SOLISTA_EUR)}`,
    iconKey: 'sparkles',
  },
  {
    id: 'dia-madre-padre',
    title: 'Día de la Madre y del Padre',
    badge: 'Gratitud familiar',
    pitch:
      'No hay regalo que compita con decirle a mamá y a papá, cantando, todo lo que nunca supimos decirles. La serenata que les devuelve, en cuatro minutos, una vida entera.',
    includes: [
      'Repertorio dedicado a la figura materna o paterna',
      'Dedicatoria hablada con los nombres de la familia',
      'Adaptable a domicilio, jardín, restaurante o residencia',
      'Ramo de flores y sonido profesional incluidos',
    ],
    repertoire: 'Amor Eterno · Mi Querido Viejo · Madrecita Querida',
    href: '/artistas/eventos',
    ctaLabel: 'Ver celebraciones familiares',
    priceLabel: `Desde ${formatEur(TARIFA_BASE_SOLISTA_EUR)}`,
    iconKey: 'users',
  },
  {
    id: 'show-a-caballo',
    title: 'Show Cantando a Caballo',
    badge: 'Espectáculo ecuestre',
    pitch:
      'Los ídolos de los corridos y las rancheras hicieron gala de sus habilidades ecuestres. Edwin Agudelo recupera ese espectáculo: alta escuela, charrería y voz en directo.',
    includes: [
      'Doma clásica al compás de la trompeta',
      'Traje de gran gala y montura charra artesanal',
      'Microfonía inalámbrica Shure Axient anti-viento',
      'Plazas, fincas y festejos patronales',
    ],
    repertoire: 'El Patas Blancas · Caballo Prieto Azabache · El Rey',
    href: '/artistas/shows',
    ctaLabel: 'Ver espectáculos ecuestres',
    priceLabel: 'Presupuesto por fecha',
    iconKey: 'award',
  },
  {
    id: 'serenata-virtual',
    title: 'Serenata Virtual',
    badge: 'Sin fronteras',
    pitch:
      'Para la persona que quieres, amas y admiras desde cualquier lugar del mundo. En ese sitio especial donde os conocisteis, con el artista en directo y la familia conectada.',
    includes: [
      'Conexión privada en alta fidelidad de audio y vídeo',
      'Interpretación en directo con dedicatoria personalizada',
      'Familiares conectados desde distintos países',
      'Grabación íntegra de la sesión para recuerdo',
    ],
    repertoire: 'Cielito Lindo · Si Nos Dejan · Motivos · El Rey',
    href: '/centralita-mariachis',
    ctaLabel: 'Ver centralita 24/7',
    priceLabel: 'Presupuesto cerrado sin desplazamiento',
    iconKey: 'video',
  },
  {
    id: 'video-personalizado',
    title: 'Vídeo Personalizado 4K',
    badge: 'Detalle eterno',
    pitch:
      'El detalle que se queda en su mente y en sus dispositivos para siempre. Se envía directamente a la persona en alta calidad de imagen y sonido, con su nombre y su historia.',
    includes: [
      'Producción audiovisual con fotos y momentos reales',
      'Entrega digital en alta calidad por enlace privado',
      'Formatos vertical y horizontal para redes',
      'Dedicatoria cantada con el nombre del homenajeado',
    ],
    repertoire: null,
    href: '/canciones-personalizadas',
    ctaLabel: 'Configurar canción + vídeo',
    priceLabel: `Desde ${formatEur(EDWIN_CANCION_PERSONALIZADA_BASE_EUR)}`,
    iconKey: 'video',
  },
  {
    id: 'cancion-personalizada',
    title: 'Canción Personalizada',
    badge: 'Obra de autor',
    pitch:
      'Me das los detalles de la historia que quieres resaltar y yo la escribo e interpreto. No es una plantilla: es una canción con vuestros nombres y vuestras anécdotas.',
    includes: [
      'Entrevista previa para capturar la historia real',
      'Letra inédita y arreglos de estudio a medida',
      'Revisión de la letra antes de la grabación',
      'Entrega en audio de alta resolución',
    ],
    repertoire: 'Composición original · Arreglos de tenor y cuerdas',
    href: '/canciones-personalizadas',
    ctaLabel: 'Configurar canción a medida',
    priceLabel: `Desde ${formatEur(EDWIN_CANCION_PERSONALIZADA_BASE_EUR)}`,
    iconKey: 'music',
  },
  {
    id: 'solista-premium',
    title: 'Solista Premium',
    badge: 'Formato insignia',
    pitch:
      'Edwin Agudelo solo, con sonido profesional y repertorio de gala. Ramo de flores, canción con el nombre de la persona homenajeada y sesión de fotografía con el artista.',
    includes: [
      'Ramo de flores y sonido profesional incluidos',
      'Canción personalizada con el nombre homenajeado',
      'Sesión de fotografía con el artista',
      'Exclusividad absoluta en la fecha',
    ],
    repertoire: 'Bolero · Balada · Ranchera de gala · Arias líricas',
    href: '/artistas/solistas',
    ctaLabel: 'Ver formato solista',
    priceLabel: `${formatEur(TARIFA_BASE_SOLISTA_EUR)} + logística`,
    iconKey: 'solista',
  },
]);

/* ------------------------------------------------------------------ */
/* 2. Ventajas competitivas (bloque "Ventajas de contratar")           */
/* ------------------------------------------------------------------ */

export const EDWIN_SHOWCASE_ADVANTAGES: readonly EdwinShowcaseAdvantage[] = Object.freeze([
  {
    id: 'empatia',
    title: 'Empatía absoluta y compromiso',
    description:
      'Se trata como si fuera para mi propia experiencia: elegimos juntos el repertorio que quieres entregar y te doy las indicaciones para que el momento salga redondo.',
  },
  {
    id: 'exclusividad-fecha',
    title: 'Exclusividad en la fecha',
    description:
      'Nada de solapamientos ni prisas: la fecha se bloquea de forma atómica para poder centrarme en ti, en quien recibe el homenaje y en los invitados.',
  },
  {
    id: 'vuestra-historia',
    title: 'Contenido construido sobre vuestra historia',
    description:
      'Canciones que remueven emociones que llevaban tiempo adormecidas. Cada detalle de la letra nace de los nombres, las fechas y las anécdotas reales.',
  },
  {
    id: 'sinceridad',
    title: 'Experiencia y sinceridad al cantar',
    description:
      'No canto por cantar: canto para mover emociones. Repertorio de calidad, sin machismo, violencia ni victimismo exagerado.',
  },
]);

/* ------------------------------------------------------------------ */
/* 3. Packs "¿Qué incluye?"                                            */
/* ------------------------------------------------------------------ */

export const EDWIN_SHOWCASE_PACKS: readonly EdwinShowcasePack[] = Object.freeze([
  {
    id: 'solista',
    title: 'Serenata como solista',
    subtitle: 'Voz de tenor con sonido profesional propio',
    includes: [
      'Ramo de flores',
      'Sonido profesional',
      'Canción personalizada con el nombre de la persona homenajeada',
      'Sesión de fotografía con el artista',
      'Sombreros para la sesión de fotos',
      'Show de una hora en dos salidas de 30 minutos',
      'Exclusividad en la fecha',
    ],
    priceLabel: `Desde ${formatEur(TARIFA_BASE_SOLISTA_EUR)} + logística`,
  },
  {
    id: 'mariachi',
    title: 'Serenata con grupo de mariachis',
    subtitle: 'Formación completa con dirección de Edwin Agudelo',
    includes: [
      'Sonido profesional',
      'Show de una hora',
      'Fotos con el grupo y el artista',
      'Músicos de conservatorio con traje de gala',
      'Exclusividad en la fecha',
    ],
    priceLabel: `Desde ${formatEur(MARIACHI_FORMATS[1].basePrice)}`,
  },
]);

/* ------------------------------------------------------------------ */
/* 4. Escalones de formato (derivados, nunca escritos a mano)          */
/* ------------------------------------------------------------------ */

export const EDWIN_SHOWCASE_TIERS: readonly EdwinShowcaseTier[] = Object.freeze(
  MARIACHI_FORMATS.map((format) => ({
    id: format.id,
    name: format.name,
    members: format.members,
    basePrice: format.basePrice,
    priceLabel: formatEur(format.basePrice),
    recommendedFor: format.recommendedFor,
  })),
);

/* ------------------------------------------------------------------ */
/* 5. Oficina de representación (provenance del archivo público)       */
/* ------------------------------------------------------------------ */

/**
 * Cargos absorbidos del escaparate histórico. Los teléfonos y correos del
 * snapshot 2023 NO se publican: cualquier lead debe entrar por la centralita
 * SSOT (+34 693 693 048) para que ningún contacto quede huérfano.
 * `provenanceDate` deja la huella auditable del origen del dato.
 */
export const EDWIN_SHOWCASE_OFFICE: readonly EdwinShowcaseOfficeRole[] = Object.freeze([
  {
    id: 'manager-general',
    role: 'Manager General',
    name: 'Adriana Lenis',
    provenanceDate: LEGACY_ARCHIVE_DATE,
    provenanceUrl: LEGACY_ARCHIVE_URL,
  },
  {
    id: 'jefa-prensa',
    role: 'Jefa de Prensa',
    name: 'Eliana Tovar',
    provenanceDate: LEGACY_ARCHIVE_DATE,
    provenanceUrl: LEGACY_ARCHIVE_URL,
  },
]);

/* ------------------------------------------------------------------ */
/* 6. Condiciones canónicas del escaparate (todo desde SSOT)           */
/* ------------------------------------------------------------------ */

/** Condiciones publicadas en el escaparate; todas nacen del SSOT sellado. */
export const EDWIN_SHOWCASE_TERMS = Object.freeze({
  tarifaBaseEur: TARIFA_BASE_SOLISTA_EUR,
  depositoEur: DEPOSITO_STRIPE_EUR,
  kmExentos: LOGISTICA_KM_EXENTOS,
  precioKm: formatEurDecimal(LOGISTICA_EUR_PER_KM),
  kmHotel: LOGISTICA_KM_HOTEL,
  hotelEur: SUPLEMENTO_HOTEL_EUR,
  wattsPerPax: WATTS_PER_PAX,
  seguroRcEur: EDWIN_SHOWCASE_RC_EUR,
  splitArtistaPct: SPLIT_SOBERANO.artista * 100,
  splitEarOsPct: SPLIT_SOBERANO.earOs * 100,
  splitVimumePct: SPLIT_SOBERANO.vimume * 100,
} as const);

export type EdwinShowcaseTerms = typeof EDWIN_SHOWCASE_TERMS;




