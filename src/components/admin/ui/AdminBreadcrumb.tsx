"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAdminBreadcrumb } from '@/lib/config/admin-navigation';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ADMIN BREADCRUMB — Miga de pan única del cockpit, derivada del SSOT de
 * navegación (`getAdminBreadcrumb`). `use client` porque reacciona a la ruta.
 * 0 datos personales. Si la ruta no está registrada, no pinta nada (nunca una
 * miga mentirosa).
 * ═══════════════════════════════════════════════════════════════════════════════
 */
export default function AdminBreadcrumb() {
  const pathname = usePathname();
  const crumb = getAdminBreadcrumb(pathname);

  if (!crumb) return null;

  return (
    <nav aria-label="Miga de pan" className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-zinc-400">
      <Link href="/admin" className="text-zinc-500 transition-colors hover:text-[#ecb613]">
        Cockpit
      </Link>
      <span aria-hidden="true" className="text-zinc-700">
        /
      </span>
      <span className="text-zinc-400">{crumb.tab.shortTitle}</span>
      <span aria-hidden="true" className="text-zinc-700">
        /
      </span>
      <Link
        href={crumb.sub.href}
        aria-current="page"
        className="font-bold text-[#ecb613] transition-colors hover:text-[#ecb613]"
      >
        {crumb.sub.name}
      </Link>
    </nav>
  );
}
