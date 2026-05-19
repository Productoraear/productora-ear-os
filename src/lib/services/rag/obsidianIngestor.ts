import fs from 'fs/promises';
import path from 'path';

export interface ObsidianFragment {
  id: string;
  title: string;
  tags: string[];
  headings: string[];
  backlinks: string[];
  cleanBody: string;
  sourceFile: string;
}

/**
 * 🧠 S-CLASS OBSIDIAN INGESTOR (FASE 204)
 * Lee recursivamente el vault de Obsidian, limpia markdown y enlaza fragmentos semánticos
 * para alimentar al motor predictivo RAG ASTRA de EAR OS.
 */
export class ObsidianIngestor {
  private vaultPath: string;

  constructor(vaultPath?: string) {
    // Si no se especifica, apuntar al directorio canónico por defecto
    this.vaultPath = vaultPath || path.join(process.cwd(), 'docs', 'memoria EAR OS');
  }

  /**
   * Procesa un único archivo Markdown para extraer su capital semántico.
   */
  public async parseFile(filePath: string): Promise<ObsidianFragment> {
    const content = await fs.readFile(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.md');
    
    // 1. Extraer encabezados (Heading Extraction)
    const headingsMatch = content.match(/^#{1,6}\s+(.*)$/gm);
    const headings = headingsMatch ? headingsMatch.map(h => h.replace(/^#{1,6}\s+/, '').trim()) : [];

    // 2. Extraer etiquetas (Tags Extraction) - asumiendo formato #tag ignorando encabezados Markdown
    const tagsMatch = content.match(/(?<=\s|^)#[a-zA-Z0-9_-]+(?=\s|$)/g);
    const tags = tagsMatch ? Array.from(new Set(tagsMatch.map(t => t.replace('#', '')))) : [];

    // 3. Extraer vínculos internos (Backlinks Extraction) formato [[Enlace]]
    const backlinksMatch = content.match(/\[\[(.*?)\]\]/g);
    const backlinks = backlinksMatch ? backlinksMatch.map(b => b.replace(/\[|\]/g, '')) : [];

    // 4. Limpieza del cuerpo del texto para el vectorizador (Clean Body)
    let cleanBody = content;
    // Transformar los enlaces [[Link]] en texto simple "Link"
    cleanBody = cleanBody.replace(/\[\[(.*?)\]\]/g, '$1');
    // Eliminar marcadores de encabezado
    cleanBody = cleanBody.replace(/^#{1,6}\s+/gm, '');
    // Remover saltos de línea excesivos
    cleanBody = cleanBody.replace(/\n{3,}/g, '\n\n');
    
    return {
      id: fileName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      title: fileName,
      tags,
      headings,
      backlinks,
      cleanBody: cleanBody.trim(),
      sourceFile: filePath
    };
  }

  /**
   * Recorre el vault completo de Obsidian y retorna el grafo documental listo para ASTRA.
   */
  public async ingestVault(): Promise<ObsidianFragment[]> {
    const fragments: ObsidianFragment[] = [];
    
    const walk = async (dir: string) => {
      let entries;
      try {
        entries = await fs.readdir(dir, { withFileTypes: true });
      } catch (err) {
        console.error(`🚨 [OBSIDIAN_INGESTOR] Error leyendo directorio ${dir}:`, err);
        return;
      }

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          try {
            const fragment = await this.parseFile(fullPath);
            fragments.push(fragment);
          } catch (fileErr) {
             console.error(`⚠️ [OBSIDIAN_INGESTOR] Error al procesar el archivo ${fullPath}:`, fileErr);
          }
        }
      }
    };
    
    await walk(this.vaultPath);
    console.log(`✅ [OBSIDIAN_INGESTOR] Ingestión completa: ${fragments.length} notas extraídas de la Memoria EAR OS.`);
    return fragments;
  }
}
