'use strict';
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'app', '(public)', 'artistas', 'reclamar-regalias', 'page.tsx');
const src = fs.readFileSync(FILE, 'utf8');
const lower = src.toLowerCase();

const checks = [
  ['Ausencia "anti-multas"', !lower.includes('anti-multas')],
  ['Ausencia "anular inspecciones"', !lower.includes('anular inspecciones')],
  ['Ausencia "dinero que te deben"', !lower.includes('dinero que te deben')],
  ['Ausencia "dinero no reclamado"', !lower.includes('dinero no reclamado')],
  ['Ausencia "Inmune"', !/certificado inmune/i.test(src)],
  ['Ausencia "Recupera el 100%"', !/recupera el 100%/i.test(src)],
  ['Ausencia "jurídicamente irrefutable"', !lower.includes('jurídicamente irrefutable')],
  ['Ausencia "prueba plena"', !lower.includes('prueba plena')],
  ['Presencia "Art. 108"', src.includes('Art. 108')],
  ['Presencia "TRLPI"', src.includes('TRLPI')],
  ['Presencia "Certificación Forense de Ejecución Pública"', src.includes('Certificación Forense de Ejecución Pública')],
  ['Presencia "Justificante de repertorio"', /justificante de repertorio para entidades de gestión colectiva \(SGAE \/ AIE\)/i.test(src)],
  ['Presencia "Estimación orientativa de repertorio auditable"', /estimación orientativa de repertorio auditable/i.test(src)],
  ['Descargo: plataforma tecnológica independiente', src.includes('EAR OS es una plataforma tecnológica independiente de auditoría acústica y certificación de ejecuciones.')],
  ['Descargo: no entidad de gestión colectiva', src.includes('No constituye entidad de gestión colectiva de derechos ni sustituye la liquidación legal obligatoria.')],
  ['Descargo visible (role="note")', src.includes('role="note"') && src.includes('Descargo de Responsabilidad Oficial')],
  ['Analizador UniversalCueBridge importado', /import\s*\{[^}]*UniversalCueBridge[^}]*\}\s*from/.test(src)],
  ['Analizador UniversalCueBridge.parse en uso', src.includes('UniversalCueBridge.parse(')],
  ['Soporte M3U/NML', src.includes('.m3u') && src.includes('.nml')],
  ['Emisión SHA-256 conservada', src.includes('SHA-256')],
  ['Ausencia de ": any"', !/:\s*any\b/.test(src)],
  ['Ausencia de Math.random', !src.includes('Math.random')],
];

let failed = 0;
checks.forEach(([name, ok], i) => {
  console.log(`${ok ? 'PASS' : 'FAIL'} [${String(i + 1).padStart(2, '0')}] ${name}`);
  if (!ok) failed++;
});
console.log(`\n${checks.length - failed}/${checks.length} aserciones OK`);
process.exit(failed === 0 ? 0 : 1);
