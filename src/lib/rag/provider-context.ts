/**
 * PROVIDER CONTEXT RAG ENGINE (EAR OS v12.1 S-CLASS)
 * Contexto soberano y resolución RAG multi-tenant determinista por proveedor.
 *
 * Regla Inviolable:
 * - Proveedor único: Restaurante Jatetxea Ezkertza Berria & Otzarreta (Derio · Bizkaia, fundado en 1902).
 * - Sede exclusiva: Santo Domingo Hiribidea, 13, 48160 Derio (Bizkaia).
 * - Carta vigente: 4 Menús de Gala (145 € / 155 € / 165 € / 185 € + IVA) derivados de `OTZARRETA_WEDDING_MENUS`.
 * - Aforos oficiales: Salón acristalado interior (200 comensales), jardín exterior (350 comensales), 120 plazas de párking privado.
 */

import { CENTRALITA_EAR_OS, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import {
  OTZARRETA_ENTITY,
  OTZARRETA_SEATING_PRESET,
  OTZARRETA_WEDDING_MENUS,
  OTZARRETA_WEDDING_MENUS_CLAIM,
  formatOtzarretaMenuPrice,
} from '@/lib/constants/otzarreta-entity';

const CLEAN_PHONE = CENTRALITA_EAR_OS.replace(/\D/g, '');
const DEPOSIT_EUR_LABEL = DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',');
const CALENDAR_BLOCK_URL = '/calendario/catering/restaurante-otzarreta?intent=bloquear';

/**
 * Deep link de mapa de la ficha insignia.
 * Fuente única: la sede canónica declarada en la cabecera de este módulo
 * (Santo Domingo Hiribidea, 13 · 48160 Derio · Bizkaia). Cero geocodificación
 * especulativa (AF-4: la cifra/dirección sale del SSOT del proveedor).
 */
export const OTZARRETA_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Restaurante Otzarreta Ezkertza Berria, Santo Domingo Hiribidea 13, 48160 Derio, Bizkaia');

export interface ProviderKnowledgeBase {
  slug: string;
  name: string;
  propertyControl: string;
  location: string;
  territory: string;
  role: string;
  greeting: string;
  phone: string;
  capacity: {
    min: number;
    diningRoom: number;
    estateMax: number;
  };
  menus: {
    name: string;
    price: number;
    description: string;
    badge?: string;
  }[];
  culinaryHighlights: string[];
  acousticsPolicy: string;
  depositPolicy: string;
  reviewsCount: number;
}

export const OTZARRETA_KNOWLEDGE_BASE: ProviderKnowledgeBase = {
  slug: 'otzarreta',
  name: 'Restaurante Jatetxea Ezkertza Berria & Otzarreta',
  propertyControl: 'Eduardo Martínez (Dirección Gastronómica & Propiedad)',
  location: `${OTZARRETA_ENTITY.fullAddress} · Valle del Txorierri`,
  territory: 'Exclusividad Comarcal Finca Fundadora Txorierri / Gran Bilbao',
  role: `Maître Digital y Jefe de Sala de Ezkertza Berria & Otzarreta (Derio ${OTZARRETA_ENTITY.foundedYear})`,
  greeting: `Bienvenido al Caserío Restaurante Ezkertza Berria & Otzarreta en Derio (fundado en ${OTZARRETA_ENTITY.foundedYear}). Alta brasa de carbón de encina y sarmiento, ${OTZARRETA_WEDDING_MENUS.length} ${OTZARRETA_WEDDING_MENUS_CLAIM}, salón acristalado interior (${OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax} comensales), jardín exterior (${OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax} comensales) y ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas de párking privado. ¿Qué deseas consultar?`,
  phone: CENTRALITA_EAR_OS,
  capacity: {
    min: 50,
    diningRoom: OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax,
    estateMax: OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax,
  },
  menus: OTZARRETA_WEDDING_MENUS.map((menu) => ({
    name: menu.name,
    price: menu.priceEur ?? 0,
    description: menu.note,
    badge: `${formatOtzarretaMenuPrice(menu.priceEur) ?? 'Consultar'} + IVA`,
  })),
  culinaryHighlights: [
    `Alta brasa de carbón de encina y sarmiento dirigida por Eduardo Martínez (tradición desde ${OTZARRETA_ENTITY.foundedYear})`,
    'Chuletones de 1 Kg y carnes de ganado mayor con maduración certificada',
    'Pescados salvajes del Cantábrico (rodaballo, rape, lubina, bacalao)',
    `Salón acristalado interior (${OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax} comensales) y jardín exterior (${OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax} comensales) con 1 sola boda al día`,
    `Parking privado gratuito en el caserío con ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas`,
    'Comedores climatizados e insonorizados con sonido homologado Bose S-Class (Ley 37/2003)',
  ],
  acousticsPolicy:
    'Sonorización homologada Bose S-Class con refuerzo calibrado para discursos y banquete según Ley 37/2003 del Ruido (rango 80–85 dBA). Cero sanciones ni cortes intempestivos.',
  depositPolicy: `Bloqueo oficial de fecha con depósito Stripe garantizado de ${DEPOSIT_EUR_LABEL} € (100% deducible del presupuesto final del banquete).`,
  reviewsCount: 23,
};

