export type VenueType = 'OPEN_AIR' | 'GLASS_DOME' | 'THEATER_HALL' | 'TENT';

export interface MicrophoneOption {
  id: string;
  name: string;
  brand: string;
  category: 'VOZ' | 'CUERDAS_ACUSTICAS' | 'METALES_BRASS' | 'MADERAS' | 'PERCUSION_BATERIA' | 'DI_BOXES' | 'OVERHEAD_AMBIENTE';
  type: 'CONDENSER' | 'DYNAMIC' | 'RIBBON' | 'DI_BOX';
  polarPattern: string;
  phantom48V: boolean;
  idealFor: string;
  referencePriceEur: number;
}

export interface MixerOption {
  id: string;
  name: string;
  brand: string;
  tier: 'TOURING_FLAGSHIP' | 'PRO_CONCERT' | 'COMPACT_DIGITAL' | 'RACK_STAGEBOX';
  channels: number;
  buses: number;
  dca: number;
  sampleRate: string;
  latencyMs: number;
  dspProtocol: string;
  description: string;
  referencePriceEur: number;
}

export interface MonitorOption {
  id: string;
  name: string;
  brand: string;
  type: 'IN_EAR' | 'WEDGE_FLOOR' | 'SIDE_FILL';
  powerWatts: number;
  wirelessProtocol?: string;
  description: string;
  referencePriceEur: number;
}

export interface StageAccessoryOption {
  id: string;
  name: string;
  brand: string;
  category: 'STAND' | 'SNAKE_STAGEBOX' | 'DSP_ANALYZER' | 'POWER_DISTRO';
  description: string;
}

