/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DE DOMINANCIA NACIONAL — PRODUCTORA EAR · BODAS Y EVENTOS (ESPAÑA)
 * ════════════════════════════════════════════════════════════════════════════
 * Aplica el "Motor Génesis" a un OPERADOR REAL verificado (`EAR_EVENTOS_ENTITY`,
 * Productora EAR · Edwin Agudelo) sobre el SSOT geográfico de 52 provincias:
 *
 *   · 208 landings geográficas = 52 provincias × 4 verticales
 *   · 60 landings de intención = 52 provinciales + 8 nacionales
 *   · 1 hub de clúster que reparte autoridad a las 268 URL
 *
 * Doctrina aplicada:
 *  1. Entidad-first: sin operador verificado no hay URL.
 *  2. Cero invención: se usan provincia, capital, comunidad y distancia del
 *     SSOT geográfico existente; los kilómetros finales se miden por GPS.
 *  3. Precio/depósito/split: SIEMPRE desde `ear-os-ssot.ts` y `MARIACHI_FORMATS`.
 *  4. Determinismo: mismo slug → mismo copy, misma sesión Stripe y mismo hash.
 *  5. Anti-canibalización: bancos separados para geo e intención.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'node:crypto';
import { EAR_EVENTOS_ENTITY } from '../constants/ear-eventos-entity';
import {
    DEPOSITO_STRIPE_EUR,
    LIMITE_SPL_DB,
    LOGISTICA_EUR_PER_KM,
    LOGISTICA_KM_EXENTOS,
    SPLIT_SOBERANO,
    SUPLEMENTO_HOTEL_EUR,
    WATTS_PER_PAX,
} from '../constants/ear-os-ssot';
import { PROVINCIAS_52_GRAPH } from '../constants/seo-data-hydrated';
import {
    MARIACHI_FORMATS,
    type MariachiFormat,
    type MariachiFormatId,
} from '../mariachi/mariachiDispatchCore';

/** Vertical de producción de bodas y eventos (4 × 52 provincias = 208). */
export type EventVerticalSlug =
    | 'bodas-gala'
    | 'boda-finca-ceremonia'
    | 'evento-empresa'
    | 'celebracion-familiar';

/** Provincia real tomada del SSOT geográfico (sin inventar datos). */
export interface EventProvince {
    readonly slug: string;
    readonly name: string;
    readonly capital: string;
    readonly community: string;
    readonly region: string;
    /** Distancia de referencia del SSOT (el presupuesto final se mide por GPS). */
    readonly distanceKm: number;
}

/** Vertical contractual de producción. */
export interface EventVertical {
    readonly slug: EventVerticalSlug;
    readonly label: string;
    readonly shortLabel: string;
    readonly eventNoun: string;
    readonly promise: string;
    readonly noiseRange: string;
    readonly formatId: MariachiFormatId;
    readonly musicFocus: string;
}

/** Semilla de intención (52 provinciales + 8 nacionales). */
export interface EventIntentSeed {
    readonly slug: string;
    readonly keyword: string;
    readonly vertical: EventVerticalSlug;
    /** Provincia objetivo o `null` si la intención es nacional. */
    readonly province: string | null;
    readonly hook: string;
}

/** Formato musical resumido para manifiesto y UI. */
export interface EventFormatSummary {
    readonly id: MariachiFormatId;
    readonly name: string;
    readonly members: number;
    readonly basePrice: number;
    readonly depositAmount: number;
    readonly recommendedFor: string;
}

/** Provincia del SSOT con los campos que el motor consume. */
export const EVENT_PROVINCES: readonly EventProvince[] = Object.freeze(
    Object.values(PROVINCIAS_52_GRAPH).map(
        (province): EventProvince => ({
            slug: province.slug,
            name: province.name,
            capital: province.capital,
            community: province.community,
            region: province.region,
            distanceKm: province.distanceFromHubKm,
        }),
    ),
);

if (EVENT_PROVINCES.length !== 52) {
    throw new Error(
        `[EAR-EVENTOS] El SSOT geográfico debe aportar 52 provincias; llegaron ${EVENT_PROVINCES.length}.`,
    );
}

/** Verticales de producción (4). */
export const EVENT_VERTICALS: readonly EventVertical[] = Object.freeze([
    {
        slug: 'bodas-gala',
        label: 'Bodas de gala',
        shortLabel: 'boda de gala',
        eventNoun: 'boda de gala',
        promise:
            'ceremonia, banquete y música en directo con producción propia, horario pactado y sonido calibrado antes del evento',
        noiseRange: '85-90 dBA en exterior y 80-85 dBA en interior',
        formatId: 'gala',
        musicFocus: 'entrada de novios, brindis y primer baile',
    },
    {
        slug: 'boda-finca-ceremonia',
        label: 'Boda en finca y ceremonia civil',
        shortLabel: 'boda en finca',
        eventNoun: 'boda en finca',
        promise:
            'montaje en finca o jardín con ceremonia civil, sonido homologado y plan B de espacio por escrito',
        noiseRange: '85-90 dBA en exterior',
        formatId: 'gala',
        musicFocus: 'ceremonia al aire libre, aperitivo y cena',
    },
    {
        slug: 'evento-empresa',
        label: 'Eventos de empresa y presentaciones',
        shortLabel: 'evento de empresa',
        eventNoun: 'evento de empresa',
        promise:
            'producción llave en mano para presentaciones, cenas de gala e inauguraciones, con factura, rider y horario de montaje',
        noiseRange: '80-85 dBA en interior',
        formatId: 'monumental',
        musicFocus: 'cóctel, cena de gala y cierre de jornada',
    },
    {
        slug: 'celebracion-familiar',
        label: 'Comuniones, bautizos y cumpleaños',
        shortLabel: 'celebración familiar',
        eventNoun: 'celebración familiar',
        promise:
            'música en directo para comidas familiares con formato medido, repertorio para varias generaciones y horario pactado',
        noiseRange: '70-80 dBA en interior',
        formatId: 'cuarteto',
        musicFocus: 'aperitivo, comida y sobremesa',
    },
]);

/** Índice de provincias por slug (O(1) y tipado). */
export const EVENT_PROVINCE_BY_SLUG: Readonly<Record<string, EventProvince>> =
    Object.freeze(
        Object.fromEntries(
            EVENT_PROVINCES.map((province) => [province.slug, province] as const),
        ),
    );

/** Índice de verticales por slug. */
export const EVENT_VERTICAL_BY_SLUG: Readonly<Record<string, EventVertical>> =
    Object.freeze(
        Object.fromEntries(
            EVENT_VERTICALS.map((vertical) => [vertical.slug, vertical] as const),
        ),
    );

/** Índice de formatos por id (precios SSOT). */
export const EVENT_FORMAT_BY_ID: Readonly<Record<string, MariachiFormat>> =
    Object.freeze(
        Object.fromEntries(
            MARIACHI_FORMATS.map((format) => [format.id, format] as const),
        ),
    );

