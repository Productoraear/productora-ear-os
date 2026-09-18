"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Plus,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Volume2,
  Zap,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { CultResourceCard, CultDirectoryItem } from './CultResourceCard';

interface CultSubmitListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated?: (item: CultDirectoryItem) => void;
}

export const CultSubmitListingModal: React.FC<CultSubmitListingModalProps> = ({
  isOpen,
  onClose,
  onListingCreated,
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'finca',
    province: 'Madrid',
    municipality: '',
    price: 'Desde 450,00 €',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
    contactPhone: '',
    contactEmail: '',
    soundLimitDb: 75,
    cetacPower: 'CETAC 32A',
    agreeSplit: true,
    agreeAcoustic: true,
    agreeStripe: true,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  // Objeto reactivo para la tarjeta de vista previa en vivo
  const previewItem: CultDirectoryItem = {
    id: 'preview-node-live',
    name: formData.name.trim() || 'Nombre de tu Finca o Proyecto',
    category: formData.category,
    province: formData.province || 'Madrid',
    municipality: formData.municipality || 'Localidad',
    description:
      formData.description.trim() ||
      'Espacio homologado S-Class con acústica optimizada, acometida eléctrica independiente y seguro de RC de 1.000.000 €.',
    price: formData.price.trim() || 'Desde 350,00 €',
    rating: 5.0,
    reviewsCount: 1,
    imageUrls: [formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop'],
    isPreferred: true,
    badge: 'CANDIDATO S-CLASS',
    verified: true,
    soundLimitDb: Number(formData.soundLimitDb),
    cetacPower: formData.cetacPower,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      const newItem: CultDirectoryItem = {
        ...previewItem,
        id: `node-${Date.now()}`,
        badge: 'AUDITORÍA PENDIENTE',
      };
      if (onListingCreated) {
        onListingCreated(newItem);
      }
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1200);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#09090b] border border-zinc-800 shadow-2xl flex flex-col font-sans text-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#ecb613]/10 text-[#ecb613]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-syne text-white uppercase tracking-tight">
                Proponer Nodo • Alta en Directorio S-Class
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                Auditoría acústica 12 W/pax, homologación técnica y adhesión al Split Soberano 80/10/10
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form and Live Card Preview Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: 7 cols */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            {isSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Propuesta enviada con éxito. El nodo ha sido encolado para auditoría en el Call Center y telemetría IA.</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">
                Nombre de la Finca, Artista o Empresa *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Palacio de Galiana / Cuarteto Clásico Imperial"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#ecb613]/60"
              />
            </div>

            {/* Category & Province */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">
                  Categoría de Gremio *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none focus:border-[#ecb613]/60"
                >
                  <option value="finca">Finca &amp; Espacio Singular</option>
                  <option value="musica">Música &amp; Artista Solista</option>
                  <option value="sonido">Sonido &amp; Iluminación</option>
                  <option value="catering">Catering de Gala</option>
                  <option value="foto">Fotografía &amp; Vídeo</option>
                  <option value="wedding">Wedding Planner</option>
                  <option value="senior_care">Centro Senior VIMUME</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">
                  Provincia *
                </label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  placeholder="Ej. Toledo / Madrid"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#ecb613]/60"
                />
              </div>
            </div>

            {/* Price & Image URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">
                  Tarifa de Referencia S-Class *
                </label>
                <input
                  type="text"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Ej. Desde 350,00 €"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#ecb613]/60"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">
                  URL de Fotografía Principal
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#ecb613]/60 text-xs"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">
                Descripción Técnica y Servicios
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalla espacios, acústica, potencia o rider..."
                className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#ecb613]/60 resize-none"
              />
            </div>

            {/* Contact Persona */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+34 600 000 000"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#ecb613]/60 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">
                  Email Profesional
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="contacto@finca.es"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#ecb613]/60 font-mono text-xs"
                />
              </div>
            </div>

            {/* SSOT Legal Compliance Checkboxes */}
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreeSplit}
                  onChange={(e) => setFormData({ ...formData, agreeSplit: e.target.checked })}
                  className="mt-0.5 rounded accent-[#ecb613]"
                />
                <span className="text-zinc-300">
                  Acepto el <strong>Split Soberano 80/10/10</strong> (80% ejecutor / 10% EAR OS / 10% VIMUME con deducción fiscal AEAT).
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreeAcoustic}
                  onChange={(e) => setFormData({ ...formData, agreeAcoustic: e.target.checked })}
                  className="mt-0.5 rounded accent-[#ecb613]"
                />
                <span className="text-zinc-300">
                  Certifico rider acústico <strong>Bose 12 W/pax</strong> y límite de emisión <strong>&lt; 75 dB SPL</strong>.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreeStripe}
                  onChange={(e) => setFormData({ ...formData, agreeStripe: e.target.checked })}
                  className="mt-0.5 rounded accent-[#ecb613]"
                />
                <span className="text-zinc-300">
                  Acepto bloqueo de fecha mediante depósito inmutable de <strong>100,00 € en Stripe (Price-Lock SHA-256)</strong>.
                </span>
              </label>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="w-full py-3.5 rounded-full bg-[#ecb613] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,182,19,0.3)] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Auditan y Encolando Nodo...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Publicar Propuesta en Directorio S-Class</span>
                </>
              )}
            </button>
          </form>

          {/* Right Column: Live Card Preview (Cult UI Signature Pattern) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#ecb613] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Vista Previa en Tiempo Real
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                Live Card Preview
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950/90 border border-zinc-800/80 shadow-inner">
              <CultResourceCard
                item={previewItem}
                isBookmarked={false}
                onOpenDetail={() => {}}
                onToggleBookmark={() => {}}
              />
            </div>

            <p className="text-[11px] font-sans text-zinc-500 text-center leading-relaxed">
              La tarjeta se actualizará instantáneamente conforme introduzcas tus especificaciones técnicas y fotografías.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
