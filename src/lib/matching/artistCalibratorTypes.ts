/**
 * 🎸 ARTIST CALIBRATOR — 100 DIMENSIONES BILATERALES (Pareja ↔ Artista)
 * Bloque B1.02 — Tratado Maestro 600D. SSOT de formatos musicales.
 */
import type {
    CalibrationDimension,
    DimensionType,
    DimensionValue
} from './calibratorTypes';

export interface ArtistCalibration {
    artistId: string;
    artistName: string;
    presetSlug: string;
    dimensions: Record<number, DimensionValue>;
    completedAt?: string;
    completionPercent: number;
    calibratedBy: 'self' | 'admin';
}

export interface ArtistMatchResult {
    coupleScore: number;
    artistScore: number;
    bilateralScore: number;
    affinityTier: 'EXACT_MATCH' | 'HIGH_COMPATIBILITY' | 'POTENTIAL_FIT' | 'DISMISSED';
    coupleStrengths: string[];
    artistStrengths: string[];
    warnings: string[];
    knockouts: string[];
    estimatedTotalEur: number;
    dimensionBreakdown: {
        dimensionId: number;
        label: string;
        coupleValue: DimensionValue;
        artistValue: DimensionValue;
        matchPercent: number;
        isKnockout: boolean;
        passed: boolean;
    }[];
}

const PROVINCIAS = [
    'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz',
    'Baleares', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón',
    'Ceuta', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara',
    'Gipuzkoa', 'Huelva', 'Huesca', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas',
    'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Melilla', 'Murcia', 'Navarra',
    'Ourense', 'Palencia', 'Pontevedra', 'Salamanca', 'Segovia', 'Sevilla', 'Soria',
    'Tarragona', 'Tenerife', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya',
    'Zamora', 'Zaragoza'
];

type Row = [string, DimensionType, Record<string, unknown>?];

function build(
    side: 'couple' | 'artist',
    pillar: number,
    pillarName: string,
    startId: number,
    rows: Row[]
): CalibrationDimension[] {
    return rows.map(([label, type, opts = {}], i) => {
        const o = opts as {
            options?: string[];
            min?: number;
            max?: number;
            step?: number;
            defaultValue?: DimensionValue;
            weight?: number;
            isKnockout?: boolean;
        };
        return {
            id: startId + i,
            pillar,
            pillarName,
            label,
            type,
            side,
            options: o.options,
            min: o.min,
            max: o.max,
            step: o.step,
            defaultValue: o.defaultValue,
            weight: o.weight ?? 1,
            isKnockout: o.isKnockout ?? false,
            tooltip: label
        };
    });
}

const ARTIST_FORMATS = [
    'Solista Acústico', 'Mariachi (3-9 pax)', 'Dúo/Trío', 'Cuarteto Cuerda',
    'Banda Pop/Rock (4-6 pax)', 'DJ + Instrumento Live', 'Orquesta Gran Formato (8+ pax)',
    'Charanga', 'Coro Gospel', 'Soprano/Tenor Lírico', 'Flamenco Cuadro', 'Tuna'
];

const GENRES = [
    'Mariachi', 'Pop Español', 'Pop Internacional', 'Rock Clásico', 'Indie',
    'Flamenco Fusión', 'Clásico Litúrgico', 'Bossa/Jazz', 'Celta/Folk',
    'Latino/Salsa', 'Electrónica/House'
];

const MOMENTOS = [
    'Ceremonia (Civil/Religiosa)', 'Cóctel de Bienvenida', 'Sorpresa en Banquete',
    'Baile Nupcial en Directo', 'Fiesta / Barra Libre', 'Serenata Preboda',
    'Brunch Post-Boda'
];