/** Ámbito nacional sintético (sin inventar distancias). */
const SPAIN_SCOPE: EventProvince = Object.freeze({
    slug: 'espana',
    name: 'España',
    capital: 'Madrid',
    community: 'España',
    region: 'NACIONAL',
    distanceKm: 0,
});

/** Patrón de intención provincial (5 patrones rotados por provincia). */
interface ProvincialPattern {
    readonly prefix: string;
    readonly vertical: EventVerticalSlug;
    readonly keyword: (province: EventProvince) => string;
    readonly hooks: readonly ((province: EventProvince) => string)[];
}

const PROVINCIAL_PATTERNS: readonly ProvincialPattern[] = Object.freeze([
    {
        prefix: 'boda',
        vertical: 'bodas-gala',
        keyword: (province) => `organizar una boda en ${province.name}`,
        hooks: Object.freeze([
            (province: EventProvince) =>
                `en ${province.capital} se concentran los juzgados y los salones, y la producción se coordina con el calendario de ${province.community}`,
            (province: EventProvince) =>
                `en ${province.name} la boda se cierra con fecha, espacio y hora de montaje; el resto se decide después`,
            (province: EventProvince) =>
                `la demanda de ${province.name} se reparte entre ${province.capital} y las fincas de alrededor, con horarios distintos`,
            (province: EventProvince) =>
                `para una boda en ${province.name}, el orden correcto es espacio, fecha y producción; invertirlo encarece el evento`,
            (province: EventProvince) =>
                `en ${province.name} la ceremonia y el banquete suelen estar separados; la producción cubre el traslado con horario pactado`,
            (province: EventProvince) =>
                `la referencia de ${province.community} no basta: cada boda de ${province.name} exige confirmar acceso y aforo real`,
        ]),
    },
    {
        prefix: 'mariachi-boda',
        vertical: 'bodas-gala',
        keyword: (province) => `mariachi para bodas en ${province.name}`,
        hooks: Object.freeze([
            (province: EventProvince) =>
                `en ${province.name} el mariachi entra en el brindis o en la entrada, y ese minuto se decide con el espacio`,
            (province: EventProvince) =>
                `la música en directo de ${province.capital} no compite con el DJ: se coloca antes del primer baile y con hora cerrada`,
            (province: EventProvince) =>
                `para una boda en ${province.name}, el formato se elige por aforo real y no por el número de invitados previstos`,
            (province: EventProvince) =>
                `el rider acústico se envía al espacio de ${province.name} antes del evento para evitar sorpresas de volumen`,
            (province: EventProvince) =>
                `en ${province.community} las bodas de verano se cierran con meses; la fecha se bloquea antes de mover instrumentos`,
            (province: EventProvince) =>
                `si la boda es en finca de ${province.name}, la formación se dimensiona por el tamaño real del salón o del jardín`,
        ]),
    },
    {
        prefix: 'boda-finca',
        vertical: 'boda-finca-ceremonia',
        keyword: (province) => `boda en finca en ${province.name}`,
        hooks: Object.freeze([
            (province: EventProvince) =>
                `en ${province.name} las fincas se reservan con meses; el montaje se valida con el espacio antes de firmar`,
            (province: EventProvince) =>
                `para una ceremonia civil en ${province.capital}, la producción confirma acceso, generador y hora de montaje`,
            (province: EventProvince) =>
                `en las fincas de ${province.community} manda el horario del recinto; la música se ajusta a ese límite`,
            (province: EventProvince) =>
                `si llueve en ${province.name}, el plan B de espacio se acuerda por escrito antes del depósito`,
            (province: EventProvince) =>
                `la finca de ${province.name} suele pedir rider acústico; se entrega antes del evento, no el mismo día`,
            (province: EventProvince) =>
                `para una boda en el campo de ${province.name}, el transporte y el montaje pesan más que el repertorio`,
        ]),
    },
    {
        prefix: 'evento-corporativo',
        vertical: 'evento-empresa',
        keyword: (province) => `evento de empresa en ${province.name}`,
        hooks: Object.freeze([
            (province: EventProvince) =>
                `en ${province.name} la empresa pide factura, rider y horario de montaje antes de confirmar la fecha`,
            (province: EventProvince) =>
                `para una presentación en ${province.capital}, la producción se coordina con la agenda del evento y no al revés`,
            (province: EventProvince) =>
                `en ${province.community} las cenas de gala se ordenan por tiempos; el show se coloca entre discursos`,
            (province: EventProvince) =>
                `si la empresa es de ${province.name}, el presupuesto se entrega desglosado y con CIF validado`,
            (province: EventProvince) =>
                `en ${province.name} el evento de marca exige seguro y documentación; se revisa antes de firmar`,
            (province: EventProvince) =>
                `para una inauguración en ${province.name}, el minuto del corte de cinta manda sobre el resto del guion`,
        ]),
    },
    {
        prefix: 'comunion',
        vertical: 'celebracion-familiar',
        keyword: (province) => `comunión o bautizo en ${province.name}`,
        hooks: Object.freeze([
            (province: EventProvince) =>
                `en ${province.name} la celebración familiar se cierra con horario de comida y repertorio para varias generaciones`,
            (province: EventProvince) =>
                `para una comunión en ${province.capital}, la música se coloca en el aperitivo y en la sobremesa, no durante la comida`,
            (province: EventProvince) =>
                `en ${province.community} los bautizos suelen ser de mañana; el formato se adapta a ese horario`,
            (province: EventProvince) =>
                `si la familia es de ${province.name}, el aforo real del salón define el formato musical`,
            (province: EventProvince) =>
                `en ${province.name} el cumpleaños con música en directo necesita hora de fin pactada con el local`,
            (province: EventProvince) =>
                `para una celebración familiar en ${province.name}, el repertorio se acuerda con los anfitriones y se confirma por escrito`,
        ]),
    },
]);

