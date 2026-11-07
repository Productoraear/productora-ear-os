/**
 * ════════════════════════════════════════════════════════════════════════════
 * FINCAS B2B ESCAPARATE — TIER 5 ADVERSARIAL STRESS TEST SUITE
 * ════════════════════════════════════════════════════════════════════════════
 * Ubicación: `scripts/stress_tier5_transactions_ui.ts`
 * Referencia: `PROJECT.md` · `ORIGINAL_REQUEST.md` (R1-R5) · Milestone 5 Phase 2
 *
 * Misión:
 *  Ejecutar pruebas adversariales de caja blanca (White-Box Stress Testing) sobre:
 *  1. Malformed payloads, SQL/XSS injections en campos de texto, fechas inválidas/pasadas, fincas inexistentes.
 *  2. Idempotencia y verificación criptográfica de sellos HMAC SHA-256 Price-Lock (100 €).
 *  3. Prevención de doble submit en componentes UI transaccionales (useTransition/disabled).
 *  4. Cumplimiento estricto de Contact-Gate (0% fuga de teléfonos privados de propietarios).
 *  5. Erradicación de fuga publicitaria a competidores (0% ad-leak / sin carruseles cruzados).
 *  6. Robustez de Server Actions de logística y cálculo determinista en céntimos.
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';

// ── IMPORTACIÓN DE MÓDULOS DE APLICACIÓN ──────────────────────────────────────
import {
  POST as visitLockPostHandler,
  GET as visitLockGetHandler,
  generatePriceLockSha256,
  FincaVisitLockRequestSchema,
} from '../src/app/api/fincas/visit-lock/route';

import {
  dispatchFincaLogisticsOrderAction,
  type FincaLogisticsOrderInput,
} from '../src/app/actions/fincaLogisticsActions';

import {
  calculateFincaEventPricing,
  type FincaMenuPricingInput,
} from '../src/lib/fincas/fincaMenuPricingEngine';

import {
  SCLASS_12_FINCAS_HOMOLOGADAS,
} from '../src/lib/constants/fincas-catalog';

import {
  maskPhone,
} from '../src/features/bodas/ui/FincasCatalogExplorer';

import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
} from '../src/lib/constants/ear-os-ssot';

// ── TRACKER DE RESULTADOS ADVERSARIALES ───────────────────────────────────────

interface StressResult {
  category: string;
  testName: string;
  passed: boolean;
  durationMs: number;
  details?: string;
  error?: string;
}

class AdversarialStressTracker {
  private results: StressResult[] = [];
  private startTime = Date.now();

  record(result: StressResult): void {
    this.results.push(result);
    const badge = result.passed ? '✔ PASS' : '✖ FAIL';
    console.log(`  [${result.category}] ${badge.padEnd(8)} ${result.testName} (${result.durationMs}ms)`);
    if (!result.passed && result.error) {
      console.error(`      └─ ERROR: ${result.error}`);
    }
    if (result.details) {
      console.log(`      └─ INFO: ${result.details}`);
    }
  }

  getSummary() {
    const total = this.results.length;
    const passed = this.results.filter((r) => r.passed).length;
    const failed = total - passed;
    return {
      total,
      passed,
      failed,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(1) : '0',
      durationMs: Date.now() - this.startTime,
      results: this.results,
    };
  }
}

// ── SUITE 1: VISIT-LOCK API ADVERSARIAL STRESS ────────────────────────────────

async function testVisitLockApi(tracker: AdversarialStressTracker): Promise<void> {
  console.log('\n▶ [SUITE 1] Adversarial Probing: POST /api/fincas/visit-lock');

  // Vector 1.1: Payload vacío / malformado
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const req = new NextRequest('http://localhost:3000/api/fincas/visit-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const res = await visitLockPostHandler(req);
      const json = await res.json();
      if (res.status === 400 && json.error === 'VALIDATION_ERROR') {
        passed = true;
      } else {
        throw new Error(`Esperado HTTP 400 VALIDATION_ERROR, obtenido ${res.status}: ${JSON.stringify(json)}`);
      }
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'API_INJECTION',
      testName: 'Empty Payload Rejection (Zod Schema Validation)',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // Vector 1.2: SQL Injection en campos de texto (fincaName, contactName, locationAddress)
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const sqlPayload = {
        fincaId: "villa-escorial-park' OR '1'='1",
        fincaName: "Finca'; DROP TABLE fincas; --",
        contactName: "Admin' UNION SELECT * FROM users --",
        contactEmail: "legal_injection@example.com",
        contactPhone: "+34 600 000 000",
        desiredVisitDate: "2026-10-15",
        timeSlot: "MORNING",
        locationAddress: "Calle Principal 1'; SHUTDOWN; --",
        municipio: "Madrid' OR 1=1 --",
        provincia: "Madrid",
        notes: "' OR 'a'='a",
      };
      const req = new NextRequest('http://localhost:3000/api/fincas/visit-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sqlPayload),
      });
      const res = await visitLockPostHandler(req);
      const json = await res.json();
      // Debe procesar con seguridad sin unhandled exception y generar sello SHA-256 o responder estructuradamente
      if (res.status === 200 && json.success && json.priceLockSha256) {
        passed = true;
      } else if (res.status === 400) {
        // Rechazo sanitizado también es aceptable
        passed = true;
      } else {
        throw new Error(`Comportamiento inesperado ante SQLi: HTTP ${res.status}: ${JSON.stringify(json)}`);
      }
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'API_INJECTION',
      testName: 'SQL Injection Resistance in String Fields (No Unhandled Exceptions)',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // Vector 1.3: XSS / Script Injection en notas y nombres
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const xssPayload = {
        fincaId: "villa-escorial-park",
        fincaName: "<script>alert('pwned')</script>",
        contactName: "<img src=x onerror=alert('xss')>",
        contactEmail: "security_test@productoraear.com",
        contactPhone: "+34 693 693 048",
        desiredVisitDate: "2026-08-20",
        timeSlot: "AFTERNOON",
        locationAddress: "<iframe src='javascript:alert(1)'></iframe>",
        municipio: "Méntrida",
        provincia: "Toledo",
        notes: "<b>Prueba XSS</b><script>fetch('http://evil.com')</script>",
      };
      const req = new NextRequest('http://localhost:3000/api/fincas/visit-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(xssPayload),
      });
      const res = await visitLockPostHandler(req);
      const json = await res.json();
      if (res.status === 200 && json.success && json.priceLockSha256) {
        passed = true;
      } else {
        throw new Error(`Fallo procesando payload con caracteres XSS: HTTP ${res.status}`);
      }
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'API_INJECTION',
      testName: 'XSS & HTML Tag Resistance in User Inputs',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // Vector 1.4: Fechas pasadas (Past Dates)
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const pastDatePayload = {
        fincaId: "villa-escorial-park",
        fincaName: "Villa Escorial Park",
        contactName: "Inspector Retroactivo",
        contactEmail: "retro@test.com",
        contactPhone: "+34 611 222 333",
        desiredVisitDate: "2020-01-01", // Fecha en el pasado evidente
        locationAddress: "Carretera M-505",
        municipio: "San Lorenzo de El Escorial",
        provincia: "Madrid",
      };
      const req = new NextRequest('http://localhost:3000/api/fincas/visit-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pastDatePayload),
      });
      const res = await visitLockPostHandler(req);
      const json = await res.json();
      if (res.status === 400 && json.error === 'DATE_IN_PAST') {
        passed = true;
      } else {
        throw new Error(`Se esperaba HTTP 400 DATE_IN_PAST para fecha 2020-01-01, obtenido ${res.status}: ${JSON.stringify(json)}`);
      }
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'API_VALIDATION',
      testName: 'Rejection of Past Dates (DATE_IN_PAST HTTP 400)',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // Vector 1.5: Fechas con formato inválido
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const invalidDatePayload = {
        fincaId: "villa-escorial-park",
        fincaName: "Villa Escorial Park",
        contactName: "Tester Fechas",
        contactEmail: "fechas@test.com",
        contactPhone: "+34 611 222 333",
        desiredVisitDate: "20-06-2026", // DD-MM-YYYY no cumple formato YYYY-MM-DD
        locationAddress: "Carretera M-505",
        municipio: "San Lorenzo de El Escorial",
        provincia: "Madrid",
      };
      const req = new NextRequest('http://localhost:3000/api/fincas/visit-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidDatePayload),
      });
      const res = await visitLockPostHandler(req);
      const json = await res.json();
      if (res.status === 400 && json.error === 'VALIDATION_ERROR') {
        passed = true;
      } else {
        throw new Error(`Se esperaba HTTP 400 VALIDATION_ERROR para formato inválido, obtenido ${res.status}`);
      }
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'API_VALIDATION',
      testName: 'Rejection of Invalid Date Formats (Strict Regex YYYY-MM-DD)',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // Vector 1.6: Email inválido
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const badEmailPayload = {
        fincaId: "villa-escorial-park",
        fincaName: "Villa Escorial Park",
        contactName: "Tester Email",
        contactEmail: "not-an-email",
        contactPhone: "+34 611 222 333",
        desiredVisitDate: "2026-09-15",
        locationAddress: "Carretera M-505",
        municipio: "San Lorenzo de El Escorial",
        provincia: "Madrid",
      };
      const req = new NextRequest('http://localhost:3000/api/fincas/visit-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(badEmailPayload),
      });
      const res = await visitLockPostHandler(req);
      const json = await res.json();
      if (res.status === 400 && json.error === 'VALIDATION_ERROR') {
        passed = true;
      } else {
        throw new Error(`Se esperaba HTTP 400 para email inválido, obtenido ${res.status}`);
      }
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'API_VALIDATION',
      testName: 'Rejection of Malformed Email (Zod email validator)',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // Vector 1.7: Finca ID inexistente en catálogo
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const nonExistentPayload = {
        fincaId: "finca-fantasma-inexistente-9999",
        fincaName: "Finca No Registrada",
        contactName: "Propietario Independiente",
        contactEmail: "prop@fincafantasma.com",
        contactPhone: "+34 699 888 777",
        desiredVisitDate: "2026-11-20",
        locationAddress: "Camino Desconocido km 12",
        municipio: "Localidad Rural",
        provincia: "Cuenca",
      };
      const req = new NextRequest('http://localhost:3000/api/fincas/visit-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nonExistentPayload),
      });
      const res = await visitLockPostHandler(req);
      const json = await res.json();
      // Debe resolver distancia fallback (0 km) y generar sesión sin crashear
      if (res.status === 200 && json.success && json.visit.fincaId === 'finca-fantasma-inexistente-9999') {
        passed = true;
      } else {
        throw new Error(`Finca inexistente causó fallo inesperado: HTTP ${res.status}: ${JSON.stringify(json)}`);
      }
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'API_RESILIENCE',
      testName: 'Graceful Handling of Non-Existent Finca ID (Zero Distance Fallback)',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // Vector 1.8: GET Availability Endpoint
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const req = new NextRequest('http://localhost:3000/api/fincas/visit-lock?fincaId=villa-escorial-park&date=2026-07-15&timeSlot=MORNING', {
        method: 'GET',
      });
      const res = await visitLockGetHandler(req);
      const json = await res.json();
      if (res.status === 200 && json.success && json.depositAmountEur === DEPOSITO_STRIPE_EUR) {
        passed = true;
      } else {
        throw new Error(`GET /api/fincas/visit-lock falló: ${res.status}: ${JSON.stringify(json)}`);
      }
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'API_AVAILABILITY',
      testName: 'GET Availability Endpoint Query for UI Date-Pickers',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }
}

// ── SUITE 2: CRYPTOGRAPHIC PRICE-LOCK HMAC SHA-256 INTEGRITY ─────────────────

async function testPriceLockCryptographicIntegrity(tracker: AdversarialStressTracker): Promise<void> {
  console.log('\n▶ [SUITE 2] Cryptographic Integrity: HMAC SHA-256 Price-Lock Seal');

  // Vector 2.1: Determinismo estricto e idempotencia
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const payload = {
        fincaId: 'palacio-aranjuez-eventos',
        desiredVisitDate: '2026-09-20',
        timeSlot: 'MORNING',
        amountEur: 100.0,
        contactEmail: 'director@aranjuez.com',
      };
      const baseline = generatePriceLockSha256(payload);

      // Evaluar 100 ejecuciones consecutivas
      let allMatch = true;
      for (let i = 0; i < 100; i++) {
        const nextSeal = generatePriceLockSha256(payload);
        if (nextSeal !== baseline) {
          allMatch = false;
          break;
        }
      }

      if (allMatch && baseline.startsWith('SHA256-Ω-FINCA-') && baseline.length === 32) {
        passed = true;
      } else {
        throw new Error(`El sello no es determinista o tiene formato inválido: ${baseline}`);
      }
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'CRYPTO_SEAL',
      testName: 'Deterministic & Idempotent Price-Lock Seal (100 Repetitions)',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // Vector 2.2: Efecto avalancha (Avalanche Effect) y resistencia a colisiones
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const basePayload = {
        fincaId: 'finca-la-esmeralda',
        desiredVisitDate: '2026-06-15',
        timeSlot: 'ALL_DAY',
        amountEur: 100.0,
        contactEmail: 'gerencia@fincaesmeralda.com',
      };
      const sealBase = generatePriceLockSha256(basePayload);

      // Mutación 1: cambiar un carácter en email
      const sealMutEmail = generatePriceLockSha256({
        ...basePayload,
        contactEmail: 'gerenciA@fincaesmeralda.com', // mayúscula normalizada
      });

      // Mutación 2: cambiar fecha por 1 día
      const sealMutDate = generatePriceLockSha256({
        ...basePayload,
        desiredVisitDate: '2026-06-16',
      });

      // Mutación 3: cambiar timeSlot
      const sealMutSlot = generatePriceLockSha256({
        ...basePayload,
        timeSlot: 'AFTERNOON',
      });

      // Mutación 4: cambiar importe
      const sealMutAmount = generatePriceLockSha256({
        ...basePayload,
        amountEur: 99.99,
      });

      // Email normalizado en minúsculas debe coincidir:
      if (sealBase !== sealMutEmail) {
        throw new Error('generatePriceLockSha256 debe normalizar email en minúsculas');
      }

      // El resto de mutaciones DEBE producir sellos radicalmente distintos:
      if (
        sealBase === sealMutDate ||
        sealBase === sealMutSlot ||
        sealBase === sealMutAmount ||
        sealMutDate === sealMutSlot
      ) {
        throw new Error('Colisión de sellos detectada ante mutaciones de entrada');
      }

      passed = true;
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'CRYPTO_SEAL',
      testName: 'Avalanche Effect & Collision Resistance on Input Mutations',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }
}

// ── SUITE 3: SERVER ACTION LOGISTICS ADVERSARIAL STRESS ───────────────────────

async function testLogisticsServerAction(tracker: AdversarialStressTracker): Promise<void> {
  console.log('\n▶ [SUITE 3] Server Action Stress: dispatchFincaLogisticsOrderAction');

  // Vector 3.1: Orden con parámetros válidos (Golden Path)
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const validOrder: FincaLogisticsOrderInput = {
        fincaId: 'villa-escorial-park',
        contactName: 'Carlos Mendizábal',
        contactEmail: 'director@escorialpark.es',
        contactPhone: '+34 612 345 678',
        menuId: 'boda-cantabrico',
        guestCount: 150,
        selectedExtraIds: ['solista-edwin', 'iluminacion-arquitectonica-led'],
        eventDate: '2026-07-25',
        eventEndTime: '04:00',
        distanceKm: 55,
        affiliateCommissionPct: 0.12,
      };

      const result = await dispatchFincaLogisticsOrderAction(validOrder);

      if (
        result.success &&
        result.status === 'CONFIRMED' &&
        result.orderId?.startsWith('ORD-') &&
        result.pricing &&
        result.pricing.depositDeductibleCents === 10000 &&
        result.n8nDispatched === true &&
        result.pricing.acousticRider.isCompliant === true
      ) {
        // Verificar invariante del Split 80/10/10
        const { artistaCents, earOsCents, vimumeCents } = result.pricing.split;
        const totalSplit = artistaCents + earOsCents + vimumeCents;
        if (totalSplit !== result.pricing.subtotalCents) {
          throw new Error(`Split sum mismatch: ${totalSplit} vs subtotal ${result.pricing.subtotalCents}`);
        }
        passed = true;
      } else {
        throw new Error(`Server Action no retornó orden válida: ${JSON.stringify(result)}`);
      }
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'SERVER_ACTION',
      testName: 'Golden Path 1-Click Logistics Dispatch with 80/10/10 Split & n8n',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // Vector 3.2: Comensales negativos o cero (Boundary Negative Aforo)
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const invalidAforo: FincaLogisticsOrderInput = {
        fincaId: 'villa-escorial-park',
        contactName: 'Tester Aforo',
        contactEmail: 'test@aforo.es',
        contactPhone: '+34 600 000 000',
        menuId: 'boda-cantabrico',
        guestCount: -5,
        eventDate: '2026-08-10',
      };
      const result = await dispatchFincaLogisticsOrderAction(invalidAforo);
      if (!result.success && result.status === 'VALIDATION_ERROR') {
        passed = true;
      } else {
        throw new Error(`Se esperaba VALIDATION_ERROR para aforo negativo, obtenido: ${result.status}`);
      }
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'SERVER_ACTION',
      testName: 'Rejection of Negative or Zero Guest Count (Aforo <= 0)',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // Vector 3.3: Menú inexistente en catálogo canónico 2026
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const fakeMenuOrder: FincaLogisticsOrderInput = {
        fincaId: 'villa-escorial-park',
        contactName: 'Tester Menu Fake',
        contactEmail: 'fake@menu.es',
        contactPhone: '+34 600 000 000',
        menuId: 'menu-fake-hacker-2026',
        guestCount: 100,
        eventDate: '2026-08-10',
      };
      const result = await dispatchFincaLogisticsOrderAction(fakeMenuOrder);
      if (!result.success && result.status === 'VALIDATION_ERROR') {
        passed = true;
      } else {
        throw new Error(`Se esperaba VALIDATION_ERROR para menú falso, obtenido: ${result.status}`);
      }
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'SERVER_ACTION',
      testName: 'Rejection of Non-Canonical Menu ID',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // Vector 3.4: Teléfono con menos de 9 dígitos
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const shortPhoneOrder: FincaLogisticsOrderInput = {
        fincaId: 'villa-escorial-park',
        contactName: 'Tester Phone Corto',
        contactEmail: 'short@phone.es',
        contactPhone: '12345',
        menuId: 'boda-cantabrico',
        guestCount: 100,
        eventDate: '2026-08-10',
      };
      const result = await dispatchFincaLogisticsOrderAction(shortPhoneOrder);
      if (!result.success && result.status === 'VALIDATION_ERROR') {
        passed = true;
      } else {
        throw new Error(`Se esperaba VALIDATION_ERROR para teléfono < 9 dígitos, obtenido: ${result.status}`);
      }
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'SERVER_ACTION',
      testName: 'Rejection of Short Phone (< 9 digits)',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }
}

// ── SUITE 4: UI DOUBLE-SUBMIT & RACE CONDITION RESISTANCE ─────────────────────

async function testUiDoubleSubmitPrevention(tracker: AdversarialStressTracker): Promise<void> {
  console.log('\n▶ [SUITE 4] UI Double-Submit Prevention & Button Disabling Audit');

  const filesToCheck = [
    {
      file: 'src/components/fincas/FincaMenuSimulator2026.tsx',
      target: 'Modal de Encargo Logístico 1-Clic',
      pattern: /disabled=\{isPending\}/,
      hookPattern: /useTransition/,
    },
    {
      file: 'src/features/bodas/ui/FincasCatalogExplorer.tsx',
      target: 'Modal de Bloqueo de Visita Técnica',
      pattern: /disabled=\{isSubmitting\}/,
      hookPattern: /useTransition/,
    },
    {
      file: 'src/components/fincas/FincasB2BPortal.tsx',
      target: 'Formulario de Onboarding Express B2B',
      pattern: /disabled=\{submittingOnboarding\}/,
      hookPattern: /setSubmittingOnboarding\(true\)/,
    },
  ];

  for (const check of filesToCheck) {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const fullPath = path.resolve(process.cwd(), check.file);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Fichero no encontrado: ${check.file}`);
      }
      const content = fs.readFileSync(fullPath, 'utf8');

      const hasDisable = check.pattern.test(content);
      const hasHook = check.hookPattern.test(content);

      if (!hasDisable) {
        throw new Error(`Falta cerrojo disabled={...} en ${check.target} (${check.file})`);
      }
      if (!hasHook) {
        throw new Error(`Falta control de estado pendiente en ${check.target} (${check.file})`);
      }
      passed = true;
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }

    tracker.record({
      category: 'UI_DOUBLE_SUBMIT',
      testName: `Double-Submit Lock in ${check.target}`,
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }
}

// ── SUITE 5: CONTACT-GATE COMPLIANCE & ZERO PHONE LEAK ────────────────────────

async function testContactGateZeroLeak(tracker: AdversarialStressTracker): Promise<void> {
  console.log('\n▶ [SUITE 5] Contact-Gate Compliance: Zero Raw Phone Exposure');

  // Vector 5.1: Verificación funcional de maskPhone
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const testCases = [
        { input: '+34 918 123 456', expectedPrefix: '+34 918', mustContainMask: '••• •••' },
        { input: '+34 600 112 233', expectedPrefix: '+34 600', mustContainMask: '••• •••' },
        { input: '612345678', expectedPrefix: '6123', mustContainMask: '••• •••' },
        { input: '', expectedPrefix: '•••', mustContainMask: '••• ••• •••' },
      ];

      for (const tc of testCases) {
        const masked = maskPhone(tc.input);
        if (!masked.includes(tc.mustContainMask)) {
          throw new Error(`maskPhone falló para "${tc.input}": obtenido "${masked}"`);
        }
        // No debe contener el número completo
        if (tc.input.length > 5 && masked.includes('123 456')) {
          throw new Error(`maskPhone filtró el número completo: "${masked}"`);
        }
      }
      passed = true;
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'CONTACT_GATE',
      testName: 'maskPhone Functional Masking Integrity',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // Vector 5.2: Verificación de las 12 fincas en catálogo público
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const explorerPath = path.resolve(process.cwd(), 'src/features/bodas/ui/FincasCatalogExplorer.tsx');
      const content = fs.readFileSync(explorerPath, 'utf8');

      // Comprobar que FincasCatalogExplorer utiliza maskPhone al renderizar el teléfono
      if (!content.includes('maskPhone(finca.directorioContacto.telefono)')) {
        throw new Error('FincasCatalogExplorer no invoca maskPhone sobre el teléfono del contacto');
      }

      // Comprobar que la centralita oficial se muestra sin enmascarar como canal canónico
      if (!content.includes('CENTRALITA.display')) {
        throw new Error('FincasCatalogExplorer no muestra CENTRALITA.display oficial');
      }

      passed = true;
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      category: 'CONTACT_GATE',
      testName: 'Public FincasCatalogExplorer applies maskPhone to Directory Phones',
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }
}

// ── SUITE 6: COMPETITOR CROSS-SELLING 0% AD-LEAK AUDIT ───────────────────────

async function testCompetitorAdLeakEradication(tracker: AdversarialStressTracker): Promise<void> {
  console.log('\n▶ [SUITE 6] Competitor Cross-Selling Eradication (0% Ad-Leak)');

  const scannedFiles = [
    'src/app/(public)/fincas/page.tsx',
    'src/features/bodas/ui/FincasCatalogExplorer.tsx',
    'src/components/fincas/FincasB2BPortal.tsx',
    'src/components/fincas/FincaMenuSimulator2026.tsx',
  ];

  const prohibitedKeywords = [
    'adsbygoogle',
    'googletagmanager',
    'taboola',
    'outbrain',
    'criteo',
    'bodas.net/widget',
    'competingVenues',
    'suggestedAlternativeFincas',
    'sponsoredVenues',
    'NeuralNavigation', // Erradicado de fichas de fincas
  ];

  for (const relPath of scannedFiles) {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const fullPath = path.resolve(process.cwd(), relPath);
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Fichero no existe: ${relPath}`);
      }
      const code = fs.readFileSync(fullPath, 'utf8');

      for (const forbidden of prohibitedKeywords) {
        if (code.includes(forbidden)) {
          throw new Error(`Fuga detectada: Palabra prohibida "${forbidden}" encontrada en ${relPath}`);
        }
      }

      passed = true;
    } catch (e: unknown) {
      errStr = e instanceof Error ? e.message : String(e);
    }

    tracker.record({
      category: 'ZERO_AD_LEAK',
      testName: `0% Competitor Ad-Leak Audit: ${relPath}`,
      passed,
      durationMs: Date.now() - start,
      error: errStr,
    });
  }
}

// ── EJECUCIÓN PRINCIPAL DEL ARNES DE STRESS ──────────────────────────────────

async function runAdversarialStressSuite(): Promise<void> {
  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║       FINCAS B2B ESCAPARATE — TIER 5 ADVERSARIAL STRESS SUITE        ║');
  console.log('║  WHITE-BOX PENETRATION · INJECTION RESILIENCE · ZERO-LEAK AUDIT      ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');

  const tracker = new AdversarialStressTracker();

  await testVisitLockApi(tracker);
  await testPriceLockCryptographicIntegrity(tracker);
  await testLogisticsServerAction(tracker);
  await testUiDoubleSubmitPrevention(tracker);
  await testContactGateZeroLeak(tracker);
  await testCompetitorAdLeakEradication(tracker);

  const summary = tracker.getSummary();

  console.log('\n╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║               RESUMEN FINAL TIER 5 ADVERSARIAL STRESS                ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');
  console.log(`  Total Vectores Evaluados : ${summary.total}`);
  console.log(`  Aprobados (PASS)         : ${summary.passed}`);
  console.log(`  Fallidos (FAIL)          : ${summary.failed}`);
  console.log(`  Tasa de Aprobación       : ${summary.passRate}%`);
  console.log(`  Duración Total           : ${summary.durationMs} ms\n`);

  if (summary.failed > 0) {
    console.error(`❌ VEREDICTO: REJECTED — Se detectaron ${summary.failed} brechas o fallos adversariales.`);
    process.exit(1);
  } else {
    console.log('💎 VEREDICTO: APPROVE — 100% de los vectores de estrés superados sin brechas.');
    process.exit(0);
  }
}

runAdversarialStressSuite().catch((fatal) => {
  console.error('FATAL UNCAUGHT ADVERSARIAL STRESS ERROR:', fatal);
  process.exit(1);
});
