'use client';
import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { Zap, Shield, Activity, Target, ArrowRight, Loader2, Sparkles, Crown } from 'lucide-react';
import { useSovereignRole } from '@/shared/hooks/useSovereignRole';

/**
 * BespokePricer - EAR OS V2 GOLD | OMNI-STITCH 2050
 * Nodo de conversión de vanguardia con animaciones de alta fidelidad.
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
    if (cat.includes('caballo')) return 5500;
    if (cat.includes('monumental') || cat.includes('banda')) return 9500;
    if (cat.includes('mariachi gala') || cat.includes('6+')) return 2800;
    if (cat.includes('solista') || cat.includes('premium')) return 1500;
    if (cat.includes('vimume')) return 3500;
    return basePrice;
  };

  const finalPrice = getPriceForCategory();

  useEffect(() => {
    count.set(finalPrice);
  }, [finalPrice, count]);

  const getCtaLabel = () => {
    if (loading) return 'ESTABLECIENDO VÍNCULO...';
    if (role === 'ROLE_B2G') return 'SOLICITAR PROTOCOLO B2G';
    if (role === 'ROLE_B2B') return 'BLOQUEAR CAPACIDAD S-CLASS';
    return 'RESERVAR AHORA';
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: isTestMode ? 1 : finalPrice, // Enviamos el valor nominal, el API convierte a centavos
          concept: `Certificación S-Class: ${category}${isTestMode ? ' [TEST_MODE]' : ''}`,
          metadata: {
            category,
            source: 'OMNI_STITCH_V162',
            venue_id: isGoldenCohort ? category : '',
            is_b2g: isB2G,
            artist_tier: category.toLowerCase().includes('edwin') ? 'MASTER_ARTIST' : 'STANDARD',
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-panel p-10 flex flex-col gap-8 group relative overflow-hidden transition-all duration-700 hover:shadow-[0_0_50px_rgba(212,168,85,0.15)]"
    >
      {/* Visual Artifacts */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#d4a855]/5 blur-[80px] rounded-full group-hover:bg-[#d4a855]/10 transition-all duration-1000" />
      
      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={isHovered ? { rotate: 360 } : {}}
            className="p-2 bg-[#d4a855]/10 rounded-full text-[#d4a855]"
          >
            <Sparkles size={16} />
          </motion.div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d4a855]/60">S-Class Asset</span>
        </div>
        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-tight">
          {category}
        </h3>
      </div>

      <div className="flex items-baseline gap-2 relative">
        <motion.span className="text-6xl font-black text-white tracking-tighter italic">
          {rounded}
        </motion.span>
        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Start</span>
        {isTestMode && (
          <div className="absolute -top-6 right-0 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded uppercase animate-pulse">
            1€ Gatillo Armado
          </div>
        )}
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
          <div className="w-1.5 h-1.5 rounded-full bg-[#d4a855] animate-pulse" />
          Protocolo Institucional Ready
        </div>
        <p className="text-[11px] text-white/30 leading-relaxed font-medium">
          Infraestructura de alta fidelidad validada por el Oráculo. Prioridad de despliegue en 52 provincias.
        </p>

        {isGoldenCohort && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-[#d4a855]/5 border border-[#d4a855]/20 rounded-xl mt-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Crown size={12} className="text-[#d4a855]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#d4a855]">Artista Recomendado S-Class</span>
            </div>
            <p className="text-[10px] text-white/60 font-bold uppercase tracking-tight">
              Edwin Agudelo (Master Artist) es el proveedor pre-aprobado para la acústica de este recinto.
            </p>
          </motion.div>
        )}

        {isB2G && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl mt-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-blue-500/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Shield size={16} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Protocolo VIMUME Activo</span>
              </div>
              <p className="text-[11px] text-white/70 font-bold uppercase tracking-tight leading-relaxed">
                La contratación de Edwin Agudelo en su municipio activa automáticamente el Programa de Innovación Social VIMUME, financiando sesiones de musicoterapia de alto impacto para la población senior local.
              </p>
            </div>
          </motion.div>
        )}

        {/* UPSELLING ECUESTRE: Solo para exteriores o grandes recintos */}
        {!category.toLowerCase().includes('caballo') && (isB2G || isGoldenCohort) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-[#d4a855]/5 border border-[#d4a855]/30 rounded-2xl mt-6 border-dashed group cursor-pointer"
            onClick={() => window.location.href = `/servicios/edwin-caballo/${metadata.provincia || 'madrid'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Sparkles size={16} className="text-[#d4a855] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#d4a855]">Upgrade Recomendado</span>
              </div>
              <ArrowRight size={14} className="text-[#d4a855] group-hover:translate-x-2 transition-transform" />
            </div>
            <h4 className="text-xs font-black uppercase tracking-tighter text-white mb-2">Show "Cantando a Caballo"</h4>
            <p className="text-[10px] text-white/40 font-medium uppercase leading-tight italic">
              "La experiencia definitiva de arte ecuestre y música vernácula dirigida por el maestro Daniel".
            </p>
          </motion.div>
        )}
      </div>

      <motion.button 
        onClick={handleCheckout}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white text-black font-black py-6 rounded-2xl flex items-center justify-center gap-4 transition-all relative overflow-hidden group/btn"
      >
        <motion.div 
          className="absolute inset-0 bg-[#d4a855] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"
        />
        <div className="relative z-10 flex items-center gap-3">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
          <span className="text-[10px] uppercase tracking-[0.3em]">{getCtaLabel()}</span>
        </div>
      </motion.button>

      <div className="flex justify-between items-center pt-4 border-t border-white/5 opacity-30">
         <Activity size={12} />
         <Shield size={12} className="text-[#d4a855]" />
         <Target size={12} />
      </div>
    </motion.div>
  );
};
