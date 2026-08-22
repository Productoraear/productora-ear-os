/**
 * 🛰️ S-CLASS MULTIVARIATE ENGINE - V146
 * Algoritmo de Hash Determinista para Diversificación Territorial.
 */
/**
 * Convierte un string (provincia) en un índice determinista para asignar un diseño S-Class.
 * Esto garantiza consistencia SEO (misma URL = mismo diseño) sin persistencia en DB.
 */
export function getTemplateForProvince(province) {
    const templates = ['AURA_ONYX', 'KINETIC_GOLD', 'INSTITUTIONAL_BLUE', 'MINIMAL_GLASS'];
    // Hash simple basado en la suma de caracteres
    const hash = province.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return templates[hash % templates.length];
}
/**
 * Devuelve el copy y estilos específicos para cada variante del motor multivariante.
 */
export function getTemplateConfig(template, location) {
    const configs = {
        AURA_ONYX: {
            accentColor: '#ecb613',
            copy: `Excelencia y Autoridad Institucional en ${location}. Protocolos de alta producción bajo el estándar VIMUME OS.`,
            tagline: 'VIMUME Authority',
            gradient: 'from-[#ecb613]/20',
            faqs: [
                { q: `¿Qué cobertura tiene VIMUME OS en ${location}?`, a: `Operamos con protocolos logísticos propios en toda la zona de ${location}, garantizando tiempos de respuesta inmediatos.` },
                { q: "¿Qué es el estándar institucional?", a: "Es nuestra certificación de calidad técnica que asegura equipos de última generación y protocolos de impacto certificados." }
            ],
            specs: [
                { label: "Tiempo de Respuesta", value: "Inmediato" },
                { label: "Equipamiento", value: "Institutional Certified" },
                { label: "Jurisdicción", value: location }
            ]
        },
        KINETIC_GOLD: {
            accentColor: '#ffcc00',
            copy: `High Energy & Entertainment Elite en ${location}. Vibración cinética y sistemas de impacto masivo.`,
            tagline: 'Kinetic Performance',
            gradient: 'from-yellow-500/20',
            faqs: [
                { q: `¿Cómo se adaptan los shows a los recintos de ${location}?`, a: `Realizamos un estudio acústico previo en cada espacio de ${location} para optimizar la presión sonora.` }
            ],
            specs: [
                { label: "Presión Sonora", value: "Hasta 110dB" },
                { label: "Iluminación", value: "LED Pixel Mapping" }
            ]
        },
        INSTITUTIONAL_BLUE: {
            accentColor: '#3b82f6',
            copy: `Valor Social Bonificable VIMUME en ${location}. Infraestructura cultural y protocolo institucional transparente.`,
            tagline: 'Institutional Excellence',
            gradient: 'from-blue-600/20',
            faqs: [
                { q: `¿Es VIMUME aplicable a ayuntamientos de ${location}?`, a: `Sí, disponemos de protocolos específicos para administración pública y licitaciones en ${location}.` }
            ],
            specs: [
                { label: "Impacto Social", value: "Certificado" },
                { label: "Transparencia", value: "Protocolo B2G" }
            ]
        },
        MINIMAL_GLASS: {
            accentColor: '#ffffff',
            copy: `La Excelencia para Fincas y Bodas en ${location}. Estética minimalista y sofisticación sonora de alta gama.`,
            tagline: 'Pure Elegance',
            gradient: 'from-white/10',
            faqs: [
                { q: `¿Ofrecéis servicios para bodas exclusivas en ${location}?`, a: `Sí, nos especializamos en bodas de alto nivel con diseños sonoros invisibles en ${location}.` }
            ],
            specs: [
                { label: "Estética", value: "Minimal Glass" },
                { label: "Fidelidad", value: "Hi-Fi Live" }
            ]
        }
    };
    return configs[template];
}
