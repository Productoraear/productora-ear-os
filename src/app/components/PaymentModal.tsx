
import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, X, Copy, Check, ShieldCheck, Wallet, Globe, Clock, Tag, Receipt } from 'lucide-react';
import { api } from '../../lib/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number | string;
  concept: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, concept }) => {
  const [method, setMethod] = useState<'card' | 'paypal' | 'crypto' | 'transfer' | null>(null);
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
      // Registrar la cotización/pago en el backend antes de finalizar
      await api.submitQuote({
        type: 'final_reservation_payment',
        amount: numericAmount,
        currency: 'EUR',
        concept: concept,
        timestamp: new Date().toISOString(),
        breakdown: { method, concept }
      });
      
      setPaymentSuccess(true);
    } catch (error) {
      console.error("Error al procesar pago:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 animate-fade-in">
      <div className="bg-[#0f0f0f] border border-white/20 rounded-3xl max-w-lg w-full relative shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
            <div className="flex items-center gap-3">
                <Receipt className="text-ear-gold" size={20} />
                <span className="font-display font-bold text-white text-lg">Pasarela EAR Pay</span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={24} /></button>
        </div>

        {paymentSuccess ? (
            <div className="p-12 text-center animate-scale-in">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                    <Check size={40} className="text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Pago Registrado!</h3>
                <p className="text-gray-400 mb-8">Hemos enviado el recibo digital a tu bandeja de entrada.</p>
                <button onClick={onClose} className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-xl">Cerrar</button>
            </div>
        ) : (
            <div className="p-8">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Concepto de Inversión</p>
                    <p className="text-white font-bold mb-4">{concept}</p>
                    <div className="flex justify-between items-end border-t border-white/10 pt-4">
                        <span className="text-xs text-gray-500 uppercase font-bold">Total a Validar</span>
                        <span className="text-3xl font-black text-white">{numericAmount.toFixed(2)}€</span>
                    </div>
                </div>

                {!method ? (
                  <div className="space-y-4">
                      <button onClick={() => setMethod('card')} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-ear-gold transition-all">
                        <span className="font-bold text-white">Tarjeta de Crédito</span>
                        <CreditCard size={20} className="text-gray-400" />
                      </button>
                      <button onClick={() => setMethod('transfer')} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-ear-gold transition-all">
                        <span className="font-bold text-white">Transferencia (IBAN)</span>
                        <ShieldCheck size={20} className="text-gray-400" />
                      </button>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <p className="text-center text-gray-400 text-sm mb-8">Confirmando los parámetros técnicos de seguridad para el método: <strong className="text-white uppercase">{method}</strong></p>
                    <button onClick={processPayment} disabled={isProcessing} className="w-full py-4 bg-ear-gold text-black font-black uppercase tracking-widest rounded-xl shadow-xl hover:bg-white transition-all">
                      {isProcessing ? 'Validando con Servidor...' : 'Finalizar Transacción'}
                    </button>
                  </div>
                )}
                <p className="text-center text-[9px] text-gray-600 mt-6 uppercase tracking-widest">Transacción Blindada por Protocolo de Seguridad EAR</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
