"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  X,
  Bookmark,
  Trash2,
  Phone,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { CultDirectoryItem } from './CultResourceCard';

interface CultBookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: CultDirectoryItem[];
  onRemoveBookmark: (id: string) => void;
  onClearBookmarks: () => void;
  onOpenDetail: (item: CultDirectoryItem) => void;
}

export const CultBookmarksDrawer: React.FC<CultBookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onRemoveBookmark,
  onClearBookmarks,
  onOpenDetail,
}) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const namesList = bookmarks.map((b) => `• ${b.name} (${b.province}) - ${b.price}`).join('\n');
  const bulkWhatsappUrl = `https://wa.me/34693693048?text=${encodeURIComponent(
    `Hola Centralita EAR, he guardado los siguientes ${bookmarks.length} nodos en mi Bóveda S-Class y solicito disponibilidad conjunta y auditoría técnica:\n\n${namesList}\n\n¿Podemos coordinar propuesta unificada con depósito Stripe de 100 €?`
  )}`;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md h-full bg-[#09090b] border-l border-zinc-800 shadow-2xl flex flex-col font-sans text-zinc-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#ecb613]/10 text-[#ecb613]">
              <Bookmark className="w-5 h-5 fill-[#ecb613]" />
            </div>
            <div>
              <h3 className="font-syne font-bold text-base text-white uppercase tracking-tight">
                Mi Selección Guardada
              </h3>
              <p className="text-xs font-mono text-zinc-500">
                {bookmarks.length} {bookmarks.length === 1 ? 'nodo guardado' : 'nodos guardados'} en local
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bookmarks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600">
                <Bookmark className="w-8 h-8" />
              </div>
              <p className="font-syne font-bold text-white text-base">
                Tu Bóveda está vacía
              </p>
              <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                Haz clic en el icono de marcador de cualquier tarjeta del directorio para guardar fincas, solistas o catering en tu lista.
              </p>
            </div>
          ) : (
            bookmarks.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onClose();
                  onOpenDetail(item);
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/90 hover:border-[#ecb613]/40 transition-all cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-black shrink-0 border border-zinc-800">
                  <Image
                    src={item.imageUrls[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=300&auto=format&fit=crop'}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-syne font-bold text-xs text-white truncate group-hover:text-[#ecb613] transition-colors">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#ecb613]" />
                    <span className="truncate">{item.province}</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-[#ecb613] mt-1">
                    {item.price}
                  </div>
                </div>

                {/* Delete action */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveBookmark(item.id);
                  }}
                  className="p-2 text-zinc-500 hover:text-rose-400 transition-colors"
                  title="Eliminar de guardados"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {bookmarks.length > 0 && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 space-y-2.5">
            <a
              href={bulkWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Solicitar Auditoría en Bloque ({bookmarks.length})</span>
            </a>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <button
                type="button"
                onClick={onClearBookmarks}
                className="text-zinc-500 hover:text-rose-400 transition-colors"
              >
                Limpiar Bóveda
              </button>
              <span className="text-zinc-500">
                Sincronización LocalStorage OK
              </span>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
