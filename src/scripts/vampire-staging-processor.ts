import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface VampirizedDocument {
  sourceFile: string;
  sha256: string;
  category: 'GOVERNANCE_ARCHITECTURE' | 'EMPRESAS_B2B' | 'ARTISTAS_TALENT' | 'INSTITUCIONES_B2G';
  title: string;
  vampirizedAt: string;
  totalLines: number;
  cleanLinesCount: number;
  sections: Array<{ title: string; content: string[] }>;
  contentBlocks: string[];
}

const stagingDir: string = path.join(process.cwd(), 'src', 'data', 'staging');

const VAULT_ROUTING: Record<string, string> = {
  GOVERNANCE_ARCHITECTURE: path.join(process.cwd(), 'src', 'data', 'governance', 'strategic_vault'),
  EMPRESAS_B2B: path.join(process.cwd(), 'src', 'data', 'empresas_vault'),
  ARTISTAS_TALENT: path.join(process.cwd(), 'src', 'data', 'artistas_vault'),
  INSTITUCIONES_B2G: path.join(process.cwd(), 'src', 'data', 'instituciones_vault'),
};

function computeSha256(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

function classifyCategory(fileName: string, content: string): VampirizedDocument['category'] {
  const name = fileName.toLowerCase();
  const text = `${fileName} ${content}`.toLowerCase();

  // 1. Directivas de Gobernanza, Arquitectura y Prompts Maestros
  if (
    name.includes('gemini') ||
    name.includes('instrucciones') ||
    name.includes('arquitectura') ||
    name.includes('auditoría') ||
    name.includes('auditoria') ||
    name.includes('protocolo') ||
    name.includes('pensamiento') ||
    name.includes('estrategia') ||
    name.includes('procede') ||
    name.includes('ia local') ||
    name.includes('artistas empresariales')
  ) {
    return 'GOVERNANCE_ARCHITECTURE';
  }

  // 2. Instituciones y Contratación B2G
  if (text.includes('ayuntamiento') || text.includes('pliego') || text.includes('art. 118') || text.includes('lcsp') || text.includes('b2g') || text.includes('festejos')) {
    return 'INSTITUCIONES_B2G';
  }

  // 3. Empresas, Fincas Partner, Wedding Planners
  if (text.includes('finca') || text.includes('proveedor') || text.includes('catering') || text.includes('bodas.net')) {
    return 'EMPRESAS_B2B';
  }

  // 4. Artistas, Repertorio, Rider y Talento
  if (text.includes('repertorio') || text.includes('solista') || text.includes('edwin agudelo') || text.includes('rider') || text.includes('boleros') || text.includes('rancheras')) {
    return 'ARTISTAS_TALENT';
  }

  return 'GOVERNANCE_ARCHITECTURE';
}

function parseMarkdownSections(lines: string[]): { title: string; sections: Array<{ title: string; content: string[] }> } {
  let docTitle = 'Documento Sin Título';
  const sections: Array<{ title: string; content: string[] }> = [];
  let currentSectionTitle = 'General';
  let currentSectionContent: string[] = [];

  for (const line of lines) {
    if (line.startsWith('# ') && docTitle === 'Documento Sin Título') {
      docTitle = line.replace(/^#\s+/, '').trim();
      continue;
    }

    if (line.startsWith('## ') || line.startsWith('### ')) {
      if (currentSectionContent.length > 0) {
        sections.push({ title: currentSectionTitle, content: [...currentSectionContent] });
        currentSectionContent = [];
      }
      currentSectionTitle = line.replace(/^#+\s+/, '').trim();
    } else {
      currentSectionContent.push(line);
    }
  }

  if (currentSectionContent.length > 0) {
    sections.push({ title: currentSectionTitle, content: currentSectionContent });
  }

  return { title: docTitle, sections };
}

export function processMarkdownStaging(): VampirizedDocument[] {
  if (!fs.existsSync(stagingDir)) {
    console.log('>> [ERROR] El directorio staging no existe:', stagingDir);
    return [];
  }

  const files: string[] = fs.readdirSync(stagingDir).filter((file: string) => file.endsWith('.md'));
  console.log(`>> [VAMPIRE STAGING S-CLASS] Procesando ${files.length} ficheros Markdown...`);

  const processedDocs: VampirizedDocument[] = [];

  for (const file of files) {
    const filePath: string = path.join(stagingDir, file);
    const rawContent: string = fs.readFileSync(filePath, 'utf-8');
    const sha256 = computeSha256(rawContent);

    const rawLines = rawContent.split(/\r?\n/);
    const cleanedLines = rawLines
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0 && !line.startsWith('---'));

    const category = classifyCategory(file, rawContent);
    const targetDir = VAULT_ROUTING[category];

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const { title, sections } = parseMarkdownSections(cleanedLines);

    const structuredData: VampirizedDocument = {
      sourceFile: file,
      sha256,
      category,
      title: title !== 'Documento Sin Título' ? title : path.parse(file).name,
      vampirizedAt: new Date().toISOString(),
      totalLines: rawLines.length,
      cleanLinesCount: cleanedLines.length,
      sections,
      contentBlocks: cleanedLines,
    };

    const outputFilename = `${path.parse(file).name}_vampirized.json`;
    const outputPath = path.join(targetDir, outputFilename);

    fs.writeFileSync(outputPath, JSON.stringify(structuredData, null, 2), 'utf-8');
    processedDocs.push(structuredData);

    console.log(`>> [SUCCESS] [${category}] ${outputFilename} -> Guardado en ${path.relative(process.cwd(), targetDir)} (SHA: ${sha256.slice(0, 8)})`);
  }

  console.log(`>> [COMPLETADO] ${processedDocs.length} documentos procesados con éxito.`);
  return processedDocs;
}

if (require.main === module) {
  processMarkdownStaging();
}