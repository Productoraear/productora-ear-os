"use client";

import React, { useState } from 'react';
import {
  Sparkles, Award, CheckCircle2,
  Calendar, MessageCircle, CreditCard, Video, Disc, HeartHandshake, ShieldCheck, AlertCircle
} from 'lucide-react';
import { checkoutMariachiAuthorProduct } from '@/app/actions/mariachiCheckoutActions';

type AuthorProductId = 'cancion_estudio_180' | 'video_dedicatoria_120';

const AUTHOR_PRODUCTS: Array<{
  id: AuthorProductId;
  amount: number;
  name: string;
  description: string;
  icon: 'disc' | 'video';
}> = [
    {
      id: 'cancion_estudio_180',
      amount: 180,
      name: 'Canción Ranchera Personalizada de Estudio',
      description: 'Composición original o arreglo especial grabado con voz de Edwin Agudelo y mariachi en los estudios de Productora EAR. Letra dedicada para bodas, homenajes o aniversarios. Entrega en formato Master WAV + dedicatoria.',
      icon: 'disc',
    },
    {
      id: 'video_dedicatoria_120',
      amount: 120,
      name: 'Vídeo Dedicatoria en Plató con Traje de Gala',
      description: 'Grabación cinematográfica 4K en plató profesional de Productora EAR con vestuario oficial de charro. Edwin canta el tema favorito (ej. Las Mañanitas, Si Nos Dejan) con mensaje cariñoso personalizado.',
      icon: 'video',
    },
  ];

export default function MariachiEscaparateEdwin() {
  const [processingId, setProcessingId] = useState<AuthorProductId | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAuthorProduct = async (productId: AuthorProductId) => {
    const product = AUTHOR_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    try {
      setProcessingId(productId);
      setErrorMsg(null);
      const result = await checkoutMariachiAuthorProduct({
        productId,
        amount: product.amount,
      });

      if (result.ok) {
        window.location.href = result.url;
      } else {
        setErrorMsg(result.error || 'No se pudo iniciar la pasarela Stripe.');
      }
    } catch (err: unknown) {
      console.error('MARIACHI_AUTHOR_PRODUCT_ERROR:', err);
      setErrorMsg('Error al conectar con Stripe. Por favor, inténtalo de nuevo.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleWhatsAppContact = (customText?: string) => {
    const text = encodeURIComponent(
      customText ||
      `¡Hola Edwin! Deseo consultar fecha directa para tu actuación como solista / ensamble mariachi con Productora EAR.\n\n` +
      `• Artista: Edwin Agudelo (Mariachi Imperial)\n` +
      `• Servicios de interés: Formato Gran Gala / Canción personalizada\n` +
      `• Teléfono centralita: +34 693 693 048`
    );
    window.open(`https://wa.me/34693693048?text=${text}`, '_blank');
  };

  return (
    <section id="artista-destacado" className="relative rounded-[2.5rem] bg-gradient-to-b from-[#09090f] via-[#050508] to-[#030305] border border-[#ecb613]/30 p-6 md:p-12 overflow-hidden shadow-2xl">
      {/* Resplandor decorativo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {errorMsg && (
          <div role="alert" className="flex items-center gap-3 p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {/* Encabezado y Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/15 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono uppercase tracking-[0.25em]">
            <Award size={14} />
            ARTISTA DESTACADO // ARTISTAS EUROPA · GÉNERO MARIACHI
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[11px] font-mono">
            <HeartHandshake size={13} className="text-[#ecb613]" />
            Trabajo en Positivo · Calidad & Distinción
          </div>
        </div>

        {/* Bloque Principal: Perfil y Propuesta de Valor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Columna Izquierda: Información Artística */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#ecb613]">
                Voz Tenor Solista de Gala & Dirección Orquestal
              </span>
              <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight mt-1">
                Edwin Agudelo <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-amber-500">
                  Mariachi Imperial de Gala
                </span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed">
              Figura de referencia en la interpretación de la música tradicional y contemporánea mexicana en España y Europa.
              Edwin Agudelo encarna la elegancia del auténtico traje de charro de gran gala con botonaduras de plata cincelada a mano,
              aportando una presencia imponente y una voz tenor llena de fuerza, emoción y sensibilidad para los momentos más solemnes y festivos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-white/70 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <CheckCircle2 size={16} className="text-[#ecb613] shrink-0" />
                <span>Disponible como <strong>Solista Premium</strong></span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <CheckCircle2 size={16} className="text-[#ecb613] shrink-0" />
                <span>Ensamble Monumental: <strong>mínimo 6 integrantes</strong></span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>Formación adaptada al límite de ruido de la finca</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <Sparkles size={16} className="text-[#00E5FF] shrink-0" />
                <span>Bloqueo exclusivo de fecha en agenda</span>
              </div>
            </div>

            {/* CTAs de Contratación con Edwin */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#cotizador-uber"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ecb613] to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-lg shadow-[#ecb613]/20"
              >
                <Calendar size={15} />
                Cotizar y Asegurar Fecha (100 €)
              </a>

              <button
                onClick={() => handleWhatsAppContact()}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <MessageCircle size={15} className="text-emerald-400" />
                Consultar por WhatsApp (+34 693 693 048)
              </button>
            </div>
          </div>

          {/* Columna Derecha: Tarjetas de Servicios y Productos de Autor */}
          <div className="lg:col-span-5 space-y-4">
            {AUTHOR_PRODUCTS.map((product) => (
              <div key={product.id} className="p-5 rounded-3xl bg-black/40 border border-[#ecb613]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613] flex items-center gap-1.5">
                    {product.icon === 'disc' ? <Disc size={13} /> : <Video size={13} />}
                    {product.icon === 'disc' ? 'PRODUCTO EXCLUSIVO DE ESTUDIO' : 'VÍDEO DEDICATORIA CINEMATOGRÁFICA'}
                  </span>
                  <span className="text-xs font-mono font-bold text-white px-2.5 py-0.5 rounded-full bg-[#ecb613]/20 border border-[#ecb613]/30">
                    {product.amount} €
                  </span>
                </div>
                <h4 className="text-base font-bold font-syne text-white">
                  {product.name}
                </h4>
                <p className="text-xs text-white/60 font-sans leading-relaxed">
                  {product.description}
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <button
                    onClick={() => handleAuthorProduct(product.id)}
                    disabled={processingId === product.id}
                    className="text-xs font-mono text-[#ecb613] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <CreditCard size={12} />
                    {processingId === product.id ? 'Conectando...' : `Contratar en Stripe (${product.amount} €) →`}
                  </button>
                  <button
                    onClick={() => handleWhatsAppContact(product.id === 'cancion_estudio_180'
                      ? '¡Hola Edwin! Me interesa encargar una canción ranchera personalizada de estudio para un homenaje.'
                      : '¡Hola Edwin! Me gustaría encargar un vídeo dedicatoria en plató con traje de charro para un cumpleaños.')}
                    className="text-xs font-mono text-white/60 hover:text-white cursor-pointer"
                  >
                    Dudas por WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}