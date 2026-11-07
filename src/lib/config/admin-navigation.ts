import {
  Activity,
  BookOpen,
  Calendar,
  Compass,
  CreditCard,
  ExternalLink,
  FileText,
  Film,
  Flame,
  GraduationCap,
  Landmark,
  Layers,
  LayoutDashboard,
  MessageCircle,
  Mic,
  PhoneCall,
  Satellite,
  Share2,
  Shield,
  Sliders,
  Sparkles,
  Swords,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO,
  TARIFA_BASE_SOLISTA_EUR,
} from '@/lib/constants/ear-os-ssot';
import {
  PROVIDERS_GRAND_TOTAL,
  formatProviderBadge,
} from '@/lib/constants/providers-manifest';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SSOT DE NAVEGACIÓN DEL COCKPIT ADMIN (EAR OS MASTER COCKPIT) — ÚNICA fuente.
 * La consume `src/app/(admin)/admin/layout.tsx` (ribbon, sub-tabs, sidebar y
 * buscador ⌘K/Ctrl+K) y cualquier índice de directorio del admin.
 *
 * REGLAS INMUTABLES (CERO DUPLICACIÓN · CERO VANITY METRICS):
 * 1. Prohibido declarar arrays de navegación dentro de componentes: se añaden aquí.
 * 2. Todo `href` debe existir de verdad en `src/app/**` (0 clics muertos).
 * 3. Los `badge` numéricos se derivan de SSOT/manifest; nunca se teclean a mano.
 * 4. Si una cifra no tiene fuente viva, el badge es semántico (texto) o «0».
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/** Badge de catálogo derivado del manifest real de proveedores (CDN/Edge). */
const PROVIDERS_BADGE: string = formatProviderBadge(PROVIDERS_GRAND_TOTAL);

/** Split Soberano formateado desde el SSOT inmutable (80/10/10). */
const SPLIT_BADGE: string = [
  Math.round(SPLIT_SOBERANO.artista * 100),
  Math.round(SPLIT_SOBERANO.earOs * 100),
  Math.round(SPLIT_SOBERANO.vimume * 100),
].join('/');

/** Depósito de cierre formateado desde el SSOT (Price-Lock). */
const DEPOSITO_BADGE: string = `${DEPOSITO_STRIPE_EUR.toFixed(0)} € PRICE-LOCK`;

/** Techo preventivo B2G formateado desde el SSOT (Art. 118 LCSP). */
const B2G_BADGE: string = `<${AJUSTE_PREVENTIVO_B2G_EUR.toLocaleString('es-ES')} €`;

/** Tarifa base del solista formateada desde el SSOT. */
const TARIFA_BADGE: string = `${TARIFA_BASE_SOLISTA_EUR.toFixed(0)} €`;

/**
 * PROCEDENCIA DE LOS RÓTULOS DE LA GUÍA MAESTRA: el compilador de intención NO
 * declara sus ejes aquí. Su SSOT ejecutable es `src/lib/compiler/master-guide.ts`
 * (objetivo de negocio, táctica comercial y destinatario, con sus directivas).
 * Esta estructura gobierna EXCLUSIVAMENTE la navegación del cockpit: una fila por
 * ruta real, para que no vuelvan a existir tres fuentes de verdad (W48_T02).
 */

export interface AdminSubTab {
  /** Identificador estable y único dentro de todo el cockpit. */
  id: string;
  /** Rótulo visible (puede llevar emoji de dominio). */
  name: string;
  /** Ruta real navegable. */
  href: string;
  /** Icono (Lucide) usado por ribbon, sidebar y buscador. */
  icon: LucideIcon;
  /** Etiqueta corta: semántica o derivada de SSOT/manifest. */
  badge: string;
  /** Dolor que resuelve el módulo (se muestra en desplegable y buscador). */
  description: string;
}

export interface AdminMasterTab {
  id: string;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
  badge: string;
  subTabs: AdminSubTab[];
}

/**
 * Pestañas maestras del cockpit. Orden = prioridad comercial real:
 * prospección → IA → CRM → B2G → tesorería → telemetría → control.
 */
