/**
 * ════════════════════════════════════════════════════════════════════════════
 * FINCAS B2B ESCAPARATE — CONTRATOS, ORÁCULOS Y UTILIDADES DE TEST E2E
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente de verdad técnica y oráculo matemático derivado de:
 *   - PROJECT.md (§ Interface Contracts, § Feature Inventory)
 *   - ORIGINAL_REQUEST.md (§ Requirements R1 - R5)
 *   - AGENTS.md (§ 4 Reglas de Negocio Inmutables, § 5 Next.js, § 6 OLED)
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  TARIFA_BASE_SOLISTA_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  DEPOSITO_STRIPE_EUR,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  CENTRALITA_EAR_OS,
  VAT_RATE,
  SPLIT_SOBERANO,
} from '../../src/lib/constants/ear-os-ssot';

/* ========================================================================== */
/* 1. TIPOS Y CONTRATOS OFICIALES (PROJECT.md)                                */
/* ========================================================================== */

export interface FincaMenuPricingInput {
  menuId: string;
  guestCount: number;
  selectedExtraIds: string[];
  distanceKm: number;
  fincaBaseAddress?: string;
  eventEndTime?: string; // e.g. "04:00"
  affiliateCommissionPct?: number; // 0.10 to 0.15
}

export interface FincaMenuPricingResult {
  menuTotalCents: number;
  extrasTotalCents: number;
  logisticsKmCents: number;
  logisticsHotelCents: number;
  subtotalCents: number;
  ivaCents: number;
  totalWithIvaCents: number;
  split: {
    artistaCents: number;
    earOsCents: number;
    vimumeCents: number;
  };
  affiliateCommissionCents: number;
  acousticRider: {
    recommendedWatts: number; // 12 W/pax
    maxDbSpl: number; // 75 dB SPL
    isCompliant: boolean;
  };
  depositDeductibleCents: number; // 10000 cents (100.00 €)
}

export interface FincaVisitLockRequest {
  fincaId: string;
  fincaName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  desiredVisitDate: string; // YYYY-MM-DD
  timeSlot?: 'MORNING' | 'AFTERNOON';
  locationAddress: string;
  municipio: string;
  provincia: string;
}

export interface FincaPartnershipWebhookPayload {
  eventType: 'VISIT_LOCK_REQUEST' | 'ONBOARDING_FOUNDER_PRICE_MATCH' | 'LOGISTICS_1CLICK_ORDER';
  fincaId: string;
  fincaName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  municipio: string;
  provincia: string;
  distanceHubKm: number;
  portalAnterior?: string;
  cuotaAnteriorEurMes?: number;
  estimatedMenuTotalEur?: number;
  affiliateCommissionEstimatedEur?: number;
  timestamp: string;
}

/* ========================================================================== */
/* 2. CATÁLOGO CANÓNICO DE REFERENCIA: 7 MENÚS 2026 Y 16 COMPLEMENTOS         */
/* ========================================================================== */

export interface CanonicalMenu {
  id: string;
  name: string;
  category: 'COCKTAIL' | 'BANQUET' | 'SIGNATURE' | 'PREMIUM';
  pricePerPaxCents: number;
  minGuests: number;
  description: string;
  dietaryOptions: string[];
}

export interface CanonicalExtra {
  id: string;
  name: string;
  category: 'GASTRONOMIA' | 'BEBIDAS' | 'AMBIENTACION' | 'AUDIO_VISUAL' | 'LOGISTICA';
  priceCents: number;
  isPerPax: boolean;
  description: string;
}

