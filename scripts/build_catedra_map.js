const fs = require('fs');
const path = require('path');

const CLEAN_MANIFEST = 'H:\\incubadora despegue\\TRANSCRIPCIONES_WHISPER\\global_tricatedra_manifest_clean.json';
const OUTPUT_MAP = 'C:\\EAR_OS_V2\\docs\\KNOWLEDGE_CATEDRA_MAP.md';

function buildMap() {
  console.log('🏛️ CONSTRUYENDO MAPA SEMÁNTICO KNOWLEDGE_CATEDRA_MAP.MD...');

  if (!fs.existsSync(CLEAN_MANIFEST)) {
    console.error('❌ No se encontró el manifiesto limpio.');
    return;
  }

  const manifest = JSON.parse(fs.readFileSync(CLEAN_MANIFEST, 'utf-8'));

  const despegue = manifest.filter(x => x.category === 'DESPEGUE');
  const dani = manifest.filter(x => x.category === 'DANI_ARAGON');
  const romuald = manifest.filter(x => x.category === 'ROMUALD_FONS');

  let mdContent = `# 🏛️ MAPA DE CÁTEDRAS DE INTELIGENCIA COMERCIAL (EAR OS V2)\n\n`;
  mdContent += `**Fecha de Consolidación:** ${new Date().toISOString().split('T')[0]}\n`;
  mdContent += `**Total de Activos Indexados:** ${manifest.length}\n\n`;
  mdContent += `---\n\n`;

  mdContent += `## 1. CÁTEDRA DE CONVERSIÓN & CRO (Incubadora Despegue / Velocity)\n`;
  mdContent += `**Total Activos:** ${despegue.length}\n`;
  mdContent += `**Ubicación:** \`H:\\incubadora despegue\\CATALOGO_DESPEGUE\`\n`;
  mdContent += `**Módulos Clave:** Hook Marketing, Ecuación Económica, Funnels Evergreen, CopyBranding, Midas.\n\n`;

  mdContent += `## 2. CÁTEDRA DE MANAGEMENT & ARTISTAS (Dani Aragón)\n`;
  mdContent += `**Total Activos:** ${dani.length}\n`;
  mdContent += `**Ubicación:** \`H:\\incubadora despegue\\DANI_ARAGON_FORMACION\`\n`;
  mdContent += `**Módulos Clave:** Management Musical, Monetización Independiente, Desarrollo Artístico, Técnica Vocal.\n\n`;

  mdContent += `## 3. CÁTEDRA DE SEO & TRÁFICO ORGÁNICO (Romuald Fons / BIGSEO)\n`;
  mdContent += `**Total Activos:** ${romuald.length}\n`;
  mdContent += `**Ubicación:** \`H:\\ROMUALD_FONS_BIGSEO\`\n`;
  mdContent += `**Módulos Clave:** SEO Orbital, TSA, YouTube SEO, Keywords Transaccionales, Interlinking.\n\n`;

  const docsDir = path.dirname(OUTPUT_MAP);
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

  fs.writeFileSync(OUTPUT_MAP, mdContent, 'utf-8');

  console.log(`\n==================================================`);
  console.log(`✅ MAPA SEMÁNTICO GENERADO CON ÉXITO`);
  console.log(`📄 Guardado en: ${OUTPUT_MAP}`);
  console.log(`==================================================`);
}

buildMap();
