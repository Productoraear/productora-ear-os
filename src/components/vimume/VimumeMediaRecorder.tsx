'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Video, Mic, Square, Play, Trash2, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { VIMUME_SENIOR_SSOT } from '@/lib/vimume/vimumePatientEngine';

interface VimumeMediaRecorderProps {
  patientAlias: string;
  className?: string;
  onRecordingComplete?: (url: string) => void;
}

type RecordingState = 'idle' | 'requesting' | 'recording' | 'preview' | 'error';

/**
 * 🎥 VIMUME MEDIA RECORDER (WebRTC)
 * Graba en tiempo real la reacción de un residente (voz / video) para
 * documentar la recuperación del habla o hitos clínicos mayores.
 * El blob queda disponible para revisión y subida al expediente clínico.
 */
export default function VimumeMediaRecorder({
  patientAlias,
  className = '',
  onRecordingComplete
}: VimumeMediaRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [state, setState] = useState<RecordingState>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      stopAllTracks();
      if (timerRef.current) clearInterval(timerRef.current);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopAllTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      setState('requesting');
      setErrorMessage(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Este navegador no soporta captura de cámara/micrófono (WebRTC).');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setState('preview');
        stopAllTracks();
        onRecordingComplete?.(url);
      };

      recorderRef.current = recorder;
      recorder.start(1000);
      setRecordingSeconds(0);
      setState('recording');

      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar la captura.');
      setState('error');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  };

  const discardRecording = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    chunksRef.current = [];
    setRecordingSeconds(0);
    setState('idle');
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-[#8b5cf6]/25 bg-[#030305] p-5 text-white ${className}`}>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#ecb613]/10 blur-[100px] pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30">
            <Video className="w-5 h-5 text-[#8b5cf6]" />
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#8b5cf6] font-bold">
              Grabador Multimedia WebRTC
            </p>
            <h4 className="text-xl font-black font-syne tracking-tight">
              Registro clínico · {patientAlias}
            </h4>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2">
          <Mic className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-mono font-bold text-emerald-300">
            HIPÓTESIS SPEECH_RECOVERY
          </span>
        </div>
      </div>

      <div className="relative z-10 pt-5 space-y-4">
        {/* Viewport de previsualización / grabación */}
        <div className="relative aspect-video bg-black/70 border border-white/10 rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            controls={state === 'preview'}
            src={previewUrl ?? undefined}
            aria-label="Vista previa de grabación WebRTC"
          />

          {state === 'recording' && (
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-[10px] font-mono font-bold text-red-200">
                REC · {formatTime(recordingSeconds)}
              </span>
            </div>
          )}

          {state === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 gap-2">
              <Video className="w-10 h-10 opacity-40" />
              <span className="text-xs font-mono">Cámara en reposo · Consentimiento RGPD requerido</span>
            </div>
          )}

          {state === 'requesting' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#8b5cf6] gap-2">
              <Loader2 className="w-10 h-10 animate-spin" />
              <span className="text-xs font-mono">Solicitando permisos de cámara y micrófono...</span>
            </div>
          )}

          {state === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-red-300 gap-2 p-6 text-center">
              <AlertTriangle className="w-10 h-10" />
              <span className="text-xs font-mono max-w-sm">{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="flex flex-wrap gap-3">
          {state === 'idle' && (
            <button
              type="button"
              onClick={startRecording}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <Mic className="w-4 h-4" />
              Iniciar Grabación
            </button>
          )}

          {(state === 'recording' || state === 'requesting') && (
            <button
              type="button"
              onClick={stopRecording}
              disabled={state === 'requesting'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <Square className="w-4 h-4" />
              Detener
            </button>
          )}

          {state === 'preview' && previewUrl && (
            <>
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-mono font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                Evidencia capturada
              </span>
              <button
                type="button"
                onClick={discardRecording}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-mono font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Descartar
              </button>
            </>
          )}

          {state === 'error' && (
            <button
              type="button"
              onClick={() => setState('idle')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-mono font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <Play className="w-4 h-4" />
              Reintentar
            </button>
          )}
        </div>

        <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
          Limitador acústico activo ≤ {VIMUME_SENIOR_SSOT.MAX_SPL_DB} dB SPL · Portadora gamma {VIMUME_SENIOR_SSOT.GAMMA_FREQUENCY_HZ} Hz.
          La evidencia se trata conforme a RGPD Art. 9 (categorías especiales de datos de salud).
        </p>
      </div>
    </div>
  );
}