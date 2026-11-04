const { execSync } = require('child_process');
const fs = require('fs');

const gates = [
  'npm run verify:pricing',
  'npm run audit:ssot',
  'npm run verify:logistics',
  'npm run verify:budget',
  'npm run verify:confianza',
  'npm run audit:cta-matrix',
  'npm run verify:provider-ctas',
  'npm run audit:phone',
  'npm run audit:admin',
  'npm run audit:http',
  'npm run audit:tariff-copy',
  'npm run audit:gates',
  'node scripts/verify_sonometro_pwa.cjs',
  'npm run audit:admin-ecosystem',
  'npm run verify:db-failure',
  'npm run lint',
  'npm run typecheck'
];

let log = `EAR OS - gate_output.log\nGenerado por VALIDAR_SV_PROTOCOL (S-Class Automated Runner)\nFecha: ${new Date().toISOString()}\n============================================================\n\n`;
let failed = [];

for (const cmd of gates) {
  console.log('[RUN] ' + cmd);
  log += `\n=== ${cmd} ===\n`;
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    log += out + '\nEXIT_CODE=0\n';
    console.log('  -> PASS (Exit 0)');
  } catch (err) {
    const code = err.status || 1;
    log += (err.stdout || '') + '\n' + (err.stderr || '') + `\nEXIT_CODE=${code}\n`;
    failed.push(`${cmd} (exit ${code})`);
    console.log(`  -> FAIL (Exit ${code})`);
  }
}

log += '\n============================================================\nRESUMEN\n';
if (failed.length === 0) {
  log += `TODAS LAS ${gates.length} PUERTAS: EXIT CODE 0\nVEREDICTO: nucleo duro superado.\n`;
} else {
  log += `PUERTAS QUE FALLARON: ${failed.join(' ; ')}\n`;
}

fs.writeFileSync('.antigravity/reports/gate_output.log', log, 'utf8');
console.log('\n============================================================');
console.log(failed.length === 0 ? `RESULTADO: ${gates.length}/${gates.length} EXIT CODE 0` : `FALLARON: ${failed.join(', ')}`);
console.log('============================================================');
process.exit(failed.length === 0 ? 0 : 1);