// 🎚️ CATÁLOGO COMPLETO DE MESAS DE MEZCLAS (THOMANN LIVE SOUND ARCHITECTURE)
export const MIXER_CATALOG: MixerOption[] = [
  // Touring Flagships & Sinfónicas
  {
    id: 'digico-sd12',
    name: 'SD12 96 Stealth FPGA (72 Ch / 36 Buses)',
    brand: 'DiGiCo',
    tier: 'TOURING_FLAGSHIP',
    channels: 72,
    buses: 36,
    dca: 12,
    sampleRate: '96 kHz',
    latencyMs: 1.0,
    dspProtocol: 'Stealth Digital Processing Super FPGA',
    description: 'Consola de gira mundial suprema para sinfónicas, festivales y grandes producciones.',
    referencePriceEur: 32500
  },
  {
    id: 'digico-quantum225',
    name: 'Quantum 225 Mustard Processing (72 Ch)',
    brand: 'DiGiCo',
    tier: 'TOURING_FLAGSHIP',
    channels: 72,
    buses: 36,
    dca: 16,
    sampleRate: '96 kHz',
    latencyMs: 0.8,
    dspProtocol: 'Quantum 7th Gen FPGA & Mustard Processing',
    description: 'Motor Quantum ultra-lineal para sonorización acústica sin coloración.',
    referencePriceEur: 41000
  },
  {
    id: 'yamaha-rivage-pm3',
    name: 'RIVAGE PM3 Silk DSP (120 Ch / 72 Mix)',
    brand: 'Yamaha',
    tier: 'TOURING_FLAGSHIP',
    channels: 120,
    buses: 72,
    dca: 24,
    sampleRate: '96 kHz',
    latencyMs: 1.4,
    dspProtocol: 'TWINLANe / Rupert Neve SILK Hybrid Preamps',
    description: 'La cumbre del audio orquestal con emulación Rupert Neve Silk azul/rojo.',
    referencePriceEur: 55000
  },
  {
    id: 'yamaha-ql5',
    name: 'QL5 Dante Native (64 Mono / 8 Stereo)',
    brand: 'Yamaha',
    tier: 'PRO_CONCERT',
    channels: 64,
    buses: 16,
    dca: 16,
    sampleRate: '48/96 kHz',
    latencyMs: 1.2,
    dspProtocol: 'Dante Virtual Soundcard / Rupert Neve Portico',
    description: 'Referencia mundial en auditorios y festivales de música clásica y mariachi.',
    referencePriceEur: 16200
  },
  {
    id: 'yamaha-dm7',
    name: 'DM7 Broadcast & Live Dante (120 Ch / 96 kHz)',
    brand: 'Yamaha',
    tier: 'TOURING_FLAGSHIP',
    channels: 120,
    buses: 48,
    dca: 16,
    sampleRate: '96 kHz',
    latencyMs: 1.1,
    dspProtocol: 'Dante 144x144 / AI Assist Assist Mix',
    description: 'Consola de última generación Yamaha con pantalla táctil dual e IA de ayuda al técnico.',
    referencePriceEur: 29000
  },
  {
    id: 'allen-dante-dpa-dlive-s7000',
    name: 'dLive S7000 + DM64 MixRack (128 Ch)',
    brand: 'Allen & Heath',
    tier: 'TOURING_FLAGSHIP',
    channels: 128,
    buses: 64,
    dca: 24,
    sampleRate: '96 kHz',
    latencyMs: 0.7,
    dspProtocol: 'XCVI Core 96k FPGA',
    description: 'La superficie con mayor número de faders (36) para orquestas y 100 músicos.',
    referencePriceEur: 28500
  },
  {
    id: 'allen-sq7',
    name: 'SQ-7 FPGA DEEP (48 Ch / 36 Buses)',
    brand: 'Allen & Heath',
    tier: 'PRO_CONCERT',
    channels: 48,
    buses: 36,
    dca: 8,
    sampleRate: '96 kHz',
    latencyMs: 0.7,
    dspProtocol: 'XCVI Core FPGA / DEEP Plugins',
    description: 'Estándar rider orquestal de ultra baja latencia con emuladores valvulares DEEP.',
    referencePriceEur: 4799
  },
  {
    id: 'allen-sq6',
    name: 'SQ-6 Live Console (48 Ch / 24 Faders)',
    brand: 'Allen & Heath',
    tier: 'PRO_CONCERT',
    channels: 48,
    buses: 36,
    dca: 8,
    sampleRate: '96 kHz',
    latencyMs: 0.7,
    dspProtocol: 'XCVI Core FPGA',
    description: 'Potencia FPGA idéntica a SQ-7 con chasis optimizado para giras medianas.',
    referencePriceEur: 3899
  },
  {
    id: 'midas-heritage-d',
    name: 'Heritage-D HD96-24 (144 Flexi Ch)',
    brand: 'Midas',
    tier: 'TOURING_FLAGSHIP',
    channels: 144,
    buses: 96,
    dca: 24,
    sampleRate: '96 kHz',
    latencyMs: 1.1,
    dspProtocol: 'Graviton Engine 64-bit Floating Point',
    description: 'El sonido legendario Midas llevado al límite de la precisión acústica orquestal.',
    referencePriceEur: 36000
  },
  {
    id: 'midas-m32',
    name: 'M32 LIVE (40 Ch / Midas Pro Preamps)',
    brand: 'Midas',
    tier: 'PRO_CONCERT',
    channels: 40,
    buses: 25,
    dca: 8,
    sampleRate: '48 kHz',
    latencyMs: 0.8,
    dspProtocol: 'Midas Pro Motorized Faders / Klark Teknik',
    description: 'Preamplificadores Midas Pro de alta fidelidad, excelente para cuerda y viento.',
    referencePriceEur: 3190
  },
  {
    id: 'behringer-wing',
    name: 'WING 48-Channel Full Touch Console',
    brand: 'Behringer',
    tier: 'PRO_CONCERT',
    channels: 48,
    buses: 28,
    dca: 16,
    sampleRate: '48 kHz',
    latencyMs: 1.0,
    dspProtocol: 'Sources Routing Matrix / TC Electronic FX',
    description: 'Enrutamiento basado en Fuentes (Sources) ideal para directos modernos.',
    referencePriceEur: 2399
  },
  {
    id: 'behringer-x32',
    name: 'X32 Digital Console (40 Ch / 25 Buses)',
    brand: 'Behringer',
    tier: 'COMPACT_DIGITAL',
    channels: 40,
    buses: 25,
    dca: 8,
    sampleRate: '48 kHz',
    latencyMs: 0.8,
    dspProtocol: 'Cirrus Logic D/A / Midas Preamps',
    description: 'La mesa digital más vendida del mundo para eventos, bodas y mariachis.',
    referencePriceEur: 2150
  },
  {
    id: 'allen-cq18t',
    name: 'CQ-18T Ultra-Compact 96 kHz Touchscreen (18 Ch)',
    brand: 'Allen & Heath',
    tier: 'COMPACT_DIGITAL',
    channels: 18,
    buses: 8,
    dca: 4,
    sampleRate: '96 kHz',
    latencyMs: 0.7,
    dspProtocol: 'FPGA 96k / Quick Channels / Feedback Assistant',
    description: 'La reina absoluta para mariachis y quintetos acústicos. 96 kHz con pantalla táctil integrada.',
    referencePriceEur: 1199
  },
  {
    id: 'soundcraft-ui16',
    name: 'Ui16 Wi-Fi Tablet Mixer (16 Ch / Lexicon FX)',
    brand: 'Soundcraft',
    tier: 'COMPACT_DIGITAL',
    channels: 16,
    buses: 4,
    dca: 4,
    sampleRate: '48 kHz',
    latencyMs: 1.2,
    dspProtocol: 'dbx AFS2 Anti-Feedback / DigiTech Amp Model',
    description: 'Controlable desde iPad/móvil por Wi-Fi integrado. La favorita de mariachis y solistas en bodas.',
    referencePriceEur: 529
  },
  {
    id: 'behringer-flow8',
    name: 'FLOW 8 Bluetooth Digital Streaming Mixer (8 Ch)',
    brand: 'Behringer',
    tier: 'COMPACT_DIGITAL',
    channels: 8,
    buses: 2,
    dca: 2,
    sampleRate: '48 kHz',
    latencyMs: 0.6,
    dspProtocol: 'EZ-Gain Automatic Calibration / Bluetooth Audio',
    description: 'Compacta de bolsillo perfecta para Trío Acústico o Solista con Edwin Agudelo. Calibración automática.',
    referencePriceEur: 249
  },
  {
    id: 'soundcraft-vi3000',
    name: 'Vi3000 Vistonics II (96 Ch Dante)',
    brand: 'Soundcraft',
    tier: 'TOURING_FLAGSHIP',
    channels: 96,
    buses: 24,
    dca: 16,
    sampleRate: '48 kHz',
    latencyMs: 1.5,
    dspProtocol: 'SpiderCore DSP / Lexicon FX & BSS Dynamic EQ',
    description: 'Interfaz Vistonics patentada con potenciómetros rotatorios montados en la pantalla.',
    referencePriceEur: 24500
  },
  {
    id: 'presonus-studiolive-64s',
    name: 'StudioLive 64S AVB (64 Ch / 33 Faders)',
    brand: 'PreSonus',
    tier: 'PRO_CONCERT',
    channels: 64,
    buses: 43,
    dca: 24,
    sampleRate: '48/96 kHz',
    latencyMs: 1.9,
    dspProtocol: 'FLEX DSP Dual-Core / AVB Networked',
    description: '64 canales de entrada simultánea con grabación multipista nativa SD card.',
    referencePriceEur: 3999
  }
];

