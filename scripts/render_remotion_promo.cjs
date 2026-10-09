const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Helper para parsear argumentos CLI
const args = process.argv.slice(2);
let propsJson = '{}';
let propsFilePath = null;
let outDir = path.join(os.homedir(), 'Desktop');
let filename = `EAR_OS_RENDER_${Date.now()}.mp4`;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--props' && args[i + 1]) {
    propsJson = args[i + 1];
    i++;
  } else if (args[i] === '--propsFile' && args[i + 1]) {
    propsFilePath = args[i + 1];
    i++;
  } else if (args[i] === '--outDir' && args[i + 1]) {
    outDir = args[i + 1];
    i++;
  } else if (args[i] === '--filename' && args[i + 1]) {
    filename = args[i + 1];
    i++;
  }
}

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const outPath = path.join(outDir, filename.endsWith('.mp4') ? filename : `${filename}.mp4`);
let effectivePropsPath = propsFilePath;
let isTempProps = false;

if (!effectivePropsPath || !fs.existsSync(effectivePropsPath)) {
  effectivePropsPath = path.join(os.tmpdir(), `remotion_props_${Date.now()}.json`);
  fs.writeFileSync(effectivePropsPath, propsJson, 'utf-8');
  isTempProps = true;
}

try {
  const normalizedPropsPath = effectivePropsPath.replace(/\\/g, '/');
  const normalizedOutPath = outPath.replace(/\\/g, '/');
  const rootPath = path.join(process.cwd(), 'src', 'remotion', 'Root.tsx').replace(/\\/g, '/');

  console.log(`[REMOTION_DISPATCH] Renderizando composición EarOsPromo hacia ${normalizedOutPath}...`);
  const cmd = `npx remotion render "${rootPath}" EarOsPromo "${normalizedOutPath}" --props="${normalizedPropsPath}" --gl=angle`;

  console.log(`[REMOTION_EXEC] ${cmd}`);
  execSync(cmd, { encoding: 'utf-8', stdio: 'inherit' });

  console.log(`[REMOTION_SUCCESS] Master exportado exitosamente en: ${normalizedOutPath}`);
  process.exit(0);
} catch (err) {
  console.error(`[REMOTION_FATAL] Error en renderizado:`, err.message);
  process.exit(1);
} finally {
  if (isTempProps && fs.existsSync(effectivePropsPath)) {
    try { fs.unlinkSync(effectivePropsPath); } catch (_) {}
  }
}
