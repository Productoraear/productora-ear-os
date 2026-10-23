'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Crown, Loader2 } from 'lucide-react';

import MediaDragAndDrop from '@/components/vendor/MediaDragAndDrop';
import type { VendorTier } from '@/components/vendor/VendorShowcaseCard';
import { reorderMediaAction, uploadMediaAction } from '@/app/(vendor)/vendor/actions';
import type { VendorMediaAssetRecord } from '@/lib/vendor/vendorCrmTypes';

interface MediaApiItem {
  id: string;
  providerId: string | null;
  vendorId: string | null;
  url: string;
  type: string;
  sizeBytes: number;
  fileName: string | null;
  fileHashSha256: string | null;
  displayOrder: number;
  createdAt: string;
}

interface QuotaInfo {
  quotaUsedMb: number;
  quotaMaxMb: number;
  usagePct: number;
}

interface ProfileApiResponse {
  success: boolean;
  profile: { id?: string; tier?: string } | null;
  quota: QuotaInfo;
  media: MediaApiItem[];
}

const VALID_TIERS: readonly string[] = ['FREE', 'PREMIUM', 'PRO', 'ELITE'];

function toTier(value: string | null | undefined): VendorTier {
  if (value && VALID_TIERS.includes(value)) return value as VendorTier;
  return 'FREE';
}

function toAssetRecord(item: MediaApiItem): VendorMediaAssetRecord {
  return {
    id: item.id,
    providerId: item.providerId,
    vendorId: item.vendorId,
    url: item.url,
    type: item.type,
    sizeBytes: item.sizeBytes,
    fileName: item.fileName,
    fileHashSha256: item.fileHashSha256,
    displayOrder: item.displayOrder,
    createdAt: new Date(item.createdAt),
  };
}

export default function VendorMediaPage() {
  const [vendorId, setVendorId] = useState('');
  const [assets, setAssets] = useState<VendorMediaAssetRecord[]>([]);
  const [tier, setTier] = useState<VendorTier>('FREE');
  const [quota, setQuota] = useState<QuotaInfo>({
    quotaUsedMb: 0,
    quotaMaxMb: 50,
    usagePct: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadMedia = useCallback(async () => {
    const res = await fetch('/api/vendor/profile', { cache: 'no-store' });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error ?? `Error ${res.status}`);
    }
    const data = (await res.json()) as ProfileApiResponse;
    setVendorId(data.profile?.id ?? '');
    setAssets((data.media ?? []).map(toAssetRecord));
    setQuota(data.quota);
    setTier(toTier(data.profile?.tier));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadMedia()
      .then(() => {
        if (!cancelled) setLoadError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Error al cargar los archivos.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadMedia]);

  // Subida real: invoca la Server Action que calcula el hash SHA-256 server-side.
  const handleUpload = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadMediaAction(formData);
      if (!res.ok) throw new Error(res.error);
      await loadMedia();
    },
    [loadMedia],
  );

  // Reordenado persistente vía Server Action (transacción ACID tenant-isolated).
  const handleReorder = useCallback(
    async (orderedIds: string[]) => {
      const res = await reorderMediaAction({ orderedIds });
      if (!res.ok) throw new Error(res.error);
      await loadMedia();
    },
    [loadMedia],
  );

  const usagePct = Math.min(100, Math.max(0, quota.usagePct));

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase text-[#ecb613]">
            <Crown size={12} />
            <span>Escaparate S-Class · Plan {tier}</span>
          </div>
          <h1 className="font-syne text-3xl font-black tracking-tight text-white sm:text-4xl">
            Galería Multimedia & Cuota de Disco
          </h1>
          <p className="mt-1 text-xs font-light text-zinc-400 sm:text-sm">
            Sube por arrastre, ordena la portada con drag & drop y publica tu material en tiempo real.
          </p>
        </div>

        <div className="w-full rounded-2xl border border-white/10 bg-[#09090d] p-4 sm:w-72">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-zinc-400">Cuota usada</span>
            <span className="font-bold text-[#ecb613]">
              {quota.quotaUsedMb} / {quota.quotaMaxMb} MB
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-white/5 bg-white/5">
            <div
              role="progressbar"
              aria-valuenow={usagePct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Cuota de almacenamiento consumida"
              className="h-full rounded-full bg-[#ecb613] transition-all duration-500"
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <span className="mt-1 block text-right font-mono text-[9px] text-zinc-500">
            {usagePct.toFixed(1)}% consumido
          </span>
        </div>
      </header>

      {loadError && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 font-mono text-xs text-rose-300">
          <AlertTriangle size={16} />
          <span>{loadError}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-3xl border border-white/10 bg-[#09090d]/80 p-16 text-white/60">
          <Loader2 className="animate-spin" size={20} />
          <span className="font-mono text-xs uppercase tracking-widest">Cargando galería…</span>
        </div>
      ) : (
        <MediaDragAndDrop
          vendorId={vendorId}
          assets={assets}
          tier={tier}
          onReorder={handleReorder}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}

