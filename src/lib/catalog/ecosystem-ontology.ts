/**
 * EAR OS — ONTOLOGÍA UNIVERSAL DE CATEGORÍAS Y MATRIZ DE 5 CONECTORES
 * Fuente única para el enrutador frontal, los menús adaptativos y el alta de fichas.
 * No contiene precios: las tarifas viven exclusivamente en ear-os-ssot.ts (Zona Cero).
 */

export type ConnectorId = 'CLIENTE' | 'PROVEEDOR' | 'AFILIADO' | 'MECENAS' | 'SOCIO_ESTRATEGICO';

export interface ConnectorDef {
  readonly id: ConnectorId;
  readonly label: string;
  readonly summary: string;
}

export const CONNECTORS: readonly ConnectorDef[] = Object.freeze([
  { id: 'CLIENTE', label: 'Cliente', summary: 'Contrata artistas, reserva fincas, alquila sonido o cotiza menús.' },
  { id: 'PROVEEDOR', label: 'Proveedor', summary: 'Vende fechas, cobra cachés con reparto soberano o alquila equipos.' },
  { id: 'AFILIADO', label: 'Afiliado', summary: 'Recomienda la plataforma y recibe comisión por cada contrato liquidado.' },
  { id: 'MECENAS', label: 'Mecenas', summary: 'Canaliza aportaciones o patrocinios a VIMUME con balance de responsabilidad social.' },
  { id: 'SOCIO_ESTRATEGICO', label: 'Socio estratégico', summary: 'Alianza con exclusividad territorial de 100 km y canon anual de infraestructura.' },
]);

export type SectorId = 'PUBLICO' | 'HOSTELERIA' | 'ARTISTICO' | 'TECNICO' | 'COMPLEMENTARIO';
export type DoorId = 'gobiernos' | 'celebraciones' | 'profesionales';

export interface CategoryDef {
  readonly id: string;
  readonly label: string;
}

export interface SectorDef {
  readonly id: SectorId;
  readonly label: string;
  readonly primaryDoor: DoorId;
  readonly categories: readonly CategoryDef[];
}

const c = (id: string, label: string): CategoryDef => ({ id, label });

export const ECOSYSTEM_SECTORS: readonly SectorDef[] = Object.freeze([
  {
    id: 'PUBLICO',
    label: 'Sector público e institucional',
    primaryDoor: 'gobiernos',
    categories: [
      c('ayuntamiento', 'Ayuntamientos (Festejos, Cultura, Juventud, Turismo)'),
      c('diputacion', 'Diputaciones, mancomunidades y gobiernos regionales'),
      c('fundacion-cultural', 'Fundaciones culturales, museos, casas regionales y consulados'),
      c('comision-fiestas', 'Comisiones de fiestas patronales y cofradías'),
    ],
  },
  {
    id: 'HOSTELERIA',
    label: 'Hostelería y espacios singulares',
    primaryDoor: 'celebraciones',
    categories: [
      c('asador-caserio', 'Asadores y caseríos tradicionales (parrilla y brasa)'),
      c('finca-palacete', 'Fincas señoriales, palacetes, bodegas y espacios con encanto'),
      c('restaurante-banquetes', 'Restaurantes con salones de bodas y banquetes'),
      c('sala-fiesta', 'Discotecas, salas de fiesta, clubes y terrazas de verano'),
      c('hotel-convenciones', 'Hoteles con centro de convenciones y salones de actos'),
    ],
  },
  {
    id: 'ARTISTICO',
    label: 'Catálogo artístico y escénico',
    primaryDoor: 'celebraciones',
    categories: [
      c('solista-lirico', 'Solistas líricos y clásicos'),
      c('folclorico', 'Formaciones folclóricas y tradicionales (mariachis)'),
      c('orquesta-fiesta', 'Grandes orquestas de fiesta y de verbena'),
      c('grupo-musical', 'Pop, rock, tributos, jazz, flamenco y música de cámara'),
      c('espectaculo', 'Espectáculos infantiles, magia, teatro de calle y danza'),
    ],
  },
  {
    id: 'TECNICO',
    label: 'Infraestructura técnica y eventos',
    primaryDoor: 'profesionales',
    categories: [
      c('sonido-suspendido', 'Sonorización y sistemas suspendidos para exteriores'),
      c('sonido-sala', 'Sonido de sala para baile y discotecas'),
      c('iluminacion', 'Iluminación robótica, puentes de luces y efectos'),
      c('pantallas-led', 'Pantallas LED de gran formato y proyección'),
      c('energia-escenarios', 'Generadores homologados, tarimas y escenarios certificados'),
    ],
  },
  {
    id: 'COMPLEMENTARIO',
    label: 'Servicios complementarios de gala',
    primaryDoor: 'celebraciones',
    categories: [
      c('jamon-venencia', 'Cortadores de jamón y venenciadores'),
      c('barras-recena', 'Barras de coctelería y carritos de recena'),
      c('organizacion', 'Organizadores de eventos y bodas'),
      c('foto-video', 'Fotografía documental, drones y fotomatones'),
      c('decoracion-carpas', 'Decoración floral y carpas climatizadas'),
    ],
  },
]);

