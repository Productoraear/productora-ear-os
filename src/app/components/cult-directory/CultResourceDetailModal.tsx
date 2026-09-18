"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  X,
  MapPin,
  Star,
  ShieldCheck,
  Volume2,
  Zap,
  Lock,
  Phone,
  Bookmark,
  ExternalLink,
  CreditCard,
  Building,
  CheckCircle2,
  FileText,
  Share2
} from 'lucide-react';
import { CultDirectoryItem } from './CultResourceCard';

interface CultResourceDetailModalProps {
  item: CultDirectoryItem | null;
  onClose: () => void;
  onToggleBookmark: (item: CultDirectoryItem) => void;
  isBookmarked: boolean;
}

export const CultResourceDetailModal: React.FC<CultResourceDetailModalProps> = ({
  item,
  onClose,
  onToggleBookmark,
  isBookmarked,
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!item || !mounted) return null;

  const images = item.imageUrls && item.imageUrls.length > 0
    ? item.imageUrls
    : ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop'];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/directorio?item=${item.id || item.slug}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const whatsappUrl = `https://wa.me/34693693048?text=${encodeURIComponent(
    `Hola Centralita EAR, solicito disponibilidad y auditoría técnica S-Class para el nodo homologado: "${item.name}" (${item.province}). Tarifa de referencia: ${item.price}.`
  )}`;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#09090b] border border-zinc-800 shadow-2xl flex flex-col font-sans text-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Media Carousel */}
        <div className="relative aspect-[16/9] w-full bg-black overflow-hidden shrink-0">
          <Image
            src={images[activeImageIndex] || images[0]}
            alt={item.name}
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover object-center transition-all duration-300"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/70 pointer-events-none" />

          {/* Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-black/70 border border-white/20 text-[#ecb613] backdrop-blur-md flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {item.badge || 'HOMOLOGACIÓN S-CLASS'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-full bg-black/70 text-zinc-300 hover:text-white border border-white/15 backdrop-blur-md transition-colors"
                title="Copiar enlace directo"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onToggleBookmark(item)}
                className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                  isBookmarked
                    ? 'bg-[#ecb613] text-black border-[#ecb613]'
                    : 'bg-black/70 text-zinc-300 hover:text-white border-white/15'
                }`}
                title={isBookmarked ? 'Guardado en Mi Selección' : 'Guardar en Mi Selección'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-black' : ''}`} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-full bg-black/70 text-zinc-400 hover:text-white border border-white/15 backdrop-blur-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image thumbnails (if multiple) */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {images.slice(0, 6).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-[#ecb613] scale-105' : 'border-white/30 opacity-70'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {copiedLink && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Enlace directo al nodo copiado al portapapeles.
            </div>
          )}

          {/* Title and location */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-syne text-white uppercase tracking-tight">
                {item.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400 mt-2">
                <span className="flex items-center gap-1 text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-[#ecb613]" />
                  {item.province} {item.municipality ? `• ${item.municipality}` : ''}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {item.rating.toFixed(1)} ({item.reviewsCount} reseñas auditadas)
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right bg-zinc-900/90 p-3.5 rounded-2xl border border-zinc-800 shrink-0">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
                Tarifa Oficial S-Class
              </span>
              <span className="text-xl font-mono font-black text-[#ecb613]">
                {item.price}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold mb-2">
              Descripción del Espacio / Activo
            </h3>
            <p className="text-sm text-zinc-300 font-sans leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Technical Specifications Grid (Acoustic & Electrical SSOT) */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#ecb613]" />
              Auditoría Técnica &amp; Telemetría S-Class
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Volume2 className="w-4 h-4 text-[#ecb613]" />
                  <span>Emisión Acústica</span>
                </div>
                <div className="text-sm font-mono font-bold text-white mt-1.5">
                  {item.soundLimitDb ? `< ${item.soundLimitDb} dB SPL` : '< 75 dB SPL'}
                </div>
                <div className="text-[11px] text-zinc-500 font-sans mt-0.5">
                  Rider Bose 12 W/pax con limitador certificado
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Acometida Eléctrica</span>
                </div>
                <div className="text-sm font-mono font-bold text-white mt-1.5">
                  {item.cetacPower || 'CETAC 32A / 16A'}
                </div>
                <div className="text-[11px] text-zinc-500 font-sans mt-0.5">
                  Línea trifásica independiente auditada
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Póliza de Responsabilidad</span>
                </div>
                <div className="text-sm font-mono font-bold text-white mt-1.5">
                  RC 1.000.000 €
                </div>
                <div className="text-[11px] text-zinc-500 font-sans mt-0.5">
                  Cobertura plena ante recintos y eventos
                </div>
              </div>
            </div>
          </div>

          {/* Split Soberano 80/10/10 Legal Shield */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-900/80 border border-zinc-800 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ecb613] uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              Justificación Canónica Split Soberano 80/10/10
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Modelo ético protegido: <strong className="text-white">80%</strong> para el artista o ejecutor directo, <strong className="text-white">10%</strong> para infraestructura y telemetría EAR OS, y <strong className="text-white">10%</strong> destinado a sesiones de neuro-musicoterapia en residencias de mayores vía <strong className="text-white">VIMUME</strong> con deducción fiscal de hasta el <strong className="text-emerald-400">80% en IRPF</strong> (Modelo 182 AEAT, Ley 49/2002).
            </p>
          </div>

          {/* Action Footer: Stripe Deposit & WhatsApp Centralita */}
          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
            <a
              href="/reservar"
              className="w-full sm:flex-1 py-3.5 px-5 rounded-full bg-[#ecb613] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,182,19,0.3)] active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Bloquear Fecha con Depósito 100 € (Stripe)</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3.5 px-5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
            >
              <Phone className="w-4 h-4" />
              <span>Contactar Centralita 24/7</span>
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
