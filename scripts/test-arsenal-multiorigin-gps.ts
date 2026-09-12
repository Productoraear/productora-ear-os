import { 
  planMultiOriginConvoy, 
  ARSENAL_WAREHOUSE_NETWORK 
} from '../src/lib/engines/arsenalGpsRoutingEngine';

console.log('🚀 [TEST] Verificando Motor de Despacho y Tracking Multiorigen del Arsenal...');

// Simular un evento de Gran Producción en Finca El Campillo (San Lorenzo de El Escorial, Madrid)
const destinationVenue = 'Finca El Campillo (San Lorenzo de El Escorial)';
const destinationCoords = { lat: 40.5912, lng: -4.0921 };

// Convoy combinado:
// 1. Pantallas LED desde Valencia
// 2. Equipos de Sonido desde Méntrida (Toledo)
// 3. Mariachis desde Plaza Elíptica (Madrid)
const convoy = planMultiOriginConvoy({
  productionEventId: 'prod-gala-2026-09-esc',
  eventTitle: 'Boda Real & Festival Acústico S-Class',
  destinationVenue,
  destinationCoords,
  requiredSoundcheckTime: '16:00',
  eventStartTime: '19:00',
  selectedBaseIds: ['base-valencia-led', 'base-toledo-sonido', 'base-madrid-mariachis']
});

console.log(`📦 Evento: ${convoy.eventTitle}`);
console.log(`📍 Destino: ${convoy.destinationVenue}`);
console.log(`⏱️ Hora Límite Prueba de Sonido: ${convoy.requiredSoundcheckTime}`);
console.log(`🚚 Convoyes Activos Sincronizados: ${convoy.legs.length}`);

convoy.legs.forEach((leg, i) => {
  console.log(`\n--- VÍA DE CONVOY #${i + 1}: ${leg.originBase.providerName} (${leg.originBase.city}) ---`);
  console.log(`   - Vehículo: ${leg.originBase.convoyVehicle}`);
  console.log(`   - Distancia: ${leg.distanceKm} km`);
  console.log(`   - Tiempo Tránsito Estimado: ${leg.estimatedTransitMinutes} min`);
  console.log(`   - Hora Salida Recomendada: ${leg.suggestedDepartureTime}`);
  console.log(`   - Tarifa Logística: ${leg.logisticsCost} €`);
});

console.log(`\n🎯 Ruta Crítica: ${convoy.criticalPathOrigin}`);
console.log(`💰 Logística Total Agregada: ${convoy.totalLogisticsFee} €`);

const isValenciaCritical = convoy.criticalPathOrigin.includes('València') || convoy.criticalPathOrigin.includes('Valencia');

if (convoy.legs.length === 3 && convoy.totalLogisticsFee > 0 && isValenciaCritical) {
  console.log('\n✅ TEST PASSED: Despacho Multiorigen del Arsenal validado con éxito. Exit Code 0.');
  process.exit(0);
} else {
  console.error('\n❌ TEST FAILED: Fallo en cálculo de convoy multiorigen.');
  process.exit(1);
}
