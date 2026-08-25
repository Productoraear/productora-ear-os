'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  PenTool, 
  FileCheck2, 
  Download, 
  X, 
  RotateCcw, 
  Sparkles, 
  Lock, 
  CheckCircle2,
  Building2,
  User,
  CreditCard,
  Loader2
} from 'lucide-react';
import { signContractAction, SignContractResult } from '@/app/actions/contractSignActions';

interface DigitalSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteHash: string;
  serviceName: string;
  totalAmount: number;
  eventDate: string;
  location?: string;
  isB2G?: boolean;
  initialName?: string;
  initialEmail?: string;
  onSignedSuccess?: (result: SignContractResult) => void;
}

export function DigitalSignatureModal({
  isOpen,
  onClose,
  quoteHash,
  serviceName,
  totalAmount,
  eventDate,
  location = 'Madrid',
  isB2G = false,
  initialName = '',
  initialEmail = '',
  onSignedSuccess
}: DigitalSignatureModalProps) {
  const [name, setName] = useState(initialName);
  const [nifCif, setNifCif] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [entityName, setEntityName] = useState(isB2G ? `Ayuntamiento de ${location}` : '');
  const [roleOrTitle, setRoleOrTitle] = useState(isB2G ? 'Órgano de Contratación / Alcaldía' : 'Contratante');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signedResult, setSignedResult] = useState<SignContractResult | null>(null);

  // Canvas para firma manuscrita
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSignedResult(null);
      setTimeout(() => clearCanvas(), 100);
    }
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#ecb613';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSubmitSignature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nifCif || !email || !acceptedTerms) {
      alert('Por favor, completa todos los campos requeridos y acepta el marco legal.');
      return;
    }

    setIsSigning(true);
    try {
      const canvas = canvasRef.current;
      const signatureImageBase64 = canvas ? canvas.toDataURL('image/png') : undefined;

      const result = await signContractAction({
        name,
        nifCif,
        email,
        entityName,
        roleOrTitle,
        quoteHash,
        totalAmount,
        serviceName,
        eventDate,
        isB2G,
        signatureImageBase64
      });

      if (result.success) {
        setSignedResult(result);
        if (onSignedSuccess) {
          onSignedSuccess(result);
        }
      } else {
        alert(result.error || 'Hubo un error formalizando la firma.');
      }
    } catch (err: any) {
      alert('Error inesperado: ' + err.message);
    } finally {
      setIsSigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-[#0c0c0c] border border-[#ecb613]/50 w-full max-w-2xl max-h-[92vh] rounded-3xl overflow-y-auto p-6 sm:p-8 relative shadow-2xl space-y-6 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-neutral-900 hover:bg-[#ecb613] text-neutral-400 hover:text-black w-9 h-9 rounded-full font-bold flex items-center justify-center transition-all border border-white/10"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-widest">
            <ShieldCheck size={14} /> Sello de Confianza eIDAS & Art. 118 LCSP
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
            {signedResult ? 'Contrato Formalizado con Éxito' : 'Firma Electrónica Avanzada'}
          </h2>
          <p className="text-xs text-neutral-400 font-mono">
            Expediente: <strong className="text-white">{serviceName}</strong> · Importe: <strong className="text-[#ecb613]">{totalAmount.toFixed(2)} €</strong>
          </p>
        </div>

        {signedResult && signedResult.signature ? (
          /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              ESTADO 1: FIRMA COMPLETADA EXITOSAMENTE
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
          <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-5">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 size={28} />
              <div>
                <h3 className="text-base font-bold uppercase tracking-wide">Firma Estampada y Sellada en el Registro</h3>
                <span className="text-xs font-mono text-emerald-300/80">ID de Firma: {signedResult.signature.signatureId}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/20 font-mono text-xs space-y-2 text-neutral-300">
              <div className="flex justify-between">
                <span className="text-neutral-500">Firmante:</span>
                <span className="font-bold text-white">{signedResult.signature.signer.name} ({signedResult.signature.signer.nifCif})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Sello Criptográfico:</span>
                <span className="text-[#ecb613] font-bold truncate max-w-[240px]">{signedResult.signature.verificationHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Certificado:</span>
                <span className="text-emerald-400">{signedResult.signature.certificateSeal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Fecha y Hora UTC:</span>
                <span className="text-white">{new Date(signedResult.signature.signedAt).toLocaleString('es-ES')}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={signedResult.signedPdfUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-amber-300 via-[#ecb613] to-amber-500 hover:brightness-110 text-black font-black text-xs py-3.5 px-6 rounded-2xl uppercase transition-all flex items-center justify-center gap-2 font-mono shadow-lg shadow-[#ecb613]/20"
              >
                <Download size={16} />
                <span>Descargar Contrato Sellado (PDF)</span>
              </a>
              <button
                onClick={onClose}
                className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs font-mono rounded-2xl text-white uppercase"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              ESTADO 2: FORMULARIO DE FIRMA DIGITAL
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
          <form onSubmit={handleSubmitSignature} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-400 uppercase">Nombre Completo del Firmante *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez García"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#ecb613] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-400 uppercase">NIF / CIF / NIE *</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. 12345678Z o B87910311"
                    value={nifCif}
                    onChange={(e) => setNifCif(e.target.value.toUpperCase())}
                    className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#ecb613] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-400 uppercase">Email de Notificación y Envío *</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@entidad.es"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#ecb613] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-400 uppercase">Entidad / Ayuntamiento / Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Ej. Ayuntamiento de Toledo"
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#ecb613] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* CANVAS DE FIRMA MANUSCRITA */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-neutral-300 flex items-center gap-1.5">
                  <PenTool size={14} className="text-[#ecb613]" /> Trazo de Firma Manuscrita Digital (Ratón o Táctil):
                </span>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-neutral-500 hover:text-white flex items-center gap-1 text-[10px] uppercase"
                >
                  <RotateCcw size={12} /> Borrar Trazo
                </button>
              </div>

              <div className="relative w-full h-36 bg-black border border-dashed border-white/20 rounded-2xl overflow-hidden cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={144}
                  className="w-full h-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-neutral-600 text-xs font-mono uppercase">
                    Dibuja tu rúbrica aquí
                  </div>
                )}
              </div>
            </div>

            {/* ACEPTACIÓN LEGAL EIDAS */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 accent-[#ecb613] h-4 w-4 rounded cursor-pointer"
                />
                <span className="text-[11px] text-neutral-300 leading-relaxed font-light">
                  Acepto la formalización y emisión del contrato bajo el estándar de Firma Electrónica Avanzada conforme al <strong>Reglamento (UE) Nº 910/2014 (eIDAS)</strong> y el <strong>Art. 118 de la Ley 9/2017 LCSP</strong>. Entiendo que este sello criptográfico vincula la reserva del servicio con SLA Cero Fallos y seguro de RC de 1M€.
                </span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSigning || !acceptedTerms}
              className="w-full bg-gradient-to-r from-amber-300 via-[#ecb613] to-amber-500 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black text-xs py-4 rounded-2xl uppercase transition-all flex items-center justify-center gap-2 font-mono shadow-lg shadow-[#ecb613]/20 cursor-pointer"
            >
              {isSigning ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Sellando Criptográficamente...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Formalizar y Firmar Contrato Digital</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default DigitalSignatureModal;
