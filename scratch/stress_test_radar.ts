import { calculateLeadScore } from '../src/features/lead-capture/model/leadScoreCalculator';

async function executeStressTest() {
  console.log("🏛️ [STRESS TEST]: INICIANDO CAZA B2G (V168)");
  console.log("----------------------------------------");
  
  const email = "alcaldia@madrid.gob.es";
  const asset = "TECHNICAL_RIDER_SCLASS_2026.pdf";
  
  const analytics = calculateLeadScore(email);
  
  console.log(`PROSPECTO: ${email}`);
  console.log(`ASSET TARGET: ${asset}`);
  console.log(`\nRESULTADOS DEL ALGORITMO:`);
  console.log(`- SCORE ASIGNADO: ${analytics.score} Pts`);
  console.log(`- VIP PROSPECT: ${analytics.isVIP ? '✅ SÍ (DETECCION POSITIVA)' : '❌ NO'}`);
  console.log(`- CATEGORÍA: ${analytics.category}`);
  console.log(`- PRIORIDAD: ${analytics.priority}`);
  
  const payload = {
    event: 'INSTITUTIONAL_LEAD_DETECTED',
    timestamp: new Date().toISOString(),
    prospect: analytics,
    context: { action: 'VAULT_INTERACTION', asset_targeted: asset }
  };

  console.log(`\nPAYHOOK TELEGRAM READY:`);
  console.log(JSON.stringify(payload, null, 2));
  
  console.log("\n🟢 TEST FINALIZADO: CAZADOR ARMADO EN VERCEL.");
}

executeStressTest();
