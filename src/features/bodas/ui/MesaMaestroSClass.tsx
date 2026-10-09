'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Users,
    Armchair,
    Plus,
    Pencil,
    Trash2,
    Search,
    GripVertical,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    Printer,
    Wand2,
    LayoutGrid,
    List,
    X,
    Circle
} from 'lucide-react';

/* ─────────────────────────────── TIPOS ESTRICTOS ─────────────────────────────── */

type Edad = 'adulto' | 'nino' | 'bebe';
type Sexo = 'hombre' | 'mujer' | 'no-binario' | '';
type Confirmacion = 'confirmado' | 'pendiente' | 'declinado';
type MenuTipo = 'general' | 'infantil' | 'vegetariano' | 'vegano' | 'gluten-free' | 'halal' | 'kosher';
type MesaTipo = 'redonda' | 'rectangular' | 'presidencial' | 'cocktail';

interface Invitado {
    id: string;
    nombre: string;
    apellidos: string;
    acompanante: string;
    edad: Edad;
    sexo: Sexo;
    grupo: string;
    menu: MenuTipo;
    alergias: string;
    confirmacion: Confirmacion;
    mesaId: string | null;
}

interface Mesa {
    id: string;
    nombre: string;
    sillas: number;
    tipo: MesaTipo;
    x: number;
    y: number;
}

interface InvitadoDraft {
    nombre: string;
    apellidos: string;
    acompanante: string;
    edad: Edad;
    sexo: Sexo;
    grupo: string;
    menu: MenuTipo;
    alergias: string;
    confirmacion: Confirmacion;
}

interface MesaDraft {
    nombre: string;
    sillas: number;
    tipo: MesaTipo;
}

/* ─────────────────────────────── CONSTANTES & SEED ─────────────────────────────── */

const LS_INV = 'earos_mesas_invitados_v1';
const LS_MESAS = 'earos_mesas_mesas_v1';

const OPC_EDAD: { value: Edad; label: string }[] = [
    { value: 'adulto', label: 'Adulto' },
    { value: 'nino', label: 'Niño' },
    { value: 'bebe', label: 'Bebé' }
];

const OPC_SEXO: { value: Sexo; label: string }[] = [
    { value: '', label: 'Sin indicar' },
    { value: 'hombre', label: 'Hombre' },
    { value: 'mujer', label: 'Mujer' },
    { value: 'no-binario', label: 'No binario' }
];

const OPC_CONFIRM: { value: Confirmacion; label: string }[] = [
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'declinado', label: 'Declinado' }
];

const OPC_MENU: { value: MenuTipo; label: string }[] = [
    { value: 'general', label: 'Menú general' },
    { value: 'infantil', label: 'Infantil' },
    { value: 'vegetariano', label: 'Vegetariano' },
    { value: 'vegano', label: 'Vegano' },
    { value: 'gluten-free', label: 'Gluten free' },
    { value: 'halal', label: 'Halal' },
    { value: 'kosher', label: 'Kosher' }
];

const OPC_TIPO: { value: MesaTipo; label: string }[] = [
    { value: 'redonda', label: 'Redonda' },
    { value: 'rectangular', label: 'Rectangular' },
    { value: 'presidencial', label: 'Presidencial' },
    { value: 'cocktail', label: 'Cóctel' }
];

const MENU_COLOR: Record<MenuTipo, string> = {
    general: 'text-white/70 border-white/10 bg-white/5',
    infantil: 'text-cyan-300 border-cyan-400/30 bg-cyan-400/10',
    vegetariano: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
    vegano: 'text-emerald-200 border-emerald-300/30 bg-emerald-300/10',
    'gluten-free': 'text-amber-300 border-amber-400/30 bg-amber-400/10',
    halal: 'text-fuchsia-300 border-fuchsia-400/30 bg-fuchsia-400/10',
    kosher: 'text-sky-300 border-sky-400/30 bg-sky-400/10'
};

const CONFIRM_COLOR: Record<Confirmacion, string> = {
    confirmado: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
    pendiente: 'text-amber-300 border-amber-400/30 bg-amber-400/10',
    declinado: 'text-rose-300 border-rose-400/30 bg-rose-400/10'
};

