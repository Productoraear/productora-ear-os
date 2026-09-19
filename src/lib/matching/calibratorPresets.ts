/**
 * 🏛️ PRESETS DEL CALIBRADOR — PRECONFIGURACIÓN INTELIGENTE
 * Cada finca arranca con su calibrador al ~85% resuelto según tipología.
 */
import type { DimensionValue, ProviderCalibration } from './calibratorTypes';

export type PresetSlug =
  | 'palacio-historico'
  | 'cortijo-rural'
  | 'masia-catalana'
  | 'finca-vanguardista'
  | 'bodega-vinedo'
  | 'invernadero-botanico'
  | 'hacienda-andaluza'
  | 'pazo-gallego';

export interface CalibratorPreset {
  slug: PresetSlug;
  name: string;
  icon: string;
  sweetSpot: number;
  ticketMin: number;
  ticketMax: number;
  partyHour: string;
  kitchen: 'Propia' | 'Catering';
  rooms: [number, number];
}

export const CALIBRATOR_PRESET_META: CalibratorPreset[] = [
  { slug: 'palacio-historico', name: 'Palacio Histórico', icon: '🏰', sweetSpot: 180, ticketMin: 25000, ticketMax: 60000, partyHour: '03:00', kitchen: 'Propia', rooms: [12, 20] },
  { slug: 'cortijo-rural', name: 'Cortijo Rural', icon: '🌾', sweetSpot: 130, ticketMin: 15000, ticketMax: 35000, partyHour: '05:00', kitchen: 'Catering', rooms: [6, 10] },
  { slug: 'masia-catalana', name: 'Masía Catalana', icon: '🪨', sweetSpot: 150, ticketMin: 20000, ticketMax: 45000, partyHour: '04:00', kitchen: 'Propia', rooms: [8, 15] },
  { slug: 'finca-vanguardista', name: 'Finca Vanguardista', icon: '🛸', sweetSpot: 200, ticketMin: 22000, ticketMax: 55000, partyHour: '06:00', kitchen: 'Catering', rooms: [0, 4] },
  { slug: 'bodega-vinedo', name: 'Bodega / Viñedo', icon: '🍷', sweetSpot: 110, ticketMin: 18000, ticketMax: 40000, partyHour: '03:00', kitchen: 'Propia', rooms: [4, 8] },
  { slug: 'invernadero-botanico', name: 'Invernadero Botánico', icon: '🌿', sweetSpot: 140, ticketMin: 20000, ticketMax: 50000, partyHour: '04:00', kitchen: 'Catering', rooms: [0, 0] },
  { slug: 'hacienda-andaluza', name: 'Hacienda Andaluza', icon: '🐎', sweetSpot: 170, ticketMin: 18000, ticketMax: 42000, partyHour: '05:00', kitchen: 'Propia', rooms: [10, 18] },
  { slug: 'pazo-gallego', name: 'Pazo Gallego', icon: '⛲', sweetSpot: 140, ticketMin: 16000, ticketMax: 38000, partyHour: '04:00', kitchen: 'Propia', rooms: [6, 12] }
];

function completionOf(dimensions: Record<number, DimensionValue>): number {
  const filled = Object.keys(dimensions).filter((k) => {
    const v = dimensions[Number(k)];
    return v !== undefined && v !== null && v !== '';
  }).length;
  return Math.round((filled / 100) * 100);
}

function makePreset(
  providerId: string,
  providerName: string,
  slug: PresetSlug,
  dimensions: Record<number, DimensionValue>
): ProviderCalibration {
  return {
    providerId,
    providerName,
    presetSlug: slug,
    dimensions,
    completionPercent: completionOf(dimensions),
    calibratedBy: 'self'
  };
}

const COMMON_ANTI_LEAD = {
  191: true, 192: true, 193: 300, 194: 12000, 195: 50,
  196: true, 197: false, 198: true, 199: true, 200: false
};

