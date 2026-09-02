import React, { useState } from 'react';
import { Play, Pause, Lock, ShieldCheck, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auditLogger } from '../services/AuditLogger';

interface EncryptedAudioPlayerProps {
  assetId: string;
  name: string;
  audioUrl?: string;
  isLocked: boolean;
}

export const EncryptedAudioPlayer: React.FC<EncryptedAudioPlayerProps> = ({ assetId, name, audioUrl, isLocked }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handlePlay = async () => {
    if (isLocked && !isDecrypting) {
      setIsDecrypting(true);
      await new Promise(r => setTimeout(r, 1500)); // Simulación de desencriptado S-Class
      await auditLogger.logAccess({ assetId, userId: 'CLIENT_IDENTIFIED', action: 'DECRYPT', ipAddress: 'LOCAL_NODE' });
      setIsDecrypting(false);
    }
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      await auditLogger.logAccess({ assetId, userId: 'CLIENT_IDENTIFIED', action: 'VIEW', ipAddress: 'LOCAL_NODE' });
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 relative overflow-hidden group">
      {/* Watermark Dinámica */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-15deg] select-none">
        <div className="text-4xl font-black text-[#D4AF37] whitespace-nowrap">
          EDWIN AGUDELO OFFICIAL MASTER • PROPRIETARY ASSET • {new Date().getFullYear()}
        </div>
      </div>

      <div className="flex items-center gap-6 relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePlay}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
            isPlaying ? 'bg-white text-black' : 'bg-[#D4AF37] text-black shadow-[0_0_30px_rgba(212,175,55,0.3)]'
          }`}
        >
          {isDecrypting ? (
            <ShieldCheck size={24} className="animate-pulse" />
          ) : isPlaying ? (
            <Pause size={24} />
          ) : (
            <Play size={24} className="ml-1" />
          )}
        </motion.button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]/60">Secure Stream</span>
            {isLocked && <Lock size={10} className="text-[#D4AF37]/40" />}
          </div>
          <h4 className="text-lg font-black uppercase tracking-tighter text-white truncate">{name}</h4>
          
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={isPlaying ? { width: '100%' } : { width: 0 }}
              transition={{ duration: 180, ease: 'linear' }}
              className="h-full bg-[#D4AF37]"
            />
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Music size={20} className="text-white/20" />
          <span className="text-[9px] font-mono text-white/40">ENC_V3_SCLASS</span>
        </div>
      </div>
    </div>
  );
};
