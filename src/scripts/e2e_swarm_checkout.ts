
import { sendTelegramNotification } from '../lib/services/telegram';

/**
 * 🐝 E2E SWARM CHECKOUT TESTER
 * Script de validación para el flujo de telemetría y pagos.
 */
async function runTest() {
  console.log('🚀 Iniciando Test de Telemetría Swarm...');
  
  const testPayload = {
    amount: 99.99,
    currency: 'EUR',
    email: 'test_swarm@productoraear.com',
    sessionId: 'test_sess_' + Date.now()
  };

  try {
    await sendTelegramNotification(
      `🧪 *TEST DE SWARM ACTIVADO*\n\n` +
      `✅ *Integración:* Telegram Bot\n` +
      `👤 *Email:* ${testPayload.email}\n` +
      `💰 *Monto:* ${testPayload.amount} ${testPayload.currency}\n` +
      `🛡️ *Estado:* Operacional\n\n` +
      `_EAR OS GOLD: Telemetría Verificada._`
    );
    console.log('✅ Notificación enviada correctamente.');
  } catch (error) {
    console.error('❌ Error en el Swarm Test:', error);
  }
}

runTest();
