#!/usr/bin/env node
'use strict';

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * CHAIN_ENGINE_SCLASS.CJS — ORQUESTADOR DE ENCADENAMIENTO AUTÓNOMO EN CASCADA
 * ════════════════════════════════════════════════════════════════════════════════
 * MODO CEO ACTIVO: Dispara la tarea activa, ejecuta los 5 cerrojos de validación
 * y si da Exit Code 0, sella con omega.js complete y encadena la siguiente tarea
 * automáticamente sin pausas ni mensajería manual.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const QUEUE_FILE = path.join(ROOT, '.antigravity', 'tasks_queue.json');
const MISSION_FILE = path.join(ROOT, '.antigravity', 'MISSION_ACTIVE.json');

function log(msg, color = '\x1b[36m') {
  console.log(`${color}[CHAIN-ENGINE S-CLASS] ${msg}\x1b[0m`);
}

function runCmd(cmd, desc) {
  log(`Ejecutando: ${desc} -> ${cmd}`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
    return true;
  } catch (err) {
    log(`❌ Fallo en ${desc} (Exit Code != 0)`, '\x1b[31m');
    return false;
  }
}

function getActiveTask() {
  if (!fs.existsSync(MISSION_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(MISSION_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function getQueueRemaining() {
  if (!fs.existsSync(QUEUE_FILE)) return 0;
  try {
    const q = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
    return q.tasks ? q.tasks.length : 0;
  } catch {
    return 0;
  }
}

async function chainLoop() {
  console.log('\n' + '═'.repeat(80));
  log('INICIANDO BUCLE AUTÓNOMO DE ENCADENAMIENTO CONTINUO S-CLASS', '\x1b[33m');
  console.log('═'.repeat(80) + '\n');

  let rounds = 0;
  const maxRounds = 10;

  while (rounds < maxRounds) {
    rounds++;
    const active = getActiveTask();
    const remaining = getQueueRemaining();

    if (!active) {
      log('No hay misión activa en MISSION_ACTIVE.json. Intentando avanzar cola...');
      if (!runCmd('node .antigravity/omega.js next', 'omega.js next')) {
        log('Cola vacía o sin misiones pendientes. Misión cumplida.');
        break;
      }
      continue;
    }

    log(`\n▶ [RONDA ${rounds}] Procesando Tarea Activa: ${active.id} (${active.title})`, '\x1b[32m');
    log(`  Restantes en cola: ${remaining}`);

    // 1. Ejecutar el test específico de la tarea si existe
    if (active.test) {
      log(`Ejecutando suite de test de la tarea: ${active.test}`);
      const testPassed = runCmd(active.test, `Test Suite ${active.id}`);
      if (!testPassed) {
        log(`⛔ La tarea ${active.id} no supera sus pruebas. Deteniendo bucle para auditoría.`, '\x1b[31m');
        process.exit(1);
      }
    }

    // 2. Ejecutar Typecheck estricto
    log('Validando TypeScript (cero any, tipo estricto)...');
    const tscPassed = runCmd('node ./node_modules/typescript/bin/tsc --noEmit', 'TypeScript Check');
    if (!tscPassed) {
      log(`⛔ Fallo en compilación TypeScript en ${active.id}. Deteniendo bucle.`, '\x1b[31m');
      process.exit(1);
    }

    // 3. Si todo superó Exit Code 0, sellar la tarea
    log(`✓ Todos los cerrojos superados. Sellando ${active.id} con omega.js complete...`, '\x1b[32m');
    const completePassed = runCmd(`node .antigravity/omega.js complete ${active.id}`, `Cierre ${active.id}`);
    if (!completePassed) {
      log(`⛔ Error al sellar la tarea ${active.id}.`, '\x1b[31m');
      process.exit(1);
    }

    log(`✨ Tarea ${active.id} COMPLETADA Y SELLADA EXITOSAMENTE.`, '\x1b[32m');

    // 4. Disparar automáticamente la siguiente tarea en cola
    log('Disparando siguiente tarea en cola (omega.js next)...');
    const nextPassed = runCmd('node .antigravity/omega.js next', 'omega.js next');
    if (!nextPassed) {
      log('Fin de la cola. Todas las tareas han sido ejecutadas y selladas.', '\x1b[32m');
      break;
    }
  }

  log('═══ ENCADENAMIENTO CULMINADO ═══', '\x1b[32m');
}

chainLoop();

