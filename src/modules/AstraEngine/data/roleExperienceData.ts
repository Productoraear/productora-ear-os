import { UserRole } from '../types';

export const roleExperienceData: Record<UserRole, any> = {
  [UserRole.ARTIST]: {
    title: 'Bienvenido, Artista Visionario',
    description: 'Tu camino hacia el ticket de 1.500€ comienza aquí.',
    steps: ['Diagnóstico de Identidad', 'Construcción de Oferta', 'Lanzamiento'],
    featured_tools: ['the-signal', 'forensic-audit', 'opal-simulator']
  },
  [UserRole.MANAGER]: {
    title: 'Bienvenido, Estratega de Talento',
    description: 'Optimiza la carrera de tus artistas con datos forenses.',
    steps: ['Auditoría de Cartera', 'Optimización de Rutas', 'Negociación B2B'],
    featured_tools: ['market-scanner', 'tour-engineering', 'contract-analyzer']
  },
  [UserRole.PROJECT_MANAGER]: {
    title: 'Bienvenido, Director de Operaciones',
    description: 'Coordina eventos complejos con precisión militar.',
    steps: ['Logística de Eventos', 'Gestión de Equipos', 'Control de Costes'],
    featured_tools: ['logistics-hub', 'team-dispatch', 'budget-tracker']
  },
  [UserRole.ENTREPRENEUR]: {
    title: "Bienvenido, Arquitecto de Negocios",
    description: "Construye sistemas que escalen sin tu presencia constante.",
    steps: ["Auditoría de Activos", "Automatización de Procesos", "Escalado Financiero"],
    featured_tools: ["opal-simulator", "roi-calculator", "team-audit"]
  },
  [UserRole.STRATEGIC_COMMUNICATOR]: {
    title: "Bienvenido, La Voz de la Marca",
    description: "Transforma ruido en señales de alta conversión.",
    steps: ["Análisis de Audiencia", "Arquitectura de Mensaje", "Viralidad Sostenible"],
    featured_tools: ["copy-optimizer", "the-signal", "market-scanner"]
  },
  [UserRole.BOOK_AUTHOR]: {
    title: "Bienvenido, Creador de Legado",
    description: "Inmortaliza tu conocimiento en un activo vendible.",
    steps: ["Estructura de Capítulos", "Marketing de Lanzamiento", "Monetización de IP"],
    featured_tools: ["legacy-library", "authority-builder", "content-matrix"]
  }
};