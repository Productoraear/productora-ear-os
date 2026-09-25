'use client';

/**
 * 🎙️ EAR OS V2 — ASISTENTE MULTIMODAL DE CAMPO S-CLASS (VOZ + FOTO)
 * ------------------------------------------------------------------
 * Interfaz de administración para dictado continuo con Web Speech API
 * y subida de fotos (notas manuscritas, capturas de WhatsApp, bocetos).
 * Genera propuestas comerciales con cruce determinista en 30 segundos.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  Copy,
  ExternalLink,
  Send,
  Camera,
  Image as ImageIcon,
  X,
  UploadCloud,
  ShieldCheck,
} from 'lucide-react';
import type { ExtractedVoiceProposal } from '@/lib/proposals/ear-voice-assistant';
import { formatoEuros } from '@/lib/proposals/proposal-calculator';

interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export function VoiceProposalRecorder() {
  const [transcription, setTranscription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedVoiceProposal | null>(null);
  const [saving, setSaving] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as IWindow;
      const SpeechApi = win.SpeechRecognition || win.webkitSpeechRecognition;
      setIsSupported(Boolean(SpeechApi));

      if (SpeechApi) {
        const reco = new SpeechApi();
        reco.lang = 'es-ES';
        reco.continuous = true;
        reco.interimResults = true;

        reco.onresult = (e: any) => {
          let current = '';
          for (let i = 0; i < e.results.length; i++) {
            current += e.results[i][0].transcript + ' ';
          }
          setTranscription(current.trim());
        };

        reco.onerror = (e: any) => {
          console.warn('SpeechRecognition error:', e.error);
          if (e.error !== 'no-speech') {
            setIsListening(false);
          }
        };

        reco.onend = () => {
          if (isListening) {
            try {
              reco.start();
            } catch {
              setIsListening(false);
            }
          } else {
            setIsListening(false);
          }
        };

        recognitionRef.current = reco;
      }
    }
  }, [isListening]);

  const toggleListen = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting speech:', err);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!transcription.trim() && !attachedImage) return;
    if (isListening) toggleListen();
    setAnalyzing(true);
    setGeneratedUrl(null);

    try {
      const res = await fetch('/api/proposals/extract-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto: transcription,
          imagen: attachedImage,
        }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Error al procesar dictado');

      setExtractedData(body.data);
    } catch (err: any) {
      alert(err.message || 'Error de conexión');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateProposal = async () => {
    if (!extractedData) return;
    setSaving(true);

    try {
      const res = await fetch('/api/proposals/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: extractedData.cliente,
          titulo: extractedData.titulo,
          lineas: extractedData.lineas,
          caducidadDias: 14,
          imagenesAdjuntas: attachedImage ? [attachedImage] : undefined,
        }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Error al guardar');

      setGeneratedUrl(body.url);
    } catch (err: any) {
      alert(err.message || 'Error al generar la propuesta');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedUrl) return;
    const full = `${window.location.origin}${generatedUrl}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const setExampleText = (txt: string) => {
    setTranscription(txt);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Caja de Entrada Multimodal (Dictado + Foto) */}
      <div className="rounded-2xl border border-white/10 bg-[#07070a] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#ecb613]">
              EAR Multimodal Field Assistant · Entrada Rápida
            </span>
            <h2 className="text-xl font-bold text-white font-syne mt-0.5">
              Dictar Visita o Subir Foto de Notas / WhatsApp
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/20 bg-white/5 hover:bg-white/10 text-neutral-200 flex items-center gap-2 transition-all cursor-pointer"
              title="Adjuntar foto de notas manuscritas o captura de pantalla"
            >
              <Camera className="w-4 h-4 text-[#ecb613]" />
              <span className="hidden sm:inline">Subir Foto</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {isSupported ? (
              <button
                onClick={toggleListen}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                    : 'bg-[#ecb613] text-black hover:bg-[#d8a40f] shadow-lg shadow-[#ecb613]/20'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    Pausar Dictado
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Pulsar para Hablar
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>

        {/* Textarea para transcripción */}
        <div className="mt-4 relative">
          <textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            placeholder="Dicta con tu voz o escribe las notas de la visita: novios, finca, servicios de ceremonia, cóctel, barra libre, opcionales..."
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-[#0a0a0e] p-4 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#ecb613]/60 font-sans leading-relaxed"
          />
          {isListening && (
            <div className="absolute bottom-3 right-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              Escuchando en vivo...
            </div>
          )}
        </div>

        {/* Miniatura de imagen adjunta si existe */}
        {attachedImage && (
          <div className="mt-3 flex items-center gap-3 p-3 rounded-xl border border-[#ecb613]/30 bg-[#ecb613]/5">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-black flex-shrink-0">
              <img
                src={attachedImage}
                alt="Notas adjuntas"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-white block">
                Foto de notas / WhatsApp adjunta
              </span>
              <span className="text-[11px] text-neutral-400 block">
                Se procesará junto al dictado y quedará archivada en el dossier.
              </span>
            </div>
            <button
              onClick={removeImage}
              className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-rose-400 transition-colors"
              title="Quitar imagen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Ejemplos de prueba rápida */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-neutral-400">Pruebas rápidas:</span>
          <button
            onClick={() =>
              setExampleText(
                'Visita en La Quinta de Jarama con Cristina y Pablo. 150 invitados. Sonorización de ceremonia civil, solista lírico Edwin Agudelo para cóctel y discoteca barra libre de 4 horas con sonido Bose F1. Dejar como opcionales hora extra y chispas frías.'
              )
            }
            className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors"
          >
            👰 Boda Cristina & Pablo
          </button>
          <button
            onClick={() =>
              setExampleText(
                'Reunión en Finca Las Jarillas con Carmen. Ceremonia con cuarteto de cuerda, ambientación de cóctel y pack perimetral wireless de 12 focos. Como opcional mariachis élite para la fiesta.'
              )
            }
            className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors"
          >
            🎻 Finca Las Jarillas
          </button>
        </div>

        {/* Botón de análisis */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={(!transcription.trim() && !attachedImage) || analyzing}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              (transcription.trim() || attachedImage) && !analyzing
                ? 'bg-white text-black hover:bg-neutral-200 cursor-pointer shadow-lg'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#ecb613]" />
            {analyzing ? 'Analizando Multimodal...' : 'Analizar Dictado + Imagen y Casar'}
          </button>
        </div>
      </div>

      {/* Resultados de Extracción Estructurada */}
      {extractedData && (
        <div className="rounded-2xl border border-[#ecb613]/30 bg-[#07070a] p-6 shadow-2xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                ✓ Extracción Multimodal Exitosa
              </span>
              <h3 className="text-lg font-bold text-white font-syne">
                {extractedData.titulo}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neutral-300">
              Urgencia: <strong className="text-[#ecb613] capitalize">{extractedData.urgencia}</strong>
            </span>
          </div>

          {/* Ficha rápida de cliente detectado */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0a0a0f] p-3 rounded-xl border border-white/5 text-xs">
            <div>
              <span className="text-neutral-500 block">Cliente:</span>
              <strong className="text-white">{extractedData.cliente.nombre}</strong>
            </div>
            <div>
              <span className="text-neutral-500 block">Finca / Espacio:</span>
              <strong className="text-white">{extractedData.cliente.fincaOEspacio}</strong>
            </div>
            <div>
              <span className="text-neutral-500 block">Aforo Estimado:</span>
              <strong className="text-white">{extractedData.cliente.paxEstimado} pax</strong>
            </div>
            <div>
              <span className="text-neutral-500 block">Fecha Prevista:</span>
              <strong className="text-white">{extractedData.cliente.fechaEvento}</strong>
            </div>
          </div>

          {/* Lista de partidas casadas */}
          <div className="mt-6 space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Servicios Clasificados por Fases del Evento ({extractedData.lineas.length})
            </h4>

            {extractedData.lineas.map((linea) => (
              <div
                key={linea.id}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                  linea.esAmarilla
                    ? 'border-amber-500/40 bg-amber-500/5'
                    : linea.esOpcional
                    ? 'border-[#ecb613]/30 bg-[#ecb613]/5'
                    : 'border-white/10 bg-[#09090d]'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
                      Fase: {linea.fase}
                    </span>
                    <span className="font-semibold text-white truncate">
                      {linea.descripcion}
                    </span>
                    {linea.esOpcional && (
                      <span className="text-[10px] font-mono text-[#ecb613] bg-[#ecb613]/10 px-1.5 py-0.2 rounded">
                        OPCIONAL
                      </span>
                    )}
                  </div>
                  {linea.motivoIa && (
                    <p className="mt-0.5 text-[11px] text-amber-400 font-mono">
                      {linea.motivoIa}
                    </p>
                  )}
                </div>

                <div className="font-mono text-sm font-bold text-white text-right">
                  {linea.esAmarilla ? (
                    <span className="text-amber-400 text-xs font-bold">Por presupuestar</span>
                  ) : (
                    formatoEuros(linea.totalCéntimos)
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Botón de Creación Formal */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-400">
              Al guardar se generará un enlace público protegido con firma digital y depósito Stripe.
            </div>

            <button
              onClick={handleGenerateProposal}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#ecb613] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#d8a40f] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {saving ? 'Generando Propuesta...' : 'Generar Propuesta y Enlace Soberano'}
            </button>
          </div>
        </div>
      )}

      {/* Enlace generado con botón de copia para WhatsApp */}
      {generatedUrl && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5" />
            ¡Propuesta Oficial Creada con Éxito!
          </div>

          <p className="mt-1 text-xs text-neutral-300">
            Comparte este enlace con el cliente por WhatsApp o email. El sistema te avisará por Telegram en cuanto lo abra:
          </p>

          <div className="mt-3 flex items-center gap-2 bg-[#050508] p-2.5 rounded-xl border border-white/10">
            <span className="text-xs font-mono text-[#ecb613] truncate flex-1 select-all">
              {typeof window !== 'undefined' ? `${window.location.origin}${generatedUrl}` : generatedUrl}
            </span>

            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>

            <a
              href={generatedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-[#ecb613] text-black hover:bg-[#d8a40f] transition-colors"
              title="Abrir Propuesta"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