/** 8 intenciones nacionales (sin provincia: alcance España). */
const NATIONAL_INTENTS: readonly EventIntentSeed[] = Object.freeze([
    {
        slug: 'bodas-espana',
        keyword: 'organizar una boda en España',
        vertical: 'bodas-gala',
        province: null,
        hook: 'una boda en España se cierra con provincia, espacio y fecha; la producción cubre el resto con presupuesto por escrito',
    },
    {
        slug: 'mariachi-bodas-espana',
        keyword: 'mariachi para bodas en España',
        vertical: 'bodas-gala',
        province: null,
        hook: 'el mariachi de boda se coloca en la entrada o el brindis, y ese minuto se pacta con el espacio antes de reservar',
    },
    {
        slug: 'produccion-bodas-espana',
        keyword: 'producción de bodas en España',
        vertical: 'bodas-gala',
        province: null,
        hook: 'la producción de boda incluye música, sonido y coordinación de tiempos; el cliente recibe un único interlocutor',
    },
    {
        slug: 'sonido-bodas-espana',
        keyword: 'sonido para bodas en España',
        vertical: 'bodas-gala',
        province: null,
        hook: 'el sonido de boda se dimensiona por aforo y por el límite acústico del espacio, no por el equipo más grande',
    },
    {
        slug: 'boda-finca-espana',
        keyword: 'boda en finca en España',
        vertical: 'boda-finca-ceremonia',
        province: null,
        hook: 'en una finca española manda el horario del recinto y la logística de montaje; el plan B se firma antes del depósito',
    },
    {
        slug: 'ceremonia-civil-espana',
        keyword: 'ceremonia civil en España',
        vertical: 'boda-finca-ceremonia',
        province: null,
        hook: 'la ceremonia civil al aire libre exige confirmar acceso, generador y hora de montaje antes de mover el equipo',
    },
    {
        slug: 'eventos-empresa-espana',
        keyword: 'eventos de empresa en España',
        vertical: 'evento-empresa',
        province: null,
        hook: 'un evento de empresa se cierra con factura, rider y agenda; el show se coloca entre discursos y no encima de ellos',
    },
    {
        slug: 'comuniones-espana',
        keyword: 'comuniones y bautizos en España',
        vertical: 'celebracion-familiar',
        province: null,
        hook: 'una comunión se organiza por horario de comida y aforo real; el repertorio se acuerda con varias generaciones',
    },
]);

/** 60 landings de intención: 52 provinciales (patrón rotado) + 8 nacionales. */
export const EVENT_INTENT_SEEDS: readonly EventIntentSeed[] = Object.freeze([
    ...EVENT_PROVINCES.map((province, index): EventIntentSeed => {
        const pattern =
            PROVINCIAL_PATTERNS[index % PROVINCIAL_PATTERNS.length];
        if (!pattern) {
            throw new Error(`[EAR-EVENTOS] Patrón ausente para ${province.slug}`);
        }
        const hookFactory = pattern.hooks[index % pattern.hooks.length];
        if (!hookFactory) {
            throw new Error(`[EAR-EVENTOS] Hook ausente para ${province.slug}`);
        }
        return {
            slug: `${pattern.prefix}-${province.slug}`,
            keyword: pattern.keyword(province),
            vertical: pattern.vertical,
            province: province.slug,
            hook: hookFactory(province),
        };
    }),
    ...NATIONAL_INTENTS,
]);

/** Banco de aperturas (14 variantes) para la malla provincial. */
const OPENINGS: readonly string[] = Object.freeze([
    'Organizar {event} en {province} empieza por una decisión incómoda: elegir espacio antes de elegir menú, porque el espacio manda en el horario.',
    'En {province} hay salones para todos los presupuestos y muy pocos con producción propia; la diferencia aparece el día del montaje.',
    'La boda perfecta de {province} no existe; existe una boda bien cerrada, con hora de entrada, hora de cena y hora de salida.',
    'Cuando la familia está repartida por {province}, el punto medio no es un mapa: es un espacio con acceso claro y aparcamiento suficiente.',
    'Un {event} se complica cuando ceremonia, cóctel y banquete ocurren en tres sitios distintos; la producción lo resuelve con un solo guion.',
    'En {province} el calendario manda: mayo, junio y septiembre se cierran con meses y el resto se negocia con más margen.',
    'La pregunta que evita disgustos en {province} no es cuántos invitados vienen, sino cuántos caben sentados y a qué hora se puede montar.',
    'Hay quien contrata producción y hay quien compra un servicio suelto; el resultado se nota cuando cambia el horario a última hora.',
    'En {province} el viento, la lluvia o el calor cambian el plan; la producción confirma plan B por escrito antes de cobrar.',
    'Un {event} en {province} se recuerda por la música y por los tiempos; fallar en los tiempos arruina la mejor actuación.',
    'La primera llamada de {event} suele ser para preguntar precio; la segunda, para preguntar quién responde si algo falla.',
    'En {province} la diferencia entre dos presupuestos casi nunca está en la música: está en el transporte, el montaje y el seguro.',
    'Para {event} en {province}, la producción enseña primero el espacio y el rider; el repertorio se decide cuando eso está claro.',
    'Cada {event} tiene un momento irrepetible; la producción se organiza alrededor de ese minuto y no de un catálogo.',
]);

/** Banco de anclajes provinciales (14 variantes, del SSOT geográfico). */
const LOCALS: readonly string[] = Object.freeze([
    'La referencia de {province} es {capital}, y el SSOT sitúa la distancia de trabajo en {distance} km desde el Hub Central; el presupuesto final se mide por GPS.',
    'En {province}, {capital} concentra los servicios y los juzgados; las fincas se reparten por el resto de {community}.',
    '{province} pertenece a {community}; la producción trabaja con la capital como referencia logística y confirma cada acceso.',
    'La demanda de {event} en {province} se concentra en {capital} y en los municipios de alrededor, con calendarios distintos.',
    'Desde {capital} hasta el espacio del evento hay una distancia real; la producción la mide por GPS y la refleja en el presupuesto.',
    'En {province} el perfil de {region} marca el tipo de celebración: más finca en el interior, más salón en la capital.',
    '{capital} es el punto de referencia de {province}; el equipo confirma la dirección exacta antes de salir.',
    'La logística de {province} parte de una regla fija: kilómetros reales desde la dirección fiscal y sin estimaciones a ojo.',
    'En {province} el evento puede estar en la capital o a una hora de camino; el margen de montaje se amplía en consecuencia.',
    '{province} combina {capital} con municipios pequeños; la producción ajusta el formato al aforo real del espacio.',
    'La distancia de referencia de {province} en el SSOT es {distance} km; el cálculo final se hace por GPS hasta la puerta.',
    'En {community} cada provincia tiene su calendario; en {province} la temporada alta se cierra antes.',
    'Para {event} en {province}, el acceso se confirma con el espacio: puerta, ascensor, generador y hora de montaje.',
    '{capital} no es solo la capital de {province}: es el punto donde se validan proveedores, horarios y documentación.',
]);

/** Banco de ángulos de venta (14 variantes centradas en el riesgo). */
const ANGLES: readonly string[] = Object.freeze([
    'La promesa es concreta: {promise}. Si el espacio no lo permite, la producción lo dice antes de cobrar el depósito.',
    'El cliente teme tres cosas: que no lleguen, que lleguen tarde y que el sonido no funcione; las tres se resuelven con guion y prueba.',
    'Un {event} mal cerrado deja al anfitrión sin margen para saludar; uno bien cerrado le devuelve el protagonismo.',
    'La producción no decide el orden del evento: lo ejecuta. El orden se acuerda con quien manda en la celebración.',
    'Si el espacio tiene vecinos, horario de cierre o limitador, esas condiciones entran en el presupuesto desde el primer minuto.',
    'Para {short} se pregunta por el aforo real, no por el aforo soñado; de ahí sale el formato y el equipo.',
    'La diferencia entre {format} y un formato menor se nota en el equilibrio de voces y en la coordinación, no en el volumen.',
    'El repertorio no se improvisa la víspera: se acuerda con tiempo y se confirma con quien paga.',
    'Antes de mover equipo se valida acceso, ascensor, escaleras, generador y hora de montaje.',
    'Un {event} con invitados de varias generaciones exige repertorio transversal: {music}.',
    'El cliente no necesita saber de producción, necesita saber qué pasa si el evento se retrasa media hora.',
    'La producción no vende "ambiente": vende una entrada, un brindis y una salida con hora pactada.',
    'Para que {promise}, el guion se confirma con el anfitrión y con el espacio, no solo con la familia.',
    'La factura, el depósito y el rider son parte del espectáculo: si fallan, el recuerdo también falla.',
]);

