'use client';
import React, { useMemo } from 'react';
import { rankArtist } from '@/lib/astra-intelligence';
import VerifiedBadge from '@/app/components/ui/VerifiedBadge';
import Link from 'next/link';

// Mock de datos de artistas (En fase Beta esto vendrá de Supabase/AuraWallet)
const ARTIST_DIRECTORY = [
  {
    id: "edwin-agudelo",
    name: "Edwin Agudelo",
    specialty: "Mariachi Solista Premium",
    metrics: {
      artistId: "edwin-agudelo",
      isVerified: true, // Smoke Test 1€ OK
      totalTransactions: 1,
      totalRevenue: 350,
      clicks: 120,
      conversionRate: 0.08
    }
  },
  {
    id: "mariachi-standard",
    name: "Mariachi Genérico",
    specialty: "Música Mexicana",
    metrics: {
      artistId: "mariachi-standard",
      isVerified: false,
      totalTransactions: 0,
      totalRevenue: 0,
      clicks: 45,
      conversionRate: 0
    }
  }
];

export default function Home() {
  // Astra AI Ranking Logic
  const sortedArtists = useMemo(() => {
    return [...ARTIST_DIRECTORY].sort((a, b) => 
      rankArtist(b.metrics.artistId) - rankArtist(a.metrics.artistId)
    );
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section Vanguardista */}
      <section className="py-20 px-6 border-b border-zinc-900 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 uppercase">
            Dominancia Artística S-Class
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Reserva directa con los mejores artistas de España. Precios calculados por IA, contratos instantáneos.
          </p>
        </div>
      </section>

      {/* Featured Artists (Astra AI Powered) */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-12 flex items-center gap-3">
          <span className="w-2 h-8 bg-green-500 rounded-full"></span>
          Artistas Destacados (Ranking Astra AI)
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {sortedArtists.map((artist) => {
            const score = rankArtist(artist.metrics.artistId);
            return (
              <div key={artist.id} className="group bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-green-500/50 transition-all shadow-2xl relative overflow-hidden">
                {/* Badge de Verificación Atómica */}
                {artist.metrics.isVerified && (
                  <div className="absolute top-4 right-4 scale-125">
                    <VerifiedBadge />
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-3xl font-bold mb-2 group-hover:text-green-400 transition-colors">{artist.name}</h3>
                  <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">{artist.specialty}</p>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800 pt-6">
                  <div className="text-sm font-mono text-zinc-400">
                    DOMINANCE SCORE: <span className="text-green-500">{score.toFixed(0)}</span>
                  </div>
                  <Link 
                    href={`/servicios/mariachis/madrid/bodas`} // Ruta dinámica de la matriz
                    className="bg-green-600 hover:bg-green-500 text-black font-bold px-6 py-2 rounded-full text-sm transition-transform active:scale-95"
                  >
                    RESERVAR AHORA
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}