export const ADMIN_MASTER_TABS: AdminMasterTab[] = [
  {
    id: 'prospeccion',
    title: '🎯 Prospección & Leads',
    shortTitle: 'Prospección',
    icon: Compass,
    badge: PROVIDERS_BADGE,
    subTabs: [
      {
        id: 'mailerfind',
        name: '🎯 Mailerfind MCP Leads',
        href: '/admin/mailerfind',
        icon: Compass,
        badge: 'INSTAGRAM + MAPS',
        description: 'Extracción orgánica de directorios y Google Maps con teléfono real',
      },
      {
        id: 'sclass-pro',
        name: '👑 Portal S-Class Pro',
        href: '/pro',
        icon: Sliders,
        badge: SPLIT_BADGE,
        description: 'Portal privado de proveedores y fincas homologadas',
      },
      {
        id: 'sourcing',
        name: '🔥 Scala Leads & Sourcing',
        href: '/admin/sourcing',
        icon: Flame,
        badge: TARIFA_BADGE,
        description: 'Radar de centros senior y prospección VIMUME a tarifa cerrada',
      },
      {
        id: 'cult-directory',
        name: '📁 Directorio & IA',
        href: '/admin/directorio',
        icon: Layers,
        badge: 'CULT UI',
        description: 'Directorio canónico con pipeline de enriquecimiento IA',
      },
      {
        id: 'calibrador',
        name: '🎛️ Calibrador Proveedores',
        href: '/admin/calibrador-proveedores',
        icon: Sliders,
        badge: '200D',
        description: 'Calibración de especificaciones técnicas por delegación',
      },
    ],
  },
  {
    id: 'arena',
    title: '⚔️ Arena IA & Optimización',
    shortTitle: 'Arena IA',
    icon: Swords,
    badge: 'ELO K=32',
    subTabs: [
      {
        id: 'arena-main',
        name: '⚔️ Torneo Elo de Conversión',
        href: '/admin/arena',
        icon: Swords,
        badge: 'BATALLAS',
        description: 'Torneo Elo de conversión de copy y diseño',
      },
      {
        id: 'compiler',
        name: '⚡ Compilador Maestro',
        href: '/admin/compiler',
        icon: Zap,
        badge: 'INTENCIÓN',
        description: 'Convierte tu orden en un grafo de ejecución con la Guía Maestra aplicada',
      },
      {
        id: 'voice',
        name: '🎙️ Estudio de Voz IA',
        href: '/admin/voice-studio',
        icon: Mic,
        badge: 'GPU LOCAL',
        description: 'Estudio de síntesis vocal y microfonía sobre Ollama 11434',
      },
      {
        id: 'video-factory',
        name: '🎬 Fábrica de Vídeo S-Class',
        href: '/admin/video-factory',
        icon: Film,
        badge: 'MONTAJE',
        description: 'Piezas de vídeo y reels de conversión generados desde el SSOT',
      },
      {
        id: 'journey',
        name: '🧭 Journey Heatmap UX',
        href: '/admin/journey-heatmap',
        icon: Compass,
        badge: 'HEATMAP',
        description: 'Telemetría de navegación y puntos de fricción del cliente',
      },
      {
        id: 'aura',
        name: '✨ Aura Showcase',
        href: '/aura',
        icon: Sparkles,
        badge: 'DISEÑO',
        description: 'Catálogo de componentes visuales S-Class (OLED + oro)',
      },
    ],
  },
  {
    id: 'crm',
    title: '📞 Call Center & Red B2B',
    shortTitle: 'Call Center',
    icon: PhoneCall,
    badge: CENTRALITA_EAR_OS,
    subTabs: [
      {
        id: 'call-center',
        name: '📞 Call Center Outbound',
        href: '/admin/call-center',
        icon: PhoneCall,
        badge: PROVIDERS_BADGE,
        description: 'Despacho de llamadas y cola de prospección verificada',
      },
      {
        id: 'whatsapp',
        name: '💬 Centralita WhatsApp',
        href: '/admin/whatsapp',
        icon: MessageCircle,
        badge: 'DIRECTO',
        description: 'Recepción y cierre consultivo por WhatsApp en menos de 5 min',
      },
      {
        id: 'affiliates',
        name: '🏰 Red Afiliados Fincas',
        href: '/admin/afiliados',
        icon: Share2,
        badge: SPLIT_BADGE,
        description: 'Fincas homologadas, comisiones del 10% y liquidación',
      },
      {
        id: 'providers',
        name: '👥 Proveedores Edge CDN',
        href: '/admin/proveedores',
        icon: Users,
        badge: PROVIDERS_BADGE,
        description: 'Catálogo indexado con teléfono verificable (INV-06)',
      },
      {
        id: 'propuestas',
        name: '📑 Propuestas & Presupuestos',
        href: '/admin/propuestas',
        icon: FileText,
        badge: 'QUOTES',
        description: 'Propuestas comerciales con firma y telemetría de lectura',
      },
      {
        id: 'simulador',
        name: '🗺️ Mapa & Simulador',
        href: '/admin/simulador',
        icon: Compass,
        badge: 'LOGÍSTICA',
        description: 'Simulación de rutas desde el Hub Méntrida y coste real',
      },
    ],
  },
  {
    id: 'b2g',
    title: '🏛️ Licitaciones & VIMUME',
    shortTitle: 'B2G & Social',
    icon: Landmark,
    badge: B2G_BADGE,
    subTabs: [
      {
        id: 'b2g-licitaciones',
        name: '🏛️ B2G Contratos Menores',
        href: '/admin/licitaciones',
        icon: Landmark,
        badge: 'ART. 118',
        description: 'Contratos menores de festejos y cultura bajo LCSP',
      },
      {
        id: 'training',
        name: '🎓 Omni Training Center',
        href: '/admin/training',
        icon: GraduationCap,
        badge: 'SALES',
        description: 'Academia y formación de closers con guion consultivo',
      },
      {
        id: 'manual',
        name: '📖 Manual Operaciones 360',
        href: '/admin/manual-operaciones',
        icon: BookOpen,
        badge: 'DOCS',
        description: 'Documentación viva de protocolos y contingencias',
      },
    ],
  },
  {
    id: 'tesoreria',
    title: '💳 Tesorería & Logística',
    shortTitle: 'Tesorería',
    icon: CreditCard,
    badge: DEPOSITO_BADGE,
    subTabs: [
      {
        id: 'treasury',
        name: '💳 Tesorería & Stripe 100€',
        href: '/admin/tesoreria',
        icon: CreditCard,
        badge: 'PRICE-LOCK',
        description: 'Depósitos deducibles, conciliación Stripe y ledger',
      },
      {
        id: 'fleet',
        name: '🚚 Flota & Hub Méntrida',
        href: '/admin/flota',
        icon: Truck,
        badge: 'KM 0',
        description: 'Vehículos, material técnico y portes 1,50 €/km',
      },
      {
        id: 'scheduler',
        name: '🤖 Qronos Scheduler',
        href: '/admin/scheduler',
        icon: Calendar,
        badge: 'CRON',
        description: 'Automatización de tareas programadas y recordatorios',
      },
      {
        id: 'cockpit',
        name: '📊 Dashboard Central',
        href: '/admin',
        icon: LayoutDashboard,
        badge: 'CORE',
        description: 'Panel principal: KPIs reales de ventas y tesorería',
      },
    ],
  },
  {
    id: 'telemetria',
    title: '🛰️ Telemetría & Sentinel',
    shortTitle: 'Gobernanza',
    icon: Satellite,
    badge: 'BARE-METAL',
    subTabs: [
      {
        id: 'telemetry',
        name: '📊 Telemetría Bare-Metal',
        href: '/admin/telemetria',
        icon: Activity,
        badge: 'OLLAMA',
        description: 'Monitorización de GPU y modelos locales (sonda viva)',
      },
      {
        id: 'sentinel',
        name: '🛰️ Consola Sentinel ZTM',
        href: '/admin/sentinel',
        icon: Satellite,
        badge: 'ZERO-TKN',
        description: 'Vigilancia de memoria, contexto y árbol de Git',
      },
      {
        id: 'command',
        name: '🛡️ Centro de Mando & Skills',
        href: '/admin/command-center',
        icon: Shield,
        badge: 'ROOT',
        description: 'Auditoría de skills y directivas de gobernanza',
      },
      {
        id: 'agentes',
        name: '🧠 Agente & Enjambre de Respaldo',
        href: '/admin/agentes',
        icon: Sparkles,
        badge: 'ROSTER',
        // Badge semántico a propósito: el número real lo lee la página de disco.
        description: 'Roster real de agentes backup desde .agents/skills (0 cifras inventadas)',
      },
    ],
  },
  {
    id: 'control',
    title: 'Ctrl Soberano',
    shortTitle: 'Control',
    icon: Sliders,
    badge: 'SEGMENTADO',
    subTabs: [
      {
        id: 'control-panel',
        name: 'Panel Segmentado',
        href: '/admin/control',
        icon: LayoutDashboard,
        badge: 'ENTIDADES',
        description: 'Artistas, proveedores, terapeutas, flota, afiliados y tesorería',
      },
    ],
  },
];

