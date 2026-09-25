'use client';

/**
 * ✍️ EAR OS V2 — LIENZO DE FIRMA DIGITAL S-CLASS
 * ------------------------------------------------------------------
 * Captura de firma manuscrita sobre canvas HTML5 optimizado para móviles y punteros.
 * Cero dependencias pesadas externas. Almacena trazo en PNG de alta resolución.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { PenTool, RotateCcw, Check, X, ShieldCheck } from 'lucide-react';

interface ProposalSignatureCanvasProps {
  token: string;
  totalFormateado: string;
  onFirmadoExitoso: () => void;
  onCancelar: () => void;
}

export function ProposalSignatureCanvas({
  token,
  totalFormateado,
  onFirmadoExitoso,
  onCancelar,
}: ProposalSignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const [hasStroke, setHasStroke] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Inicializar canvas con DPR (Device Pixel Ratio)
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0a0a0d';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = '#ecb613'; // Tinta oro S-Class
  }, []);

  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      initCanvas();
      setHasStroke(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    const { x, y } = getCoordinates(e);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.1, y);
    ctx.stroke();
    setHasStroke(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
  };

  const handleClear = () => {
    initCanvas();
    setHasStroke(false);
    setErrorMsg(null);
  };

  const handleConfirmSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasStroke || submitting) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const pngBase64 = canvas.toDataURL('image/png');
      const now = new Date();
      const fecha = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const hora = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      const dispositivo = /Mobi|Android/i.test(navigator.userAgent) ? 'Smartphone' : 'Escritorio';

      const res = await fetch('/api/proposals/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          firma: {
            fecha,
            hora,
            ip: 'Cliente Web',
            dispositivo,
            pngBase64,
          },
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Error al guardar la firma digital.');
      }

      onFirmadoExitoso();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión. Inténtalo de nuevo.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-[#ecb613]/30 bg-[#07070a] p-6 shadow-2xl shadow-[#ecb613]/10">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-[#ecb613]" />
            <h3 className="text-lg font-bold text-white font-syne tracking-tight">
              Firma Digital de la Propuesta
            </h3>
          </div>
          <button
            onClick={onCancelar}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-xs text-neutral-300">
          Al estampar tu firma en el lienzo confirmas la aceptación de los servicios seleccionados por un importe total estimado de <strong className="text-[#ecb613]">{totalFormateado}</strong>.
        </p>

        {/* Lienzo táctil */}
        <div className="mt-4 relative rounded-xl border border-white/15 overflow-hidden bg-[#0a0a0d]">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="w-full h-48 touch-none cursor-crosshair"
          />
          {!hasStroke && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <span className="text-xs text-neutral-500 font-mono tracking-widest uppercase">
                Dibuja tu firma aquí con el dedo o ratón
              </span>
            </div>
          )}
        </div>

        {errorMsg && (
          <p className="mt-2 text-xs text-rose-400 font-mono">{errorMsg}</p>
        )}

        <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Certificado SSL · Hash SHA-256 S-Class
          </span>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-neutral-400 hover:text-[#ecb613] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Borrar trazo
          </button>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-neutral-300 hover:bg-white/5 font-medium text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmSignature}
            disabled={!hasStroke || submitting}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              hasStroke && !submitting
                ? 'bg-[#ecb613] text-black hover:bg-[#d8a40f] shadow-lg shadow-[#ecb613]/20 cursor-pointer'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              'Guardando...'
            ) : (
              <>
                <Check className="w-4 h-4" />
                Confirmar y Firmar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
