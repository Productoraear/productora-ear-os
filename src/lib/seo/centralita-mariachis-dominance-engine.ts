/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DE DOMINANCIA EUROPEA — CENTRALITA DE MARIACHIS · ESPAÑA + EUROPA
 * ════════════════════════════════════════════════════════════════════════════
 * Instantánea del "Motor Génesis" aplicada a un OPERADOR REAL verificado
 * (`CENTRALITA_MARIACHIS_ENTITY`, Productora EAR · Edwin Agudelo):
 *
 *   · 160 landings geográficas = 40 mercados reales × 4 verticales
 *   · 60 landings de intención = consultas transaccionales con ángulo propio
 *   · 1 hub de clúster que reparte autoridad a las 220 URL
 *
 * Doctrina aplicada sin excepciones:
 *  1. Entidad-first: sin operador verificado no hay URL.
 *  2. Cero invención: no se publican aforos, cachés ni tiempos de trayecto que
 *     no consten; los kilómetros se calculan por GPS en el presupuesto.
 *  3. Precio/depósito/split: SIEMPRE desde `ear-os-ssot.ts` y `MARIACHI_FORMATS`.
 *  4. Determinismo: mismo slug → mismo copy, misma sesión Stripe y mismo hash.
 *  5. Anti-canibalización: bancos independientes por carril de hash.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'node:crypto';
import {
    CENTRALITA_MARIACHIS_ENTITY,
} from '../constants/centralita-mariachis-entity';
import {
    DEPOSITO_STRIPE_EUR,
    LIMITE_SPL_DB,
    LOGISTICA_EUR_PER_KM,
    LOGISTICA_KM_EXENTOS,
    SPLIT_SOBERANO,
    SUPLEMENTO_HOTEL_EUR,
    WATTS_PER_PAX,
} from '../constants/ear-os-ssot';
import {
    MARIACHI_FORMATS,
    type MariachiFormat,
    type MariachiFormatId,
} from '../mariachi/mariachiDispatchCore';

/** Vertical comercial de la centralita (4 × 40 mercados = 160 landings). */
export type MariachiVerticalSlug =
    | 'serenata-sorpresa'
    | 'boda-mariachi'
    | 'xv-quinceanera'
    | 'fiesta-patronal-empresa';

/** Mercado real con punto de referencia público y eje de acceso verificable. */
export interface MariachiMarket {
    readonly slug: string;
    readonly name: string;
    /** ISO-3166 alfa-2. */
    readonly countryCode: string;
    readonly countryName: string;
    /** Modo de acceso habitual declarado en el presupuesto. */
    readonly travelMode: 'carretera' | 'tren' | 'avion' | 'barco';
    /** Eje viario real utilizado en el trayecto terrestre. */
    readonly corridor: string;
    /** Referencia geográfica pública y verificable del mercado. */
    readonly landmark: string;
    /** Perfil de demanda local (tipo de celebración y estacionalidad). */
    readonly demand: string;
    /** Banda logística que modula el argumento (sin inventar kilómetros). */
    readonly band: 'peninsula' | 'islas' | 'europa';
    /** `true` si el mercado está en España. */
    readonly inSpain: boolean;
}

/** Vertical contractual de la centralita. */
export interface MariachiVertical {
    readonly slug: MariachiVerticalSlug;
    readonly label: string;
    readonly shortLabel: string;
    readonly eventNoun: string;
    /** Promesa construida sólo con atributos reales del servicio. */
    readonly promise: string;
    /** Rango acústico aplicable (Ley 37/2003 del Ruido). */
    readonly noiseRange: string;
    /** Formato recomendado, tomado del catálogo SSOT. */
    readonly formatId: MariachiFormatId;
    /** Foco de repertorio verificable. */
    readonly repertoireFocus: string;
}

/**
 * Tupla canónica de mercado: mantiene la ficha legible y el tipado exhaustivo
 * sin duplicar claves. El orden es el contrato de `MARIACHI_MARKETS`.
 */
type MarketTuple = readonly [
    slug: string,
    name: string,
    countryCode: string,
    countryName: string,
    travelMode: MariachiMarket['travelMode'],
    corridor: string,
    landmark: string,
    demand: string,
    band: MariachiMarket['band'],
    inSpain: boolean,
];

/** 40 mercados con demanda mariachi declarada (24 España + 16 Europa). */
const MARKET_TUPLES: readonly MarketTuple[] = Object.freeze([
    ['madrid', 'Madrid', 'ES', 'España', 'carretera', 'A-5 / M-50', 'la Puerta del Sol y el eje de la Castellana', 'serenatas de última hora y eventos de empresa con invitados internacionales', 'peninsula', true],
    ['barcelona', 'Barcelona', 'ES', 'España', 'carretera', 'AP-7 / B-20', 'la Sagrada Família y el puerto olímpico', 'bodas de destino, XV años y convenciones en hotel urbano', 'peninsula', true],
    ['valencia', 'Valencia', 'ES', 'España', 'carretera', 'A-3 / V-31', 'la Ciutat de les Arts i les Ciències', 'celebraciones familiares de fin de semana y ferias de empresa', 'peninsula', true],
    ['sevilla', 'Sevilla', 'ES', 'España', 'carretera', 'A-4 / SE-30', 'la Giralda y el barrio de Santa Cruz', 'bodas de primavera, ferias y fiestas patronales de la provincia', 'peninsula', true],
    ['malaga', 'Málaga', 'ES', 'España', 'carretera', 'A-7 / AP-7', 'el puerto y la Alcazaba', 'bodas de costa con invitados extranjeros y galas de hotel', 'peninsula', true],
    ['bilbao', 'Bilbao', 'ES', 'España', 'carretera', 'AP-68 / BI-637', 'el Museo Guggenheim y la ría', 'cócteles de empresa, bodas de gala y aniversarios', 'peninsula', true],
    ['zaragoza', 'Zaragoza', 'ES', 'España', 'carretera', 'A-2 / Z-40', 'la Basílica del Pilar y el Ebro', 'fiestas del Pilar, bodas y congresos de empresa', 'peninsula', true],
    ['murcia', 'Murcia', 'ES', 'España', 'carretera', 'A-30 / MU-30', 'la Catedral y el río Segura', 'XV años, comuniones y fiestas patronales de huerta', 'peninsula', true],
    ['alicante', 'Alicante', 'ES', 'España', 'carretera', 'A-31 / AP-7', 'el Castillo de Santa Bárbara y el puerto', 'bodas de playa, despedidas y eventos de hotel', 'peninsula', true],
    ['palma', 'Palma', 'ES', 'España', 'barco', 'Ma-19 / Ma-20', 'la Seu y el Passeig Marítim', 'bodas de destino en finca y serenatas en hotel de la isla', 'islas', true],
    ['las-palmas', 'Las Palmas de Gran Canaria', 'ES', 'España', 'avion', 'GC-1 / GC-3', 'la Playa de las Canteras', 'bodas de invierno y eventos de empresa en la isla', 'islas', true],
    ['santa-cruz-de-tenerife', 'Santa Cruz de Tenerife', 'ES', 'España', 'avion', 'TF-1 / TF-5', 'el Parque García Sanabria y el puerto', 'carnavales, galas y bodas de destino en Canarias', 'islas', true],
    ['granada', 'Granada', 'ES', 'España', 'carretera', 'A-44 / GR-30', 'la Alhambra y el Albaicín', 'bodas en carmen, XV años y eventos universitarios', 'peninsula', true],
    ['cordoba', 'Córdoba', 'ES', 'España', 'carretera', 'A-4 / CO-32', 'la Mezquita-Catedral y el Guadalquivir', 'bodas de mayo, patios y fiestas de primavera', 'peninsula', true],
    ['toledo', 'Toledo', 'ES', 'España', 'carretera', 'A-42 / TO-20', 'el Alcázar y la Catedral Primada', 'bodas en finca, eventos de empresa y actos institucionales', 'peninsula', true],
    ['valladolid', 'Valladolid', 'ES', 'España', 'carretera', 'A-62 / VA-30', 'la Plaza Mayor y el Pisuerga', 'bodas de Castilla, ferias y convenciones', 'peninsula', true],
    ['pamplona', 'Pamplona', 'ES', 'España', 'carretera', 'AP-15 / PA-30', 'el Casco Viejo y la plaza del Castillo', 'San Fermín, bodas de verano y eventos de empresa', 'peninsula', true],
    ['san-sebastian', 'San Sebastián', 'ES', 'España', 'carretera', 'AP-8 / GI-20', 'la bahía de La Concha', 'bodas de gala, festivales y cenas de empresa', 'peninsula', true],
    ['santander', 'Santander', 'ES', 'España', 'carretera', 'A-67 / S-10', 'la Península de la Magdalena', 'bodas de verano y eventos de hotel en la costa', 'peninsula', true],
    ['oviedo', 'Oviedo', 'ES', 'España', 'carretera', 'A-66 / O-11', 'la Catedral y el Fontán', 'bodas de Asturias y eventos institucionales', 'peninsula', true],
    ['a-coruna', 'A Coruña', 'ES', 'España', 'carretera', 'A-6 / AC-11', 'la Torre de Hércules', 'bodas de costa atlántica y galas de empresa', 'peninsula', true],
    ['vigo', 'Vigo', 'ES', 'España', 'carretera', 'AP-9 / VG-20', 'la ría y el Casco Vello', 'bodas de finca, serenatas y eventos portuarios', 'peninsula', true],
    ['salamanca', 'Salamanca', 'ES', 'España', 'carretera', 'A-62 / SA-20', 'la Plaza Mayor y las dos catedrales', 'bodas universitarias, congresos y XV años', 'peninsula', true],
    ['cadiz', 'Cádiz', 'ES', 'España', 'carretera', 'AP-4 / CA-33', 'la Catedral y la Caleta', 'bodas de playa, carnavales y fiestas de verano', 'peninsula', true],
    ['paris', 'París', 'FR', 'Francia', 'avion', 'A-6 / A-10 / Périphérique', 'la Torre Eiffel y el Sena', 'bodas de destino, galas y eventos de marca con público internacional', 'europa', false],
    ['lisboa', 'Lisboa', 'PT', 'Portugal', 'avion', 'A-1 / A-2 / IP-7', 'el Tajo y la Baixa', 'bodas de destino atlántico y cenas de empresa', 'europa', false],
    ['porto', 'Oporto', 'PT', 'Portugal', 'avion', 'A-1 / A-20', 'el Duero y la Ribeira', 'bodas en bodega, XV años y eventos culturales', 'europa', false],
    ['berlin', 'Berlín', 'DE', 'Alemania', 'avion', 'A-10 / A-100', 'la Puerta de Brandeburgo', 'eventos de empresa, ferias y fiestas privadas de comunidad latina', 'europa', false],
    ['munich', 'Múnich', 'DE', 'Alemania', 'avion', 'A-9 / A-95 / A-8', 'la Marienplatz y el Isar', 'cervecerías, eventos de empresa y bodas temáticas', 'europa', false],
    ['roma', 'Roma', 'IT', 'Italia', 'avion', 'A-1 / GRA', 'el Coliseo y el Tíber', 'bodas de destino, galas benéficas y eventos de hotel', 'europa', false],
    ['milan', 'Milán', 'IT', 'Italia', 'avion', 'A-4 / A-8 / Tangenziale', 'el Duomo y la Scala', 'eventos de marca, cenas de gala y bodas de diseño', 'europa', false],
    ['amsterdam', 'Ámsterdam', 'NL', 'Países Bajos', 'avion', 'A-10 / A-4', 'los canales y el Rijksmuseum', 'eventos de empresa, bodas de destino y festivales', 'europa', false],
    ['bruselas', 'Bruselas', 'BE', 'Bélgica', 'tren', 'E-40 / R-0', 'la Grand-Place', 'instituciones europeas, recepciones y eventos de empresa', 'europa', false],
    ['ginebra', 'Ginebra', 'CH', 'Suiza', 'avion', 'A-1 / A-40', 'el lago Lemán y el Jet d\u2019Eau', 'galas privadas, relojería y eventos diplomáticos', 'europa', false],
    ['zurich', 'Zúrich', 'CH', 'Suiza', 'avion', 'A-1 / A-3', 'el lago de Zúrich y la Bahnhofstrasse', 'eventos financieros, bodas de gala y cenas privadas', 'europa', false],
    ['londres', 'Londres', 'GB', 'Reino Unido', 'avion', 'M-25 / A-40', 'el Támesis y Westminster', 'bodas de destino, eventos de marca y galas benéficas', 'europa', false],
    ['viena', 'Viena', 'AT', 'Austria', 'avion', 'A-1 / A-2 / Gürtel', 'la Ringstrasse y el Danubio', 'bailes de gala, bodas imperiales y conciertos privados', 'europa', false],
    ['praga', 'Praga', 'CZ', 'Chequia', 'avion', 'D-0 / D-1', 'el Moldava y el Puente Carlos', 'bodas de destino, eventos de empresa y despedidas', 'europa', false],
    ['copenhague', 'Copenhague', 'DK', 'Dinamarca', 'avion', 'E-20 / E-47', 'Nyhavn y el Øresund', 'bodas nórdicas, eventos de diseño y cenas privadas', 'europa', false],
    ['estocolmo', 'Estocolmo', 'SE', 'Suecia', 'avion', 'E-4 / E-20', 'Gamla Stan y el archipiélago', 'bodas de verano, galas y eventos de empresa', 'europa', false],
]);

