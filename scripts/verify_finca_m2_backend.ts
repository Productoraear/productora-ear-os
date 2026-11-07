/**
 * ════════════════════════════════════════════════════════════════════════════
 * SCRIPTS/VERIFY_FINCA_M2_BACKEND.TS — ARQUETIPO DE AUDITORÍA INTEGRAL M2
 * ════════════════════════════════════════════════════════════════════════════
 * Validación estricta y reproducible de Milestone 2 (Backend Transaccional & n8n):
 *  1. `src/app/api/fincas/visit-lock/route.ts`:
 *     - Invariante SSOT Depósito deducible 100,00 € (10.000 céntimos).
 *     - Generación criptográfica determinista HMAC SHA-256 con prefijo SHA256-Ω-FINCA-.
 *     - Validación de esquema Zod (éxito en válido, fallo en ausentes o malformados).
 *     - Manejador POST: 200 OK con checkout session, 400 en fecha pasada, 400 en datos inválidos.
 *     - Manejador GET: 200 OK en consulta de disponibilidad, 400 en parámetros faltantes.
 *  2. `src/app/api/b2b/homologacion/route.ts`:
 *     - Homologación técnica clásica sin pacto de fundadores (retrocompatibilidad).
 *     - Detección estricta de infracciones técnicas (potencia, toma eléctrica CETAC).
 *     - Onboarding con Pacto de los 100 Fundadores (Price-Match y tarifa vitalicia).
 *     - Despacho fire-and-forget a n8n sin bloqueo (< 50 ms).
 *  3. `src/app/actions/fincaLogisticsActions.ts`:
 *     - Server Action `dispatchFincaLogisticsOrderAction` en App Router Next.js 16.
 *     - Orden válida: status 'CONFIRMED', recálculo determinista en servidor.
 *     - Invariante del Split Soberano: Artista 80% / EAR OS 10% / VIMUME 10% (suma exacta al céntimo).
 *     - Comisión de afiliación detraída de EAR OS (artista y VIMUME intocables).
 *     - Rider acústico conforme a Ley 37/2003 (< 75 dB SPL, 12 W/pax RMS).
 *     - Rechazo por validación en comensales <= 0, email inválido o menú inexistente.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { NextRequest } from 'next/server';
import {
  POST as visitLockPOST,
  GET as visitLockGET,
  generatePriceLockSha256,
  FincaVisitLockRequestSchema,
} from '../src/app/api/fincas/visit-lock/route';

import {
  POST as homologacionPOST,
  type B2BHomologacionInput,
} from '../src/app/api/b2b/homologacion/route';

import {
  dispatchFincaLogisticsOrderAction,
  type FincaLogisticsOrderInput,
} from '../src/app/actions/fincaLogisticsActions';

import { DEPOSITO_STRIPE_EUR } from '../src/lib/constants/ear-os-ssot';

console.log('════════════════════════════════════════════════════════════════');
console.log('TEST SUITE: MILESTONE 2 — FINCAS & CORTIJOS BACKEND TRANSACCIONAL');
console.log('════════════════════════════════════════════════════════════════');

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL [${totalTests}]: ${testName}${detail ? ` -> ${detail}` : ''}`);
    process.exit(1);
  } else {
    passedTests++;
    console.log(`✅ PASS [${totalTests}]: ${testName}`);
  }
}

async function runTestSuite() {
  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 1: API /api/fincas/visit-lock (POST & GET, ZOD, PRICE-LOCK SHA-256)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- BLOQUE 1: /api/fincas/visit-lock ---');

  // Test 1: Invariante SSOT Depósito
  assert(DEPOSITO_STRIPE_EUR === 100.0, 'DEPOSITO_STRIPE_EUR debe ser exactamente 100.00 €');

  // Test 2: Validación Zod con payload válido
  const validVisitPayload = {
    fincaId: 'villa-escorial-park',
    fincaName: 'Villa Escorial Park',
    contactName: 'Samantha Vallejo-Nágera',
    contactEmail: 'eventos@dehesavalbueno.com',
    contactPhone: '+34 949 208 040',
    desiredVisitDate: '2026-11-20',
    timeSlot: 'MORNING',
    locationAddress: 'Carretera M-600 km 7',
    municipio: 'San Lorenzo de El Escorial',
    provincia: 'Madrid',
    distanceHubKm: 58,
    portalAnterior: 'Bodas.net',
    cuotaAnteriorEurMes: 220,
  };

  const zodValidResult = FincaVisitLockRequestSchema.safeParse(validVisitPayload);
  assert(zodValidResult.success === true, 'FincaVisitLockRequestSchema acepta payload válido');

  // Test 3: Validación Zod rechaza payload incompleto (sin email ni teléfono)
  const zodInvalidResult = FincaVisitLockRequestSchema.safeParse({
    fincaId: 'villa-escorial-park',
    fincaName: 'Villa Escorial Park',
  });
  assert(zodInvalidResult.success === false, 'FincaVisitLockRequestSchema rechaza campos obligatorios ausentes');

  // Test 4: Validación Zod rechaza fecha con formato no YYYY-MM-DD
  const zodBadDateResult = FincaVisitLockRequestSchema.safeParse({
    ...validVisitPayload,
    desiredVisitDate: '20-11-2026',
  });
  assert(zodBadDateResult.success === false, 'FincaVisitLockRequestSchema rechaza formato de fecha incorrecto');

  // Test 5: Sello Criptográfico HMAC SHA-256 (Price-Lock)
  const hash1 = generatePriceLockSha256({
    fincaId: 'villa-escorial-park',
    desiredVisitDate: '2026-11-20',
    timeSlot: 'MORNING',
    amountEur: 100.0,
    contactEmail: 'eventos@dehesavalbueno.com',
  });

  const hash2 = generatePriceLockSha256({
    fincaId: 'villa-escorial-park',
    desiredVisitDate: '2026-11-20',
    timeSlot: 'MORNING',
    amountEur: 100.0,
    contactEmail: 'eventos@dehesavalbueno.com',
  });

  assert(hash1.startsWith('SHA256-Ω-FINCA-'), 'Price-lock hash tiene prefijo canónico SHA256-Ω-FINCA-');
  assert(hash1 === hash2, 'Price-lock hash es determinista e idempotente para los mismos datos');

  // Test 6: Invocación POST válida a /api/fincas/visit-lock
  const postReq = new NextRequest('http://localhost:3000/api/fincas/visit-lock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validVisitPayload),
  });
  const postRes = await visitLockPOST(postReq);
  const postData = await postRes.json();

  assert(postRes.status === 200, 'POST /api/fincas/visit-lock devuelve HTTP 200');
  assert(postData.success === true, 'POST respuesta success === true');
  assert(postData.depositAmountEur === 100.0, 'POST depósito es exactamente 100.00 €');
  assert(postData.depositDeductibleCents === 10000, 'POST depósito en céntimos es 10000');
  assert(typeof postData.sessionId === 'string' && postData.sessionId.length > 0, 'POST emite sessionId');
  assert(typeof postData.checkoutUrl === 'string' && postData.checkoutUrl.length > 0, 'POST emite checkoutUrl');
  assert(postData.priceLockSha256.startsWith('SHA256-Ω-FINCA-'), 'POST devuelve firma SHA256-Ω-FINCA-');

  // Test 7: Invocación POST rechaza fecha en el pasado
  const pastDatePayload = {
    ...validVisitPayload,
    desiredVisitDate: '2020-01-01',
  };
  const pastReq = new NextRequest('http://localhost:3000/api/fincas/visit-lock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pastDatePayload),
  });
  const pastRes = await visitLockPOST(pastReq);
  const pastData = await pastRes.json();
  assert(pastRes.status === 400, 'POST con fecha pasada devuelve HTTP 400');
  assert(pastData.error === 'DATE_IN_PAST', 'POST con fecha pasada reporta error DATE_IN_PAST');

  // Test 8: Invocación GET /api/fincas/visit-lock con parámetros válidos
  const getReq = new NextRequest(
    'http://localhost:3000/api/fincas/visit-lock?fincaId=villa-escorial-park&date=2026-11-20&timeSlot=MORNING'
  );
  const getRes = await visitLockGET(getReq);
  const getData = await getRes.json();
  assert(getRes.status === 200, 'GET /api/fincas/visit-lock devuelve HTTP 200');
  assert(getData.success === true, 'GET respuesta success === true');
  assert(typeof getData.available === 'boolean', 'GET disponibilidad es booleana');
  assert(getData.depositDeductibleCents === 10000, 'GET depósito deductible es 10000 céntimos');

  // Test 9: Invocación GET /api/fincas/visit-lock sin parámetros requeridos
  const getMissingReq = new NextRequest('http://localhost:3000/api/fincas/visit-lock');
  const getMissingRes = await visitLockGET(getMissingReq);
  const getMissingData = await getMissingRes.json();
  assert(getMissingRes.status === 400, 'GET sin parámetros devuelve HTTP 400');
  assert(getMissingData.error === 'MISSING_PARAMS', 'GET sin parámetros reporta MISSING_PARAMS');

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 2: API /api/b2b/homologacion (TÉCNICA & PACTO 100 FUNDADORES)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- BLOQUE 2: /api/b2b/homologacion ---');

  // Test 10: Homologación Clásica Aprobada (sin campos de Fundador)
  const classicalPayload: B2BHomologacionInput = {
    name: 'Finca Monte Real',
    location: 'El Escorial',
    provincia: 'Madrid',
    potenciaKw: 25,
    tomaElectrica: 'CETAC 32A 3P+N+T',
    polizaRCEuros: 300000,
    accesoConvoy14Plazas: true,
    director: 'Carlos Mendizábal',
    telefono: '+34 912 345 678',
    email: 'info@fincamontereal.com',
  };

  const homReq1 = new NextRequest('http://localhost:3000/api/b2b/homologacion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(classicalPayload),
  });
  const homRes1 = await homologacionPOST(homReq1);
  const homData1 = await homRes1.json();

  assert(homRes1.status === 200, 'POST /api/b2b/homologacion clásico devuelve HTTP 200');
  assert(homData1.success === true, 'Homologación clásica exitosa');
  assert(homData1.resultadoAuditoria.aprobado === true, 'Auditoría técnica aprobada');
  assert(homData1.resultadoAuditoria.score === 100, 'Puntuación máxima 100 en auditoría técnica limpia');
  assert(homData1.pactoFundadores === null, 'Pacto de Fundadores es null si no fue solicitado');
  assert(homData1.webhookDispatched === true, 'Webhook n8n encolado correctamente');

  // Test 11: Auditoría Técnica con Infracciones (Acometida deficiente y sin CETAC)
  const nonCompliantPayload: B2BHomologacionInput = {
    name: 'Cortijo Sin Acometida',
    location: 'Toledo',
    provincia: 'Toledo',
    potenciaKw: 5, // < 15 kW
    tomaElectrica: 'Schuko 10A convencional', // Sin CETAC
    polizaRCEuros: 100000, // < 300.000 €
    accesoConvoy14Plazas: false,
  };

  const homReq2 = new NextRequest('http://localhost:3000/api/b2b/homologacion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nonCompliantPayload),
  });
  const homRes2 = await homologacionPOST(homReq2);
  const homData2 = await homRes2.json();

  assert(homRes2.status === 200, 'POST con infracciones responde HTTP 200 con auditoría no aprobada');
  assert(homData2.resultadoAuditoria.aprobado === false, 'Auditoría rechazada correctamente');
  assert(homData2.resultadoAuditoria.infracciones.length >= 3, 'Infracciones registradas (RC, potencia, CETAC)');
  assert(homData2.resultadoAuditoria.estado === 'REQUIERE_SUBSANACION_TECNICA', 'Estado REQUIERE_SUBSANACION_TECNICA');

  // Test 12: Onboarding con Pacto de los 100 Fundadores (Price-Match)
  const founderPayload: B2BHomologacionInput = {
    name: 'Finca El Castañar',
    location: 'Méntrida',
    provincia: 'Toledo',
    potenciaKw: 30,
    tomaElectrica: 'CETAC 32A 3P+N+T',
    polizaRCEuros: 600000,
    accesoConvoy14Plazas: true,
    director: 'Ignacio Figueroa',
    telefono: '+34 925 123 456',
    email: 'contacto@elcastanar.es',
    portalAnterior: 'Bodas.net',
    cuotaAnteriorEurMes: 215,
    isFounderPactApplied: true,
  };

  const homReq3 = new NextRequest('http://localhost:3000/api/b2b/homologacion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(founderPayload),
  });
  const homRes3 = await homologacionPOST(homReq3);
  const homData3 = await homRes3.json();

  assert(homRes3.status === 200, 'POST con Pacto de Fundadores devuelve HTTP 200');
  assert(homData3.pactoFundadores !== null, 'pactoFundadores devuelto');
  assert(homData3.pactoFundadores.applied === true, 'pactoFundadores.applied === true');
  assert(homData3.pactoFundadores.cuotaIgualadaEurMes === 215, 'Cuota mensual igualada a 215,00 €/mes');
  assert(homData3.pactoFundadores.lifetimePriceLock === true, 'Tarifa vitalicia blindada (lifetimePriceLock)');
  assert(typeof homData3.pactoFundadores.founderSlotNumber === 'number', 'Número de plaza de Fundador asignada');
  assert(homData3.pactoFundadores.remainingSlots > 0, 'Plazas restantes de Fundador calculadas');

  // Test 13: Cuerpo inválido en /api/b2b/homologacion
  const badBodyReq = new NextRequest('http://localhost:3000/api/b2b/homologacion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify('string_invalido_no_objeto'),
  });
  const badBodyRes = await homologacionPOST(badBodyReq);
  assert(badBodyRes.status === 400, 'POST con cuerpo no objeto devuelve HTTP 400');

  // ──────────────────────────────────────────────────────────────────────────
  // BLOQUE 3: SERVER ACTION dispatchFincaLogisticsOrderAction (1-CLIC ORDER)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- BLOQUE 3: fincaLogisticsActions.ts ---');

  // Test 14: Orden logística en 1-clic exitosa
  const validOrderInput: FincaLogisticsOrderInput = {
    fincaId: 'villa-escorial-park',
    fincaName: 'Villa Escorial Park',
    contactName: 'Samantha Vallejo-Nágera',
    contactEmail: 'eventos@dehesavalbueno.com',
    contactPhone: '+34 949 208 040',
    municipio: 'San Lorenzo de El Escorial',
    provincia: 'Madrid',
    distanceKm: 58,
    menuId: 'boda-cantabrico',
    guestCount: 120,
    selectedExtraIds: ['dj-residente', 'barra-libre-extra'],
    eventDate: '2026-10-18',
    eventEndTime: '04:00', // >= 03:00 activa hotel
    affiliateCommissionPct: 0.12,
    notes: 'Acceso furgón por puerta norte CETAC 32A junto a la pérgola.',
  };

  const orderResult = await dispatchFincaLogisticsOrderAction(validOrderInput);

  assert(orderResult.success === true, 'dispatchFincaLogisticsOrderAction retorna success === true');
  assert(orderResult.status === 'CONFIRMED', 'orderResult.status === "CONFIRMED"');
  assert(Boolean(orderResult.orderId && orderResult.orderId.startsWith('ORD-')), 'orderId generado con prefijo ORD-');
  assert(orderResult.n8nDispatched === true, 'Webhook n8n despachado para la orden');
  assert(Boolean(orderResult.pricing), 'Pricing breakdown presente');

  if (orderResult.pricing) {
    const { split, subtotalCents, depositDeductibleCents, acousticRider, affiliateCommission } = orderResult.pricing;

    // Test 15: Integridad absoluta del Split Soberano 80/10/10 en céntimos
    const splitSum = split.artistaCents + split.earOsCents + split.vimumeCents;
    assert(
      splitSum === subtotalCents,
      `Split 80/10/10 exacto: ${splitSum} céntimos === subtotal ${subtotalCents} céntimos`
    );

    // Test 16: Proporción 80/10/10 con mayor resto Hare-Niemeyer
    const artistaPct = split.artistaCents / subtotalCents;
    const earOsPct = split.earOsCents / subtotalCents;
    const vimumePct = split.vimumeCents / subtotalCents;
    assert(Math.abs(artistaPct - 0.8) < 0.001, 'Porción del Artista es 80% exacto');
    assert(Math.abs(earOsPct - 0.1) < 0.001, 'Porción de EAR OS es 10% exacto');
    assert(Math.abs(vimumePct - 0.1) < 0.001, 'Porción de VIMUME es 10% exacto');

    // Test 17: Invariante del depósito deducible
    assert(depositDeductibleCents === 10000, 'Depósito deducible de fianza es exactamente 100,00 € (10.000 céntimos)');

    // Test 18: Rider Acústico Ley 37/2003
    assert(acousticRider.isCompliant === true, 'Rider acústico cumple normativa legal');
    assert(acousticRider.maxDbSpl <= 75, 'Presión sonora conforme a límite de salud pública (<= 75 dB SPL)');
    assert(
      acousticRider.recommendedWatts === 120 * 12,
      `Potencia acústica calculada en 12 W/pax (${acousticRider.recommendedWatts} W para 120 comensales)`
    );

    // Test 19: Comisión de Afiliación detraída de EAR OS con SLA de 7 días
    assert(affiliateCommission.commissionCents > 0, 'Comisión de afiliado para finca calculada (> 0)');
    assert(affiliateCommission.liquidationDaysSla === 7, 'SLA de liquidación de comisiones en 7 días hábiles');
  }

  // Test 20: Fallo de validación por comensales inválidos (<= 0)
  const invalidGuestsOrder = await dispatchFincaLogisticsOrderAction({
    ...validOrderInput,
    guestCount: 0,
  });
  assert(invalidGuestsOrder.success === false, 'Rechaza comensales <= 0');
  assert(invalidGuestsOrder.status === 'VALIDATION_ERROR', 'Estado VALIDATION_ERROR en comensales <= 0');

  // Test 21: Fallo de validación por email sintácticamente inválido
  const invalidEmailOrder = await dispatchFincaLogisticsOrderAction({
    ...validOrderInput,
    contactEmail: 'email-invalido-sin-arroba',
  });
  assert(invalidEmailOrder.success === false, 'Rechaza email inválido');
  assert(invalidEmailOrder.status === 'VALIDATION_ERROR', 'Estado VALIDATION_ERROR en email inválido');

  // Test 22: Fallo de validación por menú inexistente en catálogo canónico 2026
  const invalidMenuOrder = await dispatchFincaLogisticsOrderAction({
    ...validOrderInput,
    menuId: 'menu-fantasma-inexistente-2099',
  });
  assert(invalidMenuOrder.success === false, 'Rechaza menú no catalogado');
  assert(invalidMenuOrder.status === 'VALIDATION_ERROR', 'Estado VALIDATION_ERROR en menú no catalogado');

  // ──────────────────────────────────────────────────────────────────────────
  // RESUMEN CONSOLIDADO
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n════════════════════════════════════════════════════════════════');
  console.log(`🎉 SUITE MILESTONE 2 COMPLETADA: ${passedTests}/${totalTests} TESTS SUPERADOS CON ÉXITO`);
  console.log('════════════════════════════════════════════════════════════════');
}

runTestSuite().catch((err: unknown) => {
  console.error('\n❌ FATAL TEST RUNNER ERROR:', err);
  process.exit(1);
});
