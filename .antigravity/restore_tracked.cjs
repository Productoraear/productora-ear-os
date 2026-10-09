const fs = require('fs');
const cp = require('child_process');

const listFile = '.antigravity/empty_tracked.txt';
const files = fs.readFileSync(listFile, 'utf8').split(/\r?\n/).filter(Boolean);

console.log('Restaurando', files.length, 'archivos desde HEAD...');

// Restore in batches to avoid command-line length limits
const BATCH = 20;
for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH);
    const args = batch.map(f => JSON.stringify(f)).join(' ');
    cp.execSync('git restore --source=HEAD --worktree -- ' + args, { shell: true, stdio: 'inherit' });
    console.log('  Lote', i / BATCH + 1, 'OK:', batch.length, 'archivos');
}

console.log('RESTAURACION COMPLETA.');