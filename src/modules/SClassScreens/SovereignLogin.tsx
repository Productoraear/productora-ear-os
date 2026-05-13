"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  ArrowLeft, 
  LogIn, 
  ShieldAlert, 
  Key, 
  Fingerprint,
  Loader2,
  AlertCircle 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const SovereignLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setLoading(true);
                try {
                    const response = await fetch('/api/nexus/user/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: user.uid, email: user.email }),
                    });
                    
                    if (!response.ok) throw new Error("Sync failed");
                    
                    const profile = await response.json();
                    const role = profile.role.toLowerCase();
                    
                    // Establecer cookie para verificación SSR (S-Class Protocol)
                    document.cookie = `ear_os_user_id=${user.uid}; path=/; max-age=3600; samesite=lax`;
                    document.cookie = `ear_os_auth_token=true; path=/; max-age=3600; samesite=lax`;
                    
                    router.push(`/nexus/${role}/${user.uid}`);
                } catch (err) {
                    console.error("🛑 [LOGIN_SYNC_ERROR]:", err);
                    setError("Error al sincronizar perfil soberano.");
                } finally {
                    setLoading(false);
                }
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError("Credenciales S-Class Inválidas. Acceso Denegado.");
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        setLoading(true);
        try {
            await signInWithPopup(auth, provider);
        } catch (err) {
            setError("Fallo en Autenticación Google. Reintento Alpha requerido.");
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#050505] text-white flex flex-col font-outfit selection:bg-[#ffd471]/30 overflow-hidden">
            {/* Abstract radial gradient for vibe */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2a1200,transparent_50%)] opacity-30 pointer-events-none hidden md:block" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#ffd471]/10 to-transparent blur-3xl opacity-20 pointer-events-none" />
            
            {/* Mobile Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20" />
            
            {/* Top App Bar */}
            <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center p-6 md:p-8 justify-between z-50 relative"
            >
                <Link href="/">
                    <button className="text-white/40 flex items-center gap-2 hover:text-[#ffd471] transition-all group tracking-widest text-[9px] font-black uppercase">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Ecosistema</span>
                    </button>
                </Link>
                <div className="text-[#ffd471] font-black tracking-[0.6em] md:tracking-[1em] text-[8px] md:text-[10px] uppercase drop-shadow-[0_0_10px_rgba(255,212,113,0.5)]">
                    PRODUCTORA EAR OS
                </div>
                <div className="w-10 sm:w-40" />
            </motion.div>

            <div className="flex flex-col items-center justify-center flex-1 px-8 z-10 relative">
                {/* Central Icon */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="relative mb-12"
                >
                    <div className="w-32 h-32 bg-[#ffd471]/10 rounded-full flex items-center justify-center border border-[#ffd471]/30 shadow-[0_0_50px_rgba(255,212,113,0.2)]">
                        <Lock className="text-[#ffd471]" size={56} />
                    </div>
                    <div className="absolute -inset-4 border border-[#ffd471]/10 rounded-full animate-[spin_20s_linear_infinite]" />
                </motion.div>

                {/* Headline Section */}
                <div className="text-center mb-8 md:mb-12">
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white tracking-[0.1em] md:tracking-[0.2em] text-4xl md:text-[48px] font-black leading-tight uppercase font-outfit"
                    >
                        ÁREA <span className="text-[#ffd471]">SOBERANA</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-white/40 text-sm md:text-lg italic mt-3 tracking-wide px-4"
                    >
                        Acceso exclusivo para el <span className="text-[#ffd471]/80 font-bold">Protocolo Emanager</span>
                    </motion.p>
                </div>

                {/* Login Card */}
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-full max-w-md bg-white/[0.02] backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
                >
                    <form onSubmit={handleLogin} className="flex flex-col gap-6">
                        <div className="space-y-3">
                            <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] ml-1">Email o Código de Señal</p>
                            <div className="relative group">
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-2xl text-white focus:outline-0 focus:ring-1 focus:ring-[#ffd471]/50 border border-white/10 bg-white/5 focus:border-[#ffd471] h-16 placeholder:text-white/10 p-6 text-base italic transition-all group-hover:border-[#ffd471]/20" 
                                    placeholder="nombre@talentoear.com" 
                                    required
                                />
                                <Fingerprint className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#ffd471] transition-colors" size={24} />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] ml-1">Protocolo de Acceso</p>
                            <div className="relative group">
                                <input 
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-2xl text-white focus:outline-0 focus:ring-1 focus:ring-[#ffd471]/50 border border-white/10 bg-white/5 focus:border-[#ffd471] h-16 placeholder:text-white/10 p-6 text-base transition-all group-hover:border-[#ffd471]/20" 
                                    placeholder="••••••••" 
                                    required
                                />
                                <Key className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#ffd471] transition-colors" size={24} />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-wider bg-red-400/10 p-4 rounded-xl border border-red-400/20"
                                >
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button 
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#ffd471] text-black font-black py-4 md:py-5 rounded-2xl text-[10px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.4em] mt-2 md:mt-4 transition-all duration-500 shadow-[0_15px_40px_rgba(255,212,113,0.3)] flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ACCESO AL NEXUS"}
                            {!loading && <LogIn size={16} />}
                        </motion.button>
                    </form>

                    <div className="flex flex-col gap-4 mt-8">
                        <button 
                            onClick={handleGoogleLogin}
                            className="w-full bg-white/5 border border-white/10 text-white/60 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google Digital Identity
                        </button>

                        <div className="flex justify-between items-center px-2 mt-4">
                            <button className="text-[10px] uppercase tracking-widest font-black text-white/20 hover:text-[#ffd471] transition-colors flex items-center gap-2">
                               <ShieldAlert size={12} /> Recuperar Señal
                            </button>
                            <button className="text-[10px] uppercase tracking-widest font-black text-white/20 hover:text-white/50 transition-colors">
                                Soporte Forense
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <footer className="p-8 text-center text-[10px] text-white/10 tracking-[0.5em] uppercase font-black z-50 italic">
                Sovereign Portal Access · Neural Guard v5.0 · EAR_OS_GOLD_V2
            </footer>
        </div>
    );
};

export default SovereignLogin;