export const PRESET_PALACIO_HISTORICO: Partial<ProviderCalibration> = {
  presetSlug: 'palacio-historico',
  dimensions: {
    101: 25000, 102: 80000, 103: 140, 104: 65, 105: 4500, 106: 25000,
    107: true, 108: 800, 109: 200, 110: 200, 111: 100, 112: 5,
    113: 100, 114: 300, 115: 180, 116: false, 117: true,
    118: ['Boda completa'], 119: true, 120: false, 121: true, 122: 1,
    123: true, 124: 'Acepta cualquier catering', 125: true, 126: 16, 127: 30,
    128: 'Sí', 129: true, 130: true, 131: 'Sí (con concejal)', 132: true, 133: true, 134: '32A',
    135: ['Palacio'], 136: ['Jardines'], 137: 'Salón acristalado', 138: ['Clásico-Elegante'],
    139: 12000, 140: true, 141: 6, 142: true, 143: '>500 años', 144: true,
    145: 12, 146: '3 platos sentados', 147: true, 148: 120,
    149: ['Jamón', 'Quesos', 'Arroces'], 150: ['Celíacos', 'Veganos', 'Alergias severas'],
    151: true, 152: 'Con coste extra', 153: ['Mesa dulce'], 154: 5,
    155: 4, 156: 12, 157: 'Premium', 158: true, 159: '03:00', 160: true,
    161: true, 162: 120, 163: true, 164: true,
    165: 150, 166: true, 167: '100% adaptado', 168: false, 169: 12, 170: 90, 171: 700, 172: '10:00',
    173: 82, 174: true, 175: '00:00', 176: 40, 177: true, 178: false, 179: true, 180: true,
    181: ['Mayo', 'Junio', 'Julio', 'Septiembre', 'Octubre'], 182: ['Jueves', 'Viernes', 'Sábado', 'Domingo'],
    183: 1, 184: true, 185: true, 186: true, 187: true, 188: 6, 189: 10, 190: 'Todo el año',
    ...COMMON_ANTI_LEAD
  }
};

export const PRESET_CORTIJO_RURAL: Partial<ProviderCalibration> = {
  presetSlug: 'cortijo-rural',
  dimensions: {
    101: 15000, 102: 45000, 103: 110, 104: 50, 105: 2500, 106: 15000,
    107: true, 108: 400, 109: 150, 110: 150, 111: 100, 112: 15,
    113: 80, 114: 220, 115: 130, 116: false, 117: false,
    118: ['Boda completa', 'Recepción'], 119: false, 120: true, 121: true, 122: 2,
    123: false, 124: 'Acepta cualquier catering', 125: true, 126: 8, 127: 16,
    128: 'Con coste adicional', 129: true, 130: false, 131: 'Sí (con concejal)', 132: true, 133: true, 134: '16A',
    135: ['Cortijo'], 136: ['Campo', 'Sierra'], 137: 'Carpa fija', 138: ['Rústico-Chic'],
    139: 25000, 140: true, 141: 4, 142: true, 143: '100-300', 144: false,
    145: 10, 146: 'Buffet', 147: true, 148: 80,
    149: ['Jamón', 'Brasa', 'Arroces'], 150: ['Celíacos', 'Veganos'],
    151: false, 152: 'Con coste extra', 153: ['Churros', 'Mesa dulce'], 154: 3,
    155: 3, 156: 10, 157: 'Estándar', 158: true, 159: '05:00', 160: true,
    161: false, 162: 80, 163: true, 164: true,
    165: 100, 166: true, 167: 'Parcial', 168: false, 169: 15, 170: 120, 171: 600, 172: '10:00',
    173: 88, 174: false, 175: '00:00', 176: 20, 177: true, 178: true, 179: true, 180: true,
    181: ['Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre'],
    182: ['Viernes', 'Sábado', 'Domingo'],
    183: 2, 184: true, 185: true, 186: true, 187: true, 188: 3, 189: 5, 190: 'Todo el año',
    ...COMMON_ANTI_LEAD
  }
};

export const PRESET_MASIA_CATALANA: Partial<ProviderCalibration> = {
  presetSlug: 'masia-catalana',
  dimensions: {
    101: 20000, 102: 55000, 103: 125, 104: 55, 105: 3000, 106: 18000,
    107: true, 108: 600, 109: 150, 110: 150, 111: 100, 112: 10,
    113: 80, 114: 200, 115: 150, 116: false, 117: false,
    118: ['Boda completa'], 119: true, 120: false, 121: true, 122: 1,
    123: true, 124: 'Acepta cualquier catering', 125: true, 126: 12, 127: 22,
    128: 'Sí', 129: true, 130: true, 131: 'Sí (con concejal)', 132: true, 133: true, 134: '32A',
    135: ['Masía'], 136: ['Sierra', 'Pinar', 'Jardines'], 137: 'Salón acristalado', 138: ['Rústico-Chic', 'Clásico-Elegante'],
    139: 9000, 140: true, 141: 5, 142: true, 143: '300-500', 144: true,
    145: 12, 146: '3 platos sentados', 147: true, 148: 100,
    149: ['Quesos', 'Arroces', 'Brasa'], 150: ['Celíacos', 'Veganos', 'Alergias severas'],
    151: true, 152: 'Con coste extra', 153: ['Mesa dulce'], 154: 4,
    155: 4, 156: 11, 157: 'Premium', 158: true, 159: '04:00', 160: true,
    161: true, 162: 100, 163: true, 164: true,
    165: 120, 166: true, 167: '100% adaptado', 168: false, 169: 10, 170: 80, 171: 500, 172: '10:00',
    173: 84, 174: true, 175: '23:00', 176: 32, 177: true, 178: false, 179: true, 180: true,
    181: ['Mayo', 'Junio', 'Julio', 'Septiembre', 'Octubre'],
    182: ['Viernes', 'Sábado', 'Domingo'],
    183: 1, 184: true, 185: true, 186: true, 187: true, 188: 4, 189: 8, 190: 'Todo el año',
    ...COMMON_ANTI_LEAD
  }
};

