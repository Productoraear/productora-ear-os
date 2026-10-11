"use client";

import React, { useState } from 'react';
import { RefreshCw, Trash2, Edit2, CheckCircle2, XCircle, ShieldCheck, Search, Plus } from 'lucide-react';
import { updateProviderAction, deleteProviderAction, createProviderAction } from '@/app/actions/admin-providers';

interface ProviderItem {
  id: string;
  name: string;
  category: string;
  province: string;
  telephone?: string | null;
  status: string;
}

interface ProvidersAdminTableProps {
  providers: ProviderItem[];
  onRefresh: () => void;
}

export function ProvidersAdminTable({ providers, onRefresh }: ProvidersAdminTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [editingProvider, setEditingProvider] = useState<ProviderItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'finca',
    province: 'Madrid',
    telephone: '',
    status: 'GHOST_UNCLAIMED'
  });

  const filteredProviders = providers.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este proveedor S-Class de la base de datos?")) return;
    setLoadingId(id);
    try {
      await deleteProviderAction(id);
      onRefresh();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleHomologate = async (id: string, currentStatus: string) => {
    setLoadingId(id);
    try {
      const newStatus = currentStatus === 'GHOST_UNCLAIMED' ? 'VERIFIED_ACTIVE' : 'GHOST_UNCLAIMED';
      await updateProviderAction(id, { status: newStatus });
      onRefresh();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleSave = async () => {
    if (!formData.name) return alert("Nombre es requerido");
    try {
      if (isCreating) {
        await createProviderAction(formData);
      } else if (editingProvider) {
        await updateProviderAction(editingProvider.id, formData);
      }
      setIsCreating(false);
      setEditingProvider(null);
      onRefresh();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const openEdit = (p: ProviderItem) => {
    setFormData({
      name: p.name,
      category: p.category,
      province: p.province,
      telephone: p.telephone || '',
      status: p.status
    });
    setEditingProvider(p);
  };

  const openCreate = () => {
    setFormData({
      name: '',
      category: 'finca',
      province: 'Madrid',
      telephone: '',
      status: 'VERIFIED_ACTIVE'
    });
    setIsCreating(true);
  };

  return (
    <div className="space-y-4 font-sans w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-950/60 p-4 rounded-2xl border border-white/10">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o categoría..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#ecb613]"
          />
        </div>
        <button 
          onClick={openCreate}
          className="w-full sm:w-auto px-4 py-2 bg-[#ecb613] hover:bg-amber-400 text-black font-bold text-xs font-mono uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(236,182,19,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Añadir Proveedor
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#09090d]/80 backdrop-blur-md">
        <table className="w-full text-left text-xs font-mono whitespace-nowrap">
          <thead className="bg-zinc-900/50">
            <tr>
              <th className="px-4 py-3 text-zinc-400 font-medium">Proveedor</th>
              <th className="px-4 py-3 text-zinc-400 font-medium">Categoría</th>
              <th className="px-4 py-3 text-zinc-400 font-medium">Contacto</th>
              <th className="px-4 py-3 text-zinc-400 font-medium">Estado</th>
              <th className="px-4 py-3 text-right text-zinc-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/50">
            {filteredProviders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-zinc-500">
                  No hay proveedores que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              filteredProviders.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-white max-w-[200px] truncate">{p.name}</div>
                    <div className="text-[10px] text-zinc-500">{p.id.split('-')[0] || p.id}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px]">
                      {p.category.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-zinc-300">{p.province}</div>
                    <div className="text-[10px] text-zinc-500">{p.telephone || 'Sin teléfono'}</div>
                  </td>
                  <td className="px-4 py-3">
                    {p.status === 'VERIFIED_ACTIVE' ? (
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> ACTIVO
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px]">
                        <XCircle className="w-3 h-3" /> GHOST
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleHomologate(p.id, p.status)}
                      disabled={loadingId === p.id}
                      className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      title={p.status === 'VERIFIED_ACTIVE' ? 'Quitar Homologación' : 'Homologar Proveedor'}
                    >
                      <ShieldCheck className={`w-4 h-4 ${loadingId === p.id ? 'animate-pulse' : ''}`} />
                    </button>
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={loadingId === p.id}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className={`w-4 h-4 ${loadingId === p.id ? 'animate-pulse' : ''}`} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE EDICIÓN/CREACIÓN */}
      {(isCreating || editingProvider) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#050508] border border-[#ecb613]/40 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-white space-y-4">
            <h2 className="text-xl font-bold font-syne uppercase text-[#ecb613]">
              {isCreating ? 'NUEVO PROVEEDOR' : 'EDITAR PROVEEDOR'}
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-[#ecb613]"
                  >
                    <option value="finca">Finca</option>
                    <option value="musica">Música</option>
                    <option value="sonido">Sonido</option>
                    <option value="catering">Catering</option>
                    <option value="foto">Foto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Provincia</label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={e => setFormData({ ...formData, province: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-[#ecb613]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formData.telephone}
                  onChange={e => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => { setIsCreating(false); setEditingProvider(null); }}
                className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white font-mono text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-[#ecb613] text-black font-bold font-mono text-xs hover:bg-[#d8a510] transition-colors"
              >
                Guardar Proveedor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
