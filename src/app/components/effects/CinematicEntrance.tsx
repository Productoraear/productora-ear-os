"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface CinematicEntranceProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const CinematicEntrance = ({ children, delay = 0, className = "" }: CinematicEntranceProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const CinematicTitle = ({ text, className = "" }: { text: string, className?: string }) => {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-[#fff] to-[#8a6b0d] font-syne font-bold tracking-tighter ${className}`}
    >
      {text}
    </motion.h1>
  );
};

export default CinematicEntrance;
