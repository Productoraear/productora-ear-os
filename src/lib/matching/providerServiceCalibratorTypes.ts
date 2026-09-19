/**
 * 📦 PROVIDER SERVICE CALIBRATOR — 100 DIMENSIONES BILATERALES (Pareja ↔ Proveedor B2B/B2G)
 * Bloque B1.02 — Tratado Maestro 600D. Catering, Foto/Vídeo, Buses, Estructuras, Sonido.
 */
import type {
    CalibrationDimension,
    DimensionType,
    DimensionValue
} from './calibratorTypes';

export interface ProviderServiceCalibration {
    providerServiceId: string;
    providerServiceName: string;
    presetSlug: string;
    dimensions: Record<number, DimensionValue>;
    completedAt?: string;
    completionPercent: number;
    calibratedBy: 'self' | 'admin';
}

export interface ProviderServiceMatchResult {
    coupleScore: number;
    providerServiceScore: number;
    bilateralScore: number;
    affinityTier: 'EXACT_MATCH' | 'HIGH_COMPATIBILITY' | 'POTENTIAL_FIT' | 'DISMISSED';
    coupleStrengths: string[];
    providerStrengths: string[];
    warnings: string[];
    knockouts: string[];
    estimatedTotalEur: number;
    dimensionBreakdown: {
        dimensionId: number;
        label: string;
        coupleValue: DimensionValue;
        providerValue: DimensionValue;
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

const CATEGORIAS = [
    'Catering', 'Fotografía', 'Vídeo', 'Sonido/Luces B2G', 'Carpas', 'Flores',
    'Autobuses', 'Planners', 'Animación', 'Mobiliario'
];

type Row = [string, DimensionType, Record<string, unknown>?];

function build(
    side: 'couple' | 'providerService',
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

/* ── LADO PAREJA (1-50) ── */
const COUPLE_SERVICE = [
    ...build('couple', 1, 'Categoría y Certificaciones', 1, [
        ['Categoría de Servicio Requerida', 'select', { options: CATEGORIAS, weight: 3, isKnockout: true }],
        ['Aforo Previsto del Evento (pax)', 'slider', { min: 30, max: 1000, step: 10, defaultValue: 150, weight: 2 }],
        ['Exige Registro Sanitario RGSEAA', 'toggle', { weight: 2 }],
        ['Exige Certificado Drones AESA', 'toggle', { weight: 1 }],
        ['Exige Carnet Instalador BT', 'toggle', { weight: 2 }],
        ['Exige Factura FACe / DIR3', 'toggle', { weight: 2 }],
        ['Póliza RC Mínima Exigida', 'select', { options: ['300k€', '600k€', '1.2M€'], weight: 1 }],
        ['Años de Experiencia Mínimos', 'slider', { min: 0, max: 20, step: 1, defaultValue: 3, weight: 1 }],
        ['Exige PRL y CAE', 'toggle', { weight: 1 }],
        ['Exige Vehículos con Tarjeta Transporte', 'toggle', { weight: 1 }]
    ]),
    ...build('couple', 2, 'Presupuestos y Cobros', 11, [
        ['Presupuesto del Servicio (€)', 'slider', { min: 300, max: 30000, step: 100, defaultValue: 2500, weight: 3 }],
        ['Precio Máximo Menú Adulto (€/pax)', 'slider', { min: 60, max: 250, step: 5, defaultValue: 120, weight: 2 }],
        ['Acepta Price-Lock 100 € Stripe', 'toggle', { weight: 3, isKnockout: true }],
        ['Acepta Split 80/10/10', 'toggle', { weight: 2 }],
        ['Plazo de Cobro Preferido', 'select', { options: ['30/50/20', '50/50', '100% al contratar', 'A 30 días B2G'], weight: 1 }],
        ['Acepta Fianza de Daños', 'toggle', { weight: 1 }],
        ['Interesa Descuento Paquetes', 'toggle', { weight: 1 }],
        ['Interesa Descuento Temporada Baja', 'toggle', { weight: 1 }],
        ['Tarifa Hora Extra Aceptable (€)', 'slider', { min: 50, max: 500, step: 25, defaultValue: 150, weight: 1 }],
        ['Ticket Mínimo Aceptable', 'slider', { min: 300, max: 5000, step: 100, defaultValue: 800, weight: 1 }]
    ]),
    ...build('couple', 3, 'Gastronomía y Producción', 21, [
        ['Modelo de Cocina', 'select', { options: ['Cocina 100% In Situ', 'Comida Transportada', 'Indiferente'], weight: 2 }],
        ['Nº de Pases en Cóctel', 'slider', { min: 0, max: 24, step: 1, defaultValue: 12, weight: 1 }],
        ['Estaciones Temáticas', 'multi-select', { options: ['Jamón', 'Pulpo', 'Arroces', 'Showcooking'], weight: 1 }],
        ['Menús Especiales', 'multi-select', { options: ['Celíacos sin trazas', 'Veganos'], weight: 2 }],
        ['Prueba de Menú Gratuita', 'toggle', { weight: 1 }],
        ['Horas de Barra Libre', 'slider', { min: 0, max: 8, step: 1, defaultValue: 4, weight: 1 }],
        ['Fotógrafos Simultáneos', 'select', { options: ['1', '2'], weight: 1 }],
        ['Entrega Same-Day / Teaser 48h', 'toggle', { weight: 1 }],
        ['Vídeo 4K con Brutos', 'toggle', { weight: 1 }],
        ['Galería Cloud Mínimo 1 Año', 'toggle', { weight: 1 }]
    ]),
    ...build('couple', 4, 'Infraestructura y B2G', 31, [
        ['Superficie de Carpas (m²)', 'slider', { min: 0, max: 3000, step: 50, defaultValue: 300, weight: 1 }],
        ['Exige Tarima Fenólica y Moqueta', 'toggle', { weight: 1 }],
        ['Exige Climatización Móvil', 'toggle', { weight: 1 }],
        ['Exige Ignifugación M2 y Ensayos Viento', 'toggle', { weight: 1 }],
        ['Exige Generador de Rescate', 'toggle', { weight: 1 }],
        ['Potencia Line Array B2G', 'select', { options: ['500 pax', '1000 pax', '2500 pax', '5000 pax'], weight: 2 }],
        ['Capacidad Flota Autobuses', 'slider', { min: 0, max: 500, step: 10, defaultValue: 100, weight: 1 }],
        ['Exige Adaptación PMR', 'toggle', { weight: 2 }],
        ['Mobiliario en Propiedad', 'toggle', { weight: 1 }],
        ['Iluminación Micro-LED', 'toggle', { weight: 1 }]
    ]),
    ...build('couple', 5, 'Operativa y Calendario', 41, [
        ['Provincia del Evento', 'select', { options: PROVINCIAS, weight: 2 }],
        ['Radio de Operatividad (km)', 'slider', { min: 10, max: 500, step: 10, defaultValue: 200, weight: 1 }],
        ['Eventos Concurrentes Mismo Día', 'slider', { min: 1, max: 10, step: 1, defaultValue: 3, weight: 1 }],
        ['Tiempos de Montaje', 'select', { options: ['Mismo día', '24h antes', '48h antes'], weight: 1 }],
        ['Tiempos de Desmontaje', 'select', { options: ['Nocturno inmediato', 'Día siguiente'], weight: 1 }],
        ['Reubicación por Causa Mayor', 'toggle', { weight: 1 }],
        ['Reunión Técnica Previa', 'toggle', { weight: 1 }],
        ['Backup <3h por Avería', 'toggle', { weight: 2 }],
        ['Gestión Ecoembes / Donación', 'toggle', { weight: 1 }],
        ['Mediación Arbitral EAR OS', 'toggle', { weight: 1 }]
    ])
];

/* ── LADO PROVEEDOR (51-100) ── */
const PROVIDER_SERVICE_SIDE = [
    ...build('providerService', 6, 'Categoría y Certificaciones (Proveedor)', 51, [
        ['Categoría Principal', 'select', { options: CATEGORIAS, weight: 3, isKnockout: true }],
        ['Aforo Óptimo Min', 'slider', { min: 30, max: 500, step: 10, defaultValue: 80, weight: 1 }],
        ['Aforo Óptimo Max', 'slider', { min: 50, max: 1000, step: 10, defaultValue: 300, weight: 2, isKnockout: true }],
        ['Registro RGSEAA', 'toggle', { weight: 2 }],
        ['Certificado Drones AESA', 'toggle', { weight: 1 }],
        ['Carnet Instalador BT', 'toggle', { weight: 2 }],
        ['Factura FACe / DIR3', 'toggle', { weight: 2 }],
        ['Póliza RC', 'select', { options: ['300k€', '600k€', '1.2M€'], weight: 1 }],
        ['PRL y CAE', 'toggle', { weight: 1 }],
        ['Vehículos con Tarjeta Transporte', 'toggle', { weight: 1 }]
    ]),
    ...build('providerService', 7, 'Presupuestos y Cobros (Proveedor)', 61, [
        ['Ticket Mínimo', 'slider', { min: 300, max: 10000, step: 100, defaultValue: 1500, weight: 3 }],
        ['Precio Menú Adulto', 'slider', { min: 60, max: 250, step: 5, defaultValue: 120, weight: 2 }],
        ['Price-Lock 100 € Stripe', 'toggle', { weight: 3, isKnockout: true }],
        ['Split 80/10/10', 'toggle', { weight: 2 }],
        ['Plazos de Cobro', 'select', { options: ['30/50/20', '50/50', '100% al contratar', 'A 30 días B2G'], weight: 1 }],
        ['Fianza de Daños', 'toggle', { weight: 1 }],
        ['Descuento Paquetes', 'toggle', { weight: 1 }],
        ['Descuento Temporada Baja', 'toggle', { weight: 1 }],
        ['Tarifa Hora Extra', 'slider', { min: 50, max: 500, step: 25, defaultValue: 150, weight: 1 }],
        ['Precio por Unidad', 'slider', { min: 0, max: 500, step: 5, defaultValue: 50, weight: 1 }]
    ]),
    ...build('providerService', 8, 'Gastronomía y Producción (Proveedor)', 71, [
        ['Cocina 100% In Situ', 'toggle', { weight: 2 }],
        ['Nº Pases Cóctel', 'slider', { min: 0, max: 24, step: 1, defaultValue: 12, weight: 1 }],
        ['Estaciones Temáticas', 'multi-select', { options: ['Jamón', 'Pulpo', 'Arroces', 'Showcooking'], weight: 1 }],
        ['Menús Especiales Aislados', 'multi-select', { options: ['Celíacos sin trazas', 'Veganos'], weight: 2 }],
        ['Prueba de Menú Gratuita', 'toggle', { weight: 1 }],
        ['Barra Libre Horas', 'slider', { min: 0, max: 8, step: 1, defaultValue: 4, weight: 1 }],
        ['Fotógrafos Simultáneos', 'select', { options: ['1', '2'], weight: 1 }],
        ['Same-Day / Teaser 48h', 'toggle', { weight: 1 }],
        ['Vídeo 4K Brutos', 'toggle', { weight: 1 }],
        ['Galería Cloud 1 Año', 'toggle', { weight: 1 }]
    ]),
    ...build('providerService', 9, 'Infraestructura y B2G (Proveedor)', 81, [
        ['Superficie Carpas', 'slider', { min: 0, max: 3000, step: 50, defaultValue: 300, weight: 1 }],
        ['Tarima Fenólica y Moqueta', 'toggle', { weight: 1 }],
        ['Climatización Móvil', 'toggle', { weight: 1 }],
        ['Ignifugación M2 y Ensayos Viento', 'toggle', { weight: 1 }],
        ['Generador de Rescate', 'toggle', { weight: 1 }],
        ['Potencia Line Array', 'select', { options: ['500 pax', '1000 pax', '2500 pax', '5000 pax'], weight: 2 }],
        ['Capacidad Flota', 'slider', { min: 0, max: 500, step: 10, defaultValue: 100, weight: 1 }],
        ['Adaptación PMR', 'toggle', { weight: 2 }],
        ['Mobiliario Propio', 'toggle', { weight: 1 }],
        ['Iluminación Micro-LED', 'toggle', { weight: 1 }]
    ]),
    ...build('providerService', 10, 'Operativa y Calendario (Proveedor)', 91, [
        ['Provincias Operatividad', 'select', { options: PROVINCIAS, weight: 2 }],
        ['Radio Operatividad (km)', 'slider', { min: 10, max: 500, step: 10, defaultValue: 200, weight: 1 }],
        ['Brigadas Concurrentes', 'slider', { min: 1, max: 10, step: 1, defaultValue: 3, weight: 1 }],
        ['Tiempos de Montaje', 'select', { options: ['Mismo día', '24h antes', '48h antes'], weight: 1 }],
        ['Tiempos de Desmontaje', 'select', { options: ['Nocturno inmediato', 'Día siguiente'], weight: 1 }],
        ['Reubicación por Causa Mayor', 'toggle', { weight: 1 }],
        ['Reunión Técnica Previa', 'toggle', { weight: 1 }],
        ['Backup <3h', 'toggle', { weight: 2 }],
        ['Gestión Ecoembes / Donación', 'toggle', { weight: 1 }],
        ['Mediación Arbitral EAR OS', 'toggle', { weight: 1 }]
    ])
];

export const PROVIDER_SERVICE_CALIBRATION_DIMENSIONS: CalibrationDimension[] = [
    ...COUPLE_SERVICE,
    ...PROVIDER_SERVICE_SIDE
];

export const SERVICE_COUPLE_TO_PROVIDER_PAIRS: Record<number, number | null> = {
    1: 51, 2: 52, 3: 54, 4: 55, 5: 56, 6: 57, 7: 58, 8: 59, 9: 60,
    11: 61, 12: 62, 13: 63, 14: 64, 15: 65, 16: 66, 17: 67, 18: 68, 19: 69, 20: 61,
    21: 71, 22: 72, 23: 73, 24: 74, 25: 75, 26: 76, 27: 77, 28: 78, 29: 79, 30: 80,
    31: 81, 32: 82, 33: 83, 34: 84, 35: 85, 36: 86, 37: 87, 38: 88, 39: 89, 40: 90,
    41: 91, 42: 92, 43: 93, 44: 94, 45: 95, 46: 96, 47: 97, 48: 98, 49: 99, 50: 100
};

export const SERVICE_GATE_DIMENSION_IDS: number[] = [
    51, 52, 53, 63, 64, 86, 88, 98
];

export function getServiceCoupleDimensions(): CalibrationDimension[] {
    return PROVIDER_SERVICE_CALIBRATION_DIMENSIONS.filter((d) => d.side === 'couple');
}

export function getProviderServiceDimensions(): CalibrationDimension[] {
    return PROVIDER_SERVICE_CALIBRATION_DIMENSIONS.filter((d) => d.side === 'providerService');
}

export function getProviderServiceDimensionById(id: number): CalibrationDimension | undefined {
    return PROVIDER_SERVICE_CALIBRATION_DIMENSIONS.find((d) => d.id === id);
}