const fs = require('fs');

const qPath = '.antigravity/tasks_queue.json';
const q = JSON.parse(fs.readFileSync(qPath, 'utf8'));
const now = new Date().toISOString();

// Mover W49_T01_COMPILER_100_AUTONOMOUS_CONTROLS a completed
q.tasks = q.tasks.filter(t => t.id !== 'W49_T01_COMPILER_100_AUTONOMOUS_CONTROLS');
q.completed.unshift({
  id: 'W49_T01_COMPILER_100_AUTONOMOUS_CONTROLS',
  title: 'P0 · Compilador Maestro 100% Autónomo para el CEO (Selector de Dominio/Vertical, Stakeholders, Plantillas 1-Clic y Auditor Pre-Vuelo)',
  status: 'COMPLETED',
  exit_code: 0,
  completed_at: now
});

// Añadir las tareas aprobadas por el CEO en la entrevista estratégica:
// - W49_T03_FOUNDERS_100_CONTRACT_PARITY_ENGINE (Pacto de los 100 Fundadores Vitalicios en fincasparaboda.com)
// - W49_T04_ARTIST_360_DASHBOARD_AND_ISRC_HUB (Panel 360 Multinacional del Artista en artistaseuropa.com)
// - W49_T05_VIMUME_TRIPLE_ENGINE_B2G_MECENAZGO (Triple motor de ingreso en viajemusicalporlamemoria.com)
const extraTasks = [
  {
    id: 'W49_T03_FOUNDERS_100_CONTRACT_PARITY_ENGINE',
    title: 'P0 · Validador de Paridad de Contrato & Pacto de los 100 Fundadores Vitalicios (fincasparaboda.com)',
    status: 'QUEUED',
    priority: 'P0_MARKET_DOMINANCE',
    files: [
      'src/lib/founders/founders-parity-engine.ts',
      'src/components/founders/FoundersParityCalculatorCard.tsx',
      'src/components/otzarreta/PartnerShowcaseMetricsPanel.tsx',
      'scripts/verify_founders_parity.ts',
      'package.json'
    ],
    action: 'Implementar la estrategia aprobada por el CEO para dominar el mercado frente a los directorios clásicos: 1) Crear `src/lib/founders/founders-parity-engine.ts` (0 `any`, puro y determinista) que reciba la cuota anual que el proveedor pagaba en su portal anterior, el número de competidores que aparecían en su ficha antigua y su aforo/ticket medio, y devuelva: a) su Cuota Fundador Congelada de por vida (igualada al céntimo, 0% subida IPC vitalicia, contador de plazas disponibles sobre 100 Fundadores), b) el ahorro neto anual por 0% fuga de leads y 0% comisiones ocultas, y c) el certificado SHA-256 de Reserva de Plaza de Fundador. 2) Crear `src/components/founders/FoundersParityCalculatorCard.tsx` (`"use client"`, estética OLED `#030305`/`#ecb613`) donde el dueño de finca o proveedor introduce lo que pagaba antes, adjunta/declara su referencia de contrato previo y bloquea su plaza de Fundador Vitalicio vía Conserjería WhatsApp (`+34 693 693 048`) o depósito deducible de `100 €`. 3) Integrar `FoundersParityCalculatorCard` dentro de `PartnerShowcaseMetricsPanel.tsx` para que Eduardo y cualquier dueño de finca lo tenga operativo hoy mismo. 4) Crear `scripts/verify_founders_parity.ts` y registrar `verify:founders` en `package.json`.',
    scaffold: {
      invariants: [
        'Tope estricto de `MAX_FOUNDERS_SLOTS = 100` con tarifa congelada vitalicia',
        'Todo importe base o depósito proviene de `ear-os-ssot.ts` (`DEPOSITO_STRIPE_EUR = 100`, `SPLIT_SOBERANO 80/10/10`)',
        'Cero menciones a marcas registradas de portales competidores en la interfaz pública (JUR-4)'
      ],
      forbidden: [
        'Prohibido usar `any`',
        'Prohibido inventar plazas ocupadas sin declarar su fuente'
      ]
    },
    test: 'node ./node_modules/tsx/dist/cli.mjs scripts/verify_founders_parity.ts && node ./node_modules/typescript/bin/tsc --noEmit && node ./node_modules/eslint/bin/eslint.js "src/lib/founders/founders-parity-engine.ts" "src/components/founders/FoundersParityCalculatorCard.tsx" "src/components/otzarreta/PartnerShowcaseMetricsPanel.tsx"',
    done_when: '1) El dueño de finca puede calcular su Paridad de Contrato y bloquear su plaza entre los 100 Fundadores Vitalicios. 2) `verify_founders_parity.ts`, `tsc` y `eslint` devuelven Exit Code 0.'
  },
  {
    id: 'W49_T04_ARTIST_360_MULTINATIONAL_HUB',
    title: 'P1 · Panel 360 de Artista (Caché Individual + Distribución ISRC + Telemetría Social + Liquidación 80/10/10 para artistaseuropa.com)',
    status: 'QUEUED',
    priority: 'P1_ARTIST_ECOSYSTEM',
    files: [
      'src/lib/artists/artist-360-contract.ts',
      'src/components/artists/Artist360ControlHub.tsx',
      'scripts/verify_artist_360.ts',
      'package.json'
    ],
    action: 'Construir el estándar obligatorio de 3 capas aprobado por el CEO para todas las fichas de `artistaseuropa.com`: 1) Crear `src/lib/artists/artist-360-contract.ts` (0 `any`) que modele: Capa A (Configurador de Caché Individual por formato Solista/Dúo/Banda, km exentos y rider acústico Ley 37/2003), Capa B (Distribución Digital 360 con generador/validador de código ISRC `ES-EAR-YY-NNNNN`, enlaces a perfiles oficiales de streaming/redes y reproductor de alta fidelidad sin recortes), y Capa C (Liquidación automática 80% Artista / 10% EAR OS / 10% VIMUME sobre cada reserva bloqueada con `100 €`). 2) Crear `src/components/artists/Artist360ControlHub.tsx` (`"use client"`, estética OLED) con las 3 pestañas interactivas listas para montar en las fichas de artistas y en el portal pro. 3) Crear `scripts/verify_artist_360.ts` y añadir `verify:artist-360` en `package.json`.',
    scaffold: {
      invariants: [
        'Tarifa suelo solista Edwin Agudelo = `350,00 €` (`TARIFA_BASE_SOLISTA_EUR`) y Split `80/10/10` inmutable',
        'Validación estricta de formato ISRC (`ES-EAR-\\d{2}-\\d{5}`)',
        'Cero menciones a marcas registradas de transporte o terceros (JUR-4)'
      ],
      forbidden: [
        'Prohibido usar `any`',
        'Prohibido alterar `ear-os-ssot.ts`'
      ]
    },
    test: 'node ./node_modules/tsx/dist/cli.mjs scripts/verify_artist_360.ts && node ./node_modules/typescript/bin/tsc --noEmit',
    done_when: '1) El módulo de Artista 360 calcula caché propio, valida códigos ISRC y desglosa el Split 80/10/10 al céntimo. 2) `verify_artist_360.ts` y `tsc --noEmit` devuelven Exit Code 0.'
  }
];

for (const et of extraTasks) {
  if (!q.tasks.some(t => t.id === et.id)) {
    q.tasks.push(et);
  }
}

q._meta.total_tasks = q.tasks.length + q.completed.length;
q._meta.total_pending = q.tasks.length;
q._meta.last_updated = now;
q.metadata.last_updated = now;
q.metadata.total_pending = q.tasks.length;

fs.writeFileSync(qPath, JSON.stringify(q, null, 2) + '\n', 'utf8');
console.log('Queue finalized -> pending:', q.tasks.length, 'completed:', q.completed.length);