export function getRecommendedMixerId(orchestraSize: number): string {
  if (orchestraSize <= 4) return 'behringer-flow8'; // Trío o Solista
  if (orchestraSize <= 12) return 'allen-cq18t';    // Mariachi estándar
  if (orchestraSize <= 30) return 'allen-sq7';       // Mariachi orquestal / ensamble
  return 'allen-dante-dpa-dlive-s7000';              // Gran sinfónica (100 músicos)
}

// 🎤 CATÁLOGO COMPLETO DE MICROFONÍA PROFESIONAL (THOMANN PRO AUDIO)
export const MICROPHONE_CATALOG: MicrophoneOption[] = [
  // Voces Principales & Solistas
  { id: 'shure-beta87a', name: 'Shure Beta 87A (Axient Digital RF)', brand: 'Shure', category: 'VOZ', type: 'CONDENSER', polarPattern: 'Supercardioide', phantom48V: true, idealFor: 'Voz Solista Edwin Agudelo (Corte armónico brillante)', referencePriceEur: 1450 },
  { id: 'shure-ksm9', name: 'Shure KSM9 Dual Diaphragm Handheld', brand: 'Shure', category: 'VOZ', type: 'CONDENSER', polarPattern: 'Conmutable Cardioide/Supercardioide', phantom48V: true, idealFor: 'Voz Solista Premium Máxima Dinámica', referencePriceEur: 799 },
  { id: 'neumann-kms104', name: 'Neumann KMS 104 Plus Live Vocal', brand: 'Neumann', category: 'VOZ', type: 'CONDENSER', polarPattern: 'Cardioide', phantom48V: true, idealFor: 'Voz Principal Acústica con Calidez de Estudio', referencePriceEur: 699 },
  { id: 'dpa-dfacto-4018', name: 'DPA d:facto 4018V Vocal Mic', brand: 'DPA', category: 'VOZ', type: 'CONDENSER', polarPattern: 'Supercardioide Lineal', phantom48V: true, idealFor: 'Voces de Alta Definición y Cero Coloración', referencePriceEur: 990 },
  { id: 'sennheiser-e965', name: 'Sennheiser e965 True Condenser', brand: 'Sennheiser', category: 'VOZ', type: 'CONDENSER', polarPattern: 'Conmutable Cardioide/Supercardioide', phantom48V: true, idealFor: 'Voces con Gran Rango Dinámico', referencePriceEur: 549 },
  { id: 'shure-sm58', name: 'Shure SM58 Dinámico Estándar', brand: 'Shure', category: 'VOZ', type: 'DYNAMIC', polarPattern: 'Cardioide', phantom48V: false, idealFor: 'Coros, Mariachi de Apoyo y Respaldo', referencePriceEur: 109 },
  { id: 'shure-beta58a', name: 'Shure Beta 58A Dinámico Supercardioide', brand: 'Shure', category: 'VOZ', type: 'DYNAMIC', polarPattern: 'Supercardioide', phantom48V: false, idealFor: 'Voces con Alta Presencia en Escenario', referencePriceEur: 179 },
  { id: 'sennheiser-e945', name: 'Sennheiser e945 Dinámico Supercardioide', brand: 'Sennheiser', category: 'VOZ', type: 'DYNAMIC', polarPattern: 'Supercardioide', phantom48V: false, idealFor: 'Coros con Rechazo Máximo a Acoples', referencePriceEur: 219 },

  // Cuerdas Acústicas & Mariachi
  { id: 'dpa-4099-clip', name: 'DPA 4099 CORE Instrument Clip (Loud SPL)', brand: 'DPA', category: 'CUERDAS_ACUSTICAS', type: 'CONDENSER', polarPattern: 'Supercardioide', phantom48V: true, idealFor: 'Vihuela, Violines Solistas, Chelos y Arpa', referencePriceEur: 590 },
  { id: 'neumann-km184', name: 'Neumann KM 184 Diafragma Pequeño', brand: 'Neumann', category: 'CUERDAS_ACUSTICAS', type: 'CONDENSER', polarPattern: 'Cardioide', phantom48V: true, idealFor: 'Cuerdas Sinfónicas (Violín I/II, Violas, Chelos)', referencePriceEur: 799 },
  { id: 'schoeps-colette-mk4', name: 'Schoeps Colette CMC6 + MK4', brand: 'Schoeps', category: 'CUERDAS_ACUSTICAS', type: 'CONDENSER', polarPattern: 'Cardioide de Precisión', phantom48V: true, idealFor: 'Captación Referente de Orquesta Sinfónica', referencePriceEur: 1690 },
  { id: 'audio-technica-atm350a', name: 'Audio-Technica ATM350a Cardioid Clip', brand: 'Audio-Technica', category: 'CUERDAS_ACUSTICAS', type: 'CONDENSER', polarPattern: 'Cardioide', phantom48V: true, idealFor: 'Guitarras Españolas, Vihuela y Cello', referencePriceEur: 299 },

  // Metales / Brass (Trompetas, Trombones, Cornos)
  { id: 'sennheiser-md421', name: 'Sennheiser MD 421-II Gran Diafragma', brand: 'Sennheiser', category: 'METALES_BRASS', type: 'DYNAMIC', polarPattern: 'Cardioide con Filtro Graves', phantom48V: false, idealFor: 'Trompetas Mariachi, Trombones & Saxos', referencePriceEur: 399 },
  { id: 'shure-sm57', name: 'Shure SM57 Dinámico Clásico', brand: 'Shure', category: 'METALES_BRASS', type: 'DYNAMIC', polarPattern: 'Cardioide', phantom48V: false, idealFor: 'Trompetas en Vivo y Secciones de Metal', referencePriceEur: 105 },
  { id: 'royer-r121', name: 'Royer R-121 Micrófono de Cinta (Ribbon)', brand: 'Royer', category: 'METALES_BRASS', type: 'RIBBON', polarPattern: 'Figura de 8', phantom48V: false, idealFor: 'Metales Cálidos sin Agresividad en Agudos', referencePriceEur: 1490 },
  { id: 'electro-voice-re20', name: 'Electro-Voice RE20 Variable-D', brand: 'Electro-Voice', category: 'METALES_BRASS', type: 'DYNAMIC', polarPattern: 'Cardioide Anti-Efecto Proximidad', phantom48V: false, idealFor: 'Trombón Bajo, Tuba y Barítono', referencePriceEur: 599 },

  // Maderas (Flautas, Clarinetes, Oboes, Fagotes)
  { id: 'akg-c414', name: 'AKG C414 XLS Multi-Patrón Referencia', brand: 'AKG', category: 'MADERAS', type: 'CONDENSER', polarPattern: 'Multi-patrón (Omni/Card/Super/Hyper/8)', phantom48V: true, idealFor: 'Maderas Solistas, Arpa & Piano de Cola', referencePriceEur: 999 },
  { id: 'rode-nt5-pair', name: 'Røde NT5 Par Estéreo Emparejado', brand: 'Røde', category: 'MADERAS', type: 'CONDENSER', polarPattern: 'Cardioide', phantom48V: true, idealFor: 'Flautas Traveseras y Clarinetes Seccionales', referencePriceEur: 349 },
  { id: 'earthworks-sr25', name: 'Earthworks SR25 High Definition Cardioid', brand: 'Earthworks', category: 'MADERAS', type: 'CONDENSER', polarPattern: 'Cardioide hasta 25 kHz', phantom48V: true, idealFor: 'Oboe y Fagote de Alta Resolución Temporal', referencePriceEur: 689 },

  // Cajas de Inyección Directa (DI Boxes)
  { id: 'bss-ar133', name: 'BSS AR-133 Active Direct Injection Box', brand: 'BSS Audio', category: 'DI_BOXES', type: 'DI_BOX', polarPattern: 'Línea Balanceada Activa', phantom48V: true, idealFor: 'Guitarrón Tradicional y Bajo Eléctrico', referencePriceEur: 139 },
  { id: 'radial-j48', name: 'Radial J48 Active Direct Box (+48V)', brand: 'Radial', category: 'DI_BOXES', type: 'DI_BOX', polarPattern: 'Línea Balanceada con Inversión Fase', phantom48V: true, idealFor: 'Bajos Acústicos, Guitarrón y Teclados', referencePriceEur: 239 },
  { id: 'radial-jdi', name: 'Radial JDI Passive Jensen Transformer DI', brand: 'Radial', category: 'DI_BOXES', type: 'DI_BOX', polarPattern: 'Aislamiento Pasivo por Transformador', phantom48V: false, idealFor: 'Pianos Digitales e Instrumentos Activos', referencePriceEur: 269 },
  { id: 'rupert-neve-rndi', name: 'Rupert Neve RNDI Active Transformer DI', brand: 'Rupert Neve', category: 'DI_BOXES', type: 'DI_BOX', polarPattern: 'Línea Transformador Custom Rupert Neve', phantom48V: true, idealFor: 'Cuerdas Electroacústicas Máxima Fidelidad', referencePriceEur: 299 },

  // Percusión & Timbales Sinfónicos
  { id: 'sennheiser-e604', name: 'Sennheiser e604 Clip Dynamic', brand: 'Sennheiser', category: 'PERCUSION_BATERIA', type: 'DYNAMIC', polarPattern: 'Cardioide con Clip Rápido', phantom48V: false, idealFor: 'Timbales de Mariachi y Cajas Orquestales', referencePriceEur: 145 },
  { id: 'shure-beta52a', name: 'Shure Beta 52A Supercardioid Low-End', brand: 'Shure', category: 'PERCUSION_BATERIA', type: 'DYNAMIC', polarPattern: 'Supercardioide Optimizado Subgraves', phantom48V: false, idealFor: 'Bombo Sinfónico y Gran Tambor', referencePriceEur: 199 },
  { id: 'shure-beta91a', name: 'Shure Beta 91A Micrófono de Superficie', brand: 'Shure', category: 'PERCUSION_BATERIA', type: 'CONDENSER', polarPattern: 'Semicardioide de Suelo', phantom48V: true, idealFor: 'Percusión de Suelo y Danza Folclórica', referencePriceEur: 289 }
];

