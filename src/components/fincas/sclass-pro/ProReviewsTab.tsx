"use client";

import React, { useState } from "react";
import { 
  Star, 
  MessageSquare, 
  Send, 
  Copy, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Share2, 
  Award, 
  Filter, 
  UserCheck, 
  Calendar, 
  Heart,
  ExternalLink,
  Code
} from "lucide-react";

interface Review {
  id: string;
  author: string;
  partner?: string;
  eventDate: string;
  venue: string;
  location: string;
  rating: number;
  text: string;
  verified: boolean;
  replied: boolean;
  replyText?: string;
  service: string;
}

const initialReviews: Review[] = [
  {
    id: "rev-01",
    author: "Adriana",
    partner: "Sergio",
    eventDate: "15/06/2024",
    venue: "Finca La Alquería",
    location: "Madrid",
    rating: 5,
    text: "Increíble Edwin. No solo cantó espectacular en la ceremonia y el cóctel sino que supo captar exactamente lo que queríamos. Cero estridencias, todo el mundo nos felicitó por la música. Recomendable al 100%.",
    verified: true,
    replied: true,
    replyText: "Muchísimas gracias Adriana y Sergio. Fue un honor absoluto poner banda sonora a un día tan emotivo.",
    service: "Ceremonia Civil + Cóctel Lírico",
  },
  {
    id: "rev-02",
    author: "Eduardo Lion Wong",
    eventDate: "20/09/2023",
    venue: "Aldea Santillana",
    location: "Madrid Norte",
    rating: 5,
    text: "Un profesional como la copa de un pino. Equipo de sonido Bose impecable, voz cálida y una puntualidad suiza. Da gusto tratar con músicos serios que entienden la dinámica de una boda de alto nivel.",
    verified: true,
    replied: true,
    replyText: "Gracias de corazón Eduardo. La acústica de Aldea Santillana combinada con nuestro sistema Bose lució al 100%.",
    service: "Cóctel Acústico + Banquete",
  },
  {
    id: "rev-03",
    author: "Yanet Cecilia",
    eventDate: "12/05/2023",
    venue: "Cigarral de las Mercedes",
    location: "Toledo",
    rating: 5,
    text: "Edwin tiene un don. Su repertorio acústico amenizó el cóctel de forma mágica. El volumen fue perfecto para que los invitados pudieran conversar sin gritar.",
    verified: true,
    replied: false,
    service: "Cóctel de Bienvenida",
  },
];