/** Ficha tipada de los 40 mercados (derivada de la tupla, sin duplicar datos). */
export const MARIACHI_MARKETS: readonly MariachiMarket[] = Object.freeze(
    MARKET_TUPLES.map(
        ([
            slug,
            name,
            countryCode,
            countryName,
            travelMode,
            corridor,
            landmark,
            demand,
            band,
            inSpain,
        ]): MariachiMarket => ({
            slug,
            name,
            countryCode,
            countryName,
            travelMode,
            corridor,
            landmark,
            demand,
            band,
            inSpain,
        }),
    ),
);

/** Índice de mercados por slug (O(1) y tipado). */
export const MARIACHI_MARKET_BY_SLUG: Readonly<Record<string, MariachiMarket>> =
    Object.freeze(
        Object.fromEntries(
            MARIACHI_MARKETS.map((item) => [item.slug, item] as const),
        ),
    );

/** 60 landings de intención transaccional (cada una con ángulo propio). */
export const MARIACHI_INTENT_SEEDS: readonly MariachiIntentSeed[] = Object.freeze([
    {
        slug: 'serenata-mariachi-madrid',
        keyword: 'serenata de mariachi en Madrid',
        vertical: 'serenata-sorpresa',
        market: 'madrid',
        hook: 'en Madrid manda el tráfico: la centralita fija la hora de salida con margen y confirma el portal antes de tocar',
    },
    {
        slug: 'serenata-sorpresa-en-barcelona',
        keyword: 'serenata sorpresa en Barcelona',
        vertical: 'serenata-sorpresa',
        market: 'barcelona',
        hook: 'la serenata se coordina con la cena para que la formación entre justo antes del postre',
    },
    {
        slug: 'serenata-a-domicilio-valencia',
        keyword: 'serenata a domicilio en Valencia',
        vertical: 'serenata-sorpresa',
        market: 'valencia',
        hook: 'para una sorpresa en terraza o falla, la centralita confirma primero si el espacio permite sonido acústico',
    },
    {
        slug: 'serenata-para-mi-esposa-sevilla',
        keyword: 'serenata para mi esposa en Sevilla',
        vertical: 'serenata-sorpresa',
        market: 'sevilla',
        hook: 'en Sevilla la sorpresa suele caer en patio o azotea; el repertorio se ajusta al espacio y a la hora',
    },
    {
        slug: 'serenata-en-hotel-malaga',
        keyword: 'serenata en hotel de Málaga',
        vertical: 'serenata-sorpresa',
        market: 'malaga',
        hook: 'en hotel de costa la centralita pacta con recepción el acceso y el minuto exacto de entrada',
    },
    {
        slug: 'serenata-aniversario-bilbao',
        keyword: 'serenata de aniversario en Bilbao',
        vertical: 'serenata-sorpresa',
        market: 'bilbao',
        hook: 'en Bilbao el aniversario se cierra con hora y dirección exactas, sin llamadas de última hora',
    },
    {
        slug: 'serenata-mariachi-paris',
        keyword: 'serenata de mariachi en París',
        vertical: 'serenata-sorpresa',
        market: 'paris',
        hook: 'en París la formación viaja con antelación y la centralita confirma el huso horario y el acceso al edificio',
    },
    {
        slug: 'serenata-mariachi-lisboa',
        keyword: 'serenata de mariachi en Lisboa',
        vertical: 'serenata-sorpresa',
        market: 'lisboa',
        hook: 'en Lisboa la serenata se coordina con miradouro o restaurante, verificando que el espacio no amplifique de más',
    },
    {
        slug: 'serenata-mariachi-londres',
        keyword: 'serenata de mariachi en Londres',
        vertical: 'serenata-sorpresa',
        market: 'londres',
        hook: 'en Londres la centralita ajusta el repertorio al horario del local y confirma la dirección completa antes de reservar',
    },
    {
        slug: 'serenata-mariachi-berlin',
        keyword: 'serenata de mariachi en Berlín',
        vertical: 'serenata-sorpresa',
        market: 'berlin',
        hook: 'en Berlín la sorpresa se pacta con quien abre la puerta, para que la formación no espere en la calle',
    },
    {
        slug: 'serenata-mariachi-roma',
        keyword: 'serenata de mariachi en Roma',
        vertical: 'serenata-sorpresa',
        market: 'roma',
        hook: 'en Roma la serenata se adapta a plazas y patios con límite acústico, y la centralita lo verifica antes',
    },
    {
        slug: 'serenata-mariachi-amsterdam',
        keyword: 'serenata de mariachi en Ámsterdam',
        vertical: 'serenata-sorpresa',
        market: 'amsterdam',
        hook: 'en Ámsterdam la formación llega sin equipo pesado cuando el espacio es canal o piso estrecho',
    },
    {
        slug: 'serenata-mariachi-bruselas',
        keyword: 'serenata de mariachi en Bruselas',
        vertical: 'serenata-sorpresa',
        market: 'bruselas',
        hook: 'en Bruselas la serenata se coordina por tren y la centralita fija márgenes de llegada reales',
    },
    {
        slug: 'serenata-mariachi-ginebra',
        keyword: 'serenata de mariachi en Ginebra',
        vertical: 'serenata-sorpresa',
        market: 'ginebra',
        hook: 'en Ginebra la centralita confirma el acceso al edificio y el nombre del titular antes del show',
    },
    {
        slug: 'serenata-mariachi-europa',
        keyword: 'serenata de mariachi en Europa',
        vertical: 'serenata-sorpresa',
        market: null,
        hook: 'en cualquier ciudad europea la centralita confirma país, moneda y hora local antes de cerrar la fecha',
    },
    {
        slug: 'mariachi-para-boda-madrid',
        keyword: 'mariachi para boda en Madrid',
        vertical: 'boda-mariachi',
        market: 'madrid',
        hook: 'el brindis se calcula al minuto y la formación entra cuando la sala ya está llena, no antes',
    },
    {
        slug: 'mariachi-boda-finca-toledo',
        keyword: 'mariachi para boda en finca de Toledo',
        vertical: 'boda-mariachi',
        market: 'toledo',
        hook: 'en finca toledana la centralita pide el rider del recinto y ajusta el volumen al límite permitido',
    },
    {
        slug: 'entrada-nupcial-mariachi-granada',
        keyword: 'entrada nupcial con mariachi en Granada',
        vertical: 'boda-mariachi',
        market: 'granada',
        hook: 'en un carmen granadino la formación entra sin equipo de gran tamaño y el repertorio se adapta al patio',
    },
    {
        slug: 'mariachi-brindis-boda-cordoba',
        keyword: 'mariachi para el brindis de boda en Córdoba',
        vertical: 'boda-mariachi',
        market: 'cordoba',
        hook: 'en Córdoba la boda de mayo exige reservar con meses y confirmar el patio antes del brindis',
    },
    {
        slug: 'mariachi-boda-playa-alicante',
        keyword: 'mariachi para boda en la playa de Alicante',
        vertical: 'boda-mariachi',
        market: 'alicante',
        hook: 'en boda de playa la centralita verifica humedad, viento y hora del atardecer antes de cerrar el set',
    },
    {
        slug: 'mariachi-boda-palma-mallorca',
        keyword: 'mariachi para boda en Palma de Mallorca',
        vertical: 'boda-mariachi',
        market: 'palma',
        hook: 'en Mallorca la formación se desplaza en barco o avión según fecha, y la centralita lo refleja en el presupuesto',
    },
    {
        slug: 'mariachi-boda-tenerife',
        keyword: 'mariachi para boda en Tenerife',
        vertical: 'boda-mariachi',
        market: 'santa-cruz-de-tenerife',
        hook: 'en Tenerife la boda se planifica con vuelos y la centralita confirma el equipaje instrumental antes de reservar',
    },
    {
        slug: 'mariachi-boda-paris',
        keyword: 'mariachi para boda en París',
        vertical: 'boda-mariachi',
        market: 'paris',
        hook: 'en París la boda de destino exige repertorio bilingüe y la centralita lo acuerda con los novios',
    },
    {
        slug: 'mariachi-boda-lisboa',
        keyword: 'mariachi para boda en Lisboa',
        vertical: 'boda-mariachi',
        market: 'lisboa',
        hook: 'en Lisboa la boda en quinta se coordina con el espacio para que el mariachi no compita con la música de sala',
    },
    {
        slug: 'mariachi-boda-milan',
        keyword: 'mariachi para boda en Milán',
        vertical: 'boda-mariachi',
        market: 'milan',
        hook: 'en Milán la boda de diseño pide una entrada sobria y la centralita ajusta el show a la puesta en escena',
    },
    {
        slug: 'mariachi-boda-viena',
        keyword: 'mariachi para boda en Viena',
        vertical: 'boda-mariachi',
        market: 'viena',
        hook: 'en Viena la boda de gala se cierra con hora exacta y la centralita verifica el acceso de instrumentos',
    },
    {
        slug: 'mariachi-boda-praga',
        keyword: 'mariachi para boda en Praga',
        vertical: 'boda-mariachi',
        market: 'praga',
        hook: 'en Praga la boda de destino se apoya en transporte terrestre y la centralita fija el margen de montaje',
    },
    {
        slug: 'mariachi-boda-copenhague',
        keyword: 'mariachi para boda en Copenhague',
        vertical: 'boda-mariachi',
        market: 'copenhague',
        hook: 'en Copenhague la boda nórdica ajusta el horario a la luz y la centralita lo confirma antes del viaje',
    },
    {
        slug: 'mariachi-boda-destino-europa',
        keyword: 'mariachi para boda de destino en Europa',
        vertical: 'boda-mariachi',
        market: null,
        hook: 'en boda de destino europea la centralita bloquea fecha y confirma país y ciudad antes de mover al equipo',
    },
    {
        slug: 'boda-mexicana-en-espana',
        keyword: 'boda mexicana en España con mariachi',
        vertical: 'boda-mariachi',
        market: null,
        hook: 'la boda mexicana en España se cierra con repertorio y protocolo acordados, sin improvisar el brindis',
        nationalScope: 'espana',
    },
    {
        slug: 'mariachi-xv-anos-madrid',
        keyword: 'mariachi para XV años en Madrid',
        vertical: 'xv-quinceanera',
        market: 'madrid',
        hook: 'el vals se ensaya con la quinceañera y la centralita confirma el orden exacto de la entrada',
    },
    {
        slug: 'mariachi-quinceanera-barcelona',
        keyword: 'mariachi para quinceañera en Barcelona',
        vertical: 'xv-quinceanera',
        market: 'barcelona',
        hook: 'en Barcelona el XV se mezcla con fiesta urbana y la centralita ajusta el set al horario del local',
    },
    {
        slug: 'vals-xv-anos-valencia',
        keyword: 'vals de XV años con mariachi en Valencia',
        vertical: 'xv-quinceanera',
        market: 'valencia',
        hook: 'en Valencia el vals abre la fiesta y el cambio de zapatillas se coordina con el DJ',
    },
    {
        slug: 'mariachi-xv-anos-sevilla',
        keyword: 'mariachi para XV años en Sevilla',
        vertical: 'xv-quinceanera',
        market: 'sevilla',
        hook: 'en Sevilla los XV se celebran con familia numerosa y la centralita fija el minuto exacto del vals',
    },
    {
        slug: 'mariachi-xv-anos-murcia',
        keyword: 'mariachi para XV años en Murcia',
        vertical: 'xv-quinceanera',
        market: 'murcia',
        hook: 'en Murcia la quinceañera suele entrar con padrinos y la centralita ordena el protocolo con ellos',
    },
    {
        slug: 'mariachi-xv-anos-zaragoza',
        keyword: 'mariachi para XV años en Zaragoza',
        vertical: 'xv-quinceanera',
        market: 'zaragoza',
        hook: 'en Zaragoza el XV de invierno se celebra en salón y el volumen se ajusta al recinto',
    },
    {
        slug: 'mariachi-xv-anos-valladolid',
        keyword: 'mariachi para XV años en Valladolid',
        vertical: 'xv-quinceanera',
        market: 'valladolid',
        hook: 'en Valladolid el XV se cierra con cena y la centralita coloca el show entre plato y plato',
    },
    {
        slug: 'mariachi-xv-anos-pamplona',
        keyword: 'mariachi para XV años en Pamplona',
        vertical: 'xv-quinceanera',
        market: 'pamplona',
        hook: 'en Pamplona el XV de verano se coordina con la fiesta local y la centralita confirma hora y acceso',
    },
    {
        slug: 'mariachi-xv-anos-san-sebastian',
        keyword: 'mariachi para XV años en San Sebastián',
        vertical: 'xv-quinceanera',
        market: 'san-sebastian',
        hook: 'en San Sebastián el XV de gala pide formación completa y la centralita verifica el aforo del salón',
    },
    {
        slug: 'mariachi-xv-anos-paris',
        keyword: 'mariachi para XV años en París',
        vertical: 'xv-quinceanera',
        market: 'paris',
        hook: 'en París el XV bilingüe se acuerda con la familia y la centralita ajusta el repertorio a ambos idiomas',
    },
    {
        slug: 'mariachi-xv-anos-londres',
        keyword: 'mariachi para XV años en Londres',
        vertical: 'xv-quinceanera',
        market: 'londres',
        hook: 'en Londres el XV se celebra en salón de hotel y la centralita confirma el acceso del equipo',
    },
    {
        slug: 'mariachi-xv-anos-munich',
        keyword: 'mariachi para XV años en Múnich',
        vertical: 'xv-quinceanera',
        market: 'munich',
        hook: 'en Múnich el XV se mezcla con fiesta bávara y la centralita define el orden de los shows',
    },
    {
        slug: 'mariachi-xv-anos-zurich',
        keyword: 'mariachi para XV años en Zúrich',
        vertical: 'xv-quinceanera',
        market: 'zurich',
        hook: 'en Zúrich el XV privado se cierra con hora exacta y la centralita verifica el espacio antes de viajar',
    },
    {
        slug: 'mariachi-xv-anos-estocolmo',
        keyword: 'mariachi para XV años en Estocolmo',
        vertical: 'xv-quinceanera',
        market: 'estocolmo',
        hook: 'en Estocolmo el XV de verano se ajusta a la luz y la centralita confirma el horario real',
    },
    {
        slug: 'mariachi-xv-anos-europa',
        keyword: 'mariachi para XV años en Europa',
        vertical: 'xv-quinceanera',
        market: null,
        hook: 'en cualquier país europeo el XV exige confirmar moneda, idioma y hora local antes de reservar',
    },
    {
        slug: 'mariachi-fiestas-patronales-madrid',
        keyword: 'mariachi para fiestas patronales de Madrid',
        vertical: 'fiesta-patronal-empresa',
        market: 'madrid',
        hook: 'en Madrid el evento de empresa se cierra con factura y la centralita confirma el CIF antes de reservar',
    },
    {
        slug: 'mariachi-feria-sevilla',
        keyword: 'mariachi para la Feria de Sevilla',
        vertical: 'fiesta-patronal-empresa',
        market: 'sevilla',
        hook: 'en la Feria de Sevilla la centralita reserva con meses y verifica el acceso a la caseta',
    },
    {
        slug: 'mariachi-eventos-empresa-barcelona',
        keyword: 'mariachi para eventos de empresa en Barcelona',
        vertical: 'fiesta-patronal-empresa',
        market: 'barcelona',
        hook: 'en Barcelona la convención pide un show corto y la centralita ajusta el set a la agenda',
    },
    {
        slug: 'mariachi-convencion-valencia',
        keyword: 'mariachi para convención en Valencia',
        vertical: 'fiesta-patronal-empresa',
        market: 'valencia',
        hook: 'en Valencia la inauguración se coordina con el corte de cinta y la centralita fija el minuto',
    },
    {
        slug: 'mariachi-inauguracion-malaga',
        keyword: 'mariachi para inauguración en Málaga',
        vertical: 'fiesta-patronal-empresa',
        market: 'malaga',
        hook: 'en Málaga el evento de marca se cierra con rider técnico y la centralita lo revisa antes',
    },
    {
        slug: 'mariachi-cena-gala-bilbao',
        keyword: 'mariachi para cena de gala en Bilbao',
        vertical: 'fiesta-patronal-empresa',
        market: 'bilbao',
        hook: 'en Bilbao la cena de gala se ordena por tiempos y la centralita coloca el show entre discursos',
    },
    {
        slug: 'mariachi-fiesta-privada-madrid',
        keyword: 'mariachi para fiesta privada en Madrid',
        vertical: 'fiesta-patronal-empresa',
        market: 'madrid',
        hook: 'en una fiesta privada la centralita fija el aforo real para dimensionar la formación',
    },
    {
        slug: 'mariachi-oktoberfest-munich',
        keyword: 'mariachi para evento en Múnich',
        vertical: 'fiesta-patronal-empresa',
        market: 'munich',
        hook: 'en Múnich el evento de empresa se celebra en cervecería y la centralita ajusta el volumen al local',
    },
    {
        slug: 'mariachi-gala-paris',
        keyword: 'mariachi para gala en París',
        vertical: 'fiesta-patronal-empresa',
        market: 'paris',
        hook: 'en París la gala corporativa exige documentación y la centralita la entrega antes del viaje',
    },
    {
        slug: 'mariachi-evento-corporativo-londres',
        keyword: 'mariachi para evento corporativo en Londres',
        vertical: 'fiesta-patronal-empresa',
        market: 'londres',
        hook: 'en Londres el evento de marca pide seguro y la centralita confirma la cobertura antes de firmar',
    },
    {
        slug: 'mariachi-fiesta-berlin',
        keyword: 'mariachi para fiesta latina en Berlín',
        vertical: 'fiesta-patronal-empresa',
        market: 'berlin',
        hook: 'en Berlín la fiesta latina se cierra con repertorio bailable y la centralita lo acuerda con el promotor',
    },
    {
        slug: 'mariachi-evento-bruselas',
        keyword: 'mariachi para recepción en Bruselas',
        vertical: 'fiesta-patronal-empresa',
        market: 'bruselas',
        hook: 'en Bruselas la recepción institucional pide protocolo y la centralita ajusta el show a la agenda',
    },
    {
        slug: 'mariachi-feria-roma',
        keyword: 'mariachi para feria en Roma',
        vertical: 'fiesta-patronal-empresa',
        market: 'roma',
        hook: 'en Roma la feria se celebra al aire libre y la centralita verifica el límite acústico del recinto',
    },
    {
        slug: 'mariachi-fiesta-patronal-espana',
        keyword: 'mariachi para fiesta patronal en España',
        vertical: 'fiesta-patronal-empresa',
        market: null,
        hook: 'en fiesta patronal española la centralita entrega documentación y limitador para el ayuntamiento',
        nationalScope: 'espana',
    },
    {
        slug: 'mariachi-evento-internacional',
        keyword: 'mariachi para evento internacional',
        vertical: 'fiesta-patronal-empresa',
        market: null,
        hook: 'en evento internacional la centralita confirma país, aduana de instrumentos y hora local antes de bloquear',
    },
]);




