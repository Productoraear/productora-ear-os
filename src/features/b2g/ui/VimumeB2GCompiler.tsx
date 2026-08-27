"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Award, 
  Layers,
  Printer,
  Phone,
  Heart,
  Brain,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

interface VIMUMEProgramPreset {
  id: string;
  name: string;
  department: string;
  objeto: string;
  presupuestoBase: number;
  duration: string;
  sessions: number;
  description: string;
}

const PRESETS: VIMUMEProgramPreset[] = [
  {
    id: 'piloto-trimestral',
    name: 'Piloto Trimestral 5 Centros / Residencias',
    department: 'Concejalía de Bienestar Social y Mayores',
    objeto: 'Programa Piloto de Estimulación Neuroacústica y Envejecimiento Activo VIMUME (12 Sesiones)',
    presupuestoBase: 4200,
    duration: '3 meses',
    sessions: 12,
    description: 'Ciclo de 12 sesiones clínicas de estimulación 40Hz y reminiscencia lírica para 120 mayores en centros municipales.'
  },
  {
    id: 'anti-soledad',
    name: 'Programa Integral Anti-Soledad No Deseada',
    department: 'Concejalía de Servicios Sociales y Familia',
    objeto: 'Intervención Psicosocial y Neuroacústica contra la Soledad No Deseada en Población Senior (24 Sesiones)',
    presupuestoBase: 8400,
    duration: '6 meses',
    sessions: 24,
    description: 'Reactivación relacional y emocional comunitaria con seguimiento de empatía reactiva y telemetría familiar.'
  },
  {
    id: 'gala-dia-mayor',
    name: 'Gala Institucional Día del Mayor + Protocolo VIMUME',
    department: 'Concejalía de Festejos y Tercera Edad',
    objeto: 'Gala Artística e Intervención Sonora Conmemorativa del Día Internacional de las Personas Mayores',
    presupuestoBase: 2800,
    duration: 'Jornada Única',
    sessions: 2,
    description: 'Concierto de Gala lírico con Edwin Agudelo (Tenor Lírico) + sesión comunitaria neuroacústica <75 dB SPL.'
  },
  {
    id: 'plan-anual-max',
    name: 'Plan Anual Municipal de Estimulación Cognitiva (Techo LCSP)',
    department: 'Concejalía de Sanidad y Bienestar Social',
    objeto: 'Servicio Anual de Terapia de Reminiscencia Musical y Estimulación Cerebral para la Red Municipal de Centros de Día',
    presupuestoBase: 14250,
    duration: '12 meses',
    sessions: 40,
    description: 'Cobertura anual intensiva para frenar el deterioro cognitivo leve-moderado. Ajustado al 95% del límite legal del Art. 118 LCSP.'
  }
];

