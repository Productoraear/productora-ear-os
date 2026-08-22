import { Camera, Star } from 'lucide-react';
export const WEDDING_PACKAGES = [
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
        icon: Star,
        isPopular: true
    }
];
