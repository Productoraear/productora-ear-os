'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FileBadge,
  X,
  Building2,
  User,
  Download,
  Loader2,
  CheckCircle2,
  Landmark,
  ShieldCheck
} from 'lucide-react';
import {
  calculateMecenazgo,
  generateModelo182Draft,
  ContribuyenteType
} from '@/lib/vimume-mecenazgo-engine';

interface VimumeFiscalCertificateModalProps {
  triggerLabel?: string;
  initialAmount?: number;
  donorType?: ContribuyenteType;
  centerName?: string;
  className?: string;
}

/**
 * 🏛️ VIMUME FISCAL CERTIFICATE MODAL
 * Genera certificados oficiales de deducción fiscal del 80% (Ley 49/2002 /
 * Modelo 182 AEAT) consumiendo vimume-mecenazgo-engine.ts.
 */
export default function VimumeFiscalCertificateModal({
  triggerLabel = 'Generar Certificado Fiscal',
  initialAmount = 150,
  donorType: initialDonorType = 'persona_fisica',
  centerName = 'Asociación Cultural & Proyecto Sociosanitario VIMUME',
  className = ''
}: VimumeFiscalCertificateModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(initialAmount);
  const [donorType, setDonorType] = useState<ContribuyenteType>(initialDonorType);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [donorName, setDonorName] = useState('');
  const [donorTaxId, setDonorTaxId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const draft = useMemo(() => {
    return generateModelo182Draft({
      amount,
      donorType,
      isRecurringThreeYears: isRecurring,
      donorName,
      donorTaxId
    });
  }, [amount, donorType, isRecurring, donorName, donorTaxId]);

  const breakdown = useMemo(() => {
    return calculateMecenazgo({
      amount,
      donorType,
      isRecurringThreeYears: isRecurring
    });
  }, [amount, donorType, isRecurring]);

  const handleGenerate = () => {
    setGenerating(true);
    // Simula el sellado criptográfico local (sin red).
    window.setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 500);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
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
            <strong>ID Certificado:</strong> ${draft.certificadoId}<br/>
            <strong>Ejercicio:</strong> ${draft.ejercicioFiscal}<br/>
            <strong>Fecha:</strong> ${new Date(draft.fechaEmision).toLocaleDateString('es-ES')}
          </div>
          <div class="section">
            <strong>ENTIDAD BENEFICIARIA:</strong><br/>
            ${draft.entidadBeneficiaria.razonSocial}<br/>
            NIF: ${draft.entidadBeneficiaria.nif} | Reg: ${draft.entidadBeneficiaria.registroEntidades}
          </div>
          <div class="section">
            <strong>DONANTE:</strong><br/>
            ${draft.donante.nombreOrazonSocial} (NIF: ${draft.donante.nifCif})<br/>
            Tipo: ${draft.donante.tipo}
          </div>
          <div class="section">
            <strong>DETALLE ECONÓMICO:</strong><br/>
            Aportación Donada: ${draft.detalleAportacion.donacionBruta.toFixed(2)} €<br/>
            Deducción Cuota: ${draft.detalleAportacion.deduccionTotal.toFixed(2)} €<br/>
            <div class="total">Coste Real Neto Donante: ${draft.detalleAportacion.costeRealNeto.toFixed(2)} €</div>
            Impacto Social SROI Generado: ${draft.detalleAportacion.sroiGenerado.toFixed(2)} €
          </div>
          <div class="section" style="font-size: 10px;">
            <strong>FIRMA DIGITAL SHA-256:</strong><br/>
            ${draft.firmaCriptograficaSha256}
          </div>
          <p style="font-size: 10px; color: #666;">${draft.avisoLegalAeat}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors ${className}`}
      >
        <FileBadge className="w-4 h-4" />
        {triggerLabel}
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0b0b10] border border-[#ecb613]/30 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto text-white shadow-[0_0_80px_rgba(236,182,19,0.2)]"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30">
                    <Landmark className="w-6 h-6 text-[#ecb613]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613] font-bold">
                      Ley 49/2002 · Modelo 182 AEAT
                    </p>
                    <h3 className="text-xl font-black font-syne tracking-tight">
                      Certificado de Deducción Fiscal
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setGenerated(false);
                  }}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Selector tipo */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDonorType('persona_fisica')}
                  className={`flex items-center gap-2 p-4 rounded-2xl border text-left transition-all ${
                    donorType === 'persona_fisica'
                      ? 'bg-[#ecb613]/10 border-[#ecb613]'
                      : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/30'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <div>
                    <span className="block text-xs font-mono font-bold">Particular</span>
                    <span className="block text-[10px] text-zinc-500">IRPF · 80% primeros 250€</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setDonorType('persona_juridica')}
                  className={`flex items-center gap-2 p-4 rounded-2xl border text-left transition-all ${
                    donorType === 'persona_juridica'
                      ? 'bg-[#ecb613]/10 border-[#ecb613]'
                      : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/30'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <div>
                    <span className="block text-xs font-mono font-bold">Empresa</span>
                    <span className="block text-[10px] text-zinc-500">Impuesto Sociedades · 40%</span>
                  </div>
                </button>
              </div>

              {/* Importes y datos */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="vimume-cert-amount" className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">
                    Importe de Aportación (€)
                  </label>
                  <input
                    id="vimume-cert-amount"
                    type="number"
                    min={5}
                    step={5}
                    value={amount}
                    onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full bg-black/60 border border-[#ecb613]/30 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#ecb613]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nombre o Razón Social"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ecb613]"
                  />
                  <input
                    type="text"
                    placeholder="NIF / CIF"
                    value={donorTaxId}
                    onChange={(e) => setDonorTaxId(e.target.value.toUpperCase())}
                    className="bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ecb613]"
                  />
                </div>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded bg-black border-zinc-700 text-[#ecb613] focus:ring-[#ecb613]"
                  />
                  <span className="text-[11px] text-zinc-400 leading-relaxed">
                    Donación fidelizada plurianual (más de 3 años) ·
                    <strong className="text-white"> {donorType === 'persona_fisica' ? '45% IRPF' : '50% Sociedades'}</strong>
                  </span>
                </label>
              </div>

              {/* Resumen */}
              <div className="rounded-2xl bg-black/50 border border-[#ecb613]/20 p-4 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Deducción total</span>
                  <strong className="text-emerald-400">{breakdown.deduccionTotal.toFixed(2)} €</strong>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Coste real neto</span>
                  <strong className="text-white">{breakdown.costeRealNeto.toFixed(2)} €</strong>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Impacto SROI (4.85x)</span>
                  <strong className="text-[#ecb613]">{breakdown.sroiGenerado.toFixed(2)} €</strong>
                </div>
              </div>

              {/* Firma */}
              {generated && (
                <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/25 p-4 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    Certificado sellado · Ref {draft.certificadoId}
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500 break-all">
                    SHA-256: {draft.firmaCriptograficaSha256}
                  </p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setGenerated(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-zinc-300 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generating || amount < 5}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black text-xs font-mono font-bold transition-colors disabled:opacity-50"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  Generar Certificado
                </button>
                {generated && (
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Exportar PDF
                  </button>
                )}
              </div>

              <p className="text-[10px] text-zinc-500 font-mono text-center">
                Centro receptor: {centerName}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}