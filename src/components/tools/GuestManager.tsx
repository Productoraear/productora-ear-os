"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Mail, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Download
} from 'lucide-react';

const MOCK_GUESTS = [
  { id: 1, name: 'Juan Carlos Pérez', group: 'Familia Novio', status: 'confirmed', diet: 'Ninguna', table: 'Mesa 4' },
  { id: 2, name: 'María Gómez', group: 'Amigos Universidad', status: 'pending', diet: 'Vegana', table: 'Unassigned' },
  { id: 3, name: 'Luis Martínez', group: 'Familia Novia', status: 'declined', diet: 'Ninguna', table: 'Unassigned' },
  { id: 4, name: 'Ana Torres', group: 'Trabajo', status: 'confirmed', diet: 'Celíaca', table: 'Mesa 12' },
];

export const GuestManager = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="w-full bg-[#050505] min-h-screen text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 pb-8 border-b border-white/5">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Gestor de <span className="italic font-serif text-[#d4af37] font-normal">Invitados</span>
            </h1>
            <p className="text-zinc-500 max-w-lg">
              Sistema de control maestro de asistencia, alergias alimentarias y métricas de confirmación en tiempo real.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl flex items-center gap-2 transition-all">
              <Download className="w-4 h-4" /> Exportar
            </button>
            <button className="bg-[#d4af37] hover:bg-[#f0c541] text-black font-black uppercase tracking-widest text-xs px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <UserPlus className="w-4 h-4" /> Añadir Invitado
            </button>
          </div>
        </div>

        {/* METRICS & HUD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">Total Misión</div>
            <div className="text-4xl font-mono font-black text-white">245</div>
            <div className="flex items-center gap-2 mt-4 text-[10px] text-zinc-400">
              <Users className="w-3 h-3 text-[#d4af37]" /> Objetivo Operativo
            </div>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-2">Confirmados</div>
            <div className="text-4xl font-mono font-black text-emerald-400">142</div>
            <div className="flex items-center gap-2 mt-4 text-[10px] text-zinc-400">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> 58% Completado
            </div>
          </div>
          <div className="bg-amber-900/20 border border-amber-500/20 rounded-2xl p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-2">Pendientes</div>
            <div className="text-4xl font-mono font-black text-amber-400">89</div>
            <div className="flex items-center gap-2 mt-4 text-[10px] text-zinc-400">
              <Clock className="w-3 h-3 text-amber-500" /> Requiere seguimiento
            </div>
          </div>
          <div className="bg-rose-900/20 border border-rose-500/20 rounded-2xl p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-2">Declinados</div>
            <div className="text-4xl font-mono font-black text-rose-400">14</div>
            <div className="flex items-center gap-2 mt-4 text-[10px] text-zinc-400">
              <AlertCircle className="w-3 h-3 text-rose-500" /> Bajas confirmadas
            </div>
          </div>
        </div>

        {/* DATA TABLE COMMAND CENTER */}
        <div className="bg-zinc-900/20 border border-white/5 rounded-[2rem] overflow-hidden">
          {/* Tools Bar */}
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between bg-black/50">
            <div className="flex items-center bg-black border border-white/10 rounded-xl px-4 py-2 w-full md:w-96 group focus-within:border-[#d4af37] transition-colors">
              <Search className="w-4 h-4 text-zinc-500 mr-2" />
              <input 
                type="text" 
                placeholder="Buscar por nombre, grupo..." 
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors">
                <Filter className="w-4 h-4" /> Filtros
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors">
                <Mail className="w-4 h-4" /> Enviar Invitaciones
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/80 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  <th className="px-6 py-4">Nombre Completo</th>
                  <th className="px-6 py-4">Grupo Táctico</th>
                  <th className="px-6 py-4">Estado (Status)</th>
                  <th className="px-6 py-4">Dietética</th>
                  <th className="px-6 py-4">Ubicación (Mesa)</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_GUESTS.map((guest, idx) => (
                  <tr key={guest.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-bold">{guest.name}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{guest.group}</td>
                    <td className="px-6 py-4">
                      {guest.status === 'confirmed' && <span className="text-[10px] uppercase font-black tracking-widest bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded border border-emerald-500/20">Confirmado</span>}
                      {guest.status === 'pending' && <span className="text-[10px] uppercase font-black tracking-widest bg-amber-500/10 text-amber-400 px-3 py-1 rounded border border-amber-500/20">Pendiente</span>}
                      {guest.status === 'declined' && <span className="text-[10px] uppercase font-black tracking-widest bg-rose-500/10 text-rose-400 px-3 py-1 rounded border border-rose-500/20">Declinado</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      <span className={guest.diet !== 'Ninguna' ? 'text-rose-400 flex items-center gap-1' : ''}>
                        {guest.diet !== 'Ninguna' && <AlertCircle className="w-3 h-3" />} {guest.diet}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {guest.table === 'Unassigned' ? (
                        <span className="text-zinc-500 italic">No asignada</span>
                      ) : (
                        <span className="text-[#d4af37] font-bold">{guest.table}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-zinc-500 hover:text-[#d4af37] opacity-0 group-hover:opacity-100 transition-all">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination/Summary */}
          <div className="p-6 bg-black/50 text-xs text-zinc-500 font-bold uppercase tracking-widest text-center border-t border-white/5">
            Mostrando 4 de 245 Registros // EAR OS Logistics Sync: ACTIVATED
          </div>
        </div>

      </div>
    </div>
  );
};

export default GuestManager;
