'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface PremiumMediaCarouselProps {
  images: string[];
  providerName: string;
}

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    };
  }
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export function PremiumMediaCarousel({ images, providerName }: PremiumMediaCarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);

  const safeImages = images && images.length > 0 
    ? images 
    : ['https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop'];

  const imageIndex = Math.abs(page % safeImages.length);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[480px] rounded-3xl overflow-hidden bg-[#050505] border border-white/5 group">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={page}
          src={safeImages[imageIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
          alt={`${providerName} - Gallery Image`}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none" />

      {/* Controles Glassmorphism */}
      {safeImages.length > 1 && (
        <>
          <button
            onClick={() => paginate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-black/50 hover:scale-110 active:scale-95 z-10"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => paginate(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-black/50 hover:scale-110 active:scale-95 z-10"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {safeImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage([idx, idx > imageIndex ? 1 : -1])}
                className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                  idx === imageIndex 
                    ? 'w-8 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' 
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 flex items-center gap-2 text-xs font-mono text-white z-10 shadow-lg">
            <ImageIcon size={14} className="text-[#AAD6CD]" />
            <span>{imageIndex + 1} / {safeImages.length}</span>
          </div>
        </>
      )}
    </div>
  );
}
