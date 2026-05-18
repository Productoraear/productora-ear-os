'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, limit, orderBy } from 'firebase/firestore';
import { supabase } from '@/lib/services/auth_nexus'; // Puente Supabase
import AstraSingleVoice from './AstraSingleVoice';
import { S_CLASS_THEME, OPERATIONAL_PROTOCOLS } from '@/lib/constants/SClassNexus';
import { SClassOrder, SClassFleetUnit, SClassVendor, OmnibusTab } from '@/types/SClass';

/**
 * EAR OS GOLD - OMNIBUS TRACKER (S-CLASS)
 * Versión 2.5: Auditoría Forense de Marketplace integrada.
 */
export default function OmnibusTracker() {
  const [activeTab, setActiveTab] = useState<OmnibusTab>('CRM');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [crmData, setCrmData] = useState<SClassOrder[]>([]);
  const [flotaData, setFlotaData] = useState<SClassFleetUnit[]>([]);
  const [marketData, setMarketData] = useState<SClassVendor[]>([]);
  const [totalVolume, setTotalVolume] = useState<number>(0);
  const [isLoadingMarket, setIsLoadingMarket] = useState(false);

  useEffect(() => {
    // Pipeline CRM
    const qCrm = query(collection(db, 'ear_orders'), orderBy('createdAt', 'desc'), limit(10));
    const unsubCrm = onSnapshot(qCrm, (snapshot) => {
      const data: SClassOrder[] = [];
      let total = 0;
      snapshot.forEach(doc => {
        const d = doc.data() as SClassOrder;
        data.push({ ...d, id: doc.id });
        if (d.amount) total += Number(d.amount);
      });
      setCrmData(data.length > 0 ? data : [{ id: '1', client: 'Boda Imperial', status: 'CERRADO', amount: 18500, location: 'Madrid', createdAt: '' }]);
      setTotalVolume(total > 0 ? total : 18500);
    });

    // Pipeline Flota
    const qFlota = query(collection(db, 'ear_fleet_telemetry'), limit(5));
    const unsubFlota = onSnapshot(qFlota, (snapshot) => {
      const data: SClassFleetUnit[] = [];
      snapshot.forEach(doc => data.push({ ...doc.data() as SClassFleetUnit, id: doc.id }));
      setFlotaData(data.length > 0 ? data : [{ id: 'f1', unit: 'Velvet Orchestral', status: 'MISSION_ACTIVE', location: 'Madrid', lastUpdate: '' }]);
    });

    return () => { unsubCrm(); unsubFlota(); };
  }, []);

  // Auditoría Forense Supabase (MARKET)
  useEffect(() => {
    if (activeTab === 'MARKET') {
      fetchMarketData();
    }
  }, [activeTab]);

  const fetchMarketData = async () => {
    setIsLoadingMarket(true);
    const { data, error } = await supabase
      .from('ear_market_vendors')
      .select('*')
      .limit(100);
    
    if (!error && data) {
      setMarketData(data as SClassVendor[]);
    }
    setIsLoadingMarket(false);
  };

  return (
    <div className={`bg-[${S_CLASS_THEME.colors.onyx}] p-8 rounded-[2rem] border border-[${S_CLASS_THEME.colors.gold}]/20 shadow-2xl relative overflow-hidden min-h-[600px]`}>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start mb-8 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">
            Omnibus <span className={`text-[${S_CLASS_THEME.colors.gold}]`}>Tracker</span>
          </h2>
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-bold mt-1">Unified Operational Matrix</p>
        </div>
        <div className="text-right">
          <p className={`text-[10px] text-[${S_CLASS_THEME.colors.gold}] uppercase font-mono`}>Portfolio Volume</p>
          <h3 className="text-4xl font-black text-white">€{(totalVolume / 1000).toFixed(1)}k</h3>
        </div>
      </div>

      <AstraSingleVoice />

      {/* Nav Tabs */}
      <div className="relative z-10 flex flex-wrap gap-4 mb-8">
        {OPERATIONAL_PROTOCOLS.tabs.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as OmnibusTab)}
            className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${activeTab === tab ? `bg-[${S_CLASS_THEME.colors.gold}] text-black shadow-[0_0_20px_rgba(212,168,85,0.4)]` : 'bg-white/5 text-white/40'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'CRM' && (
            <motion.div key="crm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {!isUnlocked ? (
                <div className={`p-12 border border-[${S_CLASS_THEME.colors.gold}]/30 bg-[${S_CLASS_THEME.colors.gold}]/5 rounded-3xl flex flex-col items-center text-center`}>
                  <span className={`material-symbols-outlined text-4xl text-[${S_CLASS_THEME.colors.gold}] mb-4`}>lock</span>
                  <h4 className="text-xl font-black uppercase text-white mb-2">Protocolo de Sigilo Activado</h4>
                  <p className="text-[10px] text-white/40 mb-6 uppercase tracking-widest">Validación de 1€ requerida para CRM Soberano</p>
                  <button onClick={() => setIsUnlocked(true)} className={`px-8 py-3 bg-[${S_CLASS_THEME.colors.gold}] text-black font-black rounded-full hover:scale-105 transition-transform`}>
                    VALIDAR ACCESO (1€)
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {crmData.map(item => (
                    <div key={item.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center group hover:border-[#d4a855]/40 transition-all">
                      <div>
                        <div className="text-sm font-black text-white group-hover:text-[#d4a855] transition-colors">{item.client}</div>
                        <div className="text-[10px] text-white/20 font-mono mt-1">{item.status}</div>
                      </div>
                      <div className={`text-lg font-black text-[${S_CLASS_THEME.colors.gold}]`}>€{item.amount?.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'MARKET' && (
            <motion.div key="market" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-white/40">Auditoría B2B: 100 Registros de Élite</h4>
                {isLoadingMarket && <div className="w-4 h-4 border-2 border-[#d4a855] border-t-transparent rounded-full animate-spin" />}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {marketData.map(v => (
                  <div key={v.id} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-[#d4a855]/30 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-black text-white group-hover:text-[#d4a855] truncate">{v.name}</span>
                      <span className={`text-[8px] px-2 py-1 rounded-full font-black ${v.is_claimed ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {v.is_claimed ? 'VERIFICADO' : 'PENDIENTE'}
                      </span>
                    </div>
                    <div className="flex gap-4 text-[9px] text-white/30 uppercase font-bold">
                      <span>{v.category}</span>
                      <span className="text-[#d4a855]">{v.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
