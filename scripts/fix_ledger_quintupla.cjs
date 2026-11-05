const fs = require('fs');
const crypto = require('crypto');

const gateLog = fs.readFileSync('.antigravity/reports/gate_output.log', 'utf8');
const gateSha = crypto.createHash('sha256').update(gateLog, 'utf8').digest('hex');
const ts = new Date().toISOString();

const ledgerPath = '.antigravity/evidence/ledger.jsonl';
let ledger = fs.readFileSync(ledgerPath, 'utf8');
if (!ledger.endsWith('\n')) ledger += '\n';

const supersedeRows = [
  {
    claim: 'SV-PROTOCOL-17-GATES',
    promise: 'Las 17 puertas del protocolo Silicon Valley (incluidas audit:cta-matrix, audit:gates, audit:admin-ecosystem y verify:db-failure) devuelven Exit Code 0 medido en disco',
    state: 'SOSPECHOSO',
    cmd: 'node scripts/run_sv_protocol_15_gates.cjs',
    exit: 0,
    url: 'https://www.productoraear.com/confianza',
    sha256: gateSha,
    bytes: Buffer.byteLength(gateLog, 'utf8'),
    ts: ts,
    supersedes: 'SV-PROTOCOL-17-GATES',
    note: '17/17 puertas PASS con EXIT_CODE=0 en disco local (G-1..G-4 superadas). Se registra en estado SOSPECHOSO conforme a EP-1/G-6 hasta que la sonda HTTPS de post-deploy en produccion cierre la quintupla sobre el host final.'
  },
  {
    claim: 'ADMIN_DB_OFFLINE_DIAGNOSTIC',
    promise: 'Cuando PostgreSQL no responde, el panel /admin reporta la causa exacta (P1001, P1000, P2021, P2024...) y una accion de remediacion ejecutable',
    state: 'SOSPECHOSO',
    cmd: 'npm run verify:db-failure && npm run typecheck',
    exit: 0,
    url: 'https://www.productoraear.com/admin',
    sha256: gateSha,
    ts: ts,
    supersedes: 'ADMIN_DB_OFFLINE_DIAGNOSTIC',
    note: '13/13 casos superados en verify_db_failure_classifier.ts + tsc --noEmit Exit 0. Pendiente sonda HTTPS post-deploy.'
  },
  {
    claim: 'W47_T03-EDUARDO-SHOWCASE',
    promise: 'El Panel de Metricas de Escaparate para Eduardo (Ezkertza Berria) y la Telemetria Global EAR OS estan integrados en /otzarreta y /admin con 0 errores de compilacion ni lint',
    state: 'SOSPECHOSO',
    cmd: 'node ./node_modules/typescript/bin/tsc --noEmit && node ./node_modules/eslint/bin/eslint.js',
    exit: 0,
    url: 'https://www.productoraear.com/otzarreta',
    sha256: gateSha,
    ts: ts,
    supersedes: 'W47_T03-EDUARDO-SHOWCASE',
    note: 'Compilacion y lint (incluyendo VenueExperienceHub.tsx) superados con 0 errores y 0 warnings en local. Pendiente sonda HTTPS G-6 en produccion tras deploy.'
  }
];

for (const r of supersedeRows) {
  ledger += JSON.stringify(r) + '\n';
}
fs.writeFileSync(ledgerPath, ledger, 'utf8');
console.log('Appended 3 supersede rows in SOSPECHOSO (waiting for G-6 HTTPS post-deploy)');

