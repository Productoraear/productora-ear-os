"use client";
import React from 'react';
import { motion } from 'framer-motion';

const CinematicEntrance: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="flex flex-col items-center justify-center"
    >
      {children}
    </motion.div>
  );
};

export default CinematicEntrance;