const EDAD_LABEL: Record<Edad, string> = { adulto: 'Adulto', nino: 'Niño', bebe: 'Bebé' };

const SEED_MESAS: Mesa[] = [
    { id: 'm1', nombre: 'Presidencial', sillas: 2, tipo: 'presidencial', x: 50, y: 28 },
    { id: 'm2', nombre: 'Mesa 2', sillas: 8, tipo: 'redonda', x: 25, y: 72 },
    { id: 'm3', nombre: 'Mesa 3', sillas: 8, tipo: 'redonda', x: 75, y: 72 }
];

const SEED_INVITADOS: Invitado[] = [
    { id: 'i1', nombre: 'Edwin', apellidos: 'Agudelo', acompanante: '', edad: 'adulto', sexo: 'hombre', grupo: 'Novios', menu: 'general', alergias: '', confirmacion: 'confirmado', mesaId: 'm1' },
    { id: 'i2', nombre: 'Adri', apellidos: '', acompanante: '', edad: 'adulto', sexo: 'mujer', grupo: 'Novios', menu: 'general', alergias: '', confirmacion: 'confirmado', mesaId: 'm1' }
];

const EMPTY_DRAFT: InvitadoDraft = {
    nombre: '',
    apellidos: '',
    acompanante: '',
    edad: 'adulto',
    sexo: '',
    grupo: '',
    menu: 'general',
    alergias: '',
    confirmacion: 'pendiente'
};

