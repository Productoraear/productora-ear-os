export interface ArtistRoute {
  path: string;
  label: string;
  requiredRole?: 'super_admin' | 'label_admin' | 'artist_manager' | 'artist' | 'viewer';
  icon?: string;
}

export const PUBLIC_ARTIST_ROUTES: ArtistRoute[] = [
  { path: '/artistas', label: 'Roster de Artistas' },
  { path: '/artistas/eventos', label: 'Eventos' },
  { path: '/artistas/bodas', label: 'Bodas' },
  { path: '/artistas/ferias', label: 'Ferias & Fiestas' },
  { path: '/artistas/festivales', label: 'Festivales' },
  { path: '/artistas/ciudades', label: 'Ciudades' },
  { path: '/artistas/provincias', label: 'Provincias' },
  { path: '/artistas/municipios', label: 'Ayuntamientos' },
  { path: '/artistas/aniversarios', label: 'Aniversarios' },
  { path: '/artistas/cumpleaños', label: 'Cumpleaños' },
];

export const PRIVATE_ARTIST_ROUTES: ArtistRoute[] = [
  { path: '/artistas/dashboard', label: 'Dashboard Resumen', requiredRole: 'artist', icon: 'LayoutDashboard' },
  { path: '/artistas/profile', label: 'Perfil de Artista', requiredRole: 'artist', icon: 'User' },
  { path: '/artistas/media', label: 'Galería Media', requiredRole: 'artist', icon: 'Image' },
  { path: '/artistas/bio', label: 'Biografía Oficial', requiredRole: 'artist', icon: 'FileText' },
  { path: '/artistas/repertoire', label: 'Repertorio Musical', requiredRole: 'artist', icon: 'Music' },
  { path: '/artistas/bookings', label: 'Reserva & Directos', requiredRole: 'artist', icon: 'Calendar' },
  { path: '/artistas/contracts', label: 'Smart Contracts', requiredRole: 'artist', icon: 'FileCheck' },
  { path: '/artistas/pricing', label: 'Cachés & Paquetes', requiredRole: 'artist', icon: 'DollarSign' },
  { path: '/artistas/analytics', label: 'Streams & DSPs', requiredRole: 'artist', icon: 'TrendingUp' },
  { path: '/artistas/leads', label: 'Leads de Contratación', requiredRole: 'artist', icon: 'Mail' },
  { path: '/artistas/settings', label: 'Ajustes Cuenta', requiredRole: 'artist', icon: 'Settings' },
];

export const ROUTES: Record<string, string> = {
  home: '/',
  blog: '/blog',
  artistas: '/artistas',
  cotizador: '/cotizador',
  vimume: '/vimume',
  vimumeInvestigacion: '/vimume/investigacion',
  vimumeInversion: '/vimume/inversion',
  roadmap: '/roadmap',
  vimumeCentros: '/vimume/centros',
  vimumeEventos: '/vimume/eventos',
  vimumeNosotros: '/vimume/nosotros',
  vimumeFaq: '/vimume/faq',
  protocolo: '/vimume/protocolo',
  evidencia: '/vimume/evidencia',
  empresarios: '/empresarios',
  dossier: '/dossier',
  contacto: '/contacto',
  bodas: '/bodas',
  ayuntamientos: '/contratacion/ayuntamientos',
  login: '/login',
  nexus: '/nexus',
  dashboard: '/dashboard',
  marketplace: '/marketplace',
  privacidad: '/privacidad',
  terminos: '/terminos',
  legal: '/legal',
  cookies: '/cookies',
};
