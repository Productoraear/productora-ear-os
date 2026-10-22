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
 * Computa hash SHA-256 criptográfico real (Web Crypto API con algoritmo matemático RFC 6234 si no disponible)
 */
function pureSha256Hex(ascii: string): string {
    function rightRotate(value: number, amount: number): number {
        return (value >>> amount) | (value << (32 - amount));
    }

    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let i = 0;
    let j = 0;
    const words: number[] = [];
    const asciiBitLength = ascii.length * 8;

    const hash = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
    ];

    const k = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
    ];

    for (i = 0; i < ascii.length; i++) {
        j = ascii.charCodeAt(i);
        words[i >> 2] |= j << ((3 - (i % 4)) * 8);
    }
    words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
    words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

    const w = new Array<number>(64);
    for (i = 0; i < words.length; i += 16) {
        const a = hash[0];
        const b = hash[1];
        const c = hash[2];
        const d = hash[3];
        const e = hash[4];
        const f = hash[5];
        const g = hash[6];
        const h = hash[7];

        let currA = a;
        let currB = b;
        let currC = c;
        let currD = d;
        let currE = e;
        let currF = f;
        let currG = g;
        let currH = h;

        for (j = 0; j < 64; j++) {
            if (j < 16) {
                w[j] = words[i + j] | 0;
            } else {
                const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
                const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
                w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
            }

            const temp1 =
                currH +
                (rightRotate(currE, 6) ^ rightRotate(currE, 11) ^ rightRotate(currE, 25)) +
                ((currE & currF) ^ (~currE & currG)) +
                k[j] +
                w[j];
            const temp2 =
                (rightRotate(currA, 2) ^ rightRotate(currA, 13) ^ rightRotate(currA, 22)) +
                ((currA & currB) ^ (currA & currC) ^ (currB & currC));

            currH = currG;
            currG = currF;
            currF = currE;
            currE = (currD + temp1) | 0;
            currD = currC;
            currC = currB;
            currB = currA;
            currA = (temp1 + temp2) | 0;
        }

        hash[0] = (hash[0] + currA) | 0;
        hash[1] = (hash[1] + currB) | 0;
        hash[2] = (hash[2] + currC) | 0;
        hash[3] = (hash[3] + currD) | 0;
        hash[4] = (hash[4] + currE) | 0;
        hash[5] = (hash[5] + currF) | 0;
        hash[6] = (hash[6] + currG) | 0;
        hash[7] = (hash[7] + currH) | 0;
    }

    let result = '';
    for (i = 0; i < 8; i++) {
        for (j = 3; j >= 0; j--) {
            const bVal = (hash[i] >> (j * 8)) & 255;
            result += (bVal < 16 ? '0' : '') + bVal.toString(16);
        }
    }
    return result;
}

async function computeBrowserSha256(data: string): Promise<string> {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        try {
            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(data);
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        } catch {
            return pureSha256Hex(data);
        }
    }
    return pureSha256Hex(data);
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
