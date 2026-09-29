'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Send, 
  MessageCircle, 
  Mail, 
  CheckCircle2, 
  ExternalLink, 
  Flame, 
  ShieldCheck, 
  RefreshCw, 
  Copy, 
  Sparkles,
  MapPin,
  Instagram,
  Star,
  Users,
  Building2,
  DollarSign,
  Globe
} from 'lucide-react';
import { MailerfindLead } from '@/lib/mcp/mailerfind-connector';
import { OutreachDispatch } from '@/lib/outreach/organic-outreach-engine';

interface EnrichedLead extends MailerfindLead {
  outreach: OutreachDispatch;
}

export default function AdminMailerfindProspectingPage() {
  const [niche, setNiche] = useState<string>('todos');
  const [location, setLocation] = useState<string>('todas');
  const [province, setProvince] = useState<string>('todas');
  const [platform, setPlatform] = useState<'both' | 'google_maps' | 'instagram'>('both');
  const [loading, setLoading] = useState<boolean>(false);
  const [leads, setLeads] = useState<EnrichedLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<EnrichedLead | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTarget, setSearchTarget] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [limit, setLimit] = useState<number>(30);

  const handleSearch = async (overrideParams?: any) => {
    setLoading(true);
    try {
      const payload = overrideParams || {
        niche,
        location,
        province,
        query,
        limit,
        platform
      };

      const res = await fetch('/api/mailerfind/prospect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const json = await res.json();
        setLeads(json.leads || []);
        if (json.leads && json.leads.length > 0) {
          setSelectedLead(json.leads[0]);
        }
      }
    } catch (err) {
      console.warn('Error buscando leads con Mailerfind:', err);
    } finally {
      setLoading(false);
    }
  };

  // Carga automática inicial de leads enriquecidos al entrar
  React.useEffect(() => {
    handleSearch({ niche: 'todos', province: 'todas', limit: 30 });
  }, []);

  const auditBodasnetFollowersDirectly = () => {
    setSearchTarget('https://www.instagram.com/bodasnet/');
    handleSearch({
      targetAccount: 'https://www.instagram.com/bodasnet/',
      limit: 30
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const exportLeadsToCSV = () => {
    if (leads.length === 0) return;
    const headers = ['Nombre', 'Gremio', 'Provincia', 'Localidad', 'Teléfono / WhatsApp', 'Email', 'Web', 'Instagram', 'Tipo Verificación', 'Rating', 'Reseñas', 'Ficha EAR OS'];
    const rows = leads.map(l => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.category}"`,
      `"${l.province}"`,
      `"${l.location}"`,
      `"${l.whatsapp}"`,
      `"${l.email}"`,
      `"${l.website || ''}"`,
      `"${l.instagramHandle || ''}"`,
      `"${l.phoneVerifiedType === 'DIRECT_VENDOR' ? 'Verificado Directo' : l.phoneVerifiedType === 'SOVEREIGN_CENTRALITA' ? 'Centralita EAR' : 'Identificado Maps/IG'}"`,
      l.googleRating || 5.0,
      l.reviewsCount || 0,
      `"https://productoraear.com/proveedores/${l.claimedProfileSlug || l.id}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_mailerfind_${niche.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* CABECERA CON STATS DEL UNIVERSO COMPLETO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#ecb613] text-xs font-mono font-bold tracking-widest uppercase mb-1">
            <Compass className="w-4 h-4" /> MAILERFIND MCP · RADAR B2B UNIVERSAL 2050
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            Base Nacional de Proveedores & Fincas (84.774 Indexados)
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Universo completo de gremios cosechados de Bodas.net, Google Maps e Instagram: WhatsApp directo, verificación SMTP y activación bajo el Split Soberano 80/10/10.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-zinc-300 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#ecb613]" />
            <span>84.774 Proveedores</span>
          </div>

          <div className="px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>0€ Cuotas (vs 150€/mes)</span>
          </div>

          {leads.length > 0 && (
            <button
              onClick={exportLeadsToCSV}
              className="px-3 py-1.5 bg-blue-950/60 hover:bg-blue-900 border border-blue-500/50 text-blue-300 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Exportar CSV ({leads.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* 🚀 BOTONES DE OPERACIÓN DIRECTA / TODOS LOS GREMIOS */}
      <div className="p-4 bg-neutral-900/60 border border-[#ecb613]/30 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
          <Flame className="w-4 h-4 text-[#ecb613]" />
          <span className="font-bold text-white uppercase">Acceso Rápido por Gremio:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              setNiche('todos');
              setProvince('todas');
              handleSearch({ niche: 'todos', province: 'todas', limit });
            }}
            disabled={loading}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-mono font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>🌐 UNIVERSO COMPLETO (84k)</span>
          </button>

          <button
            onClick={() => {
              setNiche('musica');
              setProvince('todas');
              handleSearch({ niche: 'musica', province: 'todas', limit });
            }}
            disabled={loading}
            className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-xs rounded-xl border border-neutral-700 flex items-center gap-1 transition-all"
          >
            <span>🎺 Música & Mariachis (3.8k)</span>
          </button>

          <button
            onClick={() => {
              setNiche('finca');
              setProvince('todas');
              handleSearch({ niche: 'finca', province: 'todas', limit });
            }}
            disabled={loading}
            className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-xs rounded-xl border border-neutral-700 flex items-center gap-1 transition-all"
          >
            <span>🏰 Fincas (9.5k)</span>
          </button>

          <button
            onClick={() => {
              setNiche('catering');
              setProvince('todas');
              handleSearch({ niche: 'catering', province: 'todas', limit });
            }}
            disabled={loading}
            className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-xs rounded-xl border border-neutral-700 flex items-center gap-1 transition-all"
          >
            <span>🥘 Catering (4.1k)</span>
          </button>

          <button
            onClick={() => {
              setNiche('sonido');
              setProvince('todas');
              handleSearch({ niche: 'sonido', province: 'todas', limit });
            }}
            disabled={loading}
            className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-xs rounded-xl border border-neutral-700 flex items-center gap-1 transition-all"
          >
            <span>⚡ Sonido & Luces (8.9k)</span>
          </button>

          <button
            onClick={() => {
              setNiche('foto');
              setProvince('todas');
              handleSearch({ niche: 'foto', province: 'todas', limit });
            }}
            disabled={loading}
            className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-xs rounded-xl border border-neutral-700 flex items-center gap-1 transition-all"
          >
            <span>📸 Fotografía (35k)</span>
          </button>

          <button
            onClick={() => {
              setNiche('wedding');
              setProvince('todas');
              handleSearch({ niche: 'wedding', province: 'todas', limit });
            }}
            disabled={loading}
            className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-xs rounded-xl border border-neutral-700 flex items-center gap-1 transition-all"
          >
            <span>💍 Planners (1.0k)</span>
          </button>

          <button
            onClick={() => {
              setNiche('transporte');
              setProvince('todas');
              handleSearch({ niche: 'transporte', province: 'todas', limit });
            }}
            disabled={loading}
            className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-xs rounded-xl border border-neutral-700 flex items-center gap-1 transition-all"
          >
            <span>🚌 Transporte (1.9k)</span>
          </button>
        </div>
      </div>

      {/* 🎛️ FILTROS DE BÚSQUEDA Y CALIBRACIÓN MULTIDIMENSIONAL */}
      <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
        <div>
          <label className="text-neutral-400 block mb-1.5 font-bold">GREMIO / NICHO</label>
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ecb613]"
          >
            <option value="todos">🌐 TODOS LOS GREMIOS (84.774)</option>
            <option value="musica">🎺 Mariachis & Música (3.846)</option>
            <option value="finca">🏰 Fincas & Espacios (9.559)</option>
            <option value="catering">🥘 Catering & Asados (4.096)</option>
            <option value="sonido">⚡ Sonido Bose & Luces (8.963)</option>
            <option value="foto">📸 Fotografía & Cine (35.153)</option>
            <option value="wedding">💍 Wedding Planners (1.011)</option>
            <option value="transporte">🚌 Transporte & Coches (1.961)</option>
            <option value="decoracion">🌸 Decoración & Carpas (1.650)</option>
            <option value="moda">👔 Moda Nupcial & Trajes (8.777)</option>
            <option value="servicios">🎪 Animación & Auxiliares (8.617)</option>
            <option value="senior_care">🧠 Centros Senior VIMUME (800)</option>
          </select>
        </div>

        <div>
          <label className="text-neutral-400 block mb-1.5 font-bold">PROVINCIA</label>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ecb613]"
          >
            <option value="todas">🌍 Todas las Provincias de España (52)</option>
            <option value="A Coruña">A Coruña</option>
            <option value="Álava">Álava</option>
            <option value="Albacete">Albacete</option>
            <option value="Alicante">Alicante</option>
            <option value="Almería">Almería</option>
            <option value="Asturias">Asturias</option>
            <option value="Ávila">Ávila</option>
            <option value="Badajoz">Badajoz</option>
            <option value="Baleares">Baleares (Ibiza / Mallorca / Menorca)</option>
            <option value="Barcelona">Barcelona</option>
            <option value="Burgos">Burgos</option>
            <option value="Cáceres">Cáceres</option>
            <option value="Cádiz">Cádiz (Jerez)</option>
            <option value="Cantabria">Cantabria</option>
            <option value="Castellón">Castellón</option>
            <option value="Ceuta">Ceuta</option>
            <option value="Ciudad Real">Ciudad Real</option>
            <option value="Córdoba">Córdoba</option>
            <option value="Cuenca">Cuenca</option>
            <option value="Girona">Girona</option>
            <option value="Granada">Granada</option>
            <option value="Guadalajara">Guadalajara</option>
            <option value="Guipúzcoa">Guipúzcoa (Donostia)</option>
            <option value="Huelva">Huelva</option>
            <option value="Huesca">Huesca</option>
            <option value="Jaén">Jaén (Baeza / Úbeda)</option>
            <option value="La Rioja">La Rioja</option>
            <option value="Las Palmas">Las Palmas (Gran Canaria / Lanzarote)</option>
            <option value="León">León</option>
            <option value="Lleida">Lleida</option>
            <option value="Lugo">Lugo</option>
            <option value="Madrid">Madrid</option>
            <option value="Málaga">Málaga (Marbella / Ronda)</option>
            <option value="Melilla">Melilla</option>
            <option value="Murcia">Murcia</option>
            <option value="Navarra">Navarra (Pamplona)</option>
            <option value="Ourense">Ourense</option>
            <option value="Palencia">Palencia</option>
            <option value="Pontevedra">Pontevedra (Vigo / Mondariz)</option>
            <option value="Salamanca">Salamanca</option>
            <option value="Santa Cruz de Tenerife">Santa Cruz de Tenerife</option>
            <option value="Segovia">Segovia</option>
            <option value="Sevilla">Sevilla</option>
            <option value="Soria">Soria</option>
            <option value="Tarragona">Tarragona</option>
            <option value="Teruel">Teruel</option>
            <option value="Toledo">Toledo (Méntrida / Talavera)</option>
            <option value="Valencia">Valencia</option>
            <option value="Valladolid">Valladolid</option>
            <option value="Vizcaya">Vizcaya (Bilbao / Getxo)</option>
            <option value="Zamora">Zamora</option>
            <option value="Zaragoza">Zaragoza</option>
          </select>
        </div>

        <div>
          <label className="text-neutral-400 block mb-1.5 font-bold">BUSCAR POR TEXTO</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Mariachi, cigarral, paella, bose..."
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ecb613]"
          />
        </div>

        <div>
          <label className="text-neutral-400 block mb-1.5 font-bold">LÍMITE POR PANTALLA</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ecb613]"
          >
            <option value={15}>15 leads</option>
            <option value={30}>30 leads</option>
            <option value={50}>50 leads</option>
            <option value={100}>100 leads</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => handleSearch({ niche, province, query, limit })}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#ecb613] hover:bg-[#d4a311] disabled:opacity-50 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Extrayendo...' : 'BUSCAR LEADS'}
          </button>
        </div>
      </div>

      {/* 📊 RESULTADOS Y PANEL DE DESPACHO ORGÁNICO */}
      {leads.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LISTA DE LEADS (Col 7) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-1">
              <span>{leads.length} LEADS EXTRAÍDOS Y ENRIQUECIDOS</span>
              <span className="text-[#ecb613]">Emails verificados SMTP & WhatsApp</span>
            </div>

            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedLead?.id === lead.id
                      ? 'border-[#ecb613] bg-[#ecb613]/10 shadow-lg'
                      : 'border-neutral-800 bg-[#08080c] hover:border-neutral-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{lead.name}</span>
                      {lead.phoneVerifiedType === 'DIRECT_VENDOR' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/70">
                          ✅ Verificado Directo
                        </span>
                      )}
                      {lead.phoneVerifiedType === 'SOVEREIGN_CENTRALITA' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-[#ecb613] border border-amber-800/70">
                          👑 Centralita Matriz EAR
                        </span>
                      )}
                      {lead.phoneVerifiedType === 'MAPS_IDENTIFIED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-950/80 text-sky-400 border border-sky-800/70">
                          📡 Identificado Maps/IG
                        </span>
                      )}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-800 text-[#ecb613]">
                      Fit: {lead.fitScore}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-400 font-mono">
                    <span className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#ecb613] shrink-0" />
                      <span className="text-neutral-200 font-semibold">{lead.location}</span>
                      <span className="text-neutral-500">({lead.province})</span>
                    </span>

                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold truncate">
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{lead.whatsapp}</span>
                    </span>

                    <span className="flex items-center gap-1.5 text-cyan-400 truncate">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span>{lead.email}</span>
                    </span>

                    {lead.googleRating && (
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
                        <span>{lead.googleRating} ({lead.reviewsCount} reseñas)</span>
                      </span>
                    )}

                    {lead.instagramHandle && (
                      <span className="flex items-center gap-1.5 text-pink-400 truncate">
                        <Instagram className="w-3.5 h-3.5 shrink-0" />
                        <span>{lead.instagramHandle}</span>
                      </span>
                    )}

                    {lead.website && (
                      <span className="flex items-center gap-1.5 text-indigo-400 truncate">
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{lead.website.replace('https://www.', '')}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PANEL DE DESPACHO ORGÁNICO S-CLASS (Col 5) */}
          {selectedLead && (
            <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest">DESPACHO ORGÁNICO ACTIVO</span>
                  <h3 className="font-bold text-white text-base truncate max-w-xs">{selectedLead.name}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#ecb613] mt-0.5">
                    <MapPin className="w-3 h-3" /> {selectedLead.location} • {selectedLead.province}
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px] font-bold">
                  SPLIT 80/10/10
                </span>
              </div>

              {/* WHATSAPP OUTREACH DIRECTO */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#ecb613] font-bold flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Directo ({selectedLead.whatsapp})
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedLead.outreach.whatsappMessage, 'wa')}
                    className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> {copiedId === 'wa' ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-300 text-[11px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line font-sans">
                  {selectedLead.outreach.whatsappMessage}
                </div>
                <a
                  href={selectedLead.outreach.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" /> ABRIR EN WHATSAPP WEB & ENVIAR
                </a>
              </div>

              {/* CORREO B2B INSTITUCIONAL */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Correo Institucional ({selectedLead.email})
                  </span>
                  <button
                    onClick={() => copyToClipboard(`${selectedLead.outreach.emailSubject}\n\n${selectedLead.outreach.emailBody}`, 'mail')}
                    className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> {copiedId === 'mail' ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
                <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-300 text-[11px] font-sans truncate">
                  <strong>Asunto:</strong> {selectedLead.outreach.emailSubject}
                </div>
                <a
                  href={`mailto:${selectedLead.email}?subject=${encodeURIComponent(selectedLead.outreach.emailSubject)}&body=${encodeURIComponent(selectedLead.outreach.emailBody)}`}
                  className="w-full py-2 px-3 bg-cyan-700 hover:bg-cyan-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md text-xs"
                >
                  <Mail className="w-3.5 h-3.5" /> ABRIR EN GMAIL / OUTLOOK (MAILTO)
                </a>
              </div>

              {/* ENLACE DE FICHA RECLAMABLE */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Landing Verificada en EAR OS:</span>
                <a
                  href={selectedLead.outreach.claimUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#ecb613] hover:underline flex items-center gap-1 font-bold"
                >
                  Ver Ficha Pública <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
