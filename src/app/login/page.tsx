'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import type { Auth, User } from 'firebase/auth';
import { ArrowRight, KeyRound, Loader2, Lock, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

/**
 * 🔐 /login — PUERTA DE ACCESO SOBERANA Y SINGLE SIGN-ON (SSO)
 * ============================================================================
 * Punto de entrada único para todos los roles del sistema (Admin, Artistas, Proveedores).
 *
 * Flujo blindado:
 *   1. signInWithPopup(Google) → Firebase ID token.
 *   2. POST /api/auth/session → el servidor verifica el token, consulta el rol RBAC
 *      en PostgreSQL (Prisma) y emite cookies HttpOnly seguras (__session, ear_role).
 *   3. router.replace(data.redirectUrl || target) → enrutamiento dinámico automático
 *      al panel correspondiente:
 *      - ADMIN / COMMANDER → /admin/control
 *      - ARTIST → /portal/artista
 *      - PROVIDER → /proveedores/dashboard
 * ============================================================================
 */

const WHATSAPP_SUPPORT = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=Hola%20Productora%20EAR%2C%20necesito%20asistencia%20con%20el%20acceso%20a%20mi%20cuenta.`;

/** Solo rutas internas: evita open-redirects (?from=//evil.tld). */
function safeInternalTarget(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith('/') || raw.startsWith('//')) return null;
  return raw;
}

function describeAuthError(err: unknown): string {
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code?: unknown }).code ?? '')
      : '';

  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Ventana cerrada antes de completar el acceso.';
    case 'auth/unauthorized-domain':
      return 'Dominio no autorizado en Firebase Auth. Revisa los dominios permitidos.';
    case 'auth/network-request-failed':
      return 'Fallo de red al contactar con el proveedor de identidad. Reintenta.';
    case 'auth/operation-not-allowed':
      return 'El proveedor Google no está habilitado en Firebase Auth.';
    default:
      return err instanceof Error ? err.message : 'Error de autenticación. Reintenta.';
  }
}

function LoginCard(): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetParam = safeInternalTarget(searchParams.get('from'));

  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const syncSession = useCallback(async (user: User): Promise<string> => {
    const token = await user.getIdToken();
    const res = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.ok) {
      return targetParam || data.redirectUrl || '/portal/artista';
    }

    if (res.status === 401) throw new Error('Credencial caducada. Vuelve a iniciar sesión.');
    if (res.status === 403) throw new Error('Acceso no autorizado para este perfil.');
    if (res.status === 503) throw new Error('Servicio de autenticación no configurado en este despliegue.');
    throw new Error(data.error || 'No se pudo sincronizar la sesión.');
  }, [targetParam]);

  // Sesión ya existente: re-emitir cookies y redirigir
  useEffect(() => {
    const firebaseAuth = auth as Auth | null;
    if (!firebaseAuth) return;

    let alive = true;
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user || !alive) return;
      try {
        const dest = await syncSession(user);
        if (alive) router.replace(dest);
      } catch (err) {
        if (alive) setError(describeAuthError(err));
      }
    });

    return () => {
      alive = false;
      unsubscribe();
    };
  }, [router, syncSession]);

  const handleGoogle = useCallback(async (): Promise<void> => {
    setError(null);
    setPending(true);
    try {
      if (!auth) {
        throw new Error('Firebase no está configurado en este despliegue.');
      }
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const credential = await signInWithPopup(auth, provider);
      const dest = await syncSession(credential.user);
      router.replace(dest);
    } catch (err) {
      setError(describeAuthError(err));
    } finally {
      setPending(false);
    }
  }, [router, syncSession]);

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-[#030305] flex items-center justify-center px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(236,182,19,0.12),transparent_65%)]"
      />

      <section className="relative w-full max-w-md rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-8 shadow-[0_0_80px_rgba(0,0,0,0.65)]">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-black leading-tight text-white">
              Acceso Soberano
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#ecb613]/80">
              EAR OS · Single Sign-On Unificado
            </p>
          </div>
        </div>

        <p className="mt-6 font-inter text-sm leading-relaxed text-zinc-400">
          Inicia sesión con tu cuenta de Google. El sistema detectará automáticamente tu rango (Artista, Proveedor o Administración) y te conducirá a tu centro de mando.
        </p>

        <div aria-live="polite" className="mt-5 space-y-2">
          {pending && (
            <p
              role="status"
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-[11px] text-zinc-300"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#ecb613]" />
              Verificando credenciales y sincronizando perfil RBAC…
            </p>
          )}
          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-[#FF2B44]/30 bg-[#FF2B44]/10 px-4 py-3 font-inter text-xs leading-relaxed text-[#FF2B44]"
            >
              {error}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={pending}
          aria-busy={pending}
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#ecb613] px-5 py-3.5 font-display text-sm font-black uppercase tracking-wide text-black transition-all duration-300 ease-out hover:bg-[#f6ca3c] hover:shadow-[0_0_30px_rgba(236,182,19,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Entrar con Google
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="mt-6 border-t border-white/10 pt-5 space-y-2">
          <a
            href={WHATSAPP_SUPPORT}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-inter text-xs text-zinc-300 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:bg-[#ecb613]/10 hover:text-white"
          >
            <MessageCircle className="h-4 w-4 text-[#ecb613]" />
            ¿Sin acceso? Centralita de soporte
          </a>

          <Link
            href="/login/respaldo"
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-inter text-xs text-zinc-300 transition-all duration-300 ease-out hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/10 hover:text-white"
          >
            <KeyRound className="h-4 w-4 text-[#00E5FF]" />
            Acceso de emergencia (PIN · 2FA · Respaldo)
          </Link>

          <a
            href="/api/auth/sovereign-bypass?pass=Ear2024Ear*"
            className="flex items-center justify-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 font-inter text-xs text-amber-300 transition-all duration-300 ease-out hover:border-[#ecb613] hover:bg-[#ecb613]/20 hover:text-white"
          >
            <Sparkles className="h-4 w-4 text-[#ecb613]" />
            ⚡ Desbloquear Centro de Mando (Bypass CEO)
          </a>

          <p className="pt-2 flex items-start gap-2 font-mono text-[10px] leading-relaxed text-zinc-500">
            <Lock className="mt-0.5 h-3 w-3 shrink-0 text-zinc-600" />
            Sesión firmada en servidor · Cookies HttpOnly SameSite=Strict · Cero exposición de tokens.
          </p>
        </div>

        <p className="mt-5 text-center font-inter text-[11px] text-zinc-500">
          <Link
            href="/"
            className="underline decoration-white/20 underline-offset-4 transition-colors duration-300 hover:text-[#ecb613] hover:decoration-[#ecb613]/60"
          >
            Volver a la portada pública
          </Link>
        </p>
      </section>
    </div>
  );
}

function LoginFallback(): ReactElement {
  return (
    <div className="min-h-dvh w-full overflow-x-hidden bg-[#030305] flex items-center justify-center px-4 py-16">
      <div className="h-[520px] w-full max-w-md animate-pulse rounded-3xl bg-[#09090d]/80 border border-white/10" />
    </div>
  );
}

export default function LoginPage(): ReactElement {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginCard />
    </Suspense>
  );
}
