import { Music, Users, FileText, Calendar, TrendingUp, Tv, MessageSquare, FolderPlus, Settings, LayoutDashboard } from 'lucide-react';
export const LABEL_NAVIGATION = [
    {
        id: 'dashboard',
        label: 'Consola General',
        icon: LayoutDashboard,
        roles: ['super_admin', 'label_admin', 'artist_manager', 'viewer']
    },
    {
        id: 'artists',
        label: 'Roster Artistas',
        icon: Users,
        roles: ['super_admin', 'label_admin', 'artist_manager', 'viewer']
    },
    {
        id: 'releases',
        label: 'Catálogo Releases',
        icon: Music,
        roles: ['super_admin', 'label_admin', 'artist_manager', 'artist', 'viewer']
    },
    {
        id: 'contracts',
        label: 'Contratos Inteligentes',
        icon: FileText,
        roles: ['super_admin', 'label_admin', 'artist', 'viewer']
    },
    {
        id: 'schedule',
        label: 'Calendario y Giras',
        icon: Calendar,
        roles: ['super_admin', 'label_admin', 'artist_manager', 'artist', 'viewer']
    },
    {
        id: 'campaigns',
        label: 'Campañas y Prensa',
        icon: Tv,
        roles: ['super_admin', 'label_admin', 'artist_manager', 'viewer']
    },
    {
        id: 'analytics',
        label: 'Métricas y Streams',
        icon: TrendingUp,
        roles: ['super_admin', 'label_admin', 'artist_manager', 'artist', 'viewer']
    },
    {
        id: 'notes',
        label: 'Notas de Sala',
        icon: MessageSquare,
        roles: ['super_admin', 'label_admin', 'artist_manager', 'artist']
    },
    {
        id: 'uploads',
        label: 'Gestor de Assets',
        icon: FolderPlus,
        roles: ['super_admin', 'label_admin', 'artist_manager', 'artist']
    },
    {
        id: 'settings',
        label: 'Configuración',
        icon: Settings,
        roles: ['super_admin', 'label_admin', 'settings']
    }
];
