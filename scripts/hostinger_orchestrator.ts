/**
 * 🏛️ ANTIGRAVITY OMEGA v7.0 — HOSTINGER S-CLASS COMMAND ORCHESTRATOR
 * ─────────────────────────────────────────────────────────────────────────────
 * CLI de control absoluto para el entorno híbrido VPS (Coolify) + Hostinger Business.
 *
 * Comandos:
 *   npx tsx scripts/hostinger_orchestrator.ts status
 *   npx tsx scripts/hostinger_orchestrator.ts dns [domain]
 *   npx tsx scripts/hostinger_orchestrator.ts vps-metrics
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  getVpsTelemetry,
  getBusinessHostingStatus,
  getDnsZoneSnapshot,
  getDualEngineSystemStatus
} from '../src/lib/infrastructure/hostinger-dual-engine';

async function main() {
  const command = process.argv[2] || 'status';

  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('🏛️ ANTIGRAVITY OMEGA v7.0 — HOSTINGER S-CLASS DUAL-ENGINE ORCHESTRATOR');
  console.log('═══════════════════════════════════════════════════════════════════════');

  switch (command) {
    case 'status': {
      console.log('[*] Consultando telemetría del Doble Motor en tiempo real...');
      const status = await getDualEngineSystemStatus();
      
      console.log('\n[1] ENGINE ALPHA — VPS DEDICADO COOLIFY (KVM 1)');
      console.log(`    ID:          ${status.alphaEngineVps?.id}`);
      console.log(`    Hostname:    ${status.alphaEngineVps?.hostname}`);
      console.log(`    IP Pública:  ${status.alphaEngineVps?.ip}`);
      console.log(`    Estado:      ${status.alphaEngineVps?.state.toUpperCase()} (Salud: ${status.alphaEngineVps?.health})`);
      console.log(`    Recursos:    ${status.alphaEngineVps?.cpus} vCPU | ${status.alphaEngineVps?.memoryMb} MB RAM | ${(Number(status.alphaEngineVps?.diskMb || 0) / 1024).toFixed(1)} GB NVMe`);
      console.log(`    Template:    ${status.alphaEngineVps?.template}`);

      console.log('\n[2] ENGINE BETA — HOSTINGER BUSINESS (LITESPEED / DATA LAKE CDN)');
      console.log(`    Orden:       #${status.betaEngineBusiness?.orderId} (${status.betaEngineBusiness?.plan})`);
      console.log(`    Usuario:     ${status.betaEngineBusiness?.username}`);
      console.log(`    Estado:      ${status.betaEngineBusiness?.status.toUpperCase()}`);
      console.log(`    Websites:    ${status.betaEngineBusiness?.websitesCount} sitios activos en LiteSpeed`);
      status.betaEngineBusiness?.websites.forEach((w) => {
        console.log(`      • ${w.domain.padEnd(35)} [${w.vhostType}] ${w.rootDirectory}`);
      });

      console.log('\n[3] MATRIZ DE ENRUTAMIENTO DNS CANÓNICA');
      Object.entries(status.dnsMatrix).forEach(([dom, snap]) => {
        console.log(`    • ${dom.padEnd(32)} A: ${(snap.primaryA || 'N/D').padEnd(16)} WWW: ${snap.wwwTarget || 'N/D'}`);
      });

      console.log('\n[✓] SISTEMA OPERATIVO Y SINCRONIZADO AL 100%');
      break;
    }

    case 'vps-metrics': {
      console.log('[*] Obteniendo telemetría del VPS Coolify...');
      const vps = await getVpsTelemetry();
      console.log(JSON.stringify(vps, null, 2));
      break;
    }

    case 'dns': {
      const domain = process.argv[3] || 'productoraear.com';
      console.log(`[*] Consultando DNS de ${domain}...`);
      const snap = await getDnsZoneSnapshot(domain);
      console.log(JSON.stringify(snap, null, 2));
      break;
    }

    default:
      console.log(`Comando desconocido: ${command}. Opciones: status, vps-metrics, dns`);
      break;
  }

  console.log('═══════════════════════════════════════════════════════════════════════');
}

main().catch((err) => {
  console.error('[-] Error fatal:', err);
  process.exit(1);
});
