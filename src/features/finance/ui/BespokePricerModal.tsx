'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { BespokePricer } from './BespokePricer';
import { useSharedContext } from '@/app/context/SharedContext';

/**
 * 🏛️ BESPOKE PRICER MODAL - EAR OS GOLD
 * Contenedor de alta fidelidad para el motor de precios dinámico.
 */
export const BespokePricerModal: React.FC = () => {
  const { isPricerOpen, setIsPricerOpen, pricerData } = useSharedContext();

  if (!pricerData) return null;

  return (
    <AnimatePresence>
      {isPricerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPricerOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg z-10"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsPricerOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <BespokePricer 
              category={pricerData.category} 
              basePrice={pricerData.basePrice} 
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
