export const DEMO_SLUGS = [
    "shadergradient-gold",
    "shadergradient-ruby",
    "stars",
    "sparkles",
    "float",
    "wobble",
    "distort",
    "trail",
    "text",
    "grid",
    "points",
    "contact-shadows",
] as const;

export type DemoSlug = (typeof DEMO_SLUGS)[number];

export interface DemoMeta {
    title: string;
    description: string;
    packages: string[];
}

export const DEMO_META: Record<DemoSlug, DemoMeta> = {
    "shadergradient-gold": {
        title: "Plasma Oro S-Class",
        description: "ShaderGradient type plane con gradiente oro/ámbar animado.",
        packages: ["shadergradient"],
    },
    "shadergradient-ruby": {
        title: "Esfera Rubí Líquida",
        description: "ShaderGradient type sphere con acento rubí y cian frío.",
        packages: ["shadergradient"],
    },
    stars: {
        title: "Campo Estelar Profundo",
        description: "drei <Stars /> procedural sobre fondo OLED.",
        packages: ["three", "@react-three/fiber", "@react-three/drei"],
    },
    sparkles: {
        title: "Sparkles Cuánticos",
        description: "drei <Sparkles /> con blending aditivo dorado.",
        packages: ["three", "@react-three/fiber", "@react-three/drei"],
    },
    float: {
        title: "Caja Flotante Cristal",
        description: "drei <Float /> + <RoundedBox /> con micro-animación sedosa.",
        packages: ["three", "@react-three/fiber", "@react-three/drei"],
    },
    wobble: {
        title: "Icosaedro Rubí Ondulante",
        description: "drei <MeshWobbleMaterial /> deformando geometría.",
        packages: ["three", "@react-three/fiber", "@react-three/drei"],
    },
    distort: {
        title: "Nudo Tórico Distorsionado",
        description: "drei <MeshDistortMaterial /> con distorsión viva.",
        packages: ["three", "@react-three/fiber", "@react-three/drei"],
    },
    trail: {
        title: "Estela Dorada Cinética",
        description: "drei <Trail /> siguiendo una esfera en órbita.",
        packages: ["three", "@react-three/fiber", "@react-three/drei"],
    },
    text: {
        title: "Tipografía Volumétrica SDF",
        description: "drei <Text /> SDF sin assets externos.",
        packages: ["three", "@react-three/fiber", "@react-three/drei"],
    },
    grid: {
        title: "Grid Infinito Tecnológico",
        description: "drei <Grid /> cian con secciones oro.",
        packages: ["three", "@react-three/fiber", "@react-three/drei"],
    },
    points: {
        title: "Nube de Puntos Cian",
        description: "PointsMaterial aditivo sobre BufferGeometry procedural.",
        packages: ["three", "@react-three/fiber"],
    },
    "contact-shadows": {
        title: "Toro con Sombras de Contacto",
        description: "drei <ContactShadows /> suavizando la escena.",
        packages: ["three", "@react-three/fiber", "@react-three/drei"],
    },
};