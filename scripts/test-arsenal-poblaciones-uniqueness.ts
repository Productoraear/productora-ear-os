// scripts/test-arsenal-poblaciones-uniqueness.ts
//
// 🧪 TEST DE UNICIDAD LÉXICA Y PERMUTACIÓN DE LAYOUT (> 90% ÚNICO / < 10% SOLAPAMIENTO)
// Productora EAR - Arsenal por Poblaciones bajo /alquiler/[poblacion]

import { resolveArsenalPoblacion, ArsenalPoblacionProfile } from '../src/lib/seo/arsenalPoblacionesEngine';

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

function getNgrams(tokens: string[], n = 3): Set<string> {
  const ngrams = new Set<string>();
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.add(tokens.slice(i, i + n).join(' '));
  }
  return ngrams;
}

function computeOverlapRatio(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  // Overlap relative to the smaller document
  return intersection / Math.min(setA.size, setB.size);
}

function extractFullTownCorpus(profile: ArsenalPoblacionProfile): string {
  const parts: string[] = [
    profile.h1,
    profile.h2Subtitle,
    profile.heroBadge,
    profile.leadParagraph,
    profile.secondaryParagraph,
    profile.tertiaryParagraph,
    profile.technicalPackName,
    profile.technicalPackSummary,
    ...profile.items.map(it => `${it.name} ${it.tagline} ${it.recommendedFor} ${it.specs.join(' ')}`),
    ...profile.faqs.map(f => `${f.question} ${f.answer}`)
  ];
  return parts.join(' ');
}

async function runUniquenessAudit() {
  console.log('🏛️ INICIANDO AUDITORÍA DE UNICIDAD Y PERMUTACIÓN pSEO ARSENAL...');
  console.log('===============================================================');

  const testTowns = [
    'madrid',
    'alcorcon',
    'toledo',
    'mentrida',
    'el-escorial',
    'barcelona',
    'illescas',
    'las-rozas',
    'siguenza',
    'sevilla',
    'talavera-de-la-reina',
    'torrijos',
    'marbella',
    'chinchon',
    'bilbao'
  ];

  const profiles: Record<string, ArsenalPoblacionProfile> = {};
  const corpora: Record<string, Set<string>> = {};

  for (const town of testTowns) {
    const profile = resolveArsenalPoblacion(town);
    profiles[town] = profile;
    const text = extractFullTownCorpus(profile);
    const tokens = tokenize(text);
    corpora[town] = getNgrams(tokens, 3);

    console.log(`📍 [${profile.poblacionName.toUpperCase()}] (${profile.provinceName})`);
    console.log(`   - Arquetipo: ${profile.archetype}`);
    console.log(`   - Distancia Méntrida: ${profile.distanceKm} km | Vía: ${profile.mainAccessHighway}`);
    console.log(`   - Orden Bloques DOM: ${profile.layoutOrder.join(' -> ')}`);
    console.log(`   - Corpus: ${tokens.length} palabras | ${corpora[town].size} 3-grams`);
    console.log(`   - H1: "${profile.h1}"`);
    console.log('---------------------------------------------------------------');
  }

  console.log('\n📊 MATRIZ CRUZADA DE SOLAPAMIENTO (LÍMITE MÁXIMO REQUERIDO: < 10.0%):');
  console.log('====================================================================');

  let maxObservedOverlap = 0;
  let totalPairs = 0;
  let passedPairs = 0;

  for (let i = 0; i < testTowns.length; i++) {
    for (let j = i + 1; j < testTowns.length; j++) {
      const townA = testTowns[i];
      const townB = testTowns[j];
      const overlap = computeOverlapRatio(corpora[townA], corpora[townB]);
      const overlapPercent = (overlap * 100);

      totalPairs++;
      if (overlapPercent > maxObservedOverlap) {
        maxObservedOverlap = overlapPercent;
      }

      const status = overlapPercent <= 10.0 ? '✅ PASA (>90% ÚNICO)' : '❌ FALLA (>10% SOLAPAMIENTO)';
      if (overlapPercent <= 10.0) {
        passedPairs++;
      } else {
        const common: string[] = [];
        for (const item of corpora[townA]) {
          if (corpora[townB].has(item)) common.push(item);
        }
        console.warn(`   ⚠️ ALERTA: ${townA} vs ${townB}: ${overlapPercent.toFixed(2)}% solapamiento (${common.length} 3-grams)`);
        if (totalPairs <= 3) {
          console.log(`      Muestras de 3-grams repetidos (${townA} vs ${townB}):\n      - ${common.slice(0, 20).join('\n      - ')}`);
        }
      }
    }
  }

  console.log(`\n📈 RESULTADOS DE LA PRUEBA:`);
  console.log(`   - Total de pares comparados: ${totalPairs}`);
  console.log(`   - Pares con solapamiento <= 10.0%: ${passedPairs} / ${totalPairs} (${((passedPairs / totalPairs) * 100).toFixed(1)}%)`);
  console.log(`   - Solapamiento máximo observado: ${maxObservedOverlap.toFixed(2)}%`);
  console.log(`   - Unicidad mínima garantizada: ${(100 - maxObservedOverlap).toFixed(2)}%`);

  // Verificación de variación en el orden de bloques
  const layoutOrders = new Set(Object.values(profiles).map(p => p.layoutOrder.join(',')));
  console.log(`   - Variantes de orden DOM activas: ${layoutOrders.size} layouts permutados`);

  if (maxObservedOverlap <= 10.0 && layoutOrders.size >= 4) {
    console.log('\n🌟 CERTIFICACIÓN EXITOSA: La cobertura pSEO cumple el criterio estricto de > 90% contenido único y orden dinámico.');
    process.exit(0);
  } else {
    console.error('\n🛑 ERROR: Criterio de unicidad no alcanzado al 100%.');
    process.exit(1);
  }
}

runUniquenessAudit().catch(err => {
  console.error('Error durante la prueba:', err);
  process.exit(1);
});
