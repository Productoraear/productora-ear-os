const fs = require('fs');
const path = require('path');

const TARGET_ROOT = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\BOVEDA_ESTRATEGIA_Y_CRECIMIENTO';

const SUBFOLDERS = [
  '01_SERIES_ESTRATEGIA',
  '02_PODCASTS_AUDIO_TACTICO',
  '03_CURSOS_SPRINT',
  '04_CORTOS_Y_WORKSHOPS',
  '05_MENTORIA_ARTISTICA_SOBERANA',
  '06_TRANSCRIPCIONES_WHISPER'
];

// Ensure root and subfolders exist
if (!fs.existsSync(TARGET_ROOT)) {
  fs.mkdirSync(TARGET_ROOT, { recursive: true });
}

SUBFOLDERS.forEach(sub => {
  const p = path.join(TARGET_ROOT, sub);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
});

// Taxonomía Soberana Absorbida (Curriculum Despersonalizado - Regla 10)
const CURRICULUM_MAESTRO = {
  series: [
    { id: 'ser-01', titulo: 'Los Ganadores (Mentalidad de Atletas de Negocios)', clases: 4, duracion: '1h 9m', enfoque: 'Competir y ganar con foco implacable en el mercado de alto standing' },
    { id: 'ser-02', titulo: 'Pensar Dos Veces (Lucidez en Decisiones Críticas)', clases: 3, duracion: '48m', enfoque: 'Estrategia pausada y matemática frente al ruido y las prisas' },
    { id: 'ser-03', titulo: 'Ideas Transformadoras (Puntos de Inflexión)', clases: 4, duracion: '43m', enfoque: 'Conceptos disruptivos que parten la realidad comercial en dos' },
    { id: 'ser-04', titulo: 'El Club 10X (Multiplicación Cuántica de Resultados)', clases: 3, duracion: '1h 9m', enfoque: 'Arquitectura de escala exponencial sin incrementar costes operativos' },
    { id: 'ser-05', titulo: 'La Nueva Productividad (Trabajo de Alto Impacto)', clases: 3, duracion: '49m', enfoque: 'Eliminación del trabajo vacío y concentración en las palancas de facturación' },
    { id: 'ser-06', titulo: 'La Máquina de las Ideas (Método Creativo Sistemático)', clases: 4, duracion: '1h 14m', enfoque: 'Ingeniería de generación de propuestas irresistibles' },
    { id: 'ser-07', titulo: 'El Mentalista (Neurobranding & Psicología del Cliente)', clases: 8, duracion: '2h 6m', enfoque: 'Persuasión subconsciente, anclaje de precios de lujo y valor percibido' },
    { id: 'ser-08', titulo: 'Clases de Crecimiento con Intención', clases: 8, duracion: '1h 34m', enfoque: 'Escalar negocio y liderazgo sin perder el control ni la soberanía' },
    { id: 'ser-09', titulo: 'El Estratega (Modelos de Pensamiento de Grandes Figuras)', clases: 4, duracion: '1h 19m', enfoque: 'Tácticas de posicionamiento asimétrico en mercados saturados' }
  ],
  podcasts: [
    { id: 'pod-01', titulo: 'Accelerate (Cápsulas de Ejecución Esencial)', clases: 12, duracion: '2h 51m', enfoque: 'Acción rápida en las áreas críticas del negocio' },
    { id: 'pod-02', titulo: 'Sobredemanda (Diseño de Oferta Deseable)', clases: 9, duracion: '2h 2m', enfoque: 'Hacer que los clientes te persigan a ti en lugar de perseguir tú a los clientes' },
    { id: 'pod-03', titulo: 'Lo Táctico (Acciones de Impacto Inmediato)', clases: 29, duracion: '3h 2m', enfoque: 'Palancas prácticas para mover la facturación hoy' },
    { id: 'pod-04', titulo: 'La Venta Elegante (Conversación sin Presión)', clases: 3, duracion: '50m', enfoque: 'Venta consultiva de alto ticket basada en entender y elevar al cliente' },
    { id: 'pod-05', titulo: 'Secretos del Mentalista (Diseño Mental y Persuasión)', clases: 21, duracion: '1h 51m', enfoque: 'Neurocomunicación para eliminar fricción y objeciones de precio' },
    { id: 'pod-06', titulo: 'Disparos de Alto Calibre', clases: 34, duracion: '9h 29m', enfoque: 'Ideas directas para emprendedores que piensan en grande' },
    { id: 'pod-07', titulo: 'Los Sabios del Crecimiento', clases: 11, duracion: '2h 47m', enfoque: 'Filosofía aplicada al mundo real de los negocios y las empresas' },
    { id: 'pod-08', titulo: 'El Libro Negro (La Realidad No Contada del Marketing)', clases: 12, duracion: '2h 46m', enfoque: 'Desmontando los mitos de los portales comerciales y las agencias' },
    { id: 'pod-09', titulo: 'Bestseller (Esencia de Obras Maestras)', clases: 16, duracion: '5h 32m', enfoque: 'Destilado práctico de los mejores libros de estrategia mundial' }
  ],
  cursos: [
    { id: 'cur-01', titulo: 'Sprint Midas (Rentabilidad y Beneficio en 30 Días)', clases: 17, duracion: '1h 32m', enfoque: 'Optimización de márgenes y eliminación de costes ocultos' },
    { id: 'cur-02', titulo: 'La Venta Elegante (La Llamada de Venta Perfecta)', clases: 10, duracion: '1h 12m', enfoque: 'Estructura canónica de llamada para cerrar con depósito inmediato' },
    { id: 'cur-03', titulo: 'Copywriting Persuasivo y Captación de Atención', clases: 10, duracion: '1h 2m', enfoque: 'Textos que atrapan, comunican con nitidez y mueven a la acción' },
    { id: 'cur-04', titulo: 'Oportunidades Rápidas de Crecimiento', clases: 5, duracion: '40m', enfoque: 'Detección de vías inmediatas de facturación sin inversión previa' },
    { id: 'cur-05', titulo: 'De la A a la Z en Infoproductos y Activos Digitales', clases: 6, duracion: '1h 22m', enfoque: 'Monetización del conocimiento especializado en productos escalables' },
    { id: 'cur-06', titulo: 'Estrategias en Facebook & Meta Ads Rentables', clases: 6, duracion: '45m', enfoque: 'Campañas con retorno positivo y coste de adquisición controlado' },
    { id: 'cur-07', titulo: 'Funnels de Conversión Cuántica', clases: 16, duracion: '4h 40m', enfoque: 'Embudos de tráfico frío a reserva cerrada en piloto asistido' },
    { id: 'cur-08', titulo: 'Sprint de IA Aplicada a Negocios Reales', clases: 6, duracion: '1h 57m', enfoque: 'Automatización y orquestación con modelos locales y agentes' }
  ],
  cortos_workshops: [
    { id: 'cw-01', titulo: 'La Jugada (Estrategia Pura para la Nueva Economía)', clases: 6, duracion: '30m', enfoque: 'Movimientos maestros en tableros comerciales competitivos' },
    { id: 'cw-02', titulo: 'Metodología de Marketing de Atención', clases: 2, duracion: '1h 4m', enfoque: 'Cómo destacar en un entorno hiper-saturado de estímulos' },
    { id: 'cw-03', titulo: 'El ABC del Lanzamiento Digital', clases: 2, duracion: '3h 26m', enfoque: 'Fases críticas desde la validación hasta el pico de ventas' },
    { id: 'cw-04', titulo: 'Comunicación Disruptiva en Nichos Saturados', clases: 2, duracion: '3h 33m', enfoque: 'Generar impacto polarizante que atrae a los mejores clientes' },
    { id: 'cw-05', titulo: 'AI Copywriting Aplicado al Negocio Diario', clases: 1, duracion: '24m', enfoque: 'Uso de LLMs para redactar propuestas y secuencias de cierre' },
    { id: 'cw-06', titulo: 'Diseño de Propuesta Irresistible (Oferta Mafia)', clases: 1, duracion: '26m', enfoque: 'Ofertas donde el cliente siente que decir no sería una insensatez' }
  ]
};

