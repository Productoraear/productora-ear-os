'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  User, 
  HeartHandshake, 
  FileText, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Coins, 
  Sparkles,
  Info,
  Download,
  Loader2
} from 'lucide-react';
import { 
  calculateMecenazgo, 
  generateModelo182Draft, 
  ContribuyenteType, 
  Modelo182Draft,
  VIMUME_FISCAL_SSOT 
} from '@/lib/vimume-mecenazgo-engine';

interface MecenazgoFiscalCalculatorProps {
  initialAmount?: number;
  initialType?: ContribuyenteType;
  className?: string;
}

const PRESET_AMOUNTS = [
  { value: 50, label: '50 €', note: 'Sesión Terapéutica' },
  { value: 150, label: '150 €', note: 'Coste Real: 30 € ⭐' },
  { value: 250, label: '250 €', note: 'Tope 80% IRPF' },
  { value: 500, label: '500 €', note: 'Bono Trimestral' },
  { value: 1200, label: '1.200 €', note: 'Programa Anual Sala' },
  { value: 3800, label: '3.800 €', note: 'Patrocinio Silver B2B' },
  { value: 14250, label: '14.250 €', note: 'Tope Art. 118 LCSP' }
];

export function MecenazgoFiscalCalculator({
  initialAmount = 150,
  initialType = 'persona_fisica',
  className = ''
}: MecenazgoFiscalCalculatorProps) {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [donorType, setDonorType] = useState<ContribuyenteType>(initialType);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>('');
  const [donorTaxId, setDonorTaxId] = useState<string>('');
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Cálculo reactivo
  const breakdown = useMemo(() => {
    return calculateMecenazgo({
      amount,
      donorType,
      isRecurringThreeYears: isRecurring,
      donorName,
      donorTaxId
    });
  }, [amount, donorType, isRecurring, donorName, donorTaxId]);

  // Borrador Modelo 182 AEAT
  const modelo182Draft: Modelo182Draft = useMemo(() => {
    return generateModelo182Draft({
      amount,
      donorType,
      isRecurringThreeYears: isRecurring,
      donorName,
      donorTaxId
    });
  }, [amount, donorType, isRecurring, donorName, donorTaxId]);

  // Manejo de pago seguro con Stripe
  const handleProceedPayment = async () => {
    if (amount < 5) return;
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          concept: `Mecenazgo Ley 49/2002 VIMUME // ${donorType === 'persona_fisica' ? 'IRPF Particular' : 'Impuesto Sociedades'} (${amount.toFixed(2)} €)`,
          metadata: {
            type: 'DONATION_VIMUME_MECENAZGO',
            donorType,
            isRecurring: String(isRecurring),
            donorName: donorName || 'Anónimo',
            donorTaxId: donorTaxId || 'Pendiente',
            modelo182Clave: breakdown.modelo182Clave,
            sha256Seal: modelo182Draft.firmaCriptograficaSha256
          }
        })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'No se pudo generar el enlace de pago seguro.');
      }
    } catch (err: any) {
      setCheckoutError(err.message || 'Error de conexión con la pasarela de pago.');
      setIsCheckingOut(false);
    }
  };

  return (
    <div className={`relative rounded-[2.5rem] bg-[#07070a] border border-[#8b5cf6]/30 p-6 sm:p-10 shadow-[0_0_80px_rgba(139,92,246,0.12)] text-white ${className}`}>
      {/* GLOW DECORATIVO */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#ecb613]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* CABECERA */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 text-[#8b5cf6] text-[10px] font-mono tracking-widest uppercase font-bold">
            <Calculator size={13} />
            <span>INGENIERÍA FISCAL // LEY 49/2002 & MODELO 182 AEAT</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black uppercase text-white font-syne tracking-tight">
            Calculadora de Mecenazgo & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] via-[#AAD6CD] to-[#ecb613]">Deducción Fiscal</span>
          </h3>
          <p className="text-sm text-zinc-400 max-w-2xl font-light">
            Deducción del <strong>80%</strong> en los primeros 250 € para particulares y hasta el <strong>50%</strong> en el Impuesto de Sociedades para empresas. Multiplicador de impacto <strong>4,85x SROI</strong>.
          </p>
        </div>

        {/* TIPO DE CONTRIBUYENTE SWITCHER */}
        <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex items-center gap-1 w-fit">
          <button
            type="button"
            onClick={() => setDonorType('persona_fisica')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              donorType === 'persona_fisica'
                ? 'bg-[#8b5cf6] text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User size={14} />
            <span>Particular (IRPF)</span>
          </button>
          <button
            type="button"
            onClick={() => setDonorType('persona_juridica')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              donorType === 'persona_juridica'
                ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Building2 size={14} />
            <span>Empresa (IS)</span>
          </button>
        </div>
      </div>

      {/* CUERPO DE CONTROL INTERACTIVO */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        
        {/* COLUMNA IZQUIERDA: INPUTS & PRESETS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SLIDER & INPUT NUMÉRICO */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <label htmlFor="donation-amount-slider" className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold">
                Importe de Aportación o Mecenazgo
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="50000"
                  step="5"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                  className="w-28 bg-black/60 border border-[#8b5cf6]/40 rounded-xl px-3 py-1.5 text-right font-mono font-black text-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                />
                <span className="text-sm font-mono text-[#8b5cf6] font-bold">€</span>
              </div>
            </div>

            {/* SLIDER RANGE */}
            <input
              id="donation-amount-slider"
              type="range"
              min="10"
              max="5000"
              step="10"
              value={amount > 5000 ? 5000 : amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              aria-label="Importe de aportación o mecenazgo"
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#8b5cf6]"
            />

            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>10 €</span>
              <span>250 € (Tope 80%)</span>
              <span>1.000 €</span>
              <span>5.000 €+</span>
            </div>
          </div>

          {/* PRESETS DE BOTONES RÁPIDOS */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block font-semibold">
              ACCESOS DIRECTOS DE IMPACTO CALIBRADO
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setAmount(preset.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    amount === preset.value
                      ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                      : 'bg-white/[0.02] border-white/10 text-zinc-300 hover:border-white/30'
                  }`}
                >
                  <div className="font-mono font-black text-sm">{preset.label}</div>
                  <div className="text-[10px] text-zinc-400 truncate">{preset.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* OPCIÓN DONACIÓN RECURRENTE (FIDELIZACIÓN 3 AÑOS) */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/10">
            <input
              type="checkbox"
              id="recurring-check"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="mt-1 w-4 h-4 rounded bg-black border-zinc-700 text-[#8b5cf6] focus:ring-[#8b5cf6]"
            />
            <label htmlFor="recurring-check" className="text-xs text-zinc-300 leading-relaxed cursor-pointer">
              <strong className="text-white block font-mono uppercase text-[11px]">
                {donorType === 'persona_fisica' ? 'Deducción Fidelizada (+5% Extra en IRPF)' : 'Patrocinio Fidelizado (+10% Extra en Sociedades)'}
              </strong>
              He donado a VIMUME en los 2 ejercicios anteriores por importe igual o superior (aplica 45% en IRPF o 50% en Impuesto sobre Sociedades).
            </label>
          </div>

          {/* DATOS FISCALES OPCIONALES PARA CERTIFICADO */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#AAD6CD] block font-bold">
              DATOS PARA EMISIÓN DEL CERTIFICADO FISCAL (OPCIONAL)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nombre o Razón Social"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="bg-zinc-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#8b5cf6]"
              />
              <input
                type="text"
                placeholder="NIF / CIF del Donante"
                value={donorTaxId}
                onChange={(e) => setDonorTaxId(e.target.value.toUpperCase())}
                className="bg-zinc-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: DASHBOARD DE IMPACTO & RESULTADOS (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* CARD PRINCIPAL DE COSTE REAL */}
          <div className="rounded-3xl bg-gradient-to-b from-[#100d1c] to-[#0a0814] border border-[#8b5cf6]/50 p-6 space-y-5 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
            
            {/* COMPARATIVA COSTE VS DEDUCCIÓN */}
            <div className="flex justify-between items-end pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                  Aportación Bruta
                </span>
                <span className="text-2xl font-mono font-bold text-zinc-300">
                  {breakdown.donacionBruta.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#AAD6CD] block font-bold">
                  Deducción Fiscal (Hacienda)
                </span>
                <span className="text-2xl font-mono font-bold text-[#AAD6CD]">
                  - {breakdown.deduccionTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                </span>
              </div>
            </div>

            {/* COSTE REAL NETO - DESTACADO */}
            <div className="bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-2xl p-5 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold block">
                COSTE REAL PARA EL {donorType === 'persona_fisica' ? 'DONANTE' : 'PATROCINADOR'}
              </span>
              <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                {breakdown.costeRealNeto.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
              </div>
              <p className="text-[11px] text-zinc-400 pt-1">
                {donorType === 'persona_fisica' && breakdown.donacionBruta <= 250 ? (
                  <span className="text-emerald-400 font-semibold">¡Ahorras el 80% íntegro de tu aportación!</span>
                ) : (
                  <span>Ahorro efectivo ponderado: <strong className="text-white">{breakdown.porcentajeEfectivoAhorro}%</strong></span>
                )}
              </p>
            </div>

            {/* SROI METRICS */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 text-center">
                <span className="text-[9px] font-mono text-zinc-400 block uppercase">Retorno SROI (4.85x)</span>
                <span className="text-lg font-mono font-bold text-[#ecb613]">
                  {breakdown.sroiGenerado.toLocaleString('es-ES', { minimumFractionDigits: 0 })} €
                </span>
              </div>
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 text-center">
                <span className="text-[9px] font-mono text-zinc-400 block uppercase">Código AEAT</span>
                <span className="text-xs font-mono font-bold text-zinc-200 block truncate">
                  {breakdown.modelo182Clave}
                </span>
              </div>
            </div>

            {/* BOTÓN PREVIEW CERTIFICADO MODELO 182 */}
            <button
              type="button"
              onClick={() => setShowCertificateModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-zinc-300 flex items-center justify-center gap-2 transition-colors"
            >
              <FileText size={14} className="text-[#8b5cf6]" />
              <span>Ver Borrador Certificado Modelo 182 AEAT</span>
            </button>

            {/* BOTÓN STRIPE CHECKOUT */}
            <button
              type="button"
              disabled={isCheckingOut || amount < 5}
              onClick={handleProceedPayment}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#8b5cf6] via-purple-600 to-[#ecb613] text-white font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Conectando con Pasarela Segura...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Aportar {breakdown.donacionBruta.toFixed(2)} € (Coste Real: {breakdown.costeRealNeto.toFixed(2)} €)</span>
                </>
              )}
            </button>

            {checkoutError && (
              <p className="text-xs text-rose-400 text-center">{checkoutError}</p>
            )}

            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500">
              <Lock size={11} />
              <span>Transacción con firma SHA-256 • Pasarela Stripe SSL 256-bit</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL / DRAWER DEL CERTIFICADO MODELO 182 AEAT */}
      <AnimatePresence>
        {showCertificateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#0b0b10] border border-[#8b5cf6]/40 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-white shadow-[0_0_80px_rgba(139,92,246,0.3)]"
            >
              {/* Header Modal */}
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#8b5cf6] block uppercase tracking-widest font-bold">
                    DOCUMENTO OFICIAL PRELIMINAR
                  </span>
                  <h4 className="text-xl font-bold font-syne text-white">
                    Certificado de Donación Fiscal (Modelo 182 AEAT)
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Contenido del Certificado */}
              <div className="space-y-4 font-mono text-xs bg-black/60 p-5 rounded-2xl border border-white/5 leading-relaxed">
                <div className="grid grid-cols-2 gap-2 text-zinc-400 border-b border-white/10 pb-3">
                  <div>Ref: <strong className="text-white">{modelo182Draft.certificadoId}</strong></div>
                  <div className="text-right">Ejercicio: <strong className="text-white">{modelo182Draft.ejercicioFiscal}</strong></div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-[#AAD6CD] uppercase font-bold">Entidad Beneficiaria:</div>
                  <div className="text-white font-bold">{modelo182Draft.entidadBeneficiaria.razonSocial}</div>
                  <div className="text-zinc-400">CIF: {modelo182Draft.entidadBeneficiaria.nif} • Reg: {modelo182Draft.entidadBeneficiaria.registroEntidades}</div>
                  <div className="text-zinc-500 text-[10px]">{modelo182Draft.entidadBeneficiaria.marcoLegal}</div>
                </div>

                <div className="space-y-1 border-t border-white/10 pt-3">
                  <div className="text-[10px] text-[#AAD6CD] uppercase font-bold">Donante / Aportante:</div>
                  <div className="text-white font-bold">{modelo182Draft.donante.nombreOrazonSocial}</div>
                  <div className="text-zinc-400">NIF/CIF: {modelo182Draft.donante.nifCif}</div>
                  <div className="text-zinc-500 text-[10px]">
                    Naturaleza: {modelo182Draft.donante.tipo === 'persona_fisica' ? 'Persona Física (IRPF)' : 'Persona Jurídica (Impuesto Sociedades)'} 
                    {modelo182Draft.donante.esPlurianual && ' • Donación Recurrente Plurianual'}
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-white/10 pt-3">
                  <div className="text-[10px] text-[#ecb613] uppercase font-bold">Desglose de Deducción Ley 49/2002:</div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Importe íntegro donado:</span>
                    <strong className="text-white">{modelo182Draft.detalleAportacion.donacionBruta.toFixed(2)} €</strong>
                  </div>
                  {modelo182Draft.detalleAportacion.tramoOchentaPorCiento > 0 && (
                    <div className="flex justify-between text-zinc-400">
                      <span>Tramo 80% (hasta 250 €):</span>
                      <span className="text-emerald-400">+{modelo182Draft.detalleAportacion.deduccionPrimerTramo.toFixed(2)} €</span>
                    </div>
                  )}
                  {modelo182Draft.detalleAportacion.tramoGeneral > 0 && (
                    <div className="flex justify-between text-zinc-400">
                      <span>Tramo excedente ({modelo182Draft.detalleAportacion.porcentajeSegundoTramo}%):</span>
                      <span className="text-emerald-400">+{modelo182Draft.detalleAportacion.deduccionSegundoTramo.toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold pt-2 border-t border-white/5">
                    <span>Deducción Total en Cuota:</span>
                    <span className="text-[#AAD6CD]">{modelo182Draft.detalleAportacion.deduccionTotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Coste Real Neto para Donante:</span>
                    <strong className="text-white">{modelo182Draft.detalleAportacion.costeRealNeto.toFixed(2)} €</strong>
                  </div>
                </div>

                <div className="space-y-1 border-t border-white/10 pt-3">
                  <div className="text-[10px] text-purple-400 uppercase font-bold">Sello Criptográfico Inmutable:</div>
                  <div className="text-[9px] text-zinc-500 break-all bg-black/80 p-2 rounded border border-white/5">
                    SHA-256: {modelo182Draft.firmaCriptograficaSha256}
                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 italic pt-2">
                  {modelo182Draft.avisoLegalAeat}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white transition-colors"
                >
                  Cerrar Vista Previa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Certificado Modelo 182 AEAT - VIMUME</title>
                            <style>
                              body { font-family: 'Courier New', monospace; padding: 40px; color: #111; line-height: 1.6; }
                              h1 { font-size: 20px; border-bottom: 2px solid #000; padding-bottom: 8px; }
                              .meta { margin: 20px 0; font-size: 12px; }
                              .section { margin: 15px 0; border: 1px solid #ccc; padding: 15px; border-radius: 6px; }
                              .total { font-size: 16px; font-weight: bold; margin-top: 10px; }
                            </style>
                          </head>
                          <body>
                            <h1>CERTIFICADO FISCAL LEY 49/2002 // MODELO 182 AEAT</h1>
                            <div class="meta">
                              <strong>ID Certificado:</strong> ${modelo182Draft.certificadoId}<br/>
                              <strong>Ejercicio:</strong> ${modelo182Draft.ejercicioFiscal}<br/>
                              <strong>Fecha:</strong> ${new Date(modelo182Draft.fechaEmision).toLocaleDateString('es-ES')}
                            </div>
                            <div class="section">
                              <strong>ENTIDAD BENEFICIARIA:</strong><br/>
                              ${modelo182Draft.entidadBeneficiaria.razonSocial}<br/>
                              NIF: ${modelo182Draft.entidadBeneficiaria.nif} | Reg: ${modelo182Draft.entidadBeneficiaria.registroEntidades}
                            </div>
                            <div class="section">
                              <strong>DONANTE:</strong><br/>
                              ${modelo182Draft.donante.nombreOrazonSocial} (NIF: ${modelo182Draft.donante.nifCif})<br/>
                              Tipo: ${modelo182Draft.donante.tipo}
                            </div>
                            <div class="section">
                              <strong>DETALLE ECONÓMICO:</strong><br/>
                              Aportación Donada: ${modelo182Draft.detalleAportacion.donacionBruta.toFixed(2)} €<br/>
                              Deducción Cuota: ${modelo182Draft.detalleAportacion.deduccionTotal.toFixed(2)} €<br/>
                              <div class="total">Coste Real Neto Donante: ${modelo182Draft.detalleAportacion.costeRealNeto.toFixed(2)} €</div>
                              Impacto Social SROI Generado: ${modelo182Draft.detalleAportacion.sroiGenerado.toFixed(2)} €
                            </div>
                            <div class="section" style="font-size: 10px;">
                              <strong>FIRMA DIGITAL SHA-256:</strong><br/>
                              ${modelo182Draft.firmaCriptograficaSha256}
                            </div>
                            <p style="font-size: 10px; color: #666;">${modelo182Draft.avisoLegalAeat}</p>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.focus();
                      printWindow.print();
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-xs font-mono font-bold text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <Download size={14} />
                  <span>Imprimir / Exportar PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
