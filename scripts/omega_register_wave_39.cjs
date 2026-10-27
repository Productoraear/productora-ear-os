#!/usr/bin/env node
/**
 * 📜 INSCRIPCIÓN CANÓNICA — WAVE 39 (CONTEXTO DE PÁGINA + UX MÓVIL)
 * Uso: node scripts/omega_register_wave_39.cjs
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const QUEUE = path.join(process.cwd(), '.antigravity', 'tasks_queue.json');

const TASKS = [
  {
    id: 'W39_T01_PAGE_CONTEXT_RESOLVER',
    title: 'Resolver server-side pathname/URL → entidad canónica (Otzarreta, fincas, artistas, reserva) sin fetch y con ficha verificada obligatoria en el prompt',
  },
  {
    id: 'W39_T02_ANTI_SSRF_URL_CONTEXT',
    title: 'Neutralizar URLs pegadas antes del escaneo de inyección: navegar no es atacar, y jamás se abre la URL del cliente',
  },
  {
    id: 'W39_T03_HONEST_LOGISTICS_NULL_DISTANCE',
    title: 'distanceKm nullable: sin ubicación confirmada no se cotiza logística (ni 0 ni 58 km) y el enlace de reserva omite el km',
  },
  {
    id: 'W39_T04_CONCIERGE_MOBILE_SHEET',
    title: 'Concierge móvil: FAB táctil sobre el CTA de WhatsApp (z-1000), sheet 100dvh z-1200, composer inferior con safe-area, 16px y targets ≥44px',
  },
  {
    id: 'W39_T05_CONTEXT_FORENSIC_SUITE',
    title: 'Suite verify:context (21 aserciones) + E2E real contra el dev server del CEO + auditoría móvil Playwright 390x844',
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
  version: '9.8-OMEGA-WAVE-39-CONCIERGE-CONTEXT-MOBILE',
  doctrine:
    'WAVE 39: CONTEXTO DE PÁGINA (cero ceguera y cero SSRF), kilometraje honesto sin ubicación confirmada y UX móvil real del Concierge (FAB, sheet 100dvh, composer seguro).',
  wave: 39,
  total_tasks: TASKS.length,
};

if (data.metadata) {
  data.metadata.last_updated = now;
  data.metadata.current_sprint = 'WAVE_39_CONCIERGE_CONTEXT_MOBILE';
  data.metadata.total_pending = Array.isArray(data.tasks)
    ? data.tasks.filter((task) => task.status === 'QUEUED').length
    : 0;
}

fs.writeFileSync(QUEUE, JSON.stringify(data, null, 2), 'utf8');
console.log(`WAVE 39 inscrita: ${registered} tareas nuevas (${TASKS.length} totales).`);
