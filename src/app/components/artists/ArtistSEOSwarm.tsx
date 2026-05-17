import React, { useState } from 'react';
import { Globe, MapPin, Award, Building2, Flame, ShieldAlert, Sparkles, Plus, CheckCircle, Search, HelpCircle } from 'lucide-react';

interface SEOVariant {
  slug: string;
  title: string;
  city: string;
  eventType: string;
  showTypeName: string;
  localLogistics: string;
}

// Reuse the master matrix configuration for consistency
const PREVIEW_VARIANTS: SEOVariant[] = [
  {
    slug: "mariachi-bodas-madrid-premium",
    title: "Mariachi de Gala para Bodas Premium en Madrid | Edwin Agudelo",
    city: "Madrid",
    eventType: "bodas",
    showTypeName: "Show Premium de Gala",
    localLogistics: "Logística preferente para la Comunidad de Madrid con 4 músicos de gala y arreglos cinematográficos personalizados."
  },
  {
    slug: "mariachi-ayuntamientos-soria-institucional",
    title: "Espectáculo Institucional para Ayuntamientos de la España Vaciada en Soria | Edwin Agudelo",
    city: "Soria (España Vaciada)",
    eventType: "ayuntamientos",
    showTypeName: "Show Institucional y Cultural",
    localLogistics: "Protocolo adaptado a plazas públicas de Soria con enlazado directo a programas de estimulación cognitiva VIMUME para la tercera edad."
  },
  {
    slug: "mariachi-fiestas-patronales-sevilla-calle",
    title: "Concierto de Mariachi en Fiestas Patronales en Sevilla | Edwin Agudelo",
    city: "Sevilla",
    eventType: "fiestas patronales",
    showTypeName: "Show de Calle e Interactividad",
    localLogistics: "Montaje aéreo de alta fidelidad acústica para festejos patronales multitudinarios en Sevilla."
  },
  {
    slug: "mariachi-residencias-teruel-mayores",
    title: "Estimulación Cognitiva VIMUME 40Hz en Residencias de Teruel | Edwin Agudelo",
    city: "Teruel (España Vaciada)",
    eventType: "residencias y centros de día",
    showTypeName: "Show Terapéutico y Cultural para Mayores",
    localLogistics: "Sesiones acústicas optimizadas con el protocolo 40Hz VIMUME para estimulación neuronal de residentes."
  },
  {
    slug: "mariachi-festivales-barcelona- premium",
    title: "Mariachi Sinfónico para Festivales de Verano en Barcelona | Edwin Agudelo",
    city: "Barcelona",
    eventType: "festivales",
    showTypeName: "Show Premium Sinfónico",
    localLogistics: "Producción a gran escala con 12 músicos en escena para festivales internacionales en Cataluña."
  }
];

interface Lead {
  id: string;
  municipality: string;
  province: string;
  contactPerson: string;
  role: string;
  program: string;
  date: string;
  status: 'PENDING' | 'ACCEPTED' | 'CONTRACTED';
  value: number;
}

