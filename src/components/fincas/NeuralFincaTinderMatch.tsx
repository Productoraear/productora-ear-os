"use client";

import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Heart, 
  X, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Calendar, 
  Crown, 
  MapPin, 
  Users, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Zap
} from 'lucide-react';
import { 
  HORMOZI_GRAND_SLAM_CATEGORIES, 
  calculateNeuralMatchScore, 
  type CouplePreferences, 
  type FincaNeuralSpecs 
} from '@/lib/matching/neuralFincaMatcher';
import { createSupplierUnlockCheckout, createProviderCardSetupSession } from '@/app/actions/vipCheckoutActions';

interface NeuralFincaTinderMatchProps {
  fincas: any[];
  onSelectFinca?: (finca: any) => void;
}

export const NeuralFincaTinderMatch: React.FC<NeuralFincaTinderMatchProps> = ({ fincas, onSelectFinca }) => {
  const [selectedHormoziCategory, setSelectedHormoziCategory] = useState<string | null>(null);
  const [isSwipeMode, setIsSwipeMode] = useState(false);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Filtros interactivos del viaje asistido
  const [guestCount, setGuestCount] = useState<number>(150);
  const [totalBudget, setTotalBudget] = useState<number>(35000);
  const [requiresOwnKitchen, setRequiresOwnKitchen] = useState<boolean>(false);
  const [requiresAccommodation, setRequiresAccommodation] = useState<boolean>(false);
  const [requiresCivilLegal, setRequiresCivilLegal] = useState<boolean>(false);
  const [requiresAllNightParty, setRequiresAllNightParty] = useState<boolean>(false);

  const couplePrefs: CouplePreferences = useMemo(() => ({
    guestCount,
    totalBudget,
    preferredProvince: 'Todas',
    requiresOwnKitchen,
    requiresAccommodation,
    requiresCivilLegalInSitu: requiresCivilLegal,
    requiresAllNightParty
  }), [guestCount, totalBudget, requiresOwnKitchen, requiresAccommodation, requiresCivilLegal, requiresAllNightParty]);

  // Cálculo de Matches Neurales
  const matchedFincas = useMemo(() => {
    return fincas.map((f: any) => {
      const specs: FincaNeuralSpecs = {
        id: f.id || f.slug,
        name: f.name,
        province: f.province || f.provincia || 'Madrid',
        address: f.address || f.location,
        basePrice: f.basePrice || f.precioMenuMin || 135,
        rentalFee: f.rentalFee || 2500,
        capacidadMaxPax: f.capacidadMaxPax || 350,
        capacidadMinPax: f.capacidadMinPax || 70,
        hasOwnKitchen: f.hasOwnKitchen ?? true,
        hasAccommodation: f.hasAccommodation ?? false,
        accommodationPax: f.accommodationPax || 16,
        hasCivilLegalCeremony: f.hasCivilLegalCeremony ?? true,
        maxPartyHour: f.maxPartyHour || '05:00',
        musicCanonEur: f.musicCanonEur || 0,
        photoCanonEur: f.photoCanonEur || 0
      };

      const matchResult = calculateNeuralMatchScore(specs, couplePrefs);
      return {
        ...f,
        matchResult,
        specs
      };
    }).sort((a, b) => b.matchResult.score - a.matchResult.score);
  }, [fincas, couplePrefs]);

  const activeSwipeFinca = matchedFincas[currentSwipeIndex] || null;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!activeSwipeFinca) return;
    if (direction === 'right') {
      setFavorites(prev => [...prev, activeSwipeFinca.id]);
    } else {
      setDismissed(prev => [...prev, activeSwipeFinca.id]);
    }
    setCurrentSwipeIndex(prev => prev + 1);
  };

  const handleQuickUnlock = async (finca: any) => {
    try {
      setIsUnlocking(true);
      const res = await createSupplierUnlockCheckout({
        supplierId: finca.id,
        supplierName: finca.name,
        category: 'Fincas para Boda',
        city: finca.province || finca.provincia || 'España',
        slug: finca.slug || finca.id
      });
      if (res?.url) {
        window.location.href = res.url;
      }
    } catch (e) {
      console.error('Error unlocking:', e);
      setIsUnlocking(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      
      {/* 👑 CATEGORÍAS GRAND SLAM (HORMOZI) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-ping" />
            <span className="text-[11px] font-mono text-[#ecb613] uppercase tracking-widest font-black">
              Colecciones Exclusivas de Alta Demanda
            </span>
          </div>
          <button
            onClick={() => setIsSwipeMode(!isSwipeMode)}
            className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-1.5 transition-all"
          >
            <Sparkles size={12} className="text-[#ecb613]" />
            <span>{isSwipeMode ? 'Vista Cuadrícula Airbnb' : 'Activar Modo Match Rápido'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {HORMOZI_GRAND_SLAM_CATEGORIES.map((cat) => {
            const isSelected = selectedHormoziCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedHormoziCategory(isSelected ? null : cat.slug)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-28 relative overflow-hidden group ${
                  isSelected 
                    ? 'bg-gradient-to-br from-[#1c1a0e] to-[#09090d] border-[#ecb613] shadow-[0_0_20px_rgba(236,182,19,0.2)]' 
                    : 'bg-[#08080e]/90 border-white/10 hover:border-white/20 hover:bg-[#0c0c14]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 uppercase">
                    {cat.badge}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold font-syne text-white leading-tight group-hover:text-[#ecb613] transition-colors">
                    {cat.title}
                  </h4>
                  <p className="text-[9px] text-zinc-400 font-mono line-clamp-1 mt-0.5">
                    {cat.headline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🎛️ FILTROS NEURALES DE VIAJE ASISTIDO (AIRBNB LUXE STYLE) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#0c0c14] to-[#07070b] border border-white/10 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold font-syne text-white flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-[#ecb613]" />
              <span>Calibrador Neural de Boda (50 Dimensiones)</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Ajusta tus parámetros reales. El motor descarta automáticamente fincas incompatibles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
              ✓ Filtro Anticuriosos Activo
            </span>
          </div>
        </div>

        {/* Sliders de Aforo y Presupuesto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400 uppercase">Número de Invitados (Aforo):</span>
              <strong className="text-white text-sm">{guestCount} Comensales</strong>
            </div>
            <input
              type="range"
              min={40}
              max={450}
              step={10}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full accent-[#ecb613] bg-zinc-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>50 íntima</span>
              <span>150 media</span>
              <span>300+ multitudinaria</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400 uppercase">Presupuesto Objetivo Total:</span>
              <strong className="text-[#ecb613] text-sm">{totalBudget.toLocaleString('es-ES')} €</strong>
            </div>
            <input
              type="range"
              min={15000}
              max={90000}
              step={2500}
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="w-full accent-[#ecb613] bg-zinc-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>15.000 € base</span>
              <span>35.000 € gala</span>
              <span>75.000 €+ alta gama</span>
            </div>
          </div>
        </div>

        {/* Toggles Excluyentes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          <button
            onClick={() => setRequiresOwnKitchen(!requiresOwnKitchen)}
            className={`p-3 rounded-2xl border text-left text-xs font-mono transition-all ${
              requiresOwnKitchen ? 'bg-[#ecb613]/10 border-[#ecb613] text-[#ecb613]' : 'bg-black/40 border-white/5 text-zinc-400 hover:border-white/20'
            }`}
          >
            <span className="block text-[10px] uppercase text-zinc-500">Gastronomía</span>
            <strong>{requiresOwnKitchen ? '✓ Cocina Propia In Situ' : 'Cualquier Cocina'}</strong>
          </button>

          <button
            onClick={() => setRequiresAccommodation(!requiresAccommodation)}
            className={`p-3 rounded-2xl border text-left text-xs font-mono transition-all ${
              requiresAccommodation ? 'bg-[#ecb613]/10 border-[#ecb613] text-[#ecb613]' : 'bg-black/40 border-white/5 text-zinc-400 hover:border-white/20'
            }`}
          >
            <span className="block text-[10px] uppercase text-zinc-500">Alojamiento</span>
            <strong>{requiresAccommodation ? '✓ Con Habitaciones' : 'Sin Alojamiento'}</strong>
          </button>

          <button
            onClick={() => setRequiresCivilLegal(!requiresCivilLegal)}
            className={`p-3 rounded-2xl border text-left text-xs font-mono transition-all ${
              requiresCivilLegal ? 'bg-[#ecb613]/10 border-[#ecb613] text-[#ecb613]' : 'bg-black/40 border-white/5 text-zinc-400 hover:border-white/20'
            }`}
          >
            <span className="block text-[10px] uppercase text-zinc-500">Ceremonia</span>
            <strong>{requiresCivilLegal ? '✓ Civil con Validez Legal' : 'Cualquier Ceremonia'}</strong>
          </button>

          <button
            onClick={() => setRequiresAllNightParty(!requiresAllNightParty)}
            className={`p-3 rounded-2xl border text-left text-xs font-mono transition-all ${
              requiresAllNightParty ? 'bg-[#ecb613]/10 border-[#ecb613] text-[#ecb613]' : 'bg-black/40 border-white/5 text-zinc-400 hover:border-white/20'
            }`}
          >
            <span className="block text-[10px] uppercase text-zinc-500">Horario de Fiesta</span>
            <strong>{requiresAllNightParty ? '✓ Hasta 05:00+ AM' : 'Horario Normal'}</strong>
          </button>
        </div>
      </div>

      {/* 📱 MODO SWIPE RÁPIDO (TINDER MODE) */}
      {isSwipeMode && activeSwipeFinca && (
        <div className="max-w-md mx-auto p-4 bg-[#090912] rounded-3xl border border-[#ecb613]/40 shadow-2xl space-y-4 text-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black">
            <img 
              src={activeSwipeFinca.img || activeSwipeFinca.imageUrls?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop'} 
              alt={activeSwipeFinca.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#ecb613] text-[#ecb613] font-mono text-xs font-black">
              {activeSwipeFinca.matchResult.score}% Afinidad
            </div>
          </div>

          <div className="space-y-1 text-left">
            <h3 className="text-xl font-bold font-syne text-white">{activeSwipeFinca.name}</h3>
            <p className="text-xs font-mono text-zinc-400 flex items-center gap-1">
              <MapPin size={12} className="text-[#ecb613]" />
              <span>{activeSwipeFinca.province || 'Madrid'}, España</span>
            </p>
          </div>

          {/* Fortalezas y Advertencias */}
          <div className="p-3 bg-black/50 rounded-2xl border border-white/5 text-left text-xs font-mono space-y-1.5">
            {activeSwipeFinca.matchResult.strengths.slice(0, 2).map((st: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                <CheckCircle2 size={13} className="shrink-0" />
                <span>{st}</span>
              </div>
            ))}
            {activeSwipeFinca.matchResult.warnings.slice(0, 1).map((wn: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1.5 text-amber-400 text-[11px]">
                <AlertCircle size={13} className="shrink-0" />
                <span>{wn}</span>
              </div>
            ))}
          </div>

          {/* Botón Tripwire 1,00 € */}
          <button
            onClick={() => handleQuickUnlock(activeSwipeFinca)}
            disabled={isUnlocking}
            className="w-full py-3.5 bg-[#ecb613] hover:bg-amber-400 text-black font-black font-mono text-xs uppercase rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Lock size={14} />
            <span>Desbloquear Teléfono Maître · 1,00 €</span>
          </button>

          {/* Controles de Swipe */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <button
              onClick={() => handleSwipe('left')}
              className="w-14 h-14 rounded-full bg-red-950/40 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all active:scale-90"
              aria-label="Descartar"
            >
              <X size={24} />
            </button>
            <button
              onClick={() => handleSwipe('right')}
              className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-xl"
              aria-label="Guardar en favoritos"
            >
              <Heart size={28} className="fill-current" />
            </button>
          </div>
          <p className="text-[10px] font-mono text-zinc-500">
            Finca {currentSwipeIndex + 1} de {matchedFincas.length} · Swipe o botones
          </p>
        </div>
      )}

      {/* 🏰 RESULTADOS RANKING NEURAL */}
      {!isSwipeMode && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/5 pb-2">
            <span>Ranking por Afinidad Neural Real</span>
            <span>Mostrando {matchedFincas.length} Fincas Compatibles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedFincas.slice(0, 9).map((finca) => {
              const { matchResult } = finca;
              const isTop = matchResult.score >= 90;

              return (
                <div
                  key={finca.id}
                  className="rounded-3xl bg-[#090910] border border-white/10 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between overflow-hidden group shadow-xl hover:-translate-y-1 duration-300"
                >
                  <div className="relative aspect-[16/10] bg-black overflow-hidden">
                    <img 
                      src={finca.img || finca.imageUrls?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop'} 
                      alt={finca.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />

                    {/* Badge Match Score */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-black backdrop-blur-md border ${
                        isTop ? 'bg-[#ecb613] text-black border-amber-300' : 'bg-black/80 text-[#ecb613] border-[#ecb613]/40'
                      }`}>
                        {matchResult.score}% Match
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-[10px] border border-white/10">
                      ~{matchResult.costPerGuestEur} €/pax real
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold font-syne text-white group-hover:text-[#ecb613] transition-colors">
                        {finca.name}
                      </h4>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                        <MapPin size={12} className="text-[#ecb613]" />
                        <span>{finca.province || 'Madrid'}, España</span>
                      </p>

                      {/* Desglose Match */}
                      <div className="p-3 bg-black/50 rounded-2xl border border-white/5 text-[11px] font-mono space-y-1">
                        {matchResult.strengths.slice(0, 2).map((st: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-1.5 text-emerald-400 line-clamp-1">
                            <CheckCircle2 size={12} className="shrink-0" />
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="space-y-2 pt-3 border-t border-white/10">
                      <button
                        onClick={() => handleQuickUnlock(finca)}
                        className="w-full py-3 bg-[#ecb613] hover:bg-amber-400 text-black font-black font-mono text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Lock size={13} />
                        <span>Contacto Directo Maître · 1,00 €</span>
                      </button>

                      <p className="text-[9px] font-mono text-zinc-500 text-center">
                        Descontable 100% de reserva · Cero comisiones de agencia
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default NeuralFincaTinderMatch;
