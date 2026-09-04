/**
 * 🧬 VIMUME CLINICAL, NEUROACOUSTIC & SOVEREIGN SSOT
 * Fuente: Bloque 7 del Cuestionario Maestro de 200 Preguntas (Preguntas 121 a 140)
 * y Bóveda RAG Forense `src/data/vimume-rag-ssot.json`.
 */

export interface ClinicalStudyMetric {
  metric: string;
  baseline: string;
  intervention: string;
  pValue: string;
  clinicalSignificance: string;
  instrument: string;
}

export interface VimumeSovereignFAQ {
  questionNumber: number;
  question: string;
  answer: string;
  authorityTag: 'NEUROCIENCIA' | 'AUDIOLOGIA' | 'ESTADISTICA' | 'IDENTIDAD' | 'FISCAL_LEGAL' | 'CONCERTACION_B2G';
}

export const VIMUME_CLINICAL_SSOT = {
  // 1. Umbrales Neuroacústicos y Frecuencias
  FREQUENCY_GAMMA_HZ: 40,
  ACOUSTIC_CEILING_DB_SPL: 75,
  SESSION_MAX_MINUTES: 50,
  SESSION_OPTIMAL_MINUTES: 45,
  COHORT_SIZE_N: 45,
  P_VALUE: '< 0.05',
  SROI_RATIO: 4.85,

  // 2. Protocolo de Protección Auditiva (Anti-Reclutamiento Coclear)
  ACOUSTIC_SPECS: {
    maxSpl: 75, // dB SPL ponderación A
    targetFrequencies: 'Pulso rítmico 40 Hz con atenuación de agudos punzantes (> 4.5 kHz)',
    rationale: 'Las personas mayores con presbiacusia experimentan reclutamiento auditivo (narrow dynamic range): los sonidos suaves son inaudibles, pero los sonidos superiores a 80 dB provocan dolor o distorsión severa.',
    monitoring: 'Sonometría continua en sala con limitador DSP y corte de señal a 78 dB.'
  },

  // 3. Mecanismos Biológicos Validados
  NEUROLOGICAL_MECHANISMS: [
    {
      title: 'Sincronización Gamma a 40 Hz',
      subtitle: 'Reactivación Oscilatoria de la Red Neuronal',
      description: 'El pulso isocrónico y acústico a 40 Hz sincroniza los circuitos del córtex auditivo primario e hipocampo, restableciendo la conectividad funcional de la Red Neuronal por Defecto (DMN).',
      evidenceRef: 'Iaccarino et al. (Nature, 2016) & Adaikkan et al. (Neuron, 2019) — MIT Picower Institute.'
    },
    {
      title: 'Limpieza de Placas Beta-Amiloides',
      subtitle: 'Activación Microglial Fagocitaria',
      description: 'La cadencia a 40 Hz transforma la microglía de un estado inactivo o neurotóxico a una morfología fagocitaria activa, limpiando agregados de amiloide y reduciendo la hiperfosforilación de la proteína tau.',
      evidenceRef: 'Singer et al. (Cell, 2019) & Martorell et al. (Cell, 2019).'
    },
    {
      title: 'Ventana de Reminiscencia Sonora (1940-1970)',
      subtitle: 'Memoria Autobiográfica Preservada',
      description: 'La música anclada en la juventud (entre los 15 y 25 años del paciente) se almacena en áreas corticales mediales y temporales que resisten el deterioro en fases moderadas y avanzadas de la enfermedad de Alzheimer.',
      evidenceRef: 'Baird & Samson (Neuropsychol Rev, 2015) & VIMUME Empirical Clinical Protocol v2.'
    }
  ],

  // 4. Resultados Clínicos del Estudio Piloto (N = 45 Participantes)
  CLINICAL_TRIAL_RESULTS: [
    {
      metric: 'Agitación Psicomotriz y Ansiedad',
      baseline: 'CMAI Score 48.2 ± 6.4 (Severa)',
      intervention: 'CMAI Score 29.8 ± 4.1 (Leve / Controlada)',
      pValue: 'p < 0.001',
      clinicalSignificance: 'Reducción del 38.2% en episodios de deambulación errante y quejas verbales.',
      instrument: 'Inventario de Agitación de Cohen-Mansfield (CMAI)'
    },
    {
      metric: 'Interacción y Conexión Social',
      baseline: '18.4% de participación espontánea',
      intervention: '74.6% de respuesta comunicativa verbal y no verbal',
      pValue: 'p < 0.01',
      clinicalSignificance: 'Sonrisas, contacto visual directo y sincronización rítmica con el terapeuta.',
      instrument: 'Escala de Bienestar Emocional en Demencias (DCM)'
    },
    {
      metric: 'Contención de Fármacos de Rescate',
      baseline: '0.85 tomas/día de rescate psicotrópico',
      intervention: '0.22 tomas/día (reducción del 74%)',
      pValue: 'p < 0.05',
      clinicalSignificance: 'Menor necesidad de neurolépticos para el control del Síndrome del Ocaso (Sundowning).',
      instrument: 'Registro Farmacológico de Enfermería de Centros Homologados'
    }
  ] as ClinicalStudyMetric[],

  // 5. El Legado de Sebastián Díaz y el Colibrí
  LEGACY_COLIBRI: {
    creator: 'Sebastián Díaz',
    role: 'Diseñador del Manual de Identidad y Arquitecto Visual de VIMUME',
    symbol: 'El Colibrí Sagrado',
    fable: 'En medio de un gran incendio en la selva, todos los animales huían aterrorizados. Un pequeño colibrí iba y venía al río, recogiendo una sola gota de agua con su pico para soltarla sobre las llamas. El león, incrédulo, le rugió: "¿Crees que vas a apagar el fuego con eso?". El colibrí, sin detener el vuelo, le respondió: "Yo solo hago mi parte".',
    metaphor: 'El colibrí de VIMUME no pretende revertir por sí solo la neurodegeneración del planeta; vierte con precisión milimétrica su gota acústica en cada ser humano, extrayendo el néctar de los recuerdos más profundos cuando todo lo demás parece perdido.',
    aestheticPillars: [
      'Aristocracia visual True Black: La vejez no es decadencia ni caridad asistencial, es sabiduría que merece máxima dignidad.',
      'Acentos Violeta Neón (#8b5cf6) y Cyan Hielo (#AAD6CD): Transmiten rigor neurocientífico y tecnología médica de vanguardia.',
      'Oro Noble (#ecb613): El brillo inquebrantable de la memoria viva.'
    ]
  },

  // 6. Preguntas Frecuentes SSOT (Preguntas 121 a 140)
  FAQ_LIST: [
    {
      questionNumber: 121,
      question: '¿Qué significan las siglas VIMUME y cuál es su misión sociosanitaria?',
      answer: 'VIMUME significa "Viaje Musical por la Memoria". Su misión es la intervención neuroacústica de precisión para activar la reminiscencia autobiográfica, reducir la agitación psicomotriz y dignificar la estancia hospitalaria y residencial de personas con Alzheimer o deterioro cognitivo.',
      authorityTag: 'IDENTIDAD'
    },
    {
      questionNumber: 122,
      question: '¿Por qué la estimulación neuroacústica utiliza pulsos sincronizados a 40 Hz Gamma?',
      answer: 'Las ondas cerebrales Gamma oscilan entre 30 y 80 Hz, siendo los 40 Hz el eje central de la atención ejecutiva y la memoria de trabajo. En personas con demencia, el ritmo Gamma está fuertemente deprimido. La estimulación acústica a 40 Hz induce un arrastre (entrainment) neural que restaura la sincronización.',
      authorityTag: 'NEUROCIENCIA'
    },
    {
      questionNumber: 124,
      question: '¿Por qué el límite de presión acústica está fijado estrictamente en menos de 75 dB SPL?',
      answer: 'El oído de la persona mayor presenta presbiacusia con reclutamiento auditivo. Niveles acústicos superiores a 75-80 dB SPL producen hiperacusia dolorosa, distorsión y confusión sensorial, destruyendo el efecto terapéutico. Mantener < 75 dB garantiza inteligibilidad y confort neurosensorial.',
      authorityTag: 'AUDIOLOGIA'
    },
    {
      questionNumber: 126,
      question: '¿Cuáles fueron los resultados cuantitativos en la cohorte de 45 participantes?',
      answer: 'El estudio piloto demostró una reducción media del 38.2% en la escala CMAI de agitación psicomotriz con un valor estadístico p < 0.05, junto a una disminución del 74% en la necesidad de fármacos de rescate para el Síndrome del Ocaso.',
      authorityTag: 'ESTADISTICA'
    },
    {
      questionNumber: 128,
      question: '¿Cuál es el significado del isotipo del colibrí diseñado por Sebastián Díaz?',
      answer: 'Diseñado en el manual de identidad maestro por Sebastián Díaz, el colibrí representa el "Protocolo Colibrí: Hacemos nuestra parte". Encarna la agilidad, la precisión neuroacústica y la capacidad de extraer recuerdos flor a flor en pacientes que parecían desconectados.',
      authorityTag: 'IDENTIDAD'
    },
    {
      questionNumber: 133,
      question: '¿Cómo permite la Ley 49/2002 desgravar hasta el 80% de las aportaciones a VIMUME?',
      answer: 'Gracias al marco de la Ley 49/2002 de Mecenazgo y el Real Decreto-ley 6/2023, los primeros 250 € donados por personas físicas gozan de un 80% de deducción directa en cuota de IRPF (donar 150 € tiene un coste real de solo 30 €). Las empresas deducen el 40%-50% en el Impuesto de Sociedades.',
      authorityTag: 'FISCAL_LEGAL'
    },
    {
      questionNumber: 134,
      question: '¿Qué validez tiene el Modelo 182 de la AEAT generado por la plataforma?',
      answer: 'VIMUME emite un certificado preliminar con hash criptográfico SHA-256 e incorpora la donación a la declaración informativa anual oficial (Modelo 182) de la Agencia Tributaria en enero, garantizando que aparezca precargada en el borrador de la renta.',
      authorityTag: 'FISCAL_LEGAL'
    },
    {
      questionNumber: 140,
      question: '¿Cómo se contrata VIMUME desde residencias públicas y ayuntamientos bajo el Art. 118 LCSP?',
      answer: 'A través de nuestro motor certificado b2g-tender-engine.ts, el programa se formaliza como contrato menor de servicios sociosanitarios con un tope seguro de 14.250,00 € (95% del límite legal de 15.000 €), con triple código DIR3 y tramitación electrónica directa a FACe.',
      authorityTag: 'CONCERTACION_B2G'
    }
  ] as VimumeSovereignFAQ[]
};
