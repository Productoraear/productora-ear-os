"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export const ArtistProfileForm = () => {
    const [user, setUser] = useState<User | null>(null);
    const [displayName, setDisplayName] = useState('');
    const [slug, setSlug] = useState('');
    const [bio, setBio] = useState('');
    const [genres, setGenres] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                // Handle case where user is not logged in, maybe redirect
                router.push('/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError("Usuario no autenticado. Por favor, inicie sesión de nuevo.");
            return;
        }
        
        setLoading(true);
        setError(null);
        setSuccess(false);

        const body = {
            userId: user.uid,
            profileType: 'ARTIST',
            data: {
                displayName,
                slug,
                bio,
                genres: genres.split(',').map(g => g.trim()).filter(g => g),
            }
        };

        try {
            const response = await fetch('/api/profiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Fallo en la creación del perfil.');
            }

            setSuccess(true);
            // Redirect to the new profile page or dashboard after a short delay
            setTimeout(() => {
                router.push(`/a/${slug}`); // Example redirect to artist page
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.form 
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 bg-white/[0.02] backdrop-blur-2xl p-10 rounded-[2rem] border border-white/10"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] ml-1">Nombre Artístico</p>
                    <input 
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full rounded-2xl text-white focus:outline-0 focus:ring-1 focus:ring-[#ecb613]/50 border border-white/10 bg-white/5 focus:border-[#ecb613] h-14 placeholder:text-white/10 px-6 text-base italic transition-all" 
                        placeholder="Ej: Chromatic Pulse" 
                        required
                    />
                </div>
                <div className="space-y-3">
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] ml-1">URL Única (Slug)</p>
                    <div className="relative flex items-center">
                        <span className="absolute left-6 text-white/20 text-sm">productoraear.com/a/</span>
                        <input 
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                            className="w-full rounded-2xl text-white focus:outline-0 focus:ring-1 focus:ring-[#ecb613]/50 border border-white/10 bg-white/5 focus:border-[#ecb613] h-14 placeholder:text-white/10 pl-48 pr-6 text-base italic transition-all" 
                            placeholder="chromatic-pulse" 
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] ml-1">Biografía Corta</p>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-2xl text-white focus:outline-0 focus:ring-1 focus:ring-[#ecb613]/50 border border-white/10 bg-white/5 focus:border-[#ecb613] h-32 placeholder:text-white/10 p-6 text-base italic transition-all resize-none" 
                    placeholder="Describe tu proyecto musical en pocas palabras..."
                />
            </div>
            
            <div className="space-y-3">
                <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] ml-1">Géneros Musicales</p>
                <input 
                    type="text"
                    value={genres}
                    onChange={(e) => setGenres(e.target.value)}
                    className="w-full rounded-2xl text-white focus:outline-0 focus:ring-1 focus:ring-[#ecb613]/50 border border-white/10 bg-white/5 focus:border-[#ecb613] h-14 placeholder:text-white/10 px-6 text-base italic transition-all" 
                    placeholder="Techno, Ambient, IDM (separados por coma)"
                />
            </div>

            {error && <p className="text-red-400 text-xs text-center font-bold">{error}</p>}
            {success && <p className="text-green-400 text-xs text-center font-bold">Perfil creado. Serás redirigido en breve...</p>}

            <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading || success || !user}
                className="w-full bg-[#ecb613] text-black font-black py-4 md:py-5 rounded-2xl text-[10px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.4em] mt-4 transition-all duration-500 shadow-[0_15px_40px_rgba(236,182,19,0.3)] flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Finalizar Creación"}
                {!loading && <Send size={16} />}
            </motion.button>
        </motion.form>
    );
};