/** Verticales de la centralita (4). */
export const MARIACHI_VERTICALS: readonly MariachiVertical[] = Object.freeze([
    {
        slug: 'serenata-sorpresa',
        label: 'Serenata sorpresa a domicilio',
        shortLabel: 'serenata',
        eventNoun: 'serenata sorpresa',
        promise:
            'llegada puntual al domicilio, restaurante u hotel con repertorio de serenata y coordinación previa del minuto exacto',
        noiseRange: '70-80 dBA en interior',
        formatId: 'solista',
        repertoireFocus: 'boleros, rancheras y Las Mañanitas',
    },
    {
        slug: 'boda-mariachi',
        label: 'Mariachi para bodas',
        shortLabel: 'boda con mariachi',
        eventNoun: 'boda con mariachi',
        promise:
            'entrada de los novios, brindis y primer baile con formación de gala y sonido calibrado antes del evento',
        noiseRange: '85-90 dBA en exterior y 80-85 dBA en interior',
        formatId: 'gala',
        repertoireFocus: 'marcha nupcial, rancheras de brindis y boleros de primer baile',
    },
    {
        slug: 'xv-quinceanera',
        label: 'XV años con mariachi',
        shortLabel: 'XV años',
        eventNoun: 'XV años',
        promise:
            'vals de entrada, cambio de zapatillas y show de rancheras con la quinceañera en el centro',
        noiseRange: '85-90 dBA en exterior',
        formatId: 'gala',
        repertoireFocus: 'vals, Las Mañanitas y rancheras de fiesta',
    },
    {
        slug: 'fiesta-patronal-empresa',
        label: 'Fiestas patronales y eventos de empresa',
        shortLabel: 'fiesta y empresa',
        eventNoun: 'fiesta patronal o evento de empresa',
        promise:
            'producción con escenario, sonido y formación monumental, con limitador y documentación para el ayuntamiento',
        noiseRange: '90-102 dBA con limitador telemático',
        formatId: 'monumental',
        repertoireFocus: 'rancheras de plaza, pop mexicano y repertorio de gala',
    },
]);

