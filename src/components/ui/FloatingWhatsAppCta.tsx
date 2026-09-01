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
      className="hidden md:flex fixed bottom-6 left-6 z-[90] bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 hover:shadow-[#25D366]/50 transition-all duration-300 items-center justify-center group"
      aria-label="Contactar por WhatsApp"
      title="Contactar con Soporte Directo WhatsApp"
    >
      <MessageCircle size={24} className="group-hover:animate-pulse" fill="currentColor" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-xs font-mono font-bold whitespace-nowrap text-white">
        +34 693 693 048
      </span>
    </a>
  );
}