export const PRESET_FINCA_VANGUARDISTA: Partial<ProviderCalibration> = {
  presetSlug: 'finca-vanguardista',
  dimensions: {
    101: 22000, 102: 65000, 103: 130, 104: 55, 105: 3500, 106: 20000,
    107: true, 108: 500, 109: 200, 110: 200, 111: 150, 112: 20,
    113: 100, 114: 350, 115: 200, 116: false, 117: true,
    118: ['Boda completa', 'Evento corporativo', 'Cóctel-only'], 119: true, 120: true, 121: true, 122: 3,
    123: false, 124: 'Acepta cualquier catering', 125: true, 126: 2, 127: 4,
    128: 'Con coste adicional', 129: true, 130: false, 131: 'Solo simbólica', 132: true, 133: true, 134: '63A',
    135: ['Vanguardista'], 136: ['Urbano', 'Campo'], 137: 'Nave', 138: ['Minimalista', 'Industrial'],
    139: 8000, 140: true, 141: 7, 142: true, 143: '<50 años', 144: false,
    145: 14, 146: 'Estaciones', 147: true, 148: 100,
    149: ['Sushi', 'Showcooking', 'Brasa'], 150: ['Celíacos', 'Veganos', 'Alergias severas'],
    151: true, 152: 'Con coste extra', 153: ['Minihamburguesas', 'Mesa dulce'], 154: 4,
    155: 4, 156: 12, 157: 'Ultra-Premium', 158: true, 159: '06:00', 160: true,
    161: true, 162: 180, 163: true, 164: true,
    165: 200, 166: true, 167: '100% adaptado', 168: true, 169: 8, 170: 30, 171: 550, 172: '08:00',
    173: 95, 174: false, 175: 'Sin corte', 176: 60, 177: true, 178: false, 179: true, 180: true,
    181: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    182: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    183: 3, 184: true, 185: true, 186: true, 187: true, 188: 2, 189: 15, 190: 'Todo el año',
    ...COMMON_ANTI_LEAD
  }
};

export const PRESET_BODEGA_VINEDO: Partial<ProviderCalibration> = {
  presetSlug: 'bodega-vinedo',
  dimensions: {
    101: 18000, 102: 50000, 103: 115, 104: 50, 105: 3000, 106: 16000,
    107: true, 108: 500, 109: 150, 110: 150, 111: 100, 112: 10,
    113: 60, 114: 160, 115: 110, 116: true, 117: false,
    118: ['Boda completa', 'Recepción'], 119: true, 120: false, 121: true, 122: 2,
    123: true, 124: 'Acepta cualquier catering', 125: true, 126: 6, 127: 10,
    128: 'Sí', 129: false, 130: false, 131: 'Solo simbólica', 132: true, 133: true, 134: '32A',
    135: ['Bodega'], 136: ['Viñedos', 'Campo'], 137: 'Salón acristalado', 138: ['Rústico-Chic'],
    139: 15000, 140: true, 141: 4, 142: true, 143: '100-300', 144: true,
    145: 12, 146: '5 pases degustación', 147: true, 148: 80,
    149: ['Quesos', 'Jamón', 'Arroces'], 150: ['Celíacos', 'Veganos'],
    151: true, 152: 'Con coste extra', 153: ['Mesa dulce'], 154: 4,
    155: 3, 156: 10, 157: 'Premium', 158: true, 159: '03:00', 160: true,
    161: false, 162: 80, 163: true, 164: true,
    165: 120, 166: true, 167: 'Parcial', 168: false, 169: 18, 170: 110, 171: 750, 172: '10:00',
    173: 85, 174: true, 175: '00:00', 176: 30, 177: true, 178: false, 179: true, 180: true,
    181: ['Mayo', 'Junio', 'Julio', 'Septiembre', 'Octubre'],
    182: ['Jueves', 'Viernes', 'Sábado', 'Domingo'],
    183: 1, 184: true, 185: true, 186: true, 187: true, 188: 5, 189: 8, 190: 'Todo el año',
    ...COMMON_ANTI_LEAD
  }
};

