'use client';

import React, { useState } from 'react';

export default function NeuralJourneyPage() {
  const [deposit, setDeposit] = useState<number>(0);
  const [artists, setArtists] = useState<Array<any>>([]);
  const [logistica, setLogistica] = useState<{
    necesitaTransporte?: boolean;
    necesitaHospedaje?: boolean;
    detalles?: string;
    [key: string]: any;
  }>({});

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Neural Journey</h1>
        <section className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Depósito / Reserva:</label>
            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              className="bg-slate-800 text-white p-2 rounded border border-slate-700"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Artistas Seleccionados ({artists.length})</h2>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Logística</h2>
          </div>
        </section>
      </main>
    </div>
  );
}
