'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  badge?: string;
}

const AUDIOVISUAL_FAQS: FaqItem[] = [
  {
    question: "¿Cuánto cuesta alquilar una pantalla LED gigante para eventos en Madrid y España?",
    answer: "El precio de alquiler de una pantalla LED gigante P2.9 de alta definición varía según los metros cuadrados (m²) y la ubicación (interior o exterior). Los formatos estándar para eventos y bodas parten desde 650 € para pantallas de 3x2m, incluyendo estructura Truss de elevación, procesador de vídeo 4K y técnico realizador dedicado durante el evento.",
    badge: "Pantallas LED P2.9"
  },
  {
    question: "¿Qué diferencia existe entre alquilar o comprar un equipo de sonido profesional?",
    answer: "Alquilar un equipo de sonido profesional (como Bose F1 o L-Acoustics K2) garantiza calibración acústica precisa por ingenieros de sonido (12 W/pax), microfonía de grado emisión Shure Axient Digital libre de interferencias, póliza de responsabilidad civil de 1.000.000 € y soporte técnico 24/7 sin costes de mantenimiento ni depreciación de activos.",
    badge: "Alquiler vs Compra"
  },
  {
    question: "¿Qué potencia de sonido se necesita para sonorizar una boda o convención corporativa?",
    answer: "Nuestra norma técnica S-Class establece un estándar de 12 W RMS por comensal en recintos cerrados y hasta 20 W RMS por persona en exteriores. Para una boda o convención de 100 a 150 asistentes, se instala una potencia calibrada de 1.800 W a 3.000 W RMS con respuesta plana en frecuencia y limitador de presión acústica homologado.",
    badge: "Potencia 12 W/pax"
  },
  {
    question: "¿Incluye el alquiler de audiovisuales iluminación robótica DMX y microfonía inalámbrica?",
    answer: "Sí. Todos nuestros packs de sonorización corporativa y nupcial incluyen parejas de micrófonos inalámbricos Shure / Neumann de alta gama y cabezas móviles de iluminación DMX con control de escenas programadas para ceremonias, entregas de premios o fiesta.",
    badge: "Iluminación & Micros"
  },
  {
    question: "¿Con cuánta antelación se debe reservar el montaje de pantallas LED y sonido?",
    answer: "Recomendamos reservar con un mínimo de 15 días de antelación para eventos corporativos y bodas de gala. Para festivales o festejos de Ayuntamientos, la reserva se gestiona mediante adjudicación directa o pliego técnico con hasta 30 días de margen.",
    badge: "Reserva & Logística"
  }
];

export function AudiovisualFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": AUDIOVISUAL_FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="p-2.5 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]">
          <HelpCircle size={24} />
        </div>
        <div>
          <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest block font-bold">
            Guía de Alquiler Audiovisual &amp; Presupuestos GSC
          </span>
          <h3 className="text-xl font-fraunces font-black text-white uppercase">
            Preguntas Frecuentes sobre Pantallas LED &amp; Equipos de Sonido
          </h3>
        </div>
      </div>

      <div className="space-y-3">
        {AUDIOVISUAL_FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-white/10 rounded-2xl overflow-hidden bg-black/40 transition-colors hover:border-white/20"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-4 text-left flex justify-between items-center gap-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {faq.badge && (
                    <span className="text-[10px] font-mono font-bold bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] px-2.5 py-1 rounded-full uppercase shrink-0">
                      {faq.badge}
                    </span>
                  )}
                  <span className="text-sm font-bold text-white font-montserrat">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-white/50 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#ecb613]' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-white/70 font-montserrat leading-relaxed border-t border-white/5 bg-white/[0.02]">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AudiovisualFaqAccordion;
