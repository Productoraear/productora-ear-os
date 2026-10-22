'use client';

import { useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import { RequestToBookModal } from './RequestToBookModal';

export interface RequestToBookButtonProps {
  providerId: string;
  providerName: string;
  category: string;
  defaultBudget?: number;
  location?: string;
  label?: string;
  className?: string;
}

/**
 * CTA reutilizable para incrustar en cualquier tarjeta de proveedor.
 * Gestiona su propio estado de apertura y monta el RequestToBookModal.
 */
export function RequestToBookButton({
  providerId,
  providerName,
  category,
  defaultBudget,
  location,
  label = 'Solicitar Reserva',
  className = '',
}: RequestToBookButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Solicitar reserva de ${providerName}`}
        className={`inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#ecb613] hover:bg-[#f5c538] text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-[#ecb613]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] ${className}`}
      >
        <CalendarCheck size={16} aria-hidden="true" />
        <span>{label}</span>
      </button>

      <RequestToBookModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        providerId={providerId}
        providerName={providerName}
        category={category}
        defaultBudget={defaultBudget}
        location={location}
      />
    </>
  );
}

export default RequestToBookButton;
