const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

// Destino Canónico Único
const DEST_BASE = 'H:\\incubadora despegue\\CATALOGO_DESPEGUE';

// Función para obtener TODAS las unidades lógicas montadas en Windows
function getAllDrives() {
  try {
    const stdout = execSync('wmic logicaldisk get caption', { encoding: 'utf8' });
    const drives = stdout
      .split('\n')
      .map(line => line.trim())
      .filter(line => /^[A-Z]:$/i.test(line))
      .map(drive => drive + '\\');
    
    console.log(`🔍 Unidades de disco detectadas en el sistema: ${drives.join(', ')}`);
    return drives;
  } catch (e) {
    console.warn('⚠️ No se pudo ejecutar WMIC, recurriendo a listado por defecto (C:\\, H:\\)');
    return ['C:\\', 'H:\\'];
  }
}

// Exclusiones estrictas del sistema para no tocar el SO ni librerías
const SYSTEM_EXCLUSIONS = [
  'Windows', 'Program Files', 'Program Files (x86)', 'AppData', 
  '$Recycle.Bin', 'System Volume Information', 'node_modules', '.git', 
  '.next', 'dist', 'CATALOGO_DESPEGUE', 'Recovery'
];

// Extensiones permitidas para auditoría
const TARGET_EXTENSIONS = ['.json', '.mp4', '.mp3', '.pdf', '.docx', '.md', '.txt', '.excalidraw', '.canvas'];

// Matriz de Reconocimiento Semántico (Taxonomía Despegue / Velocity)
const TAXONOMY_RULES = [
  { category: '01_SERIES', sub: 'Los_Ganadores', pattern: /los[\s_.-]*ganadores/i },
  { category: '01_SERIES', sub: 'Pensar_Dos_Veces', pattern: /pensar[\s_.-]*dos[\s_.-]*veces/i },
  { category: '01_SERIES', sub: 'Ideas_Transformadoras', pattern: /ideas[\s_.-]*transformadoras/i },
  { category: '01_SERIES', sub: 'El_Club_10X', pattern: /club[\s_.-]*10x/i },
  { category: '01_SERIES', sub: 'La_Nueva_Productividad', pattern: /nueva[\s_.-]*productividad/i },
  { category: '01_SERIES', sub: 'La_Maquina_de_las_Ideas', pattern: /maquina[\s_.-]*de[\s_.-]*las[\s_.-]*ideas/i },
  { category: '01_SERIES', sub: 'El_Mentalista', pattern: /el[\s_.-]*mentalista/i },
  { category: '01_SERIES', sub: 'Clases_de_Crecimiento', pattern: /alexandra|clases[\s_.-]*de[\s_.-]*crecimiento/i },
  { category: '01_SERIES', sub: 'El_Estratega', pattern: /el[\s_.-]*estratega/i },

  { category: '02_PODCASTS', sub: 'Accelerate', pattern: /accelerate/i },
  { category: '02_PODCASTS', sub: 'Sobredemanda', pattern: /sobredemanda/i },
  { category: '02_PODCASTS', sub: 'Lo_Tactico', pattern: /lo[\s_.-]*tactico/i },
  { category: '02_PODCASTS', sub: 'La_Venta_Elegante', pattern: /venta[\s_.-]*elegante/i },
  { category: '02_PODCASTS', sub: 'Secretos_del_Mentalista', pattern: /secretos[\s_.-]*del[\s_.-]*mentalista/i },
  { category: '02_PODCASTS', sub: 'Disparos', pattern: /disparos/i },
  { category: '02_PODCASTS', sub: 'Los_Sabios', pattern: /los[\s_.-]*sabios/i },
  { category: '02_PODCASTS', sub: 'El_Libro_Negro', pattern: /libro[\s_.-]*negro/i },
  { category: '02_PODCASTS', sub: 'Bestseller', pattern: /bestseller/i },

  { category: '03_CURSOS', sub: 'Midas', pattern: /midas/i },
  { category: '03_CURSOS', sub: 'Copywriting', pattern: /copywriting|abc[\s_.-]*del[\s_.-]*copywriting/i },
  { category: '03_CURSOS', sub: 'Oportunidades_Rapidas', pattern: /oportunidades[\s_.-]*rapidas/i },
  { category: '03_CURSOS', sub: 'Negocio_Infoproducto', pattern: /infoproducto/i },
  { category: '03_CURSOS', sub: 'Facebook_Ads', pattern: /facebook[\s_.-]*ads|meta[\s_.-]*ads/i },
  { category: '03_CURSOS', sub: 'Funnels', pattern: /funnels|evergreen/i },
  { category: '03_CURSOS', sub: 'Sprint_IA', pattern: /sprint[\s_.-]*ia/i },

  { category: '04_CORTOS', sub: 'La_Jugada', pattern: /la[\s_.-]*jugada/i },

  { category: '05_WORKSHOPS', sub: 'Marketing_de_Atencion', pattern: /marketing[\s_.-]*de[\s_.-]*atencion/i },
  { category: '05_WORKSHOPS', sub: 'Comunicacion_Disruptiva', pattern: /comunicacion[\s_.-]*disruptiva/i },
  { category: '05_WORKSHOPS', sub: 'Copywriting_IA', pattern: /copywriting[\s_.-]*\+[\s_.-]*ia/i },
  { category: '05_WORKSHOPS', sub: 'Propuesta_de_Valor', pattern: /propuesta[\s_.-]*de[\s_.-]*valor/i }
];

