import type { Metadata } from 'next';
import { Suspense } from 'react';
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

function ControlDashboardSkeleton(): React.ReactElement {
    return (
        <div
            className="min-h-screen w-full bg-[#030305] p-6"
            aria-busy="true"
            aria-live="polite"
            role="status"
        >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <div className="h-10 w-64 animate-pulse rounded-md bg-white/5" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={`skeleton-card-${index}`}
                            className="h-28 animate-pulse rounded-xl border border-white/5 bg-white/[0.02]"
                        />
                    ))}
                </div>
                <div className="h-96 w-full animate-pulse rounded-xl border border-white/5 bg-white/[0.02]" />
            </div>
            <span className="sr-only">Cargando panel de control…</span>
        </div>
    );
}

export default function ControlPage(): React.ReactElement {
    return (
        <Suspense fallback={<ControlDashboardSkeleton />}>
            <ControlDashboard />
        </Suspense>
    );
}