const fs = require('fs');

// 1. Añadir --prod en scripts/verify_trust_ledger.ts
let vtl = fs.readFileSync('scripts/verify_trust_ledger.ts', 'utf8');
if (!vtl.includes('--prod')) {
  vtl = vtl.replace(
    "import { existsSync, readFileSync } from 'node:fs';",
    "import { existsSync, readFileSync } from 'node:fs';\nimport { createHash } from 'node:crypto';"
  );

  const prodFn = `
const prodMode = process.argv.includes('--prod');
const PROD_URL = 'https://www.productoraear.com/confianza';

async function verifyProd(): Promise<void> {
  const ts = new Date().toISOString();
  const res = await fetch(PROD_URL, { headers: { 'Cache-Control': 'no-cache' } });
  const html = await res.text();
  const bytes = Buffer.byteLength(html, 'utf8');
  const sha256 = createHash('sha256').update(html, 'utf8').digest('hex');

  const forbidden = ['source=missing', 'probed=false', 'Modo SIMULADO', '0 fila(s) vigente(s)'];
  const hitForbidden = forbidden.filter((tok) => html.includes(tok));
  const hasLive = html.includes('source=live');
  const hasReal = html.includes('Modo REAL');
  const rowsMatch = html.match(/(\\d+)\\s+fila\\(s\\)\\s+vigente\\(s\\)/i);
  const rows = rowsMatch ? Number(rowsMatch[1]) : (hasLive ? 1 : 0);

  const ok = res.status === 200 && hitForbidden.length === 0 && hasLive && hasReal && rows >= 1;
  console.log(JSON.stringify({
    HTTP_STATUS: res.status,
    BYTES: bytes,
    SHA256: sha256,
    ROWS: rows,
    SOURCE: hasLive ? 'live' : 'missing_or_simulated',
    TS: ts,
    FORBIDDEN_HITS: hitForbidden,
    OK: ok,
  }, null, 2));

  process.exit(ok ? 0 : 1);
}
`;

  vtl = vtl.replace('function main(): void {', prodFn + '\nfunction main(): void {');
  vtl = vtl.replace('try {\r\n  main();', 'if (prodMode) {\r\n  verifyProd().catch((err) => { console.error(err); process.exit(2); });\r\n} else {\r\n  try {\r\n    main();');
  vtl = vtl.replace('try {\n  main();', 'if (prodMode) {\n  verifyProd().catch((err) => { console.error(err); process.exit(2); });\n} else {\n  try {\n    main();');
  vtl = vtl + '\n}\n';
  fs.writeFileSync('scripts/verify_trust_ledger.ts', vtl, 'utf8');
  console.log('UPDATED scripts/verify_trust_ledger.ts with --prod');
}

// 2. Registrar verify:confianza:prod en package.json
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts['verify:confianza:prod'] = 'node ./node_modules/tsx/dist/cli.mjs scripts/verify_trust_ledger.ts --prod';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('ADDED verify:confianza:prod to package.json');

