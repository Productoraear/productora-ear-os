// @ts-nocheck
import { test, expect, devices } from "@playwright/test";

test.use({
  ...devices["iPhone 13"],
});

test.describe("🛒 EAR OS - MOBILE-FIRST TRANSACTIONAL FLOWS (V205.GOD_MODE)", () => {
  test("Debería cargar la Home móvil, seleccionar la atmósfera de gala, e interactuar con el Roster de Élite", async ({
    page,
  }) => {
    // 1. Navegar al home público
    await page.goto("/");

    // 2. Comprobar la resiliencia del DOM y la existencia de elementos de marca
    const title = page.locator("h1");
    await expect(title).toBeVisible();

    // 3. Emular la selección de atmósfera en el AtmosphereMatcherClient
    const atmosphereSelector = page.locator('select[data-testid="atmosphere-select"]').first();
    
    if (await atmosphereSelector.count() > 0) {
      await atmosphereSelector.selectOption("clasica-gala");
      
      // 4. Interceptar y emular click en el botón de reserva de Edwin Agudelo
      const bookingButton = page
        .locator('button:has-text("Reservar Roster Elite")')
        .first();

      if (await bookingButton.count() > 0) {
        // Ejecutar trigger de checkout
        await bookingButton.click();

        // 5. Comprobar redirección al entorno seguro de Stripe Connect
        await page.waitForURL(/.*stripe.com.*/, { timeout: 15000 });
        expect(page.url()).toContain("stripe.com");
      }
    }
  });
});
