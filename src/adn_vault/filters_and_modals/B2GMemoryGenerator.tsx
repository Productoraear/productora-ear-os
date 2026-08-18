"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, FileText, Download, Copy, Check, Sparkles, 
  ShieldCheck, ArrowRight, DollarSign, Calendar, MapPin, Award, Layers
} from 'lucide-react';

export const B2GMemoryGenerator: React.FC = () => {
  const [municipio, setMunicipio] = useState('Ayuntamiento de Toledo');
  const [objetoContrato, setObjetoContrato] = useState('Circuito Municipal de Conciertos de Gala y Tradición Musical');
  const [presupuestoMax, setPresupuestoMax] = useState(14950);
  const [fechaEvento, setFechaEvento] = useState('Septiembre 2026');
  const [codigoDIR3, setCodigoDIR3] = useState('L01451688');
  const [cpv, setCpv] = useState('92300000-4 (Servicios de Espectáculos)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDossier, setGeneratedDossier] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const ofertaSugerida = Math.round(presupuestoMax * 0.95 * 100) / 100;
  const ivaCalculado = Math.round(ofertaSugerida * 0.21 * 100) / 100;
  const totalConIVA = Math.round((ofertaSugerida + ivaCalculado) * 100) / 100;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const expHash = `EXP-B2G-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`;
      
      const doc = `================================================================================
MEMORIA JUSTIFICATIVA DE CONTRATO MENOR DE SERVICIOS ARTÍSTICOS Y TÉCNICOS
MARCO LEGAL: ARTÍCULO 118 DE LA LEY 9/2017 DE CONTRATOS DEL SECTOR PÚBLICO (LCSP)
EXPEDIENTE: ${expHash}
ORGANISMO CONTRATANTE: ${municipio}
CÓDIGO DIR3: ${codigoDIR3}
CÓDIGO CPV: ${cpv}
================================================================================

1. IDENTIFICACIÓN Y OBJETO DEL CONTRATO:
- Objeto: ${objetoContrato}.
- Justificación de Necesidad: Dotar al municipio de una propuesta cultural y musical de máxima excelencia técnica para el disfrute de la ciudadanía, fomentando la cohesión social y el acceso a espectáculos de alta calidad.
- Fecha Prevista de Ejecución: ${fechaEvento}.

2. JUSTIFICACIÓN DE LA MODALIDAD CONTRACTUAL (ART. 118 LCSP):
El presente expediente se tramita bajo la modalidad de Contrato Menor de Servicios, de conformidad con el artículo 118 de la Ley 9/2017 (LCSP), al tener un valor estimado inferior al umbral legal de 15.000,00 euros (IVA excluido), no superando dicho límite ni fraccionando el objeto del contrato.

3. DESGLOSE ECONÓMICO Y PRECIO CIERTO:
- Presupuesto Base de Licitación (Techo Máximo): ${presupuestoMax.toLocaleString('es-ES')} € (excl. IVA)
- Oferta Económica Homologada EAR OS (95% del Techo): ${ofertaSugerida.toLocaleString('es-ES')} €
- Impuesto sobre el Valor Añadido (IVA 21%): ${ivaCalculado.toLocaleString('es-ES')} €
- IMPORTE TOTAL ADJUDICABLE (IVA INCLUIDO): ${totalConIVA.toLocaleString('es-ES')} €

4. PRESCRIPCIONES TÉCNICAS INMUTABLES (S-CLASS STANDARD):
- Presión Acústica Homologada: Cobertura certificada a 12 W/pax mediante sistemas Line Array Bose F1 Model 812 o L-Acoustics, garantizando inteligibilidad cristalina y cumplimiento de ordenanzas acústicas municipales.
- Microfonía Inalámbrica: Shure Axient Digital / Beta 87A con escaneo activo UHF para prevención total de interferencias.
- Dirección Artística: Actuación de gala a cargo de Edwin Agudelo (Tenor Lírico y Ensamble de Mariachi de Gran Gala / Formación homologada).
- Seguro de Responsabilidad Civil: Póliza de RC vigente por importe de 1.000.000,00 € que cubre la totalidad del recinto y asistentes.
- Cumplimiento Laboral y Fiscal: Certificados al corriente de pago en Seguridad Social y Agencia Tributaria (AEAT), con alta en Seguridad Social de todo el personal técnico y artístico.

5. IMPACTO SOCIAL Y ALINEACIÓN CON LOS OBJETIVOS DE DESARROLLO SOSTENIBLE (ODS 2030):
- ODS 3 (Salud y Bienestar): Inclusión de frecuencias de estimulación afectiva VIMUME en el repertorio para la tercera edad.
- ODS 8 (Trabajo Decente): Contratación digna y homologada sin intermediarios abusivos.
- ODS 11 (Ciudades y Comunidades Sostenibles): Dinamización cultural de plazas públicas y descentralización del ocio.

6. INFORME DE INSUFICIENCIA DE MEDIOS MUNICIPALES:
Se hace constar la carencia de medios técnicos (equipos Line Array y microfonía digital de alta gama) y de personal artístico especializado en el catálogo municipal, resultando indispensable la contratación externa de Productora EAR para la correcta ejecución del evento.

================================================================================
EXPEDIENTE HOMOLOGADO POR PRODUCTORA EAR (EAR OS B2G DIVISION)
Centralita de Validación Oficial: +34 693 693 048 | hola@productoraear.com
Sede: Calle Tórtola 5, Encinasola (Toledo) • Cobertura Nacional
================================================================================`;
      
      setGeneratedDossier(doc);
      setIsGenerating(false);
    }, 400);
  };

  const handleCopy = () => {
    if (!generatedDossier) return;
    navigator.clipboard.writeText(generatedDossier);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 3000);
  };

  const handleDownload = () => {
    if (!generatedDossier) return;
    const blob = new Blob([generatedDossier], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Memoria_Tecnica_Art118_${municipio.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-[2.5rem] bg-[#09090d] border border-[#ecb613]/20 p-6 md:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.85)] relative overflow-hidden">
      {/* Halo de fondo */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3b82f6]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#ecb613]/10 blur-[110px] rounded-full pointer-events-none" />

      {/* CABECERA */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Building2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 block font-mono">
                Radar & Despacho Institucional B2G
              </span>
              <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/60 border border-white/10">
                Ley 9/2017 LCSP • Art. 118
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white font-syne">
              Generador de Memorias Técnicas para Ayuntamientos en 1-Clic
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-[#ecb613]">
          <ShieldCheck size={14} />
          <span>LÍMITE MENOR &lt; 15.000 €</span>
        </div>
      </div>

      {/* FORMULARIO DE GENERACIÓN */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">Organismo / Ayuntamiento</label>
          <input
            type="text"
            value={municipio}
            onChange={(e) => setMunicipio(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">Objeto del Contrato</label>
          <input
            type="text"
            value={objetoContrato}
            onChange={(e) => setObjetoContrato(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">Presupuesto Techo (€)</label>
          <input
            type="number"
            value={presupuestoMax}
            max={14999}
            onChange={(e) => setPresupuestoMax(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">Fecha Prevista del Evento</label>
          <input
            type="text"
            value={fechaEvento}
            onChange={(e) => setFechaEvento(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">Código DIR3 Municipal</label>
          <input
            type="text"
            value={codigoDIR3}
            onChange={(e) => setCodigoDIR3(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="space-y-1.5 flex items-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            <Sparkles size={14} />
            <span>{isGenerating ? 'Generando Expediente...' : 'Generar Memoria en 1-Clic'}</span>
          </button>
        </div>
      </div>

      {/* DOCUMENTO GENERADO */}
      <AnimatePresence>
        {generatedDossier && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 space-y-4 pt-4 border-t border-white/5"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-[#ecb613]" />
                <div>
                  <span className="text-xs font-bold text-white block">Expediente Art. 118 LCSP Listo para Presentación</span>
                  <span className="text-[10px] font-mono text-white/40">Oferta: {ofertaSugerida.toLocaleString('es-ES')} € + IVA ({totalConIVA.toLocaleString('es-ES')} € Total)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                >
                  {hasCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{hasCopied ? '¡Copiado!' : 'Copiar Texto'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-lg"
                >
                  <Download size={14} />
                  <span>Descargar Memoria (.txt)</span>
                </button>
              </div>
            </div>

            <pre className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 text-[11px] font-mono text-white/80 overflow-x-auto whitespace-pre-wrap max-h-[350px] leading-relaxed select-all">
              {generatedDossier}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
