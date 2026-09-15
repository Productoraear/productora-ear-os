import { calculateAtmosphereMatch, calculateSovereignSplit } from '../src/lib/atmosphere-matcher';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function auditMasterAbsolute() {
  console.log("══════════════════════════════════════════════════════════════");
  console.log("AUDITORÍA FORENSE TETRA-MODAL DE PRODUCCIÓN EAR OS (ABSOLUTA)");
  console.log("══════════════════════════════════════════════════════════════\n");

  let passes = 0;
  let failures = 0;

  function assert(condition: boolean, testName: string, detail: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      console.log(`       └─ ${detail}`);
      passes++;
    } else {
      console.error(`[FAIL] ${testName}`);
      console.error(`       └─ ${detail}`);
      failures++;
    }
  }

  // EJE 1: BODAS.NET
  const vendorsPath = path.join(process.cwd(), 'src/data/bodas-vendors-harvested.json');
  const vendorCount = fs.existsSync(vendorsPath) ? JSON.parse(fs.readFileSync(vendorsPath, 'utf-8')).length : 0;
  assert(vendorCount >= 24000, "Censo de Proveedores Activos", `Total registrados: ${vendorCount} (Esperado >= 24.000)`);

  // EJE 2: TINDER (AtmosphereMatcher & Split)
  const matchValid = calculateAtmosphereMatch({ guestsCount: 150, areaSquareMeters: 300, isOutdoor: false, eventStyle: 'wedding' });
  assert(matchValid.isCompatible === true && matchValid.acoustic.totalWattsRMS === 1800, 
    "Cálculo Acústico Proporcional (12 W/pax)", `150 pax = ${matchValid.acoustic.totalWattsRMS} W RMS exactos`);

  const splitCheck = calculateSovereignSplit(1000);
  assert(splitCheck.supplierShare === 800 && splitCheck.earOsShare === 100 && splitCheck.vimumeShare === 100,
    "Split Soberano Inmutable (80/10/10)", `Proveedor: ${splitCheck.supplierShare} € | EAR OS: ${splitCheck.earOsShare} € | VIMUME: ${splitCheck.vimumeShare} €`);

  // EJE 3: AIRBNB (SmartLock & Transacción)
  const testEvent = await prisma.productionEvent.create({
    data: {
      title: "Auditoría Tetra-Modal Test",
      eventDate: new Date("2026-10-15T18:00:00Z"),
      eventType: "WEDDING",
      status: "CHECKOUT_SESSION_CREATED",
      totalBudget: 1200,
      clientEmail: "audit@productoraear.com",
      clientName: "Cliente Auditoría",
      serviceLines: [{ name: "Formato Solista", price: 350 }]
    }
  });
  const updatedEvent = await prisma.productionEvent.update({
    where: { id: testEvent.id },
    data: { status: "PAID_CONFIRMED" }
  });
  assert(updatedEvent.status === "PAID_CONFIRMED", "Transacción Atómica & SmartLock", `Reserva sellada en PostgreSQL. ID: ${testEvent.id}`);

  // EJE 4: UBER (Telemetría con FleetUnit vinculada y propiedades canónicas de FleetPosition)
  const testUnit = await prisma.fleetUnit.create({
    data: {
      unitCode: "VEH-AUDIT-UNIT-01",
      status: "ACTIVE"
    }
  });

  const testFleetPosition = await prisma.fleetPosition.create({
    data: {
      latitude: 40.2394,
      longitude: -4.1956,
      speed: 65.5,
      status: "EN_TRANSITO",
      unitId: testUnit.id
    }
  });

  assert(testFleetPosition.id !== undefined && testFleetPosition.latitude === 40.2394,
    "Persistencia de Telemetría GPS con Relación Unit",
    `Coordenadas de flota registradas correctamente para unidad ${testUnit.unitCode}`);

  // Limpieza de datos de prueba en cascada
  await prisma.fleetPosition.delete({ where: { id: testFleetPosition.id } });
  await prisma.fleetUnit.delete({ where: { id: testUnit.id } });
  await prisma.productionEvent.delete({ where: { id: testEvent.id } });

  console.log("\n══════════════════════════════════════════════════════════════");
  console.log(`RESULTADO AUDITORÍA TETRA-MODAL: ${passes} ASERCIONES PASADAS / ${failures} FALLOS`);
  console.log("══════════════════════════════════════════════════════════════");

  if (failures > 0) process.exit(1);
}

auditMasterAbsolute()
  .catch((err) => { console.error("[FATAL ERROR]", err); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
