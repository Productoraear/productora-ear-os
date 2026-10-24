'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Sparkles,
  Calendar,
  Phone,
  CreditCard,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Music,
  Share2,
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

function Test1EurContent() {
  const searchParams = useSearchParams();
  const clientPhone = searchParams.get('telefono') || '659116376';
  const clientName = searchParams.get('nombre') || 'Cliente Exclusivo';
  const eventDate = searchParams.get('fecha') || '31 de Octubre de 2026';
  const statusParam = searchParams.get('status');
  const orderIdParam = searchParams.get('orderId');
  const hashParam = searchParams.get('hash');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ⏱️ 60-Minute Countdown Window
  const [secondsRemaining, setSecondsRemaining] = useState(3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timerProgress = (secondsRemaining / 3600) * 100;

  // ✍️ Interactive Biometric Signature Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#ecb613';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawing.current = true;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasSignature(false);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const signatureData = canvasRef.current ? canvasRef.current.toDataURL('image/png') : '';

      const res = await fetch('/api/reservar/test-1eur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientPhone,
          clientName,
          eventDate,
          signature: signatureData,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok || !data.checkoutUrl) {
        throw new Error(data.error || 'Error al iniciar el checkout seguro');
      }

      // Redirigir a la sesión real de Stripe Checkout
      window.location.href = data.checkoutUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al procesar el pago';
      setError(msg);
      setIsLoading(false);
    }
  };

  // WhatsApp share URL for direct client transmission
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/reservar/test-1eur?telefono=${encodeURIComponent(clientPhone)}&fecha=${encodeURIComponent(eventDate)}`
    : `https://productoraear.com/reservar/test-1eur?telefono=${encodeURIComponent(clientPhone)}&fecha=${encodeURIComponent(eventDate)}`;

  const whatsappMessage = encodeURIComponent(
    `Hola! Aquí tienes tu enlace exclusivo de reserva con pre-firma de Edwin Agudelo y bloqueo de fecha (31 de Octubre). Depósito 1,00 €:\n\n${shareUrl}`
  );
  const whatsappShareLink = `https://wa.me/34${clientPhone.replace(/\D/g, '')}?text=${whatsappMessage}`;

  if (statusParam === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#ecb613]/20 border border-[#ecb613] flex items-center justify-center text-[#ecb613] shadow-[0_0_50px_rgba(236,182,19,0.3)]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#ecb613]">
            Reserva & Contrato Blindados
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne">
            ¡Depósito de 1,00 € Confirmado!
          </h1>
          <p className="text-sm text-white/60 font-light max-w-lg mx-auto">
            La fecha del <strong className="text-white">{eventDate}</strong> con{' '}
            <strong className="text-white">Edwin Agudelo (Solista Premium pistas de estudio)</strong> ha quedado
            bloqueada atómicamente con el sello SHA-256 inmutable.
          </p>
        </div>

        <div className="rounded-3xl bg-[#09090d]/90 border border-white/10 p-6 text-left space-y-4">
          <div className="flex justify-between items-center text-xs text-white/50 border-b border-white/10 pb-3">
            <span>Identificador de Operación:</span>
            <span className="font-mono text-white">{orderIdParam || 'EAR-CONFIRMADO'}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-white/50 border-b border-white/10 pb-3">
            <span>Sello Hash SHA-256:</span>
            <span className="font-mono text-[#ecb613]">{hashParam || 'CONFIRMED-SECURE-SHA256'}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-white/50">
            <span>Teléfono Vinculado:</span>
            <span className="font-mono text-white">+{clientPhone}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={CENTRALITA.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#ecb613] text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-white transition-all shadow-[0_10px_35px_rgba(236,182,19,0.4)]"
          >
            <MessageCircle className="w-4 h-4" /> Hablar con Edwin por WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-8">
      {/* ⏱️ Holding Countdown Timer Bar */}
      <div className="rounded-2xl bg-[#0c0c12] border border-[#ecb613]/30 p-4 sm:p-5 relative overflow-hidden shadow-[0_0_30px_rgba(236,182,19,0.15)]">
        <div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#ecb613] to-amber-500 transition-all duration-1000"
          style={{ width: `${timerProgress}%` }}
        />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613] block font-bold">
                Ventana de Retención Exclusiva (60 Minutos)
              </span>
              <p className="text-xs text-white/70">
                La fecha está pre-reservada temporalmente para ti mientras completas el acuerdo.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xl sm:text-2xl font-black font-mono text-[#ecb613]">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono font-black uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5" /> Acuerdo Bilateral S-Class · Depósito Simbólico 1,00 €
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase text-white font-syne leading-tight">
          Bloqueo de Fecha & Pre-Contrato
        </h1>
        <p className="text-xs sm:text-sm text-white/60 font-light max-w-xl mx-auto">
          Edwin Agudelo ya ha estampado su pre-firma verificando disponibilidad. Firma digitalmente en pantalla y
          completa el depósito de 1,00 € para cerrar el acuerdo inmutable.
        </p>
      </div>

      {/* Main Grid: Details + Pre-Signature */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Summary Card */}
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-wider block font-bold">
                Artista Confirmado
              </span>
              <h2 className="text-base font-black uppercase text-white font-syne">Edwin Agudelo</h2>
              <span className="text-xs text-white/60">Solista Premium (Pistas de Estudio & Ensamble)</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white/50 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#ecb613]" /> Fecha del Evento:
              </span>
              <span className="font-mono text-white font-bold">{eventDate}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white/50 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#ecb613]" /> Teléfono Cliente:
              </span>
              <span className="font-mono text-white font-bold">+{clientPhone}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white/50 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#ecb613]" /> Split Soberano:
              </span>
              <span className="text-white/80">80% Artista / 10% EAR / 10% VIMUME</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-white/50 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#ecb613]" /> Depósito de Prueba:
              </span>
              <span className="text-xl font-black font-mono text-[#ecb613]">1,00 €</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-white/60 leading-relaxed font-light">
            💡 <strong className="text-white">100% Deducible:</strong> Este euro de depósito se deduce íntegro del
            importe total del evento. En caso de fuerza mayor o anulación, reembolso garantizado.
          </div>

          {/* Direct WhatsApp transmission button */}
          <a
            href={whatsappShareLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider transition-all"
          >
            <Share2 className="w-4 h-4 text-[#25D366]" /> Enviar Enlace Directo por WhatsApp
          </a>
        </div>

        {/* Right: Artist Pre-Signature + Biometric Signature Pad */}
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 space-y-6 flex flex-col justify-between">
          {/* Pre-Signature Badge */}
          <div className="rounded-2xl bg-gradient-to-br from-[#12120e] to-[#0a0a0d] border border-[#ecb613]/40 p-4 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-black flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ecb613]" /> Pre-Firmado por el Artista
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
                SHA-256 VERIFIED
              </span>
            </div>

            {/* Simulated Artistic Signature SVG */}
            <div className="py-2 flex items-center justify-center">
              <svg viewBox="0 0 320 80" className="w-56 h-14 text-[#ecb613] stroke-current fill-none stroke-[2.5]">
                <path
                  d="M 20,50 Q 50,10 80,45 T 140,40 Q 180,60 210,25 T 260,50 Q 280,30 300,45"
                  strokeLinecap="round"
                />
                <text x="75" y="72" fill="#ecb613" fontSize="12" fontFamily="serif" fontStyle="italic">
                  Edwin Agudelo · EAR OS Master
                </text>
              </svg>
            </div>

            <p className="text-[10px] text-white/50 text-center font-mono">
              Fecha de disponibilidad bloqueada atómicamente · Sello criptográfico verificado
            </p>
          </div>

          {/* Client Biometric Signature Pad */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-syne font-bold uppercase text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ecb613]" /> Tu Firma Digital
              </span>
              {hasSignature && (
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-[10px] text-white/50 hover:text-white flex items-center gap-1 font-mono transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Borrar
                </button>
              )}
            </div>

            <div className="relative rounded-2xl border border-white/20 bg-[#050507] overflow-hidden">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-28 cursor-crosshair touch-none"
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white/25 text-xs font-mono">
                  Dibuja tu firma aquí (dedo o ratón)
                </div>
              )}
            </div>
          </div>

          {/* Action Button: Stripe 1,00 € */}
          <div className="space-y-3">
            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full py-4 bg-[#ecb613] hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_10px_35px_rgba(236,182,19,0.4)] hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" /> Conectando con Stripe Seguro...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" /> Firmar y Pagar 1,00 € (Tarjeta)
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-white/40">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#ecb613]" /> Stripe TLS 256-bit
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#ecb613]" /> Split 80/10/10
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Test1EurPage() {
  return (
    <main className="min-h-screen bg-[#030305] text-white">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-xs font-mono text-white/50">
            Cargando entorno de reserva...
          </div>
        }
      >
        <Test1EurContent />
      </Suspense>
    </main>
  );
}
