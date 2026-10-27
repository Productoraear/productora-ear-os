#!/usr/bin/env node
/**
 * 📜 INSCRIPCIÓN CANÓNICA — WAVE 40 (PEAJE SOBERANO · LEAD CONTAINMENT)
 * Uso: node scripts/omega_register_wave_40.cjs
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const QUEUE = path.join(process.cwd(), '.antigravity', 'tasks_queue.json');

const TASKS = [
  {
    id: 'W40_T01_SOVEREIGN_LEAD_GATE',
    title: 'Módulo canónico `sovereign-lead-gate`: canal único Conserjería EAR OS, enlaces cualificados, enmascarado de líneas de proveedor y saneado recursivo de JSON-LD',
  },
  {
    id: 'W40_T02_OTZARRETA_PEAJE_HUB',
    title: 'Erradicar la línea directa de Eduardo del hub /otzarreta (hero, tarjetas de sede, footer y JSON-LD) y sustituirla por visita técnica + Conserjería',
  },
  {
    id: 'W40_T03_OTZARRETA_CLUSTER_PEAJE',
    title: 'Sanear las 126 landings /otzarreta/[slug]: CTA a la centralita, provenance con línea enmascarada y Schema.org sin teléfono/email del recinto',
  },
  {
    id: 'W40_T04_THIRD_PARTY_VERTICALS',
    title: 'Cerrar fugas de peaje en verticales de terceros (alumbrado navideño, chófer VIP) y enmascarar el teléfono en la ficha de reclamación',
  },
  {
    id: 'W40_T05_PEAJE_AUDIT_CI',
    title: 'Auditor anti-picaresca ampliado (enlaces, literales, renders JSX) + suite verify:leadgate 34/34 dentro de gate:prepush',
  },
  {
    id: 'W40_T06_CONCIERGE_PEAJE_PROMPT',
    title: 'Blindar el Concierge IA: canal único en la ficha verificada y veto explícito a facilitar teléfonos o emails del recinto',
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

for (const task of TASKS) {
  const index = data.completed.findIndex((entry) => entry.id === task.id);
  const entry = { id: task.id, title: task.title, status: 'COMPLETED', exit_code: 0, completed_at: now };
  if (index !== -1) data.completed[index] = entry;
  else {
    data.completed.unshift(entry);
    registered += 1;
  }
}

data._meta = {
  version: '9.9-OMEGA-WAVE-40-SOVEREIGN-LEAD-GATE',
  doctrine:
    'WAVE 40: PEAJE SOBERANO. Ningún recinto, proveedor o vertical de terceros publica su línea en una superficie comercial. Toda la demanda entra por la Conserjería EAR OS; el JSON-LD y el Concierge IA también quedan blindados.',
  wave: 40,
  total_tasks: TASKS.length,
};

if (data.metadata) {
  data.metadata.last_updated = now;
  data.metadata.current_sprint = 'WAVE_40_SOVEREIGN_LEAD_GATE';
  data.metadata.total_pending = Array.isArray(data.tasks)
    ? data.tasks.filter((task) => task.status === 'QUEUED').length
    : 0;
}

fs.writeFileSync(QUEUE, JSON.stringify(data, null, 2), 'utf8');
console.log(`WAVE 40 inscrita: ${registered} tareas nuevas (${TASKS.length} totales).`);