function uid(prefix: string): string {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function loadJSON<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function mesaColor(ocupados: number, sillas: number): string {
    if (ocupados > sillas) return 'border-[#FF2B44] shadow-[0_0_30px_rgba(255,43,68,0.35)]';
    if (ocupados === sillas) return 'border-[#ecb613] shadow-[0_0_30px_rgba(236,182,19,0.35)]';
    return 'border-white/15';
}

function mesaSize(m: Mesa): number {
    return Math.min(96 + m.sillas * 7, 172);
}

/* ─────────────────────────────── COMPONENTE ─────────────────────────────── */

export default function MesaMaestroSClass() {
    const [invitados, setInvitados] = useState<Invitado[]>(() => loadJSON<Invitado[]>(LS_INV, SEED_INVITADOS));
    const [mesas, setMesas] = useState<Mesa[]>(() => loadJSON<Mesa[]>(LS_MESAS, SEED_MESAS));
    const [view, setView] = useState<'plano' | 'lista'>('plano');
    const [search, setSearch] = useState('');
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    const [invModal, setInvModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
    const [mesaModal, setMesaModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
    const [invDraft, setInvDraft] = useState<InvitadoDraft>(EMPTY_DRAFT);
    const [mesaDraft, setMesaDraft] = useState<MesaDraft>({ nombre: '', sillas: 8, tipo: 'redonda' });

    const canvasRef = useRef<HTMLDivElement>(null);
    const dragMesaRef = useRef<{ id: string; dx: number; dy: number } | null>(null);

    useEffect(() => {
        localStorage.setItem(LS_INV, JSON.stringify(invitados));
    }, [invitados]);

    useEffect(() => {
        localStorage.setItem(LS_MESAS, JSON.stringify(mesas));
    }, [mesas]);

    /* ── Métricas derivadas ── */
    const metrics = useMemo(() => {
        const total = invitados.length;
        const sentados = invitados.filter((i) => i.mesaId).length;
        const sinSentar = total - sentados;
        const capacidad = mesas.reduce((acc, m) => acc + m.sillas, 0);
        const confirmados = invitados.filter((i) => i.confirmacion === 'confirmado').length;
        const sobreMesas = mesas.filter((m) => invitados.filter((i) => i.mesaId === m.id).length > m.sillas).length;

        const grupoMesas = new Map<string, Set<string>>();
        invitados.forEach((i) => {
            if (!i.grupo || !i.mesaId) return;
            const set = grupoMesas.get(i.grupo) ?? new Set<string>();
            set.add(i.mesaId);
            grupoMesas.set(i.grupo, set);
        });
        const gruposSeparados = [...grupoMesas.entries()]
            .filter(([, mesasSet]) => mesasSet.size > 1)
            .map(([grupo]) => grupo);

        return {
            total,
            sentados,
            sinSentar,
            capacidad,
            confirmados,
            sobreMesas,
            gruposSeparados,
            ocupacionPct: capacidad > 0 ? Math.round((sentados / capacidad) * 100) : 0
        };
    }, [invitados, mesas]);

    const invitadosDe = (mesaId: string): Invitado[] => invitados.filter((i) => i.mesaId === mesaId);

    const clear = () => {
        setInvitados(SEED_INVITADOS);
        setMesas(SEED_MESAS);
    };

    /* ── Gestión de invitados ── */
    function openInv(id: string | null) {
        if (id) {
            const i = invitados.find((x) => x.id === id);
            if (i) {
                setInvDraft({
                    nombre: i.nombre,
                    apellidos: i.apellidos,
                    acompanante: i.acompanante,
                    edad: i.edad,
                    sexo: i.sexo,
                    grupo: i.grupo,
                    menu: i.menu,
                    alergias: i.alergias,
                    confirmacion: i.confirmacion
                });
            }
        } else {
            setInvDraft(EMPTY_DRAFT);
        }
        setInvModal({ open: true, id });
    }

    function saveInv() {
        if (invDraft.nombre.trim().length < 2) return;
        if (invModal.id) {
            setInvitados((prev) =>
                prev.map((i) =>
                    i.id === invModal.id
                        ? { ...i, ...invDraft, nombre: invDraft.nombre.trim(), apellidos: invDraft.apellidos.trim() }
                        : i
                )
            );
        } else {
            setInvitados((prev) => [
                ...prev,
                {
                    id: uid('inv'),
                    ...invDraft,
                    nombre: invDraft.nombre.trim(),
                    apellidos: invDraft.apellidos.trim(),
                    acompanante: invDraft.acompanante.trim(),
                    grupo: invDraft.grupo.trim(),
                    mesaId: null
                }
            ]);
        }
        setInvModal({ open: false, id: null });
    }

    function deleteInv(id: string) {
        setInvitados((prev) => prev.filter((i) => i.id !== id));
    }

    /* ── Gestión de mesas ── */
    function openMesa(id: string | null) {
        if (id) {
            const m = mesas.find((x) => x.id === id);
            if (m) setMesaDraft({ nombre: m.nombre, sillas: m.sillas, tipo: m.tipo });
        } else {
            setMesaDraft({ nombre: '', sillas: 8, tipo: 'redonda' });
        }
        setMesaModal({ open: true, id });
    }

    function saveMesa() {
        if (mesaDraft.nombre.trim().length < 1) return;
        if (mesaModal.id) {
            setMesas((prev) =>
                prev.map((m) => (m.id === mesaModal.id ? { ...m, ...mesaDraft, nombre: mesaDraft.nombre.trim() } : m))
            );
        } else {
            setMesas((prev) => [
                ...prev,
                {
                    id: uid('mesa'),
                    nombre: mesaDraft.nombre.trim(),
                    sillas: mesaDraft.sillas,
                    tipo: mesaDraft.tipo,
                    x: 20 + Math.random() * 60,
                    y: 20 + Math.random() * 60
                }
            ]);
        }
        setMesaModal({ open: false, id: null });
    }

    function deleteMesa(id: string) {
        setMesas((prev) => prev.filter((m) => m.id !== id));
        setInvitados((prev) => prev.map((i) => (i.mesaId === id ? { ...i, mesaId: null } : i)));
    }

    /* ── Drag & Drop invitados → mesas ── */
    function onDragStart(e: React.DragEvent<HTMLDivElement>, id: string) {
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'move';
    }

    function onDropOnMesa(e: React.DragEvent<HTMLDivElement>, mesaId: string) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        setDragOverId(null);
        if (id) setInvitados((prev) => prev.map((i) => (i.id === id ? { ...i, mesaId } : i)));
    }

    function unassign(id: string) {
        setInvitados((prev) => prev.map((i) => (i.id === id ? { ...i, mesaId: null } : i)));
    }

    /* ── Drag mesas en el plano ── */
    function onMesaPointerDown(e: React.PointerEvent<HTMLDivElement>, mesa: Mesa) {
        if (e.button !== 0) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const xPct = ((e.clientX - rect.left) / rect.width) * 100;
        const yPct = ((e.clientY - rect.top) / rect.height) * 100;
        dragMesaRef.current = { id: mesa.id, dx: xPct - mesa.x, dy: yPct - mesa.y };
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    }

    function onMesaPointerMove(e: React.PointerEvent<HTMLDivElement>) {
        const dr = dragMesaRef.current;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!dr || !rect) return;
        const x = ((e.clientX - rect.left) / rect.width) * 100 - dr.dx;
        const y = ((e.clientY - rect.top) / rect.height) * 100 - dr.dy;
        const clampedX = Math.max(5, Math.min(95, x));
        const clampedY = Math.max(8, Math.min(92, y));
        setMesas((prev) => prev.map((m) => (m.id === dr.id ? { ...m, x: clampedX, y: clampedY } : m)));
    }

    function onMesaPointerUp() {
        dragMesaRef.current = null;
    }

    /* ── Auto-asignación inteligente ── */
    function autoAsignar() {
        const work = invitados.map((i) => ({ ...i }));
        const occ = (m: Mesa) => work.filter((i) => i.mesaId === m.id).length;
        const freeOf = (m: Mesa) => m.sillas - occ(m);
        const unassigned = work.filter((i) => !i.mesaId);

        const byGrupo = new Map<string, string[]>();
        const singles: string[] = [];
        unassigned.forEach((i) => {
            if (i.grupo) {
                const arr = byGrupo.get(i.grupo) ?? [];
                arr.push(i.id);
                byGrupo.set(i.grupo, arr);
            } else {
                singles.push(i.id);
            }
        });

        const clusters = [...byGrupo.values()].sort((a, b) => b.length - a.length);
        const assign = (ids: string[], mesaId: string | null) => {
            ids.forEach((id) => {
                const g = work.find((x) => x.id === id);
                if (g) g.mesaId = mesaId;
            });
        };

        clusters.forEach((ids) => {
            const fit = mesas.find((m) => freeOf(m) >= ids.length);
            if (fit) {
                assign(ids, fit.id);
                return;
            }
            let rem = [...ids];
            for (const m of [...mesas].sort((a, b) => freeOf(a) - freeOf(b))) {
                if (!rem.length) break;
                const space = freeOf(m);
                if (space <= 0) continue;
                const take = rem.slice(0, space);
                assign(take, m.id);
                rem = rem.slice(space);
            }
        });

        singles.forEach((id) => {
            const m = [...mesas].sort((a, b) => freeOf(a) - freeOf(b)).find((x) => freeOf(x) > 0);
            if (m) assign([id], m.id);
        });

        setInvitados(work);
    }

    /* ── Filtrado búsqueda ── */
    const q = search.trim().toLowerCase();
    const sinSentar = invitados.filter((i) => !i.mesaId);
    const filtrados = q
        ? invitados.filter((i) => `${i.nombre} ${i.apellidos} ${i.grupo}`.toLowerCase().includes(q))
        : invitados;

    function renderInvitadoChip(i: Invitado, droppable: boolean) {
        return (
            <div
                key={i.id}
                draggable={droppable}
                onDragStart={droppable ? (e) => onDragStart(e, i.id) : undefined}
                className={`group flex items-center gap-2 px-3 py-2 rounded-xl border bg-[#0c0a0e] ${CONFIRM_COLOR[i.confirmacion]} ${droppable ? 'cursor-grab active:cursor-grabbing' : ''} transition-all hover:border-[#ecb613]/50`}
            >
                <div className="w-2 h-2 rounded-full bg-[#ecb613] group-hover:animate-pulse" />
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                        {i.nombre} {i.apellidos}
                    </p>
                    <p className="text-[10px] font-mono text-white/40 truncate">
                        {EDAD_LABEL[i.edad]}
                        {i.grupo ? ` · ${i.grupo}` : ''}
                        {i.alergias ? ' · ⚠' : ''}
                    </p>
                </div>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${MENU_COLOR[i.menu]}`}>{i.menu}</span>
                {i.mesaId && (
                    <button
                        onClick={() => unassign(i.id)}
                        className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-[#FF2B44] transition-all"
                        title="Quitar de la mesa"
                    >
                        <X size={13} />
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* ─── Toolbar ─── */}
            <div className="flex flex-wrap items-center gap-3 mb-6 print:hidden">
                <div className="flex items-center gap-2 flex-1 min-w-[220px] bg-[#0c0a0e] border border-white/10 rounded-2xl px-4 py-3">
                    <Search size={16} className="text-[#ecb613]" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar invitado o grupo…"
                        className="bg-transparent outline-none text-sm text-white w-full placeholder:text-white/30"
                    />
                </div>

                <button
                    onClick={() => openMesa(null)}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#ecb613] to-[#f5d77f] hover:from-white hover:to-white text-black font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-[1.02] shadow-[0_8px_25px_rgba(236,182,19,0.3)]"
                >
                    <Plus size={15} /> Mesa
                </button>
                <button
                    onClick={() => openInv(null)}
                    className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
                >
                    <Plus size={15} /> Invitado
                </button>
                <button
                    onClick={autoAsignar}
                    className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-[#ecb613] hover:text-black border border-white/15 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
                    title="Reparte invitados automáticamente manteniendo grupos juntos"
                >
                    <Wand2 size={15} /> Auto-sentar
                </button>
                <button
                    onClick={() => window.print()}
                    className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
                >
                    <Printer size={15} /> PDF
                </button>
                <div className="inline-flex bg-[#0c0a0e] border border-white/10 rounded-2xl p-1">
                    <button
                        onClick={() => setView('plano')}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${view === 'plano' ? 'bg-[#ecb613] text-black' : 'text-white/50 hover:text-white'}`}
                    >
                        <LayoutGrid size={13} /> Plano
                    </button>
                    <button
                        onClick={() => setView('lista')}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${view === 'lista' ? 'bg-[#ecb613] text-black' : 'text-white/50 hover:text-white'}`}
                    >
                        <List size={13} /> Lista
                    </button>
                </div>
            </div>

            {/* ─── Métricas ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                <Metrica icon={<Users size={16} />} label="Invitados" value={metrics.total} accent="text-[#ecb613]" />
                <Metrica icon={<CheckCircle2 size={16} />} label="Confirmados" value={metrics.confirmados} accent="text-emerald-300" />
                <Metrica icon={<Armchair size={16} />} label="Capacidad" value={metrics.capacidad} accent="text-cyan-300" />
                <Metrica icon={<Circle size={16} />} label="Ocupación" value={`${metrics.ocupacionPct}%`} accent="text-[#ecb613]" />
                <Metrica
                    icon={<AlertTriangle size={16} />}
                    label="Sin sentar"
                    value={metrics.sinSentar}
                    accent={metrics.sinSentar === 0 ? 'text-emerald-300' : 'text-[#FF2B44]'}
                />
            </div>

            {/* ─── Alertas de conflicto ─── */}
            {(metrics.sobreMesas > 0 || metrics.gruposSeparados.length > 0) && (
                <div className="mb-6 space-y-2 print:hidden">
                    {metrics.sobreMesas > 0 && (
                        <div className="flex items-center gap-2 text-xs font-bold text-[#FF2B44] bg-[#FF2B44]/10 border border-[#FF2B44]/30 rounded-xl px-4 py-3">
                            <AlertTriangle size={15} /> {metrics.sobreMesas} mesa(s) con sobrecapacidad
                        </div>
                    )}
                    {metrics.gruposSeparados.length > 0 && (
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-3">
                            <Sparkles size={15} /> Grupos separados: {metrics.gruposSeparados.join(', ')}
                        </div>
                    )}
                </div>
            )}

            {/* ─── Contenido principal ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
                {/* Panel sin sentar */}
                <div className="rounded-3xl bg-[#0a080b] border border-white/10 p-5 space-y-3 print:hidden">
                    <div className="flex items-center justify-between">
                        <h3 className="font-syne font-black text-sm uppercase tracking-wider text-white flex items-center gap-2">
                            <GripVertical size={14} className="text-[#ecb613]" /> Sin sentar
                        </h3>
                        <span className="text-[10px] font-mono text-white/40">{sinSentar.length}</span>
                    </div>
                    {sinSentar.length === 0 ? (
                        <p className="text-xs text-white/35">Todos los invitados están asignados. 🎉</p>
                    ) : (
                        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                            {sinSentar.map((i) => renderInvitadoChip(i, true))}
                        </div>
                    )}
                    <p className="text-[10px] font-mono text-white/30 pt-1 border-t border-white/5">
                        Arrastra un invitado hasta una mesa para sentarlo.
                    </p>
                </div>

                {/* Plano / Lista */}
                {view === 'plano' ? (
                    <div
                        ref={canvasRef}
                        className="relative aspect-[16/10] min-h-[420px] rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_center,rgba(236,182,19,0.06),transparent_65%)] overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
                        {mesas.map((m) => {
                            const ocupados = invitadosDe(m.id).length;
                            const size = mesaSize(m);
                            const color = mesaColor(ocupados, m.sillas);
                            const isRound = m.tipo === 'redonda' || m.tipo === 'cocktail';
                            const names = invitadosDe(m.id).map((i) => i.nombre);

                            return (
                                <div
                                    key={m.id}
                                    data-mesa={m.id}
                                    onPointerDown={(e) => onMesaPointerDown(e, m)}
                                    onPointerMove={onMesaPointerMove}
                                    onPointerUp={onMesaPointerUp}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragOverId(m.id);
                                    }}
                                    onDragLeave={() => setDragOverId((cur) => (cur === m.id ? null : cur))}
                                    onDrop={(e) => onDropOnMesa(e, m.id)}
                                    className={`absolute -translate-x-1/2 -translate-y-1/2 border-2 ${color} ${isRound ? 'rounded-full' : 'rounded-2xl'} bg-[#0e0c10]/90 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300 cursor-move select-none ${dragOverId === m.id ? 'ring-2 ring-[#ecb613] scale-105' : ''
                                        }`}
                                    style={{ left: `${m.x}%`, top: `${m.y}%`, width: size, height: isRound ? size : size * 0.7 }}
                                >
                                    <p className="font-syne font-black text-xs text-[#ecb613] uppercase tracking-wider truncate max-w-[90%]">{m.nombre}</p>
                                    <p className="font-mono text-[10px] text-white/50">
                                        {ocupados}/{m.sillas}
                                    </p>
                                    {isRound && names.length > 0 && (
                                        <div className="flex -space-x-1.5 mt-0.5">
                                            {names.slice(0, 4).map((n, idx) => (
                                                <span key={idx} className="w-4 h-4 rounded-full bg-[#ecb613]/25 border border-[#ecb613]/50 text-[7px] grid place-items-center text-[#ecb613]">
                                                    {n.charAt(0).toUpperCase()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-2 -right-2 flex gap-1 print:hidden">
                                        <button onClick={() => openMesa(m.id)} className="w-6 h-6 rounded-full bg-[#ecb613] text-black grid place-items-center transition-all hover:scale-110">
                                            <Pencil size={11} />
                                        </button>
                                        <button onClick={() => deleteMesa(m.id)} className="w-6 h-6 rounded-full bg-[#FF2B44] text-white grid place-items-center transition-all hover:scale-110">
                                            <Trash2 size={11} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-3xl bg-[#0a080b] border border-white/10 p-5 space-y-6">
                        {mesas.map((m) => {
                            const lista = invitadosDe(m.id).filter((i) => `${i.nombre} ${i.apellidos}`.toLowerCase().includes(q) || !q);
                            return (
                                <div key={m.id}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-syne font-black text-sm uppercase text-white">
                                            {m.nombre} <span className="font-mono text-[#ecb613]">({lista.length}/{m.sillas})</span>
                                        </h3>
                                        <div className="flex gap-1 print:hidden">
                                            <button onClick={() => openMesa(m.id)} className="text-white/40 hover:text-[#ecb613]"><Pencil size={14} /></button>
                                            <button onClick={() => deleteMesa(m.id)} className="text-white/40 hover:text-[#FF2B44]"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {lista.length ? lista.map((i) => renderInvitadoChip(i, false)) : <p className="text-xs text-white/30 col-span-full">Sin invitados</p>}
                                    </div>
                                </div>
                            );
                        })}

                        <div>
                            <h3 className="font-syne font-black text-sm uppercase text-white mb-2">Sin sentar ({sinSentar.filter((i) => `${i.nombre} ${i.apellidos}`.toLowerCase().includes(q) || !q).length})</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {sinSentar.filter((i) => `${i.nombre} ${i.apellidos}`.toLowerCase().includes(q) || !q).map((i) => renderInvitadoChip(i, true))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ─── Lista maestra de invitados (gestión) ─── */}
            <div className="mt-6 rounded-3xl bg-[#0a080b] border border-white/10 p-5 print:hidden">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-syne font-black text-sm uppercase tracking-wider text-white">Directorio de invitados · {invitados.length}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                    {filtrados.map((i) => (
                        <div key={i.id} className="group flex items-center gap-3 px-3 py-2 rounded-xl border border-white/5 bg-[#0c0a0e] hover:border-[#ecb613]/40 transition-all">
                            <div className="w-9 h-9 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/20 grid place-items-center text-[#ecb613] font-bold text-xs uppercase">
                                {(i.nombre.charAt(0) + (i.apellidos?.charAt(0) ?? '')).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white truncate">
                                    {i.nombre} {i.apellidos}
                                </p>
                                <p className="text-[10px] font-mono text-white/40 truncate">
                                    {i.mesaId ? mesas.find((m) => m.id === i.mesaId)?.nombre ?? '—' : 'Sin sentar'}
                                    {i.grupo ? ` · ${i.grupo}` : ''}
                                </p>
                            </div>
                            {i.alergias && <span className="text-[10px] text-amber-300" title={i.alergias}>⚠</span>}
                            <button onClick={() => openInv(i.id)} className="text-white/40 hover:text-[#ecb613] transition-all"><Pencil size={14} /></button>
                            <button onClick={() => deleteInv(i.id)} className="text-white/40 hover:text-[#FF2B44] transition-all"><Trash2 size={14} /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── Modal invitado ─── */}
            {invModal.open && (
                <div className="fixed inset-0 z-[200] grid place-items-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setInvModal({ open: false, id: null })}>
                    <div className="w-full max-w-md rounded-3xl bg-[#0a080b] border border-white/15 p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-syne font-black text-lg uppercase text-white">{invModal.id ? 'Editar invitado' : 'Nuevo invitado'}</h3>
                            <button onClick={() => setInvModal({ open: false, id: null })} className="text-white/40 hover:text-white"><X size={18} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Campo label="Nombre *">
                                <input className="input-base" value={invDraft.nombre} onChange={(e) => setInvDraft({ ...invDraft, nombre: e.target.value })} placeholder="Nombre" />
                            </Campo>
                            <Campo label="Apellidos">
                                <input className="input-base" value={invDraft.apellidos} onChange={(e) => setInvDraft({ ...invDraft, apellidos: e.target.value })} placeholder="Apellidos" />
                            </Campo>
                        </div>
                        <Campo label="Acompañante (pareja)">
                            <input className="input-base" value={invDraft.acompanante} onChange={(e) => setInvDraft({ ...invDraft, acompanante: e.target.value })} placeholder="Nombre del acompañante" />
                        </Campo>
                        <div className="grid grid-cols-2 gap-3">
                            <Campo label="Edad">
                                <select className="input-base" value={invDraft.edad} onChange={(e) => setInvDraft({ ...invDraft, edad: e.target.value as Edad })}>
                                    {OPC_EDAD.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </Campo>
                            <Campo label="Sexo">
                                <select className="input-base" value={invDraft.sexo} onChange={(e) => setInvDraft({ ...invDraft, sexo: e.target.value as Sexo })}>
                                    {OPC_SEXO.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </Campo>
                        </div>
                        <Campo label="Grupo (se sientan juntos)">
                            <input className="input-base" value={invDraft.grupo} onChange={(e) => setInvDraft({ ...invDraft, grupo: e.target.value })} placeholder="Ej. Familia, Novios, Amigos…" />
                        </Campo>
                        <div className="grid grid-cols-2 gap-3">
                            <Campo label="Menú">
                                <select className="input-base" value={invDraft.menu} onChange={(e) => setInvDraft({ ...invDraft, menu: e.target.value as MenuTipo })}>
                                    {OPC_MENU.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </Campo>
                            <Campo label="Confirmación">
                                <select className="input-base" value={invDraft.confirmacion} onChange={(e) => setInvDraft({ ...invDraft, confirmacion: e.target.value as Confirmacion })}>
                                    {OPC_CONFIRM.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </Campo>
                        </div>
                        <Campo label="Alergias / notas">
                            <input className="input-base" value={invDraft.alergias} onChange={(e) => setInvDraft({ ...invDraft, alergias: e.target.value })} placeholder="Alergias, intolerancias…" />
                        </Campo>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setInvModal({ open: false, id: null })} className="btn-ghost">Cancelar</button>
                            <button
                                onClick={saveInv}
                                disabled={invDraft.nombre.trim().length < 2}
                                className="btn-gold disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Modal mesa ─── */}
            {mesaModal.open && (
                <div className="fixed inset-0 z-[200] grid place-items-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setMesaModal({ open: false, id: null })}>
                    <div className="w-full max-w-sm rounded-3xl bg-[#0a080b] border border-white/15 p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-syne font-black text-lg uppercase text-white">{mesaModal.id ? 'Editar mesa' : 'Nueva mesa'}</h3>
                            <button onClick={() => setMesaModal({ open: false, id: null })} className="text-white/40 hover:text-white"><X size={18} /></button>
                        </div>
                        <Campo label="Nombre de la mesa *">
                            <input className="input-base" value={mesaDraft.nombre} onChange={(e) => setMesaDraft({ ...mesaDraft, nombre: e.target.value })} placeholder="Ej. Presidencial" />
                        </Campo>
                        <div className="grid grid-cols-2 gap-3">
                            <Campo label="Nº de sillas">
                                <input
                                    className="input-base"
                                    type="number"
                                    min={1}
                                    max={40}
                                    value={mesaDraft.sillas}
                                    onChange={(e) => setMesaDraft({ ...mesaDraft, sillas: Math.max(1, Number(e.target.value) || 1) })}
                                />
                            </Campo>
                            <Campo label="Tipo">
                                <select className="input-base" value={mesaDraft.tipo} onChange={(e) => setMesaDraft({ ...mesaDraft, tipo: e.target.value as MesaTipo })}>
                                    {OPC_TIPO.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </Campo>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setMesaModal({ open: false, id: null })} className="btn-ghost">Cancelar</button>
                            <button onClick={saveMesa} disabled={mesaDraft.nombre.trim().length < 1} className="btn-gold disabled:opacity-40 disabled:cursor-not-allowed">
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset demo */}
            <div className="mt-8 text-center print:hidden">
                <button onClick={clear} className="text-[10px] font-mono uppercase tracking-widest text-white/25 hover:text-white/60 transition-all">
                    ↺ Restablecer demo
                </button>
            </div>

            <style jsx>{`
        .input-base {
          width: 100%;
          background: #0c0a0e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          border-radius: 0.75rem;
          padding: 0.6rem 0.75rem;
          font-size: 0.8rem;
          outline: none;
          color-scheme: dark;
        }
        .input-base:focus {
          border-color: rgba(236, 182, 19, 0.5);
        }
        .btn-gold {
          flex: 1;
          background: linear-gradient(90deg, #ecb613, #f5d77f);
          color: #000;
          border: none;
          border-radius: 0.75rem;
          padding: 0.75rem;
          font-weight: 900;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all 0.25s;
        }
        .btn-gold:hover {
          background: #fff;
          transform: translateY(-2px);
        }
        .btn-ghost {
          flex: 1;
          background: #0c0a0e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          border-radius: 0.75rem;
          padding: 0.75rem;
          font-weight: 900;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all 0.25s;
        }
        .btn-ghost:hover {
          border-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
        </div>
    );
}

/* ─────────────────────────────── SUBCOMPONENTES ─────────────────────────────── */

function Metrica({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent: string }) {
    return (
        <div className="rounded-3xl bg-[#0a080b]/90 border border-white/10 backdrop-blur-md p-4 transition-all hover:border-[#ecb613]/40 hover:-translate-y-0.5">
            <div className={`flex items-center gap-2 ${accent}`}>
                <span className="p-1.5 rounded-lg bg-white/5">{icon}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">{label}</span>
            </div>
            <p className={`font-syne font-black text-3xl mt-2 ${accent} tabular-nums`}>{value}</p>
        </div>
    );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block mb-3">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5">{label}</span>
            {children}
        </label>
    );
}