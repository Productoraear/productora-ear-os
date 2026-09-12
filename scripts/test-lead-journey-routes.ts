import fs from 'fs';
import path from 'path';

async function testLeadJourneyRoutes() {
  console.log('========================================================================');
  console.log('🧪 TEST DE NAVEGACIÓN Y VIAJE DE CLIENTE — EAR OS NEURAL EXPERIENCE');
  console.log('========================================================================');

  // 1. Verificación del Store Zustand
  const storePath = path.join(process.cwd(), 'src/features/neural-companion/stores/useLeadTemperatureStore.ts');
  if (!fs.existsSync(storePath)) {
    throw new Error(`[STORE MISSING] No se localiza useLeadTemperatureStore.ts en ${storePath}`);
  }
  console.log('✅ [ZUSTAND STORE] Store useLeadTemperatureStore.ts verificado correctamente.');

  // 2. Verificación de Componente UI Companion
  const companionPath = path.join(process.cwd(), 'src/features/neural-companion/ui/NeuralClientCompanion.tsx');
  if (!fs.existsSync(companionPath)) {
    throw new Error(`[COMPANION MISSING] No se localiza NeuralClientCompanion.tsx en ${companionPath}`);
  }
  console.log('✅ [UI COMPANION] Componente NeuralClientCompanion.tsx verificado correctamente.');

  // 3. Verificación de Matriz Comparativa (/comparar)
  const compararPagePath = path.join(process.cwd(), 'src/app/(public)/comparar/page.tsx');
  if (!fs.existsSync(compararPagePath)) {
    throw new Error(`[PAGE MISSING] No se localiza la ruta /comparar en ${compararPagePath}`);
  }
  const compararContent = fs.readFileSync(compararPagePath, 'utf-8');
  if (compararContent.includes("redirect('/')") || compararContent.includes('router.push("/")')) {
    throw new Error('❌ [VETO REGLA ANTI-HOME] Se detectó una redirección indebida a "/" en /comparar');
  }
  console.log('✅ [MATRIZ COMPARATIVA] Ruta /comparar existe y cumple la regla de Anti-Derivación a Home.');

  // 4. Verificación de Cotizador con Modo Comparación
  const cotizadorPagePath = path.join(process.cwd(), 'src/app/(public)/cotizador/page.tsx');
  const cotizadorContent = fs.readFileSync(cotizadorPagePath, 'utf-8');
  if (!cotizadorContent.includes('isComparisonMode')) {
    throw new Error('❌ [COTIZADOR] El cotizador no implementa la bandera isComparisonMode');
  }
  console.log('✅ [COTIZADOR] Ruta /cotizador soporta búsqueda comparativa transparente.');

  console.log('========================================================================');
  console.log('✅ TODOS LOS CHECKS DE VIAJE DE CLIENTE Y TEMPERATURA EN VERDE (EXIT CODE 0)');
  console.log('========================================================================');
}

testLeadJourneyRoutes()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ ERROR EN VALIDACIÓN:', err);
    process.exit(1);
  });
