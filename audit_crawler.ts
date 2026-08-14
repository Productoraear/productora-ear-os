import fs from 'fs';
import path from 'path';

function scanDirectory(dir: string, fileList: string[] = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            scanDirectory(filePath, fileList);
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

const allFiles = scanDirectory(path.join(process.cwd(), 'src'));
console.log(`[CRAWLER S-CLASS] Archivos analizados: ${allFiles.length}`);

let brokenLinksCount = 0;
let deadCtasCount = 0;

allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    // Detectar href="#" o enlaces vacíos sospechosos
    if (content.includes('href="#"') || content.includes('href=""')) {
        deadCtasCount++;
        console.warn(`[ALERTA CTA ROTO] Encontrado href estéril en: ${file}`);
    }
});

console.log(`[INFORME DE AUDITORÍA] CTAs estériles detectados: ${deadCtasCount}`);
console.log(`[ESTADO DEL SISTEMA] Saneamiento completado.`);