export const PRESET_INVERNADERO_BOTANICO: Partial<ProviderCalibration> = {
  presetSlug: 'invernadero-botanico',
  dimensions: {
    101: 20000, 102: 55000, 103: 120, 104: 50, 105: 3500, 106: 18000,
    107: true, 108: 500, 109: 200, 110: 200, 111: 150, 112: 10,
    113: 80, 114: 220, 115: 140, 116: false, 117: false,
    118: ['Boda completa'], 119: false, 120: false, 121: true, 122: 2,
    123: false, 124: 'Acepta cualquier catering', 125: false, 126: 0, 127: 0,
    128: 'No', 129: false, 130: false, 131: 'Solo simbólica', 132: true, 133: true, 134: '63A',
    135: ['Invernadero'], 136: ['Jardines', 'Campo'], 137: 'Invernadero', 138: ['Tropical', 'Minimalista'],
    139: 6000, 140: true, 141: 4, 142: true, 143: '<50 años', 144: false,
    145: 10, 146: 'Estaciones', 147: true, 148: 90,
    149: ['Sushi', 'Showcooking', 'Quesos'], 150: ['Celíacos', 'Veganos', 'Alergias severas'],
    151: true, 152: 'Con coste extra', 153: ['Mesa dulce'], 154: 4,
    155: 3, 156: 11, 157: 'Premium', 158: true, 159: '04:00', 160: true,
    161: false, 162: 90, 163: true, 164: true,
    165: 120, 166: true, 167: '100% adaptado', 168: false, 169: 10, 170: 70, 171: 600, 172: '10:00',
    173: 86, 174: false, 175: '00:00', 176: 35, 177: true, 178: false, 179: true, 180: true,
    181: ['Abril', 'Mayo', 'Junio', 'Julio', 'Septiembre', 'Octubre'],
    182: ['Viernes', 'Sábado', 'Domingo'],
    183: 2, 184: true, 185: true, 186: true, 187: true, 188: 4, 189: 8, 190: 'Todo el año',
    ...COMMON_ANTI_LEAD
  }
};

export const PRESET_HACIENDA_ANDALUZA: Partial<ProviderCalibration> = {
  presetSlug: 'hacienda-andaluza',
  dimensions: {
    101: 18000, 102: 50000, 103: 110, 104: 50, 105: 2800, 106: 16000,
    107: true, 108: 500, 109: 150, 110: 150, 111: 100, 112: 10,
    113: 80, 114: 260, 115: 170, 116: false, 117: true,
    118: ['Boda completa', 'Recepción'], 119: false, 120: true, 121: true, 122: 2,
    123: true, 124: 'Acepta cualquier catering', 125: true, 126: 14, 127: 26,
    128: 'Sí', 129: true, 130: true, 131: 'Sí (con concejal)', 132: true, 133: true, 134: '32A',
    135: ['Hacienda'], 136: ['Campo', 'Jardines'], 137: 'Salón acristalado', 138: ['Rústico-Chic', 'Clásico-Elegante'],
    139: 18000, 140: true, 141: 5, 142: true, 143: '100-300', 144: true,
    145: 12, 146: '3 platos sentados', 147: true, 148: 100,
    149: ['Jamón', 'Arroces', 'Brasa'], 150: ['Celíacos', 'Veganos'],
    151: true, 152: 'Con coste extra', 153: ['Churros', 'Mesa dulce'], 154: 4,
    155: 3, 156: 10, 157: 'Estándar', 158: true, 159: '05:00', 160: true,
    161: false, 162: 100, 163: true, 164: true,
    165: 140, 166: true, 167: '100% adaptado', 168: false, 169: 14, 170: 100, 171: 400, 172: '10:00',
    173: 90, 174: false, 175: '00:00', 176: 25, 177: true, 178: true, 179: true, 180: true,
    181: ['Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Septiembre', 'Octubre'],
    182: ['Viernes', 'Sábado', 'Domingo'],
    183: 2, 184: true, 185: true, 186: true, 187: true, 188: 3, 189: 5, 190: 'Todo el año',
    ...COMMON_ANTI_LEAD
  }
};

