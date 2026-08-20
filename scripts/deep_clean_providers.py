import os
import json
import re

print("🚀 INICIANDO SANEAMIENTO Y RECLASIFICACIÓN RIGUROSA S-CLASS...")

base_dir = r"H:\EAR_OS_V2"
db_path = os.path.join(base_dir, "EAR_OS_V2", "src", "data", "all_providers_database.json")

if not os.path.exists(db_path):
    print("❌ Base de datos no encontrada.")
    exit()

with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

# Palabras clave prohibidas (basura de scraping/carpetas)
system_trash = [
    'javascript', 'caos', 'original_textos', 'documentos_bodasnet', 'proyectos_y_código',
    'safari', 'google play', 'cookiepedia', '7z format', 'agenda de tareas', 'privacidad',
    'borrar el historial', 'información sobre', 'http', 'www', 'index', 'default', 'php',
    's-class', 'provincias', 'tarifa', 'archivo base'
]

def clean_text(txt):
    return str(txt).strip()

def detect_real_category(name, old_cat):
    combined = f"{name} {old_cat}".lower()
    if any(k in combined for k in ['finca', 'espacio', 'masia', 'pazo', 'cortijo', 'castillo', 'hotel', 'salon', 'cigarral', 'jardin']):
        return 'finca'
    if any(k in combined for k in ['catering', 'gastro', 'banquete', 'comida', 'cocktail', 'cortador', 'cortadores', 'menu']):
        return 'catering'
    if any(k in combined for k in ['flor', 'decorac', 'carpa', 'mobiliario', 'iluminac', 'ambientac']):
        return 'decoracion'
    if any(k in combined for k in ['musi', 'mariachi', 'banda', 'dj', 'tenor', 'viol', 'saxo', 'grupo', 'coro', 'duo', 'cantante', 'acustico']):
        return 'musica'
    if any(k in combined for k in ['sonido', 'luces', 'altavoces', 'escenario', 'equipo']):
        return 'sonido'
    if any(k in combined for k in ['foto', 'video', 'fotografo', 'videografo', 'reportaje', 'album', 'photocall']):
        return 'foto'
    if any(k in combined for k in ['wedding', 'planner', 'organiza', 'coordinac']):
        return 'wedding'
    if any(k in combined for k in ['moda', 'belleza', 'vestido', 'novia', 'novio', 'traje', 'joya', 'maquillaje', 'peinado', 'zapato', 'complemento', 'tocado']):
        return 'moda'
    if any(k in combined for k in ['transporte', 'coche', 'autobus', 'limusina', 'vehiculo', 'clasico']):
        return 'transporte'
    return 'servicios'

clean_list = []
dedup_set = set()

for p in providers:
    raw_name = clean_text(p.get('name', ''))
    
    # 1. Filtro Anti-Basura
    if any(trash in raw_name.lower() for trash in system_trash):
        continue
    if len(raw_name) < 3 or raw_name.startswith('10_') or raw_name.startswith('04.') or raw_name.startswith('76.'):
        continue
    if re.match(r'^[0-9_\-\.\(\)]+$', raw_name):
        continue

    # 2. Deduplicación por nombre limpio
    norm_key = re.sub(r'\W+', '', raw_name.lower())
    if norm_key in dedup_set:
        continue
    dedup_set.add(norm_key)

    # 3. Asignación de Categoría Real
    real_cat = detect_real_category(raw_name, p.get('category', ''))
    p['name'] = raw_name
    p['category'] = real_cat
    p['province'] = p.get('province') or 'madrid'
    
    clean_list.append(p)

print(f"✅ SANEAMIENTO COMPLETADO.")
print(f"📊 Registros Basura Eliminados: {len(providers) - len(clean_list)}")
print(f"⭐ Proveedores Comerciales Reales Finales: {len(clean_list)}")

# Guardar base limpia
with open(db_path, "w", encoding="utf-8") as f:
    json.dump(clean_list, f, ensure_ascii=False, indent=2)

# Actualizar el frontend con los nuevos contadores reales
page_path = os.path.join(base_dir, "EAR_OS_V2", "src", "app", "(public)", "proveedores", "page.tsx")

