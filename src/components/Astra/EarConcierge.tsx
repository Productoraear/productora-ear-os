'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { usePathname } from 'next/navigation';

// Initialize Stripe (uses public key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function StripeCheckoutForm({ clientSecret, onSuccess }: { clientSecret: string, onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
      redirect: "if_required"
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setIsProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-black/50 rounded-lg border border-[#258DCD]/30 mt-4">
      <h3 className="text-[#AAD6CD] mb-4 text-sm uppercase tracking-widest font-bold">Reserva & Bloqueo (100€)</h3>
      <div className="bg-white p-3 rounded-md mb-4">
        <PaymentElement />
      </div>
      {error && <div className="text-[#FF455B] text-xs mb-4">{error}</div>}
      <button 
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-[#258DCD] text-white py-3 rounded-md font-bold uppercase tracking-widest text-xs hover:bg-[#258DCD]/80 transition-colors disabled:opacity-50"
      >
        {isProcessing ? 'Procesando...' : 'Confirmar Reserva S-Class'}
      </button>
    </form>
  );
}

export function EarConcierge() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [isFetchingSecret, setIsFetchingSecret] = React.useState(false);
  
  const pathname = usePathname();

  // Web Audio API Sound Design
  const playSotaClick = React.useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, ctx.currentTime); // Deep sub frequency
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Fallback silencioso (Autoplay policy)
    }
  }, []);

  // Cmd+K shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => {
          if (!open) playSotaClick();
          return !open;
        });
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [playSotaClick]);

  // Contextual Placeholder
  let placeholder = 'Cmd+K para iniciar Concierge...';
  if (pathname.includes('/solista') || pathname.includes('/mariachi')) {
    placeholder = 'Verificar fechas para el próximo evento...';
  } else if (pathname.includes('/vimume')) {
    placeholder = 'Solicitar dossier clínico VIMUME...';
  }

  // Predictive Inference (Zero-Lag)
  // If user types 'reservar', trigger Stripe PaymentIntent fetch
  React.useEffect(() => {
    if (query.toLowerCase().includes('reservar') && !clientSecret && !isFetchingSecret) {
      setIsFetchingSecret(true);
      fetch('/api/astra/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100, concept: 'Reserva vía Concierge' })
      })
      .then(res => res.json())
      .then(data => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
        setIsFetchingSecret(false);
      })
      .catch(() => setIsFetchingSecret(false));
    }
  }, [query, clientSecret, isFetchingSecret]);

  return (
    <Command.Dialog 
      open={open} 
      onOpenChange={setOpen} 
      label="EAR Concierge"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
    >
      <div className="fixed inset-0 bg-[#030305]/80 backdrop-blur-xl" aria-hidden="true" />
      
      <div className="relative w-full max-w-xl mx-4 bg-[#1a1a1a]/90 backdrop-blur-md border border-[#258DCD]/20 rounded-xl shadow-2xl overflow-hidden text-[#FFFFFF] z-10">
        <div className="flex items-center px-4 border-b border-[#258DCD]/20">
          <Command.Input 
            autoFocus
            value={query}
            onValueChange={setQuery}
            placeholder={placeholder}
            className="w-full bg-transparent text-lg text-white placeholder-gray-500 py-6 outline-none focus:ring-0 border-none"
          />
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
          <Command.Empty className="p-8 text-center text-gray-500 text-sm">
            {isFetchingSecret ? 'Invocando motor transaccional...' : 'El Oráculo está analizando tu petición.'}
          </Command.Empty>

          {!clientSecret && query.length > 0 && !query.toLowerCase().includes('reservar') && (
            <Command.Group heading="Acciones Sugeridas" className="text-[#AAD6CD] text-xs px-2 py-3 uppercase tracking-widest">
              <Command.Item 
                onSelect={() => setQuery('reservar fecha')}
                className="px-4 py-3 cursor-pointer text-white hover:bg-[#258DCD]/20 rounded-md transition-colors"
              >
                Inyectar Bloqueo de Fecha S-Class (100€)
              </Command.Item>
              <Command.Item 
                className="px-4 py-3 cursor-pointer text-white hover:bg-[#258DCD]/20 rounded-md transition-colors"
              >
                Auditar acústica de sala <span className="opacity-50">(Rider S-Class)</span>
              </Command.Item>
            </Command.Group>
          )}

          {/* Checkout Inyectado */}
          {clientSecret && (
            <div className="p-2 animate-in fade-in zoom-in duration-300">
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                <StripeCheckoutForm 
                  clientSecret={clientSecret} 
                  onSuccess={() => {
                    setQuery('');
                    setClientSecret(null);
                    setOpen(false);
                    // trigger success redirect or animation
                    window.location.href = '/success?source=concierge';
                  }} 
                />
              </Elements>
            </div>
          )}
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
