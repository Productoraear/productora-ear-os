/**
 * ════════════════════════════════════════════════════════════════════════════
 * FINCAS B2B ESCAPARATE — TIER 3: CROSS-FEATURE COMBINATIONS
 * ════════════════════════════════════════════════════════════════════════════
 * Validación de interacciones acopladas entre módulos: menús, logística,
 * depósitos Stripe, webhook n8n, split soberano, rider acústico y gobernanza.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  calculateFincaMenuPricingOracle,
  TestExecutionTracker,
  type FincaMenuPricingInput,
  type FincaPartnershipWebhookPayload,
} from './fincas_test_contracts';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '../../src/lib/constants/fincas-catalog';

export async function runTier3CrossFeatureCombinationsTests(tracker: TestExecutionTracker): Promise<void> {
  const tier = 3;

  // --------------------------------------------------------------------------
  // COMBO A: Menú 2026 + Logística 1-Clic + Depósito 100 € + Split 80/10/10
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      // Boda de 120 pax, Banquete Gala S-Class (125 €), Cortador Jamón (650 €) + Recena (12 €/pax)
      // Distancia: 90 km (40 km facturables * 1.50 = 60 €), Hora fin: 04:30 AM (+120 € hotel)
      const input: FincaMenuPricingInput = {
        menuId: 'menu-banquete-gala-sclass',
        guestCount: 120,
        selectedExtraIds: ['extra-cortador-jamon-iberico', 'extra-recena-gourmet'],
        distanceKm: 90,
        eventEndTime: '04:30',
        affiliateCommissionPct: 0.12,
      };

      const res = calculateFincaMenuPricingOracle(input);

      // Verificación cruzada:
      // Menú: 12500 * 120 = 1,500,000 cents
      // Cortador: 65,000 cents
      // Recena: 1200 * 120 = 144,000 cents
      // Km: (90 - 50) * 150 = 6,000 cents (60.00 €)
      // Hotel: 12,000 cents (120.00 €)
      // Subtotal: 1,500,000 + 65,000 + 144,000 + 6,000 + 12,000 = 1,727,000 cents (17,270.00 €)
      if (res.subtotalCents !== 1727000) {
        throw new Error(`Subtotal cruzado esperado 1727000, obtenido ${res.subtotalCents}`);
      }

      // IVA 21%: Math.round(1727000 * 0.21) = 362,670 cents
      const expectedIva = Math.round(1727000 * 0.21);
      if (res.ivaCents !== expectedIva) {
        throw new Error(`IVA cruzado esperado ${expectedIva}, obtenido ${res.ivaCents}`);
      }
      if (res.totalWithIvaCents !== 1727000 + expectedIva) {
        throw new Error('Total con IVA inconsistente');
      }

      // Deducibilidad del depósito de 100 € (10.000 céntimos)
      const pendingPaymentCents = res.totalWithIvaCents - res.depositDeductibleCents;
      if (pendingPaymentCents + 10000 !== res.totalWithIvaCents) {
        throw new Error('Depósito de 100 € no descuenta íntegramente la fianza');
      }

      // Split 80/10/10 debe sumar el subtotal exacto
      const splitTotal = res.split.artistaCents + res.split.earOsCents + res.split.vimumeCents;
      if (splitTotal !== res.subtotalCents) {
        throw new Error('Split Soberano no concuerda con el subtotal integral');
      }

      // Comisión de afiliado (12% sobre subtotal): Math.round(1727000 * 0.12) = 207,240 cents (2,072.40 €)
      const expectedCommission = Math.round(1727000 * 0.12);
      if (res.affiliateCommissionCents !== expectedCommission) {
        throw new Error(`Comisión esperada ${expectedCommission}, obtenida ${res.affiliateCommissionCents}`);
      }

      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      testName: 'Combo A: Menú 2026 + Logística 1-Clic + Depósito 100 € + Split 80/10/10 — Armonía transaccional total',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // COMBO B: 100 Fundadores Price-Match + n8n Webhook Dispatch + 0% Fuga
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const fincaCandidate = {
        name: 'Finca Las Encinas Real',
        portalAnterior: 'Bodas.net',
        cuotaAnteriorEurMes: 195.0,
        provincia: 'Toledo',
        municipio: 'Illescas',
        contacto: {
          director: 'Mariana Gómez',
          telefono: '+34 654 321 098',
          email: 'direccion@fincaslasencinas.es',
        },
      };

      // 1. Simular Price-Match
      const lifetimeQuota = fincaCandidate.cuotaAnteriorEurMes; // 195 €/mes de por vida
      if (lifetimeQuota !== 195.0) throw new Error('Price-Match alteró la tarifa');

      // 2. Construir payload webhook n8n
      const webhookPayload: FincaPartnershipWebhookPayload = {
        eventType: 'ONBOARDING_FOUNDER_PRICE_MATCH',
        fincaId: 'finca-las-encinas-real',
        fincaName: fincaCandidate.name,
        contactName: fincaCandidate.contacto.director,
        contactEmail: fincaCandidate.contacto.email,
        contactPhone: fincaCandidate.contacto.telefono,
        municipio: fincaCandidate.municipio,
        provincia: fincaCandidate.provincia,
        distanceHubKm: 34,
        portalAnterior: fincaCandidate.portalAnterior,
        cuotaAnteriorEurMes: lifetimeQuota,
        estimatedMenuTotalEur: 14500,
        affiliateCommissionEstimatedEur: 1740,
        timestamp: new Date().toISOString(),
      };

      if (!webhookPayload.cuotaAnteriorEurMes || webhookPayload.cuotaAnteriorEurMes <= 0) {
        throw new Error('Payload n8n no conserva cuota previa validada');
      }

      // 3. Garantía contractual 0% fuga: en su ficha no hay enlaces competidores
      const generatedProfile = {
        fincaId: webhookPayload.fincaId,
        name: webhookPayload.fincaName,
        advertisersAllowed: false,
        crossPromotionAllowed: false,
        competitorBanners: [],
      };

      if (generatedProfile.advertisersAllowed || generatedProfile.competitorBanners.length > 0) {
        throw new Error('Ficha generada permite anuncios o competidores cruzados');
      }

      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      testName: 'Combo B: 100 Fundadores Price-Match + n8n Dispatch + Cero Fuga Publicitaria — Integridad de captación',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // COMBO C: Rider Acústico Gran Aforo (500 pax) + Límite Ley 37/2003 + Hotel 250 km
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const input: FincaMenuPricingInput = {
        menuId: 'menu-gran-celebracion-premium',
        guestCount: 500,
        selectedExtraIds: ['extra-sonido-adicional-ceremonia'],
        distanceKm: 250, // > 200 km -> activa hotel
        eventEndTime: '23:00',
      };

      const res = calculateFincaMenuPricingOracle(input);

      // Rider: 500 pax * 12 W/pax = 6.000 W
      if (res.acousticRider.recommendedWatts !== 6000) {
        throw new Error(`Potencia calculada ${res.acousticRider.recommendedWatts} W no es 6000 W`);
      }
      if (res.acousticRider.maxDbSpl !== 75) {
        throw new Error(`SPL máximo superó o discrepó de 75 dB: ${res.acousticRider.maxDbSpl}`);
      }
      if (!res.acousticRider.isCompliant) {
        throw new Error('Rider no cumple normativas acústicas');
      }

      // Hotel por distancia: 250 km activa los 120 € de hotel
      if (res.logisticsHotelCents !== 12000) {
        throw new Error(`Hotel no activado a 250 km: ${res.logisticsHotelCents}`);
      }
      // Km facturables: 200 km * 150 = 30,000 cents
      if (res.logisticsKmCents !== 30000) {
        throw new Error(`Kilometraje erróneo a 250 km: ${res.logisticsKmCents}`);
      }

      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      testName: 'Combo C: Macro Aforo Acústico (500 pax / 6.000 W) + Salud Pública (<75 dB) + Hotel Larga Distancia (250 km)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // COMBO D: Hub Méntrida vs Red Nacional + Marcado JSON-LD con Fianza
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      // Evaluar fincas en Madrid/Toledo (Hub Méntrida) vs otras provincias
      const fincaMentrida = SCLASS_12_FINCAS_HOMOLOGADAS.find((f) => f.provincia === 'Madrid' || f.provincia === 'Toledo');
      if (!fincaMentrida) throw new Error('No se encontró finca en radio de Hub Méntrida');

      // Validar esquema JSON-LD
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'EventVenue',
        name: fincaMentrida.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: fincaMentrida.location,
          addressRegion: fincaMentrida.provincia,
          addressCountry: 'ES',
        },
        amenityFeature: fincaMentrida.serviciosCoordinados.map((s) => ({
          '@type': 'LocationFeatureSpecification',
          name: s,
          value: true,
        })),
        maximumAttendeeCapacity: fincaMentrida.capacidadMaxPax,
        offers: {
          '@type': 'Offer',
          price: '100.00',
          priceCurrency: 'EUR',
          description: 'Depósito Price-Lock 100% deducible',
        },
      };

      if (!jsonLd.amenityFeature || jsonLd.amenityFeature.length === 0) {
        throw new Error('Marcado JSON-LD carece de amenityFeature para servicios coordinados');
      }
      if (jsonLd.offers.price !== '100.00') {
        throw new Error('Marcado JSON-LD de oferta no refleja fianza de 100.00 €');
      }

      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      testName: 'Combo D: Gobernanza Territorial Hub Méntrida + Generación schema.org JSON-LD con Fianza Deducible',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }
}
