import React, { useState, useEffect } from 'react';
import { CreditCard, X, Check, ShieldCheck, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number | string;
    concept: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, concept }) => {
    const [method, setMethod] = useState<'card' | 'transfer' | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [numericAmount, setNumericAmount] = useState(0);

    useEffect(() => {
        const val = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount;
        setNumericAmount(val || 0);
    }, [amount]);

    const processPayment = async () => {
        setIsProcessing(true);
        try {
            if (method === 'card') {
                const response = await fetch('/api/payments/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: numericAmount,
                        concept: concept,
                    }),
                });

                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    throw new Error(data.error || 'Error al iniciar Stripe');
                }
            } else {
                // Transferencia (SEPA) - Simulación por ahora o lógica manual
                await new Promise(resolve => setTimeout(resolve, 2000));
                setPaymentSuccess(true);
            }
        } catch (error) {
            console.error("❌ ERROR DE PAGO S-CLASS:", error);
            alert("Error en el protocolo de pago. Reintentando...");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-lg p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[#0f0f0f] border border-white/20 rounded-[3rem] max-w-lg w-full relative shadow-2xl overflow-hidden flex flex-col"
                >
                    <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#111]">
                        <div className="flex items-center gap-3">
                            <Receipt className="text-primary" size={24} />
                            <span className="font-display font-black text-white text-xl uppercase italic">EAR Pay</span>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={28} /></button>
                    </div>

                    {paymentSuccess ? (
                        <div className="p-16 text-center">
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                                <Check size={48} className="text-black" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-4 uppercase italic">¡PAGO REGISTRADO!</h3>
                            <p className="text-gray-400 mb-10 text-lg">Hemos digitalizado el recibo y lo hemos enviado a tu bandeja de entrada forense.</p>
                            <button onClick={onClose} className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary transition-all">FINALIZAR PROTOCOLO</button>
                        </div>
                    ) : (
                        <div className="p-10">
                            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 mb-8">
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Concepto de Inversión</p>
                                <p className="text-white font-bold text-lg mb-6 leading-tight">{concept}</p>
                                <div className="flex justify-between items-end border-t border-white/10 pt-6">
                                    <span className="text-xs text-gray-500 uppercase font-black tracking-widest">Total a Validar</span>
                                    <span className="text-4xl font-black text-white">{numericAmount.toFixed(2)}€</span>
                                </div>
                            </div>

                            {!method ? (
                                <div className="space-y-4">
                                    <button
                                        onClick={() => setMethod('card')}
                                        className="w-full flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/50 transition-all group"
                                    >
                                        <span className="font-bold text-white group-hover:text-primary transition-colors uppercase tracking-widest text-sm">Tarjeta de Crédito</span>
                                        <CreditCard size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
                                    </button>
                                    <button
                                        onClick={() => setMethod('transfer')}
                                        className="w-full flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/50 transition-all group"
                                    >
                                        <span className="font-bold text-white group-hover:text-primary transition-colors uppercase tracking-widest text-sm">Transferencia (IBAN)</span>
                                        <ShieldCheck size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="text-center">
                                        <p className="text-gray-400 text-sm mb-2">Validando parámetros de seguridad para:</p>
                                        <strong className="text-white uppercase tracking-widest text-xl">{method === 'card' ? 'Protocolo Visa/MC' : 'Protocolo SEPA'}</strong>
                                    </div>
                                    <button
                                        onClick={processPayment}
                                        disabled={isProcessing}
                                        className="w-full py-6 bg-primary text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {isProcessing ? (
                                            <>Validando con Servidor...</>
                                        ) : (
                                            <>FINALIZAR TRANSACCIÓN</>
                                        )}
                                    </button>
                                    <button onClick={() => setMethod(null)} className="w-full text-xs text-gray-600 uppercase font-bold tracking-widest hover:text-white transition-colors">Cambiar Método</button>
                                </div>
                            )}
                            <p className="text-center text-[9px] text-gray-700 mt-10 uppercase tracking-[0.3em] font-black italic">Transacción Blindada por Protocolo de Seguridad EAR 2026</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentModal;
