/**
 * PROVIDER CONTEXT RAG ENGINE (EAR OS v12.1 S-CLASS)
 * Contexto soberano y resolución RAG multi-tenant determinista por proveedor.
 * 
 * Regla Inviolable:
 * - Proveedor único: Restaurante Jatetxea Ezkertza Berria & Otzarreta (Derio · Bizkaia).
 * - Sede exclusiva: Santo Domingo Hiribidea, 13, 48160 Derio (Bizkaia).
 * - Zarautz ELIMINADO TOTALMENTE (era un error de sede no operativa para bodas de Eduardo).
 * - Precios Canónicos 2026: 7 Menús Oficiales (Cantábrico 100 €, Paloma 125 €, Imperial 123,40 €, Temporada 142,50 €, Vasco 138 €, Ezkertza 155 €, Caserío Beko 173 €).
 */

import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

const CLEAN_PHONE = CENTRALITA_EAR_OS.replace(/\D/g, '');

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
  location: 'Santo Domingo Hiribidea, 13, 48160 Derio (Bizkaia) · Valle del Txorierri',
  territory: 'Exclusividad Comarcal Finca Fundadora Txorierri / Gran Bilbao',
  role: 'Maître Digital y Jefe de Sala de Ezkertza Berria & Otzarreta (Derio)',
  greeting: 'Bienvenido al Caserío Restaurante Ezkertza Berria & Otzarreta en Derio (Bizkaia). Soy el asistente de sala de Eduardo Martínez. ¿Deseas consultar nuestros 7 menús oficiales de boda 2026 (desde 100 € + IVA), disponibilidad o aforos?',
  phone: CENTRALITA_EAR_OS,
  capacity: {
    min: 50,
    diningRoom: 200,
    estateMax: 350,
  },
  menus: [
    {
      name: 'Menú Cantábrico',
      price: 100,
      description: 'El clásico atlántico: Marisco a la plancha individual, merluza en salsa verde o bacalao al pil-pil y taco de entrecotte a la brasa.',
      badge: '100 € + IVA · CLÁSICO NUPCIAL'
    },
    {
      name: 'Menú Paloma',
      price: 125,
      description: 'Cortador de jamón en vivo en jardines, parrillada de marisco, trancha de rodaballo salvaje y lechazo asado de Castilla.',
      badge: '125 € + IVA · PARRILLA & MAR'
    },
    {
      name: 'Menú Especial Imperial',
      price: 123.4,
      description: 'Oferta especial con regalo: 1 h de Barra Libre + 1 h de DJ en directo. Nécoras con rape, foie micuit, milhojas de bacalao con txangurro y solomillo trufado.',
      badge: 'OFERTA 123,40 € + IVA (Tarifa 138,40 €)'
    },
    {
      name: 'Menú Temporada',
      price: 142.5,
      description: 'Cortador de jamón ibérico incluido, 1/2 bogavante del país, almejas gallegas, rape o lubina salvaje y cordero lechal o láminas de buey gallego.',
      badge: '142,50 € + IVA · ALTA COCINA VASCA'
    },
    {
      name: 'Menú Vasco',
      price: 138,
      description: 'El pack más completo: 2 h Barra Libre + 2 h DJ + Autobús 55 pax + Decoración floral + Degustación 6 pax. Cóctel 5 cucharas, milhojas de bacalao o rape salvaje, y chuleta (500 g) o solomillo con hongos.',
      badge: 'OFERTA 138,00 € + IVA (Tarifa 153 €)'
    },
    {
      name: 'Menú Ezkertza',
      price: 155,
      description: 'El festín de los reyes del marisco: Chuletón de 1 Kg a la brasa, 1/2 bogavante del Cantábrico, cigala, gambas de Huelva y almeja fina gallega.',
      badge: '155 € + IVA · CHULETÓN & BOGAVANTE'
    },
    {
      name: 'Menú Caserío Ezkertza Beko',
      price: 173,
      description: 'La cumbre gastronómica: Möet & Chandon oficial para todo el banquete, txangurro a la donostiarra, huevo a baja temperatura, lubina salvaje y chuletón de 1 Kg a la brasa.',
      badge: '173 € + IVA · MÖET & CHANDON SUPREME'
    }
  ],
  culinaryHighlights: [
    'Parrilla vasca tradicional de carbón de encina dirigida por Eduardo Martínez',
    'Chuletones de 1 Kg y carnes de ganado mayor con maduración certificada',
    'Pescados salvajes del Cantábrico (rodaballo, rape, lubina, bacalao)',
    'Jardines botánicos con carpa y oficiante civil (solo 1 evento al día)',
    'Parking privado gratuito propio en el caserío con 150 plazas',
    'Comedores climatizados e insonorizados con sonido homologado Bose S-Class (Ley 37/2003)'
  ],
  acousticsPolicy:
    'Sonorización homologada Bose S-Class con refuerzo calibrado para discursos y banquete según Ley 37/2003 del Ruido (rango 80–85 dBA). Cero sanciones ni cortes intempestivos.',
  depositPolicy:
    'Bloqueo oficial de fecha con depósito Stripe garantizado de 100 € (100% deducible del presupuesto final del banquete).',
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

  // 1. Menús y gastronomía
  if (
    q.includes('menu') ||
    q.includes('menú') ||
    q.includes('precio') ||
    q.includes('cuanto') ||
    q.includes('cuánto') ||
    q.includes('100') ||
    q.includes('125') ||
    q.includes('123') ||
    q.includes('138') ||
    q.includes('142') ||
    q.includes('155') ||
    q.includes('173') ||
    q.includes('cubierto') ||
    q.includes('comida') ||
    q.includes('plato') ||
    q.includes('carta')
  ) {
    return {
      handled: true,
      reply:
        'En Restaurante Ezkertza Berria & Otzarreta en Derio disponemos de 7 menús oficiales de boda 2026 creados por Eduardo Martínez:\n' +
        '• Menú Cantábrico: 100,00 € + IVA (Marisco individual, pescado noble y entrecotte brasa)\n' +
        '• Menú Paloma: 125,00 € + IVA (Cortador jamón en vivo, rodaballo y lechazo)\n' +
        '• Menú Especial Imperial: 123,40 € + IVA (🎁 Oferta con 1h barra libre + 1h DJ)\n' +
        '• Menú Temporada: 142,50 € + IVA (Bogavante, almejas gallegas, rape y solomillo/buey)\n' +
        '• Menú Vasco: 138,00 € + IVA (🎁 Oferta pack: 2h barra libre + 2h DJ + Autobús 55 pax + chuleta 500g)\n' +
        '• Menú Ezkertza: 155,00 € + IVA (Chuletón 1 Kg brasa + 1/2 bogavante + cigala)\n' +
        '• Menú Caserío Ezkertza Beko: 173,00 € + IVA (Champagne Möet & Chandon + chuletón 1 Kg + txangurro)\n' +
        'Todos los menús incluyen cóctel de bienvenida, bodega selecta, tarta nupcial y alternativas para celíacos. Puedes bloquear tu fecha con 100 € deducibles.',
      action: {
        type: 'dossier',
        label: 'Ver los 7 Menús Oficiales en el Simulador',
        url: '/otzarreta',
      },
      shouldEscalate: false,
    };
  }

  // 2. Brasas, carnes, parrilla y producto
  if (
    q.includes('brasa') ||
    q.includes('chuleta') ||
    q.includes('chuleton') ||
    q.includes('chuletón') ||
    q.includes('asador') ||
    q.includes('parrilla') ||
    q.includes('encina') ||
    q.includes('carne') ||
    q.includes('pescado') ||
    q.includes('rodaballo') ||
    q.includes('bogavante')
  ) {
    return {
      handled: true,
      reply:
        'En Ezkertza Berria & Otzarreta (Derio), Eduardo Martínez dirige la auténtica parrilla vasca al carbón de encina al minuto: chuletones de 1 Kg de ganado mayor con maduración controlada, pescados salvajes del Cantábrico a la brasa y mariscos nobles (bogavante, cigalas, almejas gallegas). Cero catering recalentado en cubetas.',
      action: {
        type: 'whatsapp',
        label: 'Consultar detalles de parrilla con Eduardo',
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola Eduardo, deseo consultar las opciones de parrilla al carbón y carnes para mi banquete en Ezkertza Berria & Otzarreta.')}`,
      },
      shouldEscalate: false,
    };
  }

  // 3. Aforo, capacidad, jardines y espacios
  if (
    q.includes('aforo') ||
    q.includes('capacidad') ||
    q.includes('invitados') ||
    q.includes('cuantas personas') ||
    q.includes('espacio') ||
    q.includes('jardin') ||
    q.includes('jardín') ||
    q.includes('carpa') ||
    q.includes('ceremonia') ||
    q.includes('parking') ||
    q.includes('párking')
  ) {
    return {
      handled: true,
      reply:
        'El caserío en Derio cuenta con aforo oficial de hasta 350 comensales (banquetes habituales de 50 a 200 invitados). Solo se celebra 1 evento al día. Dispone de jardines botánicos con carpa para ceremonia civil con oficiante, salones climatizados e insonorizados, parque infantil, accesibilidad PMR con ascensor y parking privado gratuito de 150 plazas.',
      action: {
        type: 'dossier',
        label: 'Ver Ficha de Espacios y Aforo',
        url: '/otzarreta',
      },
      shouldEscalate: false,
    };
  }

  // 4. Ubicación en Derio, accesos, cómo llegar
  if (
    q.includes('donde') ||
    q.includes('dónde') ||
    q.includes('direccion') ||
    q.includes('dirección') ||
    q.includes('derio') ||
    q.includes('bizkaia') ||
    q.includes('llegar') ||
    q.includes('aeropuerto') ||
    q.includes('bilbao')
  ) {
    return {
      handled: true,
      reply:
        'El Caserío Restaurante Ezkertza Berria & Otzarreta se encuentra en Santo Domingo Hiribidea, 13, 48160 Derio (Bizkaia). Está a 8 minutos de Bilbao por el Corredor del Txorierri (N-637) y a 5 minutos del Aeropuerto de Bilbao (Loiu), con campa de acceso directo y parking propio de 150 plazas.',
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
        'En Ezkertza Berria & Otzarreta solo se celebra una boda al día para garantizar exclusividad total. Puedes solicitar una visita técnica guiada al caserío y bloquear tu fecha con el depósito garantizado de 100,00 € (Stripe Price-Lock), deducible al 100% del presupuesto final del banquete.',
      action: {
        type: 'date_picker',
        label: 'Consultar Fecha de Boda / Banquete',
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
        'El caserío cuenta con sonorización homologada Bose S-Class (Ley 37/2003) sin problemas acústicos. Menús como el Especial Imperial (123,40 €) incluyen 1h de DJ, y el Menú Vasco (138 €) incluye 2h de DJ profesional + 2h de barra libre + autobús. Para ceremonias líricas o directos exclusivos, colabora la producción de Edwin Agudelo.',
      action: {
        type: 'whatsapp',
        label: 'Consultar sonorización y música (+34 693 693 048)',
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola, me interesa consultar el pack de sonido y DJ para mi banquete en Ezkertza Berria & Otzarreta.')}`,
      },
      shouldEscalate: false,
    };
  }

  // 7. Respuesta genérica
  return {
    handled: true,
    reply:
      'Estás en contacto con la Conserjería de Ezkertza Berria & Otzarreta en Derio (Bizkaia). Puedo informarte con exactitud sobre nuestros 7 menús oficiales de boda (desde 100 € a 173 € + IVA), parrilla al carbón de encina de Eduardo Martínez, aforo de 350 comensales o agendar tu visita técnica al caserío.',
    action: {
      type: 'whatsapp',
      label: 'Hablar con la Conserjería (+34 693 693 048)',
      url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(`Hola, estoy en la ficha de Ezkertza Berria & Otzarreta (Derio) y deseo consultar sobre: "${rawQuery.slice(0, 100)}"`)}`,
    },
    shouldEscalate: false,
  };
}