/** Índice de verticales por slug. */
export const MARIACHI_VERTICAL_BY_SLUG: Readonly<Record<string, MariachiVertical>> =
    Object.freeze(
        Object.fromEntries(
            MARIACHI_VERTICALS.map((item) => [item.slug, item] as const),
        ),
    );

/** Índice de formatos por id (precios SSOT). */
export const MARIACHI_FORMAT_BY_ID: Readonly<Record<string, MariachiFormat>> =
    Object.freeze(
        Object.fromEntries(
            MARIACHI_FORMATS.map((item) => [item.id, item] as const),
        ),
    );

/** URL canónica del clúster (host www, tal y como exige el sitemap). */
export const MARIACHI_CANONICAL_BASE = CENTRALITA_MARIACHIS_ENTITY.canonicalBase;

/** Tipo de landing: malla geográfica o intención transaccional. */
export type MariachiLandingKind = 'geo' | 'intent';

/** Pregunta frecuente con respuesta verificable. */
export interface MariachiFaq {
    readonly question: string;
    readonly answer: string;
}

/** Bloque narrativo de la landing. */
export interface MariachiLandingSection {
    readonly heading: string;
    readonly body: string;
}

/** Nodo JSON-LD (estructura libre pero serializable). */
export type MariachiJsonLd = Readonly<Record<string, unknown>>;

/** Enlace interno del clúster. */
export interface MariachiRelatedLink {
    readonly slug: string;
    readonly label: string;
    readonly verticalSlug: MariachiVerticalSlug;
}

/** Landing completa: copy, secciones, FAQ, sellos y grafo JSON-LD. */
export interface MariachiLanding {
    readonly slug: string;
    readonly path: string;
    readonly kind: MariachiLandingKind;
    readonly title: string;
    readonly description: string;
    readonly h1: string;
    readonly kicker: string;
    readonly keyword: string;
    readonly keywords: readonly string[];
    readonly marketSlug: string;
    readonly marketName: string;
    readonly marketCountry: string;
    readonly travelMode: MariachiMarket['travelMode'];
    readonly corridor: string;
    readonly landmark: string;
    readonly band: MariachiMarket['band'];
    readonly verticalSlug: MariachiVerticalSlug;
    readonly verticalLabel: string;
    readonly eventNoun: string;
    readonly uniqueCopy: string;
    readonly sections: readonly MariachiLandingSection[];
    readonly faqs: readonly MariachiFaq[];
    readonly noiseRange: string;
    readonly format: MariachiFormatSummary;
    readonly formats: readonly MariachiFormatSummary[];
    readonly depositEur: number;
    readonly kmFree: number;
    readonly eurPerKm: number;
    readonly hotelEur: number;
    readonly wattsPerPax: number;
    readonly splLimitDb: number;
    readonly phone: string;
    readonly email: string;
    readonly operator: string;
    readonly artist: string;
    readonly provenanceHash: string;
    readonly stripeSessionId: string;
    readonly priceLockSha256: string;
    readonly schemaOrg: readonly MariachiJsonLd[];
    readonly related: readonly MariachiRelatedLink[];
}

/**
 * Banco de aperturas (16 variantes sintácticas). Cada landing elige una por
 * carril de hash propio para que dos URLs no compartan arranque.
 */
const OPENINGS: readonly string[] = Object.freeze([
    'Contratar {event} en {market} no empieza por elegir una canción: empieza por saber quién contesta el teléfono y quién responde de la hora.',
    'La diferencia entre un {event} que sale redondo y uno que se recuerda con fastidio está en la coordinación previa, no en el volumen.',
    'En {market} hay músicos y hay producción; la centralita existe para que el cliente no tenga que distinguirlos a las dos de la mañana.',
    'Un {event} se cierra con tres datos: fecha, dirección exacta y hora de entrada de la formación. Todo lo demás se puede acordar después.',
    'Cuando la sorpresa depende de una puerta que se abre, la centralita confirma el portal, el piso y el nombre de quien recibe antes de reservar.',
    'Para {event} en {country}, la pregunta útil no es cuántos músicos caben, sino cuántos minutos hay entre el brindis y el primer baile.',
    'La primera decisión de un {event} es logística; la segunda es repertorio. La centralita invierte ese orden por escrito y evita sustos.',
    'Un {event} no se improvisa: se confirma con hora, dirección y responsable. La centralita deja esos tres puntos cerrados antes de cobrar.',
    'En {market} el cliente no compra "mariachi": compra una llegada puntual, un repertorio concreto y una factura clara.',
    'El show más caro no es el de la formación más grande, sino el que llega tarde y toca la canción equivocada en el momento equivocado.',
    'La centralita atiende {event} con una regla sencilla: primero se verifica el espacio y la hora, después se habla de música.',
    'Hay quien contrata por teléfono sin saber qué pasa si llueve, si el salón cambia de hora o si el invitado de honor no llega a tiempo.',
    'En {market} los mejores {event} se cierran con margen; la centralita reserva la fecha antes de mover instrumentos.',
    'Un {event} con mariachi exige decidir quién manda en el horario: la familia, el salón o la formación. La centralita lo pacta por escrito.',
    'La sorpresa no se protege con secretos, se protege con logística: hora de salida, acceso al edificio y una persona de contacto.',
    'Cada {event} tiene un momento exacto que no se puede repetir; la centralita se organiza alrededor de ese minuto, no al revés.',
]);

/** Banco de anclajes geográficos (16 variantes, sin kilómetros inventados). */
const LOCALS: readonly string[] = Object.freeze([
    'En {market} la referencia para llegar es {landmark}; el último tramo se resuelve por {corridor} y se confirma con el cliente.',
    'La demanda local de {market} se concentra en {demand}, y la centralita ajusta la formación a ese formato.',
    'Desde {landmark}, el acceso natural es {corridor}; la centralita verifica el punto exacto de carga y descarga antes del evento.',
    'En {market} manda la estacionalidad: {demand}. Por eso ciertas fechas desaparecen del calendario con meses de antelación.',
    '{landmark} no es solo una postal: marca el tipo de espacio donde se celebra {event} en {market}.',
    'La ruta habitual en {market} pasa por {corridor}; la centralita confirma el tiempo real y no promete trayectos imposibles.',
    '{demand} es la tónica de {market}; la formación y el repertorio se eligen en función de ese perfil, no al azar.',
    'En {market} los eventos se reparten entre interior y exterior, y {landmark} suele marcar la diferencia de acústica.',
    'La centralita trabaja {market} con dirección exacta y persona de contacto, porque {landmark} por sí solo no basta para llegar.',
    'Para {event} en {market}, el punto de partida es {landmark} y el eje {corridor}; lo demás se valida con el rider del espacio.',
    'En {country} cada ciudad tiene su horario; en {market} la centralita confirma la hora local antes de fijar la salida.',
    'La referencia de {market} es {landmark}, y la demanda típica es {demand}; la centralita adapta el formato a ambas cosas.',
    'Si el evento cae en puente o temporada alta, {corridor} se complica; la centralita amplía el margen de llegada.',
    'En {market} el cliente suele conocer {landmark}, no el callejón del acceso; la centralita pide la ubicación exacta.',
    '{demand} explica por qué en {market} conviene reservar con antelación y por qué la centralita bloquea fecha antes de mover equipo.',
    'En {market}, {corridor} conecta {landmark} con el resto de la ciudad; el presupuesto refleja el transporte real, no una estimación.',
]);

/**
 * Banco de ficha local (10 variantes): concentra los datos exclusivos del
 * mercado en una sola frase para que dos URLs no compartan cuerpo narrativo.
 */
const DOSSIER: readonly string[] = Object.freeze([
    'Ficha del mercado: {market} ({country}), acceso por {corridor}, referencia {landmark} y demanda típica de {demand}.',
    'Datos útiles de {market}: se llega por {corridor}, el punto de referencia es {landmark} y el modo habitual es {travel}.',
    'En {country}, {market} se trabaja con {landmark} como referencia, {corridor} como eje y un perfil de {demand}.',
    'Lo que cambia en {market} no es el repertorio: es {corridor}, la distancia a {landmark} y el tipo de {demand}.',
    'Para situarse en {market}: {landmark}, conexión por {corridor} y una demanda concentrada en {demand}.',
    'El contexto de {market} ({country}) es {landmark}; el acceso se hace por {corridor} y el viaje tipo es {travel}.',
    'Anclaje local: {landmark} en {market}, con {corridor} como vía de acceso y {demand} como patrón de contratación.',
    'En {market} la referencia ciudadana es {landmark}, la vía de entrada {corridor} y el perfil de cliente {demand}.',
    'La ficha de {market} se completa con {landmark}, el eje {corridor} y un calendario marcado por {demand}.',
    '{market} pertenece a {country}; se accede por {corridor}, se ubica por {landmark} y se contrata sobre todo para {demand}.',
]);


/** Banco de ángulos de venta (16 variantes centradas en el riesgo del cliente). */
const ANGLES: readonly string[] = Object.freeze([
    'La promesa del servicio es concreta: {promise}. Si algo no se puede cumplir, la centralita lo dice antes de cobrar el depósito.',
    'El cliente teme tres cosas: que no lleguen, que lleguen tarde y que toquen lo que no toca. Las tres se resuelven con un guion cerrado.',
    'Un {short} mal cerrado deja al anfitrión sin margen para saludar; uno bien cerrado le devuelve el protagonismo del evento.',
    'La formación no decide el orden del evento: lo ejecuta. La centralita acuerda ese orden con quien manda en la celebración.',
    'Si el espacio tiene vecinos, horario de cierre o limitador, esas condiciones entran en el presupuesto desde el primer minuto.',
    'Para {short} la centralita pregunta por el aforo real, no por el aforo soñado; de ahí sale la formación adecuada.',
    'La diferencia entre {format} y una formación menor se nota en el equilibrio de voces, no en el volumen del amplificador.',
    'El repertorio no se manda por WhatsApp la víspera: se acuerda con tiempo y se confirma con quien paga.',
    'Antes de mover instrumentos, la centralita valida acceso, ascensor, escaleras y hora de montaje.',
    'Un {short} con invitados de varias generaciones exige repertorio transversal: {repertoire}.',
    'El cliente no necesita saber de música, necesita saber qué pasa si el evento se retrasa media hora. La centralita lo tiene previsto.',
    'La centralita no vende "ambiente": vende una entrada, un brindis y una salida con hora pactada.',
    'Para que {promise}, la centralita confirma el guion con el anfitrión y con el espacio, no solo con la familia.',
    'Un evento pequeño con mala producción parece grande y malo; uno medido con {format} parece exacto.',
    'La factura, el depósito y el rider son parte del espectáculo: si fallan, el recuerdo también falla.',
    'La centralita asume el trabajo ingrato: llamar, confirmar, repetir y volver a confirmar. El cliente solo aparece en el momento bueno.',
]);

