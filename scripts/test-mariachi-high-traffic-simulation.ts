import fs from 'fs';
import path from 'path';
import { runHighTrafficMariachiSimulation } from '../src/lib/matchmaker/mariachiHighTrafficSimulator';
import { getVendorBaseOrigin, BASE_HUBS } from '../src/features/search/utils/mentridaDistanceEngine';

async function testMariachiHighTrafficSimulation() {
  console.log('========================================================================');
  console.log('🧪 TEST DE SIMULACIÓN DE ALTO TRÁFICO — UBER DE MARIACHIS S-CLASS');
  console.log('========================================================================');

  // 1. Verificación de Origen SSOT de Mariachis ➔ Plaza Elíptica, Madrid
  const mariachiOrigin = getVendorBaseOrigin({ name: 'Mariachi Guadalupano S-Class', category: 'Mariachis' });
  console.log(`[ORIGEN MARIACHI] Base Hub: ${mariachiOrigin.name} (${mariachiOrigin.lat}, ${mariachiOrigin.lng})`);
  
  if (mariachiOrigin.lat !== BASE_HUBS.MARIACHIS.lat || mariachiOrigin.lng !== BASE_HUBS.MARIACHIS.lng) {
    throw new Error('La base del mariachi debe ser estrictamente Plaza Elíptica (Madrid).');
  }

  // 2. Verificación de Origen SSOT de Edwin Agudelo ➔ Méntrida, Toledo
  const edwinOrigin = getVendorBaseOrigin({ id: 'edwin-agudelo', name: 'Edwin Agudelo' });
  console.log(`[ORIGEN EDWIN] Base Hub: ${edwinOrigin.name} (${edwinOrigin.lat}, ${edwinOrigin.lng})`);

  if (edwinOrigin.lat !== BASE_HUBS.EDWIN_AGUDELO.lat || edwinOrigin.lng !== BASE_HUBS.EDWIN_AGUDELO.lng) {
    throw new Error('La base de Edwin Agudelo debe ser estrictamente Méntrida (Toledo).');
  }

  // 3. Ejecución de Simulación Normal de 32 Actuaciones (Sábado)
  const simNormal = runHighTrafficMariachiSimulation(false);
  console.log(`[SIMULACIÓN NORMAL] Actuaciones: ${simNormal.totalBookings} | Facturación Bruta: ${simNormal.totalGrossRevenue.toLocaleString('es-ES')} € | IVA 21%: ${simNormal.totalVatAmount.toLocaleString('es-ES')} €`);
  
  if (simNormal.totalBookings !== 32) throw new Error('Se esperaban 32 actuaciones exactamente.');
  if (simNormal.cancellationRate !== '0%') throw new Error('La tasa de cancelaciones debe ser 0%.');
  if (simNormal.slaCompliance !== '100%') throw new Error('El cumplimiento SLA debe ser 100%.');

  // 4. Ejecución de Simulación con Inyección de Horas Extra (Disparo Cascada Uber)
  const simOvertime = runHighTrafficMariachiSimulation(true);
  console.log(`[SIMULACIÓN ESTRÉS] Horas Extra Inyectadas | Relevos Uber Exitosos: ${simOvertime.successfulReassignments} | Cancelaciones: ${simOvertime.cancellationRate}`);

  if (simOvertime.successfulReassignments === 0) throw new Error('No se ejecutaron reasignaciones en la cascada Uber.');
  if (simOvertime.cancellationRate !== '0%') throw new Error('Incluso con horas extra la tasa de cancelaciones debe ser 0%.');

  // 5. Verificación de Archivo Creado
  const targetPage = path.join(process.cwd(), 'src/app/(public)/simulacion-mariachis/page.tsx');
  if (!fs.existsSync(targetPage)) {
    throw new Error(`[PAGE MISSING] No se localiza la ruta /simulacion-mariachis en ${targetPage}`);
  }
  console.log('✅ [FILE OK] src/app/(public)/simulacion-mariachis/page.tsx verificado.');

  console.log('========================================================================');
  console.log('✅ TODOS LOS CHECKS DE SIMULACIÓN Y BASES ORIGEN EN VERDE (EXIT CODE 0)');
  console.log('========================================================================');
}

testMariachiHighTrafficSimulation()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ ERROR EN SIMULACIÓN:', err);
    process.exit(1);
  });
