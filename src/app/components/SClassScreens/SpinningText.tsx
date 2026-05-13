'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SpinningTextProps {
  text: string;
  radius?: number;
  fontSize?: string;
  className?: string;
}

export const SpinningText: React.FC<SpinningTextProps> = ({ 
  text, 
  radius = 60, 
  fontSize = "10px",
  className = "" 
}) => {
  const characters = text.split("");
  const angleStep = 360 / characters.length;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: radius * 2, height: radius * 2 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        {characters.map((char, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-0 origin-bottom font-black uppercase tracking-widest text-[#d4a855]"
            style={{
              fontSize: fontSize,
              height: radius,
              transform: `translateX(-50%) rotate(${i * angleStep} deg)`,
              transformOrigin: `0 ${radius}px`
            }}
          >
            {char}
          </span>
        ))}
      </motion.div>
    </div>
  );
};
