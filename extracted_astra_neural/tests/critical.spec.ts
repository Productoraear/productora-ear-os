
import { test, expect } from '@playwright/test';

test.describe('Astra Critical Flows', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto('/');
  });

  test('User can bypass auth (demo) and select a role', async ({ page }) => {
    // 1. Auth Screen
    await expect(page.getByText('Acceso Biométrico')).toBeVisible();
    await page.getByText('Modo Demo (Sin Seguridad)').click();

    // 2. Role Selection
    await expect(page.getByText('Selecciona tu perfil estratégico')).toBeVisible();
    const artistRole = page.getByText('Artista Visionario');
    await expect(artistRole).toBeVisible();
    await artistRole.click();

    // 3. Dashboard Load
    await expect(page.getByText('Centro de Comando Estratégico')).toBeVisible();
    
    // 4. Check Navigation
    const nextActionWidget = page.locator('text=Próxima Acción Crítica');
    await expect(nextActionWidget).toBeVisible();
  });

  test('Tools can be opened via Command Palette', async ({ page }) => {
    // Bypass Auth & Select Role first
    await page.getByText('Modo Demo (Sin Seguridad)').click();
    await page.getByText('Artista Visionario').click();

    // Open Command Palette (Cmd+K is hard to simulate reliably across OS, so we assume a button or trigger exists or simulate state)
    // For this test, we might need a UI button trigger if we can't hit keyboard shortcuts easily in headless
    await page.keyboard.press('Control+k'); 
    
    const palette = page.getByPlaceholder('Buscar herramienta...');
    await expect(palette).toBeVisible();
    
    await palette.fill('Rueda');
    await page.keyboard.press('Enter');

    await expect(page.getByText('Rueda de la Vida')).toBeVisible();
  });
});