/** Totales derivados (nunca tecleados): alimentan el rótulo «N módulos». */
export const ADMIN_NAV_TOTALS = {
  tabs: ADMIN_MASTER_TABS.length,
  subTabs: ADMIN_MASTER_TABS.reduce((total, tab) => total + tab.subTabs.length, 0),
} as const;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DIRECTORIO MAESTRO DERIVADO (ECOSISTEMA ÚNICO)
 * ─────────────────────────────────────────────────────────────────────────────
 * Un solo ecosistema, no 28 pantallas cada una por su lado. El dashboard
 * central consumía un array paralelo `ALL_ADMIN_DIRECT_URLS` declarado dentro
 * del propio componente, con cifras tecleadas a mano («84K B2B», «19.6K CDN»,
 * «22 URLs»). Ese array se ha eliminado: aquí se deriva TODO de
 * `ADMIN_MASTER_TABS`, por lo que dar de alta un módulo en la pestaña maestra
 * lo publica automáticamente en ribbon, sidebar, ⌘K y directorio del cockpit.
 *
 * Verificado por `scripts/audit_admin_ecosystem.cjs` (0 huérfanos, 0 muertos).
 */
export interface AdminDirectoryEntry {
  /** Categoría = rótulo de la pestaña maestra (agrupación visual del directorio). */
  category: string;
  name: string;
  url: string;
  badge: string;
  desc: string;
  icon: LucideIcon;
  /** `true` si el destino NO vive bajo /admin (atajo a consola pública). */
  publicShortcut: boolean;
}

