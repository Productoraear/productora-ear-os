'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, CheckCircle, Share2, Sparkles, MessageCircle } from 'lucide-react';
import { getVendorReviewsAction, createReviewRequestAction, respondToReviewAction, VendorReviewItem } from '@/app/actions/vendorReviewActions';

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState<VendorReviewItem[]>([]);
  const [avgRating, setAvgRating] = useState<number>(5.0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Formulario Solicitud
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [generatedWaUrl, setGeneratedWaUrl] = useState<string | null>(null);

  // Respuesta
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    const data = await getVendorReviewsAction('edwin-agudelo');
    setReviews(data.reviews);
    setAvgRating(data.avgRating);
    setTotalReviews(data.totalReviews);
    setLoading(false);
  };

  const handleGenerateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    const res = await createReviewRequestAction('edwin-agudelo', clientName, clientPhone);
    if (res.success) {
      setGeneratedWaUrl(res.whatsappUrl);
    }
  };

  const handleSendReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    const res = await respondToReviewAction('edwin-agudelo', reviewId, replyText);
    if (res.success) {
      setReplyingId(null);
      setReplyText('');
      loadReviews();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-zinc-500 font-mono text-xs animate-pulse">
        Cargando Reseñas Verificadas...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <header className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-mono text-amber-300 font-bold uppercase mb-2">
          <Star size={12} fill="currentColor" />
          <span>Reputación Verificada S-Class · Eventos Reales</span>
        </div>
        <h1 className="text-3xl font-black font-syne text-white tracking-tight">Valoraciones & Opiniones de Parejas</h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
          Solicita opiniones por WhatsApp y responde a tus clientes con el sello de verificación de evento finalizado.
        </p>
      </header>

      {/* Rating Master Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#09090d]/80 border border-[#ecb613]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613] font-bold">Valoración Media Verificada</div>
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <span className="text-5xl font-black font-mono text-white tracking-tight">{avgRating.toFixed(1)}</span>
            <div className="flex flex-col items-start">
              <div className="flex text-[#ecb613]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs font-mono text-zinc-400 mt-1">{totalReviews} Opiniones Verificadas</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-bold flex items-center gap-2">
            <Sparkles size={14} />
            <span>Top 1% Proveedores Recomendados</span>
          </div>
        </div>
      </div>

      {/* Generador de Solicitud de Reseña por WhatsApp */}
      <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold font-syne text-white flex items-center gap-2">
          <MessageCircle size={16} className="text-emerald-400" />
          <span>Solicitar Reseña por WhatsApp a Pareja Reciente</span>
        </h3>

        <form onSubmit={handleGenerateRequest} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Nombre de la Pareja (ej. María & Carlos)"
            required
            className="bg-black/60 border border-white/10 rounded-xl p-3 text-white text-xs font-mono focus:outline-none focus:border-amber-500/50"
          />
          <input
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            placeholder="Teléfono (ej. 34693693048)"
            required
            className="bg-black/60 border border-white/10 rounded-xl p-3 text-white text-xs font-mono focus:outline-none focus:border-amber-500/50"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#ecb613] text-black font-mono text-xs font-bold hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 size={14} />
            <span>Generar Enlace WhatsApp</span>
          </button>
        </form>

        {generatedWaUrl && (
          <div className="pt-2">
            <a
              href={generatedWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold hover:bg-emerald-500/30 transition-colors"
            >
              <Send size={14} />
              <span>Abrir WhatsApp con Mensaje Pre-cargado</span>
            </a>
          </div>
        )}
      </div>

      {/* Feed de Reseñas */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold font-syne text-white flex items-center gap-2">
          <MessageSquare size={16} className="text-zinc-400" />
          <span>Reseñas de Clientes ({reviews.length})</span>
        </h3>

        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-syne">{r.clientName}</span>
                    {r.verified && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono flex items-center gap-1">
                        <CheckCircle size={10} /> Evento Verificado
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{r.eventType} · {r.eventDate}</div>
                </div>

                <div className="flex text-[#ecb613]">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                "{r.comment}"
              </p>

              {/* Respuesta existente */}
              {r.replyText ? (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
                  <div className="text-[10px] font-mono text-amber-400 font-bold">Tu Respuesta ({r.replyDate}):</div>
                  <p className="text-zinc-300 font-light">{r.replyText}</p>
                </div>
              ) : (
                <div>
                  {replyingId === r.id ? (
                    <div className="space-y-2 pt-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escribe tu respuesta pública..."
                        className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-xs font-mono focus:outline-none focus:border-amber-500/50"
                        rows={2}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSendReply(r.id)}
                          className="px-4 py-2 rounded-xl bg-amber-500 text-black font-mono text-xs font-bold hover:bg-amber-400"
                        >
                          Publicar Respuesta
                        </button>
                        <button
                          onClick={() => setReplyingId(null)}
                          className="px-4 py-2 rounded-xl bg-white/5 text-zinc-400 font-mono text-xs hover:text-white"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setReplyingId(r.id); setReplyText(''); }}
                      className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <MessageSquare size={12} />
                      <span>Responder a esta opinión</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
