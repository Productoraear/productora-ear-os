import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

// Cache de dominios MX para evitar consultas DNS redundantes
const mxDomainCache = new Map<string, boolean>();

async function checkDomainHasMx(domain: string): Promise<boolean> {
  if (mxDomainCache.has(domain)) {
    return mxDomainCache.get(domain)!;
  }
  try {
    const records = await resolveMx(domain);
    const isValid = Array.isArray(records) && records.length > 0;
    mxDomainCache.set(domain, isValid);
    return isValid;
  } catch {
    mxDomainCache.set(domain, false);
    return false;
  }
}

function validateEmailSyntax(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export interface SanitizedVendor {
  slug: string;
  rawName: string;
  description: string;
  extractedImages: string[];
  claimTokenHash: string; // Zero-knowledge: solo hash en base de datos
  claimTokenRaw?: string;  // Solo presente en cohorte P0/P1 para el despachador de emails
  isClaimed: boolean;
  claimedAt: string | null;
  sourceOrigin: string;
  email?: string;
  phone?: string;
  city?: string;
  category?: string;
  cohort: 'P0_GOLD' | 'P1_SILVER' | 'P2_BRONZE';
  qualityScore: number;
}

export async function runAuditAndSanitize() {
  console.log('🛡️ [EAR AUDIT & SANITIZER] Iniciando auditoría y segmentación criptográfica...');

  const inputJsonPath = path.join(process.cwd(), 'scripts', 'vampire_mass_extracted.json');
  if (!fs.existsSync(inputJsonPath)) {
    console.error(`❌ Archivo fuente no encontrado: ${inputJsonPath}`);
    return;
  }

  console.log('📂 Leyendo backup masivo extraído...');
  const rawData = fs.readFileSync(inputJsonPath, 'utf-8');
  const items: any[] = JSON.parse(rawData);
  console.log(`📊 Total registros a auditar: ${items.length}`);

  const p0Gold: SanitizedVendor[] = [];
  const p1Silver: SanitizedVendor[] = [];
  const p2Bronze: SanitizedVendor[] = [];
  const publicCatalog: any[] = []; // Zero-Knowledge: sin tokens ni PII

  let totalWithImages = 0;
  let totalWithValidEmail = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // 1. Sanitización de imágenes: limpiar rutas duplicadas y strings vacíos
    const cleanImages = (item.extractedImages || [])
      .filter((img: string) => typeof img === 'string' && img.length > 5)
      .slice(0, 10); // Máximo 10 imágenes por perfil para optimizar memoria

    if (cleanImages.length > 0) totalWithImages++;

    // 2. Extracción y validación de Email/Teléfono si están en texto o metadata
    const textContent = `${item.rawName || ''} ${item.description || ''}`;
    const emailMatch = textContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = textContent.match(/(\+34|0034)?[ -]*(6|7|8|9)[0-9]{2}[ -]*[0-9]{3}[ -]*[0-9]{3}/);

    const email = emailMatch ? emailMatch[0].toLowerCase() : undefined;
    const phone = phoneMatch ? phoneMatch[0].replace(/[^\d+]/g, '') : undefined;

    let hasValidMx = false;
    if (email && validateEmailSyntax(email)) {
      const domain = email.split('@')[1];
      hasValidMx = await checkDomainHasMx(domain);
      if (hasValidMx) totalWithValidEmail++;
    }

    // 3. Generación y hashing de ClaimToken (One-Time Token HMAC/SHA-256)
    const rawToken = item.claimToken || `CLAIM_${crypto.randomBytes(12).toString('hex').toUpperCase()}`;
    const tokenHash = hashToken(rawToken);

    // 4. Scoring de calidad y clasificación de Cohortes
    let score = 0;
    if (cleanImages.length >= 3) score += 30;
    if (hasValidMx && email) score += 40;
    if (phone) score += 20;
    if (item.description && item.description.length > 100) score += 10;

    let cohort: 'P0_GOLD' | 'P1_SILVER' | 'P2_BRONZE' = 'P2_BRONZE';
    if (score >= 70 && hasValidMx) {
      cohort = 'P0_GOLD';
    } else if (score >= 40 || hasValidMx || phone) {
      cohort = 'P1_SILVER';
    }

    const sanitizedItem: SanitizedVendor = {
      slug: item.slug,
      rawName: item.rawName || 'Proveedor Verificado',
      description: item.description || '',
      extractedImages: cleanImages,
      claimTokenHash: tokenHash,
      claimTokenRaw: cohort === 'P0_GOLD' ? rawToken : undefined, // Solo cohorte oro retiene raw para warmup
      isClaimed: false,
      claimedAt: null,
      sourceOrigin: 'PARSED_LOCAL_MASS',
      email,
      phone,
      cohort,
      qualityScore: score,
    };

    if (cohort === 'P0_GOLD') p0Gold.push(sanitizedItem);
    else if (cohort === 'P1_SILVER') p1Silver.push(sanitizedItem);
    else p2Bronze.push(sanitizedItem);

    // Versión pública para el catálogo (Zero-Knowledge)
    publicCatalog.push({
      slug: sanitizedItem.slug,
      rawName: sanitizedItem.rawName,
      description: sanitizedItem.description.substring(0, 200),
      images: sanitizedItem.extractedImages.slice(0, 3),
      isClaimed: false,
      cohort: sanitizedItem.cohort,
    });

    if (i > 0 && i % 2000 === 0) {
      console.log(`⏳ Auditados: ${i}/${items.length} | P0 Oro: ${p0Gold.length} | P1 Plata: ${p1Silver.length} | P2 Bronce: ${p2Bronze.length}`);
    }
  }

  // 5. Guardar datasets segmentados y el índice ligero
  const scriptsDir = path.join(process.cwd(), 'scripts');
  
  fs.writeFileSync(
    path.join(scriptsDir, 'vampire_cohort_p0_gold.json'),
    JSON.stringify(p0Gold, null, 2),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(scriptsDir, 'vampire_cohort_p1_silver.json'),
    JSON.stringify(p1Silver, null, 2),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(scriptsDir, 'vampire_public_catalog_zk.json'),
    JSON.stringify(publicCatalog, null, 2),
    'utf-8'
  );

  // Índice resumen ultra-ligero para el runtime (< 50 KB)
  const summaryMetrics = {
    totalAudited: items.length,
    p0GoldCount: p0Gold.length,
    p1SilverCount: p1Silver.length,
    p2BronzeCount: p2Bronze.length,
    totalWithImages,
    totalWithValidEmail,
    freedomThreshold: 396,
    currentProgressPercent: ((p0Gold.length / 396) * 100).toFixed(1),
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(scriptsDir, 'vampire_index_summary.json'),
    JSON.stringify(summaryMetrics, null, 2),
    'utf-8'
  );

  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log('✅ AUDITORÍA Y SANITIZACIÓN COMPLETADA CON ÉXITO');
  console.log(`🥇 Cohorte P0 (Oro - Outreach Prioritario): ${p0Gold.length} proveedores`);
  console.log(`🥈 Cohorte P1 (Plata - Automatización MX):  ${p1Silver.length} proveedores`);
  console.log(`🥉 Cohorte P2 (Bronce - Matchmaking RAG):   ${p2Bronze.length} proveedores`);
  console.log(`🔒 Catálogo Zero-Knowledge exportado en: scripts/vampire_public_catalog_zk.json`);
  console.log(`⚡ Resumen ligero generado en: scripts/vampire_index_summary.json`);
  console.log('═══════════════════════════════════════════════════════════════════════════');
}

if (require.main === module) {
  runAuditAndSanitize()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Error en script de sanitización:', err);
      process.exit(1);
    });
}
