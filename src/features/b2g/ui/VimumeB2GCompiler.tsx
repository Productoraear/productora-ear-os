'use client';

import React, { useState } from 'react';
import { 
  generateVimumeTender, 
  B2GTenderInput, 
  B2GTenderOutput, 
  B2G_PRESETS 
} from '@/lib/vimume/b2g-tender-engine';
import { 
  ShieldCheck, 
  Copy, 
  Download, 
  Printer, 
  AlertTriangle, 
  Building2 
} from 'lucide-react';

export function VimumeB2GCompiler() {
  const [formData, setFormData] = useState<B2GTenderInput>({
    entityName: 'Ayuntamiento de Toledo',
    department: 'Concejalía de Asuntos Sociales y Tercera Edad',
    dir3Code: 'L01450078',
    programPreset: 'PILOTO_TRIMESTRAL',
    customBudget: 4200
  });

  const [activeTab, setActiveTab] = useState<'DRAFT' | 'LEGAL' | 'CLINICAL' | 'SROI' | 'RIDER' | 'SECRETARY'>('DRAFT');
  const [copied, setCopied] = useState(false);

  const output: B2GTenderOutput = generateVimumeTender(formData);

  const handlePresetSelect = (presetKey: keyof typeof B2G_PRESETS) => {
    const preset = B2G_PRESETS[presetKey];
    setFormData(prev => ({
      ...prev,
      programPreset: presetKey,
      customBudget: preset.basePrice
    }));
  };

  const handleBudgetChange = (val: number) => {
    setFormData(prev => ({
      ...prev,
      customBudget: val
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output.sections.dossierCompletoMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'md' | 'txt') => {
    const element = document.createElement('a');
    const file = new Blob([output.sections.dossierCompletoMarkdown], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${output.expedienteId}_PLIEGO_OFICIAL_VIMUME.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 bg-[#050505] text-white font-sans">
      <div className="border border-[#1f1f1f] bg-[#0a0a0a] rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Homologado Art. 118 LCSP (&lt;15.000 €)
              </span>
              <span className="px-3 py-1 bg-blue-950/80 text-blue-400 border border-blue-800/50 rounded-full text-xs font-semibold tracking-wider">
                Ratio SROI 4.85x
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Compilador de Expedientes B2G VIMUME
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Generador de pliegos técnicos, memoria neuroclínica y justificación jurídica para Ayuntamientos y Consejerías.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#252525] border border-gray-800 rounded-lg text-xs font-medium flex items-center gap-2 transition-all"
            >
              <Copy className="w-4 h-4 text-gray-400" />
              {copied ? '¡Copiado!' : 'Copiar Dossier'}
            </button>
            <button
              onClick={() => handleDownload('md')}
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#252525] border border-gray-800 rounded-lg text-xs font-medium flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Descargar .MD
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-medium flex items-center gap-2 transition-all text-white shadow-lg shadow-blue-900/30"
            >
              <Printer className="w-4 h-4" />
              Imprimir A4
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" /> Parámetros del Municipio
          </h2>

          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Entidad Municipal / Proponente</label>
              <input
                type="text"
                value={formData.entityName}
                onChange={e => setFormData({ ...formData, entityName: e.target.value })}
                className="w-full bg-[#121212] border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Concejalía / Departamento</label>
              <input
                type="text"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-[#121212] border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Código DIR3 (Intervención Municipal)</label>
              <input
                type="text"
                value={formData.dir3Code || ''}
                onChange={e => setFormData({ ...formData, dir3Code: e.target.value })}
                placeholder="Ej: L01450078"
                className="w-full bg-[#121212] border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Selección de Preset Institucional</label>
              <div className="space-y-2">
                {(Object.keys(B2G_PRESETS) as Array<keyof typeof B2G_PRESETS>).map(key => {
                  const preset = B2G_PRESETS[key];
                  const isSelected = formData.programPreset === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handlePresetSelect(key)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs ${
                        isSelected 
                          ? 'bg-blue-950/40 border-blue-500 text-white' 
                          : 'bg-[#121212] border-gray-800 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <div className="font-semibold">{preset.name}</div>
                      <div className="text-[11px] text-gray-500">{preset.basePrice.toLocaleString('es-ES')} € (IVA excl.)</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Importe Personalizado (€ IVA excluido)</label>
              <input
                type="number"
                value={formData.customBudget || ''}
                onChange={e => handleBudgetChange(Number(e.target.value))}
                className="w-full bg-[#121212] border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm font-mono"
              />
            </div>
          </div>

          {output.financialSummary.adjustedCeilingApplied && (
            <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg flex items-start gap-2.5 text-xs text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <span className="font-semibold block mb-0.5">Control Estricto Techo LCSP</span>
                El importe introducido sobrepasaba los 15.000,00 €. Se ha ajustado automáticamente al 95% del límite legal (14.250,00 €) para permitir la adjudicación directa por Contrato Menor.
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4 flex flex-col">
          <div className="flex flex-wrap gap-1 border-b border-gray-800 pb-2">
            {[
              { id: 'DRAFT', label: 'Dossier Completo' },
              { id: 'LEGAL', label: 'Art. 118 LCSP' },
              { id: 'CLINICAL', label: 'Evidencia 40Hz' },
              { id: 'SROI', label: 'Split & SROI 4.85x' },
              { id: 'RIDER', label: 'Rider <75 dB' },
              { id: 'SECRETARY', label: 'Intervención DIR3' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#121212] text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-6 font-mono text-xs leading-relaxed text-gray-300 overflow-y-auto max-h-[600px] whitespace-pre-wrap selection:bg-blue-900 selection:text-white">
            {activeTab === 'DRAFT' && output.sections.dossierCompletoMarkdown}
            {activeTab === 'LEGAL' && output.sections.justificacionJuridicaLCSP}
            {activeTab === 'CLINICAL' && output.sections.fundamentacionNeuroclinica}
            {activeTab === 'SROI' && output.sections.desgloseSROI}
            {activeTab === 'RIDER' && output.sections.prescripcionesTecnicas}
            {activeTab === 'SECRETARY' && output.sections.fichaIntervencionMunicipal}
          </div>

          <div className="p-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-gray-500 font-mono">
            <div>EXPEDIENTE: <span className="text-gray-300">{output.expedienteId}</span></div>
            <div>SHA-256: <span className="text-emerald-400">{output.sha256Hash.substring(0, 24)}...</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VimumeB2GCompiler;
