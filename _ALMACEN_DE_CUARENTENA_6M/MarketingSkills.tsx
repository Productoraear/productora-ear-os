"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, ArrowUpRight } from "lucide-react";

export default function MarketingSkills() {
  return (
    <Link href="/arsenal" className="col-span-2">
      <motion.div whileHover={{ scale: 1.02 }} className="surface-card p-6 flex items-center justify-between group">
        <div className="flex gap-5 items-center">
          <div className="w-16 h-16 rounded-2xl bg-obsidian border border-white/5 flex items-center justify-center group-hover:border-gold/50 transition-all">
            <Zap size={28} className="text-gold" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-lg font-black uppercase">Habilidades de Marketing</h4>
            <p className="text-xs text-on-surface-muted leading-none">Descubre nuestras habilidades especializadas en marketing.</p>
          </div>
        </div>
        <ArrowUpRight size={20} className="text-on-surface-muted group-hover:text-gold transition-colors" />
      </motion.div>
    </Link>
  );
}
