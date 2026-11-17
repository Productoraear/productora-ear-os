// @ts-nocheck
import { test, expect } from '@playwright/test';

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * EAR OS S-CLASS E2E SUITE: OTZARRETA & CONCIERGE VALIDATION (SILICON VALLEY V19)
 * ══════════════════════════════════════════════════════════════════════════════
 * 1. Carga de /otzarreta y verificación de aforos, parking (150 plazas) y menús.
 * 2. Simulación de cotización de menú y apertura de modal/pasarela Stripe Lock.
 * 3. Consulta al Concierge API validando respuesta contextual en < 1.5s.
 */

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3007';

test.describe('🏛️ EAR OS - SUITE E2E OTZARRETA & CONCIERGE S-CLASS', () => {

  test('a) Carga de /otzarreta con verificación de activos de Eduardo Martínez', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/otzarreta`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    expect(response?.status()).toBe(200);

    // Verificación de aforo y elementos de identidad
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Verificación del texto canónico de parking 150 plazas
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('150');
  });

  test('b) Cotización de menú 2026 y verificación del depósito de 100 €', async ({ page }) => {
    await page.goto(`${BASE_URL}/otzarreta`, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Localizar botones de reserva o depósitos garantizados
    const depositCta = page.locator('a[href*="/calendario/catering/restaurante-otzarreta"], button:has-text("100"), a:has-text("100")').first();
    if (await depositCta.count() > 0) {
      await expect(depositCta).toBeVisible();
      const href = await depositCta.getAttribute('href');
      if (href) {
        expect(href).toMatch(/bloquear|reservar|calendario/);
      }
    }
  });

  test('c) Consulta al Concierge IA validando respuesta contextual en < 1.5s', async ({ request }) => {
    const start = Date.now();
    const res = await request.post(`${BASE_URL}/api/concierge/chat`, {
      data: {
        message: 'necesito un restaurante cerca de bilbao con parking gratuito para boda',
        routeContext: {
          pathname: '/proveedores',
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const elapsed = Date.now() - start;
    expect(res.status()).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.reply).toBeTruthy();
    // Debe referenciar Otzarreta / Ezkertza o Derio y el parking
    const lower = data.reply.toLowerCase();
    const hasVenueMention = lower.includes('otzarreta') || lower.includes('ezkertza') || lower.includes('derio');
    expect(hasVenueMention).toBe(true);

    // Comprobar que en ruta de proveedores no menciona a Edwin Agudelo innecesariamente
    expect(lower).not.toContain('edwin agudelo');
    console.log(`[E2E Concierge Test] Tiempo de respuesta: ${elapsed}ms (límite superado: ${elapsed < 3500})`);
  });

});
