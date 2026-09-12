import fs from 'fs';
import path from 'path';
import { 
  calculateHaversineDistance, 
  getDistanceKmFromMentrida, 
  calculateLogisticsFee, 
  calculateAcousticRequirements 
} from '../src/features/search/utils/mentridaDistanceEngine';

async function runAirbnbBookingFiltersAudit() {
  console.log('========================================================================');
  console.log('🧪 TEST DE BARRA DE BÚSQUEDA Y RESERVA ESTILO AIRBNB — S-CLASS AUDIT');
  console.log('========================================================================');

  // 1. Verificación de Motor Haversine Méntrida
  const madridKm = getDistanceKmFromMentrida('Madrid');
  const sevillaKm = getDistanceKmFromMentrida('Sevilla');
  console.log(`[GPS MÉNTRIDA] Distancia calculada Méntrida ➔ Madrid: ${madridKm} km (esperado ~54 km)`);
  console.log(`[GPS MÉNTRIDA] Distancia calculada Méntrida ➔ Sevilla: ${sevillaKm} km (esperado ~500 km)`);
  
  if (madridKm < 40 || madridKm > 70) throw new Error('Cálculo de distancia a Madrid fuera del rango de tolerancia.');
  if (sevillaKm < 450 || sevillaKm > 550) throw new Error('Cálculo de distancia a Sevilla fuera del rango de tolerancia.');

  // 2. Verificación de Tarifa de Logística S-Class
  // Sevilla (500 km), Fin 4:00 AM (>= 3:00 AM) => (500-50)*1.5 = 675€ + 120€ hotel = 795€
  const logisticsSevilla = calculateLogisticsFee(sevillaKm, 4);
  console.log(`[LOGÍSTICA S-CLASS] Sevilla (500 km, fin 4:00 AM): ${logisticsSevilla.totalLogisticsFee} € (${logisticsSevilla.kmCost} € km + ${logisticsSevilla.lodgingCost} € hotel)`);
  
  if (logisticsSevilla.billableKm !== 450) throw new Error('Km facturables incorrectos.');
  if (!logisticsSevilla.requiresLodging) throw new Error('Requisito de alojamiento no activado.');
  if (logisticsSevilla.lodgingCost !== 120) throw new Error('Tarifa de alojamiento incorrecta.');

  // 3. Verificación de Diagnóstico Acústico (12 W/pax)
  const acoustic250Pax = calculateAcousticRequirements(250);
  console.log(`[ACÚSTICA S-CLASS] 250 pax ➔ ${acoustic250Pax.wattsRms} W RMS (${acoustic250Pax.setupDescription})`);
  
  if (acoustic250Pax.wattsRms !== 3000) throw new Error('Potencia acústica calculada incorrecta (esperado 3.000 W RMS).');

  // 4. Verificación de Archivos y Componentes Creados
  const filesToCheck = [
    'src/features/search/utils/mentridaDistanceEngine.ts',
    'src/features/search/stores/useAirbnbBookingFiltersStore.ts',
    'src/features/search/AirbnbNeuralBookingBar.tsx'
  ];

  for (const relPath of filesToCheck) {
    const fullPath = path.join(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`[FILE MISSING] No se encuentra el archivo obligatorio ${relPath}`);
    }
    console.log(`✅ [FILE OK] ${relPath}`);
  }

  console.log('========================================================================');
  console.log('✅ TODOS LOS CHECKS DE LA BARRA AIRBNB Y FILTROS EN VERDE (EXIT CODE 0)');
  console.log('========================================================================');
}

runAirbnbBookingFiltersAudit()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ ERROR EN AUDITORÍA:', err);
    process.exit(1);
  });
