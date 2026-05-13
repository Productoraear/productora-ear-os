import { useState } from 'react';
import { leadService, LeadData } from '../services/SovereignLeadService';

export function useSovereignNurturing() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const processLead = async (data: LeadData) => {
    setIsSubmitting(true);
    try {
      await leadService.captureLead(data);
      setIsSuccess(true);
      
      // Simulación de "Nurturing" inmediato
      console.log(`[NURTURING]: Enviando Dossier S-Class a ${data.email}...`);
      
    } catch (error) {
      console.error('❌ LEAD_PROCESSING_FAILED:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    processLead,
    isSubmitting,
    isSuccess,
    reset: () => setIsSuccess(false)
  };
}