export interface DoorMenuItem {
  readonly label: string;
  readonly href: string;
}

export interface DoorDef {
  readonly id: DoorId;
  readonly href: string;
  readonly title: string;
  readonly subtitle: string;
  readonly cta: string;
  readonly points: readonly string[];
  readonly menu: readonly DoorMenuItem[];
}

export const DOORS: Readonly<Record<DoorId, DoorDef>> = Object.freeze({
  gobiernos: {
    id: 'gobiernos',
    href: '/gobiernos',
    title: 'Administración pública e instituciones',
    subtitle: 'Contratación menor con rigor administrativo.',
    cta: 'Entrar como institución',
    points: [
      'Contratos menores conforme al artículo 118 de la LCSP',
      'Facturación electrónica FACe',
      'Seguros y homologaciones técnicas',
    ],
    menu: [
      { label: 'Festejos patronales', href: '/gobiernos#festejos' },
      { label: 'Ciclos culturales', href: '/gobiernos#ciclos' },
      { label: 'Infraestructura', href: '/gobiernos#infraestructura' },
      { label: 'Pliego y contratación', href: '/gobiernos#pliego' },
    ],
  },
  celebraciones: {
    id: 'celebraciones',
    href: '/celebraciones',
    title: 'Celebraciones privadas y restauración',
    subtitle: 'Gastronomía, música y calma para su día.',
    cta: 'Preparar mi celebración',
    points: [
      'Restaurante Otzarreta, Derio (Bizkaia)',
      'Organizador digital de mesas y menús oficiales',
      'Reserva con fianza deducible',
    ],
    menu: [
      { label: 'Fincas y asador', href: '/celebraciones#fincas' },
      { label: 'Menús y mesas', href: '/celebraciones#menus' },
      { label: 'Música de gala', href: '/celebraciones#musica' },
      { label: 'Reserva con fianza', href: '/celebraciones#reserva' },
    ],
  },
  profesionales: {
    id: 'profesionales',
    href: '/profesionales',
    title: 'Profesionales, creadores y afiliados',
    subtitle: 'Cobro garantizado y alta en catálogo.',
    cta: 'Entrar como profesional',
    points: [
      'Alta de ficha en una o varias categorías',
      'Alquiler de sonido, iluminación y pantallas',
      'Red de afiliados con comisión recurrente',
    ],
    menu: [
      { label: 'Publicar ficha', href: '/profesionales#publicar' },
      { label: 'Red de afiliados', href: '/afiliados' },
      { label: 'Alquiler técnico', href: '/alquiler-equipos-sonido-audiovisuales' },
      { label: 'Panel de control', href: '/login' },
    ],
  },
});

export const DOOR_ORDER: readonly DoorId[] = Object.freeze(['gobiernos', 'celebraciones', 'profesionales']);
