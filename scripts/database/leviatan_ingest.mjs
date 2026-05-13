import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

/**
 * 🌊 MOTOR LEVIATÁN - EJECUCIÓN OMEGA
 * Inyector masivo de perfiles B2B para EAR-OS GOLD.
 * Optimizado para procesamiento local de alta velocidad.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

console.log(`📡 Conectando a: ${SUPABASE_URL}`);
console.log(`🔑 Key detectada: ${SUPABASE_KEY ? (SUPABASE_KEY.substring(0, 10) + '...') : 'NO HALLADA'}`);

if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_KEY.includes('REMPLAZAR')) {
  console.error('❌ ERROR: Credenciales de Supabase no detectadas o inválidas.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ARSENAL_PATH = 'D:/01_VERTICAL_EVENTOS/BODAS/PROVEEDORES/arsenal_proveedores_bodas.json';
const BATCH_SIZE = 100;

async function executeLeviatan() {
  console.log('\n--- 🚀 IGNICIÓN INICIADA: MOTOR LEVIATÁN V2 ---');

  // 🔍 Verificación de Tabla y Conexión
  console.log('🔍 Verificando conexión con ear_market_vendors...');
  const { error: checkError } = await supabase.from('ear_market_vendors').select('*', { count: 'exact', head: true });
  if (checkError) {
    console.error(`❌ ERROR DE CONEXIÓN: ${checkError.message}`);
    return;
  }
  console.log('✅ Tabla confirmada. Iniciando flujo de datos...\n');

  console.log(`📂 Ruta de Datos: ${ARSENAL_PATH}`);
  
  if (!fs.existsSync(ARSENAL_PATH)) {
    console.error(`❌ ERROR CRÍTICO: Arsenal no hallado en la ruta especificada.`);
    return;
  }

  // Lectura instantánea (Optimizado para hardware de alto rendimiento)
  console.log('⚡ Procesando JSON de 23MB...');
  const startTime = Date.now();
  const rawData = fs.readFileSync(ARSENAL_PATH, 'utf8');
  const vendors = JSON.parse(rawData);
  const total = vendors.length;
  const totalBatches = Math.ceil(total / BATCH_SIZE);

  console.log(`📊 Arsenal cargado: ${total} perfiles detectados en ${(Date.now() - startTime)}ms.`);
  console.log(`📦 Configuración: ${totalBatches} lotes de ${BATCH_SIZE} registros.\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const currentBatch = Math.floor(i / BATCH_SIZE) + 1;
    const chunk = vendors.slice(i, i + BATCH_SIZE);
    
    const batchTag = `[BATCH ${currentBatch.toString().padStart(2, '0')}/${totalBatches}]`;
    process.stdout.write(`${batchTag} Inyectando ${chunk.length} perfiles... `);

    // Mapeo S-Class (Refinado)
    const payload = chunk.map(v => ({
      name: v.nombre || v.name || 'Proveedor Alpha',
      category: v.categoria || v.category || 'Event Services',
      location: v.ubicacion || v.location || 'Spain',
      description: v.descripcion || `Proveedor asimilado por Leviatán. Rating: ${v.rating || 'N/A'}`,
      is_claimed: false,
      metadata: {
        original_data: v,
        source: 'ARSENAL_BODAS_NET',
        ingested_at: new Date().toISOString()
      }
    }));

    const { error } = await supabase.from('ear_market_vendors').insert(payload);

    if (error) {
      console.log('❌ ERROR');
      console.error(`   ⚠️ Detalle: ${error.message}`);
      errorCount += chunk.length;
    } else {
      console.log('✅ OK');
      successCount += chunk.length;
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n--- 💎 MISIÓN CUMPLIDA ---`);
  console.log(`✅ Confirmados: ${successCount}`);
  console.log(`❌ Fallidos: ${errorCount}`);
  console.log(`⏱️ Tiempo total: ${duration}s`);
  console.log(`🏆 LEVIATÁN HA SACIADO SU HAMBRE. SISTEMA EAR-OS OPERATIVO AL 100%.\n`);
}

executeLeviatan().catch(err => {
  console.error('\n💥 COLAPSO DEL MOTOR:', err);
  process.exit(1);
});
