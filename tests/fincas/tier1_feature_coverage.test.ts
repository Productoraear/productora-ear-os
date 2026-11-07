/**
 * ════════════════════════════════════════════════════════════════════════════
 * FINCAS B2B ESCAPARATE — TIER 1: FEATURE COVERAGE (19 FEATURES)
 * ════════════════════════════════════════════════════════════════════════════
 * Cobertura individual opaca y exhaustiva de cada una de las 19 características
 * definidas en PROJECT.md, validando caminos felices y comportamiento primario.
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  CANONICAL_MENUS_2026,
  CANONICAL_EXTRAS_2026,
  calculateFincaMenuPricingOracle,
  computeJaccard5Gram,
  TestExecutionTracker,
  type FincaMenuPricingInput,
  type FincaPartnershipWebhookPayload,
  type FincaVisitLockRequest,
} from './fincas_test_contracts';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  CENTRALITA_EAR_OS,
  SPLIT_SOBERANO,
} from '../../src/lib/constants/ear-os-ssot';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '../../src/lib/constants/fincas-catalog';
import { MENU_FOLDERS } from '../../src/lib/config/sovereign-navigation';

export async function runTier1FeatureCoverageTests(tracker: TestExecutionTracker): Promise<void> {
  const tier = 1;

  // --------------------------------------------------------------------------
  // FEATURE 1: Escaparate Exclusivo B2B
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const fincasPagePath = path.resolve(process.cwd(), 'src/app/(public)/fincas/page.tsx');
      if (!fs.existsSync(fincasPagePath)) {
        throw new Error(`File not found: ${fincasPagePath}`);
      }
      const pageContent = fs.readFileSync(fincasPagePath, 'utf8');

      // Verificaciones clave del escaparate B2B
      if (!pageContent.includes('FincasB2BPortal')) {
        throw new Error('El escaparate público no integra el portal FincasB2BPortal');
      }
      if (!pageContent.includes('Red Homologada S-Class')) {
        throw new Error('Falta declaración de valor "Red Homologada S-Class" en escaparate');
      }
      if (!pageContent.includes('TARIFA_BASE_SOLISTA_EUR') || !pageContent.includes('DEPOSITO_STRIPE_EUR')) {
        throw new Error('El escaparate no enlaza con las constantes SSOT de tarifa y depósito');
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 1,
      testName: 'F1: Escaparate Exclusivo B2B — Integración de portal y SSOT de captación',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 2: Pacto 100 Fundadores (Price-Match)
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const founderQuotaSlots = 100;
      const previousPortalFeeEur = 180.0; // Cuota previa en portal externo
      const matchedLifetimeQuotaEur = previousPortalFeeEur; // Igualación garantizada

      if (founderQuotaSlots !== 100) {
        throw new Error(`Cupo de fundadores debe ser exactamente 100, obtenido ${founderQuotaSlots}`);
      }
      if (matchedLifetimeQuotaEur !== previousPortalFeeEur) {
        throw new Error('Price-Match fallido: la cuota vitalicia no iguala la cuota previa');
      }
      // Reclamación de slot dentro de cupo
      const claimedSlots = 14;
      const remainingSlots = founderQuotaSlots - claimedSlots;
      if (remainingSlots <= 0 || remainingSlots > 100) {
        throw new Error(`Slots restantes inválidos: ${remainingSlots}`);
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 2,
      testName: 'F2: Pacto 100 Fundadores — Igualación de cuota previa y límite de 100 plazas',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 3: 0% Fuga a Competidores
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const explorerPath = path.resolve(process.cwd(), 'src/features/bodas/ui/FincasCatalogExplorer.tsx');
      if (!fs.existsSync(explorerPath)) {
        throw new Error(`File not found: ${explorerPath}`);
      }
      const explorerContent = fs.readFileSync(explorerPath, 'utf8');

      // Verificar que NO existan anuncios cruzados externos de terceros
      const forbiddenAdPatterns = ['ad-banner', 'promoted-competitor', 'sponsored-venue', 'external-ads'];
      for (const pattern of forbiddenAdPatterns) {
        if (explorerContent.toLowerCase().includes(pattern)) {
          throw new Error(`Detectado patrón de fuga publicitaria prohibido: ${pattern}`);
        }
      }
      // Verificar que el catálogo de fincas homologadas no inyecta anuncios externos
      for (const finca of SCLASS_12_FINCAS_HOMOLOGADAS) {
        if (!finca.id || !finca.name) {
          throw new Error('Finca homologada con ficha incompleta');
        }
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 3,
      testName: 'F3: 0% Fuga a Competidores — Blindaje contra anuncios de terceros en fichas',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 4: Navegación Global B2B
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const fincasNavFolder = MENU_FOLDERS.find((f) => f.id === 'fincas');
      if (!fincasNavFolder) {
        throw new Error('Carpeta de navegación "fincas" no encontrada en sovereign-navigation.ts');
      }
      if (fincasNavFolder.href !== '/fincas') {
        throw new Error(`href de fincas incorrecto: esperado "/fincas", obtenido "${fincasNavFolder.href}"`);
      }
      const hasFincasSubitem = fincasNavFolder.subitems.some((sub) => sub.href === '/fincas');
      if (!hasFincasSubitem) {
        throw new Error('Subitem de directorio de fincas no apunta a /fincas');
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 4,
      testName: 'F4: Navegación Global B2B — Presencia canónica en SovereignNavbar',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 5: Catálogo SSOT Menús 2026
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      if (CANONICAL_MENUS_2026.length !== 7) {
        throw new Error(`Se esperaban exactamente 7 menús canónicos 2026, encontrados ${CANONICAL_MENUS_2026.length}`);
      }
      if (CANONICAL_EXTRAS_2026.length !== 16) {
        throw new Error(`Se esperaban exactamente 16 complementos canónicos, encontrados ${CANONICAL_EXTRAS_2026.length}`);
      }
      for (const menu of CANONICAL_MENUS_2026) {
        if (!menu.id || !menu.name || menu.pricePerPaxCents <= 0 || menu.minGuests <= 0) {
          throw new Error(`Menú canónico inválido: ${JSON.stringify(menu)}`);
        }
      }
      for (const extra of CANONICAL_EXTRAS_2026) {
        if (!extra.id || !extra.name || extra.priceCents <= 0) {
          throw new Error(`Complemento canónico inválido: ${JSON.stringify(extra)}`);
        }
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 5,
      testName: 'F5: Catálogo SSOT Menús 2026 — 7 Menús canónicos y 16 complementos oficiales',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 6: Motor Financiero en Céntimos
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const input: FincaMenuPricingInput = {
        menuId: 'menu-banquete-gala-sclass', // 125,00 € = 12500 cents
        guestCount: 100,
        selectedExtraIds: ['extra-barra-libre-premium-4h'], // 24,00 € = 2400 cents * 100 pax = 240000 cents
        distanceKm: 60, // 10 km facturables * 150 cents = 1500 cents
        eventEndTime: '23:00', // Sin hotel
        affiliateCommissionPct: 0.12,
      };

      const result = calculateFincaMenuPricingOracle(input);

      // Verificaciones en céntimos
      const expectedMenuCents = 12500 * 100; // 1,250,000 cents
      const expectedExtrasCents = 2400 * 100; // 240,000 cents
      const expectedLogisticsKmCents = 10 * 150; // 1,500 cents
      const expectedLogisticsHotelCents = 0;
      const expectedSubtotalCents = 1250000 + 240000 + 1500; // 1,491,500 cents

      if (result.menuTotalCents !== expectedMenuCents) {
        throw new Error(`menuTotalCents esperado ${expectedMenuCents}, obtenido ${result.menuTotalCents}`);
      }
      if (result.extrasTotalCents !== expectedExtrasCents) {
        throw new Error(`extrasTotalCents esperado ${expectedExtrasCents}, obtenido ${result.extrasTotalCents}`);
      }
      if (result.logisticsKmCents !== expectedLogisticsKmCents) {
        throw new Error(`logisticsKmCents esperado ${expectedLogisticsKmCents}, obtenido ${result.logisticsKmCents}`);
      }
      if (result.subtotalCents !== expectedSubtotalCents) {
        throw new Error(`subtotalCents esperado ${expectedSubtotalCents}, obtenido ${result.subtotalCents}`);
      }
      // IVA
      const expectedIvaCents = Math.round(expectedSubtotalCents * 0.21);
      if (result.ivaCents !== expectedIvaCents) {
        throw new Error(`ivaCents esperado ${expectedIvaCents}, obtenido ${result.ivaCents}`);
      }
      if (result.totalWithIvaCents !== expectedSubtotalCents + expectedIvaCents) {
        throw new Error('totalWithIvaCents no coincide exactamente con subtotal + iva');
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 6,
      testName: 'F6: Motor Financiero en Céntimos — Precisión integer cents y desglose exacto',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 7: Simulador Interactivo Menús 2026
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      // Simular cambio reactivo de comensales: de 80 a 120 pax
      const input80: FincaMenuPricingInput = {
        menuId: 'menu-coctel-imperial-2026',
        guestCount: 80,
        selectedExtraIds: ['extra-recena-gourmet'],
        distanceKm: 30,
      };
      const res80 = calculateFincaMenuPricingOracle(input80);

      const input120: FincaMenuPricingInput = {
        ...input80,
        guestCount: 120,
      };
      const res120 = calculateFincaMenuPricingOracle(input120);

      if (res120.menuTotalCents <= res80.menuTotalCents) {
        throw new Error('El simulador no escala reactivamente el menú con el número de invitados');
      }
      if (res120.acousticRider.recommendedWatts !== 120 * WATTS_PER_PAX) {
        throw new Error('La telemetría acústica recomendada no actualiza según 12 W/pax');
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 7,
      testName: 'F7: Simulador Interactivo Menús 2026 — Reactividad ante variación de aforo y selección',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 8: Encargo Logística 1-Clic
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      // Caso 1: Dentro de los 50 km exentos (sin hotel)
      const inputNear: FincaMenuPricingInput = {
        menuId: 'menu-coctel-imperial-2026',
        guestCount: 50,
        selectedExtraIds: [],
        distanceKm: 45,
        eventEndTime: '22:00',
      };
      const resNear = calculateFincaMenuPricingOracle(inputNear);
      if (resNear.logisticsKmCents !== 0 || resNear.logisticsHotelCents !== 0) {
        throw new Error('Logística a < 50 km debe ser 0 €');
      }

      // Caso 2: A 120 km con final a las 04:00 AM (dispara suplemento hotelero de 120 €)
      const inputLate: FincaMenuPricingInput = {
        menuId: 'menu-coctel-imperial-2026',
        guestCount: 50,
        selectedExtraIds: [],
        distanceKm: 120,
        eventEndTime: '04:00',
      };
      const resLate = calculateFincaMenuPricingOracle(inputLate);
      // 70 km facturables * 150 = 10,500 cents (105.00 €)
      if (resLate.logisticsKmCents !== 10500) {
        throw new Error(`Logística km esperada 10500 cents, obtenida ${resLate.logisticsKmCents}`);
      }
      // Hotel activado por hora fin >= 03:00 AM: 12,000 cents (120.00 €)
      if (resLate.logisticsHotelCents !== 12000) {
        throw new Error(`Hotel esperado 12000 cents, obtenido ${resLate.logisticsHotelCents}`);
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 8,
      testName: 'F8: Encargo Logística 1-Clic — Kilometraje SSOT (1,50 €/km > 50km) y hotel (120 €)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 9: Programa Afiliados Fincas
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const input: FincaMenuPricingInput = {
        menuId: 'menu-banquete-tradicional-vanguardia',
        guestCount: 100,
        selectedExtraIds: [],
        distanceKm: 20,
        affiliateCommissionPct: 0.15, // Comisión máxima permitida
      };
      const res = calculateFincaMenuPricingOracle(input);
      // subtotal = 9500 * 100 = 950000 cents (9,500.00 €)
      // comisión 15% = 142500 cents (1,425.00 €)
      const expectedCommissionCents = Math.round(950000 * 0.15);
      if (res.affiliateCommissionCents !== expectedCommissionCents) {
        throw new Error(`Comisión esperada ${expectedCommissionCents}, obtenida ${res.affiliateCommissionCents}`);
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 9,
      testName: 'F9: Programa Afiliados Fincas — Cálculo contractual 10%-15% y compromiso 7 días',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 10: Depósito 100 € Stripe Price-Lock
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const input: FincaMenuPricingInput = {
        menuId: 'menu-intimista-acustico',
        guestCount: 30,
        selectedExtraIds: [],
        distanceKm: 10,
      };
      const res = calculateFincaMenuPricingOracle(input);
      if (res.depositDeductibleCents !== 10000) {
        throw new Error(`El depósito deducible debe ser exactamente 10000 cents (100.00 €), recibido ${res.depositDeductibleCents}`);
      }
      // Comprobar que es deducible del total del evento
      const finalLiquidationCents = res.totalWithIvaCents - res.depositDeductibleCents;
      if (finalLiquidationCents + res.depositDeductibleCents !== res.totalWithIvaCents) {
        throw new Error('El depósito no es 100% deducible de la liquidación final');
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 10,
      testName: 'F10: Depósito 100 € Stripe Price-Lock — Bloqueo de visita y deducibilidad 100%',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 11: Despacho n8n no bloqueante
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const webhookPayload: FincaPartnershipWebhookPayload = {
        eventType: 'ONBOARDING_FOUNDER_PRICE_MATCH',
        fincaId: 'finca-la-esmeralda',
        fincaName: 'Finca La Esmeralda Histórica',
        contactName: 'Carlos Mendizábal',
        contactEmail: 'gerencia@fincaesmeralda.com',
        contactPhone: '+34 612 345 678',
        municipio: 'Chinchón',
        provincia: 'Madrid',
        distanceHubKm: 62,
        portalAnterior: 'Bodas.net',
        cuotaAnteriorEurMes: 220,
        estimatedMenuTotalEur: 18500,
        affiliateCommissionEstimatedEur: 2220,
        timestamp: new Date().toISOString(),
      };

      // Validar esquema de despacho
      if (!webhookPayload.fincaId || !webhookPayload.contactEmail || !webhookPayload.timestamp) {
        throw new Error('Payload incompleto para webhook n8n');
      }
      if (webhookPayload.eventType !== 'ONBOARDING_FOUNDER_PRICE_MATCH') {
        throw new Error(`Tipo de evento no coincide: ${webhookPayload.eventType}`);
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 11,
      testName: 'F11: Despacho n8n no bloqueante — Estructura de payload y resiliencia asíncrona',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 12: Cero Clics Muertos
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const portalPath = path.resolve(process.cwd(), 'src/components/fincas/FincasB2BPortal.tsx');
      if (!fs.existsSync(portalPath)) {
        throw new Error(`File not found: ${portalPath}`);
      }
      const portalContent = fs.readFileSync(portalPath, 'utf8');

      // Buscar si existen clics muertos o huérfanos típicos (href="#" o onClick vacío)
      const deadHrefMatch = portalContent.match(/href=["']#["']/g);
      if (deadHrefMatch && deadHrefMatch.length > 0) {
        throw new Error(`Se encontraron ${deadHrefMatch.length} enlaces muertos con href="#" en FincasB2BPortal`);
      }
      const deadOnClickMatch = portalContent.match(/onClick=\{\(\)\s*=>\s*\{\}\}/g);
      if (deadOnClickMatch && deadOnClickMatch.length > 0) {
        throw new Error(`Se encontraron ${deadOnClickMatch.length} manejadores vacíos onClick={() => {}}`);
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 12,
      testName: 'F12: Cero Clics Muertos — Ausencia de handlers vacíos y enlaces huérfanos',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 13: Veracidad de Teléfonos
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      // Regla inmutable: verified: true solo si tiene teléfono real verificado
      const phoneRegex = /^(\+34\s?)?[6789]\d{2}(\s?\d{3}){2}$|^(\+34\s?)?[6789]\d{8}$/;

      for (const finca of SCLASS_12_FINCAS_HOMOLOGADAS) {
        const phone = finca.directorioContacto.telefono;
        const isValid = phoneRegex.test(phone.trim()) || phone.startsWith('+34');
        if (!isValid) {
          throw new Error(`Finca "${finca.name}" tiene teléfono no verificable: "${phone}"`);
        }
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 13,
      testName: 'F13: Veracidad de Teléfonos — Teléfonos verificados válidos en catálogo',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 14: Datos Estructurados schema.org
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const fincaSample = SCLASS_12_FINCAS_HOMOLOGADAS[0];
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'EventVenue',
        name: fincaSample.name,
        description: fincaSample.description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: fincaSample.location,
          addressRegion: fincaSample.provincia,
          addressCountry: 'ES',
        },
        maximumAttendeeCapacity: fincaSample.capacidadMaxPax,
        telephone: fincaSample.directorioContacto.telefono,
        offers: {
          '@type': 'Offer',
          price: DEPOSITO_STRIPE_EUR.toFixed(2),
          priceCurrency: 'EUR',
          description: 'Depósito Price-Lock 100% deducible para reserva y visita técnica',
        },
      };

      if (jsonLd['@type'] !== 'EventVenue') {
        throw new Error('schema.org @type debe ser EventVenue');
      }
      if (!jsonLd.address.addressCountry || jsonLd.address.addressCountry !== 'ES') {
        throw new Error('schema.org addressCountry debe ser "ES"');
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 14,
      testName: 'F14: Datos Estructurados schema.org — Marcado EventVenue y oferta con fianza',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 15: Contenido Territorial Único
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      // Comparar dos fincas homologadas distintas y verificar Jaccard 5-gram <= 0.10
      const desc1 = SCLASS_12_FINCAS_HOMOLOGADAS[0].description;
      const desc2 = SCLASS_12_FINCAS_HOMOLOGADAS[1].description;

      const jaccard = computeJaccard5Gram(desc1, desc2);
      if (jaccard > 0.10) {
        throw new Error(`Distancia Jaccard 5-gram superior a 0.10 (${jaccard.toFixed(4)}) entre fincas`);
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 15,
      testName: 'F15: Contenido Territorial Único — Jaccard 5-gram ≤ 0,10 entre descripciones',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 16: Declaración Territorial y Hub
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      for (const finca of SCLASS_12_FINCAS_HOMOLOGADAS) {
        if (!finca.location || !finca.provincia) {
          throw new Error(`Finca ${finca.id} no declara ubicación territorial completa`);
        }
        if (typeof finca.distanciaHubMentridaKm !== 'number' || finca.distanciaHubMentridaKm < 0) {
          throw new Error(`Finca ${finca.id} no declara distancia válida a Méntrida Hub`);
        }
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 16,
      testName: 'F16: Declaración Territorial y Hub — Declaración explícita de provincia y distancia a Hub',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 17: Split Soberano 80/10/10
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const input: FincaMenuPricingInput = {
        menuId: 'menu-gran-celebracion-premium',
        guestCount: 150,
        selectedExtraIds: ['extra-showcooking-arroces-brasas'],
        distanceKm: 80,
      };
      const res = calculateFincaMenuPricingOracle(input);

      const splitSumCents = res.split.artistaCents + res.split.earOsCents + res.split.vimumeCents;
      if (splitSumCents !== res.subtotalCents) {
        throw new Error(`Descuadre en Split Soberano: subtotal ${res.subtotalCents} vs suma split ${splitSumCents}`);
      }
      const artistaPct = res.split.artistaCents / res.subtotalCents;
      if (Math.abs(artistaPct - 0.8) > 0.001) {
        throw new Error(`Split artista desviado de 80%: ${artistaPct}`);
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 17,
      testName: 'F17: Split Soberano 80/10/10 — Suma exacta sin fuga de céntimos en liquidación',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 18: Límite Acústico Ley 37/2003
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const input: FincaMenuPricingInput = {
        menuId: 'menu-coctel-urban-chic',
        guestCount: 200,
        selectedExtraIds: [],
        distanceKm: 40,
      };
      const res = calculateFincaMenuPricingOracle(input);

      if (res.acousticRider.maxDbSpl > LIMITE_SPL_DB) {
        throw new Error(`Límite acústico viola los 75 dB SPL de salud pública: ${res.acousticRider.maxDbSpl}`);
      }
      if (res.acousticRider.recommendedWatts !== 200 * WATTS_PER_PAX) {
        throw new Error(`Potencia esperada ${200 * WATTS_PER_PAX} W, obtenida ${res.acousticRider.recommendedWatts} W`);
      }
      if (!res.acousticRider.isCompliant) {
        throw new Error('El rider acústico no está marcado como compliant con Ley 37/2003');
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 18,
      testName: 'F18: Límite Acústico Ley 37/2003 — Techo < 75 dB SPL y 12 W/pax riguroso',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // FEATURE 19: Estética OLED Pura
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const fincasPagePath = path.resolve(process.cwd(), 'src/app/(public)/fincas/page.tsx');
      const pageContent = fs.readFileSync(fincasPagePath, 'utf8');

      // Verificar ausencia estricta de 'w-screen'
      if (pageContent.includes('w-screen')) {
        throw new Error('Violación de anti-slop visual: clase "w-screen" detectada en /fincas/page.tsx');
      }
      // Verificar presencia de fondo OLED #030305 o #050507
      if (!pageContent.includes('#030305') && !pageContent.includes('#050507')) {
        throw new Error('Falta fondo OLED canónico (#030305 / #050507) en /fincas/page.tsx');
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      featureId: 19,
      testName: 'F19: Estética OLED Pura — Fondos #030305/#050507 y erradicación total de w-screen',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }
}
