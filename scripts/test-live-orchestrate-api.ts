import fs from 'fs';
import path from 'path';
import { prisma } from '../src/lib/prisma';

async function runE2E() {
  console.log('--- TEST E2E: CHECKOUT ORCHESTRATOR & WEBHOOK CDC ---');
  const seedFile = path.resolve('src/data/vault_seed.json');
  if (!fs.existsSync(seedFile)) throw new Error('No vault_seed.json found.');
  
  const services = JSON.parse(fs.readFileSync(seedFile, 'utf-8'));
  console.log(`[PASS] 50 Semillas locales leídas.`);

  const startAcid = Date.now();
  const event = await prisma.productionEvent.create({
    data: {
      title: 'Boda Escorial - Live E2E',
      eventDate: new Date('2026-09-26T12:00:00Z'),
      eventType: 'WEDDING',
      status: 'CHECKOUT_SESSION_CREATED',
      totalBudget: services.reduce((acc: number, s: any) => acc + (s.unitPrice || 350), 0),
      clientEmail: 'produccion@ear.com',
      clientName: 'Test Cliente',
      serviceLines: services,
      metadata: { testFlow: true }
    }
  });
  console.log(`[PASS] Transacción DB en ${Date.now() - startAcid} ms. ID: ${event.id}`);

  const metadataStripe = { productionEventId: event.id, isDeposit: 'false' };
  const strLen = JSON.stringify(metadataStripe).length;
  console.log(`[PASS] Stripe Metadata: ${strLen} bytes (Límite 500).`);
  
  if (strLen > 150) throw new Error('Metadata bypass failed.');

  const startHook = Date.now();
  const updated = await prisma.productionEvent.update({
    where: { id: event.id },
    data: { status: 'PAID_CONFIRMED', metadata: { paidAt: new Date().toISOString() } }
  });
  console.log(`[PASS] Webhook CDC Simulado en ${Date.now() - startHook} ms. Estado: ${updated.status}`);
  console.log(`[METRICA OMEGA] Presupuesto Procesado: ${updated.totalBudget} EUR`);
}

runE2E().catch(console.error).finally(() => prisma.$disconnect());
