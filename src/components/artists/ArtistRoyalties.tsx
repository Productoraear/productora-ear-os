"use client";

import React from 'react';

const ArtistRoyalties = () => {
  const royalties = [
    { id: 1, event: "Boda Jesús y Cristina", date: "2025-05-28", amount: 1200, status: "Pagado" },
    { id: 2, event: "Solista Mariachi - Evento Corporativo", date: "2025-06-15", amount: 800, status: "Pendiente" },
    { id: 3, event: "Boda Pablo y Cristina", date: "2025-05-22", amount: 1500, status: "Pagado" },
  ];

  return (
    <div className="p-8 bg-black/80 text-white rounded-3xl border border-white/10 backdrop-blur-3xl shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Portal del Artista: Edwin Agudelo
          </h2>
          <p className="text-gray-400 mt-2">Gestión de Royalties, Contratos e Ingresos Propios</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all font-medium">
            Descargar Dossier
          </button>
          <button className="px-6 py-3 bg-blue-600 rounded-full hover:bg-blue-500 transition-all font-bold shadow-lg shadow-blue-600/20">
            Nueva Factura
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <span className="text-gray-400 block mb-2">Total Ingresos 2025</span>
          <span className="text-3xl font-bold text-green-400">3.500 €</span>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <span className="text-gray-400 block mb-2">Contratos Activos</span>
          <span className="text-3xl font-bold">12</span>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <span className="text-gray-400 block mb-2">Siguiente Pago</span>
          <span className="text-3xl font-bold text-blue-400">800 €</span>
        </div>
      </div>

      <div className="overflow-hidden border border-white/10 rounded-2xl bg-white/5">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4 font-semibold">Evento / Contrato</th>
              <th className="p-4 font-semibold">Fecha</th>
              <th className="p-4 font-semibold">Monto</th>
              <th className="p-4 font-semibold">Estado</th>
              <th className="p-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {royalties.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium">{item.event}</td>
                <td className="p-4 text-gray-300">{item.date}</td>
                <td className="p-4 font-bold">{item.amount} €</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.status === 'Pagado' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-blue-400 hover:text-blue-300 font-medium">Ver Contrato</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArtistRoyalties;
