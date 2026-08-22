
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../../contexts/LanguageContext';
import { Icon } from '../Icon';

interface DigitalSignatureProps {
    onComplete: () => void;
}

export const DigitalSignature: React.FC<DigitalSignatureProps> = ({ onComplete }) => {
    const { t } = useTranslations();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [signatureImage, setSignatureImage] = useState<string | null>(null);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const { x, y } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#3b82f6'; // Blue ink
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(e, canvas);
        ctx.lineTo(x, y);
        ctx.stroke();
        setHasSignature(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            // Optional: Close path or just stop
        }
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
        setSignatureImage(null);
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL('image/png');
        setSignatureImage(dataUrl);
    };

    useEffect(() => {
        // Resize canvas to parent width
        const canvas = canvasRef.current;
        if (canvas && canvas.parentElement) {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = 300; // Fixed height
        }
    }, []);

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-zinc-950">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">{t('tool_digitalSignature_title')}</h1>
                    <p className="text-zinc-400">{t('tool_digitalSignature_description')}</p>
                </motion.div>

                {!signatureImage ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl overflow-hidden shadow-2xl"
                    >
                        <div className="bg-zinc-100 p-4 border-b border-zinc-200 flex justify-between items-center">
                            <span className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">{t('signature_canvas_label')}</span>
                            <button onClick={clearCanvas} className="text-red-500 hover:text-red-600 text-sm font-medium">
                                {t('signature_clear')}
                            </button>
                        </div>
                        <div className="w-full h-[300px] bg-white cursor-crosshair touch-none relative">
                            <canvas
                                ref={canvasRef}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                className="w-full h-full"
                            />
                            {!hasSignature && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <p className="text-zinc-300 text-2xl font-handwriting opacity-50">{t('signature_canvas_placeholder')}</p>
                                </div>
                            )}
                        </div>
                        <div className="bg-zinc-50 p-4 border-t border-zinc-200 flex justify-end">
                            <button
                                onClick={saveSignature}
                                disabled={!hasSignature}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t('signature_save')}
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center"
                    >
                        <Icon className="w-16 h-16 text-green-500 mx-auto mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></Icon>
                        <h3 className="text-2xl font-bold text-white mb-4">{t('signature_captured_title')}</h3>
                        <div className="bg-white rounded-lg p-4 inline-block mb-6 transform rotate-[-2deg] shadow-lg">
                            <img src={signatureImage} alt="Signature" className="h-32 object-contain" />
                        </div>
                        <p className="text-zinc-400 mb-8 max-w-md mx-auto">{t('signature_captured_desc')}</p>
                        
                        <div className="flex justify-center gap-4">
                            <button onClick={clearCanvas} className="px-6 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors">
                                {t('signature_retry')}
                            </button>
                            <button onClick={onComplete} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-bold transition-colors">
                                {t('completeAndContinue')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
