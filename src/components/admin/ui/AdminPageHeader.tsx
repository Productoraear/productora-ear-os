import type { ReactNode } from 'react';
import AdminBreadcrumb from '@/components/admin/ui/AdminBreadcrumb';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ADMIN PAGE HEADER — Cabecera única de página del cockpit (Server Component).
 * Compone el breadcrumb (hoja reactiva) con título, subtítulo y acciones.
 * Un solo header para las 32 pantallas: acaba con las cabeceras divergentes.
 * ═══════════════════════════════════════════════════════════════════════════════
 */
interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function AdminPageHeader({ title, subtitle, actions }: AdminPageHeaderProps) {
  return (
    <header className="mb-6">
      <AdminBreadcrumb />
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-sans text-xl font-bold tracking-tight text-white sm:text-2xl">
            {title}
          </h1>
          {subtitle ? <p className="mt-1 max-w-2xl text-sm text-zinc-400">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
