'use client';
import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Zap, Shield, Activity, Target, ArrowRight, Loader2, Sparkles, Lock } from 'lucide-react';
import { useSovereignRole } from '@/shared/hooks/useSovereignRole';
import { PriceLockBadge } from './PriceLockBadge';

/**
 * BespokePricer - EAR OS V2 GOLD | OMNI-STITCH 2050
 * Nodo de conversión de vanguardia con Congelador de Tarifa (Price-Lock 72h / Palanca 8) e Integración Stripe Connect.
 */
export interface BespokePricerProps {
  category: string;
  basePrice: number;
  role?: string;
  ctaHref?: string;
  metadata?: Record<string, any>;
}

export const BespokePricer: React.FC<BespokePricerProps> = ({ 
  category, 
  basePrice, 
  ctaHref = '/contacto',
  metadata = {}
}) => {
  const { role, isAdmin } = useSovereignRole();
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false); // Gatillo de 1€
  const [priceLockData, setPriceLockData] = useState<any>(null);

  // Activar Test Mode con Ctrl + Shift + T (Solo Admin/Comandante)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'T' && isAdmin) {
        setIsTestMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  const GOLDEN_COHORT = [
    'Finca El Regajal', 'Finca La Esmeralda', 'Palacio de Cristal', 
    'Finca Aal Cachucho', 'Finca Ventalama', 'Molino del Manto',
    'El Gasco', 'Las Margas', 'Palacio Carlos III', 'Castillo de Castilnovo'
  ];

  const isGoldenCohort = GOLDEN_COHORT.some(f => category.includes(f));
  const isB2G = role === 'ROLE_B2G' || category.toLowerCase().includes('ayuntamiento');

  // 📈 Contador Animado (Price Count-Up)
  const count = useSpring(0, { stiffness: 50, damping: 20 });
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString() + "€");

  useEffect(() => {
    count.set(basePrice);
  }, [basePrice, count]);

  const getPriceForCategory = () => {
    const cat = category.toLowerCase();
    if (isTestMode) return 1;
    if (cat.includes('edwin')) return 1450;
    if (cat.includes('orquesta')) return 3800;
    if (cat.includes('mariachi')) return 650;
    if (cat.includes('discomovil')) return 850;
    return basePrice;
  };

  const finalPrice = getPriceForCategory();

  // 🔒 Palanca 8: Generación del Congelador de Tarifa SHA-256
  const handleLockPrice = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quotes/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalPrice,
          eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          riderConfig: 'Bose F1 Model 812 + Subwoofers FBT + XR18 Digital',
          location: metadata.provincia || 'Madrid / Toledo'
        })
      });

      const data = await res.json();
      if (data.success) {
        setPriceLockData(data);
      }
    } catch (err) {
      console.error('❌ [PRICE_LOCK_FAILED]:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: isTestMode ? 1 : finalPrice, // Valor nominal
          concept: `Certificación VIMUME OS: ${category}${isTestMode ? ' [TEST_MODE]' : ''}`,
          metadata: {
            category,
            source: 'VIMUME_OS_V165',
            venue_id: isGoldenCohort ? category : '',
            is_b2g: isB2G,
            artist_tier: category.toLowerCase().includes('edwin') ? 'INSTITUTIONAL_AUTHORITY' : 'STANDARD',
            price_lock_hash: priceLockData?.priceLockHash || '',
            ...metadata
          }
        })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Gateway Timeout');
      }
    } catch (error) {
      console.error("❌ STRIKE_LINK_FAILED:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCtaLabel = () => {
    if (isTestMode) return 'EJECUTAR PRUEBA DE COBRO (1.00 €)';
    if (isB2G) return 'SOLICITAR DOSSIER Y MEMORIA ART. 118 LCSP';
    return 'RESERVAR FECHA Y BLOQUEAR TARIFA';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-panel p-8 md:p-10 flex flex-col gap-8 group relative overflow-hidden transition-all duration-700 hover:shadow-[0_0_50px_rgba(212,168,85,0.15)] bg-[#050505] border border-white/10 rounded-3xl"
    >
      {/* Visual Artifacts */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#ecb613]/5 blur-[80px] rounded-full group-hover:bg-[#ecb613]/10 transition-all duration-1000" />
      
      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={isHovered ? { rotate: 360 } : {}}
            className="p-2 bg-[#ecb613]/10 rounded-full text-[#ecb613]"
          >
            <Sparkles size={16} />
          </motion.div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ecb613]/60">VIMUME OS Asset</span>
        </div>
        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-tight">
          {category}
        </h3>
      </div>

      {/* 💰 Precio animado */}
      <div className="flex flex-col gap-1 my-2">
        <span className="text-xs text-slate-400 uppercase font-mono tracking-widest">Inversión Estimada S-Class</span>
        <div className="flex items-baseline gap-3">
          <motion.span className="text-5xl md:text-6xl font-black text-white tracking-tight">
            {rounded}
          </motion.span>
          <span className="text-xs text-[#ecb613] font-bold font-mono">+ IVA</span>
        </div>
      </div>

      {/* 🔒 Botón Congelador de Tarifa (Palanca 8) */}
      {!priceLockData ? (
        <button
          onClick={handleLockPrice}
          disabled={loading}
          className="w-full py-3 bg-white/5 border border-[#ecb613]/30 hover:bg-[#ecb613]/10 text-[#ecb613] rounded-2xl text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Lock className="w-4 h-4" /> Congelar Tarifa 72h con Hash SHA-256
        </button>
      ) : (
        <div className="space-y-4">
          <PriceLockBadge
            hash={priceLockData.priceLockHash}
            total={priceLockData.amount}
            split={{ 
              artist: parseFloat((priceLockData.amount * 0.8).toFixed(2)), 
              platform: parseFloat((priceLockData.amount * 0.1).toFixed(2)), 
              vimume: parseFloat((priceLockData.amount * 0.1).toFixed(2)) 
            }}
          />
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-[#ecb613] hover:bg-[#ffc61c] text-black rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ecb613]/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Abonar Garantía de Reserva (30%)'}
          </button>
        </div>
      )}

      {/* Mensajes de Autoridad */}
      {isGoldenCohort && (
        <div className="p-4 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-2xl text-xs text-slate-300">
          <span className="text-[#ecb613] font-bold block mb-1">Finca Reconocida: {category}</span>
          <p className="text-[11px] text-slate-400">Configuración acústica pre-homologada para evitar problemas de limitadores de sonido.</p>
        </div>
      )}

      {/* Botón Principal de Reserva */}
      <motion.button 
        onClick={handleCheckout}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-4 transition-all relative overflow-hidden group/btn cursor-pointer shadow-xl"
      >
        <motion.div 
          className="absolute inset-0 bg-[#ecb613] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"
        />
        <div className="relative z-10 flex items-center gap-3">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
          <span className="text-xs uppercase tracking-[0.25em] font-extrabold">{getCtaLabel()}</span>
        </div>
      </motion.button>

      <div className="flex justify-between items-center pt-4 border-t border-white/5 opacity-30 text-white">
         <Activity size={12} />
         <Shield size={12} className="text-[#ecb613]" />
         <Target size={12} />
      </div>
    </motion.div>
  );
};

export default BespokePricer;
