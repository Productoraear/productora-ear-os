'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import type { Auth, User } from 'firebase/auth';
import { ArrowRight, KeyRound, Loader2, Lock, MessageCircle, ShieldCheck } from 'lucide-react';
import { auth } from '@/lib/firebase';

/**
 * 🔐 /login — PUERTA DE ACCESO SOBERANA (W41_T03)
 * ============================================================================
 * El middleware redirige aquí toda petición a /admin o /command-center sin
 * sesión válida. Este es el ÚNICO punto de entrada legítimo al shell.
 *
 * Flujo blindado (sin bucles de redirección):
 *   1. signInWithPopup(Google) → ID token de Firebase.
 *   2. POST /api/admin/session → el servidor verifica token + rol RBAC y emite
 *      las cookies que el Edge middleware valida.
 *   3. router.replace(destino) → la navegación ya encuentra sesión válida.
 *
 * Si se navegara ANTES del paso 2, el middleware devolvería al usuario a /login
 * indefinidamente: por eso la emisión de sesión es síncrona y bloqueante.
 * ============================================================================
 */

const ADMIN_HOME = '/admin/control';
const WHATSAPP_SUPPORT = 'https://wa.me/34693693048';

/** Solo rutas internas: corta open-redirects (?from=//evil.tld). */
function safeInternalTarget(raw: string | null): string {
    if (!raw) return ADMIN_HOME;
    if (!raw.startsWith('/') || raw.startsWith('//')) return ADMIN_HOME;
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
    const target = safeInternalTarget(searchParams.get('from'));

    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const syncSession = useCallback(async (user: User): Promise<void> => {
        const token = await user.getIdToken();
        const res = await fetch('/api/admin/session', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });

        if (res.ok) return;
        if (res.status === 401) throw new Error('Credencial caducada. Vuelve a iniciar sesión.');
        if (res.status === 403) throw new Error('Tu cuenta no tiene rango ADMIN o COMMANDER. Acceso denegado.');
        if (res.status === 503) throw new Error('Servicio de administración no configurado en este despliegue.');
        throw new Error('No se pudo emitir la sesión administrativa.');
    }, []);

    // Sesión ya existente (recarga de /login): re-emitir cookies y entrar.
    useEffect(() => {
        const firebaseAuth = auth as Auth | null;
        if (!firebaseAuth) return;

        let alive = true;
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            if (!user || !alive) return;
            try {
                await syncSession(user);
                if (alive) router.replace(target);
            } catch (err) {
                if (alive) setError(describeAuthError(err));
            }
        });

        return () => {
            alive = false;
            unsubscribe();
        };
    }, [router, syncSession, target]);

    const handleGoogle = useCallback(async (): Promise<void> => {
        setError(null);
        setPending(true);
        try {
            if (!auth) {
                throw new Error('Firebase no está configurado en este despliegue (NEXT_PUBLIC_FIREBASE_API_KEY).');
            }
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            const credential = await signInWithPopup(auth, provider);
            await syncSession(credential.user);
            router.replace(target);
        } catch (err) {
            setError(describeAuthError(err));
        } finally {
            setPending(false);
        }
    }, [router, syncSession, target]);

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
                            EAR OS · Shell Administrativo
                        </p>
                    </div>
                </div>

                <p className="mt-6 font-inter text-sm leading-relaxed text-zinc-400">
                    Autentifícate con tu cuenta corporativa para entrar en el centro de
                    control. La sesión se firma en el servidor y se valida en cada
                    petición: no se admiten accesos anónimos.
                </p>

                <div aria-live="polite" className="mt-5 space-y-2">
                    {pending && (
                        <p
                            role="status"
                            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-[11px] text-zinc-300"
                        >
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#ecb613]" />
                            Verificando credenciales y emitiendo sesión…
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
                    className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#ecb613] px-5 py-3.5 font-display text-sm font-black uppercase tracking-wide text-black transition-all duration-300 ease-out hover:bg-[#f6ca3c] hover:shadow-[0_0_30px_rgba(236,182,19,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
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

                <div className="mt-6 border-t border-white/10 pt-5">
                    <a
                        href={WHATSAPP_SUPPORT}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-inter text-xs text-zinc-300 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:bg-[#ecb613]/10 hover:text-white"
                    >
                        <MessageCircle className="h-4 w-4 text-[#ecb613]" />
                        ¿Sin acceso? Centralita de soporte
                    </a>

                    {/*
                     * Respaldo operativo (no duplica la ruta /login): si Firebase
                     * Admin no está configurado en el despliegue (503) o el popup
                     * de Google falla, aquí sigue vivo el flujo PIN + 2FA +
                     * recuperación en 3 fases, que emite ear_admin_token/ear_role
                     * —las cookies que el middleware también acepta.
                     */}
                    <Link
                        href="/login/respaldo"
                        className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-inter text-xs text-zinc-300 transition-all duration-300 ease-out hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/10 hover:text-white"
                    >
                        <KeyRound className="h-4 w-4 text-[#00E5FF]" />
                        Acceso de respaldo (PIN · 2FA · recuperación)
                    </Link>

                    <p className="mt-4 flex items-start gap-2 font-mono text-[10px] leading-relaxed text-zinc-500">
                        <Lock className="mt-0.5 h-3 w-3 shrink-0 text-zinc-600" />
                        Cookies de sesión HttpOnly · verificación RBAC server-side · sin
                        exposición de tokens al cliente.
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

