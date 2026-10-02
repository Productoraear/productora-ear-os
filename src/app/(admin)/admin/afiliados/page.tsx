"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Share2,
  Users,
  Percent,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Building2,
  DollarSign,
  HeartHandshake,
  Search,
  RefreshCw,
  Crown,
  Wallet,
  AlertCircle,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Eye,
  UserPlus,
  Pencil,
  Save,
  X,
  Power,
} from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════
// S-CLASS ADMIN · RED DE AFILIADOS · COMMISSION ENGINE 80/10/10
// Datos reales desde /api/affiliates/v2/list + gestión de comisiones
// ════════════════════════════════════════════════════════════════════════════

interface AffiliateItem {
  id: string;
  affiliateCode: string;
  companyName: string | null;
  name: string | null;
  email: string;
  phone: string | null;
  category: string;
  tier: string;
  commissionRate: number;
  totalSalesGenerated: number;
  kycStatus: string;
  isActive: boolean;
  walletBalance: number;
  commissionsPaid: number;
  commissionsPending: number;
  referralsCount: number;
  conversionsCount: number;
  payoutMethod: string;
  createdAt: string;
}

const fmtEUR = (n: number) =>
  n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const tierBadge = (tier: string) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    BRONZE: { bg: "bg-amber-950", text: "text-amber-300", label: "BRONCE" },
    SILVER: { bg: "bg-zinc-800", text: "text-zinc-200", label: "PLATA" },
    GOLD: { bg: "bg-yellow-950", text: "text-yellow-300", label: "ORO" },
    PLATINUM: { bg: "bg-purple-950", text: "text-purple-300", label: "PLATINO" },
  };
  const t = map[tier] ?? map["BRONZE"];
  return (
    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${t.bg} ${t.text} border-white/10`}>
      {t.label}
    </span>
  );
};

const kycBadge = (status: string) => {
  if (status === "VERIFIED") {
    return (
      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
        <BadgeCheck size={10} /> VERIFICADO
      </span>
    );
  }
  return (
    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-700">
      {status === "NOT_REQUIRED" ? "NO REQUERIDO" : status}
    </span>
  );
};

export default function AfiliadosAdminCatminPage() {
  const [affiliates, setAffiliates] = useState<AffiliateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [approvingAll, setApprovingAll] = useState(false);
  const [approveMsg, setApproveMsg] = useState<string | null>(null);

  // Alta / Baja / Ajuste de % y Tier (Indie Affiliates Pro)
  const [createOpen, setCreateOpen] = useState(false);
  const [newAffiliate, setNewAffiliate] = useState({ name: '', email: '', companyName: '' });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState('');
  const [editTier, setEditTier] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [editMsg, setEditMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchAffiliates = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/affiliates/v2/list');
      const data = await res.json();
      if (data.success && Array.isArray(data.affiliates)) {
        setAffiliates(data.affiliates);
      } else {
        setAffiliates([]);
      }
    } catch (e) {
      console.warn('Error fetching affiliates:', e);
      setAffiliates([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAffiliates();
  }, [fetchAffiliates]);

  const handleApproveAll = async () => {
    setApprovingAll(true);
    setApproveMsg(null);
    try {
      const { approveAllPendingCommissionsAction } = await import("@/app/actions/affiliateV2Actions");
      const result = await approveAllPendingCommissionsAction("admin@productoraear.com");
      setApproveMsg(`✅ ${result.updatedCount} comisiones aprobadas.`);
      await fetchAffiliates();
    } catch (e: any) {
      setApproveMsg(`❌ Error: ${e?.message ?? "Desconocido"}`);
    } finally {
      setApprovingAll(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    setCreateMsg(null);
    try {
      const { registerAffiliateV2Action } = await import("@/app/actions/affiliateV2Actions");
      const result = await registerAffiliateV2Action({
        name: newAffiliate.name || newAffiliate.email.split("@")[0],
        email: newAffiliate.email,
        companyName: newAffiliate.companyName || undefined,
      });
      setCreateMsg({ ok: true, text: `✅ Alta creada: ${result.affiliateCode}` });
      setNewAffiliate({ name: '', email: '', companyName: '' });
      setCreateOpen(false);
      await fetchAffiliates();
    } catch (e: any) {
      setCreateMsg({ ok: false, text: `❌ ${e?.message ?? "Error en el alta"}` });
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (a: AffiliateItem) => {
    setEditingId(a.id);
    setEditRate(String(a.commissionRate));
    setEditTier(a.tier);
    setEditMsg(null);
  };

  const handleSaveEdit = async (a: AffiliateItem) => {
    setSavingEdit(true);
    setEditMsg(null);
    try {
      const { adminUpdateAffiliateAction } = await import("@/app/actions/affiliateV2Actions");
      const result = await adminUpdateAffiliateAction({
        adminEmail: "admin@productoraear.com",
        profileId: a.id,
        commissionRate: parseFloat(editRate),
        tier: editTier,
      });
      setEditMsg({ ok: true, text: `✅ ${result.message}` });
      setEditingId(null);
      await fetchAffiliates();
    } catch (e: any) {
      setEditMsg({ ok: false, text: `❌ ${e?.message ?? "Error al actualizar"}` });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleToggleActive = async (a: AffiliateItem) => {
    setTogglingId(a.id);
    try {
      const { adminDeactivateAffiliateAction, adminReactivateAffiliateAction } =
        await import("@/app/actions/affiliateV2Actions");
      if (a.isActive) {
        await adminDeactivateAffiliateAction({ adminEmail: "admin@productoraear.com", profileId: a.id });
      } else {
        await adminReactivateAffiliateAction({ adminEmail: "admin@productoraear.com", profileId: a.id });
      }
      await fetchAffiliates();
    } catch (e: any) {
      console.warn("Toggle active failed:", e?.message);
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = affiliates.filter(p =>
    (p.companyName ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (p.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    p.affiliateCode.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  // Computed KPIs from real data
  const totalPaid = affiliates.reduce((s, a) => s + a.commissionsPaid, 0);
  const totalPending = affiliates.reduce((s, a) => s + a.commissionsPending, 0);
  const totalWallets = affiliates.reduce((s, a) => s + a.walletBalance, 0);
  const totalConversions = affiliates.reduce((s, a) => s + a.conversionsCount, 0);
  const totalReferrals = affiliates.reduce((s, a) => s + a.referralsCount, 0);
  const activeCount = affiliates.filter(a => a.isActive).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">

      {/* ===================================================================== */}
      {/* HEADER                                                                 */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a24] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Admin</span>
            <span>/</span>
            <span>Finanzas</span>
            <span>/</span>
            <span className="text-[#ecb613] font-bold">Red de Afiliados</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-syne uppercase mt-1">
            Commission Engine · Split 80/10/10
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setCreateOpen(!createOpen)}
            className="flex items-center gap-1.5 bg-[#ecb613] text-black px-3 py-1.5 rounded-xl text-xs font-mono font-bold hover:bg-amber-300 transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Nuevo Afiliado</span>
          </button>
          <button
            onClick={fetchAffiliates}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
          <button
            onClick={handleApproveAll}
            disabled={approvingAll || totalPending <= 0}
            className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-700/40 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-400 hover:bg-emerald-900 transition-colors cursor-pointer disabled:opacity-40"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Aprobar Todas las Pendientes</span>
          </button>
          <div className="flex items-center gap-2 bg-[#ecb613]/10 border border-[#ecb613]/30 px-3 py-1.5 rounded-xl text-xs font-mono text-[#ecb613]">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>SSOT Inmutable</span>
          </div>
        </div>
      </div>

      {approveMsg && (
        <div className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${approveMsg.startsWith("✅")
          ? "bg-emerald-950/60 border border-emerald-700/40 text-emerald-300"
          : "bg-rose-950/60 border border-rose-500/40 text-rose-300"
          }`}>
          {approveMsg}
        </div>
      )}

      {createOpen && (
        <div className="rounded-2xl border border-[#ecb613]/30 bg-[#09090d] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-syne text-white uppercase">Alta Manual de Afiliado</h2>
              <p className="text-xs text-zinc-500">Crea prescriptor con enlace canónico y Aura Wallet automática.</p>
            </div>
            <button
              onClick={() => setCreateOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Nombre (*)"
              value={newAffiliate.name}
              onChange={(e) => setNewAffiliate({ ...newAffiliate, name: e.target.value })}
              className="h-10 px-3 text-xs font-mono bg-black/60 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]"
            />
            <input
              type="email"
              placeholder="Email (*)"
              value={newAffiliate.email}
              onChange={(e) => setNewAffiliate({ ...newAffiliate, email: e.target.value })}
              className="h-10 px-3 text-xs font-mono bg-black/60 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]"
            />
            <input
              type="text"
              placeholder="Empresa / Marca (opcional)"
              value={newAffiliate.companyName}
              onChange={(e) => setNewAffiliate({ ...newAffiliate, companyName: e.target.value })}
              className="h-10 px-3 text-xs font-mono bg-black/60 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreate}
              disabled={creating || !newAffiliate.email.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ecb613] text-black font-mono text-xs font-bold hover:bg-amber-300 transition-all cursor-pointer disabled:opacity-40"
            >
              <UserPlus size={14} />
              <span>{creating ? 'Creando...' : 'Dar de Alta'}</span>
            </button>
            {createMsg && (
              <span className={`text-xs font-mono ${createMsg.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                {createMsg.text}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* KPIs REALES                                                            */}
      {/* ===================================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <AdminKpi
          label="Partners Activos"
          value={`${activeCount}`}
          sub={`${affiliates.length} totales`}
          icon={<Building2 className="w-4 h-4" />}
          accentBg="bg-[#ecb613]/10"
          accentText="text-[#ecb613]"
        />
        <AdminKpi
          label="Comisiones Liquidadas"
          value={`${fmtEUR(totalPaid)} €`}
          sub="PAID en Ledger"
          icon={<DollarSign className="w-4 h-4" />}
          accentBg="bg-emerald-500/10"
          accentText="text-emerald-400"
        />
        <AdminKpi
          label="Pendiente / Aprobado"
          value={`${fmtEUR(totalPending)} €`}
          sub="Domingos 23:59 GMT"
          icon={<Clock className="w-4 h-4" />}
          accentBg="bg-amber-500/10"
          accentText="text-amber-400"
        />
        <AdminKpi
          label="Saldo Wallets"
          value={`${fmtEUR(totalWallets)} €`}
          sub="Aura Wallet total"
          icon={<Wallet className="w-4 h-4" />}
          accentBg="bg-cyan-500/10"
          accentText="text-cyan-400"
        />
        <AdminKpi
          label="Conversiones"
          value={`${totalConversions}`}
          sub={`${totalReferrals} referidos totales`}
          icon={<TrendingUp className="w-4 h-4" />}
          accentBg="bg-purple-500/10"
          accentText="text-purple-400"
        />
      </div>

      {/* ===================================================================== */}
      {/* SPLIT CANÓNICO VISUAL                                                  */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-3 gap-3">
        <SplitBar label="80% Artista Ejecutor" pct={80} color="#ecb613" />
        <SplitBar label="10% Infraestructura EAR" pct={10} color="#00E5FF" />
        <SplitBar label="10% VIMUME Social" pct={10} color="#FF2B44" />
      </div>

      {/* ===================================================================== */}
      {/* TABLA DE PARTNERS                                                      */}
      {/* ===================================================================== */}
      <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-3">
          <div>
            <h2 className="text-base font-bold font-syne text-white uppercase">
              Partners & Prescriptores Conectados
            </h2>
            <p className="text-xs text-zinc-500">Datos reales · Comisiones desde Ledger inmutable PostgreSQL</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar partner, código, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs font-mono bg-black/60 border border-white/10 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-colors"
              />
            </div>

            <a
              href="/afiliados"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 text-xs font-mono text-[#ecb613] hover:bg-[#ecb613]/20 flex items-center gap-1.5 transition-all shrink-0"
            >
              <span>Portal Público</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-[#ecb613] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <HeartHandshake className="w-10 h-10 text-zinc-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white font-mono">0 Partners Activos</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Cero datos ficticios. Los prescriptores, fincas y planners se dan de alta en el portal público o son enrolados manualmente.
              </p>
            </div>
            <div className="pt-2">
              <a
                href="/afiliados"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ecb613] text-black font-mono font-bold text-xs hover:bg-[#d4a210] transition-colors shadow-lg shadow-[#ecb613]/20"
              >
                <span>Registro Autónomo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((a) => (
              <div key={a.id} className="rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-colors overflow-hidden">
                <div
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] text-[#ecb613] font-bold bg-[#ecb613]/10 px-1.5 py-0.5 rounded border border-[#ecb613]/20">
                        {a.affiliateCode}
                      </span>
                      {tierBadge(a.tier)}
                      {kycBadge(a.kycStatus)}
                      <h3 className="text-sm font-bold text-white">{a.companyName || a.name}</h3>
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                      <span>{a.category === 'FINCA_ESPACIO' ? 'Finca / Espacio' : a.category === 'WEDDING_PLANNER' ? 'Wedding Planner' : a.category === 'CATERING' ? 'Catering' : 'Prescriptor'}</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-500 font-mono text-[11px]">{a.email}</span>
                      {a.phone && (
                        <>
                          <span className="text-zinc-600">·</span>
                          <span className="text-zinc-500 font-mono text-[11px]">{a.phone}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-zinc-500 block">VENTAS</span>
                      <span className="font-mono font-bold text-white text-xs">{a.totalSalesGenerated}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-zinc-500 block">COMISIÓN</span>
                      <span className="font-mono font-bold text-white text-xs">{a.commissionRate}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-zinc-500 block">PAGADO</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">{fmtEUR(a.commissionsPaid)} €</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-zinc-500 block">PENDIENTE</span>
                      <span className="font-mono font-bold text-amber-400 text-sm">{fmtEUR(a.commissionsPending)} €</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-zinc-500 block">WALLET</span>
                      <span className="font-mono font-bold text-cyan-400 text-sm">{fmtEUR(a.walletBalance)} €</span>
                    </div>
                    {expandedId === a.id ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
                  </div>
                </div>

                {expandedId === a.id && (
                  <div className="px-4 pb-4 border-t border-zinc-900 pt-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-mono">
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                        <span className="text-zinc-500 block">Referidos Totales</span>
                        <span className="text-white font-bold">{a.referralsCount}</span>
                      </div>
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                        <span className="text-zinc-500 block">Conversiones</span>
                        <span className="text-white font-bold">{a.conversionsCount}</span>
                      </div>
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                        <span className="text-zinc-500 block">Método Pago</span>
                        <span className="text-white font-bold">{a.payoutMethod}</span>
                      </div>
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                        <span className="text-zinc-500 block">Registro</span>
                        <span className="text-white font-bold">{new Date(a.createdAt).toLocaleDateString("es-ES")}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap items-center">
                      <a
                        href={`/panel/afiliado?email=${a.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-zinc-300 hover:bg-[#ecb613]/20 hover:text-[#ecb613] transition-all"
                      >
                        <Eye size={12} /> Ver Panel Soberano
                      </a>
                      <button
                        onClick={() => startEdit(a)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/40 border border-cyan-800/40 rounded-lg text-[10px] font-mono text-cyan-300 hover:bg-cyan-900 transition-all cursor-pointer"
                      >
                        <Pencil size={12} /> Ajustar % / Tier
                      </button>
                      <button
                        onClick={() => handleToggleActive(a)}
                        disabled={togglingId === a.id}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-all cursor-pointer disabled:opacity-40 ${a.isActive
                          ? "bg-rose-950/40 border-rose-800/40 text-rose-300 hover:bg-rose-900"
                          : "bg-emerald-950/40 border-emerald-800/40 text-emerald-300 hover:bg-emerald-900"
                          }`}
                      >
                        <Power size={12} /> {a.isActive ? 'Dar de Baja' : 'Reactivar'}
                      </button>
                      <span className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-mono border ${a.isActive ? "bg-emerald-950/40 border-emerald-800/40 text-emerald-300" : "bg-rose-950/40 border-rose-800/40 text-rose-300"}`}>
                        {a.isActive ? <><CheckCircle2 size={10} /> ACTIVO</> : <><AlertCircle size={10} /> INACTIVO</>}
                      </span>
                    </div>

                    {editingId === a.id && (
                      <div className="mt-3 p-3 rounded-xl bg-black/40 border border-cyan-800/30 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <span className="text-[10px] font-mono text-zinc-500 block mb-1">Comisión (%)</span>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step="0.1"
                              value={editRate}
                              onChange={(e) => setEditRate(e.target.value)}
                              className="w-full h-9 px-3 text-xs font-mono bg-black/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#ecb613]"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-zinc-500 block mb-1">Tier</span>
                            <select
                              value={editTier}
                              onChange={(e) => setEditTier(e.target.value)}
                              className="w-full h-9 px-3 text-xs font-mono bg-black/60 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#ecb613]"
                            >
                              <option value="BRONZE">BRONCE · 10%</option>
                              <option value="SILVER">PLATA · 12%</option>
                              <option value="GOLD">ORO · 15%</option>
                              <option value="PLATINUM">PLATINO · 20%</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveEdit(a)}
                            disabled={savingEdit}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ecb613] text-black text-[10px] font-mono font-bold hover:bg-amber-300 transition-all cursor-pointer disabled:opacity-40"
                          >
                            <Save size={12} /> {savingEdit ? 'Guardando...' : 'Guardar Cambios'}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                          >
                            <X size={12} /> Cancelar
                          </button>
                          {editMsg && (
                            <span className={`text-[10px] font-mono ${editMsg.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {editMsg.text}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

function AdminKpi({
  label,
  value,
  sub,
  icon,
  accentBg,
  accentText,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accentBg: string;
  accentText: string;
}) {
  return (
    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 shadow-sm hover:border-white/20 transition-all">
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${accentBg} flex items-center justify-center ${accentText}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold font-mono text-white">{value}</div>
      <p className="text-[11px] text-zinc-400 mt-1">{sub}</p>
    </div>
  );
}

function SplitBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#050508] p-3">
      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mb-2">
        <span>{label}</span>
        <span style={{ color }} className="font-bold">{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
