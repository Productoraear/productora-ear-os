const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = 'src';
const empty = [];

function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (/\.(tsx|ts)$/.test(e.name)) {
            const c = fs.readFileSync(p, 'utf8');
            if (c.length === 0) empty.push(p);
        }
    }
}
walk(root);

const tracked = [];
const untracked = [];
for (const p of empty) {
    try {
        cp.execSync('git ls-files --error-unmatch -- "' + p + '"', { stdio: ['ignore', 'ignore', 'ignore'] });
        tracked.push(p);
    } catch (e) {
        untracked.push(p);
    }
}

console.log('=== CLASIFICACION ARCHIVOS VACIOS (0 bytes) ===');
console.log('TOTAL VACIOS:', empty.length);
console.log('TRACKED (restaurables de HEAD):', tracked.length);
console.log('UNTRACKED (nuevos/sin respaldo git):', untracked.length);
console.log('');
console.log('--- UNTRACKED ---');
untracked.forEach(p => console.log('  ' + p));

require('fs').writeFileSync('.antigravity/empty_tracked.txt', tracked.join('\n'), 'utf8');
require('fs').writeFileSync('.antigravity/empty_untracked.txt', untracked.join('\n'), 'utf8');