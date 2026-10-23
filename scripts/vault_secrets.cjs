/**
 * ══════════════════════════════════════════════════════════════════════════════
 * EAR OS — SOVEREIGN SECRETS VAULT & ENV ORGANIZER
 * ══════════════════════════════════════════════════════════════════════════════
 * Organiza, separa y protege las variables de entorno de EAR OS:
 * 1. .env       -> Variables públicas de configuración (NEXT_PUBLIC_*, puertos, defaults)
 * 2. .env.local -> Secretos privados del servidor (Stripe, DB, API Keys, Passwords)
 * 3. .env.example -> Plantilla limpia sin valores secretos para documentación/Git
 * 4. Cifrado AES-256-GCM para respaldar secretos en vault_secrets_backup/secrets.enc
 * ══════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const ENV_PATH = path.join(ROOT_DIR, '.env');
const ENV_LOCAL_PATH = path.join(ROOT_DIR, '.env.local');
const ENV_EXAMPLE_PATH = path.join(ROOT_DIR, '.env.example');
const BACKUP_DIR = path.join(ROOT_DIR, 'vault_secrets_backup');
const ENC_FILE = path.join(BACKUP_DIR, 'secrets.enc');

// Lista de prefijos o nombres que pertenecen a variables públicas
const PUBLIC_PREFIXES = ['NEXT_PUBLIC_', 'VITE_'];
const PUBLIC_SYSTEM_KEYS = new Set([
  'PORT',
  'NODE_ENV',
  'ABACUS_BASE_URL',
  'ABACUS_MODEL',
  'NEXT_TELEMETRY_DISABLED',
]);

function isPublicKey(key) {
  if (PUBLIC_PREFIXES.some((p) => key.startsWith(p))) return true;
  if (PUBLIC_SYSTEM_KEYS.has(key)) return true;
  return false;
}

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return new Map();
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const result = new Map();

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    // Remover comillas envolventes si las tiene
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    result.set(key, val);
  }
  return result;
}

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

function backupExisting() {
  ensureBackupDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  if (fs.existsSync(ENV_PATH)) {
    fs.copyFileSync(ENV_PATH, path.join(BACKUP_DIR, `.env.backup_${timestamp}`));
  }
  if (fs.existsSync(ENV_LOCAL_PATH)) {
    fs.copyFileSync(ENV_LOCAL_PATH, path.join(BACKUP_DIR, `.env.local.backup_${timestamp}`));
  }
}

/**
 * Organiza las variables en .env y .env.local
 */