export function ProReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState<string>("");
  const [coupleName, setCoupleName] = useState<string>("");
  const [couplePhone, setCouplePhone] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);

  const handleSendReply = (id: string) => {
    if (!replyDraft.trim()) return;
    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, replied: true, replyText: replyDraft };
      }
      return r;
    }));
    setActiveReplyId(null);
    setReplyDraft("");
  };

  const handleGenerateWhatsAppLink = () => {
    const name = coupleName.trim() || "pareja";
    const message = encodeURIComponent(
      `¡Hola ${name}! 🎶 Esperamos que estéis disfrutando al máximo vuestros primeros días de casados. ` +
      `Para nosotros fue un honor absoluto acompañaros en vuestro gran día. ` +
      `¿Nos dedicaríais 1 minuto para dejarnos una reseña de 5 estrellas en nuestro portal oficial? ` +
      `Vuestra opinión nos ayuda enormemente: https://www.productoraear.com/opiniones`
    );
    const cleanPhone = couplePhone.replace(/[^0-9]/g, "");
    const url = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${message}` 
      : `https://wa.me/?text=${message}`;
    
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  const badgeCode = `<div style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;background:#050507;border:1px solid #ecb613;border-radius:12px;font-family:sans-serif;color:#ffffff;">
  <span style="color:#ecb613;font-weight:bold;">★ 5.0</span>
  <span style="font-size:12px;color:#a1a1aa;">Productora EAR • Artista Recomendado S-Class</span>
</div>`;

  const handleCopyBadge = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(badgeCode);
      setCopiedBadge(true);
      setTimeout(() => setCopiedBadge(false), 2500);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl border border-[#ecb613]/30 bg-gradient-to-br from-[#0c0c12] to-[#040406] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400">Puntuación Media</span>
            <Award className="w-5 h-5 text-[#ecb613]" />
          </div>
          <div className="text-3xl font-bold font-['Syne'] text-white flex items-center gap-2">
            5.0 <span className="text-[#ecb613] text-2xl">★★★★★</span>
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">100% Calificaciones Máximas</div>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-800 bg-[#08080c] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400">Total Opiniones</span>
            <MessageSquare className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="text-3xl font-bold font-['Syne'] text-white">
            {reviews.length}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">100% Novios Verificados</div>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-800 bg-[#08080c] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400">Tasa de Respuesta</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-['Syne'] text-white">
            {Math.round((reviews.filter(r => r.replied).length / reviews.length) * 100)}%
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">Respuesta personal de Edwin</div>
        </div>

        <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-emerald-400">Sello de Confianza</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-['Syne'] text-emerald-300">
            Acreditado S-Class
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">Sin opiniones falsas de bot</div>
        </div>
      </div>

      {/* 2-Column: Left Generator & Badge / Right Reviews Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: WhatsApp Request Tool & Embed Badge */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* WhatsApp Review Requester */}
          <div className="p-6 rounded-2xl border border-[#ecb613]/25 bg-gradient-to-br from-[#0c0c12] to-[#050508] space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-[#ecb613] font-bold text-sm font-['Syne'] uppercase tracking-wider">
              <Share2 className="w-4 h-4" />
              Generador de Solicitud de Reseña (WhatsApp 1-Click)
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Envía a los recién casados el mensaje optimizado para captar opiniones de 5 estrellas en las primeras 48 horas post-boda.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-zinc-400">Nombre de la Pareja / Novios</label>
                <input
                  type="text"
                  placeholder="Ej: Lucía y Marcos"
                  value={coupleName}
                  onChange={(e) => setCoupleName(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#ecb613]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400">Teléfono WhatsApp de los Novios (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: +34 600 000 000"
                  value={couplePhone}
                  onChange={(e) => setCouplePhone(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#ecb613]"
                />
              </div>

              <button
                onClick={handleGenerateWhatsAppLink}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs tracking-wider uppercase font-['Syne'] transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                Despachar Solicitud por WhatsApp
              </button>
            </div>
          </div>

          {/* Embeddable S-Class Badge */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-[#08080c] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm font-['Syne']">
                <Code className="w-4 h-4 text-[#ecb613]" />
                Distintivo Digital Acreditado S-Class
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Copia e inserta este sello en tu web soberana o facilítalo a las fincas colaboradoras para certificar tu estándar acústico y legal.
            </p>

            <div className="p-3.5 rounded-xl bg-black border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#ecb613] font-bold">★ 5.0</span>
                <span className="text-xs text-zinc-300">Productora EAR • Artista S-Class</span>
              </div>
              <button
                onClick={handleCopyBadge}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition flex items-center gap-1.5"
              >
                <Copy className="w-3 h-3 text-[#ecb613]" />
                {copiedBadge ? "¡Copiado!" : "Copiar HTML"}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Reviews Stream */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="text-sm font-bold font-['Syne'] text-white uppercase tracking-wider flex items-center gap-2">
              <Star className="w-4 h-4 text-[#ecb613] fill-[#ecb613]" />
              Reseñas Públicas Auditadas ({reviews.length})
            </h3>
            <span className="text-xs font-mono text-zinc-400">Verificadas con fecha de actuación</span>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div 
                key={rev.id} 
                className="p-5 rounded-2xl border border-zinc-800/80 bg-[#08080c] space-y-3.5 hover:border-zinc-700 transition"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {rev.author} {rev.partner ? `& ${rev.partner}` : ""}
                      </span>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Actuación Real
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span>{rev.venue} ({rev.location})</span>
                      <span>•</span>
                      <span className="font-mono text-[11px]">{rev.eventDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-[#ecb613]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#ecb613]" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed italic bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/50">
                  &ldquo;{rev.text}&rdquo;
                </p>

                <div className="text-[11px] font-mono text-zinc-400">
                  Formato contratado: <strong className="text-zinc-300">{rev.service}</strong>
                </div>

                {/* Reply Section */}
                {rev.replied && rev.replyText && (
                  <div className="ml-4 pl-3 border-l-2 border-[#ecb613]/50 space-y-1 bg-zinc-950/60 p-2.5 rounded-r-xl">
                    <div className="text-[10px] font-mono uppercase text-[#ecb613] font-semibold">
                      Respuesta de Edwin Agudelo:
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {rev.replyText}
                    </p>
                  </div>
                )}

                {!rev.replied && (
                  <div className="pt-2">
                    {activeReplyId === rev.id ? (
                      <div className="space-y-2 mt-2">
                        <textarea
                          rows={2}
                          placeholder="Escribe tu respuesta de agradecimiento..."
                          value={replyDraft}
                          onChange={(e) => setReplyDraft(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#ecb613]"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setActiveReplyId(null); setReplyDraft(""); }}
                            className="px-3 py-1 rounded-lg text-xs text-zinc-400 hover:text-white"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleSendReply(rev.id)}
                            className="px-4 py-1.5 rounded-lg bg-[#ecb613] text-black font-semibold text-xs font-['Syne']"
                          >
                            Publicar Respuesta
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveReplyId(rev.id)}
                        className="text-xs font-mono text-[#ecb613] hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Responder a esta reseña
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
