import { Radio, Layers2, Building2, Briefcase, Landmark, Megaphone, Settings, Users } from 'lucide-react';
export const ALL_SERVICES = [
    {
        id: 'streaming',
        domain: 'events',
        icon: Radio,
        title: "Streaming & Transmisión Pro",
        slug: "servicios-audiovisuales/streaming-retrasmision-eventos-madrid",
        desc: "Eventos híbridos, online y corporativos con calidad broadcast 4K y latencia mínima.",
        category: "Conectividad"
    },
    {
        id: 'mapping',
        domain: 'events',
        icon: Layers2,
        title: "Video Mapping & Inmersión",
        slug: "servicios-audiovisuales/video-mapping",
        desc: "Transformación de fachadas y espacios interiores mediante ingeniería de luz monumentales.",
        category: "Contenido"
    },
    {
        id: 'ifema',
        domain: 'events',
        icon: Building2,
        title: "División Ferias & IFEMA",
        slug: "proveedor-de-equipos-audiovisuales/alquiler-audiovisuales-ifema",
        desc: "Socio técnico especializado en el montaje de stands de alto impacto y gestión en recintos feriales.",
        category: "Sectores"
    },
    {
        id: 'corporate',
        domain: 'events',
        icon: Briefcase,
        title: "Eventos Corporativos 360",
        slug: "servicios-audiovisuales/evento-corporativo",
        desc: "Desde reuniones de empresa hasta presentaciones de producto. Logística y técnica blindada.",
        category: "Ejecución"
    },
    {
        id: 'efimera',
        domain: 'events',
        icon: Landmark,
        title: "Arquitectura Efímera",
        slug: "servicios-audiovisuales/arquitectura-efimera",
        desc: "Diseño de espacios y estructuras que existen solo para un momento perfecto.",
        category: "Diseño"
    },
    {
        id: 'branding',
        domain: 'events',
        icon: Megaphone,
        title: "Branding de Eventos",
        slug: "servicios-audiovisuales/branding-corporativo-para-empresas-y-eventos",
        desc: "Identidad visual aplicada al espacio físico.",
        category: "Marketing"
    },
    {
        id: 'install',
        domain: 'rentals',
        icon: Settings,
        title: "Instalaciones Fijas",
        slug: "servicios-audiovisuales/instalacion-equipos-audiovisuales",
        desc: "Integración tecnológica permanente para auditorios.",
        category: "Ingeniería"
    },
    {
        id: 'staff',
        domain: 'events',
        icon: Users,
        title: "Personal Técnico",
        slug: "empresa-de-alquiler-de-material-audiovisual/personal-produccion-audiovisual",
        desc: "Operadores certificados para misiones críticas.",
        category: "Recursos"
    }
];
