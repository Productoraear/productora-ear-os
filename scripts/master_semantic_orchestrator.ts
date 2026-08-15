import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const MASTER_INDEX_PATH = path.join(process.cwd(), 'src', 'config', 'master_system_graph.json');

export async function buildSystemGraph() {
  console.log('⚡ [MASTER ORCHESTRATOR] Construyendo mapa de capacidades unificadas...');

  const discoveryReportPath = path.join(process.cwd(), 'scripts', 'deep_discovery_report.json');
  if (!fs.existsSync(discoveryReportPath)) {
    console.error('❌ Ejecuta primero node scripts/deep_pc_discovery.js');
    return;
  }

  const rawReport = fs.readFileSync(discoveryReportPath, 'utf-8');
  const discoveries = JSON.parse(rawReport);

  const systemGraph = {
    updatedAt: new Date().toISOString(),
    totalActiveModules: discoveries.length,
    coreCapabilities: {
      matchmaker: discoveries.filter((d: any) => d.capabilities.includes('Tinder/Swipe Matchmaker')),
      pricer: discoveries.filter((d: any) => d.capabilities.includes('Bespoke Pricer & Price-Lock')),
      acoustic: discoveries.filter((d: any) => d.capabilities.includes('Calculadora Acústica/Rider')),
      uiEngine: discoveries.filter((d: any) => d.capabilities.includes('UI Onyx / Divi Transmuter')),
      ledger: discoveries.filter((d: any) => d.capabilities.includes('Ledger / Commission Split')),
    },
  };

  const targetDir = path.dirname(MASTER_INDEX_PATH);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(MASTER_INDEX_PATH, JSON.stringify(systemGraph, null, 2));
  console.log(`✅ GRAPH SENSORIAL CONSOLIDADO: ${MASTER_INDEX_PATH}`);
}

if (require.main === module) {
  buildSystemGraph();
}
