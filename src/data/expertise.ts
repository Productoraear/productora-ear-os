
import { Video, Film, Users, Box, Crown, Music, Mic2 } from 'lucide-react';
import { ExpertiseService } from '../types';

export const EXPERTISE_SERVICES: ExpertiseService[] = [
  {
    title: "Edwin Axis - Master Artist",
    subtitle: "Mariachi / Banda / Corridos",
    description: "La vanguardia absoluta del folklore mexicano. Edwin Axis ofrece una experiencia artística S-Class que redefine el género para el mercado global.",
    items: ["Ritual Mariachi S-Class", "Banda Monumental Axis", "Corridos Platinum Experience", "Producción de Autor"],
    icon: Crown,
    color: "text-[#d4a855]"
  },
  {
    title: "Narrativa Corporativa",
    subtitle: "Comunicación de Alto Impacto",
    description: "No hacemos videos corporativos, construimos activos de autoridad. Aplicamos narrativa cinematográfica a tu marca.",
    items: ["Videos Institucionales", "Promocionales", "Presentación de Producto", "Comunicación Interna"],
    icon: Video,
    color: "text-blue-400"
  },
  {
    title: "Cinematografía Musical",
    subtitle: "Videoclips & Visualizers",
    description: "Tu música es el guion; nosotros ponemos la fotografía. Transformamos canciones en obras maestras visuales.",
    items: ["Videoclips Cinematográficos", "Live Sessions", "Visualizers", "Documentales de Gira"],
    icon: Film,
    color: "text-purple-400"
  },
  {
    title: "Consultoría Estratégica",
    subtitle: "Arquitectura de Carreras",
    description: "Te acompañamos en la toma de decisiones críticas. Evita errores costosos con nuestra experiencia de campo.",
    items: ["Asesoramiento Artístico", "Logística de Eventos", "Diseño de Producción", "Estrategia de Lanzamiento"],
    icon: Users,
    color: "text-ear-gold"
  },
  {
    title: "Infraestructura Técnica",
    subtitle: "Rental & Equipamiento",
    description: "Acceso directo a nuestro arsenal. Alquiler de equipos audiovisuales de gama alta.",
    items: ["Sonido (JBL/Shure)", "Iluminación Robótica", "Cámaras Cinema Line", "Pantallas LED"],
    icon: Box,
    color: "text-green-400"
  }
];
