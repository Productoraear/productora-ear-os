import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/firebase-admin';
/**
 * 🛰️ EAR OS SYSTEM SCANNER & CLOUD SYNC [VIMUME RAG]
 * Lee H: y F: y guarda el CONTENIDO en Firestore para el SaaS 24/7.
 * ROBUSTEZ: Añadido manejo de errores para archivos inexistentes.
 */
const SCAN_TARGETS = [
    'H:/ear-gold',
    'H:/02_ECOSISTEMA_EAR',
    'F:/'
];
export const dynamic = 'force-dynamic';
export async function GET() {
    try {
        const knowledgeSummary = [];
        let syncedCount = 0;
        for (const targetPath of SCAN_TARGETS) {
            if (fs.existsSync(targetPath)) {
                const files = scanDirectory(targetPath);
                for (const fileName of files.slice(0, 30)) {
                    const fullPath = path.join(targetPath, fileName);
                    try {
                        // Verificamos que el archivo existe y es legible antes de abrirlo
                        if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isFile()) {
                            const content = fs.readFileSync(fullPath, 'utf8').substring(0, 5000);
                            const fileRef = db.collection('knowledge_inventory').doc(fileName.replace(/[/\\?%*:|"<>]/g, '_'));
                            await fileRef.set({
                                fileName,
                                lastSynced: new Date().toISOString(),
                                disk: targetPath.split(':')[0],
                                fullPath: fullPath,
                                content: content,
                                status: 'active'
                            }, { merge: true });
                            syncedCount++;
                        }
                    }
                    catch (fileErr) {
                        console.warn(`[SCANNER] Error leyendo ${fullPath}:`, fileErr);
                    }
                }
                knowledgeSummary.push({
                    disk: targetPath.split(':')[0],
                    totalFiles: files.length,
                    syncedNow: Math.min(files.length, 30)
                });
            }
        }
        return NextResponse.json({
            status: 'success',
            cloudSync: 'completed',
            syncedCount,
            knowledge: knowledgeSummary
        });
    }
    catch (error) {
        console.error('CRITICAL Scan Error:', error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
/**
 * Función recursiva para detectar archivos de conocimiento (.md, .txt)
 */
function scanDirectory(dir, depth = 0) {
    if (depth > 2)
        return [];
    let results = [];
    try {
        const list = fs.readdirSync(dir);
        for (const file of list) {
            const fullPath = path.join(dir, file);
            try {
                const stat = fs.lstatSync(fullPath);
                if (stat && stat.isDirectory()) {
                    if (!['node_modules', '.git', '.next', 'dist', 'node_modules'].includes(file)) {
                        results = results.concat(scanDirectory(fullPath, depth + 1));
                    }
                }
                else if (stat.isFile()) {
                    if (file.match(/\.(md|txt)$/)) {
                        results.push(file);
                    }
                }
            }
            catch (statErr) { }
        }
    }
    catch (e) { }
    return results;
}
