"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SlidersHorizontal, X, Check, Building, Zap, Sparkles, 
  Calendar, ShieldCheck, Truck, Volume2, Shield, Info, ArrowRight, RotateCcw
} from 'lucide-react';
import { SClassUltraFilters, DEFAULT_ULTRA_FILTERS, calculateFilterSurcharges } from '@/features/finance/types/filters';

interface AirbnbUltraFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SClassUltraFilters;
  onChange: (updated: SClassUltraFilters) => void;
}

export const AirbnbUltraFiltersModal: React.FC<AirbnbUltraFiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState<'space' | 'electrical' | 'rider' | 'protocol' | 'logistics' | 'compliance'>('space');

  const { surchargeAmount, riderSpecs, activeCount } = calculateFilterSurcharges(filters);

  const handleReset = () => {
    onChange(DEFAULT_ULTRA_FILTERS);
  };

  const updateSection = <K extends keyof SClassUltraFilters>(section: K, patch: Partial<SClassUltraFilters[K]>) => {
    onChange({
      ...filters,
      [section]: {
        ...filters[section],
        ...patch
      }
    });
  };

  const toggleArrayItem = (current: string[], item: string): string[] => {
    return current.includes(item) ? current.filter(i => i !== item) : [...current, item];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-4xl bg-[#09090d] border border-[#ecb613]/30 rounded-[2.5rem] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[90vh] my-auto"
        >
          {/* HEADER DEL MODAL */}
          <div className="p-6 sm:p-8 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-black via-[#0e0e14] to-black">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                <SlidersHorizontal size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-[#ecb613]">
                    Ingeniería de Escenarios S-Class
                  </span>
                  <span className="text-[8px] font-mono bg-[#ecb613]/20 text-[#ecb613] px-2 py-0.5 rounded-full border border-[#ecb613]/30">
                    {activeCount} Filtros Activos
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-syne">
                  Especificaciones Técnicas & Filtros Ultra-Detallados
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all border border-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* NAVEGACIÓN POR PESTAÑAS TIPO AIRBNB */}
          <div className="flex overflow-x-auto p-3 sm:px-8 bg-black/40 border-b border-white/5 gap-2 scrollbar-none">
            {[
              { id: 'space', label: '1. Espacio & Acústica', icon: <Building size={14} /> },
              { id: 'electrical', label: '2. Electricidad & Accesos', icon: <Zap size={14} /> },
              { id: 'rider', label: '3. Iluminación & Rider', icon: <Sparkles size={14} /> },
              { id: 'protocol', label: '4. Protocolo & Ensayos', icon: <Calendar size={14} /> },
              { id: 'logistics', label: '5. Dietas & Pernocta', icon: <Truck size={14} /> },
              { id: 'compliance', label: '6. Compliance & B2G', icon: <ShieldCheck size={14} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* CUERPO MODAL CON SCROLL */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs">
            
            {/* 1. ESPACIO & ACÚSTICA */}
            {activeTab === 'space' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#ecb613] block">
                    Tipo de Recinto / Escenario
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { id: 'jardin-finca', name: 'Jardín / Finca Abierta', desc: 'Acústica libre sin rebotes molestos.' },
                      { id: 'salon-carpa', name: 'Salón Cerrado / Carpa Nupcial', desc: 'Tratamiento de ecos y reflexiones.' },
                      { id: 'teatro-auditorio', name: 'Teatro / Auditorio Municipal', desc: 'Optimizado para concha acústica.' },
                      { id: 'plaza-exterior', name: 'Plaza Pública / Escenario Exterior (+150€)', desc: 'Refuerzo de graves 12 W/pax de alta dispersión.' },
                      { id: 'piso-chalet', name: 'Piso / Chalet Privado', desc: 'Calibración a bajo volumen sin vibraciones.' }
                    ].map(opt => (
                      <div
                        key={opt.id}
                        onClick={() => updateSection('space', { venueType: opt.id as any })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                          filters.space.venueType === opt.id
                            ? 'bg-[#ecb613]/15 border-[#ecb613] text-white shadow-md'
                            : 'bg-white/5 border-white/5 hover:border-white/20 text-white/70'
                        }`}
                      >
                        <div className="font-bold text-white uppercase">{opt.name}</div>
                        <div className="text-[10px] text-white/50">{opt.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase text-[#ecb613] block">
                      Condición Acústica del Recinto
                    </label>
                    <select
                      value={filters.space.ceilingAcoustics}
                      onChange={e => updateSection('space', { ceilingAcoustics: e.target.value as any })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white font-mono outline-none focus:border-[#ecb613]"
                    >
                      <option value="acustica-controlada">Acústica Controlada (Baja reverberación)</option>
                      <option value="reverberacion-alta">Reverberación Alta (Cristal, Piedra, Mármol)</option>
                      <option value="abierto-sin-paredes">Abierto sin paredes (Dispersión completa)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase text-[#ecb613] block">
                      Restricciones de Ruido (OPCAT)
                    </label>
                    <select
                      value={filters.space.noiseRestriction}
                      onChange={e => updateSection('space', { noiseRestriction: e.target.value as any })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white font-mono outline-none focus:border-[#ecb613]"
                    >
                      <option value="sin-limitador">Sin Limitador Acústico (Potencia libre)</option>
                      <option value="limitador-opcat">Con Limitador Municipal Homologado (85-90 dBA)</option>
                      <option value="residencial-sensible">Zona Residencial Sensible (Cardioide)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ELECTRICIDAD & ACCESOS */}
            {activeTab === 'electrical' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#ecb613] block">
                    Alimentación Eléctrica Disponible
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'monofasica-220v', name: 'Toma Monofásica 220V (16A)', desc: 'Estándar doméstico / fincas.' },
                      { id: 'trifasica-32a', name: 'Toma Trifásica 32A/63A', desc: 'Acometida industrial para grandes shows.' },
                      { id: 'grupo-electrogeno', name: 'Grupo Electrógeno Requerido (+280€)', desc: 'Suministro autónomo estabilizado.' }
                    ].map(opt => (
                      <div
                        key={opt.id}
                        onClick={() => updateSection('electrical', { powerSupply: opt.id as any })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                          filters.electrical.powerSupply === opt.id
                            ? 'bg-[#ecb613]/15 border-[#ecb613] text-white shadow-md'
                            : 'bg-white/5 border-white/5 hover:border-white/20 text-white/70'
                        }`}
                      >
                        <div className="font-bold text-white uppercase">{opt.name}</div>
                        <div className="text-[10px] text-white/50">{opt.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase text-[#ecb613] block">
                      Acceso al Escenario / Carga
                    </label>
                    <select
                      value={filters.electrical.stageAccess}
                      onChange={e => updateSection('electrical', { stageAccess: e.target.value as any })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white font-mono outline-none focus:border-[#ecb613]"
                    >
                      <option value="pie-calle">Carga y descarga a pie de calle (0 €)</option>
                      <option value="montacargas-ascensor">Montacargas o Ascensor disponible (0 €)</option>
                      <option value="escaleras-sin-ascensor">Escaleras sin ascensor (+90 € Porteo técnico)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase text-[#ecb613] block">
                      Distancia de Tirada de Cableado FOH
                    </label>
                    <select
                      value={filters.electrical.cableDistance}
                      onChange={e => updateSection('electrical', { cableDistance: e.target.value as any })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white font-mono outline-none focus:border-[#ecb613]"
                    >
                      <option value="menor-15m">&lt; 15 metros de distancia</option>
                      <option value="15-50m">15 a 50 metros (Tirada estándar)</option>
                      <option value="mayor-50m">&gt; 50 metros (+60 € Manguera balanceada)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ILUMINACIÓN & RIDER VIP */}
            {activeTab === 'rider' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#ecb613] block">
                    Nivel de Iluminación Espectacular
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { id: 'basica-escena', name: 'Básica de Escena', desc: 'Foco blanco cálido para artistas.' },
                      { id: 'robotica-led-cabezas', name: 'Robótica Beam/Wash (+350€)', desc: 'Cabezas móviles DMX sincronizadas.' },
                      { id: 'humo-denso-fuego-frio', name: 'Humo Criogénico & Fuego Frío (+450€)', desc: 'Efectos especiales cinematográficos.' },
                      { id: 'arquitectonica-finca', name: 'Arquitectónica Finca IP65 (+400€)', desc: 'Baño de luz en árboles y muros.' }
                    ].map(opt => (
                      <div
                        key={opt.id}
                        onClick={() => updateSection('rider', { lightingTier: opt.id as any })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                          filters.rider.lightingTier === opt.id
                            ? 'bg-[#ecb613]/15 border-[#ecb613] text-white shadow-md'
                            : 'bg-white/5 border-white/5 hover:border-white/20 text-white/70'
                        }`}
                      >
                        <div className="font-bold text-white uppercase text-[11px]">{opt.name}</div>
                        <div className="text-[10px] text-white/50">{opt.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/5">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#ecb613] block">
                    Microfonía Adicional & Grabación
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'solapa-diadema', name: 'Diadema Shure Axient (+80€)', desc: 'Para votos nupciales u oficiante.' },
                      { id: 'presidencia-discursos', name: 'Atril de Presidencia / Discursos', desc: 'Micrófono de cuello de cisne.' },
                      { id: 'grabacion-multipista', name: 'Grabación Multipista 32-bit (+220€)', desc: 'Audio máster de toda la actuación.' }
                    ].map(item => {
                      const active = filters.rider.soundMicrophony.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => updateSection('rider', { soundMicrophony: toggleArrayItem(filters.rider.soundMicrophony, item.id) })}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            active ? 'bg-[#ecb613]/15 border-[#ecb613] text-white' : 'bg-white/5 border-white/5 text-white/70'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-white text-xs">{item.name}</div>
                            <div className="text-[10px] text-white/50">{item.desc}</div>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${active ? 'bg-[#ecb613] text-black font-bold' : 'border border-white/20'}`}>
                            {active ? '✓' : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 4. PROTOCOLO & ENSAYOS */}
            {activeTab === 'protocol' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#ecb613] block">
                    Momentos del Evento a Cubrir
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { id: 'entrada-sorpresa', name: 'Entrada Sorpresa / Serenata', desc: 'Aparición estelar y primer impacto.' },
                      { id: 'coctel-bienvenida', name: 'Cóctel de Bienvenida', desc: 'Música ambiental de alta etiqueta.' },
                      { id: 'banquete', name: 'Banquete / Entre Platos', desc: 'Pases acústicos selectos.' },
                      { id: 'barra-libre', name: 'Fin de Fiesta / Barra Libre', desc: 'Show festivo de máxima energía.' },
                      { id: 'ceremonia', name: 'Ceremonia Religiosa / Civil', desc: 'Repertorio solemne y emotivo.' }
                    ].map(moment => {
                      const isSel = filters.protocol.performanceMoments.includes(moment.id);
                      return (
                        <div
                          key={moment.id}
                          onClick={() => updateSection('protocol', { performanceMoments: toggleArrayItem(filters.protocol.performanceMoments, moment.id) })}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSel ? 'bg-[#ecb613]/15 border-[#ecb613] text-white' : 'bg-white/5 border-white/5 text-white/70'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-white text-xs">{moment.name}</div>
                            <div className="text-[10px] text-white/50">{moment.desc}</div>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isSel ? 'bg-[#ecb613] text-black font-bold' : 'border border-white/20'}`}>
                            {isSel ? '✓' : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#ecb613] block">
                    Nivel de Ensayo y Chequeo Técnico
                  </label>
                  <select
                    value={filters.protocol.rehearsalLevel}
                    onChange={e => updateSection('protocol', { rehearsalLevel: e.target.value as any })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white font-mono outline-none focus:border-[#ecb613]"
                  >
                    <option value="prueba-t120">Prueba de sonido T-120 min antes del evento (Incluida S-Class)</option>
                    <option value="ensayo-dia-previo">Ensayo presencial con novios/dirección el día previo (+180 €)</option>
                  </select>
                </div>
              </div>
            )}

            {/* 5. DIETAS & PERNOCTA */}
            {activeTab === 'logistics' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">Alojamiento / Pernocta de Staff & Artistas</div>
                      <div className="text-white/50 text-[11px]">Recomendado si la actuación termina después de las 02:00 o desplazamiento &gt; 300 km (+250 €).</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={filters.logistics.accommodationRequired}
                      onChange={e => updateSection('logistics', { accommodationRequired: e.target.checked })}
                      className="w-5 h-5 accent-[#ecb613] cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">Catering / Menú de Staff</div>
                      <div className="text-white/50 text-[11px]">¿El cliente facilita menú caliente o compensación en dieta (+75 €)?</div>
                    </div>
                    <select
                      value={filters.logistics.cateringStaffOption}
                      onChange={e => updateSection('logistics', { cateringStaffOption: e.target.value as any })}
                      className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white font-mono outline-none"
                    >
                      <option value="cliente-invita">Menú de staff facilitado por cliente (0 €)</option>
                      <option value="dieta-compensada">Compensación en dieta (+75 €)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 6. COMPLIANCE & B2G */}
            {activeTab === 'compliance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase text-[#ecb613] block">
                      Régimen de Facturación
                    </label>
                    <select
                      value={filters.compliance.billingType}
                      onChange={e => updateSection('compliance', { billingType: e.target.value as any })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white font-mono outline-none focus:border-[#ecb613]"
                    >
                      <option value="particular-iva">Particular (Factura con IVA 21% desglosado)</option>
                      <option value="empresa-b2b">Empresa / B2B (Deducción fiscal e IRPF)</option>
                      <option value="ayuntamiento-b2g">Administración Pública / B2G (FacturaE / DIR3 / Art. 118 LCSP)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase text-[#ecb613] block">
                      Cobertura de Seguro y Prevención
                    </label>
                    <select
                      value={filters.compliance.safetyInsurance}
                      onChange={e => updateSection('compliance', { safetyInsurance: e.target.value as any })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white font-mono outline-none focus:border-[#ecb613]"
                    >
                      <option value="rc-estandar-1m">Póliza RC 1.000.000 € (Incluida en todos los eventos)</option>
                      <option value="rc-ampliada-2m">Póliza RC Ampliada 2.000.000 € (+120 €)</option>
                      <option value="plan-prl-requerido">Plan de Prevención de Riesgos (PRL) y Coordinación</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* FOOTER DEL MODAL CON IMPACTO EN EL PRESUPUESTO */}
          <div className="p-6 sm:p-8 border-t border-white/10 bg-black flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-white/50 uppercase">Suplemento Ultra-Filtros:</span>
                <span className="text-base font-black text-[#ecb613] font-mono">+{surchargeAmount} €</span>
              </div>
              <div className="text-[10px] text-white/40 font-mono">
                {riderSpecs.length} prescripciones inyectadas al Rider Técnico
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>Restablecer</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/25"
              >
                <span>Aplicar al Presupuesto</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