code = """'use client';

import React, { useState, useMemo } from 'react';
import providersData from '@/data/all_providers_database.json';

export default function ProveedoresPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const getCount = (catKey: string) => {
    if (catKey === 'ALL') return providersData.length;
    return providersData.filter((p: any) => 
      p.category && p.category.toLowerCase() === catKey.toLowerCase()
    ).length;
  };

  const categories = [
    { id: 'ALL', label: 'Todos los Servicios', count: getCount('ALL') },
    { id: 'finca', label: 'Fincas & Espacios', count: getCount('finca') },
    { id: 'catering', label: 'Catering & Gastro', count: getCount('catering') },
    { id: 'decoracion', label: 'Decoración & Flores', count: getCount('decoracion') },
    { id: 'musica', label: 'Música & Mariachi', count: getCount('musica') },
    { id: 'sonido', label: 'Sonido & Luces', count: getCount('sonido') },
    { id: 'foto', label: 'Vídeo 4K & Foto', count: getCount('foto') },
    { id: 'wedding', label: 'Wedding Planners', count: getCount('wedding') },
    { id: 'moda', label: 'Moda & Belleza', count: getCount('moda') },
    { id: 'transporte', label: 'Transporte & Coches', count: getCount('transporte') },
  ];

  const filteredProviders = useMemo(() => {
    return providersData.filter((p: any) => {
      const matchCat =
        selectedCategory === 'ALL' ||
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
      const matchProv =
        !selectedProvince ||
        (p.province && p.province.toLowerCase().includes(selectedProvince.toLowerCase()));
      const matchQuery =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase());
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
      <header className="max-w-7xl mx-auto border-b border-neutral-800 pb-8 mb-8 space-y-4">
        <div className="bg-neutral-900/90 border border-[#ecb613]/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
          <span className="text-xs font-bold tracking-widest text-[#ecb613] uppercase block mb-1">
            Productora EAR • Red de Excelencia Nacional
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
            Proveedores Homologados & Matchmaking
          </h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-4xl mt-2">
            El estándar de provisión técnica y artística más estricto de España.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-2xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-xs font-bold text-[#ecb613] uppercase tracking-wider block">
                Motor de Matchmaking S-Class
              </span>
              <h2 className="text-2xl font-black uppercase text-white">
                Directorio de Proveedores Homologados
              </h2>
            </div>
            <input
              type="text"
              placeholder="Buscar proveedor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ecb613]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-[#ecb613] text-black'
                    : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px] font-mono">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* GRID LIMPIO S-CLASS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paginatedProviders.map((item: any) => (
            <article
              key={item.id}
              className="bg-neutral-900/90 border border-neutral-800 hover:border-[#ecb613]/50 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl group"
            >
              <div className="relative h-52 w-full overflow-hidden bg-neutral-950">
                <img
                  src={item.img || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-bold text-[#ecb613] uppercase tracking-wider">
                  {item.category ? item.category.toUpperCase() : 'SERVICIOS'}
                </div>
                <div className="absolute top-3 right-3 bg-[#10b981]/90 text-black px-2.5 py-1 rounded-md text-[10px] font-black flex items-center gap-1">
                  ★ 4.9 <span className="text-black/70 font-bold">(18)</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-neutral-300">
                  📍 {item.province ? item.province.toUpperCase() : 'MADRID'}
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-[#ecb613] transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-neutral-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {item.description || `${item.name} (Servicios profesionales homologados). Contratación directa Productora EAR.`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-800/80 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Tarifa Base</span>
                    <span className="font-bold text-white">Desde {item.basePrice || 650} €</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">SLA Acústico</span>
                    <span className="font-bold text-[#10b981]">{item.sla || '12 W/pax Homologado'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-950 border-t border-neutral-800 space-y-2">
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

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-8 border-t border-neutral-800">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase bg-neutral-900 hover:bg-[#ecb613] text-white hover:text-black border border-neutral-800 transition-all disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-xs text-neutral-400 font-mono">
              Página {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase bg-neutral-900 hover:bg-[#ecb613] text-white hover:text-black border border-neutral-800 transition-all disabled:opacity-40"
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

with open(page_path, "w", encoding="utf-8") as f:
    f.write(code)

print("✅ Dashboard reconfigurado con categorización exacta y eliminación de basura de carpetas.")
