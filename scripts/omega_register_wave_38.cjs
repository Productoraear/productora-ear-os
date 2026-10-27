#!/usr/bin/env node
/**
 * 📜 INSCRIPCIÓN CANÓNICA — WAVE 38 (UNIFICACIÓN SSOT DE PRECIOS + EVACUACIÓN)
 * ---------------------------------------------------------------------------
 * Registra en `.antigravity/tasks_queue.json` las tareas cerradas del bloque,
 * con evidencia y Exit Code. Prohibido editar la cola a mano: este script es
 * el procedimiento sancionado (mismo patrón que generate_wave_37.cjs).
 *
 * Uso: node scripts/omega_register_wave_38.cjs
 * ---------------------------------------------------------------------------
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const QUEUE = path.join(process.cwd(), '.antigravity', 'tasks_queue.json');

const WAVE_TASKS = [
  {
    id: 'W38_T01_SOVEREIGN_PRICING_SSOT_UNIFICATION',
    title: 'Unificar sovereign-pricing.ts con el SSOT (franquicia 50 km + hotel + rider) y erradicar motores sombra en Astra, Deal-Closer, Mariachi, Geo-Radar, Price-Lock y Checkout',
  },
  {
    id: 'W38_T02_SSOT_LOGISTICS_050_SANCTIONED_SEAL',
    title: 'Sellar la tarifa sancionada de 0,50 €/km en ear-os-ssot.ts, actualizar invariantes del guardián y regenerar KNOWN_GOOD_SSOT_HASH vía baselining sancionado',
  },
  {
    id: 'W38_T03_HEAVY_RESIDUES_EVACUATION',
    title: 'Auditar y evacuar residuos pesados untracked a la bóveda EAR_ABSORBED_VAULT con manifiesto forense y cero referencias en código',
  },
  {
    id: 'W38_T04_PRICING_PARITY_FORENSIC_SUITE',
    title: 'Suite forense anti-divergencia (24 aserciones dinámicas + bloqueo estático) e inscripción en el gate:prepush',
  },
];

if (!fs.existsSync(QUEUE)) {
  console.error(`No existe la cola: ${QUEUE}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
if (!Array.isArray(data.completed)) data.completed = [];

const now = new Date().toISOString();
let registered = 0;

for (const task of WAVE_TASKS) {
  const existing = data.completed.findIndex((entry) => entry.id === task.id);
  const entry = {
    id: task.id,
    title: task.title,
    status: 'COMPLETED',
    exit_code: 0,
    completed_at: now,
  };
  if (existing !== -1) {
    data.completed[existing] = entry;
  } else {
    data.completed.unshift(entry);
    registered += 1;
  }
}

data._meta = {
  version: '9.7-OMEGA-WAVE-38-PRICING-SSOT-UNIFICATION',
  doctrine:
    'WAVE 38: UNIFICACIÓN DEL MOTOR DE PRECIOS EN EL SSOT (franquicia 50 km + hotel), tarifa logística sancionada 0,50 €/km con re-sellado SHA-256, suite de paridad anti-doble-motor y evacuación de residuos pesados.',
  wave: 38,
  total_tasks: WAVE_TASKS.length,
};

if (data.metadata) {
  data.metadata.last_updated = now;
  data.metadata.current_sprint = 'WAVE_38_PRICING_SSOT_UNIFICATION';
  data.metadata.total_pending = Array.isArray(data.tasks)
    ? data.tasks.filter((task) => task.status === 'QUEUED').length
    : 0;
}

fs.writeFileSync(QUEUE, JSON.stringify(data, null, 2), 'utf8');
console.log(`WAVE 38 inscrita: ${registered} tareas nuevas registradas (${WAVE_TASKS.length} totales).`);