/** Banco de repertorio y protocolo (12 variantes verificables). */
const REPERTOIRE: readonly string[] = Object.freeze([
    'El set se construye con {repertoire}, y se ajusta al momento exacto: entrada, brindis o cierre.',
    'Para este formato el foco es {repertoire}; el resto del repertorio se acuerda según el público presente.',
    'La centralita envía la lista de temas antes del evento para que el anfitrión marque favoritos y vetos.',
    'El orden de las canciones se decide con el guion del evento: no se toca el mismo tema en la entrada que en el brindis.',
    'Con {format}, el repertorio se reparte entre momentos y se evita repetir el mismo bloque dos veces.',
    'La formación trabaja {repertoire} y acepta peticiones razonables si se avisan con antelación.',
    'El protocolo se acuerda por escrito: quién presenta, cuándo entra la música y qué canción cierra.',
    'El repertorio infantil y el de gala no se mezclan sin criterio; la centralita pregunta por edades antes de cerrar el set.',
    'Para eventos con varias generaciones, el set alterna {repertoire} con clásicos reconocibles por todos.',
    'La formación no improvisa letras ni protocolos: si una canción no está en el repertorio, se dice antes.',
    'La lista final se cierra 72 horas antes y se envía al espacio para evitar duplicidades con el DJ.',
    'Cada bloque dura lo que dura el momento; la centralita cronometra para no comerse el brindis ni el primer baile.',
]);

/** Banco técnico-acústico (12 variantes, Ley 37/2003 y 12 W/pax). */
const TECH: readonly string[] = Object.freeze([
    'En sonido, la referencia legal es la Ley 37/2003 del Ruido: {noise}, con medición previa en el montaje.',
    'El rider acústico deja el límite en {noise}; el límite de salud pública general es {spl} dB SPL y {watts} W/pax.',
    'La normativa acústica marca {noise}; cualquier refuerzo sonoro se ajusta a esa cifra y se mide con sonómetro.',
    'Para el equipo de música, el techo se pacta por escrito: {noise}, con la Ley 37/2003 como marco.',
    'La formación trabaja a {noise} y con {watts} W/pax; si el espacio exige menos, se baja sin discutir.',
    'Sobre ruido no hay improvisación: {noise} y comprobación con sonómetro antes de abrir puertas.',
    'El montaje acústico se calibra a {noise}, con la Ley 37/2003 del Ruido como referencia obligada.',
    'Si hay vecinos o horario de cierre, el límite baja: {noise} es techo, no objetivo.',
    'La potencia se dimensiona a {watts} W/pax y el nivel se mantiene por debajo de {spl} dB SPL.',
    'La Ley 37/2003 fija el marco y la centralita concreta el nivel: {noise}, sin excepciones de última hora.',
    'Todo montaje pasa por sonómetro y por el límite de {noise}; el técnico firma la medición si el espacio lo pide.',
    'El rider incluye {watts} W/pax y un techo de {spl} dB SPL para espacios sensibles como residencias o hoteles.',
]);

/** Banco logístico (12 variantes): kilómetros desde la dirección fiscal del proveedor. */
const LOGISTICS: readonly string[] = Object.freeze([
    'El kilometraje se calcula desde la dirección fiscal del proveedor hasta el lugar del evento: los primeros {kmFree} km no se cobran y a partir de ahí son {eurKm} €/km.',
    'Si el evento es fuera de la base, la logística parte del domicilio fiscal: {kmFree} km exentos y {eurKm} €/km adicional.',
    'Para salidas a {market}, el cómputo de kilómetros arranca en la dirección fiscal del proveedor, con {kmFree} km incluidos.',
    'La distancia se mide por GPS desde el domicilio fiscal del proveedor, no desde otra sede: {kmFree} km sin coste y {eurKm} €/km después.',
    'En servicios desplazados el criterio es verificable: kilómetros reales, {kmFree} exentos y {eurKm} €/km adicional.',
    'Cualquier desplazamiento se presupuesta con la misma regla: origen en la dirección fiscal, {kmFree} km incluidos, {eurKm} €/km después.',
    'El coste logístico no se estima a ojo: {kmFree} km exentos desde el domicilio fiscal y {eurKm} €/km por el resto.',
    'Si la distancia supera los 200 km o el evento termina después de las 3:00, se añade el suplemento hotelero de {hotel} €.',
    'La logística se factura con origen en la dirección fiscal del proveedor; los primeros {kmFree} km van incluidos y luego {eurKm} €/km.',
    'Para el cliente queda claro antes de firmar: {kmFree} km incluidos y {eurKm} €/km a partir de ahí, con GPS como prueba.',
    'El presupuesto separa caché, transporte y alojamiento cuando corresponde; nada de "todo incluido" que oculte kilómetros.',
    'En trayectos largos se valora hotel y dietas antes de cerrar la fecha; el suplemento hotelero es {hotel} € y se aplica según regla.',
]);

/** Banco paneuropeo (10 variantes): sólo se usa en mercados fuera de España. */
const EUROPE: readonly string[] = Object.freeze([
    'En {country} el acceso se pacta con el espacio: moneda local, horario y documento de instrumentos se confirman antes de viajar.',
    'Para {market}, la centralita confirma el modo de viaje ({travel}) y el margen de montaje antes de bloquear la fecha.',
    'Fuera de España, el presupuesto separa vuelo o tren, alojamiento y transporte local; el cliente ve cada línea antes de pagar.',
    'En {market} la hora local manda: la centralita convierte la hora del evento a la del equipo para evitar desfases.',
    'La documentación de instrumentos y el seguro de responsabilidad se revisan antes de cruzar frontera hacia {country}.',
    'En {country} el repertorio puede requerir presentación bilingüe; la centralita lo acuerda con el anfitrión por escrito.',
    'Para eventos en {market}, la centralita pide el rider del espacio y lo traduce a las condiciones locales de sonido.',
    'El viaje a {market} se planifica con antelación suficiente para que un retraso de vuelo no coma el montaje.',
    'En {market} el pago se documenta en euros con referencia del evento; la centralita no improvisa tipos de cambio.',
    'Si el evento es en {country}, el contacto local del espacio es obligatorio antes de reservar: sin él no se cierra la fecha.',
]);

/**
 * Bancos EXCLUSIVOS de intención. No comparten plantilla con la malla
 * geográfica: así dos URLs del mismo mercado y vertical no son clones.
 */
const INTENT_OPENINGS: readonly string[] = Object.freeze([
    'La consulta "{keyword}" se responde con tres datos: formación disponible, fecha bloqueada y presupuesto por escrito.',
    'Si has llegado buscando "{keyword}", lo primero es descartar lo que no se puede cumplir: aforo, horario y acceso al espacio.',
    '"{keyword}" no es una petición genérica: cambia según {market}, el tipo de espacio y la hora del evento.',
    'En {market}, quien pide {short} suele comparar precios sin ver la letra pequeña: transporte, montaje y límite acústico.',
    'Para {event} en {market}, la centralita responde con un formato concreto y no con un catálogo indefinido.',
    'La respuesta a "{keyword}" empieza por el formato {format} y termina con una fecha bloqueada, no al revés.',
    'Hay dos maneras de resolver "{keyword}": improvisar el día del evento o cerrar hoy la formación, la hora y el acceso.',
    'En {market} el precio de {short} se mueve por desplazamiento y fecha; la centralita lo desglosa antes de reservar.',
    'Quien contrata {event} en {market} necesita saber qué pasa si el evento se retrasa; la centralita lo deja por escrito.',
    'La consulta "{keyword}" llega muchas veces a última hora; la centralita prioriza disponibilidad real, no promesas.',
    'En {market}, {short} se cierra con depósito y presupuesto: dos documentos que evitan discutir el día del evento.',
    'Para "{keyword}", la pregunta correcta es cuántos músicos y cuánto tiempo, no cuántos decibelios.',
    'La centralita responde a "{keyword}" con el formato {format} y una lista de lo que no está incluido.',
    'Si el evento es en {market}, la respuesta a "{keyword}" incluye transporte, horario de montaje y plan B de espacio.',
    'Quien pide {event} en {market} quiere certezas: quién llega, a qué hora y con qué repertorio.',
    '"{keyword}" se resuelve mejor con una llamada de cinco minutos que con veinte mensajes: la centralita la agenda.',
    'En {market} la diferencia entre dos presupuestos de {short} suele estar en los kilómetros y en el seguro.',
    'La centralita no responde "{keyword}" con un "depende": da un rango, un formato y una fecha disponible.',
    'Para {event} en {market}, el repertorio se elige después de confirmar el espacio; hacerlo al revés cuesta dinero.',
    'La consulta "{keyword}" se cierra cuando el cliente ve el precio final desglosado y la fecha bloqueada.',
]);

/** Ángulos exclusivos de intención (16 variantes). */
const INTENT_ANGLES: readonly string[] = Object.freeze([
    'El presupuesto se entrega desglosado: formación, transporte, alojamiento si aplica y depósito deducible.',
    'La centralita no cobra por cotizar y no bloquea fecha sin confirmación escrita del cliente.',
    'Si el espacio cambia de hora, la formación se reprograma dentro del mismo día sin cobrar dos veces.',
    'El cliente recibe el rider acústico antes del evento para enseñarlo al espacio si hace falta.',
    'Para {short}, la formación se dimensiona por aforo real y no por el número de invitados que "pueden venir".',
    'La factura se emite con el detalle del servicio; el depósito aparece como pago a cuenta.',
    'La centralita confirma por escrito quién es el contacto en el espacio y a qué hora se permite el montaje.',
    'Si el evento incluye discursos, el set se coloca después para no tapar el brindis.',
    'El repertorio se cierra 72 horas antes y se envía al espacio para evitar solapamientos con el DJ.',
    'En {market}, el transporte se calcula por GPS y se enseña el trayecto antes de firmar.',
    'La formación llega con margen; si el acceso está bloqueado, la centralita avisa antes de la hora del evento.',
    'Para {event}, el plan B de lluvia o de cambio de sala se acuerda en la misma conversación.',
    'El cliente no paga "a ciegas": ve el desglose, el rider y la política de cancelación antes del depósito.',
    'La centralita trabaja con un único interlocutor por evento para que no haya dos versiones del guion.',
    'En {market} el horario del local manda; la centralita ajusta el set para no chocar con el cierre.',
    'Si la fecha está libre, se bloquea el mismo día; si no, se ofrecen alternativas reales, no una lista de espera.',
]);