/** Banco musical y de protocolo (10 variantes verificables). */
const MUSIC: readonly string[] = Object.freeze([
    'El eje musical es {music}, y se reparte entre los momentos del evento para no repetir el mismo bloque.',
    'Para este formato el foco es {music}; el resto del repertorio se acuerda según el público presente.',
    'La lista de temas se envía antes del evento para que el anfitrión marque favoritos y vetos.',
    'El orden de las canciones sigue el guion: no se toca lo mismo en la entrada que en el brindis.',
    'Con {format}, el repertorio se reparte entre momentos y se cronometra para no comerse el discurso.',
    'La formación trabaja {music} y acepta peticiones razonables si se avisan con antelación.',
    'El protocolo se acuerda por escrito: quién presenta, cuándo entra la música y qué pieza cierra.',
    'La música infantil y la de gala no se mezclan sin criterio; se pregunta por edades antes de cerrar el set.',
    'La lista final se cierra 72 horas antes y se envía al espacio para evitar duplicidades con el DJ.',
    'Cada bloque dura lo que dura el momento; la producción cronometra para no comerse el brindis ni el primer baile.',
]);

/** Banco técnico-acústico (10 variantes, Ley 37/2003 y 12 W/pax). */
const TECH: readonly string[] = Object.freeze([
    'En sonido, la referencia legal es la Ley 37/2003 del Ruido: {noise}, con medición previa en el montaje.',
    'El rider deja el límite en {noise}; el límite de salud pública general es {spl} dB SPL y {watts} W/pax.',
    'La normativa acústica marca {noise}; el refuerzo sonoro se ajusta a esa cifra y se mide con sonómetro.',
    'Para el equipo de música, el techo se pacta por escrito: {noise}, con la Ley 37/2003 como marco.',
    'La producción trabaja a {noise} y con {watts} W/pax; si el espacio exige menos, se baja sin discutir.',
    'Sobre ruido no hay improvisación: {noise} y comprobación con sonómetro antes de abrir puertas.',
    'El montaje se calibra a {noise}, con la Ley 37/2003 del Ruido como referencia obligada.',
    'Si hay vecinos o horario de cierre, el límite baja: {noise} es techo, no objetivo.',
    'La potencia se dimensiona a {watts} W/pax y el nivel se mantiene por debajo de {spl} dB SPL.',
    'Todo montaje pasa por sonómetro y por el límite de {noise}; el técnico firma la medición si el espacio lo pide.',
]);

/** Banco logístico (10 variantes): kilómetros desde la dirección fiscal del proveedor. */
const LOGISTICS: readonly string[] = Object.freeze([
    'El kilometraje se calcula desde la dirección fiscal del proveedor hasta el lugar del evento: los primeros {kmFree} km no se cobran y a partir de ahí son {eurKm} €/km.',
    'Si el evento es fuera de la base, la logística parte del domicilio fiscal: {kmFree} km exentos y {eurKm} €/km adicional.',
    'Para salidas a {province}, el cómputo arranca en la dirección fiscal del proveedor, con {kmFree} km incluidos.',
    'La distancia se mide por GPS desde el domicilio fiscal del proveedor: {kmFree} km sin coste y {eurKm} €/km después.',
    'En servicios desplazados el criterio es verificable: kilómetros reales, {kmFree} exentos y {eurKm} €/km adicional.',
    'Cualquier desplazamiento se presupuesta con la misma regla: origen en la dirección fiscal, {kmFree} km incluidos, {eurKm} €/km después.',
    'Si la distancia supera los 200 km o el evento termina después de las 3:00, se añade el suplemento hotelero de {hotel} €.',
    'La logística se factura con origen en la dirección fiscal del proveedor; los primeros {kmFree} km van incluidos y luego {eurKm} €/km.',
    'Para el cliente queda claro antes de firmar: {kmFree} km incluidos y {eurKm} €/km a partir de ahí, con GPS como prueba.',
    'En trayectos largos se valora hotel y dietas antes de cerrar la fecha; el suplemento hotelero es {hotel} € y se aplica según regla.',
]);

/** Banco de ficha provincial (8 variantes con datos del SSOT). */
const DOSSIER: readonly string[] = Object.freeze([
    'Ficha de {province}: capital {capital}, comunidad {community}, perfil {region} y distancia de referencia {distance} km desde el Hub Central.',
    'Datos de {province}: se trabaja desde {capital}, en {community}, con perfil {region} y kilometraje de referencia {distance} km.',
    'En {province} ({community}), la capital operativa es {capital}; el SSOT fija {distance} km de referencia y el GPS confirma el trayecto.',
    'La provincia de {province} se organiza desde {capital}, con un perfil {region} y una distancia de referencia de {distance} km.',
    '{province} ({community}) tiene en {capital} su referencia logística; la distancia de trabajo del SSOT es {distance} km.',
    'Contexto de {province}: región {region}, capital {capital} y {distance} km de referencia desde el Hub Central.',
    'Para situar {province}: {capital} como capital, {community} como comunidad y {distance} km de distancia de referencia.',
    'La ficha de {province} combina {community}, {capital} y un perfil {region}; el trayecto se mide por GPS y no por estimación.',
]);

/** Aperturas exclusivas de intención (16 variantes). */
const INTENT_OPENINGS: readonly string[] = Object.freeze([
    'La consulta "{keyword}" se responde con tres datos: espacio disponible, fecha bloqueada y presupuesto por escrito.',
    'Si has llegado buscando "{keyword}", lo primero es descartar lo que no se puede cumplir: aforo, horario y acceso.',
    '"{keyword}" no es una petición genérica: cambia según {province}, el tipo de espacio y la hora del evento.',
    'En {province}, quien pide {short} suele comparar precios sin ver la letra pequeña: transporte, montaje y límite acústico.',
    'Para {event} en {province}, la producción responde con un formato concreto y no con un catálogo indefinido.',
    'La respuesta a "{keyword}" empieza por el formato {format} y termina con una fecha bloqueada, no al revés.',
    'Hay dos maneras de resolver "{keyword}": improvisar el día del evento o cerrar hoy el espacio, la hora y el equipo.',
    'En {province} el precio de {short} se mueve por desplazamiento y fecha; la producción lo desglosa antes de reservar.',
    'Quien contrata {event} en {province} necesita saber qué pasa si el evento se retrasa; se deja por escrito.',
    'La consulta "{keyword}" llega muchas veces a última hora; la producción prioriza disponibilidad real, no promesas.',
    'En {province}, {short} se cierra con depósito y presupuesto: dos documentos que evitan discutir el día del evento.',
    'Para "{keyword}", la pregunta correcta es cuántos invitados caben y cuánto dura el montaje.',
    'La producción responde a "{keyword}" con el formato {format} y una lista de lo que no está incluido.',
    'Si el evento es en {province}, la respuesta a "{keyword}" incluye transporte, horario de montaje y plan B de espacio.',
    'Quien pide {event} en {province} quiere certezas: quién llega, a qué hora y con qué repertorio.',
    '"{keyword}" se resuelve mejor con una llamada de cinco minutos que con veinte mensajes: la producción la agenda.',
]);

