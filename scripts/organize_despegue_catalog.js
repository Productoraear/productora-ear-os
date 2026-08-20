const fs = require('fs');
const path = require('path');

// Unidades y rutas de origen a escanear
const SEARCH_PATHS = ['C:\\EAR_OS_V2', 'C:\\', 'H:\\'];
const DEST_BASE = 'H:\\incubadora despegue\\CATALOGO_DESPEGUE';

// Estructura del Catálogo Velocity Media / Despegue
const CATALOG_STRUCTURE = {
  '01_SERIES': [
    { folder: 'Los_Ganadores', pattern: /los[\s_.-]*ganadores/i },
    { folder: 'Pensar_Dos_Veces', pattern: /pensar[\s_.-]*dos[\s_.-]*veces/i },
    { folder: 'Ideas_Transformadoras', pattern: /ideas[\s_.-]*transformadoras/i },
    { folder: 'El_Club_10X', pattern: /club[\s_.-]*10x/i },
    { folder: 'La_Nueva_Productividad', pattern: /nueva[\s_.-]*productividad/i },
    { folder: 'La_Maquina_de_las_Ideas', pattern: /maquina[\s_.-]*de[\s_.-]*las[\s_.-]*ideas/i },
    { folder: 'El_Mentalista', pattern: /el[\s_.-]*mentalista/i },
    { folder: 'Clases_de_Crecimiento_con_Alexandra', pattern: /alexandra/i },
    { folder: 'El_Estratega', pattern: /el[\s_.-]*estratega/i }
  ],
  '02_PODCASTS': [
    { folder: 'Accelerate', pattern: /accelerate/i },
    { folder: 'Sobredemanda', pattern: /sobredemanda/i },
    { folder: 'Lo_Tactico', pattern: /lo[\s_.-]*tactico/i },
    { folder: 'La_Venta_Elegante', pattern: /venta[\s_.-]*elegante/i },
    { folder: 'Secretos_del_Mentalista', pattern: /secretos[\s_.-]*del[\s_.-]*mentalista/i },
    { folder: 'Disparos', pattern: /disparos/i },
    { folder: 'Los_Sabios', pattern: /los[\s_.-]*sabios/i },
    { folder: 'El_Libro_Negro', pattern: /libro[\s_.-]*negro/i },
    { folder: 'Bestseller', pattern: /bestseller/i }
  ],
  '03_CURSOS': [
    { folder: 'Midas', pattern: /midas/i },
    { folder: 'Copywriting', pattern: /copywriting/i },
    { folder: 'Oportunidades_Rapidas', pattern: /oportunidades[\s_.-]*rapidas/i },
    { folder: 'Negocio_Infoproducto', pattern: /infoproducto/i },
    { folder: 'Facebook_Ads', pattern: /facebook[\s_.-]*ads|meta[\s_.-]*ads/i },
    { folder: 'Funnels', pattern: /funnels/i },
    { folder: 'Sprint_IA', pattern: /sprint[\s_.-]*ia/i }
  ],
  '04_CORTOS': [
    { folder: 'La_Jugada', pattern: /la[\s_.-]*jugada/i }
  ],
  '05_WORKSHOPS': [
    { folder: 'Marketing_de_Atencion', pattern: /marketing[\s_.-]*de[\s_.-]*atencion/i },
    { folder: 'Comunicacion_Disruptiva', pattern: /comunicacion[\s_.-]*disruptiva/i },
    { folder: 'Copywriting_IA', pattern: /copywriting[\s_.-]*\+[\s_.-]*ia/i },
    { folder: 'Propuesta_de_Valor_Irresistible', pattern: /propuesta[\s_.-]*de[\s_.-]*valor/i }
  ]
};

// Directorios totalmente ignorados por seguridad
const IGNORE_DIRS = [
  'node_modules', '.git', '$Recycle.Bin', 'AppData', 'Windows', 
  'Program Files', 'Program Files (x86)', '.next', 'dist', 'CATALOGO_DESPEGUE'
];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Función purista para mover archivos cruzando discos si es necesario
function moveFilePurist(source, target) {
  try {
    // Intentar renombrado atómico (mismo disco)
    fs.renameSync(source, target);
  } catch (err) {
    if (err.code === 'EXDEV') {
      // Si está en unidades distintas (C: a H:), copiar y eliminar origen
      fs.copyFileSync(source, target);
      fs.unlinkSync(source);
    } else {
      throw err;
    }
  }
}

function scanAndMove() {
  console.log('📦 Iniciando migración por desplazamiento (Purista)...');

  // Crear directorios base
  Object.keys(CATALOG_STRUCTURE).forEach(category => {
    CATALOG_STRUCTURE[category].forEach(item => {
      ensureDir(path.join(DEST_BASE, category, item.folder));
    });
  });

  let movedCount = 0;
  const report = [];

  function walk(dir) {
    let files = [];
    try {
      files = fs.readdirSync(dir);
    } catch (e) {
      return;
    }

    files.forEach(file => {
      const fullPath = path.join(dir, file);
      try {
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          const folderName = path.basename(fullPath);
          if (!IGNORE_DIRS.includes(folderName) && !fullPath.includes('CATALOGO_DESPEGUE')) {
            walk(fullPath);
          }
        } else if (stats.isFile()) {
          const ext = path.extname(file).toLowerCase();
          if (['.json', '.mp4', '.mp3', '.pdf', '.docx', '.md', '.txt'].includes(ext)) {
            
            Object.keys(CATALOG_STRUCTURE).forEach(category => {
              CATALOG_STRUCTURE[category].forEach(item => {
                if (item.pattern.test(file)) {
                  const targetFolder = path.join(DEST_BASE, category, item.folder);
                  const targetFile = path.join(targetFolder, file);

                  // Evitar mover si ya está en su destino exacto
                  if (fullPath === targetFile) return;

                  if (fs.existsSync(targetFile)) {
                    // Si ya existe en destino, eliminar el duplicado disperso
                    fs.unlinkSync(fullPath);
                    console.log(`[🗑️ Duplicado Eliminado]: ${file} (ya en destino)`);
                  } else {
                    moveFilePurist(fullPath, targetFile);
                    movedCount++;
                    report.push({ file, category, folder: item.folder, previousLocation: fullPath });
                    console.log(`[📦 MOVIDO [${category}/${item.folder}]]: ${file}`);
                  }
                }
              });
            });

          }
        }
      } catch (e) {
        // Ignorar errores de acceso
      }
    });
  }

  SEARCH_PATHS.forEach(p => {
    if (fs.existsSync(p)) walk(p);
  });

  const reportPath = path.join(DEST_BASE, 'reporte_migracion_purista.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`\n✅ Migración purista completada. Total de activos consolidados en H:: ${movedCount}`);
  console.log(`📄 Registro de migración guardado en: ${reportPath}`);
}

scanAndMove();