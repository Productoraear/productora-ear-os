'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Scale,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Volume2,
  FileCheck2,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { B2GMunicipalitySearch } from './B2GMunicipalitySearch';
import { B2GMunicipalityEntry, resolveB2GInfo } from '@/lib/geo/b2g-municipal-resolver';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_B2G_LCSP_EUR,
  CENTRALITA_EAR_OS,
  VAT_RATE,
  SPLIT_SOBERANO
} from '@/lib/constants/ear-os-ssot';
import {
  validateDIR3Code,
  calculateLCSPMinorContract,
  generateFacturaeXML,
  B2GPackageItem,
  DIR3Codes
} from '@/lib/b2g-tender-engine';

export interface B2GMunicipalPackage {
  id: string;
  title: string;
  category: 'CULTURA_FESTEJOS' | 'AUDIO_ILUMINACION' | 'ACTUACION_ARTISTICA';
  basePriceEur: number;
  description: string;
  rider: string;
  vimumeSocialIncluded: boolean;
}

const INSTITUTIONAL_PACKAGES: B2GMunicipalPackage[] = [
  {
    id: 'fiestas-patronales-macro',
    title: 'Gala Fiestas Patronales & Sonorización 12 W/pax',
    category: 'CULTURA_FESTEJOS',
    basePriceEur: 12500,
    description: 'Producción de plaza mayor: Sistema Line Array Bose F1 / L-Acoustics calibrado a 12 W/pax, robótica de iluminación y actuación estelar.',
    rider: 'Bose F1 Model 812 Dual Array + Shure Axient Digital AES-256 + Limitador Homologado Ley 37/2003',
    vimumeSocialIncluded: true
  },
  {
    id: 'edwin-agudelo-gala-solista',
    title: 'Concierto de Gala Exclusiva: Edwin Agudelo (Tenor Lírico)',
    category: 'ACTUACION_ARTISTICA',
    basePriceEur: 5500,
    description: 'Concierto sinfónico / mariachi de gran gala bajo exclusividad artística (Art. 168.a.2º LCSP) con repertorio patrimonial.',
    rider: 'Microfonía vocal Shure KSM8 / Beta 87A + Póliza de RC 1.000.000 €',
    vimumeSocialIncluded: true
  },
  {
    id: 'concierto-dia-mayor-institucional',
    title: 'Conmemoración Día del Mayor & Festivales de Tradición',
    category: 'CULTURA_FESTEJOS',
    basePriceEur: 4200,
    description: 'Concierto acústico de memoria lírica en auditorio municipal o plaza cívica, integrado con protocolo de salud cognitiva.',
    rider: 'Control acústico estricto < 75 dB SPL + Sistema Line Array de baja fatiga auditiva',
    vimumeSocialIncluded: true
  }
];

