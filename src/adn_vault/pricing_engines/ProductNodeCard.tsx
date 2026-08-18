"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ShieldCheck, TrendingUp } from 'lucide-react';
import { useSovereignContext } from '@/shared/context/SovereignContext';

interface ProductNodeProps {
  id: string;
  title: string;
  provider: string;
  roi: string;
  videoUrl?: string;
  price: number;
}

export const ProductNodeCard: React.FC<ProductNodeProps> = ({ 
  title, 
  provider, 
  roi, 
  videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-circuit-board-14115-large.mp4",
  price 
}) => {
  const { signal } = useSovereignContext();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic Button Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);
    
    // Magnetic effect if within 100px of the button area (simplified for the card)
    if (Math.abs(x) < 200 && Math.abs(y) < 200) {
      mouseX.set(x * 0.1);
      mouseY.set(y * 0.1);
    } else {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: magneticX, y: magneticY }}
      className="group relative bg-[#0d0d0d] border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#d4a855]/30 transition-colors"
    >
      <div className="grid grid-cols-4 grid-rows-3 gap-1 h-[400px]">
        {/* Main Video Section (Bento 1) */}
        <div className="col-span-4 row-span-2 relative bg-black overflow-hidden">
          <video 
            src={videoUrl}
            autoPlay 
            muted 
            loop 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
          
          {/* EAR Forensic Seal */}
          <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <ShieldCheck size={14} className="text-[#d4a855]" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Validación Forense EAR</span>
          </div>

          <div className="absolute bottom-6 left-8">
            <h3 className="text-2xl font-black tracking-tighter text-white group-hover:text-[#d4a855] transition-colors">
              {signal.isB2G ? title.replace('Mariachi', 'Protocolo Cultural') : title}
            </h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">{provider}</p>
          </div>
        </div>

        {/* ROI Stats (Bento 2) */}
        <div className="col-span-2 row-span-1 bg-white/5 flex flex-col justify-center px-8 border-r border-white/5">
          <div className="flex items-center gap-2 text-[#d4a855] mb-1">
            <TrendingUp size={12} />
            <span className="text-[10px] font-black uppercase tracking-widest">ROI Proyectado</span>
          </div>
          <span className="text-xl font-black text-white">{roi}</span>
        </div>

        {/* Pricing / Button (Bento 3) */}
        <div className="col-span-2 row-span-1 bg-[#d4a855]/5 flex items-center justify-between px-8">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
              {signal.isB2G ? 'INVERSIÓN SOCIAL' : 'COSTO S-CLASS'}
            </span>
            <span className="text-lg font-black text-white">€{price.toLocaleString()}</span>
          </div>

          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#d4a855] text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(212,168,85,0.3)]"
          >
            CONTRATAR
          </motion.button>
        </div>
      </div>

      {/* Hover Light Effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(212,168,85,0.1)_0%,transparent_70%)]"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