function organizeEnvs() {
  console.log('\n🔒 [EAR SECRETS VAULT] Organizando variables de entorno...');

  // 1. Crear respaldo preventivo
  backupExisting();

  // 2. Cargar todas las variables existentes
  const envMap = parseEnvFile(ENV_PATH);
  const localMap = parseEnvFile(ENV_LOCAL_PATH);
  const txtDuplicatePath = path.join(ROOT_DIR, '.env.local 2.txt');
  const txtMap = parseEnvFile(txtDuplicatePath);

  // Fusionar: localMap tiene prioridad sobre envMap; si txtMap tiene algo faltante, se añade
  const allVars = new Map();
  for (const [k, v] of envMap) allVars.set(k, v);
  for (const [k, v] of txtMap) if (!allVars.has(k) || !allVars.get(k)) allVars.set(k, v);
  for (const [k, v] of localMap) allVars.set(k, v); // .env.local manda

  const publicVars = new Map();
  const secretVars = new Map();

  for (const [k, v] of allVars) {
    if (isPublicKey(k)) {
      publicVars.set(k, v);
    } else {
      secretVars.set(k, v);
    }
  }

  // 3. Escribir .env (solo configuración pública y defaults no sensibles)
  const envContent = [
    '# ══════════════════════════════════════════════════════════════════════════════',
    '# PRODUCTORA EAR OS — CONFIGURACIÓN PÚBLICA & DEFAULTS (.env)',
    '# ⚠️ Los secretos reales (Stripe, DB, Tokens) residen en .env.local (privado)',
    '# ══════════════════════════════════════════════════════════════════════════════',
    '',
  ];
  for (const [k, v] of publicVars) {
    const quote = v.includes(' ') || v.includes('#') ? `"${v}"` : v;
    envContent.push(`${k}=${quote}`);
  }
  fs.writeFileSync(ENV_PATH, envContent.join('\n') + '\n', 'utf8');
  console.log(`✅ [OK] .env actualizado con ${publicVars.size} variables públicas.`);

  // 4. Escribir .env.local (secretos privados consolidados + réplica local)
  const localContent = [
    '# ══════════════════════════════════════════════════════════════════════════════',
    '# PRODUCTORA EAR OS — BÓVEDA LOCAL DE SECRETOS (.env.local)',
    '# 🛡️ PRIVADO & BARE-METAL — NUNCA SE SUBE A GIT NI SE EXPONE EN CLIENTE',
    '# ══════════════════════════════════════════════════════════════════════════════',
    '',
    '# ─── 1. PASARELA FINANCIERA STRIPE ───',
  ];

  const categories = {
    stripe: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'],
    db: ['DATABASE_URL', 'DIRECT_URL', 'POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING'],
    ai: ['ABACUS_API_KEY', 'GEMINI_API_KEY', 'DEEPSEEK_API_KEY'],
    auth: ['EAR_ADMIN_PASSWORD', 'EAR_EDITOR_PASSWORD'],
    crm: ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID', 'HUNTER_API_KEY', 'TRELLO_API_KEY', 'TRELLO_TOKEN', 'TRELLO_LIST_ID_INBOUND', 'MAILERLITE_API_KEY', 'MAILERLITE_GROUP_ID_LEADS'],
  };

  const written = new Set();

  function writeCategory(title, keys) {
    localContent.push('', `# ─── ${title} ───`);
    for (const key of keys) {
      if (allVars.has(key)) {
        const val = allVars.get(key);
        const quote = val.includes(' ') || val.includes('#') ? `"${val}"` : val;
        localContent.push(`${key}=${quote}`);
        written.add(key);
      }
    }
  }

  writeCategory('PASARELA FINANCIERA STRIPE (SSOT)', categories.stripe);
  writeCategory('BASE DE DATOS BARE-METAL POSTGRESQL', categories.db);
  writeCategory('MOTORES DE INTELIGENCIA ARTIFICIAL & ROUTELLM', categories.ai);
  writeCategory('CREDENCIALES DE ADMINISTRACIÓN EAR OS', categories.auth);
  writeCategory('MENSAJERÍA, TELEGRAM & CRM', categories.crm);

  // Escribir el resto de secretos
  const remaining = [];
  for (const [k, v] of allVars) {
    if (!written.has(k)) {
      const quote = v.includes(' ') || v.includes('#') ? `"${v}"` : v;
      remaining.push(`${k}=${quote}`);
    }
  }
  if (remaining.length > 0) {
    localContent.push('', '# ─── OTRAS VARIABLES & INTEGRACIONES ───', ...remaining);
  }

  fs.writeFileSync(ENV_LOCAL_PATH, localContent.join('\n') + '\n', 'utf8');
  console.log(`✅ [OK] .env.local consolidado con ${allVars.size} variables (secretos protegidos).`);

  // 5. Generar .env.example (canónico con valores redactados)
  const exampleContent = [
    '# ══════════════════════════════════════════════════════════════════════════════',
    '# PRODUCTORA EAR OS — PLANTILLA OFICIAL DE ENTORNO (.env.example)',
    '# Copia este archivo como .env.local y rellena los valores reales de tu entorno.',
    '# ══════════════════════════════════════════════════════════════════════════════',
    '',
  ];
  for (const [k] of allVars) {
    exampleContent.push(`${k}=your_${k.toLowerCase()}_here`);
  }
  fs.writeFileSync(ENV_EXAMPLE_PATH, exampleContent.join('\n') + '\n', 'utf8');
  console.log(`✅ [OK] .env.example generado para documentación segura.`);

  // 6. Eliminar archivo duplicado no estándar si existe
  if (fs.existsSync(txtDuplicatePath)) {
    fs.unlinkSync(txtDuplicatePath);
    console.log('🧹 [PURGA] Archivo residual ".env.local 2.txt" eliminado de forma segura.');
  }

  console.log('\n✨ [COMPLETADO] Estructura de secretos ordenada según el estándar S-Class.');
}

/**
 * Cifrado AES-256-GCM con PBKDF2
 */
function encryptVault(passphrase) {
  if (!fs.existsSync(ENV_LOCAL_PATH)) {
    console.error('❌ No se encontró .env.local para cifrar.');
    return;
  }
  const content = fs.readFileSync(ENV_LOCAL_PATH, 'utf8');
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const encrypted = Buffer.concat([cipher.update(content, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  const bundle = {
    version: 1,
    algorithm: 'aes-256-gcm',
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
    data: encrypted.toString('hex'),
    updatedAt: new Date().toISOString(),
  };

  ensureBackupDir();
  fs.writeFileSync(ENC_FILE, JSON.stringify(bundle, null, 2), 'utf8');
  console.log(`\n🔐 [VAULT CIFRADO] Guardado con éxito en: ${ENC_FILE}`);
}

/**
 * Descifrado AES-256-GCM
 */
function decryptVault(passphrase) {
  if (!fs.existsSync(ENC_FILE)) {
    console.error('❌ No se encontró el archivo cifrado:', ENC_FILE);
    return;
  }
  const bundle = JSON.parse(fs.readFileSync(ENC_FILE, 'utf8'));
  const salt = Buffer.from(bundle.salt, 'hex');
  const iv = Buffer.from(bundle.iv, 'hex');
  const tag = Buffer.from(bundle.tag, 'hex');
  const data = Buffer.from(bundle.data, 'hex');

  const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  try {
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
    fs.writeFileSync(ENV_LOCAL_PATH, decrypted, 'utf8');
    console.log(`\n🔓 [VAULT DESCIFRADO] .env.local restaurado con éxito desde el vault.`);
  } catch (err) {
    console.error('\n❌ [ERROR] Contraseña incorrecta o archivo cifrado alterado.');
  }
}

// CLI Dispatcher
const command = process.argv[2] || 'organize';
const pwd = process.argv[3] || 'EAR_SOVEREIGN_MASTER_KEY_2026';

switch (command) {
  case 'organize':
    organizeEnvs();
    break;
  case 'encrypt':
    encryptVault(pwd);
    break;
  case 'decrypt':
    decryptVault(pwd);
    break;
  default:
    console.log('Comandos disponibles: organize | encrypt <password> | decrypt <password>');
}
