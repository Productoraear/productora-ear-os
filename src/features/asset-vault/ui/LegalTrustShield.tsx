import React from 'react';
import { Shield, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { AssetStatus } from '../model/types';

interface LegalTrustShieldProps {
  status: AssetStatus;
  label: string;
}

export const LegalTrustShield: React.FC<LegalTrustShieldProps> = ({ status, label }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'VERIFICADO':
        return { color: 'text-green-500', icon: <CheckCircle2 size={16} />, bg: 'bg-green-500/10', border: 'border-green-500/20' };
      case 'PENDIENTE':
        return { color: 'text-yellow-500', icon: <Clock size={16} />, bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
      case 'AUDITANDO':
        return { color: 'text-blue-500', icon: <Shield size={16} className="animate-pulse" />, bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
      default:
        return { color: 'text-white/20', icon: <AlertCircle size={16} />, bg: 'bg-white/5', border: 'border-white/10' };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`px-4 py-2 rounded-full border ${config.border} ${config.bg} flex items-center gap-3 transition-all duration-500 hover:scale-105`}>
      <span className={config.color}>{config.icon}</span>
      <div className="flex flex-col">
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">{label}</span>
        <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>{status}</span>
      </div>
    </div>
  );
};
