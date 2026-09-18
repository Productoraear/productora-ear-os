"use client";

import React, { useState, useMemo } from "react";
import { 
  GraduationCap, 
  BookOpen, 
  Target, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Lock, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  PlayCircle,
  FileText,
  DollarSign,
  HeartHandshake,
  Database,
  Search,
  Filter,
  Check,
  Building2,
  Mic,
  Download,
  Flame,
  Crown,
  Music2
} from "lucide-react";
import campusData from "@/data/catalogo_61_campus.json";
import { refineQueryWithOracle, type OraclePersona } from "@/lib/oracle/quantum-oracle-engine";

interface PlaybookModule {
  id: string;
  title: string;
  duration: string;
  category: "Ventas" | "Psicología" | "Legal" | "Técnico";
  summary: string;
  keyTakeaway: string;
  scriptSnippet: string;
  actionItem: string;
}

const modules: PlaybookModule[] = [
  {
    id: "mod-01",
    title: "Protocolo del Primer Contacto en < 5 Minutos (WhatsApp Concierge)",
    duration: "4 min lectura",
    category: "Ventas",
    summary: "Los novios solicitan información simultáneamente a 3-5 proveedores en directorios. La tasa de conversión se multiplica por 4 si el primer contacto se produce antes de 15 minutos mediante mensaje directo y personalizado.",
    keyTakeaway: "Nunca envíes un PDF frío de tarifas como primer paso. Inicia una conversación empática interesándote por la fecha, el lugar y su visión musical.",
    scriptSnippet: "«¡Hola [Nombre]! Enhorabuena por el paso que vais a dar. Veo que tenéis fecha el [Fecha] en [Finca]. Para esa época la luz del atardecer allí es mágica. Tengo disponibilidad para esa fecha con mi formato solista en directo. ¿Qué ambiente soñáis para el cóctel?»",
    actionItem: "Usar el botón 'WhatsApp Inmediato' de la pestaña de Solicitudes en cuanto entre un lead.",
  },
  {
    id: "mod-02",
    title: "Defensa Inquebrantable de la Tarifa de 350,00 € Sin Descuentos",
    duration: "6 min lectura",
    category: "Psicología",
    summary: "El descuento es el suicidio de la percepción de lujo. Cuando una pareja pide una rebaja, no están cuestionando el dinero sino la certeza de que el servicio sea extraordinario.",
    keyTakeaway: "Anclar el precio en la solvencia técnica: equipo Bose de 1000W que no distorsiona, cumplimiento estricto de los 75 dB SPL exigidos por las fincas y repertorio 100% en vivo.",
    scriptSnippet: "«Comprendo vuestro presupuesto. Mi tarifa de 350 € está blindada porque incluye no solo la voz en directo, sino el sistema Bose F1 de alta fidelidad, seguro de RC de 300.000 € y la garantía de que la finca no tendrá ningún problema con el volumen o la policía medioambiental. No puedo bajar el precio sin rebajar ese estándar.»",
    actionItem: "Si insisten en descuento, añadir un extra de valor (ej: tema especial fuera de repertorio para la entrada) en lugar de reducir el precio.",
  },
  {
    id: "mod-03",
    title: "El Filtro del Depósito de 100,00 € Stripe Price-Lock",
    duration: "5 min lectura",
    category: "Ventas",
    summary: "El 80% del tiempo de los músicos se pierde con parejas que no tienen intención real de compra o comparan a ciegas. El depósito de 100 € separa a los novios comprometidos de los indecisos.",
    keyTakeaway: "El depósito no es un pago final: es un candado de exclusividad que bloquea tu fecha en el calendario oficial de EAR OS.",
    scriptSnippet: "«Para garantizaros que ningún otro evento pueda ocupar vuestro [Fecha], generamos un enlace seguro de Stripe con el depósito oficial de 100 €. Una vez confirmado, la fecha queda bloqueada para vosotros en exclusiva.»",
    actionItem: "Generar el link de Stripe SHA-256 desde el panel de Facturación en cuanto muestren interés.",
  },
  {
    id: "mod-04",
    title: "Conquista de Fincas y Wedding Planners: El Certificado < 75 dB SPL",
    duration: "7 min lectura",
    category: "Técnico",
    summary: "Los directores de fincas temen a los músicos ruidosos que provocan quejas de vecinos o multas municipales. Presentarte como un músico calibrado acústicamente te convierte en su proveedor recomendado.",
    keyTakeaway: "Entrega a la finca la ficha técnica Bose con el cálculo de 12 W/pax y limitador < 75 dB antes de que lo pidan.",
    scriptSnippet: "«Estimada dirección de [Finca], adjunto el Rider Acústico de Edwin Agudelo para el enlace del [Fecha]. Nuestro equipamiento Bose opera con limitación estricta por debajo de 75 dB SPL y conexión Cetac protegida, garantizando cero molestias.»",
    actionItem: "Descargar y enviar la Ficha Técnica Acústica a los coordinadores de la finca 2 semanas antes.",
  },
  {
    id: "mod-05",
    title: "El Argumentario del Split 80/10/10 y la Deducción Fiscal Ley 49/2002",
    duration: "5 min lectura",
    category: "Legal",
    summary: "Explicar a novios y empresas que su contratación financia programas de neuro-musicoterapia en residencias de mayores a través de la Fundación VIMUME.",
    keyTakeaway: "El 10% de la contratación cuenta con certificado oficial deducible en IRPF / Impuesto de Sociedades (Modelo 182 AEAT).",
    scriptSnippet: "«En Productora EAR no trabajamos con intermediarios comerciales abusivos. El 80% va directo al artista, el 10% a soporte y el 10% restante a la Fundación VIMUME para terapia sonora en residencias senior, generando un dividendo social real y desgravable.»",
    actionItem: "Emitir el Certificado de Aportación VIMUME tras la celebración del evento.",
  },
];