// 🎧 CATÁLOGO COMPLETO DE MONITOREO (IN-EARS & CUÑAS DE ESCENARIO)
export const MONITOR_CATALOG: MonitorOption[] = [
  // Sistemas In-Ear Inalámbricos (IEM)
  { id: 'shure-psm1000', name: 'Shure PSM 1000 In-Ear Dual RF (Axient Diversity)', brand: 'Shure', type: 'IN_EAR', powerWatts: 0, wirelessProtocol: 'UHF True Diversity 24-bit', description: 'Referencia en giras de estadios y solistas. Cero acoples y audio estéreo inmaculado.', referencePriceEur: 4200 },
  { id: 'sennheiser-2000-iem', name: 'Sennheiser 2000 Series IEM Dual Transmitter', brand: 'Sennheiser', type: 'IN_EAR', powerWatts: 0, wirelessProtocol: 'UHF Switchable RF Power', description: 'Robusto sistema de radiofrecuencia para orquestas y trompetistas.', referencePriceEur: 3600 },
  { id: 'sennheiser-g4-iem', name: 'Sennheiser EW IEM G4 Twin System', brand: 'Sennheiser', type: 'IN_EAR', powerWatts: 0, wirelessProtocol: 'True Diversity RF', description: 'Monitor in-ear transparente y eficiente para mariachi y músicos de apoyo.', referencePriceEur: 1199 },
  { id: 'shure-psm300', name: 'Shure PSM 300 Stereo Personal Monitor', brand: 'Shure', type: 'IN_EAR', powerWatts: 0, wirelessProtocol: '24-bit Digital Audio', description: 'Monitoreo digital estéreo claro para músicos de sección.', referencePriceEur: 699 },

  // Cuñas de Suelo / Stage Wedges Coaxiales
  { id: 'l-acoustics-x15', name: 'L-Acoustics X15 HiQ Coaxial Active Wedge (138 dB SPL)', brand: 'L-Acoustics', type: 'WEDGE_FLOOR', powerWatts: 1400, description: 'La cuña de suelo más precisa del mundo. Guía elipsoide de 40° x 60° sin zonas muertas.', referencePriceEur: 4500 },
  { id: 'd&b-m4', name: 'd&b audiotechnik M4 Stage Wedge 15" Coaxial', brand: 'd&b audiotechnik', type: 'WEDGE_FLOOR', powerWatts: 800, description: 'Perfil bajo de escenario con dispersión controlada de 50° x 70°.', referencePriceEur: 3850 },
  { id: 'meyersound-mjf210', name: 'Meyer Sound MJF-210 High-Power Wedge', brand: 'Meyer Sound', type: 'WEDGE_FLOOR', powerWatts: 1200, description: 'Monitor autoamplificado de clase mundial con respuesta de fase ultra plana.', referencePriceEur: 5200 },
  { id: 'rcf-nx15sma', name: 'RCF NX 15-SMA Active Stage Monitor', brand: 'RCF', type: 'WEDGE_FLOOR', powerWatts: 700, description: 'Cuña de suelo activa de alta pegada y fiabilidad probada en eventos.', referencePriceEur: 1290 },

  // Side-Fills & Referencias de Escenario
  { id: 'l-acoustics-syva', name: 'L-Acoustics Syva + Syva Low Columna Side-Fill', brand: 'L-Acoustics', type: 'SIDE_FILL', powerWatts: 1600, description: 'Side-fill esbelto de tiro largo de 140° para bañar el escenario homogéneamente.', referencePriceEur: 8200 },
  { id: 'bose-f1-model812', name: 'Bose F1 Model 812 + F1 Subwoofer Flexible Array', brand: 'Bose', type: 'SIDE_FILL', powerWatts: 2000, description: 'Side-fill oficial Productora EAR para cobertura simétrica de 12 W/pax.', referencePriceEur: 2490 },
  { id: 'bose-s1pro', name: 'Bose S1 Pro+ Multi-Position System', brand: 'Bose', type: 'SIDE_FILL', powerWatts: 300, description: 'Side-fill ultracompacto para referencia cercana de directores y solistas.', referencePriceEur: 699 }
];

