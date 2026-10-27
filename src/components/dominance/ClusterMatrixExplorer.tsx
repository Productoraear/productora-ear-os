'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search, X } from 'lucide-react';

/** Acento cromático permitido (un solo color por vista). */
export type ClusterAccent = 'oro' | 'rubi' | 'cyan';

export interface ClusterMatrixItem {
    readonly id: string;
    readonly label: string;
    readonly href: string;
    readonly meta: string;
}

export interface ClusterMatrixGroup {
    readonly id: string;
    readonly label: string;
    readonly accent: ClusterAccent;
    readonly items: readonly ClusterMatrixItem[];
}

export interface ClusterMatrixExplorerProps {
    readonly groups: readonly ClusterMatrixGroup[];
    readonly searchPlaceholder: string;
    readonly allLabel: string;
    readonly emptyLabel: string;
}

const ACCENT_CLASSES: Readonly<Record<ClusterAccent, { chip: string; link: string }>> = {
    oro: {
        chip: 'data-[active=true]:bg-[#ecb613] data-[active=true]:text-black data-[active=true]:border-[#ecb613]',
        link: 'hover:border-[#ecb613]/60 hover:bg-[#ecb613]/[0.06]',
    },
    rubi: {
        chip: 'data-[active=true]:bg-[#FF2B44] data-[active=true]:text-black data-[active=true]:border-[#FF2B44]',
        link: 'hover:border-[#FF2B44]/60 hover:bg-[#FF2B44]/[0.06]',
    },
    cyan: {
        chip: 'data-[active=true]:bg-[#00E5FF] data-[active=true]:text-black data-[active=true]:border-[#00E5FF]',
        link: 'hover:border-[#00E5FF]/60 hover:bg-[#00E5FF]/[0.06]',
    },
};

const ACCENT_DOT: Readonly<Record<ClusterAccent, string>> = {
    oro: 'bg-[#ecb613]',
    rubi: 'bg-[#FF2B44]',
    cyan: 'bg-[#00E5FF]',
};

/**
 * Matriz navegable de un clúster de dominancia: búsqueda incremental + filtro
 * por vertical, sin dependencias externas y con foco accesible.
 */
export function ClusterMatrixExplorer({
    groups,
    searchPlaceholder,
    allLabel,
    emptyLabel,
}: ClusterMatrixExplorerProps): React.JSX.Element {
    const [query, setQuery] = useState('');
    const [activeGroup, setActiveGroup] = useState<string>('all');

    const normalizedQuery = query.trim().toLowerCase();

    const visibleGroups = useMemo(() => {
        return groups
            .filter((group) => activeGroup === 'all' || group.id === activeGroup)
            .map((group) => ({
                ...group,
                items: group.items.filter((item) => {
                    if (normalizedQuery.length === 0) {
                        return true;
                    }
                    return `${item.label} ${item.meta}`.toLowerCase().includes(normalizedQuery);
                }),
            }))
            .filter((group) => group.items.length > 0);
    }, [groups, activeGroup, normalizedQuery]);

    const matches = visibleGroups.reduce((total, group) => total + group.items.length, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-4 sm:p-6">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={searchPlaceholder}
                        aria-label={searchPlaceholder}
                        className="w-full rounded-2xl bg-black/40 border border-white/10 py-3 pl-11 pr-11 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-300 ease-out focus:border-[#ecb613]/60 focus:ring-2 focus:ring-[#ecb613]/20"
                    />
                    {query.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setQuery('')}
                            aria-label="Limpiar búsqueda"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 transition-colors hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        data-active={activeGroup === 'all'}
                        onClick={() => setActiveGroup('all')}
                        className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-gray-300 transition-all duration-300 ease-out hover:text-white data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-white"
                    >
                        {allLabel}
                    </button>
                    {groups.map((group) => (
                        <button
                            key={group.id}
                            type="button"
                            data-active={activeGroup === group.id}
                            onClick={() => setActiveGroup(group.id)}
                            className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-gray-300 transition-all duration-300 ease-out hover:text-white ${ACCENT_CLASSES[group.accent].chip}`}
                        >
                            <span className={`h-1.5 w-1.5 rounded-full ${ACCENT_DOT[group.accent]}`} />
                            {group.label}
                        </button>
                    ))}
                    <span className="ml-auto text-[11px] font-mono text-gray-500">
                        {matches} URLs
                    </span>
                </div>
            </div>

            {visibleGroups.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-gray-400">
                    {emptyLabel}
                </p>
            ) : (
                <div className="space-y-10">
                    {visibleGroups.map((group) => (
                        <section
                            key={group.id}
                            aria-labelledby={`group-${group.id}`}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <span className={`h-2 w-2 rounded-full ${ACCENT_DOT[group.accent]}`} />
                                <h3
                                    id={`group-${group.id}`}
                                    className="text-sm font-mono uppercase tracking-wider text-gray-300"
                                >
                                    {group.label}
                                </h3>
                                <span className="text-[11px] font-mono text-gray-600">
                                    {group.items.length}
                                </span>
                            </div>
                            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {group.items.map((item) => (
                                    <li key={item.id}>
                                        <Link
                                            href={item.href}
                                            className={`group flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 ${ACCENT_CLASSES[group.accent].link}`}
                                        >
                                            <span className="min-w-0 space-y-1">
                                                <span className="block truncate text-sm font-semibold text-white">
                                                    {item.label}
                                                </span>
                                                <span className="block truncate text-[11px] font-mono text-gray-500">
                                                    {item.meta}
                                                </span>
                                            </span>
                                            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-600 transition-colors duration-300 group-hover:text-white" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}
