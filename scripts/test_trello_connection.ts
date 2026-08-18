import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { TrelloService } from '../src/lib/services/trello';

async function testTrello() {
  console.log('📋 Comprobando estado de conexión con Trello...');

  const hasApiKey = Boolean(process.env.TRELLO_API_KEY);
  const hasToken = Boolean(process.env.TRELLO_TOKEN);
  const hasListId = Boolean(process.env.TRELLO_LIST_ID_INBOUND || process.env.TRELLO_LIST_ID);
  const hasWebhook = Boolean(process.env.NEXT_PUBLIC_MAKE_WEBHOOK_TRELLO || process.env.TRELLO_WEBHOOK_URL);

  console.log('1. Clave de API Trello (TRELLO_API_KEY):', hasApiKey ? '✅ PRESENTE' : '❌ NO DEFINIDA');
  console.log('2. Token de Acceso Trello (TRELLO_TOKEN):', hasToken ? '✅ PRESENTE' : '❌ NO DEFINIDO');
  console.log('3. ID de Lista Trello (TRELLO_LIST_ID_INBOUND):', hasListId ? '✅ PRESENTE' : '❌ NO DEFINIDO');
  console.log('4. Webhook Make/Zapier (NEXT_PUBLIC_MAKE_WEBHOOK_TRELLO):', hasWebhook ? '✅ PRESENTE' : '❌ NO DEFINIDO');

  console.log('\nDisparando prueba de creación de tarjeta de lead...');

  const result = await TrelloService.createCard({
    contactName: 'Cliente de Prueba EAR OS',
    contactEmail: 'prueba@productoraear.com',
    contactPhone: '+34 693 693 048',
    occasion: 'Boda VIP Madrid',
    province: 'Madrid',
    totalAmount: 3450,
    depositAmount: 100,
    selectedAssets: ['Mariachi Imperial de Gala', 'Sonido Bose F1 12 W/pax', 'Iluminación Robótica'],
    priority: 'ALTA',
    dossierId: 'TEST-TRELLO-2026'
  });

  console.log('\nResultado:', result);
}

testTrello();
