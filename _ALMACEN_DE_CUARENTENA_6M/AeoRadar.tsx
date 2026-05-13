"use client";

import React from "react";
import { motion } from "framer-motion";

const AeoRadar = () => {
  return (
    <div className="bg-[#050505] border border-[#d4a855]/20 p-8 rounded-[2rem] relative overflow-hidden shadow-2xl">
      <h3 className="text-white font-black uppercase italic tracking-tighter text-xl md:text-2xl mb-2">
        RADAR <span className="text-[#d4a855]">OMEGA</span>
      </h3>
      <div className="relative h-40 w-40 md:h-48 md:w-48 mx-auto flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }} 
          className="absolute inset-0 border border-[#d4a855]/20 rounded-full" 
        />
        <div className="w-1 h-1 bg-[#d4a855] rounded-full shadow-[0_0_15px_#d4a855] animate-ping" />
      </div>
    </div>
  );
};

export default AeoRadar;
