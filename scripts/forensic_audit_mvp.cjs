const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('═══════════════════════════════════════════════════════════════');
console.log('  AUDITORÍA FORENSE BIT-A-BIT ATÓMICA DE EAR OS (ZERO-TOKEN)');
console.log('═══════════════════════════════════════════════════════════════\n');

const issues = [];
const srcDir = path.join(__dirname, '..', 'src');

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        walkDir(fullPath, callback);
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(file)) {
      callback(fullPath);
    }
  }
}

// 1. Auditoría de patrones en código
walkDir(srcDir, (filePath) => {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // A. Enlaces muertos
    if (/href=["']#["']/.test(line) && !line.includes('// ignore-audit')) {
      issues.push({
        file: relativePath,
        line: lineNum,
        severity: 'MEDIA',
        type: 'ENLACE_MUERTO',
        detail: 'Enlace huérfano href="#" sin destino real'
      });
    }

    // B. Botones con handlers vacíos
    if (/onClick=\{?\(\)\s*=>\s*\{\}\}?/.test(line)) {
      issues.push({
        file: relativePath,
        line: lineNum,
        severity: 'ALTA',
        type: 'BOTON_HUERFANO',
        detail: 'Botón con handler onClick vacío () => {}'
      });
    }

    // C. Importaciones de generadores falsos
    if (/fincas-generator/.test(line)) {
      issues.push({
        file: relativePath,
        line: lineNum,
        severity: 'CRITICA',
        type: 'MOCK_DETECTADO',
        detail: 'Import o referencia al generador ficticio eliminado fincas-generator'
      });
    }

    // D. Números de teléfono falsos conocidos (excluyendo filtros de validación y config de Firebase)
    if (/(703831064|721056835|123456789|555-555)/.test(line) && 
        !line.includes('includes') && 
        !line.includes('blacklist') && 
        !line.includes('filter') && 
        !line.includes('clean') && 
        !line.includes('FIREBASE_') &&
        !line.includes('messagingSenderId')) {
      issues.push({
        file: relativePath,
        line: lineNum,
        severity: 'CRITICA',
        type: 'TELEFONO_FALSO',
        detail: 'Teléfono ficticio de relleno detectado en código'
      });
    }
  });
});

// 2. Comprobación de TypeScript
console.log('⚡ Comprobando integridad del compilador TypeScript...');
let tscOk = false;
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  tscOk = true;
} catch (e) {
  tscOk = false;
}

console.log('\n───────────────────────────────────────────────────────────────');
console.log(`🔍 RESULTADO DE LA AUDITORÍA FORENSE:`);
console.log(`- TypeScript Compilación: ${tscOk ? '🟢 EXIT CODE 0 (Sin errores)' : '🔴 ERRORES DETECTADOS'}`);
console.log(`- Total de incidencias de código encontradas: ${issues.length}`);
console.log('───────────────────────────────────────────────────────────────\n');

if (issues.length > 0) {
  console.log('LISTADO QUIRÚRGICO DE INCIDENCIAS (PARA CLINE):');
  issues.slice(0, 15).forEach((iss, i) => {
    console.log(`${i + 1}. [${iss.severity}] ${iss.file}:${iss.line} -> ${iss.detail}`);
  });
  if (issues.length > 15) {
    console.log(`... y ${issues.length - 15} incidencias adicionales.`);
  }
} else {
  console.log('🟢 CERO DEFECTOS: No se han encontrado enlaces muertos, botones vacíos ni generadores falsos en src/.');
}

console.log('\n═══════════════════════════════════════════════════════════════');
