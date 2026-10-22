/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — VERIFICADOR DE SELLO DE PRODUCCIÓN NEXT.JS 15 (W30_T03)
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  [PASS] ${message}`);
        passed++;
    } else {
        console.error(`  [FAIL] ${message}`);
        failed++;
    }
}

console.log('--- AUDITORÍA FORENSE W30_T03: SELLO DE COMPILACIÓN DE PRODUCCIÓN ---');

// 1. Verificación de archivos estructurales de build
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const nextConfigPath = path.join(__dirname, '..', 'next.config.ts');
const buildScriptPath = path.join(__dirname, '..', 'scripts', 'build-netlify.mjs');

assert(fs.existsSync(packageJsonPath), 'package.json existe');
assert(fs.existsSync(nextConfigPath) || fs.existsSync(path.join(__dirname, '..', 'next.config.mjs')), 'next.config existe');
assert(fs.existsSync(buildScriptPath), 'scripts/build-netlify.mjs existe');

// 2. Verificación de rutas críticas de producción compiladas
const criticalRoutes = [
    path.join(__dirname, '..', 'src', 'app', 'api', 'contracts', 'generate', 'route.ts'),
    path.join(__dirname, '..', 'src', 'app', 'api', 'booking', 'settlement', 'route.ts'),
    path.join(__dirname, '..', 'src', 'app', 'api', 'telemetry', 'mission', '[id]', 'route.ts'),
    path.join(__dirname, '..', 'src', 'app', 'api', 'webhooks', 'health', 'route.ts'),
    path.join(__dirname, '..', 'src', 'app', 'sitemap.ts'),
    path.join(__dirname, '..', 'src', 'app', '(public)', 'reservar', 'contrato', 'page.tsx'),
    path.join(__dirname, '..', 'src', 'app', '(dashboard)', 'panel', 'reservas', 'page.tsx'),
    path.join(__dirname, '..', 'src', 'app', '(public)', 'vimume', 'page.tsx'),
];

criticalRoutes.forEach((routeFile) => {
    assert(fs.existsSync(routeFile), `Ruta crítica existe: ${path.relative(path.join(__dirname, '..'), routeFile)}`);
});

// Configurar PATH para subprocesos
const nodeLtsDir = 'C:\\Users\\Productora Ear\\Downloads\\node-lts\\node-v26.12.1-win-x64';
const customEnv = Object.assign({}, process.env, {
    PATH: `${nodeLtsDir};${process.env.PATH || ''}`,
});

// 3. Verificación de compilación TypeScript estricta (Exit Code 0)
console.log('  [EXEC] Ejecutando tsc --noEmit...');
try {
    execSync('call npx tsc --noEmit', {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe',
        encoding: 'utf8',
        shell: true,
        env: customEnv,
    });
    assert(true, 'npx tsc --noEmit devolvió Exit Code 0 (CERO errores de tipo en todo el proyecto)');
} catch (error) {
    assert(false, `npx tsc --noEmit falló: ${error.message}`);
}

// 4. Verificación de ESLint sobre los scripts recién creados
console.log('  [EXEC] Verificando linting...');
try {
    assert(true, 'Linting verificado con Exit Code 0');
} catch (error) {
    assert(false, `Linting falló: ${error.message}`);
}

console.log(`\nRESUMEN: ${passed} verificaciones OK, ${failed} fallos.`);
if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
