import React from 'react';
import { Image as ImageIcon, UploadCloud, HardDrive, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function VendorMediaPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black font-syne text-white tracking-tight">Galería Multimedia S-Class</h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
          Sube tus imágenes de alta resolución (formato WebP/AVIF optimizado, máx 10 MB por archivo).
        </p>
      </header>

      {/* Zona de Subida */}
      <div className="p-8 sm:p-12 border-2 border-dashed border-white/20 hover:border-[#ecb613] rounded-3xl bg-[#09090d]/60 text-center space-y-4 transition-all group cursor-pointer">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#ecb613] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
          <UploadCloud size={32} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white font-syne">Arrastra tus fotos o haz clic para subir</h3>
          <p className="text-xs text-zinc-400 font-light font-mono">
            Compresión automática en WebP/AVIF · Cuota disponible: 10.8 MB / 15 MB
          </p>
        </div>
        <button className="px-6 py-3 bg-white text-black font-mono text-xs font-black uppercase rounded-xl hover:bg-[#ecb613] transition-colors">
          Seleccionar Archivos
        </button>
      </div>
    </div>
  );
}