/**
 * Atajos a destinos FUERA de /admin que el CEO abre desde el cockpit.
 * Se declaran aquí (fuente única) y NO dentro de un componente.
 *
 * DEPURACIÓN REAL (INV-09 · 0 clics muertos): el array paralelo que vivía en
 * `AdminDashboardClient` ofrecía 5 atajos «Directo» y CUATRO de ellos no
 * existían en disco (`/radar`, `/agent-skills`, `/voice-studio`, `/sourcing`):
 * cada clic del CEO era un 404. Se han eliminado. Solo sobrevive lo verificado
 * con `Test-Path`/lectura de disco en esta sesión.
 *
 * Auditado por `scripts/audit_admin_ecosystem.cjs` (aserción A).
 */
export const ADMIN_PUBLIC_SHORTCUTS: AdminDirectoryEntry[] = [
  {
    category: 'Atajos Públicos',
    name: '🧮 Simulador HTML',
    url: '/simulador-ear-os.html',
    badge: 'HTML5',
    desc: 'Simulador estático autónomo (sin servidor) para demos en finca',
    icon: ExternalLink,
    publicShortcut: true,
  },
  {
    category: 'Atajos Públicos',
    name: '🏰 Escaparate Fincas B2B & 100 Fundadores',
    url: '/fincas',
    badge: '100 FUNDADORES',
    desc: 'Portal B2B de fincas, simulador de menús 2026 y pacto de 100 fundadores con Price-Match',
    icon: ExternalLink,
    publicShortcut: true,
  },
];

/** Directorio plano del cockpit: 1 fila por destino real, derivada del SSOT. */
export const ADMIN_MODULE_DIRECTORY: AdminDirectoryEntry[] = [
  ...ADMIN_MASTER_TABS.flatMap((tab) =>
    tab.subTabs.map((sub) => ({
      category: tab.title,
      name: sub.name,
      url: sub.href,
      badge: sub.badge,
      desc: sub.description,
      icon: sub.icon,
      publicShortcut: !sub.href.startsWith('/admin'),
    })),
  ),
  ...ADMIN_PUBLIC_SHORTCUTS,
];

