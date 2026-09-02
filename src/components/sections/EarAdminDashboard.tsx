import React from 'react';
import { motion } from 'framer-motion';

interface EarAdminDashboardProps {
  stats: {
    revenue: string;
    growth: number;
    bookings: string;
    target: string;
  };
  artists: {
    name: string;
    city: string;
    country: string;
    status: string;
    tier: string;
    revenue: string;
  }[];
}

const EarAdminDashboard = ({ stats, artists }: EarAdminDashboardProps) => {
  return (
    <div className="p-6 bg-[#1a1510] text-white">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#231d16] p-4 rounded-xl border border-yellow-900/30">
          <span className="text-gray-400 text-sm">TOTAL REVENUE</span>
          <h3 className="text-3xl font-bold text-green-400 mt-2">{stats.revenue}</h3>
          <span className="text-xs text-green-600 flex items-center gap-1">
            ↑ +{stats.growth}% <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14m-7-7v14m-9-3l9 9 9-9" strokeWidth="2"/></svg>
          </span>
        </div>
        <div className="bg-[#231d16] p-4 rounded-xl border border-yellow-900/30">
          <span className="text-gray-400 text-sm">BOOKINGS (MTD)</span>
          <h3 className="text-3xl font-bold text-yellow-500 mt-2">{stats.bookings}</h3>
          <span className="text-xs text-gray-500">Target: {stats.target}</span>
        </div>
      </div>

      {/* Tabla de Artistas */}
      <div className="bg-[#1e1a12] rounded-xl border border-yellow-900/30 overflow-hidden">
        <div className="p-4 border-b border-gray-800 bg-[#231d16] flex justify-between items-center">
          <span className="font-bold text-yellow-500">GESTIÓN DE ARTISTAS</span>
          <button className="text-xs text-blue-400 hover:text-blue-300">VER TODOS &gt;</button>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-[#1a1510] text-gray-400 text-xs uppercase">
            <tr>
              <th className="p-3">Artista</th>
              <th className="p-3">Status</th>
              <th className="p-3">Tier</th>
              <th className="p-3 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist, i) => (
              <tr key={i} className="border-b border-gray-800/50 last:border-none">
                <td className="p-3">
                  <div className="font-bold text-white">{artist.name}</div>
                  <div className="text-xs text-gray-400">{artist.city}, {artist.country}</div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    artist.status === 'CERTIFIED' ? 'bg-green-900/40 text-green-400' : 
                    'bg-orange-900/40 text-orange-400'
                  }`}>
                    {artist.status}
                  </span>
                </td>
                <td className="p-3 text-gray-400">{artist.tier}</td>
                <td className="p-3 text-right font-mono text-yellow-500">{artist.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EarAdminDashboard;
