'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Award, 
  Activity, 
  Radio, 
  Volume2, 
  Tv, 
  Users, 
  Sparkles, 
  Clock, 
  Download, 
  Copy, 
  Check, 
  ChevronRight, 
  Lock, 
  Phone, 
  Building, 
  Layers
} from 'lucide-react';
import { 
  MAX_LCSP_MINOR_CONTRACT_LIMIT, 
  SAFE_LCSP_CEILING, 
  validateDIR3Code, 
  validateDIR3Trio,
  calculateLCSPMinorContract,
  B2GPackageItem,
  DIR3Codes,
  LCSPMinorContractProposal
} from '@/lib/b2g-tender-engine';
import { CENTRALITA } from '@/lib/phone-constants';

type B2GTabKey = 'SERVICIOS_360' | 'SIMULADOR_LCSP' | 'MARCO_LEGAL_ODS';

const INITIAL_SERVICES: B2GPackageItem[] = [
  {
    id: 'fiestas-patronales-macro',
    name: 'Sonorización Line Array & Escenario Fiestas Patronales',
    unitPrice: 6500,
    quantity: 1,
    category: 'CULTURA_FESTEJOS',
    description: 'Sistema Line Array 18 W/pax, robótica de iluminación Beam/Wash y boletín eléctrico temporal OCA.'
  },
  {
    id: 'pantalla-led-p26-outdoor',
    name: 'Mural Pantalla LED P2.6 Exterior (> 5.500 nits)',
    unitPrice: 2800,
    quantity: 1,
    category: 'PANTALLAS_LED',
    description: 'Mural modular de hiperbrillo exterior con escalador Novastar 4K y estructura de sustentación.'
  },
  {
    id: 'protocolo-cumbres-diplomacia',
    name: 'Audio Encriptado Shure Axient AES-256 & Convoy 14p',
    unitPrice: 3200,
    quantity: 0,
    category: 'PROTOCOLO_ESTADO',
    description: 'Microfonía blindada de seguridad para discursos institucionales y transporte VIP de comitiva.'
  },
  {
    id: 'vimume-intervencion-residencias',
    name: 'Plan VIMUME Neuroacústica Senior en Residencias Municipales',
    unitPrice: 4200,
    quantity: 1,
    category: 'VIMUME_SENIOR',
    description: 'Sesiones de reactivación de memoria biográfica y catarsis lírica en directo. SROI verificado de 4.85x.'
  }
];

