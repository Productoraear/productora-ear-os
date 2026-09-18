"use client";

import React, { useState, useEffect } from 'react';
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
  RefreshCw
} from 'lucide-react';

interface AffiliatePartner {
  id: string;
  name: string;
  type: string;
  leadsCount: number;
  commissionEarned: string;
  status: string;
  split: string;
  code?: string;
  email?: string;
}

export default function AfiliadosAdminCatminPage() {
  const [partners, setPartners] = useState<AffiliatePartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAffiliates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/affiliates/register');
      const data = await res.json();
      if (data.success && Array.isArray(data.affiliates)) {
        const mapped = data.affiliates.map((item: any) => ({
          id: item.affiliateCode || item.id,
          code: item.affiliateCode,
          name: item.companyName || item.name,
          type: item.category === 'FINCA_ESPACIO' ? 'Finca / Espacio' :
                item.category === 'WEDDING_PLANNER' ? 'Wedding Planner' :
                item.category === 'CATERING' ? 'Catering' : 'Prescriptor B2B',
          leadsCount: 0,
          commissionEarned: '0,00 €',
          status: item.status === 'ACTIVE_HOMOLOGATED' ? 'ACTIVO' : 'PENDIENTE',
          split: 'Split 10% Neto',
          email: item.email
        }));
        setPartners(mapped);
      } else {
        setPartners([]);
      }
    } catch (e) {
      console.warn('Error fetching affiliates:', e);
      setPartners([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const filteredPartners = partners.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase()) ||
    (p.code && p.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* ===================================================================== */}
      {/* 1. HEADER DE PÁGINA CATMÍN                                            */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a24] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Admin</span>
            <span>/</span>
            <span>Finanzas</span>
            <span>/</span>
            <span className="text-[#ecb613] font-bold">Red de Afiliados Fincas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-syne uppercase mt-1">
            Red de Afiliados & Split 80/10/10
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAffiliates}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
          <div className="flex items-center gap-2 bg-[#ecb613]/10 border border-[#ecb613]/30 px-3 py-1.5 rounded-xl text-xs font-mono text-[#ecb613]">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Alianzas Nupciales Transparentes</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. CATMÍN ROW 1: 4 TARJETAS KPI DE AFILIADOS                          */}
      {/* ===================================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Comisiones B2B Liquidadas</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">0,00 €</div>
          <p className="text-[11px] text-zinc-400 mt-1">10% devengado a partners</p>
          <div className="mt-2 flex items-center text-xs font-mono text-zinc-500 font-medium">
            <Clock className="mr-1 h-3.5 w-3.5" />
            Sin Liquidaciones Pendientes
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Partners Homologados</span>
            <div className="w-8 h-8 rounded-lg bg-[#ecb613]/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#ecb613]" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{partners.length} Espacios</div>
          <p className="text-[11px] text-zinc-400 mt-1">Fincas, cáterings y planners reales</p>
          <div className="mt-2 flex items-center text-xs font-mono text-[#ecb613] font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Cero Cuotas Fijas
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Eventos Derivados</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">0 Eventos</div>
          <p className="text-[11px] text-zinc-400 mt-1">Bodas y galas exclusivas</p>
          <div className="mt-2 flex items-center text-xs font-mono text-cyan-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Sin Intermediarios
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Split Canónico</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Percent className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">80 / 10 / 10</div>
          <p className="text-[11px] text-zinc-400 mt-1">Protección Artista & VIMUME</p>
          <div className="mt-2 flex items-center text-xs font-mono text-purple-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Inmutable en Contratos
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 3. LISTADO DE PARTNERS Y LIQUIDACIONES (ESTILO CATMÍN)                */}
      {/* ===================================================================== */}
      <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-3">
          <div>
            <h2 className="text-base font-bold font-syne text-white uppercase">
              Partners y Fincas Conectadas
            </h2>
            <p className="text-xs text-zinc-500">Liquidación del 10% por contrato mercantil tras confirmación en Stripe</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar partner..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-colors"
              />
            </div>

            <a
              href="/afiliados"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 text-xs font-mono text-[#ecb613] hover:bg-[#ecb613]/20 flex items-center gap-1.5 transition-all shrink-0"
            >
              <span>Alta Autónoma (/afiliados)</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {filteredPartners.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <HeartHandshake className="w-10 h-10 text-zinc-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white font-mono">0 Partners de Afiliación Activos</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                No hay afiliados ni fincas ficticias (cero vanidad). Los prescriptores, fincas y planners podrán darse de alta de manera autónoma en el portal público o ser enrolados manualmente con su CIF y cuenta de liquidación.
              </p>
            </div>
            <div className="pt-2">
              <a
                href="/afiliados"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ecb613] text-black font-mono font-bold text-xs hover:bg-[#d4a210] transition-colors shadow-lg shadow-[#ecb613]/20"
              >
                <span>Ver Portal de Registro Autónomo (/afiliados)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#ecb613] font-bold bg-[#ecb613]/10 px-1.5 py-0.5 rounded border border-[#ecb613]/20">
                      {partner.id}
                    </span>
                    <h3 className="text-sm font-bold text-white">{partner.name}</h3>
                  </div>
                  <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                    <span>{partner.type}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-500 font-mono text-[11px]">{partner.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-500 block">EVENTOS</span>
                    <span className="font-mono font-bold text-white text-xs">{partner.leadsCount} eventos</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-500 block">COMISIÓN DEVENGADA</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">{partner.commissionEarned}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-500 block">ESTADO</span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                      partner.status === 'ACTIVO'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                    }`}>
                      {partner.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