/** Ángulos exclusivos de intención (12 variantes). */
const INTENT_ANGLES: readonly string[] = Object.freeze([
    'El presupuesto se entrega desglosado: producción, transporte, alojamiento si aplica y depósito deducible.',
    'La productora no cobra por cotizar y no bloquea fecha sin confirmación escrita del cliente.',
    'Si el espacio cambia de hora, la producción se reprograma dentro del mismo día sin cobrar dos veces.',
    'El cliente recibe el rider acústico antes del evento para enseñarlo al espacio si hace falta.',
    'Para {short}, el formato se dimensiona por aforo real y no por el número de invitados que "pueden venir".',
    'La factura se emite con el detalle del servicio; el depósito aparece como pago a cuenta.',
    'Se confirma por escrito quién es el contacto en el espacio y a qué hora se permite el montaje.',
    'Si el evento incluye discursos, la música se coloca después para no taparlos.',
    'El repertorio se cierra 72 horas antes y se envía al espacio para evitar solapamientos con el DJ.',
    'En {province}, el transporte se calcula por GPS y se enseña el trayecto antes de firmar.',
    'La producción llega con margen; si el acceso está bloqueado, avisa antes de la hora del evento.',
    'El cliente no paga "a ciegas": ve el desglose, el rider y la política de cancelación antes del depósito.',
]);

/** Rider acústico exclusivo de intención (6 variantes). */
const INTENT_TECH: readonly string[] = Object.freeze([
    'El rider se entrega con el presupuesto: techo de {noise}, {watts} W/pax y límite de salud pública por debajo de {spl} dB SPL.',
    'Si el espacio pide menos volumen del pactado, la producción baja el nivel sin romper el evento.',
    'La medición se hace antes del evento con sonómetro y se anota en el parte de montaje.',
    'La normativa aplicable es la Ley 37/2003 del Ruido; el techo para este formato es {noise}.',
    'El equipo se dimensiona a {watts} W/pax para no tapar voces ni forzar el sistema.',
    'En interiores con vecinos, el límite se rebaja al que fije el espacio, siempre por debajo de {spl} dB SPL.',
]);

/** Logística exclusiva de intención (6 variantes). */
const INTENT_LOGISTICS: readonly string[] = Object.freeze([
    'El transporte se calcula por GPS desde la dirección fiscal del proveedor, con {kmFree} km incluidos y {eurKm} €/km después.',
    'El presupuesto separa producción y transporte para que el cliente vea qué paga por cada concepto.',
    'En {province}, el trayecto se confirma con la dirección exacta y no con el nombre del municipio.',
    'Si la distancia supera los 200 km, se añade el suplemento hotelero de {hotel} € antes de cerrar la fecha.',
    'Si el evento termina después de las 3:00, el suplemento hotelero se aplica igualmente y se avisa al firmar.',
    'Los kilómetros se miden en la ruta real, no en línea recta; la productora adjunta el cálculo.',
]);

/** Bloque específico de intenciones nacionales (6 variantes). */
const NATIONAL_BLOCK: readonly string[] = Object.freeze([
    'En una cobertura nacional, la producción confirma provincia, espacio y fecha antes de mover equipo; el resto del presupuesto se detalla después.',
    'Para eventos en toda España, el transporte se calcula por GPS y el alojamiento se separa cuando la distancia lo exige.',
    'La productora trabaja con un interlocutor único por evento, aunque el equipo se desplace a otra comunidad.',
    'Si el evento es en una isla, el presupuesto incluye transporte marítimo o aéreo y margen de montaje adicional.',
    'En cobertura nacional no se prometen tiempos de trayecto: se confirman con GPS y con el horario del espacio.',
    'La documentación del evento (factura, rider y seguro) se emite antes de la fecha y se envía al cliente por escrito.',
]);

/** URL canónica del clúster (host www, tal como exige el sitemap). */
export const EAR_EVENTOS_CANONICAL_BASE = EAR_EVENTOS_ENTITY.canonicalBase;

/** Tipo de landing: malla provincial o intención transaccional. */
export type EventLandingKind = 'geo' | 'intent';

/** Alcance de la landing: provincia concreta o España. */
export type EventScope = 'province' | 'espana';

/** Pregunta frecuente con respuesta verificable. */
export interface EventFaq {
    readonly question: string;
    readonly answer: string;
}

/** Bloque narrativo de la landing. */
export interface EventLandingSection {
    readonly heading: string;
    readonly body: string;
}

/** Nodo JSON-LD serializable. */
export type EventJsonLd = Readonly<Record<string, unknown>>;

/** Enlace interno del clúster. */
export interface EventRelatedLink {
    readonly slug: string;
    readonly label: string;
    readonly verticalSlug: EventVerticalSlug;
}

/** Landing completa: copy, secciones, FAQ, sellos y grafo JSON-LD. */
export interface EventLanding {
    readonly slug: string;
    readonly path: string;
    readonly kind: EventLandingKind;
    readonly title: string;
    readonly description: string;
    readonly h1: string;
    readonly kicker: string;
    readonly keyword: string;
    readonly keywords: readonly string[];
    readonly provinceSlug: string;
    readonly provinceName: string;
    readonly provinceCapital: string;
    readonly community: string;
    readonly region: string;
    readonly distanceKm: number;
    readonly verticalSlug: EventVerticalSlug;
    readonly verticalLabel: string;
    readonly eventNoun: string;
    readonly uniqueCopy: string;
    readonly sections: readonly EventLandingSection[];
    readonly faqs: readonly EventFaq[];
    readonly noiseRange: string;
    readonly format: EventFormatSummary;
    readonly formats: readonly EventFormatSummary[];
    readonly depositEur: number;
    readonly baseFeeEur: number;
    readonly kmFree: number;
    readonly eurPerKm: number;
    readonly hotelEur: number;
    readonly wattsPerPax: number;
    readonly splLimitDb: number;
    readonly phone: string;
    readonly email: string;
    readonly operator: string;
    readonly brand: string;
    readonly provenanceHash: string;
    readonly stripeSessionId: string;
    readonly priceLockSha256: string;
    readonly schemaOrg: readonly EventJsonLd[];
    readonly related: readonly EventRelatedLink[];
}

