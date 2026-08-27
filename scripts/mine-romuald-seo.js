const fs = require('fs');
const path = require('path');

const targetDir = 'H:\\ROMUALD_FONS_BIGSEO';
let foundFiles = [];
let seoTermsMap = {};
let detailedMatches = [];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  try {
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          if (!file.includes('node_modules') && !file.includes('.git')) {
            scanDir(filePath);
          }
        } else if (
          file.endsWith('.txt') || 
          file.endsWith('.json') || 
          file.endsWith('.md') || 
          file.endsWith('.csv') ||
          file.endsWith('.vtt') ||
          file.endsWith('.srt') ||
          file.endsWith('.html') ||
          file.endsWith('.js') ||
          file.endsWith('.ts')
        ) {
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const matches = content.match(/\b\w*seo\w*\b/gi);
            if (matches && matches.length > 0) {
              foundFiles.push(filePath);
              matches.forEach(term => {
                const cleanTerm = term.toUpperCase();
                seoTermsMap[cleanTerm] = (seoTermsMap[cleanTerm] || 0) + 1;
              });
              
              if (detailedMatches.length < 50) {
                detailedMatches.push({
                  file: path.basename(filePath),
                  path: filePath,
                  matchCount: matches.length,
                  sampleMatches: Array.from(new Set(matches.map(m => m.toLowerCase()))).slice(0, 8)
                });
              }
            }
          } catch (e) {
            // Ignore unreadable files
          }
        }
      } catch (e) {
        // Ignore stat errors
      }
    });
  } catch (e) {
    // Ignore readdir errors
  }
}

console.log('Iniciando escaneo forense de términos *SEO* en:', targetDir);
scanDir(targetDir);

// Sort detected terms by frequency
const sortedTerms = Object.entries(seoTermsMap)
  .sort(([, a], [, b]) => b - a)
  .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

const report = {
  timestamp: new Date().toISOString(),
  targetDirectory: targetDir,
  totalFilesScannedWithSEO: foundFiles.length,
  topTermsCount: Object.keys(sortedTerms).length,
  detectedTermsFrequency: sortedTerms,
  detailedMatchesSample: detailedMatches,
  allFilesList: foundFiles
};

const outputDir = path.join(__dirname, 'reports');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'romuald-seo-mined.json');
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
console.log(`Minería finalizada. ${foundFiles.length} archivos detectados con menciones de SEO.`);
console.log(`Resultados guardados en ${outputPath}`);
