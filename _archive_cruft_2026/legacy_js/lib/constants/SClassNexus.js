/**
 * 🌌 EAR OS GOLD - S-CLASS NEXUS
 * Centralización de Identidad, Estructura y Protocolos Operativos.
 */
import { Music, Calendar, Camera, Briefcase, Layers } from 'lucide-react';
export const S_CLASS_THEME = {
    colors: {
        onyx: '#050505',
        gold: '#d4a855',
        silver: '#a8a8a8',
        success: '#00ff7f',
        warning: '#ffcc00',
        error: '#ff4d4d',
        purple: '#7c3aed',
    },
    glass: {
        base: 'bg-white/5 border border-white/10 backdrop-blur-xl',
        gold: 'bg-[#d4a855]/5 border border-[#d4a855]/30 backdrop-blur-xl',
        purple: 'bg-[#7c3aed]/5 border border-[#7c3aed]/30 backdrop-blur-xl',
    },
    animations: {
        hoverScale: { scale: 1.02 },
        tapScale: { scale: 0.98 },
        spring: { type: 'spring', stiffness: 300, damping: 20 },
    }
};
export const SYSTEM_ZONES = {
    ACTIVE: ['Madrid', 'Barcelona', 'Valencia', 'Ibiza', 'Marbella', 'Mallorca'],
    HOLD: ['Albacete', 'Cuenca', 'Teruel', 'Soria'],
};
export const OPERATIONAL_PROTOCOLS = {
    tabs: ['CRM', 'FLOTA', 'DISPATCH', 'VIMUME', 'MARKET'],
    batchSize: 100,
    minAlphaScore: 85,
    maxAlphaScore: 99,
    geoVerification: SYSTEM_ZONES.ACTIVE,
};
export const OMNIBUS_CONFIG = {
    COLUMNS: [
        { key: 'client', label: 'CLIENTE', width: '20%' },
        { key: 'status', label: 'ESTADO', width: '15%' },
        { key: 'location', label: 'ZONA', width: '15%' },
        { key: 'value', label: 'VALOR', width: '10%' },
        { key: 'telemetry', label: 'LATENCIA', width: '15%' },
    ],
    FILTERS: ['TODOS', 'ACTIVOS', 'PAUSA', 'BLOQUEADOS'],
};
export const ASTRA_IDENTITIES = {
    oracle: 'La Voz Única (Astra + GeoValidation)',
    mimetismo: {
        original: [/bodas\.net/gi, /zankyou/gi, /competidor/gi],
        target: 'EAR Network',
    }
};
export const BUSINESS_DOMAINS = {
    artists: {
        id: 'artists',
        title: 'MANAGEMENT ARTÍSTICO',
        subtitle: 'Arquitectura de Legado',
        description: 'Transformamos el talento en marcas imperecederas. Estrategia 360 para artistas de élite.',
        cta: 'Entrar al Ecosistema',
        icon: Music,
        color: 'from-purple-900/90 via-purple-900/40 to-black/80'
    },
    events: {
        id: 'events',
        title: 'PRODUCCIÓN DE EVENTOS',
        subtitle: 'Ingeniería de Experiencias',
        description: 'Diseñamos y ejecutamos eventos de alto impacto donde la tecnología y la emoción convergen.',
        cta: 'Ver Capacidades',
        icon: Calendar,
        color: 'from-[#d4a855]/90 via-[#d4a855]/40 to-black/80'
    },
    rentals: {
        id: 'rentals',
        title: 'ALQUILER DE EQUIPOS',
        subtitle: 'Arsenal Tecnológico',
        description: 'Acceso directo a equipamiento audiovisual de gama alta. Tu visión, nuestra infraestructura.',
        cta: 'Consultar Catálogo',
        icon: Camera,
        color: 'from-gray-800/90 via-gray-800/40 to-black/80'
    },
    consultancy: {
        id: 'consultancy',
        title: 'CONSULTORÍA',
        subtitle: 'Dirección Estratégica',
        description: 'Asesoramiento técnico y logístico para proyectos complejos.',
        cta: 'Contactar Oráculo',
        icon: Briefcase,
        color: 'from-blue-900/90 via-blue-900/40 to-black/80'
    }
};
export const MASTER_SERVICES = [
    {
        id: 'streaming',
        icon: Music,
        category: 'Conectividad',
        title: 'Streaming & Transmisión Pro',
        desc: 'Eventos híbridos, online y corporativos con calidad broadcast 4K y latencia mínima.',
        slug: 'servicios-audiovisuales/streaming-retrasmision-eventos-madrid'
    },
    {
        id: 'mapping',
        icon: Layers,
        category: 'Contenido',
        title: 'Video Mapping & Inmersión',
        desc: 'Transformación de fachadas y espacios interiores mediante ingeniería de luz monumentales.',
        slug: 'servicios-audiovisuales/video-mapping'
    },
    {
        id: 'corporate',
        icon: Briefcase,
        category: 'Ejecución',
        title: 'Eventos Corporativos 360',
        desc: 'Desde reuniones de empresa hasta presentaciones de producto. Logística y técnica blindada.',
        slug: 'servicios-audiovisuales/evento-corporativo'
    }
];
