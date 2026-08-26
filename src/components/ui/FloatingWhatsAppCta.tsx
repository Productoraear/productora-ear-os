'use client';
import { MessageCircle } from 'lucide-react';

export function FloatingWhatsAppCta() {
  const whatsappNumber = "34693693048";
  const defaultMessage = "Hola, me gustaría recibir información sobre los servicios de Productora EAR.";

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-[#25D366]/50 transition-all duration-300 flex items-center justify-center group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} className="group-hover:animate-pulse" fill="currentColor" />
    </a>
  );
}
