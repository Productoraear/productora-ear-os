/**
 * ============================================================================
 * EAR OS · ARQUITECTURA SOBERANA DE LAS 12 SUPER-PANTALLAS (SINGLE-PAGE HUBS)
 * ============================================================================
 * Consolida las +180 rutas dispersas del repositorio y las 312 pantallas de
 * Google Stitch en 12 Centros Gravitacionales con pestañas internas reactivas.
 */

export interface CanonicalHubTab {
  readonly id: string;
  readonly label: string;
  readonly description: string;
}

export interface CanonicalHubDefinition {
  readonly number: number;
  readonly id: string;
  readonly route: string;
  readonly title: string;
  readonly block: 'PUBLIC_MARKETPLACE' | 'CONVERSION_B2G' | 'BACKOFFICE_INVESTORS';
  readonly summary: string;
  readonly absorbsRoutes: readonly string[];
  readonly tabs: readonly CanonicalHubTab[];
}

export const TWELVE_CANONICAL_HUBS: readonly CanonicalHubDefinition[] = [
  {
    number: 1,
    id: 'hub-home',
    route: '/',
    title: 'HUB 01 · Matrix Home & Buscador Semántico',
    block: 'PUBLIC_MARKETPLACE',
    summary: 'Puerta de entrada única con conmutador de temperatura de búsqueda y acceso directo a las 4 verticales.',
    absorbsRoutes: ['/', '/explorar', '/categorias', '/mapa-web'],
    tabs: [
      { id: 'all', label: 'Explorar Todo', description: 'Buscador universal multi-servicio' },
      { id: 'fincas', label: 'Bodas & Fincas', description: 'Espacios verificados y menús 2026' },
      { id: 'artistas', label: 'Artistas en Vivo', description: 'Solistas, mariachis, DJs y bandas' },
      { id: 'arsenal', label: 'Sonido & Arsenal', description: 'Bose F1, pantallas LED e iluminación' },
      { id: 'b2g', label: 'Ayuntamientos B2G', description: 'Contratos menores <14.250 € y VIMUME' },
    ],
  },
  {
    number: 2,
    id: 'hub-artistas',
    route: '/artistas',
    title: 'HUB 02 · Centralita & Catálogo Nacional de Artistas',
    block: 'PUBLIC_MARKETPLACE',
    summary: 'Contratación musical con caché transparente (suelo 350 €), cálculo de km y disponibilidad real.',
    absorbsRoutes: ['/mariachis', '/artists', '/serenatas', '/artistas/bodas', '/artistas/djs', '/artistas/orquestas'],
    tabs: [
      { id: 'catalogo', label: 'Catálogo por Provincia', description: 'Artistas verificados por zona' },
      { id: 'calculadora', label: 'Calculadora Caché + Km', description: '350 € base + 1,50 €/km desde km 50' },
      { id: 'repertorio', label: 'Audios & Repertorio', description: 'Escucha previa Hi-Fi e ISRC' },
      { id: 'disponibilidad', label: 'Semáforo de Fecha', description: 'Consulta atómica sin colisiones' },
    ],
  },
  {
    number: 3,
    id: 'hub-artista-ficha',
    route: '/artistas/edwin-agudelo',
    title: 'HUB 03 · Ficha Single-Page 360 del Artista',
    block: 'PUBLIC_MARKETPLACE',
    summary: 'Panel 360 individual con configurador por formato, reproductor Hi-Fi, ISRC y bloqueo con fianza de 100 €.',
    absorbsRoutes: ['/artistas/[slug]', '/artists/[slug]', '/centralita-mariachis/[slug]'],
    tabs: [
      { id: 'panel360', label: 'Panel 360 & Tarifas', description: 'Solista, dúo, trío o banda completa' },
      { id: 'media', label: 'Reproductor Hi-Fi & Vídeos', description: 'Audio real y muestra escénica' },
      { id: 'acustica', label: 'Rider Acústico 75dB', description: 'Cumplimiento Ley 37/2003 (12 W/pax)' },
      { id: 'reserva', label: 'Reserva 100 € / WhatsApp', description: 'Fianza deducible Stripe Price-Lock' },
    ],
  },
  {
    number: 4,
    id: 'hub-fincas',
    route: '/fincas',
    title: 'HUB 04 · Explorador Nacional de Fincas & Venues',
    block: 'PUBLIC_MARKETPLACE',
    summary: 'Espacios para bodas y galas con simulador de menús 2026 y certificación acústica anti-ruido.',
    absorbsRoutes: ['/fincas-landing', '/fincasparaboda', '/otzarreta', '/restaurante-otzarreta', '/bodas'],
    tabs: [
      { id: 'directorio', label: 'Mapa & Directorio', description: 'Fincas verificadas por provincia' },
      { id: 'menus', label: 'Simulador Menús 2026', description: 'Cálculo instantáneo por comensales' },
      { id: 'acustica', label: 'Homologación Acústica', description: 'Paz vecinal Ley 37/2003' },
      { id: 'b2b', label: 'Alianza Fincas B2B', description: 'Acuerdo simbiótico sin coste fijo' },
    ],
  },
  {
    number: 5,
    id: 'hub-proveedores',
    route: '/proveedores',
    title: 'HUB 05 · Super-Directorio Multiservicio & Arsenal',
    block: 'PUBLIC_MARKETPLACE',
    summary: 'Directorio unificado de catering, sonido, pantallas LED, fotografía, flores y transporte VIP.',
    absorbsRoutes: ['/alquiler', '/arsenal', '/proveedores-servicios', '/catering-de-brasas', '/arroces'],
    tabs: [
      { id: 'catering', label: 'Catering & Brasas', description: 'Gastronomía para eventos y bodas' },
      { id: 'sonido', label: 'Sonido, LED & Luces', description: 'Equipamiento técnico con montaje' },
      { id: 'foto', label: 'Foto & Vídeo', description: 'Cobertura documental y dron' },
      { id: 'transporte', label: 'Transporte VIP', description: 'Chófer privado y traslados de gala' },
    ],
  },
  {
    number: 6,
    id: 'hub-proveedor-ficha',
    route: '/proveedores/setroimagen-madrid',
    title: 'HUB 06 · Ficha Unificada de Proveedor (Slug Semántico)',
    block: 'PUBLIC_MARKETPLACE',
    summary: 'Ficha con slug semántico limpio (301 desde prov-XXXX), 3 vistas públicas y dossier completo vía WhatsApp.',
    absorbsRoutes: ['/proveedores/[slug]'],
    tabs: [
      { id: 'resumen', label: 'Resumen & 3 Fotos', description: 'Vista pública protegida (JUR-4)' },
      { id: 'simulador', label: 'Simulador de Precio', description: 'Cotización inmediata por pax' },
      { id: 'dossier', label: 'Dossier Completo WhatsApp', description: 'Desbloqueo por Centralita +34 693 693 048' },
      { id: 'reclamar', label: 'Reclamar Ficha Oficial', description: 'Verificación para el titular del negocio' },
    ],
  },
  {
    number: 7,
    id: 'hub-presupuesto',
    route: '/presupuesto',
    title: 'HUB 07 · Carrito Multi-Proveedor & Checkout 80/10/10',
    block: 'CONVERSION_B2G',
    summary: 'Pasarela unificada estilo Amazon: combina múltiples proveedores en un solo pago con Split 80/10/10.',
    absorbsRoutes: ['/checkout', '/calculadora', '/reservar', '/reservar/acuerdo', '/escaner-gratis'],
    tabs: [
      { id: 'seleccion', label: '1. Selección Multi-Servicio', description: 'Artista + Finca + Sonido + Flores' },
      { id: 'split', label: '2. Desglose 80/10/10', description: 'Reparto exacto en céntimos enteros' },
      { id: 'fianza', label: '3. Depósito 100 € / WhatsApp', description: 'Stripe Price-Lock 100% deducible' },
      { id: 'contrato', label: '4. Acuerdo Digital SHA-256', description: 'Resguardo formal con fecha bloqueada' },
    ],
  },
  {
    number: 8,
    id: 'hub-b2g',
    route: '/b2g',
    title: 'HUB 08 · Portal Ayuntamientos B2G & VIMUME 40Hz',
    block: 'CONVERSION_B2G',
    summary: 'Contratación pública menor (<14.250 € Art. 118 LCSP), festejos populares y neuroacústica senior VIMUME.',
    absorbsRoutes: ['/ayuntamientos', '/ayuntamientospremium', '/licitaciones', '/instituciones', '/vimume'],
    tabs: [
      { id: 'lcsp', label: 'Contratos Menores <14.250 €', description: 'Expediente directo CPV 92312000-1' },
      { id: 'festejos', label: 'Festejos & Sonómetro 75dB', description: 'Limitador telemático Ley 37/2003' },
      { id: 'vimume', label: 'VIMUME Neuroacústica 40Hz', description: 'Centros de mayores y SROI 4.85x' },
      { id: 'mecenazgo', label: 'Mecenazgo Ley 49/2002', description: 'Certificación RSC y deducción fiscal' },
    ],
  },
  {
    number: 9,
    id: 'hub-contacto',
    route: '/contacto',
    title: 'HUB 09 · Conserjería Omnicanal & Rescate SOS 24/7',
    block: 'CONVERSION_B2G',
    summary: 'Centralita única (+34 693 693 048), cobertura de urgencias de última hora y alta de socios.',
    absorbsRoutes: ['/sos-rescate', '/alianzas', '/afiliados', '/afiliado', '/reclamar-perfil'],
    tabs: [
      { id: 'centralita', label: 'Centralita +34 693 693 048', description: 'Respuesta humana y agente IA <5 min' },
      { id: 'sos', label: 'Rescate SOS Última Hora', description: 'Sustitución inmediata ante cancelaciones' },
      { id: 'socios', label: 'Alta Proveedores & Fincas', description: 'Integración en la red nacional' },
      { id: 'afiliados', label: 'Red de Prescriptores', description: 'Comisiones auditadas por reserva' },
    ],
  },
  {
    number: 10,
    id: 'hub-studio',
    route: '/studio/artist',
    title: 'HUB 10 · Career OS (Búnker 360 del Artista & Manager)',
    block: 'BACKOFFICE_INVESTORS',
    summary: 'Gestión integral de carrera musical: 29 plataformas, métricas en vivo, subidas ISRC y liquidaciones 80%.',
    absorbsRoutes: ['/studio', '/studio/artist/carrera', '/voicestudio', '/academia'],
    tabs: [
      { id: 'carrera', label: 'Mi Carrera en Vivo', description: 'Telemetría SSE y subida de masters' },
      { id: 'redes', label: 'Conexiones (29 Redes)', description: 'Spotify, YouTube, TikTok, Instagram, SGAE' },
      { id: 'catalogo', label: 'Catálogo ISRC & UPC', description: 'Registro fonográfico y splits' },
      { id: 'finanzas', label: 'Liquidaciones (80%)', description: 'Cobros netos y calendario de bolos' },
    ],
  },
  {
    number: 11,
    id: 'hub-vendor',
    route: '/vendor',
    title: 'HUB 11 · Portal Operativo B2B de Fincas y Proveedores',
    block: 'BACKOFFICE_INVESTORS',
    summary: 'Panel del proveedor para gestionar solicitudes filtradas, bloquear fechas y completar su ficha al 100%.',
    absorbsRoutes: ['/vendor/dashboard', '/vendor/calendar', '/vendor/escaparate', '/dashboard/proveedor'],
    tabs: [
      { id: 'leads', label: 'Solicitudes Verificadas', description: 'Leads con fecha y presupuesto filtrado' },
      { id: 'calendario', label: 'Calendario ACID', description: 'Bloqueo de disponibilidad sin colisiones' },
      { id: 'escaparate', label: 'Ficha 100% (Ayuda ?)', description: 'Asistente con copiar/pegar e hitos S-Class' },
      { id: 'liquidacion', label: 'Facturación SEPA', description: 'Liquidación directa en cuenta vinculada' },
    ],
  },
  {
    number: 12,
    id: 'hub-admin',
    route: '/admin/control',
    title: 'HUB 12 · Comandancia CEO & Data Room de Inversores',
    block: 'BACKOFFICE_INVESTORS',
    summary: 'Cuadro de mando institucional: Unit Economics, métricas Search Console, embudo Stripe y auditoría Ω-Rojo.',
    absorbsRoutes: ['/admin', '/admin/command-center', '/admin/telemetria', '/admin/tesoreria'],
    tabs: [
      { id: 'dataroom', label: 'Data Room 9 Cifras', description: 'CAC, LTV, conversión y simulador SEPA' },
      { id: 'gsc', label: 'Tráfico & Search Console', description: '79.516 impresiones y slugs semánticos' },
      { id: 'tesoreria', label: 'Tesorería 80/10/10', description: 'Conservación exacta en céntimos enteros' },
      { id: 'scorecard', label: 'Auditoría Ω-Diamante', description: 'Estado real de puertas y resiliencia' },
    ],
  },
] as const;

