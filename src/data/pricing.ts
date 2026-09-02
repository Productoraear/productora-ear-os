import { Globe, Shield, Zap, Music, Tv, UserCheck, Layout, Target } from 'lucide-react';

export const SERVICE_TYPES = [
    { id: 'web', label: 'Estrategia de Despliegue Web', basePrice: 1500, timeBase: 30, icon: Globe },
    { id: 'branding', label: 'Identidad Visual Estratégica', basePrice: 2000, timeBase: 45, icon: Zap },
    { id: 'production', label: 'Producción Musical de Élite', basePrice: 3500, timeBase: 60, icon: Music },
    { id: 'audit', label: 'Auditoría Estratégica / Diagnóstico', basePrice: 750, timeBase: 15, icon: Shield },
];

export const DIPLOMATIC_SERVICES = [
    { id: 'sound_system', label: 'Equipamiento de Sonido State-of-Art', basePrice: 3500, icon: Music },
    { id: 'sound_tech', label: 'Técnico de Sonido Senior (Protocolo)', basePrice: 1200, icon: UserCheck },
    { id: 'lighting', label: 'Iluminación Atmosférica / Robótica', basePrice: 2000, icon: Zap },
    { id: 'led_screen', label: 'Pantalla LED Fine Pitch 4K', basePrice: 4500, icon: Tv },
    { id: 'protocol_mc', label: 'Maestro de Ceremonia (Protocolo Internacional)', basePrice: 1800, icon: Shield },
    { id: 'security', label: 'Cierre de Seguridad y Confidencialidad', basePrice: 1500, icon: Shield },
];

export const INSTITUTIONAL_SERVICES = [
    { id: 'sound_city', label: 'Sistema de Sonido Masivo / Calle', basePrice: 3000, icon: Music },
    { id: 'stage_modular', label: 'Escenario Modular Homologado', basePrice: 2500, icon: Layout },
    { id: 'social_impact', label: 'Medición de Impacto Social (KPIs)', basePrice: 1200, icon: Target },
    { id: 'logistics_city', label: 'Logística y Coordinación Municipal', basePrice: 1800, icon: UserCheck },
    { id: 'engagement', label: 'Estrategia de Participación Ciudadana', basePrice: 1400, icon: Globe },
];

export const WEDDING_SERVICES = [
    { id: 'wedding_prod', label: 'Producción Integral 360', basePrice: 5000, icon: Layout },
    { id: 'ceremony_sound', label: 'Sonorización Ceremonia de Élite', basePrice: 800, icon: Music },
    { id: 'curation', label: 'Curaduría Artística Personalizada', basePrice: 1500, icon: Zap },
    { id: 'gala_av', label: 'Diseño Audiovisual Gala', basePrice: 2800, icon: Tv },
    { id: 'mc_wedding', label: 'Maestro de Ceremonia / Regidor', basePrice: 1200, icon: Shield },
];

export const VIMUME_SERVICES = [
    { id: 'musicotherapy', label: 'Sesión de Musicoterapia Personalizada', basePrice: 450, icon: Music },
    { id: 'reminiscence', label: 'Taller de Reminiscencia Musical', basePrice: 600, icon: Target },
    { id: 'protocol_3m', label: 'Protocolo VIMUME (3m-4m-30m)', basePrice: 1200, icon: Shield },
    { id: 'caregiver_training', label: 'Formación para Cuidadores (Metodología)', basePrice: 850, icon: UserCheck },
    { id: 'impact_report', label: 'Reporte de Impacto en Salud y Bienestar', basePrice: 500, icon: Target },
];

export const AVAILABLE_GENRES = [
    "Urbano", "Pop", "Rock", "Electrónica", "Metal", "Jazz", "Clásica", "Flamenco", "Tropic", "Soul"
];

export const ARTIST_FEES = {
    basic: { label: 'Artista Emergente', base: 500, dev: 'Nivel 1' },
    medium: { label: 'Artista Consolidado', base: 1500, dev: 'Nivel 2' },
    premium: { label: 'Artista de Élite', base: 5000, dev: 'Nivel 3' },
};
