"use client";

import { useState, useTransition } from "react";
import { createConnectOnboardingLink } from "@/app/actions/stripeConnectActions";

interface StripeConnectGateProps {
  providerId: string;
  userId: string;
  stripeConnected: boolean;
  children: React.ReactNode;
}

/**
 * 🏦 STRIPE CONNECT ONBOARDING GATE (V206)
 *
 * Wraps provider dashboard content. If stripeConnected is false,
 * renders a full-screen blocking overlay requiring fiscal onboarding.
 * The overlay cannot be dismissed — the provider MUST complete Stripe
 * verification before accessing financial or operational features.
 *
 * isVerified is NEVER set from this component. Only the webhook can.
 */
export function StripeConnectGate({
  providerId,
  userId,
  stripeConnected,
  children,
}: StripeConnectGateProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (stripeConnected) {
    return <>{children}</>;
  }

  function handleOnboarding() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await createConnectOnboardingLink({ providerId, userId });
        if (result.url) {
          window.location.href = result.url;
        }
      } catch (err: any) {
        setError(err.message || "Error al iniciar el proceso de verificación.");
      }
    });
  }

  return (
    <div className="relative min-h-screen">
      {/* Blurred background hint of dashboard */}
      <div className="pointer-events-none select-none blur-sm opacity-30">
        {children}
      </div>

      {/* Blocking overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="mx-4 w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
            <svg
              className="h-8 w-8 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Copy */}
          <h2 className="mb-2 text-center text-2xl font-semibold text-white">
            Verificación Fiscal Requerida
          </h2>
          <p className="mb-6 text-center text-sm leading-relaxed text-zinc-400">
            Para recibir pagos y operar como proveedor verificado en EAR OS,
            necesitas completar el proceso de verificación fiscal gestionado por
            Stripe. Este proceso es seguro, cumple con la normativa europea y
            es <strong className="text-zinc-300">completamente automático</strong>.
          </p>

          {/* Details */}
          <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <ul className="space-y-2 text-xs text-zinc-500">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-400">✓</span>
                Stripe gestiona tu KYC, datos bancarios y capacidad de cobro
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-400">✓</span>
                EAR OS no almacena datos fiscales — solo recibe confirmación
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-green-400">✓</span>
                Tu panel se desbloquea automáticamente tras la verificación
              </li>
            </ul>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-center text-xs text-red-400">
              {error}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleOnboarding}
            disabled={isPending}
            className="w-full rounded-xl bg-white py-3.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Conectando con Stripe..." : "Verificar con Stripe →"}
          </button>

          <p className="mt-4 text-center text-[10px] text-zinc-600">
            La verificación es gestionada por Stripe Inc. y cumple con PSD2/SCA.
            EAR OS nunca activa la verificación manualmente.
          </p>
        </div>
      </div>
    </div>
  );
}