export interface MusicianPosition {
  id: string;
  name: string;
  section: 'VOICE_SOLO' | 'MARIACHI' | 'STRINGS' | 'WOODWINDS' | 'BRASS' | 'PERCUSSION';
  instrument: string;
  avatarIcon: string;
  x: number;
  y: number;
  micId: string;
  monitorId: string;
  standType: string;
  phantom48V: boolean;
  channel: number;
  gainDb: number;
  pan: number;
}

export function generateOrchestra(size: number): MusicianPosition[] {
  const list: MusicianPosition[] = [
    {
      id: 'm-1',
      name: 'Edwin Agudelo (Voz Solista)',
      section: 'VOICE_SOLO',
      instrument: 'Voz Principal',
      avatarIcon: '🎤',
      x: 50,
      y: 88,
      micId: 'shure-beta87a',
      monitorId: 'shure-psm1000',
      standType: 'Pie Recto Redondo Cromado K&M Pro',
      phantom48V: true,
      channel: 1,
      gainDb: 34,
      pan: 0
    }
  ];

  if (size >= 3) {
    list.push(
      {
        id: 'm-2',
        name: 'Mariachi - Vihuela',
        section: 'MARIACHI',
        instrument: 'Vihuela Mexicana',
        avatarIcon: '🪕',
        x: 42,
        y: 75,
        micId: 'dpa-4099-clip',
        monitorId: 'shure-psm1000',
        standType: 'Pinza DPA Clip para Instrumento',
        phantom48V: true,
        channel: 2,
        gainDb: 28,
        pan: -25
      },
      {
        id: 'm-3',
        name: 'Mariachi - Guitarrón',
        section: 'MARIACHI',
        instrument: 'Guitarrón Tradicional',
        avatarIcon: '🎸',
        x: 58,
        y: 75,
        micId: 'bss-ar133',
        monitorId: 'd&b-m4',
        standType: 'Inyección Directa Activa BSS AR-133',
        phantom48V: false,
        channel: 3,
        gainDb: 18,
        pan: 25
      }
    );
  }

  if (size >= 6) {
    list.push(
      {
        id: 'm-4',
        name: 'Trompeta 1 (Mariachi)',
        section: 'BRASS',
        instrument: 'Trompeta en Sib',
        avatarIcon: '🎺',
        x: 28,
        y: 65,
        micId: 'sennheiser-md421',
        monitorId: 'sennheiser-g4-iem',
        standType: 'Jirafa Telescópica Pesada K&M',
        phantom48V: false,
        channel: 4,
        gainDb: 22,
        pan: -45
      },
      {
        id: 'm-5',
        name: 'Trompeta 2 (Mariachi)',
        section: 'BRASS',
        instrument: 'Trompeta en Sib',
        avatarIcon: '🎺',
        x: 72,
        y: 65,
        micId: 'sennheiser-md421',
        monitorId: 'sennheiser-g4-iem',
        standType: 'Jirafa Telescópica Pesada K&M',
        phantom48V: false,
        channel: 5,
        gainDb: 22,
        pan: 45
      },
      {
        id: 'm-6',
        name: 'Violín Primero (Mariachi)',
        section: 'STRINGS',
        instrument: 'Violín Acústico',
        avatarIcon: '🎻',
        x: 36,
        y: 80,
        micId: 'dpa-4099-clip',
        monitorId: 'shure-psm1000',
        standType: 'Pinza Clip para Violín',
        phantom48V: true,
        channel: 6,
        gainDb: 30,
        pan: -30
      }
    );
  }

  if (size >= 12) {
    for (let i = 7; i <= size && i <= 24; i++) {
      const isLeft = i % 2 === 0;
      const row = Math.floor((i - 6) / 4);
      const isCello = i % 3 === 0;
      list.push({
        id: 'm-' + i,
        name: isCello ? 'Violonchelo ' + (i - 6) : 'Violín ' + (i - 6),
        section: 'STRINGS',
        instrument: isCello ? 'Violonchelo' : 'Violín Solista',
        avatarIcon: '🎻',
        x: isLeft ? 18 + (i % 5) * 6 : 82 - (i % 5) * 6,
        y: 50 + row * 9,
        micId: isCello ? 'neumann-km184' : 'dpa-4099-clip',
        monitorId: 'shure-psm1000',
        standType: isCello ? 'Pie Bajo con Jirafa K&M' : 'Pinza Clip DPA para Cuerda',
        phantom48V: true,
        channel: i,
        gainDb: 32,
        pan: isLeft ? -40 : 40
      });
    }
  }

  for (let i = list.length + 1; i <= size; i++) {
    const angle = ((i - 25) / (size - 24 || 1)) * Math.PI;
    const radius = 38 + (i % 3) * 6;
    const x = Math.round(50 + Math.cos(angle) * radius);
    const y = Math.round(18 + Math.sin(angle) * (radius * 0.72));
    const section = i % 5 === 0 ? 'PERCUSSION' : i % 4 === 0 ? 'BRASS' : i % 3 === 0 ? 'WOODWINDS' : 'STRINGS';
    
    let icon = '🎻';
    let inst = 'Viola Sinfónica';
    let mic = 'neumann-km184';
    if (section === 'PERCUSSION') {
      icon = '🥁';
      inst = 'Timbales Sinfónicos & Platillos';
      mic = 'akg-c414';
    } else if (section === 'BRASS') {
      icon = '📯';
      inst = 'Corno Francés en Fa';
      mic = 'sennheiser-md421';
    } else if (section === 'WOODWINDS') {
      icon = '🪵';
      inst = 'Flauta Travesera';
      mic = 'neumann-km184';
    }

    list.push({
      id: 'm-' + i,
      name: 'Puesto Orquestal ' + i,
      section,
      instrument: inst,
      avatarIcon: icon,
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(12, Math.min(58, y)),
      micId: mic,
      monitorId: 'd&b-m4',
      standType: 'Jirafa Grande de Concierto K&M',
      phantom48V: true,
      channel: i,
      gainDb: 26,
      pan: Math.round(((x - 50) / 50) * 80)
    });
  }

  return list;
}

