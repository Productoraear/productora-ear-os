import React from 'react';
import { LeadCaptureOverlay } from '@/features/marketing/ui/LeadCaptureOverlay';
import { calculateLeadScore } from '../model/leadScoreCalculator';
import { sendInstitutionalWebhook } from '@/shared/utils/webhookSender';

interface LeadCaptureMasterProps {
  isOpen: boolean;
  onClose: () => void;
  assetName: string;
}

export const LeadCaptureMaster: React.FC<LeadCaptureMasterProps> = ({ isOpen, onClose, assetName }) => {
  const handleLeadCaptured = async (email: string, name?: string) => {
    const analytics = calculateLeadScore(email);
    
    // Si es un perfil institucional, disparamos el webhook pesado
    if (analytics.category === 'GOVERNMENT' || analytics.isVIP) {
      await sendInstitutionalWebhook(email, assetName, analytics);
    }
    
    console.log(`[LEAD_MASTER_PROCESSED]: ${email} | Score: ${analytics.score}`);
    onClose();
  };

  return (
    <LeadCaptureOverlay 
      isOpen={isOpen} 
      onClose={onClose} 
      onSuccess={handleLeadCaptured}
      assetName={assetName}
    />
  );
};