export interface ProviderResolutionResult {
  handled: boolean;
  reply: string;
  action?: {
    type: 'whatsapp' | 'dossier' | 'date_picker' | 'scraper';
    label: string;
    url?: string;
  };
  shouldEscalate: boolean;
}

/**
 * Resuelve consultas cuando el usuario está en el contexto soberano de Ezkertza Berria & Otzarreta (Derio).
 */
export function resolveOtzarretaQuery(rawQuery: string): ProviderResolutionResult {
  const q = rawQuery.toLowerCase().trim();

  // 0. CÓMO LLEGAR · accesos · mapa (chip «Cómo llegar»).
  // Debe resolverse ANTES de cualquier otra rama porque la pregunta real del
  // chip es «¿Cómo llego al caserío y cuánto párking hay?»: contiene «cuánto»
  // (rama de precios) y «párking» (rama de aforo), y antes se contestaba con
  // la lista de menús — el chip parecía muerto. Medido 2026-11-21.
  if (
    q.includes('como llegar') ||
    q.includes('cómo llegar') ||
    q.includes('como llego') ||
    q.includes('cómo llego') ||
    q.includes('llegar') ||
    q.includes('llego') ||
    q.includes('acceso') ||
    q.includes('mapa') ||
    q.includes('gps') ||
    q.includes('ubicacion') ||
    q.includes('ubicación')
  ) {
    return {
      handled: true,
      reply:
        `El Caserío Restaurante Ezkertza Berria & Otzarreta (fundado en ${OTZARRETA_ENTITY.foundedYear}) está en ${OTZARRETA_ENTITY.fullAddress}: 8 minutos desde Bilbao por el Corredor del Txorierri (N-637) y 5 minutos del Aeropuerto de Bilbao (Loiu), con campa de acceso directo y parking privado gratuito de ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas vigiladas. Pulsa «Abrir ruta en Google Maps» y tendrás el itinerario listo para el día del evento.`,
      action: {
        type: 'whatsapp',
        label: 'Abrir ruta en Google Maps',
        url: OTZARRETA_MAPS_URL,
      },
      shouldEscalate: false,
    };
  }

  // 1. Brasas, carnes, parrilla al carbón de encina y sarmiento (antes de menús si no piden precio/carta)
  const asksMenuOrPrice =
    q.includes('menu') ||
    q.includes('menú') ||
    q.includes('precio') ||
    q.includes('carta') ||
    q.includes('cubierto') ||
    q.includes('145') ||
    q.includes('155') ||
    q.includes('165') ||
    q.includes('185');

  if (
    !asksMenuOrPrice &&
    (q.includes('brasa') ||
      q.includes('chuleta') ||
      q.includes('chuleton') ||
      q.includes('chuletón') ||
      q.includes('parrilla') ||
      q.includes('encina') ||
      q.includes('sarmiento') ||
      q.includes('carne') ||
      q.includes('pescado') ||
      q.includes('rodaballo') ||
      q.includes('bogavante'))
  ) {
    return {
      handled: true,
      reply:
        `En Ezkertza Berria & Otzarreta (Derio, tradición desde ${OTZARRETA_ENTITY.foundedYear}), Eduardo Martínez dirige la alta brasa de carbón de encina y sarmiento al minuto: chuletones de 1 Kg de ganado mayor con maduración certificada, pescados salvajes del Cantábrico a la brasa y mariscos nobles (bogavante, cigalas, almejas gallegas), en nuestro salón acristalado interior (${OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax} comensales) o jardín exterior (${OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax} comensales) con ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas de párking privado.`,
      action: {
        type: 'whatsapp',
        label: `Consultar detalles de parrilla (${CENTRALITA_EAR_OS})`,
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola, deseo consultar las opciones de alta brasa de carbón y sarmiento para mi banquete en Ezkertza Berria & Otzarreta (Derio).')}`,
      },
      shouldEscalate: false,
    };
  }

  // 2. Menús de Gala vigentes (145 € - 185 € + IVA) y gastronomía
  if (
    q.includes('menu') ||
    q.includes('menú') ||
    q.includes('precio') ||
    q.includes('cuanto cuesta') ||
    q.includes('cuánto cuesta') ||
    q.includes('cuanto vale') ||
    q.includes('cuánto vale') ||
    q.includes('cuanto sale') ||
    q.includes('cuánto sale') ||
    q.includes('145') ||
    q.includes('155') ||
    q.includes('165') ||
    q.includes('185') ||
    q.includes('tradicion') ||
    q.includes('tradición') ||
    q.includes('asador') ||
    q.includes('ezkertza') ||
    q.includes('soberano') ||
    q.includes('gala') ||
    q.includes('cubierto') ||
    q.includes('comida') ||
    q.includes('plato') ||
    q.includes('carta') ||
    q.includes('celiac') ||
    q.includes('celíac') ||
    q.includes('alergia') ||
    q.includes('gluten')
  ) {
    if (q.includes('celiac') || q.includes('celíac') || q.includes('alergia') || q.includes('gluten')) {
      return {
        handled: true,
        reply:
          `En Ezkertza Berria & Otzarreta (Derio ${OTZARRETA_ENTITY.foundedYear}), la seguridad alimentaria es absoluta. Contamos con protocolos e instalaciones adaptadas para celíacos (100% sin gluten con pan y postres dedicados), intolerancias y menús infantiles/veganos sin coste adicional. Todo supervisado directamente por Eduardo Martínez.`,
        action: {
          type: 'dossier',
          label: 'Ver garantías de cocina y alérgenos',
          url: '/otzarreta',
        },
        shouldEscalate: false,
      };
    }

    if (q.includes('155') || q.includes('asador')) {
      return {
        handled: true,
        reply:
          `El Menú Asador (155,00 € + IVA) tiene como eje la alta brasa de carbón de encina y sarmiento de Eduardo Martínez en nuestro caserío de Derio (desde ${OTZARRETA_ENTITY.foundedYear}): chuletones de 1 Kg de ganado mayor y piezas del Cantábrico con exclusividad de 1 boda al día, salón acristalado interior (${OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax} comensales), jardín exterior (${OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax} comensales) y ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas de párking privado.`,
        action: {
          type: 'date_picker',
          label: `Bloquear fecha con fianza de ${DEPOSITO_STRIPE_EUR} € (Deducible)`,
          url: CALENDAR_BLOCK_URL,
        },
        shouldEscalate: true,
      };
    }

    if (q.includes('165') || q.includes('ezkertza')) {
      return {
        handled: true,
        reply:
          `El Menú Ezkertza (165,00 € + IVA) es el menú insignia del caserío en Derio (tradición desde ${OTZARRETA_ENTITY.foundedYear}), con las piezas nobles de la casa y alta brasa de carbón y sarmiento. Disponéis de salón acristalado interior (${OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax} comensales), jardín exterior (${OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax} comensales) y ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas de párking privado.`,
        action: {
          type: 'date_picker',
          label: `Bloquear fecha con fianza de ${DEPOSITO_STRIPE_EUR} € (Deducible)`,
          url: CALENDAR_BLOCK_URL,
        },
        shouldEscalate: true,
      };
    }

    const menuLines = OTZARRETA_WEDDING_MENUS.map(
      (menu) => `• ${menu.name}: ${formatOtzarretaMenuPrice(menu.priceEur) ?? 'Consultar'} + IVA (${menu.note})`
    ).join('\n');

    return {
      handled: true,
      reply:
        `En Restaurante Ezkertza Berria & Otzarreta en Derio (tradición desde ${OTZARRETA_ENTITY.foundedYear}) ofrecemos nuestros ${OTZARRETA_WEDDING_MENUS.length} menús oficiales de gala (${OTZARRETA_WEDDING_MENUS_CLAIM}), elaborados sobre alta brasa de carbón de encina y sarmiento por Eduardo Martínez:\n` +
        `${menuLines}\n` +
        `Disponemos de salón acristalado interior (${OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax} comensales), jardín exterior (${OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax} comensales) y ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas de párking privado. Puedes bloquear tu fecha con ${DEPOSITO_STRIPE_EUR} € deducibles.`,
      action: {
        type: 'dossier',
        label: `Ver los ${OTZARRETA_WEDDING_MENUS.length} Menús de Gala en el Simulador`,
        url: '/otzarreta',
      },
      shouldEscalate: false,
    };
  }

  // 3. Aforo, capacidad, salón interior, jardín exterior y párking
  if (
    q.includes('aforo') ||
    q.includes('capacidad') ||
    q.includes('invitados') ||
    q.includes('cuantas personas') ||
    q.includes('espacio') ||
    q.includes('salon') ||
    q.includes('salón') ||
    q.includes('interior') ||
    q.includes('exterior') ||
    q.includes('comedor') ||
    q.includes('jardin') ||
    q.includes('jardín') ||
    q.includes('carpa') ||
    q.includes('ceremonia') ||
    q.includes('parking') ||
    q.includes('párking') ||
    q.includes('exclusiv') ||
    q.includes('una boda') ||
    q.includes('1 boda')
  ) {
    return {
      handled: true,
      reply:
        `En Restaurante Ezkertza Berria & Otzarreta (Derio, tradición desde ${OTZARRETA_ENTITY.foundedYear}) celebramos solo 1 boda o evento al día con exclusividad total: ${OTZARRETA_SEATING_PRESET.interiorSalon.label.toLowerCase()} interior (${OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax} comensales, ${OTZARRETA_SEATING_PRESET.interiorSalon.standardRange}), jardín exterior con carpa (${OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax} comensales, ${OTZARRETA_SEATING_PRESET.exteriorGarden.standardRange}) y párking privado gratuito de ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas vigiladas.`,
      action: {
        type: 'dossier',
        label: 'Ver Ficha de Espacios y Aforo',
        url: '/otzarreta',
      },
      shouldEscalate: false,
    };
  }

  // 4. Ubicación en Derio, accesos
  if (
    q.includes('donde') ||
    q.includes('dónde') ||
    q.includes('direccion') ||
    q.includes('dirección') ||
    q.includes('derio') ||
    q.includes('bizkaia') ||
    q.includes('aeropuerto') ||
    q.includes('bilbao')
  ) {
    return {
      handled: true,
      reply:
        `El Caserío Restaurante Ezkertza Berria & Otzarreta (fundado en ${OTZARRETA_ENTITY.foundedYear}) se encuentra en ${OTZARRETA_ENTITY.fullAddress}. Está a 8 minutos de Bilbao por el Corredor del Txorierri (N-637) y a 5 minutos del Aeropuerto de Bilbao (Loiu), con campa de acceso directo y párking privado propio de ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas.`,
      action: {
        type: 'whatsapp',
        label: 'Solicitar ruta GPS y visita técnica',
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola, deseo solicitar cita para visita técnica al caserío en Derio (Bizkaia).')}`,
      },
      shouldEscalate: false,
    };
  }

  // 5. Reserva, visita técnica, disponibilidad, fianza 100 €
  if (
    q.includes('reserva') ||
    q.includes('fecha') ||
    q.includes('disponib') ||
    q.includes('visita') ||
    q.includes('cita') ||
    q.includes('100') ||
    q.includes('bloquear') ||
    q.includes('fianza') ||
    q.includes('deposito') ||
    q.includes('depósito')
  ) {
    return {
      handled: true,
      reply:
        `En Ezkertza Berria & Otzarreta (Derio ${OTZARRETA_ENTITY.foundedYear}) solo se celebra una boda al día para garantizar exclusividad total. Puedes solicitar una visita técnica guiada al caserío y bloquear tu fecha en el calendario con el depósito garantizado de ${DEPOSIT_EUR_LABEL} € (Stripe Price-Lock), deducible al 100% del presupuesto final del banquete.`,
      action: {
        type: 'date_picker',
        label: `Bloquear fecha con depósito de ${DEPOSITO_STRIPE_EUR} €`,
        url: CALENDAR_BLOCK_URL,
      },
      shouldEscalate: true,
    };
  }

  // 6. Consultas de música o DJ
  if (
    q.includes('musica') ||
    q.includes('música') ||
    q.includes('dj') ||
    q.includes('sonido') ||
    q.includes('acustica') ||
    q.includes('acústica') ||
    q.includes('bose') ||
    q.includes('edwin')
  ) {
    return {
      handled: true,
      reply:
        `El caserío cuenta con sonorización homologada Bose S-Class (Ley 37/2003, 80–85 dBA) sin cortes ni sanciones acústicas, tanto en el salón acristalado interior (${OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax} comensales) como en las zonas exteriores. Para música en directo, DJ o ceremonias, coordinamos la producción técnica oficial a través de la Centralita.`,
      action: {
        type: 'whatsapp',
        label: `Consultar sonorización y música (${CENTRALITA_EAR_OS})`,
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola, me interesa consultar la sonorización y música para mi banquete en Ezkertza Berria & Otzarreta (Derio).')}`,
      },
      shouldEscalate: false,
    };
  }

  // 7. Respuesta genérica
  return {
    handled: true,
    reply:
      `Estás en contacto con la Conserjería de Ezkertza Berria & Otzarreta en Derio (tradición desde ${OTZARRETA_ENTITY.foundedYear}). Puedo informarte con exactitud sobre nuestros ${OTZARRETA_WEDDING_MENUS.length} menús de gala (${OTZARRETA_WEDDING_MENUS_CLAIM}), alta brasa de carbón y sarmiento, salón acristalado interior (${OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax} comensales), jardín exterior (${OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax} comensales) y ${OTZARRETA_SEATING_PRESET.parkingSpaces} plazas de párking privado.`,
    action: {
      type: 'whatsapp',
      label: `Hablar con la Conserjería (${CENTRALITA_EAR_OS})`,
      url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(`Hola, estoy en la ficha de Ezkertza Berria & Otzarreta (Derio) y deseo consultar sobre: "${rawQuery.slice(0, 100)}"`)}`,
    },
    shouldEscalate: false,
  };
}
