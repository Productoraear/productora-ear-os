const fs = require('fs');
const path = require('path');

const TARGET_DIR = 'H:\\incubadora despegue\\TRANSCRIPCIONES_WHISPER';
const OUTPUT_FILE = path.join(TARGET_DIR, 'rag_whisper_index.json');

function main() {
  if (!fs.existsSync(TARGET_DIR)) {
    console.error(`Directorio no encontrado: ${TARGET_DIR}`);
    return;
  }

  const files = fs.readdirSync(TARGET_DIR);
  const validTranscriptions = [];

  files.forEach((file) => {
    if (!file.endsWith('.json')) return;

    const filePath = path.join(TARGET_DIR, file);
    try {
      const stats = fs.statSync(filePath);
      if (stats.size < 10) return;

      const content = fs.readFileSync(filePath, 'utf-8').trim();

      if (content.startsWith('<!DOCTYPE') || content.startsWith('<') || content.startsWith('PNG') || content.includes('<!html')) {
        return;
      }

      if (!content.startsWith('{') && !content.startsWith('[')) {
        return;
      }

      const parsed = JSON.parse(content);

      if (parsed && (parsed.text || parsed.segments || parsed.results || Array.isArray(parsed))) {
        validTranscriptions.push({
          fileName: file,
          filePath: filePath,
          createdTime: stats.birthtime,
          modifiedTime: stats.mtime,
          sizeBytes: stats.size,
          textSample: typeof parsed.text === 'string' ? parsed.text.substring(0, 200) : ''
        });
      }
    } catch (err) {
      // Ignorar errores silenciosamente
    }
  });

  validTranscriptions.sort((a, b) => new Date(a.modifiedTime) - new Date(b.modifiedTime));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(validTranscriptions, null, 2), 'utf-8');
  console.log(`✅ Indexación completada: ${validTranscriptions.length} transcripciones legítimas guardadas en ${OUTPUT_FILE}`);
}

main();