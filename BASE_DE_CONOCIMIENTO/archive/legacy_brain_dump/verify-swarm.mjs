import fs from 'fs';

/**
 * 🕵️‍♂️ S-CLASS SWARM VERIFIER (ZERO-DEPENDENCY VERSION)
 * EAR OS V2 GOLD - PRODUCTORAEAR.COM
 */

const TARGET_SITEMAP = 'https://productoraear.com/sitemap.xml';
const CONCURRENCY_LIMIT = 20;
const BATCH_DELAY = 500; // ms
const TIMEOUT = 20000; // Aumentamos a 20s por si el SSR está lento

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function verifySwarm() {
    console.log('🚀 Iniciando Auditoría Forense v2 (Protocolo de Calentamiento)...');
    
    let urls = [];

    try {
        // Intentamos obtener el sitemap real de producción vía fetch nativo
        const response = await fetch(TARGET_SITEMAP);
        const xml = await response.text();
        
        // Regex para extraer URLs del XML sin dependencias
        const matches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
        for (const match of matches) {
            urls.push(match[1]);
        }
        
        if (urls.length < 100) throw new Error('Sitemap incompleto o en propagación.');
        console.log(`✅ ADN detectado en Producción: ${urls.length} URLs encontradas.`);
    } catch (error) {
        console.log(`⚠️ Sitemap Online no disponible o incompleto (${error.message}). Usando ADN local...`);
        
        const PROVINCIAS = [
            "alava", "albacete", "alicante", "almeria", "asturias", "avila", "badajoz", "baleares", 
            "barcelona", "burgos", "caceres", "cadiz", "cantabria", "castellon", "ciudad-real", 
            "cordoba", "cuenca", "gerona", "granada", "guadalajara", "guipuzcoa", "huelva", "huesca", 
            "jaen", "leon", "lerida", "lugo", "madrid", "malaga", "murcia", "navarra", "orense", 
            "palencia", "las-palmas", "pontevedra", "la-rioja", "salamanca", "segovia", "sevilla", 
            "soria", "tarragona", "santa-cruz-de-tenerife", "teruel", "toledo", "valencia", 
            "valladolid", "vizcaya", "zamora", "zaragoza", "ceuta", "melilla"
        ];
        
        const SERVICIOS_SLUGS = ["sonorizacion-eventos", "iluminacion-espectacular", "produccion-audiovisual", "dj-premium", "configurador-bespoke"];

        // 1. Core
        urls.push('https://productoraear.com/');
        urls.push('https://productoraear.com/centro-mando');
        urls.push('https://productoraear.com/admin/configurador');

        // 2. Provincias
        PROVINCIAS.forEach(p => {
            urls.push(`https://productoraear.com/${p}`);
            
            // 3. Servicios x Provincia
            SERVICIOS_SLUGS.forEach(s => {
                urls.push(`https://productoraear.com/${p}/${s}`);
            });
        });

        // 4. Arsenal Táctico
        try {
            const rawData = fs.readFileSync('./public/data/urls_sitemap.json', 'utf8');
            const jsonData = JSON.parse(rawData);
            jsonData.forEach(url => {
                const relativeUrl = url.replace(/https?:\/\/(www\.)?productoraear\.com/, '');
                const cleanUrl = `https://productoraear.com${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
                if (!urls.includes(cleanUrl)) urls.push(cleanUrl);
            });
        } catch (e) {
            console.log("⚠️ No se pudo cargar el arsenal táctico local.");
        }

        console.log(`✅ ADN local reconstruido: ${urls.length} URLs preparadas.`);
    }

    const report = {
        exitosas: [],
        fallidas: [],
        resumen: {
            total: urls.length,
            exito_count: 0,
            error_count: 0,
            porcentaje_exito: 0
        }
    };

    const processBatch = async (batch) => {
        return Promise.all(batch.map(async (url) => {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), TIMEOUT);

            try {
                const res = await fetch(url, { 
                    method: 'HEAD',
                    signal: controller.signal,
                    headers: { 'User-Agent': 'EAR-OS-Omega-Bot/1.0' }
                });
                
                clearTimeout(id);
                
                if (res.status === 200) {
                    report.exitosas.push(url);
                    report.resumen.exito_count++;
                } else {
                    report.fallidas.push({ url, status: res.status });
                    report.resumen.error_count++;
                }
            } catch (err) {
                clearTimeout(id);
                report.fallidas.push({ url, status: 'TIMEOUT/ERROR', message: err.name === 'AbortError' ? 'Timeout' : err.message });
                report.resumen.error_count++;
            }
        }));
    };

    // Procesamiento por bloques con delay táctico
    for (let i = 0; i < urls.length; i += CONCURRENCY_LIMIT) {
        const batch = urls.slice(i, i + CONCURRENCY_LIMIT);
        await processBatch(batch);
        const progress = Math.round(((i + batch.length) / urls.length) * 100);
        process.stdout.write(`\r📡 Escaneando Enjambre: ${progress}% [${i + batch.length}/${urls.length}]`);
        if (i + CONCURRENCY_LIMIT < urls.length) await delay(BATCH_DELAY);
    }

    report.resumen.porcentaje_exito = ((report.resumen.exito_count / report.resumen.total) * 100).toFixed(2);

    fs.writeFileSync('./informe_auditoria_urls.json', JSON.stringify(report, null, 2));
    
    console.log('\n\n🏁 AUDITORÍA FINALIZADA');
    console.log(`📊 Total: ${report.resumen.total}`);
    console.log(`✅ Éxito (Status 200): ${report.resumen.exito_count} (${report.resumen.porcentaje_exito}%)`);
    console.log(`❌ Fallos/Inactivos: ${report.resumen.error_count}`);
    console.log('📝 Informe generado: informe_auditoria_urls.json');

    if (parseFloat(report.resumen.porcentaje_exito) >= 99.9) {
        console.log('💎 ESTADO: PERFECCIÓN MATEMÁTICA ALCANZADA. EL ENJAMBRE ESTÁ ONLINE.');
    } else {
        console.log('⚠️ ESTADO: DISCREPANCIAS DETECTADAS. ALGUNAS LANDINGS PODRÍAN ESTAR EN PROPAGACIÓN.');
    }
}

verifySwarm();
