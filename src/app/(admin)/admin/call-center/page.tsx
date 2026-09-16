"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Search,
  ExternalLink,
  Copy,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Flame,
  MessageSquare,
  FileSpreadsheet,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface ProviderLead {
  id: string | number;
  name: string;
  category: string;
  subcategory?: string;
  province: string;
  municipality?: string;
  phone?: string;
  rating?: number;
  reviewsCount?: number;
  image?: string;
  web?: string;
  status?: 'pending' | 'contacted' | 'interested' | 'rejected' | 'closed';
  notes?: string;
}

export default function CallCenterAdminPage() {
  const [providers, setProviders] = useState<ProviderLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [provinceFilter, setProvinceFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [activeTab, setActiveTab] = useState<'audit' | 'pitch' | 'wa' | 'crm'>('audit');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // CRM persistence in localStorage
  const [crmData, setCrmData] = useState<Record<string, { status: string; notes: string; updated: string }>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ear_call_center_crm');
      if (saved) {
        setCrmData(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Error reading CRM localStorage:', e);
    }
  }, []);

  const saveCRM = (id: string | number, status: string, notes: string) => {
    const next = {
      ...crmData,
      [id]: { status, notes, updated: new Date().toISOString() }
    };
    setCrmData(next);
    try {
      localStorage.setItem('ear_call_center_crm', JSON.stringify(next));
    } catch (e) {
      console.warn('Error saving CRM localStorage:', e);
    }
  };

  // Carga inicial de proveedores reales
  useEffect(() => {
    async function loadProviders() {
      setLoading(true);
      try {
        const res = await fetch('/api/profiles/search?limit=100&page=1');
        if (res.ok) {
          const data = await res.json();
          const list = data.providers || [];
          setProviders(list);
          if (list.length > 0) {
            setSelectedId(list[0].id);
          }
        }
      } catch (err) {
        console.error('Error cargando proveedores para Call Center:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProviders();
  }, []);

  const selectedProvider = useMemo(() => {
    return providers.find(p => p.id === selectedId) || providers[0] || null;
  }, [providers, selectedId]);

  const currentCRM = useMemo(() => {
    if (!selectedProvider) return { status: 'pending', notes: '' };
    return crmData[selectedProvider.id] || { status: 'pending', notes: '' };
  }, [selectedProvider, crmData]);

  const filteredProviders = useMemo(() => {
    return providers.filter(p => {
      if (categoryFilter !== 'ALL' && (p.category || '').toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }
      if (provinceFilter !== 'ALL' && (p.province || '').toLowerCase() !== provinceFilter.toLowerCase()) {
        return false;
      }
      const st = crmData[p.id]?.status || 'pending';
      if (statusFilter !== 'ALL' && st !== statusFilter) {
        return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = (p.name || '').toLowerCase().includes(q);
        const matchMuni = (p.municipality || '').toLowerCase().includes(q);
        const matchProv = (p.province || '').toLowerCase().includes(q);
        if (!matchName && !matchMuni && !matchProv) return false;
      }
      return true;
    });
  }, [providers, categoryFilter, provinceFilter, statusFilter, searchQuery, crmData]);

  // Copy helper
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Export CRM data
  const handleExportCSV = () => {
    const rows = [
      ['ID', 'Nombre', 'Categoria', 'Provincia', 'Telefono', 'Estado CRM', 'Notas CRM', 'Fecha Actualizacion']
    ];
    providers.forEach(p => {
      const c = crmData[p.id] || { status: 'pending', notes: '', updated: '' };
      rows.push([
        String(p.id),
        `"${(p.name || '').replace(/"/g, '""')}"`,
        p.category || '',
        p.province || '',
        p.phone || '',
        c.status,
        `"${(c.notes || '').replace(/"/g, '""')}"`,
        c.updated || ''
      ]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EAR_CRM_EXPORT_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp generator
  const getWhatsAppMessage = (p: ProviderLead | null) => {
    if (!p) return '';
    const cleanPhone = (p.phone || '').replace(/\D/g, '');
    const cleanName = p.name || 'Compañero';
    const cleanCat = p.category || 'servicios para bodas';
    const cleanProv = p.province || 'España';
    return `Hola ${cleanName}, te escribo de Productora EAR. Estábamos auditando proveedores destacados de ${cleanCat} en ${cleanProv} y nos ha llamado mucho la atención tu propuesta. En EAR OS no cobramos mensualidades fijas; queremos incluirte gratis en nuestro catálogo verificado y derivarte bodas cerradas con señal y contrato directo. ¿Te viene bien si te paso el enlace para activar tu perfil? Un saludo.`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1a1a24] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-wider">
            <PhoneCall className="w-4 h-4 text-[#ecb613]" />
            Telemarketing & Prospección Outbound S-Class
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1 font-mono">
            Call Center de Proveedores Nacional
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Consola táctica de telemarketing sobre 39.500+ fichas auditadas, guiones de objeción y cierre hacia WhatsApp.
          </p>
        </div>

        {/* Action Strip */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:border-[#ecb613]/40 flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            Exportar CSV
          </button>
          <a
            href="/EAR_CALL_CENTER_PROVEEDORES.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/40 text-xs font-mono text-[#ecb613] hover:bg-[#ecb613]/20 flex items-center gap-1.5 transition-colors font-semibold"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Deck Standalone (39.5K)
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#050508] border border-[#1a1a24]">
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Total en Vista</span>
          <span className="text-2xl font-bold text-white font-mono">{filteredProviders.length}</span>
        </div>
        <div className="p-4 rounded-xl bg-[#050508] border border-[#1a1a24]">
          <span className="text-[10px] font-mono text-amber-500 uppercase block">En Conversación</span>
          <span className="text-2xl font-bold text-amber-400 font-mono">
            {Object.values(crmData).filter(c => c.status === 'contacted').length}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#050508] border border-[#1a1a24]">
          <span className="text-[10px] font-mono text-emerald-500 uppercase block">Interesados</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono">
            {Object.values(crmData).filter(c => c.status === 'interested').length}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-[#050508] border border-[#1a1a24]">
          <span className="text-[10px] font-mono text-purple-500 uppercase block">Cerrados</span>
          <span className="text-2xl font-bold text-purple-400 font-mono">
            {Object.values(crmData).filter(c => c.status === 'closed').length}
          </span>
        </div>
      </div>

      {/* Main Two-Column Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
        {/* Left Column: Filterable Provider List (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-[#050508] border border-[#1a1a24] rounded-2xl overflow-hidden">
          {/* Filters Bar */}
          <div className="p-3 border-b border-[#1a1a24] space-y-2 bg-black/40">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nombre, municipio, provincia..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]/50 font-mono"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-zinc-300 focus:outline-none"
              >
                <option value="ALL">Todas las Categorías</option>
                <option value="musica">Música</option>
                <option value="finca">Fincas</option>
                <option value="sonido">Sonido</option>
                <option value="catering">Catering</option>
                <option value="foto">Fotografía</option>
                <option value="wedding">Wedding Planners</option>
              </select>

              <select
                value={provinceFilter}
                onChange={e => setProvinceFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-zinc-300 focus:outline-none"
              >
                <option value="ALL">Todas las Provincias</option>
                <option value="Madrid">Madrid</option>
                <option value="Toledo">Toledo</option>
                <option value="Barcelona">Barcelona</option>
                <option value="Sevilla">Sevilla</option>
                <option value="Valencia">Valencia</option>
                <option value="Málaga">Málaga</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-zinc-300 focus:outline-none"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="pending">⚪ Pendientes</option>
                <option value="contacted">🟡 En Conversación</option>
                <option value="interested">🟢 Interesados</option>
                <option value="closed">🟣 Cerrados</option>
                <option value="rejected">🔴 Descartados</option>
              </select>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto max-h-[580px] divide-y divide-[#1a1a24]">
            {loading ? (
              <div className="p-8 text-center text-xs font-mono text-zinc-500">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#ecb613]" />
                Indexando catálogo de proveedores...
              </div>
            ) : filteredProviders.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-zinc-500">
                No se encontraron proveedores con los filtros actuales.
              </div>
            ) : (
              filteredProviders.map(p => {
                const isSelected = p.id === selectedProvider?.id;
                const st = crmData[p.id]?.status || 'pending';
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full p-3.5 text-left transition-colors flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#ecb613]/10 border-l-2 border-[#ecb613]'
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{p.name}</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-[#ecb613]">
                          {p.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {p.province || 'España'}
                        </span>
                        {p.phone && (
                          <span className="text-zinc-400">
                            {p.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        st === 'interested' ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' :
                        st === 'contacted' ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]' :
                        st === 'closed' ? 'bg-purple-400 shadow-[0_0_6px_#c084fc]' :
                        st === 'rejected' ? 'bg-red-400' : 'bg-zinc-600'
                      }`} title={`Estado: ${st}`} />
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#ecb613]' : 'text-zinc-600'}`} />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Tactical Calling Deck & Scripts (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-[#050508] border border-[#1a1a24] rounded-2xl overflow-hidden">
          {selectedProvider ? (
            <>
              {/* Top Details Card */}
              <div className="p-5 border-b border-[#1a1a24] bg-black/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-500">ID #{selectedProvider.id}</span>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 rounded">
                        {selectedProvider.category.toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight mt-1 font-mono">
                      {selectedProvider.name}
                    </h2>
                    <div className="text-xs text-zinc-400 flex items-center gap-2 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#ecb613]" />
                      <span>{selectedProvider.municipality ? `${selectedProvider.municipality}, ` : ''}{selectedProvider.province}</span>
                    </div>
                  </div>

                  {/* Phone & Direct Dial Buttons */}
                  <div className="flex items-center gap-2">
                    {selectedProvider.phone ? (
                      <>
                        <a
                          href={`tel:${selectedProvider.phone}`}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-colors"
                        >
                          <PhoneCall className="w-4 h-4" />
                          Llamar ({selectedProvider.phone})
                        </a>
                        <button
                          onClick={() => handleCopy(selectedProvider.phone || '', 'phone')}
                          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                          title="Copiar Teléfono"
                        >
                          {copiedField === 'phone' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
                        Sin teléfono directo
                      </span>
                    )}

                    {selectedProvider.phone && (
                      <a
                        href={`https://wa.me/${(selectedProvider.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(getWhatsAppMessage(selectedProvider))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-white font-mono text-xs flex items-center gap-1.5 transition-colors"
                        title="Abrir WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                        WA
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Deck Tabs */}
              <div className="flex border-b border-[#1a1a24] bg-zinc-950 px-4 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`py-3 px-4 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'audit'
                      ? 'border-[#ecb613] text-[#ecb613]'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  Auditoría Digital
                </button>
                <button
                  onClick={() => setActiveTab('pitch')}
                  className={`py-3 px-4 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'pitch'
                      ? 'border-[#ecb613] text-[#ecb613]'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Guion Telefónico (Pitch)
                </button>
                <button
                  onClick={() => setActiveTab('wa')}
                  className={`py-3 px-4 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'wa'
                      ? 'border-[#ecb613] text-[#ecb613]'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Plantilla WhatsApp
                </button>
                <button
                  onClick={() => setActiveTab('crm')}
                  className={`py-3 px-4 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'crm'
                      ? 'border-[#ecb613] text-[#ecb613]'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Registro CRM
                </button>
              </div>

              {/* Tab Contents */}
              <div className="p-6 flex-1 overflow-y-auto space-y-4">
                {activeTab === 'audit' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-[#ecb613] font-semibold">
                        <span>DIAGNÓSTICO COMERCIAL // AUDITORÍA EAR OS</span>
                        <span className="text-emerald-400">SCORE: 92/100</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        Este proveedor cuenta con presencia en portales tradicionales donde probablemente paga entre 100€ y 300€ al mes por un escaparate pasivo. El ángulo de ataque perfecto es destacar la <strong>ausencia total de cuotas fijas en Productora EAR</strong> y el depósito garantizado mediante Stripe Price-Lock.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1.5">
                      <span className="text-[11px] font-mono text-amber-400 font-bold uppercase">⚡ Gancho Rompehielos:</span>
                      <p className="text-xs text-zinc-200 italic font-sans">
                        "Estuvimos revisando las mejores opciones de {selectedProvider.category} en {selectedProvider.province} y tu valoración es impecable. Queremos darte acceso prioritario a nuestro canal de eventos privados sin ningún coste de suscripción."
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'pitch' && (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                      <span className="font-mono font-bold text-[#ecb613] block">PASO 1: Saludo de Autoridad & Halago</span>
                      <p className="text-zinc-300 leading-relaxed">
                        "Hola <strong>{selectedProvider.name}</strong>, buenos días. Te llamo de <strong>Productora EAR</strong>. Estábamos auditando los mejores proveedores de {selectedProvider.category} en {selectedProvider.province} y tu ficha destaca por su reputación. ¿Tienes un minuto rápido?"
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                      <span className="font-mono font-bold text-cyan-400 block">PASO 2: La Propuesta (Antítesis de Bodas.net)</span>
                      <p className="text-zinc-300 leading-relaxed">
                        "Te contacto porque sabemos que portales tradicionales cobran cuotas fijas mensuales consigas o no eventos. En <strong>Productora EAR</strong> no cobramos ninguna suscripción. Cero euros. Te incorporamos en nuestro catálogo de distribución y te derivamos clientes con contrato y depósito garantizado."
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                      <span className="font-mono font-bold text-emerald-400 block">PASO 3: Cierre Suave (Call to Action)</span>
                      <p className="text-zinc-300 leading-relaxed">
                        "Hemos preparado tu ficha verificada en nuestro sistema. ¿Te parece bien si te envío ahora mismo el enlace directo por WhatsApp para que la revises y confirmemos tu activación gratuita?"
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'wa' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                      <span>Plantilla Pre-Rellenada para {selectedProvider.name}</span>
                      <button
                        onClick={() => handleCopy(getWhatsAppMessage(selectedProvider), 'wa')}
                        className="text-[#ecb613] hover:underline flex items-center gap-1"
                      >
                        {copiedField === 'wa' ? '¡Copiado!' : 'Copiar Texto'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={getWhatsAppMessage(selectedProvider)}
                      className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                )}

                {activeTab === 'crm' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-zinc-400 block">Estado de la Gestión:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                        {(['pending', 'contacted', 'interested', 'closed', 'rejected'] as const).map(st => (
                          <button
                            key={st}
                            onClick={() => saveCRM(selectedProvider.id, st, currentCRM.notes)}
                            className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                              currentCRM.status === st
                                ? 'bg-[#ecb613] text-black border-[#ecb613]'
                                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            {st === 'pending' && '⚪ Pendiente'}
                            {st === 'contacted' && '🟡 Contactado'}
                            {st === 'interested' && '🟢 Interesado'}
                            {st === 'closed' && '🟣 Cerrado'}
                            {st === 'rejected' && '🔴 Descartado'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-mono text-zinc-400 block">Notas de la Llamada:</span>
                      <textarea
                        rows={5}
                        placeholder="Escribe aquí observaciones, tarifas negociadas, nombre de la persona de contacto..."
                        value={currentCRM.notes}
                        onChange={e => saveCRM(selectedProvider.id, currentCRM.status, e.target.value)}
                        className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-[#ecb613]/50"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs font-mono text-zinc-500 my-auto">
              Selecciona un proveedor del listado para iniciar la llamada o enviar propuesta.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
