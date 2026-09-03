export type RoleKey = 'artistas' | 'eventos' | 'empresas' | 'instituciones' | 'vimume';

export type NodeType = 'root' | 'primary' | 'secondary' | 'leaf';

export interface ActionItem {
  label: string;
  href?: string;
  actionType?: 'navigate' | 'assistant' | 'modal';
  badge?: string;
}

export interface MetricItem {
  label: string;
  value: string;
}

export interface TaxonomyNode {
  id: string;
  label: string;
  role: RoleKey | 'root';
  type: NodeType;
  color: string;
  glowColor: string;
  parentId?: string;
  description?: string;
  tag?: string;
  route?: string;
  iconName?: string;
  metrics?: MetricItem[];
  actions?: ActionItem[];
  children?: TaxonomyNode[];
}

export interface SynapsePulse {
  progress: number; // 0 to 1
  speed: number;
  size: number;
  color?: string;
}

export interface SimulationNode {
  id: string;
  label: string;
  role: RoleKey | 'root';
  type: NodeType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  parentId?: string;
  depth: number;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  isHovered?: boolean;
  isSelected?: boolean;
  data: TaxonomyNode;
}

export interface SynapseLink {
  id: string;
  sourceId: string;
  targetId: string;
  color: string;
  length: number;
  strength: number;
  pulses: SynapsePulse[];
}

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
  targetX: number;
  targetY: number;
  targetZoom: number;
}

export interface RoleDefinition {
  key: RoleKey;
  label: string;
  subtitle: string;
  color: string;
  darkColor: string;
  accentBg: string;
  borderColor: string;
  route: string;
  badge: string;
  description: string;
  summaryMetrics: MetricItem[];
}

export const ROLE_DEFINITIONS: Record<RoleKey, RoleDefinition> = {
  artistas: {
    key: 'artistas',
    label: 'Artistas',
    subtitle: 'Roster S-Class, Formación & Management',
    color: '#f43f5e',
    darkColor: 'rgba(244, 63, 94, 0.15)',
    accentBg: 'rgba(244, 63, 94, 0.08)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
    route: '/artistas',
    badge: 'TALENTO & REPRESENTACIÓN',
    description: 'Gestión integral de carrera artística, contratación directa, bolsa de empleo y soberanía técnica con 80% neto para el artista.',
    summaryMetrics: [
      { label: 'Split Artista', value: '80% Neto' },
      { label: 'Rider Acústico', value: '12 W/pax' },
      { label: 'Paciente Cero', value: 'Edwin Agudelo' }
    ]
  },
  eventos: {
    key: 'eventos',
    label: 'Eventos',
    subtitle: 'Bodas de Gala, Corporativos & Festivales',
    color: '#f59e0b',
    darkColor: 'rgba(245, 158, 11, 0.15)',
    accentBg: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    route: '/bodas',
    badge: 'PRODUCCIÓN 360',
    description: 'Diseño sonoro y audiovisual boutique para bodas exclusivas, eventos propios y conmemoraciones de alto ticket con Price-Lock 72h.',
    summaryMetrics: [
      { label: 'Garantía Acústica', value: 'Bose F1 / S1' },
      { label: 'Price-Lock', value: '72h SHA-256' },
      { label: 'Cobertura', value: 'Nacional' }
    ]
  },
  empresas: {
    key: 'empresas',
    label: 'Empresas',
    subtitle: 'Proveedores Homologados & Fincas B2B',
    color: '#10b981',
    darkColor: 'rgba(16, 185, 129, 0.15)',
    accentBg: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    route: '/proveedores',
    badge: 'ECOSISTEMA B2B',
    description: 'Directorio verificado en 2 pasos (2FA), gestión multimedia y programa de partners con comisiones directas y liquidez transparente.',
    summaryMetrics: [
      { label: 'Comisión Partner', value: '10% Directo' },
      { label: 'Verificación', value: '2FA Activo' },
      { label: 'Fichas B2B', value: 'Homologadas' }
    ]
  },
  instituciones: {
    key: 'instituciones',
    label: 'Instituciones',
    subtitle: 'Gobiernos, Ayuntamientos & Entidades',
    color: '#06b6d4',
    darkColor: 'rgba(6, 182, 212, 0.15)',
    accentBg: 'rgba(6, 182, 212, 0.08)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
    route: '/ayuntamientos',
    badge: 'B2G LCSP ART. 118',
    description: 'Licitaciones públicas simplificadas para fiestas patronales, Navidad y galas oficiales con estricto apego a la LCSP (< 15.000 €).',
    summaryMetrics: [
      { label: 'Techo LCSP', value: '< 15.000 €' },
      { label: 'Presupuesto 95%', value: '14.250 €' },
      { label: 'Tramitación', value: 'Lista en 24h' }
    ]
  },
  vimume: {
    key: 'vimume',
    label: 'Proyecto Vimume',
    subtitle: 'Neuroestimulación Acústica & Silver Economy',
    color: '#8b5cf6',
    darkColor: 'rgba(139, 92, 246, 0.15)',
    accentBg: 'rgba(139, 92, 246, 0.08)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    route: '/vimume',
    badge: 'NEUROCIENCIA & IMPACTO',
    description: 'Protocolo de musicoterapia activa y frecuencias a 40 Hz (<75 dB) para residencias, centros de día y bienestar en la tercera edad.',
    summaryMetrics: [
      { label: 'Frecuencia Terapéutica', value: '40 Hz Gamma' },
      { label: 'Límite Acústico', value: '< 75 dB SPL' },
      { label: 'Validación', value: 'Piloto 5 Centros' }
    ]
  }
};

