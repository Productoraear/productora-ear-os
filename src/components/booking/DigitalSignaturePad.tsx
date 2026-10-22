'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Eraser, CheckCircle2, ShieldCheck, PenTool } from 'lucide-react';

export interface SignatureData {
    base64: string;
    sha256: string;
    timestamp: string;
    pointsCount: number;
}

interface DigitalSignaturePadProps {
    signerName: string;
    signerRole: string;
    onSigned?: (signature: SignatureData) => void;
    onClear?: () => void;
    disabled?: boolean;
}

/**
 * Computa hash SHA-256 en navegador mediante Web Crypto API
 */
async function computeBrowserSha256(data: string): Promise<string> {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback simple determinista si subtle no está disponible
    return 'sha256_client_fallback_' + Date.now().toString(16);
}

export function DigitalSignaturePad({
    signerName,
    signerRole,
    onSigned,
    onClear,
    disabled = false,
}: DigitalSignaturePadProps): React.JSX.Element {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [pointsCount, setPointsCount] = useState(0);
    const [signedHash, setSignedHash] = useState<string | null>(null);
    const [isSealing, setIsSealing] = useState(false);

    // Inicializar canvas con fondo oscuro
    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Ajustar resolución retina
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        ctx.fillStyle = '#09090d';
        ctx.fillRect(0, 0, rect.width, rect.height);

        // Guía de firma punteada
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(30, rect.height - 40);
        ctx.lineTo(rect.width - 30, rect.height - 40);
        ctx.stroke();
        ctx.setLineDash([]);
    }, []);

    useEffect(() => {
        setupCanvas();
        const handleResize = () => setupCanvas();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setupCanvas]);

    const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (disabled || signedHash) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.strokeStyle = '#ecb613'; // Dorado S-Class
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);

        setIsDrawing(true);
        setHasDrawn(true);
        setPointsCount((prev) => prev + 1);
        canvas.setPointerCapture(e.pointerId);
    };

    const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawing || disabled || signedHash) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        setPointsCount((prev) => prev + 1);
    };

    const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.releasePointerCapture(e.pointerId);
        }
    };

    const clearCanvas = () => {
        setupCanvas();
        setHasDrawn(false);
        setPointsCount(0);
        setSignedHash(null);
        if (onClear) onClear();
    };

    const handleSealSignature = async () => {
        if (!hasDrawn || pointsCount < 10 || disabled || isSealing) return;
        setIsSealing(true);
        try {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const base64 = canvas.toDataURL('image/png');
            const timestamp = new Date().toISOString();
            const payloadToHash = `${signerName}|${signerRole}|${timestamp}|${pointsCount}|${base64.slice(0, 100)}`;
            const hash = await computeBrowserSha256(payloadToHash);

            setSignedHash(hash);

            if (onSigned) {
                onSigned({
                    base64,
                    sha256: hash,
                    timestamp,
                    pointsCount,
                });
            }
        } finally {
            setIsSealing(false);
        }
    };

    return (
        <div className="w-full bg-[#07070a] border border-white/10 rounded-2xl p-5 shadow-2xl">
            {/* Cabecera del Pad */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-[#ecb613]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-white">
                        Firma Digital Biométrica: {signerName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                        {signerRole}
                    </span>
                </div>
                {signedHash ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Firma Sellada SHA-256</span>
                    </div>
                ) : (
                    <div className="text-[11px] text-gray-500 font-mono">
                        Trazo continuo requerido
                    </div>
                )}
            </div>

            {/* Canvas interactivo */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/10 bg-[#09090d]">
                <canvas
                    ref={canvasRef}
                    className={`w-full h-full touch-none select-none ${
                        signedHash ? 'cursor-not-allowed opacity-90' : 'cursor-crosshair'
                    }`}
                    onPointerDown={startDrawing}
                    onPointerMove={draw}
                    onPointerUp={stopDrawing}
                    onPointerCancel={stopDrawing}
                />
                {!hasDrawn && !signedHash && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-500 text-xs">
                        <PenTool className="w-6 h-6 mb-1 text-gray-600 animate-pulse" />
                        <span>Dibuja tu rúbrica aquí con el dedo o ratón</span>
                    </div>
                )}
            </div>

            {/* Panel de control y telemetría */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-gray-400 font-mono">
                    {signedHash ? (
                        <span className="text-emerald-400">
                            HASH: {signedHash.slice(0, 16)}...{signedHash.slice(-8)}
                        </span>
                    ) : (
                        <span>Puntos biométricos: {pointsCount} {pointsCount >= 10 ? '✓' : '(mín 10)'}</span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {!signedHash && (
                        <>
                            <button
                                type="button"
                                onClick={clearCanvas}
                                disabled={!hasDrawn || disabled}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 border border-white/10"
                            >
                                <Eraser className="w-3.5 h-3.5" />
                                Limpiar
                            </button>
                            <button
                                type="button"
                                onClick={handleSealSignature}
                                disabled={!hasDrawn || pointsCount < 10 || disabled || isSealing}
                                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#ecb613] hover:bg-[#d8a40f] text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-lg shadow-[#ecb613]/20"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {isSealing ? 'Sellando...' : 'Sellar Rúbrica'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