/** Rider acústico exclusivo de intención (8 variantes). */
const INTENT_TECH: readonly string[] = Object.freeze([
    'El rider acústico se entrega con el presupuesto: techo de {noise}, {watts} W/pax y límite de salud pública por debajo de {spl} dB SPL.',
    'Si el espacio pide menos volumen del pactado, la formación baja el nivel sin romper el show.',
    'La medición se hace antes del evento con sonómetro y se anota el resultado en el parte de montaje.',
    'La normativa aplicable es la Ley 37/2003 del Ruido; el techo para este formato es {noise}.',
    'El equipo se dimensiona a {watts} W/pax para no tapar voces ni forzar el sistema.',
    'En interiores con vecinos, el límite se rebaja al que fije el espacio, siempre por debajo de {spl} dB SPL.',
    'La formación no lleva refuerzo sonoro si el espacio lo prohíbe; el formato acústico sigue siendo válido.',
    'El técnico documenta la medición y la deja a disposición del cliente y del espacio.',
]);

/** Logística exclusiva de intención (8 variantes). */
const INTENT_LOGISTICS: readonly string[] = Object.freeze([
    'El transporte se calcula por GPS desde la dirección fiscal del proveedor, con {kmFree} km incluidos y {eurKm} €/km después.',
    'El presupuesto separa caché y transporte para que el cliente vea qué paga por música y qué por desplazamiento.',
    'En {market}, el trayecto se confirma con la dirección exacta y no con el nombre del municipio.',
    'Si la distancia supera los 200 km, se añade el suplemento hotelero de {hotel} € antes de cerrar la fecha.',
    'Si el evento termina después de las 3:00, el suplemento hotelero se aplica igualmente y se avisa al firmar.',
    'Los kilómetros se miden en la ruta real, no en línea recta; la centralita adjunta el cálculo.',
    'Para {event} en {market}, el transporte local se presupuesta aparte del trayecto principal.',
    'El cliente puede aportar su propio cálculo; la centralita lo revisa y responde con el GPS oficial.',
]);

/** Contexto europeo exclusivo de intención (6 variantes). */
const INTENT_EUROPE: readonly string[] = Object.freeze([
    'Fuera de España, el presupuesto incluye viaje, alojamiento y transporte local, con cada línea visible antes de pagar.',
    'En {country} se confirman hora local, moneda y acceso al recinto; sin esos datos no se bloquea la fecha.',
    'La documentación de instrumentos y el seguro se revisan con antelación cuando el evento es en {market}.',
    'Para eventos en {market}, la centralita nombra un contacto local del espacio y un plan B de montaje.',
    'El repertorio puede requerir presentación bilingüe; se acuerda con el anfitrión y se confirma por escrito.',
    'Si el vuelo o el tren se retrasa, la centralita avisa al espacio y reordena el montaje con el tiempo real disponible.',
]);

/** Ámbito sintético para intenciones de toda España (sin inventar distancias). */
const SPAIN_SCOPE: MariachiMarket = Object.freeze({
    slug: 'espana',
    name: 'España',
    countryCode: 'ES',
    countryName: 'España',
    travelMode: 'carretera',
    corridor: 'la red de autovías y la alta velocidad',
    landmark: 'las capitales de provincia españolas',
    demand: 'bodas, XV años y fiestas patronales en toda la península e islas',
    band: 'peninsula',
    inSpain: true,
});

/** Ámbito sintético para intenciones paneuropeas. */
const EUROPE_SCOPE: MariachiMarket = Object.freeze({
    slug: 'europa',
    name: 'Europa',
    countryCode: 'EU',
    countryName: 'Europa',
    travelMode: 'avion',
    corridor: 'los vuelos directos y la red ferroviaria europea',
    landmark: 'las principales capitales europeas',
    demand: 'bodas de destino, XV años y eventos de empresa con mariachi en directo',
    band: 'europa',
    inSpain: false,
});

/** Alcance de la landing: mercado concreto, España o Europa. */
export type MariachiScope = 'market' | 'espana' | 'europa';

/** FNV-1a de 32 bits: barato, determinístico y sin dependencias. */
function fnv1a(input: string): number {
    let hash = 0x811c9dc5;
    for (let index = 0; index < input.length; index += 1) {
        hash ^= input.charCodeAt(index);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash;
}

/** Selecciona un elemento del banco usando un carril independiente por slot. */
function pick<T>(pool: readonly T[], slug: string, lane: string): T {
    const selected = pool[fnv1a(`${slug}::${lane}`) % pool.length];
    if (selected === undefined) {
        throw new Error(`[CENTRALITA] Banco vacío en el carril "${lane}"`);
    }
    return selected;
}

/** Rota un bloque de frases para que dos URLs no compartan el mismo orden. */
function rotate<T>(items: readonly T[], seed: string): readonly T[] {
    if (items.length === 0) {
        return items;
    }
    const offset = fnv1a(`${seed}::rotation`) % items.length;
    return [...items.slice(offset), ...items.slice(0, offset)];
}

/** Serialización canónica (claves ordenadas) para hashes reproducibles. */
function stableStringify(value: unknown): string {
    if (value === null || typeof value !== 'object') {
        return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
        return `[${value.map((item: unknown) => stableStringify(item)).join(',')}]`;
    }
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
        .sort()
        .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
        .join(',')}}`;
}

/** SHA-256 hexadecimal de un texto UTF-8. */
export function mariachiSha256(text: string): string {
    return createHash('sha256').update(text, 'utf8').digest('hex');
}

/** Une una lista en español: "a, b y c". */
function joinSpanish(items: readonly string[]): string {
    if (items.length === 0) {
        return '';
    }
    const last = items[items.length - 1] ?? '';
    if (items.length === 1) {
        return last;
    }
    return `${items.slice(0, -1).join(', ')} y ${last}`;
}

/** Capitaliza la primera letra sin tocar el resto. */
function capitalize(text: string): string {
    return text.length === 0 ? text : `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

/** Formato monetario español sin decimales innecesarios. */
function euro(value: number): string {
    return `${value.toFixed(2).replace('.', ',')} €`;
}

/** Contexto de composición de una landing. */
interface CopyContext {
    readonly slug: string;
    readonly kind: MariachiLandingKind;
    readonly keyword: string;
    readonly scope: MariachiScope;
    readonly market: MariachiMarket;
    readonly vertical: MariachiVertical;
    readonly format: MariachiFormat;
    readonly hook: string;
}

/** Sustituye los tokens de la plantilla con datos verificados. */
function fillTemplate(template: string, context: CopyContext): string {
    const scopeName =
        context.scope === 'europa'
            ? 'Europa'
            : context.scope === 'espana'
              ? 'España'
              : context.market.name;
    const replacements: Readonly<Record<string, string>> = {
        '{market}': scopeName,
        '{country}': context.scope === 'market' ? context.market.countryName : scopeName,
        '{landmark}': context.market.landmark,
        '{corridor}': context.market.corridor,
        '{demand}': context.market.demand,
        '{travel}': context.market.travelMode,
        '{event}': context.vertical.eventNoun,
        '{short}': context.vertical.shortLabel,
        '{repertoire}': context.vertical.repertoireFocus,
        '{noise}': context.vertical.noiseRange,
        '{promise}': context.vertical.promise,
        '{format}': context.format.name,
        '{members}': String(context.format.members),
        '{baseFee}': euro(context.format.basePrice),
        '{deposit}': euro(DEPOSITO_STRIPE_EUR),
        '{kmFree}': String(LOGISTICA_KM_EXENTOS),
        '{eurKm}': LOGISTICA_EUR_PER_KM.toFixed(2).replace('.', ','),
        '{hotel}': euro(SUPLEMENTO_HOTEL_EUR),
        '{watts}': String(WATTS_PER_PAX),
        '{spl}': String(LIMITE_SPL_DB),
        '{hook}': context.hook,
        '{operator}': CENTRALITA_MARIACHIS_ENTITY.operator,
        '{artist}': CENTRALITA_MARIACHIS_ENTITY.residentArtist.name,
        '{keyword}': context.keyword,
    };
    return Object.entries(replacements).reduce(
        (text, [token, value]) => text.split(token).join(value),
        template,
    );
}

/**
 * Compone el núcleo narrativo único (7 bloques, carriles independientes y
 * orden rotado). Es el texto que audita el guardián anti-canibalización.
 */
export function composeMariachiUniqueCopy(context: CopyContext): string {
    const isIntent = context.kind === 'intent';
    const opening = fillTemplate(
        pick(isIntent ? INTENT_OPENINGS : OPENINGS, context.slug, 'opening'),
        context,
    );
    const hook = `${capitalize(context.hook.replace(/[.\s]+$/, ''))}.`;
    const dossier = fillTemplate(pick(DOSSIER, context.slug, 'dossier'), context);
    const blocks: string[] = [opening, hook, dossier];

    if (isIntent) {
        const intentMiddle = rotate(
            [
                fillTemplate(pick(INTENT_ANGLES, context.slug, 'angle'), context),
                fillTemplate(pick(INTENT_TECH, context.slug, 'tech'), context),
                fillTemplate(
                    pick(INTENT_LOGISTICS, context.slug, 'logistics'),
                    context,
                ),
            ],
            context.slug,
        );
        blocks.push(...intentMiddle);
    } else {
        const local = fillTemplate(pick(LOCALS, context.slug, 'local'), context);
        const middle = rotate(
            [
                fillTemplate(pick(ANGLES, context.slug, 'angle'), context),
                fillTemplate(pick(REPERTOIRE, context.slug, 'repertoire'), context),
                fillTemplate(pick(TECH, context.slug, 'tech'), context),
            ],
            context.slug,
        );
        const logistics = fillTemplate(
            pick(LOGISTICS, context.slug, 'logistics'),
            context,
        );
        blocks.push(local, ...middle, logistics);
    }

    if (context.scope === 'europa') {
        blocks.push(
            fillTemplate(
                pick(isIntent ? INTENT_EUROPE : EUROPE, context.slug, 'europe'),
                context,
            ),
        );
    }
    return blocks.join(' ');
}

/**
 * Construye las 7 preguntas frecuentes con respuestas verificables.
 * Ninguna respuesta inventa aforo, caché ni tiempos de trayecto.
 */