/* ── LADO PAREJA (1-50) ── */
const COUPLE_ARTIST = [
    ...build('couple', 1, 'Formato y Género', 1, [
        ['Formato de Formación Deseado', 'multi-select', { options: ARTIST_FORMATS, weight: 3, isKnockout: true }],
        ['Género Musical Dominante', 'multi-select', { options: GENRES, weight: 2 }],
        ['Instrumentación Requerida', 'multi-select', { options: ['Voz', 'Guitarra', 'Violín', 'Saxofón', 'Piano/Teclado', 'Trompeta', 'Violonchelo', 'Percusión/Cajón', 'Batería', 'Arpa'], weight: 1 }],
        ['Estilo de Voz Preferido', 'select', { options: ['Masculina', 'Femenina', 'Dúo Mixto', 'Instrumental Puro'], weight: 1 }],
        ['Nivel de Showmanship', 'select', { options: ['Ambiente Discreto', 'Animador de Pista', 'Showman Inmersivo'], weight: 1 }],
        ['Idiomas de Interpretación', 'multi-select', { options: ['Español', 'Inglés', 'Italiano', 'Francés', 'Portugués'], weight: 1 }],
        ['Vestuario Escénico Preferido', 'select', { options: ['Traje Charro', 'Etiqueta/Smoking', 'Rústico/Lino', 'Elegante Casual', 'All-Black'], weight: 0.5 }],
        ['Tolerancia a Peticiones Espontáneas', 'toggle', { weight: 1 }],
        ['Canción Nupcial a Medida', 'toggle', { weight: 1 }],
        ['Coreografías o Bailes Guiados', 'toggle', { weight: 1 }]
    ]),
    ...build('couple', 2, 'Momentos y Flexibilidad', 11, [
        ['Necesita Cobertura Ceremonia', 'toggle', { weight: 2 }],
        ['Necesita Cobertura Cóctel', 'toggle', { weight: 1 }],
        ['Necesita Sorpresa en Banquete', 'toggle', { weight: 1 }],
        ['Necesita Baile Nupcial en Directo', 'toggle', { weight: 2 }],
        ['Necesita Cobertura Fiesta', 'toggle', { weight: 2 }],
        ['Necesita Serenata Preboda', 'toggle', { weight: 1 }],
        ['Necesita Brunch Post-Boda', 'toggle', { weight: 1 }],
        ['Duración Requerida', 'select', { options: ['30 min Express', '60 min Estándar', '2x45 min', '3 horas continuas'], weight: 2 }],
        ['Gestión de Música en Descansos', 'toggle', { weight: 1 }],
        ['Préstamo de Micrófono Inalámbrico', 'toggle', { weight: 1 }]
    ]),
    ...build('couple', 3, 'Tarifas y Pagos', 21, [
        ['Presupuesto Música en Vivo (€)', 'slider', { min: 0, max: 8000, step: 100, defaultValue: 1000, weight: 3 }],
        ['Acepta Caché Base Solista 350 €', 'toggle', { weight: 2 }],
        ['Acepta Caché Formación Media (450-750 €)', 'toggle', { weight: 2 }],
        ['Acepta Caché Banda Completa (1200 €+)', 'toggle', { weight: 2 }],
        ['Acepta Tarifa Personalizada', 'toggle', { weight: 1 }],
        ['Hora Extra In Situ', 'slider', { min: 0, max: 500, step: 25, defaultValue: 100, weight: 1 }],
        ['Interés en Paquetes Multi-Pase', 'toggle', { weight: 1 }],
        ['Acepta Price-Lock 100 € Stripe', 'toggle', { weight: 3, isKnockout: true }],
        ['Acepta Split 80/10/10', 'toggle', { weight: 2 }],
        ['Preferencia de Pago Saldo', 'select', { options: ['Transferencia 48h antes', 'Efectivo in situ'], weight: 1 }]
    ]),
    ...build('couple', 4, 'Acústica y Rider', 31, [
        ['Exige Sonido Propio (PA Bose/Shure)', 'toggle', { weight: 2 }],
        ['Permite Conexión a Mesa de Finca', 'toggle', { weight: 1 }],
        ['Acepta Batería Electrónica', 'toggle', { weight: 1 }],
        ['Exige Equipo 100% Autónomo', 'toggle', { weight: 1 }],
        ['Cumplimiento Límite Municipal (<75 dBA)', 'toggle', { weight: 2, isKnockout: true }],
        ['Potencia Eléctrica Disponible', 'select', { options: ['16A', '32A', 'Enchufe estándar'], weight: 1 }],
        ['Exige Iluminación Escénica', 'toggle', { weight: 1 }],
        ['Exige Tarima/Escenario', 'toggle', { weight: 1 }],
        ['Tolerancia Volumen (Mayores/Bebés)', 'scale', { min: 1, max: 5, step: 1, defaultValue: 3, weight: 1 }],
        ['Límite Horario Exterior', 'select', { options: ['22:00', '23:00', '00:00', 'Sin límite'], weight: 2 }]
    ]),
    ...build('couple', 5, 'Logística y Clima', 41, [
        ['Provincia del Evento', 'select', { options: PROVINCIAS, weight: 2 }],
        ['Km Gratuitos Esperados', 'slider', { min: 0, max: 200, step: 10, defaultValue: 50, weight: 1 }],
        ['Acepta Kilometraje 1,50 €/km', 'toggle', { weight: 2 }],
        ['Acepta Alojamiento +120 €', 'toggle', { weight: 1 }],
        ['Exige Camerino Privado', 'toggle', { weight: 1 }],
        ['Exige Menú Caliente Staff', 'toggle', { weight: 1 }],
        ['Exige Sombra / Plan B Interior', 'toggle', { weight: 1 }],
        ['Temperatura Mínima (12 ºC)', 'toggle', { weight: 1 }],
        ['Acceso Carga/Descarga', 'toggle', { weight: 1 }],
        ['Antelación Mínima Reserva (meses)', 'slider', { min: 1, max: 24, step: 1, defaultValue: 3, weight: 1 }]
    ])
];

