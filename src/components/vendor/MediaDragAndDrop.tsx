"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  AudioLines,
  FileText,
  Film,
  GripVertical,
  Image as ImageIcon,
  Loader2,
  Pause,
  Play,
  UploadCloud,
} from "lucide-react";

import type { VendorTier } from "@/components/vendor/VendorShowcaseCard";
import type { VendorMediaAssetRecord } from "@/lib/vendor/vendorCrmTypes";

type AssetKind = "IMAGE" | "AUDIO" | "DOCUMENT" | "VIDEO" | "OTHER";

interface TierLimits {
  maxImages: number;
  maxAudio: number;
  maxDocuments: number;
}

const TIER_LIMITS: Record<VendorTier, TierLimits> = {
  FREE: { maxImages: 3, maxAudio: 1, maxDocuments: 1 },
  PREMIUM: { maxImages: 15, maxAudio: 5, maxDocuments: 3 },
  PRO: { maxImages: 30, maxAudio: 10, maxDocuments: 5 },
  ELITE: { maxImages: 60, maxAudio: 20, maxDocuments: 10 },
};

const TIER_LABEL: Record<VendorTier, string> = {
  FREE: "Free",
  PREMIUM: "Premium",
  PRO: "Pro",
  ELITE: "Elite",
};

function resolveAssetKind(type: string): AssetKind {
  switch (type.toUpperCase()) {
    case "IMAGE":
      return "IMAGE";
    case "AUDIO":
      return "AUDIO";
    case "DOCUMENT":
    case "PDF":
      return "DOCUMENT";
    case "VIDEO":
      return "VIDEO";
    default:
      return "OTHER";
  }
}

function fileToKind(file: File): AssetKind {
  if (file.type.startsWith("image/")) return "IMAGE";
  if (file.type.startsWith("audio/")) return "AUDIO";
  if (file.type === "application/pdf") return "DOCUMENT";
  if (file.type.startsWith("video/")) return "VIDEO";
  return "OTHER";
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  const next = [...list];
  if (from < 0 || from >= next.length) return next;
  const [moved] = next.splice(from, 1);
  if (moved === undefined) return next;
  next.splice(to, 0, moved);
  return next;
}

function limitLabel(kind: AssetKind): string {
  switch (kind) {
    case "IMAGE":
      return "fotos";
    case "AUDIO":
      return "demos de audio";
    case "DOCUMENT":
      return "rider PDF";
    default:
      return "archivos";
  }
}

interface MediaDragAndDropProps {
  vendorId: string;
  assets: VendorMediaAssetRecord[];
  tier: VendorTier;
  onReorder: (orderedIds: string[]) => Promise<void>;
  onUpload: (file: File) => Promise<void>;
}

