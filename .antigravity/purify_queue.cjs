const fs = require('fs');

const QUEUE = '.antigravity/tasks_queue.json';
const q = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));

// 1. Eliminar TODAS las tareas HEAL generadas artificialmente.
const originales = q.tasks.filter(t => !/-HEAL/.test(t.id));

// 2. Reclasificar originales: un MVP es COMPLETED solo si su tarea está COMPLETED.
//    Si fue FAILED/HEAL por culpa del bug, se devuelve a QUEUED (retries=0).
const map = new Map();
originales.forEach(t => {
    const key = t.id;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(t);
});

const limpio = [];
map.forEach((registros, id) => {
    const hasCompleted = registros.some(r => r.status === 'COMPLETED');
    const hasQueued = registros.some(r => r.status === 'QUEUED');

    // Priorizar el registro más avanzado
    const mejor = hasCompleted
        ? registros.find(r => r.status === 'COMPLETED')
        : registros.find(r => r.status === 'QUEUED') || registros[0];

    if (hasCompleted) {
        mejor.status = 'COMPLETED';
        delete mejor.retries;
    } else {
        // No completado -> devolver a la cola limpia
        mejor.status = 'QUEUED';
        delete mejor.retries;
        delete mejor.attempts;
    }
    limpio.push(mejor);
});

// 3. Mantener orden original por wave/id numerico.
limpio.sort((a, b) => {
    const na = parseInt((a.id.match(/\d+/) || [0])[0], 10);
    const nb = parseInt((b.id.match(/\d+/) || [0])[0], 10);
    return na - nb;
});

q.tasks = limpio;

fs.writeFileSync(QUEUE, JSON.stringify(q, null, 2), 'utf8');

const c = {};
limpio.forEach(t => c[t.status] = (c[t.status] || 0) + 1);
console.log('COLA PURIFICADA:');
console.log('  Eliminadas HEAL:', q.tasks.length - limpio.length, '(antes', q.tasks.length + (q.tasks.length - limpio.length), 'registros)');
console.log('  Estado final:', JSON.stringify(c));
console.log('  Total originales:', limpio.length);