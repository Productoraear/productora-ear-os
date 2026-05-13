
import { Target, Terminal, PlayCircle, Zap, Mic2 } from 'lucide-react';
import { BlogArticle } from '../types';

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 101,
    title: "Arquitectura de Negocios Ágiles: El Fin del Caos Rentable",
    excerpt: "Si facturas pero tu infraestructura interna es un cuello de botella, estás muriendo de éxito. Descubre cómo aplicar 'The Cleanup' para pasar de 20 carpetas de Drive a una sola pestaña de control.",
    category: "Estrategia Masterclass",
    author: "Edwin Agudelo",
    date: "Hoy",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    icon: Target,
    featured: true
  },
  {
    id: 102,
    title: "El Test del Cero: Por qué tu marketing masivo vale nada",
    excerpt: "Si tu oferta es confusa, multiplicar el tráfico por mil sigue dando cero. Analizamos la brutalidad del eslabón débil y cómo blindar tu mensaje comercial con propuestas de alta conversión.",
    category: "Auditoría Forense",
    author: "Edwin Agudelo",
    date: "Ayer",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    icon: Terminal
  },
  {
    id: 1,
    title: "Detrás de Cámaras: La Magia del Caos Controlado",
    excerpt: "Te invitamos a ver lo que nadie ve. Un vlog honesto sobre cómo transformamos un recinto vacío en una experiencia inmersiva en menos de 24 horas.",
    category: "Vlog / Backstage",
    author: "Equipo Producción",
    date: "20 Oct 2023",
    image: "https://picsum.photos/id/452/800/600",
    icon: PlayCircle
  },
  {
    id: 2,
    title: "Tecnología que Transforma: Equipos de Última Generación",
    excerpt: "Analizamos cómo el uso de pantallas LED transparentes y sistemas de sonido inmersivo están redefiniendo las expectativas de la audiencia.",
    category: "Innovación",
    author: "Javier Tech",
    date: "15 Oct 2023",
    image: "https://picsum.photos/id/201/800/600",
    icon: Zap
  },
  {
    id: 5,
    title: "Producción de Videos Musicales: Del Concepto al Corte Final",
    excerpt: "Entramos al set de rodaje. Descubre el proceso creativo y técnico detrás del último videoclip viral producido por EAR.",
    category: "Producción",
    author: "Director Creativo",
    date: "10 Oct 2023",
    image: "https://picsum.photos/id/250/800/600",
    icon: Mic2
  }
];
