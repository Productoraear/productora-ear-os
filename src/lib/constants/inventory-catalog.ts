/**
 * 📦 INVENTARIO S-CLASS DE EQUIPAMIENTO TÉCNICO & PACKS DE SONIDO (EAR OS V2)
 * Fuente única de verdad para stock de audio, microfonía, mesas e iluminación.
 * Cada ítem cuenta con 10 unidades base y seguimiento de disponibilidad por fecha.
 */

export interface InventoryItem {
  id: string;
  name: string;
  category: 'ALTAVOCES' | 'MICROFONIA' | 'MESAS' | 'PACKS_SONIDO' | 'ILUMINACION_DJ' | 'ILUMINACION_EVENTOS';
  brand: 'Bose' | 'L-Acoustics' | 'JBL' | 'Electro-Voice' | 'Shure' | 'Behringer' | 'Chauvet' | 'Cameo';
  powerWatts: number;
  coverageM2: number;
  maxPax: number;
  dailyPrice: number;
  totalStock: number;
  reservedUnits: number;
  description: string;
  features: string[];
  specs: Record<string, string>;
}

export const INITIAL_INVENTORY: InventoryItem[] = [
  // 🔊 ALTAVOCES & SISTEMAS P.A.
  {
    id: 'spk-bose-f1',
    name: 'Bose F1 Model 812 + Subwoofer F1',
    category: 'ALTAVOCES',
    brand: 'Bose',
    powerWatts: 1000,
    coverageM2: 80,
    maxPax: 120,
    dailyPrice: 180,
    totalStock: 10,
    reservedUnits: 1,
    description: 'Arreglo lineal flexible que optimiza la cobertura acústica según la altura del recinto.',
    features: ['Patrón de cobertura ajustable (Recto, C, J, J invertida)', '1000W RMS Clase D', 'SPL pico 132 dB'],
    specs: { 'Respuesta': '43 Hz - 20 kHz', 'Dispersión': '100° H x 40° V' }
  },
  {
    id: 'spk-lacoustics-syva',
    name: 'L-Acoustics Syva + Syva Low',
    category: 'ALTAVOCES',
    brand: 'L-Acoustics',
    powerWatts: 2400,
    coverageM2: 250,
    maxPax: 350,
    dailyPrice: 450,
    totalStock: 10,
    reservedUnits: 2,
    description: 'Sistema colinear de alta fidelidad arquitectónica para bodas VIP y galas de alta exigencia.',
    features: ['Tecnología Colinear Source', 'Lanzamiento de 35 metros', 'SPL 137 dB sin distorsión'],
    specs: { 'Respuesta': '35 Hz - 20 kHz', 'Amplificación': 'LA4X' }
  },
  {
    id: 'spk-jbl-prx-one',
    name: 'JBL PRX ONE Column All-in-One',
    category: 'ALTAVOCES',
    brand: 'JBL',
    powerWatts: 1000,
    coverageM2: 60,
    maxPax: 90,
    dailyPrice: 120,
    totalStock: 10,
    reservedUnits: 0,
    description: 'Columna portátil con DSP dbx integrado y mezclador Soundcraft de 7 canales.',
    features: ['Mezclador digital de 7 canales', 'DSP Lexicon & dbx', 'Bluetooth 5.0'],
    specs: { 'Potencia Pico': '2000W', 'SPL': '130 dB' }
  },
  {
    id: 'spk-ev-evolve50',
    name: 'Electro-Voice Evolve 50M',
    category: 'ALTAVOCES',
    brand: 'Electro-Voice',
    powerWatts: 1000,
    coverageM2: 75,
    maxPax: 110,
    dailyPrice: 150,
    totalStock: 10,
    reservedUnits: 1,
    description: 'Sistema de columna premium con app QuickSmart Mobile y preamps de bajo ruido.',
    features: ['8 preamps de alta ganancia', 'QuickSmart Link', 'Efectos Dynacord integrados'],
    specs: { 'Respuesta': '37 Hz - 20 kHz', 'Dispersión': '120° H x 40° V' }
  },

  // 🎙️ MICROFONÍA INALÁMBRICA & CABLEADA
  {
    id: 'mic-shure-axient',
    name: 'Shure Axient Digital AD4D Dual',
    category: 'MICROFONIA',
    brand: 'Shure',
    powerWatts: 0,
    coverageM2: 500,
    maxPax: 1000,
    dailyPrice: 220,
    totalStock: 10,
    reservedUnits: 1,
    description: 'El estándar de oro en broadcast y directos internacionales con Quadversity y cero dropout.',
    features: ['Escaneo espectral de frecuencias', 'Cápsulas KSM8 y KSM9', 'Dante & AES3 nativo'],
    specs: { 'Latencia': '2.0 ms', 'Banda': 'UHF Digital' }
  },
  {
    id: 'mic-shure-qlxd',
    name: 'Shure QLX-D Digital Wireless (SM58/Beta58)',
    category: 'MICROFONIA',
    brand: 'Shure',
    powerWatts: 0,
    coverageM2: 200,
    maxPax: 400,
    dailyPrice: 85,
    totalStock: 10,
    reservedUnits: 2,
    description: 'Microfonía inalámbrica digital de 24 bits para bodas, conferencias y mariachis.',
    features: ['Audio digital transparente de 24 bits', 'Encriptación AES-256', 'Red Ethernet Shure Wireless Workbench'],
    specs: { 'Rango dinámico': '>120 dB', 'Alcance': '100m' }
  },

  // 🎛️ MESAS DE MEZCLAS DIGITALES
  {
    id: 'mix-behringer-xr18',
    name: 'Behringer X AIR XR18 Digital Stagebox',
    category: 'MESAS',
    brand: 'Behringer',
    powerWatts: 50,
    coverageM2: 500,
    maxPax: 1000,
    dailyPrice: 95,
    totalStock: 10,
    reservedUnits: 3,
    description: 'Mesa digital de 18 canales controlada por iPad/PC con 16 previos Midas y WiFi integrado.',
    features: ['16 previos Midas programables', 'Router WiFi tri-modo integrado', 'Grabación multipista USB'],
    specs: { 'Canales': '18', 'Buses': '6 AUX + Master' }
  },
  {
    id: 'mix-behringer-x32',
    name: 'Behringer X32 Compact / Producer',
    category: 'MESAS',
    brand: 'Behringer',
    powerWatts: 120,
    coverageM2: 1000,
    maxPax: 3000,
    dailyPrice: 160,
    totalStock: 10,
    reservedUnits: 1,
    description: 'Consola digital para orquestas, festivales y formaciones sinfónicas de alto canalaje.',
    features: ['40 canales de entrada', 'Faders motorizados de 100mm', 'Pantalla TFT de 7 pulgadas'],
    specs: { 'Procesamiento': '40-bit punto flotante', 'Efectos': '8 motores stereo FX' }
  },

  // 📦 PACKS DE SONIDO INTEGRADOS (LLAVE EN MANO)
  {
    id: 'pack-lounge-20m2',
    name: 'Pack Acústico Lounge (Espacios 15 - 35 m²)',
    category: 'PACKS_SONIDO',
    brand: 'Bose',
    powerWatts: 600,
    coverageM2: 35,
    maxPax: 30,
    dailyPrice: 190,
    totalStock: 10,
    reservedUnits: 2,
    description: 'Perfecto para salones privados, cócteles íntimos y aniversarios de pequeña escala.',
    features: ['1x Columna Portátil Bose/JBL', '2x Micrófonos Inalámbricos', 'Conexión Bluetooth + Operador Técnico'],
    specs: { 'Espacio Recomendado': '15 - 35 m²', 'Potencia': '600W RMS' }
  },
  {
    id: 'pack-gala-100m2',
    name: 'Pack Gala VIP (Espacios 80 - 150 m²)',
    category: 'PACKS_SONIDO',
    brand: 'Bose',
    powerWatts: 2000,
    coverageM2: 150,
    maxPax: 150,
    dailyPrice: 420,
    totalStock: 10,
    reservedUnits: 3,
    description: 'Configuración equilibrada para bodas de 100 personas, cenas de empresa y mariachi en directo.',
    features: ['2x Bose F1 Model 812 + Subgraves', '1x Mesa Digital Behringer XR18', '4x Micrófonos Shure Beta 58A', 'Ingeniero de Sonido'],
    specs: { 'Espacio Recomendado': '80 - 150 m²', 'Potencia': '2000W RMS' }
  },
  {
    id: 'pack-festival-500m2',
    name: 'Pack Concierto & Festival (Espacios 300 - 800 m²)',
    category: 'PACKS_SONIDO',
    brand: 'L-Acoustics',
    powerWatts: 6000,
    coverageM2: 800,
    maxPax: 800,
    dailyPrice: 980,
    totalStock: 10,
    reservedUnits: 1,
    description: 'Sonorización masiva para plazas de ayuntamientos, fincas abiertas y grandes eventos B2G.',
    features: ['4x L-Acoustics Syva + 4x Syva Low', 'Mesa Digital X32 + Stagebox S16', 'Microfonía Shure Axient Digital', 'Certificado Acústico'],
    specs: { 'Espacio Recomendado': '300 - 800 m²', 'Potencia': '6000W RMS' }
  },

  // 💡 ILUMINACIÓN PARA DJ & PISTA DE BAILE
  {
    id: 'light-dj-beam7r',
    name: 'Pack Cabezas Móviles Beam 7R DMX (Pareja)',
    category: 'ILUMINACION_DJ',
    brand: 'Chauvet',
    powerWatts: 460,
    coverageM2: 120,
    maxPax: 200,
    dailyPrice: 140,
    totalStock: 10,
    reservedUnits: 2,
    description: 'Haces de luz concentrados y efectos prismáticos sincronizados al ritmo de la música.',
    features: ['Lámpara 7R 230W ultra-brillante', 'Rueda de 14 colores + 17 gobos', 'Prisma rotatorio de 8 facetas'],
    specs: { 'Canales DMX': '16/20', 'Ángulo de haz': '3.8°' }
  },
  {
    id: 'light-dj-laser-geyser',
    name: 'Pack Show Láser RGB 3W + Máquina Humo LED Geyser',
    category: 'ILUMINACION_DJ',
    brand: 'Chauvet',
    powerWatts: 1500,
    coverageM2: 200,
    maxPax: 350,
    dailyPrice: 160,
    totalStock: 10,
    reservedUnits: 1,
    description: 'Efecto pirotécnico frío sin residuos y proyecciones volumétricas 3D para el clímax del evento.',
    features: ['Láser 3000mW ILDA/DMX', 'Efecto Geyser de chorro de humo vertical', 'Líquido homologado CO2 Effect'],
    specs: { 'Disparo': 'Hasta 5 metros vertical', 'Seguridad': 'Interlock' }
  },

  // 🌟 ILUMINACIÓN AMBIENTAL & ARQUITECTURAL PARA EVENTOS
  {
    id: 'light-festoon-vintage',
    name: 'Guirnaldas de Micro-bombillas Vintage Festoon (50 Metros)',
    category: 'ILUMINACION_EVENTOS',
    brand: 'Cameo',
    powerWatts: 150,
    coverageM2: 150,
    maxPax: 200,
    dailyPrice: 110,
    totalStock: 10,
    reservedUnits: 3,
    description: 'Iluminación cálida 2200K estilo verbena de lujo para jardines, carpas y patios rústicos.',
    features: ['50 metros lineales con 100 bombillas LED Filament', 'Regulación de intensidad Dimmable', 'Protección IP65 exterior'],
    specs: { 'Temperatura de color': '2200K Blanco Cálido', 'Voltaje': '230V' }
  },
  {
    id: 'light-uplighting-wireless',
    name: 'Kit 8 Focos Uplighting Batería Inalámbricos RGBW',
    category: 'ILUMINACION_EVENTOS',
    brand: 'Cameo',
    powerWatts: 200,
    coverageM2: 200,
    maxPax: 250,
    dailyPrice: 175,
    totalStock: 10,
    reservedUnits: 2,
    description: 'Bañadores de pared sin cables con 12h de autonomía para iluminar fachadas, árboles y columnas.',
    features: ['100% Inalámbricos a batería de litio', 'Control inalámbrico W-DMX', 'Mezcla de color RGBW + Ámbar'],
    specs: { 'Autonomía': '12 a 18 horas', 'Carga': 'Flightcase de carga rápida' }
  }
];

