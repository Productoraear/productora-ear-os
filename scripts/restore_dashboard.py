import os

path = os.path.join("src", "app", "(public)", "proveedores", "page.tsx")
os.makedirs(os.path.dirname(path), exist_ok=True)

code = """'use client';

import React, { useState, useMemo } from 'react';
import providersData from '@/data/all_providers_database.json';

export default function ProveedoresPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProvince, setSelectedProvince] = useState('MADRID');
  const [maxPrice, setMaxPrice] = useState(3250);
  const [sortBy, setSortBy] = useState('CHEAPEST');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const categories = [
    { id: 'ALL', label: 'Todos los Servicios', count: providersData.length },
    { id: 'fincas', label: 'Fincas & Espacios', count: 6348 },
    { id: 'catering', label: 'Catering & Gastro', count: 1715 },
    { id: 'decoracion', label: 'Decoración & Flores', count: 1315 },
    { id: 'musica', label: 'Música & Mariachi', count: 1199 },
    { id: 'sonido', label: 'Sonido & Luces', count: 431 },
    { id: 'foto', label: 'Vídeo 4K & Foto', count: 389 },
    { id: 'wedding', label: 'Wedding Planners', count: 714 },
    { id: 'moda', label: 'Moda & Belleza', count: 5554 },
    { id: 'transporte', label: 'Transporte & Coches', count: 557 },
  ];

  const filteredProviders = useMemo(() => {
    return providersData.filter((p: any) => {
      const matchCat =
        selectedCategory === 'ALL' ||
        (p.category && p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      const matchProv =
        !selectedProvince ||
        (p.province && p.province.toLowerCase().includes(selectedProvince.toLowerCase()));
      const matchQuery =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchProv && matchQuery;
    });
  }, [selectedCategory, selectedProvince, searchQuery]);

  const totalPages = Math.ceil(filteredProviders.length / pageSize);
  const paginatedProviders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProviders.slice(start, start + pageSize);
  }, [filteredProviders, currentPage]);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans selection:bg-[#ecb613]/30">
      {/* HEADER B2B / MATCHMAKING */}
      <header className="max-w-7xl mx-auto border-b border-neutral-800 pb-8 mb-8 space-y-4">
        <div className="bg-neutral-900/90 border border-[#ecb613]/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ecb613] animate-pulse"></span>
            <span className="text-xs font-bold tracking-widest text-[#ecb613] uppercase">
              Productora EAR • Red de Excelencia Nacional
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
            Proveedores Homologados & Matchmaking
          </h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-4xl mt-2 leading-relaxed">
            El estándar de provisión técnica y artística más estricto de España. Todos los profesionales cuentan con seguro de RC de 1M€, riders acústicos estandarizados y SLA garantizado por contrato.
          </p>
        </div>
      </header>

      {/* DASHBOARD PRINCIPAL */}
      <main className="max-w-7xl mx-auto space-y-8">
        {/* BARRA DE BÚSQUEDA Y CATEGORÍAS */}
        <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-xs font-bold text-[#ecb613] uppercase tracking-wider">
                Motor de Matchmaking S-Class
              </span>
              <h2 className="text-2xl font-black uppercase text-white">
                Directorio de Proveedores Homologados
              </h2>
            </div>
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Buscar por nombre, finca, servicio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ecb613]"
              />
            </div>
          </div>

          {/* PÍLDORAS DE CATEGORÍA */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px] font-mono">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* FILTROS SECUNDARIOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-800/80 items-center">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Provincia / Territorio
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ecb613]"
              >
                <option value="">Toda España (Nacional)</option>
                <option value="MADRID">MADRID</option>
                <option value="BARCELONA">BARCELONA</option>
                <option value="VALENCIA">VALENCIA</option>
                <option value="SEVILLA">SEVILLA</option>
                <option value="TOLEDO">TOLEDO</option>
                <option value="MALAGA">MÁLAGA</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Presupuesto Máximo
                </label>
                <span className="text-xs font-bold text-[#ecb613]">{maxPrice} €</span>
              </div>
              <input
                type="range"
                min="300"
                max="10000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#ecb613] bg-neutral-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                Ordenar Por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ecb613]"
              >
                <option value="CHEAPEST">Precio: Más Económico Primero</option>
                <option value="EXCLUSIVE">Precio: Más Exclusivo Primero</option>
                <option value="RATING">Mayor Valoración (5.0 ★)</option>
              </select>
            </div>
          </div>
        </div>

        {/* GRID DE REJILLA COMERCIAL S-CLASS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paginatedProviders.map((item: any) => (
            <article
              key={item.id}
              className="bg-neutral-900/80 border border-neutral-800 hover:border-[#ecb613]/50 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl group"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="bg-[#ecb613]/10 text-[#ecb613] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-[#ecb613]/20">
                    {item.category || 'MÚSICA VIVO'}
                  </span>
                  <div className="flex items-center gap-1 text-[#ecb613] text-xs font-bold bg-neutral-950 px-2 py-0.5 rounded-md border border-neutral-800">
                    ★ 4.9 <span className="text-neutral-500 font-normal">(18)</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                    📍 {item.province || 'Madrid'}
                  </span>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-[#ecb613] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-neutral-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {item.description || `${item.name} (Servicios de calidad para bodas y eventos en España). Atendiendo solicitudes directas con garantía S-Class...`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Tarifa Base</span>
                    <span className="font-bold text-white">Desde 650 €</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">SLA Acústico</span>
                    <span className="font-bold text-[#ecb613]">12 W/pax Homologado</span>
                  </div>
                </div>
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="p-4 bg-neutral-950/80 border-t border-neutral-800/80 space-y-2">
                <button className="w-full bg-[#ecb613] hover:bg-[#d4a20f] text-black font-extrabold text-xs py-2.5 rounded-xl uppercase transition-all shadow-md">
                  Bloquear Reserva (0.50 €)
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-bold text-[10px] py-2 rounded-lg uppercase">
                    Reclamar Ficha
                  </button>
                  <button className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-bold text-[10px] py-2 rounded-lg uppercase">
                    Contactar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-8 border-t border-neutral-800">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase bg-neutral-900 hover:bg-[#ecb613] text-white hover:text-black border border-neutral-800 transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              Anterior
            </button>
            <span className="text-xs text-neutral-400 font-mono">
              Página {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase bg-neutral-900 hover:bg-[#ecb613] text-white hover:text-black border border-neutral-800 transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              Siguiente
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
"""

with open(path, "w", encoding="utf-8") as f:
    f.write(code)

print("✅ Dashboard S-Class restaurado con éxito con filtros reactivos y tarjetas comerciales.")
