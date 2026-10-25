'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Radio,
  RefreshCcw,
  Send,
  ExternalLink,
  Landmark,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Search,
} from 'lucide-react';

interface Opportunity {
  id: string;
  source: string;
  sourceUrl?: string;
  title: string;
  description?: string;
  url: string;
  publishedAt?: string | null;
  categories: string[];
  matchScore: number;
  matchReasons?: string[];
  vimumeCompatible?: boolean;
  proximityZone?: string;
  locationName?: string;
  isOnlineTramitacion?: boolean;
  firstSeenAt?: string;
}

interface RadarApiResponse {
  success: boolean;
  total: number;
  storedTotal: number;
  lastScanAt: string | null;
  scanCount: number;
  opportunities: Opportunity[];
}

export default function OpportunityRadarTerminal() {
  const [mounted, setMounted] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanCount, setScanCount] = useState<number>(0);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState<Record<string, 'idle' | 'sending' | 'sent' | 'error'>>({});
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/opportunity-radar?limit=50');
      const data: RadarApiResponse = await res.json();
      if (data.success && Array.isArray(data.opportunities)) {
        setOpportunities(data.opportunities);
        setScanCount(data.scanCount);
      }
    } catch (err) {
      console.error('[OpportunityRadarTerminal] Error al cargar oportunidades:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleRunScan = async () => {
    setScanning(true);
    setScanMessage('Iniciando barrido forense en fuentes vivas (BOE + TED UE + Google News)...');
    try {
      const res = await fetch('/api/opportunity-radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scan' }),
      });
      const data = await res.json();
      if (data.success && data.scanResult) {
        const sr = data.scanResult;
        setScanMessage(
          `¡Barrido completado! ${sr.scannedFeeds} fuentes consultadas · ${sr.fetchedCount} avisos extraídos · ${sr.newCount} novedades · ${sr.telegramDispatched} despachos Telegram.`
        );
      } else {
        setScanMessage('Barrido finalizado. Almacén de oportunidades actualizado.');
      }
      await fetchOpportunities();
    } catch (err) {
      console.error('[OpportunityRadarTerminal] Error ejecutando escaneo:', err);
      setScanMessage('Error al conectar con las fuentes de red del radar.');
    } finally {
      setScanning(false);
      setTimeout(() => setScanMessage(null), 8000);
    }
  };

  const handleDispatchTelegram = async (opp: Opportunity) => {
    setDispatchStatus((prev) => ({ ...prev, [opp.id]: 'sending' }));
    try {
      const res = await fetch('/api/opportunity-radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'dispatch_telegram',
          opportunityId: opp.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDispatchStatus((prev) => ({ ...prev, [opp.id]: 'sent' }));
      } else {
        setDispatchStatus((prev) => ({ ...prev, [opp.id]: 'error' }));
      }
    } catch {
      setDispatchStatus((prev) => ({ ...prev, [opp.id]: 'error' }));
    }
  };

  const filtered = opportunities.filter((opp) => {
    const matchesCategory =
      filterCategory === 'ALL' ||
      (filterCategory === 'LICITACION' && (opp.categories.includes('LICITACION_B2G') || opp.source.includes('TED'))) ||
      (filterCategory === 'SUBVENCION' && opp.categories.includes('SUBVENCION')) ||
      (filterCategory === 'VIMUME' && (opp.vimumeCompatible || opp.categories.includes('VIMUME_SERVICIOS_SOCIALES'))) ||
      (filterCategory === 'FESTEJOS' && (opp.categories.includes('CONCURSO') || opp.title.toLowerCase().includes('fiesta')));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      opp.title.toLowerCase().includes(q) ||
      (opp.description && opp.description.toLowerCase().includes(q)) ||
      (opp.locationName && opp.locationName.toLowerCase().includes(q)) ||
      opp.source.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* HEADER DE MANDO */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${scanning ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${scanning ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#ecb613]">
              RADAR DE OPORTUNIDADES S-CLASS // BARRIDO FORENSE EN VIVO
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              TED UE + BOE + GOOGLE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-syne text-white uppercase tracking-tight">
            Centro de Caza B2G, Convocatorias y Subvenciones
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Sustituye la consola de comandos por telemetría reactiva. Captura licitaciones menores (Art. 118 LCSP &lt; 14.250 €), programas sociales VIMUME y fiestas populares en tiempo real.
          </p>
        </div>

        {/* BOTÓN PRINCIPAL DE EJECUCIÓN (EL QUE PEDÍA EL CEO) */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchOpportunities}
            disabled={loading || scanning}
            className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-[#ecb613]/50 text-zinc-300 hover:text-white transition-all disabled:opacity-50"
            title="Recargar almacén"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin text-[#ecb613]' : ''}`} />
          </button>

          <button
            onClick={handleRunScan}
            disabled={scanning}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-2.5 shadow-lg transition-all ${
              scanning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
                : 'bg-[#ecb613] hover:bg-amber-400 text-black shadow-[#ecb613]/25 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <Radio className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Escaneando Fuentes Oficiales...' : '▶ Ejecutar Barrido Radar en Vivo'}</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK DE ESTADO / ALERT NOTIFICATION */}
      {scanMessage && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-center gap-2.5 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{scanMessage}</span>
        </div>
      )}

      {/* MÉTRICAS RÁPIDAS DEL RADAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" suppressHydrationWarning>
        <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Oportunidades en Memoria</div>
          <div className="text-xl font-bold font-mono text-white mt-0.5" suppressHydrationWarning>
            {mounted ? opportunities.length : 0}
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Licitaciones / TED</div>
          <div className="text-xl font-bold font-mono text-[#ecb613] mt-0.5" suppressHydrationWarning>
            {mounted ? opportunities.filter((o) => o.categories.includes('LICITACION_B2G') || o.source === 'TED_API').length : 0}
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Compatibles VIMUME (40Hz)</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5" suppressHydrationWarning>
            {mounted ? opportunities.filter((o) => o.vimumeCompatible).length : 0}
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Barridos Históricos</div>
          <div className="text-xl font-bold font-mono text-[#ecb613] mt-0.5" suppressHydrationWarning>
            {mounted ? scanCount : 0}
          </div>
        </div>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: `Todas (${opportunities.length})` },
            { id: 'LICITACION', label: '🏛️ Licitaciones B2G' },
            { id: 'SUBVENCION', label: '💶 Subvenciones BOE' },
            { id: 'VIMUME', label: '🧠 VIMUME Social' },
            { id: 'FESTEJOS', label: '🎺 Fiestas Populares' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                filterCategory === tab.id
                  ? 'bg-[#ecb613] text-black font-bold shadow-md shadow-[#ecb613]/20'
                  : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título o municipio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs font-mono bg-black/60 border border-white/10 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-colors"
          />
        </div>
      </div>

      {/* FEED DE OPORTUNIDADES REALES */}
      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/5 space-y-2">
            <Radio className="w-8 h-8 text-zinc-600 mx-auto animate-pulse" />
            <p className="text-sm font-bold text-zinc-300">No hay oportunidades coincidentes con este filtro</p>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Pulsa el botón <b>&quot;▶ Ejecutar Barrido Radar en Vivo&quot;</b> arriba para consultar las fuentes en directo de la UE, BOE y Google News.
            </p>
          </div>
        ) : (
          filtered.slice(0, 20).map((opp) => {
            const status = dispatchStatus[opp.id] || 'idle';
            return (
              <div
                key={opp.id}
                className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-900 hover:border-zinc-700 transition-all space-y-3 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                        {opp.source}
                      </span>
                      {opp.categories.map((cat, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30"
                        >
                          {cat}
                        </span>
                      ))}
                      {opp.vimumeCompatible && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                          <HeartHandshake className="w-3 h-3" />
                          VIMUME &lt;75 dB
                        </span>
                      )}
                      {opp.locationName && (
                        <span className="text-[10px] font-mono text-zinc-500">📍 {opp.locationName}</span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-[#ecb613] transition-colors leading-snug">
                      {opp.title}
                    </h3>
                  </div>

                  {/* MATCH SCORE BADGE */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono font-extrabold text-emerald-400">
                        {opp.matchScore}% MATCH
                      </div>
                      <div className="text-[9px] font-mono text-zinc-500">
                        {opp.publishedAt ? new Date(opp.publishedAt).toLocaleDateString('es-ES') : 'En radar'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN REAL */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-900/80">
                  <div className="flex items-center gap-2">
                    <a
                      href={opp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors border border-zinc-800"
                    >
                      <span>Abrir Pliego Oficial</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <a
                      href={`/admin/licitaciones?title=${encodeURIComponent(opp.title)}&url=${encodeURIComponent(opp.url)}`}
                      className="px-3 py-1.5 rounded-lg bg-[#ecb613]/10 hover:bg-[#ecb613]/20 text-xs font-mono text-[#ecb613] flex items-center gap-1.5 transition-colors border border-[#ecb613]/30"
                    >
                      <Landmark className="w-3 h-3" />
                      <span>Expediente Art. 118</span>
                    </a>
                  </div>

                  {/* DESPACHO A TELEGRAM 1-CLIC */}
                  <button
                    onClick={() => handleDispatchTelegram(opp)}
                    disabled={status === 'sending' || status === 'sent'}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                      status === 'sent'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : status === 'sending'
                        ? 'bg-zinc-800 text-zinc-400 cursor-wait'
                        : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {status === 'sent' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>¡Enviado a Telegram!</span>
                      </>
                    ) : status === 'sending' ? (
                      <>
                        <RefreshCcw className="w-3 h-3 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3 text-cyan-400" />
                        <span>Despachar a Telegram (+34 693 693 048)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
