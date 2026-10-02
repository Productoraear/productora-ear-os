"use client";
import React, { Component, Suspense, useCallback, useMemo, useState, type ErrorInfo, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Plus, Trash2, Loader2, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Building2, Calendar, MapPin, Lock, ArrowRight } from 'lucide-react';

type SC = 'MUSICA_LIVE' | 'DJ' | 'MARIACHI' | 'FOTOGRAFIA' | 'VIDEO' | 'CATERING' | 'DECORACION' | 'ILUMINACION' | 'WEDDING_PLANNER' | 'TRANSPORTE' | 'FINCA';
interface SL { id: string; name: string; cat: SC; price: number; }
interface QR { quoteId: string; timestamp: string; expiresAt: string; financials: { subtotal: number; earOsInfrastructureFee: number; earOsFeePct: number; netToFinca: number; vatPct: number; vatAmount: number; totalWithVat: number; }; integrity: { hashSha256: string; algorithm: string; }; }

const CATS: Array<{ v: SC; l: string }> = [
    { v: 'MUSICA_LIVE', l: 'Música en Vivo' }, { v: 'DJ', l: 'DJ' }, { v: 'MARIACHI', l: 'Mariachi' },
    { v: 'FOTOGRAFIA', l: 'Fotografía' }, { v: 'VIDEO', l: 'Vídeo' }, { v: 'CATERING', l: 'Catering' },
    { v: 'DECORACION', l: 'Decoración' }, { v: 'ILUMINACION', l: 'Iluminación' }, { v: 'WEDDING_PLANNER', l: 'Planner' },
    { v: 'TRANSPORTE', l: 'Transporte' }, { v: 'FINCA', l: 'Finca/Espacio' },
];
const FEE = 0.10, VAT = 0.21;
const r2 = (n: number) => Math.round(n * 100) / 100;
const eur = (n: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(n);
const gid = () => `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

class QuoteErrorBoundary extends Component<
    { children: ReactNode; fallback: ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[B2bQuoteSimulator] Fallo de render:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

const QuoteFallback: React.FC = () => (
    <div className="w-full max-w-6xl mx-auto rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-8 text-center text-sm text-white/70">
        Simulador de cotización temporalmente no disponible.
    </div>
);

export default function B2bQuoteSimulator() {
    const [finca, setFinca] = useState('');
    const [cif, setCif] = useState('');
    const [date, setDate] = useState('');
    const [loc, setLoc] = useState('');
    const [svcs, setSvcs] = useState<SL[]>([{ id: gid(), name: 'Sonido & Luz S-Class', cat: 'MUSICA_LIVE', price: 1200 }]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [quote, setQuote] = useState<QR | null>(null);

    const calc = useMemo(() => {
        const sub = r2(svcs.reduce((a, s) => a + (s.price || 0), 0));
        const fee = r2(sub * FEE);
        const net = r2(sub - fee);
        const vat = r2(sub * VAT);
        const tot = r2(sub + vat);
        return { sub, fee, net, vat, tot };
    }, [svcs]);

    const add = useCallback(() => setSvcs(p => [...p, { id: gid(), name: '', cat: 'MUSICA_LIVE', price: 0 }]), []);
    const rm = useCallback((id: string) => setSvcs(p => p.filter(s => s.id !== id)), []);
    const up = useCallback((id: string, patch: Partial<SL>) => setSvcs(p => p.map(s => s.id === id ? { ...s, ...patch } : s)), []);

    const gen = useCallback(async () => {
        setLoading(true); setErr(null); setQuote(null);
        try {
            const res = await fetch('/api/vendor/b2b-quote', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fincaId: `FINCA-${(cif || 'B12345678').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`,
                    fincaRazonSocial: finca || 'Finca Demo S.L.',
                    fincaCif: cif || 'B12345678',
                    eventDate: date ? new Date(date).toISOString() : new Date().toISOString(),
                    location: loc || 'Madrid',
                    services: svcs.map(s => ({ name: s.name || 'Servicio', category: s.cat, basePrice: s.price }))
                })
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error ?? 'Error B2B');
            setQuote(data as QR);
        } catch (e: unknown) { setErr(e instanceof Error ? e.message : 'Error desconocido'); }
        finally { setLoading(false); }
    }, [finca, cif, date, loc, svcs]);

    return (
        <QuoteErrorBoundary fallback={<QuoteFallback />}>
            <Suspense fallback={<QuoteFallback />}>
                <div className="w-full max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 mb-4">
                            <Calculator size={14} className="text-[#ecb613]" />
                            <span className="text-[11px] font-mono font-black text-[#ecb613] uppercase tracking-widest">Simulador B2B · Finca Multi-Servicio</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-syne text-white leading-tight">
                            Cotiza tu Evento <span className="text-[#ecb613]">Sin Sorpresas</span>
                        </h1>
                        <p className="mt-3 text-sm text-zinc-400 max-w-2xl mx-auto font-light">
                            Transparencia total: desglose de base, comisión EAR OS (10%) e IVA. Split soberano 80/10/10.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                            className="lg:col-span-3 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md overflow-hidden">
                            <div className="p-6 border-b border-white/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Building2 size={16} className="text-[#ecb613]" />
                                    <h2 className="text-sm font-black font-syne text-white uppercase tracking-wider">Datos de la Finca</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 block">Razón Social</label>
                                        <input type="text" value={finca} onChange={e => setFinca(e.target.value)} placeholder="Finca El Olivar S.L."
                                            className="w-full bg-[#0a0a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#ecb613] focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 block">CIF</label>
                                        <input type="text" value={cif} onChange={e => setCif(e.target.value.toUpperCase())} placeholder="B12345678" maxLength={9}
                                            className="w-full bg-[#0a0a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-zinc-600 focus:border-[#ecb613] focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 block"><Calendar size={10} className="inline mr-1" /> Fecha</label>
                                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                                            className="w-full bg-[#0a0a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#ecb613] focus:outline-none transition-all [color-scheme:dark]" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5 block"><MapPin size={10} className="inline mr-1" /> Ubicación</label>
                                        <input type="text" value={loc} onChange={e => setLoc(e.target.value)} placeholder="Toledo, España"
                                            className="w-full bg-[#0a0a12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#ecb613] focus:outline-none transition-all" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={16} className="text-[#00E5FF]" />
                                        <h2 className="text-sm font-black font-syne text-white uppercase tracking-wider">Servicios</h2>
                                    </div>
                                    <button onClick={add} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300 hover:bg-white/10 transition-all">
                                        <Plus size={13} /> Añadir
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <AnimatePresence mode="popLayout">
                                        {svcs.map((s, idx) => (
                                            <motion.div key={s.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                                                className="rounded-2xl border border-white/10 bg-[#0a0a12] p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        <div>
                                                            <label className="text-[9px] font-mono text-zinc-600 uppercase mb-1 block">Servicio {idx + 1}</label>
                                                            <input type="text" value={s.name} onChange={e => up(s.id, { name: e.target.value })} placeholder="Sonido, DJ…"
                                                                className="w-full bg-[#08080e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-[#00E5FF] focus:outline-none transition-all" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] font-mono text-zinc-600 uppercase mb-1 block">Categoría</label>
                                                            <select value={s.cat} onChange={e => up(s.id, { cat: e.target.value as SC })}
                                                                className="w-full bg-[#08080e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00E5FF] focus:outline-none transition-all">
                                                                {CATS.map(c => <option key={c.v} value={c.v} className="bg-[#0a0a12]">{c.l}</option>)}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] font-mono text-zinc-600 uppercase mb-1 block">Precio (€)</label>
                                                            <input type="number" min={0} max={100000} value={s.price || ''} onChange={e => up(s.id, { price: Number(e.target.value) || 0 })} placeholder="0.00"
                                                                className="w-full bg-[#08080e] border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono placeholder:text-zinc-600 focus:border-[#00E5FF] focus:outline-none transition-all" />
                                                        </div>
                                                    </div>
                                                    {svcs.length > 1 && (
                                                        <button onClick={() => rm(s.id)} className="p-2 rounded-lg text-zinc-600 hover:text-[#FF2B44] hover:bg-[#FF2B44]/10 transition-all shrink-0">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                            className="lg:col-span-2 space-y-4">
                            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <ShieldCheck size={16} className="text-[#00E5FF]" />
                                    <h3 className="text-sm font-black font-syne text-white uppercase tracking-wider">Desglose Transparente</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-zinc-400">Base Imponible</span>
                                        <span className="text-sm font-mono font-bold text-white">{eur(calc.sub)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-zinc-400">Comisión EAR OS (10%)</span>
                                        <span className="text-sm font-mono font-bold text-[#ecb613]">-{eur(calc.fee)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-zinc-400">Neto Finca (80%)</span>
                                        <span className="text-sm font-mono font-bold text-emerald-400">{eur(calc.net)}</span>
                                    </div>
                                    <div className="h-px bg-white/10 my-2" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-zinc-400">IVA (21%)</span>
                                        <span className="text-sm font-mono font-bold text-white">{eur(calc.vat)}</span>
                                    </div>
                                    <div className="h-px bg-white/10 my-2" />
                                    <div className="flex justify-between items-center bg-[#ecb613]/5 rounded-xl px-3 py-2.5">
                                        <span className="text-xs font-bold text-white">TOTAL CLIENTE</span>
                                        <span className="text-lg font-mono font-black text-[#ecb613]">{eur(calc.tot)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-5">
                                <div className="flex items-start gap-3">
                                    <Lock size={14} className="text-zinc-500 mt-0.5 shrink-0" />
                                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                                        Split Soberano 80/10/10: 80% Artista/Finca, 10% Infraestructura EAR OS, 10% VIMUME (Impacto Social).
                                        Sin cuotas fijas. Depósito Stripe 100€ Price-Lock SHA-256.
                                    </p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {quote && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="rounded-3xl bg-[#09090d]/80 border border-emerald-500/30 backdrop-blur-md p-5"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <CheckCircle2 size={16} className="text-emerald-400" />
                                            <h4 className="text-xs font-black font-syne text-emerald-400 uppercase tracking-wider">
                                                Cotización Generada
                                            </h4>
                                        </div>
                                        <div className="space-y-2 text-[11px] font-mono">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">ID</span>
                                                <span className="text-zinc-300">{quote.quoteId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">Base</span>
                                                <span className="text-white">{eur(quote.financials.subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">Comisión EAR OS</span>
                                                <span className="text-[#ecb613]">-{eur(quote.financials.earOsInfrastructureFee)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">Neto Finca</span>
                                                <span className="text-emerald-400">{eur(quote.financials.netToFinca)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">IVA</span>
                                                <span className="text-white">{eur(quote.financials.vatAmount)}</span>
                                            </div>
                                            <div className="h-px bg-white/10 my-1" />
                                            <div className="flex justify-between font-bold">
                                                <span className="text-white">TOTAL</span>
                                                <span className="text-[#ecb613]">{eur(quote.financials.totalWithVat)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600">SHA-256</span>
                                                <span className="text-zinc-500 truncate max-w-[140px]">{quote.integrity.hashSha256.slice(0, 16)}…</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {err && (
                                <div className="rounded-2xl bg-[#FF2B44]/10 border border-[#FF2B44]/30 p-4 flex items-start gap-2">
                                    <AlertTriangle size={14} className="text-[#FF2B44] mt-0.5 shrink-0" />
                                    <p className="text-[11px] text-[#FF2B44] font-mono">{err}</p>
                                </div>
                            )}

                            <button
                                onClick={gen}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#ecb613] hover:bg-[#f6c737] text-black text-sm font-mono font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                                {loading ? 'Generando…' : 'Generar Cotización Formal'}
                            </button>
                        </motion.div>
                    </div>
                </div>
            </Suspense>
        </QuoteErrorBoundary>
    );
}
