// scripts/fitur_swarm_simulator.ts
import puppeteer from 'puppeteer';

const TARGET_URL = 'http://localhost:3008';

const fiturSimulations = [
    { title: "Pabellón Institucional Madrid - FITUR 2027", type: "B2G", amount: "2800€", query: "Sonorización lineal Bose F1 y pantallas LED para pabellón institucional de Madrid en FITUR" },
    { title: "Showcase Artístico Principal - Stand Toledo", type: "B2B", amount: "1250€", query: "Rider técnico Shure Beta 87A y consola Behringer XR18 para actuaciones en vivo" },
    { title: "Acústica y Sonorización Sala VIP Expositores", type: "B2B", amount: "750€", query: "Sistemas Bose S1 Pro y subwoofers FBT para zona VIP de expositores" },
    { title: "Gira Tecnológica y Social VIMUME - 5 Centros", type: "B2G", amount: "4500€", query: "Protocolo de musicoterapia y fondos europeos para residencias de mayores" }
];

async function runVisualYoloAlpha() {
    console.log("🚀 [YOLO ALFA VISUAL] Iniciando despliegue de navegador autónomo para FITUR 2027...");

    // Lanzamos Puppeteer en modo visible (headless: false) con ventana ampliada
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized', '--disable-infobars']
    });

    const page = await browser.newPage();

    try {
        console.log(`🌐 Navegando a la infraestructura central: ${TARGET_URL}`);
        await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 2000));

        for (let i = 0; i < fiturSimulations.length; i++) {
            const sim = fiturSimulations[i];
            console.log(`\n--- [Iteración Visual #${i + 1}] Procesando contrato: ${sim.title} ---`);

            // 1. Simular apertura del OmniSearchModal con atajo de teclado (Ctrl+K)
            console.log("⌨️ Activando Buscador Neural (Ctrl+K)...");
            await page.keyboard.down('Control');
            await page.keyboard.press('KeyK');
            await page.keyboard.up('Control');
            await new Promise(r => setTimeout(r, 1000));

            // 2. Escribir la consulta compleja en el input del Oráculo
            console.log(`💬 Inyectando consulta: "${sim.query}"`);
            await page.keyboard.type(sim.query, { delay: 35 });
            await new Promise(r => setTimeout(r, 1500));
            await page.keyboard.press('Enter');

            // Esperar respuesta de la inferencia local R1/Qwen
            console.log("🧠 Esperando respuesta del Oráculo Soberano...");
            await new Promise(r => setTimeout(r, 4000));

            // 3. Disparar Petición Simultánea al Backend (Enjambre de Proveedores)
            console.log("⚡ Disparando pre-contrato logístico a la API de pagos/contratos...");
            const apiRes = await page.evaluate(async (payload) => {
                const res = await fetch('/api/contracts/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        projectName: payload.title,
                        clientType: payload.type,
                        items: [payload.query],
                        totalPrice: parseInt(payload.amount),
                        location: "Madrid/Toledo",
                        timestamp: new Date().toISOString()
                    })
                });
                return res.json();
            }, sim);

            console.log(`✅ [ENJAMBRE ACTIVADO] Contrato asegurado:`, apiRes);

            // 4. Navegar a una página clave de interlinking neural para evaluar UI
            if (i % 2 === 0) {
                console.log("🗺️ Navegando dinámicamente a /cotizador...");
                await page.goto(`${TARGET_URL}/cotizador`, { waitUntil: 'networkidle2' });
            } else {
                console.log("🏛️ Navegando dinámicamente al perfil de Edwin Agudelo...");
                await page.goto(`${TARGET_URL}/artistas/edwin-agudelo`, { waitUntil: 'networkidle2' });
            }

            await new Promise(r => setTimeout(r, 2500));
        }

        console.log("\n🎯 [YOLO ALFA COMPLETE] Bucle visual y de enjambre completado con éxito absoluto.");

    } catch (error) {
        console.error("❌ [ERROR EN BUCLE VISUAL]:", error);
    } finally {
        // Mantenemos el navegador abierto 10 segundos adicionales para inspección visual final
        console.log("⏳ Manteniendo entorno activo para inspección visual...");
        await new Promise(r => setTimeout(r, 10000));
        await browser.close();
    }
}

runVisualYoloAlpha();