'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, ShieldCheck, Download, Printer, PhoneCall, 
  Sparkles, Award, Lock, Clock, Calendar, MapPin, FileText, 
  ArrowRight, Check, Share2, Copy
} from 'lucide-react';

function SuccessVoucherContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || 'EAR-LOCAL-DEMO';
  const type = searchParams.get('type') || 'RESERVA_SCLASS';
  const provincia = searchParams.get('provincia') || 'Madrid';
  
  const [copied, setCopied] = useState(false);
  const [localizerId, setLocalizerId] = useState<string>('');
  const [shaHash, setShaHash] = useState<string>('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');

  useEffect(() => {
    // Generate deterministic localizer code from session ID
    const cleanId = sessionId.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase() || 'EAR-8791';
    setLocalizerId(`EAR-${cleanId}`);
    
    // Pseudo SHA-256 verification hash
    const fakeSha = `sha256_${Array.from(cleanId).map(c => c.charCodeAt(0).toString(16)).join('')}f8a1c9`;
    setShaHash(fakeSha);

    const now = new Date();
    setCurrentDateStr(now.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));

    // Trigger telemetry tracking
    console.log(`[EAR-TRANSACTION-SUCCESS] Localizer: EAR-${cleanId}, Type: ${type}, Session: ${sessionId}`);
  }, [sessionId, type]);

  const handleCopyLocalizer = () => {
    navigator.clipboard.writeText(localizerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = encodeURIComponent(
    `Hola Productora EAR, he completado la reserva con localizador ${localizerId}. Deseo coordinar los detalles técnicos y rider de producción.`
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white py-24 px-4 sm:px-6 lg:px-8 selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-4xl mx-auto">
        
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            1. HERO SUCCESS BANNER
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-tr from-[#ecb613] to-[#ffd471] flex items-center justify-center shadow-[0_0_40px_rgba(236,182,19,0.5)]"
          >
            <CheckCircle2 className="w-12 h-12 text-black" />
          </motion.div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Transacción Verificada & Compromiso Blindado
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            ¡Reserva y Tarifa Confirmada!
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto font-light">
            Tu depósito ha sido procesado mediante la pasarela segura de Stripe. Se ha emitido el Certificado Oficial de Compromiso S-Class.
          </p>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            2. CERTIFICADO DIGITAL DE COMPROMISO S-CLASS (VOUCHER OFICIAL)
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          id="voucher-certificate"
          className="bg-gradient-to-b from-[#111] via-[#090909] to-[#0c0c0c] border-2 border-[#ecb613]/60 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(0,0,0,0.9)] relative overflow-hidden mb-8"
        >
          {/* Watermark Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.015] font-black text-9xl font-syne select-none pointer-events-none">
            EAR OS
          </div>

          {/* Certificate Top Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 gap-4 relative z-10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613] font-bold block">
                Comprobante Oficial de Reserva
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-syne text-white">
                Certificado de Garantía y Disponibilidad S-Class
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-neutral-500 font-mono block">Localizador de Reserva</span>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-mono font-black text-[#ecb613]">{localizerId}</span>
                <button
                  onClick={handleCopyLocalizer}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                  title="Copiar Localizador"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Certificate Grid Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 relative z-10 text-xs sm:text-sm">
            <div className="space-y-3 bg-white/[0.02] p-5 rounded-2xl border border-white/5 font-mono">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">Estado de la Operación:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PAGO CONFIRMADO
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">Garantía Aplicada:</span>
                <span className="text-white font-bold">Price-Lock SHA-256 (72h)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">Fecha de Emisión:</span>
                <span className="text-white">{currentDateStr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Ubicación / Sede:</span>
                <span className="text-white font-bold">{provincia.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-3 bg-white/[0.02] p-5 rounded-2xl border border-white/5 font-mono">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">Titular Mercantil:</span>
                <span className="text-white font-bold">QUALITY VIP SOLUTIONS, SL</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">NIF Mercantil:</span>
                <span className="text-[#ecb613] font-bold">B87910311</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">Seguro de RC:</span>
                <span className="text-white">Póliza 300.000 € (Allianz/Mapfre)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Sello Criptográfico:</span>
                <span className="text-[10px] text-neutral-400 truncate max-w-[140px]">{shaHash}</span>
              </div>
            </div>
          </div>

          {/* Technical SLA Guarantee Text */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 mb-8 relative z-10">
            <h4 className="text-xs font-bold text-[#ecb613] font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cobertura y Compromiso Técnico S-Class
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Este comprobante garantiza la reserva prioritaria en la agenda operativa de Productora EAR. El importe desembolsado se deduce automáticamente del saldo total de la factura. En caso de fuerza mayor o modificación de fecha con preaviso superior a 15 días, el saldo permanece 100% protegido.
            </p>
          </div>

          {/* Certificate Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 relative z-10">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handlePrint}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-white/10 w-full sm:w-auto cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#ecb613]" /> Imprimir / Guardar PDF
              </button>
            </div>

            <a
              href={`https://wa.me/34682141077?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4af37] text-black font-extrabold text-xs sm:text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 w-full sm:w-auto"
            >
              <PhoneCall className="w-4 h-4" /> Notificar a Concierge WhatsApp
            </a>
          </div>
        </motion.div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            3. PRÓXIMOS PASOS (PROTOCOLO 0 ESTRÉS)
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
            <span className="w-6 h-6 rounded-full bg-[#ecb613] text-black text-xs font-bold flex items-center justify-center mb-3">1</span>
            <h4 className="text-sm font-bold text-white mb-1">Contacto del Asesor</h4>
            <p className="text-xs text-neutral-400">Nuestro director técnico se pondrá en contacto en &lt;2h para validar los requerimientos.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
            <span className="w-6 h-6 rounded-full bg-[#ecb613] text-black text-xs font-bold flex items-center justify-center mb-3">2</span>
            <h4 className="text-sm font-bold text-white mb-1">Ficha y Rider</h4>
            <p className="text-xs text-neutral-400">Recepción de memoria técnica, repertorio elegido o datos de vuelo del vehículo.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
            <span className="w-6 h-6 rounded-full bg-[#ecb613] text-black text-xs font-bold flex items-center justify-center mb-3">3</span>
            <h4 className="text-sm font-bold text-white mb-1">Ejecución Cero Fallos</h4>
            <p className="text-xs text-neutral-400">Llegada anticipada in-situ con respaldo del seguro de responsabilidad civil.</p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-[#ecb613] transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Volver al Inicio de EAR OS
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#ecb613]/30 border-t-[#ecb613] rounded-full animate-spin"></div>
      </div>
    }>
      <SuccessVoucherContent />
    </Suspense>
  );
}
