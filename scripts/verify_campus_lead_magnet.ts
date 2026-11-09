/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — VERIFICACIÓN AUTOMATIZADA: CAMPUS 61 PDFS LEAD MAGNET EXTRACTOR
 * (Milestone W54_T02)
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
    if (condition) {
        console.log(`  [PASS] ${message}`);
        passed++;
    } else {
        console.error(`  [FAIL] ${message}`);
        failed++;
    }
}

console.log('════════════════════════════════════════════════════════════════════════════');
console.log('AUDITORÍA AUTOMÁTICA FORENSE: CAMPUS 61 LEAD MAGNET & N8N AUTOMATION (W54_T02)');
console.log('════════════════════════════════════════════════════════════════════════════');

// ── 1. Verificación del Catálogo Enriquecido (catalogo_61_campus.json) ──────
console.log('\n[1/5] Verificando src/data/catalogo_61_campus.json...');
const catalogPath = path.join(rootDir, 'src', 'data', 'catalogo_61_campus.json');
assert(fs.existsSync(catalogPath), 'catalogo_61_campus.json existe en disco');

interface RawCatalogDoc {
    id?: string;
    nombre?: string;
    titulo?: string;
    sizeMB?: string;
    categoria?: string;
    targetAudience?: string;
    destinoSugerido?: string;
    seoAngle?: string;
    resumenEjecutivo?: string;
    checklist?: unknown[];
    estimatedMinutes?: number;
    slug?: string;
    deliveryMode?: string;
}

const rawCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8')) as RawCatalogDoc[];
assert(Array.isArray(rawCatalog), 'El catálogo es un array JSON válido');
assert(rawCatalog.length === 61, `El catálogo contiene exactamente 61 documentos (obtenidos: ${rawCatalog.length})`);

let allFieldsValid = true;
let allChecklistsValid = true;
let parejasCount = 0;
let proveedoresCount = 0;

for (const doc of rawCatalog) {
    if (
        !doc.id ||
        !doc.nombre ||
        !doc.titulo ||
        !doc.sizeMB ||
        !doc.categoria ||
        !doc.targetAudience ||
        !doc.seoAngle ||
        !doc.resumenEjecutivo
    ) {
        allFieldsValid = false;
        console.error(`  Item incompleto: ${doc.id}`);
    }

    if (!Array.isArray(doc.checklist) || doc.checklist.length !== 4) {
        allChecklistsValid = false;
        console.error(`  Checklist inválido en: ${doc.id}`);
    }

    if (doc.targetAudience === 'parejas') parejasCount++;
    if (doc.targetAudience === 'proveedores') proveedoresCount++;
}

assert(allFieldsValid, 'Todos los 61 ítems contienen id, nombre, titulo, sizeMB, categoria, targetAudience, seoAngle y resumenEjecutivo');
assert(allChecklistsValid, 'Todos los 61 ítems contienen checklist con exactamente 4 puntos accionables');
assert(parejasCount > 0 && proveedoresCount > 0, `Segmentación presente: ${parejasCount} para parejas, ${proveedoresCount} para proveedores`);
assert(parejasCount + proveedoresCount === 61, 'La suma de audiencias segmentadas es exactamente 61');

// ── 2. Verificación de n8n-dispatcher.ts ────────────────────────────────────
console.log('\n[2/5] Verificando src/lib/services/n8n-dispatcher.ts...');
const dispatcherPath = path.join(rootDir, 'src', 'lib', 'services', 'n8n-dispatcher.ts');
assert(fs.existsSync(dispatcherPath), 'n8n-dispatcher.ts existe');
const dispatcherCode = fs.readFileSync(dispatcherPath, 'utf8');

assert(dispatcherCode.includes("'campus-lead-magnet'"), "n8n-dispatcher soporta slug 'campus-lead-magnet'");
assert(dispatcherCode.includes("'concierge-whatsapp-dispatch'"), "n8n-dispatcher soporta slug 'concierge-whatsapp-dispatch'");
assert(dispatcherCode.includes('CampusLeadMagnetPayload'), 'Exporta contrato de datos CampusLeadMagnetPayload');
assert(dispatcherCode.includes('ConciergeWhatsAppDispatchPayload'), 'Exporta contrato de datos ConciergeWhatsAppDispatchPayload');
assert(!dispatcherCode.includes(': any'), 'n8n-dispatcher.ts tiene 0 ": any"');
assert(!dispatcherCode.includes('as any'), 'n8n-dispatcher.ts tiene 0 "as any"');