type CampusSubTab = "PLAYBOOKS" | "BOVEDA_ACTIVOS";

export function ProCampusTab() {
  const [activeSubTab, setActiveSubTab] = useState<CampusSubTab>("BOVEDA_ACTIVOS");
  const [selectedModule, setSelectedModule] = useState<PlaybookModule>(modules[0]);
  
  // Estados para la Bóveda de 61 activos
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("TODAS");
  const [docDecisions, setDocDecisions] = useState<Record<string, string>>({});

  // Mini Oráculo Tester
  const [oracleQuery, setOracleQuery] = useState("");
  const [oraclePersona, setOraclePersona] = useState<OraclePersona>("CEO");
  const [oracleResult, setOracleResult] = useState<any>(null);

  const categories = ["TODAS", "Legal & Blindaje", "Informes & Libros Blancos", "Ventas & Cierre", "SEO & Adquisición", "Herramientas & Checklists"];

  const filteredDocs = useMemo(() => {
    return campusData.filter(doc => {
      const matchesSearch = doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || doc.seoAngle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "TODAS" || doc.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleDecision = (docId: string, decision: string) => {
    setDocDecisions(prev => ({ ...prev, [docId]: decision }));
  };

  const handleRunOracle = () => {
    if (!oracleQuery.trim()) return;
    const res = refineQueryWithOracle(oracleQuery, oraclePersona);
    setOracleResult(res);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 lg:p-8 rounded-2xl border border-[#ecb613]/30 bg-gradient-to-br from-[#0c0c12] via-[#08080c] to-[#040406] space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-wider uppercase">
              <GraduationCap className="w-3.5 h-3.5" />
              Bóveda de Crecimiento &amp; Playbooks de Cierre
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold font-['Syne'] text-white">
              Campus S-Class &bull; Inteligencia Absorbida y Negocio Real
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Amortizando al 1000% los 2.245,76 € invertidos en directorios: 61 activos desduplicados, 389 PDFs nupciales locales, y el Oráculo Cuántico para convertir cada búsqueda en una reserva con Stripe.
            </p>
          </div>

          {/* SubTab Toggle */}
          <div className="flex items-center gap-2 bg-zinc-950/90 p-1.5 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveSubTab("BOVEDA_ACTIVOS")}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition ${
                activeSubTab === "BOVEDA_ACTIVOS"
                  ? "bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Bóveda (61 Activos + 389 PDFs)</span>
            </button>

            <button
              onClick={() => setActiveSubTab("PLAYBOOKS")}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition ${
                activeSubTab === "PLAYBOOKS"
                  ? "bg-zinc-800 text-white shadow-lg"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Playbooks de Cierre</span>
            </button>
          </div>
        </div>

        {/* Telemetry Band */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-zinc-800/80">
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-center">
            <div className="text-base font-bold font-mono text-[#ecb613]">61 Docs</div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase">Activos Canónicos</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-center">
            <div className="text-base font-bold font-mono text-cyan-400">389 PDFs</div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase">Bóveda Nupcial</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-center">
            <div className="text-base font-bold font-mono text-rose-400">56 Audios</div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase">Mentoría Artística</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-center">
            <div className="text-base font-bold font-mono text-purple-400">778 Whisper</div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase">Transcripciones</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-center col-span-2 sm:col-span-1">
            <div className="text-base font-bold font-mono text-emerald-400">52 Provincias</div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase">pSEO Toda España</div>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: BÓVEDA DE ACTIVOS & DECISIÓN DEL CEO */}
      {activeSubTab === "BOVEDA_ACTIVOS" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-[#08080c] border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar documento por nombre o ángulo SEO..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#ecb613] font-mono"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-mono transition ${
                    selectedCategory === cat
                      ? "bg-[#ecb613] text-black font-bold"
                      : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map(doc => {
              const decision = docDecisions[doc.id];
              return (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl bg-[#08080c] border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between space-y-4 relative group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700/60 text-[#ecb613]">
                        {doc.categoria}
                      </span>
                      <span className="font-mono text-[11px] text-zinc-500">{doc.sizeMB} MB</span>
                    </div>

                    <h4 className="font-bold text-sm text-zinc-200 font-['Syne'] line-clamp-2 leading-snug">
                      {doc.nombre.replace('.pdf', '').replace('.docx', '')}
                    </h4>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                      <span className="text-[#ecb613] font-mono text-[11px]">Ángulo:</span> {doc.seoAngle}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-3 border-t border-zinc-800/80">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Destino Decidido por CEO:</span>
                      {decision && (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Asignado
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => handleDecision(doc.id, "BLOG_FINCAS")}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-mono flex items-center justify-center gap-1 transition ${
                          decision === "BLOG_FINCAS"
                            ? "bg-amber-500 text-black font-bold"
                            : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
                        }`}
                        title="Enviar al Blog de Fincas para Bodas"
                      >
                        <Building2 className="w-3 h-3" /> Fincas
                      </button>

                      <button
                        onClick={() => handleDecision(doc.id, "BLOG_PRODUCTORA")}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-mono flex items-center justify-center gap-1 transition ${
                          decision === "BLOG_PRODUCTORA"
                            ? "bg-[#ecb613] text-black font-bold"
                            : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
                        }`}
                        title="Enviar al Blog de Productora EAR"
                      >
                        <Mic className="w-3 h-3" /> EAR
                      </button>

                      <button
                        onClick={() => handleDecision(doc.id, "LEAD_MAGNET")}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-mono flex items-center justify-center gap-1 transition ${
                          decision === "LEAD_MAGNET"
                            ? "bg-emerald-500 text-black font-bold"
                            : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
                        }`}
                        title="Convertir en Lead Magnet Descargable"
                      >
                        <Download className="w-3 h-3" /> Magnet
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mini Oráculo Live Refiner Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0a0a14] via-[#090910] to-[#050508] border border-[#ecb613]/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#ecb613]" />
                <h3 className="text-sm font-bold font-mono text-white uppercase">
                  Consola de Prueba del Oráculo Cuántico
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOraclePersona("CEO")}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition ${
                    oraclePersona === "CEO" ? "bg-[#ecb613] text-black font-bold" : "text-zinc-400 hover:text-white bg-zinc-900"
                  }`}
                >
                  <Crown className="w-3 h-3 inline mr-1" /> Modo CEO
                </button>
                <button
                  onClick={() => setOraclePersona("ARTISTA")}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition ${
                    oraclePersona === "ARTISTA" ? "bg-amber-500 text-white font-bold" : "text-zinc-400 hover:text-white bg-zinc-900"
                  }`}
                >
                  <Music2 className="w-3 h-3 inline mr-1" /> Modo Artista
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={oracleQuery}
                onChange={e => setOracleQuery(e.target.value)}
                placeholder="Escribe una consulta estratégica (ej: 'Cómo captar fincas en Sevilla sin pagar comisiones')..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono focus:outline-none focus:border-[#ecb613]"
              />
              <button
                onClick={handleRunOracle}
                className="px-5 py-2.5 rounded-xl bg-[#ecb613] text-black font-bold text-xs font-mono flex items-center gap-2 hover:bg-amber-400 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Refinar
              </button>
            </div>

            {oracleResult && (
              <div className="p-4 rounded-xl bg-black border border-zinc-800 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">
                {oracleResult.refinedPrompt}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: PLAYBOOKS MAESTROS DE CIERRE */}
      {activeSubTab === "PLAYBOOKS" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 px-1 mb-1 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-[#ecb613]" />
              Módulos del Playbook de Conversión
            </div>

            {modules.map((mod, idx) => (
              <div
                key={mod.id}
                onClick={() => setSelectedModule(mod)}
                className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                  selectedModule.id === mod.id
                    ? "bg-[#ecb613]/10 border-[#ecb613]/50 text-white shadow-lg"
                    : "bg-[#08080c] border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700/60 text-[#ecb613]">
                    MOD 0{idx + 1} &bull; {mod.category}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">{mod.duration}</span>
                </div>

                <h4 className="font-bold text-sm font-['Syne'] leading-snug">
                  {mod.title}
                </h4>

                <p className="text-xs text-zinc-400 line-clamp-2">
                  {mod.summary}
                </p>
              </div>
            ))}
          </div>

          {/* Right Detail */}
          <div className="lg:col-span-7 rounded-2xl border border-zinc-800 bg-[#08080c] p-6 lg:p-8 space-y-6">
            <div className="space-y-2 border-b border-zinc-800 pb-5">
              <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613]">
                <span>Módulo Formativo Activo</span>
                <span>&bull;</span>
                <span className="text-zinc-400">{selectedModule.category}</span>
              </div>
              <h3 className="text-xl font-bold font-['Syne'] text-white">
                {selectedModule.title}
              </h3>
            </div>

            {/* Core Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-[#ecb613]" />
                Contexto Táctico
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/80">
                {selectedModule.summary}
              </p>
            </div>

            {/* Key Rule */}
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                <AlertTriangle className="w-4 h-4" />
                Regla de Oro Inmutable
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                {selectedModule.keyTakeaway}
              </p>
            </div>

            {/* Script Snippet */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                Guión Canónico para Despacho Directo
              </h4>
              <div className="p-4 rounded-xl bg-black border border-zinc-800 font-mono text-xs text-emerald-300 leading-relaxed selection:bg-emerald-500 selection:text-black">
                {selectedModule.scriptSnippet}
              </div>
            </div>

            {/* Action Item */}
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-950/10 space-y-1.5">
              <div className="text-xs font-mono uppercase text-blue-400 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" />
                Acción Inmediata en EAR OS
              </div>
              <div className="text-xs text-zinc-300">
                {selectedModule.actionItem}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
