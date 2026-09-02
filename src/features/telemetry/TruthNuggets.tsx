import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Globe, Heart, ShieldCheck, History } from 'lucide-react';

export const TruthNuggets = () => {
  const nuggets = [
    {
      id: 'trayectoria',
      value: '+20 Años',
      label: 'Trayectoria Élite',
      icon: <History size={16} className="text-[#d4a855]" />,
      detail: 'Ininterrumpida desde Amagá (1975) hasta el circuito VIP europeo.',
    },
    {
      id: 'paises',
      value: '12 Países',
      label: 'Cobertura S-Class',
      icon: <Globe size={16} className="text-blue-400" />,
      detail: '37 conciertos internacionales certificados. Gladiador 2021.',
    },
    {
      id: 'vimume',
      value: 'Programa 1',
      label: 'Innovación Social',
      icon: <Heart size={16} className="text-pink-500" />,
      detail: 'Protocolo VIMUME activo para restauración cognitiva.',
    },
    {
      id: 'transparencia',
      value: '100%',
      label: 'Soberanía de Datos',
      icon: <ShieldCheck size={16} className="text-green-500" />,
      detail: 'Cero reseñas ficticias. Operativa en Ledger Inmutable.',
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
      {nuggets.map((nugget, i) => (
        <motion.div
          key={nugget.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-panel p-6 border border-white/5 rounded-2xl flex flex-col items-center text-center group hover:border-[#d4a855]/30 transition-all duration-500 bg-white/[0.01]"
        >
          <div className="p-3 bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform">
            {nugget.icon}
          </div>
          <span className="text-2xl md:text-3xl font-black text-white italic tracking-tighter mb-1">
            {nugget.value}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-3">
            {nugget.label}
          </span>
          <p className="text-[9px] text-white/30 leading-relaxed uppercase font-medium">
            {nugget.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
