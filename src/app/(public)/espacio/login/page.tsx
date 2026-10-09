'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowRight,
    ShieldCheck,
    Smartphone,
    Mail,
    Lock,
    KeyRound,
    MessageCircle,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Fingerprint,
    Eye,
    EyeOff,
    Sparkles
} from 'lucide-react';
import {
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    signInWithEmail,
    registerWithEmail,
    type OAuthProviderId
} from '@/lib/auth/firebase-auth';
import { requestWhatsAppOtpAction, establishSpaceSessionAction } from '@/app/actions/spaceActions';

type Step = 'provider' | 'whatsapp' | 'done';
type Mode = 'signin' | 'register';

function EspacioLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/espacio';

    const [step, setStep] = useState<Step>('provider');
    const [mode, setMode] = useState<Mode>('signin');
    const [loading, setLoading] = useState<OAuthProviderId | 'email' | 'otp' | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Primer factor: correo
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Identidad resuelta tras el primer factor
    const [identity, setIdentity] = useState<{ uid: string; email: string } | null>(null);

    // Segundo factor: WhatsApp
    const [whatsapp, setWhatsapp] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
    const [devCode, setDevCode] = useState<string | null>(null);

    useEffect(() => {
        setDevCode(process.env.NODE_ENV === 'development' ? '123456' : null);
    }, []);

    function handleProvider(id: OAuthProviderId) {
        setLoading(id);
        setError(null);
        const signer = id === 'google' ? signInWithGoogle : id === 'apple' ? signInWithApple : signInWithFacebook;
        signer()
            .then((user) => {
                if (!user.email) {
                    setError('No pudimos leer tu email desde este proveedor. Prueba con correo directo.');
                    return;
                }
                setIdentity({ uid: user.uid, email: user.email });
                setStep('whatsapp');
            })
            .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : 'OAuth cancelado o fallido.');
            })
            .finally(() => setLoading(null));
    }

    function handleEmail(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!email || !password) {
            setError('Introduce correo y contraseña.');
            return;
        }
        setLoading('email');
        const action = mode === 'register' ? registerWithEmail : signInWithEmail;
        action(email, password)
            .then((user) => {
                setIdentity({ uid: user.uid, email: user.email || email });
                setStep('whatsapp');
            })
            .catch((err: unknown) => {
                setError(err instanceof Error ? err.message : 'Credenciales inválidas.');
            })
            .finally(() => setLoading(null));
    }

    function handleSendOtp(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!identity) return;
        requestWhatsAppOtpAction(whatsapp).then((res) => {
            if (res.success) {
                setOtpSent(true);
                setWhatsappUrl(res.whatsappUrl || null);
                setDevCode(res.code || null);
            } else {
                setError(res.error || 'No se pudo enviar el código.');
            }
        });
    }

    function handleVerifyOtp(e: React.FormEvent) {
        e.preventDefault();
        if (!identity) return;
        setError(null);
        setLoading('otp');
        establishSpaceSessionAction({ uid: identity.uid, email: identity.email, whatsapp, otp }).then((res) => {
            if (res.success) {
                setStep('done');
                router.push(from);
                router.refresh();
            } else {
                setError(res.error || 'Código incorrecto.');
            }
        }).finally(() => setLoading(null));
    }

    return (
        <main className="min-h-screen bg-[#050507] text-white pt-24 pb-20 px-4 font-sans selection:bg-[#ecb613]/30 overflow-x-hidden">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-radial from-[#ecb613]/12 via-transparent to-transparent blur-[160px]" />
            </div>

            <div className="relative z-10 max-w-md mx-auto">
                <div className="text-center space-y-3 mb-8">
                    <div className="inline-flex p-4 rounded-3xl bg-[#09090d]/80 border border-[#ecb613]/30 text-[#ecb613] shadow-[0_0_40px_rgba(236,182,19,0.15)]">
                        <Fingerprint size={32} />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-syne leading-none">
                        Tu Espacio <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f5d77f] to-[#ecb613]">S-Class</span>
                    </h1>
                    <p className="text-white/50 text-sm max-w-sm mx-auto">
                        Identidad de doble vía: acceso Google · Apple · Meta · Correo, sellado con verificación 2FA por WhatsApp.
                    </p>
                </div>

                <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 shadow-2xl space-y-6">
                    {error && (
                        <div className="flex items-start gap-2 p-3 rounded-2xl bg-[#FF2B44]/10 border border-[#FF2B44]/30 text-[#ff8a99] text-xs">
                            <AlertCircle size={15} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {step === 'provider' && (
                        <>
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613] mb-3">1 · Identidad primaria</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <ProviderButton label="Google" icon="G" onClick={() => handleProvider('google')} loading={loading === 'google'} />
                                    <ProviderButton label="Apple" icon="" onClick={() => handleProvider('apple')} loading={loading === 'apple'} />
                                    <ProviderButton label="Meta" icon="f" onClick={() => handleProvider('facebook')} loading={loading === 'facebook'} />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="h-px flex-1 bg-white/10" />
                                <span className="text-[10px] font-mono text-white/30 uppercase">o con correo</span>
                                <span className="h-px flex-1 bg-white/10" />
                            </div>

                            <form onSubmit={handleEmail} className="space-y-3">
                                <label className="block">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5 block">Correo</span>
                                    <div className="relative">
                                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ecb613]" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="tu@email.com"
                                            className="w-full pl-10 pr-3 py-3 rounded-2xl bg-[#0c0a0e] border border-white/10 text-sm text-white outline-none focus:border-[#ecb613]/50 placeholder:text-white/30"
                                        />
                                    </div>
                                </label>

                                <label className="block">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5 block">Contraseña</span>
                                    <div className="relative">
                                        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ecb613]" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#0c0a0e] border border-white/10 text-sm text-white outline-none focus:border-[#ecb613]/50 placeholder:text-white/30"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#ecb613] transition-colors">
                                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </label>

                                <button
                                    type="submit"
                                    disabled={loading === 'email'}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ecb613] to-[#f5d77f] hover:from-white hover:to-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-[0_8px_25px_rgba(236,182,19,0.25)] disabled:opacity-50"
                                >
                                    {loading === 'email' ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
                                    {mode === 'register' ? 'Crear cuenta' : 'Continuar'}
                                </button>
                            </form>

                            <button
                                type="button"
                                onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
                                className="w-full text-center text-xs font-mono text-white/40 hover:text-[#ecb613] transition-colors"
                            >
                                {mode === 'signin' ? '¿No tienes cuenta? Crea una' : '¿Ya tienes cuenta? Inicia sesión'}
                            </button>
                        </>
                    )}

                    {step === 'whatsapp' && identity && (
                        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                            <div className="flex items-center gap-2 text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em]">
                                <ShieldCheck size={14} /> 2 · Verificación WhatsApp 2FA
                            </div>
                            <p className="text-xs text-white/50">Identidad confirmada como <span className="text-white font-bold">{identity.email}</span>. Enlaza tu móvil real para sellar el acceso.</p>

                            {!otpSent ? (
                                <>
                                    <label className="block">
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5 block">WhatsApp (móvil verificable)</span>
                                        <div className="relative">
                                            <Smartphone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ecb613]" />
                                            <input
                                                type="tel"
                                                value={whatsapp}
                                                onChange={(e) => setWhatsapp(e.target.value)}
                                                placeholder="+34 600 000 000"
                                                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-[#0c0a0e] border border-white/10 text-sm text-white outline-none focus:border-[#ecb613]/50 placeholder:text-white/30"
                                            />
                                        </div>
                                    </label>
                                    <button type="submit" className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1fb457] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                                        <MessageCircle size={15} /> Enviar código por WhatsApp
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-start gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                                        <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                                        <div>
                                            <p>Código enviado. {devCode && <span className="font-mono font-bold">Dev: <span className="text-white">{devCode}</span></span>}</p>
                                            {whatsappUrl && (
                                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#25D366] font-bold hover:underline mt-1">
                                                    <MessageCircle size={12} /> Abrir WhatsApp
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <label className="block">
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1.5 block">Código de 6 dígitos</span>
                                        <div className="relative">
                                            <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ecb613]" />
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="000000"
                                                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-[#0c0a0e] border border-white/10 text-center text-lg font-mono tracking-widest text-[#ecb613] outline-none focus:border-[#ecb613]/50 placeholder:text-white/30"
                                            />
                                        </div>
                                    </label>

                                    <button type="submit" disabled={loading === 'otp'} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ecb613] to-[#f5d77f] hover:from-white hover:to-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-[0_8px_25px_rgba(236,182,19,0.25)] disabled:opacity-50">
                                        {loading === 'otp' ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                                        Entrar a mi Espacio
                                    </button>
                                </>
                            )}

                            <button type="button" onClick={() => setStep('provider')} className="w-full text-center text-xs font-mono text-white/40 hover:text-white transition-colors">
                                ← Cambiar identidad
                            </button>
                        </form>
                    )}

                    {step === 'done' && (
                        <div className="text-center space-y-3 py-4">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/40 grid place-items-center text-emerald-400">
                                <CheckCircle2 size={28} />
                            </div>
                            <p className="font-syne font-black uppercase">Acceso sellado</p>
                            <p className="text-xs text-white/50">Redirigiendo a tu espacio editable…</p>
                        </div>
                    )}
                </div>

                <p className="text-center text-[10px] font-mono text-white/25 mt-6 uppercase tracking-widest">
                    Doble vía de identidad · WhatsApp 2FA · Cifrado en tránsito
                </p>
            </div>
        </main>
    );
}

function ProviderButton({ label, icon, onClick, loading }: { label: string; icon: string; onClick: () => void; loading: boolean }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className="group flex flex-col items-center gap-2 rounded-2xl bg-[#0c0a0e] border border-white/10 py-5 hover:border-[#ecb613]/50 hover:bg-[#ecb613]/5 transition-all hover:scale-[1.03] disabled:opacity-50"
        >
            <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 grid place-items-center font-black text-base text-white group-hover:text-[#ecb613] transition-colors">
                {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
            </span>
            <span className="text-[10px] font-mono text-white/60 group-hover:text-white transition-colors">{label}</span>
        </button>
    );
}

export default function EspacioLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050507] grid place-items-center text-[#ecb613] font-mono text-xs">Cargando identidad S-Class…</div>}>
            <EspacioLoginForm />
        </Suspense>
    );
}