
import * as fs from 'fs';
import * as path from 'path';

export class EVEUrlParser {
  private filePath = process.env.EVE_URLS_DESDE_BODAS || 'h:/01_VERTICAL_EVENTOS/BODAS/RECURSOS/EVE_URLS_DESDE_BODAS.txt';

  public async loadFromLocal() {
    const resolvedPath = path.resolve(this.filePath);
    
    if (!fs.existsSync(resolvedPath)) {
      console.error(`🔍 Archivo no encontrado en: ${resolvedPath}`);
      return [];
    }

    try {
      const rawData = fs.readFileSync(resolvedPath, 'utf-8');
      const lines = rawData.split('\n').filter(line => line.trim());

      // Estructura de ejemplo (ajusta según tu formato real)
      const events = lines.map((line, index) => {
        return {
          id: `EVE-${index + 1}`,
          source: line.trim(),
          timestamp: Date.now() - (index * 60000), // Simulación temporal
          status: 'pending' as const
        };
      });

      console.log(`✅ Cargados ${events.length} eventos desde EVE_URLS_DESDE_BODAS.txt`);
      return events;
    } catch (error) {
      console.error('Error al leer el archivo EVE:', error);
      return [];
    }
  }
}
