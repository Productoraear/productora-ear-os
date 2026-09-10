'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';

interface PackItem {
  title: string;
  category: string;
  price: number | string;
  features: string[];
  isPremium?: boolean;
}

interface PremiumPacksCarouselProps {
  providerSlug: string;
  providerName: string;
  basePrice: number | string;
  servicesList: string[];
}

export function PremiumPacksCarousel({ providerSlug, providerName, basePrice, servicesList }: PremiumPacksCarouselProps) {
  const parsedBasePrice = typeof basePrice === 'string' ? parseFloat(basePrice.replace(/[^\d.-]/g, '')) || 900 : basePrice;

  const realServices = Array.isArray(servicesList) && servicesList.length > 0 
    ? servicesList.map(s => typeof s === 'string' ? s : (s as any).name || JSON.stringify(s))
    : ['Servicio según descripción y presupuesto'];

  const baseFeatures = realServices.slice(0, Math.ceil(realServices.length / 2));
  const premiumFeatures = realServices;
  
  const packs: PackItem[] = [
    {
      title: 'Pack Original',
      category: 'Tarifa Base Origen',
      price: parsedBasePrice,
      features: baseFeatures.length > 0 ? baseFeatures : ['Servicio Básico (Ver descripción)'],
      isPremium: false,
    },
    {
      title: 'EAR S-Class',
      category: 'Logística + Rider + RC 1M€',
      price: parsedBasePrice * 1.2,
      features: [
        ...premiumFeatures,
        '🛡️ Seguro RC 1.000.000 € Incluido',
        '⚡ Rider S-Class (12 W/pax)',
        '🔒 Bloqueo de Fecha (Price-Lock 72h)',
        '🤝 Gestión Concierge Productora EAR'
      ],
      isPremium: true,
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between px-2">
        <h4 className="text-xl sm:text-2xl font-bold font-syne text-white uppercase tracking-tight">
          Tarifas y Planes
        </h4>
        <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded-full font-bold uppercase tracking-widest hidden sm:inline-block shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          Precios Transparentes (+20% EAR)
        </span>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {packs.map((pack, idx) => (
          <PackCard key={idx} pack={pack} providerSlug={providerSlug} providerName={providerName} />
        ))}
      </motion.div>
    </div>
  );
}

function PackCard({ pack, providerSlug, providerName }: { pack: PackItem, providerSlug: string, providerName: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
      }}
      whileHover={{ scale: 1.02 }}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full flex flex-col justify-between p-6 rounded-3xl overflow-hidden border transition-colors duration-500 ${
        pack.isPremium 
          ? 'bg-[#0a0a0c] border-white/10' 
          : 'bg-[#050508] border-white/5'
      }`}
    >
      {/* Spotlight Effect para el pack Premium */}
      {pack.isPremium && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(236,182,19,0.15), transparent 40%)`,
          }}
        />
      )}

      {/* Brillo del borde */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 rounded-3xl z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${pack.isPremium ? 'rgba(236,182,19,0.4)' : 'rgba(255,255,255,0.1)'}, transparent 40%)`,
        }}
      />

      <div className="relative z-10 space-y-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <span className={`text-[10px] px-3 py-1 rounded-full font-mono uppercase tracking-widest font-bold border ${
              pack.isPremium ? 'text-[#ecb613] bg-[#ecb613]/10 border-[#ecb613]/30 shadow-[0_0_15px_rgba(236,182,19,0.2)]' : 'text-neutral-400 bg-white/5 border-white/10'
            }`}>
              {pack.category}
            </span>
            {pack.isPremium && (
              <motion.span 
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="p-1.5 bg-gradient-to-tr from-[#ecb613] to-amber-300 text-black rounded-lg shadow-lg"
              >
                <Zap size={14} className="fill-black" />
              </motion.span>
            )}
          </div>

          <div>
            <h5 className={`text-2xl font-black font-syne leading-tight ${pack.isPremium ? 'bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-white' : 'text-white'}`}>
              {pack.title}
            </h5>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-black text-white font-mono tracking-tighter">{pack.price}</span>
              <span className="text-xl text-neutral-500 font-mono">€</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 flex-1 mt-6">
          {pack.features.map((feat, fIdx) => {
            const isCustom = feat.includes('🛡️') || feat.includes('⚡') || feat.includes('🔒') || feat.includes('🤝');
            return (
              <motion.li 
                key={fIdx} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (fIdx * 0.05) }}
                className={`flex items-start gap-3 text-sm ${isCustom ? 'text-white font-medium' : 'text-neutral-400 font-light'}`}
              >
                {!isCustom && (
                  <CheckCircle2 size={16} className={pack.isPremium ? 'text-[#ecb613] shrink-0 mt-0.5' : 'text-neutral-600 shrink-0 mt-0.5'} />
                )}
                <span className="leading-relaxed">{typeof feat === 'string' ? feat : (feat as any).name || (feat as any).title || JSON.stringify(feat)}</span>
              </motion.li>
            );
          })}
        </ul>

        {/* Footer / CTA */}
        <div className="pt-6 mt-auto">
          <Link
            href={`/checkout/presupuesto?proveedor=${encodeURIComponent(providerName || providerSlug)}&pack=${encodeURIComponent(pack.title)}&precio=${pack.price}`}
            className={`group relative w-full py-4 rounded-2xl font-mono text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 overflow-hidden transition-all ${
              pack.isPremium 
                ? 'text-black shadow-[0_0_20px_rgba(236,182,19,0.3)]' 
                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
            }`}
          >
            {pack.isPremium && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#ecb613] via-yellow-400 to-[#ecb613] group-hover:scale-[1.05] transition-transform duration-500" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              Solicitar Reserva
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight size={16} />
              </motion.span>
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
