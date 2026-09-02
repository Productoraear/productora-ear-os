'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  UploadCloud, 
  HardDrive, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Crown,
  Eye,
  ArrowUpRight,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { 
  uploadProviderMediaAction, 
  deleteProviderMediaAction, 
  getProviderMediaAction 
} from '@/modules/vendor/actions/mediaActions';

interface MediaItem {
  id: string;
  url: string;
  sizeBytes: number;
  sizeKB: number;
  createdAt: string | Date;
}

interface QuotaInfo {
  tier: string;
  maxMB: number;
  currentMB: number;
  currentBytes: number;
  percentage: number;
  maxPhotos: number;
  currentPhotos: number;
}

export default function VendorMediaPage() {
  const [providerId, setProviderId] = useState('prov-429'); // Proveedor demo homologado (Alberto Navarro)
  const [assets, setAssets] = useState<MediaItem[]>([]);
  const [quota, setQuota] = useState<QuotaInfo>({
    tier: 'FREE',
    maxMB: 15,
    currentMB: 0,
    currentBytes: 0,
    percentage: 0,
    maxPhotos: 10,
    currentPhotos: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar galería al montar
  useEffect(() => {
    loadMedia();
  }, [providerId]);

  const loadMedia = async () => {
    try {
      const res = await getProviderMediaAction(providerId);
      if (res.success && res.data) {
        setAssets(res.data.assets);
        setQuota(res.data.quota);
      }
    } catch (err) {
      console.error('Error cargando medios:', err);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setStatusMessage(null);

    try {
      let successCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await uploadProviderMediaAction(providerId, formData);
        if (res.success) {
          successCount++;
        } else {
          setStatusMessage({
            type: 'error',
            text: res.error === 'STORAGE_QUOTA_EXCEEDED' 
              ? 'Límite de cuota alcanzado (15 MB). Pasa al Plan Gold para 5 GB.'
              : `Error al procesar "${file.name}": ${res.error}`,
          });
          break;
        }
      }

      if (successCount > 0) {
        setStatusMessage({
          type: 'success',
          text: `¡${successCount} imagen(es) comprimida(s) a WebP y guardada(s) con éxito!`,
        });
        await loadMedia();
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Fallo de red en la subida.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (assetId: string) => {
    if (!confirm('¿Deseas eliminar permanentemente esta imagen de tu cuota y escaparate?')) return;
    try {
      const res = await deleteProviderMediaAction(providerId, assetId);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Imagen eliminada y espacio liberado en disco.' });
        await loadMedia();
      } else {
        setStatusMessage({ type: 'error', text: res.error || 'Error al eliminar.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error al eliminar imagen.' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header con Badge y Alertas */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-mono text-amber-300 font-bold uppercase mb-2">
            <Crown size={12} />
            <span>Motor de Compresión C++ (sharp WebP S-Class)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-syne text-white tracking-tight">
            Galería Multimedia & Cuota de Disco
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
            Tus fotos se comprimen en tiempo real con una reducción del 85% de peso para garantizar carga ultra-rápida.
          </p>
        </div>

        <div className="p-4 bg-[#09090d] border border-white/10 rounded-2xl flex items-center gap-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Cuota Usada:</span>
              <span className="text-[#ecb613] font-bold">{quota.currentMB} / {quota.maxMB} MB</span>
            </div>
            <div className="w-40 bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-amber-500 to-[#ecb613] h-full rounded-full transition-all duration-500" 
                style={{ width: `${quota.percentage}%` }} 
              />
            </div>
            <span className="text-[9px] font-mono text-zinc-500 block text-right">{quota.percentage}% consumido</span>
          </div>
        </div>
      </header>

      {/* Alertas de Estado */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-mono ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
            : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-xs underline hover:text-white">
            Cerrar
          </button>
        </div>
      )}

      {/* 📥 Dropzone de Subida S-Class */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 sm:p-12 border-2 border-dashed rounded-3xl text-center space-y-4 transition-all duration-300 cursor-pointer group ${
          isDragging 
            ? 'border-[#ecb613] bg-[#ecb613]/10 scale-[1.01]' 
            : 'border-white/20 hover:border-[#ecb613]/80 bg-[#09090d]/60'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => handleFileUpload(e.target.files)} 
          multiple 
          accept="image/jpeg,image/png,image/webp,image/avif" 
          className="hidden" 
        />

        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#ecb613] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <UploadCloud size={32} />
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-white font-syne">
            {uploading ? 'Comprimiendo y almacenando en servidor...' : 'Arrastra tus fotos de alta resolución o haz clic'}
          </h3>
          <p className="text-xs text-zinc-400 font-light font-mono max-w-md mx-auto">
            Procesado con <strong className="text-white">sharp WebP (q=82)</strong>. Acepta JPG, PNG, WebP. Máximo 10 MB por imagen cruda.
          </p>
        </div>

        <button 
          type="button" 
          disabled={uploading}
          className="px-6 py-3 bg-[#ecb613] text-black font-mono text-xs font-black uppercase rounded-2xl hover:scale-105 transition-all shadow-lg shadow-amber-950/30"
        >
          {uploading ? 'Procesando...' : 'Examinar Archivos Locales'}
        </button>
      </div>

      {/* 🖼️ Grid de Imágenes Cargadas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-xl font-bold font-syne text-white uppercase tracking-tight">
            Archivos en Bóveda ({assets.length} / {quota.maxPhotos} fotos)
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            Aislamiento Tenant: <code className="text-[#ecb613]">/public/uploads/providers/{providerId}</code>
          </span>
        </div>

        {assets.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#09090d] border border-white/5 text-center space-y-2">
            <ImageIcon size={32} className="text-zinc-600 mx-auto" />
            <p className="text-sm text-zinc-400 font-light">Aún no has subido ninguna imagen a tu cuota.</p>
            <p className="text-xs text-zinc-500 font-mono">Usa la zona de subida superior para publicar tu primera fotografía HD.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {assets.map((item) => (
              <div 
                key={item.id} 
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#09090d] space-y-2 hover:border-[#ecb613] transition-all"
              >
                <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                  <img 
                    src={item.url} 
                    alt="Asset proveedor" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded-md text-[9px] font-mono text-[#ecb613] border border-white/10 font-bold">
                    {item.sizeKB} KB
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 p-2 bg-black/70 backdrop-blur-md rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-950/60 border border-white/10 transition-colors"
                    title="Eliminar archivo de disco"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="p-3 pt-1 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>WebP 1080p</span>
                  <a href={item.url} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white flex items-center gap-1">
                    <span>Ver</span>
                    <ArrowUpRight size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Banner de Upgrade a Tier Gold */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/30 via-[#09090d] to-purple-950/20 border border-[#ecb613]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#ecb613] font-bold text-xs font-mono uppercase">
            <Sparkles size={14} />
            <span>Desbloquear Cuota Ilimitada S-Class</span>
          </div>
          <h4 className="text-lg font-bold font-syne text-white">¿Necesitas subir más de 10 fotos o vídeos en 4K?</h4>
          <p className="text-xs text-zinc-400 font-light">
            El Plan Gold incrementa tu almacenamiento a 5.000 MB (50 fotos) y reduce la comisión transaccional al 85/7.5/7.5.
          </p>
        </div>
        <Link 
          href="/vendor/billing" 
          className="px-5 py-3 bg-white hover:bg-[#ecb613] text-black font-mono text-xs font-black uppercase rounded-2xl transition-all shrink-0"
        >
          Ver Planes y Upgrades
        </Link>
      </div>

    </div>
  );
}