// Mapeo e indexación de audios de mentoría artística (sin marcas de terceros - Regla 10)
const ARAGON_VAULT_SRC = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\01_ESTRATEGIA_Y_CHATS\\dani-aragon-vault';
const MENTORIA_TARGET = path.join(TARGET_ROOT, '05_MENTORIA_ARTISTICA_SOBERANA');

let audiosSoberanosCount = 0;
if (fs.existsSync(ARAGON_VAULT_SRC)) {
  const files = fs.readdirSync(ARAGON_VAULT_SRC);
  files.forEach(f => {
    if (f.endsWith('.ogg') || f.endsWith('.mp3') || f.endsWith('.wav')) {
      const cleanName = f.replace(/DANI_ARAGON_/gi, 'MENTORIA_CANONICA_INDUSTRIA_MUSICAL_');
      const dest = path.join(MENTORIA_TARGET, cleanName);
      if (!fs.existsSync(dest)) {
        try {
          fs.copyFileSync(path.join(ARAGON_VAULT_SRC, f), dest);
        } catch (e) {}
      }
      audiosSoberanosCount++;
    }
  });
}

// Mapeo e indexación de transcripciones de Whisper
const WHISPER_TARGET = path.join(TARGET_ROOT, '06_TRANSCRIPCIONES_WHISPER');
const WHISPER_SOURCES = [
  'H:\\EAR_INGESTION_HUB\\05_PROYECTO_VIMUME\\05_PILOTOS_Y_CASOS_USO',
  'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\04_CATEDRA_Y_AUDIO'
];

