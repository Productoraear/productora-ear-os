const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const QUEUE = path.join(__dirname, 'tasks_queue.json');
const MISSION = path.join(__dirname, 'MISSION_ACTIVE.json');

/**
 * RESET CONTROL ZERO — Orden expresa del CEO.
 * 1. Detecta y detiene cualquier daemon Omega / obrero autónomo.
 * 2. Purga la cola de tareas a cero (tasks: []).
 * 3. Elimina la misión activa si existe.
 * Se ejecuta de forma programática (nunca edición manual del JSON).
 */

console.log('====== RESET CONTROL ZERO ======');

// 1. Detectar procesos node con su línea de comandos
let procs = [];
try {
    const ps = [
        'Get-CimInstance Win32_Process -Filter "Name=\'node.exe\'"',
        '| Select-Object ProcessId, CommandLine',
        '| ForEach-Object { $_.ProcessId.ToString() + "|" + ($_.CommandLine ?? "") }',
    ].join(' ');
    const out = execSync(`powershell -NoProfile -Command "${ps}"`, {
        encoding: 'utf8',
        cwd: ROOT,
        windowsHide: true,
    });
    procs = out
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.includes('|'));
} catch (e) {
    console.log('  [warn] No se pudo consultar procesos node:', e.message);
}

console.log(`\n  Procesos node detectados: ${procs.length}`);
const omegaDaemons = procs.filter((p) => /omega|antigravity|tasks_queue|daemon/i.test(p));
for (const p of procs) {
    console.log('  ' + p.slice(0, 160));
}

// 2. Matar daemons Omega
for (const p of omegaDaemons) {
    const pid = p.split('|')[0].trim();
    try {
        execSync(`taskkill /f /pid ${pid} /t`, { windowsHide: true, cwd: ROOT });
        console.log(`  [OK] Daemon Omega detenido (PID ${pid}).`);
    } catch (e) {
        console.log(`  [warn] No se pudo detener PID ${pid}: ${e.message.trim()}`);
    }
}

// 3. Purgar la cola a cero (estructura preservada)
if (fs.existsSync(QUEUE)) {
    const q = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
    const antes = Array.isArray(q.tasks) ? q.tasks.length : 0;

    // Respaldo de seguridad con timestamp (nunca se pierde el progreso)
    const backupName = `tasks_queue.backup_${Date.now()}.json`;
    fs.writeFileSync(path.join(__dirname, backupName), JSON.stringify(q, null, 2) + '\n', 'utf8');
    console.log(`  [OK] Respaldo creado: ${backupName}`);

    q.tasks = [];
    fs.writeFileSync(QUEUE, JSON.stringify(q, null, 2) + '\n', 'utf8');
    console.log(`\n  [OK] Cola purgada: ${antes} tareas -> 0.`);
} else {
    console.log('\n  [warn] tasks_queue.json no existe.');
}

// 4. Eliminar misión activa
if (fs.existsSync(MISSION)) {
    fs.unlinkSync(MISSION);
    console.log('  [OK] MISSION_ACTIVE.json eliminada.');
}

console.log('\n  RESULTADO: control desde cero restaurado.');