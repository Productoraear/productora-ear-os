'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HummingbirdFlight() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Evita que Framer Motion intente renderizar atributos SVG con valores 'undefined' durante la hidratación
  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute"
      >
        <svg width="40" height="40" viewBox="0 0 100 100">
          <motion.circle
            cx="50"
            cy="50"
            r={15} // Siempre definir un valor explícito o fallback
            fill="none"
            stroke="#ecb613"
            strokeWidth="2"
          />
          <motion.path
            d="M 20 50 Q 50 10 80 50 T 20 50" // Asegurar siempre un comando M/m válido
            fill="none"
            stroke="#ecb613"
            strokeWidth="1.5"
          />
        </svg>
      </motion.div>
    </div>
  );
}