let transcripcionesCount = 0;
WHISPER_SOURCES.forEach(srcDir => {
  if (fs.existsSync(srcDir)) {
    const files = fs.readdirSync(srcDir);
    files.forEach(f => {
      if (f.toLowerCase().includes('transcription') || f.toLowerCase().includes('whisper') || f.endsWith('.json')) {
        const dest = path.join(WHISPER_TARGET, f);
        if (!fs.existsSync(dest)) {
          try {
            fs.copyFileSync(path.join(srcDir, f), dest);
          } catch (e) {}
        }
        transcripcionesCount++;
      }
    });
  }
});

// Generar índice maestro
const indiceMaestro = {
  version: '2.0.0',
  fecha_consolidacion: new Date().toISOString(),
  ubicacion_boveda: TARGET_ROOT,
  estadisticas: {
    total_series: CURRICULUM_MAESTRO.series.length,
    total_podcasts: CURRICULUM_MAESTRO.podcasts.length,
    total_cursos: CURRICULUM_MAESTRO.cursos.length,
    total_cortos_workshops: CURRICULUM_MAESTRO.cortos_workshops.length,
    total_audios_mentoria_artistica: audiosSoberanosCount,
    total_transcripciones_whisper: transcripcionesCount
  },
  curriculum: CURRICULUM_MAESTRO,
  doctrinas_oraculo: {
    CEO_EMPRESARIO: {
      nombre: 'Doctrina de Crecimiento Cuántico & Alto Standing',
      ejes: [
        'Neurobranding y percepción de exclusividad',
        'Sobredemanda: marcas que son perseguidas por los clientes',
        'Venta Elegante: llamadas consultivas sin presión destructiva',
        'Modelo Midas: rentabilidad neta y optimización de márgenes',
        'Funnels de conversión y automatización ética'
      ]
    },
    ARTISTA_SOBERANO: {
      nombre: 'Doctrina de Soberanía y Monetización de Carrera Musical',
      ejes: [
        'Dignificación del caché solista: 350,00 € innegociables con Bose F1',
        'Split Soberano 80/10/10: Retribución justa e impacto social VIMUME',
        'Construcción de comunidad fan y venta recurrente sin intermediarios',
        'Alianzas canónicas con fincas y homologación acústica < 75 dB SPL',
        'Eliminación de la servidumbre de los portales comerciales tradicionales'
      ]
    }
  }
};

const indiceFile = path.join(TARGET_ROOT, 'INDICE_MAESTRO_ORACULO.json');
fs.writeFileSync(indiceFile, JSON.stringify(indiceMaestro, null, 2), 'utf8');

// Guardar copia liviana en el workspace para Next.js (< 50 KB)
const workspaceIndexFile = path.join(process.cwd(), 'src/data/boveda_oraculo_index.json');
fs.writeFileSync(workspaceIndexFile, JSON.stringify(indiceMaestro, null, 2), 'utf8');

console.log('✓ Bóveda consolidada con éxito en:', TARGET_ROOT);
console.log(`✓ Series: ${CURRICULUM_MAESTRO.series.length} | Podcasts: ${CURRICULUM_MAESTRO.podcasts.length} | Cursos: ${CURRICULUM_MAESTRO.cursos.length} | Cortos/Workshops: ${CURRICULUM_MAESTRO.cortos_workshops.length}`);
console.log(`✓ Audios Mentoría Artística: ${audiosSoberanosCount}`);
console.log(`✓ Transcripciones Whisper: ${transcripcionesCount}`);
console.log('✓ Índice maestro guardado en:', indiceFile);
console.log('✓ Índice liviano sincronizado en:', workspaceIndexFile);
