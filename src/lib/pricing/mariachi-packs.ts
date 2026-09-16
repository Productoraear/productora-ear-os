import crypto from 'crypto';

export interface MariachiPack {
  id: 'trio-serenata' | 'quinteto-nupcial' | 'mariachi-monumental';
  name: string;
  musiciansCount: number;
  basePrice: number; // Precio base en Euros
  depositAmount: number; // Depósito de reserva fija (100,00 €)
  durationMinutes: number;
  acousticRiderWatts: number; // 12 W/pax homologado
  maxSplLimitDb: number; // Límite legal < 75 dB SPL
  description: string;
  includedFeatures: string[];
  recommendedPax: string;
}

export const MARIACHI_PACKS: Record<string, MariachiPack> = {
  'trio-serenata': {
    id: 'trio-serenata',
    name: 'Trío Serenata Íntima',
    musiciansCount: 3,
    basePrice: 450,
    depositAmount: 100,
    durationMinutes: 45,
    acousticRiderWatts: 480, // Bose S1 Pro (hasta 40 pax)
    maxSplLimitDb: 74,
    description: 'Formato acústico cálido para cócteles, entradas nupciales y aniversarios.',
    includedFeatures: [
      '3 Músicos solistas (Guitarrón, Vihuela, Trompeta/Voz)',
      'Repertorio tradicional mexicano y baladas',
      'Sonido portátil Bose S1 Pro (<75 dB)',
      'Precio cerrado sin comisiones ocultas'
    ],
    recommendedPax: 'Hasta 40 personas'
  },
  'quinteto-nupcial': {
    id: 'quinteto-nupcial',
    name: 'Quinteto Imperial Nupcial (S-Class)',
    musiciansCount: 5,
    basePrice: 750,
    depositAmount: 100,
    durationMinutes: 60,
    acousticRiderWatts: 1200, // Bose F1 812
    maxSplLimitDb: 74.8,
    description: 'La formación estrella para bodas y fincas de lujo. Potencia vocal y balance acústico homologado.',
    includedFeatures: [
      '5 Músicos de gala (2 Trompetas, Guitarrón, Vihuela, Violín/Voz)',
      'Llegada sorpresa y serenata nupcial',
      'Microfonía Shure Beta 87A y PA Bose F1',
      'Certificado acústico de cumplimiento <75 dB para la finca'
    ],
    recommendedPax: '40 a 120 personas'
  },
  'mariachi-monumental': {
    id: 'mariachi-monumental',
    name: 'Mariachi Monumental de Gala',
    musiciansCount: 8,
    basePrice: 1300,
    depositAmount: 100,
    durationMinutes: 90,
    acousticRiderWatts: 2400,
    maxSplLimitDb: 74.9,
    description: 'Espectáculo escénico total para grandes fincas y celebraciones de alto impacto.',
    includedFeatures: [
      '8 Músicos en escena (Sección completa de cuerdas y metales)',
      'Show interactivo con invitados y novios',
      'Técnico de sonido en vivo dedicado',
      'Seguro de responsabilidad civil y homologación B2B'
    ],
    recommendedPax: 'Más de 120 personas'
  }
};

/**
 * Genera un token Price-Lock SHA-256 inmutable válido por 48 horas
 */
export function generatePriceLockToken(packId: string, eventDate: string, clientPhone: string): {
  token: string;
  expiresAt: string;
  depositRequired: number;
} {
  const secret = process.env.NEXTAUTH_SECRET || 'EAR_OS_PRICE_LOCK_KEY_2026';
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
  
  const payload = `${packId}:${eventDate}:${clientPhone}:${expiresAt}:${secret}`;
  const token = crypto.createHash('sha256').update(payload).digest('hex');

  return {
    token,
    expiresAt,
    depositRequired: 100 // Depósito inmutable de 100,00 € en Stripe
  };
}
