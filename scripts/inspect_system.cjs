const fs = require('fs');
const path = require('path');

const out = [];
function log(msg) {
  out.push(msg);
  console.log(msg);
}

log('=== FS SYSTEM INSPECTION ===');
log(`USER: ${process.env.USERNAME}`);
log(`USERPROFILE: ${process.env.USERPROFILE}`);
log(`LOCALAPPDATA: ${process.env.LOCALAPPDATA}`);
log(`APPDATA: ${process.env.APPDATA}`);

// 1. Check VS Code
const candidatesVSCode = [
  path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Microsoft VS Code', 'Code.exe'),
  'C:\\Program Files\\Microsoft VS Code\\Code.exe',
  'C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe'
];

for (const p of candidatesVSCode) {
  log(`Checking VSCode path: ${p} -> ${fs.existsSync(p) ? 'EXISTS' : 'NOT FOUND'}`);
}

// 2. Check Ollama
const candidatesOllama = [
  path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Ollama', 'ollama.exe'),
  path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Ollama', 'ollama app.exe'),
  'C:\\Program Files\\Ollama\\ollama.exe'
];

for (const p of candidatesOllama) {
  log(`Checking Ollama path: ${p} -> ${fs.existsSync(p) ? 'EXISTS' : 'NOT FOUND'}`);
}

// 3. Check VS Code extensions & Cline/Roo Code
const appData = process.env.APPDATA || '';
const userProfile = process.env.USERPROFILE || '';
const extensionsDirs = [
  path.join(userProfile, '.vscode', 'extensions'),
  path.join(appData, 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev'),
  path.join(appData, 'Code', 'User', 'globalStorage', 'rooveterinaryinc.roo-cline'),
  path.join(appData, 'Code', 'User', 'settings.json')
];

for (const p of extensionsDirs) {
  if (fs.existsSync(p)) {
    log(`Checking config: ${p} -> EXISTS`);
    if (fs.statSync(p).isDirectory()) {
      try {
        const files = fs.readdirSync(p);
        log(`   Contents (${files.length} items): ${files.slice(0, 10).join(', ')}`);
      } catch (err) {
        log(`   Error reading dir: ${err.message}`);
      }
    }
  } else {
    log(`Checking config: ${p} -> NOT FOUND`);
  }
}

fs.writeFileSync(path.join(__dirname, 'inspect_out.txt'), out.join('\n'), 'utf8');
log('Done writing inspect_out.txt');
