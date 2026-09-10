"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, Search, Filter, ArrowLeft, ShieldCheck, 
  Activity, Star, TrendingUp, AlertTriangle, ChevronRight
} from 'lucide-react';

export default function EmbajadoresAgenciasPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Algoritmo simulado de scoring y tiers
  const partners = [
    { id: 'P-001', name: 'Finca Histórica Méntrida', type: 'Finca Fundadora', tier: 'S-Class (10%)', score: 98, leads: 45, conversion: '22%', status: 'Activo' },
    { id: 'P-002', name: 'Atelier Bodas Madrid VIP', type: 'Wedding Planner', tier: 'Tier 1 (8%)', score: 85, leads: 12, conversion: '15%', status: 'Activo' },
    { id: 'P-003', name: 'Global Events B2B', type: 'Agencia', tier: 'Tier 2 (5%)', score: 62, leads: 8, conversion: '5%', status: 'Riesgo Churn' },
    { id: 'P-004', name: 'Palacio Villafiel', type: 'Finca Fundadora', tier: 'S-Class (10%)', score: 94, leads: 30, conversion: '18%', status: 'Activo' },
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-[#fcfbf9] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabecera */}
        <header className="flex justify-between items-center border-b border-[#1f1f1f] pb-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 hover:text-[#8e44ad] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Centro de Mando
          </Link>
          <div className="flex items-center gap-2 bg-[#121212] border border-[#222] px-3 py-1 rounded-lg text-xs text-[#8e44ad]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#27ae60]" /> Algoritmo de Tiers Activo
          </div>
        </header>

        {/* Título de Sección */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8e44ad] bg-[#8e44ad]/10 px-3 py-1 rounded-full mb-3">
              <Users className="w-3.5 h-3.5" /> Ecosistema de Afiliados
            </div>
            <h1 className="text-3xl font-black text-white">Embajadores & Agencias</h1>
            <p className="text-gray-400 text-sm mt-1">Gobernanza algorítmica de prescriptores, scoring de conversión y control de Tiers.</p>
          </div>
          <button className="bg-[#8e44ad] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#732d91] transition-colors">
            + Alta Nuevo Prescriptor
          </button>
        </div>

        {/* Buscador y Filtros Inteligentes */}
        <div className="flex gap-3 items-center bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, CIF o zona de influencia..." 
              className="w-full bg-[#121212] border border-[#222] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#8e44ad]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-[#121212] border border-[#222] p-2 rounded-lg text-gray-400 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Tabla Algorítmica de Partners */}
        <div className="bg-[#080808] border border-[#1f1f1f] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0c0c0c] border-b border-[#1f1f1f] text-gray-500 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="px-6 py-4">ID / Nombre del Partner</th>
                <th className="px-6 py-4">Tipología</th>
                <th className="px-6 py-4">Tier Asignado</th>
                <th className="px-6 py-4">Health Score (IA)</th>
                <th className="px-6 py-4">Conversión</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]">
              {partners.map((p) => (
                <tr key={p.id} className="hover:bg-[#111] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm">{p.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">{p.id}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{p.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${p.tier.includes('S-Class') ? 'bg-[#d4ac0d]/10 text-[#d4ac0d] border-[#d4ac0d]/30' : 'bg-[#1a1a1a] text-gray-300 border-[#333]'}`}>
                      {p.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden max-w-[80px]">
                        <div className={`h-full ${p.score > 80 ? 'bg-emerald-500' : p.score > 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${p.score}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">{p.score}/100</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-300">
                    {p.conversion} <span className="text-[9px] text-gray-600">({p.leads} leads)</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-[#8e44ad] transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
