import { Camera, Star, Music, Users, Crown, Sparkles } from 'lucide-react';

export const WEDDING_PACKAGES = [
  {
    title: "Show Solista Premium",
    subtitle: "Edwin Agudelo & Sonido Bose 2000W",
    price: 350,
    desc: "Tenor lírico con 2 salidas de 30 minutos, sonido Bose profesional hasta 300 personas, photocall con sombreros y sesión de fotos de alta resolución.",
    features: [
      "2 Salidas de 30 min dedicadas a los novios e invitados",
      "Sonido Bose 2.000W con técnico in situ",
      "Decoración temática photocall con sombreros",
      "Sesión de fotos con el artista en alta calidad",
      "Compromiso de satisfacción por escrito"
    ],
    icon: Music,
    isPopular: true
  },
  {
    title: "Ensamble Mariachi Gala (6+ Músicos)",
    subtitle: "El Estándar de Oro Charro",
    price: 750,
    desc: "Actuación completa de 1 hora con violines, trompetas y guitarrón. Repertorio romántico y bailable 100% personalizado.",
    features: [
      "Show completo de 1 hora continua",
      "Botonadura de gala y trajes de autor",
      "Entrega de ramo ceremonial y regalo sorpresa",
      "Sesión fotográfica con el ensamble al completo"
    ],
    icon: Users
  },
  {
    title: "Grupo Imperial (9+ Músicos)",
    subtitle: "Potencia Sinfónica & Espectáculo",
    price: 1250,
    desc: "Formato profesional expandido para cócteles y grandes banquetes con sonorización de alta presión acústica.",
    features: [
      "Orquestación sinfónica tradicional",
      "Sonido Line Array Bose / Electro-Voice calibrado a 12 W/pax",
      "Filtrado ético y repertorio a la carta",
      "Dirección técnica y protocolo en vivo"
    ],
    icon: Sparkles
  },
  {
    title: "Gran Gala Monumental (13+ Músicos)",
    subtitle: "Máxima Exclusividad y Despliegue",
    price: 1800,
    desc: "1 hora en 2 salidas de 30 minutos con máxima flexibilidad de protocolo, complementos rústicos, sorteos y exclusividad absoluta de fecha.",
    features: [
      "2 Salidas de 30 min adaptadas al protocolo nupcial",
      "Complementos rústicos (balas de paja, ruedas de carruajes)",
      "Sorteos de regalos personalizados para invitados",
      "Exclusividad absoluta en la fecha por contrato"
    ],
    icon: Crown
  },
  {
    title: "La Escena Íntima",
    subtitle: "Exclusividad por Sustracción",
    price: 2500,
    desc: "Vuestra pareja es única. No hacemos copy-paste de presupuestos; diseñamos desde vuestra percepción.",
    features: ["Cinematografía Documental 4K", "Maestro de Ceremonia EAR", "Protocolo Plan B Garantizado", "Asesoramiento Gastronómico"],
    icon: Camera
  },
  {
    title: "La Gala de Autor",
    subtitle: "Producción Cinematográfica",
    price: 5500,
    desc: "Un despliegue donde cada detalle responde a vuestra historia emocional.",
    features: ["Todo en La Escena Íntima", "Catering de Alta Cocina Partner", "Iluminación Escultórica", "Showrunner Dedicado"],
    icon: Star
  }
];

