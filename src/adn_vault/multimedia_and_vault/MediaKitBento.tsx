import React from 'react';
import { motion } from 'framer-motion';
import { VaultAsset } from '../model/types';
import { AssetItem } from './AssetItem';
import { EncryptedAudioPlayer } from './EncryptedAudioPlayer';

const MOCK_ASSETS: VaultAsset[] = [
  { id: 'RC-2024', name: 'Seguro Responsabilidad Civil 2024', category: 'LEGAL', status: 'VERIFICADO', size: '2.4 MB', updatedAt: '12/04/2026', isEncrypted: false },
  { id: 'RT-GALA', name: 'Rider Técnico - Mariachi Gala', category: 'TECHNICAL', status: 'AUDITANDO', size: '1.8 MB', updatedAt: '02/05/2026', isEncrypted: false },
  { id: 'MASTER-AC', name: 'Acompáñame (Official Master 48kHz)', category: 'AUDIO', status: 'VERIFICADO', size: '45 MB', updatedAt: '20/03/2026', isEncrypted: true },
  { id: 'CON-B2G', name: 'Plantilla Contrato Institucional V3', category: 'CONTRACT', status: 'PENDIENTE', size: '0.5 MB', updatedAt: '13/05/2026', isEncrypted: true },
];

export const MediaKitBento: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 auto-rows-[200px]">
      {/* Elemento Destacado: Player de Audio */}
      <div className="md:col-span-2 md:row-span-1">
        <EncryptedAudioPlayer 
          assetId="MASTER-AC" 
          name="Acompáñame - Official Master" 
          isLocked={true} 
        />
      </div>

      {/* Grid Bento de Activos */}
      {MOCK_ASSETS.map((asset, i) => (
        <div key={asset.id} className={i === 1 ? 'md:col-span-2' : ''}>
          <AssetItem asset={asset} />
        </div>
      ))}

      {/* Sección B2G / Wiki */}
      <motion.div 
        whileHover={{ scale: 0.98 }}
        className="md:col-span-4 bg-gradient-to-r from-[#D4AF37]/20 to-transparent p-10 rounded-[3rem] border border-[#D4AF37]/10 flex flex-col justify-center gap-4 cursor-pointer"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">Portal B2G / Wiki Nupcial</span>
        <h3 className="text-4xl font-black uppercase tracking-tighter text-white">Acceso a la Bóveda del <span className="text-[#D4AF37]">Conocimiento</span></h3>
        <p className="text-white/40 text-sm max-w-2xl uppercase font-bold tracking-widest">
          Documentación técnica, protocolos de seguridad y certificaciones institucionales para promotores y ayuntamientos.
        </p>
      </motion.div>
    </div>
  );
};