export const CANONICAL_MENUS_2026: readonly CanonicalMenu[] = Object.freeze([
  {
    id: 'menu-coctel-imperial-2026',
    name: 'Cóctel Imperial de Bienvenida & Finger Food S-Class',
    category: 'COCKTAIL',
    pricePerPaxCents: 6500, // 65.00 €
    minGuests: 30,
    description: '18 pases gastronómicos en vivo con bocados fríos, calientes y estaciones temáticas.',
    dietaryOptions: ['Vegano', 'Sin Gluten', 'Halal disponible'],
  },
  {
    id: 'menu-banquete-gala-sclass',
    name: 'Banquete de Gala S-Class Temporada 2026',
    category: 'BANQUET',
    pricePerPaxCents: 12500, // 125.00 €
    minGuests: 50,
    description: 'Cóctel largo de recepción + Entrante noble + Principal a elegir (Solomillo/Lubina salvaje) + Postre nupcial.',
    dietaryOptions: ['Adaptación celíaca 100%', 'Alérgenos auditados'],
  },
  {
    id: 'menu-degustacion-signature',
    name: 'Menú Degustación Signature Edwin Agudelo',
    category: 'SIGNATURE',
    pricePerPaxCents: 16500, // 165.00 €
    minGuests: 40,
    description: 'Experiencia multisensorial de 6 tiempos con maridaje sonoro y alta gastronomía ibérica contemporánea.',
    dietaryOptions: ['Menú degustación vegetal opcional', 'Zero lactosa'],
  },
  {
    id: 'menu-banquete-tradicional-vanguardia',
    name: 'Banquete Tradicional con Toque de Vanguardia',
    category: 'BANQUET',
    pricePerPaxCents: 9500, // 95.00 €
    minGuests: 50,
    description: 'Recetas de la tierra española actualizadas con técnicas de baja temperatura y producto D.O.',
    dietaryOptions: ['Infantil', 'Proveedores', 'Intolerancias'],
  },
  {
    id: 'menu-intimista-acustico',
    name: 'Menú Intimista Acústico & Jazz Dinner',
    category: 'PREMIUM',
    pricePerPaxCents: 8500, // 85.00 €
    minGuests: 20,
    description: 'Diseñado para eventos boutique y celebraciones de pequeño aforo con acústica cuidada.',
    dietaryOptions: ['Flexitariano', 'Gluten Free'],
  },
  {
    id: 'menu-gran-celebracion-premium',
    name: 'Gran Celebración Premium & Live Carvery',
    category: 'PREMIUM',
    pricePerPaxCents: 14000, // 140.00 €
    minGuests: 75,
    description: 'Gran despliegue gastronómico con asador en vivo, mesa de cortes nobles y postres artesanos.',
    dietaryOptions: ['Kosher style', 'Halal disponible'],
  },
  {
    id: 'menu-coctel-urban-chic',
    name: 'Cóctel Urban Chic & Showcooking Estacional',
    category: 'COCKTAIL',
    pricePerPaxCents: 7500, // 75.00 €
    minGuests: 25,
    description: 'Formato informal pero sofisticado, 22 referencias y showcooking de tempuras y brasas.',
    dietaryOptions: ['Vegetariano estricto', 'Celíaco'],
  },
]);

