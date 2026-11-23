/**
 * VERIFICACIÓN CANÓNICA RAG OTZARRETA (TASK-003)
 * Valida que el RAG del Maître de Restaurante Otzarreta responda con
 * datos canónicos: menús 145-185€, 120 plazas párking, 0€ celíacos, exclusividad y acústica.
 */
'use strict';

const assert = require('node:assert');
const { resolveOtzarretaQuery } = require('../src/lib/rag/provider-context.ts');

console.log('── INICIANDO VERIFICACIÓN RAG CONCIERGE OTZARRETA (TASK-003) ──');

let assertions = 0;

// 1. Prueba de alérgenos / celíacos (0,00 €)
const rAlergenos = resolveOtzarretaQuery('Tenemos invitados celiacos y veganos, cuanto es el suplemento?');
assert.strictEqual(rAlergenos.handled, true, 'Debe ser gestionada por Otzarreta RAG');
assert.ok(rAlergenos.reply.includes('0,00 €'), 'Debe certificar suplemento de 0,00 € para celíacos');
assert.ok(rAlergenos.reply.includes('sin gluten'), 'Debe mencionar protocolo sin gluten');
assertions += 3;
console.log('PASS | Alérgenos: protocolo 0,00 € sin gluten verificado');

// 2. Prueba de chuleta a la brasa / menú asador
const rChuleta = resolveOtzarretaQuery('La chuleta sale fria o cocida? Como la servis?');
assert.strictEqual(rChuleta.handled, true);
assert.ok(rChuleta.reply.includes('hornos de regeneración'), 'Debe desmentir hornos de regeneración');
assert.ok(rChuleta.reply.includes('carbón de encina y sarmiento'), 'Debe certificar brasa de encina y sarmiento');
assert.ok(rChuleta.reply.includes('155,00 € + IVA'), 'Debe citar tarifa del Menú Asador');
assertions += 4;
console.log('PASS | Cocina: brasa de sarmiento y chuleta al punto verificado');

// 3. Prueba de exclusividad (boda única al día)
const rExclusiv = resolveOtzarretaQuery('Habra otra boda o comensales comiendo al lado?');
assert.strictEqual(rExclusiv.handled, true);
assert.ok(rExclusiv.reply.includes('Rotundamente no'), 'Debe rechazar solapamiento de bodas');
assert.ok(rExclusiv.reply.includes('Boda Única en Exclusiva'), 'Debe certificar cláusula de boda única');
assert.ok(rExclusiv.reply.includes('100% para vosotros'), 'Debe garantizar 100% de exclusividad');
assertions += 4;
console.log('PASS | Exclusividad: 1 sola boda al día garantizada');

// 4. Prueba de parking y autobuses
const rParking = resolveOtzarretaQuery('Vendran 70 coches y 2 autobuses grandes, hay parking?');
assert.strictEqual(rParking.handled, true);
assert.ok(rParking.reply.includes('120'), 'Debe citar capacidad de 120 vehículos');
assert.ok(rParking.reply.includes('autobuses de gran tonelaje'), 'Debe contemplar maniobra de autobuses');
assertions += 3;
console.log('PASS | Párking: 120 plazas y zona de autobuses verificado');

// 5. Prueba de acústica y música nocturna (Ley 37/2003)
const rAcustica = resolveOtzarretaQuery('Queremos musica cañera con nuestro DJ hasta las 06:00 a todo volumen');
assert.strictEqual(rAcustica.handled, true);
assert.ok(rAcustica.reply.includes('Ley 37/2003'), 'Debe referenciar Ley 37/2003 del Ruido');
assert.ok(rAcustica.reply.includes('75 dB'), 'Debe fijar límite sonométrico en 75 dB');
assert.ok(rAcustica.reply.includes('salón interior') || rAcustica.reply.includes('salón acristalado'), 'Debe derivar baile nocturno a interior');
assertions += 4;
console.log('PASS | Acústica: protocolo sonométrico preventivo verificado');

// 6. Prueba de depósito y Price-Lock 100 €
const rFianza = resolveOtzarretaQuery('Esos 100 euros de fianza se pierden o tienen truco?');
assert.strictEqual(rFianza.handled, true);
assert.ok(rFianza.reply.includes('Price-Lock 100% deducible'), 'Debe aclarar que es 100% deducible');
assert.ok(rFianza.reply.includes('100,00 €'), 'Debe citar fianza canónica de 100,00 €');
assertions += 3;
console.log('PASS | Fianza: 100 € Price-Lock deducible verificado');

console.log(`\nTOTAL ASERCIONES VERIFICADAS: ${assertions}/21`);
console.log('VERDICT: PASS');
process.exit(0);
