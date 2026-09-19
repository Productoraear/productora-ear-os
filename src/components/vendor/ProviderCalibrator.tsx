"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Save,
    RotateCcw,
    SlidersHorizontal,
    CheckCircle2,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import {
    getProviderDimensions,
    type CalibrationDimension,
    type DimensionValue,
    type ProviderCalibration
} from '@/lib/matching/calibratorTypes';
import {
    CALIBRATOR_PRESET_META,
    PRESET_MAP,
    type PresetSlug
} from '@/lib/matching/calibratorPresets';

interface ProviderCalibratorProps {
    providerId: string;
    providerName?: string;
    /** Si true, guarda como admin delegado */
    adminMode?: boolean;
}

const PILLAR_META: Array<{ pillar: number; label: string; icon: string }> = [
    { pillar: 11, label: 'Economía', icon: '💰' },
    { pillar: 12, label: 'Aforo', icon: '👥' },
    { pillar: 13, label: 'Infraestructura', icon: '🏛️' },
    { pillar: 14, label: 'Estilo', icon: '🎨' },
    { pillar: 15, label: 'Gastronomía', icon: '🍽️' },
    { pillar: 16, label: 'Fiesta', icon: '🎉' },
    { pillar: 17, label: 'Logística', icon: '🚗' },
    { pillar: 18, label: 'Acústica', icon: '🔊' },
    { pillar: 19, label: 'Calendario', icon: '📅' },
    { pillar: 20, label: 'Anti-Lead', icon: '🛡️' }
];

const EMPTY_DIMENSIONS: Record<number, DimensionValue> = {};