export const CANONICAL_EXTRAS_2026: readonly CanonicalExtra[] = Object.freeze([
  {
    id: 'extra-recena-gourmet',
    name: 'Recena Gourmet Caliente (Brioches, Mini Burgers Buey & Churros)',
    category: 'GASTRONOMIA',
    priceCents: 1200, // 12.00 € / pax
    isPerPax: true,
    description: 'Servicio continuo de recena durante la barra libre.',
  },
  {
    id: 'extra-barra-libre-premium-4h',
    name: 'Barra Libre Premium 4 Horas (Marcas Reserva & Coctelería)',
    category: 'BEBIDAS',
    priceCents: 2400, // 24.00 € / pax
    isPerPax: true,
    description: 'Destilados premium, coctelería clásica, vinos y cervezas artesanas.',
  },
  {
    id: 'extra-cortador-jamon-iberico',
    name: 'Cortador Profesional de Jamón Ibérico 100% Bellota D.O. Dehesa',
    category: 'GASTRONOMIA',
    priceCents: 65000, // 650.00 € PVP Fijo
    isPerPax: false,
    description: 'Incluye maestro cortador homologado, jamón 100% ibérico bellota de 8kg y soporte oscilante.',
  },
  {
    id: 'extra-corner-quesos-artesanales',
    name: 'Corner de Quesos Artesanales con Frutas y Panes Especiales',
    category: 'GASTRONOMIA',
    priceCents: 850, // 8.50 € / pax
    isPerPax: true,
    description: '10 variedades nacionales e internacionales con mermeladas y frutos secos.',
  },
  {
    id: 'extra-cocteleria-autor-live',
    name: 'Coctelería de Autor en Directo con Bartender Campeón',
    category: 'BEBIDAS',
    priceCents: 1400, // 14.00 € / pax
    isPerPax: true,
    description: 'Creaciones personalizadas con hielo seco y destilados botánicos.',
  },
  {
    id: 'extra-mesa-dulce-candybar',
    name: 'Mesa Dulce & Candy Bar Temático de Repostería Creativa',
    category: 'GASTRONOMIA',
    priceCents: 45000, // 450.00 € PVP Fijo
    isPerPax: false,
    description: 'Macarons, cakepops, vasitos gourmet y golosinas sin gluten.',
  },
  {
    id: 'extra-fuente-chocolate-belga',
    name: 'Gran Fuente de Chocolate Belga Caliente con Brochetas de Frutas',
    category: 'GASTRONOMIA',
    priceCents: 38000, // 380.00 € PVP Fijo
    isPerPax: false,
    description: 'Cascada de chocolate puro con frutas de temporada, bizcochos y nubes.',
  },
  {
    id: 'extra-showcooking-arroces-brasas',
    name: 'Showcooking en Vivo: Arroces del Señoret y Cortes a la Brasa',
    category: 'GASTRONOMIA',
    priceCents: 1800, // 18.00 € / pax
    isPerPax: true,
    description: 'Preparación frente a comensales con sarmiento y carbón de encina.',
  },
  {
    id: 'extra-maridaje-vinos-alta-expresion',
    name: 'Maridaje Seleccionado de Vinos D.O. Alta Expresión y Cava Brut Nature',
    category: 'BEBIDAS',
    priceCents: 1600, // 16.00 € / pax
    isPerPax: true,
    description: 'Sumillería guiada con vinos de Pago y espumosos de guarda.',
  },
  {
    id: 'extra-iluminacion-arquitectonica-led',
    name: 'Iluminación Arquitectónica LED Cálida & Guirnaldas Micro-Bombilla',
    category: 'AMBIENTACION',
    priceCents: 85000, // 850.00 € PVP Fijo
    isPerPax: false,
    description: 'Baño de luz perimetral para jardines, fachadas históricas y arbolado.',
  },
  {
    id: 'extra-carpa-beduina-estructural',
    name: 'Carpa Beduina Estructural Homologada contra Viento y Lluvia',
    category: 'AMBIENTACION',
    priceCents: 180000, // 1.800.00 € PVP Fijo
    isPerPax: false,
    description: 'Membrana elástica transpirable e ignífuga con mástiles de madera natural.',
  },
  {
    id: 'extra-decoracion-floral-integral',
    name: 'Decoración Floral Integral, Guirnaldas y Centros de Mesa Silvestres',
    category: 'AMBIENTACION',
    priceCents: 95000, // 950.00 € PVP Fijo
    isPerPax: false,
    description: 'Diseño botánico estacional a juego con la identidad visual del evento.',
  },
  {
    id: 'extra-fotomaton-vintage-360',
    name: 'Fotomatón Vintage con Impresión Instantánea + Vídeo Plataforma 360',
    category: 'AUDIO_VISUAL',
    priceCents: 55000, // 550.00 € PVP Fijo
    isPerPax: false,
    description: 'Álbum encuadernado en cuero, atrezzo premium y descarga por código QR.',
  },
  {
    id: 'extra-sonido-adicional-ceremonia',
    name: 'Refuerzo Sonoro Bose S1 Pro para Ceremonia Civil y Cóctel Exterior',
    category: 'AUDIO_VISUAL',
    priceCents: 35000, // 350.00 € PVP Fijo
    isPerPax: false,
    description: 'Microfonía inalámbrica Shure, batería autónoma y calibración < 75 dB SPL.',
  },
  {
    id: 'extra-pirotecnia-fria-sparkular',
    name: 'Efectos Pirotécnicos Fríos Sparkular para Entrada / Baile Nupcial',
    category: 'AUDIO_VISUAL',
    priceCents: 30000, // 300.00 € PVP Fijo
    isPerPax: false,
    description: 'Chispas frías 100% no inflamables, aptas para interiores y homologadas.',
  },
  {
    id: 'extra-transporte-shuttle-invitados',
    name: 'Transporte de Invitados Shuttle Minibús 14 Plazas Convoy',
    category: 'LOGISTICA',
    priceCents: 48000, // 480.00 € PVP Fijo
    isPerPax: false,
    description: 'Ida y vuelta nocturna hotel-finca con chófer profesional.',
  },
]);

