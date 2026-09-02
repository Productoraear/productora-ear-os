import React from 'react';
import { FileText, Download, Lock, ExternalLink, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';
import { VaultAsset } from '../model/types';
import { LegalTrustShield } from './LegalTrustShield';
import { auditLogger } from '../services/AuditLogger';
import { LeadCaptureMaster } from '@/features/lead-capture/ui/LeadCaptureMaster';

interface AssetItemProps {
  asset: VaultAsset;
}

export const AssetItem: React.FC<AssetItemProps> = ({ asset }) => {
  const [showOverlay, setShowOverlay] = React.useState(false);

  const handleDownload = async () => {
    if (asset.isEncrypted) {
      setShowOverlay(true);
      return;
    }
    
    await auditLogger.logAccess({ assetId: asset.id, userId: 'ANONYMOUS_ACCESS', action: 'DOWNLOAD', ipAddress: 'LOCAL_NODE' });
    if (asset.url) {
      window.open(asset.url, '_blank');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-3xl border border-white/5 bg-white/[0.01] hover:border-[#D4AF37]/30 transition-all group flex flex-col gap-6"
    >
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-[#D4AF37] transition-colors">
          {asset.category === 'LEGAL' ? <FileText size={24} /> : <HardDrive size={24} />}
        </div>
        <LegalTrustShield status={asset.status} label={asset.category} />
      </div>

      <div>
        <h5 className="text-sm font-black uppercase tracking-widest text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
          {asset.name}
        </h5>
        <div className="flex items-center gap-3 text-[10px] font-bold text-white/20 uppercase tracking-widest">
          <span>{asset.size}</span>
          <span>•</span>
          <span>Actualizado: {asset.updatedAt}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-white/5">
        <button 
          onClick={handleDownload}
          className="flex-1 py-3 bg-white/5 hover:bg-[#D4AF37] hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
        >
          {asset.isEncrypted ? <Lock size={12} /> : <Download size={12} />} Descargar
        </button>
        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all">
          <ExternalLink size={14} />
        </button>
      </div>

      <LeadCaptureMaster 
        isOpen={showOverlay} 
        onClose={() => setShowOverlay(false)} 
        assetName={asset.name}
      />
    </motion.div>
  );
};