export const PRESET_PAZO_GALLEGO: Partial<ProviderCalibration> = {
  presetSlug: 'pazo-gallego',
  dimensions: {
    101: 16000, 102: 45000, 103: 115, 104: 50, 105: 2800, 106: 14000,
    107: true, 108: 500, 109: 150, 110: 150, 111: 100, 112: 10,
    113: 80, 114: 200, 115: 140, 116: false, 117: false,
    118: ['Boda completa'], 119: true, 120: false, 121: true, 122: 1,
    123: true, 124: 'Acepta cualquier catering', 125: true, 126: 9, 127: 16,
    128: 'Sí', 129: true, 130: true, 131: 'Sí (con concejal)', 132: true, 133: true, 134: '32A',
    135: ['Pazo'], 136: ['Jardines', 'Ribera'], 137: 'Salón acristalado', 138: ['Clásico-Elegante'],
    139: 10000, 140: true, 141: 5, 142: true, 143: '300-500', 144: true,
    145: 12, 146: '3 platos sentados', 147: true, 148: 100,
    149: ['Quesos', 'Arroces', 'Jamón'], 150: ['Celíacos', 'Veganos', 'Alergias severas'],
    151: true, 152: 'Con coste extra', 153: ['Mesa dulce'], 154: 4,
    155: 4, 156: 11, 157: 'Premium', 158: true, 159: '04:00', 160: true,
    161: true, 162: 100, 163: true, 164: true,
    165: 100, 166: true, 167: '100% adaptado', 168: false, 169: 10, 170: 90, 171: 300, 172: '10:00',
    173: 84, 174: true, 175: '23:00', 176: 30, 177: true, 178: false, 179: true, 180: true,
    181: ['Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'],
    182: ['Viernes', 'Sábado', 'Domingo'],
    183: 1, 184: true, 185: true, 186: true, 187: true, 188: 4, 189: 8, 190: 'Todo el año',
    ...COMMON_ANTI_LEAD
  }
};

export const PRESET_MAP: Record<PresetSlug, Partial<ProviderCalibration>> = {
  'palacio-historico': PRESET_PALACIO_HISTORICO,
  'cortijo-rural': PRESET_CORTIJO_RURAL,
  'masia-catalana': PRESET_MASIA_CATALANA,
  'finca-vanguardista': PRESET_FINCA_VANGUARDISTA,
  'bodega-vinedo': PRESET_BODEGA_VINEDO,
  'invernadero-botanico': PRESET_INVERNADERO_BOTANICO,
  'hacienda-andaluza': PRESET_HACIENDA_ANDALUZA,
  'pazo-gallego': PRESET_PAZO_GALLEGO
};

export function buildCalibrationFromPreset(
  providerId: string,
  providerName: string,
  slug: PresetSlug
): ProviderCalibration {
  const preset = PRESET_MAP[slug] ?? PRESET_CORTIJO_RURAL;
  return makePreset(providerId, providerName, slug, preset.dimensions ?? {});
}

export function detectPresetByTypology(
  typology?: string,
  hasOwnKitchen?: boolean,
  roomCount?: number
): PresetSlug {
  const t = (typology || '').toLowerCase();
  if (t.includes('palacio') || t.includes('castillo')) return 'palacio-historico';
  if (t.includes('cortijo') || t.includes('finca rústica')) return 'cortijo-rural';
  if (t.includes('masía') || t.includes('masia')) return 'masia-catalana';
  if (t.includes('vanguardista') || t.includes('moderno') || t.includes('nave')) return 'finca-vanguardista';
  if (t.includes('bodega') || t.includes('viñedo') || t.includes('vinedo')) return 'bodega-vinedo';
  if (t.includes('invernadero') || t.includes('botánico') || t.includes('botanico')) return 'invernadero-botanico';
  if (t.includes('hacienda') || t.includes('andaluz')) return 'hacienda-andaluza';
  if (t.includes('pazo') || t.includes('gallego')) return 'pazo-gallego';

  // Heurística de respaldo por infraestructura
  if (hasOwnKitchen && (roomCount ?? 0) >= 10) return 'hacienda-andaluza';
  if ((roomCount ?? 0) === 0) return 'invernadero-botanico';
  return 'cortijo-rural';
}