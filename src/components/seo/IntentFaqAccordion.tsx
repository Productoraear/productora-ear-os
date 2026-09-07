import React from 'react';
import Link from 'next/link';
import intentData from '@/data/intent-dag.json';
import { Phone, ArrowRight, ShieldCheck } from 'lucide-react';

interface IntentNode {
  level: number;
  category: string;
  question: string;
  answer: string;
  target_route: string;
  cta_label: string;
}

interface MatrixCategory {
  vertical: string;
  lead_artist: string;
  hub: string;
  nodes: IntentNode[];
}

export default function IntentFaqAccordion({ vertical = 'bodas_eventos_gala' }: { vertical?: string }) {
  const selectedMatrix = (intentData.matrices as MatrixCategory[]).find((m) => m.vertical === vertical) || intentData.matrices[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: selectedMatrix.nodes.map((node) => ({
      '@type': 'Question',
      name: node.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: node.answer,
      },
    })),
  };

  return (
    <section className="w-full border border-[#1a1a1a] bg-[#050505] rounded-2xl p-6 text-white my-8 shadow-2xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1a1a1a] pb-4 mb-6 gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#258DCD] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#258DCD]" />
            Grafo de Intenciones y Garantías Oficiales
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white mt-1">
            Respuestas Inmediatas a Dudas Frecuentes
          </h2>
        </div>
        <a
          href="tel:+34693693048"
          className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono py-2 px-4 rounded-xl transition-colors shrink-0"
        >
          <Phone className="w-3.5 h-3.5 text-[#258DCD]" />
          <span>Centralita: +34 693 693 048</span>
        </a>
      </div>

      <div className="divide-y divide-[#1a1a1a]">
        {selectedMatrix.nodes.map((node, index) => (
          <details key={index} className="group py-4 cursor-pointer">
            <summary className="font-semibold text-sm md:text-base text-zinc-200 hover:text-white flex justify-between items-center list-none select-none">
              <span className="pr-4">{node.question}</span>
              <span className="text-[#258DCD] text-xs font-mono transition-transform duration-200 group-open:rotate-180 shrink-0">
                ▼
              </span>
            </summary>
            <div className="mt-3 text-xs md:text-sm text-zinc-400 leading-relaxed font-sans pl-1">
              <p>{node.answer}</p>
              <div className="mt-4 pt-2 flex items-center justify-start">
                <Link
                  href={node.target_route}
                  className="inline-flex items-center gap-2 text-xs font-mono text-[#258DCD] hover:text-[#AAD6CD] transition-colors"
                >
                  <span>{node.cta_label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
