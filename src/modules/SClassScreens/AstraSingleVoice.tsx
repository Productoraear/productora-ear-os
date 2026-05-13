'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, limit, orderBy } from 'firebase/firestore';
import { S_CLASS_THEME } from '@/lib/constants/SClassNexus';
import { generateAstraVerdict } from '@/lib/utils/AstraCore';

/**
 * 🌌 ASTRA SINGLE VOICE (S-CLASS REFACTORED)
 * Oráculo neural purificado. Consume lógica del AstraCore.
 */
export default function AstraSingleVoice() {
  const [verdict, setVerdict] = useState<string>("Sincronizando oráculo Astra...");

  useEffect(() => {
    let latestOrder: any = null;
    let latestFleet: any = null;
    let ordersList: any[] = [];

    const qCrm = query(collection(db, 'ear_orders'), orderBy('createdAt', 'desc'), limit(5));
    const unsubCrm = onSnapshot(qCrm, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data());
      ordersList = docs;
      if (docs.length > 0) latestOrder = docs[0];
      setVerdict(generateAstraVerdict(latestOrder, latestFleet, ordersList));
    });

    const qFlota = query(collection(db, 'ear_fleet_telemetry'), limit(1));
    const unsubFlota = onSnapshot(qFlota, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data());
      if (docs.length > 0) latestFleet = docs[0];
      setVerdict(generateAstraVerdict(latestOrder, latestFleet, ordersList));
    });

    return () => {
      unsubCrm();
      unsubFlota();
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }}
      className={`mb-8 p-6 rounded-2xl ${S_CLASS_THEME.glass.gold} relative overflow-hidden group shadow-[0_0_30px_rgba(212,168,85,0.1)]`}
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div className={`w-12 h-12 rounded-full border border-[${S_CLASS_THEME.colors.gold}] flex items-center justify-center shrink-0`}>
          <span className={`material-symbols-outlined text-[${S_CLASS_THEME.colors.gold}] animate-pulse`}>psychology</span>
        </div>
        <div>
          <h4 className={`text-[10px] uppercase tracking-[0.4em] text-[${S_CLASS_THEME.colors.gold}] font-black mb-2 flex items-center gap-2`}>
            La Voz Única (Astra + GeoValidation)
          </h4>
          <p className="text-lg md:text-xl font-serif italic text-white tracking-tight leading-relaxed">
            "{verdict}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}
