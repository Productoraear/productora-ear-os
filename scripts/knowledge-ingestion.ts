import fs from 'fs';
import path from 'path';

/**
 * 🧠 EAR OS // AUTOMATED NEURAL RAG INGESTION SCRIPT
 * Reads all master documentation specs in docs/ and generates src/data/ear-rag-database.json
 */

export interface KnowledgeNode {
  id: string;
  sourceType: 'markdown_spec' | 'pdf' | 'html_scrape';
  title: string;
  category: string;
  content: string;
  tags: string[];
  metadata: {
    originalPath: string;
    lastUpdated: string;
    confidenceScore: number;
  };
}

export class KnowledgeIngestor {
  private memoryBank: KnowledgeNode[] = [];
  
  constructor(private readonly projectRoot: string) {}

  /**
   * Recursively scan a folder for .md files
   */
  private scanMarkdownFiles(dirPath: string): string[] {
    let results: string[] = [];
    if (!fs.existsSync(dirPath)) return results;

    const list = fs.readdirSync(dirPath);
    list.forEach(file => {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(this.scanMarkdownFiles(fullPath));
      } else if (file.endsWith('.md')) {
        results.push(fullPath);
      }
    });
    return results;
  }

  /**
   * Process all docs/ Markdown specs
   */
  async ingestDocsDirectory() {
    const docsDir = path.join(this.projectRoot, 'docs');
    console.log(`[RAG INGESTION] Scanning master specs in ${docsDir}...`);
    
    const files = this.scanMarkdownFiles(docsDir);
    let count = 0;

    for (const filePath of files) {
      const relativePath = path.relative(this.projectRoot, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      const filename = path.basename(filePath, '.md');
      const category = path.dirname(relativePath).replace(/\\/g, '/');

      // Extract title from first H1 or use filename
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : filename;

      // Split into semantic chunks by H2/H3 headings
      const chunks = content.split(/(?=^##?\s+)/m);

      chunks.forEach((chunk, index) => {
        const trimmed = chunk.trim();
        if (trimmed.length < 20) return;

        count++;
        this.memoryBank.push({
          id: `node-${filename}-${index + 1}`,
          sourceType: 'markdown_spec',
          title: `${title} (Section ${index + 1})`,
          category: category,
          content: trimmed,
          tags: [category, filename, 'spec', 'ssot'],
          metadata: {
            originalPath: relativePath,
            lastUpdated: new Date().toISOString(),
            confidenceScore: 1.0
          }
        });
      });
    }

    console.log(`[RAG INGESTION] Processed ${files.length} markdown documents into ${count} semantic knowledge chunks.`);
  }

  /**
   * Export the vectorized database to src/data/ear-rag-database.json
   */
  async exportEmbeddedDatabase() {
    const outputDir = path.join(this.projectRoot, 'src', 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const dbPath = path.join(outputDir, 'ear-rag-database.json');
    fs.writeFileSync(dbPath, JSON.stringify(this.memoryBank, null, 2));
    console.log(`✅ [RAG INGESTION SUCCESS] Knowledge database exported to ${dbPath}`);
    return dbPath;
  }
}

// Automatic CLI Execution
if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const ingestor = new KnowledgeIngestor(root);
  ingestor.ingestDocsDirectory()
    .then(() => ingestor.exportEmbeddedDatabase())
    .catch(err => {
      console.error('❌ [RAG INGESTION FAILED]', err);
      process.exit(1);
    });
}
