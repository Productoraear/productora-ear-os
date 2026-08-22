import { Monitor, Video, Layers, Briefcase } from 'lucide-react';
export const AVAILABLE_GENRES = ["Mariachi", "Boleros", "Baladas", "Pop", "Rock", "Jazz", "Flamenco", "Clásica"];
export const SERVICE_TYPES = [
    { id: 'web', label: 'Diseño Web Completo', basePrice: 2599, timeBase: 90, icon: Monitor, desc: 'Funcionalidades especiales, SEO, UX Premium' },
    { id: 'video', label: 'Producción Video Cine', basePrice: 1800, timeBase: 30, icon: Video, desc: 'Grabación 4K, Edición, Color Grading' },
    { id: 'event', label: 'Gestión Evento Corp.', basePrice: 3500, timeBase: 60, icon: Layers, desc: 'Planificación integral, coordinación in-situ' },
    { id: 'consulting', label: 'Consultoría Estratégica', basePrice: 1200, timeBase: 15, icon: Briefcase, desc: 'Análisis de negocio y hoja de ruta' }
];
export const ARTIST_FEES = {
    basic: { base: 350, label: 'Básico' },
    medium: { base: 850, label: 'Medio' },
    premium: { base: 2500, label: 'Premium' }
};
