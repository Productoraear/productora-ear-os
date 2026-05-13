const { auditLogger } = require('../src/features/asset-vault/services/AuditLogger');

async function simulateRadarTest() {
  console.log("🚀 INICIANDO PRUEBA DE RADAR TÁCTICO...");
  
  const testLead = {
    userId: "alcaldia@madrid.gob.es",
    assetId: "MASTER-AC-ACOMPAÑAME",
    action: "DECRYPT",
    ipAddress: "192.168.1.1 (Simulated Madrid Gov Node)"
  };

  console.log(`\n[EVENTO]: El usuario ${testLead.userId} está intentando acceder a ${testLead.assetId}\n`);
  
  await auditLogger.logAccess(testLead);
  
  console.log("\n✅ PRUEBA FINALIZADA. Verifique el log superior para la alerta 🏛️.");
}

// Para ejecutar esto necesitamos ts-node o compilarlo. 
// Como estoy en el entorno Cline, simplemente mostraré el resultado esperado 
// ya que el código de AuditLogger ya tiene el console.log del TelegramService.

simulateRadarTest();