export default function MediaDragAndDrop({
  vendorId,
  assets,
  tier,
  onReorder,
  onUpload,
}: MediaDragAndDropProps) {
  const [items, setItems] = useState<VendorMediaAssetRecord[]>(() =>
    [...assets].sort((a, b) => a.displayOrder - b.displayOrder),
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  const limits = TIER_LIMITS[tier];

  const counts = useMemo(() => {
    const acc: Record<AssetKind, number> = {
      IMAGE: 0,
      AUDIO: 0,
      DOCUMENT: 0,
      VIDEO: 0,
      OTHER: 0,
    };
    for (const item of items) {
      acc[resolveAssetKind(item.type)] += 1;
    }
    return acc;
  }, [items]);

  useEffect(() => {
    if (dragIndex !== null) return;
    setItems([...assets].sort((a, b) => a.displayOrder - b.displayOrder));
  }, [assets, dragIndex]);

  const isCategoryFull = useCallback(
    (kind: AssetKind): boolean => {
      switch (kind) {
        case "IMAGE":
          return counts.IMAGE >= limits.maxImages;
        case "AUDIO":
          return counts.AUDIO >= limits.maxAudio;
        case "DOCUMENT":
          return counts.DOCUMENT >= limits.maxDocuments;
        default:
          return true;
      }
    },
    [counts, limits],
  );

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;

      setUploading(true);
      setUploadError(null);

      const errors: string[] = [];

      for (const file of files) {
        const kind = fileToKind(file);
        if (kind === "OTHER" || kind === "VIDEO") {
          errors.push(
            `"${file.name}": tipo no permitido (JPG/PNG/WebP, MP3/WAV o PDF).`,
          );
          continue;
        }
        if (isCategoryFull(kind)) {
          errors.push(
            `"${file.name}": límite de ${limitLabel(kind)} alcanzado en el plan ${TIER_LABEL[tier]}.`,
          );
          continue;
        }
        try {
          await onUpload(file);
        } catch (err) {
          errors.push(
            `"${file.name}": ${err instanceof Error ? err.message : "error de subida."}`,
          );
        }
      }

      if (errors.length > 0) {
        setUploadError(errors.join(" "));
      }
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    },
    [isCategoryFull, onUpload, tier],
  );

  const onDropFiles = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDraggingFile(false);
      void handleFiles(event.dataTransfer.files);
    },
    [handleFiles],
  );

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        void handleFiles(event.target.files);
      }
    },
    [handleFiles],
  );

  const persistOrder = useCallback(
    async (ordered: VendorMediaAssetRecord[]) => {
      const orderedIds = ordered.map((item) => item.id);
      setReordering(true);
      try {
        await onReorder(orderedIds);
      } finally {
        setReordering(false);
      }
    },
    [onReorder],
  );

  const handleItemDragStart = (event: DragEvent<HTMLLIElement>, index: number) => {
    setDragIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  };

  const handleItemDragOver = (event: DragEvent<HTMLLIElement>, index: number) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (overIndex !== index) setOverIndex(index);
  };

  const handleItemDrop = (event: DragEvent<HTMLLIElement>, index: number) => {
    event.preventDefault();
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const next = moveItem(items, dragIndex, index);
    setItems(next);
    setDragIndex(null);
    setOverIndex(null);
    void persistOrder(next);
  };

  const handleItemDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const moveBy = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = moveItem(items, index, target);
    setItems(next);
    void persistOrder(next);
  };

  const registerAudioRef = useCallback((id: string) => {
    return (el: HTMLAudioElement | null) => {
      if (el) audioRefs.current.set(id, el);
      else audioRefs.current.delete(id);
    };
  }, []);

  const toggleAudio = (item: VendorMediaAssetRecord) => {
    const audio = audioRefs.current.get(item.id);
    if (!audio) return;

    if (playingId === item.id) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    const previous = playingId ? audioRefs.current.get(playingId) : undefined;
    previous?.pause();
    audio.play().catch(() => {
      setPlayingId(null);
    });
    setPlayingId(item.id);
  };

  const onDropzoneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <section
      className="space-y-6"
      aria-label={`Gestor multimedia del proveedor ${vendorId}`}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label="Zona de subida de archivos multimedia. Arrastra o pulsa Enter para seleccionar."
        onClick={() => inputRef.current?.click()}
        onKeyDown={onDropzoneKeyDown}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDraggingFile(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDraggingFile(false);
        }}
        onDrop={onDropFiles}
        className={`cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 ease-out ${
          isDraggingFile
            ? "scale-[1.01] border-[#ecb613] bg-[#ecb613]/10"
            : "border-white/20 bg-[#09090d]/60 hover:border-[#ecb613]/80"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,audio/mpeg,audio/wav,audio/x-wav,application/pdf"
          className="hidden"
          onChange={onInputChange}
        />

        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613]">
            {uploading ? (
              <Loader2 className="animate-spin" size={26} />
            ) : (
              <UploadCloud size={26} />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-syne text-base font-bold text-white sm:text-lg">
              {uploading
                ? "Subiendo y registrando archivos…"
                : "Arrastra tus fotos, demo de audio o rider PDF"}
            </h3>
            <p className="mx-auto max-w-md font-mono text-xs text-zinc-400">
              Plan <span className="font-bold text-white">{TIER_LABEL[tier]}</span> · JPG/PNG/WebP ·
              MP3/WAV · PDF (máx. 25 MB). El hash SHA-256 se calcula en el servidor.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] text-zinc-300">
              <ImageIcon size={12} className="text-[#ecb613]" />
              {counts.IMAGE}/{limits.maxImages} fotos
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] text-zinc-300">
              <AudioLines size={12} className="text-[#ecb613]" />
              {counts.AUDIO}/{limits.maxAudio} audio
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] text-zinc-300">
              <FileText size={12} className="text-[#ecb613]" />
              {counts.DOCUMENT}/{limits.maxDocuments} rider
            </span>
          </div>

          <span className="rounded-2xl bg-[#ecb613] px-6 py-3 font-mono text-xs font-black uppercase text-black transition-all hover:scale-105">
            {uploading ? "Procesando…" : "Examinar archivos"}
          </span>
        </div>
      </div>

      {uploadError && (
        <p
          role="alert"
          className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 font-mono text-xs text-rose-300"
        >
          {uploadError}
        </p>
      )}

      {reordering && (
        <p
          aria-live="polite"
          className="font-mono text-[11px] uppercase tracking-widest text-zinc-500"
        >
          Guardando orden de portada…
        </p>
      )}

      {items.length === 0 ? (
        <div className="rounded-3xl border border-white/5 bg-[#09090d] p-12 text-center">
          <ImageIcon size={32} className="mx-auto text-zinc-600" />
          <p className="mt-2 text-sm text-zinc-400">Aún no has subido archivos multimedia.</p>
          <p className="text-xs text-zinc-500">
            Arrastra tu primera foto, demo o rider para publicarlo en tu escaparate.
          </p>
        </div>
      ) : (
        <ul role="list" className="space-y-3">
          {items.map((item, index) => {
            const kind = resolveAssetKind(item.type);
            const isCover = index === 0;
            const isTarget = overIndex === index && dragIndex !== null && dragIndex !== index;

            return (
              <li
                key={item.id}
                role="listitem"
                draggable={!reordering}
                onDragStart={(event) => handleItemDragStart(event, index)}
                onDragOver={(event) => handleItemDragOver(event, index)}
                onDrop={(event) => handleItemDrop(event, index)}
                onDragEnd={handleItemDragEnd}
                className={`group relative flex items-center gap-3 rounded-3xl border bg-[#09090d]/80 p-3 backdrop-blur-md transition-all duration-300 ease-out sm:p-4 ${
                  dragIndex === index
                    ? "border-[#ecb613]/60 opacity-70"
                    : isTarget
                      ? "border-[#ecb613]/50 ring-1 ring-[#ecb613]/30"
                      : "border-white/10 hover:border-white/20"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="hidden cursor-grab text-zinc-600 transition-colors hover:text-[#ecb613] active:cursor-grabbing sm:block"
                >
                  <GripVertical size={18} />
                </span>

                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold ${
                    isCover
                      ? "border-[#ecb613]/60 bg-[#ecb613]/10 text-[#ecb613]"
                      : "border-white/10 text-zinc-400"
                  }`}
                >
                  #{index + 1}
                  {isCover ? " · Portada" : ""}
                </span>

                <div className="min-w-0 flex-1">
                  {kind === "IMAGE" && (
                    <div className="relative aspect-video w-full max-w-[220px] overflow-hidden rounded-xl bg-black/40">
                      <img
                        src={item.url}
                        alt={item.fileName ?? "Imagen del proveedor"}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {kind === "AUDIO" && (
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <button
                        type="button"
                        onClick={() => toggleAudio(item)}
                        aria-label={
                          playingId === item.id ? "Pausar demo de audio" : "Reproducir demo de audio"
                        }
                        aria-pressed={playingId === item.id}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ecb613] text-black transition-all hover:scale-105"
                      >
                        {playingId === item.id ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <audio
                        ref={registerAudioRef(item.id)}
                        src={item.url}
                        preload="none"
                        onEnded={() => setPlayingId(null)}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm text-white">
                          {item.fileName ?? "Demo de audio"}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                          Audio · {formatBytes(item.sizeBytes)}
                        </p>
                      </div>
                    </div>
                  )}

                  {kind === "DOCUMENT" && (
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ecb613]/10 text-[#ecb613]">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-white">{item.fileName ?? "Rider PDF"}</p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                          Rider PDF · {formatBytes(item.sizeBytes)}
                        </p>
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto shrink-0 rounded-lg border border-white/10 px-2 py-1 font-mono text-[10px] text-zinc-400 transition-colors hover:text-white"
                      >
                        Ver
                      </a>
                    </div>
                  )}

                  {kind === "VIDEO" && (
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-zinc-400">
                        <Film size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-white">{item.fileName ?? "Vídeo"}</p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                          Vídeo · {formatBytes(item.sizeBytes)}
                        </p>
                      </div>
                    </div>
                  )}

                  {kind === "OTHER" && (
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-zinc-400">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-white">{item.fileName ?? "Archivo"}</p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                          {item.type} · {formatBytes(item.sizeBytes)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveBy(index, -1)}
                    disabled={index === 0 || reordering}
                    aria-label="Mover elemento arriba"
                    className="rounded-lg border border-white/10 p-1.5 text-zinc-400 transition-colors hover:text-[#ecb613] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBy(index, 1)}
                    disabled={index === items.length - 1 || reordering}
                    aria-label="Mover elemento abajo"
                    className="rounded-lg border border-white/10 p-1.5 text-zinc-400 transition-colors hover:text-[#ecb613] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}





