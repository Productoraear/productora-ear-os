import React, { useState, useEffect } from 'react';
import { Zap, Euro, Target } from 'lucide-react';
import PaymentModal from './PaymentModal';

const SERVICES = [
    { id: 'sound', label: 'Ingeniería de Sonido', basePrice: 450, timeBase: 4, icon: Zap },
    { id: 'light', label: 'Diseño Iluminación', basePrice: 350, timeBase: 4, icon: Zap },
    { id: 'video', label: 'Producción de Video', basePrice: 600, timeBase: 6, icon: Zap },
    { id: 'full', label: 'Producción Integral', basePrice: 1500, timeBase: 8, icon: Target },
];

const ARTIST_FEES = {
    local: { label: 'Local (Méntrida/Toledo)', multiplier: 1, logisticBase: 0 },
    national: { label: 'Nacional (España)', multiplier: 1.5, logisticBase: 350 },
    international: { label: 'Internacional', multiplier: 2.5, logisticBase: 1200 },
};

const CostCalculator: React.FC = () => {
    const [calculatorMode, setCalculatorMode] = useState<'services' | 'logistics'>('services');
    const [selectedServiceType, setSelectedServiceType] = useState('full');
    const [serviceTime, setServiceTime] = useState(8);
    const [destination, setDestination] = useState('');
    const [artistTier, setArtistTier] = useState<'local' | 'national' | 'international'>('local');
    const [total, setTotal] = useState(0);
    const [showPayment, setShowPayment] = useState(false);

    useEffect(() => {
        if (calculatorMode === 'services') {
            const srv = SERVICES.find(s => s.id === selectedServiceType);
            const base = srv?.basePrice || 0;
            const extraHours = Math.max(0, serviceTime - (srv?.timeBase || 0));
            setTotal(base + (extraHours * 100));
        } else {
            const tier = ARTIST_FEES[artistTier];
            setTotal(tier.logisticBase + (tier.multiplier * 500)); // Simulación de fee + logística
        }
    }, [calculatorMode, selectedServiceType, serviceTime, artistTier]);

    const breakdown = calculatorMode === 'services' ? (
        <div className="space-y-3">
            <div className="flex justify-between text-sm"><span>Base {SERVICES.find(s => s.id === selectedServiceType)?.label}</span><span className="font-bold">{SERVICES.find(s => s.id === selectedServiceType)?.basePrice}€</span></div>
            {serviceTime > (SERVICES.find(s => s.id === selectedServiceType)?.timeBase || 0) && (
                <div className="flex justify-between text-sm"><span>Horas Extra ({serviceTime - (SERVICES.find(s => s.id === selectedServiceType)?.timeBase || 0)})</span><span className="font-bold">{(serviceTime - (SERVICES.find(s => s.id === selectedServiceType)?.timeBase || 0)) * 100}€</span></div>
            )}
        </div>
    ) : (
        <div className="space-y-3">
            <div className="flex justify-between text-sm"><span>Logística {ARTIST_FEES[artistTier].label}</span><span className="font-bold">{ARTIST_FEES[artistTier].logisticBase}€</span></div>
            <div className="flex justify-between text-sm"><span>Fee Base Artista</span><span className="font-bold">{(ARTIST_FEES[artistTier].multiplier * 500).toFixed(0)}€</span></div>
        </div>
    );

    return (
        <div className="py-24 bg-black relative overflow-hidden" id="calculator">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl font-display font-black text-white italic uppercase underline decoration-ear-gold/30 underline-offset-8">Simulador de Inversión Táctica</h2>
                    <p className="text-gray-500 mt-4 max-w-xl mx-auto">Calcula el despliegue de recursos necesario para tu visión. Transparencia total, ingeniería de precisión.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 bg-white/5 border border-white/10 p-8 md:p-12 rounded-[3rem]">
                        <div className="flex gap-4 mb-12 bg-black p-2 rounded-2xl border border-white/5">
                            <button onClick={() => setCalculatorMode('services')} className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${calculatorMode === 'services' ? 'bg-ear-gold text-black shadow-xl shadow-ear-gold/20' : 'text-gray-500 hover:text-white'}`}>Producción Técnica</button>
                            <button onClick={() => setCalculatorMode('logistics')} className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${calculatorMode === 'logistics' ? 'bg-ear-gold text-black shadow-xl shadow-ear-gold/20' : 'text-gray-500 hover:text-white'}`}>Giras & Logística Artista</button>
                        </div>

                        {calculatorMode === 'services' ? (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {SERVICES.map(srv => (
                                        <button key={srv.id} onClick={() => { setSelectedServiceType(srv.id); setServiceTime(srv.timeBase); }} className={`p-6 rounded-2xl border text-left flex gap-4 transition-all ${selectedServiceType === srv.id ? 'bg-ear-gold/10 border-ear-gold text-ear-gold' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'}`}>
                                            <srv.icon size={24} />
                                            <div>
                                                <span className="block font-black uppercase text-xs tracking-tighter italic">{srv.label}</span>
                                                <span className="text-[10px] uppercase font-bold text-gray-400">Desde {srv.basePrice}€</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ear-gold mb-4">Tiempo de Ejecución (Horas)</p>
                                    <input type="range" min="4" max="24" step="1" value={serviceTime} onChange={(e) => setServiceTime(parseInt(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-ear-gold" />
                                    <div className="flex justify-between mt-2 text-[10px] font-black text-gray-500 uppercase italic"><span>4H (Express)</span><span>{serviceTime} HORAS</span><span>24H (Full Day)</span></div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ear-gold mb-4">Punto de Destino</p>
                                    <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Ej: Madrid IFEMA, Europa..." className="w-full bg-black border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-ear-gold font-body placeholder:text-gray-700" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {Object.entries(ARTIST_FEES).map(([key, val]) => (
                                        <button key={key} onClick={() => setArtistTier(key as any)} className={`p-6 rounded-2xl border transition-all text-center ${artistTier === key ? 'bg-ear-gold/10 border-ear-gold text-ear-gold' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'}`}>
                                            <span className="font-black uppercase text-xs italic">{val.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-[#0a0a0a] text-white p-12 rounded-[3rem] border border-white/5 sticky top-24 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5"><Euro size={140} /></div>
                            <h3 className="text-2xl font-display font-black mb-8 italic uppercase tracking-tighter">Liquidación Prevista</h3>
                            <div className="space-y-6 mb-12 pb-12 border-b border-white/5">
                                {breakdown}
                            </div>
                            <div className="flex justify-between items-end mb-12">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Tasa de Inversión Est.</span>
                                <span className="text-6xl font-display font-black italic text-white flex items-baseline">{total.toFixed(0)}<span className="text-sm text-ear-gold ml-1 italic leading-none">€+IVA</span></span>
                            </div>
                            <button onClick={() => setShowPayment(true)} className="w-full py-6 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-ear-gold transition-all shadow-xl">Solicitar Ejecución</button>
                            <p className="text-center text-[9px] text-gray-600 mt-6 font-bold uppercase tracking-[0.3em] font-black">*Sujeto a Auditoría Técnica EAR</p>
                        </div>
                    </div>
                </div>
            </div>
            <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} amount={total} concept={`Inversión: ${calculatorMode === 'services' ? 'Producción Técnica' : 'Logística de Gira'}`} />
        </div>
    );
};

export default CostCalculator;
