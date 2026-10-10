'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { usePathname } from 'next/navigation';

// Initialize Stripe (uses public key)
// 🔒 FAIL-CLOSED STRIPE CLIENT (BLINDAJE SESSION_SECRET P0): sin public key real, no hay cliente Stripe.
const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_PUBLIC_KEY && STRIPE_PUBLIC_KEY !== 'pk_test_placeholder'
  ? loadStripe(STRIPE_PUBLIC_KEY)
  : null;

interface StripeCheckoutFormProps {
  clientSecret: string;
  onSuccess: () => void;
}

function StripeCheckoutForm({ clientSecret, onSuccess }: StripeCheckoutFormProps): React.JSX.Element {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setIsProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-black/50 rounded-lg border border-[#258DCD]/30 mt-4"
      aria-label="Formulario de reserva y bloqueo de fecha S-Class"
      role="form"
      noValidate
    >
      <h3
        id="stripe-checkout-heading"
        className="text-[#AAD6CD] mb-4 text-sm uppercase tracking-widest font-bold"
      >
        Reserva &amp; Bloqueo (100€)
      </h3>
      <div
        className="bg-white p-3 rounded-md mb-4"
        role="group"
        aria-label="Datos de pago seguros"
        aria-describedby="stripe-checkout-heading"
      >
        <PaymentElement />
      </div>
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="text-[#FF455B] text-xs mb-4"
        >
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        aria-label={isProcessing ? 'Procesando pago de reserva' : 'Confirmar reserva S-Class por 100 euros'}
        aria-busy={isProcessing}
        aria-disabled={isProcessing || !stripe || !elements}
        className="w-full bg-[#258DCD] text-white py-3 rounded-md font-bold uppercase tracking-widest text-xs hover:bg-[#258DCD]/80 transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AAD6CD] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        {isProcessing ? 'Procesando...' : 'Confirmar Reserva S-Class'}
      </button>
    </form>
  );
}

export function EarConcierge(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [isFetchingSecret, setIsFetchingSecret] = React.useState(false);

  const pathname = usePathname();

  // Web Audio API Sound Design
  const playSotaClick = React.useCallback((): void => {
    try {
      const AudioCtx: typeof AudioContext =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
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
    } catch {
      // Fallback silencioso (Autoplay policy)
    }
  }, []);

  // Cmd+K shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent): void => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) playSotaClick();
          return !prev;
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
        body: JSON.stringify({ amount: 100, concept: 'Reserva vía Concierge' }),
      })
        .then((res) => res.json() as Promise<{ clientSecret?: string }>)
        .then((data) => {
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
      aria-label="Conserje inteligente EAR: busca acciones, reserva fechas y solicita dossiers"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="fixed inset-0 bg-[#030305]/80 backdrop-blur-xl"
        aria-hidden="true"
        role="presentation"
      />
      <span className="sr-only" role="note">
        Pulsa Escape para cerrar el concierge. Usa las flechas arriba y abajo para navegar entre resultados y Enter para seleccionar.
      </span>

      <div
        className="relative w-full max-w-xl mx-4 bg-[#1a1a1a]/90 backdrop-blur-md border border-[#258DCD]/20 rounded-xl shadow-2xl overflow-hidden text-[#FFFFFF] z-10"
        role="document"
        aria-label="Panel del conserje EAR"
      >
        <div className="flex items-center px-4 border-b border-[#258DCD]/20">
          <Command.Input
            autoFocus
            value={query}
            onValueChange={setQuery}
            placeholder={placeholder}
            aria-label="Campo de búsqueda del conserje EAR"
            aria-autocomplete="list"
            aria-controls="ear-concierge-list"
            aria-expanded={open}
            role="combobox"
            className="w-full bg-transparent text-lg text-white placeholder-gray-500 py-6 outline-none focus:ring-0 border-none"
          />
        </div>

        <Command.List
          id="ear-concierge-list"
          className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide"
          role="listbox"
          aria-label="Resultados y acciones del conserje"
        >
          <Command.Empty
            className="p-8 text-center text-gray-500 text-sm"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {isFetchingSecret ? 'Invocando motor transaccional...' : 'El Oráculo está analizando tu petición.'}
          </Command.Empty>

          {!clientSecret && query.length > 0 && !query.toLowerCase().includes('reservar') && (
            <Command.Group
              heading="Acciones Sugeridas"
              className="text-[#AAD6CD] text-xs px-2 py-3 uppercase tracking-widest"
              aria-label="Acciones sugeridas por el conserje"
            >
              <Command.Item
                onSelect={() => setQuery('reservar fecha')}
                className="px-4 py-3 cursor-pointer text-white hover:bg-[#258DCD]/20 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AAD6CD]"
                role="option"
                aria-label="Inyectar bloqueo de fecha S-Class por 100 euros"
              >
                Inyectar Bloqueo de Fecha S-Class (100€)
              </Command.Item>
              <Command.Item
                className="px-4 py-3 cursor-pointer text-white hover:bg-[#258DCD]/20 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AAD6CD]"
                role="option"
                aria-label="Auditar acústica de sala según rider S-Class"
              >
                Auditar acústica de sala <span className="opacity-50" aria-hidden="true">(Rider S-Class)</span>
              </Command.Item>
            </Command.Group>
          )}

          {/* Checkout Inyectado */}
          {clientSecret && (
            <div
              className="p-2 animate-in fade-in zoom-in duration-300"
              role="region"
              aria-label="Módulo de pago seguro Stripe"
            >
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