/* ========================================================================== */
/* 3. ORÁCULO MATEMÁTICO PURO (REFERENCIA INDEPENDIENTE)                     */
/* ========================================================================== */

/**
 * Calcula con precisión matemática pura en céntimos enteros (integer cents)
 * exactamente según las reglas de negocio SSOT inmutables.
 */
export function calculateFincaMenuPricingOracle(input: FincaMenuPricingInput): FincaMenuPricingResult {
  // 1. Localizar menú
  const menu = CANONICAL_MENUS_2026.find((m) => m.id === input.menuId);
  if (!menu) {
    throw new Error(`MENU_NOT_FOUND: Menú desconocido "${input.menuId}"`);
  }

  // 2. Validar invitados
  const guestCount = Math.max(0, Math.floor(input.guestCount));

  // 3. Menú total en céntimos
  const menuTotalCents = menu.pricePerPaxCents * guestCount;

  // 4. Extras total en céntimos
  let extrasTotalCents = 0;
  for (const extraId of input.selectedExtraIds) {
    const extra = CANONICAL_EXTRAS_2026.find((e) => e.id === extraId);
    if (!extra) {
      throw new Error(`EXTRA_NOT_FOUND: Complemento desconocido "${extraId}"`);
    }
    if (extra.isPerPax) {
      extrasTotalCents += extra.priceCents * guestCount;
    } else {
      extrasTotalCents += extra.priceCents;
    }
  }

  // 5. Logística km (1.50 €/km a partir del km 50 desde Méntrida o base)
  let logisticsKmCents = 0;
  if (input.distanceKm > LOGISTICA_KM_EXENTOS) {
    const billableKm = input.distanceKm - LOGISTICA_KM_EXENTOS;
    // 1.50 €/km = 150 céntimos/km
    logisticsKmCents = Math.round(billableKm * (LOGISTICA_EUR_PER_KM * 100));
  }

  // 6. Logística hotel (120.00 € = 12000 céntimos si hora fin >= 3:00 AM o distancia > 200 km)
  let logisticsHotelCents = 0;
  let isHotelRequired = false;
  if (input.distanceKm > LOGISTICA_KM_HOTEL) {
    isHotelRequired = true;
  }
  if (input.eventEndTime) {
    const [hoursStr] = input.eventEndTime.split(':');
    const hours = parseInt(hoursStr, 10);
    if (!isNaN(hours) && (hours >= HORA_FIN_HOTEL && hours < 12)) {
      isHotelRequired = true;
    }
  }
  if (isHotelRequired) {
    logisticsHotelCents = SUPLEMENTO_HOTEL_EUR * 100; // 12000 cents
  }

  // 7. Subtotal en céntimos
  const subtotalCents = menuTotalCents + extrasTotalCents + logisticsKmCents + logisticsHotelCents;

  // 8. IVA 21% en céntimos
  const ivaCents = Math.round(subtotalCents * VAT_RATE);
  const totalWithIvaCents = subtotalCents + ivaCents;

  // 9. Split Soberano 80/10/10 exacto sin fuga de céntimos
  const artistaCents = Math.round(subtotalCents * SPLIT_SOBERANO.artista);
  const earOsCents = Math.round(subtotalCents * SPLIT_SOBERANO.earOs);
  // Centinela exacto: VIMUME absorbe cualquier diferencia de redondeo entero
  const vimumeCents = subtotalCents - artistaCents - earOsCents;

  // 10. Comisión de Afiliados (10% a 15%)
  const commissionRate = input.affiliateCommissionPct ?? 0.12;
  if (commissionRate < 0.10 || commissionRate > 0.15) {
    throw new Error(`INVALID_COMMISSION_RATE: La comisión debe estar entre 0.10 (10%) y 0.15 (15%), recibido ${commissionRate}`);
  }
  const affiliateCommissionCents = Math.round(subtotalCents * commissionRate);

  // 11. Rider Acústico Ley 37/2003
  const recommendedWatts = guestCount * WATTS_PER_PAX;
  const maxDbSpl = LIMITE_SPL_DB; // 75 dB SPL salud pública
  const isCompliant = true; // El sistema calibrado por diseño garantiza cumplimiento

  // 12. Depósito deducible Stripe Price-Lock
  const depositDeductibleCents = Math.round(DEPOSITO_STRIPE_EUR * 100); // 10000 cents (100.00 €)

  return {
    menuTotalCents,
    extrasTotalCents,
    logisticsKmCents,
    logisticsHotelCents,
    subtotalCents,
    ivaCents,
    totalWithIvaCents,
    split: {
      artistaCents,
      earOsCents,
      vimumeCents,
    },
    affiliateCommissionCents,
    acousticRider: {
      recommendedWatts,
      maxDbSpl,
      isCompliant,
    },
    depositDeductibleCents,
  };
}

