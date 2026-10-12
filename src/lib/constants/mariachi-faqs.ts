export interface FaqItem {
  question: string;
  answer: string;
}

export const MARIACHI_FAQS: FaqItem[] = [
  {
    question: "¿Cuánto cuesta contratar un mariachi en España con EAR OS?",
    answer: "Nuestros precios son cerrados y públicos: Solista Serenata Express desde 350 €, Cuarteto Tradicional Ranchero por 600 €, Ensamble de Gala Imperial (mínimo 6 integrantes con Edwin Agudelo) por 900 €, y Ensamble Monumental S-Class (8 músicos) por 1.300 €. A la tarifa base se añade únicamente el kilometraje real (1,50 €/km a partir del km 50 desde la sede más cercana). No existen comisiones ocultas ni sorpresas de última hora."
  },
  {
    question: "¿Cómo funciona el depósito de 100 € de Stripe y por qué es 100% deducible?",
    answer: "El depósito de 100 € a través de la pasarela segura de Stripe bloquea de manera atómica e irreversible la fecha y franja horaria en la agenda del mariachi (motor atomicDateLockEngine). Este importe se resta íntegro (100% deducible) de la factura final del evento, actuando como garantía mutua de seriedad que protege tu fecha y reserva la exclusividad de los músicos."
  },
  {
    question: "¿Con cuánta antelación debo reservar mi mariachi?",
    answer: "Para bodas en fincas y sábados de temporada alta (mayo a octubre) recomendamos reservar con al menos 2 a 4 meses de antelación. Sin embargo, gracias a nuestra red de despacho en tiempo real, atendemos solicitudes de serenatas de urgencia y cumpleaños en menos de 24 horas a través de nuestra centralita 24/7 en WhatsApp (+34 693 693 048)."
  },
  {
    question: "¿Cómo se calcula el kilometraje si mi evento es en una finca o pueblo?",
    answer: "Aplicamos la regla SSOT de EAR OS: los primeros 50 km desde la sede o hub provincial más cercano están incluidos. A partir del kilómetro 50, se factura a 1,50 €/km ida y vuelta. Si la actuación finaliza después de las 03:00 AM o la distancia supera los 200 km, se añade un suplemento de alojamiento de 120 € para garantizar el descanso y la seguridad de los músicos en carretera."
  },
  {
    question: "¿Cumple el mariachi con las normativas de ruido de fincas (Ley 37/2003)?",
    answer: "Trabajamos con un protocolo realista, no con promesas imposibles. Un mariachi con trompetas es un instrumento acústicamente potente, por eso: 1) antes del evento pedimos a la finca su límite (dBA) y si tiene limitador instalado; 2) te enviamos una ficha técnica (rider) con la formación recomendada para ese límite; 3) en fincas muy restrictivas proponemos formato de cuerdas (violines, vihuela, guitarrón) o trompetas con sordina; 4) medimos con sonómetro durante la prueba de sonido y ajustamos. Referencias orientativas: bodas en exterior 85-90 dBA, interiores 80-85 dBA, cóctel acústico 70-80 dBA. Si la finca exige un informe acústico oficial, lo gestionamos con una entidad acreditada como servicio aparte."
  },
  {
    question: "¿Puedo personalizar el repertorio y elegir las canciones?",
    answer: "Sí. Dispones de nuestro selector de repertorio interactivo con más de 35 temas clásicos mexicanos (rancheras, boleros románticos, huapangos y Las Mañanitas). Puedes marcar tus canciones favoritas con antelación. Además, ofrecemos como producto especial la composición y grabación en estudio de una canción ranchera con letra personalizada para el homenajeado por 180 €."
  },
  {
    question: "¿Cómo puedo contratar a Edwin Agudelo como solista o con su Ensamble Imperial?",
    answer: "Edwin Agudelo está disponible como solista tenor de gran gala (350 €) o como director del Ensamble de Gala Imperial (900 €, mínimo 6 integrantes de conservatorio). Puedes seleccionarlo directamente en el cotizador o solicitar su disponibilidad inmediata a través de la línea directa de WhatsApp de Productora EAR."
  },
  {
    question: "¿Qué ocurre en caso de lluvia o cambio de ubicación del evento?",
    answer: "Nuestras formaciones cuentan con equipos de sonido portátiles a batería y microfonía inalámbrica que permiten reubicar la actuación en interiores o porches cubiertos en menos de 3 minutos sin interrumpir el espectáculo. Las fechas quedan blindadas y coordinamos con los organizadores cualquier ajuste de programa."
  }
];