const knownHashes = new Set();

function getFileHash(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(buffer).digest('hex');
  } catch (e) {
    return null;
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function movePurist(src, dest) {
  try {
    fs.renameSync(src, dest);
  } catch (err) {
    if (err.code === 'EXDEV') {
      fs.copyFileSync(src, dest);
      fs.unlinkSync(src);
    } else {
      throw err;
    }
  }
}

function runGlobalScan() {
  console.log('🏛️ INICIANDO BARRIDO GLOBAL MULTI-UNIDAD (BIG DATA PURISTA)...');
  const drives = getAllDrives();
  
  let movedFiles = 0;
  let duplicatesPurged = 0;

  function traverse(currentDir) {
    let entries = [];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch (e) {
      return; // Permisos denegados o unidad no accesible
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (!SYSTEM_EXCLUSIONS.includes(entry.name) && !fullPath.includes('CATALOGO_DESPEGUE')) {
          traverse(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (TARGET_EXTENSIONS.includes(ext)) {
          
          for (const rule of TAXONOMY_RULES) {
            if (rule.pattern.test(entry.name)) {
              const hash = getFileHash(fullPath);
              const targetFolder = path.join(DEST_BASE, rule.category, rule.sub);
              const targetPath = path.join(targetFolder, entry.name);

              ensureDir(targetFolder);

              if (fullPath === targetPath) break; // Ya posicionado correctamente

              if (hash && knownHashes.has(hash)) {
                try {
                  fs.unlinkSync(fullPath);
                  duplicatesPurged++;
                  console.log(`[🗑️ DUPLICADO ELIMINADO]: ${fullPath}`);
                } catch (e) {}
              } else {
                if (hash) knownHashes.add(hash);
                
                if (fs.existsSync(targetPath)) {
                  try {
                    fs.unlinkSync(fullPath);
                    duplicatesPurged++;
                    console.log(`[🗑️ CONFLICTO RESUELTO]: ${fullPath}`);
                  } catch (e) {}
                } else {
                  movePurist(fullPath, targetPath);
                  movedFiles++;
                  console.log(`[📦 DESPLAZADO -> ${rule.category}/${rule.sub}]: ${entry.name}`);
                }
              }
              break; 
            }
          }

        }
      }
    }
  }

  drives.forEach(drive => {
    if (fs.existsSync(drive)) {
      console.log(`\n📂 Escaneando unidad: ${drive}`);
      traverse(drive);
    }
  });

  console.log('\n==================================================');
  console.log(`✅ BARRIDO GLOBAL Y CONSOLIDACIÓN COMPLETADA`);
  console.log(`📦 Archivos únicos consolidados en H:: ${movedFiles}`);
  console.log(`🗑️ Copias duplicadas purgadas: ${duplicatesPurged}`);
  console.log('==================================================');
}

runGlobalScan();