function buildFaqs(context: CopyContext): readonly MariachiFaq[] {
    const depositLabel = euro(DEPOSITO_STRIPE_EUR);
    const baseFeeLabel = euro(context.format.basePrice);
    const scopeName =
        context.scope === 'europa'
            ? 'Europa'
            : context.scope === 'espana'
              ? 'España'
              : context.market.name;
    const ask = (lane: string, variants: readonly string[]): string =>
        fillTemplate(pick(variants, context.slug, lane), context);

    const international: MariachiFaq =
        context.scope === 'europa'
            ? {
                  question: ask('q-international', [
                      '¿Qué hace falta para llevar el mariachi fuera de España?',
                      '¿Cómo se organiza un evento en {market}?',
                      '¿Qué documentación se revisa antes de viajar?',
                  ]),
                  answer: `En ${scopeName} se confirman cuatro puntos antes de mover el equipo: moneda y hora local, acceso al espacio, documentación de instrumentos y seguro de responsabilidad. El presupuesto separa viaje, alojamiento y transporte local; sin esos cuatro puntos cerrados no se bloquea la fecha.`,
              }
            : {
                  question: ask('q-invoice', [
                      '¿Se entrega factura y presupuesto desglosado?',
                      '¿Cómo se documenta el pago?',
                      '¿Qué incluye el precio final?',
                  ]),
                  answer: `El servicio se documenta con presupuesto desglosado y factura. El depósito de ${depositLabel} se descuenta íntegro del total y la liquidación aplica el split soberano 80/10/10 del SSOT de EAR OS.`,
              };

    return [
        {
            question: ask('q-price', [
                '¿Cuánto cuesta {event} en {market}?',
                '¿Qué presupuesto hay que prever para {event}?',
                '¿Cómo se calcula el precio de {short}?',
            ]),
            answer: `El precio de partida del formato ${context.format.name} (${context.format.members} músicos) es ${baseFeeLabel} sin IVA. El depósito de ${depositLabel} bloquea la fecha y se descuenta íntegro del importe final; el transporte y el alojamiento se detallan aparte cuando corresponden.`,
        },
        {
            question: ask('q-logistics', [
                '¿Cómo se cobra el desplazamiento a {market}?',
                '¿Los kilómetros están incluidos?',
                '¿Hay suplemento por alojamiento?',
            ]),
            answer: `El kilometraje se calcula por GPS desde la dirección fiscal del proveedor hasta el lugar del evento: los primeros ${LOGISTICA_KM_EXENTOS} km no se cobran y a partir de ahí son ${LOGISTICA_EUR_PER_KM.toFixed(2).replace('.', ',')} €/km. Si la distancia supera 200 km o el evento termina después de las 3:00, se añade el suplemento hotelero de ${euro(SUPLEMENTO_HOTEL_EUR)}.`,
        },
        {
            question: ask('q-formats', [
                '¿Qué formatos de mariachi hay?',
                '¿Cuántos músicos necesito para mi evento?',
                '¿Puedo ampliar la formación?',
            ]),
            answer: `El catálogo va del solista al monumental (1, 4, 6 y 8 músicos según formato). La centralita recomienda uno u otro por aforo y tipo de espacio, no por precio: un salón pequeño con formación monumental suena peor que un formato medido.`,
        },
        {
            question: ask('q-repertoire', [
                '¿Se puede elegir el repertorio?',
                '¿Qué canciones toca el mariachi?',
                '¿Cómo se acuerda el orden de las canciones?',
            ]),
            answer: `El set se acuerda antes del evento y se confirma por escrito: el foco de este formato es ${context.vertical.repertoireFocus}. Las peticiones se aceptan si están en catálogo y se avisan con antelación; la lista final se cierra 72 horas antes.`,
        },
        {
            question: ask('q-acoustic', [
                '¿Qué límite de sonido se aplica?',
                '¿Cumple la normativa de ruido?',
                '¿Se mide el volumen en el evento?',
            ]),
            answer: `La Ley 37/2003 del Ruido fija el marco. En este formato el techo es ${context.vertical.noiseRange}, con ${WATTS_PER_PAX} W/pax y un límite de salud pública por debajo de ${LIMITE_SPL_DB} dB SPL. Si el espacio exige menos, se baja antes de empezar.`,
        },
        {
            question: ask('q-deposit', [
                '¿Cómo se bloquea la fecha?',
                '¿El depósito es deducible?',
                '¿Qué pasa si reintento el pago?',
            ]),
            answer: `La fecha se bloquea con el depósito de ${depositLabel}, que se descuenta íntegro del total. La sesión de pago se deriva del identificador de esta landing, de modo que varios reintentos producen un único bloqueo (idempotencia ACID).`,
        },
        international,
    ];
}

/** Secciones narrativas de la landing (3 bloques verificables). */
function buildSections(
    context: CopyContext,
    scopeName: string,
): readonly MariachiLandingSection[] {
    const formatsLine = joinSpanish(
        MARIACHI_FORMATS.map((format) => `${format.name} (${format.members})`),
    );
    return [
        {
            heading: `Qué incluye ${context.vertical.label} en ${scopeName}`,
            body: `La promesa del servicio es concreta: ${context.vertical.promise}. El repertorio de referencia es ${context.vertical.repertoireFocus}, y el formato recomendado para esta intención es ${context.format.name}, con ${context.format.members} músicos. El catálogo completo va de ${formatsLine}, y la centralita elige por aforo y espacio, no por precio.`,
        },
        {
            heading: 'Cómo se cierra la fecha y qué se firma',
            body: `${capitalize(context.hook)}. La fecha se bloquea con un depósito de ${euro(DEPOSITO_STRIPE_EUR)} que se descuenta íntegro del importe final; antes de pagar se confirman fecha, hora, dirección exacta y persona de contacto. La sesión de pago se deriva del identificador de esta URL, de modo que los reintentos no duplican el bloqueo.`,
        },
        {
            heading: 'Acústica, kilómetros y verificación',
            body: `En acústica se aplica la Ley 37/2003 del Ruido con un techo de ${context.vertical.noiseRange}, ${WATTS_PER_PAX} W/pax y límite de salud pública por debajo de ${LIMITE_SPL_DB} dB SPL. En desplazamientos, el cómputo parte de la dirección fiscal del proveedor: ${LOGISTICA_KM_EXENTOS} km exentos y ${LOGISTICA_EUR_PER_KM.toFixed(2).replace('.', ',')} €/km a partir de ahí, medidos por GPS.`,
        },
    ];
}

/** Enlaces internos del clúster: evita landings huérfanas. */
function buildRelated(
    context: CopyContext,
    ownSlug: string,
): readonly MariachiRelatedLink[] {
    if (context.scope !== 'market') {
        const sameVertical = MARIACHI_MARKETS.slice(0, 6).map((market) => ({
            slug: `${context.vertical.slug}-${market.slug}`,
            label: `${context.vertical.label} en ${market.name}`,
            verticalSlug: context.vertical.slug,
        }));
        const otherVertical = MARIACHI_VERTICALS.filter(
            (vertical) => vertical.slug !== context.vertical.slug,
        )
            .slice(0, 3)
            .map((vertical) => ({
                slug: `${vertical.slug}-${context.market.slug}`,
                label: `${vertical.label} (${context.market.name})`,
                verticalSlug: vertical.slug,
            }));
        return [...sameVertical, ...otherVertical].filter(
            (link) => link.slug !== ownSlug,
        );
    }

    const sameMarket: MariachiRelatedLink[] = MARIACHI_VERTICALS.filter(
        (vertical) => vertical.slug !== context.vertical.slug,
    ).map((vertical) => ({
        slug: `${vertical.slug}-${context.market.slug}`,
        label: `${vertical.label} en ${context.market.name}`,
        verticalSlug: vertical.slug,
    }));

    const nearby: MariachiRelatedLink[] = MARIACHI_MARKETS.filter(
        (market) => market.slug !== context.market.slug,
    )
        .slice(0, 3)
        .map((market) => ({
            slug: `${context.vertical.slug}-${market.slug}`,
            label: `${context.vertical.label} en ${market.name}`,
            verticalSlug: context.vertical.slug,
        }));

    return [...sameMarket, ...nearby].filter((link) => link.slug !== ownSlug);
}

/** Construye el grafo JSON-LD (MusicGroup + Service + Offer + FAQ + Breadcrumb). */
function buildJsonLd(args: {
    readonly path: string;
    readonly title: string;
    readonly h1: string;
    readonly context: CopyContext;
    readonly scopeName: string;
    readonly faqs: readonly MariachiFaq[];
}): readonly MariachiJsonLd[] {
    const canonicalUrl = `${MARIACHI_CANONICAL_BASE}${args.path}`;
    const hubUrl = `${MARIACHI_CANONICAL_BASE}/centralita-mariachis`;

    const musicGroup: MariachiJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'MusicGroup',
        '@id': `${hubUrl}#musicgroup`,
        name: CENTRALITA_MARIACHIS_ENTITY.brand,
        alternateName: CENTRALITA_MARIACHIS_ENTITY.commercialName,
        description: CENTRALITA_MARIACHIS_ENTITY.tagline,
        url: hubUrl,
        telephone: CENTRALITA_MARIACHIS_ENTITY.officialLine,
        email: CENTRALITA_MARIACHIS_ENTITY.email,
        genre: 'Mariachi',
        foundingLocation: {
            '@type': 'Place',
            name: CENTRALITA_MARIACHIS_ENTITY.baseFullLabel,
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: CENTRALITA_MARIACHIS_ENTITY.baseMunicipality,
            addressRegion: CENTRALITA_MARIACHIS_ENTITY.baseProvince,
            addressCountry: 'ES',
        },
        founder: {
            '@type': 'Person',
            name: CENTRALITA_MARIACHIS_ENTITY.operator,
            jobTitle: CENTRALITA_MARIACHIS_ENTITY.operatorRole,
        },
        member: {
            '@type': 'Person',
            name: CENTRALITA_MARIACHIS_ENTITY.residentArtist.name,
            jobTitle: CENTRALITA_MARIACHIS_ENTITY.residentArtist.role,
            url: `${MARIACHI_CANONICAL_BASE}${CENTRALITA_MARIACHIS_ENTITY.residentArtist.profilePath}`,
        },
        areaServed: { '@type': 'Place', name: args.scopeName },
    };

    const service: MariachiJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${canonicalUrl}#service`,
        name: args.title,
        serviceType: args.context.vertical.label,
        description: `${args.context.vertical.promise}.`,
        provider: {
            '@type': 'MusicGroup',
            name: CENTRALITA_MARIACHIS_ENTITY.brand,
            telephone: CENTRALITA_MARIACHIS_ENTITY.officialLine,
        },
        areaServed: { '@type': 'Place', name: args.scopeName },
        url: canonicalUrl,
        offers: {
            '@type': 'Offer',
            price: DEPOSITO_STRIPE_EUR,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            description:
                'Depósito de bloqueo de fecha, 100% deducible del importe final.',
            url: `${MARIACHI_CANONICAL_BASE}/reservar/solista?formato=${args.context.format.id}`,
        },
    };

    const offer: MariachiJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: `Bloqueo de fecha ${args.context.vertical.shortLabel} · ${args.scopeName}`,
        price: DEPOSITO_STRIPE_EUR,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        description:
            'Depósito deducible del importe final; la fecha se libera si no se confirma el presupuesto por escrito.',
        url: `${MARIACHI_CANONICAL_BASE}/reservar/solista?formato=${args.context.format.id}`,
        seller: {
            '@type': 'Organization',
            name: CENTRALITA_MARIACHIS_ENTITY.legalName,
            telephone: CENTRALITA_MARIACHIS_ENTITY.officialLine,
        },
        itemOffered: {
            '@type': 'Service',
            name: args.context.vertical.label,
            serviceType: args.context.vertical.label,
        },
    };

    const faqPage: MariachiJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: args.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
    };

    const breadcrumb: MariachiJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Inicio',
                item: MARIACHI_CANONICAL_BASE,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: CENTRALITA_MARIACHIS_ENTITY.brand,
                item: hubUrl,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: args.h1,
                item: canonicalUrl,
            },
        ],
    };

    return [musicGroup, service, offer, faqPage, breadcrumb];
}

/** Semilla interna de landing (geo o intención). */
interface LandingSeed {
    readonly slug: string;
    readonly kind: MariachiLandingKind;
    readonly keyword: string;
    readonly h1: string;
    readonly scope: MariachiScope;
    readonly market: MariachiMarket;
    readonly vertical: MariachiVertical;
    readonly hook: string;
}

/** Resumen publicable de un formato (sin funciones ni secretos). */
function formatSummary(format: MariachiFormat): MariachiFormatSummary {
    return {
        id: format.id,
        name: format.name,
        members: format.members,
        basePrice: format.basePrice,
        depositAmount: format.depositAmount,
        recommendedFor: format.recommendedFor,
    };
}

