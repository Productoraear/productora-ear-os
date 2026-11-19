import { DOORS } from '@/lib/catalog/ecosystem-ontology';
import type { DoorId } from '@/lib/catalog/ecosystem-ontology';

export type LeadTemp = 'COLD' | 'WARM' | 'HOT';

/** Prefijo `WA:` = abrir WhatsApp de la Centralita con el texto indicado. */
export interface TempCta {
  readonly label: string;
  readonly href: string;
}

export interface JourneyStage {
  readonly id: string;
  readonly kicker: string;
  readonly title: string;
  readonly body: string;
  readonly bullets: readonly string[];
  readonly image: string;
  readonly imageAlt: string;
  readonly ctas: Readonly<Record<LeadTemp, TempCta>>;
}

export interface JourneyContent {
  readonly heroImage: string;
  readonly heroAlt: string;
  readonly headline: string;
  readonly lead: string;
  readonly gallery: readonly { src: string; alt: string }[];
  readonly stages: readonly JourneyStage[];
  readonly agentGreeting: string;
}

const SONO = '/images/providers/sonomusic';
const BANANA = '/images/banana';

export const JOURNEYS: Readonly<Record<DoorId, JourneyContent>> = Object.freeze({
  gobiernos: {
    heroImage: `${BANANA}/mariachi_gala_sunset.jpg`,
    heroAlt: 'Formación musical en directo al atardecer en una plaza',
    headline: 'La fiesta de su municipio, contratada en un solo expediente.',
    lead: 'Música, sonido e iluminación para festejos patronales y ciclos culturales, con documentación lista para la Administración.',
    gallery: [
      { src: `${BANANA}/mariachi_gala_sunset.jpg`, alt: 'Formación en directo' },
      { src: `${SONO}/PACK-CONCIERTO-1-Y-2.png`, alt: 'Pack técnico para concierto' },
      { src: `${SONO}/Altavos-autoamplificado.png`, alt: 'Altavoces autoamplificados' },
      { src: `${SONO}/iluminacion.png`, alt: 'Iluminación de escenario' },
    ],
    agentGreeting: 'Soy el asistente de EAR OS. ¿Qué necesita su concejalía: fiestas patronales, un ciclo cultural o infraestructura técnica?',
    stages: [
      {
        id: 'festejos',
        kicker: '01 · Programa',
        title: 'Defina el programa de fiestas',
        body: 'Elija entre solistas, formaciones folclóricas y grandes orquestas de verbena para cada noche del programa.',
        bullets: ['Orquesta de 13 músicos para verbena', 'Formaciones de 3 a 8 músicos', 'Solista lírico de gala'],
        image: `${BANANA}/mariachi_gala_sunset.jpg`,
        imageAlt: 'Formación musical en directo',
        ctas: {
          COLD: { label: 'Ver el catálogo artístico', href: '/artistas' },
          WARM: { label: 'Calcular presupuesto', href: '/presupuesto' },
          HOT: { label: 'Hablar con un técnico ahora', href: 'WA:Hola, necesito cerrar la contratación de las fiestas patronales de mi municipio.' },
        },
      },
      {
        id: 'ciclos',
        kicker: '02 · Cumplimiento',
        title: 'Contratación menor sin fricción',
        body: 'Fichas y presupuestos pensados para el contrato menor del artículo 118 de la LCSP, por debajo de 14.250 €.',
        bullets: ['Facturación electrónica FACe', 'Seguros y homologaciones', 'Presupuesto cerrado y fechado'],
        image: `${BANANA}/finca_minimalist.jpg`,
        imageAlt: 'Espacio cultural minimalista',
        ctas: {
          COLD: { label: 'Cómo funciona la contratación', href: '/ayuntamientos' },
          WARM: { label: 'Preparar presupuesto para expediente', href: '/presupuesto' },
          HOT: { label: 'Solicitar documentación hoy', href: 'WA:Hola, necesito la documentación para un contrato menor (art. 118 LCSP).' },
        },
      },
      {
        id: 'infraestructura',
        kicker: '03 · Infraestructura',
        title: 'Sonido e iluminación para la plaza',
        body: 'Sistemas suspendidos para exteriores, iluminación y pantallas LED, montados por técnicos.',
        bullets: ['Line Array para exteriores', 'Iluminación y efectos', 'Pantallas LED de gran formato'],
        image: `${SONO}/PACK-CONCIERTO-3.png`,
        imageAlt: 'Pack de sonido para concierto',
        ctas: {
          COLD: { label: 'Explorar equipamiento', href: '/alquiler-equipos-sonido-audiovisuales' },
          WARM: { label: 'Configurar el rider técnico', href: '/presupuesto' },
          HOT: { label: 'Reservar equipo para mi fecha', href: 'WA:Hola, quiero reservar sonido e iluminación para una fecha concreta.' },
        },
      },
      {
        id: 'pliego',
        kicker: '04 · Contratación',
        title: 'Cierre con garantía',
        body: 'Fecha bloqueada con fianza deducible y contrato bilateral. Soporte durante toda la producción.',
        bullets: ['Fianza deducible del importe', 'Contrato entre las dos partes', 'Soporte 24/7 en producción'],
        image: `${SONO}/iluminacion-1.png`,
        imageAlt: 'Iluminación en directo',
        ctas: {
          COLD: { label: 'Ver garantías y registro público', href: '/confianza' },
          WARM: { label: 'Pedir presupuesto cerrado', href: '/presupuesto' },
          HOT: { label: 'Bloquear la fecha', href: 'WA:Hola, quiero bloquear fecha con la fianza para una contratación municipal.' },
        },
      },
    ],
  },
  celebraciones: {
    heroImage: `${BANANA}/finca_luxury_gala.jpg`,
    heroAlt: 'Finca preparada para una celebración de gala',
    headline: 'Su celebración, resuelta desde la primera conversación.',
    lead: 'Restaurante Otzarreta (Eduardo Martínez) en Derio (Txorierri · Bizkaia), menús oficiales, música de gala y reserva con fianza deducible.',
    gallery: [
      { src: `${BANANA}/finca_luxury_gala.jpg`, alt: 'Finca de gala' },
      { src: `${BANANA}/finca_minimalist.jpg`, alt: 'Espacio minimalista' },
      { src: `${BANANA}/mariachi_minimal.jpg`, alt: 'Música de gala' },
      { src: '/images/wedding.png', alt: 'Celebración de boda' },
    ],
    agentGreeting: '¡Hola! Cuénteme qué celebra y para cuántas personas, y le preparo el camino: espacio, menú, música y reserva.',
    stages: [
      {
        id: 'fincas',
        kicker: '01 · Espacio',
        title: 'Un lugar con carácter',
        body: 'Caserío con parrilla de brasa tradicional, salón acristalado y jardines en Derio (Bizkaia), con dominio del valle de Txorierri y Gran Bilbao.',
        bullets: ['Restaurante Otzarreta · Eduardo Martínez (Derio)', 'Txorierri · A 11 km de Bilbao (Gran Bilbao)', 'Salón y carpa para 50 a 350 comensales', 'Párking privado propio'],
        image: `${BANANA}/finca_luxury_gala.jpg`,
        imageAlt: 'Finca de gala',
        ctas: {
          COLD: { label: 'Conocer Restaurante Otzarreta (Derio)', href: '/otzarreta' },
          WARM: { label: 'Comparar fincas en Bizkaia', href: '/fincas' },
          HOT: { label: 'Consultar mi fecha ahora', href: 'WA:Hola, quiero consultar disponibilidad en Restaurante Otzarreta (Derio) para mi fecha.' },
        },
      },
      {
        id: 'menus',
        kicker: '02 · Menú y mesas',
        title: 'Menús oficiales y mesas a su medida',
        body: 'Elija entre los menús de temporada y organice los comensales con el organizador digital de mesas.',
        bullets: ['Menús oficiales de 145 € a 185 € + IVA', 'Organizador digital de mesas', 'Parrilla tradicional'],
        image: `${BANANA}/finca_minimalist.jpg`,
        imageAlt: 'Mesas dispuestas para un banquete',
        ctas: {
          COLD: { label: 'Ver menús', href: '/otzarreta' },
          WARM: { label: 'Calcular mi presupuesto', href: '/presupuesto' },
          HOT: { label: 'Reservar menú y fecha', href: 'WA:Hola, quiero reservar fecha y menú en Restaurante Otzarreta.' },
        },
      },
      {
        id: 'musica',
        kicker: '03 · Música de gala',
        title: 'La música que da el tono',
        body: 'Artistas verificados para ceremonia, cóctel y baile, contratados sin intermediarios.',
        bullets: ['Solistas y formaciones de gala', 'Orquesta de 13 músicos', 'Sonido profesional incluido en el rider'],
        image: `${BANANA}/mariachi_minimal.jpg`,
        imageAlt: 'Formación de gala',
        ctas: {
          COLD: { label: 'Escuchar artistas', href: '/artistas' },
          WARM: { label: 'Añadir música al presupuesto', href: '/presupuesto' },
          HOT: { label: 'Cerrar artista para mi fecha', href: 'WA:Hola, quiero cerrar un artista para mi celebración.' },
        },
      },
      {
        id: 'reserva',
        kicker: '04 · Reserva',
        title: 'Bloquee su fecha con fianza',
        body: 'Una fianza deducible asegura la fecha mientras ultima los detalles. Sin letra pequeña.',
        bullets: ['Fianza deducible de la factura', 'Atención inmediata por WhatsApp', 'Contrato claro entre las dos partes'],
        image: '/images/wedding.png',
        imageAlt: 'Celebración de boda',
        ctas: {
          COLD: { label: 'Ver cómo funciona la reserva', href: '/confianza' },
          WARM: { label: 'Obtener presupuesto con fianza', href: '/presupuesto' },
          HOT: { label: 'Reservar ahora', href: 'WA:Hola, quiero bloquear mi fecha con la fianza.' },
        },
      },
    ],
  },
  profesionales: {
    heroImage: `${SONO}/mesas-de-mezcla-1.png`,
    heroAlt: 'Mesa de mezcla profesional',
    headline: 'Publique su ficha y cobre con garantía.',
    lead: 'Alta en una o varias categorías, alquiler técnico y red de afiliados con comisión recurrente.',
    gallery: [
      { src: `${SONO}/mesas-de-mezcla-1.png`, alt: 'Mesa de mezcla' },
      { src: `${SONO}/microfonos.png`, alt: 'Micrófonos' },
      { src: `${SONO}/PACK-BACKLINE.png`, alt: 'Pack backline' },
      { src: `${SONO}/PACK-DISCOMOVIL-1.png`, alt: 'Pack discomóvil' },
    ],
    agentGreeting: 'Bienvenido. ¿Es artista, empresa técnica, finca o quiere recomendar la plataforma? Le llevo al camino correcto.',
    stages: [
      {
        id: 'publicar',
        kicker: '01 · Alta',
        title: 'Publique su ficha en una o varias categorías',
        body: 'Una orquesta puede estar en Música y en Sonido a la vez. Usted elige qué ofrecer.',
        bullets: ['Doble categoría sin duplicar trabajo', 'Ficha con fotos, tarifas y disponibilidad', 'Visible para clientes e instituciones'],
        image: `${SONO}/PACK-BACKLINE.png`,
        imageAlt: 'Pack backline',
        ctas: {
          COLD: { label: 'Ver el directorio', href: '/proveedores' },
          WARM: { label: 'Abrir mi cabina de proveedor', href: '/portal/proveedor' },
          HOT: { label: 'Darme de alta hoy', href: 'WA:Hola, quiero dar de alta mi ficha profesional en EAR OS.' },
        },
      },
      {
        id: 'cobro',
        kicker: '02 · Cobro',
        title: 'Cobro garantizado por pasarela',
        body: 'El cliente paga una fianza al reservar y el resto queda registrado. Reparto 80/10/10 en cada actuación.',
        bullets: ['80 % para el artista', '10 % para EAR OS', '10 % para VIMUME'],
        image: `${SONO}/mesas-de-mezcla-1.png`,
        imageAlt: 'Mesa de mezcla',
        ctas: {
          COLD: { label: 'Entender el reparto', href: '/confianza' },
          WARM: { label: 'Simular mis ingresos', href: '/presupuesto' },
          HOT: { label: 'Hablar con un asesor', href: 'WA:Hola, quiero que me expliquen el cobro y el reparto 80/10/10.' },
        },
      },
      {
        id: 'alquiler',
        kicker: '03 · Alquiler técnico',
        title: 'Alquile sonido, luz y pantallas',
        body: 'Si tiene equipo propio, ofrézcalo en alquiler junto a su espectáculo o por separado.',
        bullets: ['Line Array y sonido de sala', 'Iluminación y puentes de luces', 'Pantallas LED'],
        image: `${SONO}/PACK-DISCOMOVIL-1.png`,
        imageAlt: 'Pack discomóvil',
        ctas: {
          COLD: { label: 'Ver equipamiento', href: '/alquiler-equipos-sonido-audiovisuales' },
          WARM: { label: 'Publicar mi equipo', href: '/portal/proveedor' },
          HOT: { label: 'Alquilar equipo ahora', href: 'WA:Hola, quiero ofrecer o alquilar equipo técnico en EAR OS.' },
        },
      },
      {
        id: 'afiliados',
        kicker: '04 · Red de afiliados',
        title: 'Recomiende y gane comisión',
        body: 'Recomiende la plataforma a otros profesionales o salas y cobre por cada contrato liquidado.',
        bullets: ['Comisión recurrente', 'Seguimiento transparente', 'Sin cuota de entrada'],
        image: `${SONO}/microfonos.png`,
        imageAlt: 'Micrófonos',
        ctas: {
          COLD: { label: 'Conocer la red de afiliados', href: '/afiliados' },
          WARM: { label: 'Unirme a la red', href: '/afiliados' },
          HOT: { label: 'Activar mi enlace de afiliado', href: 'WA:Hola, quiero activar mi enlace de afiliado.' },
        },
      },
    ],
  },
});

export function doorTitle(door: DoorId): string {
  return DOORS[door].title;
}