export function B2GMunicipalFastTrackPortal() {
  // Estado municipal
  const [municipio, setMunicipio] = useState('Toledo');
  const [provincia, setProvincia] = useState('Toledo');
  const [cif, setCif] = useState('P4516800E');
  const [dir3, setDir3] = useState('L01451688');
  const [isVerifiedMun, setIsVerifiedMun] = useState(true);

  // Paquete seleccionado y fecha
  const [selectedPkgId, setSelectedPkgId] = useState<string>(INSTITUTIONAL_PACKAGES[0].id);
  const [eventDate, setEventDate] = useState('Agosto 2026');
  const [customPrice, setCustomPrice] = useState<number>(INSTITUTIONAL_PACKAGES[0].basePriceEur);

  // Recinto y acústica
  const [recintoTipo, setRecintoTipo] = useState<'plaza_exterior' | 'polideportivo' | 'teatro_auditorio'>('plaza_exterior');
  const [aforoEstimado, setAforoEstimado] = useState<number>(1000);

  // Copia / Descarga estados
  const [copiedDoc, setCopiedDoc] = useState<'memoria' | 'facturae' | 'rc' | null>(null);

  const selectedPkg = INSTITUTIONAL_PACKAGES.find(p => p.id === selectedPkgId) || INSTITUTIONAL_PACKAGES[0];

  // Cálculos económicos blindados a SSOT
  const rawBase = customPrice;
  const baseImponible = Math.min(rawBase, AJUSTE_PREVENTIVO_B2G_EUR);
  const isAjusteAplicado = rawBase > AJUSTE_PREVENTIVO_B2G_EUR;
  const cuotaIva = Math.round(baseImponible * VAT_RATE * 100) / 100;
  const totalLicitacion = Math.round((baseImponible + cuotaIva) * 100) / 100;

  // Cálculo acústico según aforo y recinto
  const potenciaRequeridaW = aforoEstimado * 12; // 12 W/pax
  const limiteDbSpl = recintoTipo === 'plaza_exterior' ? 85 : 75;

  const handleSelectMunicipality = (entry: B2GMunicipalityEntry) => {
    setMunicipio(entry.name);
    setProvincia(entry.province);
    setCif(entry.cif);
    setDir3(entry.dir3);
    setIsVerifiedMun(!!entry.isVerified);
  };

  const handlePackageChange = (pkgId: string) => {
    setSelectedPkgId(pkgId);
    const found = INSTITUTIONAL_PACKAGES.find(p => p.id === pkgId);
    if (found) {
      setCustomPrice(found.basePriceEur);
    }
  };

  // Generación de Memoria Art. 118 LCSP
  const generateMemoriaText = (): string => {
    const expCode = `EXP-LCSP-${municipio.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-2026`;
    return `════════════════════════════════════════════════════════════════════════════════
MEMORIA JUSTIFICATIVA DE CONTRATACIÓN MENOR (ART. 118 LEY 9/2017 LCSP)
EXPEDIENTE: ${expCode}
ORGANISMO CONTRATANTE: Excmo. Ayuntamiento de ${municipio} (${provincia})
CIF INSTITUCIONAL: ${cif}  |  CÓDIGO DIR3: ${dir3}
FECHA PREVISTA DE EJECUCIÓN: ${eventDate}
════════════════════════════════════════════════════════════════════════════════

1. OBJETO Y DESCRIPCIÓN DEL CONTRATO:
   - Denominación: ${selectedPkg.title}
   - Código CPV: 92300000-4 (Servicios de Espectáculos y Eventos Culturales)
   - Resumen Técnico: ${selectedPkg.description}
   - Configuración Acústica Recinto: ${recintoTipo.replace('_', ' ').toUpperCase()}
     * Aforo Estimado: ${aforoEstimado} asistentes
     * Potencia Homologada: ${potenciaRequeridaW.toLocaleString('es-ES')} W (12 W/pax conforme a normativa de inteligibilidad)
     * Límite de Inmisión Acústica: < ${limiteDbSpl} dB SPL (Ley 37/2003 de Ruido)

2. PACTO DUAL "CULTURA + SERVICIOS SOCIALES" (MÓDULO VIMUME INCLUIDO):
   En virtud del compromiso social y del Split Soberano de Productora EAR (10% revertido
   directamente al protocolo de investigación neurológica VIMUME), la presente contratación
   incluye SIN COSTE ADICIONAL para las arcas municipales:
   - 1 Jornada Matinal de Musicoterapia Activa y Estimulación Cognitiva VIMUME (40 Hz)
     destinada a la Residencia Municipal de Mayores o Centro de Día de ${municipio}.
   - SROI Comprobado: 4.85x de retorno social sobre la inversión pública.
   - Alineación ODS: ODS 3 (Salud y Bienestar), ODS 10 (Reducción Desigualdades) y ODS 11 (Comunidades Sostenibles).

3. DESGLOSE ECONÓMICO Y JUSTIFICACIÓN DE PRECIO CIERTO:
   - Base Imponible Adjudicada: ${baseImponible.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
   - Techo Legal Art. 118 LCSP: ${LIMITE_B2G_LCSP_EUR.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
   - Ajuste Preventivo de Intervención: Criterio preventivo al 95% (${AJUSTE_PREVENTIVO_B2G_EUR.toLocaleString('es-ES')} €) garantizado.
   - IVA Aplicable (21%): ${cuotaIva.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
   - IMPORTE TOTAL ADJUDICABLE (IVA INCLUIDO): ${totalLicitacion.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €

4. CLÁUSULA ANTIFRAUDE Y NO FRACCIONAMIENTO CONTRACTUAL (ART. 118.3 LCSP):
   El órgano de contratación hace constar que la presente prestación constituye una unidad
   funcional completa e independiente, respondiendo a una necesidad cultural estacional y no
   habiéndose producido fraccionamiento indebido con el fin de eludir los umbrales de la
   licitación ordinaria.

5. SOLVENCIA TÉCNICA, LABORAL Y PÓLIZA DE RESPONSABILIDAD CIVIL:
   - Póliza de Responsabilidad Civil: Cobertura de 1.000.000,00 € contratada para la totalidad del evento.
   - Situación Administrativa: Certificados positivos y vigentes al corriente de pago con AEAT y Seguridad Social.
   - Personal Facultativo: 100% de técnicos y artistas dados de alta en el Régimen General de la Seguridad Social.

Emitido para su incorporación inmediata al expediente de Secretaría e Intervención.
════════════════════════════════════════════════════════════════════════════════`;
  };

  // Generación de XML Facturae 3.2.2
  const generateFacturaeContent = (): string => {
    const dir3Obj: DIR3Codes = {
      oficinaContable: dir3,
      organoGestor: dir3,
      unidadTramitadora: dir3
    };
    const items: B2GPackageItem[] = [
      {
        id: selectedPkg.id,
        name: selectedPkg.title,
        unitPrice: baseImponible,
        quantity: 1,
        category: selectedPkg.category,
        description: selectedPkg.description
      }
    ];
    const proposal = calculateLCSPMinorContract(items, `Ayuntamiento de ${municipio}`, cif, dir3Obj);
    return generateFacturaeXML(proposal);
  };

  // Certificado de Exclusividad y Solvencia RC
  const generateSolvenciaCert = (): string => {
    return `════════════════════════════════════════════════════════════════════════════════
CERTIFICADO DE SOLVENCIA TÉCNICA, EXCLUSIVIDAD Y PÓLIZA DE SEGURO RC
EMPRESA ADJUDICATARIA: PRODUCTORA EAR AUDIOVISUAL S.L. (CIF B88392019)
ORGANISMO BENEFICIARIO: Excmo. Ayuntamiento de ${municipio}
════════════════════════════════════════════════════════════════════════════════

1. COBERTURA DE RESPONSABILIDAD CIVIL:
   Se certifica que Productora EAR Audiovisual S.L. mantiene en vigor Póliza de Seguro de
   Responsabilidad Civil General y Patronal por importe mínimo garantizado de:
   >>> 1.000.000,00 € (UN MILLÓN DE EUROS) <<<
   con cobertura expresa de daños a recintos públicos municipales, asistentes y personal técnico.

2. CERTIFICACIÓN DE EXCLUSIVIDAD ARTÍSTICA Y TÉCNICA:
   De conformidad con el Artículo 168.a.2º de la LCSP, se hace constar que los elencos de gala
   dirigidos por Edwin Agudelo cuentan con derechos exclusivos de producción y formato sonoro
   homologado, garantizando que no existe duplicidad ni intermediación sobrecargada.

3. COMPROMISO AMBIENTAL Y ACÚSTICO (LEY 37/2003):
   Toda la microfonía opera bajo barrido de frecuencias digitales Shure Axient (anti-interferencias)
   y limitadores homologados con precinto, garantizando el respeto de los límites zonales del municipio.

Expedido a petición del Ayuntamiento de ${municipio} a fecha ${new Date().toLocaleDateString('es-ES')}.
════════════════════════════════════════════════════════════════════════════════`;
  };

  const handleCopy = (kind: 'memoria' | 'facturae' | 'rc') => {
    let text = '';
    if (kind === 'memoria') text = generateMemoriaText();
    if (kind === 'facturae') text = generateFacturaeContent();
    if (kind === 'rc') text = generateSolvenciaCert();

    navigator.clipboard.writeText(text);
    setCopiedDoc(kind);
    setTimeout(() => setCopiedDoc(null), 2500);
  };

  const handleDownload = (kind: 'memoria' | 'facturae' | 'rc') => {
    let text = '';
    let filename = '';
    let mime = 'text/plain;charset=utf-8';

    if (kind === 'memoria') {
      text = generateMemoriaText();
      filename = `Memoria_Art118_${municipio.replace(/\s+/g, '_')}_2026.txt`;
    } else if (kind === 'facturae') {
      text = generateFacturaeContent();
      filename = `FacturaE_3.2.2_${dir3}_${municipio.replace(/\s+/g, '_')}.xml`;
      mime = 'application/xml;charset=utf-8';
    } else {
      text = generateSolvenciaCert();
      filename = `Certificado_Solvencia_RC1M_${municipio.replace(/\s+/g, '_')}.txt`;
    }

    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const whatsappInquiryUrl = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hola Productora EAR, desde el Ayuntamiento de ${municipio} (DIR3: ${dir3}) solicitamos validación de fecha para el paquete "${selectedPkg.title}" (${baseImponible.toLocaleString('es-ES')} € + IVA) con el módulo social VIMUME incluido.`
  )}`;

  return (
    <div className="space-y-10">

      {/* TARJETA PRINCIPAL: CONFIGURADOR INSTITUCIONAL FAST-TRACK */}
      <div className="rounded-3xl bg-[#09090d]/90 border border-white/10 backdrop-blur-xl p-6 sm:p-8 space-y-8 shadow-2xl">

        {/* CABECERA DEL CONFIGURADOR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-full text-[#06b6d4] text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
              <Scale size={12} />
              VENTANILLA ÚNICA DE CONTRATACIÓN MENOR · ART. 118 LCSP
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
              Fast-Track Municipal <span className="text-[#06b6d4]">&lt; 14.250 €</span>
            </h2>
            <p className="text-xs text-zinc-400 max-w-xl">
              Configura en vivo el expediente municipal para cualquier ayuntamiento de España, auto-rellenando el código DIR3 y descargando de inmediato la tripleta documental de legalidad.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 bg-white/5 border border-white/10 rounded-2xl p-4 shrink-0 font-mono">
            <span className="text-[10px] uppercase text-[#06b6d4] tracking-wider font-bold">
              Techo de Intervención (95%)
            </span>
            <div className="text-2xl font-black text-white font-syne">
              {baseImponible.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <span className="text-[10px] text-zinc-400">
              Total con IVA: <strong className="text-white">{totalLicitacion.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</strong>
            </span>
          </div>
        </div>

        {/* PASO 1: SELECTOR DE MUNICIPIO CON AUTOCOMPLETADO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#06b6d4] text-black font-bold text-xs flex items-center justify-center font-mono">
              1
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Localización Institucional & Datos DIR3
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <B2GMunicipalitySearch
                selectedMunicipality={municipio}
                onSelect={handleSelectMunicipality}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase text-white/60 block flex items-center justify-between">
                <span>CIF del Ayuntamiento</span>
                <span className="text-[9px] text-emerald-400">Auto-asignado</span>
              </label>
              <input
                type="text"
                value={cif}
                onChange={(e) => setCif(e.target.value.toUpperCase())}
                placeholder="P4516800E"
                maxLength={9}
                className="w-full bg-white/5 border border-white/10 focus:border-[#06b6d4] rounded-xl px-4 py-2.5 text-xs text-white font-mono uppercase transition-all outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase text-white/60 block flex items-center justify-between">
                <span>Código DIR3 (Órgano Gestor)</span>
                <span className="text-[9px] text-cyan-400">Punto General FACe</span>
              </label>
              <input
                type="text"
                value={dir3}
                onChange={(e) => setDir3(e.target.value.toUpperCase())}
                placeholder="L01451688"
                maxLength={9}
                className="w-full bg-white/5 border border-white/10 focus:border-[#06b6d4] rounded-xl px-4 py-2.5 text-xs text-white font-mono uppercase transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* PASO 2: SELECCIÓN DEL PAQUETE Y PACTO DUAL VIMUME */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#06b6d4] text-black font-bold text-xs flex items-center justify-center font-mono">
              2
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Paquete Cultural Homologado + Módulo VIMUME Social
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INSTITUTIONAL_PACKAGES.map((pkg) => {
              const isSelected = selectedPkgId === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => handlePackageChange(pkg.id)}
                  className={`rounded-2xl border p-5 cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#06b6d4]/10 border-[#06b6d4] shadow-[0_0_25px_rgba(6,182,212,0.25)]'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-[#06b6d4] uppercase tracking-wider font-bold">
                        {pkg.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-black text-white font-mono">
                        {pkg.basePriceEur.toLocaleString('es-ES')} €
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm font-syne leading-snug">
                      {pkg.title}
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  {/* BADGE DEL PACTO DUAL VIMUME */}
                  <div className="pt-3 border-t border-white/10 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-300 font-mono font-bold">
                      <HeartHandshake size={13} className="text-emerald-400 shrink-0" />
                      <span>PACTO DUAL: Jornada VIMUME Incluida</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-tight">
                      Sesión de estimulación para la Residencia Municipal de {municipio} (0 € coste adicional).
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PASO 3: PLAN ACÚSTICO Y AFORO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#06b6d4] text-black font-bold text-xs flex items-center justify-center font-mono">
              3
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Dimensionamiento Acústico y Seguridad (Ley 37/2003 de Ruido)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase text-white/60 block">
                Tipo de Recinto Municipal
              </label>
              <select
                value={recintoTipo}
                onChange={(e) => setRecintoTipo(e.target.value as any)}
                className="w-full bg-[#0c0d14] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#06b6d4]"
              >
                <option value="plaza_exterior">Plaza Mayor / Recinto Ferial Exterior</option>
                <option value="polideportivo">Pabellón Polideportivo Municipal</option>
                <option value="teatro_auditorio">Teatro / Auditorio Municipal Climatizado</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold uppercase text-white/60 block">
                Aforo Estimado (Personas)
              </label>
              <input
                type="number"
                min={100}
                max={15000}
                step={100}
                value={aforoEstimado}
                onChange={(e) => setAforoEstimado(Math.max(100, parseInt(e.target.value) || 500))}
                className="w-full bg-[#0c0d14] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#06b6d4]"
              />
            </div>

            <div className="flex flex-col justify-center space-y-1 font-mono text-[11px] bg-black/40 p-3 rounded-xl border border-white/5">
              <div className="flex items-center justify-between text-zinc-300">
                <span>Potencia certificada:</span>
                <strong className="text-[#06b6d4]">{potenciaRequeridaW.toLocaleString('es-ES')} W (12 W/pax)</strong>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span>Inmisión máxima:</span>
                <strong className="text-emerald-400">&lt; {limiteDbSpl} dB SPL (Ley 37/2003)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* PASO 4: DESCARGA DE LA TRIPLETA DOCUMENTAL INMEDIATA */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#06b6d4] text-black font-bold text-xs flex items-center justify-center font-mono">
                4
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                Tripleta Documental LCSP Art. 118 (Descarga Inmediata)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              Expediente listo para Secretaría e Intervención
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* DOCUMENTO 1: MEMORIA JUSTIFICATIVA */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
                  <FileText size={16} />
                  <span>1. Memoria Justificativa</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Informe de necesidad, justificación de precio cierto, no fraccionamiento y pacto dual VIMUME.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleCopy('memoria')}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedDoc === 'memoria' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedDoc === 'memoria' ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload('memoria')}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#06b6d4] hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <Download size={13} />
                  <span>Descargar</span>
                </button>
              </div>
            </div>

            {/* DOCUMENTO 2: FACTURAE 3.2.2 XML */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
                  <FileCheck2 size={16} />
                  <span>2. FacturaE XML (FACe)</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Esquema XML Facturae v3.2.2 normalizado con código DIR3 {dir3} listo para registrar en FACe.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleCopy('facturae')}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedDoc === 'facturae' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedDoc === 'facturae' ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload('facturae')}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#06b6d4] hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <Download size={13} />
                  <span>Descargar XML</span>
                </button>
              </div>
            </div>

            {/* DOCUMENTO 3: SOLVENCIA Y RC 1M */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
                  <ShieldCheck size={16} />
                  <span>3. RC 1.000.000 € y Solvencia</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Certificado de vigencia de póliza de Responsabilidad Civil de 1.000.000 € y exclusividad Art. 168 LCSP.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleCopy('rc')}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedDoc === 'rc' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedDoc === 'rc' ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload('rc')}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#06b6d4] hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <Download size={13} />
                  <span>Descargar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ACCIONES FINALES Y CANALES DIRECTOS DE SECRETARÍA */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="text-xs text-zinc-400 font-mono flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>
              Municipio activo: <strong className="text-white">{municipio}</strong> · DIR3: <strong className="text-[#06b6d4]">{dir3}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${CENTRALITA_EAR_OS.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-mono font-bold transition-all border border-white/10"
            >
              <PhoneCall size={14} className="text-cyan-400" />
              <span>Gabinete Técnico: {CENTRALITA_EAR_OS}</span>
            </a>

            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Sparkles size={14} />
              <span>Bloquear Fecha para {municipio}</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}

