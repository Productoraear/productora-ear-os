#!/usr/bin/env node
/**
 * MONITOR DE PROGRESO - Generación Fichas HTML Ollama
 * Monitoriza el proceso de generación en tiempo real
 */

const fs = require('fs');
const path = require('path');

function countHTMLFiles(dir) {
    let count = 0;
    try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) {
                count += countHTMLFiles(fullPath);
            } else if (item.isFile() && item.name.endsWith('.html')) {
                count++;
            }
        }
    } catch (err) {
        // Directorio no existe aún
    }
    return count;
}

function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch {
        return 0;
    }
}

function checkResumenFile() {
    const resumenPath = 'reports/RESUMEN_GENERACION_FICHAS_HTML_2026.json';
    try {
        if (fs.existsSync(resumenPath)) {
            const content = fs.readFileSync(resumenPath, 'utf-8');
            const resumen = JSON.parse(content);
            return resumen;
        }
    } catch (err) {
        console.error('Error leyendo resumen:', err.message);
    }
    return null;
}

function main() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('MONITOR DE PROGRESO - Generación Fichas HTML con Ollama');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Contar fichas generadas
    const fichasDir = 'public/fichas-proveedores';
    const totalFichas = countHTMLFiles(fichasDir);

    console.log(`📊 FICHAS HTML GENERADAS: ${totalFichas}`);

    // Verificar inventario
    const inventarioPath = 'reports/INVENTARIO_PROVEEDORES_MVP_2026.json';
    let totalProveedores = 0;
    let sinFicha = 0;

    if (fs.existsSync(inventarioPath)) {
        try {
            const inventario = JSON.parse(fs.readFileSync(inventarioPath, 'utf-8'));
            totalProveedores = inventario.estadisticas?.total || 0;
            sinFicha = inventario.estadisticas?.sin_ficha_html || 0;

            console.log(`📋 INVENTARIO TOTAL: ${totalProveedores} proveedores`);
            console.log(`⏳ PENDIENTES: ${sinFicha} sin ficha HTML`);

            if (totalProveedores > 0) {
                const progreso = ((totalFichas / totalProveedores) * 100).toFixed(2);
                console.log(`📈 PROGRESO: ${progreso}%`);
            }
        } catch (err) {
            console.error('Error leyendo inventario:', err.message);
        }
    }

    // Verificar resumen de generación
    console.log('\n───────────────────────────────────────────────────────────────');
    const resumen = checkResumenFile();
    if (resumen) {
        console.log('✅ RESUMEN DE GENERACIÓN ENCONTRADO:');
        console.log(JSON.stringify(resumen, null, 2));
    } else {
        console.log('⏳ Proceso en ejecución... (resumen aún no generado)');
    }

    // Listar últimas 10 fichas generadas
    console.log('\n───────────────────────────────────────────────────────────────');
    console.log('📄 ÚLTIMAS FICHAS GENERADAS:\n');

    const allFiles = [];
    function collectFiles(dir) {
        try {
            const items = fs.readdirSync(dir, { withFileTypes: true });
            for (const item of items) {
                const fullPath = path.join(dir, item.name);
                if (item.isDirectory()) {
                    collectFiles(fullPath);
                } else if (item.isFile() && item.name.endsWith('.html')) {
                    const stats = fs.statSync(fullPath);
                    allFiles.push({
                        path: fullPath,
                        mtime: stats.mtime,
                        size: stats.size
                    });
                }
            }
        } catch (err) {
            // Ignorar errores
        }
    }

    collectFiles(fichasDir);

    // Ordenar por fecha de modificación (más recientes primero)
    allFiles.sort((a, b) => b.mtime - a.mtime);

    const ultimas = allFiles.slice(0, 10);
    ultimas.forEach((file, idx) => {
        const sizeKB = (file.size / 1024).toFixed(2);
        const relativePath = file.path.replace(/\\/g, '/');
        console.log(`${idx + 1}. ${relativePath} (${sizeKB} KB)`);
    });

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('ESTADO: ' + (resumen ? '✅ COMPLETADO' : '⏳ EN PROGRESO'));
    console.log('═══════════════════════════════════════════════════════════════');
}

main();