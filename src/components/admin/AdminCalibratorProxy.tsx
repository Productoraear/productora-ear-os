"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import ProviderCalibrator from '@/components/vendor/ProviderCalibrator';

interface VendorItem {
    id: string;
    name?: string;
    companyName?: string;
    category?: string;
    province?: string;
}

interface AdminCalibratorProxyProps {
    initialVendors?: VendorItem[];
}

export default function AdminCalibratorProxy({ initialVendors = [] }: AdminCalibratorProxyProps) {
    const [vendors, setVendors] = useState<VendorItem[]>(initialVendors);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<VendorItem | null>(initialVendors[0] ?? null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (initialVendors.length > 0) {
            setLoading(false);
            return;
        }
        let mounted = true;
        async function load() {
            try {
                const res = await fetch('/api/vendors');
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const data = (await res.json()) as VendorItem[];
                if (!mounted) return;
                const normalized = data.map((v, i) => ({
                    id: v.id ?? `vendor-${i}`,
                    name: v.name ?? v.companyName ?? `Proveedor ${i + 1}`,
                    category: v.category ?? 'Finca',
                    province: v.province ?? 'España'
                }));
                setVendors(normalized);
                if (!selected) setSelected(normalized[0] ?? null);
            } catch (e) {
                console.error('[ADMIN-CALIBRATOR] Error cargando vendors:', e);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, [initialVendors, selected]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return vendors;
        return vendors.filter((v) =>
            `${v.name ?? ''} ${v.category ?? ''} ${v.province ?? ''}`.toLowerCase().includes(q)
        );
    }, [vendors, query]);

    return (
        <div className="w-full rounded-3xl border border-white/10 bg-[#06060a] overflow-hidden">
            {/* Cabecera */}
            <div className="p-5 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#ecb613] uppercase tracking-widest font-black">
                        <ShieldCheck size={13} />
                        <span>Gestión Delegada · EAR OS Admin</span>
                    </div>
                    <h2 className="text-xl font-black font-syne text-white mt-1.5">
                        Configura el calibrador de los proveedores
                    </h2>
                </div>

                <div className="relative w-full lg:w-80">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar proveedor…"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#ecb613]"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
                {/* Lista de proveedores */}
                <aside className="border-b lg:border-b-0 lg:border-r border-white/10 max-h-[300px] lg:max-h-none overflow-y-auto">
                    {loading ? (
                        <div className="p-6 text-xs font-mono text-zinc-600">Cargando proveedores…</div>
                    ) : (
                        <ul className="divide-y divide-white/5">
                            {filtered.slice(0, 50).map((v) => (
                                <li key={v.id}>
                                    <button
                                        onClick={() => setSelected(v)}
                                        className={`w-full text-left px-4 py-3 transition-colors ${selected?.id === v.id
                                                ? 'bg-[#ecb613]/10 border-l-2 border-[#ecb613]'
                                                : 'hover:bg-white/5 border-l-2 border-transparent'
                                            }`}
                                    >
                                        <span className="block text-xs font-bold text-white truncate">
                                            {v.name ?? v.companyName}
                                        </span>
                                        <span className="block text-[10px] font-mono text-zinc-500 truncate">
                                            {v.category ?? 'Finca'} · {v.province ?? 'España'}
                                        </span>
                                    </button>
                                </li>
                            ))}
                            {filtered.length === 0 && (
                                <li className="px-4 py-6 text-xs font-mono text-zinc-600">
                                    Sin resultados para «{query}»
                                </li>
                            )}
                        </ul>
                    )}
                </aside>

                {/* Calibrador delegado */}
                <section className="p-4 sm:p-6 bg-black/20">
                    {selected ? (
                        <ProviderCalibrator
                            key={selected.id}
                            providerId={selected.id}
                            providerName={selected.name ?? selected.companyName ?? 'Proveedor'}
                            adminMode
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-zinc-600 gap-3">
                            <SlidersHorizontal size={28} />
                            <p className="text-xs font-mono">Selecciona un proveedor para calibrarlo</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}