/**
 * ════════════════════════════════════════════════════════════════════════════
 * OMEGA · GENERADOR AUTÓNOMO DE WAVE: "CLIENTES POTENCIALES × PRODUCTO"
 * ════════════════════════════════════════════════════════════════════════════
 * Produce 200 microtareas ULTRA-PEQUEÑAS (1 archivo real por tarea) para que el
 * obrero local (Qwen 3.8 27B, 100k ctx, GPU 24GB VRAM) valide el MVP de
 * captación/compra de forma autónoma, SIN intervención del CEO.
 *
 * DOCTRINA APLICADA (AGENTS.md + PACTO_MVP_DOMINANCIA.md):
 *  - CERO FACHADAS: cada tarea apunta a un archivo REAL verificado con fs.existsSync.
 *  - ZONA CERO protegida: jamás se emite una tarea sobre SSOT o Sentinel.
 *  - Cada microtarea = 1 segmento de CLIENTE × 1 PRODUCTO × 1 OPERACIÓN.
 *  - Validador único: `npx tsc --noEmit` -> Exit Code 0.
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_ROOT = path.join(ROOT, 'src', 'app', '(public)');
const QUEUE_FILE = path.join(__dirname, 'tasks_queue.json');

// ─── PROTECCIÓN ZONA CERO (jamás emitir tareas sobre estos archivos) ──────────
const ZONA_CERO = new Set([
    'src/lib/constants/ear-os-ssot.ts',
    'src/lib/security/ssotIntegrityGuard.ts',
    'src/lib/availability/atomicDateLockEngine.ts',
    'src/lib/vimume/b2g-tender-engine.ts',
    'src/lib/astra/astra-conversation-engine.ts',
]);

const TOTAL_TASKS = 200;

// ════════════════════════════════════════════════════════════════════════════
// 1. CLIENTES POTENCIALES (segmentos que COMPRAN)
// ════════════════════════════════════════════════════════════════════════════
const CLIENTES = [
    { key: 'novios', nombre: 'Novios / Bodas', slashes: ['bodas', 'mariachis', 'dj-para-bodas', 'artistas'], dolor: 'Miedo a que el directo no esté a la altura y a cancelaciones de última hora.', gancho: 'Depósito 100 € deducible con bloqueo atómico de fecha/hora.' },
    { key: 'fincas', nombre: 'Fincas / Venues B2B', slashes: ['fincas', 'proveedores'], dolor: 'Quejas vecinales por ruido y no poder recomendar un artista fiable.', gancho: 'Rider acústico Ley 37/2003 resuelto a cambio de recomendación preferente.' },
    { key: 'b2g', nombre: 'Ayuntamientos / B2G', slashes: ['b2g', 'ayuntamientos', 'instituciones'], dolor: 'Riesgo de reparo por superar el límite de contrato menor.', gancho: 'Techo preventivo 14.250 € (Art. 118 LCSP) con dossier FACe.' },
    { key: 'empresas', nombre: 'Empresas / Corporativo', slashes: ['empresarios', 'eventos', 'infraestructura'], dolor: 'Eventos de marca sin garantía técnica ni factura impecable.', gancho: 'Rider homologado + split 80/10/10 con liquidación verificable.' },
    { key: 'vimume', nombre: 'Residencias / VIMUME', slashes: ['vimume'], dolor: 'Desescalada de psicofármacos y agitación en mayores sin coste social.', gancho: 'Protocolo 40 Hz Gamma, deducción Ley 49/2002 (SROI 4.85x).' },
    { key: 'alquiler', nombre: 'Alquiler equipos / DJ', slashes: ['alquiler', 'alquiler-equipos-sonido-audiovisuales', 'alquiler-pantallas-led-madrid', 'rider-tecnico'], dolor: 'Sonorización insuficiente y técnica que falla en directo.', gancho: '12 W/pax calculados por aforo real + técnico in situ.' },
    { key: 'catering', nombre: 'Catering / Arroces', slashes: ['catering-brasas', 'arroces'], dolor: 'Menú sin música en vivo coordinada y tiempos desincronizados.', gancho: 'Pack gastronomía + directo calibrado por contexto.' },
    { key: 'artistas', nombre: 'Artistas / Talento', slashes: ['artistas', 'academia', 'marketplace'], dolor: 'No tener formato vendible ni base de fans propia.', gancho: 'Embudo Captado→Cerrado con 80% para el artista ejecutor.' },
    { key: 'afiliados', nombre: 'Afiliados / Prescriptores', slashes: ['afiliados', 'afiliado', 'alianzas'], dolor: 'Prescribir sin trazabilidad ni comisión clara.', gancho: 'Ledger de comisión trazable sobre split 80/10/10.' },
    { key: 'proveedores', nombre: 'Proveedores / Marketplace', slashes: ['proveedores', 'reclamar-perfil', 'proveedores-servicios'], dolor: 'Ficha fantasma sin teléfono verificado que no vende.', gancho: 'Doctrina del dato verificado: verified:true solo con teléfono real.' },
    { key: 'estrategia', nombre: 'Consultoría / Soberanía', slashes: ['dominancia', 'soberania-tecnica', 'oraculo', 'the-signal'], dolor: 'Estrategia sin motores reales detrás.', gancho: 'Matriz de trazabilidad botón→endpoint→motor→escritura.' },
    { key: 'social', nombre: 'Eventos / Ocasiones sociales', slashes: ['ocasiones', 'eventos', 'social', 'comparar'], dolor: 'Comparar opciones sin precio transparente.', gancho: 'Calculadora pública 350 € + 1,50 €/km desde km 50.' },
];

// ════════════════════════════════════════════════════════════════════════════
// 2. PRODUCTOS / SERVICIOS / PAQUETES (precio = SSOT canónico)
// ════════════════════════════════════════════════════════════════════════════
const PRODUCTOS = [
    { id: 'solista-edwin-agudelo', nombre: 'Show Solista Premium (Edwin Agudelo)', precio: 350, tipo: 'SERVICIO' },
    { id: 'grupo-6-mariachi', nombre: 'Agrupación Mariachi (6 músicos)', precio: 600, tipo: 'PAQUETE' },
    { id: 'grupo-9-mariachi-pro', nombre: 'Agrupación Profesional (9 músicos)', precio: 900, tipo: 'PAQUETE' },
    { id: 'grupo-13-mariachi-premium', nombre: 'Gran Ensamble Monumental (13)', precio: 1300, tipo: 'PAQUETE' },
    { id: 'sinfonico-royal', nombre: 'Gran Concierto S-Class Royal', precio: 1800, tipo: 'PAQUETE' },
    { id: 'octeto-magistral', nombre: 'Octeto Magistral de Gran Gala', precio: 2400, tipo: 'PAQUETE' },
    { id: 'banda-monumental', nombre: 'Banda Monumental (16)', precio: 4500, tipo: 'PAQUETE' },
    { id: 'boda-diamond', nombre: 'Boda S-Class Diamond 360', precio: 3800, tipo: 'PAQUETE' },
    { id: 'pack-lounge-20m2', nombre: 'Pack Acústico Lounge (15-35 m²)', precio: 190, tipo: 'PRODUCTO' },
    { id: 'pack-gala-100m2', nombre: 'Pack Gala VIP (80-150 m²)', precio: 420, tipo: 'PRODUCTO' },
    { id: 'pack-festival-500m2', nombre: 'Pack Concierto & Festival (300-800 m²)', precio: 980, tipo: 'PRODUCTO' },
    { id: 'light-dj-beam7r', nombre: 'Cabezas Móviles Beam 7R DMX', precio: 140, tipo: 'PRODUCTO' },
    { id: 'light-dj-laser-geyser', nombre: 'Show Láser RGB 3W + Geyser', precio: 160, tipo: 'PRODUCTO' },
    { id: 'light-festoon-vintage', nombre: 'Guirnaldas Festoon 50m', precio: 110, tipo: 'PRODUCTO' },
    { id: 'light-uplighting-wireless', nombre: 'Kit 8 Focos Uplighting Batería', precio: 175, tipo: 'PRODUCTO' },
    { id: 'vimume-40hz', nombre: 'Programa Neuroacústico VIMUME 40 Hz', precio: 350, tipo: 'SERVICIO' },
    { id: 'vip-deposit-100', nombre: 'Blindaje VIP (Depósito Price-Lock)', precio: 100, tipo: 'COMPROMISO' },
];

// ════════════════════════════════════════════════════════════════════════════
// 3. OPERACIONES DE CONVERSIÓN (microtareas atómicas de captación)
// ════════════════════════════════════════════════════════════════════════════
const OPERACIONES = [
    { key: 'CTA_COMPRA', titulo: 'CTA de compra real', action: 'Asegurar que el CTA principal enlaza a la ruta real de cierre (checkout/depósito) y NO a un ancla vacía. El enlace debe apuntar a /checkout o /reservar o wa.me segun el flujo real existente.', done_when: 'Existe un <a> o <Link> con href de cierre real (no "#") y texto con verbo de valor.' },
    { key: 'OFFER_SCHEMA', titulo: 'JSON-LD Offer con precio SSOT', action: 'Añadir/verificar bloque JSON-LD tipo Offer/Product con price=precio del producto (SSOT) y priceCurrency EUR, sin valores hardcodeados ajenos al SSOT.', done_when: 'JSON-LD presente con price igual al precio SSOT del producto.' },
    { key: 'SEO_BUY_INTENT', titulo: 'Metadata de intención de compra', action: 'Ajustar title/description (Metadata) para reflejar intención transaccional del cliente potencial (contratar, reservar, precio) sin copy vacio.', done_when: 'title/description contienen verbo de contratacion y dato real (precio/ciudad).' },
    { key: 'A11Y_CTA', titulo: 'Accesibilidad del CTA', action: 'Añadir aria-label descriptivo y foco visible al CTA principal; usar <button> o <Link> semantico.', done_when: 'El CTA tiene aria-label y es alcanzable por teclado.' },
    { key: 'MICRO_UX', titulo: 'Micro-interaccion OLED', action: 'Aplicar hover expansivo y transicion sedosa (transition-all duration-300 ease-out) al bloque de oferta; mantener fondo OLED (#030305/#050507) y acento oro #ecb613.', done_when: 'Las clases incluyen transition-all duration-300 ease-out y hover state.' },
    { key: 'WHATSAPP_REAL', titulo: 'Enlace WhatsApp/telefono real', action: 'Exponer enlace de contacto directo (wa.me/34693693048) solo en rutas comerciales de cliente; nunca exponer telefono placeholder como verificado.', done_when: 'El enlace de contacto usa el numero real de centralita y no un placeholder.' },
    { key: 'PRECIO_VISIBLE', titulo: 'Precio transparente visible', action: 'Mostrar el precio del producto de forma explicita (no "consultar") usando el valor del SSOT.', done_when: 'El precio aparece como numero en EUR coherente con SSOT.' },
    { key: 'TRUST_PROOF', titulo: 'Prueba de confianza', action: 'Insertar un dato verificable (rider 12 W/pax, techo LCSP, split 80/10/10, telefono real) como prueba de confianza del cliente potencial.', done_when: 'Aparece al menos una prueba dura verificable en el bloque.' },
];

// ════════════════════════════════════════════════════════════════════════════
// 4. DESCUBRIMIENTO DE ARCHIVOS REALES (verificación dura, cero fachadas)
// ════════════════════════════════════════════════════════════════════════════
function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir)) {
        const full = path.join(dir, entry);
        let st;
        try { st = fs.statSync(full); } catch { continue; }
        if (st.isDirectory()) walk(full, out);
        else out.push(full);
    }
    return out;
}

function toRel(full) {
    return path.relative(ROOT, full).replace(/\\/g, '/');
}

function discoverPublicPages() {
    const all = walk(PUBLIC_ROOT);
    return all
        .map(toRel)
        .filter((rel) => /(page|LandingPage)\.(tsx|ts)$/.test(rel))
        .filter((rel) => !ZONA_CERO.has(rel));
}

function pickFileForClient(cliente, pages, attempt) {
    const matches = pages.filter((rel) => {
        const slugPart = rel.replace('src/app/(public)/', '');
        return cliente.slashes.some((s) => slugPart.startsWith(`${s}/`) || slugPart === `${s}/page.tsx`);
    });
    const pool = matches.length > 0 ? matches : pages;
    if (pool.length === 0) return null;
    return pool[attempt % pool.length];
}

// ════════════════════════════════════════════════════════════════════════════
// 5. CONSTRUCCIÓN DE LA COLA (200 microtareas equilibradas)
// ════════════════════════════════════════════════════════════════════════════
function build() {
    const pages = discoverPublicPages();
    if (pages.length === 0) {
        console.error('[OMEGA-GEN] ERROR: no se han descubierto páginas públicas reales. Abortado.');
        process.exit(1);
    }

    const tasks = [];
    let seq = 0;
    let blocked = 0;

    outer:
    for (let round = 0; round < 100; round++) {
        for (let c = 0; c < CLIENTES.length; c++) {
            const cliente = CLIENTES[c];
            const producto = PRODUCTOS[(round * CLIENTES.length + c) % PRODUCTOS.length];
            const operacion = OPERACIONES[(round + c) % OPERACIONES.length];
            const file = pickFileForClient(cliente, pages, round + c);

            if (!file || !fs.existsSync(path.join(ROOT, file)) || ZONA_CERO.has(file)) {
                blocked++;
                continue;
            }

            seq++;
            const id = `MVP-${String(seq).padStart(3, '0')}`;
            tasks.push({
                id,
                wave: Math.min(10, Math.ceil(seq / 20)),
                status: 'QUEUED',
                cliente: cliente.nombre,
                cliente_key: cliente.key,
                producto: producto.nombre,
                producto_id: producto.id,
                producto_precio_eur: producto.precio,
                tipo_operacion: operacion.key,
                title: `[${cliente.nombre}] ${operacion.titulo} · ${producto.nombre}`,
                action:
                    `${operacion.action} ` +
                    `Contexto cliente: "${cliente.dolor}" -> propuesta "${cliente.gancho}". ` +
                    `Producto objetivo: ${producto.nombre} (${producto.precio} €, id=${producto.id}). ` +
                    `Usa SOLO valores del SSOT canonico src/lib/constants/ear-os-ssot.ts.`,
                files: [file],
                scaffold:
                    `1) Lee el archivo ${file}. ` +
                    `2) Localiza el bloque del cliente potencial "${cliente.nombre}". ` +
                    `3) Aplica la operacion ${operacion.key}: ${operacion.titulo}. ` +
                    `4) No toques la Zona Cero. No introduzcas importes distintos al SSOT.`,
                done_when: operacion.done_when,
                validate: 'npx tsc --noEmit',
            });

            if (tasks.length >= TOTAL_TASKS) break outer;
        }
    }

    const queue = {
        _meta: {
            version: '9.0-OMEGA-CLIENTES-POTENCIALES',
            doctrine: 'CAPTACION Y COMPRA AUTONOMA: 200 microtareas Cliente Potencial x Producto/Servicio/Paquete x Operacion de conversion. Cada tarea apunta a un archivo REAL verificado. Cero fachadas. Zona Cero intacta.',
            generado: new Date().toISOString(),
            total_tasks: tasks.length,
            bloqueadas_por_zona_cero_o_inexistencia: blocked,
            clientes: CLIENTES.length,
            productos: PRODUCTOS.length,
            operaciones: OPERACIONES.length,
        },
        _instructions_for_cline: '1) node .antigravity/omega.js next  2) Lee SOLO .antigravity/MISSION_ACTIVE.json  3) Ejecuta action+scaffold   4) node .antigravity/omega.js complete <ID>  5) DETENTE. PROHIBIDO git commit/push. MODO DAEMON: ejecutar "node .antigravity/omega_autonomous_daemon.js" para bucle autonomo con Ollama local.',
        tasks,
    };

    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
    console.log(`[OMEGA-GEN] Cola generada: ${tasks.length} microtareas (objetivo ${TOTAL_TASKS}).`);
    console.log(`[OMEGA-GEN] Archivos publicos reales detectados: ${pages.length}. Bloqueadas: ${blocked}.`);
    const byWave = tasks.reduce((m, t) => ((m[t.wave] = (m[t.wave] || 0) + 1), m), {});
    console.log('[OMEGA-GEN] Distribucion por wave:', JSON.stringify(byWave));
}

build();