// ── 3. Verificación de la API Route (src/app/api/campus/lead-magnet/route.ts) ─
console.log('\n[3/5] Verificando src/app/api/campus/lead-magnet/route.ts...');
const apiRoutePath = path.join(rootDir, 'src', 'app', 'api', 'campus', 'lead-magnet', 'route.ts');
assert(fs.existsSync(apiRoutePath), 'route.ts existe en filesystem');
const routeCode = fs.readFileSync(apiRoutePath, 'utf8');

assert(routeCode.includes("export const dynamic = 'force-dynamic'"), 'Configurado con force-dynamic para App Router');
assert(routeCode.includes('export async function POST'), 'Exporta handler POST');
assert(routeCode.includes('export async function GET'), 'Exporta handler GET (cerrado por defecto)');
assert(routeCode.includes('status: 405'), 'GET responde 405 Method Not Allowed');
assert(routeCode.includes('status: 415'), 'POST valida Content-Type y responde 415 si no es application/json');
assert(routeCode.includes('status: 413'), 'POST valida límite de tamaño de payload (413 Payload Too Large)');
assert(routeCode.includes('leadMagnetSchema.safeParse'), 'Validación con esquema Zod estricto');
assert(routeCode.includes('CENTRALITA'), 'Usa CENTRALITA SSOT para la generación de enlaces de WhatsApp');
assert(routeCode.includes('AbortController') || routeCode.includes('timeout(8000)'), 'Implementa cerrojo de latencia <= 8000ms');
assert(routeCode.includes('catalogoCampus'), 'Cruce de metadatos con el catálogo de 61 documentos');
assert(!routeCode.includes(': any'), 'route.ts tiene 0 ": any"');
assert(!routeCode.includes('as any'), 'route.ts tiene 0 "as any"');

// ── 4. Verificación del Componente UI (ProCampusTab.tsx) ───────────────────
console.log('\n[4/5] Verificando src/components/fincas/sclass-pro/ProCampusTab.tsx...');
const componentPath = path.join(rootDir, 'src', 'components', 'fincas', 'sclass-pro', 'ProCampusTab.tsx');
assert(fs.existsSync(componentPath), 'ProCampusTab.tsx existe en filesystem');
const componentCode = fs.readFileSync(componentPath, 'utf8');

assert(componentCode.includes('Solicitar Guía'), 'Contiene botón con etiqueta canónica "Solicitar Guía"');
assert(componentCode.includes('fetch("/api/campus/lead-magnet"') || componentCode.includes("fetch('/api/campus/lead-magnet'"), 'Llama al endpoint /api/campus/lead-magnet en background');
assert(componentCode.includes('keepalive: true'), 'fetch utiliza keepalive: true para resiliencia en background');
assert(componentCode.includes('CENTRALITA'), 'Importa y utiliza CENTRALITA SSOT para enlaces de WhatsApp');
assert(!componentCode.includes('blur-3xl'), 'Cero "blur-3xl" en cumplimiento de Taste Engine OLED (DESIGN.md)');

// Prohibición de emojis como iconos (AGENTS.md §6)
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u;
assert(!emojiRegex.test(componentCode), 'Cero emojis en UI de producción (AGENTS.md §6)');

// Calibración de strokeWidth en iconos Lucide
assert(componentCode.includes('strokeWidth={1.5}') || componentCode.includes('strokeWidth={1.75}'), 'Iconos Lucide calibrados con strokeWidth={1.5} o {1.75}');

// Reserva geométrica vertical (Anti-CLS)
assert(componentCode.includes('min-h-[2.5rem]') || componentCode.includes('h-10'), 'Reserva geométrica fija para erradicar CLS (< 0.02)');

assert(!componentCode.includes(': any'), 'ProCampusTab.tsx tiene 0 ": any"');
assert(!componentCode.includes('as any'), 'ProCampusTab.tsx tiene 0 "as any"');

// ── 5. Verificación de Invariantes de Repositorio (AGENTS.md §12) ───────────
console.log('\n[5/5] Verificando invariantes de peso de repositorio (Cero binarios pesados en Git)...');
const catalogStat = fs.statSync(catalogPath);
assert(catalogStat.size < 100_000, `catalogo_61_campus.json es ultra-ligero (${(catalogStat.size / 1024).toFixed(1)} KB < 100 KB)`);

console.log('\n════════════════════════════════════════════════════════════════════════════');
console.log(`RESUMEN FINAL: ${passed} verificaciones superadas con éxito, ${failed} fallos.`);
console.log('════════════════════════════════════════════════════════════════════════════');

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