export const MASTER_TAXONOMY: TaxonomyNode = {
  id: 'ear-root',
  label: 'Productora EAR',
  role: 'root',
  type: 'root',
  color: '#ffffff',
  glowColor: '#ecb613',
  description: 'Nodo Central y Núcleo de Gobernanza Operativa EAR OS V2.',
  tag: 'CORE SSOT',
  children: [
    // 1. ARTISTAS
    {
      id: 'artistas',
      label: 'Artistas',
      role: 'artistas',
      type: 'primary',
      color: '#f43f5e',
      glowColor: '#fb7185',
      tag: 'ROSTER S-CLASS',
      route: '/artistas',
      description: 'Gestión soberana de artistas, producción técnica y contratos con split 80/10/10.',
      children: [
        {
          id: 'artistas-formacion',
          label: 'Formación',
          role: 'artistas',
          type: 'secondary',
          color: '#f43f5e',
          glowColor: '#fda4af',
          description: 'Cátedra escénica, técnica vocal avanzada y disciplina de escenario.',
          children: [
            {
              id: 'artistas-formacion-logros',
              label: 'Logros',
              role: 'artistas',
              type: 'leaf',
              color: '#f43f5e',
              glowColor: '#ffe4e6',
              description: 'Certificaciones, hitos de audiencia y reconocimiento internacional.'
            }
          ]
        },
        {
          id: 'artistas-representacion',
          label: 'Representación',
          role: 'artistas',
          type: 'secondary',
          color: '#f43f5e',
          glowColor: '#fda4af',
          description: 'Management directo sin comisiones abusivas y blindaje contractual.'
        },
        {
          id: 'artistas-bolsa-empleo',
          label: 'Bolsa de empleo',
          role: 'artistas',
          type: 'secondary',
          color: '#f43f5e',
          glowColor: '#fda4af',
          description: 'Conexión con galas, orquestas, serenatas y espectáculos privados.'
        },
        {
          id: 'artistas-area-privada',
          label: 'Gestión Área privada/Multimedia',
          role: 'artistas',
          type: 'secondary',
          color: '#f43f5e',
          glowColor: '#fda4af',
          description: 'Panel del artista, subida de riders, audios de autor y liquidaciones Stripe.'
        },
        {
          id: 'artistas-afiliados',
          label: 'Afiliados',
          role: 'artistas',
          type: 'secondary',
          color: '#f43f5e',
          glowColor: '#fda4af',
          description: 'Red de colaboradores que generan bolos y reciben comisiones automáticas.'
        }
      ]
    },

    // 2. EVENTOS
    {
      id: 'eventos',
      label: 'Eventos',
      role: 'eventos',
      type: 'primary',
      color: '#f59e0b',
      glowColor: '#fbbf24',
      tag: 'BODAS & GALAS',
      route: '/bodas',
      description: 'Producción ejecutiva de ceremonias, cócteles de lujo y fechas exclusivas.',
      children: [
        {
          id: 'eventos-propios',
          label: 'Propios',
          role: 'eventos',
          type: 'secondary',
          color: '#f59e0b',
          glowColor: '#fde68a',
          description: 'Ciclos de conciertos, espectáculos de autor y festivales propios EAR.'
        },
        {
          id: 'eventos-terceros',
          label: 'De terceros',
          role: 'eventos',
          type: 'secondary',
          color: '#f59e0b',
          glowColor: '#fde68a',
          description: 'Eventos a medida para parejas y fechas señaladas con Price-Lock 72h.',
          children: [
            {
              id: 'eventos-terceros-parejas',
              label: 'Parejas',
              role: 'eventos',
              type: 'leaf',
              color: '#f59e0b',
              glowColor: '#fef3c7',
              description: 'Bodas de gala, ceremonias religiosas/civiles y fiestas nupciales.'
            },
            {
              id: 'eventos-terceros-fechas',
              label: 'Fechas señaladas',
              role: 'eventos',
              type: 'leaf',
              color: '#f59e0b',
              glowColor: '#fef3c7',
              description: 'Aniversarios, pedidas de mano sorpresa, jubilaciones y cumpleaños VIP.'
            }
          ]
        }
      ]
    },

    // 3. EMPRESAS
    {
      id: 'empresas',
      label: 'Empresas',
      role: 'empresas',
      type: 'primary',
      color: '#10b981',
      glowColor: '#34d399',
      tag: 'RED B2B',
      route: '/proveedores',
      description: 'Red de espacios, catering de brasas, audiovisuales y proveedores de élite.',
      children: [
        {
          id: 'empresas-proveedores',
          label: 'Proveedores',
          role: 'empresas',
          type: 'secondary',
          color: '#10b981',
          glowColor: '#6ee7b7',
          description: 'Fincas, catering gourmet, iluminación y pantallas LED homologadas.'
        },
        {
          id: 'empresas-area-privada',
          label: 'Gestión Área privada/Multimedia',
          role: 'empresas',
          type: 'secondary',
          color: '#10b981',
          glowColor: '#6ee7b7',
          description: 'Control de reservas, facturación electrónica y estadísticas de conversión.'
        },
        {
          id: 'empresas-afiliados',
          label: 'Afiliados',
          role: 'empresas',
          type: 'secondary',
          color: '#10b981',
          glowColor: '#6ee7b7',
          description: 'Alianzas B2B con wedding planners y agencias con 10% directo.'
        }
      ]
    },

    // 4. INSTITUCIONES
    {
      id: 'instituciones',
      label: 'Instituciones',
      role: 'instituciones',
      type: 'primary',
      color: '#06b6d4',
      glowColor: '#22d3ee',
      tag: 'B2G OFICIAL',
      route: '/ayuntamientos',
      description: 'Canal directo para corporaciones locales y administraciones públicas.',
      children: [
        {
          id: 'instituciones-gobiernos',
          label: 'Gobiernos',
          role: 'instituciones',
          type: 'secondary',
          color: '#06b6d4',
          glowColor: '#67e8f9',
          description: 'Planes autonómicos y estatales de cultura, turismo y desarrollo.',
          children: [
            {
              id: 'instituciones-gob-vimume',
              label: 'Proyecto Vimume',
              role: 'instituciones',
              type: 'leaf',
              color: '#06b6d4',
              glowColor: '#a5f3fc',
              description: 'Implementación del protocolo en redes sociosanitarias públicas.'
            },
            {
              id: 'instituciones-gob-catalogo360',
              label: 'Catálogo 360 de servicios',
              role: 'instituciones',
              type: 'leaf',
              color: '#06b6d4',
              glowColor: '#a5f3fc',
              description: 'Galas anuales, ferias/Fitur, cenas de estado, recepciones diplomáticas, transporte VIP y Navidad.'
            }
          ]
        },
        {
          id: 'instituciones-ayuntamientos',
          label: 'Ayuntamientos',
          role: 'instituciones',
          type: 'secondary',
          color: '#06b6d4',
          glowColor: '#67e8f9',
          description: 'Contratación menor conforme al Art. 118 LCSP (< 15.000 €).',
          children: [
            {
              id: 'instituciones-ayun-catalogo360',
              label: 'Catálogo 360 de servicios municipales',
              role: 'instituciones',
              type: 'leaf',
              color: '#06b6d4',
              glowColor: '#a5f3fc',
              description: 'Fiestas patronales, eventos navideños, pantallas LED e ingeniería acústica municipal.'
            },
            {
              id: 'instituciones-ayun-vimume',
              label: 'Proyecto Vimume',
              role: 'instituciones',
              type: 'leaf',
              color: '#06b6d4',
              glowColor: '#a5f3fc',
              description: 'Talleres sonoros en centros de mayores y hogares del jubilado municipales.'
            }
          ]
        },
        {
          id: 'instituciones-fundaciones',
          label: 'Fundaciones/asociaciones (Socios estratégicos)',
          role: 'instituciones',
          type: 'secondary',
          color: '#06b6d4',
          glowColor: '#67e8f9',
          description: 'Convenios marco con AFAs, colegios profesionales y ONGs.',
          children: [
            {
              id: 'instituciones-fund-acuerdos',
              label: 'Acuerdos de colaboración y sinergias',
              role: 'instituciones',
              type: 'leaf',
              color: '#06b6d4',
              glowColor: '#a5f3fc',
              description: 'Programas de cofinanciación, mecenazgo y transferencia de conocimiento.'
            },
            {
              id: 'instituciones-fund-afiliados',
              label: 'Afiliados',
              role: 'instituciones',
              type: 'leaf',
              color: '#06b6d4',
              glowColor: '#a5f3fc',
              description: 'Entidades asociadas vinculadas a la red de impacto social EAR.'
            }
          ]
        }
      ]
    },

    // 5. PROYECTO VIMUME
    {
      id: 'vimume',
      label: 'Proyecto Vimume',
      role: 'vimume',
      type: 'primary',
      color: '#8b5cf6',
      glowColor: '#a78bfa',
      tag: 'NEUROACÚSTICA',
      route: '/vimume',
      description: 'Ecosistema de estimulación cognitiva a 40 Hz y música evocativa para la memoria.',
      children: [
        {
          id: 'vimume-concepto-central',
          label: 'Concepto central',
          role: 'vimume',
          type: 'secondary',
          color: '#8b5cf6',
          glowColor: '#c4b5fd',
          description: 'Gala benéfica y conjunto de artistas acreditados en neuroestimulación.',
          children: [
            {
              id: 'vimume-evento-anual',
              label: 'Evento anual',
              role: 'vimume',
              type: 'leaf',
              color: '#8b5cf6',
              glowColor: '#ddd6fe',
              description: 'Gala institucional anual con recaudación benéfica e informe de impacto.'
            },
            {
              id: 'vimume-artistas',
              label: 'Artistas Vimume',
              role: 'vimume',
              type: 'leaf',
              color: '#8b5cf6',
              glowColor: '#ddd6fe',
              description: 'Músicos especializados en dinámicas no invasivas para residencias de ancianos.'
            }
          ]
        },
        {
          id: 'vimume-sistema-neuronal',
          label: 'Sistema neuronal Navegable',
          role: 'vimume',
          type: 'secondary',
          color: '#8b5cf6',
          glowColor: '#c4b5fd',
          description: 'Red colaborativa multidireccional entre los cuatro agentes clave.',
          children: [
            {
              id: 'vimume-red-familiares',
              label: 'Familiares',
              role: 'vimume',
              type: 'leaf',
              color: '#8b5cf6',
              glowColor: '#ddd6fe',
              description: 'Portal de seguimiento cognitivo y banda sonora vital personalizada.'
            },
            {
              id: 'vimume-red-terapeutas',
              label: 'Terapeutas ocupacionales/(Socios estratégicos)',
              role: 'vimume',
              type: 'leaf',
              color: '#8b5cf6',
              glowColor: '#ddd6fe',
              description: 'Protocolos clínicos certificados y bitácora de respuesta neuroacústica.'
            },
            {
              id: 'vimume-red-empresas',
              label: 'Empresas de productos y servicios',
              role: 'vimume',
              type: 'leaf',
              color: '#8b5cf6',
              glowColor: '#ddd6fe',
              description: 'Marcas y patrocinadores alineados con la Silver Economy y ODS 2030.'
            },
            {
              id: 'vimume-red-instituciones',
              label: 'Instituciones',
              role: 'vimume',
              type: 'leaf',
              color: '#8b5cf6',
              glowColor: '#ddd6fe',
              description: 'Consejadas de bienestar social y ayuntamientos co-ejecutores.'
            }
          ]
        },
        {
          id: 'vimume-financiacion',
          label: 'Financiación/voluntariado',
          role: 'vimume',
          type: 'secondary',
          color: '#8b5cf6',
          glowColor: '#c4b5fd',
          description: 'Canales de soporte económico y capital humano voluntario.',
          children: [
            {
              id: 'vimume-fin-donaciones',
              label: 'Donaciones',
              role: 'vimume',
              type: 'leaf',
              color: '#8b5cf6',
              glowColor: '#ddd6fe',
              description: 'Aportaciones con deducción fiscal y trazabilidad SROI certificada.'
            },
            {
              id: 'vimume-fin-crowdfunding',
              label: 'Crowdfunding',
              role: 'vimume',
              type: 'leaf',
              color: '#8b5cf6',
              glowColor: '#ddd6fe',
              description: 'Campañas participativas para equipamiento acústico en centros rurales.'
            },
            {
              id: 'vimume-fin-contrataciones',
              label: 'Contrataciones',
              role: 'vimume',
              type: 'leaf',
              color: '#8b5cf6',
              glowColor: '#ddd6fe',
              description: 'Contratos de prestación de sesiones neuroacústicas periódicas.'
            },
            {
              id: 'vimume-fin-voluntariado',
              label: 'Voluntariado',
              role: 'vimume',
              type: 'leaf',
              color: '#8b5cf6',
              glowColor: '#ddd6fe',
              description: 'Acompañamiento, apoyo en producción y soporte en sesiones musicales.'
            }
          ]
        }
      ]
    }
  ]
};

export type GraphRole = 'artistas' | 'eventos' | 'empresas' | 'instituciones' | 'vimume';

export interface NodeTelemetry {
  cluster: string;
  ticketSuelo?: number | string;
  margenBruto?: string;
  umbralOperativo?: string;
  frecuenciaHz?: number;
  normativa?: string;
  activeDocumentsCount?: number;
  lastUpdated?: string;
  metrics: MetricItem[];
}

export interface GraphNode extends SimulationNode {
  telemetry?: NodeTelemetry;
}

export interface GraphLink extends SynapseLink {}

export interface PhysicsConfig {
  springLength: number;
  springStrength: number;
  repulsion: number;
  damping: number;
  centerGravity: number;
  mouseRepulsionRadius: number;
  mouseRepulsionStrength: number;
}
