/**
 * TASK-001-GEO-52-PROVINCIAS · Verificador local (coste 0 tokens).
 * Comprueba: 52 provincias únicas en el SSOT, selector dinámico en /reservar/solista,
 * cero defaults a Madrid/Toledo, y validación estricta en la API acústica.
 * Exit 0 = OK · Exit 1 = fallo.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

const results = [];
const check = (name, ok, detail) => results.push({ name, ok: Boolean(ok), detail: detail ?? '' });

const provincesSrc = read('src/lib/geo/spanish-provinces.ts');
const arrayBlock = provincesSrc.split('ALL_SPANISH_PROVINCES')[1] ?? '';
const listed = [...arrayBlock.matchAll(/'([^']+)'/g)].map((m) => m[1]);
check('SSOT: 52 provincias', listed.length === 52, `count=${listed.length}`);
check('SSOT: sin duplicados', new Set(listed).size === listed.length);

const page = read('src/app/reservar/solista/page.tsx');
check('page: useState sin default Madrid/Toledo', !/useState<SpanishProvince[^>]*>\(\s*'(Madrid|Toledo)'/.test(page));
check('page: selector alimentado por ALL_SPANISH_PROVINCES', /ALL_SPANISH_PROVINCES\.map/.test(page));
check('page: provincia enviada al radar', /destinationProvince:\s*provinceForRadar/.test(page));

const route = read('src/app/api/geo/acoustic-calculate/route.ts');
check('api: valida contra ALL_SPANISH_PROVINCES', /ALL_SPANISH_PROVINCES\.includes\(b\.destinationProvince/.test(route));

const radar = read('src/lib/geo/geo-acoustic-radar.ts');
check('radar: destinationProvince tipado SpanishProvince', /destinationProvince:\s*SpanishProvince;/.test(radar));

let failed = 0;
for (const r of results) {
  if (!r.ok) failed += 1;
  console.log(`${r.ok ? 'PASS' : 'FAIL'} | ${r.name}${r.detail ? ' | ' + r.detail : ''}`);
}
console.log(`TOTAL=${results.length} FAILED=${failed}`);
process.exit(failed === 0 ? 0 : 1);
