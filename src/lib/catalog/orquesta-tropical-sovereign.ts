/**
 * ══════════════════════════════════════════════════════════════════════════════
 * EAR OS — REGISTRO CORPORATIVO: GRAN ORQUESTA TROPICAL LATINA (DOBLE FICHA)
 * ══════════════════════════════════════════════════════════════════════════════
 * SEGUNDA CUENTA CORPORATIVA DEL SISTEMA S-CLASS (DOCTRINA SUPREMA DE SOBERANÍA)
 * 
 * Régimen Económico Blindado:
 * - Opción 1: Fijo Anual de 5.000,00 € + IVA (Tarifa Plana en 2 cuotas de 2.500 €).
 * - Opción 2: Canon de Digitalización de 2.500,00 € + 15% sobre FACTURACIÓN BRUTA cerrada por pasarela.
 * - PROHIBICIÓN CONSTITUCIONAL: Prohibido pactar porcentajes sobre "beneficios netos".
 * 
 * Doble Ficha:
 *  1. FICHA ARTÍSTICA: Gran Orquesta de 13 músicos en vivo (repertorio cumbia, salsa, tropical).
 *     Canal prioritario: Ayuntamientos y Fiestas Patronales (Contratos Menores Art. 118 LCSP < 14.250 €)
 *     y festivales de comunidades culturales (Ecuador, Colombia, verbenas de verano).
 *  2. FICHA TÉCNICA: Alquiler de Sonido Line Array suspendido para exteriores + 
 *     Sistema de sonido de sala/club para discotecas + Puente de iluminación DMX.
 * ══════════════════════════════════════════════════════════════════════════════
 */