export function calculateAcoustics(size: number, venue: VenueType) {
  const baseWattsPerPax = 12;
  const estimatedAudience = size * 25;
  const totalWatts = estimatedAudience * baseWattsPerPax;
  
  let targetSPL = 74.5;
  let rt60 = '1.2s (Óptimo Directo)';
  let criticalNotch = 'Ninguno';

  switch (venue) {
    case 'GLASS_DOME':
      targetSPL = 72.0;
      rt60 = '2.8s (Alta Reflexión Cúpula Acristalada)';
      criticalNotch = '2.5 kHz - 3.8 kHz (-4.5 dB Q=4.0)';
      break;
    case 'OPEN_AIR':
      targetSPL = 74.8;
      rt60 = '0.4s (Dispersión Directa Libre)';
      criticalNotch = 'Corte paso alto viento 80 Hz (-18 dB/oct)';
      break;
    case 'THEATER_HALL':
      targetSPL = 73.5;
      rt60 = '1.6s (Acústica Viva Madera Noble)';
      criticalNotch = '500 Hz control resonancia sala (-2.5 dB)';
      break;
    case 'TENT':
      targetSPL = 73.0;
      rt60 = '0.9s (Amortiguación Lona Tensada)';
      criticalNotch = '1.2 kHz corrección presencia lona (-2 dB)';
      break;
  }

  return {
    estimatedAudience,
    totalWatts,
    targetSPL,
    rt60,
    criticalNotch,
    legalSPLCompliant: targetSPL <= 75.0
  };
}
