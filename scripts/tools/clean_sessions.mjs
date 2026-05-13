import fs from 'fs';
import path from 'path';

const inputPath = 'c:/EAR_OS_V2/data_vault/VIMUME_SESSIONS_EXTRACTED.json';
const outputPath = 'c:/EAR_OS_V2/data_vault/VIMUME_SESSIONS_CLEAN.json';

try {
  const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const cleanSessions = [];
  
  // La estructura actual viene en pares: origen_absoluto seguido de titulo_generado
  for (let i = 0; i < rawData.length; i += 2) {
    const originStr = rawData[i].content;
    const titleStr = rawData[i+1]?.content;

    if (originStr && titleStr) {
      // Extraer los valores usando regex o manipulación de strings simple
      const path = originStr.match(/"origen_absoluto":\s*"(.*)"/)?.[1] || originStr;
      const title = titleStr.match(/"titulo_generado":\s*"(.*)"/)?.[1] || titleStr;
      
      cleanSessions.push({
        id: Math.floor(i/2) + 1,
        title: title.replace(/\\/g, '').replace(/\.md$|\.docx$/i, ''),
        path: path.replace(/\\\\/g, '/'),
        status: 'READY',
        type: path.toLowerCase().endsWith('.docx') ? 'DOC' : 'PROTOCOL'
      });
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(cleanSessions, null, 2));
  console.log(`✅ Transformación completada: ${cleanSessions.length} sesiones procesadas.`);
} catch (error) {
  console.error('❌ Error transformando sesiones:', error);
}
