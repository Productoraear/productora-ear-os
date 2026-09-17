"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AudioLines,
  CheckCircle2,
  FileAudio,
  Gauge,
  UploadCloud,
  XCircle,
} from "lucide-react";
import {
  uploadArtistAudio,
  type AudioAnalysis,
} from "@/modules/audio/actions/audioMediaActions";

type AudioRole = "stem" | "master";

interface UploadItem {
  id: string;
  fileName: string;
  role: AudioRole;
  status: "idle" | "uploading" | "done" | "error";
  analysis?: AudioAnalysis;
  error?: string;
  progress: number;
}

const ACCEPTED_MIME = ["audio/wav", "audio/flac", "audio/mpeg"];

export default function AudioDragAndDrop({
  artistId = "edwin-agudelo",
}: {
  artistId?: string;
}) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const incoming = Array.from(files)
        .filter((file) => ACCEPTED_MIME.includes(file.type))
        .map<UploadItem>((file, index) => ({
          id: `${Date.now()}-${index}`,
          fileName: file.name,
          role: file.name.toLowerCase().includes("master") ? "master" : "stem",
          status: "idle",
          progress: 0,
        }));

      if (incoming.length === 0) return;
      setItems((current) => [...current, ...incoming]);

      incoming.forEach((item, index) => {
        void processFile(files, index, item);
      });
    },
    []
  );

  const processFile = async (files: FileList | File[], index: number, item: UploadItem) => {
    const file = Array.from(files)[index];
    if (!file) return;

    updateItem(item.id, { status: "uploading", progress: 10 });

    try {
      const dataBase64 = await fileToBase64(file);
      updateItem(item.id, { progress: 55 });

      const result = await uploadArtistAudio({
        artistId,
        fileName: file.name,
        mimeType: file.type,
        role: item.role,
        dataBase64,
      });

      if (result.success && result.analysis) {
        updateItem(item.id, {
          status: "done",
          progress: 100,
          analysis: result.analysis,
        });
      } else {
        updateItem(item.id, {
          status: "error",
          progress: 100,
          error: result.error ?? "Error al subir el archivo.",
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al procesar el archivo.";
      updateItem(item.id, { status: "error", progress: 100, error: message });
    }
  };

  const updateItem = (id: string, patch: Partial<UploadItem>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = "";
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div className="rounded-3xl border border-white/10 bg-[#050507] p-6">
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#00E5FF] mb-1">
        <FileAudio size={12} />
        Ingesta de Audio
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mt-1 leading-tight">
        Arrastra tus Stems y Masters
      </h2>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openPicker}
        role="button"
        tabIndex={0}
        className={`mt-6 rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-[#00E5FF] bg-[#00E5FF]/5"
            : "border-white/15 bg-[#0D0D15] hover:border-white/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_MIME.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />
        <UploadCloud className="mx-auto text-[#00E5FF]" size={32} />
        <p className="mt-3 text-sm font-semibold text-white">
          Suelta archivos WAV · FLAC · MP3
        </p>
        <p className="mt-1 text-xs font-mono text-zinc-500">
          Hasta 200 MB por archivo · Almacenamiento local en public/uploads/artists/
        </p>
      </div>

      <AnimatePresence>
        {items.length > 0 && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 space-y-3"
          >
            {items.map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-white/10 bg-[#0D0D15] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        item.status === "done"
                          ? "bg-[#10B981]/15 text-[#10B981]"
                          : item.status === "error"
                          ? "bg-[#FF2B44]/15 text-[#FF2B44]"
                          : "bg-white/5 text-[#00E5FF]"
                      }`}
                    >
                      {item.status === "done" ? (
                        <CheckCircle2 size={16} />
                      ) : item.status === "error" ? (
                        <XCircle size={16} />
                      ) : (
                        <AudioLines size={16} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-mono truncate">{item.fileName}</p>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  {item.status === "uploading" && (
                    <span className="text-xs font-mono text-[#00E5FF] shrink-0">
                      {item.progress}%
                    </span>
                  )}
                </div>

                {item.analysis && item.status === "done" && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="rounded-lg bg-white/5 p-2">
                      <p className="text-[10px] font-mono text-zinc-500">Formato</p>
                      <p className="text-xs font-mono text-white uppercase">{item.analysis.format}</p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2">
                      <p className="text-[10px] font-mono text-zinc-500">Sample Rate</p>
                      <p className="text-xs font-mono text-white">
                        {item.analysis.sampleRate ? `${item.analysis.sampleRate} Hz` : "—"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2">
                      <p className="text-[10px] font-mono text-zinc-500">Canales</p>
                      <p className="text-xs font-mono text-white">{item.analysis.channels ?? "—"}</p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2">
                      <p className="text-[10px] font-mono text-zinc-500">BPM Est.</p>
                      <p className="text-xs font-mono text-white flex items-center gap-1">
                        <Gauge size={12} />
                        {item.analysis.estimatedBpm ?? "—"}
                      </p>
                    </div>
                  </div>
                )}

                {item.error && (
                  <p className="mt-2 text-xs font-mono text-[#FF2B44]">{item.error}</p>
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result.split(",")[1] ?? "");
      } else {
        reject(new Error("No se pudo leer el archivo."));
      }
    };
    reader.onerror = () => reject(new Error("Error de lectura del archivo."));
    reader.readAsDataURL(file);
  });
}