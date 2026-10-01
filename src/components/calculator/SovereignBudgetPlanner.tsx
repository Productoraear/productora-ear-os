'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Calculator,
  Lock,
  Unlock,
  AlertTriangle,
  Sparkles,
  Download,
  Share2,
  Printer,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  DollarSign,
  Users,
  Building2,
  Music,
  Camera,
  Heart,
  Car,
  Gift,
  Palette,
  Gem,
  Smile,
  Plane,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Clock,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import Link from 'next/link';

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  isLocked: boolean;
  iconName: string;
  benchmarkMinPerPax?: number; // Para banquete, catering, etc.
  benchmarkMinFixed?: number; // Para solista, foto, etc.
  description: string;
}

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  {
    id: 'banquete',
    name: 'Banquete & Espacio (Finca + Menú)',
    allocated: 0,
    isLocked: false,
    iconName: 'Building2',
    benchmarkMinPerPax: 85,
    benchmarkMinFixed: 2500,
    description: 'Alquiler del recinto, cóctel de bienvenida, menú nupcial y barra libre.'
  },
  {
    id: 'musica',
    name: 'Música en Directo & Shows',
    allocated: 0,
    isLocked: false,
    iconName: 'Music',
    benchmarkMinFixed: 350,
    description: 'Solista lírico (Edwin Agudelo), Mariachi de gala, DJ y sonorización Bose F1.'
  },
  {
    id: 'foto_video',
    name: 'Fotografía & Vídeo',
    allocated: 0,
    isLocked: false,
    iconName: 'Camera',
    benchmarkMinFixed: 900,
    description: 'Reportaje completo, tomas con dron, preboda y álbum digital masterizado.'
  },
  {
    id: 'flores_decoracion',
    name: 'Flores & Decoración',
    allocated: 0,
    isLocked: false,
    iconName: 'Palette',
    benchmarkMinFixed: 500,
    description: 'Ramo de novia, arco de ceremonia, centros de mesa e iluminación ambiente.'
  },
  {
    id: 'ceremonia',
    name: 'Ceremonia & Protocolo',
    allocated: 0,
    isLocked: false,
    iconName: 'Heart',
    benchmarkMinFixed: 200,
    description: 'Tasas municipales/parroquiales, maestro de ceremonias y alfombra de gala.'
  },
  {
    id: 'novia',
    name: 'Novia & Complementos',
    allocated: 0,
    isLocked: false,
    iconName: 'Sparkles',
    benchmarkMinFixed: 1200,
    description: 'Vestido nupcial, velo, calzado artesanal y joyería de gala.'
  },
  {
    id: 'novio',
    name: 'Novio & Complementos',
    allocated: 0,
    isLocked: false,
    iconName: 'Sparkles',
    benchmarkMinFixed: 600,
    description: 'Traje de ceremonia, chaqué, calzado y accesorios.'
  },
  {
    id: 'transporte',
    name: 'Transporte & Autobuses',
    allocated: 0,
    isLocked: false,
    iconName: 'Car',
    benchmarkMinFixed: 400,
    description: 'Flota de autobuses para invitados y coche clásico o nupcial.'
  },
  {
    id: 'invitaciones',
    name: 'Invitaciones & Papelería',
    allocated: 0,
    isLocked: false,
    iconName: 'Gift',
    benchmarkMinFixed: 150,
    description: 'Diseño gráfico, caligrafía, minutas del banquete y web nupcial.'
  },
  {
    id: 'detalles',
    name: 'Detalles para Invitados',
    allocated: 0,
    isLocked: false,
    iconName: 'Gift',
    benchmarkMinPerPax: 3,
    description: 'Regalos conmemorativos, seating plan y recuerdos solidarios.'
  },
  {
    id: 'joyeria',
    name: 'Joyería & Alianzas',
    allocated: 0,
    isLocked: false,
    iconName: 'Gem',
    benchmarkMinFixed: 350,
    description: 'Alianzas de oro, arras y grabado conmemorativo.'
  },
  {
    id: 'belleza',
    name: 'Belleza & Salud',
    allocated: 0,
    isLocked: false,
    iconName: 'Smile',
    benchmarkMinFixed: 250,
    description: 'Peluquería, maquillaje profesional, pruebas previas y spa.'
  },
  {
    id: 'luna_miel',
    name: 'Viaje de Novios (Luna de Miel)',
    allocated: 0,
    isLocked: false,
    iconName: 'Plane',
    benchmarkMinFixed: 2000,
    description: 'Vuelos, estancia y experiencias exclusivas.'
  }
];

