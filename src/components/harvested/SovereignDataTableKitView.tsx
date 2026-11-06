'use client';

import React, { useState } from 'react';
import {
  Table2,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle2,
  Phone,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { TARIFA_BASE_SOLISTA_EUR } from '@/lib/constants/ear-os-ssot';

interface VenueTableRow {
  id: string;
  name: string;
  province: string;
  capacityPax: number;
  splCertified: boolean;
  status: 'verificado' | 'pendiente';
  phoneMasked: string;
}

const SAMPLE_VENUES: VenueTableRow[] = [
  {
    id: 'v-1',
    name: 'Restaurante Ezkertza Berria',
    province: 'Bizkaia (Derio)',
    capacityPax: 200,
    splCertified: true,
    status: 'verificado',
    phoneMasked: '+34 693 *** ***',
  },
  {
    id: 'v-2',
    name: 'Restaurante Otzarreta',
    province: 'Gipuzkoa (Zarautz)',
    capacityPax: 150,
    splCertified: true,
    status: 'verificado',
    phoneMasked: '+34 693 *** ***',
  },
  {
    id: 'v-3',
    name: 'Finca Señorial Méntrida Hub',
    province: 'Toledo (Méntrida)',
    capacityPax: 300,
    splCertified: true,
    status: 'verificado',
    phoneMasked: '+34 693 *** ***',
  },
  {
    id: 'v-4',
    name: 'Jardines de la Cartuja',
    province: 'Madrid',
    capacityPax: 250,
    splCertified: true,
    status: 'verificado',
    phoneMasked: '+34 693 *** ***',
  },
];

export function SovereignDataTableKitView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'verificado'>('all');

  const filteredVenues = SAMPLE_VENUES.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.province.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || v.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white font-display">Catálogo de Fincas y Proveedores (Data Table)</h3>
          <p className="text-xs text-zinc-400 font-mono">Control de aforo, acústica Ley 37/2003 y peaje soberano anti-fuga</p>
        </div>

        {/* Buscador & Filtro */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por finca o provincia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-950">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-zinc-900/60 border-b border-white/5 text-zinc-400 uppercase text-[10px]">
            <tr>
              <th className="p-3.5">Finca / Espacio</th>
              <th className="p-3.5">Provincia</th>
              <th className="p-3.5 text-center">Aforo</th>
              <th className="p-3.5 text-center">Garantía Ley 37/2003</th>
              <th className="p-3.5 text-right">Contacto Soberano</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-zinc-300">
            {filteredVenues.map((row) => (
              <tr key={row.id} className="hover:bg-zinc-900/40 transition-colors">
                <td className="p-3.5 font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{row.name}</span>
                </td>
                <td className="p-3.5 text-zinc-400">{row.province}</td>
                <td className="p-3.5 text-center font-bold text-cyan-400">{row.capacityPax} pax</td>
                <td className="p-3.5 text-center">
                  <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" /> Homologada
                  </span>
                </td>
                <td className="p-3.5 text-right text-zinc-400">{row.phoneMasked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

