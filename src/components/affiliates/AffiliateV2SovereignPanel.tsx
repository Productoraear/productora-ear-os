"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Wallet,
    ArrowUpRight,
    ShieldCheck,
    Copy,
    CheckCircle2,
    RefreshCw,
    AlertCircle,
    Trophy,
    Sparkles,
    Clock,
    Link2,
    TrendingUp,
    BadgeCheck,
    Landmark,
    Crown,
} from "lucide-react";
import {
    getAffiliateV2Dashboard,
    requestAffiliatePayoutV2Action,
    AffiliateV2DashboardDTO,
} from "@/app/actions/affiliateV2Actions";

const fmtEUR = (n: number) =>
    n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function AffiliateV2SovereignPanel() {
    const [email, setEmail] = useState("edwin@productoraear.com");
    const [data, setData] = useState<AffiliateV2DashboardDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState("350");
    const [payoutStatus, setPayoutStatus] = useState<{ message: string; isError?: boolean } | null>(null);
    const [submittingPayout, setSubmittingPayout] = useState(false);
    const [tab, setTab] = useState<"ledger" | "referrals" | "payouts">("ledger");

    const load = useCallback(async (targetEmail: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAffiliateV2Dashboard(targetEmail);
            setData(res);
        } catch (e: any) {
            setError(e?.message || "Error cargando la telemetría del afiliado.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load(email);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCopy = useCallback(async () => {
        if (!data?.referralLink) return;
        try {
            await navigator.clipboard.writeText(data.referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        } catch {
            setCopied(false);
        }
    }, [data?.referralLink]);

    const handlePayout = useCallback(async () => {
        const amt = parseFloat(payoutAmount);
        if (isNaN(amt) || amt <= 0) return;
        setSubmittingPayout(true);
        setPayoutStatus(null);
        try {
            const res = await requestAffiliatePayoutV2Action(email, amt);
            setPayoutStatus({ message: res.message, isError: !res.success });
            if (res.success) await load(email);
        } catch (e: any) {
            setPayoutStatus({ message: e?.message || "Error en la solicitud", isError: true });
        } finally {
            setSubmittingPayout(false);
        }
    }, [email, payoutAmount, load]);

    const profile = data?.profile ?? null;
    const metrics = data?.metrics;

    const tierProgress = useMemo(() => {
        if (!profile || !data) return 0;
        const current = data.tierConfig.find((t) => t.tier === profile.tier);
        const next = data.tierConfig.find((t) => t.minSales > (current?.minSales ?? 0));
        if (!next) return 100;
        const span = next.minSales - (current?.minSales ?? 0);
        const pos = profile.totalSalesGenerated - (current?.minSales ?? 0);
        return Math.min(100, Math.max(0, (pos / span) * 100));
    }, [profile, data]);

    const statusColor = (s: string) =>
        s === "PAID" || s === "CONVERTED"
            ? "bg-emerald-950 text-emerald-300 border-emerald-800"
            : s === "APPROVED"
                ? "bg-cyan-950 text-cyan-300 border-cyan-800"
                : s === "PENDING" || s === "PROCESSING"
                    ? "bg-amber-950 text-amber-300 border-amber-800"
                    : "bg-rose-950 text-rose-300 border-rose-800";

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
                <RefreshCw className="w-6 h-6 text-[#ecb613] animate-spin" aria-hidden="true" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ecb613] selection:text-black pt-28 pb-36 px-4 md:px-8 overflow-x-hidden">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* HEADER */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 border-b border-white/10 pb-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.25em] mb-3">
                            <Crown size={12} aria-hidden="true" />
                            <span>COMMISSION ENGINE · SPLIT SOBERANO 80/10/10</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white font-syne tracking-tight leading-none">
                            Panel <span className="text-[#ecb613]">Soberano</span> de Afiliado
                        </h1>
                        <p className="text-xs sm:text-sm text-zinc-400 font-light mt-2 max-w-2xl">
                            Onboarding en menos de 10 min · Liquidación dominical · Gate KYC ≥ 3.000 € · Ledger inmutable PostgreSQL.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && load(email)}
                            aria-label="Email del prescriptor"
                            className="flex-1 lg:flex-none px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#ecb613] w-full lg:w-72"
                            placeholder="Email del prescriptor..."
                        />
                        <button
                            onClick={() => load(email)}
                            disabled={loading}
                            className="p-2.5 bg-white/5 hover:bg-[#ecb613] hover:text-black border border-white/10 rounded-xl text-white transition-all cursor-pointer shrink-0"
                            title="Recargar telemetría"
                            aria-label="Recargar telemetría del afiliado"
                        >
                            <RefreshCw size={15} className={loading ? "animate-spin" : ""} aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {error && (
                    <div role="alert" className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
                        <AlertCircle size={16} aria-hidden="true" /> {error}
                    </div>
                )}

                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <KpiCard label="Aura Wallet" value={fmtEUR(data?.wallet.balance ?? 0)} sub="Disponible para retiro" icon={<Wallet size={18} />} accent="#ecb613" />
                    <KpiCard label="Pendiente / En proceso" value={fmtEUR(metrics?.totalCommissionPending ?? 0)} sub="Liquidación domingo 23:59 GMT" icon={<Clock size={18} />} accent="#f59e0b" />
                    <KpiCard label="Total Liquidado" value={fmtEUR(metrics?.totalCommissionPaid ?? 0)} sub="Comisiones PAID acreditadas" icon={<ShieldCheck size={18} />} accent="#10b981" />
                    <KpiCard label="Rango" value={profile?.tierName ?? "Bronce"} sub={`${profile?.totalSalesGenerated ?? 0} ventas · ${profile?.commissionRate ?? 10}% comisión`} icon={<Trophy size={18} />} accent="#a78bfa" />
                </div>

                {/* SPLIT + ENLACE */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-5 p-6 rounded-3xl bg-[#09090d] border border-white/10 space-y-5">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-[#ecb613]" />
                            <h3 className="text-lg font-bold text-white font-syne">Split Soberano 80/10/10</h3>
                        </div>
                        <div className="space-y-2">
                            <SplitRow label="Artista Ejecutor" pct={80} color="#ecb613" />
                            <SplitRow label="Infraestructura EAR OS" pct={10} color="#00E5FF" />
                            <SplitRow label="Impacto VIMUME" pct={10} color="#FF2B44" />
                        </div>
                        <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-zinc-400 font-mono leading-relaxed">
                            Tu comisión ({profile?.commissionRate ?? 10}%) se devenga sobre la cuota de infraestructura EAR OS.
                            Ejemplo base 350 € → <span className="text-[#ecb613]">{fmtEUR(data?.metrics?.projectedNextCommission ?? 35)} €</span>.
                        </div>
                    </div>

                    <div className="lg:col-span-7 p-6 rounded-3xl bg-[#09090d] border border-[#ecb613]/30 space-y-5 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Link2 size={16} className="text-[#ecb613]" />
                                <span className="text-[11px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
                                    Enlace Canónico de Atribución
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white font-syne">Comparte y cobra en tiempo real</h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Cada reserva cerrada mediante tu enlace se registra como conversión con su asiento inmutable en el Ledger.
                            </p>
                        </div>

                        {profile && (
                            <div className="flex items-center gap-2 p-3 bg-black/50 border border-white/10 rounded-xl font-mono text-[11px] text-zinc-300">
                                <BadgeCheck size={14} className="text-emerald-400 shrink-0" />
                                <span className="truncate">{profile.affiliateCode}</span>
                                <span className="ml-auto text-[10px] text-zinc-500 shrink-0">KYC: {profile.kycStatus}</span>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 p-3 bg-black/60 border border-white/10 rounded-2xl font-mono text-xs text-[#ecb613] truncate flex items-center">
                                {data?.referralLink || "Cargando enlace..."}
                            </div>
                            <button
                                onClick={handleCopy}
                                disabled={!data?.referralLink}
                                className="px-6 py-3 bg-[#ecb613] hover:bg-white text-black font-black text-xs font-mono uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 shadow-lg shadow-[#ecb613]/20"
                            >
                                {copied ? <CheckCircle2 size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                                <span>{copied ? "¡Copiado!" : "Copiar"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* PROGRESO DE TIER + PAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="p-6 rounded-3xl bg-[#09090d] border border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-purple-400" />
                                <h3 className="text-lg font-bold text-white font-syne">Progreso de Tier</h3>
                            </div>
                            {metrics?.nextTier ? (
                                <span className="text-[10px] font-mono text-zinc-400">Próximo: {metrics.nextTier.name} ({metrics.nextTier.minSales} ventas)</span>
                            ) : (
                                <span className="text-[10px] font-mono text-[#ecb613]">Elite Máxima</span>
                            )}
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-gradient-to-r from-[#ecb613] to-amber-300" initial={{ width: 0 }} animate={{ width: `${tierProgress}%` }} transition={{ duration: 0.8 }} />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {data?.tierConfig.map((t) => (
                                <div key={t.tier} className={`p-3 rounded-xl border text-center ${profile?.tier === t.tier ? "border-[#ecb613]/60 bg-[#ecb613]/10" : "border-white/5 bg-black/20"}`}>
                                    <p className="text-[9px] font-mono uppercase text-zinc-400">{t.name.split("—")[0].trim()}</p>
                                    <p className="text-sm font-black text-white">{t.commissionRate}%</p>
                                    <p className="text-[9px] font-mono text-zinc-500">{t.minSales} ventas</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-[#09090d] border border-white/10 space-y-4 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <Landmark size={16} className="text-emerald-400" />
                                <h3 className="text-lg font-bold text-white font-syne">Liquidación Dominical</h3>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1">Regla KYC activa para retiros ≥ 3.000 €. Método: {profile?.payoutMethod ?? "IBAN"}.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={payoutAmount}
                                onChange={(e) => setPayoutAmount(e.target.value)}
                                aria-label="Importe a retirar en euros"
                                className="flex-1 p-3 bg-black/60 border border-white/10 rounded-2xl font-mono text-sm text-white focus:outline-none focus:border-[#ecb613]"
                                placeholder="Importe en €"
                            />
                            <button
                                onClick={handlePayout}
                                disabled={submittingPayout || !data || data.wallet.balance <= 0}
                                className="px-6 py-3 bg-white/10 hover:bg-emerald-600 hover:text-white disabled:opacity-40 text-emerald-400 font-bold text-xs font-mono uppercase rounded-2xl transition-all cursor-pointer flex items-center gap-2"
                            >
                                {submittingPayout ? <RefreshCw size={14} className="animate-spin" aria-hidden="true" /> : <ArrowUpRight size={16} aria-hidden="true" />}
                                Solicitar
                            </button>
                        </div>
                        {payoutStatus && (
                            <div className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${payoutStatus.isError ? "bg-rose-950/60 border border-rose-500/40 text-rose-300" : "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"}`}>
                                {payoutStatus.isError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                                {payoutStatus.message}
                            </div>
                        )}
                    </div>
                </div>

                {/* TABLAS */}
                <div className="p-6 rounded-3xl bg-[#09090d] border border-white/10 space-y-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white font-syne">Liquidaciones & Telemetría</h3>
                            <p className="text-xs text-zinc-400">Asientos inmutables vinculados a eventos reales.</p>
                        </div>
                        <div className="flex gap-2">
                            {(["ledger", "referrals", "payouts"] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    aria-pressed={tab === t}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider border transition-all cursor-pointer ${tab === t ? "bg-[#ecb613] text-black border-[#ecb613] font-bold" : "bg-black/30 border-white/10 text-zinc-400 hover:border-white/30"}`}
                                >
                                    {t === "ledger" ? "Ledger" : t === "referrals" ? "Referidos" : "Payouts"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {tab === "ledger" && <LedgerTable ledgers={data?.ledgers ?? []} statusColor={statusColor} />}
                    {tab === "referrals" && <ReferralsTable referrals={data?.referrals ?? []} statusColor={statusColor} />}
                    {tab === "payouts" && <PayoutsTable payouts={data?.payouts ?? []} statusColor={statusColor} />}
                </div>
            </div>
        </div>
    );
}

function KpiCard({ label, value, sub, icon, accent }: { label: string; value: string; sub: string; icon: React.ReactNode; accent: string }) {
    return (
        <div className="p-5 rounded-3xl bg-[#0a0a0d] border border-white/10 hover:border-white/25 transition-all">
            <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{label}</span>
                <div className="p-2 rounded-xl border" style={{ color: accent, borderColor: `${accent}33`, backgroundColor: `${accent}14` }}>
                    {icon}
                </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white mt-4 font-mono truncate">{value}</p>
            <span className="text-[10px] text-zinc-500 font-mono mt-1 block">{sub}</span>
        </div>
    );
}

function SplitRow({ label, pct, color }: { label: string; pct: number; color: string }) {
    return (
        <div>
            <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                <span>{label}</span>
                <span style={{ color }}>{pct}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
        </div>
    );
}

function LedgerTable({ ledgers, statusColor }: { ledgers: AffiliateV2DashboardDTO["ledgers"]; statusColor: (s: string) => string }) {
    if (ledgers.length === 0) {
        return <EmptyState text="Aún no hay asientos en el Ledger. Comparte tu enlace para empezar a devengar comisiones." />;
    }
    return (
        <div className="space-y-2">
            {ledgers.map((l) => (
                <div key={l.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-white/20 transition-all">
                    <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusColor(l.status)}`}>{l.status}</span>
                            <span className="text-sm font-bold text-white truncate">{l.sourceEvent || "Comisión referida"}</span>
                        </div>
                        <p className="text-xs text-zinc-400 font-mono truncate">Ref: {l.reference || l.id}</p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-[#ecb613] font-mono">+{fmtEUR(l.amount)} €</p>
                        <span className="text-[10px] text-zinc-500 font-mono">{new Date(l.createdAt).toLocaleDateString("es-ES")}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ReferralsTable({ referrals, statusColor }: { referrals: AffiliateV2DashboardDTO["referrals"]; statusColor: (s: string) => string }) {
    if (referrals.length === 0) {
        return <EmptyState text="Sin referidos registrados todavía. Tu red se reflejará aquí en tiempo real." />;
    }
    return (
        <div className="space-y-2">
            {referrals.map((r) => (
                <div key={r.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-white/20 transition-all">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusColor(r.status)}`}>{r.status}</span>
                            <span className="text-sm font-bold text-white">{r.customerEmail || "Cliente anónimo"}</span>
                        </div>
                        <p className="text-xs text-zinc-400 font-mono">Código: {r.referralCode}</p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-[#ecb613] font-mono">{fmtEUR(r.commissionDue)} €</p>
                        <span className="text-[10px] text-zinc-500 font-mono">
                            {r.convertedAt ? `Convertido ${new Date(r.convertedAt).toLocaleDateString("es-ES")}` : "Pendiente de conversión"}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

function PayoutsTable({ payouts, statusColor }: { payouts: AffiliateV2DashboardDTO["payouts"]; statusColor: (s: string) => string }) {
    if (payouts.length === 0) {
        return <EmptyState text="Aún no has solicitado liquidaciones. Retira fondos de tu Aura Wallet los domingos." />;
    }
    return (
        <div className="space-y-2">
            {payouts.map((p) => (
                <div key={p.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-white/20 transition-all">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusColor(p.status)}`}>{p.status}</span>
                            <span className="text-sm font-bold text-white">Liquidación {p.reference || p.id}</span>
                        </div>
                        <p className="text-xs text-zinc-400 font-mono">
                            {p.scheduledFor ? `Programada: ${new Date(p.scheduledFor).toLocaleDateString("es-ES")}` : "Pendiente de programación"}
                        </p>
                    </div>
                    <p className="text-lg font-bold text-emerald-400 font-mono shrink-0">{fmtEUR(p.amount)} €</p>
                </div>
            ))}
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="p-8 text-center text-zinc-500 text-xs font-mono bg-black/20 rounded-2xl border border-dashed border-white/10">
            {text}
        </div>
    );
}