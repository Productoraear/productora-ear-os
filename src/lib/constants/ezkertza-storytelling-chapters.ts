/**
 * Datos canónicos del Storytelling Visual de Ezkertza Berria.
 * Extraído a módulo estático puro para consumo tanto en Server Components (RSC)
 * como en Client Components ('use client') sin violar el boundary de Turbopack.
 */

export interface StorytellingChapter {
  id: string;
  stepNumber: string;
  roomName: string;
  subtitle: string;
  category: string;
  capacityPax: number;
  acousticDecibels: string;
  highlight: string;
  description: string;
  imageUrl: string;
  ctaText: string;
}

export const EZKERTZA_STORYTELLING_CHAPTERS: readonly StorytellingChapter[] = Object.freeze([
  {
    id: 'llegada-fachada',
    stepNumber: '01 / LLEGADA & ARQUITECTURA',
    roomName: 'CASERÍO\nEZKERTZA',
    subtitle: 'SANTO DOMINGO HIRIBIDEA, 13 · DERIO (BIZKAIA)',
    category: 'Acceso Señorial & Campa Tradicional',
    capacityPax: 200,
    acousticDecibels: '60 - 68 dBA',
    highlight: 'Caserío vasco noble con acceso amplio para cortejo nupcial y parking privado 150 plazas.',
    description:
      'La primera impresión: el caserío rodeado de praderas y vegetación en Derio. Un ambiente de paz donde recibir a los invitados con cóctel al aire libre sin ruidos metropolitanos.',
    imageUrl: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/05/IMG_0034.jpg',
    ctaText: 'Solicitar Visita Técnica',
  },
  {
    id: 'ceremonia-jardines',
    stepNumber: '02 / EL ENLACE CIVIL',
    roomName: 'JARDINES &\nPÉRGOLA',
    subtitle: 'AL AIRE LIBRE, BAJO EL CIELO DE BIZKAIA.',
    category: 'Ceremonia & Carpa Nupcial Exclusiva',
    capacityPax: 200,
    acousticDecibels: '< 75 dBA (Ley 37/2003)',
    highlight: 'Extensos jardines cuidados con pérgola floral y carpa oficial para enlaces civiles.',
    description:
      'El lugar donde pronunciar el "sí quiero". Sonorización perimetral Bose calibrada a 12 W/pax para que los discursos y votos de la pareja se escuchen con absoluta calidez.',
    imageUrl: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/06/24-Bodas-civiles.jpg',
    ctaText: 'Ver Acústica de Ceremonia',
  },
  {
    id: 'camino-novios',
    stepNumber: '03 / REPORTAJE BOTÁNICO',
    roomName: 'CAMINOS &\nARBOLEDA',
    subtitle: 'RECUERDOS INOLVIDABLES EN CADA RINCÓN.',
    category: 'Paisajismo & Sesión Fotográfica',
    capacityPax: 200,
    acousticDecibels: 'Ambiente Natural',
    highlight: 'Rincones botánicos íntimos sin necesidad de desplazarse fuera de la finca para las fotos.',
    description:
      'Senderos empedrados y rincones verdes perfectos para el reportaje fotográfico de los novios mientras los invitados disfrutan del cóctel de bienvenida con cortador de jamón y brindis.',
    imageUrl: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/06/novios-1022x1536.jpg',
    ctaText: 'Descubrir Paisajismo',
  },
  {
    id: 'gran-comedor',
    stepNumber: '04 / BANQUETE NOBLE',
    roomName: 'GRAN COMEDOR\nDE GALA',
    subtitle: 'MUROS DE PIEDRA Y CLIMATIZACIÓN SILENCIOSA.',
    category: 'Salón Insonorizado & Presidencia',
    capacityPax: 200,
    acousticDecibels: '75 - 82 dBA Calibrado',
    highlight: 'Comedor diáfano climatizado, insonorizado y libre de columnas para ver a todos los invitados.',
    description:
      'Espacio tratado fonoabsorbentemente con mantelería de gala. El escenario ideal para el directo solista de Edwin Agudelo (350,00 €) y las entregas de regalos familiares.',
    imageUrl: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/09/comedor.jpg',
    ctaText: 'Bloquear Fecha con Edwin Agudelo',
  },
  {
    id: 'parrilla-autor',
    stepNumber: '05 / GASTRONOMÍA & BRASA',
    roomName: 'BRASA VIVA &\nAUTORÍA',
    subtitle: 'FOGÓN DE LEÑA DE ENCINA · EDUARDO MARTÍNEZ.',
    category: 'Parrilla Tradicional & Cocina de Temporada',
    capacityPax: 200,
    acousticDecibels: 'Ambiente Cálido',
    highlight: 'Pescados frescos salvajes a la brasa, carnes maduradas y cocina de cazuela vasca.',
    description:
      'La firma gastronómica de Eduardo Martínez: brasa viva elaborada al momento. Un menú nupcial sin concesiones donde la excelencia del producto autóctono es la protagonista.',
    imageUrl: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/05/MG_0033.jpg',
    ctaText: 'Solicitar Propuesta Gastronómica',
  },
  {
    id: 'terraza-baile',
    stepNumber: '06 / FIN DE FIESTA',
    roomName: 'TERRAZA &\nBARRA LIBRE',
    subtitle: 'DONDE LA CELEBRACIÓN SE CONVIERTE EN MEMORIA.',
    category: 'Baile Nocturno & Coctelería Premium',
    capacityPax: 200,
    acousticDecibels: '< 75 dBA Telemetría Homologada',
    highlight: 'Pista exterior con microleds e iluminación dimerizada para bailar hasta el amanecer.',
    description:
      'El cierre de fiesta bajo el cielo abierto. Cobertura acústica con limitador telemático para disfrutar sin interrupciones ni multas a las 2:00 AM.',
    imageUrl: 'https://www.ezkertzaberria.com/wp-content/uploads/2023/03/2023BODAS-WEB-1-scaled.jpg',
    ctaText: 'Bloquear Fecha VIP (100 € Deducibles)',
  },
]);

