import type { Metadata } from 'next';
import ControlDashboard from './ControlDashboard';

export const metadata: Metadata = {
    title: 'Panel de Control | EAR OS',
    description: 'Panel maestro segmentado de gestión de entidades EAR OS.',
    alternates: {
        canonical: '/admin/control',
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function ControlPage() {
    return <ControlDashboard />;
}