export class InventoryEngine {
  private static inventoryState: InventoryItem[] = [...INITIAL_INVENTORY];

  public static getCatalog(): InventoryItem[] {
    return this.inventoryState;
  }

  public static getItemById(id: string): InventoryItem | undefined {
    return this.inventoryState.find(item => item.id === id);
  }

  public static getAvailableStock(id: string): number {
    const item = this.getItemById(id);
    if (!item) return 0;
    return Math.max(0, item.totalStock - item.reservedUnits);
  }

  public static reserveUnits(id: string, unitsToReserve: number = 1): { success: boolean; remainingStock: number; message: string } {
    const item = this.inventoryState.find(i => i.id === id);
    if (!item) {
      return { success: false, remainingStock: 0, message: 'Ítem no encontrado en inventario.' };
    }

    const available = item.totalStock - item.reservedUnits;
    if (unitsToReserve > available) {
      return { 
        success: false, 
        remainingStock: available, 
        message: `Stock insuficiente. Solo quedan ${available} unidades disponibles de ${item.name}.` 
      };
    }

    item.reservedUnits += unitsToReserve;
    const remaining = item.totalStock - item.reservedUnits;
    return {
      success: true,
      remainingStock: remaining,
      message: `Reserva exitosa: ${unitsToReserve} unidad(es) de ${item.name} bloqueadas. Disponibles restantes: ${remaining}.`
    };
  }