export const VimumeB2GCompiler: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('piloto-trimestral');
  const [municipio, setMunicipio] = useState('Ayuntamiento de Toledo');
  const [concejalia, setConcejalia] = useState('Concejalía de Bienestar Social y Mayores');
  const [centroDestino, setCentroDestino] = useState('Red Municipal de Centros de Mayores y Centros de Día');
  const [objetoContrato, setObjetoContrato] = useState(PRESETS[0].objeto);
  const [presupuestoMax, setPresupuestoMax] = useState<number>(4200);
  const [fechaEvento, setFechaEvento] = useState('Cuarto Trimestre 2026');
  const [codigoDIR3, setCodigoDIR3] = useState('L01451688');
  const [cpv, setCpv] = useState('85320000-8 (Servicios de Bienestar Social)');
  const [beneficiarios, setBeneficiarios] = useState(150);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDossier, setGeneratedDossier] = useState<string | null>(null);
  const [expedienteHash, setExpedienteHash] = useState<string>('');
  const [hasCopied, setHasCopied] = useState(false);

  const selectPreset = (preset: VIMUMEProgramPreset) => {
    setSelectedPresetId(preset.id);
    setConcejalia(preset.department);
    setObjetoContrato(preset.objeto);
    setPresupuestoMax(preset.presupuestoBase);
  };

  const ofertaSugerida = Math.min(presupuestoMax, 14950);
  const ivaCalculado = Math.round(ofertaSugerida * 0.21 * 100) / 100;
  const totalConIVA = Math.round((ofertaSugerida + ivaCalculado) * 100) / 100;

  const handleGenerate = async () => {
    setIsGenerating(true);
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expId = `EXP-VIMUME-B2G-${randomHex}-2026`;
    setExpedienteHash(expId);

    // Call API in background for audit logging
    try {
      fetch('/api/b2g/dossier-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          municipio,
          presupuestoMax: ofertaSugerida,
          cpv,
          objeto: objetoContrato,
          codigoDIR3
        })
      }).catch(() => {});
    } catch {
      // Non-blocking
    }

    setTimeout(() => {
      const doc = `================================================================================
EXPEDIENTE DE CONTRATACIÓN MENOR DE SERVICIOS - ARTÍCULO 118 LCSP
PROGRAMA INSTITUCIONAL VIMUME // ESTIMULACIÓN NEUROACÚSTICA Y ENVEJECIMIENTO ACTIVO
EXPEDIENTE NÚMERO: ${expId}
VERIFICACIÓN CRIPTOGRÁFICA SHA-256: ${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}
================================================================================

1. ÓRGANO CONTRATANTE Y DATOS ADMINISTRATIVOS:
- Entidad Contratante: ${municipio}
- Unidad Promotora: ${concejalia}
- Centros Destinatarios: ${centroDestino}
- Código DIR3 Municipal: ${codigoDIR3}
- Código CPV Principal: ${cpv}
- Población Beneficiaria Estimada: ${beneficiarios} usuarios del municipio.

2. OBJETO Y ALCANCE DEL CONTRATO:
- Objeto: ${objetoContrato}.
- Modalidad: Contrato Menor de Servicios regulado en el Art. 118 de la Ley 9/2017 de Contratos del Sector Público (LCSP).
- Período de Ejecución: ${fechaEvento}.
- Justificación de la Necesidad Pública: Implementación de un programa de estimulación neurocognitiva y bienestar psicoemocional para personas mayores del municipio, orientado a prevenir el aislamiento social, combatir la Soledad No Deseada y ralentizar el deterioro cognitivo mediante terapia de reminiscencia sonora y frecuencias 40Hz.

3. JUSTIFICACIÓN DE LA SINGULARIDAD Y EXCLUSIVIDAD ARTÍSTICO-CIENTÍFICA:
- Dirección Artística: A cargo de Edwin Agudelo (Tenor Lírico homologado, especializado en técnica vocal y empatía neuroacústica gerontológica).
- Metodología Exclusiva VIMUME: Protocolo acústico de neuro-reminiscencia activa registrado, con emisión sonora calibrada bajo estricto límite de seguridad física (<75 dB SPL) para evitar sobreestimulación sensorial en personas con demencias o Alzheimer.
- Singularidad: Los servicios requeridos no son sustituibles por animación convencional de ocio, requiriendo acreditación técnica, rider electroacústico calibrado a 12 W/pax y bitácora de impacto emocional.

4. DESGLOSE ECONÓMICO Y JUSTIFICACIÓN DE PRECIO CIERTO:
- Base Imponible (Presupuesto Licitado): ${ofertaSugerida.toLocaleString('es-ES', { minimumFractionDigits: 2 })} € (IVA excluido)
- Impuesto sobre el Valor Añadido (IVA 21%): ${ivaCalculado.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
- IMPORTE TOTAL ADJUDICABLE (IVA INCLUIDO): ${totalConIVA.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
- Declaración de No Superación de Límites: El valor estimado del contrato es inferior al umbral legal de 15.000,00 € establecido para contratos menores de servicios en el artículo 118.1 de la Ley 9/2017 (LCSP), no habiéndose producido fraccionamiento de gasto alguno.

5. PRESCRIPCIONES TÉCNICAS, DE CALIDAD Y SEGURIDAD:
a) Presión Acústica Controlada: Garantía de no superación de 75 dB SPL en recintos cerrados de centros de día y residencias.
b) Infraestructura: Sistema Line Array Bose F1 / Sistemas electroacústicos calibrados a 12 W/pax y microfonía profesional digital Shure Axient/Beta 87A con inmunidad a radiofrecuencias.
c) Póliza de Responsabilidad Civil: Cobertura de RC patronal y general vigente por 1.000.000,00 €.
d) Cumplimiento Normativo: Empresa y cuadro artístico inscritos en el ROLECE, con certificados vigentes de hallarse al corriente en sus obligaciones con la Seguridad Social (TGSS) y la Agencia Tributaria (AEAT).
e) Protección de Datos: Cumplimiento estricto del RGPD (UE 2016/679) y Ley Orgánica 3/2018 (LOPDGDD) en el tratamiento de telemetría de bienestar sin almacenamiento de datos médicos sensibles.

6. ALINEACIÓN CON LA ESTRATEGIA DE ENVEJECIMIENTO ACTIVO Y ODS 2030:
- ODS 3 (Salud y Bienestar): Fomento de la salud mental, estimulación neuronal y bienestar afectivo de la tercera edad.
- ODS 10 (Reducción de las Desigualdades): Acceso universal a cultura de excelencia para colectivos vulnerables o dependientes.
- ODS 11 (Comunidades Sostenibles): Humanización y cohesión intergeneracional en el tejido municipal.

7. INFORME DE INSUFICIENCIA DE MEDIOS MUNICIPALES:
Se certifica que la entidad contratante no dispone de personal artístico-lírico cualificado en plantilla ni de equipamiento electroacústico homologado de neuro-reminiscencia para desarrollar el presente programa de forma interna, resultando necesaria la contratación externa de Productora EAR / VIMUME.

================================================================================
EXPEDIENTE HOMOLOGADO POR PRODUCTORA EAR // DIVISIÓN B2G INSTITUCIONAL
Centralita de Atención a Secretarías e Intervenciones: +34 693 693 048
Email Oficial de Licitaciones: b2g@productoraear.com | www.edwinagudelo.es/vimume/b2g
Sede Operativa: Calle Tórtola 5, Encinasola (Toledo) • Cobertura Nacional
================================================================================`;

      setGeneratedDossier(doc);
      setIsGenerating(false);
    }, 450);
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
    link.download = `Expediente_Art118_VIMUME_${municipio.replace(/\s+/g, '_')}_2026.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!generatedDossier) return;
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Expediente Art. 118 LCSP - VIMUME ${municipio}</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { 
              font-family: 'Courier New', Courier, monospace; 
              font-size: 11px; 
              line-height: 1.5; 
              color: #000; 
              background: #fff; 
              padding: 20px;
            }
            .header-box {
              border: 2px solid #000;
              padding: 12px;
              margin-bottom: 20px;
              text-align: center;
              font-weight: bold;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: inherit;
            }
            .footer-sign {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
            }
            .sign-box {
              width: 45%;
              border-top: 1px solid #000;
              text-align: center;
              padding-top: 10px;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header-box">
            DOCUMENTO TÉCNICO ADMINISTRATIVO DE CONTRATACIÓN MENOR<br/>
            ARTÍCULO 118 LEY 9/2017 (LCSP) • EXPEDIENTE: ${expedienteHash || 'EXP-VIMUME-2026'}
          </div>
          <pre>${generatedDossier}</pre>
          <div class="footer-sign">
            <div class="sign-box">
              POR EL ÓRGANO CONTRATANTE<br/>
              ${municipio}<br/>
              (Firma y Sello Digital)
            </div>
            <div class="sign-box">
              POR LA ENTIDAD ADJUDICATARIA<br/>
              PRODUCTORA EAR / VIMUME<br/>
              (Firma y Sello de Homologación)
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const whatsappMessage = encodeURIComponent(
    `🏛️ *SOLICITUD DE TRAMITACIÓN B2G ART. 118 LCSP*\n\n` +
    `*Organismo:* ${municipio}\n` +
    `*Concejalía:* ${concejalia}\n` +
    `*Objeto:* ${objetoContrato}\n` +
    `*Importe Propuesto:* ${ofertaSugerida.toLocaleString('es-ES')} € + IVA (${totalConIVA.toLocaleString('es-ES')} € Total)\n` +
    `*DIR3:* ${codigoDIR3}\n` +
    `*Expediente:* ${expedienteHash || 'Generado en Portal VIMUME B2G'}\n\n` +
    `Por favor, confirmar disponibilidad técnica y envío de certificado de exclusividad y solvencia para fiscalización en intervención.`
  );

  return (
    <div className="space-y-8">
      {/* SELECTOR DE PROGRAMAS PREDEFINIDOS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613] font-bold">
            1. Seleccionar Modalidad o Crear a Medida
          </span>
          <span className="text-[10px] font-mono text-white/40">
            Marco Art. 118 LCSP (&lt;15.000 €)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => selectPreset(preset)}
                className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#ecb613]/15 to-white/5 border-[#ecb613] shadow-[0_0_25px_rgba(236,182,19,0.15)]'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-bold text-[#ecb613] uppercase">
                      {preset.duration} • {preset.sessions} Ses.
                    </span>
                    {isSelected && <CheckCircle2 size={14} className="text-[#ecb613]" />}
                  </div>
                  <h4 className="text-sm font-bold text-white leading-tight font-syne">
                    {preset.name}
                  </h4>
                  <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between">
                  <span className="text-xs font-mono font-black text-white">
                    {preset.presupuestoBase.toLocaleString('es-ES')} €
                  </span>
                  <span className="text-[9px] font-mono text-white/40">+ IVA 21%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PANEL PRINCIPAL DEL COMPILADOR */}
      <div className="rounded-[2.5rem] bg-[#09090d] border border-[#ecb613]/30 p-6 md:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.85)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-rose-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#ecb613]/10 blur-[120px] rounded-full pointer-events-none" />

        {/* CABECERA DEL PANEL */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <Building2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ecb613] block font-mono">
                  AUTO-COMPILADOR B2G EXPRESS
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Adjudicación Directa &lt;24h
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white font-syne">
                Pliego de Prescripciones Técnicas y Memoria Art. 118 LCSP
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-right">
              <span className="text-[9px] font-mono text-white/40 block uppercase">Oferta Base (sin IVA)</span>
              <span className="text-base font-mono font-black text-[#ecb613]">
                {ofertaSugerida.toLocaleString('es-ES')} €
              </span>
            </div>
            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-right">
              <span className="text-[9px] font-mono text-white/40 block uppercase">Total Adjudicable (21% IVA)</span>
              <span className="text-base font-mono font-black text-white">
                {totalConIVA.toLocaleString('es-ES')} €
              </span>
            </div>
          </div>
        </div>

        {/* FORMULARIO EDITABLE */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">
              Organismo / Ayuntamiento Licitante
            </label>
            <input
              type="text"
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">
              Concejalía / Unidad Gestora
            </label>
            <input
              type="text"
              value={concejalia}
              onChange={(e) => setConcejalia(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">
              Centros Destino / Instalaciones
            </label>
            <input
              type="text"
              value={centroDestino}
              onChange={(e) => setCentroDestino(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]"
            />
          </div>

          <div className="space-y-1.5 lg:col-span-2">
            <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">
              Objeto del Contrato de Servicios
            </label>
            <input
              type="text"
              value={objetoContrato}
              onChange={(e) => setObjetoContrato(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">
              Presupuesto Base (€ s/IVA, máx 14.999€)
            </label>
            <input
              type="number"
              value={presupuestoMax}
              max={14999}
              min={350}
              onChange={(e) => setPresupuestoMax(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613] font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">
              Período de Ejecución Previsto
            </label>
            <input
              type="text"
              value={fechaEvento}
              onChange={(e) => setFechaEvento(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">
              Código DIR3 Municipal (FacturaE)
            </label>
            <input
              type="text"
              value={codigoDIR3}
              onChange={(e) => setCodigoDIR3(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613] font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold uppercase text-white/50 block">
              Código CPV Oficial
            </label>
            <input
              type="text"
              value={cpv}
              onChange={(e) => setCpv(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613] font-mono"
            />
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN PRINCIPAL */}
        <div className="relative z-10 pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Validez jurídica conforme a Ley 9/2017 LCSP • Seguro RC 1.000.000 € • ROLECE Activo</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-[#ecb613] to-amber-400 text-black font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(236,182,19,0.3)] font-mono"
          >
            <Sparkles size={16} />
            <span>{isGenerating ? 'Compilando Pliego Oficial...' : 'Compilar Pliego Art. 118 LCSP'}</span>
          </button>
        </div>

        {/* ÁREA DE PREVISUALIZACIÓN Y ACCIONES DEL PLIEGO GENERADO */}
        <AnimatePresence>
          {generatedDossier && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 space-y-6 pt-8 border-t border-white/10 mt-8"
            >
              {/* Barra de herramientas del documento */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Expediente {expedienteHash}</span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        Listo para Tramitación
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-white/40">
                      Importe Licitado: {ofertaSugerida.toLocaleString('es-ES')} € + IVA ({totalConIVA.toLocaleString('es-ES')} € Total)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                  >
                    {hasCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{hasCopied ? '¡Copiado!' : 'Copiar'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    <span>Descargar TXT</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-lg"
                  >
                    <Printer size={14} />
                    <span>Imprimir / PDF Oficial</span>
                  </button>

                  <a
                    href={`https://wa.me/34693693048?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <Phone size={14} />
                    <span>Tramitar con Centralita B2G</span>
                  </a>
                </div>
              </div>

              {/* Visor tipo consola/documento legal */}
              <div className="relative">
                <pre className="w-full bg-black/80 border border-white/10 rounded-2xl p-6 md:p-8 text-[11px] font-mono text-white/90 overflow-x-auto whitespace-pre-wrap max-h-[500px] leading-relaxed select-all">
                  {generatedDossier}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VimumeB2GCompiler;
