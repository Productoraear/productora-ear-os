/**
 * PROVIDER CONTEXT RAG ENGINE (EAR OS v12.1 S-CLASS)
 * Contexto soberano y resolución RAG multi-tenant determinista por proveedor.
 * 
 * Regla Inviolable: Si el usuario navega en /otzarreta o el contexto pertenece
 * a Otzarreta (Eduardo Martínez), el asistente actúa de forma soberana como
 * Maître Digital de Sala de Otzarreta (Derio), sin invocar a Edwin Agudelo
 * salvo consulta explícita sobre música en directo.
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
  }[];
  culinaryHighlights: string[];
  acousticsPolicy: string;
  depositPolicy: string;
  reviewsCount: number;
}

export const OTZARRETA_KNOWLEDGE_BASE: ProviderKnowledgeBase = {
  slug: 'otzarreta',
  name: 'Finca & Asador Ezkertza Berria / Otzarreta',
  propertyControl: 'Eduardo Martínez (51% Propiedad)',
  location: 'Derio (Bizkaia), Valle del Txorierri / Gran Bilbao',
  territory: 'Exclusividad Comarcal Finca Fundadora Txorierri',
  role: 'Maître Digital y Jefe de Sala de Otzarreta',
  greeting: 'Bienvenido al Asador Jatetxea Otzarreta en Derio. Soy el asistente de sala de Eduardo Martínez. ¿Deseas consultar nuestros menús de temporada 2026, disponibilidad o aforos?',
  phone: CENTRALITA_EAR_OS,
  capacity: {
    min: 50,
    diningRoom: 200,
    estateMax: 350,
  },
  menus: [
    {
      name: 'Menú Tradición Txorierri',
      price: 145,
      description: 'Entrantes del caserío, pescado de loncha salvaje a la brasa, sorbete artesano y solomillo con guarnición de temporada.',
    },
    {
      name: 'Menú Asador al Sarmiento',
      price: 155,
      description: 'Mariscos de costa, chuleta de ganado mayor madurada al sarmiento en brasa vista y bodega seleccionada.',
    },
    {
      name: 'Menú Gran Selección Ezkertza',
      price: 165,
      description: 'Bogavante, rodaballo a la parrilla, chuleta premium madurada y postres de autor con bodega D.O. Bizkaiko Txakolina.',
    },
    {
      name: 'Menú Soberano de Gala 2026',
      price: 185,
      description: 'Cóctel en jardines con cortador de jamón ibérico, mariscada completa, asado tradicional y barra libre premium.',
    },
  ],
  culinaryHighlights: [
    'Brasas de carbón de encina y sarmiento a la vista del comensal',
    'Chuletas de ganado mayor con maduración controlada',
    'Pescados salvajes de la costa vasca al estilo tradicional de asador',
    'Jardines y carpa exterior climatizada para ceremonia civil y cóctel de bienvenida',
    'Párking privado vigilado para más de 120 vehículos y accesibilidad universal',
  ],
  acousticsPolicy:
    'Monitorización sonométrica preventiva según Ley 37/2003 del Ruido. Ajuste de volumen en sala acristalada para garantizar confort acústico sin sanciones ni molestias a los comensales.',
  depositPolicy:
    'Fianza y bloqueo de fecha calibrable mediante pasarela Stripe segura: opción de Price-Lock de 100 € preventivo para bloquear 7 días o fianza formal pactada directamente con la dirección.',
  reviewsCount: 45,
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
 * Resuelve consultas cuando el usuario está en el contexto soberano de Otzarreta.
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
    q.includes('145') ||
    q.includes('155') ||
    q.includes('165') ||
    q.includes('185') ||
    q.includes('cubierto') ||
    q.includes('comida') ||
    q.includes('plato')
  ) {
    return {
      handled: true,
      reply:
        'En Finca Otzarreta disponemos de 4 propuestas de menús de temporada 2026 diseñadas por Eduardo Martínez:\n' +
        '• Menú Tradición Txorierri: 145,00 €/pax\n' +
        '• Menú Asador al Sarmiento: 155,00 €/pax\n' +
        '• Menú Gran Selección Ezkertza: 165,00 €/pax\n' +
        '• Menú Soberano de Gala: 185,00 €/pax\n' +
        'Todos los menús incluyen bodega completa, cortador o aperitivos en jardín y opciones adaptadas para celíacos e intolerancias.',
      action: {
        type: 'dossier',
        label: 'Ver Dossier y Carta Completa de Menús',
        url: '/otzarreta',
      },
      shouldEscalate: false,
    };
  }

  // 2. Brasas, carnes, asador y cocina
  if (
    q.includes('brasa') ||
    q.includes('chuleta') ||
    q.includes('asador') ||
    q.includes('parrilla') ||
    q.includes('sarmiento') ||
    q.includes('carne') ||
    q.includes('pescado')
  ) {
    return {
      handled: true,
      reply:
        'Nuestra especialidad en Ezkertza Berria son las brasas tradicionales al sarmiento y carbón de encina. Servimos chuleta de ganado mayor con maduración certificada y pescados salvajes de lonja directamente a la parrilla ante los invitados.',
      action: {
        type: 'whatsapp',
        label: 'Consultar detalles de asador con Eduardo',
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola Eduardo, deseo información sobre las brasas y menús de Otzarreta.')}`,
      },
      shouldEscalate: false,
    };
  }

  // 3. Aforo, capacidad, comedores y espacios
  if (
    q.includes('aforo') ||
    q.includes('capacidad') ||
    q.includes('invitados') ||
    q.includes('cuantas personas') ||
    q.includes('espacio') ||
    q.includes('jardin') ||
    q.includes('jardín') ||
    q.includes('carpa') ||
    q.includes('parking') ||
    q.includes('párking')
  ) {
    return {
      handled: true,
      reply:
        'Finca Otzarreta cuenta con una capacidad versátil: comedor acristalado interior para banquetes de 50 a 200 comensales cómodamente sentados, y capacidad ampliada de hasta 350 personas con el porche y carpa de jardines. Párking propio para más de 120 vehículos.',
      action: {
        type: 'dossier',
        label: 'Ver distribución en Seating Planner',
        url: '/seating-planner',
      },
      shouldEscalate: false,
    };
  }

  // 4. Ubicación, Derio, cómo llegar
  if (
    q.includes('donde') ||
    q.includes('dónde') ||
    q.includes('direccion') ||
    q.includes('dirección') ||
    q.includes('derio') ||
    q.includes('bizkaia') ||
    q.includes('llegar')
  ) {
    return {
      handled: true,
      reply:
        'El Asador Jatetxea Otzarreta (Ezkertza Berria) está ubicado en Derio (Bizkaia), en pleno valle del Txorierri, a tan solo 10 minutos del centro de Bilbao y 5 minutos del Aeropuerto de Loiu, con acceso directo por autovía y entorno natural privilegiado.',
      action: {
        type: 'whatsapp',
        label: 'Solicitar ubicación GPS por WhatsApp',
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola, ¿podríais enviarme la ubicación exacta de Finca Otzarreta en Derio?')}`,
      },
      shouldEscalate: false,
    };
  }

  // 5. Reserva de fecha, disponibilidad, visita presencial
  if (
    q.includes('reserva') ||
    q.includes('fecha') ||
    q.includes('disponib') ||
    q.includes('visita') ||
    q.includes('cita') ||
    q.includes('ver') ||
    q.includes('probar') ||
    q.includes('deposito') ||
    q.includes('fianza')
  ) {
    return {
      handled: true,
      reply:
        'Las fechas de temporada 2026 en Otzarreta tienen alta demanda comarcal. Puedes preseleccionar tu fecha para comprobar el turno de comida o cena, o agendar una visita guiada con degustación presencial con Eduardo Martínez.',
      action: {
        type: 'date_picker',
        label: 'Consultar Fecha de Boda / Evento',
      },
      shouldEscalate: true,
    };
  }

  // 6. Consultas de música o solista explícitas dentro de Otzarreta
  if (
    q.includes('musica') ||
    q.includes('música') ||
    q.includes('dj') ||
    q.includes('edwin') ||
    q.includes('solista') ||
    q.includes('guitarra')
  ) {
    return {
      handled: true,
      reply:
        'En Otzarreta disponemos de acústica cuidada y colaboramos con los mejores profesionales. Para música en directo homologada, contamos con la producción de Edwin Agudelo (Solista Exclusivo desde 350 € / 550 € con sonido completo) y DJ homologados sin restricciones arbitrarias de exclusividad.',
      action: {
        type: 'whatsapp',
        label: 'Coordinar música y sonido (+34 693 693 048)',
        url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent('Hola, me interesa consultar opciones de música y DJ para mi banquete en Otzarreta.')}`,
      },
      shouldEscalate: false,
    };
  }

  // 7. Respuesta genérica de Otzarreta
  return {
    handled: true,
    reply:
      'Estás en contacto con la sala del Asador Finca Otzarreta en Derio (Ezkertza Berria). Puedo informarte con exactitud sobre nuestros menús desde 145 €, aforos (hasta 350 pax), brasas al sarmiento o concertar una visita presencial con Eduardo Martínez.',
    action: {
      type: 'whatsapp',
      label: 'Hablar con Eduardo Martínez (+34 693 693 048)',
      url: `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(`Hola Eduardo, estoy visitando la web de Otzarreta y tengo una consulta sobre: "${rawQuery.slice(0, 100)}"`)}`,
    },
    shouldEscalate: false,
  };
}
