/**
 * ════════════════════════════════════════════════════════════════════════════
 * W52_T03 · ARNÉS DEL BANCO DE MÚSICOS & ARTISTAS DIAMANTE ROJO
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  DIAMANTE_ROJO_REGISTRY,
  validateCertifiedArtistEntry,
  listCertified,
  listDiamanteRojoCertified,
  type DiamanteRojoArtist,
} from '@/lib/academy/diamante-rojo-registry';
import { TARIFA_BASE_SOLISTA_EUR } from '@/lib/constants/ear-os-ssot';

let assertions = 0;
const failures: string[] = [];

function check(condition: boolean, label: string): void {
  assertions += 1;
  if (!condition) failures.push(label);
}

// 1. Edwin Agudelo existe como #01 y cumple suelo canónico
{
  const founder = DIAMANTE_ROJO_REGISTRY.find((a) => a.slug === 'edwin-agudelo');
  check(Boolean(founder), 'Edwin Agudelo registrado como Diamante Rojo');
  check(founder?.provenance === 'DECLARADO_CEO', 'Procedencia de Edwin es DECLARADO_CEO');
  check(founder?.baseFeeEur === TARIFA_BASE_SOLISTA_EUR, `Tarifa de Edwin respeta suelo ${TARIFA_BASE_SOLISTA_EUR} €`);
  check(founder?.riderHomologated === true, 'Rider acústico homologado en regla');
}

// 2. Rechazo de entradas sin procedencia (Caso Negativo)
{
  const invalid = validateCertifiedArtistEntry({
    stageName: 'Músico Fantasma',
    slug: 'fantasma',
    baseFeeEur: 500,
    // provenance omitida intencionalmente
  });
  check(invalid.isValid === false, 'Rechazo estricto sin procedencia');
}

// 3. Rechazo de tarifas por debajo del suelo canónico de 350 €
{
  const underpriced = validateCertifiedArtistEntry({
    stageName: 'Artista Barato',
    slug: 'artista-barato',
    provenance: 'DECLARADO_CEO',
    baseFeeEur: 200, // inferior a 350
  });
  check(underpriced.isValid === false, 'Rechazo de tarifa inferior a 350 €');
}

// 4. Listado público coincide
{
  const list = listDiamanteRojoCertified();
  check(list.length >= 1, 'listDiamanteRojoCertified devuelve registros');
}

console.log(`DIAMANTE_ROJO_ASSERTIONS=${assertions}`);
if (failures.length > 0) {
  for (const f of failures) console.error(`FAIL · ${f}`);
  console.log('DIAMANTE_ROJO_RESULT=FAIL');
  process.exit(1);
}
console.log('DIAMANTE_ROJO_RESULT=PASS');
