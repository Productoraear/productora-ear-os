const fs = require('fs');
const path = require('path');

const queuePath = path.join(process.cwd(), '.antigravity', 'tasks_queue.json');
const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

let updatedCount = 0;
const targetIds = [
  'TASK-001-GEO-52-PROVINCIAS',
  'TASK-002-SEATING-PLANNER-MENUS',
  'TASK-003-OTZARRETA-MAITRE-RAG',
  'TASK-004-ACOUSTIC-LAW-MONITORING',
  'TASK-005-ARTIST-HUB-LOGISTICS',
  'TASK-006-SSOT-ZONA-CERO-HASH',
  'TASK-007-ANTI-CRASH-CONCURRENCY',
  'TASK-008-DLP-SECRETS-AUDIT',
  'TASK-009-AUTONOMOUS-AST-SCANNER'
];

queue.tasks.forEach(task => {
  if (targetIds.includes(task.id)) {
    task.status = 'DONE';
    task.completed_at = new Date().toISOString();
    task.verified = true;
    updatedCount++;
  }
});

console.log(`Updated ${updatedCount} tasks to DONE.`);
fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), 'utf8');