/** Totales del directorio: sustituyen a los rótulos tecleados («22 URLs»). */
export const ADMIN_DIRECTORY_TOTALS = {
  /** Filas totales del directorio (módulos + atajos). */
  entries: ADMIN_MODULE_DIRECTORY.length,
  /** Módulos reales bajo /admin. */
  adminModules: ADMIN_MODULE_DIRECTORY.filter((entry) => !entry.publicShortcut).length,
  /** Atajos a consolas públicas. */
  publicShortcuts: ADMIN_PUBLIC_SHORTCUTS.length,
  /** Categorías reales (una por pestaña maestra + atajos). */
  categories: Array.from(new Set(ADMIN_MODULE_DIRECTORY.map((entry) => entry.category))),
} as const;

/** ¿La ruta actual está registrada en el cockpit? (evita breadcrumbs mentirosos). */
export function isRegisteredAdminRoute(pathname: string): boolean {
  return getAdminBreadcrumb(pathname) !== null;
}

/** Entrada plana del buscador del cockpit (⌘K / Ctrl+K). */
export interface AdminSearchEntry extends AdminSubTab {
  tabId: string;
  tabTitle: string;
  /** Clave normalizada para búsqueda insensible a acentos y mayúsculas. */
  haystack: string;
}

/** Normaliza texto: minúsculas y sin diacríticos (búsqueda tolerante). */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Índice plano de navegación: una fila por módulo real del cockpit. */
export const ADMIN_SEARCH_INDEX: AdminSearchEntry[] = ADMIN_MASTER_TABS.flatMap((tab) =>
  tab.subTabs.map((sub) => ({
    ...sub,
    tabId: tab.id,
    tabTitle: tab.shortTitle,
    haystack: normalize(
      `${tab.title} ${tab.shortTitle} ${sub.name} ${sub.description} ${sub.href} ${sub.badge}`,
    ),
  })),
);

/**
 * Buscador del cockpit. Sin consulta devuelve los módulos de mayor prioridad
 * comercial (orden del SSOT) para que el panel nunca aparezca vacío.
 */
export function searchAdminNav(query: string, limit = 8): AdminSearchEntry[] {
  const term = normalize(query);
  if (term.length === 0) return ADMIN_SEARCH_INDEX.slice(0, limit);

  const tokens = term.split(/\s+/).filter((token) => token.length > 0);
  const scored: Array<{ entry: AdminSearchEntry; score: number }> = [];

  for (const entry of ADMIN_SEARCH_INDEX) {
    let score = 0;
    for (const token of tokens) {
      const inName = normalize(entry.name).includes(token);
      const inHref = entry.href.toLowerCase().includes(token);
      const inHaystack = entry.haystack.includes(token);
      if (!inName && !inHref && !inHaystack) {
        score = -1;
        break;
      }
      score += inName ? 3 : 0;
      score += inHref ? 2 : 0;
      score += inHaystack ? 1 : 0;
    }
    if (score > 0) scored.push({ entry, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.entry);
}

/** Pestaña maestra activa por ruta (coincidencia de prefijo más larga). */
export function getAdminTabByPathname(pathname: string): AdminMasterTab {
  const path = pathname.split('?')[0].split('#')[0];
  let match: { tab: AdminMasterTab; length: number } | null = null;

  for (const tab of ADMIN_MASTER_TABS) {
    for (const sub of tab.subTabs) {
      const isExact = path === sub.href;
      const isDescendant = sub.href !== '/admin' && path.startsWith(`${sub.href}/`);
      if (!isExact && !isDescendant) continue;
      if (match === null || sub.href.length > match.length) {
        match = { tab, length: sub.href.length };
      }
    }
  }

  if (match !== null) return match.tab;
  return ADMIN_MASTER_TABS[0];
}

/** Pestaña y módulo activos para breadcrumb unificado de página. */
export function getAdminBreadcrumb(
  pathname: string,
): { tab: AdminMasterTab; sub: AdminSubTab } | null {
  const path = pathname.split('?')[0].split('#')[0];
  let match: { tab: AdminMasterTab; sub: AdminSubTab; length: number } | null = null;

  for (const tab of ADMIN_MASTER_TABS) {
    for (const sub of tab.subTabs) {
      const isExact = path === sub.href;
      const isDescendant = sub.href !== '/admin' && path.startsWith(`${sub.href}/`);
      if (!isExact && !isDescendant) continue;
      if (match === null || sub.href.length > match.length) {
        match = { tab, sub, length: sub.href.length };
      }
    }
  }

  return match === null ? null : { tab: match.tab, sub: match.sub };
}