  /**
   * Recomendador Acústico & Espacial según m2 y aforo
   */
  public static recommendGearForSpace(m2: number, pax: number): {
    recommendedWatts: number;
    recommendedSoundPack: InventoryItem;
    recommendedMics: InventoryItem;
    recommendedLighting: InventoryItem;
    recommendedMixer: InventoryItem;
    estimatedBasePrice: number;
    explanation: string;
  } {
    // 12W por persona o 15W por m2 (lo que demande mayor presión sonora)
    const wattsPax = pax * 12;
    const wattsM2 = m2 * 15;
    const recommendedWatts = Math.max(wattsPax, wattsM2);

    let soundPack: InventoryItem;
    let mixer: InventoryItem;
    let mics: InventoryItem;
    let lighting: InventoryItem;

    if (m2 <= 40 && pax <= 40) {
      soundPack = this.getItemById('pack-lounge-20m2') || this.inventoryState[0];
      mixer = this.getItemById('mix-behringer-xr18')!;
      mics = this.getItemById('mic-shure-qlxd')!;
      lighting = this.getItemById('light-festoon-vintage')!;
    } else if (m2 <= 180 && pax <= 200) {
      soundPack = this.getItemById('pack-gala-100m2') || this.inventoryState[0];
      mixer = this.getItemById('mix-behringer-xr18')!;
      mics = this.getItemById('mic-shure-qlxd')!;
      lighting = this.getItemById('light-dj-beam7r')!;
    } else {
      soundPack = this.getItemById('pack-festival-500m2') || this.inventoryState[0];
      mixer = this.getItemById('mix-behringer-x32')!;
      mics = this.getItemById('mic-shure-axient')!;
      lighting = this.getItemById('light-dj-laser-geyser')!;
    }

    const estimatedBasePrice = soundPack.dailyPrice + lighting.dailyPrice;

    return {
      recommendedWatts,
      recommendedSoundPack: soundPack,
      recommendedMics: mics,
      recommendedLighting: lighting,
      recommendedMixer: mixer,
      estimatedBasePrice,
      explanation: `Para un espacio de ${m2} m² con ${pax} asistentes, la presión acústica mínima requerida es de ${recommendedWatts}W RMS. Se recomienda el ${soundPack.name} con amplificación balanceada y cobertura homogénea.`
    };
  }
}