/** FNV-1a de 32 bits: determinístico y sin dependencias. */
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
        throw new Error(`[EAR-EVENTOS] Banco vacío en el carril "${lane}"`);
    }
    return selected;
}

/** Rota un bloque de frases para variar el orden entre URLs. */
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
export function earEventosSha256(text: string): string {
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

/** Formato monetario español. */
function euro(value: number): string {
    return `${value.toFixed(2).replace('.', ',')} €`;
}

/** Contexto de composición de una landing. */
interface CopyContext {
    readonly slug: string;
    readonly kind: EventLandingKind;
    readonly keyword: string;
    readonly scope: EventScope;
    readonly province: EventProvince;
    readonly vertical: EventVertical;
    readonly format: MariachiFormat;
    readonly hook: string;
}

/** Sustituye los tokens de la plantilla con datos del SSOT. */
function fillTemplate(template: string, context: CopyContext): string {
    const provinceName =
        context.scope === 'espana' ? 'España' : context.province.name;
    const replacements: Readonly<Record<string, string>> = {
        '{province}': provinceName,
        '{capital}': context.province.capital,
        '{community}': context.province.community,
        '{region}': context.province.region,
        '{distance}': String(context.province.distanceKm),
        '{event}': context.vertical.eventNoun,
        '{short}': context.vertical.shortLabel,
        '{music}': context.vertical.musicFocus,
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
        '{keyword}': context.keyword,
        '{operator}': EAR_EVENTOS_ENTITY.operator,
        '{brand}': EAR_EVENTOS_ENTITY.brand,
    };
    return Object.entries(replacements).reduce(
        (text, [token, value]) => text.split(token).join(value),
        template,
    );
}

/**
 * Compone el núcleo narrativo único (7 bloques, carriles independientes).
 * Geo e intención usan bancos distintos para no generar clones.
 */
export function composeEventUniqueCopy(context: CopyContext): string {
    const isIntent = context.kind === 'intent';
    const isNational = context.scope === 'espana';

    const opening = fillTemplate(
        pick(isIntent ? INTENT_OPENINGS : OPENINGS, context.slug, 'opening'),
        context,
    );
    const hook = `${capitalize(context.hook.replace(/[.\s]+$/, ''))}.`;
    const blocks: string[] = [opening, hook];

    if (!isNational) {
        blocks.push(
            fillTemplate(pick(DOSSIER, context.slug, 'dossier'), context),
        );
    }

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
        if (isNational) {
            blocks.push(
                fillTemplate(
                    pick(NATIONAL_BLOCK, context.slug, 'national'),
                    context,
                ),
            );
        }
    } else {
        const local = fillTemplate(pick(LOCALS, context.slug, 'local'), context);
        const middle = rotate(
            [
                fillTemplate(pick(ANGLES, context.slug, 'angle'), context),
                fillTemplate(pick(MUSIC, context.slug, 'music'), context),
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

    return blocks.join(' ');
}

/** Construye las 7 preguntas frecuentes con respuestas verificables. */
function buildFaqs(context: CopyContext): readonly EventFaq[] {
    const depositLabel = euro(DEPOSITO_STRIPE_EUR);
    const ask = (lane: string, variants: readonly string[]): string =>
        fillTemplate(pick(variants, context.slug, lane), context);

    const last: EventFaq =
        context.scope === 'espana'
            ? {
                  question: ask('q-national', [
                      '¿Trabajáis en toda España?',
                      '¿Cómo se organiza un evento fuera de mi provincia?',
                      '¿Qué incluye la cobertura nacional?',
                  ]),
                  answer: 'La cobertura alcanza las 52 provincias españolas. La producción confirma provincia, espacio y fecha antes de mover equipo; el transporte se mide por GPS desde la dirección fiscal del proveedor y el alojamiento se separa cuando la distancia lo exige.',
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
                '¿Cuánto cuesta {event} en {province}?',
                '¿Qué presupuesto hay que prever para {event}?',
                '¿Cómo se calcula el precio de {short}?',
            ]),
            answer: `El precio de partida del formato ${context.format.name} (${context.format.members} músicos) es ${euro(context.format.basePrice)} sin IVA. El depósito de ${depositLabel} bloquea la fecha y se descuenta íntegro; el transporte y el alojamiento se detallan aparte cuando corresponden.`,
        },
        {
            question: ask('q-logistics', [
                '¿Cómo se cobra el desplazamiento a {province}?',
                '¿Los kilómetros están incluidos?',
                '¿Hay suplemento por alojamiento?',
            ]),
            answer: `El kilometraje se calcula por GPS desde la dirección fiscal del proveedor: los primeros ${LOGISTICA_KM_EXENTOS} km no se cobran y a partir de ahí son ${LOGISTICA_EUR_PER_KM.toFixed(2).replace('.', ',')} €/km. Si la distancia supera 200 km o el evento termina después de las 3:00, se añade el suplemento hotelero de ${euro(SUPLEMENTO_HOTEL_EUR)}.`,
        },
        {
            question: ask('q-formats', [
                '¿Qué formatos de producción hay?',
                '¿Cuántos músicos necesito para mi evento?',
                '¿Puedo ampliar la formación?',
            ]),
            answer: 'El catálogo va del solista al monumental (1, 4, 6 y 8 músicos según formato). La producción recomienda uno u otro por aforo y tipo de espacio, no por precio: un salón pequeño con formación monumental suena peor que un formato medido.',
        },
        {
            question: ask('q-music', [
                '¿Se puede elegir el repertorio?',
                '¿Cómo se acuerda el orden de las canciones?',
                '¿Qué música se incluye?',
            ]),
            answer: `El guion musical se acuerda antes del evento y se confirma por escrito: el eje de este formato es ${context.vertical.musicFocus}. Las peticiones se aceptan si están en catálogo y se avisan con antelación; la lista final se cierra 72 horas antes.`,
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
        last,
    ];
}

/** Secciones narrativas de la landing (3 bloques verificables). */
function buildSections(
    context: CopyContext,
    scopeName: string,
): readonly EventLandingSection[] {
    const formatsLine = joinSpanish(
        MARIACHI_FORMATS.map((format) => `${format.name} (${format.members})`),
    );
    return [
        {
            heading: `Qué incluye ${context.vertical.label} en ${scopeName}`,
            body: `La promesa del servicio es concreta: ${context.vertical.promise}. El eje musical es ${context.vertical.musicFocus}, y el formato recomendado para esta intención es ${context.format.name}, con ${context.format.members} músicos. El catálogo va de ${formatsLine}, y la producción elige por aforo y espacio, no por precio.`,
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
): readonly EventRelatedLink[] {
    if (context.scope === 'espana') {
        const sameVertical = EVENT_PROVINCES.slice(0, 6).map((province) => ({
            slug: `${context.vertical.slug}-${province.slug}`,
            label: `${context.vertical.label} en ${province.name}`,
            verticalSlug: context.vertical.slug,
        }));
        const otherVertical = EVENT_VERTICALS.filter(
            (vertical) => vertical.slug !== context.vertical.slug,
        )
            .slice(0, 3)
            .map((vertical) => ({
                slug: `${vertical.slug}-${context.province.slug}`,
                label: `${vertical.label} (${context.province.name})`,
                verticalSlug: vertical.slug,
            }));
        return [...sameVertical, ...otherVertical].filter(
            (link) => link.slug !== ownSlug,
        );
    }

    const sameProvince: EventRelatedLink[] = EVENT_VERTICALS.filter(
        (vertical) => vertical.slug !== context.vertical.slug,
    ).map((vertical) => ({
        slug: `${vertical.slug}-${context.province.slug}`,
        label: `${vertical.label} en ${context.province.name}`,
        verticalSlug: vertical.slug,
    }));

    const nearby: EventRelatedLink[] = EVENT_PROVINCES.filter(
        (province) => province.slug !== context.province.slug,
    )
        .slice(0, 3)
        .map((province) => ({
            slug: `${context.vertical.slug}-${province.slug}`,
            label: `${context.vertical.label} en ${province.name}`,
            verticalSlug: context.vertical.slug,
        }));

    return [...sameProvince, ...nearby].filter((link) => link.slug !== ownSlug);
}

/** Construye el grafo JSON-LD (Organization + Service + Offer + FAQ + Breadcrumb). */
function buildJsonLd(args: {
    readonly path: string;
    readonly title: string;
    readonly h1: string;
    readonly context: CopyContext;
    readonly scopeName: string;
    readonly faqs: readonly EventFaq[];
}): readonly EventJsonLd[] {
    const canonicalUrl = `${EAR_EVENTOS_CANONICAL_BASE}${args.path}`;
    const hubUrl = `${EAR_EVENTOS_CANONICAL_BASE}/productora-ear`;
    const checkoutUrl = `${EAR_EVENTOS_CANONICAL_BASE}/reservar/solista?formato=${args.context.format.id}`;

    const organization: EventJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${hubUrl}#organization`,
        name: EAR_EVENTOS_ENTITY.brand,
        legalName: EAR_EVENTOS_ENTITY.legalName,
        alternateName: EAR_EVENTOS_ENTITY.commercialName,
        description: EAR_EVENTOS_ENTITY.tagline,
        url: hubUrl,
        telephone: EAR_EVENTOS_ENTITY.officialLine,
        email: EAR_EVENTOS_ENTITY.email,
        founder: {
            '@type': 'Person',
            name: EAR_EVENTOS_ENTITY.operator,
            jobTitle: EAR_EVENTOS_ENTITY.operatorRole,
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: EAR_EVENTOS_ENTITY.baseMunicipality,
            addressRegion: EAR_EVENTOS_ENTITY.baseProvince,
            addressCountry: 'ES',
        },
        areaServed: {
            '@type': 'Country',
            name: EAR_EVENTOS_ENTITY.coverage.country,
        },
    };

    const service: EventJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${canonicalUrl}#service`,
        name: args.title,
        serviceType: args.context.vertical.label,
        description: `${args.context.vertical.promise}.`,
        provider: {
            '@type': 'Organization',
            name: EAR_EVENTOS_ENTITY.brand,
            telephone: EAR_EVENTOS_ENTITY.officialLine,
        },
        areaServed: { '@type': 'AdministrativeArea', name: args.scopeName },
        url: canonicalUrl,
        offers: {
            '@type': 'Offer',
            price: DEPOSITO_STRIPE_EUR,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            description:
                'Depósito de bloqueo de fecha, 100% deducible del importe final.',
            url: checkoutUrl,
        },
    };

    const offer: EventJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: `Bloqueo de fecha ${args.context.vertical.shortLabel} · ${args.scopeName}`,
        price: DEPOSITO_STRIPE_EUR,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        description:
            'Depósito deducible del importe final; la fecha se libera si no se confirma el presupuesto por escrito.',
        url: checkoutUrl,
        seller: {
            '@type': 'Organization',
            name: EAR_EVENTOS_ENTITY.legalName,
            telephone: EAR_EVENTOS_ENTITY.officialLine,
        },
        itemOffered: {
            '@type': 'Service',
            name: args.context.vertical.label,
            serviceType: args.context.vertical.label,
        },
    };

    const faqPage: EventJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: args.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
    };

    const breadcrumb: EventJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Inicio',
                item: EAR_EVENTOS_CANONICAL_BASE,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: EAR_EVENTOS_ENTITY.brand,
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

    return [organization, service, offer, faqPage, breadcrumb];
}

