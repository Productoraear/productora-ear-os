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
  readonly href: string;
}

export const CONNECTORS: readonly ConnectorDef[] = Object.freeze([
  { id: 'CLIENTE', label: 'Cliente', summary: 'Contrata artistas, reserva fincas, alquila sonido o cotiza menús.', href: '/presupuesto' },
  { id: 'PROVEEDOR', label: 'Proveedor', summary: 'Vende fechas, cobra cachés con reparto soberano o alquila equipos.', href: '/portal/proveedor' },
  { id: 'AFILIADO', label: 'Afiliado', summary: 'Recomienda la plataforma y recibe comisión por cada contrato liquidado.', href: '/afiliados' },
  { id: 'MECENAS', label: 'Mecenas', summary: 'Canaliza aportaciones o patrocinios a VIMUME con balance de responsabilidad social.', href: '/vimume' },
  { id: 'SOCIO_ESTRATEGICO', label: 'Socio estratégico', summary: 'Alianza con exclusividad territorial de 100 km y canon anual de infraestructura.', href: '/fincas' },
]);

export type SectorId = 'PUBLICO' | 'HOSTELERIA' | 'ARTISTICO' | 'TECNICO' | 'COMPLEMENTARIO';
export type DoorId = 'gobiernos' | 'celebraciones' | 'profesionales';

export interface CategoryDef {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

export interface SectorDef {
  readonly id: SectorId;
  readonly label: string;
  readonly primaryDoor: DoorId;
  readonly categories: readonly CategoryDef[];
}

const c = (id: string, label: string, href: string): CategoryDef => ({ id, label, href });

export const ECOSYSTEM_SECTORS: readonly SectorDef[] = Object.freeze([
  {
    id: 'PUBLICO',
    label: 'Sector público e institucional',
    primaryDoor: 'gobiernos',
    categories: [
      c('ayuntamiento', 'Ayuntamientos (Festejos, Cultura, Juventud, Turismo)', '/ayuntamientos'),
      c('diputacion', 'Diputaciones, mancomunidades y gobiernos regionales', '/b2g'),
      c('fundacion-cultural', 'Fundaciones culturales, museos, casas regionales y consulados', '/vimume/b2g'),
      c('comision-fiestas', 'Comisiones de fiestas patronales y cofradías', '/ocasiones/ayuntamientos'),
    ],
  },
  {
    id: 'HOSTELERIA',
    label: 'Hostelería y espacios singulares',
    primaryDoor: 'celebraciones',
    categories: [
      c('asador-caserio', 'Asadores y caseríos tradicionales (parrilla y brasa)', '/otzarreta'),
      c('finca-palacete', 'Fincas señoriales, palacetes, bodegas y espacios con encanto', '/proveedores?cat=finca'),
      c('restaurante-banquetes', 'Restaurantes con salones de bodas y banquetes', '/proveedores?cat=catering'),
      c('sala-fiesta', 'Discotecas, salas de fiesta, clubes y terrazas de verano', '/fincas'),
      c('hotel-convenciones', 'Hoteles con centro de convenciones y salones de actos', '/proveedores?cat=finca'),
    ],
  },
  {
    id: 'ARTISTICO',
    label: 'Catálogo artístico y escénico',
    primaryDoor: 'celebraciones',
    categories: [
      c('solista-lirico', 'Solistas líricos y clásicos', '/artistas/edwin-agudelo'),
      c('folclorico', 'Formaciones folclóricas y tradicionales (mariachis)', '/centralita-mariachis'),
      c('orquesta-fiesta', 'Grandes orquestas de fiesta y de verbena', '/artistas/orquestas'),
      c('grupo-musical', 'Pop, rock, tributos, jazz, flamenco y música de cámara', '/proveedores?cat=musica'),
      c('espectaculo', 'Espectáculos infantiles, magia, teatro de calle y danza', '/artistas/shows'),
    ],
  },
  {
    id: 'TECNICO',
    label: 'Infraestructura técnica y eventos',
    primaryDoor: 'profesionales',
    categories: [
      c('sonido-suspendido', 'Sonorización y sistemas suspendidos para exteriores', '/alquiler-equipos-sonido-audiovisuales'),
      c('sonido-sala', 'Sonido de sala para baile y discotecas', '/proveedores?cat=sonido'),
      c('iluminacion', 'Iluminación robótica, puentes de luces y efectos', '/arsenal/luces-navidad'),
      c('pantallas-led', 'Pantallas LED de gran formato y proyección', '/alquiler-pantallas-led-madrid'),
      c('energia-escenarios', 'Generadores homologados, tarimas y escenarios certificados', '/arsenal'),
    ],
  },
  {
    id: 'COMPLEMENTARIO',
    label: 'Servicios complementarios de gala',
    primaryDoor: 'celebraciones',
    categories: [
      c('jamon-venencia', 'Cortadores de jamón y venenciadores', '/proveedores?cat=catering'),
      c('barras-recena', 'Barras de coctelería y carritos de recena', '/proveedores?cat=catering'),
      c('organizacion', 'Organizadores de eventos y bodas', '/proveedores?cat=wedding'),
      c('foto-video', 'Fotografía documental, drones y fotomatones', '/proveedores?cat=foto'),
      c('decoracion-carpas', 'Decoración floral y carpas climatizadas', '/proveedores?cat=decoracion'),
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
    subtitle: 'Gastronomía, música y calma para su día en las 52 provincias.',
    cta: 'Preparar mi celebración',
    points: [
      'Fincas, caseríos y asadores homologados por provincia',
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