export const ArtistSEOSwarm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'swarm' | 'leads' | 'compiler'>('swarm');
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "LD-2026-091",
      municipality: "Medinaceli",
      province: "Soria",
      contactPerson: "Carlos García",
      role: "Concejal de Festejos",
      program: "Mariachi de Gala + VIMUME Cognitivo (Contrato Anual)",
      date: "2026-05-16",
      status: "PENDING",
      value: 3800
    },
    {
      id: "LD-2026-092",
      municipality: "Albarracín",
      province: "Teruel",
      contactPerson: "María Pilar Ruiz",
      role: "Alcaldesa",
      program: "Fiestas Patronales con Mariachi Sinfónico",
      date: "2026-05-15",
      status: "ACCEPTED",
      value: 6200
    },
    {
      id: "LD-2026-093",
      municipality: "Guadalajara Residencial",
      province: "Guadalajara",
      contactPerson: "Dr. Antonio López",
      role: "Director de Centro de Día",
      program: "Protocolo Neuroacústico VIMUME 40Hz",
      date: "2026-05-14",
      status: "CONTRACTED",
      value: 1200
    },
    {
      id: "LD-2026-094",
      municipality: "Sepúlveda",
      province: "Segovia",
      contactPerson: "Elena Herrero",
      role: "Comisión de Fiestas",
      program: "Serenata Ecuestre de Gala",
      date: "2026-05-12",
      status: "PENDING",
      value: 4500
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customEvent, setCustomEvent] = useState('ayuntamientos');
  const [customShow, setCustomShow] = useState('show institucional');
  const [generatedSlug, setGeneratedSlug] = useState('');

  const handleGenerateSlug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCity) return;
    const cleanCity = customCity.toLowerCase().trim().replace(/[\s_]+/g, '-').replace(/[^\w\-]+/g, '');
    const cleanEvent = customEvent.toLowerCase().trim().replace(/[\s_]+/g, '-');
    const slug = `mariachi-${cleanEvent}-${cleanCity}`;
    setGeneratedSlug(slug);
  };

  const handleLeadAction = (id: string, newStatus: 'ACCEPTED' | 'CONTRACTED') => {
    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
  };

  const filteredVariants = PREVIEW_VARIANTS.filter(v => 
    v.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.eventType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ecb613]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6">
        <div>
          <span className="text-[#ecb613] text-xs font-black uppercase tracking-[0.25em] mb-2 block flex items-center gap-1.5 font-mono">
            <Sparkles size={14} /> Swarm SEO & B2G Dominance Engine
          </span>
          <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white font-syne">Control de Canales y Municipios</h3>
          <p className="text-white/40 text-xs font-bold mt-1">Monitorea las landings de captación local y la tracción institucional en la España Vaciada.</p>
        </div>

        {/* NESTED CONTROLS NAVIGATION */}
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('swarm')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'swarm' ? 'bg-[#ecb613] text-black font-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Matriz Swarm
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${
              activeTab === 'leads' ? 'bg-[#ecb613] text-black font-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Leads B2G
            {leads.filter(l => l.status === 'PENDING').length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ecb613] rounded-full animate-ping" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('compiler')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'compiler' ? 'bg-[#ecb613] text-black font-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Compilador Local
          </button>
        </div>
      </div>

      {/* SWARM TAB: MATRIX PREVIEW */}
      {activeTab === 'swarm' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-1">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Landings Núcleo</span>
              <span className="text-2xl font-black text-white font-mono">20 / 20</span>
              <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider block mt-1">100% Indexadas</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-1">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Municipios Mapeados</span>
              <span className="text-2xl font-black text-white font-mono">8,131</span>
              <span className="text-[8px] text-white/40 font-bold uppercase tracking-wider block mt-1">España Vaciada Mapped</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-1">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">CTR Promedio Swarm</span>
              <span className="text-2xl font-black text-[#ecb613] font-mono">4.82%</span>
              <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider block mt-1">+1.2% este mes</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-1">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block">Stripe Conversiones</span>
              <span className="text-2xl font-black text-white font-mono">14,200€</span>
              <span className="text-[8px] text-white/40 font-bold uppercase tracking-wider block mt-1">Depósitos Garantía</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              type="text"
              placeholder="Buscar combinación activa por ciudad o intención..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-6 py-4 text-white text-xs font-bold focus:border-[#ecb613]/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Table list */}
          <div className="space-y-4">
            {filteredVariants.map((v) => (
              <div 
                key={v.slug} 
                className="bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#ecb613]/10 text-[#ecb613] text-[9px] font-black uppercase tracking-widest border border-[#ecb613]/20 font-mono">
                      {v.eventType.toUpperCase()}
                    </span>
                    <span className="text-white/30 text-[9px] font-black uppercase font-mono">
                      /{v.slug}
                    </span>
                  </div>
                  <h4 className="text-sm font-black uppercase text-white font-mono">{v.title}</h4>
                  <p className="text-white/40 text-[11px] leading-relaxed italic">{v.localLogistics}</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <a 
                    href={`/artistas/${v.slug}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 md:flex-none text-center bg-white/5 hover:bg-white text-white hover:text-black px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all font-mono"
                  >
                    Ver URL
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEADS TAB: INSTITUTIONAL CLIENTS */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-start gap-4">
            <Building2 className="text-emerald-400 mt-1 shrink-0" size={20} />
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-white">Tracción España Vaciada y Festejos Activa</h4>
              <p className="text-white/40 text-[11px] leading-relaxed">
                Los alcaldes, concejales y residencias públicas contactan directamente atraídos por la combinación de show de gala de Edwin Agudelo y el gancho clínico de **VIMUME estimulación cognitiva** para sus mayores.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {leads.map((lead) => (
              <div 
                key={lead.id} 
                className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-white/50 text-[9px] font-bold font-mono">
                      {lead.id}
                    </span>
                    <span className="text-[#ecb613] text-[9px] font-black uppercase tracking-widest font-mono">
                      {lead.role} de {lead.municipality} ({lead.province})
                    </span>
                  </div>
                  <h4 className="text-md font-black uppercase text-white font-mono">{lead.program}</h4>
                  <div className="flex items-center gap-4 text-white/30 text-[10px] font-mono">
                    <span>Fecha Registro: {lead.date}</span>
                    <span>·</span>
                    <span className="text-white/70">Presupuesto Estimado: {lead.value}€</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                  {lead.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleLeadAction(lead.id, 'ACCEPTED')}
                        className="flex-1 md:flex-none bg-emerald-500 text-black px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors"
                      >
                        Aprobar Propuesta
                      </button>
                      <button
                        onClick={() => handleLeadAction(lead.id, 'CONTRACTED')}
                        className="flex-1 md:flex-none bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 transition-colors"
                      >
                        Formalizar Contrato
                      </button>
                    </>
                  )}
                  {lead.status === 'ACCEPTED' && (
                    <span className="px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      Propuesta Aceptada
                    </span>
                  )}
                  {lead.status === 'CONTRACTED' && (
                    <span className="px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                      <CheckCircle size={10} /> Contrato Firmado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPILER TAB: GENERATE DYNAMIC PATHS */}
      {activeTab === 'compiler' && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-black uppercase text-white font-syne">Generador Quirúrgico de Landings Locales</h4>
            <p className="text-white/40 text-[11px] leading-relaxed">
              Define una nueva combinación y genera una landing personalizada al instante. El sistema la integrará en el plan de enlazado interno y compilará la información única de forma automática.
            </p>
          </div>

          <form onSubmit={handleGenerateSlug} className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Municipio / Ciudad</label>
              <input
                type="text"
                required
                placeholder="Ej. Cantalapiedra, Salamanca"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white text-xs font-bold focus:border-[#ecb613]/50 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Canal / Evento</label>
              <select
                value={customEvent}
                onChange={(e) => setCustomEvent(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white text-xs font-bold focus:border-[#ecb613]/50 focus:outline-none transition-colors"
              >
                <option value="ayuntamientos" className="bg-[#050505] text-white">Ayuntamientos (B2G)</option>
                <option value="centros de dia" className="bg-[#050505] text-white">Centros de Día</option>
                <option value="residencias" className="bg-[#050505] text-white">Residencias de Mayores</option>
                <option value="fiestas patronales" className="bg-[#050505] text-white">Fiestas Patronales</option>
                <option value="bodas" className="bg-[#050505] text-white">Bodas</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block">Formato Requerido</label>
              <select
                value={customShow}
                onChange={(e) => setCustomShow(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-white text-xs font-bold focus:border-[#ecb613]/50 focus:outline-none transition-colors"
              >
                <option value="show institucional" className="bg-[#050505] text-white">Show Institucional y Cultural</option>
                <option value="show para mayores" className="bg-[#050505] text-white">Show Terapéutico Neuroacústico</option>
                <option value="mariachi clasico" className="bg-[#050505] text-white">Mariachi Clásico de Gala</option>
                <option value="serenata" className="bg-[#050505] text-white">Serenata Romántica</option>
              </select>
            </div>

            <button
              type="submit"
              className="md:col-span-3 bg-[#ecb613] text-black font-black uppercase tracking-[0.25em] text-xs py-5 rounded-2xl hover:bg-white transition-all shadow-xl shadow-[#ecb613]/5"
            >
              Compilar URL Local
            </button>
          </form>

          {generatedSlug && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-emerald-400">¡URL Compilada en Sandbox S-Class!</h4>
                <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-widest">READY TO INDEX</span>
              </div>
              <p className="text-white/60 text-xs">
                Ruta generada: <span className="font-mono text-white font-bold">/artistas/{generatedSlug}</span>
              </p>
              <p className="text-white/40 text-[10px]">
                Esta landing responde a la intención de búsqueda <span className="text-white font-mono">"mariachi para {customEvent} en {customCity}"</span>. Se le ha asignado la plantilla modular institucional con los datos climáticos y logísticos de tu elección.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