import { SAFE_LCSP_CEILING_EUR, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

export interface OrquestaArtisticProfile {
  readonly id: 'gran-orquesta-tropical-latina';
  readonly name: string;
  readonly category: 'ORQUESTA_GALA' | 'MUSICA_DIRECTO';
  readonly musiciansCount: 13;
  readonly genres: readonly string[];
  readonly description: string;
  readonly basePerformancePriceEur: number;
  readonly maxLcspCeilingEur: number;
  readonly depositEur: number;
  readonly highlights: readonly string[];
  readonly targetChannels: readonly string[];
}

export interface OrquestaTechnicalProfile {
  readonly id: 'sonido-line-array-tropical';
  readonly name: string;
  readonly category: 'LINE_ARRAY' | 'SONORIZACION_PROFESIONAL' | 'ILUMINACION_DMX';
  readonly systems: readonly {
    readonly type: 'EXTERIOR_LINE_ARRAY' | 'INTERIOR_SALA_DISCOTECA' | 'PUENTE_ILUMINACION';
    readonly name: string;
    readonly powerWattsRms: number;
    readonly maxPaxCoverage: number;
    readonly dailyPriceEur: number;
    readonly description: string;
  }[];
  readonly technicalFeatures: readonly string[];
  readonly acousticHomologationDb: number;
}

export interface OrquestaCorporateAccount {
  readonly accountId: 'corp-orquesta-latina-002';
  readonly commercialName: string;
  readonly legalStatus: 'SOCIEDAD_MUSICAL_VERIFICADA';
  readonly economicModel: {
    readonly flatAnnualFeeEur: 5000;
    readonly hybridSetupFeeEur: 2500;
    readonly hybridGrossCommissionRate: 0.15;
    readonly strictGrossBillingOnly: true;
  };
  readonly artisticProfile: OrquestaArtisticProfile;
  readonly technicalProfile: OrquestaTechnicalProfile;
}

export const GRAN_ORQUESTA_TROPICAL_ACCOUNT: Readonly<OrquestaCorporateAccount> = Object.freeze({
  accountId: 'corp-orquesta-latina-002',
  commercialName: 'Gran Orquesta Tropical Latina & Sonido Line Array',
  legalStatus: 'SOCIEDAD_MUSICAL_VERIFICADA',
  economicModel: Object.freeze({
    flatAnnualFeeEur: 5000,
    hybridSetupFeeEur: 2500,
    hybridGrossCommissionRate: 0.15,
    strictGrossBillingOnly: true,
  }),
  artisticProfile: Object.freeze({
    id: 'gran-orquesta-tropical-latina',
    name: 'Gran Orquesta Tropical Latina (13 Músicos)',
    category: 'ORQUESTA_GALA',
    musiciansCount: 13,
    genres: Object.freeze([
      'Cumbia Colombiana y Ecuatoriana',
      'Salsa Clásica y de Golpe',
      'Merengue Dominicano de Gala',
      'Repertorio Verbena & Fiestas Populares',
      'Bachata y Música Latina Bailable',
    ]),
    description:
      'Formación monumental de 13 músicos profesionales en riguroso directo: sección completa de metales (trompetas, trombones, saxo), percusión mayor y menor (congas, timbales, güira), armonía en vivo y 4 voces solistas de primera línea. Especialistas en macro-conciertos populares, ferias de agosto, fiestas patronales y festivales de integración cultural.',
    basePerformancePriceEur: 3800,
    maxLcspCeilingEur: SAFE_LCSP_CEILING_EUR, // 14.250 € Art. 118 LCSP
    depositEur: DEPOSITO_STRIPE_EUR,
    highlights: Object.freeze([
      '13 Músicos en directo (cero pistas pregrabadas)',
      'Sonido Line Array y puente de iluminación propio incluido en el rider',
      'Habilitados para Contratación Menor Art. 118 LCSP con Ayuntamientos',
      'Repertorio de alta fidelidad para festivales de Ecuador, Colombia y fiestas patronales',
    ]),
    targetChannels: Object.freeze([
      'Concejalías de Festejos y Ayuntamientos (Contratos menores directos)',
      'Asociaciones culturales y promotores de festivales latinos',
      'Comisiones de fiestas y fiestas patronales de verano',
      'Salas de gala y macro-eventos privados de empresa',
    ]),
  }),
  technicalProfile: Object.freeze({
    id: 'sonido-line-array-tropical',
    name: 'Pack Técnico: Line Array Suspendido + Sala Discoteca + Iluminación',
    category: 'LINE_ARRAY',
    systems: Object.freeze([
      {
        type: 'EXTERIOR_LINE_ARRAY' as const,
        name: 'Sistema Line Array Suspendido para Exteriores y Plazas',
        powerWattsRms: 18000,
        maxPaxCoverage: 5000,
        dailyPriceEur: 1800,
        description:
          'Arreglo lineal suspendido con subwoofers de doble 18 pulgadas, procesador digital DSP y tiro de largo alcance para plazas de toros, recintos feriales y festivales abiertos.',
      },
      {
        type: 'INTERIOR_SALA_DISCOTECA' as const,
        name: 'Sistema de Pegada para Recintos Cerrados y Discotecas',
        powerWattsRms: 6000,
        maxPaxCoverage: 800,
        dailyPriceEur: 650,
        description:
          'PA compacta de alto impacto para salas de conciertos, discotecas, bodegas y pabellones cerrados con pegada contundente y cobertura uniforme.',
      },
      {
        type: 'PUENTE_ILUMINACION' as const,
        name: 'Puente de Iluminación Robótica DMX & Efectos',
        powerWattsRms: 3500,
        maxPaxCoverage: 3000,
        dailyPriceEur: 450,
        description:
          'Estructura truss de 6 a 12 metros, cabezas móviles beam/spot wash, barras LED y máquina de niebla para ambientación de escenario y pista.',
      },
    ] as const),
    technicalFeatures: Object.freeze([
      'Técnico de sonido e iluminación titulado incluido en cada alquiler',
      'Transporte y montaje homologado según normativa vigente',
      'Microfonía inalámbrica profesional Shure / Sennheiser de alta gama',
      'Compatibilidad con riders técnicos de cualquier banda o discomóvil',
    ]),
    acousticHomologationDb: 95,
  }),
});
