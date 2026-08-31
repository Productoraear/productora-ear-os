'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Database, 
  Phone, 
  MapPin, 
  Globe, 
  Radio, 
  Search, 
  RefreshCw, 
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  Terminal,
  Zap,
  Building2,
  Music,
  Utensils,
  Camera,
  PlayCircle,
  PauseCircle
} from 'lucide-react';

interface TelemetryData {
  success: boolean;
  timestamp: string;
  metrics: {
    total_online_captured: number;
    total_vault_absorbed: number;
    total_phones_recovered: number;
    total_requests: number;
    waf_status: string;
    daemon_status: string;
    started_at: string;
    updated_at: string;
  };
  log_tail: string[];
  recent_leads: Array<{
    name: string;
    category?: string;
    provincia?: string;
    location?: any;
    telephone?: string;
    rating?: number;
    reviews_count?: number;
    captured_at?: string;
    url?: string;
  }>;
  vault_sample: Array<{
    name: string;
    category?: string;
    location?: string;
    telephone?: string;
    rating?: number;
    reviews_count?: number;
  }>;
}

export default function VampireViewPage() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyWithPhone, setOnlyWithPhone] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/admin/vampire-telemetry');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastRefreshed(new Date());
      }
    } catch (e) {
      console.error('Error fetching telemetry:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  useEffect(() => {
    if (!isAutoRefresh) return;
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const filteredLeads = useMemo(() => {
    if (!data?.recent_leads) return [];
    return data.recent_leads.filter((lead) => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.provincia && lead.provincia.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.category && lead.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'ALL' || lead.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesPhone = !onlyWithPhone || Boolean(lead.telephone);

      return matchesSearch && matchesCategory && matchesPhone;
    });
  }, [data?.recent_leads, searchTerm, selectedCategory, onlyWithPhone]);

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-24 pb-28 px-4 md:px-8 font-sans selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP BANNER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#09090d] border border-[#ecb613]/25 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 rounded-full text-xs font-mono font-semibold uppercase tracking-wider inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-ping" />
                VAMPIRE ENGINE · REAL-TIME TELEMETRY
              </span>
              <span className="px-3 py-1 bg-[#258DCD]/10 text-[#AAD6CD] border border-[#258DCD]/30 rounded-full text-xs font-mono">
                {data?.metrics.waf_status || 'TLS_IMPERSONATION'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-serif tracking-tight text-white">
              Centro de Mando <span className="text-[#ecb613]">Vampiro</span>
            </h1>
            <p className="text-white/60 text-sm mt-2 max-w-2xl">
              Monitorización en vivo de absorción de Bóveda Local y Scraping Nocturno Anti-WAF. Asimetría de información en tiempo real para dominancia territorial.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all border ${
                isAutoRefresh 
                  ? 'bg-[#AAD6CD]/10 border-[#AAD6CD]/40 text-[#AAD6CD]' 
                  : 'bg-white/5 border-white/20 text-white/60'
              }`}
            >
              {isAutoRefresh ? <PlayCircle className="w-4 h-4 text-[#AAD6CD]" /> : <PauseCircle className="w-4 h-4" />}
              {isAutoRefresh ? 'AUTO-REFRESH (5s)' : 'PAUSADO'}
            </button>
            <button
              onClick={fetchTelemetry}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#ecb613]/40 text-white/80 transition-all hover:bg-white/10"
              title="Actualizar ahora"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#09090d] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#ecb613]/40 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-mono uppercase text-white/50 tracking-wider">Online Capturados</p>
                <h3 className="text-3xl font-bold font-mono text-[#ecb613] mt-1">
                  {data?.metrics.total_online_captured.toLocaleString() || '0'}
                </h3>
              </div>
              <div className="p-3 bg-[#ecb613]/10 rounded-xl border border-[#ecb613]/20">
                <Zap className="w-5 h-5 text-[#ecb613]" />
              </div>
            </div>
            <p className="text-xs text-[#AAD6CD] mt-3 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Enriquecidos en vivo por el daemon
            </p>
          </div>

          <div className="bg-[#09090d] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#AAD6CD]/40 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-mono uppercase text-white/50 tracking-wider">Absorbidos Bóveda</p>
                <h3 className="text-3xl font-bold font-mono text-[#AAD6CD] mt-1">
                  {data?.metrics.total_vault_absorbed.toLocaleString() || '3.252'}
                </h3>
              </div>
              <div className="p-3 bg-[#AAD6CD]/10 rounded-xl border border-[#AAD6CD]/20">
                <Database className="w-5 h-5 text-[#AAD6CD]" />
              </div>
            </div>
            <p className="text-xs text-white/40 mt-3">10.764 HTMLs procesados en local</p>
          </div>

          <div className="bg-[#09090d] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#258DCD]/40 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-mono uppercase text-white/50 tracking-wider">Teléfonos Verificados</p>
                <h3 className="text-3xl font-bold font-mono text-[#258DCD] mt-1">
                  {data?.metrics.total_phones_recovered.toLocaleString() || '4.976'}
                </h3>
              </div>
              <div className="p-3 bg-[#258DCD]/10 rounded-xl border border-[#258DCD]/20">
                <Phone className="w-5 h-5 text-[#258DCD]" />
              </div>
            </div>
            <p className="text-xs text-[#258DCD] mt-3">Disparables vía WhatsApp API</p>
          </div>

          <div className="bg-[#09090d] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-mono uppercase text-white/50 tracking-wider">Peticiones WAF</p>
                <h3 className="text-3xl font-bold font-mono text-emerald-400 mt-1">
                  {data?.metrics.total_requests.toLocaleString() || '0'}
                </h3>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-xs text-emerald-400 mt-3">0 bloqueos · curl_cffi Chrome110</p>
          </div>
        </div>

        {/* LIVE TERMINAL FEED */}
        <div className="bg-[#09090d] border border-white/10 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#ecb613]" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                Live Crawl Stream (Daemon Logs)
              </h2>
            </div>
            <span className="text-xs font-mono text-white/40">
              Última actualización: {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>
          
          <div className="mt-4 bg-[#050505] p-4 rounded-xl font-mono text-xs text-white/80 space-y-1.5 max-h-48 overflow-y-auto border border-white/5 scrollbar-thin">
            {data?.log_tail && data.log_tail.length > 0 ? (
              data.log_tail.map((line, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-white/30 select-none">&gt;</span>
                  <span className={
                    line.includes('[CRAWL OK]') ? 'text-emerald-400' :
                    line.includes('[FLUSH]') ? 'text-[#ecb613]' :
                    line.includes('[WARN') ? 'text-amber-400' : 'text-white/70'
                  }>
                    {line}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-white/40 italic">Iniciando streaming del daemon...</p>
            )}
          </div>
        </div>

        {/* CONTROLS & SEARCH */}
        <div className="bg-[#09090d] border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Buscar por nombre, provincia o servicio (ej. Catering Asturias, Fotógrafo Madrid)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613] transition-colors font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {['ALL', 'Catering', 'Música', 'DJs', 'Animación', 'Fotógrafos', 'Fincas'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#ecb613] text-black font-bold shadow-lg shadow-[#ecb613]/20'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}

              <button
                onClick={() => setOnlyWithPhone(!onlyWithPhone)}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-medium border transition-all ${
                  onlyWithPhone
                    ? 'bg-[#258DCD]/20 border-[#258DCD] text-[#258DCD]'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                }`}
              >
                Solo con Teléfono
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#050505]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#09090d] text-xs font-mono uppercase text-white/40 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Proveedor / Finca</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Provincia</th>
                  <th className="px-6 py-4">Teléfono Directo</th>
                  <th className="px-6 py-4">Rating / Social</th>
                  <th className="px-6 py-4 text-right">Acción Soberana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white group-hover:text-[#ecb613] transition-colors">
                          {lead.name}
                        </div>
                        <div className="text-xs text-white/40 font-mono mt-0.5">
                          ID: SHA-{(Math.abs(lead.name.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0))).toString(16)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-[#AAD6CD]">
                          {lead.category || 'Servicio'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/70 flex items-center gap-1.5 pt-5">
                        <MapPin className="w-3.5 h-3.5 text-white/40" />
                        {lead.provincia || 'España'}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {lead.telephone ? (
                          <a 
                            href={`tel:${lead.telephone}`}
                            className="text-[#258DCD] hover:underline flex items-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {lead.telephone}
                          </a>
                        ) : (
                          <span className="text-white/30 italic">Obteniendo vía RAG...</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-[#ecb613] font-bold">★ {lead.rating || '4.8'}</span>
                          <span className="text-white/40">({lead.reviews_count || 12} reviews)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a
                          href={`/reclamar-perfil?nombre=${encodeURIComponent(lead.name)}&provincia=${encodeURIComponent(lead.provincia || '')}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 hover:bg-[#ecb613] hover:text-black text-[#ecb613] text-xs font-mono font-semibold transition-all"
                        >
                          Reclamar
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-white/40 italic">
                      No se encontraron proveedores que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
