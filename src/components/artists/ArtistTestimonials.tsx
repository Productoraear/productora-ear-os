import React from 'react';
import { Star, MessageSquare, Quote } from 'lucide-react';

export const ArtistTestimonials: React.FC = () => {
  const reviews = [
    {
      author: 'Carmen Rodríguez',
      role: 'Organizadora de Eventos en Madrid',
      text: 'Contratar a Edwin Agudelo fue la mejor decisión para la gala de aniversario de nuestro cliente. La puntualidad, los trajes impecables y la potencia sónica de la banda dejaron a todos fascinados.',
      rating: 5,
    },
    {
      author: 'Dr. Alejandro Silva',
      role: 'Director del Centro Clínico VIMUME Barcelona',
      text: 'La sinfonía de estimulación cognitiva del Colibrí Project interpretada bajo la dirección de Edwin fue un rotundo éxito. Los picos de concentración y calma clínica de los pacientes cero fueron evidentes.',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">Testimonios de Clientes</h3>
        <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">Garantía de satisfacción y fiabilidad demostrada</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {reviews.map((rev, i) => (
          <div key={i} className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group">
            <div className="absolute top-6 right-8 text-white/[0.02] group-hover:text-[#ecb613]/5 transition-colors">
              <Quote size={80} />
            </div>

            <div className="flex gap-1 text-[#ecb613]">
              {[...Array(rev.rating)].map((_, idx) => (
                <Star key={idx} size={14} fill="currentColor" />
              ))}
            </div>

            <p className="text-white/70 text-sm leading-relaxed italic relative z-10">
              "{rev.text}"
            </p>

            <div className="pt-6 border-t border-white/5 space-y-1">
              <span className="text-xs font-black uppercase text-white tracking-wider block">
                {rev.author}
              </span>
              <span className="text-[10px] text-[#ecb613] uppercase tracking-widest font-bold font-mono">
                {rev.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
