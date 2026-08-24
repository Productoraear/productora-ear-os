/**
 * 🏛️ MASTER STRIPE PRODUCTS & SERVICES REGISTRY (SSOT)
 * Catálogo maestro de productos, servicios, tarifas y suscripciones vinculadas a Stripe en EAR OS.
 * Define SKUs, conceptos de facturación, depósitos Smart-Lock, precios base y split soberano 80/10/10.
 */

export interface StripeProductDefinition {
  id: string;
  sku: string;
  name: string;
  category: 'ARTISTAS_FREEMIUM' | 'PROVEEDORES_B2B' | 'B2G_AYUNTAMIENTOS' | 'BODAS_Y_EVENTOS' | 'SONIDO_E_ILUMINACION' | 'LOGISTICA_VIP';
  priceEur: number;
  unitAmountCents: number;
  billingType: 'ONE_TIME_PAYMENT' | 'SMART_LOCK_DEPOSIT' | 'SUBSCRIPTION_RECURRING' | 'SPLIT_SETTLEMENT';
  split: {
    providerPercent: number; // 80%
    platformEarPercent: number; // 10%
    affiliateVimumePercent: number; // 10%
  };
  description: string;
  targetLandings: string[];
  checkoutAction: string;
}

export const STRIPE_MASTER_CATALOG: Record<string, StripeProductDefinition> = {
  // 1. EMBกระDO ARTISTAS & CLAIM
  ARTIST_VERIFICATION: {
    id: 'prod_artist_verification_sclass',
    sku: 'EAR-ART-VERIF-01',
    name: 'Validación de Artista S-Class (Claim de Perfil & Regalías)',
    category: 'ARTISTAS_FREEMIUM',
    priceEur: 1.00,
    unitAmountCents: 100,
    billingType: 'ONE_TIME_PAYMENT',
    split: { providerPercent: 0, platformEarPercent: 100, affiliateVimumePercent: 0 },
    description: 'Verificación oficial de identidad y activación del conector CUE Bridge para reparto de regalías.',
    targetLandings: ['/artistas/reclamar-regalias', '/artistas/dashboard', '/reclamar-perfil'],
    checkoutAction: 'createArtistVerificationCheckout'
  },

  // 2. SUPPLIER BLUR-LOCK (B2B)
  SUPPLIER_CONTACT_UNLOCK: {
    id: 'prod_supplier_blur_lock_10',
    sku: 'EAR-SUP-LOCK-10',
    name: 'Smart-Lock 72h · Desbloqueo Ficha y Contacto Directo',
    category: 'PROVEEDORES_B2B',
    priceEur: 10.00,
    unitAmountCents: 1000,
    billingType: 'SMART_LOCK_DEPOSIT',
    split: { providerPercent: 0, platformEarPercent: 100, affiliateVimumePercent: 0 },
    description: 'Acceso inmediato a los datos de contacto directo auditados y activación de la Garantía de 0 Fallos.',
    targetLandings: ['/proveedores', '/proveedores/[slug]'],
    checkoutAction: 'createSupplierUnlockCheckout'
  },

  // 3. LICITACIONES PÚBLICAS B2G & ALUMBRADO
  B2G_LIGHTING_SMART_LOCK: {
    id: 'prod_b2g_lighting_smart_lock',
    sku: 'EAR-B2G-LIGHT-10',
    name: 'Smart-Lock 72h · Bloqueo de Stock & Tarifa LCSP',
    category: 'B2G_AYUNTAMIENTOS',
    priceEur: 10.00,
    unitAmountCents: 1000,
    billingType: 'SMART_LOCK_DEPOSIT',
    split: { providerPercent: 0, platformEarPercent: 100, affiliateVimumePercent: 0 },
    description: 'Reserva oficial de stock de fábrica y emisión de memoria técnica visada para pliegos públicos.',
    targetLandings: ['/arsenal/luces-navidad', '/corporativo/alquiler-pantallas-led-madrid'],
    checkoutAction: 'createB2GLightingCheckout'
  },

  // 4. SMART-LOCK 72H RESERVA DE FECHA GENERAL
  SMART_LOCK_EVENT_DEPOSIT: {
    id: 'prod_smart_lock_deposit_10',
    sku: 'EAR-EVENT-LOCK-10',
    name: 'Smart-Lock 72h · Bloqueo de Fecha & Presupuesto Garantizado',
    category: 'BODAS_Y_EVENTOS',
    priceEur: 10.00,
    unitAmountCents: 1000,
    billingType: 'SMART_LOCK_DEPOSIT',
    split: { providerPercent: 0, platformEarPercent: 100, affiliateVimumePercent: 0 },
    description: 'Bloqueo exclusivo de fecha en calendario de producción con Price-Lock SHA-256 compensable en liquidación final.',
    targetLandings: ['/bodas/madrid/dj-eventos', '/bodas/[provincia]/[servicio]', '/cotizador'],
    checkoutAction: 'createSmartLockCheckout'
  },

  // 5. CACHÉ SOLISTA BASE (EDWIN AGUDELO)
  ARTIST_SOLO_EDWIN_AGUDELO: {
    id: 'prod_artist_edwin_agudelo_base',
    sku: 'EAR-ROSTER-EA-350',
    name: 'Contratación Oficial Solista · Edwin Agudelo',
    category: 'BODAS_Y_EVENTOS',
    priceEur: 350.00,
    unitAmountCents: 35000,
    billingType: 'SPLIT_SETTLEMENT',
    split: { providerPercent: 80, platformEarPercent: 10, affiliateVimumePercent: 10 },
    description: 'Actuación musical solista en directo con repertorio S-Class y calibración acústica de 12 W/pax (+0,75 €/km).',
    targetLandings: ['/artistas/edwin-agudelo', '/artistas/[slug]', '/checkout/presupuesto'],
    checkoutAction: 'createBookingCheckout'
  },

  // 6. PACKS DE SONIDO E ILUMINACIÓN HOMOLOGADOS (+20% EAR)
  PACK_SONIDO_1_300W: {
    id: 'prod_pack_sonido_1',
    sku: 'EAR-SON-PK01',
    name: 'Pack Sonido 1 · 2x Altavoces 300W RMS',
    category: 'SONIDO_E_ILUMINACION',
    priceEur: 84.00,
    unitAmountCents: 8400,
    billingType: 'SPLIT_SETTLEMENT',
    split: { providerPercent: 80, platformEarPercent: 10, affiliateVimumePercent: 10 },
    description: 'Sonorización básica para ceremonias y eventos hasta 50 PAX.',
    targetLandings: ['/proveedores/prov-sonomusic-madrid-official', '/cotizador'],
    checkoutAction: 'POST /api/payments/checkout'
  },
  PACK_SONIDO_4_1000W: {
    id: 'prod_pack_sonido_4',
    sku: 'EAR-SON-PK04',
    name: 'Pack Sonido 4 · 2x Columnas PA 1000W RMS',
    category: 'SONIDO_E_ILUMINACION',
    priceEur: 168.00,
    unitAmountCents: 16800,
    billingType: 'SPLIT_SETTLEMENT',
    split: { providerPercent: 80, platformEarPercent: 10, affiliateVimumePercent: 10 },
    description: 'Sistema estilizado de alta inteligibilidad vocal para cócteles y eventos hasta 150 PAX.',
    targetLandings: ['/proveedores/prov-sonomusic-madrid-official', '/cotizador'],
    checkoutAction: 'POST /api/payments/checkout'
  },
  PACK_DISCOMOVIL_1: {
    id: 'prod_pack_discomovil_1',
    sku: 'EAR-SON-DM01',
    name: 'Pack Discomóvil 1 · Cabina DJ + PA + Iluminación LED',
    category: 'SONIDO_E_ILUMINACION',
    priceEur: 432.00,
    unitAmountCents: 43200,
    billingType: 'SPLIT_SETTLEMENT',
    split: { providerPercent: 80, platformEarPercent: 10, affiliateVimumePercent: 10 },
    description: 'Montaje integral de discomóvil con cabina, sonido profesional y efectos de iluminación.',
    targetLandings: ['/bodas/madrid/dj-eventos', '/proveedores/prov-sonomusic-madrid-official', '/cotizador'],
    checkoutAction: 'POST /api/payments/checkout'
  },
  PACK_DISCOMOVIL_2_PREMIUM: {
    id: 'prod_pack_discomovil_2',
    sku: 'EAR-SON-DM02',
    name: 'Pack Discomóvil 2 Premium · Gran Formato',
    category: 'SONIDO_E_ILUMINACION',
    priceEur: 1008.00,
    unitAmountCents: 100800,
    billingType: 'SPLIT_SETTLEMENT',
    split: { providerPercent: 80, platformEarPercent: 10, affiliateVimumePercent: 10 },
    description: 'Producción de fiesta de gran envergadura con cabezas móviles DMX, truss y subwoofer reforzado.',
    targetLandings: ['/bodas/madrid/dj-eventos', '/proveedores/prov-sonomusic-madrid-official', '/cotizador'],
    checkoutAction: 'POST /api/payments/checkout'
  },
  PACK_CONCIERTO_3: {
    id: 'prod_pack_concierto_3',
    sku: 'EAR-SON-CC03',
    name: 'Pack Concierto 3 · Producción Escenario Mediano',
    category: 'SONIDO_E_ILUMINACION',
    priceEur: 1680.00,
    unitAmountCents: 168000,
    billingType: 'SPLIT_SETTLEMENT',
    split: { providerPercent: 80, platformEarPercent: 10, affiliateVimumePercent: 10 },
    description: 'Sonorización completa para bandas y festivales con microfonía Shure, monitores de suelo y técnico FOH.',
    targetLandings: ['/proveedores/prov-sonomusic-madrid-official', '/cotizador'],
    checkoutAction: 'POST /api/payments/checkout'
  },

  // 7. MARIACHIS & MÚSICA EN VIVO
  MARIACHI_MEXICANTO: {
    id: 'prod_mariachi_mexicanto',
    sku: 'EAR-MAR-MEX-290',
    name: 'Mariachi Mexicanto S-Class (Formato 4 Músicos)',
    category: 'BODAS_Y_EVENTOS',
    priceEur: 290.00,
    unitAmountCents: 29000,
    billingType: 'SPLIT_SETTLEMENT',
    split: { providerPercent: 80, platformEarPercent: 10, affiliateVimumePercent: 10 },
    description: 'Show de mariachi tradicional mexicano en directo para bodas, cumpleaños y serenatas.',
    targetLandings: ['/bodas/madrid/musica-en-directo', '/checkout/presupuesto', '/cotizador'],
    checkoutAction: 'POST /api/payments/checkout'
  },
  MARIACHI_VARGAS_MADRID: {
    id: 'prod_mariachi_vargas',
    sku: 'EAR-MAR-VAR-350',
    name: 'Mariachi Vargas de Madrid (Formato Quinteto Gran Gala)',
    category: 'BODAS_Y_EVENTOS',
    priceEur: 350.00,
    unitAmountCents: 35000,
    billingType: 'SPLIT_SETTLEMENT',
    split: { providerPercent: 80, platformEarPercent: 10, affiliateVimumePercent: 10 },
    description: 'Quinteto de gala con trompetas, vihuela, guitarrón y voces armonizadas.',
    targetLandings: ['/bodas/madrid/musica-en-directo', '/checkout/presupuesto', '/cotizador'],
    checkoutAction: 'POST /api/payments/checkout'
  },

  // 8. LOGÍSTICA VIP & CHÓFER
  CHAUFFEUR_VIP_TRANSFER: {
    id: 'prod_chauffeur_vip_transfer',
    sku: 'EAR-LOG-TRF-120',
    name: 'Transfer Aeropuerto Madrid-Barajas VIP (Mercedes Clase E/V)',
    category: 'LOGISTICA_VIP',
    priceEur: 120.00,
    unitAmountCents: 12000,
    billingType: 'SPLIT_SETTLEMENT',
    split: { providerPercent: 80, platformEarPercent: 10, affiliateVimumePercent: 10 },
    description: 'Traslado privado en vehículo de alta gama con chófer profesional bilingüe.',
    targetLandings: ['/corporativo/alquiler-vehiculos-vip-madrid', '/checkout/presupuesto'],
    checkoutAction: 'POST /api/payments/checkout'
  }
};

/**
 * Helper para backward-compatibility
 */
export const STRIPE_PRODUCTS = {
  artistVerification: {
    id: STRIPE_MASTER_CATALOG.ARTIST_VERIFICATION.id,
    price: STRIPE_MASTER_CATALOG.ARTIST_VERIFICATION.unitAmountCents,
    name: STRIPE_MASTER_CATALOG.ARTIST_VERIFICATION.name
  },
  supplierUnlock: {
    id: STRIPE_MASTER_CATALOG.SUPPLIER_CONTACT_UNLOCK.id,
    price: STRIPE_MASTER_CATALOG.SUPPLIER_CONTACT_UNLOCK.unitAmountCents,
    name: STRIPE_MASTER_CATALOG.SUPPLIER_CONTACT_UNLOCK.name
  },
  smartLock: {
    id: STRIPE_MASTER_CATALOG.SMART_LOCK_EVENT_DEPOSIT.id,
    price: STRIPE_MASTER_CATALOG.SMART_LOCK_EVENT_DEPOSIT.unitAmountCents,
    name: STRIPE_MASTER_CATALOG.SMART_LOCK_EVENT_DEPOSIT.name
  }
};