export default function SovereignBudgetPlanner() {
  // Estado inicial limpio partiendo de 0 € (mandato expreso del CEO)
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [paxCount, setPaxCount] = useState<number>(100);
  const [province, setProvince] = useState<string>('Madrid');
  const [categories, setCategories] = useState<BudgetCategory[]>(DEFAULT_CATEGORIES);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [timeWindow, setTimeWindow] = useState<'4h' | '24h' | '48h'>('24h');

  // Inicialización o lectura de Hash de URL (Enlace Mágico Compartible)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      try {
        const rawHash = window.location.hash.replace('#plan=', '');
        if (rawHash) {
          const decoded = JSON.parse(decodeURIComponent(atob(rawHash)));
          if (decoded.totalBudget) setTotalBudget(Number(decoded.totalBudget));
          if (decoded.paxCount) setPaxCount(Number(decoded.paxCount));
          if (decoded.province) setProvince(decoded.province);
          if (Array.isArray(decoded.categories)) setCategories(decoded.categories);
        }
      } catch (e) {
        console.error('Error restaurando presupuesto desde URL:', e);
      }
    }
  }, []);

  // Suma total calculada
  const totalAllocated = useMemo(() => {
    return categories.reduce((sum, cat) => sum + (Number(cat.allocated) || 0), 0);
  }, [categories]);

  const remainingBudget = totalBudget - totalAllocated;

  // Manejador de bloqueo / desbloqueo de categoría
  const toggleLock = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isLocked: !c.isLocked } : c))
    );
  };

  // Cambio de importe en una categoría con compensación dinámica opcional
  const handleAllocatedChange = (id: string, newVal: number) => {
    const val = Math.max(0, newVal);
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, allocated: val } : c))
    );
  };

  // Distribución automática proporcional si se introduce un Presupuesto Maestro
  const handleAutoDistribute = () => {
    if (totalBudget <= 0) return;

    // Pesos canónicos de la industria nupcial española
    const weights: Record<string, number> = {
      banquete: 0.48, // 48% Finca y banquete
      musica: 0.08,   // 8% Música en directo y producción
      foto_video: 0.10, // 10% Fotógrafo y vídeo
      novia: 0.07,    // 7% Vestido y novia
      luna_miel: 0.12, // 12% Viaje de novios
      flores_decoracion: 0.04,
      novio: 0.03,
      joyeria: 0.02,
      transporte: 0.02,
      invitaciones: 0.01,
      detalles: 0.01,
      belleza: 0.01,
      ceremonia: 0.01
    };

    setCategories((prev) => {
      // Filtrar categorías que no estén bloqueadas
      const lockedSum = prev
        .filter((c) => c.isLocked)
        .reduce((sum, c) => sum + c.allocated, 0);

      const availableToDistribute = Math.max(0, totalBudget - lockedSum);
      const unlockedCats = prev.filter((c) => !c.isLocked);
      const sumUnlockedWeights = unlockedCats.reduce(
        (sum, c) => sum + (weights[c.id] || 0.02),
        0
      );

      return prev.map((c) => {
        if (c.isLocked) return c;
        const w = weights[c.id] || 0.02;
        const normalizedWeight = sumUnlockedWeights > 0 ? w / sumUnlockedWeights : 1 / unlockedCats.length;
        return {
          ...c,
          allocated: Math.round(availableToDistribute * normalizedWeight)
        };
      });
    });
  };

  // Añadir nueva categoría personalizada
  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: BudgetCategory = {
      id: `custom_${Date.now()}`,
      name: newCatName.trim(),
      allocated: 0,
      isLocked: false,
      iconName: 'Plus',
      description: 'Partida personalizada añadida por el usuario.'
    };
    setCategories((prev) => [...prev, newCat]);
    setNewCatName('');
    setShowAddModal(false);
  };

  // Eliminar categoría personalizada
  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // 🧠 MOTOR DE "BAÑO DE REALIDAD" (Reality Check Engine)
  const realityWarnings = useMemo(() => {
    const warnings: string[] = [];

    // 1. Banquete & Finca
    const banqueteCat = categories.find((c) => c.id === 'banquete');
    if (banqueteCat && banqueteCat.allocated > 0) {
      const minEstimatedBanquete = paxCount * (banqueteCat.benchmarkMinPerPax || 85);
      if (banqueteCat.allocated < minEstimatedBanquete) {
        warnings.push(
          `Banquete: Con ${paxCount} invitados, el catering de calidad en España ronda un mínimo de ${minEstimatedBanquete.toLocaleString()} € (${banqueteCat.benchmarkMinPerPax} €/pax). Con ${banqueteCat.allocated.toLocaleString()} € el coste por cubierto sería de solo ${(banqueteCat.allocated / paxCount).toFixed(0)} €/pax.`
        );
      }
    }

    // 2. Música en Directo
    const musicaCat = categories.find((c) => c.id === 'musica');
    if (musicaCat && musicaCat.allocated > 0 && musicaCat.allocated < 350) {
      warnings.push(
        `Música: La tarifa base homologada de un solista acústico S-Class con sonorización Bose es de 350 €. Con ${musicaCat.allocated} € no se alcanza el suelo técnico profesional.`
      );
    }

    // 3. Presupuesto Total Desfasado
    if (totalBudget > 0 && totalAllocated > totalBudget) {
      warnings.push(
        `Desfase Presupuestario: Has asignado ${totalAllocated.toLocaleString()} €, superando tu presupuesto objetivo de ${totalBudget.toLocaleString()} € en ${(totalAllocated - totalBudget).toLocaleString()} €.`
      );
    }

    return warnings;
  }, [categories, paxCount, totalBudget, totalAllocated]);

  // Generador de Enlace Mágico Compartible
  const generateMagicShareLink = useCallback(() => {
    const payload = {
      totalBudget,
      paxCount,
      province,
      categories
    };
    const jsonStr = JSON.stringify(payload);
    const b64 = btoa(encodeURIComponent(jsonStr));
    const fullUrl = `${window.location.origin}/calculadora#plan=${b64}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  }, [totalBudget, paxCount, province, categories]);

  // Mensaje de WhatsApp estructurado
  const whatsappBudgetShare = useMemo(() => {
    const text = encodeURIComponent(
      `🏛️ *Plan de Boda Oficial Productora EAR*\n` +
      `Demarcación: ${province} | Invitados: ${paxCount} pax\n` +
      `Presupuesto Objetivo: ${totalBudget.toLocaleString()} €\n` +
      `Coste Estimado Total: ${totalAllocated.toLocaleString()} €\n\n` +
      `*Desglose Principal:*\n` +
      categories
        .filter((c) => c.allocated > 0)
        .map((c) => `• ${c.name}: ${c.allocated.toLocaleString()} €`)
        .join('\n') +
      `\n\nQuiero verificar disponibilidad con este presupuesto cerrado y coordinar los 100 € de Price-Lock.`
    );
    return `https://wa.me/34693693048?text=${text}`;
  }, [province, paxCount, totalBudget, totalAllocated, categories]);

  return (
    <div className="w-full space-y-8 font-sans">
      {/* ── CABECERA PRINCIPAL TIPO BODAS.NET S-CLASS ── */}
      <div className="bg-[#07070b] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Calculator size={13} />
              <span>Presupuestador S-Class de Alta Fidelidad</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-syne uppercase tracking-tight">
              Calculadora & Planificador de Boda
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
              Desglose exhaustivo e ilimitado de todas las partidas de tu evento. Bloquea importes con candado y encuentra los proveedores exactos que encajan en tu presupuesto.
            </p>
          </div>

          {/* ACCIONES DE EXPORTACIÓN Y COMPARTIR */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={generateMagicShareLink}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white flex items-center gap-2 transition shadow-sm"
              title="Copiar enlace permanente del presupuesto"
            >
              {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white flex items-center gap-2 transition"
            >
              <Printer size={14} />
              <span>Imprimir</span>
            </button>

            <a
              href={whatsappBudgetShare}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-emerald-400 text-black font-extrabold flex items-center gap-2 transition shadow-md"
            >
              <MessageSquare size={14} className="fill-black" />
              <span>Enviar por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* ── BARRA DE CONTROL GENERAL (PRESUPUESTO MAESTRO, PAX, PROVINCIA) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
              Presupuesto Objetivo Total (€)
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                step={500}
                value={totalBudget === 0 ? '' : totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value) || 0)}
                placeholder="Ej: 25.000 €"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-lg font-black text-white font-mono focus:outline-none focus:border-[#ecb613]"
              />
            </div>
            <button
              type="button"
              onClick={handleAutoDistribute}
              disabled={totalBudget <= 0}
              className="text-[10px] font-mono text-[#ecb613] hover:underline flex items-center gap-1 pt-1 disabled:opacity-40"
            >
              <RefreshCw size={11} /> Auto-distribuir proporcionalmente
            </button>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
              Número de Invitados (Pax)
            </label>
            <input
              type="number"
              min={10}
              max={1500}
              value={paxCount}
              onChange={(e) => setPaxCount(Math.max(1, Number(e.target.value)))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-lg font-black text-white font-mono focus:outline-none focus:border-[#ecb613]"
            />
            <span className="text-[10px] font-mono text-slate-500 block pt-1">
              Referencia para banquetes y regalos
            </span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
              Provincia de Celebración
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white font-mono focus:outline-none focus:border-[#ecb613] cursor-pointer"
            >
              {['Madrid', 'Toledo', 'Barcelona', 'Valencia', 'Sevilla', 'Málaga', 'Alicante', 'Cádiz', 'Segovia', 'Ávila', 'Guadalajara', 'Zaragoza'].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span className="text-[10px] font-mono text-slate-500 block pt-1">
              Tarifas y kilometraje local
            </span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Coste Asignado</span>
              <span className="text-base font-black text-[#ecb613] font-mono">
                {totalAllocated.toLocaleString()} €
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-xs font-mono">
              <span className="text-slate-400">Restante / Desvío:</span>
              <span className={`font-black ${remainingBudget < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {remainingBudget > 0 ? `+${remainingBudget.toLocaleString()} €` : `${remainingBudget.toLocaleString()} €`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ALERTA DE "BAÑO DE REALIDAD" (PEDAGOGÍA CONSTRUCTIVA) ── */}
      {realityWarnings.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
            <AlertTriangle size={15} />
            <span>Baño de Realidad · Asesoría Pedagógica S-Class</span>
          </div>
          <ul className="space-y-1.5 text-xs text-amber-200/90 font-mono">
            {realityWarnings.map((warn, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{warn}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── LISTADO EXHAUSTIVO DE LAS 13 CATEGORÍAS CARDINALES ── */}
      <div className="bg-[#07070b] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white font-syne uppercase">
              Desglose de Partidas por Categoría
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Haz clic en el candado para fijar importes. Las partidas no bloqueadas se adaptan a tu presupuesto.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition"
          >
            <Plus size={14} className="text-[#ecb613]" />
            <span>+ Nueva Categoría</span>
          </button>
        </div>

        {/* TABLA / GRILLA DE CATEGORÍAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const isCustom = cat.id.startsWith('custom_');
            return (
              <div
                key={cat.id}
                className={`p-4 rounded-2xl border transition-all ${
                  cat.isLocked
                    ? 'bg-slate-950/90 border-[#ecb613]/50 shadow-md'
                    : 'bg-black/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleLock(cat.id)}
                      className={`p-1.5 rounded-lg border transition ${
                        cat.isLocked
                          ? 'bg-[#ecb613] text-black border-[#ecb613]'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                      title={cat.isLocked ? 'Partida Bloqueada (No se altera)' : 'Partida Libre (Se adapta al presupuesto)'}
                    >
                      {cat.isLocked ? <Lock size={13} /> : <Unlock size={13} />}
                    </button>
                    <span className="font-bold text-white text-xs sm:text-sm font-mono truncate" title={cat.name}>
                      {cat.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        step={50}
                        value={cat.allocated === 0 ? '' : cat.allocated}
                        onChange={(e) => handleAllocatedChange(cat.id, Number(e.target.value))}
                        placeholder="0"
                        className="w-28 text-right bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-sm font-black text-[#ecb613] font-mono focus:outline-none focus:border-[#ecb613]"
                      />
                      <span className="absolute right-2 top-1 text-slate-500 font-mono text-xs pointer-events-none">
                        €
                      </span>
                    </div>

                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition"
                        title="Eliminar partida"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-light mb-3 line-clamp-1">
                  {cat.description}
                </p>

                {/* SLIDER RÁPIDO DE AJUSTE */}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={Math.max(5000, totalBudget > 0 ? totalBudget : 30000)}
                    step={50}
                    value={cat.allocated}
                    disabled={cat.isLocked}
                    onChange={(e) => handleAllocatedChange(cat.id, Number(e.target.value))}
                    className="w-full accent-[#ecb613] h-1.5 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-40"
                  />
                  <span className="text-[10px] font-mono text-slate-500 w-12 text-right shrink-0">
                    {totalBudget > 0 ? `${((cat.allocated / totalBudget) * 100).toFixed(0)}%` : '—'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTÓN S-CLASS: BUSCAR PROVEEDORES QUE ENCAJAN EN ESTE PRESUPUESTO ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-[#0d0d12] to-slate-950 border-2 border-[#ecb613]/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
            Motor de Búsqueda Predictivo S-Class
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white font-syne uppercase">
            Buscar Proveedores que Encajan en este Presupuesto
          </h3>
          <p className="text-xs text-slate-300 max-w-xl font-light">
            Conecta tus partidas de finca ({categories.find((c) => c.id === 'banquete')?.allocated.toLocaleString() || 0} €) y música ({categories.find((c) => c.id === 'musica')?.allocated.toLocaleString() || 0} €) con las 9.559 fincas y 5.359 artistas reales en {province}.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link
            href={`/fincas?maxBudget=${categories.find((c) => c.id === 'banquete')?.allocated || 15000}&province=${province}`}
            className="px-6 py-3.5 rounded-2xl bg-[#ecb613] hover:bg-white text-black font-black uppercase text-xs font-mono transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(236,182,19,0.35)]"
          >
            <Building2 size={15} className="fill-black" />
            <span>Ver Fincas Disponibles</span>
          </Link>

          <Link
            href={`/artistas?maxBudget=${categories.find((c) => c.id === 'musica')?.allocated || 1500}&province=${province}`}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold uppercase text-xs font-mono transition flex items-center justify-center gap-2"
          >
            <Music size={15} className="text-[#ecb613]" />
            <span>Ver Artistas & Shows</span>
          </Link>
        </div>
      </div>

      {/* ── MODAL AÑADIR NUEVA CATEGORÍA PERSONALIZADA ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#08080d] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-syne uppercase">
              Añadir Nueva Partida Personalizada
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Introduce el nombre de la nueva categoría para sumarla al planificador de costes.
            </p>
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Ej: Candy Bar, Fuegos Artificiales, Coche de Caballos..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#ecb613]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-900 text-slate-300 text-xs font-mono rounded-xl border border-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 bg-[#ecb613] text-black font-bold text-xs font-mono rounded-xl uppercase"
              >
                Añadir Partida
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