/** Construye una landing completa (copy + secciones + FAQ + sellos + JSON-LD). */
function buildLanding(seed: LandingSeed): MariachiLanding {
    const format = MARIACHI_FORMAT_BY_ID[seed.vertical.formatId];
    if (!format) {
        throw new Error(
            `[CENTRALITA] Formato desconocido: ${seed.vertical.formatId}`,
        );
    }
    const context: CopyContext = {
        slug: seed.slug,
        kind: seed.kind,
        keyword: seed.keyword,
        scope: seed.scope,
        market: seed.market,
        vertical: seed.vertical,
        format,
        hook: seed.hook,
    };
    const scopeName =
        seed.scope === 'europa'
            ? 'Europa'
            : seed.scope === 'espana'
              ? 'España'
              : seed.market.name;

    const path = `/centralita-mariachis/${seed.slug}`;
    const title =
        seed.kind === 'geo'
            ? `${seed.vertical.label} en ${seed.market.name} | Centralita de Mariachis`
            : `${capitalize(seed.keyword)} | Centralita de Mariachis`;

    const description = `${capitalize(seed.keyword)}: ${seed.vertical.promise}. ${
        seed.scope === 'market'
            ? `Servicio en ${seed.market.name} (${seed.market.countryName}).`
            : `Cobertura ${scopeName} con salida desde la dirección fiscal del proveedor.`
    } Depósito ${euro(DEPOSITO_STRIPE_EUR)} deducible.`;

    const uniqueCopy = composeMariachiUniqueCopy(context);
    const faqs = buildFaqs(context);
    const sections = buildSections(context, scopeName);
    const related = buildRelated(context, seed.slug);
    const schemaOrg = buildJsonLd({
        path,
        title,
        h1: seed.h1,
        context,
        scopeName,
        faqs,
    });

    const stripeSessionId = mariachiSha256(
        `ear-os:centralita:${seed.slug}:price-lock:deposit:${DEPOSITO_STRIPE_EUR.toFixed(2)}`,
    );
    const priceLockSha256 = mariachiSha256(
        stableStringify({
            amountEur: DEPOSITO_STRIPE_EUR,
            currency: 'EUR',
            mode: 'price-lock-sha256',
            split: SPLIT_SOBERANO,
        }),
    );
    const provenanceHash = mariachiSha256(
        stableStringify({
            entityId: CENTRALITA_MARIACHIS_ENTITY.id,
            entityRule: CENTRALITA_MARIACHIS_ENTITY.verificationRule,
            slug: seed.slug,
            path,
            keyword: seed.keyword,
            h1: seed.h1,
            uniqueCopy,
            formatId: format.id,
            basePrice: format.basePrice,
            depositEur: DEPOSITO_STRIPE_EUR,
            split: SPLIT_SOBERANO,
        }),
    );

    return {
        slug: seed.slug,
        path,
        kind: seed.kind,
        title,
        description,
        h1: seed.h1,
        kicker: `${CENTRALITA_MARIACHIS_ENTITY.brand} · ${scopeName} · ${CENTRALITA_MARIACHIS_ENTITY.operator}`,
        keyword: seed.keyword,
        keywords: [
            seed.keyword,
            `mariachi ${seed.market.slug}`,
            `${seed.vertical.slug} ${seed.market.slug}`,
            'centralita de mariachis',
            'contratar mariachi europa',
        ],
        marketSlug: seed.market.slug,
        marketName: scopeName,
        marketCountry: seed.market.countryName,
        travelMode: seed.market.travelMode,
        corridor: seed.market.corridor,
        landmark: seed.market.landmark,
        band: seed.market.band,
        verticalSlug: seed.vertical.slug,
        verticalLabel: seed.vertical.label,
        eventNoun: seed.vertical.eventNoun,
        uniqueCopy,
        sections,
        faqs,
        noiseRange: seed.vertical.noiseRange,
        format: formatSummary(format),
        formats: MARIACHI_FORMATS.map(formatSummary),
        depositEur: DEPOSITO_STRIPE_EUR,
        kmFree: LOGISTICA_KM_EXENTOS,
        eurPerKm: LOGISTICA_EUR_PER_KM,
        hotelEur: SUPLEMENTO_HOTEL_EUR,
        wattsPerPax: WATTS_PER_PAX,
        splLimitDb: LIMITE_SPL_DB,
        phone: CENTRALITA_MARIACHIS_ENTITY.officialLine,
        email: CENTRALITA_MARIACHIS_ENTITY.email,
        operator: CENTRALITA_MARIACHIS_ENTITY.operator,
        artist: CENTRALITA_MARIACHIS_ENTITY.residentArtist.name,
        provenanceHash,
        stripeSessionId,
        priceLockSha256,
        schemaOrg,
        related,
    };
}

/** 160 semillas geográficas: 40 mercados × 4 verticales. */
const GEO_SEEDS: readonly LandingSeed[] = Object.freeze(
    MARIACHI_MARKETS.flatMap((market) =>
        MARIACHI_VERTICALS.map(
            (vertical): LandingSeed => ({
                slug: `${vertical.slug}-${market.slug}`,
                kind: 'geo',
                keyword: `${vertical.shortLabel} en ${market.name}`,
                h1: `${vertical.label} en ${market.name}`,
                scope: 'market',
                market,
                vertical,
                hook: `la centralita trabaja ${market.demand} con formato de ${vertical.shortLabel}`,
            }),
        ),
    ),
);

/** 60 semillas de intención (por mercado, España o Europa). */
const INTENT_SEEDS: readonly LandingSeed[] = Object.freeze(
    MARIACHI_INTENT_SEEDS.map((seed): LandingSeed => {
        const vertical = MARIACHI_VERTICAL_BY_SLUG[seed.vertical];
        const market = seed.market
            ? MARIACHI_MARKET_BY_SLUG[seed.market]
            : seed.nationalScope === 'espana'
              ? SPAIN_SCOPE
              : EUROPE_SCOPE;
        const scope: MariachiScope = seed.market
            ? 'market'
            : seed.nationalScope === 'espana'
              ? 'espana'
              : 'europa';
        if (!vertical || !market) {
            throw new Error(`[CENTRALITA] Semilla inválida: ${seed.slug}`);
        }
        return {
            slug: seed.slug,
            kind: 'intent',
            keyword: seed.keyword,
            h1: capitalize(seed.keyword),
            scope,
            market,
            vertical,
            hook: seed.hook,
        };
    }),
);

/** Construye las 220 landings y aborta si hay slugs duplicados. */
function buildAllLandings(): readonly MariachiLanding[] {
    const seeds = [...GEO_SEEDS, ...INTENT_SEEDS];
    const seen = new Set<string>();
    for (const seed of seeds) {
        if (seen.has(seed.slug)) {
            throw new Error(`[CENTRALITA] Slug duplicado: ${seed.slug}`);
        }
        seen.add(seed.slug);
    }
    return seeds.map(buildLanding);
}

/** Catálogo inmutable de las 220 landings (160 geo + 60 intención). */
export const MARIACHI_LANDINGS: readonly MariachiLanding[] = Object.freeze(
    buildAllLandings(),
);

/** Índice O(1) por slug. */
const LANDING_BY_SLUG: ReadonlyMap<string, MariachiLanding> = new Map(
    MARIACHI_LANDINGS.map((landing) => [landing.slug, landing] as const),
);

/** Devuelve la landing o `null` (el caller decide `notFound()`). */
export function getMariachiLanding(slug: string): MariachiLanding | null {
    return LANDING_BY_SLUG.get(slug) ?? null;
}

/** Lista de slugs para `generateStaticParams`. */
export function getMariachiSlugs(): readonly string[] {
    return MARIACHI_LANDINGS.map((landing) => landing.slug);
}

/** Agrupación del hub por vertical. */
export interface MariachiHubGroup {
    readonly vertical: MariachiVertical;
    readonly landings: readonly MariachiLanding[];
}

/** Datos derivados del clúster para la página hub. */
export interface MariachiHubData {
    readonly total: number;
    readonly geoCount: number;
    readonly intentCount: number;
    readonly marketCount: number;
    readonly countryCount: number;
    readonly groups: readonly MariachiHubGroup[];
    readonly europeIntents: readonly MariachiLanding[];
    readonly depositEur: number;
    readonly baseFeeEur: number;
    readonly centralita: string;
    readonly phone: string;
    readonly email: string;
    readonly operator: string;
    readonly artist: string;
    readonly coverageLabel: string;
    readonly splLimitDb: number;
    readonly wattsPerPax: number;
}

/** Snapshot del clúster (todo derivado; cero hardcode de dinero). */
export const MARIACHI_HUB: MariachiHubData = Object.freeze({
    total: MARIACHI_LANDINGS.length,
    geoCount: MARIACHI_LANDINGS.filter((landing) => landing.kind === 'geo').length,
    intentCount: MARIACHI_LANDINGS.filter((landing) => landing.kind === 'intent')
        .length,
    marketCount: MARIACHI_MARKETS.length,
    countryCount: new Set(MARIACHI_MARKETS.map((market) => market.countryCode))
        .size,
    groups: MARIACHI_VERTICALS.map((vertical) => ({
        vertical,
        landings: MARIACHI_LANDINGS.filter(
            (landing) =>
                landing.kind === 'geo' && landing.verticalSlug === vertical.slug,
        ),
    })),
    europeIntents: MARIACHI_LANDINGS.filter(
        (landing) => landing.kind === 'intent' && landing.band === 'europa',
    ),
    depositEur: DEPOSITO_STRIPE_EUR,
    baseFeeEur: Math.min(...MARIACHI_FORMATS.map((format) => format.basePrice)),
    centralita: CENTRALITA_MARIACHIS_ENTITY.officialLine,
    phone: CENTRALITA_MARIACHIS_ENTITY.officialLine,
    email: CENTRALITA_MARIACHIS_ENTITY.email,
    operator: CENTRALITA_MARIACHIS_ENTITY.operator,
    artist: CENTRALITA_MARIACHIS_ENTITY.residentArtist.name,
    coverageLabel: `${MARIACHI_MARKETS.filter((market) => market.inSpain).length} mercados en España + ${MARIACHI_MARKETS.filter((market) => !market.inSpain).length} en Europa`,
    splLimitDb: LIMITE_SPL_DB,
    wattsPerPax: WATTS_PER_PAX,
});













/** Semilla de landing de intención (60 consultas transaccionales). */
export interface MariachiIntentSeed {
    readonly slug: string;
    readonly keyword: string;
    readonly vertical: MariachiVerticalSlug;
    /** Mercado objetivo o `null` si la intención es paneuropea. */
    readonly market: string | null;
    /** Ángulo diferencial que rompe la plantilla (dato o duda real). */
    readonly hook: string;
    /** Alcance cuando `market` es `null` (por defecto, Europa). */
    readonly nationalScope?: 'espana' | 'europa';
}

/** Formato resumido que viaja al manifiesto y a la UI. */
export interface MariachiFormatSummary {
    readonly id: MariachiFormatId;
    readonly name: string;
    readonly members: number;
    readonly basePrice: number;
    readonly depositAmount: number;
    readonly recommendedFor: string;
}