export default function ProviderCalibrator({
    providerId,
    providerName,
    adminMode = false
}: ProviderCalibratorProps) {
    const [dimensions, setDimensions] = useState<Record<number, DimensionValue>>(EMPTY_DIMENSIONS);
    const [presetSlug, setPresetSlug] = useState<PresetSlug>('cortijo-rural');
    const [activePillar, setActivePillar] = useState<number>(11);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedAt, setSavedAt] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const allProviderDims = useMemo(() => getProviderDimensions(), []);
    const activeDims = useMemo(
        () => allProviderDims.filter((d) => d.pillar === activePillar),
        [allProviderDims, activePillar]
    );

    const completionPercent = useMemo(() => {
        const filled = Object.keys(dimensions).filter((k) => {
            const v = dimensions[Number(k)];
            return v !== undefined && v !== null && v !== '';
        }).length;
        return Math.round((filled / 100) * 100);
    }, [dimensions]);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                const res = await fetch(`/api/calibrator/${encodeURIComponent(providerId)}`);
                if (!res.ok) throw new Error('No se pudo cargar el calibrador');
                const data = (await res.json()) as ProviderCalibration & { presetSlug?: PresetSlug };
                if (!mounted) return;
                setPresetSlug((data.presetSlug as PresetSlug) || 'cortijo-rural');
                setDimensions(data.dimensions ?? {});
                if (data.completedAt) setSavedAt(data.completedAt);
            } catch (e) {
                if (mounted) {
                    // Respaldo local con preset por defecto
                    const fallback = PRESET_MAP['cortijo-rural']!.dimensions ?? {};
                    setDimensions(fallback);
                    setError(null);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, [providerId]);

    const setValue = useCallback((id: number, value: DimensionValue) => {
        setDimensions((prev) => ({ ...prev, [id]: value }));
    }, []);

    const handlePresetChange = useCallback((slug: PresetSlug) => {
        setPresetSlug(slug);
        const preset = PRESET_MAP[slug]?.dimensions ?? {};
        setDimensions((prev) => ({ ...prev, ...preset }));
    }, []);

    const handleSave = useCallback(async () => {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch('/api/calibrator/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    providerId,
                    providerName,
                    presetSlug,
                    dimensions,
                    calibratedBy: adminMode ? 'admin' : 'self'
                })
            });
            if (!res.ok) throw new Error('Error guardando');
            setSavedAt(new Date().toISOString());
        } catch (e) {
            setError('No se pudo guardar el calibrador');
        } finally {
            setSaving(false);
        }
    }, [providerId, providerName, presetSlug, dimensions, adminMode]);

    const handleReset = useCallback(() => {
        setPresetSlug('cortijo-rural');
        setDimensions(PRESET_MAP['cortijo-rural']!.dimensions ?? {});
        setSavedAt(null);
    }, []);

    return (
        <div className="w-full rounded-3xl border border-white/10 bg-[#08080e]/90 backdrop-blur-xl overflow-hidden">
            {/* Cabecera del calibrador */}
            <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-[#0e0d0a] to-[#08080e]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#ecb613] uppercase tracking-widest font-black">
                            <SlidersHorizontal size={13} />
                            <span>Calibrador de Captación · 100 Dimensiones</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black font-syne text-white mt-1.5">
                            {providerName ?? 'Tu Finca'}
                        </h2>
                        <p className="text-xs text-zinc-400 font-light mt-0.5">
                            Solo te llegarán parejas que encajen con tu negocio.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono">
                        <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                            {completionPercent}/100 dims
                        </span>
                        <span className="px-3 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]">
                            {CALIBRATOR_PRESET_META.find((m) => m.slug === presetSlug)?.icon}{' '}
                            {CALIBRATOR_PRESET_META.find((m) => m.slug === presetSlug)?.name ?? presetSlug}
                        </span>
                        {savedAt && (
                            <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 size={11} /> Guardado
                            </span>
                        )}
                    </div>
                </div>

                {/* Selector de preset */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mr-1">
                        Preset:
                    </span>
                    {CALIBRATOR_PRESET_META.map((meta) => (
                        <button
                            key={meta.slug}
                            onClick={() => handlePresetChange(meta.slug)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-mono border transition-all ${presetSlug === meta.slug
                                ? 'bg-[#ecb613] text-black border-[#ecb613] font-bold'
                                : 'bg-white/5 border-white/10 text-zinc-300 hover:border-white/25'
                                }`}
                        >
                            {meta.icon} {meta.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabs de pilares */}
            <div className="flex flex-wrap gap-1.5 px-4 pt-4 border-b border-white/5 bg-black/30">
                {PILLAR_META.map((p) => (
                    <button
                        key={p.pillar}
                        onClick={() => setActivePillar(p.pillar)}
                        className={`px-3.5 py-2 rounded-t-xl text-[11px] font-mono transition-all ${activePillar === p.pillar
                            ? 'bg-[#0c0c14] border border-b-0 border-white/10 text-[#ecb613] font-bold'
                            : 'text-zinc-500 hover:text-zinc-200'
                            }`}
                    >
                        {p.icon} {p.label}
                    </button>
                ))}
            </div>

            {/* Contenido del pilar activo */}
            <div className="p-4 sm:p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-16 text-zinc-500 gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        <span className="text-sm font-mono">Cargando calibrador…</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeDims.map((dim) => (
                            <DimensionControl
                                key={dim.id}
                                dim={dim}
                                value={dimensions[dim.id]}
                                onChange={(v) => setValue(dim.id, v)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Acciones */}
            <div className="p-4 sm:p-6 border-t border-white/10 bg-black/30 flex flex-col sm:flex-row items-center justify-end gap-3">
                {error && (
                    <span className="text-[11px] font-mono text-rose-400 flex items-center gap-1 mr-auto">
                        <AlertTriangle size={12} /> {error}
                    </span>
                )}
                <button
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-2xl border border-white/10 text-xs font-mono text-zinc-300 hover:bg-white/5 transition-all flex items-center gap-2"
                >
                    <RotateCcw size={13} /> Restaurar Preset
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="px-5 py-2.5 rounded-2xl bg-[#ecb613] hover:bg-[#f6c737] text-black text-xs font-mono font-black transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {adminMode ? 'Guardar como Admin' : 'Guardar Calibración'}
                </button>
            </div>
        </div>
    );
}

function DimensionControl({
    dim,
    value,
    onChange
}: {
    dim: CalibrationDimension;
    value: DimensionValue;
    onChange: (v: DimensionValue) => void;
}) {
    const current =
        value === undefined || value === null ? dim.defaultValue : value;

    return (
        <div className="rounded-2xl border border-white/10 bg-[#0a0a12] p-4">
            <div className="flex items-start justify-between gap-2">
                <label className="text-xs text-zinc-300 font-medium leading-snug">
                    {dim.label}
                    {dim.isKnockout && (
                        <span className="ml-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400">
                            KNOCKOUT
                        </span>
                    )}
                </label>
                {dim.weight >= 2 && (
                    <span className="text-[9px] font-mono text-zinc-600 shrink-0">w{dim.weight}</span>
                )}
            </div>

            <div className="mt-3">
                {dim.type === 'toggle' && (
                    <button
                        onClick={() => onChange(!current)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${current ? 'bg-[#ecb613]' : 'bg-white/10'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${current ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                )}

                {dim.type === 'slider' && (
                    <div className="space-y-2">
                        <input
                            type="range"
                            min={dim.min}
                            max={dim.max}
                            step={dim.step ?? 1}
                            value={Number(current) || dim.min || 0}
                            onChange={(e) => onChange(Number(e.target.value))}
                            className="w-full accent-[#ecb613]"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                            <span>{dim.min}</span>
                            <span className="text-[#ecb613] font-bold">{current}</span>
                            <span>{dim.max}</span>
                        </div>
                    </div>
                )}

                {dim.type === 'scale' && (
                    <div className="flex gap-1.5">
                        {Array.from({ length: (dim.max ?? 5) - (dim.min ?? 1) + 1 }, (_, i) => {
                            const n = (dim.min ?? 1) + i;
                            const active = Number(current) >= n;
                            return (
                                <button
                                    key={n}
                                    onClick={() => onChange(n)}
                                    className={`h-8 w-8 rounded-lg text-xs font-mono font-bold transition-all ${active
                                        ? 'bg-[#ecb613] text-black'
                                        : 'bg-white/5 text-zinc-400 border border-white/10 hover:border-white/25'
                                        }`}
                                >
                                    {n}
                                </button>
                            );
                        })}
                    </div>
                )}

                {dim.type === 'select' && (
                    <select
                        value={String(current ?? '')}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full bg-[#0a0a12] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#ecb613] focus:outline-none"
                    >
                        {(dim.options ?? []).map((opt) => (
                            <option key={opt} value={opt} className="bg-[#0a0a12]">
                                {opt}
                            </option>
                        ))}
                    </select>
                )}

                {dim.type === 'multi-select' && (
                    <div className="flex flex-wrap gap-1.5">
                        {(dim.options ?? []).map((opt) => {
                            const arr = Array.isArray(current) ? current : [];
                            const selected = arr.includes(opt);
                            return (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const next = selected
                                            ? arr.filter((x) => x !== opt)
                                            : [...arr, opt];
                                        onChange(next);
                                    }}
                                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono border transition-all ${selected
                                        ? 'bg-[#ecb613]/15 border-[#ecb613]/50 text-[#ecb613]'
                                        : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/25'
                                        }`}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}