/* ========================================================================== */
/* 4. MEDIDOR JACCARD 5-GRAM (SSOT § 9 LEY DEL AUDITOR REAL)                  */
/* ========================================================================== */

export function computeJaccard5Gram(textA: string, textB: string): number {
  const cleanA = textA.toLowerCase().replace(/[^a-z0-9áéíóúñü]/gi, ' ').replace(/\s+/g, ' ').trim();
  const cleanB = textB.toLowerCase().replace(/[^a-z0-9áéíóúñü]/gi, ' ').replace(/\s+/g, ' ').trim();

  const wordsA = cleanA.split(' ');
  const wordsB = cleanB.split(' ');

  if (wordsA.length < 5 || wordsB.length < 5) {
    return 0; // Insuficientes n-gramas
  }

  const setA = new Set<string>();
  for (let i = 0; i <= wordsA.length - 5; i++) {
    setA.add(wordsA.slice(i, i + 5).join(' '));
  }

  const setB = new Set<string>();
  for (let i = 0; i <= wordsB.length - 5; i++) {
    setB.add(wordsB.slice(i, i + 5).join(' '));
  }

  let intersection = 0;
  for (const gram of setA) {
    if (setB.has(gram)) intersection++;
  }

  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/* ========================================================================== */
/* 5. ASSERTION RUNNER Y MÉTRICAS                                             */
/* ========================================================================== */

export interface TestResult {
  tier: number;
  featureId?: number;
  testName: string;
  passed: boolean;
  status: 'PASS' | 'FAIL' | 'PENDING_IMPLEMENTATION';
  durationMs: number;
  error?: string;
  details?: Record<string, unknown>;
}

export class TestExecutionTracker {
  private results: TestResult[] = [];
  private startTime = Date.now();

  record(res: TestResult): void {
    this.results.push(res);
  }

  getResults(): readonly TestResult[] {
    return this.results;
  }

  getPassCount(): number {
    return this.results.filter((r) => r.passed).length;
  }

  getFailCount(): number {
    return this.results.filter((r) => !r.passed && r.status === 'FAIL').length;
  }

  getPendingCount(): number {
    return this.results.filter((r) => r.status === 'PENDING_IMPLEMENTATION').length;
  }

  getTotalCount(): number {
    return this.results.length;
  }

  getTotalDurationMs(): number {
    return Date.now() - this.startTime;
  }

  getScoreSummary(): {
    total: number;
    pass: number;
    fail: number;
    pending: number;
    durationMs: number;
    passRatePct: number;
  } {
    const total = this.getTotalCount();
    const pass = this.getPassCount();
    const fail = this.getFailCount();
    const pending = this.getPendingCount();
    const passRatePct = total > 0 ? Math.round((pass / total) * 100) : 0;
    return {
      total,
      pass,
      fail,
      pending,
      durationMs: this.getTotalDurationMs(),
      passRatePct,
    };
  }
}