export default function B2GInstitutionalPortal() {
  const [activeTab, setActiveTab] = useState<B2GTabKey>('SIMULADOR_LCSP');
  
  // Estado del empaquetador de servicios
  const [services, setServices] = useState<B2GPackageItem[]>(INITIAL_SERVICES);
  const [entidad, setEntidad] = useState<string>('Ayuntamiento de Toledo');
  const [cif, setCif] = useState<string>('P4516800E');
  const [dir3, setDir3] = useState<DIR3Codes>({
    oficinaContable: 'L01451688',
    organoGestor: 'L01451688',
    unidadTramitadora: 'L01451688'
  });

  const [generatedProposal, setGeneratedProposal] = useState<LCSPMinorContractProposal | null>(null);
  const [facturaeXml, setFacturaeXml] = useState<string | null>(null);
  const [copiedXml, setCopiedXml] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Cálculos reactivos de presupuesto
  const selectedItems = services.filter(s => s.quantity > 0);
  const rawBaseBudget = selectedItems.reduce((acc, it) => acc + (it.unitPrice * it.quantity), 0);
  
  const isCeilingExceeded = rawBaseBudget >= MAX_LCSP_MINOR_CONTRACT_LIMIT;
  const effectiveBase = isCeilingExceeded ? SAFE_LCSP_CEILING : rawBaseBudget;
  const vat21 = Number((effectiveBase * 0.21).toFixed(2));
  const totalLicitacion = Number((effectiveBase + vat21).toFixed(2));

  // Validaciones DIR3 en vivo
  const ocVal = validateDIR3Code(dir3.oficinaContable);
  const ogVal = validateDIR3Code(dir3.organoGestor);
  const utVal = validateDIR3Code(dir3.unidadTramitadora);
  const allDir3Valid = ocVal.valid && ogVal.valid && utVal.valid;

  const handleUpdateQuantity = (id: string, delta: number) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        const nextQty = Math.max(0, s.quantity + delta);
        return { ...s, quantity: nextQty };
      }
      return s;
    }));
  };

  const handleGenerateExpediente = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/b2g/facturae', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entidad,
          cif,
          dir3,
          items: selectedItems
        })
      });
      const data = await res.json();
      if (data.success) {
        setFacturaeXml(data.facturaeXML);
        const localProposal = calculateLCSPMinorContract(selectedItems, entidad, cif, dir3);
        setGeneratedProposal(localProposal);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyXml = () => {
    if (!facturaeXml) return;
    navigator.clipboard.writeText(facturaeXml);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-[#050507] text-white selection:bg-[#ecb613] selection:text-black font-sans">
      
      {/* ── TOPBAR INSTITUCIONAL ── */}
      <aside aria-label="Gobernanza B2G" className="w-full border-b border-white/10 bg-[#09090d]/90 backdrop-blur-md px-4 sm:px-6 py-2 text-xs text-white/60 font-mono">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#AAD6CD] animate-pulse shrink-0" />
            <span className="text-[#ecb613] font-bold uppercase tracking-wider truncate">Nodo Instituciones · B2G Sovereign Hub</span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="hidden sm:inline">Cumplimiento Estricto Art. 118 LCSP</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[10px] sm:text-[11px]">
            <span>Techo Menor: <strong className="text-white">14.990,00 €</strong></span>
            <span>Ajuste Seguro: <strong className="text-emerald-400">14.250,00 €</strong></span>
            <span>FACe: <strong className="text-[#AAD6CD]">DIR3 v3.2.2</strong></span>
          </div>
        </div>
      </aside>

      {/* ── HERO ARISTOCRÁTICO B2G ── */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-10 border-b border-white/10">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[450px] w-[850px] max-w-full bg-gradient-radial from-[#258DCD]/10 via-[#ecb613]/5 to-transparent blur-[130px]" />

        <div className="relative mx-auto max-w-7xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#AAD6CD]/30 bg-[#AAD6CD]/10 px-3.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-[#AAD6CD]">
            <Landmark size={12} className="shrink-0" />
            <span>Soberanía Administrativa · Bloque 6 SSOT</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-[0.98] break-words">
                Bypass Burocrático para <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#AAD6CD] via-sky-200 to-white">
                  Ayuntamientos y Diputaciones.
                </span>
              </h1>
              <p className="text-white/70 text-sm sm:text-base max-w-3xl leading-relaxed">
                Ingeniería jurídica y técnica para Concejales de Cultura, Festejos y Bienestar Social. Empaquetamos servicios audiovisuales y programas sociosanitarios bajo la figura del <strong>Contrato Menor (Art. 118 LCSP)</strong> con ajuste automático preventivo a <strong>14.250,00 € netos</strong>, tramitación telemática directa en <strong>FACe</strong> con los 3 códigos DIR3 y justificación formal en <strong>ODS 3, 10 y 11</strong>.
              </p>
            </div>

            {/* BADGE DE SEGURIDAD JURÍDICA */}
            <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-[#09090d] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs">
                <span className="text-white/60">Garantía Antifraude</span>
                <span className="rounded-full bg-[#AAD6CD] px-2 py-0.5 text-[9px] font-black text-black uppercase">Art. 118.3</span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-white/50">Límite Legal:</span>
                  <span className="text-white font-bold">&lt; 15.000,00 €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Ajuste Seguro EAR:</span>
                  <span className="text-emerald-400 font-bold">14.250,00 €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Cobro Estimado:</span>
                  <span className="text-[#ecb613] font-bold">&le; 30 días (FACe)</span>
                </div>
              </div>
              <p className="text-[11px] font-mono text-white/40 border-t border-white/10 pt-3">
                Memoria de necesidad e insuficiencia de medios propios emitida al instante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NAVEGACIÓN POR TABS B2G ── */}
      <nav aria-label="Navegación del portal institucional" className="sticky top-0 z-40 border-b border-white/10 bg-[#050507]/90 backdrop-blur-xl px-4 sm:px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('SIMULADOR_LCSP')}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'SIMULADOR_LCSP'
                  ? 'bg-[#AAD6CD] text-black shadow-lg shadow-[#AAD6CD]/20'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Scale size={14} />
              <span>Simulador Contrato Menor (14.250 €)</span>
            </button>

            <button
              onClick={() => setActiveTab('SERVICIOS_360')}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'SERVICIOS_360'
                  ? 'bg-[#AAD6CD] text-black shadow-lg shadow-[#AAD6CD]/20'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Layers size={14} />
              <span>Catálogo Institucional 360</span>
            </button>

            <button
              onClick={() => setActiveTab('MARCO_LEGAL_ODS')}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'MARCO_LEGAL_ODS'
                  ? 'bg-[#AAD6CD] text-black shadow-lg shadow-[#AAD6CD]/20'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Marco Legal LCSP & ODS 2030</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${CENTRALITA.display}`}
              className="text-xs font-mono text-white/50 hover:text-[#AAD6CD] flex items-center gap-1.5"
            >
              <Phone size={12} className="text-[#AAD6CD]" />
              <span>Gabinete Técnico B2G: {CENTRALITA.display}</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ── CUERPO PRINCIPAL DEL PORTAL B2G ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12 space-y-12">
        
        {/* ═══════════════════════════════════════════════════════ */}
        {/* VISTA 1: SIMULADOR DE CONTRATO MENOR ART. 118 LCSP */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'SIMULADOR_LCSP' && (
          <div className="space-y-10">
            
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#AAD6CD] font-bold">
                Empaquetador de Expedientes Telemáticos
              </span>
              <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                Simulador de Licitación Menor
              </h2>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                Seleccione los módulos técnicos necesarios para su municipio. El algoritmo supervisa en tiempo real que el presupuesto respete el límite legal de 14.990 € y aplica el ajuste preventivo de 14.250 € para blindar el expediente ante reparos de Intervención Municipal.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* SELECTOR DE SERVICIOS MUNICIPALES */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-[#09090d] p-4 flex items-center justify-between font-mono text-xs">
                  <span className="text-white/70 uppercase">Servicios Técnicos Disponibles</span>
                  <span className="text-[#AAD6CD]">{selectedItems.length} servicios seleccionados</span>
                </div>

                <div className="space-y-4">
                  {services.map((item) => (
                    <div 
                      key={item.id}
                      className={`rounded-2xl border p-5 transition-all ${
                        item.quantity > 0 
                          ? 'border-[#AAD6CD]/50 bg-[#09090d]' 
                          : 'border-white/10 bg-black/40 opacity-70'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 max-w-md">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[9px] uppercase text-[#AAD6CD]">
                              {item.category}
                            </span>
                            <span className="font-mono text-xs font-bold text-[#ecb613]">
                              {item.unitPrice.toLocaleString('es-ES')} € / ud.
                            </span>
                          </div>
                          <h3 className="font-syne text-base font-bold text-white uppercase">
                            {item.name}
                          </h3>
                          <p className="text-xs text-white/60 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* CONTROLES DE CANTIDAD */}
                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            disabled={item.quantity === 0}
                            className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-white font-mono font-bold hover:bg-white/20 disabled:opacity-30 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-mono text-sm font-bold text-white w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="h-9 w-9 rounded-xl bg-[#AAD6CD] flex items-center justify-center text-black font-mono font-bold hover:bg-white cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FORMULARIO DE CÓDIGOS DIR3 Y DATOS CONSISTORIALES */}
                <div className="rounded-3xl border border-white/10 bg-[#09090d] p-6 space-y-6">
                  <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-syne text-base font-bold uppercase text-white">Datos de Tramitación Telemática (FACe)</h3>
                      <p className="font-mono text-xs text-white/50">Trío obligatorio de códigos DIR3 para la factura electrónica</p>
                    </div>
                    {allDir3Valid ? (
                      <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 font-mono text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> DIR3 Conformes
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#FF455B]/10 text-[#FF455B] border border-[#FF455B]/30 px-3 py-1 font-mono text-[10px] font-bold flex items-center gap-1">
                        <AlertTriangle size={12} /> Verificar DIR3
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-white/60 mb-1">Entidad Contratante *</label>
                      <input 
                        type="text"
                        value={entidad}
                        onChange={(e) => setEntidad(e.target.value)}
                        placeholder="Ej: Ayuntamiento de Toledo"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#AAD6CD] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-white/60 mb-1">CIF de la Entidad Pública *</label>
                      <input 
                        type="text"
                        value={cif}
                        onChange={(e) => setCif(e.target.value)}
                        placeholder="P-4516800E"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#AAD6CD] outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-white/60 mb-1">Oficina Contable *</label>
                      <input 
                        type="text"
                        value={dir3.oficinaContable}
                        onChange={(e) => setDir3({ ...dir3, oficinaContable: e.target.value })}
                        placeholder="L01451688"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#AAD6CD] outline-none font-mono uppercase"
                      />
                      <span className="text-[10px] font-mono text-white/40 mt-1 block">9 caracteres (ej: L01451688)</span>
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-white/60 mb-1">Órgano Gestor *</label>
                      <input 
                        type="text"
                        value={dir3.organoGestor}
                        onChange={(e) => setDir3({ ...dir3, organoGestor: e.target.value })}
                        placeholder="L01451688"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#AAD6CD] outline-none font-mono uppercase"
                      />
                      <span className="text-[10px] font-mono text-white/40 mt-1 block">Concejalía / Área</span>
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-white/60 mb-1">Unidad Tramitadora *</label>
                      <input 
                        type="text"
                        value={dir3.unidadTramitadora}
                        onChange={(e) => setDir3({ ...dir3, unidadTramitadora: e.target.value })}
                        placeholder="L01451688"
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#AAD6CD] outline-none font-mono uppercase"
                      />
                      <span className="text-[10px] font-mono text-white/40 mt-1 block">Servicio Gestor</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* PANEL DE CONTROL FINANCIERO Y GENERACIÓN */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="rounded-3xl border border-white/10 bg-[#09090d] p-6 space-y-6">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#AAD6CD] font-bold">
                      Control Presupuestario Art. 118 LCSP
                    </span>
                    <h3 className="font-syne text-2xl font-black uppercase text-white mt-1">
                      Estado del Expediente
                    </h3>
                  </div>

                  {/* ALERTA O ESTADO DEL TECHO LEGAL */}
                  {isCeilingExceeded ? (
                    <div className="rounded-2xl border border-amber-500/40 bg-amber-950/20 p-4 space-y-1 font-mono text-xs">
                      <div className="flex items-center gap-2 text-amber-400 font-bold">
                        <AlertTriangle size={15} />
                        <span>Ajuste Automático Preventivo Activado</span>
                      </div>
                      <p className="text-white/70 text-[11px] leading-relaxed">
                        El importe bruto ({rawBaseBudget.toLocaleString('es-ES')} €) alcanzaba o superaba los 14.990 €. Se ha ajustado automáticamente al <strong>95% del límite (14.250,00 €)</strong> para evitar sospechas de fraccionamiento contractual y garantizar conformidad de Intervención.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1 font-mono text-xs">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <CheckCircle2 size={15} />
                        <span>Expediente en Rango de Contrato Menor</span>
                      </div>
                      <p className="text-white/70 text-[11px]">
                        Importe inferior a 14.990 €. Tramitación directa por Decreto de Alcaldía sin necesidad de licitación abierta.
                      </p>
                    </div>
                  )}

                  {/* DESGLOSE ECONÓMICO */}
                  <div className="rounded-2xl bg-black/50 border border-white/5 p-4 space-y-2 font-mono text-xs">
                    <div className="flex justify-between text-white/70">
                      <span>Presupuesto Base de Licitación:</span>
                      <strong className="text-white">{effectiveBase.toFixed(2)} €</strong>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>IVA Aplicable (21%):</span>
                      <strong className="text-white">{vat21.toFixed(2)} €</strong>
                    </div>
                    <div className="flex justify-between text-base font-bold text-[#AAD6CD] border-t border-white/10 pt-2">
                      <span>Importe Total Licitado:</span>
                      <span>{totalLicitacion.toFixed(2)} €</span>
                    </div>
                  </div>

                  {/* BOTÓN GENERADOR */}
                  <button
                    onClick={handleGenerateExpediente}
                    disabled={isProcessing || selectedItems.length === 0}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#AAD6CD] to-sky-300 text-black font-mono text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#AAD6CD]/20 cursor-pointer disabled:opacity-50"
                  >
                    <FileText size={16} />
                    <span>{isProcessing ? 'Procesando con FACe...' : 'Generar Memoria & Facturae XML'}</span>
                  </button>
                </div>

                {/* VISOR DE FACTURAE XML PREVIEW */}
                {facturaeXml && generatedProposal && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-[#AAD6CD]/40 bg-black p-6 space-y-4 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[#AAD6CD] font-bold block">Expediente {generatedProposal.expedienteRef}</span>
                        <span className="text-white/40 text-[10px]">Facturae XML v3.2.2 Listo para FACe</span>
                      </div>
                      <button
                        onClick={handleCopyXml}
                        className="rounded-lg bg-white/10 px-3 py-1.5 text-[11px] text-white hover:bg-white hover:text-black transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedXml ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copiedXml ? 'Copiado' : 'Copiar XML'}</span>
                      </button>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div className="text-white/80">
                        <strong className="text-white block">Memoria Justificativa de Insuficiencia de Medios:</strong>
                        <p className="text-white/60 text-[10px] mt-1 italic leading-relaxed">
                          &ldquo;{generatedProposal.justificacionInsuficienciaMedios}&rdquo;
                        </p>
                      </div>
                      
                      <div className="border-t border-white/10 pt-2 text-[10px] text-white/50">
                        <strong className="text-[#AAD6CD] block">Alineación ODS 2030 Verificada:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                          {generatedProposal.odsAlineados.map((ods, i) => (
                            <li key={i}>{ods}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[10px] text-white/40">
                      <span className="truncate max-w-[200px]">Hash: {generatedProposal.sha256Integridad}</span>
                      <span className="text-emerald-400">FACe Ready</span>
                    </div>
                  </motion.div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* VISTA 2: CATÁLOGO INSTITUCIONAL 360 */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'SERVICIOS_360' && (
          <div className="space-y-10">
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#AAD6CD] font-bold">
                Cartera de Soluciones Públicas Homologadas
              </span>
              <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                Catálogo de Servicios 360
              </h2>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                Infraestructura propia sin subcontratas opacas. Desde festejos populares hasta cumbres diplomáticas, garantizamos solvencia técnica y certificados de montaje visados por colegio profesional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CARD 1: FIESTAS PATRONALES */}
              <div className="rounded-3xl border border-white/10 bg-[#09090d] p-8 space-y-4 hover:border-[#AAD6CD]/40 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 font-mono text-[10px] font-bold uppercase text-[#ecb613]">
                      Cultura & Festejos
                    </span>
                    <Volume2 size={20} className="text-[#AAD6CD]" />
                  </div>
                  <h3 className="font-syne text-2xl font-bold uppercase text-white">
                    Fiestas Patronales & Macroconciertos
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Escenarios móviles homologados, sistemas de sonido Line Array de 18 W/pax con limitador telemático calibrado y robótica de iluminación Beam/Wash.
                  </p>
                  <div className="border-t border-white/10 pt-3 space-y-1.5 font-mono text-xs text-white/60">
                    <div className="flex justify-between"><span>Potencia:</span><strong className="text-white">12.000 W RMS</strong></div>
                    <div className="flex justify-between"><span>Presión:</span><strong className="text-white">18 W/pax outdoor</strong></div>
                    <div className="flex justify-between"><span>Seguridad:</span><strong className="text-emerald-400">RC 600.000 € + OCA</strong></div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center font-mono text-xs">
                  <span className="text-white/50">Desde 6.500 € + IVA</span>
                  <span className="text-[#AAD6CD]">Techo 14.250 €</span>
                </div>
              </div>

              {/* CARD 2: PANTALLAS LED P2.6 */}
              <div className="rounded-3xl border border-white/10 bg-[#09090d] p-8 space-y-4 hover:border-[#AAD6CD]/40 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 font-mono text-[10px] font-bold uppercase text-[#AAD6CD]">
                      Infraestructura Visual
                    </span>
                    <Tv size={20} className="text-[#AAD6CD]" />
                  </div>
                  <h3 className="font-syne text-2xl font-bold uppercase text-white">
                    Pantallas LED P2.6 Outdoor (&gt; 5.500 nits)
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Murales modulares LED de alta luminosidad con estanqueidad IP65 legibles a pleno sol. Procesamiento Novastar 4K para retransmisiones oficiales y pregones.
                  </p>
                  <div className="border-t border-white/10 pt-3 space-y-1.5 font-mono text-xs text-white/60">
                    <div className="flex justify-between"><span>Pixel Pitch:</span><strong className="text-white">P2.6 mm High Definition</strong></div>
                    <div className="flex justify-between"><span>Luminancia:</span><strong className="text-white">&gt; 5.500 cd/m2</strong></div>
                    <div className="flex justify-between"><span>Protección:</span><strong className="text-emerald-400">IP65 Intemperie</strong></div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center font-mono text-xs">
                  <span className="text-white/50">Desde 2.800 € + IVA</span>
                  <span className="text-[#AAD6CD]">Escalable</span>
                </div>
              </div>

              {/* CARD 3: PROTOCOLO DE ESTADO */}
              <div className="rounded-3xl border border-white/10 bg-[#09090d] p-8 space-y-4 hover:border-[#AAD6CD]/40 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 font-mono text-[10px] font-bold uppercase text-sky-400">
                      Gabinete & Protocolo
                    </span>
                    <Radio size={20} className="text-[#AAD6CD]" />
                  </div>
                  <h3 className="font-syne text-2xl font-bold uppercase text-white">
                    Protocolo de Estado & Audio Encriptado
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Microfonía fija Shure Axient Digital con cifrado militar AES-256 para evitar escuchas y sabotajes. Atriles presidenciales y convoy VIP de 14 plazas.
                  </p>
                  <div className="border-t border-white/10 pt-3 space-y-1.5 font-mono text-xs text-white/60">
                    <div className="flex justify-between"><span>Cifrado RF:</span><strong className="text-white">AES-256 Militar</strong></div>
                    <div className="flex justify-between"><span>Flota:</span><strong className="text-white">Convoy 14 plazas VIP</strong></div>
                    <div className="flex justify-between"><span>Redundancia:</span><strong className="text-emerald-400">Línea Doble Analógica</strong></div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center font-mono text-xs">
                  <span className="text-white/50">Desde 4.800 € + IVA</span>
                  <span className="text-[#AAD6CD]">Techo 14.250 €</span>
                </div>
              </div>

              {/* CARD 4: PROYECTO VIMUME */}
              <div className="rounded-3xl border border-[#AAD6CD]/40 bg-gradient-to-br from-[#09090d] to-[#081226] p-8 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#AAD6CD]/20 border border-[#AAD6CD]/40 px-3 py-1 font-mono text-[10px] font-bold uppercase text-[#AAD6CD]">
                      Bienestar Social & ODS 2030
                    </span>
                    <Activity size={20} className="text-[#AAD6CD]" />
                  </div>
                  <h3 className="font-syne text-2xl font-bold uppercase text-white">
                    Plan VIMUME Neuroacústica Senior
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Programa municipal de estimulación cerebral mediante frecuencias gamma a 40Hz y música biográfica en directo en residencias públicas. SROI auditado de 4.85x.
                  </p>
                  <div className="border-t border-white/10 pt-3 space-y-1.5 font-mono text-xs text-white/60">
                    <div className="flex justify-between"><span>Presión Sonora:</span><strong className="text-white">&lt; 75 dB SPL controlado</strong></div>
                    <div className="flex justify-between"><span>Retorno Social:</span><strong className="text-emerald-400">4.85 € por cada 1 € invertido</strong></div>
                    <div className="flex justify-between"><span>Metas ODS:</span><strong className="text-[#AAD6CD]">ODS 3, 10 y 11</strong></div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center font-mono text-xs">
                  <span className="text-white/50">Piloto 4.200 € • Anual 14.250 €</span>
                  <Link href="/vimume" className="text-[#AAD6CD] hover:underline font-bold">Ver Dossier Clínico</Link>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* VISTA 3: MARCO LEGAL LCSP & ODS 2030 */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === 'MARCO_LEGAL_ODS' && (
          <div className="space-y-10">
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#AAD6CD] font-bold">
                Seguridad Jurídica & Cumplimiento Normativo
              </span>
              <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                El Marco Legal del Contrato Menor
              </h2>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                Toda contratación menor tramitada a través de EAR OS cumple taxativamente las disposiciones de la Ley 9/2017 de Contratos del Sector Público, la Ley 49/2002 de Mecenazgo y la Ley de Factura Electrónica.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-white/10 bg-[#09090d] p-6 space-y-3">
                <Scale className="text-[#AAD6CD]" size={28} />
                <h3 className="font-syne text-lg font-bold uppercase text-white">Art. 118 LCSP</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Los contratos de servicios de valor estimado inferior a 15.000 € únicamente requieren informe de necesidad y aprobación del gasto. Nuestro ajuste preventivo a 14.250 € blinda el expediente frente a auditorías del Tribunal de Cuentas.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#09090d] p-6 space-y-3">
                <FileText className="text-[#ecb613]" size={28} />
                <h3 className="font-syne text-lg font-bold uppercase text-white">Facturae & FACe</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Emisión telemática automática con esquema XML v3.2.2 y firma electrónica reconocida. Vinculación estricta a los códigos DIR3 del consistorio para ingreso en cuenta en &le; 30 días hábiles.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#09090d] p-6 space-y-3">
                <Award className="text-emerald-400" size={28} />
                <h3 className="font-syne text-lg font-bold uppercase text-white">Ley 49/2002 Mecenazgo</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Los proyectos canalizados a través del Proyecto VIMUME disfrutan de deducción fiscal del 80% en los primeros 250 € y del 40-45% en el resto, con emisión oficial del certificado para el Modelo 182 de la AEAT.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── FOOTER B2G ── */}
      <footer className="border-t border-white/10 bg-[#070709] px-4 sm:px-6 py-10 text-xs text-white/50 font-mono">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong className="text-white font-syne uppercase">Productora EAR Instituciones (B2G Hub)</strong>
            <p>Sede Logística Central: Méntrida (Toledo) • Licitación Ágil y Conforme a la LCSP.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/vimume" className="text-[#AAD6CD] hover:underline">
              Proyecto VIMUME
            </Link>
            <span>•</span>
            <Link href="/artistas" className="text-white hover:text-[#AAD6CD]">
              Roster Artístico
            </Link>
            <span>•</span>
            <a href="tel:+34693693048" className="text-[#AAD6CD]">
              +34 693 693 048
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
