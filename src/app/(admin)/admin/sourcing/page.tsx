'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Flame,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Heart,
  Volume2,
  ExternalLink,
  ShieldCheck,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';
import initialLeads from '@/data/sourcing/vimume_senior_leads.json';
import { BudgetMatrix } from './components/BudgetMatrix';

interface Lead {
  id: string;
  nombre: string;
  tipo: string;
  municipio: string;
  direccion: string;
  telefono: string;
  distancia_km: number;
  coordenadas: string;
  estado: 'nuevo' | 'contactado' | 'interesado' | 'cita_agendada' | 'no_llamar';
  pitch_recomendado: string;
  condiciones: string;
  web?: string;
  notas?: string;
}

export default function SourcingHubPage() {
  const [activeTab, setActiveTab] = useState<'LEADS' | 'MATRIX'>('LEADS');
  const [leads, setLeads] = useState<Lead[]>(() => {
    return (initialLeads as any[]).map((item, idx) => ({
      id: item.id || `senior-lead-${idx + 1}`,
      nombre: item.nombre || 'Centro Sin Nombre',
      tipo: item.tipo || 'Residencia de Mayores',
      municipio: item.municipio || item.provincia || 'España',
      direccion: item.direccion || 'Consultar registro municipal',
      telefono: item.telefono || '',
      distancia_km: Number(item.distancia_km ?? item.distancia_mentrida_km ?? 0),
      coordenadas: item.coordenadas || 'N/D',
      estado: (item.estado || item.estado_prospeccion || 'nuevo') as Lead['estado'],
      pitch_recomendado: item.pitch_recomendado || 'VIMUME Neuroacústica & Directo de Gala Edwin Agudelo (350 €)',
      condiciones: item.condiciones || 'Sonido Bose < 75 dB SPL, Contrato Menor Art. 118 LCSP',
      web: item.web || ''
    }));
  });
  const [activeFilter, setActiveFilter] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showPitch, setShowPitch] = useState<boolean>(true);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // KPIs
  const stats = useMemo(() => {
    const isRealPhone = (ph: string) => {
      const clean = (ph || '').replace(/[^0-9]/g, '');
      const num9 = clean.slice(-9);
      return clean.length >= 9 && ['6', '7', '8', '9'].includes(num9[0]) && !['703831064', '721056835', '693693048', '999999999'].includes(clean);
    };

    return {
      total: leads.length,
      verificados: leads.filter(l => isRealPhone(l.telefono)).length,
      nuevos: leads.filter(l => l.estado === 'nuevo').length,
      interesados: leads.filter(l => l.estado === 'interesado').length,
      citas: leads.filter(l => l.estado === 'cita_agendada').length,
      ceroKm: leads.filter(l => l.distancia_km <= 50).length
    };
  }, [leads]);

  // Filtrado
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (activeFilter === 'RESIDENCIAS' && !lead.tipo.toLowerCase().includes('residencia')) return false;
      if (activeFilter === 'CENTROS_DIA' && !lead.tipo.toLowerCase().includes('día')) return false;
      if (activeFilter === 'JUBILADOS' && !lead.tipo.toLowerCase().includes('jubilado') && !lead.tipo.toLowerCase().includes('pensionista')) return false;
      if (activeFilter === 'CERO_KM' && lead.distancia_km > 50) return false;
      if (activeFilter === 'VERIFICADOS') {
        const clean = (lead.telefono || '').replace(/[^0-9]/g, '');
        const num9 = clean.slice(-9);
        const isReal = clean.length >= 9 && ['6', '7', '8', '9'].includes(num9[0]) && !['703831064', '721056835', '693693048', '999999999'].includes(clean);
        if (!isReal) return false;
      }

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          lead.nombre.toLowerCase().includes(q) ||
          lead.municipio.toLowerCase().includes(q) ||
          lead.direccion.toLowerCase().includes(q) ||
          lead.telefono.includes(q)
        );
      }
      return true;
    });
  }, [leads, activeFilter, searchQuery]);

  const handleUpdateStatus = (id: string, newStatus: Lead['estado']) => {
    setLeads(prev =>
      prev.map(l => (l.id === id ? { ...l, estado: newStatus } : l))
    );
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/admin" className="hover:text-zinc-300 transition-colors">Admin</Link>
        <span>/</span>
        <span>Ventas</span>
        <span>/</span>
        <span className="text-[#ecb613]">Scala Leads & Sourcing</span>
      </div>

      {/* Header S-Class */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white uppercase">
            SCALA LEADS &amp; PROSPECCIÓN SENIOR
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Base Operativa Méntrida (Toledo) • <span className="text-[#ecb613]">{stats.total} Centros Senior</span> • Tarifa Solista Gala 350,00 € • Blindaje Acústico &lt; 75 dB SPL
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('LEADS')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'LEADS'
                ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            📋 Leads & Prospección Senior
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('MATRIX')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'MATRIX'
                ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            📊 Matriz Predictiva Presupuestos
          </button>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{stats.verificados} Líneas Verificadas</span>
          </div>
        </div>
      </div>

      {activeTab === 'MATRIX' ? (
        <BudgetMatrix />
      ) : (
        <>

      {/* KPI Cards CATMÍN S-Class */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] hover:border-[#ecb613]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Total Centros Senior</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-3">
            {stats.total}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-blue-400">Radio</span> Madrid • Toledo
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] hover:border-[#ecb613]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Líneas Verificadas</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-3">
            {stats.verificados}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-400">Sanitizadas</span> 0 rebotes
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] hover:border-[#ecb613]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Radio Km 0 (&lt;50 km)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#ecb613] group-hover:scale-105 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#ecb613] mt-3">
            {stats.ceroKm}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-[#ecb613]">Desplazamiento</span> 0,00 €
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] hover:border-[#ecb613]/30 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Pipeline Cualificado</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-400 mt-3">
            {stats.interesados + stats.citas}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-1 flex items-center gap-1">
            <span className="text-purple-400">{stats.citas} citas</span> agendadas
          </div>
        </div>
      </div>

      {/* Guion de Telemarketing S-Class */}
      <div className="rounded-2xl border border-[#ecb613]/30 bg-gradient-to-r from-amber-500/10 via-black to-zinc-950 p-5 shadow-[0_0_30px_rgba(236,182,19,0.08)]">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowPitch(!showPitch)}>
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#ecb613]" />
            <h2 className="text-sm font-bold font-mono tracking-wider uppercase text-white">
              GUION TÁCTICO DE LLAMADA // VIMUME B2G DIRECTO
            </h2>
          </div>
          <button className="text-xs font-mono text-[#ecb613] flex items-center gap-1 hover:underline">
            {showPitch ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showPitch ? 'Minimizar Guion' : 'Ver Guion Completo'}
          </button>
        </div>

        {showPitch && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs text-zinc-300 font-sans">
            <div className="space-y-2 bg-black/40 p-3.5 rounded-xl border border-white/5">
              <div className="font-mono font-bold text-[#ecb613] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ecb613]"></span> 1. APERTURA (15s)
              </div>
              <p className="leading-relaxed">
                "Buenos días, le llamo de Productora EAR en relación al proyecto cultural y de bienestar cognitivo <strong>VIMUME</strong>. ¿Podría hablar con la dirección o animación sociocultural?"
              </p>
            </div>

            <div className="space-y-2 bg-black/40 p-3.5 rounded-xl border border-white/5">
              <div className="font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span> 2. PROPUESTA DE VALOR
              </div>
              <p className="leading-relaxed">
                "Ofrecemos actuaciones en directo de gala con <strong>Edwin Agudelo</strong>, diseñadas para personas mayores: copla, boleros, zarzuela con sonido acústico envolvente (<strong>&lt;75 dB SPL</strong>)."
              </p>
            </div>

            <div className="space-y-2 bg-black/40 p-3.5 rounded-xl border border-white/5">
              <div className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 3. CONDICIONES & CIERRE
              </div>
              <p className="leading-relaxed">
                "Tarifa cerrada de <strong>350,00 €</strong> sin sobrecoste de desplazamiento en su zona. Facturación oficial bajo contrato menor (<strong>Art. 118 LCSP</strong>)."
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Barra de Filtros & Búsqueda */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: 'TODOS', label: 'Todos los Centros' },
            { id: 'VERIFICADOS', label: '✓ Solo Teléfonos Verificados' },
            { id: 'CERO_KM', label: '0 € Km (<50 km)' },
            { id: 'RESIDENCIAS', label: 'Residencias' },
            { id: 'CENTROS_DIA', label: 'Centros de Día' },
            { id: 'JUBILADOS', label: 'Hogares del Jubilado' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_15px_rgba(236,182,19,0.3)]'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por centro, municipio, teléfono..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]"
          />
        </div>
      </div>

      {/* Tabla de Leads */}
      <div className="bg-[#050508] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/5 border-b border-white/10 font-mono text-[11px] text-zinc-400 uppercase">
              <tr>
                <th className="px-5 py-3.5">Centro / Entidad</th>
                <th className="px-4 py-3.5">Tipología</th>
                <th className="px-4 py-3.5">Ubicación & Distancia</th>
                <th className="px-4 py-3.5">Teléfono / Acción</th>
                <th className="px-4 py-3.5">Estado CRM</th>
                <th className="px-4 py-3.5 text-right">GPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-white text-sm">{lead.nombre}</div>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#ecb613]" />
                      <span>{lead.direccion}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300">
                      {lead.tipo}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-medium text-white">{lead.municipio}</div>
                    <div className="text-[11px] font-mono mt-0.5">
                      {lead.distancia_km <= 50 ? (
                        <span className="text-emerald-400 font-bold">{lead.distancia_km} km (0 € Km)</span>
                      ) : (
                        <span className="text-zinc-400">{lead.distancia_km} km (+{((lead.distancia_km - 50) * 1.5).toFixed(0)}€)</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const rawPhone = lead.telefono || '';
                        const cleanDigits = rawPhone.replace(/[^0-9]/g, '');
                        const num9 = cleanDigits.slice(-9);
                        const isReal = cleanDigits.length >= 9 && ['6', '7', '8', '9'].includes(num9[0]) && !['703831064', '721056835', '693693048', '999999999'].includes(cleanDigits);

                        if (isReal) {
                          const dialNumber = rawPhone.split(';')[0].trim();
                          return (
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`tel:${dialNumber.replace(/\s+/g, '')}`}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
                                title="Llamar a línea verificada"
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>{dialNumber}</span>
                              </a>
                              <button
                                onClick={() => handleCopyPhone(dialNumber)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                                title="Copiar Teléfono"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              {copiedPhone === dialNumber && (
                                <span className="text-[10px] text-emerald-400 font-mono">¡Copiado!</span>
                              )}
                            </div>
                          );
                        } else {
                          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(lead.nombre + ' ' + lead.municipio + ' telefono contacto')}`;
                          return (
                            <a
                              href={searchUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[11px] flex items-center gap-1.5 transition"
                            >
                              <Search className="w-3.5 h-3.5" />
                              <span>Buscar en Google</span>
                            </a>
                          );
                        }
                      })()}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <select
                      value={lead.estado}
                      onChange={e => handleUpdateStatus(lead.id, e.target.value as Lead['estado'])}
                      className={`text-xs font-mono px-2.5 py-1.5 rounded-lg border focus:outline-none ${
                        lead.estado === 'cita_agendada'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : lead.estado === 'interesado'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : lead.estado === 'contactado'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : lead.estado === 'no_llamar'
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      <option value="nuevo">Nuevo</option>
                      <option value="contactado">Llamado / En espera</option>
                      <option value="interesado">Interesado</option>
                      <option value="cita_agendada">Cita / Fecha Agendada</option>
                      <option value="no_llamar">No Interesado / DNC</option>
                    </select>
                  </td>

                  <td className="px-4 py-4 text-right">
                    {lead.coordenadas && lead.coordenadas !== 'N/D' && (
                      <a
                        href={`https://www.google.com/maps?q=${lead.coordenadas}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-[#ecb613]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>GPS</span>
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
