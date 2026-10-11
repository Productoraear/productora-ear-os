"use client";

import React, { useState } from "react";
import { Link } from "lucide-react";

export default function AffiliateClaimPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [code, setCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleClaim = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Ideally we call affiliateV2Actions here, but for now we fetch an API endpoint or use server action
            const formData = new FormData();
            formData.append("email", email);
            formData.append("name", name);

            const res = await fetch("/api/affiliates/v2/onboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name, category: "PRESCRIPTOR" })
            });

            if (!res.ok) {
                throw new Error("Error al reclamar el código. Por favor intente de nuevo.");
            }

            const data = await res.json();
            if (data.success && data.profile) {
                setCode(data.profile.affiliateCode);
            } else {
                throw new Error(data.error || "Error desconocido");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030305] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold font-syne uppercase tracking-tight text-[#ecb613]">
                        Reclama tu Código Soberano
                    </h1>
                    <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto">
                        Únete a la Bóveda Maestra de Crecimiento Musical. Obtén tu código único (SSOT HMAC-SHA256) y recibe un 10% de comisión vitalicia por cada reserva S-Class.
                    </p>
                </div>

                {!code ? (
                    <div className="bg-[#09090d]/80 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
                        <form onSubmit={handleClaim} className="space-y-6">
                            <div>
                                <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">
                                    Nombre Completo o Empresa
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ecb613] transition-colors"
                                    placeholder="Ej. Finca Los Arcos"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">
                                    Correo Electrónico (Tu cuenta EAR)
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ecb613] transition-colors"
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-extrabold uppercase tracking-widest text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? "Generando SSOT Criptográfico..." : "Reclamar Código S-Class"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-[#09090d]/80 border border-[#ecb613]/50 p-8 rounded-3xl shadow-2xl shadow-[#ecb613]/10 backdrop-blur-md text-center space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold font-syne uppercase text-white">Alta Completada</h2>
                            <p className="text-zinc-400 text-sm">Este es tu identificador criptográfico único e inmutable.</p>
                        </div>
                        
                        <div className="p-8 rounded-2xl bg-black border border-zinc-800 inline-block">
                            {/* Placeholder for real QR code */}
                            <div className="w-48 h-48 bg-white mx-auto flex items-center justify-center relative">
                                {/* SVG QR Mock */}
                                <div className="absolute inset-2 border-8 border-black"></div>
                                <div className="w-3/4 h-3/4 grid grid-cols-4 grid-rows-4 gap-1 p-2">
                                    {Array.from({ length: 16 }).map((_, i) => (
                                        <div key={i} className={`bg-black ${i % 3 === 0 || i % 5 === 0 ? 'opacity-100' : 'opacity-0'}`}></div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-6 space-y-2">
                                <div className="text-3xl font-mono font-bold text-[#ecb613] tracking-widest">{code}</div>
                            </div>
                        </div>

                        <div className="space-y-4 max-w-sm mx-auto">
                            <p className="text-xs text-zinc-500 font-mono">Enlace de Atribución 30D (Cookie persistente)</p>
                            <div className="flex items-center gap-2 bg-black/50 border border-zinc-800 rounded-xl p-3">
                                <input 
                                    readOnly 
                                    value={`https://productoraear.com/?ref=${code}`}
                                    className="bg-transparent w-full text-zinc-300 text-xs focus:outline-none"
                                />
                                <button 
                                    onClick={() => navigator.clipboard.writeText(`https://productoraear.com/?ref=${code}`)}
                                    className="p-2 bg-zinc-900 rounded-lg hover:bg-[#ecb613] hover:text-black transition-colors"
                                    title="Copiar Enlace"
                                >
                                    <Link className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="pt-6 border-t border-zinc-900">
                            <a href="/admin/afiliados" className="text-sm font-mono text-[#ecb613] hover:underline uppercase tracking-widest">
                                Ir al Dashboard de Liquidaciones
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