/** Semilla interna de landing (provincial o intención). */
interface LandingSeed {
    readonly slug: string;
    readonly kind: EventLandingKind;
    readonly keyword: string;
    readonly h1: string;
    readonly scope: EventScope;
    readonly province: EventProvince;
    readonly vertical: EventVertical;
    readonly hook: string;
}

/** Resumen publicable de un formato. */
function formatSummary(format: MariachiFormat): EventFormatSummary {
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
function buildLanding(seed: LandingSeed): EventLanding {
    const format = EVENT_FORMAT_BY_ID[seed.vertical.formatId];
    if (!format) {
        throw new Error(
            `[EAR-EVENTOS] Formato desconocido: ${seed.vertical.formatId}`,
        );
    }
    const context: CopyContext = {
        slug: seed.slug,
        kind: seed.kind,
        keyword: seed.keyword,
        scope: seed.scope,
        province: seed.province,
        vertical: seed.vertical,
        format,
        hook: seed.hook,
    };
    const scopeName =
        seed.scope === 'espana' ? 'España' : seed.province.name;

    const path = `/productora-ear/${seed.slug}`;
    const title =
        seed.kind === 'geo'
            ? `${seed.vertical.label} en ${seed.province.name} | Productora EAR`
            : `${capitalize(seed.keyword)} | Productora EAR`;

    const description = `${capitalize(seed.keyword)}: ${seed.vertical.promise}. ${
        seed.scope === 'espana'
            ? 'Cobertura en las 52 provincias españolas.'
            : `Servicio en ${seed.province.name} (${seed.province.community}).`
    } Depósito ${euro(DEPOSITO_STRIPE_EUR)} deducible.`;

    const uniqueCopy = composeEventUniqueCopy(context);
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

    const stripeSessionId = earEventosSha256(
        `ear-os:productora-ear:${seed.slug}:price-lock:deposit:${DEPOSITO_STRIPE_EUR.toFixed(2)}`,
    );
    const priceLockSha256 = earEventosSha256(
        stableStringify({
            amountEur: DEPOSITO_STRIPE_EUR,
            currency: 'EUR',
            mode: 'price-lock-sha256',
            split: SPLIT_SOBERANO,
        }),
    );
    const provenanceHash = earEventosSha256(
        stableStringify({
            entityId: EAR_EVENTOS_ENTITY.id,
            entityRule: EAR_EVENTOS_ENTITY.verificationRule,
            slug: seed.slug,
            path,
            keyword: seed.keyword,
            h1: seed.h1,
            uniqueCopy,
            province: seed.province.slug,
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
        kicker: `${EAR_EVENTOS_ENTITY.brand} · ${scopeName} · ${EAR_EVENTOS_ENTITY.operator}`,
        keyword: seed.keyword,
        keywords: [
            seed.keyword,
            `${seed.vertical.slug} ${seed.province.slug}`,
            `bodas ${seed.province.slug}`,
            'productora ear bodas',
            'produccion de bodas espana',
        ],
        provinceSlug: seed.province.slug,
        provinceName: scopeName,
        provinceCapital: seed.province.capital,
        community: seed.province.community,
        region: seed.province.region,
        distanceKm: seed.province.distanceKm,
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
        baseFeeEur: format.basePrice,
        kmFree: LOGISTICA_KM_EXENTOS,
        eurPerKm: LOGISTICA_EUR_PER_KM,
        hotelEur: SUPLEMENTO_HOTEL_EUR,
        wattsPerPax: WATTS_PER_PAX,
        splLimitDb: LIMITE_SPL_DB,
        phone: EAR_EVENTOS_ENTITY.officialLine,
        email: EAR_EVENTOS_ENTITY.email,
        operator: EAR_EVENTOS_ENTITY.operator,
        brand: EAR_EVENTOS_ENTITY.brand,
        provenanceHash,
        stripeSessionId,
        priceLockSha256,
        schemaOrg,
        related,
    };
}

/** 208 semillas geográficas: 52 provincias × 4 verticales. */
const GEO_SEEDS: readonly LandingSeed[] = Object.freeze(
    EVENT_PROVINCES.flatMap((province) =>
        EVENT_VERTICALS.map(
            (vertical): LandingSeed => ({
                slug: `${vertical.slug}-${province.slug}`,
                kind: 'geo',
                keyword: `${vertical.shortLabel} en ${province.name}`,
                h1: `${vertical.label} en ${province.name}`,
                scope: 'province',
                province,
                vertical,
                hook: `la producción trabaja ${vertical.shortLabel} en ${province.name} con espacio, fecha y horario confirmados antes de firmar`,
            }),
        ),
    ),
);

/** 60 semillas de intención (52 provinciales + 8 nacionales). */
const INTENT_SEEDS: readonly LandingSeed[] = Object.freeze(
    EVENT_INTENT_SEEDS.map((seed): LandingSeed => {
        const province = seed.province
            ? EVENT_PROVINCE_BY_SLUG[seed.province]
            : SPAIN_SCOPE;
        const vertical = EVENT_VERTICAL_BY_SLUG[seed.vertical];
        const scope: EventScope = seed.province ? 'province' : 'espana';
        if (!province || !vertical) {
            throw new Error(`[EAR-EVENTOS] Semilla inválida: ${seed.slug}`);
        }
        return {
            slug: seed.slug,
            kind: 'intent',
            keyword: seed.keyword,
            h1: capitalize(seed.keyword),
            scope,
            province,
            vertical,
            hook: seed.hook,
        };
    }),
);

/** Construye las 268 landings y aborta si hay slugs duplicados. */
function buildAllLandings(): readonly EventLanding[] {
    const seeds = [...GEO_SEEDS, ...INTENT_SEEDS];
    const seen = new Set<string>();
    for (const seed of seeds) {
        if (seen.has(seed.slug)) {
            throw new Error(`[EAR-EVENTOS] Slug duplicado: ${seed.slug}`);
        }
        seen.add(seed.slug);
    }
    return seeds.map(buildLanding);
}

/** Catálogo inmutable de las 268 landings (208 geo + 60 intención). */
export const EVENT_LANDINGS: readonly EventLanding[] = Object.freeze(
    buildAllLandings(),
);

/** Índice O(1) por slug. */
const EVENT_LANDING_BY_SLUG: ReadonlyMap<string, EventLanding> = new Map(
    EVENT_LANDINGS.map((landing) => [landing.slug, landing] as const),
);

/** Devuelve la landing o `null` (el caller decide `notFound()`). */
export function getEventLanding(slug: string): EventLanding | null {
    return EVENT_LANDING_BY_SLUG.get(slug) ?? null;
}

/** Lista de slugs para `generateStaticParams`. */
export function getEventSlugs(): readonly string[] {
    return EVENT_LANDINGS.map((landing) => landing.slug);
}

/** Agrupación del hub por vertical. */
export interface EventHubGroup {
    readonly vertical: EventVertical;
    readonly landings: readonly EventLanding[];
}

/** Datos derivados del clúster para la página hub. */
export interface EventHubData {
    readonly total: number;
    readonly geoCount: number;
    readonly intentCount: number;
    readonly provinceCount: number;
    readonly groups: readonly EventHubGroup[];
    readonly nationalIntents: readonly EventLanding[];
    readonly depositEur: number;
    readonly baseFeeEur: number;
    readonly centralita: string;
    readonly phone: string;
    readonly email: string;
    readonly operator: string;
    readonly brand: string;
    readonly coverageLabel: string;
    readonly splLimitDb: number;
    readonly wattsPerPax: number;
}

/** Snapshot del clúster (todo derivado; cero hardcode de dinero). */
export const EVENT_HUB: EventHubData = Object.freeze({
    total: EVENT_LANDINGS.length,
    geoCount: EVENT_LANDINGS.filter((landing) => landing.kind === 'geo').length,
    intentCount: EVENT_LANDINGS.filter((landing) => landing.kind === 'intent')
        .length,
    provinceCount: EVENT_PROVINCES.length,
    groups: EVENT_VERTICALS.map((vertical) => ({
        vertical,
        landings: EVENT_LANDINGS.filter(
            (landing) =>
                landing.kind === 'geo' && landing.verticalSlug === vertical.slug,
        ),
    })),
    nationalIntents: EVENT_LANDINGS.filter(
        (landing) =>
            landing.kind === 'intent' && landing.provinceSlug === SPAIN_SCOPE.slug,
    ),
    depositEur: DEPOSITO_STRIPE_EUR,
    baseFeeEur: Math.min(...MARIACHI_FORMATS.map((format) => format.basePrice)),
    centralita: EAR_EVENTOS_ENTITY.officialLine,
    phone: EAR_EVENTOS_ENTITY.officialLine,
    email: EAR_EVENTOS_ENTITY.email,
    operator: EAR_EVENTOS_ENTITY.operator,
    brand: EAR_EVENTOS_ENTITY.brand,
    coverageLabel: `${EVENT_PROVINCES.length} provincias · península, Baleares y Canarias`,
    splLimitDb: LIMITE_SPL_DB,
    wattsPerPax: WATTS_PER_PAX,
});















