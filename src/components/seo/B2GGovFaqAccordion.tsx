'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  badge?: string;
}

const B2G_FAQS: FaqItem[] = [
  {
    question: "¿Cómo se adjudica la contratación de Fiestas Patronales mediante Contrato Menor (Art. 118 LCSP)?",
    answer: "Según el Artículo 118 de la Ley 9/2017 de Contratos del Sector Público (LCSP), los contratos de servicios e infraestructuras para festejos por importe inferior a 15.000 € (+ IVA) pueden adjudicarse de forma directa a Productora EAR. Solo requiere aprobación del gasto, emisión de presupuesto con desglose e inyección de factura electrónica a través del portal FACe.",
    badge: "Art. 118 LCSP"
  },
  {
    question: "¿Qué documentación de solvencia y estar al corriente de pago aporta Productora EAR para el expediente municipal?",
    answer: "Aportamos de forma inmediata la certificación positiva de la Agencia Tributaria (AEAT), certificado de estar al corriente con la Tesorería General de la Seguridad Social (TGSS TC1/TC2), Póliza de Responsabilidad Civil de 1.000.000 € y la memoria técnica descriptiva del espectáculo o montaje escénico.",
    badge: "Solvencia 100%"
  },
  {
    question: "¿Cómo funciona la facturación electrónica mediante los códigos DIR3 en FACe?",
    answer: "Una vez ejecutado el evento o fiesta patronal, Productora EAR emite la factura electrónica en formato FacturaE (.xml) dirigida a los códigos DIR3 (Órgano Gestor, Unidad Tramitadora y Oficina Contable) del Ayuntamiento correspondiente a través del punto general de entrada FACe.",
    badge: "FACe / DIR3"
  },
  {
    question: "¿Cómo se activa la cláusula de Consenso Municipal con el Proyecto VIMUME totalmente incluido?",
    answer: "Al adjudicar la producción completa de las Fiestas Patronales a Productora EAR, se activa el acuerdo marco que incluye de forma totalmente bonificada la actuación del Proyecto VIMUME (Viaje Musical por la Memoria) con Edwin Agudelo como Solista en la Residencia Municipal o Centro de Día de la localidad, unificando el consenso entre Festejos, Cultura y Asuntos Sociales.",
    badge: "Pacto VIMUME"
  },
  {
    question: "¿Es posible contratar infraestructuras de Luces de Navidad o Audiovisuales en municipios fuera de Madrid?",
    answer: "Sí. Productora EAR opera en la red de los 8.131 municipios de España. Desplazamos unidades móviles de transporte con técnicos titulados, escenarios con certificación incombustible e iluminación LED de bajo consumo a cualquier provincia.",
    badge: "Cobertura 8.000+ Municipios"
  }
];

export function B2GGovFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": B2G_FAQS.map(faq => ({
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
            Marco Normativo &amp; Preguntas Frecuentes LCSP
          </span>
          <h3 className="text-xl font-fraunces font-black text-white uppercase">
            Solucionario Técnico para Ayuntamientos &amp; Contratación Pública
          </h3>
        </div>
      </div>

      <div className="space-y-3">
        {B2G_FAQS.map((faq, index) => {
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

export default B2GGovFaqAccordion;