/* ── LADO ARTISTA (51-100) ── */
const ARTIST_SIDE = [
    ...build('artist', 6, 'Formato y Género (Artista)', 51, [
        ['Formato de Formación', 'select', { options: ARTIST_FORMATS, weight: 3, isKnockout: true }],
        ['Género Dominante', 'multi-select', { options: GENRES, weight: 2 }],
        ['Instrumentación', 'multi-select', { options: ['Voz', 'Guitarra', 'Violín', 'Saxofón', 'Piano/Teclado', 'Trompeta', 'Violonchelo', 'Percusión/Cajón', 'Batería', 'Arpa'], weight: 1 }],
        ['Estilo de Voz', 'select', { options: ['Masculina', 'Femenina', 'Dúo Mixto', 'Instrumental Puro'], weight: 1 }],
        ['Nivel de Showmanship', 'select', { options: ['Ambiente Discreto', 'Animador de Pista', 'Showman Inmersivo'], weight: 1 }],
        ['Idiomas', 'multi-select', { options: ['Español', 'Inglés', 'Italiano', 'Francés', 'Portugués'], weight: 1 }],
        ['Vestuario Escénico', 'select', { options: ['Traje Charro', 'Etiqueta/Smoking', 'Rústico/Lino', 'Elegante Casual', 'All-Black'], weight: 0.5 }],
        ['Acepta Peticiones en Directo', 'toggle', { weight: 1 }],
        ['Ofrece Canción a Medida', 'toggle', { weight: 1 }],
        ['Ofrece Coreografías', 'toggle', { weight: 1 }]
    ]),
    ...build('artist', 7, 'Momentos y Flexibilidad (Artista)', 61, [
        ['Cubre Ceremonia', 'toggle', { weight: 2 }],
        ['Cubre Cóctel', 'toggle', { weight: 1 }],
        ['Cubre Sorpresa Banquete', 'toggle', { weight: 1 }],
        ['Cubre Baile Nupcial', 'toggle', { weight: 2 }],
        ['Cubre Fiesta', 'toggle', { weight: 2 }],
        ['Cubre Serenata Preboda', 'toggle', { weight: 1 }],
        ['Cubre Brunch Post-Boda', 'toggle', { weight: 1 }],
        ['Duración Ofrecida', 'select', { options: ['30 min Express', '60 min Estándar', '2x45 min', '3 horas continuas'], weight: 2 }],
        ['Playlist de Descansos', 'toggle', { weight: 1 }],
        ['Presta Micrófono', 'toggle', { weight: 1 }]
    ]),
    ...build('artist', 8, 'Tarifas y Pagos (Artista)', 71, [
        ['Caché Base (€)', 'slider', { min: 350, max: 3000, step: 50, defaultValue: 350, weight: 3 }],
        ['Acepta Tarifa Personalizada', 'toggle', { weight: 1 }],
        ['Hora Extra (€)', 'slider', { min: 50, max: 500, step: 25, defaultValue: 100, weight: 1 }],
        ['Descuento Multi-Pase', 'toggle', { weight: 1 }],
        ['Price-Lock 100 € Stripe', 'toggle', { weight: 3, isKnockout: true }],
        ['Split Soberano 80/10/10', 'toggle', { weight: 2 }],
        ['Cobro del Saldo', 'select', { options: ['Transferencia 48h antes', 'Efectivo in situ'], weight: 1 }],
        ['Facturación Oficial', 'toggle', { weight: 1 }],
        ['Régimen Fiscal', 'select', { options: ['Autónomo', 'Empresa', 'Asociación'], weight: 1 }],
        ['Depósito de Reserva', 'slider', { min: 50, max: 500, step: 50, defaultValue: 100, weight: 1 }]
    ]),
    ...build('artist', 9, 'Acústica y Rider (Artista)', 81, [
        ['Aporta Sonido Propio', 'toggle', { weight: 2 }],
        ['Conexión a Mesa de Finca', 'toggle', { weight: 1 }],
        ['Batería Electrónica', 'toggle', { weight: 1 }],
        ['Equipo 100% Autónomo', 'toggle', { weight: 1 }],
        ['Cumple Límite <75 dBA', 'toggle', { weight: 2, isKnockout: true }],
        ['Potencia Requerida', 'select', { options: ['16A', '32A', 'Enchufe estándar'], weight: 1 }],
        ['Iluminación Propia', 'toggle', { weight: 1 }],
        ['Necesita Tarima', 'toggle', { weight: 1 }],
        ['Tolerancia de Volumen', 'scale', { min: 1, max: 5, step: 1, defaultValue: 3, weight: 1 }],
        ['Límite Horario Exterior', 'select', { options: ['22:00', '23:00', '00:00', 'Sin límite'], weight: 2 }]
    ]),
    ...build('artist', 10, 'Logística y Clima (Artista)', 91, [
        ['Base Geográfica', 'select', { options: [...PROVINCIAS, 'Portugal', 'Francia', 'Internacional'], weight: 2 }],
        ['Km Gratuitos', 'slider', { min: 0, max: 200, step: 10, defaultValue: 50, weight: 1 }],
        ['Kilometraje Adicional 1,50 €/km', 'toggle', { weight: 2 }],
        ['Exige Alojamiento +120 €', 'toggle', { weight: 1 }],
        ['Camerino Privado', 'select', { options: ['Imprescindible', 'Recomendable', 'No necesario'], weight: 1 }],
        ['Manutención Staff', 'select', { options: ['Imprescindible', 'Recomendable', 'No necesaria'], weight: 1 }],
        ['Plan B Clima <10 min', 'toggle', { weight: 1 }],
        ['Temperatura Mínima 12 ºC', 'toggle', { weight: 1 }],
        ['Acceso Vehículo a Pie de Escenario', 'toggle', { weight: 1 }],
        ['Bodas por Día / Antelación', 'slider', { min: 1, max: 4, step: 1, defaultValue: 1, weight: 1 }]
    ])
];

export const ARTIST_CALIBRATION_DIMENSIONS: CalibrationDimension[] = [
    ...COUPLE_ARTIST,
    ...ARTIST_SIDE
];

export const ARTIST_COUPLE_TO_PROVIDER_PAIRS: Record<number, number | null> = {
    1: 51, 2: 52, 3: 53, 4: 54, 5: 55, 6: 56, 7: 57, 8: 58, 9: 59, 10: 60,
    11: 61, 12: 62, 13: 63, 14: 64, 15: 65, 16: 66, 17: 67, 18: 68, 19: 69, 20: 70,
    21: 71, 22: 71, 23: 71, 24: 71, 25: 72, 26: 73, 27: 74, 28: 75, 29: 76, 30: 77,
    31: 81, 32: 82, 33: 83, 34: 84, 35: 85, 36: 86, 37: 87, 38: 88, 39: 89, 40: 90,
    41: 91, 42: 92, 43: 93, 44: 94, 45: 95, 46: 96, 47: 97, 48: 98, 49: 99, 50: 100
};

export const ARTIST_GATE_DIMENSION_IDS: number[] = [
    51, 71, 74, 75, 85, 91, 93
];

export function getArtistCoupleDimensions(): CalibrationDimension[] {
    return ARTIST_CALIBRATION_DIMENSIONS.filter((d) => d.side === 'couple');
}

export function getArtistDimensions(): CalibrationDimension[] {
    return ARTIST_CALIBRATION_DIMENSIONS.filter((d) => d.side === 'artist');
}

export function getArtistDimensionById(id: number): CalibrationDimension | undefined {
    return ARTIST_CALIBRATION_DIMENSIONS.find((d) => d.id === id);
}