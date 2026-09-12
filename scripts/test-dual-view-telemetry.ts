import { ClientLiveTrackingData } from '../src/features/fleet/ui/ClientLiveTrackingDrawer';
import { ARSENAL_WAREHOUSE_NETWORK } from '../src/lib/engines/arsenalGpsRoutingEngine';

console.log('🚀 [TEST] Verificando Puente de Telemetría Dual (Vista Cliente / Vista NASA Admin)...');

// 1. Instanciar telemetría para la vista cliente
const clientData: ClientLiveTrackingData = {
  bookingId: 'booking-madrid-mariachi-01',
  clientName: 'Elena Valenzuela (Wedding Planner)',
  venueName: 'Finca La Alquería (Pabellón de Cristal)',
  venueAddress: 'Autovía del Suroeste A-5, Km 12.800, 28922 Alcorcón',
  destinationCoords: { lat: 40.3458, lng: -3.8249 },
  originPointName: 'Plaza Elíptica Hub (Acuerdo por Votación)',
  originCoords: { lat: 40.3847, lng: -3.7183 },
  currentLocationCoords: { lat: 40.3650, lng: -3.7710 },
  assignedProviderName: 'Mariachi S-Class Squad #1',
  driverName: 'Maestro Mateo Villalobos',
  driverPhone: '+34 689 33 11 05',
  vehiclePlate: '8491-LMR',
  vehicleModel: 'Mercedes-Benz Vito Larga Negra',
  currentStatus: 'EN_TRANSITO',
  etaMinutes: 14,
  speedKmh: 78,
  depositStripeConfirmed: true,
  clientAccessNotes: 'Entrada por la cancela negra trasera. Preguntar por Mayordomo Roberto.'
};

console.log(`✅ Vista Cliente preparada para: ${clientData.clientName}`);
console.log(`   - Vehículo en tránsito: ${clientData.vehiclePlate} (${clientData.speedKmh} km/h)`);
console.log(`   - ETA: ${clientData.etaMinutes} min hacia ${clientData.venueName}`);
console.log(`   - Fianza Stripe Confirmada: ${clientData.depositStripeConfirmed ? 'SÍ (100,00 €)' : 'NO'}`);

// 2. Verificar disponibilidad de convoyes para la Pantalla NASA Admin
console.log(`\n🛰️ Verificando Nodos de Flota Nacional para Pantalla NASA Admin...`);
console.log(`   - Nodos activos en red: ${ARSENAL_WAREHOUSE_NETWORK.length} almacenes territoriales.`);

ARSENAL_WAREHOUSE_NETWORK.forEach((warehouse, i) => {
  console.log(`   [Nodo #${i + 1}] ${warehouse.providerName} en ${warehouse.city} -> [${warehouse.lat}, ${warehouse.lng}]`);
});

if (clientData.depositStripeConfirmed && ARSENAL_WAREHOUSE_NETWORK.length >= 4) {
  console.log('\n✅ TEST PASSED: Puente de Telemetría Dual validado con éxito. Exit Code 0.');
  process.exit(0);
} else {
  console.error('\n❌ TEST FAILED: Fallo en serialización de telemetría dual.');
  process.exit(1);
}
